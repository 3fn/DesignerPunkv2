/**
 * Tests for DesignExtractor bound variable batch resolution — Task 1.5
 *
 * Validates collectBoundVariableIds, batchResolveBoundVariables, and
 * reclassifyWithResolvedBindings methods.
 *
 * @spec 054d-hierarchical-design-extraction
 * @requirements Req 4 (Bound Variable Batch Resolution)
 */

import { DesignExtractor } from '../DesignExtractor';
import type { BoundVariableEntry } from '../DesignExtractor';
import type { ConsoleMCPClient } from '../ConsoleMCPClient';
import type { TokenTranslator } from '../TokenTranslator';
import type { VariantAnalyzer } from '../VariantAnalyzer';
import type { NodeWithClassifications } from '../ComponentAnalysis';

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
  } as unknown as jest.Mocked<ConsoleMCPClient>;
}

function makeMockTranslator(): jest.Mocked<TokenTranslator> {
  return {
    translate: jest.fn().mockReturnValue({
      token: 'space.300',
      confidence: 'exact',
      matchMethod: 'binding',
      rawValue: '24',
      primitive: 'space.300',
    }),
    translateByBinding: jest.fn(),
    translateByValue: jest.fn(),
    enrichResponse: jest.fn(),
    lookupToken: jest.fn(),
    getDtcgTokens: jest.fn().mockReturnValue({}),
    classifyTokenMatch: jest.fn().mockReturnValue('primitive'),
    toClassifiedToken: jest.fn().mockReturnValue({
      property: 'padding-top',
      primitiveToken: 'space.300',
      rawValue: 24,
      matchMethod: 'binding',
      confidence: 'exact',
    }),
    toUnidentifiedValue: jest.fn().mockReturnValue({
      property: 'fill',
      rawValue: 'rgba(255, 0, 0, 1)',
      reason: 'no-token-match',
    }),
  } as unknown as jest.Mocked<TokenTranslator>;
}

const stubAnalyzer = {} as VariantAnalyzer;

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeNode(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    id: '1:1',
    name: 'TestNode',
    type: 'FRAME',
    ...overrides,
  };
}

