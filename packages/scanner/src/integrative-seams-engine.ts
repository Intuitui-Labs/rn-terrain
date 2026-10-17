/**
 * @file integrative-seams-engine.ts
 * Cross-Package Integrative Seams Guardrail Engine.
 *
 * Evaluates source code for lethal cross-package interaction traps:
 * 1. Worklet <-> JS Thread State Leakage (setState/dispatch without runOnJS)
 * 2. Navigation Deallocation <-> Exiting Animation Races (SIGSEGV / Null InstanceHandle)
 * 3. Native Gesture <-> ScrollView Touch Deadlocks (missing activeOffset/simultaneous)
 * 4. TurboModule / Nitro Synchronous JSI in React Render Loop
 */

import { parse, Lang, type SgNode } from '@ast-grep/napi';

export interface IntegrativeSeamFinding {
  ruleId: string;
  seamType:
    | 'THREAD_HANDSHAKE'
    | 'LIFECYCLE_DECONSTRUCTION'
    | 'GESTURE_TOUCH_DEADLOCK'
    | 'RENDER_BLOCKING_JSI'
    | 'WINDOW_INSET_COLLISION';
  severity: 'error' | 'warning';
  title: string;
  message: string;
  filePath: string;
  line: number;
  column: number;
  matchedText: string;
  remediationAdvice: string;
  autoFixSnippet?: string;
}

export interface IntegrativeSeamReport {
  filePath: string;
  hasViolations: boolean;
  totalFindings: number;
  errorsCount: number;
  warningsCount: number;
  findings: IntegrativeSeamFinding[];
  durationMs: number;
}

export class IntegrativeSeamsEngine {
  /**
   * Diagnoses a source file against the 4 core integrative seams.
   */
  public diagnoseSource(sourceCode: string, filePath: string = 'Component.tsx'): IntegrativeSeamReport {
    const startTime = performance.now();
    const findings: IntegrativeSeamFinding[] = [];

    // FAST PRE-FILTER: Screen source code against seam trigger keywords before AST parsing
    const hasWorklet =
      sourceCode.includes("'worklet'") ||
      sourceCode.includes('"worklet"') ||
      sourceCode.includes('.onUpdate(') ||
      sourceCode.includes('.onStart(') ||
      sourceCode.includes('.onEnd(') ||
      sourceCode.includes('useAnimatedStyle(') ||
      sourceCode.includes('useDerivedValue(') ||
      sourceCode.includes('useAnimatedReaction(') ||
      sourceCode.includes('useFrameCallback(');
    const hasExiting = sourceCode.includes('exiting=') || sourceCode.includes('entering=');
    const hasGesture =
      sourceCode.includes('Gesture.Pan') ||
      sourceCode.includes('Gesture.Tap') ||
      sourceCode.includes('Gesture.LongPress') ||
      sourceCode.includes('Gesture.Fling') ||
      sourceCode.includes('GestureDetector');
    const hasSyncJsi =
      sourceCode.includes('.getString(') ||
      sourceCode.includes('.getNumber(') ||
      sourceCode.includes('.getBoolean(') ||
      sourceCode.includes('.executeSync(') ||
      sourceCode.includes('NitroModules.createHybridObject');

    if (!hasWorklet && !hasExiting && !hasGesture && !hasSyncJsi) {
      return {
        filePath,
        hasViolations: false,
        totalFindings: 0,
        errorsCount: 0,
        warningsCount: 0,
        findings: [],
        durationMs: Math.round(performance.now() - startTime),
      };
    }

    const isTsx = filePath.endsWith('.tsx') || filePath.endsWith('.jsx');
    const lang = isTsx ? Lang.Tsx : Lang.TypeScript;

    let rootNode: SgNode;
    try {
      rootNode = parse(lang, sourceCode).root();
    } catch {
      try {
        rootNode = parse(Lang.JavaScript, sourceCode).root();
      } catch {
        return {
          filePath,
          hasViolations: false,
          totalFindings: 0,
          errorsCount: 0,
          warningsCount: 0,
          findings: [],
          durationMs: Math.round(performance.now() - startTime),
        };
      }
    }

    // ─── Seam 1: Worklet <-> JS Thread State Leakage ─────────────────────────
    this.checkWorkletStateLeakage(rootNode, sourceCode, filePath, findings);

    // ─── Seam 2: Navigation Screen <-> Exiting Animation Race ─────────────────
    this.checkExitingAnimationUnmountRaces(rootNode, filePath, findings);

    // ─── Seam 3: Native Gesture <-> ScrollView Touch Deadlock ─────────────────
    this.checkGestureScrollDeadlocks(rootNode, sourceCode, filePath, findings);

    // ─── Seam 4: TurboModule / Nitro Sync JSI in Render Loop ──────────────────
    this.checkRenderBlockingJsi(rootNode, filePath, findings);

    // ─── Seam 5: Window Insets / SafeAreaView Nesting Collision ──────────────
    this.checkWindowInsetsSeam(rootNode, sourceCode, filePath, findings);

    const errorsCount = findings.filter((f) => f.severity === 'error').length;
    const warningsCount = findings.filter((f) => f.severity === 'warning').length;

    return {
      filePath,
      hasViolations: findings.length > 0,
      totalFindings: findings.length,
      errorsCount,
      warningsCount,
      findings,
      durationMs: Math.round(performance.now() - startTime),
    };
  }

