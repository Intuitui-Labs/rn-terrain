/**
 * @file index.ts
 * Unified Command Registry for RN-Terrain CLI.
 */

import type { CAC } from 'cac';
import { registerRadarCommands } from './radar.js';
import { registerAuditCommands } from './audit.js';
import { registerCompassCommands } from './compass.js';
import { registerDoctorCommands } from './doctor.js';
import { registerCodeCommands } from './code.js';
import { registerSyncCommands } from './sync.js';
import { registerSwarmCommands } from './swarm.js';
import { registerInitCommands } from './init.js';
import { registerMcpCommands } from './mcp.js';
import { registerPreviewCommands } from './preview.js';
import { registerBitemporalCommands } from './bitemporal.js';
import { registerHookCommands } from './hooks.js';

export * from './radar.js';
export * from './audit.js';
export * from './compass.js';
export * from './doctor.js';
export * from './code.js';
export * from './sync.js';
export * from './swarm.js';
export * from './init.js';
export * from './mcp.js';
export * from './preview.js';
export * from './bitemporal.js';
export * from './hooks.js';

/**
 * Register all domain commands onto the CAC instance.
 */
export function registerAllCommands(cli: CAC): void {
  registerRadarCommands(cli);
  registerAuditCommands(cli);
  registerCompassCommands(cli);
  registerDoctorCommands(cli);
  registerCodeCommands(cli);
  registerSyncCommands(cli);
  registerSwarmCommands(cli);
  registerInitCommands(cli);
  registerMcpCommands(cli);
  registerPreviewCommands(cli);
  registerBitemporalCommands(cli);
  registerHookCommands(cli);
}
