# RN Terrain — Package Intelligence Layer for AI Agents

>A full-conversation synthesis: harnesses, memory, caching, routing, version drift, and the shift from post-hoc linting to pre-generation gating

**Author:** Naveen Sandeepa Kumara  
**Date:** 2026-10-01  
**Status:** draft-v0.2

## Changelog

- v0.1: Initial architecture — data, analysis, gate, surfaces layers; roadmap; open questions.
- v0.2: Integrated React Doctor (Aiden Bai) as the post-hoc precedent and the conceptual bridge to pre-generation gating. Reframed the vision as a spectrum: package health -> capabilities -> cross-package interaction -> sliding window -> migration guidance -> pre-generation interception. Added the WatermelonDB/Nozbe case as the motivating example of name-louder-than-health. Added the 'lint before you write' section as the natural endpoint of the spectrum.

## 1. The Context: What We Built Up To

This document synthesizes one long conversation about the AI coding agent stack, and proposes a new tool called RN Terrain (React Native Terrain).

The stack, bottom to top:
- Model: the raw brain (Claude, GPT, Gemini, Grok, DeepSeek). Text in, text out. Rented.
- Harness: the runtime wrapped around the model that turns it into an agent — the loop, tools, memory, sandbox, permissions. Claude Code, Codex, OpenClaw, Hermes, Pi, OpenCode. Formula: agent = model + harness.
- Router: a gateway between harness and many models (OpenRouter, 9Router). One OpenAI-compatible endpoint, hundreds of models, automatic fallback, aggregated billing. 9Router is the open-source local version with tool-output compression and three-tier fallback.
- Control surface: T3 Code — a window in front of harnesses you already installed. Launches Claude Code, Codex, Cursor, Grok Build, OpenCode as child processes. Not an agent, not a harness.
- Framework: LangChain, LangGraph, OpenAI Agents SDK — parts libraries for builders. A harness is the finished product.

Key findings from the conversation:
- Claw-SWE-Bench: holding the model fixed and swapping only the harness produced a 27-point spread (39% to 66% success). Harness quality rivals a whole model tier.
- Claude Code loads ~67k tokens/turn but 93% are cached reads (~$0.02/turn). OpenClaw loads ~18k but only 24% cached (~$0.06/turn). Bigger pinned prompt beats smaller churning prompt.
- Prompt caching: Anthropic went from 0% to 84% cached share; one production case cut cost per million input tokens by 63%.
- Switching models mid-session loses the KV cache and re-tokenizes history with a different tokenizer — quality diverges even to a 'better' model.
- 'Do LLMs Benefit From Their Own Words?' (Feb 2026): replacing prior assistant turns with one-sentence summaries preserved quality at ~8x less context, and identified context pollution — models over-conditioning on their own past responses.
- Memory is tiered: core (always in context), recall (searchable history), archival (vector store). Letta (formerly MemGPT) treats the context window as OS RAM with agent-managed paging.
- Claude Code has three memory systems: CLAUDE.md (deterministic, git-tracked), auto memory (Claude writes its own notes), session memory. ChatGPT's memory is a flat fragment list. Gemini leans on past chats + Google account.
- Jev (TypeSafe AI, Sept 2026): a System One classifier — fast, bounded judgments, no text generation, ~100ms, ~$0.04/M input tokens, up to 200x faster and 400x cheaper than comparable LLMs. Used for model routing, complexity classification, confidence gating.
- Confidence gating (System One Harness, HarnessRouter): compile actions into typed questions, gate by probability thresholds (read 90%, destructive 99%), escalate to System Two or human when low.
- Managed always-on agents (Manus 2.0 Cascade, Grok Bot, OpenAI dots, Meta Muse) = vendor-owned cloud computer + model + harness + sandbox. Opposite business model to open harnesses.
- Training-data gravity: models default to the most-documented version at training time, not the current one. Sonatype: 28% hallucination rate on ~37k dependency upgrade recommendations — 10k+ pointed at non-existent versions.
- APILOT (ACSAC 2025): real-time outdated-API dataset + augmented generation reduced outdated recommendations by ~89% across 17 LLMs, improved usability ~27%.
- Existing npm MCP servers: dependency-freshness-mcp, dependency-audit-mcp, npm-deprecated-check, deprecation-mcp, depscope (19 ecosystems, 22 tools), package-version-check-mcp. All solve fragments of the problem.
- Expo's own answer: Expo Skills + Expo MCP Server (live docs, SDK-matching installs) + expo-doctor + npx expo install --fix. AGENTS.md support added in Claude Code 2.1.277 (Sept 18, 2026).
- Callstack's answer: agent-skills repo (upgrading-react-native skill), agent-device, Rozenite MCP, and Apex — a Gemma-4-based specialized RN model (SFT + GRPO), 83.5% vs 87.8% on RN Evals at ~$12 vs ~$22 cost.
- React Native 0.87 (Aug 2026): Strict TypeScript API default, deep imports removed, Legacy Architecture permanently disabled since 0.82. Expo SDK 55+ requires New Architecture.
- NativeWind v5 RC0 tested target: Expo 57.0.22, RN 0.86.3, Reanimated 4.5.1. Known gotchas: postcss.config.cjs not discovered, legacy @cssInterop rejected.
- Effect 4.0 stable shipped with 3-year LTS commitment.

