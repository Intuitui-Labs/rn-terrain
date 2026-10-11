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

import { CanonicalDatabase } from '../db/sqlite-client.js';

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
}

export function generateAgentCompass(
  packageName: string,
  targetVersion: string = 'latest',
  customDb?: CanonicalDatabase
): AgentCompassBriefing {
  const db = customDb ?? new CanonicalDatabase();

  const versions = db.getVersions(packageName);
  const activeVersion = targetVersion === 'latest' ? versions[0]?.version ?? 'latest' : targetVersion;
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

  // If no symbols are recorded yet in DB, supply canonical groundings for known core packages
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
    }
  }

  // Retrieve compatibility combos
  const matrix = db.getCompatibility(`${packageName}:react-native-reanimated`);
  const knownPeerConflicts: PeerConflict[] = matrix
    .filter((m) => m.status === 'BREAKING_COLLISION' || m.status === 'BROKEN_NATIVE')
    .map((m) => ({
      peerPackage: 'react-native-reanimated',
      safeRange: m.version_b_range,
      conflictNote: m.what_broke ?? 'Native ABI or worklet runtime collision',
      severity: m.collision_severity
    }));

  let architecture: 'NEW_ARCHITECTURE_FABRIC_READY' | 'LEGACY_INTEROP' | 'UNKNOWN' = 'UNKNOWN';
  if (versionRecord) {
    architecture =
      versionRecord.supports_new_arch === 1
        ? 'NEW_ARCHITECTURE_FABRIC_READY'
        : versionRecord.supports_new_arch === 0
          ? 'LEGACY_INTEROP'
          : 'UNKNOWN';
  } else {
    // Grounded fallbacks for foundational tier-1 ecosystem packages when local database is unseeded
    if (packageName === 'react-native-reanimated') {
      // Reanimated 3+ supports New Architecture; Reanimated 4 drops Paper entirely and mandates Fabric
      architecture = 'NEW_ARCHITECTURE_FABRIC_READY';
    } else if (
      packageName === 'react-native-gesture-handler' ||
      packageName === 'react-native-screens' ||
      packageName === 'react-native-nitro-modules' ||
      packageName === 'react-native-worklets' ||
      packageName === 'react-native-mmkv' ||
      packageName === '@shopify/react-native-skia' ||
      packageName === '@shopify/flash-list'
    ) {
      architecture = 'NEW_ARCHITECTURE_FABRIC_READY';
    } else {
      architecture = 'UNKNOWN';
    }
  }

  let preflightInstruction = `[PRE-FLIGHT AGENT GROUNDING for ${packageName}@${activeVersion}]\n`;
  if (bannedSeveredSymbols.length > 0) {
    preflightInstruction += `CRITICAL: The following APIs are REMOVED/SEVERED and will crash at runtime:\n`;
    for (const b of bannedSeveredSymbols) {
      preflightInstruction += `  • FORBIDDEN: '${b.identifier}' -> USE INSTEAD: '${b.replacement ?? 'modern alternative'}'\n`;
    }
  }
  if (allowedModernSymbols.length > 0) {
    preflightInstruction += `CANONICAL MODERN APIS: ${allowedModernSymbols.join(', ')}\n`;
  }
  preflightInstruction += `ARCHITECTURE: ${architecture}`;

  if (!customDb) {
    db.close();
  }

  return {
    package: packageName,
    version: activeVersion,
    architecture,
    bannedSeveredSymbols,
    allowedModernSymbols,
    knownPeerConflicts,
    preflightInstruction
  };
}
