/**
 * @file capability-resolver.ts
 * Capability Resolver Engine for Ecosystem Packages and Developer Tools.
 *
 * Resolves dependencies based on requested functional capabilities,
 * matching modern, non-severed libraries and tools.
 */

import { CanonicalDatabase } from '../db/sqlite-client.js';
import {
  seedCanonicalCapabilities,
  CANONICAL_CAPABILITIES,
  type CanonicalCapabilityDefinition
} from './capability-model.js';
import type { GranularCapabilityRecord, PackageCapabilityRecord } from '../db/canonical-schema.js';

export interface CapabilityResolution {
  capabilityId: string;
  name: string;
  category: string;
  description: string | null;
  fabricNativeRequired: boolean;
  recommendedPackage: {
    packageId: string;
    versionIntroduced: string;
    qualityTier: string;
    performanceProfile: string | null;
    caveats: string | null;
  } | null;
  allProviders: {
    packageId: string;
    versionIntroduced: string;
    qualityTier: string;
    caveats: string | null;
  }[];
  alternativeCapabilities: string[];
}

export interface PackageCapabilityManifest {
  packageId: string;
  targetVersion: string;
  capabilitiesCount: number;
  capabilities: {
    id: string;
    name: string;
    category: string;
    qualityTier: string;
    versionIntroduced: string;
    isNewInThisVersion: boolean;
  }[];
}

export class CapabilityResolver {
  constructor(private readonly db: CanonicalDatabase) {
    seedCanonicalCapabilities(this.db);
  }

  public resolveCapability(capabilityId: string): CapabilityResolution | null {
    const all = this.db.getAllCapabilities();
    const cap = all.find((c) => c.id === capabilityId);
    if (!cap) return null;

    const providers = this.db.getPackagesByCapability(capabilityId);
    const recommended = providers.find((p) => p.quality_tier === 'CANONICAL') ?? providers[0];

    const alts: string[] = cap.alternative_capabilities
      ? (JSON.parse(cap.alternative_capabilities) as string[])
      : [];

    return {
      capabilityId: cap.id,
      name: cap.name,
      category: cap.category,
      description: cap.description,
      fabricNativeRequired: cap.fabric_native_required === 1,
      recommendedPackage: recommended
        ? {
            packageId: recommended.package_id,
            versionIntroduced: recommended.version_introduced,
            qualityTier: recommended.quality_tier,
            performanceProfile: recommended.performance_profile ?? null,
            caveats: recommended.caveats ?? null
          }
        : null,
      allProviders: providers.map((p) => ({
        packageId: p.package_id,
        versionIntroduced: p.version_introduced,
        qualityTier: p.quality_tier,
        caveats: p.caveats ?? null
      })),
      alternativeCapabilities: alts
    };
  }

  public inspectPackageCapabilities(packageId: string, version: string = 'latest'): PackageCapabilityManifest {
    const caps = this.db.getCapabilitiesByPackage(packageId);

    return {
      packageId,
      targetVersion: version,
      capabilitiesCount: caps.length,
      capabilities: caps.map((c) => ({
        id: c.id,
        name: c.name,
        category: c.category,
        qualityTier: c.quality_tier,
        versionIntroduced: c.version_introduced,
        isNewInThisVersion: version !== 'latest' && c.version_introduced === version
      }))
    };
  }

  public listAllCapabilities(category?: string): GranularCapabilityRecord[] {
    const all = this.db.getAllCapabilities();
    if (!category) return all;
    return all.filter((c) => c.category.toUpperCase() === category.toUpperCase());
  }
}
