/**
 * @file scan.ts
 * Orchestrates the full pipeline:
 *   git-drift → accumulator → ast-walker → result
 *
 * This is the single entry point for programmatic usage.
 */

import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { extractVersionRanges } from './git-drift.js';
import { accumulateSignals, getCorpusPackages } from './accumulator.js';
import { walkProject } from './ast-walker.js';
import type { ScanOptions, ScanResult, ScanSummary, Severity } from './types.js';

// ─── Corpus path resolution ───────────────────────────────────────────────────

/**
 * Resolves the TCDI corpus INDEX.json.
 * Priority: explicit opt → env var → sibling docs/ → error.
 */
function resolveCorpusPath(explicit?: string): string {
  if (explicit) return resolve(explicit);

  const envPath = process.env['RN_TERRAIN_CORPUS'];
  if (envPath) return resolve(envPath);

  // When installed as a package, look for corpus relative to this file
  const here = fileURLToPath(new URL('.', import.meta.url));
  const candidates = [
    resolve(here, '../../docs/changelog-intelligence/graph/INDEX.json'),
    resolve(here, '../../../docs/changelog-intelligence/graph/INDEX.json'),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  throw new Error(
    'TCDI corpus (INDEX.json) not found. ' +
    'Set RN_TERRAIN_CORPUS env var or pass corpusIndexPath in options.'
  );
}

// ─── Summary builder ──────────────────────────────────────────────────────────

function countBySeverity(severities: Severity[]): Record<Severity, number> {
  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 } as Record<Severity, number>;
  for (const sev of severities) counts[sev]++;
  return counts;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Run the TCDI AST scanner against any React Native project.
 *
 * @example
 * ```ts
 * import { scan } from '@intuitui-labs/rn-terrain-scanner';
 *
 * const result = await scan({ cwd: './my-rn-app' });
 * console.log(result.summary);
 * ```
 */
export async function scan(opts: ScanOptions = {}): Promise<ScanResult> {
  const {
    cwd = process.cwd(),
    mode = 'all',
    srcDir,
    corpusIndexPath,
    useGitHistory = true,
    packages,
    from,
    to,
    packageRanges,
    horizon,
    workspace,
  } = opts;

  const resolvedCwd = resolve(cwd);
  const resolvedSrcDir = srcDir ? resolve(srcDir) : resolvedCwd;
  const resolvedCorpus = resolveCorpusPath(corpusIndexPath);

  // Step 1 — Identify which packages the corpus has data for
  const corpusPackages = getCorpusPackages(resolvedCorpus);

  let trackedPackages = corpusPackages;
  if (packages && packages.length > 0) {
    trackedPackages = new Set(packages.filter((p) => corpusPackages.has(p)));
  }

  // Step 2 — Extract (v_start, v_current) from git history or user configuration
  const versionRanges = extractVersionRanges({
    cwd: resolvedCwd,
    useGitHistory,
    trackedPackages,
    from,
    to,
    packageRanges,
  });

  // Step 3 — Accumulate signals across range with contextual adoption horizon
  const projectSignals = accumulateSignals({
    corpusIndexPath: resolvedCorpus,
    ranges: versionRanges,
    horizon,
  });

  // Step 4 — Walk source AST and match signals
  const { fenceFindings, radarFindings, filesWalked } = walkProject({
    srcDir: resolvedSrcDir,
    projectSignals: mode === 'fence'
      ? filterToFence(projectSignals)
      : mode === 'radar'
        ? filterToRadar(projectSignals)
        : projectSignals,
    baseCwd: resolvedCwd,
  });

  // Step 5 — Build summary with 5-state lifecycle counts
  const fenceSeverities = fenceFindings.map((f) => f.signal.severity);
  const severityCounts = countBySeverity(fenceSeverities);

  let unsupportedRemoved = 0;
  let brokenDefective = 0;
  let deprecated = 0;

  for (const f of fenceFindings) {
    if (f.signal.lifecycleState === 'UNSUPPORTED_REMOVED') unsupportedRemoved++;
    else if (f.signal.lifecycleState === 'BROKEN_DEFECTIVE') brokenDefective++;
    else if (f.signal.lifecycleState === 'DEPRECATED') deprecated++;
  }

  const summary: ScanSummary = {
    totalFenceFindings: fenceFindings.length,
    totalRadarFindings: radarFindings.length,
    unsupportedRemoved,
    brokenDefective,
    deprecated,
    critical: severityCounts.CRITICAL,
    high: severityCounts.HIGH,
    medium: severityCounts.MEDIUM,
    low: severityCounts.LOW,
    packagesScanned: Object.keys(versionRanges).length,
    filesWalked,
  };

  return {
    projectCwd: resolvedCwd,
    scannedAt: new Date().toISOString(),
    versionRanges,
    fenceFindings,
    radarFindings,
    summary,
  };
}

function filterToFence(signals: ReturnType<typeof accumulateSignals>) {
  return Object.fromEntries(
    Object.entries(signals).map(([k, v]) => [k, { ...v, capabilitySignals: [] }])
  );
}

function filterToRadar(signals: ReturnType<typeof accumulateSignals>) {
  return Object.fromEntries(
    Object.entries(signals).map(([k, v]) => [k, { ...v, legacySignals: [] }])
  );
}
