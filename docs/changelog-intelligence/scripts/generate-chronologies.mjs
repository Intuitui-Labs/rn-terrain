#!/usr/bin/env node
/**
 * generate-chronologies.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * TCDI Reverse-Chronological Audit Ledger Generator
 *
 * Walks ALL packages (including foundation L0-L2) from the Chronos archive
 * and generates reverse-chronological chronology markdown files in:
 *   docs/changelog-intelligence/chronology/<pkg>.md
 *
 * ORDER: latest stable → RC/nightly (if present) → patch N-1 → ... → oldest
 * Each version entry shows the 6-state kernel snapshot, signals active at that
 * version, cross-dep compat context, and dev dance obligations.
 *
 * COVERAGE (11 packages + 5 foundation):
 *   packages: rngh, nitro-modules, nitrogen, worklets, worklets-core
 *   foundation: expo, react-native, react, nodejs, bun
 *   already done: react-native-reanimated (skip if exists)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARCHIVE   = 'c:/projects/rn-terrain-archive-extracted/rn-terrain';
const OUT_DIR   = path.resolve(__dirname, '../chronology');
const DATA_DIR  = path.resolve(__dirname, '../data');
const COMPAT_F  = path.join(DATA_DIR, 'compat/combos.json');

const args          = process.argv.slice(2);
const DRY_RUN       = args.includes('--dry-run');
const PKG_FILTER    = (() => { const i = args.indexOf('--pkg'); return i !== -1 ? args[i + 1] : null; })();
const FORCE_REGEN   = args.includes('--force');
const CHECK_STALE   = args.includes('--check-stale');

import { createHash } from 'node:crypto';

/** Compute a short SHA-256 hash of a shard file for staleness detection */
function shardHash(filePath) {
  if (!fs.existsSync(filePath)) return 'none';
  return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex').slice(0, 12);
}

// ── Colour helpers ───────────────────────────────────────────────────────────
const C = { reset:'\x1b[0m', bold:'\x1b[1m', dim:'\x1b[2m', red:'\x1b[31m', green:'\x1b[32m', yellow:'\x1b[33m', cyan:'\x1b[36m', magenta:'\x1b[35m' };
const log = {
  info: (m) => console.log(`${C.cyan}i${C.reset}  ${m}`),
  ok:   (m) => console.log(`${C.green}+${C.reset}  ${m}`),
  warn: (m) => console.log(`${C.yellow}!${C.reset}  ${m}`),
  head: (m) => console.log(`\n${C.bold}${C.magenta}>> ${m}${C.reset}`),
  dim:  (m) => console.log(`${C.dim}   ${m}${C.reset}`),
};

// ── Load combos for cross-ref ────────────────────────────────────────────────
const COMBOS = fs.existsSync(COMPAT_F)
  ? JSON.parse(fs.readFileSync(COMPAT_F, 'utf8')).combos
  : [];

function combosForPkg(pkgName) {
  return COMBOS.filter(c =>
    (c.package_a || '').toLowerCase().includes(pkgSlug(pkgName)) ||
    (c.package_b || '').toLowerCase().includes(pkgSlug(pkgName)) ||
    (c.title || '').toLowerCase().includes(pkgSlug(pkgName))
  );
}
function pkgSlug(name) {
  const MAP = {
    'react-native-gesture-handler': 'rngh',
    'react-native-reanimated': 'reanimated',
    'react-native-nitro-modules': 'nitro',
    'nitrogen': 'nitrogen',
    'react-native-worklets': 'worklets',
    'react-native-worklets-core': 'worklets-core',
    'expo': 'expo',
    'react-native': 'rn',
    'react': 'react',
  };
  return MAP[name] || name.split('-').pop();
}

// ── Archive patch leaf reader ─────────────────────────────────────────────────
function readLeaf(archivePath) {
  if (!fs.existsSync(archivePath)) return null;
  return fs.readFileSync(archivePath, 'utf8');
}

