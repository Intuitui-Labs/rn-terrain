/**
 * @file native-surface-profiler.ts
 * Autonomous Native Surface & Leverage Profiler for React Native solutions.
 *
 * Scans project manifests (package.json + optional lockfiles) and dynamically
 * isolates compiled native/C++ packages (~45-65 in a typical production app)
 * from pure JS libraries. Evaluates architectural compliance, module types,
 * leverage scores, and New Architecture hazard levels.
 */

import fs from 'node:fs';
import path from 'node:path';
import { detectNativeSurface } from './native-surface.js';

export type ModuleArchitectureType =
  | 'NITRO_MODULE'
  | 'TURBOMODULE'
  | 'EXPO_MODULE'
  | 'LEGACY_BRIDGE'
  | 'PURE_JS';

export interface NativePackageProfile {
  packageName: string;
  version: string;
  isNative: boolean;
  moduleType: ModuleArchitectureType;
  platforms: ('ios' | 'android')[];
  hasCodegen: boolean;
  supportsNewArchitecture: boolean;
  leverageScore: number; // 0 - 100
  hazardLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  hazardReason?: string;
  source: string;
}

export interface SolutionNativeAuditReport {
  projectRoot: string;
  totalDependencies: number;
  runtimeDependenciesCount: number;
  devDependenciesCount: number;
  nativeCompilationUnitsCount: number;
  pureJsDependenciesCount: number;
  nativeExposureRatio: number; // e.g. 0.35 (35%)
  newArchReadyCount: number;
  newArchReadyPercentage: number;
  legacyBridgeHazardsCount: number;
  profiles: NativePackageProfile[];
  topLeveragePackages: NativePackageProfile[];
  hazardPackages: NativePackageProfile[];
}

export interface ProfilerOptions {
  projectDir?: string;
  packageJsonPath?: string;
  targetReactNativeVersion?: string; // e.g. "0.88.0", defaults to installed
}

// Well-known foundational Platform Spine packages and their empirical baseline leverage
const FOUNDATIONAL_SPINE_SCORES: Record<string, { score: number; moduleType: ModuleArchitectureType }> = {
  'react-native-safe-area-context': { score: 98, moduleType: 'TURBOMODULE' },
  'react-native-screens': { score: 96, moduleType: 'TURBOMODULE' },
  'react-native-reanimated': { score: 95, moduleType: 'TURBOMODULE' },
  'react-native-gesture-handler': { score: 93, moduleType: 'TURBOMODULE' },
  'react-native-worklets': { score: 92, moduleType: 'TURBOMODULE' },
  'react-native-svg': { score: 88, moduleType: 'TURBOMODULE' },
  '@react-native-async-storage/async-storage': { score: 87, moduleType: 'TURBOMODULE' },
  '@react-navigation/native': { score: 86, moduleType: 'TURBOMODULE' },
  '@shopify/react-native-skia': { score: 85, moduleType: 'TURBOMODULE' },
  'react-native-nitro-modules': { score: 84, moduleType: 'NITRO_MODULE' },
  'react-native-mmkv': { score: 83, moduleType: 'NITRO_MODULE' },
  '@gorhom/bottom-sheet': { score: 82, moduleType: 'TURBOMODULE' },
  'react-native-webview': { score: 80, moduleType: 'TURBOMODULE' },
  '@shopify/flash-list': { score: 78, moduleType: 'TURBOMODULE' },
};

