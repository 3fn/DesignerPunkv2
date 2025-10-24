import type { PrimitiveToken } from '../types/PrimitiveToken';
import { TokenCategory } from '../types/PrimitiveToken';
import type { ValidationResult } from '../types/ValidationResult';
import { BaselineGridValidator } from '../validators/BaselineGridValidator';
import { isStrategicFlexibilityValue, getStrategicFlexibilityToken } from '../constants/StrategicFlexibilityTokens';

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

export class PrimitiveTokenRegistry {
  private tokens: Map<string, PrimitiveToken> = new Map();
  private validator: BaselineGridValidator;
  private categoryIndex: Map<TokenCategory, Set<string>> = new Map();

  constructor() {
    this.validator = new BaselineGridValidator({
      allowStrategicFlexibility: true
    });
    
    // Initialize category index
    this.initializeCategoryIndex();
  }

  /**
   * Register a primitive token with validation
   */
  register(token: PrimitiveToken, options: TokenRegistrationOptions = {}): ValidationResult {
    const { skipValidation = false, allowOverwrite = false } = options;

    // Check for existing token
    if (this.tokens.has(token.name) && !allowOverwrite) {
      return {
        level: 'Error',
        token: token.name,
        message: 'Token already exists',
        rationale: `Token ${token.name} is already registered. Use allowOverwrite option to replace.`,
        mathematicalReasoning: 'Token uniqueness prevents mathematical inconsistencies in the system'
      };
    }

    // Validate token if not skipped
    let validationResult: ValidationResult;
    if (!skipValidation) {
      validationResult = this.validateToken(token);
      if (validationResult.level === 'Error') {
        return validationResult;
      }
    } else {
      validationResult = {
        level: 'Pass',
        token: token.name,
        message: 'Validation skipped',
        rationale: 'Token registered without validation',
        mathematicalReasoning: 'Validation bypassed by registration options'
      };
    }

    // Register the token
    this.tokens.set(token.name, token);
    this.addToCategory(token.category, token.name);

    return {
      level: 'Pass',
      token: token.name,
      message: 'Token registered successfully',
      rationale: `Token ${token.name} registered with ${validationResult.level} validation`,
      mathematicalReasoning: validationResult.mathematicalReasoning
    };
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
   * Validate a token against baseline grid requirements
   */
  validateToken(token: PrimitiveToken): ValidationResult {
    // Categories that require baseline grid alignment
    const baselineGridCategories: TokenCategory[] = [TokenCategory.SPACING, TokenCategory.RADIUS];
    
    if (baselineGridCategories.includes(token.category)) {
      return this.validator.validate(token.baseValue, token.name);
    }

    // Other categories pass validation (they have their own mathematical foundations)
    return {
      level: 'Pass',
      token: token.name,
      message: 'Token category does not require baseline grid validation',
      rationale: `Category ${token.category} uses its own mathematical foundation (base: ${token.familyBaseValue})`,
      mathematicalReasoning: `Token follows ${token.category} family mathematical progression with base value ${token.familyBaseValue}`
    };
  }

  /**
   * Validate all registered tokens
   */
  validateAll(): ValidationResult[] {
    return Array.from(this.tokens.values()).map(token => this.validateToken(token));
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
      categoryStats: Object.fromEntries(categoryStats),
      validationInfo: this.validator.getGridInfo()
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