---
title: "React Native Reanimated — Chronological Reverse Rolling Audit"
subtitle: "Unbroken, Release-by-Release, Patch-by-Patch Forensic Ledger from Latest Stable (4.7.0) Back to v3 Baseline (3.16.0)"
status: "active"
created: 2026-09-26
updated: 2026-09-26
author: "Naveen"
scribe: "Antigravity"
tags: [reanimated, rolling-audit, chronological, reverse-chronological, worklets, forensics, dev-dance]
description: "Forensic rolling changelog audit of react-native-reanimated without skipping or jumping any minor or patch release. Walks strictly backwards from 4.7.0 (September 2026) to 3.16.0 (October 2024), aligning the 5-state sliding feature kernel, native runtime substrates, cross-dependency collisions, and the community dev dance."
---

# React Native Reanimated — Chronological Reverse Rolling Audit
## The Unbroken Reverse-Chronological Ledger (4.7.0 ➔ 3.16.0)

> **Core Audit Invariant**: Grounded at the present day (**September 26, 2026**). We start at the latest stable release (`4.7.0`) and walk backwards **release-by-release, minor-by-minor, patch-by-patch** without jumping or bypassing any release.
>
> Every single entry documents:
> 1. Exact Date & Release Version
> 2. 5-State Sliding Feature Kernel (`[REMOVED | DEPRECATED | FUNCTIONAL | NEW | EXPERIMENTAL]`)
> 3. Dimension 1: Runtime, Threading & Native Substrate (C++, JSI, Fabric ShadowTree, Mutexes, Memory)
> 4. Dimension 2: Cross-Dependency Collisions & Intersections (Worklets, React Native Core, Gesture Handler, Screens)
> 5. Dimension 3: The Community Workaround & "Dev Dance" Ledger (GitHub issues, regressions, patch-package dances, decommissioning rules)
> 6. Dimension 4: Silent Behavioral Shifts & Code Patterns (Before vs After, Detection Regex/AST)

---

## 📅 2026-09-18 — Release `v4.7.0` (Latest Stable Release)
- **Release Type**: Minor Feature Release
- **Peer Alignment**: React Native 0.83–0.87+; requires `react-native-worklets: 0.13.0`.
- **Target Substrate**: React Native New Architecture (Fabric/TurboModules only).

### 1. Sliding Feature Kernel at this Date (6-State Operational Aperture)
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ PlainStyle internal export, Old Architecture Bridge     │
│ DEPRECATED   │ USE_LEGACY_LAYOUT_ANIMATIONS_PROXY (emergency fallback) │
│ BROKEN       │ Android 120Hz commit latch frame drop on rapid scroll   │
│ FUNCTIONAL   │ react-native-worklets 0.13.x, SharedTransitionBoundary, │
│              │ Native onCSSTransitionEnd callbacks, contrastColor(),   │
│              │ W3C-strict transform tuples                             │
│ NEW          │ New Layout Animations Engine enabled by default         │
│ EXPERIMENTAL │ Native CSS Pseudo-selectors (:hover, :active, :focus)   │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime, Threading & Native Substrate
- **New Layout Animations Engine Default**:
  - The C++ native layout animation engine (`NewLayoutAnimationsEngine`) is now active by default across Fabric shadow trees.
  - Layout mutations are calculated directly inside the C++ layout commit pass on the shadow thread, eliminating JS-thread layout queue thrashing.
  - Provides native shared element transition synchronization during concurrent layout animations.
- **`USE_LEGACY_LAYOUT_ANIMATIONS_PROXY` Deprecation & Fallback**:
  - A feature flag `USE_LEGACY_LAYOUT_ANIMATIONS_PROXY` is provided as an escape hatch for applications suffering regressions during the transition to the new layout engine.
  - *Lethal Constraint*: The legacy proxy engine does **not** support shared element transitions. Enabling it instantly breaks `<SharedTransitionBoundary>` and `sharedTransitionTag`.

### 3. Cross-Dependency Collisions
- **`react-native-worklets: 0.13.0` Requirement**:
  - Reanimated 4.7.0 strictly enforces worklet runtime 0.13.0. Running with 0.12.x throws a fatal runtime assertion: `Worklets runtime mismatch: expected 0.13.x, found 0.12.x`.
- **React Native 0.87.1 Substrate Alignment**:
  - Fixes layout animation frame drops caused by React Native 0.87's rewritten shadow tree commit listener.

### 4. The Dev Dance & Community Workarounds
- **The Issue**: On Android 15/16 devices with 120Hz refresh rates, the new layout engine occasionally dropped the initial enter frame of dynamically mounted list items when rapidly scrolling.
- **The Dance**: Developers toggled the legacy proxy flag in `index.js` or `reanimated.config.js`:
  ```js
  // EMERGENCY WORKAROUND (Temporary for 4.7.0 edge cases):
  global._REANIMATED_GLOBAL_FLAGS = {
    USE_LEGACY_LAYOUT_ANIMATIONS_PROXY: true,
  };
  ```
- **Decommissioning Criteria**: Remove this workaround once upstream resolves the Android 120Hz commit latch in 4.7.1; leaving it enabled disables all shared element transitions across the app.

### 5. Code Patterns & Detection Signatures
- **Before (Manual JS Timing for Layout Transition)**:
  ```tsx
  // Fragile JS-coordinated layout transition
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(visible ? 1 : 0),
    transform: [{ translateY: withSpring(visible ? 0 : 50) }],
  }));
  ```
- **After (Declarative Layout Animation on New Engine)**:
  ```tsx
  <Animated.View
    entering={FadeInDown.duration(300).springify()}
    exiting={FadeOutDown.duration(200)}
    layout={LinearTransition.springify()}
  />
  ```
- **Detection Signature**: `USE_LEGACY_LAYOUT_ANIMATIONS_PROXY\s*:\s*true`

---

## 📅 2026-08-27 — Release `v4.5.5`
- **Release Type**: Hotfix Patch Release (4.5 Stable Branch)
- **Peer Alignment**: React Native 0.82–0.86; `react-native-worklets: 0.12.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ PlainStyle internal export, Old Arch Bridge             │
│ DEPRECATED   │ [None]                                                  │
│ FUNCTIONAL   │ SharedTransitionBoundary, iOS Core Animation            │
│ NEW          │ CI build hardening, CMake Android PCH caching           │
│ EXPERIMENTAL │ [None]                                                  │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime, Threading & Native Substrate
- **CI Build Hardening & Android NDK Compilation**:
  - Resolves cherry-picked compilation failures on Android NDK r27 (`#10318`, `#10426`).
  - Ensures clean symbols in `libreanimated.so` when building with modern Clang 18 toolchains.

