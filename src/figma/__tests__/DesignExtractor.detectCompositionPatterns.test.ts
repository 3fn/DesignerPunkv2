/**
 * Tests for DesignExtractor.detectCompositionPatterns() — Task 1.4
 *
 * Validates composition pattern detection: grouping by component name,
 * shared property detection, property variation grouping, multi-level
 * recursive detection, and edge cases.
 *
 * @spec 054d-hierarchical-design-extraction
 * @requirements Req 3 (Composition Pattern Detection)
 */

import { DesignExtractor } from '../DesignExtractor';
import type { ConsoleMCPClient } from '../ConsoleMCPClient';
import type { TokenTranslator } from '../TokenTranslator';
import type { VariantAnalyzer } from '../VariantAnalyzer';
import type { NodeWithClassifications } from '../ComponentAnalysis';

// ---------------------------------------------------------------------------
// Mock factories (same pattern as buildNodeTree tests)
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
// Helper: build a minimal NodeWithClassifications
// ---------------------------------------------------------------------------

function makeNode(
  overrides: Partial<NodeWithClassifications> & { id: string; name: string },
): NodeWithClassifications {
  return {
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

function makeInstance(
  overrides: Partial<NodeWithClassifications> & { id: string; name: string },
): NodeWithClassifications {
  return makeNode({ type: 'INSTANCE', ...overrides });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DesignExtractor.detectCompositionPatterns', () => {
  let extractor: DesignExtractor;

  beforeEach(() => {
    extractor = new DesignExtractor(
      makeMockConsoleMcp(),
      makeMockTranslator(),
      makeMockAnalyzer(),
    );
  });

  // -----------------------------------------------------------------------
  // 1. No patterns — single instances or no INSTANCE children
  // -----------------------------------------------------------------------

  it('returns empty array when node has no children', () => {
    const root = makeNode({ id: '1:0', name: 'Root' });
    const result = extractor.detectCompositionPatterns(root);
    expect(result).toEqual([]);
  });

  it('returns empty array when no INSTANCE children exist', () => {
    const root = makeNode({
      id: '1:0',
      name: 'Root',
      children: [
        makeNode({ id: '2:0', name: 'Frame A', type: 'FRAME' }),
        makeNode({ id: '2:1', name: 'Frame B', type: 'FRAME' }),
      ],
    });
    const result = extractor.detectCompositionPatterns(root);
    expect(result).toEqual([]);
  });

  it('returns empty array when each INSTANCE has a unique name', () => {
    const root = makeNode({
      id: '1:0',
      name: 'Root',
      children: [
        makeInstance({ id: '2:0', name: 'Button', depth: 1 }),
        makeInstance({ id: '2:1', name: 'Icon', depth: 1 }),
        makeInstance({ id: '2:2', name: 'Badge', depth: 1 }),
      ],
    });
    const result = extractor.detectCompositionPatterns(root);
    expect(result).toEqual([]);
  });

  // -----------------------------------------------------------------------
  // 2. Identical instances — all properties shared
  // -----------------------------------------------------------------------

  it('detects identical instances with all properties shared', () => {
    const root = makeNode({
      id: '1:0',
      name: 'Progress / Pagination',
      children: [
        makeInstance({
          id: '2:0',
          name: 'Progress Indicator Primitive',
          depth: 1,
          componentProperties: {
            State: { type: 'VARIANT', value: 'Incomplete' },
            'Show Label': { type: 'BOOLEAN', value: false },
          },
        }),
        makeInstance({
          id: '2:1',
          name: 'Progress Indicator Primitive',
          depth: 1,
          componentProperties: {
            State: { type: 'VARIANT', value: 'Incomplete' },
            'Show Label': { type: 'BOOLEAN', value: false },
          },
        }),
        makeInstance({
          id: '2:2',
          name: 'Progress Indicator Primitive',
          depth: 1,
          componentProperties: {
            State: { type: 'VARIANT', value: 'Incomplete' },
            'Show Label': { type: 'BOOLEAN', value: false },
          },
        }),
      ],
    });

    const result = extractor.detectCompositionPatterns(root);

    expect(result).toHaveLength(1);
    expect(result[0].componentName).toBe('Progress Indicator Primitive');
    expect(result[0].count).toBe(3);
    expect(result[0].sharedProperties).toEqual({
      State: 'Incomplete',
      'Show Label': false,
    });
    // All identical → single variation group with empty properties
    expect(result[0].propertyVariations).toHaveLength(1);
    expect(result[0].propertyVariations[0].properties).toEqual({});
    expect(result[0].propertyVariations[0].count).toBe(3);
    expect(result[0].depth).toBe(1);
  });

  // -----------------------------------------------------------------------
  // 3. Property variations within a group
  // -----------------------------------------------------------------------

  it('detects property variations (different State values)', () => {
    const root = makeNode({
      id: '1:0',
      name: 'Pagination',
      children: [
        makeInstance({
          id: '2:0',
          name: 'Progress Indicator Primitive',
          depth: 1,
          componentProperties: {
            State: { type: 'VARIANT', value: 'Current' },
            Size: { type: 'VARIANT', value: 'Sm' },
            'Show Label': { type: 'BOOLEAN', value: false },
          },
        }),
        makeInstance({
          id: '2:1',
          name: 'Progress Indicator Primitive',
          depth: 1,
          componentProperties: {
            State: { type: 'VARIANT', value: 'Incomplete' },
            Size: { type: 'VARIANT', value: 'Sm' },
            'Show Label': { type: 'BOOLEAN', value: false },
          },
        }),
        makeInstance({
          id: '2:2',
          name: 'Progress Indicator Primitive',
          depth: 1,
          componentProperties: {
            State: { type: 'VARIANT', value: 'Incomplete' },
            Size: { type: 'VARIANT', value: 'Sm' },
            'Show Label': { type: 'BOOLEAN', value: false },
          },
        }),
        makeInstance({
          id: '2:3',
          name: 'Progress Indicator Primitive',
          depth: 1,
          componentProperties: {
            State: { type: 'VARIANT', value: 'Complete' },
            Size: { type: 'VARIANT', value: 'Sm' },
            'Show Label': { type: 'BOOLEAN', value: false },
          },
        }),
      ],
    });

    const result = extractor.detectCompositionPatterns(root);

    expect(result).toHaveLength(1);
    expect(result[0].componentName).toBe('Progress Indicator Primitive');
    expect(result[0].count).toBe(4);
    // Size and Show Label are shared
    expect(result[0].sharedProperties).toEqual({
      Size: 'Sm',
      'Show Label': false,
    });
    // State varies: Current (×1), Incomplete (×2), Complete (×1)
    expect(result[0].propertyVariations).toHaveLength(3);

    const sorted = [...result[0].propertyVariations].sort(
      (a, b) => String(a.properties.State).localeCompare(String(b.properties.State)),
    );
    expect(sorted[0]).toEqual({ properties: { State: 'Complete' }, count: 1 });
    expect(sorted[1]).toEqual({ properties: { State: 'Current' }, count: 1 });
    expect(sorted[2]).toEqual({ properties: { State: 'Incomplete' }, count: 2 });
  });

  // -----------------------------------------------------------------------
  // 4. Multiple patterns at the same level
  // -----------------------------------------------------------------------

  it('detects multiple patterns at the same level', () => {
    const root = makeNode({
      id: '1:0',
      name: 'Dashboard',
      children: [
        makeInstance({ id: '2:0', name: 'Card', depth: 1, componentProperties: { Size: { type: 'VARIANT', value: 'Md' } } }),
        makeInstance({ id: '2:1', name: 'Card', depth: 1, componentProperties: { Size: { type: 'VARIANT', value: 'Md' } } }),
        makeInstance({ id: '2:2', name: 'Badge', depth: 1, componentProperties: { Variant: { type: 'VARIANT', value: 'Info' } } }),
        makeInstance({ id: '2:3', name: 'Badge', depth: 1, componentProperties: { Variant: { type: 'VARIANT', value: 'Warning' } } }),
      ],
    });

    const result = extractor.detectCompositionPatterns(root);

    expect(result).toHaveLength(2);

    const cardPattern = result.find(p => p.componentName === 'Card');
    const badgePattern = result.find(p => p.componentName === 'Badge');

    expect(cardPattern).toBeDefined();
    expect(cardPattern!.count).toBe(2);
    expect(cardPattern!.sharedProperties).toEqual({ Size: 'Md' });

    expect(badgePattern).toBeDefined();
    expect(badgePattern!.count).toBe(2);
    expect(badgePattern!.sharedProperties).toEqual({});
    expect(badgePattern!.propertyVariations).toHaveLength(2);
  });

  // -----------------------------------------------------------------------
  // 5. Multi-level (recursive) pattern detection
  // -----------------------------------------------------------------------

  it('detects patterns at multiple levels of the tree', () => {
    const root = makeNode({
      id: '1:0',
      name: 'Page',
      children: [
        // Level 1: two Card instances (pattern at depth 1)
        makeInstance({
          id: '2:0',
          name: 'Card',
          depth: 1,
          componentProperties: { Size: { type: 'VARIANT', value: 'Lg' } },
          children: [
            // Level 2: three Icon instances inside first Card (pattern at depth 2)
            makeInstance({ id: '3:0', name: 'Icon', depth: 2, componentProperties: { Name: { type: 'TEXT', value: 'star' } } }),
            makeInstance({ id: '3:1', name: 'Icon', depth: 2, componentProperties: { Name: { type: 'TEXT', value: 'heart' } } }),
            makeInstance({ id: '3:2', name: 'Icon', depth: 2, componentProperties: { Name: { type: 'TEXT', value: 'star' } } }),
          ],
        }),
        makeInstance({
          id: '2:1',
          name: 'Card',
          depth: 1,
          componentProperties: { Size: { type: 'VARIANT', value: 'Lg' } },
        }),
      ],
    });

    const result = extractor.detectCompositionPatterns(root);

    // Should find patterns at both levels
    expect(result).toHaveLength(2);

    const cardPattern = result.find(p => p.componentName === 'Card');
    expect(cardPattern).toBeDefined();
    expect(cardPattern!.count).toBe(2);
    expect(cardPattern!.depth).toBe(1);

    const iconPattern = result.find(p => p.componentName === 'Icon');
    expect(iconPattern).toBeDefined();
    expect(iconPattern!.count).toBe(3);
    expect(iconPattern!.depth).toBe(2);
  });

  // -----------------------------------------------------------------------
  // 6. Instances without componentProperties
  // -----------------------------------------------------------------------

  it('handles instances without componentProperties', () => {
    const root = makeNode({
      id: '1:0',
      name: 'Root',
      children: [
        makeInstance({ id: '2:0', name: 'Divider', depth: 1 }),
        makeInstance({ id: '2:1', name: 'Divider', depth: 1 }),
      ],
    });

    const result = extractor.detectCompositionPatterns(root);

    expect(result).toHaveLength(1);
    expect(result[0].componentName).toBe('Divider');
    expect(result[0].count).toBe(2);
    expect(result[0].sharedProperties).toEqual({});
    expect(result[0].propertyVariations).toHaveLength(1);
    expect(result[0].propertyVariations[0]).toEqual({ properties: {}, count: 2 });
  });

  // -----------------------------------------------------------------------
  // 7. Only INSTANCE nodes are grouped (FRAME siblings ignored)
  // -----------------------------------------------------------------------

  it('only groups INSTANCE nodes, ignoring FRAME siblings', () => {
    const root = makeNode({
      id: '1:0',
      name: 'Root',
      children: [
        makeNode({ id: '2:0', name: 'Card', type: 'FRAME', depth: 1 }),
        makeNode({ id: '2:1', name: 'Card', type: 'FRAME', depth: 1 }),
        makeInstance({ id: '2:2', name: 'Card', depth: 1, componentProperties: { Size: { type: 'VARIANT', value: 'Sm' } } }),
      ],
    });

    const result = extractor.detectCompositionPatterns(root);
    // Only 1 INSTANCE named 'Card', so no pattern
    expect(result).toEqual([]);
  });

  // -----------------------------------------------------------------------
  // 8. Deep recursion through non-INSTANCE nodes
  // -----------------------------------------------------------------------

  it('recurses through FRAME nodes to find patterns in nested children', () => {
    const root = makeNode({
      id: '1:0',
      name: 'Root',
      children: [
        makeNode({
          id: '2:0',
          name: 'Wrapper',
          type: 'FRAME',
          depth: 1,
          children: [
            makeInstance({ id: '3:0', name: 'Chip', depth: 2, componentProperties: { Label: { type: 'TEXT', value: 'A' } } }),
            makeInstance({ id: '3:1', name: 'Chip', depth: 2, componentProperties: { Label: { type: 'TEXT', value: 'B' } } }),
          ],
        }),
      ],
    });

    const result = extractor.detectCompositionPatterns(root);

    expect(result).toHaveLength(1);
    expect(result[0].componentName).toBe('Chip');
    expect(result[0].count).toBe(2);
    expect(result[0].depth).toBe(2);
    expect(result[0].sharedProperties).toEqual({});
    expect(result[0].propertyVariations).toHaveLength(2);
  });

  // -----------------------------------------------------------------------
  // 9. Mixed shared and varying properties
  // -----------------------------------------------------------------------

  it('correctly separates shared from varying properties', () => {
    const root = makeNode({
      id: '1:0',
      name: 'Root',
      children: [
        makeInstance({
          id: '2:0',
          name: 'Button',
          depth: 1,
          componentProperties: {
            Variant: { type: 'VARIANT', value: 'Primary' },
            Size: { type: 'VARIANT', value: 'Md' },
            Disabled: { type: 'BOOLEAN', value: false },
            Label: { type: 'TEXT', value: 'Save' },
          },
        }),
        makeInstance({
          id: '2:1',
          name: 'Button',
          depth: 1,
          componentProperties: {
            Variant: { type: 'VARIANT', value: 'Secondary' },
            Size: { type: 'VARIANT', value: 'Md' },
            Disabled: { type: 'BOOLEAN', value: false },
            Label: { type: 'TEXT', value: 'Cancel' },
          },
        }),
      ],
    });

    const result = extractor.detectCompositionPatterns(root);

    expect(result).toHaveLength(1);
    // Size and Disabled are shared
    expect(result[0].sharedProperties).toEqual({
      Size: 'Md',
      Disabled: false,
    });
    // Variant and Label vary
    expect(result[0].propertyVariations).toHaveLength(2);
    const v0 = result[0].propertyVariations.find(
      v => v.properties.Variant === 'Primary',
    );
    expect(v0).toBeDefined();
    expect(v0!.properties.Label).toBe('Save');
    expect(v0!.count).toBe(1);
  });

  // -----------------------------------------------------------------------
  // 10. Exactly 2 instances (minimum threshold)
  // -----------------------------------------------------------------------

  it('detects pattern with exactly 2 instances (minimum threshold)', () => {
    const root = makeNode({
      id: '1:0',
      name: 'Root',
      children: [
        makeInstance({ id: '2:0', name: 'Tag', depth: 1 }),
        makeInstance({ id: '2:1', name: 'Tag', depth: 1 }),
      ],
    });

    const result = extractor.detectCompositionPatterns(root);
    expect(result).toHaveLength(1);
    expect(result[0].count).toBe(2);
  });
});
