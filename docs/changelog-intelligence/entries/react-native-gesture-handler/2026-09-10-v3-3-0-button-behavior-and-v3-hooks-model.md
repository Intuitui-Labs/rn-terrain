---
id: "rngh_3.3.0_breaking_button-behavior-and-hooks-api"
package: "react-native-gesture-handler"
version_to: "3.3.0"
date_released: "2026-09-10"
impact_type: "BREAKING_API_CHANGE"
severity: "HIGH"
scope:
  code: true
  config: false
  native: true
  build: false
  peer_dep: false
  runtime: true
version_from: "2.x"
api_pattern_before: "// v1/v2 legacy class components:\nimport { PanGestureHandler } from 'react-native-gesture-handler';\n<PanGestureHandler onGestureEvent={handler}><View /></PanGestureHandler>"
api_pattern_after: "// v3 declarative hooks or GestureDetector API:\nimport { usePanGesture, useTapGesture, GestureDetector, Gesture } from 'react-native-gesture-handler';\n\n// Option A (v3 Hooks):\nconst pan = usePanGesture((e) => { 'worklet'; console.log(e.translationX); });\n\n// Option B (GestureDetector):\nconst gesture = Gesture.Pan().onUpdate((e) => { 'worklet'; console.log(e.translationX); });\n<GestureDetector gesture={gesture}><Animated.View /></GestureDetector>"
affects_expo_managed: true
affects_bare_workflow: true
new_arch_required: true
cascade_deps: []
workaround_exists: false
workaround_code: null
workaround_works_until: null
fixed_in_version: null
fixed_date: null
changelog_url: "https://github.com/software-mansion/react-native-gesture-handler/releases/tag/3.3.0"
github_issue_url: null
github_pr_url: null
migration_guide_url: "https://docs.swmansion.com/react-native-gesture-handler/docs/"
community_thread_urls: []
agent_confidence: "HIGH"
needs_verification: false
last_verified: "2026-09-26"
captured_by: "agent"
captured_date: "2026-09-26"
---

# React Native Gesture Handler 3.3.0 — Native Button Stabilization & v3 Hooks Paradigm

## Summary
Released on **September 10, 2026**, **React Native Gesture Handler 3.3.0** brings critical stabilization to native button event dispatching across Android and iOS, cleans up the Web gesture orchestrator, and finalizes compatibility with React Native 0.83 through 0.87.

## Key Evolution: The v3 Gesture Paradigm

### 1. Legacy Component Handlers Dead in v3
Legacy component wrappers from v1 (`<PanGestureHandler>`, `<TapGestureHandler>`, `<LongPressGestureHandler>`, `<PinchGestureHandler>`) are permanently non-functional under Gesture Handler 3.x and the New Architecture.

### 2. The v3 Hooks API
Gesture Handler 3.x introduced direct ergonomic hooks:
- `useTapGesture`
- `usePanGesture`
- `useLongPressGesture`
These can be bound directly to animatable native components, avoiding verbose nested gesture composition boilerplate.

### 3. Button Press Fixes in 3.3.0
3.3.0 addresses a known issue where `RawButton`, `BaseButton`, and `RectButton` experienced dropped touch release cancellation events during fast pan-to-scroll transitions on Android 15/16 and iOS 18/26.
