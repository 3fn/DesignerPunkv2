"use strict";
/**
 * Analysis Configuration Schema Validation
 *
 * Provides validation for release analysis configuration
 * Adapted from release management system for CLI-driven workflow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAnalysisConfig = validateAnalysisConfig;
exports.validateConfigurationPaths = validateConfigurationPaths;
/**
 * Validates analysis configuration object
 */
function validateAnalysisConfig(config) {
    const errors = [];
    const warnings = [];
    // Basic type validation
    if (!config || typeof config !== 'object') {
        errors.push({
            path: 'root',
            message: 'Configuration must be an object',
            value: config,
            expectedType: 'object'
        });
        return { valid: false, errors, warnings };
    }
    // Validate required top-level properties
    const requiredProps = ['extraction', 'versioning', 'reporting', 'git'];
    for (const prop of requiredProps) {
        if (!(prop in config)) {
            errors.push({
                path: prop,
                message: `Required property '${prop}' is missing`,
                expectedType: 'object'
            });
        }
    }
    // Validate extraction configuration
    if (config.extraction) {
        validateExtractionConfig(config.extraction, 'extraction', errors, warnings);
    }
    // Validate versioning configuration
    if (config.versioning) {
        validateVersioningConfig(config.versioning, 'versioning', errors, warnings);
    }
    // Validate reporting configuration
    if (config.reporting) {
        validateReportingConfig(config.reporting, 'reporting', errors, warnings);
    }
    // Validate git configuration
    if (config.git) {
        validateGitConfig(config.git, 'git', errors, warnings);
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}
function validateExtractionConfig(config, path, errors, warnings) {
    if (typeof config !== 'object') {
        errors.push({
            path,
            message: 'Extraction configuration must be an object',
            value: config,
            expectedType: 'object'
        });
        return;
    }
    // Validate completion patterns
    if ('completionPatterns' in config) {
        const patterns = config.completionPatterns;
        if (!Array.isArray(patterns)) {
            errors.push({
                path: `${path}.completionPatterns`,
                message: 'Completion patterns must be an array',
                value: patterns,
                expectedType: 'array'
            });
        }
        else if (patterns.length === 0) {
            warnings.push({
                path: `${path}.completionPatterns`,
                message: 'No completion patterns defined',
                suggestion: 'Add patterns like "*-completion.md" to identify completion documents'
            });
        }
    }
    // Validate keyword arrays
    const keywordFields = [
        'breakingChangeKeywords',
        'featureKeywords',
        'bugFixKeywords',
        'improvementKeywords',
        'documentationKeywords'
    ];
    for (const field of keywordFields) {
        if (field in config) {
            const keywords = config[field];
            if (!Array.isArray(keywords)) {
                errors.push({
                    path: `${path}.${field}`,
                    message: `${field} must be an array`,
                    value: keywords,
                    expectedType: 'array'
                });
            }
            else if (keywords.length === 0) {
                warnings.push({
                    path: `${path}.${field}`,
                    message: `No ${field} defined`,
                    suggestion: `Consider adding relevant keywords for ${field.replace('Keywords', '')} detection`
                });
            }
        }
    }
    // Validate confidence thresholds
    if ('confidenceThresholds' in config) {
        const thresholds = config.confidenceThresholds;
        if (typeof thresholds !== 'object') {
            errors.push({
                path: `${path}.confidenceThresholds`,
                message: 'Confidence thresholds must be an object',
                value: thresholds,
                expectedType: 'object'
            });
        }
        else {
            const thresholdFields = ['minimumConfidence', 'uncertaintyThreshold', 'reviewThreshold'];
            for (const field of thresholdFields) {
                if (field in thresholds) {
                    const value = thresholds[field];
                    if (typeof value !== 'number' || value < 0 || value > 1) {
                        errors.push({
                            path: `${path}.confidenceThresholds.${field}`,
                            message: `${field} must be a number between 0 and 1`,
                            value: value,
                            expectedType: 'number (0-1)'
                        });
                    }
                }
            }
        }
    }
    // Validate section headers
    if ('sectionHeaders' in config) {
        const headers = config.sectionHeaders;
        if (typeof headers !== 'object') {
            errors.push({
                path: `${path}.sectionHeaders`,
                message: 'Section headers must be an object',
                value: headers,
                expectedType: 'object'
            });
        }
        else {
            const headerFields = ['breakingChanges', 'features', 'bugFixes', 'improvements', 'summary'];
            for (const field of headerFields) {
                if (field in headers && !Array.isArray(headers[field])) {
                    errors.push({
                        path: `${path}.sectionHeaders.${field}`,
                        message: `Section headers for ${field} must be an array`,
                        value: headers[field],
                        expectedType: 'array'
                    });
                }
            }
        }
    }
}
function validateVersioningConfig(config, path, errors, warnings) {
    if (typeof config !== 'object') {
        errors.push({
            path,
            message: 'Versioning configuration must be an object',
            value: config,
            expectedType: 'object'
        });
        return;
    }
    // Validate semantic versioning
    if ('semanticVersioning' in config && typeof config.semanticVersioning !== 'boolean') {
        errors.push({
            path: `${path}.semanticVersioning`,
            message: 'Semantic versioning must be a boolean',
            value: config.semanticVersioning,
            expectedType: 'boolean'
        });
    }
    // Validate pre-release handling
    if ('preReleaseHandling' in config) {
        const handling = config.preReleaseHandling;
        if (!['increment', 'promote', 'ignore'].includes(handling)) {
            errors.push({
                path: `${path}.preReleaseHandling`,
                message: 'Pre-release handling must be "increment", "promote", or "ignore"',
                value: handling,
                expectedType: '"increment" | "promote" | "ignore"'
            });
        }
    }
    // Validate version bump rules
    if ('versionBumpRules' in config) {
        const rules = config.versionBumpRules;
        if (typeof rules !== 'object') {
            errors.push({
                path: `${path}.versionBumpRules`,
                message: 'Version bump rules must be an object',
                value: rules,
                expectedType: 'object'
            });
        }
        else {
            // Validate trigger arrays
            const triggerFields = ['majorBumpTriggers', 'minorBumpTriggers', 'patchBumpTriggers'];
            for (const field of triggerFields) {
                if (field in rules && !Array.isArray(rules[field])) {
                    errors.push({
                        path: `${path}.versionBumpRules.${field}`,
                        message: `${field} must be an array`,
                        value: rules[field],
                        expectedType: 'array'
                    });
                }
            }
            // Validate default bump type
            if ('defaultBumpType' in rules) {
                const bumpType = rules.defaultBumpType;
                if (!['major', 'minor', 'patch'].includes(bumpType)) {
                    errors.push({
                        path: `${path}.versionBumpRules.defaultBumpType`,
                        message: 'Default bump type must be "major", "minor", or "patch"',
                        value: bumpType,
                        expectedType: '"major" | "minor" | "patch"'
                    });
                }
            }
        }
    }
    // Validate pre-release configuration
    if ('preRelease' in config) {
        const preRelease = config.preRelease;
        if (typeof preRelease !== 'object') {
            errors.push({
                path: `${path}.preRelease`,
                message: 'Pre-release configuration must be an object',
                value: preRelease,
                expectedType: 'object'
            });
        }
        else {
            if ('startingNumber' in preRelease && typeof preRelease.startingNumber !== 'number') {
                errors.push({
                    path: `${path}.preRelease.startingNumber`,
                    message: 'Starting number must be a number',
                    value: preRelease.startingNumber,
                    expectedType: 'number'
                });
            }
        }
    }
}
function validateReportingConfig(config, path, errors, warnings) {
    if (typeof config !== 'object') {
        errors.push({
            path,
            message: 'Reporting configuration must be an object',
            value: config,
            expectedType: 'object'
        });
        return;
    }
    // Validate default format
    if ('defaultFormat' in config) {
        const format = config.defaultFormat;
        if (!['summary', 'detailed', 'json'].includes(format)) {
            errors.push({
                path: `${path}.defaultFormat`,
                message: 'Default format must be "summary", "detailed", or "json"',
                value: format,
                expectedType: '"summary" | "detailed" | "json"'
            });
        }
    }
    // Validate boolean flags
    const booleanFields = ['includeConfidence', 'includeMetadata', 'includeEvidence'];
    for (const field of booleanFields) {
        if (field in config && typeof config[field] !== 'boolean') {
            errors.push({
                path: `${path}.${field}`,
                message: `${field} must be a boolean`,
                value: config[field],
                expectedType: 'boolean'
            });
        }
    }
    // Validate templates configuration
    if ('templates' in config) {
        const templates = config.templates;
        if (typeof templates !== 'object') {
            errors.push({
                path: `${path}.templates`,
                message: 'Templates configuration must be an object',
                value: templates,
                expectedType: 'object'
            });
        }
        else {
            // Validate template formats
            const templateTypes = ['summary', 'detailed', 'releaseNotes'];
            for (const templateType of templateTypes) {
                if (templateType in templates) {
                    const template = templates[templateType];
                    if (typeof template !== 'object') {
                        errors.push({
                            path: `${path}.templates.${templateType}`,
                            message: `${templateType} template must be an object`,
                            value: template,
                            expectedType: 'object'
                        });
                    }
                    else if ('format' in template) {
                        const format = template.format;
                        if (!['markdown', 'html', 'plain'].includes(format)) {
                            errors.push({
                                path: `${path}.templates.${templateType}.format`,
                                message: 'Template format must be "markdown", "html", or "plain"',
                                value: format,
                                expectedType: '"markdown" | "html" | "plain"'
                            });
                        }
                    }
                }
            }
        }
    }
    // Validate output files configuration
    if ('outputFiles' in config) {
        const outputFiles = config.outputFiles;
        if (typeof outputFiles !== 'object') {
            errors.push({
                path: `${path}.outputFiles`,
                message: 'Output files configuration must be an object',
                value: outputFiles,
                expectedType: 'object'
            });
        }
        else {
            if ('saveResults' in outputFiles && typeof outputFiles.saveResults !== 'boolean') {
                errors.push({
                    path: `${path}.outputFiles.saveResults`,
                    message: 'Save results must be a boolean',
                    value: outputFiles.saveResults,
                    expectedType: 'boolean'
                });
            }
        }
    }
}
function validateGitConfig(config, path, errors, warnings) {
    if (typeof config !== 'object') {
        errors.push({
            path,
            message: 'Git configuration must be an object',
            value: config,
            expectedType: 'object'
        });
        return;
    }
    // Validate default branch
    if ('defaultBranch' in config) {
        const branch = config.defaultBranch;
        if (typeof branch !== 'string' || branch.length === 0) {
            errors.push({
                path: `${path}.defaultBranch`,
                message: 'Default branch must be a non-empty string',
                value: branch,
                expectedType: 'string'
            });
        }
    }
    // Validate release tag pattern
    if ('releaseTagPattern' in config) {
        const pattern = config.releaseTagPattern;
        if (typeof pattern !== 'string') {
            errors.push({
                path: `${path}.releaseTagPattern`,
                message: 'Release tag pattern must be a string',
                value: pattern,
                expectedType: 'string'
            });
        }
        else {
            // Try to validate regex pattern
            try {
                new RegExp(pattern);
            }
            catch (error) {
                errors.push({
                    path: `${path}.releaseTagPattern`,
                    message: 'Release tag pattern must be a valid regular expression',
                    value: pattern,
                    expectedType: 'valid regex string'
                });
            }
        }
    }
    // Validate path arrays
    const pathFields = ['completionPaths', 'includePatterns', 'excludePatterns'];
    for (const field of pathFields) {
        if (field in config) {
            const paths = config[field];
            if (!Array.isArray(paths)) {
                errors.push({
                    path: `${path}.${field}`,
                    message: `${field} must be an array`,
                    value: paths,
                    expectedType: 'array'
                });
            }
            else if (paths.length === 0 && field === 'completionPaths') {
                warnings.push({
                    path: `${path}.${field}`,
                    message: 'No completion paths defined',
                    suggestion: 'Add paths like ".kiro/specs/*/completion/" to find completion documents'
                });
            }
        }
    }
    // Validate max commits
    if ('maxCommits' in config) {
        const maxCommits = config.maxCommits;
        if (typeof maxCommits !== 'number' || maxCommits < 1) {
            errors.push({
                path: `${path}.maxCommits`,
                message: 'Max commits must be a positive number',
                value: maxCommits,
                expectedType: 'positive number'
            });
        }
        else if (maxCommits > 10000) {
            warnings.push({
                path: `${path}.maxCommits`,
                message: 'Max commits is very high, may impact performance',
                suggestion: 'Consider reducing to 1000 or less for better performance'
            });
        }
    }
}
/**
 * Validates that configuration paths exist and are accessible
 */
function validateConfigurationPaths(config) {
    const errors = [];
    const warnings = [];
    if (!config || typeof config !== 'object') {
        return { valid: false, errors, warnings };
    }
    // Validate output directory exists or can be created
    if (config.reporting?.outputFiles?.outputDirectory) {
        const outputDir = config.reporting.outputFiles.outputDirectory;
        try {
            const fs = require('fs');
            const path = require('path');
            if (!fs.existsSync(outputDir)) {
                warnings.push({
                    path: 'reporting.outputFiles.outputDirectory',
                    message: 'Output directory does not exist',
                    suggestion: 'Directory will be created automatically when needed'
                });
            }
        }
        catch (error) {
            errors.push({
                path: 'reporting.outputFiles.outputDirectory',
                message: 'Cannot validate output directory path',
                value: outputDir
            });
        }
    }
    // Validate completion paths exist
    if (config.git?.completionPaths) {
        const completionPaths = config.git.completionPaths;
        if (Array.isArray(completionPaths)) {
            const fs = require('fs');
            const path = require('path');
            for (let i = 0; i < completionPaths.length; i++) {
                const completionPath = completionPaths[i];
                try {
                    // Check if path pattern makes sense (basic validation)
                    if (!completionPath.includes('*') && !fs.existsSync(completionPath)) {
                        warnings.push({
                            path: `git.completionPaths[${i}]`,
                            message: 'Completion path does not exist',
                            suggestion: 'Verify the path is correct or use glob patterns'
                        });
                    }
                }
                catch (error) {
                    // Ignore validation errors for complex glob patterns
                }
            }
        }
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}
//# sourceMappingURL=AnalysisConfigSchema.js.map