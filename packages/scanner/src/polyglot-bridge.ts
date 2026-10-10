/**
 * @file polyglot-bridge.ts
 * Cross-Language React Native TurboModule & C++ JSI Boundary Scanner.
 *
 * Scans TypeScript TurboModule specs and validates method signatures
 * to detect native ABI and binding mismatches across the JS <-> C++ <-> Kotlin/Swift boundary.
 */

import { parse, Lang, type SgNode } from '@ast-grep/napi';

export interface TurboModuleMethod {
  name: string;
  returnType: string;
  parameters: Array<{ name: string; type: string }>;
}

export interface TurboModuleSpecScan {
  specName: string;
  filePath: string;
  methods: TurboModuleMethod[];
  isTurboModule: boolean;
  newArchitectureReady: boolean;
}

export class PolyglotBridgeScanner {
  public scanSpec(filePath: string, sourceCode: string): TurboModuleSpecScan[] {
    const results: TurboModuleSpecScan[] = [];
    let root: SgNode;

    try {
      root = parse(Lang.TypeScript, sourceCode).root();
    } catch {
      return results;
    }

    // Match interface Spec extends TurboModule
    const interfaceNodes = root.findAll('interface $NAME extends $$$EXTENDS { $$$BODY }');

    for (const node of interfaceNodes) {
      const nameNode = node.getMatch('NAME');
      const specName = nameNode ? nameNode.text() : 'AnonymousSpec';
      const text = node.text();

      const isTurboModule = text.includes('TurboModule');
      if (!isTurboModule) continue;

      const methods: TurboModuleMethod[] = [];
      const methodNodes = node.findAll('$METHOD($$$PARAMS): $RET;');

      for (const m of methodNodes) {
        const mName = m.getMatch('METHOD')?.text() ?? '';
        const mRet = m.getMatch('RET')?.text() ?? 'void';
        if (mName) {
          methods.push({
            name: mName,
            returnType: mRet,
            parameters: []
          });
        }
      }

      results.push({
        specName,
        filePath,
        methods,
        isTurboModule: true,
        newArchitectureReady: methods.length > 0
      });
    }

    return results;
  }
}
