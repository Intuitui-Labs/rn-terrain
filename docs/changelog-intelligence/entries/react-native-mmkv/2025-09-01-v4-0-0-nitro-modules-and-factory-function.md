---
id: "mmkv_4.0.0_breaking_nitro-modules-and-create-mmkv"
package: "react-native-mmkv"
version_to: "4.0.0"
date_released: "2025-09-01"
impact_type: "BREAKING_API_CHANGE"
severity: "CRITICAL"
scope:
  code: true
  config: false
  native: true
  build: false
  peer_dep: true
  runtime: true
version_from: "3.x"
api_pattern_before: "// MMKV v2 and v3 constructor:\nimport { MMKV } from 'react-native-mmkv';\nconst storage = new MMKV();\nstorage.delete('user.token');"
api_pattern_after: "// MMKV v4+ factory function:\nimport { createMMKV } from 'react-native-mmkv';\nconst storage = createMMKV();\nstorage.remove('user.token'); // .delete is renamed to .remove!"
affects_expo_managed: true
affects_bare_workflow: true
new_arch_required: true
cascade_deps:
  - "react-native-nitro-modules"
workaround_exists: false
workaround_code: null
workaround_works_until: null
fixed_in_version: null
fixed_date: null
changelog_url: "https://github.com/mrousavy/react-native-mmkv/releases/tag/v4.0.0"
github_issue_url: null
github_pr_url: null
migration_guide_url: "https://github.com/mrousavy/react-native-mmkv/blob/main/docs/MIGRATION_V3_TO_V4.md"
community_thread_urls: []
agent_confidence: "HIGH"
needs_verification: false
last_verified: "2026-09-26"
captured_by: "agent"
captured_date: "2026-09-26"
---

# React Native MMKV 4.0.0 — Factory Function `createMMKV()`, Method `.remove()`, and Nitro Modules

## Summary
**React Native MMKV 4.0.0** transitioned the entire underlying C++ bridging layer to **Nitro Modules**. This release removed class instantiation (`new MMKV()`), renamed key deletion methods (`.delete()` -> `.remove()`), and made `react-native-nitro-modules` a mandatory peer dependency.

## Key Breaking Changes

### 1. `new MMKV()` Removed → `createMMKV()`
Instantiating MMKV with `new MMKV()` triggers runtime type errors. MMKV instances must be created using the `createMMKV()` factory:
```ts
// BROKEN
const storage = new MMKV();

// CORRECT
import { createMMKV } from 'react-native-mmkv';
const storage = createMMKV({ id: 'app-storage' });
```

### 2. Method Renamed: `.delete()` → `.remove()`
The deletion method was renamed to conform to standard map/cache semantics:
```ts
// BROKEN
storage.delete('session_id');

// CORRECT
storage.remove('session_id');
```

### 3. Mandatory Peer Dependency: `react-native-nitro-modules`
MMKV v4 relies on Nitro Modules for zero-overhead C++ binding. If `react-native-nitro-modules` is not present in `package.json`, native compilation fails during iOS `pod install` or Android CMake build.
