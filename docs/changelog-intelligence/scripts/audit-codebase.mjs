import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';

// Babel 7/8 default export interop
const traverse = _traverse.default || _traverse;

const args = process.argv.slice(2);
const targetPaths = [];
let jsonOutput = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--target' && args[i + 1]) {
    targetPaths.push(args[i + 1]);
    i++;
  } else if (args[i] === '--json') {
    jsonOutput = true;
  }
}

if (targetPaths.length === 0) {
  targetPaths.push('c:/projects/rn-terrain/apps');
}

// ── Level 0-3 Regex Rules ──────────────────────────────────────────
const auditRules = [
  {
    level: 0,
    levelName: 'Level 0: Surface Viability',
    id: 'fatal_nativewind_babel',
    name: "Removed 'nativewind/babel' plugin in Babel",
    regex: /['"]nativewind\/babel['"]/,
    fileFilter: /(babel\.config\.|app\.config\.)/,
    advice: 'Remove nativewind/babel; NativeWind v5 has no Babel plugin',
    severity: 'CRITICAL',
  },
  {
    level: 1,
    levelName: 'Level 1: RNGH Legacy Handlers Regex Fallback',
    id: 'fatal_rngh_legacy_regex',
    name: 'Legacy React Native Gesture Handler component regex match',
    regex: /<(?:Pan|Tap|LongPress|Pinch|Rotation|Fling|ForceTouch)GestureHandler\b/,
    fileFilter: /\.(tsx|jsx|js|ts)$/,
    advice: 'Migrate to <GestureDetector gesture={Gesture.<Type>()}> or RNGH v3 hooks (usePanGesture).',
    severity: 'CRITICAL',
  }
];

// ── Level 5 AST Rules ──────────────────────────────────────────────
const astRules = [
  // ── MMKV ──────────────────────────────────────────────────────────
  {
    id: 'ast_mmkv_recovery',
    name: "MMKV 4.3.2: createMMKV missing 'recoveryStrategy'",
    severity: 'HIGH',
    advice: "Add recoveryStrategy: 'recover-or-recreate' to prevent fatal native crashes",
    check: (path, reportContext) => {
      if (path.isCallExpression() && path.node.callee.name === 'createMMKV') {
        const args = path.node.arguments;
        if (args.length === 0) {
          reportContext.addReport('Missing configuration object');
        } else if (args[0].type === 'ObjectExpression') {
          const hasRecovery = args[0].properties.some(p => 
            p.key && (p.key.name === 'recoveryStrategy' || p.key.value === 'recoveryStrategy')
          );
          if (!hasRecovery) {
            reportContext.addReport('Missing recoveryStrategy in config object', path.node.loc?.start?.line);
          }
        }
      }
    }
  },

  // ── React Navigation / Expo Router ───────────────────────────────
  {
    id: 'ast_react_navigation_import',
    name: 'Direct @react-navigation/* import in Expo Router app',
    severity: 'HIGH',
    advice: "Import directly from 'expo-router'",
    check: (path, reportContext) => {
      if (path.isImportDeclaration()) {
        const source = path.node.source.value;
        if (source.startsWith('@react-navigation/')) {
          reportContext.addReport(`Importing from ${source} is unsafe with expo-router`, path.node.loc?.start?.line);
        }
      }
    }
  },

  // ── React Native Removed APIs ────────────────────────────────────
  {
    id: 'ast_rn_removed_proptypes',
    name: 'Usage of removed React Native PropTypes (ViewPropTypes, ColorPropType)',
    severity: 'CRITICAL',
    advice: 'React Native removed ViewPropTypes and ColorPropType. Use ViewStyle or ColorValue from react-native types instead.',
    check: (path, reportContext) => {
      if (path.isImportDeclaration() && path.node.source.value === 'react-native') {
        path.node.specifiers.forEach(spec => {
          if (spec.imported && (spec.imported.name === 'ViewPropTypes' || spec.imported.name === 'ColorPropType' || spec.imported.name === 'EdgeInsetsPropType')) {
            reportContext.addReport(`Importing removed API: ${spec.imported.name}`, path.node.loc?.start?.line);
          }
        });
      }
      if (path.isMemberExpression()) {
        if (path.node.property.name === 'ViewPropTypes' || path.node.property.name === 'ColorPropType') {
          reportContext.addReport(`Accessing removed API: ${path.node.property.name}`, path.node.loc?.start?.line);
        }
      }
    }
  },

  // ── Reanimated Worklets ──────────────────────────────────────────
  {
    id: 'ast_reanimated_worklet_directive',
    name: 'Missing "worklet" directive in Reanimated function',
    severity: 'HIGH',
    advice: 'Functions passed to UI threads must have the "worklet"; directive.',
    check: (path, reportContext) => {
      if (path.isCallExpression() && path.node.callee.name === 'runOnUI') {
        const arg = path.node.arguments[0];
        if (arg && (arg.type === 'ArrowFunctionExpression' || arg.type === 'FunctionExpression')) {
          const hasWorklet = arg.body && arg.body.directives && arg.body.directives.some(d => d.value.value === 'worklet');
          if (arg.body.type === 'BlockStatement' && !hasWorklet) {
            reportContext.addReport('runOnUI argument is missing "worklet"; directive', path.node.loc?.start?.line);
          }
        }
      }
    }
  },

  // ── RNGH Rule 1: Legacy Component Handlers ───────────────────────
  {
    id: 'ast_rngh_legacy_handlers',
    name: 'Legacy React Native Gesture Handler components',
    severity: 'CRITICAL',
    advice: 'RNGH v3 permanently removed legacy component handlers (<PanGestureHandler>). Migrate to <GestureDetector gesture={Gesture.Pan()}> or v3 hooks (usePanGesture).',
    check: (path, reportContext) => {
      const legacyHandlers = [
        'PanGestureHandler',
        'TapGestureHandler',
        'LongPressGestureHandler',
        'PinchGestureHandler',
        'RotationGestureHandler',
        'FlingGestureHandler',
        'ForceTouchGestureHandler'
      ];

      // Check imports
      if (path.isImportDeclaration() && path.node.source.value === 'react-native-gesture-handler') {
        path.node.specifiers.forEach(spec => {
          if (spec.imported && legacyHandlers.includes(spec.imported.name)) {
            reportContext.addReport(
              `Importing removed legacy component '${spec.imported.name}' from 'react-native-gesture-handler'`,
              spec.loc?.start?.line
            );
          }
        });
      }

      // Check JSX tags
      if (path.isJSXElement()) {
        const nameNode = path.node.openingElement.name;
        const name = nameNode.type === 'JSXIdentifier' ? nameNode.name : null;
        if (name && legacyHandlers.includes(name)) {
          reportContext.addReport(`Legacy RNGH JSX element used: <${name}>`, path.node.loc?.start?.line);
        }

        // Check legacy props
        path.node.openingElement.attributes.forEach(attr => {
          if (attr.type === 'JSXAttribute' && attr.name) {
            const attrName = attr.name.name;
            if (attrName === 'onGestureEvent' || attrName === 'onHandlerStateChange') {
              reportContext.addReport(`Legacy gesture handler prop '${attrName}' found on <${name || 'Element'}>`, attr.loc?.start?.line);
            }
          }
        });
      }
    }
  },

  // ── RNGH Rule 2: Modal Touch Disconnection ───────────────────────
  {
    id: 'ast_rngh_modal_missing_root_view',
    name: 'Modal nested touch context disconnection (Android/iOS)',
    severity: 'HIGH',
    advice: 'Wrap content inside <Modal> in <GestureHandlerRootView style={{ flex: 1 }}> to restore native gesture interception.',
    check: (path, reportContext) => {
      if (path.isJSXElement()) {
        const elemName = path.node.openingElement.name.name;
        if (elemName === 'Modal') {
          // Check if file uses RNGH or contains RNGH elements
          if (reportContext.fileContext.hasRNGH) {
            // Traverse children to check for GestureHandlerRootView
            let hasRootViewInsideModal = false;
            path.traverse({
              JSXOpeningElement(subPath) {
                if (subPath.node.name.name === 'GestureHandlerRootView') {
                  hasRootViewInsideModal = true;
                }
              }
            });

            if (!hasRootViewInsideModal) {
              reportContext.addReport(
                'React Native <Modal> creates a separate native window hierarchy, severing RNGH touch dispatch. Wrap modal children in <GestureHandlerRootView style={{ flex: 1 }}>',
                path.node.loc?.start?.line
              );
            }
          }
        }
      }
    }
  },

  // ── RNGH Rule 3: ScrollView / Native Gesture Composition ─────────
  {
    id: 'ast_rngh_scrollview_composition',
    name: 'Core ScrollView / FlatList conflicting with RNGH gestures',
    severity: 'MEDIUM',
    advice: "Import ScrollView / FlatList from 'react-native-gesture-handler' or coordinate using Gesture.Native().simultaneousWithExternalGesture(scrollRef).",
    check: (path, reportContext) => {
      // If file has RNGH gesture elements AND imports ScrollView from 'react-native'
      if (reportContext.fileContext.hasRNGH) {
        if (path.isJSXElement()) {
          const name = path.node.openingElement.name.name;
          if (name === 'GestureDetector') {
            // Check if any descendant is standard ScrollView or FlatList
            path.traverse({
              JSXOpeningElement(subPath) {
                const subName = subPath.node.name.name;
                const importInfo = reportContext.fileContext.imports.get(subName);
                const isCoreScroll = (subName === 'ScrollView' || subName === 'FlatList' || importInfo?.imported === 'ScrollView' || importInfo?.imported === 'FlatList') &&
                  (importInfo?.source === 'react-native' || (!importInfo && (subName === 'ScrollView' || subName === 'FlatList')));
                if (isCoreScroll) {
                  reportContext.addReport(
                    `Core React Native <${subName}> nested inside <GestureDetector>. Outer scroll view may steal touches. Use Gesture.Native() or import ${subName} from 'react-native-gesture-handler'`,
                    subPath.node.loc?.start?.line
                  );
                }
              }
            });
          }
        }
      }
    }
  },

  // ── RNGH Rule 4: Root View Setup ─────────────────────────────────
  {
    id: 'ast_rngh_root_view_setup',
    name: 'Missing GestureHandlerRootView in application root layout',
    severity: 'CRITICAL',
    advice: "Wrap the root JSX tree in <GestureHandlerRootView style={{ flex: 1 }}> to register native gesture interceptors.",
    check: (path, reportContext) => {
      const filePath = reportContext.fileContext.filePath.replace(/\\/g, '/');
      const isRootLayout = /(?:_layout\.[jt]sx?|App\.[jt]sx?|index\.[jt]sx?)$/i.test(filePath);
      
      if (isRootLayout && reportContext.fileContext.hasRNGH && path.isProgram()) {
        let hasRootView = false;
        path.traverse({
          JSXOpeningElement(subPath) {
            if (subPath.node.name.name === 'GestureHandlerRootView') {
              hasRootView = true;
            }
          }
        });

        if (!hasRootView) {
          reportContext.addReport(
            "Application root layout file imports RNGH but is missing <GestureHandlerRootView style={{ flex: 1 }}> wrapper. This causes native crashes (e.g. TurboModuleRegistry not found).",
            1
          );
        }
      }
    }
  },

  // ── RNGH Rule 5: Pressable Propagation (Signal S1) ────────────────
  {
    id: 'ast_rngh_pressable_propagation',
    name: 'RNGH Pressable touch propagation regression (Signal S1)',
    severity: 'HIGH',
    advice: "Use Pressable from 'react-native' or upgrade to a fixed RNGH release (isTouchPropagationAllowed stuck false #3476).",
    check: (path, reportContext) => {
      if (path.isImportDeclaration() && path.node.source.value === 'react-native-gesture-handler') {
        path.node.specifiers.forEach(spec => {
          if (spec.imported && spec.imported.name === 'Pressable') {
            reportContext.addReport(
              "Importing 'Pressable' from 'react-native-gesture-handler' triggers Signal S1 (touches stuck false). Import from 'react-native' instead.",
              spec.loc?.start?.line
            );
          }
        });
      }
    }
  },

  // ── RNGH Rule 6: Fabric ReanimatedSwipeable + BottomSheet (Signal S2)
  {
    id: 'ast_rngh_v3_fabric_swipeable_crash',
    name: 'RNGH v3 SIGABRT: ReanimatedSwipeable + BottomSheet on Fabric (Signal S2)',
    severity: 'HIGH',
    advice: "Context: RNGH 3.x + ReanimatedSwipeable + @gorhom/bottom-sheet + Fabric causes Yoga assert SIGABRT (#4241). Stay on RNGH 2.31.x or avoid this combo.",
    check: (path, reportContext) => {
      if (path.isProgram()) {
        const hasSwipeable = reportContext.fileContext.imports.has('ReanimatedSwipeable') ||
          reportContext.fileContext.importedModules.has('react-native-gesture-handler/ReanimatedSwipeable');
        const hasBottomSheet = Array.from(reportContext.fileContext.importedModules).some(m => m.includes('bottom-sheet'));
        
        if (hasSwipeable && hasBottomSheet) {
          reportContext.addReport(
            "Dangerous combination: ReanimatedSwipeable and @gorhom/bottom-sheet trigger a fatal Yoga layout assert (SIGABRT #4241) on Fabric in RNGH 3.x.",
            1
          );
        }
      }
    }
  },

  // ── RNGH Rule 7: Ergonomic v3 Hooks Opportunity ─────────────────
  {
    id: 'ast_rngh_v3_hooks_opportunity',
    name: 'Ergonomic RNGH v3 Hooks Opportunity (usePanGesture, useTapGesture)',
    severity: 'OPPORTUNITY',
    advice: "Replace verbose <GestureDetector gesture={Gesture.Pan()...}> with direct hook binding (usePanGesture) for cleaner code.",
    check: (path, reportContext) => {
      if (path.isJSXElement()) {
        const name = path.node.openingElement.name.name;
        if (name === 'GestureDetector') {
          reportContext.addReport(
            "Consider replacing <GestureDetector> wrapper with ergonomic RNGH v3 hooks (usePanGesture, useTapGesture) to eliminate JSX boilerplate.",
            path.node.loc?.start?.line
          );
        }
      }
    }
  }
];

const results = [];

function scanFileAST(filePath) {
  let code;
  try {
    code = fs.readFileSync(filePath, 'utf8');
  } catch {
    return;
  }

  let ast;
  try {
    ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'classProperties', 'decorators-legacy']
    });
  } catch (err) {
    // Parser error (skip invalid syntax)
    return;
  }

  const fileContext = {
    filePath,
    code,
    imports: new Map(), // localName -> { source, imported }
    importedModules: new Set(),
    hasRNGH: false,
  };

  // Pre-collect imports
  if (ast.program && ast.program.body) {
    for (const stmt of ast.program.body) {
      if (stmt.type === 'ImportDeclaration') {
        const src = stmt.source.value;
        fileContext.importedModules.add(src);
        if (src === 'react-native-gesture-handler' || src.startsWith('react-native-gesture-handler/')) {
          fileContext.hasRNGH = true;
        }
        for (const spec of stmt.specifiers) {
          const local = spec.local.name;
          const imported = spec.imported ? spec.imported.name : (spec.type === 'ImportDefaultSpecifier' ? 'default' : '*');
          fileContext.imports.set(local, { source: src, imported });
        }
      }
    }
  }

  const fileResults = [];

  traverse(ast, {
    enter(nodePath) {
      for (const rule of astRules) {
        const reportContext = {
          fileContext,
          addReport: (msg, line) => {
            fileResults.push({
              ruleId: rule.id,
              name: rule.name,
              severity: rule.severity,
              advice: rule.advice,
              message: msg,
              line: line || nodePath.node.loc?.start?.line || 1
            });
          }
        };
        try {
          rule.check(nodePath, reportContext);
        } catch(e) {}
      }
    }
  });

  if (fileResults.length > 0) {
    results.push({ file: filePath, violations: fileResults });
  }
}

