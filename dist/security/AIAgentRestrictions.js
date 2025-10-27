"use strict";
/**
 * AI Agent Restrictions System
 *
 * Enforces restrictions on AI agent actions to prevent unauthorized modifications
 * to the mathematical token system. Specifically prevents AI agents from creating
 * new strategic flexibility tokens without human approval.
 *
 * This system implements contamination prevention by ensuring AI agents cannot
 * learn patterns that would degrade mathematical consistency.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAgentRestrictions = void 0;
const StrategicFlexibilityTokens_1 = require("../constants/StrategicFlexibilityTokens");
/**
 * AI Agent Restrictions System
 *
 * Prevents AI agents from creating unauthorized strategic flexibility tokens
 * and provides guidance on using existing alternatives.
 */
class AIAgentRestrictions {
    constructor(config = {}) {
        this.restrictionLog = [];
        this.config = {
            enabled: true,
            allowSuggestions: true,
            logRestrictions: true,
            ...config
        };
    }
    /**
     * Check if a token registration action is allowed
     */
    checkTokenRegistration(token, context) {
        // If restrictions are disabled, allow all actions
        if (!this.config.enabled) {
            return this.createAllowedResult('Restrictions disabled');
        }
        // Human actions are always allowed
        if (context.source === 'human') {
            return this.createAllowedResult('Human action - no restrictions');
        }
        // Check if this is a strategic flexibility token
        if (token.isStrategicFlexibility) {
            const result = this.checkStrategicFlexibilityToken(token, context);
            this.logRestriction(context, result, token);
            return result;
        }
        // Non-strategic-flexibility tokens are allowed for AI agents
        const result = this.createAllowedResult('Standard token registration allowed');
        this.logRestriction(context, result, token);
        return result;
    }
    /**
     * Check if a strategic flexibility token creation is allowed
     */
    checkStrategicFlexibilityToken(token, context) {
        // Check if this is an existing strategic flexibility token
        const existingToken = Object.values(StrategicFlexibilityTokens_1.STRATEGIC_FLEXIBILITY_TOKENS).find(t => t.value === token.baseValue);
        if (existingToken) {
            // Existing strategic flexibility token - allowed
            return this.createAllowedResult(`Existing strategic flexibility token (${existingToken.derivation})`);
        }
        // New strategic flexibility token - requires human approval
        return this.createBlockedResult('AI agents cannot create new strategic flexibility tokens without human approval', this.suggestAlternatives(token));
    }
    /**
     * Suggest existing strategic flexibility alternatives
     */
    suggestAlternatives(token) {
        const alternatives = [];
        // Find closest existing strategic flexibility tokens
        const existingValues = Object.values(StrategicFlexibilityTokens_1.STRATEGIC_FLEXIBILITY_TOKENS)
            .filter(t => t.category === token.category)
            .map(t => t.value)
            .sort((a, b) => Math.abs(a - token.baseValue) - Math.abs(b - token.baseValue));
        if (existingValues.length > 0) {
            const closest = existingValues.slice(0, 2);
            alternatives.push(`Use existing strategic flexibility token with value ${closest[0]} (closest match)`);
            if (closest.length > 1) {
                alternatives.push(`Alternative: Use strategic flexibility token with value ${closest[1]}`);
            }
        }
        // Suggest standard baseline grid tokens
        const baselineGridValue = Math.round(token.baseValue / 8) * 8;
        if (baselineGridValue !== token.baseValue) {
            alternatives.push(`Use baseline grid-aligned token with value ${baselineGridValue} (8-unit grid)`);
        }
        // Suggest semantic token approach
        alternatives.push('Consider creating a semantic token that references an existing primitive token');
        // Suggest human approval process
        alternatives.push('Request human approval to create a new strategic flexibility token if genuinely needed');
        return alternatives;
    }
    /**
     * Request human approval for a restricted action
     */
    requestHumanApproval(token, context, justification) {
        return {
            approvalRequired: true,
            token,
            context,
            justification,
            alternatives: this.suggestAlternatives(token)
        };
    }
    /**
     * Get restriction statistics
     */
    getStats() {
        const totalChecks = this.restrictionLog.length;
        const blockedActions = this.restrictionLog.filter(log => !log.result.allowed).length;
        const humanApprovalRequired = this.restrictionLog.filter(log => log.result.requiresHumanApproval).length;
        const aiAgentActions = this.restrictionLog.filter(log => log.context.source === 'ai-agent').length;
        return {
            totalChecks,
            blockedActions,
            humanApprovalRequired,
            aiAgentActions,
            blockRate: totalChecks > 0 ? (blockedActions / totalChecks) * 100 : 0,
            config: this.config
        };
    }
    /**
     * Get restriction log
     */
    getLog() {
        return [...this.restrictionLog];
    }
    /**
     * Clear restriction log
     */
    clearLog() {
        this.restrictionLog = [];
    }
    /**
     * Update configuration
     */
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
    /**
     * Create an allowed result
     */
    createAllowedResult(reason) {
        return {
            allowed: true,
            reason,
            requiresHumanApproval: false
        };
    }
    /**
     * Create a blocked result
     */
    createBlockedResult(reason, alternatives) {
        return {
            allowed: false,
            reason,
            alternatives,
            requiresHumanApproval: true,
            validationResult: {
                level: 'Error',
                token: 'New Strategic Flexibility Token',
                message: 'AI agent restriction: Human approval required',
                rationale: reason,
                mathematicalReasoning: 'Strategic flexibility tokens must be approved by humans to prevent contamination of mathematical foundations',
                suggestions: alternatives
            }
        };
    }
    /**
     * Log a restriction check
     */
    logRestriction(context, result, token) {
        if (this.config.logRestrictions) {
            this.restrictionLog.push({
                context,
                result,
                token
            });
        }
    }
}
exports.AIAgentRestrictions = AIAgentRestrictions;
//# sourceMappingURL=AIAgentRestrictions.js.map