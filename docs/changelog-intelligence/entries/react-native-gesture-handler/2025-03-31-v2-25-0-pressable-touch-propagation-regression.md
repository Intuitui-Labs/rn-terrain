---
id: "rngh_2.25.0_silbreak_pressable-touch-propagation-regression"
package: "react-native-gesture-handler"
version_to: "2.25.0"
date_released: "2025-03-31"
impact_type: "SILENT_BEHAVIORAL_BREAK"
severity: "HIGH"
scope:
  code: true
  config: false
  native: true
  build: false
  peer_dep: false
  runtime: true
version_from: "2.24.x"
api_pattern_before: "// Pressable worked in prior versions:\nimport { Pressable } from 'react-native-gesture-handler';\n<Pressable onPress={handlePress}><Text>Button</Text></Pressable>"
api_pattern_after: "// Broken in 2.25.0 (isTouchPropagationAllowed stuck false);\n// Workaround: Use core React Native Pressable until 2.27.0 fix:\nimport { Pressable } from 'react-native';\n<Pressable onPress={handlePress}><Text>Button</Text></Pressable>"
code_smell_signatures:
  - "import.*Pressable.*from 'react-native-gesture-handler'"
capabilities_unlocked: []
affects_expo_managed: true
affects_bare_workflow: true
new_arch_required: false
cascade_deps: []
workaround_exists: true
workaround_code: "import { Pressable } from 'react-native';"
workaround_works_until: "2.27.0"
fixed_in_version: "2.27.0"
fixed_date: "2025-07-01"
changelog_url: "https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.25.0"
github_issue_url: "https://github.com/software-mansion/react-native-gesture-handler/issues/3476"
github_pr_url: null
migration_guide_url: null
community_thread_urls: []
agent_confidence: "HIGH"
needs_verification: false
last_verified: "2026-09-26"
captured_by: "agent"
captured_date: "2026-09-26"
---

# React Native Gesture Handler 2.25.0 — Pressable Touch Propagation Regression (Chronos Signal S1)

## Summary
Released on **March 31, 2025 (11:37:34 UTC)**, **React Native Gesture Handler 2.25.0** introduced an internal handler tag recreation mechanism (`Assign new handlerTag each time handler is created`) that triggered **Signal S1** (#3476): RNGH `Pressable` components completely stopped receiving press events because `isTouchPropagationAllowed` remained stuck at `false`.

## Failure Mechanics
When a user presses an RNGH `Pressable` inside a nested view, the touch event enters the native gesture recognizer state machine. Because the handler tag was reassigned dynamically on re-renders, the event interceptor failed to pass the event downstream to the JS touch responder, effectively muting `onPress`, `onPressIn`, and `onPressOut`.

## Dev Dance & Remediation
- **Immediate Workaround**: Switch import from `'react-native-gesture-handler'` to `'react-native'` core `Pressable`.
- **Permanent Resolution**: Fixed in RNGH **2.27.0** by the complete Pressable rewrite.
