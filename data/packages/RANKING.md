# RN Terrain: ranking (core vs leaf, break-if-gone)

Built 2026-10-05 23:14 Colombo time from `pnpm-lock.yaml` (lockfile v9: 32 importers, 4,211 package entries, 4,367 snapshots, 3,290 distinct installed names) plus `usage` and `package_profile` in `rn_packages.db`. Formula version: `blast-v2`. The table is `package_rank`.

## What is measured (per direct package)

| metric | meaning | source |
|---|---|---|
| direct_consumers_rt / _dev | workspace members declaring it in dependencies or peerDependencies / only in devDependencies | `usage` |
| dependents_direct | installed packages with a **hard** dependency on it (dependencies + optionalDependencies, peers excluded) | lockfile snapshots |
| dependents_transitive | reverse closure over hard edges | lockfile |
| dependents_transitive_all | reverse closure over hard edges **plus required (non-optional) peer edges**: everything that breaks if this package is broken | lockfile snapshots + packages.peerDependencies(Meta) |
| peer_dependents / _required | installed packages that list it as a peer (all / non-optional) | lockfile `packages` |
| fan_out_direct / _transitive | how much it pulls in (hard deps, distinct names) | lockfile |
| importer_reach / _runtime | how many of the 32 importers have it in their closure (all sections / excluding devDependencies) | lockfile |
| is_native | ships Android/iOS sources, a podspec or an xcframework in the tarball of the resolved version | jsDelivr / unpkg file listing |
| sacred_pin | one of your 9 pinned spine packages | your list |

## Formula (`blast-v2`, max about 108 points)

```
score = 30 * ln(1+req_peer_dependents)        / max
      + 20 * ln(1+dependents_transitive_all)  / max
      + 15 * ln(1+rt_consumers + 0.5*dev_consumers) / max
      + 15 * importer_reach_runtime / 32
      + 20 * layer_prior   (L0 1.0, L1 .85, L2 .8, L3 .65, L4 .45, S1 .45, L5 .3, L6 .2, D* .1)
      +  4 * is_native  +  4 * sacred_pin
score *= 0.3  if DEV-ONLY
```

Why the weights fall where they do: a **required peer** is the strongest spine signal, because it means other libraries are built *on top of* this one as a host (react, react-native, expo, reanimated). The transitive-dependents count catches hidden anchors such as `expo-modules-core`, which has 0 direct consumers but 82 dependents through `expo`. Logs keep react's 156 peers from flattening everything else. `layer_prior` is the one judgement term. It is capped at 20 points and documented so you can set it to 0 and see the purely structural ranking.

## Classes (rules applied in order)

1. **DEV-ONLY**: stack layer is D1 to D6, or the package is declared only in devDependencies **and** is not in any importer's runtime closure.
2. **CORE-SPINE**: the L0/L1 framework an app declares in `dependencies` (next for gurudevi-web, astro, svelte and starlight for the Astro sites, react, react-native and expo for mobile); or a sacred pin; or an L0/L1/L2 package with runtime reach ≥3 and (≥3 required peers or ≥2 runtime consumers); or ≥20 required-peer dependents; or ≥50 transitive dependents within L0 to L3.
3. **STRUCTURAL**: ≥3 required-peer dependents, or ≥10 transitive dependents, or ≥4 runtime consumers. A leaf that is a hard dependency or required peer of a CORE-SPINE or STRUCTURAL package is promoted here too (for example `react-native-screens` because of `expo-router`).
4. **SWAPPABLE-LEAF**: an L6 UI kit, or a pure-JS L4 utility, colour, polyfill or React helper.
5. **FEATURE-LEAF**: everything else. Removing it breaks the feature(s) that import it.

`removal_effect` answers a different question, "what happens if I delete it from my manifests?", and the answer is often *nothing*. `semver`, `color-name`, `scheduler` and the expo sub-modules **stay installed** because other packages depend on them. So **class** is the blast radius if the package itself breaks, and **removal_effect** is the consequence of un-declaring it.

## Class counts

| class | packages |
|---|---|
| CORE-SPINE | 20 |
| STRUCTURAL | 46 |
| FEATURE-LEAF | 148 |
| SWAPPABLE-LEAF | 42 |
| DEV-ONLY | 131 |

