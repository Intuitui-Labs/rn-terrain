#!/usr/bin/env node
/**
 * @file test-harness-suite.mjs
 * Comprehensive Integration Test Suite for RN-Terrain Deterministic Harness Gates.
 *
 * Verifies all 10 control-plane invariants across Claude Code, Codex, and OpenCode:
 *   1. Clean RN write payload with fresh receipt -> ALLOW (Exit 0)
 *   2. Write buffer with severed useAnimatedGestureHandler -> BLOCKED (Exit 2)
 *   3. Edit buffer with severed usePanGesture -> BLOCKED (Exit 2)
 *   4. Write buffer with legacy AsyncStorage from react-native core -> BLOCKED (Exit 2)
 *   5. Strict mode ungrounded write -> BLOCKED (Exit 2)
 *   6. Auto-grounding mode ungrounded write -> ALLOW (Exit 0) + Receipt cut
 *   7. Stop gate on clean repository -> ALLOW (Exit 0)
 *   8. Stop gate on repository with severed API -> REJECTED (Exit 2)
 *   9. Post-tool observation shaper on verbose compiler logs -> ALLOW (Exit 0) + filtered signals
 *   10. CLI doctor:agents command -> Exit 0 + 100% health score
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync, execSync } from 'node:child_process';

const tempDir = path.join(os.tmpdir(), `rn-terrain-harness-test-${Date.now()}`);
const stateDir = path.join(tempDir, '.agents', 'state');
const receiptPath = path.join(stateDir, 'receipt.json');
const gateScriptPath = path.resolve('.agents', 'gate.mjs');
const stopGateScriptPath = path.resolve('.agents', 'stop-gate.mjs');
const postToolScriptPath = path.resolve('.agents', 'post-tool.mjs');
const cliScriptPath = path.resolve('packages', 'rn-terrain', 'bin', 'rn-terrain.js');

fs.mkdirSync(stateDir, { recursive: true });

console.log('═════════════════════════════════════════════════════════════════');
console.log('🧪 VERIFYING DETERMINISTIC HARNESS CONTROL-PLANE SUITE');
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

function cutReceipt(packageName = 'react-native-reanimated') {
  const timestamp = new Date().toISOString();
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

const tests = [
  {
    name: '1. Clean RN write payload with fresh receipt (Expected: Exit 0 Allowed)',
    run: () => {
      cutReceipt('react-native-gesture-handler');
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
      cutReceipt('react-native-reanimated');
      const payload = {
        tool: 'Write',
        input: {
          file_path: 'src/components/BadCard.tsx',
          content: "import { useAnimatedGestureHandler } from 'react-native-reanimated'; const handler = useAnimatedGestureHandler({});",
        },
      };
      const res = runGateWithStdin(payload);
      const isBlocked = res.status === 2 && res.stderr.includes('useAnimatedGestureHandler') && res.stderr.includes('BUFFER AST GATE');
      return { pass: isBlocked, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '3. Buffer AST Gate: Severed usePanGesture in Edit payload (Expected: Exit 2 Blocked)',
    run: () => {
      cutReceipt('react-native-gesture-handler');
      const payload = {
        tool: 'Edit',
        input: {
          file_path: 'src/components/LegacyGesture.tsx',
          old_string: '// placeholder',
          new_string: "const pan = usePanGesture();",
        },
      };
      const res = runGateWithStdin(payload);
      const isBlocked = res.status === 2 && res.stderr.includes('usePanGesture');
      return { pass: isBlocked, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '4. Buffer AST Gate: Severed AsyncStorage from react-native core (Expected: Exit 2 Blocked)',
    run: () => {
      cutReceipt('react-native');
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
    name: '5. Strict mode ungrounded write without receipt (Expected: Exit 2 Blocked)',
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
      const isBlocked = res.status === 2 && res.stderr.includes('NO ACTIVE GROUNDING RECEIPT FOUND');
      return { pass: isBlocked, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '6. Auto-grounding mode ungrounded write (Expected: Exit 0 Allowed + Receipt cut)',
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
    name: '7. Stop Gate: Repository without modified RN files (Expected: Exit 0 Allowed)',
    run: () => {
      const res = spawnSync('node', [stopGateScriptPath], {
        cwd: process.cwd(),
        encoding: 'utf8',
      });
      return { pass: res.status === 0, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '8. Stop Gate: Temporary Git repository with severed API (Expected: Exit 2 Blocked)',
    run: () => {
      const gitSandbox = path.join(tempDir, 'git-repo');
      fs.mkdirSync(gitSandbox, { recursive: true });
      execSync('git init', { cwd: gitSandbox, stdio: 'ignore' });
      execSync('git config user.name "Test"', { cwd: gitSandbox, stdio: 'ignore' });
      execSync('git config user.email "test@example.com"', { cwd: gitSandbox, stdio: 'ignore' });

      // Create an initial commit
      fs.writeFileSync(path.join(gitSandbox, 'README.md'), '# Repo', 'utf8');
      execSync('git add . && git commit -m "initial"', { cwd: gitSandbox, stdio: 'ignore' });

      // Introduce a modified RN file with severed API
      fs.writeFileSync(path.join(gitSandbox, 'BadComponent.tsx'), "import { useAnimatedGestureHandler } from 'react-native-reanimated';", 'utf8');

      const res = spawnSync('node', [stopGateScriptPath], {
        cwd: gitSandbox,
        encoding: 'utf8',
      });
      const isBlocked = res.status === 2 && res.stderr.includes('STOP GATE: TASK COMPLETION REJECTED');
      return { pass: isBlocked, exitCode: res.status, stderr: res.stderr };
    },
  },
  {
    name: '9. Post-Tool Observation Shaper on verbose logs (Expected: Exit 0 + Compressed stderr)',
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
  {
    name: '10. CLI doctor:agents verification (Expected: Exit 0 + 100% Score)',
    run: () => {
      const res = spawnSync('node', [cliScriptPath, 'doctor:agents'], {
        cwd: process.cwd(),
        encoding: 'utf8',
      });
      const isClean = res.status === 0 && res.stdout.includes('100%');
      return { pass: isClean, exitCode: res.status, stderr: res.stderr };
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
  console.log('🎉 ALL 10 CONTROL-PLANE INVARIANT TESTS PASSED WITH 100% SUCCESS!');
  process.exit(0);
} else {
  console.log('❌ SOME CONTROL-PLANE INVARIANT TESTS FAILED');
  process.exit(1);
}
