# Version tasks (from RN Terrain, verified 2026-10-05/06)

Find where each version is declared (package.json files and/or the pnpm catalog in pnpm-workspace.yaml) and bump it everywhere consistently.

## A. Do now — patch/minor hops
| ID | Package | From → To | Why | Watch for |
|---|---|---|---|---|
| V01 | next | 16.3.5 → 16.3.8 | **Security**: High SSRF in Image Optimization + App Router metadata disclosure. [release](https://github.com/vercel/next.js/releases/tag/v16.3.8) | do first |
| V02 | @supabase/supabase-js | 2.102.1 → 2.117.2 | `@supabase/ssr` 0.12.7 requires `^2.114.0`; currently unsatisfied. [changelog](https://raw.githubusercontent.com/supabase/supabase-js/master/packages/core/supabase-js/CHANGELOG.md) | passkey API default changed in 2.11x; check auth calls |
| V03 | zod | 4.5.4 → 4.6.5 | missing 4.6 minor | none expected |
| V04 | @tanstack/react-query | 5.102.8 → 5.104.1 | minor line | none expected |
| V05 | hono | 4.13.7 → 4.13.13 | 6 patches | `app.mount()` deprecated → `mount()` from `hono/mount` + `app.all('/path/*', mount(...))`; migrate any use |
| V06 | @orpc/client + @orpc/server | 1.15.0 → 1.15.4 | 4 patches; bump **together** | stay on 1.x (2.0 is beta) |
| V07 | drizzle-orm | 0.45.2 → 0.45.3 | 1 patch | **never** 1.0.x — @powersync/drizzle-driver 0.8.0 caps drizzle < 1.0 |
| V08 | pg | 8.23.0 → 8.23.1 | 1 patch | — |
| V09 | astro | 7.3.2 → 7.3.5 | 3 patches | — |
| V10 | react-i18next | 17.0.13 → 17.0.15 | 2 patches | — |
| V11 | inngest | 4.20.0 → 4.21.1 | minor | — |
| V12 | posthog-react-native | 4.71.0 → 4.78.5 | minor line | if `posthog-react-native-session-replay` is installed, switch to `@posthog/react-native-plugin` |
| V13 | ai (Vercel AI SDK) | 7.0.99 → 7.0.128 | 29 patches | `evaluate` renamed to `decide` in 7.0.128 — rename any AI-SDK `evaluate` call (not cedar's) |
| V14 | react-native-skia (aliased as @shopify/react-native-skia) | 3.0.2 → 3.0.3 | Display P3 render fix | keep the npm alias form |
| V15 | @tanstack/ai | 0.52.0 → 0.64.1 | 12 minors | server tools now run in parallel per turn; set `toolExecution:'sequential'` where order matters. Read changelog first |

## B. Plan only — majors (write a migration note in STATUS.md, do NOT bump yet)
| ID | Package | From → To | Note |
|---|---|---|---|
| V20 | effect | 3.22.2 → 4.0.1 | rebuilt core; land on 4.0.1 not 4.0.0. List every import site + breaking APIs used. [blog](https://effect.website/blog/releases/effect/40) |
| V21 | @react-native-async-storage/async-storage | 2.2.0 → 3.1.1 | v3 scoped storages; default export is a v1/v2-compat singleton. List call sites. [release](https://github.com/react-native-async-storage/async-storage/releases/tag/%40react-native-async-storage%2Fasync-storage%403.0.0) |

## C. Checks only (report findings)
| ID | Check |
|---|---|
| V30 | Any `useAnimatedKeyboard` use? It's deprecated in Reanimated 4 in favour of react-native-keyboard-controller. List files. |
| V31 | Expo SDK 58: any custom iOS AppDelegate / native module code that must follow the scene-based lifecycle migration? List files. |
| V32 | Reanimated 4.7 default light-tree layout-animation proxy: any Shared Element / custom layout animation that behaves differently? Note only. |

## Not tasks (decided)
- Stay on RN 0.88.0-rc.3, Expo 58.0.x, React 19.3.0, NativeWind 5.0.0-rc.0, Screens 4.28 (5.0 alpha optional, unused), date-fns 4.4 (5.0 alpha), drizzle 0.45.x.

## D. Follow-ups after review (2026-10-06, Grok Bot) — branch `terrain/version-hops`
Decided by Naveen: **keep** the `minimumReleaseAgeExclude` entries you added (ai, @ai-sdk/*, posthog-react-native, @posthog/*, @tanstack/ai). No change needed there. Do NOT rewrite or squash existing commits.

| ID | Task |
|---|---|
| V40 | V05, V07, V11, V13, V15 list commit 08d3e59a8 (the V03 zod commit) and V12 lists 0e0b686d2 (V04). For each of those six, state which commit actually changed its version, and the exact version now in every package.json that declares it (hono 4.13.13, drizzle-orm 0.45.3, inngest 4.21.1, ai 7.0.128, @tanstack/ai 0.64.1, posthog-react-native 4.78.5). If any bump is missing, make it now as its own commit `terrain(V0x): …`. |
| V41 | Run typecheck + tests for `sanctuary-api` (hono, drizzle, pg, inngest, ai, @tanstack/ai live there), for `packages/ai`, and for both astro apps (`astro check`). Report the pass/fail counts. Fix only breakages caused by these bumps, each as its own commit `terrain(V41): …`; otherwise mark BLOCKED with the error. |
| V42 | @tanstack/ai 0.64: tool calls now run in parallel. List every place we define more than one tool per call, and say whether any of those tools depend on order or shared state. Note only. |
| V43 | Final gate: workspace-wide `pnpm -r typecheck` and `pnpm -r test` (or the repo's turbo equivalents). Report totals and any failures, and say whether they already failed on 3599b9d2f. |

Log each in STATUS.md as `## V40 …` etc.