  /**
   * Seam 1: Detects JS state setters (set*, dispatch, router.push) called inside
   * worklets without runOnJS.
   */
  private checkWorkletStateLeakage(
    rootNode: SgNode,
    sourceCode: string,
    filePath: string,
    findings: IntegrativeSeamFinding[]
  ): void {
    // Locate all call expressions
    // Setter pattern: set[A-Z]\w*(...) or dispatch(...) or router.push(...)
    const setterCalls = rootNode.findAll('$FN($$$ARGS)');

    for (const callNode of setterCalls) {
      const fnNode = callNode.field('function');
      if (!fnNode) continue;
      const fnName = fnNode.text();

      const isStateSetter =
        /^set[A-Z]/.test(fnName) ||
        fnName === 'dispatch' ||
        fnName === 'router.push' ||
        fnName === 'router.replace' ||
        fnName === 'navigation.navigate';

      if (!isStateSetter) continue;

      // Check if call is already enclosed in runOnJS(...)
      let parent = callNode.parent();
      let isBridged = false;

      while (parent) {
        const text = parent.text();
        if (text.startsWith('runOnJS(')) {
          isBridged = true;
          break;
        }
        parent = parent.parent();
      }

      if (isBridged) continue;

      // Check if this call is inside a worklet function
      let isInsideWorklet = false;
      let ancestor = callNode.parent();

      while (ancestor) {
        const kind = ancestor.kind();
        if (
          kind === 'function_declaration' ||
          kind === 'arrow_function' ||
          kind === 'function_expression' ||
          kind === 'method_definition'
        ) {
          const bodyText = ancestor.text();
          // Check for 'worklet' directive
          if (
            bodyText.includes("'worklet'") ||
            bodyText.includes('"worklet"') ||
            bodyText.includes('.onUpdate(') ||
            bodyText.includes('.onStart(') ||
            bodyText.includes('.onEnd(')
          ) {
            isInsideWorklet = true;
            break;
          }

          // Check if parent call expression is an auto-workletized hook
          const parentCall = ancestor.parent();
          if (parentCall) {
            const parentText = parentCall.text();
            if (
              parentText.startsWith('useAnimatedStyle(') ||
              parentText.startsWith('useDerivedValue(') ||
              parentText.startsWith('useAnimatedReaction(') ||
              parentText.startsWith('useFrameCallback(')
            ) {
              isInsideWorklet = true;
              break;
            }
          }
        }
        ancestor = ancestor.parent();
      }

      if (isInsideWorklet) {
        const range = callNode.range();
        const callText = callNode.text();
        const argsNode = callNode.field('arguments');
        const argsText = argsNode ? argsNode.text().replace(/^\(|\)$/g, '') : '';

        findings.push({
          ruleId: 'seam/worklet-unbridged-js-mutation',
          seamType: 'THREAD_HANDSHAKE',
          severity: 'error',
          title: 'Unbridged JS State Mutation in Worklet Thread',
          message: `Calling '${fnName}' directly inside a worklet thread without 'runOnJS' will throw an unhandled Worklet Thread Exception.`,
          filePath,
          line: range.start.line + 1,
          column: range.start.column + 1,
          matchedText: callText,
          remediationAdvice: `Wrap invocation in 'runOnJS(${fnName})(${argsText})' to bridge across UI worklet thread and JavaScript thread.`,
          autoFixSnippet: `runOnJS(${fnName})(${argsText})`,
        });
      }
    }
  }

