---
id: "reanimated_4.5.0_breaking_plain-style-removal-and-shared-boundary"
package: "react-native-reanimated"
version_to: "4.5.0"
date_released: "2026-06-22"
impact_type: "BREAKING_API_CHANGE"
severity: "HIGH"
scope:
  code: true
  config: false
  native: false
  build: false
  peer_dep: false
  runtime: true
version_from: "4.4.x"
api_pattern_before: "// Direct use of internal Reanimated style types:\nimport type { PlainStyle } from 'react-native-reanimated';\n\n// Unscoped shared transitions between conflicting navigators:\n<Animated.View sharedTransitionTag=\"hero-img\" />"
api_pattern_after: "// PlainStyle removed; use standard StyleProp<ViewStyle> or AnimatedStyle\nimport type { AnimatedStyle } from 'react-native-reanimated';\n\n// Use SharedTransitionBoundary to scope navigation subtrees:\n<SharedTransitionBoundary>\n  <Animated.View sharedTransitionTag=\"hero-img\" />\n</SharedTransitionBoundary>"
affects_expo_managed: true
affects_bare_workflow: true
new_arch_required: true
cascade_deps: []
workaround_exists: false
workaround_code: null
workaround_works_until: null
fixed_in_version: null
fixed_date: null
changelog_url: "https://github.com/software-mansion/react-native-reanimated/releases/tag/4.5.0"
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

# Reanimated 4.5.0 — `SharedTransitionBoundary`, Pseudo-selectors & `PlainStyle` Removal

## Summary
Released on June 22, 2026, **React Native Reanimated 4.5.0** introduced scoped shared element transitions via `SharedTransitionBoundary`, added native CSS pseudo-selectors (`:hover`, `:active`, `:focus`) for iOS and Android, moved iOS shadow/background/border animations to Apple Core Animation, and removed the internal `PlainStyle` export.

## Breaking Changes & Incompatibilities
1. **`PlainStyle` Export Removed**:
   - Internal type `PlainStyle` was eliminated. Code importing internal style definitions directly will fail compilation.
   - **Fix**: Use standard `StyleProp<ViewStyle>` or `AnimatedStyle<ViewStyle>`.
2. **Strict CSS Style Typing**:
   - Reanimated style properties underwent stricter typing to match CSS specifications. Arbitrary numeric or non-standard string values in transitions now trigger TypeScript errors.

## New Capabilities
1. **`SharedTransitionBoundary`**:
   - Scopes shared element transitions to a specific subtree or navigator, preventing accidental tag collisions when multiple tabs or modal stacks mount simultaneously.
2. **Native Pseudo-selectors**:
   - Supports `:hover`, `:active`, and `:focus` states driven directly by native gesture recognizers without JS roundtrips.
3. **Core Animation on iOS**:
   - By enabling feature flag `IOS_CSS_CORE_ANIMATION`, transitions for `shadowColor`, `shadowOpacity`, `backgroundColor`, and borders run off the main thread on iOS Core Animation.
