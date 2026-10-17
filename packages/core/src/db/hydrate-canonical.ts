/**
 * @file hydrate-canonical.ts
 * Sovereign Hydration Engine for RN-Terrain Canonical SQLite Database.
 *
 * Idempotently applies MASTER_DDL and populates:
 *   1. package_changes (80 Chronos capability-tagged rows from package_change.csv)
 *   2. compatibility_combos & compatibility_matrix (32 combos from COMBOS.md)
 *   3. training_attractors (8 LLM bias & sacred pin attractors)
 *   4. stack_baselines (CURRENT Expo 58.0.3 / RN 0.88.0-rc.3 + HISTORY)
 *   5. package_overrides (Sacred pins & leading edge pins)
 *   6. fixed_later (62 upstream bug tracking records)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { MASTER_DDL } from './canonical-schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target database
const DB_PATH = path.resolve(__dirname, '../../data/rn-terrain-canonical.db');

// Source artifact paths in scratch
const SCRATCH_BASE = 'C:/Users/Naween/.gemini/antigravity/brain/009aedad-914f-4617-b733-35153c07b84f/scratch/extracted';
const CHANGES_CSV_PATH = path.join(SCRATCH_BASE, 'historian/historian/work/rn-packages/changes/package_change.csv');
const COMBOS_MD_PATH = path.join(SCRATCH_BASE, 'chronos/work/home/box/agent-data/agents/f2558ebb-acd0-49d3-a53b-348ce3b0d98b/rn-terrain/compat/COMBOS.md');
const FIXED_LATER_JSON_PATH = path.join(SCRATCH_BASE, 'chronos/work/home/box/agent-data/agents/f2558ebb-acd0-49d3-a53b-348ce3b0d98b/rn-terrain/navigator/fixed-later-index.json');

export function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const firstLine = lines[0];
  if (!firstLine) return [];
  const headers = parseCSVLine(firstLine);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const values = parseCSVLine(line);
    if (values.length === headers.length) {
      const row: Record<string, string> = {};
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        const val = values[j];
        if (header !== undefined && val !== undefined) {
          row[header] = val;
        }
      }
      rows.push(row);
    }
  }
  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function hydrateCanonicalDatabase(dbPath: string = DB_PATH): void {
  console.log(`[Hydration] Opening canonical SQLite database at ${dbPath}...`);
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // 1. Ensure all tables exist
  console.log('[Hydration] Applying MASTER_DDL schemas & indexes...');
  db.exec(MASTER_DDL);

  const transaction = db.transaction(() => {
    // 2. Ingest package_changes
    if (fs.existsSync(CHANGES_CSV_PATH)) {
      console.log(`[Hydration] Reading Chronos change stream from ${CHANGES_CSV_PATH}...`);
      const csvRaw = fs.readFileSync(CHANGES_CSV_PATH, 'utf-8');
      const rows = parseCSV(csvRaw);
      console.log(`[Hydration] Ingesting ${rows.length} package changes...`);

      db.prepare('DELETE FROM package_changes').run();
      const insertChange = db.prepare(`
        INSERT INTO package_changes (
          package_uuid, npm_name, from_version, to_version,
          release_date, change_kind, summary, affects_naveen,
          source_url, verified_at, capability_id
        ) VALUES (
          @package_uuid, @npm_name, @from_version, @to_version,
          @release_date, @change_kind, @summary, @affects_naveen,
          @source_url, @verified_at, @capability_id
        )
      `);

      for (const r of rows) {
        insertChange.run({
          package_uuid: r.package_uuid,
          npm_name: r.npm_name,
          from_version: r.from_version,
          to_version: r.to_version,
          release_date: r.release_date || null,
          change_kind: r.change_kind,
          summary: r.summary,
          affects_naveen: r.affects_naveen,
          source_url: r.source_url || null,
          verified_at: r.verified_at,
          capability_id: r.capability_id || null,
        });
      }
    } else {
      console.warn(`[Hydration] Warning: ${CHANGES_CSV_PATH} not found.`);
    }

    // 3. Ingest stack_baselines
    console.log('[Hydration] Seeding stack_baselines (CURRENT and HISTORY)...');
    const insertBaseline = db.prepare(`
      INSERT OR REPLACE INTO stack_baselines (code, expo_sdk, rn_version, react_version, as_of)
      VALUES (@code, @expo_sdk, @rn_version, @react_version, @as_of)
    `);

    insertBaseline.run({
      code: 'CURRENT',
      expo_sdk: '58.0.3',
      rn_version: '0.88.0-rc.3',
      react_version: '19.3.0',
      as_of: '2026-10-05T23:14+05:30',
    });

    insertBaseline.run({
      code: 'HISTORY',
      expo_sdk: '57.0.26',
      rn_version: '0.87.1',
      react_version: '19.0.0',
      as_of: '2026-08-29T12:00:00+05:30',
    });

    // 4. Ingest package_overrides (Sacred pins)
    console.log('[Hydration] Seeding package_overrides & sacred pins...');
    const insertOverride = db.prepare(`
      INSERT OR REPLACE INTO package_overrides (package_name, pinned_version, is_sacred, intent, intent_source)
      VALUES (@package_name, @pinned_version, @is_sacred, @intent, @intent_source)
    `);

    const sacredPins = [
      { name: 'react-native-reanimated', version: '4.7.1', intent: 'New Architecture Fabric layout animations proxy & iOS UIKit scene support' },
      { name: 'react-native-worklets', version: '0.13.0', intent: 'Required peer of Reanimated 4.7; worklet runtime decoupling' },
      { name: 'react-native-gesture-handler', version: '3.3.0', intent: 'New Architecture native gesture detector handlers' },
      { name: 'react-native-mmkv', version: '4.3.2', intent: 'Nitro Modules C++ synchronous storage engine' },
      { name: 'react-native-nitro-modules', version: '0.37.1', intent: 'C++ Hybrid Object core for MMKV and native modules' },
      { name: '@shopify/react-native-skia', version: '3.0.2', intent: 'High-performance 2D canvas with Graphite/WebGPU' },
      { name: 'expo', version: '58.0.3', intent: 'Expo SDK 58 beta leading-edge canary' },
      { name: 'react-native', version: '0.88.0-rc.3', intent: 'React Native New Architecture RC baseline' },
      { name: 'react', version: '19.3.0', intent: 'React 19 compiler support' },
    ];

    for (const pin of sacredPins) {
      insertOverride.run({
        package_name: pin.name,
        pinned_version: pin.version,
        is_sacred: 1,
        intent: pin.intent,
        intent_source: 'curated_sacred_pins',
      });
    }

    // 5. Ingest training_attractors (LLM bias radar)
    console.log('[Hydration] Seeding training_attractors (Training-Gravity Radar)...');
    const insertAttractor = db.prepare(`
      INSERT OR REPLACE INTO training_attractors (id, npm_name, attractor_kind, narrative, rebuttal, evidence_url, checked_at)
      VALUES (@id, @npm_name, @attractor_kind, @narrative, @rebuttal, @evidence_url, @checked_at)
    `);

    const attractors = [
      {
        id: 'watermelondb-fame',
        npm_name: '@nozbe/watermelondb',
        attractor_kind: 'name_louder_than_health',
        narrative: "Agent suggests WatermelonDB from training fame (stars / 'standard RN DB') despite weaker maintenance / New Arch unknown — Gurudevi sync path is PowerSync.",
        rebuttal: "Compare publish lag, RN Directory modifiers (Not updated recently / New Architecture support unknown / Lots of open issues) vs PowerSync freshness. Contrast package: @powersync/react-native (in stack).",
        evidence_url: 'file:docs/dogfood/PHASE1_DOGFOOD.md#PowerSync-vs-WatermelonDB-contrast',
        checked_at: new Date().toISOString(),
      },
      {
        id: 'reanimated-comove-worklets',
        npm_name: 'react-native-reanimated',
        attractor_kind: 'incomplete_peer_comove',
        narrative: "Agent installs Reanimated 4.x but forgets to co-install react-native-worklets@0.13.0, causing immediate runtime crash.",
        rebuttal: "Reanimated 4 decoupled worklets into standalone package react-native-worklets. Co-install react-native-worklets@^0.13.0.",
        evidence_url: 'https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/',
        checked_at: new Date().toISOString(),
      },
      {
        id: 'expo-fix-on-sacred-reanimated',
        npm_name: 'react-native-reanimated',
        attractor_kind: 'force_install_muscle_memory',
        narrative: 'Agent attempts `npx expo install --fix` which forces downgrade to legacy Reanimated.',
        rebuttal: 'NEVER run `expo install --fix` against sacred pins. Sacred pins encode known-good native binary combinations for this New-Arch stack.',
        evidence_url: 'file:docs/stack-map/SACRED_PIN_POLICY.md',
        checked_at: new Date().toISOString(),
      },
      {
        id: 'expo-fix-on-sacred-worklets',
        npm_name: 'react-native-worklets',
        attractor_kind: 'force_install_muscle_memory',
        narrative: 'Agent attempts `expo install --fix` resetting worklets version.',
        rebuttal: 'Sacred pin holds 0.13.0; do not let Expo resolver overwrite.',
        evidence_url: 'file:docs/stack-map/SACRED_PIN_POLICY.md',
        checked_at: new Date().toISOString(),
      },
      {
        id: 'expo-fix-on-sacred-rngh',
        npm_name: 'react-native-gesture-handler',
        attractor_kind: 'force_install_muscle_memory',
        narrative: 'Agent runs `npx expo install --fix` touching RNGH 3.3.0 pin.',
        rebuttal: 'RNGH 3.3.0 is locked for React Native 0.88-rc.3 Fabric gestures.',
        evidence_url: 'file:docs/stack-map/SACRED_PIN_POLICY.md',
        checked_at: new Date().toISOString(),
      },
      {
        id: 'expo-fix-on-sacred-mmkv',
        npm_name: 'react-native-mmkv',
        attractor_kind: 'force_install_muscle_memory',
        narrative: 'Agent runs `expo install --fix` downgrading MMKV to 3.x.',
        rebuttal: 'MMKV 4.3.2 is locked with Nitro Modules C++ engine; 3.x is legacy JSI.',
        evidence_url: 'file:docs/stack-map/SACRED_PIN_POLICY.md',
        checked_at: new Date().toISOString(),
      },
      {
        id: 'expo-fix-on-sacred-nitro',
        npm_name: 'react-native-nitro-modules',
        attractor_kind: 'force_install_muscle_memory',
        narrative: 'Agent runs `expo install --fix` touching nitro-modules.',
        rebuttal: 'Nitro Modules 0.37.1 is the required C++ component core for MMKV on New Arch.',
        evidence_url: 'file:docs/stack-map/SACRED_PIN_POLICY.md',
        checked_at: new Date().toISOString(),
      },
      {
        id: 'expo-fix-on-sacred-skia',
        npm_name: '@shopify/react-native-skia',
        attractor_kind: 'force_install_muscle_memory',
        narrative: 'Agent runs `expo install --fix` touching Skia 3.0.2 pin.',
        rebuttal: 'Skia 3.0.2 includes Graphite/WebGPU support on New Architecture.',
        evidence_url: 'file:docs/stack-map/SACRED_PIN_POLICY.md',
        checked_at: new Date().toISOString(),
      },
    ];

    for (const a of attractors) {
      insertAttractor.run(a);
    }

    // 6. Ingest COMBOS.md
    if (fs.existsSync(COMBOS_MD_PATH)) {
      console.log(`[Hydration] Parsing verified COMBOS from ${COMBOS_MD_PATH}...`);
      const mdContent = fs.readFileSync(COMBOS_MD_PATH, 'utf-8');
      const comboBlocks = mdContent.split(/^### Combo:\s*/m).slice(1);

      db.prepare('DELETE FROM compatibility_combos').run();
      db.prepare('DELETE FROM compatibility_matrix').run();

      const insertCombo = db.prepare(`
        INSERT OR REPLACE INTO compatibility_combos (combo_key, package_a, package_b, category)
        VALUES (@combo_key, @package_a, @package_b, @category)
      `);

      const insertMatrix = db.prepare(`
        INSERT INTO compatibility_matrix (
          combo_id, version_a_range, version_b_range, status,
          collision_severity, title, what_broke, forces_or_breaks,
          mitigation_strategy, fixed_in_version, valid_from_epoch
        ) VALUES (
          @combo_id, @version_a_range, @version_b_range, @status,
          @collision_severity, @title, @what_broke, @forces_or_breaks,
          @mitigation_strategy, @fixed_in_version, @valid_from_epoch
        )
      `);

      let comboCount = 0;
      for (const block of comboBlocks) {
        const lines = block.split('\n');
        const firstLine = lines[0];
        const titleLine = firstLine ? firstLine.trim() : '';
        const getField = (name: string): string => {
          const match = block.match(new RegExp(`^- \\*\\*${name}\\*\\*:\\s*(.+)$`, 'm'));
          return match && match[1] ? match[1].trim() : '';
        };

        const kind = getField('kind').replace(/`/g, '');
        const whatBroke = getField('what_broke');
        const forcesOrBreaks = getField('forces_or_breaks');
        const fixedIn = getField('fixed_in_or_still_open');
        const sourceUrl = getField('source_url');

        // Extract package A and package B from title (e.g., "Reanimated `4.7.x` + Worklets `0.13.x`")
        const segs = titleLine.split(/\s\+\s/);
        let pkgA = 'react-native-reanimated';
        let verA = '*';
        let pkgB = 'react-native-worklets';
        let verB = '*';

        const seg0 = segs[0];
        const seg1 = segs[1];
        if (seg0 && seg1) {
          const mA = seg0.match(/(.+?)\s+`([^`]+)`/);
          const mB = seg1.match(/(.+?)\s+`([^`]+)`/);
          if (mA && mA[1] && mA[2]) {
            pkgA = mA[1].toLowerCase().includes('reanimated') ? 'react-native-reanimated' : mA[1].trim();
            verA = mA[2];
          }
          if (mB && mB[1] && mB[2]) {
            pkgB = mB[1].toLowerCase().includes('worklets') ? 'react-native-worklets' : mB[1].trim();
            verB = mB[2];
          }
        }

        const isKnownGood = kind === 'known-good';
        const status = isKnownGood ? 'COMPATIBLE' : 'BREAKING_COLLISION';
        const severity = isKnownGood ? 0 : 8;

        const comboResult = insertCombo.run({
          combo_key: `${pkgA}:${pkgB}:${verA}:${verB}:${comboCount}`,
          package_a: pkgA,
          package_b: pkgB,
          category: 'WORKLET_RUNTIME',
        });

        insertMatrix.run({
          combo_id: Number(comboResult.lastInsertRowid),
          version_a_range: verA,
          version_b_range: verB,
          status,
          collision_severity: severity,
          title: titleLine,
          what_broke: whatBroke === 'n/a' ? null : whatBroke,
          forces_or_breaks: forcesOrBreaks || null,
          mitigation_strategy: isKnownGood ? 'Blessed combination' : 'Pin to compatible peer versions',
          fixed_in_version: fixedIn === 'n/a' ? null : fixedIn,
          valid_from_epoch: Math.floor(Date.now() / 1000),
        });

        comboCount++;
      }
      console.log(`[Hydration] Ingested ${comboCount} compatibility combos into compatibility_combos & compatibility_matrix.`);
    } else {
      console.warn(`[Hydration] Warning: ${COMBOS_MD_PATH} not found.`);
    }

    // 7. Ingest fixed_later (links + gaps = 62 records)
    if (fs.existsSync(FIXED_LATER_JSON_PATH)) {
      console.log(`[Hydration] Ingesting fixed_later records from ${FIXED_LATER_JSON_PATH}...`);
      const fixedData = JSON.parse(fs.readFileSync(FIXED_LATER_JSON_PATH, 'utf-8'));
      const links = fixedData.links || [];
      const gaps = fixedData.gaps || [];

      db.prepare('DELETE FROM fixed_later').run();
      const insertFixed = db.prepare(`
        INSERT INTO fixed_later (package, signal_id, title, status, born_version, fixed_version, source_url, evidence)
        VALUES (@package, @signal_id, @title, @status, @born_version, @fixed_version, @source_url, @evidence)
      `);

      for (const item of [...links, ...gaps]) {
        insertFixed.run({
          package: item.package,
          signal_id: item.signal_id || null,
          title: item.title,
          status: item.status || 'gap',
          born_version: item.born_version || null,
          fixed_version: item.fixed_version || null,
          source_url: item.source_url || null,
          evidence: item.evidence || item.gap || null,
        });
      }
      console.log(`[Hydration] Ingested ${links.length + gaps.length} fixed-later records (${links.length} links, ${gaps.length} gaps).`);
    }

  })();

  // 8. Output summary counts
  const tables = [
    'packages',
    'package_versions',
    'package_changes',
    'compatibility_combos',
    'compatibility_matrix',
    'training_attractors',
    'stack_baselines',
    'package_overrides',
    'fixed_later',
    'api_symbols',
  ];

  console.log('\n=== HYDRATION VERIFICATION AUDIT ===');
  for (const table of tables) {
    try {
      const row = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as { count: number };
      console.log(`  ✓ Table ${table.padEnd(24)}: ${row.count} rows`);
    } catch (e: any) {
      console.error(`  ✗ Table ${table.padEnd(24)}: Error - ${e.message}`);
    }
  }
  console.log('====================================\n');

  db.close();
}

// Auto-run if executed directly
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  hydrateCanonicalDatabase();
}