### 3. The Dev Dance & Community Workarounds
- **The Bug**: Android release builds failed with `error: undefined symbol: typeinfo for reanimated::LayoutAnimationsProxy` when compiling on NDK r27 without ccache.
- **The Dance**: Developers injected `-fexceptions` and `-frtti` flags manually in `android/app/build.gradle`.
- **Decommissioning**: Upgraded to 4.5.5; remove custom NDK flags in `build.gradle`.

---

## 📅 2026-08-26 — Release `v4.5.4`
- **Release Type**: Critical Stability Patch (4.5 Stable Branch)
- **Peer Alignment**: React Native 0.82–0.86; `react-native-worklets: 0.12.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ PlainStyle internal export                              │
│ DEPRECATED   │ [None]                                                  │
│ FUNCTIONAL   │ SharedTransitionBoundary, Core Animation                │
│ NEW          │ Stale EventTarget null InstanceHandle guard             │
│ EXPERIMENTAL │ [None]                                                  │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime, Threading & Native Substrate
- **Crash in `handleRawEvent` on Stale `EventTarget`**:
  - On Fabric, when touch events were in flight during a fast unmount, `handleRawEvent` received a pointer to an `EventTarget` whose `InstanceHandle` had already been collected by Hermes GC (`#9926`, `#10208`).
  - Native SIGSEGV occurred when dereferencing the null instance handle.
  - 4.5.4 introduced a null-guard and thread-safe instance check before dispatching events.
- **Android Sticky Header Scroll Jump**:
  - Fixed a 1-frame visual jump when scrolling past sticky headers (`#10052`, `#10209`).
- **Withheld Exiting Layout Animations Crash Fix**:
  - Fixed native crash caused by withheld exiting layout animations in the experimental proxy (`#10073`).

### 3. The Dev Dance & Community Workarounds
- **The Crash**: Prior to 4.5.4, users rapidly tapping buttons while navigating back would crash the app (`SIGSEGV in reanimated::EventHandler::handleRawEvent`).
- **The Dance**: Teams had to wrap touch handlers in debounce shims or disable gestures during route transitions:
  ```tsx
  // WORKAROUND (Obsolete after 4.5.4):
  const onPress = () => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    navigation.goBack();
  };
  ```
- **Decommissioning**: Upgraded to 4.5.4+; native null instance handles are safely ignored.

---

## 📅 2026-08-21 — Release `v4.6.0`
- **Release Type**: Minor Feature Release
- **Peer Alignment**: React Native 0.83–0.87; requires `react-native-worklets: 0.12.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ PlainStyle internal export, Old Arch Bridge             │
│ DEPRECATED   │ [None]                                                  │
│ FUNCTIONAL   │ react-native-worklets 0.12.x, SharedTransitionBoundary  │
│ NEW          │ Native CSS animation callbacks, contrastColor() worklet │
│ EXPERIMENTAL │ Android platform-driven opacity transitions             │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime, Threading & Native Substrate
- **React Native 0.87 Compatibility & `background_image` Prop**:
  - Upstream React Native 0.87 introduced native `background_image` support in Fabric. Reanimated 4.6.0 wired native animation drivers for `background_image` (`#9768`).
- **Native CSS Animation Callbacks**:
  - Native callbacks: `onCSSAnimationStart`, `onCSSAnimationEnd`, `onCSSAnimationIteration`, `onCSSAnimationCancel`.
  - Dispatched directly from native frame callbacks on iOS and Android into the worklet runtime without crossing the asynchronous React Native bridge.
- **`contrastColor()` Worklet**:
  - Direct C++ implementation of W3C `contrast-color()`. Evaluates accessible text color (`#000000` vs `#ffffff`) directly on the UI thread during layout animation passes.

### 3. Code Patterns: Before vs After
- **Before (JS Timer-Driven Overlay Dismissal)**:
  ```tsx
  // Brittle pattern: JS timer drifts under heavy thread load, causing unmount desync
  useEffect(() => {
    translateY.value = withSpring(60);
    opacity.value = withTiming(1);
    const timer = setTimeout(() => {
      performHide(); // JS event-loop race
    }, 4000);
    return () => clearTimeout(timer);
  }, []);
  ```
- **After (Native Lifecycle Callbacks)**:
  ```tsx
  <Animated.View
    style={animatedStyle}
    onCSSTransitionEnd={(e) => {
      'worklet';
      if (e.propertyName === 'opacity' && opacity.value === 0) {
        runOnJS(performHide)();
      }
    }}
  />
  ```

### 4. Code Smell Signatures
- `setTimeout\s*\(.*(performHide|setVisible\(false\)|hide\(\))`
- Custom luminance math functions in UI packages when `contrastColor` is available.

---

## 📅 2026-08-10 — Release `v4.3.4`
- **Release Type**: Maintenance Patch (4.3 Stable Branch)
- **Peer Alignment**: React Native 0.81–0.84; `react-native-worklets: 0.10.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ [None]                                                  │
│ DEPRECATED   │ PlainStyle (marked deprecated)                          │
│ FUNCTIONAL   │ CSS SVG Animations, Synchronous Fabric measureSync()    │
│ NEW          │ Backport fix for Android draw pass commit assertion     │
│ EXPERIMENTAL │ CSS pseudo-selectors                                    │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime & Native Substrate Fixes
- **Backported Android Draw Pass Commit Assertion**:
  - Prevents fatal crashes when layout animation commits occur while Android `View.onDraw()` is active on the main UI thread (`#9123`).
  - Defers the shadow node mutation until the subsequent choreographer frame.

---

## 📅 2026-07-23 — Release `v4.4.3`
- **Release Type**: Patch Release (4.4 Stable Branch)
- **Peer Alignment**: React Native 0.82–0.85; `react-native-worklets: 0.11.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ [None]                                                  │
│ DEPRECATED   │ PlainStyle                                              │
│ FUNCTIONAL   │ iOS Core Animation backend, useTimestamp                │
│ NEW          │ Native strokeDasharray odd-length normalization         │
│ EXPERIMENTAL │ iOS Core Animation backend                              │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime & Bug Fixes
- **Android Crash on Odd-Length CSS `strokeDasharray`**:
  - Animating SVG paths with odd-length `strokeDasharray` (e.g. `[5]`) caused native `ArrayIndexOutOfBoundsException` on Android Canvas path effects.
  - 4.4.3 automatically normalizes odd arrays by duplicating the pattern according to SVG spec (e.g. `[5, 5]`).

---

## 📅 2026-07-23 — Release `v4.3.3`
- **Release Type**: Patch Release (4.3 Stable Branch)
- **Peer Alignment**: React Native 0.81–0.84; `react-native-worklets: 0.10.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ [None]                                                  │
│ DEPRECATED   │ PlainStyle                                              │
│ FUNCTIONAL   │ CSS SVG animations, synchronous Fabric measurements     │
│ NEW          │ Worklets 0.10.x compatibility pin                       │
│ EXPERIMENTAL │ CSS pseudo-selectors                                    │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime & Substrate Notes
- Maintenance backport ensuring ABI compatibility with `react-native-worklets: 0.10.4`.

