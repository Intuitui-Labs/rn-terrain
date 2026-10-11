#!/usr/bin/env node
/**
 * @file test-gate.mjs
 * Automated Verification Suite for .agents/gate.mjs.
 *
 * Verifies all 6 gate invariants:
 *   1. Non-code files (Markdown) -> ALLOW (Exit 0)
 *   2. Non-RN code files (backend TS) -> ALLOW (Exit 0)
 *   3. Word boundary protection (export keyword does NOT match expo) -> ALLOW (Exit 0)
 *   4. RN code file without receipt (Strict Mode) -> DENIED (Exit 2)
 *   5. RN code file with fresh receipt -> ALLOW (Exit 0)
 *   6. RN code file in Auto-Grounding Mode -> ALLOW (Exit 0) + Receipt written
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

const tempDir = path.join(os.tmpdir(), `rn-terrain-gate-test-${Date.now()}`);
const stateDir = path.join(tempDir, '.agents', 'state');
const receiptPath = path.join(stateDir, 'receipt.json');
const gateScriptPath = path.resolve('.agents', 'gate.mjs');

fs.mkdirSync(stateDir, { recursive: true });

console.log('═════════════════════════════════════════════════════════════════');
console.log('🧪 VERIFYING RN-TERRAIN PRE-TOOL GROUNDING GATE');
console.log(`📁 Test Sandbox: ${tempDir}`);
console.log('═════════════════════════════════════════════════════════════════\n');

function runGate(targetPath, extraArgs = [], env = {}) {
  return spawnSync('node', [gateScriptPath, targetPath, ...extraArgs], {
    cwd: tempDir,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

function cutReceipt(packageName = 'react-native-reanimated', ageMinutes = 0) {
  const timestamp = new Date(Date.now() - ageMinutes * 60 * 1000).toISOString();
  const receipt = {
    lastGrounding: timestamp,
    lastAction: 'tcdi_compass',
    packages: {
      [packageName]: { version: '4.7.1', timestamp },
    },
  };
  fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2), 'utf8');
}

function clearReceipt() {
  if (fs.existsSync(receiptPath)) {
    fs.unlinkSync(receiptPath);
  }
}

// ── Test Cases ────────────────────────────────────────────────────────────────

const tests = [
  {
    name: '1. Non-code Markdown documentation (README.md)',
    run: () => {
      clearReceipt();
      const testFile = path.join(tempDir, 'README.md');
      fs.writeFileSync(testFile, '# My App', 'utf8');
      const res = runGate(testFile);
      return { pass: res.status === 0, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '2. Non-RN TypeScript backend utility (src/backend/server.ts)',
    run: () => {
      clearReceipt();
      const testFile = path.join(tempDir, 'server.ts');
      fs.writeFileSync(testFile, "import express from 'express'; const app = express();", 'utf8');
      const res = runGate(testFile);
      return { pass: res.status === 0, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '3. Word-boundary protection: "export" keyword does NOT trigger RN surface',
    run: () => {
      clearReceipt();
      const testFile = path.join(tempDir, 'math-utils.ts');
      fs.writeFileSync(testFile, 'export const calculateRatio = (a, b) => a / b;', 'utf8');
      const res = runGate(testFile);
      return { pass: res.status === 0, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '4. React Native component WITHOUT receipt in Strict Mode (Expected: Exit 2 Blocked)',
    run: () => {
      clearReceipt();
      const testFile = path.join(tempDir, 'AnimatedCard.tsx');
      fs.writeFileSync(testFile, "import Animated from 'react-native-reanimated';", 'utf8');
      const res = runGate(testFile);
      const isBlocked = res.status === 2 && res.stderr.includes('ACTION BLOCKED');
      return { pass: isBlocked, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '5. React Native component WITH fresh receipt (Expected: Exit 0 Allowed)',
    run: () => {
      cutReceipt('react-native-reanimated', 0); // 0m old
      const testFile = path.join(tempDir, 'AnimatedCard.tsx');
      fs.writeFileSync(testFile, "import Animated from 'react-native-reanimated';", 'utf8');
      const res = runGate(testFile);
      return { pass: res.status === 0, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '6. React Native component with EXPIRED receipt (> 60m) (Expected: Exit 2 Blocked)',
    run: () => {
      cutReceipt('react-native-reanimated', 90); // 90m old (TTL is 60m)
      const testFile = path.join(tempDir, 'AnimatedCard.tsx');
      fs.writeFileSync(testFile, "import Animated from 'react-native-reanimated';", 'utf8');
      const res = runGate(testFile);
      const isBlocked = res.status === 2 && (res.stderr.includes('ACTION BLOCKED') || res.stderr.includes('RECEIPT EXPIRED'));
      return { pass: isBlocked, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '7. Auto-Grounding Mode: Self-healing ungrounded edit (Expected: Exit 0 + Receipt cut)',
    run: () => {
      clearReceipt();
      const testFile = path.join(tempDir, 'AnimatedCard.tsx');
      fs.writeFileSync(testFile, "import Animated from 'react-native-reanimated';", 'utf8');
      const res = runGate(testFile, ['--auto-ground']);
      const receiptExists = fs.existsSync(receiptPath);
      const isPassed = res.status === 0 && receiptExists && res.stderr.includes('AUTO-GROUND');
      return { pass: isPassed, exitCode: res.status, stderr: res.stderr };
    },
  },
];

let allPassed = true;

for (const t of tests) {
  process.stdout.write(`▶ ${t.name}... `);
  try {
    const outcome = t.run();
    if (outcome.pass) {
      console.log(`✓ PASS (Exit ${outcome.exitCode})`);
    } else {
      console.log(`✗ FAIL (Exit ${outcome.exitCode})`);
      if (outcome.stderr) console.log(`  Stderr: ${outcome.stderr.trim()}`);
      allPassed = false;
    }
  } catch (err) {
    console.log(`✗ ERROR: ${err.message}`);
    allPassed = false;
  }
}

// Cleanup sandbox
try {
  fs.rmSync(tempDir, { recursive: true, force: true });
} catch {}

console.log('\n═════════════════════════════════════════════════════════════════');
if (allPassed) {
  console.log('🎉 ALL 7 GATE INVARIANT TESTS PASSED WITH 100% SUCCESS!');
  process.exit(0);
} else {
  console.log('❌ SOME GATE INVARIANT TESTS FAILED');
  process.exit(1);
}
