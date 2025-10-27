/**
 * Human Approval Workflow
 *
 * Manages the human approval process for restricted AI agent actions.
 * Provides a workflow for requesting, tracking, and resolving approval requests.
 */
import type { PrimitiveToken } from '../types/PrimitiveToken';
import type { RestrictionContext } from './AIAgentRestrictions';
export declare enum ApprovalStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    EXPIRED = "expired"
}
export interface ApprovalRequest {
    /** Unique identifier for the approval request */
    id: string;
    /** Token requiring approval */
    token: PrimitiveToken;
    /** Context of the request */
    context: RestrictionContext;
    /** Justification for the request */
    justification: string;
    /** Suggested alternatives */
    alternatives: string[];
    /** Current status of the request */
    status: ApprovalStatus;
    /** Timestamp when request was created */
    createdAt: Date;
    /** Timestamp when request was resolved */
    resolvedAt?: Date;
    /** Human who resolved the request */
    resolvedBy?: string;
    /** Resolution notes */
    resolutionNotes?: string;
    /** Expiration timestamp */
    expiresAt?: Date;
}
export interface ApprovalDecision {
    /** Whether the request is approved */
    approved: boolean;
    /** Human who made the decision */
    approvedBy: string;
    /** Notes about the decision */
    notes?: string;
    /** Timestamp of the decision */
    timestamp: Date;
}
export interface HumanApprovalWorkflowConfig {
    /** Whether to enable automatic expiration of requests */
    enableExpiration: boolean;
    /** Expiration time in milliseconds (default: 24 hours) */
    expirationTime: number;
    /** Whether to require resolution notes */
    requireResolutionNotes: boolean;
}
/**
 * Human Approval Workflow
 *
 * Manages approval requests for restricted AI agent actions.
 */
export declare class HumanApprovalWorkflow {
    private requests;
    private config;
    private requestCounter;
    constructor(config?: Partial<HumanApprovalWorkflowConfig>);
    /**
     * Create a new approval request
     */
    createRequest(token: PrimitiveToken, context: RestrictionContext, justification: string, alternatives: string[]): ApprovalRequest;
    /**
     * Approve a request
     */
    approve(requestId: string, decision: ApprovalDecision): ApprovalRequest | null;
    /**
     * Reject a request
     */
    reject(requestId: string, decision: ApprovalDecision): ApprovalRequest | null;
    /**
     * Get a request by ID
     */
    getRequest(requestId: string): ApprovalRequest | undefined;
    /**
     * Get all pending requests
     */
    getPendingRequests(): ApprovalRequest[];
    /**
     * Get all requests with a specific status
     */
    getRequestsByStatus(status: ApprovalStatus): ApprovalRequest[];
    /**
     * Get all requests for a specific AI agent
     */
    getRequestsByAgent(agentIdentifier: string): ApprovalRequest[];
    /**
     * Check if a request has expired
     */
    private isExpired;
    /**
     * Generate a unique request ID
     */
    private generateRequestId;
    /**
     * Get workflow statistics
     */
    getStats(): {
        totalRequests: number;
        pending: number;
        approved: number;
        rejected: number;
        expired: number;
        approvalRate: number;
        rejectionRate: number;
        config: HumanApprovalWorkflowConfig;
    };
    /**
     * Clear all resolved requests
     */
    clearResolved(): number;
    /**
     * Clear all requests
     */
    clearAll(): void;
    /**
     * Update configuration
     */
    updateConfig(config: Partial<HumanApprovalWorkflowConfig>): void;
}
//# sourceMappingURL=HumanApprovalWorkflow.d.ts.map