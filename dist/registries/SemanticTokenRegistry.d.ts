/**
 * Semantic Token Registry
 *
 * Manages semantic tokens with mode-aware primitive token references.
 * Enforces primitive token references and prevents raw values in semantic tokens.
 * Provides registration, retrieval, and resolution methods for all semantic categories.
 */
import type { SemanticToken } from '../types/SemanticToken';
import { SemanticCategory } from '../types/SemanticToken';
import type { ValidationResult } from '../types/ValidationResult';
import { PrimitiveTokenRegistry } from './PrimitiveTokenRegistry';
export interface SemanticTokenRegistrationOptions {
    skipValidation?: boolean;
    allowOverwrite?: boolean;
}
export interface SemanticTokenQueryOptions {
    category?: SemanticCategory;
    sortBy?: 'name' | 'category';
}
export interface ModeThemeContext {
    mode: 'light' | 'dark';
    theme: 'base' | 'wcag';
}
export declare class SemanticTokenRegistry {
    private tokens;
    private primitiveRegistry;
    private categoryIndex;
    constructor(primitiveRegistry: PrimitiveTokenRegistry);
    /**
     * Register a semantic token with primitive reference validation
     */
    register(token: SemanticToken, options?: SemanticTokenRegistrationOptions): ValidationResult;
    /**
     * Retrieve a semantic token by name
     */
    get(tokenName: string): SemanticToken | undefined;
    /**
     * Check if a semantic token exists
     */
    has(tokenName: string): boolean;
    /**
     * Get all semantic tokens matching query options
     */
    query(options?: SemanticTokenQueryOptions): SemanticToken[];
    /**
     * Get all semantic tokens in a specific category
     */
    getByCategory(category: SemanticCategory): SemanticToken[];
    /**
     * Validate a semantic token against primitive reference requirements
     * Supports both single and multi-primitive token validation
     */
    validateToken(token: SemanticToken): ValidationResult;
    /**
     * Resolve mode-aware color token value based on system context
     * Works with both single-reference and multi-primitive color tokens
     */
    resolveColorValue(semanticToken: SemanticToken, context: ModeThemeContext): string | null;
    /**
     * Validate all registered semantic tokens
     */
    validateAll(): ValidationResult[];
    /**
     * Get registry statistics
     */
    getStats(): {
        totalTokens: number;
        categoryStats: {
            [k: string]: number;
        };
    };
    /**
     * Remove a semantic token from the registry
     */
    remove(tokenName: string): boolean;
    /**
     * Clear all semantic tokens
     */
    clear(): void;
    /**
     * Initialize category index with all semantic categories
     */
    private initializeCategoryIndex;
    /**
     * Add semantic token to category index
     */
    private addToCategory;
    /**
     * Remove semantic token from category index
     */
    private removeFromCategory;
}
//# sourceMappingURL=SemanticTokenRegistry.d.ts.map