"use strict";
/**
 * Semantic Token Validator
 *
 * Comprehensive validation for semantic tokens including primitive reference validation,
 * composition pattern validation, and semantic token hierarchy enforcement.
 * Coordinates validation across multiple validation components.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticTokenValidator = void 0;
const PrimitiveReferenceValidator_1 = require("./PrimitiveReferenceValidator");
const CompositionPatternValidator_1 = require("./CompositionPatternValidator");
class SemanticTokenValidator {
    constructor(primitiveRegistry, semanticRegistry) {
        this.primitiveReferenceValidator = new PrimitiveReferenceValidator_1.PrimitiveReferenceValidator(primitiveRegistry);
        this.compositionPatternValidator = new CompositionPatternValidator_1.CompositionPatternValidator(semanticRegistry);
    }
    /**
     * Perform comprehensive validation on a semantic token
     */
    validate(semanticToken, options = {}) {
        const { validatePrimitiveReferences = true, validateCompositionPatterns = true, allowEmptyReferences = false, strictValidation = true } = options;
        const validationResults = [];
        let primitiveReferencesResult;
        let compositionPatternResult;
        // Validate primitive references
        if (validatePrimitiveReferences) {
            primitiveReferencesResult = this.primitiveReferenceValidator.validate(semanticToken, {
                allowEmptyReferences,
                strictValidation
            });
            validationResults.push(primitiveReferencesResult);
        }
        // Validate composition patterns (basic semantic token structure)
        if (validateCompositionPatterns) {
            compositionPatternResult = this.validateSemanticStructure(semanticToken);
            validationResults.push(compositionPatternResult);
        }
        // Determine overall validation result
        const overall = this.determineOverallResult(semanticToken, validationResults);
        // Gather validation details
        const details = {
            hasValidReferences: primitiveReferencesResult?.level === 'Pass',
            referenceCount: Object.keys(semanticToken.primitiveReferences || {}).length,
            usesRawValues: primitiveReferencesResult?.message.includes('raw values') || false,
            validationTimestamp: new Date()
        };
        return {
            overall,
            primitiveReferences: primitiveReferencesResult,
            compositionPattern: compositionPatternResult,
            details
        };
    }
    /**
     * Validate semantic token structure and hierarchy
     */
    validateSemanticStructure(semanticToken) {
        // Check required fields
        if (!semanticToken.name || semanticToken.name.trim() === '') {
            return {
                level: 'Error',
                token: semanticToken.name || 'unnamed',
                message: 'Semantic token missing required name',
                rationale: 'Semantic token must have a valid name',
                mathematicalReasoning: 'Token identification is required for proper system organization'
            };
        }
        if (!semanticToken.category) {
            return {
                level: 'Error',
                token: semanticToken.name,
                message: 'Semantic token missing required category',
                rationale: 'Semantic token must have a valid category',
                mathematicalReasoning: 'Token categorization is required for proper system organization'
            };
        }
        if (!semanticToken.description || semanticToken.description.trim() === '') {
            return {
                level: 'Warning',
                token: semanticToken.name,
                message: 'Semantic token missing description',
                rationale: 'Semantic token should have a description for clarity',
                suggestions: ['Add a description explaining the semantic meaning and usage'],
                mathematicalReasoning: 'Documentation improves token system maintainability'
            };
        }
        // Structure is valid
        return {
            level: 'Pass',
            token: semanticToken.name,
            message: 'Semantic token structure is valid',
            rationale: `Semantic token ${semanticToken.name} has all required fields`,
            mathematicalReasoning: 'Proper token structure maintains system organization and clarity'
        };
    }
    /**
     * Determine overall validation result from multiple validation results
     */
    determineOverallResult(semanticToken, validationResults) {
        // Check for any errors
        const errors = validationResults.filter(r => r.level === 'Error');
        if (errors.length > 0) {
            return {
                level: 'Error',
                token: semanticToken.name,
                message: `Semantic token validation failed with ${errors.length} error(s)`,
                rationale: errors.map(e => e.message).join('; '),
                suggestions: errors.flatMap(e => e.suggestions || []),
                mathematicalReasoning: 'Semantic token must pass all validation checks to maintain system integrity'
            };
        }
        // Check for warnings
        const warnings = validationResults.filter(r => r.level === 'Warning');
        if (warnings.length > 0) {
            return {
                level: 'Warning',
                token: semanticToken.name,
                message: `Semantic token validation passed with ${warnings.length} warning(s)`,
                rationale: warnings.map(w => w.message).join('; '),
                suggestions: warnings.flatMap(w => w.suggestions || []),
                mathematicalReasoning: 'Semantic token is valid but could be improved'
            };
        }
        // All validations passed
        return {
            level: 'Pass',
            token: semanticToken.name,
            message: 'Semantic token validation passed',
            rationale: `Semantic token ${semanticToken.name} passed all validation checks`,
            mathematicalReasoning: 'Semantic token maintains proper hierarchy and mathematical consistency'
        };
    }
    /**
     * Validate multiple semantic tokens
     */
    validateMultiple(semanticTokens, options = {}) {
        return semanticTokens.map(token => this.validate(token, options));
    }
    /**
     * Get validation statistics for multiple tokens
     */
    getValidationStats(validationResults) {
        const total = validationResults.length;
        const passed = validationResults.filter(r => r.overall.level === 'Pass').length;
        const warnings = validationResults.filter(r => r.overall.level === 'Warning').length;
        const errors = validationResults.filter(r => r.overall.level === 'Error').length;
        const withValidReferences = validationResults.filter(r => r.details.hasValidReferences).length;
        const withRawValues = validationResults.filter(r => r.details.usesRawValues).length;
        const passRate = total > 0 ? (passed / total) * 100 : 0;
        return {
            total,
            passed,
            warnings,
            errors,
            withValidReferences,
            withRawValues,
            passRate
        };
    }
    /**
     * Get primitive reference validator for direct access
     */
    getPrimitiveReferenceValidator() {
        return this.primitiveReferenceValidator;
    }
    /**
     * Get composition pattern validator for direct access
     */
    getCompositionPatternValidator() {
        return this.compositionPatternValidator;
    }
}
exports.SemanticTokenValidator = SemanticTokenValidator;
//# sourceMappingURL=SemanticTokenValidator.js.map