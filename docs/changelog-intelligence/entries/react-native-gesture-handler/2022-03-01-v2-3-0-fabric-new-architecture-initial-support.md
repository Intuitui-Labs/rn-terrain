---
id: "rngh_2.3.0_newcap_gesture-handler-for-fabric"
package: "react-native-gesture-handler"
version_to: "2.3.0"
date_released: "2022-03-01"
impact_type: "NEW_CAPABILITY"
severity: "HIGH"
scope:
  code: false
  config: true
  native: true
  build: true
  peer_dep: false
  runtime: true
version_from: "2.2.x"
api_pattern_before: "// Fabric Old Arch Bridge fallback mode"
api_pattern_after: "// Native Fabric C++ ShadowNode dispatching:\n// New Arch enabled via RCT_NEW_ARCH_ENABLED=1 or newArchEnabled=true"
code_smell_signatures: []
capabilities_unlocked:
  - capability: "Fabric C++ ShadowNodes & TurboModules"
    replaces_custom_code: "Legacy asynchronous bridge event serialization"
    benefit: "Direct synchronous gesture state evaluation without crossing asynchronous JS bridge"
affects_expo_managed: true
affects_bare_workflow: true
new_arch_required: false
cascade_deps:
  - "react-native@>=0.68.0"
workaround_exists: false
workaround_code: null
workaround_works_until: null
fixed_in_version: null
fixed_date: null
changelog_url: "https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.3.0"
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

# React Native Gesture Handler 2.3.0 — Fabric New Architecture Initial Support

## Summary
Released on **March 1, 2022 (14:37:24 UTC)**, **React Native Gesture Handler 2.3.0** introduced initial experimental support for React Native's New Architecture (Fabric and TurboModules).

## Architectural Impact

### 1. Fabric ShadowNode Interception
With Fabric enabled (`RCT_NEW_ARCH_ENABLED=1` on iOS or `newArchEnabled=true` on Android), RNGH utilizes native C++ component descriptors and shadow nodes (`RNGestureHandlerRootViewShadowNode`, `RNGestureHandlerDetectorShadowNode`).

### 2. Elimination of Bridge Bottlenecks
Under the legacy Paper architecture, gesture movement events (`translationX`, `velocityX`) travelled asynchronously across the JSON bridge, causing visual lag unless Reanimated worklets intercepted them. Fabric support allowed native-level C++ state manipulation directly with the Yoga layout tree.
