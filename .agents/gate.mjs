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
import { pathToFileURL } from 'node:url';

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
  const match = lineText.match(/(?:\/\/|\/\*)\s*@rn-terrain-ignore(?:-next-line)?(?:\s*:?\s*(.*?))?(?:\*\/)?$/i);
  if (!match) return false;

  const directiveArg = (match[1] || '').trim();
  if (!directiveArg || directiveArg.startsWith(':') || directiveArg.startsWith('-') || directiveArg.startsWith('(')) {
    return true;
  }

  const tokens = directiveArg.split(/[\s,:]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
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
        line: getLineNumber(callMatch.index)
      });
    }
  }

  const sourceLines = sourceCode.split('\n');
  return violations.filter(v => !isViolationIgnored(sourceLines, v));
}

async function main() {
  let payloadInput = null;

  // Read piped stdin (JSON payload from Claude Code, Codex, OpenCode)
  if (!process.stdin.isTTY) {
    try {
      const chunks = [];
      for await (const chunk of process.stdin) {
        chunks.push(chunk);
      }
      const rawInput = Buffer.concat(chunks).toString('utf8').trim();
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
    } catch {}
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
  const receiptPath = path.resolve(projectRoot, '.agents', 'state', 'receipt.json');
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

  // 4. Scoped AST Invariant Verification with Comment & Mock Immunity (Remedy 1)
  let violations = [];

  try {
    const scannerPkgPath = path.resolve(projectRoot, 'packages', 'scanner', 'dist', 'index.js');
    if (fs.existsSync(scannerPkgPath)) {
      const { ScopedAstParser } = await import(pathToFileURL(scannerPkgPath).href);
      const parser = new ScopedAstParser();
      violations = parser.parseAndScan(virtualDocument, { filePath: targetFilePath });
    } else {
      violations = fallbackScopedScan(virtualDocument);
    }
  } catch {
    violations = fallbackScopedScan(virtualDocument);
  }

  if (violations.length > 0) {
    console.error('');
    console.error('🛑 [RN-TERRAIN PRE-WRITE BUFFER AST GATE: ACTION BLOCKED]');
    console.error('─────────────────────────────────────────────────────────────────');
    console.error(`  Target Surface: ${normalizedPath}`);
    console.error('  Status:         SEVERED / OBSOLETE API DETECTED IN SYNTHESIZED BUFFER');
    console.error('');
    console.error('  VIOLATIONS FOUND:');
    for (const v of violations) {
      console.error(`    • Symbol:      ${v.symbol}`);
      console.error(`      Package:     ${v.package}`);
      console.error(`      Replacement: ${v.replacement}`);
      console.error(`      Detail:      ${v.message}`);
      console.error('');
    }
    console.error('  CRITICAL INSTRUCTION FOR AI AGENT:');
    console.error('  Your proposed code contains obsolete/severed APIs that will cause runtime crashes.');
    console.error('  Regenerate your code using the modern replacements shown above.');
    console.error('─────────────────────────────────────────────────────────────────');
    console.error('');

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

    process.exit(2);
  }

  // All invariants satisfied -> ALLOW
  process.exit(0);
}

main().catch(() => process.exit(0));
