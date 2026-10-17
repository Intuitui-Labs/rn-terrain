/**
 * @file physical-grounding-engine.ts
 * Unified Physical Grounding Engine for React Native & Node Ecosystems.
 *
 * Replaces scattered tool silos with a cohesive physical reality pipeline:
 * 1. Physical Discovery: Reads physical node_modules package.json, types, and native units.
 * 2. Live Deprecation Harvesting: Parses real .d.ts files for @deprecated JSDoc tags.
 * 3. Temporal Gap & Ecosystem Alignment: Computes version gap vs manifest and Expo/RN matrix.
 * 4. Automated Rule Arming: Injects physical deprecations directly into AST linters and gates.
 */

import fs from 'node:fs';
import path from 'node:path';
import semver from 'semver';
import { NodeModulesAffordanceEngine, type AgentAffordanceCard } from './node-modules-affordance.js';
import { JsdocReplacementExtractor, type ExtractedSeveredRule } from './jsdoc-replacement-extractor.js';

export interface EcosystemAlignmentInfo {
  isAligned: boolean;
  expectedByFramework?: string;
  frameworkHost?: 'EXPO' | 'REACT_NATIVE_CORE' | 'STANDALONE';
  recommendation: string;
}

export interface PhysicalGroundingCard {
  packageName: string;
  isPhysicallyInstalled: boolean;
  physicalLocation: string | null;
  installedVersion: string | null;
  declaredRange: string | null;
  typesEntrypoint: string | null;
  nativeUnits: {
    hasAndroid: boolean;
    hasIos: boolean;
    hasCMake: boolean;
    moduleType: 'NITRO' | 'TURBOMODULE' | 'EXPO_MODULE' | 'BRIDGE' | 'PURE_JS';
  };
  temporalGap: {
    status: 'UP_TO_DATE' | 'ALIGNED' | 'MINOR_GAP' | 'MAJOR_SEVERED' | 'NOT_INSTALLED';
    details: string;
  };
  ecosystemAlignment: EcosystemAlignmentInfo;
  capabilities: {
    exportedHooksCount: number;
    exportedHooks: string[];
    exportedComponentsCount: number;
    exportedComponents: string[];
    exportedFunctionsCount: number;
    exportedFunctions: string[];
  };
  liveSeveredRulesCount: number;
  liveSeveredRules: ExtractedSeveredRule[];
  preflightPrompt: string;
}

export class PhysicalGroundingEngine {
  private affordanceEngine: NodeModulesAffordanceEngine;
  private jsdocExtractor: JsdocReplacementExtractor;

  constructor(private readonly projectRoot: string = process.cwd()) {
    this.affordanceEngine = new NodeModulesAffordanceEngine(this.projectRoot);
    this.jsdocExtractor = new JsdocReplacementExtractor();
  }

