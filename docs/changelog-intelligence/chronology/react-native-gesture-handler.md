---
title: "React Native Gesture Handler — Reverse-Chronological Audit"
package: "react-native-gesture-handler"
latest_stable: "3.3.0"
_generated_at: "2026-09-26T13:30:52Z"
_shard_hash: "d2847b827975"
audit_vector: "present → past (3.3.0 ➔ oldest)"
source: "TCDI Chronos Archive + Grok/Chronos signals"
---

# React Native Gesture Handler — Reverse-Chronological Audit Ledger

> **Audit vector**: Present ➔ Past. Starts at **3.3.0** (latest stable as of ingest, September 2026) and walks backward without skipping any minor or patch.
>
> **Coverage**: 76 versions
>
> **6-State kernel**: REMOVED | DEPRECATED | BROKEN | FUNCTIONAL | NEW | EXPERIMENTAL

---

---

## 📅 2026-09-11 — `v3.3.0` 🟢 **LATEST STABLE**

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@3.3.0                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ React Native Modal touch context disconnection on... │
│ NEW          │ Stabler button touch cancellation on fast scroll     │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (12 changes)

**🐛 FIX** (12)
- Keep ReanimatedSwipeable native handlers stable when event callbacks change — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.3.0)
- Forward press handlers as testOnly_ in PressableWithTouchable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.3.0)
- Pass reanimatedEventHandler only when the Reanimated detector is used — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.3.0)
- [Android] Fix buttons firing press events when a scroll takes over the touch — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.3.0)
- [Android] Fix native handlers attaching to a nested button instead of the detector's child — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.3.0)
- Fix ReanimatedDrawerLayout animation speed after rerender — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.3.0)
- Fix dead presses in "never" mode when the keyboard belongs to a native field — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.3.0)
- Don't pass dependencies to Reanimated hooks on native — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.3.0)
- [Web] Activate ScrollView's native gesture on real scroll instead of pointer distance — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.3.0)
- [iOS] Detach handlers when the detector view is recycled — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.3.0)
- Forward borderless and foreground from android_ripple — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.3.0)
- [Android] Don't let an awaiting parent handler cancel the child it is waiting for — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.3.0)

### 3. Active Signals (4 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** v3 SIGABRT: Yoga assert on `RNGestureHandlerDetectorShadowNode` *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/4241)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/3.3.0`
```

---

## 📅 2026-08-14 — `v3.2.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@3.2.1                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ React Native Modal touch context disconnection on... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (3 changes)

**🐛 FIX** (3)
- Forward press handlers as testOnly_ in PressableWithTouchable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.1)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.1)
- Update Pressable props — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.1)

### 3. Active Signals (4 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** v3 SIGABRT: Yoga assert on `RNGestureHandlerDetectorShadowNode` *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/4241)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/3.2.1`
```

---

## 📅 2026-08-13 — `v3.2.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@3.2.0                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ React Native Modal touch context disconnection on... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (24 changes)

**📌 FEATURE** (12)
- feat: Adopt AGP v9 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- Implement Pressable based on Touchable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- [Android] Add hover callbacks to Touchable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- [iOS] Add hover callbacks to Touchable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- [Web] Add hover callbacks to Touchable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- [Web] Refactor Touchable not to rely on GestureDetector — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- [iOS] Refactor Touchable not to rely on GestureDetector — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- [Android] Refactor Touchable not to rely on GestureDetector — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- Fix fatal crash Cannot read property 'translationX' of undefined when a touch event is ser — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- [Android] Skip the underlay drawable when it can never be visible — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- [Android] Apply the button's managed handler config once per prop transaction — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)

**🐛 FIX** (12)
- [Android] Guard update events to only be dispatched in ACTIVE state — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- Pass empty callbacks to UI when runOnJS is true — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- [Web] Fix incorrectly calculated timeDelta — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- [Web] Fix incorrect Tap offset — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- Fix minVelocity props behavior — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- [Android] Fix minDistance being reset by partial config updates — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- Move Interceptor on ScrollView, not its content — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- [iOS] Re-sync layer opacity and transform from retained props when recycling buttons — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- [Android] Properly handle requestDisallowInterceptTouchEvent for v3 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- Fix Touchable not respecting keyboardShouldPersistTaps="handled" — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- [macOS] Fix touch events never being delivered — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)
- fix: crash when mount listener fires after GestureDetector unmount — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.2.0)

### 3. Active Signals (4 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** v3 SIGABRT: Yoga assert on `RNGestureHandlerDetectorShadowNode` *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/4241)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/3.2.0`
```

---

## 📅 2026-07-17 — `v3.1.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@3.1.0                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ React Native Modal touch context disconnection on... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (18 changes)

**📌 FEATURE** (6)
- Fix handling keyboard should persists taps — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.1.0)
- [Android] Handle hover in Touchable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.1.0)
- [apple] Handle hover in Touchable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.1.0)
- [Native] Add delaysChildPressedState to native gesture — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.1.0)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.1.0)
- [General] Don't use context from useHandler — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.1.0)

**🐛 FIX** (12)
- [Android] Fix text getting selected during gestures — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.1.0)
- [iOS] Move Tap cancelation to dispatch_after — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.1.0)
- [Web] Do not detach gestures from other detectors — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.1.0)
- [Android] Fix ConcurrentModificationException in GestureHandlerOrchestrator — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.1.0)
- fix: remove UIPointerInteraction from the view when unbinding the hover handler — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.1.0)
- Do not call onPress on buttons while dismissing keyboard — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.1.0)
- fix(android): guard null Handler in ButtonViewGroup press animations — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.1.0)
- Don't block JS responder in RootHelper — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.1.0)
- [iOS] Fix js responder cancelation in modals — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.1.0)
- Fix updating SharedValue crash — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.1.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.1.0)
- [Docs] Update compatibility tables — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.1.0)

### 3. Active Signals (4 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** v3 SIGABRT: Yoga assert on `RNGestureHandlerDetectorShadowNode` *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/4241)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/3.1.0`
```

---

## 📅 2026-06-18 — `v3.0.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@3.0.2                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ React Native Modal touch context disconnection on... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (14 changes)

**🐛 FIX** (12)
- fix(Android): apply numberOfPointers config to the pointer requirement in LongPressGesture — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.2)
- [iOS] Fix hooks API not cancelling JS Responder — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.2)
- [Android] Make detector aware of child transform — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.2)
- [Native] Fix native GestureDetector zIndex handling — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.2)
- [Android] Fix mouse interactions — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.2)
- [Android | Web] Disable pointer events on hidden Swipeable actions container — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.2)
- Remove opacity from Swipeable action panels — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.2)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.2)
- [Android] Do not set explicit versions in build.gradle — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.2)
- [General] Ignore testID property in production environments — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.2)
- Ignore the .rnrepo-cache directory within the Metro config — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.2)
- [Docs] Add dynamic topbar banner — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.2)

**📌 FEATURE** (2)
- @prashanFOMO made their first contribution in https://github.com/software-mansion/react-na — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.2)
- @jamesacklin made their first contribution in https://github.com/software-mansion/react-na — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.2)

### 3. Active Signals (4 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** v3 SIGABRT: Yoga assert on `RNGestureHandlerDetectorShadowNode` *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/4241)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/3.0.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** RNGH `2.33.0` + RN `0.87` (2.x line)
  - [source](`packages/react-native-gesture-handler/majors/2/minors/33/patches/0.md`)
✅ **GOOD** RNGH `3.0.1` + RN `0.86`
  - [source](`packages/react-native-gesture-handler/majors/3/minors/0/patches/1.md`)

---

## 📅 2026-06-10 — `v3.0.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@3.0.1                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ React Native Modal touch context disconnection on... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (24 changes)

**📌 FEATURE** (12)
- Support React Native 0.86 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- Fix Android Pressable crash with Reanimated animations — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- Remove dispatchesReanimatedEvent from initial config — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- [tvOS] Fix build error — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- [Android] Fix crash with RN Screens FormSheet — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- [iOS] Remove unused old-arch import to fix build with React Native 0.87-nightly — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- [Android] Improve TalkBack support — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- [tvOS] Fix unpressable buttons — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- Add rootContainerStyle prop to ReanimatedDrawerLayout — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- @sorinc03 made their first contribution in https://github.com/software-mansion/react-nativ — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- @kitten made their first contribution in https://github.com/software-mansion/react-native- — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)

**🐛 FIX** (12)
- [Web] Fix wrong coordinate space — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- [Android] Fix hover events recording gestures other than HoverGestureHandler — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- [Android] Fix wrong reported number of pointers — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- Use v3 detectors in ReanimatedDrawerLayout — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- Fix gesture relations after freeze — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- Add more complex transformations example — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- Update banners in readme — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- Update readme banner links — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- [Docs] Small documentation fixes — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- Update examples — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)
- [iOS] Remove unused detector method — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.1)

