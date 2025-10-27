"use strict";
/**
 * Android Build Validator Tests
 *
 * Tests for Android build output validation including:
 * - build.gradle.kts syntax validation
 * - Kotlin constants compilation validation
 * - Gradle module import capability
 * - Android-specific optimizations verification
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
const AndroidBuildValidator_1 = require("../AndroidBuildValidator");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
describe('AndroidBuildValidator', () => {
    let validator;
    let tempDir;
    beforeEach(async () => {
        validator = new AndroidBuildValidator_1.AndroidBuildValidator();
        // Create temporary directory for test files
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'android-validator-test-'));
    });
    afterEach(async () => {
        // Clean up temporary directory
        try {
            await fs.rm(tempDir, { recursive: true, force: true });
        }
        catch {
            // Ignore cleanup errors
        }
    });
    describe('validate', () => {
        it('should fail validation if build was not successful', async () => {
            const buildResult = {
                platform: 'android',
                success: false,
                packagePath: tempDir,
                duration: 1000,
                warnings: [],
                errors: []
            };
            const result = await validator.validate(buildResult);
            expect(result.valid).toBe(false);
            expect(result.buildGradleValid).toBe(false);
            expect(result.kotlinConstantsValid).toBe(false);
            expect(result.moduleImportValid).toBe(false);
            expect(result.optimizationsValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors[0].code).toBe('ANDROID_BUILD_FAILED');
        });
        it('should validate successful build with all required files', async () => {
            // Create mock Android build structure
            await createMockAndroidBuild(tempDir);
            const buildResult = {
                platform: 'android',
                success: true,
                packagePath: tempDir,
                duration: 1000,
                warnings: [],
                errors: []
            };
            const result = await validator.validate(buildResult);
            expect(result.valid).toBe(true);
            expect(result.buildGradleValid).toBe(true);
            expect(result.kotlinConstantsValid).toBe(true);
            expect(result.moduleImportValid).toBe(true);
            expect(result.optimizationsValid).toBe(true);
            expect(result.errors.length).toBe(0);
        });
    });
    describe('build.gradle.kts validation', () => {
        it('should fail if build.gradle.kts is missing', async () => {
            const buildResult = {
                platform: 'android',
                success: true,
                packagePath: tempDir,
                duration: 1000,
                warnings: [],
                errors: []
            };
            const result = await validator.validate(buildResult);
            expect(result.buildGradleValid).toBe(false);
            expect(result.errors.some(e => e.code === 'BUILD_GRADLE_MISSING')).toBe(true);
        });
        it('should fail if required plugins are missing', async () => {
            // Create build.gradle.kts without required plugins
            await fs.writeFile(path.join(tempDir, 'build.gradle.kts'), 'plugins { }\n\nandroid { }\n\ndependencies { }', 'utf-8');
            const buildResult = {
                platform: 'android',
                success: true,
                packagePath: tempDir,
                duration: 1000,
                warnings: [],
                errors: []
            };
            const result = await validator.validate(buildResult);
            expect(result.buildGradleValid).toBe(false);
            expect(result.errors.some(e => e.code === 'BUILD_GRADLE_MISSING_PLUGIN')).toBe(true);
        });
        it('should validate build.gradle.kts with all required elements', async () => {
            await fs.writeFile(path.join(tempDir, 'build.gradle.kts'), createValidBuildGradle(), 'utf-8');
            // Create minimal structure for other validations
            await createMinimalAndroidStructure(tempDir);
            const buildResult = {
                platform: 'android',
                success: true,
                packagePath: tempDir,
                duration: 1000,
                warnings: [],
                errors: []
            };
            const result = await validator.validate(buildResult);
            expect(result.buildGradleValid).toBe(true);
        });
    });
    describe('Kotlin constants validation', () => {
        it('should fail if Kotlin source directory is missing', async () => {
            await fs.writeFile(path.join(tempDir, 'build.gradle.kts'), createValidBuildGradle(), 'utf-8');
            const buildResult = {
                platform: 'android',
                success: true,
                packagePath: tempDir,
                duration: 1000,
                warnings: [],
                errors: []
            };
            const result = await validator.validate(buildResult);
            expect(result.kotlinConstantsValid).toBe(false);
            expect(result.errors.some(e => e.code === 'KOTLIN_DIR_MISSING')).toBe(true);
        });
        it('should fail if no Kotlin files are found', async () => {
            await fs.writeFile(path.join(tempDir, 'build.gradle.kts'), createValidBuildGradle(), 'utf-8');
            // Create empty Kotlin directory
            const kotlinDir = path.join(tempDir, 'src', 'main', 'kotlin');
            await fs.mkdir(kotlinDir, { recursive: true });
            const buildResult = {
                platform: 'android',
                success: true,
                packagePath: tempDir,
                duration: 1000,
                warnings: [],
                errors: []
            };
            const result = await validator.validate(buildResult);
            expect(result.kotlinConstantsValid).toBe(false);
            expect(result.errors.some(e => e.code === 'NO_KOTLIN_FILES')).toBe(true);
        });
        it('should validate Kotlin files with proper syntax', async () => {
            await createMockAndroidBuild(tempDir);
            const buildResult = {
                platform: 'android',
                success: true,
                packagePath: tempDir,
                duration: 1000,
                warnings: [],
                errors: []
            };
            const result = await validator.validate(buildResult);
            expect(result.kotlinConstantsValid).toBe(true);
            expect(result.details.kotlinFiles).toBeDefined();
            expect(result.details.kotlinFiles.length).toBeGreaterThan(0);
        });
        it('should fail if Kotlin file has syntax errors', async () => {
            await fs.writeFile(path.join(tempDir, 'build.gradle.kts'), createValidBuildGradle(), 'utf-8');
            const kotlinDir = path.join(tempDir, 'src', 'main', 'kotlin', 'com', 'designerpunk', 'tokens');
            await fs.mkdir(kotlinDir, { recursive: true });
            // Create Kotlin file with mismatched braces
            await fs.writeFile(path.join(kotlinDir, 'Tokens.kt'), 'package com.designerpunk.tokens\n\nobject Tokens {\n    val space100 = 8.dp\n', 'utf-8');
            await createMinimalAndroidStructure(tempDir);
            const buildResult = {
                platform: 'android',
                success: true,
                packagePath: tempDir,
                duration: 1000,
                warnings: [],
                errors: []
            };
            const result = await validator.validate(buildResult);
            expect(result.kotlinConstantsValid).toBe(false);
            expect(result.errors.some(e => e.code === 'KOTLIN_SYNTAX_ERROR')).toBe(true);
        });
    });
    describe('Module structure validation', () => {
        it('should fail if required files are missing', async () => {
            await fs.writeFile(path.join(tempDir, 'build.gradle.kts'), createValidBuildGradle(), 'utf-8');
            const buildResult = {
                platform: 'android',
                success: true,
                packagePath: tempDir,
                duration: 1000,
                warnings: [],
                errors: []
            };
            const result = await validator.validate(buildResult);
            expect(result.moduleImportValid).toBe(false);
            expect(result.errors.some(e => e.code === 'MODULE_MISSING_FILE')).toBe(true);
        });
        it('should validate complete module structure', async () => {
            await createMockAndroidBuild(tempDir);
            const buildResult = {
                platform: 'android',
                success: true,
                packagePath: tempDir,
                duration: 1000,
                warnings: [],
                errors: []
            };
            const result = await validator.validate(buildResult);
            expect(result.moduleImportValid).toBe(true);
        });
        it('should fail if AndroidManifest.xml is invalid', async () => {
            await fs.writeFile(path.join(tempDir, 'build.gradle.kts'), createValidBuildGradle(), 'utf-8');
            const manifestDir = path.join(tempDir, 'src', 'main');
            await fs.mkdir(manifestDir, { recursive: true });
            // Create invalid manifest
            await fs.writeFile(path.join(manifestDir, 'AndroidManifest.xml'), '<invalid>', 'utf-8');
            const kotlinDir = path.join(tempDir, 'src', 'main', 'kotlin');
            await fs.mkdir(kotlinDir, { recursive: true });
            const buildResult = {
                platform: 'android',
                success: true,
                packagePath: tempDir,
                duration: 1000,
                warnings: [],
                errors: []
            };
            const result = await validator.validate(buildResult);
            expect(result.moduleImportValid).toBe(false);
            expect(result.errors.some(e => e.code === 'MANIFEST_INVALID_XML' || e.code === 'MANIFEST_MISSING_ROOT')).toBe(true);
        });
    });
    describe('Android optimizations validation', () => {
        it('should warn if Jetpack Compose is not enabled', async () => {
            await fs.writeFile(path.join(tempDir, 'build.gradle.kts'), createBuildGradleWithoutCompose(), 'utf-8');
            await createMinimalAndroidStructure(tempDir);
            const buildResult = {
                platform: 'android',
                success: true,
                packagePath: tempDir,
                duration: 1000,
                warnings: [],
                errors: []
            };
            const result = await validator.validate(buildResult);
            expect(result.optimizationsValid).toBe(false);
            expect(result.warnings.some(w => w.includes('Jetpack Compose'))).toBe(true);
        });
        it('should validate Android-specific optimizations', async () => {
            await createMockAndroidBuild(tempDir);
            const buildResult = {
                platform: 'android',
                success: true,
                packagePath: tempDir,
                duration: 1000,
                warnings: [],
                errors: []
            };
            const result = await validator.validate(buildResult);
            expect(result.optimizationsValid).toBe(true);
            expect(result.details.optimizations).toBeDefined();
        });
    });
});
/**
 * Helper function to create a valid build.gradle.kts
 */
