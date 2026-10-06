#!/usr/bin/env node

import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, '../data/tcdi-graph.db');
const DATA_DIR = path.resolve(__dirname, '../data');

/**
 * Initialize or reset the SQLite Semantic Graph Database
 */
export function initDB() {
  const db = new Database(DB_PATH);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Schema creation
  db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id TEXT PRIMARY KEY,
      vendor TEXT,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS features (
      id TEXT PRIMARY KEY,
      package_id TEXT,
      display TEXT,
      severity TEXT,
      added TEXT,
      broken TEXT,
      fixed TEXT,
      deprecated TEXT,
      removed TEXT,
      experimental TEXT,
      dev_dance TEXT,
      decommission_at TEXT,
      source_url TEXT,
      heat_score INTEGER,
      FOREIGN KEY(package_id) REFERENCES packages(id)
    );

    CREATE TABLE IF NOT EXISTS combos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      package_a TEXT,
      range_a TEXT,
      package_b TEXT,
      range_b TEXT,
      status TEXT,
      title TEXT,
      what_broke TEXT,
      forces_or_breaks TEXT,
      fixed_in TEXT,
      source_url TEXT
    );
  `);

  return db;
}

export function syncShardsToDB() {
  const db = initDB();
  
  // Clear existing
  db.exec(`
    DELETE FROM combos;
    DELETE FROM features;
    DELETE FROM packages;
  `);

  const insertPkg = db.prepare(`INSERT INTO packages (id, vendor, category) VALUES (?, ?, ?)`);
  const insertFeat = db.prepare(`
    INSERT INTO features (
      id, package_id, display, severity, added, broken, fixed, deprecated, removed, experimental,
      dev_dance, decommission_at, source_url, heat_score
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Load Packages & Features
  const pkgDir = path.join(DATA_DIR, 'packages');
  const files = fs.readdirSync(pkgDir).filter(f => f.endsWith('.json'));

  db.transaction(() => {
    for (const f of files) {
      const pkgName = f.replace('.json', '');
      const data = JSON.parse(fs.readFileSync(path.join(pkgDir, f), 'utf8'));

      insertPkg.run(pkgName, data.vendor || '', data.category || '');

      for (const [featId, feat] of Object.entries(data.features || {})) {
        const ms = feat.transition_milestones || {};
        const rules = feat.rules || {};
        const meta = feat._chronos_meta || {};

        insertFeat.run(
          featId,
          pkgName,
          feat.display || '',
          feat.impact_severity || 'MEDIUM',
          ms.added || null,
          ms.broken || null,
          ms.fixed || null,
          ms.deprecated || null,
          ms.removed || null,
          ms.experimental || null,
          rules.dev_dance || null,
          rules.decommission_at || null,
          meta.source_url || null,
          meta.heat_score || 0
        );
      }
    }
  })();

  // Load Combos
  const combosPath = path.join(DATA_DIR, 'compat/combos.json');
  if (fs.existsSync(combosPath)) {
    const combos = JSON.parse(fs.readFileSync(combosPath, 'utf8')).combos || [];
    const insertCombo = db.prepare(`
      INSERT INTO combos (
        package_a, range_a, package_b, range_b, status, title, what_broke, forces_or_breaks, fixed_in, source_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    db.transaction(() => {
      for (const c of combos) {
        insertCombo.run(
          c.package_a, c.range_a, c.package_b, c.range_b, c.status,
          c.title, c.what_broke, c.forces_or_breaks, c.fixed_in, c.source_url
        );
      }
    })();
  }

  return db;
}

// Support CLI execution to resync
if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('graph-db.mjs')) {
  console.log("Synchronizing flat JSON shards to SQLite Semantic Graph...");
  syncShardsToDB();
  console.log("Database initialized at data/tcdi-graph.db");
}
