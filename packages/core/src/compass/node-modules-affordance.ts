/**
 * @file node-modules-affordance.ts
 * Local node_modules Affordance & Code Graph Extraction Engine.
 *
 * Allows AI agents to directly ground themselves on physically installed packages:
 *   - Resolves package root in node_modules (handling pnpm symlinks and virtual store)
 *   - Extracts installed version from package.json
 *   - Scans .d.ts declaration files to extract exported functions, hooks, and components
 *   - Scans README / examples for real code usage patterns
 *   - Produces a grounded AgentAffordanceCard preventing hallucinated Major-N APIs.
 */

import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

export interface ExportedSymbolAffordance {
  name: string;
  kind: 'function' | 'hook' | 'component' | 'type' | 'const' | 'unknown';
  signature?: string;
}

export interface AgentAffordanceCard {
  packageName: string;
  installedVersion: string;
  packagePath: string;
  typesEntrypoint: string | null;
  exportedSymbolsCount: number;
  exportedHooks: string[];
  exportedComponents: string[];
  exportedFunctions: string[];
  exportedTypes: string[];
  usageSnippet: string | null;
  preflightInstruction: string;
}

export class NodeModulesAffordanceEngine {
  constructor(private readonly projectRoot: string = process.cwd()) {}

  /**
   * Resolves the real directory of an installed package in node_modules
   */
  public resolvePackageDir(packageName: string): string | null {
    // 1. Module resolution via createRequire at project root
    try {
      const rootPkg = path.resolve(this.projectRoot, 'package.json');
      if (fs.existsSync(rootPkg)) {
        const req = createRequire(rootPkg);
        const resolved = req.resolve(`${packageName}/package.json`);
        return path.dirname(resolved);
      }
    } catch {}

    // 2. Direct node_modules check
    const directPath = path.resolve(this.projectRoot, 'node_modules', packageName);
    if (fs.existsSync(directPath)) {
      try {
        return fs.realpathSync(directPath);
      } catch {
        return directPath;
      }
    }

    // 3. Search monorepo subpackages (packages/*, apps/*)
    for (const sub of ['packages', 'apps', 'modules']) {
      const subDir = path.resolve(this.projectRoot, sub);
      if (fs.existsSync(subDir) && fs.statSync(subDir).isDirectory()) {
        try {
          for (const entry of fs.readdirSync(subDir)) {
            const subPkg = path.resolve(subDir, entry, 'package.json');
            if (fs.existsSync(subPkg)) {
              try {
                const req = createRequire(subPkg);
                const resolved = req.resolve(`${packageName}/package.json`);
                return path.dirname(resolved);
              } catch {}
            }
          }
        } catch {}
      }
    }

    // 4. Check parent directories for monorepo roots
    let current = this.projectRoot;
    for (let i = 0; i < 4; i++) {
      const parentNodeModules = path.resolve(current, 'node_modules', packageName);
      if (fs.existsSync(parentNodeModules)) {
        try {
          return fs.realpathSync(parentNodeModules);
        } catch {
          return parentNodeModules;
        }
      }
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }

    return null;
  }

