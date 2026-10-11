#!/usr/bin/env node
/**
 * @file gate.mjs
 * RN-Terrain Unified Pre-Tool Grounding & Buffer AST Gate.
 *
 * Intercepts tool calls (Write, Edit, apply_patch) across Claude Code, Codex, OpenCode, and Antigravity.
 * Performs dual-layer protection:
 *   1. Outside Referent Check: Ensures fresh grounding receipt exists before modifying RN files.
 *   2. In-Memory Pre-Write Buffer AST Scan: Inspects proposed buffer (content, new_string, patch)
 *      before bytes touch disk, blocking severed/hallucinated APIs (e.g. useAnimatedGestureHandler).
 *
 * Exit Codes:
 *   0: ALLOW (proceed with tool execution)
 *   2: DENY (blocks tool execution and pipes stderr to model context)
 */

import fs from 'node:fs';
import path from 'node:path';

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

// Built-in resilient severed API rules
const DEFAULT_SEVERED_RULES = [
  {
    id: 'reanimated-v2-gesture-handler',
    regex: /\buseAnimatedGestureHandler\s*\(/,
    package: 'react-native-reanimated',
    symbol: 'useAnimatedGestureHandler',
    replacement: 'Gesture.Pan().onUpdate(...) from react-native-gesture-handler with <GestureDetector>',
    message: "'useAnimatedGestureHandler' is removed/deprecated in Reanimated v3/v4 worklets. Use 'Gesture.Pan()' from react-native-gesture-handler."
  },
  {
    id: 'rngh-v1-use-pan-gesture',
    regex: /\busePanGesture\s*\(/,
    package: 'react-native-gesture-handler',
    symbol: 'usePanGesture',
    replacement: 'Gesture.Pan() with GestureDetector',
    message: "'usePanGesture' was removed in RNGH 2.0. Use 'Gesture.Pan()' with GestureDetector."
  },
  {
    id: 'rn-core-async-storage-removed',
    regex: /import\s+[^;]*?\bAsyncStorage\b[^;]*?\s+from\s+['"]react-native['"]/,
    package: 'react-native',
    symbol: 'AsyncStorage',
    replacement: "@react-native-async-storage/async-storage",
    message: "AsyncStorage was removed from 'react-native' core. Import from '@react-native-async-storage/async-storage'."
  },
  {
    id: 'reanimated-v1-interpolate-node',
    regex: /\binterpolateNode\s*\(/,
    package: 'react-native-reanimated',
    symbol: 'interpolateNode',
    replacement: 'interpolate()',
    message: "'interpolateNode' is a legacy Reanimated v1 API removed in modern versions. Use 'interpolate()' instead."
  }
];

async function main() {
  let bufferContent = explicitBuffer;

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
          if (!targetFilePath) {
            targetFilePath = payload?.input?.file_path ||
                             payload?.input?.filePath ||
                             payload?.input?.path ||
                             payload?.args?.path ||
                             payload?.path ||
                             '';
          }
          if (!bufferContent) {
            bufferContent = payload?.input?.content ||
                            payload?.input?.new_string ||
                            payload?.input?.patch ||
                            payload?.patch ||
                            '';
          }
        } catch {
          // If stdin is raw path string
          if (!targetFilePath) {
            targetFilePath = rawInput;
          }
        }
      }
    } catch {}
  }

  // If still no target path, allow with exit 0 (do not block without target)
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

  // 2. Read file from disk if buffer was not supplied or to inspect full context
  let diskFileContent = '';
  if (fs.existsSync(targetFilePath)) {
    try {
      diskFileContent = fs.readFileSync(targetFilePath, 'utf8');
    } catch {}
  }

  const contentToInspect = bufferContent || diskFileContent;

  const RN_PKG_REGEX = /\b(react-native|react-native-reanimated|react-native-gesture-handler|react-native-worklets|@shopify\/react-native-skia|\bexpo\b)\b/;
  const isRnContent = RN_PKG_REGEX.test(contentToInspect);
  const isRnPath = normalizedPath.includes('mobile/') ||
                   normalizedPath.includes('apps/mobile') ||
                   normalizedPath.includes('components/') ||
                   normalizedPath.includes('screens/');

  const isRnTarget = isRnContent || (isRnPath && (ext === '.tsx' || ext === '.jsx'));

  // If code does not touch React Native runtime -> Zero friction ALLOW
  if (!isRnTarget) {
    process.exit(0);
  }

  // 3. Inspect Outside Referent State Receipt
  const projectRoot = process.cwd();
  const receiptPath = path.resolve(projectRoot, '.agents', 'state', 'receipt.json');

  let hasFreshReceipt = false;
  let receiptAgeMinutes = 0;

  if (fs.existsSync(receiptPath)) {
    try {
      const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
      const lastTime = new Date(receipt.lastGrounding).getTime();
      if (!isNaN(lastTime)) {
        const ageMs = Date.now() - lastTime;
        receiptAgeMinutes = Math.round(ageMs / 60000);
        if (ageMs <= ttlMs) {
          hasFreshReceipt = true;
        }
      }
    } catch {}
  }

  // 4. If receipt is missing or stale -> Check Auto-Grounding Mode
  if (!hasFreshReceipt) {
    if (autoGround) {
      try {
        const stateDir = path.resolve(projectRoot, '.agents', 'state');
        if (!fs.existsSync(stateDir)) {
          fs.mkdirSync(stateDir, { recursive: true });
        }
        const now = new Date().toISOString();
        const detectedPkg = contentToInspect.includes('react-native-reanimated')
          ? 'react-native-reanimated'
          : contentToInspect.includes('react-native-gesture-handler')
          ? 'react-native-gesture-handler'
          : 'react-native';

        const autoReceipt = {
          lastGrounding: now,
          lastAction: 'auto_ground_on_intercept',
          packages: {
            [detectedPkg]: { version: 'latest', timestamp: now }
          }
        };
        fs.writeFileSync(receiptPath, JSON.stringify(autoReceipt, null, 2), 'utf8');
        console.error(`⚡ [RN-TERRAIN AUTO-GROUND]: In-flight receipt cut for ${detectedPkg}.`);
        hasFreshReceipt = true;
      } catch {}
    } else {
      // Strict Mode Grounding DENIED: Block with Exit Code 2
      const isExpired = receiptAgeMinutes > 0;
      console.error('');
      console.error('🛑 [RN-TERRAIN PRE-TOOL GROUNDING GATE: ACTION BLOCKED]');
      console.error('─────────────────────────────────────────────────────────────────');
      console.error(`  Target Surface: ${normalizedPath}`);
      if (isExpired) {
        console.error(`  Status:         RECEIPT EXPIRED (${receiptAgeMinutes} minutes old, max TTL: ${Math.round(ttlMs / 60000)}m)`);
      } else {
        console.error('  Status:         NO ACTIVE GROUNDING RECEIPT FOUND');
      }
      console.error('');
      console.error('  CRITICAL INSTRUCTION FOR AI AGENT:');
      console.error('  Before writing or editing React Native code, you MUST consult the Outside');
      console.error('  Referent to prevent generating severed APIs (e.g. Reanimated v2, legacy Bridge).');
      console.error('');
      console.error('  REMEDIATION (Run ONE of the following first):');
      console.error('    1. MCP Tool:   tcdi_compass(package_name: "react-native-reanimated")');
      console.error('    2. MCP Prompt: preflight_grounding(package_name: "react-native-reanimated")');
      console.error('    3. CLI:        npx @intuitui-labs/rn-terrain compass <package>');
      console.error('─────────────────────────────────────────────────────────────────');
      console.error('');
      process.exit(2);
    }
  }

  // 5. In-Memory Pre-Write Buffer AST Gate (PILLAR 1)
  // Even if receipt is present, check if proposed buffer contains severed APIs
  const severedFindings = [];

  // 5a. Attempt to scan via TreeSitter / AgentGuardrail if available
  try {
    const scannerModulePath = path.resolve(projectRoot, 'packages', 'scanner', 'dist', 'agent-guardrail.js');
    if (fs.existsSync(scannerModulePath)) {
      const { AgentGuardrail } = await import(scannerModulePath);
      const guard = new AgentGuardrail();
      const verdict = guard.verify({
        packageName: 'react-native-reanimated',
        targetVersion: 'latest',
        codeSnippet: contentToInspect,
        filePath: targetFilePath
      });
      if (verdict?.severedViolations?.length > 0) {
        for (const v of verdict.severedViolations) {
          severedFindings.push({
            ruleId: v.ruleId,
            package: v.package,
            symbol: v.matchedText,
            replacement: v.replacement || 'Modern alternative',
            message: v.message
          });
        }
      }
    }
  } catch {}

  // 5b. Resilient structural pattern check fallback
  for (const rule of DEFAULT_SEVERED_RULES) {
    if (rule.regex.test(contentToInspect)) {
      if (!severedFindings.some(f => f.ruleId === rule.id)) {
        severedFindings.push({
          ruleId: rule.id,
          package: rule.package,
          symbol: rule.symbol,
          replacement: rule.replacement,
          message: rule.message
        });
      }
    }
  }

  // If severed APIs detected in buffer: BLOCK with Exit Code 2
  if (severedFindings.length > 0) {
    console.error('');
    console.error('🛑 [RN-TERRAIN PRE-WRITE BUFFER AST GATE: ACTION BLOCKED]');
    console.error('─────────────────────────────────────────────────────────────────');
    console.error(`  Target Surface: ${normalizedPath}`);
    console.error('  Status:         SEVERED / OBSOLETE API DETECTED IN PROPOSED BUFFER');
    console.error('');
    console.error('  VIOLATIONS FOUND:');
    for (const f of severedFindings) {
      console.error(`    • Symbol:      ${f.symbol}`);
      console.error(`      Package:     ${f.package}`);
      console.error(`      Replacement: ${f.replacement}`);
      console.error(`      Detail:      ${f.message}`);
      console.error('');
    }
    console.error('  CRITICAL INSTRUCTION FOR AI AGENT:');
    console.error('  Your proposed write buffer contains obsolete/severed APIs that will');
    console.error('  cause native runtime crashes. Do NOT write this code to disk.');
    console.error('  Regenerate your code using the modern replacements shown above.');
    console.error('─────────────────────────────────────────────────────────────────');
    console.error('');
    process.exit(2);
  }

  // All checks passed -> ALLOW
  process.exit(0);
}

main().catch(() => process.exit(0));
