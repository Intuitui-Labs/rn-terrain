---
id: "mmkv_4.3.2_newcap_check-content-changed-and-recovery"
package: "react-native-mmkv"
version_to: "4.3.2"
date_released: "2026-06-22"
impact_type: "NEW_CAPABILITY"
severity: "MEDIUM"
scope:
  code: true
  config: false
  native: true
  build: false
  peer_dep: false
  runtime: true
version_from: "4.3.0"
api_pattern_before: "// Previous MMKV versions had no explicit dirty content check or recovery strategy:\nconst storage = createMMKV({ id: 'app-storage' });"
api_pattern_after: "// 4.3.2 introduces checkContentChanged() and recoveryStrategy config:\nconst storage = createMMKV({\n  id: 'app-storage',\n  recoveryStrategy: 'recover-or-recreate'\n});\nconst hasChanged = storage.checkContentChanged();"
code_smell_signatures:
  - "createMMKV\\(\\{(?![\\s\\S]*recoveryStrategy)"
  - "\\.byteSize"
capabilities_unlocked:
  - capability: "recoveryStrategy: 'recover-or-recreate'"
    replaces_custom_code: "Try/catch blocks catching fatal MMKV C++ SIGSEGV during startup disk corruption"
    benefit: "Automatic graceful recovery without fatal app crash on low-end storage devices"
  - capability: "checkContentChanged()"
    replaces_custom_code: "Custom EventEmitter, AppState reload handlers, or bridge polling for iOS Widgets / App Clips"
    benefit: "Zero-latency multi-process memory map cache invalidation"
transitional_debt: null
affects_expo_managed: true
affects_bare_workflow: true
new_arch_required: true
cascade_deps: []
workaround_exists: false
workaround_code: null
workaround_works_until: null
fixed_in_version: null
fixed_date: null
changelog_url: "https://github.com/mrousavy/react-native-mmkv/releases/tag/v4.3.2"
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

# React Native MMKV 4.3.2 — `checkContentChanged()`, Recovery Strategy & RN 0.87 Core

## Summary
Released on **June 22, 2026**, **react-native-mmkv 4.3.2** adds reactive cache invalidation via `checkContentChanged()`, adds crash-resilient disk `recoveryStrategy` options, adds external memory size reporting, updates documentation to remove deprecated `.size` usage, and updates the underlying MMKV Core engine to support React Native 0.87.

## Key Additions
1. **`checkContentChanged()`**:
   - Allows multi-process or native extension writes (e.g. iOS Widgets, App Clips, Share Extensions) to notify the MMKV instance to re-sync memory maps immediately.
   - Built-in hooks reactively observe `checkContentChanged()`.
2. **`recoveryStrategy`**:
   - Configurable disk corruption fallback: `'recover-or-recreate'` or `'throw-error'`.
3. **Memory Size Reporting**:
   - Direct memory size calculation for external memory debugging.
4. **Deprecated `size` / `byteSize` Property**:
   - Accessing `.byteSize` as a property is deprecated in favor of storage metrics.

## Code Smell Signatures
- `createMMKV({ ... })` without `recoveryStrategy`: Risk of unhandled native crash on sudden power-loss or low-disk corruption.
