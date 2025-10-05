/**
 * Consistency Validator
 * 
 * Validates mathematical consistency throughout the token generation workflow.
 * Ensures baseline grid alignment, cross-platform consistency, mathematical
 * relationships, and strategic flexibility usage patterns.
 */

import { TokenEngine } from '../TokenEngine';
import type { ValidationResult, PrimitiveToken } from '../types';

/**
 * Consistency validation configuration
 */
export interface ConsistencyValidationConfig {
  checkBaselineGrid?: boolean;
  checkCrossPlatform?: boolean;
  checkMathematicalRelationships?: boolean;
  checkStrategicFlexibility?: boolean;
}

/**
 * Consistency validation result
 */
export interface ConsistencyValidationResult {
  category: string;
  results: ValidationResult[];
  passed: boolean;
  issueCount: number;
}

/**
 * Consistency Validator class
 */
export class ConsistencyValidator {
  private engine: TokenEngine;
  private categoryResults: ConsistencyValidationResult[] = [];
  private initialized: boolean = false;

  constructor(engine: TokenEngine) {
    this.engine = engine;
  }

  // ============================================================================
  // Validator Initialization
  // ============================================================================

  /**
   * Initialize consistency validator
   */
  initialize(): void {
    this.categoryResults = [];
    this.initialized = true;
  }

  /**
   * Reset consistency validator
   */
  reset(): void {
    this.categoryResults = [];
    this.initialized = false;
  }

  // ============================================================================
  // Consistency Validation
  // ============================================================================

  /**
   * Execute complete consistency validation
   */
  async validate(config: ConsistencyValidationConfig = {}): Promise<ValidationResult[]> {
    if (!this.initialized) {
      throw new Error('Consistency validator not initialized');
    }

    const allResults: ValidationResult[] = [];

    // Check baseline grid alignment
    if (config.checkBaselineGrid !== false) {
      const baselineResults = await this.validateBaselineGrid();
      allResults.push(...baselineResults.results);
      this.categoryResults.push(baselineResults);
    }

    // Check cross-platform consistency
    if (config.checkCrossPlatform !== false) {
      const crossPlatformResults = await this.validateCrossPlatform();
      allResults.push(...crossPlatformResults.results);
      this.categoryResults.push(crossPlatformResults);
    }

    // Check mathematical relationships
    if (config.checkMathematicalRelationships !== false) {
      const mathResults = await this.validateMathematicalRelationships();
      allResults.push(...mathResults.results);
      this.categoryResults.push(mathResults);
    }

    // Check strategic flexibility usage
    if (config.checkStrategicFlexibility !== false) {
      const flexibilityResults = await this.validateStrategicFlexibility();
      allResults.push(...flexibilityResults.results);
      this.categoryResults.push(flexibilityResults);
    }

    return allResults;
  }

  // ============================================================================
  // Validation Categories
  // ============================================================================

  /**
   * Validate baseline grid alignment
   */
  private async validateBaselineGrid(): Promise<ConsistencyValidationResult> {
    const primitiveTokens = this.engine.getAllPrimitiveTokens();
    const results: ValidationResult[] = [];

    for (const token of primitiveTokens) {
      // Skip tokens that don't require baseline grid alignment
      if (!token.baselineGridAlignment) {
        continue;
      }

      // Skip strategic flexibility tokens (they're allowed to break the grid)
      if (token.isStrategicFlexibility) {
        results.push({
          level: 'Pass',
          token: token.name,
          message: 'Strategic flexibility token - baseline grid exception allowed',
          rationale: `Token ${token.name} is a strategic flexibility token with value ${token.baseValue}`,
          mathematicalReasoning: 'Strategic flexibility tokens are mathematically derived exceptions to baseline grid'
        });
        continue;
      }

      // Check 8-unit baseline grid alignment
      const isAligned = token.baseValue % 8 === 0;

      if (isAligned) {
        results.push({
          level: 'Pass',
          token: token.name,
          message: 'Baseline grid alignment maintained',
          rationale: `Token ${token.name} with value ${token.baseValue} aligns to 8-unit baseline grid`,
          mathematicalReasoning: `${token.baseValue} ÷ 8 = ${token.baseValue / 8} (integer)`
        });
      } else {
        results.push({
          level: 'Error',
          token: token.name,
          message: 'Baseline grid alignment violation',
          rationale: `Token ${token.name} with value ${token.baseValue} does not align to 8-unit baseline grid`,
          mathematicalReasoning: `${token.baseValue} ÷ 8 = ${token.baseValue / 8} (non-integer)`,
          suggestions: [
            `Round to nearest 8-unit value: ${Math.round(token.baseValue / 8) * 8}`,
            'Consider making this a strategic flexibility token if the value is intentional',
            'Review mathematical foundation for this token category'
          ]
        });
      }
    }

    return this.createCategoryResult('Baseline Grid Alignment', results);
  }

  /**
   * Validate cross-platform consistency
   */
  private async validateCrossPlatform(): Promise<ConsistencyValidationResult> {
    const results = this.engine.validateCrossPlatformConsistency();
    return this.createCategoryResult('Cross-Platform Consistency', results);
  }

