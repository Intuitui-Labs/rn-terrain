import { describe, it, expect, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { EcosystemStackClassifier } from '../src/ecosystem-stack-classifier.js';

describe('EcosystemStackClassifier', () => {
  const tempDir = path.join(os.tmpdir(), `rn-terrain-stack-classifier-test-${Date.now()}`);

  afterEach(() => {
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch {}
  });

  it('classifies packages across all architectural domains and flags ABI floating carets', () => {
    fs.mkdirSync(tempDir, { recursive: true });
    const pkgPath = path.join(tempDir, 'package.json');
    fs.writeFileSync(
      pkgPath,
      JSON.stringify({
        name: 'test-app',
        dependencies: {
          'react-native': '0.88.0',
          'react': '19.0.0',
          'expo': '58.0.6',
          'react-native-reanimated': '^4.7.1',
          'react-native-gesture-handler': '~3.3.0',
          'react-native-mmkv': '^4.3.2',
          '@op-engineering/op-sqlite': '^17.2.0',
          'react-native-screens': '^4.28.0',
          'zustand': '^5.0.0',
        },
        devDependencies: {
          '@types/react': '^19.0.0',
          'typescript': '^5.7.0',
        },
      }),
      'utf8'
    );

    const classifier = new EcosystemStackClassifier(tempDir);
    const report = classifier.classify(pkgPath);

    expect(report.totalPackages).toBe(11);
    expect(report.groups.CORE_SUBSTRATE.length).toBe(3);
    expect(report.groups.ANIMATION_AND_GESTURES.length).toBe(2);
    expect(report.groups.HIGH_PERFORMANCE_NATIVE.length).toBe(1);
    expect(report.groups.STORAGE_AND_DATA.length).toBe(1);
    expect(report.groups.NAVIGATION_AND_ROUTING.length).toBe(1);
    expect(report.groups.STATE_AND_LOGIC.length).toBe(1);
    expect(report.groups.DEVELOPMENT_AND_TOOLING.length).toBe(2);

    // Verify ABI hazard detection
    const reanimated = report.groups.ANIMATION_AND_GESTURES.find((p) => p.name === 'react-native-reanimated');
    expect(reanimated?.rangeType).toBe('FLOATING_CARET');
    expect(reanimated?.abiHazard.hasRisk).toBe(true);

    const rngh = report.groups.ANIMATION_AND_GESTURES.find((p) => p.name === 'react-native-gesture-handler');
    expect(rngh?.rangeType).toBe('TILDE');
    expect(rngh?.abiHazard.hasRisk).toBe(false);

    const opSqlite = report.groups.STORAGE_AND_DATA.find((p) => p.name === '@op-engineering/op-sqlite');
    expect(opSqlite?.abiHazard.level).toBe('CRITICAL_C_ABI');
  });
});
