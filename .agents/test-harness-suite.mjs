#!/usr/bin/env node
/**
 * @file test-harness-suite.mjs
 * Comprehensive 15-Invariant Test Suite for RN-Terrain Deterministic Control-Plane Gates.
 *
 * Verifies all 6 Scalable Remedies:
 *   1. Clean RN write payload with fresh receipt -> ALLOW (Exit 0)
 *   2. Buffer AST Gate: Severed useAnimatedGestureHandler in Write payload -> BLOCKED (Exit 2)
 *   3. Buffer AST Gate: Partial Edit buffer (new_string) with severed call site in file with top-level import -> BLOCKED (Exit 2)
 *   4. Buffer AST Gate: Comment immunity (// useAnimatedGestureHandler) -> ALLOW (Exit 0)
 *   5. Buffer AST Gate: String literal immunity (console.log("useAnimatedGestureHandler")) -> ALLOW (Exit 0)
 *   6. Buffer AST Gate: Test mock immunity (jest.mock) -> ALLOW (Exit 0)
 *   7. Buffer AST Gate: Severed AsyncStorage from react-native core -> BLOCKED (Exit 2)
 *   8. Buffer AST Gate: Severed ViewPropTypes from react-native core -> BLOCKED (Exit 2)
 *   9. Strict mode ungrounded write without receipt -> BLOCKED (Exit 2)
 *   10. Package-bound receipt: Reanimated receipt does NOT permit ungrounded Skia edit -> BLOCKED (Exit 2)
 *   11. Auto-grounding mode ungrounded write -> ALLOW (Exit 0) + Receipt cut
 *   12. Stop Gate: Repository without modified RN files -> ALLOW (Exit 0)
 *   13. Stop Gate: Repository with agent-introduced severed API -> REJECTED (Exit 2)
 *   14. Stop Gate: Repository with pre-existing legacy debt on untouched lines -> ALLOW (Exit 0)
 *   15. Post-Tool Observation Shaper on verbose logs -> ALLOW (Exit 0) + Compressed stderr
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync, execSync } from 'node:child_process';

const tempDir = path.join(os.tmpdir(), `rn-terrain-remedies-test-${Date.now()}`);
const stateDir = path.join(tempDir, '.agents', 'state');
const receiptPath = path.join(stateDir, 'receipt.json');
const gateScriptPath = path.resolve('.agents', 'gate.mjs');
const stopGateScriptPath = path.resolve('.agents', 'stop-gate.mjs');
const postToolScriptPath = path.resolve('.agents', 'post-tool.mjs');

fs.mkdirSync(stateDir, { recursive: true });

console.log('═════════════════════════════════════════════════════════════════');
console.log('🧪 VERIFYING 15 PRODUCTION-GRADE CONTROL-PLANE INVARIANTS');
console.log(`📁 Test Sandbox: ${tempDir}`);
console.log('═════════════════════════════════════════════════════════════════\n');

function runGateWithStdin(payload, extraArgs = [], env = {}) {
  const jsonStr = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return spawnSync('node', [gateScriptPath, ...extraArgs], {
    cwd: tempDir,
    input: jsonStr,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

function cutReceipt(packages = ['react-native-reanimated']) {
  const timestamp = new Date().toISOString();
  const pkgMap = {};
  for (const p of packages) {
    pkgMap[p] = { version: '4.7.1', timestamp };
  }
  const receipt = {
    lastGrounding: timestamp,
    lastAction: 'tcdi_compass',
    packages: pkgMap,
  };
  fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2), 'utf8');
}

function clearReceipt() {
  if (fs.existsSync(receiptPath)) {
    fs.unlinkSync(receiptPath);
  }
}

const tests = [
  {
    name: '1. Clean RN write payload with fresh receipt (Expected: Exit 0 Allowed)',
    run: () => {
      cutReceipt(['react-native-gesture-handler']);
      const payload = {
        tool: 'Write',
        input: {
          file_path: 'src/components/PanCard.tsx',
          content: "import { Gesture, GestureDetector } from 'react-native-gesture-handler'; export const pan = Gesture.Pan();",
        },
      };
      const res = runGateWithStdin(payload);
      return { pass: res.status === 0, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '2. Buffer AST Gate: Severed useAnimatedGestureHandler in Write payload (Expected: Exit 2 Blocked)',
    run: () => {
      cutReceipt(['react-native-reanimated']);
      const payload = {
        tool: 'Write',
        input: {
          file_path: 'src/components/BadCard.tsx',
          content: "import { useAnimatedGestureHandler } from 'react-native-reanimated'; const handler = useAnimatedGestureHandler({});",
        },
      };
      const res = runGateWithStdin(payload);
      const isBlocked = res.status === 2 && res.stderr.includes('useAnimatedGestureHandler');
      return { pass: isBlocked, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '3. Virtual Synthesizer: Partial Edit (new_string) with severed call and existing import (Expected: Exit 2 Blocked)',
    run: () => {
      cutReceipt(['react-native-reanimated']);
      const testFile = path.join(tempDir, 'ExistingScreen.tsx');
      fs.writeFileSync(testFile, "import { useAnimatedGestureHandler } from 'react-native-reanimated';\n// placeholder line\nexport default () => null;", 'utf8');

      const payload = {
        tool: 'Edit',
        input: {
          file_path: testFile,
          old_string: '// placeholder line',
          new_string: 'const handler = useAnimatedGestureHandler({});',
        },
      };
      const res = runGateWithStdin(payload);
      const isBlocked = res.status === 2 && res.stderr.includes('useAnimatedGestureHandler');
      return { pass: isBlocked, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '4. Comment Immunity: Comment mentioning useAnimatedGestureHandler (Expected: Exit 0 Allowed)',
    run: () => {
      cutReceipt(['react-native-gesture-handler']);
      const payload = {
        tool: 'Write',
        input: {
          file_path: 'src/components/CommentedCard.tsx',
          content: "import { Gesture } from 'react-native-gesture-handler';\n// Migrated away from useAnimatedGestureHandler in 2026\n/* notice: useAnimatedGestureHandler is deprecated */\nexport const pan = Gesture.Pan();",
        },
      };
      const res = runGateWithStdin(payload);
      return { pass: res.status === 0, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '5. String Literal Immunity: String mentioning severed API (Expected: Exit 0 Allowed)',
    run: () => {
      cutReceipt(['react-native-gesture-handler']);
      const payload = {
        tool: 'Write',
        input: {
          file_path: 'src/components/DocCard.tsx',
          content: "import { Gesture } from 'react-native-gesture-handler';\nconsole.warn('Do not use useAnimatedGestureHandler here');\nexport const pan = Gesture.Pan();",
        },
      };
      const res = runGateWithStdin(payload);
      return { pass: res.status === 0, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '6. Test Mock Immunity: jest.mock definition of severed API (Expected: Exit 0 Allowed)',
    run: () => {
      cutReceipt(['react-native-reanimated']);
      const payload = {
        tool: 'Write',
        input: {
          file_path: 'src/components/Card.test.tsx',
          content: "import React from 'react';\njest.mock('react-native-reanimated', () => ({\n  useAnimatedGestureHandler: jest.fn(),\n}));\ndescribe('Card', () => { it('renders', () => {}); });",
        },
      };
      const res = runGateWithStdin(payload);
      return { pass: res.status === 0, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '7. Severed AsyncStorage from react-native core (Expected: Exit 2 Blocked)',
    run: () => {
      cutReceipt(['react-native']);
      const payload = {
        tool: 'Write',
        input: {
          file_path: 'src/storage/legacy.ts',
          content: "import { AsyncStorage } from 'react-native'; export const get = () => AsyncStorage.getItem('key');",
        },
      };
      const res = runGateWithStdin(payload);
      const isBlocked = res.status === 2 && res.stderr.includes('AsyncStorage');
      return { pass: isBlocked, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '8. Severed ViewPropTypes from react-native core (Expected: Exit 2 Blocked)',
    run: () => {
      cutReceipt(['react-native']);
      const payload = {
        tool: 'Write',
        input: {
          file_path: 'src/components/LegacyProps.ts',
          content: "import { ViewPropTypes } from 'react-native'; export const props = ViewPropTypes;",
        },
      };
      const res = runGateWithStdin(payload);
      const isBlocked = res.status === 2 && res.stderr.includes('ViewPropTypes');
      return { pass: isBlocked, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '9. Strict mode ungrounded write without receipt (Expected: Exit 2 Blocked)',
    run: () => {
      clearReceipt();
      const payload = {
        tool: 'Write',
        input: {
          file_path: 'src/components/ModernCard.tsx',
          content: "import Animated from 'react-native-reanimated';",
        },
      };
      const res = runGateWithStdin(payload);
      const isBlocked = res.status === 2 && res.stderr.includes('ACTION BLOCKED');
      return { pass: isBlocked, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '10. Package-Bound Receipt: Grounding Reanimated does NOT authorize Skia (Expected: Exit 2 Blocked)',
    run: () => {
      cutReceipt(['react-native-reanimated']); // Only Reanimated grounded
      const payload = {
        tool: 'Write',
        input: {
          file_path: 'src/components/CanvasView.tsx',
          content: "import { Canvas } from '@shopify/react-native-skia';",
        },
      };
      const res = runGateWithStdin(payload);
      const isBlocked = res.status === 2 && res.stderr.includes('@shopify/react-native-skia');
      return { pass: isBlocked, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '11. Auto-grounding mode ungrounded write (Expected: Exit 0 Allowed + Receipt cut)',
    run: () => {
      clearReceipt();
      const payload = {
        tool: 'Write',
        input: {
          file_path: 'src/components/ModernCard.tsx',
          content: "import Animated from 'react-native-reanimated';",
        },
      };
      const res = runGateWithStdin(payload, ['--auto-ground']);
      const receiptCreated = fs.existsSync(receiptPath);
      return { pass: res.status === 0 && receiptCreated, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '12. Stop Gate: Repository without modified RN files (Expected: Exit 0 Allowed)',
    run: () => {
      const res = spawnSync('node', [stopGateScriptPath], {
        cwd: process.cwd(),
        encoding: 'utf8',
      });
      return { pass: res.status === 0, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '13. Stop Gate: Agent introduces severed API in modified line (Expected: Exit 2 Blocked)',
    run: () => {
      const gitSandbox = path.join(tempDir, 'git-repo-agent-bad');
      fs.mkdirSync(gitSandbox, { recursive: true });
      execSync('git init', { cwd: gitSandbox, stdio: 'ignore' });
      execSync('git config user.name "Test"', { cwd: gitSandbox, stdio: 'ignore' });
      execSync('git config user.email "test@example.com"', { cwd: gitSandbox, stdio: 'ignore' });

      // Initial clean commit
      fs.writeFileSync(path.join(gitSandbox, 'Card.tsx'), "import React from 'react';\nexport const Card = () => null;", 'utf8');
      execSync('git add . && git commit -m "initial"', { cwd: gitSandbox, stdio: 'ignore' });

      // Agent introduces severed API
      fs.writeFileSync(path.join(gitSandbox, 'Card.tsx'), "import React from 'react';\nimport { useAnimatedGestureHandler } from 'react-native-reanimated';\nconst h = useAnimatedGestureHandler({});\nexport const Card = () => null;", 'utf8');

      const res = spawnSync('node', [stopGateScriptPath], {
        cwd: gitSandbox,
        encoding: 'utf8',
      });
      const isBlocked = res.status === 2 && res.stderr.includes('STOP GATE: TASK COMPLETION REJECTED');
      return { pass: isBlocked, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '14. Stop Gate: Pre-existing legacy debt on untouched lines (Expected: Exit 0 Allowed)',
    run: () => {
      const gitSandbox = path.join(tempDir, 'git-repo-legacy-debt');
      fs.mkdirSync(gitSandbox, { recursive: true });
      execSync('git init', { cwd: gitSandbox, stdio: 'ignore' });
      execSync('git config user.name "Test"', { cwd: gitSandbox, stdio: 'ignore' });
      execSync('git config user.email "test@example.com"', { cwd: gitSandbox, stdio: 'ignore' });

      // Initial commit already has legacy tech debt on line 2
      const initialCode = "import React from 'react';\nimport { useAnimatedGestureHandler } from 'react-native-reanimated';\nconst h = useAnimatedGestureHandler({});\nexport const Button = () => <div style={{ color: 'blue' }} />;\n";
      fs.writeFileSync(path.join(gitSandbox, 'LegacyScreen.tsx'), initialCode, 'utf8');
      execSync('git add . && git commit -m "initial legacy"', { cwd: gitSandbox, stdio: 'ignore' });

      // Agent ONLY touches the button color on line 4 (untouched line 2/3 has legacy debt)
      const modifiedCode = "import React from 'react';\nimport { useAnimatedGestureHandler } from 'react-native-reanimated';\nconst h = useAnimatedGestureHandler({});\nexport const Button = () => <div style={{ color: 'purple' }} />;\n";
      fs.writeFileSync(path.join(gitSandbox, 'LegacyScreen.tsx'), modifiedCode, 'utf8');

      const res = spawnSync('node', [stopGateScriptPath], {
        cwd: gitSandbox,
        encoding: 'utf8',
      });
      const isAllowed = res.status === 0 && res.stderr.includes('Skipped');
      return { pass: isAllowed, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '15. Post-Tool Observation Shaper on verbose logs (Expected: Exit 0 + Compressed stderr)',
    run: () => {
      const verboseLog = Array(30).fill('info: bundling module [node_modules/something]').join('\n') +
        '\nwarning: Reanimated 4.x worklet detected with deprecated serialization\n' +
        Array(30).fill('info: packing asset').join('\n');

      const payload = {
        tool: 'Bash',
        output: verboseLog,
      };

      const res = spawnSync('node', [postToolScriptPath], {
        cwd: tempDir,
        input: JSON.stringify(payload),
        encoding: 'utf8',
      });

      const hasFilteredSignal = res.stderr.includes('OBSERVATION SHAPER') && res.stderr.includes('Reanimated 4.x worklet');
      return { pass: res.status === 0 && hasFilteredSignal, exitCode: res.status, stderr: res.stderr };
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
  console.log('🎉 ALL 15 PRODUCTION-GRADE INVARIANT TESTS PASSED WITH 100% SUCCESS!');
  process.exit(0);
} else {
  console.log('❌ SOME INVARIANT TESTS FAILED');
  process.exit(1);
}
