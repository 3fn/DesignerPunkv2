/**
 * Tests for DesignExtractor.generateDesignOutlineMarkdown() — Task 3.12
 *
 * Validates markdown generation for all required design-outline sections,
 * confidence flag application, context-aware recommendations, behavioral
 * contract status, platform parity, and component token decision points.
 *
 * @spec 054b-figma-design-extract
 * @requirements Req 5 (Design Outline Quality Checklist)
 */

import { DesignExtractor } from '../DesignExtractor';
import type {
  DesignOutline,
  TokenUsage,
  BehavioralContractStatus,
  PlatformParityCheck,
  ComponentTokenDecision,
  ConfidenceReport,
  ModeValidationResult,
  InheritancePattern,
} from '../DesignExtractor';
import type { VariantMapping } from '../VariantAnalyzer';
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

// ---------------------------------------------------------------------------
// Fixture builders
// ---------------------------------------------------------------------------

function makeTokenUsage(overrides: Partial<TokenUsage> = {}): TokenUsage {
  return {
    spacing: [],
    colors: [],
    typography: [],
    radius: [],
    shadows: [],
    ...overrides,
  };
}

function makeConfidence(overrides: Partial<ConfidenceReport> = {}): ConfidenceReport {
  return {
    overall: 'high',
    exactMatches: 5,
    approximateMatches: 0,
    noMatches: 0,
    requiresHumanInput: false,
    reviewItems: [],
    ...overrides,
  };
}

function makeBehavioralContracts(
  overrides: Partial<BehavioralContractStatus> = {},
): BehavioralContractStatus {
  return {
    classification: 'static',
    detectedStates: [],
    contractsDefined: false,
    autoContract: 'No interaction — static display component',
    confidence: '✅',
    ...overrides,
  };
}

function makePlatformParity(
  overrides: Partial<PlatformParityCheck> = {},
): PlatformParityCheck {
  return {
    interactions: [],
    hasConcerns: false,
    ...overrides,
  };
}

