/**
 * @file agent-guardrail.ts
 * Pre-Flight Agent Guardrail & Anti-Hallucination Interceptor.
 *
 * Intercepts AI coding agent token emissions and code diffs in microseconds (<30ms)
 * to prevent obsolete/severed Major-1 APIs from reaching the file system.
 */

import { TreeSitterCodeMatcher, type PatternFinding } from './tree-sitter-matcher.js';
import { HermesBytecodeVerifier } from './hermes-bytecode-verifier.js';
import { HoneypotEngine } from './honeypot-engine.js';
import { YogaLayoutProver } from './yoga-layout-prover.js';

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

    // 0. Parametric Hallucination Honeypot Engine
    const honeypotEngine = new HoneypotEngine();
    const honeypotReport = honeypotEngine.detectHoneypots(options.codeSnippet, filePath);
    if (honeypotReport.hasTrapdoorTriggered) {
      const severedViolations: PatternFinding[] = honeypotReport.violations.map((v) => ({
        ruleId: v.ruleId,
        package: v.package,
        symbol: v.symbol,
        severity: 'UNSUPPORTED_REMOVED',
        filePath,
        message: v.message,
        matchedText: v.symbol,
        replacement: v.canonicalRemediation,
        line: v.line,
        column: v.column,
      }));

      return {
        allowed: false,
        status: 'BLOCKED_SEVERED_API',
        severedViolations,
        deprecatedWarnings: [],
        remediationPrompt: honeypotReport.remediationPrompt,
        latencyMs: Math.round(performance.now() - startTime),
      };
    }

    const findings = this.matcher.scanSource(filePath, options.codeSnippet);

    const severedViolations = findings.filter(
      (f) => f.severity === 'UNSUPPORTED_REMOVED' || f.severity === 'BROKEN_DEFECTIVE'
    );
    const deprecatedWarnings = findings.filter((f) => f.severity === 'DEPRECATED');

    // Check Yoga Layout Prover for warnings/errors
    const yogaProver = new YogaLayoutProver();
    const layoutReport = yogaProver.diagnoseLayout(options.codeSnippet, filePath);
    const layoutErrors = layoutReport.violations.filter((v) => v.severity === 'error');
    if (layoutErrors.length > 0) {
      const details = layoutErrors
        .map((v) => `- Layout Error in <${v.component}>: ${v.message}\n  Fix: ${v.remediation}`)
        .join('\n');
      return {
        allowed: false,
        status: 'BLOCKED_SEVERED_API',
        severedViolations: layoutErrors.map((v) => ({
          ruleId: v.ruleId,
          package: 'react-native',
          symbol: v.component,
          severity: 'UNSUPPORTED_REMOVED',
          filePath,
          message: v.message,
          matchedText: `<${v.component}>`,
          replacement: v.remediation,
          line: v.line ?? 1,
          column: 1,
        })),
        deprecatedWarnings,
        remediationPrompt: `[RN-TERRAIN YOGA LAYOUT PROVER INTERCEPTION]\nYour proposed JSX fails physical layout bounding invariants:\n${details}`,
        latencyMs: Math.round(performance.now() - startTime),
      };
    }

    for (const lw of layoutReport.violations.filter((v) => v.severity === 'warning')) {
      deprecatedWarnings.push({
        ruleId: lw.ruleId,
        package: 'react-native',
        symbol: lw.component,
        severity: 'DEPRECATED',
        filePath,
        message: lw.message,
        matchedText: `<${lw.component}>`,
        replacement: lw.remediation,
        line: lw.line ?? 1,
        column: 1,
      });
    }

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

    // 2. Hermes Bytecode Invariant Verification
    const hermesVerifier = new HermesBytecodeVerifier();
    const hermesRes = hermesVerifier.verifyCode(options.codeSnippet, filePath);
    if (!hermesRes.valid && hermesRes.error) {
      const remediationPrompt = `[RN-TERRAIN HERMES BYTECODE INTERCEPTION]\nYour code fails Hermes bytecode compilation invariants:\n- ${hermesRes.error}\n${hermesRes.tasteNudge ? `\nTip: ${hermesRes.tasteNudge}` : ''}`;
      return {
        allowed: false,
        status: 'BLOCKED_SEVERED_API',
        severedViolations: [
          {
            ruleId: 'hermes-bytecode-invariant-violation',
            package: 'hermes-engine',
            symbol: 'hermesc',
            severity: 'UNSUPPORTED_REMOVED',
            filePath,
            message: hermesRes.error,
            matchedText: 'Hermes Bytecode Violation',
            line: hermesRes.line ?? 1,
            column: hermesRes.column ?? 1,
          },
        ],
        deprecatedWarnings,
        remediationPrompt,
        latencyMs: Math.round(performance.now() - startTime),
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
