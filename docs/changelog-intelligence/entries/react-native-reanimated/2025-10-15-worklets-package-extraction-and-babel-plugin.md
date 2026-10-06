---
id: "reanimated_4.0.0_breaking_worklets-package-and-babel-plugin"
package: "react-native-reanimated"
version_to: "4.0.0"
date_released: "2025-10-15"
impact_type: "BREAKING_API_CHANGE"
severity: "CRITICAL"
scope:
  code: true
  config: true
  native: false
  build: true
  peer_dep: true
  runtime: true
version_from: "3.x"
api_pattern_before: "// babel.config.js in Reanimated v3:\nplugins: [\n  'react-native-reanimated/plugin'\n];\n\n// Worklet utilities imported from reanimated or worklets-core:\nimport { runOnJS, runOnUI } from 'react-native-reanimated';\nimport { Worklets } from 'react-native-worklets-core';"
api_pattern_after: "// babel.config.js in Reanimated v4+:\nplugins: [\n  'react-native-worklets/plugin' // NOT react-native-reanimated/plugin!\n];\n\n// Standalone package required:\n// npm install react-native-worklets\nimport { createWorkletRuntime } from 'react-native-worklets';"
affects_expo_managed: true
affects_bare_workflow: true
new_arch_required: true
cascade_deps:
  - "react-native-worklets"
workaround_exists: false
workaround_code: null
workaround_works_until: null
fixed_in_version: null
fixed_date: null
changelog_url: "https://github.com/software-mansion/react-native-reanimated/releases/tag/4.0.0"
github_issue_url: null
github_pr_url: null
migration_guide_url: "https://docs.swmansion.com/react-native-reanimated/docs/guides/migration-from-3-to-4"
community_thread_urls: []
agent_confidence: "HIGH"
needs_verification: false
last_verified: "2026-09-26"
captured_by: "agent"
captured_date: "2026-09-26"
---

# Reanimated 4.0.0 — Worklets Extraction, Babel Plugin Path Change & Strict New Arch

## Summary
The release of **React Native Reanimated 4.0.0** is the single highest-frequency point of failure for AI agents. Reanimated 4 permanently uncoupled the JS worklet execution engine from the animation library into an independent package, `react-native-worklets`. This changed the Babel plugin identifier, required a separate dependency, and permanently dropped support for the Old React Native Architecture (Bridge).

## The Core Breaking Changes

### 1. Babel Plugin Identifier Changed
In Reanimated 3.x, the plugin was `'react-native-reanimated/plugin'`. In v4+, this plugin no longer exists in `react-native-reanimated`; it is now provided by `'react-native-worklets/plugin'`.
- **Old (Fails with Module Not Found or Plugin Syntax Error)**:
  ```js
  plugins: ['react-native-reanimated/plugin']
  ```
- **New (Correct for v4+)**:
  ```js
  plugins: ['react-native-worklets/plugin']
  ```

### 2. Standalone `react-native-worklets` Dependency
In Reanimated 3, worklet runtimes and dispatchers were bundled inside Reanimated. In v4, `react-native-worklets` must be an explicit installed dependency.
- Note: Do NOT confuse with the obsolete third-party package `react-native-worklets-core`. The official Software Mansion package is `react-native-worklets`.

### 3. Complete Removal of Legacy Architecture (Bridge) Support
Reanimated 4 does not contain Paper/Bridge fallbacks. If an app disables the New Architecture (`newArchEnabled=false`), the app will crash at startup.
