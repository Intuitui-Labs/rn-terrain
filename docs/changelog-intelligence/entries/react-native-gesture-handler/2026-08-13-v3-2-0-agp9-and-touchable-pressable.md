---
id: "rngh_3.2.0_build_agp9-and-touchable-pressable"
package: "react-native-gesture-handler"
version_to: "3.2.0"
date_released: "2026-08-13"
impact_type: "BUILD_PIPELINE_CHANGE"
severity: "MEDIUM"
scope:
  code: false
  config: true
  native: true
  build: true
  peer_dep: false
  runtime: true
version_from: "3.1.x"
api_pattern_before: "// AGP 8 Gradle build configurations failing on Gradle 9"
api_pattern_after: "// AGP v9 + Gradle 9 native toolchain compliance"
code_smell_signatures: []
capabilities_unlocked:
  - capability: "AGP v9 & Modern Gradle 9 compatibility"
    replaces_custom_code: "Gradle deprecation suppression scripts"
    benefit: "Enables Android 16/V build target compilation with modern Android Gradle Plugin"
affects_expo_managed: true
affects_bare_workflow: true
new_arch_required: true
cascade_deps: []
workaround_exists: false
workaround_code: null
workaround_works_until: null
fixed_in_version: null
fixed_date: null
changelog_url: "https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0"
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

# React Native Gesture Handler 3.2.0 — Android Gradle Plugin 9 & Pressable Stabilization

## Summary
Released on **August 13, 2026 (14:51:24 UTC)**, **React Native Gesture Handler 3.2.0** upgraded the Android build toolchain to adopt Android Gradle Plugin 9 (AGP v9) and re-engineered `Pressable` on top of `Touchable` native primitives to eliminate dropped taps in complex layouts.
