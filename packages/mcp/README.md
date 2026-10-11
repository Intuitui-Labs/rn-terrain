# @intuitui-labs/rn-terrain-mcp

[![npm version](https://img.shields.io/npm/v/@intuitui-labs/rn-terrain-mcp.svg?style=flat-square)](https://www.npmjs.com/package/@intuitui-labs/rn-terrain-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **Model Context Protocol (MCP) server for React Native architectural health, pre-flight AI agent grounding, and native dependency doctoring.**

💡 **Notice**: `@intuitui-labs/rn-terrain-mcp` is maintained as a backwards-compatible forwarding facade. The consolidated flagship package is **[`@intuitui-labs/rn-terrain`](https://www.npmjs.com/package/@intuitui-labs/rn-terrain)**, which includes both the standard CLI and the MCP server.

---

## ⚡ Setup for AI Coding Agents

You can use either package name in your MCP client settings (`claude_desktop_config.json`, Cursor, Antigravity, or VS Code):

### Recommended (Unified Flagship Package):
```json
{
  "mcpServers": {
    "rn-terrain": {
      "command": "npx",
      "args": ["-y", "@intuitui-labs/rn-terrain-mcp"]
    }
  }
}
```

Or using the unified package directly:
```json
{
  "mcpServers": {
    "rn-terrain": {
      "command": "npx",
      "args": ["-y", "@intuitui-labs/rn-terrain", "mcp"]
    }
  }
}
```

---

## 🛠️ MCP Tools Provided

- `tcdi_compass`: Pre-flight grounded API checklist for React Native packages.
- `tcdi_doctor_all`: Unified multi-diagnostic (Rust tools, native dependencies, Expo SDK).
- `tcdi_doctor_deps`: Audits native surfaces, peer ABI collisions, and local pins.
- `tcdi_doctor_stack`: AST scan auditing code against New Architecture, Worklets, and gesture handlers.
- `tcdi_doctor_expo`: Inspects Expo SDK alignment and native module compliance.
- `tcdi_doctor_rust_tools`: Audits sovereign native developer tools (`rg`, `fd`, `bat`, `oxlint`).
- `tcdi_resolve_capability`: Resolves high-level capabilities to recommended packages.
- `tcdi_inspect_capabilities`: Lists capabilities unlocked by a package.
- `tcdi_affordance`: Inspects physical `node_modules` TypeScript definitions and symbols.
- `tcdi_agent_views`: Synthesizes danger zones and current state documentation.
- `tcdi_mcp_compass`: Pre-flight briefing for MCP developer tooling.

---

## 📄 License
MIT © Intuitui Labs
