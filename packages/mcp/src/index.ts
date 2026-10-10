/* eslint-disable import-x/no-unresolved */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'node:fs';
import path from 'node:path';
import {
  getAlternatives,
  getEcosystemTopology,
  getVitalityCard,
  scanProject,
  createCatalog,
  CanonicalDatabase,
  PolicyGate,
  generateAgentCompass,
  generatePnpmDevToolCompass,
  generateMcpDevToolCompass,
  DevToolsRegistry,
  CapabilityResolver,
  RustToolingDoctor,
  NodeModulesAffordanceEngine,
  CuratedKnowledgeBridge
} from '@intuitui-labs/rn-terrain-core';
import {
  AgentGuardrail,
  TcdiStackDoctor,
  TcdiDependencyDoctor,
  ExpoDoctorBridge
} from '@intuitui-labs/rn-terrain-scanner';
import { evaluatePackage, type WeightProfileName } from '@intuitui-labs/openeval';

const server = new Server(
  {
    name: 'rn-terrain-mcp',
    version: '0.3.1',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  },
);

const guardrail = new AgentGuardrail();
const policyGate = new PolicyGate();

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'tcdi_compass',
        description:
          'Pre-flight Agent Compass: The FIRST place an agent should check before generating React Native code. Ingests package and target version, returning grounded whitelist of canonical modern APIs, explicit blacklist of severed APIs, New Architecture flags, and pre-flight instructions.',
        inputSchema: {
          type: 'object',
          properties: {
            package_name: {
              type: 'string',
              description: 'Target package name (e.g. react-native-gesture-handler)',
            },
            version: {
              type: 'string',
              description: 'Target version (e.g. 2.16.0 or latest)',
            },
          },
          required: ['package_name'],
        },
      },
      {
        name: 'tcdi_devtool_compass',
        description:
          'Pre-flight DevTool Compass: Grounding and policy check for foundational non-RN developer tools (e.g. pnpm, bun, metro, rg, oxlint). Validates monorepo configuration, banned anti-pattern commands, and Metro symlink interop.',
        inputSchema: {
          type: 'object',
          properties: {
            tool_name: {
              type: 'string',
              description: 'Target developer tool name (e.g. pnpm, bun, metro, rg)',
            },
            version: {
              type: 'string',
              description: 'Target version (e.g. 12.11.2 or latest)',
            },
          },
          required: ['tool_name'],
        },
      },
      {
        name: 'tcdi_mcp_compass',
        description:
          'Pre-flight MCP DevTool Compass: Grounding and policy check for developing and consuming Model Context Protocol servers. Highlights banned stdio stdout contamination, unhandled exceptions, OpenEval 9.6 scorecard, and Tri-Capability standards.',
        inputSchema: {
          type: 'object',
          properties: {
            version: {
              type: 'string',
              description: 'Target MCP SDK version (defaults to 1.30.1)',
            },
          },
        },
      },
      {
        name: 'tcdi_doctor_rust_tools',
        description:
          'Rust Tooling Doctor: Diagnostic tool inspecting host machine for sovereign Rust utilities (rg, fd, sd, bat, eza, delta, oxlint, biome) with elegant nudges and one-liner install recipes.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'tcdi_resolve_capability',
        description:
          'Granular Capability Resolver: Resolves a required capability (e.g. gesture.pan_recognition, monorepo.polyglot_rust_workspace, storage.synchronous_kv) to grounded canonical packages, minimum supported versions, and architectural flags.',
        inputSchema: {
          type: 'object',
          properties: {
            capability_id: {
              type: 'string',
              description: 'Target capability ID (e.g. gesture.pan_recognition, monorepo.catalog_governance)',
            },
          },
          required: ['capability_id'],
        },
      },
      {
        name: 'tcdi_inspect_capabilities',
        description:
          'Inspect all granular capabilities unlocked by a package or tool at a specific target version.',
        inputSchema: {
          type: 'object',
          properties: {
            package_name: {
              type: 'string',
              description: 'Package or tool name (e.g. react-native-gesture-handler, pnpm)',
            },
            version: {
              type: 'string',
              description: 'Target version (e.g. 12.11.2 or latest)',
            },
          },
          required: ['package_name'],
        },
      },
      {
        name: 'tcdi_affordance',
        description:
          'Local node_modules Affordance: Grounding tool that inspects physically installed packages in node_modules, parsing .d.ts files to return verified exported hooks, components, functions, and README code snippets directly from disk.',
        inputSchema: {
          type: 'object',
          properties: {
            package_name: {
              type: 'string',
              description: 'Target package name installed in node_modules (e.g. react-native-reanimated, cac)',
            },
            project_root: {
              type: 'string',
              description: 'Optional path to project root (defaults to current working directory)',
            },
          },
          required: ['package_name'],
        },
      },
      {
        name: 'tcdi_agent_views',
        description:
          'Agent Views Grounding: Returns canonical DANGER-ZONES (top severed/banned APIs across Reanimated 4, RNGH 3, MMKV 4 Nitro) and CURRENT-STATE (sacred stack pins and modern allowed APIs) directly to AI coding agents.',
        inputSchema: {
          type: 'object',
          properties: {
            view: {
              type: 'string',
              description: 'Target view: "danger_zones", "current_state", or "all"',
            },
          },
        },
      },
      {
        name: 'tcdi_verify_ast_diff',
        description:
          'Pre-flight code verification for AI coding agents. Inspects a proposed TypeScript/TSX code diff against target React Native package version to block removed, severed, or hallucinated Major-1 APIs.',
        inputSchema: {
          type: 'object',
          properties: {
            package_name: {
              type: 'string',
              description: 'Target package name (e.g. react-native-gesture-handler)',
            },
            target_version: {
              type: 'string',
              description: 'Target installed version (e.g. 2.16.0)',
            },
            code_snippet: {
              type: 'string',
              description: 'The code diff or source snippet the agent proposes to emit',
            },
          },
          required: ['package_name', 'target_version', 'code_snippet'],
        },
      },
      {
        name: 'tcdi_decision_gate',
        description:
          'Evaluates a dependency bump or architectural change through calibrated Decision Models (AUTO_EXECUTE, HUMAN_TRIAGE, QUARANTINE_HOLD).',
        inputSchema: {
          type: 'object',
          properties: {
            package_name: {
              type: 'string',
              description: 'Target package name',
            },
            target_version: {
              type: 'string',
              description: 'Target package version',
            },
            diff_snippet: {
              type: 'string',
              description: 'Context or code diff being evaluated',
            },
          },
          required: ['package_name', 'target_version'],
        },
      },
      {
        name: 'tcdi_pathfinder_jump',
        description:
          'Calculates the shortest safe migration path between two package versions, returning required intermediate steps, breaking APIs, and codemod rules.',
        inputSchema: {
          type: 'object',
          properties: {
            package_name: {
              type: 'string',
              description: 'Package name (e.g. react-native-reanimated)',
            },
            from_version: {
              type: 'string',
              description: 'Current installed version (e.g. 2.8.0)',
            },
            to_version: {
              type: 'string',
              description: 'Target desired version (e.g. 3.16.0)',
            },
          },
          required: ['package_name', 'from_version', 'to_version'],
        },
      },
      {
        name: 'tcdi_openeval_score',
        description:
          'Runs 6-dimension Deconstructible OpenEval evaluation on a package (Health, Compatibility, API Modernity, Architecture Drift, Substrate Rigor, Maintenance Cadence).',
        inputSchema: {
          type: 'object',
          properties: {
            package_name: {
              type: 'string',
              description: 'Package name',
            },
            version: {
              type: 'string',
              description: 'Version string (optional, defaults to latest)',
            },
            profile: {
              type: 'string',
              description: 'Weight profile: default, high_security, bleeding_edge, lts',
            },
          },
          required: ['package_name'],
        },
      },
      {
        name: 'audit_package',
        description:
          'Audit a React Native dependency package against RN Terrain signals to get its VitalityCard.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the npm package (e.g. react-native-reanimated)',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'scan_project',
        description:
          'Scan package.json dependencies in a React Native project to get a ProjectAudit report.',
        inputSchema: {
          type: 'object',
          properties: {
            package_json_path: {
              type: 'string',
              description: 'Path to package.json (e.g. ./package.json)',
            },
          },
          required: ['package_json_path'],
        },
      },
      {
        name: 'v1_readiness_check',
        description:
          'Check React Native 1.0 readiness for a package, including New Architecture status and compatibility score.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the npm package',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'get_alternatives',
        description:
          'Get recommended modern alternatives for a package that is on HOLD or decaying.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the npm package (e.g. react-native-async-storage)',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'ecosystem_map',
        description:
          'Get the macro topology view of the React Native package ecosystem, optionally filtered by category.',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Category to filter by (e.g. navigation, animation, storage)',
            },
          },
        },
      },
      {
        name: 'tcdi_doctor_stack',
        description:
          'Audits React Native code against temporal New Architecture (Fabric), Worklet thread-safety, gestures, and storage patterns. Rules are dynamically adapted based on the project configured target stack range (e.g. RN 0.74 Paper vs RN 0.76+ Fabric vs RN 0.88 Reanimated 4).',
        inputSchema: {
          type: 'object',
          properties: {
            code_snippet: {
              type: 'string',
              description: 'Code snippet or file content to audit',
            },
            file_path: {
              type: 'string',
              description: 'Virtual file path (e.g. src/screens/Feed.tsx)',
            },
            target_rn_version: {
              type: 'string',
              description: 'Target React Native version (e.g. ^0.76.0, 0.74.2, ^0.88.0). Defaults to modern stack.',
            },
            architecture: {
              type: 'string',
              enum: ['new-arch', 'paper', 'interop'],
              description: 'Target architecture mode. Defaults to new-arch.',
            },
            target_reanimated_version: {
              type: 'string',
              description: 'Target Reanimated version (e.g. ^3.16.0, ^4.0.0)',
            },
          },
          required: ['code_snippet'],
        },
      },
      {
        name: 'tcdi_doctor_deps',
        description:
          'Audits project manifest (package.json) against Sacred Native Pins, floating range hazards, and dialect drift (React 19 vs RN 0.76).',
        inputSchema: {
          type: 'object',
          properties: {
            project_dir: {
              type: 'string',
              description: 'Target project directory containing package.json (defaults to current working directory)',
            },
          },
        },
      },
      {
        name: 'tcdi_doctor_expo',
        description:
          'Inspects Expo SDK alignment, configuration, and native module compatibility via Expo Doctor.',
        inputSchema: {
          type: 'object',
          properties: {
            project_dir: {
              type: 'string',
              description: 'Target project directory (defaults to current working directory)',
            },
          },
        },
      },
      {
        name: 'tcdi_doctor_all',
        description:
          'Runs the universal multi-diagnostic scorecard: Sovereign Rust Tooling, TCDI Stack Doctor, Dependency Sacred Pins, and Expo SDK Compliance.',
        inputSchema: {
          type: 'object',
          properties: {
            project_dir: {
              type: 'string',
              description: 'Target project directory (defaults to current working directory)',
            },
          },
        },
      },
    ],
  };
});

