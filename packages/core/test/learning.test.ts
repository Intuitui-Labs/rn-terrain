import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import {
  IncidentCollector,
  SignalDistiller,
  DPOExporter,
  sanitizeSnippet,
} from '../src/learning/index.js';

describe('Autonomous Nervous System: Self-Improving Learning Loop', () => {
  let tempDir: string;
  let collector: IncidentCollector;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rn-terrain-learning-test-'));
    process.env.TERRAIN_TELEMETRY = '1';
    collector = new IncidentCollector(tempDir, '.terrain/incidents');
  });

  afterEach(() => {
    delete process.env.TERRAIN_TELEMETRY;
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('Pillar 1: Sensory Incident Collector & Privacy Redaction', () => {
    it('strictly drops incident recording when telemetry is disabled (default)', async () => {
      delete process.env.TERRAIN_TELEMETRY;
      const cleanDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rn-terrain-optin-test-'));
      const quietCollector = new IncidentCollector(cleanDir);

      const result = await quietCollector.recordRejection({
        packageName: 'react-native-reanimated',
        targetVersion: '4.7.1',
        rejectedSnippet: 'useAnimatedGestureHandler()',
      });

      expect(result).toBeNull();
      // Verify zero files or directories were created
      expect(fs.existsSync(path.join(cleanDir, '.terrain'))).toBe(false);
      fs.rmSync(cleanDir, { recursive: true, force: true });
    });

    it('sanitizes environment, URLs, secrets, and absolute drive paths from snippets', () => {
      const rawWithWindowsPath = 'import { foo } from "C:\\projects\\my-app\\src\\App.tsx"; const token = "bearer secret_12345"; fetch("https://api.internal.org/data"); useAnimatedGestureHandler();';
      const sanitized = sanitizeSnippet(rawWithWindowsPath);
      expect(sanitized).not.toContain('C:\\projects\\my-app\\src\\App.tsx');
      expect(sanitized).toContain('<PATH>');
      expect(sanitized).not.toContain('https://api.internal.org/data');
      expect(sanitized).toContain('<URL>');
      expect(sanitized).not.toContain('secret_12345');
      expect(sanitized).toContain('<CREDENTIAL_REDACTED>');
      expect(sanitized).toContain('useAnimatedGestureHandler()');
    });

    it('safeguards .gitignore by ensuring .terrain/ is ignored', async () => {
      const fakeGitignore = path.join(tempDir, '.gitignore');
      fs.writeFileSync(fakeGitignore, 'node_modules/\ndist/\n', 'utf8');
      const testCol = new IncidentCollector(tempDir);
      await testCol.recordRejection({
        packageName: 'react-native-reanimated',
        targetVersion: '4.7.1',
        rejectedSnippet: 'useAnimatedGestureHandler()',
      });
      const updated = fs.readFileSync(fakeGitignore, 'utf8');
      expect(updated).toContain('.terrain/');
    });

    it('records an incident upon gate rejection with initial RECORDED status when opted in', async () => {
      const incident = (await collector.recordRejection({
        packageName: 'react-native-reanimated',
        targetVersion: '4.7.1',
        rejectedSnippet: 'const handler = useAnimatedGestureHandler({ onStart: () => {} });',
        severedSymbolsDetected: ['useAnimatedGestureHandler'],
        canonicalReplacements: ['Gesture.Pan().onUpdate(...) with <GestureDetector>'],
      }))!;

      expect(incident).not.toBeNull();
      expect(incident.id).toMatch(/^inc-react_native_reanimated-/);
      expect(incident.status).toBe('RECORDED');
      expect(incident.severedSymbolsDetected).toContain('useAnimatedGestureHandler');

      const listed = await collector.listIncidents();
      expect(listed.length).toBe(1);
      expect(listed[0].id).toBe(incident.id);
    });

    it('resolves an incident with verified canonical remediation code', async () => {
      const incident = (await collector.recordRejection({
        packageName: 'react-native-reanimated',
        targetVersion: '4.7.1',
        rejectedSnippet: 'const handler = useAnimatedGestureHandler({});',
      }))!;

      const resolved = await collector.resolveRemediation(
        incident.id,
        'const pan = Gesture.Pan().onUpdate(() => {});'
      );

      expect(resolved.status).toBe('RESOLVED');
      expect(resolved.chosenSnippet).toBe('const pan = Gesture.Pan().onUpdate(() => {});');

      const fetched = await collector.getIncident(incident.id);
      expect(fetched?.status).toBe('RESOLVED');
      expect(fetched?.chosenSnippet).toBe(resolved.chosenSnippet);
    });
  });

  describe('Pillar 2: Signal Distiller (Autonomous Chronos Synthesis)', () => {
    it('synthesizes a formal Chronos signal from a resolved incident', async () => {
      const incident = (await collector.recordRejection({
        packageName: 'react-native-reanimated',
        targetVersion: '4.7.1',
        rejectedSnippet: 'useAnimatedGestureHandler()',
        severedSymbolsDetected: ['useAnimatedGestureHandler'],
        canonicalReplacements: ['Gesture.Pan()'],
      }))!;

      await collector.resolveRemediation(incident.id, 'Gesture.Pan()');
      const resolved = (await collector.getIncident(incident.id))!;

      const distiller = new SignalDistiller(tempDir);
      const signal = distiller.distillIncident(resolved);

      expect(signal.featureKey).toMatch(/^chronos_auto_/);
      expect(signal.packageName).toBe('react-native-reanimated');
      expect(signal.impact_severity).toBe('HIGH');
      expect(signal.transition_milestones.broken).toBe('4.7.1');
      expect(signal.transition_milestones.fixed).toBeNull();
      expect(signal.rules.dev_dance).toContain('Gesture.Pan()');
      expect(signal._chronos_meta.source).toBe('autonomous_incident_telemetry');
      expect(signal._chronos_meta.confidence).toBe(0.6);
    });

    it('stages candidate signals into drafts directory', async () => {
      const incident = (await collector.recordRejection({
        packageName: 'react-native-gesture-handler',
        targetVersion: '3.3.0',
        rejectedSnippet: '<PanGestureHandler onGestureEvent={handler}>',
        severedSymbolsDetected: ['PanGestureHandler'],
        canonicalReplacements: ['<GestureDetector gesture={pan}>'],
      }))!;

      await collector.resolveRemediation(incident.id, '<GestureDetector gesture={pan}>');
      const resolved = (await collector.getIncident(incident.id))!;

      const distiller = new SignalDistiller(tempDir);
      const signal = distiller.distillIncident(resolved);
      const draftPath = await distiller.stageDraft(signal);

      expect(fs.existsSync(draftPath)).toBe(true);
      const content = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
      expect(content[signal.featureKey]).toBeDefined();
      expect(content[signal.featureKey].display).toContain('PanGestureHandler');
    });
  });

  describe('Pillar 3: Model Weights DPO Dataset Exporter', () => {
    it('exports resolved incidents into standard HuggingFace DPO format', async () => {
      const incident = (await collector.recordRejection({
        packageName: 'react-native-reanimated',
        targetVersion: '4.7.1',
        rejectedSnippet: 'const handler = useAnimatedGestureHandler({});',
      }))!;

      await collector.resolveRemediation(
        incident.id,
        'const gesture = Gesture.Pan().onUpdate(() => {});'
      );
      const resolved = (await collector.getIncident(incident.id))!;

      const exporter = new DPOExporter();
      const hfRecord = exporter.toHuggingFaceRecord(resolved);

      expect(hfRecord.prompt).toContain('react-native-reanimated@4.7.1');
      expect(hfRecord.rejected).toContain('useAnimatedGestureHandler');
      expect(hfRecord.chosen).toContain('Gesture.Pan()');
      expect(hfRecord.metadata.incidentId).toBe(incident.id);
    });

    it('exports resolved incidents into Callstack Apex / ChatML format', async () => {
      const incident = (await collector.recordRejection({
        packageName: 'react-native-mmkv',
        targetVersion: '4.3.2',
        rejectedSnippet: 'await AsyncStorage.getItem("key");',
      }))!;

      await collector.resolveRemediation(
        incident.id,
        'const val = storage.getString("key");'
      );
      const resolved = (await collector.getIncident(incident.id))!;

      const exporter = new DPOExporter();
      const apexRecord = exporter.toApexRecord(resolved);

      expect(apexRecord.conversations[0].role).toBe('system');
      expect(apexRecord.conversations[0].content).toContain('New Architecture');
      expect(apexRecord.rejected.content).toContain('AsyncStorage.getItem');
      expect(apexRecord.chosen.content).toContain('storage.getString');
    });

    it('exports multi-incident JSONL to file stream', async () => {
      const inc1 = (await collector.recordRejection({
        packageName: 'react-native-reanimated',
        targetVersion: '4.7.1',
        rejectedSnippet: 'useAnimatedGestureHandler()',
      }))!;
      await collector.resolveRemediation(inc1.id, 'Gesture.Pan()');

      const inc2 = (await collector.recordRejection({
        packageName: 'react-native-mmkv',
        targetVersion: '4.3.2',
        rejectedSnippet: 'AsyncStorage.getItem()',
      }))!;
      await collector.resolveRemediation(inc2.id, 'storage.getString()');

      const incidents = await collector.listIncidents();
      const exporter = new DPOExporter();
      const outPath = path.join(tempDir, 'train-dpo.jsonl');

      await exporter.exportToFile(incidents, outPath, 'huggingface');
      expect(fs.existsSync(outPath)).toBe(true);

      const lines = fs.readFileSync(outPath, 'utf8').trim().split('\n');
      expect(lines.length).toBe(2);
      const parsed = lines.map((l) => JSON.parse(l));
      expect(parsed.some((p) => p.rejected === 'useAnimatedGestureHandler()')).toBe(true);
      expect(parsed.some((p) => p.chosen === 'storage.getString()')).toBe(true);
    });
  });
});
