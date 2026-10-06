#!/usr/bin/env node
/**
 * ingest-chronos-signals.mjs
 * TCDI Chronos Archive Ingestion Pipeline v1.0
 *
 * PURPOSE
 *   Fuses the raw Grok/Chronos archive (signals.md files + COMBOS.md) into the
 *   strongly-typed TCDI JSON shard format. Does NOT replace existing hand-curated
 *   features -- merges new signal-derived features keyed by chronos_<sNNN>.
 *
 * RESILIENCE CONTRACT
 *   - Each package is processed independently; one failure never stops others.
 *   - Parse errors are logged per-signal - not swallowed.
 *   - Dry-run mode (--dry-run) prints without touching the file system.
 *   - Idempotent: re-running merges without duplicating existing chronos_ keys.
 *
 * USAGE
 *   node docs/changelog-intelligence/scripts/ingest-chronos-signals.mjs
 *   node docs/changelog-intelligence/scripts/ingest-chronos-signals.mjs --dry-run
 *   node docs/changelog-intelligence/scripts/ingest-chronos-signals.mjs --pkg react-native-reanimated
 *   node docs/changelog-intelligence/scripts/ingest-chronos-signals.mjs --combos-only
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHARD_DIR    = path.resolve(__dirname, '../data/packages');
const COMPAT_DIR   = path.resolve(__dirname, '../data/compat');
const SCHEMA_PATH  = path.resolve(__dirname, '../schemas/package-features.schema.json');
const ARCHIVE_ROOT = 'c:/projects/rn-terrain-archive-extracted/rn-terrain';

const args        = process.argv.slice(2);
const DRY_RUN     = args.includes('--dry-run');
const COMBOS_ONLY = args.includes('--combos-only');
const PKG_FILTER  = (() => { const i = args.indexOf('--pkg'); return i !== -1 ? args[i + 1] : null; })();

const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
  cyan: '\x1b[36m', magenta: '\x1b[35m',
};
const log = {
  info:  (m) => console.log(`${C.cyan}i${C.reset}  ${m}`),
  ok:    (m) => console.log(`${C.green}+${C.reset}  ${m}`),
  warn:  (m) => console.log(`${C.yellow}!${C.reset}  ${m}`),
  error: (m) => console.error(`${C.red}X${C.reset}  ${m}`),
  head:  (m) => console.log(`\n${C.bold}${C.magenta}>> ${m}${C.reset}`),
  dim:   (m) => console.log(`${C.dim}   ${m}${C.reset}`),
};

const SCHEMA = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));

// ── signals.md parser ─────────────────────────────────────────────────────────
function parseSignalsMd(rawText, sourcePath) {
  const signals = [];
  const sections = rawText.split(/^## S\d+/m).slice(1);
  let sectionIdx = 0;
  for (const section of sections) {
    sectionIdx++;
    const signalId = `S${sectionIdx}`;
    try {
      const signal = { id: signalId };
      const titleMatch = rawText.match(new RegExp(`## S${sectionIdx}[^\\n]*[—-] ([^\\n]+)`));
      signal.title = titleMatch ? titleMatch[1].trim() : '(unknown)';
      const tableRows = [...section.matchAll(/^\|\s*`?([^|`\n]+?)`?\s*\|\s*([^|\n]+?)\s*\|/gm)];
      for (const [, field, value] of tableRows) {
        const key = field.trim().toLowerCase().replace(/-/g, '_');
        const val = value.trim();
        if (key !== 'field') signal[key] = val;
      }
      signal._parsed = parseSignalFields(signal);
      signals.push(signal);
    } catch (err) {
      log.warn(`  [${path.basename(sourcePath)}] Parse error on ${signalId}: ${err.message}`);
    }
  }
  return signals;
}

function parseSignalFields(raw) {
  const status = (raw.status || '').toLowerCase();
  const bornVersion  = extractVersion(raw.first_seen || raw.temporal || '');
  const fixedVersion = extractVersion(raw.last_seen_or_fixed_in || raw.temporal || '');
  const isFixed      = status.startsWith('fixed') || status.startsWith('wontfix');
  const isOpen       = status.startsWith('open');
  const severity     = mapSeverity(raw.severity_or_heat || raw.signal || '');
  return {
    bornVersion,
    fixedVersion: isFixed ? fixedVersion : null,
    isOpen,
    isFixed,
    severity,
    sourceUrl: raw.source_url || null,
    forcesOrBreaks: raw.forces_or_breaks || null,
    whatBroke: raw.what_broke || null,
  };
}

function extractVersion(str) {
  if (!str) return null;
  const backtick = str.match(/`(\d+\.\d+\.\d+[^`]*)`/);
  if (backtick) return backtick[1];
  const bold = str.match(/\*\*(\d+\.\d+\.\d+[^*]*)\*\*/);
  if (bold) return bold[1];
  const plain = str.match(/\b(\d+\.\d+\.\d+)\b/);
  if (plain) return plain[1];
  return null;
}

