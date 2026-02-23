/**
 * Tests for DesignExtractor.detectComponentTokenDecisions() — Task 3.10
 *
 * Validates component token decision point detection: repeated primitive
 * token usage identification, illustrative suggestion generation,
 * property group inference, and governance labeling.
 *
 * @spec 054b-figma-design-extract
 * @requirements Req 8 (Component Token Usage Pattern Detection)
 */

import { DesignExtractor } from '../DesignExtractor';
import type { TokenUsage, TokenReference } from '../DesignExtractor';
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

const stubTranslator = {} as TokenTranslator;
const stubAnalyzer = {} as VariantAnalyzer;

function makeRef(overrides: Partial<TokenReference> = {}): TokenReference {
  return {
    property: 'padding-left',
    token: 'space.300',
    confidence: 'exact',
    matchMethod: 'binding',
    ...overrides,
  };
}

function makeEmptyUsage(): TokenUsage {
  return { spacing: [], colors: [], typography: [], radius: [], shadows: [] };
}


// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DesignExtractor.detectComponentTokenDecisions', () => {
  let extractor: DesignExtractor;

  beforeEach(() => {
    extractor = new DesignExtractor(makeMockConsoleMcp(), stubTranslator, stubAnalyzer);
  });

  // -------------------------------------------------------------------------
  // No decisions when no repeated usage
  // -------------------------------------------------------------------------

  describe('no repeated usage', () => {
    it('returns empty array when token usage is empty', () => {
      const usage = makeEmptyUsage();
      const result = extractor.detectComponentTokenDecisions(usage, 'ButtonCTA');
      expect(result).toEqual([]);
    });

    it('returns empty array when each token is used only once', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({ property: 'padding-left', token: 'space.300', primitive: 'space.300' }),
        makeRef({ property: 'padding-top', token: 'space.200', primitive: 'space.200' }),
      ];
      const result = extractor.detectComponentTokenDecisions(usage, 'ButtonCTA');
      expect(result).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // Repeated primitive detection
  // -------------------------------------------------------------------------

  describe('repeated primitive detection', () => {
    it('detects repeated primitive token across spacing properties', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({ property: 'padding-left', token: 'space.300', primitive: 'space.300' }),
        makeRef({ property: 'padding-right', token: 'space.300', primitive: 'space.300' }),
      ];

      const result = extractor.detectComponentTokenDecisions(usage, 'ButtonCTA');

      expect(result).toHaveLength(1);
      expect(result[0].primitiveToken).toBe('space.300');
      expect(result[0].usageCount).toBe(2);
      expect(result[0].locations).toEqual(['padding-left', 'padding-right']);
    });

    it('detects repeated primitive across different categories', () => {
      const usage = makeEmptyUsage();
      usage.colors = [
        makeRef({ property: 'background', token: 'color.primary', primitive: 'color.purple.300' }),
        makeRef({ property: 'border-color', token: 'color.primary', primitive: 'color.purple.300' }),
      ];

      const result = extractor.detectComponentTokenDecisions(usage, 'ButtonCTA');

      expect(result).toHaveLength(1);
      expect(result[0].primitiveToken).toBe('color.purple.300');
      expect(result[0].usageCount).toBe(2);
    });

    it('groups by primitive token, not semantic token', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({ property: 'padding-left', token: 'space.300', primitive: 'space.300', semantic: 'space.inset.normal' }),
        makeRef({ property: 'padding-right', token: 'space.300', primitive: 'space.300', semantic: 'space.inset.normal' }),
        makeRef({ property: 'padding-top', token: 'space.200', primitive: 'space.200' }),
      ];

      const result = extractor.detectComponentTokenDecisions(usage, 'ButtonCTA');

      expect(result).toHaveLength(1);
      expect(result[0].primitiveToken).toBe('space.300');
    });
  });

  // -------------------------------------------------------------------------
  // No-match tokens are excluded
  // -------------------------------------------------------------------------

  describe('no-match exclusion', () => {
    it('ignores no-match tokens even if they share the same token path', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({ property: 'padding-left', token: '', confidence: 'no-match', primitive: undefined }),
        makeRef({ property: 'padding-right', token: '', confidence: 'no-match', primitive: undefined }),
      ];

      const result = extractor.detectComponentTokenDecisions(usage, 'ButtonCTA');
      expect(result).toEqual([]);
    });

    it('counts only matched tokens, not no-match ones', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({ property: 'padding-left', token: 'space.300', primitive: 'space.300' }),
        makeRef({ property: 'padding-right', token: 'space.300', primitive: 'space.300' }),
        makeRef({ property: 'padding-top', token: '', confidence: 'no-match', primitive: undefined }),
      ];

      const result = extractor.detectComponentTokenDecisions(usage, 'ButtonCTA');
      expect(result).toHaveLength(1);
      expect(result[0].usageCount).toBe(2);
    });
  });

  // -------------------------------------------------------------------------
  // Illustrative suggestion naming
  // -------------------------------------------------------------------------

  describe('illustrative suggestion naming', () => {
    it('generates suggestion with component base name', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({ property: 'padding-left', token: 'space.300', primitive: 'space.300' }),
        makeRef({ property: 'padding-right', token: 'space.300', primitive: 'space.300' }),
      ];

      const result = extractor.detectComponentTokenDecisions(usage, 'ButtonCTA');

      expect(result[0].illustrativeSuggestion).toContain('button.');
      expect(result[0].illustrativeSuggestion).toContain('space.300');
    });

    it('extracts base name from PascalCase component names', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({ property: 'padding-left', token: 'space.300', primitive: 'space.300' }),
        makeRef({ property: 'padding-right', token: 'space.300', primitive: 'space.300' }),
      ];

      const result = extractor.detectComponentTokenDecisions(usage, 'InputTextBase');
      expect(result[0].illustrativeSuggestion).toMatch(/^input\./);
    });

    it('uses "component" as fallback when name is empty', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({ property: 'padding-left', token: 'space.300', primitive: 'space.300' }),
        makeRef({ property: 'padding-right', token: 'space.300', primitive: 'space.300' }),
      ];

      const result = extractor.detectComponentTokenDecisions(usage);
      expect(result[0].illustrativeSuggestion).toMatch(/^component\./);
    });
  });

  // -------------------------------------------------------------------------
  // Property group inference
  // -------------------------------------------------------------------------

  describe('property group inference', () => {
    it('infers "padding.horizontal" for left/right padding', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({ property: 'padding-left', token: 'space.300', primitive: 'space.300' }),
        makeRef({ property: 'padding-right', token: 'space.300', primitive: 'space.300' }),
      ];

      const result = extractor.detectComponentTokenDecisions(usage, 'ButtonCTA');
      expect(result[0].illustrativeSuggestion).toBe('button.padding.horizontal = space.300');
    });

    it('infers "padding.vertical" for top/bottom padding', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({ property: 'padding-top', token: 'space.200', primitive: 'space.200' }),
        makeRef({ property: 'padding-bottom', token: 'space.200', primitive: 'space.200' }),
      ];

      const result = extractor.detectComponentTokenDecisions(usage, 'ButtonCTA');
      expect(result[0].illustrativeSuggestion).toBe('button.padding.vertical = space.200');
    });

    it('infers "padding" for mixed padding directions', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({ property: 'padding-left', token: 'space.300', primitive: 'space.300' }),
        makeRef({ property: 'padding-right', token: 'space.300', primitive: 'space.300' }),
        makeRef({ property: 'padding-top', token: 'space.300', primitive: 'space.300' }),
      ];

      const result = extractor.detectComponentTokenDecisions(usage, 'ButtonCTA');
      expect(result[0].illustrativeSuggestion).toBe('button.padding = space.300');
    });

    it('infers "fill" for color properties', () => {
      const usage = makeEmptyUsage();
      usage.colors = [
        makeRef({ property: 'background', token: 'color.purple.300', primitive: 'color.purple.300' }),
        makeRef({ property: 'fill', token: 'color.purple.300', primitive: 'color.purple.300' }),
      ];

      const result = extractor.detectComponentTokenDecisions(usage, 'ButtonCTA');
      expect(result[0].illustrativeSuggestion).toBe('button.fill = color.purple.300');
    });

    it('infers "radius" for border-radius properties', () => {
      const usage = makeEmptyUsage();
      usage.radius = [
        makeRef({ property: 'border-radius', token: 'radius.200', primitive: 'radius.200' }),
        makeRef({ property: 'border-radius', token: 'radius.200', primitive: 'radius.200' }),
      ];

      const result = extractor.detectComponentTokenDecisions(usage, 'ContainerBase');
      expect(result[0].illustrativeSuggestion).toBe('container.radius = radius.200');
    });
  });

  // -------------------------------------------------------------------------
  // Rationale content
  // -------------------------------------------------------------------------

  describe('rationale', () => {
    it('includes primitive token name in rationale', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({ property: 'padding-left', token: 'space.300', primitive: 'space.300' }),
        makeRef({ property: 'padding-right', token: 'space.300', primitive: 'space.300' }),
      ];

      const result = extractor.detectComponentTokenDecisions(usage, 'ButtonCTA');
      expect(result[0].rationale).toContain('space.300');
    });

    it('includes usage count in rationale', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({ property: 'padding-left', token: 'space.300', primitive: 'space.300' }),
        makeRef({ property: 'padding-right', token: 'space.300', primitive: 'space.300' }),
        makeRef({ property: 'item-spacing', token: 'space.300', primitive: 'space.300' }),
      ];

      const result = extractor.detectComponentTokenDecisions(usage, 'ButtonCTA');
      expect(result[0].rationale).toContain('3 properties');
    });

    it('includes property locations in rationale', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({ property: 'padding-left', token: 'space.300', primitive: 'space.300' }),
        makeRef({ property: 'padding-right', token: 'space.300', primitive: 'space.300' }),
      ];

      const result = extractor.detectComponentTokenDecisions(usage, 'ButtonCTA');
      expect(result[0].rationale).toContain('padding-left');
      expect(result[0].rationale).toContain('padding-right');
    });
  });

  // -------------------------------------------------------------------------
  // Sorting by usage count
  // -------------------------------------------------------------------------

  describe('sorting', () => {
    it('sorts decisions by usage count descending', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({ property: 'padding-left', token: 'space.200', primitive: 'space.200' }),
        makeRef({ property: 'padding-right', token: 'space.200', primitive: 'space.200' }),
      ];
      usage.colors = [
        makeRef({ property: 'background', token: 'color.purple.300', primitive: 'color.purple.300' }),
        makeRef({ property: 'fill', token: 'color.purple.300', primitive: 'color.purple.300' }),
        makeRef({ property: 'stroke', token: 'color.purple.300', primitive: 'color.purple.300' }),
      ];

      const result = extractor.detectComponentTokenDecisions(usage, 'ButtonCTA');

      expect(result).toHaveLength(2);
      expect(result[0].primitiveToken).toBe('color.purple.300');
      expect(result[0].usageCount).toBe(3);
      expect(result[1].primitiveToken).toBe('space.200');
      expect(result[1].usageCount).toBe(2);
    });
  });

  // -------------------------------------------------------------------------
  // Falls back to main token when no primitive field
  // -------------------------------------------------------------------------

  describe('token fallback', () => {
    it('uses main token field when primitive is undefined', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({ property: 'padding-left', token: 'space.300', primitive: undefined }),
        makeRef({ property: 'padding-right', token: 'space.300', primitive: undefined }),
      ];

      const result = extractor.detectComponentTokenDecisions(usage, 'ButtonCTA');

      expect(result).toHaveLength(1);
      expect(result[0].primitiveToken).toBe('space.300');
    });
  });

  // -------------------------------------------------------------------------
  // Multiple patterns detected simultaneously
  // -------------------------------------------------------------------------

  describe('multiple patterns', () => {
    it('detects multiple distinct repeated patterns', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({ property: 'padding-left', token: 'space.300', primitive: 'space.300' }),
        makeRef({ property: 'padding-right', token: 'space.300', primitive: 'space.300' }),
        makeRef({ property: 'padding-top', token: 'space.200', primitive: 'space.200' }),
        makeRef({ property: 'padding-bottom', token: 'space.200', primitive: 'space.200' }),
      ];

      const result = extractor.detectComponentTokenDecisions(usage, 'ButtonCTA');

      expect(result).toHaveLength(2);
      const tokens = result.map(d => d.primitiveToken);
      expect(tokens).toContain('space.300');
      expect(tokens).toContain('space.200');
    });
  });
});
