"use strict";
/**
 * Contamination Auditor
 *
 * Implements contamination auditing processes to identify and prevent
 * contamination vectors across the token system documentation and codebase.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContaminationAuditor = void 0;
const ContaminationPrevention_1 = require("./ContaminationPrevention");
const DocumentationGuard_1 = require("./DocumentationGuard");
/**
 * ContaminationAuditor
 *
 * Audits the token system for contamination vectors and provides
 * comprehensive reporting and remediation guidance.
 */
class ContaminationAuditor {
    constructor(config = {}) {
        this.config = {
            auditDocumentation: true,
            auditCode: false, // Code is expected to have implementation
            auditConfiguration: true,
            auditTests: false, // Tests are expected to have code
            strictMode: false,
            failOnCritical: true,
            ...config
        };
        this.contaminationPrevention = new ContaminationPrevention_1.ContaminationPrevention({
            strictMode: this.config.strictMode
        });
        this.documentationGuard = new DocumentationGuard_1.DocumentationGuard({
            strictConceptEnforcement: this.config.strictMode
        });
    }
    /**
     * Audit a single target
     */
    auditTarget(target) {
        let vectors = [];
        let passed = true;
        // Determine if target should be audited based on type
        const shouldAudit = this.shouldAuditTarget(target.type);
        if (shouldAudit) {
            const checkResult = this.contaminationPrevention.checkContent(target.content, target.type);
            vectors = checkResult.vectors;
            passed = checkResult.isClean;
            // Additional documentation-specific checks
            if (target.type === 'documentation') {
                const docValidation = this.documentationGuard.validateDocumentation(target.content, target.path);
                if (!docValidation.isValid) {
                    passed = false;
                    // Merge any additional vectors from documentation validation
                    vectors = [...vectors, ...docValidation.contaminationCheck.vectors];
                }
            }
        }
        const severity = this.determineSeverity(vectors);
        const recommendations = this.generateRecommendations(target, vectors);
        return {
            target,
            passed,
            vectors,
            severity,
            recommendations
        };
    }
    /**
     * Audit multiple targets
     */
    auditTargets(targets) {
        const results = [];
        for (const target of targets) {
            results.push(this.auditTarget(target));
        }
        const passedTargets = results.filter(r => r.passed).length;
        const failedTargets = results.length - passedTargets;
        const criticalIssues = results.filter(r => r.severity === 'critical' || r.severity === 'high');
        const summary = this.generateSummary(results);
        return {
            timestamp: new Date(),
            totalTargets: targets.length,
            passedTargets,
            failedTargets,
            results,
            summary,
            criticalIssues
        };
    }
    /**
     * Determine if target should be audited
     */
    shouldAuditTarget(type) {
        switch (type) {
            case 'documentation':
                return this.config.auditDocumentation;
            case 'code':
                return this.config.auditCode;
            case 'configuration':
                return this.config.auditConfiguration;
            case 'test':
                return this.config.auditTests;
            default:
                return false;
        }
    }
    /**
     * Determine overall severity from vectors
     */
    determineSeverity(vectors) {
        if (vectors.length === 0) {
            return 'clean';
        }
        const hasCritical = vectors.some(v => v.severity === 'critical');
        const hasHigh = vectors.some(v => v.severity === 'high');
        const hasMedium = vectors.some(v => v.severity === 'medium');
        if (hasCritical)
            return 'critical';
        if (hasHigh)
            return 'high';
        if (hasMedium)
            return 'medium';
        return 'low';
    }
    /**
     * Generate recommendations for audit result
     */
    generateRecommendations(target, vectors) {
        const recommendations = [];
        if (vectors.length === 0) {
            recommendations.push(`✅ ${target.path} is clean - no contamination vectors detected.`);
            return recommendations;
        }
        recommendations.push(`⚠️ ${target.path} contains ${vectors.length} contamination vector(s).`);
        recommendations.push('');
        // Group vectors by type
        const vectorsByType = new Map();
        for (const vector of vectors) {
            const existing = vectorsByType.get(vector.type) || [];
            existing.push(vector);
            vectorsByType.set(vector.type, existing);
        }
        // Provide type-specific recommendations
        for (const [type, typeVectors] of vectorsByType) {
            recommendations.push(`${type} (${typeVectors.length}):`);
            const uniqueSuggestions = new Set(typeVectors.map(v => v.suggestion).filter(Boolean));
            for (const suggestion of uniqueSuggestions) {
                recommendations.push(`  • ${suggestion}`);
            }
            recommendations.push('');
        }
        return recommendations;
    }
    /**
     * Generate audit summary
     */
    generateSummary(results) {
        const allVectors = results.flatMap(r => r.vectors);
        const totalVectors = allVectors.length;
        // Count by type
        const vectorsByType = {};
        for (const vector of allVectors) {
            vectorsByType[vector.type] = (vectorsByType[vector.type] || 0) + 1;
        }
        // Count by severity
        const vectorsBySeverity = {};
        for (const vector of allVectors) {
            vectorsBySeverity[vector.severity] = (vectorsBySeverity[vector.severity] || 0) + 1;
        }
        // Generate overall recommendations
        const recommendations = [];
        if (totalVectors === 0) {
            recommendations.push('All audited targets are clean - no contamination vectors detected.');
        }
        else {
            if (vectorsByType['code-example']) {
                recommendations.push('Remove code examples from documentation and replace with concept-based explanations.');
            }
            if (vectorsByType['implementation-detail']) {
                recommendations.push('Focus documentation on mathematical relationships and design principles rather than implementation details.');
            }
            if (vectorsByType['arbitrary-value']) {
                recommendations.push('Reference tokens by name rather than showing raw unit values.');
            }
        }
        const overallStatus = totalVectors === 0 ? 'clean' : 'issues-detected';
        return {
            overallStatus,
            totalVectors,
            vectorsByType,
            vectorsBySeverity,
            recommendations
        };
    }
    /**
     * Format audit report as text
     */
    formatReport(report) {
        const lines = [];
        lines.push('='.repeat(80));
        lines.push('CONTAMINATION AUDIT REPORT');
        lines.push('='.repeat(80));
        lines.push('');
        lines.push(`Timestamp: ${report.timestamp.toISOString()}`);
        lines.push(`Total Targets: ${report.totalTargets}`);
        lines.push(`Passed: ${report.passedTargets}`);
        lines.push(`Failed: ${report.failedTargets}`);
        lines.push('');
        // Summary
        lines.push('SUMMARY');
        lines.push('-'.repeat(80));
        lines.push(`Overall Status: ${report.summary.overallStatus.toUpperCase()}`);
        lines.push(`Total Contamination Vectors: ${report.summary.totalVectors}`);
        lines.push('');
        if (report.summary.totalVectors > 0) {
            lines.push('Vectors by Type:');
            for (const [type, count] of Object.entries(report.summary.vectorsByType)) {
                lines.push(`  ${type}: ${count}`);
            }
            lines.push('');
            lines.push('Vectors by Severity:');
            for (const [severity, count] of Object.entries(report.summary.vectorsBySeverity)) {
                lines.push(`  ${severity}: ${count}`);
            }
            lines.push('');
        }
        lines.push('Recommendations:');
        for (const rec of report.summary.recommendations) {
            lines.push(`  • ${rec}`);
        }
        lines.push('');
        // Critical Issues
        if (report.criticalIssues.length > 0) {
            lines.push('CRITICAL ISSUES');
            lines.push('-'.repeat(80));
            for (const issue of report.criticalIssues) {
                lines.push(`${issue.target.path} (${issue.severity})`);
                lines.push(`  Vectors: ${issue.vectors.length}`);
                for (const vector of issue.vectors) {
                    lines.push(`    - [${vector.severity}] ${vector.type}: ${vector.description}`);
                }
                lines.push('');
            }
        }
        // Detailed Results
        lines.push('DETAILED RESULTS');
        lines.push('-'.repeat(80));
        for (const result of report.results) {
            const status = result.passed ? '✅ PASS' : '❌ FAIL';
            lines.push(`${status} - ${result.target.path} (${result.severity})`);
            if (result.vectors.length > 0) {
                for (const vector of result.vectors) {
                    lines.push(`  [${vector.severity}] ${vector.type}: ${vector.description}`);
                }
            }
            lines.push('');
        }
        lines.push('='.repeat(80));
        lines.push('END OF REPORT');
        lines.push('='.repeat(80));
        return lines.join('\n');
    }
    /**
     * Check if audit passed
     */
    auditPassed(report) {
        if (this.config.failOnCritical && report.criticalIssues.length > 0) {
            return false;
        }
        return report.summary.overallStatus === 'clean';
    }
    /**
     * Get configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Update configuration
     */
    updateConfig(updates) {
        this.config = { ...this.config, ...updates };
        // Update dependent systems
        this.contaminationPrevention.updateConfig({
            strictMode: this.config.strictMode
        });
        this.documentationGuard.updateConfig({
            strictConceptEnforcement: this.config.strictMode
        });
    }
}
exports.ContaminationAuditor = ContaminationAuditor;
//# sourceMappingURL=ContaminationAuditor.js.map