export class NativeSurfaceProfiler {
  /**
   * Profiles a solution's dependencies and produces a comprehensive audit report.
   */
  public profileProject(options: ProfilerOptions = {}): SolutionNativeAuditReport {
    let projectDir = path.resolve(options.projectDir || process.cwd());
    let pkgJsonPath: string;

    if (fs.existsSync(projectDir) && fs.statSync(projectDir).isFile()) {
      pkgJsonPath = projectDir;
      projectDir = path.dirname(projectDir);
    } else {
      pkgJsonPath = options.packageJsonPath
        ? path.resolve(options.packageJsonPath)
        : path.join(projectDir, 'package.json');
    }

    if (!fs.existsSync(pkgJsonPath)) {
      throw new Error(`package.json not found at: ${pkgJsonPath}`);
    }

    const pkgContent = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    const runtimeDeps = pkgContent.dependencies || {};
    const devDeps = pkgContent.devDependencies || {};
    const allDeclared = { ...runtimeDeps };

    const runtimeKeys = Object.keys(runtimeDeps);
    const devKeys = Object.keys(devDeps);
    const totalCount = runtimeKeys.length + devKeys.length;

    // Detect target RN version
    const rnVersion = options.targetReactNativeVersion || runtimeDeps['react-native'] || '0.88.0';
    const isNewArchTarget = this.isNewArchVersion(rnVersion);

    const profiles: NativePackageProfile[] = [];

    for (const [pkgName, version] of Object.entries(allDeclared)) {
      if (pkgName === 'react' || pkgName === 'react-native') {
        continue;
      }

      const surface = detectNativeSurface(pkgName, projectDir);
      const spineInfo = FOUNDATIONAL_SPINE_SCORES[pkgName];

      let moduleType: ModuleArchitectureType = 'PURE_JS';
      let isNative = surface.isNative;
      let supportsNewArchitecture = false;
      let leverageScore = 20; // Default baseline for pure JS
      let hazardLevel: NativePackageProfile['hazardLevel'] = 'NONE';
      let hazardReason: string | undefined;

      if (spineInfo) {
        isNative = true;
        moduleType = spineInfo.moduleType;
        supportsNewArchitecture = true;
        leverageScore = spineInfo.score;
      } else if (pkgName.startsWith('expo-') || pkgName.startsWith('@expo/')) {
        isNative = true;
        moduleType = 'EXPO_MODULE';
        supportsNewArchitecture = true;
        leverageScore = 75;
      } else if (isNative) {
        if (pkgName.includes('nitro')) {
          moduleType = 'NITRO_MODULE';
          supportsNewArchitecture = true;
          leverageScore = 80;
        } else if (surface.hasCodegen) {
          moduleType = 'TURBOMODULE';
          supportsNewArchitecture = true;
          leverageScore = 70;
        } else {
          // Has native iOS/Android code but no codegen config / modern JSI
          moduleType = 'LEGACY_BRIDGE';
          supportsNewArchitecture = false;
          leverageScore = 65;

          if (isNewArchTarget) {
            hazardLevel = 'HIGH';
            hazardReason =
              `Legacy Paper Bridge dependency detected. Lacks TurboModule Codegen. Incompatible with Bridgeless New Architecture in RN ${rnVersion}.`;
          } else {
            hazardLevel = 'MEDIUM';
            hazardReason = 'Legacy bridge dependency. Will require migration before New Architecture rollout.';
          }
        }
      }

      // Check specific combo/peer hazards
      if (pkgName === 'react-native-reanimated' && version.startsWith('^4') && !runtimeDeps['react-native-worklets']) {
        hazardLevel = 'CRITICAL';
        hazardReason =
          "Reanimated v4 requires co-installing 'react-native-worklets@^0.13.0'. Missing worklet runtime will cause immediate SIGSEGV crash.";
      }

      profiles.push({
        packageName: pkgName,
        version,
        isNative,
        moduleType,
        platforms: surface.platforms,
        hasCodegen: surface.hasCodegen,
        supportsNewArchitecture,
        leverageScore,
        hazardLevel,
        hazardReason,
        source: surface.source,
      });
    }

    // Sort by leverage score descending
    profiles.sort((a, b) => b.leverageScore - a.leverageScore);

    const nativeProfiles = profiles.filter((p) => p.isNative);
    const pureJsProfiles = profiles.filter((p) => !p.isNative);
    const newArchReady = nativeProfiles.filter((p) => p.supportsNewArchitecture);
    const legacyHazards = nativeProfiles.filter((p) => p.moduleType === 'LEGACY_BRIDGE' || p.hazardLevel === 'CRITICAL' || p.hazardLevel === 'HIGH');

    const nativeCount = nativeProfiles.length;
    const runtimeCount = runtimeKeys.length;
    const exposureRatio = runtimeCount > 0 ? parseFloat((nativeCount / runtimeCount).toFixed(3)) : 0;
    const newArchPercentage = nativeCount > 0 ? parseFloat(((newArchReady.length / nativeCount) * 100).toFixed(1)) : 100;

    return {
      projectRoot: projectDir,
      totalDependencies: totalCount,
      runtimeDependenciesCount: runtimeCount,
      devDependenciesCount: devKeys.length,
      nativeCompilationUnitsCount: nativeCount,
      pureJsDependenciesCount: pureJsProfiles.length,
      nativeExposureRatio: exposureRatio,
      newArchReadyCount: newArchReady.length,
      newArchReadyPercentage: newArchPercentage,
      legacyBridgeHazardsCount: legacyHazards.length,
      profiles,
      topLeveragePackages: nativeProfiles.slice(0, 10),
      hazardPackages: legacyHazards,
    };
  }

  private isNewArchVersion(rawVersion: string): boolean {
    const clean = rawVersion.replace(/^[^\d]*/, '');
    const parts = clean.split('.');
    const major = parseInt(parts[0] || '0', 10);
    const minor = parseInt(parts[1] || '0', 10);
    // RN >= 0.76 is New Architecture by default
    return major > 0 || minor >= 76;
  }
}
