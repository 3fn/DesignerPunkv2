/**
 * Tests for DesignExtractor.readTokenBindings() — Task 3.3
 *
 * Validates token binding reading via figma-console-mcp, alias detection,
 * collection name resolution, and edge case handling.
 *
 * @spec 054b-figma-design-extract
 * @requirements Req 1, Req 2
 */

import { DesignExtractor } from '../DesignExtractor';
import type { KiroFigmaPowerClient } from '../DesignExtractor';
import type { ConsoleMCPClient } from '../ConsoleMCPClient';
import type { TokenTranslator } from '../TokenTranslator';
import type { VariantAnalyzer } from '../VariantAnalyzer';

// ---------------------------------------------------------------------------
// Mock factories
// ---------------------------------------------------------------------------

function makeMockConsoleMcp(): jest.Mocked<ConsoleMCPClient> {
  return {
    batchCreateVariables: jest.fn().mockResolvedValue(undefined),
    batchUpdateVariables: jest.fn().mockResolvedValue(undefined),
    createVariableAliases: jest.fn().mockResolvedValue(undefined),
    getVariables: jest.fn().mockResolvedValue([]),
    execute: jest.fn().mockResolvedValue(undefined),
    setupDesignTokens: jest.fn().mockResolvedValue(undefined),
    getStatus: jest.fn().mockResolvedValue({}),
    getStyles: jest.fn().mockResolvedValue([]),
    getComponent: jest.fn().mockResolvedValue({}),
  };
}

