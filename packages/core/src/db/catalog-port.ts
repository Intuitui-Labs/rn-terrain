/**
 * @file catalog-port.ts
 * Hexagonal Driven Port (Secondary Interface) for RN-Terrain Catalog & Intelligence.
 *
 * Decouples the Core Domain from concrete storage engines (In-Memory, SQLite, LibSQL, Supabase).
 */

import type {
  PackageRecord,
  PackageVersionRecord,
  ApiSymbolRecord,
  CompatibilityMatrixRecord,
  TechnologyRadarRecord,
  DevToolRecord,
  GranularCapabilityRecord,
  PackageCapabilityRecord,
  EvalScoreRecord,
  DecisionActionRecord,
} from './canonical-schema.js';

export interface PackageFilter {
  vendor?: string;
  category?: string;
  tier?: string;
}

export interface TerrainCatalogPort {
  // Packages
  upsertPackage(pkg: PackageRecord): void;
  getPackage(id: string): PackageRecord | null | undefined;
  listPackages(filter?: PackageFilter): PackageRecord[];
  getAllPackages(): PackageRecord[];

  // Versions
  upsertPackageVersion(version: PackageVersionRecord): void;
  upsertVersion(version: PackageVersionRecord): void;
  getPackageVersions(packageId: string): PackageVersionRecord[];
  getVersions(packageId: string): PackageVersionRecord[];
  getLatestVersion(packageId: string): PackageVersionRecord | null;

  // Symbols
  upsertApiSymbol(symbol: ApiSymbolRecord): void;
  upsertSymbol(symbol: ApiSymbolRecord): void;
  getApiSymbols(packageId: string, version?: string): ApiSymbolRecord[];
  getSymbols(packageId: string, version?: string): ApiSymbolRecord[];
  getSeveredSymbols(packageId: string): ApiSymbolRecord[];

  // Compatibility
  upsertCompatibilityMatrix(matrix: CompatibilityMatrixRecord): void;
  getCompatibilityMatrix(packageA: string, packageB: string): CompatibilityMatrixRecord[];

  // Radar
  upsertRadarRecord(record: TechnologyRadarRecord): void;
  getRadarRecords(verdict?: string): TechnologyRadarRecord[];
  getAllRadarRecords(): TechnologyRadarRecord[];
  getRadarRecord(id: string): TechnologyRadarRecord | null | undefined;

  // Dev Tools
  upsertDevTool(tool: DevToolRecord): void;
  listDevTools(category?: string): DevToolRecord[];
  getAllDevTools(): DevToolRecord[];

  // Granular Capabilities
  upsertGranularCapability(cap: GranularCapabilityRecord): void;
  upsertCapability(cap: GranularCapabilityRecord): void;
  listGranularCapabilities(category?: string): GranularCapabilityRecord[];
  getAllCapabilities(): GranularCapabilityRecord[];
  upsertPackageCapability(mapping: PackageCapabilityRecord): void;
  getPackageCapabilities(packageId: string): PackageCapabilityRecord[];
  getPackagesByCapability(capabilityId: string): PackageCapabilityRecord[];
  getProvidersForCapability(
    capabilityId: string
  ): { packageId: string; qualityTier: string; performanceProfile: string | null }[];

  // Scores & Decisions
  upsertEvalScore?(score: EvalScoreRecord): void;
  getEvalScore?(packageId: string, version: string): EvalScoreRecord | null | undefined;
  upsertDecisionAction?(action: DecisionActionRecord): void;
  getDecisionActions?(entityId: string): DecisionActionRecord[];
}
