#!/usr/bin/env node
/**
 * tool-bridge.mjs — TCDI External Tool Integration Adapter
 * ──────────────────────────────────────────────────────────────────────────────
 * Integrates three external tool surfaces as enrichment sources for TCDI:
 *
 *   1. @rnx-kit/align-deps (child-process spawn, parse stdout)
 *      → Surfaces "misaligned" packages per the Microsoft RN preset.
 *        TCDI enriches these with temporal signal context (was it always wrong,
 *        or did it regress at a specific version?).
 *
 *   2. React Native Directory API (https://reactnative.directory/api/libraries)
 *      → New Architecture support status per package.
 *        TCDI uses this to annotate shards with `new_arch_status`.
 *
 *   3. Expo bundledNativeModules.json (https://unpkg.com/expo@<version>/bundledNativeModules.json)
 *      → Authoritative SDK pin for each version — already in Expo chronology leaves.
 *        Adapter provides a live fetch for any SDK version on demand.
 *
 * Usage:
 *   node tool-bridge.mjs --rnx [package.json path]
 *   node tool-bridge.mjs --rn-directory react-native-reanimated
 *   node tool-bridge.mjs --expo-pins 57.0.24
 *   node tool-bridge.mjs --enrich [package.json path]   ← all three + TCDI --check
 *
 * Design principle: Each adapter is a pure function. No writes to TCDI shards unless
 * --write is passed. Enrichment results are printed as structured JSON by default.
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync, spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENGINE    = path.resolve(__dirname, '../engine/project-kernel.mjs');
const DATA_DIR  = path.resolve(__dirname, '../data/packages');

const args    = process.argv.slice(2);
const WRITE   = args.includes('--write');
const JSON_OUT = args.includes('--json');

const C = {
  reset:'\x1b[0m', bold:'\x1b[1m', dim:'\x1b[2m',
  red:'\x1b[31m', green:'\x1b[32m', yellow:'\x1b[33m',
  cyan:'\x1b[36m', blue:'\x1b[34m',
};
const log = {
  head: (m) => console.log(`\n${C.bold}${C.cyan}>> ${m}${C.reset}`),
  ok:   (m) => console.log(`${C.green}+${C.reset}  ${m}`),
  warn: (m) => console.log(`${C.yellow}!${C.reset}  ${m}`),
  info: (m) => console.log(`${C.dim}   ${m}${C.reset}`),
  err:  (m) => console.error(`${C.red}✗${C.reset}  ${m}`),
};

// ── Adapter 1: @rnx-kit/align-deps ──────────────────────────────────────────
/**
 * Runs @rnx-kit/align-deps --check against a package.json and parses the output.
 * Returns an array of { pkg, installed, expected, severity } objects.
 *
 * align-deps does NOT expose a stable JSON API so we parse its stdout.
 * Format is stable enough across 4.x: "  react-native-reanimated@4.1.0 → 4.5.x"
 */
