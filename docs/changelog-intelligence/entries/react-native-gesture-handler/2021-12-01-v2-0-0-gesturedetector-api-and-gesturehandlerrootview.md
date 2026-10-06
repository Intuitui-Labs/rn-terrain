---
id: "rngh_2.0.0_breaking_gesturedetector-api-and-gesturehandlerrootview"
package: "react-native-gesture-handler"
version_to: "2.0.0"
date_released: "2021-12-01"
impact_type: "BREAKING_API_CHANGE"
severity: "CRITICAL"
scope:
  code: true
  config: false
  native: true
  build: false
  peer_dep: false
  runtime: true
version_from: "1.x"
api_pattern_before: "// Legacy RNGH v1 component handlers:\nimport { PanGestureHandler } from 'react-native-gesture-handler';\n\n<PanGestureHandler onGestureEvent={onPanEvent}>\n  <Animated.View />\n</PanGestureHandler>"
api_pattern_after: "// RNGH v2 declarative GestureDetector builder:\nimport { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';\n\n// 1. Root container requirement:\n<GestureHandlerRootView style={{ flex: 1 }}>\n  {/* 2. Gesture object builder */}\n  const pan = Gesture.Pan().onUpdate(e => { 'worklet'; console.log(e.translationX); });\n  <GestureDetector gesture={pan}>\n    <Animated.View />\n  </GestureDetector>\n</GestureHandlerRootView>"
code_smell_signatures:
  - "<(Pan|Tap|LongPress|Pinch|Rotation)GestureHandler"
  - "onGestureEvent="
capabilities_unlocked:
  - capability: "GestureDetector API"
    replaces_custom_code: "Class-based JSX handler wrappers"
    benefit: "Composability of simultaneous and exclusive gestures with Gesture.Simultaneous() and Gesture.Race()"
  - capability: "Gesture.Manual()"
    replaces_custom_code: "Custom native touch interceptors"
    benefit: "Direct state machine control over active, failed, and ended gesture states"
affects_expo_managed: true
affects_bare_workflow: true
new_arch_required: false
cascade_deps: []
workaround_exists: true
workaround_code: "// Keep using legacy PanGestureHandler in 2.x during transition"
workaround_works_until: "3.0.0"
fixed_in_version: null
fixed_date: null
changelog_url: "https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0"
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

# React Native Gesture Handler 2.0.0 — GestureDetector Paradigm & Root View Mandate

## Summary
Released on **December 1, 2021 (14:26:02 UTC)**, **React Native Gesture Handler 2.0.0** revolutionized touch handling in React Native by deprecating component wrappers in favor of the declarative `GestureDetector` API and `Gesture` builder.

## Core Architectural Changes

### 1. The `GestureDetector` Architecture
- **Before**: Each gesture type was a distinct React Component (`<PanGestureHandler>`, `<TapGestureHandler>`). Combining simultaneous gestures required deep JSX nesting pyramids and passing `simultaneousHandlers={ref}`.
- **After**: A single `<GestureDetector gesture={...}>` accepts composed gestures created via builders:
  ```tsx
  const pan = Gesture.Pan();
  const pinch = Gesture.Pinch();
  const composed = Gesture.Simultaneous(pan, pinch);
  <GestureDetector gesture={composed}><Animated.View /></GestureDetector>
  ```

### 2. Mandatory `GestureHandlerRootView`
RNGH 2.0 introduced the strict requirement that apps must wrap their root component in `<GestureHandlerRootView style={{ flex: 1 }}>`. On Android, this root view is responsible for intercepting the native `MotionEvent` stream before standard Android ViewGroup dispatching occurs.

### 3. Modal Touch Context Isolation
Because `<Modal>` in React Native creates a separate native window on Android and iOS, it bypasses the root `GestureHandlerRootView`. Inside any `<Modal>`, children must be wrapped in another `<GestureHandlerRootView>` to re-establish touch delivery.
