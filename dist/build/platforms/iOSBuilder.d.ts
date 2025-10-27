/**
 * iOS Platform Builder
 *
 * Generates Swift Package with SwiftUI components from component definitions.
 * Converts F1 tokens to Swift constants with proper pt units.
 *
 * Requirements: 1.3, 2.1
 */
import { PlatformBuilder, ComponentDefinition } from './PlatformBuilder';
import { BuildConfig, iOSBuildOptions } from '../types/BuildConfig';
import { BuildResult } from '../types/BuildResult';
import { Platform } from '../types/Platform';
import { PlatformTokens } from '../tokens/PlatformTokens';
/**
 * Swift Package structure
 */
export interface SwiftPackage {
    /** Package.swift manifest content */
    packageManifest: string;
    /** Swift source files */
    sourceFiles: SwiftFile[];
    /** Package resources */
    resources: Resource[];
    /** Package dependencies */
    dependencies: Dependency[];
}
/**
 * Swift source file
 */
export interface SwiftFile {
    /** File path relative to package root */
    path: string;
    /** File content */
    content: string;
}
/**
 * Package resource
 */
export interface Resource {
    /** Resource path */
    path: string;
    /** Resource type */
    type: 'asset' | 'data' | 'other';
}
/**
 * Package dependency
 */
export interface Dependency {
    /** Dependency name */
    name: string;
    /** Dependency URL */
    url: string;
    /** Version requirement */
    version: string;
}
/**
 * iOS build configuration
 */
export interface iOSBuildConfig {
    /** Swift version */
    swiftVersion: string;
    /** Minimum deployment target */
    minimumDeploymentTarget: string;
    /** Package dependencies */
    dependencies: Dependency[];
    /** Package name */
    packageName: string;
    /** Product name */
    productName: string;
}
/**
 * iOS Platform Builder Implementation
 *
 * Builds Swift Package with SwiftUI components and token constants
 */
export declare class iOSBuilder implements PlatformBuilder {
    readonly platform: Platform;
    private buildConfig;
    constructor(buildOptions?: iOSBuildOptions);
    /**
     * Build Swift Package from component definitions
     */
    build(components: ComponentDefinition[], tokens: PlatformTokens, config: BuildConfig): Promise<BuildResult>;
    /**
     * Generate Swift Package structure with proper organization
     *
     * Creates a complete Swift Package with:
     * - Token constants organized by category
     * - SwiftUI component implementations
     * - Proper file organization (Tokens/, Components/, Extensions/)
     * - Package manifest with dependencies
     *
     * Requirements: 2.1, 2.5
     */
    private generateSwiftPackage;
    /**
     * Generate Package.swift manifest with proper dependencies
     *
     * Creates a complete Swift Package manifest with:
     * - Swift version and deployment targets
     * - Package dependencies (if any)
     * - Library products
     * - Source targets with proper organization
     * - Test targets
     *
     * Requirements: 2.1, 2.5
     */
    private generatePackageManifest;
    /**
     * Generate Swift token constants from platform tokens
     *
     * Generates Swift constants from:
     * - Primitive tokens (space100, color.blue.500, etc.)
     * - Semantic tokens (space.normal, color.primary, etc.)
     * - Component tokens (if needed)
     *
     * Requirements: 3.4, 3.7
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
     * Generate Color extension for hex support
     */
    private generateColorExtension;
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
     * Generate SwiftUI component with proper structure
     */
    private generateSwiftUIComponent;
    /**
     * Generate color extensions
     */
    private generateColorExtensions;
    /**
     * Generate view extensions
     */
    private generateViewExtensions;
    /**
     * Generate main module file
     */
    private generateModuleFile;
    /**
     * Generate Swift component file (placeholder)
     */
    private generateComponentFile;
    /**
     * Convert token name to Swift constant name
     */
    private toSwiftConstantName;
    /**
     * Validate Swift implementation
     */
    validate(implementation: unknown): {
        valid: boolean;
        errors: string[];
        warnings: string[];
    };
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
    validateSwiftSyntax(swiftCode: string): {
        valid: boolean;
        errors: string[];
        warnings: string[];
    };
    /**
     * Check if string is a valid hex color
     */
    private isValidHexColor;
    /**
     * Check if string is a valid Swift identifier
     */
    private isValidSwiftIdentifier;
    /**
     * Clean build artifacts
     */
    clean(outputDir: string): Promise<void>;
    /**
     * Calculate package size
     */
    private calculatePackageSize;
    /**
     * Count total tokens
     */
    private countTokens;
    /**
     * Generate basic test file for Swift Package
     */
    private generateTestFile;
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
    validatePackageManifest(manifest: string): {
        valid: boolean;
        errors: string[];
        warnings: string[];
    };
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
    validatePackageStructure(packagePath: string): {
        valid: boolean;
        errors: string[];
        warnings: string[];
        hasPackageManifest: boolean;
        hasSourcesDirectory: boolean;
        hasTestsDirectory: boolean;
        hasMainModule: boolean;
    };
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
    validateiOSOptimizations(componentCode: string): {
        valid: boolean;
        errors: string[];
        warnings: string[];
        usesSwiftUI: boolean;
        usesCGFloat: boolean;
        usesColorExtension: boolean;
    };
}
//# sourceMappingURL=iOSBuilder.d.ts.map