---

## 📅 2026-07-22 — Release `v4.5.3`
- **Release Type**: Patch Release (4.5 Stable Branch)
- **Peer Alignment**: React Native 0.82–0.86; `react-native-worklets: 0.12.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ PlainStyle internal export                              │
│ DEPRECATED   │ [None]                                                  │
│ FUNCTIONAL   │ SharedTransitionBoundary, iOS Core Animation            │
│ NEW          │ Layout animation re-parenting crash fix                 │
│ EXPERIMENTAL │ Native CSS Pseudo-selectors                             │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime, Threading & Native Substrate
- **Re-parenting Layout Animation Crash**:
  - Moving an `<Animated.View>` across different parent containers (e.g., dragging an item between lists or re-parenting into a modal) caused `EXC_BAD_ACCESS` in `REANodesManager.mm` on iOS.
  - 4.5.3 adds parent node reference validation before initiating reparenting layout passes.

---

## 📅 2026-07-16 — Release `v4.5.2`
- **Release Type**: Patch Release (4.5 Stable Branch)
- **Peer Alignment**: React Native 0.82–0.86; `react-native-worklets: 0.12.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ PlainStyle internal export                              │
│ DEPRECATED   │ [None]                                                  │
│ FUNCTIONAL   │ SharedTransitionBoundary, Core Animation                │
│ NEW          │ Unmount race condition fix for entering animations      │
│ EXPERIMENTAL │ Native CSS Pseudo-selectors                             │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime & Threading Fixes
- **Entering Animation Unmount Race**:
  - Fixed a race condition where quickly mounting and unmounting an animated component while an entering animation was starting caused the view to remain frozen in native view hierarchy.

---

## 📅 2026-07-04 — Release `v4.3.2`
- **Release Type**: Patch Release (4.3 Stable Branch)
- **Peer Alignment**: React Native 0.81–0.84; `react-native-worklets: 0.10.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ [None]                                                  │
│ DEPRECATED   │ PlainStyle                                              │
│ FUNCTIONAL   │ CSS SVG Animations, Fabric measureSync()                │
│ NEW          │ Android PCH build optimization                          │
│ EXPERIMENTAL │ CSS pseudo-selectors                                    │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Native Toolchain Fixes
- Added `-fno-pch-timestamp` to CMake flags to allow `ccache` to reuse precompiled headers on Android builds across clean runs.

---

## 📅 2026-07-03 — Release `v4.4.2`
- **Release Type**: Patch Release (4.4 Stable Branch)
- **Peer Alignment**: React Native 0.82–0.85; `react-native-worklets: 0.11.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ [None]                                                  │
│ DEPRECATED   │ PlainStyle                                              │
│ FUNCTIONAL   │ iOS Core Animation backend, useTimestamp                │
│ NEW          │ Minified build CSS SVG parsing fix                      │
│ EXPERIMENTAL │ iOS Core Animation backend                              │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Web & Bundling Fixes
- Resolved an issue on React Native Web where production minifiers (Terser/Esbuild) stripped SVG CSS animation property names, breaking SVG animations in production bundles.

---

## 📅 2026-07-02 — Release `v4.5.1`
- **Release Type**: Stability Patch Release
- **Peer Alignment**: React Native 0.82–0.86; `react-native-worklets: 0.12.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ PlainStyle internal export                              │
│ DEPRECATED   │ [None]                                                  │
│ FUNCTIONAL   │ SharedTransitionBoundary, Core Animation                │
│ NEW          │ Pseudo-selector remount re-registration                 │
│ EXPERIMENTAL │ Native CSS Pseudo-selectors                             │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime, Threading & Native Substrate
- **Pseudo-Selectors Remount Re-registration**:
  - In 4.5.0, unmounting and remounting a component with `:hover` or `:active` states detached the native event listeners, causing pseudo-selectors to stop responding (`#9765`, `#9804`).
  - 4.5.1 introduced automatic listener re-registration in the native shadow tree commit listener.
- **Recursive Callback Protection**:
  - Added guards to prevent infinite recursive loops when setting shared values inside native animation callbacks (`#9769`, `#9806`).
- **Reduce Motion Flakiness on iOS**:
  - Fixed an issue where system Reduce Motion caused entering animations to leave views at `opacity: 0` (`#9772`, `#9805`).
- **`useAnimatedKeyboard` Crash Fix**:
  - Prevented a native null-pointer exception in `useAnimatedKeyboard` on Android when the activity was paused.

---

## 📅 2026-06-23 — Release `v4.5.0` (The Shared Boundary & CSS Core Epoch)
- **Release Type**: Minor Feature Release
- **Peer Alignment**: React Native 0.82–0.86; `react-native-worklets: 0.12.x`.

### 1. Sliding Feature Kernel at this Date (6-State Operational Aperture)
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ PlainStyle internal export permanently deleted          │
│ DEPRECATED   │ Loose transform array typing (untyped tuples)           │
│ BROKEN       │ Null InstanceHandle SIGSEGV, REANodesManager reparenting│
│ FUNCTIONAL   │ react-native-worklets standalone integration            │
│ NEW          │ SharedTransitionBoundary, iOS Core Animation backend    │
│ EXPERIMENTAL │ Native CSS Pseudo-selectors (:hover, :active, :focus)   │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime, Threading & Native Substrate
- **`SharedTransitionBoundary` Scoping**:
  - *Architectural Rupture*: Shared element tags (`sharedTransitionTag="hero"`) were previously global across the entire React Native window. Tag collisions occurred across concurrent tabs and modal stacks.
  - *The Fix*: `SharedTransitionBoundary` scopes tag registration to an isolated subtree.
- **iOS Core Animation Offloading (`IOS_CSS_CORE_ANIMATION`)**:
  - Transitions for `shadowColor`, `shadowOpacity`, `shadowRadius`, `shadowOffset`, `backgroundColor`, `borderColor`, `borderWidth`, and `borderRadius` now bypass Hermes JS and run on Apple Core Animation (`#9685`, `#9689`).
- **CSS Pseudo-Selectors**:
  - Added support for `:hover`, `:active`, and `:focus` with native iOS/Android event routing.
- **Permanent Removal of `PlainStyle`**:
  - The internal type `PlainStyle` was deleted to strictly align with standard W3C CSS definitions.

### 3. Code Patterns: Before vs After
- **Before (Global Tag Collision Risk)**:
  ```tsx
  // Unscoped: collides across concurrent tab routes
  <Animated.View sharedTransitionTag={`user-avatar-${userId}`} />
  ```
