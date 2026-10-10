/**
 * @file policy-gate.ts
 * Deterministic Policy Gating for RN-Terrain.
 *
 * Maps calibrated decision model probabilities into concrete workflow actions:
 *   - AUTO_EXECUTE   (Confidence >= 0.85)
 *   - HUMAN_TRIAGE   (0.55 <= Confidence < 0.85)
 *   - QUARANTINE_HOLD(Confidence < 0.55 OR severe native collision)
 */

import {
  type IDecisionAdapter,
  type DecisionOutcome,
  CalibratedHeuristicAdapter
} from './decision-adapter.js';

export type PolicyAction = 'AUTO_EXECUTE' | 'HUMAN_TRIAGE' | 'QUARANTINE_HOLD';

export interface PolicyGateResult {
  action: PolicyAction;
  confidence: number;
  engineUsed: string;
  rationale: string;
  gatingThresholds: {
    autoExecute: number;
    humanTriage: number;
  };
}

export class PolicyGate {
  private readonly adapter: IDecisionAdapter;
  private readonly autoThreshold: number;
  private readonly triageThreshold: number;

  constructor(
    adapter?: IDecisionAdapter,
    autoThreshold = 0.85,
    triageThreshold = 0.55
  ) {
    this.adapter = adapter ?? new CalibratedHeuristicAdapter();
    this.autoThreshold = autoThreshold;
    this.triageThreshold = triageThreshold;
  }

  public async evaluateDiffPolicy(context: {
    packageName: string;
    targetVersion: string;
    diffSnippet: string;
    severedSymbolsFound?: string[];
  }): Promise<PolicyGateResult> {
    if (context.severedSymbolsFound && context.severedSymbolsFound.length > 0) {
      return {
        action: 'QUARANTINE_HOLD',
        confidence: 0.99,
        engineUsed: 'deterministic-ast-fence',
        rationale: `Diff contains severed/removed APIs: ${context.severedSymbolsFound.join(', ')}`,
        gatingThresholds: {
          autoExecute: this.autoThreshold,
          humanTriage: this.triageThreshold
        }
      };
    }

    const outcome: DecisionOutcome<PolicyAction> = await this.adapter.evaluate<PolicyAction>({
      type: 'choice',
      question: 'Determine the execution policy for this dependency change or code diff',
      context: {
        package: context.packageName,
        version: context.targetVersion,
        diff: context.diffSnippet
      },
      options: ['AUTO_EXECUTE', 'HUMAN_TRIAGE', 'QUARANTINE_HOLD']
    });

    let action = outcome.result as PolicyAction;
    let rationale = `Decision engine recommended ${action} with ${(outcome.confidence * 100).toFixed(1)}% confidence.`;

    // Apply strict threshold override
    if (action === 'AUTO_EXECUTE' && outcome.confidence < this.autoThreshold) {
      action = 'HUMAN_TRIAGE';
      rationale = `Demoted from AUTO_EXECUTE to HUMAN_TRIAGE: confidence ${(outcome.confidence * 100).toFixed(1)}% is below threshold of ${(this.autoThreshold * 100)}%.`;
    } else if (action === 'HUMAN_TRIAGE' && outcome.confidence < this.triageThreshold) {
      action = 'QUARANTINE_HOLD';
      rationale = `Demoted to QUARANTINE_HOLD: confidence ${(outcome.confidence * 100).toFixed(1)}% is below triage threshold of ${(this.triageThreshold * 100)}%.`;
    }

    return {
      action,
      confidence: outcome.confidence,
      engineUsed: outcome.engine,
      rationale,
      gatingThresholds: {
        autoExecute: this.autoThreshold,
        humanTriage: this.triageThreshold
      }
    };
  }
}
