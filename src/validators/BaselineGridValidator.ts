import { isStrategicFlexibilityValue } from '../constants/StrategicFlexibilityTokens';
import type { ValidationResult } from '../types/ValidationResult';
import type { IValidator } from './IValidator';

/**
 * Baseline Grid Validator
 * 
 * Validates that primitive tokens align with the 8-unit baseline grid system.
 * Strategic flexibility tokens (2, 4, 6, 10, 12, 20) are treated as Pass-level validation.
 */

export const BASELINE_GRID_UNIT = 8;

export interface BaselineGridValidationOptions {
  allowStrategicFlexibility?: boolean;
  customGridUnit?: number;
}

export interface BaselineGridValidationInput {
  value: number;
  tokenName?: string;
}

export class BaselineGridValidator implements IValidator<BaselineGridValidationInput> {
  readonly name = 'BaselineGridValidator';
  private readonly gridUnit: number;
  private readonly allowStrategicFlexibility: boolean;

  constructor(options: BaselineGridValidationOptions = {}) {
    this.gridUnit = options.customGridUnit ?? BASELINE_GRID_UNIT;
    this.allowStrategicFlexibility = options.allowStrategicFlexibility ?? true;
  }

  /**
   * Validate input using IValidator interface
   */
  validate(input: BaselineGridValidationInput): ValidationResult {
    return this.validateValue(input.value, input.tokenName);
  }

  /**
   * Validate if a value aligns with the baseline grid (legacy method)
   */
  validateValue(value: number, tokenName?: string): ValidationResult {
    // Strategic flexibility tokens always pass validation
    if (this.allowStrategicFlexibility && isStrategicFlexibilityValue(value)) {
      return {
        level: 'Pass',
        token: tokenName || `value-${value}`,
        message: 'Strategic flexibility token - mathematically derived exception',
        rationale: `Value ${value} is a strategic flexibility token that provides necessary design flexibility while maintaining mathematical relationships`,
        mathematicalReasoning: `Strategic flexibility tokens are mathematically derived (e.g., space075 = space100 × 0.75 = 6) but intentionally break systematic progression for exceptional design requirements`
      };
    }

    // Check baseline grid alignment
    const isAligned = this.isBaselineGridAligned(value);
    
    if (isAligned) {
      return {
        level: 'Pass',
        token: tokenName || `value-${value}`,
        message: 'Baseline grid alignment validated',
        rationale: `Value ${value} aligns with ${this.gridUnit}-unit baseline grid`,
        mathematicalReasoning: `${value} ÷ ${this.gridUnit} = ${value / this.gridUnit} (whole number confirms alignment)`
      };
    }

    // Validation failed
    const nearestValid = this.getNearestValidValue(value);
    return {
      level: 'Error',
      token: tokenName || `value-${value}`,
      message: 'Baseline grid alignment violation',
      rationale: `Value ${value} does not align with ${this.gridUnit}-unit baseline grid`,
      suggestions: [
        `Use ${nearestValid.lower} (${nearestValid.lower / this.gridUnit} × ${this.gridUnit})`,
        `Use ${nearestValid.upper} (${nearestValid.upper / this.gridUnit} × ${this.gridUnit})`,
        'Consider if this should be a strategic flexibility token'
      ],
      mathematicalReasoning: `${value} ÷ ${this.gridUnit} = ${value / this.gridUnit} (non-whole number indicates misalignment)`
    };
  }

  /**
   * Check if a value is aligned to the baseline grid
   */
  private isBaselineGridAligned(value: number): boolean {
    return value % this.gridUnit === 0;
  }

  /**
   * Get the nearest valid baseline grid values
   */
  private getNearestValidValue(value: number): { lower: number; upper: number } {
    const lower = Math.floor(value / this.gridUnit) * this.gridUnit;
    const upper = Math.ceil(value / this.gridUnit) * this.gridUnit;
    
    return { lower, upper };
  }

  /**
   * Validate multiple values at once
   */
  validateBatch(values: Array<{ value: number; tokenName?: string }>): ValidationResult[] {
    return values.map(({ value, tokenName }) => this.validateValue(value, tokenName));
  }

  /**
   * Get baseline grid information
   */
  getGridInfo() {
    return {
      gridUnit: this.gridUnit,
      allowStrategicFlexibility: this.allowStrategicFlexibility,
      strategicFlexibilityValues: this.allowStrategicFlexibility ? [2, 4, 6, 10, 12, 20] : []
    };
  }
}