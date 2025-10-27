"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLATFORM_NAMING_RULES = void 0;
exports.convertToNamingConvention = convertToNamingConvention;
exports.validateTokenName = validateTokenName;
exports.getPlatformTokenName = getPlatformTokenName;
exports.followsNamingConvention = followsNamingConvention;
/**
 * Platform-specific naming rules
 */
exports.PLATFORM_NAMING_RULES = {
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
function convertToNamingConvention(name, convention, preserveAcronyms = false) {
    // First, split the name into words
    const words = splitIntoWords(name);
    switch (convention) {
        case 'camelCase':
            return words
                .map((word, index) => index === 0
                ? word.toLowerCase()
                : capitalizeWord(word, preserveAcronyms))
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
function splitIntoWords(name) {
    // Remove common prefixes
    const cleanName = name.replace(/^(--|\$|@)/, '');
    // Split on various delimiters and camelCase boundaries
    return cleanName
        .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase boundaries
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // PascalCase boundaries
        .replace(/([a-zA-Z])(\d)/g, '$1 $2') // Letter to number boundary
        .replace(/(\d)([a-zA-Z])/g, '$1 $2') // Number to letter boundary
        .replace(/[-_.]/g, ' ') // kebab-case, snake_case, and dot notation
        .split(/\s+/)
        .filter(word => word.length > 0);
}
/**
 * Capitalize a word appropriately
 */
function capitalizeWord(word, preserveAcronyms) {
    // If preserving acronyms and word is all uppercase, keep it
    if (preserveAcronyms && word === word.toUpperCase() && word.length > 1) {
        return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
/**
 * Validate token name against platform rules
 */
function validateTokenName(name, platform, category) {
    const errors = [];
    const rules = exports.PLATFORM_NAMING_RULES[platform];
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
        const expectedName = convertToNamingConvention(cleanName, rules.convention, rules.preserveAcronyms);
        errors.push(`Token name "${name}" does not follow ${platform} naming convention (${rules.convention}). ` +
            `Expected: "${rules.prefix || ''}${expectedName}"`);
    }
    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined
    };
}
/**
 * Get platform-appropriate token name
 */
function getPlatformTokenName(tokenName, platform, category) {
    const rules = exports.PLATFORM_NAMING_RULES[platform];
    // Check for category-specific overrides
    const categoryRule = category && rules.categoryOverrides?.[category];
    const convention = categoryRule?.convention || rules.convention;
    const prefix = categoryRule?.prefix || rules.prefix || '';
    const suffix = categoryRule?.suffix || rules.suffix || '';
    // Convert to appropriate naming convention
    const convertedName = convertToNamingConvention(tokenName, convention, rules.preserveAcronyms);
    return `${prefix}${convertedName}${suffix}`;
}
/**
 * Check if a name follows a specific naming convention
 */
function followsNamingConvention(name, convention) {
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
//# sourceMappingURL=PlatformNamingRules.js.map