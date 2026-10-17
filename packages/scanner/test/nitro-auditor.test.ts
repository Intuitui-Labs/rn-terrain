import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { NitroAuditor } from '../src/nitro-auditor.js';

describe('NitroAuditor & C++ Native Architecture Invariants', () => {
  it('detects legacy NativeModules access anti-pattern for Nitro HybridObjects', () => {
    const auditor = new NitroAuditor();
    const badCode = `
      import { NativeModules } from 'react-native';
      const { MMKV } = NativeModules;
      export const store = MMKV.getString('token');
    `;

    const findings = auditor.verifyCodeSnippet(badCode, ['MMKV']);
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0].ruleId).toBe('nitro/legacy-native-modules-access');
    expect(findings[0].severity).toBe('error');
    expect(findings[0].remediation).toContain('NitroModules.createHybridObject');
  });

  it('detects TurboModuleRegistry confabulation on Nitro HybridObjects', () => {
    const auditor = new NitroAuditor();
    const badCode = `
      import { TurboModuleRegistry } from 'react-native';
      const mmkv = TurboModuleRegistry.get<Spec>('MMKV');
    `;

    const findings = auditor.verifyCodeSnippet(badCode, ['MMKV']);
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0].ruleId).toBe('nitro/turbomodule-confabulation');
    expect(findings[0].severity).toBe('error');
  });

  it('warns when synchronous Nitro calls occur inside worklets without thread safety', () => {
    const auditor = new NitroAuditor();
    const workletCode = `
      function onGestureUpdate() {
        'worklet';
        NitroModules.get('FastCrypto').sync();
      }
    `;

    const findings = auditor.verifyCodeSnippet(workletCode);
    expect(findings.some((f) => f.ruleId === 'nitro/worklet-thread-affinity-hazard')).toBe(true);
  });

  it('audits a project with Nitro specs and CMake C++ standards', () => {
    const tempDir = path.join(process.cwd(), '.temp-nitro-test-project');
    try {
      fs.mkdirSync(tempDir, { recursive: true });
      fs.writeFileSync(
        path.join(tempDir, 'package.json'),
        JSON.stringify({
          name: 'test-nitro-app',
          dependencies: {
            'react-native-nitro-modules': '^0.18.0',
          },
          devDependencies: {
            nitrogen: '^0.18.0',
          },
        }),
        'utf-8'
      );

      fs.writeFileSync(
        path.join(tempDir, 'HybridCalculator.nitro.ts'),
        `
        export interface HybridCalculator {
          add(a: number, b: number): number;
          multiply(a: number, b: number): number;
        }
      `,
        'utf-8'
      );

      fs.writeFileSync(
        path.join(tempDir, 'CMakeLists.txt'),
        `
        cmake_minimum_required(VERSION 3.22)
        project(test_nitro)
        set(CMAKE_CXX_STANDARD 17)
      `,
        'utf-8'
      );

      const auditor = new NitroAuditor(tempDir);
      const report = auditor.audit();

      expect(report.isNitroProject).toBe(true);
      expect(report.hasNitroDependency).toBe(true);
      expect(report.nitrogenInstalled).toBe(true);
      expect(report.hybridObjects.length).toBe(1);
      expect(report.hybridObjects[0].name).toBe('HybridCalculator');
      expect(report.hybridObjects[0].methods).toContain('add');
      // CMake C++17 should trigger subminimal standard error (< 20)
      expect(report.violations.some((v) => v.ruleId === 'nitro/cxx-standard-subminimal')).toBe(true);
    } finally {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
  });
});
