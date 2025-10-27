import { TokenCategory } from '../types';
import { TargetPlatform } from '../types/TranslationOutput';
import { NamingRule, NamingConvention } from './PlatformNamingRules';
/**
 * Naming convention validation result
 */
export interface NamingValidationResult {
    /** Whether the name is valid */
    valid: boolean;
    /** Original token name */
    originalName: string;
    /** Platform-appropriate name */
    platformName: string;
    /** Platform being validated for */
    platform: TargetPlatform;
    /** Naming convention used */
    convention: NamingConvention;
    /** Validation errors (if any) */
    errors?: string[];
    /** Warnings (if any) */
    warnings?: string[];
}
/**
 * Cross-platform naming consistency result
 */
export interface CrossPlatformNamingResult {
    /** Original token name */
    tokenName: string;
    /** Token category */
    category?: TokenCategory;
    /** Platform-specific names */
    platformNames: Record<TargetPlatform, string>;
    /** Whether naming is consistent across platforms */
    consistent: boolean;
    /** Semantic meaning preserved across platforms */
    semanticMeaningPreserved: boolean;
    /** Any issues found */
    issues?: string[];
}
/**
 * Manages naming conventions across platforms
 * Ensures consistent and platform-appropriate token naming
 */
export declare class NamingConventionManager {
    private rules;
    constructor(customRules?: Partial<Record<TargetPlatform, NamingRule>>);
    /**
     * Get platform-appropriate token name
     */
    getTokenName(tokenName: string, platform: TargetPlatform, category?: TokenCategory): string;
    /**
     * Validate token name for a specific platform
     */
    validateForPlatform(tokenName: string, platform: TargetPlatform, category?: TokenCategory): NamingValidationResult;
    /**
     * Validate token name across all platforms
     */
    validateCrossPlatform(tokenName: string, category?: TokenCategory): CrossPlatformNamingResult;
    /**
     * Check if semantic meaning is preserved across platform names
     */
    private checkSemanticMeaningPreservation;
    /**
     * Convert name to specific naming convention
     */
    convertToConvention(name: string, convention: NamingConvention, preserveAcronyms?: boolean): string;
    /**
     * Check if name follows a specific convention
     */
    followsConvention(name: string, convention: NamingConvention): boolean;
    /**
     * Get naming rule for a platform
     */
    getRuleForPlatform(platform: TargetPlatform): NamingRule;
    /**
     * Batch validate multiple token names
     */
    validateBatch(tokenNames: string[], category?: TokenCategory): Map<string, CrossPlatformNamingResult>;
    /**
     * Get summary of naming validation results
     */
    getSummary(results: Map<string, CrossPlatformNamingResult>): {
        total: number;
        valid: number;
        invalid: number;
        warnings: number;
        semanticIssues: number;
    };
    /**
     * Generate naming convention documentation
     */
    generateDocumentation(): string;
}
//# sourceMappingURL=NamingConventionManager.d.ts.map