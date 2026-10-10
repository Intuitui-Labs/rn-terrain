import { describe, it, expect, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { loadTerrainConfig, findTerrainConfigFile } from '../src/config-loader.js';

describe('TerrainConfigLoader', () => {
  const tempDir = path.join(os.tmpdir(), `rn-terrain-cfg-test-${Date.now()}`);

  afterEach(() => {
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch {}
  });

  it('loads terrain.config.json and merges with preset defaults', () => {
    fs.mkdirSync(tempDir, { recursive: true });
    const configPath = path.join(tempDir, 'terrain.config.json');
    fs.writeFileSync(
      configPath,
      JSON.stringify({
        preset: 'enterprise',
        aliases: {
          '@myorg/reanimated': 'react-native-reanimated',
        },
        localPins: {
          '@myorg/auth-native': {
            recommendedRange: '>=2.0.0 <3.0.0',
            reason: 'Requires internal v2 C++ auth engine',
            severity: 'error',
          },
        },
        ignore: ['@test/ignored-pkg'],
      }),
      'utf8'
    );

    const config = loadTerrainConfig(tempDir);
    expect(config.preset).toBe('enterprise');
    expect(config.strictNativeFloating).toBe(true);
    expect(config.rules?.disallowFloatingNativeRanges).toBe('error');
    expect(config.aliases?.['@myorg/reanimated']).toBe('react-native-reanimated');
    expect(config.localPins?.['@myorg/auth-native']).toBeDefined();
    expect(config.ignore).toContain('@test/ignored-pkg');
  });

  it('loads .terrainrc JSONC with comments', () => {
    fs.mkdirSync(tempDir, { recursive: true });
    const rcPath = path.join(tempDir, '.terrainrc');
    fs.writeFileSync(
      rcPath,
      `// Project dialect configuration\n{\n  /* custom settings */\n  "preset": "loose",\n  "strictNativeFloating": false\n}`,
      'utf8'
    );

    const config = loadTerrainConfig(tempDir);
    expect(config.preset).toBe('loose');
    expect(config.strictNativeFloating).toBe(false);
  });

  it('falls back to standard preset when no config file exists', () => {
    fs.mkdirSync(tempDir, { recursive: true });
    const config = loadTerrainConfig(tempDir);
    expect(config.preset).toBe('standard');
    expect(config.strictNativeFloating).toBe(true);
  });
});
