# RN Terrain

**The live intelligence layer for the React Native ecosystem.**

```
npx rn-eval react-native-reanimated
```

## Why

Navigating the React Native ecosystem feels like wandering through a shifting
swamp: packages rise, decay, get abandoned mid-migration, or get acquired and
change direction overnight. RN Terrain is the map.

It scores package health across vitality signals (release rhythm, commit
activity, bus factor, Lindy effect) with documented, versioned weights — so a
verdict is never vibes, it's an audit trail.

- **Neutrality requires transparency.** The scoring weights, vendor priors,
  and ground truth corpus are all in this repo. Audit them.
- **The event log is the moat, not the code.** Forks start at history zero.
- **Community contributions make the data better.** Add missing packages,
  correct classifications, extend the ground truth corpus.

## Packages

| Package | What it is |
|---|---|
| [`@rn-terrain/core`](./packages/core) | Evaluation engine: signals, scoring, radar |
| [`@rn-terrain/cli`](./packages/cli) | `rn-eval` CLI |
| [`@rn-terrain/mcp`](./packages/mcp) | MCP server for agent integrations |
| [`@rn-terrain/vscode`](./packages/vscode) | Package intelligence inside your editor |

## Quick start

```bash
pnpm install
pnpm --filter @rn-terrain/cli radar
```

### GitHub Atlas locally

From the repository root:

```bash
pnpm install
pnpm atlas:dev
```

Then open [http://localhost:3000](http://localhost:3000). The production build can be checked with:

```bash
pnpm atlas:build
```

## Documentation

Start at [docs/INDEX.md](./docs/INDEX.md):

- Architecture & blueprint (`docs/architecture/`)
- Integrity spec (`docs/Core/`)
- Open-source strategy (`docs/decisions/`)

## Contributing

Three ways to help:

1. **Add or correct a package** — most valuable; follow the schema in the
   integrity spec and explain your reasoning.
2. **Improve the scoring** — read the integrity spec first; all weight changes
   require documented reasoning in the PR.
3. **Extend the ground truth corpus** — more calibration data = more
   trustworthy verdicts.

## Status

Pre-launch. This repo is being prepared in public-ready shape but is not yet
announced. See [docs/decisions/2026-06-02-rn-terrain-open-source-strategy.md](./docs/decisions/2026-06-02-rn-terrain-open-source-strategy.md)
for the launch criteria.

## License

[MIT](./LICENSE) — documentation under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/).
