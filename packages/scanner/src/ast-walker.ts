/**
 * @file ast-walker.ts
 * Walks every JS/TS/JSX/TSX source file in a project directory and matches
 * accumulated TCDI signals against the AST.
 *
 * Two modes:
 *   Legacy Fence  — finds usages of deprecated/removed/broken APIs  → FenceFinding[]
 *   Capabilities Radar — detects absence of modern APIs that should be adopted → RadarFinding[]
 */

import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import * as t from '@babel/types';
import { readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import type {
  AstMatcher,
  CapabilitySignal,
  FenceFinding,
  LegacySignal,
  ProjectSignals,
  RadarFinding,
} from './types.js';

// Babel's default export interop
const traverse = (_traverse as unknown as { default: typeof _traverse }).default ?? _traverse;

// ─── Source file discovery ────────────────────────────────────────────────────

const SOURCE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.mts']);
const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'output',
  'playwright',
  '.expo',
  '.turbo',
  'coverage',
  '.next',
  'generated',
]);

function* walkSourceFiles(dir: string): Generator<string> {
  let entries: import('node:fs').Dirent[];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkSourceFiles(full);
    } else if (SOURCE_EXTS.has(extname(entry.name))) {
      yield full;
    }
  }
}

// ─── Babel parse ─────────────────────────────────────────────────────────────

function parseFile(filePath: string): ReturnType<typeof parse> | null {
  try {
    const src = readFileSync(filePath, 'utf-8');
    return parse(src, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'decorators-legacy'],
      errorRecovery: true,
    });
  } catch {
    return null;
  }
}

// ─── Matcher engine ───────────────────────────────────────────────────────────

interface MatchLocation { line: number; column: number; excerpt: string }

function matchNode(node: t.Node, matcher: AstMatcher, src: string): MatchLocation | null {
  const lines = src.split('\n');
  const lineAt = (n: t.Node) => (n.loc?.start.line ?? 1) - 1;
  const colAt  = (n: t.Node) => n.loc?.start.column ?? 0;
  const excerptAt = (n: t.Node) => lines[lineAt(n)]?.trim() ?? '';

  switch (matcher.type) {
    case 'JSXIdentifier':
      if (
        t.isJSXOpeningElement(node) &&
        t.isJSXIdentifier(node.name) &&
        node.name.name === matcher.name
      ) {
        return { line: lineAt(node) + 1, column: colAt(node), excerpt: excerptAt(node) };
      }
      break;

    case 'ImportSpecifier':
      if (
        t.isImportDeclaration(node) &&
        (!matcher.from || node.source.value === matcher.from || node.source.value.includes(matcher.from))
      ) {
        for (const spec of node.specifiers) {
          if (t.isImportSpecifier(spec)) {
            const importedName = t.isIdentifier(spec.imported)
              ? spec.imported.name
              : t.isStringLiteral(spec.imported)
                ? spec.imported.value
                : '';
            if (importedName === matcher.name) {
              const target = spec.loc ?? node.loc;
              const line = target ? target.start.line : lineAt(node) + 1;
              const column = target ? target.start.column : colAt(node);
              const excerpt = lines[line - 1]?.trim() ?? excerptAt(node);
              return { line, column, excerpt };
            }
          }
        }
      }
      break;

    case 'JSXAttribute':
      if (
        t.isJSXAttribute(node) &&
        t.isJSXIdentifier(node.name) &&
        node.name.name === matcher.name
      ) {
        return { line: lineAt(node) + 1, column: colAt(node), excerpt: excerptAt(node) };
      }
      break;

    case 'CallExpression':
      if (
        t.isCallExpression(node) &&
        t.isIdentifier(node.callee) &&
        node.callee.name === matcher.callee
      ) {
        return { line: lineAt(node) + 1, column: colAt(node), excerpt: excerptAt(node) };
      }
      break;

    case 'MemberExpression':
      if (
        t.isMemberExpression(node) &&
        t.isIdentifier(node.object) &&
        t.isIdentifier(node.property) &&
        node.object.name === matcher.object &&
        node.property.name === matcher.property
      ) {
        return { line: lineAt(node) + 1, column: colAt(node), excerpt: excerptAt(node) };
      }
      break;

    case 'Regex': {
      // Regex matchers run on the raw source line — not the AST
      // We handle these separately in the file-level pass.
      break;
    }
  }
  return null;
}

// ─── Legacy Fence ─────────────────────────────────────────────────────────────