By type:

| type | n | CORE-SPINE | STRUCTURAL | FEATURE-LEAF | SWAPPABLE-LEAF | DEV-ONLY |
|---|---|---|---|---|---|---|
| expo | 82 | 3 | 15 | 52 | 3 | 9 |
| react-native | 75 | 7 | 5 | 30 | 20 | 13 |
| build-tooling | 44 | 0 | 1 | 0 | 0 | 43 |
| lint-format | 32 | 0 | 0 | 0 | 0 | 32 |
| data | 25 | 0 | 4 | 20 | 0 | 1 |
| react | 22 | 4 | 4 | 3 | 8 | 3 |
| utility | 22 | 1 | 7 | 10 | 4 | 0 |
| observability | 14 | 1 | 4 | 8 | 0 | 1 |
| types | 14 | 0 | 0 | 0 | 0 | 14 |
| ui-visual | 12 | 0 | 2 | 3 | 7 | 0 |
| test | 12 | 0 | 0 | 0 | 0 | 12 |
| ai | 10 | 0 | 1 | 9 | 0 | 0 |
| web-framework | 8 | 4 | 0 | 1 | 0 | 3 |
| backend | 7 | 0 | 2 | 5 | 0 | 0 |
| internal | 4 | 0 | 0 | 4 | 0 | 0 |
| state | 3 | 0 | 0 | 3 | 0 | 0 |
| i18n | 1 | 0 | 1 | 0 | 0 | 0 |

## Top 25 overall

| # | package | type | layer | class | score | req-peer deps | all dependents | rt consumers | dev consumers | rt reach /32 | fan-out | native | sacred |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | react-native | react-native | L0-ENGINE | CORE-SPINE | 95.55 | 119 | 151 | 17 | 0 | 17 | 226 | 1 | 1 |
| 2 | react | react | L1-FRAMEWORK | CORE-SPINE | 92.88 | 156 | 209 | 18 | 0 | 20 | 0 | 0 | 1 |
| 3 | expo | expo | L1-FRAMEWORK | CORE-SPINE | 80.58 | 78 | 81 | 4 | 0 | 15 | 553 | 1 | 1 |
| 4 | zod | utility | L4-APP-INFRA | CORE-SPINE | 64.52 | 22 | 163 | 6 | 0 | 22 | 0 | 0 | 0 |
| 5 | react-native-reanimated | react-native | L3-UI-PRIMITIVES | CORE-SPINE | 62.12 | 10 | 11 | 9 | 0 | 15 | 4 | 1 | 1 |
| 6 | react-dom | react | L1-FRAMEWORK | CORE-SPINE | 59.04 | 13 | 16 | 4 | 0 | 19 | 1 | 0 | 0 |
| 7 | @opentelemetry/api | observability | L4-APP-INFRA | CORE-SPINE | 58.05 | 84 | 95 | 1 | 0 | 9 | 0 | 0 | 0 |
| 8 | react-native-worklets | react-native | L2-NATIVE-BRIDGE | CORE-SPINE | 55.9 | 5 | 13 | 2 | 0 | 15 | 66 | 1 | 1 |
| 9 | react-native-gesture-handler | react-native | L3-UI-PRIMITIVES | CORE-SPINE | 53.23 | 5 | 6 | 4 | 0 | 15 | 6 | 1 | 1 |
| 10 | expo-font | expo | L3-UI-PRIMITIVES | CORE-SPINE | 50.57 | 2 | 81 | 2 | 0 | 15 | 0 | 1 | 0 |
| 11 | scheduler | react | L1-FRAMEWORK | CORE-SPINE | 46.87 | 0 | 177 | 1 | 0 | 20 | 0 | 0 | 0 |
| 12 | react-native-svg | react-native | L3-UI-PRIMITIVES | STRUCTURAL | 46.86 | 6 | 6 | 5 | 0 | 6 | 14 | 1 | 0 |
| 13 | expo-constants | expo | L4-APP-INFRA | STRUCTURAL | 46.57 | 2 | 81 | 2 | 0 | 15 | 52 | 1 | 0 |
| 14 | react-is | react | L1-FRAMEWORK | CORE-SPINE | 45.99 | 0 | 208 | 1 | 0 | 17 | 0 | 0 | 0 |
| 15 | expo-file-system | expo | L4-APP-INFRA | STRUCTURAL | 45.05 | 0 | 81 | 7 | 0 | 15 | 0 | 1 | 0 |
| 16 | semver | build-tooling | L4-APP-INFRA | STRUCTURAL | 43.78 | 0 | 449 | 1 | 0 | 24 | 2 | 0 | 0 |
| 17 | react-native-nitro-modules | react-native | L2-NATIVE-BRIDGE | CORE-SPINE | 43.76 | 4 | 4 | 1 | 0 | 3 | 0 | 1 | 1 |
| 18 | expo-modules-core | expo | L2-NATIVE-BRIDGE | CORE-SPINE | 43.56 | 0 | 82 | 0 | 1 | 15 | 5 | 1 | 0 |
| 19 | react-native-safe-area-context | react-native | L3-UI-PRIMITIVES | STRUCTURAL | 42.39 | 3 | 3 | 2 | 0 | 15 | 0 | 1 | 0 |
| 20 | expo-asset | expo | L4-APP-INFRA | STRUCTURAL | 42.1 | 1 | 81 | 1 | 0 | 15 | 64 | 1 | 0 |
| 21 | color-name | ui-visual | L4-APP-INFRA | STRUCTURAL | 40.99 | 0 | 294 | 1 | 0 | 21 | 0 | 0 | 0 |
| 22 | astro | web-framework | L1-FRAMEWORK | CORE-SPINE | 40.03 | 5 | 5 | 2 | 0 | 2 | 286 | 0 | 0 |
| 23 | uuid | utility | L4-APP-INFRA | STRUCTURAL | 39.33 | 0 | 106 | 3 | 0 | 17 | 0 | 0 | 0 |
| 24 | svelte | web-framework | L1-FRAMEWORK | CORE-SPINE | 38.23 | 3 | 3 | 3 | 0 | 3 | 19 | 0 | 0 |
| 25 | expo-server | expo | S1-SERVER | STRUCTURAL | 38.14 | 1 | 82 | 1 | 0 | 15 | 0 | 0 | 0 |

