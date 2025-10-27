"use strict";
/**
 * Documentation Guard
 *
 * Enforces concept-based documentation approach and blocks code example
 * generation in documentation to prevent contamination vectors.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentationGuard = void 0;
const ContaminationPrevention_1 = require("./ContaminationPrevention");
/**
 * DocumentationGuard
 *
 * Guards documentation generation and validation to ensure concept-based
 * approach is maintained and contamination vectors are prevented.
 */
class DocumentationGuard {
    constructor(config = {}) {
        this.config = {
            blockCodeExamples: true,
            blockImplementationDetails: true,
            allowTypeDefinitions: false,
            strictConceptEnforcement: true,
            ...config
        };
        this.contaminationPrevention = new ContaminationPrevention_1.ContaminationPrevention({
            enableCodeExampleBlocking: this.config.blockCodeExamples,
            enableImplementationDetailBlocking: this.config.blockImplementationDetails,
            strictMode: this.config.strictConceptEnforcement
        });
    }
    /**
     * Validate documentation content
     */
    validateDocumentation(content, documentType = 'general') {
        const contaminationCheck = this.contaminationPrevention.checkContent(content, documentType);
        const approach = this.determineApproach(content, contaminationCheck);
        const feedback = this.generateFeedback(approach, contaminationCheck);
        const blockedActions = this.determineBlockedActions(contaminationCheck);
        return {
            isValid: contaminationCheck.isClean && approach === 'concept-based',
            approach,
            contaminationCheck,
            feedback,
            blockedActions
        };
    }
    /**
     * Determine documentation approach
     */
    determineApproach(content, contaminationCheck) {
        const hasCodeVectors = contaminationCheck.vectors.some(v => v.type === 'code-example' || v.type === 'implementation-detail');
        const hasConceptualContent = this.hasConceptualContent(content);
        if (!hasCodeVectors && hasConceptualContent) {
            return 'concept-based';
        }
        else if (hasCodeVectors && !hasConceptualContent) {
            return 'code-based';
        }
        else {
            return 'mixed';
        }
    }
    /**
     * Check if content has conceptual explanations
     */
    hasConceptualContent(content) {
        const conceptualIndicators = [
            /mathematical relationship/gi,
            /design principle/gi,
            /token usage pattern/gi,
            /semantic meaning/gi,
            /baseline grid/gi,
            /modular scale/gi,
            /cross-platform consistency/gi,
            /strategic flexibility/gi
        ];
        return conceptualIndicators.some(pattern => pattern.test(content));
    }
    /**
     * Generate feedback for documentation validation
     */
    generateFeedback(approach, contaminationCheck) {
        const feedback = [];
        switch (approach) {
            case 'concept-based':
                feedback.push('✅ Documentation follows concept-based approach.');
                break;
            case 'code-based':
                feedback.push('❌ Documentation is code-based. Convert to concept-based approach.');
                feedback.push('Focus on mathematical relationships, design principles, and usage patterns.');
                break;
            case 'mixed':
                feedback.push('⚠️ Documentation mixes concepts and code. Remove code examples.');
                feedback.push('Maintain conceptual explanations while removing implementation details.');
                break;
        }
        if (!contaminationCheck.isClean) {
            feedback.push('');
            feedback.push('Contamination Issues:');
            feedback.push(contaminationCheck.summary);
            feedback.push('');
            feedback.push('Recommendations:');
            feedback.push(...contaminationCheck.recommendations.map(r => `  • ${r}`));
        }
        return feedback;
    }
    /**
     * Determine what actions should be blocked
     */
    determineBlockedActions(contaminationCheck) {
        const blocked = [];
        if (!contaminationCheck.isClean) {
            const criticalVectors = contaminationCheck.vectors.filter(v => v.severity === 'critical' || v.severity === 'high');
            if (criticalVectors.length > 0) {
                blocked.push('Documentation publication blocked due to contamination vectors.');
                blocked.push('Code example generation blocked.');
                blocked.push('Implementation detail documentation blocked.');
            }
        }
        return blocked;
    }
    /**
     * Block code example generation
     */
    blockCodeExampleGeneration(requestContext) {
        if (!this.config.blockCodeExamples) {
            return {
                blocked: false,
                reason: 'Code example blocking is disabled.',
                alternative: ''
            };
        }
        return {
            blocked: true,
            reason: 'Code examples are blocked to prevent contamination vectors that could degrade mathematical consistency.',
            alternative: 'Provide concept-based explanations of mathematical relationships, token usage patterns, and design principles instead.'
        };
    }
    /**
     * Suggest concept-based alternative
     */
    suggestConceptBasedAlternative(codeExample) {
        // Analyze code example to suggest conceptual alternative
        const suggestions = [];
        if (/space\d+|fontSize\d+|radius\d+/.test(codeExample)) {
            suggestions.push('Describe the token usage pattern and mathematical relationship.');
            suggestions.push('Example: "Use spacing tokens from the space family (space100, space150, etc.) which follow 8-unit baseline grid alignment."');
        }
        if (/const|let|var/.test(codeExample)) {
            suggestions.push('Explain the concept without showing variable declarations.');
            suggestions.push('Focus on what the token represents and when to use it.');
        }
        if (/function|class/.test(codeExample)) {
            suggestions.push('Describe the behavior and purpose without implementation details.');
            suggestions.push('Explain the mathematical validation or transformation conceptually.');
        }
        if (suggestions.length === 0) {
            suggestions.push('Replace code with conceptual explanation of the design principle or token usage pattern.');
        }
        return suggestions.join('\n');
    }
    /**
     * Validate token documentation
     */
    validateTokenDocumentation(tokenName, documentation) {
        const result = this.validateDocumentation(documentation, 'token-documentation');
        // Additional validation for token documentation
        const hasTokenName = documentation.includes(tokenName);
        const hasMathematicalContext = /base value|mathematical relationship|baseline grid|modular scale/.test(documentation);
        if (!hasTokenName) {
            result.feedback.push(`⚠️ Token documentation should reference the token name: ${tokenName}`);
        }
        if (!hasMathematicalContext) {
            result.feedback.push('⚠️ Token documentation should explain mathematical relationships and usage context.');
        }
        return result;
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
        // Update contamination prevention config
        this.contaminationPrevention.updateConfig({
            enableCodeExampleBlocking: this.config.blockCodeExamples,
            enableImplementationDetailBlocking: this.config.blockImplementationDetails,
            strictMode: this.config.strictConceptEnforcement
        });
    }
}
exports.DocumentationGuard = DocumentationGuard;
//# sourceMappingURL=DocumentationGuard.js.map