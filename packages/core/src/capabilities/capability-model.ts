/**
 * @file capability-model.ts
 * Granular Capabilities Registry for React Native, Polyglot Rust & DevTools.
 *
 * Capabilities represent the fundamental WHY behind adding an external dependency.
 */

import { CanonicalDatabase } from '../db/sqlite-client.js';
import type { GranularCapabilityRecord, PackageCapabilityRecord } from '../db/canonical-schema.js';

export interface CanonicalCapabilityDefinition {
  capability: GranularCapabilityRecord;
  providedBy: {
    packageId: string;
    versionIntroduced: string;
    versionDeprecated?: string;
    versionSevered?: string;
    qualityTier: 'CANONICAL' | 'INCUBATING' | 'LEGACY_BRIDGED';
    performanceProfile: 'UI_THREAD_NATIVE' | 'JS_THREAD_ASYNC' | 'WORKLET_NATIVE';
    caveats?: string;
  }[];
}

export const CANONICAL_CAPABILITIES: CanonicalCapabilityDefinition[] = [
  // ─── Gesture Capabilities ──────────────────────────────────────────────────
  {
    capability: {
      id: 'gesture.pan_recognition',
      name: 'Native Pan Gesture Recognition',
      category: 'GESTURE',
      description: 'Multi-touch high-frequency pan/drag recognition executed on the native UI thread without JS bridge roundtrips.',
      level: 'PRIMITIVE',
      fabric_native_required: 1,
      alternative_capabilities: JSON.stringify(['gesture.pan_responder_legacy'])
    },
    providedBy: [
      {
        packageId: 'react-native-gesture-handler',
        versionIntroduced: '2.0.0',
        qualityTier: 'CANONICAL',
        performanceProfile: 'UI_THREAD_NATIVE',
        caveats: 'Requires GestureHandlerRootView wrapper and modern Gesture.Pan() API'
      }
    ]
  },
  {
    capability: {
      id: 'gesture.composed_simultaneous',
      name: 'Simultaneous & Race Gesture Composition',
      category: 'GESTURE',
      description: 'Declarative composition allowing gestures to run simultaneously, exclusively, or sequentially.',
      level: 'COMPOSED',
      fabric_native_required: 1
    },
    providedBy: [
      {
        packageId: 'react-native-gesture-handler',
        versionIntroduced: '2.0.0',
        qualityTier: 'CANONICAL',
        performanceProfile: 'UI_THREAD_NATIVE'
      }
    ]
  },

  // ─── Animation Capabilities ────────────────────────────────────────────────
  {
    capability: {
      id: 'animation.worklet_runtime',
      name: 'Synchronous Worklet Execution Runtime',
      category: 'ANIMATION',
      description: 'Synchronous JavaScript execution on the UI runtime thread at 60/120Hz display refresh cadence.',
      level: 'ARCHITECTURAL',
      fabric_native_required: 1
    },
    providedBy: [
      {
        packageId: 'react-native-reanimated',
        versionIntroduced: '2.0.0',
        qualityTier: 'CANONICAL',
        performanceProfile: 'WORKLET_NATIVE',
        caveats: 'Worklet functions must carry the "worklet"; directive or be compiled via Babel/SWC plugin'
      }
    ]
  },
  {
    capability: {
      id: 'animation.layout_transitions',
      name: 'Layout Animations & Shared Element Transitions',
      category: 'ANIMATION',
      description: 'Automatic native layout transitions (entering, exiting, layout) without manual coordinate calculation.',
      level: 'COMPOSED',
      fabric_native_required: 1
    },
    providedBy: [
      {
        packageId: 'react-native-reanimated',
        versionIntroduced: '2.3.0',
        qualityTier: 'CANONICAL',
        performanceProfile: 'WORKLET_NATIVE'
      }
    ]
  },

  // ─── Storage Capabilities ──────────────────────────────────────────────────
  {
    capability: {
      id: 'storage.synchronous_kv',
      name: 'Zero-Latency Synchronous Key-Value Storage',
      category: 'STORAGE',
      description: 'Memory-mapped file storage via C++ JSI providing synchronous instant reads/writes.',
      level: 'PRIMITIVE',
      fabric_native_required: 0,
      alternative_capabilities: JSON.stringify(['storage.async_kv'])
    },
    providedBy: [
      {
        packageId: 'react-native-mmkv',
        versionIntroduced: '1.0.0',
        qualityTier: 'CANONICAL',
        performanceProfile: 'UI_THREAD_NATIVE',
        caveats: 'Synchronous reads block the JS thread; keep value payload sizes under 5MB'
      }
    ]
  },

  // ─── Monorepo & Package Management Capabilities ────────────────────────────
  {
    capability: {
      id: 'monorepo.isolated_node_modules',
      name: 'Symlink-Isolated Dependency Graph',
      category: 'MONOREPO',
      description: 'Strict non-flat node_modules structure preventing phantom dependencies from leaking across packages.',
      level: 'ARCHITECTURAL',
      fabric_native_required: 0
    },
    providedBy: [
      {
        packageId: 'pnpm',
        versionIntroduced: '8.0.0',
        qualityTier: 'CANONICAL',
        performanceProfile: 'UI_THREAD_NATIVE',
        caveats: 'In React Native, requires Metro symlink resolver enabled'
      }
    ]
  },
  {
    capability: {
      id: 'monorepo.catalog_governance',
      name: 'Centralized Version Catalog Protocol (catalog:)',
      category: 'MONOREPO',
      description: 'Monorepo-wide single-source-of-truth version management in root pnpm-workspace.yaml.',
      level: 'COMPOSED',
      fabric_native_required: 0
    },
    providedBy: [
      {
        packageId: 'pnpm',
        versionIntroduced: '10.6.0',
        qualityTier: 'CANONICAL',
        performanceProfile: 'UI_THREAD_NATIVE'
      }
    ]
  },
  {
    capability: {
      id: 'monorepo.polyglot_rust_workspace',
      name: 'Polyglot Rust/Cargo Workspace Orchestration',
      category: 'MONOREPO',
      description: 'Multi-language monorepo handling native Rust crates (via napi-rs, wasm-pack, or cargo) alongside TypeScript.',
      level: 'ARCHITECTURAL',
      fabric_native_required: 0
    },
    providedBy: [
      {
        packageId: 'pnpm',
        versionIntroduced: '12.11.0',
        qualityTier: 'CANONICAL',
        performanceProfile: 'UI_THREAD_NATIVE'
      }
    ]
  },

  // ─── Agent Tooling & Skills Capabilities ───────────────────────────────────
  {
    capability: {
      id: 'agent.skills_protocol',
      name: 'Agent Skills Standard Manifest & Invocation',
      category: 'AGENT_TOOLING',
      description: 'Standardized skill directories and manifest schemas for autonomous AI agents.',
      level: 'ARCHITECTURAL',
      fabric_native_required: 0
    },
    providedBy: [
      {
        packageId: 'pnpm',
        versionIntroduced: '12.11.0',
        qualityTier: 'CANONICAL',
        performanceProfile: 'UI_THREAD_NATIVE'
      }
    ]
  },

  // ─── Rust Compute & Code Intelligence Capabilities ─────────────────────────
  {
    capability: {
      id: 'rust.tree_sitter_ast',
      name: 'Rust N-API Tree-sitter AST Verification',
      category: 'RUST_COMPUTE',
      description: 'Sub-millisecond structural AST parsing and pattern matching with error-recovery for AI code generation.',
      level: 'PRIMITIVE',
      fabric_native_required: 0
    },
    providedBy: [
      {
        packageId: '@ast-grep/napi',
        versionIntroduced: '0.20.0',
        qualityTier: 'CANONICAL',
        performanceProfile: 'UI_THREAD_NATIVE'
      }
    ]
  },
  {
    capability: {
      id: 'rust.oxc_linting',
      name: 'Hyper-Fast Rust Static Analysis & Linting',
      category: 'RUST_COMPUTE',
      description: '50-100x faster JavaScript and TypeScript linter written in Rust (Oxc toolchain).',
      level: 'PRIMITIVE',
      fabric_native_required: 0
    },
    providedBy: [
      {
        packageId: 'oxlint',
        versionIntroduced: '0.2.0',
        qualityTier: 'CANONICAL',
        performanceProfile: 'UI_THREAD_NATIVE'
      }
    ]
  },
  {
    capability: {
      id: 'rust.fast_regex_traversal',
      name: 'Multi-Threaded Memory-Mapped Fast Regex Search',
      category: 'RUST_COMPUTE',
      description: 'Ripgrep engine scanning millions of lines across monorepos respecting ignore rules in sub-50ms.',
      level: 'PRIMITIVE',
      fabric_native_required: 0
    },
    providedBy: [
      {
        packageId: 'rg',
        versionIntroduced: '13.0.0',
        qualityTier: 'CANONICAL',
        performanceProfile: 'UI_THREAD_NATIVE'
      }
    ]
  }
];

export function seedCanonicalCapabilities(db: CanonicalDatabase): void {
  for (const def of CANONICAL_CAPABILITIES) {
    db.upsertCapability(def.capability);
    for (const p of def.providedBy) {
      db.upsertPackage({
        id: p.packageId,
        vendor: p.packageId.startsWith('@') ? p.packageId.split('/')[0] ?? null : null,
        category: def.capability.category.toLowerCase(),
        tier: 'TIER_1',
        repository_url: `https://github.com/search?q=${p.packageId}`,
        documentation_url: null,
        created_at: 1577836800
      });

      db.linkPackageCapability({
        package_id: p.packageId,
        version_introduced: p.versionIntroduced,
        version_deprecated: p.versionDeprecated ?? null,
        version_severed: p.versionSevered ?? null,
        capability_id: def.capability.id,
        quality_tier: p.qualityTier,
        performance_profile: p.performanceProfile,
        caveats: p.caveats ?? null
      });
    }
  }
}
