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
import { BuildResult, BuildError } from '../types/BuildResult';
/**
 * iOS validation result
 */
export interface iOSValidationResult {
    /** Overall validation success */
    valid: boolean;
    /** Package.swift manifest validation */
    packageManifestValid: boolean;
    /** Swift constants validation */
    swiftConstantsValid: boolean;
    /** Swift Package structure validation */
    packageStructureValid: boolean;
    /** iOS optimizations validation */
    optimizationsValid: boolean;
    /** Validation errors */
    errors: BuildError[];
    /** Validation warnings */
    warnings: string[];
    /** Validation details */
    details: {
        packageManifest?: string;
        swiftFiles?: string[];
        optimizations?: string[];
    };
}
/**
 * iOS Build Validator
 *
 * Validates iOS build output for correctness and completeness
 */
export declare class iOSBuildValidator {
    /**
     * Validate iOS build output
     */
    validate(buildResult: BuildResult): Promise<iOSValidationResult>;
    /**
     * Validate Package.swift manifest file
     */
    private validatePackageManifestFile;
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
     * Validate Swift constants compile correctly
     */
    private validateSwiftConstants;
    /**
     * Validate individual Swift file
     */
    private validateSwiftFile;
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
     * Validate Swift Package structure
     */
    private validatePackageStructureFiles;
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
     */
    private validateOptimizations;
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
    /**
     * Find all Swift files recursively
     */
    private findSwiftFiles;
    /**
     * List Swift files for reporting
     */
    private listSwiftFiles;
}
//# sourceMappingURL=iOSBuildValidator.d.ts.map