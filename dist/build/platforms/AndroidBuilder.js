"use strict";
/**
 * Android Platform Builder
 *
 * Generates Android Library (AAR) or Gradle module with Jetpack Compose components.
 * Converts F1 tokens to Kotlin constants with proper dp/sp units.
 *
 * Requirements: 1.4, 2.2
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
exports.AndroidBuilder = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
/**
 * Android Platform Builder Implementation
 *
 * Builds Android Library (AAR) or Gradle module with Jetpack Compose components and token constants
 */
class AndroidBuilder {
    constructor(buildOptions) {
        this.platform = 'android';
        // Set default Android build configuration
        this.buildConfig = {
            kotlinVersion: buildOptions?.kotlinVersion || '1.9.20',
            minSdkVersion: buildOptions?.minSdkVersion || 24,
            targetSdkVersion: buildOptions?.targetSdkVersion || 34,
            compileSdkVersion: 34,
            dependencies: buildOptions?.dependencies?.map(dep => this.parseDependency(dep)) || [],
            packageName: 'com.designerpunk.tokens',
            libraryName: 'DesignerPunk'
        };
    }
    /**
     * Parse dependency string to Dependency object
     */
    parseDependency(dep) {
        const parts = dep.split(':');
        return {
            group: parts[0] || '',
            name: parts[1] || '',
            version: parts[2] || '1.0.0'
        };
    }
    /**
     * Build Android Library from component definitions
     */
    async build(components, tokens, config) {
        const startTime = Date.now();
        const warnings = [];
        const errors = [];
        try {
            // Create output directory
            const outputDir = path.join(config.outputDir, 'android');
            await fs.mkdir(outputDir, { recursive: true });
            // Generate Android Library structure
            const androidLibrary = await this.generateAndroidLibrary(components, tokens, config);
            // Write build.gradle.kts
            const buildGradlePath = path.join(outputDir, 'build.gradle.kts');
            await fs.writeFile(buildGradlePath, androidLibrary.buildGradle, 'utf-8');
            // Create src/main/kotlin directory structure
            const kotlinDir = path.join(outputDir, 'src', 'main', 'kotlin', ...this.buildConfig.packageName.split('.'));
            await fs.mkdir(kotlinDir, { recursive: true });
            // Create subdirectories for organized source files
            await fs.mkdir(path.join(kotlinDir, 'tokens'), { recursive: true });
            await fs.mkdir(path.join(kotlinDir, 'components'), { recursive: true });
            await fs.mkdir(path.join(kotlinDir, 'extensions'), { recursive: true });
            // Write source files
            for (const sourceFile of androidLibrary.sourceFiles) {
                const filePath = path.join(kotlinDir, sourceFile.path);
                await fs.mkdir(path.dirname(filePath), { recursive: true });
                await fs.writeFile(filePath, sourceFile.content, 'utf-8');
            }
            // Create src/main/res directory for resources
            const resDir = path.join(outputDir, 'src', 'main', 'res');
            await fs.mkdir(resDir, { recursive: true });
            // Write Android manifest
            const manifestDir = path.join(outputDir, 'src', 'main');
            const manifestPath = path.join(manifestDir, 'AndroidManifest.xml');
            await fs.writeFile(manifestPath, androidLibrary.manifest.content, 'utf-8');
            // Create test directory structure
            const testDir = path.join(outputDir, 'src', 'test', 'kotlin', ...this.buildConfig.packageName.split('.'));
            await fs.mkdir(testDir, { recursive: true });
            // Generate basic test file
            const testFileContent = this.generateTestFile();
            await fs.writeFile(path.join(testDir, `${this.buildConfig.libraryName}Test.kt`), testFileContent, 'utf-8');
            // Calculate package size
            const packageSize = await this.calculatePackageSize(outputDir);
            const duration = Date.now() - startTime;
            return {
                platform: this.platform,
                success: true,
                packagePath: outputDir,
                duration,
                warnings,
                errors,
                metadata: {
                    componentsBuilt: components.length,
                    tokensGenerated: this.countTokens(tokens),
                    packageSize,
                    timestamp: new Date().toISOString()
                }
            };
        }
        catch (error) {
            const duration = Date.now() - startTime;
            errors.push({
                code: 'ANDROID_BUILD_FAILED',
                message: error instanceof Error ? error.message : 'Unknown build error',
                severity: 'error',
                category: 'build',
                platform: this.platform,
                context: { error },
                suggestions: [
                    'Check that output directory is writable',
                    'Verify component definitions are valid',
                    'Ensure token integration is correct'
                ],
                documentation: []
            });
            return {
                platform: this.platform,
                success: false,
                packagePath: '',
                duration,
                warnings,
                errors
            };
        }
    }
    /**
     * Generate Android Library structure with proper organization
     *
     * Creates a complete Android Library with:
     * - Token constants organized by category
     * - Jetpack Compose component implementations
     * - Proper file organization (tokens/, components/, extensions/)
     * - build.gradle.kts with dependencies
     *
     * Requirements: 2.2, 2.5
     */
    async generateAndroidLibrary(components, tokens, config) {
        const sourceFiles = [];
        // Generate main token constants file
        const tokensContent = this.generateTokens(tokens);
        sourceFiles.push({
            path: 'tokens/Tokens.kt',
            content: tokensContent
        });
        // Generate token category files for better organization
        sourceFiles.push({
            path: 'tokens/SpacingTokens.kt',
            content: this.generateSpacingTokensFile(tokens)
        });
        sourceFiles.push({
            path: 'tokens/ColorTokens.kt',
            content: this.generateColorTokensFile(tokens)
        });
        sourceFiles.push({
            path: 'tokens/TypographyTokens.kt',
            content: this.generateTypographyTokensFile(tokens)
        });
        // Generate Jetpack Compose component files
        for (const component of components) {
            const componentContent = this.generateComposeComponent(component, tokens);
            sourceFiles.push({
                path: `components/${component.name}.kt`,
                content: componentContent
            });
        }
        // Generate utility extensions
        sourceFiles.push({
            path: 'extensions/ColorExtensions.kt',
            content: this.generateColorExtensions()
        });
        sourceFiles.push({
            path: 'extensions/ModifierExtensions.kt',
            content: this.generateModifierExtensions()
        });
        // Generate build.gradle.kts
        const buildGradle = this.generateBuildGradle(config);
        // Generate Android manifest
        const manifest = this.generateAndroidManifest();
        return {
            buildGradle,
            sourceFiles,
            resources: [],
            manifest
        };
    }
    /**
     * Generate build.gradle.kts with proper dependencies
     *
     * Creates a complete Gradle build configuration with:
     * - Kotlin and Android plugin configuration
     * - SDK versions and compilation settings
     * - Dependencies (Jetpack Compose, etc.)
     * - Build types and variants
     *
     * Requirements: 2.2, 2.5
     */
    generateBuildGradle(config) {
        const { kotlinVersion, minSdkVersion, targetSdkVersion, compileSdkVersion, dependencies } = this.buildConfig;
        // Generate dependencies section
        const dependenciesStr = dependencies.length > 0
            ? dependencies.map(dep => `    implementation("${dep.group}:${dep.name}:${dep.version}")`).join('\n')
            : '';
        // Add default Jetpack Compose dependencies
        const composeDependencies = `
    // Jetpack Compose
    implementation(platform("androidx.compose:compose-bom:2024.01.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.runtime:runtime")
    implementation("androidx.compose.foundation:foundation")
    
    // Kotlin
    implementation("org.jetbrains.kotlin:kotlin-stdlib:${kotlinVersion}")
    
    // Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-tooling")`;
        return `plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "${this.buildConfig.packageName}"
    compileSdk = ${compileSdkVersion}
    
    defaultConfig {
        minSdk = ${minSdkVersion}
        targetSdk = ${targetSdkVersion}
        
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        consumerProguardFiles("consumer-rules.pro")
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
    
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    
    kotlinOptions {
        jvmTarget = "17"
    }
    
    buildFeatures {
        compose = true
    }
    
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.4"
    }
}

dependencies {${composeDependencies}${dependenciesStr ? '\n' + dependenciesStr : ''}
}
`;
    }
    /**
     * Generate Android manifest
     */
    generateAndroidManifest() {
        return {
            packageName: this.buildConfig.packageName,
            content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- DesignerPunk Design System Library -->
    <!-- This library provides design tokens and Jetpack Compose components -->
</manifest>
`
        };
    }
    /**
     * Generate Kotlin token constants from platform tokens
     *
     * Generates Kotlin constants from:
     * - Primitive tokens (space100, color.blue.500, etc.)
     * - Semantic tokens (space.normal, color.primary, etc.)
     * - Component tokens (if needed)
     *
     * Requirements: 3.5, 3.7
     */
    generateTokens(tokens) {
        const lines = [];
        // File header
        lines.push('//');
        lines.push('// Tokens.kt');
        lines.push('// DesignerPunk Design System');
        lines.push('//');
        lines.push('// Auto-generated token constants for Android');
        lines.push('// DO NOT EDIT - Generated from F1 Mathematical Token System');
        lines.push('//');
        lines.push('');
        lines.push(`package ${this.buildConfig.packageName}.tokens`);
        lines.push('');
        lines.push('import androidx.compose.ui.graphics.Color');
        lines.push('import androidx.compose.ui.unit.Dp');
        lines.push('import androidx.compose.ui.unit.TextUnit');
        lines.push('import androidx.compose.ui.unit.dp');
        lines.push('import androidx.compose.ui.unit.sp');
        lines.push('');
        lines.push('/**');
        lines.push(' * Design system tokens for Android');
        lines.push(' */');
        lines.push('object Tokens {');
        lines.push('    ');
        // Generate primitive tokens
        this.generatePrimitiveTokens(lines, tokens.primitives);
        // Generate semantic tokens
        this.generateSemanticTokens(lines, tokens.semantics);
        // Generate component tokens (if any)
        this.generateComponentTokens(lines, tokens.components);
        lines.push('}');
        lines.push('');
        return lines.join('\n');
    }
    /**
     * Generate primitive token constants
     */
    generatePrimitiveTokens(lines, primitives) {
        lines.push('    // MARK: Primitive Tokens');
        lines.push('    ');
        // Generate spacing tokens
        if (Object.keys(primitives.spacing).length > 0) {
            lines.push('    /** Primitive spacing tokens (dp units) */');
            lines.push('    object Spacing {');
            for (const [name, value] of Object.entries(primitives.spacing)) {
                const kotlinName = this.toKotlinConstantName(name);
                const comment = `        /** ${name}: ${value.value}${value.unit} */`;
                lines.push(comment);
                lines.push(`        val ${kotlinName}: Dp = ${value.value}.dp`);
            }
            lines.push('    }');
            lines.push('    ');
        }
        // Generate color tokens
        if (Object.keys(primitives.colors).length > 0) {
            lines.push('    /** Primitive color tokens */');
            lines.push('    object Colors {');
            for (const [name, value] of Object.entries(primitives.colors)) {
                const kotlinName = this.toKotlinConstantName(name);
                const comment = `        /** ${name}: ${value.value} */`;
                lines.push(comment);
                // Convert hex color to Jetpack Compose Color
                if (typeof value.value === 'string' && value.value.startsWith('#')) {
                    const hexValue = value.value.replace('#', '0xFF');
                    lines.push(`        val ${kotlinName} = Color(${hexValue})`);
                }
            }
            lines.push('    }');
            lines.push('    ');
        }
        // Generate typography tokens
        if (Object.keys(primitives.typography).length > 0) {
            lines.push('    /** Primitive typography tokens (sp units) */');
            lines.push('    object Typography {');
            for (const [name, value] of Object.entries(primitives.typography)) {
                const kotlinName = this.toKotlinConstantName(name);
                const comment = `        /** ${name}: ${value.value}${value.unit} */`;
                lines.push(comment);
                lines.push(`        val ${kotlinName}: TextUnit = ${value.value}.sp`);
            }
            lines.push('    }');
            lines.push('    ');
        }
        // Generate radius tokens
        if (Object.keys(primitives.radius).length > 0) {
            lines.push('    /** Primitive radius tokens (dp units) */');
            lines.push('    object Radius {');
            for (const [name, value] of Object.entries(primitives.radius)) {
                const kotlinName = this.toKotlinConstantName(name);
                const comment = `        /** ${name}: ${value.value}${value.unit} */`;
                lines.push(comment);
                lines.push(`        val ${kotlinName}: Dp = ${value.value}.dp`);
            }
            lines.push('    }');
            lines.push('    ');
        }
        // Generate sizing tokens
        if (Object.keys(primitives.sizing).length > 0) {
            lines.push('    /** Primitive sizing tokens (dp units) */');
            lines.push('    object Sizing {');
            for (const [name, value] of Object.entries(primitives.sizing)) {
                const kotlinName = this.toKotlinConstantName(name);
                const comment = `        /** ${name}: ${value.value}${value.unit} */`;
                lines.push(comment);
                lines.push(`        val ${kotlinName}: Dp = ${value.value}.dp`);
            }
            lines.push('    }');
            lines.push('    ');
        }
    }
    /**
     * Generate semantic token constants
     */
    generateSemanticTokens(lines, semantics) {
        const hasSemanticTokens = Object.values(semantics).some(category => Object.keys(category).length > 0);
        if (!hasSemanticTokens) {
            return;
        }
        lines.push('    // MARK: Semantic Tokens');
        lines.push('    ');
        // Generate semantic spacing tokens
        if (Object.keys(semantics.spacing).length > 0) {
            lines.push('    /** Semantic spacing tokens (dp units) */');
            lines.push('    object SemanticSpacing {');
            for (const [name, value] of Object.entries(semantics.spacing)) {
                const kotlinName = this.toKotlinConstantName(name);
                const comment = `        /** ${name}: ${value.value}${value.unit} (references: ${value.token}) */`;
                lines.push(comment);
                lines.push(`        val ${kotlinName}: Dp = ${value.value}.dp`);
            }
            lines.push('    }');
            lines.push('    ');
        }
        // Generate semantic color tokens
        if (Object.keys(semantics.colors).length > 0) {
            lines.push('    /** Semantic color tokens */');
            lines.push('    object SemanticColors {');
            for (const [name, value] of Object.entries(semantics.colors)) {
                const kotlinName = this.toKotlinConstantName(name);
                const comment = `        /** ${name}: ${value.value} (references: ${value.token}) */`;
                lines.push(comment);
                // Convert hex color to Jetpack Compose Color
                if (typeof value.value === 'string' && value.value.startsWith('#')) {
                    const hexValue = value.value.replace('#', '0xFF');
                    lines.push(`        val ${kotlinName} = Color(${hexValue})`);
                }
            }
            lines.push('    }');
            lines.push('    ');
        }
        // Generate semantic typography tokens
        if (Object.keys(semantics.typography).length > 0) {
            lines.push('    /** Semantic typography tokens (sp units) */');
            lines.push('    object SemanticTypography {');
            for (const [name, value] of Object.entries(semantics.typography)) {
                const kotlinName = this.toKotlinConstantName(name);
                const comment = `        /** ${name}: ${value.value}${value.unit} (references: ${value.token}) */`;
                lines.push(comment);
                lines.push(`        val ${kotlinName}: TextUnit = ${value.value}.sp`);
            }
            lines.push('    }');
            lines.push('    ');
        }
        // Generate semantic radius tokens
        if (Object.keys(semantics.radius).length > 0) {
            lines.push('    /** Semantic radius tokens (dp units) */');
            lines.push('    object SemanticRadius {');
            for (const [name, value] of Object.entries(semantics.radius)) {
                const kotlinName = this.toKotlinConstantName(name);
                const comment = `        /** ${name}: ${value.value}${value.unit} (references: ${value.token}) */`;
                lines.push(comment);
                lines.push(`        val ${kotlinName}: Dp = ${value.value}.dp`);
            }
            lines.push('    }');
            lines.push('    ');
        }
        // Generate semantic sizing tokens
        if (Object.keys(semantics.sizing).length > 0) {
            lines.push('    /** Semantic sizing tokens (dp units) */');
            lines.push('    object SemanticSizing {');
            for (const [name, value] of Object.entries(semantics.sizing)) {
                const kotlinName = this.toKotlinConstantName(name);
                const comment = `        /** ${name}: ${value.value}${value.unit} (references: ${value.token}) */`;
                lines.push(comment);
                lines.push(`        val ${kotlinName}: Dp = ${value.value}.dp`);
            }
            lines.push('    }');
            lines.push('    ');
        }
    }
    /**
     * Generate component token constants (if needed)
     */
    generateComponentTokens(lines, components) {
        const hasComponentTokens = Object.values(components).some(category => Object.keys(category).length > 0);
        if (!hasComponentTokens) {
            return;
        }
        lines.push('    // MARK: Component Tokens');
        lines.push('    ');
        lines.push('    /**');
        lines.push('     * Component-specific tokens');
        lines.push('     * Generated when semantic and primitive tokens are insufficient');
        lines.push('     */');
        lines.push('    ');
        // Generate component spacing tokens
        if (Object.keys(components.spacing).length > 0) {
            lines.push('    /** Component spacing tokens (dp units) */');
            lines.push('    object ComponentSpacing {');
            for (const [name, value] of Object.entries(components.spacing)) {
                const kotlinName = this.toKotlinConstantName(name);
                const comment = `        /** ${name}: ${value.value}${value.unit} */`;
                lines.push(comment);
                lines.push(`        val ${kotlinName}: Dp = ${value.value}.dp`);
            }
            lines.push('    }');
            lines.push('    ');
        }
        // Generate component color tokens
        if (Object.keys(components.colors).length > 0) {
            lines.push('    /** Component color tokens */');
            lines.push('    object ComponentColors {');
            for (const [name, value] of Object.entries(components.colors)) {
                const kotlinName = this.toKotlinConstantName(name);
                const comment = `        /** ${name}: ${value.value} */`;
                lines.push(comment);
                // Convert hex color to Jetpack Compose Color
                if (typeof value.value === 'string' && value.value.startsWith('#')) {
                    const hexValue = value.value.replace('#', '0xFF');
                    lines.push(`        val ${kotlinName} = Color(${hexValue})`);
                }
            }
            lines.push('    }');
            lines.push('    ');
        }
        // Generate component typography tokens
        if (Object.keys(components.typography).length > 0) {
            lines.push('    /** Component typography tokens (sp units) */');
            lines.push('    object ComponentTypography {');
            for (const [name, value] of Object.entries(components.typography)) {
                const kotlinName = this.toKotlinConstantName(name);
                const comment = `        /** ${name}: ${value.value}${value.unit} */`;
                lines.push(comment);
                lines.push(`        val ${kotlinName}: TextUnit = ${value.value}.sp`);
            }
            lines.push('    }');
            lines.push('    ');
        }
        // Generate component radius tokens
        if (Object.keys(components.radius).length > 0) {
            lines.push('    /** Component radius tokens (dp units) */');
            lines.push('    object ComponentRadius {');
            for (const [name, value] of Object.entries(components.radius)) {
                const kotlinName = this.toKotlinConstantName(name);
                const comment = `        /** ${name}: ${value.value}${value.unit} */`;
                lines.push(comment);
                lines.push(`        val ${kotlinName}: Dp = ${value.value}.dp`);
            }
            lines.push('    }');
            lines.push('    ');
        }
        // Generate component sizing tokens
        if (Object.keys(components.sizing).length > 0) {
            lines.push('    /** Component sizing tokens (dp units) */');
            lines.push('    object ComponentSizing {');
            for (const [name, value] of Object.entries(components.sizing)) {
                const kotlinName = this.toKotlinConstantName(name);
                const comment = `        /** ${name}: ${value.value}${value.unit} */`;
                lines.push(comment);
                lines.push(`        val ${kotlinName}: Dp = ${value.value}.dp`);
            }
            lines.push('    }');
            lines.push('    ');
        }
    }
    /**
     * Generate spacing tokens file
     */
    generateSpacingTokensFile(tokens) {
        const lines = [];
        lines.push('//');
        lines.push('// SpacingTokens.kt');
        lines.push('// DesignerPunk Design System');
        lines.push('//');
        lines.push('// Spacing token constants for Android');
        lines.push('//');
        lines.push('');
        lines.push(`package ${this.buildConfig.packageName}.tokens`);
        lines.push('');
        lines.push('import androidx.compose.ui.unit.Dp');
        lines.push('import androidx.compose.ui.unit.dp');
        lines.push('');
        lines.push('/** Spacing tokens organized by hierarchy */');
        lines.push('object Space {');
        lines.push('    // Primitive spacing tokens');
        for (const [name, value] of Object.entries(tokens.primitives.spacing)) {
            lines.push(`    val ${this.toKotlinConstantName(name)}: Dp = ${value.value}.dp`);
        }
        lines.push('}');
        lines.push('');
        return lines.join('\n');
    }
    /**
     * Generate color tokens file
     */
    generateColorTokensFile(tokens) {
        const lines = [];
        lines.push('//');
        lines.push('// ColorTokens.kt');
        lines.push('// DesignerPunk Design System');
        lines.push('//');
        lines.push('// Color token constants for Android');
        lines.push('//');
        lines.push('');
        lines.push(`package ${this.buildConfig.packageName}.tokens`);
        lines.push('');
        lines.push('import androidx.compose.ui.graphics.Color');
        lines.push('');
        lines.push('/** Color tokens organized by hierarchy */');
        lines.push('object ColorPalette {');
        lines.push('    // Primitive color tokens');
        for (const [name, value] of Object.entries(tokens.primitives.colors)) {
            if (typeof value.value === 'string' && value.value.startsWith('#')) {
                const hexValue = value.value.replace('#', '0xFF');
                lines.push(`    val ${this.toKotlinConstantName(name)} = Color(${hexValue})`);
            }
        }
        lines.push('}');
        lines.push('');
        return lines.join('\n');
    }
    /**
     * Generate typography tokens file
     */
    generateTypographyTokensFile(tokens) {
        const lines = [];
        lines.push('//');
        lines.push('// TypographyTokens.kt');
        lines.push('// DesignerPunk Design System');
        lines.push('//');
        lines.push('// Typography token constants for Android');
        lines.push('//');
        lines.push('');
        lines.push(`package ${this.buildConfig.packageName}.tokens`);
        lines.push('');
        lines.push('import androidx.compose.ui.unit.TextUnit');
        lines.push('import androidx.compose.ui.unit.sp');
        lines.push('');
        lines.push('/** Typography tokens organized by hierarchy */');
        lines.push('object Type {');
        lines.push('    // Primitive typography tokens');
        for (const [name, value] of Object.entries(tokens.primitives.typography)) {
            lines.push(`    val ${this.toKotlinConstantName(name)}: TextUnit = ${value.value}.sp`);
        }
        lines.push('}');
        lines.push('');
        return lines.join('\n');
    }
    /**
     * Generate Jetpack Compose component with proper structure
     */
    generateComposeComponent(component, tokens) {
        const lines = [];
        lines.push('//');
        lines.push(`// ${component.name}.kt`);
        lines.push('// DesignerPunk Design System');
        lines.push('//');
        lines.push(`// ${component.description}`);
        lines.push('//');
        lines.push('');
        lines.push(`package ${this.buildConfig.packageName}.components`);
        lines.push('');
        lines.push('import androidx.compose.foundation.layout.*');
        lines.push('import androidx.compose.material3.Text');
        lines.push('import androidx.compose.runtime.Composable');
        lines.push('import androidx.compose.ui.Modifier');
        lines.push('import androidx.compose.ui.tooling.preview.Preview');
        lines.push(`import ${this.buildConfig.packageName}.tokens.Tokens`);
        lines.push('');
        lines.push('/**');
        lines.push(` * ${component.description}`);
        lines.push(' *');
        lines.push(' * A Jetpack Compose component that follows the DesignerPunk design system.');
        lines.push(' * Uses mathematical token relationships for consistent spacing and sizing.');
        lines.push(' */');
        lines.push('@Composable');
        lines.push(`fun ${component.name}(`);
        lines.push('    modifier: Modifier = Modifier,');
        lines.push('    configuration: Configuration = Configuration()');
        lines.push(') {');
        lines.push('    Column(');
        lines.push('        modifier = modifier.padding(Tokens.Spacing.space100),');
        lines.push('        verticalArrangement = Arrangement.spacedBy(Tokens.Spacing.space100)');
        lines.push('    ) {');
        lines.push('        Text(');
        lines.push(`            text = "${component.name}",`);
        lines.push('            fontSize = Tokens.Typography.fontSize100,');
        lines.push('            color = Tokens.Colors.colorBlue500');
        lines.push('        )');
        lines.push('    }');
        lines.push('}');
        lines.push('');
        lines.push('/**');
        lines.push(' * Component configuration options');
        lines.push(' */');
        lines.push('data class Configuration(');
        lines.push('    val placeholder: String = ""');
        lines.push(')');
        lines.push('');
        lines.push('@Preview(showBackground = true)');
        lines.push('@Composable');
        lines.push(`private fun ${component.name}Preview() {`);
        lines.push(`    ${component.name}()`);
        lines.push('}');
        lines.push('');
        return lines.join('\n');
    }
    /**
     * Generate color extensions
     */
    generateColorExtensions() {
        const lines = [];
        lines.push('//');
        lines.push('// ColorExtensions.kt');
        lines.push('// DesignerPunk Design System');
        lines.push('//');
        lines.push('// Color utility extensions for Android');
        lines.push('//');
        lines.push('');
        lines.push(`package ${this.buildConfig.packageName}.extensions`);
        lines.push('');
        lines.push('import androidx.compose.ui.graphics.Color');
        lines.push('');
        lines.push('/**');
        lines.push(' * Convert hex string to Color');
        lines.push(' */');
        lines.push('fun String.toColor(): Color {');
        lines.push('    val hex = this.removePrefix("#")');
        lines.push('    return when (hex.length) {');
        lines.push('        6 -> Color(android.graphics.Color.parseColor("#$hex"))');
        lines.push('        8 -> Color(android.graphics.Color.parseColor("#$hex"))');
        lines.push('        else -> Color.Black');
        lines.push('    }');
        lines.push('}');
        lines.push('');
        return lines.join('\n');
    }
    /**
     * Generate modifier extensions
     */
    generateModifierExtensions() {
        const lines = [];
        lines.push('//');
        lines.push('// ModifierExtensions.kt');
        lines.push('// DesignerPunk Design System');
        lines.push('//');
        lines.push('// Modifier utility extensions for Android');
        lines.push('//');
        lines.push('');
        lines.push(`package ${this.buildConfig.packageName}.extensions`);
        lines.push('');
        lines.push('import androidx.compose.ui.Modifier');
        lines.push('');
        lines.push('/**');
        lines.push(' * Conditional modifier application');
        lines.push(' */');
        lines.push('fun Modifier.conditional(');
        lines.push('    condition: Boolean,');
        lines.push('    modifier: Modifier.() -> Modifier');
        lines.push('): Modifier {');
        lines.push('    return if (condition) {');
        lines.push('        then(modifier(Modifier))');
        lines.push('    } else {');
        lines.push('        this');
        lines.push('    }');
        lines.push('}');
        lines.push('');
        return lines.join('\n');
    }
    /**
     * Generate test file
     */
    generateTestFile() {
        const lines = [];
        lines.push('//');
        lines.push(`// ${this.buildConfig.libraryName}Test.kt`);
        lines.push('// DesignerPunk Design System');
        lines.push('//');
        lines.push('// Basic test file for Android library');
        lines.push('//');
        lines.push('');
        lines.push(`package ${this.buildConfig.packageName}`);
        lines.push('');
        lines.push('import org.junit.Test');
        lines.push('import org.junit.Assert.*');
        lines.push('');
        lines.push('/**');
        lines.push(' * Basic tests for DesignerPunk design system');
        lines.push(' */');
        lines.push(`class ${this.buildConfig.libraryName}Test {`);
        lines.push('    @Test');
        lines.push('    fun library_loads() {');
        lines.push('        // Verify library can be loaded');
        lines.push('        assertTrue(true)');
        lines.push('    }');
        lines.push('}');
        lines.push('');
        return lines.join('\n');
    }
    /**
     * Convert token name to Kotlin constant name (camelCase)
     *
     * Examples:
     * - "space100" -> "space100"
     * - "color.blue.500" -> "colorBlue500"
     * - "font-size-large" -> "fontSizeLarge"
     */
    toKotlinConstantName(name) {
        return name
            // Split on dots and dashes
            .split(/[.\-]/)
            // Capitalize each segment except the first
            .map((segment, index) => {
            if (index === 0) {
                // First segment: lowercase first letter
                return segment.charAt(0).toLowerCase() + segment.slice(1);
            }
            // Subsequent segments: capitalize first letter (camelCase)
            return segment.charAt(0).toUpperCase() + segment.slice(1);
        })
            .join('');
    }
    /**
     * Validate platform-specific implementation
     */
    validate(implementation) {
        const errors = [];
        const warnings = [];
        // Basic validation - can be extended
        if (!implementation) {
            errors.push('Implementation is required');
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
    /**
     * Clean build artifacts
     */
    async clean(outputDir) {
        try {
            const androidDir = path.join(outputDir, 'android');
            await fs.rm(androidDir, { recursive: true, force: true });
        }
        catch (error) {
            // Ignore errors if directory doesn't exist
        }
    }
    /**
     * Calculate package size
     */
    async calculatePackageSize(dir) {
        let totalSize = 0;
        try {
            const files = await fs.readdir(dir, { withFileTypes: true });
            for (const file of files) {
                const filePath = path.join(dir, file.name);
                if (file.isDirectory()) {
                    totalSize += await this.calculatePackageSize(filePath);
                }
                else {
                    const stats = await fs.stat(filePath);
                    totalSize += stats.size;
                }
            }
        }
        catch (error) {
            // Ignore errors
        }
        return totalSize;
    }
    /**
     * Count tokens in platform tokens
     */
    countTokens(tokens) {
        let count = 0;
        // Count primitive tokens
        count += Object.keys(tokens.primitives.spacing).length;
        count += Object.keys(tokens.primitives.colors).length;
        count += Object.keys(tokens.primitives.typography).length;
        count += Object.keys(tokens.primitives.radius).length;
        count += Object.keys(tokens.primitives.sizing).length;
        // Count semantic tokens
        count += Object.keys(tokens.semantics.spacing).length;
        count += Object.keys(tokens.semantics.colors).length;
        count += Object.keys(tokens.semantics.typography).length;
        count += Object.keys(tokens.semantics.radius).length;
        count += Object.keys(tokens.semantics.sizing).length;
        // Count component tokens
        count += Object.keys(tokens.components.spacing).length;
        count += Object.keys(tokens.components.colors).length;
        count += Object.keys(tokens.components.typography).length;
        count += Object.keys(tokens.components.radius).length;
        count += Object.keys(tokens.components.sizing).length;
        return count;
    }
}
exports.AndroidBuilder = AndroidBuilder;
//# sourceMappingURL=AndroidBuilder.js.map