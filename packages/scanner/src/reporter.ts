/**
 * @file reporter.ts
 * Formats ScanResult into human-readable text or structured JSON.
 * Signal-only output — no code edits, no fix suggestions beyond guidance links.
 */

import type { FenceFinding, RadarFinding, ScanResult, Severity } from './types.js';

// ─── ANSI colours ─────────────────────────────────────────────────────────────

const C = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  dim:     '\x1b[2m',
  red:     '\x1b[31m',
  yellow:  '\x1b[33m',
  cyan:    '\x1b[36m',
  magenta: '\x1b[35m',
  green:   '\x1b[32m',
  blue:    '\x1b[34m',
};

function sevColor(sev: Severity): string {
  switch (sev) {
    case 'CRITICAL': return C.red;
    case 'HIGH':     return C.yellow;
    case 'MEDIUM':   return C.magenta;
    default:         return C.dim;
  }
}

function sevLabel(sev: Severity): string {
  return `${sevColor(sev)}[${sev}]${C.reset}`;
}

// ─── Fence section ────────────────────────────────────────────────────────────

function renderFenceSection(findings: FenceFinding[]): string {
  if (findings.length === 0) {
    return `${C.green}  ✓ Legacy Fence: no violations found.${C.reset}\n`;
  }

  // Group by package
  const byPkg = new Map<string, FenceFinding[]>();
  for (const f of findings) {
    const list = byPkg.get(f.signal.package) ?? [];
    list.push(f);
    byPkg.set(f.signal.package, list);
  }

  const lines: string[] = [];
  lines.push(`${C.bold}${C.red}  🛡️  Legacy Fence — ${findings.length} violation(s)${C.reset}`);
  lines.push('');

  for (const [pkg, pkgFindings] of byPkg.entries()) {
    const { v_start, v_current } = findings[0]!.signal as never as { v_start: string; v_current: string };
    lines.push(`  ${C.cyan}${C.bold}${pkg}${C.reset}`);

    // Group by signal
    const bySignal = new Map<string, FenceFinding[]>();
    for (const f of pkgFindings) {
      const list = bySignal.get(f.signal.entryId) ?? [];
      list.push(f);
      bySignal.set(f.signal.entryId, list);
    }

    for (const [, sigFindings] of bySignal.entries()) {
      const { signal } = sigFindings[0]!;
      const stateBadge = signal.lifecycleState === 'UNSUPPORTED_REMOVED'
        ? `${C.red}${C.bold}[UNSUPPORTED]${C.reset}`
        : signal.lifecycleState === 'BROKEN_DEFECTIVE'
          ? `${C.red}[DEFECTIVE]${C.reset}`
          : `${C.yellow}[DEPRECATED]${C.reset}`;

      lines.push(`  ${sevLabel(signal.severity)} ${stateBadge} ${C.bold}${signal.title}${C.reset}`);
      lines.push(`  ${C.dim}Active from v${signal.activeFrom} · ${signal.impactType}${C.reset}`);
      for (const f of sigFindings) {
        lines.push(`    ${C.yellow}→${C.reset} ${f.file}${C.dim}:${f.line}${C.reset}`);
        if (f.excerpt) lines.push(`      ${C.dim}${f.excerpt}${C.reset}`);
      }
      lines.push(`    ${C.blue}📖 ${signal.chronologyFile}${C.reset}`);
      lines.push('');
    }
  }

  return lines.join('\n');
}

// ─── Radar section ────────────────────────────────────────────────────────────

