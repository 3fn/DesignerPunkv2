/**
 * Release Analysis Integration
 * 
 * Provides a clean, unified interface for the automation layer to consume
 * release analysis results from the CLI. This interface abstracts away the
 * complexity of CLI execution, JSON parsing, and error handling.
 * 
 * Design Principles:
 * - Simple, intuitive API for automation layer
 * - Comprehensive error handling with clear messages
 * - Convenience methods for common queries
 * - Type-safe access to analysis results
 * 
 * Usage Example:
 * ```typescript
 * const integration = new ReleaseAnalysisIntegration();
 * 
 * // Execute analysis and get results
 * const result = await integration.analyze();
 * 
 * // Query results
 * if (result.hasBreakingChanges()) {
 *   console.log('Breaking changes detected!');
 *   console.log(result.getBreakingChanges());
 * }
 * 
 * // Get version recommendation
 * const version = result.getRecommendedVersion();
 * console.log(`Recommended version: ${version}`);
 * ```
 */

import { CLIBridge, CLIExecutionOptions, CLIExecutionResult } from './CLIBridge';
import { AnalysisResultParser, JSONParseError } from './AnalysisResultParser';
import { CLIErrorHandler, CLIError, CLIErrorCategory, RetryStrategy, FallbackOptions } from './CLIErrorHandler';
import {
  AnalysisResult,
  BreakingChange,
  Feature,
  BugFix,
  Improvement,
  DocumentationChange,
  VersionRecommendation,
  ConfidenceMetrics,
  ExtractedChanges
} from '../../release-analysis/types/AnalysisTypes';

/**
 * Integration options for release analysis
 */
export interface IntegrationOptions {
  /** Working directory for analysis */
  workingDirectory?: string;
  /** Timeout for CLI execution (default: 5 minutes) */
  timeout?: number;
  /** Retry strategy for transient failures */
  retryStrategy?: Partial<RetryStrategy>;
  /** Fallback options when CLI unavailable */
  fallbackOptions?: Partial<FallbackOptions>;
  /** Whether to validate results after parsing */
  validateResults?: boolean;
}

/**
 * Analysis query options
 */
export interface AnalysisQueryOptions {
  /** Analyze changes since this tag or commit */
  since?: string;
  /** Additional CLI arguments */
  args?: string[];
  /** Whether to skip user confirmation prompts */
  skipConfirmation?: boolean;
  /** Whether to run in dry-run mode */
  dryRun?: boolean;
}

/**
 * Wrapped analysis result with convenience methods
 */
export class AnalysisResultWrapper {
  constructor(
    private readonly result: AnalysisResult,
    private readonly executionMetadata: {
      duration: number;
      cliVersion?: string;
      timestamp: Date;
    }
  ) {}

  /**
   * Get the raw analysis result
   */
  getRawResult(): AnalysisResult {
    return this.result;
  }

  /**
   * Get execution metadata
   */
  getMetadata() {
    return this.executionMetadata;
  }

  // Version Information

  /**
   * Get current version
   */
  getCurrentVersion(): string {
    return this.result.versionRecommendation.currentVersion;
  }

  /**
   * Get recommended version
   */
  getRecommendedVersion(): string {
    return this.result.versionRecommendation.recommendedVersion;
  }

  /**
   * Get version bump type
   */
  getBumpType(): 'major' | 'minor' | 'patch' | 'none' {
    return this.result.versionRecommendation.bumpType;
  }

  /**
   * Get version recommendation rationale
   */
  getVersionRationale(): string {
    return this.result.versionRecommendation.rationale;
  }

  /**
   * Check if version bump is recommended
   */
  shouldBumpVersion(): boolean {
    return this.result.versionRecommendation.bumpType !== 'none';
  }

  /**
   * Check if major version bump is recommended
   */
  isMajorBump(): boolean {
    return this.result.versionRecommendation.bumpType === 'major';
  }

  /**
   * Check if minor version bump is recommended
   */
  isMinorBump(): boolean {
    return this.result.versionRecommendation.bumpType === 'minor';
  }

  /**
   * Check if patch version bump is recommended
   */
  isPatchBump(): boolean {
    return this.result.versionRecommendation.bumpType === 'patch';
  }

  // Change Queries

