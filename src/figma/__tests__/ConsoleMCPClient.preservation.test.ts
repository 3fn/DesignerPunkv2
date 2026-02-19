/**
 * Preservation Property Tests — ConsoleMCPClient
 *
 * These tests capture the CURRENT (unfixed) behavior that must be preserved
 * when bug fixes are applied. They verify:
 * - Test 2a: Initial setup via figma_setup_design_tokens payload format
 * - Test 2e: Primitive (non-alias) tokens pushed with resolved values
 * - Test 2f: Style sync Plugin API code generation (effect + text styles)
 * - Test 2g: Desktop Bridge retry logic (5 attempts, 3-second delays)
 *
 * Property 2: Preservation — Initial Setup, Primitives, Style Sync, Bridge Retry
 *
 * **Validates: Requirements 3.1, 3.5, 3.6, 3.7**
 *
 * @see Bugfix: .kiro/specs/054c-figma-token-push-fixes/bugfix.md
 * @see Design: .kiro/specs/054c-figma-token-push-fixes/design.md
 */

import * as fc from 'fast-check';
import type { FigmaVariable } from '../../generators/transformers/FigmaTransformer';
import type { DesignTokenSetupPayload, ConsoleMCPClient } from '../ConsoleMCPClient';
import { checkDesktopBridge } from '../preflight';

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

// ---------------------------------------------------------------------------
// fast-check arbitraries
// ---------------------------------------------------------------------------

