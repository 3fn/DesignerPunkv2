/**
 * Hook System Integration Implementation
 *
 * Integrates release management with existing commit and organization hooks
 */
import { HookSystemIntegration, CommitHookEvent, OrganizationHookEvent, MonitoringStatus } from './WorkflowIntegration';
import { ReleaseSignal, ValidationResult } from '../types/ReleaseTypes';
import { ReleaseConfig } from '../config/ReleaseConfig';
export declare class HookIntegrationManager implements HookSystemIntegration {
    private config;
    private projectRoot;
    private monitoringActive;
    private registeredHooks;
    constructor(config: ReleaseConfig, projectRoot?: string);
    /**
     * Register release detection with commit hooks
     */
    registerWithCommitHooks(): Promise<boolean>;
    /**
     * Register release detection with organization hooks
     */
    registerWithOrganizationHooks(): Promise<boolean>;
    /**
     * Process commit hook event for release detection
     */
    processCommitHookEvent(event: CommitHookEvent): Promise<ReleaseSignal | null>;
    /**
     * Process organization hook event for release detection
     */
    processOrganizationHookEvent(event: OrganizationHookEvent): Promise<ReleaseSignal | null>;
    /**
     * Validate hook integration status
     */
    validateHookIntegration(): Promise<ValidationResult>;
    /**
     * Get monitoring status
     */
    getMonitoringStatus(): MonitoringStatus;
    private fileExists;
    private updateCommitHookIntegration;
    private updateOrganizationHookIntegration;
    private isTaskCompletionCommit;
    private hasCompletionDocuments;
    private createTaskCompletionSignal;
    private createSpecCompletionSignal;
    private createOrganizationCompletionSignal;
    private determineAffectedPackages;
    private determineAffectedPackagesFromPaths;
}
//# sourceMappingURL=HookIntegration.d.ts.map