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

    // Pattern to capture JSDoc block immediately preceding an exported declaration
    const jsdocDeclRegex = /\/\*\*([\s\S]*?)\*\/\s*(?:export\s+(?:declare\s+)?(?:default\s+)?(?:const|let|var|function|class|interface|type)\s+([a-zA-Z0-9_$]+))/g;

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
    projectRoot: string = process.cwd()
  ): ExtractedSeveredRule[] {
    const pkgDir = path.resolve(projectRoot, 'node_modules', packageName);
    const pkgJsonPath = path.resolve(pkgDir, 'package.json');

    if (!fs.existsSync(pkgJsonPath)) {
      return [];
    }

    try {
      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
      const typesFile = pkgJson.types || pkgJson.typings || 'index.d.ts';
      const dtsPath = path.resolve(pkgDir, typesFile);

      if (fs.existsSync(dtsPath)) {
        const dtsContent = fs.readFileSync(dtsPath, 'utf8');
        return this.extractRulesFromSource(dtsContent, {
          packageName,
          filePath: path.relative(projectRoot, dtsPath)
        });
      }
    } catch {}

    return [];
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
    const linkMatch = deprecationNotice.match(/(?:Use|Migrated\s+to|Replaced\s+by)\s+\{@link\s+([^}]+)\}/i);
    const linkGroup = linkMatch?.[1];
    if (linkGroup) {
      replacement = linkGroup.trim();
    }

    // Match code backticks: Use `interpolate()` or 'Gesture.Pan()'
    if (!replacement) {
      const backtickMatch = deprecationNotice.match(/(?:Use|Migrated\s+to|Replaced\s+by)\s+[`']([a-zA-Z0-9_$.()\-]+)[`']/i);
      const backtickGroup = backtickMatch?.[1];
      if (backtickGroup) {
        replacement = backtickGroup.trim();
      }
    }

    // Match plain text identifier: Use Gesture.Pan instead
    if (!replacement) {
      const plainMatch = deprecationNotice.match(/(?:Use|Migrated\s+to|Replaced\s+by)\s+([a-zA-Z0-9_$.]+)(?:\s+instead|\s+from|\.|\s*$)/i);
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
