/**
 * Android Platform Builder
 *
 * Generates Android Library (AAR) or Gradle module with Jetpack Compose components.
 * Converts F1 tokens to Kotlin constants with proper dp/sp units.
 *
 * Requirements: 1.4, 2.2
 */
import { PlatformBuilder, ComponentDefinition } from './PlatformBuilder';
import { BuildConfig, AndroidBuildOptions } from '../types/BuildConfig';
import { BuildResult } from '../types/BuildResult';
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
export declare class AndroidBuilder implements PlatformBuilder {
    readonly platform: Platform;
    private buildConfig;
    constructor(buildOptions?: AndroidBuildOptions);
    /**
     * Parse dependency string to Dependency object
     */
    private parseDependency;
    /**
     * Build Android Library from component definitions
     */
    build(components: ComponentDefinition[], tokens: PlatformTokens, config: BuildConfig): Promise<BuildResult>;
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
    private generateAndroidLibrary;
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
    private generateBuildGradle;
    /**
     * Generate Android manifest
     */
    private generateAndroidManifest;
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
    generateTokens(tokens: PlatformTokens): string;
    /**
     * Generate primitive token constants
     */
    private generatePrimitiveTokens;
    /**
     * Generate semantic token constants
     */
    private generateSemanticTokens;
    /**
     * Generate component token constants (if needed)
     */
    private generateComponentTokens;
    /**
     * Generate spacing tokens file
     */
    private generateSpacingTokensFile;
    /**
     * Generate color tokens file
     */
    private generateColorTokensFile;
    /**
     * Generate typography tokens file
     */
    private generateTypographyTokensFile;
    /**
     * Generate Jetpack Compose component with proper structure
     */
    private generateComposeComponent;
    /**
     * Generate color extensions
     */
    private generateColorExtensions;
    /**
     * Generate modifier extensions
     */
    private generateModifierExtensions;
    /**
     * Generate test file
     */
    private generateTestFile;
    /**
     * Convert token name to Kotlin constant name (camelCase)
     *
     * Examples:
     * - "space100" -> "space100"
     * - "color.blue.500" -> "colorBlue500"
     * - "font-size-large" -> "fontSizeLarge"
     */
    private toKotlinConstantName;
    /**
     * Validate platform-specific implementation
     */
    validate(implementation: unknown): {
        valid: boolean;
        errors: string[];
        warnings: string[];
    };
    /**
     * Clean build artifacts
     */
    clean(outputDir: string): Promise<void>;
    /**
     * Calculate package size
     */
    private calculatePackageSize;
    /**
     * Count tokens in platform tokens
     */
    private countTokens;
}
//# sourceMappingURL=AndroidBuilder.d.ts.map