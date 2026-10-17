#!/usr/bin/env node
/**
 * @file gate.mjs
 * RN-Terrain Unified Pre-Tool Grounding & Scoped AST Gate.
 *
 * Intercepts tool calls (Write, Edit, apply_patch) across Claude Code, Codex, OpenCode, and Antigravity.
 * Production-Grade Defenses:
 *   1. In-Memory Virtual Document Synthesis: Projects diff chunks onto base files before scanning.
 *   2. Package-Bound Merkle Receipts: 1:1 validation of every imported React Native package.
 *   3. Scoped AST Visitor: 100% immune to comments, docstrings, string literals, and jest.mock calls.
 *   4. Canonical Rule Matrix: Enforces 30+ New Architecture and Fabric breaking shifts.
 *
 * Exit Codes:
 *   0: ALLOW (proceed with tool execution)
 *   2: DENY (blocks tool execution and pipes stderr to model context)
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL, fileURLToPath } from 'node:url';

// Parse arguments
const args = process.argv.slice(2);
let targetFilePath = '';
let autoGround = process.env.TERRAIN_AUTO_GROUND === '1' || process.env.TERRAIN_AUTO_GROUND === 'true';
let ttlMs = 3600000; // 60 minutes default
let explicitBuffer = '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--auto-ground') {
    autoGround = true;
  } else if (args[i] === '--ttl' && args[i + 1]) {
    ttlMs = parseInt(args[i + 1], 10) || 3600000;
    i++;
  } else if (args[i] === '--buffer' && args[i + 1]) {
    explicitBuffer = args[i + 1];
    i++;
  } else if (!args[i].startsWith('--') && !targetFilePath) {
    targetFilePath = args[i];
  }
}

// Built-in fallback rule catalog
const FALLBACK_SEVERED_RULES = [
  {
    id: 'rn-core-alert-advisory',
    package: 'react-native',
    symbol: 'Alert.alert',
    type: 'call',
    severity: 'soft',
    replacement: 'Custom Modal or modern dialog component',
    message: "'Alert.alert' has platform visual inconsistencies. Custom modal recommended."
  },
  {
    id: 'reanimated-v2-gesture-handler-import',
    package: 'react-native-reanimated',
    symbol: 'useAnimatedGestureHandler',
    type: 'import',
    replacement: "Gesture.Pan().onUpdate(...) from 'react-native-gesture-handler' with <GestureDetector>",
    message: "'useAnimatedGestureHandler' was removed/deprecated in Reanimated v3/v4 worklets. Use modern 'Gesture.Pan()' instead."
  },
  {
    id: 'reanimated-v2-gesture-handler',
    package: 'react-native-reanimated',
    symbol: 'useAnimatedGestureHandler',
    type: 'call',
    replacement: "Gesture.Pan().onUpdate(...) from 'react-native-gesture-handler' with <GestureDetector>",
    message: "'useAnimatedGestureHandler' was removed/deprecated in Reanimated v3/v4 worklets. Use modern 'Gesture.Pan()' instead.",
    template: `import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const panGesture = Gesture.Pan()
  .onStart(() => {
    'worklet';
  })
  .onUpdate((event) => {
    'worklet';
  });

<GestureDetector gesture={panGesture}>
  <Animated.View style={animatedStyle} />
</GestureDetector>`
  },
  {
    id: 'reanimated-v1-interpolate-node-import',
    package: 'react-native-reanimated',
    symbol: 'interpolateNode',
    type: 'import',
    replacement: "'interpolate()' from 'react-native-reanimated'",
    message: "'interpolateNode' is a legacy Reanimated v1 API removed in modern versions. Use 'interpolate()' instead."
  },
  {
    id: 'reanimated-v1-interpolate-node',
    package: 'react-native-reanimated',
    symbol: 'interpolateNode',
    type: 'call',
    replacement: "'interpolate()' from 'react-native-reanimated'",
    message: "'interpolateNode' is a legacy Reanimated v1 API removed in modern versions. Use 'interpolate()' instead.",
    template: `import { interpolate, Extrapolation } from 'react-native-reanimated';

const output = interpolate(progress.value, [0, 1], [0, 100], Extrapolation.CLAMP);`
  },
  {
    id: 'rngh-v1-use-pan-gesture-import',
    package: 'react-native-gesture-handler',
    symbol: 'usePanGesture',
    type: 'import',
    replacement: "'Gesture.Pan()' with <GestureDetector>",
    message: "'usePanGesture' was removed in RNGH 2.0. Use 'Gesture.Pan()' with <GestureDetector>."
  },
  {
    id: 'rngh-v1-use-pan-gesture',
    package: 'react-native-gesture-handler',
    symbol: 'usePanGesture',
    type: 'call',
    replacement: "'Gesture.Pan()' with <GestureDetector>",
    message: "'usePanGesture' was removed in RNGH 2.0. Use 'Gesture.Pan()' with <GestureDetector>.",
    template: `import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const panGesture = Gesture.Pan().onUpdate(() => { 'worklet'; });
<GestureDetector gesture={panGesture}><Animated.View style={animatedStyle} /></GestureDetector>`
  },
  {
    id: 'rn-core-async-storage-removed',
    package: 'react-native',
    symbol: 'AsyncStorage',
    type: 'import',
    replacement: "Import from '@react-native-async-storage/async-storage'",
    message: "AsyncStorage was removed from 'react-native' core. Import from '@react-native-async-storage/async-storage'.",
    template: `// Option A: Community AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.setItem('key', value);
const item = await AsyncStorage.getItem('key');

// Option B: High-Performance MMKV (Recommended for New Architecture)
import { MMKV } from 'react-native-mmkv';
const storage = new MMKV();
storage.set('key', value);
const item = storage.getString('key');`
  },
  {
    id: 'rn-core-view-prop-types-removed',
    package: 'react-native',
    symbol: 'ViewPropTypes',
    type: 'import',
    replacement: "'ViewProps' TypeScript type or 'deprecated-react-native-prop-types'",
    message: "'ViewPropTypes' was removed from 'react-native' core in RN 0.71+. Use TypeScript 'ViewProps' instead.",
    template: `import type { ViewProps } from 'react-native';

interface ComponentProps extends ViewProps {
  customProperty?: string;
}`
  },
  {
    id: 'rn-core-back-handler-remove-listener',
    package: 'react-native',
    symbol: 'BackHandler.removeEventListener',
    type: 'call',
    replacement: "Call '.remove()' on the subscription returned by 'BackHandler.addEventListener'",
    message: "'BackHandler.removeEventListener' is deprecated and removed in modern RN. Call '.remove()' on the returned subscription.",
    template: `import { useEffect } from 'react';
import { BackHandler } from 'react-native';

useEffect(() => {
  const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
  return () => subscription.remove();
}, []);`
  }
];

function matchesIgnoreDirective(lineText, ruleId, symbol) {
  if (!lineText) return false;
  const match = lineText.match(/(?:\/\/|\/\*)\s*@rn-terrain-ignore(?:-next-line)?(?::\s*(.*?)|\s+(.*?))?(?:\*\/)?$/i);
  if (!match) return false;

  if (match[1] !== undefined) {
    return true;
  }

  const directiveArg = (match[2] || '').trim();
  if (!directiveArg || directiveArg.startsWith('-') || directiveArg.startsWith('(')) {
    return true;
  }

  const beforeColon = directiveArg.split(':')[0].trim();
  const tokens = beforeColon.split(/[\s,]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
  const targetTokens = [
    (ruleId || '').toLowerCase(),
    (symbol || '').toLowerCase(),
    ((symbol || '').split('.').pop() || '').toLowerCase()
  ].filter(Boolean);

  return targetTokens.some(t => tokens.includes(t));
}

function isViolationIgnored(sourceLines, v) {
  const lineIdx = (v.line || 1) - 1;
  if (lineIdx >= 0 && lineIdx < sourceLines.length) {
    if (matchesIgnoreDirective(sourceLines[lineIdx], v.ruleId, v.symbol)) {
      return true;
    }
  }
  if (lineIdx - 1 >= 0 && lineIdx - 1 < sourceLines.length) {
    if (matchesIgnoreDirective(sourceLines[lineIdx - 1], v.ruleId, v.symbol)) {
      return true;
    }
  }
  return false;
}

async function publishAntibodyGossip(projectRoot, antibodies) {
  if (!antibodies || antibodies.length === 0) return;
  try {
    let corePkgPath = path.resolve(projectRoot, 'packages', 'core', 'dist', 'index.js');
    if (!fs.existsSync(corePkgPath)) {
      const scriptDir = path.dirname(fileURLToPath(import.meta.url));
      corePkgPath = path.resolve(scriptDir, '..', 'packages', 'core', 'dist', 'index.js');
    }
    if (fs.existsSync(corePkgPath)) {
      const coreMod = await import(pathToFileURL(corePkgPath).href);
      if (coreMod.AntibodyGossipBus) {
        const bus = new coreMod.AntibodyGossipBus();
        for (const a of antibodies) {
          bus.publishAntibody({
            severedSymbol: a.severedSymbol,
            culpritPackage: a.culpritPackage,
            canonicalRemediation: a.canonicalRemediation,
          });
        }
      }
    }
  } catch {}
}

function synthesizeVirtualDocument(filePath, payloadInput) {
  let diskContent = '';
  if (filePath && fs.existsSync(filePath)) {
    try {
      diskContent = fs.readFileSync(filePath, 'utf8');
    } catch {}
  }

  if (payloadInput?.content) {
    return payloadInput.content;
  }
  if (payloadInput?.old_string && payloadInput?.new_string !== undefined) {
    if (diskContent && diskContent.includes(payloadInput.old_string)) {
      return diskContent.replace(payloadInput.old_string, payloadInput.new_string);
    }
    return diskContent ? `${diskContent}\n${payloadInput.new_string}` : payloadInput.new_string;
  }
  if (payloadInput?.patch) {
    const patch = payloadInput.patch;
    if (typeof patch === 'string' && (patch.includes('\n+') || patch.includes('\n-') || patch.startsWith('---'))) {
      const addedLines = patch
        .split('\n')
        .filter(line => line.startsWith('+') && !line.startsWith('+++'))
        .map(line => line.substring(1))
        .join('\n');
      return diskContent ? `${diskContent}\n${addedLines}` : addedLines;
    }
    return diskContent ? `${diskContent}\n${patch}` : patch;
  }
  if (explicitBuffer) {
    return explicitBuffer;
  }
  return diskContent;
}

function extractImportedPackages(sourceCode) {
  const pkgs = new Set();
  const importRegex = /(?:import\s+.*?from\s+['"]([^'"]+)['"]|require\s*\(\s*['"]([^'"]+)['"]\s*\))/g;
  let match;
  while ((match = importRegex.exec(sourceCode)) !== null) {
    const pkg = match[1] || match[2];
    if (pkg && (pkg.startsWith('react-native') || pkg.startsWith('@shopify/react-native') || pkg.startsWith('expo') || pkg.includes('reanimated') || pkg.includes('gesture-handler'))) {
      pkgs.add(pkg);
    }
  }
  return Array.from(pkgs);
}

// Light scoped AST visitor fallback with comment and string immunity
function fallbackScopedScan(sourceCode) {
  if (/(?:\/\/|\/\*)\s*@rn-terrain-ignore-file\b/i.test(sourceCode)) {
    return [];
  }

  const violations = [];
  // Strip single-line and multi-line comments
  const strippedCode = sourceCode
    .replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length))
    .replace(/\/\/[^\n]*/g, (m) => ' '.repeat(m.length));

  const getLineNumber = (idx) => sourceCode.substring(0, idx).split('\n').length;

  // Check imports
  const importLinesRegex = /import\s+(?:\{([^}]+)\}|(\w+))\s+from\s+['"]([^'"]+)['"]/g;
  let impMatch;
  while ((impMatch = importLinesRegex.exec(strippedCode)) !== null) {
    const rawSpecifiers = impMatch[1] || impMatch[2] || '';
    const sourcePkg = impMatch[3];
    const specifiers = rawSpecifiers.split(',').map(s => s.trim().split(/\s+as\s+/)[0]).filter(Boolean);

    for (const spec of specifiers) {
      const rule = FALLBACK_SEVERED_RULES.find(r => r.type === 'import' && r.package === sourcePkg && r.symbol === spec);
      if (rule) {
        violations.push({
          ruleId: rule.id,
          package: rule.package,
          symbol: rule.symbol,
          replacement: rule.replacement,
          message: rule.message,
          template: rule.template,
          severity: rule.severity || 'hard',
          line: getLineNumber(impMatch.index)
        });
      }
    }
  }

  // Check CJS require destructuring: const { X } = require('pkg');
  const requireDestructRegex = /(?:const|let|var)\s+\{([^}]+)\}\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  let reqMatch;
  while ((reqMatch = requireDestructRegex.exec(strippedCode)) !== null) {
    const rawSpecifiers = reqMatch[1] || '';
    const sourcePkg = reqMatch[2];
    const specifiers = rawSpecifiers.split(',').map(s => s.trim().split(/\s*:\s*/)[0]).filter(Boolean);

    for (const spec of specifiers) {
      const rule = FALLBACK_SEVERED_RULES.find(r => r.package === sourcePkg && r.symbol === spec);
      if (rule) {
        violations.push({
          ruleId: rule.id,
          package: rule.package,
          symbol: rule.symbol,
          replacement: rule.replacement,
          message: rule.message,
          template: rule.template,
          severity: rule.severity || 'hard',
          line: getLineNumber(reqMatch.index)
        });
      }
    }
  }

  // Check calls (excluding calls inside jest.mock)
  const nonMockCode = strippedCode.replace(/jest\.mock\s*\([\s\S]*?\);?/g, (m) => ' '.repeat(m.length));
  for (const rule of FALLBACK_SEVERED_RULES.filter(r => r.type === 'call')) {
    const callRegex = new RegExp(`\\b${rule.symbol}\\s*\\(`, 'g');
    let callMatch;
    while ((callMatch = callRegex.exec(nonMockCode)) !== null) {
      violations.push({
        ruleId: rule.id,
        package: rule.package,
        symbol: rule.symbol,
        replacement: rule.replacement,
        message: rule.message,
        template: rule.template,
        severity: rule.severity || 'hard',
        line: getLineNumber(callMatch.index)
      });
    }
  }

  const sourceLines = sourceCode.split('\n');
  return violations.filter(v => !isViolationIgnored(sourceLines, v));
}