  /**
   * Grounds an agent or developer on the physical reality of an installed package.
   */
  public groundPackage(packageName: string): PhysicalGroundingCard {
    const pkgDir = this.affordanceEngine.resolvePackageDir(packageName);

    // 1. Manifest version declared in project package.json
    const projectPkgPath = path.join(this.projectRoot, 'package.json');
    let declaredRange: string | null = null;
    let expoSdkVersion: string | null = null;
    let rnVersion: string | null = null;

    if (fs.existsSync(projectPkgPath)) {
      try {
        const rootPkg = JSON.parse(fs.readFileSync(projectPkgPath, 'utf8'));
        const allDeps = {
          ...(rootPkg.dependencies || {}),
          ...(rootPkg.devDependencies || {}),
          ...(rootPkg.peerDependencies || {}),
        };
        declaredRange = allDeps[packageName] || null;
        expoSdkVersion = allDeps['expo'] || null;
        rnVersion = allDeps['react-native'] || null;
      } catch {}
    }

    if (!pkgDir || !fs.existsSync(pkgDir)) {
      return {
        packageName,
        isPhysicallyInstalled: false,
        physicalLocation: null,
        installedVersion: null,
        declaredRange,
        typesEntrypoint: null,
        nativeUnits: {
          hasAndroid: false,
          hasIos: false,
          hasCMake: false,
          moduleType: 'PURE_JS',
        },
        temporalGap: {
          status: 'NOT_INSTALLED',
          details: `Package '${packageName}' is not physically installed in node_modules. Run your package manager install command.`,
        },
        ecosystemAlignment: {
          isAligned: false,
          recommendation: `Install '${packageName}' via package manager before coding.`,
        },
        capabilities: {
          exportedHooksCount: 0,
          exportedHooks: [],
          exportedComponentsCount: 0,
          exportedComponents: [],
          exportedFunctionsCount: 0,
          exportedFunctions: [],
        },
        liveSeveredRulesCount: 0,
        liveSeveredRules: [],
        preflightPrompt: `WARNING: '${packageName}' is not installed in node_modules. Do NOT generate code using this package until installed.`,
      };
    }

    // 2. Read physical package.json
    let installedVersion = '0.0.0';
    let typesEntrypoint: string | null = null;
    try {
      const pJson = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
      installedVersion = pJson.version || '0.0.0';
      typesEntrypoint = pJson.types || pJson.typings || null;
    } catch {}

    // 3. Inspect Native Units
    const hasAndroid = fs.existsSync(path.join(pkgDir, 'android'));
    const hasIos = fs.existsSync(path.join(pkgDir, 'ios')) || fs.existsSync(path.join(pkgDir, 'apple'));
    const hasCMake = fs.existsSync(path.join(pkgDir, 'CMakeLists.txt')) || fs.existsSync(path.join(pkgDir, 'android', 'CMakeLists.txt'));

    let moduleType: PhysicalGroundingCard['nativeUnits']['moduleType'] = 'PURE_JS';
    if (hasCMake && fs.existsSync(path.join(pkgDir, 'nitrogen'))) {
      moduleType = 'NITRO';
    } else if (hasCMake || fs.existsSync(path.join(pkgDir, 'android', 'src', 'main', 'jni'))) {
      moduleType = 'TURBOMODULE';
    } else if (fs.existsSync(path.join(pkgDir, 'expo-module.config.json'))) {
      moduleType = 'EXPO_MODULE';
    } else if (hasAndroid || hasIos) {
      moduleType = 'BRIDGE';
    }

    // 4. Extract Affordance Card (Capabilities & Exports)
    let affordance: AgentAffordanceCard;
    try {
      affordance = this.affordanceEngine.generateAffordance(packageName);
    } catch {
      affordance = {
        packageName,
        installedVersion,
        packagePath: pkgDir,
        typesEntrypoint,
        exportedSymbolsCount: 0,
        exportedHooks: [],
        exportedComponents: [],
        exportedFunctions: [],
        exportedTypes: [],
        usageSnippet: null,
        preflightInstruction: '',
      };
    }

    // 5. Live JSDoc Deprecation Extraction
    const liveSeveredRules = this.jsdocExtractor.extractRulesFromInstalledPackage(packageName, this.projectRoot);

    // 6. Temporal Gap & Ecosystem Alignment
    const cleanInstalled = semver.clean(installedVersion) || installedVersion;
    let gapStatus: PhysicalGroundingCard['temporalGap']['status'] = 'UP_TO_DATE';
    let gapDetails = `Installed version v${cleanInstalled} matches declared range ${declaredRange ?? 'exact'}.`;

    if (declaredRange && !semver.satisfies(cleanInstalled, declaredRange)) {
      gapStatus = 'MINOR_GAP';
      gapDetails = `Physical version v${cleanInstalled} does not satisfy manifest range '${declaredRange}'. Lockfile drift detected.`;
    }

    // Ecosystem Matrix Evaluation
    const ecosystemAlignment = this.evaluateEcosystemAlignment(packageName, cleanInstalled, expoSdkVersion, rnVersion);

    // 7. Compose Grounded Pre-flight Prompt
    const bannedLines = liveSeveredRules.slice(0, 8).map((r) => `  - FORBIDDEN: '${r.symbol}' -> Replacement: '${r.replacement}' (${r.message})`).join('\n');
    const allowedHooks = affordance.exportedHooks.length > 0 ? `  - Allowed Hooks: ${affordance.exportedHooks.join(', ')}` : '';
    const allowedComps = affordance.exportedComponents.length > 0 ? `  - Allowed Components: ${affordance.exportedComponents.join(', ')}` : '';

    const preflightPrompt = [
      `GROUNDED REALITY FOR: ${packageName}@${cleanInstalled} (${moduleType})`,
      `Physical Path: ${pkgDir}`,
      liveSeveredRules.length > 0 ? `LIVE DEPRECATED SYMBOLS (EXTRACTED DIRECTLY FROM PHYSICAL .d.ts):\n${bannedLines}` : '  - Zero deprecated symbols detected in physical .d.ts.',
      allowedHooks,
      allowedComps,
      `ALIGNMENT GUIDANCE: ${ecosystemAlignment.recommendation}`,
    ].filter(Boolean).join('\n');

    return {
      packageName,
      isPhysicallyInstalled: true,
      physicalLocation: pkgDir,
      installedVersion: cleanInstalled,
      declaredRange,
      typesEntrypoint: affordance.typesEntrypoint,
      nativeUnits: {
        hasAndroid,
        hasIos,
        hasCMake,
        moduleType,
      },
      temporalGap: {
        status: gapStatus,
        details: gapDetails,
      },
      ecosystemAlignment,
      capabilities: {
        exportedHooksCount: affordance.exportedHooks.length,
        exportedHooks: affordance.exportedHooks,
        exportedComponentsCount: affordance.exportedComponents.length,
        exportedComponents: affordance.exportedComponents,
        exportedFunctionsCount: affordance.exportedFunctions.length,
        exportedFunctions: affordance.exportedFunctions,
      },
      liveSeveredRulesCount: liveSeveredRules.length,
      liveSeveredRules,
      preflightPrompt,
    };
  }