function runFenceOnFile(
  filePath: string,
  src: string,
  ast: ReturnType<typeof parse>,
  signals: LegacySignal[]
): FenceFinding[] {
  const findings: FenceFinding[] = [];
  const lines = src.split('\n');

  // AST-based matchers
  const astSignals = signals.filter((s) =>
    s.matchers.some((m) => m.type !== 'Regex')
  );
  if (astSignals.length > 0) {
    try {
      traverse(ast, {
        noScope: true,
        enter(path) {
          for (const signal of astSignals) {
            for (const matcher of signal.matchers) {
              if (matcher.type === 'Regex') continue;
              const loc = matchNode(path.node, matcher, src);
              if (loc) {
                findings.push({ signal, file: filePath, ...loc });
              }
            }
          }
        },
      });
    } catch {
      // Gracefully ignore traverse edge-case errors on invalid or malformed ASTs
    }
  }

  // Regex-based matchers (line-by-line fallback for complex patterns)
  const regexSignals = signals.filter((s) =>
    s.matchers.some((m) => m.type === 'Regex')
  );
  for (const signal of regexSignals) {
    for (const matcher of signal.matchers) {
      if (matcher.type !== 'Regex') continue;
      const re = new RegExp(matcher.pattern, matcher.flags ?? 'g');
      lines.forEach((line, idx) => {
        if (re.test(line)) {
          findings.push({
            signal,
            file: filePath,
            line: idx + 1,
            column: 0,
            excerpt: line.trim(),
          });
        }
        re.lastIndex = 0; // reset stateful regex
      });
    }
  }

  return findings;
}

// ─── Capabilities Radar ───────────────────────────────────────────────────────

/** Check whether ANY of a capability's unlocked API names appear in a file. */
function fileUsesCapability(src: string, signal: CapabilitySignal): boolean {
  return signal.capabilitiesUnlocked.some((cap) => src.includes(cap));
}

/** Check whether a file imports from the given package at all. */
function fileImportsPackage(src: string, pkg: string): boolean {
  return src.includes(`from '${pkg}'`) || src.includes(`from "${pkg}"`);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface WalkerOptions {
  /** Root directory to walk for source files. */
  srcDir: string;
  /** Accumulated signals from the corpus range query. */
  projectSignals: ProjectSignals;
  /** Relative base for reporting file paths. */
  baseCwd: string;
}

export interface WalkerResult {
  fenceFindings: FenceFinding[];
  radarFindings: RadarFinding[];
  filesWalked: number;
}

export function walkProject(opts: WalkerOptions): WalkerResult {
  const { srcDir, projectSignals, baseCwd } = opts;

  // Flatten all legacy signals across packages
  const allLegacySignals: LegacySignal[] = Object.values(projectSignals).flatMap(
    (s) => s.legacySignals
  );

  // Flatten all capability signals, group by package
  const capabilitySignalsByPkg = new Map<string, CapabilitySignal[]>();
  for (const [pkg, { capabilitySignals }] of Object.entries(projectSignals)) {
    if (capabilitySignals.length > 0) {
      capabilitySignalsByPkg.set(pkg, capabilitySignals);
    }
  }

  // Build fast candidate keyword filter to avoid expensive Babel parsing on unrelated files
  const candidateKeywords = new Set<string>();
  for (const s of allLegacySignals) {
    candidateKeywords.add(s.package);
    for (const m of s.matchers) {
      if (m.type === 'JSXIdentifier' || m.type === 'ImportSpecifier' || m.type === 'JSXAttribute') {
        candidateKeywords.add(m.name);
      } else if (m.type === 'CallExpression') {
        candidateKeywords.add(m.callee);
      } else if (m.type === 'MemberExpression') {
        candidateKeywords.add(m.object);
        candidateKeywords.add(m.property);
      }
    }
  }
  for (const pkg of capabilitySignalsByPkg.keys()) {
    candidateKeywords.add(pkg);
  }
  const keywordsList = Array.from(candidateKeywords);

  const fenceFindings: FenceFinding[] = [];
  // Radar: track which files import each package
  const pkgImportFiles = new Map<string, string[]>();
  // Radar: track which capabilities ARE found
  const foundCapabilities = new Set<string>();
  let filesWalked = 0;

  for (const filePath of walkSourceFiles(srcDir)) {
    let src: string;
    try { src = readFileSync(filePath, 'utf-8'); } catch { continue; }
    const relPath = relative(baseCwd, filePath);
    filesWalked++;

    // Fast candidate pre-filter
    const hasCandidate = keywordsList.length === 0 || keywordsList.some((kw) => src.includes(kw));
    if (!hasCandidate) continue;

    // ── Legacy Fence pass ──
    if (allLegacySignals.length > 0) {
      const ast = parseFile(filePath);
      if (ast) {
        fenceFindings.push(
          ...runFenceOnFile(relPath, src, ast, allLegacySignals)
        );
      }
    }

    // ── Capabilities Radar pass ──
    for (const [pkg, signals] of capabilitySignalsByPkg.entries()) {
      if (!fileImportsPackage(src, pkg)) continue;

      // Track that this file uses the package
      if (!pkgImportFiles.has(pkg)) pkgImportFiles.set(pkg, []);
      pkgImportFiles.get(pkg)!.push(relPath);

      for (const signal of signals) {
        if (fileUsesCapability(src, signal)) {
          foundCapabilities.add(signal.entryId);
        }
      }
    }
  }

  // Radar: emit findings for capabilities that were NEVER found (only if package is actually imported)
  const radarFindings: RadarFinding[] = [];
  for (const [pkg, signals] of capabilitySignalsByPkg.entries()) {
    const relatedFiles = pkgImportFiles.get(pkg) ?? [];
    if (relatedFiles.length === 0) continue;

    for (const signal of signals) {
      if (!foundCapabilities.has(signal.entryId)) {
        radarFindings.push({
          signal,
          relatedFiles,
        });
      }
    }
  }

  return { fenceFindings, radarFindings, filesWalked };
}
