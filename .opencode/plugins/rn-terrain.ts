/**
 * @file rn-terrain.ts
 * First-class OpenCode plugin providing deterministic pre-write gating for React Native.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';

export default function RnTerrainPlugin() {
  return {
    name: '@intuitui-labs/rn-terrain-opencode-plugin',
    version: '0.4.0',

    hooks: {
      /**
       * Synchronous Pre-Tool Hook: Intercepts write and edit tools before disk mutation
       */
      'tool.before': async (context: { name: string; input: Record<string, any> }) => {
        const { name, input } = context;
        if (!['write', 'edit', 'apply_patch', 'writeFile', 'editFile'].includes(name)) {
          return;
        }

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
          // In OpenCode, throwing inside tool.before halts execution and relays the message to the model
          throw new Error(`\n${denialMessage}\n`);
        }
      },

      /**
       * Session Completion Hook: Prevents session conclusion if diff-scoped regressions exist
       */
      'session.end': async () => {
        const stopGateScript = path.resolve(process.cwd(), '.agents', 'stop-gate.mjs');
        const run = spawnSync('node', [stopGateScript], {
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'],
        });

        if (run.status === 2) {
          const reason = (run.stderr || run.stdout).trim();
          throw new Error(`\n🛑 RN-TERRAIN VERIFICATION STOP GATE FAILED:\n${reason}\n`);
        }
      },
    },
  };
}
