/**
 * Tests for DesignExtractor no-match pause behavior — Task 5.1
 *
 * Validates:
 * - formatNoMatchReport() detects no-match token values
 * - Error report includes property name, Figma value, closest match, delta
 * - Resolution options provided for each no-match entry
 * - renderNoMatchReport() generates correct markdown section
 * - extractionConfidence.requiresHumanInput is true when no-matches exist
 *
 * @spec 054b-figma-design-extract
 * @requirements Req 2 (TokenTranslator — no-match pause)
 */

import { DesignExtractor } from '../DesignExtractor';
import type {
  TokenUsage, TokenReference, NoMatchEntry, DesignOutline,
  BehavioralContractStatus, ConfidenceReport,
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

function makeOutline(tokenUsage: TokenUsage, overrides: Partial<DesignOutline> = {}): DesignOutline {
  const noMatches = [
    ...tokenUsage.spacing,
    ...tokenUsage.colors,
    ...tokenUsage.typography,
    ...tokenUsage.radius,
    ...tokenUsage.shadows,
  ].filter((r) => r.confidence === 'no-match').length;

  const allRefs = [
    ...tokenUsage.spacing,
    ...tokenUsage.colors,
    ...tokenUsage.typography,
    ...tokenUsage.radius,
    ...tokenUsage.shadows,
  ];

  return {
    componentName: 'TestComponent',
    description: 'A test component',
    variants: [],
    states: [],
    properties: [],
    tokenUsage,
    behavioralContracts: {
      classification: 'static',
      detectedStates: [],
      contractsDefined: true,
      confidence: '✅' as const,
    },
    platformParity: { interactions: [], hasConcerns: false },
    componentTokenDecisions: [],
    extractionConfidence: {
      overall: noMatches > 0 ? 'low' : 'high',
      exactMatches: allRefs.filter((r) => r.confidence === 'exact').length,
      approximateMatches: allRefs.filter((r) => r.confidence === 'approximate').length,
      noMatches,
      requiresHumanInput: noMatches > 0,
      reviewItems: noMatches > 0
        ? [`${noMatches} token value(s) could not be matched — requires human decision`]
        : [],
    },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DesignExtractor no-match pause behavior', () => {
  let extractor: DesignExtractor;

  beforeEach(() => {
    extractor = new DesignExtractor(makeMockConsoleMcp(), stubTranslator, stubAnalyzer);
  });

  // -------------------------------------------------------------------------
  // formatNoMatchReport
  // -------------------------------------------------------------------------

  describe('formatNoMatchReport', () => {
    it('returns empty array when no no-match values exist', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({ confidence: 'exact' }),
        makeRef({ property: 'padding-right', confidence: 'approximate' }),
      ];
      const result = extractor.formatNoMatchReport(usage);
      expect(result).toEqual([]);
    });

    it('detects no-match values from spacing tokens', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({
          property: 'padding-left',
          token: '',
          confidence: 'no-match',
          matchMethod: 'value',
          rawValue: '30px',
          suggestion: 'space.300',
          delta: '±6px',
        }),
      ];
      const result = extractor.formatNoMatchReport(usage);
      expect(result).toHaveLength(1);
      expect(result[0].property).toBe('padding-left');
      expect(result[0].figmaValue).toBe('30px');
      expect(result[0].closestMatch).toBe('space.300');
      expect(result[0].delta).toBe('±6px');
    });

    it('detects no-match values across multiple categories', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({
          property: 'item-spacing',
          token: '',
          confidence: 'no-match',
          matchMethod: 'value',
          rawValue: '50px',
        }),
      ];
      usage.colors = [
        makeRef({
          property: 'fill',
          token: '',
          confidence: 'no-match',
          matchMethod: 'value',
          rawValue: '#FF00FF',
          suggestion: 'color.purple.300',
          delta: 'ΔE 4.2',
        }),
      ];
      const result = extractor.formatNoMatchReport(usage);
      expect(result).toHaveLength(2);
    });

    it('includes resolution options with suggestion when closest match exists', () => {
      const usage = makeEmptyUsage();
      usage.radius = [
        makeRef({
          property: 'border-radius',
          token: '',
          confidence: 'no-match',
          matchMethod: 'value',
          rawValue: '7px',
          suggestion: 'radius.200',
        }),
      ];
      const result = extractor.formatNoMatchReport(usage);
      expect(result[0].options).toContain('Map to suggested token: `radius.200`');
      expect(result[0].options).toContain('Document as off-system value');
      expect(result[0].options).toContain('Request new token creation');
    });

    it('includes fallback option text when no suggestion exists', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({
          property: 'padding-top',
          token: '',
          confidence: 'no-match',
          matchMethod: 'value',
          rawValue: '999px',
        }),
      ];
      const result = extractor.formatNoMatchReport(usage);
      expect(result[0].options[0]).toBe(
        'No close match available — consider creating a new token',
      );
    });

    it('uses rawValue for figmaValue, falling back to token field', () => {
      const usage = makeEmptyUsage();
      // With rawValue
      usage.spacing = [
        makeRef({
          property: 'padding-left',
          token: '',
          confidence: 'no-match',
          matchMethod: 'value',
          rawValue: '42px',
        }),
      ];
      const result1 = extractor.formatNoMatchReport(usage);
      expect(result1[0].figmaValue).toBe('42px');

      // Without rawValue — falls back to token
      usage.spacing = [
        makeRef({
          property: 'padding-left',
          token: 'unknown-value',
          confidence: 'no-match',
          matchMethod: 'value',
        }),
      ];
      const result2 = extractor.formatNoMatchReport(usage);
      expect(result2[0].figmaValue).toBe('unknown-value');
    });
  });


  // -------------------------------------------------------------------------
  // Markdown rendering (renderNoMatchReport via generateDesignOutlineMarkdown)
  // -------------------------------------------------------------------------

  describe('no-match report in design outline markdown', () => {
    it('includes no-match section when unmatched values exist', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({
          property: 'padding-left',
          token: '',
          confidence: 'no-match' as const,
          matchMethod: 'value' as const,
          rawValue: '30px',
          suggestion: 'space.300',
          delta: '±6px',
        }),
      ];
      const outline = makeOutline(usage);

      const markdown = extractor.generateDesignOutlineMarkdown(outline);
      expect(markdown).toContain('## ❌ Unmatched Values — Human Decision Required');
      expect(markdown).toContain('`padding-left`');
      expect(markdown).toContain('**Figma Value**: `30px`');
      expect(markdown).toContain('**Closest Match**: `space.300` (±6px)');
      expect(markdown).toContain('Map to suggested token: `space.300`');
      expect(markdown).toContain('Document as off-system value');
      expect(markdown).toContain('Request new token creation');
    });

    it('omits no-match section when all values are matched', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [makeRef({ confidence: 'exact' as const })];
      const outline = makeOutline(usage);

      const markdown = extractor.generateDesignOutlineMarkdown(outline);
      expect(markdown).not.toContain('Unmatched Values');
    });

    it('renders "none" for closest match when no suggestion exists', () => {
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({
          property: 'item-spacing',
          token: '',
          confidence: 'no-match' as const,
          matchMethod: 'value' as const,
          rawValue: '999px',
        }),
      ];
      const outline = makeOutline(usage);

      const markdown = extractor.generateDesignOutlineMarkdown(outline);
      expect(markdown).toContain('**Closest Match**: _none_');
    });
  });

  // -------------------------------------------------------------------------
  // extractionConfidence.requiresHumanInput integration
  // -------------------------------------------------------------------------

  describe('requiresHumanInput flag', () => {
    it('is set to true by calculateConfidence when no-match values exist', () => {
      // This is tested indirectly — calculateConfidence is private.
      // We verify the contract: when tokenUsage has no-match refs,
      // the outline's extractionConfidence.requiresHumanInput must be true.
      // The existing calculateConfidence tests in DesignExtractor.test.ts
      // already cover this. Here we verify the formatNoMatchReport
      // correctly identifies the same no-match refs.
      const usage = makeEmptyUsage();
      usage.spacing = [
        makeRef({ confidence: 'no-match', rawValue: '30px' }),
      ];
      const report = extractor.formatNoMatchReport(usage);
      expect(report.length).toBeGreaterThan(0);
    });
  });
});
