#!/usr/bin/env node
/**
 * @file gate.mjs
 * RN-Terrain Unified Pre-Tool Grounding Gate.
 *
 * Intercepts tool calls (Write, Edit, apply_patch) across Claude Code, Codex, OpenCode, and Antigravity.
 * Ensures the agent has consulted the Outside Referent before modifying React Native files.
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

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--auto-ground') {
    autoGround = true;
  } else if (args[i] === '--ttl' && args[i + 1]) {
    ttlMs = parseInt(args[i + 1], 10) || 3600000;
    i++;
  } else if (!args[i].startsWith('--') && !targetFilePath) {
    targetFilePath = args[i];
  }
}

async function main() {
  // If no CLI argument, attempt to read piped stdin (JSON payload from agent harnesses)
  if (!targetFilePath && !process.stdin.isTTY) {
    try {
      const chunks = [];
      for await (const chunk of process.stdin) {
        chunks.push(chunk);
      }
      const rawInput = Buffer.concat(chunks).toString('utf8').trim();
      if (rawInput) {
        try {
          const payload = JSON.parse(rawInput);
          targetFilePath = payload?.input?.file_path ||
                           payload?.input?.filePath ||
                           payload?.input?.path ||
                           payload?.args?.path ||
                           payload?.path ||
                           '';
        } catch {
          // If stdin is raw path string
          targetFilePath = rawInput;
        }
      }
    } catch {}
  }

  // If still no path, allow with exit 0 (do not block without target)
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

  // 2. Inspect whether file is part of React Native surface
  let fileContent = '';
  if (fs.existsSync(targetFilePath)) {
    try {
      fileContent = fs.readFileSync(targetFilePath, 'utf8');
    } catch {}
  }

  const RN_PKG_REGEX = /\b(react-native|react-native-reanimated|react-native-gesture-handler|react-native-worklets|@shopify\/react-native-skia|\bexpo\b)\b/;
  const isRnContent = RN_PKG_REGEX.test(fileContent);
  const isRnPath = normalizedPath.includes('mobile/') ||
                   normalizedPath.includes('apps/mobile') ||
                   normalizedPath.includes('components/') ||
                   normalizedPath.includes('screens/');

  const isRnTarget = isRnContent || (isRnPath && (ext === '.tsx' || ext === '.jsx'));

  // If code does not touch React Native runtime -> Zero friction ALLOW
  if (!isRnTarget) {
    process.exit(0);
  }

  // 3. Target touches React Native runtime -> Inspect State Receipt
  const projectRoot = process.cwd();
  const receiptPath = path.resolve(projectRoot, '.agents', 'state', 'receipt.json');

  let hasFreshReceipt = false;
  let receiptAgeMinutes = 0;
  let receiptPackages = [];

  if (fs.existsSync(receiptPath)) {
    try {
      const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
      const lastTime = new Date(receipt.lastGrounding).getTime();
      if (!isNaN(lastTime)) {
        const ageMs = Date.now() - lastTime;
        receiptAgeMinutes = Math.round(ageMs / 60000);
        if (ageMs <= ttlMs) {
          hasFreshReceipt = true;
          receiptPackages = Object.keys(receipt.packages || {});
        }
      }
    } catch {}
  }

  // If fresh receipt exists -> ALLOW
  if (hasFreshReceipt) {
    process.exit(0);
  }

  // 4. Receipt is missing or stale -> Check Auto-Grounding Mode (Zero-Friction Innovation)
  if (autoGround) {
    try {
      // Auto-cut receipt silently in-flight
      const stateDir = path.resolve(projectRoot, '.agents', 'state');
      if (!fs.existsSync(stateDir)) {
        fs.mkdirSync(stateDir, { recursive: true });
      }
      const now = new Date().toISOString();
      const detectedPkg = fileContent.includes('react-native-reanimated')
        ? 'react-native-reanimated'
        : fileContent.includes('react-native-gesture-handler')
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
      console.error(`Proceeding with edit on: ${normalizedPath}`);
      process.exit(0);
    } catch {}
  }

  // 5. Strict Mode DENIED: Block with Exit Code 2 (Claude Code / Codex feedback channel)
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

  // Exit Code 2 is the canonical blocking code in Claude Code / Codex hooks
  process.exit(2);
}

main().catch(() => process.exit(0));
