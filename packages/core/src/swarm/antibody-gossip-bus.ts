/**
 * @file antibody-gossip-bus.ts
 * Real-Time P2P Worktree Antibody Gossip Protocol.
 *
 * Propagates immune antibodies across parallel git worktrees and agent swarms
 * in real-time using SQLite WAL, eliminating duplicate cognitive failures.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

let BetterSqlite3Constructor: any = null;
try {
  const require = createRequire(import.meta.url);
  BetterSqlite3Constructor = require('better-sqlite3');
} catch {
  BetterSqlite3Constructor = null;
}

export interface SwarmAntibody {
  antibodyId: string;
  discoveredAt: string;
  worktreeOrigin: string;
  severedSymbol: string;
  culpritPackage: string;
  canonicalRemediation: string;
  confidenceScore: number;
  expiresAt: string;
}

export interface SwarmBusStatus {
  dbPath: string;
  totalAntibodies: number;
  activeWorktrees: string[];
  walMode: boolean;
  engine: 'better-sqlite3' | 'json-wal';
}

export class AntibodyGossipBus {
  private readonly dbPath: string;
  private db: any = null;
  private readonly jsonPath: string;

  constructor(customDbPath?: string, projectRoot: string = process.cwd()) {
    const defaultDir = path.resolve(projectRoot, '.terrain');
    if (!fs.existsSync(defaultDir)) {
      try {
        fs.mkdirSync(defaultDir, { recursive: true });
      } catch {}
    }

    this.dbPath = customDbPath ?? path.join(defaultDir, 'gossip.db');
    this.jsonPath = customDbPath ? `${customDbPath}.json` : path.join(defaultDir, 'gossip-fallback.json');

    this.initialize();
  }

  private initialize(): void {
    if (BetterSqlite3Constructor) {
      try {
        this.db = new BetterSqlite3Constructor(this.dbPath, { timeout: 5000 });
        this.db.pragma('journal_mode = WAL');
        this.db.pragma('synchronous = NORMAL');

        this.db.exec(`
          CREATE TABLE IF NOT EXISTS swarm_antibodies (
            antibody_id TEXT PRIMARY KEY,
            discovered_at TEXT NOT NULL,
            worktree_origin TEXT NOT NULL,
            severed_symbol TEXT NOT NULL,
            culprit_package TEXT NOT NULL,
            canonical_remediation TEXT NOT NULL,
            confidence_score REAL DEFAULT 1.0,
            expires_at TEXT NOT NULL
          );
          CREATE INDEX IF NOT EXISTS idx_pkg ON swarm_antibodies(culprit_package);
          CREATE INDEX IF NOT EXISTS idx_sym ON swarm_antibodies(severed_symbol);
        `);
        return;
      } catch {}
    }

    // JSON fallback
    if (!fs.existsSync(this.jsonPath)) {
      try {
        fs.writeFileSync(this.jsonPath, JSON.stringify({ antibodies: [] }, null, 2), 'utf8');
      } catch {}
    }
  }

  /**
   * Publishes an antibody shard to the swarm.
   */
  public publishAntibody(params: {
    severedSymbol: string;
    culpritPackage: string;
    canonicalRemediation: string;
    worktreeOrigin?: string;
    ttlDays?: number;
  }): SwarmAntibody {
    const ttlDays = params.ttlDays ?? 7;
    const now = new Date();
    const expires = new Date(now.getTime() + ttlDays * 24 * 60 * 60 * 1000);

    const antibodyId = crypto
      .createHash('sha256')
      .update(`${params.culpritPackage}:${params.severedSymbol}`)
      .digest('hex');

    const antibody: SwarmAntibody = {
      antibodyId,
      discoveredAt: now.toISOString(),
      worktreeOrigin: params.worktreeOrigin ?? path.basename(process.cwd()),
      severedSymbol: params.severedSymbol,
      culpritPackage: params.culpritPackage,
      canonicalRemediation: params.canonicalRemediation,
      confidenceScore: 1.0,
      expiresAt: expires.toISOString(),
    };

    if (this.db) {
      try {
        const stmt = this.db.prepare(`
          INSERT INTO swarm_antibodies (
            antibody_id, discovered_at, worktree_origin, severed_symbol, culprit_package, canonical_remediation, confidence_score, expires_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(antibody_id) DO UPDATE SET
            discovered_at = excluded.discovered_at,
            worktree_origin = excluded.worktree_origin,
            canonical_remediation = excluded.canonical_remediation,
            expires_at = excluded.expires_at
        `);
        stmt.run(
          antibody.antibodyId,
          antibody.discoveredAt,
          antibody.worktreeOrigin,
          antibody.severedSymbol,
          antibody.culpritPackage,
          antibody.canonicalRemediation,
          antibody.confidenceScore,
          antibody.expiresAt,
        );
        return antibody;
      } catch {}
    }

    // Fallback JSON persistence
    try {
      const data = this.readJsonFallback();
      const existingIdx = data.antibodies.findIndex((a: SwarmAntibody) => a.antibodyId === antibodyId);
      if (existingIdx >= 0) {
        data.antibodies[existingIdx] = antibody;
      } else {
        data.antibodies.push(antibody);
      }
      fs.writeFileSync(this.jsonPath, JSON.stringify(data, null, 2), 'utf8');
    } catch {}

    return antibody;
  }

  /**
   * Queries active antibodies for a package or symbol.
   */
  public queryAntibodies(filter?: { package?: string; symbol?: string }): SwarmAntibody[] {
    const nowIso = new Date().toISOString();

    if (this.db) {
      try {
        let query = 'SELECT * FROM swarm_antibodies WHERE expires_at > ?';
        const params: any[] = [nowIso];

        if (filter?.package) {
          query += ' AND culprit_package = ?';
          params.push(filter.package);
        }
        if (filter?.symbol) {
          query += ' AND severed_symbol = ?';
          params.push(filter.symbol);
        }

        const rows = this.db.prepare(query).all(...params);
        return rows.map((r: any) => ({
          antibodyId: r.antibody_id,
          discoveredAt: r.discovered_at,
          worktreeOrigin: r.worktree_origin,
          severedSymbol: r.severed_symbol,
          culpritPackage: r.culprit_package,
          canonicalRemediation: r.canonical_remediation,
          confidenceScore: r.confidence_score,
          expiresAt: r.expires_at,
        }));
      } catch {}
    }

    // JSON fallback
    const data = this.readJsonFallback();
    return data.antibodies.filter((a: SwarmAntibody) => {
      if (a.expiresAt <= nowIso) return false;
      if (filter?.package && a.culpritPackage !== filter.package) return false;
      if (filter?.symbol && a.severedSymbol !== filter.symbol) return false;
      return true;
    });
  }

  /**
   * Returns bus telemetry and status.
   */
  public getStatus(): SwarmBusStatus {
    const antibodies = this.queryAntibodies();
    const worktrees = Array.from(new Set(antibodies.map((a) => a.worktreeOrigin)));

    return {
      dbPath: this.dbPath,
      totalAntibodies: antibodies.length,
      activeWorktrees: worktrees,
      walMode: Boolean(this.db),
      engine: this.db ? 'better-sqlite3' : 'json-wal',
    };
  }

  private readJsonFallback(): { antibodies: SwarmAntibody[] } {
    try {
      if (fs.existsSync(this.jsonPath)) {
        return JSON.parse(fs.readFileSync(this.jsonPath, 'utf8'));
      }
    } catch {}
    return { antibodies: [] };
  }
}