function mapSeverity(str) {
  const s = str.toLowerCase();
  if (s.includes('critical') || s.includes('sigabrt') || s.includes('sigsegv')) return 'CRITICAL';
  if (s.includes('very high') || /7[0-9] rx|3[5-9] rx/.test(s)) return 'HIGH';
  if (s.includes('high')) return 'HIGH';
  if (s.includes('medium')) return 'MEDIUM';
  if (s.includes('low')) return 'LOW';
  return 'MEDIUM';
}

// ── signals -> TCDI feature entry ─────────────────────────────────────────────
function signalToFeature(signal) {
  const p = signal._parsed;
  const featureKey = `chronos_${signal.id.toLowerCase()}`;
  const milestones = {
    experimental: null,
    added:        null,
    broken:       p.bornVersion || null,
    fixed:        p.isOpen ? null : (p.fixedVersion || null),
    deprecated:   null,
    removed:      null,
  };
  if (!p.bornVersion && !p.isOpen) { milestones.broken = null; }
  const rules = {};
  let danceParts = [];
  if (p.forcesOrBreaks) danceParts.push(`Context: ${p.forcesOrBreaks}`);
  if (p.whatBroke)      danceParts.push(`What broke: ${p.whatBroke}`);
  rules.dev_dance = danceParts.length > 0 ? danceParts.join('. ') : null;
  if (p.fixedVersion && !p.isOpen) rules.decommission_at = p.fixedVersion;
  return {
    [featureKey]: {
      display: signal.title,
      transition_milestones: milestones,
      rules,
      code_smell: null,
      impact_severity: p.severity,
      _chronos_meta: {
        signal_id:  signal.id,
        source_url: p.sourceUrl,
        status:     signal.status || 'unknown',
        heat:       signal.severity_or_heat || null,
      },
    },
  };
}

// ── Shard load / merge / write ────────────────────────────────────────────────
const SHARD_SKELETONS = {
  'react-native-nitro-modules': {
    '$schema': '../../schemas/package-features.schema.json',
    package: 'react-native-nitro-modules', vendor: 'mrousavy',
    category: 'NATIVE_BRIDGE',
    canonical_docs: 'https://nitro.margelo.com/',
    features: {},
  },
  'nitrogen': {
    '$schema': '../../schemas/package-features.schema.json',
    package: 'nitrogen', vendor: 'mrousavy',
    category: 'NATIVE_BRIDGE',
    canonical_docs: 'https://nitro.margelo.com/docs/nitrogen',
    features: {},
  },
  'react-native-worklets-core': {
    '$schema': '../../schemas/package-features.schema.json',
    package: 'react-native-worklets-core', vendor: 'mrousavy',
    category: 'RUNTIME_SUBSTRATE',
    canonical_docs: 'https://github.com/margelo/react-native-worklets-core',
    features: {},
  },
};

function loadShard(pkgName) {
  const shardPath = path.join(SHARD_DIR, `${pkgName}.json`);
  if (fs.existsSync(shardPath)) {
    try {
      return { shard: JSON.parse(fs.readFileSync(shardPath, 'utf8')), shardPath, isNew: false };
    } catch (err) {
      log.error(`Failed to parse shard ${shardPath}: ${err.message}`);
      return null;
    }
  }
  if (SHARD_SKELETONS[pkgName]) {
    log.info(`  Creating new shard for ${pkgName} from skeleton`);
    return { shard: JSON.parse(JSON.stringify(SHARD_SKELETONS[pkgName])), shardPath, isNew: true };
  }
  log.warn(`  No shard and no skeleton for ${pkgName} -- skipping`);
  return null;
}