  /**
   * Validate mathematical relationships
   */
  private async validateMathematicalRelationships(): Promise<ConsistencyValidationResult> {
    const primitiveTokens = this.engine.getAllPrimitiveTokens();
    const results: ValidationResult[] = [];

    // Group tokens by category to check family relationships
    const tokensByCategory = new Map<string, PrimitiveToken[]>();
    
    for (const token of primitiveTokens) {
      const category = token.category;
      if (!tokensByCategory.has(category)) {
        tokensByCategory.set(category, []);
      }
      tokensByCategory.get(category)!.push(token);
    }

    // Validate relationships within each category
    for (const [category, tokens] of tokensByCategory) {
      const familyBaseValue = tokens[0]?.familyBaseValue;
      
      if (!familyBaseValue) {
        continue;
      }

      for (const token of tokens) {
        // Check that token's mathematical relationship is consistent with family base
        const expectedRelationship = token.mathematicalRelationship;
        
        // Verify the relationship is documented
        if (!expectedRelationship || expectedRelationship === '') {
          results.push({
            level: 'Warning',
            token: token.name,
            message: 'Missing mathematical relationship documentation',
            rationale: `Token ${token.name} does not document its mathematical relationship to family base ${familyBaseValue}`,
            mathematicalReasoning: 'All tokens should document their mathematical derivation for maintainability',
            suggestions: [
              'Add mathematical relationship description to token definition',
              'Document how this token relates to the family base value'
            ]
          });
        } else {
          results.push({
            level: 'Pass',
            token: token.name,
            message: 'Mathematical relationship documented',
            rationale: `Token ${token.name} documents relationship: ${expectedRelationship}`,
            mathematicalReasoning: `Family base: ${familyBaseValue}, Token value: ${token.baseValue}`
          });
        }
      }
    }

    return this.createCategoryResult('Mathematical Relationships', results);
  }

  /**
   * Validate strategic flexibility usage patterns
   */
  private async validateStrategicFlexibility(): Promise<ConsistencyValidationResult> {
    const stats = this.engine.getStats();
    const results: ValidationResult[] = [];

    const flexibilityPercentage = stats.primitiveTokens.strategicFlexibilityPercentage;
    const threshold = 20; // 20% maximum recommended usage

    if (flexibilityPercentage <= threshold) {
      results.push({
        level: 'Pass',
        token: 'system',
        message: 'Strategic flexibility usage within recommended threshold',
        rationale: `Strategic flexibility tokens represent ${flexibilityPercentage.toFixed(1)}% of primitive tokens (threshold: ${threshold}%)`,
        mathematicalReasoning: `${stats.primitiveTokens.strategicFlexibility} strategic flexibility tokens out of ${stats.primitiveTokens.total} total primitive tokens`
      });
    } else {
      results.push({
        level: 'Warning',
        token: 'system',
        message: 'High strategic flexibility usage',
        rationale: `Strategic flexibility tokens represent ${flexibilityPercentage.toFixed(1)}% of primitive tokens (threshold: ${threshold}%)`,
        mathematicalReasoning: `${stats.primitiveTokens.strategicFlexibility} strategic flexibility tokens out of ${stats.primitiveTokens.total} total primitive tokens`,
        suggestions: [
          'Review strategic flexibility token usage patterns',
          'Consider creating semantic tokens for common use cases',
          'Evaluate if some strategic flexibility tokens should become standard tokens'
        ]
      });
    }

    return this.createCategoryResult('Strategic Flexibility Usage', results);
  }

  // ============================================================================
  // Result Management
  // ============================================================================

  /**
   * Create category result from validation results
   */
  private createCategoryResult(
    category: string,
    results: ValidationResult[]
  ): ConsistencyValidationResult {
    const issueCount = results.filter(r => r.level === 'Error' || r.level === 'Warning').length;

    return {
      category,
      results,
      passed: results.every(r => r.level !== 'Error'),
      issueCount
    };
  }

  /**
   * Get all category results
   */
  getCategoryResults(): ConsistencyValidationResult[] {
    return [...this.categoryResults];
  }

  /**
   * Get summary of consistency validation
   */
  getSummary(): {
    totalCategories: number;
    passedCategories: number;
    failedCategories: number;
    totalIssues: number;
    criticalIssues: number;
  } {
    const totalCategories = this.categoryResults.length;
    const passedCategories = this.categoryResults.filter(c => c.passed).length;
    const failedCategories = this.categoryResults.filter(c => !c.passed).length;
    const totalIssues = this.categoryResults.reduce((sum, c) => sum + c.issueCount, 0);
    
    const criticalIssues = this.categoryResults.reduce((sum, c) => {
      return sum + c.results.filter(r => r.level === 'Error').length;
    }, 0);

    return {
      totalCategories,
      passedCategories,
      failedCategories,
      totalIssues,
      criticalIssues
    };
  }

  /**
   * Check if all consistency checks passed
   */
  isPassed(): boolean {
    return this.categoryResults.every(c => c.passed);
  }

  /**
   * Get failed categories
   */
  getFailedCategories(): ConsistencyValidationResult[] {
    return this.categoryResults.filter(c => !c.passed);
  }
}