export async function runAlignDeps(packageJsonPath = 'package.json') {
  const resolved = path.resolve(packageJsonPath);
  if (!fs.existsSync(resolved)) throw new Error(`package.json not found: ${resolved}`);

  log.head('Adapter 1: @rnx-kit/align-deps');
  log.info(`Checking: ${resolved}`);

  // Detect if rnx-kit is installed locally or needs npx
  const rnxBin = findBin('@rnx-kit/align-deps', 'align-deps');
  const cmd    = rnxBin ? `node "${rnxBin}"` : 'npx --yes @rnx-kit/align-deps@latest';

  let stdout = '';
  try {
    const result = spawnSync(
      'node',
      [rnxBin || require.resolve('@rnx-kit/align-deps/bin')],
      {
        cwd: path.dirname(resolved),
        env: { ...process.env },
        encoding: 'utf8',
        timeout: 30000,
      }
    );
    stdout = (result.stdout || '') + (result.stderr || '');
  } catch {
    // Fall back to npx
    try {
      stdout = execSync(`npx --yes @rnx-kit/align-deps@latest --check`, {
        cwd: path.dirname(resolved),
        encoding: 'utf8',
        timeout: 60000,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (e) {
      stdout = (e.stdout || '') + (e.stderr || '');
    }
  }

  // Parse misaligned packages from stdout
  // align-deps outputs lines like:
  //   warn: react-native-reanimated: 4.1.0 is not aligned; expected: ^4.5.0
  //   error: react-native@0.87.1 is incompatible with preset; expected: >=0.86.0
  const misaligned = [];
  const lines = stdout.split('\n');
  for (const line of lines) {
    const m = line.match(/(?:warn|error):\s*([\w@/-]+)[@:]?\s*([\d.]+).*?expected:?\s*([^\s,]+)/i);
    if (m) {
      misaligned.push({ pkg: m[1].replace(/:$/, ''), installed: m[2], expected: m[3] });
    }
  }

  if (misaligned.length === 0 && stdout.includes('No issues found')) {
    log.ok('align-deps: No misaligned packages.');
  } else if (misaligned.length > 0) {
    log.warn(`align-deps: ${misaligned.length} misaligned packages`);
    for (const m of misaligned) {
      log.info(`${m.pkg}: ${m.installed} → expected ${m.expected}`);
    }
  } else {
    log.info('align-deps output (raw, project may not have rnx-kit config):');
    log.info(stdout.slice(0, 400));
  }

  return { tool: 'rnx-align-deps', misaligned, rawOutput: stdout };
}

// ── Adapter 2: React Native Directory API ────────────────────────────────────
/**
 * Queries the public React Native Directory API for a package's New Architecture status.
 * Returns { newArchitecture, unmaintained, exampleApp, github, score }
 *
 * API: https://reactnative.directory/api/libraries?search=<pkg>
 */
export async function queryRNDirectory(pkgName) {
  log.head(`Adapter 2: React Native Directory — ${pkgName}`);

  const url = `https://reactnative.directory/api/libraries?search=${encodeURIComponent(pkgName)}&limit=5`;
  log.info(`GET ${url}`);

  let data;
  try {
    // Node 18+ has native fetch
    const res  = await fetch(url, { headers: { 'Accept': 'application/json' }, signal: AbortSignal.timeout(10000) });
    data = await res.json();
  } catch (err) {
    log.err(`RN Directory fetch failed: ${err.message}`);
    return null;
  }

  const libs = data.libraries || [];
  const exact = libs.find(l => l.npmPkg === pkgName) || libs[0];
  if (!exact) {
    log.warn(`Package not found in RN Directory: ${pkgName}`);
    return null;
  }

  const result = {
    tool: 'rn-directory',
    pkg: pkgName,
    npmPkg: exact.npmPkg,
    newArchitecture: exact.newArchitecture ?? null,
    unmaintained: exact.unmaintained ?? false,
    github: exact.github?.name ?? null,
    score: exact.score ?? null,
    expoGo: exact.expoGo ?? null,
  };

  const newArchTag = result.newArchitecture
    ? `${C.green}✅ New Arch${C.reset}`
    : result.newArchitecture === false
      ? `${C.red}✗ Old Arch only${C.reset}`
      : `${C.yellow}? unknown${C.reset}`;
  const maintTag = result.unmaintained ? `${C.red} [UNMAINTAINED]${C.reset}` : '';
  log.ok(`${pkgName}: ${newArchTag}${maintTag} | score: ${result.score ?? 'n/a'}`);

  return result;
}

// ── Adapter 3: Expo bundledNativeModules ─────────────────────────────────────
/**
 * Fetches the authoritative SDK dependency pins from unpkg for any Expo version.
 * Returns the bundledNativeModules.json object.
 */
export async function fetchExpoPins(expoVersion) {
  log.head(`Adapter 3: Expo bundledNativeModules — expo@${expoVersion}`);
  const url = `https://unpkg.com/expo@${expoVersion}/bundledNativeModules.json`;
  log.info(`GET ${url}`);

  try {
    const res  = await fetch(url, { headers: { 'Accept': 'application/json' }, signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const pins = await res.json();
    log.ok(`Fetched ${Object.keys(pins).length} pins for expo@${expoVersion}`);
    return { tool: 'expo-bundled-pins', version: expoVersion, pins };
  } catch (err) {
    log.err(`Failed to fetch Expo pins: ${err.message}`);
    return null;
  }
}

// ── Combined --enrich mode ───────────────────────────────────────────────────
/**
 * Full enrichment pipeline: runs TCDI --check + all adapters, merges into one report.
 */
async function runEnrich(packageJsonPath) {
  const pkgJson = JSON.parse(fs.readFileSync(path.resolve(packageJsonPath || 'package.json'), 'utf8'));
  const deps    = { ...(pkgJson.dependencies || {}), ...(pkgJson.devDependencies || {}) };

  log.head('TCDI Full Enrichment Pipeline');

  // 1. TCDI core check (via child process since we need to re-import)
  log.head('Phase 1: TCDI Core Check');
  const tcdiOut = spawnSync('node', [ENGINE, '--check', path.resolve(packageJsonPath || 'package.json'), '--verbose'], {
    encoding: 'utf8', timeout: 15000,
  });
  console.log(tcdiOut.stdout || '');
  if (tcdiOut.stderr) log.err(tcdiOut.stderr);

  // 2. RN Directory status for all installed packages
  log.head('Phase 2: React Native Directory — New Arch Status');
  const RN_PKGS = Object.keys(deps).filter(d => d.startsWith('react-native') || d.startsWith('expo-'));
  const directoryResults = [];
  for (const pkg of RN_PKGS.slice(0, 8)) { // cap to avoid rate limiting
    const r = await queryRNDirectory(pkg);
    if (r) directoryResults.push(r);
    await new Promise(r => setTimeout(r, 200)); // gentle throttle
  }

  // 3. Expo pins if expo is installed
  let expoPins = null;
  const expoVer = (deps['expo'] || '').replace(/^[~^]/, '').split(' ')[0];
  if (expoVer) expoPins = await fetchExpoPins(expoVer);

  // 4. Merge: for any RN Directory result where newArchitecture=false but we have it
  //    in TCDI as FUNCTIONAL, surface the discrepancy
  const discrepancies = [];
  for (const d of directoryResults) {
    if (d.newArchitecture === false) {
      const shardPath = path.join(DATA_DIR, `${d.pkg}.json`);
      if (fs.existsSync(shardPath)) {
        const shard = JSON.parse(fs.readFileSync(shardPath, 'utf8'));
        // Check if we have a REMOVED feature for Bridge/Paper
        const hasNewArchSignal = Object.values(shard.features || {}).some(f =>
          (f.display || '').toLowerCase().includes('paper') ||
          (f.display || '').toLowerCase().includes('bridge') ||
          (f.display || '').toLowerCase().includes('new arch')
        );
        if (!hasNewArchSignal) {
          discrepancies.push({
            pkg: d.pkg,
            issue: 'RN Directory says Old Arch only, but TCDI has no New Arch signal — consider adding one',
          });
        }
      }
    }
  }

  // 5. Summary report
  log.head('Enrichment Summary');

  if (expoPins) {
    console.log(`\n${C.bold}Expo ${expoVer} SDK Pins (authoritative):${C.reset}`);
    for (const [p, v] of Object.entries(expoPins.pins).slice(0, 8)) {
      const installedVer = (deps[p] || '').replace(/^[~^]/, '');
      const matches = installedVer && installedVer.startsWith(v.replace(/[~^*]/g, '').split('.').slice(0,2).join('.'));
      const icon = !installedVer ? `${C.dim}(not installed)` : matches ? `${C.green}✓` : `${C.yellow}⚠ installed: ${installedVer}`;
      console.log(`  ${p}: ${C.bold}${v}${C.reset}  ${icon}${C.reset}`);
    }
  }

  if (discrepancies.length > 0) {
    console.log(`\n${C.yellow}TCDI Shard Gaps detected:${C.reset}`);
    for (const d of discrepancies) log.warn(`${d.pkg}: ${d.issue}`);
  }

  if (JSON_OUT) {
    console.log(JSON.stringify({ directoryResults, expoPins, discrepancies }, null, 2));
  }
}

// ── Binary finder helper ──────────────────────────────────────────────────────
function findBin(pkg, binName) {
  try {
    const pkgDir = path.dirname(require.resolve(`${pkg}/package.json`));
    const candidate = path.join(pkgDir, 'bin', binName);
    return fs.existsSync(candidate) ? candidate : null;
  } catch { return null; }
}

// ── CLI dispatch ──────────────────────────────────────────────────────────────
const RNX_MODE  = args.includes('--rnx');
const RND_MODE  = args.includes('--rn-directory');
const EXPO_MODE = args.includes('--expo-pins');
const ENRICH    = args.includes('--enrich');

(async () => {
  try {
    if (RNX_MODE) {
      const pkgPath = args.find(a => !a.startsWith('--')) || 'package.json';
      await runAlignDeps(pkgPath);

    } else if (RND_MODE) {
      const pkg = args.find(a => !a.startsWith('--'));
      if (!pkg) { log.err('Usage: --rn-directory <package-name>'); process.exit(1); }
      const r = await queryRNDirectory(pkg);
      if (JSON_OUT && r) console.log(JSON.stringify(r, null, 2));

    } else if (EXPO_MODE) {
      const ver = args.find(a => !a.startsWith('--'));
      if (!ver) { log.err('Usage: --expo-pins <expo-version>'); process.exit(1); }
      const r = await fetchExpoPins(ver);
      if (JSON_OUT && r) console.log(JSON.stringify(r, null, 2));

    } else if (ENRICH) {
      const pkgPath = args.find(a => !a.startsWith('--')) || 'package.json';
      await runEnrich(pkgPath);

    } else {
      console.log(`
${C.bold}${C.cyan}TCDI Tool Bridge${C.reset} — External Tool Integration Adapter

Usage:
  node tool-bridge.mjs --rnx [package.json]         Run @rnx-kit/align-deps
  node tool-bridge.mjs --rn-directory <pkg>          Query RN Directory API
  node tool-bridge.mjs --expo-pins <expo-version>    Fetch Expo bundled pins
  node tool-bridge.mjs --enrich [package.json]       Full enrichment pipeline

Flags:
  --json       Output results as JSON
  --write      (future) Enrich TCDI shards with findings
`);
    }
  } catch (err) {
    log.err(err.message);
    process.exit(1);
  }
})();
