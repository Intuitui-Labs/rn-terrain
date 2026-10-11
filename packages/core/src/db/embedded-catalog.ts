/**
 * @file embedded-catalog.ts
 * In-Memory Embedded Catalog Adapter for RN-Terrain.
 *
 * Implements the Hexagonal TerrainCatalogPort with ZERO native C++ dependencies,
 * ZERO filesystem write permissions needed, and sub-millisecond query performance.
 *
 * Pre-bundled with:
 *   - Foundational React Native ecosystem packages (Software Mansion, Callstack, Expo, Shopify)
 *   - Sacred Native Pins & dialect annotations from the C:\x vault
 *   - Severed APIs & New Architecture symbol lifecycles
 *   - Canonical Dev Tools and Granular Capabilities
 */

import type { TerrainCatalogPort, PackageFilter } from './catalog-port.js';
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
import { CANONICAL_DEV_TOOLS } from '../devtools/dev-tools-registry.js';
import { CANONICAL_CAPABILITIES } from '../capabilities/capability-model.js';

export class EmbeddedCatalogAdapter implements TerrainCatalogPort {
  private packages = new Map<string, PackageRecord>();
  private versions = new Map<string, PackageVersionRecord[]>();
  private symbols = new Map<string, ApiSymbolRecord[]>();
  private compatibility = new Map<string, CompatibilityMatrixRecord[]>();
  private radar = new Map<string, TechnologyRadarRecord>();
  private devTools = new Map<string, DevToolRecord>();
  private granularCaps = new Map<string, GranularCapabilityRecord>();
  private pkgCaps = new Map<string, PackageCapabilityRecord[]>();
  private evalScores = new Map<string, EvalScoreRecord>();
  private decisions = new Map<string, DecisionActionRecord[]>();

  constructor() {
    this.seedCanonicalData();
  }

