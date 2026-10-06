# RN Terrain progress

| phase | status | at (Colombo) |
|---|---|---|
| code usage scan | DONE — 3777 files / 26862 imports loaded; rankings + TOP40 written | 2026-10-06 00:06 Colombo |
| health signals | **DONE** — 11448 `package_health` rows; HEALTH.md; risks = vulns/deprecations/archived/install-scripts only | 2026-10-05 23:52 Colombo |
| changes | **DONE (Chronos)** — `load_changes.py` → 28/28 joined; Reanimated peer row informational; dashboard badges peer/leading-edge as info | 2026-10-05 23:52 Colombo |
| capabilities | DONE top-10 code blast; 127 caps, 70 usage links | 2026-10-06 00:06 Colombo |
| dashboard | DONE code-blast charts + polish; copied to PC packages dir | 2026-10-06 00:06 Colombo |

## Framing
Leading-edge (RN 0.88.0-rc.3, Reanimated 4.7.1) peer/RC mismatches are informational, not risks.

## Skia
DB `react-native-skia` (uuid 7ad86285…) is correct resolved npm; `@shopify/react-native-skia` is pnpm alias only. Noted in package_rank.notes + profile.sources.lock_alias.

## Top risks (real)
- OSV: kysely (HIGH), next (CRITICAL), xlsx (2× HIGH)
- Deprecated: @testing-library/jest-native
- Install scripts: tesseract.js, @journeyapps/wa-sqlite, react-native-enriched-markdown, msw, @sentry/cli
- Archived: 3 packages (gh_archived=1)

## Dashboard viz refresh (2026-10-05 23:59 Colombo)
- Light/dark theme (OS default + localStorage; query theme= for shots)
- Inline SVG: treemap, risk bars, freshness histogram, L1 bars+scatter, L2 timeline/radar/version bars, compare side-by-side
- Code-blast chart placeholders kept
- Screenshots under /workspace/rn-packages/shots/
- PC installed: C:\\projects\\rn-terrain\\data\\packages\\DASHBOARD.html (via staging)
