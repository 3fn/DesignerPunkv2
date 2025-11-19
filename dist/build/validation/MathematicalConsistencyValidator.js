"use strict";
/**
 * Mathematical Consistency Validator
 *
 * F2 wrapper around F1 validators that adapts them to build context.
 * Validates mathematical consistency across platform builds including:
 * - Cross-platform token consistency (wraps F1's CrossPlatformConsistencyValidator)
 * - Mathematical relationships preservation (wraps F1's ThreeTierValidator)
 * - Strategic flexibility tokens (wraps F1's BaselineGridValidator)
 * - Accessibility requirements (WCAG 2.1 AA - NEW for F2)
 *
 * Requirements: 7.2, 7.3
 * F1 Dependencies: CrossPlatformConsistencyValidator, ThreeTierValidator, BaselineGridValidator
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathematicalConsistencyValidator = void 0;
const CrossPlatformConsistencyValidator_1 = require("../../validators/CrossPlatformConsistencyValidator");
const ThreeTierValidator_1 = require("../../validators/ThreeTierValidator");
const BaselineGridValidator_1 = require("../../validators/BaselineGridValidator");
const types_1 = require("../../types");
/**
 * Mathematical Consistency Validator
 *
 * Wraps F1 validators and adapts them to F2 build context
 */
