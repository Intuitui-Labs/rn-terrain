# RN Terrain: code blast ranking

Built 2026-10-06 00:03 Colombo from `code_import` / `package_code_usage` / `package_rank_code`. Score = files_direct + 0.5·indirect_via_@repo_wrappers + 0.75·route_files_implied, × (1 + 0.15·apps).

## Class counts

| class | n |
|---|---|
| DEV-ONLY | 135 |
| CODE-SINGLE-USE | 100 |
| INSTALLED-UNUSED | 85 |
| CODE-FEATURE | 46 |
| CODE-STRUCTURAL | 12 |
| CODE-SPINE | 9 |

## Why screens / safe-area / router / reanimated moved (vs graph)

Graph ranking rewards **peer dependents** and lockfile reverse closure. Code ranking rewards **files in his apps/packages that import the package** (plus router-implied reach and @repo wrapper re-exports).

- **react-native-screens**: code #8 `CODE-SPINE` (files=0, indirect=0, routes=166, apps=0) vs graph #28 `STRUCTURAL` score 37.68. rose vs graph (graph #28 → code #8): measured by files in his code, not peer dependents
- **react-native-safe-area-context**: code #6 `CODE-SPINE` (files=9, indirect=0, routes=165, apps=1) vs graph #19 `STRUCTURAL` score 42.39. rose vs graph (graph #19 → code #6): measured by files in his code, not peer dependents
- **expo-router**: code #3 `CODE-SPINE` (files=137, indirect=0, routes=146, apps=1) vs graph #35 `STRUCTURAL` score 32.69. rose vs graph (graph #35 → code #3): measured by files in his code, not peer dependents
- **react-native**: code #2 `CODE-SPINE` (files=286, indirect=0, routes=0, apps=1) vs graph #1 `CORE-SPINE` score 95.55. 
- **react**: code #1 `CODE-SPINE` (files=808, indirect=0, routes=0, apps=2) vs graph #2 `CORE-SPINE` score 92.88. 
- **nativewind**: code #17 `CODE-STRUCTURAL` (files=19, indirect=0, routes=0, apps=1) vs graph #96 `FEATURE-LEAF` score 21.47. rose vs graph (graph #96 → code #17): measured by files in his code, not peer dependents
- **react-native-reanimated**: code #9 `CODE-SPINE` (files=103, indirect=0, routes=0, apps=1) vs graph #5 `CORE-SPINE` score 62.12. 

## Top 40 by code blast radius

