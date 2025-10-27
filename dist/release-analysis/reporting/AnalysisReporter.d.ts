/**
 * Analysis Reporter for Release Analysis System
 *
 * Presents analysis results to users in various formats and handles result persistence.
 * Supports summary, detailed, and JSON report formats with configurable output options.
 */
import { ExtractedChanges } from '../types/AnalysisTypes';
import { VersionRecommendation } from '../versioning/VersionCalculator';
export interface AnalysisResult {
    scope: AnalysisScope;
    changes: ExtractedChanges;
    versionRecommendation: VersionRecommendation;
    releaseNotes: string;
    confidence: ConfidenceMetrics;
    metadata?: AnalysisMetadata;
}
export interface AnalysisScope {
    fromTag?: string;
    fromCommit?: string;
    toCommit: string;
    completionDocuments: CompletionDocument[];
    analysisDate: Date;
}
export interface CompletionDocument {
    path: string;
    content: string;
    lastModified: Date;
    gitCommit: string;
    metadata: DocumentMetadata;
}
export interface DocumentMetadata {
    title: string;
    date?: string;
    task?: string;
    spec?: string;
    status?: string;
    type: 'task-completion' | 'spec-completion' | 'other';
}
export interface ConfidenceMetrics {
    overall: number;
    extraction: number;
    versioning: number;
    completeness: number;
}
export interface AnalysisMetadata {
    generatedAt: Date;
    cliVersion: string;
    analysisId: string;
    processingTime?: number;
}
export interface ReportFormat {
    type: 'summary' | 'detailed' | 'json';
    includeMetadata: boolean;
    includeConfidence: boolean;
    includeEvidence: boolean;
    includeReleaseNotes?: boolean;
}
export interface ReportOptions {
    format: ReportFormat;
    colorOutput?: boolean;
    maxWidth?: number;
    includeTimestamp?: boolean;
}
/**
 * Main class for generating and managing analysis reports
 */
export declare class AnalysisReporter {
    private defaultFormat;
    /**
     * Generate summary report for CLI output
     */
    generateSummaryReport(result: AnalysisResult, options?: Partial<ReportOptions>): string;
    /**
     * Generate detailed report with full change breakdown
     */
    generateDetailedReport(result: AnalysisResult, options?: Partial<ReportOptions>): string;
    /**
     * Generate JSON report for programmatic consumption
     */
    generateJSONReport(result: AnalysisResult, options?: Partial<ReportOptions>): string;
    /**
     * Save report to file with specified format
     */
    saveReport(result: AnalysisResult, format: ReportFormat, filePath: string, options?: Partial<ReportOptions>): Promise<void>;
    /**
     * Format header with optional width constraint
     */
    private formatHeader;
    /**
     * Format version recommendation summary
     */
    private formatVersionSummary;
    /**
     * Format changes summary
     */
    private formatChangesSummary;
    /**
     * Format confidence summary
     */
    private formatConfidenceSummary;
    /**
     * Format quality indicators
     */
    private formatQualityIndicators;
    /**
     * Format analysis scope details
     */
    private formatAnalysisScope;
    /**
     * Format version details with rationale
     */
    private formatVersionDetails;
    /**
     * Format detailed changes breakdown
     */
    private formatChangesDetails;
    /**
     * Format evidence details
     */
    private formatEvidence;
    /**
     * Format confidence details
     */
    private formatConfidenceDetails;
    /**
     * Format release notes section
     */
    private formatReleaseNotesSection;
    /**
     * Format quality analysis
     */
    private formatQualityAnalysis;
    /**
     * Format metadata summary
     */
    private formatMetadataSummary;
    /**
     * Format metadata details
     */
    private formatMetadataDetails;
    /**
     * Merge report options with defaults
     */
    private mergeOptions;
}
//# sourceMappingURL=AnalysisReporter.d.ts.map