  /**
   * Get all breaking changes
   */
  getBreakingChanges(): BreakingChange[] {
    return this.result.changes.breakingChanges;
  }

  /**
   * Get all new features
   */
  getFeatures(): Feature[] {
    return this.result.changes.newFeatures;
  }

  /**
   * Get all bug fixes
   */
  getBugFixes(): BugFix[] {
    return this.result.changes.bugFixes;
  }

  /**
   * Get all improvements
   */
  getImprovements(): Improvement[] {
    return this.result.changes.improvements;
  }

  /**
   * Get all documentation changes
   */
  getDocumentationChanges(): DocumentationChange[] {
    return this.result.changes.documentation;
  }

  /**
   * Get all changes (combined)
   */
  getAllChanges(): ExtractedChanges {
    return this.result.changes;
  }

  /**
   * Check if there are any breaking changes
   */
  hasBreakingChanges(): boolean {
    return this.result.changes.breakingChanges.length > 0;
  }

  /**
   * Check if there are any new features
   */
  hasFeatures(): boolean {
    return this.result.changes.newFeatures.length > 0;
  }

  /**
   * Check if there are any bug fixes
   */
  hasBugFixes(): boolean {
    return this.result.changes.bugFixes.length > 0;
  }

  /**
   * Check if there are any improvements
   */
  hasImprovements(): boolean {
    return this.result.changes.improvements.length > 0;
  }

  /**
   * Check if there are any changes at all
   */
  hasChanges(): boolean {
    return this.hasBreakingChanges() ||
           this.hasFeatures() ||
           this.hasBugFixes() ||
           this.hasImprovements();
  }

  /**
   * Get total change count (excludes documentation changes)
   */
  getChangeCount(): number {
    return this.result.changes.breakingChanges.length +
           this.result.changes.newFeatures.length +
           this.result.changes.bugFixes.length +
           this.result.changes.improvements.length +
           this.result.changes.documentation.length;
  }

  // Release Notes

  /**
   * Get formatted release notes
   */
  getReleaseNotes(): string {
    return this.result.releaseNotes;
  }

  /**
   * Check if release notes are available
   */
  hasReleaseNotes(): boolean {
    return this.result.releaseNotes.trim().length > 0;
  }

  // Confidence Metrics

  /**
   * Get overall confidence score
   */
  getOverallConfidence(): number {
    return this.result.confidence.overall;
  }

  /**
   * Get all confidence metrics
   */
  getConfidenceMetrics(): ConfidenceMetrics {
    return this.result.confidence;
  }

  /**
   * Check if confidence is above threshold
   */
  isConfident(threshold: number = 0.7): boolean {
    return this.result.confidence.overall >= threshold;
  }

  /**
   * Get confidence level description
   */
  getConfidenceLevel(): 'high' | 'medium' | 'low' {
    const confidence = this.result.confidence.overall;
    if (confidence >= 0.8) return 'high';
    if (confidence >= 0.5) return 'medium';
    return 'low';
  }

  // Analysis Scope

  /**
   * Get number of documents analyzed
   */
  getDocumentCount(): number {
    return this.result.changes.metadata.documentsAnalyzed;
  }

  /**
   * Get analysis scope information
   */
  getScope() {
    return this.result.scope;
  }

  /**
   * Get analysis date
   */
  getAnalysisDate(): Date {
    return this.result.scope.analysisDate;
  }

  // Filtering and Searching

  /**
   * Get breaking changes by severity
   */
  getBreakingChangesBySeverity(severity: 'low' | 'medium' | 'high' | 'critical'): BreakingChange[] {
    return this.result.changes.breakingChanges.filter(change => change.severity === severity);
  }

  /**
   * Get critical breaking changes
   */
  getCriticalBreakingChanges(): BreakingChange[] {
    return this.getBreakingChangesBySeverity('critical');
  }

  /**
   * Get features by category
   */
  getFeaturesByCategory(category: string): Feature[] {
    return this.result.changes.newFeatures.filter(feature => feature.category === category);
  }

  /**
   * Get bug fixes by severity
   */
  getBugFixesBySeverity(severity: 'low' | 'medium' | 'high' | 'critical'): BugFix[] {
    return this.result.changes.bugFixes.filter(fix => fix.severity === severity);
  }

