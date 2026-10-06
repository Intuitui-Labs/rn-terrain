#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

// Import TCDI functions
import { checkProject, queryCombo, projectKernel } from "./project-kernel.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = new Server(
  {
    name: "rn-terrain-tcdi",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "tcdi_check_project",
        description: "Run the TCDI dependency check against a React Native package.json file to find known incompatibilities, broken combinations, and deprecated APIs.",
        inputSchema: {
          type: "object",
          properties: {
            packageJsonPath: {
              type: "string",
              description: "Absolute or relative path to the package.json file. Usually 'package.json'.",
            },
          },
          required: ["packageJsonPath"],
        },
      },
      {
        name: "tcdi_query_combo",
        description: "Query the TCDI cross-dependency collision graph to check if two specific packages have known compatability issues.",
        inputSchema: {
          type: "object",
          properties: {
            packageA: {
              type: "string",
              description: "Name of the first package (e.g., 'react-native-reanimated').",
            },
            versionA: {
              type: "string",
              description: "Installed version of the first package (e.g., '4.6.0').",
            },
            packageB: {
              type: "string",
              description: "Name of the second package (optional, e.g., 'react-native').",
            },
            versionB: {
              type: "string",
              description: "Installed version of the second package (optional).",
            },
          },
          required: ["packageA", "versionA"],
        },
      },
      {
        name: "tcdi_project_kernel",
        description: "Project the 6-state TCDI kernel for a single package at a specific version to see all REMOVED, BROKEN, FUNCTIONAL, and NEW features.",
        inputSchema: {
          type: "object",
          properties: {
            packageName: {
              type: "string",
              description: "Name of the package (e.g., 'react-native-gesture-handler').",
            },
            version: {
              type: "string",
              description: "The version to project the kernel at (e.g., '3.3.0').",
            },
          },
          required: ["packageName", "version"],
        },
      },
      {
        name: "tcdi_query_ast",
        description: "Dynamically query the codebase's Abstract Syntax Tree (AST) for specific structural patterns (Code Smells or Migration Targets) using the TCDI AST scanner.",
        inputSchema: {
          type: "object",
          properties: {
            targetPath: {
              type: "string",
              description: "Directory or file to scan (e.g., 'c:/projects/rn-terrain/apps').",
            }
          },
          required: ["targetPath"],
        },
      },
      {
        name: "tcdi_migrate_rngh",
        description: "Run the deterministic RNGH v3 AST codemod to automatically refactor legacy component handlers (<PanGestureHandler>), wrap <Modal> in GestureHandlerRootView, and resolve Pressable issues.",
        inputSchema: {
          type: "object",
          properties: {
            targetPath: {
              type: "string",
              description: "Target file or directory to refactor.",
            },
            write: {
              type: "boolean",
              description: "Whether to overwrite files with migrated code (default false for dry-run preview).",
            }
          },
          required: ["targetPath"],
        },
      },
      {
        name: "tcdi_generate_migration_plan",
        description: "Synthesize GraphRAG findings into a structured, Checkpoint-Based Migration plan for an AI agent to execute iteratively.",
        inputSchema: {
          type: "object",
          properties: {
            packageJsonPath: {
              type: "string",
              description: "Path to the package.json to analyze for the migration plan.",
            }
          },
          required: ["packageJsonPath"],
        },
      }
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "tcdi_check_project") {
    const pPath = String(request.params.arguments.packageJsonPath);
    try {
      const result = checkProject(pPath);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (e) {
      return {
        content: [{ type: "text", text: `Error: ${e.message}` }],
        isError: true,
      };
    }
  }

  if (request.params.name === "tcdi_query_combo") {
    const { packageA, versionA, packageB, versionB } = request.params.arguments;
    try {
      const result = queryCombo(
        String(packageA),
        String(versionA),
        packageB ? String(packageB) : undefined,
        versionB ? String(versionB) : undefined
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ matches: result }, null, 2),
          },
        ],
      };
    } catch (e) {
      return {
        content: [{ type: "text", text: `Error: ${e.message}` }],
        isError: true,
      };
    }
  }

  if (request.params.name === "tcdi_project_kernel") {
    const { packageName, version } = request.params.arguments;
    try {
      const result = projectKernel(String(packageName), String(version));
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (e) {
      return {
        content: [{ type: "text", text: `Error: ${e.message}` }],
        isError: true,
      };
    }
  }

  if (request.params.name === "tcdi_query_ast") {
    const targetPath = String(request.params.arguments.targetPath);
    try {
      const { execSync } = await import('node:child_process');
      const scannerScript = path.resolve(__dirname, '../scripts/audit-codebase.mjs');
      const output = execSync(`node "${scannerScript}" --target "${targetPath}"`, { encoding: 'utf8' });
      return {
        content: [{ type: "text", text: output }],
      };
    } catch (e) {
      // If it fails with code 1 (issues found), the output is in e.stdout
      if (e.stdout) {
        return {
          content: [{ type: "text", text: e.stdout }],
        };
      }
      return {
        content: [{ type: "text", text: `Error: ${e.message}` }],
        isError: true,
      };
    }
  }

  if (request.params.name === "tcdi_migrate_rngh") {
    const targetPath = String(request.params.arguments.targetPath);
    const write = Boolean(request.params.arguments.write);
    try {
      const { execSync } = await import('node:child_process');
      const codemodScript = path.resolve(__dirname, '../scripts/migrate-rngh-v3.mjs');
      const cmd = `node "${codemodScript}" --target "${targetPath}" ${write ? '--write' : ''}`;
      const output = execSync(cmd, { encoding: 'utf8' });
      return {
        content: [{ type: "text", text: output }],
      };
    } catch (e) {
      return {
        content: [{ type: "text", text: `Codemod error: ${e.message}\n${e.stdout || ''}` }],
        isError: true,
      };
    }
  }

  if (request.params.name === "tcdi_generate_migration_plan") {
    const pPath = String(request.params.arguments.packageJsonPath);
    try {
      const resolvedPkg = path.resolve(pPath);
      let pkgData = {};
      if (fs.existsSync(resolvedPkg)) {
        pkgData = JSON.parse(fs.readFileSync(resolvedPkg, 'utf8'));
      }
      const deps = { ...(pkgData.dependencies || {}), ...(pkgData.devDependencies || {}) };
      const hasRNGH = Boolean(deps['react-native-gesture-handler']);
      const rnghVersion = (deps['react-native-gesture-handler'] || '').replace(/^[~^]/, '');

      const { execSync } = await import('node:child_process');
      const bridgeScript = path.resolve(__dirname, '../scripts/tool-bridge.mjs');
      let rawAudit = '';
      try {
        rawAudit = execSync(`node "${bridgeScript}" --enrich "${pPath}"`, { encoding: 'utf8' });
      } catch (err) {
        rawAudit = err.stdout || err.message;
      }
      
      let rnghSection = '';
      if (hasRNGH) {
        rnghSection = `
### 🎯 Specialized RNGH (${rnghVersion || 'v3'}) Migration Action Items
- **Checkpoint 1.1: Eliminate Legacy Handlers**
  Run \`tcdi_migrate_rngh\` with target app path to convert all \`<PanGestureHandler>\`, \`<TapGestureHandler>\` into \`<GestureDetector gesture={Gesture.<Type>()}>\`.
- **Checkpoint 1.2: Root Container Setup**
  Ensure root entry (\`app/_layout.tsx\` or \`App.tsx\`) contains \`<GestureHandlerRootView style={{ flex: 1 }}>\`.
- **Checkpoint 2.1: Android/iOS Modal Touch Isolation**
  All nested \`<Modal>\` components must wrap content in \`<GestureHandlerRootView style={{ flex: 1 }}>\`.
- **Checkpoint 2.2: ScrollView / Native Gesture Coordination**
  Import \`ScrollView\` / \`FlatList\` from \`react-native-gesture-handler\` or compose using \`Gesture.Native().simultaneousWithExternalGesture()\`.
- **Checkpoint 3.1: Fabric / Bottom-Sheet Crash Prevention (Signal S2)**
  Verify no \`ReanimatedSwipeable\` is nested inside \`@gorhom/bottom-sheet\` on RNGH 3.x + Fabric.
- **Checkpoint 4.1: Ergonomic v3 Hooks Adoption**
  Refactor complex nested \`<GestureDetector>\` wrappers to use \`usePanGesture\` or \`useTapGesture\`.
`;
      }

      const plan = `
# Agentic Migration Plan (Synthesized from TCDI GraphRAG)
Based on the TCDI dependency intelligence scan, execute this migration iteratively using checkpoints.
DO NOT attempt all steps in one go.

## Checkpoint 1: Surface Viability (Level 0)
Resolve FATAL / CRITICAL errors preventing build or routing.
- Check the raw audit logs for CRITICAL signals.
- Run \`tcdi_query_ast\` to detect removed APIs or banned syntax.
${rnghSection}

## Checkpoint 2: Resolve Cross-Dependency Collisions
Fix BROKE combos in the graph.
- Align interdependent native modules (e.g. Worklets vs Reanimated vs RN core versions).
- Query combos using \`tcdi_query_combo\`.

## Checkpoint 3: Feature Refactoring (Level 1-2)
Address deprecated code idioms and transitional debt.
- Remove legacy Babel plugins.
- Refactor removed APIs surfaced in the audit.

## Checkpoint 4: Opportunistic Upgrades (Level 3)
Take advantage of new capabilities.
- Run \`tcdi_query_ast\` to scan for missing recovery strategies or redundant code that native layers now handle.

## Raw TCDI GraphRAG Context:
\`\`\`
${rawAudit.slice(0, 3500)}
\`\`\`
      `;
      return {
        content: [{ type: "text", text: plan }],
      };
    } catch (e) {
      if (e.stdout) {
         return {
           content: [{ type: "text", text: "Error generating plan, raw output:\n" + e.stdout }],
           isError: true,
         };
      }
      return {
        content: [{ type: "text", text: `Error: ${e.message}` }],
        isError: true,
      };
    }
  }

  throw new Error("Tool not found");
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
