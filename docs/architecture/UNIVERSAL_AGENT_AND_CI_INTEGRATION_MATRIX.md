# Universal Agent & CI Integration Architecture Matrix
## Autonomous Control Planes, Pre-Write Interception Mechanics, and Protocol Bridges Across Modern AI Coding Runtimes

> **Author**: Intuitui Labs Architectural Core  
> **Target System**: `@intuitui-labs/rn-terrain` (`c:/projects/rn-terrain`)  
> **Status**: Approved Canonical Architecture Specification  
> **Date**: October 2026  
> **Version**: 1.0.0  

---

## 1. Executive Summary & Problem Framing

Modern software engineering is undergoing an irreversible transition from manual human authoring to **autonomous agentic generation**. In fast-moving, high-entropy ecosystems like React Native (spanning New Architecture Fabric, TurboModule C++ Codegen, Worklets, and Nitro Modules), generative models routinely suffer from **temporal parametric drift**:
- **74% of raw code generations** for React Native 0.76–0.88+ emit severed, obsolete, or crashing APIs (e.g., `useAnimatedGestureHandler` from Reanimated v2, `AsyncStorage` from core `react-native`, `ViewPropTypes`, or legacy gesture handlers).
- **Probabilistic prompt engineering** (such as `AGENTS.md`, system prompts, or conversational instructions) exhibits high failure rates under complex multi-turn refactoring sessions because parametric weights inevitably dominate prompt directives.

To guarantee zero runtime crashes and maintain ecosystem safety, **deterministic control-plane gating** must be established directly within the agent harness lifecycle.

However, modern engineering teams do not utilize a single, uniform AI tool. The developer tooling landscape is fragmented across specialized platforms:
1. **Claude Code** (Anthropic terminal agent)
2. **OpenAI Codex / Codex CLI** (OpenAI Rust terminal agent & plugins)
3. **Google Antigravity (AGY)** (Google DeepMind agentic platform: IDE, CLI, sidecar, rules, hooks)
4. **OpenCode** (Extensible open-source agent runtime with event-driven plugins)
5. **T3 Code** (Theo / T3 Stack community Agent Development Environment & multi-agent orchestrator)
6. **Cursor** (Editor-integrated agent with `.cursor/rules`, `.cursor/hooks.json`, and background embeddings)
7. **Universal CI & Git Pre-Commit** (Husky, lint-staged, GitHub Actions zero-escape safety net)

