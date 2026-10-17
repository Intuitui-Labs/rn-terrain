/**
 * @file physical-native-inspector.ts
 * Deep Physical Native Substrate Inspector for React Native.
 *
 * Inspects physical disk files inside node_modules or package source trees:
 * - Real iOS Podspec parsing (React-Codegen, React-Fabric, RCTComponentView, C++ flags)
 * - Android CMakeLists.txt & build.gradle parsing (prefab, fbjni, C++ standard)
 * - TurboModule Codegen specification parsing (codegenConfig, Native<Name>.ts)
 * - Nitro HybridObject specification parsing (*.nitro.ts, Nitrogen)
 */

import fs from 'node:fs';
import path from 'node:path';

export interface PodspecAnalysis {
  found: boolean;
  filePath?: string;
  name?: string;
  dependencies: string[];
  hasFabricDependency: boolean;
  hasTurboModuleDependency: boolean;
  hasCppFlags: boolean;
  cxxStandard?: string;
}

export interface AndroidNativeAnalysis {
  hasGradle: boolean;
  hasCMake: boolean;
  cmakePath?: string;
  cxxStandard?: string;
  hasPrefab: boolean;
  hasFbjni: boolean;
  hasReactAndroidLink: boolean;
  hasNamespace: boolean;
  hasCppShared: boolean;
}

export interface CodegenSpecAnalysis {
  hasCodegenConfig: boolean;
  libraryName?: string;
  codegenType?: 'components' | 'modules' | 'all';
  jsSrcsDir?: string;
  specFiles: string[];
}

export interface NitroSpecAnalysis {
  isNitro: boolean;
  hasNitrogenConfig: boolean;
  hybridObjectSpecs: string[];
}

export interface PackagingHazardAnalysis {
  hasHazard: boolean;
  reason?: string;
  entrypoint?: string;
}

export interface PhysicalNativeInspectionResult {
  packageName: string;
  packageRoot: string;
  isNative: boolean;
  architectureTier:
    | 'NITRO_MODULE'
    | 'TURBOMODULE_FABRIC'
    | 'TURBOMODULE_MODULE'
    | 'EXPO_MODULE'
    | 'LEGACY_BRIDGE'
    | 'PURE_JS';
  supportsFabric: boolean;
  supportsBridgeless: boolean;
  cxxStandard?: string;
  podspec: PodspecAnalysis;
  android: AndroidNativeAnalysis;
  codegen: CodegenSpecAnalysis;
  nitro: NitroSpecAnalysis;
  packaging: PackagingHazardAnalysis;
  capabilities: string[];
}

export class PhysicalNativeInspector {
  /**
   * Inspects a package directory on disk and returns an exhaustive native profile.
   */
  public inspectPackage(packageDir: string, packageName?: string): PhysicalNativeInspectionResult {
    const resolvedDir = path.resolve(packageDir);
    const pkgJsonPath = path.join(resolvedDir, 'package.json');

    let pkgJson: Record<string, any> = {};
    if (fs.existsSync(pkgJsonPath)) {
      try {
        pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
      } catch {
        pkgJson = {};
      }
    }

    const name = packageName || pkgJson.name || path.basename(resolvedDir);

    const podspec = this.inspectPodspec(resolvedDir);
    const android = this.inspectAndroidNative(resolvedDir);
    const codegen = this.inspectCodegen(resolvedDir, pkgJson);
    const nitro = this.inspectNitro(resolvedDir, pkgJson);
    const packaging = this.inspectPackagingHazard(resolvedDir, pkgJson);

    const capabilities: string[] = [];
    if (podspec.found) capabilities.push('CocoaPods');
    if (android.hasCMake) capabilities.push('CMake');
    if (android.hasPrefab) capabilities.push('Android-Prefab');
    if (codegen.hasCodegenConfig) capabilities.push('TurboModule-Codegen');
    if (nitro.isNitro) capabilities.push('Nitro-HybridObjects');

    const isNative =
      podspec.found ||
      android.hasGradle ||
      android.hasCMake ||
      codegen.hasCodegenConfig ||
      nitro.isNitro ||
      fs.existsSync(path.join(resolvedDir, 'ios')) ||
      fs.existsSync(path.join(resolvedDir, 'android'));

    // Determine architectural tier
    let architectureTier: PhysicalNativeInspectionResult['architectureTier'] = 'PURE_JS';
    let supportsFabric = false;
    let supportsBridgeless = false;

    if (!isNative) {
      architectureTier = 'PURE_JS';
    } else if (nitro.isNitro) {
      architectureTier = 'NITRO_MODULE';
      supportsFabric = true;
      supportsBridgeless = true;
    } else if (name.startsWith('expo-') || name.startsWith('@expo/')) {
      architectureTier = 'EXPO_MODULE';
      supportsFabric = true;
      supportsBridgeless = true;
    } else if (codegen.hasCodegenConfig || podspec.hasTurboModuleDependency || podspec.hasFabricDependency) {
      if (codegen.codegenType === 'components' || podspec.hasFabricDependency) {
        architectureTier = 'TURBOMODULE_FABRIC';
        supportsFabric = true;
      } else {
        architectureTier = 'TURBOMODULE_MODULE';
      }
      supportsFabric = true;
      supportsBridgeless = true;
    } else {
      // Compiled native code but no Codegen or Fabric descriptors
      architectureTier = 'LEGACY_BRIDGE';
      supportsFabric = false;
      supportsBridgeless = false;
    }

    const cxxStandard = nitro.isNitro ? '20' : (android.cxxStandard || podspec.cxxStandard);

    return {
      packageName: name,
      packageRoot: resolvedDir,
      isNative,
      architectureTier,
      supportsFabric,
      supportsBridgeless,
      cxxStandard,
      podspec,
      android,
      codegen,
      nitro,
      packaging,
      capabilities,
    };
  }

