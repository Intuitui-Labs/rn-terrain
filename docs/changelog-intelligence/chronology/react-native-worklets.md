---
title: "React Native Worklets (SWM) — Reverse-Chronological Audit"
package: "react-native-worklets"
latest_stable: "0.13.0"
_generated_at: "2026-09-26T12:01:32Z"
_shard_hash: "99b0568b7896"
audit_vector: "present → past (0.13.0 ➔ oldest)"
source: "TCDI Chronos Archive + Grok/Chronos signals"
---

# React Native Worklets (SWM) — Reverse-Chronological Audit Ledger

> **Audit vector**: Present ➔ Past. Starts at **0.13.0** (latest stable as of ingest, September 2026) and walks backward without skipping any minor or patch.
>
> **Coverage**: 4 versions
>
> **6-State kernel**: REMOVED | DEPRECATED | BROKEN | FUNCTIONAL | NEW | EXPERIMENTAL

---

---

## 📅 2026-09-18 — `v0.13.0` 🟢 **LATEST STABLE**

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets@0.13.0                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ Worklets Legacy Eval Mode memory regression in pr... │
│ FUNCTIONAL   │ __proto__ serialization crash fix in clonePlainJS... │
│ NEW          │ none                                                 │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (55 changes)

**📌 FEATURE** (23)
- Networking on Worklet Runtimes in Bundle Mode — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- refactor(Worklets): remove the networking preview — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- feat(Worklets): networking module with XMLHttpRequest — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- feat(Worklets): add Blob and FileReader to the networking module — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- feat(Worklets): add fetch to the networking module — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- feat(Worklets): add FormData to the networking module — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- feat(Worklets): add AbortController to the networking module — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- feat(Worklets): add the enableNetworking runtime option — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- OXC port of the Worklets Babel plugin — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- feat(Worklets): port babel plugin to oxc — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- chore(Worklets): publishing oxc plugin binaries — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- Add iOS Swift Package Manager support via Package.swift and SPM integration metadata in re — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Add a standalone networking module for Worklet Runtimes in Bundle Mode, with XMLHttpReques — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Add Blob and FileReader to the Worklets networking module, and blob and arraybuffer respon — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Add fetch, Headers, Request and Response to the Worklets networking module, backed by what — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Add FormData to the Worklets networking module, with multipart encoding done in JavaScript — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Add AbortController and AbortSignal to the Worklets networking module. ([#10497](https://g — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Add the enableNetworking option to createWorkletRuntime. It defaults to true and is forced — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Per-runtime caching for RetainingSerializable. ([#10264](https://github.com/software-mansi — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Add isOnUIThread to the Worklets Stable API. ([#10265](https://github.com/software-mansion — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Add the fast-path fixedType option to createSynchronizable. A fixed-type Synchronizable ho — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- The Babel plugin treats navigator as a known global: worklets resolve it on their own runt — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Add an OXC port of the Babel plugin for Bundle Mode. ([#9518](https://github.com/software- — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)

**🐛 FIX** (24)
- feat(Worklets): fixed-type Synchronizable — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- feat(Worklets): add setDirty to the Synchronizable interface — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- refactor(Worklets): operate on variant values in Synchronizable — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- refactor(Worklets): extract SynchronizableDynamic from Synchronizable — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- fix(Worklets): make Synchronizable value access atomic — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- fix(Worklets): release the Synchronizable lock when a setter throws — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- refactor(Worklets): identify the Synchronizable lock owner with std::thread::id — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- docs(Worklets): document fixed-type Synchronizable — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- Faster startup — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- feat(Worklets): initialize the native module ahead of time — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- feat(Worklets): start the UI runtime in Bundle Mode ahead of time — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- Hermes microtask queue on Worklet Runtimes — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.13.0)
- Abort the pending jobs of a Worklet Runtime's async queue and event loop from its destruct — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Native methods on the Worklets module proxy read missing trailing arguments as undefined a — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Acquire the runtime mutex before destroying a Worklet Runtime so a synchronous call in fli — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Destroy discarded results of synchronous worklet calls while the runtime lock is still hel — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Include the React Native version macros through <React/Utils.h> when it is available, so c — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Fix a crash on Android when the React instance is recreated while animations are running - — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Stop AnimationFrameQueue from dispatching the rest of a frame batch when WorkletsModule is — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Fix a data race between getDirty and setBlocking on a Synchronizable - the pointer holding — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Fix setBlocking leaving a Synchronizable locked forever in development builds when the upd — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Compare the Synchronizable's imperative lock owner with std::thread::id instead of compari — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Added an umbrella header for removed Serializable.h file for backwards compatibility with — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Fix the umbrella Serializable.h header including a non-existent RetainableSerializable.h i — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)

