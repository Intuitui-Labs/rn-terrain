/**
 * @file yoga-layout-prover.ts
 * Virtual Yoga Layout Physics & Bounding Box Prover.
 *
 * Evaluates synthesized component JSX and style properties to catch visual layout traps
 * before code touches disk: 0px height ScrollView collapses, sub-minimal touch targets (<44pt),
 * and off-screen clipped element coordinates.
 */

export interface LayoutViolation {
  ruleId: string;
  component: string;
  severity: 'error' | 'warning';
  message: string;
  remediation: string;
  line?: number;
}

export interface LayoutDiagnosticReport {
  valid: boolean;
  violations: LayoutViolation[];
  warnings: string[];
}

export class YogaLayoutProver {
  /**
   * Evaluates JSX source code for structural layout invariants.
   */
  public diagnoseLayout(code: string, _filePath: string = 'Component.tsx'): LayoutDiagnosticReport {
    const violations: LayoutViolation[] = [];
    const warnings: string[] = [];

    // Skip if file-level ignore is present
    if (code.includes('@rn-terrain-ignore-file')) {
      return { valid: true, violations: [], warnings: [] };
    }

    const lines = code.split('\n');

    // 1. Invariant: ScrollView without flex: 1 or explicit height inside view hierarchy
    const scrollViewTagRegex = /<ScrollView\b([^>]*)>/g;
    let svMatch: RegExpExecArray | null;
    while ((svMatch = scrollViewTagRegex.exec(code)) !== null) {
      const attributes = svMatch[1] ?? '';
      const matchIndex = svMatch.index;
      const lineNumber = code.substring(0, matchIndex).split('\n').length;
      const lineText = lines[lineNumber - 1] || '';

      if (lineText.includes('@rn-terrain-ignore')) continue;

      const hasFlex = /flex\s*:\s*[1-9]/.test(attributes) || /className\s*=\s*['"][^'"]*flex-1[^'"]*['"]/.test(attributes);
      const hasExplicitHeight = /height\s*:\s*\d+/.test(attributes) || /className\s*=\s*['"][^'"]*h-\d+[^'"]*['"]/.test(attributes);
      const hasContentContainer = /contentContainerStyle\s*=/.test(attributes);

      // Check if style refers to a StyleSheet object in the file
      let hasStyleSheetFlexOrHeight = false;
      const styleIdMatch = attributes.match(/style\s*=\s*\{?\s*(?:styles\.)?([a-zA-Z0-9_$]+)\s*\}?/);
      if (styleIdMatch && styleIdMatch[1]) {
        const id = styleIdMatch[1];
        if (id !== 'styles') {
          const idRegex = new RegExp(`\\b${id}\\s*:\\s*\\{[^}]*\\b(flex|height)\\s*:`, 's');
          if (idRegex.test(code)) {
            hasStyleSheetFlexOrHeight = true;
          }
        }
      }

      if (!hasFlex && !hasExplicitHeight && !hasContentContainer && !hasStyleSheetFlexOrHeight) {
        violations.push({
          ruleId: 'layout/scrollview-collapsed-zero-height',
          component: 'ScrollView',
          severity: 'error',
          line: lineNumber,
          message: "'<ScrollView>' rendered without 'flex: 1', explicit height, or 'contentContainerStyle' will collapse to 0px height at mobile runtime.",
          remediation: "Apply 'style={{ flex: 1 }}' or 'contentContainerStyle={{ flexGrow: 1 }}' to provide flex bounds.",
        });
      }
    }

    // 2. Invariant: Interactive Touch Targets < 44pt (Apple Human Interface & Material 3 Guideline)
    const touchableTagRegex = /<(TouchableOpacity|TouchableHighlight|Pressable)\b([^>]*)>/g;
    let touchMatch: RegExpExecArray | null;
    while ((touchMatch = touchableTagRegex.exec(code)) !== null) {
      const componentName = touchMatch[1] ?? 'Touchable';
      const attributes = touchMatch[2] ?? '';
      const matchIndex = touchMatch.index;
      const lineNumber = code.substring(0, matchIndex).split('\n').length;
      const lineText = lines[lineNumber - 1] || '';

      if (lineText.includes('@rn-terrain-ignore')) continue;

      // Check explicit style width & height < 44
      const widthMatch = attributes.match(/width\s*:\s*(\d+)/);
      const heightMatch = attributes.match(/height\s*:\s*(\d+)/);

      if (widthMatch && heightMatch) {
        const widthStr = widthMatch[1];
        const heightStr = heightMatch[1];
        if (widthStr && heightStr) {
          const w = parseInt(widthStr, 10);
          const h = parseInt(heightStr, 10);
          if (w < 44 && h < 44) {
            violations.push({
              ruleId: 'layout/touch-target-subminimal',
              component: componentName,
              severity: 'warning',
              line: lineNumber,
              message: `<${componentName}> touch target size (${w}x${h}pt) is below the minimum mobile hit target standard (44x44pt).`,
              remediation: "Add 'hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}' or increase minHeight/minWidth to 44pt.",
            });
          }
        }
      }
    }

    // 3. Invariant: Extreme Negative Position Coordinates (Off-Screen Lost Elements)
    const extremeCoordRegex = /(top|left|right|bottom)\s*:\s*-([1-9]\d{3,})/g;
    let coordMatch: RegExpExecArray | null;
    while ((coordMatch = extremeCoordRegex.exec(code)) !== null) {
      const prop = coordMatch[1] ?? 'coordinate';
      const val = coordMatch[2] ?? '0';
      const matchIndex = coordMatch.index;
      const lineNumber = code.substring(0, matchIndex).split('\n').length;
      const lineText = lines[lineNumber - 1] || '';

      if (lineText.includes('@rn-terrain-ignore')) continue;

      violations.push({
        ruleId: 'layout/offscreen-unbounded-coordinate',
        component: 'Style',
        severity: 'error',
        line: lineNumber,
        message: `Extreme negative coordinate '${prop}: -${val}' pushes element off-screen without layout bounding container.`,
        remediation: "Use 'transform: [{ translateY }]' with animated values instead of extreme negative coordinate placement.",
      });
    }

    const hasErrors = violations.some((v) => v.severity === 'error');

    return {
      valid: !hasErrors,
      violations,
      warnings,
    };
  }
}