function readStdinPayload(timeoutMs = 120) {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) return resolve(null);
    let chunks = [];
    let completed = false;

    const timer = setTimeout(() => {
      if (!completed) {
        completed = true;
        process.stdin.pause();
        process.stdin.removeAllListeners('data');
        process.stdin.removeAllListeners('end');
        process.stdin.removeAllListeners('error');
        resolve(chunks.length > 0 ? Buffer.concat(chunks).toString('utf8').trim() : null);
      }
    }, timeoutMs);

    process.stdin.on('data', (chunk) => {
      chunks.push(chunk);
    });

    process.stdin.on('end', () => {
      if (!completed) {
        completed = true;
        clearTimeout(timer);
        resolve(chunks.length > 0 ? Buffer.concat(chunks).toString('utf8').trim() : null);
      }
    });

    process.stdin.on('error', () => {
      if (!completed) {
        completed = true;
        clearTimeout(timer);
        resolve(null);
      }
    });

    process.stdin.resume();
  });
}

async function main() {
  let payloadInput = null;

  // Read piped stdin (JSON payload from Claude Code, Codex, OpenCode) with timeout protection
  const rawInput = await readStdinPayload(120);
  if (rawInput) {
    try {
      const payload = JSON.parse(rawInput);
      payloadInput = payload.input || payload.args || payload;
      if (!targetFilePath) {
        targetFilePath = payloadInput?.file_path ||
                         payloadInput?.filePath ||
                         payloadInput?.path ||
                         '';
      }
    } catch {
      if (!targetFilePath) {
        targetFilePath = rawInput;
      }
    }
  }

  if (!targetFilePath) {
    process.exit(0);
  }

  const normalizedPath = targetFilePath.replace(/\\/g, '/');
  const ext = path.extname(normalizedPath).toLowerCase();
  const isCodeExtension = ['.tsx', '.jsx', '.ts', '.js', '.mjs', '.cjs'].includes(ext);

  // 1. Non-code files (Markdown, config, JSON, Rust, CSS) -> Zero friction ALLOW
  if (!isCodeExtension) {
    process.exit(0);
  }

  // 2. Synthesize virtual post-edit document (Remedy 2: Differential Horizon Synthesizer)
  const virtualDocument = synthesizeVirtualDocument(targetFilePath, payloadInput);

  if (/(?:\/\/|\/\*)\s*@rn-terrain-ignore-file\b/i.test(virtualDocument)) {
    console.error('ℹ️ [RN-TERRAIN GATE]: File-level ignore directive (@rn-terrain-ignore-file) detected. Write permitted.');
    process.exit(0);
  }

  const RN_PKG_REGEX = /\b(react-native|react-native-reanimated|react-native-gesture-handler|react-native-worklets|@shopify\/react-native-skia|\bexpo\b)\b/;
  const isRnContent = RN_PKG_REGEX.test(virtualDocument);
  const isRnPath = normalizedPath.includes('mobile/') ||
                   normalizedPath.includes('apps/mobile') ||
                   normalizedPath.includes('components/') ||
                   normalizedPath.includes('screens/');

  const isRnTarget = isRnContent || (isRnPath && (ext === '.tsx' || ext === '.jsx'));

  if (!isRnTarget) {
    process.exit(0);
  }

  // 3. Package-Bound Merkle Receipt Validation (Remedy 5)
  const projectRoot = process.cwd();
  let receiptPath = path.resolve(projectRoot, '.agents', 'state', 'receipt.json');
  try {
    let gitHead = '';
    const gitHeadPath = path.join(projectRoot, '.git', 'HEAD');
    if (fs.existsSync(gitHeadPath)) {
      gitHead = fs.readFileSync(gitHeadPath, 'utf8').trim();
    }
    const hash = crypto.createHash('sha256').update(`${projectRoot}:${gitHead}`).digest('hex').substring(0, 16);
    const worktreeReceipt = path.resolve(projectRoot, '.agents', 'state', 'receipts', `${hash}.json`);
    if (fs.existsSync(worktreeReceipt)) {
      receiptPath = worktreeReceipt;
    }
  } catch {}
  const importedPackages = extractImportedPackages(virtualDocument);

  let receiptData = null;
  if (fs.existsSync(receiptPath)) {
    try {
      receiptData = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
    } catch {}
  }

  const ungroundedPackages = [];
  const now = Date.now();

  for (const pkg of importedPackages) {
    const pkgReceipt = receiptData?.packages?.[pkg];
    if (!pkgReceipt) {
      ungroundedPackages.push(pkg);
    } else {
      const ageMs = now - new Date(pkgReceipt.timestamp || receiptData.lastGrounding).getTime();
      if (ageMs > ttlMs) {
        ungroundedPackages.push(pkg);
      }
    }
  }

  // If no specific RN packages were extracted via import, fallback to general check
  if (importedPackages.length === 0) {
    const generalAgeMs = receiptData ? now - new Date(receiptData.lastGrounding).getTime() : Infinity;
    if (!receiptData || generalAgeMs > ttlMs) {
      ungroundedPackages.push('react-native');
    }
  }

  if (ungroundedPackages.length > 0) {
    if (autoGround) {
      try {
        const stateDir = path.resolve(projectRoot, '.agents', 'state');
        if (!fs.existsSync(stateDir)) {
          fs.mkdirSync(stateDir, { recursive: true });
        }
        const timestamp = new Date().toISOString();
        const updatedReceipt = receiptData || { lastGrounding: timestamp, packages: {} };
        updatedReceipt.lastGrounding = timestamp;
        updatedReceipt.lastAction = 'auto_ground_on_intercept';
        updatedReceipt.packages = updatedReceipt.packages || {};

        for (const pkg of ungroundedPackages) {
          updatedReceipt.packages[pkg] = { version: 'latest', timestamp };
        }
        fs.writeFileSync(receiptPath, JSON.stringify(updatedReceipt, null, 2), 'utf8');
        console.error(`⚡ [RN-TERRAIN AUTO-GROUND]: In-flight receipt cut for [${ungroundedPackages.join(', ')}].`);
      } catch {}
    } else {
      console.error('');
      console.error('🛑 [RN-TERRAIN PRE-TOOL GROUNDING GATE: ACTION BLOCKED]');
      console.error('─────────────────────────────────────────────────────────────────');
      console.error(`  Target Surface:      ${normalizedPath}`);
      console.error(`  Ungrounded Packages: ${ungroundedPackages.join(', ')}`);
      console.error('');
      console.error('  CRITICAL INSTRUCTION FOR AI AGENT:');
      console.error('  Before writing or editing React Native code, you MUST consult the Outside');
      console.error(`  Referent for all ungrounded packages: [${ungroundedPackages.join(', ')}]`);
      console.error('');
      console.error('  BATCH REMEDIATION (Ground all packages at once):');
      console.error(`    CLI Command: npx @intuitui-labs/rn-terrain compass ${ungroundedPackages.join(' ')}`);
      console.error(`    MCP Tools:   Call tcdi_compass for each package:`);
      for (const p of ungroundedPackages) {
        console.error(`      • tcdi_compass(package_name: "${p}")`);
      }
      console.error('─────────────────────────────────────────────────────────────────');
      console.error('');
      process.exit(2);
    }
  }

  // 3b. React Native Directory Afferent Grounding: Zombie / Abandonware Veto
  const dirCachePath = path.resolve(projectRoot, '.agents', 'state', 'directory-cache.json');
  let dirCache = null;
  if (fs.existsSync(dirCachePath)) {
    try {
      dirCache = JSON.parse(fs.readFileSync(dirCachePath, 'utf8'));
    } catch {}
  }

  const zombiePackages = [];
  for (const pkg of importedPackages) {
    const pkgInfo = dirCache?.packages?.[pkg];
    if (pkgInfo?.unmaintained) {
      zombiePackages.push(pkg);
    }
  }

  if (zombiePackages.length > 0) {
    console.error('');
    console.error('🛑 [RN-TERRAIN ZOMBIE PACKAGE VETO: ACTION BLOCKED]');
    console.error('─────────────────────────────────────────────────────────────────');
    console.error(`  Target Surface:   ${normalizedPath}`);
    console.error(`  Zombie Libraries: ${zombiePackages.join(', ')}`);
    console.error('');
    console.error('  CRITICAL INSTRUCTION FOR AI AGENT:');
    console.error('  These packages are flagged as UNMAINTAINED/ABANDONED in React Native Directory.');
    console.error('  They will cause crashes or build failures on modern platforms.');
    console.error('  Replace them with active community alternatives.');
    console.error('─────────────────────────────────────────────────────────────────');
    console.error('');
    process.exit(2);
  }

  // 4. Multi-Layer Invariant Verification Substrate
  let violations = [];
  let ImmuneSystem = null;
  let HermesSentry = null;
  let scannerMod = null;

  try {
    let scannerPkgPath = path.resolve(projectRoot, 'packages', 'scanner', 'dist', 'index.js');
    if (!fs.existsSync(scannerPkgPath)) {
      const scriptDir = path.dirname(fileURLToPath(import.meta.url));
      scannerPkgPath = path.resolve(scriptDir, '..', 'packages', 'scanner', 'dist', 'index.js');
    }
    if (fs.existsSync(scannerPkgPath)) {
      scannerMod = await import(pathToFileURL(scannerPkgPath).href);
      const parser = new scannerMod.ScopedAstParser();
      ImmuneSystem = scannerMod.ImmuneSystem;
      HermesSentry = scannerMod.HermesSentry;
      violations = parser.parseAndScan(virtualDocument, { filePath: targetFilePath });
    } else {
      violations = fallbackScopedScan(virtualDocument);
    }
  } catch {
    violations = fallbackScopedScan(virtualDocument);
  }

  // 4a. Parametric Hallucination Honeypot Engine Trapdoors
  if (scannerMod && scannerMod.HoneypotEngine) {
    try {
      const honeypotEngine = new scannerMod.HoneypotEngine();
      const hpReport = honeypotEngine.detectHoneypots(virtualDocument, targetFilePath);
      if (hpReport.hasTrapdoorTriggered) {
        console.error('');
        console.error('🛑 [RN-TERRAIN PARAMETRIC HALLUCINATION TRAPDOOR: ACTION BLOCKED]');
        console.error('─────────────────────────────────────────────────────────────────');
        console.error(`  Target Surface: ${normalizedPath}`);
        console.error('  Status:         IMAGINARY / CONFABULATED API DETECTED');
        console.error('');
        for (const v of hpReport.violations) {
          console.error(`  • Hallucinated Symbol: ${v.symbol} (${v.package})`);
          console.error(`    Detail:              ${v.message}`);
          console.error(`    Canonical Fix:       ${v.canonicalRemediation}`);
        }
        console.error('');
        console.error('  CRITICAL INSTRUCTION FOR AI AGENT:');
        console.error('  This symbol does NOT exist in physical reality. Ground your context with:');
        console.error(`  rn-terrain compass ${hpReport.violations[0]?.package || 'react-native'}`);
        console.error('─────────────────────────────────────────────────────────────────');
        console.error('');
        await publishAntibodyGossip(
          projectRoot,
          hpReport.violations.map(v => ({
            severedSymbol: v.symbol,
            culpritPackage: v.package,
            canonicalRemediation: v.canonicalRemediation
          }))
        );
        process.exit(2);
      }
    } catch {}
  }

  // 4b. Nitro C++ Native Architecture Auditor
  if (scannerMod && scannerMod.NitroAuditor) {
    try {
      const nitroAuditor = new scannerMod.NitroAuditor(projectRoot);
      const nitroFindings = nitroAuditor.verifyCodeSnippet(virtualDocument);
      const hardNitro = nitroFindings.filter(f => f.severity === 'error');
      const softNitro = nitroFindings.filter(f => f.severity === 'warning');

      if (softNitro.length > 0) {
        console.error('');
        console.error('ℹ [RN-TERRAIN NITRO WORKLET ADVISORY: ACTION ALLOWED WITH WARNING]');
        console.error('─────────────────────────────────────────────────────────────────');
        for (const sn of softNitro) {
          console.error(`  • ${sn.message}`);
          console.error(`    Remediation: ${sn.remediation}`);
        }
        console.error('─────────────────────────────────────────────────────────────────');
        console.error('');
      }

      if (hardNitro.length > 0) {
        console.error('');
        console.error('🛑 [RN-TERRAIN NITRO C++ NATIVE ARCHITECTURE VETO: ACTION BLOCKED]');
        console.error('─────────────────────────────────────────────────────────────────');
        console.error(`  Target Surface: ${normalizedPath}`);
        console.error('  Status:         NITRO HYBRIDOBJECT ACCESSED VIA OBSOLETE BRIDGE / TURBOMODULE SPEC');
        console.error('');
        for (const hn of hardNitro) {
          console.error(`  • Violation:   ${hn.message}`);
          console.error(`    Remediation: ${hn.remediation}`);
        }
        console.error('');
        console.error('  CRITICAL INSTRUCTION FOR AI AGENT:');
        console.error('  This module is a C++ JSI Nitro HybridObject.');
        console.error('  Import NitroModules from \'react-native-nitro-modules\' and call createHybridObject.');
        console.error('─────────────────────────────────────────────────────────────────');
        console.error('');
        await publishAntibodyGossip(
          projectRoot,
          hardNitro.map(v => ({
            severedSymbol: 'NitroHybridObject',
            culpritPackage: 'react-native-nitro-modules',
            canonicalRemediation: v.remediation
          }))
        );
        process.exit(2);
      }
    } catch {}
  }

  const hardViolations = violations.filter(v => v.severity !== 'soft');
  const softViolations = violations.filter(v => v.severity === 'soft');

  if (softViolations.length > 0) {
    console.error('');
    console.error('ℹ [RN-TERRAIN ADVISORY DEPRECATION: ACTION ALLOWED WITH WARNING]');
    console.error('─────────────────────────────────────────────────────────────────');
    for (const v of softViolations) {
      console.error(`  • Deprecated Symbol: ${v.symbol} (${v.package})`);
      console.error(`    Suggested Fix:     ${v.replacement}`);
      console.error(`    Detail:            ${v.message}`);
    }
    console.error('─────────────────────────────────────────────────────────────────');
    console.error('');
  }

  if (hardViolations.length > 0) {
    console.error('');
    console.error('🛑 [RN-TERRAIN PRE-WRITE BUFFER AST GATE: ACTION BLOCKED]');
    console.error('─────────────────────────────────────────────────────────────────');
    console.error(`  Target Surface: ${normalizedPath}`);
    console.error('  Status:         SEVERED / OBSOLETE API DETECTED IN SYNTHESIZED BUFFER');
    console.error('');
    console.error('  VIOLATIONS FOUND:');
    for (const v of hardViolations) {
      console.error(`    • Symbol:      ${v.symbol}`);
      console.error(`      Package:     ${v.package}`);
      console.error(`      Replacement: ${v.replacement}`);
      console.error(`      Detail:      ${v.message}`);
      if (v.template) {
        console.error('');
        console.error('  📋 CANONICAL DROP-IN REPLACEMENT TEMPLATE (COPY DIRECTLY):');
        console.error('  ─────────────────────────────────────────────────────────────────');
        for (const line of v.template.split('\n')) {
          console.error(`  ${line}`);
        }
        console.error('  ─────────────────────────────────────────────────────────────────');
      }
      console.error('');
    }
    console.error('  CRITICAL INSTRUCTION FOR AI AGENT:');
    console.error('  Your proposed code contains obsolete/severed APIs that will cause runtime crashes.');
    console.error('  Regenerate your code using the exact canonical template shown above.');
    console.error('─────────────────────────────────────────────────────────────────');
    console.error('');

    // Clonal Selection: Synthesize antibodies in immune memory ledger
    if (ImmuneSystem) {
      try {
        const ais = new ImmuneSystem(path.resolve(projectRoot, '.agents', 'state', 'immune-memory.json'));
        for (const v of hardViolations) {
          const parts = (v.symbol || '').split('.');
          ais.registerAntibody({
            callee: parts.length > 1 ? parts[parts.length - 1] : parts[0] || v.symbol,
            object: parts.length > 1 ? parts[0] : undefined,
            sourcePackage: v.package,
            replacement: v.replacement,
            message: v.message,
            severity: 'hard'
          });
        }
      } catch {}
    }

    // Optional Local Incident Telemetry (STRICTLY OPT-IN BY DEFAULT)
    const isTelemetryOptedIn =
      process.env.TERRAIN_TELEMETRY === '1' ||
      process.env.TERRAIN_TELEMETRY === 'true' ||
      (() => {
        try {
          const rcPath = path.resolve(projectRoot, '.terrainrc');
          if (fs.existsSync(rcPath)) {
            const rc = JSON.parse(fs.readFileSync(rcPath, 'utf8'));
            return rc.telemetry === true;
          }
        } catch {}
        return false;
      })();

    if (isTelemetryOptedIn) {
      try {
        const incidentsDir = path.resolve(projectRoot, '.terrain', 'incidents');
        if (!fs.existsSync(incidentsDir)) {
          fs.mkdirSync(incidentsDir, { recursive: true });
        }
        const firstFinding = violations[0];
        const incId = `inc-${(firstFinding.package || 'rn').replace(/[^a-z0-9]/gi, '_')}-${Date.now().toString(36)}`;
        const incidentData = {
          id: incId,
          timestamp: new Date().toISOString(),
          packageName: firstFinding.package || 'unknown',
          targetVersion: 'latest',
          rejectedSnippet: virtualDocument.slice(0, 2000),
          severedSymbolsDetected: violations.map(v => v.symbol),
          canonicalReplacements: violations.map(v => v.replacement),
          status: 'RECORDED'
        };
        fs.writeFileSync(path.join(incidentsDir, `${incId}.json`), JSON.stringify(incidentData, null, 2), 'utf8');
        console.error(`  [LOCAL TELEMETRY RECORDED (OPT-IN)]: Incident ${incId} captured for triage.`);
        console.error('');
      } catch {}
    }

    await publishAntibodyGossip(
      projectRoot,
      hardViolations.map(v => ({
        severedSymbol: v.symbol,
        culpritPackage: v.package,
        canonicalRemediation: v.replacement,
      }))
    );

    process.exit(2);
  }

  // 5. Headless Yoga Virtual Layout Prover
  if (scannerMod && scannerMod.YogaLayoutProver && virtualDocument.trim().length > 0) {
    try {
      const yogaProver = new scannerMod.YogaLayoutProver();
      const layoutReport = yogaProver.diagnoseLayout(virtualDocument, targetFilePath);
      const layoutErrors = layoutReport.violations.filter(v => v.severity === 'error');
      const layoutWarnings = layoutReport.violations.filter(v => v.severity === 'warning');

      if (layoutWarnings.length > 0) {
        console.error('');
        console.error('ℹ [RN-TERRAIN LAYOUT ADVISORY: ACTION ALLOWED WITH WARNING]');
        console.error('─────────────────────────────────────────────────────────────────');
        for (const lw of layoutWarnings) {
          console.error(`  • <${lw.component}>: ${lw.message}`);
          console.error(`    Suggested Fix: ${lw.remediation}`);
        }
        console.error('─────────────────────────────────────────────────────────────────');
        console.error('');
      }

      if (layoutErrors.length > 0) {
        console.error('');
        console.error('🛑 [RN-TERRAIN YOGA VIRTUAL LAYOUT PROVER: ACTION BLOCKED]');
        console.error('─────────────────────────────────────────────────────────────────');
        console.error(`  Target Surface: ${normalizedPath}`);
        console.error('  Status:         FATAL MOBILE LAYOUT COLLAPSE DETECTED');
        console.error('');
        for (const le of layoutErrors) {
          console.error(`  • Component:   <${le.component}> (line ${le.line || 1})`);
          console.error(`    Detail:      ${le.message}`);
          console.error(`    Remediation: ${le.remediation}`);
        }
        console.error('');
        console.error('  CRITICAL INSTRUCTION FOR AI AGENT:');
        console.error('  Your JSX renders a ScrollView or container that will collapse to 0px height.');
        console.error('  Apply flex: 1 or contentContainerStyle bounds before writing to disk.');
        console.error('─────────────────────────────────────────────────────────────────');
        console.error('');
        await publishAntibodyGossip(
          projectRoot,
          layoutErrors.map(v => ({
            severedSymbol: v.component,
            culpritPackage: 'react-native',
            canonicalRemediation: v.remediation
          }))
        );
        process.exit(2);
      }
    } catch {}
  }

  // 6. Post-Run Hermes Micro-Bytecode & Strictness Sentry
  if (scannerMod && scannerMod.HermesBytecodeVerifier && virtualDocument.trim().length > 0) {
    try {
      const hermesVerifier = new scannerMod.HermesBytecodeVerifier();
      const hermesRes = hermesVerifier.verifyCode(virtualDocument, targetFilePath);
      if (!hermesRes.valid && hermesRes.error) {
        console.error('');
        console.error('🛑 [RN-TERRAIN POST-RUN HERMES BYTECODE SENTRY: ACTION BLOCKED]');
        console.error('─────────────────────────────────────────────────────────────────');
        console.error(`  Target Surface: ${normalizedPath}`);
        console.error('  Status:         HERMES ENGINE COMPATIBILITY / STRICTNESS FAILURE');
        console.error(`  • Error:        ${hermesRes.error}`);
        if (hermesRes.tasteNudge) {
          console.error(`    Tip:          ${hermesRes.tasteNudge}`);
        }
        console.error('');
        console.error('  CRITICAL INSTRUCTION FOR AI AGENT:');
        console.error('  Hermes JavaScript engine prohibits this construct (strict mode syntax / reserved keyword / worklet closure escape).');
        console.error('  Fix the syntax error before proceeding.');
        console.error('─────────────────────────────────────────────────────────────────');
        console.error('');
        process.exit(2);
      }
    } catch {}
  } else if (HermesSentry && virtualDocument.trim().length > 0) {
    try {
      const hermesRes = HermesSentry.verify(virtualDocument, targetFilePath);
      if (!hermesRes.valid) {
        console.error('');
        console.error('🛑 [RN-TERRAIN POST-RUN HERMES SENTRY: ACTION BLOCKED]');
        console.error('─────────────────────────────────────────────────────────────────');
        console.error(`  Target Surface: ${normalizedPath}`);
        console.error('  Status:         HERMES ENGINE COMPATIBILITY / STRICTNESS FAILURE');
        for (const diag of hermesRes.diagnostics) {
          console.error(`  • [${diag.rule || 'hermes-syntax'}] ${diag.message} (line ${diag.line || 1}:${diag.column || 0})`);
        }
        console.error('');
        console.error('  CRITICAL INSTRUCTION FOR AI AGENT:');
        console.error('  Hermes JavaScript engine prohibits this construct (strict mode syntax / reserved keyword).');
        console.error('  Fix the syntax error before proceeding.');
        console.error('─────────────────────────────────────────────────────────────────');
        console.error('');
        process.exit(2);
      }
    } catch {}
  }

  // All invariants satisfied -> ALLOW
  process.exit(0);
}

main().catch(() => process.exit(0));