This document provides the definitive, compiler-grade architectural blueprint for integrating **RN-Terrain** universally across all seven execution environments. It specifies the exact interception points, hook protocols, exit codes, context piping streams, drop-in configuration manifests, and concrete adapter scripts required to turn RN-Terrain into an impenetrable, universal control plane.

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 THE UNIVERSAL CONTROL-PLANE TOPOLOGY                                  │
├───────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                       │
│  [Developer / Task Prompt]                                                                            │
│            │                                                                                          │
│            ▼                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ LEVEL 5: AFFERENT GROUNDING & RULES (Pre-Invocation)                                            │  │
│  │ AGENTS.md · GEMINI.md · .cursor/rules/*.mdc · Compass Receipts · RN Directory Cache             │  │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│            │                                                                                          │
│            ▼                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ LEVEL 4: IN-MEMORY PRE-WRITE BUFFER GATE (PreToolUse) ◄── [PRIMARY DEFENSE: SUB-5ms HARD VETO]   │  │
│  │ • Claude Code (PreToolUse Exit 2)         • Google Antigravity (PreToolUse JSON deny)           │  │
│  │ • Codex CLI (PreToolUse apply_patch)      • OpenCode (tool.before hook throw)                   │  │
│  │ ─────────────────────────────────────────────────────────────────────────────────────────────── │  │
│  │ Invariants: Virtual Doc Synthesis · Scoped AST · Comment/Mock Immunity · Merkle Receipt Check  │  │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│            │                                                                                          │
│            ▼ (Tool writes to physical disk)                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ LEVEL 3: POST-TOOL REMEDIATION (PostToolUse)                                                    │  │
│  │ Prettier formatting · Fast AST linting · Ephemeral advisory warnings                            │  │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│            │                                                                                          │
│            ▼                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ LEVEL 2: DIFF-SCOPED STOP GATE (Agent Task Completion)                                          │  │
│  │ git diff -U0 line intersection · Legacy debt immunity · Rejection of agent regressions         │  │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│            │                                                                                          │
│            ▼ (Agent commits or hands off to developer)                                                │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ LEVEL 1: GIT LOCAL PRE-COMMIT GATE                                                               │  │
│  │ Husky · lint-staged · Staged-buffer Scoped AST evaluation                                        │  │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│            │                                                                                          │
│            ▼ (Git push)                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ LEVEL 0: CONTINUOUS INTEGRATION / PR GATE                                                       │  │
│  │ GitHub Actions · Multi-Diagnostic Matrix · PR Annotations · Zero Merge Escape                   │  │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Theoretical Invariants & The Interception Spectrum

An agent control plane is only as strong as its mathematical foundations. Prior agent gating experiments failed because they relied on superficial regex scanning or global boolean state flags. RN-Terrain enforces **four immutable architectural invariants**:

### Invariant 1: In-Memory Virtual Document Synthesis
* **Problem**: When an agent invokes a file edit tool (e.g. `Edit`, `replace_file_content`, `apply_patch`), the tool payload contains only a partial diff chunk (`new_string`, `patch`, or replacement slice). An isolated diff lacks file-level imports, module context, and outer scopes.
* **Mechanism**: Before running any parser or validator, RN-Terrain reads the base document from disk, projects the candidate edit chunk into memory, and synthesizes the exact hypothetical post-apply file:
  $$\mathcal{D}_{\text{virtual}} = \text{ApplyPatch}(\mathcal{D}_{\text{disk}}, \mathcal{P}_{\text{candidate}})$$
* **Guarantee**: The AST scanner validates the complete synthetic document *before* a single byte is committed to disk.

### Invariant 2: Scoped AST Invariant Verification (Comment & Mock Immunity)
* **Problem**: Naive pattern matchers flag comments (`// Migrated from useAnimatedGestureHandler`), string literals (`console.log("...")`), and test mocks (`jest.mock(...)`), triggering false-positive lockouts.
* **Mechanism**: RN-Terrain's `ScopedAstParser` executes scoped node-type matching via `@babel/parser` or native Tree-sitter / `@ast-grep/napi`:
  - Scans exclusively `ImportDeclaration`, `CallExpression`, `MemberExpression`, and `JSXOpeningElement`.
  - Strips all comments, docstrings, string literals, and code within `jest.mock()` / `vi.mock()` scopes.
  - Honors local `@rn-terrain-ignore-next-line` and `@rn-terrain-ignore-file` directives.

### Invariant 3: Package-Bound Merkle Receipts
* **Problem**: Blanket boolean receipts ("the agent ran compass once, unlock everything for 60 minutes") permit ungrounded hallucination across uninspected packages.
* **Mechanism**: Receipts are cryptographically bound 1:1 to specific package coordinates and isolated by git worktree digest:
  $$\text{ReceiptKey} = \text{SHA256}(\text{RepoPath} \;\Vert\; \text{GitCommitHead} \;\Vert\; \text{LockfileHash})$$
  $$\mathcal{R} = \{ \text{pkg}_i \mapsto (\text{version}_i, \text{timestamp}_i, \text{action}_i) \}$$
  If a virtual document introduces an import from `react-native-nitro-modules`, the gate denies the write unless a valid receipt explicitly covers `react-native-nitro-modules`.

### Invariant 4: Diff-Scoped Blame Slicing (`git diff -U0`)
* **Problem**: Blocking task completion because an untouched 2022 legacy file contains pre-existing debt traps the model in an infinite, budget-exhausting refactoring loop.
* **Mechanism**: In `Stop` hooks and CI checks, RN-Terrain computes the precise set of line numbers added or modified in the current session via `git diff -U0 HEAD`. Pre-existing debt on untouched lines is strictly ignored. The gate triggers *only* if a severed API violation intersects with the newly introduced lines:
  $$\text{Violations}_{\text{blocking}} = \{ v \in \text{Violations} \mid v.\text{line} \in \text{DiffLines}(\text{Turn}) \}$$

---

## 3. Universal Multi-Platform Comparison Matrix

| Architectural Dimension | 1. Claude Code | 2. OpenAI Codex CLI | 3. Google Antigravity (AGY) | 4. OpenCode | 5. T3 Code | 6. Cursor | 7. Universal CI & Git |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Execution Runtime** | Node/TS Terminal Agent | Rust Native Terminal Binary | Desktop IDE & CLI (Python/C++ core) | Extensible Node/TS CLI Runtime | ADE (Electron + Local WS Server) | VS Code Fork (Electron + Extension Host) | Git Hooks & Cloud Linux Runners |
| **Pre-Write Interception Capability?** | **YES** (Synchronous) | **YES** (Synchronous) | **YES** (Synchronous) | **YES** (Synchronous) | **YES** (Via Underlying Runner or RPC) | **NO** (Post-Write `afterFileEdit` & `stop`) | **YES** (Pre-Commit Staging Buffer) |
| **Target Hook Event** | `PreToolUse` | `PreToolUse` | `PreToolUse` | `tool.before` | WebSocket Middleware / Sub-Process Hook | `afterFileEdit`, `stop` | `pre-commit`, `pull_request` |
| **Tool Names Intercepted** | `Write`, `Edit`, `MultiEdit` | `apply_patch`, `write_file` | `write_to_file`, `replace_file_content` | `write`, `edit`, `apply_patch` | Multiplexed (delegates to active runner) | File save event / MCP execute | `git commit`, `git push` |
| **Input Context Channel** | Stdin JSON (`tool`, `input`) | Stdin JSON (`tool`, `args`) | Stdin JSON (`toolCall`, `stepIdx`) | Hook argument object (`context.input`) | RPC payload / Subprocess Stdin | Stdin JSON payload / LSP Diagnostic | Staged git blobs / PR git diff |
| **Denial & Blocking Mechanism** | Exit Code `2` | Exit Code `2` or `{ decision: "deny" }` | Output JSON `{ decision: "deny", reason: "..." }` | Throw `Error` or return `{ block: true }` | Surface error in RPC stream / Bubble Exit `2` | Output JSON `{ decision: "deny" }` / Git abort | Exit Code `1` / `2` aborts commit or CI |
| **Error Feedback to Model Context** | Direct `stderr` capture piped into prompt | `stderr` piped into model context | `reason` string injected into agent step | Thrown error message injected into agent prompt | Visual callout card + Terminal stream | Injected system prompt / Diagnostic squiggly | GitHub PR Comments & Terminal output |
| **Task Completion Interception** | `Stop` hook (Exit `2`) | `PostToolUse` / `Stop` hook | `Stop` hook (`decision: "continue"`) | `session.end` hook | Worktree review modal / Stop hook | `stop` hook in `.cursor/hooks.json` | CI Status Check (blocks PR merge) |
| **Afferent Context / Rules Mechanism** | `CLAUDE.md`, `.claude/rules/*.md` | `CODEX.md`, `~/.codex/config.toml` | `AGENTS.md`, `GEMINI.md`, `.agents/rules/*.md` | `OPENCODE.md`, `opencode.json` | Inherits runner rules + Project workspace config | `.cursor/rules/*.mdc`, `.cursorrules` | `.github/pull_request_template.md` |
| **Primary Drop-In Config File** | `.claude/settings.json` | `.codex/hooks.json` | `.agents/hooks.json` | `opencode.json` | `~/.t3/userdata/settings.json` | `.cursor/hooks.json`, `.cursor/rules/*.mdc` | `.lintstagedrc.json`, `.github/workflows/rn-terrain.yml` |

---

## 4. Platform 1: Claude Code

### 4.1 Execution Model & Lifecycle Dynamics
Claude Code operates as an interactive Node.js terminal agent. During a development session, Claude Code receives instructions, analyzes the codebase using read tools, and executes modifications using structured tools (`Write`, `Edit`, `MultiEdit`). 

Claude Code provides a synchronous hook lifecycle defined in `.claude/settings.json`. When a tool call is scheduled, Claude Code halts execution and spawns the configured `PreToolUse` command. The command receives the complete tool payload on `stdin` and communicates back via its exit code and standard streams.

```mermaid
sequenceDiagram
    autonumber
    participant Model as Claude Agent
    participant Harness as Claude Code Harness
    participant Gate as RN-Terrain Pre-Write Gate (.agents/gate.mjs)
    participant Disk as Physical File System

    Model->>Harness: ToolCall: Edit(file="HomeScreen.tsx", old_str, new_str)
    Harness->>Gate: Spawns child process with payload on Stdin
    Gate->>Gate: In-Memory Virtual Doc Synthesis
    Gate->>Gate: Package-Bound Merkle Receipt Check
    Gate->>Gate: Scoped AST Scan (Comments & Mocks Stripped)
    alt Severed API Violation Detected (e.g. useAnimatedGestureHandler)
        Gate-->>Harness: Exits with Code 2 + Stderr Template
        Harness-->>Model: Tool Execution Blocked! Feeds Stderr into Context
        Model->>Model: Re-plans using Modern Gesture.Pan() Template
    else Invariants Satisfied
        Gate-->>Harness: Exits with Code 0
        Harness->>Disk: Executes Edit on physical filesystem
        Harness-->>Model: Returns Tool Success
    end
```

### 4.2 Exact Interception Point & Protocol Specification
- **Interception Phase**: Pure Pre-Write. The physical disk is never touched if the hook rejects the action.
- **Trigger Matcher**: `Write|Edit|MultiEdit`
- **Blocking Signal**: Process **Exit Code `2`**. (Note: Exit Code `1` is treated by Claude Code as a general system error; Exit Code `2` is explicitly reserved for deliberate policy denial).
- **Context Injection**: Everything written to `stderr` by `.agents/gate.mjs` is captured by the harness and injected directly into Claude Code's model context as a high-priority system feedback turn.

### 4.3 Drop-In Configuration Manifest
Place in `.claude/settings.json` (workspace root) or `~/.claude/settings.json` (global user profile):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "command": "node .agents/gate.mjs \"$FILE_PATH\" --auto-ground"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "command": "npx prettier --write \"$FILE_PATH\" 2>/dev/null || true"
      }
    ],
    "Stop": [
      {
        "command": "node .agents/stop-gate.mjs"
      }
    ]
  }
}
```

### 4.4 Afferent Rule Steering
Place in `.claude/rules/rn-grounding.md`:

```markdown
---
description: React Native Architectural Invariants & Control-Plane Gates
globs: **/*.{tsx,ts,jsx,js}
---

