import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NodeModulesAffordanceEngine } from '../src/compass/node-modules-affordance.js';
import fs from 'node:fs';
import path from 'node:path';

describe('NodeModulesAffordanceEngine', () => {
  const tempProjectRoot = path.resolve(__dirname, 'temp-affordance-project');
  const mockPkgDir = path.resolve(tempProjectRoot, 'node_modules', 'mock-native-kit');

  beforeEach(() => {
    if (fs.existsSync(tempProjectRoot)) {
      fs.rmSync(tempProjectRoot, { recursive: true, force: true });
    }
    fs.mkdirSync(mockPkgDir, { recursive: true });

    // Mock package.json
    fs.writeFileSync(
      path.join(mockPkgDir, 'package.json'),
      JSON.stringify({
        name: 'mock-native-kit',
        version: '4.2.0',
        types: 'index.d.ts',
      })
    );

    // Mock index.d.ts
    const dtsContent = `
export declare function useModernPanGesture(): void;
export declare function useAnimatedSpring(): void;
export declare function AnimatedContainer(props: any): JSX.Element;
export declare function configureWorkletRuntime(): boolean;
export type MotionConfig = { duration: number };
`;
    fs.writeFileSync(path.join(mockPkgDir, 'index.d.ts'), dtsContent);

    // Mock README.md
    const readmeContent = `
# mock-native-kit
\`\`\`tsx
import { useModernPanGesture, AnimatedContainer } from 'mock-native-kit';

export function Example() {
  const gesture = useModernPanGesture();
  return <AnimatedContainer />;
}
\`\`\`
`;
    fs.writeFileSync(path.join(mockPkgDir, 'README.md'), readmeContent);
  });

  afterEach(() => {
    if (fs.existsSync(tempProjectRoot)) {
      fs.rmSync(tempProjectRoot, { recursive: true, force: true });
    }
  });

  it('resolves installed package and extracts affordances from .d.ts and README', () => {
    const engine = new NodeModulesAffordanceEngine(tempProjectRoot);
    const card = engine.generateAffordance('mock-native-kit');

    expect(card.packageName).toBe('mock-native-kit');
    expect(card.installedVersion).toBe('4.2.0');
    expect(card.exportedHooks).toContain('useModernPanGesture');
    expect(card.exportedHooks).toContain('useAnimatedSpring');
    expect(card.exportedComponents).toContain('AnimatedContainer');
    expect(card.exportedFunctions).toContain('configureWorkletRuntime');
    expect(card.exportedTypes).toContain('MotionConfig');
    expect(card.usageSnippet).toContain('useModernPanGesture');
    expect(card.preflightInstruction).toContain('Grounded in real .d.ts declarations');
  });

  it('throws helpful error when package is not installed', () => {
    const engine = new NodeModulesAffordanceEngine(tempProjectRoot);
    expect(() => engine.generateAffordance('non-existent-pkg')).toThrow(
      "Package 'non-existent-pkg' is not installed in node_modules"
    );
  });
});
