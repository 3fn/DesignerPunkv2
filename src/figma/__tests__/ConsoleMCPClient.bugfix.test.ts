/**
 * Bug Condition Exploration Tests — Figma Token Push Fixes
 *
 * These tests encode the EXPECTED (correct) behavior for four bugs in the
 * Figma token push workflow. They are designed to FAIL on unfixed code,
 * proving the bugs exist. After fixes are applied, these same tests will
 * PASS, confirming the bugs are resolved.
 *
 * Property 1: Fault Condition — Incremental Sync Schema Mismatches &
 *             Missing Alias/Port Cleanup
 *
 * @see Bugfix: .kiro/specs/054c-figma-token-push-fixes/bugfix.md
 * @see Design: .kiro/specs/054c-figma-token-push-fixes/design.md
 * @requirements 1.1, 1.2, 1.3, 1.4
 */

import type { FigmaVariable } from '../../generators/transformers/FigmaTransformer';
import type { ConsoleMCPClient } from '../ConsoleMCPClient';

// ---------------------------------------------------------------------------
// Mock MCP SDK before importing the implementation
// ---------------------------------------------------------------------------

const mockCallTool = jest.fn();
const mockConnect = jest.fn().mockResolvedValue(undefined);
const mockClose = jest.fn().mockResolvedValue(undefined);

jest.mock('@modelcontextprotocol/sdk/client/index.js', () => ({
  Client: jest.fn().mockImplementation(() => ({
    callTool: mockCallTool,
    connect: mockConnect,
    close: mockClose,
  })),
}));

jest.mock('@modelcontextprotocol/sdk/client/stdio.js', () => ({
  StdioClientTransport: jest.fn().mockImplementation(() => ({})),
}));

import { ConsoleMCPClientImpl } from '../ConsoleMCPClientImpl';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeToolResult(content: unknown, isError = false) {
  return {
    isError,
    content: [{ text: typeof content === 'string' ? content : JSON.stringify(content) }],
  };
}

function makeVariable(name: string, value: number = 8): FigmaVariable {
  return {
    name,
    resolvedType: 'FLOAT',
    valuesByMode: { light: value, dark: value },
    description: `Token ${name}`,
  };
}

// ---------------------------------------------------------------------------
// Test 1a — Bug 1: batchCreate passes fileKey instead of collectionId
// ---------------------------------------------------------------------------

