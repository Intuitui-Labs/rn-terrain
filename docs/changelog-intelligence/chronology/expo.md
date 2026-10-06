---
title: "Expo SDK — Reverse-Chronological Audit"
package: "expo"
latest_stable: "57.0.24"
_generated_at: "2026-09-26T12:01:32Z"
_shard_hash: "3ea73050a441"
audit_vector: "present → past (57.0.24 ➔ oldest)"
source: "TCDI Chronos Archive + Grok/Chronos signals"
---

# Expo SDK — Reverse-Chronological Audit Ledger

> **Audit vector**: Present ➔ Past. Starts at **57.0.24** (latest stable as of ingest, September 2026) and walks backward without skipping any minor or patch.
>
> **Coverage**: 48 versions; next SDK preview: `58.0.0-preview.6` (not yet stable)
>
> **6-State kernel**: REMOVED | DEPRECATED | BROKEN | FUNCTIONAL | NEW | EXPERIMENTAL

---

## ⚪ In-flight: `58.0.0-preview.6` (RC / Preview — not yet stable)

> _Not yet stable at ingest. Leaf not generated. Monitor dist-tag `next` for promotion._

---

---

## 📅 2026-09-18 — `v57.0.24` 🟢 **LATEST STABLE**

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.24                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.3 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.24/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.1",
  "react-native-worklets": "0.10.1",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-09-15 — `v57.0.23` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.23                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (3 changes)

