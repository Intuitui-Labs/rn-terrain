---
id: "expo-router_57.0.0_breaking_react-navigation-import-elimination"
package: "expo-router"
version_to: "57.0.0"
date_released: "2026-06-30"
impact_type: "BREAKING_API_CHANGE"
severity: "CRITICAL"
scope:
  code: true
  config: false
  native: false
  build: false
  peer_dep: true
  runtime: true
version_from: "55.0.x"
api_pattern_before: "// Direct imports from React Navigation packages in Expo Router apps:\nimport { useNavigation, useRoute } from '@react-navigation/native';\nimport { StackActions } from '@react-navigation/native';"
api_pattern_after: "// Must import navigation utilities directly from expo-router:\nimport { useNavigation, useLocalSearchParams, useRouter } from 'expo-router';"
affects_expo_managed: true
affects_bare_workflow: false
new_arch_required: true
cascade_deps:
  - "@react-navigation/native"
  - "@react-navigation/core"
workaround_exists: false
workaround_code: null
workaround_works_until: null
fixed_in_version: null
fixed_date: null
changelog_url: "https://expo.dev/changelog"
github_issue_url: null
github_pr_url: null
migration_guide_url: "https://docs.expo.dev/router/reference/migration/"
community_thread_urls: []
agent_confidence: "HIGH"
needs_verification: false
last_verified: "2026-09-26"
captured_by: "agent"
captured_date: "2026-09-26"
---

# Expo Router SDK 57 — Elimination of Direct `@react-navigation/*` Imports

## Summary
Starting decisively in SDK 56 and solidified in **Expo SDK 57 (June 30, 2026)**, Expo Router has forked and abstracted its internal navigation core. Directly importing navigation hooks, types, or actions from `@react-navigation/native` inside an Expo Router application causes state desynchronization, broken deep linking, and runtime `undefined` navigation context errors.

## The Core Breaking Behavior
AI agents frequently generate:
```tsx
import { useNavigation } from '@react-navigation/native';
```
In Expo Router SDK 57:
1. `useNavigation()` from `@react-navigation/native` does not share router context with the file-based route hierarchy.
2. Direct navigation actions (`navigation.navigate('Screen')`) bypass typed route validation and history stack normalization.
3. Parameter retrieval using `useRoute()` fails; parameters must be read using `useLocalSearchParams()` or `useGlobalSearchParams()`.

## Mandatory Migration Patterns
- **Navigation Hook**:
  ```tsx
  // WRONG
  import { useNavigation } from '@react-navigation/native';
  // RIGHT
  import { useNavigation, useRouter } from 'expo-router';
  ```
- **Params**:
  ```tsx
  // WRONG
  import { useRoute } from '@react-navigation/native';
  const { id } = useRoute().params;
  // RIGHT
  import { useLocalSearchParams } from 'expo-router';
  const { id } = useLocalSearchParams<{ id: string }>();
  ```
- **Navigation Dispatch**:
  ```tsx
  // WRONG
  navigation.navigate('profile', { id: '123' });
  // RIGHT
  const router = useRouter();
  router.push({ pathname: '/profile/[id]', params: { id: '123' } });
  ```