### 3. Active Signals (4 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** v3 SIGABRT: Yoga assert on `RNGestureHandlerDetectorShadowNode` *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/4241)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/3.0.1`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** RNGH `2.33.0` + RN `0.87` (2.x line)
  - [source](`packages/react-native-gesture-handler/majors/2/minors/33/patches/0.md`)
✅ **GOOD** RNGH `3.0.1` + RN `0.86`
  - [source](`packages/react-native-gesture-handler/majors/3/minors/0/patches/1.md`)

---

## 📅 2026-05-28 — `v3.0.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@3.0.0                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ React Native Modal touch context disconnection on... │
│ NEW          │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (12 changes)

**📌 FEATURE** (12)
- Update how Gesture Handler exposes setGestureState to the Reanimated UI runtime — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.0)
- Simplify Android event builders — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.0)
- Remove actions testing build for the old architecture — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.0)
- Implement base for a native detector component — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.0)
- NativeDetector <-> Reanimated integration — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.0)
- Remove onChange callback references — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.0)
- Handle Animated.Event in onUpdate callback — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.0)
- Fix onUpdate crash — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.0)
- Remove AnimatedEvent action type from NativeDetector — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.0)
- Automatically assign dispatchesAnimatedEvents — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.0)
- Remove dispatchesAnimatedEvents from the native detector — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.0)
- Adapt NativeViewGestureHandler to NativeDetector — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v3.0.0)

### 3. Active Signals (4 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** v3 SIGABRT: Yoga assert on `RNGestureHandlerDetectorShadowNode` *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/4241)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/3.0.0`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** RNGH `2.33.0` + RN `0.87` (2.x line)
  - [source](`packages/react-native-gesture-handler/majors/2/minors/33/patches/0.md`)
✅ **GOOD** RNGH `3.0.1` + RN `0.86`
  - [source](`packages/react-native-gesture-handler/majors/3/minors/0/patches/1.md`)

---

## 📅 2026-09-14 — `v2.33.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.33.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (15 changes)

**📌 FEATURE** (3)
- Support React Native 0.87 on 2.x — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.33.0)
- feat: Adopt AGP v9 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.33.0)
- Fix fatal crash Cannot read property 'translationX' of undefined when a touch event is ser — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.33.0)

**🐛 FIX** (12)
- [Android | Web] Disable pointer events on hidden Swipeable actions container — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.33.0)
- [Android] Fix mouse interactions — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.33.0)
- fix: crash when mount listener fires after GestureDetector unmount — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.33.0)
- Remove opacity from Swipeable action panels — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.33.0)
- [Android] Fix text getting selected during gestures — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.33.0)
- [Android] Fix ConcurrentModificationException in GestureHandlerOrchestrator — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.33.0)
- [iOS] Move Tap cancelation to dispatch_after — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.33.0)
- fix: remove UIPointerInteraction from the view when unbinding the hover handler — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.33.0)
- [iOS] Fix js responder cancelation in modals — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.33.0)
- [iOS] Fix gesture callback guarantees when view is detached mid-gesture — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.33.0)
- Fix minVelocity props behavior — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.33.0)
- [Web] Fix incorrectly calculated timeDelta — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.33.0)

### 3. Active Signals (3 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.33.0`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** RNGH `2.33.0` + RN `0.87` (2.x line)
  - [source](`packages/react-native-gesture-handler/majors/2/minors/33/patches/0.md`)

---

## 📅 2026-06-11 — `v2.32.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.32.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (16 changes)

**📌 FEATURE** (4)
- [Android] Remove getChildInDrawingOrderAtIndex — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.32.0)
- Support React Native 0.86 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.32.0)
- Fix RNRenderer import for React Native 0.86+ — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.32.0)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.32.0)

**🐛 FIX** (12)
- [iOS] Fix duplicated testID — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.32.0)
- [Android] Fix discrete gestures not triggering onFinalize — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.32.0)
- [Android] Fix wrong reported number of pointers — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.32.0)
- [iOS] Fix handler retrieval and mismatched coordinate space — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.32.0)
- [iOS] Don't iterate to root while resolving recognizer — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.32.0)
- fix(Android): apply numberOfPointers config to the pointer requirement in LongPressGesture — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.32.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.32.0)
- Remove old arch CI — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.32.0)
- fix(pods): Fix invalid react-native/../react-native resolution for aliases — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.32.0)
- Move ruby utils to module — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.32.0)
- Bump expo to stable 56 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.32.0)
- [macOS] Bump example app — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.32.0)

### 3. Active Signals (3 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.32.0`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** RNGH `2.32.0` + RN `0.86` (incl. RNRenderer import fix)
  - n/a (prior builds could fail RNRenderer import on 0.86+ — fixed in this release)
  - [source](`packages/react-native-gesture-handler/majors/2/minors/32/patches/0.md`)

---

## 📅 2026-05-04 — `v2.31.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.31.2                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (6 changes)

**🐛 FIX** (6)
- [Android] Fix TalkBack on Pressable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.2)
- [Web] Fix Pinch and Rotation — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.2)
- [Android] Correct Rotation handler — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.2)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.2)
- Do not check for worklets if babel plugin was not used — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.2)
- SwipeableProps from RefObject to Ref — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.2)

### 3. Active Signals (3 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.31.2`
```

---

## 📅 2026-04-09 — `v2.31.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.31.1                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (5 changes)

**📌 FEATURE** (5)
- Support React Native 0.85 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.1)
- [tvOS] Fix build error — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.1)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.1)
- Fix failing Jest CI — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.1)
- Fix Touchables typescript errors — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.1)

### 3. Active Signals (3 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.31.1`
```

---

## 📅 2026-04-02 — `v2.31.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.31.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ AGP v9 & Android Multi-Pointer Move Tracking         │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (24 changes)

**📌 FEATURE** (12)
- [Android] Check all pointers in move events — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- Fix GestureDetector unresponsive after display:none toggle (New Arch) — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- fix(ios): guard +load with #ifdef RCT_DYNAMIC_FRAMEWORKS — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- fix(android): compile RNGestureHandlerModule with Kotlin 2.3 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- fix(iOS): handles pointerEvents for Pressable component — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- fix(android): handles pointerEvents for Pressable component — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- Change handler reference to weak pointer to prevent memleaks — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- [Android] Clear blocking relations on drop — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- [iOS] Distinguish between mouse and stylus when hovering — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- [iOS] Handle FullWindowOverlay as the native root — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- Memoize Text component — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)

**🐛 FIX** (12)
- Mocks: fix button content missing — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- [iOS] Add wrapper for handleGesture:fromReset: — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- [iOS] Fix wrong pointerType in Hover gesture — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- [iOS] Fix missing onFinalize callback in Tap — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- Move @types/react-test-renderer to dependencies — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- Enable exactOptionalPropertyTypes support — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- [docs] Add sorn25 banner to readme — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- [docs] Remove sorn25 banner from readme — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- Update the script responsible for updating the package version — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- [General] Update existing events tests — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)
- Update release flow to be more robust — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.31.0)

### 3. Active Signals (3 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.31.0`
```

---

## 📅 2026-03-27 — `v2.30.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.30.1                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards

_No leaf data in archive for this patch._

### 3. Active Signals (3 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.30.1`
```

---

## 📅 2025-12-19 — `v2.30.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.30.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (17 changes)

**🐛 FIX** (12)
- [iOS] Fix pan not triggering onFinalize when blocked — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.30.0)
- [iOS] Fix onFinalize callbacks on iOS 26 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.30.0)
- Fixing number of touches becoming 0 issue for pan gestures in apple track pad — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.30.0)
- [iOS] Fix manual activation crash — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.30.0)
- [Web] Fix press out — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.30.0)
- [android] fixed experimental pointers breaking after pan — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.30.0)
- [android] fix scroll actions interpreted as touch — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.30.0)
- ReanimatedDrawerLayout: fix buttons not receiving onPress — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.30.0)
- Fix memory leak in ReanimatedSwipeable on programmatic close — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.30.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.30.0)
- [General] Throw when no gesture is passed to the GestureDetector — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.30.0)
- Support react-native 0.83 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.30.0)

**📌 FEATURE** (5)
- @kulak91 made their first contribution in https://github.com/software-mansion/react-native — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.30.0)
- @a1isaeed made their first contribution in https://github.com/software-mansion/react-nativ — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.30.0)
- @rmarquois made their first contribution in https://github.com/software-mansion/react-nati — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.30.0)
- @kosmydel made their first contribution in https://github.com/software-mansion/react-nativ — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.30.0)
- @DImuthuUpe made their first contribution in https://github.com/software-mansion/react-nat — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.30.0)

### 3. Active Signals (3 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.30.0`
```

---

## 📅 2025-11-03 — `v2.29.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.29.1                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- [android] fix ripple effect after https://github.com/software-mansion/react-native-gesture — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/v2.29.1)

### 3. Active Signals (3 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.29.1`
```

---

## 📅 2025-10-22 — `v2.29.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.29.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (19 changes)

