/**
 * Unit tests for ValidationReasoning
 * 
 * Tests mathematical reasoning generation for validation results including:
 * - Pass-level reasoning
 * - Warning-level reasoning
 * - Error-level reasoning
 * - Suggestion generation
 * - Comprehensive explanations
 */

import { ValidationReasoning, type ReasoningContext } from '../ValidationReasoning';
import { TokenCategory, SemanticCategory, type PrimitiveToken, type SemanticToken } from '../../types';

describe('ValidationReasoning', () => {
  let reasoningGenerator: ValidationReasoning;

  beforeEach(() => {
    reasoningGenerator = new ValidationReasoning();
  });

  describe('Pass-level reasoning', () => {
    it('should generate reasoning for primitive token usage', () => {
      const token: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing unit',
        mathematicalRelationship: 'base value',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      };

      const context: ReasoningContext = {
        token,
        scenario: 'primitive-usage'
      };

      const reasoning = reasoningGenerator.generatePassReasoning(context);

      expect(reasoning).toContain('space100');
      expect(reasoning).toContain('spacing');
      expect(reasoning).toContain('mathematical foundation');
      expect(reasoning).toContain('base value');
    });

    it('should include baseline grid alignment in reasoning', () => {
      const token: PrimitiveToken = {
        name: 'space200',
        category: TokenCategory.SPACING,
        baseValue: 16,
        familyBaseValue: 8,
        description: 'Double spacing',
        mathematicalRelationship: 'base × 2',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 16, unit: 'px' },
          ios: { value: 16, unit: 'pt' },
          android: { value: 16, unit: 'dp' }
        }
      };

      const context: ReasoningContext = {
        token,
        scenario: 'primitive-usage'
      };

      const reasoning = reasoningGenerator.generatePassReasoning(context);

      expect(reasoning).toContain('Baseline grid alignment');
      expect(reasoning).toContain('8-unit alignment');
    });

    it('should generate reasoning for semantic token usage', () => {
      const primitiveToken: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing',
        mathematicalRelationship: 'base value',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      };

      const token: SemanticToken = {
        name: 'space.normal',
        primitiveReference: 'space100',
        category: SemanticCategory.SPACING,
        context: 'Normal spacing for standard layouts',
        description: 'Semantic token for normal spacing',
        primitiveToken
      };

      const context: ReasoningContext = {
        token,
        scenario: 'semantic-usage'
      };

      const reasoning = reasoningGenerator.generatePassReasoning(context);

      expect(reasoning).toContain('space.normal');
      expect(reasoning).toContain('contextual abstraction');
      expect(reasoning).toContain('space100');
      expect(reasoning).toContain('Mathematical consistency inherited');
    });

    it('should generate reasoning for strategic flexibility tokens', () => {
      const token: PrimitiveToken = {
        name: 'space075',
        category: TokenCategory.SPACING,
        baseValue: 6,
        familyBaseValue: 8,
        description: 'Strategic flexibility spacing',
        mathematicalRelationship: 'base × 0.75',
        baselineGridAlignment: false,
        isStrategicFlexibility: true,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 6, unit: 'px' },
          ios: { value: 6, unit: 'pt' },
          android: { value: 6, unit: 'dp' }
        }
      };

      const context: ReasoningContext = {
        token,
        scenario: 'strategic-flexibility'
      };

      const reasoning = reasoningGenerator.generatePassReasoning(context);

      expect(reasoning).toContain('Strategic flexibility');
      expect(reasoning).toContain('Mathematically derived');
      expect(reasoning).toContain('exceptional design requirements');
      expect(reasoning).toContain('≥80%');
    });

    it('should include precision targeting in reasoning', () => {
      const token: PrimitiveToken = {
        name: 'lineHeight100',
        category: TokenCategory.LINE_HEIGHT,
        baseValue: 1.5,
        familyBaseValue: 1.5,
        description: 'Base line height',
        mathematicalRelationship: 'base value',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true,
        platforms: {
          web: { value: 1.5, unit: 'unitless' },
          ios: { value: 1.5, unit: 'unitless' },
          android: { value: 1.5, unit: 'unitless' }
        }
      };

      const context: ReasoningContext = {
        token,
        scenario: 'primitive-usage'
      };

      const reasoning = reasoningGenerator.generatePassReasoning(context);

      expect(reasoning).toContain('Precision targeting');
      expect(reasoning).toContain('calculated multipliers');
    });
  });

  describe('Warning-level reasoning', () => {
    it('should generate reasoning for problematic patterns', () => {
      const token: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing',
        mathematicalRelationship: 'base value',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      };

      const context: ReasoningContext = {
        token,
        scenario: 'problematic-pattern',
        contextData: {
          usagePattern: 'High-frequency usage detected'
        }
      };

      const reasoning = reasoningGenerator.generateWarningReasoning(context);

      expect(reasoning).toContain('Detected pattern');
      expect(reasoning).toContain('mathematically valid');
      expect(reasoning).toContain('suboptimal');
    });

    it('should include usage pattern details in reasoning', () => {
      const token: PrimitiveToken = {
        name: 'space075',
        category: TokenCategory.SPACING,
        baseValue: 6,
        familyBaseValue: 8,
        description: 'Strategic flexibility spacing',
        mathematicalRelationship: 'base × 0.75',
        baselineGridAlignment: false,
        isStrategicFlexibility: true,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 6, unit: 'px' },
          ios: { value: 6, unit: 'pt' },
          android: { value: 6, unit: 'dp' }
        }
      };

      const context: ReasoningContext = {
        token,
        scenario: 'problematic-pattern',
        contextData: {
          usagePattern: 'Strategic flexibility overuse: 40/100 inappropriate usage'
        }
      };

      const reasoning = reasoningGenerator.generateWarningReasoning(context);

      expect(reasoning).toContain('Strategic flexibility overuse');
      expect(reasoning).toContain('40/100');
    });

    it('should provide guidance for semantic token alternatives', () => {
      const token: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing',
        mathematicalRelationship: 'base value',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      };

      const context: ReasoningContext = {
        token,
        scenario: 'problematic-pattern',
        contextData: {
          usagePattern: 'High primitive token usage'
        }
      };

      const reasoning = reasoningGenerator.generateWarningReasoning(context);

      expect(reasoning).toContain('semantic token');
    });
  });

  describe('Error-level reasoning', () => {
    it('should generate reasoning for mathematical violations', () => {
      const token: PrimitiveToken = {
        name: 'space125',
        category: TokenCategory.SPACING,
        baseValue: 10,
        familyBaseValue: 8,
        description: 'Invalid spacing',
        mathematicalRelationship: '',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 10, unit: 'px' },
          ios: { value: 10, unit: 'pt' },
          android: { value: 10, unit: 'dp' }
        }
      };

      const context: ReasoningContext = {
        token,
        scenario: 'mathematical-violation',
        contextData: {
          relationship: 'Missing mathematical relationship'
        }
      };

      const reasoning = reasoningGenerator.generateErrorReasoning(context);

      expect(reasoning).toContain('Mathematical violation');
      expect(reasoning).toContain('Missing mathematical relationship');
      expect(reasoning).toContain('compromise design system consistency');
    });

    it('should include baseline grid violation details', () => {
      const token: PrimitiveToken = {
        name: 'space125',
        category: TokenCategory.SPACING,
        baseValue: 10,
        familyBaseValue: 8,
        description: 'Invalid spacing',
        mathematicalRelationship: 'base × 1.25',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 10, unit: 'px' },
          ios: { value: 10, unit: 'pt' },
          android: { value: 10, unit: 'dp' }
        }
      };

      const context: ReasoningContext = {
        token,
        scenario: 'mathematical-violation',
        contextData: {
          baselineGridInfo: {
            gridUnit: 8,
            isAligned: false,
            nearestValid: 8
          }
        }
      };

      const reasoning = reasoningGenerator.generateErrorReasoning(context);

      expect(reasoning).toContain('Baseline grid violation');
      expect(reasoning).toContain('8-unit grid');
      expect(reasoning).toContain('Nearest valid value: 8');
    });

    it('should include cross-platform consistency issues', () => {
      const token: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing',
        mathematicalRelationship: 'base value',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 10, unit: 'dp' }
        }
      };

      const context: ReasoningContext = {
        token,
        scenario: 'mathematical-violation',
        contextData: {
          platformInfo: {
            web: 8,
            ios: 8,
            android: 10
          }
        }
      };

      const reasoning = reasoningGenerator.generateErrorReasoning(context);

      expect(reasoning).toContain('Cross-platform consistency violation');
      expect(reasoning).toContain('web');
      expect(reasoning).toContain('ios');
      expect(reasoning).toContain('android');
    });

    it('should explain impact of violations', () => {
      const token: PrimitiveToken = {
        name: 'space125',
        category: TokenCategory.SPACING,
        baseValue: 10,
        familyBaseValue: 8,
        description: 'Invalid spacing',
        mathematicalRelationship: '',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 10, unit: 'px' },
          ios: { value: 10, unit: 'pt' },
          android: { value: 10, unit: 'dp' }
        }
      };

      const context: ReasoningContext = {
        token,
        scenario: 'mathematical-violation',
        contextData: {
          relationship: 'Invalid mathematical relationship'
        }
      };

      const reasoning = reasoningGenerator.generateErrorReasoning(context);

      expect(reasoning).toContain('compromise design system consistency');
      expect(reasoning).toContain('cross-platform predictability');
    });
  });

  describe('Suggestion generation', () => {
    it('should generate suggestions for mathematical violations', () => {
      const token: PrimitiveToken = {
        name: 'space125',
        category: TokenCategory.SPACING,
        baseValue: 10,
        familyBaseValue: 8,
        description: 'Invalid spacing',
        mathematicalRelationship: '',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 10, unit: 'px' },
          ios: { value: 10, unit: 'pt' },
          android: { value: 10, unit: 'dp' }
        }
      };

      const context: ReasoningContext = {
        token,
        scenario: 'mathematical-violation',
        contextData: {
          baselineGridInfo: {
            gridUnit: 8,
            isAligned: false,
            nearestValid: 8
          }
        }
      };

      const suggestions = reasoningGenerator.generateSuggestions(context);

      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.includes('baseline grid aligned value'))).toBe(true);
      expect(suggestions.some(s => s.includes('strategic flexibility'))).toBe(true);
    });

    it('should generate suggestions for problematic patterns', () => {
      const token: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing',
        mathematicalRelationship: 'base value',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      };

      const context: ReasoningContext = {
        token,
        scenario: 'problematic-pattern',
        contextData: {
          usagePattern: 'High-frequency usage'
        }
      };

      const suggestions = reasoningGenerator.generateSuggestions(context);

      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.includes('semantic token'))).toBe(true);
    });

    it('should generate suggestions for strategic flexibility', () => {
      const token: PrimitiveToken = {
        name: 'space075',
        category: TokenCategory.SPACING,
        baseValue: 6,
        familyBaseValue: 8,
        description: 'Strategic flexibility spacing',
        mathematicalRelationship: 'base × 0.75',
        baselineGridAlignment: false,
        isStrategicFlexibility: true,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 6, unit: 'px' },
          ios: { value: 6, unit: 'pt' },
          android: { value: 6, unit: 'dp' }
        }
      };

      const context: ReasoningContext = {
        token,
        scenario: 'strategic-flexibility'
      };

      const suggestions = reasoningGenerator.generateSuggestions(context);

      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.includes('≥80%'))).toBe(true);
      expect(suggestions.some(s => s.includes('Monitor'))).toBe(true);
    });
  });

  describe('Comprehensive explanations', () => {
    it('should generate comprehensive explanation with all components', () => {
      const token: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing unit',
        mathematicalRelationship: 'base value',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      };

      const context: ReasoningContext = {
        token,
        scenario: 'primitive-usage',
        contextData: {
          baselineGridInfo: {
            gridUnit: 8,
            isAligned: true
          }
        }
      };

      const explanation = reasoningGenerator.generateComprehensiveExplanation(context);

      expect(explanation.reasoning).toBeDefined();
      expect(explanation.suggestions).toBeDefined();
      expect(explanation.mathematicalDetails).toBeDefined();
      expect(explanation.mathematicalDetails).toContain('Base value: 8');
      expect(explanation.mathematicalDetails).toContain('Family base: 8');
      expect(explanation.mathematicalDetails).toContain('Category: spacing');
    });

    it('should include mathematical details for primitive tokens', () => {
      const token: PrimitiveToken = {
        name: 'space200',
        category: TokenCategory.SPACING,
        baseValue: 16,
        familyBaseValue: 8,
        description: 'Double spacing',
        mathematicalRelationship: 'base × 2',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 16, unit: 'px' },
          ios: { value: 16, unit: 'pt' },
          android: { value: 16, unit: 'dp' }
        }
      };

      const context: ReasoningContext = {
        token,
        scenario: 'primitive-usage'
      };

      const explanation = reasoningGenerator.generateComprehensiveExplanation(context);

      expect(explanation.mathematicalDetails).toContain('Base value: 16');
      expect(explanation.mathematicalDetails).toContain('Relationship: base × 2');
    });

    it('should include semantic details for semantic tokens', () => {
      const primitiveToken: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing',
        mathematicalRelationship: 'base value',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      };

      const token: SemanticToken = {
        name: 'space.normal',
        primitiveReference: 'space100',
        category: SemanticCategory.SPACING,
        context: 'Normal spacing for standard layouts',
        description: 'Semantic token for normal spacing',
        primitiveToken
      };

      const context: ReasoningContext = {
        token,
        scenario: 'semantic-usage'
      };

      const explanation = reasoningGenerator.generateComprehensiveExplanation(context);

      expect(explanation.mathematicalDetails).toContain('Semantic reference: space100');
      expect(explanation.mathematicalDetails).toContain('Context: Normal spacing for standard layouts');
    });
  });
});
