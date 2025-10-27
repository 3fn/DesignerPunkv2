/**
 * Cross-Platform Validation Reporter
 *
 * Aggregates results from F1 validators (via MathematicalConsistencyValidator),
 * F2 token comparison (TokenComparator), and F2 interface validation
 * (InterfaceContractValidator) to create comprehensive validation reports.
 *
 * This is the main entry point for Task 8.4 - generating cross-platform
 * validation reports that combine mathematical + interface validation.
 *
 * Requirements: 7.4, 7.7
 * Dependencies: Tasks 8.1, 8.2, 8.3
 */
import { BuildMathematicalConsistencyResult } from './MathematicalConsistencyValidator';
import { BatchComparisonResult } from './TokenComparator';
import { InterfaceContractValidationResult } from './InterfaceContractValidator';
import { Platform } from '../types/Platform';
/**
 * Comprehensive cross-platform validation report
 *
 * Combines results from:
 * - Task 8.1: Mathematical consistency validation (F1 validators)
 * - Task 8.2: Token value comparison
 * - Task 8.3: Interface contract validation
 */
export interface CrossPlatformValidationReport {
    /** Overall validation status */
    valid: boolean;
    /** Report metadata */
    metadata: ValidationReportMetadata;
    /** Mathematical consistency results (from Task 8.1) */
    mathematicalConsistency: MathematicalConsistencySummary;
    /** Token comparison results (from Task 8.2) */
    tokenComparison: TokenComparisonSummary;
    /** Interface validation results (from Task 8.3) */
    interfaceValidation: InterfaceValidationSummary;
    /** Actionable recommendations */
    recommendations: RecommendationSection[];
    /** Executive summary */
    executiveSummary: ExecutiveSummary;
}
/**
 * Validation report metadata
 */
export interface ValidationReportMetadata {
    /** Report generation timestamp */
    timestamp: Date;
    /** Platforms validated */
    platforms: Platform[];
    /** Total validation duration (ms) */
    duration: number;
    /** Report version */
    version: string;
    /** Build configuration used */
    buildConfig?: string;
}
/**
 * Mathematical consistency summary
 */
export interface MathematicalConsistencySummary {
    /** Overall status */
    valid: boolean;
    /** Cross-platform consistency status */
    crossPlatformConsistency: {
        status: 'pass' | 'fail';
        summary: string;
        issueCount: number;
    };
    /** Mathematical relationships status */
    mathematicalRelationships: {
        status: 'pass' | 'fail';
        summary: string;
        passCount: number;
        warningCount: number;
        errorCount: number;
    };
    /** Strategic flexibility status */
    strategicFlexibility: {
        status: 'pass' | 'fail';
        summary: string;
        alignedCount: number;
        flexibilityCount: number;
    };
    /** Accessibility status */
    accessibility: {
        status: 'pass' | 'fail';
        contrastIssues: number;
        touchTargetIssues: number;
    };
    /** Key findings */
    keyFindings: string[];
}
/**
 * Token comparison summary
 */
export interface TokenComparisonSummary {
    /** Overall status */
    valid: boolean;
    /** Total tokens compared */
    totalTokens: number;
    /** Consistent tokens */
    consistentTokens: number;
    /** Inconsistent tokens */
    inconsistentTokens: number;
    /** Average consistency score */
    averageConsistencyScore: number;
    /** Breakdown by token type */
    byTokenType: {
        primitive: {
            total: number;
            consistent: number;
            percentage: number;
        };
        semantic: {
            total: number;
            consistent: number;
            percentage: number;
        };
        component: {
            total: number;
            consistent: number;
            percentage: number;
        };
    };
    /** Platform-specific issues */
    platformIssues: Record<Platform, number>;
    /** Common issues */
    commonIssues: string[];
    /** Key findings */
    keyFindings: string[];
}
/**
 * Interface validation summary
 */
export interface InterfaceValidationSummary {
    /** Overall status */
    valid: boolean;
    /** Components validated */
    componentsValidated: number;
    /** API differences found */
    apiDifferences: number;
    /** Breakdown by difference type */
    byDifferenceType: {
        method: number;
        property: number;
        event: number;
        state: number;
    };
    /** Affected files */
    affectedFiles: number;
    /** Key findings */
    keyFindings: string[];
}
/**
 * Recommendation section
 */
export interface RecommendationSection {
    /** Section title */
    title: string;
    /** Priority level */
    priority: 'critical' | 'high' | 'medium' | 'low';
    /** Recommendations */
    recommendations: Recommendation[];
}
/**
 * Individual recommendation
 */
export interface Recommendation {
    /** Recommendation description */
    description: string;
    /** Affected platforms */
    platforms?: Platform[];
    /** Affected components */
    components?: string[];
    /** Suggested action */
    action: string;
    /** Documentation links */
    documentation?: string[];
    /** Impact if not addressed */
    impact?: string;
}
/**
 * Executive summary
 */
export interface ExecutiveSummary {
    /** Overall validation status */
    overallStatus: 'pass' | 'fail' | 'warning';
    /** Total issues found */
    totalIssues: number;
    /** Critical issues */
    criticalIssues: number;
    /** Warnings */
    warnings: number;
    /** Success rate percentage */
    successRate: number;
    /** Top 3 issues */
    topIssues: string[];
    /** Next steps */
    nextSteps: string[];
}
/**
 * Cross-Platform Validation Reporter
 *
 * Main class for generating comprehensive validation reports
 */
export declare class CrossPlatformValidationReporter {
    /**
     * Generate comprehensive validation report
     *
     * Aggregates results from all three validation tasks:
     * - Task 8.1: Mathematical consistency (F1 validators)
     * - Task 8.2: Token comparison
     * - Task 8.3: Interface contract validation
     */
    generateReport(mathematicalResult: BuildMathematicalConsistencyResult, tokenComparisonResult: BatchComparisonResult, interfaceResults: InterfaceContractValidationResult[]): CrossPlatformValidationReport;
    /**
     * Summarize mathematical consistency results from Task 8.1
     */
    private summarizeMathematicalConsistency;
    /**
     * Summarize token comparison results from Task 8.2
     */
    private summarizeTokenComparison;
    /**
     * Summarize interface validation results from Task 8.3
     */
    private summarizeInterfaceValidation;
    /**
     * Generate actionable recommendations
     *
     * Adapts F1's suggestion format for build context
     */
    private generateRecommendations;
    /**
     * Generate critical recommendations
     */
    private generateCriticalRecommendations;
    /**
     * Generate high priority recommendations
     */
    private generateHighPriorityRecommendations;
    /**
     * Generate medium priority recommendations
     */
    private generateMediumPriorityRecommendations;
    /**
     * Generate low priority recommendations (optimizations)
     */
    private generateLowPriorityRecommendations;
    /**
     * Generate executive summary
     */
    private generateExecutiveSummary;
    /**
     * Format report as human-readable text
     */
    formatAsText(report: CrossPlatformValidationReport): string;
    /**
     * Format report as JSON
     */
    formatAsJSON(report: CrossPlatformValidationReport): string;
    /**
     * Format report as markdown
     */
    formatAsMarkdown(report: CrossPlatformValidationReport): string;
}
//# sourceMappingURL=CrossPlatformValidationReporter.d.ts.map