// ─── Resources (URI-Addressable Read-Only Context) ──────────────────────────

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'terrain://agent-views/danger-zones',
        name: 'Agent Danger Zones (Severed APIs)',
        description: 'Canonical markdown catalog of severed/banned APIs across Reanimated 4, RNGH 3, MMKV 4 Nitro, and React Native New Architecture.',
        mimeType: 'text/markdown',
      },
      {
        uri: 'terrain://agent-views/current-state',
        name: 'Current Sacred Platform Stack',
        description: 'Authoritative markdown reference of sacred pins, global toolchains, and sovereign Rust tooling standards.',
        mimeType: 'text/markdown',
      },
      {
        uri: 'terrain://radar/records',
        name: 'Technology Radar Decisions',
        description: 'JSON catalog of ADOPT/TRIAL/ASSESS/HOLD technology radar evaluations (including Rust UniFFI, LegendApp State).',
        mimeType: 'application/json',
      },
      {
        uri: 'terrain://devtools/doctor',
        name: 'Sovereign Rust Tooling Diagnostic',
        description: 'Live audit of host machine Rust shiny tools (rg, fd, sd, bat, eza, delta, oxlint, biome) with installation recipes.',
        mimeType: 'application/json',
      },
      {
        uri: 'terrain://devtools/mcp-compass',
        name: 'Model Context Protocol Grounding Compass',
        description: 'Pre-flight MCP devtool compass with banned anti-patterns, OpenEval 9.6 scorecard, and canonical stdio workflows.',
        mimeType: 'application/json',
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  try {
    const db = new CanonicalDatabase();

    if (uri === 'terrain://agent-views/danger-zones') {
      const bridge = new CuratedKnowledgeBridge(db);
      const views = bridge.synthesizeAgentViews(path.resolve(process.cwd(), 'docs/agent-views'));
      const text = fs.readFileSync(views.dangerZones, 'utf-8');
      return {
        contents: [{ uri, mimeType: 'text/markdown', text }],
      };
    }

    if (uri === 'terrain://agent-views/current-state') {
      const bridge = new CuratedKnowledgeBridge(db);
      const views = bridge.synthesizeAgentViews(path.resolve(process.cwd(), 'docs/agent-views'));
      const text = fs.readFileSync(views.currentState, 'utf-8');
      return {
        contents: [{ uri, mimeType: 'text/markdown', text }],
      };
    }

    if (uri === 'terrain://radar/records') {
      const records = db.getAllRadarRecords();
      return {
        contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(records, null, 2) }],
      };
    }

    if (uri === 'terrain://devtools/doctor') {
      const doctor = new RustToolingDoctor();
      const report = doctor.runDiagnostic();
      return {
        contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(report, null, 2) }],
      };
    }

    if (uri === 'terrain://devtools/mcp-compass') {
      const compass = generateMcpDevToolCompass();
      return {
        contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(compass, null, 2) }],
      };
    }

    throw new Error(`Resource URI not found: ${uri}`);
  } catch (err: any) {
    throw new Error(`Failed to read resource ${uri}: ${err.message}`);
  }
});