**📌 FEATURE** (7)
- [iOS] Fix gestures not ending properly on iOS 26 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.29.0)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.29.0)
- Bump react-native-builder-bob — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.29.0)
- [Android] build.gradle cleanup — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.29.0)
- @christianbach made their first contribution in https://github.com/software-mansion/react- — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.29.0)
- @Maschga made their first contribution in https://github.com/software-mansion/react-native — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.29.0)
- @hannojg made their first contribution in https://github.com/software-mansion/react-native — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.29.0)

**🐛 FIX** (12)
- Fix grabbing delegate in setPressed — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.29.0)
- [iOS] Fix gestures on iOS 26 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.29.0)
- fix: ensure SwipeDirection is imported as a value in ReanimatedSwipeable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.29.0)
- Fix: exclude libfbjni.so — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.29.0)
- fix: gesture not activating due to outdated handler tag — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.29.0)
- Fix Pressable's onPress being called on cancellation — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.29.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.29.0)
- Add workflow for releases — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.29.0)
- Add working directory to publish workflow — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.29.0)
- Fix Fling tsdoc — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.29.0)
- Bump node on CI — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.29.0)
- Rename argument ev to event — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.29.0)

### 3. Active Signals (3 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.29.0`
```

---

## 📅 2025-08-06 — `v2.28.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.28.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (17 changes)

**📌 FEATURE** (5)
- Support react-native 0.81 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.28.0)
- Deprecate gestureHandlerRootHOC — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.28.0)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.28.0)
- Update link in the error message — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.28.0)
- @hqwlkj made their first contribution in https://github.com/software-mansion/react-native- — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.28.0)

**🐛 FIX** (12)
- [Web] fixed texinput submition when inside pressable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.28.0)
- [Web] Fix bottom hitslop — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.28.0)
- [Web] fixed repeated listener registration — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.28.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.28.0)
- [Android] Revert "fix: turn off build IDs for reproducibility (#3602)" — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.28.0)
- docs: update reanimated_swipeable.md — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.28.0)
- docs: update swipeable.md — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.28.0)
- docs: update reanimated-drawer-layout.mdx — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.28.0)
- docs: update touchables.md — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.28.0)
- docs: update pressable.mdx — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.28.0)
- docs: update drawer-layout.mdx — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.28.0)
- Fix link to the example app in the documentation — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.28.0)

### 3. Active Signals (3 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.28.0`
```

---

## 📅 2025-07-21 — `v2.27.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.27.2                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (19 changes)

**📌 FEATURE** (9)
- [Android] Use asReversed instead of reversed — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.2)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.2)
- Cleanup ReanimatedSwipeable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.2)
- fix: turn off build IDs for reproducibility — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.2)
- Fix Pressable requiring dimensionsAfterResize — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.2)
- [docs] Add info about using focal / anchor points — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.2)
- [jest] Fixing enabled prop in buttons — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.2)
- @Rexogamer made their first contribution in https://github.com/software-mansion/react-nati — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.2)
- @akwasniewski made their first contribution in https://github.com/software-mansion/react-n — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.2)

**🐛 FIX** (10)
- [iOS] Fix GestureDetector on Text — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.2)
- [Android] Fix onTouches callbacks being called for all gestures — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.2)
- Fix Pressable onPress callback not working — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.2)
- Dropping handlers when components are dropped — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.2)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.2)
- Update ReanimatedSwipeable module path — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.2)
- Automatically commit generated schema files — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.2)
- Fix combo example crashing. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.2)
- docs: add Radon IDE banner to TOCItems — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.2)
- Make dev client default when starting expo-example — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.2)

### 3. Active Signals (3 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.27.2`
```

---

## 📅 2025-07-01 — `v2.27.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.27.1                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Fixed /lib missing in the 2.27.0 npm release — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.1)

### 3. Active Signals (3 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.27.1`
```

---

## 📅 2025-07-01 — `v2.27.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.27.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ RNGH `Pressable` stops working (`isTouchPropagati... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ Pressable Touch Responder Stabilization              │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (14 changes)

**📌 FEATURE** (3)
- Complete Pressable refactor. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.0)
- Deprecate ForceTouch gesture — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.0)
- @billouboq made their first contribution in https://github.com/software-mansion/react-nati — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.0)

**🐛 FIX** (11)
- Copy README.md to package — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.0)
- Fix possible web crashes — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.0)
- [Web] Make PointerTracker elements nullable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.0)
- [Android] Cleanup CMakeLists — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.0)
- Update compatibility table — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.0)
- Update version compatibility table in the documentation — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.0)
- Don't call needs-repro CI on comments — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.0)
- [Web] Extract coords assignment into helper functions — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.0)
- docs: Fix testimonial profile picture link — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.0)
- Fix state transition flowchart docs — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.27.0)

### 3. Active Signals (3 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.27.0`
```

---

## 📅 2025-06-13 — `v2.26.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.26.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ Pressable Touch Responder Stabilization, RNGH `Pr... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (18 changes)

**📌 FEATURE** (6)
- Support react-native 0.80 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.26.0)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.26.0)
- [iOS] Avoid unnecessary string allocations — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.26.0)
- Add relation props to Pressable and ReanimatedSwipeable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.26.0)
- [Android] Update build tools — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.26.0)
- @lukmccall made their first contribution in https://github.com/software-mansion/react-nati — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.26.0)

**🐛 FIX** (12)
- fix: use providers.exec to enable configuration-cache — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.26.0)
- Don't block onPress if onLongPress is not defined — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.26.0)
- Fix onSwipeableWillClose called on opening of ReanimatedSwipeable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.26.0)
- Fix buttons getting stuck in scroll views during overscroll — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.26.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.26.0)
- [Monorepo] Migrate to monorepo — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.26.0)
- Upgrade react-native-builder-bob — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.26.0)
- Update how handler configuration is handled on Android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.26.0)
- Refactor RNGestureHandlerModule on android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.26.0)
- Make base GestureHandler on Android non generic — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.26.0)
- Update usage of types from React Native to make them compatible with Strict API — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.26.0)
- Update common example not to disable E2E — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.26.0)

### 3. Active Signals (3 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.26.0`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** RNGH `2.26.0` + RN `0.80`; `2.28.0` + RN `0.81`; `2.30.0` + RN `0.83`; `2.31.1` + RN `0.85`
  - [source](corresponding `packages/react-native-gesture-handler/majors/2/minors/{26,28,30,31}/patches/*.md`)

---

## 📅 2025-03-31 — `v2.25.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.25.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ Pressable Touch Responder Stabilization, RNGH `Pr... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (18 changes)

**📌 FEATURE** (6)
- Add react-native-svg interface — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.25.0)
- Assign new handlerTag each time handler is created — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.25.0)
- [Android] Suppress UIManagerType error — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.25.0)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.25.0)
- Set default accessible prop on Pressable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.25.0)
- Wrap Pressable with forwardRef — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.25.0)

**🐛 FIX** (12)
- Fix: onPress callbacks are invoked for all nested Pressables — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.25.0)
- [iOS] Pass accessibility props to button view — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.25.0)
- [iOS] Fix activeOpacity in BorderlessButton — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.25.0)
- Fix: race condition on attachedGestures in updateHandlers — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.25.0)
- [Android] Handle hover events in RNGestureHandlerRootHelper — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.25.0)
- [Web] Change shouldBeCancelledByOther to respect blocksExternalGesture — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.25.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.25.0)
- Update versions in compatibility tables — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.25.0)
- Bump react-native-reanimated — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.25.0)
- Bump actions on CI — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.25.0)
- [macOS] Re-generate locks — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.25.0)
- Migrate to Yarn 4 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.25.0)

### 3. Active Signals (3 known issues at this version)

- **[HIGH]** RNGH `Pressable` stops working (`isTouchPropagationAllowed` stuck false) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.25.0`
```

### 5. Cross-Dependency Compat (relevant combos)

💥 **BROKE** RNGH `2.25.0` + `react-native` (Signal S1)
  - RNGH Pressable stops working because isTouchPropagationAllowed is stuck false
  - [source](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)

---

## 📅 2025-02-20 — `v2.24.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.24.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (13 changes)

**📌 FEATURE** (6)
- Support React Native 0.78 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.24.0)
- [Android] Add missing paper files — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.24.0)
- [Android] Add support for 16KB page size. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.24.0)
- Fix Reanimated crashes in ReanimatedDrawerLayout — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.24.0)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.24.0)
- Add animationSpeed to ReanimatedDrawerLayout — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.24.0)

**🐛 FIX** (7)
- [Web] Handle SVG wrapped with createAnimatedComponent — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.24.0)
- Add hitSlop into childProps in createNativeWrapper — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.24.0)
- [Web] Fix Text with Touchables — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.24.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.24.0)
- [docs] Update team — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.24.0)
- Bump to 0.78 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.24.0)
- Bump serialize-javascript from 6.0.1 to 6.0.2 in /e2e/web-tests — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.24.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.24.0`
```

