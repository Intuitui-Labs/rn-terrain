/**
 * @file jsdoc-replacement-extractor.ts
 * Swift-Inspired JSDoc Deprecation & Replacement Extractor.
 *
 * Imprints the Swift `@available(*, deprecated, renamed: "...")` paradigm onto
 * TypeScript declaration files (.d.ts). Parses JSDoc annotations to automatically
 * synthesize machine-actionable SeveredRules and replacement recipes without
 * human curation.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync, execFileSync } from 'node:child_process';
import { NodeModulesAffordanceEngine } from './node-modules-affordance.js';

export interface ExtractedSeveredRule {
  id: string;
  package: string;
  symbol: string;
  type: 'call' | 'import' | 'member';
  severity: 'hard' | 'soft';
  replacement: string;
  message: string;
  sourceFile?: string;
}

export class JsdocReplacementExtractor {
  /**
   * Scans a TypeScript declaration (.d.ts) source string and extracts all
   * JSDoc @deprecated symbols along with their machine-readable replacements.
   */
  public extractRulesFromSource(
    dtsSource: string,
    options: { packageName: string; filePath?: string }
  ): ExtractedSeveredRule[] {
    const rules: ExtractedSeveredRule[] = [];
    if (!dtsSource || typeof dtsSource !== 'string') return rules;

    // Pattern to capture JSDoc block immediately preceding a declaration (exported or declared)
    // Uses strictly non-crossing comment body [^*]*(?:\*(?!\/)[^*]*)* to prevent multi-comment regex backtracking
    const jsdocDeclRegex = /\/\*\*([^*]*(?:\*(?!\/)[^*]*)*)\*\/\s*(?:(?:export\s+)?(?:declare\s+)?(?:default\s+)?(?:const|let|var|function|class|interface|type)\s+([a-zA-Z0-9_$]+))/g;

    let match: RegExpExecArray | null;
    while ((match = jsdocDeclRegex.exec(dtsSource)) !== null) {
      const docComment = match[1];
      const symbolName = match[2];

      if (!docComment || !symbolName || !docComment.includes('@deprecated')) {
        continue;
      }

      const extracted = this.parseDeprecationComment(docComment, symbolName, options.packageName);
      if (extracted) {
        rules.push({
          ...extracted,
          sourceFile: options.filePath
        });
      }
    }

    return rules;
  }

  /**
   * Scans installed package declaration files in node_modules for a given package.
   */
  public extractRulesFromInstalledPackage(
    packageName: string,
    projectRoot: string = process.cwd(),
    packageDir?: string
  ): ExtractedSeveredRule[] {
    const affordance = new NodeModulesAffordanceEngine(projectRoot);
    const pkgDir = packageDir || affordance.resolvePackageDir(packageName) || path.resolve(projectRoot, 'node_modules', packageName);
    const pkgJsonPath = path.resolve(pkgDir, 'package.json');

    if (!fs.existsSync(pkgJsonPath)) {
      return [];
    }

    const dtsFilesToScan: string[] = [];

    // 1. Rust ripgrep search for all declaration files containing @deprecated
    try {
      const rgArgs = ['-l', '@deprecated', '-g', '*.d.ts', pkgDir];
      const rgOut = execFileSync('rg', rgArgs, {
        stdio: ['pipe', 'pipe', 'ignore'],
        maxBuffer: 10 * 1024 * 1024,
        shell: false,
      }).toString();
      const found = rgOut.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
      dtsFilesToScan.push(...found);
    } catch {}

    // Fallback: Check package.json entrypoint and crawl package subdirectories if ripgrep found nothing
    if (dtsFilesToScan.length === 0) {
      try {
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        const typesFile = pkgJson.types || pkgJson.typings || 'index.d.ts';
        const dtsPath = path.resolve(pkgDir, typesFile);
        if (fs.existsSync(dtsPath)) {
          dtsFilesToScan.push(dtsPath);
        }
      } catch {}

      // Crawl for .d.ts files containing @deprecated
      const collectDts = (dir: string, depth = 0) => {
        if (depth > 5 || !fs.existsSync(dir)) return;
        try {
          const entries = fs.readdirSync(dir, { withFileTypes: true });
          for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory() && !['node_modules', '.git'].includes(entry.name)) {
              collectDts(full, depth + 1);
            } else if (entry.isFile() && entry.name.endsWith('.d.ts')) {
              try {
                const head = fs.readFileSync(full, 'utf8');
                if (head.includes('@deprecated')) {
                  dtsFilesToScan.push(full);
                }
              } catch {}
            }
          }
        } catch {}
      };
      collectDts(pkgDir);
    }

    const allRules: ExtractedSeveredRule[] = [];
    for (const dtsPath of dtsFilesToScan) {
      try {
        if (fs.existsSync(dtsPath)) {
          const dtsContent = fs.readFileSync(dtsPath, 'utf8');
          const rules = this.extractRulesFromSource(dtsContent, {
            packageName,
            filePath: path.relative(projectRoot, dtsPath)
          });
          allRules.push(...rules);
        }
      } catch {}
    }

    return allRules;
  }

  /**
   * High-performance batch extraction of JSDoc @deprecated rules across multiple packages
   * using chunked Sovereign Rust ripgrep passes.
   */
  public extractRulesFromPackagesBatch(
    packageNames: string[],
    projectRoot: string = process.cwd()
  ): ExtractedSeveredRule[] {
    const affordance = new NodeModulesAffordanceEngine(projectRoot);
    const pkgMap = new Map<string, string>(); // normalizedPkgDir -> packageName

    for (const name of packageNames) {
      const dir = affordance.resolvePackageDir(name) || path.resolve(projectRoot, 'node_modules', name);
      if (fs.existsSync(path.join(dir, 'package.json'))) {
        pkgMap.set(path.normalize(dir).toLowerCase(), name);
      }
    }

    if (pkgMap.size === 0) return [];

    const dirsToScan = Array.from(pkgMap.keys());
    const matchedFiles: string[] = [];
    const CHUNK_SIZE = 50;

    for (let i = 0; i < dirsToScan.length; i += CHUNK_SIZE) {
      const chunk = dirsToScan.slice(i, i + CHUNK_SIZE);
      try {
        const rgArgs = ['-l', '@deprecated', '-g', '*.d.ts', '--max-depth', '4', ...chunk];
        const rgOut = execFileSync('rg', rgArgs, {
          stdio: ['pipe', 'pipe', 'ignore'],
          maxBuffer: 20 * 1024 * 1024,
          shell: false,
        }).toString();
        const lines = rgOut.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
        matchedFiles.push(...lines);
      } catch {
        // Fallback for this chunk
        for (const dir of chunk) {
          const pkgName = pkgMap.get(dir) || 'unknown';
          try {
            const rules = this.extractRulesFromInstalledPackage(pkgName, projectRoot, dir);
            for (const r of rules) {
              if (r.sourceFile) {
                matchedFiles.push(path.resolve(projectRoot, r.sourceFile));
              }
            }
          } catch {}
        }
      }
    }

    const allRules: ExtractedSeveredRule[] = [];
    const uniqueFiles = Array.from(new Set(matchedFiles));

    for (const filePath of uniqueFiles) {
      if (!filePath || !fs.existsSync(filePath)) continue;
      const normalizedPath = path.normalize(filePath).toLowerCase();
      let matchedPkgName = 'unknown';
      for (const [pkgDir, pkgName] of pkgMap.entries()) {
        if (normalizedPath.startsWith(pkgDir)) {
          matchedPkgName = pkgName;
          break;
        }
      }

      try {
        const dtsContent = fs.readFileSync(filePath, 'utf8');
        const rules = this.extractRulesFromSource(dtsContent, {
          packageName: matchedPkgName,
          filePath: path.relative(projectRoot, filePath),
        });
        allRules.push(...rules);
      } catch {}
    }

    return allRules;
  }

  /**
   * Analyzes JSDoc @deprecated text to extract symbol replacements and determine severity.
   */
  private parseDeprecationComment(
    docComment: string,
    symbolName: string,
    packageName: string
  ): Omit<ExtractedSeveredRule, 'sourceFile'> | null {
    // 1. Clean JSDoc comment lines (strip leading * and whitespace)
    const cleanLines = docComment
      .split('\n')
      .map((l) => l.replace(/^\s*\*\s?/, '').trim())
      .filter(Boolean);

    const fullText = cleanLines.join(' ');
    const deprecatedIdx = fullText.indexOf('@deprecated');
    if (deprecatedIdx === -1) return null;

    const deprecationNotice = fullText.substring(deprecatedIdx + '@deprecated'.length).trim();

    // 2. Extract replacement (Swift renamed: equivalent)
    let replacement = '';

    // Match @link: Use {@link Gesture.Pan}
    const linkMatch = deprecationNotice.match(/(?:(?:Please\s+)?use|Migrated\s+to|Replaced\s+by|Switch\s+to)\s+\{@link\s+([^}]+)\}/i);
    const linkGroup = linkMatch?.[1];
    if (linkGroup) {
      replacement = linkGroup.trim();
    }

    // Match code backticks: Use `interpolate()` or 'Gesture.Pan()'
    if (!replacement) {
      const backtickMatch = deprecationNotice.match(/(?:(?:Please\s+)?use|Migrated\s+to|Replaced\s+by|Switch\s+to)\s+[`']([a-zA-Z0-9_$.()\-]+)[`']/i);
      const backtickGroup = backtickMatch?.[1];
      if (backtickGroup) {
        replacement = backtickGroup.trim();
      }
    }

    // Match plain text identifier: Use Gesture.Pan instead
    if (!replacement) {
      const plainMatch = deprecationNotice.match(/(?:(?:Please\s+)?use|Migrated\s+to|Replaced\s+by|Switch\s+to)\s+([a-zA-Z0-9_$.]+)(?:\s+instead|\s+from|\.|\s*$)/i);
      const plainGroup = plainMatch?.[1];
      if (plainGroup && !['the', 'a', 'an', 'this'].includes(plainGroup.toLowerCase())) {
        replacement = plainGroup.trim();
      }
    }

    // Match alternative package: Import from '@react-native-async-storage/async-storage'
    if (!replacement) {
      const importMatch = deprecationNotice.match(/(?:Import|Install|Use)\s+from\s+['"]([^'"]+)['"]/i);
      const importGroup = importMatch?.[1];
      if (importGroup) {
        replacement = `Import from '${importGroup}'`;
      }
    }

    if (!replacement) {
      replacement = `Consult ${packageName} documentation for modern alternative`;
    }

    // 3. Determine severity (Java forRemoval=true equivalent)
    const lower = fullText.toLowerCase();
    const isHardSevered =
      lower.includes('removed in') ||
      lower.includes('has been removed') ||
      lower.includes('will be removed') ||
      lower.includes('crashes') ||
      lower.includes('no longer supported') ||
      lower.includes('fatal') ||
      lower.includes('for removal');

    const severity: 'hard' | 'soft' = isHardSevered ? 'hard' : 'soft';

    return {
      id: `${packageName}-${symbolName}-jsdoc-deprecated`,
      package: packageName,
      symbol: symbolName,
      type: symbolName.startsWith('use') || symbolName.endsWith('Handler') ? 'call' : 'import',
      severity,
      replacement,
      message: deprecationNotice || `'${symbolName}' is deprecated in ${packageName}.`
    };
  }
}
