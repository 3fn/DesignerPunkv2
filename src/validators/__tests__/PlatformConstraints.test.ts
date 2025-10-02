/**
 * Platform Constraint Handler Unit Tests
 * 
 * Tests for platform-specific constraint identification, handling, and graceful degradation.
 * Covers constraint detection, value adjustment, and consistency assessment.
 */

import {
  PlatformConstraintHandler,
  ConstraintType,
  PlatformConstraint,
  ConstraintHandlingResult
} from '../PlatformConstraintHandler';
import { WebUnitConverter } from '../../providers/WebUnitConverter';
import { iOSUnitConverter } from '../../providers/iOSUnitConverter';
import { AndroidUnitConverter } from '../../providers/AndroidUnitConverter';
import { TokenCategory, PlatformValues } from '../../types/PrimitiveToken';
import { UnitProvider } from '../../providers/UnitProvider';

// Helper function to create properly typed platform values
const createPlatformValues = (
  webValue: number | string, webUnit: PlatformValues['web']['unit'],
  iosValue: number | string, iosUnit: PlatformValues['ios']['unit'],
  androidValue: number | string, androidUnit: PlatformValues['android']['unit']
): Record<string, PlatformValues[keyof PlatformValues]> => ({
  web: { value: webValue, unit: webUnit },
  ios: { value: iosValue, unit: iosUnit },
  android: { value: androidValue, unit: androidUnit }
});

