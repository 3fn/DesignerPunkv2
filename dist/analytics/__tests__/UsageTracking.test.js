"use strict";
/**
 * Unit tests for Usage Tracking System
 *
 * Tests usage pattern tracking and analysis including:
 * - Strategic flexibility usage tracking
 * - Usage pattern analysis
 * - Threshold validation
 * - Feedback generation
 */
Object.defineProperty(exports, "__esModule", { value: true });
const TokenUsageTracker_1 = require("../TokenUsageTracker");
const StrategicFlexibilityTracker_1 = require("../StrategicFlexibilityTracker");
const SemanticTokenUsageTracker_1 = require("../SemanticTokenUsageTracker");
const PrimitiveTokenFallbackTracker_1 = require("../PrimitiveTokenFallbackTracker");
const UsagePatternAnalyzer_1 = require("../UsagePatternAnalyzer");
const types_1 = require("../../types");
describe('Usage Tracking System', () => {
    describe('StrategicFlexibilityTracker', () => {
        let tracker;
        beforeEach(() => {
            tracker = new StrategicFlexibilityTracker_1.StrategicFlexibilityTracker();
        });
        it('should record strategic flexibility token usage', () => {
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
            tracker.recordUsage({
                token,
                context: StrategicFlexibilityTracker_1.UsageContext.COMPONENT_INTERNAL,
                appropriateness: StrategicFlexibilityTracker_1.UsageAppropriateness.APPROPRIATE,
                location: 'Button.tsx',
                timestamp: new Date()
            });
            const stats = tracker.getStatistics(100);
            expect(stats.totalUsages).toBe(1);
            expect(stats.appropriateUsages).toBe(1);
        });
        it('should reject non-strategic-flexibility tokens', () => {
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
            expect(() => {
                tracker.recordUsage({
                    token,
                    context: StrategicFlexibilityTracker_1.UsageContext.COMPONENT_INTERNAL,
                    appropriateness: StrategicFlexibilityTracker_1.UsageAppropriateness.APPROPRIATE,
                    location: 'Button.tsx',
                    timestamp: new Date()
                });
            }).toThrow('not a strategic flexibility token');
        });
        it('should calculate usage rate correctly', () => {
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
            // Record 15 strategic flexibility usages
            for (let i = 0; i < 15; i++) {
                tracker.recordUsage({
                    token,
                    context: StrategicFlexibilityTracker_1.UsageContext.COMPONENT_INTERNAL,
                    appropriateness: StrategicFlexibilityTracker_1.UsageAppropriateness.APPROPRIATE,
                    location: `Component${i}.tsx`,
                    timestamp: new Date()
                });
            }
            // Total token usages: 100
            const stats = tracker.getStatistics(100);
            expect(stats.usageRate).toBe(0.15); // 15/100 = 15%
            expect(stats.meetsThreshold).toBe(true); // 15% ≤ 20%
        });
        it('should detect threshold violations', () => {
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
            // Record 25 strategic flexibility usages
            for (let i = 0; i < 25; i++) {
                tracker.recordUsage({
                    token,
                    context: StrategicFlexibilityTracker_1.UsageContext.COMPONENT_INTERNAL,
                    appropriateness: StrategicFlexibilityTracker_1.UsageAppropriateness.APPROPRIATE,
                    location: `Component${i}.tsx`,
                    timestamp: new Date()
                });
            }
            // Total token usages: 100
            const stats = tracker.getStatistics(100);
            expect(stats.usageRate).toBe(0.25); // 25/100 = 25%
            expect(stats.meetsThreshold).toBe(false); // 25% > 20%
        });
        it('should track appropriateness levels', () => {
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
            tracker.recordUsage({
                token,
                context: StrategicFlexibilityTracker_1.UsageContext.COMPONENT_INTERNAL,
                appropriateness: StrategicFlexibilityTracker_1.UsageAppropriateness.APPROPRIATE,
                location: 'Button.tsx',
                timestamp: new Date()
            });
            tracker.recordUsage({
                token,
                context: StrategicFlexibilityTracker_1.UsageContext.LAYOUT_SPACING,
                appropriateness: StrategicFlexibilityTracker_1.UsageAppropriateness.QUESTIONABLE,
                location: 'Layout.tsx',
                timestamp: new Date()
            });
            tracker.recordUsage({
                token,
                context: StrategicFlexibilityTracker_1.UsageContext.LAYOUT_SPACING,
                appropriateness: StrategicFlexibilityTracker_1.UsageAppropriateness.INAPPROPRIATE,
                location: 'Grid.tsx',
                timestamp: new Date()
            });
            const stats = tracker.getStatistics(100);
            expect(stats.appropriateUsages).toBe(1);
            expect(stats.questionableUsages).toBe(1);
            expect(stats.inappropriateUsages).toBe(1);
            expect(stats.appropriatenessRate).toBeCloseTo(0.333, 2);
        });
        it('should provide feedback on usage patterns', () => {
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
            // Record 10 appropriate usages
            for (let i = 0; i < 10; i++) {
                tracker.recordUsage({
                    token,
                    context: StrategicFlexibilityTracker_1.UsageContext.COMPONENT_INTERNAL,
                    appropriateness: StrategicFlexibilityTracker_1.UsageAppropriateness.APPROPRIATE,
                    location: `Component${i}.tsx`,
                    timestamp: new Date()
                });
            }
            const feedback = tracker.getFeedback(100);
            expect(feedback.length).toBeGreaterThan(0);
            expect(feedback.some(f => f.includes('PASS'))).toBe(true);
        });
        it('should provide failure feedback when threshold exceeded', () => {
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
            // Record 30 usages (30% of 100)
            for (let i = 0; i < 30; i++) {
                tracker.recordUsage({
                    token,
                    context: StrategicFlexibilityTracker_1.UsageContext.COMPONENT_INTERNAL,
                    appropriateness: StrategicFlexibilityTracker_1.UsageAppropriateness.APPROPRIATE,
                    location: `Component${i}.tsx`,
                    timestamp: new Date()
                });
            }
            const feedback = tracker.getFeedback(100);
            expect(feedback.some(f => f.includes('FAIL'))).toBe(true);
            expect(feedback.some(f => f.includes('exceeds 20% threshold'))).toBe(true);
        });
        it('should group usages by context', () => {
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
            tracker.recordUsage({
                token,
                context: StrategicFlexibilityTracker_1.UsageContext.COMPONENT_INTERNAL,
                appropriateness: StrategicFlexibilityTracker_1.UsageAppropriateness.APPROPRIATE,
                location: 'Button.tsx',
                timestamp: new Date()
            });
            tracker.recordUsage({
                token,
                context: StrategicFlexibilityTracker_1.UsageContext.COMPONENT_INTERNAL,
                appropriateness: StrategicFlexibilityTracker_1.UsageAppropriateness.APPROPRIATE,
                location: 'Input.tsx',
                timestamp: new Date()
            });
            tracker.recordUsage({
                token,
                context: StrategicFlexibilityTracker_1.UsageContext.LAYOUT_SPACING,
                appropriateness: StrategicFlexibilityTracker_1.UsageAppropriateness.QUESTIONABLE,
                location: 'Layout.tsx',
                timestamp: new Date()
            });
            const stats = tracker.getStatistics(100);
            expect(stats.byContext.get(StrategicFlexibilityTracker_1.UsageContext.COMPONENT_INTERNAL)).toBe(2);
            expect(stats.byContext.get(StrategicFlexibilityTracker_1.UsageContext.LAYOUT_SPACING)).toBe(1);
        });
        it('should filter usages by appropriateness', () => {
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
            tracker.recordUsage({
                token,
                context: StrategicFlexibilityTracker_1.UsageContext.COMPONENT_INTERNAL,
                appropriateness: StrategicFlexibilityTracker_1.UsageAppropriateness.APPROPRIATE,
                location: 'Button.tsx',
                timestamp: new Date()
            });
            tracker.recordUsage({
                token,
                context: StrategicFlexibilityTracker_1.UsageContext.LAYOUT_SPACING,
                appropriateness: StrategicFlexibilityTracker_1.UsageAppropriateness.INAPPROPRIATE,
                location: 'Layout.tsx',
                timestamp: new Date()
            });
            const appropriate = tracker.getUsagesByAppropriateness(StrategicFlexibilityTracker_1.UsageAppropriateness.APPROPRIATE);
            const inappropriate = tracker.getUsagesByAppropriateness(StrategicFlexibilityTracker_1.UsageAppropriateness.INAPPROPRIATE);
            expect(appropriate).toHaveLength(1);
            expect(inappropriate).toHaveLength(1);
        });
        it('should clear all usages', () => {
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
            tracker.recordUsage({
                token,
                context: StrategicFlexibilityTracker_1.UsageContext.COMPONENT_INTERNAL,
                appropriateness: StrategicFlexibilityTracker_1.UsageAppropriateness.APPROPRIATE,
                location: 'Button.tsx',
                timestamp: new Date()
            });
            tracker.clear();
            const stats = tracker.getStatistics(100);
            expect(stats.totalUsages).toBe(0);
        });
    });
    describe('UsagePatternAnalyzer', () => {
        let tokenUsageTracker;
        let strategicFlexibilityTracker;
        let semanticTokenUsageTracker;
        let primitiveTokenFallbackTracker;
        let analyzer;
        beforeEach(() => {
            tokenUsageTracker = new TokenUsageTracker_1.TokenUsageTracker();
            strategicFlexibilityTracker = new StrategicFlexibilityTracker_1.StrategicFlexibilityTracker();
            semanticTokenUsageTracker = new SemanticTokenUsageTracker_1.SemanticTokenUsageTracker();
            primitiveTokenFallbackTracker = new PrimitiveTokenFallbackTracker_1.PrimitiveTokenFallbackTracker();
            analyzer = new UsagePatternAnalyzer_1.UsagePatternAnalyzer(tokenUsageTracker, strategicFlexibilityTracker, semanticTokenUsageTracker, primitiveTokenFallbackTracker);
        });
        it('should analyze overall usage patterns', () => {
            const primitiveToken = {
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
            const semanticToken = {
                name: 'space.normal',
                primitiveReferences: { default: 'space100' },
                category: types_1.SemanticCategory.SPACING,
                context: 'Normal spacing',
                description: 'Semantic normal spacing',
                primitiveTokens: { default: primitiveToken }
            };
            // Record some usages
            tokenUsageTracker.recordPrimitiveUsage(primitiveToken, 'Button.tsx');
            tokenUsageTracker.recordSemanticUsage(semanticToken, 'Layout.tsx');
            const analysis = analyzer.analyze();
            expect(analysis.overallUsage.totalUsages).toBe(2);
            expect(analysis.overallUsage.primitiveUsages).toBe(1);
            expect(analysis.overallUsage.semanticUsages).toBe(1);
        });
        it('should validate strategic flexibility threshold', () => {
            const sfToken = {
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
            const regularToken = {
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
            // Record 10 SF usages and 90 regular usages
            for (let i = 0; i < 10; i++) {
                strategicFlexibilityTracker.recordUsage({
                    token: sfToken,
                    context: StrategicFlexibilityTracker_1.UsageContext.COMPONENT_INTERNAL,
                    appropriateness: StrategicFlexibilityTracker_1.UsageAppropriateness.APPROPRIATE,
                    location: `Component${i}.tsx`,
                    timestamp: new Date()
                });
                tokenUsageTracker.recordPrimitiveUsage(sfToken, `Component${i}.tsx`);
            }
            for (let i = 0; i < 90; i++) {
                tokenUsageTracker.recordPrimitiveUsage(regularToken, `Component${i}.tsx`);
            }
            const analysis = analyzer.analyze();
            expect(analysis.strategicFlexibility.usageRate).toBe(0.1); // 10%
            expect(analysis.strategicFlexibility.meetsThreshold).toBe(true);
            expect(analysis.strategicFlexibility.status).toBe('PASS');
        });
        it('should detect strategic flexibility threshold violations', () => {
            const sfToken = {
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
            const regularToken = {
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
            // Record 25 SF usages and 75 regular usages (25% SF)
            for (let i = 0; i < 25; i++) {
                strategicFlexibilityTracker.recordUsage({
                    token: sfToken,
                    context: StrategicFlexibilityTracker_1.UsageContext.COMPONENT_INTERNAL,
                    appropriateness: StrategicFlexibilityTracker_1.UsageAppropriateness.APPROPRIATE,
                    location: `Component${i}.tsx`,
                    timestamp: new Date()
                });
                tokenUsageTracker.recordPrimitiveUsage(sfToken, `Component${i}.tsx`);
            }
            for (let i = 0; i < 75; i++) {
                tokenUsageTracker.recordPrimitiveUsage(regularToken, `Component${i}.tsx`);
            }
            const analysis = analyzer.analyze();
            expect(analysis.strategicFlexibility.usageRate).toBe(0.25); // 25%
            expect(analysis.strategicFlexibility.meetsThreshold).toBe(false);
            expect(analysis.strategicFlexibility.status).toBe('FAIL');
        });
        it('should generate comprehensive usage report', () => {
            const primitiveToken = {
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
            tokenUsageTracker.recordPrimitiveUsage(primitiveToken, 'Button.tsx');
            const report = analyzer.generateReport();
            expect(report).toContain('Token Usage Pattern Analysis Report');
            expect(report).toContain('Overall Token Usage');
            expect(report).toContain('Strategic Flexibility Validation');
            expect(report).toContain('Semantic Token Insights');
        });
        it('should provide semantic token adoption insights', () => {
            const primitiveToken = {
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
            const semanticToken = {
                name: 'space.normal',
                primitiveReferences: { default: 'space100' },
                category: types_1.SemanticCategory.SPACING,
                context: 'Normal spacing',
                description: 'Semantic normal spacing',
                primitiveTokens: { default: primitiveToken }
            };
            // Record 30 semantic and 70 primitive usages
            for (let i = 0; i < 30; i++) {
                tokenUsageTracker.recordSemanticUsage(semanticToken, `Component${i}.tsx`);
                semanticTokenUsageTracker.recordUsage({
                    token: semanticToken,
                    location: `Component${i}.tsx`,
                    timestamp: new Date()
                });
            }
            for (let i = 0; i < 70; i++) {
                tokenUsageTracker.recordPrimitiveUsage(primitiveToken, `Component${i}.tsx`);
            }
            const analysis = analyzer.analyze();
            expect(analysis.insights.semanticTokens.adoptionRate).toBe(0.3); // 30%
            expect(analysis.insights.semanticTokens.totalUsages).toBe(30);
        });
    });
});
//# sourceMappingURL=UsageTracking.test.js.map