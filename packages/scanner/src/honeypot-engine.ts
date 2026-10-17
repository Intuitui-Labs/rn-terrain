/**
 * @file honeypot-engine.ts
 * Parametric Hallucination Honeypot Engine.
 *
 * Traps LLM confabulations and imaginary APIs before they reach disk.
 * Generates ambient shadow type definitions (`.terrain/honeypots.d.ts`)
 * with `@deprecated TRAPDOOR` and `never` types, and provides 100% confidence
 * AST detection for known hallucinated symbols across the React Native ecosystem.
 */

import { parse, type ParserPlugin } from '@babel/parser';
import _traverse from '@babel/traverse';
import * as fs from 'node:fs';
import * as path from 'node:path';

const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default;

export interface HoneypotTrapdoor {
  id: string;
  symbol: string;
  package: string;
  reason: string;
  canonicalRemediation: string;
  trainingEra: string;
}

export interface HoneypotViolation {
  ruleId: string;
  symbol: string;
  package: string;
  severity: 'TRAPDOOR_PARAMETRIC_HALLUCINATION';
  message: string;
  canonicalRemediation: string;
  confidenceScore: 1.0;
  line: number;
  column: number;
}

export interface HoneypotAuditReport {
  hasTrapdoorTriggered: boolean;
  violations: HoneypotViolation[];
  remediationPrompt?: string;
}

export const CANONICAL_HONEYPOT_TRAPDOORS: HoneypotTrapdoor[] = [
  {
    id: 'asyncstorage-multiget-batch',
    symbol: 'multiGetBatch',
    package: '@react-native-async-storage/async-storage',
    reason: 'Non-existent method hallucinated by LLMs confusing Redis/batch database drivers with AsyncStorage.',
    canonicalRemediation: "AsyncStorage.multiGet(['key1', 'key2'])",
    trainingEra: 'Training prior confabulation',
  },
  {
    id: 'asyncstorage-batch-get',
    symbol: 'batchGet',
    package: '@react-native-async-storage/async-storage',
    reason: 'Non-existent DynamoDB/Redis method confabulated into AsyncStorage.',
    canonicalRemediation: "AsyncStorage.multiGet(keys)",
    trainingEra: 'Training prior confabulation',
  },
  {
    id: 'reanimated-create-spring-config',
    symbol: 'createSpringConfig',
    package: 'react-native-reanimated',
    reason: "Non-existent helper function hallucinated from older physics or motion libraries.",
    canonicalRemediation: "withSpring(targetValue, { damping: 15, stiffness: 120, mass: 1 })",
    trainingEra: 'Pre-2021 training weights',
  },
  {
    id: 'reanimated-with-spring-config',
    symbol: 'withSpringConfig',
    package: 'react-native-reanimated',
    reason: "Imaginary wrapping function hallucinated from obsolete Reanimated v1 configurations.",
    canonicalRemediation: "withSpring(targetValue, config)",
    trainingEra: 'Reanimated v1 confabulation',
  },
  {
    id: 'reanimated-use-shared-value-effect',
    symbol: 'useSharedValueEffect',
    package: 'react-native-reanimated',
    reason: "Imaginary hook hallucinated by blending React useEffect with useSharedValue.",
    canonicalRemediation: "useAnimatedReaction(() => sharedValue.value, (current, previous) => { /* worklet logic */ })",
    trainingEra: 'Training prior confabulation',
  },
  {
    id: 'rngh-multitouch-pan',
    symbol: 'MultiTouchPan',
    package: 'react-native-gesture-handler',
    reason: "Non-existent Gesture namespace property. Pan gestures configure pointers via minPointers/maxPointers.",
    canonicalRemediation: "Gesture.Pan().minPointers(2)",
    trainingEra: 'Training prior confabulation',
  },
  {
    id: 'rngh-tap-handler',
    symbol: 'TapHandler',
    package: 'react-native-gesture-handler',
    reason: "Non-existent Gesture method; modern RNGH v2 uses Gesture.Tap().",
    canonicalRemediation: "Gesture.Tap().onEnd(() => {})",
    trainingEra: 'Pre-2022 training weights',
  },
  {
    id: 'safe-area-set-edge-insets',
    symbol: 'setEdgeInsets',
    package: 'react-native-safe-area-context',
    reason: "Imaginary imperative mutation method on safe area context.",
    canonicalRemediation: "useSafeAreaInsets() or pass explicit insets via SafeAreaProvider initialMetrics",
    trainingEra: 'Training prior confabulation',
  },
  {
    id: 'stylesheet-create-scaled',
    symbol: 'createScaled',
    package: 'react-native',
    reason: "Imaginary StyleSheet helper hallucinated from third-party responsive scaling libraries.",
    canonicalRemediation: "StyleSheet.create() combined with useWindowDimensions() math",
    trainingEra: 'Third-party library conflation',
  },
  {
    id: 'turbomodule-get-native-module',
    symbol: 'getNativeModule',
    package: 'react-native',
    reason: "Non-existent method on TurboModuleRegistry. Fabric/TurboModule APIs use get<Spec>() or getEnforcing<Spec>().",
    canonicalRemediation: "TurboModuleRegistry.get<Spec>('ModuleName') or TurboModuleRegistry.getEnforcing<Spec>('ModuleName')",
    trainingEra: 'Bridge/TurboModule conflation',
  },
  {
    id: 'animated-start-async',
    symbol: 'startAsync',
    package: 'react-native',
    reason: "Non-existent Promise method on React Native Animated.CompositeAnimation.",
    canonicalRemediation: "new Promise((resolve) => { Animated.timing(val, config).start(resolve); })",
    trainingEra: 'Async/await promise confabulation',
  },
];

