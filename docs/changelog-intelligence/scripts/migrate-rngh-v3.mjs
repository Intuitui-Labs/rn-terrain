#!/usr/bin/env node
/**
 * migrate-rngh-v3.mjs — Deterministic AST Codemod for RNGH v3 Migrations
 * ─────────────────────────────────────────────────────────────────────────────
 * Automatically refactors legacy React Native Gesture Handler components into
 * modern v3-compliant code:
 *
 * 1. Legacy Component Handlers:
 *    - Replaces <PanGestureHandler>, <TapGestureHandler>, <LongPressGestureHandler>, etc.
 *      with <GestureDetector gesture={Gesture.<Type>()}>
 *    - Cleans up deprecated imports and injects `GestureDetector, Gesture`
 *
 * 2. React Native <Modal> touch context:
 *    - Automatically wraps modal content in <GestureHandlerRootView style={{ flex: 1 }}>
 *    - Adds `GestureHandlerRootView` import if missing
 *
 * 3. S1 Signal (Pressable touch propagation):
 *    - Moves `Pressable` from 'react-native-gesture-handler' to 'react-native'
 *
 * Usage:
 *   node migrate-rngh-v3.mjs --target <file_or_dir> [--write] [--dry-run]
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';

const require = createRequire(import.meta.url);
const traversePath = require.resolve('@babel/traverse');
const generatorPath = require.resolve('@babel/generator', { paths: [traversePath] });
const typesPath = require.resolve('@babel/types', { paths: [traversePath] });

const traverse = _traverse.default || _traverse;
const generate = require(generatorPath).default || require(generatorPath);
const t = require(typesPath);

const args = process.argv.slice(2);
let targetPath = null;
let doWrite = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--target' && args[i + 1]) {
    targetPath = args[i + 1];
    i++;
  } else if (args[i] === '--write') {
    doWrite = true;
  }
}

if (!targetPath) {
  console.log(`
Usage: node migrate-rngh-v3.mjs --target <file_or_dir> [--write]

Flags:
  --target <path>   File or directory to transform
  --write           Overwrite files directly (default is dry-run diff preview)
`);
  process.exit(0);
}

const LEGACY_HANDLER_MAP = {
  PanGestureHandler: 'Pan',
  TapGestureHandler: 'Tap',
  LongPressGestureHandler: 'LongPress',
  PinchGestureHandler: 'Pinch',
  RotationGestureHandler: 'Rotation',
  FlingGestureHandler: 'Fling'
};

function transformFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  let ast;
  try {
    ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'classProperties', 'decorators-legacy']
    });
  } catch (err) {
    return { changed: false, error: err.message };
  }

  let modified = false;
  let rnghImportDecl = null;
  let rnImportDecl = null;
  const legacyImported = new Set();
  let hasPressableInRNGH = false;
  let pressableLocalName = 'Pressable';
  let needsGestureDetector = false;
  let needsGesture = false;
  let needsRootView = false;

  // Pass 1: Analyze imports
  traverse(ast, {
    ImportDeclaration(path) {
      const src = path.node.source.value;
      if (src === 'react-native-gesture-handler') {
        rnghImportDecl = path;
        path.node.specifiers.forEach(spec => {
          if (spec.imported && LEGACY_HANDLER_MAP[spec.imported.name]) {
            legacyImported.add(spec.imported.name);
          }
          if (spec.imported && spec.imported.name === 'Pressable') {
            hasPressableInRNGH = true;
            pressableLocalName = spec.local.name;
          }
        });
      } else if (src === 'react-native') {
        rnImportDecl = path;
      }
    }
  });

  // Pass 2: Transform JSX Elements
  traverse(ast, {
    JSXElement(path) {
      const opening = path.node.openingElement;
      const closing = path.node.closingElement;
      const nameNode = opening.name;
      const name = nameNode.type === 'JSXIdentifier' ? nameNode.name : null;

      // Transform 1: Legacy Handlers -> GestureDetector
      if (name && LEGACY_HANDLER_MAP[name]) {
        const gestureType = LEGACY_HANDLER_MAP[name];
        needsGestureDetector = true;
        needsGesture = true;
        modified = true;

        // Create gesture identifier name: e.g. panGesture, tapGesture
        const gesturePropExpr = t.callExpression(
          t.memberExpression(t.identifier('Gesture'), t.identifier(gestureType)),
          []
        );

        // Replace tag with GestureDetector
        opening.name = t.jsxIdentifier('GestureDetector');
        if (closing) closing.name = t.jsxIdentifier('GestureDetector');

        // Remove old onGestureEvent, onHandlerStateChange props
        opening.attributes = opening.attributes.filter(attr => {
          if (attr.type === 'JSXAttribute' && attr.name) {
            const attrName = attr.name.name;
            return attrName !== 'onGestureEvent' && attrName !== 'onHandlerStateChange';
          }
          return true;
        });

        // Add gesture={Gesture.<Type>()}
        opening.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier('gesture'),
            t.jsxExpressionContainer(gesturePropExpr)
          )
        );
      }

      // Transform 2: Modal touch context wrapping
      if (name === 'Modal') {
        // Check if children already wrapped in GestureHandlerRootView
        let hasRoot = false;
        path.node.children.forEach(child => {
          if (child.type === 'JSXElement' && child.openingElement.name.name === 'GestureHandlerRootView') {
            hasRoot = true;
          }
        });

        if (!hasRoot && path.node.children.length > 0) {
          needsRootView = true;
          modified = true;

          const wrappedChildren = [
            t.jsxElement(
              t.jsxOpeningElement(
                t.jsxIdentifier('GestureHandlerRootView'),
                [
                  t.jsxAttribute(
                    t.jsxIdentifier('style'),
                    t.jsxExpressionContainer(
                      t.objectExpression([
                        t.objectProperty(t.identifier('flex'), t.numericLiteral(1))
                      ])
                    )
                  )
                ],
                false
              ),
              t.jsxClosingElement(t.jsxIdentifier('GestureHandlerRootView')),
              path.node.children,
              false
            )
          ];
          path.node.children = wrappedChildren;
        }
      }
    }
  });

  // Pass 3: Update Imports
  if (modified) {
    if (rnghImportDecl) {
      // Remove legacy imports and Pressable if moved
      rnghImportDecl.node.specifiers = rnghImportDecl.node.specifiers.filter(spec => {
        if (!spec.imported) return true;
        if (legacyImported.has(spec.imported.name)) return false;
        if (hasPressableInRNGH && spec.imported.name === 'Pressable') return false;
        return true;
      });

      // Add GestureDetector and Gesture if needed
      const currentImports = new Set(
        rnghImportDecl.node.specifiers
          .filter(s => s.imported)
          .map(s => s.imported.name)
      );

      if (needsGestureDetector && !currentImports.has('GestureDetector')) {
        rnghImportDecl.node.specifiers.push(
          t.importSpecifier(t.identifier('GestureDetector'), t.identifier('GestureDetector'))
        );
      }
      if (needsGesture && !currentImports.has('Gesture')) {
        rnghImportDecl.node.specifiers.push(
          t.importSpecifier(t.identifier('Gesture'), t.identifier('Gesture'))
        );
      }
      if (needsRootView && !currentImports.has('GestureHandlerRootView')) {
        rnghImportDecl.node.specifiers.push(
          t.importSpecifier(t.identifier('GestureHandlerRootView'), t.identifier('GestureHandlerRootView'))
        );
      }
    }

    // Move Pressable to react-native import
    if (hasPressableInRNGH) {
      if (rnImportDecl) {
        const hasPressableInRN = rnImportDecl.node.specifiers.some(
          s => s.imported && s.imported.name === 'Pressable'
        );
        if (!hasPressableInRN) {
          rnImportDecl.node.specifiers.push(
            t.importSpecifier(t.identifier(pressableLocalName), t.identifier('Pressable'))
          );
        }
      }
    }
  }

  if (!modified) {
    return { changed: false };
  }

  const output = generate(ast, { retainLines: false, compact: false }, code);
  return { changed: true, newCode: output.code, originalCode: code };
}

function processTarget(target) {
  if (!fs.existsSync(target)) {
    console.error(`Target not found: ${target}`);
    return;
  }

  const stat = fs.statSync(target);
  if (!stat.isDirectory()) {
    if (/\.(tsx|jsx|js|ts)$/.test(target)) {
      runMigration(target);
    }
    return;
  }

  const files = fs.readdirSync(target);
  for (const f of files) {
    const p = path.join(target, f);
    if (fs.statSync(p).isDirectory()) {
      if (!p.includes('node_modules') && !p.includes('.git') && !p.includes('.next')) {
        processTarget(p);
      }
    } else if (/\.(tsx|jsx|js|ts)$/.test(p)) {
      runMigration(p);
    }
  }
}

let modifiedCount = 0;

function runMigration(filePath) {
  const res = transformFile(filePath);
  if (res.changed) {
    modifiedCount++;
    console.log(`\n✨ [MIGRATED] ${filePath}`);
    if (doWrite) {
      fs.writeFileSync(filePath, res.newCode, 'utf8');
      console.log(`   --> Successfully overwritten with modern RNGH v3 code.`);
    } else {
      console.log(`   --> [DRY RUN PREVIEW] Run with --write to apply:`);
      console.log('--------------------------------------------------');
      console.log(res.newCode);
      console.log('--------------------------------------------------');
    }
  }
}

console.log(`\nTCDI RNGH v3 Codemod Engine (${doWrite ? 'APPLY WRITE' : 'DRY RUN'})`);
processTarget(targetPath);

if (modifiedCount === 0) {
  console.log(`\nNo files required RNGH v3 migration.`);
} else {
  console.log(`\nTotal files processed for migration: ${modifiedCount}`);
}
