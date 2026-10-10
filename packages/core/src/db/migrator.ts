/**
 * @file migrator.ts
 * Ingests and normalizes legacy data from docs/changelog-intelligence/data/tcdi-graph.db
 * into the canonical bitemporal SQLite database.
 */

import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CanonicalDatabase } from './sqlite-client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LEGACY_DB_PATH = path.resolve(__dirname, '../../../../docs/changelog-intelligence/data/tcdi-graph.db');

export function migrateLegacyDatabase(targetDb?: CanonicalDatabase): void {
  const canonical = targetDb ?? new CanonicalDatabase();

  console.log('[Migrator] Checking legacy database at:', LEGACY_DB_PATH);
  if (fs.existsSync(LEGACY_DB_PATH)) {
    const legacyDb = new Database(LEGACY_DB_PATH);

    // 1. Ingest packages
    try {
      const pkgs = legacyDb.prepare('SELECT * FROM packages').all() as Array<{
        id: string;
        vendor?: string;
        category?: string;
      }>;

      for (const p of pkgs) {
        canonical.upsertPackage({
          id: p.id,
          vendor: p.vendor || null,
          category: p.category || 'general',
          tier: 'COMMUNITY',
          repository_url: null,
          documentation_url: null,
          created_at: Math.floor(Date.now() / 1000)
        });
      }
      console.log(`[Migrator] Ingested ${pkgs.length} packages from legacy db.`);
    } catch (e: unknown) {
      console.warn('[Migrator] Note on packages migration:', (e as Error).message);
    }

    // 2. Ingest combos
    try {
      const legacyCombos = legacyDb.prepare('SELECT * FROM combos').all() as Array<{
        package_a: string;
        range_a: string;
        package_b: string;
        range_b: string;
        status: string;
        title: string;
        what_broke: string;
        forces_or_breaks: string;
        fixed_in: string;
      }>;

      for (const c of legacyCombos) {
        const comboKey = `${c.package_a}:${c.package_b}`;
        const comboId = canonical.upsertCombo({
          combo_key: comboKey,
          package_a: c.package_a,
          package_b: c.package_b,
          category: 'PEER_DEP'
        });

        canonical.insertMatrixSlice({
          combo_id: comboId,
          version_a_range: c.range_a || '*',
          version_b_range: c.range_b || '*',
          status: c.status === 'OK' ? 'COMPATIBLE' : 'BREAKING_COLLISION',
          collision_severity: c.status === 'OK' ? 0 : 8,
          title: c.title || null,
          what_broke: c.what_broke || null,
          forces_or_breaks: c.forces_or_breaks || null,
          mitigation_strategy: null,
          fixed_in_version: c.fixed_in || null,
          valid_from_epoch: 1717200000,
          valid_to_epoch: null
        });
      }
      console.log(`[Migrator] Ingested ${legacyCombos.length} compatibility combos.`);
    } catch (e: unknown) {
      console.warn('[Migrator] Note on combos migration:', (e as Error).message);
    }

    legacyDb.close();
  }

  // 3. Seed canonical packages & essential API symbols for Agent Grounding
  seedCanonicalSymbols(canonical);
  console.log('[Migrator] Canonical schema migration and seed complete.');
}

function seedCanonicalSymbols(canonical: CanonicalDatabase): void {
  // Ensure react-native-gesture-handler exists
  canonical.upsertPackage({
    id: 'react-native-gesture-handler',
    vendor: 'software-mansion',
    category: 'gesture-system',
    tier: 'TIER_1',
    repository_url: 'https://github.com/software-mansion/react-native-gesture-handler',
    documentation_url: 'https://docs.swmansion.com/react-native-gesture-handler/',
    created_at: Math.floor(Date.now() / 1000)
  });

  // Seed version 2.16.0
  canonical.upsertVersion({
    package_id: 'react-native-gesture-handler',
    version: '2.16.0',
    valid_from_epoch: 1714521600,
    valid_to_epoch: null,
    react_native_min: '0.74.0',
    react_native_max: null,
    supports_new_arch: 1,
    tarball_url: null
  });

  // Seed severed symbol: usePanGesture (REMOVED in RNGH 2.x)
  canonical.upsertSymbol({
    package_id: 'react-native-gesture-handler',
    version: '2.16.0',
    symbol_identifier: 'usePanGesture',
    symbol_type: 'HOOK',
    status: 'UNSUPPORTED_REMOVED',
    replacement_symbol: 'Gesture.Pan()',
    replacement_package: 'react-native-gesture-handler',
    codemod_available: 1,
    codemod_rule_id: 'rngh-v1-to-v2-gesture-pan',
    documentation_anchor: 'docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture',
    valid_from_epoch: 1714521600,
    valid_to_epoch: null
  });

  // Seed modern stable symbol: Gesture
  canonical.upsertSymbol({
    package_id: 'react-native-gesture-handler',
    version: '2.16.0',
    symbol_identifier: 'Gesture',
    symbol_type: 'COMPONENT',
    status: 'FUNCTIONAL_STABLE',
    replacement_symbol: null,
    replacement_package: null,
    codemod_available: 0,
    codemod_rule_id: null,
    documentation_anchor: 'docs.swmansion.com/react-native-gesture-handler/docs/gestures/gesture',
    valid_from_epoch: 1714521600,
    valid_to_epoch: null
  });

  // Seed react-native-reanimated
  canonical.upsertPackage({
    id: 'react-native-reanimated',
    vendor: 'software-mansion',
    category: 'animation',
    tier: 'TIER_1',
    repository_url: 'https://github.com/software-mansion/react-native-reanimated',
    documentation_url: 'https://docs.swmansion.com/react-native-reanimated/',
    created_at: Math.floor(Date.now() / 1000)
  });

  canonical.upsertVersion({
    package_id: 'react-native-reanimated',
    version: '3.16.0',
    valid_from_epoch: 1715731200,
    valid_to_epoch: null,
    react_native_min: '0.74.0',
    react_native_max: null,
    supports_new_arch: 1,
    tarball_url: null
  });

  // Seed severed symbol: useAnimatedGestureHandler (DEPRECATED/REMOVED in v3)
  canonical.upsertSymbol({
    package_id: 'react-native-reanimated',
    version: '3.16.0',
    symbol_identifier: 'useAnimatedGestureHandler',
    symbol_type: 'HOOK',
    status: 'UNSUPPORTED_REMOVED',
    replacement_symbol: 'Gesture.Pan().onUpdate(...)',
    replacement_package: 'react-native-gesture-handler',
    codemod_available: 1,
    codemod_rule_id: 'reanimated-v2-to-v3-gesture-handler',
    documentation_anchor: 'docs.swmansion.com/react-native-reanimated/docs/fundamentals/events',
    valid_from_epoch: 1715731200,
    valid_to_epoch: null
  });
}

// Allow direct CLI execution: node migrator.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  migrateLegacyDatabase();
}
