---
title: "React Native Worklets Core (Margelo) — Reverse-Chronological Audit"
package: "react-native-worklets-core"
latest_stable: "1.6.3"
_generated_at: "2026-09-26T12:01:32Z"
_shard_hash: "0aa0f280640f"
audit_vector: "present → past (1.6.3 ➔ oldest)"
source: "TCDI Chronos Archive + Grok/Chronos signals"
---

# React Native Worklets Core (Margelo) — Reverse-Chronological Audit Ledger

> **Audit vector**: Present ➔ Past. Starts at **1.6.3** (latest stable as of ingest, September 2026) and walks backward without skipping any minor or patch.
>
> **Coverage**: 24 versions
>
> **6-State kernel**: REMOVED | DEPRECATED | BROKEN | FUNCTIONAL | NEW | EXPERIMENTAL

---

## 🟡 **BETA** — `2.0.0-beta.4`

> _Beta channel only. Leaf may be partial. Treat as pre-release._

---

---

## 📅 2026-02-12 — `v1.6.3` 🟢 **LATEST STABLE**

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@1.6.3                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ `librnworklets.so` still 0x1000 align — fails 16 ... │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Rename libhermes to hermesvm for RN >= 82 ([#262](https://github.com/margelo/react-native- — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.6.3)

### 3. Active Signals (3 known issues at this version)

- **[HIGH]** `librnworklets.so` still 0x1000 align — fails 16 KB requirement *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/260)
- **[HIGH]** Android class name collision with Software Mansion worklets on RN 0.83+ *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)
- **[HIGH]** 1.1.1: Frame Processors are not available *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/172)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/1.6.3`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** worklets-core `1.6.3` + RN `>=0.82` (Hermes lib rename)
  - n/a for ≥0.82 after fix; pre-fix builds could fail linking `libhermes` vs `hermesvm`
  - [source](`packages/react-native-worklets-core/majors/1/minors/6/patches/3.md`)

---

## 📅 2025-08-06 — `v1.6.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@1.6.2                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ `librnworklets.so` still 0x1000 align — fails 16 ... │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Move fix-prefab.gradle to android/ ([afb3b54](https://github.com/margelo/react-native-work — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.6.2)

### 3. Active Signals (3 known issues at this version)

- **[HIGH]** `librnworklets.so` still 0x1000 align — fails 16 KB requirement *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/260)
- **[HIGH]** Android class name collision with Software Mansion worklets on RN 0.83+ *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)
- **[HIGH]** 1.1.1: Frame Processors are not available *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/172)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/1.6.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** worklets-core `1.6.3` + RN `>=0.82` (Hermes lib rename)
  - n/a for ≥0.82 after fix; pre-fix builds could fail linking `libhermes` vs `hermesvm`
  - [source](`packages/react-native-worklets-core/majors/1/minors/6/patches/3.md`)

---

## 📅 2025-08-06 — `v1.6.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@1.6.1                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ Android class name collision with Software Mansio... │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (3 changes)

