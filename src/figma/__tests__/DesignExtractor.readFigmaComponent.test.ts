/**
 * Tests for DesignExtractor.readFigmaComponent() — Task 3.2
 *
 * Validates dual-MCP strategy: Kiro Figma Power as primary,
 * figma-console-mcp as fallback. Tests component reading,
 * parsing, and error handling.
 *
 * @spec 054b-figma-design-extract
 * @requirements Req 1
 */

import { DesignExtractor } from '../DesignExtractor';
import type {
  KiroFigmaPowerClient,
  DesignContextResponse,
  MetadataResponse,
  ExtractedComponent,
} from '../DesignExtractor';
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

function makeMockKiroPower(): jest.Mocked<KiroFigmaPowerClient> {
  return {
    getDesignContext: jest.fn().mockResolvedValue({ code: '' }),
    getMetadata: jest.fn().mockResolvedValue({ xml: '' }),
  };
}

/** Minimal stubs — readFigmaComponent doesn't use translator or analyzer. */
const stubTranslator = {} as TokenTranslator;
const stubAnalyzer = {} as VariantAnalyzer;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DesignExtractor.readFigmaComponent', () => {
  const FILE_KEY = 'test-file-key';
  const NODE_ID = '123:456';

  // -----------------------------------------------------------------------
  // Primary path: Kiro Figma Power
  // -----------------------------------------------------------------------

  describe('primary path (Kiro Figma Power)', () => {
    it('extracts component from get_design_context code', async () => {
      const kiroPower = makeMockKiroPower();
      const consoleMcp = makeMockConsoleMcp();

      kiroPower.getDesignContext.mockResolvedValue({
        code: `
          class ButtonCTA extends HTMLElement {
            /** Primary call-to-action button with hover and focus states. */
            variant: 'primary' | 'secondary';
            size: 'small' | 'medium' | 'large';
          }
          // styles
          .button { display: flex; flex-direction: row; gap: 8; padding: 12 24; }
          .button:hover { opacity: 0.9; }
          .button:focus { outline: 2px solid blue; }
          .button:disabled { opacity: 0.5; }
        `,
      });

      const extractor = new DesignExtractor(
        consoleMcp, stubTranslator, stubAnalyzer, kiroPower,
      );

      const result = await extractor.readFigmaComponent(FILE_KEY, NODE_ID);

      expect(result.source).toBe('kiro-power');
      expect(result.name).toBe('ButtonCTA');
      expect(result.rawDesignContext).toBeDefined();
      expect(result.states.map(s => s.name)).toEqual(
        expect.arrayContaining(['hover', 'focus', 'disabled']),
      );
      expect(result.layout.mode).toBe('horizontal');
      expect(result.layout.itemSpacing).toBe(8);
    });

    it('extracts layout padding from code', async () => {
      const kiroPower = makeMockKiroPower();
      const consoleMcp = makeMockConsoleMcp();

      kiroPower.getDesignContext.mockResolvedValue({
        code: `
          class Card extends HTMLElement {}
          .card { display: flex; flex-direction: column; padding: 16 24 16 24; }
        `,
      });

      const extractor = new DesignExtractor(
        consoleMcp, stubTranslator, stubAnalyzer, kiroPower,
      );

      const result = await extractor.readFigmaComponent(FILE_KEY, NODE_ID);

      expect(result.layout.mode).toBe('vertical');
      expect(result.layout.padding).toEqual({
        top: 16, right: 24, bottom: 16, left: 24,
      });
    });

    it('extracts variant properties from code', async () => {
      const kiroPower = makeMockKiroPower();
      const consoleMcp = makeMockConsoleMcp();

      kiroPower.getDesignContext.mockResolvedValue({
        code: `
          class Badge extends HTMLElement {}
          // variant="success" variant="error" variant="warning"
          // size="small" size="large"
        `,
      });

      const extractor = new DesignExtractor(
        consoleMcp, stubTranslator, stubAnalyzer, kiroPower,
      );

      const result = await extractor.readFigmaComponent(FILE_KEY, NODE_ID);

      expect(result.variants.length).toBeGreaterThanOrEqual(3);
      const variantNames = result.variants.map(v => v.name);
      expect(variantNames).toContain('variant=success');
      expect(variantNames).toContain('variant=error');
    });

    it('extracts description from JSDoc comment', async () => {
      const kiroPower = makeMockKiroPower();
      const consoleMcp = makeMockConsoleMcp();

      kiroPower.getDesignContext.mockResolvedValue({
        code: `
          /** A reusable icon component for the design system. */
          class IconBase extends HTMLElement {}
        `,
      });

      const extractor = new DesignExtractor(
        consoleMcp, stubTranslator, stubAnalyzer, kiroPower,
      );

      const result = await extractor.readFigmaComponent(FILE_KEY, NODE_ID);

      expect(result.description).toBe('A reusable icon component for the design system.');
    });
  });

  // -----------------------------------------------------------------------
  // Fallback path: figma-console-mcp
  // -----------------------------------------------------------------------

  describe('fallback path (figma-console-mcp)', () => {
    it('falls back when Kiro Power returns empty code', async () => {
      const kiroPower = makeMockKiroPower();
      const consoleMcp = makeMockConsoleMcp();

      kiroPower.getDesignContext.mockResolvedValue({ code: '' });
      consoleMcp.getComponent.mockResolvedValue({
        name: 'ButtonCTA',
        description: 'Call-to-action button',
        variantProperties: {
          variant: ['primary', 'secondary', 'tertiary'],
          size: ['small', 'medium', 'large'],
        },
      });

      const extractor = new DesignExtractor(
        consoleMcp, stubTranslator, stubAnalyzer, kiroPower,
      );

      const result = await extractor.readFigmaComponent(FILE_KEY, NODE_ID);

      expect(result.source).toBe('console-mcp-fallback');
      expect(result.name).toBe('ButtonCTA');
      expect(result.description).toBe('Call-to-action button');
      expect(result.variants.length).toBe(3); // first property's values
    });

    it('falls back when Kiro Power throws', async () => {
      const kiroPower = makeMockKiroPower();
      const consoleMcp = makeMockConsoleMcp();

      kiroPower.getDesignContext.mockRejectedValue(new Error('MCP server unavailable'));
      consoleMcp.getComponent.mockResolvedValue({
        name: 'InputText',
        description: 'Text input field',
      });

      const extractor = new DesignExtractor(
        consoleMcp, stubTranslator, stubAnalyzer, kiroPower,
      );

      const result = await extractor.readFigmaComponent(FILE_KEY, NODE_ID);

      expect(result.source).toBe('console-mcp-fallback');
      expect(result.name).toBe('InputText');
    });

    it('works without Kiro Power client (undefined)', async () => {
      const consoleMcp = makeMockConsoleMcp();

      consoleMcp.getComponent.mockResolvedValue({
        name: 'Container',
        description: 'Layout container',
        variantProperties: { padding: ['100', '200', '300'] },
      });

      const extractor = new DesignExtractor(
        consoleMcp, stubTranslator, stubAnalyzer,
        /* no kiroPower */
      );

      const result = await extractor.readFigmaComponent(FILE_KEY, NODE_ID);

      expect(result.source).toBe('console-mcp-fallback');
      expect(result.name).toBe('Container');
    });

    it('includes metadata XML when available from Kiro Power', async () => {
      const kiroPower = makeMockKiroPower();
      const consoleMcp = makeMockConsoleMcp();

      kiroPower.getDesignContext.mockResolvedValue({ code: '' });
      kiroPower.getMetadata.mockResolvedValue({
        xml: '<node name="ButtonCTA" type="COMPONENT"><child name="hover" /></node>',
      });
      consoleMcp.getComponent.mockResolvedValue({
        name: 'ButtonCTA',
        description: 'Button',
      });

      const extractor = new DesignExtractor(
        consoleMcp, stubTranslator, stubAnalyzer, kiroPower,
      );

      const result = await extractor.readFigmaComponent(FILE_KEY, NODE_ID);

      expect(result.rawMetadata).toContain('ButtonCTA');
      expect(result.states.map(s => s.name)).toContain('hover');
    });

    it('continues without metadata when getMetadata throws', async () => {
      const kiroPower = makeMockKiroPower();
      const consoleMcp = makeMockConsoleMcp();

      kiroPower.getDesignContext.mockResolvedValue({ code: '' });
      kiroPower.getMetadata.mockRejectedValue(new Error('Metadata unavailable'));
      consoleMcp.getComponent.mockResolvedValue({
        name: 'Badge',
        description: 'Status badge',
      });

      const extractor = new DesignExtractor(
        consoleMcp, stubTranslator, stubAnalyzer, kiroPower,
      );

      const result = await extractor.readFigmaComponent(FILE_KEY, NODE_ID);

      expect(result.name).toBe('Badge');
      expect(result.rawMetadata).toBeUndefined();
      expect(result.states).toEqual([]);
    });
  });

  // -----------------------------------------------------------------------
  // Error handling
  // -----------------------------------------------------------------------

  describe('error handling', () => {
    it('throws when both MCP sources fail', async () => {
      const kiroPower = makeMockKiroPower();
      const consoleMcp = makeMockConsoleMcp();

      kiroPower.getDesignContext.mockRejectedValue(new Error('Kiro Power down'));
      consoleMcp.getComponent.mockRejectedValue(new Error('Console MCP down'));

      const extractor = new DesignExtractor(
        consoleMcp, stubTranslator, stubAnalyzer, kiroPower,
      );

      await expect(
        extractor.readFigmaComponent(FILE_KEY, NODE_ID),
      ).rejects.toThrow(/Failed to read Figma component/);
    });

    it('throws when component not found (no name in response)', async () => {
      const consoleMcp = makeMockConsoleMcp();

      consoleMcp.getComponent.mockResolvedValue({});

      const extractor = new DesignExtractor(
        consoleMcp, stubTranslator, stubAnalyzer,
      );

      await expect(
        extractor.readFigmaComponent(FILE_KEY, NODE_ID),
      ).rejects.toThrow(/Component not found or invalid node ID/);
    });

    it('includes file key and node ID in error message', async () => {
      const consoleMcp = makeMockConsoleMcp();

      consoleMcp.getComponent.mockRejectedValue(new Error('timeout'));

      const extractor = new DesignExtractor(
        consoleMcp, stubTranslator, stubAnalyzer,
      );

      await expect(
        extractor.readFigmaComponent(FILE_KEY, NODE_ID),
      ).rejects.toThrow(FILE_KEY);

      await expect(
        extractor.readFigmaComponent(FILE_KEY, NODE_ID),
      ).rejects.toThrow(NODE_ID);
    });
  });

  // -----------------------------------------------------------------------
  // Edge cases
  // -----------------------------------------------------------------------

  describe('edge cases', () => {
    it('handles component with no variants', async () => {
      const consoleMcp = makeMockConsoleMcp();

      consoleMcp.getComponent.mockResolvedValue({
        name: 'Divider',
        description: 'Simple divider line',
      });

      const extractor = new DesignExtractor(
        consoleMcp, stubTranslator, stubAnalyzer,
      );

      const result = await extractor.readFigmaComponent(FILE_KEY, NODE_ID);

      expect(result.name).toBe('Divider');
      expect(result.variants).toEqual([]);
    });

    it('handles Kiro Power returning code without recognizable component name', async () => {
      const kiroPower = makeMockKiroPower();
      const consoleMcp = makeMockConsoleMcp();

      // Code with no class/function/tag pattern
      kiroPower.getDesignContext.mockResolvedValue({
        code: '/* just a comment with no component */',
      });
      consoleMcp.getComponent.mockResolvedValue({
        name: 'FallbackComponent',
        description: 'Fell back',
      });

      const extractor = new DesignExtractor(
        consoleMcp, stubTranslator, stubAnalyzer, kiroPower,
      );

      const result = await extractor.readFigmaComponent(FILE_KEY, NODE_ID);

      // Should fall back because name extraction returned empty string
      expect(result.source).toBe('console-mcp-fallback');
      expect(result.name).toBe('FallbackComponent');
    });

    it('extracts layout with shorthand 2-value padding', async () => {
      const kiroPower = makeMockKiroPower();
      const consoleMcp = makeMockConsoleMcp();

      kiroPower.getDesignContext.mockResolvedValue({
        code: `
          class Chip extends HTMLElement {}
          .chip { display: flex; padding: 8 16; }
        `,
      });

      const extractor = new DesignExtractor(
        consoleMcp, stubTranslator, stubAnalyzer, kiroPower,
      );

      const result = await extractor.readFigmaComponent(FILE_KEY, NODE_ID);

      expect(result.layout.padding).toEqual({
        top: 8, right: 16, bottom: 8, left: 16,
      });
    });

    it('extracts layout with single-value padding', async () => {
      const kiroPower = makeMockKiroPower();
      const consoleMcp = makeMockConsoleMcp();

      kiroPower.getDesignContext.mockResolvedValue({
        code: `
          class Box extends HTMLElement {}
          .box { display: flex; padding: 24; }
        `,
      });

      const extractor = new DesignExtractor(
        consoleMcp, stubTranslator, stubAnalyzer, kiroPower,
      );

      const result = await extractor.readFigmaComponent(FILE_KEY, NODE_ID);

      expect(result.layout.padding).toEqual({
        top: 24, right: 24, bottom: 24, left: 24,
      });
    });
  });
});
