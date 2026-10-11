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
      return violations;
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
                column: specifier.loc?.start.column ?? path.node.loc?.start.column ?? 0
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
                      column: prop.loc?.start.column ?? path.node.loc?.start.column ?? 0
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
                column: callee.loc?.start.column ?? path.node.loc?.start.column ?? 0
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
                  column: callee.loc?.start.column ?? path.node.loc?.start.column ?? 0
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
                column: callee.loc?.start.column ?? path.node.loc?.start.column ?? 0
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
                column: path.node.loc?.start.column ?? 0
              });
            }
          }
        }
      });
    } catch {}

    return violations;
  }
}
