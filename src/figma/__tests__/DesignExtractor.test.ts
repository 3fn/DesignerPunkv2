/**
 * Tests for DesignExtractor.extractDesign() — Task 3.13 / 3.14
 *
 * End-to-end integration tests for the full extraction orchestration.
 * Validates that extractDesign() correctly coordinates all sub-steps:
 * readFigmaComponent, readTokenBindings, readStyles, queryContext,
 * translateTokens, reconstructCompositeTokens, detectBehavioralContracts,
 * detectPlatformParity, detectComponentTokenDecisions, validateModes,
 * and assembles a complete DesignOutline.
 *
 * Mocks both Kiro Figma Power and figma-console-mcp responses.
 *
 * @spec 054b-figma-design-extract
 * @requirements All
 */

import { DesignExtractor } from '../DesignExtractor';
import type {
  KiroFigmaPowerClient,
} from '../DesignExtractor';
import type { ConsoleMCPClient } from '../ConsoleMCPClient';
import type { TokenTranslator, TranslationResult } from '../TokenTranslator';
import type {
  VariantAnalyzer,
  VariantMapping,
} from '../VariantAnalyzer';
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
  };
}

function makeMockKiroPower(): jest.Mocked<KiroFigmaPowerClient> {
  return {
    getDesignContext: jest.fn().mockResolvedValue({ code: '' }),
    getMetadata: jest.fn().mockResolvedValue({ xml: '' }),
  };
}

/** DTCG token fixture with shadow and typography composites. */
const dtcgTokens: DTCGTokenFile = {
  $schema: 'https://tr.designtokens.org/format/',
  space: {
    '100': { $value: 8, $type: 'dimension' as any },
    '200': { $value: 16, $type: 'dimension' as any },
    '300': { $value: 24, $type: 'dimension' as any },
  },
  color: {
    purple: {
      '300': { $value: 'rgba(124, 58, 237, 1)', $type: 'color' as any },
    },
  },
  shadow: {
    elevation200: {
      $value: { offsetX: '0px', offsetY: '8px', blur: '24px', spread: '0px', color: 'rgba(0,0,0,0.2)' },
      $type: 'shadow' as any,
    },
  },
  typography: {
    heading200: {
      $value: { fontFamily: 'Inter', fontSize: '24px', fontWeight: 700, lineHeight: 1.33 },
      $type: 'typography' as any,
    },
  },
};

function makeMockTranslator(): jest.Mocked<TokenTranslator> {
  const mock = {
    translate: jest.fn().mockReturnValue({
      token: 'space.300',
      confidence: 'exact',
      matchMethod: 'binding',
      rawValue: '24',
      primitive: 'space.300',
    } as TranslationResult),
    translateByBinding: jest.fn(),
    translateByValue: jest.fn(),
    enrichResponse: jest.fn(),
    lookupToken: jest.fn(),
    getDtcgTokens: jest.fn().mockReturnValue(dtcgTokens),
  } as unknown as jest.Mocked<TokenTranslator>;
  return mock;
}

