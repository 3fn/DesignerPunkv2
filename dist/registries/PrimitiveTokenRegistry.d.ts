import type { PrimitiveToken } from '../types/PrimitiveToken';
import { TokenCategory } from '../types/PrimitiveToken';
import type { ValidationResult } from '../types/ValidationResult';
/**
 * Primitive Token Registry
 *
 * Manages primitive tokens with baseline grid validation and strategic flexibility support.
 * Provides registration, retrieval, and validation methods for all token categories.
 */
export interface TokenRegistrationOptions {
    skipValidation?: boolean;
    allowOverwrite?: boolean;
}
export interface TokenQueryOptions {
    category?: TokenCategory;
    includeStrategicFlexibility?: boolean;
    sortBy?: 'name' | 'value' | 'category';
}
export declare class PrimitiveTokenRegistry {
    private tokens;
    private validator;
    private categoryIndex;
    constructor();
    /**
     * Register a primitive token with validation
     */
    register(token: PrimitiveToken, options?: TokenRegistrationOptions): ValidationResult;
    /**
     * Retrieve a token by name
     */
    get(tokenName: string): PrimitiveToken | undefined;
    /**
     * Check if a token exists
     */
    has(tokenName: string): boolean;
    /**
     * Get all tokens matching query options
     */
    query(options?: TokenQueryOptions): PrimitiveToken[];
    /**
     * Get all tokens in a specific category
     */
    getByCategory(category: TokenCategory): PrimitiveToken[];
    /**
     * Validate a token against baseline grid requirements
     */
    validateToken(token: PrimitiveToken): ValidationResult;
    /**
     * Validate all registered tokens
     */
    validateAll(): ValidationResult[];
    /**
     * Get registry statistics
     */
    getStats(): {
        totalTokens: number;
        strategicFlexibilityCount: number;
        strategicFlexibilityPercentage: number;
        categoryStats: {
            [k: string]: number;
        };
        validationInfo: {
            gridUnit: number;
            allowStrategicFlexibility: boolean;
            strategicFlexibilityValues: number[];
        };
    };
    /**
     * Remove a token from the registry
     */
    remove(tokenName: string): boolean;
    /**
     * Clear all tokens
     */
    clear(): void;
    /**
     * Initialize category index with all token categories
     */
    private initializeCategoryIndex;
    /**
     * Add token to category index
     */
    private addToCategory;
    /**
     * Remove token from category index
     */
    private removeFromCategory;
}
//# sourceMappingURL=PrimitiveTokenRegistry.d.ts.map