**💥 BREAKING** (8)
- Omit empty worklet closures and export closure-free worklets directly in Bundle Mode witho — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Store worklet closures as arrays instead of objects. ([#10506](https://github.com/software — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Removed the networking preview together with its FETCH_PREVIEW_ENABLED feature flag. ([#10 — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Remove the Serializable handle - SerializableInitializer, createSerializableInitializer an — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- makeShareable now serializes its value eagerly into a retaining Serializable instead of re — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Remove worklet context objects from the Babel plugin. ([#10411](https://github.com/softwar — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Change the C++ Synchronizable interface to operate on std::variant values. Getters return — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)
- Add virtual setDirty to the C++ Synchronizable interface. SynchronizableDynamic throws fro — [source](https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-worklets/CHANGELOG.md)

### 3. Active Signals (5 known issues at this version)

- **[HIGH]** Worklets Legacy Eval Mode memory regression in production *(open)* — [#](https://github.com/software-mansion/react-native-reanimated/issues/9650)
- **[HIGH]** Stack pairs Reanimated 4 + worklets but New Arch not active → crash *(open)* — [#](https://github.com/software-mansion/react-native-reanimated/issues/8235)
- **[HIGH]** Android Modal exit NPE (Reanimated 4.1.3 + worklets 0.6.1) *(open)* — [#](https://github.com/software-mansion/react-native-reanimated/issues/8422)
- **[HIGH]** `WorkletsPackage` collision: SWM worklets vs Margelo worklets-core *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)
- **[HIGH]** New Arch FPS loss with Reanimated 4 + worklets present *(open)* — [#](https://github.com/software-mansion/react-native-reanimated/issues/8250)

### 4. Peer Dependencies

```
- `@babel/core`: `*`
- `@react-native/metro-config`: `*`
- `react`: `*`
- `react-native`: `0.86 - 0.88`

- **source**: `https://registry.npmjs.org/react-native-worklets/0.13.0`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Reanimated `4.7.x` + Worklets `0.13.x`
  - [source](https://registry.npmjs.org/react-native-reanimated/4.7.0 ; https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/ ; `compat/snapshots/react-native-reanimated-4.7.0-compatibility.json`)
✅ **GOOD** Worklets `0.13.0` + RN `0.86`–`0.88`
  - [source](https://registry.npmjs.org/react-native-worklets/0.13.0)

---

## 📅 2026-09-08 — `v0.12.2` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets@0.12.2                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ Worklets Legacy Eval Mode memory regression in pr... │
│ FUNCTIONAL   │ __proto__ serialization crash fix in clonePlainJS... │
│ NEW          │ __proto__ serialization crash fix in clonePlainJS... │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (4 changes)

**📌 FEATURE** (4)
- cherry-pick(worklets-0.12-stable): stop AnimationFrameQueue when WorkletsModule is invalid — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.12.2)
- cherry-pick(worklets-0.12-stable): Crash when handling __proto__ — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.12.2)
- cherry-pick(worklets-0.12-stable): release the Synchronizable lock when a setter throws — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.12.2)
- release(Worklets): 0.12.2 — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.12.2)

### 3. Active Signals (5 known issues at this version)

- **[HIGH]** Worklets Legacy Eval Mode memory regression in production *(open)* — [#](https://github.com/software-mansion/react-native-reanimated/issues/9650)
- **[HIGH]** Stack pairs Reanimated 4 + worklets but New Arch not active → crash *(open)* — [#](https://github.com/software-mansion/react-native-reanimated/issues/8235)
- **[HIGH]** Android Modal exit NPE (Reanimated 4.1.3 + worklets 0.6.1) *(open)* — [#](https://github.com/software-mansion/react-native-reanimated/issues/8422)
- **[HIGH]** `WorkletsPackage` collision: SWM worklets vs Margelo worklets-core *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)
- **[HIGH]** New Arch FPS loss with Reanimated 4 + worklets present *(open)* — [#](https://github.com/software-mansion/react-native-reanimated/issues/8250)

### 4. Peer Dependencies

```
- `@babel/core`: `*`
- `@react-native/metro-config`: `*`
- `react`: `*`
- `react-native`: `0.83 - 0.87`

- **source**: `https://registry.npmjs.org/react-native-worklets/0.12.2`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Reanimated `4.6.x` + Worklets `0.12.x`
  - [source](https://registry.npmjs.org/react-native-reanimated/4.6.0 ; https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/)
💥 **BROKE** Worklets `0.12.x` + RN `0.88` (incl. `0.88.0-rc.*`)
  - Worklets `0.12.2` peers `react-native`: `0.83 - 0.87` — excludes 0.88. Paired with Expo 58 preview pin `0.12.2` + RN `0.88.0-rc.1`.
  - [source](https://registry.npmjs.org/react-native-worklets/0.12.2 ; https://registry.npmjs.org/react-native-worklets/0.13.0 ; https://unpkg.com/expo@58.0.0-preview.6/bundledNativeModules.json)
✅ **GOOD** Worklets `0.12.x` + RN `0.83`–`0.87`
  - [source](https://registry.npmjs.org/react-native-worklets/0.12.0)

---

## 📅 2026-08-18 — `v0.12.1` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets@0.12.1                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ Worklets Legacy Eval Mode memory regression in pr... │
│ FUNCTIONAL   │ isOnUIThread C++ Stable API, Native WeakRef suppo... │
│ NEW          │ isOnUIThread C++ Stable API                          │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- cherry-pick(worklets-0.12-stable): extract UI-thread check into UIScheduler::isOnUIThread — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.12.1)

### 3. Active Signals (5 known issues at this version)

- **[HIGH]** Worklets Legacy Eval Mode memory regression in production *(open)* — [#](https://github.com/software-mansion/react-native-reanimated/issues/9650)
- **[HIGH]** Stack pairs Reanimated 4 + worklets but New Arch not active → crash *(open)* — [#](https://github.com/software-mansion/react-native-reanimated/issues/8235)
- **[HIGH]** Android Modal exit NPE (Reanimated 4.1.3 + worklets 0.6.1) *(open)* — [#](https://github.com/software-mansion/react-native-reanimated/issues/8422)
- **[HIGH]** `WorkletsPackage` collision: SWM worklets vs Margelo worklets-core *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)
- **[HIGH]** New Arch FPS loss with Reanimated 4 + worklets present *(open)* — [#](https://github.com/software-mansion/react-native-reanimated/issues/8250)

### 4. Peer Dependencies

```
- `@babel/core`: `*`
- `@react-native/metro-config`: `*`
- `react`: `*`
- `react-native`: `0.83 - 0.87`

- **source**: `https://registry.npmjs.org/react-native-worklets/0.12.1`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Reanimated `4.6.x` + Worklets `0.12.x`
  - [source](https://registry.npmjs.org/react-native-reanimated/4.6.0 ; https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/)
💥 **BROKE** Worklets `0.12.x` + RN `0.88` (incl. `0.88.0-rc.*`)
  - Worklets `0.12.2` peers `react-native`: `0.83 - 0.87` — excludes 0.88. Paired with Expo 58 preview pin `0.12.2` + RN `0.88.0-rc.1`.
  - [source](https://registry.npmjs.org/react-native-worklets/0.12.2 ; https://registry.npmjs.org/react-native-worklets/0.13.0 ; https://unpkg.com/expo@58.0.0-preview.6/bundledNativeModules.json)
✅ **GOOD** Worklets `0.12.x` + RN `0.83`–`0.87`
  - [source](https://registry.npmjs.org/react-native-worklets/0.12.0)

---

## 📅 2026-08-11 — `v0.12.0` 

### 1. 6-State Sliding Feature Kernel

```
┌──────────────────────────────────────────────────────────────────────┐
│ 6-STATE KERNEL @ react-native-worklets@0.12.0                        │
├──────────────────────────────────────────────────────────────────────┤
│ REMOVED      │ none                                                 │
│ DEPRECATED   │ none                                                 │
│ BROKEN       │ Worklets Legacy Eval Mode memory regression in pr... │
│ FUNCTIONAL   │ Native WeakRef support in Worklet Runtimes           │
│ NEW          │ Native WeakRef support in Worklet Runtimes           │
│ EXPERIMENTAL │ none                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Release Cards (12 changes)

**📌 FEATURE** (12)
- WeakRef on Worklet Runtimes — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.12.0)
- feat(Worklets): WeakRef on Worklet Runtimes — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.12.0)
- refactor(worklets): consolidate scheduling API for microtask policies — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.12.0)
- refactor(Worklets): move microtasks call to C++ — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.12.0)
- Bundle Mode script loading on par with React Native — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.12.0)
- feat(Worklets): bring Bundle Mode script loading on par with React Native — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.12.0)
- feat(Worklets): reuse React Native's downloaded dev bundle on Android — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.12.0)
- `enableLocking` option in `createWorkletRuntime` — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.12.0)
- feat(Worklets): add enableLocking option to createWorkletRuntime — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.12.0)
- feat(Worklets): Descriptive warning in createSerializable — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.12.0)
- fix: Adjust createSerializableInaccessibleObject to the Release createSerializable behavio — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.12.0)
- fix(Worklets): RetainingSerializable race condition — [source](https://github.com/software-mansion/react-native-reanimated/releases/tag/worklets-0.12.0)

### 3. Active Signals (5 known issues at this version)

- **[HIGH]** Worklets Legacy Eval Mode memory regression in production *(open)* — [#](https://github.com/software-mansion/react-native-reanimated/issues/9650)
- **[HIGH]** Stack pairs Reanimated 4 + worklets but New Arch not active → crash *(open)* — [#](https://github.com/software-mansion/react-native-reanimated/issues/8235)
- **[HIGH]** Android Modal exit NPE (Reanimated 4.1.3 + worklets 0.6.1) *(open)* — [#](https://github.com/software-mansion/react-native-reanimated/issues/8422)
- **[HIGH]** `WorkletsPackage` collision: SWM worklets vs Margelo worklets-core *(open)* — [#](https://github.com/margelo/react-native-worklets-core/issues/266)
- **[HIGH]** New Arch FPS loss with Reanimated 4 + worklets present *(open)* — [#](https://github.com/software-mansion/react-native-reanimated/issues/8250)

### 4. Peer Dependencies

```
- `@babel/core`: `*`
- `@react-native/metro-config`: `*`
- `react`: `*`
- `react-native`: `0.83 - 0.87`

- **source**: `https://registry.npmjs.org/react-native-worklets/0.12.0`
```

### 5. Cross-Dependency Compat (relevant combos)

✅ **GOOD** Reanimated `4.6.x` + Worklets `0.12.x`
  - [source](https://registry.npmjs.org/react-native-reanimated/4.6.0 ; https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/)
💥 **BROKE** Worklets `0.12.x` + RN `0.88` (incl. `0.88.0-rc.*`)
  - Worklets `0.12.2` peers `react-native`: `0.83 - 0.87` — excludes 0.88. Paired with Expo 58 preview pin `0.12.2` + RN `0.88.0-rc.1`.
  - [source](https://registry.npmjs.org/react-native-worklets/0.12.2 ; https://registry.npmjs.org/react-native-worklets/0.13.0 ; https://unpkg.com/expo@58.0.0-preview.6/bundledNativeModules.json)
✅ **GOOD** Worklets `0.12.x` + RN `0.83`–`0.87`
  - [source](https://registry.npmjs.org/react-native-worklets/0.12.0)


---

## Audit Integrity

- **Versions covered**: 4
- **Archive source**: Chronos/Grok rn-terrain corpus (extracted 2026-09-26)
- **Combos cross-referenced**: 17 relevant combos
- **Signals cross-referenced**: 8 Chronos signals
- **Audit vector**: Present ➔ Past (0.13.0 ➔ 0.12.0)
