"use strict";
/**
 * Performance Validation Integration Tests
 *
 * Tests performance requirements for token generation, validation,
 * and translation to ensure <5ms generation time and efficient operations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const TokenEngine_1 = require("../../TokenEngine");
const types_1 = require("../../types");
describe('Performance Validation Integration', () => {
    let engine;
    beforeEach(() => {
        engine = new TokenEngine_1.TokenEngine({
            autoValidate: true,
            enableCrossPlatformValidation: true,
            strategicFlexibilityThreshold: 0.8
        });
    });
    describe('Token Registration Performance', () => {
        it('should register single primitive token in <5ms', () => {
            const token = {
                name: 'space100',
                category: types_1.TokenCategory.SPACING,
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
        it('should register batch of 10 primitive tokens in <5ms', () => {
            const tokens = [];
            for (let i = 1; i <= 10; i++) {
                tokens.push({
                    name: `space${i}00`,
                    category: types_1.TokenCategory.SPACING,
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
        it('should register semantic token in <5ms', () => {
            // Register primitive first
            const primitiveToken = {
                name: 'space100',
                category: types_1.TokenCategory.SPACING,
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
            const semanticToken = {
                name: 'space.normal',
                primitiveReferences: { default: 'space100' },
                category: types_1.SemanticCategory.SPACING,
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
    describe('Token Query Performance', () => {
        beforeEach(() => {
            // Register 50 tokens for query performance testing
            const tokens = [];
            for (let i = 1; i <= 50; i++) {
                tokens.push({
                    name: `space${i}00`,
                    category: types_1.TokenCategory.SPACING,
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
        it('should retrieve single token in <1ms', () => {
            const startTime = performance.now();
            engine.getPrimitiveToken('space100');
            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(1);
        });
        it('should query all tokens in <5ms', () => {
            const startTime = performance.now();
            engine.getAllPrimitiveTokens();
            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(5);
        });
        it('should query tokens by category in <5ms', () => {
            const startTime = performance.now();
            engine.queryPrimitiveTokens({ category: types_1.TokenCategory.SPACING });
            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(5);
        });
    });
    describe('Validation Performance', () => {
        beforeEach(() => {
            // Register typical token set
            const tokens = [
                {
                    name: 'space100',
                    category: types_1.TokenCategory.SPACING,
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
                },
                {
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
                }
            ];
            engine.registerPrimitiveTokens(tokens);
        });
        it('should validate single token in <5ms', () => {
            const token = engine.getPrimitiveToken('space100');
            const startTime = performance.now();
            engine.validateToken(token);
            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(5);
        });
        it('should validate all tokens in <5ms', () => {
            const startTime = performance.now();
            engine.validateAllTokens();
            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(5);
        });
        it('should generate validation report in <10ms', () => {
            const startTime = performance.now();
            engine.generateValidationReport();
            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(10);
        });
        it('should validate cross-platform consistency in <5ms', () => {
            const startTime = performance.now();
            engine.validateCrossPlatformConsistency();
            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(5);
        });
    });
    describe('Statistics and Health Check Performance', () => {
        beforeEach(() => {
            // Register diverse token set
            const primitiveTokens = [];
            for (let i = 1; i <= 20; i++) {
                primitiveTokens.push({
                    name: `space${i}00`,
                    category: types_1.TokenCategory.SPACING,
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
            engine.registerPrimitiveTokens(primitiveTokens);
            // Register semantic tokens
            const semanticTokens = [];
            for (let i = 1; i <= 10; i++) {
                semanticTokens.push({
                    name: `space.semantic${i}`,
                    primitiveReferences: { default: `space${i}00` },
                    category: types_1.SemanticCategory.SPACING,
                    context: `Semantic ${i}`,
                    description: `Semantic spacing ${i}`,
                    primitiveTokens: {}
                });
            }
            engine.registerSemanticTokens(semanticTokens);
        });
        it('should get statistics in <5ms', () => {
            const startTime = performance.now();
            engine.getStats();
            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(5);
        });
        it('should get health status in <5ms', () => {
            const startTime = performance.now();
            engine.getHealthStatus();
            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(5);
        });
    });
    describe('State Management Performance', () => {
        beforeEach(() => {
            // Register typical token set
            const tokens = [];
            for (let i = 1; i <= 30; i++) {
                tokens.push({
                    name: `space${i}00`,
                    category: types_1.TokenCategory.SPACING,
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
        it('should export state in <5ms', () => {
            const startTime = performance.now();
            engine.exportState();
            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(5);
        });
        it('should import state in <10ms', () => {
            const state = engine.exportState();
            const newEngine = new TokenEngine_1.TokenEngine();
            const startTime = performance.now();
            newEngine.importState(state);
            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(10);
        });
        it('should reset state in <1ms', () => {
            const startTime = performance.now();
            engine.reset();
            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(1);
        });
    });
    describe('Platform Generation Performance', () => {
        beforeEach(() => {
            // Register typical token set for generation
            const tokens = [
                {
                    name: 'space100',
                    category: types_1.TokenCategory.SPACING,
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
                },
                {
                    name: 'fontSize100',
                    category: types_1.TokenCategory.FONT_SIZE,
                    baseValue: 16,
                    familyBaseValue: 16,
                    description: 'Base font size',
                    mathematicalRelationship: 'base',
                    baselineGridAlignment: false,
                    isStrategicFlexibility: false,
                    isPrecisionTargeted: false,
                    platforms: {
                        web: { value: 1, unit: 'rem' },
                        ios: { value: 16, unit: 'pt' },
                        android: { value: 16, unit: 'sp' }
                    }
                }
            ];
            engine.registerPrimitiveTokens(tokens);
        });
        it('should generate single platform tokens in <10ms', async () => {
            const startTime = performance.now();
            await engine.generatePlatformTokensFor('web');
            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(10); // Allow more time for async operations
        });
        it('should generate all platform tokens in <15ms', async () => {
            const startTime = performance.now();
            await engine.generatePlatformTokens();
            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(15); // 3 platforms × 5ms
        });
    });
    describe('Large-Scale Performance', () => {
        it('should handle 100 tokens efficiently', () => {
            const tokens = [];
            for (let i = 1; i <= 100; i++) {
                tokens.push({
                    name: `token${i}`,
                    category: types_1.TokenCategory.SPACING,
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
            expect(duration).toBeLessThan(50); // Allow more time for large batch
        });
        it('should validate 100 tokens efficiently', () => {
            const tokens = [];
            for (let i = 1; i <= 100; i++) {
                tokens.push({
                    name: `token${i}`,
                    category: types_1.TokenCategory.SPACING,
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
            engine.registerPrimitiveTokens(tokens);
            const startTime = performance.now();
            engine.validateAllTokens();
            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(50); // Allow more time for large validation
        });
        it('should query 100 tokens efficiently', () => {
            const tokens = [];
            for (let i = 1; i <= 100; i++) {
                tokens.push({
                    name: `token${i}`,
                    category: types_1.TokenCategory.SPACING,
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
            engine.registerPrimitiveTokens(tokens);
            const startTime = performance.now();
            engine.getAllPrimitiveTokens();
            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(10);
        });
    });
    describe('Configuration Update Performance', () => {
        it('should update configuration in <1ms', () => {
            const startTime = performance.now();
            engine.updateConfig({
                strategicFlexibilityThreshold: 0.9,
                autoValidate: false
            });
            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(1);
        });
        it('should get configuration in <1ms', () => {
            const startTime = performance.now();
            engine.getConfig();
            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(1);
        });
    });
    describe('Performance Regression Detection', () => {
        it('should maintain consistent performance across operations', () => {
            const token = {
                name: 'space100',
                category: types_1.TokenCategory.SPACING,
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
            const durations = [];
            // Perform operation 10 times
            for (let i = 0; i < 10; i++) {
                const testEngine = new TokenEngine_1.TokenEngine();
                const startTime = performance.now();
                testEngine.registerPrimitiveToken(token);
                const endTime = performance.now();
                durations.push(endTime - startTime);
            }
            // Calculate average and standard deviation
            const average = durations.reduce((a, b) => a + b, 0) / durations.length;
            const variance = durations.reduce((sum, duration) => sum + Math.pow(duration - average, 2), 0) / durations.length;
            const stdDev = Math.sqrt(variance);
            // Performance should be consistent (low standard deviation)
            expect(stdDev).toBeLessThan(2); // Allow 2ms variation
            expect(average).toBeLessThan(5); // Average should be under 5ms
        });
    });
});
//# sourceMappingURL=PerformanceValidation.test.js.map