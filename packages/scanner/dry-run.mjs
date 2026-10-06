/**
 * dry-run.mjs
 *
 * Dry-run script for @intuitui-labs/rn-terrain-scanner.
 *
 * Usage:
 *   node packages/scanner/dry-run.mjs [--fence | --radar | --all] [--pkg <package-name>]
 *
 * Runs against c:/x/apps/gurudevi-mobile by default.
 * Prints the version range, accumulated signal count, and full findings.
 * Does NOT modify any files.
 */

import { fileURLToPath } from 'node:url';
import { resolve, dirname, join } from 'node:path';
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Paths ───────────────────────────────────────────────────────────────────

const APP_CWD     = 'c:/x/apps/gurudevi-mobile';
const CORPUS_PATH = resolve(__dirname, '../../docs/changelog-intelligence/graph/INDEX.json');

// ─── Args ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node packages/scanner/dry-run.mjs [options]

Options:
  --fence              Run Legacy Fence only (flags deprecated, broken, removed patterns)
  --radar              Run Capabilities Radar only (flags unadopted new APIs & capabilities)
  --all                Run both Fence and Radar (default)
  --pkg <name>         Package to analyze (default: react-native-gesture-handler)
  --from <version>     User-configured start version anchor (overrides git history)
  --to <version>       User-configured end version anchor (overrides package.json)
  --start <version>    Alias for --from
  --end <version>      Alias for --to
  --horizon <strategy> Adoption horizon for capabilities:
                       current-major (default) | from-project-start |
                       last-n-minors:N | explicit:VERSION
  --cwd <path>         Target app directory (default: c:/x/apps/gurudevi-mobile)
  --dirs <p1,p2,...>   Explicit comma-separated source directories to scan
  --no-git             Disable git history analysis (single-point analysis)
  --no-workspace       Disable monorepo workspace package discovery
  --help, -h           Show this help message
