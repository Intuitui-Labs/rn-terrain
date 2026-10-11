/**
 * @file ast-scoped-parser.ts
 * High-Speed Scoped AST Visitor Engine for React Native Architectural Invariants.
 *
 * Built on Babel AST parser. Provides complete immunity against:
 *   1. Comments (single-line // and multi-line block comments)
 *   2. String literals ("...", '...', `...`)
 *   3. Test mocks (jest.mock, vi.mock calls)
 *   4. Documentation examples and logs
 *
 * Scope Resolution:
 *   - Direct imports and calls: import { useAnimatedGestureHandler } / fn(...)
 *   - Star / Namespace imports: import * as Reanimated from '...' / Reanimated.useAnimatedGestureHandler()
 *   - CommonJS requires: const { useAnimatedGestureHandler } = require('...')
 *   - CommonJS namespaces: const RN = require('react-native') / RN.AsyncStorage
 */

import { parse, type ParserPlugin } from '@babel/parser';
import _traverse from '@babel/traverse';
import { CANONICAL_SEVERED_RULES, type SeveredRule } from './rules/canonical-severed-rules.js';

// Handle ESM default import interop for Babel traverse
const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default;

export interface AstViolation {
  ruleId: string;
  package: string;
  symbol: string;
  replacement: string;
  message: string;
  line: number;
  column: number;
  template?: string;
  severity?: 'hard' | 'soft';
}

export interface ParseOptions {
  rules?: SeveredRule[];
  filePath?: string;
  ignoreTestMocks?: boolean;
}

/**
 * Checks whether an inline comment matches an ignore directive.
 * Supports:
 *   // @rn-terrain-ignore
 *   // @rn-terrain-ignore-next-line
 *   // @rn-terrain-ignore: reason
 *   // @rn-terrain-ignore <ruleId|symbol>
 *   /* @rn-terrain-ignore * /
 */