function scanFileRegex(filePath) {
  let code;
  try {
    code = fs.readFileSync(filePath, 'utf8');
  } catch {
    return;
  }

  const fileResults = [];
  
  for (const rule of auditRules) {
    if (!rule.fileFilter.test(filePath)) continue;
    if (rule.regex.test(code)) {
      fileResults.push({
        ruleId: rule.id,
        name: rule.name,
        severity: rule.severity,
        advice: rule.advice,
        type: 'REGEX'
      });
    }
  }
  if (fileResults.length > 0) {
    let existing = results.find(r => r.file === filePath);
    if (!existing) {
      existing = { file: filePath, violations: [] };
      results.push(existing);
    }
    existing.violations.push(...fileResults);
  }
}

function walkDir(target) {
  if (!fs.existsSync(target)) return;
  const stat = fs.statSync(target);
  if (!stat.isDirectory()) {
    if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(target)) {
      scanFileAST(target);
      scanFileRegex(target);
    }
    return;
  }
  const files = fs.readdirSync(target);
  for (const f of files) {
    const p = path.join(target, f);
    if (fs.statSync(p).isDirectory()) {
      if (!p.includes('node_modules') && !p.includes('.git') && !p.includes('.next')) {
        walkDir(p);
      }
    } else {
      if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(p)) {
        scanFileAST(p);
        scanFileRegex(p);
      }
    }
  }
}