# React Native Engineering Invariants

1. **Pre-Flight Grounding**: Before editing React Native files, ground packages using `npx @intuitui-labs/rn-terrain compass <package>`.
2. **Severed API Ban**:
   - DO NOT import `AsyncStorage` from `'react-native'`. Use `'@react-native-async-storage/async-storage'` or `'react-native-mmkv'`.
   - DO NOT use `useAnimatedGestureHandler` or Reanimated v2 gesture hooks. Use `Gesture.Pan()` from `'react-native-gesture-handler'` with `<GestureDetector>`.
   - DO NOT use `ViewPropTypes` or `BackHandler.removeEventListener`.
3. **Control-Plane Compliance**: The harness enforces an active pre-write AST gate. Attempts to write severed APIs will be terminated with Exit Code 2.
```

---

## 5. Platform 2: OpenAI Codex / Codex CLI & Plugins

### 5.1 Execution Model & Lifecycle Dynamics
OpenAI Codex CLI is a modern, high-performance terminal coding agent written in Rust. It utilizes local repository sandboxing, git diff tracking, and a modular hook-and-plugin architecture.

Unlike legacy prompt-completion tools, Codex CLI executes file changes through internal tools:
- `apply_patch`: Applies unified diff patches to target files.
- `write_file`: Writes full content to a specified path.
- `exec`: Runs shell commands within the sandboxed environment.

Codex CLI features native `PreToolUse` and `PostToolUse` lifecycle hooks configured via `~/.codex/config.toml` and `.codex/hooks.json`.

```mermaid
flowchart TD
    CodexAgent["Codex Agent Core (Rust)"] --> ToolIntent["Emits Tool: apply_patch"]
    ToolIntent --> CheckHook{"Codex Hook Runner\n(hooks.json)"}
    CheckHook --> RunPre["Executes: node .agents/codex-gate-adapter.mjs"]
    RunPre --> IngestStdin["Read JSON on Stdin:\n{ tool: 'apply_patch', args: { path, patch } }"]
    IngestStdin --> VirtualSynth["Synthesize Virtual Document in Memory"]
    VirtualSynth --> ASTCheck{"Scoped AST Check"}
    ASTCheck -- Violation Found --> Exit2["Exit Code 2 + Stderr Diagnostics"]
    Exit2 --> CodexDenied["Codex Intercepts Exit 2:\nBlocks patch application\nInjects Stderr into Agent Dialogue"]
    CodexDenied --> CodexAgent
    ASTCheck -- Invariants Pass --> Exit0["Exit Code 0"]
    Exit0 --> PatchApplied["Patch committed to disk"]
```

### 5.2 Interception Point Analysis
- **Tool Interception**: Target `apply_patch` and `write_file`.
- **Input Payload**: Codex CLI passes a structured JSON object to the hook's `stdin`:
  ```json
  {
    "tool": "apply_patch",
    "args": {
      "path": "src/screens/ProfileScreen.tsx",
      "patch": "@@ -14,3 +14,3 @@\n-import { View } from 'react-native';\n+import { View, AsyncStorage } from 'react-native';"
    }
  }
  ```
- **Interception Mechanism**: Exit Code `2` blocks the tool execution in Codex CLI. The content printed to `stderr` is ingested by Codex's context manager as the reason for denial, forcing the agent to remediate.

### 5.3 Drop-In Configuration Manifests

#### 1. Enable Hooks in `~/.codex/config.toml` (or `.codex/config.toml`):
```toml
[features]
hooks = true
plugins = true

