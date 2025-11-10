import type { PrimitiveToken } from '../types/PrimitiveToken';
import { TokenCategory } from '../types/PrimitiveToken';
import { isStrategicFlexibilityValue, getStrategicFlexibilityToken } from '../constants/StrategicFlexibilityTokens';
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

export class PrimitiveTokenRegistry implements IRegistry<PrimitiveToken> {
  /**
   * Registry name for identification
   */
  readonly name = 'PrimitiveTokenRegistry';

  private tokens: Map<string, PrimitiveToken> = new Map();
  private categoryIndex: Map<TokenCategory, Set<string>> = new Map();

  constructor() {
    // Initialize category index
    this.initializeCategoryIndex();
  }

  /**
   * Register a primitive token
   * 
   * Implements IRegistry.register() interface.
   * Callers should validate tokens before registration using appropriate validators.
   */
  register(token: PrimitiveToken, options: TokenRegistrationOptions = {}): void {
    const { allowOverwrite = false } = options;

    // Check for existing token
    if (this.tokens.has(token.name) && !allowOverwrite) {
      throw new Error(
        `Token ${token.name} is already registered. Use allowOverwrite option to replace.`
      );
    }

    // Register the token
    this.tokens.set(token.name, token);
    this.addToCategory(token.category, token.name);
  }

  /**
   * Retrieve a token by name
   */
  get(tokenName: string): PrimitiveToken | undefined {
    return this.tokens.get(tokenName);
  }

  /**
   * Check if a token exists
   */
  has(tokenName: string): boolean {
    return this.tokens.has(tokenName);
  }

  /**
   * Get all tokens matching query options
   */
  query(options: TokenQueryOptions = {}): PrimitiveToken[] {
    let tokens = Array.from(this.tokens.values());

    // Filter by category
    if (options.category) {
      tokens = tokens.filter(token => token.category === options.category);
    }

    // Filter strategic flexibility if requested
    if (options.includeStrategicFlexibility === false) {
      tokens = tokens.filter(token => !token.isStrategicFlexibility);
    }

    // Sort results
    if (options.sortBy) {
      tokens.sort((a, b) => {
        switch (options.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'value':
            return a.baseValue - b.baseValue;
          case 'category':
            return a.category.localeCompare(b.category);
          default:
            return 0;
        }
      });
    }

    return tokens;
  }

  /**
   * Get all tokens in a specific category
   */
  getByCategory(category: TokenCategory): PrimitiveToken[] {
    const tokenNames = this.categoryIndex.get(category) || new Set();
    return Array.from(tokenNames)
      .map(name => this.tokens.get(name))
      .filter((token): token is PrimitiveToken => token !== undefined);
  }

  /**
   * Get registry statistics
   */
  getStats() {
    const totalTokens = this.tokens.size;
    const strategicFlexibilityCount = Array.from(this.tokens.values())
      .filter(token => token.isStrategicFlexibility).length;
    
    const categoryStats = new Map<TokenCategory, number>();
    for (const [category, tokenNames] of this.categoryIndex) {
      categoryStats.set(category, tokenNames.size);
    }

    return {
      totalTokens,
      strategicFlexibilityCount,
      strategicFlexibilityPercentage: totalTokens > 0 ? (strategicFlexibilityCount / totalTokens) * 100 : 0,
      categoryStats: Object.fromEntries(categoryStats)
    };
  }

  /**
   * Remove a token from the registry
   */
  remove(tokenName: string): boolean {
    const token = this.tokens.get(tokenName);
    if (!token) {
      return false;
    }

    this.tokens.delete(tokenName);
    this.removeFromCategory(token.category, tokenName);
    return true;
  }

  /**
   * Clear all tokens
   */
  clear(): void {
    this.tokens.clear();
    this.categoryIndex.clear();
    this.initializeCategoryIndex();
  }

  /**
   * Initialize category index with all token categories
   */
  private initializeCategoryIndex(): void {
    const categories: TokenCategory[] = [
      TokenCategory.SPACING, 
      TokenCategory.FONT_SIZE, 
      TokenCategory.LINE_HEIGHT, 
      TokenCategory.RADIUS, 
      TokenCategory.DENSITY, 
      TokenCategory.TAP_AREA,
      TokenCategory.BORDER_WIDTH
    ];
    categories.forEach(category => {
      this.categoryIndex.set(category, new Set());
    });
  }

  /**
   * Add token to category index
   */
  private addToCategory(category: TokenCategory, tokenName: string): void {
    if (!this.categoryIndex.has(category)) {
      this.categoryIndex.set(category, new Set());
    }
    this.categoryIndex.get(category)!.add(tokenName);
  }

  /**
   * Remove token from category index
   */
  private removeFromCategory(category: TokenCategory, tokenName: string): void {
    const categorySet = this.categoryIndex.get(category);
    if (categorySet) {
      categorySet.delete(tokenName);
    }
  }
}