function createValidBuildGradle() {
    return `plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.designerpunk.tokens"
    compileSdk = 34
    
    defaultConfig {
        minSdk = 24
        targetSdk = 34
    }
    
    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    
    buildFeatures {
        compose = true
    }
    
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.4"
    }
}

dependencies {
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
}
`;
}
/**
 * Helper function to create build.gradle.kts without Compose
 */
function createBuildGradleWithoutCompose() {
    return `plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.designerpunk.tokens"
    compileSdk = 34
    
    defaultConfig {
        minSdk = 24
        targetSdk = 34
    }
}

dependencies {
}
`;
}
/**
 * Helper function to create minimal Android structure
 */
async function createMinimalAndroidStructure(baseDir) {
    // Create manifest
    const manifestDir = path.join(baseDir, 'src', 'main');
    await fs.mkdir(manifestDir, { recursive: true });
    await fs.writeFile(path.join(manifestDir, 'AndroidManifest.xml'), '<?xml version="1.0" encoding="utf-8"?>\n<manifest xmlns:android="http://schemas.android.com/apk/res/android">\n</manifest>', 'utf-8');
    // Create Kotlin directory
    const kotlinDir = path.join(baseDir, 'src', 'main', 'kotlin');
    await fs.mkdir(kotlinDir, { recursive: true });
    // Create res directory
    const resDir = path.join(baseDir, 'src', 'main', 'res');
    await fs.mkdir(resDir, { recursive: true });
    // Create test directory
    const testDir = path.join(baseDir, 'src', 'test', 'kotlin');
    await fs.mkdir(testDir, { recursive: true });
}
/**
 * Helper function to create complete mock Android build
 */
async function createMockAndroidBuild(baseDir) {
    // Create build.gradle.kts
    await fs.writeFile(path.join(baseDir, 'build.gradle.kts'), createValidBuildGradle(), 'utf-8');
    // Create minimal structure
    await createMinimalAndroidStructure(baseDir);
    // Create token files
    const tokensDir = path.join(baseDir, 'src', 'main', 'kotlin', 'com', 'designerpunk', 'tokens');
    await fs.mkdir(tokensDir, { recursive: true });
    await fs.writeFile(path.join(tokensDir, 'Tokens.kt'), `package com.designerpunk.tokens

import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

object Tokens {
    object Spacing {
        val space100: Dp = 8.dp
        val space200: Dp = 16.dp
    }
}
`, 'utf-8');
    // Create component file
    const componentsDir = path.join(baseDir, 'src', 'main', 'kotlin', 'com', 'designerpunk', 'components');
    await fs.mkdir(componentsDir, { recursive: true });
    await fs.writeFile(path.join(componentsDir, 'Button.kt'), `package com.designerpunk.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable
fun Button(modifier: Modifier = Modifier) {
    // Component implementation
}
`, 'utf-8');
}
//# sourceMappingURL=AndroidBuildValidator.test.js.map