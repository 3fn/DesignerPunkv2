/**
 * Release Readiness Validation
 * 
 * Validates that all completion documentation exists and is properly formatted
 * before allowing a release to proceed
 */

import { ValidationResult, ValidationError, ValidationWarning, ReleasePlan } from '../types/ReleaseTypes';
import { ValidationRulesConfig } from '../config/ReleaseConfig';
import * as fs from 'fs/promises';
import * as path from 'path';

export class ReleaseReadinessValidator {
  private rules: ValidationRulesConfig;

  constructor(rules: ValidationRulesConfig) {
    this.rules = rules;
  }

  /**
   * Validate release readiness including completion documentation
   */
  async validateReleaseReadiness(releasePlan: ReleasePlan): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate completion documentation exists
    if (this.rules.requireCompletionDocs) {
      const docValidation = await this.validateCompletionDocumentation(releasePlan);
      errors.push(...docValidation.errors);
      warnings.push(...docValidation.warnings);
    }

    // Validate document format if enabled
    if (this.rules.validateDocFormat) {
      const formatValidation = await this.validateDocumentFormat(releasePlan);
      errors.push(...formatValidation.errors);
      warnings.push(...formatValidation.warnings);
    }

    // Validate breaking changes documentation
    const breakingChangeValidation = await this.validateBreakingChangesDocumentation(releasePlan);
    errors.push(...breakingChangeValidation.errors);
    warnings.push(...breakingChangeValidation.warnings);

