/**
 * @file nitro-auditor.ts
 * Nitro Modules & C++ Native Architecture Auditor for React Native.
 *
 * Inspects project configurations for Nitro Modules (`react-native-nitro-modules`),
 * Nitrogen codegen specs (`*.nitro.ts`), C++20 standard compliance, JSI thread affinity,
 * Android NDK 26+ prefab bindings, and Swift-to-C++ interop invariants.
 */

import fs from 'node:fs';
import path from 'node:path';

export interface HybridObjectSpecInfo {
  name: string;
  specPath: string;
  methods: string[];
  properties: string[];
}

export interface NitroModuleAuditReport {
  isNitroProject: boolean;
  hasNitroDependency: boolean;
  nitroVersion?: string;
  nitrogenInstalled: boolean;
  hybridObjects: HybridObjectSpecInfo[];
  cmakeStatus: {
    found: boolean;
    cxxStandard?: string;
    hasPrefab?: boolean;
    warnings: string[];
  };
  ndkStatus: {
    ndkVersion?: string;
    isCompatible: boolean;
    warnings: string[];
  };
  violations: Array<{
    ruleId: string;
    severity: 'error' | 'warning';
    message: string;
    remediation: string;
  }>;
}

export class NitroAuditor {
  constructor(private readonly projectRoot: string = process.cwd()) {}

  /**
   * Scans the project for Nitro Modules and evaluates C++ native architecture invariants.
   */
  public audit(): NitroModuleAuditReport {
    const pkgJsonPath = path.join(this.projectRoot, 'package.json');
    let pkgJson: Record<string, any> = {};

    if (fs.existsSync(pkgJsonPath)) {
      try {
        pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
      } catch {}
    }

    const allDeps = {
      ...(pkgJson.dependencies || {}),
      ...(pkgJson.devDependencies || {}),
      ...(pkgJson.peerDependencies || {}),
    };

    const hasNitroDependency = 'react-native-nitro-modules' in allDeps;
    const nitroVersion = allDeps['react-native-nitro-modules'];
    const nitrogenInstalled = 'nitrogen' in allDeps || Boolean(pkgJson.scripts?.nitrogen);

    // 1. Locate HybridObject specs (*.nitro.ts)
    const hybridObjects: HybridObjectSpecInfo[] = [];
    const violations: Array<{
      ruleId: string;
      severity: 'error' | 'warning';
      message: string;
      remediation: string;
    }> = [];

    this.findNitroSpecs(this.projectRoot, hybridObjects);

    const isNitroProject = hasNitroDependency || hybridObjects.length > 0;

    // 2. Audit CMakeLists.txt for C++20 and Prefab
    const cmakeStatus = this.auditCMake();

    // 3. Audit Android NDK and build.gradle
    const ndkStatus = this.auditAndroidConfig();

    // 4. Invariant Checks
    if (isNitroProject) {
      if (!hasNitroDependency) {
        violations.push({
          ruleId: 'nitro/missing-core-dependency',
          severity: 'error',
          message: "Nitro HybridObject specs detected, but 'react-native-nitro-modules' is missing from package.json.",
          remediation: "Install 'react-native-nitro-modules' via your package manager: pnpm add react-native-nitro-modules.",
        });
      }

      if (cmakeStatus.found && cmakeStatus.cxxStandard && parseInt(cmakeStatus.cxxStandard, 10) < 20) {
        violations.push({
          ruleId: 'nitro/cxx-standard-subminimal',
          severity: 'error',
          message: `CMake specifies C++${cmakeStatus.cxxStandard}, but Nitro Modules strictly require C++20.`,
          remediation: "Set 'set(CMAKE_CXX_STANDARD 20)' and 'set(CMAKE_CXX_STANDARD_REQUIRED ON)' in CMakeLists.txt.",
        });
      }

      if (ndkStatus.ndkVersion) {
        const majorNdk = parseInt(ndkStatus.ndkVersion.split('.')[0] ?? '0', 10);
        if (majorNdk < 26) {
          violations.push({
            ruleId: 'nitro/android-ndk-outdated',
            severity: 'error',
            message: `Android NDK version ${ndkStatus.ndkVersion} is below the minimum required for C++20 concepts and Nitro (NDK 26+).`,
            remediation: "Specify 'ndkVersion = \"26.1.10909125\"' or higher in android/build.gradle.",
          });
        }
      }
    }

    return {
      isNitroProject,
      hasNitroDependency,
      nitroVersion,
      nitrogenInstalled,
      hybridObjects,
      cmakeStatus,
      ndkStatus,
      violations,
    };
  }

