/**
 * @file doctor.ts
 * Rust Tooling Doctor & Sovereign Nudge Engine.
 *
 * Inspects system environment for foundational Rust tools, validating their
 * availability and providing elegant, high-taste nudges for missing utilities.
 */

import { execSync } from 'node:child_process';

export interface RustToolCheck {
  id: string;
  name: string;
  command: string;
  installed: boolean;
  version: string | null;
  purpose: string;
  tasteOfTheBestRationale: string;
  url?: string;
  installRecipes: {
    windows: string;
    macos: string;
    cargo?: string;
    pnpm?: string;
  };
}

export const SOVEREIGN_RUST_TOOLS: Omit<RustToolCheck, 'installed' | 'version'>[] = [
  {
    id: 'rg',
    name: 'ripgrep',
    command: 'rg --version',
    purpose: 'Hyper-fast multi-threaded regex search respecting gitignore',
    tasteOfTheBestRationale: 'Sub-50ms search across million-line mobile codebases. Saves agent tokens and developer seconds on every search.',
    url: 'https://github.com/BurntSushi/ripgrep',
    installRecipes: {
      windows: 'winget install BurntSushi.ripgrep.MSVC',
      macos: 'brew install ripgrep',
      cargo: 'cargo install ripgrep'
    }
  },
  {
    id: 'fd',
    name: 'fd-find',
    command: 'fd --version',
    purpose: 'Instant filesystem directory traversal and file discovery in Rust',
    tasteOfTheBestRationale: '10x faster than native find/dir; never hangs inside nested node_modules or android build caches.',
    url: 'https://github.com/sharkdp/fd',
    installRecipes: {
      windows: 'winget install sharkdp.fd',
      macos: 'brew install fd',
      cargo: 'cargo install fd-find'
    }
  },
  {
    id: 'sd',
    name: 'sd',
    command: 'sd --version',
    purpose: 'Intuitive, fast regex find-and-replace in Rust',
    tasteOfTheBestRationale: 'Replaces archaic sed syntax with clean, modern regex semantics without shell escaping nightmares.',
    url: 'https://github.com/chmln/sd',
    installRecipes: {
      windows: 'cargo install sd',
      macos: 'brew install sd',
      cargo: 'cargo install sd'
    }
  },
  {
    id: 'bat',
    name: 'bat',
    command: 'bat --version',
    purpose: 'Syntax-highlighted file viewing and terminal code inspector',
    tasteOfTheBestRationale: 'Cat clone with rich syntax highlighting, git modifications in gutter, and automatic terminal pagination.',
    url: 'https://github.com/sharkdp/bat',
    installRecipes: {
      windows: 'winget install sharkdp.bat',
      macos: 'brew install bat',
      cargo: 'cargo install bat'
    }
  },
  {
    id: 'eza',
    name: 'eza',
    command: 'eza --version',
    purpose: 'Modern, maintained directory inventory with tree view in Rust',
    tasteOfTheBestRationale: 'Displays file git statuses, permissions, and hierarchical trees instantly in your terminal.',
    url: 'https://eza.rocks',
    installRecipes: {
      windows: 'winget install eza-community.eza',
      macos: 'brew install eza',
      cargo: 'cargo install eza'
    }
  },
  {
    id: 'delta',
    name: 'git-delta',
    command: 'delta --version',
    purpose: 'Syntax-highlighted git diff pager with inline word-level diffing',
    tasteOfTheBestRationale: 'Transforms illegible unified diffs into human-readable side-by-side reviews with true syntax highlighting.',
    url: 'https://github.com/dandavison/delta',
    installRecipes: {
      windows: 'winget install dandavison.delta',
      macos: 'brew install git-delta',
      cargo: 'cargo install git-delta'
    }
  },
  {
    id: 'oxlint',
    name: 'oxlint',
    command: 'oxlint --version',
    purpose: '50-100x faster JavaScript and TypeScript linter in Rust',
    tasteOfTheBestRationale: 'Instant pre-flight linting that catches React Native anti-patterns in under 15ms without ESLint bloat.',
    url: 'https://oxc.rs',
    installRecipes: {
      windows: 'npm install -g oxlint',
      macos: 'npm install -g oxlint',
      pnpm: 'pnpm add -D oxlint'
    }
  },
  {
    id: 'biome',
    name: 'biome',
    command: 'biome --version',
    purpose: 'High-speed Rust toolchain for formatting and linting',
    tasteOfTheBestRationale: 'Sub-millisecond formatter replacing Prettier with zero configuration overhead.',
    url: 'https://biomejs.dev',
    installRecipes: {
      windows: 'npm install -g @biomejs/biome',
      macos: 'npm install -g @biomejs/biome',
      pnpm: 'pnpm add -D @biomejs/biome'
    }
  },
  {
    id: 'taplo',
    name: 'taplo',
    command: 'taplo -V',
    purpose: 'Ultra-fast TOML toolkit, validator, formatter, and Cargo linter in Rust',
    tasteOfTheBestRationale: 'Validates Cargo.toml, rust-toolchain.toml, and native configs with sub-millisecond precision.',
    url: 'https://taplo.tamasfe.dev',
    installRecipes: {
      windows: 'npm install -g @taplo/cli',
      macos: 'brew install taplo',
      cargo: 'cargo install taplo-cli --locked'
    }
  },
  {
    id: 'lld',
    name: 'lld',
    command: 'lld --version',
    purpose: 'High-performance LLVM linker for C++20, TurboModules, and Android NDK',
    tasteOfTheBestRationale: 'Accelerates native C++ module linking by 4-10x during Android NDK and native builds.',
    url: 'https://lld.llvm.org',
    installRecipes: {
      windows: 'winget install LLVM.LLVM',
      macos: 'brew install llvm',
      cargo: 'winget install LLVM.LLVM'
    }
  },
  {
    id: 'mold',
    name: 'mold',
    command: 'mold --version',
    purpose: 'Extremely fast modern linker for Linux ELF and Android NDK cross-compilation',
    tasteOfTheBestRationale: 'Up to 4-10x faster than GNU ld/gold for linking large native shared libraries.',
    url: 'https://github.com/rui314/mold',
    installRecipes: {
      windows: 'winget install LLVM.LLVM',
      macos: 'brew install mold',
      cargo: 'cargo install mold'
    }
  }
];

