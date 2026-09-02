# GitHub Atlas: Practical Reality Layer

## Why this exists

The Student Developer Pack is not a static catalogue of capabilities. An offer can be officially listed while being limited by eligibility, expiry, quotas, service exclusions, account review, payment requirements, regional policy, or provider changes.

Atlas must distinguish what a provider advertises from what a student can practically use.

## Offer model

```text
Provider
  └── Offer
        └── Offer State over time
```

Every offer has a semantic description and a time-sensitive state. The state records availability, validity, requirements, limits, exclusions, practical observations, evidence, and confidence.

## Separate claims

Atlas must not collapse these into one status:

- `officially_listed`: the offer appears in the official Pack;
- `practically_available`: current evidence suggests redemption works;
- `fit_for_user`: the offer matches this user's goals and constraints.

An offer may be officially listed but practically uncertain, or practically available but irrelevant to a particular project.

## Evidence policy

Official provider or GitHub sources establish the advertised offer. Community reports and observed redemption problems are valuable reality signals but do not automatically override official information. Conflicts remain visible and reduce confidence.

Each evidence item includes its source, kind, date, confidence, and an optional note. The catalogue is curated, while automated checks should validate links and freshness.

## Scoring policy

The evaluator combines:

```text
goal and capability fit
+ simplicity, learning, and launch priorities
- practical availability penalty
```

Availability is deliberately a penalty rather than a hidden exclusion. A limited or uncertain offer can still be shown, but the user must see the warning.

## Required user-facing warnings

Recommendations must surface:

- provider or account requirements;
- quotas and duration;
- service exclusions;
- expiry or winding-down risk;
- low-confidence or conflicting evidence;
- the instruction to verify before making the offer a project dependency.

## Example

DigitalOcean may be useful for ordinary cloud hosting while excluding GPU or third-party AI services. If official listing and community availability reports disagree, Atlas should say so rather than silently calling it a universally suitable AI platform.

## Integrity rule

The system must be able to say “we do not know.” A stale or conflicting offer is not equivalent to an active offer, and an advertised dollar value is not equivalent to usable value for every student.
