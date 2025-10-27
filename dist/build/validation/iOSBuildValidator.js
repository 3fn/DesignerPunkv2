"use strict";
/**
 * iOS Build Validator
 *
 * Validates iOS build output including:
 * - Package.swift manifest syntax and structure
 * - Swift constants compilation validation
 * - Swift Package importability
 * - iOS-specific optimizations verification
 *
 * Requirements: 2.1, 2.7, 5.1
 */
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
exports.iOSBuildValidator = void 0;
const fsSync = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * iOS Build Validator
 *
 * Validates iOS build output for correctness and completeness
 */
class iOSBuildValidator {
    /**
     * Validate iOS build output
     */
    async validate(buildResult) {
        const errors = [];
        const warnings = [];
        // Validate build was successful
        if (!buildResult.success) {
            errors.push({
                code: 'IOS_BUILD_FAILED',
                message: 'iOS build failed, cannot validate output',
                severity: 'error',
                category: 'build',
                platform: 'ios',
                context: { buildResult },
                suggestions: ['Fix build errors before validating output'],
                documentation: []
            });
            return {
                valid: false,
                packageManifestValid: false,
                swiftConstantsValid: false,
                packageStructureValid: false,
                optimizationsValid: false,
                errors,
                warnings,
                details: {}
            };
        }
        // Validate Package.swift manifest
        const manifestResult = await this.validatePackageManifestFile(buildResult.packagePath, errors, warnings);
        // Validate Swift constants
        const constantsResult = await this.validateSwiftConstants(buildResult.packagePath, errors, warnings);
        // Validate package structure
        const structureResult = await this.validatePackageStructureFiles(buildResult.packagePath, errors, warnings);
        // Validate iOS-specific optimizations
        const optimizationsResult = await this.validateOptimizations(buildResult.packagePath, errors, warnings);
        const valid = manifestResult && constantsResult && structureResult && optimizationsResult && errors.length === 0;
        return {
            valid,
            packageManifestValid: manifestResult,
            swiftConstantsValid: constantsResult,
            packageStructureValid: structureResult,
            optimizationsValid: optimizationsResult,
            errors,
            warnings,
            details: {
                packageManifest: 'Package.swift validated',
                swiftFiles: await this.listSwiftFiles(buildResult.packagePath),
                optimizations: ['SwiftUI enabled', 'SF Symbols support']
            }
        };
    }
    /**
     * Validate Package.swift manifest file
     */
    async validatePackageManifestFile(packagePath, errors, warnings) {
        try {
            const manifestPath = path.join(packagePath, 'Package.swift');
            // Check file exists
            try {
                fsSync.accessSync(manifestPath);
            }
            catch {
                errors.push({
                    code: 'PACKAGE_MANIFEST_MISSING',
                    message: 'Package.swift file not found',
                    severity: 'error',
                    category: 'build',
                    platform: 'ios',
                    context: { packagePath },
                    suggestions: ['Ensure iOS builder generates Package.swift'],
                    documentation: []
                });
                return false;
            }
            // Read and validate content
            const content = fsSync.readFileSync(manifestPath, 'utf-8');
            const result = this.validatePackageManifest(content);
            errors.push(...result.errors.map(msg => ({
                code: 'PACKAGE_MANIFEST_INVALID',
                message: msg,
                severity: 'error',
                category: 'build',
                platform: 'ios',
                context: { manifestPath },
                suggestions: ['Fix Package.swift syntax'],
                documentation: []
            })));
            warnings.push(...result.warnings);
            return result.valid;
        }
        catch (error) {
            errors.push({
                code: 'PACKAGE_MANIFEST_VALIDATION_ERROR',
                message: `Failed to validate Package.swift: ${error instanceof Error ? error.message : 'Unknown error'}`,
                severity: 'error',
                category: 'validation',
                platform: 'ios',
                context: { error },
                suggestions: ['Check file permissions and content'],
                documentation: []
            });
            return false;
        }
    }
    /**
     * Validate Package.swift manifest syntax
     *
     * Validates that Package.swift has:
     * - swift-tools-version declaration
     * - import PackageDescription
     * - Package definition with required fields
     *
     * Requirements: 2.1, 2.7, 5.1
     */
    validatePackageManifest(manifest) {
        const errors = [];
        const warnings = [];
        // Check for swift-tools-version
        if (!manifest.includes('swift-tools-version')) {
            errors.push('Missing swift-tools-version declaration');
        }
        // Check for import PackageDescription
        if (!manifest.includes('import PackageDescription')) {
            errors.push('Missing import PackageDescription');
        }
        // Check for Package definition
        if (!manifest.includes('let package = Package(')) {
            errors.push('Missing Package definition');
        }
        // Check for required Package fields
        if (!manifest.includes('name:')) {
            errors.push('Missing package name');
        }
        if (!manifest.includes('platforms:')) {
            warnings.push('Missing platforms specification');
        }
        if (!manifest.includes('products:')) {
            errors.push('Missing products specification');
        }
        if (!manifest.includes('targets:')) {
            errors.push('Missing targets specification');
        }
        // Check for balanced parentheses
        const openParens = (manifest.match(/\(/g) || []).length;
        const closeParens = (manifest.match(/\)/g) || []).length;
        if (openParens !== closeParens) {
            errors.push(`Unbalanced parentheses: ${openParens} open, ${closeParens} close`);
        }
        // Check for balanced brackets
        const openBrackets = (manifest.match(/\[/g) || []).length;
        const closeBrackets = (manifest.match(/\]/g) || []).length;
        if (openBrackets !== closeBrackets) {
            errors.push(`Unbalanced brackets: ${openBrackets} open, ${closeBrackets} close`);
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
    /**
     * Validate Swift constants compile correctly
     */
    async validateSwiftConstants(packagePath, errors, warnings) {
        try {
            const sourcesPath = path.join(packagePath, 'Sources');
            // Check Sources directory exists
            try {
                fsSync.accessSync(sourcesPath);
            }
            catch {
                errors.push({
                    code: 'SOURCES_DIR_MISSING',
                    message: 'Sources directory not found',
                    severity: 'error',
                    category: 'build',
                    platform: 'ios',
                    context: { packagePath },
                    suggestions: ['Ensure iOS builder creates Sources directory'],
                    documentation: []
                });
                return false;
            }
            // Find all Swift files
            const swiftFiles = await this.findSwiftFiles(sourcesPath);
            if (swiftFiles.length === 0) {
                errors.push({
                    code: 'NO_SWIFT_FILES',
                    message: 'No Swift source files found',
                    severity: 'error',
                    category: 'build',
                    platform: 'ios',
                    context: { sourcesPath },
                    suggestions: ['Ensure iOS builder generates Swift token files'],
                    documentation: []
                });
                return false;
            }
            // Validate each Swift file
            let hasErrors = false;
            for (const filePath of swiftFiles) {
                const valid = await this.validateSwiftFile(filePath, errors, warnings);
                if (!valid) {
                    hasErrors = true;
                }
            }
            return !hasErrors;
        }
        catch (error) {
            errors.push({
                code: 'SWIFT_VALIDATION_ERROR',
                message: `Failed to validate Swift constants: ${error instanceof Error ? error.message : 'Unknown error'}`,
                severity: 'error',
                category: 'validation',
                platform: 'ios',
                context: { error },
                suggestions: ['Check Swift source files'],
                documentation: []
            });
            return false;
        }
    }
    /**
     * Validate individual Swift file
     */
    async validateSwiftFile(filePath, errors, warnings) {
        try {
            const content = fsSync.readFileSync(filePath, 'utf-8');
            const result = this.validateSwiftSyntax(content);
            if (!result.valid) {
                errors.push(...result.errors.map(msg => ({
                    code: 'SWIFT_SYNTAX_ERROR',
                    message: `${path.basename(filePath)}: ${msg}`,
                    severity: 'error',
                    category: 'build',
                    platform: 'ios',
                    context: { filePath },
                    suggestions: ['Fix Swift syntax errors'],
                    documentation: []
                })));
            }
            warnings.push(...result.warnings.map(msg => `${path.basename(filePath)}: ${msg}`));
            return result.valid;
        }
        catch (error) {
            errors.push({
                code: 'SWIFT_FILE_READ_ERROR',
                message: `Failed to read Swift file: ${path.basename(filePath)}`,
                severity: 'error',
                category: 'validation',
                platform: 'ios',
                context: { filePath, error },
                suggestions: ['Check file permissions'],
                documentation: []
            });
            return false;
        }
    }
    /**
     * Validate Swift constant syntax
     *
     * Performs basic syntax validation on generated Swift code:
     * - Checks for valid Swift identifiers
     * - Validates enum structure
     * - Checks for proper type annotations
     * - Validates value formats
     *
     * Requirements: 3.4, 3.7
     */
    validateSwiftSyntax(swiftCode) {
        const errors = [];
        const warnings = [];
        // Check for required imports (relaxed for extension files)
        const hasSwiftUI = swiftCode.includes('import SwiftUI');
        const hasFoundation = swiftCode.includes('import Foundation');
        const isExtensionFile = swiftCode.includes('extension ') && !swiftCode.includes('public enum Tokens');
        if (!hasSwiftUI && !isExtensionFile) {
            errors.push('Missing required import: SwiftUI');
        }
        if (!hasFoundation && !isExtensionFile && swiftCode.includes('public enum Tokens')) {
            errors.push('Missing required import: Foundation');
        }
        // Check for main Tokens enum (only in main file)
        if (!isExtensionFile && !swiftCode.includes('public enum Tokens') && !swiftCode.includes('extension Tokens')) {
            errors.push('Missing main Tokens enum declaration');
        }
        // Validate enum structure (basic check)
        const enumPattern = /public enum \w+/g;
        const enumMatches = swiftCode.match(enumPattern);
        if (!isExtensionFile && (!enumMatches || enumMatches.length === 0)) {
            errors.push('No public enum declarations found');
        }
        // Validate static let declarations
        const staticLetPattern = /public static let \w+:/g;
        const staticLetMatches = swiftCode.match(staticLetPattern);
        if (staticLetMatches && staticLetMatches.length > 0) {
            // Check for proper type annotations
            for (const match of staticLetMatches) {
                if (!match.includes(': CGFloat') && !match.includes('=')) {
                    warnings.push(`Static let declaration may be missing type annotation: ${match}`);
                }
            }
        }
        // Validate CGFloat values
        const cgFloatPattern = /: CGFloat = (-?\d+\.?\d*)/g;
        let cgFloatMatch;
        while ((cgFloatMatch = cgFloatPattern.exec(swiftCode)) !== null) {
            const value = parseFloat(cgFloatMatch[1]);
            if (isNaN(value)) {
                errors.push(`Invalid CGFloat value: ${cgFloatMatch[1]}`);
            }
            if (value < 0) {
                warnings.push(`Negative CGFloat value found: ${value}`);
            }
        }
        // Validate Color hex values
        const colorHexPattern = /Color\(hex: "([^"]+)"\)/g;
        let colorMatch;
        while ((colorMatch = colorHexPattern.exec(swiftCode)) !== null) {
            const hexValue = colorMatch[1];
            if (!this.isValidHexColor(hexValue)) {
                errors.push(`Invalid hex color value: ${hexValue}`);
            }
        }
        // Check for Color extension
        if (swiftCode.includes('Color(hex:') && !swiftCode.includes('extension Color')) {
            errors.push('Color hex initializer used but Color extension not defined');
        }
        // Validate Swift identifier naming
        const identifierPattern = /public static let (\w+)/g;
        let identifierMatch;
        while ((identifierMatch = identifierPattern.exec(swiftCode)) !== null) {
            const identifier = identifierMatch[1];
            if (!this.isValidSwiftIdentifier(identifier)) {
                errors.push(`Invalid Swift identifier: ${identifier}`);
            }
        }
        // Check for balanced braces
        const openBraces = (swiftCode.match(/{/g) || []).length;
        const closeBraces = (swiftCode.match(/}/g) || []).length;
        if (openBraces !== closeBraces) {
            errors.push(`Unbalanced braces: ${openBraces} opening, ${closeBraces} closing`);
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
    /**
     * Check if string is a valid hex color
     */
    isValidHexColor(hex) {
        // Remove # if present
        const cleanHex = hex.replace('#', '');
        // Valid hex colors are 3, 6, or 8 characters
        if (![3, 6, 8].includes(cleanHex.length)) {
            return false;
        }
        // Check if all characters are valid hex digits
        return /^[0-9A-Fa-f]+$/.test(cleanHex);
    }
    /**
     * Check if string is a valid Swift identifier
     */
    isValidSwiftIdentifier(identifier) {
        // Swift identifiers must start with letter or underscore
        // and contain only letters, digits, and underscores
        return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier);
    }
    /**
     * Validate Swift Package structure
     */
    async validatePackageStructureFiles(packagePath, errors, warnings) {
        try {
            const result = this.validatePackageStructure(packagePath);
            if (!result.valid) {
                errors.push(...result.errors.map(msg => ({
                    code: 'PACKAGE_STRUCTURE_INVALID',
                    message: msg,
                    severity: 'error',
                    category: 'build',
                    platform: 'ios',
                    context: { packagePath },
                    suggestions: ['Ensure iOS builder creates proper package structure'],
                    documentation: []
                })));
            }
            warnings.push(...result.warnings);
            return result.valid;
        }
        catch (error) {
            errors.push({
                code: 'PACKAGE_STRUCTURE_VALIDATION_ERROR',
                message: `Failed to validate package structure: ${error instanceof Error ? error.message : 'Unknown error'}`,
                severity: 'error',
                category: 'validation',
                platform: 'ios',
                context: { error },
                suggestions: ['Check package structure and files'],
                documentation: []
            });
            return false;
        }
    }
    /**
     * Validate Swift Package structure
     *
     * Validates that the package has:
     * - Package.swift manifest
     * - Sources directory
     * - Tests directory
     * - Main module file
     *
     * Requirements: 2.1, 2.5, 5.1
     */
    validatePackageStructure(packagePath) {
        const errors = [];
        const warnings = [];
        let hasPackageManifest = false;
        let hasSourcesDirectory = false;
        let hasTestsDirectory = false;
        let hasMainModule = false;
        try {
            // Check for Package.swift
            const manifestPath = path.join(packagePath, 'Package.swift');
            try {
                fsSync.accessSync(manifestPath);
                hasPackageManifest = true;
            }
            catch {
                errors.push('Missing Package.swift manifest');
            }
            // Check for Sources directory
            const sourcesPath = path.join(packagePath, 'Sources');
            try {
                fsSync.accessSync(sourcesPath);
                hasSourcesDirectory = true;
            }
            catch {
                errors.push('Missing Sources directory');
            }
            // Check for Tests directory
            const testsPath = path.join(packagePath, 'Tests');
            try {
                fsSync.accessSync(testsPath);
                hasTestsDirectory = true;
            }
            catch {
                warnings.push('Missing Tests directory');
            }
            // Check for main module (try to find DesignerPunk directory)
            if (hasSourcesDirectory) {
                const sourcesPath = path.join(packagePath, 'Sources');
                const entries = fsSync.readdirSync(sourcesPath, { withFileTypes: true });
                const moduleDir = entries.find(e => e.isDirectory());
                if (moduleDir) {
                    hasMainModule = true;
                }
                else {
                    errors.push('Missing main module in Sources directory');
                }
            }
        }
        catch (error) {
            errors.push(`Error validating package structure: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings,
            hasPackageManifest,
            hasSourcesDirectory,
            hasTestsDirectory,
            hasMainModule
        };
    }
    /**
     * Validate iOS-specific optimizations
     */
    async validateOptimizations(packagePath, errors, warnings) {
        try {
            const sourcesPath = path.join(packagePath, 'Sources');
            const swiftFiles = await this.findSwiftFiles(sourcesPath);
            let hasSwiftUIComponents = false;
            for (const filePath of swiftFiles) {
                if (filePath.includes('Components/') || filePath.includes('components/')) {
                    const content = fsSync.readFileSync(filePath, 'utf-8');
                    const result = this.validateiOSOptimizations(content);
                    if (result.usesSwiftUI) {
                        hasSwiftUIComponents = true;
                    }
                    if (!result.valid) {
                        errors.push(...result.errors.map(msg => ({
                            code: 'IOS_OPTIMIZATION_MISSING',
                            message: `${path.basename(filePath)}: ${msg}`,
                            severity: 'error',
                            category: 'build',
                            platform: 'ios',
                            context: { filePath },
                            suggestions: ['Ensure iOS-specific optimizations are applied'],
                            documentation: []
                        })));
                    }
                    warnings.push(...result.warnings.map(msg => `${path.basename(filePath)}: ${msg}`));
                }
            }
            if (!hasSwiftUIComponents) {
                warnings.push('No SwiftUI components found - iOS-specific optimizations not utilized');
            }
            return true;
        }
        catch (error) {
            errors.push({
                code: 'OPTIMIZATION_VALIDATION_ERROR',
                message: `Failed to validate optimizations: ${error instanceof Error ? error.message : 'Unknown error'}`,
                severity: 'error',
                category: 'validation',
                platform: 'ios',
                context: { error },
                suggestions: ['Check component files'],
                documentation: []
            });
            return false;
        }
    }
    /**
     * Validate iOS-specific optimizations
     *
     * Validates that components use:
     * - SwiftUI framework
     * - CGFloat for numeric values
     * - Color extension for hex colors
     * - Proper token references
     *
     * Requirements: 2.7, 5.1
     */
    validateiOSOptimizations(componentCode) {
        const errors = [];
        const warnings = [];
        // Check for SwiftUI import
        const usesSwiftUI = componentCode.includes('import SwiftUI');
        if (!usesSwiftUI) {
            errors.push('Component does not import SwiftUI');
        }
        // Check for View protocol conformance
        if (!componentCode.includes(': View')) {
            errors.push('Component does not conform to View protocol');
        }
        // Check for body property
        if (!componentCode.includes('var body: some View')) {
            errors.push('Component missing body property');
        }
        // Check for CGFloat usage
        const usesCGFloat = componentCode.includes('CGFloat');
        if (!usesCGFloat) {
            warnings.push('Component does not use CGFloat for numeric values');
        }
        // Check for Color extension usage
        const usesColorExtension = componentCode.includes('Color(hex:');
        // Check for token references
        if (!componentCode.includes('Tokens.')) {
            warnings.push('Component does not reference design system tokens');
        }
        // Check for proper SwiftUI structure
        if (usesSwiftUI) {
            if (!componentCode.includes('public struct') && !componentCode.includes('struct')) {
                errors.push('Component should be defined as a struct');
            }
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings,
            usesSwiftUI,
            usesCGFloat,
            usesColorExtension
        };
    }
    /**
     * Find all Swift files recursively
     */
    async findSwiftFiles(dir) {
        const files = [];
        try {
            const entries = fsSync.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    const subFiles = await this.findSwiftFiles(fullPath);
                    files.push(...subFiles);
                }
                else if (entry.isFile() && entry.name.endsWith('.swift')) {
                    files.push(fullPath);
                }
            }
        }
        catch {
            // Directory doesn't exist or can't be read
        }
        return files;
    }
    /**
     * List Swift files for reporting
     */
    async listSwiftFiles(packagePath) {
        const sourcesPath = path.join(packagePath, 'Sources');
        const files = await this.findSwiftFiles(sourcesPath);
        return files.map(f => path.relative(packagePath, f));
    }
}
exports.iOSBuildValidator = iOSBuildValidator;
//# sourceMappingURL=iOSBuildValidator.js.map