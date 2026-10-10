/**
 * @file dev-tools-registry.ts
 * Non-React Native Developer Tools Layer for RN-Terrain.
 *
 * Tracks foundational developer tools (Package managers, JS runtimes, bundlers,
 * and Rust "Shiny Tools") that React Native ecosystems depend on.
 */

import type { TerrainCatalogPort } from '../db/catalog-port.js';
import { CanonicalDatabase } from '../db/sqlite-client.js';
import type { DevToolRecord } from '../db/canonical-schema.js';

export interface DevToolMetadata extends DevToolRecord {
  binaryName: string;
  installCommand: string;
  recommendedFlags?: string[];
  bannedFlagsOrCommands?: string[];
}

export const CANONICAL_DEV_TOOLS: DevToolMetadata[] = [
  {
    id: 'pnpm',
    category: 'PACKAGE_MANAGER',
    status: 'RECOMMENDED',
    binaryName: 'pnpm',
    primary_advantage: 'Content-addressable hardlink store, isolated node_modules, and catalogs protocol support.',
    rn_compatibility_notes: 'Fully supported in modern React Native (0.75+) with Metro symlink resolution enabled.',
    docs_url: 'https://pnpm.io',
    installCommand: 'npm install -g pnpm@12.11.2',
    recommendedFlags: ['--filter', 'catalog:', '--recursive', 'dlx'],
    bannedFlagsOrCommands: ['npm install', 'yarn add', '--shamefully-hoist (without Metro config)']
  },
  {
    id: 'bun',
    category: 'JS_ENGINE',
    status: 'SPECIALIZED',
    binaryName: 'bun',
    primary_advantage: 'Sub-millisecond startup, built-in SQLite, high-speed test runner.',
    rn_compatibility_notes: 'Excellent for monorepo scripts and fast test execution; native Metro runtime requires Node/Hermes.',
    docs_url: 'https://bun.sh',
    installCommand: 'curl -fsSL https://bun.sh/install | bash',
    recommendedFlags: ['bun test', 'bun run'],
    bannedFlagsOrCommands: ['bun install (in strict pnpm catalog workspaces)']
  },
  {
    id: 'metro',
    category: 'BUNDLER',
    status: 'RECOMMENDED',
    binaryName: 'metro',
    primary_advantage: 'Specialized React Native JS packager with fast delta bundling and HMR.',
    rn_compatibility_notes: 'Core foundation of React Native; native symlink support enabled in modern versions.',
    docs_url: 'https://metrobundler.dev',
    installCommand: 'pnpm add -D metro',
    recommendedFlags: ['resolver.unstable_enableSymlinks = true']
  },
  {
    id: 'hermes',
    category: 'JS_ENGINE',
    status: 'RECOMMENDED',
    binaryName: 'hermes',
    primary_advantage: 'Ahead-of-Time (AOT) bytecode compilation, low memory footprint, instant TTI on mobile.',
    rn_compatibility_notes: 'Default engine for React Native 0.70+ and New Architecture (Fabric).',
    docs_url: 'https://hermesengine.dev',
    installCommand: 'Bundled with React Native',
    recommendedFlags: ['hermes_engine = true']
  },
  {
    id: 'rg',
    category: 'RUST_SHINY_TOOL',
    status: 'RECOMMENDED',
    binaryName: 'rg',
    primary_advantage: 'Hyper-fast Rust-based regex search respecting .gitignore (ripgrep).',
    rn_compatibility_notes: 'Sub-50ms search across million-line mobile monorepos.',
    docs_url: 'https://github.com/BurntSushi/ripgrep',
    installCommand: 'winget install BurntSushi.ripgrep.MSVC',
    recommendedFlags: ['-n', '-C 2', '--type ts', '--type rust']
  },
  {
    id: 'fd',
    category: 'RUST_SHINY_TOOL',
    status: 'RECOMMENDED',
    binaryName: 'fd',
    primary_advantage: 'Instant directory tree navigation and filename pattern matching in Rust.',
    rn_compatibility_notes: '10x faster than native find/dir in deeply nested node_modules / android build directories.',
    docs_url: 'https://github.com/sharkdp/fd',
    installCommand: 'winget install sharkdp.fd',
    recommendedFlags: ['-e ts', '-e tsx', '-e json']
  },
  {
    id: 'oxlint',
    category: 'RUST_SHINY_TOOL',
    status: 'RECOMMENDED',
    binaryName: 'oxlint',
    primary_advantage: '50-100x faster than ESLint; written in Rust (Oxc toolchain).',
    rn_compatibility_notes: 'Ideal for pre-commit hooks and agent guardrails in React Native codebases.',
    docs_url: 'https://oxc.rs',
    installCommand: 'pnpm add -D oxlint',
    recommendedFlags: ['--deny-warnings']
  },
  {
    id: 'delta',
    category: 'RUST_SHINY_TOOL',
    status: 'RECOMMENDED',
    binaryName: 'delta',
    primary_advantage: 'Syntax-highlighted git diff pager with inline word-level diffing in Rust.',
    rn_compatibility_notes: 'Critical for human review of multi-package agent codemods and migrations.',
    docs_url: 'https://github.com/dandavison/delta',
    installCommand: 'winget install dandavison.delta',
    recommendedFlags: ['--side-by-side', '--line-numbers']
  },
  {
    id: 'mcp',
    category: 'AGENT_PROTOCOL',
    status: 'RECOMMENDED',
    binaryName: 'rn-terrain-mcp',
    primary_advantage: 'Universal AI Agent Context & Tool Protocol (JSON-RPC 2.0). Powers Antigravity, Cursor, Claude Desktop.',
    rn_compatibility_notes: 'Runs locally over stdio with full access to developer node_modules and local git diffs.',
    docs_url: 'https://modelcontextprotocol.io',
    installCommand: 'npx @intuitui-labs/rn-terrain-mcp',
    recommendedFlags: ['--stdio'],
    bannedFlagsOrCommands: ['console.log to stdout in stdio servers', 'unhandled tool exceptions']
  }
];

export class DevToolsRegistry {
  constructor(private readonly db: TerrainCatalogPort) {}

  public seedDefaults(): void {
    for (const tool of CANONICAL_DEV_TOOLS) {
      this.db.upsertDevTool({
        id: tool.id,
        category: tool.category,
        status: tool.status,
        primary_advantage: tool.primary_advantage,
        rn_compatibility_notes: tool.rn_compatibility_notes,
        docs_url: tool.docs_url
      });
    }
  }

  public getTool(id: string): DevToolMetadata | undefined {
    return CANONICAL_DEV_TOOLS.find((t) => t.id === id);
  }

  public listTools(category?: string): DevToolMetadata[] {
    if (!category) return CANONICAL_DEV_TOOLS;
    return CANONICAL_DEV_TOOLS.filter((t) => t.category === category);
  }
}
