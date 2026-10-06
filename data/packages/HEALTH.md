# RN Terrain: package health signals

Built 2026-10-05 23:46 Colombo (reframed leading-edge peer/rc as informational).

## Signal model (general → granular)

| group | signals | meaning |
|---|---|---|
| security | vuln_count, vuln_ids, max_severity | OSV querybatch against npm name@resolved version |
| security | deprecated | npm `deprecated` field on resolved version |
| security | has_install_scripts, install_scripts | preinstall/install/postinstall present |
| security | npm_attestations | registry dist.attestations present |
| maintenance | last_publish_at, gh_pushed_at | freshness |
| maintenance | releases_12m, open_prs, gh_open_issues, gh_stars, gh_forks, gh_archived | GitHub activity |
| maintenance | npm_maintainers_count, contributors_count_cap100 | bus-factor proxies (contributors capped at first 100 anon page) |
| quality | has_types, types_field, atypes_available, atypes_package | TypeScript types bundled or @types/* |
| quality | has_test_script, has_ci | package.json scripts.test; `.github/workflows` via gh contents |
| size | unpacked_size, file_count, dependency_count | npm dist of resolved version |
| size | bundle_size, bundle_gzip, bundle_size_note | bundlephobia (web bundle; NOT Hermes bytecode). Native-only often unavailable |
| adoption | weekly_downloads | npm downloads API last-week |
| rn_fit | new_architecture, expo_go, unmaintained, platforms, directory_listed | reactnative.directory |

## Coverage

| group | signal | rows | non-empty |
|---|---|---|---|
| adoption | weekly_downloads | 387 | 387 |
| maintenance | contributors_count_cap100 | 341 | 341 |
| maintenance | gh_archived | 387 | 382 |
| maintenance | gh_forks | 387 | 382 |
| maintenance | gh_open_issues | 387 | 382 |
| maintenance | gh_pushed_at | 387 | 382 |
| maintenance | gh_stars | 387 | 382 |
| maintenance | last_publish_at | 387 | 387 |
| maintenance | npm_maintainers_count | 387 | 387 |
| maintenance | open_prs | 341 | 341 |
| maintenance | releases_12m | 341 | 341 |
| quality | atypes_available | 386 | 386 |
| quality | atypes_package | 87 | 87 |
| quality | has_ci | 382 | 382 |
| quality | has_test_script | 386 | 386 |
| quality | has_types | 386 | 386 |
| quality | types_field | 386 | 298 |
| rn_fit | directory_listed | 387 | 387 |
| rn_fit | expo_go | 142 | 114 |
| rn_fit | new_architecture | 387 | 142 |
| rn_fit | platforms | 142 | 142 |
| rn_fit | unmaintained | 142 | 142 |
| security | deprecated | 386 | 1 |
| security | has_install_scripts | 386 | 386 |
| security | install_scripts | 5 | 5 |
| security | max_severity | 386 | 3 |
| security | npm_attestations | 386 | 386 |
| security | vuln_count | 386 | 386 |
| security | vuln_ids | 386 | 386 |
| size | bundle_gzip | 106 | 106 |
| size | bundle_size | 257 | 106 |
| size | bundle_size_note | 151 | 151 |
| size | dependency_count | 386 | 386 |
| size | file_count | 386 | 385 |
| size | unpacked_size | 386 | 385 |

## Framing (leading edge)


**Risks here are only:** security advisories (OSV), deprecations, archived/unmaintained packages, install-script surprises, known upstream breakages, or a newer GA release he is missing.

## Top risks (security / deprecation / abandoned / missing GA only)

### Vulnerabilities (OSV)
| package | vuln_count | ids / severity |
|---|---|---|
| kysely | 1 | ['GHSA-pv5w-4p9q-p3v2'] max=HIGH |
| next | 1 | ['GHSA-vcvr-r3jv-pc5j'] max=CRITICAL |
| xlsx | 2 | ['GHSA-4r6h-8v6p-xvw6', 'GHSA-5pgg-2g8v-p4x9'] max=HIGH |

### Deprecated
- **@testing-library/jest-native**: DEPRECATED: This package is no longer maintained.
Please use the built-in Jest matchers available in @testing-library/react-native v12.4+.

See migration guide: https://callstack.github.io/react-nativ

### Archived on GitHub
- cross-env
- eslint-plugin-deprecation
- isomorphic-webcrypto

### Install scripts (resolved version)
- **tesseract.js**: `{"postinstall": "opencollective-postinstall || true"}`
- **@journeyapps/wa-sqlite**: `{"postinstall": "npm run powersync-core:download"}`
- **react-native-enriched-markdown**: `{"postinstall": "node postinstall.mjs"}`
- **msw**: `{"postinstall": "node -e \"import('./config/scripts/postinstall.js').catch(() => void 0)\""}`
- **@sentry/cli**: `{"postinstall": "node ./scripts/install.js"}`

### Unmaintained (reactnative.directory)
- none flagged in matched directory entries

### New Architecture
- Explicit `false` among our native packages: none in directory data.
- Directory-listed packages: 142; unlisted get `new_architecture=NULL` (unknown, not false).

## Limits / NULLs

- OSV: resolved lock versions only.
- bundlephobia: web webpack size; many native/RN packages unavailable (`bundle_size_note`).
- new_architecture: NULL when not in reactnative.directory.
- GitHub advisories beyond OSV: not separately fetched (OSV includes GHSA ids).
- dependents: use `package_rank` (not re-fetched here).
- `package_change`: owned by Chronos — empty until `changes/package_change.csv` arrives; load via `load_changes.py`.
