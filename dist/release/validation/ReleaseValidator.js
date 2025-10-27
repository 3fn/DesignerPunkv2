"use strict";
/**
 * Release Validation Framework
 *
 * Provides comprehensive validation for release operations, semantic versioning,
 * and safety checks for release readiness and rollback capabilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseValidator = void 0;
const SemanticVersionValidator_1 = require("./SemanticVersionValidator");
const ReleaseReadinessValidator_1 = require("./ReleaseReadinessValidator");
const SafetyValidator_1 = require("./SafetyValidator");
class ReleaseValidator {
    constructor(config) {
        this.config = config;
        this.semanticVersionValidator = new SemanticVersionValidator_1.SemanticVersionValidator(config.versioning.semanticVersioning);
        this.releaseReadinessValidator = new ReleaseReadinessValidator_1.ReleaseReadinessValidator(config.validation.validationRules);
        this.safetyValidator = new SafetyValidator_1.SafetyValidator(config.validation.safetyChecks);
    }
    /**
     * Comprehensive release validation
     */
    async validateRelease(releasePlan) {
        const allErrors = [];
        const allWarnings = [];
        // Validate release readiness
        if (this.config.validation.releaseReadiness) {
            const readinessResult = await this.releaseReadinessValidator.validateReleaseReadiness(releasePlan);
            allErrors.push(...readinessResult.errors);
            allWarnings.push(...readinessResult.warnings);
        }
        // Validate semantic versioning
        if (this.config.validation.versionBumpValidation) {
            const versionResult = await this.semanticVersionValidator.validateVersionBump(releasePlan.version);
            allErrors.push(...versionResult.errors);
            allWarnings.push(...versionResult.warnings);
        }
        // Validate package compatibility
        if (this.config.validation.packageCompatibility) {
            const compatibilityResult = await this.validatePackageCompatibility(releasePlan.packages);
            allErrors.push(...compatibilityResult.errors);
            allWarnings.push(...compatibilityResult.warnings);
        }
        // Validate safety checks
        const safetyResult = await this.safetyValidator.validateReleaseSafety(releasePlan);
        allErrors.push(...safetyResult.errors);
        allWarnings.push(...safetyResult.warnings);
        return {
            valid: allErrors.length === 0,
            errors: allErrors,
            warnings: allWarnings,
            validatedAt: new Date(),
            context: 'comprehensive-release-validation'
        };
    }
    /**
     * Validate release readiness (legacy method for backward compatibility)
     */
    async validateReleaseReadiness(releaseData) {
        const errors = [];
        const warnings = [];
        if (!this.config.validation.releaseReadiness) {
            return {
                valid: true,
                errors: [],
                warnings: [],
                validatedAt: new Date(),
                context: 'release-readiness'
            };
        }
        // Validate completion documentation exists
        if (this.config.validation.validationRules.requireCompletionDocs) {
            if (!releaseData.completionDocs || releaseData.completionDocs.length === 0) {
                errors.push({
                    code: 'MISSING_COMPLETION_DOCS',
                    message: 'Release requires completion documentation',
                    severity: 'error',
                    suggestion: 'Create completion documents for all completed tasks and specs'
                });
            }
        }
        // Validate required sections in completion documents
        if (this.config.validation.validationRules.validateDocFormat && releaseData.completionDocs) {
            for (const doc of releaseData.completionDocs) {
                const missingSection = this.validateDocumentSections(doc);
                if (missingSection) {
                    warnings.push({
                        code: 'MISSING_DOC_SECTION',
                        message: `Completion document missing required section: ${missingSection}`,
                        source: doc.path,
                        suggestion: `Add the '${missingSection}' section to the completion document`
                    });
                }
            }
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings,
            validatedAt: new Date(),
            context: 'release-readiness'
        };
    }
    /**
     * Validate version bump against semantic versioning rules
     */
    async validateVersionBump(versionBump) {
        return await this.semanticVersionValidator.validateVersionBump(versionBump);
    }
    /**
     * Validate semantic versioning compliance (legacy method)
     */
    async validateSemanticVersioning(version, bumpType) {
        const errors = [];
        const warnings = [];
        if (!this.config.validation.versionBumpValidation) {
            return {
                valid: true,
                errors: [],
                warnings: [],
                validatedAt: new Date(),
                context: 'semantic-versioning'
            };
        }
        // Validate version format
        const versionRegex = /^(\d+)\.(\d+)\.(\d+)(-[a-zA-Z0-9.-]+)?$/;
        if (!versionRegex.test(version)) {
            errors.push({
                code: 'INVALID_VERSION_FORMAT',
                message: `Version '${version}' does not follow semantic versioning format`,
                severity: 'error',
                suggestion: 'Use format x.y.z or x.y.z-prerelease'
            });
        }
        // Validate version bump logic
        const versionParts = version.match(versionRegex);
        if (versionParts) {
            const [, major, minor, patch] = versionParts;
            if (bumpType === 'major' && major === '0') {
                warnings.push({
                    code: 'MAJOR_BUMP_FROM_ZERO',
                    message: 'Major version bump from 0.x.x - consider if this is appropriate',
                    suggestion: 'Ensure breaking changes justify major version bump'
                });
            }
            if (bumpType === 'patch' && patch === '0') {
                warnings.push({
                    code: 'PATCH_BUMP_ON_ZERO_PATCH',
                    message: 'Patch bump when patch version is 0 - consider if minor bump is more appropriate',
                    suggestion: 'Review if changes warrant minor version bump instead'
                });
            }
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
     * Validate package compatibility
     */
    async validatePackageCompatibility(packages) {
        const errors = [];
        const warnings = [];
        if (!this.config.validation.packageCompatibility) {
            return {
                valid: true,
                errors: [],
                warnings: [],
                validatedAt: new Date(),
                context: 'package-compatibility'
            };
        }
        // Check for dependency conflicts
        for (const pkg of packages) {
            if (pkg.dependencies) {
                for (const dep of pkg.dependencies) {
                    const conflict = this.checkDependencyConflict(dep, packages);
                    if (conflict) {
                        errors.push({
                            code: 'DEPENDENCY_CONFLICT',
                            message: `Package '${pkg.name}' has conflicting dependency '${dep.name}': ${conflict}`,
                            severity: 'error',
                            source: pkg.name,
                            suggestion: 'Resolve dependency version conflicts before release'
                        });
                    }
                }
            }
        }
        // Check for circular dependencies
        const circularDeps = this.detectCircularDependencies(packages);
        if (circularDeps.length > 0) {
            errors.push({
                code: 'CIRCULAR_DEPENDENCY',
                message: `Circular dependencies detected: ${circularDeps.join(' -> ')}`,
                severity: 'error',
                suggestion: 'Refactor packages to eliminate circular dependencies'
            });
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings,
            validatedAt: new Date(),
            context: 'package-compatibility'
        };
    }
    /**
     * Validate safety checks
     */
    async validateSafetyChecks(releaseData) {
        const errors = [];
        const warnings = [];
        const safetyChecks = this.config.validation.safetyChecks;
        // Validate rollback capability
        if (safetyChecks.rollbackValidation) {
            if (!releaseData.rollbackPlan) {
                errors.push({
                    code: 'MISSING_ROLLBACK_PLAN',
                    message: 'Release requires rollback plan for safety',
                    severity: 'error',
                    suggestion: 'Create rollback plan before proceeding with release'
                });
            }
        }
        // Check for major release confirmation
        if (safetyChecks.requireMajorReleaseConfirmation && releaseData.bumpType === 'major') {
            if (!releaseData.majorReleaseConfirmed) {
                errors.push({
                    code: 'MAJOR_RELEASE_CONFIRMATION_REQUIRED',
                    message: 'Major release requires explicit confirmation',
                    severity: 'error',
                    suggestion: 'Confirm major release is intended and breaking changes are documented'
                });
            }
        }
        // Check for breaking change confirmation
        if (safetyChecks.requireBreakingChangeConfirmation && releaseData.hasBreakingChanges) {
            if (!releaseData.breakingChangesConfirmed) {
                errors.push({
                    code: 'BREAKING_CHANGE_CONFIRMATION_REQUIRED',
                    message: 'Breaking changes require explicit confirmation',
                    severity: 'error',
                    suggestion: 'Confirm breaking changes are documented with migration guidance'
                });
            }
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings,
            validatedAt: new Date(),
            context: 'safety-checks'
        };
    }
    /**
     * Validate document sections
     */
    validateDocumentSections(doc) {
        const requiredSections = this.config.validation.validationRules.requiredSections;
        for (const section of requiredSections) {
            if (!doc.content || !doc.content.includes(section)) {
                return section;
            }
        }
        return null;
    }
    /**
     * Check for dependency conflicts
     */
    checkDependencyConflict(dependency, packages) {
        const targetPackage = packages.find(pkg => pkg.name === dependency.name);
        if (targetPackage) {
            const requiredVersion = dependency.version;
            const actualVersion = targetPackage.version;
            if (requiredVersion !== actualVersion && !this.isVersionCompatible(requiredVersion, actualVersion)) {
                return `requires ${requiredVersion} but ${actualVersion} is available`;
            }
        }
        return null;
    }
    /**
     * Detect circular dependencies
     */
    detectCircularDependencies(packages) {
        const visited = new Set();
        const recursionStack = new Set();
        const path = [];
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
    detectCycleFromPackage(packageName, packages, visited, recursionStack, path) {
        visited.add(packageName);
        recursionStack.add(packageName);
        path.push(packageName);
        const pkg = packages.find(p => p.name === packageName);
        if (pkg && pkg.dependencies) {
            for (const dep of pkg.dependencies) {
                if (!visited.has(dep.name)) {
                    const cycle = this.detectCycleFromPackage(dep.name, packages, visited, recursionStack, path);
                    if (cycle.length > 0) {
                        return cycle;
                    }
                }
                else if (recursionStack.has(dep.name)) {
                    // Found cycle
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
     * Check if versions are compatible
     */
    isVersionCompatible(required, actual) {
        // Simple version compatibility check
        // In a real implementation, this would use semver library
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
    /**
     * Validate rollback capabilities
     */
    async validateRollbackCapability(releasePlan) {
        return await this.safetyValidator.validateReleaseSafety(releasePlan);
    }
    /**
     * Validate release plan completeness
     */
    async validateReleasePlan(releasePlan) {
        const errors = [];
        const warnings = [];
        // Validate plan structure
        if (!releasePlan.id || releasePlan.id.trim().length === 0) {
            errors.push({
                code: 'MISSING_PLAN_ID',
                message: 'Release plan must have a unique identifier',
                severity: 'error',
                suggestion: 'Generate a unique ID for the release plan'
            });
        }
        if (!releasePlan.version) {
            errors.push({
                code: 'MISSING_VERSION_INFO',
                message: 'Release plan must include version bump information',
                severity: 'error',
                suggestion: 'Add version bump details to the release plan'
            });
        }
        if (!releasePlan.packages || releasePlan.packages.length === 0) {
            errors.push({
                code: 'NO_PACKAGES_TO_RELEASE',
                message: 'Release plan must include at least one package',
                severity: 'error',
                suggestion: 'Add packages to be released to the plan'
            });
        }
        if (!releasePlan.releaseNotes) {
            warnings.push({
                code: 'MISSING_RELEASE_NOTES',
                message: 'Release plan should include release notes',
                suggestion: 'Generate release notes for better documentation'
            });
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings,
            validatedAt: new Date(),
            context: 'release-plan-validation'
        };
    }
    /**
     * Validate error handling and recovery capabilities
     */
    async validateErrorHandling() {
        const errors = [];
        const warnings = [];
        // Check if error handling configuration is present
        if (!this.config.publishing.publishingOrder.retryConfig) {
            warnings.push({
                code: 'MISSING_RETRY_CONFIG',
                message: 'No retry configuration found for error recovery',
                suggestion: 'Configure retry settings for robust error handling'
            });
        }
        else {
            const retryConfig = this.config.publishing.publishingOrder.retryConfig;
            if (retryConfig.maxAttempts < 1) {
                errors.push({
                    code: 'INVALID_RETRY_ATTEMPTS',
                    message: 'Maximum retry attempts must be at least 1',
                    severity: 'error',
                    suggestion: 'Set maxAttempts to a positive number'
                });
            }
            if (retryConfig.retryDelay < 1000) {
                warnings.push({
                    code: 'SHORT_RETRY_DELAY',
                    message: 'Retry delay is very short, may cause rate limiting',
                    suggestion: 'Consider increasing retry delay to at least 1000ms'
                });
            }
        }
        // Check if rollback validation is enabled
        if (!this.config.validation.safetyChecks.rollbackValidation) {
            warnings.push({
                code: 'ROLLBACK_VALIDATION_DISABLED',
                message: 'Rollback validation is disabled',
                suggestion: 'Enable rollback validation for better safety'
            });
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings,
            validatedAt: new Date(),
            context: 'error-handling-validation'
        };
    }
    /**
     * Provide clear, actionable error messages with resolution guidance
     */
    generateErrorGuidance(validationResult) {
        if (validationResult.valid) {
            return 'All validations passed successfully.';
        }
        let guidance = 'Release validation failed. Please address the following issues:\n\n';
        // Group errors by severity
        const criticalErrors = validationResult.errors.filter(e => e.severity === 'error');
        const warnings = validationResult.warnings;
        if (criticalErrors.length > 0) {
            guidance += '🚨 Critical Issues (must be resolved):\n';
            criticalErrors.forEach((error, index) => {
                guidance += `${index + 1}. ${error.message}\n`;
                if (error.suggestion) {
                    guidance += `   💡 Solution: ${error.suggestion}\n`;
                }
                if (error.source) {
                    guidance += `   📍 Source: ${error.source}\n`;
                }
                guidance += '\n';
            });
        }
        if (warnings.length > 0) {
            guidance += '⚠️  Warnings (recommended to address):\n';
            warnings.forEach((warning, index) => {
                guidance += `${index + 1}. ${warning.message}\n`;
                if (warning.suggestion) {
                    guidance += `   💡 Suggestion: ${warning.suggestion}\n`;
                }
                if (warning.source) {
                    guidance += `   📍 Source: ${warning.source}\n`;
                }
                guidance += '\n';
            });
        }
        guidance += `\nValidation Context: ${validationResult.context}\n`;
        guidance += `Validated At: ${validationResult.validatedAt.toISOString()}\n`;
        return guidance;
    }
    /**
     * Validate configuration completeness
     */
    validateConfiguration() {
        const errors = [];
        const warnings = [];
        // Validate detection configuration
        if (!this.config.detection.specCompletionTrigger && !this.config.detection.taskCompletionTrigger) {
            errors.push({
                code: 'NO_DETECTION_TRIGGERS',
                message: 'At least one detection trigger must be enabled',
                severity: 'error',
                suggestion: 'Enable spec completion or task completion triggers'
            });
        }
        // Validate versioning configuration
        if (!this.config.versioning.packageCoordination.corePackages ||
            this.config.versioning.packageCoordination.corePackages.length === 0) {
            warnings.push({
                code: 'NO_CORE_PACKAGES_DEFINED',
                message: 'No core packages defined for coordination',
                suggestion: 'Define core packages that should be synchronized'
            });
        }
        // Validate publishing configuration
        if (!this.config.publishing.github.owner || !this.config.publishing.github.repository) {
            errors.push({
                code: 'INCOMPLETE_GITHUB_CONFIG',
                message: 'GitHub owner and repository must be configured',
                severity: 'error',
                suggestion: 'Set GitHub owner and repository in configuration'
            });
        }
        if (!this.config.publishing.npm.packages || this.config.publishing.npm.packages.length === 0) {
            warnings.push({
                code: 'NO_NPM_PACKAGES_CONFIGURED',
                message: 'No npm packages configured for publishing',
                suggestion: 'Configure npm packages if npm publishing is required'
            });
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings,
            validatedAt: new Date(),
            context: 'configuration-validation'
        };
    }
}
exports.ReleaseValidator = ReleaseValidator;
//# sourceMappingURL=ReleaseValidator.js.map