function mergeSignalsIntoShard(shard, signalFeatures) {
  let added = 0, updated = 0;
  for (const [key, feature] of Object.entries(signalFeatures)) {
    shard.features[key] ? updated++ : added++;
    shard.features[key] = feature;
  }
  return { added, updated };
}

function writeShard(shardPath, shard, isNew) {
  const json = JSON.stringify(shard, null, 2) + '\n';
  if (DRY_RUN) {
    log.dim(`[DRY-RUN] Would write ${json.length} bytes -> ${path.basename(shardPath)}`);
    return;
  }
  fs.mkdirSync(path.dirname(shardPath), { recursive: true });
  fs.writeFileSync(shardPath, json, 'utf8');
  log.ok(`${isNew ? 'Created' : 'Updated'} ${path.relative(process.cwd(), shardPath)}`);
}

// ── COMBOS.md -> combos.json ──────────────────────────────────────────────────
function parseCombos(rawText) {
  const combos = [];
  const sections = rawText.split(/^### Combo:/m).slice(1);
  for (const section of sections) {
    try {
      const titleLine = section.split('\n')[0].trim();
      const fields = {};
      const rows = [...section.matchAll(/^\s*-\s*\*\*([^*]+)\*\*:\s*(.+)/gm)];
      for (const [, key, value] of rows) {
        fields[key.trim().toLowerCase().replace(/[\s/]+/g, '_')] = value.trim();
      }
      const pkgTokens = [...titleLine.matchAll(/(\S+)\s+`([^`]+)`/g)];
      const pkgs = pkgTokens.map(([, name, range]) => ({ name, range }));
      const kind   = (fields.kind || '').replace(/`/g, '').trim();
      const status = kind === 'known-good' ? 'GOOD' : kind === 'known-broke' ? 'BROKE' : 'UNKNOWN';
      const whatBroke = (fields.what_broke || '').toLowerCase() === 'n/a' ? null : (fields.what_broke || null);
      combos.push({
        title:           titleLine,
        package_a:       pkgs[0]?.name ?? null,
        range_a:         pkgs[0]?.range ?? null,
        package_b:       pkgs[1]?.name ?? null,
        range_b:         pkgs[1]?.range ?? null,
        status,
        what_broke:      whatBroke,
        forces_or_breaks: fields.forces_or_breaks ?? null,
        fixed_in:        fields.fixed_in_or_still_open ?? null,
        source_url:      fields.source_url ?? null,
        chronos_note:    fields.chronos_note ?? null,
      });
    } catch (err) {
      log.warn(`  COMBOS parse error: ${err.message}`);
    }
  }
  return combos;
}

function writeCombosJson(combos) {
  const output = {
    _meta: {
      source:       'rn-terrain-archive-extracted/rn-terrain/compat/COMBOS.md',
      ingested_at:  new Date().toISOString(),
      record_count: combos.length,
      good_count:   combos.filter(c => c.status === 'GOOD').length,
      broke_count:  combos.filter(c => c.status === 'BROKE').length,
    },
    combos,
  };
  const outPath = path.join(COMPAT_DIR, 'combos.json');
  const json = JSON.stringify(output, null, 2) + '\n';
  if (DRY_RUN) {
    log.dim(`[DRY-RUN] Would write ${json.length} bytes -> data/compat/combos.json`);
    log.dim(`  ${combos.length} combos (${output._meta.good_count} GOOD, ${output._meta.broke_count} BROKE)`);
    return;
  }
  fs.mkdirSync(COMPAT_DIR, { recursive: true });
  fs.writeFileSync(outPath, json, 'utf8');
  log.ok(`Written data/compat/combos.json (${combos.length} records)`);
}

// ── Package -> archive signals.md mapping ────────────────────────────────────
const PACKAGE_SIGNAL_SOURCES = {
  'react-native-reanimated':      [`${ARCHIVE_ROOT}/packages/react-native-reanimated/signals.md`],
  'react-native-gesture-handler': [`${ARCHIVE_ROOT}/packages/react-native-gesture-handler/signals.md`],
  'react-native-nitro-modules':   [`${ARCHIVE_ROOT}/packages/react-native-nitro-modules/signals.md`],
  'react-native-worklets':        [`${ARCHIVE_ROOT}/packages/react-native-worklets/signals.md`],
  'react-native-worklets-core':   [`${ARCHIVE_ROOT}/packages/react-native-worklets-core/signals.md`],
  'nitrogen':                     [`${ARCHIVE_ROOT}/packages/nitrogen/signals.md`],
};

