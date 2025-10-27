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
import { BuildResult, BuildError } from '../types/BuildResult';
/**
 * Android validation result
 */
export interface AndroidValidationResult {
    /** Overall validation success */
    valid: boolean;
    /** build.gradle.kts validation */
    buildGradleValid: boolean;
    /** Kotlin constants validation */
    kotlinConstantsValid: boolean;
    /** Gradle module import validation */
    moduleImportValid: boolean;
    /** Android optimizations validation */
    optimizationsValid: boolean;
    /** Validation errors */
    errors: BuildError[];
    /** Validation warnings */
    warnings: string[];
    /** Validation details */
    details: {
        buildGradle?: string;
        kotlinFiles?: string[];
        optimizations?: string[];
    };
}
/**
 * Android Build Validator
 *
 * Validates Android build output for correctness and completeness
 */
export declare class AndroidBuildValidator {
    /**
     * Validate Android build output
     */
    validate(buildResult: BuildResult): Promise<AndroidValidationResult>;
    /**
     * Validate build.gradle.kts syntax and structure
     */
    private validateBuildGradle;
    /**
     * Validate Kotlin constants compile correctly
     */
    private validateKotlinConstants;
    /**
     * Validate individual Kotlin file
     */
    private validateKotlinFile;
    /**
     * Validate Gradle module can be imported
     */
    private validateModuleStructure;
    /**
     * Validate Android-specific optimizations
     */
    private validateOptimizations;
    /**
     * Find all Kotlin files recursively
     */
    private findKotlinFiles;
    /**
     * List Kotlin files for reporting
     */
    private listKotlinFiles;
}
//# sourceMappingURL=AndroidBuildValidator.d.ts.map