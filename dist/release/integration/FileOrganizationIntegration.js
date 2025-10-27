"use strict";
/**
 * File Organization Integration Implementation
 *
 * Coordinates with file organization system to ensure release artifacts
 * are properly placed and cross-references maintained
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileOrganizationManager = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
class FileOrganizationManager {
    constructor(projectRoot = process.cwd()) {
        this.projectRoot = projectRoot;
        this.organizationHookPath = (0, path_1.join)(projectRoot, '.kiro/hooks/organize-by-metadata.sh');
    }
    /**
     * Coordinate with file organization during release
     */
    async coordinateFileOrganization(releaseArtifacts) {
        const result = {
            success: true,
            organizedFiles: [],
            updatedReferences: [],
            errors: []
        };
        try {
            // Filter artifacts that need organization
            const artifactsNeedingOrganization = releaseArtifacts.filter(artifact => artifact.targetLocation && artifact.organizationMetadata);
            if (artifactsNeedingOrganization.length === 0) {
                return result; // No organization needed
            }
            // Organize each artifact
            for (const artifact of artifactsNeedingOrganization) {
                try {
                    const organized = await this.organizeArtifact(artifact);
                    result.organizedFiles.push(organized);
                    // Update cross-references for this file
                    const crossRefResult = await this.updateCrossReferencesForFile(organized);
                    result.updatedReferences.push(...crossRefResult.updatedReferences);
                    result.errors.push(...crossRefResult.errors.map(err => ({
                        code: err.code,
                        message: err.message,
                        file: err.sourceFile,
                        details: err.details
                    })));
                }
                catch (error) {
                    result.errors.push({
                        code: 'ORGANIZATION_FAILED',
                        message: `Failed to organize ${artifact.path}: ${error instanceof Error ? error.message : String(error)}`,
                        file: artifact.path
                    });
                    result.success = false;
                }
            }
            return result;
        }
        catch (error) {
            result.success = false;
            result.errors.push({
                code: 'COORDINATION_FAILED',
                message: `File organization coordination failed: ${error instanceof Error ? error.message : String(error)}`,
                file: 'unknown'
            });
            return result;
        }
    }
    /**
     * Validate file organization for release readiness
     */
    async validateOrganizationForRelease(specPath) {
        const errors = [];
        const warnings = [];
        try {
            // Check if spec directory exists and is properly organized
            const specExists = await this.directoryExists(specPath);
            if (!specExists) {
                errors.push({
                    code: 'SPEC_DIRECTORY_MISSING',
                    message: `Spec directory not found: ${specPath}`,
                    severity: 'error'
                });
            }
            else {
                // Check for required spec files
                const requiredFiles = ['requirements.md', 'design.md', 'tasks.md'];
                for (const file of requiredFiles) {
                    const filePath = (0, path_1.join)(specPath, file);
                    if (!(await this.fileExists(filePath))) {
                        errors.push({
                            code: 'REQUIRED_FILE_MISSING',
                            message: `Required spec file missing: ${file}`,
                            severity: 'error'
                        });
                    }
                }
                // Check completion directory organization
                const completionDir = (0, path_1.join)(specPath, 'completion');
                const completionExists = await this.directoryExists(completionDir);
                if (!completionExists) {
                    warnings.push({
                        code: 'COMPLETION_DIRECTORY_MISSING',
                        message: 'Completion directory not found - may indicate incomplete spec'
                    });
                }
                else {
                    // Validate completion documents have proper metadata
                    await this.validateCompletionDocuments(completionDir, warnings, errors);
                }
            }
            // Check for unorganized files in root that should be organized
            await this.checkForUnorganizedFiles(warnings);
            return {
                valid: errors.length === 0,
                errors,
                warnings,
                validatedAt: new Date(),
                context: 'file-organization'
            };
        }
        catch (error) {
            errors.push({
                code: 'VALIDATION_ERROR',
                message: `Organization validation failed: ${error instanceof Error ? error.message : String(error)}`,
                severity: 'error'
            });
            return {
                valid: false,
                errors,
                warnings,
                validatedAt: new Date(),
                context: 'file-organization'
            };
        }
    }
    /**
     * Update cross-references after release artifact creation
     */
    async updateCrossReferences(artifacts) {
        const result = {
            success: true,
            updatedReferences: [],
            errors: []
        };
        try {
            // Find all markdown files that might contain references
            const markdownFiles = await this.findMarkdownFiles();
            // For each artifact, update references in all markdown files
            for (const artifact of artifacts) {
                for (const mdFile of markdownFiles) {
                    try {
                        const references = await this.updateReferencesInFile(mdFile, artifact);
                        result.updatedReferences.push(...references);
                    }
                    catch (error) {
                        result.errors.push({
                            code: 'REFERENCE_UPDATE_FAILED',
                            message: `Failed to update references in ${mdFile}: ${error instanceof Error ? error.message : String(error)}`,
                            sourceFile: mdFile,
                            targetFile: artifact.path
                        });
                    }
                }
            }
            result.success = result.errors.length === 0;
            return result;
        }
        catch (error) {
            result.success = false;
            result.errors.push({
                code: 'CROSS_REFERENCE_FAILED',
                message: `Cross-reference update failed: ${error instanceof Error ? error.message : String(error)}`,
                sourceFile: 'unknown',
                targetFile: 'unknown'
            });
            return result;
        }
    }
    /**
     * Ensure completion documents are properly organized
     */
    async organizeCompletionDocuments(completionDocs) {
        const result = {
            success: true,
            organizedFiles: [],
            updatedReferences: [],
            errors: []
        };
        try {
            for (const doc of completionDocs) {
                // Determine target location based on document type and metadata
                const targetLocation = this.determineCompletionDocumentLocation(doc);
                if (targetLocation !== doc.path) {
                    try {
                        // Move the document
                        await this.ensureDirectoryExists((0, path_1.dirname)(targetLocation));
                        await fs_1.promises.rename(doc.path, targetLocation);
                        const organizedFile = {
                            originalPath: doc.path,
                            newPath: targetLocation,
                            metadata: doc.metadata,
                            organizedAt: new Date()
                        };
                        result.organizedFiles.push(organizedFile);
                        // Update cross-references
                        const crossRefResult = await this.updateCrossReferencesForFile(organizedFile);
                        result.updatedReferences.push(...crossRefResult.updatedReferences);
                        result.errors.push(...crossRefResult.errors.map(err => ({
                            code: err.code,
                            message: err.message,
                            file: err.sourceFile,
                            details: err.details
                        })));
                    }
                    catch (error) {
                        result.errors.push({
                            code: 'DOCUMENT_ORGANIZATION_FAILED',
                            message: `Failed to organize completion document ${doc.path}: ${error instanceof Error ? error.message : String(error)}`,
                            file: doc.path
                        });
                        result.success = false;
                    }
                }
            }
            return result;
        }
        catch (error) {
            result.success = false;
            result.errors.push({
                code: 'COMPLETION_ORGANIZATION_FAILED',
                message: `Completion document organization failed: ${error instanceof Error ? error.message : String(error)}`,
                file: 'unknown'
            });
            return result;
        }
    }
    // Private helper methods
    async fileExists(path) {
        try {
            await fs_1.promises.access(path);
            return true;
        }
        catch {
            return false;
        }
    }
    async directoryExists(path) {
        try {
            const stat = await fs_1.promises.stat(path);
            return stat.isDirectory();
        }
        catch {
            return false;
        }
    }
    async ensureDirectoryExists(dirPath) {
        try {
            await fs_1.promises.mkdir(dirPath, { recursive: true });
        }
        catch (error) {
            // Ignore error if directory already exists
            if (error instanceof Error && 'code' in error && error.code !== 'EEXIST') {
                throw error;
            }
        }
    }
    async organizeArtifact(artifact) {
        const targetPath = artifact.targetLocation;
        // Ensure target directory exists
        await this.ensureDirectoryExists((0, path_1.dirname)(targetPath));
        // Move the file
        await fs_1.promises.rename(artifact.path, targetPath);
        return {
            originalPath: artifact.path,
            newPath: targetPath,
            metadata: artifact.organizationMetadata,
            organizedAt: new Date()
        };
    }
    async updateCrossReferencesForFile(organizedFile) {
        const result = {
            success: true,
            updatedReferences: [],
            errors: []
        };
        try {
            // Find all markdown files that might reference this file
            const markdownFiles = await this.findMarkdownFiles();
            for (const mdFile of markdownFiles) {
                try {
                    const content = await fs_1.promises.readFile(mdFile, 'utf-8');
                    const lines = content.split('\n');
                    let updated = false;
                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i];
                        // Look for references to the original path
                        if (line.includes(organizedFile.originalPath)) {
                            const updatedLine = line.replace(new RegExp(organizedFile.originalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), organizedFile.newPath);
                            if (updatedLine !== line) {
                                lines[i] = updatedLine;
                                updated = true;
                                result.updatedReferences.push({
                                    sourceFile: mdFile,
                                    targetFile: organizedFile.newPath,
                                    originalReference: line.trim(),
                                    updatedReference: updatedLine.trim(),
                                    lineNumber: i + 1
                                });
                            }
                        }
                    }
                    if (updated) {
                        await fs_1.promises.writeFile(mdFile, lines.join('\n'));
                    }
                }
                catch (error) {
                    result.errors.push({
                        code: 'REFERENCE_UPDATE_FAILED',
                        message: `Failed to update references in ${mdFile}: ${error instanceof Error ? error.message : String(error)}`,
                        sourceFile: mdFile,
                        targetFile: organizedFile.newPath
                    });
                }
            }
            result.success = result.errors.length === 0;
            return result;
        }
        catch (error) {
            result.success = false;
            result.errors.push({
                code: 'CROSS_REFERENCE_UPDATE_FAILED',
                message: `Cross-reference update failed: ${error instanceof Error ? error.message : String(error)}`,
                sourceFile: 'unknown',
                targetFile: organizedFile.newPath
            });
            return result;
        }
    }
    async findMarkdownFiles() {
        const markdownFiles = [];
        const scanDirectory = async (dir) => {
            try {
                const entries = await fs_1.promises.readdir(dir, { withFileTypes: true });
                for (const entry of entries) {
                    const fullPath = (0, path_1.join)(dir, entry.name);
                    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
                        await scanDirectory(fullPath);
                    }
                    else if (entry.isFile() && entry.name.endsWith('.md')) {
                        markdownFiles.push(fullPath);
                    }
                }
            }
            catch (error) {
                // Ignore directories we can't read
            }
        };
        await scanDirectory(this.projectRoot);
        return markdownFiles;
    }
    async updateReferencesInFile(filePath, artifact) {
        const references = [];
        try {
            const content = await fs_1.promises.readFile(filePath, 'utf-8');
            const lines = content.split('\n');
            let updated = false;
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                // Look for references to the artifact's original path
                if (line.includes(artifact.path) && artifact.targetLocation) {
                    const updatedLine = line.replace(new RegExp(artifact.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), artifact.targetLocation);
                    if (updatedLine !== line) {
                        lines[i] = updatedLine;
                        updated = true;
                        references.push({
                            sourceFile: filePath,
                            targetFile: artifact.targetLocation,
                            originalReference: line.trim(),
                            updatedReference: updatedLine.trim(),
                            lineNumber: i + 1
                        });
                    }
                }
            }
            if (updated) {
                await fs_1.promises.writeFile(filePath, lines.join('\n'));
            }
        }
        catch (error) {
            // File might not exist or be readable, which is okay
        }
        return references;
    }
    determineCompletionDocumentLocation(doc) {
        const specName = doc.spec;
        switch (doc.type) {
            case 'task-completion':
                return (0, path_1.join)(this.projectRoot, '.kiro/specs', specName, 'completion', `task-${doc.task}-completion.md`);
            case 'spec-completion':
                return (0, path_1.join)(this.projectRoot, '.kiro/specs', specName, 'completion', 'spec-completion-summary.md');
            default:
                return doc.path; // Keep original location if type is unknown
        }
    }
    async validateCompletionDocuments(completionDir, warnings, errors) {
        try {
            const files = await fs_1.promises.readdir(completionDir);
            const completionFiles = files.filter(file => file.endsWith('.md'));
            for (const file of completionFiles) {
                const filePath = (0, path_1.join)(completionDir, file);
                try {
                    const content = await fs_1.promises.readFile(filePath, 'utf-8');
                    // Check for organization metadata
                    if (!content.includes('**Organization**:')) {
                        warnings.push({
                            code: 'MISSING_ORGANIZATION_METADATA',
                            message: `Completion document ${file} missing organization metadata`
                        });
                    }
                    // Check for proper completion document structure
                    if (!content.includes('# Task') && !content.includes('# Spec')) {
                        warnings.push({
                            code: 'INVALID_COMPLETION_STRUCTURE',
                            message: `Completion document ${file} may have invalid structure`
                        });
                    }
                }
                catch (error) {
                    errors.push({
                        code: 'COMPLETION_READ_ERROR',
                        message: `Failed to read completion document ${file}: ${error instanceof Error ? error.message : String(error)}`,
                        severity: 'warning'
                    });
                }
            }
        }
        catch (error) {
            errors.push({
                code: 'COMPLETION_VALIDATION_ERROR',
                message: `Failed to validate completion documents: ${error instanceof Error ? error.message : String(error)}`,
                severity: 'error'
            });
        }
    }
    async checkForUnorganizedFiles(warnings) {
        try {
            const rootFiles = await fs_1.promises.readdir(this.projectRoot);
            const markdownFiles = rootFiles.filter(file => file.endsWith('.md') && !file.startsWith('.'));
            for (const file of markdownFiles) {
                const filePath = (0, path_1.join)(this.projectRoot, file);
                try {
                    const content = await fs_1.promises.readFile(filePath, 'utf-8');
                    // Check if file has organization metadata
                    if (content.includes('**Organization**:')) {
                        const orgMatch = content.match(/\*\*Organization\*\*:\s*([^\n]+)/);
                        if (orgMatch) {
                            const orgType = orgMatch[1].trim();
                            // Check if file should be organized based on metadata
                            if (orgType !== 'working-document' && orgType !== 'process-standard') {
                                warnings.push({
                                    code: 'UNORGANIZED_FILE',
                                    message: `File ${file} has organization metadata (${orgType}) but is not organized`
                                });
                            }
                        }
                    }
                }
                catch (error) {
                    // Ignore files we can't read
                }
            }
        }
        catch (error) {
            // Ignore if we can't read root directory
        }
    }
}
exports.FileOrganizationManager = FileOrganizationManager;
//# sourceMappingURL=FileOrganizationIntegration.js.map