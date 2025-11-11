/**
 * Registry Coordinator
 *
 * Coordinates interactions between PrimitiveTokenRegistry and SemanticTokenRegistry
 * to ensure consistent token registration, validation, and dependency management.
 * Handles batch operations and maintains referential integrity between registries.
 */
import { PrimitiveTokenRegistry, TokenRegistrationOptions } from '../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry, SemanticTokenRegistrationOptions } from '../registries/SemanticTokenRegistry';
import type { PrimitiveToken, SemanticToken } from '../types';
/**
 * Registry coordination statistics
 */
export interface RegistryCoordinationStats {
    primitiveTokenCount: number;
    semanticTokenCount: number;
    unresolvedReferences: string[];
    circularDependencies: string[];
    registrationErrors: number;
}
/**
 * Registry Coordinator class managing interactions between token registries
 */
export declare class RegistryCoordinator {
    private primitiveRegistry;
    private semanticRegistry;
    private registrationHistory;
    constructor(primitiveRegistry: PrimitiveTokenRegistry, semanticRegistry: SemanticTokenRegistry);
    /**
     * Register a primitive token with coordination
     *
     * Note: This method no longer returns ValidationResult. Validation should be
     * performed by the caller before registration. Registration either succeeds
     * (returns void) or throws an error.
     */
    registerPrimitive(token: PrimitiveToken, options?: TokenRegistrationOptions): void;
    /**
     * Register multiple primitive tokens in batch
     *
     * Note: This method no longer returns ValidationResult[]. Validation should be
     * performed by the caller before registration. Registration either succeeds
     * (returns void) or throws an error for each token.
     */
    registerPrimitiveBatch(tokens: PrimitiveToken[], options?: TokenRegistrationOptions): void;
    /**
     * Register a semantic token with coordination and dependency validation
     *
     * Note: This method no longer returns ValidationResult. Validation should be
     * performed by the caller before registration. This method only checks for
     * unresolved primitive references and either succeeds (returns void) or throws an error.
     */
    registerSemantic(token: SemanticToken, options?: SemanticTokenRegistrationOptions): void;
    /**
     * Register multiple semantic tokens in batch
     *
     * Note: This method no longer returns ValidationResult[]. Validation should be
     * performed by the caller before registration. Registration either succeeds
     * (returns void) or throws an error for each token.
     */
    registerSemanticBatch(tokens: SemanticToken[], options?: SemanticTokenRegistrationOptions): void;
    /**
     * Validate that all primitive references in a semantic token exist
     */
    private validatePrimitiveReferences;
    /**
     * Get all unresolved primitive references across all semantic tokens
     */
    getUnresolvedReferences(): Array<{
        semanticToken: string;
        unresolvedReferences: string[];
    }>;
    /**
     * Detect circular dependencies in semantic token references
     * (Currently semantic tokens only reference primitives, so no circular deps possible)
     */
    detectCircularDependencies(): string[];
    /**
     * Build dependency graph showing which semantic tokens depend on which primitives
     */
    buildDependencyGraph(): Record<string, string[]>;
    /**
     * Get all semantic tokens that depend on a specific primitive token
     */
    getDependentSemanticTokens(primitiveTokenName: string): SemanticToken[];
    /**
     * Validate referential integrity across both registries
     */
    validateReferentialIntegrity(): {
        valid: boolean;
        issues: string[];
        unresolvedReferences: Array<{
            semanticToken: string;
            unresolvedReferences: string[];
        }>;
    };
    /**
     * Record a token registration in history
     */
    private recordRegistration;
    /**
     * Get registration history
     */
    getRegistrationHistory(): typeof this.registrationHistory;
    /**
     * Get registration statistics
     */
    getRegistrationStats(): {
        totalRegistrations: number;
        primitiveRegistrations: number;
        semanticRegistrations: number;
        successfulRegistrations: number;
        failedRegistrations: number;
        errorRate: number;
    };
    /**
     * Clear registration history
     */
    clearHistory(): void;
    /**
     * Get comprehensive coordination statistics
     */
    getCoordinationStats(): RegistryCoordinationStats;
    /**
     * Generate coordination health report
     */
    generateHealthReport(): {
        status: 'healthy' | 'warning' | 'critical';
        issues: string[];
        recommendations: string[];
        stats: RegistryCoordinationStats;
    };
}
//# sourceMappingURL=RegistryCoordinator.d.ts.map