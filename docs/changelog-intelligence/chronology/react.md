---
title: "React — Reverse-Chronological Audit"
package: "react"
latest_stable: "19.3.0"
_generated_at: "2026-09-26T12:01:32Z"
_shard_hash: "none"
audit_vector: "present → past (19.3.0 ➔ oldest)"
source: "TCDI Chronos Archive + Grok/Chronos signals"
---

# React — Reverse-Chronological Audit Ledger

> **Audit vector**: Present ➔ Past. Starts at **19.3.0** (latest stable as of ingest, September 2026) and walks backward without skipping any minor or patch.
>
> **Coverage**: 34 versions
>
> **6-State kernel**: REMOVED | DEPRECATED | BROKEN | FUNCTIONAL | NEW | EXPERIMENTAL

---

---

## 📅 2026-09-09 — `v19.3.0` 🟢 **LATEST STABLE**

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (22 changes)

**📌 FEATURE** (7)
- <ViewTransition> + addTransitionType — [source](https://react.dev/blog/2026/09/09/react-19-3)
- Fragment Refs — [source](https://react.dev/blog/2026/09/09/react-19-3)
- Independent transition renders — [source](https://react.dev/blog/2026/09/09/react-19-3)
- browser() (react-dom) — [source](https://react.dev/blog/2026/09/09/react-19-3)
- `<ViewTransition />`: Adds `<ViewTransition />` and `addTransitionType` APIs to power View Transition anima… — [source](https://react.dev/blog/2026/09/09/react-19-3)
- Fragment Refs: Add Refs to `<Fragment />` to support composable platform behavior — [source](https://react.dev/blog/2026/09/09/react-19-3)
- Added a DEV-only warning when a component appears to have been unblocked by calling `use()` conditionally — [source](https://react.dev/blog/2026/09/09/react-19-3)

**🐛 FIX** (12)
- Activity + useSyncExternalStore while hidden — [source](https://react.dev/blog/2026/09/09/react-19-3)
- StrictMode / Fast Refresh effect invoke fixes — [source](https://react.dev/blog/2026/09/09/react-19-3)
- Fast Refresh Fixes — [source](https://react.dev/blog/2026/09/09/react-19-3)
- Fix Fast Refresh to find and remount edits to components wrapped behind `lazy()` — [source](https://react.dev/blog/2026/09/09/react-19-3)
- Fix Fast Refresh so edits to a `memo()` comparison function take effect — [source](https://react.dev/blog/2026/09/09/react-19-3)
- Fix Fast Refresh crash when an edit changes the kind of a component's type — [source](https://react.dev/blog/2026/09/09/react-19-3)
- Fix Fast Refresh to remount correctly when an edit changes the component kind — [source](https://react.dev/blog/2026/09/09/react-19-3)
- Activity Fixes — [source](https://react.dev/blog/2026/09/09/react-19-3)
- Fix `useSyncExternalStore` missing store mutations that happened while an Activity tree was hidden — [source](https://react.dev/blog/2026/09/09/react-19-3)
- Fix context propagation into Suspense fallbacks — [source](https://react.dev/blog/2026/09/09/react-19-3)
- Fix context propagation through suspended Suspense boundaries — [source](https://react.dev/blog/2026/09/09/react-19-3)
- Fix `useDeferredValue` getting stuck — [source](https://react.dev/blog/2026/09/09/react-19-3)

**💥 BREAKING** (1)
- Use minus (`-`) instead of en dash for removed props in Performance Tracks — [source](https://react.dev/blog/2026/09/09/react-19-3)

**📌 PEER-DEPS** (2)
- `browser()`: a new `react-dom` API that returns a usable which errors during server rendering and resolves … — [source](https://react.dev/blog/2026/09/09/react-19-3)
- Added an `onBrowserBailout` option to the `react-dom/server` APIs to observe when a subtree defers to the b… — [source](https://react.dev/blog/2026/09/09/react-19-3)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.3.0`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.3.0 peerDependencies** (reverse coupling evidence): `{"react": "^19.3.0"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2026-07-21 — `v19.2.8` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Performance improvements when decoding — [source](https://github.com/react/react/releases/tag/v19.2.8)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.2.8`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.2.8 peerDependencies** (reverse coupling evidence): `{"react": "^19.2.8"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2026-06-01 — `v19.2.7` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Fixed missing `FormData` entries in Server Actions which regressed in 19.2.6 — [source](https://github.com/react/react/releases/tag/v19.2.7)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.2.7`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.2.7 peerDependencies** (reverse coupling evidence): `{"react": "^19.2.7"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2026-05-06 — `v19.2.6` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Type hardening and performance improvements — [source](https://github.com/react/react/releases/tag/v19.2.6)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.2.6`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.2.6 peerDependencies** (reverse coupling evidence): `{"react": "^19.2.6"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2026-04-08 — `v19.2.5` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Add more cycle protections — [source](https://github.com/react/react/releases/tag/v19.2.5)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.2.5`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.2.5 peerDependencies** (reverse coupling evidence): `{"react": "^19.2.5"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2026-01-26 — `v19.2.4` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Add more DoS mitigations to Server Actions, and harden Server Components — [source](https://github.com/react/react/releases/tag/v19.2.4)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.2.4`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.2.4 peerDependencies** (reverse coupling evidence): `{"react": "^19.2.4"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2025-12-11 — `v19.2.3` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Add extra loop protection to React Server Functions — [source](https://github.com/react/react/releases/tag/v19.2.3)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.2.3`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.2.3 peerDependencies** (reverse coupling evidence): `{"react": "^19.2.3"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2025-12-11 — `v19.2.2` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (2 changes)

**📌 FEATURE** (2)
- Move `react-server-dom-webpack/*.unbundled` to private `react-server-dom-unbundled` — [source](https://github.com/react/react/releases/tag/v19.2.2)
- Patch Promise cycles and toString on Server Functions — [source](https://github.com/react/react/releases/tag/v19.2.2)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.2.2`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.2.2 peerDependencies** (reverse coupling evidence): `{"react": "^19.2.2"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2025-12-03 — `v19.2.1` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Bring React Server Component fixes to Server Actions — [source](https://github.com/react/react/releases/tag/v19.2.1)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.2.1`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.2.1 peerDependencies** (reverse coupling evidence): `{"react": "^19.2.1"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2025-10-01 — `v19.2.0` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (16 changes)

**📌 FEATURE** (10)
- <Activity> API — [source](https://react.dev/blog/2025/10/01/react-19-2)
- useEffectEvent — [source](https://react.dev/blog/2025/10/01/react-19-2)
- cacheSignal (RSC) — [source](https://react.dev/blog/2025/10/01/react-19-2)
- React Performance tracks — [source](https://react.dev/blog/2025/10/01/react-19-2)
- `<Activity>`: A new API to hide and restore the UI and internal state of its children. — [source](https://react.dev/blog/2025/10/01/react-19-2)
- `useEffectEvent` is a React Hook that lets you extract non-reactive logic into an Effect Event. — [source](https://react.dev/blog/2025/10/01/react-19-2)
- `cacheSignal` (for RSCs) lets your know when the `cache()` lifetime is over. — [source](https://react.dev/blog/2025/10/01/react-19-2)
- React Performance tracks appear on the Performance panel’s timeline in your browser developer tools — [source](https://react.dev/blog/2025/10/01/react-19-2)
- React DOM now batches suspense boundary reveals, matching the behavior of client side rendering. This chang… — [source](https://react.dev/blog/2025/10/01/react-19-2)
- Use underscore instead of `:` IDs generated by useId — [source](https://react.dev/blog/2025/10/01/react-19-2)

**🐛 FIX** (4)
- useId underscore instead of colon — [source](https://react.dev/blog/2025/10/01/react-19-2)
- Fix infinite `useDeferredValue` loop in popstate event — [source](https://react.dev/blog/2025/10/01/react-19-2)
- Fix a bug when an initial value was passed to `useDeferredValue` — [source](https://react.dev/blog/2025/10/01/react-19-2)
- Fix a crash when submitting forms with Client Actions — [source](https://react.dev/blog/2025/10/01/react-19-2)

**💥 BREAKING** (2)
- **Breaking:** Require Node.js 18 or newer. — [source](https://react.dev/blog/2025/10/01/react-19-2)
- **Breaking:** Flat config is now the default `recommended` preset. Legacy config moved to `recommended-lega… — [source](https://react.dev/blog/2025/10/01/react-19-2)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.2.0`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.2.0 peerDependencies** (reverse coupling evidence): `{"react": "^19.2.0"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2026-07-21 — `v19.1.9` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Performance improvements when decoding — [source](https://github.com/react/react/releases/tag/v19.1.9)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.1.9`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.1.9 peerDependencies** (reverse coupling evidence): `{"react": "^19.1.9"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2026-06-01 — `v19.1.8` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Fixed missing `FormData` entries in Server Actions which regressed in 19.1.7 — [source](https://github.com/react/react/releases/tag/v19.1.8)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.1.8`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.1.8 peerDependencies** (reverse coupling evidence): `{"react": "^19.1.8"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2026-05-06 — `v19.1.7` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Type hardening and performance improvements — [source](https://github.com/react/react/releases/tag/v19.1.7)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.1.7`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.1.7 peerDependencies** (reverse coupling evidence): `{"react": "^19.1.7"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2026-04-08 — `v19.1.6` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Add more cycle protections — [source](https://github.com/react/react/releases/tag/v19.1.6)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.1.6`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.1.6 peerDependencies** (reverse coupling evidence): `{"react": "^19.1.6"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2026-01-26 — `v19.1.5` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Add more DoS mitigations to Server Actions, and harden Server Components — [source](https://github.com/react/react/releases/tag/v19.1.5)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.1.5`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.1.5 peerDependencies** (reverse coupling evidence): `{"react": "^19.1.5"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2025-12-11 — `v19.1.4` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Add extra loop protection to React Server Functions — [source](https://github.com/react/react/releases/tag/v19.1.4)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.1.4`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.1.4 peerDependencies** (reverse coupling evidence): `{"react": "^19.1.4"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2025-12-11 — `v19.1.3` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (2 changes)

**📌 FEATURE** (2)
- Move `react-server-dom-webpack/*.unbundled` to private `react-server-dom-unbundled` — [source](https://github.com/react/react/releases/tag/v19.1.3)
- Patch Promise cycles and toString on Server Functions — [source](https://github.com/react/react/releases/tag/v19.1.3)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.1.3`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.1.3 peerDependencies** (reverse coupling evidence): `{"react": "^19.1.3"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2025-12-03 — `v19.1.2` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Bring React Server Component fixes to Server Actions — [source](https://github.com/react/react/releases/tag/v19.1.2)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.1.2`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.1.2 peerDependencies** (reverse coupling evidence): `{"react": "^19.1.2"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2025-07-28 — `v19.1.1` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Fixed Owner Stacks to work with ES2015 function.name semantics — [source](https://github.com/react/react/releases/tag/v19.1.1)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.1.1`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.1.1 peerDependencies** (reverse coupling evidence): `{"react": "^19.1.1"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2025-03-28 — `v19.1.0` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (16 changes)

**📌 FEATURE** (10)
- Owner Stack + captureOwnerStack (DEV) — [source](https://github.com/react/react/releases/tag/v19.1.0)
- Suspense scheduling improvements — [source](https://github.com/react/react/releases/tag/v19.1.0)
- An Owner Stack is a development-only stack trace that helps identify which components are responsible for r… — [source](https://github.com/react/react/releases/tag/v19.1.0)
- Enhanced support for Suspense boundaries to be used anywhere, including the client, server, and during hydr… — [source](https://github.com/react/react/releases/tag/v19.1.0)
- Reduced unnecessary client rendering through improved hydration scheduling — [source](https://github.com/react/react/releases/tag/v19.1.0)
- Increased priority of client rendered Suspense boundaries — [source](https://github.com/react/react/releases/tag/v19.1.0)
- Reduced garbage collection pressure by improving Suspense boundary retries. — [source](https://github.com/react/react/releases/tag/v19.1.0)
- Updated `useId` to use valid CSS selectors, changing format from `:r123:` to `«r123»`. — [source](https://github.com/react/react/releases/tag/v19.1.0)
- Added a dev-only warning for null/undefined created in useEffect, useInsertionEffect, and useLayoutEffect. — [source](https://github.com/react/react/releases/tag/v19.1.0)
- Added `exports` field to `package.json` for `use-sync-external-store` to support various entrypoints. — [source](https://github.com/react/react/releases/tag/v19.1.0)

**🐛 FIX** (4)
- useId format change to CSS-valid selectors — [source](https://github.com/react/react/releases/tag/v19.1.0)
- The captureOwnerStack API is only available in development mode and returns a Owner Stack, if available. Th… — [source](https://github.com/react/react/releases/tag/v19.1.0)
- Fixed frozen fallback states by rendering unfinished Suspense boundaries on the client. — [source](https://github.com/react/react/releases/tag/v19.1.0)
- Fixed asserts in React Native when passChildrenWhenCloningPersistedNodes is enabled for OffscreenComponent … — [source](https://github.com/react/react/releases/tag/v19.1.0)

**💥 BREAKING** (2)
- Fixed a bug where dev-only methods were exported in production builds. React.act is no longer available in … — [source](https://github.com/react/react/releases/tag/v19.1.0)
- Removed support for using HTML comments (e.g. `<!-- -->`) as a DOM container. — [source](https://github.com/react/react/releases/tag/v19.1.0)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.1.0`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.1.0 peerDependencies** (reverse coupling evidence): `{"react": "^19.1.0"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2026-07-21 — `v19.0.8` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Performance improvements when decoding — [source](https://github.com/react/react/releases/tag/v19.0.8)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.0.8`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.0.8 peerDependencies** (reverse coupling evidence): `{"react": "^19.0.8"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2026-06-01 — `v19.0.7` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Fixed missing `FormData` entries in Server Actions which regressed in 19.0.6 — [source](https://github.com/react/react/releases/tag/v19.0.7)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.0.7`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.0.7 peerDependencies** (reverse coupling evidence): `{"react": "^19.0.7"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2026-05-06 — `v19.0.6` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Type hardening and performance improvements — [source](https://github.com/react/react/releases/tag/v19.0.6)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.0.6`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.0.6 peerDependencies** (reverse coupling evidence): `{"react": "^19.0.6"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2026-04-08 — `v19.0.5` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Add more cycle protections — [source](https://github.com/react/react/releases/tag/v19.0.5)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.0.5`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.0.5 peerDependencies** (reverse coupling evidence): `{"react": "^19.0.5"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2026-01-26 — `v19.0.4` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Add more DoS mitigations to Server Actions, and harden Server Components — [source](https://github.com/react/react/releases/tag/v19.0.4)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.0.4`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.0.4 peerDependencies** (reverse coupling evidence): `{"react": "^19.0.4"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2025-12-11 — `v19.0.3` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Add extra loop protection to React Server Functions — [source](https://github.com/react/react/releases/tag/v19.0.3)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.0.3`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.0.3 peerDependencies** (reverse coupling evidence): `{"react": "^19.0.3"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2025-12-11 — `v19.0.2` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**📌 FEATURE** (1)
- Patch Promise cycles and toString on Server Functions — [source](https://github.com/react/react/releases/tag/v19.0.2)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.0.2`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.0.2 peerDependencies** (reverse coupling evidence): `{"react": "^19.0.2"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2025-12-03 — `v19.0.1` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Bring React Server Component fixes to Server Actions — [source](https://github.com/react/react/releases/tag/v19.0.1)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.0.1`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.0.1 peerDependencies** (reverse coupling evidence): `{"react": "^19.0.1"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2024-12-05 — `v19.0.0` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (22 changes)

**💥 BREAKING** (12)
- Removed deprecated APIs (React 19) — [source](https://react.dev/blog/2024/12/05/react-19)
- ref as prop; forwardRef no longer required — [source](https://react.dev/blog/2024/12/05/react-19)
- Removed: `propTypes`: Using `propTypes` will now be silently ignored. If required, we recommend migrating t… — [source](https://react.dev/blog/2024/12/05/react-19)
- Removed: `defaultProps` for functions: ES6 default parameters can be used in place. Class components contin… — [source](https://react.dev/blog/2024/12/05/react-19)
- Removed: `contextTypes` and `getChildContext`: Legacy Context for class components has been removed in favo… — [source](https://react.dev/blog/2024/12/05/react-19)
- Removed: string refs: Any usage of string refs need to be migrated to ref callbacks. — [source](https://react.dev/blog/2024/12/05/react-19)
- Removed: Module pattern factories: A rarely used pattern that can be migrated to regular functions. — [source](https://react.dev/blog/2024/12/05/react-19)
- Removed: `React.createFactory`: Now that JSX is broadly supported, all `createFactory` usage can be migrate… — [source](https://react.dev/blog/2024/12/05/react-19)
- Removed: `react-test-renderer/shallow`: This has been a re-export of react-shallow-renderer since React 18\… — [source](https://react.dev/blog/2024/12/05/react-19)
- UMD builds removed: To load React 19 with a script tag, we recommend using an ESM-based CDN such as esm.sh. — [source](https://react.dev/blog/2024/12/05/react-19)
- Removed deprecated TypeScript types: — [source](https://react.dev/blog/2024/12/05/react-19)
- JSX namespace in TypeScript: The global `JSX` namespace is removed to improve interoperability with other l… — [source](https://react.dev/blog/2024/12/05/react-19)

**📌 FEATURE** (3)
- Actions + useActionState / useOptimistic / useFormStatus — [source](https://react.dev/blog/2024/12/05/react-19)
- use() API — [source](https://react.dev/blog/2024/12/05/react-19)
- Document metadata / stylesheets / async scripts (DOM) — [source](https://react.dev/blog/2024/12/05/react-19)

**📌 DEPRECATION** (3)
- element.ref access deprecated — [source](https://react.dev/blog/2024/12/05/react-19)
- Deprecated: `element.ref` access: React 19 supports ref as a prop, so we’re deprecating `element.ref` in fa… — [source](https://react.dev/blog/2024/12/05/react-19)
- `react-test-renderer`: In React 19, react-test-renderer logs a deprecation warning and has switched to conc… — [source](https://react.dev/blog/2024/12/05/react-19)

**📌 PEER-DEPS** (2)
- react-dom@19 peers react@^19 — [source](https://react.dev/blog/2024/12/05/react-19)
- RSC features such as directives, server components, and server functions are now stable. This means librari… — [source](https://react.dev/blog/2024/12/05/react-19)

**🚀 MIGRATION** (1)
- Upgrade via 18.3.1 then 19 — [source](https://react.dev/blog/2024/12/05/react-19)

**📌 KNOWN-BUGS/RISK** (1)
- StrictMode + concurrent still double-invoke in DEV — [source](https://react.dev/blog/2024/12/05/react-19)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@19.0.0`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@19.0.0 peerDependencies** (reverse coupling evidence): `{"react": "^19.0.0"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2024-04-26 — `v18.3.1` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (1 changes)

**🐛 FIX** (1)
- Export `act` from `react` — [source](https://github.com/facebook/react/releases/tag/v18.3.1)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@18.3.1`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@18.3.1 peerDependencies** (reverse coupling evidence): `{"react": "^18.3.1"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2024-04-25 — `v18.3.0` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (12 changes)

**📌 DEPRECATION** (10)
- Deprecation warnings for React 19 prep — [source](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- Warn for deprecated `findDOMNode` outside StrictMode c3b283 — [source](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- Warn for deprecated `test-utils` methods d4ea75 — [source](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- Warn for deprecated Legacy Context outside StrictMode 415ee0 — [source](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- Warn for deprecated string refs outside StrictMode — [source](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- Warn for deprecated `defaultProps` for function components — [source](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- Warn when using `act` from `test-utils` d4ea75 — [source](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- Warn for deprecated `unmountComponentAtNode` 8a015b — [source](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- Warn for deprecated `renderToStaticNodeStream` — [source](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- Warn when spreading `key` — [source](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

**🚀 MIGRATION** (2)
- Install 18.3.1 before React 19 — [source](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- Allow writing to `this.refs` to support string ref codemod 909071 — [source](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@18.3.0`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@18.3.0 peerDependencies** (reverse coupling evidence): `{"react": "^18.3.0"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2022-06-14 — `v18.2.0` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (10 changes)

**🐛 FIX** (4)
- Fix false positive hydration errors with Suspense. — [source](https://github.com/react/react/releases/tag/v18.2.0)
- Fix hydrating into `document` causing a blank page on mismatch. — [source](https://github.com/react/react/releases/tag/v18.2.0)
- Fix ignored `setState` in Safari when adding an iframe. — [source](https://github.com/react/react/releases/tag/v18.2.0)
- Fix buffering in some worker environments by explicitly setting `highWaterMark` to `0`. — [source](https://github.com/react/react/releases/tag/v18.2.0)

**📌 FEATURE** (6)
- Add support for `useId()` inside Server Components. (@gnoff) in — [source](https://github.com/react/react/releases/tag/v18.2.0)
- Provide a component stack as a second argument to `onRecoverableError`. — [source](https://github.com/react/react/releases/tag/v18.2.0)
- Pass information about server errors to the client. — [source](https://github.com/react/react/releases/tag/v18.2.0)
- Allow to provide a reason when aborting the HTML stream. — [source](https://github.com/react/react/releases/tag/v18.2.0)
- Eliminate extraneous text separators in the HTML where possible. — [source](https://github.com/react/react/releases/tag/v18.2.0)
- Disallow complex children inside `<title>` elements to match the browser constraints. — [source](https://github.com/react/react/releases/tag/v18.2.0)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@18.2.0`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@18.2.0 peerDependencies** (reverse coupling evidence): `{"react": "^18.2.0"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2022-04-26 — `v18.1.0` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (16 changes)

**📌 DEPRECATION** (1)
- Warn when calling `setState` in `useInsertionEffect`. — [source](https://github.com/react/react/releases/tag/v18.1.0)

**🐛 FIX** (11)
- Fix the false positive warning about `react-dom/client` when using UMD bundle. — [source](https://github.com/react/react/releases/tag/v18.1.0)
- Fix `suppressHydrationWarning` to work in production too. — [source](https://github.com/react/react/releases/tag/v18.1.0)
- Fix `componentWillUnmount` firing twice inside of Suspense. — [source](https://github.com/react/react/releases/tag/v18.1.0)
- Fix `useDeferredValue` causing an infinite loop when passed an unmemoized value. — [source](https://github.com/react/react/releases/tag/v18.1.0)
- Fix throttling of revealing Suspense fallbacks. — [source](https://github.com/react/react/releases/tag/v18.1.0)
- Fix a spurious hydration error. — [source](https://github.com/react/react/releases/tag/v18.1.0)
- Fix some transition updates being ignored. — [source](https://github.com/react/react/releases/tag/v18.1.0)
- Fix an inconsistency in whether the props object is the same between renders. — [source](https://github.com/react/react/releases/tag/v18.1.0)
- Fix a missing warning about a `setState` loop in `useEffect`. — [source](https://github.com/react/react/releases/tag/v18.1.0)
- Fix escaping for the `bootstrapScriptContent` contents. — [source](https://github.com/react/react/releases/tag/v18.1.0)
- Fix false positive errors with a large number of branches. — [source](https://github.com/react/react/releases/tag/v18.1.0)

**📌 FEATURE** (3)
- Replace the implementation with the `use-sync-external-store` shim. — [source](https://github.com/react/react/releases/tag/v18.1.0)
- Ensure the reason for hydration errors is always displayed. — [source](https://github.com/react/react/releases/tag/v18.1.0)
- Significantly improve performance of `renderToPipeableStream`. — [source](https://github.com/react/react/releases/tag/v18.1.0)

**📌 KNOWN-BUGS/RISK** (1)
- Don't consider a known dependency stable when the variable is reassigned. — [source](https://github.com/react/react/releases/tag/v18.1.0)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@18.1.0`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@18.1.0 peerDependencies** (reverse coupling evidence): `{"react": "^18.1.0"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```

---

## 📅 2022-03-29 — `v18.0.0` 

### 1. 6-State Sliding Feature Kernel

_Kernel: no shard loaded._

### 2. Release Cards (22 changes)

**💥 BREAKING** (7)
- Automatic batching everywhere — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)
- createRoot replaces ReactDOM.render — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)
- **Stricter hydration errors**: Hydration mismatches due to missing or extra text content are now treated li… — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)
- **Components can now render `undefined`:** React no longer throws if you return `undefined` from a componen… — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)
- **No warning about `setState` on unmounted components:** Previously, React warned about memory leaks when y… — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)
- **No suppression of console logs:** When you use Strict Mode, React renders each component twice to help yo… — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)
- **`renderToString`:** Will no longer error when suspending on the server. Instead, it will emit the fallbac… — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)

**📌 FEATURE** (5)
- Concurrent hooks: useTransition / startTransition / useDeferredValue — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)
- useId — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)
- useSyncExternalStore — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)
- useInsertionEffect — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)
- Strict Mode re-run effects (DEV) — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)

**🚀 MIGRATION** (1)
- React 18 upgrade path — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)

**📌 DEPRECATION** (5)
- `react-dom`: `ReactDOM.render` has been deprecated. Using it will warn and run your app in React 17 mode. — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)
- `react-dom`: `ReactDOM.hydrate` has been deprecated. Using it will warn and run your app in React 17 mode. — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)
- `react-dom`: `ReactDOM.unmountComponentAtNode` has been deprecated. — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)
- `react-dom`: `ReactDOM.renderSubtreeIntoContainer` has been deprecated. — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)
- `react-dom/server`: `ReactDOMServer.renderToNodeStream` has been deprecated. — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)

**🐛 FIX** (4)
- `useDeferredValue` lets you defer re-rendering a non-urgent part of the tree. It is similar to debouncing, … — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)
- **Stricter Strict Mode**: In the future, React will provide a feature that lets components preserve state b… — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)
- **Layout Effects with Suspense**: When a tree re-suspends and reverts to a fallback, React will now clean u… — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)
- **Improved memory usage:** React now cleans up more internal fields on unmount, making the impact from unfi… — [source](https://reactjs.org/blog/2022/03/29/react-v18.html)

### 4. Peer Dependencies

```
- **peerDependencies** (npm `react@18.0.0`): `{}` (empty — react declares none)
- **engines**: `{"node": ">=0.10.0"}`
- **react-dom@18.0.0 peerDependencies** (reverse coupling evidence): `{"react": "^18.0.0"}`
- **react-native peer on react** (consumer evidence, not declared by react): see `compat/p
```


---

## Audit Integrity

- **Versions covered**: 34
- **Archive source**: Chronos/Grok rn-terrain corpus (extracted 2026-09-26)
- **Combos cross-referenced**: 6 relevant combos
- **Signals cross-referenced**: 0 Chronos signals
- **Audit vector**: Present ➔ Past (19.3.0 ➔ 18.0.0)