  /**
   * Generates a grounded affordance card for an installed package
   */
  public generateAffordance(packageName: string): AgentAffordanceCard {
    const pkgDir = this.resolvePackageDir(packageName);

    if (!pkgDir || !fs.existsSync(pkgDir)) {
      throw new Error(`Package '${packageName}' is not installed in node_modules at ${this.projectRoot}`);
    }

    const pkgJsonPath = path.join(pkgDir, 'package.json');
    let installedVersion = 'unknown';
    let typesPath: string | null = null;

    if (fs.existsSync(pkgJsonPath)) {
      try {
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
        installedVersion = pkgJson.version ?? 'unknown';

        if (pkgJson.types) {
          typesPath = path.resolve(pkgDir, pkgJson.types);
        } else if (pkgJson.typings) {
          typesPath = path.resolve(pkgDir, pkgJson.typings);
        } else if (pkgJson.exports?.['.']?.types) {
          typesPath = path.resolve(pkgDir, pkgJson.exports['.'].types);
        }
      } catch {
        // Fallback
      }
    }

    // Default types entrypoint fallback
    if (!typesPath || !fs.existsSync(typesPath)) {
      const candidateIndex = path.join(pkgDir, 'index.d.ts');
      const candidateDist = path.join(pkgDir, 'dist', 'index.d.ts');
      const candidateLib = path.join(pkgDir, 'lib', 'typescript', 'index.d.ts');

      if (fs.existsSync(candidateIndex)) typesPath = candidateIndex;
      else if (fs.existsSync(candidateDist)) typesPath = candidateDist;
      else if (fs.existsSync(candidateLib)) typesPath = candidateLib;
    }

    const exportedHooks: string[] = [];
    const exportedComponents: string[] = [];
    const exportedFunctions: string[] = [];
    const exportedTypes: string[] = [];

    // Parse .d.ts if found
    if (typesPath && fs.existsSync(typesPath)) {
      try {
        const dtsContent = fs.readFileSync(typesPath, 'utf-8');
        const exportRegex = /export\s+(?:declare\s+)?(const|function|class|type|interface)\s+([A-Za-z0-9_$]+)/g;
        let match;
        while ((match = exportRegex.exec(dtsContent)) !== null) {
          const kind = match[1];
          const sym = match[2];
          if (!sym) continue;

          if (kind === 'type' || kind === 'interface') {
            exportedTypes.push(sym);
          } else if (sym.startsWith('use')) {
            exportedHooks.push(sym);
          } else if (/^[A-Z]/.test(sym) && !sym.endsWith('Props') && !sym.endsWith('Type')) {
            exportedComponents.push(sym);
          } else if (/^[a-z]/.test(sym)) {
            exportedFunctions.push(sym);
          } else {
            exportedTypes.push(sym);
          }
        }

        // Also check export { Foo, Bar } or export { Foo as Bar }
        const namedExportRegex = /export\s*\{\s*([^}]+)\s*\}/g;
        while ((match = namedExportRegex.exec(dtsContent)) !== null) {
          const names = match[1]?.split(',') ?? [];
          for (const rawName of names) {
            const parts = rawName.trim().split(/\s+as\s+/);
            const clean = (parts.length > 1 ? parts[1] : parts[0])?.trim();
            if (!clean || clean.startsWith('type ')) continue;

            if (clean.startsWith('use') && !exportedHooks.includes(clean)) {
              exportedHooks.push(clean);
            } else if (/^[A-Z]/.test(clean) && !exportedComponents.includes(clean)) {
              exportedComponents.push(clean);
            } else if (/^[a-z]/.test(clean) && !exportedFunctions.includes(clean)) {
              exportedFunctions.push(clean);
            }
          }
        }

        // Parse shallow relative re-exports (export * from './...')
        const starExportRegex = /export\s+\*\s+from\s+['"]([^'"]+)['"]/g;
        while ((match = starExportRegex.exec(dtsContent)) !== null) {
          const rel = match[1];
          if (!rel || !rel.startsWith('.')) continue;
          const candidates = [
            path.resolve(path.dirname(typesPath), `${rel}.d.ts`),
            path.resolve(path.dirname(typesPath), rel, 'index.d.ts'),
            path.resolve(path.dirname(typesPath), `${rel}.d.mts`)
          ];
          for (const cand of candidates) {
            if (fs.existsSync(cand)) {
              try {
                const subContent = fs.readFileSync(cand, 'utf-8');
                let subMatch;
                const subExportRegex = /export\s+(?:declare\s+)?(const|function|class|type|interface)\s+([A-Za-z0-9_$]+)/g;
                while ((subMatch = subExportRegex.exec(subContent)) !== null) {
                  const sym = subMatch[2];
                  if (!sym) continue;
                  if (sym.startsWith('use') && !exportedHooks.includes(sym)) {
                    exportedHooks.push(sym);
                  } else if (/^[A-Z]/.test(sym) && !sym.endsWith('Props') && !sym.endsWith('Type') && !exportedComponents.includes(sym)) {
                    exportedComponents.push(sym);
                  } else if (/^[a-z]/.test(sym) && !exportedFunctions.includes(sym)) {
                    exportedFunctions.push(sym);
                  }
                }
              } catch {
                // Ignore sub-file read errors
              }
              break;
            }
          }
        }
      } catch {
        // Skip unparseable dts
      }
    }

    // Extract usage snippet from README.md
    let usageSnippet: string | null = null;
    const readmePath = path.join(pkgDir, 'README.md');
    if (fs.existsSync(readmePath)) {
      try {
        const readme = fs.readFileSync(readmePath, 'utf-8');
        const codeBlockMatch = readme.match(/```(?:tsx?|jsx?|javascript|typescript)\s*([\s\S]*?)```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
          const lines = codeBlockMatch[1].trim().split('\n').slice(0, 15);
          usageSnippet = lines.join('\n');
        }
      } catch {
        // Skip
      }
    }

    const totalSymbols = exportedHooks.length + exportedComponents.length + exportedFunctions.length + exportedTypes.length;

    const preflightInstruction = [
      `[PHYSICAL NODE_MODULES AFFORDANCE: ${packageName}@${installedVersion}]`,
      `Located at: ${pkgDir}`,
      `Grounded in real .d.ts declarations (${totalSymbols} symbols detected):`,
      exportedHooks.length > 0 ? `  • Valid Hooks: ${exportedHooks.slice(0, 8).join(', ')}` : null,
      exportedComponents.length > 0 ? `  • Valid Components: ${exportedComponents.slice(0, 8).join(', ')}` : null,
      exportedFunctions.length > 0 ? `  • Valid Functions: ${exportedFunctions.slice(0, 8).join(', ')}` : null,
      'CRITICAL: Any API not declared in the real .d.ts will fail at compile time. DO NOT hallucinate older Major-N APIs.'
    ].filter(Boolean).join('\n');

    return {
      packageName,
      installedVersion,
      packagePath: pkgDir,
      typesEntrypoint: typesPath,
      exportedSymbolsCount: totalSymbols,
      exportedHooks,
      exportedComponents,
      exportedFunctions,
      exportedTypes,
      usageSnippet,
      preflightInstruction
    };
  }

  /**
   * Inspects physical package.json to determine if the package is New Architecture (Fabric / TurboModules) ready.
   */
  public checkNewArchSupport(packageName: string): boolean {
    const pkgDir = this.resolvePackageDir(packageName);
    if (!pkgDir) return false;
    const pkgJsonPath = path.join(pkgDir, 'package.json');
    if (!fs.existsSync(pkgJsonPath)) return false;

    try {
      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
      if (pkgJson.codegenConfig) return true;
      if (pkgJson.fabric === true || pkgJson.turbo === true) return true;
      const allDeps = { ...pkgJson.dependencies, ...pkgJson.peerDependencies };
      if (allDeps['react-native-nitro-modules'] || allDeps['react-native-worklets']) return true;
      return false;
    } catch {
      return false;
    }
  }
}

