#!/usr/bin/env node
/**
 * Release Analysis CLI
 *
 * Command-line interface for the release analysis system.
 * Provides on-demand analysis of changes between releases with version bump recommendations.
 */
import { AnalysisResult as SharedAnalysisResult, AnalysisScope as SharedAnalysisScope, ExtractedChanges as SharedExtractedChanges, VersionRecommendation as SharedVersionRecommendation, ConfidenceMetrics as SharedConfidenceMetrics, CompletionDocument as SharedCompletionDocument, AnalysisOptions as SharedAnalysisOptions } from '../types/AnalysisTypes';
export type AnalysisOptions = SharedAnalysisOptions;
export type AnalysisResult = SharedAnalysisResult;
export type AnalysisScope = SharedAnalysisScope;
export type ExtractedChanges = SharedExtractedChanges;
export type VersionRecommendation = SharedVersionRecommendation;
export type ConfidenceMetrics = SharedConfidenceMetrics;
export type CompletionDocument = SharedCompletionDocument;
/**
 * Main CLI class for Release Analysis System
 */
export declare class ReleaseCLI {
    private configPath;
    private workingDirectory;
    constructor(workingDirectory?: string);
    /**
     * Analyze changes since last release or specified point
     */
    analyzeChanges(options?: AnalysisOptions): Promise<AnalysisResult>;
    /**
     * Display detailed analysis report
     */
    showDetailedReport(result: AnalysisResult): void;
    /**
     * Display summary analysis report
     */
    showSummaryReport(result: AnalysisResult): void;
    /**
     * Display JSON analysis report
     */
    showJSONReport(result: AnalysisResult): void;
    /**
     * Confirm version bump with user
     */
    confirmVersionBump(recommendation: VersionRecommendation): Promise<boolean>;
    /**
     * Save analysis results to file
     */
    saveAnalysis(result: AnalysisResult, filePath: string): Promise<void>;
    /**
     * Load configuration using the proper configuration manager with fallback
     */
    private loadConfiguration;
    /**
     * Create a minimal fallback configuration when all else fails
     */
    private createMinimalFallbackConfig;
    /**
     * Parse command line arguments
     */
    private parseArguments;
    /**
     * Main CLI entry point
     */
    run(args?: string[]): Promise<void>;
    /**
     * Find all completion documents in the repository with robust fallback
     */
    private findAllCompletionDocuments;
    /**
     * Perform simple document scanning as fallback
     */
    private performSimpleDocumentScan;
    /**
     * Get current version from package.json or Git tags with robust fallback
     */
    private getCurrentVersion;
    /**
     * Calculate confidence metrics for the analysis
     */
    private calculateConfidenceMetrics;
    /**
     * Perform basic extraction as fallback when main extraction fails
     */
    private performBasicExtraction;
    /**
     * Create a fallback result when analysis fails
     */
    private createFallbackResult;
    /**
     * Display help information
     */
    showHelp(): void;
}
declare function main(): Promise<void>;
export { main as runAnalysisCli };
//# sourceMappingURL=ReleaseCLI.d.ts.map