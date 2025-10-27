"use strict";
/**
 * Flexibility Token Guard
 *
 * Integrates AI agent restrictions with the token registration workflow.
 * Provides a unified interface for protecting strategic flexibility tokens
 * and managing the approval process.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlexibilityTokenGuard = void 0;
const AIAgentRestrictions_1 = require("./AIAgentRestrictions");
const HumanApprovalWorkflow_1 = require("./HumanApprovalWorkflow");
/**
 * Flexibility Token Guard
 *
 * Unified interface for protecting strategic flexibility tokens and managing
 * the approval workflow for AI agent actions.
 */
class FlexibilityTokenGuard {
    constructor(config = {}) {
        this.config = {
            enabled: true,
            restrictions: {
                enabled: true,
                allowSuggestions: true,
                logRestrictions: true
            },
            approval: {
                enableExpiration: true,
                expirationTime: 24 * 60 * 60 * 1000, // 24 hours
                requireResolutionNotes: false
            },
            ...config
        };
        this.restrictions = new AIAgentRestrictions_1.AIAgentRestrictions(this.config.restrictions);
        this.approvalWorkflow = new HumanApprovalWorkflow_1.HumanApprovalWorkflow(this.config.approval);
    }
    /**
     * Guard a token registration action
     */
    guard(token, context) {
        // If guard is disabled, allow all actions
        if (!this.config.enabled) {
            return {
                allowed: true,
                reason: 'Guard disabled'
            };
        }
        // Check restrictions
        const restrictionResult = this.restrictions.checkTokenRegistration(token, context);
        // If allowed, return success
        if (restrictionResult.allowed) {
            return {
                allowed: true,
                reason: restrictionResult.reason,
                restrictionResult
            };
        }
        // If blocked and requires human approval, create approval request
        if (restrictionResult.requiresHumanApproval) {
            const approvalRequest = this.approvalWorkflow.createRequest(token, context, restrictionResult.reason, restrictionResult.alternatives || []);
            return {
                allowed: false,
                reason: 'Human approval required',
                restrictionResult,
                approvalRequest,
                validationResult: restrictionResult.validationResult
            };
        }
        // Otherwise, blocked without approval option
        return {
            allowed: false,
            reason: restrictionResult.reason,
            restrictionResult,
            validationResult: restrictionResult.validationResult
        };
    }
    /**
     * Approve a pending request
     */
    approve(requestId, approvedBy, notes) {
        const decision = {
            approved: true,
            approvedBy,
            notes,
            timestamp: new Date()
        };
        return this.approvalWorkflow.approve(requestId, decision);
    }
    /**
     * Reject a pending request
     */
    reject(requestId, rejectedBy, notes) {
        const decision = {
            approved: false,
            approvedBy: rejectedBy,
            notes,
            timestamp: new Date()
        };
        return this.approvalWorkflow.reject(requestId, decision);
    }
    /**
     * Get a specific approval request
     */
    getApprovalRequest(requestId) {
        return this.approvalWorkflow.getRequest(requestId);
    }
    /**
     * Get all pending approval requests
     */
    getPendingApprovals() {
        return this.approvalWorkflow.getPendingRequests();
    }
    /**
     * Get all approval requests for a specific agent
     */
    getAgentApprovals(agentIdentifier) {
        return this.approvalWorkflow.getRequestsByAgent(agentIdentifier);
    }
    /**
     * Check if a token registration would be allowed
     */
    wouldAllow(token, context) {
        const result = this.guard(token, context);
        return result.allowed;
    }
    /**
     * Get guard statistics
     */
    getStats() {
        return {
            restrictions: this.restrictions.getStats(),
            approvals: this.approvalWorkflow.getStats(),
            config: this.config
        };
    }
    /**
     * Get restriction log
     */
    getRestrictionLog() {
        return this.restrictions.getLog();
    }
    /**
     * Clear restriction log
     */
    clearRestrictionLog() {
        this.restrictions.clearLog();
    }
    /**
     * Clear resolved approval requests
     */
    clearResolvedApprovals() {
        return this.approvalWorkflow.clearResolved();
    }
    /**
     * Update configuration
     */
    updateConfig(config) {
        this.config = { ...this.config, ...config };
        if (config.restrictions) {
            this.restrictions.updateConfig(config.restrictions);
        }
        if (config.approval) {
            this.approvalWorkflow.updateConfig(config.approval);
        }
    }
    /**
     * Enable the guard
     */
    enable() {
        this.config.enabled = true;
    }
    /**
     * Disable the guard
     */
    disable() {
        this.config.enabled = false;
    }
    /**
     * Check if the guard is enabled
     */
    isEnabled() {
        return this.config.enabled;
    }
}
exports.FlexibilityTokenGuard = FlexibilityTokenGuard;
//# sourceMappingURL=FlexibilityTokenGuard.js.map