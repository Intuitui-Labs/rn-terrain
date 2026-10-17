#!/usr/bin/env node
/**
 * @file test-simulation-suite.mjs
 * End-to-End Multi-Agent Simulation Suite for RN-Terrain.
 *
 * Simulates 5 realistic AI agent missions across multi-agent workflows:
 *   Mission 1: MMKV Nitro C++ Migration (LLM confabulation -> Veto -> Remediation -> Success)
 *   Mission 2: Headless Yoga Layout Prover (0px ScrollView collapse -> Veto -> Bound Fix -> Success)
 *   Mission 3: Hallucinated Batch Storage (AsyncStorage.multiGetBatch trapdoor -> Veto -> Success)
 *   Mission 4: Hermes Worklet Closure Escapes (window capture -> Veto -> Pure Worklet -> Success)
 *   Mission 5: Cross-Worktree P2P Antibody Gossip (.terrain/gossip.db replication across nodes)
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const tempDir = path.join(os.tmpdir(), `rn-terrain-sim-${Date.now()}`);
const stateDir = path.join(tempDir, '.agents', 'state');
const receiptPath = path.join(stateDir, 'receipt.json');
const gateScriptPath = path.resolve('.agents', 'gate.mjs');

fs.mkdirSync(stateDir, { recursive: true });

console.log('═════════════════════════════════════════════════════════════════');
console.log('🤖 RN-TERRAIN MULTI-AGENT LIVE SIMULATION SUITE');
console.log(`📁 Simulation Sandbox: ${tempDir}`);
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

function cutReceipt(packages = ['react-native', 'react-native-reanimated']) {
  const timestamp = new Date().toISOString();
  const pkgMap = {};
  for (const p of packages) {
    pkgMap[p] = { version: '0.78.0', timestamp };
  }
  const receipt = {
    lastGrounding: timestamp,
    lastAction: 'tcdi_compass',
    packages: pkgMap,
  };
  fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2), 'utf8');
}

const missions = [
  {
    name: 'Mission 1: MMKV Nitro C++ Migration & Self-Healing',
    run: async () => {
      cutReceipt(['react-native']);
      // Step 1: Agent tries legacy Bridge NativeModules.MMKV
      const badPayload = {
        tool: 'Write',
        input: {
          file_path: 'src/storage/UserStorage.ts',
          content: `import { NativeModules } from 'react-native';
const { MMKV } = NativeModules;
export function getStoredToken() {
  return MMKV.getString('token');
}
`,
        },
      };

      const step1 = runGateWithStdin(badPayload);
      const step1Vetoed = step1.status === 2 && step1.stderr.includes('NITRO C++ NATIVE ARCHITECTURE VETO');
      if (!step1Vetoed) {
        return { pass: false, error: 'Step 1 expected Exit 2 with Nitro C++ Veto, got Exit ' + step1.status };
      }

      // Step 2: Agent reads remediation and updates to modern Nitro HybridObject
      const healedPayload = {
        tool: 'Write',
        input: {
          file_path: 'src/storage/UserStorage.ts',
          content: `import { NitroModules } from 'react-native-nitro-modules';
import type { MMKVSpec } from './MMKV.nitro';

const storage = NitroModules.createHybridObject<MMKVSpec>('MMKV');
export function getStoredToken() {
  return storage.getString('token');
}
`,
        },
      };

      cutReceipt(['react-native', 'react-native-nitro-modules']);
      const step2 = runGateWithStdin(healedPayload);
      if (step2.status !== 0) {
        return { pass: false, error: 'Step 2 expected Exit 0, got Exit ' + step2.status + ': ' + step2.stderr };
      }

      return { pass: true, details: 'Vetoed Bridge confabulation -> Healed to Nitro HybridObject' };
    },
  },
  {
    name: 'Mission 2: Headless Yoga Layout Prover (0px ScrollView Collapse)',
    run: async () => {
      cutReceipt(['react-native']);
      // Step 1: Agent writes unconstrained ScrollView inside container
      const unconstrainedPayload = {
        tool: 'Write',
        input: {
          file_path: 'src/screens/ProductFeed.tsx',
          content: `import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export const ProductFeed = () => (
  <View>
    <ScrollView>
      <Text>Item 1</Text>
      <Text>Item 2</Text>
    </ScrollView>
  </View>
);
`,
        },
      };

      const step1 = runGateWithStdin(unconstrainedPayload);
      const step1Vetoed = step1.status === 2 && step1.stderr.includes('YOGA VIRTUAL LAYOUT PROVER');
      if (!step1Vetoed) {
        return { pass: false, error: 'Step 1 expected Exit 2 with Yoga Layout Prover veto, got Exit ' + step1.status };
      }

      // Step 2: Agent fixes bounds by applying flex: 1 and contentContainerStyle
      const boundedPayload = {
        tool: 'Write',
        input: {
          file_path: 'src/screens/ProductFeed.tsx',
          content: `import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';

export const ProductFeed = () => (
  <View style={styles.container}>
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text>Item 1</Text>
      <Text>Item 2</Text>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { flexGrow: 1, padding: 16 },
});
`,
        },
      };

      const step2 = runGateWithStdin(boundedPayload);
      if (step2.status !== 0) {
        return { pass: false, error: 'Step 2 expected Exit 0, got Exit ' + step2.status + ': ' + step2.stderr };
      }

      return { pass: true, details: 'Detected 0px collapse -> Fixed with explicit flex bounds' };
    },
  },
  {
    name: 'Mission 3: Parametric Hallucination Honeypot (AsyncStorage.multiGetBatch)',
    run: async () => {
      cutReceipt(['react-native', '@react-native-async-storage/async-storage']);
      // Step 1: Agent calls hallucinated multiGetBatch
      const honeypotPayload = {
        tool: 'Write',
        input: {
          file_path: 'src/storage/CacheStore.ts',
          content: `import AsyncStorage from '@react-native-async-storage/async-storage';

export async function fetchBatchKeys(keys: string[]) {
  return await AsyncStorage.multiGetBatch(keys);
}
`,
        },
      };

      const step1 = runGateWithStdin(honeypotPayload);
      const step1Vetoed = step1.status === 2 && step1.stderr.includes('PARAMETRIC HALLUCINATION TRAPDOOR');
      if (!step1Vetoed) {
        return { pass: false, error: 'Step 1 expected Exit 2 with Trapdoor Veto, got Exit ' + step1.status };
      }

      // Step 2: Agent corrects to canonical AsyncStorage.multiGet
      const canonicalPayload = {
        tool: 'Write',
        input: {
          file_path: 'src/storage/CacheStore.ts',
          content: `import AsyncStorage from '@react-native-async-storage/async-storage';

export async function fetchBatchKeys(keys: string[]) {
  return await AsyncStorage.multiGet(keys);
}
`,
        },
      };

      const step2 = runGateWithStdin(canonicalPayload);
      if (step2.status !== 0) {
        return { pass: false, error: 'Step 2 expected Exit 0, got Exit ' + step2.status + ': ' + step2.stderr };
      }

      return { pass: true, details: 'Trapped hallucinated method -> Replaced with canonical multiGet' };
    },
  },
  {
    name: 'Mission 4: Headless Hermes Bytecode Sentry (Host Object Worklet Escape)',
    run: async () => {
      cutReceipt(['react-native', 'react-native-reanimated']);
      // Step 1: Agent captures window/document host object inside worklet
      const badWorkletPayload = {
        tool: 'Write',
        input: {
          file_path: 'src/animations/CardAnimation.ts',
          content: `import { View } from 'react-native';

export function animateCard() {
  const panGesture = () => {
    'worklet';
    const title = window.document.title;
    return title;
  };
  return panGesture;
}
`,
        },
      };

      const step1 = runGateWithStdin(badWorkletPayload);
      const step1Vetoed = step1.status === 2 && step1.stderr.includes('HERMES');
      if (!step1Vetoed) {
        return { pass: false, error: 'Step 1 expected Exit 2 with Hermes Veto, got Exit ' + step1.status };
      }

      // Step 2: Agent passes pure thread-safe serialized parameters
      const cleanWorkletPayload = {
        tool: 'Write',
        input: {
          file_path: 'src/animations/CardAnimation.ts',
          content: `import { View } from 'react-native';

export function animateCard(targetTitle: string) {
  const panGesture = () => {
    'worklet';
    const title = targetTitle;
    return title;
  };
  return panGesture;
}
`,
        },
      };

      const step2 = runGateWithStdin(cleanWorkletPayload);
      if (step2.status !== 0) {
        return { pass: false, error: 'Step 2 expected Exit 0, got Exit ' + step2.status + ': ' + step2.stderr };
      }

      return { pass: true, details: 'Blocked host object leak -> Converted to pure worklet closure' };
    },
  },
  {
    name: 'Mission 5: Cross-Worktree P2P Antibody Gossip Propagation',
    run: async () => {
      // Step 1: Worktree A triggers a severed API error
      cutReceipt(['react-native-reanimated']);
      const severedPayload = {
        tool: 'Write',
        input: {
          file_path: 'src/components/LegacyGesture.tsx',
          content: `import { useAnimatedGestureHandler } from 'react-native-reanimated';
export const handler = useAnimatedGestureHandler({});
`,
        },
      };

      const step1 = runGateWithStdin(severedPayload);
      if (step1.status !== 2) {
        return { pass: false, error: 'Step 1 expected Exit 2, got ' + step1.status };
      }

      // Step 2: Inspect P2P gossip bus database (.terrain/gossip.db) in core
      const corePkgPath = path.resolve('packages', 'core', 'dist', 'index.js');
      const coreMod = await import(pathToFileURL(corePkgPath).href);
      if (!coreMod.AntibodyGossipBus) {
        return { pass: false, error: 'AntibodyGossipBus not exported from core' };
      }

      const bus = new coreMod.AntibodyGossipBus(undefined, tempDir);
      const antibodies = bus.queryAntibodies();

      const found = antibodies.find(
        (a) => a.severedSymbol === 'useAnimatedGestureHandler' && a.culpritPackage === 'react-native-reanimated'
      );

      if (!found) {
        return { pass: false, error: 'Antibody was not published to gossip bus. Antibodies found: ' + antibodies.length };
      }

      return {
        pass: true,
        details: `Antibody ${found.severedSymbol} broadcasted with ID ${found.antibodyId.slice(0, 8)}`,
      };
    },
  },
];

let allPassed = true;

for (const m of missions) {
  process.stdout.write(`▶ ${m.name}... `);
  try {
    const outcome = await m.run();
    if (outcome.pass) {
      console.log(`✓ SUCCESS (${outcome.details})`);
    } else {
      console.log(`✗ FAILED: ${outcome.error}`);
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
  console.log('🎉 ALL 5 LIVE MULTI-AGENT SIMULATION MISSIONS COMPLETED SUCCESSFULLY!');
  process.exit(0);
} else {
  console.log('❌ SOME MULTI-AGENT SIMULATION MISSIONS FAILED');
  process.exit(1);
}
