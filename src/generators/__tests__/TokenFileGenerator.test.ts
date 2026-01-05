/**
 * @category evergreen
 * @purpose Verify token file generation produces valid output files for all platforms
 */
/**
 * Token File Generator Tests
 * 
 * Tests token file generation orchestration, cross-platform consistency,
 * and file structure validation.
 */

import { TokenFileGenerator, GenerationOptions } from '../TokenFileGenerator';
import { SemanticTokenValidator } from '../../validators/SemanticTokenValidator';
import { PrimitiveTokenRegistry } from '../../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../../registries/SemanticTokenRegistry';

describe('TokenFileGenerator', () => {
  let generator: TokenFileGenerator;

  beforeEach(() => {
    generator = new TokenFileGenerator();
  });

  describe('Initialization', () => {
    it('should initialize with all platform generators', () => {
      expect(generator).toBeDefined();
      expect(generator).toBeInstanceOf(TokenFileGenerator);
    });
  });

  describe('Web Token Generation', () => {
    it('should generate web tokens with default options', () => {
      const result = generator.generateWebTokens();

      expect(result.platform).toBe('web');
      expect(result.filePath).toBe('output/DesignTokens.web.css');
      expect(result.content).toBeDefined();
      expect(result.tokenCount).toBeGreaterThan(0);
      expect(result.valid).toBe(true);
    });

    it('should generate web tokens with custom output directory', () => {
      const result = generator.generateWebTokens({
        outputDir: 'custom/output'
      });

      expect(result.filePath).toBe('custom/output/DesignTokens.web.css');
    });

    it('should include version in generated content', () => {
      const result = generator.generateWebTokens({
        version: '2.0.0'
      });

      expect(result.content).toContain('2.0.0');
    });

    it('should group tokens by category when requested', () => {
      const result = generator.generateWebTokens({
        groupByCategory: true,
        includeComments: true
      });

      // Should contain category comments
      expect(result.content).toContain('SPACING');
      expect(result.content).toContain('FONTSIZE');
    });

    it('should generate flat token list when grouping disabled', () => {
      const result = generator.generateWebTokens({
        groupByCategory: false,
        includeComments: false
      });

      expect(result.content).toBeDefined();
      expect(result.tokenCount).toBeGreaterThan(0);
    });

    it('should include mathematical comments when requested', () => {
      const result = generator.generateWebTokens({
        includeComments: true
      });

      // Should contain mathematical relationship comments
      expect(result.content).toContain('base ×');
    });

    it('should validate generated syntax', () => {
      const result = generator.generateWebTokens();

      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });
  });

  describe('iOS Token Generation', () => {
    it('should generate iOS tokens with default options', () => {
      const result = generator.generateiOSTokens();

      expect(result.platform).toBe('ios');
      expect(result.filePath).toBe('output/DesignTokens.ios.swift');
      expect(result.content).toBeDefined();
      expect(result.tokenCount).toBeGreaterThan(0);
      expect(result.valid).toBe(true);
    });

    it('should generate iOS tokens with custom output directory', () => {
      const result = generator.generateiOSTokens({
        outputDir: 'ios/output'
      });

      expect(result.filePath).toBe('ios/output/DesignTokens.ios.swift');
    });

    it('should include Swift-specific syntax', () => {
      const result = generator.generateiOSTokens();

      expect(result.content).toContain('struct DesignTokens');
      expect(result.content).toContain('static let');
      expect(result.content).toContain('CGFloat');
    });

    it('should group tokens by category when requested', () => {
      const result = generator.generateiOSTokens({
        groupByCategory: true,
        includeComments: true
      });

      // Should contain category comments (iOS uses MARK comments)
      expect(result.content).toContain('MARK:');
      expect(result.content).toContain('SPACING');
    });

    it('should validate generated Swift syntax', () => {
      const result = generator.generateiOSTokens();

      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });
  });

  describe('Android Token Generation', () => {
    it('should generate Android tokens with default options', () => {
      const result = generator.generateAndroidTokens();

      expect(result.platform).toBe('android');
      expect(result.filePath).toBe('output/DesignTokens.android.kt');
      expect(result.content).toBeDefined();
      expect(result.tokenCount).toBeGreaterThan(0);
      expect(result.valid).toBe(true);
    });

    it('should generate Android tokens with custom output directory', () => {
      const result = generator.generateAndroidTokens({
        outputDir: 'android/output'
      });

      expect(result.filePath).toBe('android/output/DesignTokens.android.kt');
    });

    it('should include Kotlin-specific syntax', () => {
      const result = generator.generateAndroidTokens();

      expect(result.content).toContain('object DesignTokens');
      expect(result.content).toContain('const val');
      expect(result.content).toContain('Float');
    });

    it('should group tokens by category when requested', () => {
      const result = generator.generateAndroidTokens({
        groupByCategory: true,
        includeComments: true
      });

      // Should contain category comments
      expect(result.content).toContain('SPACING');
      expect(result.content).toContain('FONTSIZE');
    });

    it('should validate generated Kotlin syntax', () => {
      const result = generator.generateAndroidTokens();

      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });
  });

  describe('Generate All Platforms', () => {
    it('should generate tokens for all platforms', () => {
      const results = generator.generateAll();

      expect(results).toHaveLength(3);
      expect(results.map(r => r.platform)).toEqual(['web', 'ios', 'android']);
    });

    it('should generate all platforms with custom options', () => {
      const options: GenerationOptions = {
        outputDir: 'dist',
        version: '3.0.0',
        includeComments: true,
        groupByCategory: true
      };

      const results = generator.generateAll(options);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.filePath).toContain('dist/');
        expect(result.content).toContain('3.0.0');
        expect(result.valid).toBe(true);
      });
    });

    it('should generate all platforms successfully', () => {
      const results = generator.generateAll();

      results.forEach(result => {
        expect(result.valid).toBe(true);
        expect(result.errors).toBeUndefined();
        expect(result.tokenCount).toBeGreaterThan(0);
      });
    });
  });

  describe('Cross-Platform Consistency Validation', () => {
    it('should validate consistent token counts across platforms', () => {
      const results = generator.generateAll();
      const validation = generator.validateCrossPlatformConsistency(results);

      expect(validation.consistent).toBe(true);
      expect(validation.issues).toHaveLength(0);
    });

    it('should detect token count mismatches', () => {
      const results = [
        {
          platform: 'web' as const,
          filePath: 'test.js',
          content: 'test',
          tokenCount: 10,
          semanticTokenCount: 5,
          valid: true
        },
        {
          platform: 'ios' as const,
          filePath: 'test.swift',
          content: 'test',
          tokenCount: 15,
          semanticTokenCount: 5,
          valid: true
        },
        {
          platform: 'android' as const,
          filePath: 'test.kt',
          content: 'test',
          tokenCount: 10,
          semanticTokenCount: 5,
          valid: true
        }
      ];

      const validation = generator.validateCrossPlatformConsistency(results);

      expect(validation.consistent).toBe(false);
      expect(validation.issues.length).toBeGreaterThan(0);
      expect(validation.issues[0]).toContain('Primitive token count mismatch');
    });

    it('should detect generation failures', () => {
      const results = [
        {
          platform: 'web' as const,
          filePath: 'test.js',
          content: 'test',
          tokenCount: 10,
          semanticTokenCount: 5,
          valid: true
        },
        {
          platform: 'ios' as const,
          filePath: 'test.swift',
          content: 'test',
          tokenCount: 10,
          semanticTokenCount: 5,
          valid: false,
          errors: ['Syntax error']
        },
        {
          platform: 'android' as const,
          filePath: 'test.kt',
          content: 'test',
          tokenCount: 10,
          semanticTokenCount: 5,
          valid: true
        }
      ];

      const validation = generator.validateCrossPlatformConsistency(results);

      expect(validation.consistent).toBe(false);
      expect(validation.issues.length).toBeGreaterThan(0);
      expect(validation.issues[0]).toContain('ios generation failed');
    });

    it('should pass validation when all platforms are consistent', () => {
      const results = [
        {
          platform: 'web' as const,
          filePath: 'test.js',
          content: 'test',
          tokenCount: 10,
          semanticTokenCount: 5,
          valid: true
        },
        {
          platform: 'ios' as const,
          filePath: 'test.swift',
          content: 'test',
          tokenCount: 10,
          semanticTokenCount: 5,
          valid: true
        },
        {
          platform: 'android' as const,
          filePath: 'test.kt',
          content: 'test',
          tokenCount: 10,
          semanticTokenCount: 5,
          valid: true
        }
      ];

      const validation = generator.validateCrossPlatformConsistency(results);

      expect(validation.consistent).toBe(true);
      expect(validation.issues).toHaveLength(0);
    });
  });

  describe('File Structure Consistency', () => {
    it('should generate consistent file names across platforms', () => {
      const results = generator.generateAll();

      expect(results[0].filePath).toContain('DesignTokens.web.css');
      expect(results[1].filePath).toContain('DesignTokens.ios.swift');
      expect(results[2].filePath).toContain('DesignTokens.android.kt');
    });

    it('should use consistent output directory across platforms', () => {
      const results = generator.generateAll({ outputDir: 'tokens' });

      results.forEach(result => {
        expect(result.filePath.startsWith('tokens/')).toBe(true);
      });
    });

    // UPDATED (Spec 025 F3): Verify behavior instead of hardcoded token counts
    // Tests should survive token system evolution
    it('should generate valid tokens for all platforms', () => {
      const results = generator.generateAll();

      // Verify all platforms generate tokens
      results.forEach(result => {
        expect(result.tokenCount).toBeGreaterThan(0);
        expect(result.valid).toBe(true);
      });

      // Verify cross-platform consistency (same count across platforms)
      const tokenCounts = results.map(r => r.tokenCount);
      const uniqueCounts = new Set(tokenCounts);
      expect(uniqueCounts.size).toBe(1); // All platforms should have same count
    });
  });

  describe('Generation Options', () => {
    it('should respect includeComments option', () => {
      const withComments = generator.generateWebTokens({ includeComments: true });
      const withoutComments = generator.generateWebTokens({ includeComments: false });

      expect(withComments.content.length).toBeGreaterThan(withoutComments.content.length);
    });

    it('should respect groupByCategory option', () => {
      const grouped = generator.generateWebTokens({ groupByCategory: true });
      const flat = generator.generateWebTokens({ groupByCategory: false });

      // Both should be valid but potentially different structure
      expect(grouped.valid).toBe(true);
      expect(flat.valid).toBe(true);
    });

    it('should apply options consistently across platforms', () => {
      const options: GenerationOptions = {
        version: '4.0.0',
        includeComments: true,
        groupByCategory: true
      };

      const results = generator.generateAll(options);

      results.forEach(result => {
        expect(result.content).toContain('4.0.0');
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle generation with minimal tokens', () => {
      const results = generator.generateAll();

      results.forEach(result => {
        expect(result.tokenCount).toBeGreaterThanOrEqual(0);
        expect(result.valid).toBe(true);
      });
    });

    it('should validate syntax for all generated files', () => {
      const results = generator.generateAll();

      results.forEach(result => {
        expect(result.valid).toBe(true);
        expect(result.errors).toBeUndefined();
      });
    });
  });

  describe('Content Validation', () => {
    it('should generate non-empty content for all platforms', () => {
      const results = generator.generateAll();

      results.forEach(result => {
        expect(result.content).toBeDefined();
        expect(result.content.length).toBeGreaterThan(0);
      });
    });

    it('should include header and footer in generated content', () => {
      const webResult = generator.generateWebTokens();
      const iosResult = generator.generateiOSTokens();
      const androidResult = generator.generateAndroidTokens();

      // Web should have CSS custom properties
      expect(webResult.content).toContain(':root');

      // iOS should have struct definition
      expect(iosResult.content).toContain('struct');

      // Android should have object definition
      expect(androidResult.content).toContain('object');
    });

    it('should include token definitions in generated content', () => {
      const results = generator.generateAll();

      results.forEach(result => {
        // Should contain at least some token definitions
        expect(result.tokenCount).toBeGreaterThan(0);
        expect(result.content.length).toBeGreaterThan(100); // Reasonable minimum
      });
    });
  });

  describe('Integration: Validation + Generation', () => {
    it('should validate semantic references before generating web tokens', () => {
      // Create test data
      const semantics = [
        {
          name: 'colorPrimary',
          primitiveReferences: { value: 'purple300' },
          category: 'color' as any,
          context: 'Primary brand color',
          description: 'Primary brand color for main actions'
        }
      ];

      const primitives = [
        {
          name: 'purple300',
          category: 'color' as any,
          baseValue: 0,
          familyBaseValue: 0,
          description: 'Purple 300',
          mathematicalRelationship: 'base',
          baselineGridAlignment: false,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {} as any
        }
      ];

      // Step 1: Validate semantic references
      const primitiveRegistry = new PrimitiveTokenRegistry();
      const semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);
      const validator = new SemanticTokenValidator(primitiveRegistry, semanticRegistry);
      const validation = validator.validateSemanticReferences(semantics, primitives);

      expect(validation.level).toBe('Pass');

      // Step 2: Generate tokens (assuming valid input)
      const result = generator.generateWebTokens();

      expect(result.valid).toBe(true);
      expect(result.tokenCount).toBeGreaterThan(0);
    });

    it('should detect invalid references before generation', () => {
      // Create test data with invalid reference
      const semantics = [
        {
          name: 'colorPrimary',
          primitiveReferences: { value: 'nonExistentToken' },
          category: 'color' as any,
          context: 'Primary brand color',
          description: 'Primary brand color for main actions'
        }
      ];

      const primitives = [
        {
          name: 'purple300',
          category: 'color' as any,
          baseValue: 0,
          familyBaseValue: 0,
          description: 'Purple 300',
          mathematicalRelationship: 'base',
          baselineGridAlignment: false,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {} as any
        }
      ];

      // Step 1: Validate semantic references
      const primitiveRegistry = new PrimitiveTokenRegistry();
      const semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);
      const validator = new SemanticTokenValidator(primitiveRegistry, semanticRegistry);
      const validation = validator.validateSemanticReferences(semantics, primitives);

      // Validation should fail
      expect(validation.level).toBe('Error');
      expect(validation.rationale).toContain('nonExistentToken');

      // Step 2: Should not proceed to generation if validation fails
      // (In real usage, caller would check validation.level before generating)
    });

    it('should validate typography tokens before generation', () => {
      // Create test data with valid typography token
      const semantics = [
        {
          name: 'typographyBodyMd',
          primitiveReferences: {
            fontSize: 'fontSize100',
            lineHeight: 'lineHeight100',
            fontFamily: 'fontFamilyBody',
            fontWeight: 'fontWeight400',
            letterSpacing: 'letterSpacing100'
          },
          category: 'typography' as any,
          context: 'Body medium typography',
          description: 'Medium body text style'
        }
      ];

      const primitives = [
        { name: 'fontSize100', category: 'fontSize' as any, baseValue: 16, familyBaseValue: 16, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} as any },
        { name: 'lineHeight100', category: 'lineHeight' as any, baseValue: 24, familyBaseValue: 24, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} as any },
        { name: 'fontFamilyBody', category: 'fontFamily' as any, baseValue: 0, familyBaseValue: 0, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} as any },
        { name: 'fontWeight400', category: 'fontWeight' as any, baseValue: 400, familyBaseValue: 400, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} as any },
        { name: 'letterSpacing100', category: 'letterSpacing' as any, baseValue: 0, familyBaseValue: 0, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} as any }
      ];

      // Step 1: Validate semantic references
      const primitiveRegistry = new PrimitiveTokenRegistry();
      const semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);
      const validator = new SemanticTokenValidator(primitiveRegistry, semanticRegistry);
      const validation = validator.validateSemanticReferences(semantics, primitives);

      expect(validation.level).toBe('Pass');

      // Step 2: Generate tokens (assuming valid input)
      const result = generator.generateWebTokens();

      expect(result.valid).toBe(true);
      expect(result.tokenCount).toBeGreaterThan(0);
    });

    it('should detect missing typography properties before generation', () => {
      // Create test data with missing typography property
      const semantics = [
        {
          name: 'typographyBodyMd',
          primitiveReferences: {
            fontSize: 'fontSize100',
            lineHeight: 'lineHeight100',
            fontFamily: 'fontFamilyBody',
            fontWeight: 'fontWeight400'
            // Missing letterSpacing
          },
          category: 'typography' as any,
          context: 'Body medium typography',
          description: 'Medium body text style'
        }
      ];

      const primitives = [
        { name: 'fontSize100', category: 'fontSize' as any, baseValue: 16, familyBaseValue: 16, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} as any },
        { name: 'lineHeight100', category: 'lineHeight' as any, baseValue: 24, familyBaseValue: 24, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} as any },
        { name: 'fontFamilyBody', category: 'fontFamily' as any, baseValue: 0, familyBaseValue: 0, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} as any },
        { name: 'fontWeight400', category: 'fontWeight' as any, baseValue: 400, familyBaseValue: 400, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} as any }
      ];

      // Step 1: Validate semantic references
      const primitiveRegistry = new PrimitiveTokenRegistry();
      const semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);
      const validator = new SemanticTokenValidator(primitiveRegistry, semanticRegistry);
      const validation = validator.validateSemanticReferences(semantics, primitives);

      // Validation should fail
      expect(validation.level).toBe('Error');
      expect(validation.rationale).toContain('letterSpacing');
      expect(validation.rationale).toContain('missing required reference');

      // Step 2: Should not proceed to generation if validation fails
    });

    it('should validate all platforms consistently', () => {
      // Create test data
      const semantics = [
        {
          name: 'colorPrimary',
          primitiveReferences: { value: 'purple300' },
          category: 'color' as any,
          context: 'Primary brand color',
          description: 'Primary brand color for main actions'
        }
      ];

      const primitives = [
        {
          name: 'purple300',
          category: 'color' as any,
          baseValue: 0,
          familyBaseValue: 0,
          description: 'Purple 300',
          mathematicalRelationship: 'base',
          baselineGridAlignment: false,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {} as any
        }
      ];

      // Step 1: Validate semantic references
      const primitiveRegistry = new PrimitiveTokenRegistry();
      const semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);
      const validator = new SemanticTokenValidator(primitiveRegistry, semanticRegistry);
      const validation = validator.validateSemanticReferences(semantics, primitives);

      expect(validation.level).toBe('Pass');

      // Step 2: Generate tokens for all platforms (assuming valid input)
      const results = generator.generateAll();

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.valid).toBe(true);
        expect(result.tokenCount).toBeGreaterThan(0);
      });
    });
  });

  describe('Component Token Generation', () => {
    // Import ComponentTokenRegistry for testing
    const { ComponentTokenRegistry } = require('../../registries/ComponentTokenRegistry');

    beforeEach(() => {
      // Clear registry before each test
      ComponentTokenRegistry.clear();
    });

    afterEach(() => {
      // Clean up after each test
      ComponentTokenRegistry.clear();
    });

    it('should generate component tokens for all platforms', () => {
      // Register test component tokens
      ComponentTokenRegistry.registerBatch('ButtonIcon', [
        {
          name: 'buttonicon.inset.large',
          component: 'ButtonIcon',
          family: 'spacing',
          value: 12,
          primitiveReference: 'space150',
          reasoning: 'Large inset for button icon padding'
        },
        {
          name: 'buttonicon.inset.medium',
          component: 'ButtonIcon',
          family: 'spacing',
          value: 10,
          primitiveReference: 'space125',
          reasoning: 'Medium inset for button icon padding'
        }
      ]);

      const results = generator.generateComponentTokens();

      expect(results).toHaveLength(3);
      expect(results.map(r => r.platform)).toEqual(['web', 'ios', 'android']);
    });

    it('should generate valid Web CSS component tokens', () => {
      ComponentTokenRegistry.registerBatch('ButtonIcon', [
        {
          name: 'buttonicon.inset.large',
          component: 'ButtonIcon',
          family: 'spacing',
          value: 12,
          primitiveReference: 'space150',
          reasoning: 'Large inset for button icon padding'
        }
      ]);

      const results = generator.generateComponentTokens();
      const webResult = results.find(r => r.platform === 'web');

      expect(webResult).toBeDefined();
      expect(webResult!.valid).toBe(true);
      expect(webResult!.filePath).toBe('dist/ComponentTokens.web.css');
      expect(webResult!.content).toContain(':root {');
      expect(webResult!.content).toContain('--buttonicon-inset-large');
      expect(webResult!.content).toContain('var(--space-150)');
      expect(webResult!.tokenCount).toBe(1);
      expect(webResult!.componentCount).toBe(1);
    });

    it('should generate valid iOS Swift component tokens', () => {
      ComponentTokenRegistry.registerBatch('ButtonIcon', [
        {
          name: 'buttonicon.inset.large',
          component: 'ButtonIcon',
          family: 'spacing',
          value: 12,
          primitiveReference: 'space150',
          reasoning: 'Large inset for button icon padding'
        }
      ]);

      const results = generator.generateComponentTokens();
      const iosResult = results.find(r => r.platform === 'ios');

      expect(iosResult).toBeDefined();
      expect(iosResult!.valid).toBe(true);
      expect(iosResult!.filePath).toBe('dist/ComponentTokens.ios.swift');
      expect(iosResult!.content).toContain('import UIKit');
      expect(iosResult!.content).toContain('public enum ButtonIconTokens');
      expect(iosResult!.content).toContain('insetLarge');
      expect(iosResult!.content).toContain('SpacingTokens.space150');
      expect(iosResult!.tokenCount).toBe(1);
    });

    it('should generate valid Android Kotlin component tokens', () => {
      ComponentTokenRegistry.registerBatch('ButtonIcon', [
        {
          name: 'buttonicon.inset.large',
          component: 'ButtonIcon',
          family: 'spacing',
          value: 12,
          primitiveReference: 'space150',
          reasoning: 'Large inset for button icon padding'
        }
      ]);

      const results = generator.generateComponentTokens();
      const androidResult = results.find(r => r.platform === 'android');

      expect(androidResult).toBeDefined();
      expect(androidResult!.valid).toBe(true);
      expect(androidResult!.filePath).toBe('dist/ComponentTokens.android.kt');
      expect(androidResult!.content).toContain('package com.designerpunk.tokens');
      expect(androidResult!.content).toContain('object ButtonIconTokens');
      expect(androidResult!.content).toContain('insetLarge');
      expect(androidResult!.content).toContain('SpacingTokens.space150');
      expect(androidResult!.tokenCount).toBe(1);
    });

    it('should group tokens by component', () => {
      // Register tokens for multiple components
      ComponentTokenRegistry.registerBatch('ButtonIcon', [
        {
          name: 'buttonicon.inset.large',
          component: 'ButtonIcon',
          family: 'spacing',
          value: 12,
          primitiveReference: 'space150',
          reasoning: 'Large inset'
        }
      ]);
      ComponentTokenRegistry.registerBatch('TextInput', [
        {
          name: 'textinput.padding.horizontal',
          component: 'TextInput',
          family: 'spacing',
          value: 16,
          primitiveReference: 'space200',
          reasoning: 'Horizontal padding'
        }
      ]);

      const results = generator.generateComponentTokens();
      const webResult = results.find(r => r.platform === 'web');

      expect(webResult!.componentCount).toBe(2);
      expect(webResult!.content).toContain('ButtonIcon Component Tokens');
      expect(webResult!.content).toContain('TextInput Component Tokens');
    });

    it('should maintain primitive token references (not inline values)', () => {
      ComponentTokenRegistry.registerBatch('ButtonIcon', [
        {
          name: 'buttonicon.inset.large',
          component: 'ButtonIcon',
          family: 'spacing',
          value: 12,
          primitiveReference: 'space150',
          reasoning: 'Large inset'
        }
      ]);

      const results = generator.generateComponentTokens();
      
      // Web should use var() reference
      const webResult = results.find(r => r.platform === 'web');
      expect(webResult!.content).toContain('var(--space-150)');
      expect(webResult!.content).not.toMatch(/--buttonicon-inset-large:\s*12;/);

      // iOS should use constant reference
      const iosResult = results.find(r => r.platform === 'ios');
      expect(iosResult!.content).toContain('SpacingTokens.space150');
      expect(iosResult!.content).not.toMatch(/insetLarge.*=\s*12$/m);

      // Android should use constant reference
      const androidResult = results.find(r => r.platform === 'android');
      expect(androidResult!.content).toContain('SpacingTokens.space150');
      expect(androidResult!.content).not.toMatch(/insetLarge\s*=\s*12$/m);
    });

    it('should handle tokens without primitive references', () => {
      ComponentTokenRegistry.registerBatch('Custom', [
        {
          name: 'custom.value',
          component: 'Custom',
          family: 'spacing',
          value: 14,
          reasoning: 'Custom value without primitive reference'
        }
      ]);

      const results = generator.generateComponentTokens();
      const webResult = results.find(r => r.platform === 'web');

      // Should use raw value when no primitive reference
      expect(webResult!.content).toContain('--custom-value: 14;');
    });

    it('should include reasoning comments when includeComments is true', () => {
      ComponentTokenRegistry.registerBatch('ButtonIcon', [
        {
          name: 'buttonicon.inset.large',
          component: 'ButtonIcon',
          family: 'spacing',
          value: 12,
          primitiveReference: 'space150',
          reasoning: 'Large inset for button icon padding'
        }
      ]);

      const results = generator.generateComponentTokens({ includeComments: true });
      const webResult = results.find(r => r.platform === 'web');

      expect(webResult!.content).toContain('Large inset for button icon padding');
    });

    it('should use custom output directory', () => {
      ComponentTokenRegistry.registerBatch('ButtonIcon', [
        {
          name: 'buttonicon.inset.large',
          component: 'ButtonIcon',
          family: 'spacing',
          value: 12,
          primitiveReference: 'space150',
          reasoning: 'Large inset'
        }
      ]);

      const results = generator.generateComponentTokens({ outputDir: 'custom/output' });

      expect(results[0].filePath).toBe('custom/output/ComponentTokens.web.css');
      expect(results[1].filePath).toBe('custom/output/ComponentTokens.ios.swift');
      expect(results[2].filePath).toBe('custom/output/ComponentTokens.android.kt');
    });

    it('should handle empty registry gracefully', () => {
      const results = generator.generateComponentTokens();

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.valid).toBe(true);
        expect(result.tokenCount).toBe(0);
        expect(result.componentCount).toBe(0);
      });
    });
  });
});
