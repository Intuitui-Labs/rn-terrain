/**
 * @file sqlite-client.ts
 * Bitemporal SQLite Database Client for RN-Terrain Core.
 *
 * Provides typed query operations for package catalog, version epochs,
 * API symbol lifecycles, and compatibility slices.
 */

import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  MASTER_DDL,
  type PackageRecord,
  type PackageVersionRecord,
  type ApiSymbolRecord,
  type CompatibilityComboRecord,
  type CompatibilityMatrixRecord,
  type EvalScoreRecord,
  type DecisionActionRecord
} from './canonical-schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_DB_PATH = path.resolve(__dirname, '../../data/rn-terrain-canonical.db');

export class CanonicalDatabase {
  public readonly db: InstanceType<typeof Database>;

  constructor(dbPath: string = DEFAULT_DB_PATH) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.db = new Database(dbPath);
    this.db.pragma('foreign_keys = ON');
    this.db.pragma('journal_mode = WAL');
    this.initializeSchema();
  }

  private initializeSchema(): void {
    this.db.exec(MASTER_DDL);
  }

  public close(): void {
    this.db.close();
  }

  // ─── Packages ───────────────────────────────────────────────────────────────

  public upsertPackage(pkg: PackageRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO packages (id, vendor, category, tier, repository_url, documentation_url, created_at)
      VALUES (@id, @vendor, @category, @tier, @repository_url, @documentation_url, @created_at)
      ON CONFLICT(id) DO UPDATE SET
        vendor = excluded.vendor,
        category = excluded.category,
        tier = excluded.tier,
        repository_url = excluded.repository_url,
        documentation_url = excluded.documentation_url
    `);
    stmt.run(pkg);
  }

  public getPackage(id: string): PackageRecord | undefined {
    const stmt = this.db.prepare('SELECT * FROM packages WHERE id = ?');
    return stmt.get(id) as PackageRecord | undefined;
  }

  public getAllPackages(): PackageRecord[] {
    const stmt = this.db.prepare('SELECT * FROM packages ORDER BY id ASC');
    return stmt.all() as PackageRecord[];
  }

  // ─── Package Versions (Bitemporal) ──────────────────────────────────────────

  public upsertVersion(v: PackageVersionRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO package_versions (
        package_id, version, valid_from_epoch, valid_to_epoch,
        react_native_min, react_native_max, supports_new_arch, tarball_url
      ) VALUES (
        @package_id, @version, @valid_from_epoch, @valid_to_epoch,
        @react_native_min, @react_native_max, @supports_new_arch, @tarball_url
      )
      ON CONFLICT(package_id, version) DO UPDATE SET
        valid_from_epoch = excluded.valid_from_epoch,
        valid_to_epoch = excluded.valid_to_epoch,
        react_native_min = excluded.react_native_min,
        react_native_max = excluded.react_native_max,
        supports_new_arch = excluded.supports_new_arch,
        tarball_url = excluded.tarball_url
    `);
    stmt.run(v);
  }

  public getVersions(packageId: string): PackageVersionRecord[] {
    const stmt = this.db.prepare(`
      SELECT * FROM package_versions 
      WHERE package_id = ? 
      ORDER BY valid_from_epoch DESC
    `);
    return stmt.all(packageId) as PackageVersionRecord[];
  }

  // ─── API Symbols & Lifecycle ────────────────────────────────────────────────

  public upsertSymbol(sym: ApiSymbolRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO api_symbols (
        package_id, version, symbol_identifier, symbol_type, status,
        replacement_symbol, replacement_package, codemod_available,
        codemod_rule_id, documentation_anchor, valid_from_epoch, valid_to_epoch
      ) VALUES (
        @package_id, @version, @symbol_identifier, @symbol_type, @status,
        @replacement_symbol, @replacement_package, @codemod_available,
        @codemod_rule_id, @documentation_anchor, @valid_from_epoch, @valid_to_epoch
      )
    `);
    stmt.run(sym);
  }

  public getSymbols(packageId: string, version: string): ApiSymbolRecord[] {
    const stmt = this.db.prepare(`
      SELECT * FROM api_symbols 
      WHERE package_id = ? AND version = ?
    `);
    return stmt.all(packageId, version) as ApiSymbolRecord[];
  }

  public findSeveredSymbols(packageId: string, version: string, identifiers: string[]): ApiSymbolRecord[] {
    if (identifiers.length === 0) return [];
    const placeholders = identifiers.map(() => '?').join(',');
    const stmt = this.db.prepare(`
      SELECT * FROM api_symbols 
      WHERE package_id = ? AND version = ?
        AND symbol_identifier IN (${placeholders})
        AND status IN ('UNSUPPORTED_REMOVED', 'BROKEN_DEFECTIVE')
    `);
    return stmt.all(packageId, version, ...identifiers) as ApiSymbolRecord[];
  }

  // ─── Compatibility Matrix ───────────────────────────────────────────────────

  public upsertCombo(combo: CompatibilityComboRecord): number {
    const stmt = this.db.prepare(`
      INSERT INTO compatibility_combos (combo_key, package_a, package_b, category)
      VALUES (@combo_key, @package_a, @package_b, @category)
      ON CONFLICT(combo_key) DO UPDATE SET
        category = excluded.category
      RETURNING id
    `);
    const res = stmt.get(combo) as { id: number };
    return res.id;
  }

  public insertMatrixSlice(slice: CompatibilityMatrixRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO compatibility_matrix (
        combo_id, version_a_range, version_b_range, status, collision_severity,
        title, what_broke, forces_or_breaks, mitigation_strategy, fixed_in_version,
        valid_from_epoch, valid_to_epoch
      ) VALUES (
        @combo_id, @version_a_range, @version_b_range, @status, @collision_severity,
        @title, @what_broke, @forces_or_breaks, @mitigation_strategy, @fixed_in_version,
        @valid_from_epoch, @valid_to_epoch
      )
    `);
    stmt.run(slice);
  }

  public getCompatibility(comboKey: string): CompatibilityMatrixRecord[] {
    const stmt = this.db.prepare(`
      SELECT m.* FROM compatibility_matrix m
      JOIN compatibility_combos c ON m.combo_id = c.id
      WHERE c.combo_key = ?
      ORDER BY m.collision_severity DESC
    `);
    return stmt.all(comboKey) as CompatibilityMatrixRecord[];
  }

  // ─── OpenEval Scores ────────────────────────────────────────────────────────

  public recordEvalScore(score: EvalScoreRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO eval_scores (
        package_id, version, overall_score, health_score, compatibility_score,
        api_modernity_score, arch_drift_score, substrate_rigor_score,
        maintenance_cadence_score, weight_profile_used, grounded_citations_json
      ) VALUES (
        @package_id, @version, @overall_score, @health_score, @compatibility_score,
        @api_modernity_score, @arch_drift_score, @substrate_rigor_score,
        @maintenance_cadence_score, @weight_profile_used, @grounded_citations_json
      )
    `);
    stmt.run(score);
  }

  public getLatestScore(packageId: string, version?: string): EvalScoreRecord | undefined {
    let query = 'SELECT * FROM eval_scores WHERE package_id = ?';
    const params: string[] = [packageId];
    if (version) {
      query += ' AND version = ?';
      params.push(version);
    }
    query += ' ORDER BY eval_run_epoch DESC LIMIT 1';
    const stmt = this.db.prepare(query);
    return stmt.get(...params) as EvalScoreRecord | undefined;
  }

  // ─── Decision Actions ───────────────────────────────────────────────────────

  public recordDecision(action: DecisionActionRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO decision_actions (
        entity_type, entity_id, query_type, decision_primitive,
        confidence_score, brier_loss, engine_used, rationale_summary
      ) VALUES (
        @entity_type, @entity_id, @query_type, @decision_primitive,
        @confidence_score, @brier_loss, @engine_used, @rationale_summary
      )
    `);
    stmt.run(action);
  }
}
