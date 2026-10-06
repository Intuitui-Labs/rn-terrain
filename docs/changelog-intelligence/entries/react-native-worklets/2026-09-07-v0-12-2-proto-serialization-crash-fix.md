---
id: "worklets_0.12.2_fix_proto-serialization-and-teardown-crash"
package: "react-native-worklets"
version_to: "0.12.2"
date_released: "2026-09-07"
impact_type: "BUG_FIX"
severity: "HIGH"
scope:
  code: false
  config: false
  native: true
  build: false
  peer_dep: false
  runtime: true
version_from: "0.12.1"
api_pattern_before: "// Complex JS objects with prototype chains sent across thread boundaries crashed clonePlainJSObject"
api_pattern_after: "// Serializes prototype-backed plain objects safely without thread lock deadlocks"
affects_expo_managed: true
affects_bare_workflow: true
new_arch_required: true
cascade_deps:
  - "react-native-reanimated"
workaround_exists: false
workaround_code: null
workaround_works_until: null
fixed_in_version: "0.12.2"
fixed_date: "2026-09-07"
changelog_url: "https://github.com/software-mansion/react-native-reanimated/releases/tag/react-native-worklets%400.12.2"
github_issue_url: null
github_pr_url: null
migration_guide_url: null
community_thread_urls: []
agent_confidence: "HIGH"
needs_verification: false
last_verified: "2026-09-26"
captured_by: "agent"
captured_date: "2026-09-26"
---

# React Native Worklets 0.12.2 — `__proto__` Serialization Fix & Android Teardown Crash

## Summary
Released on **September 7, 2026**, **react-native-worklets 0.12.2** delivers three high-severity runtime fixes to the C++ worklet runtime shared by Reanimated 4 and custom UI thread runners.

## Addressed Issues
1. **`__proto__` Serialization Crash**:
   - Addressed an uncaught SIGSEGV in `clonePlainJSObject` triggered when transmitting complex objects or class instances with non-null prototypes across the JS-to-UI thread boundary.
2. **Android Teardown Crash**:
   - Fixed a null-pointer exception during activity teardown or app backgrounding while worklets were actively evaluating.
3. **Stuck `Synchronizable` Lock**:
   - Resolved a deadlock scenario where a worklet runtime thread holding a synchronizable mutex failed to unlock during an unhandled JS exception.

## Preceding Capabilities (0.12.0 - 0.12.1)
- **0.12.1**: Added `isOnUIThread` to Worklets C++ Stable API.
- **0.12.0**: Added native `WeakRef` support inside worklet contexts and aligned Bundle Mode with React Native script loaders.
