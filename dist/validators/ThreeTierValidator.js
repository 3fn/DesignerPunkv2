"use strict";
/**
 * Three-Tier Validation System
 *
 * Main validation orchestrator that coordinates Pass/Warning/Error validation
 * to provide comprehensive feedback on token usage patterns and mathematical consistency.
 *
 * Validation Levels:
 * - Pass: Token usage follows best practices and mathematical foundations
 * - Warning: Mathematically valid but potentially problematic usage patterns
 * - Error: Mathematical relationship violations or critical design system errors
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeTierValidator = void 0;
const PassValidator_1 = require("./PassValidator");
const WarningValidator_1 = require("./WarningValidator");
const ErrorValidator_1 = require("./ErrorValidator");
const ValidationReasoning_1 = require("./ValidationReasoning");
/**
 * Three-tier validation system orchestrator
 */
class ThreeTierValidator {
    constructor(passValidator, warningValidator, errorValidator, reasoningGenerator) {
        this.reasoningGenerator = reasoningGenerator || new ValidationReasoning_1.ValidationReasoning();
        this.passValidator = passValidator || new PassValidator_1.PassValidator(this.reasoningGenerator);
        this.warningValidator = warningValidator || new WarningValidator_1.WarningValidator(this.reasoningGenerator);
        this.errorValidator = errorValidator || new ErrorValidator_1.ErrorValidator(this.reasoningGenerator);
    }
    /**
     * Perform comprehensive three-tier validation
     */
    validate(context) {
        const startTime = Date.now();
        const enabledLevels = context.options?.enabledLevels || ['Pass', 'Warning', 'Error'];
        const resultsByLevel = {};
        const validationTimes = {};
        const allIssues = [];
        const allSuggestions = [];
        // Execute Error validation first (highest priority)
        if (enabledLevels.includes('Error')) {
            const errorStart = Date.now();
            const errorResult = this.executeErrorValidation(context);
            validationTimes.error = Date.now() - errorStart;
            if (errorResult) {
                resultsByLevel.error = errorResult;
                allIssues.push(errorResult.message);
                if (errorResult.suggestions) {
                    allSuggestions.push(...errorResult.suggestions);
                }
            }
        }
        // Execute Warning validation if no errors found
        if (enabledLevels.includes('Warning') && !resultsByLevel.error) {
            const warningStart = Date.now();
            const warningResult = this.executeWarningValidation(context);
            validationTimes.warning = Date.now() - warningStart;
            if (warningResult) {
                resultsByLevel.warning = warningResult;
                allIssues.push(warningResult.message);
                if (warningResult.suggestions) {
                    allSuggestions.push(...warningResult.suggestions);
                }
            }
        }
        // Execute Pass validation if no errors or warnings found
        if (enabledLevels.includes('Pass') && !resultsByLevel.error && !resultsByLevel.warning) {
            const passStart = Date.now();
            const passResult = this.executePassValidation(context);
            validationTimes.pass = Date.now() - passStart;
            if (passResult) {
                resultsByLevel.pass = passResult;
                // Pass results don't add to issues, but may have informational content
            }
        }
        // Determine primary result (highest severity)
        const primaryResult = this.determinePrimaryResult(resultsByLevel, context);
        // Generate comprehensive reasoning
        const comprehensiveReasoning = this.generateComprehensiveReasoning(resultsByLevel, context);
        // Create validation summary
        const summary = {
            level: primaryResult.level,
            token: primaryResult.token,
            message: primaryResult.message,
            allIssues,
            allSuggestions: [...new Set(allSuggestions)], // Remove duplicates
            comprehensiveReasoning
        };
        // Create metadata
        const totalValidationTime = Date.now() - startTime;
        const metadata = {
            timestamp: new Date(),
            levelsExecuted: Object.keys(validationTimes),
            optionsUsed: context.options,
            performanceMetrics: {
                totalValidationTime,
                validationTimeByLevel: validationTimes
            }
        };
        return {
            primaryResult,
            resultsByLevel,
            summary,
            metadata
        };
    }
    /**
     * Execute Error-level validation
     */
    executeErrorValidation(context) {
        const errorContext = {
            token: context.token,
            mathematicalContext: context.mathematicalContext,
            registryContext: {
                availablePrimitiveTokens: context.systemContext?.availablePrimitiveTokens,
                availableSemanticTokens: context.systemContext?.availableSemanticTokens,
                dependencyGraph: context.systemContext?.dependencyGraph,
                circularReferences: context.systemContext?.circularReferences
            },
            options: {
                strictMathematics: context.options?.strictMathematics,
                requireCrossPlatformConsistency: context.options?.requireCrossPlatformConsistency,
                validateReferences: context.options?.validateReferences,
                checkCircularDependencies: context.options?.checkCircularDependencies
            }
        };
        return this.errorValidator.validate(errorContext);
    }
    /**
     * Execute Warning-level validation
     */
    executeWarningValidation(context) {
        const warningContext = {
            token: context.token,
            usagePattern: {
                usageFrequency: context.usageContext?.usageFrequency,
                totalUsageCount: context.usageContext?.totalUsageCount,
                availableAlternatives: context.usageContext?.availableAlternatives,
                usageContext: context.usageContext?.component || context.usageContext?.property,
                patternType: this.determinePatternType(context)
            },
            systemContext: context.systemContext,
            options: {
                strategicFlexibilityThreshold: context.options?.strategicFlexibilityThreshold,
                primitiveUsageThreshold: context.options?.primitiveUsageThreshold,
                enablePatternAnalysis: context.options?.enablePatternAnalysis
            }
        };
        return this.warningValidator.validate(warningContext);
    }
    /**
     * Execute Pass-level validation
     */
    executePassValidation(context) {
        const passContext = {
            token: context.token,
            usageContext: context.usageContext,
            options: {
                strictMode: context.options?.strictMathematics,
                checkCrossPlatform: context.options?.requireCrossPlatformConsistency,
                validateMathematics: true
            }
        };
        return this.passValidator.validate(passContext);
    }
    /**
     * Determine primary validation result (highest severity)
     */
    determinePrimaryResult(resultsByLevel, context) {
        // Return error if present (highest severity)
        if (resultsByLevel.error) {
            return resultsByLevel.error;
        }
        // Return warning if present (medium severity)
        if (resultsByLevel.warning) {
            return resultsByLevel.warning;
        }
        // Return pass if present (lowest severity)
        if (resultsByLevel.pass) {
            return resultsByLevel.pass;
        }
        // Fallback: create default pass result
        return {
            level: 'Pass',
            token: context.token.name,
            message: 'Token validation completed',
            rationale: 'No validation issues detected',
            mathematicalReasoning: 'Token usage follows design system guidelines'
        };
    }
    /**
     * Generate comprehensive mathematical reasoning combining all validation levels
     */
    generateComprehensiveReasoning(resultsByLevel, context) {
        const reasoningParts = [];
        // Add reasoning from each validation level
        if (resultsByLevel.error) {
            reasoningParts.push(`ERROR: ${resultsByLevel.error.mathematicalReasoning}`);
        }
        if (resultsByLevel.warning) {
            reasoningParts.push(`WARNING: ${resultsByLevel.warning.mathematicalReasoning}`);
        }
        if (resultsByLevel.pass) {
            reasoningParts.push(`PASS: ${resultsByLevel.pass.mathematicalReasoning}`);
        }
        // Add contextual mathematical information
        if (context.mathematicalContext) {
            const mathContext = context.mathematicalContext;
            if (mathContext.expectedRelationship && mathContext.actualRelationship) {
                reasoningParts.push(`Mathematical relationship: Expected ${mathContext.expectedRelationship}, Actual ${mathContext.actualRelationship}`);
            }
            if (mathContext.baselineGridRequirement) {
                const grid = mathContext.baselineGridRequirement;
                reasoningParts.push(`Baseline grid (${grid.gridUnit}px): ${grid.actualAlignment ? 'aligned' : 'not aligned'}`);
            }
            if (mathContext.crossPlatformData) {
                const cross = mathContext.crossPlatformData;
                reasoningParts.push(`Cross-platform consistency: ${cross.failedPairs.length === 0 ? 'maintained' : `${cross.failedPairs.length} failures`}`);
            }
        }
        // Add system context information
        if (context.systemContext?.strategicFlexibilityStats) {
            const stats = context.systemContext.strategicFlexibilityStats;
            const percentage = stats.totalUsage > 0 ? (stats.appropriateUsage / stats.totalUsage * 100).toFixed(1) : '100';
            reasoningParts.push(`Strategic flexibility usage: ${percentage}% appropriate`);
        }
        return reasoningParts.join('; ');
    }
    /**
     * Determine usage pattern type for warning validation
     */
    determinePatternType(context) {
        const usage = context.usageContext;
        const system = context.systemContext;
        if (!usage || !system) {
            return undefined;
        }
        // High frequency usage
        if (usage.usageFrequency && usage.totalUsageCount && usage.usageFrequency / usage.totalUsageCount > 0.2) {
            return 'overuse';
        }
        // Multiple alternatives available
        if (usage.availableAlternatives && usage.availableAlternatives.length > 2) {
            return 'inconsistent';
        }
        // Default to suboptimal if no specific pattern detected
        return 'suboptimal';
    }
    /**
     * Batch validation for multiple tokens
     */
    validateBatch(contexts) {
        return contexts.map(context => this.validate(context));
    }
    /**
     * Generate comprehensive validation report for multiple tokens
     */
    generateValidationReport(contexts) {
        const results = this.validateBatch(contexts);
        // Calculate summary statistics
        const totalTokens = results.length;
        const passCount = results.filter(r => r.primaryResult.level === 'Pass').length;
        const warningCount = results.filter(r => r.primaryResult.level === 'Warning').length;
        const errorCount = results.filter(r => r.primaryResult.level === 'Error').length;
        const overallHealthScore = totalTokens > 0 ? (passCount + warningCount * 0.5) / totalTokens : 1;
        // Analyze common issues
        const allIssues = results.flatMap(r => r.summary.allIssues);
        const issueFrequency = {};
        allIssues.forEach(issue => {
            issueFrequency[issue] = (issueFrequency[issue] || 0) + 1;
        });
        const commonIssues = Object.entries(issueFrequency)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([issue]) => issue);
        // Identify critical errors
        const criticalErrors = results
            .filter(r => r.primaryResult.level === 'Error')
            .map(r => r.primaryResult);
        // Generate improvement recommendations
        const improvementRecommendations = this.generateSystemRecommendations(results);
        // Calculate mathematical consistency score
        const mathematicalConsistencyScore = this.calculateMathematicalConsistencyScore(results);
        // Calculate performance metrics
        const totalValidationTime = results.reduce((sum, r) => sum + (r.metadata.performanceMetrics?.totalValidationTime || 0), 0);
        const averageValidationTime = totalTokens > 0 ? totalValidationTime / totalTokens : 0;
        const validationTimeByLevel = this.aggregateValidationTimesByLevel(results);
        return {
            summary: {
                totalTokens,
                passCount,
                warningCount,
                errorCount,
                overallHealthScore
            },
            results,
            systemAnalysis: {
                commonIssues,
                criticalErrors,
                improvementRecommendations,
                mathematicalConsistencyScore
            },
            performanceMetrics: {
                totalValidationTime,
                averageValidationTime,
                validationTimeByLevel
            }
        };
    }
    /**
     * Generate system-level recommendations based on validation results
     */
    generateSystemRecommendations(results) {
        const recommendations = [];
        const errors = results.filter(r => r.primaryResult.level === 'Error');
        const warnings = results.filter(r => r.primaryResult.level === 'Warning');
        // Error-based recommendations
        if (errors.length > 0) {
            recommendations.push('Address critical mathematical violations to ensure design system integrity');
            if (errors.some(e => e.primaryResult.message.includes('mathematical relationship'))) {
                recommendations.push('Establish clear mathematical relationships for all primitive tokens');
            }
            if (errors.some(e => e.primaryResult.message.includes('Baseline grid'))) {
                recommendations.push('Audit spacing and radius tokens for baseline grid compliance');
            }
        }
        // Warning-based recommendations
        if (warnings.length > 0) {
            recommendations.push('Review usage patterns to optimize design system adoption');
            if (warnings.some(w => w.primaryResult.message.includes('primitive token usage'))) {
                recommendations.push('Increase semantic token adoption for better design abstraction');
            }
            if (warnings.some(w => w.primaryResult.message.includes('Strategic flexibility'))) {
                recommendations.push('Monitor strategic flexibility usage to maintain appropriate usage patterns');
            }
        }
        // Overall system health recommendations
        const errorRate = errors.length / results.length;
        if (errorRate > 0.1) {
            recommendations.push('High error rate detected - implement systematic token validation in development workflow');
        }
        const warningRate = warnings.length / results.length;
        if (warningRate > 0.3) {
            recommendations.push('High warning rate suggests need for design system education and usage guidelines');
        }
        return recommendations;
    }
    /**
     * Calculate mathematical consistency score across all tokens
     */
    calculateMathematicalConsistencyScore(results) {
        if (results.length === 0)
            return 1;
        const scores = results.map(result => {
            switch (result.primaryResult.level) {
                case 'Pass': return 1.0;
                case 'Warning': return 0.7;
                case 'Error': return 0.0;
                default: return 0.5;
            }
        });
        return scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }
    /**
     * Aggregate validation times by level across all results
     */
    aggregateValidationTimesByLevel(results) {
        const aggregated = {};
        results.forEach(result => {
            const times = result.metadata.performanceMetrics?.validationTimeByLevel || {};
            Object.entries(times).forEach(([level, time]) => {
                aggregated[level] = (aggregated[level] || 0) + time;
            });
        });
        return aggregated;
    }
}
exports.ThreeTierValidator = ThreeTierValidator;
//# sourceMappingURL=ThreeTierValidator.js.map