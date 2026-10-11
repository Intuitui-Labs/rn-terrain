#!/usr/bin/env node
import('../dist/mcp/index.js').then((m) => m.startMcpServer()).catch((err) => {
  console.error(err);
  process.exit(1);
});
