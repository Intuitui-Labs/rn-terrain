/**
 * @file accumulator.ts
 * The heart of the temporal range model.
 *
 * Given (v_start, v_current) for each package, this module queries the TCDI
 * corpus INDEX.json and accumulates EVERY signal whose `version_to` falls
 * within the closed interval [v_start, v_current].
 *
 * This is NOT an event-based "jump detector". The codebase is path-dependent
 * on the full temporal continuum between its first and current install.
 * Every entry in that range contributed to the current state of the code.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { compareSemver } from './git-drift.js';
import type {
  AccumulatedSignals,
  ApiLifecycleState,
  AstMatcher,
  CapabilitySignal,
  CorpusEntry,
  HorizonConfig,
  ImpactType,
  LegacySignal,
  ProjectSignals,
  ProjectVersionRanges,
} from './types.js';

// ─── Corpus loading ───────────────────────────────────────────────────────────

interface IndexJson {
  entries: Record<string, {
    package: string;
    version_to: string;
    date_released: string;
    impact_type: ImpactType;
    severity: string;
    code_smell_signatures?: string[] | AstMatcher[];
    capabilities_unlocked?: string[];
    file: string;
  }>;
}

let _corpus: CorpusEntry[] | null = null;

export function loadCorpus(indexPath: string): CorpusEntry[] {
  if (_corpus) return _corpus;
  if (!existsSync(indexPath)) {
    throw new Error(`TCDI corpus not found at: ${indexPath}`);
  }
  const raw = JSON.parse(readFileSync(indexPath, 'utf-8')) as IndexJson;

  _corpus = Object.entries(raw.entries).map(([id, e]) => ({
    id,
    package: e.package,
    version_to: e.version_to,
    date_released: e.date_released,
    impact_type: e.impact_type,
    severity: (e.severity ?? 'MEDIUM') as CorpusEntry['severity'],
    // Normalise code_smell_signatures — may be plain strings or structured matchers
    code_smell_signatures: normaliseMatchers(e.code_smell_signatures),
    capabilities_unlocked: e.capabilities_unlocked ?? [],
    file: e.file,
  }));

  return _corpus;
}

/** Coerce legacy plain-regex strings into typed Regex matchers. */
function normaliseMatchers(raw: string[] | AstMatcher[] | undefined): AstMatcher[] {
  if (!raw || raw.length === 0) return [];
  return (raw as Array<string | AstMatcher>).map((m) => {
    if (typeof m === 'string') return { type: 'Regex' as const, pattern: m };
    return m;
  });
}

// ─── Impact type classification ───────────────────────────────────────────────

const LEGACY_IMPACT_TYPES: Set<ImpactType> = new Set([
  'BREAKING_API_CHANGE',
  'SILENT_BEHAVIORAL_BREAK',
  'DEPRECATION_WARNING',
  'BUG_FIX',
]);

const CAPABILITY_IMPACT_TYPES: Set<ImpactType> = new Set([
  'NEW_CAPABILITY',
  'BUILD_PIPELINE_CHANGE',
  'SETUP_CHANGE',
]);

// ─── Range filtering ──────────────────────────────────────────────────────────

/**
 * Returns true when `entryVersion` is within the closed interval
 * [v_start, v_current] (inclusive on both ends).
 */
function inRange(entryVersion: string, v_start: string, v_current: string): boolean {
  return (
    compareSemver(entryVersion, v_start) >= 0 &&
    compareSemver(entryVersion, v_current) <= 0
  );
}

// ─── Lifecycle State Determination ──────────────────────────────────────────

function determineLifecycleState(entry: CorpusEntry, v_current: string): ApiLifecycleState {
  if (entry.impact_type === 'BREAKING_API_CHANGE') {
    if (compareSemver(v_current, entry.version_to) >= 0) {
      return 'UNSUPPORTED_REMOVED';
    }
    return 'DEPRECATED';
  }
  if (entry.impact_type === 'SILENT_BEHAVIORAL_BREAK' || entry.impact_type === 'BUG_FIX') {
    return 'BROKEN_DEFECTIVE';
  }
  if (entry.impact_type === 'DEPRECATION_WARNING') {
    return 'DEPRECATED';
  }
  if (
    entry.impact_type === 'NEW_CAPABILITY' ||
    entry.impact_type === 'BUILD_PIPELINE_CHANGE' ||
    entry.impact_type === 'SETUP_CHANGE'
  ) {
    return 'NEW_CAPABILITY';
  }
  return 'FUNCTIONAL_STABLE';
}

// ─── Adoption Horizon Calculation ────────────────────────────────────────────