function matchesIgnoreDirective(lineText: string, ruleId: string, symbol: string): boolean {
  if (!lineText) return false;
  // Match @rn-terrain-ignore or @rn-terrain-ignore-next-line
  // followed optionally by : or space
  const match = lineText.match(/(?:\/\/|\/\*)\s*@rn-terrain-ignore(?:-next-line)?(?::\s*(.*?)|\s+(.*?))?(?:\*\/)?$/i);
  if (!match) return false;

  // If match[1] is matched, it started with a colon `:` e.g. `@rn-terrain-ignore: legacy code`
  if (match[1] !== undefined) {
    return true;
  }

  const directiveArg = (match[2] || '').trim();
  // If no arguments or a plain reason string (e.g. "(ticket-123)"), ignore all violations on target line
  if (!directiveArg || directiveArg.startsWith('-') || directiveArg.startsWith('(')) {
    return true;
  }

  // If there is a colon separating rule from reason, e.g. "reanimated-v2-gesture-handler: legacy code"
  const beforeColon = (directiveArg.split(':')[0] || '').trim();
  const tokens = beforeColon.split(/[\s,]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
  const targetTokens = [
    ruleId.toLowerCase(),
    symbol.toLowerCase(),
    (symbol.split('.').pop() || '').toLowerCase()
  ].filter(Boolean);

  return targetTokens.some(t => tokens.includes(t));
}

function isViolationIgnored(
  sourceLines: string[],
  v: AstViolation
): boolean {
  const lineIdx = v.line - 1; // 0-indexed line

  // Check 1: Trailing comment on the exact same line
  if (lineIdx >= 0 && lineIdx < sourceLines.length) {
    const line = sourceLines[lineIdx];
    if (line && matchesIgnoreDirective(line, v.ruleId, v.symbol)) {
      return true;
    }
  }

  // Check 2: Comment on the immediately preceding line
  if (lineIdx - 1 >= 0 && lineIdx - 1 < sourceLines.length) {
    const prevLine = sourceLines[lineIdx - 1];
    if (prevLine && matchesIgnoreDirective(prevLine, v.ruleId, v.symbol)) {
      return true;
    }
  }

  return false;
}

export class ScopedAstParser {
  private rules: SeveredRule[];

  constructor(customRules?: SeveredRule[]) {
    this.rules = customRules ?? CANONICAL_SEVERED_RULES;
  }

  public parseAndScan(sourceCode: string, options: ParseOptions = {}): AstViolation[] {
    const violations: AstViolation[] = [];
    const activeRules = options.rules ?? this.rules;
    const ignoreTestMocks = options.ignoreTestMocks !== false;

    if (!sourceCode || typeof sourceCode !== 'string' || !sourceCode.trim()) {
      return violations;
    }

    // 1. File-level escape hatch check
    if (/(?:\/\/|\/\*)\s*@rn-terrain-ignore-file\b/i.test(sourceCode)) {
      return [];
    }

    // 2. Lenient AST parsing with Flow / TypeScript auto-detection
    const isFlow = /^\s*(?:\/\/|\/\*)\s*@flow\b/m.test(sourceCode);
    const sharedPlugins: ParserPlugin[] = [
      'jsx',
      'classProperties',
      'asyncGenerators',
      'dynamicImport',
      'objectRestSpread',
      'exportDefaultFrom',
      'exportNamespaceFrom'
    ];

    const primaryPlugins: ParserPlugin[] = [
      isFlow ? 'flow' : 'typescript',
      ...sharedPlugins
    ];

    const fallbackPlugins: ParserPlugin[] = [
      isFlow ? 'typescript' : 'flow',
      ...sharedPlugins
    ];

    let ast: any;
    try {
      ast = parse(sourceCode, {
        sourceType: 'module',
        plugins: primaryPlugins,
        errorRecovery: true
      });
    } catch {
      try {
        ast = parse(sourceCode, {
          sourceType: 'module',
          plugins: fallbackPlugins,
          errorRecovery: true
        });
      } catch {
        return violations;
      }
    }

    const importRules = activeRules.filter(r => r.type === 'import');
    const callRules = activeRules.filter(r => r.type === 'call');
    const memberRules = activeRules.filter(r => r.type === 'member');

    // Local scope binding map: identifier -> package name (e.g. 'Reanimated' -> 'react-native-reanimated')
    const namespaceBindings = new Map<string, string>();

    try {
      traverse(ast, {
        // 1. Audit Import Declarations (Named, Default, and Namespace)
        ImportDeclaration(path: any) {
          const sourcePkg = path.node.source.value;

          for (const specifier of path.node.specifiers) {
            // Track Namespace: import * as Reanimated from 'react-native-reanimated'
            if (specifier.type === 'ImportNamespaceSpecifier') {
              namespaceBindings.set(specifier.local.name, sourcePkg);
              continue;
            }

            let importedName = '';
            if (specifier.type === 'ImportSpecifier') {
              importedName = specifier.imported.type === 'Identifier'
                ? specifier.imported.name
                : specifier.imported.value;
            } else if (specifier.type === 'ImportDefaultSpecifier') {
              importedName = specifier.local.name;
            }

            const rule = importRules.find(r => r.package === sourcePkg && r.symbol === importedName);
            if (rule) {
              violations.push({
                ruleId: rule.id,
                package: rule.package,
                symbol: rule.symbol,
                replacement: rule.replacement,
                message: rule.message,
                line: specifier.loc?.start.line ?? path.node.loc?.start.line ?? 1,
                column: specifier.loc?.start.column ?? path.node.loc?.start.column ?? 0,
                template: rule.template,
                severity: rule.severity ?? 'hard'
              });
            }
          }
        },

        // 2. Audit CommonJS require() Declarations
        VariableDeclarator(path: any) {
          const init = path.node.init;
          if (
            init &&
            init.type === 'CallExpression' &&
            init.callee?.type === 'Identifier' &&
            init.callee.name === 'require' &&
            init.arguments.length > 0 &&
            init.arguments[0].type === 'StringLiteral'
          ) {
            const sourcePkg = init.arguments[0].value;
            const id = path.node.id;

            // Destructured: const { useAnimatedGestureHandler, AsyncStorage } = require('...')
            if (id.type === 'ObjectPattern') {
              for (const prop of id.properties) {
                if (prop.type === 'ObjectProperty') {
                  const propName = prop.key.type === 'Identifier' ? prop.key.name : prop.key.value;
                  const rule = importRules.find(r => r.package === sourcePkg && r.symbol === propName) ||
                               callRules.find(r => r.package === sourcePkg && r.symbol === propName);
                  if (rule) {
                    violations.push({
                      ruleId: rule.id,
                      package: rule.package,
                      symbol: rule.symbol,
                      replacement: rule.replacement,
                      message: rule.message,
                      line: prop.loc?.start.line ?? path.node.loc?.start.line ?? 1,
                      column: prop.loc?.start.column ?? path.node.loc?.start.column ?? 0,
                      template: rule.template,
                      severity: rule.severity ?? 'hard'
                    });
                  }
                }
              }
            } else if (id.type === 'Identifier') {
              // Namespace: const Reanimated = require('react-native-reanimated')
              namespaceBindings.set(id.name, sourcePkg);
            }
          }
        },

        // 3. Audit Call Expressions (Direct and Namespace calls)
        CallExpression(path: any) {
          // Check if call is nested inside jest.mock(...) or vi.mock(...)
          if (ignoreTestMocks) {
            let isInsideMock = false;
            let current = path.parentPath;
            while (current) {
              if (
                current.node.type === 'CallExpression' &&
                current.node.callee?.type === 'MemberExpression' &&
                (current.node.callee.object?.name === 'jest' || current.node.callee.object?.name === 'vi') &&
                current.node.callee.property?.name === 'mock'
              ) {
                isInsideMock = true;
                break;
              }
              current = current.parentPath;
            }
            if (isInsideMock) return;
          }

          const callee = path.node.callee;

          // Direct Identifier Call: fn(...)
          if (callee.type === 'Identifier') {
            const calleeName = callee.name;
            const rule = callRules.find(r => r.symbol === calleeName);
            if (rule) {
              violations.push({
                ruleId: rule.id,
                package: rule.package,
                symbol: rule.symbol,
                replacement: rule.replacement,
                message: rule.message,
                line: callee.loc?.start.line ?? path.node.loc?.start.line ?? 1,
                column: callee.loc?.start.column ?? path.node.loc?.start.column ?? 0,
                template: rule.template,
                severity: rule.severity ?? 'hard'
              });
            }
          }

          // Member Call: Obj.method(...) or Namespace.method(...)
          if (callee.type === 'MemberExpression') {
            const objName = callee.object?.type === 'Identifier' ? callee.object.name : '';
            const propName = callee.property?.type === 'Identifier'
              ? callee.property.name
              : callee.property?.type === 'StringLiteral'
              ? callee.property.value
              : '';

            // Check if objName is a tracked namespace (e.g. Reanimated.useAnimatedGestureHandler)
            if (objName && namespaceBindings.has(objName)) {
              const boundPkg = namespaceBindings.get(objName);
              const rule = callRules.find(r => r.package === boundPkg && r.symbol === propName);
              if (rule) {
                violations.push({
                  ruleId: rule.id,
                  package: rule.package,
                  symbol: `${objName}.${propName}`,
                  replacement: rule.replacement,
                  message: rule.message,
                  line: callee.loc?.start.line ?? path.node.loc?.start.line ?? 1,
                  column: callee.loc?.start.column ?? path.node.loc?.start.column ?? 0,
                  template: rule.template,
                  severity: rule.severity ?? 'hard'
                });
              }
            }

            // Direct member rule check (e.g. BackHandler.removeEventListener)
            const memberRule = memberRules.find(r => r.memberObject === objName && r.memberProperty === propName);
            if (memberRule) {
              violations.push({
                ruleId: memberRule.id,
                package: memberRule.package,
                symbol: `${objName}.${propName}`,
                replacement: memberRule.replacement,
                message: memberRule.message,
                line: callee.loc?.start.line ?? path.node.loc?.start.line ?? 1,
                column: callee.loc?.start.column ?? path.node.loc?.start.column ?? 0,
                template: memberRule.template,
                severity: memberRule.severity ?? 'hard'
              });
            }
          }
        },

        // 4. Audit Member Expression Property Access on Namespaces (e.g. RN.AsyncStorage, RN.ViewPropTypes)
        MemberExpression(path: any) {
          // Skip if this is the callee of a CallExpression (handled in CallExpression)
          if (path.parentPath.node.type === 'CallExpression' && path.parentPath.node.callee === path.node) {
            return;
          }

          const objName = path.node.object?.type === 'Identifier' ? path.node.object.name : '';
          const propName = path.node.property?.type === 'Identifier'
            ? path.node.property.name
            : path.node.property?.type === 'StringLiteral'
            ? path.node.property.value
            : '';

          if (objName && namespaceBindings.has(objName)) {
            const boundPkg = namespaceBindings.get(objName);
            const rule = importRules.find(r => r.package === boundPkg && r.symbol === propName);
            if (rule) {
              violations.push({
                ruleId: rule.id,
                package: rule.package,
                symbol: `${objName}.${propName}`,
                replacement: rule.replacement,
                message: rule.message,
                line: path.node.loc?.start.line ?? 1,
                column: path.node.loc?.start.column ?? 0,
                template: rule.template,
                severity: rule.severity ?? 'hard'
              });
            }
          }
        }
      });
    } catch {}

    const sourceLines = sourceCode.split('\n');
    return violations.filter(v => !isViolationIgnored(sourceLines, v));
  }
}
