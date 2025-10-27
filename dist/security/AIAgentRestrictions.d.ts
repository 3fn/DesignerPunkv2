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
import type { PrimitiveToken } from '../types/PrimitiveToken';
import type { ValidationResult } from '../types/ValidationResult';
export interface RestrictionContext {
    /** Source of the action (human or AI agent) */
    source: 'human' | 'ai-agent';
    /** Optional identifier for the agent or user */
    identifier?: string;
    /** Timestamp of the action */
    timestamp: Date;
    /** Additional context about the action */
    metadata?: Record<string, unknown>;
}
export interface RestrictionResult {
    /** Whether the action is allowed */
    allowed: boolean;
    /** Reason for allowing or blocking the action */
    reason: string;
    /** Suggested alternatives if action is blocked */
    alternatives?: string[];
    /** Whether human approval is required */
    requiresHumanApproval: boolean;
    /** Validation result if applicable */
    validationResult?: ValidationResult;
}
export interface AIAgentRestrictionsConfig {
    /** Whether to enforce AI agent restrictions */
    enabled: boolean;
    /** Whether to allow AI agents to suggest new flexibility tokens */
    allowSuggestions: boolean;
    /** Whether to log all restriction checks */
    logRestrictions: boolean;
}
/**
 * AI Agent Restrictions System
 *
 * Prevents AI agents from creating unauthorized strategic flexibility tokens
 * and provides guidance on using existing alternatives.
 */
export declare class AIAgentRestrictions {
    private config;
    private restrictionLog;
    constructor(config?: Partial<AIAgentRestrictionsConfig>);
    /**
     * Check if a token registration action is allowed
     */
    checkTokenRegistration(token: PrimitiveToken, context: RestrictionContext): RestrictionResult;
    /**
     * Check if a strategic flexibility token creation is allowed
     */
    private checkStrategicFlexibilityToken;
    /**
     * Suggest existing strategic flexibility alternatives
     */
    private suggestAlternatives;
    /**
     * Request human approval for a restricted action
     */
    requestHumanApproval(token: PrimitiveToken, context: RestrictionContext, justification: string): {
        approvalRequired: true;
        token: PrimitiveToken;
        context: RestrictionContext;
        justification: string;
        alternatives: string[];
    };
    /**
     * Get restriction statistics
     */
    getStats(): {
        totalChecks: number;
        blockedActions: number;
        humanApprovalRequired: number;
        aiAgentActions: number;
        blockRate: number;
        config: AIAgentRestrictionsConfig;
    };
    /**
     * Get restriction log
     */
    getLog(): {
        context: RestrictionContext;
        result: RestrictionResult;
        token?: PrimitiveToken;
    }[];
    /**
     * Clear restriction log
     */
    clearLog(): void;
    /**
     * Update configuration
     */
    updateConfig(config: Partial<AIAgentRestrictionsConfig>): void;
    /**
     * Create an allowed result
     */
    private createAllowedResult;
    /**
     * Create a blocked result
     */
    private createBlockedResult;
    /**
     * Log a restriction check
     */
    private logRestriction;
}
//# sourceMappingURL=AIAgentRestrictions.d.ts.map