  /**
   * Evaluates code snippet for Nitro-specific agent usage anti-patterns.
   */
  public verifyCodeSnippet(code: string, knownHybridObjects: string[] = []): Array<{
    ruleId: string;
    severity: 'error' | 'warning';
    message: string;
    remediation: string;
  }> {
    const findings: Array<{
      ruleId: string;
      severity: 'error' | 'warning';
      message: string;
      remediation: string;
    }> = [];

    // 1. Detect accessing a known Nitro HybridObject via legacy NativeModules
    const legacyNativeModulesRegex = /NativeModules\.([a-zA-Z0-9_$]+)/g;
    let match: RegExpExecArray | null;
    while ((match = legacyNativeModulesRegex.exec(code)) !== null) {
      const moduleName = match[1] ?? '';
      if (knownHybridObjects.includes(moduleName) || moduleName.toLowerCase().includes('nitro') || moduleName === 'MMKV') {
        findings.push({
          ruleId: 'nitro/legacy-native-modules-access',
          severity: 'error',
          message: `'${moduleName}' is a high-performance Nitro HybridObject. Accessing it via legacy 'NativeModules' returns undefined and bypasses JSI.`,
          remediation: `Import 'NitroModules' from 'react-native-nitro-modules' and call 'NitroModules.createHybridObject<...>("${moduleName}")'.`,
        });
      }
    }

    // Detect destructuring: const { MMKV } = NativeModules
    const destructureRegex = /(?:const|let|var)\s*\{\s*([^}]+)\s*\}\s*=\s*NativeModules/g;
    while ((match = destructureRegex.exec(code)) !== null) {
      const items = (match[1] ?? '').split(',').map((s) => s.trim().split(':')[0]?.trim() ?? '');
      for (const moduleName of items) {
        if (!moduleName) continue;
        if (knownHybridObjects.includes(moduleName) || moduleName.toLowerCase().includes('nitro') || moduleName === 'MMKV') {
          findings.push({
            ruleId: 'nitro/legacy-native-modules-access',
            severity: 'error',
            message: `'${moduleName}' is a high-performance Nitro HybridObject. Destructuring it from legacy 'NativeModules' returns undefined and bypasses JSI.`,
            remediation: `Import 'NitroModules' from 'react-native-nitro-modules' and call 'NitroModules.createHybridObject<...>("${moduleName}")'.`,
          });
        }
      }
    }

    // 2. Detect accessing a Nitro HybridObject via TurboModuleRegistry.get
    const turboModuleRegex = /TurboModuleRegistry\.(get|getEnforcing)\s*<[^>]*>\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    while ((match = turboModuleRegex.exec(code)) !== null) {
      const moduleName = match[2] ?? '';
      if (knownHybridObjects.includes(moduleName) || moduleName === 'MMKV') {
        findings.push({
          ruleId: 'nitro/turbomodule-confabulation',
          severity: 'error',
          message: `'${moduleName}' is a Nitro HybridObject, not a standard TurboModule. 'TurboModuleRegistry.get()' will throw at runtime.`,
          remediation: `Use 'NitroModules.createHybridObject("${moduleName}")' instead.`,
        });
      }
    }

    // 3. Detect calling synchronous Nitro HybridObject methods inside Reanimated worklets without safe wrapper
    if (code.includes("'worklet'") || code.includes('"worklet"')) {
      const nitroCallRegex = /([a-zA-Z0-9_$]+)\.(sync|executeSync|set|get)\s*\(/g;
      if (nitroCallRegex.test(code) && code.includes('NitroModules')) {
        findings.push({
          ruleId: 'nitro/worklet-thread-affinity-hazard',
          severity: 'warning',
          message: "Invoking Nitro HybridObject methods directly inside a Reanimated worklet can cause runtime JSI thread crashes if the HybridObject is not worklet-safe.",
          remediation: "Ensure the HybridObject is registered with worklet thread affinity or wrap invocations in 'runOnJS()'.",
        });
      }
    }

    return findings;
  }

  private findNitroSpecs(dir: string, results: HybridObjectSpecInfo[], depth: number = 0): void {
    if (depth > 4) return;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          this.findNitroSpecs(fullPath, results, depth + 1);
        } else if (entry.isFile() && entry.name.endsWith('.nitro.ts')) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const methods: string[] = [];
          const properties: string[] = [];

          // Extract interface names and members
          const interfaceMatch = content.match(/interface\s+([a-zA-Z0-9_$]+)/);
          const objName = interfaceMatch ? interfaceMatch[1] ?? 'HybridObject' : 'HybridObject';

          const methodRegex = /([a-zA-Z0-9_$]+)\s*\([^)]*\)\s*:/g;
          let m: RegExpExecArray | null;
          while ((m = methodRegex.exec(content)) !== null) {
            if (m[1]) methods.push(m[1]);
          }

          results.push({
            name: objName,
            specPath: path.relative(this.projectRoot, fullPath),
            methods,
            properties,
          });
        }
      }
    } catch {}
  }

  private auditCMake(): { found: boolean; cxxStandard?: string; hasPrefab?: boolean; warnings: string[] } {
    const warnings: string[] = [];
    const candidates = [
      path.join(this.projectRoot, 'CMakeLists.txt'),
      path.join(this.projectRoot, 'android', 'CMakeLists.txt'),
      path.join(this.projectRoot, 'cpp', 'CMakeLists.txt'),
    ];

    for (const cPath of candidates) {
      if (fs.existsSync(cPath)) {
        try {
          const content = fs.readFileSync(cPath, 'utf-8');
          const stdMatch = content.match(/CMAKE_CXX_STANDARD\s+([0-9]+)/);
          const cxxStandard = stdMatch ? stdMatch[1] : undefined;
          const hasPrefab = content.includes('find_package') || content.includes('prefab');
          return { found: true, cxxStandard, hasPrefab, warnings };
        } catch {}
      }
    }

    return { found: false, warnings };
  }

  private auditAndroidConfig(): { ndkVersion?: string; isCompatible: boolean; warnings: string[] } {
    const warnings: string[] = [];
    const buildGradlePaths = [
      path.join(this.projectRoot, 'android', 'build.gradle'),
      path.join(this.projectRoot, 'android', 'app', 'build.gradle'),
    ];

    let ndkVersion: string | undefined;

    for (const gPath of buildGradlePaths) {
      if (fs.existsSync(gPath)) {
        try {
          const content = fs.readFileSync(gPath, 'utf-8');
          const ndkMatch = content.match(/ndkVersion\s*=?\s*['"]([^'"]+)['"]/);
          if (ndkMatch && ndkMatch[1]) {
            ndkVersion = ndkMatch[1];
            break;
          }
        } catch {}
      }
    }

    const isCompatible = !ndkVersion || parseInt(ndkVersion.split('.')[0] ?? '0', 10) >= 26;

    return { ndkVersion, isCompatible, warnings };
  }
}
