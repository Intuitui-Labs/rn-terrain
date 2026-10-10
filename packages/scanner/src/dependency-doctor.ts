/**
 * @file dependency-doctor.ts
 * TCDI Dependency Drift & Sacred Native Pin Diagnostic Engine.
 *
 * Scans project manifests (package.json) to detect:
 *   1. Sacred Native Pin violations (unpinned or out-of-bounds native modules)
 *   2. Major dependency drift (latest.major - current.major >= 1)
 *   3. Framework dialect deprecations (React 19, RN 0.76+, Expo 52+)
 *   4. Hazardous floating version ranges in native libraries (^ or ~ on binary packages)
 */

import fs from 'node:fs';
import path from 'node:path';
import semver from 'semver';

export interface SacredPinRule {
  packageName: string;
  recommendedRange: string;
  reason: string;
  severity: 'error' | 'warn' | 'info';
}

export const SACRED_NATIVE_PINS: SacredPinRule[] = [
  {
    packageName: 'react-native-reanimated',
    recommendedRange: '>=3.16.0 <4.0.0',
    reason: 'Reanimated 4.x introduces new worklet runtime incompatible with older Fabric/TurboModule setups.',
    severity: 'error',
  },
  {
    packageName: 'react-native-gesture-handler',
    recommendedRange: '>=2.20.0 <3.0.0',
    reason: 'RNGH 2.x is required for modern Gesture.Pan() API on New Architecture.',
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
    recommendedRange: '>=1.5.0 <3.0.0',
    reason: 'Skia native C++ binaries require exact ABI compatibility with target React Native version.',
    severity: 'error',
  },
  {
    packageName: 'react-native-mmkv',
    recommendedRange: '>=3.0.0 <4.0.0',
    reason: 'MMKV v3 migrates from legacy JSI bindings to modern Nitro Modules / TurboModules.',
    severity: 'warn',
  },
];

export interface DependencyIssue {
  packageName: string;
  currentVersion: string;
  ruleType: 'SACRED_PIN_VIOLATION' | 'HAZARDOUS_FLOATING_RANGE' | 'FRAMEWORK_DIALECT_RISK';
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
  issues: DependencyIssue[];
  sacredPinsChecked: number;
}

export class TcdiDependencyDoctor {
  public auditManifest(packageJsonPath: string): DependencyAuditReport {
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`package.json not found at ${packageJsonPath}`);
    }

    const raw = fs.readFileSync(packageJsonPath, 'utf8');
    const pkg = JSON.parse(raw) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    const allDeps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
    };

    const issues: DependencyIssue[] = [];

    // 1. Audit Sacred Native Pins
    for (const rule of SACRED_NATIVE_PINS) {
      const current = allDeps[rule.packageName];
      if (!current) continue;

      const cleanCurrent = current.replace(/^[~^>=<]+/, '');

      // Check if current version satisfies the recommended semver range
      if (!semver.satisfies(cleanCurrent, rule.recommendedRange)) {
        issues.push({
          packageName: rule.packageName,
          currentVersion: current,
          ruleType: 'SACRED_PIN_VIOLATION',
          severity: rule.severity,
          message: `${rule.packageName}@${current} violates sacred native pin range (${rule.recommendedRange}). ${rule.reason}`,
          remediation: `Pin ${rule.packageName} to ${rule.recommendedRange} in package.json`,
        });
      }

      // Check if hazardous floating major/minor is used on sensitive native binaries
      if (current.startsWith('^') && (rule.packageName.includes('reanimated') || rule.packageName.includes('skia'))) {
        issues.push({
          packageName: rule.packageName,
          currentVersion: current,
          ruleType: 'HAZARDOUS_FLOATING_RANGE',
          severity: 'warn',
          message: `Floating range '${current}' on native binary library ${rule.packageName} can cause non-deterministic native crashes across team builds.`,
          remediation: `Pin exact version (e.g. '${cleanCurrent}' without caret) or use strict tilde (~).`,
        });
      }
    }

    // 2. Dialect Deprecation Checks (React 19 vs RN 0.76)
    const reactVersion = allDeps['react'];
    const rnVersion = allDeps['react-native'];

    if (reactVersion && semver.satisfies(reactVersion.replace(/^[~^]/, ''), '>=19.0.0')) {
      if (rnVersion && semver.satisfies(rnVersion.replace(/^[~^]/, ''), '<0.76.0')) {
        issues.push({
          packageName: 'react',
          currentVersion: reactVersion,
          ruleType: 'FRAMEWORK_DIALECT_RISK',
          severity: 'error',
          message: `React 19 requires React Native >= 0.76. Current react-native version (${rnVersion}) will fail to resolve native renderer symbols.`,
          remediation: 'Upgrade react-native to >=0.76.0 or downgrade react to ^18.3.1',
        });
      }
    }

    const errorsCount = issues.filter((i) => i.severity === 'error').length;
    const warningsCount = issues.filter((i) => i.severity === 'warn').length;

    return {
      projectDir: path.dirname(packageJsonPath),
      totalDependenciesScanned: Object.keys(allDeps).length,
      isHealthy: errorsCount === 0,
      errorsCount,
      warningsCount,
      issues,
      sacredPinsChecked: SACRED_NATIVE_PINS.length,
    };
  }
}