describe('Bug Condition Exploration — Fault Condition Property', () => {
  const COLLECTION_ID = 'VariableCollectionId:123:456';

  let client: ConsoleMCPClientImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCallTool.mockResolvedValue(makeToolResult({ success: true }));
    client = new ConsoleMCPClientImpl({ accessToken: 'test-token' });
  });

  // -----------------------------------------------------------------------
  // Test 1a — Bug 1: batchCreateVariables uses fileKey instead of collectionId
  //
  // Bug_Condition: input.isIncrementalSync AND input.hasNewVariables
  //   AND payload.hasProperty("fileKey") AND NOT payload.hasProperty("collectionId")
  //
  // The figma_batch_create_variables tool expects { collectionId, variables }
  // but the current code sends { fileKey, variables }.
  //
  // This test ASSERTS the correct behavior (collectionId in payload).
  // On unfixed code it FAILS — proving Bug 1 exists.
  // -----------------------------------------------------------------------

  describe('Test 1a — batchCreateVariables must use collectionId (Bug 1)', () => {
    beforeEach(async () => {
      await client.connect();
    });

    it('sends collectionId (not fileKey) to figma_batch_create_variables', async () => {
      const vars = [makeVariable('space/100', 8), makeVariable('space/200', 16)];

      // Call batchCreateVariables — on unfixed code, first param is fileKey
      await client.batchCreateVariables(COLLECTION_ID, vars);

      const callArgs = mockCallTool.mock.calls[0][0];
      expect(callArgs.name).toBe('figma_batch_create_variables');

      // EXPECTED: payload contains collectionId
      // ACTUAL (unfixed): payload contains fileKey
      const payload = callArgs.arguments;
      expect(payload).toHaveProperty('collectionId', COLLECTION_ID);
      expect(payload).not.toHaveProperty('fileKey');
    });
  });

  // -----------------------------------------------------------------------
  // Test 1b — Bug 2: batchUpdateVariables sends wrong payload shape
  //
  // Bug_Condition: input.isIncrementalSync AND input.hasUpdatedVariables
  //   AND payload.shape != "{updates: [{variableId, modeId, value}]}"
  //
  // The figma_batch_update_variables tool expects:
  //   { updates: [{ variableId, modeId, value }] }
  // but the current code sends:
  //   { fileKey, variables: [{ name, resolvedType, valuesByMode }] }
  //
  // This test ASSERTS the correct behavior (updates array with tuples).
  // On unfixed code it FAILS — proving Bug 2 exists.
  // -----------------------------------------------------------------------

  describe('Test 1b — batchUpdateVariables must use update tuples (Bug 2)', () => {
    beforeEach(async () => {
      await client.connect();
    });

    it('sends { updates: [{ variableId, modeId, value }] } to figma_batch_update_variables', async () => {
      const updates = [
        { variableId: 'VariableID:3:4', modeId: '1:0', value: '#FF0000' },
        { variableId: 'VariableID:5:6', modeId: '1:0', value: '#00FF00' },
      ];

      // On unfixed code, batchUpdateVariables accepts (fileKey, FigmaVariable[])
      // On fixed code, it should accept update tuples
      // We call with the CORRECT signature — this will fail on unfixed code
      // because the method signature doesn't accept this shape
      await (client as any).batchUpdateVariables(updates);

      const callArgs = mockCallTool.mock.calls[0][0];
      expect(callArgs.name).toBe('figma_batch_update_variables');

      const payload = callArgs.arguments;

      // EXPECTED: payload has { updates: [...] }
      // ACTUAL (unfixed): payload has { fileKey, variables: [...] }
      expect(payload).toHaveProperty('updates');
      expect(payload).not.toHaveProperty('fileKey');
      expect(payload).not.toHaveProperty('variables');

      // Verify each update tuple has the correct shape
      expect(payload.updates).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            variableId: expect.any(String),
            modeId: expect.any(String),
            value: expect.anything(),
          }),
        ]),
      );
    });
  });

  // -----------------------------------------------------------------------
  // Test 1c — Bug 3: ConsoleMCPClient lacks createVariableAliases method
  //
  // Bug_Condition: input.hasSemanticTokens AND input.semanticToken.referencesAlias
  //   AND pushedValue.type == "rawValue"
  //
  // Semantic tokens that reference primitives should create Figma variable
  // aliases via figma_execute with Plugin API code. The current interface
  // has no createVariableAliases method at all.
  //
  // This test ASSERTS the method exists on the implementation.
  // On unfixed code it FAILS — proving Bug 3 exists.
  // -----------------------------------------------------------------------

  describe('Test 1c — createVariableAliases method must exist (Bug 3)', () => {
    it('ConsoleMCPClientImpl has a createVariableAliases method', () => {
      // EXPECTED: createVariableAliases is a function on the implementation
      // ACTUAL (unfixed): method does not exist
      expect(typeof (client as any).createVariableAliases).toBe('function');
    });

    it('ConsoleMCPClient interface includes createVariableAliases', () => {
      // Verify the interface contract by checking the implementation
      // satisfies the expected shape including createVariableAliases
      const hasMethod = 'createVariableAliases' in client;
      expect(hasMethod).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // Test 1d — Bug 4: figma-push.ts run() lacks port cleanup before connect()
  //
  // Bug_Condition: input.isStartup AND existsProcess(ports=[9223..9232])
  //   AND NOT input.performsPortCleanup
  //
  // When stale figma-console-mcp processes hold ports 9223-9232, the new
  // instance binds to a fallback port and the Desktop Bridge connects to
  // the wrong server. The run() function should clean up stale processes
  // before calling connect().
  //
  // This test verifies that the source code of figma-push.ts contains
  // port cleanup logic before the connect() call.
  // On unfixed code it FAILS — proving Bug 4 exists.
  // -----------------------------------------------------------------------

  describe('Test 1d — figma-push.ts must perform port cleanup before connect (Bug 4)', () => {
    it('run() source contains port cleanup before connect()', () => {
      // Read the source code of figma-push.ts to verify port cleanup exists
      // This is a structural test — we verify the code contains the cleanup pattern
      const fs = require('fs');
      const path = require('path');
      const source = fs.readFileSync(
        path.resolve(__dirname, '../../cli/figma-push.ts'),
        'utf-8',
      );

      // EXPECTED: Source contains port cleanup logic (lsof, kill, or a cleanup function call)
      // ACTUAL (unfixed): No port cleanup exists in the source
      const hasPortCleanup =
        source.includes('portCleanup') ||
        source.includes('cleanupPorts') ||
        source.includes('killStaleProcesses') ||
        source.includes('lsof') ||
        source.includes('9223');

      expect(hasPortCleanup).toBe(true);
    });

    it('port cleanup occurs before ConsoleMCPClientImpl creation', () => {
      const fs = require('fs');
      const path = require('path');
      const source = fs.readFileSync(
        path.resolve(__dirname, '../../cli/figma-push.ts'),
        'utf-8',
      );

      // Find positions of cleanup and connect in the source
      const cleanupPatterns = [
        'portCleanup', 'cleanupPorts', 'killStaleProcesses', 'cleanupStalePorts',
      ];
      const cleanupIndex = cleanupPatterns.reduce((idx, pattern) => {
        const found = source.indexOf(pattern);
        return found >= 0 && (idx < 0 || found < idx) ? found : idx;
      }, -1);

      const connectIndex = source.indexOf('.connect()');

      // EXPECTED: cleanup appears before connect in the source
      // ACTUAL (unfixed): cleanup doesn't exist at all (cleanupIndex === -1)
      expect(cleanupIndex).toBeGreaterThan(-1);
      expect(cleanupIndex).toBeLessThan(connectIndex);
    });
  });
});