| # | package | files | apps | class | code score | graph # | graph score | graph class | why moved |
|---|---|---|---|---|---|---|---|---|---|
| 1 | react | 808 | 2 | CODE-SPINE | 1050.4 | 2 | 92.9 | CORE-SPINE |  |
| 2 | react-native | 286 | 1 | CODE-SPINE | 328.9 | 1 | 95.5 | CORE-SPINE |  |
| 3 | expo-router | 137 | 1 | CODE-SPINE | 283.5 | 35 | 32.7 | STRUCTURAL | rose vs graph (graph #35 → code #3): measured by files in his code, not peer dependents |
| 4 | react-i18next | 191 | 1 | CODE-SPINE | 219.6 | 47 | 28.4 | STRUCTURAL | rose vs graph (graph #47 → code #4): measured by files in his code, not peer dependents |
| 5 | vitest | 329 | 5 | DEV-ONLY | 172.7 | 255 | 8.9 | DEV-ONLY | rose vs graph (graph #255 → code #5): measured by files in his code, not peer dependents |
| 6 | react-native-safe-area-context | 9 | 1 | CODE-SPINE | 152.7 | 19 | 42.4 | STRUCTURAL | rose vs graph (graph #19 → code #6): measured by files in his code, not peer dependents |
| 7 | zod | 117 | 1 | CODE-SPINE | 134.5 | 4 | 64.5 | CORE-SPINE |  |
| 8 | react-native-screens | 0 | 0 | CODE-SPINE | 124.5 | 28 | 37.7 | STRUCTURAL | rose vs graph (graph #28 → code #8): measured by files in his code, not peer dependents |
| 9 | react-native-reanimated | 103 | 1 | CODE-SPINE | 118.4 | 5 | 62.1 | CORE-SPINE |  |
| 10 | next | 48 | 1 | CODE-SPINE | 55.2 | 81 | 22.9 | CORE-SPINE | rose vs graph (graph #81 → code #10): measured by files in his code, not peer dependents |
| 11 | @tanstack/react-query | 37 | 1 | CODE-STRUCTURAL | 42.5 | 32 | 34.1 | STRUCTURAL | rose vs graph (graph #32 → code #11): measured by files in his code, not peer dependents |
| 12 | @supabase/supabase-js | 34 | 1 | CODE-STRUCTURAL | 39.1 | 52 | 27.3 | STRUCTURAL | rose vs graph (graph #52 → code #12): measured by files in his code, not peer dependents |
| 13 | hono | 26 | 1 | CODE-STRUCTURAL | 29.9 | 31 | 36.2 | STRUCTURAL | rose vs graph (graph #31 → code #13): measured by files in his code, not peer dependents |
| 14 | @orpc/server | 22 | 1 | CODE-STRUCTURAL | 25.3 | 119 | 19.1 | FEATURE-LEAF | rose vs graph (graph #119 → code #14): measured by files in his code, not peer dependents |
| 15 | zustand | 25 | 0 | CODE-STRUCTURAL | 25.0 | 148 | 17.0 | FEATURE-LEAF | rose vs graph (graph #148 → code #15): measured by files in his code, not peer dependents |
| 16 | effect | 22 | 0 | CODE-STRUCTURAL | 22.0 | 108 | 20.5 | FEATURE-LEAF | rose vs graph (graph #108 → code #16): measured by files in his code, not peer dependents |
| 17 | nativewind | 19 | 1 | CODE-STRUCTURAL | 21.8 | 96 | 21.5 | FEATURE-LEAF | rose vs graph (graph #96 → code #17): measured by files in his code, not peer dependents |
| 18 | @intuitui-labs/form-builder-engine | 15 | 0 | CODE-STRUCTURAL | 15.0 | 161 | 15.5 | FEATURE-LEAF | rose vs graph (graph #161 → code #18): measured by files in his code, not peer dependents |
| 19 | @testing-library/react-native | 41 | 1 | DEV-ONLY | 14.1 | 282 | 4.1 | DEV-ONLY | rose vs graph (graph #282 → code #19): measured by files in his code, not peer dependents |
| 20 | expo | 12 | 1 | CODE-FEATURE | 13.8 | 3 | 80.6 | CORE-SPINE | fell vs graph (graph #3 → code #20): high graph blast but fewer direct code imports |
| 21 | @react-native-async-storage/async-storage | 13 | 0 | CODE-FEATURE | 13.0 | 67 | 24.9 | STRUCTURAL | rose vs graph (graph #67 → code #21): measured by files in his code, not peer dependents |
| 22 | uuid | 13 | 0 | CODE-FEATURE | 13.0 | 23 | 39.3 | STRUCTURAL |  |
| 23 | date-fns | 12 | 0 | CODE-FEATURE | 12.0 | 74 | 23.9 | STRUCTURAL | rose vs graph (graph #74 → code #23): measured by files in his code, not peer dependents |
| 24 | react-native-svg | 12 | 0 | CODE-FEATURE | 12.0 | 12 | 46.9 | STRUCTURAL | fell vs graph (graph #12 → code #24): high graph blast but fewer direct code imports |
| 25 | react-native-gesture-handler | 10 | 1 | CODE-FEATURE | 11.5 | 9 | 53.2 | CORE-SPINE | fell vs graph (graph #9 → code #25): high graph blast but fewer direct code imports |
| 26 | @tanstack/ai | 9 | 1 | CODE-FEATURE | 10.3 | 45 | 29.5 | STRUCTURAL | rose vs graph (graph #45 → code #26): measured by files in his code, not peer dependents |
| 27 | expo-file-system | 9 | 1 | CODE-FEATURE | 10.3 | 15 | 45.0 | STRUCTURAL | fell vs graph (graph #15 → code #27): high graph blast but fewer direct code imports |
| 28 | react-native-worklets | 9 | 1 | CODE-FEATURE | 10.3 | 8 | 55.9 | CORE-SPINE | fell vs graph (graph #8 → code #28): high graph blast but fewer direct code imports |
| 29 | drizzle-orm | 9 | 0 | CODE-FEATURE | 9.0 | 65 | 25.2 | FEATURE-LEAF | rose vs graph (graph #65 → code #29): measured by files in his code, not peer dependents |
| 30 | expo-image-picker | 7 | 1 | CODE-FEATURE | 8.0 | 94 | 21.5 | STRUCTURAL | rose vs graph (graph #94 → code #30): measured by files in his code, not peer dependents |
| 31 | pg | 7 | 1 | CODE-FEATURE | 8.0 | 70 | 24.7 | FEATURE-LEAF | rose vs graph (graph #70 → code #31): measured by files in his code, not peer dependents |
| 32 | react-native-skia | 8 | 0 | CODE-FEATURE | 8.0 | 36 | 32.5 | CORE-SPINE |  |
| 33 | @orpc/client | 6 | 2 | CODE-STRUCTURAL | 7.8 | 50 | 27.9 | FEATURE-LEAF | rose vs graph (graph #50 → code #33): measured by files in his code, not peer dependents |
| 34 | astro | 6 | 2 | CODE-STRUCTURAL | 7.8 | 22 | 40.0 | CORE-SPINE | fell vs graph (graph #22 → code #34): high graph blast but fewer direct code imports |
| 35 | @powersync/drizzle-driver | 6 | 1 | CODE-FEATURE | 6.9 | 162 | 15.5 | FEATURE-LEAF | rose vs graph (graph #162 → code #35): measured by files in his code, not peer dependents |
| 36 | @supabase/ssr | 6 | 1 | CODE-FEATURE | 6.9 | 207 | 13.0 | FEATURE-LEAF | rose vs graph (graph #207 → code #36): measured by files in his code, not peer dependents |
| 37 | ai | 6 | 1 | CODE-FEATURE | 6.9 | 125 | 18.2 | FEATURE-LEAF | rose vs graph (graph #125 → code #37): measured by files in his code, not peer dependents |
| 38 | inngest | 5 | 2 | CODE-STRUCTURAL | 6.5 | 132 | 17.5 | FEATURE-LEAF | rose vs graph (graph #132 → code #38): measured by files in his code, not peer dependents |
| 39 | posthog-react-native | 6 | 0 | CODE-FEATURE | 6.0 | 170 | 15.5 | FEATURE-LEAF | rose vs graph (graph #170 → code #39): measured by files in his code, not peer dependents |
| 40 | @react-native-community/netinfo | 5 | 1 | CODE-FEATURE | 5.8 | 92 | 21.5 | FEATURE-LEAF | rose vs graph (graph #92 → code #40): measured by files in his code, not peer dependents |
