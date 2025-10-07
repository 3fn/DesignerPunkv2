/**
 * Build Progress Tracker
 * 
 * Tracks and reports build progress across multiple platforms,
 * providing real-time updates on build status, duration, and completion.
 * Supports both parallel and sequential build execution modes.
 */

import { Platform, PLATFORM_METADATA } from '../types/Platform';
import { BuildResult } from '../types/BuildResult';

/**
 * Build phase types
 */
export type BuildPhase = 
  | 'initializing'
  | 'building'
  | 'validating'
  | 'packaging'
  | 'complete'
  | 'failed';

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
export class ProgressTracker {
  private platforms: Platform[];
  private platformStatuses: Map<Platform, PlatformBuildStatus>;
  private startTime: Date;
  private endTime?: Date;
  private phase: BuildPhase;
  private callbacks: ProgressCallback[];
  private currentOperation: string;

  constructor(platforms: Platform[]) {
    this.platforms = platforms;
    this.platformStatuses = new Map();
    this.startTime = new Date();
    this.phase = 'initializing';
    this.callbacks = [];
    this.currentOperation = 'Initializing build process';

    // Initialize platform statuses
    platforms.forEach(platform => {
      this.platformStatuses.set(platform, {
        platform,
        phase: 'initializing',
        progress: 0,
      });
    });
  }

  /**
   * Register a progress callback
   */
  onProgress(callback: ProgressCallback): void {
    this.callbacks.push(callback);
  }

  /**
   * Start tracking a platform build
   */
  startPlatform(platform: Platform, operation?: string): void {
    const status = this.platformStatuses.get(platform);
    if (!status) {
      throw new Error(`Platform ${platform} not found in tracker`);
    }

    status.phase = 'building';
    status.startTime = new Date();
    status.currentOperation = operation || `Building ${PLATFORM_METADATA[platform].displayName}`;
    status.progress = 0;

    this.platformStatuses.set(platform, status);
    this.notifyProgress();
  }

  /**
   * Update platform build progress
   */
  updatePlatform(
    platform: Platform,
    phase: BuildPhase,
    progress: number,
    operation?: string
  ): void {
    const status = this.platformStatuses.get(platform);
    if (!status) {
      throw new Error(`Platform ${platform} not found in tracker`);
    }

    status.phase = phase;
    status.progress = Math.min(100, Math.max(0, progress));
    if (operation) {
      status.currentOperation = operation;
    }

    this.platformStatuses.set(platform, status);
    this.notifyProgress();
  }

  /**
   * Complete a platform build
   */
  completePlatform(platform: Platform, result: BuildResult): void {
    const status = this.platformStatuses.get(platform);
    if (!status) {
      throw new Error(`Platform ${platform} not found in tracker`);
    }

    status.phase = result.success ? 'complete' : 'failed';
    status.endTime = new Date();
    status.duration = result.duration;
    status.success = result.success;
    status.progress = 100;
    status.currentOperation = result.success 
      ? `${PLATFORM_METADATA[platform].displayName} build complete`
      : `${PLATFORM_METADATA[platform].displayName} build failed`;

    this.platformStatuses.set(platform, status);
    this.notifyProgress();
  }

  /**
   * Update overall build phase
   */
  setPhase(phase: BuildPhase, operation?: string): void {
    this.phase = phase;
    if (operation) {
      this.currentOperation = operation;
    }
    this.notifyProgress();
  }

  /**
   * Mark build as complete
   */
  complete(): void {
    this.endTime = new Date();
    
    // Determine overall phase based on results
    const statuses = Array.from(this.platformStatuses.values());
    const allComplete = statuses.every(s => s.phase === 'complete');
    const anyFailed = statuses.some(s => s.phase === 'failed');
    
    if (allComplete) {
      this.phase = 'complete';
      this.currentOperation = 'All builds completed successfully';
    } else if (anyFailed) {
      this.phase = 'failed';
      this.currentOperation = 'Build completed with failures';
    } else {
      this.phase = 'complete';
      this.currentOperation = 'Build completed';
    }
    
    this.notifyProgress();
  }

