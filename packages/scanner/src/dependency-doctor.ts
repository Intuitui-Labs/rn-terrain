/**
 * @file dependency-doctor.ts
 * Generalized TCDI Dependency Drift, Native Surface & Local Shape Doctor.
 *
 * Implements a 2-tier architecture:
 *   1. Universal Structural Invariants (Zero-Config):
 *      - Dynamic Native Surface detection (flags floating carets on compiled C++/JNI binaries)
 *      - Algebraic Peer Dependency Matrix checks (host RN vs declared peerDependencies)
 *      - Framework Dialect Drift (React 19 vs RN <0.76)
 *   2. Contextual Local Shape:
 *      - Project configuration (.terrainrc, terrain.config.json, package.json#terrain)
 *      - Stack Presets (standard, expo, enterprise, loose)
 *      - In-house local pins (localPins)
 *      - Fork / Wrapper Aliases (aliases)
 *      - Rule severity overrides and ignore lists
 */

import fs from 'node:fs';
import path from 'node:path';
import semver from 'semver';
import { loadTerrainConfig, type TerrainProjectConfig, type RuleSeverity } from './config-loader.js';
import { detectNativeSurface, type NativeSurfaceInfo } from './native-surface.js';

export interface SacredPinRule {
  packageName: string;
  recommendedRange: string;
  reason: string;
  severity: 'error' | 'warn' | 'info';
}

export function getSacredNativePins(targetRnVersion?: string | null): SacredPinRule[] {
  const clean = targetRnVersion ? targetRnVersion.replace(/^[~^>=<]+/, '') : null;
  const coerced = clean ? semver.coerce(clean)?.version : null;
  const isModernRn = coerced
    ? semver.satisfies(coerced, '>=0.88.0', { includePrerelease: true })
    : clean
      ? semver.satisfies(clean, '>=0.88.0-0', { includePrerelease: true })
      : false;

  return [
    {
      packageName: 'react-native-reanimated',
      recommendedRange: isModernRn ? '>=3.16.0 <5.0.0' : '>=3.16.0 <4.0.0',
      reason: isModernRn
        ? 'Reanimated 4.x is supported on RN 0.88+; older versions risk Fabric native view crashes.'
        : 'Reanimated 4.x introduces new worklet runtime incompatible with older Fabric/TurboModule setups.',
      severity: 'error',
    },
    {
      packageName: 'react-native-gesture-handler',
      recommendedRange: isModernRn ? '>=2.20.0 <4.0.0' : '>=2.20.0 <3.0.0',
      reason: isModernRn
        ? 'RNGH 3.x is supported on RN 0.88+ with New Architecture.'
        : 'RNGH 2.x is required for modern Gesture.Pan() API on New Architecture.',
      severity: 'error',
    },
    {
      packageName: 'react-native-screens',
      recommendedRange: '>=3.34.0 <5.0.0',
      reason: 'Screens 4+ stabilizes Fabric native view recycling and header rendering.',
      severity: 'warn',
    },
    {
      packageName: '@shopify/react-native-skia',
      recommendedRange: isModernRn ? '>=1.5.0 <4.0.0' : '>=1.5.0 <3.0.0',
      reason: 'Skia native C++ binaries require exact ABI compatibility with target React Native version.',
      severity: 'error',
    },
    {
      packageName: 'react-native-mmkv',
      recommendedRange: isModernRn ? '>=3.0.0 <5.0.0' : '>=3.0.0 <4.0.0',
      reason: 'MMKV v3+ migrates from legacy JSI bindings to modern Nitro Modules / TurboModules.',
      severity: 'warn',
    },
  ];
}

export const SACRED_NATIVE_PINS: SacredPinRule[] = getSacredNativePins(null);

export interface DependencyIssue {
  packageName: string;
  currentVersion: string;
  ruleType:
    | 'SACRED_PIN_VIOLATION'
    | 'HAZARDOUS_FLOATING_RANGE'
    | 'FRAMEWORK_DIALECT_RISK'
    | 'PEER_ABI_INCOMPATIBILITY'
    | 'LOCAL_PIN_VIOLATION';
  severity: 'error' | 'warn' | 'info';
  message: string;
  remediation: string;
}

