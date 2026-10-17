/**
 * @file sovereign-version-differ.ts
 * Sovereign Local N-1 Declaration Differ & Severed Flag Extractor.
 *
 * Solves the fundamental React Native upgrade challenge:
 * When package P bumps from N-1 to N, version N's source code deletes removed symbols.
 * This engine locally sources N-1 typings (.d.ts) without a centralized server database,
 * diffs the exported ASTs, extracts JSDoc migration recipes, and generates machine-actionable
 * SeveredRules directly into the local project ruleset.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { JsdocReplacementExtractor, type ExtractedSeveredRule } from './jsdoc-replacement-extractor.js';
import { NodeModulesAffordanceEngine } from './node-modules-affordance.js';

export interface SovereignDiffOptions {
  packageName: string;
  fromVersion?: string; // Optional! Auto-inferred from registry or lockfile if omitted
  toVersion?: string;   // e.g. '3.6.0' (N) or 'installed'
  projectRoot?: string;
  cacheDir?: string;
}

export interface ExtractedDiffSymbol {
  name: string;
  kind: 'function' | 'hook' | 'component' | 'type' | 'const' | 'unknown';
  deprecated?: boolean;
  deprecationNotice?: string;
  replacement?: string;
  filePath?: string;
}

export interface SovereignVersionDiffReport {
  packageName: string;
  fromVersion: string;
  toVersion: string;
  severedSymbolsCount: number;
  newlyDeprecatedCount: number;
  severedRules: ExtractedSeveredRule[];
  newlyDeprecatedRules: ExtractedSeveredRule[];
  source: 'local-pnpm-store' | 'local-cache' | 'npm-pack-ephemeral' | 'synthetic' | 'npm-registry-inferred' | 'single-version-reflection';
  rulesSavedPath?: string;
}

export class SovereignVersionDiffer {
  private extractor = new JsdocReplacementExtractor();

  constructor(private readonly projectRoot: string = process.cwd()) {}

  /**
   * Automatically infers predecessor version (N-1) by querying npm registry versions.
   */
  public static inferPredecessorVersion(packageName: string, targetVersion: string): string | null {
    try {
      const out = execFileSync('npm', ['view', packageName, 'versions', '--json'], {
        stdio: ['pipe', 'pipe', 'ignore'],
        timeout: 2000,
        shell: process.platform === 'win32',
      }).toString();
      const allVersions: string[] = JSON.parse(out);
      if (!Array.isArray(allVersions) || allVersions.length === 0) return null;

      const idx = allVersions.indexOf(targetVersion);
      if (idx > 0) {
        const currentMajor = parseInt(targetVersion.split('.')[0] ?? '0', 10);
        if (currentMajor > 1) {
          const priorMajorVersions = allVersions.filter((v) => {
            const maj = parseInt(v.split('.')[0] ?? '0', 10);
            return maj === currentMajor - 1;
          });
          if (priorMajorVersions.length > 0) {
            return priorMajorVersions[priorMajorVersions.length - 1] ?? allVersions[idx - 1] ?? null;
          }
        }
        return allVersions[idx - 1] ?? null;
      } else {
        return allVersions[allVersions.length - 2] ?? null;
      }
    } catch {
      return null;
    }
  }

  /**
   * Resolves the default sovereign cache directory for N-1 package typings.
   */
  public getCacheDir(customCacheDir?: string): string {
    if (customCacheDir) return path.resolve(customCacheDir);
    const homeDir = os.homedir();
    const cacheDir = path.join(homeDir, '.rn-terrain', 'cache');
    fs.mkdirSync(cacheDir, { recursive: true });
    return cacheDir;
  }

  /**
   * Diffs two package versions (N-1 vs N) and extracts severed rules.
   * If N-1 does not exist (initial release), gracefully falls back to single-version reflection.
   */
  public async diffVersions(options: SovereignDiffOptions): Promise<SovereignVersionDiffReport> {
    const { packageName } = options;
    const projectRoot = options.projectRoot ? path.resolve(options.projectRoot) : this.projectRoot;
    const cacheDir = this.getCacheDir(options.cacheDir);

    // 1. Resolve Target Version N (installed or specific)
    let toVersion = options.toVersion || 'installed';
    let toDir: string | null = null;

    if (toVersion === 'installed') {
      const affordance = new NodeModulesAffordanceEngine(projectRoot);
      toDir = affordance.resolvePackageDir(packageName);
      if (toDir && fs.existsSync(path.join(toDir, 'package.json'))) {
        try {
          const pkgJson = JSON.parse(fs.readFileSync(path.join(toDir, 'package.json'), 'utf8'));
          toVersion = pkgJson.version || 'installed';
        } catch {}
      }
    } else {
      toDir = await this.resolveOrAcquireVersionDir(packageName, toVersion, cacheDir);
    }

    // 2. Resolve Anchor Version N-1 (explicit or inferred)
    let fromVersion = options.fromVersion;
    if (!fromVersion && toVersion !== 'installed') {
      fromVersion = SovereignVersionDiffer.inferPredecessorVersion(packageName, toVersion) ?? undefined;
    }

    // Fallback: If still no N-1 (initial package release, v1.0.0, or offline)
    if (!fromVersion) {
      const toSymbols = toDir ? this.extractSymbolsFromDir(toDir, packageName) : new Map<string, ExtractedDiffSymbol>();
      const newlyDeprecatedRules: ExtractedSeveredRule[] = [];

      for (const [name, sym] of toSymbols.entries()) {
        if (sym.deprecated) {
          newlyDeprecatedRules.push({
            id: `${packageName.replace(/[@/]/g, '-')}-${toVersion}-${name}-deprecated`,
            package: packageName,
            symbol: name,
            type: name.startsWith('use') || name.endsWith('Handler') ? 'call' : 'import',
            severity: 'soft',
            replacement: sym.replacement || 'Modern alternative recommended',
            message: sym.deprecationNotice || `'${name}' is marked deprecated in ${packageName}@${toVersion}.`,
            sourceFile: sym.filePath,
          });
        }
      }

      return {
        packageName,
        fromVersion: 'none (initial release)',
        toVersion,
        severedSymbolsCount: 0,
        newlyDeprecatedCount: newlyDeprecatedRules.length,
        severedRules: [],
        newlyDeprecatedRules,
        source: 'single-version-reflection',
      };
    }

    // 3. Resolve or Acquire Anchor Version N-1
    const { dir: fromDir, source } = await this.resolveOrAcquireFromVersion(
      packageName,
      fromVersion,
      projectRoot,
      cacheDir
    );

    if (!fromDir || !fs.existsSync(fromDir)) {
      // Graceful fallback to single-version reflection if N-1 typings are unacquirable
      const toSymbols = toDir ? this.extractSymbolsFromDir(toDir, packageName) : new Map<string, ExtractedDiffSymbol>();
      const newlyDeprecatedRules: ExtractedSeveredRule[] = [];
      for (const [name, sym] of toSymbols.entries()) {
        if (sym.deprecated) {
          newlyDeprecatedRules.push({
            id: `${packageName.replace(/[@/]/g, '-')}-${toVersion}-${name}-deprecated`,
            package: packageName,
            symbol: name,
            type: name.startsWith('use') || name.endsWith('Handler') ? 'call' : 'import',
            severity: 'soft',
            replacement: sym.replacement || 'Modern alternative recommended',
            message: sym.deprecationNotice || `'${name}' is marked deprecated in ${packageName}@${toVersion}.`,
            sourceFile: sym.filePath,
          });
        }
      }
      return {
        packageName,
        fromVersion,
        toVersion,
        severedSymbolsCount: 0,
        newlyDeprecatedCount: newlyDeprecatedRules.length,
        severedRules: [],
        newlyDeprecatedRules,
        source: 'single-version-reflection',
      };
    }

    // 3. Extract Exported Symbols from N-1 and N
    const fromSymbols = this.extractSymbolsFromDir(fromDir, packageName);
    const toSymbols = toDir ? this.extractSymbolsFromDir(toDir, packageName) : new Map<string, ExtractedDiffSymbol>();

    // 4. Compute Set Difference (Symbols in N-1 that were removed in N)
    const severedRules: ExtractedSeveredRule[] = [];
    const newlyDeprecatedRules: ExtractedSeveredRule[] = [];

    for (const [name, sym] of fromSymbols.entries()) {
      if (!toSymbols.has(name)) {
        // Severed Symbol!
        const ruleId = `${packageName.replace(/[@/]/g, '-')}-${toVersion}-${name}-severed`;
        const replacement = sym.replacement || `Consult ${packageName}@${toVersion} migration guide`;
        const notice = sym.deprecationNotice || `'${name}' was severed in ${packageName}@${toVersion} (last present in ${fromVersion}).`;

        severedRules.push({
          id: ruleId,
          package: packageName,
          symbol: name,
          type: name.startsWith('use') || name.endsWith('Handler') ? 'call' : 'import',
          severity: 'hard',
          replacement,
          message: notice,
          sourceFile: sym.filePath,
        });
      } else {
        // Exists in both: Check if newly deprecated in N
        const toSym = toSymbols.get(name)!;
        if (toSym.deprecated && !sym.deprecated) {
          const ruleId = `${packageName.replace(/[@/]/g, '-')}-${toVersion}-${name}-deprecated`;
          newlyDeprecatedRules.push({
            id: ruleId,
            package: packageName,
            symbol: name,
            type: name.startsWith('use') || name.endsWith('Handler') ? 'call' : 'import',
            severity: 'soft',
            replacement: toSym.replacement || 'Modern alternative recommended',
            message: toSym.deprecationNotice || `'${name}' is newly deprecated in ${packageName}@${toVersion}.`,
            sourceFile: toSym.filePath,
          });
        }
      }
    }

    return {
      packageName,
      fromVersion,
      toVersion,
      severedSymbolsCount: severedRules.length,
      newlyDeprecatedCount: newlyDeprecatedRules.length,
      severedRules,
      newlyDeprecatedRules,
      source,
    };
  }

  /**
   * Scans a directory for all .d.ts files and extracts exported symbols along with JSDoc metadata.
   */
  public extractSymbolsFromDir(dirPath: string, packageName: string): Map<string, ExtractedDiffSymbol> {
    const symbols = new Map<string, ExtractedDiffSymbol>();
    const dtsFiles = this.findDtsFiles(dirPath);

    for (const dtsPath of dtsFiles) {
      try {
        const content = fs.readFileSync(dtsPath, 'utf8');
        const extracted = this.extractSymbolsFromDts(content, packageName, path.relative(dirPath, dtsPath));
        for (const [name, sym] of extracted.entries()) {
          if (!symbols.has(name)) {
            symbols.set(name, sym);
          }
        }
      } catch {}
    }

    return symbols;
  }

  /**
   * Extracts exported symbols, kinds, and JSDoc @deprecated annotations from a single .d.ts string.
   */
  public extractSymbolsFromDts(
    dtsContent: string,
    packageName: string,
    filePath?: string
  ): Map<string, ExtractedDiffSymbol> {
    const symbols = new Map<string, ExtractedDiffSymbol>();
    if (!dtsContent) return symbols;

    // 1. First, parse JSDoc deprecations using JsdocReplacementExtractor
    const deprecationRules = this.extractor.extractRulesFromSource(dtsContent, {
      packageName,
      filePath,
    });
    const deprecationMap = new Map(deprecationRules.map((r) => [r.symbol, r]));

    // 2. Parse direct exports: export (declare)? (const|function|class|type|interface) <name>
    const directExportRegex = /(?:\/\*\*([\s\S]*?)\*\/)?\s*export\s+(?:declare\s+)?(const|let|var|function|class|type|interface)\s+([A-Za-z0-9_$]+)/g;
    let match: RegExpExecArray | null;
    while ((match = directExportRegex.exec(dtsContent)) !== null) {
      const docComment = match[1];
      const kindRaw = match[2];
      const name = match[3];
      if (!name) continue;

      let kind: ExtractedDiffSymbol['kind'] = 'unknown';
      if (kindRaw === 'type' || kindRaw === 'interface') kind = 'type';
      else if (name.startsWith('use')) kind = 'hook';
      else if (/^[A-Z]/.test(name) && !name.endsWith('Props') && !name.endsWith('Type')) kind = 'component';
      else if (/^[a-z]/.test(name)) kind = 'function';
      else kind = 'const';

      const dep = deprecationMap.get(name);
      symbols.set(name, {
        name,
        kind,
        deprecated: Boolean(dep || (docComment && docComment.includes('@deprecated'))),
        deprecationNotice: dep?.message,
        replacement: dep?.replacement,
        filePath,
      });
    }

    // 3. Parse named exports: export { A, B as C }
    const namedExportRegex = /export\s*\{\s*([^}]+)\s*\}/g;
    while ((match = namedExportRegex.exec(dtsContent)) !== null) {
      const rawList = match[1]?.split(',') ?? [];
      for (const item of rawList) {
        const parts = item.trim().split(/\s+as\s+/);
        const name = (parts.length > 1 ? parts[1] : parts[0])?.trim();
        if (!name || name.startsWith('type ') || symbols.has(name)) continue;

        let kind: ExtractedDiffSymbol['kind'] = 'unknown';
        if (name.startsWith('use')) kind = 'hook';
        else if (/^[A-Z]/.test(name) && !name.endsWith('Props')) kind = 'component';
        else if (/^[a-z]/.test(name)) kind = 'function';

        const dep = deprecationMap.get(name);
        symbols.set(name, {
          name,
          kind,
          deprecated: Boolean(dep),
          deprecationNotice: dep?.message,
          replacement: dep?.replacement,
          filePath,
        });
      }
    }

    return symbols;
  }

  /**
   * Resolves or locally fetches N-1 package declarations.
   */
  private async resolveOrAcquireFromVersion(
    packageName: string,
    fromVersion: string,
    projectRoot: string,
    cacheDir: string
  ): Promise<{ dir: string | null; source: SovereignVersionDiffReport['source'] }> {
    const safePkgFolder = packageName.replace(/[@/]/g, '+');
    const versionCacheDir = path.join(cacheDir, `${safePkgFolder}@${fromVersion}`);

    // Option A: Already cached locally
    if (fs.existsSync(versionCacheDir) && this.hasDtsFiles(versionCacheDir)) {
      return { dir: versionCacheDir, source: 'local-cache' };
    }

    // Option B: Local pnpm virtual store
    const pnpmStoreCandidate = path.join(
      projectRoot,
      'node_modules',
      '.pnpm',
      `${safePkgFolder}@${fromVersion}`
    );
    if (fs.existsSync(pnpmStoreCandidate)) {
      const nestedPkg = path.join(pnpmStoreCandidate, 'node_modules', packageName);
      if (fs.existsSync(nestedPkg) && this.hasDtsFiles(nestedPkg)) {
        return { dir: nestedPkg, source: 'local-pnpm-store' };
      }
    }

    // Option C: Ephemeral npm pack into sovereign cache (no external server required)
    try {
      fs.mkdirSync(versionCacheDir, { recursive: true });
      const packed = this.packAndExtractNpm(packageName, fromVersion, versionCacheDir);
      if (packed && this.hasDtsFiles(versionCacheDir)) {
        return { dir: versionCacheDir, source: 'npm-pack-ephemeral' };
      }
    } catch {
      // Fallback
    }

    return { dir: null, source: 'synthetic' };
  }

  /**
   * Resolves or acquires a specific version directory into the sovereign cache.
   */
  private async resolveOrAcquireVersionDir(
    packageName: string,
    version: string,
    cacheDir: string
  ): Promise<string | null> {
    const safePkgFolder = packageName.replace(/[@/]/g, '+');
    const versionCacheDir = path.join(cacheDir, `${safePkgFolder}@${version}`);
    if (fs.existsSync(versionCacheDir) && this.hasDtsFiles(versionCacheDir)) {
      return versionCacheDir;
    }

    try {
      fs.mkdirSync(versionCacheDir, { recursive: true });
      this.packAndExtractNpm(packageName, version, versionCacheDir);
      if (this.hasDtsFiles(versionCacheDir)) {
        return versionCacheDir;
      }
    } catch {}

    return null;
  }

  /**
   * Runs `npm pack <pkg>@<ver>` and extracts only declaration files into target directory.
   */
  private packAndExtractNpm(packageName: string, version: string, targetDir: string): boolean {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rn-terrain-pack-'));
    try {
      // Run npm pack
      execFileSync('npm', ['pack', `${packageName}@${version}`, '--pack-destination', tempDir], {
        stdio: ['pipe', 'pipe', 'ignore'],
        timeout: 20000,
        shell: process.platform === 'win32',
      });

      const files = fs.readdirSync(tempDir);
      const tarball = files.find((f) => f.endsWith('.tgz'));
      if (!tarball) return false;

      const tarballPath = path.join(tempDir, tarball);

      // Extract using system tar
      execFileSync('tar', ['-xzf', tarballPath, '-C', targetDir], {
        stdio: ['pipe', 'pipe', 'ignore'],
        timeout: 10000,
      });

      // npm tarballs unpack into a "package" subfolder. Normalize it if present.
      const packageSubdir = path.join(targetDir, 'package');
      if (fs.existsSync(packageSubdir)) {
        for (const entry of fs.readdirSync(packageSubdir)) {
          const src = path.join(packageSubdir, entry);
          const dest = path.join(targetDir, entry);
          if (!fs.existsSync(dest)) {
            fs.renameSync(src, dest);
          }
        }
      }

      return true;
    } catch {
      return false;
    } finally {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {}
    }
  }

  /**
   * Recursively finds .d.ts files in a directory (limiting depth to 5 levels).
   */
  private findDtsFiles(dir: string, depth = 0): string[] {
    if (depth > 5 || !fs.existsSync(dir)) return [];
    const results: string[] = [];

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (!['node_modules', '.git', 'tests', '__tests__', 'example', 'docs'].includes(entry.name)) {
            results.push(...this.findDtsFiles(fullPath, depth + 1));
          }
        } else if (entry.isFile() && entry.name.endsWith('.d.ts')) {
          results.push(fullPath);
        }
      }
    } catch {}

    return results;
  }

  private hasDtsFiles(dir: string): boolean {
    return this.findDtsFiles(dir).length > 0;
  }

  /**
   * Persists extracted severed rules into the project's sovereign .agents/rules/ directory.
   */
  public syncRulesToProject(rules: ExtractedSeveredRule[], projectRoot: string = this.projectRoot): string {
    const rulesDir = path.join(projectRoot, '.agents', 'rules');
    fs.mkdirSync(rulesDir, { recursive: true });
    const rulesFile = path.join(rulesDir, 'severed-rules.json');

    let existing: ExtractedSeveredRule[] = [];
    if (fs.existsSync(rulesFile)) {
      try {
        existing = JSON.parse(fs.readFileSync(rulesFile, 'utf8'));
      } catch {}
    }

    const existingIds = new Set(existing.map((r) => r.id));
    for (const rule of rules) {
      if (!existingIds.has(rule.id)) {
        existing.push(rule);
        existingIds.add(rule.id);
      }
    }

    fs.writeFileSync(rulesFile, JSON.stringify(existing, null, 2), 'utf8');
    return rulesFile;
  }

  /**
   * Loads previously persisted severed rules from project .agents/rules/severed-rules.json.
   */
  public static loadProjectSeveredRules(projectRoot: string = process.cwd()): ExtractedSeveredRule[] {
    const candidatePaths = [
      path.join(projectRoot, '.agents', 'rules', 'severed-rules.json'),
      path.join(projectRoot, '.rn-terrain', 'rules', 'severed-rules.json'),
    ];

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        try {
          return JSON.parse(fs.readFileSync(p, 'utf8'));
        } catch {}
      }
    }

    return [];
  }
}