    // Validate release notes completeness
    const releaseNotesValidation = this.validateReleaseNotesCompleteness(releasePlan);
    errors.push(...releaseNotesValidation.errors);
    warnings.push(...releaseNotesValidation.warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      validatedAt: new Date(),
      context: 'release-readiness'
    };
  }

  /**
   * Validate that completion documentation exists for all packages
   */
  private async validateCompletionDocumentation(releasePlan: ReleasePlan): Promise<{ errors: ValidationError[], warnings: ValidationWarning[] }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    for (const packageUpdate of releasePlan.packages) {
      // Check for spec completion documentation
      const specCompletionPath = this.getSpecCompletionPath(packageUpdate.name);
      const specExists = await this.fileExists(specCompletionPath);

      if (!specExists) {
        errors.push({
          code: 'MISSING_SPEC_COMPLETION',
          message: `Missing spec completion documentation for package '${packageUpdate.name}'`,
          severity: 'error',
          source: packageUpdate.name,
          suggestion: `Create completion documentation at ${specCompletionPath}`
        });
      }

      // Check for task completion documentation
      const taskCompletionPaths = await this.getTaskCompletionPaths(packageUpdate.name);
      const missingTaskDocs = [];

      for (const taskPath of taskCompletionPaths) {
        const taskExists = await this.fileExists(taskPath);
        if (!taskExists) {
          missingTaskDocs.push(taskPath);
        }
      }

      if (missingTaskDocs.length > 0) {
        warnings.push({
          code: 'MISSING_TASK_COMPLETION',
          message: `Missing task completion documentation for package '${packageUpdate.name}': ${missingTaskDocs.join(', ')}`,
          source: packageUpdate.name,
          suggestion: 'Create completion documentation for all completed tasks'
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate document format and required sections
   */
  private async validateDocumentFormat(releasePlan: ReleasePlan): Promise<{ errors: ValidationError[], warnings: ValidationWarning[] }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    for (const packageUpdate of releasePlan.packages) {
      const completionDocs = await this.getCompletionDocuments(packageUpdate.name);

      for (const docPath of completionDocs) {
        try {
          const content = await fs.readFile(docPath, 'utf-8');
          const sectionValidation = this.validateRequiredSections(content, docPath);
          errors.push(...sectionValidation.errors);
          warnings.push(...sectionValidation.warnings);

          const metadataValidation = this.validateDocumentMetadata(content, docPath);
          errors.push(...metadataValidation.errors);
          warnings.push(...metadataValidation.warnings);
        } catch (error) {
          errors.push({
            code: 'DOCUMENT_READ_ERROR',
            message: `Cannot read completion document: ${docPath}`,
            severity: 'error',
            source: docPath,
            suggestion: 'Ensure document exists and is readable'
          });
        }
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate breaking changes documentation
   */
  private async validateBreakingChangesDocumentation(releasePlan: ReleasePlan): Promise<{ errors: ValidationError[], warnings: ValidationWarning[] }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const hasBreakingChanges = releasePlan.releaseNotes.breakingChanges.length > 0;
    const isMajorRelease = releasePlan.version.type === 'major';

    if (hasBreakingChanges || isMajorRelease) {
      // Validate each breaking change has proper documentation
      for (const breakingChange of releasePlan.releaseNotes.breakingChanges) {
        const ruleValidation = this.validateBreakingChangeAgainstRules(breakingChange);
        errors.push(...ruleValidation.errors);
        warnings.push(...ruleValidation.warnings);
      }

      // Validate migration guide exists for major releases
      if (isMajorRelease && !releasePlan.releaseNotes.migrationGuide) {
        errors.push({
          code: 'MISSING_MIGRATION_GUIDE',
          message: 'Major release requires migration guide',
          severity: 'error',
          suggestion: 'Create migration guide with step-by-step instructions for breaking changes'
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate release notes completeness
   */
  private validateReleaseNotesCompleteness(releasePlan: ReleasePlan): { errors: ValidationError[], warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const releaseNotes = releasePlan.releaseNotes;

    // Validate release notes have content
    if (!releaseNotes.summary || releaseNotes.summary.trim().length === 0) {
      warnings.push({
        code: 'EMPTY_RELEASE_SUMMARY',
        message: 'Release notes summary is empty',
        suggestion: 'Add a meaningful summary of changes in this release'
      });
    }

    // Validate at least one type of change is documented
    const hasChanges = releaseNotes.newFeatures.length > 0 ||
                      releaseNotes.improvements.length > 0 ||
                      releaseNotes.bugFixes.length > 0 ||
                      releaseNotes.breakingChanges.length > 0;

    if (!hasChanges) {
      warnings.push({
        code: 'NO_DOCUMENTED_CHANGES',
        message: 'No changes documented in release notes',
        suggestion: 'Document features, improvements, or fixes included in this release'
      });
    }

    // Validate version consistency
    if (releaseNotes.version !== releasePlan.version.to) {
      errors.push({
        code: 'VERSION_MISMATCH',
        message: `Release notes version '${releaseNotes.version}' doesn't match plan version '${releasePlan.version.to}'`,
        severity: 'error',
        suggestion: 'Ensure release notes version matches the planned release version'
      });
    }

    return { errors, warnings };
  }

  /**
   * Validate required sections in completion document
   */
  private validateRequiredSections(content: string, docPath: string): { errors: ValidationError[], warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    for (const section of this.rules.requiredSections) {
      // Check for section header (markdown format)
      const sectionRegex = new RegExp(`^#+\\s*${section}\\s*$`, 'mi');
      if (!sectionRegex.test(content)) {
        warnings.push({
          code: 'MISSING_REQUIRED_SECTION',
          message: `Missing required section '${section}' in completion document`,
          source: docPath,
          suggestion: `Add '${section}' section to the completion document`
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate document metadata
   */
  private validateDocumentMetadata(content: string, docPath: string): { errors: ValidationError[], warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check for required metadata fields
    const requiredMetadata = ['Date', 'Task', 'Status'];
    
    for (const field of requiredMetadata) {
      const metadataRegex = new RegExp(`^\\*\\*${field}\\*\\*:`, 'mi');
      if (!metadataRegex.test(content)) {
        warnings.push({
          code: 'MISSING_METADATA_FIELD',
          message: `Missing metadata field '${field}' in completion document`,
          source: docPath,
          suggestion: `Add '**${field}**: [value]' to the document header`
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate breaking change against configured rules
   */
  private validateBreakingChangeAgainstRules(breakingChange: any): { errors: ValidationError[], warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    for (const rule of this.rules.breakingChangeRules) {
      const ruleRegex = new RegExp(rule.pattern, 'i');
      
      if (ruleRegex.test(breakingChange.description)) {
        if (rule.requireMigrationGuidance && !breakingChange.migrationGuidance) {
          errors.push({
            code: 'MISSING_MIGRATION_GUIDANCE',
            message: `Breaking change '${breakingChange.title}' requires migration guidance`,
            severity: 'error',
            source: breakingChange.source,
            suggestion: 'Add migration guidance explaining how users should adapt to this change'
          });
        }
      }
    }

    return { errors, warnings };
  }

  /**
   * Get spec completion path for a package
   */
  private getSpecCompletionPath(packageName: string): string {
    // Extract spec name from package name (e.g., @designerpunk/tokens -> tokens)
    const specName = packageName.replace('@designerpunk/', '');
    return path.join('.kiro', 'specs', specName, 'completion', 'spec-completion-summary.md');
  }

  /**
   * Get task completion paths for a package
   */
  private async getTaskCompletionPaths(packageName: string): Promise<string[]> {
    const specName = packageName.replace('@designerpunk/', '');
    const completionDir = path.join('.kiro', 'specs', specName, 'completion');
    
    try {
      const files = await fs.readdir(completionDir);
      return files
        .filter(file => file.startsWith('task-') && file.endsWith('-completion.md'))
        .map(file => path.join(completionDir, file));
    } catch (error) {
      return [];
    }
  }

  /**
   * Get all completion documents for a package
   */
  private async getCompletionDocuments(packageName: string): Promise<string[]> {
    const specCompletionPath = this.getSpecCompletionPath(packageName);
    const taskCompletionPaths = await this.getTaskCompletionPaths(packageName);
    
    const allPaths = [specCompletionPath, ...taskCompletionPaths];
    const existingPaths = [];
    
    for (const docPath of allPaths) {
      if (await this.fileExists(docPath)) {
        existingPaths.push(docPath);
      }
    }
    
    return existingPaths;
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
}