---

## 📅 2025-02-11 — `v2.23.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.23.1                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (6 changes)

**📌 FEATURE** (3)
- [iOS] Add FabricComponents to Podfile — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.1)
- @DomiR made their first contribution in https://github.com/software-mansion/react-native-g — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.1)
- @jcolicchio made their first contribution in https://github.com/software-mansion/react-nat — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.1)

**🐛 FIX** (3)
- Return false if gesture recognizers are present but all disabled — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.1)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.1)
- chore(docs): add actionable advice to deprecation warnings — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.1)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.23.1`
```

---

## 📅 2025-02-05 — `v2.23.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.23.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (24 changes)

**📌 FEATURE** (12)
- Deprecate old API — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- Deprecate DrawerLayout — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- Deprecate Touchable components — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- feat: Add simultaneousWithExternalGesture to ReanimatedSwipable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- exports PressableStateCallbackType — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- Add testing-library compatibility props — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- Make blocksGesture symmetric on native iOS — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- @puls made their first contribution in https://github.com/software-mansion/react-native-ge — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- @MrSltun made their first contribution in https://github.com/software-mansion/react-native — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- @juliendevleeschauwer made their first contribution in https://github.com/software-mansion — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- @sidferreira made their first contribution in https://github.com/software-mansion/react-na — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)

**🐛 FIX** (12)
- Fix circular dependency — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- [Web] Register/unregister listeners when enabled changes — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- Replace Text with RN component when callbacks are not specified — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- Don’t pass gesture handler wrapper props to child — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- Fix backgroundColor not being applied to RNGestureHandlerButton — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- Fix android ripple color bug on fabric — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- Unregister from oldGestureHandler when component unmounts — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- fix: overlapping buttons cause buttons to stop being responsive — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- [Web] Make findNodeHandle correctly handle FlatList in old API — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- Remove view flattening error for Text component — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- Fix swipeable overlap bug — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)
- Fix Swipeable misalignment after resizing on web — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.23.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.23.0`
```

---

## 📅 2025-01-23 — `v2.22.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.22.1                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (5 changes)

**🐛 FIX** (5)
- Fix swipeable overlap bug by @latekvo in — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.1)
- Fix Swipeable misalignment after resizing on web by @latekvo in — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.1)
- Don’t pass gesture handler wrapper props to child by @oblador in — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.1)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.1)
- Bump Fabric example to 0.77.0 by @m-bert in — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.1)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.22.1`
```

---

## 📅 2025-01-10 — `v2.22.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.22.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (24 changes)

**📌 FEATURE** (12)
- [Android] Include missing Gesture Handler in builds — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- Add Text component — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- Support React Native 0.77 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- [iOS] Check if handler was dropped before reattaching — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- Mark legacy web implementation as deprecated — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- [Android] Change onTouchEvent to dispatchTouchEvent in NativeViewGestureHandler — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- Update the generated specs for the old architecture to work on 0.77 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- [Android] Add ScrollViewHook to ReactHorizontalScrollView components — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- Replace references with examples in docs — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- [Web] Remove unnecessary overrides — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- Make stylusData property of the GestureUpdateEvent optional — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)

**🐛 FIX** (12)
- [Web] Add onPointerOutOfBounds to LongPress gesture handler — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- Fix transform on GestureHandlerButton on Android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- Prevent child gestures from activating when a parent gesture is already active — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- Fix relations not working when one of the child dependencies remounts without a render in — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- Fix: Pressable regular border radius rendering on iOS on old arch — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- Fix: cancelled events are not ended when manualActivation is used — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- Fix: onPressIn and onPressOut are triggered at the same time on Android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- Fix: debug build for tests — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- Revert "Fix gestures being able to activate despite their parent already being active" — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- Bump FabricExample to 0.77.0-rc.6 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)
- [CI] Set Xcode version to 16.1 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.22.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.22.0`
```

---

## 📅 2024-11-19 — `v2.21.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.21.2                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards

_No leaf data in archive for this patch._

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.21.2`
```

---

## 📅 2024-11-18 — `v2.21.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.21.1                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**📌 FEATURE** (2)
- fix: missing ReanimatedDrawerLayout — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.1)
- @r0b0t3d made their first contribution in https://github.com/software-mansion/react-native — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.1)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.21.1`
```

---

## 📅 2024-11-14 — `v2.21.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.21.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (24 changes)

**📌 FEATURE** (12)
- Create ReanimatedDrawerLayout component — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- fix(web): broken at dropping — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- [Web] Remove findNodeHandle function. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- [web] Add support for two finger pan — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- [Web] Adjust findNodeHandle to properly detect SVG — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- [Web] Fix KeyboardEventManager listeners unmount — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- feat: Clangd support — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- [Web] Simplify PointerTracker methods — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- Allow Android Rotation Gesture to continue after second Pointer Lift and Land — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- Optimise ReanimatedSwipeable component — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- [Web] Remove collapsable property — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)

**🐛 FIX** (12)
- [Android] Fix gestures being able to activate despite their parent already being active — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- [MacOS] Fix Pressable being unresponsive — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- Fix swipeable swiping to left when no renderRightActions is set — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- Fix onStart callbacks of ReanimatedSwipeable being called every update — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- Fix elements dissapearing due to high values set to threshold props in ReanimatedSwipeable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- [ReanimatedSwipeable] Multiple bug fixes and improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- stylusData documentation. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- Update examples — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- Make osx example utilise the common example app — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- [docs] Improve Reanimated Swipeable documentation. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)
- [MacOS] fix header in the example app to look like the one on web. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.21.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.21.0`
```

---

## 📅 2024-10-24 — `v2.20.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.20.2                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (7 changes)

**📌 FEATURE** (7)
- [macOS] Fix build on fabric (https://github.com/software-mansion/react-native-gesture-hand — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.2)
- Fixes Android event dispatcher for old arch (https://github.com/software-mansion/react-nat — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.2)
- [macOS] Fix build on old architecture (https://github.com/software-mansion/react-native-ge — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.2)
- Fix tvOS build (https://github.com/software-mansion/react-native-gesture-handler/pull/3180 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.2)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.2)
- Bump FabricExample to RN 0.76 (https://github.com/software-mansion/react-native-gesture-ha — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.2)
- @renchap made their first contribution in https://github.com/software-mansion/react-nativ — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.2)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.20.2`
```

---

## 📅 2024-10-22 — `v2.20.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.20.1                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (4 changes)

**📌 FEATURE** (4)
- fix: Android event dispatcher change for 0.76.0-rc.6 ([#3166](https://github.com/software- — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.1)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.1)
- Update Podfile.lock in FabricExample ([#3174](https://github.com/software-mansion/react-na — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.1)
- @mysport12 made their first contribution in https://github.com/software-mansion/react-nat — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.1)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.20.1`
```

---

## 📅 2024-09-25 — `v2.20.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.20.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (22 changes)

**📌 FEATURE** (10)
- Add support for React Native 0.76 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- [Web] Stylus support — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- [Android] Stylus support — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- [iOS] Stylus support — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- Use node resolver to locate React Native package — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- [Web] Remove TouchEventManager — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- chore: Remove unused env variable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- @tjzel made their first contribution in https://github.com/software-mansion/react-native-g — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- @kacperzolkiewski made their first contribution in https://github.com/software-mansion/rea — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)

**🐛 FIX** (12)
- [tvOS] Fix tvOS not building because of LongPressGestureHandler — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- Fix Pressable styling by removing unnecessary wrapping View — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- [iOS] Prevent crash when setting cursor style — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- [Android] Fix border styles for touchable components with transparent background color — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- Fix FlatList type — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- [macOS] Fix rotation — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- [Jest] Don't fire callbacks on disabled gestures — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- Call getEventDispatcher in ReactContextExtensions.kt — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- Fix duplicate libreactnative.so and libjsi.so — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- [Web] Remove hovering pointer from tracker. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- Fix button padding not being applied correctly on the new arch — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.20.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.20.0`
```

---

## 📅 2024-09-02 — `v2.19.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.19.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (22 changes)

**📌 FEATURE** (10)
- [macOS] Add ManualGestureHandler — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- [macOS] Add LongPressGestureHandler — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- [macOS] Add HoverGestureHandler — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- [macOS] Add FlingGestureHandler — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- [web] Add keyboard support to gesture handler — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- Unify Vector-related constant naming scheme across Web and Android implementations — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- Add numberOfPointers to LongPress — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- feat: add load method — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- [Android] Drop support for AGP version <= 7 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)

**🐛 FIX** (12)
- Fix Pressable not inferring dimensions from it's children — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- Fix scroll view handler state change events — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- Fix failing macOS build — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- [web] Fix scale — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- Fix Pressable props export — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- [Web] Reset web-exclusive properties when handler is disabled. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- Fix Pressables's interference with other gestures when nested — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- [ReanimatedSwipeable] Create separate spring configs to avoid overwriting ones already bei — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- Forward unused props in ReanimatedSwipeable and Pressable to their inner components — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- [Android] Fix Hover blocking scrolling with mouse wheel — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- [jest] Fix enabled prop in buttons. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)
- [web] Fix NativeViewGestureHandler style. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.19.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.19.0`
```

---

## 📅 2024-08-01 — `v2.18.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.18.1                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (7 changes)

**🐛 FIX** (1)
- Fix build on RN 0.74 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.1)

**📌 FEATURE** (6)
- Bump ws from 6.2.2 to 6.2.3 in /example — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.1)
- Bump requirejs from 2.3.6 to 2.3.7 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.1)
- Bump fast-xml-parser from 4.2.5 to 4.4.1 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.1)
- Bump ws from 6.2.2 to 6.2.3 in /docs — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.1)
- Add documentation page for Pressable component — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.1)
- Add docs page for Reanimated Swipeable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.1)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.18.1`
```

