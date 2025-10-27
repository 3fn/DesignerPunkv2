"use strict";
/**
 * Mathematical Reasoning Explanations for Validation System
 *
 * Provides clear mathematical reasoning and explanations for validation decisions
 * across the three-tier validation system (Pass/Warning/Error).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationReasoning = void 0;
const types_1 = require("../types");
const StrategicFlexibilityTokens_1 = require("../constants/StrategicFlexibilityTokens");
/**
 * Mathematical reasoning generator for validation results
 */
class ValidationReasoning {
    /**
     * Generate mathematical reasoning for Pass-level validation
     */
    generatePassReasoning(context) {
        const { token, scenario, contextData } = context;
        switch (scenario) {
            case 'primitive-usage':
                return this.generatePrimitivePassReasoning(token, contextData);
            case 'semantic-usage':
                return this.generateSemanticPassReasoning(token, contextData);
            case 'strategic-flexibility':
                return this.generateStrategicFlexibilityReasoning(token, contextData);
            default:
                return 'Token usage follows established mathematical patterns and design system guidelines';
        }
    }
    /**
     * Generate mathematical reasoning for Warning-level validation
     */
    generateWarningReasoning(context) {
        const { token, scenario, contextData } = context;
        switch (scenario) {
            case 'problematic-pattern':
                return this.generateProblematicPatternReasoning(token, contextData);
            default:
                return 'Token usage is mathematically valid but may indicate suboptimal design patterns';
        }
    }
    /**
     * Generate mathematical reasoning for Error-level validation
     */
    generateErrorReasoning(context) {
        const { token, scenario, contextData } = context;
        switch (scenario) {
            case 'mathematical-violation':
                return this.generateMathematicalViolationReasoning(token, contextData);
            default:
                return 'Token usage violates mathematical relationships or design system constraints';
        }
    }
    /**
     * Generate reasoning for primitive token Pass validation
     */
    generatePrimitivePassReasoning(token, contextData) {
        const reasoningParts = [];
        // Base mathematical relationship
        reasoningParts.push(`Token ${token.name} follows ${token.category} family mathematical foundation with base value ${token.familyBaseValue}`);
        // Mathematical relationship explanation
        if (token.mathematicalRelationship) {
            reasoningParts.push(`Mathematical relationship: ${token.mathematicalRelationship}`);
        }
        // Baseline grid alignment (for applicable categories)
        if (this.requiresBaselineGridAlignment(token.category)) {
            if (token.baselineGridAlignment) {
                reasoningParts.push(`Baseline grid alignment: ${token.baseValue} ÷ 8 = ${token.baseValue / 8} (confirms 8-unit alignment)`);
            }
        }
        // Precision targeting (for applicable categories)
        if (token.isPrecisionTargeted) {
            reasoningParts.push(`Precision targeting: Uses calculated multipliers for systematic alignment with ${token.category} requirements`);
        }
        // Cross-platform consistency
        reasoningParts.push('Cross-platform mathematical relationships maintained through unitless base values and per-family unit conversion');
        return reasoningParts.join('; ');
    }
    /**
     * Generate reasoning for semantic token Pass validation
     */
    generateSemanticPassReasoning(token, contextData) {
        const reasoningParts = [];
        // Semantic abstraction explanation
        const referenceList = Object.entries(token.primitiveReferences)
            .map(([key, ref]) => `${key}: ${ref}`)
            .join(', ');
        reasoningParts.push(`Semantic token ${token.name} provides contextual abstraction over primitive token(s): ${referenceList}`);
        // Mathematical inheritance
        reasoningParts.push('Mathematical consistency inherited from referenced primitive token');
        // Contextual appropriateness
        if (token.context) {
            reasoningParts.push(`Contextual usage: ${token.context}`);
        }
        // Design system hierarchy
        reasoningParts.push('Follows design system hierarchy: semantic tokens reference primitives, maintaining mathematical relationships');
        return reasoningParts.join('; ');
    }
    /**
     * Generate reasoning for strategic flexibility token validation
     */
    generateStrategicFlexibilityReasoning(token, contextData) {
        const flexibilityToken = (0, StrategicFlexibilityTokens_1.getStrategicFlexibilityToken)(token.baseValue);
        if (!flexibilityToken) {
            return 'Strategic flexibility token with mathematically derived exception to systematic progression';
        }
        const reasoningParts = [];
        // Mathematical derivation
        reasoningParts.push(`Strategic flexibility token: ${flexibilityToken.derivation} = ${flexibilityToken.value}`);
        // Exception explanation
        reasoningParts.push(`Intentionally breaks ${flexibilityToken.category} family systematic progression for exceptional design requirements`);
        // Mathematical validity
        reasoningParts.push('Mathematically derived but provides necessary design flexibility while maintaining proportional relationships');
        // Usage guidance
        reasoningParts.push('Strategic flexibility tokens should maintain ≥80% appropriate usage patterns across the design system');
        return reasoningParts.join('; ');
    }
    /**
     * Generate reasoning for problematic pattern warnings
     */
    generateProblematicPatternReasoning(token, contextData) {
        const reasoningParts = [];
        // Pattern identification
        if (contextData?.usagePattern) {
            reasoningParts.push(`Detected pattern: ${contextData.usagePattern}`);
        }
        // Mathematical validity confirmation
        reasoningParts.push('Token usage is mathematically valid within design system constraints');
        // Potential issues
        reasoningParts.push('Pattern may indicate suboptimal design decisions or missed opportunities for semantic token usage');
        // Guidance
        if ('primitiveReference' in token) {
            // Semantic token
            reasoningParts.push('Consider if primitive token fallback is necessary or if semantic token alternatives exist');
        }
        else {
            // Primitive token
            reasoningParts.push('Consider if semantic token abstraction would be more appropriate for this usage context');
        }
        return reasoningParts.join('; ');
    }
    /**
     * Generate reasoning for mathematical violation errors
     */
    generateMathematicalViolationReasoning(token, contextData) {
        const reasoningParts = [];
        // Violation identification
        if (contextData?.expectedValue && contextData?.actualValue) {
            reasoningParts.push(`Mathematical violation: expected ${contextData.expectedValue}, found ${contextData.actualValue}`);
        }
        // Mathematical relationship breakdown
        if (contextData?.relationship) {
            reasoningParts.push(`Violated relationship: ${contextData.relationship}`);
        }
        // Baseline grid violation (if applicable)
        if (contextData?.baselineGridInfo && !contextData.baselineGridInfo.isAligned) {
            const { gridUnit, nearestValid } = contextData.baselineGridInfo;
            reasoningParts.push(`Baseline grid violation: value does not align with ${gridUnit}-unit grid system`);
            if (nearestValid) {
                reasoningParts.push(`Nearest valid value: ${nearestValid}`);
            }
        }
        // Cross-platform consistency issues
        if (contextData?.platformInfo) {
            const platforms = Object.keys(contextData.platformInfo);
            reasoningParts.push(`Cross-platform consistency violation detected across platforms: ${platforms.join(', ')}`);
        }
        // Impact explanation
        reasoningParts.push('Mathematical violations compromise design system consistency and cross-platform predictability');
        return reasoningParts.join('; ');
    }
    /**
     * Generate suggestions for improving token usage
     */
    generateSuggestions(context) {
        const { token, scenario, contextData } = context;
        const suggestions = [];
        switch (scenario) {
            case 'mathematical-violation':
                suggestions.push(...this.generateViolationSuggestions(token, contextData));
                break;
            case 'problematic-pattern':
                suggestions.push(...this.generatePatternSuggestions(token, contextData));
                break;
            case 'strategic-flexibility':
                suggestions.push(...this.generateFlexibilitySuggestions(token, contextData));
                break;
        }
        return suggestions;
    }
    /**
     * Generate suggestions for mathematical violations
     */
    generateViolationSuggestions(token, contextData) {
        const suggestions = [];
        // Baseline grid suggestions
        if (contextData?.baselineGridInfo && !contextData.baselineGridInfo.isAligned) {
            const { nearestValid } = contextData.baselineGridInfo;
            if (nearestValid) {
                suggestions.push(`Use baseline grid aligned value: ${nearestValid}`);
            }
            suggestions.push('Consider if this should be a strategic flexibility token');
        }
        // Semantic token suggestions
        if ('baseValue' in token) {
            suggestions.push('Consider using semantic token abstraction instead of primitive token');
            suggestions.push('Review if token fits within established mathematical progressions');
        }
        // Mathematical relationship suggestions
        if (contextData?.relationship) {
            suggestions.push(`Ensure token follows relationship: ${contextData.relationship}`);
        }
        return suggestions;
    }
    /**
     * Generate suggestions for problematic patterns
     */
    generatePatternSuggestions(token, contextData) {
        const suggestions = [];
        if ('primitiveReference' in token) {
            // Semantic token
            suggestions.push('Verify semantic token provides appropriate contextual abstraction');
            suggestions.push('Consider if primitive token reference is the most appropriate choice');
        }
        else {
            // Primitive token
            suggestions.push('Consider creating semantic token for this usage context');
            suggestions.push('Review if token usage follows established design patterns');
        }
        suggestions.push('Validate usage pattern against design system guidelines');
        return suggestions;
    }
    /**
     * Generate suggestions for strategic flexibility usage
     */
    generateFlexibilitySuggestions(token, contextData) {
        const suggestions = [];
        suggestions.push('Monitor strategic flexibility usage to maintain ≥80% appropriate usage');
        suggestions.push('Consider if semantic token alternative would be more appropriate');
        suggestions.push('Document rationale for strategic flexibility usage');
        suggestions.push('Review if usage pattern indicates need for new semantic token');
        return suggestions;
    }
    /**
     * Check if token category requires baseline grid alignment
     */
    requiresBaselineGridAlignment(category) {
        return category === types_1.TokenCategory.SPACING || category === types_1.TokenCategory.RADIUS;
    }
    /**
     * Generate comprehensive mathematical explanation
     */
    generateComprehensiveExplanation(context) {
        const reasoning = this.generatePassReasoning(context);
        const suggestions = this.generateSuggestions(context);
        // Generate detailed mathematical explanation
        const mathematicalDetails = this.generateMathematicalDetails(context);
        return {
            reasoning,
            suggestions,
            mathematicalDetails
        };
    }
    /**
     * Generate detailed mathematical explanation
     */
    generateMathematicalDetails(context) {
        const { token, contextData } = context;
        const details = [];
        if ('baseValue' in token) {
            // Primitive token details
            details.push(`Base value: ${token.baseValue} (unitless)`);
            details.push(`Family base: ${token.familyBaseValue}`);
            details.push(`Category: ${token.category}`);
            if (token.mathematicalRelationship) {
                details.push(`Relationship: ${token.mathematicalRelationship}`);
            }
        }
        else {
            // Semantic token details
            const references = Object.entries(token.primitiveReferences);
            // For single 'default' reference, show simplified format
            if (references.length === 1 && references[0][0] === 'default') {
                details.push(`Semantic reference: ${references[0][1]}`);
            }
            else {
                // For multi-primitive or non-default keys, show full format
                const referenceList = references
                    .map(([key, ref]) => `${key}: ${ref}`)
                    .join(', ');
                details.push(`Semantic references: ${referenceList}`);
            }
            details.push(`Category: ${token.category}`);
            details.push(`Context: ${token.context}`);
        }
        // Add contextual mathematical details
        if (contextData?.baselineGridInfo) {
            const { gridUnit, isAligned } = contextData.baselineGridInfo;
            details.push(`Baseline grid (${gridUnit}px): ${isAligned ? 'aligned' : 'not aligned'}`);
        }
        return details.join('; ');
    }
}
exports.ValidationReasoning = ValidationReasoning;
//# sourceMappingURL=ValidationReasoning.js.map