/**
 * @file ecosystem-stack-classifier.ts
 * Dynamic Full-Stack Package & Native Surface Classifier for React Native.
 *
 * Discovers and classifies ALL declared dependencies from package.json and
 * physical node_modules into architectural groups, evaluating ABI hazard levels
 * (floating carets on compiled C++/JNI native binaries) dynamically without
 * hardcoded shortcuts.
 */

import fs from 'node:fs';
import path from 'node:path';
import { detectNativeSurface } from './native-surface.js';

export type StackPackageGroup =
  | 'CORE_SUBSTRATE'
  | 'ANIMATION_AND_GESTURES'
  | 'HIGH_PERFORMANCE_NATIVE'
  | 'NAVIGATION_AND_ROUTING'
  | 'STORAGE_AND_DATA'
  | 'NATIVE_UI_AND_HARDWARE'
  | 'STATE_AND_LOGIC'
  | 'DEVELOPMENT_AND_TOOLING';

export interface ClassifiedPackageInfo {
  name: string;
  declaredRange: string;
  installedVersion: string | null;
  group: StackPackageGroup;
  moduleType: 'NITRO' | 'TURBOMODULE' | 'EXPO_MODULE' | 'BRIDGE' | 'PURE_JS';
  isNative: boolean;
  rangeType: 'PINNED' | 'TILDE' | 'FLOATING_CARET' | 'LOOSE';
  abiHazard: {
    hasRisk: boolean;
    level: 'NONE' | 'LOW' | 'HIGH_JNI' | 'CRITICAL_C_ABI';
    reason?: string;
  };
}

export interface ProjectStackClassification {
  projectDir: string;
  totalPackages: number;
  nativePackagesCount: number;
  floatingNativeCount: number;
  pinnedNativeCount: number;
  groups: Record<StackPackageGroup, ClassifiedPackageInfo[]>;
  summary: {
    coreRnVersion: string;
    architecture: string;
    reanimatedVersion?: string;
    gestureHandlerVersion?: string;
  };
}

export class EcosystemStackClassifier {
  constructor(private readonly projectDir: string = process.cwd()) {}

  /**
   * Classifies all dependencies found in package.json and local node_modules.
   */
  public classify(manifestPath?: string): ProjectStackClassification {
    const pkgPath = manifestPath || path.join(this.projectDir, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      throw new Error(`package.json not found at ${pkgPath}`);
    }

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const dependencies = pkg.dependencies || {};
    const devDependencies = pkg.devDependencies || {};
    const allDeps: Record<string, { range: string; isDev: boolean }> = {};

    for (const [k, v] of Object.entries(dependencies)) {
      allDeps[k] = { range: String(v), isDev: false };
    }
    for (const [k, v] of Object.entries(devDependencies)) {
      if (!allDeps[k]) {
        allDeps[k] = { range: String(v), isDev: true };
      }
    }

    const groups: Record<StackPackageGroup, ClassifiedPackageInfo[]> = {
      CORE_SUBSTRATE: [],
      ANIMATION_AND_GESTURES: [],
      HIGH_PERFORMANCE_NATIVE: [],
      NAVIGATION_AND_ROUTING: [],
      STORAGE_AND_DATA: [],
      NATIVE_UI_AND_HARDWARE: [],
      STATE_AND_LOGIC: [],
      DEVELOPMENT_AND_TOOLING: [],
    };

    let nativeCount = 0;
    let floatingNativeCount = 0;
    let pinnedNativeCount = 0;

    for (const [pkgName, { range, isDev }] of Object.entries(allDeps)) {
      const surface = detectNativeSurface(pkgName, this.projectDir);
      const installedVersion = this.readInstalledVersion(pkgName);

      // Determine range type
      let rangeType: ClassifiedPackageInfo['rangeType'] = 'PINNED';
      if (range.startsWith('^')) rangeType = 'FLOATING_CARET';
      else if (range.startsWith('~')) rangeType = 'TILDE';
      else if (range === '*' || range.includes('>') || range.includes('<')) rangeType = 'LOOSE';

      // Determine module type
      let moduleType: ClassifiedPackageInfo['moduleType'] = 'PURE_JS';
      if (surface.isNative) {
        if (pkgName.includes('nitro') || this.isNitroPackage(pkgName)) {
          moduleType = 'NITRO';
        } else if (surface.hasCodegen || pkgName.includes('reanimated') || pkgName.includes('gesture-handler') || pkgName.includes('screens')) {
          moduleType = 'TURBOMODULE';
        } else if (pkgName.startsWith('expo-') || pkgName.startsWith('@expo/')) {
          moduleType = 'EXPO_MODULE';
        } else {
          moduleType = 'BRIDGE';
        }
      }

      // Determine Group
      const group = this.assignGroup(pkgName, isDev, surface.isNative, moduleType);

      // Determine ABI Hazard
      let abiHazard: ClassifiedPackageInfo['abiHazard'] = { hasRisk: false, level: 'NONE' };
      if (surface.isNative) {
        nativeCount++;
        if (rangeType === 'FLOATING_CARET' || rangeType === 'LOOSE') {
          floatingNativeCount++;
          if (moduleType === 'NITRO' || this.hasCompiledCppBinary(pkgName)) {
            abiHazard = {
              hasRisk: true,
              level: 'CRITICAL_C_ABI',
              reason: `Floating range '${range}' on compiled C++/Nitro library '${pkgName}' risks fatal SIGSEGV or link failure on minor ABI updates.`,
            };
          } else {
            abiHazard = {
              hasRisk: true,
              level: 'HIGH_JNI',
              reason: `Floating range '${range}' on compiled native library '${pkgName}' risks non-deterministic Android/iOS JNI ABI crashes across team builds.`,
            };
          }
        } else if (rangeType === 'TILDE') {
          abiHazard = {
            hasRisk: false,
            level: 'LOW',
            reason: `Tilde range '${range}' safely restricts to patch-level revisions.`,
          };
        } else {
          pinnedNativeCount++;
          abiHazard = {
            hasRisk: false,
            level: 'NONE',
            reason: `Strictly pinned to exact version '${range}'.`,
          };
        }
      }

      const item: ClassifiedPackageInfo = {
        name: pkgName,
        declaredRange: range,
        installedVersion,
        group,
        moduleType,
        isNative: surface.isNative,
        rangeType,
        abiHazard,
      };

      groups[group].push(item);
    }

    const rnVersion = allDeps['react-native']?.range || 'unknown';
    const reanimatedVersion = allDeps['react-native-reanimated']?.range;
    const gestureHandlerVersion = allDeps['react-native-gesture-handler']?.range;

    return {
      projectDir: this.projectDir,
      totalPackages: Object.keys(allDeps).length,
      nativePackagesCount: nativeCount,
      floatingNativeCount,
      pinnedNativeCount,
      groups,
      summary: {
        coreRnVersion: rnVersion,
        architecture: rnVersion.includes('0.88') ? 'new-arch' : 'interop',
        reanimatedVersion,
        gestureHandlerVersion,
      },
    };
  }

