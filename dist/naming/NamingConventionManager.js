"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamingConventionManager = void 0;
const PlatformNamingRules_1 = require("./PlatformNamingRules");
/**
 * Manages naming conventions across platforms
 * Ensures consistent and platform-appropriate token naming
 */
class NamingConventionManager {
    constructor(customRules) {
        this.rules = {
            ...PlatformNamingRules_1.PLATFORM_NAMING_RULES,
            ...customRules
        };
    }
    /**
     * Get platform-appropriate token name
     */
    getTokenName(tokenName, platform, category) {
        return (0, PlatformNamingRules_1.getPlatformTokenName)(tokenName, platform, category);
    }
    /**
     * Validate token name for a specific platform
     */
    validateForPlatform(tokenName, platform, category) {
        const rules = this.rules[platform];
        const platformName = this.getTokenName(tokenName, platform, category);
        const validation = (0, PlatformNamingRules_1.validateTokenName)(platformName, platform, category);
        const warnings = [];
        // Check if original name differs significantly from platform name
        if (tokenName !== platformName && !tokenName.startsWith(rules.prefix || '')) {
            warnings.push(`Token name "${tokenName}" converted to "${platformName}" for ${platform} platform`);
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
    validateCrossPlatform(tokenName, category) {
        const platformNames = {
            web: this.getTokenName(tokenName, 'web', category),
            ios: this.getTokenName(tokenName, 'ios', category),
            android: this.getTokenName(tokenName, 'android', category)
        };
        const issues = [];
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
        const semanticMeaningPreserved = this.checkSemanticMeaningPreservation(tokenName, platformNames);
        if (!semanticMeaningPreserved) {
            issues.push('Semantic meaning may not be preserved across all platform naming conventions');
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
    checkSemanticMeaningPreservation(originalName, platformNames) {
        // Extract the core semantic parts (remove prefixes/suffixes)
        const extractCore = (name) => {
            return name
                .replace(/^(--|\$|@)/, '') // Remove prefixes
                .replace(/[-_]/g, '') // Remove separators
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
    convertToConvention(name, convention, preserveAcronyms = false) {
        return (0, PlatformNamingRules_1.convertToNamingConvention)(name, convention, preserveAcronyms);
    }
    /**
     * Check if name follows a specific convention
     */
    followsConvention(name, convention) {
        return (0, PlatformNamingRules_1.followsNamingConvention)(name, convention);
    }
    /**
     * Get naming rule for a platform
     */
    getRuleForPlatform(platform) {
        return this.rules[platform];
    }
    /**
     * Batch validate multiple token names
     */
    validateBatch(tokenNames, category) {
        const results = new Map();
        for (const tokenName of tokenNames) {
            results.set(tokenName, this.validateCrossPlatform(tokenName, category));
        }
        return results;
    }
    /**
     * Get summary of naming validation results
     */
    getSummary(results) {
        let valid = 0;
        let invalid = 0;
        let warnings = 0;
        let semanticIssues = 0;
        for (const result of results.values()) {
            if (result.consistent) {
                valid++;
            }
            else {
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
    generateDocumentation() {
        const docs = [
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
exports.NamingConventionManager = NamingConventionManager;
//# sourceMappingURL=NamingConventionManager.js.map