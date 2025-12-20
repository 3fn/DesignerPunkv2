/**
 * @category evergreen
 * @purpose Verify system performance meets requirements and thresholds
 */
/**
 * Token Generation Performance Tests
 * 
 * Tests performance requirements for token generation to ensure <5ms
 * generation time for typical token sets and efficient batch operations.
 */

import { TokenEngine } from '../../TokenEngine';
import { TokenCategory, SemanticCategory } from '../../types';
import type { PrimitiveToken, SemanticToken } from '../../types';

describe('Token Generation Performance', () => {
    let engine: TokenEngine;

    beforeEach(() => {
        engine = new TokenEngine({
            autoValidate: true,
            enableCrossPlatformValidation: true,
            strategicFlexibilityThreshold: 0.8
        });
    });

    describe('Single Token Generation Performance', () => {
        it('should generate single primitive token in <5ms', () => {
            const token: PrimitiveToken = {
                name: 'space100',
                category: TokenCategory.SPACING,
                baseValue: 8,
                familyBaseValue: 8,
                description: 'Base spacing',
                mathematicalRelationship: 'base',
                baselineGridAlignment: true,
                isStrategicFlexibility: false,
                isPrecisionTargeted: false,
                platforms: {
                    web: { value: 8, unit: 'px' },
                    ios: { value: 8, unit: 'pt' },
                    android: { value: 8, unit: 'dp' }
                }
            };

            const startTime = performance.now();
            engine.registerPrimitiveToken(token);
            const endTime = performance.now();

            const duration = endTime - startTime;
            expect(duration).toBeLessThan(5);
        });

        it('should generate single semantic token in <5ms', () => {
            // Register primitive first
            const primitiveToken: PrimitiveToken = {
                name: 'space100',
                category: TokenCategory.SPACING,
                baseValue: 8,
                familyBaseValue: 8,
                description: 'Base spacing',
                mathematicalRelationship: 'base',
                baselineGridAlignment: true,
                isStrategicFlexibility: false,
                isPrecisionTargeted: false,
                platforms: {
                    web: { value: 8, unit: 'px' },
                    ios: { value: 8, unit: 'pt' },
                    android: { value: 8, unit: 'dp' }
                }
            };

            engine.registerPrimitiveToken(primitiveToken);

            const semanticToken: SemanticToken = {
                name: 'space.normal',
                primitiveReferences: { default: 'space100' },
                category: SemanticCategory.SPACING,
                context: 'Normal spacing',
                description: 'Standard spacing',
                primitiveTokens: {}
            };

            const startTime = performance.now();
            engine.registerSemanticToken(semanticToken);
            const endTime = performance.now();

            const duration = endTime - startTime;
            expect(duration).toBeLessThan(5);
        });
    });

    describe('Batch Token Generation Performance', () => {
        it('should generate 10 primitive tokens in <5ms', () => {
            const tokens: PrimitiveToken[] = [];

            for (let i = 1; i <= 10; i++) {
                tokens.push({
                    name: `space${i}00`,
                    category: TokenCategory.SPACING,
                    baseValue: 8 * i,
                    familyBaseValue: 8,
                    description: `Spacing ${i}x`,
                    mathematicalRelationship: `base × ${i}`,
                    baselineGridAlignment: true,
                    isStrategicFlexibility: false,
                    isPrecisionTargeted: false,
                    platforms: {
                        web: { value: 8 * i, unit: 'px' },
                        ios: { value: 8 * i, unit: 'pt' },
                        android: { value: 8 * i, unit: 'dp' }
                    }
                });
            }

            const startTime = performance.now();
            engine.registerPrimitiveTokens(tokens);
            const endTime = performance.now();

            const duration = endTime - startTime;
            expect(duration).toBeLessThan(5);
        });

        it('should generate 50 primitive tokens in <25ms', () => {
            const tokens: PrimitiveToken[] = [];

            for (let i = 1; i <= 50; i++) {
                tokens.push({
                    name: `token${i}`,
                    category: TokenCategory.SPACING,
                    baseValue: 8 * (i % 10 + 1),
                    familyBaseValue: 8,
                    description: `Token ${i}`,
                    mathematicalRelationship: `base × ${i % 10 + 1}`,
                    baselineGridAlignment: true,
                    isStrategicFlexibility: false,
                    isPrecisionTargeted: false,
                    platforms: {
                        web: { value: 8 * (i % 10 + 1), unit: 'px' },
                        ios: { value: 8 * (i % 10 + 1), unit: 'pt' },
                        android: { value: 8 * (i % 10 + 1), unit: 'dp' }
                    }
                });
            }

            const startTime = performance.now();
            engine.registerPrimitiveTokens(tokens);
            const endTime = performance.now();

            const duration = endTime - startTime;
            expect(duration).toBeLessThan(25);
        });

        it('should generate typical token set (30 tokens) in <15ms', () => {
            const tokens: PrimitiveToken[] = [];

            // Spacing tokens (10)
            for (let i = 1; i <= 10; i++) {
                tokens.push({
                    name: `space${i}00`,
                    category: TokenCategory.SPACING,
                    baseValue: 8 * i,
                    familyBaseValue: 8,
                    description: `Spacing ${i}x`,
                    mathematicalRelationship: `base × ${i}`,
                    baselineGridAlignment: true,
                    isStrategicFlexibility: false,
                    isPrecisionTargeted: false,
                    platforms: {
                        web: { value: 8 * i, unit: 'px' },
                        ios: { value: 8 * i, unit: 'pt' },
                        android: { value: 8 * i, unit: 'dp' }
                    }
                });
            }

            // Font size tokens (10)
            for (let i = 1; i <= 10; i++) {
                tokens.push({
                    name: `fontSize${i}00`,
                    category: TokenCategory.FONT_SIZE,
                    baseValue: 16 * Math.pow(1.125, i - 1),
                    familyBaseValue: 16,
                    description: `Font size ${i}`,
                    mathematicalRelationship: `base × 1.125^${i - 1}`,
                    baselineGridAlignment: false,
                    isStrategicFlexibility: false,
                    isPrecisionTargeted: false,
                    platforms: {
                        web: { value: Math.pow(1.125, i - 1), unit: 'rem' },
                        ios: { value: 16 * Math.pow(1.125, i - 1), unit: 'pt' },
                        android: { value: 16 * Math.pow(1.125, i - 1), unit: 'sp' }
                    }
                });
            }

            // Radius tokens (10)
            for (let i = 1; i <= 10; i++) {
                tokens.push({
                    name: `radius${i}00`,
                    category: TokenCategory.RADIUS,
                    baseValue: 8 * i,
                    familyBaseValue: 8,
                    description: `Radius ${i}x`,
                    mathematicalRelationship: `base × ${i}`,
                    baselineGridAlignment: true,
                    isStrategicFlexibility: false,
                    isPrecisionTargeted: false,
                    platforms: {
                        web: { value: 8 * i, unit: 'px' },
                        ios: { value: 8 * i, unit: 'pt' },
                        android: { value: 8 * i, unit: 'dp' }
                    }
                });
            }

            const startTime = performance.now();
            engine.registerPrimitiveTokens(tokens);
            const endTime = performance.now();

            const duration = endTime - startTime;
            expect(duration).toBeLessThan(15);
        });
    });

    describe('Platform File Generation Performance', () => {
        beforeEach(() => {
            // Register typical token set
            const tokens: PrimitiveToken[] = [];

            for (let i = 1; i <= 20; i++) {
                tokens.push({
                    name: `space${i}00`,
                    category: TokenCategory.SPACING,
                    baseValue: 8 * i,
                    familyBaseValue: 8,
                    description: `Spacing ${i}x`,
                    mathematicalRelationship: `base × ${i}`,
                    baselineGridAlignment: true,
                    isStrategicFlexibility: false,
                    isPrecisionTargeted: false,
                    platforms: {
                        web: { value: 8 * i, unit: 'px' },
                        ios: { value: 8 * i, unit: 'pt' },
                        android: { value: 8 * i, unit: 'dp' }
                    }
                });
            }

            engine.registerPrimitiveTokens(tokens);
        });

        it('should generate web platform file in <10ms', async () => {
            const startTime = performance.now();
            await engine.generatePlatformTokensFor('web');
            const endTime = performance.now();

            const duration = endTime - startTime;
            expect(duration).toBeLessThan(10);
        });

        it('should generate iOS platform file in <10ms', async () => {
            const startTime = performance.now();
            await engine.generatePlatformTokensFor('ios');
            const endTime = performance.now();

            const duration = endTime - startTime;
            expect(duration).toBeLessThan(10);
        });

        it('should generate Android platform file in <10ms', async () => {
            const startTime = performance.now();
            await engine.generatePlatformTokensFor('android');
            const endTime = performance.now();

            const duration = endTime - startTime;
            expect(duration).toBeLessThan(10);
        });

        it('should generate all platform files in <30ms', async () => {
            const startTime = performance.now();
            await engine.generatePlatformTokens();
            const endTime = performance.now();

            const duration = endTime - startTime;
            expect(duration).toBeLessThan(30);
        });
    });

    describe('Performance Consistency', () => {
        it('should maintain consistent generation performance across multiple runs', () => {
            const token: PrimitiveToken = {
                name: 'space100',
                category: TokenCategory.SPACING,
                baseValue: 8,
                familyBaseValue: 8,
                description: 'Base spacing',
                mathematicalRelationship: 'base',
                baselineGridAlignment: true,
                isStrategicFlexibility: false,
                isPrecisionTargeted: false,
                platforms: {
                    web: { value: 8, unit: 'px' },
                    ios: { value: 8, unit: 'pt' },
                    android: { value: 8, unit: 'dp' }
                }
            };

            const durations: number[] = [];

            // Perform 20 runs
            for (let i = 0; i < 20; i++) {
                const testEngine = new TokenEngine();
                const startTime = performance.now();
                testEngine.registerPrimitiveToken(token);
                const endTime = performance.now();
                durations.push(endTime - startTime);
            }

            // Calculate statistics
            const average = durations.reduce((a, b) => a + b, 0) / durations.length;
            const variance = durations.reduce((sum, duration) =>
                sum + Math.pow(duration - average, 2), 0) / durations.length;
            const stdDev = Math.sqrt(variance);

            // Performance should be consistent
            expect(stdDev).toBeLessThan(2); // Low variation
            expect(average).toBeLessThan(5); // Average under 5ms
        });

        it('should not degrade with repeated operations', () => {
            const durations: number[] = [];

            // Perform 10 batch operations
            for (let run = 0; run < 10; run++) {
                const tokens: PrimitiveToken[] = [];

                for (let i = 1; i <= 10; i++) {
                    tokens.push({
                        name: `space${run}_${i}00`,
                        category: TokenCategory.SPACING,
                        baseValue: 8 * i,
                        familyBaseValue: 8,
                        description: `Spacing ${i}x`,
                        mathematicalRelationship: `base × ${i}`,
                        baselineGridAlignment: true,
                        isStrategicFlexibility: false,
                        isPrecisionTargeted: false,
                        platforms: {
                            web: { value: 8 * i, unit: 'px' },
                            ios: { value: 8 * i, unit: 'pt' },
                            android: { value: 8 * i, unit: 'dp' }
                        }
                    });
                }

                const startTime = performance.now();
                engine.registerPrimitiveTokens(tokens);
                const endTime = performance.now();
                durations.push(endTime - startTime);
            }

            // First and last runs should have similar performance
            const firstRun = durations[0];
            const lastRun = durations[durations.length - 1];
            const difference = Math.abs(lastRun - firstRun);

            expect(difference).toBeLessThan(5); // No significant degradation
        });
    });

    describe('Memory Efficiency', () => {
        it('should handle large token sets without memory issues', () => {
            const tokens: PrimitiveToken[] = [];

            // Generate 200 tokens
            for (let i = 1; i <= 200; i++) {
                tokens.push({
                    name: `token${i}`,
                    category: TokenCategory.SPACING,
                    baseValue: 8 * (i % 20 + 1),
                    familyBaseValue: 8,
                    description: `Token ${i}`,
                    mathematicalRelationship: `base × ${i % 20 + 1}`,
                    baselineGridAlignment: true,
                    isStrategicFlexibility: false,
                    isPrecisionTargeted: false,
                    platforms: {
                        web: { value: 8 * (i % 20 + 1), unit: 'px' },
                        ios: { value: 8 * (i % 20 + 1), unit: 'pt' },
                        android: { value: 8 * (i % 20 + 1), unit: 'dp' }
                    }
                });
            }

            const startTime = performance.now();
            engine.registerPrimitiveTokens(tokens);
            const endTime = performance.now();

            const duration = endTime - startTime;

            // Should complete in reasonable time even with large set
            expect(duration).toBeLessThan(100);

            // Verify all tokens registered
            expect(engine.getAllPrimitiveTokens()).toHaveLength(200);
        });
    });
});
