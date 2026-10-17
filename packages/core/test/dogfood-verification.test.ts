import { describe, it, expect, beforeAll } from 'vitest';
import { CanonicalDatabase } from '../src/db/sqlite-client.js';
import { BitemporalGate } from '../src/decision/bitemporal-gate.js';
import { SovereignToolchain } from '../src/ingestion/sovereign-toolchain.js';

describe('Bitemporal Gate & Dogfood L2 Verification Suite', () => {
  let db: CanonicalDatabase;
  let gate: BitemporalGate;
  let toolchain: SovereignToolchain;

  beforeAll(() => {
    // Point to canonical hydrated database
    db = new CanonicalDatabase();
    gate = new BitemporalGate(db);
    toolchain = new SovereignToolchain();
  });

  it('Dogfood 1: @nozbe/watermelondb install triggers training attractor and ask decision', () => {
    const res = gate.checkPackage({
      asked: '@nozbe/watermelondb',
      action: 'install',
      dryRun: true,
    });

    expect(res.ok).toBe(true);
    expect(res.data.decision).toBe('ask');
    expect(res.data.refused_invented).toBe(0);
    expect(res.data.sacred_pin).toBe(0);

    const codes = res.data.decision_reasons.map((r) => r.code);
    expect(codes).toContain('new_install');
    expect(codes).toContain('training_gravity');
    expect(codes).toContain('training_attractor:name_louder_than_health');

    const attractor = res.data.training_attractors.find((a) => a.npm_name === '@nozbe/watermelondb');
    expect(attractor).toBeDefined();
    expect(attractor?.rebuttal).toContain('PowerSync freshness');
  });

  it('Dogfood 2: react-native-reanimated@4.9.3 refuses invented version and alerts on sacred pin', () => {
    const res = gate.checkPackage({
      asked: 'react-native-reanimated',
      action: 'bump',
      requestedVersion: '4.9.3',
      dryRun: true,
    });

    expect(res.ok).toBe(true);
    expect(res.data.decision).toBe('refuse');
    expect(res.data.refused_invented).toBe(1);
    expect(res.data.sacred_pin).toBe(1);

    const inventedReason = res.data.decision_reasons.find((r) => r.code === 'refused_invented');
    expect(inventedReason).toBeDefined();
    expect(inventedReason?.text).toContain('appears in no source');
    expect(inventedReason?.text).toContain('not inventing it');

    const sacredReason = res.data.decision_reasons.find((r) => r.code === 'sacred_pin');
    expect(sacredReason).toBeDefined();
    expect(res.data.sacred_pin_policy).toContain('NEVER run `expo install --fix` against sacred pins');
  });

  it('Dogfood 3: react-native-reanimated@nightly resolves correctly but flags sacred pin and peers', () => {
    const res = gate.checkPackage({
      asked: 'react-native-reanimated',
      action: 'bump',
      requestedVersion: 'nightly',
      dryRun: true,
    });

    expect(res.ok).toBe(true);
    expect(res.data.decision).toBe('ask');
    expect(res.data.refused_invented).toBe(0);
    expect(res.data.sacred_pin).toBe(1);
    expect(res.data.resolved_target).toContain('nightly');

    const infoCodes = res.data.info.map((i) => i.code);
    expect(infoCodes).toContain('dist_tag_resolved');
    expect(infoCodes).toContain('co_move');
  });

  it('Dogfood 4: clsx@latest resolves cleanly and allows installation', () => {
    const res = gate.checkPackage({
      asked: 'clsx',
      action: 'bump',
      requestedVersion: 'latest',
      dryRun: true,
    });

    expect(res.ok).toBe(true);
    expect(res.data.decision).toBe('allow');
    expect(res.data.refused_invented).toBe(0);
    expect(res.data.sacred_pin).toBe(0);
    expect(res.data.resolved_target).toBe('2.1.1');
    expect(res.data.decision_reasons).toHaveLength(0);
  });

  it('Dogfood 5: pre_write intercepts WatermelonDB import and allows Reanimated useSharedValue and clsx', () => {
    const codeSnippet = `
      import { useSharedValue } from 'react-native-reanimated';
      import clsx from 'clsx';
      import { Database } from '@nozbe/watermelondb';

      export function Card() {
        const x = useSharedValue(0);
        return null;
      }
    `;

    // Warmup JIT hot path
    gate.preWrite({ codeSnippet, dryRun: true });

    const start = performance.now();
    const res = gate.preWrite({
      codeSnippet,
      dryRun: true,
    });
    const latency = performance.now() - start;

    expect(res.ok).toBe(true);
    expect(res.data.decision).toBe('ask'); // Overall ask because of WatermelonDB
    expect(res.data.imports).toHaveLength(3);

    const reanimatedImport = res.data.imports.find((i) => i.specifier === 'react-native-reanimated');
    expect(reanimatedImport?.decision).toBe('allow');

    const clsxImport = res.data.imports.find((i) => i.specifier === 'clsx');
    expect(clsxImport?.decision).toBe('allow');

    const watermelonImport = res.data.imports.find((i) => i.specifier === '@nozbe/watermelondb');
    expect(watermelonImport?.decision).toBe('ask');
    expect(watermelonImport?.reasons.map((r) => r.code)).toContain('training_gravity');

    // Latency SLA: in-process hot path must execute under 5ms under parallel test runner load
    expect(latency).toBeLessThan(5.0);
  });

  it('Dogfood 6: offer_create clsx dry-run returns proposed escrow state without DB write', () => {
    const res = gate.createOffer({
      asked: 'clsx',
      requestedVersion: 'latest',
      dryRun: true,
    });

    expect(res.ok).toBe(true);
    expect(res.data.state).toBe('escrow');
    expect(res.data.dry_run).toBe(true);
    expect(res.data.gate_decision).toBe('allow');
    expect(res.data.inserted).toBe(false);
  });

  it('Dogfood 7: offer_create reanimated nightly dry-run preserves escrow state and relays approval note', () => {
    const res = gate.createOffer({
      asked: 'react-native-reanimated',
      requestedVersion: 'nightly',
      dryRun: true,
    });

    expect(res.ok).toBe(true);
    expect(res.data.state).toBe('escrow');
    expect(res.data.dry_run).toBe(true);
    expect(res.data.gate_decision).toBe('ask');
    expect(res.data.relay).toContain('Only Naveen accepts');
  });

  it('Dogfood 8: gravity_list outputs exact 8 attractors grouped by kind', () => {
    const res = gate.listGravity();

    expect(res.ok).toBe(true);
    expect(res.data.count).toBe(8);
    expect(res.data.by_kind['force_install_muscle_memory']).toBe(6);
    expect(res.data.by_kind['incomplete_peer_comove']).toBe(1);
    expect(res.data.by_kind['name_louder_than_health']).toBe(1);
  });

  it('Sovereign Toolchain Ingestion: scans workspace files and code imports', async () => {
    const start = performance.now();
    const files = await toolchain.scanWorkspaceFiles(process.cwd());
    const duration = performance.now() - start;

    expect(files.length).toBeGreaterThan(0);

    const imports = await toolchain.scanCodeImports(process.cwd());
    expect(imports.length).toBeGreaterThan(0);
  }, 15000);
});