export interface DoctorReport {
  timestamp: string;
  totalTools: number;
  installedCount: number;
  missingCount: number;
  tools: RustToolCheck[];
  nudges: {
    tool: string;
    whyAdopt: string;
    oneLinerInstall: string;
  }[];
}

export class RustToolingDoctor {
  public runDiagnostic(): DoctorReport {
    const checkedTools: RustToolCheck[] = [];
    const nudges: DoctorReport['nudges'] = [];

    for (const tool of SOVEREIGN_RUST_TOOLS) {
      let installed = false;
      let version: string | null = null;

      try {
        let cmd = tool.command;
        if (tool.id === 'lld' && process.platform === 'win32') {
          cmd = 'lld --version 2>nul || lld-link --version 2>nul || ld.lld --version 2>nul || "C:\\Program Files\\LLVM\\bin\\lld.exe" --version 2>nul';
        }
        const raw = execSync(cmd, { stdio: 'pipe', timeout: 1000 }).toString();
        const firstLine = raw.split('\n')[0]?.trim();
        if (firstLine) {
          installed = true;
          version = firstLine;
        }
      } catch (e: any) {
        const output = e.stdout ? e.stdout.toString().trim() : '';
        const firstLine = output.split('\n')[0]?.trim();
        if (firstLine && !firstLine.includes('not recognized') && !firstLine.includes('not found')) {
          installed = true;
          version = firstLine;
        } else {
          installed = false;
          version = null;
        }
      }

      checkedTools.push({
        ...tool,
        installed,
        version
      });

      if (!installed) {
        nudges.push({
          tool: tool.name,
          whyAdopt: tool.tasteOfTheBestRationale,
          oneLinerInstall: tool.installRecipes.windows
        });
      }
    }

    return {
      timestamp: new Date().toISOString(),
      totalTools: checkedTools.length,
      installedCount: checkedTools.filter((t) => t.installed).length,
      missingCount: nudges.length,
      tools: checkedTools,
      nudges
    };
  }
}
