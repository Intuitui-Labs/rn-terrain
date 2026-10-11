import { describe, it, expect } from 'vitest';
import { ScopedAstParser } from '../src/ast-scoped-parser.js';

describe('ScopedAstParser Immunity & Semantic Detection', () => {
  const parser = new ScopedAstParser();

  it('detects live useAnimatedGestureHandler call expression', () => {
    const code = `
      import React from 'react';
      const handler = useAnimatedGestureHandler({
        onActive: () => {}
      });
    `;
    const violations = parser.parseAndScan(code);
    expect(violations.length).toBe(1);
    expect(violations[0].symbol).toBe('useAnimatedGestureHandler');
    expect(violations[0].line).toBe(3);
  });

  it('detects live AsyncStorage from react-native core import', () => {
    const code = `
      import React from 'react';
      import { View, Text, AsyncStorage } from 'react-native';
    `;
    const violations = parser.parseAndScan(code);
    expect(violations.length).toBe(1);
    expect(violations[0].symbol).toBe('AsyncStorage');
    expect(violations[0].package).toBe('react-native');
  });

  it('detects ViewPropTypes import from react-native core', () => {
    const code = `
      import { ViewPropTypes } from 'react-native';
    `;
    const violations = parser.parseAndScan(code);
    expect(violations.length).toBe(1);
    expect(violations[0].symbol).toBe('ViewPropTypes');
  });

  it('is 100% IMMUNE to comments mentioning severed symbols', () => {
    const code = `
      import React from 'react';
      // Migrated away from useAnimatedGestureHandler in 2026
      /* Notice: do NOT import AsyncStorage from 'react-native' */
      export const Card = () => <div />;
    `;
    const violations = parser.parseAndScan(code);
    expect(violations.length).toBe(0);
  });

  it('is 100% IMMUNE to string literals mentioning severed symbols', () => {
    const code = `
      console.warn("Deprecated: useAnimatedGestureHandler is replaced by Gesture.Pan()");
      const msg = "AsyncStorage is no longer in core";
    `;
    const violations = parser.parseAndScan(code);
    expect(violations.length).toBe(0);
  });

  it('is 100% IMMUNE to jest.mock definitions of severed symbols', () => {
    const code = `
      jest.mock('react-native-reanimated', () => ({
        useAnimatedGestureHandler: jest.fn(),
      }));
    `;
    const violations = parser.parseAndScan(code);
    expect(violations.length).toBe(0);
  });

  it('detects star/namespace import calls (import * as Reanimated)', () => {
    const code = `
      import * as Reanimated from 'react-native-reanimated';
      const handler = Reanimated.useAnimatedGestureHandler({});
    `;
    const violations = parser.parseAndScan(code);
    expect(violations.length).toBe(1);
    expect(violations[0].symbol).toBe('Reanimated.useAnimatedGestureHandler');
    expect(violations[0].package).toBe('react-native-reanimated');
  });

  it('detects CommonJS require destructuring of severed APIs', () => {
    const code = `
      const { useAnimatedGestureHandler } = require('react-native-reanimated');
    `;
    const violations = parser.parseAndScan(code);
    expect(violations.length).toBe(1);
    expect(violations[0].symbol).toBe('useAnimatedGestureHandler');
  });

  it('detects CommonJS namespace property access (const RN = require("react-native"))', () => {
    const code = `
      const RN = require('react-native');
      const storage = RN.AsyncStorage;
    `;
    const violations = parser.parseAndScan(code);
    expect(violations.length).toBe(1);
    expect(violations[0].symbol).toBe('RN.AsyncStorage');
    expect(violations[0].package).toBe('react-native');
  });
});
