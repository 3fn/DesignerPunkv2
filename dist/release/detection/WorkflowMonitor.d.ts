/**
 * Workflow Event Monitor
 *
 * Monitors workflow events and file system changes to detect release triggers.
 * Integrates with existing hook system to detect completion events and
 * provides event queuing and processing for release triggers.
 */
import { EventEmitter } from 'events';
import { DetectionConfig } from '../config/ReleaseConfig';
import { ReleaseSignal } from '../types/ReleaseTypes';
export interface WorkflowEvent {
    type: 'task-completion' | 'spec-completion' | 'file-change' | 'hook-trigger';
    source: string;
    timestamp: Date;
    metadata: Record<string, any>;
}
export interface MonitoringOptions {
    pollInterval: number;
    enableFileWatching: boolean;
    enableHookIntegration: boolean;
}
export interface EventQueue {
    events: WorkflowEvent[];
    processing: boolean;
    maxSize: number;
    processingDelay: number;
}
export declare class WorkflowMonitor extends EventEmitter {
    private config;
    private options;
    private isMonitoring;
    private monitoringInterval?;
    private lastCheckedFiles;
    private eventQueue;
    private processingTimer?;
    constructor(config: DetectionConfig, options?: Partial<MonitoringOptions>);
    /**
     * Start monitoring for workflow events
     */
    startMonitoring(): Promise<void>;
    /**
     * Stop monitoring for workflow events
     */
    stopMonitoring(): Promise<void>;
    /**
     * Check for new completion events
     */
    checkForCompletionEvents(): Promise<WorkflowEvent[]>;
    /**
     * Process a workflow event and determine if it should trigger a release
     */
    processWorkflowEvent(event: WorkflowEvent): Promise<ReleaseSignal | null>;
    /**
     * Manually trigger a workflow event (for testing or manual triggers)
     */
    triggerEvent(type: WorkflowEvent['type'], source: string, metadata?: Record<string, any>): Promise<void>;
    /**
     * Add event to processing queue
     */
    private queueEvent;
    /**
     * Set up event queue processing system
     */
    private setupEventQueueProcessing;
    /**
     * Start processing events from the queue
     */
    private startEventProcessing;
    /**
     * Process a single event from the queue
     */
    private processQueuedEvent;
    /**
     * Get current queue status
     */
    getQueueStatus(): {
        queueLength: number;
        processing: boolean;
        maxSize: number;
        processingDelay: number;
    };
    /**
     * Clear the event queue
     */
    clearQueue(): void;
    private initializeFileTracking;
    private startFilePolling;
    private setupHookIntegration;
    private watchTriggerFile;
    private watchTriggersDirectory;
    private setupExistingHookIntegration;
    private setupGitCommitMonitoring;
    private setupFileOrganizationMonitoring;
    private checkPath;
    private checkSinglePath;
    private expandGlobPath;
    private expandGlobParts;
    private matchesGlobPattern;
    private mapTriggerTypeToEventType;
    private determineEventType;
    private processTaskCompletion;
    private processSpecCompletion;
    private processFileChange;
    private processHookTrigger;
    private extractTaskName;
    private checkForCompletedTasks;
}
//# sourceMappingURL=WorkflowMonitor.d.ts.map