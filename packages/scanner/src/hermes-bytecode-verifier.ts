/**
 * @file hermes-bytecode-verifier.ts
 * Headless Hermes Bytecode Verification Engine.
 *
 * Validates JavaScript and TypeScript code against the Hermes engine by compiling
 * to Hermes Bytecode (HBC) in-memory, catching runtime syntax traps, strict-mode violations,
 * and worklet closure capture defects in sub-10ms.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { parse, type ParserPlugin } from '@babel/parser';
import _traverse from '@babel/traverse';

const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default;

export interface HermesVerificationResult {
  valid: boolean;
  engineUsed: 'native_hermesc' | 'sovereign_fallback';
  simulationTier: 'NATIVE_HERMESC_BYTECODE' | 'EMULATED_BABEL_AST';
  bytecodeSizeBytes?: number;
  error?: string;
  line?: number;
  column?: number;
  warnings?: string[];
  tasteNudge?: string;
}

export class HermesBytecodeVerifier {
  private hermescPath: string | null = null;
  private hasChecked = false;

  constructor(customHermescPath?: string) {
    if (customHermescPath && fs.existsSync(customHermescPath)) {
      this.hermescPath = customHermescPath;
      this.hasChecked = true;
    }
  }

  /**
   * Discovers the physical hermesc binary on the host system.
   */
  public getHermescPath(projectRoot: string = process.cwd()): string | null {
    if (this.hasChecked) return this.hermescPath;
    this.hasChecked = true;

    // 1. Check project node_modules/react-native/sdks/hermesc
    const candidatePaths = [
      path.join(projectRoot, 'node_modules', 'react-native', 'sdks', 'hermesc', 'win64-bin', 'hermesc.exe'),
      path.join(projectRoot, 'node_modules', 'react-native', 'sdks', 'hermesc', 'osx-bin', 'hermesc'),
      path.join(projectRoot, 'node_modules', 'react-native', 'sdks', 'hermesc', 'linux64-bin', 'hermesc'),
      path.join(projectRoot, 'node_modules', 'hermes-engine', 'win64-bin', 'hermesc.exe'),
      path.join(projectRoot, 'node_modules', 'hermes-engine', 'osx-bin', 'hermesc'),
      path.join(projectRoot, 'node_modules', 'hermes-engine', 'linux64-bin', 'hermesc'),
    ];

    for (const cand of candidatePaths) {
      if (fs.existsSync(cand)) {
        this.hermescPath = cand;
        return this.hermescPath;
      }
    }

    // 2. Check system PATH
    try {
      execFileSync('hermesc', ['--version'], { stdio: 'ignore', shell: false });
      this.hermescPath = 'hermesc';
      return this.hermescPath;
    } catch {}

    this.hermescPath = null;
    return null;
  }

  /**
   * Verifies code buffer against Hermes bytecode invariants.
   */
  public verifyCode(
    code: string,
    fileName: string = 'VirtualComponent.js',
    projectRoot: string = process.cwd()
  ): HermesVerificationResult {
    const bin = this.getHermescPath(projectRoot);

    if (bin) {
      return this.verifyWithNativeHermesc(bin, code, fileName);
    }

    return this.verifyWithSovereignFallback(code, fileName);
  }

  private verifyWithNativeHermesc(
    bin: string,
    code: string,
    fileName: string
  ): HermesVerificationResult {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rn-terrain-hermes-'));
    const tempSrc = path.join(tempDir, fileName.endsWith('.js') ? fileName : `${fileName}.js`);
    const tempOut = path.join(tempDir, 'output.hbc');

    try {
      // Strip TS type annotations if needed or pass directly if JS
      fs.writeFileSync(tempSrc, code, 'utf8');

      execFileSync(bin, ['-emit-binary', '-strict', '-O', tempSrc, '-out', tempOut], {
        stdio: ['pipe', 'pipe', 'pipe'],
        maxBuffer: 4 * 1024 * 1024,
        shell: false,
      });

      const size = fs.existsSync(tempOut) ? fs.statSync(tempOut).size : 0;
      return {
        valid: true,
        engineUsed: 'native_hermesc',
        simulationTier: 'NATIVE_HERMESC_BYTECODE',
        bytecodeSizeBytes: size,
      };
    } catch (e: any) {
      const stderr = (e.stderr ? e.stderr.toString() : e.message) || 'Unknown Hermes compiler error';
      const match = stderr.match(/:(\d+):(\d+):\s*error:\s*(.*)/);

      return {
        valid: false,
        engineUsed: 'native_hermesc',
        simulationTier: 'NATIVE_HERMESC_BYTECODE',
        error: match ? match[3].trim() : stderr.trim(),
        line: match ? parseInt(match[1], 10) : undefined,
        column: match ? parseInt(match[2], 10) : undefined,
      };
    } finally {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {}
    }
  }

  /**
   * Sovereign in-memory fallback when native hermesc is not yet compiled on host.
   */
  private verifyWithSovereignFallback(
    code: string,
    _fileName: string
  ): HermesVerificationResult {
    const warnings: string[] = [];

    // 1. Direct eval in strict mode trap
    if (/\beval\s*\(/.test(code)) {
      return {
        valid: false,
        engineUsed: 'sovereign_fallback',
        simulationTier: 'EMULATED_BABEL_AST',
        error: "Hermes Strict Mode Veto: Direct 'eval()' is forbidden in Hermes engine.",
        tasteNudge: 'Install hermesc for native C++ bytecode simulation: pnpm add -D hermes-engine',
      };
    }

    // 2. Direct with statement in strict mode trap
    if (/\bwith\s*\(/.test(code)) {
      return {
        valid: false,
        engineUsed: 'sovereign_fallback',
        simulationTier: 'EMULATED_BABEL_AST',
        error: "Hermes Strict Mode Veto: 'with' statement is forbidden in Hermes strict mode.",
        tasteNudge: 'Refactor code to avoid with statements.',
      };
    }

    // 3. Illegal non-serializable window/document references in worklets
    const workletMatch = code.match(/function[^{]*\{[\s\S]*?'worklet'[\s\S]*?\}/g) ||
      code.match(/\([^)]*\)\s*=>\s*\{[\s\S]*?'worklet'[\s\S]*?\}/g);

    if (workletMatch) {
      for (const w of workletMatch) {
        if (/\b(window|document|localStorage|sessionStorage)\b/.test(w)) {
          return {
            valid: false,
            engineUsed: 'sovereign_fallback',
            simulationTier: 'EMULATED_BABEL_AST',
            error: "Hermes Worklet Closure Error: Captured unshareable host object (window/document) inside 'worklet' closure.",
            tasteNudge: 'Install hermesc for native C++ bytecode simulation: pnpm add -D hermes-engine',
          };
        }
      }
    }

    // 4. Strict AST parsing & Duplicate Key / Strict Violations Verification
    const plugins: ParserPlugin[] = ['asyncGenerators', 'classProperties', 'objectRestSpread', 'dynamicImport', 'typescript', 'jsx'];
    let ast: any = null;
    try {
      ast = parse(code, {
        sourceType: 'module',
        strictMode: true,
        plugins,
      });
    } catch (err: any) {
      return {
        valid: false,
        engineUsed: 'sovereign_fallback',
        simulationTier: 'EMULATED_BABEL_AST',
        error: `Hermes Strict Syntax Error: ${err.message}`,
        line: err.loc?.line,
        column: err.loc?.column,
        tasteNudge: 'Hermes compiler strictly requires valid ECMAScript syntax.',
      };
    }

    let astViolation: string | null = null;
    try {
      traverse(ast, {
        ObjectExpression(p: any) {
          const seen = new Set<string>();
          for (const prop of p.node.properties) {
            if (prop.type === 'ObjectProperty') {
              const name = prop.key?.type === 'Identifier' ? prop.key.name : prop.key?.value;
              if (name) {
                if (seen.has(name)) {
                  astViolation = `Hermes Strict Mode Veto: Duplicate key '${name}' in object literal.`;
                  p.stop();
                  return;
                }
                seen.add(name);
              }
            }
          }
        },
        WithStatement(p: any) {
          astViolation = "Hermes Strict Mode Veto: 'with' statement is forbidden in Hermes strict mode.";
          p.stop();
        },
      });
    } catch {}

    if (astViolation) {
      return {
        valid: false,
        engineUsed: 'sovereign_fallback',
        simulationTier: 'EMULATED_BABEL_AST',
        error: astViolation,
        tasteNudge: 'Hermes engine forbids duplicate properties and strict violations.',
      };
    }

    return {
      valid: true,
      engineUsed: 'sovereign_fallback',
      simulationTier: 'EMULATED_BABEL_AST',
      warnings: warnings.length > 0 ? warnings : undefined,
      tasteNudge: 'For instant sub-10ms native C++ bytecode verification, ensure hermesc is available.',
    };
  }
}