const stubTranslator = {} as TokenTranslator;
const stubAnalyzer = {} as VariantAnalyzer;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DesignExtractor.readTokenBindings', () => {
  const FILE_KEY = 'test-file-key';

  it('returns empty array when getVariables returns empty', async () => {
    const mcp = makeMockConsoleMcp();
    mcp.getVariables.mockResolvedValue([]);
    const extractor = new DesignExtractor(mcp, stubTranslator, stubAnalyzer);

    const result = await extractor.readTokenBindings(FILE_KEY);

    expect(result).toEqual([]);
    expect(mcp.getVariables).toHaveBeenCalledWith(FILE_KEY);
  });

  it('maps primitive variables to TokenBinding with correct fields', async () => {
    const mcp = makeMockConsoleMcp();
    mcp.getVariables.mockResolvedValue([
      {
        name: 'space/100',
        resolvedType: 'FLOAT',
        valuesByMode: { 'Mode 1': 8 },
        id: 'var-1',
        collectionId: 'col-1',
        collectionName: 'Primitives',
      } as any,
    ]);
    const extractor = new DesignExtractor(mcp, stubTranslator, stubAnalyzer);

    const result = await extractor.readTokenBindings(FILE_KEY);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      variableName: 'space/100',
      variableId: 'var-1',
      collectionName: 'Primitives',
      resolvedType: 'FLOAT',
      valuesByMode: { 'Mode 1': 8 },
      isAlias: false,
      aliasTarget: undefined,
    });
  });

  it('detects alias relationships from valuesByMode aliasOf', async () => {
    const mcp = makeMockConsoleMcp();
    mcp.getVariables.mockResolvedValue([
      {
        name: 'space/100',
        resolvedType: 'FLOAT',
        valuesByMode: { 'Mode 1': 8 },
        id: 'var-prim',
        collectionId: 'col-1',
        collectionName: 'Primitives',
      } as any,
      {
        name: 'color.primary',
        resolvedType: 'COLOR',
        valuesByMode: { 'Mode 1': { aliasOf: 'color/purple/300' } },
        id: 'var-sem',
        collectionId: 'col-2',
        collectionName: 'Semantics',
      } as any,
    ]);
    const extractor = new DesignExtractor(mcp, stubTranslator, stubAnalyzer);

    const result = await extractor.readTokenBindings(FILE_KEY);

    expect(result).toHaveLength(2);

    // Primitive — not an alias
    expect(result[0].isAlias).toBe(false);
    expect(result[0].aliasTarget).toBeUndefined();

    // Semantic — is an alias pointing to the primitive name
    expect(result[1].isAlias).toBe(true);
    expect(result[1].aliasTarget).toBe('color/purple/300');
    expect(result[1].collectionName).toBe('Semantics');
  });

  it('resolves aliasOf by variable ID when aliasOf is an ID', async () => {
    const mcp = makeMockConsoleMcp();
    mcp.getVariables.mockResolvedValue([
      {
        name: 'color/purple/300',
        resolvedType: 'COLOR',
        valuesByMode: { 'Mode 1': '#7C3AED' },
        id: 'var-prim-id',
        collectionId: 'col-1',
        collectionName: 'Primitives',
      } as any,
      {
        name: 'color.primary',
        resolvedType: 'COLOR',
        valuesByMode: { 'Mode 1': { aliasOf: 'var-prim-id' } },
        id: 'var-sem-id',
        collectionId: 'col-2',
        collectionName: 'Semantics',
      } as any,
    ]);
    const extractor = new DesignExtractor(mcp, stubTranslator, stubAnalyzer);

    const result = await extractor.readTokenBindings(FILE_KEY);

    // aliasOf was an ID — should resolve to the variable name
    expect(result[1].isAlias).toBe(true);
    expect(result[1].aliasTarget).toBe('color/purple/300');
  });

  it('infers collection name when not provided by MCP', async () => {
    const mcp = makeMockConsoleMcp();
    mcp.getVariables.mockResolvedValue([
      {
        name: 'space/300',
        resolvedType: 'FLOAT',
        valuesByMode: { 'Mode 1': 24 },
        id: 'var-1',
      },
      {
        name: 'color.feedback.success.text',
        resolvedType: 'COLOR',
        valuesByMode: { 'Mode 1': { aliasOf: 'color/green/500' } },
        id: 'var-2',
      },
    ]);
    const extractor = new DesignExtractor(mcp, stubTranslator, stubAnalyzer);

    const result = await extractor.readTokenBindings(FILE_KEY);

    // Slash notation → inferred as Primitives
    expect(result[0].collectionName).toBe('Primitives');
    // Dot notation + alias → inferred as Semantics
    expect(result[1].collectionName).toBe('Semantics');
  });

  it('handles multiple mode values correctly', async () => {
    const mcp = makeMockConsoleMcp();
    mcp.getVariables.mockResolvedValue([
      {
        name: 'color/purple/300',
        resolvedType: 'COLOR',
        valuesByMode: {
          'Light': '#7C3AED',
          'Dark': '#A78BFA',
        },
        id: 'var-1',
        collectionId: 'col-1',
        collectionName: 'Primitives',
      } as any,
    ]);
    const extractor = new DesignExtractor(mcp, stubTranslator, stubAnalyzer);

    const result = await extractor.readTokenBindings(FILE_KEY);

    expect(result[0].valuesByMode).toEqual({
      'Light': '#7C3AED',
      'Dark': '#A78BFA',
    });
  });

  it('handles variables with missing id gracefully', async () => {
    const mcp = makeMockConsoleMcp();
    mcp.getVariables.mockResolvedValue([
      {
        name: 'radius/100',
        resolvedType: 'FLOAT',
        valuesByMode: { 'Mode 1': 4 },
        // no id, no collectionId, no collectionName
      },
    ]);
    const extractor = new DesignExtractor(mcp, stubTranslator, stubAnalyzer);

    const result = await extractor.readTokenBindings(FILE_KEY);

    expect(result).toHaveLength(1);
    expect(result[0].variableId).toBe('');
    expect(result[0].collectionName).toBe('Primitives');
  });

  it('maps a realistic set of mixed primitives and semantics', async () => {
    const mcp = makeMockConsoleMcp();
    mcp.getVariables.mockResolvedValue([
      {
        name: 'space/100',
        resolvedType: 'FLOAT',
        valuesByMode: { 'Mode 1': 8 },
        id: 'v1',
        collectionName: 'Primitives',
      } as any,
      {
        name: 'space/200',
        resolvedType: 'FLOAT',
        valuesByMode: { 'Mode 1': 16 },
        id: 'v2',
        collectionName: 'Primitives',
      } as any,
      {
        name: 'color/purple/300',
        resolvedType: 'COLOR',
        valuesByMode: { 'Light': '#7C3AED', 'Dark': '#A78BFA' },
        id: 'v3',
        collectionName: 'Primitives',
      } as any,
      {
        name: 'color.primary',
        resolvedType: 'COLOR',
        valuesByMode: { 'Light': { aliasOf: 'v3' }, 'Dark': { aliasOf: 'v3' } },
        id: 'v4',
        collectionName: 'Semantics',
      } as any,
    ]);
    const extractor = new DesignExtractor(mcp, stubTranslator, stubAnalyzer);

    const result = await extractor.readTokenBindings(FILE_KEY);

    expect(result).toHaveLength(4);

    // Primitives
    expect(result[0].isAlias).toBe(false);
    expect(result[1].isAlias).toBe(false);
    expect(result[2].isAlias).toBe(false);

    // Semantic alias resolves ID to name
    expect(result[3].isAlias).toBe(true);
    expect(result[3].aliasTarget).toBe('color/purple/300');
    expect(result[3].collectionName).toBe('Semantics');
  });
});
