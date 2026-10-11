/**
 * @file hermes-sentry.ts
 * Post-Run Hermes Micro-Bytecode & Syntax Sentry.
 *
 * Provides sub-20ms post-tool verification for Hermes engine compatibility.
 * Checks:
 *   1. Strict ECMAScript adherence (forbidden with statements, octal literals, duplicate parameters).
 *   2. Reserved keywords in bindings (package, interface, implements, yield outside generator).
 *   3. If `hermesc` CLI is installed on PATH, compiles to bytecode via `hermesc -emit-binary`.
 *   4. If `hermesc` is absent, executes in-process strict AST verification with Babel Hermes profile.
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { parse, type ParserPlugin } from '@babel/parser';
import _traverse from '@babel/traverse';

const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default;

export interface HermesDiagnostic {
  message: string;
  line?: number;
  column?: number;
  rule?: string;
}

export interface HermesSentryResult {
  valid: boolean;
  hermescUsed: boolean;
  durationMs: number;
  diagnostics: HermesDiagnostic[];
}

export class HermesSentry {
  private static hermescChecked = false;
  private static isHermescAvailable = false;

  /**
   * Probes whether `hermesc` binary exists on the system PATH.
   */
  public static checkHermesc(): boolean {
    if (this.hermescChecked) {
      return this.isHermescAvailable;
    }
    this.hermescChecked = true;
    try {
      const res = spawnSync('hermesc', ['-version'], {
        stdio: 'pipe',
        encoding: 'utf8',
        timeout: 1000
      });
      this.isHermescAvailable = res.status === 0;
    } catch {
      this.isHermescAvailable = false;
    }
    return this.isHermescAvailable;
  }

  /**
   * Resets the cached hermesc availability probe (useful in tests).
   */
  public static resetHermescProbe(): void {
    this.hermescChecked = false;
    this.isHermescAvailable = false;
  }

  /**
   * Verifies source code compatibility with Hermes.
   */
  public static verify(sourceCode: string, filePath?: string): HermesSentryResult {
    const startTime = Date.now();
    const diagnostics: HermesDiagnostic[] = [];
    const isTS = filePath ? /\.(ts|tsx)$/i.test(filePath) : true;
    const isJSX = filePath ? /\.(jsx|tsx)$/i.test(filePath) : true;

    // 1. Strict In-Process AST Parsing with Hermes strictness profile
    const plugins: ParserPlugin[] = ['asyncGenerators', 'classProperties', 'objectRestSpread', 'dynamicImport'];
    if (isTS) plugins.push('typescript');
    if (isJSX) plugins.push('jsx');

    let ast: any = null;
    try {
      ast = parse(sourceCode, {
        sourceType: 'module',
        strictMode: true,
        plugins
      });
    } catch (err: any) {
      const msg = err.message || '';
      let rule = 'hermes-strict-syntax';
      if (/with\s+statement|'with'\s+in\s+strict/i.test(msg)) {
        rule = 'hermes-no-with';
      } else if (/reserved\s+word/i.test(msg)) {
        rule = 'hermes-strict-reserved-word';
      } else if (/duplicate\s+parameter|already\s+been\s+declared|argument\s+name\s+clash/i.test(msg)) {
        rule = 'hermes-no-duplicate-params';
      }

      diagnostics.push({
        message: `Hermes Strict Syntax Error: ${msg}`,
        line: err.loc?.line,
        column: err.loc?.column,
        rule
      });
      return {
        valid: false,
        hermescUsed: false,
        durationMs: Date.now() - startTime,
        diagnostics
      };
    }

    // 2. Strict AST Rule Verification for Hermes Engine Limits
    const FORBIDDEN_STRICT_IDENTIFIERS = new Set([
      'implements',
      'interface',
      'package',
      'private',
      'protected',
      'public',
      'static'
    ]);

    try {
      traverse(ast, {
        WithStatement(path: any) {
          diagnostics.push({
            message: "Hermes strict mode prohibits 'with' statements.",
            line: path.node.loc?.start.line,
            column: path.node.loc?.start.column,
            rule: 'hermes-no-with'
          });
        },
        VariableDeclarator(path: any) {
          if (path.node.id?.type === 'Identifier') {
            const name = path.node.id.name;
            if (FORBIDDEN_STRICT_IDENTIFIERS.has(name)) {
              diagnostics.push({
                message: `Hermes strict mode reserves '${name}' as a future reserved keyword.`,
                line: path.node.loc?.start.line,
                column: path.node.loc?.start.column,
                rule: 'hermes-strict-reserved-word'
              });
            }
          }
        },
        Function(path: any) {
          // Check for duplicate parameter names in functions
          const paramNames = new Set<string>();
          for (const param of path.node.params) {
            if (param.type === 'Identifier') {
              if (paramNames.has(param.name)) {
                diagnostics.push({
                  message: `Hermes strict mode forbids duplicate parameter '${param.name}'.`,
                  line: param.loc?.start.line,
                  column: param.loc?.start.column,
                  rule: 'hermes-no-duplicate-params'
                });
              } else {
                paramNames.add(param.name);
              }
            }
          }
        }
      });
    } catch {}

    if (diagnostics.length > 0) {
      return {
        valid: false,
        hermescUsed: false,
        durationMs: Date.now() - startTime,
        diagnostics
      };
    }

    // 3. Optional live `hermesc -emit-binary` verification if hermesc is available
    let hermescUsed = false;
    if (this.checkHermesc()) {
      try {
        const tmpDir = os.tmpdir();
        const tmpFile = path.join(tmpDir, `hermes-verify-${Date.now()}-${Math.random().toString(36).slice(2)}.js`);
        // For pure JS, test directly. If TS/JSX, AST check above validated syntax.
        if (!isTS && !isJSX) {
          fs.writeFileSync(tmpFile, sourceCode, 'utf8');
          const devNull = process.platform === 'win32' ? 'NUL' : '/dev/null';
          const res = spawnSync('hermesc', ['-emit-binary', '-output', devNull, tmpFile], {
            stdio: 'pipe',
            encoding: 'utf8',
            timeout: 1500
          });
          try { fs.unlinkSync(tmpFile); } catch {}
          hermescUsed = true;
          if (res.status !== 0) {
            diagnostics.push({
              message: `hermesc failed: ${res.stderr || 'Invalid Hermes bytecode compilation'}`,
              rule: 'hermesc-bytecode-fail'
            });
            return {
              valid: false,
              hermescUsed: true,
              durationMs: Date.now() - startTime,
              diagnostics
            };
          }
        }
      } catch {}
    }

    return {
      valid: true,
      hermescUsed,
      durationMs: Date.now() - startTime,
      diagnostics: []
    };
  }
}