Score and class are related but not the same thing. The score is pure graph blast radius. The class adds two policy rules: an app's own framework is CORE-SPINE (which is why `next` is CORE-SPINE at only #81: nothing installed peers on it, but gurudevi-web *is* next), and so are your sacred pins (`class_reason` says when the graph alone would have given a lower class, for example `react-native-mmkv`).

How to read it: rows 1 to 3 are the platform (react-native, react, expo). `zod` and `@opentelemetry/api` rank high because many installed libraries peer-depend on them (the AI SDK, MCP, oRPC and OTel stacks), not because your app calls them much. That is a real blast radius on the server side.

## Top 5 within each type (type-adjusted: `type_pct` is the score as a % of the type leader)

### react-native (75 packages)

| #type | package | class | score | type % | #overall | req-peer | all deps | rt cons | layer |
|---|---|---|---|---|---|---|---|---|---|
| 1 | react-native | CORE-SPINE | 95.55 | 100.0 | 1 | 119 | 151 | 17 | L0-ENGINE |
| 2 | react-native-reanimated | CORE-SPINE | 62.12 | 65.0 | 5 | 10 | 11 | 9 | L3-UI-PRIMITIVES |
| 3 | react-native-worklets | CORE-SPINE | 55.9 | 58.5 | 8 | 5 | 13 | 2 | L2-NATIVE-BRIDGE |
| 4 | react-native-gesture-handler | CORE-SPINE | 53.23 | 55.7 | 9 | 5 | 6 | 4 | L3-UI-PRIMITIVES |
| 5 | react-native-svg | STRUCTURAL | 46.86 | 49.0 | 12 | 6 | 6 | 5 | L3-UI-PRIMITIVES |

### react (22 packages)

