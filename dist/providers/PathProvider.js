"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePathProvider = void 0;
/**
 * Abstract base class providing common path organization functionality
 */
class BasePathProvider {
    getFilePath(format, options = {}) {
        const { includeSubdirectories = true, customBaseDirectory, groupByCategory = false } = options;
        const baseDir = customBaseDirectory || this.getBaseDirectory();
        const fileName = this.getFileName(format);
        if (!includeSubdirectories) {
            return `${baseDir}/${fileName}`;
        }
        const subdirs = this.getDirectoryStructure();
        const subdirPath = subdirs.length > 0 ? `/${subdirs.join('/')}` : '';
        return `${baseDir}${subdirPath}/${fileName}`;
    }
    getDirectoryStructure() {
        // Default implementation returns empty array (flat structure)
        // Override in platform-specific implementations if needed
        return [];
    }
    validatePath(filePath) {
        const errors = [];
        // Basic validation
        if (!filePath || filePath.trim() === '') {
            errors.push('File path cannot be empty');
        }
        if (filePath.includes('..')) {
            errors.push('File path cannot contain parent directory references (..)');
        }
        if (filePath.startsWith('/')) {
            errors.push('File path should be relative, not absolute');
        }
        return {
            valid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined
        };
    }
    optimizeForBuildSystem(files) {
        // Default implementation - override in platform-specific implementations
        const primaryFile = files[0] || '';
        const buildConfig = this.getBuildSystemIntegration();
        return {
            primaryFile,
            supportingFiles: files.slice(1),
            importPath: this.getImportPath(primaryFile),
            optimizations: buildConfig.treeShakingHints || []
        };
    }
    getImportPath(filePath) {
        // Remove file extension and convert to import path
        return filePath.replace(/\.[^/.]+$/, '').replace(/\\/g, '/');
    }
    ensureExtension(fileName, extension) {
        if (!fileName.endsWith(extension)) {
            return `${fileName}${extension}`;
        }
        return fileName;
    }
}
exports.BasePathProvider = BasePathProvider;
//# sourceMappingURL=PathProvider.js.map