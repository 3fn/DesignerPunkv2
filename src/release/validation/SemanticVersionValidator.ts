/**
 * Semantic Version Validation
 * 
 * Provides comprehensive semantic versioning validation and compliance checking
 */

import { ValidationResult, ValidationError, ValidationWarning, VersionBump } from '../types/ReleaseTypes';
import { SemanticVersioningRules } from '../config/ReleaseConfig';

export class SemanticVersionValidator {
  private rules: SemanticVersioningRules;

  constructor(rules: SemanticVersioningRules) {
    this.rules = rules;
  }

  /**
   * Validate semantic versioning compliance for a version bump
   */
  async validateVersionBump(versionBump: VersionBump): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate version format
    const formatValidation = this.validateVersionFormat(versionBump.to);
    errors.push(...formatValidation.errors);
    warnings.push(...formatValidation.warnings);

    // Validate version progression
    const progressionValidation = this.validateVersionProgression(versionBump);
    errors.push(...progressionValidation.errors);
    warnings.push(...progressionValidation.warnings);

    // Validate bump type consistency
    const bumpTypeValidation = this.validateBumpTypeConsistency(versionBump);
    errors.push(...bumpTypeValidation.errors);
    warnings.push(...bumpTypeValidation.warnings);

    // Validate pre-release rules if applicable
    if (versionBump.preRelease) {
      const preReleaseValidation = this.validatePreReleaseRules(versionBump);
      errors.push(...preReleaseValidation.errors);
      warnings.push(...preReleaseValidation.warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      validatedAt: new Date(),
      context: 'semantic-versioning'
    };
  }