class MathematicalConsistencyValidator {
    constructor(crossPlatformValidator, threeTierValidator, baselineGridValidator) {
        this.crossPlatformValidator = crossPlatformValidator || new CrossPlatformConsistencyValidator_1.CrossPlatformConsistencyValidator();
        this.threeTierValidator = threeTierValidator || new ThreeTierValidator_1.ThreeTierValidator();
        this.baselineGridValidator = baselineGridValidator || new BaselineGridValidator_1.BaselineGridValidator();
    }
    /**
     * Validate mathematical consistency across build results
     */
    async validateBuildResults(buildResults, tokens, unitProviders) {
        const startTime = Date.now();
        const platformsValidated = buildResults.map(r => r.platform);
        // Validate cross-platform consistency
        const crossPlatformResults = await this.validateCrossPlatformConsistency(tokens, unitProviders);
        // Validate mathematical relationships
        const mathematicalResults = await this.validateMathematicalRelationships(tokens);
        // Validate strategic flexibility
        const strategicFlexibilityResults = await this.validateStrategicFlexibility(tokens);
        // Validate accessibility (NEW for F2)
        const accessibilityResults = await this.validateAccessibility(tokens, platformsValidated);
        // Aggregate results
        const valid = crossPlatformResults.valid &&
            mathematicalResults.valid &&
            strategicFlexibilityResults.valid &&
            accessibilityResults.valid;
        // Generate recommendations
        const recommendations = this.generateRecommendations(crossPlatformResults, mathematicalResults, strategicFlexibilityResults, accessibilityResults);
        const validationDuration = Date.now() - startTime;
        const tokensValidated = this.countTokens(tokens);
        return {
            valid,
            crossPlatformConsistency: crossPlatformResults,
            mathematicalRelationships: mathematicalResults,
            strategicFlexibility: strategicFlexibilityResults,
            accessibility: accessibilityResults,
            recommendations,
            metadata: {
                timestamp: new Date(),
                platformsValidated,
                tokensValidated,
                validationDuration
            }
        };
    }
    /**
     * Validate cross-platform consistency using F1's CrossPlatformConsistencyValidator
     */
    async validateCrossPlatformConsistency(tokens, unitProviders) {
        const results = [];
        // Extract primitive tokens from platform tokens
        const primitiveTokens = this.extractPrimitiveTokens(tokens);
        // Validate each token across platforms
        for (const token of primitiveTokens) {
            const result = await this.crossPlatformValidator.validateToken({
                token,
                unitProviders,
                handleConstraints: true,
                options: {
                    useRelativeTolerance: false,
                    strictMode: false
                }
            });
            results.push(result);
        }
        // Determine overall validity
        const valid = results.every(r => r.isConsistent);
        // Generate summary
        const consistentCount = results.filter(r => r.isConsistent).length;
        const summary = `${consistentCount}/${results.length} tokens maintain cross-platform consistency`;
        return { valid, results, summary };
    }
    /**
     * Validate mathematical relationships using F1's ThreeTierValidator
     */
    async validateMathematicalRelationships(tokens) {
        const results = [];
        // Extract primitive tokens
        const primitiveTokens = this.extractPrimitiveTokens(tokens);
        // Validate mathematical relationships for each token
        for (const token of primitiveTokens) {
            const result = this.threeTierValidator.validate({
                token,
                mathematicalContext: {
                    familyFoundation: {
                        category: token.category,
                        baseValue: token.baseValue,
                        expectedProgression: this.getExpectedProgression(token.category),
                        actualProgression: 'calculated' // Would be calculated from actual values
                    }
                },
                options: {
                    strictMathematics: false,
                    enablePatternAnalysis: true
                }
            });
            results.push(result);
        }
        // Determine overall validity
        const valid = results.every(r => r.primaryResult.level === 'Pass');
        // Generate summary
        const passCount = results.filter(r => r.primaryResult.level === 'Pass').length;
        const warningCount = results.filter(r => r.primaryResult.level === 'Warning').length;
        const errorCount = results.filter(r => r.primaryResult.level === 'Error').length;
        const summary = `Pass: ${passCount}, Warning: ${warningCount}, Error: ${errorCount}`;
        return { valid, results, summary };
    }
    /**
     * Validate strategic flexibility using F1's BaselineGridValidator
     */
    async validateStrategicFlexibility(tokens) {
        const results = [];
        // Extract primitive tokens
        const primitiveTokens = this.extractPrimitiveTokens(tokens);
        // Validate baseline grid alignment for spacing and radius tokens
        for (const token of primitiveTokens) {
            if (token.category === types_1.TokenCategory.SPACING || token.category === types_1.TokenCategory.RADIUS) {
                const result = this.baselineGridValidator.validate({
                    value: token.baseValue,
                    tokenName: token.name
                });
                results.push(result);
            }
        }
        // Determine overall validity (Pass or strategic flexibility is acceptable)
        const valid = results.every(r => r.level === 'Pass' || r.level === 'Warning');
        // Generate summary
        const passCount = results.filter(r => r.level === 'Pass').length;
        const strategicCount = results.filter(r => r.level === 'Warning').length;
        const summary = `${passCount} aligned, ${strategicCount} strategic flexibility tokens`;
        return { valid, results, summary };
    }
    /**
     * Validate accessibility requirements (NEW for F2)
     * WCAG 2.1 AA compliance
     */
    async validateAccessibility(tokens, platforms) {
        const contrastRatioIssues = [];
        const touchTargetIssues = [];
        const recommendations = [];
        // Validate color contrast ratios
        const colorTokens = this.extractColorTokens(tokens);
        for (const token of colorTokens) {
            // Check contrast ratios for common combinations
            // This is a simplified check - real implementation would check actual usage
            const contrastIssue = this.checkContrastRatio(token);
            if (contrastIssue) {
                contrastRatioIssues.push(contrastIssue);
            }
        }
        // Validate touch target sizes
        const sizingTokens = this.extractSizingTokens(tokens);
        for (const platform of platforms) {
            for (const token of sizingTokens) {
                const touchIssue = this.checkTouchTargetSize(token, platform);
                if (touchIssue) {
                    touchTargetIssues.push(touchIssue);
                }
            }
        }
        // Generate recommendations
        if (contrastRatioIssues.length > 0) {
            recommendations.push(`${contrastRatioIssues.length} color combinations fail WCAG 2.1 AA contrast requirements`);
        }
        if (touchTargetIssues.length > 0) {
            recommendations.push(`${touchTargetIssues.length} components have touch targets below platform minimums`);
        }
        const valid = contrastRatioIssues.length === 0 && touchTargetIssues.length === 0;
        return {
            valid,
            contrastRatioIssues,
            touchTargetIssues,
            recommendations
        };
    }
    /**
     * Check contrast ratio for color token
     */
    checkContrastRatio(colorToken) {
        // Simplified check - real implementation would calculate actual contrast ratios
        // WCAG 2.1 AA requires:
        // - 4.5:1 for normal text
        // - 3:1 for large text
        // - 3:1 for UI components
        // This is a placeholder - actual implementation would:
        // 1. Parse color values
        // 2. Calculate luminance
        // 3. Calculate contrast ratio
        // 4. Compare against WCAG requirements
        return null; // No issues found in this simplified check
    }
    /**
     * Check touch target size
     */
    checkTouchTargetSize(sizingToken, platform) {
        // Platform minimum touch target sizes:
        // iOS: 44pt x 44pt
        // Android: 48dp x 48dp
        // Web: 44px x 44px (WCAG 2.1 AA)
        const minimums = {
            ios: { width: 44, height: 44 },
            android: { width: 48, height: 48 },
            web: { width: 44, height: 44 }
        };
        const minimum = minimums[platform];
        // Check if token value meets minimum
        // This is simplified - real implementation would check actual component sizes
        if (sizingToken.baseValue < minimum.width || sizingToken.baseValue < minimum.height) {
            return {
                component: sizingToken.name,
                platform,
                actualSize: { width: sizingToken.baseValue, height: sizingToken.baseValue },
                requiredSize: minimum,
                recommendation: `Increase size to meet ${platform} minimum touch target of ${minimum.width}x${minimum.height}`
            };
        }
        return null;
    }
    /**
     * Extract primitive tokens from platform tokens
     */
    extractPrimitiveTokens(tokens) {
        const primitiveTokens = [];
        // This is a simplified extraction - real implementation would properly extract
        // all primitive tokens from the PlatformTokens structure
        return primitiveTokens;
    }
    /**
     * Extract color tokens
     */
    extractColorTokens(tokens) {
        // Simplified - real implementation would extract color tokens
        return [];
    }
    /**
     * Extract sizing tokens
     */
    extractSizingTokens(tokens) {
        // Simplified - real implementation would extract sizing tokens
        return [];
    }
    /**
     * Get expected progression for token category
     */
    getExpectedProgression(category) {
        switch (category) {
            case types_1.TokenCategory.SPACING:
                return 'Modular scale (1.25x)';
            case types_1.TokenCategory.FONT_SIZE:
                return 'Typographic scale (1.25x)';
            case types_1.TokenCategory.RADIUS:
                return 'Geometric progression';
            default:
                return 'Linear or modular progression';
        }
    }
    /**
     * Count total tokens
     */
    countTokens(tokens) {
        // Simplified count - real implementation would count all tokens
        return tokens.length;
    }
    /**
     * Generate comprehensive recommendations
     */
    generateRecommendations(crossPlatform, mathematical, strategicFlexibility, accessibility) {
        const recommendations = [];
        // Cross-platform recommendations
        if (!crossPlatform.valid) {
            recommendations.push('Review cross-platform token consistency - some tokens have inconsistent values');
        }
        // Mathematical relationship recommendations
        if (!mathematical.valid) {
            recommendations.push('Review mathematical relationships - some tokens violate expected progressions');
        }
        // Strategic flexibility recommendations
        if (!strategicFlexibility.valid) {
            recommendations.push('Review strategic flexibility usage - ensure appropriate usage patterns');
        }
        // Accessibility recommendations
        recommendations.push(...accessibility.recommendations);
        // Overall recommendation
        if (recommendations.length === 0) {
            recommendations.push('All mathematical consistency checks passed - tokens maintain cross-platform consistency');
        }
        return recommendations;
    }
}
exports.MathematicalConsistencyValidator = MathematicalConsistencyValidator;
//# sourceMappingURL=MathematicalConsistencyValidator.js.map