function isLineIgnored(lines: string[], lineOneIndexed: number): boolean {
  const lineIdx = lineOneIndexed - 1;
  const currentLine = lines[lineIdx];
  if (currentLine && currentLine.includes('@rn-terrain-ignore')) return true;
  const prevLine = lineIdx > 0 ? lines[lineIdx - 1] : undefined;
  if (prevLine && prevLine.includes('@rn-terrain-ignore')) return true;
  return false;
}

export class HoneypotEngine {
  private trapdoors: HoneypotTrapdoor[];
  private symbolIndex: Map<string, HoneypotTrapdoor>;

  constructor(customTrapdoors?: HoneypotTrapdoor[]) {
    this.trapdoors = customTrapdoors || CANONICAL_HONEYPOT_TRAPDOORS;
    this.symbolIndex = new Map();
    for (const trapdoor of this.trapdoors) {
      this.symbolIndex.set(trapdoor.symbol, trapdoor);
    }
  }

  /**
   * Generates ambient shadow type definitions (`honeypots.d.ts`).
   * When imported or placed in tsconfig root, TypeScript will emit immediate
   * type errors if any of these hallucinated symbols are accessed.
   */
  public generateHoneypotDts(): string {
    return `/**
 * @file honeypots.d.ts
 * GENERATED BY RN-TERRAIN PARAMETRIC HONEYPOT ENGINE.
 * DO NOT EDIT DIRECTLY.
 *
 * Ambient trapdoor typings designed to catch LLM parametric hallucinations at compile time.
 */

declare module '@react-native-async-storage/async-storage' {
  export interface AsyncStorageStatic {
    /** @deprecated TRAPDOOR: 'multiGetBatch' does not exist in AsyncStorage. Ground your context with rn-terrain compass. */
    multiGetBatch: never;
    /** @deprecated TRAPDOOR: 'batchGet' does not exist in AsyncStorage. Ground your context with rn-terrain compass. */
    batchGet: never;
  }
}

declare module 'react-native-reanimated' {
  /** @deprecated TRAPDOOR: 'createSpringConfig' does not exist. Use withSpring(val, config). */
  export const createSpringConfig: never;
  /** @deprecated TRAPDOOR: 'withSpringConfig' does not exist. Use withSpring(val, config). */
  export const withSpringConfig: never;
  /** @deprecated TRAPDOOR: 'useSharedValueEffect' does not exist. Use useAnimatedReaction. */
  export const useSharedValueEffect: never;
}

declare module 'react-native-gesture-handler' {
  export namespace Gesture {
    /** @deprecated TRAPDOOR: 'MultiTouchPan' does not exist. Use Gesture.Pan().minPointers(...) */
    export const MultiTouchPan: never;
    /** @deprecated TRAPDOOR: 'TapHandler' does not exist. Use Gesture.Tap(). */
    export const TapHandler: never;
  }
}

declare module 'react-native-safe-area-context' {
  export interface SafeAreaViewProps {
    /** @deprecated TRAPDOOR: 'setEdgeInsets' does not exist. */
    setEdgeInsets: never;
  }
}
`;
  }

