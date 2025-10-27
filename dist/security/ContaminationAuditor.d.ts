/**
 * Contamination Auditor
 *
 * Implements contamination auditing processes to identify and prevent
 * contamination vectors across the token system documentation and codebase.
 */
import { ContaminationVector } from './ContaminationPrevention';
export interface AuditTarget {
    path: string;
    type: 'documentation' | 'code' | 'configuration' | 'test';
    content: string;
}
export interface AuditResult {
    target: AuditTarget;
    passed: boolean;
    vectors: ContaminationVector[];
    severity: 'clean' | 'low' | 'medium' | 'high' | 'critical';
    recommendations: string[];
}
export interface AuditReport {
    timestamp: Date;
    totalTargets: number;
    passedTargets: number;
    failedTargets: number;
    results: AuditResult[];
    summary: AuditSummary;
    criticalIssues: AuditResult[];
}
export interface AuditSummary {
    overallStatus: 'clean' | 'issues-detected';
    totalVectors: number;
    vectorsByType: Record<string, number>;
    vectorsBySeverity: Record<string, number>;
    recommendations: string[];
}
export interface ContaminationAuditorConfig {
    auditDocumentation: boolean;
    auditCode: boolean;
    auditConfiguration: boolean;
    auditTests: boolean;
    strictMode: boolean;
    failOnCritical: boolean;
}
/**
 * ContaminationAuditor
 *
 * Audits the token system for contamination vectors and provides
 * comprehensive reporting and remediation guidance.
 */
export declare class ContaminationAuditor {
    private contaminationPrevention;
    private documentationGuard;
    private config;
    constructor(config?: Partial<ContaminationAuditorConfig>);
    /**
     * Audit a single target
     */
    auditTarget(target: AuditTarget): AuditResult;
    /**
     * Audit multiple targets
     */
    auditTargets(targets: AuditTarget[]): AuditReport;
    /**
     * Determine if target should be audited
     */
    private shouldAuditTarget;
    /**
     * Determine overall severity from vectors
     */
    private determineSeverity;
    /**
     * Generate recommendations for audit result
     */
    private generateRecommendations;
    /**
     * Generate audit summary
     */
    private generateSummary;
    /**
     * Format audit report as text
     */
    formatReport(report: AuditReport): string;
    /**
     * Check if audit passed
     */
    auditPassed(report: AuditReport): boolean;
    /**
     * Get configuration
     */
    getConfig(): ContaminationAuditorConfig;
    /**
     * Update configuration
     */
    updateConfig(updates: Partial<ContaminationAuditorConfig>): void;
}
//# sourceMappingURL=ContaminationAuditor.d.ts.map