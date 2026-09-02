# GitHub Atlas — OpenEval+ Implementation Plan

## Objective

Build a serious prototype for GitHub students that turns the GitHub Student Developer Pack from a catalogue into transparent, contextual guidance. The user answers what they are building or learning, adjusts priorities, receives a recommended stack with reasons, and can share the result through a URL.

## Decisions

- Separate domain application, not an RN Terrain feature.
- Next.js App Router, React, TypeScript, and Tailwind.
- Framework-independent `@openeval/core` evaluator.
- Student Pack offers only for v1.
- Curated versioned JSON with automated freshness/link validation.
- User-weighted transparent scoring; no LLM required.
- No accounts or personal backend profiles.
- URL-encoded share state.

## Implementation

1. Add `packages/openeval-core` with typed offers, user profiles, evidence, weights, recommendations, explanations, confidence, and deterministic evaluation.
2. Add a curated Student Pack catalogue with official source URLs, capabilities, categories, personas, prerequisites, effort, interpretation notes, and verification dates.
3. Add catalogue validation and evaluator tests covering personas, weight changes, exclusions, stale evidence, malformed shares, and deterministic output.
4. Add `apps/github-atlas` with landing, questionnaire, results, offers, offer detail, methodology, and about routes.
5. Implement client-side state, weight controls, URL sharing/restoration, responsive accessible UI, and a restrained terrain-oriented visual system.
6. Document the domain model, source policy, scoring methodology, maintenance process, and relationship to RN Terrain/OpenEval+.

## Acceptance

- A student reaches a useful stack in under five minutes.
- Every recommendation explains fit, trade-offs, evidence, and freshness.
- Changing priorities changes the output.
- Shared URLs reproduce results.
- Catalogue updates do not require evaluator code changes.
- Existing RN Terrain packages still pass type checks.
- Install, type check, build, and tests pass.
