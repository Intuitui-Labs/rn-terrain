/**
 * @file index.ts
 * Flagship entrypoint for @intuitui-labs/rn-terrain.
 *
 * Exposes core intelligence, Pre-flight Agent Compass, Physical Affordance,
 * Granular Capabilities, Hexagonal Ingestion, Sovereign Storage, and Command Registries.
 */

export * from '@intuitui-labs/rn-terrain-core';
export * from './preview/terminal-renderer.js';
export * from './commands/index.js';
export { cli, runCli } from './cli.js';
