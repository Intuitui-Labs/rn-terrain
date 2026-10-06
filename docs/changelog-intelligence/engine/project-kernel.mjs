import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data/packages');

/**
 * Compare two semver-like version strings (supports pre-releases like 58.0.0-beta, rc.0, etc.)
 * Returns:
 *   1 if v1 > v2
 *  -1 if v1 < v2
 *   0 if v1 === v2
 */
export function compareSemver(v1, v2) {
  if (!v1 || !v2) return 0;
  if (v1 === v2) return 0;

  // Clean prefixes (e.g. ^, ~, v)
  const clean1 = v1.replace(/^[~^v]/, '');
  const clean2 = v2.replace(/^[~^v]/, '');

  const [main1, pre1] = clean1.split('-');
  const [main2, pre2] = clean2.split('-');

  const parts1 = main1.split('.').map((n) => parseInt(n, 10) || 0);
  const parts2 = main2.split('.').map((n) => parseInt(n, 10) || 0);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] ?? 0;
    const p2 = parts2[i] ?? 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }

  // Pre-release checks: a version with pre-release is LOWER than one without
  if (pre1 && !pre2) return -1;
  if (!pre1 && pre2) return 1;
  if (pre1 && pre2) {
    return pre1.localeCompare(pre2);
  }

  return 0;
}

/**
 * Project the 5-state sliding kernel for a given package and target version.
 *
 * @param {string} packageName
 * @param {string} targetVersion
 * @returns {object} { package, version, kernel: { REMOVED, DEPRECATED, FUNCTIONAL, NEW, EXPERIMENTAL } }
 */
