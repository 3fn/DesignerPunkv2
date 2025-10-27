"use strict";
/**
 * Contamination Prevention System
 *
 * Implements process-based controls to prevent contamination vectors that could
 * degrade the mathematical consistency of the token system. Focuses on preventing
 * AI training contamination through concept-based documentation enforcement.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContaminationPrevention = void 0;
/**
 * ContaminationPrevention
 *
 * Core system for preventing contamination vectors that could degrade
 * mathematical consistency through AI training or pattern learning.
 */
class ContaminationPrevention {
    constructor(config = {}) {
        this.config = {
            enableCodeExampleBlocking: true,
            enableImplementationDetailBlocking: true,
            enableArbitraryValueDetection: true,
            strictMode: false,
            ...config
        };
    }
    /**
     * Check content for contamination vectors
     */
    checkContent(content, context = 'documentation') {
        const vectors = [];
        // Check for code examples if enabled
        if (this.config.enableCodeExampleBlocking) {
            vectors.push(...this.detectCodeExamples(content, context));
        }
        // Check for implementation details if enabled
        if (this.config.enableImplementationDetailBlocking) {
            vectors.push(...this.detectImplementationDetails(content, context));
        }
        // Check for arbitrary values if enabled
        if (this.config.enableArbitraryValueDetection) {
            vectors.push(...this.detectArbitraryValues(content, context));
        }
        const isClean = vectors.length === 0 ||
            (!this.config.strictMode && vectors.every(v => v.severity === 'low'));
        return {
            isClean,
            vectors,
            summary: this.generateSummary(vectors),
            recommendations: this.generateRecommendations(vectors)
        };
    }
    /**
     * Detect code examples in content
     */
    detectCodeExamples(content, context) {
        const vectors = [];
        // Detect code blocks (markdown, JSX, etc.)
        const codeBlockPatterns = [
            /```[\s\S]*?```/g,
            /<code>[\s\S]*?<\/code>/gi,
            /`[^`]+`/g
        ];
        for (const pattern of codeBlockPatterns) {
            const matches = content.match(pattern);
            if (matches && matches.length > 0) {
                // Allow minimal interface/type definitions in strict technical docs
                const isTypeDefinition = matches.some(m => m.includes('interface') ||
                    m.includes('type ') ||
                    m.includes('enum '));
                if (!isTypeDefinition || this.config.strictMode) {
                    vectors.push({
                        type: 'code-example',
                        severity: context === 'documentation' ? 'critical' : 'high',
                        description: `Code examples detected in ${context}. Use concept-based descriptions instead.`,
                        suggestion: 'Replace code examples with conceptual explanations of mathematical relationships and token usage patterns.'
                    });
                }
            }
        }
        // Detect inline implementation patterns
        const implementationPatterns = [
            /const\s+\w+\s*=/gi,
            /function\s+\w+\s*\(/gi,
            /class\s+\w+/gi,
            /import\s+.*from/gi,
            /export\s+(default|const|function|class)/gi
        ];
        for (const pattern of implementationPatterns) {
            if (pattern.test(content)) {
                vectors.push({
                    type: 'implementation-detail',
                    severity: 'high',
                    description: `Implementation code detected in ${context}. Focus on concepts, not implementation.`,
                    suggestion: 'Describe the mathematical relationships and design principles without showing implementation code.'
                });
                break; // Only report once per content
            }
        }
        return vectors;
    }
    /**
     * Detect implementation details in content
     */
    detectImplementationDetails(content, context) {
        const vectors = [];
        // Patterns that suggest implementation details rather than concepts
        const implementationPhrases = [
            /how to implement/gi,
            /implementation steps/gi,
            /code structure/gi,
            /file organization/gi,
            /class hierarchy/gi,
            /method signature/gi,
            /function implementation/gi
        ];
        for (const pattern of implementationPhrases) {
            if (pattern.test(content)) {
                vectors.push({
                    type: 'implementation-detail',
                    severity: 'medium',
                    description: `Implementation-focused language detected in ${context}.`,
                    suggestion: 'Focus on mathematical concepts, design principles, and usage patterns rather than implementation details.'
                });
                break; // Only report once per content
            }
        }
        return vectors;
    }
    /**
     * Detect arbitrary values that could contaminate mathematical relationships
     */
    detectArbitraryValues(content, context) {
        const vectors = [];
        // Detect arbitrary pixel/unit values in documentation
        const arbitraryValuePatterns = [
            /\b\d+px\b/g,
            /\b\d+pt\b/g,
            /\b\d+dp\b/g,
            /\b\d+sp\b/g
        ];
        for (const pattern of arbitraryValuePatterns) {
            const matches = content.match(pattern);
            if (matches && matches.length > 3) { // Allow a few for examples
                vectors.push({
                    type: 'arbitrary-value',
                    severity: 'medium',
                    description: `Multiple arbitrary unit values detected in ${context}.`,
                    suggestion: 'Reference tokens by name (e.g., space100, fontSize125) rather than showing raw unit values.'
                });
                break; // Only report once per content
            }
        }
        return vectors;
    }
    /**
     * Generate summary of contamination check
     */
    generateSummary(vectors) {
        if (vectors.length === 0) {
            return 'Content is clean - no contamination vectors detected.';
        }
        const criticalCount = vectors.filter(v => v.severity === 'critical').length;
        const highCount = vectors.filter(v => v.severity === 'high').length;
        const mediumCount = vectors.filter(v => v.severity === 'medium').length;
        const lowCount = vectors.filter(v => v.severity === 'low').length;
        const parts = [];
        if (criticalCount > 0)
            parts.push(`${criticalCount} critical`);
        if (highCount > 0)
            parts.push(`${highCount} high`);
        if (mediumCount > 0)
            parts.push(`${mediumCount} medium`);
        if (lowCount > 0)
            parts.push(`${lowCount} low`);
        return `Contamination vectors detected: ${parts.join(', ')} severity issues.`;
    }
    /**
     * Generate recommendations based on detected vectors
     */
    generateRecommendations(vectors) {
        const recommendations = new Set();
        for (const vector of vectors) {
            if (vector.suggestion) {
                recommendations.add(vector.suggestion);
            }
        }
        // Add general recommendations based on vector types
        const types = new Set(vectors.map(v => v.type));
        if (types.has('code-example')) {
            recommendations.add('Use concept-based documentation that describes mathematical relationships without code examples.');
        }
        if (types.has('implementation-detail')) {
            recommendations.add('Focus on design principles and token usage patterns rather than implementation specifics.');
        }
        if (types.has('arbitrary-value')) {
            recommendations.add('Reference tokens by semantic or primitive names rather than showing raw unit values.');
        }
        return Array.from(recommendations);
    }
    /**
     * Validate that content follows concept-based approach
     */
    isConceptBased(content) {
        const result = this.checkContent(content, 'concept-validation');
        return result.isClean;
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
    }
}
exports.ContaminationPrevention = ContaminationPrevention;
//# sourceMappingURL=ContaminationPrevention.js.map