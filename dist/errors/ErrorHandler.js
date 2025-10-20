"use strict";
/**
 * Comprehensive Error Handling System for Release Analysis
 *
 * Provides centralized error handling with graceful recovery strategies,
 * clear error messages, and actionable guidance for users.
 *
 * Requirements addressed:
 * - 8.1: Validate completion documents are properly formatted and accessible
 * - 8.2: Provide confidence scores for extracted information
 * - 8.3: Provide clear rationale and supporting evidence
 * - 8.4: Highlight areas requiring human review
 * - 8.5: Provide clear, actionable error messages with resolution guidance
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseAnalysisErrorHandler = exports.ReleaseAnalysisErrorHandler = void 0;
exports.withErrorHandling = withErrorHandling;
/**
 * Centralized error handler for release analysis operations
 */
var ReleaseAnalysisErrorHandler = /** @class */ (function () {
    function ReleaseAnalysisErrorHandler() {
        this.errorHistory = [];
        this.recoveryAttempts = new Map();
        this.maxRetryAttempts = 3;
    }
    /**
     * Handle Git repository errors with fallback strategies
     * Requirement 8.5: Clear, actionable error messages with resolution guidance
     */
    ReleaseAnalysisErrorHandler.prototype.handleGitError = function (error, context, fallbackAction) {
        return __awaiter(this, void 0, void 0, function () {
            var errorDetails, recoveryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errorDetails = {
                            code: 'GIT_ERROR',
                            message: this.extractGitErrorMessage(error),
                            severity: this.determineGitErrorSeverity(error),
                            category: 'git',
                            context: context,
                            recoveryStrategies: this.getGitRecoveryStrategies(error, fallbackAction),
                            userGuidance: this.getGitUserGuidance(error),
                            technicalDetails: error.message
                        };
                        this.logError(errorDetails);
                        return [4 /*yield*/, this.attemptRecovery(errorDetails)];
                    case 1:
                        recoveryResult = _a.sent();
                        if (recoveryResult.success) {
                            return [2 /*return*/, recoveryResult];
                        }
                        // If no recovery possible, provide detailed guidance
                        return [2 /*return*/, {
                                success: false,
                                error: errorDetails,
                                warnings: ["Git operation failed: ".concat(errorDetails.message)]
                            }];
                }
            });
        });
    };
    /**
     * Handle completion document parsing errors with recovery
     * Requirement 8.1: Validate completion documents are properly formatted
     */
    ReleaseAnalysisErrorHandler.prototype.handleParsingError = function (error_1, filePath_1, context_1) {
        return __awaiter(this, arguments, void 0, function (error, filePath, context, skipOnError) {
            var errorDetails, recoveryResult;
            if (skipOnError === void 0) { skipOnError = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errorDetails = {
                            code: 'PARSING_ERROR',
                            message: "Failed to parse completion document: ".concat(this.extractParsingErrorMessage(error)),
                            severity: skipOnError ? 'medium' : 'high',
                            category: 'parsing',
                            context: __assign(__assign({}, context), { filePath: filePath }),
                            recoveryStrategies: this.getParsingRecoveryStrategies(filePath, skipOnError),
                            userGuidance: this.getParsingUserGuidance(error, filePath),
                            technicalDetails: error.message
                        };
                        this.logError(errorDetails);
                        return [4 /*yield*/, this.attemptRecovery(errorDetails)];
                    case 1:
                        recoveryResult = _a.sent();
                        if (recoveryResult.success) {
                            return [2 /*return*/, recoveryResult];
                        }
                        // If skipping is allowed, continue with warning
                        if (skipOnError) {
                            return [2 /*return*/, {
                                    success: true,
                                    data: null,
                                    warnings: ["Skipped problematic document: ".concat(filePath, " - ").concat(errorDetails.message)]
                                }];
                        }
                        return [2 /*return*/, {
                                success: false,
                                error: errorDetails,
                                warnings: ["Critical parsing error in: ".concat(filePath)]
                            }];
                }
            });
        });
    };
    /**
     * Handle validation errors with confidence scoring
     * Requirement 8.2: Provide confidence scores for extracted information
     */
    ReleaseAnalysisErrorHandler.prototype.handleValidationError = function (error_1, context_1) {
        return __awaiter(this, arguments, void 0, function (error, context, confidenceImpact) {
            var errorDetails;
            if (confidenceImpact === void 0) { confidenceImpact = 0.3; }
            return __generator(this, function (_a) {
                errorDetails = {
                    code: 'VALIDATION_ERROR',
                    message: "Validation failed: ".concat(error.message),
                    severity: 'medium',
                    category: 'validation',
                    context: context,
                    recoveryStrategies: this.getValidationRecoveryStrategies(confidenceImpact),
                    userGuidance: this.getValidationUserGuidance(error),
                    technicalDetails: error.message
                };
                this.logError(errorDetails);
                // For validation errors, we typically continue with reduced confidence
                return [2 /*return*/, {
                        success: true,
                        data: { confidenceReduction: confidenceImpact },
                        warnings: ["Validation warning: ".concat(errorDetails.message, " (confidence reduced by ").concat(Math.round(confidenceImpact * 100), "%)")],
                        error: errorDetails
                    }];
            });
        });
    };
    /**
     * Handle configuration errors with clear guidance
     * Requirement 8.5: Clear, actionable error messages with resolution guidance
     */
    ReleaseAnalysisErrorHandler.prototype.handleConfigurationError = function (error, context, configPath) {
        return __awaiter(this, void 0, void 0, function () {
            var errorDetails;
            return __generator(this, function (_a) {
                errorDetails = {
                    code: 'CONFIG_ERROR',
                    message: "Configuration error: ".concat(error.message),
                    severity: 'high',
                    category: 'configuration',
                    context: __assign(__assign({}, context), { filePath: configPath }),
                    recoveryStrategies: this.getConfigurationRecoveryStrategies(configPath),
                    userGuidance: this.getConfigurationUserGuidance(error, configPath),
                    technicalDetails: error.message
                };
                this.logError(errorDetails);
                // For configuration errors, we typically can't auto-recover
                // Return error details for user to fix
                return [2 /*return*/, {
                        success: false,
                        error: errorDetails,
                        warnings: ["Configuration error prevents analysis: ".concat(errorDetails.message)]
                    }];
            });
        });
    };
    /**
     * Handle filesystem errors with fallback strategies
     * Requirement 8.1: Validate completion documents are accessible
     */
    ReleaseAnalysisErrorHandler.prototype.handleFilesystemError = function (error_1, filePath_1, context_1) {
        return __awaiter(this, arguments, void 0, function (error, filePath, context, operation) {
            var errorDetails, recoveryResult;
            if (operation === void 0) { operation = 'read'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errorDetails = {
                            code: 'FILESYSTEM_ERROR',
                            message: "File ".concat(operation, " failed: ").concat(this.extractFilesystemErrorMessage(error)),
                            severity: operation === 'write' ? 'high' : 'medium',
                            category: 'filesystem',
                            context: __assign(__assign({}, context), { filePath: filePath }),
                            recoveryStrategies: this.getFilesystemRecoveryStrategies(filePath, operation),
                            userGuidance: this.getFilesystemUserGuidance(error, filePath, operation),
                            technicalDetails: error.message
                        };
                        this.logError(errorDetails);
                        return [4 /*yield*/, this.attemptRecovery(errorDetails)];
                    case 1:
                        recoveryResult = _a.sent();
                        if (recoveryResult.success) {
                            return [2 /*return*/, recoveryResult];
                        }
                        // For read operations, we can often continue without the file
                        if (operation === 'read') {
                            return [2 /*return*/, {
                                    success: true,
                                    data: null,
                                    warnings: ["Could not read file: ".concat(filePath, " - continuing without it")],
                                    error: errorDetails
                                }];
                        }
                        return [2 /*return*/, {
                                success: false,
                                error: errorDetails,
                                warnings: ["Critical filesystem error: ".concat(errorDetails.message)]
                            }];
                }
            });
        });
    };
    /**
     * Create a comprehensive error summary for user review
     * Requirement 8.4: Highlight areas requiring human review
     */
    ReleaseAnalysisErrorHandler.prototype.createErrorSummary = function () {
        var criticalErrors = this.errorHistory.filter(function (e) { return e.severity === 'critical'; });
        var recoverableErrors = this.errorHistory.filter(function (e) {
            return e.severity !== 'critical' && e.recoveryStrategies.length > 0;
        });
        var warnings = this.errorHistory
            .filter(function (e) { return e.severity === 'low' || e.severity === 'medium'; })
            .map(function (e) { return e.message; });
        var recommendations = this.generateRecommendations();
        return {
            totalErrors: this.errorHistory.length,
            criticalErrors: criticalErrors,
            recoverableErrors: recoverableErrors,
            warnings: warnings,
            recommendations: recommendations
        };
    };
    /**
     * Clear error history (useful for new analysis runs)
     */
    ReleaseAnalysisErrorHandler.prototype.clearErrorHistory = function () {
        this.errorHistory = [];
        this.recoveryAttempts.clear();
    };
    /**
     * Get formatted error report for CLI display
     * Requirement 8.3: Provide clear rationale and supporting evidence
     */
    ReleaseAnalysisErrorHandler.prototype.getFormattedErrorReport = function () {
        if (this.errorHistory.length === 0) {
            return '✅ No errors encountered during analysis';
        }
        var summary = this.createErrorSummary();
        var report = "\n\uD83D\uDCCA Error Summary:\n";
        report += "   Total Issues: ".concat(summary.totalErrors, "\n");
        report += "   Critical: ".concat(summary.criticalErrors.length, "\n");
        report += "   Recoverable: ".concat(summary.recoverableErrors.length, "\n");
        report += "   Warnings: ".concat(summary.warnings.length, "\n\n");
        // Critical errors
        if (summary.criticalErrors.length > 0) {
            report += "\uD83D\uDEA8 Critical Errors (require immediate attention):\n";
            summary.criticalErrors.forEach(function (error, index) {
                report += "   ".concat(index + 1, ". ").concat(error.message, "\n");
                report += "      \uD83D\uDCA1 ".concat(error.userGuidance, "\n\n");
            });
        }
        // Recoverable errors
        if (summary.recoverableErrors.length > 0) {
            report += "\u26A0\uFE0F  Recoverable Issues:\n";
            summary.recoverableErrors.forEach(function (error, index) {
                report += "   ".concat(index + 1, ". ").concat(error.message, "\n");
                if (error.recoveryStrategies.length > 0) {
                    report += "      \uD83D\uDD27 Recovery: ".concat(error.recoveryStrategies[0].description, "\n");
                }
            });
            report += "\n";
        }
        // Recommendations
        if (summary.recommendations.length > 0) {
            report += "\uD83D\uDCA1 Recommendations:\n";
            summary.recommendations.forEach(function (rec, index) {
                report += "   ".concat(index + 1, ". ").concat(rec, "\n");
            });
        }
        return report;
    };
    // Private helper methods
    ReleaseAnalysisErrorHandler.prototype.attemptRecovery = function (errorDetails) {
        return __awaiter(this, void 0, void 0, function () {
            var errorKey, attempts, _i, _a, strategy, result, recoveryError_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        errorKey = "".concat(errorDetails.code, "-").concat(errorDetails.context.filePath || errorDetails.context.operation);
                        attempts = this.recoveryAttempts.get(errorKey) || 0;
                        if (attempts >= this.maxRetryAttempts) {
                            return [2 /*return*/, { success: false, warnings: ['Maximum recovery attempts exceeded'] }];
                        }
                        this.recoveryAttempts.set(errorKey, attempts + 1);
                        _i = 0, _a = errorDetails.recoveryStrategies;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        strategy = _a[_i];
                        if (!strategy.action) return [3 /*break*/, 5];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, strategy.action()];
                    case 3:
                        result = _b.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: result,
                                warnings: ["Recovered using: ".concat(strategy.description)],
                                recoveryApplied: strategy
                            }];
                    case 4:
                        recoveryError_1 = _b.sent();
                        // Continue to next strategy
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, { success: false, warnings: ['No recovery strategies succeeded'] }];
                }
            });
        });
    };
    ReleaseAnalysisErrorHandler.prototype.logError = function (error) {
        this.errorHistory.push(error);
        // Log to console with appropriate level
        var logLevel = error.severity === 'critical' ? 'error' :
            error.severity === 'high' ? 'error' :
                error.severity === 'medium' ? 'warn' : 'info';
        console[logLevel]("[".concat(error.category.toUpperCase(), "] ").concat(error.message));
        if (error.technicalDetails && error.technicalDetails !== error.message) {
            console.debug("Technical details: ".concat(error.technicalDetails));
        }
    };
    ReleaseAnalysisErrorHandler.prototype.extractGitErrorMessage = function (error) {
        var message = error.message.toLowerCase();
        if (message.includes('not a git repository')) {
            return 'Current directory is not a Git repository';
        }
        else if (message.includes('no such file or directory')) {
            return 'Git repository not found or inaccessible';
        }
        else if (message.includes('invalid reference') || message.includes('unknown revision')) {
            return 'Invalid Git reference (tag or commit not found)';
        }
        else if (message.includes('permission denied')) {
            return 'Permission denied accessing Git repository';
        }
        else if (message.includes('network') || message.includes('connection')) {
            return 'Network error accessing remote Git repository';
        }
        else {
            return "Git operation failed: ".concat(error.message);
        }
    };
    ReleaseAnalysisErrorHandler.prototype.determineGitErrorSeverity = function (error) {
        var message = error.message.toLowerCase();
        if (message.includes('not a git repository')) {
            return 'critical';
        }
        else if (message.includes('permission denied')) {
            return 'high';
        }
        else if (message.includes('invalid reference')) {
            return 'medium';
        }
        else {
            return 'low';
        }
    };
    ReleaseAnalysisErrorHandler.prototype.getGitRecoveryStrategies = function (error, fallbackAction) {
        var message = error.message.toLowerCase();
        var strategies = [];
        if (message.includes('not a git repository')) {
            strategies.push({
                type: 'manual',
                description: 'Initialize Git repository or run from correct directory',
                guidance: 'Run "git init" to initialize a repository or navigate to a directory with a Git repository'
            });
        }
        else if (message.includes('invalid reference')) {
            strategies.push({
                type: 'fallback',
                description: 'Analyze all available completion documents',
                action: fallbackAction,
                guidance: 'Specify a valid Git tag or commit, or let the system analyze all documents'
            });
        }
        else if (message.includes('permission denied')) {
            strategies.push({
                type: 'manual',
                description: 'Fix Git repository permissions',
                guidance: 'Check file permissions and ensure you have read access to the Git repository'
            });
        }
        return strategies;
    };
    ReleaseAnalysisErrorHandler.prototype.getGitUserGuidance = function (error) {
        var message = error.message.toLowerCase();
        if (message.includes('not a git repository')) {
            return 'Ensure you are running the analysis from within a Git repository. Use "git status" to verify.';
        }
        else if (message.includes('invalid reference')) {
            return 'Check that the specified tag or commit exists using "git tag -l" or "git log --oneline".';
        }
        else if (message.includes('permission denied')) {
            return 'Verify you have read permissions for the Git repository and its .git directory.';
        }
        else {
            return 'Check your Git repository status and ensure all Git operations work correctly.';
        }
    };
    ReleaseAnalysisErrorHandler.prototype.extractParsingErrorMessage = function (error) {
        var message = error.message;
        if (message.includes('JSON')) {
            return 'Invalid JSON format in document metadata';
        }
        else if (message.includes('YAML')) {
            return 'Invalid YAML format in document frontmatter';
        }
        else if (message.includes('encoding')) {
            return 'File encoding issue (not UTF-8)';
        }
        else if (message.includes('empty') || message.includes('no content')) {
            return 'Document is empty or contains no readable content';
        }
        else {
            return 'Document format is not recognized or is corrupted';
        }
    };
    ReleaseAnalysisErrorHandler.prototype.getParsingRecoveryStrategies = function (filePath, skipOnError) {
        var strategies = [];
        if (skipOnError) {
            strategies.push({
                type: 'skip',
                description: 'Skip this document and continue analysis',
                guidance: 'Document will be excluded from analysis but other documents will be processed'
            });
        }
        strategies.push({
            type: 'manual',
            description: 'Fix document format and retry',
            guidance: "Review and fix the format of ".concat(filePath, ", then run analysis again")
        });
        return strategies;
    };
    ReleaseAnalysisErrorHandler.prototype.getParsingUserGuidance = function (error, filePath) {
        return "Review the document format in ".concat(filePath, ". Ensure it follows the expected completion document structure with proper markdown formatting and metadata headers.");
    };
    ReleaseAnalysisErrorHandler.prototype.getValidationRecoveryStrategies = function (confidenceImpact) {
        return [{
                type: 'fallback',
                description: "Continue with reduced confidence (".concat(Math.round(confidenceImpact * 100), "% reduction)"),
                guidance: 'Analysis will continue but results may be less reliable'
            }];
    };
    ReleaseAnalysisErrorHandler.prototype.getValidationUserGuidance = function (error) {
        return 'Review the validation error and consider if the extracted information needs manual verification.';
    };
    ReleaseAnalysisErrorHandler.prototype.getConfigurationRecoveryStrategies = function (configPath) {
        var _this = this;
        var strategies = [];
        strategies.push({
            type: 'fallback',
            description: 'Use default configuration',
            action: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, this.getDefaultConfiguration()];
            }); }); },
            guidance: 'Analysis will continue with built-in default settings'
        });
        if (configPath) {
            strategies.push({
                type: 'manual',
                description: 'Fix configuration file and retry',
                guidance: "Review and fix the configuration in ".concat(configPath)
            });
        }
        return strategies;
    };
    ReleaseAnalysisErrorHandler.prototype.getConfigurationUserGuidance = function (error, configPath) {
        if (configPath) {
            return "Check the configuration file at ".concat(configPath, " for syntax errors or invalid values.");
        }
        else {
            return 'Verify your analysis configuration settings and ensure all required values are provided.';
        }
    };
    ReleaseAnalysisErrorHandler.prototype.extractFilesystemErrorMessage = function (error) {
        var message = error.message.toLowerCase();
        if (message.includes('enoent') || message.includes('no such file')) {
            return 'File or directory not found';
        }
        else if (message.includes('eacces') || message.includes('permission denied')) {
            return 'Permission denied';
        }
        else if (message.includes('eisdir')) {
            return 'Expected file but found directory';
        }
        else if (message.includes('enotdir')) {
            return 'Expected directory but found file';
        }
        else if (message.includes('enospc')) {
            return 'No space left on device';
        }
        else {
            return error.message;
        }
    };
    ReleaseAnalysisErrorHandler.prototype.getFilesystemRecoveryStrategies = function (filePath, operation) {
        var strategies = [];
        if (operation === 'read') {
            strategies.push({
                type: 'skip',
                description: 'Continue without this file',
                guidance: 'Analysis will proceed without the inaccessible file'
            });
        }
        strategies.push({
            type: 'manual',
            description: 'Fix file access issue and retry',
            guidance: "Ensure ".concat(filePath, " exists and is accessible, then retry the operation")
        });
        return strategies;
    };
    ReleaseAnalysisErrorHandler.prototype.getFilesystemUserGuidance = function (error, filePath, operation) {
        var message = error.message.toLowerCase();
        if (message.includes('permission')) {
            return "Check file permissions for ".concat(filePath, ". You may need to adjust permissions or run with appropriate privileges.");
        }
        else if (message.includes('not found')) {
            return "The file ".concat(filePath, " does not exist. Verify the path is correct and the file exists.");
        }
        else if (message.includes('space')) {
            return 'Free up disk space and try again.';
        }
        else {
            return "Resolve the filesystem issue with ".concat(filePath, " and retry the ").concat(operation, " operation.");
        }
    };
    ReleaseAnalysisErrorHandler.prototype.generateRecommendations = function () {
        var recommendations = [];
        var errorsByCategory = this.groupErrorsByCategory();
        if (errorsByCategory.git && errorsByCategory.git.length > 0) {
            recommendations.push('Verify Git repository status and ensure all Git operations work correctly');
        }
        if (errorsByCategory.parsing && errorsByCategory.parsing.length > 0) {
            recommendations.push('Review completion document formats and ensure they follow the expected structure');
        }
        if (errorsByCategory.filesystem && errorsByCategory.filesystem.length > 0) {
            recommendations.push('Check file permissions and ensure all required files are accessible');
        }
        if (errorsByCategory.configuration && errorsByCategory.configuration.length > 0) {
            recommendations.push('Review and validate your analysis configuration settings');
        }
        if (errorsByCategory.validation && errorsByCategory.validation.length > 0) {
            recommendations.push('Review validation errors and consider manual verification of results');
        }
        if (this.errorHistory.length > 5) {
            recommendations.push('Consider running analysis with verbose logging to identify patterns in errors');
        }
        return recommendations;
    };
    ReleaseAnalysisErrorHandler.prototype.groupErrorsByCategory = function () {
        return this.errorHistory.reduce(function (groups, error) {
            if (!groups[error.category]) {
                groups[error.category] = [];
            }
            groups[error.category].push(error);
            return groups;
        }, {});
    };
    ReleaseAnalysisErrorHandler.prototype.getDefaultConfiguration = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Return a basic default configuration
                return [2 /*return*/, {
                        extraction: {
                            completionPatterns: ['*-completion.md', '.kiro/specs/*/completion/*.md'],
                            breakingChangeKeywords: ['breaking', 'breaking change', 'incompatible'],
                            featureKeywords: ['feature', 'new', 'add', 'implement'],
                            bugFixKeywords: ['fix', 'bug', 'issue', 'resolve'],
                            improvementKeywords: ['improve', 'enhance', 'optimize', 'refactor'],
                            documentationKeywords: ['documentation', 'docs', 'readme', 'comment']
                        },
                        versioning: {
                            semanticVersioning: true,
                            preReleaseHandling: 'increment'
                        },
                        reporting: {
                            defaultFormat: 'summary',
                            includeConfidence: true,
                            includeMetadata: false
                        },
                        git: {
                            defaultBranch: 'main',
                            releaseTagPattern: '^v?\\d+\\.\\d+\\.\\d+$'
                        }
                    }];
            });
        });
    };
    return ReleaseAnalysisErrorHandler;
}());
exports.ReleaseAnalysisErrorHandler = ReleaseAnalysisErrorHandler;
/**
 * Global error handler instance for release analysis
 */
