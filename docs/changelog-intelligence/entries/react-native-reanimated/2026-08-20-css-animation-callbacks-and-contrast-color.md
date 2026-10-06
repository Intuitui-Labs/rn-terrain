---
id: "reanimated_4.6.0_newcap_css-animation-callbacks"
package: "react-native-reanimated"
version_to: "4.6.0"
date_released: "2026-08-20"
impact_type: "NEW_CAPABILITY"
severity: "MEDIUM"
scope:
  code: true
  config: false
  native: false
  build: false
  peer_dep: false
  runtime: true
version_from: "4.5.x"
api_pattern_before: "// Reanimated 3/4.0-4.5 lacked declarative CSS animation event callbacks;\n// Developers used JS setTimeout or runOnJS to detect animation completion"
api_pattern_after: "<Animated.View\n  style={animatedStyle}\n  onCSSAnimationStart={handleStart}\n  onCSSAnimationEnd={handleEnd}\n  onCSSTransitionEnd={handleTransitionEnd}\n/>"
code_smell_signatures:
  - "transform: \\[.*\\] as any"
  - "setTimeout\\(.*performHide"
  - "setTimeout\\(.*setVisible\\(false\\)"
capabilities_unlocked:
  - capability: "onCSSTransitionEnd / onCSSAnimationEnd"
    replaces_custom_code: "JavaScript setTimeout timers coordinating auto-hide / dismissal lifecycles"
    benefit: "Guarantees zero UI/JS thread desync and flicker-free native unmounting"
  - capability: "contrastColor() worklet"
    replaces_custom_code: "Custom WCAG luminance math and packages like chroma-js/color"
    benefit: "Computes black/white accessible contrast directly on the UI thread"
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
changelog_url: "https://github.com/software-mansion/react-native-reanimated/releases/tag/4.6.0"
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

# Reanimated 4.6.0 — Declarative CSS Animation Callbacks & `contrastColor()` Utility

## Summary
Released on August 20, 2026, **React Native Reanimated 4.6.0** introduces first-class CSS animation and transition lifecycle callbacks to native components on iOS and Android. It also expands RN compatibility across React Native 0.83 through 0.87 and introduces a native worklet port of W3C CSS `contrast-color()`.

## What Changed
Reanimated 4 continues its convergence with standard web animations under the New Architecture (Fabric). In 4.6.0:
1. **CSS Animation & Transition Callbacks**:
   - `onCSSAnimationStart`, `onCSSAnimationEnd`, `onCSSAnimationIteration`, `onCSSAnimationCancel`
   - `onCSSTransitionRun`, `onCSSTransitionStart`, `onCSSTransitionEnd`, `onCSSTransitionCancel`
   These callbacks fire directly from native animation loops without needing JS thread polling.
2. **`contrastColor()` Worklet**:
   - Adds a worklet function computing WCAG-compliant high-contrast foreground color (`'white'` or `'black'`) against dynamic backgrounds.
3. **Platform CSS Transitions**:
   - Experimental native platform-driven CSS transitions for `opacity` on Android.

## Unlocked Capabilities (Boilerplate Bounty)
- **Eliminate JS Timers for Popups/Overlays**: You no longer need `setTimeout(hide, 4000)`. Use native sequence transitions with `onCSSTransitionEnd`.
- **Eliminate Color Math Helpers**: Delete custom contrast ratio calculation functions in favor of native `contrastColor()`.

## Detection Signatures / Code Smells
- `transform: [...] as any`: Developers working around strict CSS transform tuple types.
- `setTimeout(...)` managing animated overlay dismissals.
