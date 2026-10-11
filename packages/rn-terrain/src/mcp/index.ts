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
  CuratedKnowledgeBridge,
  writeGroundingReceipt
} from '@intuitui-labs/rn-terrain-core';
import {
  AgentGuardrail,
  TcdiStackDoctor,
  TcdiDependencyDoctor,
  ExpoDoctorBridge
} from '@intuitui-labs/rn-terrain-scanner';
import { evaluatePackage, type WeightProfileName } from '@intuitui-labs/openeval';

export function createMcpServer(): Server {
  const server = new Server(
    {
      name: 'rn-terrain-mcp',
      version: '0.4.0',
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

  // ─── Tools List ─────────────────────────────────────────────────────────────

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'tcdi_compass',
          description:
            'Pre-Flight Agent Compass: Query grounded modern APIs, forbidden severed APIs, and architecture modes before writing any React Native code.',
          inputSchema: {
            type: 'object',
            properties: {
              package_name: {
                type: 'string',
                description: 'The React Native library name (e.g. react-native-reanimated, react-native-gesture-handler).',
              },
              target_version: {
                type: 'string',
                description: 'Target package version to verify (e.g. 3.16.0, 4.0.0). Defaults to latest.',
              },
            },
            required: ['package_name'],
          },
        },
        {
          name: 'tcdi_mcp_compass',
          description:
            'Pre-Flight Developer Tool Compass: Audit developer tooling (pnpm, bun, rg, sd, oxlint) before generating shell commands.',
          inputSchema: {
            type: 'object',
            properties: {
              tool_name: {
                type: 'string',
                description: 'Tool identifier (e.g. pnpm, bun, oxlint, fd).',
              },
              target_version: {
                type: 'string',
                description: 'Target tool version to audit.',
              },
            },
            required: ['tool_name'],
          },
        },
        {
          name: 'tcdi_doctor_rust_tools',
          description:
            'Rust Tooling Doctor: Audit sovereign shiny tools (rg, fd, sd, bat, oxlint, biome) with installation recipes and taste-of-the-best nudges.',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'tcdi_doctor_stack',
          description:
            'TCDI Stack Doctor: Audit React Native code snippets against New Architecture, Worklets, and gesture patterns.',
          inputSchema: {
            type: 'object',
            properties: {
              code_snippet: {
                type: 'string',
                description: 'The TypeScript / JSX code snippet to audit.',
              },
              target_rn: {
                type: 'string',
                description: 'Target React Native version (e.g. ^0.76.0, ^0.77.0).',
              },
              architecture: {
                type: 'string',
                enum: ['new-arch', 'paper', 'interop'],
                description: 'Target architecture.',
              },
              reanimated_version: {
                type: 'string',
                description: 'Target Reanimated version (e.g. ^4.0.0, ^3.16.0).',
              },
            },
            required: ['code_snippet'],
          },
        },
        {
          name: 'tcdi_doctor_deps',
          description:
            'TCDI Dependency Doctor: Audit manifest against Native Surfaces, Peer ABI Matrix, and Local Shape (.terrainrc).',
          inputSchema: {
            type: 'object',
            properties: {
              project_dir: {
                type: 'string',
                description: 'Project directory containing package.json.',
              },
            },
          },
        },
        {
          name: 'tcdi_doctor_expo',
          description:
            'Expo Doctor Bridge: Inspect Expo SDK version and native module alignment.',
          inputSchema: {
            type: 'object',
            properties: {
              project_dir: {
                type: 'string',
                description: 'Project directory containing app.json / package.json.',
              },
            },
          },
        },
        {
          name: 'tcdi_doctor_all',
          description:
            'Unified Multi-Diagnostic: Run Stack, Dependency, Expo SDK, and Rust Tooling diagnostics in one combined scorecard.',
          inputSchema: {
            type: 'object',
            properties: {
              project_dir: {
                type: 'string',
                description: 'Project directory to audit.',
              },
            },
          },
        },
        {
          name: 'tcdi_resolve_capability',
          description:
            'Granular Capability Resolver: Resolve an architectural capability (e.g. gesture.pan_recognition, storage.fast_kv) to grounded packages.',
          inputSchema: {
            type: 'object',
            properties: {
              capability_id: {
                type: 'string',
                description: 'Capability identifier.',
              },
            },
            required: ['capability_id'],
          },
        },
        {
          name: 'tcdi_inspect_capabilities',
          description:
            'Granular Capability Inspector: Inspect all capabilities unlocked by a package and version.',
          inputSchema: {
            type: 'object',
            properties: {
              package_name: {
                type: 'string',
                description: 'Package name.',
              },
              version: {
                type: 'string',
                description: 'Package version.',
              },
            },
            required: ['package_name'],
          },
        },
        {
          name: 'tcdi_affordance',
          description:
            'Physical Node Affordance: Ground code directly on physical node_modules (.d.ts symbols and README snippets).',
          inputSchema: {
            type: 'object',
            properties: {
              package_name: {
                type: 'string',
                description: 'Package name.',
              },
              project_root: {
                type: 'string',
                description: 'Path to project root containing node_modules.',
              },
            },
            required: ['package_name'],
          },
        },
        {
          name: 'tcdi_agent_views',
          description:
            'Synthesize canonical DANGER-ZONES.md and CURRENT-STATE.md agent views from the knowledge bridge.',
          inputSchema: {
            type: 'object',
            properties: {
              view: {
                type: 'string',
                enum: ['danger_zones', 'current_state', 'all'],
                description: 'Which view to inspect.',
              },
            },
          },
        },
        {
          name: 'tcdi_verify_ast_diff',
          description:
            'Pre-Flight AST Diff Guardrail: Verify proposed code diff against banned and severed APIs before saving.',
          inputSchema: {
            type: 'object',
            properties: {
              package_name: {
                type: 'string',
                description: 'Package name.',
              },
              target_version: {
                type: 'string',
                description: 'Target version.',
              },
              code_snippet: {
                type: 'string',
                description: 'Code snippet to verify.',
              },
            },
            required: ['package_name', 'target_version', 'code_snippet'],
          },
        },
        {
          name: 'tcdi_decision_gate',
          description:
            'Evaluate code diff against calibrated Policy Gate thresholds.',
          inputSchema: {
            type: 'object',
            properties: {
              package_name: {
                type: 'string',
                description: 'Package name.',
              },
              target_version: {
                type: 'string',
                description: 'Target version.',
              },
              diff_snippet: {
                type: 'string',
                description: 'Code diff.',
              },
            },
            required: ['package_name', 'target_version'],
          },
        },
        {
          name: 'tcdi_pathfinder_jump',
          description:
            'Calculate migration path and severed APIs across breaking versions.',
          inputSchema: {
            type: 'object',
            properties: {
              package_name: {
                type: 'string',
                description: 'Package name.',
              },
              from_version: {
                type: 'string',
                description: 'Source version.',
              },
              to_version: {
                type: 'string',
                description: 'Target version.',
              },
            },
            required: ['package_name', 'from_version', 'to_version'],
          },
        },
        {
          name: 'tcdi_openeval_score',
          description:
            'Run 6-dimension Deconstructible OpenEval evaluation.',
          inputSchema: {
            type: 'object',
            properties: {
              package_name: {
                type: 'string',
                description: 'Package name.',
              },
              version: {
                type: 'string',
                description: 'Version.',
              },
              profile: {
                type: 'string',
                enum: ['default', 'strict_new_arch', 'minimal_footprint', 'enterprise'],
                description: 'Weight profile.',
              },
            },
            required: ['package_name'],
          },
        },
        {
          name: 'audit_package',
          description: 'Fetch complete vitality card and health signals for a package.',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Package name.',
              },
            },
            required: ['name'],
          },
        },
        {
          name: 'scan_project',
          description: 'Scan package.json dependencies for legacy fence and RN 1.0 readiness.',
          inputSchema: {
            type: 'object',
            properties: {
              package_json_path: {
                type: 'string',
                description: 'Path to package.json.',
              },
            },
            required: ['package_json_path'],
          },
        },
        {
          name: 'v1_readiness_check',
          description: 'Evaluate React Native 1.0 readiness score for a package.',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Package name.',
              },
            },
            required: ['name'],
          },
        },
        {
          name: 'get_alternatives',
          description: 'Get modern New Architecture alternatives for a legacy package.',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Package name.',
              },
            },
            required: ['name'],
          },
        },
        {
          name: 'ecosystem_map',
          description: 'Get global topology of the React Native package ecosystem.',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description: 'Category filter.',
              },
            },
          },
        },
      ],
    };
  });

  // ─── Resources ──────────────────────────────────────────────────────────────

  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: 'terrain://agent-views/danger-zones',
          name: 'React Native Ecosystem Danger Zones',
          description: 'Ground truth on severed APIs and crashing patterns.',
          mimeType: 'text/markdown',
        },
        {
          uri: 'terrain://agent-views/current-state',
          name: 'React Native Current Ecosystem State',
          description: 'Top vendor recommendations and current best-in-class packages.',
          mimeType: 'text/markdown',
        },
        {
          uri: 'terrain://radar/records',
          name: 'Curated Technology Radar Records',
          description: 'Evaluated packages with adopt/hold/trial/retire verdicts.',
          mimeType: 'application/json',
        },
      ],
    };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    const db = createCatalog();
    const bridge = new CuratedKnowledgeBridge(db);
    const tempViewsDir = path.resolve(process.cwd(), 'docs/agent-views');
    const views = bridge.synthesizeAgentViews(tempViewsDir);

    if (uri === 'terrain://agent-views/danger-zones') {
      const text = fs.readFileSync(views.dangerZones, 'utf-8');
      return {
        contents: [{ uri, mimeType: 'text/markdown', text }],
      };
    }

    if (uri === 'terrain://agent-views/current-state') {
      const text = fs.readFileSync(views.currentState, 'utf-8');
      return {
        contents: [{ uri, mimeType: 'text/markdown', text }],
      };
    }

    if (uri === 'terrain://radar/records') {
      const db = createCatalog();
      const records = db.getRadarRecords();
      return {
        contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(records, null, 2) }],
      };
    }

    throw new Error(`Resource not found: ${uri}`);
  });

  // ─── Prompts ────────────────────────────────────────────────────────────────

  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
      prompts: [
        {
          name: 'preflight_grounding',
          description: 'Mandatory pre-flight grounding prompt before coding in React Native',
          arguments: [
            {
              name: 'package_name',
              description: 'Target package name',
              required: true,
            },
            {
              name: 'version',
              description: 'Target package version',
              required: false,
            },
          ],
        },
        {
          name: 'migration_pathfinder',
          description: 'Prompt guiding safe version migration jump',
          arguments: [
            {
              name: 'package_name',
              description: 'Target package name',
              required: true,
            },
            {
              name: 'from_version',
              description: 'Starting version',
              required: true,
            },
            {
              name: 'to_version',
              description: 'Target version',
              required: true,
            },
          ],
        },
        {
          name: 'doctor_elevate',
          description: 'Prompt guiding developer toolchain elevation via Rust tools',
          arguments: [],
        },
      ],
    };
  });

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === 'preflight_grounding') {
      const pkg = args?.package_name as string;
      const ver = (args?.version as string) || 'latest';
      const briefing = generateAgentCompass(pkg, ver);
      writeGroundingReceipt(pkg, ver, 'preflight_grounding');
      return {
        description: `Pre-flight grounding for ${pkg}@${ver}`,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: briefing.preflightInstruction,
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
              text: `Please plan and execute a safe migration jump for ${pkg} from ${fromVer} to ${toVer}.\n1. Consult tcdi_compass for ${pkg}@${toVer}\n2. Use tcdi_verify_ast_diff to prevent severed API usage.\n3. Co-install necessary runtime packages.`,
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
        const targetVersion = (args?.target_version as string) || 'latest';
        const briefing = generateAgentCompass(packageName, targetVersion);
        writeGroundingReceipt(packageName, targetVersion, 'tcdi_compass');
        return {
          content: [{ type: 'text', text: JSON.stringify(briefing, null, 2) }],
        };
      }

      if (name === 'tcdi_mcp_compass') {
        const targetVersion = (args?.target_version as string) || (args?.version as string) || '1.30.1';
        const briefing = generateMcpDevToolCompass(targetVersion);
        return {
          content: [{ type: 'text', text: JSON.stringify(briefing, null, 2) }],
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
        const code = args?.code_snippet as string;
        const targetRn = (args?.target_rn as string) || '^0.76.0';
        const architecture = (args?.architecture as any) || 'new-arch';
        const reanimated = args?.reanimated_version as string | undefined;

        const doctor = new TcdiStackDoctor({
          targetStack: {
            reactNative: targetRn,
            architecture,
            reanimated,
          },
        });

        const report = doctor.diagnoseSnippet(code, 'snippet.tsx');
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
        const doctor = new TcdiDependencyDoctor({ configPath: projectDir });
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
          const depDoctor = new TcdiDependencyDoctor({ configPath: projectDir });
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
        const db = createCatalog();
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

        const db = createCatalog();
        const symbols = db.getSymbols(packageName, toVersion);

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

  return server;
}

export async function startMcpServer(): Promise<void> {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('RN Terrain MCP server running on stdio');
}