`);
  process.exit(0);
}

const MODE = args.includes('--fence') ? 'fence'
           : args.includes('--radar') ? 'radar'
           : 'all';

const PKG_FILTER = (() => {
  const idx = args.indexOf('--pkg');
  return idx >= 0 ? args[idx + 1] : 'react-native-gesture-handler'; // default: RNGH
})();

const FROM_ARG = (() => {
  const fromIdx = args.indexOf('--from');
  if (fromIdx >= 0 && args[fromIdx + 1]) return args[fromIdx + 1];
  const startIdx = args.indexOf('--start');
  if (startIdx >= 0 && args[startIdx + 1]) return args[startIdx + 1];
  return undefined;
})();

const TO_ARG = (() => {
  const toIdx = args.indexOf('--to');
  if (toIdx >= 0 && args[toIdx + 1]) return args[toIdx + 1];
  const endIdx = args.indexOf('--end');
  if (endIdx >= 0 && args[endIdx + 1]) return args[endIdx + 1];
  return undefined;
})();

const HORIZON_ARG = (() => {
  const idx = args.indexOf('--horizon');
  if (idx < 0 || !args[idx + 1]) return undefined;
  const raw = args[idx + 1];
  if (raw === 'current-major' || raw === 'from-project-start') {
    return { strategy: raw };
  }
  if (raw.startsWith('last-n-minors')) {
    const parts = raw.split(':');
    return { strategy: 'last-n-minors', value: parts[1] ? parseInt(parts[1], 10) : 1 };
  }
  if (raw.startsWith('explicit:')) {
    return { strategy: 'explicit', value: raw.split(':')[1] };
  }
  return { strategy: 'current-major' };
})();

const NO_GIT = args.includes('--no-git');
const NO_WORKSPACE = args.includes('--no-workspace');

const CUSTOM_CWD = (() => {
  const cwdIdx = args.indexOf('--cwd');
  if (cwdIdx >= 0 && args[cwdIdx + 1]) return args[cwdIdx + 1];
  const appIdx = args.indexOf('--app');
  if (appIdx >= 0 && args[appIdx + 1]) return args[appIdx + 1];
  return undefined;
})();

const DIRS_ARG = (() => {
  const idx = args.indexOf('--dirs');
  return idx >= 0 && args[idx + 1] ? args[idx + 1].split(',').map(s => s.trim()) : undefined;
})();

const EFFECTIVE_APP_CWD = CUSTOM_CWD ? resolve(CUSTOM_CWD) : APP_CWD;

// ─── Workspace source discovery ───────────────────────────────────────────────

function discoverSourceDirs(targetCwd, includeWorkspace = true) {
  if (DIRS_ARG && DIRS_ARG.length > 0) {
    const resolved = DIRS_ARG.map(d => resolve(d)).filter(existsSync);
    return { dirs: resolved, root: targetCwd };
  }

  const dirs = [];
  const standardSubdirs = ['src', 'app', 'components', 'features', 'hooks', 'screens'];

  for (const sub of standardSubdirs) {
    const p = join(targetCwd, sub);
    if (existsSync(p)) dirs.push(p);
  }

  if (!includeWorkspace) return { dirs, root: targetCwd };

  const candidates = [
    targetCwd,
    resolve(targetCwd, '..'),
    resolve(targetCwd, '../..'),
  ];

  let workspaceRoot = null;
  for (const cand of candidates) {
    if (existsSync(join(cand, 'pnpm-workspace.yaml')) || existsSync(join(cand, 'turbo.json'))) {
      workspaceRoot = cand;
      break;
    }
  }

  if (workspaceRoot) {
    const packagesDir = join(workspaceRoot, 'packages');
    if (existsSync(packagesDir)) {
      try {
        for (const pkg of readdirSync(packagesDir)) {
          const pkgPath = join(packagesDir, pkg);
          const pkgJsonPath = join(pkgPath, 'package.json');
          if (existsSync(pkgJsonPath)) {
            try {
              const meta = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
              const allDeps = { ...meta.dependencies, ...meta.devDependencies, ...meta.peerDependencies };
              // Prioritize packages that touch react-native, gestures, or UI
              const isRelevant = allDeps['react-native-gesture-handler'] ||
                                 allDeps['react-native'] ||
                                 pkg === 'ui';
              if (!isRelevant) continue;
            } catch {}
          }
          for (const sub of ['src', 'components']) {
            const p = join(pkgPath, sub);
            if (existsSync(p) && !dirs.includes(p)) {
              dirs.push(p);
            }
          }
        }
      } catch {}
    }
  }

  return { dirs, root: workspaceRoot ?? targetCwd };
}

const { dirs: EFFECTIVE_SRC_DIRS, root: WORKSPACE_ROOT } = discoverSourceDirs(EFFECTIVE_APP_CWD, !NO_WORKSPACE);

// ─── Inline implementations (avoids build step for dry-run) ──────────────────
// We import directly from the TS source via --experimental-strip-types or tsx.
// Run via: node --experimental-strip-types packages/scanner/dry-run.mjs
// OR:      npx tsx packages/scanner/dry-run.mjs

import { extractVersionRanges } from './dist/git-drift.js';
import { accumulateSignals, loadCorpus } from './dist/accumulator.js';
import { walkProject } from './dist/ast-walker.js';
import { formatReport } from './dist/reporter.js';

// ─── ANSI ─────────────────────────────────────────────────────────────────────

const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', yellow: '\x1b[33m', cyan: '\x1b[36m',
  green: '\x1b[32m', magenta: '\x1b[35m', blue: '\x1b[34m',
};

function banner(title) {
  const line = '═'.repeat(64);
  console.log(`\n${C.bold}${line}${C.reset}`);
  console.log(`${C.bold}  ${title}${C.reset}`);
  console.log(`${C.bold}${line}${C.reset}\n`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  banner(`rn-terrain dry-run · ${PKG_FILTER} · mode: ${MODE}`);

  // Step 1 — Verify corpus exists
  if (!existsSync(CORPUS_PATH)) {
    console.error(`${C.red}✗ Corpus not found: ${CORPUS_PATH}${C.reset}`);
    process.exit(1);
  }
  console.log(`${C.dim}  Workspace: ${WORKSPACE_ROOT}${C.reset}`);
  console.log(`${C.dim}  App: ${EFFECTIVE_APP_CWD}${C.reset}`);
  console.log(`${C.dim}  Source dirs (${EFFECTIVE_SRC_DIRS.length}): ${EFFECTIVE_SRC_DIRS.map(d => d.replace(WORKSPACE_ROOT, '').replace(/^[\\\/]/, '')).join(', ')}${C.reset}\n`);

  // Step 2 — Extract version range (git history or user config)
  console.log(`${C.cyan}[1/4]${C.reset} Establishing version range anchors…`);
  const allRanges = extractVersionRanges({
    cwd: EFFECTIVE_APP_CWD,
    useGitHistory: !NO_GIT,
    trackedPackages: new Set([PKG_FILTER]),
    from: FROM_ARG,
    to: TO_ARG,
  });

  const range = allRanges[PKG_FILTER];
  if (!range) {
    console.error(`${C.red}✗ Package "${PKG_FILTER}" not found in git history, package.json, or user configuration.${C.reset}`);
    process.exit(1);
  }

  const startNote = FROM_ARG
    ? `${C.magenta}(user-configured --from)${C.reset}`
    : NO_GIT
      ? `${C.dim}(single-point)${C.reset}`
      : `${C.dim}(git history)${C.reset}`;

  const endNote = TO_ARG
    ? `${C.magenta}(user-configured --to)${C.reset}`
    : `${C.dim}(package.json)${C.reset}`;

  console.log(`  ${C.yellow}${PKG_FILTER}${C.reset}  ${C.cyan}${range.v_start}${C.reset} ${startNote} ${C.bold}→${C.reset} ${C.cyan}${range.v_current}${C.reset} ${endNote}`);

  // Step 3 — Load corpus and show all entries in range (dry-run info)
  console.log(`\n${C.cyan}[2/4]${C.reset} Loading corpus entries in range [${range.v_start}, ${range.v_current}]…`);
  const corpus = loadCorpus(CORPUS_PATH);
  const inRangeEntries = corpus.filter(e => e.package === PKG_FILTER);

  // Count by impact type
  const counts = {};
  for (const e of inRangeEntries) {
    counts[e.impact_type] = (counts[e.impact_type] ?? 0) + 1;
  }
  console.log(`  Total corpus entries for ${PKG_FILTER}: ${C.bold}${inRangeEntries.length}${C.reset}`);
  for (const [type, count] of Object.entries(counts)) {
    const color = type.includes('BREAK') || type.includes('REMOVAL') ? C.red
                : type.includes('DEPREC') ? C.yellow
                : type.includes('NEW') || type.includes('CAPABILITY') ? C.green
                : C.dim;
    console.log(`    ${color}${type}${C.reset}: ${count}`);
  }

  // Step 4 — Accumulate signals
  console.log(`\n${C.cyan}[3/4]${C.reset} Accumulating signals (horizon: ${HORIZON_ARG ? JSON.stringify(HORIZON_ARG) : 'default current-major'})…`);
  const projectSignals = accumulateSignals({
    corpusIndexPath: CORPUS_PATH,
    ranges: allRanges,
    horizon: HORIZON_ARG,
  });

  const signals = projectSignals[PKG_FILTER];
  if (!signals) {
    console.log(`${C.dim}  No signals accumulated (package may lack structured matchers).${C.reset}`);
  } else {
    console.log(`  ${C.red}Legacy signals${C.reset} (fence): ${C.bold}${signals.legacySignals.length}${C.reset}`);
    for (const s of signals.legacySignals) {
      console.log(`    ${C.dim}[${s.impactType}] ${s.title} (active from v${s.activeFrom})${C.reset}`);
      if (s.matchers.length > 0) {
        console.log(`      matchers: ${s.matchers.map(m => m.type + (m.type !== 'Regex' ? ':' + (/** @type {any} */(m)).name : '')).join(', ')}`);
      }
    }
    console.log(`  ${C.green}Capability signals${C.reset} (radar): ${C.bold}${signals.capabilitySignals.length}${C.reset}`);
    for (const s of signals.capabilitySignals) {
      console.log(`    ${C.dim}[${s.availableSince}] ${s.title}${C.reset}`);
      if (s.capabilitiesUnlocked.length > 0) {
        console.log(`      APIs: ${C.cyan}${s.capabilitiesUnlocked.join(', ')}${C.reset}`);
      }
    }
  }

  // Step 5 — Walk source AST
  console.log(`\n${C.cyan}[4/4]${C.reset} Walking source AST across ${EFFECTIVE_SRC_DIRS.length} directories…`);

  let totalFence = 0, totalRadar = 0, totalFiles = 0;
  const allFenceFindings = [];
  const allRadarFindings = [];

  for (const srcDir of EFFECTIVE_SRC_DIRS) {
    const dirLabel = srcDir.replace(WORKSPACE_ROOT, '').replace(/^[\\\/]/, '');
    const signalsForDir = MODE === 'fence'
      ? Object.fromEntries(Object.entries(projectSignals).map(([k, v]) => [k, { ...v, capabilitySignals: [] }]))
      : MODE === 'radar'
        ? Object.fromEntries(Object.entries(projectSignals).map(([k, v]) => [k, { ...v, legacySignals: [] }]))
        : projectSignals;

    const { fenceFindings, radarFindings, filesWalked } = walkProject({
      srcDir,
      projectSignals: signalsForDir,
      baseCwd: WORKSPACE_ROOT,
    });

    totalFiles += filesWalked;
    totalFence += fenceFindings.length;
    totalRadar += radarFindings.length;
    allFenceFindings.push(...fenceFindings);
    allRadarFindings.push(...radarFindings);

    if (fenceFindings.length > 0 || radarFindings.length > 0) {
      console.log(`\n  ${C.bold}${dirLabel}/${C.reset}  (${filesWalked} files)`);
    }

    // ── FENCE output ──
    if (MODE !== 'radar' && fenceFindings.length > 0) {
      console.log(`\n  ${C.red}${C.bold}🛡️  LEGACY FENCE — ${fenceFindings.length} violation(s)${C.reset}`);
      const bySignal = new Map();
      for (const f of fenceFindings) {
        const list = bySignal.get(f.signal.entryId) ?? [];
        list.push(f);
        bySignal.set(f.signal.entryId, list);
      }
      for (const [, findings] of bySignal) {
        const { signal } = findings[0];
        const sevColor = signal.severity === 'CRITICAL' ? C.red : C.yellow;
        console.log(`\n    ${sevColor}[${signal.severity}]${C.reset} ${C.bold}${signal.title}${C.reset}`);
        console.log(`    ${C.dim}Type: ${signal.impactType} · Active from v${signal.activeFrom}${C.reset}`);
        console.log(`    ${C.blue}📖 ${signal.chronologyFile}${C.reset}`);
        for (const f of findings) {
          console.log(`      ${C.yellow}→${C.reset} ${f.file}${C.dim}:${f.line}${C.reset}`);
          if (f.excerpt) console.log(`        ${C.dim}${f.excerpt}${C.reset}`);
        }
      }
    }

    // ── RADAR output ──
    if (MODE !== 'fence' && radarFindings.length > 0) {
      console.log(`\n  ${C.cyan}${C.bold}🔭 CAPABILITIES RADAR — ${radarFindings.length} gap(s)${C.reset}`);
      for (const f of radarFindings) {
        console.log(`\n    ${C.magenta}[SUGGESTION]${C.reset} ${C.bold}${f.signal.title}${C.reset}`);
        console.log(`    ${C.dim}Available since v${f.signal.availableSince}${C.reset}`);
        if (f.signal.capabilitiesUnlocked.length > 0) {
          console.log(`    APIs not yet adopted: ${C.cyan}${f.signal.capabilitiesUnlocked.join(', ')}${C.reset}`);
        }
        console.log(`    ${C.blue}📖 ${f.signal.chronologyFile}${C.reset}`);
        if (f.relatedFiles.length > 0) {
          console.log(`    Files importing ${PKG_FILTER}:`);
          for (const rf of f.relatedFiles.slice(0, 8)) {
            console.log(`      ${C.dim}${rf}${C.reset}`);
          }
          if (f.relatedFiles.length > 8) {
            console.log(`      ${C.dim}… and ${f.relatedFiles.length - 8} more${C.reset}`);
          }
        }
      }
    }
  }

  // ── Summary ──
  const line = '─'.repeat(64);
  console.log(`\n${C.dim}${line}${C.reset}`);
  console.log(`${C.bold}  Summary${C.reset}`);
  console.log(`  Files walked: ${C.bold}${totalFiles}${C.reset}`);
  if (MODE !== 'radar') {
    let unsupportedCount = 0;
    let defectiveCount = 0;
    let deprecatedCount = 0;
    for (const f of allFenceFindings) {
      if (f.signal.lifecycleState === 'UNSUPPORTED_REMOVED') unsupportedCount++;
      else if (f.signal.lifecycleState === 'BROKEN_DEFECTIVE') defectiveCount++;
      else if (f.signal.lifecycleState === 'DEPRECATED') deprecatedCount++;
    }
    console.log(`  ${C.red}Fence violations: ${C.bold}${totalFence}${C.reset}`);
    console.log(
      `    ${C.red}Lethal/Removed: ${unsupportedCount}${C.reset} · ` +
      `    ${C.yellow}Defective/Broken: ${defectiveCount}${C.reset} · ` +
      `    ${C.dim}Deprecated: ${deprecatedCount}${C.reset}`
    );
  }
  if (MODE !== 'fence') {
    console.log(`  ${C.cyan}Radar unadopted capabilities: ${C.bold}${totalRadar}${C.reset}`);
  }
  if (totalFence === 0 && totalRadar === 0) {
    console.log(`  ${C.green}✓ No findings.${C.reset}`);
  }
  console.log('');
}

main().catch(err => {
  console.error('\x1b[31m' + err.message + '\x1b[0m');
  process.exit(1);
});
