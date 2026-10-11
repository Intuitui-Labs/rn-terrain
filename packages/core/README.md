# @intuitui-labs/rn-terrain-core

[![npm version](https://img.shields.io/npm/v/@intuitui-labs/rn-terrain-core.svg?style=flat-square)](https://www.npmjs.com/package/@intuitui-labs/rn-terrain-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-blue.svg?style=flat-square)](https://www.typescriptlang.org/)

> **The outside reference and bitemporal intelligence engine for the React Native ecosystem.**  
> Supplies AI coding agents and developer toolchains with authoritative verdicts: what is canonical, what has been severed, and what is safe to code.

---

## 💡 The Idea Web Made Operational

Large Language Models suffer from the **frozen past problem**: probabilistic token prediction defaults to the 2021–2023 patterns that dominate their training corpus (e.g. `useAnimatedGestureHandler`, `findNodeHandle`, legacy asynchronous bridges).

**`rn-terrain-core` supplies the outside referent that models lack:**
- **Verdicts & Gates, Not Just Documentation**: While documentation search feeds raw text, `rn-terrain-core` issues definitive verdicts (Banned/Severed vs Canonical Modern, Policy Gate evaluations, and AST diff validation).
- **Pre-Flight Agent Compass**: Dense, structured grounding briefings designed to be injected into agent system context *before* the first line of React Native code is emitted.
- **Physical Node Affordances**: Reads the `.d.ts` declaration files, exports, and README snippets physically installed in `node_modules` to ground against reality rather than hallucinated APIs.
- **Bitemporal Knowledge Engine**: Powered by an embedded SQLite catalog tracking valid time (when an API changed in the ecosystem) and transaction time (when the fact was recorded).
- **E-Type Freshness**: Built to track software evolution over time through hexagonal ingestion (React Native Directory, GitHub, npm, and Bundlephobia).

---

## 📦 Installation

```bash
pnpm add @intuitui-labs/rn-terrain-core
# or
npm install @intuitui-labs/rn-terrain-core
```

---

## 🚀 Programmatic Quickstart

### 1. Pre-Flight Agent Compass (`generateAgentCompass`)

Query canonical vs severed APIs before code generation:

```typescript
import { generateAgentCompass } from '@intuitui-labs/rn-terrain-core';

// Ground an agent on react-native-reanimated
const compass = generateAgentCompass('react-native-reanimated', 'latest');

console.log(compass.architecture);
// => 'NEW_ARCHITECTURE_FABRIC_READY'

console.log(compass.bannedSeveredSymbols);
// => [
//      {
//        identifier: 'useAnimatedGestureHandler',
//        status: 'UNSUPPORTED_REMOVED',
//        replacement: 'Gesture.Pan().onUpdate(...)',
//        codemodHint: 'Migrate to RNGH Gestures'
//      },
//      {
//        identifier: 'interpolateNode',
//        status: 'UNSUPPORTED_REMOVED',
//        replacement: 'interpolate',
//        codemodHint: 'Replace legacy interpolateNode with modern interpolate'
//      }
//    ]

console.log(compass.preflightInstruction);
// Ready-to-inject prompt for LLM system context
```

### 2. Physical Node Affordances (`extractAffordanceCard`)

Ground an agent on the exact TypeScript symbols and types physically installed on disk:

```typescript
import { extractAffordanceCard } from '@intuitui-labs/rn-terrain-core';

const affordance = extractAffordanceCard('react-native-reanimated', process.cwd());

if (affordance) {
  console.log('Installed Version:', affordance.version);
  console.log('Exported Components:', affordance.exportedComponents);
  console.log('Exported Functions:', affordance.exportedFunctions);
  console.log('Extracted Snippet:', affordance.usageSnippet);
}
```

### 3. Capability Resolution (`resolveCapability`)

Resolve an abstract architectural primitive to grounded packages and introduced versions:

```typescript
import { CANONICAL_CAPABILITIES } from '@intuitui-labs/rn-terrain-core';

const gestureCapability = CANONICAL_CAPABILITIES.find(
  (c) => c.capability.id === 'gesture.pan_recognition'
);

console.log(gestureCapability?.providedBy);
// => [
//      {
//        packageId: 'react-native-gesture-handler',
//        versionIntroduced: '2.0.0',
//        qualityTier: 'TIER_1',
//        performanceProfile: 'WORKLET_NATIVE'
//      }
//    ]
```

### 4. Canonical Database Port (`createCatalog` / `CanonicalDatabase`)

Access the bitemporal catalog, version matrix, and technology radar:

```typescript
import { createCatalog } from '@intuitui-labs/rn-terrain-core';

const catalog = createCatalog();

// Retrieve all packages and versions
const pkgs = catalog.getAllPackages();
const versions = catalog.getVersions('react-native-reanimated');
const severed = catalog.getSeveredSymbols('react-native-reanimated');
```

---

## 🛠️ Subpath Exports

`@intuitui-labs/rn-terrain-core` is tree-shakable with targeted subpath exports:

| Export | Description |
| :--- | :--- |
| `@intuitui-labs/rn-terrain-core` | Core compass, affordance engine, database, and schema exports |
| `@intuitui-labs/rn-terrain-core/db` | SQLite client, embedded in-memory catalog port, and schema DDL |
| `@intuitui-labs/rn-terrain-core/queries` | Bitemporal queries and compatibility combo matrix lookups |
| `@intuitui-labs/rn-terrain-core/radar` | Technology Radar evaluation, decision records, and capture |
| `@intuitui-labs/rn-terrain-core/scoring` | Vitality scoring and ecosystem weight algorithms |
| `@intuitui-labs/rn-terrain-core/sync-daily` | Daily telemetry sync for GitHub stars, npm downloads, and release velocity |
| `@intuitui-labs/rn-terrain-core/types` | Complete TypeScript type definitions for bitemporal records and agents |

---

## 📄 License

MIT © [Intuitui Labs](https://github.com/intuitui-labs)