exports.releaseAnalysisErrorHandler = new ReleaseAnalysisErrorHandler();
/**
 * Utility function to wrap operations with error handling
 */
function withErrorHandling(operation_1, context_1) {
    return __awaiter(this, arguments, void 0, function (operation, context, errorHandler) {
        var result, error_1;
        if (errorHandler === void 0) { errorHandler = exports.releaseAnalysisErrorHandler; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, operation()];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, {
                            success: true,
                            data: result,
                            warnings: []
                        }];
                case 2:
                    error_1 = _a.sent();
                    if (error_1 instanceof Error) {
                        // Determine error type and handle appropriately
                        if (context.gitCommand || error_1.message.includes('git')) {
                            return [2 /*return*/, errorHandler.handleGitError(error_1, context)];
                        }
                        else if (context.filePath && (error_1.message.toLowerCase().includes('parse') || error_1.message.toLowerCase().includes('json') || error_1.message.toLowerCase().includes('yaml'))) {
                            return [2 /*return*/, errorHandler.handleParsingError(error_1, context.filePath, context)];
                        }
                        else if (error_1.message.toLowerCase().includes('config')) {
                            return [2 /*return*/, errorHandler.handleConfigurationError(error_1, context)];
                        }
                        else if (context.filePath && (error_1.message.includes('ENOENT') || error_1.message.includes('permission'))) {
                            return [2 /*return*/, errorHandler.handleFilesystemError(error_1, context.filePath, context)];
                        }
                        else {
                            return [2 /*return*/, errorHandler.handleValidationError(error_1, context)];
                        }
                    }
                    else {
                        return [2 /*return*/, {
                                success: false,
                                error: {
                                    code: 'UNKNOWN_ERROR',
                                    message: "Unknown error: ".concat(String(error_1)),
                                    severity: 'high',
                                    category: 'validation',
                                    context: context,
                                    recoveryStrategies: [],
                                    userGuidance: 'An unexpected error occurred. Please check the logs and try again.'
                                },
                                warnings: []
                            }];
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