  private inspectPodspec(packageDir: string): PodspecAnalysis {
    const candidateFiles: string[] = [];

    // Search root and ios/ for *.podspec
    try {
      for (const file of fs.readdirSync(packageDir)) {
        if (file.endsWith('.podspec')) candidateFiles.push(path.join(packageDir, file));
      }
      const iosDir = path.join(packageDir, 'ios');
      if (fs.existsSync(iosDir)) {
        for (const file of fs.readdirSync(iosDir)) {
          if (file.endsWith('.podspec')) candidateFiles.push(path.join(iosDir, file));
        }
      }
    } catch {
      // ignore
    }

    if (candidateFiles.length === 0) {
      return {
        found: false,
        dependencies: [],
        hasFabricDependency: false,
        hasTurboModuleDependency: false,
        hasCppFlags: false,
      };
    }

    const podspecPath = candidateFiles[0]!;
    let content = '';
    try {
      content = fs.readFileSync(podspecPath, 'utf8');
    } catch {
      return {
        found: true,
        filePath: podspecPath,
        dependencies: [],
        hasFabricDependency: false,
        hasTurboModuleDependency: false,
        hasCppFlags: false,
      };
    }

    const depMatches = [...content.matchAll(/dependency\s+['"]([^'"]+)['"]/g)].map((m) => m[1] || '');
    const hasFabric =
      content.includes('React-Fabric') ||
      content.includes('RCTComponentViewDescriptor') ||
      content.includes('ReactCommon/react/renderer');
    const hasTurbo =
      content.includes('React-Codegen') ||
      content.includes('ReactCommon/turbomodule') ||
      content.includes('TurboModule');
    const hasCpp = content.includes('-std=c++') || content.includes('CLANG_CXX_LANGUAGE_STANDARD');

    let cxxStandard: string | undefined;
    const stdMatch = content.match(/c\+\+(\d{2})/i) || content.match(/gnu\+\+(\d{2})/i);
    if (stdMatch && stdMatch[1]) {
      cxxStandard = stdMatch[1];
    }

    return {
      found: true,
      filePath: podspecPath,
      name: path.basename(podspecPath, '.podspec'),
      dependencies: depMatches,
      hasFabricDependency: hasFabric,
      hasTurboModuleDependency: hasTurbo,
      hasCppFlags: hasCpp,
      cxxStandard,
    };
  }

