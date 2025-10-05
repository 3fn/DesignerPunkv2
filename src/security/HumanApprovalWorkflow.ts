/**
 * Human Approval Workflow
 * 
 * Manages the human approval process for restricted AI agent actions.
 * Provides a workflow for requesting, tracking, and resolving approval requests.
 */

import type { PrimitiveToken } from '../types/PrimitiveToken';
import type { RestrictionContext } from './AIAgentRestrictions';

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
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
export class HumanApprovalWorkflow {
  private requests: Map<string, ApprovalRequest> = new Map();
  private config: HumanApprovalWorkflowConfig;
  private requestCounter = 0;

  constructor(config: Partial<HumanApprovalWorkflowConfig> = {}) {
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
  createRequest(
    token: PrimitiveToken,
    context: RestrictionContext,
    justification: string,
    alternatives: string[]
  ): ApprovalRequest {
    const id = this.generateRequestId();
    const createdAt = new Date();
    const expiresAt = this.config.enableExpiration
      ? new Date(createdAt.getTime() + this.config.expirationTime)
      : undefined;

    const request: ApprovalRequest = {
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
  approve(requestId: string, decision: ApprovalDecision): ApprovalRequest | null {
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
  reject(requestId: string, decision: ApprovalDecision): ApprovalRequest | null {
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
  getRequest(requestId: string): ApprovalRequest | undefined {
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
  getPendingRequests(): ApprovalRequest[] {
    const pending: ApprovalRequest[] = [];

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
  getRequestsByStatus(status: ApprovalStatus): ApprovalRequest[] {
    return Array.from(this.requests.values()).filter(
      request => request.status === status
    );
  }

  /**
   * Get all requests for a specific AI agent
   */
  getRequestsByAgent(agentIdentifier: string): ApprovalRequest[] {
    return Array.from(this.requests.values()).filter(
      request => request.context.identifier === agentIdentifier
    );
  }

  /**
   * Check if a request has expired
   */
  private isExpired(request: ApprovalRequest): boolean {
    if (!this.config.enableExpiration || !request.expiresAt) {
      return false;
    }

    return new Date() > request.expiresAt;
  }

  /**
   * Generate a unique request ID
   */
  private generateRequestId(): string {
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
  clearResolved(): number {
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
  clearAll(): void {
    this.requests.clear();
    this.requestCounter = 0;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<HumanApprovalWorkflowConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
