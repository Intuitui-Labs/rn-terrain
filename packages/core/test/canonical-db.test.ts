import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CanonicalDatabase } from '../src/db/sqlite-client.js';
import { PolicyGate } from '../src/decision/policy-gate.js';
import fs from 'node:fs';
import path from 'node:path';

describe('Canonical Bitemporal SQLite Database & Decision Engine', () => {
  const testDbPath = path.resolve(__dirname, 'test-temp.db');
  let db: CanonicalDatabase;

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    db = new CanonicalDatabase(testDbPath);
  });

  afterEach(() => {
    db.close();
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
  });

  it('correctly tracks package versions with bitemporal epochs', () => {
    db.upsertPackage({
      id: 'react-native-gesture-handler',
      vendor: 'software-mansion',
      category: 'gesture-system',
      tier: 'TIER_1',
      repository_url: 'https://github.com/software-mansion/react-native-gesture-handler',
      documentation_url: 'https://docs.swmansion.com',
      created_at: 1714521600
    });

    db.upsertVersion({
      package_id: 'react-native-gesture-handler',
      version: '2.16.0',
      valid_from_epoch: 1714521600,
      valid_to_epoch: null,
      react_native_min: '0.74.0',
      react_native_max: null,
      supports_new_arch: 1,
      tarball_url: null
    });

    const versions = db.getVersions('react-native-gesture-handler');
    expect(versions).toHaveLength(1);
    expect(versions[0]?.version).toBe('2.16.0');
    expect(versions[0]?.supports_new_arch).toBe(1);
  });

  it('identifies severed symbols and provides replacement hints', () => {
    db.upsertPackage({
      id: 'react-native-gesture-handler',
      vendor: 'software-mansion',
      category: 'gesture-system',
      tier: 'TIER_1',
      repository_url: null,
      documentation_url: null,
      created_at: 1714521600
    });

    db.upsertVersion({
      package_id: 'react-native-gesture-handler',
      version: '2.16.0',
      valid_from_epoch: 1714521600,
      valid_to_epoch: null,
      react_native_min: '0.74.0',
      react_native_max: null,
      supports_new_arch: 1,
      tarball_url: null
    });

    db.upsertSymbol({
      package_id: 'react-native-gesture-handler',
      version: '2.16.0',
      symbol_identifier: 'usePanGesture',
      symbol_type: 'HOOK',
      status: 'UNSUPPORTED_REMOVED',
      replacement_symbol: 'Gesture.Pan()',
      replacement_package: null,
      codemod_available: 1,
      codemod_rule_id: 'rngh-v1-to-v2',
      documentation_anchor: null,
      valid_from_epoch: 1714521600,
      valid_to_epoch: null
    });

    const severed = db.findSeveredSymbols('react-native-gesture-handler', '2.16.0', [
      'usePanGesture',
      'Gesture'
    ]);
    expect(severed).toHaveLength(1);
    expect(severed[0]?.symbol_identifier).toBe('usePanGesture');
    expect(severed[0]?.replacement_symbol).toBe('Gesture.Pan()');
  });

  it('gating policy correctly triggers QUARANTINE_HOLD when severed API is found', async () => {
    const gate = new PolicyGate();
    const result = await gate.evaluateDiffPolicy({
      packageName: 'react-native-gesture-handler',
      targetVersion: '2.16.0',
      diffSnippet: 'import { usePanGesture } from "react-native-gesture-handler";',
      severedSymbolsFound: ['usePanGesture']
    });

    expect(result.action).toBe('QUARANTINE_HOLD');
    expect(result.confidence).toBeGreaterThanOrEqual(0.95);
    expect(result.engineUsed).toBe('deterministic-ast-fence');
  });
});
