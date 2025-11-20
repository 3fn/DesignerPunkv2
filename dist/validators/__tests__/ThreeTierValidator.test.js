"use strict";
/**
 * Unit tests for ThreeTierValidator
 *
 * Tests comprehensive three-tier validation system including:
 * - Pass/Warning/Error classification accuracy
 * - Validation level orchestration
 * - Comprehensive reasoning generation
 * - Batch validation functionality
 * - Validation report generation
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ThreeTierValidator_1 = require("../ThreeTierValidator");
const types_1 = require("../../types");
describe('ThreeTierValidator', () => {
    let validator;
    beforeEach(() => {
        validator = new ThreeTierValidator_1.ThreeTierValidator();
    });
    describe('Pass-level validation', () => {
        it('should validate primitive token with correct mathematical foundation', () => {
            const token = {
                name: 'space100',
                category: types_1.TokenCategory.SPACING,
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
            const context = {
                token,
                options: {
                    enabledLevels: ['Pass', 'Warning', 'Error']
                }
            };
            const result = validator.validate(context);
            expect(result.primaryResult.level).toBe('Pass');
            expect(result.primaryResult.token).toBe('space100');
            expect(result.summary.level).toBe('Pass');
            expect(result.resultsByLevel.pass).toBeDefined();
            expect(result.resultsByLevel.warning).toBeUndefined();
            expect(result.resultsByLevel.error).toBeUndefined();
        });
        it('should validate semantic token with valid primitive reference', () => {
            const primitiveToken = {
                name: 'space050',
                category: types_1.TokenCategory.SPACING,
                baseValue: 4,
                familyBaseValue: 8,
                description: 'Half base spacing',
                mathematicalRelationship: 'base × 0.5',
                baselineGridAlignment: true,
                isStrategicFlexibility: false,
                isPrecisionTargeted: false,
                platforms: {
                    web: { value: 4, unit: 'px' },
                    ios: { value: 4, unit: 'pt' },
                    android: { value: 4, unit: 'dp' }
                }
            };
            const token = {
                name: 'space.tight',
                primitiveReferences: { default: 'space050' },
                category: types_1.SemanticCategory.SPACING,
                context: 'Tight spacing for compact layouts',
                description: 'Semantic token for tight spacing',
                primitiveTokens: { default: primitiveToken }
            };
            const context = {
                token,
                systemContext: {
                    availablePrimitiveTokens: ['space050', 'space100', 'space150']
                }
            };
            const result = validator.validate(context);
            expect(result.primaryResult.level).toBe('Pass');
            expect(result.summary.level).toBe('Pass');
        });
        it('should validate strategic flexibility token as Pass', () => {
            const token = {
                name: 'space075',
                category: types_1.TokenCategory.SPACING,
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
            const context = {
                token
            };
            const result = validator.validate(context);
            expect(result.primaryResult.level).toBe('Pass');
            expect(result.primaryResult.message).toContain('Strategic flexibility');
        });
    });
    describe('Warning-level validation', () => {
        it('should warn about strategic flexibility overuse', () => {
            const token = {
                name: 'space075',
                category: types_1.TokenCategory.SPACING,
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
            const context = {
                token,
                systemContext: {
                    strategicFlexibilityStats: {
                        totalUsage: 100,
                        appropriateUsage: 60,
                        inappropriateUsage: 40,
                        usagePercentage: 0.6 // 60% appropriate, below 80% threshold
                    }
                }
            };
            const result = validator.validate(context);
            expect(result.primaryResult.level).toBe('Warning');
            expect(result.primaryResult.message).toContain('Strategic flexibility overuse');
            expect(result.summary.allSuggestions.length).toBeGreaterThan(0);
        });
        it('should warn about high primitive token usage', () => {
            const token = {
                name: 'space100',
                category: types_1.TokenCategory.SPACING,
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
            const context = {
                token,
                systemContext: {
                    availableSemanticTokens: ['space.tight', 'space.normal', 'space.loose'],
                    familyUsagePatterns: {
                        [types_1.TokenCategory.SPACING]: {
                            primitiveUsage: 80,
                            semanticUsage: 20,
                            totalUsage: 100
                        },
                        [types_1.TokenCategory.FONT_SIZE]: { primitiveUsage: 0, semanticUsage: 0, totalUsage: 0 },
                        [types_1.TokenCategory.FONT_FAMILY]: { primitiveUsage: 0, semanticUsage: 0, totalUsage: 0 },
                        [types_1.TokenCategory.FONT_WEIGHT]: { primitiveUsage: 0, semanticUsage: 0, totalUsage: 0 },
                        [types_1.TokenCategory.LINE_HEIGHT]: { primitiveUsage: 0, semanticUsage: 0, totalUsage: 0 },
                        [types_1.TokenCategory.LETTER_SPACING]: { primitiveUsage: 0, semanticUsage: 0, totalUsage: 0 },
                        [types_1.TokenCategory.RADIUS]: { primitiveUsage: 0, semanticUsage: 0, totalUsage: 0 },
                        [types_1.TokenCategory.DENSITY]: { primitiveUsage: 0, semanticUsage: 0, totalUsage: 0 },
                        [types_1.TokenCategory.TAP_AREA]: { primitiveUsage: 0, semanticUsage: 0, totalUsage: 0 },
                        [types_1.TokenCategory.COLOR]: { primitiveUsage: 0, semanticUsage: 0, totalUsage: 0 },
                        [types_1.TokenCategory.BORDER_WIDTH]: { primitiveUsage: 0, semanticUsage: 0, totalUsage: 0 },
                        [types_1.TokenCategory.SHADOW]: { primitiveUsage: 0, semanticUsage: 0, totalUsage: 0 },
                        [types_1.TokenCategory.GLOW]: { primitiveUsage: 0, semanticUsage: 0, totalUsage: 0 },
                        [types_1.TokenCategory.OPACITY]: { primitiveUsage: 0, semanticUsage: 0, totalUsage: 0 },
                        [types_1.TokenCategory.BLEND]: { primitiveUsage: 0, semanticUsage: 0, totalUsage: 0 },
                        [types_1.TokenCategory.BREAKPOINT]: { primitiveUsage: 0, semanticUsage: 0, totalUsage: 0 }
                    }
                }
            };
            const result = validator.validate(context);
            expect(result.primaryResult.level).toBe('Warning');
            expect(result.primaryResult.message).toContain('primitive token usage');
        });
        it('should warn about high-frequency token usage', () => {
            const token = {
                name: 'space100',
                category: types_1.TokenCategory.SPACING,
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
            const context = {
                token,
                usageContext: {
                    usageFrequency: 25,
                    totalUsageCount: 100
                },
                options: {
                    enablePatternAnalysis: true
                }
            };
            const result = validator.validate(context);
            expect(result.primaryResult.level).toBe('Warning');
            expect(result.primaryResult.message).toContain('High-frequency');
        });
    });
    describe('Error-level validation', () => {
        it('should error on missing mathematical relationship', () => {
            const token = {
                name: 'space100',
                category: types_1.TokenCategory.SPACING,
                baseValue: 8,
                familyBaseValue: 8,
                description: 'Base spacing',
                mathematicalRelationship: '', // Missing relationship
                baselineGridAlignment: true,
                isStrategicFlexibility: false,
                isPrecisionTargeted: false,
                platforms: {
                    web: { value: 8, unit: 'px' },
                    ios: { value: 8, unit: 'pt' },
                    android: { value: 8, unit: 'dp' }
                }
            };
            const context = {
                token
            };
            const result = validator.validate(context);
            expect(result.primaryResult.level).toBe('Error');
            expect(result.primaryResult.message).toContain('mathematical relationship');
        });
        it('should error on baseline grid violation', () => {
            const token = {
                name: 'spaceInvalid',
                category: types_1.TokenCategory.SPACING,
                baseValue: 9, // Not aligned to 8-unit grid (9 % 8 = 1)
                familyBaseValue: 8,
                description: 'Invalid spacing',
                mathematicalRelationship: 'base × 1.125', // Valid relationship
                baselineGridAlignment: false,
                isStrategicFlexibility: false, // Not strategic flexibility
                isPrecisionTargeted: false,
                platforms: {
                    web: { value: 9, unit: 'px' },
                    ios: { value: 9, unit: 'pt' },
                    android: { value: 9, unit: 'dp' }
                }
            };
            const context = {
                token,
                mathematicalContext: {
                    baselineGridRequirement: {
                        required: true,
                        gridUnit: 8,
                        expectedAlignment: true,
                        actualAlignment: false
                    }
                }
            };
            const result = validator.validate(context);
            // The ErrorValidator checks:
            // 1. If token category requires baseline grid alignment (spacing/radius)
            // 2. If token is strategic flexibility (flag OR value check)
            // 3. If baseValue % 8 === 0
            // Since 9 is NOT a strategic flexibility value and 9 % 8 !== 0, it should error
            expect(result.primaryResult.level).toBe('Error');
            expect(result.primaryResult.message).toContain('Baseline grid');
        });
        it('should error on invalid primitive reference', () => {
            const token = {
                name: 'space.tight',
                primitiveReferences: { default: 'nonexistent' },
                category: types_1.SemanticCategory.SPACING,
                context: 'Tight spacing',
                description: 'Invalid semantic token',
                primitiveTokens: { default: {} }
            };
            const context = {
                token,
                systemContext: {
                    availablePrimitiveTokens: ['space050', 'space100']
                },
                options: {
                    validateReferences: true
                }
            };
            const result = validator.validate(context);
            expect(result.primaryResult.level).toBe('Error');
            expect(result.primaryResult.message).toContain('primitive token reference');
        });
        it('should error on cross-platform consistency violation', () => {
            const token = {
                name: 'space100',
                category: types_1.TokenCategory.SPACING,
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
            const context = {
                token,
                mathematicalContext: {
                    crossPlatformData: {
                        platforms: ['web', 'ios', 'android'],
                        values: { web: 8, ios: 8, android: 10 },
                        toleranceLevel: 0.01,
                        maxDeviation: 0.25,
                        failedPairs: ['android-web', 'android-ios']
                    }
                },
                options: {
                    requireCrossPlatformConsistency: true
                }
            };
            const result = validator.validate(context);
            expect(result.primaryResult.level).toBe('Error');
            expect(result.primaryResult.message).toContain('Cross-platform');
        });
    });
    describe('Validation level orchestration', () => {
        it('should prioritize Error over Warning and Pass', () => {
            const token = {
                name: 'space125',
                category: types_1.TokenCategory.SPACING,
                baseValue: 10,
                familyBaseValue: 8,
                description: 'Invalid spacing',
                mathematicalRelationship: '', // Error: missing relationship
                baselineGridAlignment: false,
                isStrategicFlexibility: false,
                isPrecisionTargeted: false,
                platforms: {
                    web: { value: 10, unit: 'px' },
                    ios: { value: 10, unit: 'pt' },
                    android: { value: 10, unit: 'dp' }
                }
            };
            const context = {
                token,
                options: {
                    enabledLevels: ['Pass', 'Warning', 'Error']
                }
            };
            const result = validator.validate(context);
            expect(result.primaryResult.level).toBe('Error');
            expect(result.summary.level).toBe('Error');
        });
        it('should prioritize Warning over Pass when no errors', () => {
            const token = {
                name: 'space075',
                category: types_1.TokenCategory.SPACING,
                baseValue: 6,
                familyBaseValue: 8,
                description: 'Strategic flexibility',
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
            const context = {
                token,
                systemContext: {
                    strategicFlexibilityStats: {
                        totalUsage: 100,
                        appropriateUsage: 60,
                        inappropriateUsage: 40,
                        usagePercentage: 0.6
                    }
                }
            };
            const result = validator.validate(context);
            expect(result.primaryResult.level).toBe('Warning');
            expect(result.summary.level).toBe('Warning');
        });
        it('should only run enabled validation levels', () => {
            const token = {
                name: 'space100',
                category: types_1.TokenCategory.SPACING,
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
            const context = {
                token,
                options: {
                    enabledLevels: ['Error'] // Only run error validation
                }
            };
            const result = validator.validate(context);
            // Error level runs but finds no errors, so it's in levelsExecuted
            expect(result.metadata.levelsExecuted).toContain('error');
            expect(result.resultsByLevel.pass).toBeUndefined();
            expect(result.resultsByLevel.warning).toBeUndefined();
        });
    });
    describe('Comprehensive reasoning generation', () => {
        it('should generate comprehensive reasoning combining all levels', () => {
            const token = {
                name: 'space100',
                category: types_1.TokenCategory.SPACING,
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
            const context = {
                token,
                mathematicalContext: {
                    expectedRelationship: 'base value',
                    actualRelationship: 'base value',
                    baselineGridRequirement: {
                        required: true,
                        gridUnit: 8,
                        expectedAlignment: true,
                        actualAlignment: true
                    }
                }
            };
            const result = validator.validate(context);
            expect(result.summary.comprehensiveReasoning).toBeDefined();
            expect(result.summary.comprehensiveReasoning.length).toBeGreaterThan(0);
            expect(result.summary.comprehensiveReasoning).toContain('PASS');
        });
        it('should include mathematical context in reasoning', () => {
            const token = {
                name: 'space100',
                category: types_1.TokenCategory.SPACING,
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
            const context = {
                token,
                mathematicalContext: {
                    baselineGridRequirement: {
                        required: true,
                        gridUnit: 8,
                        expectedAlignment: true,
                        actualAlignment: true
                    }
                }
            };
            const result = validator.validate(context);
            expect(result.summary.comprehensiveReasoning).toContain('Baseline grid');
            expect(result.summary.comprehensiveReasoning).toContain('aligned');
        });
    });
    describe('Batch validation', () => {
        it('should validate multiple tokens', () => {
            const tokens = [
                {
                    name: 'space100',
                    category: types_1.TokenCategory.SPACING,
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
                },
                {
                    name: 'space200',
                    category: types_1.TokenCategory.SPACING,
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
                }
            ];
            const contexts = tokens.map(token => ({ token }));
            const results = validator.validateBatch(contexts);
            expect(results).toHaveLength(2);
            expect(results[0].primaryResult.level).toBe('Pass');
            expect(results[1].primaryResult.level).toBe('Pass');
        });
    });
    describe('Validation report generation', () => {
        it('should generate comprehensive validation report', () => {
            const tokens = [
                {
                    name: 'space100',
                    category: types_1.TokenCategory.SPACING,
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
                },
                {
                    name: 'space125',
                    category: types_1.TokenCategory.SPACING,
                    baseValue: 10,
                    familyBaseValue: 8,
                    description: 'Invalid spacing',
                    mathematicalRelationship: '', // Error
                    baselineGridAlignment: false,
                    isStrategicFlexibility: false,
                    isPrecisionTargeted: false,
                    platforms: {
                        web: { value: 10, unit: 'px' },
                        ios: { value: 10, unit: 'pt' },
                        android: { value: 10, unit: 'dp' }
                    }
                }
            ];
            const contexts = tokens.map(token => ({ token }));
            const report = validator.generateValidationReport(contexts);
            expect(report.summary.totalTokens).toBe(2);
            expect(report.summary.passCount).toBe(1);
            expect(report.summary.errorCount).toBe(1);
            expect(report.summary.overallHealthScore).toBeLessThan(1);
            expect(report.systemAnalysis.criticalErrors.length).toBeGreaterThan(0);
            expect(report.systemAnalysis.improvementRecommendations.length).toBeGreaterThan(0);
        });
        it('should calculate mathematical consistency score', () => {
            const tokens = [
                {
                    name: 'space100',
                    category: types_1.TokenCategory.SPACING,
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
                },
                {
                    name: 'space200',
                    category: types_1.TokenCategory.SPACING,
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
                }
            ];
            const contexts = tokens.map(token => ({ token }));
            const report = validator.generateValidationReport(contexts);
            expect(report.systemAnalysis.mathematicalConsistencyScore).toBe(1.0);
        });
        it('should provide performance metrics', () => {
            const token = {
                name: 'space100',
                category: types_1.TokenCategory.SPACING,
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
            const contexts = [{ token }];
            const report = validator.generateValidationReport(contexts);
            expect(report.performanceMetrics.totalValidationTime).toBeGreaterThanOrEqual(0);
            expect(report.performanceMetrics.averageValidationTime).toBeGreaterThanOrEqual(0);
        });
    });
    describe('Metadata tracking', () => {
        it('should track validation metadata', () => {
            const token = {
                name: 'space100',
                category: types_1.TokenCategory.SPACING,
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
            const context = {
                token,
                options: {
                    enabledLevels: ['Pass', 'Warning', 'Error'],
                    strictMathematics: true
                }
            };
            const result = validator.validate(context);
            expect(result.metadata.timestamp).toBeInstanceOf(Date);
            expect(result.metadata.levelsExecuted).toBeDefined();
            expect(result.metadata.optionsUsed).toEqual(context.options);
            expect(result.metadata.performanceMetrics).toBeDefined();
        });
    });
    describe('Accessibility token validation', () => {
        describe('focus.offset validation', () => {
            it('should error when offset is negative', () => {
                const tokens = {
                    focus: { offset: -1, width: 2, color: '#3B82F6' }
                };
                const results = validator.validateAccessibilityTokens(tokens);
                const offsetResult = results.find(r => r.token === 'accessibility.focus.offset');
                expect(offsetResult).toBeDefined();
                expect(offsetResult?.level).toBe('Error');
                expect(offsetResult?.message).toContain('non-negative');
                expect(offsetResult?.mathematicalReasoning).toContain('WCAG 2.4.7');
            });
            it('should warn when offset is 0', () => {
                const tokens = {
                    focus: { offset: 0, width: 2, color: '#3B82F6' }
                };
                const results = validator.validateAccessibilityTokens(tokens);
                const offsetResult = results.find(r => r.token === 'accessibility.focus.offset');
                expect(offsetResult).toBeDefined();
                expect(offsetResult?.level).toBe('Warning');
                expect(offsetResult?.message).toContain('may reduce visibility');
                expect(offsetResult?.suggestions).toBeDefined();
                expect(offsetResult?.suggestions?.length).toBeGreaterThan(0);
            });
            it('should pass when offset is positive', () => {
                const tokens = {
                    focus: { offset: 2, width: 2, color: '#3B82F6' }
                };
                const results = validator.validateAccessibilityTokens(tokens);
                const offsetResult = results.find(r => r.token === 'accessibility.focus.offset');
                expect(offsetResult).toBeDefined();
                expect(offsetResult?.level).toBe('Pass');
                expect(offsetResult?.message).toContain('clear separation');
            });
        });
        describe('focus.width validation', () => {
            it('should error when width is less than 1px', () => {
                const tokens = {
                    focus: { offset: 2, width: 0.5, color: '#3B82F6' }
                };
                const results = validator.validateAccessibilityTokens(tokens);
                const widthResult = results.find(r => r.token === 'accessibility.focus.width');
                expect(widthResult).toBeDefined();
                expect(widthResult?.level).toBe('Error');
                expect(widthResult?.message).toContain('at least 1px');
                expect(widthResult?.mathematicalReasoning).toContain('WCAG 2.4.7');
            });
            it('should warn when width is less than 2px', () => {
                const tokens = {
                    focus: { offset: 2, width: 1, color: '#3B82F6' }
                };
                const results = validator.validateAccessibilityTokens(tokens);
                const widthResult = results.find(r => r.token === 'accessibility.focus.width');
                expect(widthResult).toBeDefined();
                expect(widthResult?.level).toBe('Warning');
                expect(widthResult?.message).toContain('may reduce visibility');
                expect(widthResult?.suggestions).toBeDefined();
                expect(widthResult?.suggestions?.length).toBeGreaterThan(0);
            });
            it('should pass when width is 2px or greater', () => {
                const tokens = {
                    focus: { offset: 2, width: 2, color: '#3B82F6' }
                };
                const results = validator.validateAccessibilityTokens(tokens);
                const widthResult = results.find(r => r.token === 'accessibility.focus.width');
                expect(widthResult).toBeDefined();
                expect(widthResult?.level).toBe('Pass');
                expect(widthResult?.message).toContain('clear visibility');
            });
        });
        describe('combined validation', () => {
            it('should return results for both offset and width', () => {
                const tokens = {
                    focus: { offset: 2, width: 2, color: '#3B82F6' }
                };
                const results = validator.validateAccessibilityTokens(tokens);
                expect(results).toHaveLength(2);
                expect(results.some(r => r.token === 'accessibility.focus.offset')).toBe(true);
                expect(results.some(r => r.token === 'accessibility.focus.width')).toBe(true);
            });
            it('should handle multiple validation issues', () => {
                const tokens = {
                    focus: { offset: -1, width: 0.5, color: '#3B82F6' }
                };
                const results = validator.validateAccessibilityTokens(tokens);
                expect(results).toHaveLength(2);
                expect(results.every(r => r.level === 'Error')).toBe(true);
            });
            it('should handle mixed validation levels', () => {
                const tokens = {
                    focus: { offset: 0, width: 1, color: '#3B82F6' }
                };
                const results = validator.validateAccessibilityTokens(tokens);
                expect(results).toHaveLength(2);
                expect(results.every(r => r.level === 'Warning')).toBe(true);
            });
        });
    });
});
//# sourceMappingURL=ThreeTierValidator.test.js.map