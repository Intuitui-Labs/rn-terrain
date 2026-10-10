import { describe, it, expect, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { ExpoDoctorBridge } from '../src/expo-doctor-bridge.js';

describe('ExpoDoctorBridge', () => {
  const tempDir = path.join(os.tmpdir(), `rn-terrain-expo-doc-test-${Date.now()}`);

  afterEach(() => {
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch {}
  });

  it('detects when a project is NOT an Expo project', () => {
    fs.mkdirSync(tempDir, { recursive: true });
    const pkgPath = path.join(tempDir, 'package.json');
    fs.writeFileSync(
      pkgPath,
      JSON.stringify({
        name: 'bare-rn-app',
        dependencies: {
          'react-native': '0.76.0',
        },
      }),
      'utf8'
    );

    const bridge = new ExpoDoctorBridge();
    const res = bridge.auditExpoProject(tempDir);
    expect(res.isExpoProject).toBe(false);
    expect(res.status).toBe('NOT_EXPO');
  });

  it('detects an Expo project and extracts SDK version', () => {
    fs.mkdirSync(tempDir, { recursive: true });
    const pkgPath = path.join(tempDir, 'package.json');
    fs.writeFileSync(
      pkgPath,
      JSON.stringify({
        name: 'expo-sample-app',
        dependencies: {
          expo: '~52.0.0',
          'react-native': '0.76.0',
        },
      }),
      'utf8'
    );

    const bridge = new ExpoDoctorBridge();
    const res = bridge.auditExpoProject(tempDir);
    expect(res.isExpoProject).toBe(true);
    expect(res.expoSdkVersion).toBe('52.0.0');
  });
});
