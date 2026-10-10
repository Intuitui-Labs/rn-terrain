/**
 * @file tcdi-doctor.ts
 * TCDI Stack Doctor & Temporal Pattern Diagnostic Engine for React Native.
 *
 * Evaluates React Native codebases against temporal New Architecture (Fabric/TurboModules),
 * thread-safety, gesture, and storage patterns.
 *
 * Rules are dynamically parameterized by the project's configured Target Stack Range:
 *   - Legacy Paper (RN < 0.76): Legacy bridge APIs permitted with deprecation notices.
 *   - New Architecture (RN >= 0.76): Synchronous bridge measurements & string refs flagged as errors.
 *   - Modern Sacred Stack (RN >= 0.88, Reanimated 4, Nitro): Hard fatal rejections on severed APIs.
 */

import { parse, Lang, type SgNode } from '@ast-grep/napi';

export interface TargetStackConfig {
  reactNative?: string;          // e.g. '0.74.0', '^0.76.0', '>=0.88.0'
  architecture?: 'new-arch' | 'paper' | 'interop';
  reanimated?: string;           // e.g. '^3.16.0', '^4.0.0'
  gestureHandler?: string;       // e.g. '^2.18.0', '^3.3.0'
  nitroModules?: boolean;
  hermes?: boolean;
}

export interface TcdiDoctorConfig {
  targetStack: TargetStackConfig;
  severityOverrides?: Record<string, 'error' | 'warn' | 'off'>;
  ignorePatterns?: string[];
}

export interface TcdiDoctorFinding {
  ruleId: string;
  category: 'FABRIC_NEW_ARCH' | 'WORKLET_THREAD_SAFETY' | 'NATIVE_MODULE_JSI' | 'GESTURE_PERF' | 'LEGACY_REMOVED';
  severity: 'error' | 'warn' | 'info';
  title: string;
  message: string;
  filePath: string;
  line: number;
  column: number;
  matchedText: string;
  remediationAdvice: string;
  temporalNote: string;
}

export interface TcdiDoctorReport {
  healthScore: number; // 0 - 100
  status: 'SOLID' | 'HEALTHY' | 'DEGRADED' | 'LETHAL_DRIFT';
  targetStack: TargetStackConfig;
  totalFindings: number;
  errorsCount: number;
  warningsCount: number;
  findings: TcdiDoctorFinding[];
  durationMs: number;
}

interface InternalRuleDefinition {
  id: string;
  category: TcdiDoctorFinding['category'];
  pattern: string;
  title: string;
  message: string;
  remediationAdvice: string;
  resolveSeverity: (stack: TargetStackConfig) => 'error' | 'warn' | 'off';
  resolveTemporalNote: (stack: TargetStackConfig) => string;
}

export class TcdiStackDoctor {
  private config: TcdiDoctorConfig;
  private rules: InternalRuleDefinition[] = [];

  constructor(config?: Partial<TcdiDoctorConfig>) {
    this.config = {
      targetStack: {
        reactNative: '^0.88.0',
        architecture: 'new-arch',
        reanimated: '^4.7.1',
        gestureHandler: '^3.3.0',
        nitroModules: true,
        hermes: true,
        ...config?.targetStack,
      },
      severityOverrides: config?.severityOverrides ?? {},
      ignorePatterns: config?.ignorePatterns ?? ['**/node_modules/**', '**/dist/**'],
    };

    this.registerTemporalRules();
  }

  private isNewArch(stack: TargetStackConfig): boolean {
    if (stack.architecture === 'new-arch') return true;
    if (stack.architecture === 'paper') return false;
    // Semver heuristic: RN >= 0.76 defaults to New Arch
    const rn = stack.reactNative ?? '';
    const match = rn.match(/(\d+)\.(\d+)/);
    if (match && match[1] && match[2]) {
      const major = parseInt(match[1], 10);
      const minor = parseInt(match[2], 10);
      if (major > 0 || minor >= 76) return true;
    }
    return false;
  }

  private isReanimatedV4(stack: TargetStackConfig): boolean {
    const rean = stack.reanimated ?? '';
    return rean.includes('4.') || rean.startsWith('^4') || rean.startsWith('~4');
  }