  private inspectAndroidNative(packageDir: string): AndroidNativeAnalysis {
    const androidDir = path.join(packageDir, 'android');
    const hasGradle = fs.existsSync(path.join(androidDir, 'build.gradle')) || fs.existsSync(path.join(androidDir, 'build.gradle.kts'));

    let gradleContent = '';
    if (hasGradle) {
      try {
        const gPath = fs.existsSync(path.join(androidDir, 'build.gradle'))
          ? path.join(androidDir, 'build.gradle')
          : path.join(androidDir, 'build.gradle.kts');
        gradleContent = fs.readFileSync(gPath, 'utf8');
      } catch {}
    }

    const hasPrefab = gradleContent.includes('prefab true') || gradleContent.includes('prefab = true');

    const cmakeCandidates = [
      path.join(androidDir, 'CMakeLists.txt'),
      path.join(androidDir, 'src', 'main', 'jni', 'CMakeLists.txt'),
      path.join(packageDir, 'cpp', 'CMakeLists.txt'),
      path.join(packageDir, 'CMakeLists.txt'),
    ];

    let cmakePath: string | undefined;
    let cmakeContent = '';
    for (const cp of cmakeCandidates) {
      if (fs.existsSync(cp)) {
        cmakePath = cp;
        try {
          cmakeContent = fs.readFileSync(cp, 'utf8');
        } catch {}
        break;
      }
    }

    const hasCMake = cmakePath !== undefined;
    const hasFbjni = cmakeContent.includes('fbjni') || gradleContent.includes('fbjni');
    const hasReactAndroidLink = cmakeContent.includes('ReactAndroid') || gradleContent.includes('com.facebook.react:react-android');

    let cxxStandard: string | undefined;
    const cxxMatch = cmakeContent.match(/CMAKE_CXX_STANDARD\s+(\d+)/);
    if (cxxMatch && cxxMatch[1]) {
      cxxStandard = cxxMatch[1];
    }

    const hasNamespace = gradleContent.includes('namespace ') || gradleContent.includes('namespace =');
    const hasCppShared = cmakeContent.includes('c++_shared') || gradleContent.includes('c++_shared');

    return {
      hasGradle,
      hasCMake,
      cmakePath,
      cxxStandard,
      hasPrefab,
      hasFbjni,
      hasReactAndroidLink,
      hasNamespace,
      hasCppShared,
    };
  }

  private inspectCodegen(packageDir: string, pkgJson: Record<string, any>): CodegenSpecAnalysis {
    const codegenConfig = pkgJson.codegenConfig;
    if (!codegenConfig) {
      return { hasCodegenConfig: false, specFiles: [] };
    }

    const libraryName = codegenConfig.name;
    const codegenType = codegenConfig.type || 'all';
    const jsSrcsDir = codegenConfig.jsSrcsDir || '';

    const specFiles: string[] = [];
    const searchRoot = jsSrcsDir ? path.join(packageDir, jsSrcsDir) : packageDir;

    if (fs.existsSync(searchRoot)) {
      try {
        const findSpecs = (dir: string) => {
          for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, item.name);
            if (item.isDirectory() && item.name !== 'node_modules' && item.name !== 'dist') {
              findSpecs(full);
            } else if (item.isFile()) {
              if (item.name.startsWith('Native') && (item.name.endsWith('.ts') || item.name.endsWith('.tsx') || item.name.endsWith('.js'))) {
                specFiles.push(full);
              } else if (item.name.endsWith('NativeComponent.ts') || item.name.endsWith('NativeComponent.tsx')) {
                specFiles.push(full);
              }
            }
          }
        };
        findSpecs(searchRoot);
      } catch {}
    }

    return {
      hasCodegenConfig: true,
      libraryName,
      codegenType,
      jsSrcsDir,
      specFiles,
    };
  }

  private inspectNitro(packageDir: string, pkgJson: Record<string, any>): NitroSpecAnalysis {
    const deps = { ...pkgJson.dependencies, ...pkgJson.devDependencies, ...pkgJson.peerDependencies };
    const hasNitroDep = 'react-native-nitro-modules' in deps || 'nitrogen' in deps;

    const hybridObjectSpecs: string[] = [];
    try {
      const findNitro = (dir: string, depth = 0) => {
        if (depth > 4) return;
        for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, item.name);
          if (item.isDirectory() && item.name !== 'node_modules' && item.name !== 'dist') {
            findNitro(full, depth + 1);
          } else if (item.isFile() && item.name.endsWith('.nitro.ts')) {
            hybridObjectSpecs.push(full);
          }
        }
      };
      findNitro(packageDir);
    } catch {}

    const isNitro = hasNitroDep || hybridObjectSpecs.length > 0;

    return {
      isNitro,
      hasNitrogenConfig: 'nitrogen' in deps,
      hybridObjectSpecs,
    };
  }

  private inspectPackagingHazard(packageDir: string, pkgJson: Record<string, any>): PackagingHazardAnalysis {
    const main = pkgJson.main || 'index.js';
    const mainPath = path.join(packageDir, main);
    if (!fs.existsSync(mainPath)) return { hasHazard: false };

    try {
      const content = fs.readFileSync(mainPath, 'utf8');
      const isEsm = pkgJson.type === 'module';
      const hasRawImport = /^import\s+/m.test(content) || /^export\s+/m.test(content);
      if (!isEsm && hasRawImport) {
        return {
          hasHazard: true,
          reason: `Package specifies CommonJS (no "type": "module") but entrypoint "${main}" contains raw ES module syntax.`,
          entrypoint: main,
        };
      }
    } catch {}

    return { hasHazard: false };
  }

}