---

## 📅 2024-07-30 — `v2.18.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.18.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ ReanimatedSwipeable Dedicated UI Component           │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (22 changes)

**📌 FEATURE** (10)
- Create a separate component out of the new Swipeable row — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- Create gesturized pressable component https://github.com/software-mansion/react-native-ges — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- Support for React Native 0.75 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- [macOS] Add ForceTouch warning — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- Remove shared value read on the JS thread during detector update — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- Use a newer constructor for all Gesture Handler events on Android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- Persist rotation and pinch gesture through pointer changes on android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- [macOS] Add NativeViewGestureHandler — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- Add enabled prop support to swipeable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)

**🐛 FIX** (12)
- Make handler comparator work only on non-null objects — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- fix: bind scope to null to prevent issues with inline requires — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- Replace queueMicrotask with requestAnimationFrame — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- Resolve circular dependencies on JS side — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- Fix Android native buttons emitting 2 press events when talkback is enabled — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- Fix ScrollView intercepting touches through out-of-bounds children — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- Change onPress argument in buttons — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- [macOS] Fix handlers not responding after opening context menu — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- [iOS | macOS] Fix translation calculation in LongPress — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- Fix cancelling manual activation gestures blocking interactivity on iOS — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)
- Bump ws from 6.2.2 to 6.2.3 in /FabricExample — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.18.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.18.0`
```

---

## 📅 2024-06-21 — `v2.17.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.17.1                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Don't register checkIntegrityBetweenArchitectures task when installed as a dependency by @ — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.1)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.17.1`
```

---

## 📅 2024-06-19 — `v2.17.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.17.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (20 changes)

**📌 FEATURE** (8)
- Add ref property to Buttons — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)
- Unify touch events callbacks on web with respect to Android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)
- Add touchType to TouchEvent — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)
- Refactor GestureDetector — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)
- Remove lodash — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)
- PointerTracker refactor. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)
- Change offsetX and offsetY calculations in PointerEventManager — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)

**🐛 FIX** (12)
- Make RootViewGestureHandler handler cancel awaiting gestures — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)
- Get right bridge — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)
- Fix buttons getting stuck after scrolling on them — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)
- Fix Detector creating and attaching all gestures twice on first mount — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)
- Fix GestureDetector not working when its children change — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)
- Fix GestureDetector not working correctly with suspense and recycling — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)
- Fix nested buttons on the new architecture — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)
- Unify scaled coordinates between web and native side. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)
- [Web] Send relative coords in event. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)
- Add information about GestureHandlerRootView area and change component name in quick start — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)
- Add Hire us section to docs — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.17.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.17.0`
```

---

## 📅 2024-05-07 — `v2.16.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.16.2                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (4 changes)

**🐛 FIX** (4)
- Revert "Change .web files to default and add .native (#2835)" — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.2)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.2)
- Add examples to Gestures section in docs — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.2)
- Fix missing styles in gestures' InteractiveExamples — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.2)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.16.2`
```

---

## 📅 2024-04-29 — `v2.16.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.16.1                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (13 changes)

**🐛 FIX** (12)
- Fix remote debugger detection in bridgeless mode — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.1)
- Fix manualActivation on web — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.1)
- Fix old Gesture Handler API integration with Reaniamted — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.1)
- [Web] Fix incorrect startX and startY values in Pan — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.1)
- [Web] Add minVelocity to Pan custom activation criteria — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.1)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.1)
- Add TypeDoc to new API — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.1)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.1)
- Bump Gesture Handler version in documentation — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.1)
- Change .web files to default and add .native — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.1)
- Bump typescript version in example — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.1)
- Disable flipper on CI — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.1)

**📌 FEATURE** (1)
- @xnameTM made their first contribution in https://github.com/software-mansion/react-native — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.1)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.16.1`
```

---

## 📅 2024-03-27 — `v2.16.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.16.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Ergonomic Gesture Hooks (usePanGesture, useTapGes... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (20 changes)

**📌 FEATURE** (8)
- Add mouseButton implementation on Android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)
- Add pointerType to event — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)
- feat: add necessary changes for new arch on RN 0.74 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)
- Add touchAction prop. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)
- Allows to apply different border radius to RectButton component — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)
- Improve RectButton border styles on Android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)
- Make FlingHandler use velocity as the activation metric. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)
- Add corner area detection to Fling gesture. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)

**🐛 FIX** (12)
- Add rotation and pinch velocity on macOS — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)
- Fix ConcurrentModificationException. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)
- Fix pointers count on iOS — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)
- fix: remove usage of bridge uimanager in one more place — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)
- Remove hardcoded version of cocoapods — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)
- Move customDirectEventTypes to separate files. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)
- Fix nested taps activation — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)
- Cancel handlers by NativeViewGestureHandler — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)
- Make simultaneous handlers always symmetric on iOS — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)
- Update mocks to work when testing for the new arch — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)
- fix(web): After swiping closed, the Swipeable component cannot be swiped open again — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)
- Remove event listeners on handler drop — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.16.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.16.0`
```

---

## 📅 2024-02-05 — `v2.15.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.15.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (21 changes)

**📌 FEATURE** (9)
- macOS Support by @HeroBanana and @jfedak in https://github.com/software-mansion/react-nati — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)
- feat: add visionOS support — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)
- Add mouseButton prop — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)
- Migrate Gesture Handler to TurboModule — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)
- @mrousavy made their first contribution in https://github.com/software-mansion/react-nativ — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)
- @HeroBanana made their first contribution in https://github.com/software-mansion/react-nat — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)
- @fxamauri made their first contribution in https://github.com/software-mansion/react-nativ — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)
- @jfedak made their first contribution in https://github.com/software-mansion/react-native- — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)
- @computerjazz made their first contribution in https://github.com/software-mansion/react-n — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)

**🐛 FIX** (12)
- Add checks for the same instance of handler usage across multiple GestureDetectors — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)
- Remove didMountComponentsWithRootTag on the new arch — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)
- Fix double start when activateAfterLongPress is used — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)
- Reset relevant handler when recognizer gets reset. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)
- Fix inactive handlers staying at finished state — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)
- Change functions in windows module file to no-ops. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)
- Fix handlers coming back from being cancelled — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)
- fix: restore ReactMethod annotation — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)
- Bump react-devtools-core from 4.27.6 to 4.28.4 in /example — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)
- Add workflow_dispatch to workflows — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)
- Update supported versions in readme and in docs — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.15.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.15.0`
```

---

## 📅 2024-01-12 — `v2.14.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.14.1                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (5 changes)

**🐛 FIX** (5)
- fix: Fix types for TouchableWithoutFeedback by @mrousavy in #2690 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.14.1)
- Add exclude list for PointerCapture by @m-bert in #2703 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.14.1)
- fix: types for gestureHandlerRootHOC by @fxamauri in #2712 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.14.1)
- Fix onUp in Fling by @m-bert in #2709 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.14.1)
- fix(worklet): fix workletization of touch event gesture callbacks by @computerjazz in #271 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.14.1)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.14.1`
```

---

## 📅 2023-11-23 — `v2.14.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.14.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (14 changes)

**📌 FEATURE** (4)
- Remove Gesture Handler limits on Android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.14.0)
- Add a new gesture relation - blocksHandlers - working like reversed waitFor — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.14.0)
- Support React Native 0.73 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.14.0)
- @chriscoomber made their first contribution in https://github.com/software-mansion/react-n — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.14.0)

**🐛 FIX** (10)
- Fix double onPress — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.14.0)
- Fix tvOS build — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.14.0)
- Add a non-null assertion for reactApplicationContext.javaScriptContextHolder — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.14.0)
- Move REACT_NATIVE_VERSION to native-only code — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.14.0)
- Fix selection when TalkBack is enabled — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.14.0)
- Fix inputs focus on safari — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.14.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.14.0)
- Bump browserify-sign from 4.2.1 to 4.2.2 in /example — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.14.0)
- Change Alert to console.log in new docs — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.14.0)
- Remove handlersToCancel on web. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.14.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.14.0`
```