/** Generate a valid Figma variable name (slash-separated path). */
const arbVariableName = fc.array(
  fc.string({ minLength: 1, maxLength: 8, unit: fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')) }),
  { minLength: 1, maxLength: 3 },
).map(parts => parts.join('/'));

/** Generate a mode name. */
const arbModeName = fc.string({
  minLength: 2,
  maxLength: 8,
  unit: fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split('')),
});

// ---------------------------------------------------------------------------
// Test 2a — Initial Setup Preservation
// ---------------------------------------------------------------------------

describe('Preservation — ConsoleMCPClient', () => {
  let client: ConsoleMCPClientImpl;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockCallTool.mockResolvedValue(makeToolResult({
      success: true,
      collectionId: 'VariableCollectionId:1:2',
      modes: { light: '1:0', dark: '1:1' },
    }));
    client = new ConsoleMCPClientImpl({ accessToken: 'test-token' });
    await client.connect();
  });

  describe('Test 2a — setupDesignTokens calls figma_setup_design_tokens with correct payload format', () => {
    /**
     * **Validates: Requirements 3.1**
     *
     * For all valid DesignTokenSetupPayload inputs, setupDesignTokens always
     * calls figma_setup_design_tokens with { collectionName, modes, tokens }.
     * This preserves the atomic initial setup path.
     */
    it('property: for all valid payloads, calls figma_setup_design_tokens with { collectionName, modes, tokens }', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate a collection name
          fc.string({ minLength: 1, maxLength: 20 }),
          // Generate 1-3 mode names
          fc.array(arbModeName, { minLength: 1, maxLength: 3 }).filter(modes => modes.length > 0),
          // Generate 1-5 variable names
          fc.array(arbVariableName, { minLength: 1, maxLength: 5 }),
          async (collectionName, modes: string[], varNames: string[]) => {
            jest.clearAllMocks();
            mockCallTool.mockResolvedValue(makeToolResult({
              success: true,
              collectionId: 'VariableCollectionId:1:2',
              modes: Object.fromEntries(modes.map((m, i) => [m, `${i}:0`])),
            }));

            // Ensure variables have values for the generated modes
            const varsWithModes: FigmaVariable[] = varNames.map(name => ({
              name,
              resolvedType: 'FLOAT' as const,
              valuesByMode: Object.fromEntries(modes.map(m => [m, 42])),
            }));

            const payload: DesignTokenSetupPayload = {
              collections: [{
                name: collectionName,
                modes,
                variables: varsWithModes,
              }],
            };

            await client.setupDesignTokens('file-key', payload);

            // Verify figma_setup_design_tokens was called
            const setupCall = mockCallTool.mock.calls.find(
              (c: any) => c[0]?.name === 'figma_setup_design_tokens',
            );
            expect(setupCall).toBeDefined();

            const args = setupCall![0].arguments;
            // Must have collectionName, modes, and tokens
            expect(args).toHaveProperty('collectionName', collectionName);
            expect(args).toHaveProperty('modes', modes);
            expect(args).toHaveProperty('tokens');
            expect(Array.isArray(args.tokens)).toBe(true);
            // Each token must have name, resolvedType, values
            for (const token of args.tokens) {
              expect(token).toHaveProperty('name');
              expect(token).toHaveProperty('resolvedType');
              expect(token).toHaveProperty('values');
            }
          },
        ),
        { numRuns: 20 },
      );
    });

    it('example: single collection with two modes and one variable', async () => {
      const payload: DesignTokenSetupPayload = {
        collections: [{
          name: 'Primitives',
          modes: ['light', 'dark'],
          variables: [{
            name: 'space/100',
            resolvedType: 'FLOAT',
            valuesByMode: { light: 8, dark: 8 },
            description: 'Base spacing',
          }],
        }],
      };

      await client.setupDesignTokens('file-key', payload);

      expect(mockCallTool).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'figma_setup_design_tokens',
          arguments: expect.objectContaining({
            collectionName: 'Primitives',
            modes: ['light', 'dark'],
            tokens: expect.arrayContaining([
              expect.objectContaining({
                name: 'space/100',
                resolvedType: 'FLOAT',
                values: expect.objectContaining({ light: 8, dark: 8 }),
              }),
            ]),
          }),
        }),
      );
    });
  });

  // -------------------------------------------------------------------------
  // Test 2e — Primitive Value Preservation
  // -------------------------------------------------------------------------

  describe('Test 2e — Primitive tokens pushed with resolved values (no alias transformation)', () => {
    /**
     * **Validates: Requirements 3.5**
     *
     * For all primitive tokens (no aliasOf), values are passed through
     * unchanged to figma_setup_design_tokens.
     */
    it('property: for all primitive tokens, values are passed through unchanged', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate a primitive value (number)
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 1000 }),
          async (lightVal, darkVal) => {
            jest.clearAllMocks();
            mockCallTool.mockResolvedValue(makeToolResult({
              success: true,
              collectionId: 'VariableCollectionId:1:2',
              modes: { light: '1:0', dark: '1:1' },
            }));

            const payload: DesignTokenSetupPayload = {
              collections: [{
                name: 'Primitives',
                modes: ['light', 'dark'],
                variables: [{
                  name: 'space/test',
                  resolvedType: 'FLOAT',
                  valuesByMode: { light: lightVal, dark: darkVal },
                }],
              }],
            };

            await client.setupDesignTokens('file-key', payload);

            const setupCall = mockCallTool.mock.calls.find(
              (c: any) => c[0]?.name === 'figma_setup_design_tokens',
            );
            expect(setupCall).toBeDefined();

            const token = setupCall![0].arguments.tokens[0];
            // Primitive values must pass through unchanged
            expect(token.values.light).toBe(lightVal);
            expect(token.values.dark).toBe(darkVal);
          },
        ),
        { numRuns: 30 },
      );
    });

    it('property: alias tokens are resolved to concrete values (not passed as alias objects)', async () => {
      jest.clearAllMocks();
      mockCallTool.mockResolvedValue(makeToolResult({
        success: true,
        collectionId: 'VariableCollectionId:1:2',
        modes: { light: '1:0', dark: '1:1' },
      }));

      const payload: DesignTokenSetupPayload = {
        collections: [{
          name: 'Primitives',
          modes: ['light', 'dark'],
          variables: [
            {
              name: 'color/blue/500',
              resolvedType: 'COLOR',
              valuesByMode: { light: '#3B82F6', dark: '#3B82F6' },
            },
            {
              name: 'color/primary',
              resolvedType: 'COLOR',
              // Alias reference — should be resolved to the primitive value
              valuesByMode: {
                light: { aliasOf: 'color/blue/500' },
                dark: { aliasOf: 'color/blue/500' },
              },
            },
          ],
        }],
      };

      await client.setupDesignTokens('file-key', payload);

      const setupCall = mockCallTool.mock.calls.find(
        (c: any) => c[0]?.name === 'figma_setup_design_tokens',
      );
      expect(setupCall).toBeDefined();

      const tokens = setupCall![0].arguments.tokens;
      const primaryToken = tokens.find((t: any) => t.name === 'color/primary');
      expect(primaryToken).toBeDefined();

      // Alias must be resolved to the concrete value, not passed as { aliasOf: ... }
      expect(primaryToken.values.light).toBe('#3B82F6');
      expect(primaryToken.values.dark).toBe('#3B82F6');
    });
  });

  // -------------------------------------------------------------------------
  // Test 2g — Desktop Bridge Retry Preservation
  // -------------------------------------------------------------------------

  describe('Test 2g — Desktop Bridge retry logic (5 attempts, 3-second delays)', () => {
    /**
     * **Validates: Requirements 3.7**
     *
     * checkDesktopBridge() retries up to 5 times with 3-second delays
     * when the bridge is unavailable. This must be preserved.
     */
    it('retries 5 times when bridge is unavailable', async () => {
      const mockClient: jest.Mocked<ConsoleMCPClient> = {
        batchCreateVariables: jest.fn(),
        batchUpdateVariables: jest.fn(),
        createVariableAliases: jest.fn(),
        getVariables: jest.fn(),
        execute: jest.fn(),
        setupDesignTokens: jest.fn(),
        getStatus: jest.fn().mockResolvedValue({
          transport: { websocket: { available: false } },
        }),
      };

      const result = await checkDesktopBridge(mockClient);

      expect(result.ready).toBe(false);
      // Must have been called exactly 5 times (maxRetries)
      expect(mockClient.getStatus).toHaveBeenCalledTimes(5);
    }, 30000);

    it('returns ready: true on first successful attempt', async () => {
      const mockClient: jest.Mocked<ConsoleMCPClient> = {
        batchCreateVariables: jest.fn(),
        batchUpdateVariables: jest.fn(),
        createVariableAliases: jest.fn(),
        getVariables: jest.fn(),
        execute: jest.fn(),
        setupDesignTokens: jest.fn(),
        getStatus: jest.fn().mockResolvedValue({
          transport: { websocket: { available: true } },
        }),
      };

      const result = await checkDesktopBridge(mockClient);

      expect(result.ready).toBe(true);
      expect(mockClient.getStatus).toHaveBeenCalledTimes(1);
    });

    it('succeeds on retry after initial failures', async () => {
      const mockClient: jest.Mocked<ConsoleMCPClient> = {
        batchCreateVariables: jest.fn(),
        batchUpdateVariables: jest.fn(),
        createVariableAliases: jest.fn(),
        getVariables: jest.fn(),
        execute: jest.fn(),
        setupDesignTokens: jest.fn(),
        getStatus: jest.fn()
          .mockResolvedValueOnce({ transport: { websocket: { available: false } } })
          .mockResolvedValueOnce({ transport: { websocket: { available: false } } })
          .mockResolvedValueOnce({ transport: { websocket: { available: true } } }),
      };

      const result = await checkDesktopBridge(mockClient);

      expect(result.ready).toBe(true);
      expect(mockClient.getStatus).toHaveBeenCalledTimes(3);
    }, 15000);

    it('returns error message with setup instructions when all retries fail', async () => {
      const mockClient: jest.Mocked<ConsoleMCPClient> = {
        batchCreateVariables: jest.fn(),
        batchUpdateVariables: jest.fn(),
        createVariableAliases: jest.fn(),
        getVariables: jest.fn(),
        execute: jest.fn(),
        setupDesignTokens: jest.fn(),
        getStatus: jest.fn().mockRejectedValue(new Error('Connection refused')),
      };

      const result = await checkDesktopBridge(mockClient);

      expect(result.ready).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('Desktop Bridge');
    }, 30000);
  });
});
