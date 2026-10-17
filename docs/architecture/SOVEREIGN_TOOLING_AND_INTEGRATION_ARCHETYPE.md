# Sovereign Tooling & Integration Archetype: Shiny Tools vs. The Zombie Hybrid

**Status:** Canonical Architecture Specification  
**Substrate:** Windows 11 (pwsh), Node.js (ESM), TypeScript, SQLite 3  
**Sovereign Toolchain:** `rg` (ripgrep), `fd` (fd-find), `sd` (sd), `bat` (bat), `delta` (git-delta), `oxlint` (Oxc), `@ast-grep/napi`  

---

## 1. The Core Realization: Tool Leverage vs. Greenfield Rewrite

When building dependency and architectural intelligence for React Native, developers and AI agents frequently fall into one of two fatal architectural traps:

```
┌───────────────────────────────────────────────┐     ┌───────────────────────────────────────────────┐
│           TRAP 1: THE REWRITE TRAP            │     │          TRAP 2: THE ZOMBIE HYBRID            │
│       ("Let's rewrite everything in Rust")    │     │             (The Grok Bot Pattern)            │
├───────────────────────────────────────────────┤     ├───────────────────────────────────────────────┤
│ • Weeks building custom CLI arg parsers.      │     │ • 73 KB Python script (`terrain_gate/core.py`)│
│ • Writing boilerplate SQLite DDL & HTTP glue. │     │ • Brittle Node regex (`scan_imports_regex.cjs`)│
│ • Reimplementing file traversal & regex.      │ VS  │ • 64 DB tables where 40 have 0 rows (dead).   │
│ • Disconnected from TypeScript ecosystem ASTs.│     │ • 575 raw markdown files in nested folders.   │
│ • Delays shipping real domain intelligence.   │     │ • Subprocess spaghetti: Shell -> Py -> Node.  │
└───────────────────────────────────────────────┘     └───────────────────────────────────────────────┘
                                                │     │
                                                ▼     ▼
                    ┌─────────────────────────────────────────────────────────┐
                    │               THE SOVEREIGN PRAGMATIC PATH              │
                    │               (Orchestration & Leverage)                │
                    ├─────────────────────────────────────────────────────────┤
                    │ • Host Brain: Typed TypeScript Engine + SQLite DB.      │
                    │ • Muscle: Direct delegation to installed "Shiny Tools". │
                    │ • In-Process AST: `@ast-grep/napi` (Rust Tree-sitter).  │
                    │ • Zero Zombie Glue: No Python, no regex hacks, no bloat.│
                    └─────────────────────────────────────────────────────────┘
```

---

## 2. Inventory: What Was Proposed vs. Where Shiny Tools Already Win

| Capability | Greenfield Rust Proposal | Sovereign Shiny Tool Leverage | Why Leverage Wins |
|---|---|---|---|
| **Directory Crawling** | Write custom Rust walker using `walkdir`/`ignore` | **`fd`** (`fd-find`) | `fd` traverses 33 manifests in $<10\text{ms}$, handles `.gitignore` natively, and is already installed at WinGet. |
| **Hot Import Text Grepping** | Write custom Rust regex crawler using `regex` crate | **`rg`** (*ripgrep*) | `rg` pre-filters 3,777 files in $<15\text{ms}$ with SIMD acceleration. Re-writing this is wasted effort. |
| **AST Parsing & Pattern Matching** | Write Tree-sitter C bindings in a new Rust crate | **`@ast-grep/napi`** | It **is** a Rust Tree-sitter engine compiled into Node-API. Runs in-process with zero process-spawn overhead ($<0.5\text{ms}$). |
| **In-Place File Replacements** | Write custom string mutation logic | **`sd`** + `@ast-grep/napi` | `sd` provides ultra-fast regex replacements; `@ast-grep` provides certified structural AST codemods. |
| **Syntax & Hygiene Linting** | Build custom lint passes | **`oxlint`** (*Oxc*) | 50–100x faster than ESLint; purpose-built in Rust for JavaScript/TypeScript. |
| **Terminal Previews & Diffs** | Write custom syntax highlighter | **`bat`** & **`delta`** | Zero-effort, human-readable terminal syntax highlighting and side-by-side git diffs. |

### The Real Work to Build: The Domain Brain
The actual domain intelligence belongs in our core package:
1. **The Bitemporal Relational Graph**: Hydrating the 14 consolidated tables in SQLite (packages, versions, changes, combos, attractors, gate payloads).
2. **Decision Gate Logic**: Evaluating `refused_invented`, sacred pin overrides, and training-gravity refutations.
3. **Agent MCP Protocol**: Implementing `@modelcontextprotocol/sdk` to serve briefings to AI coding agents.

---

## 3. Technical Typology: CLI Binary vs. Crate vs. NAPI Native Addon

Understanding how Rust components interface with our package:

```
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│     EXTERNAL CLI TOOL   │    NAPI NATIVE ADDON    │   CUSTOM COMPILED CRATE │
│   (`rg`, `fd`, `sd`)    │   (`@ast-grep/napi`)    │   (When to write one)   │
├─────────────────────────┼─────────────────────────┼─────────────────────────┤
│ • Standalone `.exe` on  │ • Compiled `.node` DLL  │ • Custom Rust code      │
│   Windows host.         │   loaded in V8 memory.  │   compiled via Cargo.   │
│ • Communicates via      │ • Communicates via      │ • Communicates via CLI  │
│   `execFile` / stdout.  │   direct C function     │   or NAPI bindings.     │
│ • Overhead: 5–15ms OS   │   calls in-process.     │ • Overhead: Dependent on│
│   process spawn cost.   │ • Overhead: < 0.5ms.    │   interface chosen.     │
│ • Best for: Batch file  │ • Best for: Per-token   │ • ONLY write when a     │
│   crawls & text search. │   AST pre-write checks. │   custom algorithm lacks│
│                         │                         │   an existing CLI tool. │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

---

## 4. Operational Integration: How Tools Compose into the Package

Inside `@intuitui-labs/rn-terrain-core` and `@intuitui-labs/rn-terrain-scanner`, we compose these tools into a unified pipeline:

```
[Agent Emits Token / Edits File]
               │
               ▼
   1. Fast AST Check (<2ms) ──────► Executed in-process via @ast-grep/napi (Rust)
               │                     (Checks banned symbols, honeypots, Yoga rules)
               │
   2. Database Check (<1ms)  ──────► Executed via SQLite (better-sqlite3)
               │                     (Checks training_attractor, combos, sacred pins)
               │
   [If Multi-File Monorepo Scan Requested]
               │
   3. File Discovery (<10ms) ─────► Subprocess invocation: fd -e tsx -e ts
               │
   4. Symbol Pre-filter (<15ms) ──► Subprocess invocation: rg --json "symbolName"
               │
   5. Diff Preview ───────────────► Piped to delta / bat for developer inspection
```

This delivers **microsecond execution**, **zero zombie code**, and **zero maintenance burden for third-party utilities**.
