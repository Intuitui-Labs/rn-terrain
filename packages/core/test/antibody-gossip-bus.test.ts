import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { AntibodyGossipBus } from '../src/swarm/antibody-gossip-bus.js';

describe('AntibodyGossipBus', () => {
  let tmpDir: string;
  let dbPath: string;
  let bus: AntibodyGossipBus;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rn-terrain-gossip-test-'));
    dbPath = path.join(tmpDir, 'test-gossip.db');
    bus = new AntibodyGossipBus(dbPath, tmpDir);
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  });

  it('initializes and reports initial empty status', () => {
    const status = bus.getStatus();
    expect(status.totalAntibodies).toBe(0);
    expect(status.dbPath).toBe(dbPath);
  });

  it('publishes and queries an antibody shard', () => {
    const shard = bus.publishAntibody({
      severedSymbol: 'useAnimatedGestureHandler',
      culpritPackage: 'react-native-reanimated',
      canonicalRemediation: 'Gesture.Pan() from react-native-gesture-handler',
      worktreeOrigin: 'feat-auth',
    });

    expect(shard.antibodyId).toBeDefined();
    expect(shard.severedSymbol).toBe('useAnimatedGestureHandler');

    const results = bus.queryAntibodies({ package: 'react-native-reanimated' });
    expect(results.length).toBe(1);
    expect(results[0].severedSymbol).toBe('useAnimatedGestureHandler');
    expect(results[0].worktreeOrigin).toBe('feat-auth');
  });

  it('updates antibody and avoids duplicate entries on conflict', () => {
    bus.publishAntibody({
      severedSymbol: 'AsyncStorage',
      culpritPackage: 'react-native',
      canonicalRemediation: 'use @react-native-async-storage/async-storage',
      worktreeOrigin: 'feat-profile',
    });

    bus.publishAntibody({
      severedSymbol: 'AsyncStorage',
      culpritPackage: 'react-native',
      canonicalRemediation: 'use react-native-mmkv',
      worktreeOrigin: 'feat-profile-updated',
    });

    const results = bus.queryAntibodies({ symbol: 'AsyncStorage' });
    expect(results.length).toBe(1);
    expect(results[0].canonicalRemediation).toBe('use react-native-mmkv');
    expect(results[0].worktreeOrigin).toBe('feat-profile-updated');
  });

  it('queries antibodies filtered by package', () => {
    bus.publishAntibody({
      severedSymbol: 'findNodeHandle',
      culpritPackage: 'react-native',
      canonicalRemediation: 'useAnimatedRef',
    });
    bus.publishAntibody({
      severedSymbol: 'useAnimatedGestureHandler',
      culpritPackage: 'react-native-reanimated',
      canonicalRemediation: 'Gesture.Pan()',
    });

    const rnResults = bus.queryAntibodies({ package: 'react-native' });
    expect(rnResults.length).toBe(1);
    expect(rnResults[0].severedSymbol).toBe('findNodeHandle');

    const reanimResults = bus.queryAntibodies({ package: 'react-native-reanimated' });
    expect(reanimResults.length).toBe(1);
    expect(reanimResults[0].severedSymbol).toBe('useAnimatedGestureHandler');
  });
});
