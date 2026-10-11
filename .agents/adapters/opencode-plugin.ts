/**
 * OpenCode Plugin Adapter for RN-Terrain Grounding Gate.
 * Maps `tool.execute.before` hook on file edit/write operations.
 */

import { spawnSync } from 'node:child_process';
import path from 'node:path';

export interface ToolExecutionContext {
  tool: string;
  args: {
    path?: string;
    filePath?: string;
    content?: string;
  };
}

export default {
  name: 'rn-terrain-grounding-gate',
  async 'tool.execute.before'(context: ToolExecutionContext) {
    const editTools = ['edit', 'write', 'modify_file', 'apply_diff'];
    if (!editTools.includes(context.tool.toLowerCase())) {
      return;
    }

    const targetPath = context.args?.path || context.args?.filePath;
    if (!targetPath) {
      return;
    }

    const gateScript = path.resolve('.agents', 'gate.mjs');
    const result = spawnSync('node', [gateScript, targetPath], {
      encoding: 'utf8',
      env: process.env,
    });

    if (result.status !== 0) {
      const reason = result.stderr || result.stdout || 'Action blocked by RN-Terrain Grounding Gate.';
      throw new Error(`[RN-TERRAIN GATE INTERCEPT]:\n${reason.trim()}`);
    }
  },
};
