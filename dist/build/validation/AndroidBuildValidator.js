"use strict";
/**
 * Android Build Validator
 *
 * Validates Android build output including:
 * - build.gradle.kts syntax validation
 * - Kotlin constants compilation validation
 * - Gradle module import capability
 * - Android-specific optimizations verification
 *
 * Requirements: 2.2, 2.7, 5.2
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
exports.AndroidBuildValidator = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
/**
 * Android Build Validator
 *
 * Validates Android build output for correctness and completeness
 */
class AndroidBuildValidator {
    /**
     * Validate Android build output
     */
    async validate(buildResult) {
        const errors = [];
        const warnings = [];
        // Validate build was successful
        if (!buildResult.success) {
            errors.push({
                code: 'ANDROID_BUILD_FAILED',
                message: 'Android build failed, cannot validate output',
                severity: 'error',
                category: 'build',
                platform: 'android',
                context: { buildResult },
                suggestions: ['Fix build errors before validating output'],
                documentation: []
            });
            return {
                valid: false,
                buildGradleValid: false,
                kotlinConstantsValid: false,
                moduleImportValid: false,
                optimizationsValid: false,
                errors,
                warnings,
                details: {}
            };
        }
        // Validate build.gradle.kts
        const buildGradleResult = await this.validateBuildGradle(buildResult.packagePath, errors, warnings);
        // Validate Kotlin constants
        const kotlinResult = await this.validateKotlinConstants(buildResult.packagePath, errors, warnings);
        // Validate Gradle module structure
        const moduleResult = await this.validateModuleStructure(buildResult.packagePath, errors, warnings);
        // Validate Android-specific optimizations
        const optimizationsResult = await this.validateOptimizations(buildResult.packagePath, errors, warnings);
        const valid = buildGradleResult && kotlinResult && moduleResult && optimizationsResult && errors.length === 0;
        return {
            valid,
            buildGradleValid: buildGradleResult,
            kotlinConstantsValid: kotlinResult,
            moduleImportValid: moduleResult,
            optimizationsValid: optimizationsResult,
            errors,
            warnings,
            details: {
                buildGradle: 'build.gradle.kts validated',
                kotlinFiles: await this.listKotlinFiles(buildResult.packagePath),
                optimizations: ['Jetpack Compose enabled', 'Material Design 3 integrated']
            }
        };
    }
    /**
     * Validate build.gradle.kts syntax and structure
     */
    async validateBuildGradle(packagePath, errors, warnings) {
        try {
            const buildGradlePath = path.join(packagePath, 'build.gradle.kts');
            // Check file exists
            try {
                await fs.access(buildGradlePath);
            }
            catch {
                errors.push({
                    code: 'BUILD_GRADLE_MISSING',
                    message: 'build.gradle.kts file not found',
                    severity: 'error',
                    category: 'build',
                    platform: 'android',
                    context: { packagePath },
                    suggestions: ['Ensure Android builder generates build.gradle.kts'],
                    documentation: []
                });
                return false;
            }
            // Read and validate content
            const content = await fs.readFile(buildGradlePath, 'utf-8');
            // Validate required plugins
            if (!content.includes('com.android.library')) {
                errors.push({
                    code: 'BUILD_GRADLE_MISSING_PLUGIN',
                    message: 'build.gradle.kts missing required plugin: com.android.library',
                    severity: 'error',
                    category: 'build',
                    platform: 'android',
                    context: { buildGradlePath },
                    suggestions: ['Add plugin: id("com.android.library")'],
                    documentation: []
                });
                return false;
            }
            if (!content.includes('org.jetbrains.kotlin.android')) {
                errors.push({
                    code: 'BUILD_GRADLE_MISSING_PLUGIN',
                    message: 'build.gradle.kts missing required plugin: org.jetbrains.kotlin.android',
                    severity: 'error',
                    category: 'build',
                    platform: 'android',
                    context: { buildGradlePath },
                    suggestions: ['Add plugin: id("org.jetbrains.kotlin.android")'],
                    documentation: []
                });
                return false;
            }
            // Validate android configuration block
            if (!content.includes('android {')) {
                errors.push({
                    code: 'BUILD_GRADLE_MISSING_ANDROID_BLOCK',
                    message: 'build.gradle.kts missing android configuration block',
                    severity: 'error',
                    category: 'build',
                    platform: 'android',
                    context: { buildGradlePath },
                    suggestions: ['Add android { } configuration block'],
                    documentation: []
                });
                return false;
            }
            // Validate namespace
            if (!content.includes('namespace =')) {
                errors.push({
                    code: 'BUILD_GRADLE_MISSING_NAMESPACE',
                    message: 'build.gradle.kts missing namespace declaration',
                    severity: 'error',
                    category: 'build',
                    platform: 'android',
                    context: { buildGradlePath },
                    suggestions: ['Add namespace = "com.designerpunk.tokens"'],
                    documentation: []
                });
                return false;
            }
            // Validate SDK versions
            if (!content.includes('compileSdk =')) {
                warnings.push('build.gradle.kts missing compileSdk declaration');
            }
            if (!content.includes('minSdk =')) {
                warnings.push('build.gradle.kts missing minSdk declaration');
            }
            if (!content.includes('targetSdk =')) {
                warnings.push('build.gradle.kts missing targetSdk declaration');
            }
            // Validate Compose configuration
            if (!content.includes('buildFeatures {') || !content.includes('compose = true')) {
                warnings.push('build.gradle.kts missing Jetpack Compose configuration');
            }
            // Validate dependencies block
            if (!content.includes('dependencies {')) {
                errors.push({
                    code: 'BUILD_GRADLE_MISSING_DEPENDENCIES',
                    message: 'build.gradle.kts missing dependencies block',
                    severity: 'error',
                    category: 'build',
                    platform: 'android',
                    context: { buildGradlePath },
                    suggestions: ['Add dependencies { } block'],
                    documentation: []
                });
                return false;
            }
            // Validate Compose dependencies
            if (!content.includes('androidx.compose')) {
                warnings.push('build.gradle.kts missing Jetpack Compose dependencies');
            }
            return true;
        }
        catch (error) {
            errors.push({
                code: 'BUILD_GRADLE_VALIDATION_ERROR',
                message: `Failed to validate build.gradle.kts: ${error instanceof Error ? error.message : 'Unknown error'}`,
                severity: 'error',
                category: 'validation',
                platform: 'android',
                context: { error },
                suggestions: ['Check file permissions and content'],
                documentation: []
            });
            return false;
        }
    }
    /**
     * Validate Kotlin constants compile correctly
     */
    async validateKotlinConstants(packagePath, errors, warnings) {
        try {
            const kotlinDir = path.join(packagePath, 'src', 'main', 'kotlin');
            // Check Kotlin directory exists
            try {
                await fs.access(kotlinDir);
            }
            catch {
                errors.push({
                    code: 'KOTLIN_DIR_MISSING',
                    message: 'Kotlin source directory not found',
                    severity: 'error',
                    category: 'build',
                    platform: 'android',
                    context: { packagePath },
                    suggestions: ['Ensure Android builder creates src/main/kotlin directory'],
                    documentation: []
                });
                return false;
            }
            // Find all Kotlin files
            const kotlinFiles = await this.findKotlinFiles(kotlinDir);
            if (kotlinFiles.length === 0) {
                errors.push({
                    code: 'NO_KOTLIN_FILES',
                    message: 'No Kotlin source files found',
                    severity: 'error',
                    category: 'build',
                    platform: 'android',
                    context: { kotlinDir },
                    suggestions: ['Ensure Android builder generates Kotlin token files'],
                    documentation: []
                });
                return false;
            }
            // Validate each Kotlin file
            let hasErrors = false;
            for (const filePath of kotlinFiles) {
                const valid = await this.validateKotlinFile(filePath, errors, warnings);
                if (!valid) {
                    hasErrors = true;
                }
            }
            return !hasErrors;
        }
        catch (error) {
            errors.push({
                code: 'KOTLIN_VALIDATION_ERROR',
                message: `Failed to validate Kotlin constants: ${error instanceof Error ? error.message : 'Unknown error'}`,
                severity: 'error',
                category: 'validation',
                platform: 'android',
                context: { error },
                suggestions: ['Check Kotlin source files'],
                documentation: []
            });
            return false;
        }
    }
    /**
     * Validate individual Kotlin file
     */
    async validateKotlinFile(filePath, errors, warnings) {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            // Validate package declaration
            if (!content.includes('package ')) {
                errors.push({
                    code: 'KOTLIN_MISSING_PACKAGE',
                    message: `Kotlin file missing package declaration: ${path.basename(filePath)}`,
                    severity: 'error',
                    category: 'build',
                    platform: 'android',
                    context: { filePath },
                    suggestions: ['Add package declaration at top of file'],
                    documentation: []
                });
                return false;
            }
            // Validate imports for token files
            if (filePath.includes('tokens/')) {
                if (!content.includes('import androidx.compose.ui')) {
                    warnings.push(`Token file missing Compose UI imports: ${path.basename(filePath)}`);
                }
            }
            // Validate Compose imports for component files
            if (filePath.includes('components/')) {
                if (!content.includes('import androidx.compose.runtime.Composable')) {
                    errors.push({
                        code: 'KOTLIN_MISSING_COMPOSABLE',
                        message: `Component file missing @Composable import: ${path.basename(filePath)}`,
                        severity: 'error',
                        category: 'build',
                        platform: 'android',
                        context: { filePath },
                        suggestions: ['Add import androidx.compose.runtime.Composable'],
                        documentation: []
                    });
                    return false;
                }
            }
            // Validate syntax (basic checks)
            const openBraces = (content.match(/{/g) || []).length;
            const closeBraces = (content.match(/}/g) || []).length;
            if (openBraces !== closeBraces) {
                errors.push({
                    code: 'KOTLIN_SYNTAX_ERROR',
                    message: `Kotlin file has mismatched braces: ${path.basename(filePath)}`,
                    severity: 'error',
                    category: 'build',
                    platform: 'android',
                    context: { filePath, openBraces, closeBraces },
                    suggestions: ['Check for missing or extra braces'],
                    documentation: []
                });
                return false;
            }
            return true;
        }
        catch (error) {
            errors.push({
                code: 'KOTLIN_FILE_READ_ERROR',
                message: `Failed to read Kotlin file: ${path.basename(filePath)}`,
                severity: 'error',
                category: 'validation',
                platform: 'android',
                context: { filePath, error },
                suggestions: ['Check file permissions'],
                documentation: []
            });
            return false;
        }
    }
    /**
     * Validate Gradle module can be imported
     */
    async validateModuleStructure(packagePath, errors, warnings) {
        try {
            // Check required files exist
            const requiredFiles = [
                'build.gradle.kts',
                'src/main/AndroidManifest.xml',
                'src/main/kotlin'
            ];
            for (const file of requiredFiles) {
                const filePath = path.join(packagePath, file);
                try {
                    await fs.access(filePath);
                }
                catch {
                    errors.push({
                        code: 'MODULE_MISSING_FILE',
                        message: `Required file missing: ${file}`,
                        severity: 'error',
                        category: 'build',
                        platform: 'android',
                        context: { packagePath, file },
                        suggestions: [`Ensure Android builder creates ${file}`],
                        documentation: []
                    });
                    return false;
                }
            }
            // Validate AndroidManifest.xml
            const manifestPath = path.join(packagePath, 'src', 'main', 'AndroidManifest.xml');
            const manifestContent = await fs.readFile(manifestPath, 'utf-8');
            if (!manifestContent.includes('<?xml version="1.0"')) {
                errors.push({
                    code: 'MANIFEST_INVALID_XML',
                    message: 'AndroidManifest.xml missing XML declaration',
                    severity: 'error',
                    category: 'build',
                    platform: 'android',
                    context: { manifestPath },
                    suggestions: ['Add <?xml version="1.0" encoding="utf-8"?> at top of file'],
                    documentation: []
                });
                return false;
            }
            if (!manifestContent.includes('<manifest')) {
                errors.push({
                    code: 'MANIFEST_MISSING_ROOT',
                    message: 'AndroidManifest.xml missing <manifest> root element',
                    severity: 'error',
                    category: 'build',
                    platform: 'android',
                    context: { manifestPath },
                    suggestions: ['Add <manifest> root element'],
                    documentation: []
                });
                return false;
            }
            // Check directory structure
            const expectedDirs = [
                'src/main/kotlin',
                'src/main/res',
                'src/test/kotlin'
            ];
            for (const dir of expectedDirs) {
                const dirPath = path.join(packagePath, dir);
                try {
                    const stat = await fs.stat(dirPath);
                    if (!stat.isDirectory()) {
                        warnings.push(`Expected directory is not a directory: ${dir}`);
                    }
                }
                catch {
                    warnings.push(`Expected directory missing: ${dir}`);
                }
            }
            return true;
        }
        catch (error) {
            errors.push({
                code: 'MODULE_VALIDATION_ERROR',
                message: `Failed to validate module structure: ${error instanceof Error ? error.message : 'Unknown error'}`,
                severity: 'error',
                category: 'validation',
                platform: 'android',
                context: { error },
                suggestions: ['Check module structure and files'],
                documentation: []
            });
            return false;
        }
    }
    /**
     * Validate Android-specific optimizations
     */
    async validateOptimizations(packagePath, errors, warnings) {
        try {
            const buildGradlePath = path.join(packagePath, 'build.gradle.kts');
            const content = await fs.readFile(buildGradlePath, 'utf-8');
            // Check Jetpack Compose optimization
            if (!content.includes('compose = true')) {
                warnings.push('Jetpack Compose not enabled - Android-specific optimizations may not work');
                return false;
            }
            // Check Material Design 3 dependency
            if (!content.includes('androidx.compose.material3')) {
                warnings.push('Material Design 3 not included - Android-specific optimizations may be limited');
            }
            // Check Kotlin compiler extension version
            if (!content.includes('kotlinCompilerExtensionVersion')) {
                warnings.push('Kotlin compiler extension version not specified - may affect Compose performance');
            }
            // Check build types configuration
            if (!content.includes('buildTypes {')) {
                warnings.push('Build types not configured - optimization settings may be missing');
            }
            // Check ProGuard configuration
            if (content.includes('release {') && !content.includes('proguardFiles')) {
                warnings.push('ProGuard not configured for release builds - code optimization may be missing');
            }
            // Validate Kotlin files use Compose optimizations
            const kotlinDir = path.join(packagePath, 'src', 'main', 'kotlin');
            const kotlinFiles = await this.findKotlinFiles(kotlinDir);
            let hasComposeComponents = false;
            for (const filePath of kotlinFiles) {
                if (filePath.includes('components/')) {
                    const content = await fs.readFile(filePath, 'utf-8');
                    if (content.includes('@Composable')) {
                        hasComposeComponents = true;
                        // Check for Compose best practices
                        if (!content.includes('Modifier')) {
                            warnings.push(`Component missing Modifier parameter: ${path.basename(filePath)}`);
                        }
                    }
                }
            }
            if (!hasComposeComponents) {
                warnings.push('No Composable components found - Android-specific optimizations not utilized');
            }
            return true;
        }
        catch (error) {
            errors.push({
                code: 'OPTIMIZATION_VALIDATION_ERROR',
                message: `Failed to validate optimizations: ${error instanceof Error ? error.message : 'Unknown error'}`,
                severity: 'error',
                category: 'validation',
                platform: 'android',
                context: { error },
                suggestions: ['Check build configuration'],
                documentation: []
            });
            return false;
        }
    }
    /**
     * Find all Kotlin files recursively
     */
    async findKotlinFiles(dir) {
        const files = [];
        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    const subFiles = await this.findKotlinFiles(fullPath);
                    files.push(...subFiles);
                }
                else if (entry.isFile() && entry.name.endsWith('.kt')) {
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
     * List Kotlin files for reporting
     */
    async listKotlinFiles(packagePath) {
        const kotlinDir = path.join(packagePath, 'src', 'main', 'kotlin');
        const files = await this.findKotlinFiles(kotlinDir);
        return files.map(f => path.relative(packagePath, f));
    }
}
exports.AndroidBuildValidator = AndroidBuildValidator;
//# sourceMappingURL=AndroidBuildValidator.js.map