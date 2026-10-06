---
title: "Nitrogen (Nitro Codegen) — Reverse-Chronological Audit"
package: "nitrogen"
latest_stable: "0.37.1"
_generated_at: "2026-09-26T12:01:32Z"
_shard_hash: "23ab613e2e45"
audit_vector: "present → past (0.37.1 ➔ oldest)"
source: "TCDI Chronos Archive + Grok/Chronos signals"
---

# Nitrogen (Nitro Codegen) — Reverse-Chronological Audit Ledger

> **Audit vector**: Present ➔ Past. Starts at **0.37.1** (latest stable as of ingest, September 2026) and walks backward without skipping any minor or patch.
>
> **Coverage**: 8 versions
>
> **6-State kernel**: REMOVED | DEPRECATED | BROKEN | FUNCTIONAL | NEW | EXPERIMENTAL

---

## 🟡 **BETA** — `0.37.0-beta.1`

> _Beta channel only. Leaf may be partial. Treat as pre-release._

---

---

## 📅 2026-08-27 — `v0.37.1` 🟢 **LATEST STABLE**

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ nitrogen@0.37.1                                     │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ (Shared) 0.37.0 iOS glog/modulemap break — nitrog... │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (2 changes)

**🐛 FIX** (2)
- Hide React Native version checks from public headers ([#1521](https://github.com/mrousavy/ — [source](https://github.com/mrousavy/nitro/releases/tag/v0.37.1)
- Report native ArrayBuffer memory pressure ([#1523](https://github.com/mrousavy/nitro/issue — [source](https://github.com/mrousavy/nitro/releases/tag/v0.37.1)

### 3. Active Signals (1 known issues at this version)

- **[HIGH]** (Shared) 0.37.0 iOS glog/modulemap break — nitrogen version aligned *(open)* — [#](https://github.com/margelo/nitro/issues/1573)

### 4. Peer Dependencies

```
- _(none declared)_

### Sibling dependencies (relevant)

- `react-native-nitro-modules`: `^0.37.1`

- **source**: `https://registry.npmjs.org/nitrogen/0.37.1`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** nitrogen `0.37.1` + react-native-nitro-modules `^0.37.1`
  - [source](https://registry.npmjs.org/nitrogen/0.37.1 ; https://registry.npmjs.org/nitrogen/0.36.0 ; mrousavy/nitro README (pair described as core + codegen))
💥 **BROKE** nitrogen `0.37.x` + nitro-modules `0.36.x`
  - Semver dependency `^0.37.1` (or `^0.37.0`) will not satisfy `0.36.x`; lockstep releases from same monorepo
  - [source](https://registry.npmjs.org/nitrogen/0.37.1 (dependencies.react-native-nitro-modules))

---

## 📅 2026-08-20 — `v0.37.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ nitrogen@0.37.0                                     │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ (Shared) 0.37.0 iOS glog/modulemap break — nitrog... │
│ FUNCTIONAL   │ none                                                 │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (14 changes)

**📌 FEATURE** (2)
- Move Props into Nitro Modules core via C++ template ([#1487](https://github.com/mrousavy/n — [source](https://github.com/mrousavy/nitro/releases/tag/v0.37.0)
- Move react::ComponentDescriptor into Nitro Modules core via C++ template ([#1486](https:// — [source](https://github.com/mrousavy/nitro/releases/tag/v0.37.0)

**🐛 FIX** (12)
- Mark react-native-nitro-modules peer dependency as optional ([#1516](https://github.com/mr — [source](https://github.com/mrousavy/nitro/releases/tag/v0.37.0)
- Rename CachedProp to ReactProp, re-add legacy CachedProp as deprecated ([#1517](https://gi — [source](https://github.com/mrousavy/nitro/releases/tag/v0.37.0)
- Add RawPropsParser JSI Parser bool argument on RN <85 ([#1491](https://github.com/mrousavy — [source](https://github.com/mrousavy/nitro/releases/tag/v0.37.0)
- Avoid dangling View props reference ([#1502](https://github.com/mrousavy/nitro/issues/1502 — [source](https://github.com/mrousavy/nitro/releases/tag/v0.37.0)
- call base View Component Descriptor adopt ([#1500](https://github.com/mrousavy/nitro/issue — [source](https://github.com/mrousavy/nitro/releases/tag/v0.37.0)
- keep | undefined on array elements and Record values ([#1478](https://github.com/mrousavy/ — [source](https://github.com/mrousavy/nitro/releases/tag/v0.37.0)
- Make CachedProp<T>'s data immutable ([#1503](https://github.com/mrousavy/nitro/issues/1503 — [source](https://github.com/mrousavy/nitro/releases/tag/v0.37.0)
- Make View prop snapshots truly immutable via diffing ([#1506](https://github.com/mrousavy/ — [source](https://github.com/mrousavy/nitro/releases/tag/v0.37.0)
- Preserve classic View prop parsing across React Native versions ([#1507](https://github.co — [source](https://github.com/mrousavy/nitro/releases/tag/v0.37.0)
- Preserve native View prop defaults ([#1510](https://github.com/mrousavy/nitro/issues/1510) — [source](https://github.com/mrousavy/nitro/releases/tag/v0.37.0)
- report iOS View drops when recycling ([#1494](https://github.com/mrousavy/nitro/issues/149 — [source](https://github.com/mrousavy/nitro/releases/tag/v0.37.0)
- require props-constructible View state on Android ([#1501](https://github.com/mrousavy/nit — [source](https://github.com/mrousavy/nitro/releases/tag/v0.37.0)

### 3. Active Signals (1 known issues at this version)

- **[HIGH]** (Shared) 0.37.0 iOS glog/modulemap break — nitrogen version aligned *(open)* — [#](https://github.com/margelo/nitro/issues/1573)

### 4. Peer Dependencies

```
- _(none declared)_

### Sibling dependencies (relevant)

- `react-native-nitro-modules`: `^0.37.0`

- **source**: `https://registry.npmjs.org/nitrogen/0.37.0`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** nitrogen `0.37.1` + react-native-nitro-modules `^0.37.1`
  - [source](https://registry.npmjs.org/nitrogen/0.37.1 ; https://registry.npmjs.org/nitrogen/0.36.0 ; mrousavy/nitro README (pair described as core + codegen))
💥 **BROKE** nitrogen `0.37.x` + nitro-modules `0.36.x`
  - Semver dependency `^0.37.1` (or `^0.37.0`) will not satisfy `0.36.x`; lockstep releases from same monorepo
  - [source](https://registry.npmjs.org/nitrogen/0.37.1 (dependencies.react-native-nitro-modules))

---

## 📅 2026-07-31 — `v0.36.5` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ nitrogen@0.36.5                                     │
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
- Fix cyclic JVM reference on CxxPart (memory leak) ([#1459](https://github.com/mrousavy/nit — [source](https://github.com/mrousavy/nitro/releases/tag/v0.36.5)
- 📚 Documentation — [source](https://github.com/mrousavy/nitro/releases/tag/v0.36.5)
- add react-native-google-places module to resources ([#1461](https://github.com/mrousavy/ni — [source](https://github.com/mrousavy/nitro/releases/tag/v0.36.5)

### 4. Peer Dependencies

```
- _(none declared)_

### Sibling dependencies (relevant)

- `react-native-nitro-modules`: `^0.36.5`

- **source**: `https://registry.npmjs.org/nitrogen/0.36.5`
```

### 5. Cross-Dependency Compat (relevant combos)

💥 **BROKE** nitrogen `0.37.x` + nitro-modules `0.36.x`
  - Semver dependency `^0.37.1` (or `^0.37.0`) will not satisfy `0.36.x`; lockstep releases from same monorepo
  - [source](https://registry.npmjs.org/nitrogen/0.37.1 (dependencies.react-native-nitro-modules))

---

## 📅 2026-07-30 — `v0.36.4` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ nitrogen@0.36.4                                     │
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
- Remove @FastNative from native callbacks entirely ([#1457](https://github.com/mrousavy/nit — [source](https://github.com/mrousavy/nitro/releases/tag/v0.36.4)
- 📚 Documentation — [source](https://github.com/mrousavy/nitro/releases/tag/v0.36.4)
- Add react-native-auto-play module to resources ([#1452](https://github.com/mrousavy/nitro/ — [source](https://github.com/mrousavy/nitro/releases/tag/v0.36.4)

### 4. Peer Dependencies

```
- _(none declared)_

### Sibling dependencies (relevant)

- `react-native-nitro-modules`: `^0.36.4`

- **source**: `https://registry.npmjs.org/nitrogen/0.36.4`
```

### 5. Cross-Dependency Compat (relevant combos)

💥 **BROKE** nitrogen `0.37.x` + nitro-modules `0.36.x`
  - Semver dependency `^0.37.1` (or `^0.37.0`) will not satisfy `0.36.x`; lockstep releases from same monorepo
  - [source](https://registry.npmjs.org/nitrogen/0.37.1 (dependencies.react-native-nitro-modules))

---

## 📅 2026-07-27 — `v0.36.3` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ nitrogen@0.36.3                                     │
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
- Make Sync<..> functions non-@FastNative ([#1450](https://github.com/mrousavy/nitro/issues/ — [source](https://github.com/mrousavy/nitro/releases/tag/v0.36.3)

### 4. Peer Dependencies

```
- _(none declared)_

### Sibling dependencies (relevant)

- `react-native-nitro-modules`: `^0.36.3`

- **source**: `https://registry.npmjs.org/nitrogen/0.36.3`
```

### 5. Cross-Dependency Compat (relevant combos)

💥 **BROKE** nitrogen `0.37.x` + nitro-modules `0.36.x`
  - Semver dependency `^0.37.1` (or `^0.37.0`) will not satisfy `0.36.x`; lockstep releases from same monorepo
  - [source](https://registry.npmjs.org/nitrogen/0.37.1 (dependencies.react-native-nitro-modules))

---

## 📅 2026-07-27 — `v0.36.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ nitrogen@0.36.2                                     │
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

**🐛 FIX** (6)
- Add support for RN 0.87+ by overloading new installJSIBindingsWithRuntime ([#1437](https:/ — [source](https://github.com/mrousavy/nitro/releases/tag/v0.36.2)
- Compute AHardwareBuffer size in bytes, not pixels ([#1445](https://github.com/mrousavy/nit — [source](https://github.com/mrousavy/nitro/releases/tag/v0.36.2)
- Fix HardwareBuffer calculation for multi-layer ([#1446](https://github.com/mrousavy/nitro/ — [source](https://github.com/mrousavy/nitro/releases/tag/v0.36.2)
- Re-create JS object on dead runtime cache entry ([#1442](https://github.com/mrousavy/nitro — [source](https://github.com/mrousavy/nitro/releases/tag/v0.36.2)
- 📚 Documentation — [source](https://github.com/mrousavy/nitro/releases/tag/v0.36.2)
- Add v0 to showcase ([5c7cd4e](https://github.com/mrousavy/nitro/commit/5c7cd4e6f896cf50ea9 — [source](https://github.com/mrousavy/nitro/releases/tag/v0.36.2)

### 4. Peer Dependencies

```
- _(none declared)_

### Sibling dependencies (relevant)

- `react-native-nitro-modules`: `^0.36.2`

- **source**: `https://registry.npmjs.org/nitrogen/0.36.2`
```

### 5. Cross-Dependency Compat (relevant combos)

💥 **BROKE** nitrogen `0.37.x` + nitro-modules `0.36.x`
  - Semver dependency `^0.37.1` (or `^0.37.0`) will not satisfy `0.36.x`; lockstep releases from same monorepo
  - [source](https://registry.npmjs.org/nitrogen/0.37.1 (dependencies.react-native-nitro-modules))

---

## 📅 2026-06-30 — `v0.36.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ nitrogen@0.36.1                                     │
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
- Fix union inline joining not generating enums ([#1427](https://github.com/mrousavy/nitro/i — [source](https://github.com/mrousavy/nitro/releases/tag/v0.36.1)

### 4. Peer Dependencies

```
- _(none declared)_

### Sibling dependencies (relevant)

- `react-native-nitro-modules`: `^0.36.1`

- **source**: `https://registry.npmjs.org/nitrogen/0.36.1`
```

### 5. Cross-Dependency Compat (relevant combos)

💥 **BROKE** nitrogen `0.37.x` + nitro-modules `0.36.x`
  - Semver dependency `^0.37.1` (or `^0.37.0`) will not satisfy `0.36.x`; lockstep releases from same monorepo
  - [source](https://registry.npmjs.org/nitrogen/0.37.1 (dependencies.react-native-nitro-modules))

---

## 📅 2026-06-30 — `v0.36.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ nitrogen@0.36.0                                     │
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

**📌 FEATURE** (3)
- Support variants of union-style enums ([#1426](https://github.com/mrousavy/nitro/issues/14 — [source](https://github.com/mrousavy/nitro/releases/tag/v0.36.0)
- 📚 Documentation — [source](https://github.com/mrousavy/nitro/releases/tag/v0.36.0)
- Add showcase ([#1381](https://github.com/mrousavy/nitro/issues/1381)) ([8fbd420](https://g — [source](https://github.com/mrousavy/nitro/releases/tag/v0.36.0)

### 4. Peer Dependencies

```
- _(none declared)_

### Sibling dependencies (relevant)

- `react-native-nitro-modules`: `^0.36.0`

- **source**: `https://registry.npmjs.org/nitrogen/0.36.0`
```

### 5. Cross-Dependency Compat (relevant combos)

💥 **BROKE** nitrogen `0.37.x` + nitro-modules `0.36.x`
  - Semver dependency `^0.37.1` (or `^0.37.0`) will not satisfy `0.36.x`; lockstep releases from same monorepo
  - [source](https://registry.npmjs.org/nitrogen/0.37.1 (dependencies.react-native-nitro-modules))


---

## Audit Integrity

- **Versions covered**: 8
- **Archive source**: Chronos/Grok rn-terrain corpus (extracted 2026-09-26)
- **Combos cross-referenced**: 2 relevant combos
- **Signals cross-referenced**: 9 Chronos signals
- **Audit vector**: Present ➔ Past (0.37.1 ➔ 0.36.0)