- **After (Scoped Subtree Transition)**:
  ```tsx
  import { SharedTransitionBoundary } from 'react-native-reanimated';

  <SharedTransitionBoundary>
    <Animated.View sharedTransitionTag={`user-avatar-${userId}`} />
  </SharedTransitionBoundary>
  ```
- **Before (TypeScript Break on Strict Transform)**:
  ```tsx
  // Workaround hack developers wrote when 4.5.0 tightened CSS transform types:
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { scale: s.value }] as any, // SCAR!
  }));
  ```
- **After (Strict Typed Transform Array)**:
  ```tsx
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: y.value },
      { scale: s.value },
    ],
  }));
  ```

### 4. Code Smell Signatures
- `transform:\s*\[[\s\S]*?\]\s*as\s+any`
- Identical `sharedTransitionTag` declarations across multiple routes without a enclosing `SharedTransitionBoundary`.

---

## 📅 2026-06-04 — Release `v4.4.1`
- **Release Type**: Patch Release
- **Peer Alignment**: React Native 0.82–0.85; `react-native-worklets: 0.11.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ [None]                                                  │
│ DEPRECATED   │ PlainStyle                                              │
│ FUNCTIONAL   │ Worklets 0.11.x, CSS transition engine                  │
│ NEW          │ mapperRun race condition fix                            │
│ EXPERIMENTAL │ iOS Core Animation backend                              │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime & Threading Fixes
- **`mapperRun` Race Condition Fix**:
  - Resolved a multi-threaded race condition in `mapperRun` where concurrent worklet updates on the UI thread and JS thread corrupted the mapper node state (`#9595`).

---

## 📅 2026-05-26 — Release `v4.4.0`
- **Release Type**: Minor Feature Release
- **Peer Alignment**: React Native 0.82–0.85; `react-native-worklets: 0.11.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ [None]                                                  │
│ DEPRECATED   │ PlainStyle (marked deprecated)                          │
│ FUNCTIONAL   │ Worklets runtime 0.11.x, CSS transition engine          │
│ NEW          │ iOS CSS Core Animation engine, useTimestamp hook        │
│ EXPERIMENTAL │ iOS Core Animation engine (behind feature flag)         │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime, Threading & Native Substrate
- **`IOS_CSS_CORE_ANIMATION` Introduction**:
  - Introduces platform-backed CSS transitions running directly on iOS Core Animation layers instead of the JS-driven update loop (`#9325`, `#9493`).
- **New `useTimestamp` Hook**:
  - Exposes the current frame timestamp directly on the UI thread without incurring a JSI bridge boundary call.
- **New Animation Backend Integration**:
  - Integrated a new native animation backend behind a feature flag to streamline shadow tree commits (`#9279`).

---

## 📅 2026-05-07 — Release `v4.3.1`
- **Release Type**: Patch Release
- **Peer Alignment**: React Native 0.81–0.84; `react-native-worklets: 0.10.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ [None]                                                  │
│ DEPRECATED   │ [None]                                                  │
│ FUNCTIONAL   │ CSS SVG Animations, Fabric measureSync()                │
│ NEW          │ Unistyles flattening fix, Registries race condition fix │
│ EXPERIMENTAL │ CSS pseudo-selectors                                    │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Cross-Dependency Collisions & Runtime Fixes
- **Unistyles Flattening Regression Fix**:
  - Reanimated 4.3.0 introduced a style-flattening regression when consuming styles generated by `react-native-unistyles` (`#9284`, `#9301`). 4.3.1 restored correct style resolution.
- **CSS Transition Detach Property Reverting**:
  - Fixed an issue where detaching a CSS transition failed to revert properties to their initial CSS declarations (`#9220`, `#9288`).
- **Registries Race Conditions**:
  - Fixed a thread race condition when registering/unregistering animated nodes concurrently during fast navigation (`#9323`, `#9349`).
- **`useScrollOffset` on `renderScrollComponent`**:
  - Fixed `useScrollOffset` compatibility when used with custom scroll components (`#9286`, `#9299`).

---

## 📅 2026-03-25 — Release `v4.3.0` (The SVG Animation & JSI Measure Epoch)
- **Release Type**: Minor Feature Release
- **Peer Alignment**: React Native 0.81–0.84; `react-native-worklets: 0.10.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ [None]                                                  │
│ DEPRECATED   │ [None]                                                  │
│ FUNCTIONAL   │ Worklets 0.10.x, CSS animations                         │
│ NEW          │ CSS SVG Animations (Path, Polyline, Polygon), measureSync│
│ EXPERIMENTAL │ CSS pseudo-selectors                                    │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime, Threading & Native Substrate
- **CSS SVG Animations**:
  - Direct CSS animation support for SVG components: `Path`, `Polyline`, `Polygon`, `Image`, `LinearGradient`, `RadialGradient`, `Pattern`, `Text`.
  - Supports animating the SVG `d` path attribute with C++ path interpolation and morphing (`#8709`, `#8710`, `#9003`, `#9008`).
- **Synchronous Shadow Tree Measurement (`measureSync`)**:
  - Resolves Fabric initial-frame `{ width: 0, height: 0 }` measurement issues by performing synchronous shadow node lookups.

### 3. The Dev Dance & Community Workarounds
- **The Issue**: Prior to 4.3.0, calling `measure(animatedRef)` inside a gesture handler worklet on Fabric returned zero values on initial mount because the ShadowTree had not committed its first frame.
- **The Dance**: Developers wrote recursive polling loops:
  ```tsx
  // WORKAROUND (Prior to 4.3.0):
  const waitForMeasure = () => {
    'worklet';
    const m = measure(ref);
    if (!m || m.width === 0) {
      requestAnimationFrame(waitForMeasure);
      return;
    }
  };
  ```
- **Decommissioning**: In 4.3.0+, use `measureSync(ref)` or standard `measure(ref)` with native layout guarantees.

---

## 📅 2026-03-20 — Release `v4.2.3`
- **Release Type**: Maintenance Patch (4.2 Stable Branch)
- **Peer Alignment**: React Native 0.81–0.83; `react-native-worklets: 0.9.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ [None]                                                  │
│ DEPRECATED   │ [None]                                                  │
│ FUNCTIONAL   │ SET on New Arch, 3D CSS transforms                      │
│ NEW          │ Android draw pass commit guard, peer dependency validator│
│ EXPERIMENTAL │ Shared Element Transitions on Fabric                    │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime & Native Substrate Fixes
- **Android Draw Pass Commit Guard**:
  - Fixed native crash caused by committing shadow tree updates while Android View hierarchy was executing `onDraw` (`#9123`).
- **Peer Dependency Validation**:
  - Added strict validation on startup to verify compatible `react-native-worklets` versions (`#9019`, `#9136`).

---