export function projectKernel(packageName, targetVersion) {
  const filePath = path.join(DATA_DIR, `${packageName}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Package definition not found in registry: ${packageName}`);
  }

  const pkgData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const kernel = {
    REMOVED: [],
    DEPRECATED: [],
    BROKEN: [],
    FUNCTIONAL: [],
    NEW: [],
    EXPERIMENTAL: [],
  };

  const features = pkgData.features || {};

  for (const [featureId, feat] of Object.entries(features)) {
    const ms = feat.transition_milestones || {};
    const item = {
      id: featureId,
      display: feat.display,
      rules: feat.rules || {},
      code_smell: feat.code_smell || null,
      severity: feat.impact_severity || 'MEDIUM',
    };

    // State 1: REMOVED (Fatal)
    if (ms.removed && compareSemver(targetVersion, ms.removed) >= 0) {
      kernel.REMOVED.push(item);
      continue;
    }

    // State 2: DEPRECATED (Warning)
    if (ms.deprecated && compareSemver(targetVersion, ms.deprecated) >= 0) {
      kernel.DEPRECATED.push(item);
      continue;
    }

    // State 3: BROKEN (Regressed / Defective in target version)
    if (
      ms.broken &&
      compareSemver(targetVersion, ms.broken) >= 0 &&
      (!ms.fixed || compareSemver(targetVersion, ms.fixed) < 0)
    ) {
      kernel.BROKEN.push({
        ...item,
        broken_in: ms.broken,
        fixed_in: ms.fixed || 'unresolved',
        dev_dance: feat.rules?.dev_dance || null,
        decommission_at: feat.rules?.decommission_at || ms.fixed || null,
      });
      continue;
    }

    // State 5: NEW (Added in current major/minor cycle)
    if (ms.added && compareSemver(targetVersion, ms.added) >= 0) {
      const vClean = targetVersion.replace(/^[~^v]/, '');
      const addedClean = ms.added.replace(/^[~^v]/, '');
      const [targetMajor, targetMinor] = vClean.split('.');
      const [addedMajor, addedMinor] = addedClean.split('.');

      if (targetMajor === addedMajor && targetMinor === addedMinor) {
        kernel.NEW.push(item);
      } else {
        // State 4: FUNCTIONAL (Established standard)
        kernel.FUNCTIONAL.push(item);
      }
      continue;
    }

    // State 6: EXPERIMENTAL / HORIZON
    if (
      (ms.experimental && compareSemver(targetVersion, ms.experimental) >= 0) ||
      (ms.added && compareSemver(targetVersion, ms.added) < 0)
    ) {
      kernel.EXPERIMENTAL.push({
        ...item,
        expected_in: ms.added || 'upcoming',
      });
      continue;
    }
  }

  return {
    package: packageName,
    target_version: targetVersion,
    vendor: pkgData.vendor,
    category: pkgData.category,
    kernel,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Combo query helper (P1 — exposed for --check and --combo modes)
// ─────────────────────────────────────────────────────────────────────────────
const COMBOS_PATH = path.resolve(__dirname, '../data/compat/combos.json');
let _combosCache = null;
function loadCombos() {
  if (_combosCache) return _combosCache;
  if (!fs.existsSync(COMBOS_PATH)) return (_combosCache = []);
  try { _combosCache = JSON.parse(fs.readFileSync(COMBOS_PATH, 'utf8')).combos || []; }
  catch { _combosCache = []; }
  return _combosCache;
}

const INDEX_PATH = path.resolve(__dirname, '../graph/INDEX.json');
let _cascadesCache = null;
function loadCascades() {
  if (_cascadesCache) return _cascadesCache;
  if (!fs.existsSync(INDEX_PATH)) return (_cascadesCache = []);
  try { _cascadesCache = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8')).cascades || []; }
  catch { _cascadesCache = []; }
  return _cascadesCache;
}

/**
 * Fuzzy-match a combo record's range against a semver version.
 * Supports: "4.6.x", "4.6.0", "3.x", ">= 0.86", "0.86–0.88" patterns.
 */
function rangeMatchesVersion(range, version) {
  if (!range || !version) return false;
  const r = range.trim().toLowerCase();
  const v = version.trim().replace(/^[~^v]/, '');
  // Exact
  if (r === v) return true;
  // Wildcard: "4.6.x" or "4.x" or "3.x"
  if (r.includes('x')) {
    const prefix = r.replace(/\.x.*$/, '').replace(/x$/, '');
    return v.startsWith(prefix);
  }
  // Range "3.x" — major only
  if (/^\d+\.x$/.test(r)) {
    return v.startsWith(r.replace('.x', '.'));
  }
  // Comparison prefixes: ">= 4.0.0", ">=4.0.0", "<=0.86", ">0.80", "<3.0.0"
  const gteMatch = r.match(/^(?:>=|≥)\s*(\d+(?:\.\d+)*)/);
  if (gteMatch) {
    return compareSemver(v, gteMatch[1]) >= 0;
  }
  const lteMatch = r.match(/^(?:<=|≤)\s*(\d+(?:\.\d+)*)/);
  if (lteMatch) {
    return compareSemver(v, lteMatch[1]) <= 0;
  }
  const gtMatch = r.match(/^>\s*(\d+(?:\.\d+)*)/);
  if (gtMatch) {
    return compareSemver(v, gtMatch[1]) > 0;
  }
  const ltMatch = r.match(/^<\s*(\d+(?:\.\d+)*)/);
  if (ltMatch) {
    return compareSemver(v, ltMatch[1]) < 0;
  }
  // "0.86-0.88" or "0.86–0.88"
  const dashRange = r.match(/^(\d+\.\d+)[–\-](\d+\.\d+)$/);
  if (dashRange) {
    const [, lo, hi] = dashRange;
    return compareSemver(v, lo) >= 0 && compareSemver(v, hi) <= 0;
  }
  return false;
}

/**
 * queryCombo — P1 cross-dep collision query.
 * Returns all BROKE combos where the installed version pair matches any record.
 */
export function queryCombo(pkgA, versionA, pkgB, versionB) {
  const combos = loadCombos();
  return combos.filter(c => {
    const aMatchesA = (c.package_a||'').toLowerCase().includes(pkgSlugShort(pkgA)) && rangeMatchesVersion(c.range_a, versionA);
    const bMatchesB = pkgB ? (c.package_b||'').toLowerCase().includes(pkgSlugShort(pkgB)) && (versionB ? rangeMatchesVersion(c.range_b, versionB) : true) : true;
    const reversed  = (c.package_b||'').toLowerCase().includes(pkgSlugShort(pkgA)) && rangeMatchesVersion(c.range_b, versionA);
    return (aMatchesA && bMatchesB) || reversed;
  });
}

function pkgSlugShort(name) {
  if (!name) return '';
  const MAP = {
    'react-native-gesture-handler': 'rngh',
    'react-native-reanimated': 'reanimated',
    'react-native-worklets': 'worklets',
    'react-native-nitro-modules': 'nitro',
    'react-native': 'rn',
    '@gorhom/bottom-sheet': 'bottom-sheet',
    'bottom-sheet': 'bottom-sheet',
  };
  return MAP[name] || name.split('-').pop().toLowerCase();
}

/**
 * checkProject — P0 live package.json audit.
 * Reads deps from packageJsonPath, projects each known package, and surfaces
 * BROKEN signals + BROKE combos. Returns { issues, breakingCount }.
 */
export function checkProject(packageJsonPath) {
  const resolved = path.resolve(packageJsonPath || 'package.json');
  if (!fs.existsSync(resolved)) {
    throw new Error(`package.json not found: ${resolved}`);
  }
  const pkg = JSON.parse(fs.readFileSync(resolved, 'utf8'));
  const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

  // Map of package-name -> cleaned installed version
  const installed = {};
  for (const [name, ver] of Object.entries(allDeps)) {
    installed[name] = ver.replace(/^[~^]/, '').split(' ')[0]; // strip range prefix
  }

  // Enumerate known shards
  const shardDir = path.resolve(__dirname, '../data/packages');
  const knownPkgs = fs.readdirSync(shardDir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));

  const issues = [];   // { severity, pkg, version, kind, title, detail, source_url }
  let breakingCount = 0;

  // Phase A: per-package kernel projection
  for (const pkgName of knownPkgs) {
    const installedVersion = installed[pkgName];
    if (!installedVersion) continue;

    let result;
    try { result = projectKernel(pkgName, installedVersion); }
    catch { continue; }

    for (const feat of result.kernel.BROKEN) {
      const sev = feat.severity || 'HIGH';
      if (sev === 'CRITICAL' || sev === 'HIGH') breakingCount++;
      issues.push({
        severity: sev,
        pkg: pkgName,
        version: installedVersion,
        kind: 'BROKEN_SIGNAL',
        title: feat.display,
        detail: feat.dev_dance
          ? `Dev dance: ${feat.dev_dance}${feat.decommission_at ? ` (remove at ${feat.decommission_at})` : ''}`
          : `Born: ${feat.broken_in} | Fixed: ${feat.fixed_in}`,
        source_url: feat._chronos_meta?.source_url || null,
      });
    }

    for (const feat of result.kernel.REMOVED) {
      breakingCount++;
      issues.push({
        severity: 'CRITICAL',
        pkg: pkgName,
        version: installedVersion,
        kind: 'REMOVED_API',
        title: feat.display,
        detail: `Removed. Replace with: ${feat.rules?.replacement || 'see docs'}`,
        source_url: null,
      });
    }
  }

  // Phase B: cross-dep collision check (BROKE combos)
  const combos = loadCombos().filter(c => c.status === 'BROKE');
  const checkedPairs = new Set();
  for (const c of combos) {
    const pkgA = findInstalledMatch(c.package_a, installed);
    const pkgB = findInstalledMatch(c.package_b, installed);
    if (!pkgA || !pkgB) continue;
    const pairKey = `${pkgA.name}@${pkgA.ver}+${pkgB.name}@${pkgB.ver}`;
    if (checkedPairs.has(pairKey)) continue;
    checkedPairs.add(pairKey);

    const aMatch = rangeMatchesVersion(c.range_a, pkgA.ver);
    const bMatch = rangeMatchesVersion(c.range_b, pkgB.ver);
    if (aMatch && bMatch) {
      breakingCount++;
      issues.push({
        severity: 'CRITICAL',
        pkg: `${pkgA.name} + ${pkgB.name}`,
        version: `${pkgA.ver} + ${pkgB.ver}`,
        kind: 'BROKE_COMBO',
        title: c.title,
        detail: c.what_broke || c.forces_or_breaks || '(see source)',
        source_url: c.source_url || null,
      });
    }
  }

  // Phase C: Downstream Cascade Graph Evaluation (Deep Multi-hop Traversal)
  const cascades = loadCascades();
  const cascadeIssues = [];
  const evaluatedCascades = new Set();
  const queue = [];

  // Initial enqueue: seed the queue with cascades triggered directly by installed packages
  for (const cas of cascades) {
    const [fromPkg, fromVerRange] = cas.from.split('@');
    const installedFrom = findInstalledMatch(fromPkg, installed);
    
    if (installedFrom && (!fromVerRange || rangeMatchesVersion(fromVerRange, installedFrom.ver))) {
      queue.push({ cas, sourcePkg: installedFrom.name, sourceVer: installedFrom.ver, depth: 1, path: installedFrom.name });
    }
  }

  // Breadth-first deep traversal
  while (queue.length > 0) {
    const { cas, sourcePkg, sourceVer, depth, path } = queue.shift();
    const cascadeId = `${cas.from}->${cas.to}:${cas.relationship}`;
    
    // Prevent infinite loops
    if (evaluatedCascades.has(cascadeId)) continue;
    evaluatedCascades.add(cascadeId);
    
    const toPkg = cas.to.split('@')[0];
    const toVerRange = cas.to.split('@')[1];
    const installedTo = findInstalledMatch(toPkg, installed);
    const issuePath = `${path} -> ${toPkg}`;

    if (cas.relationship === 'REQUIRES_PEER') {
      if (!installedTo) {
        breakingCount++;
        cascadeIssues.push({
          severity: 'CRITICAL',
          pkg: issuePath,
          version: sourceVer,
          kind: 'MISSING_PEER_CASCADE',
          title: `Deep cascade missing peer: ${toPkg} (Depth: ${depth})`,
          detail: cas.detail || `Upgrading to ${cas.from} mandates installing ${cas.to}`,
          source_url: null,
        });
      } else if (toVerRange && !rangeMatchesVersion(toVerRange, installedTo.ver)) {
        breakingCount++;
        cascadeIssues.push({
          severity: 'CRITICAL',
          pkg: issuePath,
          version: `${sourceVer} vs ${installedTo.ver}`,
          kind: 'INCOMPATIBLE_PEER_CASCADE',
          title: `Deep cascade incompatible peer range: requires ${cas.to} (Depth: ${depth})`,
          detail: cas.detail || `Peer version mismatch`,
          source_url: null,
        });
      }
    } else if (cas.relationship === 'FORCES_UPGRADE') {
      if (installedTo) {
        cascadeIssues.push({
          severity: 'HIGH',
          pkg: issuePath,
          version: `${sourceVer} + ${installedTo.ver}`,
          kind: 'DOWNSTREAM_CASCADE',
          title: `Deep downstream upgrade forced: ${installedTo.name} (Depth: ${depth})`,
          detail: cas.detail || `Upgrading ${sourcePkg} forces upgrade of ${toPkg}`,
          source_url: null,
        });
        
        // Enqueue next level cascades from the forced upgrade target (simulate cascade)
        for (const nextCas of cascades) {
            const [nextFromPkg, nextFromVerRange] = nextCas.from.split('@');
            if (nextFromPkg === toPkg && (!nextFromVerRange || rangeMatchesVersion(nextFromVerRange, toVerRange || 'latest'))) {
                queue.push({ cas: nextCas, sourcePkg: toPkg, sourceVer: toVerRange || 'latest', depth: depth + 1, path: issuePath });
            }
        }
      }
    } else if (cas.relationship === 'CONFLICTS_WITH') {
      if (installedTo) {
        breakingCount++;
        cascadeIssues.push({
          severity: 'CRITICAL',
          pkg: issuePath,
          version: `${sourceVer} + ${installedTo.ver}`,
          kind: 'CONFLICT_CASCADE',
          title: `Deep dependency conflict: ${sourcePkg} with ${installedTo.name} (Depth: ${depth})`,
          detail: cas.detail || `Conflicting packages installed`,
          source_url: null,
        });
      }
    } else if (cas.relationship === 'REQUIRES_NEW_ARCH' || cas.relationship === 'REQUIRES_ROOT_CONTAINER') {
        cascadeIssues.push({
          severity: cas.relationship === 'REQUIRES_NEW_ARCH' ? 'CRITICAL' : 'HIGH',
          pkg: issuePath,
          version: sourceVer,
          kind: 'ARCHITECTURAL_CASCADE',
          title: `Architectural cascade: ${cas.relationship} (Depth: ${depth})`,
          detail: cas.detail || `Requires architectural change in ${toPkg}`,
          source_url: null,
        });
    }
  }

  issues.push(...cascadeIssues);

  // Sort: CRITICAL first, then HIGH, then MEDIUM/LOW
  const ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  issues.sort((a, b) => (ORDER[a.severity] ?? 9) - (ORDER[b.severity] ?? 9));

  return { issues, breakingCount, packageJsonPath: resolved, installedCount: Object.keys(installed).length };
}

function findInstalledMatch(rawPkgName, installed) {
  if (!rawPkgName) return null;
  const slug = rawPkgName.toLowerCase();
  for (const [name, ver] of Object.entries(installed)) {
    if (name.toLowerCase().includes(slug) || slug.includes(name.toLowerCase().split('/').pop())) {
      return { name, ver };
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI invocation support
// ─────────────────────────────────────────────────────────────────────────────
const isDirectRun = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('project-kernel.mjs');
if (isDirectRun) {
  const args = process.argv.slice(2);
  const CHECK_MODE   = args.includes('--check');
  const EXIT_CODE    = args.includes('--exit-code');
  const COMBO_MODE   = args.includes('--combo');
  const VERBOSE      = args.includes('--verbose') || args.includes('-v');

  const C = {
    reset:'\x1b[0m', bold:'\x1b[1m', dim:'\x1b[2m',
    red:'\x1b[31m', green:'\x1b[32m', yellow:'\x1b[33m',
    cyan:'\x1b[36m', magenta:'\x1b[35m', blue:'\x1b[34m',
  };

  // ── --check mode (P0) ──────────────────────────────────────────────────────
  if (CHECK_MODE) {
    const pkgJsonPath = args.find(a => !a.startsWith('--') && a.includes('package.json')) || 'package.json';
    console.log(`\n${C.bold}${C.cyan}TCDI Live Check${C.reset} — ${pkgJsonPath}\n`);

    let result;
    try { result = checkProject(pkgJsonPath); }
    catch (err) { console.error(`${C.red}Error: ${err.message}${C.reset}`); process.exit(1); }

    const { issues, breakingCount, installedCount } = result;

    console.log(`${C.dim}Scanned ${installedCount} installed packages against TCDI signal corpus${C.reset}\n`);

    if (issues.length === 0) {
      console.log(`${C.green}+ No known broken signals or combo collisions detected.${C.reset}\n`);
    } else {
      for (const issue of issues) {
        const sevColor = issue.severity === 'CRITICAL' ? C.red : issue.severity === 'HIGH' ? C.yellow : C.dim;
        const kindIcon = issue.kind === 'BROKE_COMBO' ? '💥' : issue.kind === 'REMOVED_API' ? '🚫' : '⚠️';
        console.log(`${sevColor}${kindIcon} [${issue.severity}] ${issue.pkg}@${issue.version}${C.reset}`);
        console.log(`   ${C.bold}${issue.title}${C.reset}`);
        if (issue.detail) console.log(`   ${C.dim}${issue.detail}${C.reset}`);
        if (VERBOSE && issue.source_url) console.log(`   ${C.blue}${issue.source_url}${C.reset}`);
        console.log('');
      }

      console.log(`${C.dim}${'─'.repeat(64)}${C.reset}`);
      const critCount = issues.filter(i => i.severity === 'CRITICAL').length;
      const highCount = issues.filter(i => i.severity === 'HIGH').length;
      console.log(`${C.bold}Summary: ${issues.length} issues — ${C.red}${critCount} CRITICAL${C.reset}${C.bold}, ${C.yellow}${highCount} HIGH${C.reset}`);
      if (EXIT_CODE && breakingCount > 0) {
        console.log(`\n${C.red}--exit-code: exiting 1 (${breakingCount} breaking issues)${C.reset}\n`);
        process.exit(1);
      }
    }
  }

  // ── --combo mode (P1) ──────────────────────────────────────────────────────
  else if (COMBO_MODE) {
    // Usage: node project-kernel.mjs --combo pkg1@v1 pkg2@v2
    const comboArgs = args.filter(a => !a.startsWith('--'));
    if (comboArgs.length < 1) {
      console.error('Usage: --combo <pkg@version> [<pkg@version>]');
      process.exit(1);
    }
    const [pA, vA] = (comboArgs[0] || '').split('@');
    const [pB, vB] = (comboArgs[1] || '@').split('@');

    console.log(`\n${C.bold}${C.cyan}TCDI Combo Query${C.reset}: ${pA}@${vA} + ${pB || '(any)'}@${vB || '(any)'}\n`);
    const combos = loadCombos();
    const hits = combos.filter(c => {
      const aMatch = (c.package_a||'').toLowerCase().includes(pkgSlugShort(pA)) && (vA ? rangeMatchesVersion(c.range_a, vA) : true);
      const bMatch = pB ? (c.package_b||'').toLowerCase().includes(pkgSlugShort(pB)) && (vB ? rangeMatchesVersion(c.range_b, vB) : true) : true;
      return aMatch && bMatch;
    });

    if (hits.length === 0) {
      console.log(`${C.green}No known combos found for this pair.${C.reset}\n`);
    } else {
      for (const c of hits) {
        const icon = c.status === 'GOOD' ? `${C.green}✅ GOOD` : `${C.red}💥 BROKE`;
        console.log(`${icon}${C.reset} ${c.title}`);
        if (c.what_broke) console.log(`   What broke: ${c.what_broke}`);
        if (c.forces_or_breaks) console.log(`   ${C.dim}${c.forces_or_breaks}${C.reset}`);
        if (c.source_url) console.log(`   ${C.blue}${c.source_url}${C.reset}`);
        if (c.chronos_note) console.log(`   ${C.yellow}Note: ${c.chronos_note}${C.reset}`);
        console.log('');
      }
    }
  }

  // ── Single-package projection mode (original) ─────────────────────────────
  else {
    const pkgArg = args.find(a => !a.startsWith('--')) || 'expo-router';
    const verArg = args.filter(a => !a.startsWith('--'))[1] || '57.0.22';

    console.log(`\n${C.cyan}Projecting Kernel${C.reset} for ${C.bold}${pkgArg}${C.reset} @ ${verArg}...\n`);
    const result = projectKernel(pkgArg, verArg);

    console.log('================================================================');
    console.log(` PACKAGE: ${result.package} (Target: ${result.target_version})`);
    console.log(` VENDOR:  ${result.vendor} | CATEGORY: ${result.category}`);
    console.log('================================================================\n');

    console.log(`🚫 [REMOVED] (${result.kernel.REMOVED.length})`);
    result.kernel.REMOVED.forEach((f) => console.log(`   - ${f.display} (${f.severity})`));

    console.log(`\n⚠️  [DEPRECATED] (${result.kernel.DEPRECATED.length})`);
    result.kernel.DEPRECATED.forEach((f) => console.log(`   - ${f.display} (${f.severity})`));

    console.log(`\n💥 [BROKEN / REGRESSED] (${result.kernel.BROKEN.length})`);
    result.kernel.BROKEN.forEach((f) => console.log(`   - ${f.display} [broken in ${f.broken_in}, fixed in ${f.fixed_in}]\n     Dev Dance: ${f.dev_dance || 'No documented workaround'}`));

    console.log(`\n✅ [FUNCTIONAL] (${result.kernel.FUNCTIONAL.length})`);
    result.kernel.FUNCTIONAL.forEach((f) => console.log(`   - ${f.display}`));

    console.log(`\n💎 [NEW] (${result.kernel.NEW.length})`);
    result.kernel.NEW.forEach((f) => console.log(`   - ${f.display} -> ${f.rules?.benefit || f.rules?.replaces_custom_code || ''}`));

    console.log(`\n🔭 [EXPERIMENTAL / HORIZON] (${result.kernel.EXPERIMENTAL.length})`);
    result.kernel.EXPERIMENTAL.forEach((f) => console.log(`   - ${f.display} (expected in: ${f.expected_in})`));

    console.log('\n================================================================\n');
  }
}
