import { EventEmitter } from 'events';
/**
 * Progress reporting configuration
 */
export interface ProgressReportingConfig {
    enableConsoleOutput: boolean;
    enableDetailedLogging: boolean;
    updateInterval: number;
    showEstimatedTime: boolean;
    showProcessingRate: boolean;
    showMemoryUsage: boolean;
    enableProgressBar: boolean;
    progressBarWidth: number;
}
/**
 * Analysis phase information
 */
export interface AnalysisPhase {
    name: string;
    description: string;
    estimatedDuration?: number;
    weight: number;
}
/**
 * Detailed progress information
 */
export interface DetailedProgress {
    phase: AnalysisPhase;
    phaseProgress: number;
    overallProgress: number;
    currentOperation: string;
    itemsProcessed: number;
    totalItems: number;
    processingRate: number;
    estimatedTimeRemaining: number;
    memoryUsage?: {
        used: number;
        total: number;
        percentage: number;
    };
    errors: number;
    warnings: number;
    startTime: number;
    elapsedTime: number;
}
/**
 * Progress milestone for tracking major operations
 */
export interface ProgressMilestone {
    name: string;
    timestamp: number;
    phase: string;
    progress: number;
    metadata?: Record<string, any>;
}
/**
 * Progress Reporter for long-running release analysis operations
 *
 * Provides comprehensive progress reporting with console output, detailed logging,
 * and performance metrics for large repository analysis operations.
 *
 * Requirements addressed:
 * - 5.4: Add progress reporting for long-running analysis
 */
export declare class ProgressReporter extends EventEmitter {
    private config;
    private phases;
    private currentPhaseIndex;
    private startTime;
    private lastUpdateTime;
    private milestones;
    private phaseStartTimes;
    private phaseProgress;
    constructor(config?: Partial<ProgressReportingConfig>);
    /**
     * Initialize progress reporting with analysis phases
     * Requirement 5.4: Progress reporting for long-running analysis
     */
    initializePhases(phases: AnalysisPhase[]): void;
    /**
     * Start a new analysis phase
     * Requirement 5.4: Progress reporting with phase tracking
     */
    startPhase(phaseName: string, description?: string): void;
    /**
     * Update progress for current phase
     * Requirement 5.4: Real-time progress updates
     */
    updateProgress(itemsProcessed: number, totalItems: number, currentOperation?: string, metadata?: Record<string, any>): void;
    /**
     * Complete current phase
     * Requirement 5.4: Phase completion tracking
     */
    completePhase(phaseName?: string, summary?: string): void;
    /**
     * Complete entire analysis
     * Requirement 5.4: Analysis completion reporting
     */
    completeAnalysis(summary?: string): void;
    /**
     * Report error during analysis
     * Requirement 5.4: Error reporting in progress updates
     */
    reportError(error: Error, phase?: string, operation?: string): void;
    /**
     * Report warning during analysis
     * Requirement 5.4: Warning reporting in progress updates
     */
    reportWarning(message: string, phase?: string, operation?: string): void;
    /**
     * Update console output with progress information
     */
    private updateConsoleOutput;
    /**
     * Create ASCII progress bar
     */
    private createProgressBar;
    /**
     * Calculate overall progress across all phases
     */
    private calculateOverallProgress;
    /**
     * Estimate remaining time based on current progress
     */
    private estimateRemainingTime;
    /**
     * Add milestone to tracking
     */
    private addMilestone;
    /**
     * Format duration in human-readable format
     */
    private formatDuration;
    /**
     * Get progress summary
     */
    getProgressSummary(): {
        overallProgress: number;
        currentPhase: string;
        elapsedTime: number;
        estimatedTimeRemaining: number;
        milestonesCount: number;
        phasesCompleted: number;
    };
    /**
     * Get all milestones
     */
    getMilestones(): ProgressMilestone[];
    /**
     * Reset progress reporter
     */
    reset(): void;
}
//# sourceMappingURL=ProgressReporter.d.ts.map