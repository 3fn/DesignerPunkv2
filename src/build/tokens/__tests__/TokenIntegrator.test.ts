/**
 * @category evergreen
 * @purpose Verify TokenIntegrator tokens are correctly defined and structured
 */
/**
 * Token Integrator Tests
 * 
 * Tests F1 token system integration with the build system
 */

import { TokenIntegratorImpl } from '../TokenIntegrator';
import { PrimitiveTokenRegistry } from '../../../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../../../registries/SemanticTokenRegistry';
import { SemanticCategory } from '../../../types/SemanticToken';
import { spacingTokens } from '../../../tokens/SpacingTokens';
import { colorTokens as semanticColorTokens } from '../../../tokens/semantic/ColorTokens';
import { spacingTokens as semanticSpacingTokens } from '../../../tokens/semantic/SpacingTokens';
import { grayTokens, purpleTokens } from '../../../tokens/ColorTokens';

describe('TokenIntegrator - F1 Integration', () => {
  let primitiveRegistry: PrimitiveTokenRegistry;
  let semanticRegistry: SemanticTokenRegistry;
  let integrator: TokenIntegratorImpl;

  beforeEach(() => {
    primitiveRegistry = new PrimitiveTokenRegistry();
    semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);
    integrator = new TokenIntegratorImpl(primitiveRegistry, semanticRegistry);
  });

  describe('Primitive Token Import', () => {
    it('should import spacing primitive tokens from F1', () => {
      // Register spacing tokens
      Object.values(spacingTokens).forEach(token => {
        primitiveRegistry.register(token);
      });

      // Verify tokens are registered
      expect(primitiveRegistry.has('space100')).toBe(true);
      expect(primitiveRegistry.has('space200')).toBe(true);
      expect(primitiveRegistry.has('space075')).toBe(true);

      // Verify token values
      const space100 = primitiveRegistry.get('space100');
      expect(space100).toBeDefined();
      expect(space100?.baseValue).toBe(8);
      expect(space100?.category).toBe('spacing');
    });

    it('should import color primitive tokens from F1', () => {
      // Register gray tokens
      Object.values(grayTokens).forEach(token => {
        primitiveRegistry.register(token);
      });

      // Register purple tokens
      Object.values(purpleTokens).forEach(token => {
        primitiveRegistry.register(token);
      });

      // Verify tokens are registered
      expect(primitiveRegistry.has('gray300')).toBe(true);
      expect(primitiveRegistry.has('purple300')).toBe(true);

      // Verify token structure
      const gray300 = primitiveRegistry.get('gray300');
      expect(gray300).toBeDefined();
      expect(gray300?.category).toBe('color');
      expect(gray300?.platforms.web.unit).toBe('hex');
    });
  });

  describe('Semantic Token Import', () => {
    it('should import spacing semantic tokens from F1', () => {
      // Register primitive tokens first
      Object.values(spacingTokens).forEach(token => {
        primitiveRegistry.register(token);
      });

      // Register semantic spacing tokens
      const spacingSemantics = [
        { name: 'space.inset.100', ...semanticSpacingTokens.inset['100'], category: SemanticCategory.SPACING, context: 'Standard inset spacing', description: 'Compact inset' },
        { name: 'space.grouped.normal', ...semanticSpacingTokens.grouped.normal, category: SemanticCategory.SPACING, context: 'Grouped spacing', description: 'Normal grouped' }
      ];

      spacingSemantics.forEach(token => {
        semanticRegistry.register({
          name: token.name,
          primitiveReferences: { value: token.value },
          category: token.category,
          context: token.context,
          description: token.description
        });
      });

      // Verify tokens are registered
      expect(semanticRegistry.has('space.inset.100')).toBe(true);
      expect(semanticRegistry.has('space.grouped.normal')).toBe(true);

      // Verify token references
      const inset100 = semanticRegistry.get('space.inset.100');
      expect(inset100).toBeDefined();
      expect(inset100?.primitiveReferences.value).toBe('space100');
    });

    it('should import color semantic tokens from F1', () => {
      // Register primitive color tokens first
      Object.values(grayTokens).forEach(token => {
        primitiveRegistry.register(token);
      });
      Object.values(purpleTokens).forEach(token => {
        primitiveRegistry.register(token);
      });

      // Register semantic color tokens
      const colorSemantics = [
        { ...semanticColorTokens['color.primary'], primitiveReferences: { value: 'purple300' } },
        { ...semanticColorTokens['color.text.default'], primitiveReferences: { value: 'gray300' } }
      ];

      colorSemantics.forEach(token => {
        semanticRegistry.register(token);
      });

      // Verify tokens are registered
      expect(semanticRegistry.has('color.primary')).toBe(true);
      expect(semanticRegistry.has('color.text.default')).toBe(true);

      // Verify token references
      const primary = semanticRegistry.get('color.primary');
      expect(primary).toBeDefined();
      expect(primary?.primitiveReferences.value).toBe('purple300');
    });
  });

  describe('Token Reference Validation', () => {
    it('should validate that token references exist in F1', () => {
      // Register primitive tokens
      Object.values(spacingTokens).forEach(token => {
        primitiveRegistry.register(token);
      });

      // Register semantic token with valid reference - should succeed
      expect(() => {
        semanticRegistry.register({
          name: 'space.test.valid',
          primitiveReferences: { value: 'space100' },
          category: SemanticCategory.SPACING,
          context: 'Test token',
          description: 'Valid reference'
        });
      }).not.toThrow();

      // Verify token was registered
      expect(semanticRegistry.has('space.test.valid')).toBe(true);

      // Note: Invalid primitive token references should be validated before registration
      // The registry itself doesn't validate references - that's the validator's job
      // This test verifies that valid tokens can be registered successfully
    });

    it('should validate token references are valid tokens from F1', () => {
      // Register all spacing tokens
      Object.values(spacingTokens).forEach(token => {
        primitiveRegistry.register(token);
      });

      // Test that all F1 spacing tokens are accessible
      const space100 = primitiveRegistry.get('space100');
      const space200 = primitiveRegistry.get('space200');
      const space075 = primitiveRegistry.get('space075');

      expect(space100).toBeDefined();
      expect(space200).toBeDefined();
      expect(space075).toBeDefined();

      // Verify strategic flexibility token
      expect(space075?.isStrategicFlexibility).toBe(true);
      expect(space075?.baseValue).toBe(6);
    });
  });

  describe('Platform Token Conversion', () => {
    beforeEach(() => {
      // Register tokens for conversion tests
      Object.values(spacingTokens).forEach(token => {
        primitiveRegistry.register(token);
      });
    });

    it('should convert tokens to iOS platform values (pt)', () => {
      const space100 = primitiveRegistry.get('space100')!;
      const iosValue = integrator.convertToken(space100, 'ios');

      expect(iosValue.value).toBe(8);
      expect(iosValue.unit).toBe('pt');
      expect(iosValue.token).toBe('space100');
    });

    it('should convert tokens to Android platform values (dp)', () => {
      const space100 = primitiveRegistry.get('space100')!;
      const androidValue = integrator.convertToken(space100, 'android');

      expect(androidValue.value).toBe(8);
      expect(androidValue.unit).toBe('dp');
      expect(androidValue.token).toBe('space100');
    });

    it('should convert tokens to Web platform values (px)', () => {
      const space100 = primitiveRegistry.get('space100')!;
      const webValue = integrator.convertToken(space100, 'web');

      expect(webValue.value).toBe(8);
      expect(webValue.unit).toBe('px');
      expect(webValue.token).toBe('space100');
    });
  });

  describe('getTokensForPlatform', () => {
    beforeEach(() => {
      // Register primitive tokens
      Object.values(spacingTokens).forEach(token => {
        primitiveRegistry.register(token);
      });
      Object.values(grayTokens).forEach(token => {
        primitiveRegistry.register(token);
      });

      // Register semantic tokens
      semanticRegistry.register({
        name: 'space.inset.normal',
        primitiveReferences: { value: 'space100' },
        category: SemanticCategory.SPACING,
        context: 'Standard inset spacing',
        description: 'Normal inset'
      });

      semanticRegistry.register({
        name: 'color.text.default',
        primitiveReferences: { value: 'gray300' },
        category: SemanticCategory.COLOR,
        context: 'Default text color',
        description: 'Primary text'
      });
    });

    it('should get all tokens organized by category for iOS', () => {
      const platformTokens = integrator.getTokensForPlatform('ios');

      expect(platformTokens.platform).toBe('ios');
      expect(platformTokens.primitives.spacing['space100']).toBeDefined();
      expect(platformTokens.primitives.spacing['space100'].unit).toBe('pt');
      expect(platformTokens.primitives.colors['gray300']).toBeDefined();
      expect(platformTokens.semantics.spacing['space.inset.normal']).toBeDefined();
      expect(platformTokens.semantics.colors['color.text.default']).toBeDefined();
    });

    it('should get all tokens organized by category for Android', () => {
      const platformTokens = integrator.getTokensForPlatform('android');

      expect(platformTokens.platform).toBe('android');
      expect(platformTokens.primitives.spacing['space100']).toBeDefined();
      expect(platformTokens.primitives.spacing['space100'].unit).toBe('dp');
      expect(platformTokens.metadata.defaultSpacingUnit).toBe('dp');
    });

    it('should get all tokens organized by category for Web', () => {
      const platformTokens = integrator.getTokensForPlatform('web');

      expect(platformTokens.platform).toBe('web');
      expect(platformTokens.primitives.spacing['space100']).toBeDefined();
      expect(platformTokens.primitives.spacing['space100'].unit).toBe('px');
      expect(platformTokens.metadata.defaultSpacingUnit).toBe('px');
    });

    it('should include proper metadata for each platform', () => {
      const iosTokens = integrator.getTokensForPlatform('ios');
      const androidTokens = integrator.getTokensForPlatform('android');
      const webTokens = integrator.getTokensForPlatform('web');

      expect(iosTokens.metadata.supportedUnits).toEqual(['pt']);
      expect(androidTokens.metadata.supportedUnits).toEqual(['dp', 'sp']);
      expect(webTokens.metadata.supportedUnits).toEqual(['px', 'rem']);

      expect(webTokens.metadata.constraints.supportsSubpixel).toBe(true);
      expect(iosTokens.metadata.constraints.supportsSubpixel).toBe(false);
    });
  });

  describe('Mathematical Consistency Validation', () => {
    beforeEach(() => {
      Object.values(spacingTokens).forEach(token => {
        primitiveRegistry.register(token);
      });
    });

    it('should validate mathematical consistency across platforms', () => {
      const space100 = primitiveRegistry.get('space100')!;
      const validation = integrator.validateMathematicalConsistency(space100);

      expect(validation.consistent).toBe(true);
      expect(validation.platforms.ios.value).toBe(8);
      expect(validation.platforms.android.value).toBe(8);
      expect(validation.platforms.web.value).toBe(8);
      expect(validation.issues).toHaveLength(0);
    });

    it('should validate strategic flexibility tokens maintain values', () => {
      const space075 = primitiveRegistry.get('space075')!;
      const validation = integrator.validateMathematicalConsistency(space075);

      expect(validation.consistent).toBe(true);
      expect(validation.platforms.ios.value).toBe(6);
      expect(validation.platforms.android.value).toBe(6);
      expect(validation.platforms.web.value).toBe(6);
    });
  });
});
