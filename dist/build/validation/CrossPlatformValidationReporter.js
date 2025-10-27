"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossPlatformValidationReporter = void 0;
/**
 * Cross-Platform Validation Reporter
 *
 * Main class for generating comprehensive validation reports
 */
class CrossPlatformValidationReporter {
    /**
     * Generate comprehensive validation report
     *
     * Aggregates results from all three validation tasks:
     * - Task 8.1: Mathematical consistency (F1 validators)
     * - Task 8.2: Token comparison
     * - Task 8.3: Interface contract validation
     */
    generateReport(mathematicalResult, tokenComparisonResult, interfaceResults) {
        const startTime = Date.now();
        // Aggregate mathematical consistency results
        const mathematicalSummary = this.summarizeMathematicalConsistency(mathematicalResult);
        // Aggregate token comparison results
        const tokenSummary = this.summarizeTokenComparison(tokenComparisonResult);
        // Aggregate interface validation results
        const interfaceSummary = this.summarizeInterfaceValidation(interfaceResults);
        // Generate recommendations
        const recommendations = this.generateRecommendations(mathematicalResult, tokenComparisonResult, interfaceResults);
        // Generate executive summary
        const executiveSummary = this.generateExecutiveSummary(mathematicalSummary, tokenSummary, interfaceSummary, recommendations);
        // Determine overall validity
        const valid = mathematicalSummary.valid &&
            tokenSummary.valid &&
            interfaceSummary.valid;
        const duration = Date.now() - startTime;
        return {
            valid,
            metadata: {
                timestamp: new Date(),
                platforms: mathematicalResult.metadata.platformsValidated,
                duration: mathematicalResult.metadata.validationDuration + duration,
                version: '1.0.0'
            },
            mathematicalConsistency: mathematicalSummary,
            tokenComparison: tokenSummary,
            interfaceValidation: interfaceSummary,
            recommendations,
            executiveSummary
        };
    }
    /**
     * Summarize mathematical consistency results from Task 8.1
     */
    summarizeMathematicalConsistency(result) {
        const keyFindings = [];
        // Cross-platform consistency findings
        if (!result.crossPlatformConsistency.valid) {
            keyFindings.push(`Cross-platform consistency issues detected: ${result.crossPlatformConsistency.summary}`);
        }
        // Mathematical relationships findings
        if (!result.mathematicalRelationships.valid) {
            keyFindings.push(`Mathematical relationship violations: ${result.mathematicalRelationships.summary}`);
        }
        // Strategic flexibility findings
        if (result.strategicFlexibility.results.length > 0) {
            const flexCount = result.strategicFlexibility.results.filter(r => r.level === 'Warning').length;
            if (flexCount > 0) {
                keyFindings.push(`${flexCount} strategic flexibility tokens in use`);
            }
        }
        // Accessibility findings
        if (!result.accessibility.valid) {
            if (result.accessibility.contrastRatioIssues.length > 0) {
                keyFindings.push(`${result.accessibility.contrastRatioIssues.length} WCAG 2.1 AA contrast ratio violations`);
            }
            if (result.accessibility.touchTargetIssues.length > 0) {
                keyFindings.push(`${result.accessibility.touchTargetIssues.length} touch target size violations`);
            }
        }
        return {
            valid: result.valid,
            crossPlatformConsistency: {
                status: result.crossPlatformConsistency.valid ? 'pass' : 'fail',
                summary: result.crossPlatformConsistency.summary,
                issueCount: result.crossPlatformConsistency.results.filter(r => !r.isConsistent).length
            },
            mathematicalRelationships: {
                status: result.mathematicalRelationships.valid ? 'pass' : 'fail',
                summary: result.mathematicalRelationships.summary,
                passCount: result.mathematicalRelationships.results.filter(r => r.primaryResult.level === 'Pass').length,
                warningCount: result.mathematicalRelationships.results.filter(r => r.primaryResult.level === 'Warning').length,
                errorCount: result.mathematicalRelationships.results.filter(r => r.primaryResult.level === 'Error').length
            },
            strategicFlexibility: {
                status: result.strategicFlexibility.valid ? 'pass' : 'fail',
                summary: result.strategicFlexibility.summary,
                alignedCount: result.strategicFlexibility.results.filter(r => r.level === 'Pass').length,
                flexibilityCount: result.strategicFlexibility.results.filter(r => r.level === 'Warning').length
            },
            accessibility: {
                status: result.accessibility.valid ? 'pass' : 'fail',
                contrastIssues: result.accessibility.contrastRatioIssues.length,
                touchTargetIssues: result.accessibility.touchTargetIssues.length
            },
            keyFindings
        };
    }
    /**
     * Summarize token comparison results from Task 8.2
     */
    summarizeTokenComparison(result) {
        const keyFindings = [];
        // Overall consistency
        const consistencyPercentage = (result.consistentTokens / result.totalTokens) * 100;
        keyFindings.push(`${consistencyPercentage.toFixed(1)}% of tokens maintain cross-platform consistency`);
        // Token type analysis
        if (result.byTokenType.primitive.total > 0) {
            const primPercentage = (result.byTokenType.primitive.consistent / result.byTokenType.primitive.total) * 100;
            keyFindings.push(`Primitive tokens: ${primPercentage.toFixed(1)}% consistent`);
        }
        if (result.byTokenType.semantic.total > 0) {
            const semPercentage = (result.byTokenType.semantic.consistent / result.byTokenType.semantic.total) * 100;
            keyFindings.push(`Semantic tokens: ${semPercentage.toFixed(1)}% consistent`);
        }
        if (result.byTokenType.component.total > 0) {
            const compPercentage = (result.byTokenType.component.consistent / result.byTokenType.component.total) * 100;
            keyFindings.push(`Component tokens: ${compPercentage.toFixed(1)}% consistent`);
        }
        // Platform-specific issues
        const platformsWithIssues = Object.entries(result.platformIssues)
            .filter(([, count]) => count > 0)
            .map(([platform]) => platform);
        if (platformsWithIssues.length > 0) {
            keyFindings.push(`Platforms with issues: ${platformsWithIssues.join(', ')}`);
        }
        return {
            valid: result.inconsistentTokens === 0,
            totalTokens: result.totalTokens,
            consistentTokens: result.consistentTokens,
            inconsistentTokens: result.inconsistentTokens,
            averageConsistencyScore: result.averageConsistencyScore,
            byTokenType: {
                primitive: {
                    ...result.byTokenType.primitive,
                    percentage: result.byTokenType.primitive.total > 0
                        ? (result.byTokenType.primitive.consistent / result.byTokenType.primitive.total) * 100
                        : 100
                },
                semantic: {
                    ...result.byTokenType.semantic,
                    percentage: result.byTokenType.semantic.total > 0
                        ? (result.byTokenType.semantic.consistent / result.byTokenType.semantic.total) * 100
                        : 100
                },
                component: {
                    ...result.byTokenType.component,
                    percentage: result.byTokenType.component.total > 0
                        ? (result.byTokenType.component.consistent / result.byTokenType.component.total) * 100
                        : 100
                }
            },
            platformIssues: result.platformIssues,
            commonIssues: result.commonIssues,
            keyFindings
        };
    }
    /**
     * Summarize interface validation results from Task 8.3
     */
    summarizeInterfaceValidation(results) {
        const keyFindings = [];
        // Count total API differences
        const totalDifferences = results.reduce((sum, r) => sum + r.apiDifferences.length, 0);
        // Count by difference type
        const byType = {
            method: 0,
            property: 0,
            event: 0,
            state: 0
        };
        results.forEach(result => {
            result.apiDifferences.forEach(diff => {
                byType[diff.type]++;
            });
        });
        // Count affected files
        const totalAffectedFiles = results.reduce((sum, r) => sum + r.affectedFiles.length, 0);
        // Generate key findings
        if (totalDifferences === 0) {
            keyFindings.push('All platforms implement consistent API contracts');
        }
        else {
            keyFindings.push(`${totalDifferences} API differences found across ${results.length} component(s)`);
            if (byType.method > 0) {
                keyFindings.push(`${byType.method} method signature mismatches`);
            }
            if (byType.property > 0) {
                keyFindings.push(`${byType.property} property type mismatches`);
            }
            if (byType.event > 0) {
                keyFindings.push(`${byType.event} event definition mismatches`);
            }
            if (byType.state > 0) {
                keyFindings.push(`${byType.state} state definition mismatches`);
            }
        }
        return {
            valid: totalDifferences === 0,
            componentsValidated: results.length,
            apiDifferences: totalDifferences,
            byDifferenceType: byType,
            affectedFiles: totalAffectedFiles,
            keyFindings
        };
    }
    /**
     * Generate actionable recommendations
     *
     * Adapts F1's suggestion format for build context
     */
    generateRecommendations(mathematicalResult, tokenComparisonResult, interfaceResults) {
        const sections = [];
        // Critical recommendations (must fix)
        const critical = this.generateCriticalRecommendations(mathematicalResult, tokenComparisonResult, interfaceResults);
        if (critical.recommendations.length > 0) {
            sections.push(critical);
        }
        // High priority recommendations
        const high = this.generateHighPriorityRecommendations(mathematicalResult, tokenComparisonResult, interfaceResults);
        if (high.recommendations.length > 0) {
            sections.push(high);
        }
        // Medium priority recommendations
        const medium = this.generateMediumPriorityRecommendations(mathematicalResult, tokenComparisonResult);
        if (medium.recommendations.length > 0) {
            sections.push(medium);
        }
        // Low priority recommendations (optimizations)
        const low = this.generateLowPriorityRecommendations(mathematicalResult, tokenComparisonResult);
        if (low.recommendations.length > 0) {
            sections.push(low);
        }
        return sections;
    }
    /**
     * Generate critical recommendations
     */
    generateCriticalRecommendations(mathematicalResult, tokenComparisonResult, interfaceResults) {
        const recommendations = [];
        // Critical: Interface contract violations
        interfaceResults.forEach(result => {
            if (!result.valid) {
                const methodDiffs = result.apiDifferences.filter(d => d.type === 'method');
                if (methodDiffs.length > 0) {
                    recommendations.push({
                        description: `Component "${result.component}" has ${methodDiffs.length} method signature mismatch(es)`,
                        components: [result.component],
                        action: 'Update platform implementations to match unified interface contract',
                        impact: 'API inconsistency will cause runtime errors and developer confusion',
                        documentation: ['docs/interface-contracts.md']
                    });
                }
            }
        });
        // Critical: Mathematical consistency violations
        if (!mathematicalResult.mathematicalRelationships.valid) {
            const errorResults = mathematicalResult.mathematicalRelationships.results.filter(r => r.primaryResult.level === 'Error');
            if (errorResults.length > 0) {
                recommendations.push({
                    description: `${errorResults.length} token(s) violate mathematical foundations`,
                    action: 'Review and correct token values to maintain mathematical relationships',
                    impact: 'Mathematical inconsistency breaks design system integrity',
                    documentation: ['docs/mathematical-foundations.md']
                });
            }
        }
        // Critical: Accessibility violations
        if (!mathematicalResult.accessibility.valid) {
            if (mathematicalResult.accessibility.contrastRatioIssues.length > 0) {
                recommendations.push({
                    description: `${mathematicalResult.accessibility.contrastRatioIssues.length} WCAG 2.1 AA contrast violations`,
                    action: 'Adjust color combinations to meet WCAG 2.1 AA contrast requirements (4.5:1 for normal text, 3:1 for large text)',
                    impact: 'Accessibility violations prevent users with visual impairments from using the application',
                    documentation: ['https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum']
                });
            }
            if (mathematicalResult.accessibility.touchTargetIssues.length > 0) {
                recommendations.push({
                    description: `${mathematicalResult.accessibility.touchTargetIssues.length} touch target size violations`,
                    action: 'Increase touch target sizes to meet platform minimums (iOS: 44pt, Android: 48dp, Web: 44px)',
                    impact: 'Small touch targets create usability issues, especially for users with motor impairments',
                    documentation: ['docs/accessibility-guidelines.md']
                });
            }
        }
        return {
            title: 'Critical Issues',
            priority: 'critical',
            recommendations
        };
    }
    /**
     * Generate high priority recommendations
     */
    generateHighPriorityRecommendations(mathematicalResult, tokenComparisonResult, interfaceResults) {
        const recommendations = [];
        // High: Token value inconsistencies
        if (tokenComparisonResult.inconsistentTokens > 0) {
            const percentage = (tokenComparisonResult.inconsistentTokens / tokenComparisonResult.totalTokens) * 100;
            recommendations.push({
                description: `${tokenComparisonResult.inconsistentTokens} token(s) have inconsistent values across platforms (${percentage.toFixed(1)}%)`,
                action: 'Review token generation logic to ensure consistent cross-platform conversion',
                impact: 'Inconsistent token values create visual differences across platforms',
                documentation: ['docs/token-generation.md']
            });
        }
        // High: Property type mismatches
        interfaceResults.forEach(result => {
            const propertyDiffs = result.apiDifferences.filter(d => d.type === 'property');
            if (propertyDiffs.length > 0) {
                recommendations.push({
                    description: `Component "${result.component}" has ${propertyDiffs.length} property type mismatch(es)`,
                    components: [result.component],
                    action: 'Ensure property types are equivalent across platforms (String/string, Int/number, etc.)',
                    impact: 'Type mismatches cause compilation errors and runtime issues'
                });
            }
        });
        // High: Cross-platform consistency issues
        if (!mathematicalResult.crossPlatformConsistency.valid) {
            recommendations.push({
                description: mathematicalResult.crossPlatformConsistency.summary,
                action: 'Review unit conversion logic and platform-specific constraints',
                impact: 'Cross-platform inconsistency breaks unified design system experience'
            });
        }
        return {
            title: 'High Priority Issues',
            priority: 'high',
            recommendations
        };
    }
    /**
     * Generate medium priority recommendations
     */
    generateMediumPriorityRecommendations(mathematicalResult, tokenComparisonResult) {
        const recommendations = [];
        // Medium: Mathematical relationship warnings
        const warningResults = mathematicalResult.mathematicalRelationships.results.filter(r => r.primaryResult.level === 'Warning');
        if (warningResults.length > 0) {
            recommendations.push({
                description: `${warningResults.length} token(s) have mathematical relationship warnings`,
                action: 'Review token progressions and consider adjusting to follow mathematical patterns',
                impact: 'Warnings indicate potential design system inconsistencies but are not critical'
            });
        }
        // Medium: Strategic flexibility usage
        if (mathematicalResult.strategicFlexibility.results.length > 0) {
            const flexCount = mathematicalResult.strategicFlexibility.results.filter(r => r.level === 'Warning').length;
            if (flexCount > 0) {
                recommendations.push({
                    description: `${flexCount} strategic flexibility token(s) in use`,
                    action: 'Monitor usage patterns to ensure ≥80% appropriate usage rate',
                    impact: 'Strategic flexibility tokens should be used judiciously to maintain system integrity'
                });
            }
        }
        // Medium: Common token issues
        if (tokenComparisonResult.commonIssues.length > 0) {
            recommendations.push({
                description: `Common token issues detected: ${tokenComparisonResult.commonIssues.slice(0, 3).join(', ')}`,
                action: 'Address recurring patterns in token generation or validation',
                impact: 'Common issues suggest systematic problems that should be resolved'
            });
        }
        return {
            title: 'Medium Priority Issues',
            priority: 'medium',
            recommendations
        };
    }
    /**
     * Generate low priority recommendations (optimizations)
     */
    generateLowPriorityRecommendations(mathematicalResult, tokenComparisonResult) {
        const recommendations = [];
        // Low: Optimization opportunities
        if (tokenComparisonResult.averageConsistencyScore < 1.0 && tokenComparisonResult.averageConsistencyScore >= 0.95) {
            recommendations.push({
                description: `Average consistency score is ${(tokenComparisonResult.averageConsistencyScore * 100).toFixed(1)}%`,
                action: 'Consider tightening tolerance levels for even more precise cross-platform consistency',
                impact: 'Minor optimization that could improve visual consistency'
            });
        }
        // Low: Component token usage
        if (tokenComparisonResult.byTokenType.component.total > 0) {
            const componentPercentage = (tokenComparisonResult.byTokenType.component.total / tokenComparisonResult.totalTokens) * 100;
            if (componentPercentage > 20) {
                recommendations.push({
                    description: `${componentPercentage.toFixed(1)}% of tokens are component-specific`,
                    action: 'Review if some component tokens could be promoted to primitive tokens for broader reuse',
                    impact: 'Reducing component token proliferation improves system maintainability'
                });
            }
        }
        // Low: Documentation improvements
        recommendations.push({
            description: 'Validation complete - consider documenting validation results',
            action: 'Generate validation report documentation for team reference',
            impact: 'Documentation helps team understand validation results and track improvements over time'
        });
        return {
            title: 'Optimization Opportunities',
            priority: 'low',
            recommendations
        };
    }
    /**
     * Generate executive summary
     */
    generateExecutiveSummary(mathematicalSummary, tokenSummary, interfaceSummary, recommendations) {
        // Count total issues
        const criticalIssues = recommendations
            .filter(s => s.priority === 'critical')
            .reduce((sum, s) => sum + s.recommendations.length, 0);
        const warnings = recommendations
            .filter(s => s.priority === 'high' || s.priority === 'medium')
            .reduce((sum, s) => sum + s.recommendations.length, 0);
        const totalIssues = criticalIssues + warnings;
        // Calculate success rate
        const mathematicalScore = mathematicalSummary.valid ? 1 : 0;
        const tokenScore = tokenSummary.valid ? 1 : 0;
        const interfaceScore = interfaceSummary.valid ? 1 : 0;
        const successRate = ((mathematicalScore + tokenScore + interfaceScore) / 3) * 100;
        // Determine overall status
        let overallStatus;
        if (criticalIssues > 0) {
            overallStatus = 'fail';
        }
        else if (warnings > 0) {
            overallStatus = 'warning';
        }
        else {
            overallStatus = 'pass';
        }
        // Identify top 3 issues
        const topIssues = [];
        recommendations.forEach(section => {
            section.recommendations.slice(0, 3 - topIssues.length).forEach(rec => {
                if (topIssues.length < 3) {
                    topIssues.push(rec.description);
                }
            });
        });
        // Generate next steps
        const nextSteps = [];
        if (criticalIssues > 0) {
            nextSteps.push(`Address ${criticalIssues} critical issue(s) immediately`);
        }
        if (warnings > 0) {
            nextSteps.push(`Review and resolve ${warnings} warning(s)`);
        }
        if (overallStatus === 'pass') {
            nextSteps.push('All validations passed - proceed with build deployment');
            nextSteps.push('Consider addressing optimization opportunities');
        }
        else {
            nextSteps.push('Re-run validation after fixes to confirm resolution');
        }
        return {
            overallStatus,
            totalIssues,
            criticalIssues,
            warnings,
            successRate,
            topIssues,
            nextSteps
        };
    }
    /**
     * Format report as human-readable text
     */
    formatAsText(report) {
        const lines = [];
        // Header
        lines.push('═══════════════════════════════════════════════════════════════');
        lines.push('         CROSS-PLATFORM VALIDATION REPORT');
        lines.push('═══════════════════════════════════════════════════════════════');
        lines.push('');
        // Metadata
        lines.push(`Generated: ${report.metadata.timestamp.toISOString()}`);
        lines.push(`Platforms: ${report.metadata.platforms.join(', ')}`);
        lines.push(`Duration: ${report.metadata.duration}ms`);
        lines.push(`Version: ${report.metadata.version}`);
        lines.push('');
        // Executive Summary
        lines.push('───────────────────────────────────────────────────────────────');
        lines.push('EXECUTIVE SUMMARY');
        lines.push('───────────────────────────────────────────────────────────────');
        lines.push(`Status: ${report.executiveSummary.overallStatus.toUpperCase()}`);
        lines.push(`Success Rate: ${report.executiveSummary.successRate.toFixed(1)}%`);
        lines.push(`Total Issues: ${report.executiveSummary.totalIssues}`);
        lines.push(`  - Critical: ${report.executiveSummary.criticalIssues}`);
        lines.push(`  - Warnings: ${report.executiveSummary.warnings}`);
        lines.push('');
        if (report.executiveSummary.topIssues.length > 0) {
            lines.push('Top Issues:');
            report.executiveSummary.topIssues.forEach((issue, i) => {
                lines.push(`  ${i + 1}. ${issue}`);
            });
            lines.push('');
        }
        // Mathematical Consistency
        lines.push('───────────────────────────────────────────────────────────────');
        lines.push('MATHEMATICAL CONSISTENCY (Task 8.1)');
        lines.push('───────────────────────────────────────────────────────────────');
        lines.push(`Status: ${report.mathematicalConsistency.valid ? 'PASS' : 'FAIL'}`);
        lines.push('');
        lines.push(`Cross-Platform: ${report.mathematicalConsistency.crossPlatformConsistency.status.toUpperCase()}`);
        lines.push(`  ${report.mathematicalConsistency.crossPlatformConsistency.summary}`);
        lines.push('');
        lines.push(`Mathematical Relationships: ${report.mathematicalConsistency.mathematicalRelationships.status.toUpperCase()}`);
        lines.push(`  ${report.mathematicalConsistency.mathematicalRelationships.summary}`);
        lines.push('');
        lines.push(`Strategic Flexibility: ${report.mathematicalConsistency.strategicFlexibility.status.toUpperCase()}`);
        lines.push(`  ${report.mathematicalConsistency.strategicFlexibility.summary}`);
        lines.push('');
        lines.push(`Accessibility: ${report.mathematicalConsistency.accessibility.status.toUpperCase()}`);
        lines.push(`  Contrast Issues: ${report.mathematicalConsistency.accessibility.contrastIssues}`);
        lines.push(`  Touch Target Issues: ${report.mathematicalConsistency.accessibility.touchTargetIssues}`);
        lines.push('');
        if (report.mathematicalConsistency.keyFindings.length > 0) {
            lines.push('Key Findings:');
            report.mathematicalConsistency.keyFindings.forEach(finding => {
                lines.push(`  • ${finding}`);
            });
            lines.push('');
        }
        // Token Comparison
        lines.push('───────────────────────────────────────────────────────────────');
        lines.push('TOKEN COMPARISON (Task 8.2)');
        lines.push('───────────────────────────────────────────────────────────────');
        lines.push(`Status: ${report.tokenComparison.valid ? 'PASS' : 'FAIL'}`);
        lines.push(`Total Tokens: ${report.tokenComparison.totalTokens}`);
        lines.push(`Consistent: ${report.tokenComparison.consistentTokens}`);
        lines.push(`Inconsistent: ${report.tokenComparison.inconsistentTokens}`);
        lines.push(`Average Consistency: ${(report.tokenComparison.averageConsistencyScore * 100).toFixed(1)}%`);
        lines.push('');
        lines.push('By Token Type:');
        lines.push(`  Primitive: ${report.tokenComparison.byTokenType.primitive.consistent}/${report.tokenComparison.byTokenType.primitive.total} (${report.tokenComparison.byTokenType.primitive.percentage.toFixed(1)}%)`);
        lines.push(`  Semantic: ${report.tokenComparison.byTokenType.semantic.consistent}/${report.tokenComparison.byTokenType.semantic.total} (${report.tokenComparison.byTokenType.semantic.percentage.toFixed(1)}%)`);
        lines.push(`  Component: ${report.tokenComparison.byTokenType.component.consistent}/${report.tokenComparison.byTokenType.component.total} (${report.tokenComparison.byTokenType.component.percentage.toFixed(1)}%)`);
        lines.push('');
        if (report.tokenComparison.keyFindings.length > 0) {
            lines.push('Key Findings:');
            report.tokenComparison.keyFindings.forEach(finding => {
                lines.push(`  • ${finding}`);
            });
            lines.push('');
        }
        // Interface Validation
        lines.push('───────────────────────────────────────────────────────────────');
        lines.push('INTERFACE VALIDATION (Task 8.3)');
        lines.push('───────────────────────────────────────────────────────────────');
        lines.push(`Status: ${report.interfaceValidation.valid ? 'PASS' : 'FAIL'}`);
        lines.push(`Components Validated: ${report.interfaceValidation.componentsValidated}`);
        lines.push(`API Differences: ${report.interfaceValidation.apiDifferences}`);
        lines.push('');
        lines.push('By Difference Type:');
        lines.push(`  Methods: ${report.interfaceValidation.byDifferenceType.method}`);
        lines.push(`  Properties: ${report.interfaceValidation.byDifferenceType.property}`);
        lines.push(`  Events: ${report.interfaceValidation.byDifferenceType.event}`);
        lines.push(`  States: ${report.interfaceValidation.byDifferenceType.state}`);
        lines.push('');
        if (report.interfaceValidation.keyFindings.length > 0) {
            lines.push('Key Findings:');
            report.interfaceValidation.keyFindings.forEach(finding => {
                lines.push(`  • ${finding}`);
            });
            lines.push('');
        }
        // Recommendations
        if (report.recommendations.length > 0) {
            lines.push('───────────────────────────────────────────────────────────────');
            lines.push('RECOMMENDATIONS');
            lines.push('───────────────────────────────────────────────────────────────');
            report.recommendations.forEach(section => {
                lines.push('');
                lines.push(`${section.title.toUpperCase()} [${section.priority.toUpperCase()}]`);
                lines.push('');
                section.recommendations.forEach((rec, i) => {
                    lines.push(`${i + 1}. ${rec.description}`);
                    lines.push(`   Action: ${rec.action}`);
                    if (rec.impact) {
                        lines.push(`   Impact: ${rec.impact}`);
                    }
                    if (rec.platforms && rec.platforms.length > 0) {
                        lines.push(`   Platforms: ${rec.platforms.join(', ')}`);
                    }
                    if (rec.components && rec.components.length > 0) {
                        lines.push(`   Components: ${rec.components.join(', ')}`);
                    }
                    if (rec.documentation && rec.documentation.length > 0) {
                        lines.push(`   Documentation: ${rec.documentation.join(', ')}`);
                    }
                    lines.push('');
                });
            });
        }
        // Next Steps
        lines.push('───────────────────────────────────────────────────────────────');
        lines.push('NEXT STEPS');
        lines.push('───────────────────────────────────────────────────────────────');
        report.executiveSummary.nextSteps.forEach((step, i) => {
            lines.push(`${i + 1}. ${step}`);
        });
        lines.push('');
        lines.push('═══════════════════════════════════════════════════════════════');
        return lines.join('\n');
    }
    /**
     * Format report as JSON
     */
    formatAsJSON(report) {
        return JSON.stringify(report, null, 2);
    }
    /**
     * Format report as markdown
     */
    formatAsMarkdown(report) {
        const lines = [];
        lines.push('# Cross-Platform Validation Report');
        lines.push('');
        lines.push(`**Generated:** ${report.metadata.timestamp.toISOString()}`);
        lines.push(`**Platforms:** ${report.metadata.platforms.join(', ')}`);
        lines.push(`**Duration:** ${report.metadata.duration}ms`);
        lines.push(`**Version:** ${report.metadata.version}`);
        lines.push('');
        lines.push('## Executive Summary');
        lines.push('');
        lines.push(`- **Status:** ${report.executiveSummary.overallStatus.toUpperCase()}`);
        lines.push(`- **Success Rate:** ${report.executiveSummary.successRate.toFixed(1)}%`);
        lines.push(`- **Total Issues:** ${report.executiveSummary.totalIssues} (${report.executiveSummary.criticalIssues} critical, ${report.executiveSummary.warnings} warnings)`);
        lines.push('');
        if (report.executiveSummary.topIssues.length > 0) {
            lines.push('### Top Issues');
            lines.push('');
            report.executiveSummary.topIssues.forEach((issue, i) => {
                lines.push(`${i + 1}. ${issue}`);
            });
            lines.push('');
        }
        lines.push('## Mathematical Consistency (Task 8.1)');
        lines.push('');
        lines.push(`**Status:** ${report.mathematicalConsistency.valid ? '✓ PASS' : '✗ FAIL'}`);
        lines.push('');
        lines.push('### Results');
        lines.push('');
        lines.push(`- **Cross-Platform:** ${report.mathematicalConsistency.crossPlatformConsistency.status.toUpperCase()}`);
        lines.push(`  - ${report.mathematicalConsistency.crossPlatformConsistency.summary}`);
        lines.push(`- **Mathematical Relationships:** ${report.mathematicalConsistency.mathematicalRelationships.status.toUpperCase()}`);
        lines.push(`  - ${report.mathematicalConsistency.mathematicalRelationships.summary}`);
        lines.push(`- **Strategic Flexibility:** ${report.mathematicalConsistency.strategicFlexibility.status.toUpperCase()}`);
        lines.push(`  - ${report.mathematicalConsistency.strategicFlexibility.summary}`);
        lines.push(`- **Accessibility:** ${report.mathematicalConsistency.accessibility.status.toUpperCase()}`);
        lines.push(`  - Contrast Issues: ${report.mathematicalConsistency.accessibility.contrastIssues}`);
        lines.push(`  - Touch Target Issues: ${report.mathematicalConsistency.accessibility.touchTargetIssues}`);
        lines.push('');
        lines.push('## Token Comparison (Task 8.2)');
        lines.push('');
        lines.push(`**Status:** ${report.tokenComparison.valid ? '✓ PASS' : '✗ FAIL'}`);
        lines.push('');
        lines.push(`- Total Tokens: ${report.tokenComparison.totalTokens}`);
        lines.push(`- Consistent: ${report.tokenComparison.consistentTokens}`);
        lines.push(`- Inconsistent: ${report.tokenComparison.inconsistentTokens}`);
        lines.push(`- Average Consistency: ${(report.tokenComparison.averageConsistencyScore * 100).toFixed(1)}%`);
        lines.push('');
        lines.push('## Interface Validation (Task 8.3)');
        lines.push('');
        lines.push(`**Status:** ${report.interfaceValidation.valid ? '✓ PASS' : '✗ FAIL'}`);
        lines.push('');
        lines.push(`- Components Validated: ${report.interfaceValidation.componentsValidated}`);
        lines.push(`- API Differences: ${report.interfaceValidation.apiDifferences}`);
        lines.push('');
        if (report.recommendations.length > 0) {
            lines.push('## Recommendations');
            lines.push('');
            report.recommendations.forEach(section => {
                lines.push(`### ${section.title} [${section.priority.toUpperCase()}]`);
                lines.push('');
                section.recommendations.forEach((rec, i) => {
                    lines.push(`${i + 1}. **${rec.description}**`);
                    lines.push(`   - **Action:** ${rec.action}`);
                    if (rec.impact) {
                        lines.push(`   - **Impact:** ${rec.impact}`);
                    }
                    lines.push('');
                });
            });
        }
        lines.push('## Next Steps');
        lines.push('');
        report.executiveSummary.nextSteps.forEach((step, i) => {
            lines.push(`${i + 1}. ${step}`);
        });
        lines.push('');
        return lines.join('\n');
    }
}
exports.CrossPlatformValidationReporter = CrossPlatformValidationReporter;
//# sourceMappingURL=CrossPlatformValidationReporter.js.map