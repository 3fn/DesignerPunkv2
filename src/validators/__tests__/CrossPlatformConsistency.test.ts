/**
 * Cross-Platform Consistency Validation Unit Tests
 * 
 * Tests for cross-platform mathematical consistency validation, tolerance calculations,
 * and proportional relationship verification across web, iOS, and Android platforms.
 */

import { CrossPlatformConsistencyValidator, CrossPlatformValidationContext, DetailedConsistencyResult } from '../CrossPlatformConsistencyValidator';
import { ToleranceCalculator, ToleranceContext } from '../ToleranceCalculator';
import { PlatformConstraintHandler } from '../PlatformConstraintHandler';
import { WebUnitConverter } from '../../providers/WebUnitConverter';
import { iOSUnitConverter } from '../../providers/iOSUnitConverter';
import { AndroidUnitConverter } from '../../providers/AndroidUnitConverter';
import { PrimitiveToken, TokenCategory } from '../../types/PrimitiveToken';
import { UnitProvider } from '../../providers/UnitProvider';

// Mock token factory for testing
const createMockToken = (overrides: Partial<PrimitiveToken> = {}): PrimitiveToken => ({
  name: 'test-token',
  category: TokenCategory.SPACING,
  baseValue: 8,
  familyBaseValue: 8,
  description: 'Test token',
  mathematicalRelationship: 'base × 1 = 8',
  baselineGridAlignment: true,
  isStrategicFlexibility: false,
  isPrecisionTargeted: false,
  platforms: {
    web: { value: 8, unit: 'px' },
    ios: { value: 8, unit: 'pt' },
    android: { value: 8, unit: 'dp' }
  },
  ...overrides
});

