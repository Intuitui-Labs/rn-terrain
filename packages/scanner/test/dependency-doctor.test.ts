import { describe, it, expect, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { TcdiDependencyDoctor } from '../src/dependency-doctor.js';

describe('TcdiDependencyDoctor', () => {
  const tempDir = path.join(os.tmpdir(), `rn-terrain-dep-doc-test-${Date.now()}`);

  afterEach(() => {
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch {}
  });

  it('detects violations of Sacred Native Pins in package.json', () => {
    fs.mkdirSync(tempDir, { recursive: true });
    const pkgPath = path.join(tempDir, 'package.json');
    fs.writeFileSync(
      pkgPath,
      JSON.stringify({
        name: 'test-app',
        dependencies: {
          'react-native': '0.74.0',
          'react-native-reanimated': '2.8.0', // Severely out of bounds (needs >=3.16.0 <4.0.0)
          '@shopify/react-native-skia': '0.1.0', // Legacy ABI
        },
      }),
      'utf8'
    );

    const doctor = new TcdiDependencyDoctor();
    const report = doctor.auditManifest(pkgPath);

    expect(report.isHealthy).toBe(false);
    expect(report.errorsCount).toBeGreaterThanOrEqual(2);
    expect(report.issues.some((i) => i.packageName === 'react-native-reanimated')).toBe(true);
  });

  it('flags React 19 dialect risk against older React Native versions', () => {
    fs.mkdirSync(tempDir, { recursive: true });
    const pkgPath = path.join(tempDir, 'package.json');
    fs.writeFileSync(
      pkgPath,
      JSON.stringify({
        name: 'test-app',
        dependencies: {
          react: '^19.0.0',
          'react-native': '0.74.5', // RN < 0.76 cannot resolve React 19 renderer
        },
      }),
      'utf8'
    );

    const doctor = new TcdiDependencyDoctor();
    const report = doctor.auditManifest(pkgPath);

    expect(report.isHealthy).toBe(false);
    const dialectRisk = report.issues.find((i) => i.ruleType === 'FRAMEWORK_DIALECT_RISK');
    expect(dialectRisk).toBeDefined();
    expect(dialectRisk?.severity).toBe('error');
  });

  it('passes a fully pinned canonical modern React Native manifest', () => {
    fs.mkdirSync(tempDir, { recursive: true });
    const pkgPath = path.join(tempDir, 'package.json');
    fs.writeFileSync(
      pkgPath,
      JSON.stringify({
        name: 'test-app',
        dependencies: {
          react: '19.0.0',
          'react-native': '0.76.2',
          'react-native-reanimated': '3.16.2',
          'react-native-gesture-handler': '2.20.0',
          '@shopify/react-native-skia': '1.5.2',
        },
      }),
      'utf8'
    );

    const doctor = new TcdiDependencyDoctor();
    const report = doctor.auditManifest(pkgPath);

    expect(report.isHealthy).toBe(true);
    expect(report.errorsCount).toBe(0);
  });
});
