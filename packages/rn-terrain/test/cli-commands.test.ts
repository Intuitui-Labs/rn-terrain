import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cac } from 'cac';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { cli, runCli } from '../src/cli.js';
import { registerAllCommands } from '../src/commands/index.js';
import { BitemporalGate } from '@intuitui-labs/rn-terrain-core';
import { registerHookCommands } from '../src/commands/hooks.js';
import { registerBitemporalCommands } from '../src/commands/bitemporal.js';

describe('RN-Terrain CLI Command Registry & Bitemporal Hardening', () => {
  it('registers all domain command modules into the flagship CLI', () => {
    const testCli = cac('test-cli');
    registerAllCommands(testCli);

    const commandNames = testCli.commands.map((c) => c.name);

    // Verify bitemporal intelligence commands
    expect(commandNames).toContain('check');
    expect(commandNames).toContain('pre-write');
    expect(commandNames).toContain('offer');
    expect(commandNames).toContain('gravity');
    expect(commandNames).toContain('ingest');
    expect(commandNames).toContain('context');
    expect(commandNames).toContain('offers');
    expect(commandNames).toContain('gate:answer');

    // Verify git hook commands
    expect(commandNames).toContain('hooks:install');
    expect(commandNames).toContain('hooks:pre-commit');
    expect(commandNames).toContain('hooks:pre-push');

    // Verify compiler, AST, and scanner commands
    expect(commandNames).toContain('audit:nitro');
    expect(commandNames).toContain('verify:yoga');
    expect(commandNames).toContain('verify:hermes');
    expect(commandNames).toContain('audit:honeypot');

    // Verify discovery, compass, and topology commands
    expect(commandNames).toContain('compass');
    expect(commandNames).toContain('alternatives');
    expect(commandNames).toContain('ecosystem');
    expect(commandNames).toContain('radar:add');
    expect(commandNames).toContain('radar:list');
    expect(commandNames).toContain('doctor');
    expect(commandNames).toContain('doctor:deps');
    expect(commandNames).toContain('doctor:stack');
    expect(commandNames).toContain('lint');
    expect(commandNames).toContain('lint:rules');
    expect(commandNames).toContain('codemod:apply');
    expect(commandNames).toContain('audit:native');
    expect(commandNames).toContain('audit:seams');
    expect(commandNames).toContain('diff:flags');
    expect(commandNames).toContain('align');
    expect(commandNames).toContain('sync:directory');
    expect(commandNames).toContain('sync');
    expect(commandNames).toContain('seed:archive');
    expect(commandNames).toContain('seed:curated');
    expect(commandNames).toContain('agent:views');
    expect(commandNames).toContain('incidents:list');
    expect(commandNames).toContain('swarm:status');
    expect(commandNames).toContain('preview');
    expect(commandNames).toContain('init');
    expect(commandNames).toContain('mcp');

    // Check total command count is modular and comprehensive
    expect(testCli.commands.length).toBeGreaterThanOrEqual(45);
  });

  describe('Bitemporal Commands & Gates', () => {
    it('accurately evaluates bitemporal package checks via BitemporalGate', () => {
      const gate = new BitemporalGate();

      // 1. Invented / hallucinated version -> refused
      const inventedCheck = gate.checkPackage({
        asked: 'react-native-reanimated',
        action: 'bump',
        requestedVersion: '4.999.0',
        dryRun: true,
      });
      expect(inventedCheck.data.refused_invented).toBe(1);
      expect(inventedCheck.data.decision).toBe('refuse');

      // 2. Sacred pin protection -> ask / guarded
      const sacredCheck = gate.checkPackage({
        asked: 'react-native-reanimated',
        action: 'bump',
        requestedVersion: 'latest',
        dryRun: true,
      });
      expect(sacredCheck.data.sacred_pin).toBe(1);
      expect(sacredCheck.data.decision).toBe('ask');

      // 3. Training attractor rebuttal
      const attrCheck = gate.checkPackage({
        asked: '@nozbe/watermelondb',
        action: 'bump',
        requestedVersion: 'latest',
        dryRun: true,
      });
      expect(attrCheck.data.training_attractors.length).toBeGreaterThan(0);
      expect(attrCheck.data.decision_reasons.some((r) => r.code === 'training_gravity')).toBe(true);
    });

    it('intercepts severed APIs before code touches disk via preWrite', () => {
      const gate = new BitemporalGate();

      // Severed API usage
      const badSnippet = `
        import { useAnimatedGestureHandler } from 'react-native-reanimated';
        const handler = useAnimatedGestureHandler({});
      `;
      const resBad = gate.preWrite({
        codeSnippet: badSnippet,
        dryRun: true,
      });
      expect(resBad.data.decision).toBe('refuse');
      expect(resBad.data.imports.some((i) => i.decision === 'refuse')).toBe(true);

      // Clean modern API usage
      const goodSnippet = `
        import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
        import { Gesture } from 'react-native-gesture-handler';
      `;
      const resGood = gate.preWrite({
        codeSnippet: goodSnippet,
        dryRun: true,
      });
      expect(resGood.data.decision).not.toBe('refuse');
    });

    it('creates escrow bump offers with dryRun safety', () => {
      const gate = new BitemporalGate();
      const offerRes = gate.createOffer({
        asked: 'clsx',
        requestedVersion: '2.1.1',
        dryRun: true,
        offeredBy: 'test-agent',
      });

      expect(offerRes.ok).toBe(true);
      expect(offerRes.data.state).toBe('escrow');
      expect(offerRes.data.dry_run).toBe(true);
      expect(offerRes.data.inserted).toBe(false);
    });
  });

  describe('Git Hooks Installation', () => {
    let tmpDir: string;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rn-terrain-hooks-test-'));
      fs.mkdirSync(path.join(tmpDir, '.git', 'hooks'), { recursive: true });
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('installs native git pre-commit hook into .git/hooks/', () => {
      const testCli = cac('test-cli');
      registerHookCommands(testCli);

      const preCommitHook = path.join(tmpDir, '.git', 'hooks', 'pre-commit');
      expect(fs.existsSync(preCommitHook)).toBe(false);

      // Parse and execute hooks:install
      testCli.parse(['node', 'test', 'hooks:install', tmpDir]);

      expect(fs.existsSync(preCommitHook)).toBe(true);
      const content = fs.readFileSync(preCommitHook, 'utf8');
      expect(content).toContain('rn-terrain hooks:pre-commit');
    });

    it('installs husky pre-commit hook when --husky is specified', () => {
      const testCli = cac('test-cli');
      registerHookCommands(testCli);

      const huskyHook = path.join(tmpDir, '.husky', 'pre-commit');
      expect(fs.existsSync(huskyHook)).toBe(false);

      testCli.parse(['node', 'test', 'hooks:install', tmpDir, '--husky']);

      expect(fs.existsSync(huskyHook)).toBe(true);
      const content = fs.readFileSync(huskyHook, 'utf8');
      expect(content).toContain('rn-terrain hooks:pre-commit');
    });
  });
});