function makeOutline(overrides: Partial<DesignOutline> = {}): DesignOutline {
  return {
    componentName: 'ButtonCTA',
    description: 'Call-to-action button component',
    variants: [],
    states: [],
    properties: [],
    tokenUsage: makeTokenUsage(),
    behavioralContracts: makeBehavioralContracts(),
    platformParity: makePlatformParity(),
    componentTokenDecisions: [],
    extractionConfidence: makeConfidence(),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DesignExtractor.generateDesignOutlineMarkdown', () => {
  let extractor: DesignExtractor;

  beforeEach(() => {
    extractor = new DesignExtractor(
      makeMockConsoleMcp(),
      stubTranslator,
      stubAnalyzer,
    );
  });

  // -------------------------------------------------------------------------
  // All required sections present
  // -------------------------------------------------------------------------

  describe('required sections', () => {
    it('generates all required sections', () => {
      const md = extractor.generateDesignOutlineMarkdown(makeOutline());

      const requiredSections = [
        '## Component Purpose',
        '## Variants',
        '## States',
        '## Token Usage',
        '## Accessibility',
        '## Platform Behaviors',
        '## Edge Cases',
        '## Extraction Confidence',
        '## Inheritance Pattern',
        '## Behavioral Contracts',
        '## Platform Parity',
        '## Component Token Needs',
        '## Accessibility Contracts',
      ];

      for (const section of requiredSections) {
        expect(md).toContain(section);
      }
    });

    it('starts with a header containing component name', () => {
      const md = extractor.generateDesignOutlineMarkdown(makeOutline());
      expect(md).toContain('# Design Outline: ButtonCTA');
    });

    it('includes extraction confidence in header', () => {
      const md = extractor.generateDesignOutlineMarkdown(makeOutline());
      expect(md).toContain('**Extraction Confidence**: ✅');
    });

    it('includes pending human review status', () => {
      const md = extractor.generateDesignOutlineMarkdown(makeOutline());
      expect(md).toContain('**Status**: Pending Human Review');
    });
  });

  // -------------------------------------------------------------------------
  // Component Purpose
  // -------------------------------------------------------------------------

  describe('Component Purpose section', () => {
    it('renders component name and description', () => {
      const md = extractor.generateDesignOutlineMarkdown(makeOutline());
      expect(md).toContain('`ButtonCTA`');
      expect(md).toContain('Call-to-action button component');
    });

    it('handles missing description', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({ description: '' }),
      );
      expect(md).toContain('_No description extracted_');
    });
  });

  // -------------------------------------------------------------------------
  // Variants
  // -------------------------------------------------------------------------

  describe('Variants section', () => {
    it('renders variant table when variants exist', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({
          variants: [
            { name: 'Primary', properties: { variant: 'primary', size: 'medium' } },
            { name: 'Secondary', properties: { variant: 'secondary' } },
          ],
        }),
      );
      expect(md).toContain('| Primary | variant=primary, size=medium |');
      expect(md).toContain('| Secondary | variant=secondary |');
    });

    it('shows empty message when no variants', () => {
      const md = extractor.generateDesignOutlineMarkdown(makeOutline());
      expect(md).toContain('_No variants detected._');
    });

    it('includes variant mapping recommendations when present', () => {
      const mapping: VariantMapping = {
        componentName: 'ButtonCTA',
        behavioralClassification: 'styling',
        recommendations: [
          {
            option: 'Option A: Single component with variant prop',
            description: 'Use a single ButtonCTA with a variant attribute.',
            rationale: 'Variants differ only in styling.',
            recommended: true,
            alignsWith: ['Component-Family-Button pattern'],
            tradeoffs: ['Less flexibility for future behavioral variants'],
          },
        ],
        conflicts: [],
        familyPattern: null,
        existingComponents: [],
      };

      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({ variantMapping: mapping }),
      );
      expect(md).toContain('### Variant Mapping Recommendations');
      expect(md).toContain('**Behavioral Classification**: styling');
      expect(md).toContain('⭐ **Recommended**');
      expect(md).toContain('Variants differ only in styling.');
    });

    it('renders mapping conflicts with human decision required', () => {
      const mapping: VariantMapping = {
        componentName: 'ButtonCTA',
        behavioralClassification: 'behavioral',
        recommendations: [],
        conflicts: [
          {
            familyRecommendation: 'Single component',
            behavioralRecommendation: 'Primitive + semantic split',
            explanation: 'Family pattern says single but behavior differs.',
          },
        ],
        familyPattern: null,
        existingComponents: [],
      };

      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({ variantMapping: mapping }),
      );
      expect(md).toContain('### ⚠️ Mapping Conflicts');
      expect(md).toContain('**Human Decision Required**');
      expect(md).toContain('Family pattern says single but behavior differs.');
    });
  });


  // -------------------------------------------------------------------------
  // Token Usage with confidence flags
  // -------------------------------------------------------------------------

  describe('Token Usage section', () => {
    it('renders token references with confidence flags', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({
          tokenUsage: makeTokenUsage({
            spacing: [
              {
                property: 'padding-left',
                token: 'space.300',
                confidence: 'exact',
                matchMethod: 'binding',
              },
              {
                property: 'margin-top',
                token: 'space.200',
                confidence: 'approximate',
                matchMethod: 'value',
                delta: '±1px',
              },
            ],
          }),
        }),
      );
      expect(md).toContain('### Spacing');
      expect(md).toContain('✅ exact');
      expect(md).toContain('⚠️ approximate');
      expect(md).toContain('±1px');
      expect(md).toContain('binding');
      expect(md).toContain('value');
    });

    it('renders semantic + primitive token display', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({
          tokenUsage: makeTokenUsage({
            colors: [
              {
                property: 'fill',
                token: 'color.purple.300',
                confidence: 'exact',
                matchMethod: 'binding',
                primitive: 'color.purple.300',
                semantic: 'color.primary',
              },
            ],
          }),
        }),
      );
      expect(md).toContain('`color.primary`');
      expect(md).toContain('primitive: `color.purple.300`');
    });

    it('renders no-match tokens with ❌ flag', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({
          tokenUsage: makeTokenUsage({
            spacing: [
              {
                property: 'gap',
                token: '',
                confidence: 'no-match',
                matchMethod: 'value',
              },
            ],
          }),
        }),
      );
      expect(md).toContain('❌ no-match');
    });

    it('shows empty message for categories with no tokens', () => {
      const md = extractor.generateDesignOutlineMarkdown(makeOutline());
      expect(md).toContain('_None detected._');
    });

    it('renders all five token categories', () => {
      const md = extractor.generateDesignOutlineMarkdown(makeOutline());
      expect(md).toContain('### Spacing');
      expect(md).toContain('### Colors');
      expect(md).toContain('### Typography');
      expect(md).toContain('### Radius');
      expect(md).toContain('### Shadows');
    });
  });

  // -------------------------------------------------------------------------
  // Extraction Confidence
  // -------------------------------------------------------------------------

  describe('Extraction Confidence section', () => {
    it('renders high confidence with ✅', () => {
      const md = extractor.generateDesignOutlineMarkdown(makeOutline());
      expect(md).toContain('**Overall**: ✅ high');
    });

    it('renders medium confidence with ⚠️', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({
          extractionConfidence: makeConfidence({ overall: 'medium' }),
        }),
      );
      expect(md).toContain('**Overall**: ⚠️ medium');
    });

    it('renders low confidence with ❌', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({
          extractionConfidence: makeConfidence({ overall: 'low' }),
        }),
      );
      expect(md).toContain('**Overall**: ❌ low');
    });

    it('shows human input required when flagged', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({
          extractionConfidence: makeConfidence({
            requiresHumanInput: true,
            reviewItems: ['No-match value for gap property', 'Missing behavioral contracts'],
          }),
        }),
      );
      expect(md).toContain('**⚠️ Human Input Required**');
      expect(md).toContain('No-match value for gap property');
      expect(md).toContain('Missing behavioral contracts');
    });

    it('renders match count metrics', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({
          extractionConfidence: makeConfidence({
            exactMatches: 10,
            approximateMatches: 3,
            noMatches: 1,
          }),
        }),
      );
      expect(md).toContain('| ✅ Exact matches | 10 |');
      expect(md).toContain('| ⚠️ Approximate matches | 3 |');
      expect(md).toContain('| ❌ No matches | 1 |');
    });
  });

  // -------------------------------------------------------------------------
  // Behavioral Contracts
  // -------------------------------------------------------------------------

  describe('Behavioral Contracts section', () => {
    it('renders interactive classification with missing contracts warning', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({
          behavioralContracts: makeBehavioralContracts({
            classification: 'interactive',
            detectedStates: ['hover', 'focus', 'disabled'],
            contractsDefined: false,
            autoContract: undefined,
            confidence: '❌',
          }),
        }),
      );
      expect(md).toContain('**Classification**: interactive ❌');
      expect(md).toContain('hover, focus, disabled');
      expect(md).toContain('**Contracts Defined**: No');
      expect(md).toContain('❌ **Action Required**');
    });

    it('renders static classification with auto-contract', () => {
      const md = extractor.generateDesignOutlineMarkdown(makeOutline());
      expect(md).toContain('**Classification**: static ✅');
      expect(md).toContain('No interaction — static display component');
    });
  });

  // -------------------------------------------------------------------------
  // Platform Parity
  // -------------------------------------------------------------------------

  describe('Platform Parity section', () => {
    it('renders no concerns when none detected', () => {
      const md = extractor.generateDesignOutlineMarkdown(makeOutline());
      expect(md).toContain('✅ No platform parity concerns detected.');
    });

    it('renders concerns with recommendations', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({
          platformParity: makePlatformParity({
            hasConcerns: true,
            interactions: [
              {
                interaction: 'hover',
                platforms: ['web'],
                recommendation: 'Map to press on mobile',
              },
            ],
          }),
        }),
      );
      expect(md).toContain('⚠️ **Platform parity concerns detected**');
      expect(md).toContain('**hover** (web): Map to press on mobile');
    });
  });

  // -------------------------------------------------------------------------
  // Component Token Needs
  // -------------------------------------------------------------------------

  describe('Component Token Needs section', () => {
    it('renders empty message when no patterns detected', () => {
      const md = extractor.generateDesignOutlineMarkdown(makeOutline());
      expect(md).toContain('_No repeated primitive token usage patterns detected._');
    });

    it('renders component token decision points with Ada review label', () => {
      const decisions: ComponentTokenDecision[] = [
        {
          primitiveToken: 'space.300',
          usageCount: 5,
          locations: ['padding-left: 5 variants', 'padding-right: 5 variants'],
          illustrativeSuggestion: 'button.padding.horizontal = space.300',
          rationale: 'Consistent horizontal padding across all button variants.',
        },
      ];

      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({ componentTokenDecisions: decisions }),
      );
      expect(md).toContain('### Pattern 1: button.padding.horizontal = space.300');
      expect(md).toContain('**Primitive Token**: `space.300`');
      expect(md).toContain('**Usage Count**: 5 locations');
      expect(md).toContain('padding-left: 5 variants');
      expect(md).toContain('pending Ada review');
      expect(md).toContain('**Ada Decision Required**');
      expect(md).toContain('Consistent horizontal padding');
    });
  });

  // -------------------------------------------------------------------------
  // Inheritance Pattern
  // -------------------------------------------------------------------------

  describe('Inheritance Pattern section', () => {
    it('renders missing pattern recommendation', () => {
      const md = extractor.generateDesignOutlineMarkdown(makeOutline());
      expect(md).toContain('_No inheritance pattern detected.');
      expect(md).toContain('Consider creating a Component-Family doc._');
    });

    it('renders inheritance pattern when present', () => {
      const pattern: InheritancePattern = {
        familyName: 'Button',
        pattern: 'Primitive + Semantic',
        baseComponent: 'ButtonBase',
      };
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({ inheritancePattern: pattern }),
      );
      expect(md).toContain('**Family**: Button');
      expect(md).toContain('**Pattern**: Primitive + Semantic');
      expect(md).toContain('**Base Component**: `ButtonBase`');
    });
  });

  // -------------------------------------------------------------------------
  // Accessibility and Accessibility Contracts
  // -------------------------------------------------------------------------

  describe('Accessibility section', () => {
    it('renders interactive accessibility requirements', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({
          behavioralContracts: makeBehavioralContracts({
            classification: 'interactive',
            confidence: '❌',
          }),
        }),
      );
      expect(md).toContain('**Component Type**: Interactive');
      expect(md).toContain('Keyboard navigation support');
      expect(md).toContain('ARIA role and attributes');
    });

    it('warns about missing focus state for interactive components', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({
          states: [{ name: 'hover' }, { name: 'disabled' }],
          behavioralContracts: makeBehavioralContracts({
            classification: 'interactive',
            confidence: '❌',
          }),
        }),
      );
      expect(md).toContain('⚠️ **No focus state detected**');
    });

    it('does not warn about focus when focus state exists', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({
          states: [{ name: 'hover' }, { name: 'focus' }],
          behavioralContracts: makeBehavioralContracts({
            classification: 'interactive',
            confidence: '❌',
          }),
        }),
      );
      expect(md).not.toContain('No focus state detected');
    });

    it('renders static accessibility requirements', () => {
      const md = extractor.generateDesignOutlineMarkdown(makeOutline());
      expect(md).toContain('**Component Type**: Static');
      expect(md).toContain('Semantic HTML element selection');
    });
  });

  describe('Accessibility Contracts section', () => {
    it('renders interactive contracts table with detected states', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({
          states: [{ name: 'focus' }, { name: 'disabled' }],
          behavioralContracts: makeBehavioralContracts({
            classification: 'interactive',
            confidence: '❌',
          }),
        }),
      );
      expect(md).toContain('| Focus visible indicator | ✅ Detected |');
      expect(md).toContain('| Disabled state handling | ✅ Detected |');
      expect(md).toContain('| Keyboard activation | ⚠️ Requires implementation review |');
    });

    it('flags missing focus and disabled for interactive components', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({
          states: [{ name: 'hover' }],
          behavioralContracts: makeBehavioralContracts({
            classification: 'interactive',
            confidence: '❌',
          }),
        }),
      );
      expect(md).toContain('| Focus visible indicator | ❌ Missing |');
      expect(md).toContain('| Disabled state handling | ⚠️ Not detected |');
    });

    it('renders static contracts table', () => {
      const md = extractor.generateDesignOutlineMarkdown(makeOutline());
      expect(md).toContain('| Semantic HTML | ⚠️ Requires implementation review |');
      expect(md).toContain('| Color contrast | ⚠️ Requires implementation review |');
    });
  });

  // -------------------------------------------------------------------------
  // Edge Cases
  // -------------------------------------------------------------------------

  describe('Edge Cases section', () => {
    it('renders no edge cases when none flagged', () => {
      const md = extractor.generateDesignOutlineMarkdown(makeOutline());
      expect(md).toContain('_No edge cases flagged._');
    });

    it('flags off-system values', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({
          tokenUsage: makeTokenUsage({
            spacing: [
              {
                property: 'gap',
                token: '',
                confidence: 'no-match',
                matchMethod: 'value',
              },
            ],
          }),
        }),
      );
      expect(md).toContain('**Off-system values detected**');
      expect(md).toContain('`gap`');
    });

    it('flags unexpected mode discrepancies', () => {
      const modeValidation: ModeValidationResult = {
        discrepancies: [
          {
            variableName: 'space/300',
            lightValue: '24px',
            darkValue: '32px',
            category: 'unexpected',
          },
        ],
        hasUnexpectedDiscrepancies: true,
      };
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({ modeValidation }),
      );
      expect(md).toContain('**Unexpected mode discrepancies**');
      expect(md).toContain('`space/300`');
    });

    it('flags missing behavioral contracts for interactive components', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({
          behavioralContracts: makeBehavioralContracts({
            classification: 'interactive',
            contractsDefined: false,
            autoContract: undefined,
            confidence: '❌',
          }),
        }),
      );
      expect(md).toContain('**Missing behavioral contracts**');
    });
  });

  // -------------------------------------------------------------------------
  // Platform Behaviors
  // -------------------------------------------------------------------------

  describe('Platform Behaviors section', () => {
    it('renders no behaviors when none detected', () => {
      const md = extractor.generateDesignOutlineMarkdown(makeOutline());
      expect(md).toContain('_No platform-specific behaviors detected._');
    });

    it('renders platform behavior table', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({
          platformParity: makePlatformParity({
            hasConcerns: true,
            interactions: [
              {
                interaction: 'hover',
                platforms: ['web'],
                recommendation: 'Map to press on mobile',
              },
              {
                interaction: 'focus',
                platforms: ['web', 'ios', 'android'],
                recommendation: 'All platforms — no action needed',
              },
            ],
          }),
        }),
      );
      expect(md).toContain('| hover | web | Map to press on mobile |');
      expect(md).toContain('| focus | web, ios, android | All platforms — no action needed |');
    });
  });

  // -------------------------------------------------------------------------
  // States
  // -------------------------------------------------------------------------

  describe('States section', () => {
    it('renders states with descriptions', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({
          states: [
            { name: 'hover', description: 'Mouse over state' },
            { name: 'disabled' },
          ],
        }),
      );
      expect(md).toContain('**hover**: Mouse over state');
      expect(md).toContain('**disabled**');
    });

    it('shows empty message when no states', () => {
      const md = extractor.generateDesignOutlineMarkdown(makeOutline());
      expect(md).toContain('_No visual states detected._');
    });
  });
});
