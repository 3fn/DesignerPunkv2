/**
 * Android Platform Builder
 * 
 * Generates Android Library (AAR) or Gradle module with Jetpack Compose components.
 * Converts F1 tokens to Kotlin constants with proper dp/sp units.
 * 
 * Requirements: 1.4, 2.2
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { PlatformBuilder, ComponentDefinition } from './PlatformBuilder';
import { BuildConfig, AndroidBuildOptions } from '../types/BuildConfig';
import { BuildResult, BuildError } from '../types/BuildResult';
import { Platform } from '../types/Platform';
import { PlatformTokens } from '../tokens/PlatformTokens';

/**
 * Android Library structure
 */
export interface AndroidLibrary {
  /** build.gradle.kts content */
  buildGradle: string;
  
  /** Kotlin source files */
  sourceFiles: KotlinFile[];
  
  /** Android resources */
  resources: AndroidResource[];
  
  /** Android manifest */
  manifest: AndroidManifest;
}

/**
 * Kotlin source file
 */
export interface KotlinFile {
  /** File path relative to src/main/kotlin */
  path: string;
  
  /** File content */
  content: string;
}

/**
 * Android resource
 */
export interface AndroidResource {
  /** Resource path */
  path: string;
  
  /** Resource type */
  type: 'values' | 'drawable' | 'layout' | 'other';
}

/**
 * Android manifest
 */
export interface AndroidManifest {
  /** Package name */
  packageName: string;
  
  /** Manifest content */
  content: string;
}

/**
 * Android build configuration
 */
export interface AndroidBuildConfig {
  /** Kotlin version */
  kotlinVersion: string;
  
  /** Minimum SDK version */
  minSdkVersion: number;
  
  /** Target SDK version */
  targetSdkVersion: number;
  
  /** Compile SDK version */
  compileSdkVersion: number;
  
  /** Package dependencies */
  dependencies: Dependency[];
  
  /** Package name */
  packageName: string;
  
  /** Library name */
  libraryName: string;
}

/**
 * Package dependency
 */
export interface Dependency {
  /** Dependency group */
  group: string;
  
  /** Dependency name */
  name: string;
  
  /** Dependency version */
  version: string;
}

/**
 * Android Platform Builder Implementation
 * 
 * Builds Android Library (AAR) or Gradle module with Jetpack Compose components and token constants
 */
export class AndroidBuilder implements PlatformBuilder {
  readonly platform: Platform = 'android';
  
  private buildConfig: AndroidBuildConfig;
  