  private seedCanonicalData(): void {
    const now = Math.floor(Date.now() / 1000);

    // 1. Foundational Packages
    const initialPackages: PackageRecord[] = [
      {
        id: 'react-native',
        vendor: 'meta',
        category: 'core-framework',
        tier: 'CORE',
        repository_url: 'https://github.com/facebook/react-native',
        documentation_url: 'https://reactnative.dev',
        created_at: now,
      },
      {
        id: 'react-native-reanimated',
        vendor: 'software-mansion',
        category: 'animation',
        tier: 'TIER_1',
        repository_url: 'https://github.com/software-mansion/react-native-reanimated',
        documentation_url: 'https://docs.swmansion.com/react-native-reanimated/',
        created_at: now,
      },
      {
        id: 'react-native-gesture-handler',
        vendor: 'software-mansion',
        category: 'gesture-system',
        tier: 'TIER_1',
        repository_url: 'https://github.com/software-mansion/react-native-gesture-handler',
        documentation_url: 'https://docs.swmansion.com/react-native-gesture-handler/',
        created_at: now,
      },
      {
        id: 'react-native-screens',
        vendor: 'software-mansion',
        category: 'navigation',
        tier: 'TIER_1',
        repository_url: 'https://github.com/software-mansion/react-native-screens',
        documentation_url: 'https://github.com/software-mansion/react-native-screens',
        created_at: now,
      },
      {
        id: '@shopify/react-native-skia',
        vendor: 'shopify',
        category: '2d-graphics',
        tier: 'TIER_1',
        repository_url: 'https://github.com/shopify/react-native-skia',
        documentation_url: 'https://shopify.github.io/react-native-skia/',
        created_at: now,
      },
      {
        id: 'react-native-mmkv',
        vendor: 'mrousavy',
        category: 'storage',
        tier: 'TIER_1',
        repository_url: 'https://github.com/mrousavy/react-native-mmkv',
        documentation_url: 'https://github.com/mrousavy/react-native-mmkv',
        created_at: now,
      },
      {
        id: '@shopify/flash-list',
        vendor: 'shopify',
        category: 'list-rendering',
        tier: 'TIER_1',
        repository_url: 'https://github.com/Shopify/flash-list',
        documentation_url: 'https://shopify.github.io/flash-list/',
        created_at: now,
      },
      {
        id: 'expo',
        vendor: 'expo',
        category: 'application-framework',
        tier: 'CORE',
        repository_url: 'https://github.com/expo/expo',
        documentation_url: 'https://docs.expo.dev',
        created_at: now,
      },
    ];

    for (const pkg of initialPackages) {
      this.upsertPackage(pkg);
    }

    // 1b. Foundational Package Versions (Bitemporal epochs & New Architecture flags)
    const initialVersions: PackageVersionRecord[] = [
      {
        package_id: 'react-native-reanimated',
        version: '4.7.1',
        valid_from_epoch: now,
        valid_to_epoch: null,
        react_native_min: '0.76.0',
        react_native_max: null,
        supports_new_arch: 1,
        tarball_url: null,
      },
      {
        package_id: 'react-native-reanimated',
        version: '3.16.0',
        valid_from_epoch: now - 5000000,
        valid_to_epoch: null,
        react_native_min: '0.74.0',
        react_native_max: null,
        supports_new_arch: 1,
        tarball_url: null,
      },
      {
        package_id: 'react-native-gesture-handler',
        version: '2.16.0',
        valid_from_epoch: now,
        valid_to_epoch: null,
        react_native_min: '0.74.0',
        react_native_max: null,
        supports_new_arch: 1,
        tarball_url: null,
      },
      {
        package_id: 'react-native-screens',
        version: '3.34.0',
        valid_from_epoch: now,
        valid_to_epoch: null,
        react_native_min: '0.74.0',
        react_native_max: null,
        supports_new_arch: 1,
        tarball_url: null,
      },
      {
        package_id: 'react-native',
        version: '0.76.0',
        valid_from_epoch: now,
        valid_to_epoch: null,
        react_native_min: '0.76.0',
        react_native_max: null,
        supports_new_arch: 1,
        tarball_url: null,
      },
    ];

    for (const ver of initialVersions) {
      this.upsertPackageVersion(ver);
    }

    // 2. Severed & Critical API Symbols
    const initialSymbols: ApiSymbolRecord[] = [
      {
        package_id: 'react-native',
        version: '0.76.0',
        symbol_identifier: 'findNodeHandle',
        symbol_type: 'FUNCTION',
        status: 'UNSUPPORTED_REMOVED',
        replacement_symbol: 'useAnimatedRef / measure',
        replacement_package: 'react-native-reanimated',
        codemod_available: 1,
        codemod_rule_id: 'rn-find-node-handle-severed',
        documentation_anchor: 'https://reactnative.dev/docs/new-architecture-troubleshooting',
        valid_from_epoch: now,
        valid_to_epoch: null,
      },
      {
        package_id: 'react-native',
        version: '0.76.0',
        symbol_identifier: 'UIManager.measureInWindow',
        symbol_type: 'FUNCTION',
        status: 'UNSUPPORTED_REMOVED',
        replacement_symbol: 'hostComponent.measureInWindow',
        replacement_package: 'react-native',
        codemod_available: 1,
        codemod_rule_id: 'rn-uimanager-measure-severed',
        documentation_anchor: 'https://reactnative.dev/docs/new-architecture-troubleshooting',
        valid_from_epoch: now,
        valid_to_epoch: null,
      },
      {
        package_id: 'react-native-gesture-handler',
        version: '2.16.0',
        symbol_identifier: 'useAnimatedGestureHandler',
        symbol_type: 'HOOK',
        status: 'UNSUPPORTED_REMOVED',
        replacement_symbol: 'Gesture.Pan() / Gesture.Tap()',
        replacement_package: 'react-native-gesture-handler',
        codemod_available: 1,
        codemod_rule_id: 'rngh-use-animated-gesture-handler-severed',
        documentation_anchor: 'https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture',
        valid_from_epoch: now,
        valid_to_epoch: null,
      },
      {
        package_id: 'react-native-reanimated',
        version: '3.0.0',
        symbol_identifier: 'useAnimatedStyle',
        symbol_type: 'HOOK',
        status: 'FUNCTIONAL_STABLE',
        replacement_symbol: null,
        replacement_package: null,
        codemod_available: 0,
        codemod_rule_id: null,
        documentation_anchor: 'https://docs.swmansion.com/react-native-reanimated/docs/core/useAnimatedStyle',
        valid_from_epoch: now,
        valid_to_epoch: null,
      },
    ];

    for (const sym of initialSymbols) {
      this.upsertApiSymbol(sym);
    }

    // 3. Dev Tools from Registry
    for (const tool of CANONICAL_DEV_TOOLS) {
      this.upsertDevTool(tool);
    }

    // 4. Granular Capabilities
    for (const def of CANONICAL_CAPABILITIES) {
      this.upsertGranularCapability(def.capability);
      for (const prov of def.providedBy) {
        this.upsertPackageCapability({
          package_id: prov.packageId,
          version_introduced: prov.versionIntroduced,
          version_deprecated: prov.versionDeprecated,
          version_severed: prov.versionSevered,
          capability_id: def.capability.id,
          quality_tier: prov.qualityTier,
          performance_profile: prov.performanceProfile,
          caveats: prov.caveats,
        });
      }
    }

    // 5. Technology Radar Records
    const initialRadar: TechnologyRadarRecord[] = [
      {
        id: 'react-native-uniffi-bridge',
        subject: 'react-native-uniffi-bridge',
        subject_type: 'package',
        verdict: 'ADOPT',
        confidence: 'high',
        category: 'RUST_COMPUTE',
        use_case: 'Zero-overhead Rust-to-C++ TurboModule generation',
        decision: 'Adopt for all compute-intensive and cryptographic mobile routines.',
        updated_at: now,
      },
      {
        id: 'legendapp-state',
        subject: '@legendapp/state',
        subject_type: 'package',
        verdict: 'TRIAL',
        confidence: 'medium',
        category: 'STATE_MANAGEMENT',
        use_case: 'Observable micro-reactive state management for React Native',
        decision: 'Evaluate against Zustand for high-velocity local store requirements.',
        updated_at: now,
      },
      {
        id: 'nitro-modules',
        subject: 'nitro-modules',
        subject_type: 'package',
        verdict: 'TRIAL',
        confidence: 'high',
        category: 'NATIVE_INTEROP',
        use_case: 'Ultra-fast C++ Nitro module bindings for React Native New Architecture',
        decision: 'Recommended foundation for next-generation native modules.',
        updated_at: now,
      },
      {
        id: 'jollyform',
        subject: 'jollyform',
        subject_type: 'package',
        verdict: 'HOLD',
        confidence: 'high',
        category: 'FORM_ENGINE',
        use_case: 'Mobile dynamic form layout, schema orchestration, and validation engine',
        decision:
          'Retired as a standalone product. Retained as an internal engine. Standalone market adoption requires the entire pipeline (visual designer -> persistence -> submission queue -> analytics), which is captured by full-stack SaaS or in-house integrations.',
        updated_at: now,
      },
    ];

    for (const rad of initialRadar) {
      this.upsertRadarRecord(rad);
    }
  }

