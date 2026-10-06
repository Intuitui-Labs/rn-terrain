---
id: "rngh_2.31.0_newcap_android-pointer-fix-and-pre-v3-stable-anchor"
package: "react-native-gesture-handler"
version_to: "2.31.0"
date_released: "2026-04-02"
impact_type: "NEW_CAPABILITY"
severity: "HIGH"
scope:
  code: false
  config: false
  native: true
  build: false
  peer_dep: false
  runtime: true
version_from: "2.30.x"
api_pattern_before: "// Flaky multi-touch / pinch gestures on Android; GestureDetector dead after display: none"
api_pattern_after: "// Robust multi-pointer tracking and display: none recovery on New Architecture"
code_smell_signatures: []
capabilities_unlocked:
  - capability: "Android Multi-Pointer Move Validation"
    replaces_custom_code: "Workarounds for stuck multi-touch pointers on Android"
    benefit: "Inspects all active pointer IDs during move events to prevent orphan gesture tracking"
  - capability: "display: none New Arch Re-attachment"
    replaces_custom_code: "Unmounting views instead of toggling display: none"
    benefit: "GestureDetector cleanly recovers touch listeners after visibility changes on Fabric"
affects_expo_managed: true
affects_bare_workflow: true
new_arch_required: false
cascade_deps: []
workaround_exists: false
workaround_code: null
workaround_works_until: null
fixed_in_version: null
fixed_date: null
changelog_url: "https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0"
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

# React Native Gesture Handler 2.31.0 — Android Multi-Pointer Fix & Pre-v3 Stable Anchor

## Summary
Released on **April 2, 2026 (14:13:00 UTC)**, **React Native Gesture Handler 2.31.0** represents the definitive stable milestone for the 2.x lineage before the v3.0 architecture shift. It resolves multi-finger touch tracking on Android and serves as the recommended rollback target for teams encountering **Signal S2** (Yoga assertion crashes on Fabric).

## Architectural Significance

### 1. Chronos Signal S2 Anchor Version
In RNGH 3.0.0 through 3.3.x, composing `ReanimatedSwipeable` with `@gorhom/bottom-sheet` on Fabric triggers a native layout assertion (`SIGABRT` in `RNGestureHandlerDetectorShadowNode`). **RNGH 2.31.x** is the authoritative version where this component composition remains fully stable on both Paper and Fabric.

### 2. Android Multi-Pointer Move Validation
Prior Android implementations only checked primary pointer coords during `ACTION_MOVE`. 2.31.0 iterates over all pointer indices, preventing pinch-to-zoom and multi-finger pan drift.
