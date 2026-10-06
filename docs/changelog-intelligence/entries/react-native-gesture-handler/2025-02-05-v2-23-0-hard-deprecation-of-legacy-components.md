---
id: "rngh_2.23.0_deprecation_old-api-drawerlayout-touchables"
package: "react-native-gesture-handler"
version_to: "2.23.0"
date_released: "2025-02-05"
impact_type: "DEPRECATION_WARNING"
severity: "HIGH"
scope:
  code: true
  config: false
  native: false
  build: false
  peer_dep: false
  runtime: true
version_from: "2.22.x"
api_pattern_before: "// Banned legacy imports emitting runtime console warnings in 2.23.0:\nimport { \n  PanGestureHandler, \n  TapGestureHandler, \n  DrawerLayout, \n  TouchableOpacity \n} from 'react-native-gesture-handler';"
api_pattern_after: "// Upgraded modern imports:\nimport { GestureDetector, Gesture } from 'react-native-gesture-handler';\nimport ReanimatedDrawerLayout from 'react-native-gesture-handler/ReanimatedDrawerLayout';\nimport { Pressable } from 'react-native';"
code_smell_signatures:
  - "<(Pan|Tap|LongPress|Pinch|Rotation)GestureHandler"
  - "import.*DrawerLayout.*from 'react-native-gesture-handler'"
  - "import.*(TouchableOpacity|TouchableHighlight).*from 'react-native-gesture-handler'"
capabilities_unlocked: []
transitional_debt:
  is_hybrid_state: true
  bridge_mechanism: "Legacy handlers still function at runtime but emit verbose console warnings preparing for v3.0 deletion"
  complete_migration_action: "Migrate all handlers to GestureDetector and DrawerLayout to ReanimatedDrawerLayout"
affects_expo_managed: true
affects_bare_workflow: true
new_arch_required: false
cascade_deps: []
workaround_exists: true
workaround_code: "// LogBox.ignoreLogs(['[react-native-gesture-handler] Seems like you\\'re using an old API'])"
workaround_works_until: "3.0.0"
fixed_in_version: null
fixed_date: null
changelog_url: "https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0"
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

# React Native Gesture Handler 2.23.0 — Hard Deprecation of Legacy Components, DrawerLayout & Touchables

## Summary
Released on **February 5, 2025 (15:00:00 UTC)**, **React Native Gesture Handler 2.23.0** officially entered the final deprecation stage for the original v1 APIs, triggering runtime warnings for `<PanGestureHandler>`, `<TapGestureHandler>`, `<DrawerLayout>`, and the custom RNGH `Touchable*` wrappers.

## Deprecated APIs and Replacements

| Deprecated API in 2.23.0 | Modern Replacement | Target Deletion |
| :--- | :--- | :--- |
| `<PanGestureHandler>` | `<GestureDetector gesture={Gesture.Pan()}>` | `3.0.0` (Hard Removal) |
| `<TapGestureHandler>` | `<GestureDetector gesture={Gesture.Tap()}>` | `3.0.0` (Hard Removal) |
| `<DrawerLayout>` | `ReanimatedDrawerLayout` | `3.0.0` (Hard Removal) |
| RNGH `TouchableOpacity` | React Native `Pressable` | `3.0.0` (Hard Removal) |

## Developer Action
Teams upgrading to 2.23.0 should treat these console warnings as high-priority tech debt, because RNGH 3.0.0 permanently deletes these components.
