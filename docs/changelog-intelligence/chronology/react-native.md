---
title: "React Native — Reverse-Chronological Audit"
package: "react-native"
latest_stable: "0.87.1"
_generated_at: "2026-09-26T16:14:13Z"
_shard_hash: "c89cfdaab9f3"
audit_vector: "present → past (0.87.1 ➔ oldest)"
source: "TCDI Chronos Archive + Grok/Chronos signals"
---

# React Native — Reverse-Chronological Audit Ledger

> **Audit vector**: Present ➔ Past. Starts at **0.87.1** (latest stable as of ingest, September 2026) and walks backward without skipping any minor or patch.
>
> **Coverage**: 124 versions; in-flight RC: `0.88.0-rc.2` (not yet stable)
>
> **6-State kernel**: REMOVED | DEPRECATED | BROKEN | FUNCTIONAL | NEW | EXPERIMENTAL

---

## ⚪ In-flight: `0.88.0-rc.2` (RC / Preview — not yet stable)

> _Not yet stable at ingest. Leaf not generated. Monitor dist-tag `next` for promotion._

---

---

## 📅 2026-08-26 — `v0.87.1` 🟢 **LATEST STABLE**

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.87.1                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Swift Package Manager (SwiftPM) Experimental Inte... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.87.1)

### 4. Peer Dependencies

```
- **Node.js**: `>= 22.13`
- **React Peer Dependency**: `19.0.0`
- **Hermes Engine**: `v1.1-default`
- **Metro Bundler**: `^0.87.1`
- **Android Toolchain**: AGP `9.0.0` · Gradle `8.13` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** RNGH `2.33.0` + RN `0.87` (2.x line)
  - [source](`packages/react-native-gesture-handler/majors/2/minors/33/patches/0.md`)

---

## 📅 2026-08-11 — `v0.87.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.87.0                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ Strict TypeScript API as default (source-generate... │
│ EXPERIMENTAL │ Swift Package Manager (SwiftPM) Experimental Inte... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Strict TypeScript API Default & SwiftPM Experimental — [source](https://github.com/facebook/react-native/releases/tag/v0.87.0)

### 4. Peer Dependencies

```
- **Node.js**: `>= 22.13`
- **React Peer Dependency**: `19.0.0`
- **Hermes Engine**: `v1.1-default`
- **Metro Bundler**: `^0.87.1`
- **Android Toolchain**: AGP `9.0.0` · Gradle `8.13` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** RNGH `2.33.0` + RN `0.87` (2.x line)
  - [source](`packages/react-native-gesture-handler/majors/2/minors/33/patches/0.md`)

---

## 📅 2026-08-24 — `v0.86.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.86.3                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.86.3)

### 4. Peer Dependencies

```
- **Node.js**: `>= 22.11`
- **React Peer Dependency**: `19.0.0`
- **Hermes Engine**: `v1.0-default`
- **Metro Bundler**: `^0.86.3`
- **Android Toolchain**: AGP `8.9.1` · Gradle `8.12.1` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Reanimated `4.7.x` + RN `0.86`–`0.88`
  - [source](https://registry.npmjs.org/react-native-reanimated/4.7.0 ; docs table ; snapshot JSON)
✅ **GOOD** Worklets `0.13.0` + RN `0.86`–`0.88`
  - [source](https://registry.npmjs.org/react-native-worklets/0.13.0)
✅ **GOOD** RNGH `3.0.1` + RN `0.86`
  - [source](`packages/react-native-gesture-handler/majors/3/minors/0/patches/1.md`)
✅ **GOOD** RNGH `2.32.0` + RN `0.86` (incl. RNRenderer import fix)
  - n/a (prior builds could fail RNRenderer import on 0.86+ — fixed in this release)
  - [source](`packages/react-native-gesture-handler/majors/2/minors/32/patches/0.md`)
💥 **BROKE** RNGH `2.25.0` + `react-native` (Signal S1)
  - RNGH Pressable stops working because isTouchPropagationAllowed is stuck false
  - [source](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-07-27 — `v0.86.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.86.2                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.86.2)

### 4. Peer Dependencies

```
- **Node.js**: `>= 22.11`
- **React Peer Dependency**: `19.0.0`
- **Hermes Engine**: `v1.0-default`
- **Metro Bundler**: `^0.86.3`
- **Android Toolchain**: AGP `8.9.1` · Gradle `8.12.1` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Reanimated `4.7.x` + RN `0.86`–`0.88`
  - [source](https://registry.npmjs.org/react-native-reanimated/4.7.0 ; docs table ; snapshot JSON)
✅ **GOOD** Worklets `0.13.0` + RN `0.86`–`0.88`
  - [source](https://registry.npmjs.org/react-native-worklets/0.13.0)
✅ **GOOD** RNGH `3.0.1` + RN `0.86`
  - [source](`packages/react-native-gesture-handler/majors/3/minors/0/patches/1.md`)
✅ **GOOD** RNGH `2.32.0` + RN `0.86` (incl. RNRenderer import fix)
  - n/a (prior builds could fail RNRenderer import on 0.86+ — fixed in this release)
  - [source](`packages/react-native-gesture-handler/majors/2/minors/32/patches/0.md`)
💥 **BROKE** RNGH `2.25.0` + `react-native` (Signal S1)
  - RNGH Pressable stops working because isTouchPropagationAllowed is stuck false
  - [source](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-06-09 — `v0.86.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.86.0                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ Android 15 edge-to-edge system insets & measureIn... │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**✨ FEAT** (1)
