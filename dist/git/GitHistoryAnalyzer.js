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
exports.GitHistoryAnalyzer = void 0;
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var path_1 = require("path");
var ErrorHandler_1 = require("../errors/ErrorHandler");
var ErrorRecovery_1 = require("../errors/ErrorRecovery");
/**
 * Git history analyzer for determining release analysis scope
 */
var GitHistoryAnalyzer = /** @class */ (function () {
    function GitHistoryAnalyzer(workingDirectory) {
        if (workingDirectory === void 0) { workingDirectory = process.cwd(); }
        this.workingDirectory = workingDirectory;
    }
    /**
     * Find the last release tag in the repository
     * Requirement 5.1: Identify the last release tag automatically
     */
    GitHistoryAnalyzer.prototype.findLastRelease = function () {
        return __awaiter(this, void 0, void 0, function () {
            var context, result;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        context = {
                            operation: 'findLastRelease',
                            component: 'GitHistoryAnalyzer',
                            timestamp: new Date()
                        };
                        return [4 /*yield*/, (0, ErrorHandler_1.withErrorHandling)(function () { return __awaiter(_this, void 0, void 0, function () {
                                var tagOutput, tags, _i, tags_1, tagName, tagInfo;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!this.isGitRepository()) {
                                                throw new Error('Not a Git repository');
                                            }
                                            tagOutput = this.executeGitCommand('tag -l --sort=-version:refname');
                                            if (!tagOutput.trim()) {
                                                return [2 /*return*/, null]; // No tags found - this is not an error
                                            }
                                            tags = tagOutput.trim().split('\n');
                                            _i = 0, tags_1 = tags;
                                            _a.label = 1;
                                        case 1:
                                            if (!(_i < tags_1.length)) return [3 /*break*/, 4];
                                            tagName = tags_1[_i];
                                            if (!this.isReleaseTag(tagName)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, this.getTagInfo(tagName)];
                                        case 2:
                                            tagInfo = _a.sent();
                                            if (tagInfo) {
                                                return [2 /*return*/, tagInfo];
                                            }
                                            _a.label = 3;
                                        case 3:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 4: return [2 /*return*/, null]; // No release tags found
                                    }
                                });
                            }); }, context)];
                    case 1:
                        result = _b.sent();
                        if (result.success) {
                            return [2 /*return*/, result.data || null];
                        }
                        else {
                            // Log error but return null to allow fallback behavior
                            console.warn("Git repository access failed: ".concat(((_a = result.error) === null || _a === void 0 ? void 0 : _a.message) || 'Unknown error'));
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get changes since a specific tag or commit
     * Requirements 5.2, 5.3: Include added/modified completion documents
     */
    GitHistoryAnalyzer.prototype.getChangesSince = function (reference) {
        return __awaiter(this, void 0, void 0, function () {
            var context, gitRecovery, result, recoveryResult;
            var _this = this;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        context = {
                            operation: 'getChangesSince',
                            component: 'GitHistoryAnalyzer',
                            userAction: "Analyzing changes since ".concat(reference),
                            timestamp: new Date()
                        };
                        gitRecovery = new ErrorRecovery_1.GitErrorRecovery(this.workingDirectory);
                        return [4 /*yield*/, (0, ErrorHandler_1.withErrorHandling)(function () { return __awaiter(_this, void 0, void 0, function () {
                                var toCommit, fromCommit, commits, fileChanges, fromDate, toDate;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            toCommit = this.executeGitCommand('rev-parse HEAD').trim();
                                            fromCommit = this.executeGitCommand("rev-parse ".concat(reference)).trim();
                                            return [4 /*yield*/, this.getCommitsSince(reference)];
                                        case 1:
                                            commits = _a.sent();
                                            fileChanges = this.getFileChangesSince(reference);
                                            fromDate = this.getCommitDate(fromCommit);
                                            toDate = new Date();
                                            return [2 /*return*/, {
                                                    commits: commits,
                                                    addedFiles: fileChanges.added,
                                                    modifiedFiles: fileChanges.modified,
                                                    deletedFiles: fileChanges.deleted,
                                                    timeRange: { from: fromDate, to: toDate }
                                                }];
                                    }
                                });
                            }); }, context)];
                    case 1:
                        result = _f.sent();
                        if (!result.success) return [3 /*break*/, 2];
                        return [2 /*return*/, result.data];
                    case 2:
                        if (!(((_a = result.error) === null || _a === void 0 ? void 0 : _a.message.includes('invalid')) || ((_b = result.error) === null || _b === void 0 ? void 0 : _b.message.includes('unknown')))) return [3 /*break*/, 4];
                        return [4 /*yield*/, gitRecovery.recoverFromInvalidReference(reference)];
                    case 3:
                        recoveryResult = _f.sent();
                        if (recoveryResult.success && ((_c = recoveryResult.data) === null || _c === void 0 ? void 0 : _c.validReference)) {
                            console.warn("Using recovered reference: ".concat(recoveryResult.data.validReference));
                            return [2 /*return*/, this.getChangesSince(recoveryResult.data.validReference)];
                        }
                        else if (recoveryResult.success && ((_d = recoveryResult.data) === null || _d === void 0 ? void 0 : _d.analyzeAllDocuments)) {
                            // Return empty changes to trigger fallback to all documents
                            return [2 /*return*/, {
                                    commits: [],
                                    addedFiles: [],
                                    modifiedFiles: [],
                                    deletedFiles: [],
                                    timeRange: { from: new Date(0), to: new Date() }
                                }];
                        }
                        _f.label = 4;
                    case 4: throw new Error("Failed to get changes since ".concat(reference, ": ").concat(((_e = result.error) === null || _e === void 0 ? void 0 : _e.message) || 'Unknown error'));
                }
            });
        });
    };
    /**
     * Find completion documents from Git changes
     * Requirements 5.2, 5.3: Analyze completion documents that were added or modified
     */
    GitHistoryAnalyzer.prototype.findCompletionDocuments = function (changes) {
        return __awaiter(this, void 0, void 0, function () {
            var completionDocuments, errors, relevantFiles, _loop_1, this_1, _i, relevantFiles_1, filePath;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        completionDocuments = [];
                        errors = [];
                        relevantFiles = __spreadArray(__spreadArray([], changes.addedFiles, true), changes.modifiedFiles, true);
                        _loop_1 = function (filePath) {
                            var context, result;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        if (!this_1.isCompletionDocument(filePath)) return [3 /*break*/, 2];
                                        context = {
                                            operation: 'loadCompletionDocument',
                                            component: 'GitHistoryAnalyzer',
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
                                        result = _c.sent();
                                        if (result.success && result.data) {
                                            completionDocuments.push(result.data);
                                        }
                                        else {
                                            errors.push("Could not load ".concat(filePath, ": ").concat(((_a = result.error) === null || _a === void 0 ? void 0 : _a.message) || 'Unknown error'));
                                            if (result.warnings) {
                                                result.warnings.forEach(function (warning) { return console.warn(warning); });
                                            }
                                        }
                                        _c.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, relevantFiles_1 = relevantFiles;
                        _b.label = 1;
                    case 1:
                        if (!(_i < relevantFiles_1.length)) return [3 /*break*/, 4];
                        filePath = relevantFiles_1[_i];
                        return [5 /*yield**/, _loop_1(filePath)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        // Report summary of document loading
                        if (errors.length > 0) {
                            console.warn("\u26A0\uFE0F  Document loading issues (".concat(errors.length, "/").concat(relevantFiles.length, " files):"));
                            errors.forEach(function (error) { return console.warn("   ".concat(error)); });
                        }
                        if (completionDocuments.length > 0) {
                            console.log("\u2705 Successfully loaded ".concat(completionDocuments.length, " completion documents"));
                        }
                        return [2 /*return*/, completionDocuments];
                }
            });
        });
    };
    /**
     * Validate analysis scope
     * Requirement 5.5: Provide fallback mechanisms and validation
     */
    GitHistoryAnalyzer.prototype.validateAnalysisScope = function (scope) {
        var errors = [];
        var warnings = [];
        // Validate Git repository state
        if (!this.isGitRepository()) {
            errors.push('Not a Git repository or Git is not available');
        }
        // Validate commit references exist
        if (scope.fromCommit) {
            try {
                this.executeGitCommand("rev-parse --verify ".concat(scope.fromCommit));
            }
            catch (_a) {
                errors.push("From commit ".concat(scope.fromCommit, " does not exist"));
            }
        }
        try {
            this.executeGitCommand("rev-parse --verify ".concat(scope.toCommit));
        }
        catch (_b) {
            errors.push("To commit ".concat(scope.toCommit, " does not exist"));
        }
        // Validate completion documents exist and are accessible
        for (var _i = 0, _c = scope.completionDocuments; _i < _c.length; _i++) {
            var doc = _c[_i];
            var fullPath = (0, path_1.join)(this.workingDirectory, doc.path);
            if (!(0, fs_1.existsSync)(fullPath)) {
                errors.push("Completion document not found: ".concat(doc.path));
            }
        }
        // Warnings for potential issues
        if (scope.completionDocuments.length === 0) {
            warnings.push('No completion documents found in analysis scope');
        }
        if (scope.fromTag && !scope.fromCommit) {
            warnings.push('Analysis scope uses tag reference without commit validation');
        }
        return {
            isValid: errors.length === 0,
            errors: errors,
            warnings: warnings
        };
    };
    /**
     * Check if current directory is a Git repository
     */
    GitHistoryAnalyzer.prototype.isGitRepository = function () {
        try {
            this.executeGitCommand('rev-parse --git-dir');
            return true;
        }
        catch (_a) {
            return false;
        }
    };
    /**
     * Check if a tag name looks like a release tag (semantic versioning)
     */
    GitHistoryAnalyzer.prototype.isReleaseTag = function (tagName) {
        // Match semantic versioning patterns: v1.0.0, 1.0.0, v1.0.0-beta.1, etc.
        var semverPattern = /^v?(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9\-\.]+))?$/;
        return semverPattern.test(tagName);
    };
    /**
     * Get detailed information about a Git tag
     */
    GitHistoryAnalyzer.prototype.getTagInfo = function (tagName) {
        return __awaiter(this, void 0, void 0, function () {
            var commit, dateStr, date, message;
            return __generator(this, function (_a) {
                try {
                    commit = this.executeGitCommand("rev-list -n 1 ".concat(tagName)).trim();
                    dateStr = this.executeGitCommand("log -1 --format=%ci ".concat(commit)).trim();
                    date = new Date(dateStr);
                    message = void 0;
                    try {
                        message = this.executeGitCommand("tag -l --format='%(contents)' ".concat(tagName)).trim();
                        if (!message) {
                            message = undefined;
                        }
                    }
                    catch (_b) {
                        // Not an annotated tag, no message
                        message = undefined;
                    }
                    return [2 /*return*/, {
                            name: tagName,
                            commit: commit,
                            date: date,
                            message: message
                        }];
                }
                catch (_c) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Get commits since a reference point
     */
    GitHistoryAnalyzer.prototype.getCommitsSince = function (reference) {
        return __awaiter(this, void 0, void 0, function () {
            var commits, commitOutput, sections, _i, sections_1, section, lines, commitLine, parts, hash, shortHash, author, dateStr, messageParts, message, files;
            return __generator(this, function (_a) {
                commits = [];
                try {
                    commitOutput = this.executeGitCommand("log ".concat(reference, "..HEAD --format=\"%H|%h|%an|%ci|%s\" --name-only"));
                    if (!commitOutput.trim()) {
                        return [2 /*return*/, commits];
                    }
                    sections = commitOutput.split('\n\n').filter(function (section) { return section.trim(); });
                    for (_i = 0, sections_1 = sections; _i < sections_1.length; _i++) {
                        section = sections_1[_i];
                        lines = section.trim().split('\n');
                        if (lines.length === 0)
                            continue;
                        commitLine = lines[0];
                        if (!commitLine.includes('|'))
                            continue;
                        parts = commitLine.split('|');
                        if (parts.length < 5)
                            continue;
                        hash = parts[0], shortHash = parts[1], author = parts[2], dateStr = parts[3], messageParts = parts.slice(4);
                        message = messageParts.join('|');
                        files = lines.slice(1).filter(function (line) { return line.trim() && !line.includes('|'); });
                        commits.push({
                            hash: hash.trim(),
                            shortHash: shortHash.trim(),
                            author: author.trim(),
                            date: new Date(dateStr.trim()),
                            message: message.trim(),
                            files: files
                        });
                    }
                }
                catch (error) {
                    // If log fails, return empty array
                    console.warn("Warning: Could not get commits since ".concat(reference, ": ").concat(error instanceof Error ? error.message : String(error)));
                }
                return [2 /*return*/, commits];
            });
        });
    };
    /**
     * Get file changes since a reference point
     */
    GitHistoryAnalyzer.prototype.getFileChangesSince = function (reference) {
        try {
            var diffOutput = this.executeGitCommand("diff --name-status ".concat(reference, "..HEAD"));
            var added = [];
            var modified = [];
            var deleted = [];
            var lines = diffOutput.trim().split('\n').filter(function (line) { return line.trim(); });
            for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                var line = lines_1[_i];
                var _a = line.split('\t'), status_1 = _a[0], pathParts = _a.slice(1);
                var path = pathParts.join('\t'); // Handle paths with tabs
                switch (status_1[0]) {
                    case 'A':
                        added.push(path);
                        break;
                    case 'M':
                        modified.push(path);
                        break;
                    case 'D':
                        deleted.push(path);
                        break;
                    case 'R':
                    case 'C':
                        // Renamed or copied files - treat as modified
                        modified.push(path);
                        break;
                }
            }
            return { added: added, modified: modified, deleted: deleted };
        }
        catch (_b) {
            return { added: [], modified: [], deleted: [] };
        }
    };
    /**
     * Get commit date for a specific commit
     */
    GitHistoryAnalyzer.prototype.getCommitDate = function (commit) {
        try {
            var dateStr = this.executeGitCommand("log -1 --format=%ci ".concat(commit)).trim();
            return new Date(dateStr);
        }
        catch (_a) {
            return new Date();
        }
    };
    /**
     * Check if a file path represents a completion document
     */
    GitHistoryAnalyzer.prototype.isCompletionDocument = function (filePath) {
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
    GitHistoryAnalyzer.prototype.loadCompletionDocument = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var fullPath, fs, content, stats, gitCommit, metadata, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        fullPath = (0, path_1.join)(this.workingDirectory, filePath);
                        if (!(0, fs_1.existsSync)(fullPath)) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('fs/promises'); })];
                    case 1:
                        fs = _b.sent();
                        return [4 /*yield*/, fs.readFile(fullPath, 'utf-8')];
                    case 2:
                        content = _b.sent();
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
                        _a = _b.sent();
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the commit that last modified a file
     */
    GitHistoryAnalyzer.prototype.getFileLastCommit = function (filePath) {
        try {
            return this.executeGitCommand("log -1 --format=%H -- \"".concat(filePath, "\"")).trim();
        }
        catch (_a) {
            return '';
        }
    };
    /**
     * Extract metadata from completion document content
     */
    GitHistoryAnalyzer.prototype.extractDocumentMetadata = function (content, filePath) {
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
     * Execute a Git command and return output
     */
    GitHistoryAnalyzer.prototype.executeGitCommand = function (command) {
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
    return GitHistoryAnalyzer;
}());
exports.GitHistoryAnalyzer = GitHistoryAnalyzer;
