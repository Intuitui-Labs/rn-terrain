# RN Terrain: package index (steps 1 and 2)

Built 2026-10-05 22:40 Colombo time from every `package.json` in `C:\x` (33 manifests, 1,012 dependency lines). Workspace packages (`@repo/*`) are left out. This is the list of outside packages only.

## Files

- `rn_packages.db`: SQLite, the source of truth.
- `ALL_PACKAGES.csv`: all 387 outside packages, one row each.
- `RN_PACKAGES.csv`: the 158 with React Native evidence.

## Tables

`package`, one row per npm name:
- `id`: UUID v5 from the npm name under namespace `6f1c2a7e-5b0d-4c1e-9a3f-1e2d3c4b5a69`. The same name always gets the same id, so a rebuild never renumbers anything.
- `name`, `npm_latest` (npm's `latest` tag as of `checked_at`; your repo may sit on `next`, e.g. Expo 58), `description`, `repository`, `homepage`.
- `type`: one primary type, assigned by name rule. The types are expo, react-native, react, build-tooling, lint-format, test, types, data, backend, ai, observability, web-framework, ui-visual, state, i18n, internal, and utility.
- `role`: runtime, dev (only in devDependencies), or peer.
- `is_rn` and `rn_evidence`: the RN test, which looks at the name, a declared `react-native` or `expo` peer, or an RN keyword on npm. It is kept separate from `type` on purpose.

`usage`, one row per place a package is declared: `package_id`, `member` (the workspace app or package), `manifest` (path), `section`, and `spec`.

## Known soft spots

- Type is one label per package for now. Some packages really have two, such as `@tanstack/react-query`, which is both react and data.
- `@expo-google-fonts/*` is typed expo but has no RN signal on npm. `@swmansion/argent` is typed react-native without one. `react-test-renderer` has an RN keyword but is typed react.

## Step 2 (2026-10-05, Colombo time): profiles, versions, maintainers, capabilities, ranking

New FK-linked tables, all keyed by `package_id → package.id`: `stack_layer` (vocabulary), `package_profile`, `package_version`, `maintainer` + `package_maintainer`, `capability` (self-FK tree, L1 > L2 > L3), and `package_rank`. There are also two views: `v_versions` (local spec, lockfile resolution, GA and next in one place) and `v_package_overview`. Full column docs and the stack-layer vocabulary are in `SCHEMA.md`.

- `RANKING.md`: core vs leaf ranking from the `pnpm-lock.yaml` graph (formula `blast-v2`), top 25, top 5 per type, safe leaves, and the formula's limits.
- `DRY_RUN_react-native-reanimated.md`: every table filled for one package, with an ER diagram and the capability tree. `profiles/react-native-reanimated.md` is that package's profile file.
- Scripts, in order: `lock_graph.py`, `fetch_npm.mjs`, `fetch_extra.mjs`, `build_terrain.py`, `dry_run.py`, `gen_docs.py`. Raw evidence is cached under `cache/` (npm docs, downloads, tarball file listings, GitHub repo JSON).
- `layers.py` holds the curated use_case / stack_layer / category for all 387 packages. It is judgement, so edit it and re-run `build_terrain.py`.

## This pass (2026-10-05 23:50 Colombo)

- **DASHBOARD.html** — drillable L0 overview / L1 layer|type / L2 package + compare; All/RN-only; sort code vs graph. Changes section from Chronos `package_change`.
- **HEALTH.md** + `package_health` — OSV, npm metadata, RN directory, bundlephobia, GH activity/CI. Leading-edge peer/RC ≠ risk.
- **changes/** — Chronos-owned; load with `python3 load_changes.py`.
- **Code blast** — pending PC scan (`scripts/scan_imports_regex.cjs` → staging → CopyToBox → `scripts/load_code_usage.py` → `scripts/write_top40_code.py` → regen dashboard).
- Skia: DB name `react-native-skia` is correct resolved npm; `@shopify/react-native-skia` is a pnpm alias only.
