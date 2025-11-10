/**
 * Semantic Token Registry
 * 
 * Manages semantic tokens with mode-aware primitive token references.
 * Enforces primitive token references and prevents raw values in semantic tokens.
 * Provides registration, retrieval, and resolution methods for all semantic categories.
 * 
 * Implements IRegistry<SemanticToken> for consistent registry interface.
 */

import type { SemanticToken } from '../types/SemanticToken';
import { SemanticCategory } from '../types/SemanticToken';
import type { PrimitiveToken, ColorTokenValue } from '../types/PrimitiveToken';
import { PrimitiveTokenRegistry } from './PrimitiveTokenRegistry';
import type { IRegistry, RegistrationOptions } from './IRegistry';

export interface SemanticTokenRegistrationOptions extends RegistrationOptions {
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

export class SemanticTokenRegistry implements IRegistry<SemanticToken> {
  /**
   * Registry name for identification
   */
  readonly name = 'SemanticTokenRegistry';

  private tokens: Map<string, SemanticToken> = new Map();
  private primitiveRegistry: PrimitiveTokenRegistry;
  private categoryIndex: Map<SemanticCategory, Set<string>> = new Map();

  constructor(primitiveRegistry: PrimitiveTokenRegistry) {
    this.primitiveRegistry = primitiveRegistry;
    this.initializeCategoryIndex();
  }

  /**
   * Register a semantic token
   * 
   * Implements IRegistry.register() interface.
   * Callers should validate tokens before registration using appropriate validators.
   */
  register(token: SemanticToken, options: SemanticTokenRegistrationOptions = {}): void {
    const { allowOverwrite = false } = options;

    // Check for existing token
    if (this.tokens.has(token.name) && !allowOverwrite) {
      throw new Error(
        `Semantic token ${token.name} is already registered. Use allowOverwrite option to replace.`
      );
    }

    // Register the token
    this.tokens.set(token.name, token);
    this.addToCategory(token.category, token.name);
  }

  /**
   * Retrieve a semantic token by name
   */
  get(tokenName: string): SemanticToken | undefined {
    return this.tokens.get(tokenName);
  }

  /**
   * Check if a semantic token exists
   */
  has(tokenName: string): boolean {
    return this.tokens.has(tokenName);
  }

  /**
   * Get all semantic tokens matching query options
   */
  query(options: SemanticTokenQueryOptions = {}): SemanticToken[] {
    let tokens = Array.from(this.tokens.values());

    // Filter by category
    if (options.category) {
      tokens = tokens.filter(token => token.category === options.category);
    }

    // Sort results
    if (options.sortBy) {
      tokens.sort((a, b) => {
        switch (options.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
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
   * Get all semantic tokens in a specific category
   */
  getByCategory(category: SemanticCategory): SemanticToken[] {
    const tokenNames = this.categoryIndex.get(category) || new Set();
    return Array.from(tokenNames)
      .map(name => this.tokens.get(name))
      .filter((token): token is SemanticToken => token !== undefined);
  }

  /**
   * Resolve mode-aware color token value based on system context
   * Works with both single-reference and multi-primitive color tokens
   */
  resolveColorValue(
    semanticToken: SemanticToken,
    context: ModeThemeContext
  ): string | null {
    if (semanticToken.category !== SemanticCategory.COLOR) {
      return null;
    }

    // Resolve primitive token reference on-the-fly
    const primitiveRef = semanticToken.primitiveReferences.default || 
                        semanticToken.primitiveReferences.color ||
                        Object.values(semanticToken.primitiveReferences)[0];
    
    if (!primitiveRef) {
      return null;
    }

    const primitiveToken = this.primitiveRegistry.get(primitiveRef);
    if (!primitiveToken) {
      return null;
    }

    // Get color value from primitive token
    const colorValue = primitiveToken.platforms.web.value;
    
    // Check if it's a mode-aware color token
    if (typeof colorValue === 'object' && 'light' in colorValue && 'dark' in colorValue) {
      const modeValue = (colorValue as ColorTokenValue)[context.mode];
      return modeValue[context.theme];
    }

    // Fallback for non-mode-aware tokens (shouldn't happen with proper color tokens)
    return typeof colorValue === 'string' ? colorValue : null;
  }

  /**
   * Get registry statistics
   */
  getStats() {
    const totalTokens = this.tokens.size;
    
    const categoryStats = new Map<SemanticCategory, number>();
    for (const [category, tokenNames] of this.categoryIndex) {
      categoryStats.set(category, tokenNames.size);
    }

    return {
      totalTokens,
      categoryStats: Object.fromEntries(categoryStats)
    };
  }

  /**
   * Remove a semantic token from the registry
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
   * Clear all semantic tokens
   */
  clear(): void {
    this.tokens.clear();
    this.categoryIndex.clear();
    this.initializeCategoryIndex();
  }

  /**
   * Initialize category index with all semantic categories
   */
  private initializeCategoryIndex(): void {
    const categories: SemanticCategory[] = [
      SemanticCategory.COLOR,
      SemanticCategory.SPACING,
      SemanticCategory.TYPOGRAPHY,
      SemanticCategory.BORDER,
      SemanticCategory.SHADOW,
      SemanticCategory.LAYOUT,
      SemanticCategory.INTERACTION
    ];
    categories.forEach(category => {
      this.categoryIndex.set(category, new Set());
    });
  }

  /**
   * Add semantic token to category index
   */
  private addToCategory(category: SemanticCategory, tokenName: string): void {
    if (!this.categoryIndex.has(category)) {
      this.categoryIndex.set(category, new Set());
    }
    this.categoryIndex.get(category)!.add(tokenName);
  }

  /**
   * Remove semantic token from category index
   */
  private removeFromCategory(category: SemanticCategory, tokenName: string): void {
    const categorySet = this.categoryIndex.get(category);
    if (categorySet) {
      categorySet.delete(tokenName);
    }
  }
}
