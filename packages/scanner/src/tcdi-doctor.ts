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

import fs from 'node:fs';
import path from 'node:path';
import { parse, Lang, type SgNode } from '@ast-grep/napi';
import { CANONICAL_SEVERED_RULES, type SeveredRule } from './rules/canonical-severed-rules.js';

export interface TargetStackConfig {
  reactNative?: string;          // e.g. '0.74.0', '^0.76.0', '>=0.88.0'
  architecture?: 'new-arch' | 'paper' | 'interop';
  reanimated?: string;           // e.g. '^3.16.0', '^4.0.0'
  gestureHandler?: string;       // e.g. '^2.18.0', '^3.3.0'
  nitroModules?: boolean;
  hermes?: boolean;
  compileSdkVersion?: number;
  isAndroid15EdgeToEdge?: boolean;
  navigationShell?: 'EXPO_ROUTER' | 'REACT_NAVIGATION' | 'CUSTOM_OR_NONE';
}

export interface TcdiDoctorConfig {
  targetStack: TargetStackConfig;
  severityOverrides?: Record<string, 'error' | 'warn' | 'off'>;
  ignorePatterns?: string[];
  includeCanonicalRules?: boolean;
  customRules?: SeveredRule[];
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
  package?: string;
  targetSymbol?: string;
  pattern?: string;
  matcher?: (root: SgNode) => SgNode[];
  triggerWords?: string[];
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
      includeCanonicalRules: config?.includeCanonicalRules ?? false,
      customRules: config?.customRules ?? [],
    };

    this.registerTemporalRules();

    if (this.config.includeCanonicalRules) {
      this.loadCanonicalSeveredRules();
    }

    if (this.config.customRules && this.config.customRules.length > 0) {
      this.loadSeveredRules(this.config.customRules);
    }
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
      package: 'react-native',
      targetSymbol: 'findNodeHandle',
      pattern: 'findNodeHandle($$$ARGS)',
      triggerWords: ['findNodeHandle'],
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
      package: 'react-native',
      targetSymbol: 'UIManager.measureInWindow',
      pattern: 'UIManager.measureInWindow($$$ARGS)',
      triggerWords: ['UIManager', 'measureInWindow'],
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
      package: 'react-native-reanimated',
      targetSymbol: 'useAnimatedGestureHandler',
      pattern: 'useAnimatedGestureHandler($$$ARGS)',
      triggerWords: ['useAnimatedGestureHandler'],
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
      package: 'react-native-gesture-handler',
      targetSymbol: 'usePanGesture',
      pattern: 'usePanGesture($$$ARGS)',
      triggerWords: ['usePanGesture'],
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
      package: 'react-native',
      targetSymbol: 'AsyncStorage',
      pattern: 'AsyncStorage.$$$METHOD',
      triggerWords: ['AsyncStorage'],
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
      package: 'react-native',
      targetSymbol: 'TouchableOpacity',
      pattern: '<TouchableOpacity $$$PROPS>$$$CHILDREN</TouchableOpacity>',
      triggerWords: ['TouchableOpacity'],
      title: 'Legacy TouchableOpacity blocks JS thread',
      message: 'TouchableOpacity executes hit testing on the single JavaScript thread, causing dropped frames during heavy work.',
      remediationAdvice: 'Adopt Pressable with ripple or RNGH NativeViewGestureHandler for UI-thread gestures.',
      resolveSeverity: () => 'warn',
      resolveTemporalNote: () => 'DEPRECATED for high-performance apps: Modern architecture favors Pressable or RNGH.',
    });

    // 7. Reanimated 4 Worklet Runtime Separation
    this.rules.push({
      id: 'rn/reanimated-v4-worklet-deprecations',
      category: 'WORKLET_THREAD_SAFETY',
      title: 'Reanimated 4 worklet runtime primitive imported from react-native-reanimated',
      triggerWords: ['react-native-reanimated'],
      message:
        "In Reanimated 4.x, worklet runtime primitives ('runOnJS', 'runOnUI', 'makeMutable') are migrated into 'react-native-worklets'. Importing them from 'react-native-reanimated' is deprecated and causes runtime crashes.",
      remediationAdvice:
        "Import worklet primitives from 'react-native-worklets' or remove the unused import.",
      resolveSeverity: (stack) => (this.isReanimatedV4(stack) ? 'warn' : 'off'),
      resolveTemporalNote: (stack) =>
        this.isReanimatedV4(stack)
          ? 'DEPRECATED/SPLIT in Reanimated v4: Worklet engine extracted into react-native-worklets.'
          : 'Valid in Reanimated v3.',
      matcher: (root) => {
        const importNodes = root.findAll({ rule: { kind: 'import_statement' } });
        const results: SgNode[] = [];
        for (const imp of importNodes) {
          const text = imp.text();
          if (text.includes('react-native-reanimated')) {
            if (/\b(runOnJS|runOnUI|makeMutable)\b/.test(text)) {
              results.push(imp);
            }
          }
        }
        return results;
      },
    });

    // 8. Modal Touch Context Disconnection (Contextualized to RNGH presence)
    this.rules.push({
      id: 'rn/modal-missing-gesture-root',
      category: 'GESTURE_PERF',
      title: 'Modal creates separate native window, severing RNGH touch dispatch',
      triggerWords: ['Modal'],
      message:
        'React Native <Modal> creates a separate native Window/DialogView hierarchy on Android, disconnecting RNGH touch dispatch. RNGH gestures (GestureDetector, PanGestureHandler, BottomSheet, RNGH ScrollView) inside this modal will suffer deadlocks or dropped touches.',
      remediationAdvice:
        'Wrap modal content inside <GestureHandlerRootView style={{ flex: 1 }}> to restore native gesture interception.',
      resolveSeverity: () => 'warn',
      resolveTemporalNote: () =>
        'ARCHITECTURAL SEAM: React Native Modal bypasses the root view touch responder chain on Android when RNGH components are present.',
      matcher: (root) => {
        const modals = root.findAll('<Modal $$$PROPS>$$$CHILDREN</Modal>');
        const flagged: SgNode[] = [];
        for (const m of modals) {
          const text = m.text();
          // Contextual guard: Only flag if Modal contains RNGH gestures or BottomSheet components that strictly require RNGH root
          const hasRnghComponents =
            /\b(GestureDetector|PanGestureHandler|TapGestureHandler|LongPressGestureHandler|BottomSheet|BottomSheetModal)\b/.test(text) ||
            (/\bScrollView\b/.test(text) && text.includes('react-native-gesture-handler'));

          if (hasRnghComponents && !text.includes('GestureHandlerRootView')) {
            flagged.push(m);
          }
        }
        return flagged;
      },
    });

    // 9. Expo Router Direct React Navigation Imports
    this.rules.push({
      id: 'rn/expo-router-direct-react-navigation',
      category: 'LEGACY_REMOVED',
      title: 'Direct @react-navigation/* import in Expo Router app',
      triggerWords: ['@react-navigation'],
      message:
        "Direct imports from '@react-navigation/native' or '@react-navigation/stack' bypass Expo Router route lifecycle and URL synchronization.",
      remediationAdvice:
        "Import navigation hooks ('useRouter', 'useNavigation', 'useLocalSearchParams') from 'expo-router'.",
      resolveSeverity: () => 'warn',
      resolveTemporalNote: () =>
        'Expo Router manages the navigation tree declaratively via filesystem routes.',
      matcher: (root) => {
        const importNodes = root.findAll({ rule: { kind: 'import_statement' } });
        const results: SgNode[] = [];
        for (const imp of importNodes) {
          const text = imp.text();
          if (/@react-navigation\/(native|stack|bottom-tabs)/.test(text)) {
            results.push(imp);
          }
        }
        return results;
      },
    });

    // 10. Android 15 Edge-to-Edge Core SafeAreaView Severed
    this.rules.push({
      id: 'rn/android15-edge-to-edge-safe-area',
      category: 'FABRIC_NEW_ARCH',
      title: 'Legacy core SafeAreaView broken under Android 15 Edge-to-Edge',
      triggerWords: ['SafeAreaView'],
      message:
        "React Native core '<SafeAreaView>' does not support Android 15 Edge-to-Edge WindowInsets (compileSdk >= 35) and will clip or render 0px padding behind system bars.",
      remediationAdvice:
        "Import 'SafeAreaView' or use 'useSafeAreaInsets()' from 'react-native-safe-area-context'.",
      resolveSeverity: (stack) => (stack.isAndroid15EdgeToEdge !== false ? 'warn' : 'off'),
      resolveTemporalNote: () =>
        'Android 15 (SDK 35+) enforces Edge-to-Edge layouts natively; core SafeAreaView is obsolete.',
      matcher: (root) => {
        const importNodes = root.findAll({ rule: { kind: 'import_statement' } });
        const results: SgNode[] = [];
        for (const imp of importNodes) {
          const text = imp.text();
          if (text.includes("'react-native'") || text.includes('"react-native"')) {
            if (/\bSafeAreaView\b/.test(text)) {
              results.push(imp);
            }
          }
        }
        return results;
      },
    });

    // 11. Expo Router Imperative NavigationContainer Collision
    this.rules.push({
      id: 'rn/expo-router-no-navigation-container',
      category: 'LEGACY_REMOVED',
      title: 'Imperative NavigationContainer declared inside Expo Router app',
      triggerWords: ['NavigationContainer'],
      message:
        "Expo Router wraps the app root in its own NavigationContainer. Declaring an imperative '<NavigationContainer>' creates nested router collisions and breaks deep linking.",
      remediationAdvice:
        "Remove '<NavigationContainer>' and manage routes declaratively via the 'app/' directory and Expo Router Stack/Tabs.",
      resolveSeverity: (stack) => (stack.navigationShell === 'EXPO_ROUTER' ? 'error' : 'warn'),
      resolveTemporalNote: () =>
        'Expo Router manages the root navigation hierarchy declaratively.',
      pattern: '<NavigationContainer $$$PROPS>$$$CHILDREN</NavigationContainer>',
    });
  }

  public diagnoseSnippet(sourceCode: string, filePath: string = 'snippet.tsx'): TcdiDoctorReport {
    const startTime = performance.now();
    const findings: TcdiDoctorFinding[] = [];

    // FAST KEYWORD FILTER: Screen active rules against source code before AST parsing
    const activeRules = this.rules.filter((rule) => {
      let severity = rule.resolveSeverity(this.config.targetStack);
      if (this.config.severityOverrides?.[rule.id]) {
        severity = this.config.severityOverrides[rule.id]!;
      }
      if (severity === 'off') return false;

      // Package scope guard: if rule is scoped to a specific 3rd party package,
      // the file must mention or import that package
      if (rule.package && rule.package !== 'react-native' && !sourceCode.includes(rule.package)) {
        return false;
      }

      if (rule.triggerWords && rule.triggerWords.length > 0) {
        return rule.triggerWords.some((w) => sourceCode.includes(w));
      }
      return true;
    });

    if (activeRules.length === 0) {
      return this.createReport([], Math.round(performance.now() - startTime));
    }

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

    // Build provenance map for imported symbols in this file
    const importedSymbols = new Map<string, string>(); // symbolName -> sourceModule
    const importedNamespaces = new Map<string, string>(); // namespaceName -> sourceModule
    const importedModules = new Set<string>();

    try {
      const importNodes = rootNode.findAll({ rule: { kind: 'import_statement' } });
      for (const imp of importNodes) {
        const text = imp.text();
        const fromMatch = text.match(/from\s+['"]([^'"]+)['"]/);
        if (!fromMatch || !fromMatch[1]) continue;
        const sourceModule = fromMatch[1];
        importedModules.add(sourceModule);

        // Namespace: import * as N from '...'
        const nsMatch = text.match(/import\s+\*\s+as\s+([A-Za-z0-9_$]+)\s+from/);
        if (nsMatch && nsMatch[1]) {
          importedNamespaces.set(nsMatch[1], sourceModule);
        }

        // Named imports: import { A, B as C } from '...'
        const namedMatch = text.match(/import\s*\{([^}]+)\}\s*from/);
        if (namedMatch && namedMatch[1]) {
          const specifiers = namedMatch[1].split(',');
          for (const spec of specifiers) {
            const parts = spec.trim().split(/\s+as\s+/);
            const importedName = parts.length > 1 ? parts[1]?.trim() : parts[0]?.trim();
            if (importedName) {
              importedSymbols.set(importedName, sourceModule);
            }
          }
        }

        // Default import: import D from '...'
        const defaultMatch = text.match(/import\s+([A-Za-z0-9_$]+)\s*(?:,\s*\{[^}]+\})?\s*from/);
        if (defaultMatch && defaultMatch[1]) {
          const defaultName = defaultMatch[1];
          if (defaultName !== 'type') {
            importedSymbols.set(defaultName, sourceModule);
          }
        }
      }
    } catch {}

    for (const rule of activeRules) {
      let severity = rule.resolveSeverity(this.config.targetStack);
      if (this.config.severityOverrides?.[rule.id]) {
        severity = this.config.severityOverrides[rule.id]!;
      }

      if (severity === 'off') continue;

      // PROVENANCE GUARD: For rules scoped to a package, verify symbol binding provenance
      if (rule.package && rule.targetSymbol) {
        const sym = rule.targetSymbol;
        const baseSym = (sym.includes('.') ? sym.split('.')[0] : sym) ?? sym;
        const importedFrom = importedSymbols.get(baseSym) || importedNamespaces.get(baseSym);

        if (rule.package !== 'react-native') {
          // 1. Third-party package: The module must be imported in the file
          const isModuleImported = Array.from(importedModules).some(
            (m) => m === rule.package || m.startsWith(rule.package + '/')
          );
          if (!isModuleImported) {
            continue;
          }

          // 2. If the symbol was explicitly imported from a DIFFERENT package, skip this rule
          if (importedFrom && importedFrom !== rule.package && !importedFrom.startsWith(rule.package + '/')) {
            continue;
          }

          // 3. If the symbol was NOT imported at all (and it's not a member of an imported namespace), skip
          if (!importedFrom) {
            continue;
          }
        } else {
          // React Native core package: If the symbol was explicitly imported from another package, skip
          if (importedFrom && importedFrom !== 'react-native' && !importedFrom.startsWith('react-native/')) {
            continue;
          }
        }
      }

      const matches: SgNode[] = [];
      if (rule.pattern) {
        try {
          matches.push(...rootNode.findAll(rule.pattern));
        } catch {}
      }
      if (rule.matcher) {
        try {
          matches.push(...rule.matcher(rootNode));
        } catch {}
      }

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

  public loadSeveredRules(rules: SeveredRule[]): void {
    const existingIds = new Set(this.rules.map((r) => r.id));
    for (const rule of rules) {
      if (existingIds.has(rule.id)) continue;
      existingIds.add(rule.id);

      let pattern: string | undefined = undefined;
      let matcher: ((root: SgNode) => SgNode[]) | undefined = undefined;

      if (rule.type === 'call') {
        pattern = `${rule.symbol}($$$ARGS)`;
      } else if (rule.type === 'member') {
        pattern = rule.symbol.includes('.') ? rule.symbol : `${rule.symbol}.$PROP`;
      } else if (/^[A-Z]/.test(rule.symbol) && !rule.symbol.endsWith('Props')) {
        pattern = `<${rule.symbol} $$$PROPS>$$$CHILDREN</${rule.symbol}>`;
      }

      // Exact word-boundary regex to prevent substring collisions (e.g. Value matching useSharedValue)
      const symbolRegex = new RegExp(`\\b${rule.symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);

      // Provide matcher to catch self-closing JSX and direct package imports
      matcher = (root: SgNode) => {
        const results: SgNode[] = [];
        // Self-closing JSX element for component symbols
        if (/^[A-Z]/.test(rule.symbol) && !rule.symbol.endsWith('Props')) {
          try {
            results.push(...root.findAll({ rule: { kind: 'jsx_self_closing_element', has: { pattern: rule.symbol } } }));
          } catch {}
        }
        // Named or default imports from the affected package
        try {
          const imports = root.findAll({ rule: { kind: 'import_statement' } });
          for (const imp of imports) {
            const text = imp.text();
            if (text.includes(rule.package) && symbolRegex.test(text)) {
              results.push(imp);
            }
          }
        } catch {}
        return results;
      };

      let category: TcdiDoctorFinding['category'] = 'LEGACY_REMOVED';
      if (rule.package === 'react-native-reanimated') category = 'WORKLET_THREAD_SAFETY';
      else if (rule.package === 'react-native-gesture-handler') category = 'GESTURE_PERF';
      else if (rule.package === 'react-native') category = 'LEGACY_REMOVED';

      const ruleDef: InternalRuleDefinition = {
        id: rule.id,
        category,
        package: rule.package,
        targetSymbol: rule.symbol,
        pattern,
        matcher,
        triggerWords: [rule.symbol, rule.package],
        title: `Severed API '${rule.symbol}' in ${rule.package}`,
        message: rule.message,
        remediationAdvice: rule.replacement,
        resolveSeverity: () => (rule.severity === 'soft' ? 'warn' : 'error'),
        resolveTemporalNote: () =>
          rule.minBreakingVersion
            ? `Permanently severed in ${rule.package}@${rule.minBreakingVersion}.`
            : `Severed symbol in ${rule.package}.`,
      };

      this.rules.push(ruleDef);
    }
  }

  public loadCanonicalSeveredRules(): void {
    this.loadSeveredRules(CANONICAL_SEVERED_RULES);
  }

  public loadProjectRules(projectRoot: string = process.cwd()): void {
    const candidatePaths = [
      path.join(projectRoot, '.agents', 'rules', 'severed-rules.json'),
      path.join(projectRoot, '.rn-terrain', 'rules', 'severed-rules.json'),
    ];

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        try {
          const rules: SeveredRule[] = JSON.parse(fs.readFileSync(p, 'utf8'));
          this.loadSeveredRules(rules);
        } catch {}
      }
    }
  }

  public getRulesCount(): number {
    return this.rules.length;
  }

  public getActiveRipgrepPattern(): string {
    const tokens = new Set<string>();
    const JS_STOPWORDS = new Set([
      'id', 'data', 'value', 'name', 'type', 'get', 'set', 'key', 'target',
      'default', 'props', 'children', 'style', 'options', 'config', 'state',
      'ref', 'text', 'view', 'item', 'index', 'node', 'size', 'color', 'count',
      'result', 'args', 'params', 'callback', 'handler', 'event', 'error',
      'action', 'update', 'create', 'render', 'status', 'context', 'element', 'container'
    ]);

    for (const r of this.rules) {
      // Scoped third-party package rules: index the package specifier
      if (r.package && r.package !== 'react-native') {
        tokens.add(r.package.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        continue;
      }

      // React Native core or universal rules: index specific trigger words
      if (r.triggerWords) {
        for (const w of r.triggerWords) {
          if (w && w.length >= 3 && !['react-native'].includes(w)) {
            const cleanToken = w.split('.')[0]?.split('(')[0]?.trim();
            if (cleanToken && cleanToken.length >= 3 && !JS_STOPWORDS.has(cleanToken.toLowerCase())) {
              tokens.add(cleanToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            }
          }
        }
      }
      if (r.targetSymbol) {
        const cleanSymbol = r.targetSymbol.split('.')[0]?.split('(')[0]?.trim();
        if (cleanSymbol && cleanSymbol.length >= 3 && !JS_STOPWORDS.has(cleanSymbol.toLowerCase())) {
          tokens.add(cleanSymbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        }
      }
    }
    tokens.add('Modal');
    tokens.add('NavigationContainer');
    tokens.add('SafeAreaView');
    tokens.add('@react-navigation');
    return Array.from(tokens).join('|');
  }

  public diagnoseProject(projectDir: string = process.cwd()): TcdiDoctorReport {
    const startTime = performance.now();
    const findings: TcdiDoctorFinding[] = [];
    const files = this.collectSourceFiles(projectDir);

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const report = this.diagnoseSnippet(content, file);
        findings.push(...report.findings);
      } catch {}
    }

    return this.createReport(findings, Math.round(performance.now() - startTime));
  }

  private collectSourceFiles(dir: string, depth = 0): string[] {
    if (depth > 8 || !fs.existsSync(dir)) return [];
    const results: string[] = [];
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (!['node_modules', '.git', 'dist', 'build', '.expo', 'ios/Pods', 'android/build'].includes(entry.name)) {
            results.push(...this.collectSourceFiles(full, depth + 1));
          }
        } else if (entry.isFile() && /\.(tsx|ts|jsx|js)$/i.test(entry.name) && !entry.name.endsWith('.d.ts')) {
          results.push(full);
        }
      }
    } catch {}
    return results;
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
