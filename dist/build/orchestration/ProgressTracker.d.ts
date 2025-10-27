/**
 * Build Progress Tracker
 *
 * Tracks and reports build progress across multiple platforms,
 * providing real-time updates on build status, duration, and completion.
 * Supports both parallel and sequential build execution modes.
 */
import { Platform } from '../types/Platform';
import { BuildResult } from '../types/BuildResult';
/**
 * Build phase types
 */
export type BuildPhase = 'initializing' | 'building' | 'validating' | 'packaging' | 'complete' | 'failed';
/**
 * Platform build status
 */
export interface PlatformBuildStatus {
    /** Platform identifier */
    platform: Platform;
    /** Current build phase */
    phase: BuildPhase;
    /** Build start time */
    startTime?: Date;
    /** Build end time */
    endTime?: Date;
    /** Build duration in milliseconds */
    duration?: number;
    /** Build success status */
    success?: boolean;
    /** Current operation description */
    currentOperation?: string;
    /** Progress percentage (0-100) */
    progress: number;
}
/**
 * Overall build progress
 */
export interface BuildProgress {
    /** Overall build phase */
    phase: BuildPhase;
    /** Total number of platforms */
    totalPlatforms: number;
    /** Number of completed platforms */
    completedPlatforms: number;
    /** Number of failed platforms */
    failedPlatforms: number;
    /** Number of platforms currently building */
    activePlatforms: number;
    /** Overall progress percentage (0-100) */
    overallProgress: number;
    /** Build start time */
    startTime: Date;
    /** Build end time (if complete) */
    endTime?: Date;
    /** Total elapsed time in milliseconds */
    elapsedTime: number;
    /** Estimated time remaining in milliseconds (if available) */
    estimatedTimeRemaining?: number;
    /** Individual platform statuses */
    platformStatuses: Map<Platform, PlatformBuildStatus>;
    /** Current operation description */
    currentOperation: string;
}
/**
 * Progress update callback
 */
export type ProgressCallback = (progress: BuildProgress) => void;
/**
 * Build completion report
 */
export interface BuildCompletionReport {
    /** Overall build status */
    status: 'success' | 'failure' | 'partial';
    /** Total build duration in milliseconds */
    totalDuration: number;
    /** Build start time */
    startTime: Date;
    /** Build end time */
    endTime: Date;
    /** Number of successful builds */
    successCount: number;
    /** Number of failed builds */
    failureCount: number;
    /** Total number of platforms */
    totalPlatforms: number;
    /** Individual platform results */
    platformResults: BuildResult[];
    /** Average build time per platform in milliseconds */
    averageBuildTime: number;
    /** Fastest build time in milliseconds */
    fastestBuildTime: number;
    /** Slowest build time in milliseconds */
    slowestBuildTime: number;
    /** Summary message */
    summary: string;
}
/**
 * Progress tracker for build orchestration
 *
 * Tracks build progress across multiple platforms, providing real-time
 * updates and generating completion reports.
 */
export declare class ProgressTracker {
    private platforms;
    private platformStatuses;
    private startTime;
    private endTime?;
    private phase;
    private callbacks;
    private currentOperation;
    constructor(platforms: Platform[]);
    /**
     * Register a progress callback
     */
    onProgress(callback: ProgressCallback): void;
    /**
     * Start tracking a platform build
     */
    startPlatform(platform: Platform, operation?: string): void;
    /**
     * Update platform build progress
     */
    updatePlatform(platform: Platform, phase: BuildPhase, progress: number, operation?: string): void;
    /**
     * Complete a platform build
     */
    completePlatform(platform: Platform, result: BuildResult): void;
    /**
     * Update overall build phase
     */
    setPhase(phase: BuildPhase, operation?: string): void;
    /**
     * Mark build as complete
     */
    complete(): void;
    /**
     * Get current build progress
     */
    getProgress(): BuildProgress;
    /**
     * Generate build completion report
     */
    generateReport(results: BuildResult[]): BuildCompletionReport;
    /**
     * Format duration for display
     */
    static formatDuration(milliseconds: number): string;
    /**
     * Format progress report for display
     */
    static formatProgressReport(progress: BuildProgress): string;
    /**
     * Format completion report for display
     */
    static formatCompletionReport(report: BuildCompletionReport): string;
    /**
     * Calculate overall progress percentage
     */
    private calculateOverallProgress;
    /**
     * Estimate time remaining based on current progress
     */
    private estimateTimeRemaining;
    /**
     * Generate summary message
     */
    private generateSummaryMessage;
    /**
     * Notify all registered callbacks of progress update
     */
    private notifyProgress;
    /**
     * Get icon for build phase
     */
    private static getPhaseIcon;
    /**
     * Create progress bar visualization
     */
    private static createProgressBar;
}
//# sourceMappingURL=ProgressTracker.d.ts.map