---

## 📅 2023-10-24 — `v2.13.4` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.13.4                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (5 changes)

**🐛 FIX** (5)
- Fix background color when foreground is set. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.4)
- Inline adding spec dependencies — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.4)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.4)
- Bump @babel/traverse from 7.22.20 to 7.23.2 in /e2e/web-tests — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.4)
- Bump react-devtools-core from 4.28.0 to 4.28.4 in /e2e/web-tests — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.4)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.13.4`
```

---

## 📅 2023-10-17 — `v2.13.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.13.3                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**📌 FEATURE** (2)
- Docs: Fix Brent Vatne's last name (Vetne -> Vatne) — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.3)
- @cipolleschi made their first contribution in https://github.com/software-mansion/react-na — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.3)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.13.3`
```

---

## 📅 2023-10-11 — `v2.13.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.13.2                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (16 changes)

**🐛 FIX** (12)
- Add ghQueueMicrotask — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.2)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.2)
- New onSwipeableOpenDragStart and onSwipeableCloseDragStart events — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.2)
- Remove jcenter — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.2)
- Add buildconfig flag for AGP8+ — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.2)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.2)
- Update dependencies in e2e/web-tests — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.2)
- Bump @sideway/formula from 3.0.0 to 3.0.1 in /FabricExample — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.2)
- Bump @sideway/formula from 3.0.0 to 3.0.1 in /docs — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.2)
- Give some love to Gesture Handler docs — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.2)
- Fix typo in Composing gestures docs — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.2)
- Bump postcss from 8.4.30 to 8.4.31 in /e2e/web-tests — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.2)

**📌 FEATURE** (4)
- @rampazzo1989 made their first contribution in https://github.com/software-mansion/react-n — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.2)
- @ChaseKnowlden made their first contribution in https://github.com/software-mansion/react- — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.2)
- @pvegh made their first contribution in https://github.com/software-mansion/react-native-g — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.2)
- @S1D007 made their first contribution in https://github.com/software-mansion/react-native- — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.2)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.13.2`
```

---

## 📅 2023-09-19 — `v2.13.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.13.1                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**🐛 FIX** (1)
- Hotfix: Hover not working on web — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.1)

**📌 FEATURE** (1)
- @pepyta made their first contribution in https://github.com/software-mansion/react-native- — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.1)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.13.1`
```

---

## 📅 2023-09-18 — `v2.13.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.13.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ Gesture.Hover() & Modern Pointer Events              │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (13 changes)

**📌 FEATURE** (1)
- Add Hover gesture — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.0)

**🐛 FIX** (12)
- Only cancel JS responder when activating recognizer comes from Gesture Handler — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.0)
- Make manual activation recognizer not cancel UIControls — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.0)
- fix: export SwipeableProps — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.0)
- Fix Reanimated worklet recognition on Fabric — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.0)
- Android TalkBack fix — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.0)
- Continuously check for pointer capture on web — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.0)
- fix: export Touchable component props — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.0)
- Don't create a RippleDrawable when the color is transparent — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.0)
- Fix hitSlop on Gesture Handler buttons — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.0)
- Improve multi-pointer behavior (with ScrollView) on Android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.0)
- Fix ripple effect staying after cancellation — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.0)
- Fix react-android not found error on android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.13.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.13.0`
```

---

## 📅 2023-07-31 — `v2.12.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.12.1                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Remove error with GestureHandlerRootView on web (in https://github.com/software-mansion/re — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.12.1)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.12.1`
```

---

## 📅 2023-06-13 — `v2.12.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.12.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Support for React Native 0.72 on the new architecture — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.12.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.12.0`
```

---

## 📅 2023-06-07 — `v2.11.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.11.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Correctly attach root view recognizer in modals on iOS — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.11.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.11.0`
```

---

## 📅 2023-05-31 — `v2.10.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.10.2                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (3 changes)

**🐛 FIX** (2)
- Fix root view error for jest — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.2)
- Prevent GH buttons from activating when scrolling list — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.2)

**📌 FEATURE** (1)
- @IvanIhnatsiuk made their first contribution in https://github.com/software-mansion/react- — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.2)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.10.2`
```

---

## 📅 2023-05-18 — `v2.10.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.10.1                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Fix operation scheduling on iOS — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.1)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.10.1`
```

---

## 📅 2023-05-10 — `v2.10.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.10.0                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (16 changes)

**📌 FEATURE** (4)
- Enable the new web implementation by default — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.0)
- Replace setImmediate and requestAnimationFrame with queueMicrotask — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.0)
- Show error when gestures are used without root view — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.0)
- Change how velocity is calculated on the new web implementation — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.0)

**🐛 FIX** (12)
- Fix types for gestureHandlerRootHOC to accept component with props — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.0)
- Remove DrawerLayoutAndroid import on web — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.0)
- Fix ripple always showing on Touchables when on Android 13 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.0)
- Whitelist Native gesture props in GestureDetector — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.0)
- Fix Gesture Handlers getting stuck due to missing up event when using the new web implemen — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.0)
- Fix Gesture Handler's buttons activating after scroll when using RefreshControl — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.0)
- Make single instance assertion work with Gradle Configuration Cache — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.0)
- fix: PureNativeButton is not exported — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.0)
- fix: do not apply namespace if it is not available in agp — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.0)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.0)
- Returns Swipeable reference on renderLeftActions — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.0)
- Add a method reset to component Swipeable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.10.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.10.0`
```

---

## 📅 2023-01-13 — `v2.9.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.9.0                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (16 changes)

**📌 FEATURE** (4)
- Support React Native 0.71 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.9.0)
- @vidalmaxime made their first contribution in https://github.com/software-mansion/react-na — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.9.0)
- @chj-damon made their first contribution in https://github.com/software-mansion/react-nati — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.9.0)
- @robwalkerco made their first contribution in https://github.com/software-mansion/react-na — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.9.0)

**🐛 FIX** (12)
- Use ReturnType instead of explicit AnimatedInterpolation type — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.9.0)
- Fix default shouldCancelWhenOutside on iOS and Android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.9.0)
- Fix onBegin and onTouchesDown event ordering on iOS — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.9.0)
- Fix buttons getting locked in some cases on Android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.9.0)
- fix RNGH not working in pnpm project — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.9.0)
- GestureDetector: more checks for mounted component — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.9.0)
- Fix GestureDetector not working when the underlying view changes — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.9.0)
- Cocoapods: Fix deprecated/removed File.exists method — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.9.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.9.0)
- Update React Native to 0.70.3 in the example apps — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.9.0)
- Reformat iOS codebase — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.9.0)
- Update the commit hash in .git-blame-ignore-revs — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.9.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.9.0`
```

---

## 📅 2022-10-21 — `v2.8.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.8.0                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (12 changes)

**📌 FEATURE** (2)
- Add userSelect prop — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.8.0)
- Make gesture required prop in GestureDetector — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.8.0)

**🐛 FIX** (10)
- Make handlers respect shouldCancelWhenOutside — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.8.0)
- Fix ManualGestureHandler shouldCancelWhenOutside on iOS — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.8.0)
- Fix missing begin event on Android for Pinch and Rotation — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.8.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.8.0)
- Add pre-commit hook and linters for Android and iOS code — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.8.0)
- Add module file for Windows — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.8.0)
- Bump react-native-reanimated from 2.4.1 to 2.10.0 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.8.0)
- Fix example app with Reanimated — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.8.0)
- Make clang-format a dev dependency — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.8.0)
- Merge lib package into the main one in the Android implementation — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.8.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.8.0`
```

---

## 📅 2022-10-11 — `v2.7.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.7.1                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (9 changes)

**🐛 FIX** (8)
- Pan shouldCancelWhenOutside fix — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.7.1)
- Change in handling coordinates in FlingGestureHandler — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.7.1)
- Fix simultaneous gesture when it receives composed gestures as arguments — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.7.1)
- Remove userSelect: none on NativeViewGestureHandler — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.7.1)
- Change order of sending touch events and assigning new state — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.7.1)
- fix a potential race on component unmount — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.7.1)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.7.1)
- Disable context menu on LongPressGestureHandler — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.7.1)

**📌 FEATURE** (1)
- @phryneas made their first contribution in https://github.com/software-mansion/react-nativ — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.7.1)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.7.1`
```

---

## 📅 2022-10-03 — `v2.7.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.7.0                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (9 changes)

**📌 FEATURE** (2)
- Change default Kotlin version — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.7.0)
- Transform entire MotionEvent instead of single pointer only — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.7.0)

**🐛 FIX** (7)
- Prevent handlers from crashing when they don't use touch events — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.7.0)
- Update if statments in PointerTracker to correctly return coordinates — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.7.0)
- Fix nested buttons on Android and buttons becoming unresponsive in a list — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.7.0)
- Fix NullPointerException when evaluating hitSlop on Android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.7.0)
- Make ReanimatedEventDispatcher a class and not an object — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.7.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.7.0)
- Bump Fabric Example to stable RN 0.70 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.7.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.7.0`
```

