/**
 * @file git-drift.ts
 * Extracts (v_start, v_current) version range anchors for each RN-ecosystem
 * package from the git history of any target project.
 *
 * Design principle:
 *   Git history is consulted ONLY to establish the two anchor points.
 *   The corpus range query [v_start, v_current] is what drives analysis —
 *   not individual commit events.
 */

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ConfigurableVersionRange, ProjectVersionRanges, VersionRange } from './types.js';

// ─── Semver utilities (lightweight, no external dep) ─────────────────────────

function cleanVersion(raw: string): string {
  const withoutRange = raw.replace(/^[~^]/, '');
  const firstPart = withoutRange.split(' ')[0] ?? '';
  return firstPart.split(',')[0]?.trim() ?? '';
}

function parseSemver(v: string): [number, number, number, string] {
  const clean = cleanVersion(v);
  const dashIdx = clean.indexOf('-');
  const main = dashIdx >= 0 ? clean.slice(0, dashIdx) : clean;
  const pre  = dashIdx >= 0 ? clean.slice(dashIdx + 1) : '';
  const parts = main.split('.');
  const major = parseInt(parts[0] ?? '0', 10);
  const minor = parseInt(parts[1] ?? '0', 10);
  const patch = parseInt(parts[2] ?? '0', 10);
  return [major, minor, patch, pre];
}

export function compareSemver(a: string, b: string): number {
  const [ma, mna, pa, prea] = parseSemver(a);
  const [mb, mnb, pb, preb] = parseSemver(b);
  if (ma !== mb) return ma - mb;
  if (mna !== mnb) return mna - mnb;
  if (pa !== pb) return pa - pb;
  // pre-release is less than stable
  if (prea && !preb) return -1;
  if (!prea && preb) return 1;
  if (prea && preb) return prea.localeCompare(preb);
  return 0;
}

// ─── Git diff parser ─────────────────────────────────────────────────────────