| #type | package | class | score | type % | #overall | req-peer | all deps | rt cons | layer |
|---|---|---|---|---|---|---|---|---|---|
| 1 | react | CORE-SPINE | 92.88 | 100.0 | 2 | 156 | 209 | 18 | L1-FRAMEWORK |
| 2 | react-dom | CORE-SPINE | 59.04 | 63.6 | 6 | 13 | 16 | 4 | L1-FRAMEWORK |
| 3 | scheduler | CORE-SPINE | 46.87 | 50.5 | 11 | 0 | 177 | 1 | L1-FRAMEWORK |
| 4 | react-is | CORE-SPINE | 45.99 | 49.5 | 14 | 0 | 208 | 1 | L1-FRAMEWORK |
| 5 | @tanstack/react-query | STRUCTURAL | 34.07 | 36.7 | 32 | 1 | 1 | 12 | L4-APP-INFRA |

### expo (82 packages)

| #type | package | class | score | type % | #overall | req-peer | all deps | rt cons | layer |
|---|---|---|---|---|---|---|---|---|---|
| 1 | expo | CORE-SPINE | 80.58 | 100.0 | 3 | 78 | 81 | 4 | L1-FRAMEWORK |
| 2 | expo-font | CORE-SPINE | 50.57 | 62.8 | 10 | 2 | 81 | 2 | L3-UI-PRIMITIVES |
| 3 | expo-constants | STRUCTURAL | 46.57 | 57.8 | 13 | 2 | 81 | 2 | L4-APP-INFRA |
| 4 | expo-file-system | STRUCTURAL | 45.05 | 55.9 | 15 | 0 | 81 | 7 | L4-APP-INFRA |
| 5 | expo-modules-core | CORE-SPINE | 43.56 | 54.1 | 18 | 0 | 82 | 0 | L2-NATIVE-BRIDGE |

### utility (22 packages)

| #type | package | class | score | type % | #overall | req-peer | all deps | rt cons | layer |
|---|---|---|---|---|---|---|---|---|---|
| 1 | zod | CORE-SPINE | 64.52 | 100.0 | 4 | 22 | 163 | 6 | L4-APP-INFRA |
| 2 | uuid | STRUCTURAL | 39.33 | 61.0 | 23 | 0 | 106 | 3 | L4-APP-INFRA |
| 3 | ieee754 | STRUCTURAL | 38.13 | 59.1 | 26 | 0 | 122 | 1 | L4-APP-INFRA |
| 4 | buffer | STRUCTURAL | 37.96 | 58.8 | 27 | 0 | 116 | 1 | L4-APP-INFRA |
| 5 | invariant | STRUCTURAL | 37.33 | 57.9 | 29 | 0 | 170 | 1 | L4-APP-INFRA |

### observability (14 packages)

| #type | package | class | score | type % | #overall | req-peer | all deps | rt cons | layer |
|---|---|---|---|---|---|---|---|---|---|
| 1 | @opentelemetry/api | CORE-SPINE | 58.05 | 100.0 | 7 | 84 | 95 | 1 | L4-APP-INFRA |
| 2 | @opentelemetry/core | STRUCTURAL | 33.63 | 57.9 | 33 | 2 | 55 | 1 | S1-SERVER |
| 3 | @opentelemetry/semantic-conventions | STRUCTURAL | 32.23 | 55.5 | 37 | 1 | 75 | 1 | S1-SERVER |
| 4 | @opentelemetry/sdk-trace-base | STRUCTURAL | 28.31 | 48.8 | 48 | 1 | 22 | 1 | S1-SERVER |
| 5 | @opentelemetry/resources | STRUCTURAL | 25.48 | 43.9 | 59 | 0 | 33 | 1 | S1-SERVER |

### build-tooling (44 packages)

| #type | package | class | score | type % | #overall | req-peer | all deps | rt cons | layer |
|---|---|---|---|---|---|---|---|---|---|
| 1 | semver | STRUCTURAL | 43.78 | 100.0 | 16 | 0 | 449 | 1 | L4-APP-INFRA |
| 2 | typescript | DEV-ONLY | 17.64 | 40.3 | 128 | 23 | 65 | 3 | D1-BUILD |
| 3 | postcss | DEV-ONLY | 11.47 | 26.2 | 226 | 3 | 115 | 0 | D1-BUILD |
| 4 | @babel/runtime | DEV-ONLY | 10.29 | 23.5 | 238 | 1 | 192 | 0 | D1-BUILD |
| 5 | @babel/traverse | DEV-ONLY | 10.0 | 22.8 | 242 | 0 | 278 | 0 | D1-BUILD |

