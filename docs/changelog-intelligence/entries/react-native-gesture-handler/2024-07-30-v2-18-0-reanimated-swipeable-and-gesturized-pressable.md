---
id: "rngh_2.18.0_newcap_reanimated-swipeable-and-gesturized-pressable"
package: "react-native-gesture-handler"
version_to: "2.18.0"
date_released: "2024-07-30"
impact_type: "NEW_CAPABILITY"
severity: "HIGH"
scope:
  code: true
  config: false
  native: true
  build: false
  peer_dep: true
  runtime: true
version_from: "2.17.x"
api_pattern_before: "// Legacy Animated.Value Swipeable from RNGH root:\nimport Swipeable from 'react-native-gesture-handler/Swipeable';"
api_pattern_after: "// Modern Reanimated worklet Swipeable and Gesturized Pressable:\nimport ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';\nimport { Pressable } from 'react-native-gesture-handler';"
code_smell_signatures:
  - "import Swipeable from 'react-native-gesture-handler/Swipeable'"
capabilities_unlocked:
  - capability: "ReanimatedSwipeable"
    replaces_custom_code: "Legacy Swipeable driven by core Animated.Value"
    benefit: "Runs swipe physics and actions directly on the UI thread via Reanimated worklets"
  - capability: "RNGH Pressable"
    replaces_custom_code: "Wrapping TouchableOpacity inside GestureDetector"
    benefit: "Native button click synchronization with RNGH gesture orchestrator"
affects_expo_managed: true
affects_bare_workflow: true
new_arch_required: false
cascade_deps:
  - "react-native-reanimated@>=3.0.0"
workaround_exists: false
workaround_code: null
workaround_works_until: null
fixed_in_version: null
fixed_date: null
changelog_url: "https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0"
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

# React Native Gesture Handler 2.18.0 — ReanimatedSwipeable & Gesturized Pressable Inception

## Summary
Released on **July 30, 2024 (14:40:18 UTC)**, **React Native Gesture Handler 2.18.0** introduced two major UI components: `ReanimatedSwipeable` (a standalone Reanimated 3+ driven row action component) and the first "Gesturized" `Pressable`.

## Architectural Insights

### 1. `ReanimatedSwipeable` Row Component
Extracts the modern worklet-driven swipeable out of the legacy `Swipeable` code path:
```tsx
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

<ReanimatedSwipeable
  renderRightActions={(prog, drag) => <DeleteAction progress={prog} drag={drag} />}
>
  <ItemView />
</ReanimatedSwipeable>
```
*Note on Signal S2*: In later v3 versions under Fabric, combining `ReanimatedSwipeable` with `@gorhom/bottom-sheet` triggers a Yoga assertion crash.

### 2. Gesturized `Pressable`
Introduced an RNGH-native `Pressable` component designed to participate directly in RNGH's gesture hierarchy rather than standard React Native touch responders.
*(Note: Later regressed in 2.25.0 as Signal S1 where touch propagation got stuck false).*
