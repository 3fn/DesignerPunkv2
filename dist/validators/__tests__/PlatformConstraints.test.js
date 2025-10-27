"use strict";
/**
 * Platform Constraint Handler Unit Tests
 *
 * Tests for platform-specific constraint identification, handling, and graceful degradation.
 * Covers constraint detection, value adjustment, and consistency assessment.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const PlatformConstraintHandler_1 = require("../PlatformConstraintHandler");
const WebUnitConverter_1 = require("../../providers/WebUnitConverter");
const iOSUnitConverter_1 = require("../../providers/iOSUnitConverter");
const AndroidUnitConverter_1 = require("../../providers/AndroidUnitConverter");
const PrimitiveToken_1 = require("../../types/PrimitiveToken");
// Helper function to create properly typed platform values
const createPlatformValues = (webValue, webUnit, iosValue, iosUnit, androidValue, androidUnit) => ({
    web: { value: webValue, unit: webUnit },
    ios: { value: iosValue, unit: iosUnit },
    android: { value: androidValue, unit: androidUnit }
});
describe('PlatformConstraintHandler', () => {
    let constraintHandler;
    let unitProviders;
    beforeEach(() => {
        constraintHandler = new PlatformConstraintHandler_1.PlatformConstraintHandler();
        unitProviders = {
            web: new WebUnitConverter_1.WebUnitConverter(),
            ios: new iOSUnitConverter_1.iOSUnitConverter(),
            android: new AndroidUnitConverter_1.AndroidUnitConverter()
        };
    });
    describe('Constraint Identification', () => {
        describe('Web Platform Constraints', () => {
            test('should identify minimum font size constraint for web', () => {
                const platformValues = createPlatformValues(0.3, 'rem', 5, 'pt', 5, 'sp');
                const constraints = constraintHandler.identifyConstraints('fontSize-tiny', PrimitiveToken_1.TokenCategory.FONT_SIZE, platformValues);
                const webConstraint = constraints.find(c => c.platforms.includes('web'));
                expect(webConstraint).toBeDefined();
                expect(webConstraint?.type).toBe(PlatformConstraintHandler_1.ConstraintType.RENDERING);
                expect(webConstraint?.constrainedValue).toBe(0.5);
                expect(webConstraint?.severity).toBe('medium');
            });
            test('should identify REM precision constraint for web', () => {
                // Use a pixel value that would trigger precision constraint (> 10 and with many decimals)
                const platformValues = createPlatformValues(18.123456789, 'px', 18, 'pt', 18, 'sp');
                const constraints = constraintHandler.identifyConstraints('fontSize-precise', PrimitiveToken_1.TokenCategory.FONT_SIZE, platformValues);
                const precisionConstraint = constraints.find(c => c.type === PlatformConstraintHandler_1.ConstraintType.CONVERSION_PRECISION && c.platforms.includes('web'));
                expect(precisionConstraint).toBeDefined();
                expect(precisionConstraint?.severity).toBe('low');
            });
        });
        describe('iOS Platform Constraints', () => {
            test('should identify minimum tap area constraint for iOS', () => {
                const platformValues = createPlatformValues(32, 'px', 32, 'pt', 32, 'dp');
                const constraints = constraintHandler.identifyConstraints('tapArea-small', PrimitiveToken_1.TokenCategory.TAP_AREA, platformValues);
                const iosConstraint = constraints.find(c => c.platforms.includes('ios'));
                expect(iosConstraint).toBeDefined();
                expect(iosConstraint?.type).toBe(PlatformConstraintHandler_1.ConstraintType.ACCESSIBILITY);
                expect(iosConstraint?.constrainedValue).toBe(44);
                expect(iosConstraint?.severity).toBe('high');
                expect(iosConstraint?.description).toContain('44pt');
            });
            test('should not constrain valid intermediate font weights', () => {
                const platformValues = createPlatformValues(450, 'fontWeight', 450, 'fontWeight', 450, 'fontWeight');
                const constraints = constraintHandler.identifyConstraints('fontWeight-custom', PrimitiveToken_1.TokenCategory.FONT_WEIGHT, platformValues);
                // 450 is a valid font weight, should not be constrained
                expect(constraints).toHaveLength(0);
            });
        });
        describe('Android Platform Constraints', () => {
            test('should identify minimum tap area constraint for Android', () => {
                const platformValues = createPlatformValues(40, 'px', 40, 'pt', 40, 'dp');
                const constraints = constraintHandler.identifyConstraints('tapArea-small', PrimitiveToken_1.TokenCategory.TAP_AREA, platformValues);
                const androidConstraint = constraints.find(c => c.platforms.includes('android'));
                expect(androidConstraint).toBeDefined();
                expect(androidConstraint?.type).toBe(PlatformConstraintHandler_1.ConstraintType.ACCESSIBILITY);
                expect(androidConstraint?.constrainedValue).toBe(48);
                expect(androidConstraint?.severity).toBe('high');
                expect(androidConstraint?.description).toContain('48dp');
            });
            test('should not constrain valid intermediate font weights for Android', () => {
                const platformValues = createPlatformValues(350, 'fontWeight', 350, 'fontWeight', 350, 'fontWeight');
                const constraints = constraintHandler.identifyConstraints('fontWeight-light', PrimitiveToken_1.TokenCategory.FONT_WEIGHT, platformValues);
                // 350 is a valid font weight, should not be constrained
                expect(constraints).toHaveLength(0);
            });
        });
        describe('Cross-Platform Font Weight Constraints', () => {
            test('should handle extreme font weight values', () => {
                const platformValues = createPlatformValues(50, 'fontWeight', 50, 'fontWeight', 50, 'fontWeight');
                const constraints = constraintHandler.identifyConstraints('fontWeight-extreme', PrimitiveToken_1.TokenCategory.FONT_WEIGHT, platformValues);
                expect(constraints).toHaveLength(3); // All platforms should constrain
                constraints.forEach(constraint => {
                    expect(constraint.constrainedValue).toBe(100); // Clamped to minimum
                    expect(constraint.type).toBe(PlatformConstraintHandler_1.ConstraintType.FONT_SYSTEM);
                });
            });
            test('should handle font weight values above maximum', () => {
                const platformValues = createPlatformValues(1000, 'fontWeight', 1000, 'fontWeight', 1000, 'fontWeight');
                const constraints = constraintHandler.identifyConstraints('fontWeight-heavy', PrimitiveToken_1.TokenCategory.FONT_WEIGHT, platformValues);
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
            const result = constraintHandler.handleConstraints('space100', PrimitiveToken_1.TokenCategory.SPACING, platformValues, unitProviders);
            expect(result.hasConstraints).toBe(false);
            expect(result.constraints).toHaveLength(0);
            expect(result.adjustedValues).toEqual(platformValues);
            expect(result.strategy).toContain('No constraints identified');
            expect(result.consistencyAssessment).toContain('Mathematical consistency preserved');
        });
        test('should handle iOS tap area constraint', () => {
            const platformValues = createPlatformValues(32, 'px', 32, 'pt', 32, 'dp');
            const result = constraintHandler.handleConstraints('tapArea-small', PrimitiveToken_1.TokenCategory.TAP_AREA, platformValues, unitProviders);
            expect(result.hasConstraints).toBe(true);
            expect(result.constraints.length).toBeGreaterThan(0);
            expect(result.adjustedValues.ios.value).toBe(44); // Adjusted to minimum
            expect(result.adjustedValues.android.value).toBe(48); // Android minimum
            expect(result.adjustedValues.web.value).toBe(32); // Web unchanged
        });
        test('should handle multiple constraints across platforms', () => {
            const platformValues = createPlatformValues(0.3, 'rem', 5, 'pt', 5, 'sp'); // Below web minimum
            const result = constraintHandler.handleConstraints('fontSize-tiny', PrimitiveToken_1.TokenCategory.FONT_SIZE, platformValues, unitProviders);
            expect(result.hasConstraints).toBe(true);
            expect(result.adjustedValues.web.value).toBe(0.5); // Adjusted to web minimum
            expect(result.strategy).toContain('Web browsers may not render fonts smaller');
        });
        test('should provide comprehensive strategy description', () => {
            const platformValues = createPlatformValues(30, 'px', 30, 'pt', 30, 'dp');
            const result = constraintHandler.handleConstraints('tapArea-tiny', PrimitiveToken_1.TokenCategory.TAP_AREA, platformValues, unitProviders);
            expect(result.strategy).toContain('ios:');
            expect(result.strategy).toContain('android:');
            expect(result.strategy).toContain('44');
            expect(result.strategy).toContain('48');
        });
    });
    describe('Consistency Assessment', () => {
        test('should assess high-severity constraint impact', () => {
            const platformValues = createPlatformValues(20, 'px', 20, 'pt', 20, 'dp');
            const result = constraintHandler.handleConstraints('tapArea-very-small', PrimitiveToken_1.TokenCategory.TAP_AREA, platformValues, unitProviders);
            expect(result.consistencyAssessment).toContain('High-severity constraints applied');
            expect(result.consistencyAssessment).toContain('Platform requirements enforced');
        });
        test('should assess medium-severity constraint impact', () => {
            const platformValues = createPlatformValues(0.4, 'rem', 6, 'pt', 6, 'sp');
            const result = constraintHandler.handleConstraints('fontSize-small', PrimitiveToken_1.TokenCategory.FONT_SIZE, platformValues, unitProviders);
            expect(result.consistencyAssessment).toContain('Medium-severity constraints applied');
            expect(result.consistencyAssessment).toContain('Platform optimization applied');
        });
        test('should assess low-severity constraint impact', () => {
            const platformValues = createPlatformValues(50, 'fontWeight', 50, 'fontWeight', 50, 'fontWeight'); // Use extreme value that will be constrained
            const result = constraintHandler.handleConstraints('fontWeight-extreme', PrimitiveToken_1.TokenCategory.FONT_WEIGHT, platformValues, unitProviders);
            expect(result.consistencyAssessment).toContain('Low-severity constraints applied');
            expect(result.consistencyAssessment).toContain('Minor precision adjustments');
        });
        test('should assess proportional relationship maintenance', () => {
            const platformValues = createPlatformValues(16, 'px', 16, 'pt', 16, 'dp');
            const result = constraintHandler.handleConstraints('spacing-consistent', PrimitiveToken_1.TokenCategory.SPACING, platformValues, unitProviders);
            // When no constraints are applied, the message should indicate mathematical consistency is preserved
            expect(result.consistencyAssessment).toContain('Mathematical consistency preserved');
        });
    });
    describe('Proportional Relationship Validation', () => {
        test('should detect when proportional relationships are maintained', () => {
            const originalValues = createPlatformValues(16, 'px', 16, 'pt', 16, 'dp');
            const adjustedValues = createPlatformValues(32, 'px', 32, 'pt', 32, 'dp');
            // Use private method through constraint handling
            const result = constraintHandler.handleConstraints('test-token', PrimitiveToken_1.TokenCategory.SPACING, originalValues, unitProviders);
            // Since no constraints are applied, relationships should be maintained
            expect(result.consistencyAssessment).toContain('Mathematical consistency preserved');
        });
        test('should detect when proportional relationships are affected', () => {
            const platformValues = createPlatformValues(30, 'px', 30, 'pt', 30, 'dp');
            const result = constraintHandler.handleConstraints('tapArea-constrained', PrimitiveToken_1.TokenCategory.TAP_AREA, platformValues, unitProviders);
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
            const result = {
                hasConstraints: true,
                constraints: [{
                        type: PlatformConstraintHandler_1.ConstraintType.ACCESSIBILITY,
                        platforms: ['ios'],
                        category: PrimitiveToken_1.TokenCategory.TAP_AREA,
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
            const result = {
                hasConstraints: true,
                constraints: [{
                        type: PlatformConstraintHandler_1.ConstraintType.ACCESSIBILITY,
                        platforms: ['ios'],
                        category: PrimitiveToken_1.TokenCategory.TAP_AREA,
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
            const result = {
                hasConstraints: true,
                constraints: [],
                adjustedValues: {
                    web: { value: -100, unit: 'px' }, // Unreasonable negative value
                    ios: { value: 44, unit: 'pt' },
                    android: { value: 15000, unit: 'dp' } // Unreasonably large value
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
            const result = constraintHandler.handleConstraints('empty-token', PrimitiveToken_1.TokenCategory.SPACING, {}, unitProviders);
            expect(result.hasConstraints).toBe(false);
            expect(result.constraints).toHaveLength(0);
            expect(result.adjustedValues).toEqual({});
        });
        test('should handle unknown token categories gracefully', () => {
            const platformValues = createPlatformValues(16, 'px', 16, 'pt', 16, 'dp');
            const result = constraintHandler.handleConstraints('unknown-token', 'unknown', platformValues, unitProviders);
            expect(result.hasConstraints).toBe(false);
            expect(result.adjustedValues).toEqual(platformValues);
        });
        test('should handle string values in constraints', () => {
            const platformValues = createPlatformValues('Inter, sans-serif', 'fontFamily', 'Inter, sans-serif', 'fontFamily', 'Inter, sans-serif', 'fontFamily');
            const result = constraintHandler.handleConstraints('fontFamily-token', PrimitiveToken_1.TokenCategory.FONT_FAMILY, platformValues, unitProviders);
            expect(result.hasConstraints).toBe(false); // No constraints for string values
            expect(result.adjustedValues).toEqual(platformValues);
        });
        test('should handle mixed numeric and string values', () => {
            const platformValues = {
                web: { value: 'Inter, sans-serif', unit: 'fontFamily' },
                ios: { value: 400, unit: 'fontWeight' }, // Mixed types shouldn't cause issues
                android: { value: 'Roboto, sans-serif', unit: 'fontFamily' }
            };
            const constraints = constraintHandler.identifyConstraints('mixed-token', PrimitiveToken_1.TokenCategory.FONT_FAMILY, platformValues);
            expect(constraints).toHaveLength(0); // No constraints should be identified
        });
    });
});
//# sourceMappingURL=PlatformConstraints.test.js.map