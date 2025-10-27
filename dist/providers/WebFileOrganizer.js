"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebFileOrganizer = void 0;
const PathProvider_1 = require("./PathProvider");
/**
 * Web file organization implementation
 * Organizes tokens for JavaScript/CSS structure with webpack/vite optimization
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
        switch (format) {
            case 'javascript':
                return 'DesignTokens.web.js';
            case 'css':
                return 'DesignTokens.web.css';
            default:
                throw new Error(`Unsupported format for web platform: ${format}`);
        }
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
                "import { tokens } from '@/tokens/DesignTokens.web.js'",
                "import tokens from '@/tokens/DesignTokens.web.js'",
                "import '@/tokens/DesignTokens.web.css'"
            ],
            watchPatterns: [
                'src/tokens/**/*.js',
                'src/tokens/**/*.css'
            ],
            treeShakingHints: [
                'Use named exports for individual tokens to enable tree-shaking',
                'Import only needed tokens: import { space100, fontSize100 } from "@/tokens"',
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
     */
    getJavaScriptExportName(tokenName) {
        // Keep camelCase for JavaScript exports
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
        if (!filePath.endsWith('.js') && !filePath.endsWith('.css')) {
            errors.push('Web token files should have .js or .css extension');
        }
        if (filePath.includes('DesignTokens.web')) {
            // Valid web token file
        }
        else {
            errors.push('Web token files should follow DesignTokens.web.[js|css] naming pattern');
        }
        return {
            valid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined
        };
    }
}
exports.WebFileOrganizer = WebFileOrganizer;
//# sourceMappingURL=WebFileOrganizer.js.map