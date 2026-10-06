---
id: "rngh_3.0.0_breaking_legacy-component-removal-and-fabric-mandate"
package: "react-native-gesture-handler"
version_to: "3.0.0"
date_released: "2025-11-20"
impact_type: "BREAKING_API_CHANGE"
severity: "CRITICAL"
scope:
  code: true
  config: false
  native: true
  build: false
  peer_dep: false
  runtime: true
version_from: "2.x"
api_pattern_before: "// Legacy RNGH v1/v2 component wrappers:\nimport { PanGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';\n\n<PanGestureHandler onGestureEvent={onPanEvent} onHandlerStateChange={onStateChange}>\n  <Animated.View />\n</PanGestureHandler>"
api_pattern_after: "// RNGH v3 GestureDetector API:\nimport { GestureDetector, Gesture } from 'react-native-gesture-handler';\n\nconst pan = Gesture.Pan()\n  .onUpdate((e) => {\n    'worklet';\n    translateX.value = e.translationX;\n  });\n\n<GestureDetector gesture={pan}>\n  <Animated.View />\n</GestureDetector>"
code_smell_signatures:
  - "<(Pan|Tap|LongPress|Pinch|Rotation|Fling)GestureHandler"
  - "onGestureEvent="
  - "onHandlerStateChange="
capabilities_unlocked:
  - capability: "GestureDetector API"
    replaces_custom_code: "Class-based gesture components with nested JSX wrapper pyramids"
    benefit: "Unified declarative builder syntax with full Fabric/New Architecture TurboModule acceleration"
  - capability: "RNGH v3 ergonomic hooks"
    replaces_custom_code: "Verbose JSX gesture wrappers"
    benefit: "Direct hook-level gesture binding (usePanGesture, useTapGesture)"
affects_expo_managed: true
affects_bare_workflow: true
new_arch_required: true
cascade_deps: []
workaround_exists: false
workaround_code: null
workaround_works_until: null
fixed_in_version: null
fixed_date: null
changelog_url: "https://github.com/software-mansion/react-native-gesture-handler/releases/tag/3.0.0"
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

# React Native Gesture Handler 3.0.0 — Legacy Component Removal & Fabric Architecture Mandate

## Summary
Released on **November 20, 2025**, **React Native Gesture Handler 3.0.0** is a major architectural milestone. It permanently deletes all legacy component-based handlers (`<PanGestureHandler>`, `<TapGestureHandler>`, `<LongPressGestureHandler>`, `<PinchGestureHandler>`, `<RotationGestureHandler>`, `<FlingGestureHandler>`, `<ForceTouchGestureHandler>`), mandates the New Architecture (Fabric), and establishes `GestureDetector` and v3 hooks as the exclusive gesture APIs.

## Breaking Changes

### 1. Permanent Removal of Legacy Component Handlers
The v1 component handlers were deprecated in 2.0.0 and are completely removed in 3.0.0:
- Any import of `PanGestureHandler`, `TapGestureHandler`, etc. throws runtime/bundle errors.
- Handlers using `onGestureEvent` or `onHandlerStateChange` must be rewritten using the `Gesture.<Type>()` builder or v3 hooks.

### 2. New Architecture / Fabric Mandate
RNGH 3.0.0 utilizes C++ TurboModules and Fabric ShadowNodes exclusively. Apps running on Paper (Old Architecture) cannot upgrade to 3.0.0 and must remain on the 2.x line (e.g. 2.33.0).

### 3. Modal Touch Disconnection
On Android and iOS, `<Modal>` creates a separate native window hierarchy. In 3.x, touches inside a `<Modal>` fail to route through the root `GestureHandlerRootView`. To fix:
```tsx
<Modal visible={visible}>
  <GestureHandlerRootView style={{ flex: 1 }}>
    {modalContent}
  </GestureHandlerRootView>
</Modal>
```

### 4. Known Collision with @gorhom/bottom-sheet (Signal S2)
Nesting `ReanimatedSwipeable` inside `@gorhom/bottom-sheet` on Fabric triggers a Yoga assertion / SIGABRT crash (`RNGestureHandlerDetectorShadowNode`). Keep bottom-sheet compositions on RNGH 2.31.x until resolved upstream.
