import type { PrimitiveToken } from '../types/PrimitiveToken';
import { TokenCategory } from '../types/PrimitiveToken';
import type { IRegistry, RegistrationOptions } from './IRegistry';
/**
 * Primitive Token Registry
 *
 * Manages primitive tokens with baseline grid validation and strategic flexibility support.
 * Provides registration, retrieval, and validation methods for all token categories.
 *
 * Implements IRegistry<PrimitiveToken> for consistent registry interface.
 */
export interface TokenRegistrationOptions extends RegistrationOptions {
    allowOverwrite?: boolean;
}
export interface TokenQueryOptions {
    category?: TokenCategory;
    includeStrategicFlexibility?: boolean;
    sortBy?: 'name' | 'value' | 'category';
}
export declare class PrimitiveTokenRegistry implements IRegistry<PrimitiveToken> {
    /**
     * Registry name for identification
     */
    readonly name = "PrimitiveTokenRegistry";
    private tokens;
    private categoryIndex;
    constructor();
    /**
     * Register a primitive token
     *
     * Implements IRegistry.register() interface.
     * Callers should validate tokens before registration using appropriate validators.
     */
    register(token: PrimitiveToken, options?: TokenRegistrationOptions): void;
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
     * Get registry statistics
     */
    getStats(): {
        totalTokens: number;
        strategicFlexibilityCount: number;
        strategicFlexibilityPercentage: number;
        categoryStats: {
            [k: string]: number;
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