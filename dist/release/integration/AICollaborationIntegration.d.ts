/**
 * AI Collaboration Integration Implementation
 *
 * Provides clear interfaces for AI agents to interact with the release system
 * and supports the AI collaboration framework with systematic skepticism
 */
import { AICollaborationIntegration, ReleaseSystemStatus, ReleaseProgress, AIErrorGuidance, PermissionResult, DecisionContext, ReleaseOperation } from './WorkflowIntegration';
import { ReleaseSignal, ReleaseError } from '../types/ReleaseTypes';
import { ReleaseConfig } from '../config/ReleaseConfig';
export declare class AICollaborationManager implements AICollaborationIntegration {
    private config;
    private activeReleases;
    private systemStatus;
    constructor(config: ReleaseConfig);
    /**
     * Get release system status for AI agents
     */
    getReleaseSystemStatus(): Promise<ReleaseSystemStatus>;
    /**
     * Report release progress to AI collaboration framework
     */
    reportReleaseProgress(progress: ReleaseProgress): Promise<void>;
    /**
     * Get AI-friendly error messages and guidance
     */
    getAIFriendlyErrorGuidance(error: ReleaseError): Promise<AIErrorGuidance>;
    /**
     * Validate AI agent permissions for release operations
     */
    validateAIPermissions(operation: ReleaseOperation): Promise<PermissionResult>;
    /**
     * Get release decision context for AI agents
     */
    getReleaseDecisionContext(signal: ReleaseSignal): Promise<DecisionContext>;
    private initializeSystemStatus;
    private checkSystemOperational;
    private getPendingTriggers;
    private validateConfiguration;
    private checkIntegrationStatus;
    private generateSkepticalAnalysis;
    private generateErrorExplanation;
    private generateSuggestedActions;
    private generateRecoveryStrategies;
    private determineHumanInterventionRequired;
    private getRelevantDocumentationLinks;
    private generateSkepticalErrorAnalysis;
    private getBaseAIPermissions;
    private getOperationSpecificPermissions;
    private determinePermissionLevel;
    private gatherEvidence;
    private analyzeDecisionFactors;
    private calculateConfidenceMetrics;
    private generateAlternatives;
    private generateSkepticalDecisionFactors;
}
//# sourceMappingURL=AICollaborationIntegration.d.ts.map