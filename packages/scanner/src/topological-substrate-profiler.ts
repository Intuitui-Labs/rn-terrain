/**
 * @file topological-substrate-profiler.ts
 * Topological Substrate Profiler for React Native & Expo Ecosystems.
 *
 * Replaces obsolete binary "Expo vs Bare" checks with an N-dimensional
 * continuum analysis:
 * 1. Native Governance: Pure CNG <-> Committed Prebuild <-> Bare <-> Brownfield
 * 2. Autolinking Substrate: Expo Modules Core <-> Nitro CMake <-> RN CLI <-> Manual
 * 3. Application Shell: Expo Router (Filesystem) <-> React Navigation (Imperative)
 * 4. Platform Physics: Android 15 Edge-to-Edge (compileSdk >= 35) <-> Legacy Insets
 * 5. Engine Substrate: Bridgeless Fabric <-> Interop <-> Paper
 * 6. Config Drift: Detects divergence between app.json plugins and committed native files
 */

import fs from 'node:fs';
import path from 'node:path';

export type NativeGovernanceModel =
  | 'PURE_CNG'              // Ephemeral native dirs, purely generated via app.json / plugins
  | 'COMMITTED_PREBUILD'     // Committed android/ios with @generated markers / config plugins
  | 'PURE_BARE'              // Manually maintained android/ios without Expo config plugins
  | 'BROWNFIELD'            // React Native embedded inside host native app
  | 'STANDALONE_JS';         // Pure JS/universal package or web-only target

export type AutolinkingSystem =
  | 'expo-modules-autolinking'
  | 'react-native-community-cli'
  | 'nitro-prefab'
  | 'manual-linking';

export type NavigationShellType =
  | 'EXPO_ROUTER'
  | 'REACT_NAVIGATION'
  | 'CUSTOM_OR_NONE';

export interface TopologicalSubstrateProfile {
  projectRoot: string;
  governance: {
    model: NativeGovernanceModel;
    hasAppJson: boolean;
    hasAppConfig: boolean;
    hasAndroidDir: boolean;
    hasIosDir: boolean;
    androidIsGitIgnored: boolean;
    iosIsGitIgnored: boolean;
    hasGeneratedMarkers: boolean;
    activeConfigPluginsCount: number;
    configPlugins: string[];
    nativePatchTargetAdvice: string;
  };
  autolinking: {
    activeSystems: AutolinkingSystem[];
    hasExpoModulesCore: boolean;
    hasNitroModules: boolean;
    hasCommunityCli: boolean;
    hasDirectCmake: boolean;
    potentialCollisions: Array<{
      type: 'STL_COLLISION' | 'DUAL_AUTOLINKING' | 'PREFAB_MISMATCH';
      message: string;
      remediation: string;
    }>;
  };
  shell: {
    type: NavigationShellType;
    routerVersion?: string;
    hasFileSystemRouting: boolean;
    appDirExists: boolean;
    modalRouteGroupsCount: number;
    modalRouteFiles: string[];
    guidance: string;
  };
  platform: {
    compileSdkVersion: number | null;
    targetSdkVersion: number | null;
    minSdkVersion: number | null;
    ndkVersion: string | null;
    isAndroid15EdgeToEdgeEnforced: boolean;
    predictiveBackGestureEnabled: boolean;
    systemBarStrategy: 'EXPO_STATUS_BAR' | 'CORE_STATUS_BAR' | 'NATIVE_WINDOW';
  };
  engine: {
    architecture: 'NEW_ARCH_FABRIC' | 'LEGACY_PAPER' | 'INTEROP';
    isBridgeless: boolean;
    hermesEnabled: boolean;
  };
  configDrift: {
    hasDrift: boolean;
    driftViolations: Array<{
      file: string;
      property: string;
      pluginValue: string | number;
      committedValue: string | number;
      hazard: string;
    }>;
  };
  scorecard: {
    sovereigntyLevel: 'HIGH_FIDELITY_CNG' | 'HYBRID_PREBUILD' | 'PURE_BARE_HAZARD' | 'UNGROUNDED';
    summary: string;
  };
}

export class TopologicalSubstrateProfiler {
  constructor(private readonly projectRoot: string = process.cwd()) {}

