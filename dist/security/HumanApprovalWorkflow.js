"use strict";
/**
 * Human Approval Workflow
 *
 * Manages the human approval process for restricted AI agent actions.
 * Provides a workflow for requesting, tracking, and resolving approval requests.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HumanApprovalWorkflow = exports.ApprovalStatus = void 0;
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "pending";
    ApprovalStatus["APPROVED"] = "approved";
    ApprovalStatus["REJECTED"] = "rejected";
    ApprovalStatus["EXPIRED"] = "expired";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
/**
 * Human Approval Workflow
 *
 * Manages approval requests for restricted AI agent actions.
 */
class HumanApprovalWorkflow {
    constructor(config = {}) {
        this.requests = new Map();
        this.requestCounter = 0;
        this.config = {
            enableExpiration: true,
            expirationTime: 24 * 60 * 60 * 1000, // 24 hours
            requireResolutionNotes: false,
            ...config
        };
    }
    /**
     * Create a new approval request
     */
    createRequest(token, context, justification, alternatives) {
        const id = this.generateRequestId();
        const createdAt = new Date();
        const expiresAt = this.config.enableExpiration
            ? new Date(createdAt.getTime() + this.config.expirationTime)
            : undefined;
        const request = {
            id,
            token,
            context,
            justification,
            alternatives,
            status: ApprovalStatus.PENDING,
            createdAt,
            expiresAt
        };
        this.requests.set(id, request);
        return request;
    }
    /**
     * Approve a request
     */
    approve(requestId, decision) {
        const request = this.requests.get(requestId);
        if (!request) {
            return null;
        }
        if (request.status !== ApprovalStatus.PENDING) {
            throw new Error(`Request ${requestId} is not pending (status: ${request.status})`);
        }
        // Check if request has expired
        if (this.isExpired(request)) {
            request.status = ApprovalStatus.EXPIRED;
            throw new Error(`Request ${requestId} has expired`);
        }
        // Validate resolution notes if required
        if (this.config.requireResolutionNotes && !decision.notes) {
            throw new Error('Resolution notes are required');
        }
        // Update request
        request.status = ApprovalStatus.APPROVED;
        request.resolvedAt = decision.timestamp;
        request.resolvedBy = decision.approvedBy;
        request.resolutionNotes = decision.notes;
        return request;
    }
    /**
     * Reject a request
     */
    reject(requestId, decision) {
        const request = this.requests.get(requestId);
        if (!request) {
            return null;
        }
        if (request.status !== ApprovalStatus.PENDING) {
            throw new Error(`Request ${requestId} is not pending (status: ${request.status})`);
        }
        // Check if request has expired
        if (this.isExpired(request)) {
            request.status = ApprovalStatus.EXPIRED;
            throw new Error(`Request ${requestId} has expired`);
        }
        // Validate resolution notes if required
        if (this.config.requireResolutionNotes && !decision.notes) {
            throw new Error('Resolution notes are required');
        }
        // Update request
        request.status = ApprovalStatus.REJECTED;
        request.resolvedAt = decision.timestamp;
        request.resolvedBy = decision.approvedBy;
        request.resolutionNotes = decision.notes;
        return request;
    }
    /**
     * Get a request by ID
     */
    getRequest(requestId) {
        const request = this.requests.get(requestId);
        // Update status if expired
        if (request && this.isExpired(request) && request.status === ApprovalStatus.PENDING) {
            request.status = ApprovalStatus.EXPIRED;
        }
        return request;
    }
    /**
     * Get all pending requests
     */
    getPendingRequests() {
        const pending = [];
        for (const request of this.requests.values()) {
            // Update status if expired
            if (this.isExpired(request) && request.status === ApprovalStatus.PENDING) {
                request.status = ApprovalStatus.EXPIRED;
            }
            if (request.status === ApprovalStatus.PENDING) {
                pending.push(request);
            }
        }
        return pending;
    }
    /**
     * Get all requests with a specific status
     */
    getRequestsByStatus(status) {
        return Array.from(this.requests.values()).filter(request => request.status === status);
    }
    /**
     * Get all requests for a specific AI agent
     */
    getRequestsByAgent(agentIdentifier) {
        return Array.from(this.requests.values()).filter(request => request.context.identifier === agentIdentifier);
    }
    /**
     * Check if a request has expired
     */
    isExpired(request) {
        if (!this.config.enableExpiration || !request.expiresAt) {
            return false;
        }
        return new Date() > request.expiresAt;
    }
    /**
     * Generate a unique request ID
     */
    generateRequestId() {
        this.requestCounter++;
        const timestamp = Date.now();
        return `approval-${timestamp}-${this.requestCounter}`;
    }
    /**
     * Get workflow statistics
     */
    getStats() {
        const totalRequests = this.requests.size;
        const pending = this.getRequestsByStatus(ApprovalStatus.PENDING).length;
        const approved = this.getRequestsByStatus(ApprovalStatus.APPROVED).length;
        const rejected = this.getRequestsByStatus(ApprovalStatus.REJECTED).length;
        const expired = this.getRequestsByStatus(ApprovalStatus.EXPIRED).length;
        return {
            totalRequests,
            pending,
            approved,
            rejected,
            expired,
            approvalRate: totalRequests > 0 ? (approved / totalRequests) * 100 : 0,
            rejectionRate: totalRequests > 0 ? (rejected / totalRequests) * 100 : 0,
            config: this.config
        };
    }
    /**
     * Clear all resolved requests
     */
    clearResolved() {
        let cleared = 0;
        for (const [id, request] of this.requests.entries()) {
            if (request.status !== ApprovalStatus.PENDING) {
                this.requests.delete(id);
                cleared++;
            }
        }
        return cleared;
    }
    /**
     * Clear all requests
     */
    clearAll() {
        this.requests.clear();
        this.requestCounter = 0;
    }
    /**
     * Update configuration
     */
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
}
exports.HumanApprovalWorkflow = HumanApprovalWorkflow;
//# sourceMappingURL=HumanApprovalWorkflow.js.map