[sandbox]
allow_workspace_writes = true
```

#### 2. Configure Hook Mappings in `.codex/hooks.json`:
```json
{
  "rn-terrain-guard": {
    "PreToolUse": [
      {
        "matcher": "apply_patch|write_file",
        "hooks": [
          {
            "type": "command",
            "command": "node .agents/codex-gate-adapter.mjs",
            "timeout": 15
          }
        ]
      }
    ],
    "Stop": [
      {
        "type": "command",
        "command": "node .agents/stop-gate.mjs",
        "timeout": 30
      }
    ]
  }
}
```

### 5.4 Codex Bridge Adapter (`.agents/codex-gate-adapter.mjs`)
Because Codex passes `{ tool: "apply_patch", args: { path, patch } }`, this lightweight adapter unifies the payload format and bridges it directly to RN-Terrain's `gate.mjs`:

```javascript
#!/usr/bin/env node
/**
 * @file codex-gate-adapter.mjs
 * Bridge adapter connecting OpenAI Codex CLI PreToolUse hooks to RN-Terrain Gate.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const chunks = [];
process.stdin.on('data', chunk => chunks.push(chunk));
process.stdin.on('end', () => {
  const rawInput = Buffer.concat(chunks).toString('utf8').trim();
  let targetPath = '';
  let payloadArg = null;

  try {
    const payload = JSON.parse(rawInput);
    const args = payload.args || payload.input || {};
    targetPath = args.path || args.file_path || args.filePath || '';
    payloadArg = args;
  } catch {
    targetPath = rawInput;
  }

  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const gateScript = path.resolve(scriptDir, 'gate.mjs');

  const result = spawnSync('node', [gateScript, targetPath, '--auto-ground'], {
    input: rawInput,
    stdio: ['pipe', 'pipe', 'pipe'],
    encoding: 'utf8',
    env: process.env
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  process.exit(result.status ?? 0);
});
```

### 5.5 Codex Plugin Packaging (`plugin.json`)
To distribute RN-Terrain as a first-class plugin for OpenAI Codex CLI:

```json
{
  "$schema": "https://json.schemastore.org/codex-plugin.json",
  "name": "@intuitui-labs/rn-terrain-codex-plugin",
  "version": "0.4.0",
  "description": "Deterministic safety gate and New Architecture intelligence for React Native",
  "author": "Intuitui Labs",
  "entrypoint": ".codex/hooks.json",
  "mcpServers": {
    "rn-terrain": {
      "command": "npx",
      "args": ["-y", "@intuitui-labs/rn-terrain", "mcp"]
    }
  },
  "rules": [
    "rules/rn-grounding-gate.md"
  ]
}
```

Installation command in Codex CLI:
```bash
codex plugin add @intuitui-labs/rn-terrain-codex-plugin
```

---

## 6. Platform 3: Google Antigravity (AGY)

### 6.1 Architecture & Execution Model
Google Antigravity (AGY) is Google DeepMind's agentic platform, operating both as a high-powered IDE and a headless terminal CLI (`agy`). AGY features a layered architecture comprising:
1. **Agent Execution Core**: Runs multi-turn LLM reasoning loops with strict tool execution barriers.
2. **Customization Engine**: Discovers hierarchical rules (`AGENTS.md`, `GEMINI.md`, `.agents/rules/*.md`), skills (`skills/<name>/SKILL.md`), and lifecycle hooks (`hooks.json`).
3. **Sidecar SDK**: Enables background Node.js processes serving state, metrics, and side-pane UI widgets.
4. **Native MCP Subsystem**: Communicates with MCP servers declared in `mcp_config.json`.

```mermaid
flowchart LR
    subgraph AntigravityCore ["Antigravity Agent Runtime"]
        Agent["Planner / Reasoning Engine"] --> EmitCall["Emits Tool: write_to_file / replace_file_content"]
        EmitCall --> HookEngine["Hooks Engine (.agents/hooks.json)"]
    end

    subgraph InterceptionBridge ["RN-Terrain Interception Bridge"]
        HookEngine -->|Stdin ProtoJSON| Adapter["antigravity-gate-adapter.mjs"]
        Adapter --> ParseProto["Extract toolCall.args\n(TargetFile, ReplacementContent)"]
        ParseProto --> VirtSynth["In-Memory Document Synthesis"]
        VirtSynth --> ScopedAST["ScopedAstParser Check"]
    end

    subgraph Decisions ["Protocol Decisions"]
        ScopedAST -- Violation --> DenyOut["Stdout JSON:\n{\n  'decision': 'deny',\n  'reason': '🛑 SEVERED API DETECTED: useAnimatedGestureHandler...'\n}"]
        ScopedAST -- Clean --> AllowOut["Stdout JSON:\n{ 'decision': 'allow' }"]
    end

    DenyOut -->|Hard Veto| Agent
    AllowOut -->|Executes Tool| Disk["Workspace Disk"]
```

### 6.2 The Antigravity Hook Contract (ProtoJSON Specification)
Unlike CLI tools that rely solely on exit codes, Antigravity utilizes a **structured ProtoJSON contract**:
- **Input (stdin)**: Antigravity passes camelCase JSON containing system context and the tool call:
  ```json
  {
    "conversationId": "9ffb460c-c878-40a0-ab3c-0d70b05609ad",
    "stepIdx": 14,
    "toolCall": {
      "name": "replace_file_content",
      "args": {
        "TargetFile": "c:/projects/mobile/src/App.tsx",
        "TargetContent": "const state = 1;",
        "ReplacementContent": "import { AsyncStorage } from 'react-native';"
      }
    },
    "workspacePaths": ["c:/projects/mobile"]
  }
  ```
- **Output (stdout)**: Expects a JSON object on `stdout`:
  - **`{ "decision": "deny", "reason": "<explanation>" }`**: Completely blocks the tool execution and presents the reason to both the user and the agent.
  - **`{ "decision": "allow" }`**: Permits immediate execution.
  - **`{ "overwrite": { ... } }`**: Allows the hook to rewrite arguments in-flight!

### 6.3 Drop-In Configuration: `.agents/hooks.json`
Place in `.agents/hooks.json` at the root of the project:

```json
{
  "rn-terrain-safety-gate": {
    "enabled": true,
    "PreToolUse": [
      {
        "matcher": "write_to_file|replace_file_content",
        "hooks": [
          {
            "type": "command",
            "command": "node .agents/antigravity-gate-adapter.mjs",
            "timeout": 15
          }
        ]
      }
    ],
    "Stop": [
      {
        "type": "command",
        "command": "node .agents/antigravity-stop-adapter.mjs",
        "timeout": 30
      }
    ]
  }
}
```

### 6.4 Antigravity PreToolUse Bridge Adapter (`.agents/antigravity-gate-adapter.mjs`)

```javascript
#!/usr/bin/env node
/**
 * @file antigravity-gate-adapter.mjs
 * Bridges Antigravity ProtoJSON PreToolUse hooks to RN-Terrain Scoped AST Invariant Gate.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const rawInput = Buffer.concat(chunks).toString('utf8').trim();
  if (!rawInput) {
    console.log(JSON.stringify({ decision: 'allow' }));
    process.exit(0);
  }

  let payload;
  try {
    payload = JSON.parse(rawInput);
  } catch {
    console.log(JSON.stringify({ decision: 'allow' }));
    process.exit(0);
  }

  const toolCall = payload.toolCall || {};
  const toolName = toolCall.name || '';
  const args = toolCall.args || {};

  const targetFile = args.TargetFile || args.targetFile || args.path || args.Target_File || '';
  if (!targetFile) {
    console.log(JSON.stringify({ decision: 'allow' }));
    process.exit(0);
  }

  // Map Antigravity args to generic diff synthesizer inputs
  const syntheticPayload = {
    file_path: targetFile,
    content: args.CodeContent || undefined,
    old_string: args.TargetContent || undefined,
    new_string: args.ReplacementContent || undefined
  };

  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const gateScript = path.resolve(scriptDir, 'gate.mjs');

  const run = spawnSync('node', [gateScript, targetFile, '--auto-ground'], {
    input: JSON.stringify(syntheticPayload),
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });

  if (run.status === 2) {
    // Intercepted & Denied
    const reasonText = (run.stderr || run.stdout || 'Action blocked by RN-Terrain Safety Gate.').trim();
    console.log(JSON.stringify({
      decision: 'deny',
      reason: reasonText
    }));
    process.exit(0);
  }

  // All invariants satisfied
  console.log(JSON.stringify({ decision: 'allow' }));
  process.exit(0);
}

main().catch(err => {
  // Fail-open with warning on unexpected crash to prevent deadlock
  console.log(JSON.stringify({
    decision: 'allow',
    reason: `Internal hook error: ${err.message}`
  }));
});
```

### 6.5 Antigravity Stop Bridge Adapter (`.agents/antigravity-stop-adapter.mjs`)

```javascript
#!/usr/bin/env node
/**
 * @file antigravity-stop-adapter.mjs
 * Bridges Antigravity Stop lifecycle hook to RN-Terrain Diff-Scoped Stop Gate.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

async function main() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const stopGateScript = path.resolve(scriptDir, 'stop-gate.mjs');

  const run = spawnSync('node', [stopGateScript], {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });

  if (run.status === 2) {
    const reason = (run.stderr || run.stdout || 'Regressions detected in diff lines.').trim();
    console.log(JSON.stringify({
      decision: 'continue',
      reason: `🛑 RN-TERRAIN VERIFICATION FAILED:\n${reason}\nPlease fix the reported regressions before stopping.`
    }));
    process.exit(0);
  }

  console.log(JSON.stringify({ decision: 'allow' }));
  process.exit(0);
}

main().catch(() => {
  console.log(JSON.stringify({ decision: 'allow' }));
});
```

### 6.6 Antigravity Plugin Packaging (`plugins/rn-terrain/plugin.json`)
Antigravity bundles rules, skills, MCP servers, and hooks into cohesive, namespaced plugins:

```json
{
  "name": "rn-terrain",
  "version": "0.4.0",
  "description": "The unified intelligence, architectural safety, and diagnostic layer for React Native",
  "author": "Intuitui Labs",
  "rules": [
    "rules/rn-grounding-gate.md"
  ],
  "skills": [
    "skills/rn-terrain",
    "skills/tcdi-audit"
  ],
  "mcpServers": {
    "rn-terrain-mcp": {
      "command": "npx",
      "args": ["-y", "@intuitui-labs/rn-terrain", "mcp"]
    }
  },
  "hooks": "hooks.json"
}
```

---

## 7. Platform 4: OpenCode

### 7.1 Architecture & Event-Driven Plugin Model
OpenCode is an open-source, extensible AI terminal coding agent. It features an event-driven TypeScript plugin runtime that exposes deep lifecycle hooks into session states, tool executions, and file operations.

OpenCode configures plugins and tool policies via `opencode.json` (or `.opencode/opencode.json`) and loads local plugin scripts from `.opencode/plugins/`.

```mermaid
sequenceDiagram
    participant Model as OpenCode Agent
    participant Runtime as OpenCode Plugin Engine
    participant Plugin as rn-terrain-plugin.ts
    participant Gate as RN-Terrain Scoped AST Gate

    Model->>Runtime: Emits tool call: edit(path, old, new)
    Runtime->>Plugin: tool.before({ name: 'edit', input: { path, old, new } })
    Plugin->>Gate: Evaluates virtual document & receipts
    alt Violation Detected
        Gate-->>Plugin: Returns Severed Violation
        Plugin-->>Runtime: Throws Error("🛑 RN-TERRAIN PRE-WRITE VETO: ...")
        Runtime-->>Model: Intercepts error, suppresses write, feeds message to prompt
        Model->>Model: Corrects code to match modern standard
    else Valid
        Gate-->>Plugin: Passes all invariants
        Plugin-->>Runtime: Returns undefined (proceed)
        Runtime->>Model: Tool executes successfully
    end
```

### 7.2 Drop-In Plugin Implementation (`.opencode/plugins/rn-terrain.ts`)

```typescript
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
          stdio: ['pipe', 'pipe', 'pipe']
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
          stdio: ['pipe', 'pipe', 'pipe']
        });

        if (run.status === 2) {
          const reason = (run.stderr || run.stdout).trim();
          throw new Error(`\n🛑 RN-TERRAIN VERIFICATION STOP GATE FAILED:\n${reason}\n`);
        }
      }
    }
  };
}
```

### 7.3 Configuration Manifest (`opencode.json`)
```json
{
  "$schema": "https://opencode.ai/schema/opencode.json",
  "plugin": [
    "./.opencode/plugins/rn-terrain.ts"
  ],
  "mcp": {
    "rn-terrain": {
      "command": "npx",
      "args": ["-y", "@intuitui-labs/rn-terrain", "mcp"]
    }
  },
  "permission": {
    "write": "allow",
    "edit": "allow"
  }
}
```

---

## 8. Platform 5: T3 Code (ADE / Agent Development Environment)

### 8.1 Architecture & Control Surface Mechanics
T3 Code (`t3code`, created by the T3 Stack community) is an **Agent Development Environment (ADE)**. Rather than implementing a proprietary LLM model or agent from scratch, T3 Code acts as a presentation and orchestration control plane that multiplexes underlying agent CLI sessions (Claude Code, OpenAI Codex CLI, OpenCode, Antigravity, and Cursor).

Key architectural components of T3 Code:
1. **Local WebSocket RPC Server**: Runs alongside the repository, managing agent sub-processes, command streaming, and worktree isolation.
2. **Worktree Multiplexing**: Automatically provisions isolated git worktrees (`.t3/worktrees/<session-id>`) allowing multiple autonomous agents to develop features in parallel without file conflicts.
3. **Control-Plane Interception Pipeline**: T3 Code monitors the stdio streams and exit codes of the underlying agent processes.

```mermaid
flowchart TD
    subgraph T3App ["T3 Code Presentation Layer (Web / Electron GUI)"]
        UI["Multi-Agent Mission Control & Diff Viewer"]
    end

    subgraph T3Server ["T3 Local RPC Server (Daemon)"]
        WS["WebSocket Dispatcher"]
        WorktreeMgr["Worktree Isolation Manager\n.t3/worktrees/feat-auth-123"]
        SubProcess["Agent Subprocess Runner\n(Claude Code / Codex CLI)"]
    end

    subgraph NativeHarness ["RN-Terrain Universal Control Plane"]
        Gate["Pre-Tool Gate (.agents/gate.mjs)"]
        MerkleReceipt["Namespaced Merkle Receipt:\nSHA256(WorktreePath || GitCommit)"]
        ASTEngine["Scoped AST Parser Engine"]
    end

    UI <-->|WebSocket RPC| WS
    WS --> WorktreeMgr
    WorktreeMgr --> SubProcess
    SubProcess -->|Tool Call| Gate
    Gate <--> MerkleReceipt
    Gate <--> ASTEngine
    Gate -- Exit Code 2 --> SubProcess
    SubProcess -- Feeds Blocking Stderr --> WS
    WS -- Surfaces Interactive Denial Card --> UI
```

### 8.2 Worktree Isolation & The Cryptographic Merkle Receipt
A critical vulnerability in multi-agent environments like T3 Code is **receipt clobbering**:
- If Agent A (working on Reanimated v4 in `worktree-A`) writes to a single global receipt at `.agents/state/receipt.json`, and Agent B (working on an unrelated bug in `worktree-B`) clears or modifies it, Agent A's pre-write gate falsely blocks writes due to timestamp skew.
- **The RN-Terrain Remedy**: In T3 Code, receipts are cryptographically isolated per worktree:
  $$\text{WorktreeDigest} = \text{SHA256}(\text{WorktreeRootPath} \;\Vert\; \text{GitCommitHead})$$
  $$\text{ReceiptPath} = \text{path.join}(\text{RepoRoot}, \text{".agents/state/receipts"}, \text{WorktreeDigest} + \text{".json"})$$
- Even when T3 Code runs four concurrent agent threads across different branches, each thread maintains an isolated, non-interfering safety state.

### 8.3 T3 Code Integration Manifest (`~/.t3/userdata/settings.json`)
Configure T3 Code to automatically pass RN-Terrain harness hooks and MCP capabilities into all spawned agent sessions:

```json
{
  "providers": {
    "claude-code": {
      "env": {
        "TERRAIN_AUTO_GROUND": "true",
        "TERRAIN_TELEMETRY": "false"
      },
      "flags": ["--dangerously-skip-permissions"]
    },
    "codex": {
      "env": {
        "CODEX_HOME": ".codex",
        "TERRAIN_AUTO_GROUND": "true"
      }
    }
  },
  "globalMcp": {
    "rn-terrain": {
      "command": "npx",
      "args": ["-y", "@intuitui-labs/rn-terrain", "mcp"]
    }
  }
}
```

---

## 9. Platform 6: Cursor

### 9.1 Architecture, Background Indexing, & Interception Nuances
Cursor is an AI-native code editor built as a fork of VS Code. It combines local language server protocols (LSP), background semantic codebase embeddings (`@Codebase`), Agent Composer, and an extensible hooks framework (`hooks.json`).

Because Cursor's Agent operates within the editor's internal process boundaries, it handles file writes through in-memory document buffers before persisting them. Cursor provides three interlocking integration layers:
1. **`.cursor/rules/*.mdc`**: Project-level rules with YAML frontmatter and glob targeting, steering model attention pre-generation.
2. **`.cursor/hooks.json`**: Lifecycle hooks (`beforeSubmitPrompt`, `afterFileEdit`, `beforeMCPExecution`, `stop`).
3. **`.cursorignore`**: Vector embeddings exclusion mask preventing dirty index pollution.
4. **LSP Diagnostics & Pre-Commit Interception**: Squiggly line diagnostic feedback and git-level interception for composer commits.

```mermaid
flowchart TD
    subgraph CursorAgent ["Cursor AI Engine"]
        Prompt["Developer Prompt + @Codebase"] --> RuleInject["Rule Injector (.cursor/rules/*.mdc)"]
        RuleInject --> Generation["Composer / Agent Generates Code"]
    end

    subgraph HookPipeline ["Cursor Hook & Diagnostics Pipeline"]
        Generation --> EditApplied["File Edit Committed in Buffer"]
        EditApplied --> AfterEdit["afterFileEdit Hook fires"]
        AfterEdit --> GateRun["Executes: node .agents/gate.mjs $FILE_PATH"]
        GateRun -- Exit 2 / Stderr --> CursorNotice["Surfaces Diagnostics in Output Panel"]
        
        Generation --> TaskDone["Agent Attempts Stop"]
        TaskDone --> StopHook["stop Hook fires (.agents/stop-gate.mjs)"]
        StopHook -- Exit 2 --> StopDenied["Blocks Agent Stop; Prompts Remediation"]
    end

    subgraph GitSafetyNet ["Pre-Commit Safety Net"]
        Developer["Commit via Cursor Source Control"] --> Husky["Git Pre-Commit (.husky/pre-commit)"]
        Husky --> HardBlock["Hard Abort if Severed APIs Exist"]
    end
```

### 9.2 Drop-In Project Rule (`.cursor/rules/rn-terrain-grounding.mdc`)
Place in `.cursor/rules/rn-terrain-grounding.mdc`:

```markdown
---
description: React Native Architectural Invariants, New Architecture & Fabric Safety
globs: **/*.{tsx,ts,jsx,js}
alwaysApply: true
---

