/**
 * Tests for DesignExtractor.resolveUnknownVariableIds()
 *
 * Validates that unresolved boundVariable IDs (not found in
 * figma_get_token_values) are batch-resolved via Plugin API
 * (figma_execute) and returned as additional TokenBinding entries.
 *
 * @spec 054b-figma-design-extract
 */

import { DesignExtractor } from '../DesignExtractor';
import type { TokenBinding } from '../DesignExtractor';
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
    getComponentImage: jest.fn().mockResolvedValue({ imageUrl: '' }),
  };
}

function makeMockTranslator(): jest.Mocked<TokenTranslator> {
  return {
    translate: jest.fn(),
    translateByBinding: jest.fn(),
    translateByValue: jest.fn(),
    enrichResponse: jest.fn(),
    lookupToken: jest.fn(),
  } as unknown as jest.Mocked<TokenTranslator>;
}

const stubAnalyzer = {} as VariantAnalyzer;

function makeBinding(overrides: Partial<TokenBinding> = {}): TokenBinding {
  return {
    variableName: 'space/100',
    variableId: 'VariableID:1:0',
    collectionName: 'Primitives',
    resolvedType: 'FLOAT',
    valuesByMode: { 'Mode 1': 8 },
    isAlias: false,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DesignExtractor.resolveUnknownVariableIds', () => {
  let mockMcp: jest.Mocked<ConsoleMCPClient>;
  let extractor: DesignExtractor;

  beforeEach(() => {
    mockMcp = makeMockConsoleMcp();
    extractor = new DesignExtractor(mockMcp, makeMockTranslator(), stubAnalyzer);
  });

  it('returns empty array when boundVariableMap is empty', async () => {
    const result = await extractor.resolveUnknownVariableIds(
      'file-key',
      new Map(),
      [makeBinding()],
    );
    expect(result).toEqual([]);
    expect(mockMcp.execute).not.toHaveBeenCalled();
  });

  it('returns empty array when all IDs are already in bindings', async () => {
    const bvMap = new Map([['paddingLeft', 'VariableID:1:0']]);
    const bindings = [makeBinding({ variableId: 'VariableID:1:0' })];

    const result = await extractor.resolveUnknownVariableIds('file-key', bvMap, bindings);
    expect(result).toEqual([]);
    expect(mockMcp.execute).not.toHaveBeenCalled();
  });

  it('resolves unknown variable IDs via Plugin API', async () => {
    const bvMap = new Map([
      ['color', 'VariableID:1224:14083'],
    ]);
    const bindings = [makeBinding({ variableId: 'VariableID:1:0' })];

    // Simulate Plugin API response
    mockMcp.execute.mockResolvedValueOnce({
      'VariableID:1224:14083': {
        name: 'color/white/500',
        resolvedType: 'COLOR',
        id: 'VariableID:1224:14083',
      },
    });

    const result = await extractor.resolveUnknownVariableIds('file-key', bvMap, bindings);

    expect(mockMcp.execute).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      variableName: 'color/white/500',
      variableId: 'VariableID:1224:14083',
      resolvedType: 'COLOR',
    });
  });

  it('resolves multiple unknown IDs in a single batch call', async () => {
    const bvMap = new Map([
      ['color', 'VariableID:1224:14083'],
      ['paddingLeft', 'VariableID:99:1'],
    ]);
    const bindings: TokenBinding[] = [];

    mockMcp.execute.mockResolvedValueOnce({
      'VariableID:1224:14083': {
        name: 'color/white/500',
        resolvedType: 'COLOR',
        id: 'VariableID:1224:14083',
      },
      'VariableID:99:1': {
        name: 'space/200',
        resolvedType: 'FLOAT',
        id: 'VariableID:99:1',
      },
    });

    const result = await extractor.resolveUnknownVariableIds('file-key', bvMap, bindings);

    expect(mockMcp.execute).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);

    const names = result.map(b => b.variableName).sort();
    expect(names).toEqual(['color/white/500', 'space/200']);
  });

  it('deduplicates variable IDs before resolving', async () => {
    // Same variable ID used for two different properties
    const bvMap = new Map([
      ['paddingLeft', 'VariableID:99:1'],
      ['paddingRight', 'VariableID:99:1'],
    ]);
    const bindings: TokenBinding[] = [];

    mockMcp.execute.mockResolvedValueOnce({
      'VariableID:99:1': {
        name: 'space/100',
        resolvedType: 'FLOAT',
        id: 'VariableID:99:1',
      },
    });

    const result = await extractor.resolveUnknownVariableIds('file-key', bvMap, bindings);

    // Should only resolve once despite two properties using the same ID
    expect(result).toHaveLength(1);
    expect(result[0].variableName).toBe('space/100');

    // Verify the Plugin API code only includes the ID once
    const executeCall = mockMcp.execute.mock.calls[0];
    const code = executeCall[1] as string;
    const idMatches = code.match(/VariableID:99:1/g);
    expect(idMatches).toHaveLength(1);
  });

  it('handles wrapped result format from figma_execute', async () => {
    const bvMap = new Map([['color', 'VariableID:1224:14083']]);
    const bindings: TokenBinding[] = [];

    // figma_execute sometimes wraps result in { result: ... }
    mockMcp.execute.mockResolvedValueOnce({
      result: {
        'VariableID:1224:14083': {
          name: 'color/cyan/500',
          resolvedType: 'COLOR',
          id: 'VariableID:1224:14083',
        },
      },
    });

    const result = await extractor.resolveUnknownVariableIds('file-key', bvMap, bindings);

    expect(result).toHaveLength(1);
    expect(result[0].variableName).toBe('color/cyan/500');
  });

  it('returns empty array when Plugin API call fails', async () => {
    const bvMap = new Map([['color', 'VariableID:1224:14083']]);
    const bindings: TokenBinding[] = [];

    mockMcp.execute.mockRejectedValueOnce(new Error('Plugin execution failed'));

    const result = await extractor.resolveUnknownVariableIds('file-key', bvMap, bindings);

    expect(result).toEqual([]);
  });

  it('skips variables that Plugin API cannot find', async () => {
    const bvMap = new Map([
      ['color', 'VariableID:1224:14083'],
      ['paddingLeft', 'VariableID:999:999'],
    ]);
    const bindings: TokenBinding[] = [];

    // Only one variable resolves; the other is missing from response
    mockMcp.execute.mockResolvedValueOnce({
      'VariableID:1224:14083': {
        name: 'color/white/500',
        resolvedType: 'COLOR',
        id: 'VariableID:1224:14083',
      },
      // VariableID:999:999 not in response (variable not found)
    });

    const result = await extractor.resolveUnknownVariableIds('file-key', bvMap, bindings);

    expect(result).toHaveLength(1);
    expect(result[0].variableName).toBe('color/white/500');
  });

  it('infers collection name from resolved variable name', async () => {
    const bvMap = new Map([
      ['color', 'VariableID:1:1'],
      ['paddingLeft', 'VariableID:2:2'],
    ]);
    const bindings: TokenBinding[] = [];

    mockMcp.execute.mockResolvedValueOnce({
      'VariableID:1:1': {
        name: 'color.primary',  // dot notation → Semantics
        resolvedType: 'COLOR',
        id: 'VariableID:1:1',
      },
      'VariableID:2:2': {
        name: 'space/100',  // slash notation → Primitives
        resolvedType: 'FLOAT',
        id: 'VariableID:2:2',
      },
    });

    const result = await extractor.resolveUnknownVariableIds('file-key', bvMap, bindings);

    const semantic = result.find(b => b.variableName === 'color.primary');
    const primitive = result.find(b => b.variableName === 'space/100');

    expect(semantic?.collectionName).toBe('Semantics');
    expect(primitive?.collectionName).toBe('Primitives');
  });
});
