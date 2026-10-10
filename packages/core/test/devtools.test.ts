import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CanonicalDatabase } from '../src/db/sqlite-client.js';
import { DevToolsRegistry, CANONICAL_DEV_TOOLS } from '../src/devtools/dev-tools-registry.js';
import {
  generatePnpmDevToolCompass,
  evaluatePnpmTerrain,
  PNPM_BITEMPORAL_EPOCHS,
  PNPM_SEVERED_COMMANDS
} from '../src/devtools/pnpm-terrain.js';
import {
  generateMcpDevToolCompass,
  evaluateMcpTerrain,
  MCP_BITEMPORAL_EPOCHS,
  MCP_ANTI_PATTERNS
} from '../src/devtools/mcp-terrain.js';
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

  it('evaluates mcp 1.30.1 across 6 OpenEval dimensions with ADOPT tier', () => {
    const scorecard = evaluateMcpTerrain('1.30.1');
    expect(scorecard.tool).toBe('mcp');
    expect(scorecard.version).toBe('1.30.1');
    expect(scorecard.overallScore).toBe(96);
    expect(scorecard.tier).toBe('ADOPT');
    expect(scorecard.dimensions.performanceAndEfficiency).toBeGreaterThan(9.0);
    expect(scorecard.dimensions.architecturalAlignment).toBe(10.0);
    expect(scorecard.rationales.length).toBeGreaterThan(3);
  });

  it('tracks bitemporal epochs and anti-patterns for mcp', () => {
    expect(MCP_BITEMPORAL_EPOCHS.length).toBeGreaterThanOrEqual(4);
    const latestEpoch = MCP_BITEMPORAL_EPOCHS[MCP_BITEMPORAL_EPOCHS.length - 1];
    expect(latestEpoch?.version).toBe('1.30.1');
    expect(latestEpoch?.architectureLevel).toBe('TRI_CAPABILITY_RESOURCES_PROMPTS_TOOLS');

    const stdoutCorrupt = MCP_ANTI_PATTERNS.find((a) => a.pattern.includes('console.log'));
    expect(stdoutCorrupt).toBeDefined();
    expect(stdoutCorrupt?.severity).toBe('FATAL_CRASH');
  });

  it('generates grounded PreFlight DevTool Compass for MCP and persists records to SQLite', () => {
    const compass = generateMcpDevToolCompass('1.30.1', db);

    expect(compass.tool).toBe('mcp');
    expect(compass.activeVersion).toBe('1.30.1');
    expect(compass.status).toBe('RECOMMENDED');
    expect(compass.bannedPatterns.length).toBeGreaterThan(0);
    expect(compass.canonicalArchitectures).toContain('Tri-Capability Architecture: Tools + Resources + Prompts');
    expect(compass.preflightInstruction).toContain('[PRE-FLIGHT DEVTOOL GROUNDING for mcp@1.30.1]');

    // Verify database record written
    const devToolDb = db.getDevTool('mcp');
    expect(devToolDb).toBeDefined();
    expect(devToolDb?.category).toBe('AGENT_PROTOCOL');

    const scoreDb = db.getLatestScore('mcp', '1.30.1');
    expect(scoreDb).toBeDefined();
    expect(scoreDb?.overall_score).toBe(96);
  });
});