  /**
   * Search changes by keyword
   */
  searchChanges(keyword: string): {
    breakingChanges: BreakingChange[];
    features: Feature[];
    bugFixes: BugFix[];
    improvements: Improvement[];
  } {
    const lowerKeyword = keyword.toLowerCase();

    return {
      breakingChanges: this.result.changes.breakingChanges.filter(change =>
        change.title.toLowerCase().includes(lowerKeyword) ||
        change.description.toLowerCase().includes(lowerKeyword)
      ),
      features: this.result.changes.newFeatures.filter(feature =>
        feature.title.toLowerCase().includes(lowerKeyword) ||
        feature.description.toLowerCase().includes(lowerKeyword)
      ),
      bugFixes: this.result.changes.bugFixes.filter(fix =>
        fix.title.toLowerCase().includes(lowerKeyword) ||
        fix.description.toLowerCase().includes(lowerKeyword)
      ),
      improvements: this.result.changes.improvements.filter(improvement =>
        improvement.title.toLowerCase().includes(lowerKeyword) ||
        improvement.description.toLowerCase().includes(lowerKeyword)
      )
    };
  }

  // Summary Methods

  /**
   * Get a summary of the analysis
   */
  getSummary(): {
    version: {
      current: string;
      recommended: string;
      bumpType: string;
    };
    changes: {
      breaking: number;
      features: number;
      fixes: number;
      improvements: number;
      total: number;
    };
    confidence: {
      overall: number;
      level: string;
    };
    metadata: {
      documentsAnalyzed: number;
      duration: number;
      timestamp: Date;
    };
  } {
    return {
      version: {
        current: this.getCurrentVersion(),
        recommended: this.getRecommendedVersion(),
        bumpType: this.getBumpType()
      },
      changes: {
        breaking: this.result.changes.breakingChanges.length,
        features: this.result.changes.newFeatures.length,
        fixes: this.result.changes.bugFixes.length,
        improvements: this.result.changes.improvements.length,
        total: this.getChangeCount()
      },
      confidence: {
        overall: this.getOverallConfidence(),
        level: this.getConfidenceLevel()
      },
      metadata: {
        documentsAnalyzed: this.getDocumentCount(),
        duration: this.executionMetadata.duration,
        timestamp: this.executionMetadata.timestamp
      }
    };
  }

  /**
   * Get a human-readable summary string
   */
  getSummaryString(): string {
    const summary = this.getSummary();
    const lines = [
      `Release Analysis Summary`,
      `========================`,
      ``,
      `Version: ${summary.version.current} → ${summary.version.recommended} (${summary.version.bumpType})`,
      ``,
      `Changes:`,
      `  - Breaking Changes: ${summary.changes.breaking}`,
      `  - New Features: ${summary.changes.features}`,
      `  - Bug Fixes: ${summary.changes.fixes}`,
      `  - Improvements: ${summary.changes.improvements}`,
      `  - Total: ${summary.changes.total}`,
      ``,
      `Confidence: ${(summary.confidence.overall * 100).toFixed(1)}% (${summary.confidence.level})`,
      `Documents Analyzed: ${summary.metadata.documentsAnalyzed}`,
      `Analysis Duration: ${summary.metadata.duration}ms`
    ];

    return lines.join('\n');
  }
}

/**
 * Release Analysis Integration
 * 
 * Main integration class that provides a clean interface for the automation
 * layer to execute release analysis and consume results.
 */
export class ReleaseAnalysisIntegration {
  private readonly cliBridge: CLIBridge;
  private readonly parser: AnalysisResultParser;
  private readonly errorHandler: CLIErrorHandler;
  private readonly options: IntegrationOptions;

  constructor(options: IntegrationOptions = {}) {
    this.cliBridge = new CLIBridge();
    this.parser = new AnalysisResultParser();
    this.errorHandler = new CLIErrorHandler();
    this.options = {
      validateResults: true,
      ...options
    };
  }

