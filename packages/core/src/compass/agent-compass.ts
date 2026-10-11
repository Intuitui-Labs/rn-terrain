/**
 * @file agent-compass.ts
 * The Pre-Flight Agent Compass: The First Stop for AI Coding Agents.
 *
 * Provides a dense, structured, grounded briefing of:
 *   - Banned / Severed APIs (explicit blacklist)
 *   - Allowed Modern APIs (canonical whitelist)
 *   - Architecture Mode (Fabric / TurboModules readiness)
 *   - Known Peer Dependency Collisions
 *   - Strict Instruction for Context Injection
 */

import fs from 'node:fs';
import path from 'node:path';
import semver from 'semver';
import type { TerrainCatalogPort } from '../db/catalog-port.js';
import { createCatalog } from '../db/sqlite-client.js';
import { NodeModulesAffordanceEngine } from './node-modules-affordance.js';

export interface BannedSymbol {
  identifier: string;
  status: string;
  replacement: string | null;
  codemodHint: string | null;
}

export interface PeerConflict {
  peerPackage: string;
  safeRange: string;
  conflictNote: string;
  severity: number;
}

export interface AgentCompassBriefing {
  package: string;
  version: string;
  architecture: 'NEW_ARCHITECTURE_FABRIC_READY' | 'LEGACY_INTEROP' | 'UNKNOWN';
  bannedSeveredSymbols: BannedSymbol[];
  allowedModernSymbols: string[];
  knownPeerConflicts: PeerConflict[];
  preflightInstruction: string;
  unmaintained?: boolean;
  isExpoCompatible?: boolean;
}

