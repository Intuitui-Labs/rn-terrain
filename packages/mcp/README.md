# @intuitui-labs/rn-terrain-mcp

[![npm version](https://img.shields.io/npm/v/@intuitui-labs/rn-terrain-mcp.svg?style=flat-square)](https://www.npmjs.com/package/@intuitui-labs/rn-terrain-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![MCP Spec](https://img.shields.io/badge/MCP-v1.30.1-purple.svg?style=flat-square)](https://modelcontextprotocol.io/)

> **Model Context Protocol (MCP) server for React Native architectural health, pre-flight AI agent grounding, and native dependency doctoring.**  
> Supplies Claude Desktop, Cursor, Antigravity, and autonomous coding agents with real-time verdicts on modern vs severed APIs, New Architecture compatibility, and native dependency integrity.

💡 **Notice**: `@intuitui-labs/rn-terrain-mcp` is also available as a built-in sub-binary inside the consolidated flagship package **[`@intuitui-labs/rn-terrain`](https://www.npmjs.com/package/@intuitui-labs/rn-terrain)** (`npx -y @intuitui-labs/rn-terrain mcp`).

---

## ⚡ Quickstart: Wire Up Your Agent Harness

Add `@intuitui-labs/rn-terrain-mcp` to your MCP configuration file.

### 1. Claude Desktop (`claude_desktop_config.json`)

On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`  
On Windows: `%APPDATA%\Claude\claude_desktop_config.json`

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

### 2. Cursor (`.cursor/mcp.json`)

Place in your project root or user config:

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

### 3. Antigravity / Windsurf / VS Code (Cline / Roo Code)

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

The server registers 11 specialized agent tools:

| Tool Name | Parameters | What It Does |
| :--- | :--- | :--- |
| `tcdi_compass` | `package: string, version?: string` | **Pre-flight Agent Compass**: Grounded checklist of canonical modern APIs vs forbidden severed APIs (with codemod hints) before writing code. |
| `tcdi_doctor_all` | `projectDir?: string` | **Unified Multi-Diagnostic**: Runs Stack Doctor, Native Dependency Doctor, Expo SDK Doctor, and Rust Tooling Doctor into a single 0–100 score. |
| `tcdi_doctor_deps` | `projectDir?: string, preset?: string` | **Generalized Dependency Doctor**: Scans compiled native binary surfaces (`codegenConfig`, podspecs, gradle) for hazardous floating ranges (`^`) and peer collisions. |
| `tcdi_doctor_stack` | `targetPath?: string, rnVersion?: string` | **TCDI Stack Doctor**: AST scan auditing source code against New Architecture, Worklets, and gesture handler drift. |
| `tcdi_doctor_expo` | `projectDir?: string` | **Expo Doctor Bridge**: Checks Expo SDK version alignment, managed native module compatibility, and configuration drift. |
| `tcdi_doctor_rust_tools` | None | **Rust Tooling Doctor**: Audits sovereign native developer tools (`rg`, `fd`, `bat`, `oxlint`, `biome`) and provides install recipes. |
| `tcdi_resolve_capability` | `capabilityId: string` | **Capability Resolver**: Resolves an architectural capability (e.g. `gesture.pan_recognition`, `storage.fast_kv`) to recommended packages and introduced versions. |
| `tcdi_inspect_capabilities` | `package: string, version?: string` | **Capability Inspector**: Inspects all granular capabilities unlocked by a package. |
| `tcdi_affordance` | `package: string, cwd?: string` | **Physical Node Affordance**: Inspects actual installed TypeScript definitions (`.d.ts`), exports, and README code snippets in `node_modules`. |
| `tcdi_agent_views` | None | **Agent Views**: Returns canonical `DANGER-ZONES.md` (severed APIs) and `CURRENT-STATE.md` (sacred pins). |
| `tcdi_mcp_compass` | `tool: string, version?: string` | **Developer Tooling Compass**: Pre-flight briefing for package managers and runtimes (e.g. `pnpm`, `bun`). |

---

## 📚 MCP Resources Provided

Connect your agent directly to real-time ground truth resources:

- `terrain://agent-views/danger-zones`: Real-time markdown of severed symbols and runtime crash hazards.
- `terrain://agent-views/current-state`: Sacred platform pins, New Architecture guidelines, and active stack versions.
- `terrain://radar/records`: Technology Radar records with adoption verdicts (`ADOPT`, `TRIAL`, `ASSESS`, `HOLD`).

---

## 📋 MCP Prompts Provided

- `preflight_grounding`: System prompt template to ground an agent before generating React Native components or animations.
- `migration_pathfinder`: Guided prompt to plan a safe step-by-step upgrade between breaking library versions.
- `doctor_elevate`: Guided multi-step prompt to remediate dependency doctor violations in a project.

---

## 🧠 Best Practice: The Pre-Flight Grounding Gate

Configure your agent system instructions with this simple rule:

```markdown
Before generating, refactoring, or recommending any React Native code:
1. Call `tcdi_compass` for the package being used (e.g. `react-native-reanimated`, `react-native-gesture-handler`).
2. Strictly abide by the returned BANNED / SEVERED API blacklist and use only CANONICAL modern replacements.
3. If uncertain of physical exports, call `tcdi_affordance` to inspect the installed `.d.ts` declarations.
```

---

## 📄 License

MIT © [Intuitui Labs](https://github.com/intuitui-labs)