---

## 📅 2022-09-23 — `v2.6.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.6.2                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (12 changes)

**🐛 FIX** (10)
- Use cloneElement when assigning a refresh control — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.2)
- Use _reactInternalFiber instead of _reactInternals on RN 0.63 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.2)
- Make handlers send touches cancel on gesture end — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.2)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.2)
- Make macOS codepath less chatty — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.2)
- Returning Swipeable reference — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.2)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.2)
- Replace jcenter with mavenCentral — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.2)
- Typo Corrections. — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.2)
- Update message about the new API in docs — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.2)

**📌 FEATURE** (2)
- @franck-nadeau made their first contribution in https://github.com/software-mansion/react- — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.2)
- @anujraghuvanshi made their first contribution in https://github.com/software-mansion/reac — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.2)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.6.2`
```

---

## 📅 2022-09-16 — `v2.6.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.6.1                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (16 changes)

**📌 FEATURE** (4)
- Touch events web — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.1)
- Manual gesture receiving touch events — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.1)
- Pointer events to touch events mapping — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.1)
- @lucioroadtoglory made their first contribution in https://github.com/software-mansion/rea — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.1)

**🐛 FIX** (12)
- Nested touchables fix — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.1)
- Add check for module — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.1)
- Cache averages in PointerTracker — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.1)
- Remove calling web implementation on native apps — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.1)
- Add support for enable — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.1)
- 👍 Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.1)
- Update @types/react-native and remove comments about missing .d.ts files — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.1)
- Unify how reanimated module is looked for on Android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.1)
- Remove event parameter — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.1)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.1)
- Bump ws from 7.4.4 to 7.5.9 in /docs — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.1)
- Bump terser from 5.7.1 to 5.15.0 in /docs — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.1)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.6.1`
```

---

## 📅 2022-08-25 — `v2.6.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.6.0                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (21 changes)

**📌 FEATURE** (9)
- Add experimental web implementation — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)
- Validate children of GestureDetector to check if there is only one native view that can be — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)
- Add onLongPress callback to Gesture Handler buttons — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)
- Detect duplicate instances by @piaskowyk and @kkafar in https://github.com/software-mansio — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)
- Export custom RefreshControl component and add logic required to handle it — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)
- Compatibility with React Native 0.70, replace NDK with CMake by @tomekzaw and @j-piasecki — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)
- @piaskowyk made their first contribution in https://github.com/software-mansion/react-nati — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)
- @kkafar made their first contribution in https://github.com/software-mansion/react-native- — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)
- @Warus15 made their first contribution in https://github.com/ — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)

**🐛 FIX** (12)
- Make gestures work on non-editable TextInput on Android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)
- fix: remove explicit folly version — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)
- Pass disabled prop to the BaseButton in TouchableNativeFeedback — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)
- Fix some edge cases in state flow on Android when handler is waiting for another one — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)
- Build only required architectures on Android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)
- Remove unsafe methods — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)
- Cancel gestures when an uninterruptible native gesture becomes active — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)
- Fix default max distance for long press on Android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)
- Make Gesture Handler on web respect simultaneousHandlers prop when used on a ScrollView — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)
- Check if loaded module is really Reanimated in reanimatedWrapper — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)
- Use angle-bracket imports — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)
- fix: RCT_NEW_ARCH_ENABLED=0 to disable new arch — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.6.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.6.0`
```

---

## 📅 2022-06-23 — `v2.5.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.5.0                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ Gesture.Native() composition with ScrollView / Fl... │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (19 changes)

**📌 FEATURE** (7)
- Add activateAfterLongPress modifier to Pan gesture — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0)
- Make NativeViewGestureHandler behave more like on iOS when wrapping TextInput — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0)
- Extract handlers when child view is handling touch with pointerEvents='box-none' — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0)
- Fix sound effects on nested buttons, add touchSoundDisabled prop — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0)
- @hsjoberg made their first contribution in https://github.com/software-mansion/react-nativ — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0)
- @nandorojo made their first contribution in https://github.com/software-mansion/react-nati — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0)
- @muhamad-rizki made their first contribution in https://github.com/software-mansion/react- — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0)

**🐛 FIX** (12)
- Update scroll view class check in RNNativeViewHandler on Fabric — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0)
- Fix simultaneousHandlers prop on NativeViewGestureHandler on iOS — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0)
- Don't use reanimated module in a worklet — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0)
- Schedule calling dropAllGestureHandlers on main queue — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0)
- Refactor how ripple animation is applied to GestureHandlerButton — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0)
- Make sure that react-native-macos is supported by using the web fallback — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0)
- Default import package.json in src/utils — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0)
- Fix wrong coordinates when multiple gestures are tracking different pointers on Android — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0)
- Fix touchable inspector for Gesture Handler buttons — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0)
- Fix wrong coordinated reported by Fling gesture on iOS — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0)
- Fix Kotlin compiler error inferred type Context? — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0)
- Fix: use different touchHandler on Fabric — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.5.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.5.0`
```

---

## 📅 2022-05-05 — `v2.4.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.4.2                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (7 changes)

**🐛 FIX** (7)
- Fix resolution of refs in the old API — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.2)
- Use constant value for translation when DrawerLayout is idle — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.2)
- Fix compatibility with @types/react^18.0.0 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.2)
- Don't update shared value containing the gesture config unless the config has changed — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.2)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.2)
- Upgrade Example app dependencies and React Native — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.2)
- Move helper functions outside of useAnimatedGesture — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.2)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.4.2`
```

---

## 📅 2022-04-21 — `v2.4.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.4.1                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (5 changes)

**🐛 FIX** (4)
- Support monorepos with new architecture — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.1)
- Add mocks for flushOperations in https://github.com/software-mansion/react-native-gesture- — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.1)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.1)
- Add ndkVersion to Android project — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.1)

**📌 FEATURE** (1)
- @maximzhemerenko made their first contribution in https://github.com/software-mansion/reac — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.1)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.4.1`
```

---

## 📅 2022-04-13 — `v2.4.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.4.0                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (24 changes)

**📌 FEATURE** (12)
- Basic web support for GestureDetector — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- Remove warning about the old API — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- Suppress deprecated warnings — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- Effectively remove RNGestureHandlerEnabledRootView — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- Add a workaround for pointerCount must be at least 1 — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- Add cancelsTouchesInView prop on iOS — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- Implement sending events directly to Reanimated on Fabric — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- @ghorbani-m made their first contribution in https://github.com/software-mansion/react-nat — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- @ajatdarojat45 made their first contribution in https://github.com/software-mansion/react- — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- @pooyahrtn made their first contribution in https://github.com/software-mansion/react-nati — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- @EmmaSteady made their first contribution in https://github.com/software-mansion/react-nat — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- @Yrsafam made their first contribution in https://github.com/software-mansion/react-native — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)

**🐛 FIX** (12)
- Fix TypeScript typing issues with setTimeout by removing NodeJS types — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- Pass accessibilityActions properties — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- Use device events when remote debugging is enabled — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- Don't send events on iOS when target is nil — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- Fix props on GestureHandlerButton — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- Add missing props to GestureButton type — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- Fix gestures not attaching to views on iOS when using Fabric — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- Fix Fabric checks happening too early — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- Drop all gesture handlers on invalidate — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- Fix nested buttons with outer one disabled on iOS — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- 🔢 Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)
- Fixed a typo in example url — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.4.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.4.0`
```

---

