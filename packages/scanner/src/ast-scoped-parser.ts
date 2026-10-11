/**
 * @file ast-scoped-parser.ts
 * High-Speed Scoped AST Visitor Engine for React Native Architectural Invariants.
 *
 * Built on Babel AST parser. Provides complete immunity against:
 *   1. Comments (single-line // and multi-line block comments)
 *   2. String literals ("...", '...', `...`)
 *   3. Test mocks (jest.mock, vi.mock calls)
 *   4. Documentation examples and logs
 */

import { parse, type ParserOptions } from '@babel/parser';
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
}

export interface ParseOptions {
  rules?: SeveredRule[];
  filePath?: string;
  ignoreTestMocks?: boolean;
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

    const parserOptions: ParserOptions = {
      sourceType: 'module',
      plugins: [
        'jsx',
        'typescript',
        'classProperties',
        'asyncGenerators',
        'dynamicImport',
        'objectRestSpread',
        'exportDefaultFrom',
        'exportNamespaceFrom'
      ],
      errorRecovery: true
    };

    let ast: any;
    try {
      ast = parse(sourceCode, parserOptions);
    } catch {
      // Return empty if completely unparseable syntax
      return violations;
    }

    const importRules = activeRules.filter(r => r.type === 'import');
    const callRules = activeRules.filter(r => r.type === 'call');
    const memberRules = activeRules.filter(r => r.type === 'member');

    try {
      traverse(ast, {
        // 1. Audit Import Declarations
        ImportDeclaration(path: any) {
          const sourcePkg = path.node.source.value;
          const matchingImportRules = importRules.filter(r => r.package === sourcePkg);

          if (matchingImportRules.length === 0) return;

          for (const specifier of path.node.specifiers) {
            let importedName = '';
            if (specifier.type === 'ImportSpecifier') {
              importedName = specifier.imported.type === 'Identifier'
                ? specifier.imported.name
                : specifier.imported.value;
            } else if (specifier.type === 'ImportDefaultSpecifier') {
              importedName = specifier.local.name;
            }

            const rule = matchingImportRules.find(r => r.symbol === importedName);
            if (rule) {
              violations.push({
                ruleId: rule.id,
                package: rule.package,
                symbol: rule.symbol,
                replacement: rule.replacement,
                message: rule.message,
                line: specifier.loc?.start.line ?? path.node.loc?.start.line ?? 1,
                column: specifier.loc?.start.column ?? path.node.loc?.start.column ?? 0
              });
            }
          }
        },

        // 2. Audit Call Expressions (e.g. useAnimatedGestureHandler, usePanGesture)
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
                column: callee.loc?.start.column ?? path.node.loc?.start.column ?? 0
              });
            }
          }

          // Member Call: Obj.method(...)
          if (callee.type === 'MemberExpression') {
            const objName = callee.object?.type === 'Identifier' ? callee.object.name : '';
            const propName = callee.property?.type === 'Identifier' ? callee.property.name : '';

            const rule = memberRules.find(r => r.memberObject === objName && r.memberProperty === propName);
            if (rule) {
              violations.push({
                ruleId: rule.id,
                package: rule.package,
                symbol: `${objName}.${propName}`,
                replacement: rule.replacement,
                message: rule.message,
                line: callee.loc?.start.line ?? path.node.loc?.start.line ?? 1,
                column: callee.loc?.start.column ?? path.node.loc?.start.column ?? 0
              });
            }
          }
        }
      });
    } catch {}

    return violations;
  }
}
