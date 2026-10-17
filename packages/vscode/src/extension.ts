import { getVitalityCard } from '@intuitui-labs/rn-terrain-core';
import {
  TcdiStackDoctor,
  CANONICAL_SEVERED_RULES,
  NativeSurfaceProfiler,
  IntegrativeSeamsEngine,
  type TcdiDoctorFinding,
  type NativePackageProfile,
  type IntegrativeSeamFinding,
} from '@intuitui-labs/rn-terrain-scanner';
import path from 'node:path';
import * as vscode from 'vscode';

interface DiagnosticWithFix {
  diagnostic: vscode.Diagnostic;
  finding?: TcdiDoctorFinding | IntegrativeSeamFinding;
  replacement?: string;
  template?: string;
}

const diagnosticFixMap = new Map<string, DiagnosticWithFix>();

function makeFixKey(uri: vscode.Uri, range: vscode.Range, code?: string | number | unknown): string {
  return `${uri.toString()}:${range.start.line}:${range.start.character}:${String(code ?? '')}`;
}

export function activate(context: vscode.ExtensionContext) {
  console.log('RN Terrain extension is active with Real-Time LSP Diagnostics');

  const doctor = new TcdiStackDoctor({ includeCanonicalRules: true });
  const ruleLookup = new Map(CANONICAL_SEVERED_RULES.map((r) => [r.id, r]));

  // Dynamically load project-local N-1 severed rules if present
  const firstFolder = vscode.workspace.workspaceFolders?.[0];
  if (firstFolder) {
    doctor.loadProjectRules(firstFolder.uri.fsPath);
  }

  const diagnosticCollection = vscode.languages.createDiagnosticCollection('rn-terrain');

  // 1. Diagnostics logic for React Native / TS / JS code files
  function diagnoseCodeDocument(document: vscode.TextDocument) {
    const filePath = document.fileName;
    if (!/\.(tsx|ts|jsx|js)$/i.test(filePath)) return;
    if (/node_modules|\.git|dist/i.test(filePath)) return;

    // Clear old fixes for this URI
    for (const [key] of diagnosticFixMap.entries()) {
      if (key.startsWith(document.uri.toString())) {
        diagnosticFixMap.delete(key);
      }
    }

    const text = document.getText();
    const report = doctor.diagnoseSnippet(text, filePath);
    const diagnostics: vscode.Diagnostic[] = [];

    for (const finding of report.findings) {
      const line = Math.max(0, finding.line - 1);
      const startCol = Math.max(0, finding.column - 1);
      const endCol = startCol + (finding.matchedText?.length || 1);
      const range = new vscode.Range(line, startCol, line, endCol);

      const severity =
        finding.severity === 'error'
          ? vscode.DiagnosticSeverity.Error
          : finding.severity === 'warn'
            ? vscode.DiagnosticSeverity.Warning
            : vscode.DiagnosticSeverity.Information;

      const message = `[${finding.category}] ${finding.title}: ${finding.message}\n` +
        `💡 Canonical Fix: ${finding.remediationAdvice}\n` +
        `⏳ Temporal Horizon: ${finding.temporalNote}`;

      const diagnostic = new vscode.Diagnostic(range, message, severity);
      diagnostic.source = 'RN-Terrain';
      diagnostic.code = finding.ruleId;

      diagnostics.push(diagnostic);

      const rule = ruleLookup.get(finding.ruleId);
      const replacement = rule?.replacement;
      const template = rule?.template;

      const key = makeFixKey(document.uri, range, finding.ruleId);
      diagnosticFixMap.set(key, { diagnostic, finding, replacement, template });
    }

    // Run Integrative Cross-Package Seams Engine
    const seamsEngine = new IntegrativeSeamsEngine();
    const seamsReport = seamsEngine.diagnoseSource(text, filePath);

    for (const seam of seamsReport.findings) {
      const line = Math.max(0, seam.line - 1);
      const startCol = Math.max(0, seam.column - 1);
      const endCol = startCol + (seam.matchedText?.length || 1);
      const range = new vscode.Range(line, startCol, line, endCol);

      const severity =
        seam.severity === 'error'
          ? vscode.DiagnosticSeverity.Error
          : vscode.DiagnosticSeverity.Warning;

      const message = `[${seam.seamType}] ${seam.title}: ${seam.message}\n` +
        `💡 Canonical Remediation: ${seam.remediationAdvice}`;

      const diagnostic = new vscode.Diagnostic(range, message, severity);
      diagnostic.source = 'RN-Terrain';
      diagnostic.code = seam.ruleId;

      diagnostics.push(diagnostic);

      const key = makeFixKey(document.uri, range, seam.ruleId);
      diagnosticFixMap.set(key, {
        diagnostic,
        finding: seam,
        replacement: seam.autoFixSnippet,
      });
    }

    diagnosticCollection.set(document.uri, diagnostics);
  }

  // 2. Diagnostics logic for package.json
  const profiler = new NativeSurfaceProfiler();

  async function diagnosePackageJsonDocument(document: vscode.TextDocument) {
    if (!document.fileName.endsWith('package.json')) return;

    const diagnostics: vscode.Diagnostic[] = [];
    const lineCount = document.lineCount;

    let auditReport: ReturnType<NativeSurfaceProfiler['profileProject']> | null = null;
    try {
      auditReport = profiler.profileProject({
        packageJsonPath: document.fileName,
        projectDir: path.dirname(document.fileName),
      });
    } catch {
      // Graceful fallback if project cannot be parsed
    }

    const hazardMap = new Map<string, NativePackageProfile>(
      (auditReport?.hazardPackages || []).map((h: NativePackageProfile) => [h.packageName, h]),
    );

    for (let i = 0; i < lineCount; i++) {
      const lineText = document.lineAt(i).text;
      const match = lineText.match(/"([^"]+)"\s*:\s*"([^"]+)"/);
      if (!match || !match[1] || !match[2]) continue;

      const pkg = match[1];
      const rangeStr = match[2];

      const startCol = Math.max(0, lineText.indexOf(`"${pkg}"`));
      const endCol = lineText.length;
      const range = new vscode.Range(i, startCol, i, endCol);

      // Check Native Surface Hazards (e.g. Missing worklets runtime or Legacy Bridge)
      const hazard = hazardMap.get(pkg);
      if (hazard && hazard.hazardReason) {
        const severity =
          hazard.hazardLevel === 'CRITICAL' || hazard.hazardLevel === 'HIGH'
            ? vscode.DiagnosticSeverity.Error
            : vscode.DiagnosticSeverity.Warning;

        const diag = new vscode.Diagnostic(
          range,
          `[RN-Terrain Native Hazard] ${pkg} [${hazard.moduleType}]: ${hazard.hazardReason}`,
          severity,
        );
        diag.source = 'RN-Terrain';
        diag.code = 'rn-terrain/native-hazard';
        diagnostics.push(diag);
      }

      const card = await getVitalityCard(pkg);
      if (card && card.warnings && card.warnings.length > 0) {
        const warningMsgs = card.warnings.map((w) => w.message).join('; ');
        const diag = new vscode.Diagnostic(
          range,
          `[RN-Terrain Vitality] ${pkg}@${rangeStr}: ${warningMsgs}`,
          vscode.DiagnosticSeverity.Warning,
        );
        diag.source = 'RN-Terrain';
        diag.code = 'rn-terrain/package-vitality-warning';
        diagnostics.push(diag);
      }
    }

    diagnosticCollection.set(document.uri, diagnostics);
  }

  function triggerDiagnostics(document: vscode.TextDocument) {
    if (document.fileName.endsWith('package.json')) {
      void diagnosePackageJsonDocument(document);
    } else {
      diagnoseCodeDocument(document);
    }
  }

  // 3. Register Quick-Fix Code Action Provider
  const codeActionProvider = vscode.languages.registerCodeActionsProvider(
    [
      { language: 'typescript' },
      { language: 'typescriptreact' },
      { language: 'javascript' },
      { language: 'javascriptreact' },
    ],
    {
      provideCodeActions(document, range, context) {
        const actions: vscode.CodeAction[] = [];

        for (const diagnostic of context.diagnostics) {
          if (diagnostic.source !== 'RN-Terrain') continue;

          const key = makeFixKey(document.uri, diagnostic.range, diagnostic.code);
          const fixInfo = diagnosticFixMap.get(key);
          if (!fixInfo) continue;

          const { finding, replacement, template } = fixInfo;

          if (replacement) {
            const action = new vscode.CodeAction(
              `Migrate to '${replacement}'`,
              vscode.CodeActionKind.QuickFix,
            );
            action.diagnostics = [diagnostic];
            action.isPreferred = true;
            action.edit = new vscode.WorkspaceEdit();
            action.edit.replace(document.uri, diagnostic.range, replacement);
            actions.push(action);
          }

          if (template) {
            const action = new vscode.CodeAction(
              `Insert modern replacement snippet (${finding?.title || 'modern equivalent'})`,
              vscode.CodeActionKind.QuickFix,
            );
            action.diagnostics = [diagnostic];
            action.edit = new vscode.WorkspaceEdit();
            action.edit.replace(document.uri, diagnostic.range, template);
            actions.push(action);
          }
        }

        return actions;
      },
    },
    {
      providedCodeActionKinds: [vscode.CodeActionKind.QuickFix],
    },
  );

  // 4. Register hover provider for package.json files
  const hoverProvider = vscode.languages.registerHoverProvider(
    { pattern: '**/package.json' },
    {
      async provideHover(document: vscode.TextDocument, position: vscode.Position) {
        const lineText = document.lineAt(position.line).text;

        const match = lineText.match(/"([^"]+)"\s*:\s*"([^"]+)"/);
        if (!match || !match[1]) {
          return null;
        }

        const packageName = match[1];
        const card = await getVitalityCard(packageName);
        if (!card) {
          return null;
        }

        const md = new vscode.MarkdownString();
        md.isTrusted = true;

        const scoreColor =
          card.vitality_score >= 80
            ? '🟢'
            : card.vitality_score >= 60
              ? '🟡'
              : card.vitality_score >= 40
                ? '🟠'
                : '🔴';

        md.appendMarkdown(
          `### 🏔️ RN Terrain: **${card.display_name || card.package_name}** v${card.version.current}\n`,
        );
        md.appendMarkdown(`*${card.category} · ${card.vendor} · Layer ${card.topology_layer}*\n\n`);

        md.appendMarkdown(
          `#### ${scoreColor} Vitality Score: **${card.vitality_score}/100** (${card.radar_status})\n`,
        );

        if (card.warnings.length > 0) {
          md.appendMarkdown(`**⚠️  Signals Requiring Attention:**\n`);
          for (const w of card.warnings) {
            md.appendMarkdown(`- *${w.message}*\n`);
          }
          md.appendMarkdown('\n');
        }

        md.appendMarkdown(`| iOS | Android | Web | Expo Go | New Arch |\n`);
        md.appendMarkdown(`| :---: | :---: | :---: | :---: | :---: |\n`);

        const check = (val: boolean) => (val ? '✅' : '❌');
        md.appendMarkdown(
          `| ${check(card.compatibility.ios)} | ${check(card.compatibility.android)} | ${check(card.compatibility.web)} | ${check(card.compatibility.expo_go)} | \`${card.compatibility.new_architecture}\` |\n\n`,
        );

        const v1StatusSymbol = card.v1_readiness.status === 'READY' ? '🟢' : '🟡';
        md.appendMarkdown(
          `#### ${v1StatusSymbol} RN 1.0 Readiness: **${card.v1_readiness.status}**\n`,
        );
        if (card.v1_readiness.migration_notes) {
          md.appendMarkdown(`*Notes: ${card.v1_readiness.migration_notes}*\n\n`);
        }

        md.appendMarkdown(`[NPM](${card.links.npm})`);
        if (card.links.github) {
          md.appendMarkdown(` · [GitHub](${card.links.github})`);
        }
        md.appendMarkdown('\n');

        return new vscode.Hover(md);
      },
    },
  );

  // 5. Wire editor lifecycle events (debounced)
  let debounceTimer: NodeJS.Timeout | null = null;

  context.subscriptions.push(
    diagnosticCollection,
    hoverProvider,
    codeActionProvider,
    vscode.workspace.onDidOpenTextDocument((doc) => {
      triggerDiagnostics(doc);
    }),
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        triggerDiagnostics(e.document);
      }, 150);
    }),
    vscode.workspace.onDidCloseTextDocument((doc) => {
      diagnosticCollection.delete(doc.uri);
      for (const [key] of diagnosticFixMap.entries()) {
        if (key.startsWith(doc.uri.toString())) {
          diagnosticFixMap.delete(key);
        }
      }
    }),
  );

  // Initial trigger for open editors
  for (const editor of vscode.window.visibleTextEditors) {
    triggerDiagnostics(editor.document);
  }
}

export function deactivate() {}