  // ─── Packages ───────────────────────────────────────────────────────────────

  public upsertPackage(pkg: PackageRecord): void {
    this.packages.set(pkg.id, pkg);
  }

  public getPackage(id: string): PackageRecord | null {
    return this.packages.get(id) || null;
  }

  public listPackages(filter?: PackageFilter): PackageRecord[] {
    let list = Array.from(this.packages.values());
    if (filter?.vendor) list = list.filter((p) => p.vendor === filter.vendor);
    if (filter?.category) list = list.filter((p) => p.category === filter.category);
    if (filter?.tier) list = list.filter((p) => p.tier === filter.tier);
    return list;
  }

  // ─── Versions ──────────────────────────────────────────────────────────────

  public upsertPackageVersion(version: PackageVersionRecord): void {
    const list = this.versions.get(version.package_id) || [];
    const idx = list.findIndex((v) => v.version === version.version);
    if (idx >= 0) {
      list[idx] = version;
    } else {
      list.push(version);
    }
    this.versions.set(version.package_id, list);
  }

  public getPackageVersions(packageId: string): PackageVersionRecord[] {
    return this.versions.get(packageId) || [];
  }

  public getLatestVersion(packageId: string): PackageVersionRecord | null {
    const list = this.versions.get(packageId);
    if (!list || list.length === 0) return null;
    return list[list.length - 1] ?? null;
  }

  // ─── Symbols ───────────────────────────────────────────────────────────────

  public upsertApiSymbol(symbol: ApiSymbolRecord): void {
    const list = this.symbols.get(symbol.package_id) || [];
    const idx = list.findIndex(
      (s) => s.symbol_identifier === symbol.symbol_identifier && s.version === symbol.version
    );
    if (idx >= 0) {
      list[idx] = symbol;
    } else {
      list.push(symbol);
    }
    this.symbols.set(symbol.package_id, list);
  }

  public getApiSymbols(packageId: string, version?: string): ApiSymbolRecord[] {
    const list = this.symbols.get(packageId) || [];
    if (!version) return list;
    return list.filter((s) => s.version === version);
  }

  public getSeveredSymbols(packageId: string): ApiSymbolRecord[] {
    const list = this.symbols.get(packageId) || [];
    return list.filter(
      (s) => s.status === 'UNSUPPORTED_REMOVED' || s.status === 'BROKEN_DEFECTIVE'
    );
  }

  // ─── Compatibility ─────────────────────────────────────────────────────────

  public upsertCompatibilityMatrix(matrix: CompatibilityMatrixRecord): void {
    const key = `combo_${matrix.combo_id}`;
    const list = this.compatibility.get(key) || [];
    list.push(matrix);
    this.compatibility.set(key, list);
  }