  /**
   * Writes the ambient honeypot definitions to the target directory.
   */
  public writeHoneypotDefinitions(outputDir: string): string {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const targetPath = path.join(outputDir, 'honeypots.d.ts');
    fs.writeFileSync(targetPath, this.generateHoneypotDts(), 'utf-8');
    return targetPath;
  }

  /**
   * Inspects code using Scoped AST traversal and token matching to detect
   * parametric hallucination trapdoors with 100% confidence.
   */
  public detectHoneypots(code: string, filePath: string = 'Component.tsx'): HoneypotAuditReport {
    // 1. Honor escape hatches
    if (code.includes('@rn-terrain-ignore-file')) {
      return { hasTrapdoorTriggered: false, violations: [] };
    }

    const lines = code.split('\n');
    const violations: HoneypotViolation[] = [];

    // Fast check: do any known honeypot symbols appear in code?
    const candidateTrapdoors = this.trapdoors.filter((td) => code.includes(td.symbol));
    if (candidateTrapdoors.length === 0) {
      return { hasTrapdoorTriggered: false, violations: [] };
    }

    // Attempt AST parsing with Babel
    let parsedSuccessfully = false;
    try {
      const isTypeScript = filePath.endsWith('.ts') || filePath.endsWith('.tsx');
      const plugins: ParserPlugin[] = [
        'jsx',
        isTypeScript ? 'typescript' : 'flow',
        'classProperties',
        'dynamicImport',
        'exportDefaultFrom',
      ];

      const ast = parse(code, {
        sourceType: 'module',
        plugins,
        errorRecovery: true,
      });

      parsedSuccessfully = true;

      traverse(ast, {
        // Detect MemberExpression: e.g. AsyncStorage.multiGetBatch or Gesture.MultiTouchPan
        MemberExpression: (nodePath: any) => {
          const propName = nodePath.node.property?.name;
          if (propName && this.symbolIndex.has(propName)) {
            const trapdoor = this.symbolIndex.get(propName)!;
            const line = nodePath.node.loc?.start.line ?? 1;
            const column = nodePath.node.loc?.start.column ?? 0;

            if (isLineIgnored(lines, line)) return;

            violations.push({
              ruleId: `honeypot/${trapdoor.id}`,
              symbol: trapdoor.symbol,
              package: trapdoor.package,
              severity: 'TRAPDOOR_PARAMETRIC_HALLUCINATION',
              message: `Symbol '${trapdoor.symbol}' in package '${trapdoor.package}' is an imaginary API hallucinated from LLM training weights. ${trapdoor.reason}`,
              canonicalRemediation: trapdoor.canonicalRemediation,
              confidenceScore: 1.0,
              line,
              column,
            });
          }
        },

        // Detect CallExpression direct function call: e.g. createSpringConfig(...)
        CallExpression: (nodePath: any) => {
          const callee = nodePath.node.callee;
          if (callee.type === 'Identifier' && this.symbolIndex.has(callee.name)) {
            const trapdoor = this.symbolIndex.get(callee.name)!;
            const line = nodePath.node.loc?.start.line ?? 1;
            const column = nodePath.node.loc?.start.column ?? 0;

            if (isLineIgnored(lines, line)) return;

            // Avoid duplicate if member expression already flagged
            if (!violations.some((v) => v.symbol === trapdoor.symbol && v.line === line)) {
              violations.push({
                ruleId: `honeypot/${trapdoor.id}`,
                symbol: trapdoor.symbol,
                package: trapdoor.package,
                severity: 'TRAPDOOR_PARAMETRIC_HALLUCINATION',
                message: `Symbol '${trapdoor.symbol}' in package '${trapdoor.package}' is an imaginary API hallucinated from LLM training weights. ${trapdoor.reason}`,
                canonicalRemediation: trapdoor.canonicalRemediation,
                confidenceScore: 1.0,
                line,
                column,
              });
            }
          }
        },

        // Detect ImportSpecifier: import { createSpringConfig } from 'react-native-reanimated'
        ImportSpecifier: (nodePath: any) => {
          const importedName = nodePath.node.imported?.name;
          if (importedName && this.symbolIndex.has(importedName)) {
            const trapdoor = this.symbolIndex.get(importedName)!;
            const line = nodePath.node.loc?.start.line ?? 1;
            const column = nodePath.node.loc?.start.column ?? 0;

            if (isLineIgnored(lines, line)) return;

            violations.push({
              ruleId: `honeypot/${trapdoor.id}`,
              symbol: trapdoor.symbol,
              package: trapdoor.package,
              severity: 'TRAPDOOR_PARAMETRIC_HALLUCINATION',
              message: `Symbol '${trapdoor.symbol}' in package '${trapdoor.package}' is an imaginary API hallucinated from LLM training weights. ${trapdoor.reason}`,
              canonicalRemediation: trapdoor.canonicalRemediation,
              confidenceScore: 1.0,
              line,
              column,
            });
          }
        },
      });
    } catch {
      // In case of syntax crash during AST parsing, fallback to token scan
      parsedSuccessfully = false;
    }

    if (!parsedSuccessfully) {
      for (const trapdoor of candidateTrapdoors) {
        for (let i = 0; i < lines.length; i++) {
          const lineText = lines[i];
          if (!lineText) continue;
          if (lineText.includes(trapdoor.symbol)) {
            if (lineText.includes('@rn-terrain-ignore')) continue;
            // Ensure it's not in a comment or string if possible
            if (lineText.trim().startsWith('//') || lineText.trim().startsWith('*')) continue;

            violations.push({
              ruleId: `honeypot/${trapdoor.id}`,
              symbol: trapdoor.symbol,
              package: trapdoor.package,
              severity: 'TRAPDOOR_PARAMETRIC_HALLUCINATION',
              message: `Symbol '${trapdoor.symbol}' in package '${trapdoor.package}' is an imaginary API hallucinated from LLM training weights. ${trapdoor.reason}`,
              canonicalRemediation: trapdoor.canonicalRemediation,
              confidenceScore: 1.0,
              line: i + 1,
              column: lineText.indexOf(trapdoor.symbol),
            });
          }
        }
      }
    }

    const hasTrapdoorTriggered = violations.length > 0;
    let remediationPrompt: string | undefined;

    if (hasTrapdoorTriggered) {
      const details = violations
        .map(
          (v) =>
            `- 🚨 TRAPDOOR: '${v.symbol}' (${v.package})\n  Reason: ${v.message}\n  Modern Canonical Replacement: ${v.canonicalRemediation}`
        )
        .join('\n\n');

      remediationPrompt = `[RN-TERRAIN PARAMETRIC HALLUCINATION TRAPDOOR TRIGGERED]\nYour proposed code contains imaginary/confabulated APIs generated by LLM training weights:\n\n${details}\n\nGround your context immediately with 'rn-terrain compass <package>' to inspect actual physical symbols.`;
    }

    return {
      hasTrapdoorTriggered,
      violations,
      remediationPrompt,
    };
  }
}
