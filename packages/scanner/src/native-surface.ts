/**
 * @file native-surface.ts
 * Intrinsic Native Surface Detector.
 *
 * Inspects packages dynamically to determine if they contain compiled native
 * code (JNI/C++/Obj-C/Swift/Kotlin/Java), TurboModule Codegen, or native Podspecs,
 * without relying on a brittle hardcoded list of package names.
 */

import fs from 'node:fs';
import path from 'node:path';

export interface NativeSurfaceInfo {
  packageName: string;
  isNative: boolean;
  hasCodegen: boolean;
  platforms: ('ios' | 'android')[];
  peerDependencies: Record<string, string>;
  source: 'physical_node_modules' | 'manifest_heuristic' | 'unknown';
}

/**
 * Searches for a package's directory inside node_modules.
 */
function findPackageDir(packageName: string, startDir: string): string | null {
  let current = path.resolve(startDir);
  const root = path.parse(current).root;

  while (current !== root) {
    const candidate = path.join(current, 'node_modules', packageName);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  return null;
}

/**
 * Dynamically detects if a package exposes a compiled native code surface.
 */
export function detectNativeSurface(
  packageName: string,
  projectDir: string = process.cwd(),
  manifestOverride?: Record<string, any>
): NativeSurfaceInfo {
  const pkgDir = findPackageDir(packageName, projectDir);
  let pkgJson: Record<string, any> | null = manifestOverride || null;

  if (!pkgJson && pkgDir) {
    const jsonPath = path.join(pkgDir, 'package.json');
    if (fs.existsSync(jsonPath)) {
      try {
        pkgJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      } catch {
        pkgJson = null;
      }
    }
  }

  const platforms: ('ios' | 'android')[] = [];
  let isNative = false;
  let hasCodegen = false;
  const peerDependencies: Record<string, string> = pkgJson?.peerDependencies || {};

  // 1. Inspect physical directory structure if available
  if (pkgDir) {
    const hasIos = fs.existsSync(path.join(pkgDir, 'ios'));
    const hasAndroid = fs.existsSync(path.join(pkgDir, 'android'));
    const hasCMake = fs.existsSync(path.join(pkgDir, 'CMakeLists.txt'));
    const hasCpp = fs.existsSync(path.join(pkgDir, 'cpp'));

    // Check for any .podspec in package root
    let hasPodspec = false;
    try {
      const files = fs.readdirSync(pkgDir);
      hasPodspec = files.some((f) => f.endsWith('.podspec'));
    } catch {
      // ignore
    }

    if (hasIos || hasPodspec) platforms.push('ios');
    if (hasAndroid) platforms.push('android');

    if (hasIos || hasAndroid || hasPodspec || hasCMake || hasCpp) {
      isNative = true;
    }
  }

  // 2. Inspect package.json configuration fields
  if (pkgJson) {
    if (pkgJson.codegenConfig) {
      hasCodegen = true;
      isNative = true;
    }

    if (pkgJson.nativePackage === true || pkgJson.nitro || pkgJson.expo?.autolinking) {
      isNative = true;
    }

    // A library that lists react-native in peerDependencies and is not a pure utility
    if (peerDependencies['react-native'] && !isNative) {
      // Heuristic: check keywords
      const keywords: string[] = pkgJson.keywords || [];
      const hasNativeKeyword = keywords.some((k) =>
        ['turbomodule', 'fabric', 'nitro', 'native-module', 'jni'].includes(k.toLowerCase())
      );
      if (hasNativeKeyword) {
        isNative = true;
      }
    }
  }

  // 3. Fallback Heuristics when node_modules is not yet populated
  if (!pkgDir && !pkgJson) {
    // If the package follows react-native-* naming conventions and has known native keywords
    const lower = packageName.toLowerCase();
    const commonNativePatterns = [
      'reanimated',
      'gesture-handler',
      'screens',
      'skia',
      'mmkv',
      'camera',
      'vision-camera',
      'ble',
      'bluetooth',
      'sqlite',
      'fast-image',
      'pager-view',
      'webview',
      'maps',
      'audio',
      'video',
      'svg',
      'linear-gradient',
      'netinfo',
      'async-storage',
      'device-info',
      'keychain',
      'biometrics',
    ];

    if (commonNativePatterns.some((pattern) => lower.includes(pattern))) {
      isNative = true;
      platforms.push('ios', 'android');
    }
  }

  return {
    packageName,
    isNative,
    hasCodegen,
    platforms,
    peerDependencies,
    source: pkgDir ? 'physical_node_modules' : (pkgJson ? 'manifest_heuristic' : 'unknown'),
  };
}