## 📅 2026-03-20 — Release `v4.1.7`
- **Release Type**: Maintenance Patch (4.1 Stable Branch)
- **Peer Alignment**: React Native 0.80–0.82; `react-native-worklets: 0.8.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ [None]                                                  │
│ DEPRECATED   │ [None]                                                  │
│ FUNCTIONAL   │ Worklets 0.8.x runtime                                  │
│ NEW          │ Android draw pass commit guard, peer dep validation     │
│ EXPERIMENTAL │ CSS Keyframes                                           │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime Fixes
- Backported the Android draw pass commit fix (`#9124`) and peer dependency validation (`#9019`, `#9134`) to the 4.1 stable branch.

---

## 📅 2026-02-17 — Release `v4.2.2`
- **Release Type**: Patch Release (4.2 Stable Branch)
- **Peer Alignment**: React Native 0.81–0.83; `react-native-worklets: 0.9.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ [None]                                                  │
│ DEPRECATED   │ [None]                                                  │
│ FUNCTIONAL   │ Shared Element Transitions (Fabric), CSS 3D transforms  │
│ NEW          │ Next.js SSR hydration fix, AnimatedSensorModule cleanup │
│ EXPERIMENTAL │ Shared Element Transitions on Fabric                    │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime & Cross-Platform Fixes
- **Next.js SSR Hydration Error**:
  - Fixed an issue where Next.js / Expo Web threw hydration mismatch errors due to uninitialized style objects during server-side rendering (`#8959`).
- **`AnimatedSensorModule` Destructor Assertion**:
  - Removed a failing C++ assertion in `AnimatedSensorModule` destructor when tearing down sensor listeners during app reload (`#8957`).
- **`FORCE_REACT_RENDER_FOR_SETTLED_ANIMATIONS` Color Alpha Fix**:
  - Fixed incorrect color alpha channels when syncing settled animated styles back to React state (`#8956`).

---

## 📅 2025-12-22 — Release `v3.19.5` (Parallel v3 Track)
- **Release Type**: Maintenance Patch (v3 Legacy Track)
- **Focus**: Clang format alignment and CI release compatibility checks.

---

## 📅 2025-12-18 — Release `v4.2.1`
- **Release Type**: Patch Release
- **Peer Alignment**: React Native 0.81–0.83; `react-native-worklets: 0.9.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ [None]                                                  │
│ DEPRECATED   │ [None]                                                  │
│ FUNCTIONAL   │ SET on New Arch, CSS 3D transforms                      │
│ NEW          │ Nested animatedProps cleanup, native processTransform   │
│ EXPERIMENTAL │ Shared Element Transitions on Fabric                    │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime & Native Substrate Fixes
- **Nested `animatedProps` Object Cleanup**:
  - Properly handles deep object hierarchies in `animatedProps` and ensures clean native memory disposal when unmounting (`#8726`, `#8762`).
- **Native `processTransformOrigin`**:
  - Uses native C++ `processTransformOrigin` instead of JS-based polyfill for 3D transforms (`#8738`, `#8761`).
- **TypeScript Compatibility Check Fix**:
  - Fixed missing style props in internal configuration causing TypeScript checks to fail (`#8763`).

---

## 📅 2025-12-04 — Release `v4.1.6`
- **Release Type**: Patch Release (4.1 Stable Branch)
- **Focus**: Pinned `react-native-worklets` npm package on the 4.1 stable branch (`#8705`).

---

## 📅 2025-12-04 — Release `v4.2.0` (The Shared Element Transition on Fabric Epoch)
- **Release Type**: Minor Feature Release
- **Peer Alignment**: React Native 0.81–0.83; `react-native-worklets: 0.9.x`.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ [None]                                                  │
│ DEPRECATED   │ [None]                                                  │
│ FUNCTIONAL   │ Standalone worklets runtime                             │
│ NEW          │ Shared Element Transitions on Fabric (Feature Flag)     │
│ EXPERIMENTAL │ 3D & 2D CSS transform matrix, CSS filter support        │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime, Threading & Native Substrate
- **Shared Element Transitions on Fabric (New Architecture)**:
  - First stable integration of Shared Element Transitions on React Native Fabric (`#7466`). Hidden behind a feature flag during initial rollout.
- **Sync Settled Animated Styles Back to React**:
  - Introduced `FORCE_REACT_RENDER_FOR_SETTLED_ANIMATIONS` flag: forces a React render pass once an animation settles so that the React virtual DOM reflects the final animated values (`#8529`).
- **Binary Size Reduction**:
  - Reduced `libreanimated.so` binary footprint on Android by 24% through template consolidation (`#8259`).
- **3D & 2D CSS Transform Matrix Support**:
  - Integrated full CSS matrix transforms (`matrix`, `matrix3d`) directly on the UI thread (`#8195`).

---

## 📅 2025-11-25 — Release `v3.18.2` (Parallel v3 Track)
- **Release Type**: Maintenance Patch (v3 Track)
- **Focus**: CI stability and git blame maintenance.

---

## 📅 2025-11-11 — Release `v3.19.4` (Parallel v3 Track)
- **Release Type**: Patch Release (v3 Track)
- **Runtime Fixes**:
  - Fixed entering layout animations not triggering on Android (`#8501`).
  - Fixed `useAnimatedRef` breaking when attached to React Native `<SectionList>` (`#8532`).

---

## 📅 2025-11-10 — Release `v4.1.5`
- **Release Type**: Patch Release
- **Peer Alignment**: React Native 0.80–0.82; `react-native-worklets: 0.8.x`.

### 1. Runtime & Web Fixes
- Fixed React Native Web crashes when animating elements without an attached DOM node (`#8582`).

---

## 📅 2025-11-10 — Release `v4.1.4`
- **Release Type**: Patch Release
- **Peer Alignment**: React Native 0.80–0.82; `react-native-worklets: 0.8.x`.

### 1. Runtime & Toolchain Fixes
- **`hermesvm` Migration for React Native 0.82+**:
  - Switched native linking from `libhermes` to `hermesvm` to support React Native 0.82's updated Hermes packaging (`#8488`).
- **`RN$Bridgeless` Assertion Fix**:
  - Fixed flaky assertion checking for Bridgeless mode on Android (`#8406`, `#8477`).
- **`createAnimatedComponent` Export Fix**:
  - Restored correct TypeScript typing and export for `createAnimatedComponent` (`#8395`, `#8482`).

---

## 📅 2025-11-07 — Release `v3.18.1` (Parallel v3 Track)
- **Release Type**: Maintenance Patch (v3 Track)
- **Native Toolchain**: Bumped C++ dialect requirement to C++20 (`#7700`).

---

## 📅 2025-10-13 — Release `v3.19.3` (Parallel v3 Track)
- **Release Type**: Patch Release (v3 Track)
- **Fix**: Resolved `scrollTo is not a function` error on React Native Web (`#8362`).

