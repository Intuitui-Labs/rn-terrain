/**
 * @file tree-sitter-matcher.ts
 * Tree-sitter and ast-grep Structural Pattern Matching Engine for RN-Terrain.
 *
 * Provides high-speed incremental parsing and error-tolerant AST pattern matching
 * to detect severed, deprecated, or modern API usages.
 */

import { parse, Lang, type SgNode } from '@ast-grep/napi';

export interface CodePatternRule {
  id: string;
  package: string;
  severity: 'UNSUPPORTED_REMOVED' | 'DEPRECATED' | 'BROKEN_DEFECTIVE' | 'NEW_CAPABILITY';
  pattern: string;
  replacement?: string;
  message: string;
}

export interface PatternFinding {
  ruleId: string;
  package: string;
  severity: string;
  filePath: string;
  line: number;
  column: number;
  matchedText: string;
  symbol?: string;
  replacement?: string;
  message: string;
}

export class TreeSitterCodeMatcher {
  private rules: CodePatternRule[] = [];

  constructor() {
    this.registerDefaultRules();
  }

  public registerRule(rule: CodePatternRule): void {
    this.rules.push(rule);
  }

  private registerDefaultRules(): void {
    // 1. RNGH v1 legacy hook: usePanGesture
    this.registerRule({
      id: 'rngh-v1-use-pan-gesture',
      package: 'react-native-gesture-handler',
      severity: 'UNSUPPORTED_REMOVED',
      pattern: 'usePanGesture($$$ARGS)',
      replacement: 'Gesture.Pan()',
      message: "'usePanGesture' was removed in RNGH 2.0. Use 'Gesture.Pan()' with GestureDetector."
    });

    // 2. Reanimated v2 legacy hook: useAnimatedGestureHandler
    this.registerRule({
      id: 'reanimated-v2-gesture-handler',
      package: 'react-native-reanimated',
      severity: 'UNSUPPORTED_REMOVED',
      pattern: 'useAnimatedGestureHandler($$$ARGS)',
      replacement: 'Gesture.Pan().onUpdate(...)',
      message: "'useAnimatedGestureHandler' is legacy and incompatible with Reanimated v3 worklets. Migrate to Gesture.Pan()."
    });

    // 3. React Native legacy AsyncStorage from core
    this.registerRule({
      id: 'rn-core-async-storage-removed',
      package: 'react-native',
      severity: 'UNSUPPORTED_REMOVED',
      pattern: 'AsyncStorage.$$$METHOD',
      replacement: "@react-native-async-storage/async-storage",
      message: "AsyncStorage was removed from 'react-native' core in RN 0.60+. Import from '@react-native-async-storage/async-storage'."
    });

    // 4. Reanimated v1 legacy operator: interpolateNode
    this.registerRule({
      id: 'reanimated-interpolate-node-removed',
      package: 'react-native-reanimated',
      severity: 'UNSUPPORTED_REMOVED',
      pattern: 'interpolateNode($$$ARGS)',
      replacement: 'interpolate',
      message: "'interpolateNode' was removed in Reanimated modern runtimes. Use 'interpolate'."
    });

    // 5. RNGH v1 legacy component: PanGestureHandler
    this.registerRule({
      id: 'rngh-pan-gesture-handler-component',
      package: 'react-native-gesture-handler',
      severity: 'UNSUPPORTED_REMOVED',
      pattern: '<PanGestureHandler $$$PROPS>$$$CHILDREN</PanGestureHandler>',
      replacement: 'GestureDetector',
      message: "'PanGestureHandler' wrapper component is deprecated in RNGH v2+. Use '<GestureDetector gesture={Gesture.Pan()}>'."
    });

    // 6. React Native legacy node handle
    this.registerRule({
      id: 'rn-find-node-handle-removed',
      package: 'react-native',
      severity: 'UNSUPPORTED_REMOVED',
      pattern: 'findNodeHandle($$$ARGS)',
      replacement: 'ref',
      message: "'findNodeHandle' is severed in React Native New Architecture Fabric."
    });

    // 7. RNGH v2 Modern Capability: Gesture.Pan()
    this.registerRule({
      id: 'rngh-v2-modern-gesture-pan',
      package: 'react-native-gesture-handler',
      severity: 'NEW_CAPABILITY',
      pattern: 'Gesture.Pan()',
      message: "Modern Gesture API (Gesture.Pan()) detected."
    });
  }

  /**
   * Dynamically loads severed/deprecated symbols from a Terrain catalog.
   */
  public loadRulesFromCatalog(catalog: { getSymbols?(pkg: string): any[]; getAllSymbols?(): any[] }): void {
    const symbols = catalog.getAllSymbols ? catalog.getAllSymbols() : [];
    for (const sym of symbols) {
      if (sym.status === 'UNSUPPORTED_REMOVED' || sym.status === 'BROKEN_DEFECTIVE') {
        const id = `${sym.package_id}-${sym.symbol_identifier}-severed`;
        if (this.rules.some((r) => r.id === id)) continue;
        const pattern = sym.symbol_identifier.includes('.')
          ? `${sym.symbol_identifier}($$$ARGS)`
          : sym.symbol_identifier.startsWith('<')
            ? sym.symbol_identifier
            : `${sym.symbol_identifier}($$$ARGS)`;
        this.registerRule({
          id,
          package: sym.package_id,
          severity: sym.status,
          pattern,
          replacement: sym.replacement_symbol ?? 'modern equivalent',
          message: `'${sym.symbol_identifier}' is severed in ${sym.package_id}. Replace with '${sym.replacement_symbol ?? 'modern equivalent'}'.`
        });
      }
    }
  }

  public scanSource(filePath: string, sourceCode: string): PatternFinding[] {
    const findings: PatternFinding[] = [];
    const lang = filePath.endsWith('.tsx') || filePath.endsWith('.jsx') ? Lang.Tsx : Lang.TypeScript;

    let rootNode: SgNode;
    try {
      rootNode = parse(lang, sourceCode).root();
    } catch {
      // Fallback to JS if TypeScript parsing fails
      try {
        rootNode = parse(Lang.JavaScript, sourceCode).root();
      } catch {
        return findings;
      }
    }

    for (const rule of this.rules) {
      try {
        const matches = rootNode.findAll(rule.pattern);
        for (const match of matches) {
          const range = match.range();
          findings.push({
            ruleId: rule.id,
            package: rule.package,
            severity: rule.severity,
            filePath,
            line: range.start.line + 1,
            column: range.start.column,
            matchedText: match.text(),
            replacement: rule.replacement,
            message: rule.message
          });
        }
      } catch {
        // Skip malformed pattern
      }
    }

    return findings;
  }
}
