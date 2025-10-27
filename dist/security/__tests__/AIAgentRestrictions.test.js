"use strict";
/**
 * AI Agent Restrictions Tests
 *
 * Tests for AI agent restriction enforcement system
 */
Object.defineProperty(exports, "__esModule", { value: true });
const AIAgentRestrictions_1 = require("../AIAgentRestrictions");
const PrimitiveToken_1 = require("../../types/PrimitiveToken");
describe('AIAgentRestrictions', () => {
    let restrictions;
    let humanContext;
    let aiContext;
    beforeEach(() => {
        restrictions = new AIAgentRestrictions_1.AIAgentRestrictions();
        humanContext = {
            source: 'human',
            identifier: 'user-123',
            timestamp: new Date()
        };
        aiContext = {
            source: 'ai-agent',
            identifier: 'agent-456',
            timestamp: new Date()
        };
    });
    describe('Token Registration Restrictions', () => {
        it('should allow human to register any token', () => {
            const token = {
                name: 'space100',
                category: PrimitiveToken_1.TokenCategory.SPACING,
                baseValue: 8,
                familyBaseValue: 8,
                description: 'Standard spacing',
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
            const result = restrictions.checkTokenRegistration(token, humanContext);
            expect(result.allowed).toBe(true);
            expect(result.reason).toContain('Human action');
            expect(result.requiresHumanApproval).toBe(false);
        });
        it('should allow AI agent to register standard baseline grid tokens', () => {
            const token = {
                name: 'space200',
                category: PrimitiveToken_1.TokenCategory.SPACING,
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
            };
            const result = restrictions.checkTokenRegistration(token, aiContext);
            expect(result.allowed).toBe(true);
            expect(result.reason).toContain('Standard token registration allowed');
            expect(result.requiresHumanApproval).toBe(false);
        });
        it('should allow AI agent to register existing strategic flexibility tokens', () => {
            const token = {
                name: 'space075',
                category: PrimitiveToken_1.TokenCategory.SPACING,
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
            const result = restrictions.checkTokenRegistration(token, aiContext);
            expect(result.allowed).toBe(true);
            expect(result.reason).toContain('Existing strategic flexibility token');
        });
        it('should block AI agent from creating new strategic flexibility tokens', () => {
            const token = {
                name: 'space085',
                category: PrimitiveToken_1.TokenCategory.SPACING,
                baseValue: 7,
                familyBaseValue: 8,
                description: 'New strategic flexibility spacing',
                mathematicalRelationship: 'base × 0.875',
                baselineGridAlignment: false,
                isStrategicFlexibility: true,
                isPrecisionTargeted: false,
                platforms: {
                    web: { value: 7, unit: 'px' },
                    ios: { value: 7, unit: 'pt' },
                    android: { value: 7, unit: 'dp' }
                }
            };
            const result = restrictions.checkTokenRegistration(token, aiContext);
            expect(result.allowed).toBe(false);
            expect(result.reason).toContain('cannot create new strategic flexibility tokens');
            expect(result.requiresHumanApproval).toBe(true);
            expect(result.alternatives).toBeDefined();
            expect(result.alternatives.length).toBeGreaterThan(0);
        });
    });
    describe('Alternative Suggestions', () => {
        it('should suggest existing strategic flexibility alternatives', () => {
            const token = {
                name: 'space085',
                category: PrimitiveToken_1.TokenCategory.SPACING,
                baseValue: 7,
                familyBaseValue: 8,
                description: 'New strategic flexibility',
                mathematicalRelationship: 'base × 0.875',
                baselineGridAlignment: false,
                isStrategicFlexibility: true,
                isPrecisionTargeted: false,
                platforms: {
                    web: { value: 7, unit: 'px' },
                    ios: { value: 7, unit: 'pt' },
                    android: { value: 7, unit: 'dp' }
                }
            };
            const result = restrictions.checkTokenRegistration(token, aiContext);
            expect(result.alternatives).toBeDefined();
            expect(result.alternatives.some(alt => alt.includes('existing strategic flexibility'))).toBe(true);
        });
        it('should suggest baseline grid-aligned alternatives', () => {
            const token = {
                name: 'space085',
                category: PrimitiveToken_1.TokenCategory.SPACING,
                baseValue: 7,
                familyBaseValue: 8,
                description: 'New strategic flexibility',
                mathematicalRelationship: 'base × 0.875',
                baselineGridAlignment: false,
                isStrategicFlexibility: true,
                isPrecisionTargeted: false,
                platforms: {
                    web: { value: 7, unit: 'px' },
                    ios: { value: 7, unit: 'pt' },
                    android: { value: 7, unit: 'dp' }
                }
            };
            const result = restrictions.checkTokenRegistration(token, aiContext);
            expect(result.alternatives).toBeDefined();
            expect(result.alternatives.some(alt => alt.includes('baseline grid-aligned'))).toBe(true);
            expect(result.alternatives.some(alt => alt.includes('8'))).toBe(true);
        });
        it('should suggest semantic token approach', () => {
            const token = {
                name: 'space085',
                category: PrimitiveToken_1.TokenCategory.SPACING,
                baseValue: 7,
                familyBaseValue: 8,
                description: 'New strategic flexibility',
                mathematicalRelationship: 'base × 0.875',
                baselineGridAlignment: false,
                isStrategicFlexibility: true,
                isPrecisionTargeted: false,
                platforms: {
                    web: { value: 7, unit: 'px' },
                    ios: { value: 7, unit: 'pt' },
                    android: { value: 7, unit: 'dp' }
                }
            };
            const result = restrictions.checkTokenRegistration(token, aiContext);
            expect(result.alternatives).toBeDefined();
            expect(result.alternatives.some(alt => alt.includes('semantic token'))).toBe(true);
        });
        it('should suggest human approval process', () => {
            const token = {
                name: 'space085',
                category: PrimitiveToken_1.TokenCategory.SPACING,
                baseValue: 7,
                familyBaseValue: 8,
                description: 'New strategic flexibility',
                mathematicalRelationship: 'base × 0.875',
                baselineGridAlignment: false,
                isStrategicFlexibility: true,
                isPrecisionTargeted: false,
                platforms: {
                    web: { value: 7, unit: 'px' },
                    ios: { value: 7, unit: 'pt' },
                    android: { value: 7, unit: 'dp' }
                }
            };
            const result = restrictions.checkTokenRegistration(token, aiContext);
            expect(result.alternatives).toBeDefined();
            expect(result.alternatives.some(alt => alt.includes('human approval'))).toBe(true);
        });
    });
    describe('Human Approval Requests', () => {
        it('should create human approval request with token details', () => {
            const token = {
                name: 'space085',
                category: PrimitiveToken_1.TokenCategory.SPACING,
                baseValue: 7,
                familyBaseValue: 8,
                description: 'New strategic flexibility',
                mathematicalRelationship: 'base × 0.875',
                baselineGridAlignment: false,
                isStrategicFlexibility: true,
                isPrecisionTargeted: false,
                platforms: {
                    web: { value: 7, unit: 'px' },
                    ios: { value: 7, unit: 'pt' },
                    android: { value: 7, unit: 'dp' }
                }
            };
            const justification = 'Needed for specific design requirement';
            const approval = restrictions.requestHumanApproval(token, aiContext, justification);
            expect(approval.approvalRequired).toBe(true);
            expect(approval.token).toBe(token);
            expect(approval.context).toBe(aiContext);
            expect(approval.justification).toBe(justification);
            expect(approval.alternatives.length).toBeGreaterThan(0);
        });
    });
    describe('Configuration', () => {
        it('should allow all actions when restrictions are disabled', () => {
            restrictions.updateConfig({ enabled: false });
            const token = {
                name: 'space085',
                category: PrimitiveToken_1.TokenCategory.SPACING,
                baseValue: 7,
                familyBaseValue: 8,
                description: 'New strategic flexibility',
                mathematicalRelationship: 'base × 0.875',
                baselineGridAlignment: false,
                isStrategicFlexibility: true,
                isPrecisionTargeted: false,
                platforms: {
                    web: { value: 7, unit: 'px' },
                    ios: { value: 7, unit: 'pt' },
                    android: { value: 7, unit: 'dp' }
                }
            };
            const result = restrictions.checkTokenRegistration(token, aiContext);
            expect(result.allowed).toBe(true);
            expect(result.reason).toContain('Restrictions disabled');
        });
        it('should update configuration dynamically', () => {
            restrictions.updateConfig({
                enabled: true,
                allowSuggestions: false,
                logRestrictions: false
            });
            const stats = restrictions.getStats();
            expect(stats.config.enabled).toBe(true);
            expect(stats.config.allowSuggestions).toBe(false);
            expect(stats.config.logRestrictions).toBe(false);
        });
    });
    describe('Statistics and Logging', () => {
        it('should track restriction checks', () => {
            const token = {
                name: 'space100',
                category: PrimitiveToken_1.TokenCategory.SPACING,
                baseValue: 8,
                familyBaseValue: 8,
                description: 'Standard spacing',
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
            restrictions.checkTokenRegistration(token, aiContext);
            restrictions.checkTokenRegistration(token, aiContext);
            const stats = restrictions.getStats();
            expect(stats.totalChecks).toBe(2);
        });
        it('should track blocked actions', () => {
            const blockedToken = {
                name: 'space085',
                category: PrimitiveToken_1.TokenCategory.SPACING,
                baseValue: 7,
                familyBaseValue: 8,
                description: 'New strategic flexibility',
                mathematicalRelationship: 'base × 0.875',
                baselineGridAlignment: false,
                isStrategicFlexibility: true,
                isPrecisionTargeted: false,
                platforms: {
                    web: { value: 7, unit: 'px' },
                    ios: { value: 7, unit: 'pt' },
                    android: { value: 7, unit: 'dp' }
                }
            };
            restrictions.checkTokenRegistration(blockedToken, aiContext);
            const stats = restrictions.getStats();
            expect(stats.blockedActions).toBe(1);
            expect(stats.humanApprovalRequired).toBe(1);
        });
        it('should calculate block rate', () => {
            const allowedToken = {
                name: 'space100',
                category: PrimitiveToken_1.TokenCategory.SPACING,
                baseValue: 8,
                familyBaseValue: 8,
                description: 'Standard spacing',
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
            const blockedToken = {
                name: 'space085',
                category: PrimitiveToken_1.TokenCategory.SPACING,
                baseValue: 7,
                familyBaseValue: 8,
                description: 'New strategic flexibility',
                mathematicalRelationship: 'base × 0.875',
                baselineGridAlignment: false,
                isStrategicFlexibility: true,
                isPrecisionTargeted: false,
                platforms: {
                    web: { value: 7, unit: 'px' },
                    ios: { value: 7, unit: 'pt' },
                    android: { value: 7, unit: 'dp' }
                }
            };
            restrictions.checkTokenRegistration(allowedToken, aiContext);
            restrictions.checkTokenRegistration(blockedToken, aiContext);
            const stats = restrictions.getStats();
            expect(stats.blockRate).toBe(50);
        });
        it('should provide restriction log', () => {
            const token = {
                name: 'space100',
                category: PrimitiveToken_1.TokenCategory.SPACING,
                baseValue: 8,
                familyBaseValue: 8,
                description: 'Standard spacing',
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
            restrictions.checkTokenRegistration(token, aiContext);
            const log = restrictions.getLog();
            expect(log.length).toBe(1);
            expect(log[0].context).toBe(aiContext);
            expect(log[0].token).toBe(token);
        });
        it('should clear restriction log', () => {
            const token = {
                name: 'space100',
                category: PrimitiveToken_1.TokenCategory.SPACING,
                baseValue: 8,
                familyBaseValue: 8,
                description: 'Standard spacing',
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
            restrictions.checkTokenRegistration(token, aiContext);
            expect(restrictions.getLog().length).toBe(1);
            restrictions.clearLog();
            expect(restrictions.getLog().length).toBe(0);
        });
    });
    describe('Validation Results', () => {
        it('should include validation result for blocked actions', () => {
            const token = {
                name: 'space085',
                category: PrimitiveToken_1.TokenCategory.SPACING,
                baseValue: 7,
                familyBaseValue: 8,
                description: 'New strategic flexibility',
                mathematicalRelationship: 'base × 0.875',
                baselineGridAlignment: false,
                isStrategicFlexibility: true,
                isPrecisionTargeted: false,
                platforms: {
                    web: { value: 7, unit: 'px' },
                    ios: { value: 7, unit: 'pt' },
                    android: { value: 7, unit: 'dp' }
                }
            };
            const result = restrictions.checkTokenRegistration(token, aiContext);
            expect(result.validationResult).toBeDefined();
            expect(result.validationResult.level).toBe('Error');
            expect(result.validationResult.message).toContain('Human approval required');
            expect(result.validationResult.mathematicalReasoning).toContain('mathematical foundations');
        });
    });
});
//# sourceMappingURL=AIAgentRestrictions.test.js.map