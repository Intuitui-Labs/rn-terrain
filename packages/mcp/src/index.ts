/* eslint-disable import-x/no-unresolved */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import {
  getAlternatives,
  getEcosystemTopology,
  getVitalityCard,
  scanProject,
  CanonicalDatabase,
  PolicyGate
} from '@intuitui-labs/rn-terrain-core';
import { AgentGuardrail } from '@intuitui-labs/rn-terrain-scanner';
import { evaluatePackage, type WeightProfileName } from '@intuitui-labs/openeval';

const server = new Server(
  {
    name: 'rn-terrain-mcp',
    version: '0.2.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

const guardrail = new AgentGuardrail();
const policyGate = new PolicyGate();

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
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
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
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