  /**
   * Profiles the project root across all 5 dimensions of the substrate sphere.
   */
  public profile(): TopologicalSubstrateProfile {
    const root = path.resolve(this.projectRoot);

    // 1. Load Manifests
    const pkgJsonPath = path.join(root, 'package.json');
    let pkgJson: Record<string, any> = {};
    if (fs.existsSync(pkgJsonPath)) {
      try {
        pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
      } catch {}
    }

    const allDeps = {
      ...(pkgJson.dependencies || {}),
      ...(pkgJson.devDependencies || {}),
      ...(pkgJson.peerDependencies || {}),
    };

    // 2. Discover App Config (app.json, app.config.js, app.config.ts)
    const appJsonPath = path.join(root, 'app.json');
    const appConfigJsPath = path.join(root, 'app.config.js');
    const appConfigTsPath = path.join(root, 'app.config.ts');

    const hasAppJson = fs.existsSync(appJsonPath);
    const hasAppConfig = fs.existsSync(appConfigJsPath) || fs.existsSync(appConfigTsPath);

    let expoConfig: Record<string, any> = {};
    if (hasAppJson) {
      try {
        const raw = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
        expoConfig = raw.expo || raw;
      } catch {}
    }

    // 3. Native Directories & Gitignore
    const androidDir = path.join(root, 'android');
    const iosDir = path.join(root, 'ios');
    const hasAndroidDir = fs.existsSync(androidDir) && fs.statSync(androidDir).isDirectory();
    const hasIosDir = fs.existsSync(iosDir) && fs.statSync(iosDir).isDirectory();

    const gitignorePath = path.join(root, '.gitignore');
    let gitignoreContent = '';
    if (fs.existsSync(gitignorePath)) {
      try {
        gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
      } catch {}
    }

    const androidIsGitIgnored = /^\s*android\/?\s*$/m.test(gitignoreContent);
    const iosIsGitIgnored = /^\s*ios\/?\s*$/m.test(gitignoreContent);

    // 4. Scan for @generated markers in native directories
    let hasGeneratedMarkers = false;
    let committedNdkVersion: string | null = null;
    let committedCompileSdk: number | null = null;

    if (hasAndroidDir) {
      const buildGradlePaths = [
        path.join(androidDir, 'build.gradle'),
        path.join(androidDir, 'app', 'build.gradle'),
      ];

      for (const p of buildGradlePaths) {
        if (fs.existsSync(p)) {
          try {
            const content = fs.readFileSync(p, 'utf8');
            if (content.includes('@generated') || content.includes('expo-build-properties')) {
              hasGeneratedMarkers = true;
            }

            const ndkMatch = content.match(/ndkVersion\s*=?\s*['"]([^'"]+)['"]/);
            if (ndkMatch && ndkMatch[1]) committedNdkVersion = ndkMatch[1];

            const compileMatch = content.match(/compileSdkVersion\s*=?\s*([0-9]+)/);
            if (compileMatch && compileMatch[1]) committedCompileSdk = parseInt(compileMatch[1], 10);
          } catch {}
        }
      }
    }

    // 5. Config Plugins Analysis
    const rawPlugins = Array.isArray(expoConfig.plugins) ? expoConfig.plugins : [];
    const configPlugins: string[] = [];
    let pluginBuildProps: Record<string, any> | null = null;

    for (const pl of rawPlugins) {
      if (typeof pl === 'string') {
        configPlugins.push(pl);
      } else if (Array.isArray(pl) && typeof pl[0] === 'string') {
        configPlugins.push(pl[0]);
        if (pl[0] === 'expo-build-properties' && pl[1]) {
          pluginBuildProps = pl[1];
        }
      }
    }

    // Determine Governance Model
    let governanceModel: NativeGovernanceModel = 'STANDALONE_JS';
    let nativePatchTargetAdvice = 'No native directories present.';

    if (hasAppJson || hasAppConfig) {
      if (!hasAndroidDir && !hasIosDir) {
        governanceModel = 'PURE_CNG';
        nativePatchTargetAdvice =
          'CRITICAL: Native directories are ephemeral. Direct edits to native files are forbidden. Author changes via app.json config plugins only.';
      } else if (androidIsGitIgnored && iosIsGitIgnored) {
        governanceModel = 'PURE_CNG';
        nativePatchTargetAdvice =
          'Native directories are gitignored build artifacts. Never patch android/ or ios/ directly; configure via app.json plugins.';
      } else if (hasGeneratedMarkers || configPlugins.length > 0) {
        governanceModel = 'COMMITTED_PREBUILD';
        nativePatchTargetAdvice =
          'Committed Prebuild (Dirty CNG). Target is versioned in git, but generated via Expo Prebuild. Modify local config plugins (./plugins/...) or app.json to prevent config drift upon next clean prebuild.';
      } else {
        governanceModel = 'PURE_BARE';
        nativePatchTargetAdvice = 'Bare React Native with app.json present. Direct native edits permitted.';
      }
    } else if (hasAndroidDir || hasIosDir) {
      // Check for brownfield indicators
      const isBrownfield = this.detectBrownfield(androidDir, iosDir);
      governanceModel = isBrownfield ? 'BROWNFIELD' : 'PURE_BARE';
      nativePatchTargetAdvice = isBrownfield
        ? 'Brownfield embedded RN container. Coordinate native changes with host app native engineers.'
        : 'Pure Bare React Native. Edit android/build.gradle and ios/Podfile directly.';
    }

    // 6. Autolinking Substrate
    const activeSystems: AutolinkingSystem[] = [];
    const hasExpoModulesCore = Boolean(allDeps['expo-modules-core'] || allDeps['expo']);
    const hasNitroModules = Boolean(allDeps['react-native-nitro-modules']);
    const hasCommunityCli = Boolean(
      allDeps['@react-native-community/cli'] ||
      fs.existsSync(path.join(root, 'react-native.config.js'))
    );
    const hasDirectCmake =
      fs.existsSync(path.join(root, 'CMakeLists.txt')) ||
      (hasAndroidDir && fs.existsSync(path.join(androidDir, 'CMakeLists.txt')));

    if (hasExpoModulesCore) activeSystems.push('expo-modules-autolinking');
    if (hasNitroModules) activeSystems.push('nitro-prefab');
    if (hasCommunityCli) activeSystems.push('react-native-community-cli');
    if (hasDirectCmake) activeSystems.push('manual-linking');

    const potentialCollisions: Array<{
      type: 'STL_COLLISION' | 'DUAL_AUTOLINKING' | 'PREFAB_MISMATCH';
      message: string;
      remediation: string;
    }> = [];

    if (hasNitroModules && hasExpoModulesCore) {
      potentialCollisions.push({
        type: 'STL_COLLISION',
        message:
          'Simultaneous Nitro Modules (C++20 prefab) and Expo Modules Core detected. Both package C++ STL dependencies.',
        remediation:
          'Ensure Android NDK >= 26.1 and verify packagingOptions { pickFirst "**/libc++_shared.so" } is specified in android/app/build.gradle.',
      });
    }

    // 7. Shell & Navigation Topology
    const appDir = path.join(root, 'app');
    const appDirExists = fs.existsSync(appDir) && fs.statSync(appDir).isDirectory();
    const hasExpoRouterDep = Boolean(allDeps['expo-router']);
    const hasReactNavDep = Boolean(allDeps['@react-navigation/native']);

    let shellType: NavigationShellType = 'CUSTOM_OR_NONE';
    if (hasExpoRouterDep && appDirExists) {
      shellType = 'EXPO_ROUTER';
    } else if (hasReactNavDep) {
      shellType = 'REACT_NAVIGATION';
    }

    const modalRouteFiles: string[] = [];
    if (shellType === 'EXPO_ROUTER' && appDirExists) {
      this.findModalRouteFiles(appDir, modalRouteFiles);
    }

    let shellGuidance = 'Standard component hierarchy.';
    if (shellType === 'EXPO_ROUTER') {
      shellGuidance =
        'Expo Router active. Modal presentations should be declarative route segments in app/ (e.g. app/(modals)/... or presentation: "modal"). Imperative <Modal> usage risks breaking router URL state.';
    }

    // 8. Platform Physics & Insets
    let compileSdkVersion = committedCompileSdk;
    let targetSdkVersion: number | null = null;
    let minSdkVersion: number | null = null;
    let ndkVersion = committedNdkVersion;

    if (pluginBuildProps?.android) {
      const androidProps = pluginBuildProps.android;
      if (androidProps.compileSdkVersion) compileSdkVersion = androidProps.compileSdkVersion;
      if (androidProps.targetSdkVersion) targetSdkVersion = androidProps.targetSdkVersion;
      if (androidProps.minSdkVersion) minSdkVersion = androidProps.minSdkVersion;
      if (androidProps.ndkVersion) ndkVersion = androidProps.ndkVersion;
    }

    const isAndroid15EdgeToEdgeEnforced =
      Boolean(compileSdkVersion && compileSdkVersion >= 35) ||
      Boolean(targetSdkVersion && targetSdkVersion >= 35);

    const predictiveBackGestureEnabled = Boolean(expoConfig.android?.predictiveBackGestureEnabled);

    let systemBarStrategy: 'EXPO_STATUS_BAR' | 'CORE_STATUS_BAR' | 'NATIVE_WINDOW' = 'CORE_STATUS_BAR';
    if (allDeps['expo-status-bar']) {
      systemBarStrategy = 'EXPO_STATUS_BAR';
    }

    // 9. Engine & Architecture
    const rnVersion = allDeps['react-native'] || '';
    const isNewArch =
      expoConfig.newArchEnabled === true ||
      pkgJson.newArchEnabled === true ||
      allDeps['react-native-nitro-modules'] !== undefined ||
      /0\.(7[6-9]|[8-9]\d)/.test(rnVersion);

    const isBridgeless = isNewArch;
    const hermesEnabled =
      expoConfig.jsEngine === 'hermes' ||
      !expoConfig.jsEngine || // Expo defaults to Hermes
      pkgJson.jsEngine === 'hermes';

    // 10. Config Drift Detection (Plugin vs Committed Files)
    const driftViolations: Array<{
      file: string;
      property: string;
      pluginValue: string | number;
      committedValue: string | number;
      hazard: string;
    }> = [];

    if (governanceModel === 'COMMITTED_PREBUILD') {
      if (
        pluginBuildProps?.android?.compileSdkVersion &&
        committedCompileSdk &&
        pluginBuildProps.android.compileSdkVersion !== committedCompileSdk
      ) {
        driftViolations.push({
          file: 'android/app/build.gradle',
          property: 'compileSdkVersion',
          pluginValue: pluginBuildProps.android.compileSdkVersion,
          committedValue: committedCompileSdk,
          hazard:
            'Committed compileSdkVersion differs from app.json expo-build-properties. Running npx expo prebuild --clean will revert this value.',
        });
      }

      if (
        pluginBuildProps?.android?.ndkVersion &&
        committedNdkVersion &&
        pluginBuildProps.android.ndkVersion !== committedNdkVersion
      ) {
        driftViolations.push({
          file: 'android/build.gradle',
          property: 'ndkVersion',
          pluginValue: pluginBuildProps.android.ndkVersion,
          committedValue: committedNdkVersion,
          hazard:
            'Committed ndkVersion differs from app.json configuration. Clean build will overwrite committed settings.',
        });
      }
    }

    // Scorecard Summary
    let sovereigntyLevel: TopologicalSubstrateProfile['scorecard']['sovereigntyLevel'] = 'HIGH_FIDELITY_CNG';
    let summary = 'Deterministic Continuous Native Generation project.';

    if (governanceModel === 'COMMITTED_PREBUILD') {
      sovereigntyLevel = 'HYBRID_PREBUILD';
      summary =
        'Hybrid Prebuild: Native folders exist in git but are orchestrated by Config Plugins. Check for config drift before modifying native files.';
    } else if (governanceModel === 'PURE_BARE') {
      sovereigntyLevel = 'PURE_BARE_HAZARD';
      summary = 'Pure Bare Native: Requires direct Gradle / CocoaPods maintenance.';
    }

    return {
      projectRoot: root,
      governance: {
        model: governanceModel,
        hasAppJson,
        hasAppConfig,
        hasAndroidDir,
        hasIosDir,
        androidIsGitIgnored,
        iosIsGitIgnored,
        hasGeneratedMarkers,
        activeConfigPluginsCount: configPlugins.length,
        configPlugins,
        nativePatchTargetAdvice,
      },
      autolinking: {
        activeSystems,
        hasExpoModulesCore,
        hasNitroModules,
        hasCommunityCli,
        hasDirectCmake,
        potentialCollisions,
      },
      shell: {
        type: shellType,
        routerVersion: allDeps['expo-router'],
        hasFileSystemRouting: appDirExists,
        appDirExists,
        modalRouteGroupsCount: modalRouteFiles.length,
        modalRouteFiles,
        guidance: shellGuidance,
      },
      platform: {
        compileSdkVersion,
        targetSdkVersion,
        minSdkVersion,
        ndkVersion,
        isAndroid15EdgeToEdgeEnforced,
        predictiveBackGestureEnabled,
        systemBarStrategy,
      },
      engine: {
        architecture: isNewArch ? 'NEW_ARCH_FABRIC' : 'LEGACY_PAPER',
        isBridgeless,
        hermesEnabled,
      },
      configDrift: {
        hasDrift: driftViolations.length > 0,
        driftViolations,
      },
      scorecard: {
        sovereigntyLevel,
        summary,
      },
    };
  }

  private detectBrownfield(androidDir: string, iosDir: string): boolean {
    if (fs.existsSync(androidDir)) {
      const settingsGradle = path.join(androidDir, 'settings.gradle');
      if (fs.existsSync(settingsGradle)) {
        try {
          const text = fs.readFileSync(settingsGradle, 'utf8');
          if (text.includes(':react-native') || text.includes('apply from: "../../node_modules')) {
            return true;
          }
        } catch {}
      }
    }
    return false;
  }

  private findModalRouteFiles(dir: string, results: string[], depth = 0): void {
    if (depth > 6) return;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          this.findModalRouteFiles(full, results, depth + 1);
        } else if (
          entry.isFile() &&
          /\.(tsx|jsx)$/i.test(entry.name) &&
          (full.includes('modal') || full.includes('(modal)') || full.includes('+modal'))
        ) {
          results.push(path.relative(this.projectRoot, full));
        }
      }
    } catch {}
  }
}