### ui-visual (12 packages)

| #type | package | class | score | type % | #overall | req-peer | all deps | rt cons | layer |
|---|---|---|---|---|---|---|---|---|---|
| 1 | color-name | STRUCTURAL | 40.99 | 100.0 | 21 | 0 | 294 | 1 | L4-APP-INFRA |
| 2 | inline-style-prefixer | FEATURE-LEAF | 25.83 | 63.0 | 57 | 0 | 1 | 1 | L3-UI-PRIMITIVES |
| 3 | styleq | FEATURE-LEAF | 25.83 | 63.0 | 58 | 0 | 1 | 1 | L3-UI-PRIMITIVES |
| 4 | clsx | STRUCTURAL | 16.94 | 41.3 | 149 | 0 | 9 | 1 | L6-UI-KIT |
| 5 | apca-w3 | FEATURE-LEAF | 15.53 | 37.9 | 165 | 0 | 0 | 2 | L4-APP-INFRA |

### web-framework (8 packages)

| #type | package | class | score | type % | #overall | req-peer | all deps | rt cons | layer |
|---|---|---|---|---|---|---|---|---|---|
| 1 | astro | CORE-SPINE | 40.03 | 100.0 | 22 | 5 | 5 | 2 | L1-FRAMEWORK |
| 2 | svelte | CORE-SPINE | 38.23 | 95.5 | 24 | 3 | 3 | 3 | L1-FRAMEWORK |
| 3 | @astrojs/svelte | FEATURE-LEAF | 23.53 | 58.8 | 75 | 0 | 0 | 2 | L1-FRAMEWORK |
| 4 | next | CORE-SPINE | 22.87 | 57.1 | 81 | 0 | 0 | 1 | L1-FRAMEWORK |
| 5 | @astrojs/starlight | CORE-SPINE | 21.0 | 52.5 | 98 | 0 | 0 | 1 | L1-FRAMEWORK |

### backend (7 packages)

| #type | package | class | score | type % | #overall | req-peer | all deps | rt cons | layer |
|---|---|---|---|---|---|---|---|---|---|
| 1 | hono | STRUCTURAL | 36.18 | 100.0 | 31 | 5 | 15 | 2 | S1-SERVER |
| 2 | @hono/node-server | STRUCTURAL | 21.32 | 58.9 | 97 | 0 | 10 | 1 | S1-SERVER |
| 3 | inngest | FEATURE-LEAF | 17.47 | 48.3 | 132 | 0 | 0 | 3 | S1-SERVER |
| 4 | @hono/zod-openapi | FEATURE-LEAF | 15.53 | 42.9 | 160 | 0 | 0 | 2 | S1-SERVER |
| 5 | @cedar-policy/cedar-wasm | FEATURE-LEAF | 13.0 | 35.9 | 197 | 0 | 0 | 1 | S1-SERVER |

### i18n (1 packages)

| #type | package | class | score | type % | #overall | req-peer | all deps | rt cons | layer |
|---|---|---|---|---|---|---|---|---|---|
| 1 | i18next | STRUCTURAL | 30.47 | 100.0 | 39 | 1 | 2 | 3 | L4-APP-INFRA |

### data (25 packages)

| #type | package | class | score | type % | #overall | req-peer | all deps | rt cons | layer |
|---|---|---|---|---|---|---|---|---|---|
| 1 | @powersync/common | STRUCTURAL | 29.97 | 100.0 | 41 | 5 | 5 | 1 | L4-APP-INFRA |
| 2 | @orpc/client | FEATURE-LEAF | 27.95 | 93.3 | 50 | 1 | 6 | 3 | L4-APP-INFRA |
| 3 | @supabase/supabase-js | STRUCTURAL | 27.32 | 91.2 | 52 | 1 | 1 | 5 | L4-APP-INFRA |
| 4 | @tanstack/query-core | STRUCTURAL | 25.34 | 84.6 | 63 | 1 | 3 | 0 | L4-APP-INFRA |
| 5 | drizzle-orm | FEATURE-LEAF | 25.18 | 84.0 | 65 | 1 | 2 | 3 | L4-APP-INFRA |

### ai (10 packages)

