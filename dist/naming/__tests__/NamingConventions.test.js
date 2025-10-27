"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const NamingConventionManager_1 = require("../NamingConventionManager");
const PlatformNamingRules_1 = require("../PlatformNamingRules");
(0, globals_1.describe)('NamingConventionManager', () => {
    (0, globals_1.describe)('Platform-specific naming', () => {
        (0, globals_1.it)('should convert token names to web kebab-case with prefix', () => {
            const manager = new NamingConventionManager_1.NamingConventionManager();
            const result = manager.getTokenName('space100', 'web', 'spacing');
            (0, globals_1.expect)(result).toBe('--space-100');
        });
        (0, globals_1.it)('should convert token names to iOS camelCase', () => {
            const manager = new NamingConventionManager_1.NamingConventionManager();
            const result = manager.getTokenName('space100', 'ios', 'spacing');
            (0, globals_1.expect)(result).toBe('space100');
        });
        (0, globals_1.it)('should convert token names to Android snake_case', () => {
            const manager = new NamingConventionManager_1.NamingConventionManager();
            const result = manager.getTokenName('space100', 'android', 'spacing');
            (0, globals_1.expect)(result).toBe('space_100');
        });
        (0, globals_1.it)('should handle complex token names correctly', () => {
            const manager = new NamingConventionManager_1.NamingConventionManager();
            (0, globals_1.expect)(manager.getTokenName('fontSize125', 'web')).toBe('--font-size-125');
            (0, globals_1.expect)(manager.getTokenName('fontSize125', 'ios')).toBe('fontSize125');
            (0, globals_1.expect)(manager.getTokenName('fontSize125', 'android')).toBe('font_size_125');
        });
    });
    (0, globals_1.describe)('Cross-platform validation', () => {
        (0, globals_1.it)('should validate token names across all platforms', () => {
            const manager = new NamingConventionManager_1.NamingConventionManager();
            const result = manager.validateCrossPlatform('space100', 'spacing');
            (0, globals_1.expect)(result.tokenName).toBe('space100');
            (0, globals_1.expect)(result.platformNames.web).toBe('--space-100');
            (0, globals_1.expect)(result.platformNames.ios).toBe('space100');
            (0, globals_1.expect)(result.platformNames.android).toBe('space_100');
            (0, globals_1.expect)(result.consistent).toBe(true);
            (0, globals_1.expect)(result.semanticMeaningPreserved).toBe(true);
        });
        (0, globals_1.it)('should detect semantic meaning preservation', () => {
            const manager = new NamingConventionManager_1.NamingConventionManager();
            const result = manager.validateCrossPlatform('primaryColor', 'color');
            (0, globals_1.expect)(result.semanticMeaningPreserved).toBe(true);
            (0, globals_1.expect)(result.platformNames.web).toBe('--primary-color');
            (0, globals_1.expect)(result.platformNames.ios).toBe('primaryColor');
            (0, globals_1.expect)(result.platformNames.android).toBe('primary_color');
        });
    });
    (0, globals_1.describe)('Batch validation', () => {
        (0, globals_1.it)('should validate multiple token names', () => {
            const manager = new NamingConventionManager_1.NamingConventionManager();
            const tokenNames = ['space100', 'space150', 'fontSize100', 'radius050'];
            const results = manager.validateBatch(tokenNames, 'spacing');
            (0, globals_1.expect)(results.size).toBe(4);
            for (const result of results.values()) {
                (0, globals_1.expect)(result.consistent).toBe(true);
                (0, globals_1.expect)(result.semanticMeaningPreserved).toBe(true);
            }
        });
        (0, globals_1.it)('should provide summary of validation results', () => {
            const manager = new NamingConventionManager_1.NamingConventionManager();
            const tokenNames = ['space100', 'space150', 'fontSize100'];
            const results = manager.validateBatch(tokenNames);
            const summary = manager.getSummary(results);
            (0, globals_1.expect)(summary.total).toBe(3);
            (0, globals_1.expect)(summary.valid).toBe(3);
            (0, globals_1.expect)(summary.invalid).toBe(0);
        });
    });
});
(0, globals_1.describe)('Naming convention conversion', () => {
    (0, globals_1.describe)('camelCase conversion', () => {
        (0, globals_1.it)('should convert to camelCase', () => {
            (0, globals_1.expect)((0, PlatformNamingRules_1.convertToNamingConvention)('space-100', 'camelCase')).toBe('space100');
            (0, globals_1.expect)((0, PlatformNamingRules_1.convertToNamingConvention)('font_size_125', 'camelCase')).toBe('fontSize125');
            (0, globals_1.expect)((0, PlatformNamingRules_1.convertToNamingConvention)('PrimaryColor', 'camelCase')).toBe('primaryColor');
        });
    });
    (0, globals_1.describe)('PascalCase conversion', () => {
        (0, globals_1.it)('should convert to PascalCase', () => {
            (0, globals_1.expect)((0, PlatformNamingRules_1.convertToNamingConvention)('space-100', 'PascalCase')).toBe('Space100');
            (0, globals_1.expect)((0, PlatformNamingRules_1.convertToNamingConvention)('font_size_125', 'PascalCase')).toBe('FontSize125');
            (0, globals_1.expect)((0, PlatformNamingRules_1.convertToNamingConvention)('primaryColor', 'PascalCase')).toBe('PrimaryColor');
        });
    });
    (0, globals_1.describe)('kebab-case conversion', () => {
        (0, globals_1.it)('should convert to kebab-case', () => {
            (0, globals_1.expect)((0, PlatformNamingRules_1.convertToNamingConvention)('space100', 'kebab-case')).toBe('space-100');
            (0, globals_1.expect)((0, PlatformNamingRules_1.convertToNamingConvention)('fontSize125', 'kebab-case')).toBe('font-size-125');
            (0, globals_1.expect)((0, PlatformNamingRules_1.convertToNamingConvention)('PrimaryColor', 'kebab-case')).toBe('primary-color');
        });
    });
    (0, globals_1.describe)('snake_case conversion', () => {
        (0, globals_1.it)('should convert to snake_case', () => {
            (0, globals_1.expect)((0, PlatformNamingRules_1.convertToNamingConvention)('space100', 'snake_case')).toBe('space_100');
            (0, globals_1.expect)((0, PlatformNamingRules_1.convertToNamingConvention)('fontSize125', 'snake_case')).toBe('font_size_125');
            (0, globals_1.expect)((0, PlatformNamingRules_1.convertToNamingConvention)('PrimaryColor', 'snake_case')).toBe('primary_color');
        });
    });
    (0, globals_1.describe)('SCREAMING_SNAKE_CASE conversion', () => {
        (0, globals_1.it)('should convert to SCREAMING_SNAKE_CASE', () => {
            (0, globals_1.expect)((0, PlatformNamingRules_1.convertToNamingConvention)('space100', 'SCREAMING_SNAKE_CASE')).toBe('SPACE_100');
            (0, globals_1.expect)((0, PlatformNamingRules_1.convertToNamingConvention)('fontSize125', 'SCREAMING_SNAKE_CASE')).toBe('FONT_SIZE_125');
            (0, globals_1.expect)((0, PlatformNamingRules_1.convertToNamingConvention)('PrimaryColor', 'SCREAMING_SNAKE_CASE')).toBe('PRIMARY_COLOR');
        });
    });
});
(0, globals_1.describe)('Naming convention validation', () => {
    (0, globals_1.describe)('followsNamingConvention', () => {
        (0, globals_1.it)('should validate camelCase', () => {
            (0, globals_1.expect)((0, PlatformNamingRules_1.followsNamingConvention)('space100', 'camelCase')).toBe(true);
            (0, globals_1.expect)((0, PlatformNamingRules_1.followsNamingConvention)('fontSize125', 'camelCase')).toBe(true);
            (0, globals_1.expect)((0, PlatformNamingRules_1.followsNamingConvention)('Space100', 'camelCase')).toBe(false);
            (0, globals_1.expect)((0, PlatformNamingRules_1.followsNamingConvention)('space-100', 'camelCase')).toBe(false);
        });
        (0, globals_1.it)('should validate PascalCase', () => {
            (0, globals_1.expect)((0, PlatformNamingRules_1.followsNamingConvention)('Space100', 'PascalCase')).toBe(true);
            (0, globals_1.expect)((0, PlatformNamingRules_1.followsNamingConvention)('FontSize125', 'PascalCase')).toBe(true);
            (0, globals_1.expect)((0, PlatformNamingRules_1.followsNamingConvention)('space100', 'PascalCase')).toBe(false);
            (0, globals_1.expect)((0, PlatformNamingRules_1.followsNamingConvention)('space-100', 'PascalCase')).toBe(false);
        });
        (0, globals_1.it)('should validate kebab-case', () => {
            (0, globals_1.expect)((0, PlatformNamingRules_1.followsNamingConvention)('space-100', 'kebab-case')).toBe(true);
            (0, globals_1.expect)((0, PlatformNamingRules_1.followsNamingConvention)('font-size-125', 'kebab-case')).toBe(true);
            (0, globals_1.expect)((0, PlatformNamingRules_1.followsNamingConvention)('space100', 'kebab-case')).toBe(true); // No hyphens but still lowercase
            (0, globals_1.expect)((0, PlatformNamingRules_1.followsNamingConvention)('Space-100', 'kebab-case')).toBe(false);
        });
        (0, globals_1.it)('should validate snake_case', () => {
            (0, globals_1.expect)((0, PlatformNamingRules_1.followsNamingConvention)('space_100', 'snake_case')).toBe(true);
            (0, globals_1.expect)((0, PlatformNamingRules_1.followsNamingConvention)('font_size_125', 'snake_case')).toBe(true);
            (0, globals_1.expect)((0, PlatformNamingRules_1.followsNamingConvention)('space100', 'snake_case')).toBe(true); // No underscores but still lowercase
            (0, globals_1.expect)((0, PlatformNamingRules_1.followsNamingConvention)('Space_100', 'snake_case')).toBe(false);
        });
        (0, globals_1.it)('should validate SCREAMING_SNAKE_CASE', () => {
            (0, globals_1.expect)((0, PlatformNamingRules_1.followsNamingConvention)('SPACE_100', 'SCREAMING_SNAKE_CASE')).toBe(true);
            (0, globals_1.expect)((0, PlatformNamingRules_1.followsNamingConvention)('FONT_SIZE_125', 'SCREAMING_SNAKE_CASE')).toBe(true);
            (0, globals_1.expect)((0, PlatformNamingRules_1.followsNamingConvention)('space_100', 'SCREAMING_SNAKE_CASE')).toBe(false);
        });
    });
});
(0, globals_1.describe)('Platform token name generation', () => {
    (0, globals_1.it)('should generate web token names with CSS prefix', () => {
        (0, globals_1.expect)((0, PlatformNamingRules_1.getPlatformTokenName)('space100', 'web')).toBe('--space-100');
        (0, globals_1.expect)((0, PlatformNamingRules_1.getPlatformTokenName)('fontSize125', 'web')).toBe('--font-size-125');
    });
    (0, globals_1.it)('should generate iOS token names in camelCase', () => {
        (0, globals_1.expect)((0, PlatformNamingRules_1.getPlatformTokenName)('space100', 'ios')).toBe('space100');
        (0, globals_1.expect)((0, PlatformNamingRules_1.getPlatformTokenName)('fontSize125', 'ios')).toBe('fontSize125');
    });
    (0, globals_1.it)('should generate Android token names in snake_case', () => {
        (0, globals_1.expect)((0, PlatformNamingRules_1.getPlatformTokenName)('space100', 'android')).toBe('space_100');
        (0, globals_1.expect)((0, PlatformNamingRules_1.getPlatformTokenName)('fontSize125', 'android')).toBe('font_size_125');
    });
});
(0, globals_1.describe)('Reserved keyword validation', () => {
    (0, globals_1.it)('should detect reserved keywords for web', () => {
        const result = (0, PlatformNamingRules_1.validateTokenName)('initial', 'web');
        (0, globals_1.expect)(result.valid).toBe(false);
        (0, globals_1.expect)(result.errors).toBeDefined();
        (0, globals_1.expect)(result.errors?.[0]).toContain('reserved keyword');
    });
    (0, globals_1.it)('should detect reserved keywords for iOS', () => {
        const result = (0, PlatformNamingRules_1.validateTokenName)('class', 'ios');
        (0, globals_1.expect)(result.valid).toBe(false);
        (0, globals_1.expect)(result.errors).toBeDefined();
        (0, globals_1.expect)(result.errors?.[0]).toContain('reserved keyword');
    });
    (0, globals_1.it)('should detect reserved keywords for Android', () => {
        const result = (0, PlatformNamingRules_1.validateTokenName)('class', 'android');
        (0, globals_1.expect)(result.valid).toBe(false);
        (0, globals_1.expect)(result.errors).toBeDefined();
        (0, globals_1.expect)(result.errors?.[0]).toContain('reserved keyword');
    });
    (0, globals_1.it)('should allow non-reserved keywords', () => {
        (0, globals_1.expect)((0, PlatformNamingRules_1.validateTokenName)('space100', 'web').valid).toBe(true);
        (0, globals_1.expect)((0, PlatformNamingRules_1.validateTokenName)('fontSize125', 'ios').valid).toBe(true);
        (0, globals_1.expect)((0, PlatformNamingRules_1.validateTokenName)('radius050', 'android').valid).toBe(true);
    });
});
//# sourceMappingURL=NamingConventions.test.js.map