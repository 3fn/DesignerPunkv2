/**
 * ConsoleMCPClientImpl — Unit Tests
 *
 * Tests for the concrete Console MCP client that communicates with
 * figma-console-mcp via the Model Context Protocol SDK.
 *
 * @requirements Req 4 (Token Sync Workflow)
 */

import type { FigmaVariable } from '../../generators/transformers/FigmaTransformer';

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

function makeVariable(name: string, value: number = 8): FigmaVariable {
  return {
    name,
    resolvedType: 'FLOAT',
    valuesByMode: { light: value, dark: value },
    description: `Token ${name}`,
  };
}

function makeToolResult(content: unknown, isError = false) {
  return {
    isError,
    content: [{ text: typeof content === 'string' ? content : JSON.stringify(content) }],
  };
}

function makeErrorResult(message: string) {
  return makeToolResult(message, true);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ConsoleMCPClientImpl', () => {
  const FILE_KEY = 'test-file-key';
  let client: ConsoleMCPClientImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCallTool.mockResolvedValue(makeToolResult({ success: true }));
    client = new ConsoleMCPClientImpl({ accessToken: 'test-token' });
  });

  // -------------------------------------------------------------------------
  // Construction & Connection
  // -------------------------------------------------------------------------

  describe('construction', () => {
    it('throws when no access token is provided', () => {
      const original = process.env.FIGMA_ACCESS_TOKEN;
      delete process.env.FIGMA_ACCESS_TOKEN;
      try {
        expect(() => new ConsoleMCPClientImpl({ accessToken: '' })).toThrow(
          'FIGMA_ACCESS_TOKEN is required',
        );
      } finally {
        if (original) process.env.FIGMA_ACCESS_TOKEN = original;
      }
    });

    it('accepts access token via options', () => {
      expect(() => new ConsoleMCPClientImpl({ accessToken: 'my-token' })).not.toThrow();
    });
  });

  describe('connection', () => {
    it('connects to MCP server', async () => {
      await client.connect();
      expect(mockConnect).toHaveBeenCalledTimes(1);
    });

    it('is idempotent — second connect is a no-op', async () => {
      await client.connect();
      await client.connect();
      expect(mockConnect).toHaveBeenCalledTimes(1);
    });

    it('throws descriptive error when connection fails', async () => {
      mockConnect.mockRejectedValueOnce(new Error('ENOENT: npx not found'));
      await expect(client.connect()).rejects.toThrow(
        /Failed to connect to Console MCP server.*npx not found/,
      );
    });

    it('throws when calling methods before connect', async () => {
      await expect(client.execute(FILE_KEY, 'code')).rejects.toThrow(
        'ConsoleMCPClient is not connected',
      );
    });

    it('disconnects and cleans up', async () => {
      await client.connect();
      await client.disconnect();
      expect(mockClose).toHaveBeenCalledTimes(1);
      // After disconnect, calls should fail
      await expect(client.execute(FILE_KEY, 'code')).rejects.toThrow(
        'ConsoleMCPClient is not connected',
      );
    });
  });

  // -------------------------------------------------------------------------
  // batchCreateVariables
  // -------------------------------------------------------------------------

  describe('batchCreateVariables', () => {
    beforeEach(async () => {
      await client.connect();
    });

    it('calls figma_batch_create_variables with collectionId', async () => {
      const vars = [makeVariable('space/100', 8), makeVariable('space/200', 16)];
      const collectionId = 'VariableCollectionId:1:2';
      await client.batchCreateVariables(collectionId, vars);

      expect(mockCallTool).toHaveBeenCalledWith({
        name: 'figma_batch_create_variables',
        arguments: {
          collectionId,
          variables: vars.map((v) => ({
            name: v.name,
            resolvedType: v.resolvedType,
            description: v.description,
            valuesByMode: v.valuesByMode,
          })),
        },
      });
    });

    it('converts mode name keys to mode IDs when modesMap is provided', async () => {
      const vars = [makeVariable('space/100', 8)];
      const collectionId = 'VariableCollectionId:1:2';
      const modesMap = { light: '1:0', dark: '1:1' };
      await client.batchCreateVariables(collectionId, vars, modesMap);

      expect(mockCallTool).toHaveBeenCalledWith({
        name: 'figma_batch_create_variables',
        arguments: {
          collectionId,
          variables: [
            {
              name: 'space/100',
              resolvedType: 'FLOAT',
              description: 'Token space/100',
              valuesByMode: { '1:0': 8, '1:1': 8 },
            },
          ],
        },
      });
    });

    it('propagates MCP tool errors', async () => {
      mockCallTool.mockResolvedValueOnce(
        makeErrorResult('Rate limit exceeded (429)'),
      );
      const collectionId = 'VariableCollectionId:1:2';
      await expect(client.batchCreateVariables(collectionId, [makeVariable('x')])).rejects.toThrow(
        /MCP tool "figma_batch_create_variables" failed.*Rate limit exceeded/,
      );
    });
  });

  // -------------------------------------------------------------------------
  // batchUpdateVariables
  // -------------------------------------------------------------------------

  describe('batchUpdateVariables', () => {
    beforeEach(async () => {
      await client.connect();
    });

    it('calls figma_batch_update_variables with update tuples', async () => {
      const updates = [
        { variableId: 'VariableID:3:4', modeId: '1:0', value: 12 },
        { variableId: 'VariableID:3:4', modeId: '1:1', value: 12 },
      ];
      await client.batchUpdateVariables(updates);

      expect(mockCallTool).toHaveBeenCalledWith({
        name: 'figma_batch_update_variables',
        arguments: {
          updates,
        },
      });
    });

    it('propagates MCP tool errors', async () => {
      mockCallTool.mockResolvedValueOnce(
        makeErrorResult('Variable not found'),
      );
      const updates = [{ variableId: 'VariableID:1:1', modeId: '1:0', value: 0 }];
      await expect(client.batchUpdateVariables(updates)).rejects.toThrow(
        /MCP tool "figma_batch_update_variables" failed/,
      );
    });
  });

  // -------------------------------------------------------------------------
  // getVariables
  // -------------------------------------------------------------------------

  describe('getVariables', () => {
    beforeEach(async () => {
      await client.connect();
    });

    it('returns variables from array response', async () => {
      const vars = [makeVariable('space/100'), makeVariable('space/200')];
      mockCallTool.mockResolvedValueOnce(makeToolResult(vars));

      const result = await client.getVariables(FILE_KEY);
      expect(result).toEqual(vars);
    });

    it('returns variables from object response with tokens property', async () => {
      const tokenData = [{ name: 'color/primary', resolvedType: 'COLOR', valuesByMode: { light: '#FF0000' }, id: 'VariableID:1:0', collectionId: 'VariableCollectionId:1:0' }];
      mockCallTool.mockResolvedValueOnce(
        makeToolResult({ tokens: tokenData }),
      );

      const result = await client.getVariables(FILE_KEY);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('color/primary');
    });

    it('returns empty array for unexpected response shape', async () => {
      mockCallTool.mockResolvedValueOnce(makeToolResult('unexpected'));

      const result = await client.getVariables(FILE_KEY);
      expect(result).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // execute (Plugin API)
  // -------------------------------------------------------------------------

  describe('execute', () => {
    beforeEach(async () => {
      await client.connect();
    });

    it('calls figma_execute with file key and code', async () => {
      const code = `
        const style = figma.createEffectStyle();
        style.name = "shadow.elevation200";
      `;
      await client.execute(FILE_KEY, code);

      expect(mockCallTool).toHaveBeenCalledWith({
        name: 'figma_execute',
        arguments: { fileKey: FILE_KEY, code },
      });
    });

    it('returns the execution result', async () => {
      mockCallTool.mockResolvedValueOnce(
        makeToolResult({ created: true, styleId: 'S:abc123' }),
      );

      const result = await client.execute(FILE_KEY, 'figma.createEffectStyle()');
      expect(result).toEqual({ created: true, styleId: 'S:abc123' });
    });

    it('propagates Plugin API execution errors', async () => {
      mockCallTool.mockResolvedValueOnce(
        makeErrorResult('Plugin execution failed: TypeError'),
      );
      await expect(client.execute(FILE_KEY, 'bad code')).rejects.toThrow(
        /MCP tool "figma_execute" failed.*Plugin execution failed/,
      );
    });
  });

  // -------------------------------------------------------------------------
  // setupDesignTokens
  // -------------------------------------------------------------------------

  describe('setupDesignTokens', () => {
    beforeEach(async () => {
      await client.connect();
    });

    it('calls figma_setup_design_tokens with correct payload', async () => {
      const payload = {
        collections: [
          {
            name: 'Primitives',
            modes: ['light', 'dark'],
            variables: [makeVariable('space/100', 8)],
          },
        ],
      };

      await client.setupDesignTokens(FILE_KEY, payload);

      expect(mockCallTool).toHaveBeenCalledWith({
        name: 'figma_setup_design_tokens',
        arguments: {
          collectionName: 'Primitives',
          modes: ['light', 'dark'],
          tokens: [
            {
              name: 'space/100',
              resolvedType: 'FLOAT',
              description: 'Token space/100',
              values: { light: 8, dark: 8 },
            },
          ],
        },
      });
    });
  });

  // -------------------------------------------------------------------------
  // Error handling
  // -------------------------------------------------------------------------

  describe('error handling', () => {
    beforeEach(async () => {
      await client.connect();
    });

    it('handles network/connection errors during tool calls', async () => {
      mockCallTool.mockRejectedValueOnce(new Error('Connection reset'));
      await expect(client.batchCreateVariables('VariableCollectionId:1:2', [makeVariable('x')])).rejects.toThrow(
        'Connection reset',
      );
    });

    it('handles MCP tool error with empty content', async () => {
      mockCallTool.mockResolvedValueOnce({ isError: true, content: [] });
      await expect(client.execute(FILE_KEY, 'code')).rejects.toThrow(
        /Unknown MCP tool error/,
      );
    });

    it('can reconnect after disconnect', async () => {
      await client.disconnect();
      // Reset the mock so connect works again
      mockConnect.mockResolvedValueOnce(undefined);
      await client.connect();
      await client.getVariables(FILE_KEY);
      expect(mockCallTool).toHaveBeenCalled();
    });
  });
});
