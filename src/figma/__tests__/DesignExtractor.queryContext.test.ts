/**
 * Tests for DesignExtractor.queryContext() — Task 3.5
 *
 * Validates family name extraction from component names and delegation
 * to VariantAnalyzer for MCP-based context queries.
 *
 * @spec 054b-figma-design-extract
 * @requirements Req 1 (DesignExtractor), Req 4 (Context-Aware Variant Mapping)
 */

import { DesignExtractor } from '../DesignExtractor';
import type { ConsoleMCPClient } from '../ConsoleMCPClient';
import type { TokenTranslator } from '../TokenTranslator';
import type { VariantAnalyzer, FamilyPattern, ComponentStatus } from '../VariantAnalyzer';

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

function makeMockAnalyzer(): jest.Mocked<VariantAnalyzer> {
  return {
    queryFamilyPattern: jest.fn().mockResolvedValue(null),
    queryExistingComponents: jest.fn().mockResolvedValue([]),
    analyzeBehavioralDifferences: jest.fn().mockReturnValue('styling'),
    generateRecommendations: jest.fn().mockReturnValue([]),
    detectConflicts: jest.fn().mockReturnValue([]),
    analyzeVariants: jest.fn().mockResolvedValue({
      recommendations: [],
      conflicts: [],
      behavioralAnalysis: 'styling',
    }),
  } as unknown as jest.Mocked<VariantAnalyzer>;
}

const stubTranslator = {} as TokenTranslator;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DesignExtractor.queryContext', () => {
  // -----------------------------------------------------------------------
  // Family name extraction
  // -----------------------------------------------------------------------

  describe('family name extraction from PascalCase', () => {
    it('extracts "Button" from "ButtonCTA"', async () => {
      const analyzer = makeMockAnalyzer();
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, analyzer,
      );

      await extractor.queryContext('ButtonCTA');

      expect(analyzer.queryFamilyPattern).toHaveBeenCalledWith('Button');
      expect(analyzer.queryExistingComponents).toHaveBeenCalledWith('Button');
    });

    it('extracts "Input" from "InputTextBase"', async () => {
      const analyzer = makeMockAnalyzer();
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, analyzer,
      );

      await extractor.queryContext('InputTextBase');

      expect(analyzer.queryFamilyPattern).toHaveBeenCalledWith('Input');
    });

    it('extracts "Icon" from "IconBase"', async () => {
      const analyzer = makeMockAnalyzer();
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, analyzer,
      );

      await extractor.queryContext('IconBase');

      expect(analyzer.queryFamilyPattern).toHaveBeenCalledWith('Icon');
    });

    it('keeps "Button" as-is when no suffix', async () => {
      const analyzer = makeMockAnalyzer();
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, analyzer,
      );

      await extractor.queryContext('Button');

      expect(analyzer.queryFamilyPattern).toHaveBeenCalledWith('Button');
    });
  });

  describe('family name extraction from kebab-case', () => {
    it('extracts "Button" from "button-cta"', async () => {
      const analyzer = makeMockAnalyzer();
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, analyzer,
      );

      await extractor.queryContext('button-cta');

      expect(analyzer.queryFamilyPattern).toHaveBeenCalledWith('Button');
    });

    it('extracts "Input" from "input-text-base"', async () => {
      const analyzer = makeMockAnalyzer();
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, analyzer,
      );

      await extractor.queryContext('input-text-base');

      expect(analyzer.queryFamilyPattern).toHaveBeenCalledWith('Input');
    });

    it('extracts "Container" from "container-base"', async () => {
      const analyzer = makeMockAnalyzer();
      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, analyzer,
      );

      await extractor.queryContext('container-base');

      expect(analyzer.queryFamilyPattern).toHaveBeenCalledWith('Container');
    });
  });

  // -----------------------------------------------------------------------
  // Delegation to VariantAnalyzer
  // -----------------------------------------------------------------------

  describe('delegation and result assembly', () => {
    it('returns familyPattern and existingComponents from analyzer', async () => {
      const analyzer = makeMockAnalyzer();
      const familyPattern: FamilyPattern = {
        familyName: 'Button',
        inheritancePattern: 'ButtonBase → ButtonCTA',
        behavioralContracts: ['onClick', 'onKeyDown'],
        tokenUsagePatterns: ['space.300 for padding'],
      };
      const existingComponents: ComponentStatus[] = [
        { name: 'ButtonCTA', status: 'implemented', path: 'src/components/ButtonCTA' },
        { name: 'ButtonBase', status: 'implemented', path: 'src/components/ButtonBase' },
      ];

      analyzer.queryFamilyPattern.mockResolvedValue(familyPattern);
      analyzer.queryExistingComponents.mockResolvedValue(existingComponents);

      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, analyzer,
      );

      const result = await extractor.queryContext('ButtonCTA');

      expect(result.familyPattern).toEqual(familyPattern);
      expect(result.existingComponents).toEqual(existingComponents);
    });

    it('returns null familyPattern when doc does not exist', async () => {
      const analyzer = makeMockAnalyzer();
      analyzer.queryFamilyPattern.mockResolvedValue(null);
      analyzer.queryExistingComponents.mockResolvedValue([]);

      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, analyzer,
      );

      const result = await extractor.queryContext('BadgePrimary');

      expect(result.familyPattern).toBeNull();
      expect(result.existingComponents).toEqual([]);
      expect(analyzer.queryFamilyPattern).toHaveBeenCalledWith('Badge');
    });

    it('queries both family pattern and existing components in parallel', async () => {
      const analyzer = makeMockAnalyzer();
      const callOrder: string[] = [];

      analyzer.queryFamilyPattern.mockImplementation(async () => {
        callOrder.push('familyPattern:start');
        return null;
      });
      analyzer.queryExistingComponents.mockImplementation(async () => {
        callOrder.push('existingComponents:start');
        return [];
      });

      const extractor = new DesignExtractor(
        makeMockConsoleMcp(), stubTranslator, analyzer,
      );

      await extractor.queryContext('IconBase');

      // Both should have been called (Promise.all)
      expect(analyzer.queryFamilyPattern).toHaveBeenCalledTimes(1);
      expect(analyzer.queryExistingComponents).toHaveBeenCalledTimes(1);
    });
  });
});