  /**
   * Get current build progress
   */
  getProgress(): BuildProgress {
    const statuses = Array.from(this.platformStatuses.values());
    const completedPlatforms = statuses.filter(
      s => s.phase === 'complete' || s.phase === 'failed'
    ).length;
    const failedPlatforms = statuses.filter(s => s.phase === 'failed').length;
    const activePlatforms = statuses.filter(
      s => s.phase === 'building' || s.phase === 'validating' || s.phase === 'packaging'
    ).length;

    const overallProgress = this.calculateOverallProgress(statuses);
    const elapsedTime = Date.now() - this.startTime.getTime();
    const estimatedTimeRemaining = this.estimateTimeRemaining(
      completedPlatforms,
      elapsedTime
    );

    return {
      phase: this.phase,
      totalPlatforms: this.platforms.length,
      completedPlatforms,
      failedPlatforms,
      activePlatforms,
      overallProgress,
      startTime: this.startTime,
      endTime: this.endTime,
      elapsedTime,
      estimatedTimeRemaining,
      platformStatuses: new Map(this.platformStatuses),
      currentOperation: this.currentOperation,
    };
  }

  /**
   * Generate build completion report
   */
  generateReport(results: BuildResult[]): BuildCompletionReport {
    const endTime = this.endTime || new Date();
    const totalDuration = endTime.getTime() - this.startTime.getTime();
    
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    // Calculate build time statistics
    const buildTimes = results
      .filter(r => r.duration > 0)
      .map(r => r.duration);
    
    const averageBuildTime = buildTimes.length > 0
      ? buildTimes.reduce((sum, time) => sum + time, 0) / buildTimes.length
      : 0;
    
    const fastestBuildTime = buildTimes.length > 0
      ? Math.min(...buildTimes)
      : 0;
    
    const slowestBuildTime = buildTimes.length > 0
      ? Math.max(...buildTimes)
      : 0;
    
    // Determine overall status
    let status: 'success' | 'failure' | 'partial';
    if (failureCount === 0) {
      status = 'success';
    } else if (successCount === 0) {
      status = 'failure';
    } else {
      status = 'partial';
    }
    
    // Generate summary message
    const summary = this.generateSummaryMessage(
      status,
      successCount,
      failureCount,
      this.platforms.length,
      totalDuration
    );

    return {
      status,
      totalDuration,
      startTime: this.startTime,
      endTime,
      successCount,
      failureCount,
      totalPlatforms: this.platforms.length,
      platformResults: results,
      averageBuildTime,
      fastestBuildTime,
      slowestBuildTime,
      summary,
    };
  }

  /**
   * Format duration for display
   */
  static formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      const remainingMinutes = minutes % 60;
      const remainingSeconds = seconds % 60;
      return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Format progress report for display
   */
  static formatProgressReport(progress: BuildProgress): string {
    const lines: string[] = [];
    
    lines.push(`Build Progress: ${progress.overallProgress}%`);
    lines.push(`Phase: ${progress.phase}`);
    lines.push(`Operation: ${progress.currentOperation}`);
    lines.push(`Elapsed: ${ProgressTracker.formatDuration(progress.elapsedTime)}`);
    
    if (progress.estimatedTimeRemaining !== undefined) {
      lines.push(`Estimated remaining: ${ProgressTracker.formatDuration(progress.estimatedTimeRemaining)}`);
    }
    
    lines.push('');
    lines.push(`Platforms: ${progress.completedPlatforms}/${progress.totalPlatforms} complete`);
    
    if (progress.failedPlatforms > 0) {
      lines.push(`Failed: ${progress.failedPlatforms}`);
    }
    
    if (progress.activePlatforms > 0) {
      lines.push(`Active: ${progress.activePlatforms}`);
    }
    
    // Show individual platform statuses
    lines.push('');
    lines.push('Platform Status:');
    progress.platformStatuses.forEach((status, platform) => {
      const displayName = PLATFORM_METADATA[platform].displayName;
      const phaseIcon = this.getPhaseIcon(status.phase);
      const progressBar = this.createProgressBar(status.progress, 20);
      
      lines.push(`  ${phaseIcon} ${displayName}: ${progressBar} ${status.progress}%`);
      
      if (status.currentOperation) {
        lines.push(`     ${status.currentOperation}`);
      }
    });
    
    return lines.join('\n');
  }