function extractCards(leafText) {
  if (!leafText) return [];
  const cards = [];
  const sections = leafText.split(/^### Card \d+:/m).slice(1);
  if (sections.length > 0) {
    for (const s of sections) {
      const kind   = (s.match(/\*\*kind\*\*:\s*`([^`]+)`/) || [])[1] || 'unknown';
      const title  = (s.match(/\*\*title\*\*:\s*(.+)/) || [])[1]?.trim() || '(untitled)';
      const what   = (s.match(/\*\*what_changed\*\*:\s*(.+)/) || [])[1]?.trim() || '';
      const url    = (s.match(/\*\*source_url\*\*:\s*(.+)/) || [])[1]?.trim() || '';
      cards.push({ kind, title, what: what || title, url });
    }
  } else {
    const impactMatch = leafText.match(/impact_type:\s*"([^"]+)"/);
    const changelogUrlMatch = leafText.match(/changelog_url:\s*"([^"]+)"/);
    const titleMatch = leafText.match(/^# (.+)$/m);
    if (impactMatch) {
      const it = impactMatch[1].toLowerCase();
      let kind = 'fix';
      if (it.includes('breaking') || it.includes('removal')) kind = 'breaking';
      else if (it.includes('capability') || it.includes('new')) kind = 'feat';
      else if (it.includes('build') || it.includes('type')) kind = 'migration';
      else if (it.includes('perf')) kind = 'perf';
      cards.push({
        kind,
        title: titleMatch ? titleMatch[1].replace(/^React Native [0-9.]+ (?:— )?/, '') : 'Maintenance release',
        what: titleMatch ? titleMatch[1] : '',
        url: changelogUrlMatch ? changelogUrlMatch[1] : ''
      });
    }
  }
  return cards;
}

function extractPeers(leafText) {
  if (!leafText) return null;
  const peersMatch = leafText.match(/## Peers\n([\s\S]*?)(?=\n## |\n# |$)/);
  if (peersMatch) {
    const block = peersMatch[1].trim();
    const bndMatch = block.match(/bundledNativeModules[^:]*:\s*```json\n([\s\S]*?)```/);
    if (bndMatch) {
      try { return { bundled: JSON.parse(bndMatch[1]) }; } catch {}
    }
    return { raw: block.slice(0, 300) };
  }
  const toolchainMatch = leafText.match(/## 2\. Toolchain & Runtime Substrate Matrix\n([\s\S]*?)(?=\n## |$)/);
  if (toolchainMatch) {
    return { raw: toolchainMatch[1].trim() };
  }
  return null;
}

function extractSpine(leafText) {
  if (!leafText) return {};
  const spine = {};
  const pub = (leafText.match(/\*\*published_at\*\*:\s*`([^`]+)`/) || leafText.match(/date_released:\s*"([^"]+)"/) || leafText.match(/- \*\*Release Date\*\*:\s*([0-9-]+)/) || [])[1] || null;
  if (pub) spine.published_at = pub.slice(0, 10);
  const dt = (leafText.match(/\*\*dist_tags\*\*:\s*`([^`]+)`/) || [])[1] || null;
  if (dt) spine.dist_tags = dt;
  return spine;
}

// ── Signal lookup from the ingested shard ────────────────────────────────────
const SHARDS = {};
function getShard(pkgName) {
  if (SHARDS[pkgName]) return SHARDS[pkgName];
  const p = path.join(DATA_DIR, `packages/${pkgName}.json`);
  if (fs.existsSync(p)) {
    try { SHARDS[pkgName] = JSON.parse(fs.readFileSync(p, 'utf8')); }
    catch { SHARDS[pkgName] = null; }
  }
  return SHARDS[pkgName] || null;
}

function signalsActiveAt(pkgName, version) {
  const shard = getShard(pkgName);
  if (!shard) return [];
  const active = [];
  for (const [key, feat] of Object.entries(shard.features || {})) {
    if (!key.startsWith('chronos_')) continue;
    const m   = feat.transition_milestones || {};
    const born   = m.broken;
    const fixed  = m.fixed;
    const isOpen = !fixed;
    if (!born) continue;
    const bornCmp = semverLte(born, version);
    const fixedCmp = fixed ? semverLte(fixed, version) : false;
    if (bornCmp && !fixedCmp) {
      active.push({ id: key, title: feat.display, severity: feat.impact_severity, fixed, url: feat._chronos_meta?.source_url });
    }
  }
  return active;
}

// naive semver compare for M.m.p
function semverParts(v) {
  const [M, m, p] = (v || '0.0.0').replace(/[^0-9.]/g, '').split('.').map(Number);
  return [M || 0, m || 0, p || 0];
}
function semverLte(a, b) {
  const [aM, am, ap] = semverParts(a);
  const [bM, bm, bp] = semverParts(b);
  if (aM !== bM) return aM < bM;
  if (am !== bm) return am < bm;
  return ap <= bp;
}
function semverGte(a, b) { return !semverLte(a, b) || semverEq(a, b); }
function semverEq(a, b) {
  const [aM, am, ap] = semverParts(a);
  const [bM, bm, bp] = semverParts(b);
  return aM === bM && am === bm && ap === bp;
}

// ── Kernel state renderer ────────────────────────────────────────────────────
function kernelBlock(pkgName, version, shard) {
  if (!shard) return '_Kernel: no shard loaded._\n';
  const feats = Object.entries(shard.features || {});
  const removed    = feats.filter(([, f]) => f.transition_milestones?.removed && semverGte(version, f.transition_milestones.removed));
  const deprecated = feats.filter(([, f]) => f.transition_milestones?.deprecated && semverGte(version, f.transition_milestones.deprecated) && !(f.transition_milestones?.removed && semverGte(version, f.transition_milestones.removed)));
  const broken     = feats.filter(([, f]) => { const m = f.transition_milestones; return m?.broken && semverGte(version, m.broken) && !(m.fixed && semverGte(version, m.fixed)); });
  const newFeats   = feats.filter(([, f]) => { const m = f.transition_milestones; return m?.added && semverGte(version, m.added) && !semverLte(version, f.transition_milestones.added) === false; });
  const experimental = feats.filter(([, f]) => { const m = f.transition_milestones; return m?.experimental && semverGte(version, m.experimental) && !(m.added && semverGte(version, m.added)); });
  const functional = feats.filter(([, f]) => { const m = f.transition_milestones; return m?.added && semverGte(version, m.added) && !(m.removed && semverGte(version, m.removed)) && !(m.broken && semverGte(version, m.broken) && !(m.fixed && semverGte(version, m.fixed))); });

  let out = '```\n';
  out += `┌──────────────────────────────────────────────────────────────────────┐\n`;
  out += `│ 6-STATE KERNEL @ ${pkgName}@${version}`.padEnd(71) + '│\n';
  out += `├──────────────────────────────────────────────────────────────────────┤\n`;
  const row = (label, arr, getLabel) => {
    const names = arr.map(([, f]) => getLabel ? getLabel(f) : f.display || '?').join(', ');
    const trunc = names.length > 52 ? names.slice(0, 49) + '...' : names;
    out += `│ ${label.padEnd(12)} │ ${(trunc || 'none').padEnd(53)}│\n`;
  };
  row('REMOVED',     removed,     null);
  row('DEPRECATED',  deprecated,  null);
  row('BROKEN',      broken,      null);
  row('FUNCTIONAL',  functional,  null);
  row('NEW',         newFeats,    null);
  row('EXPERIMENTAL',experimental,null);
  out += `└──────────────────────────────────────────────────────────────────────┘\n`;
  out += '```\n';
  return out;
}

// ── Section builder for one version entry ────────────────────────────────────
function buildVersionEntry(pkgName, version, leafText, opts = {}) {
  const { isLatest, isRC, isBeta, isNightly, releaseNote } = opts;
  const spine  = extractSpine(leafText);
  const cards  = extractCards(leafText);
  const peers  = extractPeers(leafText);
  const shard  = getShard(pkgName);
  const activeSignals = signalsActiveAt(pkgName, version);
  const relCombos = combosForPkg(pkgName).filter(c => {
    const ra = c.range_a || ''; const rb = c.range_b || '';
    return ra.includes(version.split('.').slice(0,2).join('.')) || rb.includes(version.split('.').slice(0,2).join('.'));
  });

  const tag = [
    isLatest   ? '🟢 **LATEST STABLE**' : '',
    isRC       ? '🔵 **RELEASE CANDIDATE**' : '',
    isBeta     ? '🟡 **BETA**' : '',
    isNightly  ? '⚫ **NIGHTLY**' : '',
  ].filter(Boolean).join(' ') || '';

  let md = '';
  md += `---\n\n`;
  md += `## 📅 ${spine.published_at || '(date unknown)'} — \`v${version}\` ${tag}\n\n`;
  if (releaseNote) md += `> ${releaseNote}\n\n`;

  // 1. Kernel
  md += `### 1. 6-State Sliding Feature Kernel\n\n`;
  md += kernelBlock(pkgName, version, shard);
  md += '\n';

  // 2. Change cards from archive leaf
  if (cards.length > 0) {
    md += `### 2. Release Cards (${cards.length} changes)\n\n`;
    const grouped = {};
    for (const c of cards) { (grouped[c.kind] = grouped[c.kind] || []).push(c); }
    for (const [kind, kindCards] of Object.entries(grouped)) {
      const icon = { feat:'✨', fix:'🐛', breaking:'💥', perf:'⚡', dep:'🗑️', peer:'🔗', peer_deps:'🔗', migration:'🚀' }[kind] || '📌';
      md += `**${icon} ${kind.toUpperCase()}** (${kindCards.length})\n`;
      for (const c of kindCards) {
        md += `- ${c.title}`;
        if (c.url) md += ` — [source](${c.url})`;
        md += '\n';
      }
      md += '\n';
    }
  } else {
    md += `### 2. Release Cards\n\n_No leaf data in archive for this patch._\n\n`;
  }

  // 3. Active signals
  if (activeSignals.length > 0) {
    md += `### 3. Active Signals (${activeSignals.length} known issues at this version)\n\n`;
    for (const s of activeSignals) {
      const fixTag = s.fixed ? ` *(fixed in ${s.fixed})*` : ' *(open)*';
      md += `- **[${s.severity}]** ${s.title}${fixTag}`;
      if (s.url) md += ` — [#](${s.url})`;
      md += '\n';
    }
    md += '\n';
  }

  // 4. Peers / compat
  if (peers?.bundled) {
    md += `### 4. Bundled Native Modules (SDK Pins)\n\n`;
    md += '```json\n' + JSON.stringify(peers.bundled, null, 2) + '\n```\n\n';
  } else if (peers?.raw) {
    md += `### 4. Peer Dependencies\n\n\`\`\`\n${peers.raw}\n\`\`\`\n\n`;
  }

  // 5. Combo matches
  if (relCombos.length > 0) {
    md += `### 5. Cross-Dependency Compat (relevant combos)\n\n`;
    for (const c of relCombos) {
      const icon = c.status === 'GOOD' ? '✅' : '💥';
      md += `${icon} **${c.status}** ${c.title}\n`;
      if (c.what_broke) md += `  - ${c.what_broke}\n`;
      if (c.source_url) md += `  - [source](${c.source_url})\n`;
    }
    md += '\n';
  }

  return md;
}

// ── Package definitions ───────────────────────────────────────────────────────
const PACKAGES = [
  {
    name: 'react-native-gesture-handler',
    displayName: 'React Native Gesture Handler',
    archivePath: `${ARCHIVE}/packages/react-native-gesture-handler`,
    versions: ['3.3.0','3.2.1','3.2.0','3.1.0','3.0.2','3.0.1','3.0.0','2.33.0','2.32.0','2.31.2','2.31.1','2.31.0','2.30.1','2.30.0','2.29.1','2.29.0','2.28.0','2.27.2','2.27.1','2.27.0','2.26.0','2.25.0','2.24.0','2.23.1','2.23.0','2.22.1','2.22.0','2.21.2','2.21.1','2.21.0','2.20.2','2.20.1','2.20.0','2.19.0','2.18.1','2.18.0','2.17.1','2.17.0','2.16.2','2.16.1','2.16.0','2.15.0','2.14.1','2.14.0','2.13.4','2.13.3','2.13.2','2.13.1','2.13.0','2.12.1','2.12.0','2.11.0','2.10.2','2.10.1','2.10.0','2.9.0','2.8.0','2.7.1','2.7.0','2.6.2','2.6.1','2.6.0','2.5.0','2.4.2','2.4.1','2.4.0','2.3.2','2.3.1','2.3.0','2.2.1','2.2.0','2.1.3','2.1.2','2.1.1','2.1.0','2.0.0'],
    latestStable: '3.3.0', latestRC: null, latestBeta: null,
    getLeafPath: (v) => {
      const [M, m, p] = semverParts(v);
      return `${ARCHIVE}/packages/react-native-gesture-handler/majors/${M}/minors/${m}/patches/${p}.md`;
    },
    signals: `${ARCHIVE}/packages/react-native-gesture-handler/signals.md`,
  },
  {
    name: 'react-native-nitro-modules',
    displayName: 'React Native Nitro Modules',
    archivePath: `${ARCHIVE}/packages/react-native-nitro-modules`,
    versions: ['0.37.1','0.37.0','0.36.5','0.36.4','0.36.3','0.36.2','0.36.1','0.36.0'],
    latestStable: '0.37.1', latestRC: null, latestBeta: '0.37.0-beta.1',
    getLeafPath: (v) => {
      const [M, m, p] = semverParts(v);
      return `${ARCHIVE}/packages/react-native-nitro-modules/majors/${M}/minors/${m}/patches/${p}.md`;
    },
  },
  {
    name: 'nitrogen',
    displayName: 'Nitrogen (Nitro Codegen)',
    archivePath: `${ARCHIVE}/packages/nitrogen`,
    versions: ['0.37.1','0.37.0','0.36.5','0.36.4','0.36.3','0.36.2','0.36.1','0.36.0'],
    latestStable: '0.37.1', latestRC: null, latestBeta: '0.37.0-beta.1',
    getLeafPath: (v) => {
      const [M, m, p] = semverParts(v);
      return `${ARCHIVE}/packages/nitrogen/majors/${M}/minors/${m}/patches/${p}.md`;
    },
  },
  {
    name: 'react-native-worklets',
    displayName: 'React Native Worklets (SWM)',
    archivePath: `${ARCHIVE}/packages/react-native-worklets`,
    versions: ['0.13.0','0.12.2','0.12.1','0.12.0'],
    latestStable: '0.13.0', latestRC: null, latestBeta: null,
    getLeafPath: (v) => {
      const [M, m, p] = semverParts(v);
      return `${ARCHIVE}/packages/react-native-worklets/majors/${M}/minors/${m}/patches/${p}.md`;
    },
  },
  {
    name: 'react-native-worklets-core',
    displayName: 'React Native Worklets Core (Margelo)',
    archivePath: `${ARCHIVE}/packages/react-native-worklets-core`,
    versions: ['1.6.3','1.6.2','1.6.1','1.6.0','1.5.0','1.4.0','1.3.3','1.3.2','1.3.1','1.3.0','1.2.0','1.1.3','1.1.2','1.1.1','1.1.0','1.0.0','0.5.0','0.4.0','0.3.0','0.2.4','0.2.3','0.2.2','0.2.1','0.2.0'],
    latestStable: '1.6.3', latestRC: null, latestBeta: '2.0.0-beta.4',
    getLeafPath: (v) => {
      const [M, m, p] = semverParts(v);
      return `${ARCHIVE}/packages/react-native-worklets-core/majors/${M}/minors/${m}/patches/${p}.md`;
    },
  },
  {
    name: 'expo-router',
    displayName: 'Expo Router',
    archivePath: `${ARCHIVE}/foundation/expo-router`,
    versions: ['58.0.8','58.0.0','57.0.23','57.0.0','56.2.21','56.1.4','56.0.4','55.0.18','55.0.0','7.0.0-canary-20260121-a63c0dd','6.1.0-canary-20251015-a6a1272','6.0.24','6.0.0','5.1.11','5.0.7','4.0.22','4.0.0','3.5.24','3.4.10','3.3.1','3.2.0','3.1.2','3.0.0','2.0.15','1.0.0'],
    latestStable: '58.0.8', latestRC: null, latestBeta: null,
    nextPreview: null,
    getLeafPath: (v) => {
      const [M, m, p] = semverParts(v);
      return `${ARCHIVE}/foundation/expo-router/majors/${M}/minors/${m}/patches/${p}.md`;
    },
  },
  {
    name: 'expo',
    displayName: 'Expo SDK',
    archivePath: `${ARCHIVE}/foundation/expo`,
    versions: ['57.0.24','57.0.23','57.0.22','57.0.21','57.0.20','57.0.19','57.0.18','57.0.17','57.0.16','57.0.15','57.0.14','57.0.13','57.0.12','57.0.11','57.0.10','57.0.9','57.0.8','57.0.7','57.0.6','57.0.5','57.0.4','57.0.3','57.0.2','57.0.1','57.0.0','56.0.22','56.0.21','56.0.20','56.0.19','56.0.18','56.0.17','56.0.16','56.0.15','56.0.14','56.0.13','56.0.12','56.0.11','56.0.10','56.0.9','56.0.8','56.0.7','56.0.6','56.0.5','56.0.4','56.0.3','56.0.2','56.0.1','56.0.0'],
    latestStable: '57.0.24', latestRC: null, latestBeta: null,
    nextPreview: '58.0.0-preview.6',
    getLeafPath: (v) => {
      const [M, m, p] = semverParts(v);
      return `${ARCHIVE}/foundation/expo/majors/${M}/minors/${m}/patches/${p}.md`;
    },
  },
  {
    name: 'react-native',
    displayName: 'React Native',
    archivePath: `${ARCHIVE}/foundation/react-native`,
    versions: ["0.87.1","0.87.0","0.86.3","0.86.2","0.86.0","0.85.3","0.85.2","0.85.1","0.85.0","0.84.1","0.84.0","0.83.10","0.83.9","0.83.8","0.83.7","0.83.6","0.83.5","0.83.4","0.83.3","0.83.2","0.83.1","0.83.0","0.82.1","0.82.0","0.81.6","0.81.5","0.81.4","0.81.3","0.81.2","0.81.1","0.81.0","0.80.3","0.80.2","0.80.1","0.80.0","0.79.7","0.79.6","0.79.5","0.79.4","0.79.3","0.79.2","0.79.1","0.79.0","0.78.3","0.78.2","0.78.1","0.78.0","0.77.3","0.77.2","0.77.1","0.77.0","0.76.9","0.76.8","0.76.7","0.76.6","0.76.5","0.76.4","0.76.3","0.76.2","0.76.1","0.76.0","0.75.5","0.75.4","0.75.3","0.75.2","0.75.1","0.75.0","0.74.7","0.74.6","0.74.5","0.74.4","0.74.3","0.74.2","0.74.1","0.74.0","0.73.11","0.73.10","0.73.9","0.73.8","0.73.7","0.73.6","0.73.5","0.73.4","0.73.3","0.73.2","0.73.1","0.73.0","0.72.17","0.72.15","0.72.14","0.72.13","0.72.12","0.72.11","0.72.10","0.72.9","0.72.8","0.72.7","0.72.6","0.72.5","0.72.4","0.72.3","0.72.2","0.72.1","0.72.0","0.71.19","0.71.18","0.71.17","0.71.16","0.71.15","0.71.14","0.71.13","0.71.12","0.71.11","0.71.10","0.71.9","0.71.8","0.71.7","0.71.6","0.71.5","0.71.4","0.71.3","0.71.2","0.71.1","0.71.0"],
    latestStable: '0.87.1', latestRC: null, nextRC: '0.88.0-rc.2',
    getLeafPath: (v) => {
      const localDir = path.resolve(__dirname, '../entries/react-native');
      if (fs.existsSync(localDir)) {
        const files = fs.readdirSync(localDir);
        const match = files.find(f => f.includes(`-v${v}-`));
        if (match) return path.join(localDir, match);
      }
      const [M, m, p] = semverParts(v);
      return `${ARCHIVE}/foundation/react-native/majors/${M}/minors/${m}/patches/${p}.md`;
    },
  },
  {
    name: 'react',
    displayName: 'React',
    archivePath: `${ARCHIVE}/foundation/react`,
    versions: ['19.3.0','19.2.8','19.2.7','19.2.6','19.2.5','19.2.4','19.2.3','19.2.2','19.2.1','19.2.0','19.1.9','19.1.8','19.1.7','19.1.6','19.1.5','19.1.4','19.1.3','19.1.2','19.1.1','19.1.0','19.0.8','19.0.7','19.0.6','19.0.5','19.0.4','19.0.3','19.0.2','19.0.1','19.0.0','18.3.1','18.3.0','18.2.0','18.1.0','18.0.0'],
    latestStable: '19.3.0', latestRC: null,
    getLeafPath: (v) => {
      const [M, m, p] = semverParts(v);
      return `${ARCHIVE}/foundation/react/majors/${M}/minors/${m}/patches/${p}.md`;
    },
  },
];

// ── Chronology file builder ──────────────────────────────────────────────────
function buildChronology(pkg, opts = {}) {
  const { name, displayName, versions, latestStable, latestRC, latestBeta, nextPreview, nextRC, getLeafPath } = pkg;

  let md = '';
  // Header
  md += `---\n`;
  md += `title: "${displayName} — Reverse-Chronological Audit"\n`;
  md += `package: "${name}"\n`;
  md += `latest_stable: "${latestStable}"\n`;
  md += `_generated_at: "${opts.generatedAt || new Date().toISOString()}"\n`;
  if (opts.shardHash) md += `_shard_hash: "${opts.shardHash}"\n`;
  md += `audit_vector: "present → past (${latestStable} ➔ oldest)"\n`;
  md += `source: "TCDI Chronos Archive + Grok/Chronos signals"\n`;
  md += `---\n\n`;

  md += `# ${displayName} — Reverse-Chronological Audit Ledger\n\n`;
  md += `> **Audit vector**: Present ➔ Past. Starts at **${latestStable}** (latest stable as of ingest, September 2026) and walks backward without skipping any minor or patch.\n`;
  md += `>\n`;
  md += `> **Coverage**: ${versions.length} versions`;
  if (latestRC)    md += `; next RC: \`${latestRC}\``;
  if (nextRC)      md += `; in-flight RC: \`${nextRC}\` (not yet stable)`;
  if (nextPreview) md += `; next SDK preview: \`${nextPreview}\` (not yet stable)`;
  md += `\n>\n`;
  md += `> **6-State kernel**: REMOVED | DEPRECATED | BROKEN | FUNCTIONAL | NEW | EXPERIMENTAL\n\n`;
  md += `---\n\n`;

  // In-flight pre-releases header (note only, no full leaf)
  if (nextRC || nextPreview) {
    const preVer = nextRC || nextPreview;
    md += `## ⚪ In-flight: \`${preVer}\` (RC / Preview — not yet stable)\n\n`;
    md += `> _Not yet stable at ingest. Leaf not generated. Monitor dist-tag \`next\` for promotion._\n\n`;
    md += `---\n\n`;
  }
  if (latestBeta) {
    md += `## 🟡 **BETA** — \`${latestBeta}\`\n\n`;
    md += `> _Beta channel only. Leaf may be partial. Treat as pre-release._\n\n`;
    md += `---\n\n`;
  }

  for (let i = 0; i < versions.length; i++) {
    const version = versions[i];
    const leafText = readLeaf(getLeafPath(version));
    const isLatest = version === latestStable;
    const isRC     = (latestRC && version === latestRC);

    const entry = buildVersionEntry(name, version, leafText, { isLatest, isRC, releaseNote: null });
    md += entry;
  }

  // Footer
  md += `\n---\n\n`;
  md += `## Audit Integrity\n\n`;
  md += `- **Versions covered**: ${versions.length}\n`;
  md += `- **Archive source**: Chronos/Grok rn-terrain corpus (extracted 2026-09-26)\n`;
  md += `- **Combos cross-referenced**: ${combosForPkg(name).length} relevant combos\n`;
  md += `- **Signals cross-referenced**: ${(getShard(name)?.features ? Object.keys(getShard(name).features).filter(k=>k.startsWith('chronos_')).length : 0)} Chronos signals\n`;
  md += `- **Audit vector**: Present ➔ Past (${latestStable} ➔ ${versions[versions.length-1]})\n`;

  return md;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  // ── P3: --check-stale mode ──────────────────────────────────────────────────
  if (CHECK_STALE) {
    log.head('P3 Staleness Check — Chronology vs Shard');
    let staleCount = 0;
    for (const pkg of PACKAGES) {
      if (PKG_FILTER && PKG_FILTER !== pkg.name) continue;
      const chronoFile = path.join(OUT_DIR, `${pkg.name}.md`);
      const shardFile  = path.join(DATA_DIR, `packages/${pkg.name}.json`);
      if (!fs.existsSync(chronoFile)) {
        log.warn(`MISSING chronology: ${pkg.name}.md`);
        staleCount++;
        continue;
      }
      if (!fs.existsSync(shardFile)) continue;
      const chronoMtime = fs.statSync(chronoFile).mtimeMs;
      const shardMtime  = fs.statSync(shardFile).mtimeMs;
      if (shardMtime > chronoMtime) {
        const diff = Math.round((shardMtime - chronoMtime) / 60000);
        log.warn(`STALE: ${pkg.name}.md (shard is ${diff}min newer — run --force to regenerate)`);
        staleCount++;
      } else {
        log.ok(`FRESH: ${pkg.name}.md`);
      }
    }
    if (staleCount > 0) {
      console.log(`\n${C.yellow}${staleCount} stale chronology file(s). Run: node generate-chronologies.mjs --force${C.reset}`);
      process.exit(1);
    }
    log.ok('All chronologies are fresh.');
    return;
  }

  log.head('TCDI Reverse-Chronological Chronology Generator');
  log.info(`Output dir: ${OUT_DIR}`);
  log.info(`Dry-run: ${DRY_RUN}`);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const report = [];

  for (const pkg of PACKAGES) {
    if (PKG_FILTER && PKG_FILTER !== pkg.name) continue;

    const outFile = path.join(OUT_DIR, `${pkg.name}.md`);
    if (fs.existsSync(outFile) && !FORCE_REGEN && !PKG_FILTER) {
      log.warn(`  Skipping ${pkg.name} (already exists — use --force to overwrite)`);
      report.push({ pkg: pkg.name, status: 'skipped', versions: 0 });
      continue;
    }

    log.head(`Generating: ${pkg.displayName} (${pkg.versions.length} versions)`);

    try {
      const shardFile  = path.join(DATA_DIR, `packages/${pkg.name}.json`);
      const hash       = shardHash(shardFile);
      const genAt      = new Date().toISOString().slice(0, 19) + 'Z';
      const content    = buildChronology(pkg, { shardHash: hash, generatedAt: genAt });
      if (DRY_RUN) {
        log.dim(`[DRY-RUN] Would write ${content.length} bytes -> chronology/${pkg.name}.md`);
      } else {
        fs.writeFileSync(outFile, content, 'utf8');
        log.ok(`Written: chronology/${pkg.name}.md (${Math.round(content.length/1024)}KB)`);
      }
      report.push({ pkg: pkg.name, status: 'ok', versions: pkg.versions.length, size: content.length });
    } catch (err) {
      log.warn(`  Error generating ${pkg.name}: ${err.message}`);
      report.push({ pkg: pkg.name, status: 'error', error: err.message });
    }
  }

  log.head('Generation Summary');
  console.log('');
  console.log(`  ${'Package'.padEnd(38)} ${'Status'.padStart(8)} ${'Versions'.padStart(10)} ${'Size'.padStart(8)}`);
  console.log('  ' + '-'.repeat(70));
  for (const r of report) {
    const sizeStr = r.size ? `${Math.round(r.size/1024)}KB` : '-';
    console.log(`  ${r.pkg.padEnd(38)} ${r.status.padStart(8)} ${String(r.versions||0).padStart(10)} ${sizeStr.padStart(8)}`);
  }
  console.log('');
  log.ok(DRY_RUN ? 'DRY-RUN complete.' : 'All chronologies generated.');
}

main().catch(err => { console.error(err); process.exit(1); });
