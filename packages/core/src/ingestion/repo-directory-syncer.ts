/**
 * @file repo-directory-syncer.ts
 * Scoped React Native Directory Ingestion Engine.
 *
 * Ingests afferent community metadata (New Architecture / Fabric, Expo Go,
 * unmaintained status, quality score) strictly scoped to the packages
 * installed or declared in the target repository.
 */

import fs from 'node:fs';
import path from 'node:path';
import { ReactNativeDirectoryAdapter } from './adapters.js';
import type { RnDirectoryPackageInfo } from './ports.js';
import { CanonicalDatabase } from '../db/sqlite-client.js';

export interface RepoPackageDirectoryInfo {
  packageName: string;
  version: string;
  supportsNewArchitecture: boolean;
  isExpoCompatible: boolean;
  unmaintained: boolean;
  category?: string;
  githubUrl?: string;
  score?: number;
}

export interface RepoDirectoryCache {
  lastSync: string;
  projectRoot: string;
  packages: Record<string, RepoPackageDirectoryInfo>;
}

export class RepoDirectorySyncer {
  private directoryAdapter: ReactNativeDirectoryAdapter;

  constructor(customAdapter?: ReactNativeDirectoryAdapter) {
    this.directoryAdapter = customAdapter ?? new ReactNativeDirectoryAdapter();
  }

  /**
   * Identifies all React Native dependencies declared in the project's package.json.
   */
  public discoverRepoRnPackages(projectRoot: string = process.cwd()): { name: string; version: string }[] {
    const pkgJsonPath = path.resolve(projectRoot, 'package.json');
    const pkgFiles = fs.existsSync(pkgJsonPath) ? [pkgJsonPath] : [];

    for (const subDir of ['packages', 'apps']) {
      const parentDir = path.resolve(projectRoot, subDir);
      if (fs.existsSync(parentDir)) {
        try {
          const entries = fs.readdirSync(parentDir, { withFileTypes: true });
          for (const ent of entries) {
            if (ent.isDirectory()) {
              const subPkg = path.resolve(parentDir, ent.name, 'package.json');
              if (fs.existsSync(subPkg)) {
                pkgFiles.push(subPkg);
              }
            }
          }
        } catch {}
      }
    }

    if (pkgFiles.length === 0) {
      return [];
    }

    const resultMap = new Map<string, string>();

    for (const file of pkgFiles) {
      try {
        const pkgJson = JSON.parse(fs.readFileSync(file, 'utf8'));
        const deps = { ...(pkgJson.dependencies || {}), ...(pkgJson.devDependencies || {}) };

        for (const [name, version] of Object.entries(deps)) {
          if (typeof version !== 'string') continue;
          if (this.isRnCandidate(name, projectRoot)) {
            resultMap.set(name, version);
          }
        }
      } catch {}
    }

    return Array.from(resultMap.entries()).map(([name, version]) => ({ name, version }));
  }

  /**
   * Checks whether a package is a React Native ecosystem package.
   */
  private isRnCandidate(packageName: string, projectRoot: string): boolean {
    if (
      packageName === 'react-native' ||
      packageName.startsWith('@react-native/') ||
      packageName.startsWith('react-native-') ||
      packageName.startsWith('@shopify/react-native') ||
      packageName.startsWith('@react-navigation/') ||
      packageName.startsWith('@expo/') ||
      packageName === 'expo' ||
      packageName.includes('reanimated') ||
      packageName.includes('gesture-handler') ||
      packageName.includes('screens') ||
      packageName.includes('safe-area') ||
      packageName.includes('skia') ||
      packageName.includes('worklets') ||
      packageName.includes('nitro') ||
      packageName.includes('flash-list') ||
      packageName.includes('async-storage')
    ) {
      return true;
    }

    // Secondary check: inspect node_modules package.json keywords / peerDependencies if present
    try {
      const installedPkgJsonPath = path.resolve(projectRoot, 'node_modules', packageName, 'package.json');
      if (fs.existsSync(installedPkgJsonPath)) {
        const installedPkg = JSON.parse(fs.readFileSync(installedPkgJsonPath, 'utf8'));
        const keywords: string[] = installedPkg.keywords || [];
        const peers = installedPkg.peerDependencies || {};
        if (keywords.includes('react-native') || Boolean(peers['react-native'])) {
          return true;
        }
      }
    } catch {}

    return false;
  }

  /**
   * Syncs metadata strictly for the packages used in the project.
   */
  public async syncRepo(
    projectRoot: string = process.cwd(),
    options: { db?: CanonicalDatabase; cacheDir?: string } = {}
  ): Promise<RepoPackageDirectoryInfo[]> {
    const rnPackages = this.discoverRepoRnPackages(projectRoot);
    const syncedRecords: RepoPackageDirectoryInfo[] = [];

    // Concurrently fetch metadata for only the discovered repo packages
    await Promise.all(
      rnPackages.map(async ({ name, version }) => {
        try {
          const info = await this.directoryAdapter.fetchPackageInfo(name);
          const record: RepoPackageDirectoryInfo = {
            packageName: name,
            version: version.replace(/^[\^~]/, ''),
            supportsNewArchitecture: info?.supportsNewArchitecture ?? false,
            isExpoCompatible: info?.isExpoCompatible ?? false,
            unmaintained: info?.unmaintained ?? false,
            category: info?.category ?? 'community-library',
            githubUrl: info?.githubUrl ?? `https://www.npmjs.com/package/${name}`,
            score: info?.score ?? 0
          };
          syncedRecords.push(record);
        } catch {
          syncedRecords.push({
            packageName: name,
            version: version.replace(/^[\^~]/, ''),
            supportsNewArchitecture: false,
            isExpoCompatible: false,
            unmaintained: false,
            category: 'unverified'
          });
        }
      })
    );

    // Persist to local .agents/state/directory-cache.json
    const stateDir = options.cacheDir ?? path.resolve(projectRoot, '.agents', 'state');
    try {
      if (!fs.existsSync(stateDir)) {
        fs.mkdirSync(stateDir, { recursive: true });
      }
      const cachePath = path.resolve(stateDir, 'directory-cache.json');
      const cachePayload: RepoDirectoryCache = {
        lastSync: new Date().toISOString(),
        projectRoot,
        packages: Object.fromEntries(syncedRecords.map((r) => [r.packageName, r]))
      };
      fs.writeFileSync(cachePath, JSON.stringify(cachePayload, null, 2), 'utf8');
    } catch {}

    // Optionally upsert into local SQLite if database is supplied or exists
    const db = options.db;
    if (db) {
      try {
        const nowSec = Math.floor(Date.now() / 1000);
        for (const r of syncedRecords) {
          db.upsertPackage({
            id: r.packageName,
            vendor: 'community',
            category: r.category ?? 'community-library',
            tier: 'COMMUNITY',
            repository_url: r.githubUrl ?? null,
            documentation_url: null,
            created_at: nowSec
          });
          db.upsertVersion({
            package_id: r.packageName,
            version: r.version,
            valid_from_epoch: nowSec,
            valid_to_epoch: null,
            react_native_min: null,
            react_native_max: null,
            supports_new_arch: r.supportsNewArchitecture ? 1 : 0,
            tarball_url: null
          });
        }
      } catch {}
    }

    return syncedRecords;
  }
}