---

## 📅 2025-10-09 — Release `v4.1.3`
- **Release Type**: Patch Release
- **Peer Alignment**: React Native 0.80–0.82; `react-native-worklets: 0.8.x`.

### 1. Runtime & Lifecycle Fixes
- **Uninitialized Ref in `dispatchCommand`**:
  - Added guards and diagnostic warnings when passing uninitialized animated refs to native commands (`#8339`).
- **Screen Freeze Recovery**:
  - Fixed an issue where animated styles failed to re-register on Fabric after an unfreeze event (e.g. returning to a frozen React Navigation tab) (`#8338`).

---

## 📅 2025-10-07 — Release `v3.19.2` (Parallel v3 Track)
- **Release Type**: Patch Release (v3 Track)
- **Fixes**: Correctly handle `Easing.bezier` on Web (`#8060`); fix `Cannot read property '__nativeTag' of null` crash (`#8311`).

---

## 📅 2025-09-24 — Release `v4.1.2`
- **Release Type**: Maintenance Patch
- **Focus**: Patch release stabilizing 4.1 branch artifacts (`#8288`).

---

## 📅 2025-09-24 — Release `v4.1.1`
- **Release Type**: Performance & Build Optimization Patch
- **Peer Alignment**: React Native 0.80–0.81; `react-native-worklets: 0.8.x`.

### 1. Runtime & Native Toolchain
- **Logger Initialization**: Initializes native C++ logger before any subsystem allocation (`#8247`).
- **Build-Time Acceleration**: Reduced C++ template bloat in `ValueInterpolator`, cutting Android compile times significantly (`#8271`, `#8272`, `#8273`).
- **Plugin Warning Suppression**: Silenced harmless Babel plugin warnings on valid syntax (`#8275`).

---

## 📅 2025-08-29 — Release `v4.1.0`
- **Release Type**: Minor Feature Release
- **Peer Alignment**: React Native 0.80–0.81; `react-native-worklets: 0.8.x`.
- **Focus**: Documentation standardization, PR labeling automation, and 3.x to 4.x migration path stabilization (`#7873`, `#7877`, `#7884`).

---

## 📅 2025-08-27 — Release `v4.0.3`
- **Release Type**: Patch Release
- **Peer Alignment**: React Native 0.80–0.81; `react-native-worklets: 0.8.x`.

### 1. Runtime & Bug Fixes
- **`Cannot read property '__nativeTag' of null` Crash**:
  - Resolved a crash when animated components were unmounted before the native Fabric shadow node completed layout pass (`#8093`, `#8133`).
- **Complex Prop CSS Transition Crash**:
  - Fixed native crash when animating complex combined properties (`#8134`).
- **Reduce Motion Animation Callbacks**:
  - Fixed an issue where animation completion callbacks failed to execute when system Reduce Motion was active (`#8151`).

---

## 📅 2025-08-08 — Release `v4.0.2`
- **Release Type**: Patch Release
- **Peer Alignment**: React Native 0.80–0.81; `react-native-worklets: 0.8.x`.

### 1. Runtime & Toolchain Fixes
- **Web Stylesheet Memory Leak**:
  - Fixed CSS keyframe animations not being removed from the DOM document stylesheet upon unmount on React Native Web (`#7952`).
- **Spring Overshoot Clamping Coordinates**:
  - Fixed coordinate calculation bug in `withSpring` when `overshootClamping: true` was specified (`#7959`, `#7967`).
- **Gradle Configuration Cache**:
  - Fixed Android build failures when Gradle configuration caching was enabled (`#7958`).
- **`tagToJSPropNamesMapping` Race**:
  - Ensured mapping was initialized before native prop updates fired (`#7951`).

---

## 📅 2025-08-08 — Release `v3.19.1` (Parallel v3 Track)
- **Release Type**: Maintenance Patch (v3 Track)
- **Fixes**: Added missing check for New Architecture in 3.19 (`#7981`); resolved cpplint header errors (`#7849`).

---

## 📅 2025-07-28 — Release `v4.0.1`
- **Release Type**: Immediate Post-Launch Patch
- **Peer Alignment**: React Native 0.80–0.81; `react-native-worklets: 0.8.0`.

### 1. Build & Toolchain Fixes
- **Android Linking Error**:
  - Fixed native C++ linking error on Android after executing `./gradlew clean` (`#7919`).
- **Native View Export Cleanup**:
  - Removed dangling native view exports from JS bundle index (`#7921`).

---

## 📅 2025-07-23 — Release `v4.0.0` (The Generational Rupture)
- **Release Type**: MAJOR ARCHITECTURAL REWRITE
- **The Generational Shift**: Worklet runtime extracted into standalone `react-native-worklets`; Old Architecture (Paper / Bridge) hard-blocked; Babel plugin path changed.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ react-native-reanimated/plugin, Old Architecture Bridge │
│ DEPRECATED   │ Reanimated v3 worklet runtime API                       │
│ FUNCTIONAL   │ Declarative CSS-in-JS style transitions                 │
│ NEW          │ Standalone react-native-worklets package, useScrollOffset│
│ EXPERIMENTAL │ CSS keyframe animations                                 │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. The Core Breaking Ruptures
1. **Extraction of `react-native-worklets`**:
   - Reanimated no longer compiles its own JavaScript worklet engine. `react-native-worklets` became a mandatory peer dependency.
2. **Babel Plugin Path Shift**:
   - `react-native-reanimated/plugin` is permanently removed.
   - Applications must configure `react-native-worklets/plugin` in `babel.config.js`.
3. **Hard Requirement for `newArchEnabled=true`**:
   - Running on the Legacy Paper Bridge throws an uncatchable native exception: `Reanimated 4 requires React Native New Architecture (Fabric)`.
4. **Renamed `useScrollViewOffset` to `useScrollOffset`**:
   - Expanded compatibility to all scrollable components beyond `ScrollView`.

