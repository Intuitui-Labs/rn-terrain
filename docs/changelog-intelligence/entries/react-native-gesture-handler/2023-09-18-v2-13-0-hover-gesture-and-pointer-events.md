---
id: "rngh_2.13.0_newcap_hover-gesture-and-pointer-events"
package: "react-native-gesture-handler"
version_to: "2.13.0"
date_released: "2023-09-18"
impact_type: "NEW_CAPABILITY"
severity: "MEDIUM"
scope:
  code: true
  config: false
  native: true
  build: false
  peer_dep: false
  runtime: true
version_from: "2.12.x"
api_pattern_before: "// Web/Desktop mouse hover workarounds using onMouseEnter/onMouseLeave DOM events"
api_pattern_after: "// Native Gesture.Hover() builder for iPadOS, macOS, and Web:\nimport { Gesture, GestureDetector } from 'react-native-gesture-handler';\n\nconst hover = Gesture.Hover()\n  .onBegin(() => { 'worklet'; isHovered.value = true; })\n  .onFinalize(() => { 'worklet'; isHovered.value = false; });\n\n<GestureDetector gesture={hover}>\n  <Animated.View />\n</GestureDetector>"
code_smell_signatures:
  - "onMouseEnter="
  - "onMouseLeave="
capabilities_unlocked:
  - capability: "Gesture.Hover()"
    replaces_custom_code: "DOM-level mouse enter/leave listeners or platform-specific hover hacks"
    benefit: "First-class unified hover tracking across iPadOS (Apple Pencil & trackpad), macOS, Windows, and Web"
affects_expo_managed: true
affects_bare_workflow: true
new_arch_required: false
cascade_deps: []
workaround_exists: false
workaround_code: null
workaround_works_until: null
fixed_in_version: null
fixed_date: null
changelog_url: "https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.0"
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

# React Native Gesture Handler 2.13.0 — Hover Gesture & Pointer Events

## Summary
Released on **September 18, 2023 (11:55:11 UTC)**, **React Native Gesture Handler 2.13.0** introduced the `Gesture.Hover()` recognizer, delivering official pointer tracking support for iPadOS trackpads, Apple Pencil hover, desktop platforms (macOS/Windows), and Web.

## Key Capabilities

### 1. `Gesture.Hover()` Recognizer
Provides callbacks (`onBegin`, `onUpdate`, `onChange`, `onEnd`, `onFinalize`) for pointer proximity without requiring a touch or click down. Coordinates cleanly with UIControls and native responder chains without stealing click focus.
