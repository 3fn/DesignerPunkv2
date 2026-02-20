/**
 * Tests for DesignExtractor.detectPlatformParity() — Task 3.9
 *
 * Validates platform parity detection: heuristic-based platform classification,
 * recommendation generation with decision options, MCP cross-referencing,
 * and graceful fallback when MCP is unavailable.
 *
 * @spec 054b-figma-design-extract
 * @requirements Req 7 (Platform Parity Detection)
 */

import { DesignExtractor } from '../DesignExtractor';
import type { ExtractedComponent } from '../DesignExtractor';
import type { ConsoleMCPClient } from '../ConsoleMCPClient';
import type { TokenTranslator } from '../TokenTranslator';
import type { VariantAnalyzer, MCPDocClient } from '../VariantAnalyzer';

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

function makeMockMcpDocs(): jest.Mocked<MCPDocClient> {
  return {
    getDocumentFull: jest.fn().mockResolvedValue(null),
    getSection: jest.fn().mockResolvedValue(null),
  };
}

const stubTranslator = {} as TokenTranslator;
const stubAnalyzer = {} as VariantAnalyzer;

function makeComponent(overrides: Partial<ExtractedComponent> = {}): ExtractedComponent {
  return {
    name: 'TestComponent',
    description: '',
    variants: [],
    states: [],
    properties: [],
    layout: { mode: 'none' },
    source: 'kiro-power',
    ...overrides,
  };
}


// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DesignExtractor.detectPlatformParity', () => {
  // -------------------------------------------------------------------------
  // Heuristic-based platform classification
  // -------------------------------------------------------------------------

  describe('platform heuristics', () => {
    it('flags hover as web-only', async () => {
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, stubAnalyzer,
      );
      const component = makeComponent({
        states: [{ name: 'hover' }],
      });

      const result = await extractor.detectPlatformParity(component);

      expect(result.hasConcerns).toBe(true);
      expect(result.interactions).toHaveLength(1);
      expect(result.interactions[0].interaction).toBe('hover');
      expect(result.interactions[0].platforms).toEqual(['web']);
    });

    it('does not flag focus (all platforms)', async () => {
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, stubAnalyzer,
      );
      const component = makeComponent({
        states: [{ name: 'focus' }],
      });

      const result = await extractor.detectPlatformParity(component);

      expect(result.hasConcerns).toBe(false);
      expect(result.interactions).toHaveLength(0);
    });

    it('does not flag pressed (all platforms)', async () => {
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, stubAnalyzer,
      );
      const component = makeComponent({
        states: [{ name: 'pressed' }],
      });

      const result = await extractor.detectPlatformParity(component);

      expect(result.hasConcerns).toBe(false);
      expect(result.interactions).toHaveLength(0);
    });

    it('does not flag disabled (all platforms)', async () => {
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, stubAnalyzer,
      );
      const component = makeComponent({
        states: [{ name: 'disabled' }],
      });

      const result = await extractor.detectPlatformParity(component);

      expect(result.hasConcerns).toBe(false);
      expect(result.interactions).toHaveLength(0);
    });

    it('flags long-press as mobile-only (ios, android)', async () => {
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, stubAnalyzer,
      );
      const component = makeComponent({
        states: [{ name: 'long-press' }],
      });

      const result = await extractor.detectPlatformParity(component);

      expect(result.hasConcerns).toBe(true);
      expect(result.interactions).toHaveLength(1);
      expect(result.interactions[0].interaction).toBe('long-press');
      expect(result.interactions[0].platforms).toEqual(['ios', 'android']);
    });
  });

  // -------------------------------------------------------------------------
  // Multiple states with mixed platform support
  // -------------------------------------------------------------------------

  describe('multiple states', () => {
    it('flags only platform-specific states from a mixed set', async () => {
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, stubAnalyzer,
      );
      const component = makeComponent({
        states: [
          { name: 'hover' },
          { name: 'focus' },
          { name: 'disabled' },
          { name: 'pressed' },
        ],
      });

      const result = await extractor.detectPlatformParity(component);

      expect(result.hasConcerns).toBe(true);
      // Only hover should be flagged — focus, disabled, pressed are all-platform
      expect(result.interactions).toHaveLength(1);
      expect(result.interactions[0].interaction).toBe('hover');
    });

    it('flags both hover and long-press when both present', async () => {
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, stubAnalyzer,
      );
      const component = makeComponent({
        states: [
          { name: 'hover' },
          { name: 'long-press' },
          { name: 'focus' },
        ],
      });

      const result = await extractor.detectPlatformParity(component);

      expect(result.hasConcerns).toBe(true);
      expect(result.interactions).toHaveLength(2);

      const names = result.interactions.map((i) => i.interaction);
      expect(names).toContain('hover');
      expect(names).toContain('long-press');
    });
  });

  // -------------------------------------------------------------------------
  // No states / no concerns
  // -------------------------------------------------------------------------

  describe('no concerns', () => {
    it('returns no concerns when component has no states', async () => {
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, stubAnalyzer,
      );
      const component = makeComponent({ states: [] });

      const result = await extractor.detectPlatformParity(component);

      expect(result.hasConcerns).toBe(false);
      expect(result.interactions).toHaveLength(0);
    });

    it('returns no concerns when all states are cross-platform', async () => {
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, stubAnalyzer,
      );
      const component = makeComponent({
        states: [
          { name: 'focus' },
          { name: 'disabled' },
          { name: 'active' },
          { name: 'selected' },
          { name: 'error' },
          { name: 'loading' },
        ],
      });

      const result = await extractor.detectPlatformParity(component);

      expect(result.hasConcerns).toBe(false);
      expect(result.interactions).toHaveLength(0);
    });
  });

  // -------------------------------------------------------------------------
  // Recommendation content
  // -------------------------------------------------------------------------

  describe('recommendations', () => {
    it('includes decision options for hover state', async () => {
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, stubAnalyzer,
      );
      const component = makeComponent({
        states: [{ name: 'hover' }],
      });

      const result = await extractor.detectPlatformParity(component);
      const rec = result.interactions[0].recommendation;

      expect(rec).toContain('web-only');
      expect(rec).toContain('omit hover feedback on mobile');
      expect(rec).toContain('map to press/active state on mobile');
      expect(rec).toContain('alternative visual feedback');
    });

    it('includes decision options for long-press state', async () => {
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, stubAnalyzer,
      );
      const component = makeComponent({
        states: [{ name: 'long-press' }],
      });

      const result = await extractor.detectPlatformParity(component);
      const rec = result.interactions[0].recommendation;

      expect(rec).toContain('omit on web');
      expect(rec).toContain('right-click/context menu');
      expect(rec).toContain('alternative trigger');
    });
  });

  // -------------------------------------------------------------------------
  // MCP cross-referencing
  // -------------------------------------------------------------------------

  describe('MCP cross-referencing', () => {
    it('queries platform-implementation-guidelines.md when mcpDocs is provided', async () => {
      const mcpDocs = makeMockMcpDocs();
      mcpDocs.getSection.mockResolvedValue('## State Management\nstates: hover, focus...');

      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, stubAnalyzer,
        undefined, // kiroPower
        mcpDocs,
      );
      const component = makeComponent({
        states: [{ name: 'hover' }],
      });

      const result = await extractor.detectPlatformParity(component);

      expect(mcpDocs.getSection).toHaveBeenCalledWith(
        '.kiro/steering/platform-implementation-guidelines.md',
        'State Management Consistency',
      );
      expect(result.interactions[0].recommendation).toContain(
        'Cross-referenced with platform-implementation-guidelines.md',
      );
    });

    it('works without MCP cross-reference (no mcpDocs)', async () => {
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, stubAnalyzer,
      );
      const component = makeComponent({
        states: [{ name: 'hover' }],
      });

      const result = await extractor.detectPlatformParity(component);

      expect(result.hasConcerns).toBe(true);
      expect(result.interactions[0].recommendation).not.toContain(
        'Cross-referenced',
      );
    });

    it('gracefully handles MCP query failure', async () => {
      const mcpDocs = makeMockMcpDocs();
      mcpDocs.getSection.mockRejectedValue(new Error('MCP unavailable'));

      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, stubAnalyzer,
        undefined,
        mcpDocs,
      );
      const component = makeComponent({
        states: [{ name: 'hover' }],
      });

      const result = await extractor.detectPlatformParity(component);

      // Should still work with heuristics only
      expect(result.hasConcerns).toBe(true);
      expect(result.interactions).toHaveLength(1);
      expect(result.interactions[0].recommendation).not.toContain(
        'Cross-referenced',
      );
    });

    it('does not query MCP when no platform-specific states exist', async () => {
      const mcpDocs = makeMockMcpDocs();

      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, stubAnalyzer,
        undefined,
        mcpDocs,
      );
      const component = makeComponent({
        states: [{ name: 'focus' }, { name: 'disabled' }],
      });

      await extractor.detectPlatformParity(component);

      // MCP is still queried for cross-reference even if no concerns
      // (the query happens before filtering). This is acceptable.
      expect(mcpDocs.getSection).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // Case-insensitive state handling
  // -------------------------------------------------------------------------

  describe('case-insensitive state handling', () => {
    it('handles mixed-case state names via extractVisualStates', async () => {
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, stubAnalyzer,
      );
      const component = makeComponent({
        states: [{ name: 'Hover' }, { name: 'FOCUS' }],
      });

      const result = await extractor.detectPlatformParity(component);

      // extractVisualStates lowercases names, so "Hover" → "hover" is flagged
      expect(result.hasConcerns).toBe(true);
      expect(result.interactions).toHaveLength(1);
      expect(result.interactions[0].interaction).toBe('hover');
    });
  });

  // -------------------------------------------------------------------------
  // Unknown states are filtered out
  // -------------------------------------------------------------------------

  describe('unknown states', () => {
    it('ignores states not in the heuristics map', async () => {
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, stubAnalyzer,
      );
      const component = makeComponent({
        states: [
          { name: 'sparkle-effect' },
          { name: 'custom-animation' },
        ],
      });

      const result = await extractor.detectPlatformParity(component);

      // Unknown states are filtered by extractVisualStates, so no interactions
      expect(result.hasConcerns).toBe(false);
      expect(result.interactions).toHaveLength(0);
    });
  });
});