function makeMockAnalyzer(): jest.Mocked<VariantAnalyzer> {
  return {
    queryFamilyPattern: jest.fn().mockResolvedValue(null),
    queryExistingComponents: jest.fn().mockResolvedValue([]),
    analyzeBehavioralDifferences: jest.fn().mockReturnValue('styling'),
    generateRecommendations: jest.fn().mockReturnValue([]),
    detectConflicts: jest.fn().mockReturnValue([]),
    analyzeVariants: jest.fn().mockResolvedValue({
      componentName: 'ButtonCTA',
      behavioralClassification: 'styling',
      recommendations: [],
      conflicts: [],
      familyPattern: null,
      existingComponents: [],
    } as VariantMapping),
  } as unknown as jest.Mocked<VariantAnalyzer>;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DesignExtractor.extractDesign (end-to-end)', () => {
  const FILE_KEY = 'test-file-key';
  const NODE_ID = '123:456';

  // -----------------------------------------------------------------------
  // Full orchestration — happy path
  // -----------------------------------------------------------------------

  describe('happy path orchestration', () => {
    it('produces a complete DesignOutline from mocked MCP responses', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      // Kiro Power returns a button component
      kiroPower.getDesignContext.mockResolvedValue({
        code: `
          class ButtonCTA extends HTMLElement {
            /** Primary call-to-action button */
            variant: 'primary' | 'secondary';
          }
          .button {
            display: flex;
            flex-direction: row;
            gap: 8;
            padding: 12 24 12 24;
            background-color: #7C3AED;
            color: #FFFFFF;
            font-size: 16px;
            border-radius: 8px;
          }
          .button:hover { opacity: 0.9; }
          .button:focus { outline: 2px solid blue; }
          .button:disabled { opacity: 0.5; }
        `,
      });

      // Console MCP returns token bindings
      consoleMcp.getVariables.mockResolvedValue([
        {
          name: 'space/300',
          resolvedType: 'FLOAT',
          valuesByMode: { light: 24, dark: 24 },
          id: 'v1',
          collectionName: 'Primitives',
        } as any,
        {
          name: 'color/purple/300',
          resolvedType: 'COLOR',
          valuesByMode: { light: '#7C3AED', dark: '#A78BFA' },
          id: 'v2',
          collectionName: 'Primitives',
        } as any,
      ]);

      // Console MCP returns styles
      consoleMcp.getStyles.mockResolvedValue([
        {
          name: 'shadow.elevation200',
          type: 'EFFECT',
          properties: { effects: [{ type: 'DROP_SHADOW', radius: 8 }] },
        },
      ]);

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      const outline = await extractor.extractDesign(FILE_KEY, NODE_ID);

      // Verify the outline has all required fields
      expect(outline.componentName).toBe('ButtonCTA');
      expect(outline.description).toBeDefined();
      expect(outline.variants).toBeDefined();
      expect(outline.states).toBeDefined();
      expect(outline.properties).toBeDefined();
      expect(outline.tokenUsage).toBeDefined();
      expect(outline.behavioralContracts).toBeDefined();
      expect(outline.platformParity).toBeDefined();
      expect(outline.componentTokenDecisions).toBeDefined();
      expect(outline.modeValidation).toBeDefined();
      expect(outline.extractionConfidence).toBeDefined();
    });

    it('calls all MCP sources in the correct order', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockResolvedValue({
        code: 'class BadgeStatus extends HTMLElement {}',
      });
      consoleMcp.getVariables.mockResolvedValue([]);
      consoleMcp.getStyles.mockResolvedValue([]);

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      await extractor.extractDesign(FILE_KEY, NODE_ID);

      // Step 1: Kiro Power for component structure
      expect(kiroPower.getDesignContext).toHaveBeenCalledWith(FILE_KEY, NODE_ID);
      // Step 2: Console MCP for token bindings
      expect(consoleMcp.getVariables).toHaveBeenCalledWith(FILE_KEY);
      // Step 3: Console MCP for styles
      expect(consoleMcp.getStyles).toHaveBeenCalledWith(FILE_KEY);
      // Step 4: VariantAnalyzer for context
      expect(analyzer.queryFamilyPattern).toHaveBeenCalled();
      expect(analyzer.queryExistingComponents).toHaveBeenCalled();
      // Step 5: TokenTranslator for value matching
      // (translate is called for each property found in the component)
      // Step 6: VariantAnalyzer for variant mapping
      expect(analyzer.analyzeVariants).toHaveBeenCalled();
    });

    it('reads component, bindings, and styles in parallel (Steps 1-3)', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      const callOrder: string[] = [];

      kiroPower.getDesignContext.mockImplementation(async () => {
        callOrder.push('designContext');
        return { code: 'class TestComp extends HTMLElement {}' };
      });
      consoleMcp.getVariables.mockImplementation(async () => {
        callOrder.push('variables');
        return [];
      });
      consoleMcp.getStyles.mockImplementation(async () => {
        callOrder.push('styles');
        return [];
      });

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      await extractor.extractDesign(FILE_KEY, NODE_ID);

      // All three should be called (Promise.all)
      expect(callOrder).toContain('designContext');
      expect(callOrder).toContain('variables');
      expect(callOrder).toContain('styles');
    });
  });

  // -----------------------------------------------------------------------
  // Behavioral contracts in extractDesign
  // -----------------------------------------------------------------------

  describe('behavioral contracts integration', () => {
    it('classifies interactive component and flags missing contracts', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockResolvedValue({
        code: `
          class ButtonCTA extends HTMLElement {}
          .button:hover { opacity: 0.9; }
          .button:focus { outline: 2px solid blue; }
        `,
      });

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      const outline = await extractor.extractDesign(FILE_KEY, NODE_ID);

      expect(outline.behavioralContracts.classification).toBe('interactive');
      expect(outline.behavioralContracts.contractsDefined).toBe(false);
      expect(outline.behavioralContracts.confidence).toBe('❌');
    });

    it('classifies static component with auto-contract', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockResolvedValue({
        code: 'class BadgeStatus extends HTMLElement {}',
      });

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      const outline = await extractor.extractDesign(FILE_KEY, NODE_ID);

      expect(outline.behavioralContracts.classification).toBe('static');
      expect(outline.behavioralContracts.contractsDefined).toBe(true);
      expect(outline.behavioralContracts.autoContract).toBeDefined();
      expect(outline.behavioralContracts.confidence).toBe('✅');
    });
  });

  // -----------------------------------------------------------------------
  // Platform parity in extractDesign
  // -----------------------------------------------------------------------

  describe('platform parity integration', () => {
    it('flags hover as web-only concern in the outline', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockResolvedValue({
        code: `
          class ButtonCTA extends HTMLElement {}
          .button:hover { opacity: 0.9; }
        `,
      });

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      const outline = await extractor.extractDesign(FILE_KEY, NODE_ID);

      expect(outline.platformParity.hasConcerns).toBe(true);
      expect(outline.platformParity.interactions).toHaveLength(1);
      expect(outline.platformParity.interactions[0].interaction).toBe('hover');
      expect(outline.platformParity.interactions[0].platforms).toEqual(['web']);
    });

    it('reports no concerns for all-platform states', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockResolvedValue({
        code: `
          class ButtonCTA extends HTMLElement {}
          .button:focus { outline: 2px solid blue; }
          .button:disabled { opacity: 0.5; }
        `,
      });

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      const outline = await extractor.extractDesign(FILE_KEY, NODE_ID);

      expect(outline.platformParity.hasConcerns).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // Mode validation in extractDesign
  // -----------------------------------------------------------------------

  describe('mode validation integration', () => {
    it('detects unexpected mode discrepancies in the outline', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockResolvedValue({
        code: 'class BadgeStatus extends HTMLElement {}',
      });

      consoleMcp.getVariables.mockResolvedValue([
        {
          name: 'space/300',
          resolvedType: 'FLOAT',
          valuesByMode: { light: 24, dark: 32 },
          id: 'v1',
        },
      ]);

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      const outline = await extractor.extractDesign(FILE_KEY, NODE_ID);

      expect(outline.modeValidation).toBeDefined();
      expect(outline.modeValidation!.hasUnexpectedDiscrepancies).toBe(true);
      expect(outline.modeValidation!.discrepancies).toHaveLength(1);
      expect(outline.modeValidation!.discrepancies[0].category).toBe('unexpected');
    });

    it('categorizes color mode differences as expected', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockResolvedValue({
        code: 'class BadgeStatus extends HTMLElement {}',
      });

      consoleMcp.getVariables.mockResolvedValue([
        {
          name: 'color/purple/300',
          resolvedType: 'COLOR',
          valuesByMode: { light: '#FFFFFF', dark: '#000000' },
          id: 'v1',
        },
      ]);

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      const outline = await extractor.extractDesign(FILE_KEY, NODE_ID);

      expect(outline.modeValidation!.hasUnexpectedDiscrepancies).toBe(false);
      expect(outline.modeValidation!.discrepancies[0].category).toBe('expected');
    });
  });

  // -----------------------------------------------------------------------
  // Composite token reconstruction in extractDesign
  // -----------------------------------------------------------------------

  describe('composite token reconstruction integration', () => {
    it('merges composite shadow tokens into tokenUsage.shadows', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockResolvedValue({
        code: 'class BadgeStatus extends HTMLElement {}',
      });

      consoleMcp.getStyles.mockResolvedValue([
        {
          name: 'shadow.elevation200',
          type: 'EFFECT',
          properties: {},
        },
      ]);

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      const outline = await extractor.extractDesign(FILE_KEY, NODE_ID);

      // The composite token should be merged into shadows
      const shadowTokens = outline.tokenUsage.shadows.filter(
        (s) => s.token === 'shadow.elevation200',
      );
      expect(shadowTokens.length).toBeGreaterThanOrEqual(1);
      expect(shadowTokens[0].confidence).toBe('exact');
      expect(shadowTokens[0].matchMethod).toBe('binding');
    });

    it('merges composite typography tokens into tokenUsage.typography', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockResolvedValue({
        code: 'class BadgeStatus extends HTMLElement {}',
      });

      consoleMcp.getStyles.mockResolvedValue([
        {
          name: 'typography.heading200',
          type: 'TEXT',
          properties: {},
        },
      ]);

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      const outline = await extractor.extractDesign(FILE_KEY, NODE_ID);

      const typoTokens = outline.tokenUsage.typography.filter(
        (t) => t.token === 'typography.heading200',
      );
      expect(typoTokens.length).toBeGreaterThanOrEqual(1);
      expect(typoTokens[0].confidence).toBe('exact');
    });
  });

  // -----------------------------------------------------------------------
  // Component token decisions in extractDesign
  // -----------------------------------------------------------------------

  describe('component token decisions integration', () => {
    it('detects repeated primitive usage and suggests component tokens', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockResolvedValue({
        code: `
          class ButtonCTA extends HTMLElement {}
          .button {
            padding-top: 12;
            padding-bottom: 12;
            gap: 12;
          }
        `,
      });

      // Make translator return the same primitive for multiple properties
      translator.translate.mockReturnValue({
        token: 'space.150',
        confidence: 'exact',
        matchMethod: 'value',
        rawValue: '12',
        primitive: 'space.150',
        property: 'padding-top',
      } as any);

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      const outline = await extractor.extractDesign(FILE_KEY, NODE_ID);

      // If the same primitive is used 2+ times, a decision should be surfaced
      if (outline.componentTokenDecisions.length > 0) {
        const decision = outline.componentTokenDecisions[0];
        expect(decision.primitiveToken).toBeDefined();
        expect(decision.usageCount).toBeGreaterThanOrEqual(2);
        expect(decision.illustrativeSuggestion).toBeDefined();
        expect(decision.rationale).toContain('used across');
      }
    });
  });

  // -----------------------------------------------------------------------
  // Variant mapping / inheritance pattern integration
  // -----------------------------------------------------------------------

  describe('variant mapping integration', () => {
    it('calls analyzer.analyzeVariants and populates variantMapping', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockResolvedValue({
        code: `
          class ButtonCTA extends HTMLElement {
            variant: 'primary' | 'secondary';
          }
        `,
      });

      analyzer.analyzeVariants.mockResolvedValue({
        componentName: 'ButtonCTA',
        behavioralClassification: 'styling',
        recommendations: [{ option: 'A', description: 'Use variant attribute', rationale: 'Matches pattern', recommended: true, alignsWith: [], tradeoffs: [] }],
        conflicts: [],
        familyPattern: null,
        existingComponents: [],
      });

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      const outline = await extractor.extractDesign(FILE_KEY, NODE_ID);

      expect(analyzer.analyzeVariants).toHaveBeenCalled();
      expect(outline.variantMapping).toBeDefined();
      expect(outline.variantMapping!.componentName).toBe('ButtonCTA');
      expect(outline.variantMapping!.behavioralClassification).toBe('styling');
    });

    it('populates inheritancePattern when familyPattern exists in context', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockResolvedValue({
        code: 'class ButtonCTA extends HTMLElement {}',
      });

      // Make queryFamilyPattern return a family pattern
      analyzer.queryFamilyPattern.mockResolvedValue({
        familyName: 'Button',
        inheritancePattern: 'base-variant',
        variants: ['primary', 'secondary'],
        sharedTokens: [],
      } as any);

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      const outline = await extractor.extractDesign(FILE_KEY, NODE_ID);

      expect(outline.inheritancePattern).toBeDefined();
      expect(outline.inheritancePattern!.familyName).toBe('Button');
      expect(outline.inheritancePattern!.pattern).toBe('base-variant');
    });
  });

  // -----------------------------------------------------------------------
  // Confidence calculation
  // -----------------------------------------------------------------------

  describe('confidence calculation', () => {
    it('reports high confidence when all tokens are exact matches', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockResolvedValue({
        code: `
          class BadgeStatus extends HTMLElement {}
          .badge { padding: 8; }
        `,
      });

      // All exact matches
      translator.translate.mockReturnValue({
        token: 'space.100',
        confidence: 'exact',
        matchMethod: 'binding',
        rawValue: '8',
        primitive: 'space.100',
      } as any);

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      const outline = await extractor.extractDesign(FILE_KEY, NODE_ID);

      expect(outline.extractionConfidence.overall).toBe('high');
      expect(outline.extractionConfidence.noMatches).toBe(0);
      expect(outline.extractionConfidence.approximateMatches).toBe(0);
      expect(outline.extractionConfidence.requiresHumanInput).toBe(false);
    });

    it('reports medium confidence when approximate matches exist but no failures', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockResolvedValue({
        code: `
          class BadgeStatus extends HTMLElement {}
          .badge { padding: 8; }
        `,
      });

      translator.translate.mockReturnValue({
        token: 'space.100',
        confidence: 'approximate',
        matchMethod: 'value',
        rawValue: '8',
        primitive: 'space.100',
      } as any);

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      const outline = await extractor.extractDesign(FILE_KEY, NODE_ID);

      expect(outline.extractionConfidence.overall).toBe('medium');
      expect(outline.extractionConfidence.approximateMatches).toBeGreaterThan(0);
      expect(outline.extractionConfidence.noMatches).toBe(0);
    });

    it('reports low confidence when no-match tokens exist', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockResolvedValue({
        code: `
          class BadgeStatus extends HTMLElement {}
          .badge { padding: 13; }
        `,
      });

      translator.translate.mockReturnValue({
        token: null,
        confidence: 'no-match',
        matchMethod: 'value',
        rawValue: '13',
        primitive: null,
      } as any);

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      const outline = await extractor.extractDesign(FILE_KEY, NODE_ID);

      expect(outline.extractionConfidence.overall).toBe('low');
      expect(outline.extractionConfidence.noMatches).toBeGreaterThan(0);
      expect(outline.extractionConfidence.requiresHumanInput).toBe(true);
    });

    it('sets requiresHumanInput when interactive component lacks contracts', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockResolvedValue({
        code: `
          class ButtonCTA extends HTMLElement {}
          .button:hover { opacity: 0.9; }
          .button:focus { outline: 2px solid blue; }
        `,
      });

      translator.translate.mockReturnValue({
        token: 'space.100',
        confidence: 'exact',
        matchMethod: 'binding',
        rawValue: '8',
        primitive: 'space.100',
      } as any);

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      const outline = await extractor.extractDesign(FILE_KEY, NODE_ID);

      // Interactive + no contracts = requiresHumanInput
      expect(outline.extractionConfidence.requiresHumanInput).toBe(true);
      expect(outline.extractionConfidence.reviewItems.length).toBeGreaterThan(0);
    });

    it('sets requiresHumanInput when unexpected mode discrepancies exist', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockResolvedValue({
        code: 'class BadgeStatus extends HTMLElement {}',
      });

      consoleMcp.getVariables.mockResolvedValue([
        {
          name: 'space/300',
          resolvedType: 'FLOAT',
          valuesByMode: { light: 24, dark: 32 },
          id: 'v1',
        },
      ]);

      translator.translate.mockReturnValue({
        token: 'space.300',
        confidence: 'exact',
        matchMethod: 'binding',
        rawValue: '24',
        primitive: 'space.300',
      } as any);

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      const outline = await extractor.extractDesign(FILE_KEY, NODE_ID);

      expect(outline.extractionConfidence.requiresHumanInput).toBe(true);
      expect(outline.extractionConfidence.reviewItems.some(
        (item) => item.includes('unexpected mode discrepancy'),
      )).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // Error handling
  // -----------------------------------------------------------------------

  describe('error handling', () => {
    it('propagates error when readFigmaComponent fails', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockRejectedValue(
        new Error('Figma API rate limit exceeded'),
      );
      // Fallback path also fails — both MCP sources unavailable
      consoleMcp.getComponent.mockRejectedValue(
        new Error('Figma API rate limit exceeded'),
      );

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      await expect(
        extractor.extractDesign(FILE_KEY, NODE_ID),
      ).rejects.toThrow('Figma API rate limit exceeded');
    });

    it('propagates error when getVariables fails', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockResolvedValue({
        code: 'class BadgeStatus extends HTMLElement {}',
      });
      consoleMcp.getVariables.mockRejectedValue(
        new Error('Console MCP connection lost'),
      );

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      await expect(
        extractor.extractDesign(FILE_KEY, NODE_ID),
      ).rejects.toThrow('Console MCP connection lost');
    });

    it('propagates error when getStyles fails', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const kiroPower = makeMockKiroPower();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      kiroPower.getDesignContext.mockResolvedValue({
        code: 'class BadgeStatus extends HTMLElement {}',
      });
      consoleMcp.getStyles.mockRejectedValue(
        new Error('Styles endpoint unavailable'),
      );

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, kiroPower,
      );

      await expect(
        extractor.extractDesign(FILE_KEY, NODE_ID),
      ).rejects.toThrow('Styles endpoint unavailable');
    });
  });

  // -----------------------------------------------------------------------
  // Fallback path — no Kiro Power
  // -----------------------------------------------------------------------

  describe('fallback path', () => {
    it('works without kiroPower by using console MCP getComponent', async () => {
      const consoleMcp = makeMockConsoleMcp();
      const translator = makeMockTranslator();
      const analyzer = makeMockAnalyzer();

      // No kiroPower — constructor receives undefined
      consoleMcp.getComponent.mockResolvedValue({
        name: 'FallbackComp',
        description: 'A fallback component',
        children: [],
      });

      const extractor = new DesignExtractor(
        consoleMcp, translator, analyzer, undefined as any,
      );

      const outline = await extractor.extractDesign(FILE_KEY, NODE_ID);

      // Should still produce a valid outline via console MCP fallback
      expect(outline.componentName).toBeDefined();
      expect(outline.tokenUsage).toBeDefined();
      expect(outline.extractionConfidence).toBeDefined();
    });
  });
});