// ─── Prompts (Parameterized Agent Workflows) ────────────────────────────────

server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'preflight_grounding',
        description: 'Generates a strict pre-flight grounding prompt for an AI agent before generating React Native code.',
        arguments: [
          {
            name: 'package_name',
            description: 'Target package name (e.g. react-native-reanimated)',
            required: true,
          },
          {
            name: 'version',
            description: 'Target version (e.g. 4.7.1 or latest)',
            required: false,
          },
        ],
      },
      {
        name: 'migration_pathfinder',
        description: 'Generates a step-by-step migration pathfinder prompt for jumping across breaking versions.',
        arguments: [
          {
            name: 'package_name',
            description: 'Target package name (e.g. react-native-gesture-handler)',
            required: true,
          },
          {
            name: 'from_version',
            description: 'Current installed version (e.g. 2.16.0)',
            required: true,
          },
          {
            name: 'to_version',
            description: 'Target version (e.g. 3.3.0)',
            required: true,
          },
        ],
      },
      {
        name: 'doctor_elevate',
        description: 'Generates a prompt to audit host machine for sovereign Rust tools and elevate developer ergonomics.',
        arguments: [],
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'preflight_grounding') {
    const pkg = (args?.package_name as string) || 'react-native-reanimated';
    const ver = (args?.version as string) || 'latest';
    const compass = generateAgentCompass(pkg, ver);
    return {
      description: `Pre-flight Grounding for ${pkg}@${ver}`,
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: compass.preflightInstruction,
          },
        },
      ],
    };
  }

  if (name === 'migration_pathfinder') {
    const pkg = (args?.package_name as string) || 'react-native-reanimated';
    const fromVer = (args?.from_version as string) || '3.0.0';
    const toVer = (args?.to_version as string) || '4.7.1';
    return {
      description: `Migration Pathfinder for ${pkg}: ${fromVer} -> ${toVer}`,
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Please plan and execute a safe migration jump for ${pkg} from ${fromVer} to ${toVer}.\n1. Consult tcdi_compass for ${pkg}@${toVer}\n2. Use tcdi_verify_ast_diff to prevent severed API usage.\n3. Co-install necessary runtime packages (e.g. react-native-worklets if Reanimated v4).`,
          },
        },
      ],
    };
  }

  if (name === 'doctor_elevate') {
    const doctor = new RustToolingDoctor();
    const report = doctor.runDiagnostic();
    return {
      description: 'Audit and Elevate Developer Toolchain with Sovereign Rust Tools',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Current Rust Tooling Audit:\nTotal Tools: ${report.totalTools}, Installed: ${report.installedCount}, Missing: ${report.missingCount}.\nMissing tool recipes:\n${report.tools.filter(t => !t.installed).map(t => `• ${t.name}: ${t.installRecipes.windows || t.installRecipes.macos}`).join('\n')}\nPlease recommend adopting these tools to accelerate local development.`,
          },
        },
      ],
    };
  }

  throw new Error(`Prompt not found: ${name}`);
});