## 2. The Problem: From Package Health to Version Drift

The motivating case: WatermelonDB. Created by Nozbe (the productivity company), maintained by Radek Pietruszewski (radex). The name is still loud — 11.7k GitHub stars, ~248k npm downloads in 30 days as of mid-2026. But community reports through 2024-2025 accumulated: stagnant maintenance, build failures on React Native 0.76+, unresolved New Architecture issues. Teams migrated to RxDB (23.3k stars, ~270k downloads) or PowerSync. The package didn't die — it drifted out of the ecosystem's center of gravity while its reputation stayed frozen at peak fame.

LLMs confidently cite WatermelonDB because training data reflects peak fame, not current health. The same gravity that makes agents write GlueStack v1 in an Expo 54 project makes them recommend a database whose maintainer has effectively moved on.

The user's observed failure mode (Expo 54 + GlueStack v3, agents writing GlueStack v1/v2 code):
1. Training-data gravity: the model emits the version it saw most during training.
2. No machine-readable deprecation in JS: unlike Java's @Deprecated, npm has no native deprecation signaling for APIs. Popular packages add/remove deprecated APIs on minor releases.
3. Fragmented tooling: freshness checkers, deprecation checkers, and directory data exist as separate MCP servers with no shared schema and no stack-awareness.
4. No sliding window: tools answer 'what is latest?' but not 'what is valid between my installed version and the next breaking change?'
5. No personalization: the agent doesn't know YOUR stack's constraints (Expo SDK 57, RN 0.86, New Arch required, NativeWind v5 RC).
6. No real-time gate: nothing intercepts the agent's output before it lands in the repo.

The result: confident, plausible, wrong code. Migrations become archaeology. The agent is amazed by your gitignore because it can't tell your rules from tool leftovers.

## 3. The Spectrum: How the Vision Evolved

RN Terrain did not start as one idea. It accreted, layer by layer, each layer revealing the next:

Layer 1 — Package health. The original itch: is this package alive? Who maintains it? Is it deprecated, abandoned, or just quiet? The WatermelonDB case. This is what depscope, npm-deprecated-check, and dependency-audit-mcp already do in fragments.

Layer 2 — Capabilities. Not just 'is it healthy' but 'what can it do, and in which version?' A package's export surface changes per version. The agent needs to know what v3 offers versus v1, not guess from training data.

Layer 3 — Cross-package interaction. Packages don't exist alone. Expo SDK pins React Native versions; NativeWind v5 RC requires specific Reanimated and Worklets versions; New Architecture breaks some libraries and enables others. The compatibility matrix is the real product.

Layer 4 — The sliding window. Given installed version X and ecosystem-latest Y, what is the valid, non-breaking range? What still works, what's deprecated-but-functional, what's removed? This is the personalization layer — it anchors truth to YOUR stack, not to 'latest'.

Layer 5 — Migration guidance. This is the payoff the user only saw recently: if you have the full stack interaction data — every version's API surface, every deprecation, every cross-package constraint — then migration guides stop being prose documents written by humans and become generated, stack-specific, dated, cited instructions. 'Here is your Expo 57 -> 58 path given your NativeWind v5 RC and your WatermelonDB dependency.' That is more elegant than any human-written guide because it is computed from ground truth, not remembered from training.

Layer 6 — Pre-generation interception. The endpoint of the spectrum (section 5).

