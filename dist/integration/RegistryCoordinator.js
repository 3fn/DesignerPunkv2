"use strict";
/**
 * Registry Coordinator
 *
 * Coordinates interactions between PrimitiveTokenRegistry and SemanticTokenRegistry
 * to ensure consistent token registration, validation, and dependency management.
 * Handles batch operations and maintains referential integrity between registries.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistryCoordinator = void 0;
/**
 * Registry Coordinator class managing interactions between token registries
 */
class RegistryCoordinator {
    constructor(primitiveRegistry, semanticRegistry) {
        this.registrationHistory = [];
        this.primitiveRegistry = primitiveRegistry;
        this.semanticRegistry = semanticRegistry;
    }
    // ============================================================================
    // Primitive Token Registration
    // ============================================================================
    /**
     * Register a primitive token with coordination
     *
     * Note: This method no longer returns ValidationResult. Validation should be
     * performed by the caller before registration. Registration either succeeds
     * (returns void) or throws an error.
     */
    registerPrimitive(token, options = {}) {
        this.primitiveRegistry.register(token, options);
        // Record successful registration
        const successResult = {
            level: 'Pass',
            token: token.name,
            message: 'Token registered successfully',
            rationale: 'Registration completed',
            mathematicalReasoning: 'N/A',
            suggestions: []
        };
        this.recordRegistration(token.name, 'primitive', successResult);
    }
    /**
     * Register multiple primitive tokens in batch
     *
     * Note: This method no longer returns ValidationResult[]. Validation should be
     * performed by the caller before registration. Registration either succeeds
     * (returns void) or throws an error for each token.
     */
    registerPrimitiveBatch(tokens, options = {}) {
        for (const token of tokens) {
            this.registerPrimitive(token, options);
        }
    }
    // ============================================================================
    // Semantic Token Registration
    // ============================================================================
    /**
     * Register a semantic token with coordination and dependency validation
     *
     * Note: This method no longer returns ValidationResult. Validation should be
     * performed by the caller before registration. This method only checks for
     * unresolved primitive references and either succeeds (returns void) or throws an error.
     */
    registerSemantic(token, options = {}) {
        // Validate all primitive references exist before registration
        const unresolvedRefs = this.validatePrimitiveReferences(token);
        if (unresolvedRefs.length > 0 && !options.skipValidation) {
            const errorMessage = `Unresolved primitive token references: ${unresolvedRefs.join(', ')}`;
            // Record failed registration
            const errorResult = {
                level: 'Error',
                token: token.name,
                message: errorMessage,
                rationale: `Semantic token ${token.name} references non-existent primitive tokens`,
                mathematicalReasoning: 'Semantic tokens must reference valid primitive tokens to maintain mathematical consistency',
                suggestions: [
                    'Register the referenced primitive tokens first',
                    'Update semantic token to reference existing primitive tokens',
                    'Use skipValidation option if primitive tokens will be registered later'
                ]
            };
            this.recordRegistration(token.name, 'semantic', errorResult);
            throw new Error(errorMessage);
        }
        this.semanticRegistry.register(token, options);
        // Record successful registration
        const successResult = {
            level: 'Pass',
            token: token.name,
            message: 'Token registered successfully',
            rationale: 'Registration completed',
            mathematicalReasoning: 'N/A',
            suggestions: []
        };
        this.recordRegistration(token.name, 'semantic', successResult);
    }
    /**
     * Register multiple semantic tokens in batch
     *
     * Note: This method no longer returns ValidationResult[]. Validation should be
     * performed by the caller before registration. Registration either succeeds
     * (returns void) or throws an error for each token.
     */
    registerSemanticBatch(tokens, options = {}) {
        for (const token of tokens) {
            this.registerSemantic(token, options);
        }
    }
    // ============================================================================
    // Dependency Management
    // ============================================================================
    /**
     * Validate that all primitive references in a semantic token exist
     */
    validatePrimitiveReferences(token) {
        const unresolvedRefs = [];
        for (const [key, primitiveRef] of Object.entries(token.primitiveReferences)) {
            if (!this.primitiveRegistry.has(primitiveRef)) {
                unresolvedRefs.push(`${key}: ${primitiveRef}`);
            }
        }
        return unresolvedRefs;
    }
    /**
     * Get all unresolved primitive references across all semantic tokens
     */
    getUnresolvedReferences() {
        const allSemanticTokens = this.semanticRegistry.query();
        const unresolved = [];
        for (const token of allSemanticTokens) {
            const unresolvedRefs = this.validatePrimitiveReferences(token);
            if (unresolvedRefs.length > 0) {
                unresolved.push({
                    semanticToken: token.name,
                    unresolvedReferences: unresolvedRefs
                });
            }
        }
        return unresolved;
    }
    /**
     * Detect circular dependencies in semantic token references
     * (Currently semantic tokens only reference primitives, so no circular deps possible)
     */
    detectCircularDependencies() {
        // Semantic tokens reference primitive tokens only, so circular dependencies
        // are not possible in the current architecture. This method is provided
        // for future extensibility if semantic-to-semantic references are added.
        return [];
    }
    /**
     * Build dependency graph showing which semantic tokens depend on which primitives
     */
    buildDependencyGraph() {
        const graph = {};
        const allSemanticTokens = this.semanticRegistry.query();
        for (const token of allSemanticTokens) {
            const dependencies = Object.values(token.primitiveReferences);
            graph[token.name] = dependencies;
        }
        return graph;
    }
    /**
     * Get all semantic tokens that depend on a specific primitive token
     */
    getDependentSemanticTokens(primitiveTokenName) {
        const allSemanticTokens = this.semanticRegistry.query();
        return allSemanticTokens.filter(token => {
            const references = Object.values(token.primitiveReferences);
            return references.includes(primitiveTokenName);
        });
    }
    /**
     * Validate referential integrity across both registries
     */
    validateReferentialIntegrity() {
        const issues = [];
        const unresolvedReferences = this.getUnresolvedReferences();
        if (unresolvedReferences.length > 0) {
            issues.push(`Found ${unresolvedReferences.length} semantic tokens with unresolved primitive references`);
        }
        const circularDeps = this.detectCircularDependencies();
        if (circularDeps.length > 0) {
            issues.push(`Found ${circularDeps.length} circular dependencies`);
        }
        return {
            valid: issues.length === 0,
            issues,
            unresolvedReferences
        };
    }
    // ============================================================================
    // Registration History and Analytics
    // ============================================================================
    /**
     * Record a token registration in history
     */
    recordRegistration(tokenName, tokenType, result) {
        this.registrationHistory.push({
            timestamp: new Date(),
            tokenName,
            tokenType,
            result
        });
    }
    /**
     * Get registration history
     */
    getRegistrationHistory() {
        return [...this.registrationHistory];
    }
    /**
     * Get registration statistics
     */
    getRegistrationStats() {
        const total = this.registrationHistory.length;
        const primitive = this.registrationHistory.filter(r => r.tokenType === 'primitive').length;
        const semantic = this.registrationHistory.filter(r => r.tokenType === 'semantic').length;
        const successful = this.registrationHistory.filter(r => r.result.level === 'Pass').length;
        const failed = this.registrationHistory.filter(r => r.result.level === 'Error').length;
        return {
            totalRegistrations: total,
            primitiveRegistrations: primitive,
            semanticRegistrations: semantic,
            successfulRegistrations: successful,
            failedRegistrations: failed,
            errorRate: total > 0 ? failed / total : 0
        };
    }
    /**
     * Clear registration history
     */
    clearHistory() {
        this.registrationHistory = [];
    }
    // ============================================================================
    // Coordination Statistics
    // ============================================================================
    /**
     * Get comprehensive coordination statistics
     */
    getCoordinationStats() {
        const primitiveStats = this.primitiveRegistry.getStats();
        const semanticStats = this.semanticRegistry.getStats();
        const unresolvedRefs = this.getUnresolvedReferences();
        const circularDeps = this.detectCircularDependencies();
        const registrationStats = this.getRegistrationStats();
        return {
            primitiveTokenCount: primitiveStats.totalTokens,
            semanticTokenCount: semanticStats.totalTokens,
            unresolvedReferences: unresolvedRefs.map(u => u.semanticToken),
            circularDependencies: circularDeps,
            registrationErrors: registrationStats.failedRegistrations
        };
    }
    /**
     * Generate coordination health report
     */
    generateHealthReport() {
        const stats = this.getCoordinationStats();
        const integrity = this.validateReferentialIntegrity();
        const issues = [];
        const recommendations = [];
        // Check for unresolved references
        if (stats.unresolvedReferences.length > 0) {
            issues.push(`${stats.unresolvedReferences.length} semantic tokens have unresolved primitive references`);
            recommendations.push('Register missing primitive tokens or update semantic token references');
        }
        // Check for circular dependencies
        if (stats.circularDependencies.length > 0) {
            issues.push(`${stats.circularDependencies.length} circular dependencies detected`);
            recommendations.push('Refactor token dependencies to eliminate circular references');
        }
        // Check registration error rate
        const registrationStats = this.getRegistrationStats();
        if (registrationStats.errorRate > 0.1) {
            issues.push(`High registration error rate: ${(registrationStats.errorRate * 100).toFixed(1)}%`);
            recommendations.push('Review token definitions and registration process for common errors');
        }
        // Determine overall status
        let status = 'healthy';
        if (stats.unresolvedReferences.length > 0 || stats.circularDependencies.length > 0) {
            status = 'critical';
        }
        else if (issues.length > 0) {
            status = 'warning';
        }
        return {
            status,
            issues,
            recommendations,
            stats
        };
    }
}
exports.RegistryCoordinator = RegistryCoordinator;
//# sourceMappingURL=RegistryCoordinator.js.map