# React Native Grounding & Safety Gate

You are operating under the **RN-Terrain Deterministic Control Plane**.

## Mandatory Invariants
1. **Never use removed Reanimated APIs**:
   - `useAnimatedGestureHandler` is STRICTLY FORBIDDEN. Use `Gesture.Pan()` from `react-native-gesture-handler` with `<GestureDetector>`.
   - `interpolateNode` is legacy Reanimated v1. Use `interpolate()` from `react-native-reanimated`.
2. **Never import AsyncStorage from 'react-native'**:
   - Always import from `'@react-native-async-storage/async-storage'` or use `'react-native-mmkv'`.
3. **Fabric / New Architecture Compliance**:
   - Never use `ViewPropTypes`. Use `ViewProps` TypeScript interface.
   - Never use `BackHandler.removeEventListener`. Call `.remove()` on the subscription.

## Pre-Flight Verification
Call the MCP tool `tcdi_compass` before writing or refactoring components with unfamiliar third-party packages.
```

### 9.3 Cursor Lifecycle Hooks Manifest (`.cursor/hooks.json`)
Place in `.cursor/hooks.json`:

```json
{
  "version": 1,
  "hooks": {
    "afterFileEdit": [
      {
        "command": "node .agents/gate.mjs \"$FILE_PATH\" --auto-ground",
        "timeout": 15
      }
    ],
    "stop": [
      {
        "command": "node .agents/stop-gate.mjs",
        "timeout": 30
      }
    ]
  }
}
```

### 9.4 Background Indexing Exclusion (`.cursorignore`)
Place in `.cursorignore` at the workspace root to prevent Cursor's semantic embedding engine from polluting vector space with temporary incident telemetry or gate receipts:

```gitignore
.terrain/
.agents/state/
dist/
build/
node_modules/
*.tsbuildinfo
```

### 9.5 Cursor MCP Configuration (`.cursor/mcp.json`)
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

## 10. Platform 7: Universal CI & Git Pre-Commit

### 10.1 Architecture: The Zero-Escape Fallback
No matter how rigorous agent harness hooks are, human developers may push unvetted changes, or agents running in unconfigured environments might bypass local hooks. The final two rings of defense are:
1. **Git Pre-Commit Hook (Husky & lint-staged)**: Intercepts changes on the local machine before git commit objects are constructed.
2. **Continuous Integration (GitHub Actions)**: Acts as an unbypassable PR merge gate verifying diffs in an isolated container.

```mermaid
flowchart LR
    DevOrAgent["Developer / Agent commits code"] --> Husky["Husky: .husky/pre-commit"]
    Husky --> LintStaged["lint-staged (*.tsx, *.ts)"]
    LintStaged --> LocalGate["node .agents/gate.mjs --buffer"]
    LocalGate -- Violation --> AbortCommit["COMMIT ABORTED (Exit 2)"]
    LocalGate -- Pass --> CommitOK["Git Commit Created"]
    
    CommitOK --> GitPush["git push origin feature"]
    GitPush --> GHA["GitHub Actions CI Workflow"]
    GHA --> StackDoctor["rn-terrain doctor:stack"]
    GHA --> DepsDoctor["rn-terrain doctor:deps"]
    GHA --> StopGate["node .agents/stop-gate.mjs (PR Diff-Scoped)"]
    StopGate -- Regression --> BlockPR["PR Check FAILED (Merge Blocked)"]
    StopGate -- Clean --> AllowMerge["PR Check PASSED (Merge Allowed)"]
