/**
 * Tests for DesignExtractor.buildNodeTree() — Task 1.3
 *
 * Validates hierarchical node tree construction: parent-child preservation,
 * depth/ancestor tracking, layout extraction, componentProperties extraction,
 * per-node token classification, and recursive children building.
 *
 * @spec 054d-hierarchical-design-extraction
 * @requirements Req 2 (Hierarchical Node Tree Preservation)
 */

import { DesignExtractor } from '../DesignExtractor';
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

function makeMockAnalyzer(): jest.Mocked<VariantAnalyzer> {
  return {
    analyzeVariants: jest.fn(),
    detectConflicts: jest.fn(),
  } as unknown as jest.Mocked<VariantAnalyzer>;
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/** 4+ depth tree: COMPONENT_SET → COMPONENT → INSTANCE → FRAME → TEXT */
const deepTree: Record<string, unknown> = {
  id: '1:1',
  name: 'Progress / Pagination',
  type: 'COMPONENT_SET',
  layoutMode: 'VERTICAL',
  paddingTop: 16,
  paddingRight: 16,
  paddingBottom: 16,
  paddingLeft: 16,
  itemSpacing: 8,
  children: [
    {
      id: '1:2',
      name: 'Property 1=Sm',
      type: 'COMPONENT',
      layoutMode: 'HORIZONTAL',
      itemSpacing: 4,
      cornerRadius: 8,
      children: [
        {
          id: '1:3',
          name: 'Progress Indicator Primitive',
          type: 'INSTANCE',
          componentProperties: {
            'State#123:0': { type: 'VARIANT', value: 'Current' },
            'Show Label': { type: 'BOOLEAN', value: false },
          },
          children: [
            {
              id: '1:4',
              name: 'Track',
              type: 'FRAME',
              cornerRadius: 4,
              fills: [
                {
                  type: 'SOLID',
                  color: { r: 0.576, g: 0.2, b: 0.918, a: 1 },
                  boundVariables: {
                    color: { id: 'VariableID:1224:14083' },
                  },
                },
              ],
              children: [
                {
                  id: '1:5',
                  name: 'Label',
                  type: 'TEXT',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DesignExtractor.buildNodeTree', () => {
  let extractor: DesignExtractor;
  let mockTranslator: jest.Mocked<TokenTranslator>;

  beforeEach(() => {
    mockTranslator = makeMockTranslator();
    extractor = new DesignExtractor(
      makeMockConsoleMcp(),
      mockTranslator,
      makeMockAnalyzer(),
    );
  });

  // -----------------------------------------------------------------------
  // 1. Single node (depth 0)
  // -----------------------------------------------------------------------

  it('builds a single node at depth 0 with correct structure', () => {
    const figmaNode = {
      id: '42:1',
      name: 'MyFrame',
      type: 'FRAME',
      paddingTop: 8,
    };

    const result = extractor.buildNodeTree(figmaNode);

    expect(result.id).toBe('42:1');
    expect(result.name).toBe('MyFrame');
    expect(result.type).toBe('FRAME');
    expect(result.depth).toBe(0);
    expect(result.ancestorChain).toEqual([]);
    expect(result.children).toEqual([]);
  });

  // -----------------------------------------------------------------------
  // 2. Two-level tree — parent with children
  // -----------------------------------------------------------------------

  it('builds a two-level tree with correct depth and ancestor chain', () => {
    const parent = {
      id: '1:0',
      name: 'Parent',
      type: 'COMPONENT',
      children: [
        { id: '2:0', name: 'Child A', type: 'FRAME' },
        { id: '2:1', name: 'Child B', type: 'TEXT' },
      ],
    };

    const result = extractor.buildNodeTree(parent);

    expect(result.depth).toBe(0);
    expect(result.children).toHaveLength(2);

    const childA = result.children[0];
    expect(childA.id).toBe('2:0');
    expect(childA.depth).toBe(1);
    expect(childA.ancestorChain).toEqual(['COMPONENT']);

    const childB = result.children[1];
    expect(childB.id).toBe('2:1');
    expect(childB.type).toBe('TEXT');
    expect(childB.depth).toBe(1);
    expect(childB.ancestorChain).toEqual(['COMPONENT']);
  });

  // -----------------------------------------------------------------------
  // 3. 4+ depth levels — full ancestor chains
  // -----------------------------------------------------------------------

  it('preserves full ancestor chains across 4+ depth levels', () => {
    const result = extractor.buildNodeTree(deepTree);

    // Root: COMPONENT_SET, depth 0
    expect(result.type).toBe('COMPONENT_SET');
    expect(result.depth).toBe(0);
    expect(result.ancestorChain).toEqual([]);

    // Depth 1: COMPONENT
    const component = result.children[0];
    expect(component.type).toBe('COMPONENT');
    expect(component.depth).toBe(1);
    expect(component.ancestorChain).toEqual(['COMPONENT_SET']);

    // Depth 2: INSTANCE
    const instance = component.children[0];
    expect(instance.type).toBe('INSTANCE');
    expect(instance.depth).toBe(2);
    expect(instance.ancestorChain).toEqual(['COMPONENT_SET', 'COMPONENT']);

    // Depth 3: FRAME
    const frame = instance.children[0];
    expect(frame.type).toBe('FRAME');
    expect(frame.depth).toBe(3);
    expect(frame.ancestorChain).toEqual([
      'COMPONENT_SET', 'COMPONENT', 'INSTANCE',
    ]);

    // Depth 4: TEXT
    const text = frame.children[0];
    expect(text.type).toBe('TEXT');
    expect(text.depth).toBe(4);
    expect(text.ancestorChain).toEqual([
      'COMPONENT_SET', 'COMPONENT', 'INSTANCE', 'FRAME',
    ]);
  });

  // -----------------------------------------------------------------------
  // 4. Layout extraction
  // -----------------------------------------------------------------------

  it('extracts layout properties per node', () => {
    const result = extractor.buildNodeTree(deepTree);

    // Root: VERTICAL layout with padding and itemSpacing
    expect(result.layout).toEqual({
      layoutMode: 'VERTICAL',
      padding: { top: 16, right: 16, bottom: 16, left: 16 },
      itemSpacing: 8,
    });

    // COMPONENT: HORIZONTAL layout with itemSpacing and cornerRadius
    const component = result.children[0];
    expect(component.layout).toEqual({
      layoutMode: 'HORIZONTAL',
      itemSpacing: 4,
      cornerRadius: 8,
    });

    // FRAME (Track): cornerRadius only
    const frame = component.children[0].children[0];
    expect(frame.layout).toEqual({
      cornerRadius: 4,
    });
  });

  it('extracts counterAxisSpacing when present', () => {
    const node = {
      id: '1:0',
      name: 'Grid',
      type: 'FRAME',
      layoutMode: 'HORIZONTAL',
      itemSpacing: 8,
      counterAxisSpacing: 12,
    };

    const result = extractor.buildNodeTree(node);
    expect(result.layout).toEqual({
      layoutMode: 'HORIZONTAL',
      itemSpacing: 8,
      counterAxisSpacing: 12,
    });
  });

  // -----------------------------------------------------------------------
  // 5. componentProperties extraction (INSTANCE nodes)
  // -----------------------------------------------------------------------

  it('extracts componentProperties from INSTANCE nodes with hash suffix stripping', () => {
    const result = extractor.buildNodeTree(deepTree);
    const instance = result.children[0].children[0];

    expect(instance.type).toBe('INSTANCE');
    expect(instance.componentProperties).toEqual({
      State: { type: 'VARIANT', value: 'Current' },
      'Show Label': { type: 'BOOLEAN', value: false },
    });
  });

  it('does not extract componentProperties for non-INSTANCE nodes', () => {
    const frame = {
      id: '1:0',
      name: 'Frame',
      type: 'FRAME',
      componentProperties: {
        'SomeProp#1:0': { type: 'VARIANT', value: 'X' },
      },
    };

    const result = extractor.buildNodeTree(frame);
    expect(result.componentProperties).toBeUndefined();
  });

  // -----------------------------------------------------------------------
  // 6. Token classification per node
  // -----------------------------------------------------------------------

  it('classifies tokens per node using translator', () => {
    // Configure translator to return 'semantic' for the first call,
    // 'primitive' for the second, 'unidentified' for the third
    mockTranslator.classifyTokenMatch
      .mockReturnValueOnce('semantic')
      .mockReturnValueOnce('primitive')
      .mockReturnValueOnce('unidentified');

    mockTranslator.toClassifiedToken
      .mockReturnValueOnce({
        property: 'padding-top',
        semanticToken: 'semanticSpace.inset.200',
        primitiveToken: 'space.200',
        rawValue: 16,
        matchMethod: 'binding',
        confidence: 'exact',
      })
      .mockReturnValueOnce({
        property: 'padding-right',
        primitiveToken: 'space.200',
        rawValue: 16,
        matchMethod: 'value',
        confidence: 'exact',
      });

    mockTranslator.toUnidentifiedValue.mockReturnValueOnce({
      property: 'padding-bottom',
      rawValue: 16,
      reason: 'no-token-match',
    });

    const node = {
      id: '1:0',
      name: 'Test',
      type: 'FRAME',
      paddingTop: 16,
      paddingRight: 16,
      paddingBottom: 16,
    };

    const result = extractor.buildNodeTree(node);

    expect(result.tokenClassifications.semanticIdentified).toHaveLength(1);
    expect(result.tokenClassifications.semanticIdentified[0].property).toBe('padding-top');

    expect(result.tokenClassifications.primitiveIdentified).toHaveLength(1);
    expect(result.tokenClassifications.primitiveIdentified[0].property).toBe('padding-right');

    expect(result.tokenClassifications.unidentified).toHaveLength(1);
    expect(result.tokenClassifications.unidentified[0].property).toBe('padding-bottom');
  });

  // -----------------------------------------------------------------------
  // 7. Fill color classification
  // -----------------------------------------------------------------------

  it('classifies fill colors with bound variables', () => {
    mockTranslator.classifyTokenMatch.mockReturnValue('semantic');
    mockTranslator.toClassifiedToken.mockReturnValue({
      property: 'fill',
      semanticToken: 'color.primary',
      primitiveToken: 'color.purple.300',
      rawValue: 'rgba(147, 51, 234, 1)',
      matchMethod: 'binding',
      confidence: 'exact',
    });

    const node = {
      id: '1:0',
      name: 'ColorFrame',
      type: 'FRAME',
      fills: [
        {
          type: 'SOLID',
          color: { r: 0.576, g: 0.2, b: 0.918, a: 1 },
          boundVariables: {
            color: { id: 'VariableID:1224:14083' },
          },
        },
      ],
    };

    const result = extractor.buildNodeTree(node);

    // translate should have been called with the variable ID
    expect(mockTranslator.translate).toHaveBeenCalledWith(
      'VariableID:1224:14083',
      'rgba(147, 51, 234, 1)',
      'color',
    );

    expect(result.tokenClassifications.semanticIdentified).toHaveLength(1);
    expect(result.tokenClassifications.semanticIdentified[0].property).toBe('fill');
  });

  it('classifies fill colors without bound variables', () => {
    mockTranslator.classifyTokenMatch.mockReturnValue('unidentified');
    mockTranslator.toUnidentifiedValue.mockReturnValue({
      property: 'fill',
      rawValue: 'rgba(255, 0, 0, 1)',
      reason: 'no-token-match',
    });

    const node = {
      id: '1:0',
      name: 'RedFrame',
      type: 'FRAME',
      fills: [
        {
          type: 'SOLID',
          color: { r: 1, g: 0, b: 0, a: 1 },
        },
      ],
    };

    const result = extractor.buildNodeTree(node);

    expect(mockTranslator.translate).toHaveBeenCalledWith(
      undefined,
      'rgba(255, 0, 0, 1)',
      'color',
    );

    expect(result.tokenClassifications.unidentified).toHaveLength(1);
  });

  // -----------------------------------------------------------------------
  // 8. Node with no layout
  // -----------------------------------------------------------------------

  it('returns undefined layout when node has no layout properties', () => {
    const node = {
      id: '1:0',
      name: 'Bare',
      type: 'TEXT',
    };

    const result = extractor.buildNodeTree(node);
    expect(result.layout).toBeUndefined();
  });

  // -----------------------------------------------------------------------
  // 9. Unknown node type defaults to FRAME
  // -----------------------------------------------------------------------

  it('defaults unknown node types to FRAME', () => {
    const node = {
      id: '1:0',
      name: 'Vector',
      type: 'VECTOR',
    };

    const result = extractor.buildNodeTree(node);
    expect(result.type).toBe('FRAME');
  });

  it('defaults missing type to FRAME', () => {
    const node = {
      id: '1:0',
      name: 'NoType',
    };

    const result = extractor.buildNodeTree(node);
    expect(result.type).toBe('FRAME');
  });

  // -----------------------------------------------------------------------
  // Layout edge cases
  // -----------------------------------------------------------------------

  it('maps unknown layoutMode values to NONE', () => {
    const node = {
      id: '1:0',
      name: 'Weird',
      type: 'FRAME',
      layoutMode: 'WRAP',
    };

    const result = extractor.buildNodeTree(node);
    expect(result.layout?.layoutMode).toBe('NONE');
  });

  // -----------------------------------------------------------------------
  // Bound variable array format
  // -----------------------------------------------------------------------

  it('handles bound variables in array format', () => {
    mockTranslator.classifyTokenMatch.mockReturnValue('primitive');

    const node = {
      id: '1:0',
      name: 'ArrayBV',
      type: 'FRAME',
      paddingTop: 8,
      boundVariables: {
        paddingTop: [{ id: 'VariableID:100:1' }],
      },
    };

    const result = extractor.buildNodeTree(node);

    expect(mockTranslator.translate).toHaveBeenCalledWith(
      'VariableID:100:1',
      8,
      'spacing',
    );
    expect(result.tokenClassifications.primitiveIdentified).toHaveLength(1);
  });
});
