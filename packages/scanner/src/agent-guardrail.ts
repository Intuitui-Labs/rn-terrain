/**
 * @file agent-guardrail.ts
 * Pre-Flight Agent Guardrail & Anti-Hallucination Interceptor.
 *
 * Intercepts AI coding agent token emissions and code diffs in microseconds (<30ms)
 * to prevent obsolete/severed Major-1 APIs from reaching the file system.
 */

import { TreeSitterCodeMatcher, type PatternFinding } from './tree-sitter-matcher.js';

export interface GuardrailCheckOptions {
  packageName: string;
  targetVersion: string;
  codeSnippet: string;
  filePath?: string;
}

export interface GuardrailVerdict {
  allowed: boolean;
  status: 'PASSED' | 'WARNING_DEPRECATED' | 'BLOCKED_SEVERED_API';
  severedViolations: PatternFinding[];
  deprecatedWarnings: PatternFinding[];
  remediationPrompt?: string;
  latencyMs: number;
}

export class AgentGuardrail {
  private matcher: TreeSitterCodeMatcher;

  constructor(matcher?: TreeSitterCodeMatcher) {
    this.matcher = matcher ?? new TreeSitterCodeMatcher();
  }

  public verify(options: GuardrailCheckOptions): GuardrailVerdict {
    const startTime = performance.now();
    const filePath = options.filePath ?? 'virtual-agent-diff.tsx';

    const findings = this.matcher.scanSource(filePath, options.codeSnippet);

    const severedViolations = findings.filter(
      (f) => f.severity === 'UNSUPPORTED_REMOVED' || f.severity === 'BROKEN_DEFECTIVE'
    );
    const deprecatedWarnings = findings.filter((f) => f.severity === 'DEPRECATED');

    const latencyMs = Math.round(performance.now() - startTime);

    if (severedViolations.length > 0) {
      const details = severedViolations
        .map(
          (v) =>
            `- Violation: '${v.matchedText}' is REMOVED in ${v.package}@${options.targetVersion}.\n  Fix: Replace with '${v.replacement ?? 'modern alternative'}'.\n  Note: ${v.message}`
        )
        .join('\n');

      const remediationPrompt = `[RN-TERRAIN AGENT GUARDRAIL INTERCEPTION]\nYour proposed code contains severed/removed APIs that will cause runtime crashes:\n${details}\n\nPlease regenerate this code using the modern API replacements shown above.`;

      return {
        allowed: false,
        status: 'BLOCKED_SEVERED_API',
        severedViolations,
        deprecatedWarnings,
        remediationPrompt,
        latencyMs
      };
    }

    if (deprecatedWarnings.length > 0) {
      return {
        allowed: true,
        status: 'WARNING_DEPRECATED',
        severedViolations: [],
        deprecatedWarnings,
        latencyMs
      };
    }

    return {
      allowed: true,
      status: 'PASSED',
      severedViolations: [],
      deprecatedWarnings: [],
      latencyMs
    };
  }
}
