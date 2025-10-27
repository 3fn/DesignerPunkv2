/**
 * Workflow Event Detector
 *
 * Integrates the WorkflowMonitor with the existing hook system and provides
 * a bridge between shell-based hooks and TypeScript release detection system.
 * Handles event detection, queuing, and processing coordination.
 */
import { WorkflowEvent } from '../detection/WorkflowMonitor';
import { DetectionConfig } from '../config/ReleaseConfig';
import { ReleaseSignal } from '../types/ReleaseTypes';
export interface EventDetectorOptions {
    enableAutoProcessing: boolean;
    processingDelay: number;
    maxRetries: number;
    retryDelay: number;
}
export interface ProcessingResult {
    event: WorkflowEvent;
    releaseSignal: ReleaseSignal | null;
    processed: boolean;
    error?: Error;
    retryCount: number;
}
export declare class WorkflowEventDetector {
    private monitor;
    private detector;
    private config;
    private options;
    private processingResults;
    private isProcessing;
    constructor(config: DetectionConfig, options?: Partial<EventDetectorOptions>);
    /**
     * Start the workflow event detection system
     */
    start(): Promise<void>;
    /**
     * Stop the workflow event detection system
     */
    stop(): Promise<void>;
    /**
     * Manually process a specific event
     */
    processEvent(event: WorkflowEvent): Promise<ProcessingResult>;
    /**
     * Get processing results for analysis
     */
    getProcessingResults(): ProcessingResult[];
    /**
     * Manually trigger a workflow event (delegates to WorkflowMonitor)
     */
    triggerEvent(type: WorkflowEvent['type'], source: string, metadata?: Record<string, any>): Promise<void>;
    /**
     * Get current system status
     */
    getStatus(): {
        monitoring: boolean;
        processing: boolean;
        queueStatus: any;
        resultsCount: number;
        recentEvents: WorkflowEvent[];
    };
    /**
     * Integrate with existing hook system by processing trigger files
     */
    processHookTriggers(triggersPath?: string): Promise<ProcessingResult[]>;
    /**
     * Create a CLI interface for manual event processing
     */
    processCliCommand(command: string, args: string[]): Promise<void>;
    private setupEventHandling;
    private startAutoProcessing;
    private generateEventId;
    private mapTriggerType;
    private showStatus;
    private processTriggersCommand;
    private startMonitoringCommand;
    private stopMonitoringCommand;
    private showHelp;
}
//# sourceMappingURL=WorkflowEventDetector.d.ts.map