- Android 15 Edge-to-Edge Default & Architecture Complete — [source](https://github.com/facebook/react-native/releases/tag/v0.86.0)

### 4. Peer Dependencies

```
- **Node.js**: `>= 22.11`
- **React Peer Dependency**: `19.0.0`
- **Hermes Engine**: `v1.0-default`
- **Metro Bundler**: `^0.86.3`
- **Android Toolchain**: AGP `8.9.1` · Gradle `8.12.1` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Reanimated `4.7.x` + RN `0.86`–`0.88`
  - [source](https://registry.npmjs.org/react-native-reanimated/4.7.0 ; docs table ; snapshot JSON)
✅ **GOOD** Worklets `0.13.0` + RN `0.86`–`0.88`
  - [source](https://registry.npmjs.org/react-native-worklets/0.13.0)
✅ **GOOD** RNGH `3.0.1` + RN `0.86`
  - [source](`packages/react-native-gesture-handler/majors/3/minors/0/patches/1.md`)
✅ **GOOD** RNGH `2.32.0` + RN `0.86` (incl. RNRenderer import fix)
  - n/a (prior builds could fail RNRenderer import on 0.86+ — fixed in this release)
  - [source](`packages/react-native-gesture-handler/majors/2/minors/32/patches/0.md`)
💥 **BROKE** RNGH `2.25.0` + `react-native` (Signal S1)
  - RNGH Pressable stops working because isTouchPropagationAllowed is stuck false
  - [source](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)
✅ **GOOD** Expo `≥57.0.17` + RN `0.86.3` + React `19.2.3`
  - [source](https://unpkg.com/expo@57.0.17/bundledNativeModules.json ; https://github.com/expo/expo/issues/48298 ; https://expo.dev/changelog/sdk-57)
💥 **BROKE** Expo `57.0.0`–`57.0.8` + RN `0.86.0` + Worklets/Reanimated
  - Same Hermes memory regression until RN 0.86.2
  - [source](https://expo.dev/changelog/sdk-57 ; https://github.com/expo/expo/issues/46519)

---

## 📅 2026-05-05 — `v0.85.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.85.3                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.85.3)

### 4. Peer Dependencies

```
- **Node.js**: `>= 22.11`
- **React Peer Dependency**: `19.0.0`
- **Hermes Engine**: `v1.0-default`
- **Metro Bundler**: `^0.86.0`
- **Android Toolchain**: AGP `8.9.1` · Gradle `8.12.1` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

💥 **BROKE** Expo SDK `56.*` + RN `0.85.3` + Worklets/Reanimated import
  - Hermes V1 memory regression (#46519); not backported to RN 0.85
  - [source](https://github.com/expo/expo/issues/46519 ; https://expo.dev/changelog/sdk-56)

---

## 📅 2026-04-20 — `v0.85.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.85.2                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.85.2)

### 4. Peer Dependencies

```
- **Node.js**: `>= 22.11`
- **React Peer Dependency**: `19.0.0`
- **Hermes Engine**: `v1.0-default`
- **Metro Bundler**: `^0.86.0`
- **Android Toolchain**: AGP `8.9.1` · Gradle `8.12.1` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

💥 **BROKE** Expo SDK `56.*` + RN `0.85.3` + Worklets/Reanimated import
  - Hermes V1 memory regression (#46519); not backported to RN 0.85
  - [source](https://github.com/expo/expo/issues/46519 ; https://expo.dev/changelog/sdk-56)

---

## 📅 2026-04-13 — `v0.85.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.85.1                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.85.1)

### 4. Peer Dependencies

```
- **Node.js**: `>= 22.11`
- **React Peer Dependency**: `19.0.0`
- **Hermes Engine**: `v1.0-default`
- **Metro Bundler**: `^0.86.0`
- **Android Toolchain**: AGP `8.9.1` · Gradle `8.12.1` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

💥 **BROKE** Expo SDK `56.*` + RN `0.85.3` + Worklets/Reanimated import
  - Hermes V1 memory regression (#46519); not backported to RN 0.85
  - [source](https://github.com/expo/expo/issues/46519 ; https://expo.dev/changelog/sdk-56)

---

## 📅 2026-04-07 — `v0.85.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.85.0                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**⚡ PERF** (1)
- Static Hermes Bytecode Optimization — [source](https://github.com/facebook/react-native/releases/tag/v0.85.0)

### 4. Peer Dependencies

```
- **Node.js**: `>= 22.11`
- **React Peer Dependency**: `19.0.0`
- **Hermes Engine**: `v1.0-default`
- **Metro Bundler**: `^0.86.0`
- **Android Toolchain**: AGP `8.9.1` · Gradle `8.12.1` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

💥 **BROKE** Expo SDK `56.*` + RN `0.85.3` + Worklets/Reanimated import
  - Hermes V1 memory regression (#46519); not backported to RN 0.85
  - [source](https://github.com/expo/expo/issues/46519 ; https://expo.dev/changelog/sdk-56)

---

## 📅 2026-02-27 — `v0.84.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.84.1                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.84.1)

### 4. Peer Dependencies

