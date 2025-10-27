"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndroidFileOrganizer = void 0;
const PathProvider_1 = require("./PathProvider");
/**
 * Android file organization implementation
 * Organizes tokens for Kotlin/XML structure with Gradle integration
 */
class AndroidFileOrganizer extends PathProvider_1.BasePathProvider {
    constructor() {
        super(...arguments);
        this.platform = 'android';
    }
    getBaseDirectory() {
        return 'designsystem/src/main';
    }
    getFileName(format) {
        switch (format) {
            case 'kotlin':
                return 'DesignTokens.kt';
            case 'xml':
                return 'design_tokens.xml';
            default:
                throw new Error(`Unsupported format for Android platform: ${format}`);
        }
    }
    getDirectoryStructure() {
        // Android uses different directory structures for Kotlin and XML
        // This will be determined by the format in getFilePath override
        return [];
    }
    /**
     * Override getFilePath to handle Android's dual structure (kotlin/res)
     */
    getFilePath(format, options = {}) {
        const baseDir = options.customBaseDirectory || this.getBaseDirectory();
        const fileName = this.getFileName(format);
        if (format === 'kotlin') {
            return `${baseDir}/kotlin/com/designsystem/tokens/${fileName}`;
        }
        else if (format === 'xml') {
            return `${baseDir}/res/values/${fileName}`;
        }
        return `${baseDir}/${fileName}`;
    }
    getBuildSystemIntegration() {
        return {
            buildSystemType: 'gradle/android',
            importPatterns: [
                'import com.designsystem.tokens.DesignTokens',
                '// Access tokens via DesignTokens.space100',
                '// Access XML resources via R.dimen.space_100'
            ],
            watchPatterns: [
                'designsystem/src/main/kotlin/**/*.kt',
                'designsystem/src/main/res/values/**/*.xml'
            ],
            treeShakingHints: [
                'R8/ProGuard automatically removes unused constants',
                'Use const val for compile-time constants',
                'XML resources support resource qualifiers for configuration',
                'Kotlin object provides singleton access to tokens'
            ],
            additionalConfig: {
                moduleType: 'android-library',
                minSdkVersion: 24,
                targetSdkVersion: 34,
                kotlinVersion: '1.9.0',
                gradleIntegration: {
                    moduleName: 'designsystem',
                    buildType: 'library',
                    resourcePrefix: 'ds_'
                },
                resourceQualifiers: {
                    night: 'values-night', // Dark mode resources
                    ldpi: 'values-ldpi',
                    mdpi: 'values-mdpi',
                    hdpi: 'values-hdpi',
                    xhdpi: 'values-xhdpi',
                    xxhdpi: 'values-xxhdpi',
                    xxxhdpi: 'values-xxxhdpi'
                }
            }
        };
    }
    optimizeForBuildSystem(files) {
        const kotlinFile = files.find(f => f.endsWith('.kt'));
        const xmlFile = files.find(f => f.endsWith('.xml'));
        return {
            primaryFile: kotlinFile || files[0],
            supportingFiles: xmlFile ? [xmlFile] : [],
            importPath: 'com.designsystem.tokens.DesignTokens',
            optimizations: [
                'Kotlin object with const val for compile-time optimization',
                'XML resources support configuration qualifiers (night mode, density)',
                'Dp/sp units automatically scale across density buckets',
                'Resource qualifiers enable automatic mode-aware color resolution',
                'Separate values/values-night for light/dark mode support',
                'R8 optimization removes unused constants in release builds'
            ]
        };
    }
    /**
     * Get Kotlin constant naming convention
     * @param tokenName - Original token name
     * @returns Kotlin constant name
     */
    getKotlinConstantName(tokenName) {
        // Keep camelCase for Kotlin constants
        // space100 -> space100
        // fontSize125 -> fontSize125
        return tokenName;
    }
    /**
     * Get XML resource naming convention
     * @param tokenName - Original token name
     * @returns XML resource name
     */
    getXMLResourceName(tokenName) {
        // Convert camelCase to snake_case for XML resources
        // space100 -> space_100
        // fontSize125 -> font_size_125
        return tokenName.replace(/([A-Z])/g, '_$1').toLowerCase();
    }
    /**
     * Get Kotlin object organization
     * @returns Object organization pattern
     */
    getKotlinObjectOrganization() {
        return `
package com.designsystem.tokens

import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

object DesignTokens {
    // Spacing tokens
    val space100 = 8.dp
    
    // Typography tokens
    val fontSize100 = 16.sp
    
    // Color tokens (mode-aware via resource qualifiers)
    // Colors defined in XML resources with values/values-night
}
    `.trim();
    }
    /**
     * Get XML resource organization
     * @returns XML organization pattern
     */
    getXMLResourceOrganization() {
        return `
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Spacing tokens -->
    <dimen name="space_100">8dp</dimen>
    
    <!-- Typography tokens -->
    <dimen name="font_size_100">16sp</dimen>
    
    <!-- Color tokens (light mode) -->
    <color name="color_primary">#6750A4</color>
</resources>

<!-- values-night/design_tokens.xml for dark mode -->
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Color tokens (dark mode) -->
    <color name="color_primary">#D0BCFF</color>
</resources>
    `.trim();
    }
    /**
     * Validate Android-specific file path conventions
     */
    validatePath(filePath) {
        const baseValidation = super.validatePath(filePath);
        if (!baseValidation.valid) {
            return baseValidation;
        }
        const errors = [];
        // Android-specific validations
        if (!filePath.includes('designsystem/src/main')) {
            errors.push('Android token files should be in designsystem/src/main directory');
        }
        if (filePath.endsWith('.kt')) {
            if (!filePath.includes('kotlin/com/designsystem/tokens')) {
                errors.push('Kotlin token files should be in kotlin/com/designsystem/tokens package');
            }
        }
        else if (filePath.endsWith('.xml')) {
            if (!filePath.includes('res/values')) {
                errors.push('XML token files should be in res/values directory');
            }
        }
        else {
            errors.push('Android token files should have .kt or .xml extension');
        }
        return {
            valid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined
        };
    }
    /**
     * Get resource qualifier paths for mode-aware resources
     */
    getResourceQualifierPaths() {
        const baseDir = this.getBaseDirectory();
        return {
            light: `${baseDir}/res/values/design_tokens.xml`,
            dark: `${baseDir}/res/values-night/design_tokens.xml`,
            densities: {
                ldpi: `${baseDir}/res/values-ldpi/design_tokens.xml`,
                mdpi: `${baseDir}/res/values-mdpi/design_tokens.xml`,
                hdpi: `${baseDir}/res/values-hdpi/design_tokens.xml`,
                xhdpi: `${baseDir}/res/values-xhdpi/design_tokens.xml`,
                xxhdpi: `${baseDir}/res/values-xxhdpi/design_tokens.xml`,
                xxxhdpi: `${baseDir}/res/values-xxxhdpi/design_tokens.xml`
            }
        };
    }
}
exports.AndroidFileOrganizer = AndroidFileOrganizer;
//# sourceMappingURL=AndroidFileOrganizer.js.map