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

    // 4. RNGH v2 Modern Capability: Gesture.Pan()
    this.registerRule({
      id: 'rngh-v2-modern-gesture-pan',
      package: 'react-native-gesture-handler',
      severity: 'NEW_CAPABILITY',
      pattern: 'Gesture.Pan()',
      message: "Modern Gesture API (Gesture.Pan()) detected."
    });
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