function makeClassifiedNode(
  overrides: Partial<NodeWithClassifications> = {},
): NodeWithClassifications {
  return {
    id: '1:1',
    name: 'TestNode',
    type: 'FRAME',
    depth: 0,
    ancestorChain: [],
    tokenClassifications: {
      semanticIdentified: [],
      primitiveIdentified: [],
      unidentified: [],
    },
    children: [],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// collectBoundVariableIds
// ---------------------------------------------------------------------------

describe('DesignExtractor.collectBoundVariableIds', () => {
  let extractor: DesignExtractor;

  beforeEach(() => {
    extractor = new DesignExtractor(
      makeMockConsoleMcp(),
      makeMockTranslator(),
      stubAnalyzer,
    );
  });

  it('collects IDs from spacing, radius, and fill properties', () => {
    const node = makeNode({
      paddingTop: 16,
      paddingLeft: 8,
      cornerRadius: 12,
      boundVariables: {
        paddingTop: { id: 'VariableID:1:100' },
        paddingLeft: { id: 'VariableID:1:101' },
        cornerRadius: { id: 'VariableID:1:102' },
      },
      fills: [
        {
          type: 'SOLID',
          color: { r: 1, g: 0, b: 0, a: 1 },
          boundVariables: {
            color: { id: 'VariableID:1:103' },
          },
        },
      ],
    });

    const entries = extractor.collectBoundVariableIds(node);

    expect(entries).toHaveLength(4);
    const ids = entries.map(e => e.variableId);
    expect(ids).toContain('VariableID:1:100');
    expect(ids).toContain('VariableID:1:101');
    expect(ids).toContain('VariableID:1:102');
    expect(ids).toContain('VariableID:1:103');

    // Verify categories
    const spacingEntry = entries.find(e => e.variableId === 'VariableID:1:100');
    expect(spacingEntry!.category).toBe('spacing');
    expect(spacingEntry!.property).toBe('padding-top');

    const radiusEntry = entries.find(e => e.variableId === 'VariableID:1:102');
    expect(radiusEntry!.category).toBe('radius');
    expect(radiusEntry!.property).toBe('border-radius');

    const fillEntry = entries.find(e => e.variableId === 'VariableID:1:103');
    expect(fillEntry!.category).toBe('color');
    expect(fillEntry!.property).toBe('fill');
  });

  it('preserves node context (nodeId, nodeName, ancestorChain)', () => {
    const node = makeNode({
      id: '42:99',
      name: 'MyButton',
      paddingTop: 8,
      boundVariables: {
        paddingTop: { id: 'VariableID:1:200' },
      },
    });

    const entries = extractor.collectBoundVariableIds(node, 2, ['COMPONENT_SET', 'COMPONENT']);

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      variableId: 'VariableID:1:200',
      property: 'padding-top',
      nodeId: '42:99',
      nodeName: 'MyButton',
      ancestorChain: ['COMPONENT_SET', 'COMPONENT'],
      rawValue: 8,
      category: 'spacing',
    });
  });

  it('recurses into children at multiple depths', () => {
    const node = makeNode({
      id: '1:1',
      name: 'Root',
      type: 'COMPONENT_SET',
      children: [
        makeNode({
          id: '1:2',
          name: 'Child',
          type: 'COMPONENT',
          paddingTop: 16,
          boundVariables: {
            paddingTop: { id: 'VariableID:2:1' },
          },
          children: [
            makeNode({
              id: '1:3',
              name: 'GrandChild',
              type: 'FRAME',
              cornerRadius: 4,
              boundVariables: {
                cornerRadius: { id: 'VariableID:3:1' },
              },
            }),
          ],
        }),
      ],
    });

    const entries = extractor.collectBoundVariableIds(node);

    expect(entries).toHaveLength(2);
    const childEntry = entries.find(e => e.variableId === 'VariableID:2:1');
    expect(childEntry!.nodeId).toBe('1:2');
    expect(childEntry!.ancestorChain).toEqual(['COMPONENT_SET']);

    const grandChildEntry = entries.find(e => e.variableId === 'VariableID:3:1');
    expect(grandChildEntry!.nodeId).toBe('1:3');
    expect(grandChildEntry!.ancestorChain).toEqual(['COMPONENT_SET', 'COMPONENT']);
  });

  it('handles nodes with no bound variables', () => {
    const node = makeNode({
      paddingTop: 16,
      cornerRadius: 8,
      fills: [{ type: 'SOLID', color: { r: 1, g: 0, b: 0, a: 1 } }],
    });

    const entries = extractor.collectBoundVariableIds(node);
    expect(entries).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// batchResolveBoundVariables
// ---------------------------------------------------------------------------

describe('DesignExtractor.batchResolveBoundVariables', () => {
  let mockMcp: jest.Mocked<ConsoleMCPClient>;
  let extractor: DesignExtractor;

  beforeEach(() => {
    mockMcp = makeMockConsoleMcp();
    extractor = new DesignExtractor(mockMcp, makeMockTranslator(), stubAnalyzer);
  });

  it('returns empty when no entries provided', async () => {
    const result = await extractor.batchResolveBoundVariables('file-key', []);

    expect(result.resolved.size).toBe(0);
    expect(result.unresolvedBindings).toEqual([]);
    expect(mockMcp.execute).not.toHaveBeenCalled();
  });

  it('resolves all IDs successfully', async () => {
    const entries: BoundVariableEntry[] = [
      {
        variableId: 'VariableID:1:100',
        property: 'padding-top',
        nodeId: '1:1',
        nodeName: 'Frame',
        ancestorChain: [],
        rawValue: 16,
        category: 'spacing',
      },
      {
        variableId: 'VariableID:1:101',
        property: 'fill',
        nodeId: '1:2',
        nodeName: 'Fill',
        ancestorChain: ['FRAME'],
        rawValue: 'rgba(255, 0, 0, 1)',
        category: 'color',
      },
    ];

    mockMcp.execute.mockResolvedValueOnce({
      'VariableID:1:100': { name: 'space/200' },
      'VariableID:1:101': { name: 'color/primary/500' },
    });

    const result = await extractor.batchResolveBoundVariables('file-key', entries);

    expect(result.resolved.size).toBe(2);
    expect(result.resolved.get('VariableID:1:100')).toBe('space/200');
    expect(result.resolved.get('VariableID:1:101')).toBe('color/primary/500');
    expect(result.unresolvedBindings).toEqual([]);
  });

  it('returns unresolvedBindings for IDs that fail to resolve', async () => {
    const entries: BoundVariableEntry[] = [
      {
        variableId: 'VariableID:1:100',
        property: 'padding-top',
        nodeId: '1:1',
        nodeName: 'Frame',
        ancestorChain: [],
        rawValue: 16,
        category: 'spacing',
      },
      {
        variableId: 'VariableID:1:999',
        property: 'fill',
        nodeId: '1:2',
        nodeName: 'Fill',
        ancestorChain: ['FRAME'],
        rawValue: 'rgba(255, 0, 0, 1)',
        category: 'color',
      },
    ];

    // Only one resolves
    mockMcp.execute.mockResolvedValueOnce({
      'VariableID:1:100': { name: 'space/200' },
    });

    const result = await extractor.batchResolveBoundVariables('file-key', entries);

    expect(result.resolved.size).toBe(1);
    expect(result.resolved.get('VariableID:1:100')).toBe('space/200');
    expect(result.unresolvedBindings).toHaveLength(1);
    expect(result.unresolvedBindings[0]).toMatchObject({
      variableId: 'VariableID:1:999',
      property: 'fill',
      nodeId: '1:2',
      nodeName: 'Fill',
      ancestorChain: ['FRAME'],
      reason: 'api-resolution-failed',
    });
  });

  it('deduplicates variable IDs before API call', async () => {
    const entries: BoundVariableEntry[] = [
      {
        variableId: 'VariableID:1:100',
        property: 'padding-top',
        nodeId: '1:1',
        nodeName: 'Frame1',
        ancestorChain: [],
        rawValue: 16,
        category: 'spacing',
      },
      {
        variableId: 'VariableID:1:100',
        property: 'padding-bottom',
        nodeId: '1:2',
        nodeName: 'Frame2',
        ancestorChain: [],
        rawValue: 16,
        category: 'spacing',
      },
    ];

    mockMcp.execute.mockResolvedValueOnce({
      'VariableID:1:100': { name: 'space/200' },
    });

    const result = await extractor.batchResolveBoundVariables('file-key', entries);

    // Verify the Plugin API code only contains the ID once
    expect(mockMcp.execute).toHaveBeenCalledTimes(1);
    const codeArg = mockMcp.execute.mock.calls[0][1];
    const idMatches = (codeArg as string).match(/VariableID:1:100/g);
    expect(idMatches).toHaveLength(1);

    expect(result.resolved.size).toBe(1);
    expect(result.unresolvedBindings).toEqual([]);
  });

  it('handles API failure gracefully (returns all as unresolved)', async () => {
    const entries: BoundVariableEntry[] = [
      {
        variableId: 'VariableID:1:100',
        property: 'padding-top',
        nodeId: '1:1',
        nodeName: 'Frame',
        ancestorChain: ['COMPONENT'],
        rawValue: 16,
        category: 'spacing',
      },
    ];

    mockMcp.execute.mockRejectedValueOnce(new Error('Plugin API unavailable'));

    const result = await extractor.batchResolveBoundVariables('file-key', entries);

    expect(result.resolved.size).toBe(0);
    expect(result.unresolvedBindings).toHaveLength(1);
    expect(result.unresolvedBindings[0]).toMatchObject({
      variableId: 'VariableID:1:100',
      property: 'padding-top',
      nodeId: '1:1',
      nodeName: 'Frame',
      ancestorChain: ['COMPONENT'],
      reason: 'api-resolution-failed',
    });
  });
});

// ---------------------------------------------------------------------------
// reclassifyWithResolvedBindings
// ---------------------------------------------------------------------------

describe('DesignExtractor.reclassifyWithResolvedBindings', () => {
  let mockTranslator: jest.Mocked<TokenTranslator>;
  let extractor: DesignExtractor;

  beforeEach(() => {
    mockTranslator = makeMockTranslator();
    extractor = new DesignExtractor(
      makeMockConsoleMcp(),
      mockTranslator,
      stubAnalyzer,
    );
  });

  it('moves resolved bindings from unidentified to semantic/primitive', () => {
    // First call: classify as semantic
    mockTranslator.classifyTokenMatch.mockReturnValueOnce('semantic');
    mockTranslator.toClassifiedToken.mockReturnValueOnce({
      property: 'padding-top',
      semanticToken: 'semanticSpace.inset.200',
      primitiveToken: 'space.200',
      rawValue: 16,
      matchMethod: 'binding',
      confidence: 'exact',
    });

    const nodeTree = makeClassifiedNode({
      tokenClassifications: {
        semanticIdentified: [],
        primitiveIdentified: [],
        unidentified: [
          {
            property: 'padding-top',
            rawValue: 16,
            reason: 'unresolved-binding',
            boundVariableId: 'VariableID:1:100',
          },
        ],
      },
    });

    const resolvedMap = new Map([['VariableID:1:100', 'space/200']]);

    extractor.reclassifyWithResolvedBindings(nodeTree, resolvedMap);

    expect(nodeTree.tokenClassifications.semanticIdentified).toHaveLength(1);
    expect(nodeTree.tokenClassifications.semanticIdentified[0].semanticToken).toBe(
      'semanticSpace.inset.200',
    );
    expect(nodeTree.tokenClassifications.unidentified).toHaveLength(0);
  });

  it('preserves already-classified tokens', () => {
    const existingSemantic = {
      property: 'item-spacing',
      semanticToken: 'semanticSpace.gap.100',
      primitiveToken: 'space.100',
      rawValue: 8,
      matchMethod: 'binding' as const,
      confidence: 'exact' as const,
    };

    const existingPrimitive = {
      property: 'border-radius',
      primitiveToken: 'radius.100',
      rawValue: 4,
      matchMethod: 'value' as const,
      confidence: 'exact' as const,
    };

    const nodeTree = makeClassifiedNode({
      tokenClassifications: {
        semanticIdentified: [existingSemantic],
        primitiveIdentified: [existingPrimitive],
        unidentified: [],
      },
    });

    const resolvedMap = new Map<string, string>();

    extractor.reclassifyWithResolvedBindings(nodeTree, resolvedMap);

    expect(nodeTree.tokenClassifications.semanticIdentified).toHaveLength(1);
    expect(nodeTree.tokenClassifications.semanticIdentified[0]).toBe(existingSemantic);
    expect(nodeTree.tokenClassifications.primitiveIdentified).toHaveLength(1);
    expect(nodeTree.tokenClassifications.primitiveIdentified[0]).toBe(existingPrimitive);
  });

  it('recurses into children', () => {
    mockTranslator.classifyTokenMatch.mockReturnValue('primitive');
    mockTranslator.toClassifiedToken.mockReturnValue({
      property: 'padding-top',
      primitiveToken: 'space.200',
      rawValue: 16,
      matchMethod: 'binding',
      confidence: 'exact',
    });

    const childNode = makeClassifiedNode({
      id: '1:2',
      name: 'Child',
      depth: 1,
      ancestorChain: ['FRAME'],
      tokenClassifications: {
        semanticIdentified: [],
        primitiveIdentified: [],
        unidentified: [
          {
            property: 'padding-top',
            rawValue: 16,
            reason: 'unresolved-binding',
            boundVariableId: 'VariableID:1:200',
          },
        ],
      },
    });

    const nodeTree = makeClassifiedNode({
      children: [childNode],
    });

    const resolvedMap = new Map([['VariableID:1:200', 'space/200']]);

    extractor.reclassifyWithResolvedBindings(nodeTree, resolvedMap);

    expect(childNode.tokenClassifications.primitiveIdentified).toHaveLength(1);
    expect(childNode.tokenClassifications.unidentified).toHaveLength(0);
  });

  it('leaves truly unresolved values as unidentified', () => {
    const nodeTree = makeClassifiedNode({
      tokenClassifications: {
        semanticIdentified: [],
        primitiveIdentified: [],
        unidentified: [
          {
            property: 'fill',
            rawValue: 'rgba(255, 0, 0, 1)',
            reason: 'no-token-match',
            // No boundVariableId — not a binding issue
          },
          {
            property: 'padding-top',
            rawValue: 16,
            reason: 'unresolved-binding',
            boundVariableId: 'VariableID:1:999',
            // This ID is NOT in the resolvedMap
          },
        ],
      },
    });

    const resolvedMap = new Map([['VariableID:1:100', 'space/200']]);

    extractor.reclassifyWithResolvedBindings(nodeTree, resolvedMap);

    expect(nodeTree.tokenClassifications.unidentified).toHaveLength(2);
    expect(nodeTree.tokenClassifications.semanticIdentified).toHaveLength(0);
    expect(nodeTree.tokenClassifications.primitiveIdentified).toHaveLength(0);
  });
});