## 4. The Precedent: React Doctor (Aiden Bai)

React Doctor, shipped February 2026 by Aiden Bai (Million.js, React Scan), is the closest existing artifact to RN Terrain's philosophy — and the key conceptual bridge.

What it does: a CLI that scans a React codebase (including React Native and Expo projects) for anti-patterns across security, performance, correctness, accessibility, and maintainability. ~100 rules, oxlint engine (Rust, 50-100x faster than ESLint), dead-code pass, 0-100 health score. npx react-doctor@latest. 14.9k GitHub stars, ~6.4k weekly npm installs.

What matters for RN Terrain is not the rules — it's the agent integration model. v2 (May 2026) reframed the pitch explicitly: 'Your agent writes bad React. This catches it.' The installer (npx react-doctor@latest install) detects your coding agents — Claude Code, Cursor, Codex, OpenCode, 50+ clients — and writes SKILL.md / AGENTS.md / .cursorrules files so the agent learns the rules BEFORE writing code. Native agent hooks (off by default) run after the agent edits files and feed findings back so it self-corrects mid-session. CI mode scans every PR and reports only issues the change introduced.

The progression React Doctor embodies: scan after -> teach before -> hook during. That is exactly the trajectory RN Terrain should follow, but one layer up: React Doctor catches bad CODE. RN Terrain catches bad DEPENDENCY CHOICES and bad API USAGE before the code is even generated.

The integration is not additive — it is structural. RN Terrain's gate layer (section 5) sits upstream of React Doctor's scan layer. RN Terrain prevents the agent from importing a deprecated API; React Doctor catches the anti-pattern in the code that results. Together they form a two-stage defense: dependency truth first, code quality second. RN Terrain's SKILL.md companions and MCP tools should be designed to compose with React Doctor's skill-install mechanism, not duplicate it.

## 5. Architecture: From Post-Hoc Lint to Pre-Generation Gate

5.1 The conceptual shift

Traditional linting is post-hoc: you write code, then a tool tells you what you did wrong. React Doctor improved this by installing rules into the agent so it writes better code from the start — but it still operates on code that exists.

RN Terrain's gate layer operates BEFORE generation. The agent does not emit a line of code using a package API until RN Terrain has validated that API against the installed stack. This is the difference between a spell-checker and a dictionary that the writer consults mid-sentence.

