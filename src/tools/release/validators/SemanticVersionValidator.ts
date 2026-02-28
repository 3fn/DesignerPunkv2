/**
 * Semantic Version Validator for Release Tool
 *
 * Lightweight validation layer on top of VersionCalculator.
 * The original SemanticVersionValidator (330 lines) was coupled to
 * SemanticVersioningRules config and VersionBump types from the old system.
 * This version delegates to VersionCalculator for parsing and validation,
 * adding only the format and progression checks the pipeline needs.
 */

import { VersionCalculator } from '../pipeline/VersionCalculator';
import { ValidationResult } from '../types';

export class SemanticVersionValidator {
  private calculator: VersionCalculator;

  constructor(calculator?: VersionCalculator) {
    this.calculator = calculator || new VersionCalculator();
  }

  validateFormat(version: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      this.calculator.parseVersion(version);
    } catch {
      errors.push(`Version '${version}' does not follow semantic versioning specification`);
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  validateProgression(
    from: string,
    to: string,
    bumpType: 'major' | 'minor' | 'patch' | 'none',
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const fromValidation = this.validateFormat(from);
    const toValidation = this.validateFormat(to);

    if (!fromValidation.valid) {
      errors.push(...fromValidation.errors);
      return { valid: false, errors, warnings };
    }
    if (!toValidation.valid) {
      errors.push(...toValidation.errors);
      return { valid: false, errors, warnings };
    }

    // Delegate to VersionCalculator's existing validation
    const recommendation = {
      currentVersion: from,
      recommendedVersion: to,
      bumpType,
      rationale: '',
      confidence: 1,
      evidence: [],
    };

    const result = this.calculator.validateSemanticVersioning(recommendation);
    return result;
  }
}
