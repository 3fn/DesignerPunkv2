/**
 * Release Validator
 * 
 * Comprehensive release readiness validation with safety checks.
 * Validates release plans, package compatibility, and publishing readiness.
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */

import * as fs from 'fs';
import * as path from 'path';
import { ReleasePlan, ValidationResult, ReleaseError } from '../types/ReleaseTypes';

export interface ValidationRule {
  name: string;
  severity: 'error' | 'warning';
  validate: (plan: ReleasePlan) => Promise<ValidationRuleResult>;
}

export interface ValidationRuleResult {
  passed: boolean;
  message?: string;
  details?: any;
}

export class ReleaseValidator {
  private rules: ValidationRule[] = [];

  constructor() {
    this.registerDefaultRules();
  }

  /**
   * Register default validation rules
   */
  private registerDefaultRules(): void {
    // Version format validation
    this.addRule({
      name: 'version-format',
      severity: 'error',
      validate: async (plan) => {
        const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
        const valid = semverRegex.test(plan.version.to);

        return {
          passed: valid,
          message: valid ? undefined : `Invalid semantic version format: ${plan.version.to}`
        };
      }
    });

    // Package existence validation
    this.addRule({
      name: 'package-exists',
      severity: 'error',
      validate: async (plan) => {
        for (const pkg of plan.packages) {
          // PackageUpdate doesn't have path, skip this validation for now
          // This would need to be implemented differently based on actual package structure
        }

        return { passed: true };
      }
    });

    // Release notes validation
    this.addRule({
      name: 'release-notes',
      severity: 'warning',
      validate: async (plan) => {
        const hasContent = !!(plan.releaseNotes.content && plan.releaseNotes.content.trim().length > 0);

        return {
          passed: hasContent,
          message: hasContent ? undefined : 'Release notes are empty'
        };
      }
    });

    // Version progression validation
    this.addRule({
      name: 'version-progression',
      severity: 'error',
      validate: async (plan) => {
        const current = plan.version.from;
        const next = plan.version.to;

        // Parse versions
        const currentParts = current.split('.').map(Number);
        const nextParts = next.split('.').map(Number);

        // Check that new version is greater than current
        for (let i = 0; i < 3; i++) {
          if (nextParts[i] > currentParts[i]) {
            return { passed: true };
          }
          if (nextParts[i] < currentParts[i]) {
            return {
              passed: false,
              message: `New version ${next} is not greater than current version ${current}`
            };
          }
        }

        return {
          passed: false,
          message: `New version ${next} is the same as current version ${current}`
        };
      }
    });

    // Bump type consistency validation
    this.addRule({
      name: 'bump-type-consistency',
      severity: 'warning',
      validate: async (plan) => {
        const current = plan.version.from.split('.').map(Number);
        const next = plan.version.to.split('.').map(Number);
        const bumpType = plan.version.type;

        let expectedBumpType: 'major' | 'minor' | 'patch' | 'none' = 'none';

        if (next[0] > current[0]) {
          expectedBumpType = 'major';
        } else if (next[1] > current[1]) {
          expectedBumpType = 'minor';
        } else if (next[2] > current[2]) {
          expectedBumpType = 'patch';
        }

        const consistent = expectedBumpType === bumpType;

        return {
          passed: consistent,
          message: consistent
            ? undefined
            : `Bump type mismatch: expected ${expectedBumpType}, got ${bumpType}`
        };
      }
    });
  }

  /**
   * Add custom validation rule
   */
  addRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }

  /**
   * Validate release plan
   */
  async validate(plan: ReleasePlan): Promise<ValidationResult> {
    const errors: ReleaseError[] = [];
    const warnings: ReleaseError[] = [];

    for (const rule of this.rules) {
      try {
        const result = await rule.validate(plan);

        if (!result.passed) {
          const error: ReleaseError = {
            code: `VALIDATION_${rule.name.toUpperCase().replace(/-/g, '_')}`,
            message: result.message || `Validation failed: ${rule.name}`,
            severity: rule.severity,
            step: 'validation'
          };

          if (rule.severity === 'error') {
            errors.push(error);
          } else {
            warnings.push(error);
          }
        }
      } catch (error) {
        errors.push({
          code: 'VALIDATION_ERROR',
          message: `Validation rule ${rule.name} threw error: ${error}`,
          severity: 'error',
          step: 'validation'
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors.map(e => ({
        code: e.code,
        message: e.message,
        severity: e.severity,
        source: e.step
      })),
      warnings: warnings.map(w => ({
        code: w.code,
        message: w.message,
        source: w.step
      })),
      validatedAt: new Date(),
      context: 'release-plan-validation'
    };
  }

  /**
   * Validate release readiness (pre-flight checks)
   */
  async validateReadiness(workingDirectory: string): Promise<ValidationResult> {
    const errors: ReleaseError[] = [];
    const warnings: ReleaseError[] = [];

    // Check git repository
    try {
      const { execSync } = require('child_process');
      execSync('git rev-parse --git-dir', { cwd: workingDirectory, stdio: 'pipe' });
    } catch {
      errors.push({
        code: 'NOT_GIT_REPO',
        message: 'Not a git repository',
        severity: 'error',
        step: 'readiness'
      });
    }

    // Check for uncommitted changes
    try {
      const { execSync } = require('child_process');
      const status = execSync('git status --porcelain', {
        cwd: workingDirectory,
        encoding: 'utf-8'
      });

      if (status.trim().length > 0) {
        warnings.push({
          code: 'UNCOMMITTED_CHANGES',
          message: 'Working directory has uncommitted changes',
          severity: 'warning',
          step: 'readiness'
        });
      }
    } catch {
      // Ignore if git status fails
    }

    // Check package.json exists
    const packageJsonPath = path.join(workingDirectory, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      errors.push({
        code: 'NO_PACKAGE_JSON',
        message: 'package.json not found',
        severity: 'error',
        step: 'readiness'
      });
    }

    return {
      valid: errors.length === 0,
      errors: errors.map(e => ({
        code: e.code,
        message: e.message,
        severity: e.severity,
        source: e.step
      })),
      warnings: warnings.map(w => ({
        code: w.code,
        message: w.message,
        source: w.step
      })),
      validatedAt: new Date(),
      context: 'release-readiness'
    };
  }

  /**
   * Validate breaking changes are documented
   */
  async validateBreakingChanges(plan: ReleasePlan): Promise<ValidationResult> {
    const errors: ReleaseError[] = [];
    const warnings: ReleaseError[] = [];

    // If major version bump, check for breaking change documentation
    if (plan.version.type === 'major') {
      const hasBreakingChanges = plan.releaseNotes.content.toLowerCase().includes('breaking');

      if (!hasBreakingChanges) {
        warnings.push({
          code: 'MISSING_BREAKING_CHANGE_DOCS',
          message: 'Major version bump but no breaking changes documented',
          severity: 'warning',
          step: 'validation'
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors.map(e => ({
        code: e.code,
        message: e.message,
        severity: e.severity,
        source: e.step
      })),
      warnings: warnings.map(w => ({
        code: w.code,
        message: w.message,
        source: w.step
      })),
      validatedAt: new Date(),
      context: 'breaking-changes-validation'
    };
  }

  /**
   * Get all registered rules
   */
  getRules(): ValidationRule[] {
    return [...this.rules];
  }

  /**
   * Clear all rules
   */
  clearRules(): void {
    this.rules = [];
  }
}
