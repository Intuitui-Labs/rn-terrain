---
id: "rngh_2.27.0_fix_pressable-refactor-and-forcetouch-deprecation"
package: "react-native-gesture-handler"
version_to: "2.27.0"
date_released: "2025-07-01"
impact_type: "BUG_FIX"
severity: "HIGH"
scope:
  code: true
  config: false
  native: true
  build: false
  peer_dep: false
  runtime: true
version_from: "2.26.x"
api_pattern_before: "// Broken Pressable from 2.25.0/2.26.0 or ForceTouch gesture"
api_pattern_after: "// Restored Pressable and replacement for ForceTouch (LongPress):\nimport { Pressable, Gesture, GestureDetector } from 'react-native-gesture-handler';\n\n// Replaced ForceTouch with LongPress:\nconst hold = Gesture.LongPress().minDuration(300);\n<GestureDetector gesture={hold}><View /></GestureDetector>"
code_smell_signatures:
  - "Gesture.ForceTouch"
capabilities_unlocked:
  - capability: "Refactored Pressable"
    replaces_custom_code: "Workarounds muting RNGH Pressable"
    benefit: "Reliable button interaction with native gesture orchestrator without dropped touch propagation"
affects_expo_managed: true
affects_bare_workflow: true
new_arch_required: false
cascade_deps: []
workaround_exists: false
workaround_code: null
workaround_works_until: null
fixed_in_version: "2.27.0"
fixed_date: "2025-07-01"
changelog_url: "https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.0"
github_issue_url: "https://github.com/software-mansion/react-native-gesture-handler/issues/3476"
github_pr_url: null
migration_guide_url: "https://docs.swmansion.com/react-native-gesture-handler/docs/"
community_thread_urls: []
agent_confidence: "HIGH"
needs_verification: false
last_verified: "2026-09-26"
captured_by: "agent"
captured_date: "2026-09-26"
---

# React Native Gesture Handler 2.27.0 — Complete Pressable Rewrite & ForceTouch Deprecation

## Summary
Released on **July 1, 2025 (10:52:20 UTC)**, **React Native Gesture Handler 2.27.0** resolved **Signal S1** (#3476) via an end-to-end rewrite of `Pressable` touch dispatching, and formally deprecated `Gesture.ForceTouch()` reflecting Apple's removal of 3D Touch hardware.

## Key Changes

### 1. Pressable Touch State Restored
The refactored `Pressable` synchronizes directly with the underlying `PressableWithTouchable` native detector, ensuring `isTouchPropagationAllowed` correctly unlocks touch bubbling to parent and child listeners.

### 2. Deprecation of ForceTouch
`Gesture.ForceTouch()` is marked deprecated. Developers must migrate pressure-dependent UI interactions to `Gesture.LongPress()` or pointer pressure properties on supported styluses.
