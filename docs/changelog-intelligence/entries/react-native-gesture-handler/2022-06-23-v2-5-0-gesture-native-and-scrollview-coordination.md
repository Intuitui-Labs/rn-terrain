---
id: "rngh_2.5.0_newcap_gesture-native-and-scrollview-coordination"
package: "react-native-gesture-handler"
version_to: "2.5.0"
date_released: "2022-06-23"
impact_type: "NEW_CAPABILITY"
severity: "MEDIUM"
scope:
  code: true
  config: false
  native: true
  build: false
  peer_dep: false
  runtime: true
version_from: "2.4.x"
api_pattern_before: "// Outer ScrollView stealing pan events during touch drags:\nconst pan = Gesture.Pan();\n<GestureDetector gesture={pan}>\n  <ScrollView><Content /></ScrollView>\n</GestureDetector>"
api_pattern_after: "// Native gesture coordination using simultaneousWithExternalGesture or activateAfterLongPress:\nconst scrollRef = useRef(null);\nconst pan = Gesture.Pan()\n  .activateAfterLongPress(300)\n  .simultaneousWithExternalGesture(scrollRef);\n\n<GestureDetector gesture={pan}>\n  <ScrollView ref={scrollRef}><Content /></ScrollView>\n</GestureDetector>"
code_smell_signatures: []
capabilities_unlocked:
  - capability: "Gesture.Native() / simultaneousWithExternalGesture"
    replaces_custom_code: "Hack touch listeners trying to avoid scroll theft"
    benefit: "Allows seamless drag-and-drop or swipe actions nested directly inside native scroll containers"
  - capability: "activateAfterLongPress modifier"
    replaces_custom_code: "Two-stage Pan + LongPress race coordination state variables"
    benefit: "Pan gesture only engages after a specified hold threshold, letting immediate scrolls pass through"
affects_expo_managed: true
affects_bare_workflow: true
new_arch_required: false
cascade_deps: []
workaround_exists: false
workaround_code: null
workaround_works_until: null
fixed_in_version: null
fixed_date: null
changelog_url: "https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0"
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

# React Native Gesture Handler 2.5.0 — Gesture Coordination with ScrollViews & Long Press Activation

## Summary
Released on **June 23, 2022 (14:18:44 UTC)**, **React Native Gesture Handler 2.5.0** introduced the `activateAfterLongPress` modifier for Pan gestures and refined native gesture delegation (`simultaneousWithExternalGesture`) when wrapping scroll containers like `ScrollView` and `FlatList`.

## Key Features

### 1. `activateAfterLongPress(duration)`
Solves the common UX conflict where a user wants to scroll a list, but also wants to drag an item after holding it. Instead of constructing a complex `Gesture.Race(pan, longPress)` with custom state logic, `Gesture.Pan().activateAfterLongPress(300)` handles the delay natively.

### 2. Native View Touch Extraction (`pointerEvents='box-none'`)
Fixed Android gesture dispatching when child views define `pointerEvents="box-none"`, ensuring touch hits fall through to underlying RNGH handlers.
