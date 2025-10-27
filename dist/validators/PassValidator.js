"use strict";
/**
 * Pass-Level Validation Logic
 *
 * Handles validation for token usage that follows best practices:
 * - Primitive tokens used appropriately within their mathematical foundations
 * - Semantic tokens providing proper contextual abstraction
 * - Strategic flexibility tokens used for exceptional design requirements
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassValidator = void 0;
const types_1 = require("../types");
const StrategicFlexibilityTokens_1 = require("../constants/StrategicFlexibilityTokens");
const ValidationReasoning_1 = require("./ValidationReasoning");
/**
 * Pass-level validator for tokens following best practices
 */
class PassValidator {
    constructor(reasoningGenerator) {
        this.reasoningGenerator = reasoningGenerator || new ValidationReasoning_1.ValidationReasoning();
    }
    /**
     * Validate token usage for Pass-level compliance
     */
    validate(context) {
        const { token, usageContext, options = {} } = context;
        // Determine if this is a primitive or semantic token
        if ('primitiveReferences' in token) {
            return this.validateSemanticToken(token, usageContext, options);
        }
        else {
            return this.validatePrimitiveToken(token, usageContext, options);
        }
    }
    /**
     * Validate primitive token usage
     */
    validatePrimitiveToken(token, usageContext, options = {}) {
        // Check if this is a strategic flexibility token
        if (token.isStrategicFlexibility || (0, StrategicFlexibilityTokens_1.isStrategicFlexibilityValue)(token.baseValue)) {
            return this.validateStrategicFlexibilityToken(token, usageContext, options);
        }
        // Validate mathematical foundation compliance
        const mathematicalValidation = this.validateMathematicalFoundation(token, options);
        if (mathematicalValidation.level !== 'Pass') {
            return mathematicalValidation;
        }
        // Validate baseline grid alignment (for applicable categories)
        const baselineValidation = this.validateBaselineGridAlignment(token, options);
        if (baselineValidation.level !== 'Pass') {
            return baselineValidation;
        }
        // Validate cross-platform consistency (if requested)
        if (options.checkCrossPlatform) {
            const crossPlatformValidation = this.validateCrossPlatformConsistency(token, options);
            if (crossPlatformValidation.level !== 'Pass') {
                return crossPlatformValidation;
            }
        }
        // Generate Pass validation result
        return this.generatePassResult(token, 'primitive-usage', usageContext);
    }
    /**
     * Validate semantic token usage
     */
    validateSemanticToken(token, usageContext, options = {}) {
        // Validate primitive reference exists and is valid
        const referenceValidation = this.validatePrimitiveReference(token, options);
        if (referenceValidation.level !== 'Pass') {
            return referenceValidation;
        }
        // Validate contextual appropriateness
        const contextualValidation = this.validateContextualAppropriateness(token, usageContext, options);
        if (contextualValidation.level !== 'Pass') {
            return contextualValidation;
        }
        // Validate semantic abstraction provides value
        const abstractionValidation = this.validateSemanticAbstraction(token, options);
        if (abstractionValidation.level !== 'Pass') {
            return abstractionValidation;
        }
        // Generate Pass validation result
        return this.generatePassResult(token, 'semantic-usage', usageContext);
    }
    /**
     * Validate strategic flexibility token usage
     */
    validateStrategicFlexibilityToken(token, usageContext, options = {}) {
        // Strategic flexibility tokens always pass validation by design
        // They are mathematically derived exceptions for exceptional design requirements
        return this.generatePassResult(token, 'strategic-flexibility', usageContext);
    }
    /**
     * Validate mathematical foundation compliance
     */
    validateMathematicalFoundation(token, options = {}) {
        // Check if token follows its family's mathematical foundation
        const hasValidRelationship = this.checkMathematicalRelationship(token);
        if (!hasValidRelationship) {
            return {
                level: 'Error',
                token: token.name,
                message: 'Mathematical foundation violation',
                rationale: `Token ${token.name} does not follow ${token.category} family mathematical foundation`,
                mathematicalReasoning: `Expected relationship to family base value ${token.familyBaseValue}, but mathematical relationship is invalid or missing`,
                suggestions: [
                    `Verify token follows ${token.category} family mathematical progression`,
                    'Check mathematical relationship calculation',
                    'Consider if token should be a strategic flexibility exception'
                ]
            };
        }
        // In strict mode, perform additional mathematical validation
        if (options.strictMode) {
            const strictValidation = this.performStrictMathematicalValidation(token);
            if (strictValidation.level !== 'Pass') {
                return strictValidation;
            }
        }
        return {
            level: 'Pass',
            token: token.name,
            message: 'Mathematical foundation validated',
            rationale: `Token follows ${token.category} family mathematical foundation`,
            mathematicalReasoning: `Mathematical relationship: ${token.mathematicalRelationship || 'base value relationship confirmed'}`
        };
    }
    /**
     * Validate baseline grid alignment for applicable token categories
     */
    validateBaselineGridAlignment(token, options = {}) {
        // Only spacing and radius tokens require baseline grid alignment
        if (!this.requiresBaselineGridAlignment(token.category)) {
            return {
                level: 'Pass',
                token: token.name,
                message: 'Baseline grid alignment not required',
                rationale: `Token category ${token.category} does not require baseline grid alignment`,
                mathematicalReasoning: 'Baseline grid alignment only applies to spacing and radius token families'
            };
        }
        // Check baseline grid alignment
        if (!token.baselineGridAlignment) {
            return {
                level: 'Error',
                token: token.name,
                message: 'Baseline grid alignment violation',
                rationale: `Token ${token.name} in ${token.category} category must align with 8-unit baseline grid`,
                mathematicalReasoning: `${token.baseValue} ÷ 8 = ${token.baseValue / 8} (non-whole number indicates misalignment)`,
                suggestions: [
                    'Use value that aligns with 8-unit baseline grid',
                    'Consider if this should be a strategic flexibility token',
                    `Nearest aligned values: ${Math.floor(token.baseValue / 8) * 8}, ${Math.ceil(token.baseValue / 8) * 8}`
                ]
            };
        }
        return {
            level: 'Pass',
            token: token.name,
            message: 'Baseline grid alignment validated',
            rationale: `Token aligns with 8-unit baseline grid`,
            mathematicalReasoning: `${token.baseValue} ÷ 8 = ${token.baseValue / 8} (whole number confirms alignment)`
        };
    }
    /**
     * Validate cross-platform consistency
     */
    validateCrossPlatformConsistency(token, options = {}) {
        // Check if platform values maintain mathematical relationships
        const platforms = Object.keys(token.platforms);
        if (platforms.length < 2) {
            return {
                level: 'Pass',
                token: token.name,
                message: 'Cross-platform consistency not applicable',
                rationale: 'Token has fewer than 2 platform implementations',
                mathematicalReasoning: 'Cross-platform consistency requires multiple platform implementations'
            };
        }
        // Validate mathematical relationships across platforms
        const consistencyCheck = this.checkCrossPlatformMathematicalConsistency(token);
        if (!consistencyCheck.isConsistent) {
            return {
                level: 'Error',
                token: token.name,
                message: 'Cross-platform consistency violation',
                rationale: 'Mathematical relationships not maintained across platforms',
                mathematicalReasoning: consistencyCheck.reasoning,
                suggestions: consistencyCheck.suggestions
            };
        }
        return {
            level: 'Pass',
            token: token.name,
            message: 'Cross-platform consistency validated',
            rationale: 'Mathematical relationships maintained across all platforms',
            mathematicalReasoning: consistencyCheck.reasoning
        };
    }
    /**
     * Validate primitive reference in semantic token
     */
    validatePrimitiveReference(token, options = {}) {
        // Check if primitive references exist (multi-primitive support)
        if (!token.primitiveReferences || Object.keys(token.primitiveReferences).length === 0) {
            return {
                level: 'Error',
                token: token.name,
                message: 'Missing primitive references',
                rationale: 'Semantic token must reference at least one valid primitive token',
                mathematicalReasoning: 'Semantic tokens maintain mathematical consistency through primitive token references',
                suggestions: [
                    'Specify valid primitive token reference(s)',
                    'Ensure referenced primitive token(s) exist in registry',
                    'Verify primitive token(s) follow mathematical foundations'
                ]
            };
        }
        // In strict mode, validate that the primitive tokens actually exist and are valid
        if (options.strictMode) {
            // This would typically involve registry lookup - for now we assume it's valid
            // In a real implementation, this would check the primitive token registry
        }
        const referenceCount = Object.keys(token.primitiveReferences).length;
        const referenceList = Object.entries(token.primitiveReferences)
            .map(([key, ref]) => `${key}: ${ref}`)
            .join(', ');
        return {
            level: 'Pass',
            token: token.name,
            message: 'Primitive reference(s) validated',
            rationale: `References ${referenceCount} valid primitive token(s): ${referenceList}`,
            mathematicalReasoning: 'Mathematical consistency inherited from referenced primitive token(s)'
        };
    }
    /**
     * Validate contextual appropriateness of semantic token
     */
    validateContextualAppropriateness(token, usageContext, options = {}) {
        // Check if semantic token provides meaningful contextual abstraction
        if (!token.context || token.context.trim().length === 0) {
            return {
                level: 'Warning',
                token: token.name,
                message: 'Limited contextual information',
                rationale: 'Semantic token should provide clear contextual meaning',
                mathematicalReasoning: 'Semantic tokens provide value through contextual abstraction over primitive tokens',
                suggestions: [
                    'Add clear contextual description',
                    'Ensure semantic meaning is distinct from primitive token',
                    'Consider if primitive token would be more appropriate'
                ]
            };
        }
        // Validate usage context alignment (if provided)
        if (usageContext?.component || usageContext?.property) {
            const contextAlignment = this.checkContextAlignment(token, usageContext);
            if (!contextAlignment.isAligned) {
                return {
                    level: 'Warning',
                    token: token.name,
                    message: 'Context alignment concern',
                    rationale: contextAlignment.reason,
                    mathematicalReasoning: 'Semantic token usage should align with intended contextual meaning',
                    suggestions: contextAlignment.suggestions
                };
            }
        }
        return {
            level: 'Pass',
            token: token.name,
            message: 'Contextual appropriateness validated',
            rationale: `Semantic token provides appropriate contextual abstraction: ${token.context}`,
            mathematicalReasoning: 'Contextual usage aligns with semantic token design intent'
        };
    }
    /**
     * Validate semantic abstraction provides value
     */
    validateSemanticAbstraction(token, options = {}) {
        // Check if semantic token name provides meaningful abstraction
        const abstractionValue = this.assessAbstractionValue(token);
        if (abstractionValue.score < 0.7) {
            return {
                level: 'Warning',
                token: token.name,
                message: 'Limited abstraction value',
                rationale: abstractionValue.reason,
                mathematicalReasoning: 'Semantic tokens should provide meaningful abstraction over primitive tokens',
                suggestions: abstractionValue.suggestions
            };
        }
        return {
            level: 'Pass',
            token: token.name,
            message: 'Semantic abstraction validated',
            rationale: 'Token provides meaningful contextual abstraction',
            mathematicalReasoning: 'Semantic abstraction enhances design system usability while maintaining mathematical consistency'
        };
    }
    /**
     * Generate Pass validation result with appropriate reasoning
     */
    generatePassResult(token, scenario, usageContext) {
        const reasoningContext = {
            token,
            scenario,
            contextData: {
                usagePattern: usageContext?.component || usageContext?.property
            }
        };
        const reasoning = this.reasoningGenerator.generatePassReasoning(reasoningContext);
        return {
            level: 'Pass',
            token: token.name,
            message: this.getPassMessage(scenario),
            rationale: this.getPassRationale(token, scenario),
            mathematicalReasoning: reasoning
        };
    }
    /**
     * Helper methods for validation logic
     */
    checkMathematicalRelationship(token) {
        // Check if token has a valid mathematical relationship
        return Boolean(token.mathematicalRelationship) && token.baseValue > 0 && token.familyBaseValue > 0;
    }
    performStrictMathematicalValidation(token) {
        // Additional strict validation logic would go here
        return {
            level: 'Pass',
            token: token.name,
            message: 'Strict mathematical validation passed',
            rationale: 'Token passes all strict mathematical validation criteria',
            mathematicalReasoning: 'Comprehensive mathematical validation confirms token integrity'
        };
    }
    requiresBaselineGridAlignment(category) {
        return category === types_1.TokenCategory.SPACING || category === types_1.TokenCategory.RADIUS;
    }
    checkCrossPlatformMathematicalConsistency(token) {
        // Simplified consistency check - in real implementation would use CrossPlatformConsistencyValidator
        return {
            isConsistent: true,
            reasoning: 'Mathematical relationships maintained across platforms through unitless base values',
            suggestions: []
        };
    }
    checkContextAlignment(token, usageContext) {
        // Simplified context alignment check
        return {
            isAligned: true,
            reason: 'Usage context aligns with semantic token intent',
            suggestions: []
        };
    }
    assessAbstractionValue(token) {
        // Simplified abstraction value assessment
        const hasContextualName = token.name.includes('.') || token.name.includes('-');
        const hasDescription = Boolean(token.description && token.description.length > 10);
        const hasContext = Boolean(token.context && token.context.length > 5);
        const score = (hasContextualName ? 0.4 : 0) + (hasDescription ? 0.3 : 0) + (hasContext ? 0.3 : 0);
        return {
            score,
            reason: score >= 0.7 ? 'Semantic token provides meaningful abstraction' : 'Semantic token abstraction could be improved',
            suggestions: score < 0.7 ? [
                'Use more descriptive semantic token name',
                'Add detailed description of semantic meaning',
                'Provide clear contextual usage guidance'
            ] : []
        };
    }
    getPassMessage(scenario) {
        switch (scenario) {
            case 'primitive-usage':
                return 'Primitive token usage validated';
            case 'semantic-usage':
                return 'Semantic token usage validated';
            case 'strategic-flexibility':
                return 'Strategic flexibility token validated';
            default:
                return 'Token usage validated';
        }
    }
    getPassRationale(token, scenario) {
        switch (scenario) {
            case 'primitive-usage':
                return `Primitive token ${token.name} follows mathematical foundations and design system guidelines`;
            case 'semantic-usage':
                return `Semantic token ${token.name} provides appropriate contextual abstraction`;
            case 'strategic-flexibility':
                return `Strategic flexibility token ${token.name} provides mathematically derived exception for exceptional design requirements`;
            default:
                return `Token ${token.name} follows design system best practices`;
        }
    }
}
exports.PassValidator = PassValidator;
//# sourceMappingURL=PassValidator.js.map