function renderRadarSection(findings: RadarFinding[]): string {
  if (findings.length === 0) {
    return `${C.green}  ✓ Capabilities Radar: all available capabilities appear adopted.${C.reset}\n`;
  }

  const lines: string[] = [];
  lines.push(`${C.bold}${C.cyan}  🔭 Capabilities Radar — ${findings.length} missed adoption(s)${C.reset}`);
  lines.push('');

  const byPkg = new Map<string, RadarFinding[]>();
  for (const f of findings) {
    const list = byPkg.get(f.signal.package) ?? [];
    list.push(f);
    byPkg.set(f.signal.package, list);
  }

  for (const [pkg, pkgFindings] of byPkg.entries()) {
    lines.push(`  ${C.cyan}${C.bold}${pkg}${C.reset}`);
    for (const f of pkgFindings) {
      lines.push(`  ${C.magenta}[SUGGESTION]${C.reset} ${C.bold}${f.signal.title}${C.reset}`);
      lines.push(`  ${C.dim}Available since v${f.signal.availableSince}${C.reset}`);
      if (f.signal.capabilitiesUnlocked.length > 0) {
        lines.push(`    APIs: ${C.cyan}${f.signal.capabilitiesUnlocked.join(', ')}${C.reset}`);
      }
      if (f.relatedFiles.length > 0) {
        lines.push(`    Files using ${pkg}:`);
        for (const rf of f.relatedFiles.slice(0, 5)) {
          lines.push(`      ${C.dim}${rf}${C.reset}`);
        }
        if (f.relatedFiles.length > 5) {
          lines.push(`      ${C.dim}… and ${f.relatedFiles.length - 5} more${C.reset}`);
        }
      }
      lines.push(`    ${C.blue}📖 ${f.signal.chronologyFile}${C.reset}`);
      lines.push('');
    }
  }

  return lines.join('\n');
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function formatReport(result: ScanResult, format: 'text' | 'json'): string {
  if (format === 'json') return JSON.stringify(result, null, 2);

  const { summary, versionRanges, fenceFindings, radarFindings, scannedAt } = result;

  const lines: string[] = [];
  lines.push('');
  lines.push(`${C.bold}${'═'.repeat(64)}${C.reset}`);
  lines.push(`${C.bold}  rn-terrain scan${C.reset} — ${result.projectCwd}`);
  lines.push(`${C.dim}  ${scannedAt} · ${summary.filesWalked} files · ${summary.packagesScanned} packages${C.reset}`);
  lines.push('');

  // Version range summary
  lines.push(`${C.bold}  Version Ranges:${C.reset}`);
  for (const [pkg, { v_start, v_current }] of Object.entries(versionRanges)) {
    if (v_start === v_current) {
      lines.push(`    ${C.dim}${pkg}${C.reset}  ${C.cyan}${v_current}${C.reset}`);
    } else {
      lines.push(`    ${C.dim}${pkg}${C.reset}  ${C.yellow}${v_start}${C.reset} ${C.dim}→${C.reset} ${C.cyan}${v_current}${C.reset}`);
    }
  }
  lines.push('');
  lines.push(`${'─'.repeat(64)}`);
  lines.push('');

  lines.push(renderFenceSection(fenceFindings));
  lines.push(`${'─'.repeat(64)}`);
  lines.push('');
  lines.push(renderRadarSection(radarFindings));
  lines.push(`${'═'.repeat(64)}`);
  lines.push('');

  // Summary footer
  const fenceColor = summary.critical > 0 ? C.red : summary.high > 0 ? C.yellow : C.green;
  lines.push(
    `${C.bold}  Adoption Quadrants:${C.reset} ` +
    `${C.red}Lethal/Removed: ${summary.unsupportedRemoved ?? 0}${C.reset} · ` +
    `${C.yellow}Defective/Regressions: ${summary.brokenDefective ?? 0}${C.reset} · ` +
    `${C.dim}Deprecations: ${summary.deprecated ?? 0}${C.reset} · ` +
    `${C.cyan}Unadopted Capabilities: ${summary.totalRadarFindings}${C.reset}`
  );
  lines.push(
    `${C.bold}  Severity Triage:${C.reset} ` +
    `${fenceColor}${summary.critical} critical${C.reset} · ` +
    `${C.yellow}${summary.high} high${C.reset} · ` +
    `${C.dim}${summary.medium} medium${C.reset}`
  );
  lines.push('');

  return lines.join('\n');
}
