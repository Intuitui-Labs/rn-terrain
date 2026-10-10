import { describe, it, expect, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { TcdiDependencyDoctor } from '../src/dependency-doctor.js';

describe('Generalized TcdiDependencyDoctor', () => {
  const tempDir = path.join(os.tmpdir(), `rn-terrain-gen-doc-test-${Date.now()}`);

  afterEach(() => {
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch {}
  });

  it('dynamically detects native surfaces and flags floating carets on unlisted native modules', () => {
    fs.mkdirSync(tempDir, { recursive: true });

    // Mock an unlisted native library inside node_modules
    const mockModuleDir = path.join(tempDir, 'node_modules', 'react-native-vision-camera');
    fs.mkdirSync(path.join(mockModuleDir, 'ios'), { recursive: true });
    fs.writeFileSync(
      path.join(mockModuleDir, 'package.json'),
      JSON.stringify({
        name: 'react-native-vision-camera',
        version: '4.5.0',
        codegenConfig: {},
      }),
      'utf8'
    );

    const pkgPath = path.join(tempDir, 'package.json');
    fs.writeFileSync(
      pkgPath,
      JSON.stringify({
        name: 'test-app',
        dependencies: {
          'react-native': '0.76.2',
          'react-native-vision-camera': '^4.5.0', // Floating caret on native module
        },
      }),
      'utf8'
    );

    const doctor = new TcdiDependencyDoctor({ configPath: tempDir });
    const report = doctor.auditManifest(pkgPath);

    expect(report.nativeModulesDetected).toBeGreaterThanOrEqual(1);
    const floatingIssue = report.issues.find((i) => i.packageName === 'react-native-vision-camera');
    expect(floatingIssue).toBeDefined();
    expect(floatingIssue?.ruleType).toBe('HAZARDOUS_FLOATING_RANGE');
  });

  it('enforces local custom pins from .terrainrc with local shape', () => {
    fs.mkdirSync(tempDir, { recursive: true });

    // Create local config with in-house pin
    const configPath = path.join(tempDir, 'terrain.config.json');
    fs.writeFileSync(
      configPath,
      JSON.stringify({
        preset: 'standard',
        localPins: {
          '@company/native-core': {
            recommendedRange: '>=2.0.0 <3.0.0',
            reason: 'Mandatory enterprise crypto pin',
            severity: 'error',
          },
        },
      }),
      'utf8'
    );

    const pkgPath = path.join(tempDir, 'package.json');
    fs.writeFileSync(
      pkgPath,
      JSON.stringify({
        name: 'test-app',
        dependencies: {
          'react-native': '0.76.2',
          '@company/native-core': '1.5.0', // Violates local pin >=2.0.0 <3.0.0
        },
      }),
      'utf8'
    );

    const doctor = new TcdiDependencyDoctor({ configPath: tempDir });
    const report = doctor.auditManifest(pkgPath);

    expect(report.isHealthy).toBe(false);
    const localPinIssue = report.issues.find((i) => i.packageName === '@company/native-core');
    expect(localPinIssue).toBeDefined();
    expect(localPinIssue?.ruleType).toBe('LOCAL_PIN_VIOLATION');
    expect(localPinIssue?.severity).toBe('error');
  });

  it('maps custom forks via aliases to canonical rules', () => {
    fs.mkdirSync(tempDir, { recursive: true });

    // Map alias @myorg/reanimated-fork to react-native-reanimated
    const configPath = path.join(tempDir, 'terrain.config.json');
    fs.writeFileSync(
      configPath,
      JSON.stringify({
        preset: 'standard',
        aliases: {
          '@myorg/reanimated-fork': 'react-native-reanimated',
        },
      }),
      'utf8'
    );

    const pkgPath = path.join(tempDir, 'package.json');
    fs.writeFileSync(
      pkgPath,
      JSON.stringify({
        name: 'test-app',
        dependencies: {
          'react-native': '0.76.2',
          '@myorg/reanimated-fork': '2.10.0', // Out of bounds for reanimated (needs >=3.16.0 <4.0.0)
        },
      }),
      'utf8'
    );

    const doctor = new TcdiDependencyDoctor({ configPath: tempDir });
    const report = doctor.auditManifest(pkgPath);

    expect(report.isHealthy).toBe(false);
    const aliasIssue = report.issues.find((i) => i.packageName === '@myorg/reanimated-fork');
    expect(aliasIssue).toBeDefined();
    expect(aliasIssue?.ruleType).toBe('SACRED_PIN_VIOLATION');
  });

  it('respects ignore list and silences flagged packages', () => {
    fs.mkdirSync(tempDir, { recursive: true });

    const configPath = path.join(tempDir, 'terrain.config.json');
    fs.writeFileSync(
      configPath,
      JSON.stringify({
        preset: 'standard',
        ignore: ['react-native-reanimated'],
      }),
      'utf8'
    );

    const pkgPath = path.join(tempDir, 'package.json');
    fs.writeFileSync(
      pkgPath,
      JSON.stringify({
        name: 'test-app',
        dependencies: {
          'react-native': '0.76.2',
          'react-native-reanimated': '2.4.0', // Normally violates sacred pin, but ignored
        },
      }),
      'utf8'
    );

    const doctor = new TcdiDependencyDoctor({ configPath: tempDir });
    const report = doctor.auditManifest(pkgPath);

    const reanimatedIssue = report.issues.find((i) => i.packageName === 'react-native-reanimated');
    expect(reanimatedIssue).toBeUndefined();
  });

  it('detects Peer ABI Matrix incompatibility dynamically', () => {
    fs.mkdirSync(tempDir, { recursive: true });

    // Mock a package that explicitly requires older react-native in peerDependencies
    const mockModuleDir = path.join(tempDir, 'node_modules', 'react-native-legacy-plugin');
    fs.mkdirSync(path.join(mockModuleDir, 'ios'), { recursive: true });
    fs.writeFileSync(
      path.join(mockModuleDir, 'package.json'),
      JSON.stringify({
        name: 'react-native-legacy-plugin',
        version: '1.0.0',
        peerDependencies: {
          'react-native': '>=0.70.0 <0.75.0',
        },
      }),
      'utf8'
    );

    const pkgPath = path.join(tempDir, 'package.json');
    fs.writeFileSync(
      pkgPath,
      JSON.stringify({
        name: 'test-app',
        dependencies: {
          'react-native': '0.77.0', // Incompatible with peer range >=0.70.0 <0.75.0
          'react-native-legacy-plugin': '1.0.0',
        },
      }),
      'utf8'
    );

    const doctor = new TcdiDependencyDoctor({ configPath: tempDir });
    const report = doctor.auditManifest(pkgPath);

    const peerIssue = report.issues.find((i) => i.ruleType === 'PEER_ABI_INCOMPATIBILITY');
    expect(peerIssue).toBeDefined();
    expect(peerIssue?.packageName).toBe('react-native-legacy-plugin');
  });
});