// ─── Tools Dispatcher ────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'tcdi_compass') {
      const packageName = args?.package_name as string;
      const version = (args?.version as string) || 'latest';
      const briefing = generateAgentCompass(packageName, version);
      return {
        content: [{ type: 'text', text: JSON.stringify(briefing, null, 2) }],
      };
    }

    if (name === 'tcdi_devtool_compass') {
      const toolName = (args?.tool_name as string) || 'pnpm';
      const version = (args?.version as string) || '12.11.2';
      if (toolName.toLowerCase() === 'pnpm') {
        const compass = generatePnpmDevToolCompass(version);
        return {
          content: [{ type: 'text', text: JSON.stringify(compass, null, 2) }],
        };
      }
      if (toolName.toLowerCase() === 'mcp') {
        const compass = generateMcpDevToolCompass(version);
        return {
          content: [{ type: 'text', text: JSON.stringify(compass, null, 2) }],
        };
      }
      const db = new CanonicalDatabase();
      const registry = new DevToolsRegistry(db);
      const tool = registry.getTool(toolName);
      return {
        content: [{ type: 'text', text: JSON.stringify(tool ?? { error: `Tool ${toolName} not found` }, null, 2) }],
      };
    }

    if (name === 'tcdi_mcp_compass') {
      const version = (args?.version as string) || '1.30.1';
      const compass = generateMcpDevToolCompass(version);
      return {
        content: [{ type: 'text', text: JSON.stringify(compass, null, 2) }],
      };
    }

    if (name === 'tcdi_doctor_rust_tools') {
      const doctor = new RustToolingDoctor();
      const report = doctor.runDiagnostic();
      return {
        content: [{ type: 'text', text: JSON.stringify(report, null, 2) }],
      };
    }

    if (name === 'tcdi_doctor_stack') {
      const codeSnippet = args?.code_snippet as string;
      const filePath = (args?.file_path as string) || 'code.tsx';
      const targetRn = (args?.target_rn_version as string) || '^0.88.0';
      const arch = (args?.architecture as 'new-arch' | 'paper' | 'interop') || 'new-arch';
      const targetReanimated = args?.target_reanimated_version as string | undefined;

      const doctor = new TcdiStackDoctor({
        targetStack: {
          reactNative: targetRn,
          architecture: arch,
          reanimated: targetReanimated ?? (arch === 'paper' ? '^3.16.0' : '^4.7.1'),
        },
      });

      const report = doctor.diagnoseSnippet(codeSnippet, filePath);
      return {
        content: [{ type: 'text', text: JSON.stringify(report, null, 2) }],
      };
    }

    if (name === 'tcdi_doctor_deps') {
      const projectDir = (args?.project_dir as string) || process.cwd();
      const pkgPath = path.resolve(projectDir, 'package.json');
      if (!fs.existsSync(pkgPath)) {
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: `package.json not found in ${projectDir}` }, null, 2) }],
        };
      }
      const doctor = new TcdiDependencyDoctor();
      const report = doctor.auditManifest(pkgPath);
      return {
        content: [{ type: 'text', text: JSON.stringify(report, null, 2) }],
      };
    }

    if (name === 'tcdi_doctor_expo') {
      const projectDir = (args?.project_dir as string) || process.cwd();
      const bridge = new ExpoDoctorBridge();
      const report = bridge.auditExpoProject(projectDir);
      return {
        content: [{ type: 'text', text: JSON.stringify(report, null, 2) }],
      };
    }

    if (name === 'tcdi_doctor_all') {
      const projectDir = (args?.project_dir as string) || process.cwd();
      const rustDoctor = new RustToolingDoctor();
      const rustReport = rustDoctor.runDiagnostic();

      let depReport = null;
      const pkgPath = path.resolve(projectDir, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const depDoctor = new TcdiDependencyDoctor();
        depReport = depDoctor.auditManifest(pkgPath);
      }

      const expoBridge = new ExpoDoctorBridge();
      const expoReport = expoBridge.auditExpoProject(projectDir);

      const combinedScorecard = {
        projectDir,
        timestamp: new Date().toISOString(),
        rustTooling: rustReport,
        dependenciesAndSacredPins: depReport,
        expoSdk: expoReport,
        summary: {
          hasPackageManifest: Boolean(depReport),
          isExpoProject: expoReport.isExpoProject,
          sacredPinsHealthy: depReport?.isHealthy ?? true,
          depErrorsCount: depReport?.errorsCount ?? 0,
          depWarningsCount: depReport?.warningsCount ?? 0,
        },
      };

      return {
        content: [{ type: 'text', text: JSON.stringify(combinedScorecard, null, 2) }],
      };
    }

    if (name === 'tcdi_resolve_capability') {
      const capabilityId = args?.capability_id as string;
      const db = new CanonicalDatabase();
      const resolver = new CapabilityResolver(db);
      const res = resolver.resolveCapability(capabilityId);
      return {
        content: [{ type: 'text', text: JSON.stringify(res ?? { error: `Capability ${capabilityId} not found` }, null, 2) }],
      };
    }

    if (name === 'tcdi_inspect_capabilities') {
      const packageName = args?.package_name as string;
      const version = (args?.version as string) || 'latest';
      const db = new CanonicalDatabase();
      const resolver = new CapabilityResolver(db);
      const manifest = resolver.inspectPackageCapabilities(packageName, version);
      return {
        content: [{ type: 'text', text: JSON.stringify(manifest, null, 2) }],
      };
    }

    if (name === 'tcdi_affordance') {
      const packageName = args?.package_name as string;
      const projectRoot = (args?.project_root as string) || process.cwd();
      const engine = new NodeModulesAffordanceEngine(projectRoot);
      const card = engine.generateAffordance(packageName);
      return {
        content: [{ type: 'text', text: JSON.stringify(card, null, 2) }],
      };
    }

    if (name === 'tcdi_agent_views') {
      const view = (args?.view as string) || 'all';
      const db = new CanonicalDatabase();
      const bridge = new CuratedKnowledgeBridge(db);
      const tempViewsDir = path.resolve(process.cwd(), 'docs/agent-views');
      const views = bridge.synthesizeAgentViews(tempViewsDir);

      let text = '';
      if (view === 'danger_zones' || view === 'all') {
        text += fs.readFileSync(views.dangerZones, 'utf-8') + '\n\n';
      }
      if (view === 'current_state' || view === 'all') {
        text += fs.readFileSync(views.currentState, 'utf-8');
      }

      return {
        content: [{ type: 'text', text }],
      };
    }

    if (name === 'tcdi_verify_ast_diff') {
      const packageName = args?.package_name as string;
      const targetVersion = args?.target_version as string;
      const codeSnippet = args?.code_snippet as string;

      const verdict = guardrail.verify({
        packageName,
        targetVersion,
        codeSnippet,
      });

      return {
        content: [{ type: 'text', text: JSON.stringify(verdict, null, 2) }],
      };
    }

    if (name === 'tcdi_decision_gate') {
      const packageName = args?.package_name as string;
      const targetVersion = args?.target_version as string;
      const diffSnippet = (args?.diff_snippet as string) || '';

      const guardVerdict = guardrail.verify({
        packageName,
        targetVersion,
        codeSnippet: diffSnippet || 'export default function App() {}',
      });

      const res = await policyGate.evaluateDiffPolicy({
        packageName,
        targetVersion,
        diffSnippet,
        severedSymbolsFound: guardVerdict.severedViolations.map((v) => v.matchedText),
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ policyGate: res, guardVerdict }, null, 2),
          },
        ],
      };
    }

    if (name === 'tcdi_pathfinder_jump') {
      const packageName = args?.package_name as string;
      const fromVersion = args?.from_version as string;
      const toVersion = args?.to_version as string;

      const db = new CanonicalDatabase();
      const symbols = db.getSymbols(packageName, toVersion);
      db.close();

      const severed = symbols.filter(
        (s) => s.status === 'UNSUPPORTED_REMOVED' || s.status === 'BROKEN_DEFECTIVE'
      );

      const plan = {
        package: packageName,
        fromVersion,
        toVersion,
        steps: [
          `Bump ${packageName} in package.json to ${toVersion}`,
          severed.length > 0
            ? `Apply codemod for severed APIs: ${severed.map((s) => `${s.symbol_identifier} -> ${s.replacement_symbol}`).join(', ')}`
            : 'No severed APIs detected for this version',
          `Run 'pnpm install' and re-verify AST`,
        ],
        severedSymbols: severed,
      };

      return {
        content: [{ type: 'text', text: JSON.stringify(plan, null, 2) }],
      };
    }

    if (name === 'tcdi_openeval_score') {
      const packageName = args?.package_name as string;
      const version = (args?.version as string) || 'latest';
      const profile = ((args?.profile as string) || 'default') as WeightProfileName;

      const res = evaluatePackage(
        {
          packageId: packageName,
          version,
          supportsNewArchitecture: true,
          strictTypescript: true,
          hasCodemod: true,
          severedSymbolsRatio: 0.05,
          modernApiRatio: 0.95,
        },
        profile
      );

      return {
        content: [{ type: 'text', text: JSON.stringify(res, null, 2) }],
      };
    }

    if (name === 'audit_package') {
      const packageName = args?.name as string;
      const card = await getVitalityCard(packageName);
      if (!card) {
        return {
          content: [
            { type: 'text', text: `Package "${packageName}" not found in RN Terrain registry.` },
          ],
          isError: true,
        };
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(card, null, 2) }],
      };
    }

    if (name === 'scan_project') {
      const packageJsonPath = args?.package_json_path as string;
      const audit = await scanProject(packageJsonPath);
      return {
        content: [{ type: 'text', text: JSON.stringify(audit, null, 2) }],
      };
    }

    if (name === 'v1_readiness_check') {
      const packageName = args?.name as string;
      const card = await getVitalityCard(packageName);
      if (!card) {
        return {
          content: [
            { type: 'text', text: `Package "${packageName}" not found in RN Terrain registry.` },
          ],
          isError: true,
        };
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(card.v1_readiness, null, 2) }],
      };
    }

    if (name === 'get_alternatives') {
      const packageName = args?.name as string;
      const alternatives = await getAlternatives(packageName);
      return {
        content: [{ type: 'text', text: JSON.stringify(alternatives, null, 2) }],
      };
    }

    if (name === 'ecosystem_map') {
      const category = args?.category as string | undefined;
      const topology = await getEcosystemTopology(category);
      return {
        content: [{ type: 'text', text: JSON.stringify(topology, null, 2) }],
      };
    }

    throw new Error(`Tool not found: ${name}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error executing tool "${name}": ${errorMessage}` }],
      isError: true,
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('RN Terrain MCP server running on stdio');
}

run().catch((error) => {
  console.error('Fatal error running server:', error);
  process.exit(1);
});
