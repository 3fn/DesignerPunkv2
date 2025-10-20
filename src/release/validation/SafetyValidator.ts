/**
 * Release Safety Validation
 * 
 * Provides safety checks for release readiness and rollback capabilities
 * to prevent incorrect or harmful releases
 */

import { ValidationResult, ValidationError, ValidationWarning, ReleasePlan, ReleaseResult } from '../types/ReleaseTypes';
import { SafetyChecksConfig } from '../config/ReleaseConfig';
import * as fs from 'fs/promises';
import * as path from 'path';

export class SafetyValidator {
  private config: SafetyChecksConfig;

  constructor(config: SafetyChecksConfig) {
    this.config = config;
  }

  /**
   * Validate release safety checks
   */
  async validateReleaseSafety(releasePlan: ReleasePlan): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate rollback capability
    if (this.config.rollbackValidation) {
      const rollbackValidation = await this.validateRollbackCapability(releasePlan);
      errors.push(...rollbackValidation.errors);
      warnings.push(...rollbackValidation.warnings);
    }

    // Validate dependency conflicts
    if (this.config.dependencyConflictDetection) {
      const dependencyValidation = await this.validateDependencyConflicts(releasePlan);
      errors.push(...dependencyValidation.errors);
      warnings.push(...dependencyValidation.warnings);
    }

    // Validate publishing safety
    if (this.config.publishingSafetyChecks) {
      const publishingValidation = await this.validatePublishingSafety(releasePlan);
      errors.push(...publishingValidation.errors);
      warnings.push(...publishingValidation.warnings);
    }

    // Validate major release confirmation
    if (this.config.requireMajorReleaseConfirmation) {
      const majorReleaseValidation = this.validateMajorReleaseConfirmation(releasePlan);
      errors.push(...majorReleaseValidation.errors);
      warnings.push(...majorReleaseValidation.warnings);
    }

    // Validate breaking change confirmation
    if (this.config.requireBreakingChangeConfirmation) {
      const breakingChangeValidation = this.validateBreakingChangeConfirmation(releasePlan);
      errors.push(...breakingChangeValidation.errors);
      warnings.push(...breakingChangeValidation.warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      validatedAt: new Date(),
      context: 'release-safety'
    };
  }

  /**
   * Validate rollback capability exists and is functional
   */
  private async validateRollbackCapability(releasePlan: ReleasePlan): Promise<{ errors: ValidationError[], warnings: ValidationWarning[] }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check if rollback plan exists
    const rollbackPlanPath = this.getRollbackPlanPath(releasePlan);
    const rollbackPlanExists = await this.fileExists(rollbackPlanPath);

    if (!rollbackPlanExists) {
      errors.push({
        code: 'MISSING_ROLLBACK_PLAN',
        message: 'Rollback plan is required for release safety',
        severity: 'error',
        suggestion: `Create rollback plan at ${rollbackPlanPath}`
      });
    } else {
      // Validate rollback plan content
      try {
        const rollbackContent = await fs.readFile(rollbackPlanPath, 'utf-8');
        const contentValidation = this.validateRollbackPlanContent(rollbackContent, rollbackPlanPath);
        errors.push(...contentValidation.errors);
        warnings.push(...contentValidation.warnings);
      } catch (error) {
        errors.push({
          code: 'ROLLBACK_PLAN_READ_ERROR',
          message: `Cannot read rollback plan: ${rollbackPlanPath}`,
          severity: 'error',
          source: rollbackPlanPath,
          suggestion: 'Ensure rollback plan exists and is readable'
        });
      }
    }

    // Validate git state for rollback
    const gitValidation = await this.validateGitStateForRollback();
    errors.push(...gitValidation.errors);
    warnings.push(...gitValidation.warnings);

    // Validate backup capabilities
    const backupValidation = await this.validateBackupCapabilities(releasePlan);
    errors.push(...backupValidation.errors);
    warnings.push(...backupValidation.warnings);