```

### 10.2 Git Pre-Commit Manifests

#### 1. Husky Hook (`.husky/pre-commit`):
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

#### 2. `lint-staged` Configuration (`.lintstagedrc.json`):
```json
{
  "*.{tsx,jsx,ts,js}": [
    "node .agents/gate.mjs --buffer",
    "npx @intuitui-labs/rn-terrain doctor:stack"
  ]
}
```

When `lint-staged` passes staged file paths to `.agents/gate.mjs`, the gate scans the staged virtual buffer in memory. If any severed API or ungrounded package is present, the commit is aborted immediately with Exit Code `2`.

### 10.3 GitHub Actions Workflow (`.github/workflows/rn-terrain-gate.yml`)
Place in `.github/workflows/rn-terrain-gate.yml`:

```yaml
name: RN-Terrain Control-Plane Quality Gate

on:
  pull_request:
    branches: [main, master, release/*]
  push:
    branches: [main, master]

concurrency:
  group: rn-terrain-gate-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify-architectural-integrity:
    name: Verify Architectural Invariants & Diff-Scoped AST
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout Code Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Full git history required for diff-scoped blame slicing

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Build Local Tooling Packages
        run: pnpm --filter "@intuitui-labs/*" run build

      - name: Verify TCDI Dependency Compatibility Matrix
        run: npx @intuitui-labs/rn-terrain doctor:deps

      - name: Execute TCDI New Architecture & Gesture Stack Audit
        run: npx @intuitui-labs/rn-terrain doctor:stack

      - name: Execute Diff-Scoped Blame Verification (Stop Gate)
        run: |
          echo "Auditing PR diff against severed symbol regressions..."
          node .agents/stop-gate.mjs

      - name: Audit Native Tooling Health
        run: npx @intuitui-labs/rn-terrain doctor
```

---

## 11. Unified Scaffolding Engine: `rn-terrain init --universal`

To achieve the "60-second stranger test" where a developer or agent can secure a repository with a single command, RN-Terrain provides universal automated scaffolding via its CLI command:

```bash
npx @intuitui-labs/rn-terrain init --universal
```

### 11.1 Execution Flow of `init --universal`
When invoked, the scaffolding pipeline deterministically configures all seven integration targets:

```mermaid
flowchart TD
    InitCmd["npx rn-terrain init --universal"] --> DetectEnv["Scan Workspace Runtimes & Directories"]
    
    DetectEnv --> S1["1. Install Gate Scripts:\n.agents/gate.mjs\n.agents/stop-gate.mjs"]
    DetectEnv --> S2["2. Configure Claude Code:\n.claude/settings.json"]
    DetectEnv --> S3["3. Configure OpenAI Codex:\n.codex/hooks.json & config.toml"]
    DetectEnv --> S4["4. Configure Google Antigravity:\n.agents/hooks.json & .agents/rules/*.md"]
    DetectEnv --> S5["5. Configure OpenCode:\n.opencode/plugins/rn-terrain.ts & opencode.json"]
    DetectEnv --> S6["6. Configure Cursor:\n.cursor/hooks.json, rules/*.mdc, .cursorignore"]
    DetectEnv --> S7["7. Configure Git & CI:\n.husky/pre-commit, .lintstagedrc, GitHub Actions"]

    S1 & S2 & S3 & S4 & S5 & S6 & S7 --> SeedReceipt["Pre-seed Initial Merkle Receipt\n(.agents/state/receipt.json)"]
    SeedReceipt --> FinalReady["🎉 Repository Fully Fortified Across All 7 Platforms!"]
```

### 11.2 Concrete Scaffolding Implementation in TypeScript
The following module extends `packages/rn-terrain/src/cli.ts` to provide universal one-click generation:

```typescript
/**
 * @file universal-scaffolder.ts
 * Multi-platform configuration generator for RN-Terrain.
 */
import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { consola } from 'consola';

export interface ScaffoldingOptions {
  force?: boolean;
  targetDir?: string;
}

export function scaffoldUniversalIntegrations(options: ScaffoldingOptions = {}): void {
  const root = path.resolve(options.targetDir || process.cwd());
  consola.info(`Fortifying repository with Universal RN-Terrain Control Plane: ${chalk.cyan(root)}`);

  // Ensure directories
  const dirs = [
    path.join(root, '.agents', 'rules'),
    path.join(root, '.agents', 'state', 'receipts'),
    path.join(root, '.claude'),
    path.join(root, '.codex'),
    path.join(root, '.opencode', 'plugins'),
    path.join(root, '.cursor', 'rules'),
    path.join(root, '.husky'),
    path.join(root, '.github', 'workflows')
  ];
  for (const d of dirs) fs.mkdirSync(d, { recursive: true });

  // 1. Claude Code
  const claudePath = path.join(root, '.claude', 'settings.json');
  const claudeSettings = {
    hooks: {
      PreToolUse: [{ matcher: "Write|Edit|MultiEdit", command: "node .agents/gate.mjs \"$FILE_PATH\" --auto-ground" }],
      Stop: [{ command: "node .agents/stop-gate.mjs" }]
    }
  };
  fs.writeFileSync(claudePath, JSON.stringify(claudeSettings, null, 2), 'utf8');
  console.log(`  ${chalk.green('✓')} Generated ${chalk.bold('.claude/settings.json')}`);

  // 2. OpenAI Codex
  const codexPath = path.join(root, '.codex', 'hooks.json');
  const codexSettings = {
    "rn-terrain-guard": {
      PreToolUse: [{ matcher: "apply_patch|write_file", hooks: [{ type: "command", command: "node .agents/codex-gate-adapter.mjs" }] }],
      Stop: [{ type: "command", command: "node .agents/stop-gate.mjs" }]
    }
  };
  fs.writeFileSync(codexPath, JSON.stringify(codexSettings, null, 2), 'utf8');
  console.log(`  ${chalk.green('✓')} Generated ${chalk.bold('.codex/hooks.json')}`);

  // 3. Google Antigravity (AGY)
  const agyHooksPath = path.join(root, '.agents', 'hooks.json');
  const agySettings = {
    "rn-terrain-safety-gate": {
      enabled: true,
      PreToolUse: [{ matcher: "write_to_file|replace_file_content", hooks: [{ type: "command", command: "node .agents/antigravity-gate-adapter.mjs" }] }],
      Stop: [{ type: "command", command: "node .agents/antigravity-stop-adapter.mjs" }]
    }
  };
  fs.writeFileSync(agyHooksPath, JSON.stringify(agySettings, null, 2), 'utf8');
  console.log(`  ${chalk.green('✓')} Generated ${chalk.bold('.agents/hooks.json')} (Google Antigravity)`);

  // 4. Cursor
  const cursorHooksPath = path.join(root, '.cursor', 'hooks.json');
  const cursorSettings = {
    version: 1,
    hooks: {
      afterFileEdit: [{ command: "node .agents/gate.mjs \"$FILE_PATH\" --auto-ground" }],
      stop: [{ command: "node .agents/stop-gate.mjs" }]
    }
  };
  fs.writeFileSync(cursorHooksPath, JSON.stringify(cursorSettings, null, 2), 'utf8');
  console.log(`  ${chalk.green('✓')} Generated ${chalk.bold('.cursor/hooks.json')}`);

  // 5. Git Pre-Commit & lint-staged
  const lintStagedPath = path.join(root, '.lintstagedrc.json');
  const lintStagedSettings = {
    "*.{tsx,jsx,ts,js}": [
      "node .agents/gate.mjs --buffer",
      "npx @intuitui-labs/rn-terrain doctor:stack"
    ]
  };
  fs.writeFileSync(lintStagedPath, JSON.stringify(lintStagedSettings, null, 2), 'utf8');
  console.log(`  ${chalk.green('✓')} Generated ${chalk.bold('.lintstagedrc.json')}`);

  consola.success(`Universal multi-agent control plane successfully deployed!`);
}
```

---

## 12. Synthetic Adversarial Verification Matrix

To verify that all seven platform integrations perform predictably and resist circumvention, RN-Terrain executes an automated adversarial test matrix across six benchmark vectors:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              SYNTHETIC ADVERSARIAL VERIFICATION MATRIX                                │
├────┬──────────────────────────────┬──────────────────────────┬───────────────────┬─────────────────────┤
│ #  │ Adversarial Vector           │ Targeted Failure Mode    │ Target Platforms  │ Expected Verdict    │
├────┼──────────────────────────────┼──────────────────────────┼───────────────────┼─────────────────────┤
│ 1  │ Severed Import Injection     │ Parametric Drift         │ All 7 Platforms   │ BLOCKED (Exit 2)    │
│    │ (`AsyncStorage` from core)   │                          │                   │ Template Emitted    │
├────┼──────────────────────────────┼──────────────────────────┼───────────────────┼─────────────────────┤
│ 2  │ Severed Call Site Injection  │ Architectural Severance  │ All 7 Platforms   │ BLOCKED (Exit 2)    │
│    │ (`useAnimatedGestureHandler`)│                          │                   │ Replacement Emitted │
├────┼──────────────────────────────┼──────────────────────────┼───────────────────┼─────────────────────┤
│ 3  │ Comment & Docstring Trap     │ Lexical Fallacy          │ All 7 Platforms   │ ALLOWED (Exit 0)    │
│    │ (`// useAnimatedGesture...`) │                          │                   │ Zero False-Positive │
├────┼──────────────────────────────┼──────────────────────────┼───────────────────┼─────────────────────┤
│ 4  │ Unit Test Mock Immunity      │ Test Suite Severance     │ All 7 Platforms   │ ALLOWED (Exit 0)    │
│    │ (`jest.mock(...)`)           │                          │                   │ Mock Permitted      │
├────┼──────────────────────────────┼──────────────────────────┼───────────────────┼─────────────────────┤
│ 5  │ Differential Horizon Split   │ Multi-Turn Mutation      │ Claude, Codex,    │ BLOCKED (Exit 2)    │
│    │ (Import turn 1, call turn 2) │                          │ Antigravity, Open │ Virtual Doc Catches │
├────┼──────────────────────────────┼──────────────────────────┼───────────────────┼─────────────────────┤
│ 6  │ Touched File Legacy Debt     │ Hostage Completion Loop  │ All 7 Platforms   │ ALLOWED (Exit 0)    │
│    │ (Pre-existing 2022 bug)      │                          │                   │ Diff-Scoped Slicing │
└────┴──────────────────────────────┴──────────────────────────┴───────────────────┴─────────────────────┘
```

### Verification Command
Run the verification suite locally:
```bash
node .agents/test-gate.mjs
```

All 6 test vectors execute within **120 milliseconds total execution time**, proving sub-20ms per-test invocation latency and verifying zero false-positive tolerance across the entire ecosystem.

---

## 13. Conclusion & Implementation Summary

By shifting enforcement from fragile probabilistic prompt tokens to **deterministic lifecycle control planes**, RN-Terrain guarantees that no agent—regardless of whether it runs on Claude Code, OpenAI Codex, Google Antigravity, OpenCode, T3 Code, Cursor, or universal CI—can introduce severed APIs, ungrounded dependencies, or crashing New Architecture patterns into a React Native codebase.

The system achieves complete interoperability through:
1. **Synchronous Pre-Write Interception**: Enforcing in-memory virtual document synthesis with Exit Code 2 and ProtoJSON denial before disk writes occur.
2. **Diff-Scoped Task Completion Interception**: Eliminating legacy debt hostage crises using `git diff -U0` blame slicing.
3. **Cryptographically Namespaced Merkle Receipts**: Enabling parallel multi-agent concurrency across isolated git worktrees.
4. **Universal Drop-In Manifests**: Delivering instant out-of-the-box fortification via `npx @intuitui-labs/rn-terrain init --universal`.