| #type | package | class | score | type % | #overall | req-peer | all deps | rt cons | layer |
|---|---|---|---|---|---|---|---|---|---|
| 1 | @tanstack/ai | STRUCTURAL | 29.54 | 100.0 | 45 | 5 | 6 | 2 | L5-FEATURE |
| 2 | ai | FEATURE-LEAF | 18.18 | 61.5 | 125 | 1 | 2 | 1 | L5-FEATURE |
| 3 | @tanstack/ai-client | FEATURE-LEAF | 12.27 | 41.5 | 216 | 0 | 1 | 1 | L5-FEATURE |
| 4 | @ai-sdk/anthropic | FEATURE-LEAF | 10.0 | 33.9 | 239 | 0 | 0 | 1 | L5-FEATURE |
| 5 | @ai-sdk/google | FEATURE-LEAF | 10.0 | 33.9 | 240 | 0 | 0 | 1 | L5-FEATURE |

### state (3 packages)

| #type | package | class | score | type % | #overall | req-peer | all deps | rt cons | layer |
|---|---|---|---|---|---|---|---|---|---|
| 1 | effect | FEATURE-LEAF | 20.54 | 100.0 | 108 | 0 | 3 | 2 | L4-APP-INFRA |
| 2 | zustand | FEATURE-LEAF | 17.0 | 82.8 | 148 | 0 | 0 | 3 | L4-APP-INFRA |
| 3 | xstate | FEATURE-LEAF | 15.53 | 75.6 | 172 | 0 | 0 | 2 | L4-APP-INFRA |

### internal (4 packages)

| #type | package | class | score | type % | #overall | req-peer | all deps | rt cons | layer |
|---|---|---|---|---|---|---|---|---|---|
| 1 | @intuitui-labs/a11y-gate | FEATURE-LEAF | 17.47 | 100.0 | 129 | 0 | 0 | 3 | L4-APP-INFRA |
| 2 | @intuitui-labs/form-builder-engine | FEATURE-LEAF | 15.53 | 88.9 | 161 | 0 | 0 | 2 | L4-APP-INFRA |
| 3 | @intuitui-labs/editorial | FEATURE-LEAF | 13.0 | 74.4 | 199 | 0 | 0 | 1 | L4-APP-INFRA |
| 4 | @intuitui-labs/lk-edu-geo | FEATURE-LEAF | 13.0 | 74.4 | 200 | 0 | 0 | 1 | L4-APP-INFRA |

### lint-format (32 packages)

| #type | package | class | score | type % | #overall | req-peer | all deps | rt cons | layer |
|---|---|---|---|---|---|---|---|---|---|
| 1 | eslint | DEV-ONLY | 15.26 | 100.0 | 174 | 42 | 44 | 0 | D3-QUALITY |
| 2 | oxlint | DEV-ONLY | 6.62 | 43.4 | 273 | 4 | 5 | 1 | D3-QUALITY |
| 3 | globals | DEV-ONLY | 4.04 | 26.5 | 283 | 0 | 5 | 0 | D3-QUALITY |
| 4 | eslint-plugin-react-hooks | DEV-ONLY | 3.24 | 21.2 | 290 | 0 | 4 | 0 | D3-QUALITY |
| 5 | @eslint/eslintrc | DEV-ONLY | 2.8 | 18.3 | 299 | 0 | 0 | 2 | D3-QUALITY |

### types (14 packages)

| #type | package | class | score | type % | #overall | req-peer | all deps | rt cons | layer |
|---|---|---|---|---|---|---|---|---|---|
| 1 | @types/node | DEV-ONLY | 13.63 | 100.0 | 195 | 2 | 281 | 0 | D4-TYPES |
| 2 | @types/react | DEV-ONLY | 11.7 | 85.8 | 225 | 3 | 15 | 0 | D4-TYPES |
| 3 | @types/react-test-renderer | DEV-ONLY | 5.81 | 42.6 | 274 | 0 | 7 | 0 | D4-TYPES |
| 4 | @types/pg | DEV-ONLY | 3.98 | 29.2 | 285 | 0 | 5 | 0 | D4-TYPES |
| 5 | @types/react-dom | DEV-ONLY | 3.77 | 27.7 | 286 | 0 | 0 | 0 | D4-TYPES |

