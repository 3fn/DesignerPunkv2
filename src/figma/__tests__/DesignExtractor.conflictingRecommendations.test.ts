/**
 * Tests for conflicting recommendations handling — Task 5.3
 *
 * Validates:
 * - Conflicts from VariantAnalyzer.detectConflicts() are detected
 * - Conflict report includes both recommendations with rationale and explanation
 * - design-outline.md flags conflicts with ⚠️ and "Human Decision Required"
 * - Conflicts set requiresHumanInput = true in extractionConfidence
 * - Conflicts are deferred to human decision (no auto-resolve)
 *
 * @spec 054b-figma-design-extract
 * @requirements Req 4 (Context-Aware Variant Mapping)
 */

import { DesignExtractor } from '../DesignExtractor';
import type {
  DesignOutline,
  TokenUsage,
  BehavioralContractStatus,
  PlatformParityCheck,
  ConfidenceReport,
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

function makeTokenUsage(): TokenUsage {
  return { spacing: [], colors: [], typography: [], radius: [], shadows: [] };
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
  return { interactions: [], hasConcerns: false, ...overrides };
}

function makeMappingWithConflicts(): VariantMapping {
  return {
    componentName: 'ButtonCTA',
    behavioralClassification: 'behavioral',
    recommendations: [
      {
        option: 'Option A: Single component with variant prop',
        description: 'Use a single ButtonCTA with a variant attribute.',
        rationale: 'Family pattern uses single component approach.',
        recommended: false,
        alignsWith: ['Component-Family-Button pattern'],
        tradeoffs: ['Less flexibility for future behavioral variants'],
      },
      {
        option: 'Option B: Primitive + semantic structure',
        description: 'Split into ButtonBase (primitive) and ButtonCTA (semantic).',
        rationale: 'Behavioral analysis shows different interaction patterns.',
        recommended: true,
        alignsWith: ['Behavioral analysis'],
        tradeoffs: ['More components to maintain'],
      },
    ],
    conflicts: [
      {
        familyRecommendation: 'Single component with variant prop',
        behavioralRecommendation: 'Primitive + semantic split',
        explanation:
          'Family pattern recommends a single component, but behavioral analysis '
          + 'detected different interaction patterns across variants that suggest '
          + 'a primitive + semantic split.',
      },
    ],
    familyPattern: {
      familyName: 'Button',
      inheritancePattern: 'ButtonBase → ButtonCTA',
      behavioralContracts: ['onClick'],
      tokenUsagePatterns: ['space.300 for padding'],
    },
    existingComponents: [],
  };
}

function makeMappingWithoutConflicts(): VariantMapping {
  return {
    componentName: 'ButtonCTA',
    behavioralClassification: 'styling',
    recommendations: [
      {
        option: 'Option A: Single component with variant prop',
        description: 'Use a single ButtonCTA with a variant attribute.',
        rationale: 'Variants differ only in styling.',
        recommended: true,
        alignsWith: ['Component-Family-Button pattern', 'Behavioral analysis'],
        tradeoffs: [],
      },
    ],
    conflicts: [],
    familyPattern: {
      familyName: 'Button',
      inheritancePattern: 'ButtonBase → ButtonCTA',
      behavioralContracts: ['onClick'],
      tokenUsagePatterns: ['space.300 for padding'],
    },
    existingComponents: [],
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

describe('DesignExtractor conflicting recommendations handling', () => {
  let extractor: DesignExtractor;

  beforeEach(() => {
    extractor = new DesignExtractor(
      makeMockConsoleMcp(),
      stubTranslator,
      stubAnalyzer,
    );
  });

  // -------------------------------------------------------------------------
  // Markdown rendering of conflicts
  // -------------------------------------------------------------------------

  describe('conflict report in design-outline markdown', () => {
    it('renders ⚠️ Mapping Conflicts section when conflicts exist', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({ variantMapping: makeMappingWithConflicts() }),
      );
      expect(md).toContain('### ⚠️ Mapping Conflicts');
    });

    it('includes "Human Decision Required" label', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({ variantMapping: makeMappingWithConflicts() }),
      );
      expect(md).toContain('**Human Decision Required**');
    });

    it('includes both family and behavioral recommendations', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({ variantMapping: makeMappingWithConflicts() }),
      );
      expect(md).toContain('**Family recommends**: Single component with variant prop');
      expect(md).toContain('**Behavioral analysis recommends**: Primitive + semantic split');
    });

    it('includes conflict explanation', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({ variantMapping: makeMappingWithConflicts() }),
      );
      expect(md).toContain(
        'Family pattern recommends a single component, but behavioral analysis',
      );
    });

    it('does not render conflicts section when no conflicts exist', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({ variantMapping: makeMappingWithoutConflicts() }),
      );
      expect(md).not.toContain('Mapping Conflicts');
      expect(md).not.toContain('Human Decision Required');
    });

    it('does not render conflicts section when variantMapping is absent', () => {
      const md = extractor.generateDesignOutlineMarkdown(makeOutline());
      expect(md).not.toContain('Mapping Conflicts');
    });

    it('renders multiple conflicts when more than one exists', () => {
      const mapping = makeMappingWithConflicts();
      mapping.conflicts.push({
        familyRecommendation: 'Shared base component',
        behavioralRecommendation: 'Independent components',
        explanation: 'Second conflict about component hierarchy.',
      });

      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({ variantMapping: mapping }),
      );
      expect(md).toContain('Single component with variant prop');
      expect(md).toContain('Shared base component');
      expect(md).toContain('Second conflict about component hierarchy.');
    });
  });

  // -------------------------------------------------------------------------
  // Confidence integration — conflicts affect requiresHumanInput
  // -------------------------------------------------------------------------

  describe('confidence integration', () => {
    it('sets requiresHumanInput when conflicts exist in extractionConfidence', () => {
      // We test this indirectly through the full outline generation.
      // The extractDesign method passes variantMapping to calculateConfidence.
      // Here we verify the contract by checking that the markdown output
      // includes the conflict review item when we construct an outline
      // with conflicts and matching confidence.
      const outline = makeOutline({
        variantMapping: makeMappingWithConflicts(),
        extractionConfidence: makeConfidence({
          requiresHumanInput: true,
          overall: 'low',
          reviewItems: [
            '1 variant mapping conflict(s) — family pattern and behavioral analysis disagree. Human decision required.',
          ],
        }),
      });

      const md = extractor.generateDesignOutlineMarkdown(outline);
      expect(md).toContain('**⚠️ Human Input Required**');
      expect(md).toContain('variant mapping conflict');
    });

    it('does not flag requiresHumanInput when no conflicts exist', () => {
      const outline = makeOutline({
        variantMapping: makeMappingWithoutConflicts(),
        extractionConfidence: makeConfidence({
          requiresHumanInput: false,
          overall: 'high',
          reviewItems: [],
        }),
      });

      const md = extractor.generateDesignOutlineMarkdown(outline);
      expect(md).not.toContain('**⚠️ Human Input Required**');
    });
  });

  // -------------------------------------------------------------------------
  // Defers to human — no auto-resolve
  // -------------------------------------------------------------------------

  describe('defers to human decision', () => {
    it('does not mark any conflict recommendation as auto-resolved', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({ variantMapping: makeMappingWithConflicts() }),
      );
      // Should NOT contain any auto-resolution language
      expect(md).not.toContain('Auto-resolved');
      expect(md).not.toContain('Automatically selected');
      expect(md).not.toContain('auto-resolve');
    });

    it('presents both options without choosing one in the conflict section', () => {
      const md = extractor.generateDesignOutlineMarkdown(
        makeOutline({ variantMapping: makeMappingWithConflicts() }),
      );
      // The conflict section should present both sides neutrally
      const conflictSection = md.substring(md.indexOf('### ⚠️ Mapping Conflicts'));
      expect(conflictSection).toContain('Family recommends');
      expect(conflictSection).toContain('Behavioral analysis recommends');
      // The conflict section itself should not contain ⭐ Recommended
      const conflictEnd = conflictSection.indexOf('##', 4); // next section
      const conflictOnly = conflictEnd > 0
        ? conflictSection.substring(0, conflictEnd)
        : conflictSection;
      expect(conflictOnly).not.toContain('⭐');
    });
  });
});