export interface DependencyAuditReport {
  projectDir: string;
  totalDependenciesScanned: number;
  isHealthy: boolean;
  errorsCount: number;
  warningsCount: number;
  nativeModulesDetected: number;
  activePreset: string;
  issues: DependencyIssue[];
  sacredPinsChecked: number;
}

export interface DependencyDoctorOptions {
  config?: TerrainProjectConfig;
  configPath?: string;
  preset?: TerrainProjectConfig['preset'];
}

export class TcdiDependencyDoctor {
  private config: TerrainProjectConfig;
  private explicitPreset?: TerrainProjectConfig['preset'];

  constructor(options?: DependencyDoctorOptions) {
    this.explicitPreset = options?.preset;
    if (options?.config) {
      this.config = options.config;
    } else {
      this.config = loadTerrainConfig(options?.configPath || process.cwd());
    }

    if (options?.preset) {
      this.config.preset = options.preset;
    }
  }

  public auditManifest(packageJsonPath: string): DependencyAuditReport {
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`package.json not found at ${packageJsonPath}`);
    }

    const projectDir = path.dirname(packageJsonPath);
    // Reload local config if running inside a specific project directory
    const activeConfig = this.explicitPreset
      ? { ...this.config, preset: this.explicitPreset }
      : loadTerrainConfig(projectDir);

    const raw = fs.readFileSync(packageJsonPath, 'utf8');
    const pkg = JSON.parse(raw) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    const allDeps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
    };

    const isExpo = Boolean(allDeps['expo']);
    const effectivePreset =
      this.explicitPreset ||
      (activeConfig.preset && activeConfig.preset !== 'standard'
        ? activeConfig.preset
        : (isExpo ? 'expo' : (activeConfig.preset || 'standard')));

    const issues: DependencyIssue[] = [];
    const ignoreSet = new Set(activeConfig.ignore || []);
    let nativeModulesCount = 0;

    const hostRnRaw = allDeps['react-native'];
    const hostReactRaw = allDeps['react'];
    const hostRnClean = hostRnRaw ? hostRnRaw.replace(/^[~^>=<]+/, '') : null;
    const hostReactClean = hostReactRaw ? hostReactRaw.replace(/^[~^>=<]+/, '') : null;

    // ──────────────────────────────────────────────────────────────────────────
    // 1. Universal Invariants: Native Surface & Hazardous Floating Ranges
    // ──────────────────────────────────────────────────────────────────────────
    const floatingRuleSeverity = activeConfig.rules?.disallowFloatingNativeRanges ?? 'warn';

    for (const [depName, versionRange] of Object.entries(allDeps)) {
      if (ignoreSet.has(depName)) continue;

      // Resolve alias if mapped (e.g. @myorg/reanimated -> react-native-reanimated)
      const canonicalName = activeConfig.aliases?.[depName] || depName;

      // Inspect native surface dynamically
      const surface = detectNativeSurface(canonicalName, projectDir);
      if (surface.isNative) {
        nativeModulesCount++;

        // Invariant A: Native binary with floating caret
        if (
          floatingRuleSeverity !== 'off' &&
          versionRange.startsWith('^') &&
          activeConfig.strictNativeFloating
        ) {
          const cleanVer = versionRange.replace(/^[~^>=<]+/, '');
          issues.push({
            packageName: depName,
            currentVersion: versionRange,
            ruleType: 'HAZARDOUS_FLOATING_RANGE',
            severity: floatingRuleSeverity === 'error' ? 'error' : 'warn',
            message: `Floating range '${versionRange}' on compiled native library '${depName}' risks non-deterministic C++/JNI ABI crashes across team builds.`,
            remediation: `Pin exact version (e.g. '${cleanVer}' without caret) or use strict tilde (~).`,
          });
        }

        // Invariant B: Algebraic Peer Dependency Matrix Intersection
        const peerRnRange = surface.peerDependencies['react-native'];
        if (
          peerRnRange &&
          hostRnClean &&
          activeConfig.rules?.enforcePeerMatrixAlignment !== 'off'
        ) {
          const peerSeverity = activeConfig.rules?.enforcePeerMatrixAlignment === 'error' ? 'error' : 'warn';
          if (!semver.satisfies(hostRnClean, peerRnRange, { includePrerelease: true })) {
            issues.push({
              packageName: depName,
              currentVersion: versionRange,
              ruleType: 'PEER_ABI_INCOMPATIBILITY',
              severity: peerSeverity,
              message: `${depName}@${versionRange} requires react-native '${peerRnRange}', but project provides '${hostRnRaw}'.`,
              remediation: `Upgrade ${depName} to a version supporting react-native ${hostRnRaw}, or adjust react-native.`,
            });
          }
        }
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 2. Framework Dialect Deprecations (React 19 vs RN 0.76)
    // ──────────────────────────────────────────────────────────────────────────
    if (hostReactClean && semver.satisfies(hostReactClean, '>=19.0.0', { includePrerelease: true })) {
      if (hostRnClean && semver.satisfies(hostRnClean, '<0.76.0', { includePrerelease: true })) {
        issues.push({
          packageName: 'react',
          currentVersion: hostReactRaw!,
          ruleType: 'FRAMEWORK_DIALECT_RISK',
          severity: 'error',
          message: `React 19 requires React Native >= 0.76. Current react-native version (${hostRnRaw}) will fail to resolve native renderer symbols.`,
          remediation: 'Upgrade react-native to >=0.76.0 or downgrade react to ^18.3.1',
        });
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 3. Local Shape: Custom Local Pins (.terrainrc localPins)
    // ──────────────────────────────────────────────────────────────────────────
    if (activeConfig.localPins) {
      for (const [pinPkg, pinRule] of Object.entries(activeConfig.localPins)) {
        if (ignoreSet.has(pinPkg)) continue;
        const current = allDeps[pinPkg];
        if (!current) continue;

        const cleanCurrent = current.replace(/^[~^>=<]+/, '');
        if (!semver.satisfies(cleanCurrent, pinRule.recommendedRange, { includePrerelease: true })) {
          issues.push({
            packageName: pinPkg,
            currentVersion: current,
            ruleType: 'LOCAL_PIN_VIOLATION',
            severity: pinRule.severity || 'error',
            message: `${pinPkg}@${current} violates local organization pin (${pinRule.recommendedRange}). ${pinRule.reason}`,
            remediation: `Pin ${pinPkg} to ${pinRule.recommendedRange} in package.json as required by organization policy.`,
          });
        }
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 4. Default Baseline Sacred Pins (unless overridden or in Expo preset)
    // ──────────────────────────────────────────────────────────────────────────
    const activePins = getSacredNativePins(hostRnClean);

    const sacredSeverity = activeConfig.rules?.sacredPins ?? 'warn';
    if (sacredSeverity !== 'off' && effectivePreset !== 'expo') {
      for (const rule of activePins) {
        // Check either the canonical name or any alias mapped to it
        const matchedDepKey = Object.keys(allDeps).find(
          (d) => d === rule.packageName || activeConfig.aliases?.[d] === rule.packageName
        );

        if (!matchedDepKey || ignoreSet.has(matchedDepKey)) continue;

        // If user defined a custom localPin for this package, localPin takes precedence
        if (activeConfig.localPins?.[matchedDepKey]) continue;

        const current = allDeps[matchedDepKey];
        if (!current) continue;
        const cleanCurrent = current.replace(/^[~^>=<]+/, '');

        if (!semver.satisfies(cleanCurrent, rule.recommendedRange)) {
          issues.push({
            packageName: matchedDepKey,
            currentVersion: current,
            ruleType: 'SACRED_PIN_VIOLATION',
            severity: rule.severity === 'error' ? 'error' : (sacredSeverity === 'error' ? 'error' : 'warn'),
            message: `${matchedDepKey}@${current} violates sacred native pin range (${rule.recommendedRange}). ${rule.reason}`,
            remediation: `Pin ${matchedDepKey} to ${rule.recommendedRange} in package.json`,
          });
        }
      }
    }

    const errorsCount = issues.filter((i) => i.severity === 'error').length;
    const warningsCount = issues.filter((i) => i.severity === 'warn').length;

    return {
      projectDir,
      totalDependenciesScanned: Object.keys(allDeps).length,
      isHealthy: errorsCount === 0,
      errorsCount,
      warningsCount,
      nativeModulesDetected: nativeModulesCount,
      activePreset: effectivePreset,
      issues,
      sacredPinsChecked: activePins.length + Object.keys(activeConfig.localPins || {}).length,
    };
  }
}
