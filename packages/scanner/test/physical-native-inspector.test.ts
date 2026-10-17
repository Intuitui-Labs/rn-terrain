import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { PhysicalNativeInspector } from '../src/physical-native-inspector.js';

describe('PhysicalNativeInspector & Substrate Reflection', () => {
  it('correctly inspects a package with Podspec, CMake, and Codegen specs', () => {
    const tempDir = path.join(process.cwd(), '.temp-physical-native-pkg');
    try {
      fs.mkdirSync(path.join(tempDir, 'ios'), { recursive: true });
      fs.mkdirSync(path.join(tempDir, 'android'), { recursive: true });
      fs.mkdirSync(path.join(tempDir, 'src'), { recursive: true });

      // 1. Write package.json with codegenConfig
      fs.writeFileSync(
        path.join(tempDir, 'package.json'),
        JSON.stringify({
          name: 'react-native-custom-sensor',
          version: '1.0.0',
          codegenConfig: {
            name: 'RNCustomSensorSpec',
            type: 'modules',
            jsSrcsDir: 'src',
          },
        }),
        'utf8'
      );

      // 2. Write NativeSpec file
      fs.writeFileSync(
        path.join(tempDir, 'src', 'NativeCustomSensor.ts'),
        `
        import type { TurboModule } from 'react-native';
        import { TurboModuleRegistry } from 'react-native';

        export interface Spec extends TurboModule {
          readSensor(): Promise<number>;
        }

        export default TurboModuleRegistry.getEnforcing<Spec>('RNCustomSensor');
        `,
        'utf8'
      );

      // 3. Write Podspec with Fabric & C++ flags
      fs.writeFileSync(
        path.join(tempDir, 'RNCustomSensor.podspec'),
        `
        Pod::Spec.new do |s|
          s.name         = "RNCustomSensor"
          s.version      = "1.0.0"
          s.dependency "React-Codegen"
          s.dependency "ReactCommon/turbomodule/core"
          s.compiler_flags = '-std=c++20'
        end
        `,
        'utf8'
      );

      // 4. Write Android CMakeLists.txt
      fs.writeFileSync(
        path.join(tempDir, 'android', 'CMakeLists.txt'),
        `
        cmake_minimum_required(VERSION 3.22)
        project(RNCustomSensor)
        set(CMAKE_CXX_STANDARD 20)
        find_package(fbjni REQUIRED)
        find_package(ReactAndroid REQUIRED)
        `,
        'utf8'
      );

      const inspector = new PhysicalNativeInspector();
      const result = inspector.inspectPackage(tempDir, 'react-native-custom-sensor');

      expect(result.isNative).toBe(true);
      expect(result.architectureTier).toBe('TURBOMODULE_MODULE');
      expect(result.supportsFabric).toBe(true);
      expect(result.supportsBridgeless).toBe(true);
      expect(result.cxxStandard).toBe('20');

      // Podspec inspection
      expect(result.podspec.found).toBe(true);
      expect(result.podspec.hasTurboModuleDependency).toBe(true);
      expect(result.podspec.hasCppFlags).toBe(true);

      // Android inspection
      expect(result.android.hasCMake).toBe(true);
      expect(result.android.hasFbjni).toBe(true);
      expect(result.android.hasReactAndroidLink).toBe(true);

      // Codegen inspection
      expect(result.codegen.hasCodegenConfig).toBe(true);
      expect(result.codegen.specFiles.length).toBeGreaterThan(0);
      expect(result.codegen.specFiles[0]).toContain('NativeCustomSensor.ts');
    } finally {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
  });

  it('classifies pure JS packages without native artifacts as PURE_JS', () => {
    const tempDir = path.join(process.cwd(), '.temp-pure-js-pkg');
    try {
      fs.mkdirSync(tempDir, { recursive: true });
      fs.writeFileSync(
        path.join(tempDir, 'package.json'),
        JSON.stringify({
          name: 'camera-math-helper',
          version: '1.0.0',
          main: 'index.js',
        }),
        'utf8'
      );

      const inspector = new PhysicalNativeInspector();
      const result = inspector.inspectPackage(tempDir, 'camera-math-helper');

      expect(result.isNative).toBe(false);
      expect(result.architectureTier).toBe('PURE_JS');
      expect(result.supportsFabric).toBe(false);
    } finally {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
  });
});
