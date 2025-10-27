import { TokenCategory } from '../types';
import { TargetPlatform } from '../types/TranslationOutput';
/**
 * Platform-specific naming rule definition
 */
export interface NamingRule {
    /** Platform this rule applies to */
    platform: TargetPlatform;
    /** Naming convention pattern (e.g., 'camelCase', 'kebab-case', 'snake_case') */
    convention: NamingConvention;
    /** Prefix to add to token names (optional) */
    prefix?: string;
    /** Suffix to add to token names (optional) */
    suffix?: string;
    /** Category-specific overrides */
    categoryOverrides?: Partial<Record<TokenCategory, CategoryNamingRule>>;
    /** Reserved keywords that cannot be used as token names */
    reservedKeywords?: string[];
    /** Maximum name length (optional) */
    maxLength?: number;
    /** Whether to preserve acronyms in uppercase */
    preserveAcronyms?: boolean;
}
/**
 * Category-specific naming rule
 */
export interface CategoryNamingRule {
    /** Override convention for this category */
    convention?: NamingConvention;
    /** Override prefix for this category */
    prefix?: string;
    /** Override suffix for this category */
    suffix?: string;
}
/**
 * Supported naming conventions
 */
export type NamingConvention = 'camelCase' | 'PascalCase' | 'kebab-case' | 'snake_case' | 'SCREAMING_SNAKE_CASE';
/**
 * Platform-specific naming rules
 */
export declare const PLATFORM_NAMING_RULES: Record<TargetPlatform, NamingRule>;
/**
 * Convert token name to specified naming convention
 */
export declare function convertToNamingConvention(name: string, convention: NamingConvention, preserveAcronyms?: boolean): string;
/**
 * Validate token name against platform rules
 */
export declare function validateTokenName(name: string, platform: TargetPlatform, category?: TokenCategory): {
    valid: boolean;
    errors?: string[];
};
/**
 * Get platform-appropriate token name
 */
export declare function getPlatformTokenName(tokenName: string, platform: TargetPlatform, category?: TokenCategory): string;
/**
 * Check if a name follows a specific naming convention
 */
export declare function followsNamingConvention(name: string, convention: NamingConvention): boolean;
//# sourceMappingURL=PlatformNamingRules.d.ts.map