const DEP_LINE_RE = /^[+-]\s+"([\w@][^"]+)":\s+"([^"]+)"/;

/**
 * Parse all +/- dep lines from `git log -p -- package.json` output.
 * Returns a flat map: pkg → Set of all versions ever seen in the diff.
 */
function parseDiffVersions(log: string): Map<string, Set<string>> {
  const seen = new Map<string, Set<string>>();
  for (const line of log.split('\n')) {
    if (!line.startsWith('+') && !line.startsWith('-')) continue;
    if (line.startsWith('+++') || line.startsWith('---')) continue;
    const m = DEP_LINE_RE.exec(line);
    if (!m || !m[1] || !m[2]) continue;
    const pkg = m[1];
    const rawVer = m[2];
    const ver = cleanVersion(rawVer);
    // Ignore non-semver placeholders like "workspace:*"
    if (!ver.match(/^\d/)) continue;
    if (!seen.has(pkg)) seen.set(pkg, new Set());
    seen.get(pkg)!.add(ver);
  }
  return seen;
}

// ─── Current installed versions ───────────────────────────────────────────────

function readInstalledVersions(cwd: string): Record<string, string> {
  const pkgPath = resolve(cwd, 'package.json');
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const result: Record<string, string> = {};
    for (const [name, ver] of Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })) {
      const cleaned = cleanVersion(ver);
      if (cleaned.match(/^\d/)) result[name] = cleaned;
    }
    return result;
  } catch {
    return {};
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface GitDriftOptions {
  /** Root of the target RN project. */
  cwd: string;
  /**
   * When true (default), uses git log to find the earliest version installed.
   * When false, v_start === v_current (single-point, no historical accumulation).
   */
  useGitHistory?: boolean;
  /**
   * Optional allowlist of package names to track.
   * If omitted, all packages found in the diff are returned.
   * Pass the set of packages your TCDI corpus has shards for.
   */
  trackedPackages?: Set<string>;
  /** Global user-configured start version override */
  from?: string;
  /** Global user-configured end version override */
  to?: string;
  /** Specific per-package start/end version overrides */
  packageRanges?: Record<string, ConfigurableVersionRange>;
}

/**
 * Extracts the (v_start, v_current) range for each tracked package.
 *
 * Defaults:
 *   v_start   = oldest version ever seen in git history (or installed if no history)
 *   v_current = version currently in package.json
 *
 * User overrides:
 *   opts.from / opts.to (global)
 *   opts.packageRanges[pkg] (per-package)
 *
 * These two anchors define the closed interval [v_start, v_current] that the
 * corpus accumulator will query.
 */
export function extractVersionRanges(opts: GitDriftOptions): ProjectVersionRanges {
  const { cwd, useGitHistory = true, trackedPackages, from, to, packageRanges } = opts;
  const installed = readInstalledVersions(cwd);
  const ranges: ProjectVersionRanges = {};

  // Build candidate package list: installed packages + explicitly configured in packageRanges
  const candidatePackages = new Set<string>([
    ...Object.keys(installed),
    ...(packageRanges ? Object.keys(packageRanges) : []),
  ]);

  // Seed ranges from installed versions and/or user overrides
  for (const pkg of candidatePackages) {
    if (trackedPackages && !trackedPackages.has(pkg)) continue;

    const userOverride = packageRanges?.[pkg];
    const userStart = userOverride?.from ?? userOverride?.v_start ?? from;
    const userEnd = userOverride?.to ?? userOverride?.v_current ?? to;

    const currentVer = userEnd
      ? cleanVersion(userEnd)
      : (installed[pkg] ?? '0.0.0');

    const startVer = userStart
      ? cleanVersion(userStart)
      : currentVer;

    ranges[pkg] = { v_start: startVer, v_current: currentVer };
  }

  // Check if git history is needed (only if any tracked package lacks explicit user start version)
  const needsGitHistory = useGitHistory && Array.from(candidatePackages).some((pkg) => {
    if (trackedPackages && !trackedPackages.has(pkg)) return false;
    const userOverride = packageRanges?.[pkg];
    const hasExplicitStart = (userOverride?.from ?? userOverride?.v_start ?? from) !== undefined;
    return !hasExplicitStart;
  });

  if (!needsGitHistory) {
    // Normalise any inverted intervals
    for (const [pkg, r] of Object.entries(ranges)) {
      if (compareSemver(r.v_start, r.v_current) > 0) {
        ranges[pkg] = { v_start: r.v_current, v_current: r.v_start };
      }
    }
    return ranges;
  }

  // Pull full git diff history for package.json
  let log = '';
  try {
    log = execSync('git log --all -p --follow -- "package.json"', {
      cwd,
      encoding: 'utf-8',
      maxBuffer: 30 * 1024 * 1024,
      stdio: ['pipe', 'pipe', 'ignore'],
    });
  } catch {
    // Not a git repo or no history — graceful degradation
    return ranges;
  }

  const historicVersions = parseDiffVersions(log);

  for (const [pkg, versions] of historicVersions.entries()) {
    if (trackedPackages && !trackedPackages.has(pkg)) continue;

    const userOverride = packageRanges?.[pkg];
    const userStart = userOverride?.from ?? userOverride?.v_start ?? from;
    const userEnd = userOverride?.to ?? userOverride?.v_current ?? to;

    const current = userEnd
      ? cleanVersion(userEnd)
      : (installed[pkg] ?? ranges[pkg]?.v_current ?? '0.0.0');

    if (!current) continue;

    if (userStart) {
      ranges[pkg] = { v_start: cleanVersion(userStart), v_current: current };
      continue;
    }

    const sorted = [...versions].sort(compareSemver);
    const oldest = sorted[0];
    const v_start = oldest != null ? oldest : current;
    ranges[pkg] = { v_start, v_current: current };
  }

  // Normalise any inverted intervals
  for (const [pkg, r] of Object.entries(ranges)) {
    if (compareSemver(r.v_start, r.v_current) > 0) {
      ranges[pkg] = { v_start: r.v_current, v_current: r.v_start };
    }
  }

  return ranges;
}

