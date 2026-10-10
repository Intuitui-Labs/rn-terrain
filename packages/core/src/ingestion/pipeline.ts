/**
 * @file pipeline.ts
 * Hexagonal Ingestion Pipeline Orchestrator.
 *
 * Coordinates data ingestion across React Native Directory, GitHub,
 * npm Registry, and Bundlephobia, persisting normalized records to SQLite.
 */

import {
  type IRnDirectoryPort,
  type IGitHubPort,
  type INpmRegistryPort,
  type IBundlephobiaPort,
  type IDatabaseSinkPort
} from './ports.js';
import {
  ReactNativeDirectoryAdapter,
  GitHubAdapter,
  NpmRegistryAdapter,
  BundlephobiaAdapter,
  DatabaseSinkAdapter
} from './adapters.js';
import { CanonicalDatabase } from '../db/sqlite-client.js';

export interface IngestionResult {
  packageName: string;
  versionsIngested: number;
  latestVersion: string;
  supportsNewArchitecture: boolean;
  bundleGzipBytes: number;
  githubStars: number;
}

export class HexagonalIngestionPipeline {
  constructor(
    private readonly rnDirectoryPort: IRnDirectoryPort = new ReactNativeDirectoryAdapter(),
    private readonly githubPort: IGitHubPort = new GitHubAdapter(),
    private readonly npmRegistryPort: INpmRegistryPort = new NpmRegistryAdapter(),
    private readonly bundlephobiaPort: IBundlephobiaPort = new BundlephobiaAdapter(),
    private readonly dbSinkPort?: IDatabaseSinkPort
  ) {}

  public async ingestPackage(packageName: string, db?: CanonicalDatabase): Promise<IngestionResult> {
    const sink = this.dbSinkPort ?? new DatabaseSinkAdapter(db ?? new CanonicalDatabase());

    // 1. Fetch npm metadata
    const npmMeta = await this.npmRegistryPort.fetchMetadata(packageName);

    // 2. Fetch Directory info if available
    const directoryList = await this.rnDirectoryPort.fetchDirectoryCatalog();
    const dirInfo = directoryList.find((d) => d.npmPkg === packageName);

    // 3. Fetch GitHub telemetry
    let ghStars = 1000;
    if (dirInfo?.githubUrl) {
      const match = dirInfo.githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (match && match[1] && match[2]) {
        const ghMeta = await this.githubPort.fetchRepoTelemetry(match[1], match[2]);
        ghStars = ghMeta.stargazersCount;
      }
    }

    // 4. Fetch Bundlephobia size for latest version
    const bundleSize = await this.bundlephobiaPort.fetchSize(packageName, npmMeta.latestVersion);

    // 5. Persist Package Entity
    sink.savePackage({
      id: packageName,
      vendor: dirInfo ? dirInfo.githubUrl.split('/')[3] ?? null : null,
      category: dirInfo?.category ?? 'general',
      tier: 'TIER_1',
      repository_url: dirInfo?.githubUrl ?? null,
      documentation_url: null,
      created_at: Math.floor(Date.now() / 1000)
    });

    // 6. Persist Latest Version Epoch
    sink.saveVersion({
      package_id: packageName,
      version: npmMeta.latestVersion,
      valid_from_epoch: npmMeta.releaseEpochs[npmMeta.latestVersion] ?? Math.floor(Date.now() / 1000),
      valid_to_epoch: null,
      react_native_min: '0.74.0',
      react_native_max: null,
      supports_new_arch: dirInfo?.supportsNewArchitecture ? 1 : 0,
      tarball_url: npmMeta.tarballUrl ?? null
    });

    return {
      packageName,
      versionsIngested: npmMeta.versions.length,
      latestVersion: npmMeta.latestVersion,
      supportsNewArchitecture: dirInfo?.supportsNewArchitecture ?? true,
      bundleGzipBytes: bundleSize.gzipSize,
      githubStars: ghStars
    };
  }
}
