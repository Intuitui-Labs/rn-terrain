import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { SovereignCodemodEngine } from '../src/codemod-engine.js';

describe('SovereignCodemodEngine', () => {
  let tmpDir: string;
  let engine: SovereignCodemodEngine;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rn-terrain-codemod-test-'));
    engine = new SovereignCodemodEngine();
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  });

  it('migrates AsyncStorage single import from react-native core', () => {
    const file = path.join(tmpDir, 'StorageComponent.tsx');
    fs.writeFileSync(file, "import { AsyncStorage } from 'react-native';\nconst val = AsyncStorage.getItem('x');", 'utf8');

    const result = engine.applyRule('AsyncStorage', tmpDir);
    expect(result.filesModified).toBe(1);

    const updated = fs.readFileSync(file, 'utf8');
    expect(updated).toContain("import AsyncStorage from '@react-native-async-storage/async-storage';");
    expect(updated).not.toContain("import { AsyncStorage } from 'react-native';");
  });

  it('migrates AsyncStorage from multi-specifier react-native import', () => {
    const file = path.join(tmpDir, 'MultiImport.tsx');
    fs.writeFileSync(file, "import { View, AsyncStorage, Text } from 'react-native';\nexport const App = () => <View />;", 'utf8');

    const result = engine.applyRule('AsyncStorage', tmpDir);
    expect(result.filesModified).toBe(1);

    const updated = fs.readFileSync(file, 'utf8');
    expect(updated).toContain("import { View, Text } from 'react-native';");
    expect(updated).toContain("import AsyncStorage from '@react-native-async-storage/async-storage';");
  });

  it('migrates findNodeHandle from react-native core to useAnimatedRef', () => {
    const file = path.join(tmpDir, 'LegacyRef.tsx');
    fs.writeFileSync(file, "import { View, findNodeHandle } from 'react-native';\nconst ref = findNodeHandle(null);", 'utf8');

    const result = engine.applyRule('findNodeHandle', tmpDir);
    expect(result.filesModified).toBe(1);

    const updated = fs.readFileSync(file, 'utf8');
    expect(updated).toContain("import { useAnimatedRef } from 'react-native-reanimated';");
    expect(updated).not.toContain('findNodeHandle');
  });

  it('migrates useAnimatedGestureHandler from reanimated', () => {
    const file = path.join(tmpDir, 'GestureComp.tsx');
    fs.writeFileSync(file, "import { useAnimatedStyle, useAnimatedGestureHandler } from 'react-native-reanimated';", 'utf8');

    const result = engine.applyRule('useAnimatedGestureHandler', tmpDir);
    expect(result.filesModified).toBe(1);

    const updated = fs.readFileSync(file, 'utf8');
    expect(updated).toContain("import { useAnimatedStyle } from 'react-native-reanimated';");
    expect(updated).toContain("import { Gesture, GestureDetector } from 'react-native-gesture-handler';");
  });

  it('migrates ViewPropTypes to ViewProps', () => {
    const file = path.join(tmpDir, 'PropsComp.tsx');
    fs.writeFileSync(file, "import { ViewPropTypes } from 'react-native';\nconst p: typeof ViewPropTypes = {};", 'utf8');

    const result = engine.applyRule('ViewPropTypes', tmpDir);
    expect(result.filesModified).toBe(1);

    const updated = fs.readFileSync(file, 'utf8');
    expect(updated).toContain("import type { ViewProps } from 'react-native';");
    expect(updated).toContain('const p: typeof ViewProps = {};');
  });

  it('reports 0 modified files when codebase is already clean', () => {
    const file = path.join(tmpDir, 'Clean.tsx');
    fs.writeFileSync(file, "import { View, Text } from 'react-native';", 'utf8');

    const result = engine.applyRule('AsyncStorage', tmpDir);
    expect(result.filesModified).toBe(0);
  });
});
