import { describe, it, expect } from 'vitest';
import * as Root from '../src/index.js';
import * as Doctor from '../src/doctor/index.js';
import * as Scanner from '../src/scanner/index.js';
import * as Openeval from '../src/openeval/index.js';
import { createMcpServer } from '../src/mcp/index.js';

describe('@intuitui-labs/rn-terrain Unified Flagship Architecture', () => {
  it('exposes core APIs from root export', () => {
    expect(Root.generateAgentCompass).toBeDefined();
    expect(Root.NodeModulesAffordanceEngine).toBeDefined();
    expect(Root.CapabilityResolver).toBeDefined();
    expect(Root.CanonicalDatabase).toBeDefined();
    expect(Root.createCatalog).toBeDefined();
    expect(Root.CuratedKnowledgeBridge).toBeDefined();
    expect(Root.RustToolingDoctor).toBeDefined();
  });

  it('exposes unified diagnostic suite from /doctor subpath', () => {
    expect(Doctor.TcdiDependencyDoctor).toBeDefined();
    expect(Doctor.detectNativeSurface).toBeDefined();
    expect(Doctor.loadTerrainConfig).toBeDefined();
    expect(Doctor.TcdiStackDoctor).toBeDefined();
    expect(Doctor.ExpoDoctorBridge).toBeDefined();
    expect(Doctor.RustToolingDoctor).toBeDefined();
    expect(Doctor.SACRED_NATIVE_PINS).toBeDefined();
  });

  it('exposes AST and Tree-sitter tools from /scanner subpath', () => {
    expect(Scanner.scan).toBeDefined();
    expect(Scanner.walkProject).toBeDefined();
    expect(Scanner.AgentGuardrail).toBeDefined();
    expect(Scanner.TreeSitterMatcher).toBeDefined();
  });

  it('exposes 6-dimension evaluation framework from /openeval subpath', () => {
    expect(Openeval.evaluatePackage).toBeDefined();
    expect(Openeval.DEFAULT_WEIGHT_PROFILE).toBeDefined();
    expect(Openeval.WEIGHT_PROFILES).toBeDefined();
  });

  it('creates programmatic MCP server instance cleanly', () => {
    const server = createMcpServer();
    expect(server).toBeDefined();
  });
});
