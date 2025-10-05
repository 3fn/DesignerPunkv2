/**
 * Flexibility Token Guard
 * 
 * Integrates AI agent restrictions with the token registration workflow.
 * Provides a unified interface for protecting strategic flexibility tokens
 * and managing the approval process.
 */

import type { PrimitiveToken } from '../types/PrimitiveToken';
import type { ValidationResult } from '../types/ValidationResult';
import { AIAgentRestrictions, type RestrictionContext, type RestrictionResult } from './AIAgentRestrictions';
import { HumanApprovalWorkflow, type ApprovalRequest, type ApprovalDecision, ApprovalStatus } from './HumanApprovalWorkflow';

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
export class FlexibilityTokenGuard {
  private restrictions: AIAgentRestrictions;
  private approvalWorkflow: HumanApprovalWorkflow;
  private config: FlexibilityTokenGuardConfig;

  constructor(config: Partial<FlexibilityTokenGuardConfig> = {}) {
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

    this.restrictions = new AIAgentRestrictions(this.config.restrictions);
    this.approvalWorkflow = new HumanApprovalWorkflow(this.config.approval);
  }

  /**
   * Guard a token registration action
   */
  guard(token: PrimitiveToken, context: RestrictionContext): GuardResult {
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
      const approvalRequest = this.approvalWorkflow.createRequest(
        token,
        context,
        restrictionResult.reason,
        restrictionResult.alternatives || []
      );

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
  approve(requestId: string, approvedBy: string, notes?: string): ApprovalRequest | null {
    const decision: ApprovalDecision = {
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
  reject(requestId: string, rejectedBy: string, notes?: string): ApprovalRequest | null {
    const decision: ApprovalDecision = {
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
  getApprovalRequest(requestId: string): ApprovalRequest | undefined {
    return this.approvalWorkflow.getRequest(requestId);
  }

  /**
   * Get all pending approval requests
   */
  getPendingApprovals(): ApprovalRequest[] {
    return this.approvalWorkflow.getPendingRequests();
  }

  /**
   * Get all approval requests for a specific agent
   */
  getAgentApprovals(agentIdentifier: string): ApprovalRequest[] {
    return this.approvalWorkflow.getRequestsByAgent(agentIdentifier);
  }

  /**
   * Check if a token registration would be allowed
   */
  wouldAllow(token: PrimitiveToken, context: RestrictionContext): boolean {
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
  clearRestrictionLog(): void {
    this.restrictions.clearLog();
  }

  /**
   * Clear resolved approval requests
   */
  clearResolvedApprovals(): number {
    return this.approvalWorkflow.clearResolved();
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<FlexibilityTokenGuardConfig>): void {
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
  enable(): void {
    this.config.enabled = true;
  }

  /**
   * Disable the guard
   */
  disable(): void {
    this.config.enabled = false;
  }

  /**
   * Check if the guard is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }
}
