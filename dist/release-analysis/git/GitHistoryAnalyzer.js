"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHistoryAnalyzer = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
const ErrorHandler_1 = require("../errors/ErrorHandler");
const ErrorRecovery_1 = require("../errors/ErrorRecovery");
/**
 * Git history analyzer for determining release analysis scope
 */
class GitHistoryAnalyzer {
    constructor(workingDirectory = process.cwd()) {
        this.workingDirectory = workingDirectory;
    }
    /**
     * Find the last release tag in the repository
     * Requirement 5.1: Identify the last release tag automatically
     */
    async findLastRelease() {
        const context = {
            operation: 'findLastRelease',
            component: 'GitHistoryAnalyzer',
            timestamp: new Date()
        };
        const result = await (0, ErrorHandler_1.withErrorHandling)(async () => {
            if (!this.isGitRepository()) {
                throw new Error('Not a Git repository');
            }
            // Get all tags sorted by version (semantic versioning aware)
            const tagOutput = this.executeGitCommand('tag -l --sort=-version:refname');
            if (!tagOutput.trim()) {
                return null; // No tags found - this is not an error
            }
            const tags = tagOutput.trim().split('\n');
            // Find the first tag that looks like a release (semantic version pattern)
            for (const tagName of tags) {
                if (this.isReleaseTag(tagName)) {
                    const tagInfo = await this.getTagInfo(tagName);
                    if (tagInfo) {
                        return tagInfo;
                    }
                }
            }
            return null; // No release tags found
        }, context);
        if (result.success) {
            return result.data || null;
        }
        else {
            // Log error but return null to allow fallback behavior
            console.warn(`Git repository access failed: ${result.error?.message || 'Unknown error'}`);
            return null;
        }
    }
    /**
     * Get changes since a specific tag or commit
     * Requirements 5.2, 5.3: Include added/modified completion documents
     */
    async getChangesSince(reference) {
        const context = {
            operation: 'getChangesSince',
            component: 'GitHistoryAnalyzer',
            userAction: `Analyzing changes since ${reference}`,
            timestamp: new Date()
        };
        const gitRecovery = new ErrorRecovery_1.GitErrorRecovery(this.workingDirectory);
        const result = await (0, ErrorHandler_1.withErrorHandling)(async () => {
            const toCommit = this.executeGitCommand('rev-parse HEAD').trim();
            const fromCommit = this.executeGitCommand(`rev-parse ${reference}`).trim();
            // Get commit range
            const commits = await this.getCommitsSince(reference);
            // Get file changes
            const fileChanges = this.getFileChangesSince(reference);
            // Determine time range
            const fromDate = this.getCommitDate(fromCommit);
            const toDate = new Date();
            return {
                commits,
                addedFiles: fileChanges.added,
                modifiedFiles: fileChanges.modified,
                deletedFiles: fileChanges.deleted,
                timeRange: { from: fromDate, to: toDate }
            };
        }, context);
        if (result.success && result.data) {
            return result.data;
        }
        else {
            // Try to recover from invalid reference
            if (result.error?.message.includes('invalid') || result.error?.message.includes('unknown')) {
                const recoveryResult = await gitRecovery.recoverFromInvalidReference(reference);
                if (recoveryResult.success && recoveryResult.data?.validReference) {
                    console.warn(`Using recovered reference: ${recoveryResult.data.validReference}`);
                    return this.getChangesSince(recoveryResult.data.validReference);
                }
                else if (recoveryResult.success && recoveryResult.data?.analyzeAllDocuments) {
                    // Return empty changes to trigger fallback to all documents
                    return {
                        commits: [],
                        addedFiles: [],
                        modifiedFiles: [],
                        deletedFiles: [],
                        timeRange: { from: new Date(0), to: new Date() }
                    };
                }
            }
            throw new Error(`Failed to get changes since ${reference}: ${result.error?.message || 'Unknown error'}`);
        }
    }
    /**
     * Find completion documents from Git changes
     * Requirements 5.2, 5.3: Analyze completion documents that were added or modified
     */
    async findCompletionDocuments(changes) {
        const completionDocuments = [];
        const errors = [];
        // Combine added and modified files
        const relevantFiles = [...changes.addedFiles, ...changes.modifiedFiles];
        for (const filePath of relevantFiles) {
            if (this.isCompletionDocument(filePath)) {
                const context = {
                    operation: 'loadCompletionDocument',
                    component: 'GitHistoryAnalyzer',
                    filePath,
                    timestamp: new Date()
                };
                const result = await (0, ErrorHandler_1.withErrorHandling)(async () => {
                    return await this.loadCompletionDocument(filePath);
                }, context);
                if (result.success && result.data) {
                    completionDocuments.push(result.data);
                }
                else {
                    errors.push(`Could not load ${filePath}: ${result.error?.message || 'Unknown error'}`);
                    if (result.warnings) {
                        result.warnings.forEach(warning => console.warn(warning));
                    }
                }
            }
        }
        // Report summary of document loading
        if (errors.length > 0) {
            console.warn(`⚠️  Document loading issues (${errors.length}/${relevantFiles.length} files):`);
            errors.forEach(error => console.warn(`   ${error}`));
        }
        if (completionDocuments.length > 0) {
            console.log(`✅ Successfully loaded ${completionDocuments.length} completion documents`);
        }
        return completionDocuments;
    }
    /**
     * Validate analysis scope
     * Requirement 5.5: Provide fallback mechanisms and validation
     */
    validateAnalysisScope(scope) {
        const errors = [];
        const warnings = [];
        // Validate Git repository state
        if (!this.isGitRepository()) {
            errors.push('Not a Git repository or Git is not available');
        }
        // Validate commit references exist
        if (scope.fromCommit) {
            try {
                this.executeGitCommand(`rev-parse --verify ${scope.fromCommit}`);
            }
            catch {
                errors.push(`From commit ${scope.fromCommit} does not exist`);
            }
        }
        try {
            this.executeGitCommand(`rev-parse --verify ${scope.toCommit}`);
        }
        catch {
            errors.push(`To commit ${scope.toCommit} does not exist`);
        }
        // Validate completion documents exist and are accessible
        for (const doc of scope.completionDocuments) {
            const fullPath = (0, path_1.join)(this.workingDirectory, doc.path);
            if (!(0, fs_1.existsSync)(fullPath)) {
                errors.push(`Completion document not found: ${doc.path}`);
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
            errors,
            warnings
        };
    }
    /**
     * Check if current directory is a Git repository
     */
    isGitRepository() {
        try {
            this.executeGitCommand('rev-parse --git-dir');
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Check if a tag name looks like a release tag (semantic versioning)
     */
    isReleaseTag(tagName) {
        // Match semantic versioning patterns: v1.0.0, 1.0.0, v1.0.0-beta.1, etc.
        const semverPattern = /^v?(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9\-\.]+))?$/;
        return semverPattern.test(tagName);
    }
    /**
     * Get detailed information about a Git tag
     */
    async getTagInfo(tagName) {
        try {
            const commit = this.executeGitCommand(`rev-list -n 1 ${tagName}`).trim();
            const dateStr = this.executeGitCommand(`log -1 --format=%ci ${commit}`).trim();
            const date = new Date(dateStr);
            // Try to get tag message (for annotated tags)
            let message;
            try {
                message = this.executeGitCommand(`tag -l --format='%(contents)' ${tagName}`).trim();
                if (!message) {
                    message = undefined;
                }
            }
            catch {
                // Not an annotated tag, no message
                message = undefined;
            }
            return {
                name: tagName,
                commit,
                date,
                message
            };
        }
        catch {
            return null;
        }
    }
    /**
     * Get commits since a reference point
     */
    async getCommitsSince(reference) {
        const commits = [];
        try {
            const commitOutput = this.executeGitCommand(`log ${reference}..HEAD --format="%H|%h|%an|%ci|%s" --name-only`);
            if (!commitOutput.trim()) {
                return commits;
            }
            // Split by double newlines to separate commits
            const sections = commitOutput.split('\n\n').filter(section => section.trim());
            for (const section of sections) {
                const lines = section.trim().split('\n');
                if (lines.length === 0)
                    continue;
                // First line contains commit info
                const commitLine = lines[0];
                if (!commitLine.includes('|'))
                    continue;
                const parts = commitLine.split('|');
                if (parts.length < 5)
                    continue;
                const [hash, shortHash, author, dateStr, ...messageParts] = parts;
                const message = messageParts.join('|'); // Rejoin in case message contains |
                // Remaining lines are file names
                const files = lines.slice(1).filter(line => line.trim() && !line.includes('|'));
                commits.push({
                    hash: hash.trim(),
                    shortHash: shortHash.trim(),
                    author: author.trim(),
                    date: new Date(dateStr.trim()),
                    message: message.trim(),
                    files
                });
            }
        }
        catch (error) {
            // If log fails, return empty array
            console.warn(`Warning: Could not get commits since ${reference}: ${error instanceof Error ? error.message : String(error)}`);
        }
        return commits;
    }
    /**
     * Get file changes since a reference point
     */
    getFileChangesSince(reference) {
        try {
            const diffOutput = this.executeGitCommand(`diff --name-status ${reference}..HEAD`);
            const added = [];
            const modified = [];
            const deleted = [];
            const lines = diffOutput.trim().split('\n').filter(line => line.trim());
            for (const line of lines) {
                const [status, ...pathParts] = line.split('\t');
                const path = pathParts.join('\t'); // Handle paths with tabs
                switch (status[0]) {
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
            return { added, modified, deleted };
        }
        catch {
            return { added: [], modified: [], deleted: [] };
        }
    }
    /**
     * Get commit date for a specific commit
     */
    getCommitDate(commit) {
        try {
            const dateStr = this.executeGitCommand(`log -1 --format=%ci ${commit}`).trim();
            return new Date(dateStr);
        }
        catch {
            return new Date();
        }
    }
    /**
     * Check if a file path represents a completion document
     */
    isCompletionDocument(filePath) {
        // Look for completion documents in .kiro/specs/*/completion/ directories
        const completionPattern = /\.kiro\/specs\/[^\/]+\/completion\/.*\.md$/;
        // Also look for task completion documents and spec completion summaries
        const taskCompletionPattern = /task-\d+-completion\.md$/;
        const specCompletionPattern = /spec-completion-summary\.md$/;
        return completionPattern.test(filePath) ||
            taskCompletionPattern.test(filePath) ||
            specCompletionPattern.test(filePath);
    }
    /**
     * Load and parse a completion document
     */
    async loadCompletionDocument(filePath) {
        try {
            const fullPath = (0, path_1.join)(this.workingDirectory, filePath);
            if (!(0, fs_1.existsSync)(fullPath)) {
                return null;
            }
            const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
            const content = await fs.readFile(fullPath, 'utf-8');
            const stats = (0, fs_1.statSync)(fullPath);
            // Get the commit that last modified this file
            const gitCommit = this.getFileLastCommit(filePath);
            // Extract metadata from the document
            const metadata = this.extractDocumentMetadata(content, filePath);
            return {
                path: filePath,
                content,
                lastModified: stats.mtime,
                gitCommit,
                metadata
            };
        }
        catch {
            return null;
        }
    }
    /**
     * Get the commit that last modified a file
     */
    getFileLastCommit(filePath) {
        try {
            return this.executeGitCommand(`log -1 --format=%H -- "${filePath}"`).trim();
        }
        catch {
            return '';
        }
    }
    /**
     * Extract metadata from completion document content
     */
    extractDocumentMetadata(content, filePath) {
        const metadata = {
            title: '',
            type: 'other'
        };
        // Extract title from first heading
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) {
            metadata.title = titleMatch[1].trim();
        }
        // Extract metadata from document header
        const dateMatch = content.match(/\*\*Date\*\*:\s*(.+)$/m);
        if (dateMatch) {
            metadata.date = dateMatch[1].trim();
        }
        const taskMatch = content.match(/\*\*Task\*\*:\s*(.+)$/m);
        if (taskMatch) {
            metadata.task = taskMatch[1].trim();
        }
        const specMatch = content.match(/\*\*Spec\*\*:\s*(.+)$/m);
        if (specMatch) {
            metadata.spec = specMatch[1].trim();
        }
        const statusMatch = content.match(/\*\*Status\*\*:\s*(.+)$/m);
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
    }
    /**
     * Execute a Git command and return output
     */
    executeGitCommand(command) {
        try {
            return (0, child_process_1.execSync)(`git ${command}`, {
                cwd: this.workingDirectory,
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe']
            });
        }
        catch (error) {
            throw new Error(`Git command failed: git ${command}`);
        }
    }
}
exports.GitHistoryAnalyzer = GitHistoryAnalyzer;
//# sourceMappingURL=GitHistoryAnalyzer.js.map