```
- **Node.js**: `>= 22.11`
- **React Peer Dependency**: `19.0.0`
- **Hermes Engine**: `v1.0-default`
- **Metro Bundler**: `^0.85.0`
- **Android Toolchain**: AGP `8.9.0` · Gradle `8.12` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

---

## 📅 2026-02-11 — `v0.84.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.84.0                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ Hermes V1 Compiler & Static Optimization Pipeline    │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Hermes V1 Default & Node 22.11 Baseline — [source](https://github.com/facebook/react-native/releases/tag/v0.84.0)

### 4. Peer Dependencies

```
- **Node.js**: `>= 22.11`
- **React Peer Dependency**: `19.0.0`
- **Hermes Engine**: `v1.0-default`
- **Metro Bundler**: `^0.85.0`
- **Android Toolchain**: AGP `8.9.0` · Gradle `8.12` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

---

## 📅 2026-06-25 — `v0.83.10` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.83.10                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.83.10)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.83-bundled`
- **Metro Bundler**: `^0.84.0`
- **Android Toolchain**: AGP `8.8.1` · Gradle `8.12` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Worklets `0.12.x` + RN `0.83`–`0.87`
  - [source](https://registry.npmjs.org/react-native-worklets/0.12.0)

---

## 📅 2026-04-27 — `v0.83.9` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.83.9                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.83.9)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.83-bundled`
- **Metro Bundler**: `^0.84.0`
- **Android Toolchain**: AGP `8.8.1` · Gradle `8.12` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Worklets `0.12.x` + RN `0.83`–`0.87`
  - [source](https://registry.npmjs.org/react-native-worklets/0.12.0)

---

## 📅 2026-04-24 — `v0.83.8` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.83.8                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.83.8)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.83-bundled`
- **Metro Bundler**: `^0.84.0`
- **Android Toolchain**: AGP `8.8.1` · Gradle `8.12` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Worklets `0.12.x` + RN `0.83`–`0.87`
  - [source](https://registry.npmjs.org/react-native-worklets/0.12.0)

---

## 📅 2026-04-24 — `v0.83.7` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.83.7                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.83.7)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.83-bundled`
- **Metro Bundler**: `^0.84.0`
- **Android Toolchain**: AGP `8.8.1` · Gradle `8.12` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Worklets `0.12.x` + RN `0.83`–`0.87`
  - [source](https://registry.npmjs.org/react-native-worklets/0.12.0)

---

## 📅 2026-04-16 — `v0.83.6` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.83.6                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.83.6)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.83-bundled`
- **Metro Bundler**: `^0.84.0`
- **Android Toolchain**: AGP `8.8.1` · Gradle `8.12` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Worklets `0.12.x` + RN `0.83`–`0.87`
  - [source](https://registry.npmjs.org/react-native-worklets/0.12.0)

---

## 📅 2026-04-14 — `v0.83.5` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.83.5                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.83.5)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.83-bundled`
- **Metro Bundler**: `^0.84.0`
- **Android Toolchain**: AGP `8.8.1` · Gradle `8.12` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Worklets `0.12.x` + RN `0.83`–`0.87`
  - [source](https://registry.npmjs.org/react-native-worklets/0.12.0)

---

## 📅 2026-03-06 — `v0.83.4` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.83.4                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.83.4)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.83-bundled`
- **Metro Bundler**: `^0.84.0`
- **Android Toolchain**: AGP `8.8.1` · Gradle `8.12` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Worklets `0.12.x` + RN `0.83`–`0.87`
  - [source](https://registry.npmjs.org/react-native-worklets/0.12.0)

---

## 📅 2026-03-05 — `v0.83.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.83.3                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.83.3)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.83-bundled`
- **Metro Bundler**: `^0.84.0`
- **Android Toolchain**: AGP `8.8.1` · Gradle `8.12` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Worklets `0.12.x` + RN `0.83`–`0.87`
  - [source](https://registry.npmjs.org/react-native-worklets/0.12.0)

---

## 📅 2026-02-05 — `v0.83.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.83.2                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.83.2)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.83-bundled`
- **Metro Bundler**: `^0.84.0`
- **Android Toolchain**: AGP `8.8.1` · Gradle `8.12` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Worklets `0.12.x` + RN `0.83`–`0.87`
  - [source](https://registry.npmjs.org/react-native-worklets/0.12.0)

---

## 📅 2025-12-18 — `v0.83.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.83.1                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.83.1)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.83-bundled`
- **Metro Bundler**: `^0.84.0`
- **Android Toolchain**: AGP `8.8.1` · Gradle `8.12` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Worklets `0.12.x` + RN `0.83`–`0.87`
  - [source](https://registry.npmjs.org/react-native-worklets/0.12.0)

---

## 📅 2025-12-10 — `v0.83.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.83.0                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**💥 BREAKING** (1)
- Bridgeless TurboModule Enforcing Mode — [source](https://github.com/facebook/react-native/releases/tag/v0.83.0)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.83-bundled`
- **Metro Bundler**: `^0.84.0`
- **Android Toolchain**: AGP `8.8.1` · Gradle `8.12` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Worklets `0.12.x` + RN `0.83`–`0.87`
  - [source](https://registry.npmjs.org/react-native-worklets/0.12.0)

---

## 📅 2025-10-20 — `v0.82.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.82.1                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ RCTBridge Native API Elimination                     │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.82.1)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.82-bundled`
- **Metro Bundler**: `^0.83.0`
- **Android Toolchain**: AGP `8.8.0` · Gradle `8.11.1` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** worklets-core `1.6.3` + RN `>=0.82` (Hermes lib rename)
  - n/a for ≥0.82 after fix; pre-fix builds could fail linking `libhermes` vs `hermesvm`
  - [source](`packages/react-native-worklets-core/majors/1/minors/6/patches/3.md`)

---

## 📅 2025-10-08 — `v0.82.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.82.0                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal, P... │
│ DEPRECATED   │ RCTBridge Native API Elimination                     │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**💥 BREAKING** (1)
- OLD ARCHITECTURE (PAPER / BRIDGE) PERMANENT REMOVAL — [source](https://github.com/facebook/react-native/releases/tag/v0.82.0)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.82-bundled`
- **Metro Bundler**: `^0.83.0`
- **Android Toolchain**: AGP `8.8.0` · Gradle `8.11.1` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 16.0` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** worklets-core `1.6.3` + RN `>=0.82` (Hermes lib rename)
  - n/a for ≥0.82 after fix; pre-fix builds could fail linking `libhermes` vs `hermesvm`
  - [source](`packages/react-native-worklets-core/majors/1/minors/6/patches/3.md`)

---

## 📅 2026-02-05 — `v0.81.6` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.81.6                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.81.6)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.81-bundled`
- **Metro Bundler**: `^0.82.2`
- **Android Toolchain**: AGP `8.7.3` · Gradle `8.11.1` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

---

## 📅 2025-10-21 — `v0.81.5` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.81.5                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.81.5)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.81-bundled`
- **Metro Bundler**: `^0.82.2`
- **Android Toolchain**: AGP `8.7.3` · Gradle `8.11.1` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

---

## 📅 2025-09-10 — `v0.81.4` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.81.4                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.81.4)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.81-bundled`
- **Metro Bundler**: `^0.82.2`
- **Android Toolchain**: AGP `8.7.3` · Gradle `8.11.1` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

---

## 📅 2025-09-10 — `v0.81.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.81.3                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.81.3)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.81-bundled`
- **Metro Bundler**: `^0.82.2`
- **Android Toolchain**: AGP `8.7.3` · Gradle `8.11.1` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

---

## 📅 2025-09-09 — `v0.81.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.81.2                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.81.2)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.81-bundled`
- **Metro Bundler**: `^0.82.2`
- **Android Toolchain**: AGP `8.7.3` · Gradle `8.11.1` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

---

## 📅 2025-08-27 — `v0.81.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.81.1                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.81.1)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.81-bundled`
- **Metro Bundler**: `^0.82.2`
- **Android Toolchain**: AGP `8.7.3` · Gradle `8.11.1` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

---

## 📅 2025-08-12 — `v0.81.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.81.0                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**⚡ PERF** (1)
- Fabric ShadowNode Recycling & Web Font Metric Alignment — [source](https://github.com/facebook/react-native/releases/tag/v0.81.0)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.81-bundled`
- **Metro Bundler**: `^0.82.2`
- **Android Toolchain**: AGP `8.7.3` · Gradle `8.11.1` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

---

## 📅 2026-01-26 — `v0.80.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.80.3                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.80.3)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.80-bundled`
- **Metro Bundler**: `^0.82.0`
- **Android Toolchain**: AGP `8.7.2` · Gradle `8.11` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Reanimated `4.0.x` + RN `0.80` / `0.81`
  - [source](`packages/react-native-reanimated/majors/4/minors/0/patches/0.md` ; docs table)
✅ **GOOD** RNGH `2.26.0` + RN `0.80`; `2.28.0` + RN `0.81`; `2.30.0` + RN `0.83`; `2.31.1` + RN `0.85`
  - [source](corresponding `packages/react-native-gesture-handler/majors/2/minors/{26,28,30,31}/patches/*.md`)

---

## 📅 2025-07-24 — `v0.80.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.80.2                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.80.2)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.80-bundled`
- **Metro Bundler**: `^0.82.0`
- **Android Toolchain**: AGP `8.7.2` · Gradle `8.11` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Reanimated `4.0.x` + RN `0.80` / `0.81`
  - [source](`packages/react-native-reanimated/majors/4/minors/0/patches/0.md` ; docs table)
✅ **GOOD** RNGH `2.26.0` + RN `0.80`; `2.28.0` + RN `0.81`; `2.30.0` + RN `0.83`; `2.31.1` + RN `0.85`
  - [source](corresponding `packages/react-native-gesture-handler/majors/2/minors/{26,28,30,31}/patches/*.md`)

---

## 📅 2025-06-30 — `v0.80.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.80.1                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.80.1)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.80-bundled`
- **Metro Bundler**: `^0.82.0`
- **Android Toolchain**: AGP `8.7.2` · Gradle `8.11` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Reanimated `4.0.x` + RN `0.80` / `0.81`
  - [source](`packages/react-native-reanimated/majors/4/minors/0/patches/0.md` ; docs table)
✅ **GOOD** RNGH `2.26.0` + RN `0.80`; `2.28.0` + RN `0.81`; `2.30.0` + RN `0.83`; `2.31.1` + RN `0.85`
  - [source](corresponding `packages/react-native-gesture-handler/majors/2/minors/{26,28,30,31}/patches/*.md`)

---

## 📅 2025-06-12 — `v0.80.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.80.0                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Hermes V1 Compiler & Static Optimization Pipeline    │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Chrome DevTools Protocol & Hermes Static Analysis — [source](https://github.com/facebook/react-native/releases/tag/v0.80.0)

### 4. Peer Dependencies

```
- **Node.js**: `>= 20.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.80-bundled`
- **Metro Bundler**: `^0.82.0`
- **Android Toolchain**: AGP `8.7.2` · Gradle `8.11` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Reanimated `4.0.x` + RN `0.80` / `0.81`
  - [source](`packages/react-native-reanimated/majors/4/minors/0/patches/0.md` ; docs table)
✅ **GOOD** RNGH `2.26.0` + RN `0.80`; `2.28.0` + RN `0.81`; `2.30.0` + RN `0.83`; `2.31.1` + RN `0.85`
  - [source](corresponding `packages/react-native-gesture-handler/majors/2/minors/{26,28,30,31}/patches/*.md`)

---

## 📅 2025-10-21 — `v0.79.7` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.79.7                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.79.7)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.79-bundled`
- **Metro Bundler**: `^0.81.4`
- **Android Toolchain**: AGP `8.7.0` · Gradle `8.10.2` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

---

## 📅 2025-08-14 — `v0.79.6` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.79.6                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.79.6)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.79-bundled`
- **Metro Bundler**: `^0.81.4`
- **Android Toolchain**: AGP `8.7.0` · Gradle `8.10.2` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

---

## 📅 2025-07-01 — `v0.79.5` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.79.5                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.79.5)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.79-bundled`
- **Metro Bundler**: `^0.81.4`
- **Android Toolchain**: AGP `8.7.0` · Gradle `8.10.2` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

---

## 📅 2025-06-17 — `v0.79.4` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.79.4                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.79.4)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.79-bundled`
- **Metro Bundler**: `^0.81.4`
- **Android Toolchain**: AGP `8.7.0` · Gradle `8.10.2` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

---

## 📅 2025-06-04 — `v0.79.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.79.3                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.79.3)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.79-bundled`
- **Metro Bundler**: `^0.81.4`
- **Android Toolchain**: AGP `8.7.0` · Gradle `8.10.2` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

---

## 📅 2025-05-01 — `v0.79.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.79.2                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.79.2)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.79-bundled`
- **Metro Bundler**: `^0.81.4`
- **Android Toolchain**: AGP `8.7.0` · Gradle `8.10.2` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

---

## 📅 2025-04-15 — `v0.79.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.79.1                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.79.1)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.79-bundled`
- **Metro Bundler**: `^0.81.4`
- **Android Toolchain**: AGP `8.7.0` · Gradle `8.10.2` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

---

## 📅 2025-04-08 — `v0.79.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.79.0                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**⚡ PERF** (1)
- Synchronous TurboModule JSI Hardening — [source](https://github.com/facebook/react-native/releases/tag/v0.79.0)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.79-bundled`
- **Metro Bundler**: `^0.81.4`
- **Android Toolchain**: AGP `8.7.0` · Gradle `8.10.2` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

---

## 📅 2025-07-09 — `v0.78.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.78.3                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.78.3)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.78-bundled`
- **Metro Bundler**: `^0.81.3`
- **Android Toolchain**: AGP `8.6.1` · Gradle `8.10` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

💥 **BROKE** Reanimated `4.2.0` + RN `0.78`
  - Release explicitly “Drop compatibility for React Native 0.78”
  - [source](`packages/react-native-reanimated/majors/4/minors/2/patches/0.md` (card “Drop compatibility for React Native 0.78”) ; https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/)
✅ **GOOD** Reanimated `3.19.x` + RN `0.78`–`0.81` (Paper and Fabric per docs)
  - [source](https://docs.swmansion.com/react-native-reanimated/docs/3.x/guides/compatibility/)
💥 **BROKE** RNGH `2.25.0` + `react-native` (Signal S1)
  - RNGH Pressable stops working because isTouchPropagationAllowed is stuck false
  - [source](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)

---

## 📅 2025-04-01 — `v0.78.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.78.2                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.78.2)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.78-bundled`
- **Metro Bundler**: `^0.81.3`
- **Android Toolchain**: AGP `8.6.1` · Gradle `8.10` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

💥 **BROKE** Reanimated `4.2.0` + RN `0.78`
  - Release explicitly “Drop compatibility for React Native 0.78”
  - [source](`packages/react-native-reanimated/majors/4/minors/2/patches/0.md` (card “Drop compatibility for React Native 0.78”) ; https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/)
✅ **GOOD** Reanimated `3.19.x` + RN `0.78`–`0.81` (Paper and Fabric per docs)
  - [source](https://docs.swmansion.com/react-native-reanimated/docs/3.x/guides/compatibility/)
💥 **BROKE** RNGH `2.25.0` + `react-native` (Signal S1)
  - RNGH Pressable stops working because isTouchPropagationAllowed is stuck false
  - [source](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)

---

## 📅 2025-03-19 — `v0.78.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.78.1                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.78.1)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.78-bundled`
- **Metro Bundler**: `^0.81.3`
- **Android Toolchain**: AGP `8.6.1` · Gradle `8.10` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

💥 **BROKE** Reanimated `4.2.0` + RN `0.78`
  - Release explicitly “Drop compatibility for React Native 0.78”
  - [source](`packages/react-native-reanimated/majors/4/minors/2/patches/0.md` (card “Drop compatibility for React Native 0.78”) ; https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/)
✅ **GOOD** Reanimated `3.19.x` + RN `0.78`–`0.81` (Paper and Fabric per docs)
  - [source](https://docs.swmansion.com/react-native-reanimated/docs/3.x/guides/compatibility/)
💥 **BROKE** RNGH `2.25.0` + `react-native` (Signal S1)
  - RNGH Pressable stops working because isTouchPropagationAllowed is stuck false
  - [source](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)

---

## 📅 2025-02-19 — `v0.78.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.78.0                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ React 19 Concurrency & Compiler Compatibility        │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**✨ FEAT** (1)
- React 19 Concurrent Primitives & ShadowNode Recycling — [source](https://github.com/facebook/react-native/releases/tag/v0.78.0)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.78-bundled`
- **Metro Bundler**: `^0.81.3`
- **Android Toolchain**: AGP `8.6.1` · Gradle `8.10` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.2`
```

### 5. Cross-Dependency Compat (relevant combos)

💥 **BROKE** Reanimated `4.2.0` + RN `0.78`
  - Release explicitly “Drop compatibility for React Native 0.78”
  - [source](`packages/react-native-reanimated/majors/4/minors/2/patches/0.md` (card “Drop compatibility for React Native 0.78”) ; https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/)
✅ **GOOD** Reanimated `3.19.x` + RN `0.78`–`0.81` (Paper and Fabric per docs)
  - [source](https://docs.swmansion.com/react-native-reanimated/docs/3.x/guides/compatibility/)
💥 **BROKE** RNGH `2.25.0` + `react-native` (Signal S1)
  - RNGH Pressable stops working because isTouchPropagationAllowed is stuck false
  - [source](https://github.com/software-mansion/react-native-gesture-handler/issues/3476)

---

## 📅 2025-07-21 — `v0.77.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.77.3                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ React 19 Concurrency & Compiler Compatibility        │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.77.3)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.77-bundled`
- **Metro Bundler**: `^0.81.0`
- **Android Toolchain**: AGP `8.6.0` · Gradle `8.10` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.1`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Reanimated `3.16.7` + RN `0.77` (example of patch-added support)
  - [source](`packages/react-native-reanimated/majors/3/minors/16/patches/7.md` ; https://docs.swmansion.com/react-native-reanimated/docs/3.x/guides/compatibility/)

---

## 📅 2025-03-25 — `v0.77.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.77.2                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ React 19 Concurrency & Compiler Compatibility        │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.77.2)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.77-bundled`
- **Metro Bundler**: `^0.81.0`
- **Android Toolchain**: AGP `8.6.0` · Gradle `8.10` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.1`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Reanimated `3.16.7` + RN `0.77` (example of patch-added support)
  - [source](`packages/react-native-reanimated/majors/3/minors/16/patches/7.md` ; https://docs.swmansion.com/react-native-reanimated/docs/3.x/guides/compatibility/)

---

## 📅 2025-02-13 — `v0.77.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.77.1                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ React 19 Concurrency & Compiler Compatibility        │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.77.1)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.77-bundled`
- **Metro Bundler**: `^0.81.0`
- **Android Toolchain**: AGP `8.6.0` · Gradle `8.10` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.1`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Reanimated `3.16.7` + RN `0.77` (example of patch-added support)
  - [source](`packages/react-native-reanimated/majors/3/minors/16/patches/7.md` ; https://docs.swmansion.com/react-native-reanimated/docs/3.x/guides/compatibility/)

---

## 📅 2025-01-21 — `v0.77.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.77.0                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ Swift iOS Project Template Support                   │
│ EXPERIMENTAL │ React 19 Concurrency & Compiler Compatibility        │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Swift Template Support & CMake Modernization — [source](https://github.com/facebook/react-native/releases/tag/v0.77.0)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.77-bundled`
- **Metro Bundler**: `^0.81.0`
- **Android Toolchain**: AGP `8.6.0` · Gradle `8.10` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.1`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Reanimated `3.16.7` + RN `0.77` (example of patch-added support)
  - [source](`packages/react-native-reanimated/majors/3/minors/16/patches/7.md` ; https://docs.swmansion.com/react-native-reanimated/docs/3.x/guides/compatibility/)

---

## 📅 2025-04-03 — `v0.76.9` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.76.9                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ React 19 Concurrency & Compiler Compatibility        │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.76.9)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.76-bundled`
- **Metro Bundler**: `^0.80.12`
- **Android Toolchain**: AGP `8.5.1` · Gradle `8.8` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.0`
```

---

## 📅 2025-03-26 — `v0.76.8` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.76.8                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ React 19 Concurrency & Compiler Compatibility        │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.76.8)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.76-bundled`
- **Metro Bundler**: `^0.80.12`
- **Android Toolchain**: AGP `8.5.1` · Gradle `8.8` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.0`
```

---

## 📅 2025-02-05 — `v0.76.7` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.76.7                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ React 19 Concurrency & Compiler Compatibility        │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.76.7)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.76-bundled`
- **Metro Bundler**: `^0.80.12`
- **Android Toolchain**: AGP `8.5.1` · Gradle `8.8` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.0`
```

---

## 📅 2025-01-09 — `v0.76.6` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.76.6                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ React 19 Concurrency & Compiler Compatibility        │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.76.6)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.76-bundled`
- **Metro Bundler**: `^0.80.12`
- **Android Toolchain**: AGP `8.5.1` · Gradle `8.8` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.0`
```

---

## 📅 2024-12-09 — `v0.76.5` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.76.5                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ React 19 Concurrency & Compiler Compatibility        │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.76.5)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.76-bundled`
- **Metro Bundler**: `^0.80.12`
- **Android Toolchain**: AGP `8.5.1` · Gradle `8.8` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.0`
```

---

## 📅 2024-12-06 — `v0.76.4` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.76.4                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ React 19 Concurrency & Compiler Compatibility        │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.76.4)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.76-bundled`
- **Metro Bundler**: `^0.80.12`
- **Android Toolchain**: AGP `8.5.1` · Gradle `8.8` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.0`
```

---

## 📅 2024-11-21 — `v0.76.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.76.3                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ React 19 Concurrency & Compiler Compatibility        │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.76.3)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.76-bundled`
- **Metro Bundler**: `^0.80.12`
- **Android Toolchain**: AGP `8.5.1` · Gradle `8.8` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.0`
```

---

## 📅 2024-11-14 — `v0.76.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.76.2                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ React 19 Concurrency & Compiler Compatibility        │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.76.2)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.76-bundled`
- **Metro Bundler**: `^0.80.12`
- **Android Toolchain**: AGP `8.5.1` · Gradle `8.8` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.0`
```

---

## 📅 2024-10-29 — `v0.76.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.76.1                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ React 19 Concurrency & Compiler Compatibility        │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.76.1)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.76-bundled`
- **Metro Bundler**: `^0.80.12`
- **Android Toolchain**: AGP `8.5.1` · Gradle `8.8` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.0`
```

---

## 📅 2024-10-23 — `v0.76.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.76.0                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ Permanent removal of Old Architecture (Paper / Br... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ Bridgeless Mode Architecture (direct JSI / TurboM... │
│ EXPERIMENTAL │ React 19 Concurrency & Compiler Compatibility        │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**💥 BREAKING** (1)
- NEW ARCHITECTURE ENABLED BY DEFAULT & React 19 — [source](https://github.com/facebook/react-native/releases/tag/v0.76.0)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.18`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.76-bundled`
- **Metro Bundler**: `^0.80.12`
- **Android Toolchain**: AGP `8.5.1` · Gradle `8.8` · Target SDK `35`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `16.0`
```

---

## 📅 2025-02-06 — `v0.75.5` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.75.5                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.75.5)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.75-bundled`
- **Metro Bundler**: `^0.80.9`
- **Android Toolchain**: AGP `8.3.2` · Gradle `8.8` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `15.4`
```

---

## 📅 2024-10-02 — `v0.75.4` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.75.4                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.75.4)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.75-bundled`
- **Metro Bundler**: `^0.80.9`
- **Android Toolchain**: AGP `8.3.2` · Gradle `8.8` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `15.4`
```

---

## 📅 2024-09-11 — `v0.75.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.75.3                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.75.3)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.75-bundled`
- **Metro Bundler**: `^0.80.9`
- **Android Toolchain**: AGP `8.3.2` · Gradle `8.8` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `15.4`
```

---

## 📅 2024-08-20 — `v0.75.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.75.2                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.75.2)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.75-bundled`
- **Metro Bundler**: `^0.80.9`
- **Android Toolchain**: AGP `8.3.2` · Gradle `8.8` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `15.4`
```

---

## 📅 2024-08-15 — `v0.75.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.75.1                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.75.1)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.75-bundled`
- **Metro Bundler**: `^0.80.9`
- **Android Toolchain**: AGP `8.3.2` · Gradle `8.8` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `15.4`
```

---

## 📅 2024-08-14 — `v0.75.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.75.0                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ C++ Native Autolinking Engine                        │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Autolinking C++ & Template Diet — [source](https://github.com/facebook/react-native/releases/tag/v0.75.0)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.3.1`
- **Hermes Engine**: `0.75-bundled`
- **Metro Bundler**: `^0.80.9`
- **Android Toolchain**: AGP `8.3.2` · Gradle `8.8` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 15.1` · Xcode `15.4`
```

---

## 📅 2025-01-27 — `v0.74.7` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.74.7                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.74.7)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.74-bundled`
- **Metro Bundler**: `^0.80.8`
- **Android Toolchain**: AGP `8.2.1` · Gradle `8.6` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2024-10-02 — `v0.74.6` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.74.6                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.74.6)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.74-bundled`
- **Metro Bundler**: `^0.80.8`
- **Android Toolchain**: AGP `8.2.1` · Gradle `8.6` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2024-08-05 — `v0.74.5` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.74.5                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.74.5)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.74-bundled`
- **Metro Bundler**: `^0.80.8`
- **Android Toolchain**: AGP `8.2.1` · Gradle `8.6` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2024-07-30 — `v0.74.4` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.74.4                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.74.4)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.74-bundled`
- **Metro Bundler**: `^0.80.8`
- **Android Toolchain**: AGP `8.2.1` · Gradle `8.6` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2024-07-01 — `v0.74.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.74.3                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.74.3)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.74-bundled`
- **Metro Bundler**: `^0.80.8`
- **Android Toolchain**: AGP `8.2.1` · Gradle `8.6` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2024-06-04 — `v0.74.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.74.2                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.74.2)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.74-bundled`
- **Metro Bundler**: `^0.80.8`
- **Android Toolchain**: AGP `8.2.1` · Gradle `8.6` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2024-05-02 — `v0.74.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.74.1                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.74.1)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.74-bundled`
- **Metro Bundler**: `^0.80.8`
- **Android Toolchain**: AGP `8.2.1` · Gradle `8.6` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2024-04-22 — `v0.74.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.74.0                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ Flipper Desktop Debugger Deprecation & Removal       │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ Yoga 3.0 Layout Engine (strict standard rounding)... │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**💥 BREAKING** (1)
- Yoga 3.0 & Bridgeless Default on New Architecture — [source](https://github.com/facebook/react-native/releases/tag/v0.74.0)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.74-bundled`
- **Metro Bundler**: `^0.80.8`
- **Android Toolchain**: AGP `8.2.1` · Gradle `8.6` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2024-11-12 — `v0.73.11` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.73.11                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Flipper Desktop Debugger Deprecation & Removal, V... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.73.11)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.73-bundled`
- **Metro Bundler**: `^0.80.3`
- **Android Toolchain**: AGP `8.1.4` · Gradle `8.3` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2024-10-08 — `v0.73.10` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.73.10                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Flipper Desktop Debugger Deprecation & Removal, V... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.73.10)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.73-bundled`
- **Metro Bundler**: `^0.80.3`
- **Android Toolchain**: AGP `8.1.4` · Gradle `8.3` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2024-07-09 — `v0.73.9` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.73.9                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Flipper Desktop Debugger Deprecation & Removal, V... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.73.9)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.73-bundled`
- **Metro Bundler**: `^0.80.3`
- **Android Toolchain**: AGP `8.1.4` · Gradle `8.3` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2024-04-30 — `v0.73.8` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.73.8                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Flipper Desktop Debugger Deprecation & Removal, V... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.73.8)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.73-bundled`
- **Metro Bundler**: `^0.80.3`
- **Android Toolchain**: AGP `8.1.4` · Gradle `8.3` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2024-04-18 — `v0.73.7` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.73.7                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Flipper Desktop Debugger Deprecation & Removal, V... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.73.7)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.73-bundled`
- **Metro Bundler**: `^0.80.3`
- **Android Toolchain**: AGP `8.1.4` · Gradle `8.3` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2024-03-11 — `v0.73.6` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.73.6                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Flipper Desktop Debugger Deprecation & Removal, V... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.73.6)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.73-bundled`
- **Metro Bundler**: `^0.80.3`
- **Android Toolchain**: AGP `8.1.4` · Gradle `8.3` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2024-02-26 — `v0.73.5` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.73.5                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Flipper Desktop Debugger Deprecation & Removal, V... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.73.5)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.73-bundled`
- **Metro Bundler**: `^0.80.3`
- **Android Toolchain**: AGP `8.1.4` · Gradle `8.3` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2024-02-06 — `v0.73.4` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.73.4                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Flipper Desktop Debugger Deprecation & Removal, V... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.73.4)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.73-bundled`
- **Metro Bundler**: `^0.80.3`
- **Android Toolchain**: AGP `8.1.4` · Gradle `8.3` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2024-01-29 — `v0.73.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.73.3                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Flipper Desktop Debugger Deprecation & Removal, V... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.73.3)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.73-bundled`
- **Metro Bundler**: `^0.80.3`
- **Android Toolchain**: AGP `8.1.4` · Gradle `8.3` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2024-01-08 — `v0.73.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.73.2                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Flipper Desktop Debugger Deprecation & Removal, V... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.73.2)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.73-bundled`
- **Metro Bundler**: `^0.80.3`
- **Android Toolchain**: AGP `8.1.4` · Gradle `8.3` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2023-12-18 — `v0.73.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.73.1                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Flipper Desktop Debugger Deprecation & Removal, V... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.73.1)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.73-bundled`
- **Metro Bundler**: `^0.80.3`
- **Android Toolchain**: AGP `8.1.4` · Gradle `8.3` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2023-12-06 — `v0.73.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.73.0                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ Flipper Desktop Debugger Deprecation & Removal, V... │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ Kotlin Default for Android Project Template          │
│ EXPERIMENTAL │ Bridgeless Mode Architecture (direct JSI / TurboM... │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**✨ FEAT** (1)
- Bridgeless Mode (Experimental), Kotlin Template & Android 14 — [source](https://github.com/facebook/react-native/releases/tag/v0.73.0)

### 4. Peer Dependencies

```
- **Node.js**: `>= 18.0`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.73-bundled`
- **Metro Bundler**: `^0.80.3`
- **Android Toolchain**: AGP `8.1.4` · Gradle `8.3` · Target SDK `34`
- **iOS Toolchain**: Deployment Target `iOS 13.4` · Xcode `15.0`
```

---

## 📅 2024-08-19 — `v0.72.17` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.72.17                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.72.17)

### 4. Peer Dependencies

```
- **Node.js**: `>= 16.14`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.72-bundled`
- **Metro Bundler**: `^0.76.7`
- **Android Toolchain**: AGP `7.4.2` · Gradle `8.0.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2024-06-12 — `v0.72.15` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.72.15                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.72.15)

### 4. Peer Dependencies

```
- **Node.js**: `>= 16.14`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.72-bundled`
- **Metro Bundler**: `^0.76.7`
- **Android Toolchain**: AGP `7.4.2` · Gradle `8.0.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2024-04-30 — `v0.72.14` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.72.14                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.72.14)

### 4. Peer Dependencies

```
- **Node.js**: `>= 16.14`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.72-bundled`
- **Metro Bundler**: `^0.76.7`
- **Android Toolchain**: AGP `7.4.2` · Gradle `8.0.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2024-04-18 — `v0.72.13` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.72.13                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.72.13)

### 4. Peer Dependencies

```
- **Node.js**: `>= 16.14`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.72-bundled`
- **Metro Bundler**: `^0.76.7`
- **Android Toolchain**: AGP `7.4.2` · Gradle `8.0.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2024-03-11 — `v0.72.12` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.72.12                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.72.12)

### 4. Peer Dependencies

```
- **Node.js**: `>= 16.14`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.72-bundled`
- **Metro Bundler**: `^0.76.7`
- **Android Toolchain**: AGP `7.4.2` · Gradle `8.0.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2024-02-28 — `v0.72.11` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.72.11                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.72.11)

### 4. Peer Dependencies

```
- **Node.js**: `>= 16.14`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.72-bundled`
- **Metro Bundler**: `^0.76.7`
- **Android Toolchain**: AGP `7.4.2` · Gradle `8.0.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2024-01-18 — `v0.72.10` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.72.10                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.72.10)

### 4. Peer Dependencies

```
- **Node.js**: `>= 16.14`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.72-bundled`
- **Metro Bundler**: `^0.76.7`
- **Android Toolchain**: AGP `7.4.2` · Gradle `8.0.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2024-01-08 — `v0.72.9` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.72.9                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.72.9)

### 4. Peer Dependencies

```
- **Node.js**: `>= 16.14`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.72-bundled`
- **Metro Bundler**: `^0.76.7`
- **Android Toolchain**: AGP `7.4.2` · Gradle `8.0.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-12-20 — `v0.72.8` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.72.8                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.72.8)

### 4. Peer Dependencies

```
- **Node.js**: `>= 16.14`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.72-bundled`
- **Metro Bundler**: `^0.76.7`
- **Android Toolchain**: AGP `7.4.2` · Gradle `8.0.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-11-14 — `v0.72.7` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.72.7                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.72.7)

### 4. Peer Dependencies

```
- **Node.js**: `>= 16.14`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.72-bundled`
- **Metro Bundler**: `^0.76.7`
- **Android Toolchain**: AGP `7.4.2` · Gradle `8.0.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-10-12 — `v0.72.6` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.72.6                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.72.6)

### 4. Peer Dependencies

```
- **Node.js**: `>= 16.14`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.72-bundled`
- **Metro Bundler**: `^0.76.7`
- **Android Toolchain**: AGP `7.4.2` · Gradle `8.0.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-09-25 — `v0.72.5` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.72.5                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.72.5)

### 4. Peer Dependencies

```
- **Node.js**: `>= 16.14`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.72-bundled`
- **Metro Bundler**: `^0.76.7`
- **Android Toolchain**: AGP `7.4.2` · Gradle `8.0.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-08-14 — `v0.72.4` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.72.4                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.72.4)

### 4. Peer Dependencies

```
- **Node.js**: `>= 16.14`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.72-bundled`
- **Metro Bundler**: `^0.76.7`
- **Android Toolchain**: AGP `7.4.2` · Gradle `8.0.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-07-12 — `v0.72.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.72.3                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.72.3)

### 4. Peer Dependencies

```
- **Node.js**: `>= 16.14`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.72-bundled`
- **Metro Bundler**: `^0.76.7`
- **Android Toolchain**: AGP `7.4.2` · Gradle `8.0.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-07-11 — `v0.72.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.72.2                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.72.2)

### 4. Peer Dependencies

```
- **Node.js**: `>= 16.14`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.72-bundled`
- **Metro Bundler**: `^0.76.7`
- **Android Toolchain**: AGP `7.4.2` · Gradle `8.0.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-06-29 — `v0.72.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.72.1                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.72.1)

### 4. Peer Dependencies

```
- **Node.js**: `>= 16.14`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.72-bundled`
- **Metro Bundler**: `^0.76.7`
- **Android Toolchain**: AGP `7.4.2` · Gradle `8.0.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-06-21 — `v0.72.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.72.0                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ First-class Metro Symlink & Package Exports Support  │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**✨ FEAT** (1)
- Metro Symlink Support & Package Exports — [source](https://github.com/facebook/react-native/releases/tag/v0.72.0)

### 4. Peer Dependencies

```
- **Node.js**: `>= 16.14`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.72-bundled`
- **Metro Bundler**: `^0.76.7`
- **Android Toolchain**: AGP `7.4.2` · Gradle `8.0.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2024-04-29 — `v0.71.19` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.19                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.71.19)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2024-04-09 — `v0.71.18` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.18                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.71.18)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2024-02-27 — `v0.71.17` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.17                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.71.17)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2024-01-30 — `v0.71.16` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.16                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.71.16)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2024-01-08 — `v0.71.15` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.15                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.71.15)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-10-12 — `v0.71.14` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.14                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.71.14)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-08-22 — `v0.71.13` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.13                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.71.13)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-07-04 — `v0.71.12` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.12                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.71.12)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-06-14 — `v0.71.11` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.11                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.71.11)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-06-07 — `v0.71.10` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.10                                │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.71.10)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-06-07 — `v0.71.9` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.9                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.71.9)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-05-10 — `v0.71.8` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.8                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.71.8)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-04-19 — `v0.71.7` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.7                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.71.7)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-04-03 — `v0.71.6` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.6                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.71.6)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-03-29 — `v0.71.5` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.5                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.71.5)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-03-08 — `v0.71.4` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.4                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.71.4)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-02-14 — `v0.71.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.3                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.71.3)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-02-01 — `v0.71.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.2                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.71.2)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-01-19 — `v0.71.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.1                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🚀 MIGRATION** (1)
- Maintenance & Fix Release — [source](https://github.com/facebook/react-native/releases/tag/v0.71.1)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```

---

## 📅 2023-01-12 — `v0.71.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native@0.71.0                                 │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ ViewPropTypes and ColorPropType permanently deleted  │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ Hermes Default JavaScript Engine, Default TypeScr... │
│ NEW          │ Hermes Default JavaScript Engine, Default TypeScr... │
│ EXPERIMENTAL │ New Architecture (Fabric + TurboModules) default     │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**✨ FEAT** (1)
- New Architecture Opt-In, Default TypeScript & Hermes — [source](https://github.com/facebook/react-native/releases/tag/v0.71.0)

### 4. Peer Dependencies

```
- **Node.js**: `>= 14.18`
- **React Peer Dependency**: `18.2.0`
- **Hermes Engine**: `0.71-bundled`
- **Metro Bundler**: `^0.73.7`
- **Android Toolchain**: AGP `7.3.1` · Gradle `7.5.1` · Target SDK `33`
- **iOS Toolchain**: Deployment Target `iOS 12.4` · Xcode `14.0`
```


---

## Audit Integrity

- **Versions covered**: 124
- **Archive source**: Chronos/Grok rn-terrain corpus (extracted 2026-09-26)
- **Combos cross-referenced**: 19 relevant combos
- **Signals cross-referenced**: 0 Chronos signals
- **Audit vector**: Present ➔ Past (0.87.1 ➔ 0.71.0)
