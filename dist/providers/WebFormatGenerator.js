"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebFormatGenerator = void 0;
const FormatProvider_1 = require("./FormatProvider");
const PlatformNamingRules_1 = require("../naming/PlatformNamingRules");
/**
 * Web-specific format generator
 * Generates CSS custom properties for web platform token usage
 */
class WebFormatGenerator extends FormatProvider_1.BaseFormatProvider {
    constructor(outputFormat = 'css') {
        super();
        this.platform = 'web';
        this.formats = ['css', 'javascript'];
        this.outputFormat = outputFormat;
    }
    formatToken(token) {
        const tokenName = this.getTokenName(token.name, token.category);
        // Handle semantic-only tokens (like z-index tokens) that have direct values
        // These tokens have a 'value' property and 'platforms' array but no 'primitiveReferences'
        if ('value' in token && typeof token.value === 'number' &&
            'platforms' in token && Array.isArray(token.platforms)) {
            // This is a semantic-only token with a direct value (e.g., z-index tokens)
            if (this.outputFormat === 'css') {
                return this.formatCSSCustomProperty(tokenName, token.value, 'unitless');
            }
            else {
                return this.formatJavaScriptConstant(tokenName, token.value, 'unitless');
            }
        }
        // Check if this is a primitive token (has 'baseValue' property)
        const isPrimitiveToken = 'baseValue' in token;
        // For primitive tokens or semantic tokens with platform-specific values
        let platformValue;
        if (isPrimitiveToken) {
            // This is a primitive token
            const primitiveToken = token;
            platformValue = primitiveToken.platforms.web;
        }
        else {
            // This is a semantic token - check for platforms property first
            const semanticToken = token;
            if (semanticToken.platforms?.web) {
                platformValue = semanticToken.platforms.web;
            }
            else {
                // Get the first resolved primitive token
                const primitiveToken = semanticToken.primitiveTokens ? Object.values(semanticToken.primitiveTokens)[0] : null;
                if (!primitiveToken) {
                    throw new Error(`Semantic token ${token.name} has no resolved primitive tokens`);
                }
                platformValue = primitiveToken.platforms.web;
            }
        }
        if (!platformValue) {
            throw new Error(`Token ${token.name} has no web platform value`);
        }
        if (this.outputFormat === 'css') {
            return this.formatCSSCustomProperty(tokenName, platformValue.value, platformValue.unit);
        }
        else {
            return this.formatJavaScriptConstant(tokenName, platformValue.value, platformValue.unit);
        }
    }
    generateHeader(metadata) {
        const timestamp = metadata?.generatedAt?.toISOString() || new Date().toISOString();
        const version = metadata?.version || '1.0.0';
        if (this.outputFormat === 'css') {
            return [
                '/**',
                ' * DesignerPunk Design System - Web Tokens',
                ` * Generated: ${timestamp}`,
                ` * Version: ${version}`,
                ' * Platform: Web (CSS Custom Properties)',
                ' *',
                ' * USAGE GUIDANCE:',
                ' * - Use semantic tokens (colorPrimary, borderDefault) for all UI development',
                ' * - Use primitive tokens (purple300, space100) only when no semantic exists',
                ' * - Comments show semantic → primitive relationships',
                ' */',
                '',
                ':root {'
            ].join('\n');
        }
        else {
            return [
                '/**',
                ' * DesignerPunk Design System - Web Tokens',
                ` * Generated: ${timestamp}`,
                ` * Version: ${version}`,
                ' * Platform: Web (JavaScript Constants)',
                ' *',
                ' * USAGE GUIDANCE:',
                ' * - Use semantic tokens (colorPrimary, borderDefault) for all UI development',
                ' * - Use primitive tokens (purple300, space100) only when no semantic exists',
                ' * - Comments show semantic → primitive relationships',
                ' */',
                '',
                'export const DesignTokens = {'
            ].join('\n');
        }
    }
    generateFooter() {
        if (this.outputFormat === 'css') {
            return '}';
        }
        else {
            return '};';
        }
    }
    validateSyntax(content) {
        const errors = [];
        if (this.outputFormat === 'css') {
            // Basic CSS validation
            if (!content.includes(':root {')) {
                errors.push('Missing :root selector');
            }
            if (!content.match(/--[\w-]+:/)) {
                errors.push('No CSS custom properties found');
            }
            // Check for balanced braces
            const openBraces = (content.match(/{/g) || []).length;
            const closeBraces = (content.match(/}/g) || []).length;
            if (openBraces !== closeBraces) {
                errors.push('Unbalanced braces in CSS');
            }
        }
        else {
            // Basic JavaScript validation
            if (!content.includes('export const')) {
                errors.push('Missing export statement');
            }
            // Check for balanced braces
            const openBraces = (content.match(/{/g) || []).length;
            const closeBraces = (content.match(/}/g) || []).length;
            if (openBraces !== closeBraces) {
                errors.push('Unbalanced braces in JavaScript');
            }
        }
        return {
            valid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined
        };
    }
    getTokenName(tokenName, category) {
        // For JavaScript output, we need camelCase without prefix
        if (this.outputFormat === 'javascript') {
            // Use iOS naming rules (camelCase) for JavaScript
            const camelCaseName = (0, PlatformNamingRules_1.getPlatformTokenName)(tokenName, 'ios', category);
            return camelCaseName;
        }
        // For CSS output, use web platform naming rules (kebab-case with -- prefix)
        return (0, PlatformNamingRules_1.getPlatformTokenName)(tokenName, this.platform, category);
    }
    formatCSSCustomProperty(name, value, unit) {
        const formattedValue = this.formatCSSValue(value, unit);
        // Check if name already has the -- prefix (from getPlatformTokenName)
        const prefix = name.startsWith('--') ? '' : '--';
        return `  ${prefix}${name}: ${formattedValue};`;
    }
    formatJavaScriptConstant(name, value, unit) {
        const formattedValue = this.formatJSValue(value, unit);
        return `  ${name}: ${formattedValue},`;
    }
    formatCSSValue(value, unit) {
        if (typeof value === 'object') {
            // For color tokens with mode/theme structure, we'll need special handling
            // For now, return as JSON string
            return JSON.stringify(value);
        }
        if (typeof value === 'string') {
            // Font family or other string values
            return value;
        }
        // Numeric values with units
        switch (unit) {
            case 'rem':
                return `${value}rem`;
            case 'px':
                return `${value}px`;
            case 'em':
                return `${value}em`;
            case 'unitless':
                return String(value);
            case 'fontFamily':
                return String(value);
            case 'fontWeight':
                return String(value);
            case 'hex':
                return String(value);
            default:
                return String(value);
        }
    }
    formatJSValue(value, unit) {
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        if (typeof value === 'string') {
            return `'${value}'`;
        }
        // Numeric values - include unit as string for JavaScript
        switch (unit) {
            case 'rem':
                return `'${value}rem'`;
            case 'px':
                return `'${value}px'`;
            case 'em':
                return `'${value}em'`;
            case 'unitless':
                return String(value);
            case 'fontFamily':
                return `'${value}'`;
            case 'fontWeight':
                return String(value);
            case 'hex':
                return `'${value}'`;
            default:
                return String(value);
        }
    }
    generateCategoryComment(category) {
        if (this.outputFormat === 'css') {
            return `\n  /* ${category.toUpperCase()} TOKENS */`;
        }
        else {
            return `\n  // ${category.toUpperCase()} TOKENS`;
        }
    }
    generateMathematicalComment(token) {
        if (this.outputFormat === 'css') {
            return `  /* ${token.mathematicalRelationship} */`;
        }
        else {
            return `  // ${token.mathematicalRelationship}`;
        }
    }
    /**
     * Format a single-reference semantic token
     * Generates: export const colorPrimary = purple300;
     */
    formatSingleReferenceToken(semantic) {
        // Get the primitive reference name (e.g., 'purple300' from primitiveReferences)
        const primitiveRef = semantic.primitiveReferences.value ||
            semantic.primitiveReferences.default ||
            Object.values(semantic.primitiveReferences)[0];
        if (!primitiveRef) {
            throw new Error(`Semantic token ${semantic.name} has no primitive reference`);
        }
        // Convert semantic token name to appropriate format
        const semanticName = this.getTokenName(semantic.name, semantic.category);
        // For JavaScript output, reference the primitive token by name
        if (this.outputFormat === 'javascript') {
            // Remove -- prefix if present for JavaScript
            const jsSemanticName = semanticName.startsWith('--')
                ? semanticName.slice(2)
                : semanticName;
            const jsPrimitiveRef = primitiveRef.startsWith('--')
                ? primitiveRef.slice(2)
                : primitiveRef;
            return `  ${jsSemanticName}: ${jsPrimitiveRef},`;
        }
        else {
            // CSS custom property format
            // Convert primitive reference to kebab-case for CSS
            // Use semantic category as a hint for the primitive token category
            const cssPrimitiveRefName = (0, PlatformNamingRules_1.getPlatformTokenName)(primitiveRef, this.platform, semantic.category);
            const cssSemanticName = semanticName.startsWith('--') ? semanticName : `--${semanticName}`;
            const cssPrimitiveRef = cssPrimitiveRefName.startsWith('--') ? cssPrimitiveRefName : `--${cssPrimitiveRefName}`;
            return `  ${cssSemanticName}: var(${cssPrimitiveRef});`;
        }
    }
    /**
     * Format a multi-reference semantic token (typography)
     * Generates: export const typographyBodyMd = { fontSize: fontSize100, ... };
     */
    formatMultiReferenceToken(semantic) {
        // Get all primitive references except 'value' and 'default' which are for single-reference tokens
        const refs = Object.entries(semantic.primitiveReferences)
            .filter(([key]) => key !== 'value' && key !== 'default');
        if (refs.length === 0) {
            throw new Error(`Multi-reference semantic token ${semantic.name} has no primitive references`);
        }
        // Convert semantic token name to appropriate format
        const semanticName = this.getTokenName(semantic.name, semantic.category);
        if (this.outputFormat === 'javascript') {
            // JavaScript object literal format
            const jsSemanticName = semanticName.startsWith('--')
                ? semanticName.slice(2)
                : semanticName;
            const properties = refs.map(([key, primitiveRef]) => {
                const jsPrimitiveRef = primitiveRef.startsWith('--')
                    ? primitiveRef.slice(2)
                    : primitiveRef;
                return `    ${key}: ${jsPrimitiveRef}`;
            }).join(',\n');
            return `  ${jsSemanticName}: {\n${properties}\n  },`;
        }
        else {
            // CSS doesn't support object literals, so we'll generate individual properties
            // This is a limitation of CSS custom properties
            const cssSemanticName = semanticName.startsWith('--') ? semanticName : `--${semanticName}`;
            const properties = refs.map(([key, primitiveRef]) => {
                // Convert primitive reference to kebab-case for CSS
                // Use semantic category as a hint for the primitive token category
                const cssPrimitiveRefName = (0, PlatformNamingRules_1.getPlatformTokenName)(primitiveRef, this.platform, semantic.category);
                const cssPrimitiveRef = cssPrimitiveRefName.startsWith('--') ? cssPrimitiveRefName : `--${cssPrimitiveRefName}`;
                // Convert property key to kebab-case
                const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                return `  ${cssSemanticName}-${cssKey}: var(${cssPrimitiveRef});`;
            }).join('\n');
            return properties;
        }
    }
    /**
     * Generate section header comment
     * Marks primitive vs semantic sections
     */
    generateSectionComment(section) {
        const sectionTitle = section === 'primitive'
            ? 'PRIMITIVE TOKENS\n  Mathematical foundation'
            : 'SEMANTIC TOKENS\n  Use these for UI development';
        if (this.outputFormat === 'css') {
            return [
                '',
                '  /* ============================================',
                `   * ${sectionTitle}`,
                '   * ============================================ */',
                ''
            ].join('\n');
        }
        else {
            return [
                '',
                '  // ============================================',
                `  // ${sectionTitle}`,
                '  // ============================================',
                ''
            ].join('\n');
        }
    }
    /**
     * Generate CSS opacity property
     * Outputs: opacity: 0.48;
     *
     * @param opacityValue - Opacity value (0.0 - 1.0)
     * @returns CSS opacity property string
     */
    generateOpacityProperty(opacityValue) {
        return `opacity: ${opacityValue};`;
    }
    /**
     * Generate RGBA alpha channel with color
     * Outputs: rgba(r, g, b, 0.48)
     *
     * @param r - Red channel (0-255)
     * @param g - Green channel (0-255)
     * @param b - Blue channel (0-255)
     * @param alpha - Alpha channel (0.0 - 1.0)
     * @returns RGBA color string
     */
    generateRgbaAlpha(r, g, b, alpha) {
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    /**
     * Generate CSS custom property for opacity token
     * Outputs: --opacity600: 0.48;
     *
     * @param tokenName - Opacity token name (e.g., 'opacity600')
     * @param opacityValue - Opacity value (0.0 - 1.0)
     * @returns CSS custom property string
     */
    generateCustomProperty(tokenName, opacityValue) {
        // Ensure token name has -- prefix for CSS custom property
        const prefix = tokenName.startsWith('--') ? '' : '--';
        return `${prefix}${tokenName}: ${opacityValue};`;
    }
}
exports.WebFormatGenerator = WebFormatGenerator;
//# sourceMappingURL=WebFormatGenerator.js.map