  constructor(buildOptions?: AndroidBuildOptions) {
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
  private parseDependency(dep: string): Dependency {
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
  async build(
    components: ComponentDefinition[],
    tokens: PlatformTokens,
    config: BuildConfig
  ): Promise<BuildResult> {
    const startTime = Date.now();
    const warnings: string[] = [];
    const errors: BuildError[] = [];
    
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
    } catch (error) {
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
  private async generateAndroidLibrary(
    components: ComponentDefinition[],
    tokens: PlatformTokens,
    config: BuildConfig
  ): Promise<AndroidLibrary> {
    const sourceFiles: KotlinFile[] = [];
    
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
  private generateBuildGradle(config: BuildConfig): string {
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
  private generateAndroidManifest(): AndroidManifest {
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
  generateTokens(tokens: PlatformTokens): string {
    const lines: string[] = [];
    
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
  private generatePrimitiveTokens(lines: string[], primitives: PlatformTokens['primitives']): void {
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
  private generateSemanticTokens(lines: string[], semantics: PlatformTokens['semantics']): void {
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
  private generateComponentTokens(lines: string[], components: PlatformTokens['components']): void {
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
  private generateSpacingTokensFile(tokens: PlatformTokens): string {
    const lines: string[] = [];
    
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
  private generateColorTokensFile(tokens: PlatformTokens): string {
    const lines: string[] = [];
    
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
  private generateTypographyTokensFile(tokens: PlatformTokens): string {
    const lines: string[] = [];
    
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
  private generateComposeComponent(component: ComponentDefinition, tokens: PlatformTokens): string {
    const lines: string[] = [];
    
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
  private generateColorExtensions(): string {
    const lines: string[] = [];
    
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
  private generateModifierExtensions(): string {
    const lines: string[] = [];
    
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
  private generateTestFile(): string {
    const lines: string[] = [];
    
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
   * Generate duration token Kotlin constants
   * 
   * Generates Kotlin constants for animation duration tokens.
   * Format: val Duration150 = 150
   * 
   * Duration values are in milliseconds for Android.
   * 
   * Requirements: 1.7, 6.3
   * 
   * @param durationTokens - Duration primitive tokens from token system
   * @returns Kotlin constant declarations
   */
  generateDurationTokens(durationTokens: Record<string, any>): string {
    const lines: string[] = [];
    
    lines.push('    // MARK: Duration Tokens');
    lines.push('    ');
    lines.push('    /** Animation duration values in milliseconds */');
    lines.push('    object Duration {');
    
    for (const [name, token] of Object.entries(durationTokens)) {
      const kotlinName = this.toKotlinTypeName(name);
      const value = token.platforms.android.value; // Milliseconds
      const comment = `        /** ${name}: ${value}ms */`;
      lines.push(comment);
      lines.push(`        val ${kotlinName} = ${value}`);
    }
    
    lines.push('    }');
    lines.push('    ');
    
    return lines.join('\n');
  }

  /**
   * Generate easing token Kotlin constants
   * 
   * Generates Kotlin constants for animation easing tokens using CubicBezierEasing().
   * Format: val EasingStandard = CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f)
   * 
   * Converts cubic-bezier CSS format to Kotlin CubicBezierEasing format.
   * 
   * Requirements: 2.7, 6.3, 6.7
   * 
   * @param easingTokens - Easing primitive tokens from token system
   * @returns Kotlin constant declarations
   */
  generateEasingTokens(easingTokens: Record<string, any>): string {
    const lines: string[] = [];
    
    lines.push('    // MARK: Easing Tokens');
    lines.push('    ');
    lines.push('    /** Animation easing curves using CubicBezierEasing */');
    lines.push('    object Easing {');
    
    for (const [name, token] of Object.entries(easingTokens)) {
      const kotlinName = this.toKotlinTypeName(name);
      const cubicBezier = token.platforms.android.value;
      
      // Extract cubic-bezier parameters from string like "cubic-bezier(0.4, 0.0, 0.2, 1)"
      const match = cubicBezier.match(/cubic-bezier\(([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\)/);
      if (match) {
        const [, p1, p2, p3, p4] = match;
        // Format float values to always include .0 for whole numbers (1.0f instead of 1f)
        const formatFloat = (val: string) => {
          const num = parseFloat(val);
          return num === Math.floor(num) ? `${num}.0f` : `${val}f`;
        };
        const comment = `        /** ${name}: ${cubicBezier} */`;
        lines.push(comment);
        lines.push(`        val ${kotlinName} = CubicBezierEasing(${formatFloat(p1)}, ${formatFloat(p2)}, ${formatFloat(p3)}, ${formatFloat(p4)})`);
      }
    }
    
    lines.push('    }');
    lines.push('    ');
    
    return lines.join('\n');
  }

  /**
   * Generate scale token Kotlin constants
   * 
   * Generates Kotlin constants for transform scale tokens.
   * Format: val Scale088 = 0.88f
   * 
   * Requirements: 3.1, 6.3
   * 
   * @param scaleTokens - Scale primitive tokens from token system
   * @returns Kotlin constant declarations
   */
  generateScaleTokens(scaleTokens: Record<string, any>): string {
    const lines: string[] = [];
    
    lines.push('    // MARK: Scale Tokens');
    lines.push('    ');
    lines.push('    /** Transform scale factors (unitless) */');
    lines.push('    object Scale {');
    
    for (const [name, token] of Object.entries(scaleTokens)) {
      const kotlinName = this.toKotlinTypeName(name);
      const value = token.platforms.android.value;
      // Format float values to always include .0 for whole numbers (1.0f instead of 1f)
      const formattedValue = value === Math.floor(value) ? `${value}.0f` : `${value}f`;
      const comment = `        /** ${name}: ${value} */`;
      lines.push(comment);
      lines.push(`        val ${kotlinName} = ${formattedValue}`);
    }
    
    lines.push('    }');
    lines.push('    ');
    
    return lines.join('\n');
  }

  /**
   * Generate semantic motion token Kotlin constants
   * 
   * Generates Kotlin objects for semantic motion tokens that compose
   * primitive duration, easing, and scale tokens.
   * 
   * Format:
   *   object MotionFloatLabel {
   *     val duration = Duration.Duration250
   *     val easing = Easing.EasingStandard
   *   }
   * 
   * Requirements: 5.1, 5.2, 6.7
   * 
   * @param motionTokens - Semantic motion tokens from token system
   * @returns Kotlin object declarations
   */
  generateSemanticMotionTokens(motionTokens: Record<string, any>): string {
    const lines: string[] = [];
    
    lines.push('    // MARK: Semantic Motion Tokens');
    lines.push('    ');
    lines.push('    /** Composed motion styles for specific animation contexts */');
    
    for (const [name, token] of Object.entries(motionTokens)) {
      const objectName = this.toKotlinTypeName(name);
      const { duration, easing, scale } = token.primitiveReferences;
      
      // Use context instead of description to avoid including specific values
      const comment = token.context || token.description;
      
      lines.push('    ');
      lines.push(`    /** ${comment} */`);
      lines.push(`    object ${objectName} {`);
      
      // Generate duration reference
      const durationKotlinName = this.toKotlinTypeName(duration);
      lines.push(`        val duration = Duration.${durationKotlinName}`);
      
      // Generate easing reference
      const easingKotlinName = this.toKotlinTypeName(easing);
      lines.push(`        val easing = Easing.${easingKotlinName}`);
      
      // Generate scale reference if present
      if (scale) {
        const scaleKotlinName = this.toKotlinTypeName(scale);
        lines.push(`        val scale = Scale.${scaleKotlinName}`);
      }
      
      lines.push('    }');
    }
    
    lines.push('    ');
    
    return lines.join('\n');
  }

  /**
   * Convert token name to Kotlin type name (PascalCase)
   * 
   * Converts names like "motion.floatLabel" to "MotionFloatLabel"
   * or "duration150" to "Duration150"
   * Used for object and class names.
   */
  private toKotlinTypeName(name: string): string {
    return name
      .split(/[.\-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  }

  /**
   * Convert token name to Kotlin constant name (camelCase)
   * 
   * Examples:
   * - "space100" -> "space100"
   * - "color.blue.500" -> "colorBlue500"
   * - "font-size-large" -> "fontSizeLarge"
   */
  private toKotlinConstantName(name: string): string {
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
  validate(implementation: unknown): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
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
  async clean(outputDir: string): Promise<void> {
    try {
      const androidDir = path.join(outputDir, 'android');
      await fs.rm(androidDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore errors if directory doesn't exist
    }
  }
  
  /**
   * Calculate package size
   */
  private async calculatePackageSize(dir: string): Promise<number> {
    let totalSize = 0;
    
    try {
      const files = await fs.readdir(dir, { withFileTypes: true });
      
      for (const file of files) {
        const filePath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
          totalSize += await this.calculatePackageSize(filePath);
        } else {
          const stats = await fs.stat(filePath);
          totalSize += stats.size;
        }
      }
    } catch (error) {
      // Ignore errors
    }
    
    return totalSize;
  }
  
  /**
   * Count tokens in platform tokens
   */
  private countTokens(tokens: PlatformTokens): number {
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