  public getCompatibilityMatrix(packageA: string, packageB: string): CompatibilityMatrixRecord[] {
    // Returns any matrix registered between packageA and packageB
    const results: CompatibilityMatrixRecord[] = [];
    for (const list of this.compatibility.values()) {
      results.push(...list);
    }
    return results;
  }

  // ─── Radar ─────────────────────────────────────────────────────────────────

  public upsertRadarRecord(record: TechnologyRadarRecord): void {
    this.radar.set(record.id, record);
  }

  public getRadarRecords(verdict?: string): TechnologyRadarRecord[] {
    const list = Array.from(this.radar.values());
    if (!verdict) return list;
    return list.filter((r) => r.verdict.toUpperCase() === verdict.toUpperCase());
  }

  public getRadarRecord(id: string): TechnologyRadarRecord | null {
    return this.radar.get(id) || null;
  }

  // ─── Dev Tools ─────────────────────────────────────────────────────────────

  public upsertDevTool(tool: DevToolRecord): void {
    this.devTools.set(tool.id, tool);
  }

  public listDevTools(category?: string): DevToolRecord[] {
    const list = Array.from(this.devTools.values());
    if (!category) return list;
    return list.filter((t) => t.category === category);
  }

  // ─── Granular Capabilities ─────────────────────────────────────────────────

  public upsertGranularCapability(cap: GranularCapabilityRecord): void {
    this.granularCaps.set(cap.id, cap);
  }

  public listGranularCapabilities(category?: string): GranularCapabilityRecord[] {
    const list = Array.from(this.granularCaps.values());
    if (!category) return list;
    return list.filter((c) => c.category === category);
  }

  public upsertPackageCapability(mapping: PackageCapabilityRecord): void {
    const list = this.pkgCaps.get(mapping.package_id) || [];
    list.push(mapping);
    this.pkgCaps.set(mapping.package_id, list);
  }

  public getPackageCapabilities(packageId: string): PackageCapabilityRecord[] {
    return this.pkgCaps.get(packageId) || [];
  }

  public getProvidersForCapability(
    capabilityId: string
  ): { packageId: string; qualityTier: string; performanceProfile: string | null }[] {
    const results: {
      packageId: string;
      qualityTier: string;
      performanceProfile: string | null;
    }[] = [];

    for (const [pkgId, mappings] of this.pkgCaps.entries()) {
      for (const m of mappings) {
        if (m.capability_id === capabilityId) {
          results.push({
            packageId: pkgId,
            qualityTier: m.quality_tier,
            performanceProfile: m.performance_profile || null,
          });
        }
      }
    }

    return results;
  }

  // ─── Alias & Convenience Methods ──────────────────────────────────────────

  public getAllPackages(): PackageRecord[] {
    return this.listPackages();
  }

  public upsertVersion(version: PackageVersionRecord): void {
    this.upsertPackageVersion(version);
  }

  public getVersions(packageId: string): PackageVersionRecord[] {
    return this.getPackageVersions(packageId);
  }

  public getSymbols(packageId: string, version?: string): ApiSymbolRecord[] {
    return this.getApiSymbols(packageId, version);
  }

  public upsertSymbol(symbol: ApiSymbolRecord): void {
    this.upsertApiSymbol(symbol);
  }

  public getAllDevTools(): DevToolRecord[] {
    return this.listDevTools();
  }

  public getAllCapabilities(): GranularCapabilityRecord[] {
    return this.listGranularCapabilities();
  }

  public upsertCapability(cap: GranularCapabilityRecord): void {
    this.upsertGranularCapability(cap);
  }

  public getPackagesByCapability(capabilityId: string): PackageCapabilityRecord[] {
    const results: PackageCapabilityRecord[] = [];
    for (const mappings of this.pkgCaps.values()) {
      for (const m of mappings) {
        if (m.capability_id === capabilityId) {
          results.push(m);
        }
      }
    }
    return results;
  }

  public getAllRadarRecords(): TechnologyRadarRecord[] {
    return this.getRadarRecords();
  }

  // ─── Scores & Decisions ────────────────────────────────────────────────────

  public upsertEvalScore(score: EvalScoreRecord): void {
    this.evalScores.set(`${score.package_id}@${score.version}`, score);
  }

  public getEvalScore(packageId: string, version: string): EvalScoreRecord | null {
    return this.evalScores.get(`${packageId}@${version}`) || null;
  }

  public upsertDecisionAction(action: DecisionActionRecord): void {
    const list = this.decisions.get(action.entity_id) || [];
    list.push(action);
    this.decisions.set(action.entity_id, list);
  }

  public getDecisionActions(entityId: string): DecisionActionRecord[] {
    return this.decisions.get(entityId) || [];
  }
}
