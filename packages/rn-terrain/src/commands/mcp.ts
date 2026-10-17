import type { CAC } from 'cac';

export function registerMcpCommands(cli: CAC) {
  cli
    .command('mcp', 'Start the Model Context Protocol (MCP) server on stdio')
    .action(async () => {
      const { startMcpServer } = await import('../mcp/index.js');
      await startMcpServer();
    });
}