  /**
   * Format completion report for display
   */
  static formatCompletionReport(report: BuildCompletionReport): string {
    const lines: string[] = [];
    
    lines.push('='.repeat(60));
    lines.push('Build Completion Report');
    lines.push('='.repeat(60));
    lines.push('');
    
    // Overall status
    const statusIcon = report.status === 'success' ? '✓' : 
                       report.status === 'failure' ? '✗' : '⚠';
    lines.push(`Status: ${statusIcon} ${report.status.toUpperCase()}`);
    lines.push(`Duration: ${ProgressTracker.formatDuration(report.totalDuration)}`);
    lines.push('');
    
    // Summary
    lines.push(report.summary);
    lines.push('');
    
    // Platform results
    lines.push('Platform Results:');
    report.platformResults.forEach(result => {
      const displayName = PLATFORM_METADATA[result.platform].displayName;
      const icon = result.success ? '✓' : '✗';
      const duration = ProgressTracker.formatDuration(result.duration);
      
      lines.push(`  ${icon} ${displayName}: ${duration}`);
      
      if (result.warnings.length > 0) {
        lines.push(`     Warnings: ${result.warnings.length}`);
      }
      
      if (result.errors.length > 0) {
        lines.push(`     Errors: ${result.errors.length}`);
      }
    });
    
    // Build time statistics
    if (report.platformResults.length > 1) {
      lines.push('');
      lines.push('Build Time Statistics:');
      lines.push(`  Average: ${ProgressTracker.formatDuration(report.averageBuildTime)}`);
      lines.push(`  Fastest: ${ProgressTracker.formatDuration(report.fastestBuildTime)}`);
      lines.push(`  Slowest: ${ProgressTracker.formatDuration(report.slowestBuildTime)}`);
    }
    
    lines.push('');
    lines.push('='.repeat(60));
    
    return lines.join('\n');
  }

  // Private helper methods

  /**
   * Calculate overall progress percentage
   */
  private calculateOverallProgress(statuses: PlatformBuildStatus[]): number {
    if (statuses.length === 0) return 0;
    
    const totalProgress = statuses.reduce((sum, status) => sum + status.progress, 0);
    return Math.round(totalProgress / statuses.length);
  }

  /**
   * Estimate time remaining based on current progress
   */
  private estimateTimeRemaining(
    completedPlatforms: number,
    elapsedTime: number
  ): number | undefined {
    if (completedPlatforms === 0) return undefined;
    
    const averageTimePerPlatform = elapsedTime / completedPlatforms;
    const remainingPlatforms = this.platforms.length - completedPlatforms;
    
    return Math.round(averageTimePerPlatform * remainingPlatforms);
  }

  /**
   * Generate summary message
   */
  private generateSummaryMessage(
    status: 'success' | 'failure' | 'partial',
    successCount: number,
    failureCount: number,
    totalPlatforms: number,
    totalDuration: number
  ): string {
    const duration = ProgressTracker.formatDuration(totalDuration);
    
    if (status === 'success') {
      return `Successfully built ${successCount} platform${successCount !== 1 ? 's' : ''} in ${duration}`;
    } else if (status === 'failure') {
      return `All ${totalPlatforms} platform builds failed in ${duration}`;
    } else {
      return `Built ${successCount} of ${totalPlatforms} platforms successfully in ${duration} (${failureCount} failed)`;
    }
  }

  /**
   * Notify all registered callbacks of progress update
   */
  private notifyProgress(): void {
    const progress = this.getProgress();
    this.callbacks.forEach(callback => {
      try {
        callback(progress);
      } catch (error) {
        // Ignore callback errors to prevent disrupting build process
        console.error('Progress callback error:', error);
      }
    });
  }

  /**
   * Get icon for build phase
   */
  private static getPhaseIcon(phase: BuildPhase): string {
    switch (phase) {
      case 'initializing': return '⏳';
      case 'building': return '🔨';
      case 'validating': return '🔍';
      case 'packaging': return '📦';
      case 'complete': return '✓';
      case 'failed': return '✗';
      default: return '•';
    }
  }

  /**
   * Create progress bar visualization
   */
  private static createProgressBar(progress: number, width: number): string {
    const filled = Math.round((progress / 100) * width);
    const empty = width - filled;
    return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
  }
}