**🐛 FIX** (3)
- android: renamed class to WorkletsCore to avoid naming conflicts ([#251](https://github.co — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.6.1)
- Fix Android build issues where dependent libraries can't link RNWC ([#252](https://github. — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.6.1)
- Prepend build on prepareHeaders task ([#254](https://github.com/margelo/react-native-workl — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.6.1)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** Android class name collision with Software Mansion worklets on RN 0.83+ *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)
- **[HIGH]** 1.1.1: Frame Processors are not available *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/172)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/1.6.1`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** worklets-core `1.6.3` + RN `>=0.82` (Hermes lib rename)
  - n/a for ≥0.82 after fix; pre-fix builds could fail linking `libhermes` vs `hermesvm`
  - [source](`packages/react-native-worklets-core/majors/1/minors/6/patches/3.md`)

---

## 📅 2025-07-01 — `v1.6.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@1.6.0                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ Android class name collision with Software Mansio... │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Enable 16KB page size support ([#249](https://github.com/margelo/react-native-worklets-cor — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.6.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** Android class name collision with Software Mansion worklets on RN 0.83+ *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)
- **[HIGH]** 1.1.1: Frame Processors are not available *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/172)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/1.6.0`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** worklets-core `1.6.3` + RN `>=0.82` (Hermes lib rename)
  - n/a for ≥0.82 after fix; pre-fix builds could fail linking `libhermes` vs `hermesvm`
  - [source](`packages/react-native-worklets-core/majors/1/minors/6/patches/3.md`)

---

## 📅 2024-11-07 — `v1.5.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@1.5.0                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ Android class name collision with Software Mansio... │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Add support for RN 0.76 ([#224](https://github.com/margelo/react-native-worklets-core/issu — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.5.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** Android class name collision with Software Mansion worklets on RN 0.83+ *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)
- **[HIGH]** 1.1.1: Frame Processors are not available *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/172)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/1.5.0`
```

---

## 📅 2024-11-06 — `v1.4.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@1.4.0                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ Android class name collision with Software Mansio... │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Support adopting Prototypes and NativeState (Nitro support 🔥) ([#223](https://github.com/m — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.4.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** Android class name collision with Software Mansion worklets on RN 0.83+ *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)
- **[HIGH]** 1.1.1: Frame Processors are not available *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/172)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/1.4.0`
```

---

## 📅 2024-05-13 — `v1.3.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@1.3.3                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ Android class name collision with Software Mansio... │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**🐛 FIX** (1)
- fix compatibility when using reanimated ([#194](https://github.com/margelo/react-native-wo — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.3.3)

**📌 FEATURE** (1)
- Add BigInt to globals ([fb3fd84](https://github.com/margelo/react-native-worklets-core/com — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.3.3)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** Android class name collision with Software Mansion worklets on RN 0.83+ *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)
- **[HIGH]** 1.1.1: Frame Processors are not available *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/172)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/1.3.3`
```

---

## 📅 2024-05-08 — `v1.3.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@1.3.2                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ Android class name collision with Software Mansio... │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Fix src/ import ([32cc7e0](https://github.com/margelo/react-native-worklets-core/commit/32 — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.3.2)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** Android class name collision with Software Mansion worklets on RN 0.83+ *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)
- **[HIGH]** 1.1.1: Frame Processors are not available *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/172)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/1.3.2`
```

---

## 📅 2024-05-08 — `v1.3.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@1.3.1                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ Android class name collision with Software Mansio... │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (3 changes)

**🐛 FIX** (1)
- Fix worklet<...> type ([12d3bbd](https://github.com/margelo/react-native-worklets-core/com — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.3.1)

**📌 FEATURE** (2)
- Export getWorkletDependencies ([b3fe0a4](https://github.com/margelo/react-native-worklets- — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.3.1)
- Some typing improvements (IWorklet/IWorkletize<>) ([#188](https://github.com/margelo/react — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.3.1)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** Android class name collision with Software Mansion worklets on RN 0.83+ *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)
- **[HIGH]** 1.1.1: Frame Processors are not available *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/172)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/1.3.1`
```

---

## 📅 2024-05-03 — `v1.3.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@1.3.0                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ Android class name collision with Software Mansio... │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (3 changes)

**🐛 FIX** (2)
- Added missing lock ([7bd6851](https://github.com/margelo/react-native-worklets-core/commit — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.3.0)
- Fix objects inside a SharedValue not being re-assignable ([#183](https://github.com/margel — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.3.0)

**📌 FEATURE** (1)
- Add worklet() func that throws if value is not a worklet ([#187](https://github.com/margel — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.3.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** Android class name collision with Software Mansion worklets on RN 0.83+ *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)
- **[HIGH]** 1.1.1: Frame Processors are not available *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/172)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/1.3.0`
```

---

## 📅 2024-04-25 — `v1.2.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@1.2.0                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ Android class name collision with Software Mansio... │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (3 changes)

**🐛 FIX** (2)
- Added support for changing type when setting prop ([11e674c](https://github.com/margelo/re — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.2.0)
- jsc: prevent crashes when using jsc runtime ([3e6f416](https://github.com/margelo/react-na — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.2.0)

**📌 FEATURE** (1)
- Added missing params in array ([20e1213](https://github.com/margelo/react-native-worklets- — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.2.0)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** Android class name collision with Software Mansion worklets on RN 0.83+ *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)
- **[HIGH]** 1.1.1: Frame Processors are not available *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/172)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/1.2.0`
```

---

## 📅 2024-04-25 — `v1.1.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@1.1.3                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ Android class name collision with Software Mansio... │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (5 changes)

**🐛 FIX** (5)
- Add lock when building the property names array in JsiObjectWrapper ([e18b33e](https://git — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.1.3)
- Codereview ([19ae420](https://github.com/margelo/react-native-worklets-core/commit/19ae420 — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.1.3)
- Explicitly dereference lambda params in correct thread ([edc1ae4](https://github.com/marge — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.1.3)
- Rename hook to match naming ([3d9dd23](https://github.com/margelo/react-native-worklets-co — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.1.3)
- Use atomic int ([a2ba145](https://github.com/margelo/react-native-worklets-core/commit/a2b — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.1.3)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** Android class name collision with Software Mansion worklets on RN 0.83+ *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)
- **[HIGH]** 1.1.1: Frame Processors are not available *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/172)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/1.1.3`
```

---

## 📅 2024-04-25 — `v1.1.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@1.1.2                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ Android class name collision with Software Mansio... │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards

_No leaf data in archive for this patch._

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** Android class name collision with Software Mansion worklets on RN 0.83+ *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)
- **[HIGH]** 1.1.1: Frame Processors are not available *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/172)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/1.1.2`
```

---

## 📅 2024-04-17 — `v1.1.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@1.1.1                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ Android class name collision with Software Mansio... │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Use thread_local storage to increment getCurrentThreadId() ([#170](https://github.com/marg — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.1.1)

### 3. Active Signals (2 known issues at this version)

- **[HIGH]** Android class name collision with Software Mansion worklets on RN 0.83+ *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)
- **[HIGH]** 1.1.1: Frame Processors are not available *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/172)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/1.1.1`
```

---

## 📅 2024-04-17 — `v1.1.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@1.1.0                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ Android class name collision with Software Mansio... │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**🐛 FIX** (1)
- Fix TArgs type ([6953f65](https://github.com/margelo/react-native-worklets-core/commit/695 — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.1.0)

**📌 FEATURE** (1)
- Throw errors when trying to use deprecated APIs ([#168](https://github.com/margelo/react-n — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.1.0)

### 3. Active Signals (1 known issues at this version)

- **[HIGH]** Android class name collision with Software Mansion worklets on RN 0.83+ *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/1.1.0`
```

---

## 📅 2024-04-17 — `v1.0.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@1.0.0                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ Android class name collision with Software Mansio... │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (7 changes)

**📌 FEATURE** (4)
- BREAKING: Simplify API (createRunInContextFn -> context.runAsync) ([#165](https://github.c — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.0.0)
- Add Worklets.getCurrentThreadId() ([#169](https://github.com/margelo/react-native-worklets — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.0.0)
- Lock Array and Object wrappers for safe multithreading ([#164](https://github.com/margelo/ — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.0.0)
- Use true native arrays and objects by default, and Proxies only in useSharedValue ([#159]( — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.0.0)

**🐛 FIX** (3)
- Fix reload crash by also listening to Main JS Runtime in RuntimeAwareCache ([#167](https:/ — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.0.0)
- Only lookup once ([8565e29](https://github.com/margelo/react-native-worklets-core/commit/8 — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.0.0)
- Fix hooks function return type ([a7cf79f](https://github.com/margelo/react-native-worklets — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v1.0.0)

### 3. Active Signals (1 known issues at this version)

- **[HIGH]** Android class name collision with Software Mansion worklets on RN 0.83+ *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/1.0.0`
```

---

## 📅 2024-04-08 — `v0.5.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@0.5.0                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (6 changes)

**🐛 FIX** (5)
- Added RuntimeAwareCache to make sure we release objects correctly ([a7a484d](https://githu — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.5.0)
- Changed so that JsiWorkletContext is passed as pointer internally ([cfdc596](https://githu — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.5.0)
- Prevent Mutex memory leak ([190d7b2](https://github.com/margelo/react-native-worklets-core — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.5.0)
- Removed unused variable ([d1846ae](https://github.com/margelo/react-native-worklets-core/c — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.5.0)
- types: fix useRunInJS type not allowing functions to have args ([#162](https://github.com/ — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.5.0)

**📌 FEATURE** (1)
- Add Array.unshift(...) to Array Proxy ([2f65133](https://github.com/margelo/react-native-w — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.5.0)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/0.5.0`
```

---

## 📅 2024-03-13 — `v0.4.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@0.4.0                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (5 changes)

**🐛 FIX** (3)
- added missing export of useRunInJS ([3f7deda](https://github.com/margelo/react-native-work — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.4.0)
- refactor whitespace check in createWorklet function ([88eeaca](https://github.com/margelo/ — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.4.0)
- Remove flipper ([677c324](https://github.com/margelo/react-native-worklets-core/commit/677 — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.4.0)

**📌 FEATURE** (2)
- Add BigInt64Array support ([1223117](https://github.com/margelo/react-native-worklets-core — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.4.0)
- Support jsi::NativeState in Shareable Objects ([bc3c92e](https://github.com/margelo/react- — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.4.0)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/0.4.0`
```

---

## 📅 2024-01-30 — `v0.3.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@0.3.0                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**🐛 FIX** (1)
- Use ThreadScope::WithClassLoader to fix "java.lang.ClassNotFoundException: Didn't find cla — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.3.0)

**📌 FEATURE** (1)
- Create useRunInJS hook ([3f70b78](https://github.com/margelo/react-native-worklets-core/co — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.3.0)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/0.3.0`
```

---

## 📅 2023-10-29 — `v0.2.4` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@0.2.4                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Update snapshot tests ([9839fb1](https://github.com/margelo/react-native-worklets-core/com — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.4)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/0.2.4`
```

---

## 📅 2023-10-29 — `v0.2.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@0.2.3                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards

_No leaf data in archive for this patch._

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/0.2.3`
```

---

## 📅 2023-10-06 — `v0.2.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@0.2.2                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (3 changes)

**🐛 FIX** (3)
- Clean cmake cache ([8b92514](https://github.com/chrfalch/react-native-worklets-core/commit — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.2)
- Delete .cxx CMake cache on clean ([fdeed9f](https://github.com/chrfalch/react-native-workl — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.2)
- Double-check if the code property is valid before running Worklets ([f840df8](https://gith — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.2)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/0.2.2`
```

---

## 📅 2023-10-03 — `v0.2.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@0.2.1                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (5 changes)

**🐛 FIX** (5)
- add string-hash-64 to dependencies ([8e53a1f](https://github.com/chrfalch/react-native-wor — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.1)
- Add fallback to jsc ([dc0c2d2](https://github.com/chrfalch/react-native-worklets-core/comm — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.1)
- Fix wrong renames ([eddb6dd](https://github.com/chrfalch/react-native-worklets-core/commit — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.1)
- Rename _closure to __closure to fix REA compatibility ([ba3f749](https://github.com/chrfal — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.1)
- Use correct jsc lib import when hermes is disabled ([3259198](https://github.com/chrfalch/ — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.1)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/0.2.1`
```

---

## 📅 2023-08-21 — `v0.2.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets-core@0.2.0                    │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ none                                                 │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (12 changes)

**🐛 FIX** (12)
- Add Folly flags from RN core to buildscript ([7c0c661](https://github.com/chrfalch/react-n — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.0)
- add plugin entry point ([2845363](https://github.com/chrfalch/react-native-worklets-core/c — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.0)
- added factory method for promise creation ([3a0cb30](https://github.com/chrfalch/react-nat — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.0)
- added fixes from janic ([2fa3230](https://github.com/chrfalch/react-native-worklets-core/c — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.0)
- added missing call to decorator->initialize ([dbe5155](https://github.com/chrfalch/react-n — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.0)
- added support for old type plugin data ([b9497f7](https://github.com/chrfalch/react-native — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.0)
- added test for calling worklet func sync ([bc80cf2](https://github.com/chrfalch/react-nati — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.0)
- added types for resolve/reject ([89e05b0](https://github.com/chrfalch/react-native-worklet — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.0)
- added virtual destructor to JsiBaseDecorator ([b26b644](https://github.com/chrfalch/react- — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.0)
- android build ([3698938](https://github.com/chrfalch/react-native-worklets-core/commit/369 — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.0)
- android build ([bdd043a](https://github.com/chrfalch/react-native-worklets-core/commit/bdd — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.0)
- android headers directory ([#93](https://github.com/chrfalch/react-native-worklets-core/is — [source](https://github.com/margelo/react-native-worklets-core/releases/tag/v0.2.0)

### 4. Peer Dependencies

```
- `react`: `*`
- `react-native`: `*`

- **source**: `https://registry.npmjs.org/react-native-worklets-core/0.2.0`
```


---

## Audit Integrity

- **Versions covered**: 24
- **Archive source**: Chronos/Grok rn-terrain corpus (extracted 2026-09-26)
- **Combos cross-referenced**: 2 relevant combos
- **Signals cross-referenced**: 12 Chronos signals
- **Audit vector**: Present ➔ Past (1.6.3 ➔ 0.2.0)