  /**
   * Seam 2: Detects exiting layout animations without unmount stabilization in Screen roots.
   */
  private checkExitingAnimationUnmountRaces(
    rootNode: SgNode,
    filePath: string,
    findings: IntegrativeSeamFinding[]
  ): void {
    // Find JSX elements with exiting={...}
    const exitingElements = rootNode.findAll('<Animated.View $$$ATTRS exiting={$$$EXIT} $$$MORE>$$$CHILDREN</Animated.View>');
    const selfClosingExiting = rootNode.findAll('<Animated.View $$$ATTRS exiting={$$$EXIT} />');

    const allExiting = [...exitingElements, ...selfClosingExiting];

    for (const elem of allExiting) {
      const code = elem.text();
      // Check if exiting uses FadeOut, SlideOut, etc.
      if (code.includes('exiting=')) {
        // If file name indicates a Screen or Route component (e.g. Screen.tsx, page.tsx, index.tsx, Modal.tsx)
        const isScreenOrModal = /(Screen|Modal|Route|page|\[.+\])\.(tsx|jsx)$/i.test(filePath);
        if (isScreenOrModal && !code.includes('SharedTransitionBoundary') && !code.includes('stabilizeLayout')) {
          const range = elem.range();
          findings.push({
            ruleId: 'seam/unmount-exiting-animation-race',
            seamType: 'LIFECYCLE_DECONSTRUCTION',
            severity: 'warning',
            title: 'Exiting Animation Screen Deallocation Race',
            message:
              'Exiting layout animations inside navigation screens can trigger native SIGSEGV on Fabric if the screen is popped before the animation completes.',
            filePath,
            line: range.start.line + 1,
            column: range.start.column + 1,
            matchedText: code.slice(0, 50) + '...',
            remediationAdvice:
              "Wrap in a SharedTransitionBoundary or ensure parent screen delays unmount until exiting animations resolve.",
          });
        }
      }
    }
  }

  /**
   * Seam 3: Detects Pan gestures inside ScrollView/FlatList without directional activeOffsets.
   */
  private checkGestureScrollDeadlocks(
    rootNode: SgNode,
    sourceCode: string,
    filePath: string,
    findings: IntegrativeSeamFinding[]
  ): void {
    const hasScrollView = sourceCode.includes('<ScrollView') || sourceCode.includes('<FlatList');
    if (!hasScrollView) return;

    // Detect Gesture.Pan() usage
    const panGestures = rootNode.findAll('Gesture.Pan()');
    for (const pan of panGestures) {
      // Find the statement/expression containing this pan gesture
      let container: SgNode | null = pan.parent();
      let hasOffsetLock = false;
      let hasSimultaneous = false;

      while (container) {
        const text = container.text();
        if (text.includes('activeOffsetX') || text.includes('activeOffsetY')) {
          hasOffsetLock = true;
          break;
        }
        if (text.includes('simultaneousWithExternalGesture') || text.includes('simultaneousWith')) {
          hasSimultaneous = true;
          break;
        }
        if (container.kind() === 'variable_declarator' || container.kind() === 'lexical_declaration') {
          break;
        }
        container = container.parent();
      }

      if (!hasOffsetLock && !hasSimultaneous) {
        const range = pan.range();
        findings.push({
          ruleId: 'seam/gesture-scroll-deadlock',
          seamType: 'GESTURE_TOUCH_DEADLOCK',
          severity: 'warning',
          title: 'Pan Gesture nested in ScrollView without Touch Arbitration',
          message:
            'Pan gestures inside a ScrollView/FlatList without activeOffsetX/Y will suffer touch event cancellation or stutter on Android native views.',
          filePath,
          line: range.start.line + 1,
          column: range.start.column + 1,
          matchedText: 'Gesture.Pan()',
          remediationAdvice:
            'Configure directional locks: Gesture.Pan().activeOffsetX([-10, 10]) or pass .simultaneousWithExternalGesture(scrollRef).',
          autoFixSnippet: 'Gesture.Pan().activeOffsetX([-10, 10])',
        });
      }
    }
  }

