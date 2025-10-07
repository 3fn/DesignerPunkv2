/**
 * Component Token Generator Tests
 * 
 * Tests component token generation when semantic and primitive tokens are insufficient
 */

import { ComponentTokenGenerator } from '../ComponentTokenGenerator';
import { PrimitiveTokenRegistry } from '../../../registries/PrimitiveTokenRegistry';
import { PrimitiveToken, TokenCategory } from '../../../types/PrimitiveToken';
import { ComponentTokenSpec } from '../ComponentToken';

describe('ComponentTokenGenerator', () => {
  let primitiveRegistry: PrimitiveTokenRegistry;
  let generator: ComponentTokenGenerator;

  beforeEach(() => {
    primitiveRegistry = new PrimitiveTokenRegistry();
    generator = new ComponentTokenGenerator(primitiveRegistry);
  });

  describe('Component Token Generation', () => {
    it('should generate component token with platform values', () => {
      const spec: ComponentTokenSpec = {
        name: 'button.padding.horizontal',
        category: 'spacing',
        baseValue: 14,
        component: 'Button',
        reasoning: 'Button requires 14px horizontal padding for optimal touch target, which is not available in primitive tokens',
        createdBy: 'designer'
      };

      const token = generator.generate(spec);

      expect(token.name).toBe('button.padding.horizontal');
      expect(token.baseValue).toBe(14);
      expect(token.component).toBe('Button');
      expect(token.reasoning).toContain('Button requires 14px');
      
      // Check platform values
      expect(token.platforms.ios.value).toBe(14);
      expect(token.platforms.ios.unit).toBe('pt');
      expect(token.platforms.android.value).toBe(14);
      expect(token.platforms.android.unit).toBe('dp');
      expect(token.platforms.web.value).toBe(14);
      expect(token.platforms.web.unit).toBe('px');
    });

    it('should initialize usage tracking', () => {
      const spec: ComponentTokenSpec = {
        name: 'card.spacing',
        category: 'spacing',
        baseValue: 10,
        component: 'Card',
        reasoning: 'Card needs specific spacing',
        createdBy: 'developer'
      };

      const token = generator.generate(spec);

      expect(token.usage.usageCount).toBe(0);
      expect(token.usage.contexts).toEqual([]);
      expect(token.usage.appropriateUsage).toBe(true);
      expect(token.usage.appropriateUsageRate).toBe(100);
    });

    it('should initialize metadata', () => {
      const spec: ComponentTokenSpec = {
        name: 'modal.padding',
        category: 'spacing',
        baseValue: 20,
        component: 'Modal',
        reasoning: 'Modal requires specific padding',
        createdBy: 'designer'
      };

      const token = generator.generate(spec);

      expect(token.metadata.createdBy).toBe('designer');
      expect(token.metadata.approved).toBe(false);
      expect(token.metadata.promotionCandidate).toBe(false);
      expect(token.metadata.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('Component Token Validation', () => {
    it('should validate valid component token', () => {
      const spec: ComponentTokenSpec = {
        name: 'button.height',
        category: 'spacing',
        baseValue: 40,
        component: 'Button',
        reasoning: 'Button requires 40px height for accessibility',
        createdBy: 'designer'
      };

      const token = generator.generate(spec);
      const validation = generator.validate(token);

      expect(validation.valid).toBe(true);
      expect(validation.mathematicallyConsistent).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect invalid base value', () => {
      const spec: ComponentTokenSpec = {
        name: 'invalid.token',
        category: 'spacing',
        baseValue: -5,
        component: 'Test',
        reasoning: 'Test token',
        createdBy: 'test'
      };

      const token = generator.generate(spec);
      const validation = generator.validate(token);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Base value must be positive, got -5');
    });

    it('should detect missing reasoning', () => {
      const spec: ComponentTokenSpec = {
        name: 'test.token',
        category: 'spacing',
        baseValue: 10,
        component: 'Test',
        reasoning: '',
        createdBy: 'test'
      };

      const token = generator.generate(spec);
      const validation = generator.validate(token);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Component token must include reasoning for why existing tokens are insufficient');
    });

    it('should warn about off-baseline-grid values for spacing', () => {
      const spec: ComponentTokenSpec = {
        name: 'button.padding',
        category: 'spacing',
        baseValue: 14, // Not aligned to 8-unit grid
        component: 'Button',
        reasoning: 'Button needs 14px padding',
        createdBy: 'designer'
      };

      const token = generator.generate(spec);
      const validation = generator.validate(token);

      expect(validation.valid).toBe(true);
      expect(validation.warnings.length).toBeGreaterThan(0);
      expect(validation.warnings[0]).toContain('does not align with 8-unit baseline grid');
    });

    it('should warn if similar primitive token exists', () => {
      // Register primitive token
      const primitiveToken: PrimitiveToken = {
        name: 'space200',
        category: TokenCategory.SPACING,
        baseValue: 16,
        familyBaseValue: 8,
        description: 'Double base spacing',
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
      primitiveRegistry.register(primitiveToken);

      // Create component token with similar value
      const spec: ComponentTokenSpec = {
        name: 'button.padding',
        category: 'spacing',
        baseValue: 16,
        component: 'Button',
        reasoning: 'Button needs 16px padding',
        createdBy: 'designer'
      };

      const token = generator.generate(spec);
      const validation = generator.validate(token);

      expect(validation.warnings.length).toBeGreaterThan(0);
      expect(validation.warnings.some(w => w.includes('Similar primitive token'))).toBe(true);
    });
  });

  describe('Promotion Recommendation', () => {
    it('should not recommend promotion for low usage', () => {
      const spec: ComponentTokenSpec = {
        name: 'test.token',
        category: 'spacing',
        baseValue: 10,
        component: 'Test',
        reasoning: 'Test token',
        createdBy: 'test'
      };

      const token = generator.generate(spec);
      token.usage.usageCount = 5;
      token.usage.appropriateUsageRate = 90;
      token.usage.contexts = ['context1', 'context2'];

      const recommendation = generator.checkPromotion(token);

      expect(recommendation.shouldPromote).toBe(false);
      expect(recommendation.reasoning).toContain('usage count (5) below threshold (10)');
    });

    it('should not recommend promotion for low appropriate usage rate', () => {
      const spec: ComponentTokenSpec = {
        name: 'test.token',
        category: 'spacing',
        baseValue: 10,
        component: 'Test',
        reasoning: 'Test token',
        createdBy: 'test'
      };

      const token = generator.generate(spec);
      token.usage.usageCount = 15;
      token.usage.appropriateUsageRate = 70;
      token.usage.contexts = ['context1', 'context2', 'context3'];

      const recommendation = generator.checkPromotion(token);

      expect(recommendation.shouldPromote).toBe(false);
      expect(recommendation.reasoning).toContain('appropriate usage rate (70%) below threshold (80%)');
    });

    it('should not recommend promotion for few contexts', () => {
      const spec: ComponentTokenSpec = {
        name: 'test.token',
        category: 'spacing',
        baseValue: 10,
        component: 'Test',
        reasoning: 'Test token',
        createdBy: 'test'
      };

      const token = generator.generate(spec);
      token.usage.usageCount = 15;
      token.usage.appropriateUsageRate = 90;
      token.usage.contexts = ['context1', 'context2'];

      const recommendation = generator.checkPromotion(token);

      expect(recommendation.shouldPromote).toBe(false);
      expect(recommendation.reasoning).toContain('used in only 2 context(s), need at least 3');
    });

    it('should recommend promotion for high usage across multiple contexts', () => {
      const spec: ComponentTokenSpec = {
        name: 'common.spacing',
        category: 'spacing',
        baseValue: 10,
        component: 'Common',
        reasoning: 'Common spacing value',
        createdBy: 'designer'
      };

      const token = generator.generate(spec);
      token.usage.usageCount = 20;
      token.usage.appropriateUsageRate = 85;
      token.usage.contexts = ['Button', 'Card', 'Modal', 'Dialog'];

      const recommendation = generator.checkPromotion(token);

      expect(recommendation.shouldPromote).toBe(true);
      expect(recommendation.reasoning).toContain('used 20 times across 4 contexts');
      expect(recommendation.reasoning).toContain('85% appropriate usage');
      expect(recommendation.suggestedPrimitiveName).toBeDefined();
    });
  });
});
