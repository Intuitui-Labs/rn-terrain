# OpenEval+ Framework

## The reusable framework behind RN Terrain

OpenEval+ is a transparent, participatory guidance system for making decisions in complex, changing ecosystems.

Its purpose is not to choose for people. Its purpose is to make the terrain visible: what exists, how it is changing, what evidence supports each interpretation, what is uncertain, and how different values produce different choices.

## 1. Core problem

Most discovery systems present inventory rather than capability. They produce lists, rankings, or popularity signals, while leaving the user to infer:

- what an option actually does;
- where it belongs in the larger system;
- whether it is alive and trustworthy;
- which trade-offs matter;
- whether it fits the user's context;
- what evidence supports the recommendation.

This creates information overload, opaque authority, stale guidance, and decision paralysis.

## 2. Core thesis

People need orientation, not merely information.

An orientation system places an option within a living terrain and connects evidence to a user's context. It should answer both **what is this?** and **why might this be appropriate here, now, and for these priorities?**

## 3. Guiding principles

### Guidance, not governance

Metrics and models inform decisions; humans retain agency.

### Transparency over authority

Every score, recommendation, and change should be traceable to its data, assumptions, and weighting logic.

### Pluralism by design

There is no universally best option. Different users can apply different priorities and see how those priorities change the result.

### Hybrid intelligence

Machines collect, normalize, and compare evidence. Humans provide context, interpretation, correction, and values.

### Uncertainty as honesty

Old, incomplete, conflicting, or weak evidence should reduce confidence and remain visible rather than being hidden behind a precise-looking score.

### Open epistemics

The method, data lineage, and assumptions should be open to audit, criticism, reuse, and forking.

## 4. Conceptual model

OpenEval+ is a translation layer between a human goal and a changing ecosystem:

```text
Human goal and context
        ↓
Relevant terrain and candidate options
        ↓
Evidence, history, and human interpretation
        ↓
Transparent scoring and trade-offs
        ↓
Explanatory guidance
        ↓
Human decision and feedback
```

The system should map relationships and trajectories, not only rank isolated objects.

## 5. System architecture

### Data ingestion — sensors

Collect public signals from APIs, registries, repositories, feeds, and other documented sources. Every signal carries provenance, timestamp, and freshness information.

### Normalization — shared language

Clean and convert heterogeneous observations into comparable representations without pretending that unlike things are perfectly equivalent.

### Human curation — interpretive layer

Allow contributors to add qualitative assessments such as usability, documentation, ethics, transparency, maintainability, and context-specific fit. Record contributor identity or reputation, rationale, and time.

### Scoring engine — explicit reasoning

Apply documented weighted models, AHP, or other interpretable methods. Support defaults, user profiles, and interactive reweighting. Produce both a result and its breakdown.

### Guidance interface — explanation layer

Present maps, clusters, cards, trends, comparisons, and narratives. Show why an option appears, what evidence is strong or weak, and what alternatives exist.

### Automation and maintenance — living system

Refresh data on appropriate schedules, detect anomalies, monitor coverage, preserve history, and surface meaningful changes.

## 6. Minimum data contract

Each observation or derived metric should make the following available where applicable:

| Field | Meaning |
|---|---|
| `value` | Normalized observation or derived value |
| `confidence` | Reliability of the observation or interpretation |
| `source` | Origin of the evidence |
| `timestamp` | When the evidence was observed or updated |
| `freshness` | How current the evidence remains |
| `narrative` | Human-readable interpretation |
| `tags` | Domain, context, and applicability labels |
| `method` | Transformation or scoring method used |

The important unit is not a single score. It is a traceable claim with context.

## 7. User experience pattern

The preferred progression is:

1. Identify the user's goal, constraints, and values.
2. Show the relevant part of the terrain.
3. Reduce the candidate set without hiding the wider field.
4. Explain each recommendation and omission.
5. Expose trade-offs, confidence, and alternatives.
6. Let the user adjust priorities and see the consequences.
7. Capture feedback and corrections for future users.

This is progressive disclosure: simple orientation first, deeper evidence when requested.

## 8. What the system must avoid

- A universal leaderboard disguised as objectivity.
- Pay-to-play placement.
- A single score without its dimensions.
- False precision from weak or stale data.
- Treating popularity as health.
- Treating human curation as unquestionable truth.
- Hiding disagreement between sources.
- Expanding to every domain before one domain is genuinely useful.

## 9. Evaluation dimensions

The framework can combine several families of signals:

- capability and fit;
- vitality and trajectory;
- compatibility and constraints;
- community and maintainer health;
- openness and transparency;
- usability and documentation;
- sustainability and risk;
- recency, confidence, and evidence quality.

The dimensions should be adapted to the domain. The shape of the framework remains stable; the signals change with context.

## 10. Domain contextualization

OpenEval+ is intentionally domain-general, but it should not be implemented as a generic system first. A domain gives the framework meaningful vocabulary, users, signals, and decision moments.

RN Terrain is the contextualized form:

```text
OpenEval+ principle       RN Terrain expression
-----------------------   ----------------------------------
Living terrain             React Native package ecosystem
Vitality                   Release, activity, bus factor
Contextual fit             Expo, New Architecture, platform use
Trajectory                 Events, succession, migration signals
Human curation             Maintainer and community intelligence
Guidance surface           CLI, MCP, VS Code, web
Uncertainty                Confidence and freshness per signal
Public memory              Append-only ecosystem event log
```

This is the central evolutionary insight: the framework becomes useful when translated into the language and workflow of a specific terrain.

## 11. Governance and ethics

The project should publish its scoring rules, source policy, correction process, licenses, and conflict-of-interest policy. It should distinguish observed facts from inferred interpretations and recommendations.

The system should make room for disagreement. A healthy result may be a set of defensible paths rather than one winner.

## 12. Maturity path

```text
Bounded map
  → contextual guide
  → transparent evaluation
  → living data and history
  → human/community layer
  → cross-domain public utility
```

The first milestone is not universal coverage. It is one decision made better because the system revealed relevant context and reasoning.

## 13. Relationship to RN Terrain

RN Terrain should be understood as the first serious domain implementation of OpenEval+.

OpenEval+ supplies the permanent frame:

- orientation over catalogues;
- explanation over authority;
- context over universal ranking;
- living evidence over static lists;
- human agency over automated judgment.

RN Terrain supplies the concrete domain, signals, data pipeline, workflow integrations, and real-world validation.

The framework should remain general enough to transfer, but RN Terrain should remain specific enough to be useful.

## Tagline

**See the terrain. Understand the trade-offs. Choose your path.**
