/**
 * Tests for DesignExtractor.reconstructCompositeTokens() — Task 3.7
 *
 * Validates composite token reconstruction from Figma styles:
 * - Primary path: direct name matching against DTCG composite tokens
 * - Fallback path: property-by-property reconstruction
 * - No-match flagging for Ada's review
 *
 * @spec 054b-figma-design-extract
 * @requirements Req 3 (Composite Token Reconstruction)
 */

import { DesignExtractor } from '../DesignExtractor';
import type { FigmaStyle } from '../DesignExtractor';
import type { ConsoleMCPClient } from '../ConsoleMCPClient';
import type { TokenTranslator } from '../TokenTranslator';
import type { VariantAnalyzer } from '../VariantAnalyzer';
import type { DTCGTokenFile } from '../../generators/types/DTCGTypes';

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

function makeExtractor(): DesignExtractor {
  return new DesignExtractor(makeMockConsoleMcp(), stubTranslator, stubAnalyzer);
}

// ---------------------------------------------------------------------------
// DTCG token fixtures
// ---------------------------------------------------------------------------

/** Minimal DTCG token file with shadow and typography composite tokens. */
const dtcgTokens: DTCGTokenFile = {
  $schema: 'https://tr.designtokens.org/format/',
  shadow: {
    $type: 'shadow' as any,
    elevation200: {
      $value: { offsetX: '0px', offsetY: '8px', blur: '24px', spread: '0px', color: 'rgba(0,0,0,0.2)' },
      $type: 'shadow' as any,
      $description: 'Medium elevation shadow',
    },
    container: {
      $value: { offsetX: '0px', offsetY: '4px', blur: '12px', spread: '0px', color: 'rgba(0,0,0,0.3)' },
      $type: 'shadow' as any,
      $description: 'Container shadow',
    },
  },
  typography: {
    $type: 'typography' as any,
    heading200: {
      $value: { fontFamily: 'Inter', fontSize: '24px', fontWeight: 700, lineHeight: 1.33, letterSpacing: '-0.02em' },
      $type: 'typography' as any,
      $description: 'Heading level 2',
    },
    bodyMd: {
      $value: { fontFamily: 'Inter', fontSize: '16px', fontWeight: 400, lineHeight: 1.5, letterSpacing: '0em' },
      $type: 'typography' as any,
      $description: 'Medium body text',
    },
  },
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DesignExtractor.reconstructCompositeTokens', () => {
  const extractor = makeExtractor();

  // -----------------------------------------------------------------------
  // Primary path: direct name matching
  // -----------------------------------------------------------------------

  describe('primary path — direct name matching', () => {
    it('matches effect style by prefixed name (shadow.elevation200)', () => {
      const styles: FigmaStyle[] = [
        { name: 'shadow.elevation200', type: 'EFFECT', properties: {} },
      ];

      const result = extractor.reconstructCompositeTokens(styles, dtcgTokens);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        property: 'shadow',
        token: 'shadow.elevation200',
        confidence: 'exact',
        matchMethod: 'binding',
      });
    });

    it('matches text style by prefixed name (typography.heading200)', () => {
      const styles: FigmaStyle[] = [
        { name: 'typography.heading200', type: 'TEXT', properties: {} },
      ];

      const result = extractor.reconstructCompositeTokens(styles, dtcgTokens);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        property: 'typography',
        token: 'typography.heading200',
        confidence: 'exact',
        matchMethod: 'binding',
      });
    });

    it('matches style name without category prefix (elevation200 → shadow.elevation200)', () => {
      const styles: FigmaStyle[] = [
        { name: 'elevation200', type: 'EFFECT', properties: {} },
      ];

      const result = extractor.reconstructCompositeTokens(styles, dtcgTokens);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        token: 'shadow.elevation200',
        confidence: 'exact',
        matchMethod: 'binding',
      });
    });

    it('matches style name without category prefix (bodyMd → typography.bodyMd)', () => {
      const styles: FigmaStyle[] = [
        { name: 'bodyMd', type: 'TEXT', properties: {} },
      ];

      const result = extractor.reconstructCompositeTokens(styles, dtcgTokens);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        token: 'typography.bodyMd',
        confidence: 'exact',
        matchMethod: 'binding',
      });
    });

    it('matches style name with slash notation (shadow/container → shadow.container)', () => {
      const styles: FigmaStyle[] = [
        { name: 'shadow/container', type: 'EFFECT', properties: {} },
      ];

      const result = extractor.reconstructCompositeTokens(styles, dtcgTokens);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        token: 'shadow.container',
        confidence: 'exact',
        matchMethod: 'binding',
      });
    });

    it('handles multiple styles in a single call', () => {
      const styles: FigmaStyle[] = [
        { name: 'shadow.elevation200', type: 'EFFECT', properties: {} },
        { name: 'typography.heading200', type: 'TEXT', properties: {} },
        { name: 'shadow.container', type: 'EFFECT', properties: {} },
      ];

      const result = extractor.reconstructCompositeTokens(styles, dtcgTokens);

      expect(result).toHaveLength(3);
      expect(result[0].token).toBe('shadow.elevation200');
      expect(result[1].token).toBe('typography.heading200');
      expect(result[2].token).toBe('shadow.container');
      expect(result.every((r) => r.confidence === 'exact')).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // Fallback path: property-by-property reconstruction
  // -----------------------------------------------------------------------

  describe('fallback path — property-by-property reconstruction', () => {
    it('reconstructs shadow from matching properties', () => {
      const styles: FigmaStyle[] = [
        {
          name: 'Custom Shadow',
          type: 'EFFECT',
          properties: {
            offsetX: '0px',
            offsetY: '8px',
            blur: '24px',
            spread: '0px',
          },
        },
      ];

      const result = extractor.reconstructCompositeTokens(styles, dtcgTokens);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        property: 'shadow',
        token: 'shadow.elevation200',
        confidence: 'approximate',
        matchMethod: 'value',
      });
      expect(result[0].delta).toContain('Reconstructed from properties');
    });

    it('reconstructs typography from matching properties', () => {
      const styles: FigmaStyle[] = [
        {
          name: 'Custom Heading',
          type: 'TEXT',
          properties: {
            fontFamily: 'Inter',
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: 1.33,
          },
        },
      ];

      const result = extractor.reconstructCompositeTokens(styles, dtcgTokens);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        property: 'typography',
        token: 'typography.heading200',
        confidence: 'approximate',
        matchMethod: 'value',
      });
    });

    it('picks best match when multiple tokens partially match', () => {
      // Properties that match container (4/4) better than elevation200 (2/4)
      const styles: FigmaStyle[] = [
        {
          name: 'My Shadow',
          type: 'EFFECT',
          properties: {
            offsetX: '0px',
            offsetY: '4px',
            blur: '12px',
            spread: '0px',
          },
        },
      ];

      const result = extractor.reconstructCompositeTokens(styles, dtcgTokens);

      expect(result).toHaveLength(1);
      expect(result[0].token).toBe('shadow.container');
    });

    it('handles numeric values matching string dimension values', () => {
      const styles: FigmaStyle[] = [
        {
          name: 'Numeric Shadow',
          type: 'EFFECT',
          properties: {
            offsetX: 0,
            offsetY: 4,
            blur: 12,
            spread: 0,
          },
        },
      ];

      const result = extractor.reconstructCompositeTokens(styles, dtcgTokens);

      expect(result).toHaveLength(1);
      expect(result[0].token).toBe('shadow.container');
      expect(result[0].confidence).toBe('approximate');
    });
  });

  // -----------------------------------------------------------------------
  // No-match: flagged for Ada's review
  // -----------------------------------------------------------------------

  describe('no-match — flagged for Ada review', () => {
    it('flags unmatched shadow style with no-match confidence', () => {
      const styles: FigmaStyle[] = [
        {
          name: 'Completely Custom Shadow',
          type: 'EFFECT',
          properties: {
            offsetX: '10px',
            offsetY: '20px',
            blur: '50px',
            spread: '5px',
          },
        },
      ];

      const result = extractor.reconstructCompositeTokens(styles, dtcgTokens);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        property: 'shadow',
        token: '',
        confidence: 'no-match',
        matchMethod: 'value',
      });
      expect(result[0].delta).toContain('requires Ada review');
    });

    it('flags unmatched typography style with no-match confidence', () => {
      const styles: FigmaStyle[] = [
        {
          name: 'Exotic Font',
          type: 'TEXT',
          properties: {
            fontFamily: 'Comic Sans',
            fontSize: '99px',
            fontWeight: 100,
            lineHeight: 3.0,
          },
        },
      ];

      const result = extractor.reconstructCompositeTokens(styles, dtcgTokens);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        property: 'typography',
        token: '',
        confidence: 'no-match',
      });
      expect(result[0].delta).toContain('Exotic Font');
    });

    it('flags style with empty properties as no-match', () => {
      const styles: FigmaStyle[] = [
        { name: 'Unknown Style', type: 'EFFECT', properties: {} },
      ];

      // "Unknown Style" won't match any token name, and empty properties
      // won't reconstruct — should fall through to no-match
      const result = extractor.reconstructCompositeTokens(styles, dtcgTokens);

      expect(result).toHaveLength(1);
      expect(result[0].confidence).toBe('no-match');
    });
  });

  // -----------------------------------------------------------------------
  // Edge cases
  // -----------------------------------------------------------------------

  describe('edge cases', () => {
    it('returns empty array for empty styles input', () => {
      const result = extractor.reconstructCompositeTokens([], dtcgTokens);
      expect(result).toEqual([]);
    });

    it('handles DTCG tokens with no shadow group', () => {
      const minimalTokens: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        typography: {
          $type: 'typography' as any,
          bodyMd: {
            $value: { fontFamily: 'Inter', fontSize: '16px', fontWeight: 400, lineHeight: 1.5 },
            $type: 'typography' as any,
          },
        },
      };

      const styles: FigmaStyle[] = [
        { name: 'Custom Shadow', type: 'EFFECT', properties: { offsetX: '0px' } },
      ];

      const result = extractor.reconstructCompositeTokens(styles, minimalTokens);

      expect(result).toHaveLength(1);
      expect(result[0].confidence).toBe('no-match');
    });

    it('handles mixed matched and unmatched styles', () => {
      const styles: FigmaStyle[] = [
        { name: 'shadow.elevation200', type: 'EFFECT', properties: {} },
        { name: 'Unknown Custom', type: 'TEXT', properties: { fontFamily: 'Papyrus' } },
        { name: 'typography.bodyMd', type: 'TEXT', properties: {} },
      ];

      const result = extractor.reconstructCompositeTokens(styles, dtcgTokens);

      expect(result).toHaveLength(3);
      expect(result[0].confidence).toBe('exact');
      expect(result[1].confidence).toBe('no-match');
      expect(result[2].confidence).toBe('exact');
    });
  });
});
