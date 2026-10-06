---
id: "expo-router_58.0.0-beta_deprecation_integrate-with-router-and-native-tabs"
package: "expo-router"
version_to: "58.0.0-beta"
date_released: "2026-09-15"
impact_type: "DEPRECATION_WARNING"
severity: "HIGH"
scope:
  code: true
  config: true
  native: false
  build: false
  peer_dep: true
  runtime: true
version_from: "57.0.x"
api_pattern_before: "// Custom layout wrapping in SDK 57:\nimport { withLayoutContext } from 'expo-router';\nimport { createBottomTabNavigator } from '@react-navigation/bottom-tabs';\nexport const Tabs = withLayoutContext(createBottomTabNavigator().Navigator);\n\n// Unstable native tabs entry point:\nimport { NativeTabs } from 'expo-router/unstable-native-tabs';"
api_pattern_after: "// Deprecation in SDK 58 beta: withLayoutContext -> integrateWithRouter\nimport { integrateWithRouter } from 'expo-router';\nexport const Tabs = integrateWithRouter(createBottomTabNavigator().Navigator);\n\n// Stable native tabs entry point:\nimport { NativeTabs } from 'expo-router/native-tabs';"
affects_expo_managed: true
affects_bare_workflow: false
new_arch_required: true
cascade_deps: []
workaround_exists: false
workaround_code: null
workaround_works_until: null
fixed_in_version: null
fixed_date: null
changelog_url: "https://github.com/expo/expo/blob/main/packages/expo-router/CHANGELOG.md"
github_issue_url: null
github_pr_url: null
migration_guide_url: "https://expo.dev/changelog"
community_thread_urls: []
agent_confidence: "HIGH"
needs_verification: false
last_verified: "2026-09-26"
captured_by: "agent"
captured_date: "2026-09-26"
---

# Expo Router SDK 58 Beta — `integrateWithRouter`, Stable Native Tabs & Server Web Rendering

## Summary
Announced on September 15, 2026 as part of the Expo SDK 58 Beta cycle, **Expo Router** introduces significant modernization to layout wrapping, stabilizes native tabs, and changes the default web SSR rendering execution model.

## Key Changes & Migration Requirements

### 1. `withLayoutContext` Deprecated in Favor of `integrateWithRouter`
Custom navigator wrappers that relied on `withLayoutContext` will receive deprecation notices.
- **Before**:
  ```ts
  import { withLayoutContext } from 'expo-router';
  export const CustomTabs = withLayoutContext(Navigator);
  ```
- **After**:
  ```ts
  import { integrateWithRouter } from 'expo-router';
  export const CustomTabs = integrateWithRouter(Navigator);
  ```

### 2. Native Tabs Promoted to Stable Entry Point
The experimental `expo-router/unstable-native-tabs` has been promoted to stable:
- **Import**: `import { NativeTabs } from 'expo-router/native-tabs';`

### 3. Server-Side Rendering (`web.output: "server"`)
In SDK 58, `web.output: "server"` now dynamically executes and renders HTML pages on **each incoming HTTP request** instead of performing build-time SSG/prerendering.
- **To preserve SDK 57 prerendering behavior**, set `web.output: "static"` and explicitly enable `{ "apiRoutes": true }` in `app.json`.

### 4. Direct React Navigation Imports Fully Removed
Any residual imports from `expo-router/react-navigation` or internal navigation state structures must be replaced by high-level `useRouter` hooks and `href` strings.