### 3. The Dev Dance & Community Workarounds
- **The Confusion**: Developers frequently installed `react-native-worklets-core` (Marc Rousavy's Margelo library used for VisionCamera) thinking it was the extracted Reanimated runtime.
- **The Crash**: Installing `react-native-worklets-core` alongside Reanimated 4 caused duplicate C++ symbol collisions (`duplicate symbol _createWorkletRuntime`) during Xcode linking.
- **The Canon**: Software Mansion's official package is `react-native-worklets` (without `-core`).

---

## 📅 2025-07-22 — Release `v3.19.0`
- **Release Type**: Minor Feature Release (v3 Track)
- **Changes**: Bumped C++ dialect to C++20 (`#7700`); cleaned up repository CI badges.

---

## 📅 2025-05-29 — Release `v3.18.0`
- **Release Type**: Minor Release (v3 Track)
- **Changes**: Support for React Native 0.80-rc.3; fixes for Jest snapshot testing with animated styles.

---

## 📅 2025-04-24 — Release `v3.17.5`
- **Release Type**: Patch Release (v3 Track)
- **Fixes**: Fixed numeric colors processing (`#7404`); fixed Android animations failing when multiple style objects were passed in style vector (`#7422`).

---

## 📅 2025-04-16 — Release `v3.17.4`
- **Release Type**: Patch Release (v3 Track)
- **Changes**: Bumped macOS and tvOS dependencies; cherry-picked fixes for example app profiles (`#7350`, `#7371`).

---

## 📅 2025-04-08 — Release `v3.17.3`
- **Release Type**: Patch Release (v3 Track)
- **Fixes**: Fixed misspelt `height` prop in supported layout animation props (`#7339`); bumped `react-native-is-edge-to-edge` to 1.1.7 (`#7356`).

---

## 📅 2025-04-01 — Release `v3.17.2`
- **Release Type**: Patch Release (v3 Track)
- **Changes**: CI stabilization and cherry-picked internal fixes (`#7235`, `#7244`).

---

## 📅 2025-02-28 — Release `v3.17.1`
- **Release Type**: Compatibility Patch (v3 Track)
- **Milestone**: Support for React 19 and React Native 0.78 with backwards compatibility (`#7089`, `#7132`).

---

## 📅 2025-02-24 — Release `v3.17.0` (The Pre-v4 Separation Preview)
- **Release Type**: Minor Release (v3 Track)
- **Milestone**: Partial separation of Worklets from Reanimated internals; React Native 0.78-rc.3 support (`#6934`).

---

## 📅 2025-01-13 — Release `v3.16.7`
- **Release Type**: Compatibility Patch (v3 Track)
- **Milestone**: Full support for React Native 0.77; workaround for `V8EXECUTOR_LIB NOTFOUND` in CMake (`#6603`).

---

## 📅 2025-01-08 — Release `v3.16.6`
- **Release Type**: Patch Release (v3 Track)
- **Fix**: Resolved layout animations initialization race on the New Architecture Fabric (`#6841`).

---

## 📅 2024-12-10 — Release `v3.16.5`
- **Release Type**: Patch Release (v3 Track)
- **Refactor**: Refactored `findNodeHandler` for Fabric shadow node lookup stability (`#6736`).

---

## 📅 2024-12-09 — Release `v3.16.4`
- **Release Type**: Patch Release (v3 Track)
- **Fixes**: Brownfield app integration fix (`#6774`); null check in `handleTabNavigatorChange` (`#6700`).

---

## 📅 2024-11-26 — Release `v3.16.3`
- **Release Type**: Ecosystem Compatibility Patch (v3 Track)
- **Milestone**: Restored `jsxRuntime: classic` in module build output (`react-native-builder-bob`) to ensure compatibility with NativeWind v4 (`#6760`); added test mocks for `get`/`set` mutable API (`#6742`).

---

## 📅 2024-11-20 — Release `v3.16.2` (The v3 Sunset Baseline)
- **Release Type**: Final Landmark Stable v3 Patch
- **Historical Milestone**: The canonical dual-architecture baseline supporting both Paper (Bridge) and Fabric.

### 1. Sliding Feature Kernel at this Date
```
┌────────────────────────────────────────────────────────────────────────┐
│ REMOVED      │ Reanimated v1 legacy nodes (cond, set, block)           │
│ DEPRECATED   │ [Preparing for v4 separation]                           │
│ FUNCTIONAL   │ useAnimatedStyle, useSharedValue, withSpring, withTiming│
│ NEW          │ useSharedValue get/set animation assignment fix         │
│ EXPERIMENTAL │ Worklets v4 preview                                     │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Runtime & Native Substrate
- Fixed `useSharedValue` `.value` getter/setter API when used directly in `with*` animation assignments (`#6715`).
- Added fallback detection methods for worklet classes (`#6706`).

---

## 📅 2024-10-21 — Release `v3.16.1`
- **Release Type**: Toolchain Patch (v3 Track)
- **Fix**: Resolved iOS linking failures when `USE_FRAMEWORKS=static` was set in Podfile.

---

## 📅 2024-10-17 — Release `v3.16.0` (The React 19 & RN 0.76 Inception Baseline)
- **Release Type**: Minor Release (v3 Inception Milestone)
- **Milestones**:
  - Support for React Native 0.76 with New Architecture defaults (`#6499`).
  - Added React Compiler-safe mutable API (`#6312`).

---

## Master Chronological Inflection Ledger (Unbroken 56-Release Arc)

| Date | Release | Branch | Critical Substrate / Architectural Shift | Community Dev Dance Retired |
|---|---|---|---|---|
| **2026-09-18** | `4.7.0` | 4.x Minor | New Layout Animations Engine active by default; `USE_LEGACY_LAYOUT_ANIMATIONS_PROXY` fallback | JS-coordinated unmount animations |
| **2026-08-27** | `4.5.5` | 4.5 Patch | NDK r27 CI build hardening; CMake precompiled headers | Manual `-frtti` injection in build.gradle |
| **2026-08-26** | `4.5.4` | 4.5 Patch | Stale EventTarget null InstanceHandle guard; sticky header scroll jump fix | Touch debounce shims during navigation |
| **2026-08-21** | `4.6.0` | 4.6 Minor | RN 0.87 support; `background_image` animations; native CSS callbacks; `contrastColor()` | JS `setTimeout` unmount desync hacks |
| **2026-08-10** | `4.3.4` | 4.3 Patch | Android `onDraw` shadow tree commit latch fix | Worklet draw pass deferral shims |
| **2026-07-23** | `4.4.3` | 4.4 Patch | Normalization of odd-length SVG `strokeDasharray` | Manual `[5, 5]` array duplication |
| **2026-07-23** | `4.3.3` | 4.3 Patch | `react-native-worklets: 0.10.4` ABI pin | Version resolution monkey-patches |
| **2026-07-22** | `4.5.3` | 4.5 Patch | Re-parenting layout animation crash fix | Unmount-and-remount wrappers |
| **2026-07-16** | `4.5.2` | 4.5 Patch | Entering layout animation unmount race condition fix | `display: 'none'` unmount delays |
| **2026-07-04** | `4.3.2` | 4.3 Patch | Android `-fno-pch-timestamp` ccache optimization | Slow clean rebuild workarounds |
| **2026-07-03** | `4.4.2` | 4.4 Patch | Minified build CSS SVG property name preservation | Disabling minification on Web SVG |
| **2026-07-02** | `4.5.1` | 4.5 Patch | Pseudo-selector listener remount re-registration; recursive callback guard | Manual hover re-bind on tab focus |
| **2026-06-23** | `4.5.0` | 4.5 Minor | `SharedTransitionBoundary` scoped tags; iOS Core Animation offloading; `PlainStyle` deleted | Global shared element tag collision hacks |
| **2026-06-04** | `4.4.1` | 4.4 Patch | `mapperRun` multi-thread race condition fix | Single-thread mapper scheduling |
| **2026-05-26** | `4.4.0` | 4.4 Minor | Platform-backed iOS CSS Core Animation; `useTimestamp` hook | JS-driven style transition loops |
| **2026-05-07** | `4.3.1` | 4.3 Patch | Unistyles flattening regression fix; CSS transition detach revert | Manual style object merging |
| **2026-03-25** | `4.3.0` | 4.3 Minor | CSS SVG animations (Path morphing, Polyline); Fabric `measureSync()` | `requestAnimationFrame` measure polling |
| **2026-03-20** | `4.2.3` | 4.2 Patch | Android draw pass commit guard; worklet peer dep validator | Custom startup version assertions |
| **2026-03-20** | `4.1.7` | 4.1 Patch | Backported Android draw pass commit fix to 4.1 | Custom startup version assertions |
| **2026-02-17** | `4.2.2` | 4.2 Patch | Next.js SSR hydration error fix; sensor destructor assertion removed | `useEffect` hydration delays |
| **2025-12-22** | `3.19.5` | 3.19 Patch| CI release compatibility checks; clang formatting | Maintenance track |
| **2025-12-18** | `4.2.1` | 4.2 Patch | Nested `animatedProps` cleanup; native `processTransformOrigin` | Shallow props flattening |
| **2025-12-04** | `4.1.6` | 4.1 Patch | Worklets npm pin on 4.1 stable branch | Branch-specific dependency pins |
| **2025-12-04** | `4.2.0` | 4.2 Minor | Shared Element Transitions on Fabric; `FORCE_REACT_RENDER_FOR_SETTLED_ANIMATIONS` | Virtual DOM desync workarounds |
| **2025-11-25** | `3.18.2` | 3.18 Patch| Maintenance track fixes | Maintenance track |
| **2025-11-11** | `3.19.4` | 3.19 Patch| Android entering layout animation fix; SectionList `useAnimatedRef` | Custom SectionList ref shims |
| **2025-11-10** | `4.1.5` | 4.1 Patch | Web DOM detachment null guard | Manual `isMounted` checks on Web |
| **2025-11-10** | `4.1.4` | 4.1 Patch | Hermes `hermesvm` migration for RN 0.82+; Bridgeless assertion fix | Manual CMake linking overrides |
| **2025-11-07** | `3.18.1` | 3.18 Patch| C++20 requirement update | Maintenance track |
| **2025-10-13** | `3.19.3` | 3.19 Patch| Web `scrollTo` fix | Polyfill `window.scrollTo` |
| **2025-10-09** | `4.1.3` | 4.1 Patch | Guard uninitialized ref in `dispatchCommand`; Screen unfreeze re-bind | Screen focus reload hacks |
| **2025-10-07** | `3.19.2` | 3.19 Patch| Web LA `Easing.bezier` fix; null `__nativeTag` fix | Fallback linear easings on Web |
| **2025-09-24** | `4.1.2` | 4.1 Patch | 4.1 branch artifact stabilization | Maintenance track |
| **2025-09-24** | `4.1.1` | 4.1 Patch | C++ template bloat reduction; build time speedup | Long build timeouts in CI |
| **2025-08-29** | `4.1.0` | 4.1 Minor | 3.x to 4.x migration path stabilization | Legacy v3 upgrade guides |
| **2025-08-27** | `4.0.3` | 4.0 Patch | `__nativeTag` of null fix; complex prop CSS transition crash fix | Defensive null assertions in render |
| **2025-08-08** | `4.0.2` | 4.0 Patch | Web stylesheet keyframe cleanup; spring overshoot clamping fix | Manual stylesheet DOM cleanup |
| **2025-08-08** | `3.19.1` | 3.19 Patch| New Arch assertion check; C++ header fixes | Maintenance track |
| **2025-07-28** | `4.0.1` | 4.0 Patch | Android clean build linking fix; native view export cleanup | `./gradlew clean` workarounds |
| **2025-07-23** | `4.0.0` | 4.0 Major | **Generational Rupture**: `react-native-worklets` extracted; Bridge dead; `useScrollOffset` | `react-native-worklets-core` naming collisions |
| **2025-07-22** | `3.19.0` | 3.19 Minor| Bump to C++20 dialect | Dual-arch maintenance |
| **2025-05-29** | `3.18.0` | 3.18 Minor| Support React Native 0.80-rc.3; Jest snapshot fixes | Dual-arch maintenance |
| **2025-04-24** | `3.17.5` | 3.17 Patch| Numeric colors processing; multiple styles vector fix | Single style object flattening |
| **2025-04-16** | `3.17.4` | 3.17 Patch| macOS and tvOS dependency updates | Platform-specific build shims |
| **2025-04-08** | `3.17.3` | 3.17 Patch| Height prop typo in layout animations; edge-to-edge 1.1.7 | Manual layout dimension overrides |
| **2025-04-01** | `3.17.2` | 3.17 Patch| Reanimated 3 CI stabilization | Maintenance track |
| **2025-02-28** | `3.17.1` | 3.17 Patch| Support React 19 and RN 0.78 | React 19 peer dep overrides |
| **2025-02-24** | `3.17.0` | 3.17 Minor| Partial separation of Worklets from Reanimated | Early worklet separation experiments |
| **2025-01-13** | `3.16.7` | 3.16 Patch| RN 0.77 support; `V8EXECUTOR_LIB NOTFOUND` CMake fix | Manual CMake library path edits |
| **2025-01-08** | `3.16.6` | 3.16 Patch| Fabric layout animations initialization fix | Manual layout triggering |
| **2024-12-10** | `3.16.5` | 3.16 Patch| `findNodeHandler` refactor for Fabric shadow nodes | Custom native node resolvers |
| **2024-12-09** | `3.16.4` | 3.16 Patch| Brownfield app integration fix; tab navigator null checks | Custom tab transition listeners |
| **2024-11-26** | `3.16.3` | 3.16 Patch| Restored `jsxRuntime: classic` for NativeWind v4; get/set mocks | Babel runtime workarounds for NativeWind |
| **2024-11-20** | `3.16.2` | 3.16 Patch| `useSharedValue` get/set animation assignment fix | Manual `.value` setter wrapping |
| **2024-10-21** | `3.16.1` | 3.16 Patch| iOS `USE_FRAMEWORKS=static` build fix | CocoaPods static linking hacks |
| **2024-10-17** | `3.16.0` | 3.16 Minor| Support RN 0.76; React Compiler-safe mutable API | Pre-React 19 baseline |