describe('CrossPlatformConsistencyValidator', () => {
  let validator: CrossPlatformConsistencyValidator;
  let toleranceCalculator: ToleranceCalculator;
  let constraintHandler: PlatformConstraintHandler;
  let unitProviders: Record<string, UnitProvider>;

  beforeEach(() => {
    toleranceCalculator = new ToleranceCalculator();
    constraintHandler = new PlatformConstraintHandler();
    validator = new CrossPlatformConsistencyValidator(toleranceCalculator, constraintHandler);
    
    unitProviders = {
      web: new WebUnitConverter(),
      ios: new iOSUnitConverter(),
      android: new AndroidUnitConverter()
    };
  });

  describe('Token Validation', () => {
    test('should validate consistent spacing tokens as Pass', async () => {
      const spacingToken = createMockToken({
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8
      });

      const context: CrossPlatformValidationContext = {
        token: spacingToken,
        unitProviders,
        handleConstraints: false
      };

      const result = await validator.validateToken(context);

      expect(result.isConsistent).toBe(true);
      expect(result.tokenName).toBe('space100');
      expect(result.category).toBe(TokenCategory.SPACING);
      expect(result.mathematicalAnalysis.consistencyScore).toBe(1.0);
      expect(result.mathematicalAnalysis.failedPairs).toHaveLength(0);
    });

    test('should validate fontSize tokens with REM precision rounding tolerance', async () => {
      // Use fontSize050 which has precision rounding: 13px → 0.813rem (rounded from 0.8125)
      const fontSizeToken = createMockToken({
        name: 'fontSize050',
        category: TokenCategory.FONT_SIZE,
        baseValue: 13
      });

      const context: CrossPlatformValidationContext = {
        token: fontSizeToken,
        unitProviders,
        handleConstraints: false
      };

      const result = await validator.validateToken(context);

      // Check the actual converted values
      expect(result.platformValues.web.value).toBe(0.813); // 13 ÷ 16 = 0.8125 → 0.813 (rounded)
      expect(result.platformValues.ios.value).toBe(13); // 13pt
      expect(result.platformValues.android.value).toBe(13); // 13sp
      
      // The validator should handle the precision rounding within tolerance
      // Note: This will still be inconsistent because 0.813 ≠ 13, but tolerance should be calculated correctly
      expect(result.toleranceDetails.tolerance).toBeGreaterThan(0.001); // Should have higher tolerance for fontSize
      expect(result.toleranceDetails.reasoning).toContain('fontSize conversion precision');
    });

    test('should validate unitless tokens for exact consistency', async () => {
      const lineHeightToken = createMockToken({
        name: 'lineHeight100',
        category: TokenCategory.LINE_HEIGHT,
        baseValue: 1.5
      });

      const context: CrossPlatformValidationContext = {
        token: lineHeightToken,
        unitProviders,
        handleConstraints: false
      };

      const result = await validator.validateToken(context);

      expect(result.isConsistent).toBe(true);
      expect(result.platformValues.web.value).toBe(1.5);
      expect(result.platformValues.ios.value).toBe(1.5);
      expect(result.platformValues.android.value).toBe(1.5);
      expect(result.mathematicalAnalysis.consistencyScore).toBe(1.0);
    });

    test('should validate string tokens for exact matching', async () => {
      // Use mock unit providers that return consistent string values
      const mockStringProviders = {
        web: {
          platform: 'web' as const,
          convertToken: () => ({ value: 'Inter, sans-serif', unit: 'fontFamily' as const }),
          convertValue: () => ({ value: 'Inter, sans-serif', unit: 'fontFamily' as const }),
          getConversionFactor: () => ({ factor: 1, unit: 'fontFamily' }),
          validateConversion: () => true
        },
        ios: {
          platform: 'ios' as const,
          convertToken: () => ({ value: 'Inter, sans-serif', unit: 'fontFamily' as const }),
          convertValue: () => ({ value: 'Inter, sans-serif', unit: 'fontFamily' as const }),
          getConversionFactor: () => ({ factor: 1, unit: 'fontFamily' }),
          validateConversion: () => true
        },
        android: {
          platform: 'android' as const,
          convertToken: () => ({ value: 'Inter, sans-serif', unit: 'fontFamily' as const }),
          convertValue: () => ({ value: 'Inter, sans-serif', unit: 'fontFamily' as const }),
          getConversionFactor: () => ({ factor: 1, unit: 'fontFamily' }),
          validateConversion: () => true
        }
      };

      const fontFamilyToken = createMockToken({
        name: 'fontFamilySystem',
        category: TokenCategory.FONT_FAMILY,
        baseValue: 0
      });

      const context: CrossPlatformValidationContext = {
        token: fontFamilyToken,
        unitProviders: mockStringProviders,
        handleConstraints: false
      };

      const result = await validator.validateToken(context);

      expect(result.isConsistent).toBe(true);
      expect(result.platformValues.web.value).toBe('Inter, sans-serif');
      expect(result.platformValues.ios.value).toBe('Inter, sans-serif');
      expect(result.platformValues.android.value).toBe('Inter, sans-serif');
      expect(result.mathematicalAnalysis.consistencyScore).toBe(1.0);
    });

    test('should detect string mismatches as inconsistent', async () => {
      const fontFamilyToken = createMockToken({
        name: 'fontFamilyMismatch',
        category: TokenCategory.FONT_FAMILY,
        baseValue: 0,
        platforms: {
          web: { value: 'Inter, sans-serif', unit: 'fontFamily' },
          ios: { value: 'SF Pro, sans-serif', unit: 'fontFamily' },
          android: { value: 'Roboto, sans-serif', unit: 'fontFamily' }
        }
      });

      const context: CrossPlatformValidationContext = {
        token: fontFamilyToken,
        unitProviders,
        handleConstraints: false
      };

      const result = await validator.validateToken(context);

      expect(result.isConsistent).toBe(false);
      expect(result.mathematicalAnalysis.failedPairs.length).toBeGreaterThan(0);
      expect(result.mathematicalAnalysis.consistencyScore).toBeLessThan(1.0);
    });
  });

  describe('Tolerance Handling', () => {
    test('should use appropriate tolerance for different token categories', async () => {
      const spacingToken = createMockToken({
        category: TokenCategory.SPACING,
        baseValue: 8
      });

      const context: CrossPlatformValidationContext = {
        token: spacingToken,
        unitProviders,
        handleConstraints: false
      };

      const result = await validator.validateToken(context);

      expect(result.toleranceDetails.tolerance).toBeDefined();
      expect(result.toleranceDetails.reasoning).toContain('mathematical tolerance');
    });

    test('should apply relative tolerance for large values', async () => {
      const largeToken = createMockToken({
        category: TokenCategory.SPACING,
        baseValue: 1000
      });

      const context: CrossPlatformValidationContext = {
        token: largeToken,
        unitProviders,
        handleConstraints: false,
        options: { useRelativeTolerance: true }
      };

      const result = await validator.validateToken(context);

      expect(result.toleranceDetails.reasoning).toContain('Relative tolerance applied');
    });

    test('should apply tolerance multiplier when specified', async () => {
      const token = createMockToken({
        category: TokenCategory.SPACING,
        baseValue: 8
      });

      const context: CrossPlatformValidationContext = {
        token,
        unitProviders,
        handleConstraints: false,
        options: { toleranceMultiplier: 2.0 }
      };

      const result = await validator.validateToken(context);

      // Tolerance should be doubled
      const baseTolerance = toleranceCalculator.calculateTolerance({
        category: token.category,
        platforms: Object.keys(unitProviders),
        hasUnitConversion: true,
        hasPlatformConstraints: false,
        baseValue: token.baseValue,
        isStrategicFlexibility: token.isStrategicFlexibility
      });

      expect(result.toleranceDetails.tolerance).toBe(baseTolerance.tolerance * 2.0);
    });
  });

  describe('Platform Constraint Handling', () => {
    test('should handle constraints when enabled', async () => {
      const tapAreaToken = createMockToken({
        name: 'tapAreaSmall',
        category: TokenCategory.TAP_AREA,
        baseValue: 32 // Below iOS minimum of 44pt
      });

      const context: CrossPlatformValidationContext = {
        token: tapAreaToken,
        unitProviders,
        handleConstraints: true
      };

      const result = await validator.validateToken(context);

      expect(result.constraintHandling).toBeDefined();
      expect(result.constraintHandling?.hasConstraints).toBe(true);
      expect(result.constraintHandling?.constraints.length).toBeGreaterThan(0);
    });

    test('should fail in strict mode when constraints are detected', async () => {
      const tapAreaToken = createMockToken({
        name: 'tapAreaSmall',
        category: TokenCategory.TAP_AREA,
        baseValue: 32
      });

      const context: CrossPlatformValidationContext = {
        token: tapAreaToken,
        unitProviders,
        handleConstraints: true,
        options: { strictMode: true }
      };

      const result = await validator.validateToken(context);

      expect(result.isConsistent).toBe(false);
      expect(result.inconsistencies).toContain('Strict mode: constraints detected');
    });

    test('should provide adjusted values when constraints are handled', async () => {
      const tapAreaToken = createMockToken({
        name: 'tapAreaSmall',
        category: TokenCategory.TAP_AREA,
        baseValue: 32
      });

      const context: CrossPlatformValidationContext = {
        token: tapAreaToken,
        unitProviders,
        handleConstraints: true
      };

      const result = await validator.validateToken(context);

      if (result.constraintHandling?.hasConstraints) {
        // iOS should adjust to 44pt minimum
        expect(result.constraintHandling.adjustedValues.ios.value).toBe(44);
        // Android should adjust to 48dp minimum
        expect(result.constraintHandling.adjustedValues.android.value).toBe(48);
      }
    });
  });

  describe('Mathematical Analysis', () => {
    test('should calculate proportional relationships correctly', async () => {
      const token = createMockToken({
        category: TokenCategory.SPACING,
        baseValue: 16
      });

      const context: CrossPlatformValidationContext = {
        token,
        unitProviders,
        handleConstraints: false
      };

      const result = await validator.validateToken(context);

      // All platforms should have 1:1:1 ratio for spacing
      const relationships = result.mathematicalAnalysis.proportionalRelationships;
      Object.values(relationships).forEach(ratio => {
        expect(ratio).toBeCloseTo(1.0, 3);
      });
    });

    test('should detect maximum deviation correctly', async () => {
      // Create a mock scenario with slight deviation
      const mockUnitProviders = {
        web: {
          platform: 'web' as const,
          convertToken: () => ({ value: 16.001, unit: 'px' as const }),
          convertValue: () => ({ value: 16.001, unit: 'px' as const }),
          getConversionFactor: () => ({ factor: 1, unit: 'px' }),
          validateConversion: () => true
        },
        ios: {
          platform: 'ios' as const,
          convertToken: () => ({ value: 16.000, unit: 'pt' as const }),
          convertValue: () => ({ value: 16.000, unit: 'pt' as const }),
          getConversionFactor: () => ({ factor: 1, unit: 'pt' }),
          validateConversion: () => true
        },
        android: {
          platform: 'android' as const,
          convertToken: () => ({ value: 15.999, unit: 'dp' as const }),
          convertValue: () => ({ value: 15.999, unit: 'dp' as const }),
          getConversionFactor: () => ({ factor: 1, unit: 'dp' }),
          validateConversion: () => true
        }
      };

      const token = createMockToken({
        category: TokenCategory.SPACING,
        baseValue: 16
      });

      const context: CrossPlatformValidationContext = {
        token,
        unitProviders: mockUnitProviders,
        handleConstraints: false
      };

      const result = await validator.validateToken(context);

      // Maximum deviation should be between 16.001 and 15.999 = 0.002
      expect(result.mathematicalAnalysis.maxDeviation).toBeCloseTo(0.002, 6);
    });

    test('should calculate consistency score accurately', async () => {
      const consistentToken = createMockToken({
        category: TokenCategory.SPACING,
        baseValue: 8
      });

      const context: CrossPlatformValidationContext = {
        token: consistentToken,
        unitProviders,
        handleConstraints: false
      };

      const result = await validator.validateToken(context);

      expect(result.mathematicalAnalysis.consistencyScore).toBe(1.0);
      expect(result.isConsistent).toBe(true);
    });
  });

  describe('Recommendations Generation', () => {
    test('should provide recommendations for low consistency scores', async () => {
      // Create a scenario with poor consistency
      const mockUnitProviders = {
        web: {
          platform: 'web' as const,
          convertToken: () => ({ value: 16, unit: 'px' as const }),
          convertValue: () => ({ value: 16, unit: 'px' as const }),
          getConversionFactor: () => ({ factor: 1, unit: 'px' }),
          validateConversion: () => true
        },
        ios: {
          platform: 'ios' as const,
          convertToken: () => ({ value: 20, unit: 'pt' as const }),
          convertValue: () => ({ value: 20, unit: 'pt' as const }),
          getConversionFactor: () => ({ factor: 1, unit: 'pt' }),
          validateConversion: () => true
        }
      };

      const token = createMockToken({
        category: TokenCategory.SPACING,
        baseValue: 16
      });

      const context: CrossPlatformValidationContext = {
        token,
        unitProviders: mockUnitProviders,
        handleConstraints: false
      };

      const result = await validator.validateToken(context);

      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations.some(rec => 
        rec.includes('adjusting base value') || rec.includes('unit conversion')
      )).toBe(true);
    });

    test('should provide category-specific recommendations', async () => {
      const fontSizeToken = createMockToken({
        category: TokenCategory.FONT_SIZE,
        baseValue: 17 // Doesn't convert cleanly to REM
      });

      const context: CrossPlatformValidationContext = {
        token: fontSizeToken,
        unitProviders,
        handleConstraints: false
      };

      const result = await validator.validateToken(context);

      // Should recommend clean REM conversion for fontSize tokens
      expect(result.recommendations.some(rec => 
        rec.includes('REM') || rec.includes('font size')
      )).toBe(true);
    });

    test('should provide accessibility recommendations for tap areas', async () => {
      const tapAreaToken = createMockToken({
        category: TokenCategory.TAP_AREA,
        baseValue: 44
      });

      const context: CrossPlatformValidationContext = {
        token: tapAreaToken,
        unitProviders,
        handleConstraints: false
      };

      const result = await validator.validateToken(context);

      expect(result.recommendations.some(rec => 
        rec.includes('accessibility') || rec.includes('tap area')
      )).toBe(true);
    });
  });

  describe('Batch Validation', () => {
    test('should validate multiple tokens efficiently', async () => {
      const tokens = [
        createMockToken({ name: 'space100', category: TokenCategory.SPACING, baseValue: 8 }),
        createMockToken({ name: 'space200', category: TokenCategory.SPACING, baseValue: 16 }),
        createMockToken({ name: 'lineHeight100', category: TokenCategory.LINE_HEIGHT, baseValue: 1.5 })
      ];

      const results = await validator.validateTokens(tokens, unitProviders);

      expect(results).toHaveLength(3);
      // Spacing tokens should be consistent (same units across platforms)
      // LineHeight tokens should be consistent (unitless across platforms)
      expect(results.filter(result => result.isConsistent)).toHaveLength(3);
    });

    test('should generate summary report for batch validation', async () => {
      const tokens = [
        createMockToken({ name: 'consistent1', category: TokenCategory.SPACING, baseValue: 8 }),
        createMockToken({ name: 'consistent2', category: TokenCategory.SPACING, baseValue: 16 })
      ];

      const results = await validator.validateTokens(tokens, unitProviders);
      const summary = validator.generateSummaryReport(results);

      expect(summary.totalTokens).toBe(2);
      expect(summary.consistentTokens).toBe(2);
      expect(summary.inconsistentTokens).toBe(0);
      expect(summary.averageConsistencyScore).toBe(1.0);
    });

    test('should identify common issues in summary report', async () => {
      // Create tokens with known issues
      const mockUnitProviders = {
        web: {
          platform: 'web' as const,
          convertToken: () => ({ value: 16, unit: 'px' as const }),
          convertValue: () => ({ value: 16, unit: 'px' as const }),
          getConversionFactor: () => ({ factor: 1, unit: 'px' }),
          validateConversion: () => true
        },
        ios: {
          platform: 'ios' as const,
          convertToken: () => ({ value: 20, unit: 'pt' as const }),
          convertValue: () => ({ value: 20, unit: 'pt' as const }),
          getConversionFactor: () => ({ factor: 1, unit: 'pt' }),
          validateConversion: () => true
        }
      };

      const tokens = [
        createMockToken({ name: 'problem1', category: TokenCategory.SPACING, baseValue: 16 }),
        createMockToken({ name: 'problem2', category: TokenCategory.SPACING, baseValue: 24 })
      ];

      const results = await validator.validateTokens(tokens, mockUnitProviders);
      const summary = validator.generateSummaryReport(results);

      expect(summary.inconsistentTokens).toBeGreaterThan(0);
      expect(summary.platformIssues.ios).toBeGreaterThan(0);
      expect(summary.commonIssues.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle conversion errors gracefully', async () => {
      const mockUnitProviders = {
        web: {
          platform: 'web' as const,
          convertToken: () => { throw new Error('Conversion failed'); },
          convertValue: () => ({ value: 16, unit: 'px' as const }),
          getConversionFactor: () => ({ factor: 1, unit: 'px' }),
          validateConversion: () => true
        },
        ios: {
          platform: 'ios' as const,
          convertToken: () => ({ value: 16, unit: 'pt' as const }),
          convertValue: () => ({ value: 16, unit: 'pt' as const }),
          getConversionFactor: () => ({ factor: 1, unit: 'pt' }),
          validateConversion: () => true
        }
      };

      const token = createMockToken({
        category: TokenCategory.SPACING,
        baseValue: 16
      });

      const context: CrossPlatformValidationContext = {
        token,
        unitProviders: mockUnitProviders,
        handleConstraints: false
      };

      const result = await validator.validateToken(context);

      expect(result.platformValues.web.unit).toBe('error');
      expect(result.isConsistent).toBe(false);
    });

    test('should handle empty unit providers', async () => {
      const token = createMockToken({
        category: TokenCategory.SPACING,
        baseValue: 16
      });

      const context: CrossPlatformValidationContext = {
        token,
        unitProviders: {},
        handleConstraints: false
      };

      const result = await validator.validateToken(context);

      expect(result.mathematicalAnalysis.consistencyScore).toBe(1.0); // No comparisons = perfect score
      expect(result.isConsistent).toBe(true);
    });

    test('should handle single platform validation', async () => {
      const token = createMockToken({
        category: TokenCategory.SPACING,
        baseValue: 16
      });

      const context: CrossPlatformValidationContext = {
        token,
        unitProviders: { web: unitProviders.web },
        handleConstraints: false
      };

      const result = await validator.validateToken(context);

      expect(result.mathematicalAnalysis.consistencyScore).toBe(1.0); // Single platform = no inconsistency
      expect(result.isConsistent).toBe(true);
    });
  });
});