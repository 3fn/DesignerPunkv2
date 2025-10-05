import { TokenCategory } from '../types';
import { TargetPlatform } from '../types/TranslationOutput';
import {
  NamingRule,
  NamingConvention,
  PLATFORM_NAMING_RULES,
  convertToNamingConvention,
  validateTokenName,
  getPlatformTokenName,
  followsNamingConvention
} from './PlatformNamingRules';

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
export class NamingConventionManager {
  private rules: Record<TargetPlatform, NamingRule>;
  
  constructor(customRules?: Partial<Record<TargetPlatform, NamingRule>>) {
    this.rules = {
      ...PLATFORM_NAMING_RULES,
      ...customRules
    };
  }
  
  /**
   * Get platform-appropriate token name
   */
  getTokenName(
    tokenName: string,
    platform: TargetPlatform,
    category?: TokenCategory
  ): string {
    return getPlatformTokenName(tokenName, platform, category);
  }
  
  /**
   * Validate token name for a specific platform
   */
  validateForPlatform(
    tokenName: string,
    platform: TargetPlatform,
    category?: TokenCategory
  ): NamingValidationResult {
    const rules = this.rules[platform];
    const platformName = this.getTokenName(tokenName, platform, category);
    const validation = validateTokenName(platformName, platform, category);
    
    const warnings: string[] = [];
    
    // Check if original name differs significantly from platform name
    if (tokenName !== platformName && !tokenName.startsWith(rules.prefix || '')) {
      warnings.push(
        `Token name "${tokenName}" converted to "${platformName}" for ${platform} platform`
      );
    }
    
    return {
      valid: validation.valid,
      originalName: tokenName,
      platformName,
      platform,
      convention: rules.convention,
      errors: validation.errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
  
  /**
   * Validate token name across all platforms
   */
  validateCrossPlatform(
    tokenName: string,
    category?: TokenCategory
  ): CrossPlatformNamingResult {
    const platformNames: Record<TargetPlatform, string> = {
      web: this.getTokenName(tokenName, 'web', category),
      ios: this.getTokenName(tokenName, 'ios', category),
      android: this.getTokenName(tokenName, 'android', category)
    };
    
    const issues: string[] = [];
    
    // Validate each platform
    const validations = {
      web: this.validateForPlatform(tokenName, 'web', category),
      ios: this.validateForPlatform(tokenName, 'ios', category),
      android: this.validateForPlatform(tokenName, 'android', category)
    };
    
    // Collect errors from all platforms
    for (const [platform, validation] of Object.entries(validations)) {
      if (validation.errors) {
        issues.push(...validation.errors.map(err => `[${platform}] ${err}`));
      }
    }
    
    // Check semantic meaning preservation
    const semanticMeaningPreserved = this.checkSemanticMeaningPreservation(
      tokenName,
      platformNames
    );
    
    if (!semanticMeaningPreserved) {
      issues.push(
        'Semantic meaning may not be preserved across all platform naming conventions'
      );
    }
    
    return {
      tokenName,
      category,
      platformNames,
      consistent: issues.length === 0,
      semanticMeaningPreserved,
      issues: issues.length > 0 ? issues : undefined
    };
  }
  
  /**
   * Check if semantic meaning is preserved across platform names
   */
  private checkSemanticMeaningPreservation(
    originalName: string,
    platformNames: Record<TargetPlatform, string>
  ): boolean {
    // Extract the core semantic parts (remove prefixes/suffixes)
    const extractCore = (name: string): string => {
      return name
        .replace(/^(--|\$|@)/, '')  // Remove prefixes
        .replace(/[-_]/g, '')        // Remove separators
        .toLowerCase();
    };
    
    const originalCore = extractCore(originalName);
    
    // Check that all platform names contain the same core semantic meaning
    return Object.values(platformNames).every(platformName => {
      const platformCore = extractCore(platformName);
      return platformCore === originalCore;
    });
  }
  
  /**
   * Convert name to specific naming convention
   */
  convertToConvention(
    name: string,
    convention: NamingConvention,
    preserveAcronyms: boolean = false
  ): string {
    return convertToNamingConvention(name, convention, preserveAcronyms);
  }
  
  /**
   * Check if name follows a specific convention
   */
  followsConvention(name: string, convention: NamingConvention): boolean {
    return followsNamingConvention(name, convention);
  }
  
  /**
   * Get naming rule for a platform
   */
  getRuleForPlatform(platform: TargetPlatform): NamingRule {
    return this.rules[platform];
  }
  
  /**
   * Batch validate multiple token names
   */
  validateBatch(
    tokenNames: string[],
    category?: TokenCategory
  ): Map<string, CrossPlatformNamingResult> {
    const results = new Map<string, CrossPlatformNamingResult>();
    
    for (const tokenName of tokenNames) {
      results.set(tokenName, this.validateCrossPlatform(tokenName, category));
    }
    
    return results;
  }
  
  /**
   * Get summary of naming validation results
   */
  getSummary(results: Map<string, CrossPlatformNamingResult>): {
    total: number;
    valid: number;
    invalid: number;
    warnings: number;
    semanticIssues: number;
  } {
    let valid = 0;
    let invalid = 0;
    let warnings = 0;
    let semanticIssues = 0;
    
    for (const result of results.values()) {
      if (result.consistent) {
        valid++;
      } else {
        invalid++;
      }
      
      if (result.issues && result.issues.length > 0) {
        warnings += result.issues.length;
      }
      
      if (!result.semanticMeaningPreserved) {
        semanticIssues++;
      }
    }
    
    return {
      total: results.size,
      valid,
      invalid,
      warnings,
      semanticIssues
    };
  }
  
  /**
   * Generate naming convention documentation
   */
  generateDocumentation(): string {
    const docs: string[] = [
      '# Token Naming Conventions',
      '',
      'Platform-specific naming conventions for design tokens.',
      ''
    ];
    
    for (const [platform, rules] of Object.entries(this.rules)) {
      docs.push(`## ${platform.toUpperCase()}`);
      docs.push('');
      docs.push(`**Convention:** ${rules.convention}`);
      
      if (rules.prefix) {
        docs.push(`**Prefix:** \`${rules.prefix}\``);
      }
      
      if (rules.suffix) {
        docs.push(`**Suffix:** \`${rules.suffix}\``);
      }
      
      if (rules.preserveAcronyms) {
        docs.push('**Preserves Acronyms:** Yes');
      }
      
      if (rules.maxLength) {
        docs.push(`**Max Length:** ${rules.maxLength}`);
      }
      
      if (rules.reservedKeywords && rules.reservedKeywords.length > 0) {
        docs.push('');
        docs.push('**Reserved Keywords:**');
        docs.push(rules.reservedKeywords.map(kw => `- \`${kw}\``).join('\n'));
      }
      
      docs.push('');
    }
    
    return docs.join('\n');
  }
}