  /**
   * Seam 4: Detects synchronous JSI calls in React render loops.
   */
  private checkRenderBlockingJsi(
    rootNode: SgNode,
    filePath: string,
    findings: IntegrativeSeamFinding[]
  ): void {
    const syncCalls = [
      ...rootNode.findAll('$STORAGE.getString($$$ARGS)'),
      ...rootNode.findAll('$STORAGE.getNumber($$$ARGS)'),
      ...rootNode.findAll('$STORAGE.getBoolean($$$ARGS)'),
    ];

    for (const call of syncCalls) {
      // Check if call is in root body of a functional component (not inside useEffect or useMemo)
      let ancestor = call.parent();
      let isInsideHook = false;
      let isInsideComponent = false;

      while (ancestor) {
        const text = ancestor.text();
        if (
          text.startsWith('useEffect(') ||
          text.startsWith('useMemo(') ||
          text.startsWith('useCallback(') ||
          text.includes('function on') ||
          text.includes('const handle')
        ) {
          isInsideHook = true;
          break;
        }
        if (
          ancestor.kind() === 'function_declaration' ||
          ancestor.kind() === 'arrow_function'
        ) {
          isInsideComponent = true;
        }
        ancestor = ancestor.parent();
      }

      if (isInsideComponent && !isInsideHook) {
        const range = call.range();
        findings.push({
          ruleId: 'seam/turbomodule-render-blocking-jsi',
          seamType: 'RENDER_BLOCKING_JSI',
          severity: 'warning',
          title: 'Synchronous JSI TurboModule call in Component Render Loop',
          message: `Synchronous JSI reading ('${call.text()}') inside component render path can block UI thread frames during reconciliation.`,
          filePath,
          line: range.start.line + 1,
          column: range.start.column + 1,
          matchedText: call.text(),
          remediationAdvice: 'Wrap synchronous JSI reads in useMemo() or offload to background storage cache.',
        });
      }
    }
  }
  /**
   * Seam 5: Detects nested SafeAreaViews causing double insets on notched devices.
   */
  private checkWindowInsetsSeam(
    rootNode: SgNode,
    sourceCode: string,
    filePath: string,
    findings: IntegrativeSeamFinding[]
  ): void {
    if (!sourceCode.includes('SafeAreaView')) return;

    const safeAreaViews = rootNode.findAll('<SafeAreaView $$ATTRS>$$CHILDREN</SafeAreaView>');
    for (const sav of safeAreaViews) {
      let ancestor = sav.parent();
      while (ancestor) {
        if (ancestor.kind() === 'jsx_element') {
          const opening = ancestor.field('open_tag') || ancestor;
          if (opening.text().startsWith('<SafeAreaView')) {
            const range = sav.range();
            findings.push({
              ruleId: 'seam/nested-safe-area-double-inset',
              seamType: 'WINDOW_INSET_COLLISION',
              severity: 'error',
              title: 'Nested SafeAreaView Double Inset Collision',
              message:
                'Nesting <SafeAreaView> inside another <SafeAreaView> causes duplicate window insets and layout jump on notched screens.',
              filePath,
              line: range.start.line + 1,
              column: range.start.column + 1,
              matchedText: sav.field('open_tag')?.text() || '<SafeAreaView>',
              remediationAdvice:
                'Remove inner <SafeAreaView> and use standard <View>, or use useSafeAreaInsets() on the outer container only.',
            });
            break;
          }
        }
        ancestor = ancestor.parent();
      }
    }
  }
}