### test (12 packages)

| #type | package | class | score | type % | #overall | req-peer | all deps | rt cons | layer |
|---|---|---|---|---|---|---|---|---|---|
| 1 | vitest | DEV-ONLY | 8.94 | 100.0 | 255 | 3 | 3 | 0 | D2-TEST |
| 2 | jest | DEV-ONLY | 6.8 | 76.1 | 272 | 2 | 2 | 0 | D2-TEST |
| 3 | @jest/globals | DEV-ONLY | 5.68 | 63.5 | 275 | 0 | 10 | 0 | D2-TEST |
| 4 | playwright | DEV-ONLY | 3.0 | 33.6 | 296 | 0 | 2 | 0 | D2-TEST |
| 5 | @playwright/test | DEV-ONLY | 2.36 | 26.4 | 307 | 0 | 0 | 0 | D2-TEST |

## Safe leaves (bottom of the runtime ranking)

These are runtime packages with **0 installed dependents and 0 required-peer dependents**, so removing one affects only the code that imports it. 148 packages qualify. The 20 lowest:

| # | package | type | layer | class | score | rt cons | native | use case |
|---|---|---|---|---|---|---|---|---|
| 258 | @expo-google-fonts/inter | expo | L6-UI-KIT | SWAPPABLE-LEAF | 8.0 | 1 | 0 | Google Font "inter" packaged for Expo |
| 259 | @expo-google-fonts/poppins | expo | L6-UI-KIT | SWAPPABLE-LEAF | 8.0 | 1 | 0 | Google Font "poppins" packaged for Expo |
| 260 | @lottiefiles/dotlottie-react | react | L6-UI-KIT | SWAPPABLE-LEAF | 8.0 | 1 | 0 | Play dotLottie animations on web |
| 261 | @tanstack/react-table | react | L6-UI-KIT | SWAPPABLE-LEAF | 8.0 | 1 | 0 | Headless table/datagrid logic |
| 262 | d3 | ui-visual | L6-UI-KIT | SWAPPABLE-LEAF | 8.0 | 1 | 0 | Data visualization toolkit |
| 263 | phosphor-react-native | react-native | L6-UI-KIT | SWAPPABLE-LEAF | 8.0 | 1 | 0 | Phosphor icons for RN |
| 264 | react-native-fast-confetti | react-native | L6-UI-KIT | SWAPPABLE-LEAF | 8.0 | 1 | 0 | Confetti animation (Skia) |
| 265 | react-native-fast-shimmer | react-native | L6-UI-KIT | SWAPPABLE-LEAF | 8.0 | 1 | 0 | Shimmer loading placeholders |
| 266 | react-native-reanimated-skeleton | react-native | L6-UI-KIT | SWAPPABLE-LEAF | 8.0 | 1 | 0 | Skeleton loading placeholders |
| 267 | tailwind-merge | ui-visual | L6-UI-KIT | SWAPPABLE-LEAF | 8.0 | 1 | 0 | Merge Tailwind classes without conflicts |
| 268 | three | ui-visual | L6-UI-KIT | SWAPPABLE-LEAF | 8.0 | 1 | 0 | 3D rendering library (WebGL) |
| 239 | @ai-sdk/anthropic | ai | L5-FEATURE | FEATURE-LEAF | 10.0 | 1 | 0 | Anthropic provider for Vercel AI SDK |
| 240 | @ai-sdk/google | ai | L5-FEATURE | FEATURE-LEAF | 10.0 | 1 | 0 | Google Gemini provider for Vercel AI SDK |
| 241 | @ai-sdk/openai | ai | L5-FEATURE | FEATURE-LEAF | 10.0 | 1 | 0 | OpenAI provider for Vercel AI SDK |
| 243 | @tanstack/ai-anthropic | ai | L5-FEATURE | FEATURE-LEAF | 10.0 | 1 | 0 | Anthropic adapter for TanStack AI |
| 244 | @tanstack/ai-gemini | ai | L5-FEATURE | FEATURE-LEAF | 10.0 | 1 | 0 | Gemini adapter for TanStack AI |
| 245 | @tanstack/ai-openai | ai | L5-FEATURE | FEATURE-LEAF | 10.0 | 1 | 0 | OpenAI adapter for TanStack AI |
| 246 | @tanstack/ai-react | ai | L5-FEATURE | FEATURE-LEAF | 10.0 | 1 | 0 | React hooks for TanStack AI |
| 247 | @zip.js/zip.js | utility | L5-FEATURE | FEATURE-LEAF | 10.0 | 1 | 0 | Zip read/write |
| 248 | pdf-lib | utility | L5-FEATURE | FEATURE-LEAF | 10.0 | 1 | 0 | Create/modify PDFs |

