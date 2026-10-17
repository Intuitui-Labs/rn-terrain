import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  TerminalRenderer,
  detectTerminalProtocol,
  parseColor,
  parseComponentElements,
  renderComponentToTerminal,
} from '../src/preview/terminal-renderer.js';

describe('Terminal Visual Preview Engine', () => {
  it('detects a valid terminal graphics protocol', () => {
    const protocol = detectTerminalProtocol();
    expect(['sixel', 'kitty', 'ansi_halfblock', 'ascii']).toContain(protocol);
  });

  it('parses hex and named colors to RGB tuples', () => {
    expect(parseColor('#3b82f6')).toEqual([59, 130, 246]);
    expect(parseColor('#fff')).toEqual([255, 255, 255]);
    expect(parseColor('blue')).toEqual([59, 130, 246]);
    expect(parseColor('unknown-color')).toBeNull();
  });

  it('extracts Text, Buttons, and View attributes from React Native JSX', () => {
    const jsx = `
      import React from 'react';
      import { View, Text, TouchableOpacity } from 'react-native';

      export function ProfileCard() {
        return (
          <View style={{ backgroundColor: '#10b981' }}>
            <Text style={{ color: '#ffffff' }}>John Doe</Text>
            <TouchableOpacity style={{ backgroundColor: '#3b82f6' }}>
              <Text>Connect</Text>
            </TouchableOpacity>
          </View>
        );
      }
    `;

    const elements = parseComponentElements(jsx);
    expect(elements.some((e) => e.tag === 'Text' && e.text === 'John Doe')).toBe(true);
    expect(elements.some((e) => e.isInteractive && e.text === 'Connect')).toBe(true);
    expect(elements.some((e) => e.tag === 'View' && e.backgroundColor === '#10b981')).toBe(true);
  });

  it('renders a mobile device frame with status bar, dynamic island, and elements', () => {
    const jsx = `
      <View>
        <Text>Welcome to React Native 0.88</Text>
        <TouchableOpacity>
          <Text>Get Started</Text>
        </TouchableOpacity>
      </View>
    `;

    const renderer = new TerminalRenderer({ protocol: 'ansi_halfblock', device: 'iphone-16-pro', width: 44 });
    const output = renderer.renderComponent(jsx, 'WelcomeScreen');

    expect(output).toContain('iPhone 16 Pro');
    expect(output).toContain('9:41');
    expect(output).toContain('Get Started');
    expect(output).toContain('─────────────'); // Home indicator
  });

  it('emits Sixel graphics stream when sixel protocol is requested', () => {
    const renderer = new TerminalRenderer({ protocol: 'sixel' });
    const output = renderer.renderComponent('<View />', 'SixelCard');
    expect(output).toContain('\x1bPq');
    expect(output).toContain('\x1b\\');
  });

  it('renders a component file directly from disk via renderFile', () => {
    const tempFile = path.join(process.cwd(), '.temp-component-preview.tsx');
    try {
      fs.writeFileSync(
        tempFile,
        `
        import React from 'react';
        import { View, Text, Button } from 'react-native';
        export default function App() {
          return (
            <View>
              <Text>Dashboard</Text>
              <Button title="Sync Data" />
            </View>
          );
        }
      `,
        'utf-8'
      );

      const renderer = new TerminalRenderer({ protocol: 'ansi_halfblock', width: 42 });
      const rendered = renderer.renderFile(tempFile);
      expect(rendered).toContain('Dashboard');
      expect(rendered).toContain('Sync Data');
    } finally {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
  });

  it('provides convenient renderComponentToTerminal helper', () => {
    const output = renderComponentToTerminal('<Text>Simple Test</Text>', { width: 40 });
    expect(output).toContain('Simple Test');
  });
});
