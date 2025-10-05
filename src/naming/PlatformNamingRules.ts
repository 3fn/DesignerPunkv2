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
export type NamingConvention = 
  | 'camelCase'      // myTokenName
  | 'PascalCase'     // MyTokenName
  | 'kebab-case'     // my-token-name
  | 'snake_case'     // my_token_name
  | 'SCREAMING_SNAKE_CASE'; // MY_TOKEN_NAME

/**
 * Platform-specific naming rules
 */
export const PLATFORM_NAMING_RULES: Record<TargetPlatform, NamingRule> = {
  web: {
    platform: 'web',
    convention: 'kebab-case',
    prefix: '--', // CSS custom property prefix
    reservedKeywords: [
      'initial', 'inherit', 'unset', 'revert', 'auto',
      'none', 'normal', 'default'
    ],
    preserveAcronyms: false,
    categoryOverrides: {
      // CSS custom properties use kebab-case consistently
    }
  },
  
  ios: {
    platform: 'ios',
    convention: 'camelCase',
    reservedKeywords: [
      'class', 'struct', 'enum', 'protocol', 'extension',
      'func', 'var', 'let', 'return', 'if', 'else',
      'switch', 'case', 'default', 'for', 'while',
      'import', 'public', 'private', 'internal', 'static'
    ],
    preserveAcronyms: true,
    categoryOverrides: {
      // Swift uses camelCase consistently
    }
  },
  
  android: {
    platform: 'android',
    convention: 'snake_case',
    reservedKeywords: [
      'class', 'object', 'interface', 'fun', 'val', 'var',
      'return', 'if', 'else', 'when', 'for', 'while',
      'package', 'import', 'public', 'private', 'internal'
    ],
    preserveAcronyms: false,
    categoryOverrides: {
      // XML resources use snake_case consistently
    }
  }
};

/**
 * Convert token name to specified naming convention
 */
export function convertToNamingConvention(
  name: string,
  convention: NamingConvention,
  preserveAcronyms: boolean = false
): string {
  // First, split the name into words
  const words = splitIntoWords(name);
  
  switch (convention) {
    case 'camelCase':
      return words
        .map((word, index) => 
          index === 0 
            ? word.toLowerCase()
            : capitalizeWord(word, preserveAcronyms)
        )
        .join('');
    
    case 'PascalCase':
      return words
        .map(word => capitalizeWord(word, preserveAcronyms))
        .join('');
    
    case 'kebab-case':
      return words
        .map(word => word.toLowerCase())
        .join('-');
    
    case 'snake_case':
      return words
        .map(word => word.toLowerCase())
        .join('_');
    
    case 'SCREAMING_SNAKE_CASE':
      return words
        .map(word => word.toUpperCase())
        .join('_');
    
    default:
      return name;
  }
}

/**
 * Split a token name into individual words
 * Handles camelCase, PascalCase, kebab-case, snake_case, and numbers
 */
function splitIntoWords(name: string): string[] {
  // Remove common prefixes
  const cleanName = name.replace(/^(--|\$|@)/, '');
  
  // Split on various delimiters and camelCase boundaries
  return cleanName
    .replace(/([a-z])([A-Z])/g, '$1 $2')  // camelCase boundaries
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')  // PascalCase boundaries
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')  // Letter to number boundary
    .replace(/(\d)([a-zA-Z])/g, '$1 $2')  // Number to letter boundary
    .replace(/[-_]/g, ' ')  // kebab-case and snake_case
    .split(/\s+/)
    .filter(word => word.length > 0);
}

/**
 * Capitalize a word appropriately
 */
function capitalizeWord(word: string, preserveAcronyms: boolean): string {
  // If preserving acronyms and word is all uppercase, keep it
  if (preserveAcronyms && word === word.toUpperCase() && word.length > 1) {
    return word;
  }
  
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Validate token name against platform rules
 */
export function validateTokenName(
  name: string,
  platform: TargetPlatform,
  category?: TokenCategory
): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  const rules = PLATFORM_NAMING_RULES[platform];
  
  // Remove platform-specific prefix for validation
  const cleanName = name.replace(new RegExp(`^${rules.prefix || ''}`), '');
  
  // Check reserved keywords
  if (rules.reservedKeywords?.includes(cleanName.toLowerCase())) {
    errors.push(`Token name "${name}" conflicts with reserved keyword on ${platform}`);
  }
  
  // Check maximum length
  if (rules.maxLength && name.length > rules.maxLength) {
    errors.push(`Token name "${name}" exceeds maximum length of ${rules.maxLength} for ${platform}`);
  }
  
  // Check naming convention compliance
  // The name should already be in the correct format when passed to this function
  if (!followsNamingConvention(cleanName, rules.convention)) {
    const expectedName = convertToNamingConvention(
      cleanName,
      rules.convention,
      rules.preserveAcronyms
    );
    errors.push(
      `Token name "${name}" does not follow ${platform} naming convention (${rules.convention}). ` +
      `Expected: "${rules.prefix || ''}${expectedName}"`
    );
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Get platform-appropriate token name
 */
export function getPlatformTokenName(
  tokenName: string,
  platform: TargetPlatform,
  category?: TokenCategory
): string {
  const rules = PLATFORM_NAMING_RULES[platform];
  
  // Check for category-specific overrides
  const categoryRule = category && rules.categoryOverrides?.[category];
  const convention = categoryRule?.convention || rules.convention;
  const prefix = categoryRule?.prefix || rules.prefix || '';
  const suffix = categoryRule?.suffix || rules.suffix || '';
  
  // Convert to appropriate naming convention
  const convertedName = convertToNamingConvention(
    tokenName,
    convention,
    rules.preserveAcronyms
  );
  
  return `${prefix}${convertedName}${suffix}`;
}

/**
 * Check if a name follows a specific naming convention
 */
export function followsNamingConvention(
  name: string,
  convention: NamingConvention
): boolean {
  switch (convention) {
    case 'camelCase':
      return /^[a-z][a-zA-Z0-9]*$/.test(name);
    
    case 'PascalCase':
      return /^[A-Z][a-zA-Z0-9]*$/.test(name);
    
    case 'kebab-case':
      return /^[a-z][a-z0-9-]*$/.test(name);
    
    case 'snake_case':
      return /^[a-z][a-z0-9_]*$/.test(name);
    
    case 'SCREAMING_SNAKE_CASE':
      return /^[A-Z][A-Z0-9_]*$/.test(name);
    
    default:
      return false;
  }
}