if (!jsonOutput) {
  console.log('TCDI Codebase Auditor (AST + Regex)');
}

targetPaths.forEach(tp => {
  if (!jsonOutput) console.log(`Scanning: ${tp}`);
  walkDir(tp);
});

if (jsonOutput) {
  console.log(JSON.stringify(results, null, 2));
  if (results.some(r => r.violations.some(v => v.severity === 'CRITICAL' || v.severity === 'HIGH'))) {
    process.exit(1);
  }
  process.exit(0);
}

console.log('\nResults:\n');
let issues = 0;
let breakingCount = 0;

for (const r of results) {
  console.log(`File: ${r.file}`);
  for (const v of r.violations) {
    issues++;
    if (v.severity === 'CRITICAL' || v.severity === 'HIGH') {
      breakingCount++;
    }
    console.log(`  [${v.severity}] ${v.name}`);
    if (v.line) console.log(`  Line: ${v.line}`);
    if (v.message) console.log(`  Detail: ${v.message}`);
    console.log(`  Advice: ${v.advice}`);
    console.log('');
  }
}

if (issues === 0) {
  console.log('No issues found. Codebase is clean.');
} else {
  console.log(`Total issues: ${issues} (${breakingCount} breaking)`);
  if (breakingCount > 0) {
    process.exit(1);
  }
}