72 of the 148 are native, so removing one still costs a native rebuild (prebuild, pods, gradle). The rest are pure JS and can be removed with a JS-only change: @expo-google-fonts/inter, @expo-google-fonts/poppins, @lottiefiles/dotlottie-react, @tanstack/react-table, d3, phosphor-react-native, react-native-fast-confetti, react-native-fast-shimmer, react-native-reanimated-skeleton, tailwind-merge, three, @ai-sdk/anthropic, @ai-sdk/google, @ai-sdk/openai, @tanstack/ai-anthropic, @tanstack/ai-gemini, @tanstack/ai-openai, @tanstack/ai-react, @zip.js/zip.js, pdf-lib, react-native-streamdown, sheetjs, tesseract.js, xlsx, @dnd-kit/sortable, expo-checkbox, lucide-react, lucide-react-native, react-native-gifted-charts, react-native-reanimated-carousel, react-native-redash, sonner-native, victory-native, qrcode, jpeg-js, jsqr, @azure/core-asynciterator-polyfill, @cedar-policy/cedar-wasm, @hono/swagger-ui, @intuitui-labs/editorial, @intuitui-labs/lk-edu-geo, @orpc/openapi, @orpc/opentelemetry, @orpc/pino, @orpc/tanstack-query, @scalar/hono-api-reference, @sentry/node, @supabase/ssr, @tanstack/react-form, @tanstack/react-pacer, fast-json-patch, foglamp, hoist-non-react-statics, @growthbook/growthbook, @hono/zod-openapi, @intuitui-labs/form-builder-engine, @powersync/drizzle-driver, @powersync/web, @ts-rest/core, apca-w3, culori, expo-auth-session, isomorphic-webcrypto, posthog-js, posthog-react-native, react-native-url-polyfill, xstate, @tanstack/react-virtual, zustand, @intuitui-labs/a11y-gate, inngest, @legendapp/list, @shopify/flash-list, nativewind, @astrojs/svelte, react-native-web.

Lowest DEV-ONLY (no runtime effect at all): madge, mcp-remote, oxfmt, promptfoo, react-native-bundle-visualizer, react-native-devtools, reassure, syncpack, tsdown, tsup, vercel, wrangler.

## Limits of this ranking

- **Name-level graph.** Versions are collapsed per package name (for example the three resolved `typescript` versions count as one node), which slightly over-connects multi-version packages.
- **Only installed edges count.** Peers that pnpm auto-installed are counted. Optional peers are excluded from the "required" figures but listed in `peer_dependents`.
- **Importer reach is per workspace member, not per app.** It counts library packages under `packages/*` as well as apps. "15 of 32" for the RN spine therefore means 15 members whose closure includes it, not 15 apps.
- **Native detection is a file-listing heuristic** (`android/` and `ios/` sources, `*.podspec`, `*.xcframework`, on the resolved version). JS-only packages with a config plugin count as non-native. Packages that download binaries at install time would be missed. Two listings came from unpkg because jsDelivr failed (`next` HTTP 503, `@op-engineering/op-sqlite` HTTP 403).
- **Stack layer is curated judgement** (`layers.py`, 387 of 387 filled; see SCHEMA.md for the curated vs family-rule split). It drives the 20-point prior and the DEV-ONLY test, so a wrong layer moves a package.
- **No source-code usage.** The box does not have your `.ts`/`.tsx` files, so "how many screens import X" is not measured. Declaring a package is not the same as using it.
- **Member mapping.** `usage.member` was mapped to lockfile importers by name, plus dependency overlap for the root. 3 manifests have no importer: the `null`-member `@opencode-ai/plugin` row, `gurudevi-style-engine-runtime-fixture`, and `@repo/refactor-scripts`.
