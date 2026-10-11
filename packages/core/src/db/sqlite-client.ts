/**
 * @file sqlite-client.ts
 * Bitemporal SQLite Database Client for RN-Terrain Core.
 *
 * Provides typed query operations for package catalog, version epochs,
 * API symbol lifecycles, and compatibility slices.
 */

import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type DatabaseType from 'better-sqlite3';
import type { TerrainCatalogPort, PackageFilter } from './catalog-port.js';
import { EmbeddedCatalogAdapter } from './embedded-catalog.js';
import {
  MASTER_DDL,
  type PackageRecord,
  type PackageVersionRecord,
  type ApiSymbolRecord,
  type CompatibilityComboRecord,
  type CompatibilityMatrixRecord,
  type EvalScoreRecord,
  type DecisionActionRecord,
  type DevToolRecord,
  type GranularCapabilityRecord,
  type PackageCapabilityRecord,
  type TechnologyRadarRecord
} from './canonical-schema.js';

let BetterSqlite3Constructor: typeof DatabaseType | null = null;
try {
  const require = createRequire(import.meta.url);
  BetterSqlite3Constructor = require('better-sqlite3');
} catch {
  BetterSqlite3Constructor = null;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_DEV_DB_PATH = path.resolve(__dirname, '../../data/rn-terrain-canonical.db');
const USER_CACHE_DB_PATH = path.join(os.homedir(), '.rn-terrain', 'terrain.db');

export function resolveDefaultDatabasePath(): string {
  if (process.env.RN_TERRAIN_DB_PATH) {
    return process.env.RN_TERRAIN_DB_PATH;
  }
  if (fs.existsSync(LOCAL_DEV_DB_PATH)) {
    return LOCAL_DEV_DB_PATH;
  }
  return USER_CACHE_DB_PATH;
}

export class CanonicalDatabase implements TerrainCatalogPort {
  public readonly db: InstanceType<typeof DatabaseType>;

  constructor(dbPath: string = resolveDefaultDatabasePath()) {
    if (!BetterSqlite3Constructor) {
      throw new Error(
        'better-sqlite3 native driver is not available in this environment. ' +
        'Use createCatalog({ inMemoryOnly: true }) or EmbeddedCatalogAdapter instead.'
      );
    }
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch {
        // Handled if restricted
      }
    }
    this.db = new BetterSqlite3Constructor(dbPath);
    this.db.pragma('foreign_keys = ON');
    this.db.pragma('journal_mode = WAL');
    this.initializeSchema();
  }

  private initializeSchema(): void {
    this.db.exec(MASTER_DDL);
    this.seedDefaultsIfEmpty();
  }

  private seedDefaultsIfEmpty(): void {
    try {
      const countRow = this.db.prepare('SELECT COUNT(*) as count FROM packages').get() as { count: number };
      if (countRow && countRow.count === 0) {
        const embedded = new EmbeddedCatalogAdapter();
        // Seed packages
        for (const pkg of embedded.getAllPackages()) {
          this.upsertPackage(pkg);
        }
        // Seed versions & symbols
        for (const pkg of embedded.getAllPackages()) {
          for (const ver of embedded.getVersions(pkg.id)) {
            this.upsertVersion(ver);
          }
          for (const sym of embedded.getSymbols(pkg.id)) {
            this.upsertSymbol(sym);
          }
        }
        // Seed radar
        for (const rad of embedded.getAllRadarRecords()) {
          this.upsertRadarRecord(rad);
        }
        // Seed dev tools
        for (const tool of embedded.getAllDevTools()) {
          this.upsertDevTool(tool);
        }
      }
    } catch {
      // Best-effort bootstrap; ignore if in restricted/read-only environment
    }
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

  // ─── Developer Ecosystem & Dev Tools ────────────────────────────────────────

  public upsertDevTool(tool: DevToolRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO dev_tools_ecosystem (
        id, category, status, primary_advantage, rn_compatibility_notes, docs_url
      ) VALUES (
        @id, @category, @status, @primary_advantage, @rn_compatibility_notes, @docs_url
      )
      ON CONFLICT(id) DO UPDATE SET
        category = excluded.category,
        status = excluded.status,
        primary_advantage = excluded.primary_advantage,
        rn_compatibility_notes = excluded.rn_compatibility_notes,
        docs_url = excluded.docs_url
    `);
    stmt.run(tool);
  }

  public getDevTool(id: string): DevToolRecord | undefined {
    const stmt = this.db.prepare('SELECT * FROM dev_tools_ecosystem WHERE id = ?');
    return stmt.get(id) as DevToolRecord | undefined;
  }

  public getAllDevTools(): DevToolRecord[] {
    const stmt = this.db.prepare('SELECT * FROM dev_tools_ecosystem ORDER BY category, id');
    return stmt.all() as DevToolRecord[];
  }

  // ─── Granular Capabilities ──────────────────────────────────────────────────

  public upsertCapability(cap: GranularCapabilityRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO granular_capabilities (
        id, name, category, description, level, fabric_native_required, alternative_capabilities
      ) VALUES (
        @id, @name, @category, @description, @level, @fabric_native_required, @alternative_capabilities
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        description = excluded.description,
        level = excluded.level,
        fabric_native_required = excluded.fabric_native_required,
        alternative_capabilities = excluded.alternative_capabilities
    `);
    stmt.run({
      ...cap,
      description: cap.description ?? null,
      alternative_capabilities: cap.alternative_capabilities ?? null
    });
  }

  public linkPackageCapability(link: PackageCapabilityRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO package_capabilities (
        package_id, version_introduced, version_deprecated, version_severed,
        capability_id, quality_tier, performance_profile, caveats
      ) VALUES (
        @package_id, @version_introduced, @version_deprecated, @version_severed,
        @capability_id, @quality_tier, @performance_profile, @caveats
      )
      ON CONFLICT(package_id, capability_id, version_introduced) DO UPDATE SET
        version_deprecated = excluded.version_deprecated,
        version_severed = excluded.version_severed,
        quality_tier = excluded.quality_tier,
        performance_profile = excluded.performance_profile,
        caveats = excluded.caveats
    `);
    stmt.run({
      ...link,
      version_deprecated: link.version_deprecated ?? null,
      version_severed: link.version_severed ?? null,
      performance_profile: link.performance_profile ?? null,
      caveats: link.caveats ?? null
    });
  }

  public getCapabilitiesByPackage(packageId: string): (GranularCapabilityRecord & { version_introduced: string; quality_tier: string })[] {
    const stmt = this.db.prepare(`
      SELECT c.*, pc.version_introduced, pc.quality_tier
      FROM granular_capabilities c
      JOIN package_capabilities pc ON c.id = pc.capability_id
      WHERE pc.package_id = ?
      ORDER BY c.category, c.name
    `);
    return stmt.all(packageId) as (GranularCapabilityRecord & { version_introduced: string; quality_tier: string })[];
  }

  public getPackagesByCapability(capabilityId: string): (PackageCapabilityRecord & { package_name: string })[] {
    const stmt = this.db.prepare(`
      SELECT pc.*, pc.package_id as package_name
      FROM package_capabilities pc
      WHERE pc.capability_id = ?
      ORDER BY pc.quality_tier, pc.package_id
    `);
    return stmt.all(capabilityId) as (PackageCapabilityRecord & { package_name: string })[];
  }

  public getAllCapabilities(): GranularCapabilityRecord[] {
    const stmt = this.db.prepare('SELECT * FROM granular_capabilities ORDER BY category, name');
    return stmt.all() as GranularCapabilityRecord[];
  }

  // ─── Technology Radar ───────────────────────────────────────────────────────

  public upsertRadarRecord(record: TechnologyRadarRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO technology_radar (
        id, subject, subject_type, verdict, confidence, category,
        use_case, problem, decision, revisit_when, metadata_json, updated_at
      ) VALUES (
        @id, @subject, @subject_type, @verdict, @confidence, @category,
        @use_case, @problem, @decision, @revisit_when, @metadata_json, @updated_at
      )
      ON CONFLICT(id) DO UPDATE SET
        subject = excluded.subject,
        subject_type = excluded.subject_type,
        verdict = excluded.verdict,
        confidence = excluded.confidence,
        category = excluded.category,
        use_case = excluded.use_case,
        problem = excluded.problem,
        decision = excluded.decision,
        revisit_when = excluded.revisit_when,
        metadata_json = excluded.metadata_json,
        updated_at = excluded.updated_at
    `);
    stmt.run({
      ...record,
      use_case: record.use_case ?? null,
      problem: record.problem ?? null,
      decision: record.decision ?? null,
      revisit_when: record.revisit_when ?? null,
      metadata_json: record.metadata_json ?? null,
      updated_at: record.updated_at ?? Math.floor(Date.now() / 1000)
    });
  }

  public getAllRadarRecords(): TechnologyRadarRecord[] {
    const stmt = this.db.prepare('SELECT * FROM technology_radar ORDER BY verdict, id ASC');
    return stmt.all() as TechnologyRadarRecord[];
  }

  // ─── TerrainCatalogPort Protocol Aliases ────────────────────────────────────

  public listPackages(filter?: PackageFilter): PackageRecord[] {
    let pkgs = this.getAllPackages();
    if (filter?.vendor) pkgs = pkgs.filter((p) => p.vendor === filter.vendor);
    if (filter?.category) pkgs = pkgs.filter((p) => p.category === filter.category);
    if (filter?.tier) pkgs = pkgs.filter((p) => p.tier === filter.tier);
    return pkgs;
  }

  public upsertPackageVersion(v: PackageVersionRecord): void {
    this.upsertVersion(v);
  }

  public getPackageVersions(packageId: string): PackageVersionRecord[] {
    return this.getVersions(packageId);
  }

  public upsertApiSymbol(s: ApiSymbolRecord): void {
    this.upsertSymbol(s);
  }

  public getApiSymbols(packageId: string, version?: string): ApiSymbolRecord[] {
    if (version) {
      return this.getSymbols(packageId, version);
    }
    const stmt = this.db.prepare('SELECT * FROM api_symbols WHERE package_id = ?');
    return stmt.all(packageId) as ApiSymbolRecord[];
  }

  public getSeveredSymbols(packageId: string): ApiSymbolRecord[] {
    const stmt = this.db.prepare(`
      SELECT * FROM api_symbols 
      WHERE package_id = ? AND status IN ('UNSUPPORTED_REMOVED', 'BROKEN_DEFECTIVE')
    `);
    return stmt.all(packageId) as ApiSymbolRecord[];
  }

  public upsertCompatibilityMatrix(m: CompatibilityMatrixRecord): void {
    this.insertMatrixSlice(m);
  }

  public getCompatibilityMatrix(packageA: string, packageB: string): CompatibilityMatrixRecord[] {
    const comboKey = `${packageA}__${packageB}`;
    return this.getCompatibility(comboKey);
  }

  public getRadarRecords(verdict?: string): TechnologyRadarRecord[] {
    const all = this.getAllRadarRecords();
    if (!verdict) return all;
    return all.filter((r) => r.verdict.toUpperCase() === verdict.toUpperCase());
  }

  public listDevTools(category?: string): DevToolRecord[] {
    const all = this.getAllDevTools();
    if (!category) return all;
    return all.filter((t) => t.category === category);
  }

  public upsertGranularCapability(c: GranularCapabilityRecord): void {
    this.upsertCapability(c);
  }

  public listGranularCapabilities(category?: string): GranularCapabilityRecord[] {
    const all = this.getAllCapabilities();
    if (!category) return all;
    return all.filter((c) => c.category === category);
  }

  public upsertPackageCapability(m: PackageCapabilityRecord): void {
    this.linkPackageCapability({
      package_id: m.package_id,
      version_introduced: m.version_introduced,
      version_deprecated: m.version_deprecated,
      version_severed: m.version_severed,
      capability_id: m.capability_id,
      quality_tier: m.quality_tier,
      performance_profile: m.performance_profile,
      caveats: m.caveats,
    });
  }

  public getProvidersForCapability(
    capabilityId: string
  ): { packageId: string; qualityTier: string; performanceProfile: string | null }[] {
    const pkgs = this.getPackagesByCapability(capabilityId);
    return pkgs.map((p) => ({
      packageId: p.package_id,
      qualityTier: p.quality_tier,
      performanceProfile: p.performance_profile ?? null,
    }));
  }

  public getLatestVersion(packageId: string): PackageVersionRecord | null {
    const versions = this.getVersions(packageId);
    return versions[0] || null;
  }

  public getRadarRecord(id: string): TechnologyRadarRecord | null {
    const stmt = this.db.prepare('SELECT * FROM technology_radar WHERE id = ?');
    return (stmt.get(id) as TechnologyRadarRecord | undefined) || null;
  }

  public getPackageCapabilities(packageId: string): PackageCapabilityRecord[] {
    const stmt = this.db.prepare('SELECT * FROM package_capabilities WHERE package_id = ?');
    return stmt.all(packageId) as PackageCapabilityRecord[];
  }
}

/**
 * Universal catalog factory: Returns a TerrainCatalogPort instance.
 * Automatically falls back to EmbeddedCatalogAdapter if SQLite fails to initialize.
 */
export function createCatalog(options?: { inMemoryOnly?: boolean; dbPath?: string }): TerrainCatalogPort {
  if (options?.inMemoryOnly) {
    return new EmbeddedCatalogAdapter();
  }
  try {
    return new CanonicalDatabase(options?.dbPath);
  } catch {
    return new EmbeddedCatalogAdapter();
  }
}

