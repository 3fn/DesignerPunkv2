"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndroidFormatGenerator = void 0;
const FormatProvider_1 = require("./FormatProvider");
const PlatformNamingRules_1 = require("../naming/PlatformNamingRules");
/**
 * Android-specific format generator
 * Generates Kotlin constants or XML resources for Android platform token usage
 */
class AndroidFormatGenerator extends FormatProvider_1.BaseFormatProvider {
    constructor(outputFormat = 'kotlin') {
        super();
        this.platform = 'android';
        this.formats = ['kotlin', 'xml'];
        this.outputFormat = outputFormat;
    }
    formatToken(token) {
        const tokenName = this.getTokenName(token.name, token.category);
        // For semantic tokens, use the resolved primitive token's platform value
        let platformValue;
        if ('platforms' in token) {
            platformValue = token.platforms.android;
        }
        else {
            // For semantic tokens, get the first resolved primitive token
            const primitiveToken = token.primitiveTokens ? Object.values(token.primitiveTokens)[0] : null;
            if (!primitiveToken) {
                throw new Error(`Semantic token ${token.name} has no resolved primitive tokens`);
            }
            platformValue = primitiveToken.platforms.android;
        }
        if (this.outputFormat === 'kotlin') {
            return this.formatKotlinConstant(tokenName, platformValue.value, platformValue.unit, token.category);
        }
        else {
            return this.formatXMLResource(tokenName, platformValue.value, platformValue.unit, token.category);
        }
    }
    generateHeader(metadata) {
        const timestamp = metadata?.generatedAt?.toISOString() || new Date().toISOString();
        const version = metadata?.version || '1.0.0';
        if (this.outputFormat === 'kotlin') {
            return [
                '/**',
                ' * DesignerPunk Design System - Android Tokens',
                ` * Generated: ${timestamp}`,
                ` * Version: ${version}`,
                ' * Platform: Android (Kotlin Constants)',
                ' */',
                '',
                'package com.designerpunk.tokens',
                '',
                'object DesignTokens {'
            ].join('\n');
        }
        else {
            return [
                '<?xml version="1.0" encoding="utf-8"?>',
                '<!--',
                '  DesignerPunk Design System - Android Tokens',
                `  Generated: ${timestamp}`,
                `  Version: ${version}`,
                '  Platform: Android (XML Resources)',
                '-->',
                '<resources>'
            ].join('\n');
        }
    }
    generateFooter() {
        if (this.outputFormat === 'kotlin') {
            return '}';
        }
        else {
            return '</resources>';
        }
    }
    validateSyntax(content) {
        const errors = [];
        if (this.outputFormat === 'kotlin') {
            // Basic Kotlin validation
            if (!content.includes('object DesignTokens')) {
                errors.push('Missing DesignTokens object declaration');
            }
            if (!content.includes('package com.designerpunk.tokens')) {
                errors.push('Missing package declaration');
            }
            // Check for balanced braces
            const openBraces = (content.match(/{/g) || []).length;
            const closeBraces = (content.match(/}/g) || []).length;
            if (openBraces !== closeBraces) {
                errors.push('Unbalanced braces in Kotlin');
            }
        }
        else {
            // Basic XML validation
            if (!content.includes('<?xml version="1.0"')) {
                errors.push('Missing XML declaration');
            }
            if (!content.includes('<resources>')) {
                errors.push('Missing resources root element');
            }
            if (!content.includes('</resources>')) {
                errors.push('Missing closing resources tag');
            }
        }
        return {
            valid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined
        };
    }
    getTokenName(tokenName, category) {
        // Use platform naming rules for consistent naming
        return (0, PlatformNamingRules_1.getPlatformTokenName)(tokenName, this.platform, category);
    }
    formatKotlinConstant(name, value, unit, category) {
        const kotlinType = this.getKotlinType(category, unit);
        const formattedValue = this.formatKotlinValue(value, unit, kotlinType);
        return `    const val ${name}: ${kotlinType} = ${formattedValue}`;
    }
    formatXMLResource(name, value, unit, category) {
        const resourceType = this.getXMLResourceType(category);
        const formattedValue = this.formatXMLValue(value, unit);
        return `    <${resourceType} name="${name}">${formattedValue}</${resourceType}>`;
    }
    getKotlinType(category, unit) {
        switch (category) {
            case 'spacing':
            case 'radius':
            case 'tapArea':
            case 'fontSize':
            case 'borderWidth':
                return 'Float';
            case 'lineHeight':
            case 'density':
            case 'letterSpacing':
                return 'Float';
            case 'fontFamily':
                return 'String';
            case 'fontWeight':
                return 'Int';
            case 'color':
                return 'Int'; // Color as ARGB integer
            default:
                return 'Float';
        }
    }
    getXMLResourceType(category) {
        switch (category) {
            case 'spacing':
            case 'radius':
            case 'tapArea':
            case 'fontSize':
            case 'borderWidth':
                return 'dimen';
            case 'fontFamily':
                return 'string';
            case 'fontWeight':
                return 'integer';
            case 'color':
                return 'color';
            case 'lineHeight':
            case 'density':
            case 'letterSpacing':
                return 'item'; // Generic item for unitless values
            default:
                return 'dimen';
        }
    }
    formatKotlinValue(value, unit, kotlinType) {
        if (typeof value === 'object') {
            // For color tokens with mode/theme structure
            return this.formatKotlinColor(value);
        }
        if (typeof value === 'string') {
            return `"${value}"`;
        }
        // Numeric values
        if (kotlinType === 'Float') {
            return `${value}f`;
        }
        return String(value);
    }
    formatXMLValue(value, unit) {
        if (typeof value === 'object') {
            // For color tokens, return placeholder
            return '@color/placeholder';
        }
        if (typeof value === 'string') {
            return value;
        }
        // Numeric values with units
        switch (unit) {
            case 'dp':
                return `${value}dp`;
            case 'sp':
                return `${value}sp`;
            case 'unitless':
                return String(value);
            default:
                return String(value);
        }
    }
    formatKotlinColor(colorValue) {
        // Placeholder for color formatting
        // Actual implementation would need the color structure
        return '0xFF000000.toInt() // placeholder';
    }
    generateCategoryComment(category) {
        if (this.outputFormat === 'kotlin') {
            return `\n    // ${category.toUpperCase()} TOKENS`;
        }
        else {
            return `\n    <!-- ${category.toUpperCase()} TOKENS -->`;
        }
    }
    generateMathematicalComment(token) {
        if (this.outputFormat === 'kotlin') {
            return `    // ${token.mathematicalRelationship}`;
        }
        else {
            return `    <!-- ${token.mathematicalRelationship} -->`;
        }
    }
    /**
     * Format a single-reference semantic token
     * Generates: val colorPrimary = purple300
     */
    formatSingleReferenceToken(semantic) {
        // Get the primitive reference name (e.g., 'purple300' from primitiveReferences)
        const primitiveRef = semantic.primitiveReferences.value ||
            semantic.primitiveReferences.default ||
            Object.values(semantic.primitiveReferences)[0];
        if (!primitiveRef) {
            throw new Error(`Semantic token ${semantic.name} has no primitive reference`);
        }
        // Convert semantic token name to appropriate format using platform naming rules
        // getPlatformTokenName will handle dot notation conversion (e.g., 'color.primary' -> 'color_primary')
        const semanticName = this.getTokenName(semantic.name, semantic.category);
        // Convert primitive reference to appropriate format
        const primitiveRefName = this.getTokenName(primitiveRef, semantic.category);
        if (this.outputFormat === 'kotlin') {
            return `    val ${semanticName} = ${primitiveRefName}`;
        }
        else {
            // XML format - reference another resource
            const resourceType = this.getXMLResourceType(semantic.category);
            return `    <${resourceType} name="${semanticName}">@${resourceType}/${primitiveRefName}</${resourceType}>`;
        }
    }
    /**
     * Format a multi-reference semantic token (typography)
     * Generates: val typographyBodyMd = Typography(fontSize = fontSize100, ...)
     */
    formatMultiReferenceToken(semantic) {
        // Get all primitive references except 'value' and 'default' which are for single-reference tokens
        const refs = Object.entries(semantic.primitiveReferences)
            .filter(([key]) => key !== 'value' && key !== 'default');
        if (refs.length === 0) {
            throw new Error(`Multi-reference semantic token ${semantic.name} has no primitive references`);
        }
        // Convert semantic token name to appropriate format using platform naming rules
        // getPlatformTokenName will handle dot notation conversion (e.g., 'typography.bodyMd' -> 'typography_body_md')
        const semanticName = this.getTokenName(semantic.name, semantic.category);
        if (this.outputFormat === 'kotlin') {
            // Generate Typography data class initialization format
            const parameters = refs.map(([key, primitiveRef]) => {
                const primitiveRefName = this.getTokenName(primitiveRef, semantic.category);
                return `${key} = ${primitiveRefName}`;
            }).join(', ');
            return `    val ${semanticName} = Typography(${parameters})`;
        }
        else {
            // XML doesn't support object literals, so we'll generate individual properties
            // This is a limitation of XML resources
            const properties = refs.map(([key, primitiveRef]) => {
                const primitiveRefName = this.getTokenName(primitiveRef, semantic.category);
                const resourceType = this.getXMLResourceType(semantic.category);
                return `    <${resourceType} name="${semanticName}_${key}">@${resourceType}/${primitiveRefName}</${resourceType}>`;
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
            ? 'PRIMITIVE TOKENS\n    Mathematical foundation'
            : 'SEMANTIC TOKENS\n    Use these for UI development';
        if (this.outputFormat === 'kotlin') {
            return [
                '',
                '    // ============================================',
                `    // ${sectionTitle}`,
                '    // ============================================',
                ''
            ].join('\n');
        }
        else {
            return [
                '',
                '    <!-- ============================================',
                `         ${sectionTitle}`,
                '         ============================================ -->',
                ''
            ].join('\n');
        }
    }
}
exports.AndroidFormatGenerator = AndroidFormatGenerator;
//# sourceMappingURL=AndroidFormatGenerator.js.map