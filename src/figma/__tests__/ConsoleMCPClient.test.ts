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
    type: 'FLOAT',
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
      await expect(client.getVariables(FILE_KEY)).rejects.toThrow(
        'ConsoleMCPClient is not connected',
      );
    });

    it('disconnects and cleans up', async () => {
      await client.connect();
      await client.disconnect();
      expect(mockClose).toHaveBeenCalledTimes(1);
      // After disconnect, calls should fail
      await expect(client.getVariables(FILE_KEY)).rejects.toThrow(
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

    it('calls figma_batch_create_variables with correct arguments', async () => {
      const vars = [makeVariable('space/100', 8), makeVariable('space/200', 16)];
      await client.batchCreateVariables(FILE_KEY, vars);

      expect(mockCallTool).toHaveBeenCalledWith({
        name: 'figma_batch_create_variables',
        arguments: {
          fileKey: FILE_KEY,
          variables: vars.map((v) => ({
            name: v.name,
            type: v.type,
            valuesByMode: v.valuesByMode,
            description: v.description,
          })),
        },
      });
    });

    it('propagates MCP tool errors', async () => {
      mockCallTool.mockResolvedValueOnce(
        makeErrorResult('Rate limit exceeded (429)'),
      );
      await expect(client.batchCreateVariables(FILE_KEY, [makeVariable('x')])).rejects.toThrow(
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

    it('calls figma_batch_update_variables with correct arguments', async () => {
      const vars = [makeVariable('space/100', 12)];
      await client.batchUpdateVariables(FILE_KEY, vars);

      expect(mockCallTool).toHaveBeenCalledWith({
        name: 'figma_batch_update_variables',
        arguments: {
          fileKey: FILE_KEY,
          variables: [
            {
              name: 'space/100',
              type: 'FLOAT',
              valuesByMode: { light: 12, dark: 12 },
              description: 'Token space/100',
            },
          ],
        },
      });
    });

    it('propagates MCP tool errors', async () => {
      mockCallTool.mockResolvedValueOnce(
        makeErrorResult('Variable not found'),
      );
      await expect(client.batchUpdateVariables(FILE_KEY, [makeVariable('x')])).rejects.toThrow(
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

    it('returns variables from object response with variables property', async () => {
      const vars = [makeVariable('color/primary')];
      mockCallTool.mockResolvedValueOnce(
        makeToolResult({ variables: vars }),
      );

      const result = await client.getVariables(FILE_KEY);
      expect(result).toEqual(vars);
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
          fileKey: FILE_KEY,
          collections: [
            {
              name: 'Primitives',
              modes: ['light', 'dark'],
              variables: [
                {
                  name: 'space/100',
                  type: 'FLOAT',
                  valuesByMode: { light: 8, dark: 8 },
                  description: 'Token space/100',
                },
              ],
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
      await expect(client.batchCreateVariables(FILE_KEY, [makeVariable('x')])).rejects.toThrow(
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
