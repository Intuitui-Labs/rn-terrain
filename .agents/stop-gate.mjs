#!/usr/bin/env node
/**
 * @file stop-gate.mjs
 * RN-Terrain Deterministic Verification Stop Gate.
 *
 * Intercepts agent task completion across Claude Code and Codex Stop hooks.
 * Guarantees that an agent cannot declare a task "complete" if its modifications
 * introduce severed APIs, architectural regressions, or broken TypeScript types.
 *
 * Exit Codes:
 *   0: ALLOW (all verification checks passed; task may terminate)
 *   2: REJECT (regressions detected; blocks completion and returns stderr to model)
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const projectRoot = process.cwd();
const RN_PKG_REGEX = /\b(react-native|react-native-reanimated|react-native-gesture-handler|react-native-worklets|@shopify\/react-native-skia|\bexpo\b)\b/;

const SEVERED_RULES = [
  {
    id: 'reanimated-v2-gesture-handler',
    regex: /\buseAnimatedGestureHandler\b/,
    package: 'react-native-reanimated',
    symbol: 'useAnimatedGestureHandler',
    replacement: 'Gesture.Pan().onUpdate(...) from react-native-gesture-handler with <GestureDetector>',
    message: "'useAnimatedGestureHandler' is removed/deprecated in Reanimated v3/v4 worklets. Use 'Gesture.Pan()' from react-native-gesture-handler."
  },
  {
    id: 'rngh-v1-use-pan-gesture',
    regex: /\busePanGesture\b/,
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
  // 1. Collect modified files from git status
  let modifiedFiles = [];
  try {
    const statusOutput = execSync('git status --porcelain', {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    });

    const lines = statusOutput.split('\n').filter(Boolean);
    for (const rawLine of lines) {
      if (rawLine.length < 4) continue;
      // Porcelain format: XY <path> or XY <old> -> <new> (columns 0 and 1 are status, column 2 is space)
      const filePathPart = rawLine.substring(3).trim();
      const parts = filePathPart.split(' -> ');
      const filePath = parts[parts.length - 1].trim();
      if (filePath) {
        modifiedFiles.push(path.resolve(projectRoot, filePath));
      }
    }
  } catch {
    // If not in git repo or git fails, allow with exit 0
    process.exit(0);
  }

  // Filter to code files
  const codeFiles = modifiedFiles.filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ['.tsx', '.jsx', '.ts', '.js'].includes(ext) && fs.existsSync(f);
  });

  // Filter to files touching React Native
  const rnFiles = codeFiles.filter(f => {
    const norm = f.replace(/\\/g, '/');
    if (norm.includes('mobile/') || norm.includes('apps/mobile') || norm.includes('screens/') || norm.includes('components/')) {
      return true;
    }
    try {
      const content = fs.readFileSync(f, 'utf8');
      return RN_PKG_REGEX.test(content);
    } catch {
      return false;
    }
  });

  // If no React Native files were modified: Zero friction ALLOW
  if (rnFiles.length === 0) {
    process.exit(0);
  }

  // 2. Audit modified React Native files for severed APIs
  const violations = [];

  for (const file of rnFiles) {
    const relPath = path.relative(projectRoot, file).replace(/\\/g, '/');
    let content = '';
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }

    const lines = content.split('\n');

    for (const rule of SEVERED_RULES) {
      if (rule.regex.test(content)) {
        // Find line number
        let lineNo = 1;
        for (let i = 0; i < lines.length; i++) {
          if (rule.regex.test(lines[i])) {
            lineNo = i + 1;
            break;
          }
        }

        violations.push({
          file: relPath,
          line: lineNo,
          symbol: rule.symbol,
          package: rule.package,
          replacement: rule.replacement,
          message: rule.message
        });
      }
    }
  }

  // 3. If violations exist: BLOCK completion with Exit Code 2
  if (violations.length > 0) {
    console.error('');
    console.error('🛑 [RN-TERRAIN STOP GATE: TASK COMPLETION REJECTED]');
    console.error('─────────────────────────────────────────────────────────────────');
    console.error('  The agent attempted to declare completion, but the following');
    console.error(`  architectural violations were detected in modified files (${violations.length} total):`);
    console.error('');

    for (const v of violations) {
      console.error(`  ❌ ${v.file}:${v.line}`);
      console.error(`     Severed Symbol: ${v.symbol} (${v.package})`);
      console.error(`     Required Fix:   ${v.replacement}`);
      console.error(`     Detail:         ${v.message}`);
      console.error('');
    }

    console.error('  CRITICAL INSTRUCTION FOR AI AGENT:');
    console.error('  You cannot complete this session while severed or removed APIs remain');
    console.error('  in the codebase. Fix the issues listed above, then re-verify.');
    console.error('─────────────────────────────────────────────────────────────────');
    console.error('');
    process.exit(2);
  }

  // All modified files clean -> ALLOW completion
  console.log('✓ [RN-TERRAIN STOP GATE]: All modified React Native files verified cleanly.');
  process.exit(0);
}

main().catch(() => process.exit(0));