export function computeHorizonFloor(
  v_start: string,
  v_current: string,
  horizon?: HorizonConfig
): string {
  if (!horizon || !horizon.strategy || horizon.strategy === 'current-major') {
    const major = v_current.split('.')[0] ?? '0';
    const floor = `${major}.0.0`;
    return compareSemver(floor, v_start) > 0 ? floor : v_start;
  }

  if (horizon.strategy === 'from-project-start') {
    return v_start;
  }

  if (horizon.strategy === 'last-n-minors') {
    const parts = v_current.split('.');
    const major = parseInt(parts[0] ?? '0', 10);
    const minor = parseInt(parts[1] ?? '0', 10);
    const n = typeof horizon.value === 'number'
      ? horizon.value
      : parseInt(String(horizon.value ?? '1'), 10);
    const targetMinor = Math.max(0, minor - n);
    const floor = `${major}.${targetMinor}.0`;
    return compareSemver(floor, v_start) > 0 ? floor : v_start;
  }

  if (horizon.strategy === 'explicit' && typeof horizon.value === 'string') {
    return horizon.value;
  }

  return v_start;
}

// ─── Signal builders ──────────────────────────────────────────────────────────

function toLegacySignal(entry: CorpusEntry, v_current: string): LegacySignal {
  return {
    entryId: entry.id,
    package: entry.package,
    lifecycleState: determineLifecycleState(entry, v_current),
    activeFrom: entry.version_to,
    impactType: entry.impact_type,
    severity: entry.severity,
    title: entry.id.replace(/_/g, ' '),
    matchers: entry.code_smell_signatures ?? [],
    chronologyFile: entry.file,
  };
}

function toCapabilitySignal(entry: CorpusEntry): CapabilitySignal {
  return {
    entryId: entry.id,
    package: entry.package,
    lifecycleState: 'NEW_CAPABILITY',
    availableSince: entry.version_to,
    title: entry.id.replace(/_/g, ' '),
    capabilitiesUnlocked: entry.capabilities_unlocked ?? [],
    chronologyFile: entry.file,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface AccumulatorOptions {
  /** Resolved path to the TCDI INDEX.json corpus. */
  corpusIndexPath: string;
  /** Version ranges extracted from git drift or user config. */
  ranges: ProjectVersionRanges;
  /** Contextual adoption horizon for new capabilities. */
  horizon?: HorizonConfig;
}

/**
 * Accumulates TCDI signals for every corpus entry in [v_start, v_current]
 * for each package in the project.
 *
 * For capability signals, bounds analysis to [horizonFloor, v_current].
 */
export function accumulateSignals(opts: AccumulatorOptions): ProjectSignals {
  const { corpusIndexPath, ranges, horizon } = opts;
  const corpus = loadCorpus(corpusIndexPath);
  const result: ProjectSignals = {};

  for (const [pkg, { v_start, v_current }] of Object.entries(ranges)) {
    const legacySignals: LegacySignal[] = [];
    const capabilitySignals: CapabilitySignal[] = [];

    // Calculate contextual adoption horizon floor for this package
    const horizonFloor = computeHorizonFloor(v_start, v_current, horizon);

    // Filter corpus to legacy entries within [v_start, v_current]
    const legacyEntries = corpus.filter(
      (e) => e.package === pkg && inRange(e.version_to, v_start, v_current)
    );
    legacyEntries.sort((a, b) => compareSemver(a.version_to, b.version_to));

    for (const entry of legacyEntries) {
      if (LEGACY_IMPACT_TYPES.has(entry.impact_type)) {
        if ((entry.code_smell_signatures?.length ?? 0) > 0) {
          legacySignals.push(toLegacySignal(entry, v_current));
        }
      }
    }

    // Filter corpus to capability entries within [horizonFloor, v_current]
    const capabilityEntries = corpus.filter(
      (e) => e.package === pkg && inRange(e.version_to, horizonFloor, v_current)
    );
    capabilityEntries.sort((a, b) => compareSemver(a.version_to, b.version_to));

    for (const entry of capabilityEntries) {
      if (
        (entry.capabilities_unlocked?.length ?? 0) > 0 ||
        CAPABILITY_IMPACT_TYPES.has(entry.impact_type)
      ) {
        if ((entry.capabilities_unlocked?.length ?? 0) > 0) {
          capabilitySignals.push(toCapabilitySignal(entry));
        }
      }
    }

    result[pkg] = {
      range: { v_start, v_current },
      horizonFloor,
      legacySignals,
      capabilitySignals,
    };
  }

  return result;
}

/** Returns a flat list of all corpus packages that have shard data. */
export function getCorpusPackages(corpusIndexPath: string): Set<string> {
  const corpus = loadCorpus(corpusIndexPath);
  return new Set(corpus.map((e) => e.package));
}
