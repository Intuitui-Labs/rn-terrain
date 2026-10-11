/**
 * @file index.ts
 * Backwards-compatibility facade forwarding to @intuitui-labs/rn-terrain/mcp.
 */

import { createMcpServer, startMcpServer } from '@intuitui-labs/rn-terrain/mcp';

export { createMcpServer, startMcpServer };

startMcpServer().catch((error) => {
  console.error('Fatal error running server:', error);
  process.exit(1);
});