export function generateAgentCompass(
  packageName: string,
  targetVersion: string = 'latest',
  customDb?: TerrainCatalogPort
): AgentCompassBriefing {
  const db = customDb ?? createCatalog();

  const versions = db.getVersions(packageName);
  let activeVersion = targetVersion === 'latest' ? versions[0]?.version ?? 'latest' : targetVersion;
  const versionRecord = versions.find((v) => v.version === activeVersion) ?? versions[0];

  const symbols = db.getSymbols(packageName, activeVersion);

  const bannedSeveredSymbols: BannedSymbol[] = symbols
    .filter((s) => s.status === 'UNSUPPORTED_REMOVED' || s.status === 'BROKEN_DEFECTIVE')
    .map((s) => ({
      identifier: s.symbol_identifier,
      status: s.status,
      replacement: s.replacement_symbol,
      codemodHint: s.codemod_rule_id
        ? `Apply rule '${s.codemod_rule_id}': replace ${s.symbol_identifier} with ${s.replacement_symbol ?? 'modern equivalent'}`
        : null
    }));

  const allowedModernSymbols: string[] = symbols
    .filter((s) => s.status === 'FUNCTIONAL_STABLE' || s.status === 'NEW_CAPABILITY')
    .map((s) => s.symbol_identifier);

  let architecture: 'NEW_ARCHITECTURE_FABRIC_READY' | 'LEGACY_INTEROP' | 'UNKNOWN' = 'UNKNOWN';
  if (versionRecord && versionRecord.supports_new_arch !== null) {
    architecture =
      versionRecord.supports_new_arch === 1
        ? 'NEW_ARCHITECTURE_FABRIC_READY'
        : 'LEGACY_INTEROP';
  }

  // Cross-verify with known ecosystem grounding & physical affordances:
  // Reanimated 4 requires New Architecture Fabric; it cannot be LEGACY_INTEROP
  if (
    packageName === 'react-native-reanimated' &&
    (activeVersion === 'latest' || activeVersion.startsWith('4.') || activeVersion.startsWith('3.'))
  ) {
    architecture = 'NEW_ARCHITECTURE_FABRIC_READY';
  } else if (NodeModulesAffordanceEngine.checkNewArchSupport(packageName)) {
    architecture = 'NEW_ARCHITECTURE_FABRIC_READY';
  } else if (architecture === 'UNKNOWN') {
    // Grounded fallbacks for foundational tier-1 ecosystem packages when local database is unseeded
    const isModernRN =
      packageName === 'react-native' &&
      (activeVersion === 'latest' ||
        Boolean(semver.valid(semver.clean(activeVersion) ?? '') && semver.gte(semver.clean(activeVersion)!, '0.76.0')));

    if (
      packageName === 'react-native-gesture-handler' ||
      packageName === 'react-native-screens' ||
      packageName === 'react-native-nitro-modules' ||
      packageName === 'react-native-worklets' ||
      packageName === 'react-native-mmkv' ||
      packageName === '@shopify/react-native-skia' ||
      packageName === '@shopify/flash-list' ||
      isModernRN
    ) {
      architecture = 'NEW_ARCHITECTURE_FABRIC_READY';
    }
  }

  // If no symbols are recorded yet in DB, supply canonical groundings or fall back to physical node_modules
  if (bannedSeveredSymbols.length === 0 && allowedModernSymbols.length === 0) {
    if (packageName === 'react-native-gesture-handler') {
      bannedSeveredSymbols.push({
        identifier: 'usePanGesture',
        status: 'UNSUPPORTED_REMOVED',
        replacement: 'Gesture.Pan()',
        codemodHint: 'Wrap with GestureDetector: <GestureDetector gesture={Gesture.Pan()} />'
      });
      allowedModernSymbols.push('Gesture.Pan()', 'Gesture.Tap()', 'GestureDetector', 'GestureHandlerRootView');
    } else if (packageName === 'react-native-reanimated') {
      bannedSeveredSymbols.push({
        identifier: 'useAnimatedGestureHandler',
        status: 'UNSUPPORTED_REMOVED',
        replacement: 'Gesture.Pan().onUpdate(...)',
        codemodHint: 'Migrate to RNGH Gestures: <GestureDetector gesture={Gesture.Pan().onUpdate(...)} />'
      });
      bannedSeveredSymbols.push({
        identifier: 'interpolateNode',
        status: 'UNSUPPORTED_REMOVED',
        replacement: 'interpolate',
        codemodHint: 'Replace legacy interpolateNode with modern interpolate'
      });
      allowedModernSymbols.push(
        'useAnimatedStyle',
        'useSharedValue',
        'withSpring',
        'withTiming',
        'FadeIn',
        'FadeOut',
        'LinearTransition',
        'react-native-worklets'
      );
    } else {
      // Dynamic fallback: inspect physical node_modules affordances for any package in user's project
      try {
        const engine = new NodeModulesAffordanceEngine();
        const affordance = engine.generateAffordance(packageName);
        if (affordance && affordance.installedVersion) {
          if (activeVersion === 'latest' || activeVersion === 'unknown') {
            activeVersion = affordance.installedVersion;
          }
          for (const h of affordance.exportedHooks) {
            if (!allowedModernSymbols.includes(h)) allowedModernSymbols.push(h);
          }
          for (const c of affordance.exportedComponents) {
            if (!allowedModernSymbols.includes(c)) allowedModernSymbols.push(c);
          }
          for (const f of affordance.exportedFunctions) {
            if (!allowedModernSymbols.includes(f)) allowedModernSymbols.push(f);
          }
          if (architecture === 'UNKNOWN') {
            architecture = engine.checkNewArchSupport(packageName)
              ? 'NEW_ARCHITECTURE_FABRIC_READY'
              : 'LEGACY_INTEROP';
          }
        }
      } catch {
        // Package is not installed locally in node_modules either; clean unknown briefing returned
      }
    }
  }

  // Retrieve compatibility combos across known ecosystem peers
  const matrix = db.getCompatibilityMatrix
    ? db.getCompatibilityMatrix(packageName, 'react-native-reanimated')
    : (db as any).getCompatibility
      ? (db as any).getCompatibility(`${packageName}:react-native-reanimated`)
      : [];

  if (packageName !== 'react-native' && db.getCompatibilityMatrix) {
    matrix.push(...db.getCompatibilityMatrix(packageName, 'react-native'));
  }

  const knownPeerConflicts: PeerConflict[] = matrix
    .filter((m: any) => m.status === 'BREAKING_COLLISION' || m.status === 'BROKEN_NATIVE')
    .map((m: any) => ({
      peerPackage: m.package_b ?? 'react-native-reanimated',
      safeRange: m.version_b_range,
      conflictNote: m.what_broke ?? 'Native ABI or runtime collision',
      severity: m.collision_severity
    }));

  // Ingest cached React Native Directory community metadata if available
  let directoryInfo: any = null;
  try {
    const dirCachePath = path.resolve(process.cwd(), '.agents', 'state', 'directory-cache.json');
    if (fs.existsSync(dirCachePath)) {
      const cache = JSON.parse(fs.readFileSync(dirCachePath, 'utf8'));
      directoryInfo = cache.packages?.[packageName];
      if (directoryInfo) {
        if (directoryInfo.supportsNewArchitecture) {
          architecture = 'NEW_ARCHITECTURE_FABRIC_READY';
        } else if (directoryInfo.supportsNewArchitecture === false) {
          architecture = 'LEGACY_INTEROP';
        }
      }
    }
  } catch {}

  let preflightInstruction = `[PRE-FLIGHT AGENT GROUNDING for ${packageName}@${activeVersion}]\n`;
  if (directoryInfo?.unmaintained) {
    preflightInstruction += `CRITICAL WARNING: Package is flagged UNMAINTAINED in React Native Directory. Avoid adoption or verify fork.\n`;
  }
  if (bannedSeveredSymbols.length > 0) {
    preflightInstruction += `CRITICAL: The following APIs are REMOVED/SEVERED and will crash at runtime:\n`;
    for (const b of bannedSeveredSymbols) {
      preflightInstruction += `  • FORBIDDEN: '${b.identifier}' -> USE INSTEAD: '${b.replacement ?? 'modern alternative'}'\n`;
    }
  }
  if (allowedModernSymbols.length > 0) {
    preflightInstruction += `CANONICAL MODERN APIS: ${allowedModernSymbols.slice(0, 15).join(', ')}\n`;
  }
  preflightInstruction += `ARCHITECTURE: ${architecture}`;

  if (!customDb && 'close' in db && typeof (db as any).close === 'function') {
    (db as any).close();
  }

  return {
    package: packageName,
    version: activeVersion,
    architecture,
    bannedSeveredSymbols,
    allowedModernSymbols,
    knownPeerConflicts,
    preflightInstruction,
    unmaintained: directoryInfo?.unmaintained ?? false,
    isExpoCompatible: directoryInfo?.isExpoCompatible ?? false
  };
}