  /**
   * Validate version format against semantic versioning specification
   */
  private validateVersionFormat(version: string): { errors: ValidationError[], warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Basic semantic version regex
    const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

    if (!semverRegex.test(version)) {
      errors.push({
        code: 'INVALID_SEMVER_FORMAT',
        message: `Version '${version}' does not follow semantic versioning specification`,
        severity: 'error',
        suggestion: 'Use format MAJOR.MINOR.PATCH or MAJOR.MINOR.PATCH-prerelease+build'
      });
      return { errors, warnings };
    }

    // Apply custom validation rules
    for (const rule of this.rules.validationRules) {
      const ruleRegex = new RegExp(rule.pattern);
      if (!ruleRegex.test(version)) {
        if (this.rules.strictCompliance) {
          errors.push({
            code: rule.id.toUpperCase(),
            message: rule.errorMessage,
            severity: 'error',
            suggestion: rule.description
          });
        } else {
          warnings.push({
            code: rule.id.toUpperCase(),
            message: rule.errorMessage,
            suggestion: rule.description
          });
        }
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate version progression logic
   */
  private validateVersionProgression(versionBump: VersionBump): { errors: ValidationError[], warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const fromParts = this.parseVersion(versionBump.from);
    const toParts = this.parseVersion(versionBump.to);

    if (!fromParts || !toParts) {
      errors.push({
        code: 'INVALID_VERSION_COMPARISON',
        message: 'Cannot compare versions due to invalid format',
        severity: 'error',
        suggestion: 'Ensure both from and to versions follow semantic versioning format'
      });
      return { errors, warnings };
    }

    // Validate progression based on bump type
    switch (versionBump.type) {
      case 'major':
        if (toParts.major <= fromParts.major) {
          errors.push({
            code: 'INVALID_MAJOR_BUMP',
            message: `Major version must increase: ${versionBump.from} -> ${versionBump.to}`,
            severity: 'error',
            suggestion: 'Ensure major version number increases for major bumps'
          });
        }
        if (toParts.minor !== 0 || toParts.patch !== 0) {
          warnings.push({
            code: 'MAJOR_BUMP_RESET_WARNING',
            message: 'Major version bump should reset minor and patch to 0',
            suggestion: 'Consider resetting minor and patch versions to 0 for major releases'
          });
        }
        break;

      case 'minor':
        if (toParts.major !== fromParts.major) {
          errors.push({
            code: 'INVALID_MINOR_BUMP_MAJOR_CHANGE',
            message: `Minor bump should not change major version: ${versionBump.from} -> ${versionBump.to}`,
            severity: 'error',
            suggestion: 'Use major bump if breaking changes are present'
          });
        }
        if (toParts.minor <= fromParts.minor) {
          errors.push({
            code: 'INVALID_MINOR_BUMP',
            message: `Minor version must increase: ${versionBump.from} -> ${versionBump.to}`,
            severity: 'error',
            suggestion: 'Ensure minor version number increases for minor bumps'
          });
        }
        if (toParts.patch !== 0) {
          warnings.push({
            code: 'MINOR_BUMP_RESET_WARNING',
            message: 'Minor version bump should reset patch to 0',
            suggestion: 'Consider resetting patch version to 0 for minor releases'
          });
        }
        break;

      case 'patch':
        if (toParts.major !== fromParts.major || toParts.minor !== fromParts.minor) {
          errors.push({
            code: 'INVALID_PATCH_BUMP_VERSION_CHANGE',
            message: `Patch bump should only change patch version: ${versionBump.from} -> ${versionBump.to}`,
            severity: 'error',
            suggestion: 'Use appropriate bump type for major or minor changes'
          });
        }
        if (toParts.patch <= fromParts.patch) {
          errors.push({
            code: 'INVALID_PATCH_BUMP',
            message: `Patch version must increase: ${versionBump.from} -> ${versionBump.to}`,
            severity: 'error',
            suggestion: 'Ensure patch version number increases for patch bumps'
          });
        }
        break;
    }

    return { errors, warnings };
  }

  /**
   * Validate bump type consistency with changes
   */
  private validateBumpTypeConsistency(versionBump: VersionBump): { errors: ValidationError[], warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check if rationale matches bump type
    const rationale = versionBump.rationale.toLowerCase();

    const breakingChangeIndicators = ['breaking', 'incompatible', 'removes', 'deprecated'];
    const featureIndicators = ['feature', 'adds', 'new', 'enhancement'];
    const fixIndicators = ['fix', 'bug', 'patch', 'correction'];

    const hasBreakingChange = breakingChangeIndicators.some(indicator => rationale.includes(indicator));
    const hasNewFeature = featureIndicators.some(indicator => rationale.includes(indicator));
    const hasBugFix = fixIndicators.some(indicator => rationale.includes(indicator));

    // Validate bump type against detected change types
    if (hasBreakingChange && versionBump.type !== 'major') {
      errors.push({
        code: 'BREAKING_CHANGE_REQUIRES_MAJOR',
        message: 'Breaking changes detected but bump type is not major',
        severity: 'error',
        suggestion: 'Use major version bump for breaking changes'
      });
    }

    if (hasNewFeature && versionBump.type === 'patch') {
      warnings.push({
        code: 'FEATURE_SUGGESTS_MINOR',
        message: 'New features detected but using patch bump',
        suggestion: 'Consider using minor version bump for new features'
      });
    }

    if (hasBugFix && versionBump.type === 'major') {
      warnings.push({
        code: 'BUG_FIX_MAJOR_BUMP',
        message: 'Bug fix with major version bump - ensure breaking changes are present',
        suggestion: 'Verify that breaking changes justify major version bump'
      });
    }

    return { errors, warnings };
  }

  /**
   * Validate pre-release version rules
   */
  private validatePreReleaseRules(versionBump: VersionBump): { errors: ValidationError[], warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!this.rules.allowPreRelease) {
      errors.push({
        code: 'PRERELEASE_NOT_ALLOWED',
        message: 'Pre-release versions are not allowed by current configuration',
        severity: 'error',
        suggestion: 'Enable pre-release versions in configuration or use stable version'
      });
      return { errors, warnings };
    }

    const preRelease = versionBump.preRelease!;

    // Validate pre-release type
    const allowedTypes = ['alpha', 'beta', 'rc'];
    if (!allowedTypes.includes(preRelease.type)) {
      errors.push({
        code: 'INVALID_PRERELEASE_TYPE',
        message: `Invalid pre-release type '${preRelease.type}'. Allowed: ${allowedTypes.join(', ')}`,
        severity: 'error',
        suggestion: 'Use one of the allowed pre-release types'
      });
    }

    // Validate pre-release number
    if (preRelease.number < 1) {
      errors.push({
        code: 'INVALID_PRERELEASE_NUMBER',
        message: 'Pre-release number must be greater than 0',
        severity: 'error',
        suggestion: 'Use positive integers for pre-release numbers'
      });
    }

    // Validate pre-release identifier format
    const expectedFormat = this.rules.preReleaseFormat
      .replace('{version}', versionBump.to.split('-')[0])
      .replace('{type}', preRelease.type)
      .replace('{number}', preRelease.number.toString());

    if (preRelease.identifier !== expectedFormat) {
      warnings.push({
        code: 'PRERELEASE_FORMAT_MISMATCH',
        message: `Pre-release identifier '${preRelease.identifier}' doesn't match expected format '${expectedFormat}'`,
        suggestion: 'Ensure pre-release identifier follows configured format'
      });
    }

    return { errors, warnings };
  }

  /**
   * Parse semantic version into components
   */
  private parseVersion(version: string): { major: number, minor: number, patch: number, preRelease?: string } | null {
    const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

    const match = version.match(semverRegex);
    if (!match) {
      return null;
    }

    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: parseInt(match[3], 10),
      preRelease: match[4]
    };
  }

  /**
   * Validate version against semantic versioning rules
   */
  async validateVersion(version: string): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const formatValidation = this.validateVersionFormat(version);
    errors.push(...formatValidation.errors);
    warnings.push(...formatValidation.warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      validatedAt: new Date(),
      context: 'version-format'
    };
  }
}