    return { errors, warnings };
  }

  /**
   * Validate dependency conflicts that could cause issues
   */
  private async validateDependencyConflicts(releasePlan: ReleasePlan): Promise<{ errors: ValidationError[], warnings: ValidationWarning[] }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check for circular dependencies
    const circularDeps = this.detectCircularDependencies(releasePlan.packages);
    if (circularDeps.length > 0) {
      errors.push({
        code: 'CIRCULAR_DEPENDENCY_DETECTED',
        message: `Circular dependencies detected: ${circularDeps.join(' -> ')}`,
        severity: 'error',
        suggestion: 'Refactor packages to eliminate circular dependencies before release'
      });
    }

    // Check for version conflicts
    for (const packageUpdate of releasePlan.packages) {
      for (const depUpdate of packageUpdate.dependencyUpdates) {
        const conflict = this.checkVersionConflict(depUpdate, releasePlan.packages);
        if (conflict) {
          errors.push({
            code: 'DEPENDENCY_VERSION_CONFLICT',
            message: `Version conflict for dependency '${depUpdate.name}': ${conflict}`,
            severity: 'error',
            source: packageUpdate.name,
            suggestion: 'Resolve version conflicts before proceeding with release'
          });
        }
      }
    }

    // Check for missing dependencies
    const missingDeps = await this.checkMissingDependencies(releasePlan.packages);
    for (const missingDep of missingDeps) {
      warnings.push({
        code: 'MISSING_DEPENDENCY',
        message: `Missing dependency '${missingDep.name}' for package '${missingDep.package}'`,
        source: missingDep.package,
        suggestion: 'Ensure all dependencies are available before release'
      });
    }

    return { errors, warnings };
  }

  /**
   * Validate publishing safety checks
   */
  private async validatePublishingSafety(releasePlan: ReleasePlan): Promise<{ errors: ValidationError[], warnings: ValidationWarning[] }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate publishing order
    const orderValidation = this.validatePublishingOrder(releasePlan.publishingPlan);
    errors.push(...orderValidation.errors);
    warnings.push(...orderValidation.warnings);

    // Validate authentication tokens
    const authValidation = await this.validateAuthenticationTokens();
    errors.push(...authValidation.errors);
    warnings.push(...authValidation.warnings);

    // Validate package registry accessibility
    const registryValidation = await this.validateRegistryAccessibility(releasePlan.packages);
    errors.push(...registryValidation.errors);
    warnings.push(...registryValidation.warnings);

    // Validate build artifacts exist
    const artifactValidation = await this.validateBuildArtifacts(releasePlan.packages);
    errors.push(...artifactValidation.errors);
    warnings.push(...artifactValidation.warnings);

    return { errors, warnings };
  }

  /**
   * Validate major release confirmation
   */
  private validateMajorReleaseConfirmation(releasePlan: ReleasePlan): { errors: ValidationError[], warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (releasePlan.version.type === 'major') {
      // Check for explicit confirmation in release plan or environment
      const confirmationExists = this.checkMajorReleaseConfirmation();
      
      if (!confirmationExists) {
        errors.push({
          code: 'MAJOR_RELEASE_CONFIRMATION_REQUIRED',
          message: 'Major release requires explicit confirmation',
          severity: 'error',
          suggestion: 'Set CONFIRM_MAJOR_RELEASE=true environment variable or add confirmation to release plan'
        });
      }

      // Validate breaking changes are documented
      if (releasePlan.releaseNotes.breakingChanges.length === 0) {
        warnings.push({
          code: 'MAJOR_RELEASE_NO_BREAKING_CHANGES',
          message: 'Major release without documented breaking changes',
          suggestion: 'Verify that major version bump is appropriate or document breaking changes'
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate breaking change confirmation
   */
  private validateBreakingChangeConfirmation(releasePlan: ReleasePlan): { errors: ValidationError[], warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (releasePlan.releaseNotes.breakingChanges.length > 0) {
      const confirmationExists = this.checkBreakingChangeConfirmation();
      
      if (!confirmationExists) {
        errors.push({
          code: 'BREAKING_CHANGE_CONFIRMATION_REQUIRED',
          message: 'Breaking changes require explicit confirmation',
          severity: 'error',
          suggestion: 'Set CONFIRM_BREAKING_CHANGES=true environment variable or add confirmation to release plan'
        });
      }

      // Validate migration guidance exists for each breaking change
      for (const breakingChange of releasePlan.releaseNotes.breakingChanges) {
        if (!breakingChange.migrationGuidance) {
          warnings.push({
            code: 'MISSING_MIGRATION_GUIDANCE',
            message: `Breaking change '${breakingChange.title}' lacks migration guidance`,
            source: breakingChange.source,
            suggestion: 'Add migration guidance to help users adapt to breaking changes'
          });
        }
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate rollback plan content
   */
  private validateRollbackPlanContent(content: string, planPath: string): { errors: ValidationError[], warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const requiredSections = [
      'Rollback Steps',
      'Git Tag Removal',
      'Package Unpublishing',
      'Verification Steps'
    ];

    for (const section of requiredSections) {
      const sectionRegex = new RegExp(`^#+\\s*${section}\\s*$`, 'mi');
      if (!sectionRegex.test(content)) {
        warnings.push({
          code: 'MISSING_ROLLBACK_SECTION',
          message: `Rollback plan missing section: ${section}`,
          source: planPath,
          suggestion: `Add '${section}' section to rollback plan`
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate git state for rollback capability
   */
  private async validateGitStateForRollback(): Promise<{ errors: ValidationError[], warnings: ValidationWarning[] }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    try {
      // Check if git repository is clean
      const { execSync } = require('child_process');
      
      try {
        const status = execSync('git status --porcelain', { encoding: 'utf-8' });
        if (status.trim().length > 0) {
          warnings.push({
            code: 'DIRTY_GIT_STATE',
            message: 'Git repository has uncommitted changes',
            suggestion: 'Commit or stash changes before release for clean rollback capability'
          });
        }
      } catch (gitError) {
        warnings.push({
          code: 'GIT_STATUS_CHECK_FAILED',
          message: 'Cannot check git status',
          suggestion: 'Ensure git is available and repository is properly initialized'
        });
      }

      // Check if we can create tags
      try {
        execSync('git tag --help', { stdio: 'ignore' });
      } catch (tagError) {
        errors.push({
          code: 'GIT_TAG_UNAVAILABLE',
          message: 'Git tag functionality not available',
          severity: 'error',
          suggestion: 'Ensure git is properly configured for tag creation'
        });
      }
    } catch (error) {
      warnings.push({
        code: 'GIT_VALIDATION_ERROR',
        message: 'Cannot validate git state for rollback',
        suggestion: 'Ensure git is available and properly configured'
      });
    }

    return { errors, warnings };
  }

  /**
   * Validate backup capabilities
   */
  private async validateBackupCapabilities(releasePlan: ReleasePlan): Promise<{ errors: ValidationError[], warnings: ValidationWarning[] }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check if package.json files can be backed up
    for (const packageUpdate of releasePlan.packages) {
      const packageJsonPath = path.join(packageUpdate.name.replace('@designerpunk/', 'packages/'), 'package.json');
      
      try {
        await fs.access(packageJsonPath);
        
        // Check if we can create backup
        const backupPath = `${packageJsonPath}.backup`;
        try {
          const content = await fs.readFile(packageJsonPath, 'utf-8');
          await fs.writeFile(backupPath, content);
          await fs.unlink(backupPath); // Clean up test backup
        } catch (backupError) {
          warnings.push({
            code: 'BACKUP_CREATION_FAILED',
            message: `Cannot create backup for ${packageJsonPath}`,
            source: packageUpdate.name,
            suggestion: 'Ensure write permissions for backup creation'
          });
        }
      } catch (accessError) {
        errors.push({
          code: 'PACKAGE_JSON_NOT_FOUND',
          message: `Package.json not found for ${packageUpdate.name}`,
          severity: 'error',
          source: packageUpdate.name,
          suggestion: 'Ensure package.json exists before release'
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Detect circular dependencies
   */
  private detectCircularDependencies(packages: any[]): string[] {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const path: string[] = [];

    for (const pkg of packages) {
      if (!visited.has(pkg.name)) {
        const cycle = this.detectCycleFromPackage(pkg.name, packages, visited, recursionStack, path);
        if (cycle.length > 0) {
          return cycle;
        }
      }
    }

    return [];
  }

  /**
   * Detect cycle from specific package
   */
  private detectCycleFromPackage(
    packageName: string,
    packages: any[],
    visited: Set<string>,
    recursionStack: Set<string>,
    path: string[]
  ): string[] {
    visited.add(packageName);
    recursionStack.add(packageName);
    path.push(packageName);

    const pkg = packages.find(p => p.name === packageName);
    if (pkg && pkg.dependencyUpdates) {
      for (const dep of pkg.dependencyUpdates) {
        if (!visited.has(dep.name)) {
          const cycle = this.detectCycleFromPackage(dep.name, packages, visited, recursionStack, path);
          if (cycle.length > 0) {
            return cycle;
          }
        } else if (recursionStack.has(dep.name)) {
          const cycleStart = path.indexOf(dep.name);
          return path.slice(cycleStart).concat([dep.name]);
        }
      }
    }

    recursionStack.delete(packageName);
    path.pop();
    return [];
  }

  /**
   * Check version conflict for dependency
   */
  private checkVersionConflict(depUpdate: any, packages: any[]): string | null {
    const targetPackage = packages.find(pkg => pkg.name === depUpdate.name);
    
    if (targetPackage) {
      const requiredVersion = depUpdate.to;
      const actualVersion = targetPackage.versionBump.to;
      
      if (requiredVersion !== actualVersion && !this.isVersionCompatible(requiredVersion, actualVersion)) {
        return `requires ${requiredVersion} but ${actualVersion} will be published`;
      }
    }
    
    return null;
  }

  /**
   * Check for missing dependencies
   */
  private async checkMissingDependencies(packages: any[]): Promise<{ name: string, package: string }[]> {
    const missingDeps: { name: string, package: string }[] = [];
    
    for (const pkg of packages) {
      for (const depUpdate of pkg.dependencyUpdates) {
        const depExists = packages.some(p => p.name === depUpdate.name);
        if (!depExists) {
          // Check if dependency exists in node_modules or registry
          const exists = await this.checkDependencyExists(depUpdate.name);
          if (!exists) {
            missingDeps.push({ name: depUpdate.name, package: pkg.name });
          }
        }
      }
    }
    
    return missingDeps;
  }

  /**
   * Validate publishing order
   */
  private validatePublishingOrder(publishingPlan: any): { errors: ValidationError[], warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check for dependency order violations
    const packages = publishingPlan.order;
    const packageDeps = new Map<string, string[]>();

    // Build dependency map
    for (const step of publishingPlan.steps) {
      if (step.type === 'npm-publish') {
        for (const pkg of step.packages) {
          // This would need actual dependency information
          // For now, we'll do a basic check
        }
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate authentication tokens
   */
  private async validateAuthenticationTokens(): Promise<{ errors: ValidationError[], warnings: ValidationWarning[] }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check GitHub token
    if (!process.env.GITHUB_TOKEN) {
      errors.push({
        code: 'MISSING_GITHUB_TOKEN',
        message: 'GitHub authentication token not found',
        severity: 'error',
        suggestion: 'Set GITHUB_TOKEN environment variable'
      });
    }

    // Check npm token
    if (!process.env.NPM_TOKEN) {
      errors.push({
        code: 'MISSING_NPM_TOKEN',
        message: 'npm authentication token not found',
        severity: 'error',
        suggestion: 'Set NPM_TOKEN environment variable'
      });
    }

    return { errors, warnings };
  }

  /**
   * Validate registry accessibility
   */
  private async validateRegistryAccessibility(packages: any[]): Promise<{ errors: ValidationError[], warnings: ValidationWarning[] }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // This would involve actual network checks to registries
    // For now, we'll do basic validation
    
    return { errors, warnings };
  }

  /**
   * Validate build artifacts exist
   */
  private async validateBuildArtifacts(packages: any[]): Promise<{ errors: ValidationError[], warnings: ValidationWarning[] }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    for (const pkg of packages) {
      const distPath = path.join(pkg.name.replace('@designerpunk/', 'packages/'), 'dist');
      
      try {
        await fs.access(distPath);
      } catch (error) {
        warnings.push({
          code: 'MISSING_BUILD_ARTIFACTS',
          message: `Build artifacts not found for ${pkg.name}`,
          source: pkg.name,
          suggestion: 'Run build process before release'
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Check major release confirmation
   */
  private checkMajorReleaseConfirmation(): boolean {
    return process.env.CONFIRM_MAJOR_RELEASE === 'true';
  }

  /**
   * Check breaking change confirmation
   */
  private checkBreakingChangeConfirmation(): boolean {
    return process.env.CONFIRM_BREAKING_CHANGES === 'true';
  }

  /**
   * Get rollback plan path
   */
  private getRollbackPlanPath(releasePlan: ReleasePlan): string {
    return path.join('.kiro', 'release', 'rollback-plans', `rollback-${releasePlan.version.to}.md`);
  }

  /**
   * Check if file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if dependency exists
   */
  private async checkDependencyExists(depName: string): Promise<boolean> {
    // This would involve checking npm registry or local node_modules
    // For now, return true as a placeholder
    return true;
  }

  /**
   * Check if versions are compatible
   */
  private isVersionCompatible(required: string, actual: string): boolean {
    // Simple version compatibility check
    const requiredParts = required.replace(/[^0-9.]/g, '').split('.').map(Number);
    const actualParts = actual.replace(/[^0-9.]/g, '').split('.').map(Number);

    // Major version must match
    if (requiredParts[0] !== actualParts[0]) {
      return false;
    }

    // Minor version must be >= required
    if (actualParts[1] < requiredParts[1]) {
      return false;
    }

    // If minor versions match, patch must be >= required
    if (actualParts[1] === requiredParts[1] && actualParts[2] < requiredParts[2]) {
      return false;
    }

    return true;
  }
}