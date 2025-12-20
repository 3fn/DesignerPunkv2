/**
 * @category evergreen
 * @purpose Verify TokenSelector tokens are correctly defined and structured
 */
/**
 * Token Selector Tests
 * 
 * Tests token selection priority logic: semantic → primitive → component
 */

import { TokenSelector } from '../TokenSelector';
import { PrimitiveTokenRegistry } from '../../../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../../../registries/SemanticTokenRegistry';
import { PrimitiveToken, TokenCategory } from '../../../types/PrimitiveToken';
import { SemanticToken, SemanticCategory } from '../../../types/SemanticToken';

describe('TokenSelector', () => {
  let primitiveRegistry: PrimitiveTokenRegistry;
  let semanticRegistry: SemanticTokenRegistry;
  let tokenSelector: TokenSelector;

  beforeEach(() => {
    primitiveRegistry = new PrimitiveTokenRegistry();
    semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);
    tokenSelector = new TokenSelector(primitiveRegistry, semanticRegistry);
  });

  describe('Token Selection Priority', () => {
    it('should select semantic token as first priority', () => {
      // Register primitive token
      const primitiveToken: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing unit',
        mathematicalRelationship: 'base × 1',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      };
      primitiveRegistry.register(primitiveToken);

      // Register semantic token
      const semanticToken: SemanticToken = {
        name: 'space.normal',
        primitiveReferences: { default: 'space100' },
        category: SemanticCategory.SPACING,
        context: 'Normal spacing between elements',
        description: 'Standard spacing for most layouts'
      };
      semanticRegistry.register(semanticToken);

      // Request token
      const selection = tokenSelector.selectToken({
        property: 'padding',
        category: 'spacing'
      });

      // Should select semantic token
      expect(selection.priority).toBe('semantic');
      expect(selection.semantic).toBeDefined();
      expect(selection.semantic?.name).toBe('space.normal');
      expect(selection.reasoning).toContain('Semantic token');
    });

    it('should select primitive token as second priority when semantic not available', () => {
      // Register only primitive token
      const primitiveToken: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing unit',
        mathematicalRelationship: 'base × 1',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      };
      primitiveRegistry.register(primitiveToken);

      // Request token
      const selection = tokenSelector.selectToken({
        property: 'padding',
        category: 'spacing'
      });

      // Should select primitive token
      expect(selection.priority).toBe('primitive');
      expect(selection.primitive).toBeDefined();
      expect(selection.primitive?.name).toBe('space100');
      expect(selection.semanticInsufficiencyReason).toBeDefined();
      expect(selection.reasoning).toContain('Primitive token');
    });

    it('should indicate component token needed when neither semantic nor primitive available', () => {
      // Request token with no registered tokens
      const selection = tokenSelector.selectToken({
        property: 'padding',
        category: 'spacing'
      });

      // Should indicate component token needed
      expect(selection.priority).toBe('component');
      expect(selection.component).toBeUndefined();
      expect(selection.semanticInsufficiencyReason).toBeDefined();
      expect(selection.primitiveInsufficiencyReason).toBeDefined();
      expect(selection.reasoning).toContain('Component token generation required');
    });

    it('should respect allowComponentTokens option', () => {
      // Request token with component tokens disabled
      const selection = tokenSelector.selectToken(
        {
          property: 'padding',
          category: 'spacing'
        },
        {
          allowComponentTokens: false
        }
      );

      // Should indicate component token disabled
      expect(selection.priority).toBe('component');
      expect(selection.mathematicallyValid).toBe(false);
      expect(selection.reasoning).toContain('component token generation is disabled');
    });
  });

  describe('Explicit Token Selection', () => {
    it('should select explicitly requested semantic token', () => {
      // Register tokens
      const primitiveToken: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing unit',
        mathematicalRelationship: 'base × 1',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      };
      primitiveRegistry.register(primitiveToken);

      const semanticToken: SemanticToken = {
        name: 'space.tight',
        primitiveReferences: { default: 'space100' },
        category: SemanticCategory.SPACING,
        context: 'Tight spacing',
        description: 'Compact spacing for dense layouts'
      };
      semanticRegistry.register(semanticToken);

      // Request specific token
      const selection = tokenSelector.selectToken({
        property: 'padding',
        category: 'spacing',
        tokenName: 'space.tight'
      });

      // Should select requested token
      expect(selection.priority).toBe('semantic');
      expect(selection.semantic?.name).toBe('space.tight');
      expect(selection.reasoning).toContain('explicitly requested');
    });

    it('should select explicitly requested primitive token', () => {
      // Register primitive token
      const primitiveToken: PrimitiveToken = {
        name: 'space150',
        category: TokenCategory.SPACING,
        baseValue: 12,
        familyBaseValue: 8,
        description: 'Medium spacing unit',
        mathematicalRelationship: 'base × 1.5',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 12, unit: 'px' },
          ios: { value: 12, unit: 'pt' },
          android: { value: 12, unit: 'dp' }
        }
      };
      primitiveRegistry.register(primitiveToken);

      // Request specific token
      const selection = tokenSelector.selectToken({
        property: 'padding',
        category: 'spacing',
        tokenName: 'space150'
      });

      // Should select requested token
      expect(selection.priority).toBe('primitive');
      expect(selection.primitive?.name).toBe('space150');
      expect(selection.reasoning).toContain('explicitly requested');
    });
  });

  describe('Token Selection Documentation', () => {
    it('should document token selection reasoning', () => {
      // Register tokens
      const primitiveToken: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing unit',
        mathematicalRelationship: 'base × 1',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      };
      primitiveRegistry.register(primitiveToken);

      const semanticToken: SemanticToken = {
        name: 'space.normal',
        primitiveReferences: { default: 'space100' },
        category: SemanticCategory.SPACING,
        context: 'Normal spacing',
        description: 'Standard spacing'
      };
      semanticRegistry.register(semanticToken);

      // Select token
      const selection = tokenSelector.selectToken({
        property: 'padding',
        category: 'spacing'
      });

      // Document selection
      const documentation = tokenSelector.documentSelection(selection);

      // Should include key information
      expect(documentation).toContain('Token Selection for: padding');
      expect(documentation).toContain('Category: spacing');
      expect(documentation).toContain('Priority Used: semantic');
      expect(documentation).toContain('Selected Semantic Token:');
      expect(documentation).toContain('Name: space.normal');
    });
  });
});
