import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { RepoDirectorySyncer } from '../src/ingestion/repo-directory-syncer.js';

describe('RepoDirectorySyncer (Repo-Scoped React Native Directory Sync)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = path.join(os.tmpdir(), `rn-terrain-syncer-test-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  it('identifies strictly React Native dependencies from package.json', () => {
    const pkgJson = {
      name: 'my-app',
      dependencies: {
        'react-native': '0.78.0',
        'react-native-reanimated': '^3.16.0',
        'react-native-screens': '~4.4.0',
        lodash: '^4.17.21',
        express: '^4.19.0'
      },
      devDependencies: {
        typescript: '^5.0.0',
        '@types/react': '^18.0.0'
      }
    };
    fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify(pkgJson, null, 2), 'utf8');

    const syncer = new RepoDirectorySyncer();
    const discovered = syncer.discoverRepoRnPackages(tempDir);

    expect(discovered.length).toBe(3);
    const names = discovered.map((d) => d.name);
    expect(names).toContain('react-native');
    expect(names).toContain('react-native-reanimated');
    expect(names).toContain('react-native-screens');
    expect(names).not.toContain('lodash');
    expect(names).not.toContain('express');
    expect(names).not.toContain('typescript');
  });

  it('syncs and caches directory metadata strictly for repo packages', async () => {
    const pkgJson = {
      name: 'sample-mobile',
      dependencies: {
        'react-native-reanimated': '3.16.1',
        '@shopify/react-native-skia': '1.5.0'
      }
    };
    fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify(pkgJson, null, 2), 'utf8');

    const syncer = new RepoDirectorySyncer();
    const records = await syncer.syncRepo(tempDir);

    expect(records.length).toBe(2);
    const reanimated = records.find((r) => r.packageName === 'react-native-reanimated');
    expect(reanimated).toBeDefined();
    expect(reanimated?.supportsNewArchitecture).toBe(true);

    const cachePath = path.join(tempDir, '.agents', 'state', 'directory-cache.json');
    expect(fs.existsSync(cachePath)).toBe(true);

    const cacheContent = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    expect(cacheContent.packages['react-native-reanimated']).toBeDefined();
    expect(cacheContent.packages['@shopify/react-native-skia']).toBeDefined();
    expect(cacheContent.packages['lodash']).toBeUndefined();
  });
});