5.2 Data layer (the intelligence)
- Package registry adapter: npm registry API (versions, deprecation flags, dist-tags), GitHub releases/changelogs, Expo SDK changelogs, React Native blog/release notes.
- Compatibility matrix: Expo SDK -> RN version -> React version -> tested library versions (from expo.fyi and SDK docs). RN Directory API (reactnative.directory/api/libraries) for platform/New-Arch/Expo-Go flags.
- Deprecation ledger: structured records {package, api, status: active|deprecated|removed, deprecated_on, sunset_on, replacement, migration_url, source_url, last_verified_at, confidence_score}. Seed from APILOT-style GitHub-history mining + hand-verified entries (deprecation-mcp's model) + Expo/RN official deprecation lists.
- Capability index: per-package, per-version export maps and documented APIs (what exists in v3 vs v1).
- Health index: maintainer activity, issue velocity, release cadence, New Architecture compatibility, download trends vs star trends (the WatermelonDB signal: stars high, activity low).
- Sliding-window resolver: given installed version X and target Y, return the valid API surface between them — what still works, what's deprecated-but-functional, what's removed.

5.3 Analysis layer
- Stack profiler: read package.json + lockfile, resolve actual installed versions, cross-check against Expo SDK expected ranges (expo install --check logic), flag misalignments.
- Drift detector: compare agent's assumed versions (from its reasoning/tool calls) against installed reality.
- Breaking-change summarizer: dated, cited diffs between versions (dependency-freshness-mcp's 'what changed since your version').
- Migration path generator: given current stack and target SDK, compute the ordered sequence of safe upgrades with per-step validation gates. This is Layer 5 of the spectrum made concrete.

5.4 Gate layer (the real-time interceptor)
- Pre-write validation: an MCP tool the agent MUST call before emitting code using a package API. Returns pass/fail + replacement suggestion + confidence. This is where Jev-style System One classification fits: a fast bounded judgment ('is this API valid in this stack?') answered in ~100ms, escalating to a System Two harness or human only when confidence is low.
- Confidence-gated escalation: high confidence on deprecated usage -> block with replacement; low confidence -> ask human. Thresholds per action severity (read 90%, destructive 99%).
- Post-generation validator: typecheck + expo-doctor + React Doctor as the final backstop. RN Terrain prevents; React Doctor verifies.

5.5 Surfaces
- MCP server (primary): tools like check_package(name, assumed_version), audit_stack(), get_sliding_window(pkg, from, to), check_api(pkg, api, version), get_compat_matrix(expo_sdk), get_health(pkg), generate_migration_path(from_sdk, to_sdk).
- CLI: rn-terrain audit, rn-terrain check <pkg>, rn-terrain window <pkg> <from> <to>, rn-terrain migrate <from> <to>.
- SKILL.md companions: installable skills that tell any agent 'before using X, call RN Terrain'. Designed to compose with React Doctor's install mechanism.
- Optional: VS Code/Cursor extension for inline warnings.

5.6 Integration points
- Routers (9Router/OpenRouter): RN Terrain as a pre-model or post-model middleware.
- Harnesses: Claude Code plugin, Codex extension, OpenCode/Pi/Hermes skill install.
- Jev/System One: the fast classifier inside the gate layer.
- React Doctor: the post-hoc verification layer. RN Terrain upstream, React Doctor downstream.
- Expo MCP + Callstack skills: complement, don't replace — they give docs and workflows; RN Terrain gives version truth.

## 6. Feasibility and What Already Exists

Feasible. The pieces are proven individually:
- APILOT proved the core mechanism (outdated-API dataset + augmented generation) at 89% reduction.
- dependency-freshness-mcp, dependency-audit-mcp, npm-deprecated-check, deprecation-mcp, depscope prove the MCP surface and registry access patterns.
- React Native Directory's public API proves structured compatibility data is collectible.
- Expo's own tooling (expo-doctor, expo install --fix) proves SDK-range checking is automatable.
- Callstack's upgrading-react-native skill proves agent-facing upgrade knowledge packaging.
- React Doctor proves the agent-skill integration model and the post-hoc-to-pre-hoc shift in philosophy.

The gap RN Terrain fills: nobody has combined stack-awareness + sliding windows + real-time gating + RN/Expo-specific matrices + migration-path generation into one coherent layer. Existing tools are point solutions with no shared schema. React Doctor catches bad code; RN Terrain prevents bad dependencies.

## 7. Suggested Roadmap

Phase 0 (now): CLI prototype. Read package.json/lockfile, call npm registry + RN Directory API, output a stack audit report including a health index (the WatermelonDB signal). Validate against your own Expo 57 + NativeWind v5 RC project.
Phase 1: MCP server with check_package + audit_stack. Publish to npm. Dogfood with Claude Code / OpenCode.
Phase 2: Deprecation ledger (hand-seeded for top 50 RN/Expo packages) + sliding-window resolver + health index.
Phase 3: Pre-write gate (MCP-enforced check before API usage) + Jev-style confidence classifier.
Phase 4: Capability index + breaking-change summarizer + migration-path generator (Layer 5 of the spectrum). SKILL.md ecosystem designed to compose with React Doctor.
Phase 5: Community data (crowdsourced deprecation reports), CI integration, VS Code extension, generalization beyond RN/Expo.

## 8. Open Questions

- Data freshness: how to keep the deprecation ledger and health index current without a full-time curator? (APILOT mined GitHub history; could we automate changelog parsing?)
- False positives: blocking valid code because the ledger is stale would destroy trust. Need confidence scores per ledger entry.
- The WatermelonDB problem generalized: how to detect 'name louder than health' — high stars/downloads but stagnant maintenance — as a first-class signal, not a side effect?
- Scope: RN/Expo-only, or generalize to all npm? (RN/Expo-first gives a sharp wedge; generalization is phase 5+.)
- Who pays: free open-source (depscope model) vs pay-per-event (dependency-freshness model)?
- Relationship to Expo's own MCP server and React Doctor: partner, complement, or compete? (Complement is the honest answer for both — Expo won't build a third-party-package deprecation ledger; React Doctor won't build dependency truth.)
- The migration-guide payoff: is generated, stack-specific migration guidance a product feature or the core value proposition? (The user's instinct says core.)
