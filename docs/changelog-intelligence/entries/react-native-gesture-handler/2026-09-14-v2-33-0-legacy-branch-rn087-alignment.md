---
id: "rngh_2.33.0_setup_legacy-branch-rn087-alignment"
package: "react-native-gesture-handler"
version_to: "2.33.0"
date_released: "2026-09-14"
impact_type: "SETUP_CHANGE"
severity: "MEDIUM"
scope:
  code: false
  config: true
  native: true
  build: true
  peer_dep: true
  runtime: true
version_from: "2.32.x"
api_pattern_before: "// 2.x line failing native compilation on React Native 0.87 / AGP 9"
api_pattern_after: "// dist-tag: legacy maintains 2.x compatibility with React Native 0.87"
code_smell_signatures: []
capabilities_unlocked:
  - capability: "React Native 0.87 & AGP 9 Support on 2.x"
    replaces_custom_code: "Local patch-package scripts fixing C++ headers on RN 0.87"
    benefit: "Allows applications requiring the 2.x API to run on the latest React Native core substrate"
affects_expo_managed: true
affects_bare_workflow: true
new_arch_required: false
cascade_deps:
  - "react-native@>=0.87.0"
workaround_exists: false
workaround_code: null
workaround_works_until: null
fixed_in_version: null
fixed_date: null
changelog_url: "https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.33.0"
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

# React Native Gesture Handler 2.33.0 — Legacy Branch Maintenance & RN 0.87 Alignment

## Summary
Released on **September 14, 2026 (07:54:30 UTC)** with npm `dist-tag: legacy`, **React Native Gesture Handler 2.33.0** backports compatibility with **React Native 0.87**, Android Gradle Plugin 9 (AGP v9), and fixes a fatal `Cannot read property 'translationX' of undefined` crash during fast touch teardown.

## Purpose & Strategy
This release allows production codebases unable to immediately migrate away from deprecated v1/v2 component handlers to still upgrade their core React Native substrate to 0.87 without breaking native build toolchains.
