/**
 * Build Orchestrator Implementation
 *
 * Main orchestrator for coordinating platform-specific builds.
 * Manages configuration validation, platform selection, build execution,
 * and status tracking.
 */
import { BuildOrchestrator as IBuildOrchestrator, BuildStatus, ValidationResult } from './types/BuildOrchestrator';
import { BuildConfig } from './types/BuildConfig';
import { BuildResult, BuildResultSummary } from './types/BuildResult';
import { Platform } from './types/Platform';
/**
 * Build orchestrator implementation
 *
 * Coordinates the entire build process across multiple platforms,
 * managing configuration, execution, and validation.
 */
export declare class BuildOrchestrator implements IBuildOrchestrator {
    private config;
    private status;
    private results;
    private cancelled;
    private tokenGenerator;
    constructor();
    /**
     * Configure the build system with specified options
     */
    configure(config: BuildConfig): void;
    /**
     * Execute builds for specified platforms
     */
    build(platforms: Platform[]): Promise<BuildResult[]>;
    /**
     * Validate build configuration
     */
    validateConfig(config: BuildConfig): ValidationResult;
    /**
     * Get current build status and progress
     */
    getStatus(): BuildStatus;
    /**
     * Get aggregated build results summary
     */
    getSummary(): BuildResultSummary | null;
    /**
     * Cancel ongoing build process
     */
    cancel(): Promise<void>;
    /**
     * Reset orchestrator state
     */
    reset(): void;
    /**
     * Create initial build status
     */
    private createInitialStatus;
    /**
     * Build platforms in parallel
     */
    private buildParallel;
    /**
     * Build platforms sequentially
     */
    private buildSequential;
    /**
     * Build a single platform
     *
     * Generates platform-specific token files using TokenFileGenerator.
     * Includes all token categories including border width tokens.
     */
    private buildPlatform;
    /**
     * Create error result for failed build
     */
    private createErrorResult;
    /**
     * Validate iOS-specific options
     */
    private validateiOSOptions;
    /**
     * Validate Android-specific options
     */
    private validateAndroidOptions;
    /**
     * Validate Web-specific options
     */
    private validateWebOptions;
}
//# sourceMappingURL=BuildOrchestrator.d.ts.map