**📌 FEATURE** (1)
- Opt-in UIKit scene lifecycle for Xcode 27 / iOS 27 SDK — [source](https://github.com/expo/expo/pull/50191)

**🐛 FIX** (1)
- [iOS] Add opt-in UIKit scene lifecycle support with React Native startup, deep links, Hand… — [source](https://github.com/expo/expo/pull/50191)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.3 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.23/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.1",
  "react-native-worklets": "0.10.1",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-09-11 — `v57.0.22` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.22                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.3 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.22/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.1",
  "react-native-worklets": "0.10.1",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-09-08 — `v57.0.21` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.21                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.3 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.21/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.1",
  "react-native-worklets": "0.10.1",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-09-04 — `v57.0.20` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.20                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.3 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.20/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.1",
  "react-native-worklets": "0.10.1",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-09-01 — `v57.0.19` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.19                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**🐛 FIX** (1)
- [iOS] Fix a Hermes JSI crash during reloads where two overlapping `RCTHost` runtime callba… — [source](https://github.com/expo/expo/pull/48576)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.3 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.19/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.1",
  "react-native-worklets": "0.10.1",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-08-28 — `v57.0.18` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.18                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.3 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.18/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.1",
  "react-native-worklets": "0.10.1",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-08-26 — `v57.0.17` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.17                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**🐛 FIX** (1)
- Bump recommended RN to 0.86.3 — fixes Hermes V1 slow dev startup — [source](https://github.com/expo/expo/issues/48298)

**📌 PEER-DEPS** (1)
- bundledNativeModules pins RN 0.86.3 — [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.1",
  "react-native-worklets": "0.10.1",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-08-24 — `v57.0.16` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.16                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**🐛 FIX** (1)
- Bump to `@expo/metro@56.0.2` and `metro@0.84.5` (#49161 by @kitten) — [source](https://github.com/expo/expo/pull/49161)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.2 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.16/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.2",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.1",
  "react-native-worklets": "0.10.1",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-08-20 — `v57.0.15` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.15                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.2 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.15/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.2",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.1",
  "react-native-worklets": "0.10.1",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-08-17 — `v57.0.14` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.14                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.2 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.14/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.2",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.1",
  "react-native-worklets": "0.10.1",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-08-14 — `v57.0.13` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.13                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (5 changes)

**🐛 FIX** (4)
- [iOS] Add ExpoBundleConfiguration to derive RCTBundleConfiguration from the normalized bun… — [source](https://github.com/expo/expo/pull/48010)
- [iOS] Resolve the dev server port from the `RCTMetroPort` Info.plist key at runtime so bar… — [source](https://github.com/expo/expo/pull/48098)
- [macOS] Fix build by guarding the `bundleConfiguration` override, which requires react-nat… — [source](https://github.com/expo/expo/pull/48494)
- Rewrite the `TextDecoder` implementation to increase decoding performance (#48877 by @kitt… — [source](https://github.com/expo/expo/pull/48877)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.2 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.13/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.2",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.1",
  "react-native-worklets": "0.10.1",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-08-10 — `v57.0.12` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.12                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.2 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.12/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.2",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.1",
  "react-native-worklets": "0.10.1",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-08-06 — `v57.0.11` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.11                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (5 changes)

**🐛 FIX** (4)
- [iOS] Fix `expo/fetch` streaming race between URLSession delegate callbacks and `startStre… — [source](https://github.com/expo/expo/pull/47796)
- Fix `expo/fetch` body-stream teardown races: aborting via an `AbortSignal` now rejects the… — [source](https://github.com/expo/expo/pull/47573)
- Fix async imports (`import(...)`) via `asyncRequireModule` not a thenable instead of a ful… — [source](https://github.com/expo/expo/pull/48550)
- Fix DOM components dropping prop updates that are emitted while the WebView is still loadi… — [source](https://github.com/expo/expo/pull/47683)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.2 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.11/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.2",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.1",
  "react-native-worklets": "0.10.1",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-08-04 — `v57.0.10` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.10                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.2 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.10/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.2",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.1",
  "react-native-worklets": "0.10.1",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-07-29 — `v57.0.9` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.9                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**🐛 FIX** (1)
- Bump recommended RN to 0.86.2 — fixes Hermes V1 Worklets memory regression — [source](https://github.com/expo/expo/issues/46519)

**📌 PEER-DEPS** (1)
- bundledNativeModules pins RN 0.86.2 after Hermes memory fix — [source](https://unpkg.com/expo@57.0.9/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.2",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.1",
  "react-native-worklets": "0.10.1",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-07-22 — `v57.0.8` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.8                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**🐛 FIX** (1)
- [Android] Fixed expo-fetch race condition causing out-of-order delivery of initial chunks … — [source](https://github.com/expo/expo/pull/42161)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.0 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.8/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.0",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.0",
  "react-native-worklets": "0.10.0",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-07-17 — `v57.0.7` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.7                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**🐛 FIX** (1)
- Fix `import.meta.url` being `null` on web when read after the bundle's synchronous executi… — [source](https://github.com/expo/expo/pull/47802)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.0 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.7/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.0",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.0",
  "react-native-worklets": "0.10.0",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-07-15 — `v57.0.6` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.6                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.0 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.6/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.0",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.0",
  "react-native-worklets": "0.10.0",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-07-15 — `v57.0.5` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.5                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (3 changes)

**🐛 FIX** (2)
- [iOS] Pass the React runtime scheduler to `ExpoModulesCore` through a weak handle, so disp… — [source](https://github.com/expo/expo/pull/47492)
- Fix `Response.blob()` in `expo/fetch` throwing when the global `Blob` is react-native's im… — [source](https://github.com/expo/expo/pull/47538)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.0 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.5/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.0",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.0",
  "react-native-worklets": "0.10.0",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-07-07 — `v57.0.4` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.4                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.0 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.4/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.0",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.0",
  "react-native-worklets": "0.10.0",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-07-07 — `v57.0.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.3                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.0 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.3/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.0",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.0",
  "react-native-worklets": "0.10.0",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-07-03 — `v57.0.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.2                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.0 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.2/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.0",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.0",
  "react-native-worklets": "0.10.0",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-06-30 — `v57.0.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.1                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.86.0 / react 19.2.3 — [source](https://unpkg.com/expo@57.0.1/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.0",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.0",
  "react-native-worklets": "0.10.0",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-06-30 — `v57.0.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@57.0.0                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (5 changes)

**📌 FEATURE** (2)
- SDK 57 brings React Native 0.86 (intentional non-breaking RN bump) — [source](https://expo.dev/changelog/sdk-57)
- Bundled animation/gesture bumps (Reanimated 4.5 / Worklets 0.10 / RNGH 2.32) — [source](https://expo.dev/changelog/sdk-57)

**💥 BREAKING** (1)
- expo prebuild cleans/regenerates native dirs by default — [source](https://github.com/expo/expo/pull/47209)

**📌 KNOWN-BUGS/RISK** (1)
- Initial SDK 57 inherits Hermes V1 memory regression until 57.0.9 — [source](https://expo.dev/changelog/sdk-57)

**📌 PEER-DEPS** (1)
- SDK 57 bundled matrix: RN 0.86 / React 19.2.3 / Node ≥22.13.x — [source](https://docs.expo.dev/versions/latest/)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.86.0",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.5.0",
  "react-native-worklets": "0.10.0",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-09-17 — `v56.0.22` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.22                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.22/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-08-28 — `v56.0.21` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.21                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**🐛 FIX** (1)
- Bump to `@expo/metro@56.0.2` and `metro@0.84.5` (#49161 by @kitten) — [source](https://github.com/expo/expo/pull/49161)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.21/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-08-17 — `v56.0.20` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.20                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (5 changes)

**🐛 FIX** (4)
- [iOS] Add ExpoBundleConfiguration to derive RCTBundleConfiguration from the normalized bun… — [source](https://github.com/expo/expo/pull/48010)
- [iOS] Resolve the dev server port from the `RCTMetroPort` Info.plist key at runtime so bar… — [source](https://github.com/expo/expo/pull/48098)
- [macOS] Fix build by guarding the `bundleConfiguration` override, which requires react-nat… — [source](https://github.com/expo/expo/pull/48494)
- Rewrite the `TextDecoder` implementation to increase decoding performance (#48877 by @kitt… — [source](https://github.com/expo/expo/pull/48877)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.20/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-08-06 — `v56.0.19` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.19                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**🐛 FIX** (1)
- Fix async imports (`import(...)`) via `asyncRequireModule` not a thenable instead of a ful… — [source](https://github.com/expo/expo/pull/48550)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.19/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-07-29 — `v56.0.18` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.18                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.18/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-07-23 — `v56.0.17` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.17                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**🐛 FIX** (1)
- [Android] Fixed expo-fetch race condition causing out-of-order delivery of initial chunks … — [source](https://github.com/expo/expo/pull/42161)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.17/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "~4.26.0",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-07-15 — `v56.0.16` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.16                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (3 changes)

**🐛 FIX** (2)
- Fix `Response.blob()` in `expo/fetch` throwing when the global `Blob` is react-native's im… — [source](https://github.com/expo/expo/pull/47538)
- Fix `import.meta.url` being `null` on web when read after the bundle's synchronous executi… — [source](https://github.com/expo/expo/pull/47802)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.16/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-07-07 — `v56.0.15` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.15                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.15/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-07-03 — `v56.0.14` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.14                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.14/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-07-01 — `v56.0.13` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.13                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**🐛 FIX** (1)
- Add explicit `react-native/Libraries/Core/InitializeCore` import to native runtime entrypo… — [source](https://github.com/expo/expo/pull/46344)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.13/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-06-15 — `v56.0.12` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.12                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**🐛 FIX** (1)
- Fix `asyncRoutes` failing on Android and iOS with `Requiring unknown module` (#46870 by @h… — [source](https://github.com/expo/expo/pull/46870)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.12/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-06-10 — `v56.0.11` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.11                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.11/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-06-10 — `v56.0.10` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.10                                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (4 changes)

**🐛 FIX** (3)
- Fix `expo/fetch` on Android sending a single `0x00` byte instead of an empty body for body… — [source](https://github.com/expo/expo/pull/46678)
- Forward unhandled errors and rejections to the dev server console. (#46578 by @krystofwold… — [source](https://github.com/expo/expo/pull/46578)
- Include JavaScript and React component stacks in web dev server error logs. (#46584 by @kr… — [source](https://github.com/expo/expo/pull/46584)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.10/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-06-05 — `v56.0.9` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.9                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.9/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-05-29 — `v56.0.8` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.8                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (4 changes)

**🐛 FIX** (3)
- Decompress `gzip` / `br` / `zstd` `expo/fetch` responses on Android even when the caller s… — [source](https://github.com/expo/expo/pull/46398)
- Fix `bodyUsed` leaking across siblings when fetch Response is cloned twice (#46397 by @zoo… — [source](https://github.com/expo/expo/pull/46397)
- Prevent fatal `The stream is not in a state that permits close` in `expo/fetch` when nativ… — [source](https://github.com/expo/expo/pull/44909)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.8/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-05-29 — `v56.0.7` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.7                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.7/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-05-28 — `v56.0.6` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.6                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.6/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-05-26 — `v56.0.5` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.5                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**🐛 FIX** (1)
- [fetch] Refine **CompressionInterceptor.kt** code. (#46052 by @kudo) — [source](https://github.com/expo/expo/pull/46052)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.5/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-05-23 — `v56.0.4` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.4                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.4/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-05-21 — `v56.0.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.3                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.3/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "4.25.1",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-05-21 — `v56.0.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.2                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.2/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "4.25.1",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-05-21 — `v56.0.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.1                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 PEER-DEPS** (1)
- bundledNativeModules: RN 0.85.3 / react 19.2.3 — [source](https://unpkg.com/expo@56.0.1/bundledNativeModules.json)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "4.25.1",
  "react-native-safe-area-context": "~5.7.0"
}
```

---

## 📅 2026-05-20 — `v56.0.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ expo@56.0.0                                         │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ New Architecture (Fabric/TurboModules) enabled by... │
│ NEW          │ Expo Router forked internal navigation core, Stab... │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (9 changes)

**📌 FEATURE** (4)
- SDK 56 ships React Native 0.85 + React 19.2 + Hermes V1 default — [source](https://expo.dev/changelog/sdk-56)
- Expo UI stable; precompiled iOS modules; Hermes bytecode diffing default — [source](https://expo.dev/changelog/sdk-56)
- [fetch][Android] Added `brotli`, `gzip`, and `zstd` decompression support. (#45458 by @kud… — [source](https://github.com/expo/expo/pull/45458)
- Added `AbortSignal.timeout`, `AbortSignal.any`, and `DOMException` to the native runtime. … — [source](https://github.com/expo/expo/pull/45441)

**💥 BREAKING** (2)
- expo-router forks React Navigation; direct @react-navigation/* imports break — [source](https://expo.dev/changelog/sdk-56)
- expo/fetch becomes globalThis.fetch; File copy/move async — [source](https://expo.dev/changelog/sdk-56)

**📌 KNOWN-BUGS/RISK** (1)
- Hermes V1 + Worklets/Reanimated memory regression (SDK 56) — [source](https://github.com/expo/expo/issues/46519)

**📌 PEER-DEPS** (1)
- SDK 56 bundled matrix: RN 0.85.3 / React 19.2.3 / Node ≥20.19.x — [source](https://docs.expo.dev/versions/latest/)

**🐛 FIX** (1)
- Fix `expo/fetch` not threading through `Request#body` for `whatwg-fetch` request inputs (#… — [source](https://github.com/expo/expo/pull/46027)

### 4. Bundled Native Modules (SDK Pins)

```json
{
  "react-native": "0.85.3",
  "react": "19.2.3",
  "react-native-web": "~0.21.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.3",
  "react-native-gesture-handler": "~2.31.1",
  "react-native-screens": "4.25.1",
  "react-native-safe-area-context": "~5.7.0"
}
```


---

## Audit Integrity

- **Versions covered**: 48
- **Archive source**: Chronos/Grok rn-terrain corpus (extracted 2026-09-26)
- **Combos cross-referenced**: 3 relevant combos
- **Signals cross-referenced**: 0 Chronos signals
- **Audit vector**: Present ➔ Past (57.0.24 ➔ 56.0.0)
