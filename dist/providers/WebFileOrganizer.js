"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebFileOrganizer = void 0;
const PathProvider_1 = require("./PathProvider");
/**
 * Web file organization implementation
 * Organizes tokens for CSS structure with webpack/vite optimization
 */
class WebFileOrganizer extends PathProvider_1.BasePathProvider {
    constructor() {
        super(...arguments);
        this.platform = 'web';
    }
    getBaseDirectory() {
        return 'src/tokens';
    }
    getFileName(format) {
        // Web platform only supports CSS format
        // Format parameter maintained for interface compatibility
        return 'DesignTokens.web.css';
    }
    getDirectoryStructure() {
        // Flat structure for web - all tokens in base directory
        // This optimizes for tree-shaking and simple imports
        return [];
    }
    getBuildSystemIntegration() {
        return {
            buildSystemType: 'webpack/vite',
            importPatterns: [
                "import '@/tokens/DesignTokens.web.css'"
            ],
            watchPatterns: [
                'src/tokens/**/*.css'
            ],
            treeShakingHints: [
                'CSS custom properties are automatically available globally'
            ],
            additionalConfig: {
                moduleType: 'esm',
                sideEffects: false, // Enable tree-shaking
                cssModules: false, // Global CSS custom properties
                postcssPlugins: ['autoprefixer', 'cssnano']
            }
        };
    }
    optimizeForBuildSystem(files) {
        const jsFile = files.find(f => f.endsWith('.js'));
        const cssFile = files.find(f => f.endsWith('.css'));
        return {
            primaryFile: jsFile || files[0],
            supportingFiles: cssFile ? [cssFile] : [],
            importPath: '@/tokens/DesignTokens.web',
            optimizations: [
                'JavaScript tokens exported as named exports for tree-shaking',
                'CSS custom properties loaded globally for runtime theme switching',
                'REM units enable responsive scaling with root font-size',
                'Separate JS/CSS files allow selective loading based on use case',
                'ESM format enables static analysis and dead code elimination'
            ]
        };
    }
    /**
     * Get CSS custom property naming convention
     * @param tokenName - Original token name
     * @returns CSS custom property name
     */
    getCSSCustomPropertyName(tokenName) {
        // Convert camelCase to kebab-case for CSS custom properties
        // space100 -> --space-100
        // fontSize125 -> --font-size-125
        return `--${tokenName.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    }
    /**
     * Get JavaScript export naming convention
     * @param tokenName - Original token name
     * @returns JavaScript export name
     * @deprecated JavaScript format no longer supported - method maintained for interface compatibility
     */
    getJavaScriptExportName(tokenName) {
        // Keep camelCase for naming convention
        return tokenName;
    }
    /**
     * Validate web-specific file path conventions
     */
    validatePath(filePath) {
        const baseValidation = super.validatePath(filePath);
        if (!baseValidation.valid) {
            return baseValidation;
        }
        const errors = [];
        // Web-specific validations
        if (!filePath.includes('src/tokens')) {
            errors.push('Web token files should be in src/tokens directory');
        }
        if (!filePath.endsWith('.css')) {
            errors.push('Web token files should have .css extension');
        }
        if (filePath.includes('DesignTokens.web')) {
            // Valid web token file
        }
        else {
            errors.push('Web token files should follow DesignTokens.web.css naming pattern');
        }
        return {
            valid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined
        };
    }
}
exports.WebFileOrganizer = WebFileOrganizer;
//# sourceMappingURL=WebFileOrganizer.js.map