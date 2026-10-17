import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CAC } from 'cac';
import chalk from 'chalk';
import { consola } from 'consola';
import { writeGroundingReceipt } from '@intuitui-labs/rn-terrain-core';
import { HoneypotEngine } from '@intuitui-labs/rn-terrain-scanner';

export function registerInitCommands(cli: CAC) {
  cli
    .command('init [workspacePath]', 'Initialize deterministic pre-write gates and agent harness hooks in the current project')
    .option('--agent <agent>', 'Target agent platform (all, claude, codex, antigravity, cursor, opencode, husky)', {
      default: 'all',
    })
    .option('--force', 'Overwrite existing gate scripts if present')
    .action(async (workspacePath = '.', options) => {
      try {
        const targetDir = path.resolve(workspacePath);
        const agentTarget = (options.agent || 'all').toLowerCase();
        consola.info(`Initializing RN-Terrain Deterministic Protection in ${chalk.cyan(targetDir)} (target: ${chalk.bold(agentTarget)})`);

        const agentsDir = path.join(targetDir, '.agents');
        const stateDir = path.join(agentsDir, 'state');
        const rulesDir = path.join(agentsDir, 'rules');

        fs.mkdirSync(agentsDir, { recursive: true });
        fs.mkdirSync(stateDir, { recursive: true });
        fs.mkdirSync(rulesDir, { recursive: true });

        // 1. Copy or link gate scripts and adapters
        const currentDir = path.dirname(fileURLToPath(import.meta.url));
        const candidatePaths = [
          path.resolve(process.cwd(), '.agents'),
          path.resolve(currentDir, '../../../.agents'),
          path.resolve(currentDir, '../../../../.agents'),
          path.resolve(currentDir, '../../.agents'),
        ];
        const sourceAgentsDir = candidatePaths.find((p) => fs.existsSync(path.join(p, 'gate.mjs'))) ?? candidatePaths[0]!;

        const gateScripts = [
          'gate.mjs',
          'stop-gate.mjs',
          'post-tool.mjs',
          'codex-gate-adapter.mjs',
          'antigravity-gate-adapter.mjs',
          'antigravity-stop-adapter.mjs',
        ];

        for (const script of gateScripts) {
          const dest = path.join(agentsDir, script);
          const src = path.join(sourceAgentsDir, script);
          if (!fs.existsSync(dest) || options.force) {
            if (fs.existsSync(src)) {
              fs.copyFileSync(src, dest);
              console.log(`  ${chalk.green('✓')} Installed ${chalk.bold(`.agents/${script}`)}`);
            }
          } else {
            console.log(`  ${chalk.dim('•')} Existing ${chalk.bold(`.agents/${script}`)} preserved`);
          }
        }

        // 2. Configure Claude Code (.claude/settings.json)
        if (agentTarget === 'all' || agentTarget === 'claude') {
          const claudeDir = path.join(targetDir, '.claude');
          fs.mkdirSync(claudeDir, { recursive: true });
          const claudeSettingsPath = path.join(claudeDir, 'settings.json');
          let claudeSettings: any = {};
          if (fs.existsSync(claudeSettingsPath)) {
            try {
              claudeSettings = JSON.parse(fs.readFileSync(claudeSettingsPath, 'utf8'));
            } catch {}
          }
          claudeSettings.hooks = claudeSettings.hooks || {};
          claudeSettings.hooks.PreToolUse = [
            {
              matcher: 'Write|Edit|MultiEdit',
              command: 'node .agents/gate.mjs "$FILE_PATH" --auto-ground',
            },
          ];
          claudeSettings.hooks.Stop = [
            {
              command: 'node .agents/stop-gate.mjs',
            },
          ];
          fs.writeFileSync(claudeSettingsPath, JSON.stringify(claudeSettings, null, 2), 'utf8');
          console.log(`  ${chalk.green('✓')} Configured ${chalk.bold('.claude/settings.json')} (PreToolUse & Stop hooks)`);
        }

        // 3. Configure OpenAI Codex CLI (.codex/hooks.json & config.toml)
        if (agentTarget === 'all' || agentTarget === 'codex') {
          const codexDir = path.join(targetDir, '.codex');
          fs.mkdirSync(codexDir, { recursive: true });
          const codexHooksPath = path.join(codexDir, 'hooks.json');
          const codexHooks = {
            'rn-terrain-guard': {
              PreToolUse: [
                {
                  matcher: 'apply_patch|write_file',
                  hooks: [
                    {
                      type: 'command',
                      command: 'node .agents/codex-gate-adapter.mjs',
                      timeout: 15,
                    },
                  ],
                },
              ],
              Stop: [
                {
                  type: 'command',
                  command: 'node .agents/stop-gate.mjs',
                  timeout: 30,
                },
              ],
            },
          };
          fs.writeFileSync(codexHooksPath, JSON.stringify(codexHooks, null, 2), 'utf8');
          console.log(`  ${chalk.green('✓')} Configured ${chalk.bold('.codex/hooks.json')} (PreToolUse & Stop hooks)`);

          const codexConfigPath = path.join(codexDir, 'config.toml');
          if (!fs.existsSync(codexConfigPath) || options.force) {
            fs.writeFileSync(codexConfigPath, '[features]\nhooks = true\nplugins = true\n\n[sandbox]\nallow_workspace_writes = true\n', 'utf8');
            console.log(`  ${chalk.green('✓')} Configured ${chalk.bold('.codex/config.toml')} (hooks enabled)`);
          }
        }

        // 4. Configure Google Antigravity (.agents/hooks.json)
        if (agentTarget === 'all' || agentTarget === 'antigravity') {
          const agyHooksPath = path.join(agentsDir, 'hooks.json');
          const agyHooks = {
            'rn-terrain-safety-gate': {
              enabled: true,
              PreToolUse: [
                {
                  matcher: 'write_to_file|replace_file_content',
                  hooks: [
                    {
                      type: 'command',
                      command: 'node .agents/antigravity-gate-adapter.mjs',
                      timeout: 15,
                    },
                  ],
                },
              ],
              Stop: [
                {
                  type: 'command',
                  command: 'node .agents/antigravity-stop-adapter.mjs',
                  timeout: 30,
                },
              ],
            },
          };
          fs.writeFileSync(agyHooksPath, JSON.stringify(agyHooks, null, 2), 'utf8');
          console.log(`  ${chalk.green('✓')} Configured ${chalk.bold('.agents/hooks.json')} (ProtoJSON PreToolUse & Stop)`);
        }

        // 5. Configure Cursor (.cursor/hooks.json & .cursor/rules/rn-grounding.mdc)
        if (agentTarget === 'all' || agentTarget === 'cursor') {
          const cursorDir = path.join(targetDir, '.cursor');
          const cursorRulesDir = path.join(cursorDir, 'rules');
          fs.mkdirSync(cursorRulesDir, { recursive: true });
          const cursorHooksPath = path.join(cursorDir, 'hooks.json');
          const cursorHooks = {
            version: 1,
            hooks: {
              afterFileEdit: [
                {
                  command: 'node .agents/gate.mjs "$FILE_PATH" --auto-ground',
                  timeout: 15,
                },
              ],
              stop: [
                {
                  command: 'node .agents/stop-gate.mjs',
                  timeout: 30,
                },
              ],
            },
          };
          fs.writeFileSync(cursorHooksPath, JSON.stringify(cursorHooks, null, 2), 'utf8');
          console.log(`  ${chalk.green('✓')} Configured ${chalk.bold('.cursor/hooks.json')} (afterFileEdit & stop)`);

          const cursorRulePath = path.join(cursorRulesDir, 'rn-grounding.mdc');
          if (!fs.existsSync(cursorRulePath) || options.force) {
            const ruleContent = `---
description: React Native Architectural Invariants, New Architecture & Fabric Safety
globs: **/*.{tsx,ts,jsx,js}
alwaysApply: true
---

# React Native Grounding & Safety Gate

You are operating under the **RN-Terrain Deterministic Control Plane**.

## Mandatory Invariants
1. Never use removed Reanimated APIs (useAnimatedGestureHandler, interpolateNode).
2. Never import AsyncStorage from 'react-native'.
3. Fabric / New Architecture Compliance (ViewProps instead of ViewPropTypes).
`;
            fs.writeFileSync(cursorRulePath, ruleContent, 'utf8');
            console.log(`  ${chalk.green('✓')} Configured ${chalk.bold('.cursor/rules/rn-grounding.mdc')}`);
          }

          const rootCursorRulesPath = path.join(targetDir, '.cursorrules');
          if (!fs.existsSync(rootCursorRulesPath) || options.force) {
            const rootRulesContent = `# React Native Grounding & Safety Gate
You are operating under the RN-Terrain Deterministic Control Plane.
1. Ground every package before modifying RN code via 'rn-terrain compass <pkg>' or MCP tcdi_compass.
2. Obsolete APIs (useAnimatedGestureHandler, interpolateNode, AsyncStorage from 'react-native', NativeModules.MMKV) are strictly blocked.
3. Every JSX ScrollView must have bounded flex or contentContainerStyle dimensions.
4. Nitro Modules require NitroModules.createHybridObject<Spec>('HybridName').
`;
            fs.writeFileSync(rootCursorRulesPath, rootRulesContent, 'utf8');
            console.log(`  ${chalk.green('✓')} Configured ${chalk.bold('.cursorrules')} (root instructions)`);
          }
        }

        // Ambient Honeypot Shadow Types (.terrain/honeypots.d.ts)
        const terrainDir = path.join(targetDir, '.terrain');
        fs.mkdirSync(terrainDir, { recursive: true });
        const honeypotDtsPath = path.join(terrainDir, 'honeypots.d.ts');
        if (!fs.existsSync(honeypotDtsPath) || options.force) {
          const honeypotEngine = new HoneypotEngine();
          fs.writeFileSync(honeypotDtsPath, honeypotEngine.generateHoneypotDts(), 'utf8');
          console.log(`  ${chalk.green('✓')} Generated ${chalk.bold('.terrain/honeypots.d.ts')} (ambient compile-time trapdoors)`);
        }

        // 6. Configure OpenCode (.opencode/plugins/rn-terrain.ts & opencode.json)
        if (agentTarget === 'all' || agentTarget === 'opencode') {
          const openCodePluginsDir = path.join(targetDir, '.opencode', 'plugins');
          fs.mkdirSync(openCodePluginsDir, { recursive: true });
          const pluginDest = path.join(openCodePluginsDir, 'rn-terrain.ts');
          const pluginSrc = path.join(process.cwd(), '.opencode', 'plugins', 'rn-terrain.ts');
          if (!fs.existsSync(pluginDest) || options.force) {
            if (fs.existsSync(pluginSrc)) {
              fs.copyFileSync(pluginSrc, pluginDest);
            } else {
              const pluginContent = `import { spawnSync } from 'node:child_process';
import path from 'node:path';

export default function RnTerrainPlugin() {
  return {
    name: '@intuitui-labs/rn-terrain-opencode-plugin',
    version: '0.4.0',
    hooks: {
      'tool.before': async (context: { name: string; input: Record<string, any> }) => {
        const { name, input } = context;
        if (!['write', 'edit', 'apply_patch', 'writeFile', 'editFile'].includes(name)) return;
        const targetFile = input.path || input.filePath || input.file_path || '';
        if (!targetFile) return;
        const gateScript = path.resolve(process.cwd(), '.agents', 'gate.mjs');
        const run = spawnSync('node', [gateScript, targetFile, '--auto-ground'], {
          input: JSON.stringify(input),
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'],
        });
        if (run.status === 2) {
          const denialMessage = (run.stderr || run.stdout || 'Action rejected by RN-Terrain Safety Gate.').trim();
          throw new Error('\\n' + denialMessage + '\\n');
        }
      },
      'session.end': async () => {
        const stopGateScript = path.resolve(process.cwd(), '.agents', 'stop-gate.mjs');
        const run = spawnSync('node', [stopGateScript], {
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'],
        });
        if (run.status === 2) {
          const reason = (run.stderr || run.stdout).trim();
          throw new Error('\\n🛑 RN-TERRAIN VERIFICATION STOP GATE FAILED:\\n' + reason + '\\n');
        }
      },
    },
  };
}
`;
              fs.writeFileSync(pluginDest, pluginContent, 'utf8');
            }
            console.log(`  ${chalk.green('✓')} Configured ${chalk.bold('.opencode/plugins/rn-terrain.ts')}`);
          }

          const openCodeConfigPath = path.join(targetDir, 'opencode.json');
          if (!fs.existsSync(openCodeConfigPath) || options.force) {
            const ocConfig = {
              $schema: 'https://opencode.ai/schema/opencode.json',
              plugin: ['./.opencode/plugins/rn-terrain.ts'],
              mcp: {
                'rn-terrain': {
                  command: 'npx',
                  args: ['-y', '@intuitui-labs/rn-terrain', 'mcp'],
                },
              },
            };
            fs.writeFileSync(openCodeConfigPath, JSON.stringify(ocConfig, null, 2), 'utf8');
            console.log(`  ${chalk.green('✓')} Configured ${chalk.bold('opencode.json')}`);
          }
        }

        // 7. Configure Husky & lint-staged (Git Pre-Commit)
        if (agentTarget === 'all' || agentTarget === 'husky') {
          const huskyDir = path.join(targetDir, '.husky');
          fs.mkdirSync(huskyDir, { recursive: true });
          const huskyPreCommitPath = path.join(huskyDir, 'pre-commit');
          if (!fs.existsSync(huskyPreCommitPath) || options.force) {
            fs.writeFileSync(huskyPreCommitPath, '#!/bin/sh\nnpx --no -- lint-staged\n', { encoding: 'utf8', mode: 0o755 });
            console.log(`  ${chalk.green('✓')} Configured ${chalk.bold('.husky/pre-commit')}`);
          }

          const lintStagedPath = path.join(targetDir, '.lintstagedrc.json');
          if (!fs.existsSync(lintStagedPath) || options.force) {
            const lintStagedConfig = {
              '*.{tsx,ts,jsx,js}': ['node .agents/gate.mjs'],
            };
            fs.writeFileSync(lintStagedPath, JSON.stringify(lintStagedConfig, null, 2), 'utf8');
            console.log(`  ${chalk.green('✓')} Configured ${chalk.bold('.lintstagedrc.json')}`);
          }
        }

        // 8. Configure .agents/rules/rn-grounding-gate.md
        const rulePath = path.join(rulesDir, 'rn-grounding-gate.md');
        if (!fs.existsSync(rulePath) || options.force) {
          fs.writeFileSync(
            rulePath,
            `# React Native Grounding & Safety Gate Rule\n\nBefore modifying React Native components or native modules, query \`rn-terrain compass <package>\` to ground modern APIs.\nSevered legacy patterns (e.g. useAnimatedGestureHandler, AsyncStorage) are blocked by the pre-write gate.\n`,
            'utf8',
          );
          console.log(`  ${chalk.green('✓')} Configured ${chalk.bold('.agents/rules/rn-grounding-gate.md')}`);
        }

        // 9. Ensure .terrain/ and .agents/state/ are in .gitignore
        const gitignorePath = path.join(targetDir, '.gitignore');
        if (fs.existsSync(gitignorePath)) {
          let gitignore = fs.readFileSync(gitignorePath, 'utf8');
          let updated = false;
          if (!gitignore.includes('.terrain')) {
            gitignore += '\n# RN-Terrain local telemetry\n.terrain/\n';
            updated = true;
          }
          if (!gitignore.includes('.agents/state/receipt.json')) {
            gitignore += '.agents/state/receipt.json\n';
            updated = true;
          }
          if (updated) {
            fs.writeFileSync(gitignorePath, gitignore, 'utf8');
            console.log(`  ${chalk.green('✓')} Updated ${chalk.bold('.gitignore')} with .terrain/ and receipt exclusions`);
          }
        }

        // 10. Pre-seed grounding receipt
        writeGroundingReceipt('react-native-reanimated', 'latest', 'init', targetDir);
        console.log(`  ${chalk.green('✓')} Pre-seeded Outside Referent receipt in ${chalk.bold('.agents/state/receipt.json')}`);

        console.log(`\n${chalk.green.bold('🎉 RN-Terrain initialization complete!')}`);
        console.log(chalk.dim('Your workspace is now guarded against severed APIs and temporal model drift.\n'));
      } catch (e: any) {
        consola.error('Failed to initialize RN-Terrain:', e.message);
      }
    });
}
