---
id: "nativewind_5.0.0-rc.0_breaking_tailwind-v4-css-first-rewrite"
package: "nativewind"
version_to: "5.0.0-rc.0"
date_released: "2026-08-15"
impact_type: "BREAKING_API_CHANGE"
severity: "CRITICAL"
scope:
  code: true
  config: true
  native: false
  build: true
  peer_dep: true
  runtime: true
version_from: "4.x"
api_pattern_before: "// NativeWind v4:\n// 1. tailwind.config.js with plugins, content array, darkMode: 'class'\n// 2. babel.config.js: plugins: ['nativewind/babel']\n// 3. metro.config.js: withNativeWind(config, { input: 'global.css' })\n// 4. cssInterop(Component, { className: 'style' })"
api_pattern_after: "// NativeWind v5 (Tailwind v4):\n// 1. global.css with @theme { --color-*: ...; } (tailwind.config.js deleted)\n// 2. NO Babel plugin! babel.config.js plugin removed completely\n// 3. metro.config.js: withNativewind(config, { input: 'global.css' }) (lowercase 'w')\n// 4. Powered by react-native-css; @cssInterop and :root.dark removed"
code_smell_signatures:
  - "@config.*tailwind\\.config\\.js"
  - "nativewind/babel"
  - "withNativeWind"
capabilities_unlocked:
  - capability: "@theme CSS Directives"
    replaces_custom_code: "tailwind.config.js theme.extend JS objects"
    benefit: "Zero JS bundle parsing overhead; instant hot reload via react-native-css"
  - capability: "@utility Directives"
    replaces_custom_code: "Custom inline StyleSheet objects for complex platform elevation/shadows"
    benefit: "Declarative cross-platform utility definitions in pure CSS"
transitional_debt:
  is_hybrid_state: true
  bridge_mechanism: "@config directive linking legacy tailwind.config.js into global.css"
  complete_migration_action: "Migrate colors/fonts to @theme and delete tailwind.config.js"
affects_expo_managed: true
affects_bare_workflow: true
new_arch_required: true
cascade_deps:
  - "tailwindcss"
  - "react-native-css"
workaround_exists: false
workaround_code: null
workaround_works_until: null
fixed_in_version: null
fixed_date: null
changelog_url: "https://www.nativewind.dev/"
github_issue_url: null
github_pr_url: null
migration_guide_url: "https://www.nativewind.dev/docs/v4-to-v5"
community_thread_urls: []
agent_confidence: "HIGH"
needs_verification: false
last_verified: "2026-09-26"
captured_by: "agent"
captured_date: "2026-09-26"
---

# NativeWind 5.0.0-rc.0 — Complete CSS-First Overhaul Aligned with Tailwind CSS v4

## Summary
**NativeWind v5** (`5.0.0-rc.0`) represents a generational rewrite designed around **Tailwind CSS v4** and the new native stylesheet engine `react-native-css`. Almost every configuration pattern taught to LLMs prior to 2026 is invalidated in v5.

## Transitional Debt: The `@config` Bridge
Many projects run in a hybrid state where `@config "../tailwind.config.js"` is included in `global.css`. While Tailwind v4 supports this during migration, it maintains legacy overhead and should be phased out by moving all tokens to `@theme`.

## Code Smell Signatures
- `@config ".../tailwind.config.js"` in CSS files.
- `plugins: ['nativewind/babel']` in `babel.config.js` (fatal).
- `withNativeWind` with uppercase `W` (legacy).
