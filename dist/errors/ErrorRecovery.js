"use strict";
/**
 * Error Recovery Utilities for Release Analysis
 *
 * Provides specific recovery strategies and fallback mechanisms
 * for different types of errors encountered during analysis.
 *
 * Requirements addressed:
 * - 8.1: Validate completion documents are properly formatted and accessible
 * - 8.2: Provide confidence scores for extracted information
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
exports.ConfigurationErrorRecovery = exports.DocumentErrorRecovery = exports.GitErrorRecovery = void 0;
exports.createRecoveryUtilities = createRecoveryUtilities;
var fs_1 = require("fs");
var path_1 = require("path");
var child_process_1 = require("child_process");
/**
 * Git-specific error recovery utilities
 */
var GitErrorRecovery = /** @class */ (function () {
    function GitErrorRecovery(workingDirectory, options) {
        if (options === void 0) { options = {}; }
        this.workingDirectory = workingDirectory;
        this.options = __assign({ fallbackToAllDocuments: true, maxCommitHistory: 1000, skipRemoteOperations: false }, options);
    }
    /**
     * Recover from "not a git repository" error
     */
    GitErrorRecovery.prototype.recoverFromNoGitRepository = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gitRoot, parentGitRepo, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.findGitRoot()];
                    case 1:
                        gitRoot = _a.sent();
                        if (gitRoot) {
                            return [2 /*return*/, {
                                    success: true,
                                    data: { gitRoot: gitRoot, workingDirectory: gitRoot },
                                    warnings: ["Found Git repository at: ".concat(gitRoot)]
                                }];
                        }
                        return [4 /*yield*/, this.findParentGitRepository()];
                    case 2:
                        parentGitRepo = _a.sent();
                        if (parentGitRepo) {
                            return [2 /*return*/, {
                                    success: true,
                                    data: { gitRoot: parentGitRepo, workingDirectory: parentGitRepo },
                                    warnings: ["Using Git repository from parent directory: ".concat(parentGitRepo)]
                                }];
                        }
                        // If fallback is enabled, continue without Git
                        if (this.options.fallbackToAllDocuments) {
                            return [2 /*return*/, {
                                    success: true,
                                    data: { useFileSystemScan: true },
                                    warnings: ['No Git repository found - will scan filesystem for completion documents']
                                }];
                        }
                        return [2 /*return*/, {
                                success: false,
                                warnings: ['No Git repository found and fallback is disabled']
                            }];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                warnings: ["Git recovery failed: ".concat(error_1 instanceof Error ? error_1.message : String(error_1))]
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Recover from invalid Git reference error
     */
    GitErrorRecovery.prototype.recoverFromInvalidReference = function (reference) {
        return __awaiter(this, void 0, void 0, function () {
            var recentTag, firstCommit, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.findMostRecentTag()];
                    case 1:
                        recentTag = _a.sent();
                        if (recentTag) {
                            return [2 /*return*/, {
                                    success: true,
                                    data: { validReference: recentTag },
                                    warnings: ["Using most recent tag instead of ".concat(reference, ": ").concat(recentTag)]
                                }];
                        }
                        return [4 /*yield*/, this.findFirstCommit()];
                    case 2:
                        firstCommit = _a.sent();
                        if (firstCommit) {
                            return [2 /*return*/, {
                                    success: true,
                                    data: { validReference: firstCommit },
                                    warnings: ["Using first commit instead of ".concat(reference, ": ").concat(firstCommit)]
                                }];
                        }
                        // Fallback to analyzing all documents
                        if (this.options.fallbackToAllDocuments) {
                            return [2 /*return*/, {
                                    success: true,
                                    data: { analyzeAllDocuments: true },
                                    warnings: ["Invalid reference ".concat(reference, " - analyzing all available documents")]
                                }];
                        }
                        return [2 /*return*/, {
                                success: false,
                                warnings: ["Could not find valid Git reference to replace ".concat(reference)]
                            }];
                    case 3:
                        error_2 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                warnings: ["Reference recovery failed: ".concat(error_2 instanceof Error ? error_2.message : String(error_2))]
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Recover from Git permission errors
     */
    GitErrorRecovery.prototype.recoverFromPermissionError = function () {
        return __awaiter(this, void 0, void 0, function () {
            var canReadBasicInfo, readOnlyAccess, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.testBasicGitAccess()];
                    case 1:
                        canReadBasicInfo = _a.sent();
                        if (canReadBasicInfo) {
                            return [2 /*return*/, {
                                    success: true,
                                    data: { limitedGitAccess: true },
                                    warnings: ['Limited Git access - some operations may be restricted']
                                }];
                        }
                        return [4 /*yield*/, this.testReadOnlyGitAccess()];
                    case 2:
                        readOnlyAccess = _a.sent();
                        if (readOnlyAccess) {
                            return [2 /*return*/, {
                                    success: true,
                                    data: { readOnlyGitAccess: true },
                                    warnings: ['Using read-only Git access - some features may be limited']
                                }];
                        }
                        // Fallback to filesystem scanning
                        if (this.options.fallbackToAllDocuments) {
                            return [2 /*return*/, {
                                    success: true,
                                    data: { useFileSystemScan: true },
                                    warnings: ['Git access denied - falling back to filesystem scanning']
                                }];
                        }
                        return [2 /*return*/, {
                                success: false,
                                warnings: ['Git permission denied and no fallback available']
                            }];
                    case 3:
                        error_3 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                warnings: ["Permission recovery failed: ".concat(error_3 instanceof Error ? error_3.message : String(error_3))]
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Private helper methods
    GitErrorRecovery.prototype.findGitRoot = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gitRoot;
            return __generator(this, function (_a) {
                try {
                    gitRoot = (0, child_process_1.execSync)('git rev-parse --show-toplevel', {
                        cwd: this.workingDirectory,
                        encoding: 'utf-8',
                        stdio: ['pipe', 'pipe', 'pipe']
                    }).trim();
                    return [2 /*return*/, gitRoot];
                }
                catch (_b) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    GitErrorRecovery.prototype.findParentGitRepository = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentDir, maxLevels, i, parentDir;
            return __generator(this, function (_a) {
                currentDir = this.workingDirectory;
                maxLevels = 5;
                for (i = 0; i < maxLevels; i++) {
                    parentDir = (0, path_1.dirname)(currentDir);
                    if (parentDir === currentDir)
                        break; // Reached root
                    if ((0, fs_1.existsSync)((0, path_1.join)(parentDir, '.git'))) {
                        return [2 /*return*/, parentDir];
                    }
                    currentDir = parentDir;
                }
                return [2 /*return*/, null];
            });
        });
    };
    GitErrorRecovery.prototype.findMostRecentTag = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tag;
            return __generator(this, function (_a) {
                try {
                    tag = (0, child_process_1.execSync)('git describe --tags --abbrev=0', {
                        cwd: this.workingDirectory,
                        encoding: 'utf-8',
                        stdio: ['pipe', 'pipe', 'pipe']
                    }).trim();
                    return [2 /*return*/, tag];
                }
                catch (_b) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    GitErrorRecovery.prototype.findFirstCommit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var commit;
            return __generator(this, function (_a) {
                try {
                    commit = (0, child_process_1.execSync)('git rev-list --max-parents=0 HEAD', {
                        cwd: this.workingDirectory,
                        encoding: 'utf-8',
                        stdio: ['pipe', 'pipe', 'pipe']
                    }).trim().split('\n')[0];
                    return [2 /*return*/, commit];
                }
                catch (_b) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    GitErrorRecovery.prototype.testBasicGitAccess = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    (0, child_process_1.execSync)('git status --porcelain', {
                        cwd: this.workingDirectory,
                        stdio: ['pipe', 'pipe', 'pipe']
                    });
                    return [2 /*return*/, true];
                }
                catch (_b) {
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
    };
    GitErrorRecovery.prototype.testReadOnlyGitAccess = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    (0, child_process_1.execSync)('git log --oneline -1', {
                        cwd: this.workingDirectory,
                        stdio: ['pipe', 'pipe', 'pipe']
                    });
                    return [2 /*return*/, true];
                }
                catch (_b) {
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
    };
    return GitErrorRecovery;
}());
exports.GitErrorRecovery = GitErrorRecovery;
/**
 * Document parsing error recovery utilities
 */
var DocumentErrorRecovery = /** @class */ (function () {
    function DocumentErrorRecovery(options) {
        if (options === void 0) { options = {}; }
        this.options = __assign({ skipMalformedDocuments: true, useBasicParsing: true, requireMinimumContent: 50, fallbackToFilename: true }, options);
    }
    /**
     * Recover from document parsing errors
     */
    DocumentErrorRecovery.prototype.recoverFromParsingError = function (filePath, content, error) {
        return __awaiter(this, void 0, void 0, function () {
            var basicDocument, filenameDocument, recoveryError_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!this.options.useBasicParsing) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.attemptBasicParsing(filePath, content)];
                    case 1:
                        basicDocument = _a.sent();
                        if (basicDocument) {
                            return [2 /*return*/, {
                                    success: true,
                                    data: basicDocument,
                                    warnings: ["Used basic parsing for ".concat(filePath, " - some metadata may be missing")]
                                }];
                        }
                        _a.label = 2;
                    case 2:
                        if (!this.options.fallbackToFilename) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.createDocumentFromFilename(filePath, content)];
                    case 3:
                        filenameDocument = _a.sent();
                        if (filenameDocument) {
                            return [2 /*return*/, {
                                    success: true,
                                    data: filenameDocument,
                                    warnings: ["Created minimal document from filename: ".concat(filePath)]
                                }];
                        }
                        _a.label = 4;
                    case 4:
                        // If skipping is allowed, return null to skip this document
                        if (this.options.skipMalformedDocuments) {
                            return [2 /*return*/, {
                                    success: true,
                                    data: null,
                                    warnings: ["Skipped malformed document: ".concat(filePath)]
                                }];
                        }
                        return [2 /*return*/, {
                                success: false,
                                warnings: ["Could not recover from parsing error in ".concat(filePath, ": ").concat(error.message)]
                            }];
                    case 5:
                        recoveryError_1 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                warnings: ["Document recovery failed: ".concat(recoveryError_1 instanceof Error ? recoveryError_1.message : String(recoveryError_1))]
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Recover from empty or corrupted document content
     */
    DocumentErrorRecovery.prototype.recoverFromEmptyDocument = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var fs, stats, alternativeContent, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(0, fs_1.existsSync)(filePath)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('fs/promises'); })];
                    case 1:
                        fs = _a.sent();
                        return [4 /*yield*/, fs.stat(filePath)];
                    case 2:
                        stats = _a.sent();
                        if (stats.size === 0) {
                            return [2 /*return*/, {
                                    success: true,
                                    data: null,
                                    warnings: ["Skipped empty file: ".concat(filePath)]
                                }];
                        }
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.tryAlternativeEncodings(filePath)];
                    case 4:
                        alternativeContent = _a.sent();
                        if (alternativeContent) {
                            return [2 /*return*/, {
                                    success: true,
                                    data: alternativeContent,
                                    warnings: ["Recovered content using alternative encoding for: ".concat(filePath)]
                                }];
                        }
                        return [2 /*return*/, {
                                success: true,
                                data: null,
                                warnings: ["Could not recover content from: ".concat(filePath)]
                            }];
                    case 5:
                        error_4 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                warnings: ["Empty document recovery failed: ".concat(error_4 instanceof Error ? error_4.message : String(error_4))]
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // Private helper methods
    DocumentErrorRecovery.prototype.attemptBasicParsing = function (filePath, content) {
        return __awaiter(this, void 0, void 0, function () {
            var titleMatch, title, filename;
            return __generator(this, function (_a) {
                try {
                    titleMatch = content.match(/^#\s+(.+)$/m);
                    title = titleMatch ? titleMatch[1].trim() : 'Untitled Document';
                    // If no heading found, try to create title from filename
                    if (title === 'Untitled Document') {
                        filename = filePath.split('/').pop() || 'unknown';
                        title = filename.replace(/\.(md|txt)$/, '').replace(/[-_]/g, ' ');
                        title = title.split(' ').map(function (word) {
                            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                        }).join(' ');
                    }
                    // Check minimum content requirement
                    if (content.trim().length < (this.options.requireMinimumContent || 50)) {
                        return [2 /*return*/, null];
                    }
                    // Create basic document structure
                    return [2 /*return*/, {
                            path: filePath,
                            content: content,
                            lastModified: new Date(),
                            gitCommit: '',
                            metadata: {
                                title: title,
                                type: this.inferDocumentType(filePath),
                                parsingMethod: 'basic'
                            }
                        }];
                }
                catch (_b) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    DocumentErrorRecovery.prototype.createDocumentFromFilename = function (filePath, content) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, title;
            return __generator(this, function (_a) {
                try {
                    filename = filePath.split('/').pop() || 'unknown';
                    title = filename.replace(/\.(md|txt)$/, '').replace(/[-_]/g, ' ');
                    // Capitalize first letter of each word
                    title = title.split(' ').map(function (word) {
                        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                    }).join(' ');
                    return [2 /*return*/, {
                            path: filePath,
                            content: content || '',
                            lastModified: new Date(),
                            gitCommit: '',
                            metadata: {
                                title: title,
                                type: this.inferDocumentType(filePath),
                                parsingMethod: 'filename'
                            }
                        }];
                }
                catch (_b) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    DocumentErrorRecovery.prototype.tryAlternativeEncodings = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var encodings, fs, _i, encodings_1, encoding, content, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        encodings = ['utf8', 'latin1', 'ascii'];
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('fs/promises'); })];
                    case 1:
                        fs = _b.sent();
                        _i = 0, encodings_1 = encodings;
                        _b.label = 2;
                    case 2:
                        if (!(_i < encodings_1.length)) return [3 /*break*/, 7];
                        encoding = encodings_1[_i];
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, fs.readFile(filePath, encoding)];
                    case 4:
                        content = _b.sent();
                        if (content && content.trim().length > 0) {
                            return [2 /*return*/, content];
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        _a = _b.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/, null];
                }
            });
        });
    };
    DocumentErrorRecovery.prototype.inferDocumentType = function (filePath) {
        if (filePath.includes('task-') && filePath.includes('-completion')) {
            return 'task-completion';
        }
        else if (filePath.includes('spec-completion')) {
            return 'spec-completion';
        }
        else {
            return 'other';
        }
    };
    return DocumentErrorRecovery;
}());
exports.DocumentErrorRecovery = DocumentErrorRecovery;
/**
 * Configuration error recovery utilities
 */
