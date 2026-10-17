import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { NativeSurfaceProfiler } from '../src/native-surface-profiler.js';

describe('NativeSurfaceProfiler & Leverage Engine', () => {
  it('accurately profiles a solution, isolating native units and calculating exposure ratio', () => {
    const tempDir = path.join(process.cwd(), '.temp-profiler-test-app');
    try {
      fs.mkdirSync(tempDir, { recursive: true });

      const pkgJson = {
        name: 'sample-production-mobile',
        dependencies: {
          'react': '19.3.0',
          'react-native': '0.88.0',
          'react-native-reanimated': '^4.7.1',
          'react-native-worklets': '^0.13.0',
          'react-native-screens': '^4.4.0',
          'react-native-safe-area-context': '^5.1.0',
          'react-native-gesture-handler': '^3.3.0',
          'react-native-mmkv': '^4.3.2',
          'react-native-nitro-modules': '^0.37.1',
          '@shopify/react-native-skia': '^3.0.2',
          'expo-router': '^57.0.0',
          'lodash': '^4.17.21',
          'clsx': '^2.1.1',
          'zod': '^3.23.8',
          'axios': '^1.7.9',
        },
        devDependencies: {
          'typescript': '^5.7.0',
          'eslint': '^9.0.0',
        },
      };

      fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify(pkgJson, null, 2), 'utf-8');

      const profiler = new NativeSurfaceProfiler();
      const report = profiler.profileProject({ projectDir: tempDir });

      // Total dependencies = 15 runtime + 2 dev = 17
      expect(report.totalDependencies).toBe(17);
      expect(report.runtimeDependenciesCount).toBe(15);
      expect(report.devDependenciesCount).toBe(2);

      // Pure JS packages: lodash, clsx, zod, axios (4 pkgs, excluding react/react-native)
      expect(report.pureJsDependenciesCount).toBe(4);

      // Native packages: reanimated, worklets, screens, safe-area-context, gesture-handler, mmkv, nitro-modules, skia, expo-router (9 pkgs)
      expect(report.nativeCompilationUnitsCount).toBe(9);

      // Exposure ratio = 9 native / 15 runtime = 0.60
      expect(report.nativeExposureRatio).toBeCloseTo(0.6, 2);

      // Check module types
      const mmkvProfile = report.profiles.find((p) => p.packageName === 'react-native-mmkv');
      expect(mmkvProfile?.moduleType).toBe('NITRO_MODULE');
      expect(mmkvProfile?.isNative).toBe(true);

      const reanimatedProfile = report.profiles.find((p) => p.packageName === 'react-native-reanimated');
      expect(reanimatedProfile?.moduleType).toBe('TURBOMODULE');
      expect(reanimatedProfile?.leverageScore).toBeGreaterThanOrEqual(90);

      const expoProfile = report.profiles.find((p) => p.packageName === 'expo-router');
      expect(expoProfile?.moduleType).toBe('EXPO_MODULE');

      // All 9 native packages in this modern stack are New Arch ready
      expect(report.newArchReadyCount).toBe(9);
      expect(report.newArchReadyPercentage).toBe(100);
      expect(report.legacyBridgeHazardsCount).toBe(0);
    } finally {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
  });

  it('detects missing worklets peer hazard when Reanimated v4 is installed alone', () => {
    const tempDir = path.join(process.cwd(), '.temp-missing-worklets-app');
    try {
      fs.mkdirSync(tempDir, { recursive: true });

      const pkgJson = {
        name: 'broken-reanimated-app',
        dependencies: {
          'react-native': '0.88.0',
          'react-native-reanimated': '^4.7.1', // Missing react-native-worklets!
        },
      };

      fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify(pkgJson, null, 2), 'utf-8');

      const profiler = new NativeSurfaceProfiler();
      const report = profiler.profileProject({ projectDir: tempDir });

      expect(report.hazardPackages.length).toBeGreaterThan(0);
      const reanHazard = report.hazardPackages.find((p) => p.packageName === 'react-native-reanimated');
      expect(reanHazard?.hazardLevel).toBe('CRITICAL');
      expect(reanHazard?.hazardReason).toContain('react-native-worklets');
    } finally {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
  });
});