  private registerTemporalRules(): void {
    // 1. Fabric Synchronous findNodeHandle
    this.rules.push({
      id: 'rn/fabric-no-find-node-handle',
      category: 'FABRIC_NEW_ARCH',
      pattern: 'findNodeHandle($$$ARGS)',
      title: 'Legacy findNodeHandle called on New Architecture',
      message: 'findNodeHandle relies on synchronous paper bridge tags, which triggers runtime C++ fatal exceptions in Fabric.',
      remediationAdvice: 'Use React host ref (useAnimatedRef / useRef) with native measurement hooks.',
      resolveSeverity: (stack) => (this.isNewArch(stack) ? 'error' : 'warn'),
      resolveTemporalNote: (stack) =>
        this.isNewArch(stack)
          ? 'FATAL on Fabric (RN 0.76+): Paper synchronous tag resolver is permanently deleted.'
          : 'DEPRECATED on Paper: Will fail when migrating to New Architecture (RN 0.76+).',
    });

    // 2. Fabric UIManager.measureInWindow
    this.rules.push({
      id: 'rn/fabric-no-uimanager-measure',
      category: 'FABRIC_NEW_ARCH',
      pattern: 'UIManager.measureInWindow($$$ARGS)',
      title: 'Synchronous UIManager.measureInWindow called on Fabric',
      message: 'UIManager synchronous measurement APIs are severed in the Fabric shadow tree.',
      remediationAdvice: 'Use hostRef.current?.measureInWindow or Reanimated measure() inside a worklet.',
      resolveSeverity: (stack) => (this.isNewArch(stack) ? 'error' : 'warn'),
      resolveTemporalNote: (stack) =>
        this.isNewArch(stack)
          ? 'SEVERED in Fabric: Shadow tree requires asynchronous or worklet measurements.'
          : 'DEPRECATED in Paper: Scheduled for removal on New Architecture.',
    });

    // 3. Reanimated v2 useAnimatedGestureHandler
    this.rules.push({
      id: 'rn/reanimated-v2-gesture-handler',
      category: 'WORKLET_THREAD_SAFETY',
      pattern: 'useAnimatedGestureHandler($$$ARGS)',
      title: 'Legacy useAnimatedGestureHandler used with modern Reanimated',
      message: 'useAnimatedGestureHandler is deprecated in v3 and completely severed in Reanimated v4.',
      remediationAdvice: 'Migrate to RNGH Gesture.Pan().onUpdate(...) with GestureDetector.',
      resolveSeverity: (stack) => (this.isReanimatedV4(stack) ? 'error' : 'warn'),
      resolveTemporalNote: (stack) =>
        this.isReanimatedV4(stack)
          ? 'SEVERED in Reanimated v4: Throws Unhandled Worklet Exception on invocation.'
          : 'DEPRECATED in Reanimated v3: Migrate to RNGH Gesture API.',
    });

    // 4. RNGH v1 legacy usePanGesture hook
    this.rules.push({
      id: 'rn/rngh-v1-legacy-pan',
      category: 'GESTURE_PERF',
      pattern: 'usePanGesture($$$ARGS)',
      title: 'Legacy usePanGesture hook',
      message: 'usePanGesture was an experimental RNGH 1.x hook removed in RNGH 2.0+.',
      remediationAdvice: 'Use Gesture.Pan() and wrap your component in <GestureDetector gesture={pan}>.',
      resolveSeverity: () => 'error',
      resolveTemporalNote: () => 'REMOVED since RNGH 2.0 (2021).',
    });

    // 5. AsyncStorage from react-native core
    this.rules.push({
      id: 'rn/core-async-storage-removed',
      category: 'LEGACY_REMOVED',
      pattern: 'AsyncStorage.$$$METHOD',
      title: 'AsyncStorage imported from react-native core',
      message: "AsyncStorage was extracted from 'react-native' core into separate community module.",
      remediationAdvice: "Import from '@react-native-async-storage/async-storage' or adopt synchronous Nitro MMKV (react-native-mmkv).",
      resolveSeverity: () => 'error',
      resolveTemporalNote: () => "PERMANENTLY SEVERED since React Native 0.60.0 (2019).",
    });

    // 6. TouchableOpacity JS Thread Bottleneck
    this.rules.push({
      id: 'rn/touchable-js-thread-lag',
      category: 'GESTURE_PERF',
      pattern: '<TouchableOpacity $$$PROPS>$$$CHILDREN</TouchableOpacity>',
      title: 'Legacy TouchableOpacity blocks JS thread',
      message: 'TouchableOpacity executes hit testing on the single JavaScript thread, causing dropped frames during heavy work.',
      remediationAdvice: 'Adopt Pressable with ripple or RNGH NativeViewGestureHandler for UI-thread gestures.',
      resolveSeverity: () => 'warn',
      resolveTemporalNote: () => 'DEPRECATED for high-performance apps: Modern architecture favors Pressable or RNGH.',
    });
  }

  public diagnoseSnippet(sourceCode: string, filePath: string = 'snippet.tsx'): TcdiDoctorReport {
    const startTime = performance.now();
    const findings: TcdiDoctorFinding[] = [];
    const lang = filePath.endsWith('.tsx') || filePath.endsWith('.jsx') ? Lang.Tsx : Lang.TypeScript;

    let rootNode: SgNode;
    try {
      rootNode = parse(lang, sourceCode).root();
    } catch {
      try {
        rootNode = parse(Lang.JavaScript, sourceCode).root();
      } catch {
        return this.createReport([], Math.round(performance.now() - startTime));
      }
    }

    for (const rule of this.rules) {
      let severity = rule.resolveSeverity(this.config.targetStack);
      if (this.config.severityOverrides?.[rule.id]) {
        severity = this.config.severityOverrides[rule.id]!;
      }

      if (severity === 'off') continue;

      const matches = rootNode.findAll(rule.pattern);
      for (const match of matches) {
        const range = match.range();
        findings.push({
          ruleId: rule.id,
          category: rule.category,
          severity,
          title: rule.title,
          message: rule.message,
          filePath,
          line: range.start.line + 1,
          column: range.start.column + 1,
          matchedText: match.text(),
          remediationAdvice: rule.remediationAdvice,
          temporalNote: rule.resolveTemporalNote(this.config.targetStack),
        });
      }
    }

    return this.createReport(findings, Math.round(performance.now() - startTime));
  }

  private createReport(findings: TcdiDoctorFinding[], durationMs: number): TcdiDoctorReport {
    const errorsCount = findings.filter((f) => f.severity === 'error').length;
    const warningsCount = findings.filter((f) => f.severity === 'warn').length;

    // Health Score calculation (0 - 100)
    let healthScore = 100 - (errorsCount * 15) - (warningsCount * 4);
    if (healthScore < 0) healthScore = 0;

    let status: TcdiDoctorReport['status'] = 'SOLID';
    if (errorsCount > 0 && healthScore < 50) {
      status = 'LETHAL_DRIFT';
    } else if (errorsCount > 0) {
      status = 'DEGRADED';
    } else if (warningsCount > 0) {
      status = 'HEALTHY';
    }

    return {
      healthScore,
      status,
      targetStack: this.config.targetStack,
      totalFindings: findings.length,
      errorsCount,
      warningsCount,
      findings,
      durationMs,
    };
  }
}