var ConfigurationErrorRecovery = /** @class */ (function () {
    function ConfigurationErrorRecovery(options) {
        if (options === void 0) { options = {}; }
        this.options = __assign({ useDefaults: true, createMissingConfig: false, validateOnLoad: true, backupOriginal: true }, options);
    }
    /**
     * Recover from missing configuration file
     */
    ConfigurationErrorRecovery.prototype.recoverFromMissingConfig = function (configPath) {
        return __awaiter(this, void 0, void 0, function () {
            var defaultConfig, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!this.options.useDefaults) return [3 /*break*/, 3];
                        defaultConfig = this.getDefaultConfiguration();
                        if (!this.options.createMissingConfig) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createConfigurationFile(configPath, defaultConfig)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: defaultConfig,
                                warnings: ["Created default configuration file: ".concat(configPath)]
                            }];
                    case 2: return [2 /*return*/, {
                            success: true,
                            data: defaultConfig,
                            warnings: ['Using default configuration (no config file created)']
                        }];
                    case 3: return [2 /*return*/, {
                            success: false,
                            warnings: ["Configuration file not found: ".concat(configPath)]
                        }];
                    case 4:
                        error_5 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                warnings: ["Config recovery failed: ".concat(error_5 instanceof Error ? error_5.message : String(error_5))]
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Recover from invalid configuration format
     */
    ConfigurationErrorRecovery.prototype.recoverFromInvalidConfig = function (configPath, error) {
        return __awaiter(this, void 0, void 0, function () {
            var fixedConfig, defaultConfig, recoveryError_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(this.options.backupOriginal && (0, fs_1.existsSync)(configPath))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.backupConfigurationFile(configPath)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(0, fs_1.existsSync)(configPath)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.attemptConfigurationFix(configPath)];
                    case 3:
                        fixedConfig = _a.sent();
                        if (fixedConfig) {
                            return [2 /*return*/, {
                                    success: true,
                                    data: fixedConfig,
                                    warnings: ["Fixed configuration format issues in: ".concat(configPath)]
                                }];
                        }
                        _a.label = 4;
                    case 4:
                        // Fallback to defaults
                        if (this.options.useDefaults) {
                            defaultConfig = this.getDefaultConfiguration();
                            return [2 /*return*/, {
                                    success: true,
                                    data: defaultConfig,
                                    warnings: ["Using default configuration due to format errors in: ".concat(configPath)]
                                }];
                        }
                        return [2 /*return*/, {
                                success: false,
                                warnings: ["Could not recover from configuration errors in: ".concat(configPath)]
                            }];
                    case 5:
                        recoveryError_2 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                warnings: ["Configuration recovery failed: ".concat(recoveryError_2 instanceof Error ? recoveryError_2.message : String(recoveryError_2))]
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // Private helper methods
    ConfigurationErrorRecovery.prototype.getDefaultConfiguration = function () {
        return {
            extraction: {
                completionPatterns: [
                    '*-completion.md',
                    '.kiro/specs/*/completion/*.md',
                    'completion/*.md'
                ],
                breakingChangeKeywords: [
                    'breaking change',
                    'breaking',
                    'incompatible',
                    'removed',
                    'deprecated'
                ],
                featureKeywords: [
                    'feature',
                    'new',
                    'add',
                    'implement',
                    'introduce'
                ],
                bugFixKeywords: [
                    'fix',
                    'bug',
                    'issue',
                    'resolve',
                    'correct'
                ],
                improvementKeywords: [
                    'improve',
                    'enhance',
                    'optimize',
                    'refactor',
                    'update'
                ],
                documentationKeywords: [
                    'documentation',
                    'docs',
                    'readme',
                    'comment',
                    'guide'
                ],
                confidenceThresholds: {
                    minimumConfidence: 0.6,
                    uncertaintyThreshold: 0.8,
                    reviewThreshold: 0.9
                },
                sectionHeaders: {
                    breakingChanges: ['Breaking Changes', 'BREAKING CHANGES', 'Breaking'],
                    features: ['New Features', 'Features', 'Added'],
                    bugFixes: ['Bug Fixes', 'Fixes', 'Fixed'],
                    improvements: ['Improvements', 'Enhanced', 'Optimized'],
                    summary: ['Summary', 'Overview', 'Completion Summary']
                }
            },
            versioning: {
                semanticVersioning: true,
                preReleaseHandling: 'increment',
                versionBumpRules: {
                    majorBumpTriggers: ['breaking'],
                    minorBumpTriggers: ['feature', 'new'],
                    patchBumpTriggers: ['fix', 'bug'],
                    defaultBumpType: 'patch'
                },
                preRelease: {
                    startingNumber: 0
                }
            },
            reporting: {
                defaultFormat: 'summary',
                includeConfidence: true,
                includeMetadata: false,
                includeEvidence: true,
                templates: {
                    summary: {
                        format: 'markdown'
                    },
                    detailed: {
                        format: 'markdown'
                    },
                    releaseNotes: {
                        format: 'markdown'
                    }
                },
                outputFiles: {
                    saveResults: false,
                    outputDirectory: './release-analysis-results'
                }
            },
            git: {
                defaultBranch: 'main',
                releaseTagPattern: '^v?\\d+\\.\\d+\\.\\d+$',
                completionPaths: [
                    '.kiro/specs/*/completion/',
                    'completion/',
                    'docs/completion/'
                ],
                includePatterns: ['*.md'],
                excludePatterns: ['node_modules/**', '.git/**'],
                maxCommits: 1000
            }
        };
    };
    ConfigurationErrorRecovery.prototype.createConfigurationFile = function (configPath, config) {
        return __awaiter(this, void 0, void 0, function () {
            var fs, configDir;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('fs/promises'); })];
                    case 1:
                        fs = _a.sent();
                        configDir = (0, path_1.dirname)(configPath);
                        // Ensure directory exists
                        if (!(0, fs_1.existsSync)(configDir)) {
                            (0, fs_1.mkdirSync)(configDir, { recursive: true });
                        }
                        // Write configuration file
                        return [4 /*yield*/, fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8')];
                    case 2:
                        // Write configuration file
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfigurationErrorRecovery.prototype.backupConfigurationFile = function (configPath) {
        return __awaiter(this, void 0, void 0, function () {
            var fs, backupPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(0, fs_1.existsSync)(configPath)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('fs/promises'); })];
                    case 1:
                        fs = _a.sent();
                        backupPath = "".concat(configPath, ".backup.").concat(Date.now());
                        return [4 /*yield*/, fs.copyFile(configPath, backupPath)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ConfigurationErrorRecovery.prototype.attemptConfigurationFix = function (configPath) {
        return __awaiter(this, void 0, void 0, function () {
            var fs, content, config, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('fs/promises'); })];
                    case 1:
                        fs = _b.sent();
                        return [4 /*yield*/, fs.readFile(configPath, 'utf-8')];
                    case 2:
                        content = _b.sent();
                        // Try to fix common JSON issues
                        content = content
                            .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
                            .replace(/'/g, '"') // Replace single quotes with double quotes
                            .replace(/(\w+):/g, '"$1":') // Quote unquoted keys
                            .trim();
                        config = JSON.parse(content);
                        // If successful, save the fixed version
                        return [4 /*yield*/, fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8')];
                    case 3:
                        // If successful, save the fixed version
                        _b.sent();
                        return [2 /*return*/, config];
                    case 4:
                        _a = _b.sent();
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return ConfigurationErrorRecovery;
}());
exports.ConfigurationErrorRecovery = ConfigurationErrorRecovery;
/**
 * Utility function to create recovery instances with common options
 */
function createRecoveryUtilities(workingDirectory) {
    return {
        git: new GitErrorRecovery(workingDirectory, {
            fallbackToAllDocuments: true,
            maxCommitHistory: 1000
        }),
        document: new DocumentErrorRecovery({
            skipMalformedDocuments: true,
            useBasicParsing: true,
            requireMinimumContent: 50
        }),
        configuration: new ConfigurationErrorRecovery({
            useDefaults: true,
            createMissingConfig: false,
            validateOnLoad: true
        })
    };
}
