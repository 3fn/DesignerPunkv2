/**
 * Flexibility Token Guard
 *
 * Integrates AI agent restrictions with the token registration workflow.
 * Provides a unified interface for protecting strategic flexibility tokens
 * and managing the approval process.
 */
import type { PrimitiveToken } from '../types/PrimitiveToken';
import type { ValidationResult } from '../types/ValidationResult';
import { type RestrictionContext, type RestrictionResult } from './AIAgentRestrictions';
import { type ApprovalRequest } from './HumanApprovalWorkflow';
export interface FlexibilityTokenGuardConfig {
    /** Whether to enable the guard */
    enabled: boolean;
    /** AI agent restrictions configuration */
    restrictions: {
        enabled: boolean;
        allowSuggestions: boolean;
        logRestrictions: boolean;
    };
    /** Human approval workflow configuration */
    approval: {
        enableExpiration: boolean;
        expirationTime: number;
        requireResolutionNotes: boolean;
    };
}
export interface GuardResult {
    /** Whether the token registration is allowed */
    allowed: boolean;
    /** Reason for the decision */
    reason: string;
    /** Restriction result if applicable */
    restrictionResult?: RestrictionResult;
    /** Approval request if human approval is required */
    approvalRequest?: ApprovalRequest;
    /** Validation result */
    validationResult?: ValidationResult;
}
/**
 * Flexibility Token Guard
 *
 * Unified interface for protecting strategic flexibility tokens and managing
 * the approval workflow for AI agent actions.
 */
export declare class FlexibilityTokenGuard {
    private restrictions;
    private approvalWorkflow;
    private config;
    constructor(config?: Partial<FlexibilityTokenGuardConfig>);
    /**
     * Guard a token registration action
     */
    guard(token: PrimitiveToken, context: RestrictionContext): GuardResult;
    /**
     * Approve a pending request
     */
    approve(requestId: string, approvedBy: string, notes?: string): ApprovalRequest | null;
    /**
     * Reject a pending request
     */
    reject(requestId: string, rejectedBy: string, notes?: string): ApprovalRequest | null;
    /**
     * Get a specific approval request
     */
    getApprovalRequest(requestId: string): ApprovalRequest | undefined;
    /**
     * Get all pending approval requests
     */
    getPendingApprovals(): ApprovalRequest[];
    /**
     * Get all approval requests for a specific agent
     */
    getAgentApprovals(agentIdentifier: string): ApprovalRequest[];
    /**
     * Check if a token registration would be allowed
     */
    wouldAllow(token: PrimitiveToken, context: RestrictionContext): boolean;
    /**
     * Get guard statistics
     */
    getStats(): {
        restrictions: {
            totalChecks: number;
            blockedActions: number;
            humanApprovalRequired: number;
            aiAgentActions: number;
            blockRate: number;
            config: import("./AIAgentRestrictions").AIAgentRestrictionsConfig;
        };
        approvals: {
            totalRequests: number;
            pending: number;
            approved: number;
            rejected: number;
            expired: number;
            approvalRate: number;
            rejectionRate: number;
            config: import("./HumanApprovalWorkflow").HumanApprovalWorkflowConfig;
        };
        config: FlexibilityTokenGuardConfig;
    };
    /**
     * Get restriction log
     */
    getRestrictionLog(): {
        context: RestrictionContext;
        result: RestrictionResult;
        token?: PrimitiveToken;
    }[];
    /**
     * Clear restriction log
     */
    clearRestrictionLog(): void;
    /**
     * Clear resolved approval requests
     */
    clearResolvedApprovals(): number;
    /**
     * Update configuration
     */
    updateConfig(config: Partial<FlexibilityTokenGuardConfig>): void;
    /**
     * Enable the guard
     */
    enable(): void;
    /**
     * Disable the guard
     */
    disable(): void;
    /**
     * Check if the guard is enabled
     */
    isEnabled(): boolean;
}
//# sourceMappingURL=FlexibilityTokenGuard.d.ts.map