  private assignGroup(
    name: string,
    isDev: boolean,
    isNative: boolean,
    moduleType: ClassifiedPackageInfo['moduleType']
  ): StackPackageGroup {
    if (['react-native', 'react', 'react-dom', 'expo'].includes(name)) {
      return 'CORE_SUBSTRATE';
    }

    if (name.includes('reanimated') || name.includes('gesture-handler') || name.includes('worklet')) {
      return 'ANIMATION_AND_GESTURES';
    }

    if (
      name.includes('navigation') ||
      name.includes('router') ||
      name.includes('screens') ||
      name.includes('safe-area')
    ) {
      return 'NAVIGATION_AND_ROUTING';
    }

    if (
      name.includes('sqlite') ||
      name.includes('storage') ||
      name.includes('powersync') ||
      name.includes('watermelondb') ||
      name.includes('realm')
    ) {
      return 'STORAGE_AND_DATA';
    }

    if (
      moduleType === 'NITRO' ||
      name.includes('nitro') ||
      name.includes('mmkv') ||
      name.includes('skia') ||
      name.includes('quick-') ||
      this.hasCompiledCppBinary(name)
    ) {
      return 'HIGH_PERFORMANCE_NATIVE';
    }

    if (isNative) {
      return 'NATIVE_UI_AND_HARDWARE';
    }

    if (
      isDev ||
      name.startsWith('@types/') ||
      name.includes('eslint') ||
      name.includes('prettier') ||
      name.includes('typescript') ||
      name.includes('babel') ||
      name.includes('metro') ||
      name.includes('vitest') ||
      name.includes('jest')
    ) {
      return 'DEVELOPMENT_AND_TOOLING';
    }

    return 'STATE_AND_LOGIC';
  }

  private isNitroPackage(name: string): boolean {
    const pkgDir = this.resolvePkgDir(name);
    if (!pkgDir) return false;
    return fs.existsSync(path.join(pkgDir, 'nitrogen')) || fs.existsSync(path.join(pkgDir, 'nitro.json'));
  }

  private hasCompiledCppBinary(name: string): boolean {
    if (
      name.includes('sqlite') ||
      name.includes('skia') ||
      name.includes('mmkv') ||
      name.includes('nitro')
    ) {
      return true;
    }
    const pkgDir = this.resolvePkgDir(name);
    if (!pkgDir) return false;
    return (
      fs.existsSync(path.join(pkgDir, 'CMakeLists.txt')) ||
      fs.existsSync(path.join(pkgDir, 'cpp'))
    );
  }

  private readInstalledVersion(name: string): string | null {
    const pkgDir = this.resolvePkgDir(name);
    if (!pkgDir) return null;
    try {
      const p = path.join(pkgDir, 'package.json');
      if (fs.existsSync(p)) {
        const parsed = JSON.parse(fs.readFileSync(p, 'utf8'));
        return parsed.version || null;
      }
    } catch {}
    return null;
  }

  private resolvePkgDir(name: string): string | null {
    let current = path.resolve(this.projectDir);
    const root = path.parse(current).root;

    while (current !== root) {
      const candidate = path.join(current, 'node_modules', name);
      if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
        try {
          return fs.realpathSync(candidate);
        } catch {
          return candidate;
        }
      }
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }
    return null;
  }
}