// ── Main pipeline ─────────────────────────────────────────────────────────────
async function main() {
  log.head('TCDI Chronos Ingestion Pipeline v1.0');
  log.info(`Archive root  : ${ARCHIVE_ROOT}`);
  log.info(`Shard dir     : ${SHARD_DIR}`);
  log.info(`Dry-run       : ${DRY_RUN}`);
  log.info(`Package filter: ${PKG_FILTER ?? '(all)'}`);
  console.log('');

  const report = { packages: [], totalSignals: 0, totalAdded: 0, totalUpdated: 0, errors: [] };

  if (!COMBOS_ONLY) {
    for (const [pkgName, signalPaths] of Object.entries(PACKAGE_SIGNAL_SOURCES)) {
      if (PKG_FILTER && PKG_FILTER !== pkgName) continue;
      log.head(`Package: ${pkgName}`);
      const pkgReport = { pkg: pkgName, signals: 0, added: 0, updated: 0, errors: [] };

      const loaded = loadShard(pkgName);
      if (!loaded) { pkgReport.errors.push('No shard / skeleton'); report.packages.push(pkgReport); continue; }
      const { shard, shardPath, isNew } = loaded;

      const allFeatures = {};
      for (const sigPath of signalPaths) {
        if (!fs.existsSync(sigPath)) { log.warn(`  Missing: ${sigPath}`); pkgReport.errors.push(`Missing: ${path.basename(sigPath)}`); continue; }
        log.info(`  Parsing ${path.basename(sigPath)}`);
        const signals = parseSignalsMd(fs.readFileSync(sigPath, 'utf8'), sigPath);
        log.dim(`  Found ${signals.length} signals`);
        for (const sig of signals) { Object.assign(allFeatures, signalToFeature(sig)); pkgReport.signals++; }
      }

      const { added, updated } = mergeSignalsIntoShard(shard, allFeatures);
      pkgReport.added = added; pkgReport.updated = updated;
      writeShard(shardPath, shard, isNew);

      report.totalSignals += pkgReport.signals;
      report.totalAdded   += added;
      report.totalUpdated += updated;
      report.packages.push(pkgReport);
      pkgReport.errors.forEach(e => log.warn(`  ${e}`));
    }
  }

  log.head('Cross-Dependency Combos (COMBOS.md)');
  const combosPath = `${ARCHIVE_ROOT}/compat/COMBOS.md`;
  if (!fs.existsSync(combosPath)) {
    log.error(`COMBOS.md not found: ${combosPath}`);
    report.errors.push('COMBOS.md not found');
  } else {
    const combos = parseCombos(fs.readFileSync(combosPath, 'utf8'));
    log.info(`  Parsed ${combos.length} combo records`);
    writeCombosJson(combos);
  }

  log.head('Ingestion Summary');
  console.log('');
  console.log(`  ${'Package'.padEnd(40)} ${'Signals'.padStart(8)} ${'Added'.padStart(8)} ${'Updated'.padStart(8)} Errors`);
  console.log('  ' + '-'.repeat(78));
  for (const p of report.packages) {
    const errStr = p.errors.length > 0 ? `${C.yellow}${p.errors.length}${C.reset}` : `${C.dim}0${C.reset}`;
    console.log(`  ${p.pkg.padEnd(40)} ${String(p.signals).padStart(8)} ${String(p.added).padStart(8)} ${String(p.updated).padStart(8)}  ${errStr}`);
  }
  console.log('  ' + '-'.repeat(78));
  console.log(`  ${'TOTAL'.padEnd(40)} ${String(report.totalSignals).padStart(8)} ${String(report.totalAdded).padStart(8)} ${String(report.totalUpdated).padStart(8)}`);
  console.log('');

  if (report.errors.length > 0) { log.error(`Pipeline errors: ${report.errors.join(', ')}`); process.exit(1); }
  if (DRY_RUN) { log.warn('DRY-RUN: No files were modified.'); }
  else { log.ok('Ingestion complete. Run project-kernel.mjs to verify projections.'); }
}

main().catch(err => { log.error(`Fatal: ${err.message}`); console.error(err.stack); process.exit(1); });
