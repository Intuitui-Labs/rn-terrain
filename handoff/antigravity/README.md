# Antigravity handoff — RN Terrain → C:\x

This folder is the shared link between Naveen's RN Terrain assistant (Grok Bot, "Senior Software Architect") and Antigravity.
Grok Bot writes tasks here; Antigravity does the code work in `C:\x` and writes results back here. Naveen reviews everything.

## Files
- `TASKS_VERSIONS.md` — version tasks, with IDs (V01…). Read first.
- `FIX_PLAN.md` / `FIX_PLAN.patch` — code fixes, IDs FIX-001 to FIX-012. Do these on branch `terrain/fixes`, one commit per FIX id, in severity order. Re-verify each line against current code before editing (the plan was written read-only on 2026-10-06). Log each in STATUS.md as `## FIX-001 ...`. Skip `info` items.
- `STATUS.md` — **Antigravity writes here.** One section per task ID.

## Rules for Antigravity
1. Work in `C:\x` on a new branch `terrain/version-hops` (fixes: `terrain/fixes`). Never commit to main, never push, never force anything.
2. One task ID = one commit, message `terrain(V03): zod 4.5.4 -> 4.6.5`.
3. After each task run `pnpm install`, then the workspace typecheck and the tests for the touched packages. Record the exact commands and pass/fail.
4. Leading-edge stack is intentional: RN 0.88.0-rc.3, Expo ~58, React 19.3.0. Never downgrade anything. Never run `expo install --fix` or `npx expo install --check` fixes. Peer-range warnings caused by the RC are expected, not failures.
5. Do not change these pins: react-native-reanimated 4.7.1, react-native-worklets 0.13.0, react-native-gesture-handler 3.3.0, react-native-nitro-modules 0.37.1, react-native-mmkv 4.3.2.
6. Do not read or print `.env` files or any key/secret files.
7. If a task fails or needs a decision, stop that task, revert its commit, write `BLOCKED` + the reason in STATUS.md, and move to the next.

## STATUS.md format
```
## V03 — zod 4.5.4 -> 4.6.5
state: DONE | BLOCKED | SKIPPED | IN-PROGRESS
commit: <sha>
files changed: ...
checks: pnpm -r typecheck (pass), pnpm --filter @x/library test (pass)
notes: ...
updated: 2026-10-06 14:30 +05:30
```