  /**
   * Execute release analysis and return wrapped results
   * 
   * This is the main method for the automation layer to get analysis results.
   * It handles CLI execution, JSON parsing, error handling, and result validation.
   * 
   * @param queryOptions - Options for the analysis query
   * @returns Wrapped analysis result with convenience methods
   * @throws CLIError if analysis fails
   */
  async analyze(queryOptions: AnalysisQueryOptions = {}): Promise<AnalysisResultWrapper> {
    const startTime = Date.now();

    // Build CLI execution options
    const executionOptions: CLIExecutionOptions = {
      workingDirectory: this.options.workingDirectory,
      timeout: this.options.timeout,
      args: this.buildCLIArgs(queryOptions)
    };

    // Execute with retry logic
    const executionResult = await this.errorHandler.executeWithRetry(
      () => this.cliBridge.executeForJSON(executionOptions),
      this.options.retryStrategy
    );

    // Validate execution succeeded
    this.errorHandler.validateResult(executionResult);

    // Parse JSON output
    let analysisResult: AnalysisResult;
    try {
      analysisResult = this.parser.parse(executionResult.stdout);
    } catch (error) {
      // Convert parse error to CLIError
      const cliError = this.errorHandler.createError(executionResult, error as Error);
      throw cliError;
    }

    // Validate parsed results if enabled
    if (this.options.validateResults) {
      const validation = this.parser.validate(analysisResult);
      if (!validation.valid) {
        const validationError = new CLIError(
          `Analysis result validation failed: ${validation.errors.join(', ')}`,
          CLIErrorCategory.PARSE_ERROR,
          undefined,
          executionResult,
          validation.errors
        );
        throw validationError;
      }

      // Log warnings if any
      if (validation.warnings.length > 0) {
        console.warn('Analysis validation warnings:');
        validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
      }
    }

    // Get CLI version if available
    const cliVersion = await this.cliBridge.getVersion(this.options.workingDirectory);

    // Wrap result with convenience methods
    return new AnalysisResultWrapper(analysisResult, {
      duration: executionResult.duration,
      cliVersion: cliVersion || undefined,
      timestamp: new Date()
    });
  }

  /**
   * Check if CLI is available
   * 
   * Useful for pre-flight checks before attempting analysis.
   * 
   * @returns Whether the CLI is available and functional
   */
  async isAvailable(): Promise<boolean> {
    return this.cliBridge.isAvailable(this.options.workingDirectory);
  }

  /**
   * Get CLI version
   * 
   * @returns CLI version string or null if unavailable
   */
  async getVersion(): Promise<string | null> {
    return this.cliBridge.getVersion(this.options.workingDirectory);
  }

  /**
   * Execute analysis in dry-run mode
   * 
   * Useful for testing without side effects.
   * 
   * @param queryOptions - Options for the analysis query
   * @returns Wrapped analysis result
   */
  async analyzeDryRun(queryOptions: AnalysisQueryOptions = {}): Promise<AnalysisResultWrapper> {
    return this.analyze({
      ...queryOptions,
      dryRun: true,
      skipConfirmation: true
    });
  }

  /**
   * Execute analysis for specific scope
   * 
   * Convenience method for analyzing changes since a specific tag or commit.
   * 
   * @param since - Tag or commit to analyze from
   * @param queryOptions - Additional query options
   * @returns Wrapped analysis result
   */
  async analyzeSince(since: string, queryOptions: AnalysisQueryOptions = {}): Promise<AnalysisResultWrapper> {
    return this.analyze({
      ...queryOptions,
      since
    });
  }

  /**
   * Build CLI arguments from query options
   */
  private buildCLIArgs(queryOptions: AnalysisQueryOptions): string[] {
    const args: string[] = [];

    if (queryOptions.since) {
      args.push('--since', queryOptions.since);
    }

    if (queryOptions.skipConfirmation) {
      args.push('--skip-confirmation');
    }

    if (queryOptions.dryRun) {
      args.push('--dry-run');
    }

    if (queryOptions.args) {
      args.push(...queryOptions.args);
    }

    return args;
  }

  /**
   * Handle CLI error with fallback mechanisms
   * 
   * This method is exposed for advanced error handling scenarios.
   * Most users should rely on the automatic error handling in analyze().
   * 
   * @param error - CLI error to handle
   */
  async handleError(error: CLIError): Promise<void> {
    return this.errorHandler.handleError(error, this.options.fallbackOptions);
  }

  /**
   * Force cleanup of any remaining resources
   * 
   * This method should be called in test teardown to ensure
   * all child processes are terminated and resources are released.
   * 
   * @returns Promise that resolves when cleanup is complete
   */
  async cleanup(): Promise<void> {
    await this.cliBridge.forceCleanup();
  }
}
