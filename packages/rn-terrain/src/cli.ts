#!/usr/bin/env node
/**
 * @file cli.ts
 * Flagship CLI for RN-Terrain — Bitemporal Dependency Intelligence,
 * Sovereign Static Analysis, Pre-Flight Agent Compass, and Git Pre-Commit Gates.
 */

import { cac } from 'cac';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerAllCommands } from './commands/index.js';

export const cli = cac('rn-terrain');

// Register all modular domain command registries
registerAllCommands(cli);

cli.help();

export function runCli(argv = process.argv) {
  cli.parse(argv);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