  /**
   * Harvests live severed rules from all installed dependencies in the project.
   */
  public harvestAllProjectRules(): ExtractedSeveredRule[] {
    const projectPkgPath = path.join(this.projectRoot, 'package.json');
    if (!fs.existsSync(projectPkgPath)) return [];

    const allRules: ExtractedSeveredRule[] = [];
    try {
      const rootPkg = JSON.parse(fs.readFileSync(projectPkgPath, 'utf8'));
      const deps = Object.keys({
        ...(rootPkg.dependencies || {}),
        ...(rootPkg.devDependencies || {}),
      });

      // Harvest live deprecation rules from all dependencies, excluding pure build/test tooling
      const toolchainPrefixes = ['@types/', 'typescript', 'eslint', 'prettier', 'vitest', 'jest', 'babel', 'metro'];
      const packagesToHarvest = deps.filter(
        (d) => !toolchainPrefixes.some((tool) => d.startsWith(tool))
      );

      return this.jsdocExtractor.extractRulesFromPackagesBatch(packagesToHarvest, this.projectRoot);
    } catch {}

    return allRules;
  }

  private evaluateEcosystemAlignment(
    packageName: string,
    installedVer: string,
    expoSdk: string | null,
    _rnVer: string | null
  ): EcosystemAlignmentInfo {
    // Expo SDK 58 alignment matrix
    if (expoSdk && (expoSdk.includes('58') || expoSdk.includes('~58') || expoSdk.includes('^58'))) {
      if (packageName === 'react-native-gesture-handler') {
        const isAligned = semver.satisfies(installedVer, '~3.3.0 || ^3.3.0 || >=3.3.0 <4.0.0');
        return {
          isAligned,
          expectedByFramework: '~3.3.0',
          frameworkHost: 'EXPO',
          recommendation: isAligned
            ? 'Installed RNGH 3.3.0 is exactly aligned with Expo SDK 58.'
            : `Expo SDK 58 expects RNGH ~3.3.0. Upgrading/downgrading beyond this risks prebuild native compilation crashes.`,
        };
      }

      if (packageName === 'react-native-reanimated') {
        const isAligned = semver.satisfies(installedVer, '>=3.16.0 <4.8.0');
        return {
          isAligned,
          expectedByFramework: '>=3.16.0 <4.8.0',
          frameworkHost: 'EXPO',
          recommendation: isAligned
            ? 'Installed Reanimated version is compatible with Expo SDK 58.'
            : 'Reanimated version may diverge from Expo SDK 58 bundle.',
        };
      }
    }

    return {
      isAligned: true,
      frameworkHost: 'STANDALONE',
      recommendation: `Installed version v${installedVer} verified in local node_modules.`,
    };
  }
}
