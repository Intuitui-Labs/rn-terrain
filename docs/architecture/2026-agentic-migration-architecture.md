# 2026 Agentic Migration Architecture: GraphRAG + MCP + AST

Traditional automated codebase migrations fail because they attempt "one-shot" conversions based on flat text or generic embeddings. In late 2025 and 2026, the industry shifted to **Agentic Checkpoint-Based Migration** powered by **GraphRAG** and **Model Context Protocol (MCP)**. 

The React Native Terrain TCDI system implements this state-of-the-art architecture.

## 1. The Tri-Layer Search Engine (Search as Code)
Modern AI coding agents require precise context engineering to avoid "token bloat" and hallucinations. TCDI implements a Tri-Layer Search architecture exposed directly to the AI agent via the MCP server:

1.  **Lexical & GraphRAG Layer (`tcdi_query_combo` / `tcdi_check_project`)**: 
    Uses the TCDI Semantic Graph (SQLite) to identify inter-dependency collisions and surface human-curated Dev Dances. This acts as the grounding knowledge for the agent.
2.  **Structural Context Layer (`tcdi_query_ast`)**: 
    Allows the agent to dynamically query the codebase's Abstract Syntax Tree (via `@babel/parser`). Instead of vector-searching for "MMKV", the agent queries the AST for "CallExpressions to `createMMKV` missing the `recoveryStrategy` argument." This guarantees 100% precision.
3.  **Semantic Action Layer (`tcdi_generate_migration_plan`)**: 
    The agent synthesizes the GraphRAG and Structural data to generate deterministic migration checkpoints.

## 2. Checkpoint-Based Migration Workflow
Inspired by large-scale migration tools (like Shopify's Helix), TCDI does not attempt to rewrite an entire app at once. It forces the AI agent into an iterative loop:

1.  **Audit**: Agent runs `tcdi_check_project`.
2.  **Plan**: Agent runs `tcdi_generate_migration_plan` to break the massive upgrade into small, independently verifiable commits (Checkpoints).
3.  **Execute & Test**: Agent applies Checkpoint 1 (e.g., upgrading Reanimated and swapping `react-native-reanimated/plugin` for `react-native-worklets/plugin`).
4.  **Verify**: Agent relies on E2E testing (e.g., Detox) before moving to Checkpoint 2.

## 3. The TCDI MCP Server
By wrapping TCDI in an MCP Server (`docs/changelog-intelligence/engine/mcp-server.mjs`), we achieve true interoperability. Any standard AI agent (Cursor, Claude Code, or Polymath) can attach to the repository and immediately inherit the collective knowledge of the React Native ecosystem, navigating breaking changes autonomously.