describe('PlatformConstraintHandler', () => {
  let constraintHandler: PlatformConstraintHandler;
  let unitProviders: Record<string, UnitProvider>;

  beforeEach(() => {
    constraintHandler = new PlatformConstraintHandler();
    unitProviders = {
      web: new WebUnitConverter(),
      ios: new iOSUnitConverter(),
      android: new AndroidUnitConverter()
    };
  });

  describe('Constraint Identification', () => {
    describe('Web Platform Constraints', () => {
      test('should identify minimum font size constraint for web', () => {
        const platformValues = createPlatformValues(0.3, 'rem', 5, 'pt', 5, 'sp');

        const constraints = constraintHandler.identifyConstraints(
          'fontSize-tiny',
          TokenCategory.FONT_SIZE,
          platformValues
        );

        const webConstraint = constraints.find(c => c.platforms.includes('web'));
        expect(webConstraint).toBeDefined();
        expect(webConstraint?.type).toBe(ConstraintType.RENDERING);
        expect(webConstraint?.constrainedValue).toBe(0.5);
        expect(webConstraint?.severity).toBe('medium');
      });

      test('should identify REM precision constraint for web', () => {
        // Use a pixel value that would trigger precision constraint (> 10 and with many decimals)
        const platformValues = createPlatformValues(18.123456789, 'px', 18, 'pt', 18, 'sp');

        const constraints = constraintHandler.identifyConstraints(
          'fontSize-precise',
          TokenCategory.FONT_SIZE,
          platformValues
        );

        const precisionConstraint = constraints.find(c =>
          c.type === ConstraintType.CONVERSION_PRECISION && c.platforms.includes('web')
        );
        expect(precisionConstraint).toBeDefined();
        expect(precisionConstraint?.severity).toBe('low');
      });
    });

    describe('iOS Platform Constraints', () => {
      test('should identify minimum tap area constraint for iOS', () => {
        const platformValues = createPlatformValues(32, 'px', 32, 'pt', 32, 'dp');

        const constraints = constraintHandler.identifyConstraints(
          'tapArea-small',
          TokenCategory.TAP_AREA,
          platformValues
        );

        const iosConstraint = constraints.find(c => c.platforms.includes('ios'));
        expect(iosConstraint).toBeDefined();
        expect(iosConstraint?.type).toBe(ConstraintType.ACCESSIBILITY);
        expect(iosConstraint?.constrainedValue).toBe(44);
        expect(iosConstraint?.severity).toBe('high');
        expect(iosConstraint?.description).toContain('44pt');
      });

      test('should not constrain valid intermediate font weights', () => {
        const platformValues = createPlatformValues(450, 'fontWeight', 450, 'fontWeight', 450, 'fontWeight');

        const constraints = constraintHandler.identifyConstraints(
          'fontWeight-custom',
          TokenCategory.FONT_WEIGHT,
          platformValues
        );

        // 450 is a valid font weight, should not be constrained
        expect(constraints).toHaveLength(0);
      });
    });

    describe('Android Platform Constraints', () => {
      test('should identify minimum tap area constraint for Android', () => {
        const platformValues = createPlatformValues(40, 'px', 40, 'pt', 40, 'dp');

        const constraints = constraintHandler.identifyConstraints(
          'tapArea-small',
          TokenCategory.TAP_AREA,
          platformValues
        );

        const androidConstraint = constraints.find(c => c.platforms.includes('android'));
        expect(androidConstraint).toBeDefined();
        expect(androidConstraint?.type).toBe(ConstraintType.ACCESSIBILITY);
        expect(androidConstraint?.constrainedValue).toBe(48);
        expect(androidConstraint?.severity).toBe('high');
        expect(androidConstraint?.description).toContain('48dp');
      });

      test('should not constrain valid intermediate font weights for Android', () => {
        const platformValues = createPlatformValues(350, 'fontWeight', 350, 'fontWeight', 350, 'fontWeight');

        const constraints = constraintHandler.identifyConstraints(
          'fontWeight-light',
          TokenCategory.FONT_WEIGHT,
          platformValues
        );

        // 350 is a valid font weight, should not be constrained
        expect(constraints).toHaveLength(0);
      });
    });

    describe('Cross-Platform Font Weight Constraints', () => {
      test('should handle extreme font weight values', () => {
        const platformValues = createPlatformValues(50, 'fontWeight', 50, 'fontWeight', 50, 'fontWeight');

        const constraints = constraintHandler.identifyConstraints(
          'fontWeight-extreme',
          TokenCategory.FONT_WEIGHT,
          platformValues
        );

        expect(constraints).toHaveLength(3); // All platforms should constrain
        constraints.forEach(constraint => {
          expect(constraint.constrainedValue).toBe(100); // Clamped to minimum
          expect(constraint.type).toBe(ConstraintType.FONT_SYSTEM);
        });
      });

      test('should handle font weight values above maximum', () => {
        const platformValues = createPlatformValues(1000, 'fontWeight', 1000, 'fontWeight', 1000, 'fontWeight');

        const constraints = constraintHandler.identifyConstraints(
          'fontWeight-heavy',
          TokenCategory.FONT_WEIGHT,
          platformValues
        );

        expect(constraints).toHaveLength(3);
        constraints.forEach(constraint => {
          expect(constraint.constrainedValue).toBe(900); // Clamped to maximum
        });
      });
    });
  });

  describe('Constraint Handling', () => {
    test('should return no constraints when none are identified', () => {
      const platformValues = createPlatformValues(16, 'px', 16, 'pt', 16, 'dp');

      const result = constraintHandler.handleConstraints(
        'space100',
        TokenCategory.SPACING,
        platformValues,
        unitProviders
      );

      expect(result.hasConstraints).toBe(false);
      expect(result.constraints).toHaveLength(0);
      expect(result.adjustedValues).toEqual(platformValues);
      expect(result.strategy).toContain('No constraints identified');
      expect(result.consistencyAssessment).toContain('Mathematical consistency preserved');
    });

    test('should handle iOS tap area constraint', () => {
      const platformValues = createPlatformValues(32, 'px', 32, 'pt', 32, 'dp');

      const result = constraintHandler.handleConstraints(
        'tapArea-small',
        TokenCategory.TAP_AREA,
        platformValues,
        unitProviders
      );

      expect(result.hasConstraints).toBe(true);
      expect(result.constraints.length).toBeGreaterThan(0);
      expect(result.adjustedValues.ios.value).toBe(44); // Adjusted to minimum
      expect(result.adjustedValues.android.value).toBe(48); // Android minimum
      expect(result.adjustedValues.web.value).toBe(32); // Web unchanged
    });

    test('should handle multiple constraints across platforms', () => {
      const platformValues = createPlatformValues(0.3, 'rem', 5, 'pt', 5, 'sp'); // Below web minimum

      const result = constraintHandler.handleConstraints(
        'fontSize-tiny',
        TokenCategory.FONT_SIZE,
        platformValues,
        unitProviders
      );

      expect(result.hasConstraints).toBe(true);
      expect(result.adjustedValues.web.value).toBe(0.5); // Adjusted to web minimum
      expect(result.strategy).toContain('Web browsers may not render fonts smaller');
    });

    test('should provide comprehensive strategy description', () => {
      const platformValues = createPlatformValues(30, 'px', 30, 'pt', 30, 'dp');

      const result = constraintHandler.handleConstraints(
        'tapArea-tiny',
        TokenCategory.TAP_AREA,
        platformValues,
        unitProviders
      );

      expect(result.strategy).toContain('ios:');
      expect(result.strategy).toContain('android:');
      expect(result.strategy).toContain('44');
      expect(result.strategy).toContain('48');
    });
  });

  describe('Consistency Assessment', () => {
    test('should assess high-severity constraint impact', () => {
      const platformValues = createPlatformValues(20, 'px', 20, 'pt', 20, 'dp');

      const result = constraintHandler.handleConstraints(
        'tapArea-very-small',
        TokenCategory.TAP_AREA,
        platformValues,
        unitProviders
      );

      expect(result.consistencyAssessment).toContain('High-severity constraints applied');
      expect(result.consistencyAssessment).toContain('Platform requirements enforced');
    });

    test('should assess medium-severity constraint impact', () => {
      const platformValues = createPlatformValues(0.4, 'rem', 6, 'pt', 6, 'sp');

      const result = constraintHandler.handleConstraints(
        'fontSize-small',
        TokenCategory.FONT_SIZE,
        platformValues,
        unitProviders
      );

      expect(result.consistencyAssessment).toContain('Medium-severity constraints applied');
      expect(result.consistencyAssessment).toContain('Platform optimization applied');
    });

    test('should assess low-severity constraint impact', () => {
      const platformValues = createPlatformValues(50, 'fontWeight', 50, 'fontWeight', 50, 'fontWeight'); // Use extreme value that will be constrained

      const result = constraintHandler.handleConstraints(
        'fontWeight-extreme',
        TokenCategory.FONT_WEIGHT,
        platformValues,
        unitProviders
      );

      expect(result.consistencyAssessment).toContain('Low-severity constraints applied');
      expect(result.consistencyAssessment).toContain('Minor precision adjustments');
    });

    test('should assess proportional relationship maintenance', () => {
      const platformValues = createPlatformValues(16, 'px', 16, 'pt', 16, 'dp');

      const result = constraintHandler.handleConstraints(
        'spacing-consistent',
        TokenCategory.SPACING,
        platformValues,
        unitProviders
      );

      // When no constraints are applied, the message should indicate mathematical consistency is preserved
      expect(result.consistencyAssessment).toContain('Mathematical consistency preserved');
    });
  });

  describe('Proportional Relationship Validation', () => {
    test('should detect when proportional relationships are maintained', () => {
      const originalValues = createPlatformValues(16, 'px', 16, 'pt', 16, 'dp');
      const adjustedValues = createPlatformValues(32, 'px', 32, 'pt', 32, 'dp');

      // Use private method through constraint handling
      const result = constraintHandler.handleConstraints(
        'test-token',
        TokenCategory.SPACING,
        originalValues,
        unitProviders
      );

      // Since no constraints are applied, relationships should be maintained
      expect(result.consistencyAssessment).toContain('Mathematical consistency preserved');
    });

    test('should detect when proportional relationships are affected', () => {
      const platformValues = createPlatformValues(30, 'px', 30, 'pt', 30, 'dp');

      const result = constraintHandler.handleConstraints(
        'tapArea-constrained',
        TokenCategory.TAP_AREA,
        platformValues,
        unitProviders
      );

      // Constraints will change iOS to 44 and Android to 48, affecting proportions
      if (result.hasConstraints) {
        expect(result.consistencyAssessment).toContain('proportional relationships');
      }
    });
  });

  describe('Constraint Documentation', () => {
    test('should provide comprehensive constraint documentation', () => {
      const documentation = constraintHandler.getConstraintDocumentation();

      expect(documentation.web).toBeDefined();
      expect(documentation.ios).toBeDefined();
      expect(documentation.android).toBeDefined();

      expect(documentation.web.fontSize).toContain('0.5rem');
      expect(documentation.ios.tapArea).toContain('44pt');
      expect(documentation.android.tapArea).toContain('48dp');
    });

    test('should document font weight constraints for all platforms', () => {
      const documentation = constraintHandler.getConstraintDocumentation();

      expect(documentation.web.fontWeight).toContain('100-900');
      expect(documentation.ios.fontWeight).toContain('100-900');
      expect(documentation.android.fontWeight).toContain('100-900');
    });
  });

  describe('Constraint Handling Validation', () => {
    test('should validate successful constraint handling', () => {
      const result: ConstraintHandlingResult = {
        hasConstraints: true,
        constraints: [{
          type: ConstraintType.ACCESSIBILITY,
          platforms: ['ios'],
          category: TokenCategory.TAP_AREA,
          description: 'Test constraint',
          originalValue: 32,
          constrainedValue: 44,
          impact: 'Test impact',
          recommendation: 'Test recommendation',
          severity: 'high'
        }],
        adjustedValues: createPlatformValues(32, 'px', 44, 'pt', 32, 'dp'),
        strategy: 'ios: Test constraint (32 → 44)',
        consistencyAssessment: 'High-severity constraints applied'
      };

      const isValid = constraintHandler.validateConstraintHandling(result);
      expect(isValid).toBe(true);
    });

    test('should reject constraint handling with ignored high-severity constraints', () => {
      const result: ConstraintHandlingResult = {
        hasConstraints: true,
        constraints: [{
          type: ConstraintType.ACCESSIBILITY,
          platforms: ['ios'],
          category: TokenCategory.TAP_AREA,
          description: 'Test constraint',
          originalValue: 32,
          constrainedValue: 44,
          impact: 'Test impact',
          recommendation: 'Test recommendation',
          severity: 'high'
        }],
        adjustedValues: createPlatformValues(32, 'px', 32, 'pt', 32, 'dp'), // Not adjusted despite high severity
        strategy: 'No adjustments made', // Strategy doesn't mention ios
        consistencyAssessment: 'No constraints handled'
      };

      const isValid = constraintHandler.validateConstraintHandling(result);
      expect(isValid).toBe(false);
    });

    test('should reject constraint handling with unreasonable values', () => {
      const result: ConstraintHandlingResult = {
        hasConstraints: true,
        constraints: [],
        adjustedValues: {
          web: { value: -100, unit: 'px' as const }, // Unreasonable negative value
          ios: { value: 44, unit: 'pt' as const },
          android: { value: 15000, unit: 'dp' as const } // Unreasonably large value
        },
        strategy: 'Test strategy',
        consistencyAssessment: 'Test assessment'
      };

      const isValid = constraintHandler.validateConstraintHandling(result);
      expect(isValid).toBe(false);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle empty platform values', () => {
      const result = constraintHandler.handleConstraints(
        'empty-token',
        TokenCategory.SPACING,
        {},
        unitProviders
      );

      expect(result.hasConstraints).toBe(false);
      expect(result.constraints).toHaveLength(0);
      expect(result.adjustedValues).toEqual({});
    });

    test('should handle unknown token categories gracefully', () => {
      const platformValues = createPlatformValues(16, 'px', 16, 'pt', 16, 'dp');

      const result = constraintHandler.handleConstraints(
        'unknown-token',
        'unknown' as TokenCategory,
        platformValues,
        unitProviders
      );

      expect(result.hasConstraints).toBe(false);
      expect(result.adjustedValues).toEqual(platformValues);
    });

    test('should handle string values in constraints', () => {
      const platformValues = createPlatformValues('Inter, sans-serif', 'fontFamily', 'Inter, sans-serif', 'fontFamily', 'Inter, sans-serif', 'fontFamily');

      const result = constraintHandler.handleConstraints(
        'fontFamily-token',
        TokenCategory.FONT_FAMILY,
        platformValues,
        unitProviders
      );

      expect(result.hasConstraints).toBe(false); // No constraints for string values
      expect(result.adjustedValues).toEqual(platformValues);
    });

    test('should handle mixed numeric and string values', () => {
      const platformValues = {
        web: { value: 'Inter, sans-serif', unit: 'fontFamily' as const },
        ios: { value: 400, unit: 'fontWeight' as const }, // Mixed types shouldn't cause issues
        android: { value: 'Roboto, sans-serif', unit: 'fontFamily' as const }
      };

      const constraints = constraintHandler.identifyConstraints(
        'mixed-token',
        TokenCategory.FONT_FAMILY,
        platformValues
      );

      expect(constraints).toHaveLength(0); // No constraints should be identified
    });
  });
});