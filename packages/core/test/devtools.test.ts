import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CanonicalDatabase } from '../src/db/sqlite-client.js';
import { DevToolsRegistry, CANONICAL_DEV_TOOLS } from '../src/devtools/dev-tools-registry.js';
import {
  generatePnpmDevToolCompass,
  evaluatePnpmTerrain,
  PNPM_BITEMPORAL_EPOCHS,
  PNPM_SEVERED_COMMANDS
} from '../src/devtools/pnpm-terrain.js';
import fs from 'node:fs';
import path from 'node:path';

describe('DevTools Layer & Recursive PNPM Terrain Evaluation', () => {
  const testDbPath = path.resolve(__dirname, 'devtools-test.db');
  let db: CanonicalDatabase;

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    db = new CanonicalDatabase(testDbPath);
  });

  afterEach(() => {
    db.close();
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
  });

  it('seeds canonical dev tools into database registry', () => {
    const registry = new DevToolsRegistry(db);
    registry.seedDefaults();

    const toolsInDb = db.getAllDevTools();
    expect(toolsInDb.length).toBeGreaterThanOrEqual(CANONICAL_DEV_TOOLS.length);

    const pnpmTool = db.getDevTool('pnpm');
    expect(pnpmTool).toBeDefined();
    expect(pnpmTool?.category).toBe('PACKAGE_MANAGER');
    expect(pnpmTool?.status).toBe('RECOMMENDED');

    const rgTool = db.getDevTool('rg');
    expect(rgTool).toBeDefined();
    expect(rgTool?.category).toBe('RUST_SHINY_TOOL');
  });

  it('evaluates pnpm 12.11.2 across 6 OpenEval dimensions with ADOPT tier', () => {
    const scorecard = evaluatePnpmTerrain('12.11.2');
    expect(scorecard.tool).toBe('pnpm');
    expect(scorecard.version).toBe('12.11.2');
    expect(scorecard.overallScore).toBe(95);
    expect(scorecard.tier).toBe('ADOPT');
    expect(scorecard.dimensions.performanceAndEfficiency).toBeGreaterThan(9.0);
    expect(scorecard.dimensions.supplyChainSecurity).toBeGreaterThan(9.5);
    expect(scorecard.rationales.length).toBeGreaterThan(3);
  });

  it('tracks bitemporal epochs and severed commands for pnpm', () => {
    expect(PNPM_BITEMPORAL_EPOCHS.length).toBeGreaterThanOrEqual(5);
    const latestEpoch = PNPM_BITEMPORAL_EPOCHS[PNPM_BITEMPORAL_EPOCHS.length - 1];
    expect(latestEpoch?.version).toBe('12.11.2');
    expect(latestEpoch?.rnCompatibilityStatus).toBe('NATIVE_SYMLINKS_SUPPORTED');

    const severed = PNPM_SEVERED_COMMANDS.find((c) => c.commandOrFlag.includes('npm install'));
    expect(severed).toBeDefined();
    expect(severed?.severity).toBe('CRITICAL');
  });

  it('generates grounded PreFlight DevTool Compass and persists records to SQLite', () => {
    const compass = generatePnpmDevToolCompass('12.11.2', db);

    expect(compass.tool).toBe('pnpm');
    expect(compass.activeVersion).toBe('12.11.2');
    expect(compass.status).toBe('RECOMMENDED');
    expect(compass.bannedCommands.length).toBeGreaterThan(0);
    expect(compass.canonicalWorkflows).toContain('catalog: protocol in package.json');
    expect(compass.preflightInstruction).toContain('[PRE-FLIGHT DEVTOOL GROUNDING for pnpm@12.11.2]');

    // Verify database record written
    const devToolDb = db.getDevTool('pnpm');
    expect(devToolDb).toBeDefined();

    const scoreDb = db.getLatestScore('pnpm', '12.11.2');
    expect(scoreDb).toBeDefined();
    expect(scoreDb?.overall_score).toBe(95);
  });
});
