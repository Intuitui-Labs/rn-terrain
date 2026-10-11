/**
 * @file ports.ts
 * Hexagonal Architecture Domain Ports for Multi-Source Ingestion.
 */

import type { PackageRecord, PackageVersionRecord, ApiSymbolRecord } from '../db/canonical-schema.js';

export interface RnDirectoryPackageInfo {
  name: string;
  npmPkg: string;
  githubUrl: string;
  supportsNewArchitecture: boolean;
  isExpoCompatible: boolean;
  category: string;
}

export interface GitHubRepoTelemetry {
  owner: string;
  repo: string;
  stargazersCount: number;
  openIssuesCount: number;
  closedIssuesCount: number;
  lastCommitEpoch: number;
  releasesCount: number;
}

export interface NpmPackageMetadata {
  name: string;
  latestVersion: string;
  versions: string[];
  releaseEpochs: Record<string, number>;
  peerDependencies: Record<string, string>;
  tarballUrl?: string;
}

export interface BundlephobiaSizeMetrics {
  packageName: string;
  version: string;
  rawSize: number;       // bytes
  gzipSize: number;      // bytes
  dependencyCount: number;
  hasSideEffects: boolean;
}

// ─── Driven Ports (Secondary Interfaces) ─────────────────────────────────────

export interface IRnDirectoryPort {
  fetchDirectoryCatalog(): Promise<RnDirectoryPackageInfo[]>;
  fetchPackageInfo?(packageName: string): Promise<RnDirectoryPackageInfo | null>;
}

export interface IGitHubPort {
  fetchRepoTelemetry(owner: string, repo: string): Promise<GitHubRepoTelemetry>;
}

export interface INpmRegistryPort {
  fetchMetadata(packageName: string): Promise<NpmPackageMetadata>;
}

export interface IBundlephobiaPort {
  fetchSize(packageName: string, version: string): Promise<BundlephobiaSizeMetrics>;
}

export interface IDatabaseSinkPort {
  savePackage(pkg: PackageRecord): void;
  saveVersion(version: PackageVersionRecord): void;
  saveSymbols(symbols: ApiSymbolRecord[]): void;
}