## 📅 2022-03-14 — `v2.3.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.3.2                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**💥 BREAKING** (1)
- Remove jestUtils from the main index.ts and move it to separate package.json (https://gith — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.3.2)

**📌 FEATURE** (1)
- Use native driver by default for TouchableOpacity animations (https://github.com/software- — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.3.2)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.3.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** RNGH `2.33.0` + RN `0.87` (2.x line)
  - [source](`packages/react-native-gesture-handler/majors/2/minors/33/patches/0.md`)
✅ **GOOD** RNGH `2.32.0` + RN `0.86` (incl. RNRenderer import fix)
  - n/a (prior builds could fail RNRenderer import on 0.86+ — fixed in this release)
  - [source](`packages/react-native-gesture-handler/majors/2/minors/32/patches/0.md`)

---

## 📅 2022-03-09 — `v2.3.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.3.1                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (3 changes)

**🐛 FIX** (3)
- Fix ripple animation on touchables in some cases (https://github.com/software-mansion/reac — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.3.1)
- Fix StyleSheet import in RNGestureHandlerButtonNativeComponent.js (https://github.com/soft — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.3.1)
- Fix missing testID when createHandler props do not have one assigned (https://github.com/s — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.3.1)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.3.1`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** RNGH `2.33.0` + RN `0.87` (2.x line)
  - [source](`packages/react-native-gesture-handler/majors/2/minors/33/patches/0.md`)
✅ **GOOD** RNGH `2.32.0` + RN `0.86` (incl. RNRenderer import fix)
  - n/a (prior builds could fail RNRenderer import on 0.86+ — fixed in this release)
  - [source](`packages/react-native-gesture-handler/majors/2/minors/32/patches/0.md`)

---

## 📅 2022-03-01 — `v2.3.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.3.0                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (13 changes)

**📌 FEATURE** (3)
- Gesture Handler for Fabric (https://github.com/software-mansion/react-native-gesture-handl — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.3.0)
- Add FabricExample (https://github.com/software-mansion/react-native-gesture-handler/commit — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.3.0)
- Add ability to fire gesture events in testing (https://github.com/software-mansion/react-n — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.3.0)

**🐛 FIX** (10)
- Fix race condition between the orchestrator and the registry (https://github.com/software- — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.3.0)
- Rebuild Reanimated event only when needed (https://github.com/software-mansion/react-nativ — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.3.0)
- Fix tvOS compilation errors (https://github.com/software-mansion/react-native-gesture-hand — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.3.0)
- Add modified ScaleGestureDetector from AOSP (https://github.com/software-mansion/react-nat — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.3.0)
- Use the speed option in DrawerLayout (https://github.com/software-mansion/react-native-ges — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.3.0)
- :+1: Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.3.0)
- Export change event payload types (https://github.com/software-mansion/react-native-gestur — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.3.0)
- Add direction to Swipeable callbacks (https://github.com/software-mansion/react-native-ges — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.3.0)
- :1234: Miscellaneous — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.3.0)
- Add runOnJS modifier to gestures (https://github.com/software-mansion/react-native-gesture — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.3.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.3.0`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** RNGH `2.33.0` + RN `0.87` (2.x line)
  - [source](`packages/react-native-gesture-handler/majors/2/minors/33/patches/0.md`)
✅ **GOOD** RNGH `2.32.0` + RN `0.86` (incl. RNRenderer import fix)
  - n/a (prior builds could fail RNRenderer import on 0.86+ — fixed in this release)
  - [source](`packages/react-native-gesture-handler/majors/2/minors/32/patches/0.md`)

---

## 📅 2022-05-10 — `v2.2.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.2.1                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (3 changes)

**📌 FEATURE** (3)
- Basic web support for GestureDetector — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.2.1)
- Remove warning about the old API — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.2.1)
- Rebuild Reanimated event only when needed — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.2.1)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- _(none declared)_

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.2.1`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** RNGH `2.26.0` + RN `0.80`; `2.28.0` + RN `0.81`; `2.30.0` + RN `0.83`; `2.31.1` + RN `0.85`
  - [source](corresponding `packages/react-native-gesture-handler/majors/2/minors/{26,28,30,31}/patches/*.md`)
💥 **BROKE** RNGH `2.25.0` + `react-native` (Signal S1)
  - RNGH Pressable stops working because isTouchPropagationAllowed is stuck false
  - [source](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)

---

## 📅 2022-01-17 — `v2.2.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.2.0                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (9 changes)

**📌 FEATURE** (2)
- Change absolute position to be relative to the window instead of the screen (https://githu — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.2.0)
- Add notice for old API users (https://github.com/software-mansion/react-native-gesture-han — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.2.0)

**🐛 FIX** (7)
- Use path relative to the directory of Reanimated when checking its version (https://github — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.2.0)
- Check major version of Reanimated when looking for common interface (https://github.com/so — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.2.0)
- Reset progress of handler when it finishes waiting ends (https://github.com/software-mansi — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.2.0)
- Use export type when exporting types (https://github.com/software-mansion/react-native-ges — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.2.0)
- Send first onTouchesDown after gesture begins (https://github.com/software-mansion/react-n — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.2.0)
- Send state change event when awaiting handler finishes (https://github.com/software-mansio — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.2.0)
- Don't send UNDETERMINED to CANCELLED state change event (https://github.com/software-mansi — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.2.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)
- **[HIGH]** Old gesture-component API warning after 2.2.0 *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/1831)

### 4. Peer Dependencies

```
- _(none declared)_

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.2.0`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** RNGH `2.26.0` + RN `0.80`; `2.28.0` + RN `0.81`; `2.30.0` + RN `0.83`; `2.31.1` + RN `0.85`
  - [source](corresponding `packages/react-native-gesture-handler/majors/2/minors/{26,28,30,31}/patches/*.md`)
💥 **BROKE** RNGH `2.25.0` + `react-native` (Signal S1)
  - RNGH Pressable stops working because isTouchPropagationAllowed is stuck false
  - [source](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)

---

## 📅 2022-02-21 — `v2.1.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.1.3                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards

_No leaf data in archive for this patch._

### 3. Active Signals (1 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)

### 4. Peer Dependencies

```
- _(none declared)_

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.1.3`
```

---

## 📅 2022-02-17 — `v2.1.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.1.2                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards

_No leaf data in archive for this patch._

### 3. Active Signals (1 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)

### 4. Peer Dependencies

```
- _(none declared)_

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.1.2`
```

---

## 📅 2022-01-10 — `v2.1.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.1.1                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards

_No leaf data in archive for this patch._

### 3. Active Signals (1 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)

### 4. Peer Dependencies

```
- _(none declared)_

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.1.1`
```

---

## 📅 2021-12-07 — `v2.1.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.1.0                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards

_No leaf data in archive for this patch._

### 3. Active Signals (1 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)

### 4. Peer Dependencies

```
- _(none declared)_

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.1.0`
```

---

## 📅 2021-12-01 — `v2.0.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-gesture-handler@2.0.0                  │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ BROKEN       │ `compileDebugKotlin` FAILED with RN New Arch (0.6... │
│ FUNCTIONAL   │ Legacy Component Handlers (<PanGestureHandler>, <... │
│ NEW          │ React Native Modal touch context disconnection on... │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (26 changes)

**💥 BREAKING** (3)
- Adjust Swipeable's overshootFriction behavior (#1275) by @kolking — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Fix min distance on Pan with custom activation criteria (#1696) by @j-piasecki — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Remove deprecated props from PanGestureHandler (#1662) by @j-piasecki — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)

**📌 FEATURE** (11)
- Add new API by @j-piasecki — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- New Manual Gesture feature by @j-piasecki — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Add duration to long press event (#1505) by @j-piasecki — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Allow resetting properties to default value (#1444) by @jakub-gonet — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Fix TouchableOpacity visuals (#1567) by @jakub-gonet — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Deprecate RNGestureHandlerEnabledRootView (#1605) by @jakub-gonet — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Fix modals (#1603) by @jakub-gonet — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Fix tap gesture handler inconsistency (#1682) by @j-piasecki — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Update FlingGestureHandler on iOS (#1612) by @j-piasecki — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Update PanGestureHandler on iOS (#1611) by @j-piasecki — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Fix LongPressGestureHandler inconsistency (#1610) by @j-piasecki — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)

**🐛 FIX** (12)
- Reset velocity when beginning pan gesture (#1694) by @j-piasecki — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Fix gesture handlers not working when children overflow their parent (#1618) by @j-piaseck — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Fix nested touchables on Android (#1601) by @j-piasecki — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- :+1: Improvements — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Expanded Jest mocks (#1364) by @TheWirv — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Improved type definitions of Gesture Components (#1394) by @yfunk — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Remove implicit inclusion of node types (#1420) by @jakub-gonet — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Fix interactions between TapGH and PanGH (#1508) by @j-piasecki — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Block touch handling when inspector is enabled (#252) by @osdnk, @jakub-gonet — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Fix compatibilty with React 18 by @janicduplessis — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Pass RNGH props to FlatList's underlying ScrollView (#1557) by @jakub-gonet — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)
- Add JSDocs (#1566) by @jakub-gonet — [source](https://github.com/software-mansion/react-native-gesture-handler/releases/tag/2.0.0)

### 3. Active Signals (1 known issues at this version)

- **[HIGH]** `compileDebugKotlin` FAILED with RN New Arch (0.69 era) *(open)* — [#](https://github.com/software-mansion/react-native-gesture-handler/issues/2168)

### 4. Peer Dependencies

```
- _(none declared)_

- **source**: `https://registry.npmjs.org/react-native-gesture-handler/2.0.0`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** RNGH `2.32.0` + RN `0.86` (incl. RNRenderer import fix)
  - n/a (prior builds could fail RNRenderer import on 0.86+ — fixed in this release)
  - [source](`packages/react-native-gesture-handler/majors/2/minors/32/patches/0.md`)


---

## Audit Integrity

- **Versions covered**: 76
- **Archive source**: Chronos/Grok rn-terrain corpus (extracted 2026-09-26)
- **Combos cross-referenced**: 6 relevant combos
- **Signals cross-referenced**: 11 Chronos signals
- **Audit vector**: Present ➔ Past (3.3.0 ➔ 2.0.0)
