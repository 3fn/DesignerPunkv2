"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompletionDocumentCollector = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var child_process_1 = require("child_process");
var ErrorHandler_1 = require("../errors/ErrorHandler");
var ErrorRecovery_1 = require("../errors/ErrorRecovery");
/**
 * Completion document collector for release analysis
 *
 * Handles discovery, loading, filtering, and validation of completion documents
 * from Git changes with comprehensive error handling and metadata extraction.
 *
 * Requirements addressed:
 * - 2.1: Extract information from structured and unstructured completion documents
 * - 2.2: Filter documentation-only changes from release-triggering changes
 * - 5.2: Include completion documents added since last release
 * - 5.3: Analyze current versions of modified completion documents
 */
var CompletionDocumentCollector = /** @class */ (function () {
    function CompletionDocumentCollector(workingDirectory, config) {
        if (workingDirectory === void 0) { workingDirectory = process.cwd(); }
        this.workingDirectory = workingDirectory;
        this.config = config;
    }
    /**
     * Collect completion documents from Git changes
     * Requirement 5.2, 5.3: Include added/modified completion documents
     */
    CompletionDocumentCollector.prototype.collectFromGitChanges = function (changes, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, result, context, collectionResult;
            var _this = this;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        startTime = Date.now();
                        result = {
                            documents: [],
                            metadata: {
                                totalFilesScanned: 0,
                                documentsFound: 0,
                                documentsLoaded: 0,
                                documentsFiltered: 0,
                                collectionDate: new Date(),
                                processingTimeMs: 0
                            },
                            errors: [],
                            warnings: []
                        };
                        context = {
                            operation: 'collectFromGitChanges',
                            component: 'CompletionDocumentCollector',
                            timestamp: new Date()
                        };
                        return [4 /*yield*/, (0, ErrorHandler_1.withErrorHandling)(function () { return __awaiter(_this, void 0, void 0, function () {
                                var relevantFiles, discoveredDocuments, loadedDocuments, filteredDocuments;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            relevantFiles = __spreadArray(__spreadArray([], changes.addedFiles, true), changes.modifiedFiles, true);
                                            result.metadata.totalFilesScanned = relevantFiles.length;
                                            return [4 /*yield*/, this.discoverCompletionDocuments(relevantFiles, result)];
                                        case 1:
                                            discoveredDocuments = _a.sent();
                                            result.metadata.documentsFound = discoveredDocuments.length;
                                            return [4 /*yield*/, this.loadDocuments(discoveredDocuments, result)];
                                        case 2:
                                            loadedDocuments = _a.sent();
                                            result.metadata.documentsLoaded = loadedDocuments.length;
                                            filteredDocuments = this.filterDocuments(loadedDocuments, filter, result);
                                            result.metadata.documentsFiltered = filteredDocuments.length;
                                            result.documents = filteredDocuments;
                                            result.metadata.processingTimeMs = Date.now() - startTime;
                                            return [2 /*return*/, result];
                                    }
                                });
                            }); }, context)];
                    case 1:
                        collectionResult = _c.sent();
                        if (collectionResult.success) {
                            return [2 /*return*/, collectionResult.data];
                        }
                        else {
                            // Add collection error to result
                            result.errors.push({
                                filePath: 'collection-process',
                                error: "Collection failed: ".concat(((_a = collectionResult.error) === null || _a === void 0 ? void 0 : _a.message) || 'Unknown error'),
                                type: 'validation',
                                recoverable: false
                            });
                            result.metadata.processingTimeMs = Date.now() - startTime;
                            // Log error details but return partial results
                            console.warn("\u26A0\uFE0F  Document collection encountered errors: ".concat((_b = collectionResult.error) === null || _b === void 0 ? void 0 : _b.message));
                            if (collectionResult.warnings) {
                                collectionResult.warnings.forEach(function (warning) { return result.warnings.push(warning); });
                            }
                            return [2 /*return*/, result];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Collect completion documents from specific paths
     * Requirement 2.1: Extract information from completion documents
     */
    CompletionDocumentCollector.prototype.collectFromPaths = function (paths, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, result, discoveredDocuments, loadedDocuments, filteredDocuments, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = Date.now();
                        result = {
                            documents: [],
                            metadata: {
                                totalFilesScanned: paths.length,
                                documentsFound: 0,
                                documentsLoaded: 0,
                                documentsFiltered: 0,
                                collectionDate: new Date(),
                                processingTimeMs: 0
                            },
                            errors: [],
                            warnings: []
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.discoverCompletionDocuments(paths, result)];
                    case 2:
                        discoveredDocuments = _a.sent();
                        result.metadata.documentsFound = discoveredDocuments.length;
                        return [4 /*yield*/, this.loadDocuments(discoveredDocuments, result)];
                    case 3:
                        loadedDocuments = _a.sent();
                        result.metadata.documentsLoaded = loadedDocuments.length;
                        filteredDocuments = this.filterDocuments(loadedDocuments, filter, result);
                        result.metadata.documentsFiltered = filteredDocuments.length;
                        result.documents = filteredDocuments;
                        result.metadata.processingTimeMs = Date.now() - startTime;
                        return [2 /*return*/, result];
                    case 4:
                        error_1 = _a.sent();
                        result.errors.push({
                            filePath: 'collection-process',
                            error: "Collection failed: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)),
                            type: 'validation',
                            recoverable: false
                        });
                        result.metadata.processingTimeMs = Date.now() - startTime;
                        return [2 /*return*/, result];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validate a completion document
     * Requirement 2.1: Extract and validate completion document information
     */
    CompletionDocumentCollector.prototype.validateDocument = function (document) {
        return __awaiter(this, void 0, void 0, function () {
            var issues, confidence, hasStructuredSections;
            return __generator(this, function (_a) {
                issues = [];
                confidence = 1.0;
                // Check for required metadata
                if (!document.metadata.title) {
                    issues.push({
                        type: 'missing-metadata',
                        severity: 'warning',
                        message: 'Document missing title',
                        field: 'title'
                    });
                    confidence -= 0.2;
                }
                if (!document.metadata.date) {
                    issues.push({
                        type: 'missing-metadata',
                        severity: 'info',
                        message: 'Document missing date metadata',
                        field: 'date'
                    });
                    confidence -= 0.1;
                }
                // Check content quality
                if (!document.content || document.content.trim().length < 50) {
                    issues.push({
                        type: 'empty-content',
                        severity: 'error',
                        message: 'Document content is empty or too short',
                        field: 'content'
                    });
                    confidence -= 0.5;
                }
                // Check document type classification
                if (document.metadata.type === 'other') {
                    issues.push({
                        type: 'invalid-format',
                        severity: 'warning',
                        message: 'Could not determine document type from path or content',
                        field: 'type'
                    });
                    confidence -= 0.1;
                }
                hasStructuredSections = this.hasStructuredSections(document.content);
                if (hasStructuredSections) {
                    confidence += 0.1;
                }
                else {
                    issues.push({
                        type: 'invalid-format',
                        severity: 'info',
                        message: 'Document does not appear to have structured sections',
                        field: 'format'
                    });
                }
                // Ensure confidence stays within bounds
                confidence = Math.max(0, Math.min(1, confidence));
                return [2 /*return*/, {
                        isValid: issues.filter(function (i) { return i.severity === 'error'; }).length === 0,
                        confidence: confidence,
                        issues: issues,
                        metadata: document.metadata
                    }];
            });
        });
    };
    /**
     * Discover completion documents from file paths
     */
    CompletionDocumentCollector.prototype.discoverCompletionDocuments = function (filePaths, result) {
        return __awaiter(this, void 0, void 0, function () {
            var discoveredPaths, _i, filePaths_1, filePath, fullPath;
            return __generator(this, function (_a) {
                discoveredPaths = [];
                for (_i = 0, filePaths_1 = filePaths; _i < filePaths_1.length; _i++) {
                    filePath = filePaths_1[_i];
                    try {
                        if (this.isCompletionDocument(filePath)) {
                            fullPath = (0, path_1.join)(this.workingDirectory, filePath);
                            if ((0, fs_1.existsSync)(fullPath)) {
                                discoveredPaths.push(filePath);
                            }
                            else {
                                result.errors.push({
                                    filePath: filePath,
                                    error: 'File not found or not accessible',
                                    type: 'access',
                                    recoverable: false
                                });
                            }
                        }
                    }
                    catch (error) {
                        result.errors.push({
                            filePath: filePath,
                            error: "Discovery failed: ".concat(error instanceof Error ? error.message : String(error)),
                            type: 'access',
                            recoverable: true
                        });
                    }
                }
                return [2 /*return*/, discoveredPaths];
            });
        });
    };
    /**
     * Load completion documents from file paths
     */
    CompletionDocumentCollector.prototype.loadDocuments = function (filePaths, result) {
        return __awaiter(this, void 0, void 0, function () {
            var documents, documentRecovery, _loop_1, this_1, _i, filePaths_2, filePath;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        documents = [];
                        documentRecovery = new ErrorRecovery_1.DocumentErrorRecovery({
                            skipMalformedDocuments: true,
                            useBasicParsing: true,
                            requireMinimumContent: 50
                        });
                        _loop_1 = function (filePath) {
                            var context, loadResult, fs, content, recoveryResult, recoveryError_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        context = {
                                            operation: 'loadCompletionDocument',
                                            component: 'CompletionDocumentCollector',
                                            filePath: filePath,
                                            timestamp: new Date()
                                        };
                                        return [4 /*yield*/, (0, ErrorHandler_1.withErrorHandling)(function () { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, this.loadCompletionDocument(filePath)];
                                                        case 1: return [2 /*return*/, _a.sent()];
                                                    }
                                                });
                                            }); }, context)];
                                    case 1:
                                        loadResult = _b.sent();
                                        if (!(loadResult.success && loadResult.data)) return [3 /*break*/, 2];
                                        documents.push(loadResult.data);
                                        return [3 /*break*/, 10];
                                    case 2:
                                        if (!loadResult.error) return [3 /*break*/, 9];
                                        _b.label = 3;
                                    case 3:
                                        _b.trys.push([3, 7, , 8]);
                                        return [4 /*yield*/, Promise.resolve().then(function () { return require('fs/promises'); })];
                                    case 4:
                                        fs = _b.sent();
                                        return [4 /*yield*/, fs.readFile((0, path_1.join)(this_1.workingDirectory, filePath), 'utf-8')];
                                    case 5:
                                        content = _b.sent();
                                        return [4 /*yield*/, documentRecovery.recoverFromParsingError(filePath, content, new Error(loadResult.error.message))];
                                    case 6:
                                        recoveryResult = _b.sent();
                                        if (recoveryResult.success && recoveryResult.data) {
                                            documents.push(recoveryResult.data);
                                            result.warnings.push("Recovered document using fallback parsing: ".concat(filePath));
                                        }
                                        else {
                                            result.errors.push({
                                                filePath: filePath,
                                                error: "Loading failed: ".concat(loadResult.error.message),
                                                type: 'parse',
                                                recoverable: false
                                            });
                                        }
                                        return [3 /*break*/, 8];
                                    case 7:
                                        recoveryError_1 = _b.sent();
                                        result.errors.push({
                                            filePath: filePath,
                                            error: "Loading and recovery failed: ".concat(loadResult.error.message),
                                            type: 'access',
                                            recoverable: false
                                        });
                                        return [3 /*break*/, 8];
                                    case 8: return [3 /*break*/, 10];
                                    case 9:
                                        result.warnings.push("Could not load completion document: ".concat(filePath));
                                        _b.label = 10;
                                    case 10: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, filePaths_2 = filePaths;
                        _a.label = 1;
                    case 1:
                        if (!(_i < filePaths_2.length)) return [3 /*break*/, 4];
                        filePath = filePaths_2[_i];
                        return [5 /*yield**/, _loop_1(filePath)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, documents];
                }
            });
        });
    };
    /**
     * Filter documents based on criteria
     * Requirement 2.2: Filter documentation-only changes
     */
    CompletionDocumentCollector.prototype.filterDocuments = function (documents, filter, result) {
        var _this = this;
        return documents.filter(function (document) {
            // Always check if document is documentation-only (Requirement 2.2)
            if (_this.isDocumentationOnly(document)) {
                result.warnings.push("Filtered documentation-only document: ".concat(document.path));
                return false;
            }
            // Apply additional filters if provided
            if (filter) {
                // Check include patterns
                if (filter.includePatterns && filter.includePatterns.length > 0) {
                    var matches = filter.includePatterns.some(function (pattern) {
                        return _this.matchesPattern(document.path, pattern);
                    });
                    if (!matches) {
                        return false;
                    }
                }
                // Check exclude patterns
                if (filter.excludePatterns && filter.excludePatterns.length > 0) {
                    var excluded = filter.excludePatterns.some(function (pattern) {
                        return _this.matchesPattern(document.path, pattern);
                    });
                    if (excluded) {
                        return false;
                    }
                }
                // Check document types
                if (filter.documentTypes && filter.documentTypes.length > 0) {
                    if (!filter.documentTypes.includes(document.metadata.type)) {
                        return false;
                    }
                }
            }
            return true;
        });
    };
    /**
     * Check if a file path represents a completion document
     */
    CompletionDocumentCollector.prototype.isCompletionDocument = function (filePath) {
        var _this = this;
        // Use configuration patterns
        var patterns = this.config.extraction.completionPatterns;
        return patterns.some(function (pattern) { return _this.matchesPattern(filePath, pattern); }) ||
            this.matchesCompletionPath(filePath);
    };
    /**
     * Check if path matches completion document patterns
     */
    CompletionDocumentCollector.prototype.matchesCompletionPath = function (filePath) {
        // Look for completion documents in .kiro/specs/*/completion/ directories
        var completionPattern = /\.kiro\/specs\/[^\/]+\/completion\/.*\.md$/;
        // Also look for task completion documents and spec completion summaries
        var taskCompletionPattern = /task-\d+-completion\.md$/;
        var specCompletionPattern = /spec-completion-summary\.md$/;
        return completionPattern.test(filePath) ||
            taskCompletionPattern.test(filePath) ||
            specCompletionPattern.test(filePath);
    };
    /**
     * Load and parse a completion document
     */
    CompletionDocumentCollector.prototype.loadCompletionDocument = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var fullPath, fs, content, stats, gitCommit, metadata, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        fullPath = (0, path_1.join)(this.workingDirectory, filePath);
                        if (!(0, fs_1.existsSync)(fullPath)) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('fs/promises'); })];
                    case 1:
                        fs = _a.sent();
                        return [4 /*yield*/, fs.readFile(fullPath, 'utf-8')];
                    case 2:
                        content = _a.sent();
                        stats = (0, fs_1.statSync)(fullPath);
                        gitCommit = this.getFileLastCommit(filePath);
                        metadata = this.extractDocumentMetadata(content, filePath);
                        return [2 /*return*/, {
                                path: filePath,
                                content: content,
                                lastModified: stats.mtime,
                                gitCommit: gitCommit,
                                metadata: metadata
                            }];
                    case 3:
                        error_2 = _a.sent();
                        throw new Error("Failed to load document ".concat(filePath, ": ").concat(error_2 instanceof Error ? error_2.message : String(error_2)));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Extract metadata from completion document content
     */
    CompletionDocumentCollector.prototype.extractDocumentMetadata = function (content, filePath) {
        var metadata = {
            title: '',
            type: 'other'
        };
        // Extract title from first heading
        var titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) {
            metadata.title = titleMatch[1].trim();
        }
        // Extract metadata from document header
        var dateMatch = content.match(/\*\*Date\*\*:\s*(.+)$/m);
        if (dateMatch) {
            metadata.date = dateMatch[1].trim();
        }
        var taskMatch = content.match(/\*\*Task\*\*:\s*(.+)$/m);
        if (taskMatch) {
            metadata.task = taskMatch[1].trim();
        }
        var specMatch = content.match(/\*\*Spec\*\*:\s*(.+)$/m);
        if (specMatch) {
            metadata.spec = specMatch[1].trim();
        }
        var statusMatch = content.match(/\*\*Status\*\*:\s*(.+)$/m);
        if (statusMatch) {
            metadata.status = statusMatch[1].trim();
        }
        // Determine document type based on path and content
        if (filePath.includes('task-') && filePath.includes('-completion.md')) {
            metadata.type = 'task-completion';
        }
        else if (filePath.includes('spec-completion')) {
            metadata.type = 'spec-completion';
        }
        return metadata;
    };
    /**
     * Check if document has structured sections
     */
    CompletionDocumentCollector.prototype.hasStructuredSections = function (content) {
        var sectionHeaders = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], this.config.extraction.sectionHeaders.breakingChanges, true), this.config.extraction.sectionHeaders.features, true), this.config.extraction.sectionHeaders.bugFixes, true), this.config.extraction.sectionHeaders.improvements, true), this.config.extraction.sectionHeaders.summary, true);
        return sectionHeaders.some(function (header) {
            var headerPattern = new RegExp("^##?\\s+".concat(header, "\\s*$"), 'mi');
            return headerPattern.test(content);
        });
    };
    /**
     * Check if document contains only documentation changes
     * Requirement 2.2: Filter documentation-only changes
     */
    CompletionDocumentCollector.prototype.isDocumentationOnly = function (document) {
        var docKeywords = this.config.extraction.documentationKeywords;
        var content = document.content.toLowerCase();
        var title = document.metadata.title.toLowerCase();
        // Check if title or content heavily features documentation keywords
        var docKeywordCount = docKeywords.reduce(function (count, keyword) {
            var titleMatches = (title.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
            var contentMatches = (content.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
            return count + titleMatches * 3 + contentMatches; // Weight title matches more heavily
        }, 0);
        // Check for functional change keywords
        var functionalKeywords = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], this.config.extraction.breakingChangeKeywords, true), this.config.extraction.featureKeywords, true), this.config.extraction.bugFixKeywords, true), this.config.extraction.improvementKeywords, true);
        var functionalKeywordCount = functionalKeywords.reduce(function (count, keyword) {
            var matches = (content.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
            return count + matches;
        }, 0);
        // Consider documentation-only if:
        // 1. Title contains "documentation" and content has multiple doc keywords
        // 2. Or if document has high ratio of documentation keywords and low functional content
        var isDocOnly = (title.includes('documentation') && docKeywordCount >= 4) ||
            (docKeywordCount >= 6 && functionalKeywordCount === 0);
        return isDocOnly;
    };
    /**
     * Check if a path matches a glob-like pattern
     */
    CompletionDocumentCollector.prototype.matchesPattern = function (path, pattern) {
        // Convert glob pattern to regex
        var regexPattern = pattern
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');
        var regex = new RegExp("^".concat(regexPattern, "$"));
        return regex.test(path);
    };
    /**
     * Get the commit that last modified a file
     */
    CompletionDocumentCollector.prototype.getFileLastCommit = function (filePath) {
        try {
            return this.executeGitCommand("log -1 --format=%H -- \"".concat(filePath, "\"")).trim();
        }
        catch (_a) {
            return '';
        }
    };
    /**
     * Execute a Git command and return output
     */
    CompletionDocumentCollector.prototype.executeGitCommand = function (command) {
        try {
            return (0, child_process_1.execSync)("git ".concat(command), {
                cwd: this.workingDirectory,
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe']
            });
        }
        catch (error) {
            throw new Error("Git command failed: git ".concat(command));
        }
    };
    return CompletionDocumentCollector;
}());
exports.CompletionDocumentCollector = CompletionDocumentCollector;
