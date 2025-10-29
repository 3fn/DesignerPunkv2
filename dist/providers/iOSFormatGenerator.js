"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iOSFormatGenerator = void 0;
const FormatProvider_1 = require("./FormatProvider");
const PlatformNamingRules_1 = require("../naming/PlatformNamingRules");
/**
 * iOS-specific format generator
 * Generates Swift constant declarations for iOS platform token usage
 */
class iOSFormatGenerator extends FormatProvider_1.BaseFormatProvider {
    constructor() {
        super(...arguments);
        this.platform = 'ios';
        this.formats = ['swift'];
    }
    formatToken(token) {
        const tokenName = this.getTokenName(token.name, token.category);
        // Handle semantic-only tokens (like z-index tokens) that have direct values
        // These tokens have a 'value' property and 'platforms' array but no 'primitiveReferences'
        if ('value' in token && typeof token.value === 'number' &&
            'platforms' in token && Array.isArray(token.platforms)) {
            // This is a semantic-only token with a direct value (e.g., z-index tokens)
            let value = token.value;
            // For z-index tokens, scale down values (divide by 100) for SwiftUI conventions
            // Web uses 100, 200, 300... but iOS uses 1, 2, 3...
            if (token.category === 'layering') {
                value = token.value / 100;
            }
            const swiftType = this.getSwiftType(token.category, 'unitless');
            return this.formatSwiftConstant(tokenName, value, 'unitless', swiftType);
        }
        // Check if this is a primitive token (has 'baseValue' property)
        const isPrimitiveToken = 'baseValue' in token;
        // For semantic tokens, use the resolved primitive token's platform value
        let platformValue;
        if (isPrimitiveToken) {
            // This is a primitive token
            const primitiveToken = token;
            platformValue = primitiveToken.platforms.ios;
        }
        else {
            // This is a semantic token - get the first resolved primitive token
            const semanticToken = token;
            const primitiveToken = semanticToken.primitiveTokens ? Object.values(semanticToken.primitiveTokens)[0] : null;
            if (!primitiveToken) {
                throw new Error(`Semantic token ${token.name} has no resolved primitive tokens`);
            }
            platformValue = primitiveToken.platforms.ios;
        }
        if (!platformValue) {
            throw new Error(`Token ${token.name} has no iOS platform value`);
        }
        const swiftType = this.getSwiftType(token.category, platformValue.unit);
        return this.formatSwiftConstant(tokenName, platformValue.value, platformValue.unit, swiftType);
    }
    generateHeader(metadata) {
        const timestamp = metadata?.generatedAt?.toISOString() || new Date().toISOString();
        const version = metadata?.version || '1.0.0';
        return [
            '///',
            '/// DesignerPunk Design System - iOS Tokens',
            `/// Generated: ${timestamp}`,
            `/// Version: ${version}`,
            '/// Platform: iOS (Swift Constants)',
            '///',
            '',
            'import UIKit',
            '',
            'public struct DesignTokens {'
        ].join('\n');
    }
    generateFooter() {
        return '}';
    }
    validateSyntax(content) {
        const errors = [];
        // Basic Swift validation
        if (!content.includes('public struct DesignTokens')) {
            errors.push('Missing DesignTokens struct declaration');
        }
        if (!content.includes('import UIKit')) {
            errors.push('Missing UIKit import');
        }
        // Check for balanced braces
        const openBraces = (content.match(/{/g) || []).length;
        const closeBraces = (content.match(/}/g) || []).length;
        if (openBraces !== closeBraces) {
            errors.push('Unbalanced braces in Swift');
        }
        // Check for proper constant declarations
        if (!content.match(/public static let \w+:/)) {
            errors.push('No Swift constant declarations found');
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
    formatSwiftConstant(name, value, unit, swiftType) {
        const formattedValue = this.formatSwiftValue(value, unit, swiftType);
        return `    public static let ${name}: ${swiftType} = ${formattedValue}`;
    }
    getSwiftType(category, unit) {
        switch (category) {
            case 'spacing':
            case 'radius':
            case 'tapArea':
            case 'fontSize':
                return 'CGFloat';
            case 'lineHeight':
            case 'density':
                return 'CGFloat';
            case 'fontFamily':
                return 'String';
            case 'fontWeight':
                return 'UIFont.Weight';
            case 'letterSpacing':
                return 'CGFloat';
            case 'color':
                return 'UIColor';
            case 'borderWidth':
                return 'CGFloat';
            case 'layering':
                return 'CGFloat';
            default:
                return 'CGFloat';
        }
    }
    formatSwiftValue(value, unit, swiftType) {
        if (typeof value === 'object') {
            // For color tokens with mode/theme structure, generate UIColor.dynamicColor
            return this.formatDynamicColor(value);
        }
        if (typeof value === 'string') {
            if (swiftType === 'UIFont.Weight') {
                return this.formatFontWeight(value);
            }
            return `"${value}"`;
        }
        // Numeric values
        switch (unit) {
            case 'pt':
                return String(value);
            case 'unitless':
                return String(value);
            case 'em':
                return String(value);
            default:
                return String(value);
        }
    }
    formatFontWeight(weight) {
        // Map numeric weights to UIFont.Weight constants
        const weightValue = typeof weight === 'string' ? parseInt(weight) : weight;
        switch (weightValue) {
            case 100: return '.ultraLight';
            case 200: return '.thin';
            case 300: return '.light';
            case 400: return '.regular';
            case 500: return '.medium';
            case 600: return '.semibold';
            case 700: return '.bold';
            case 800: return '.heavy';
            case 900: return '.black';
            default: return '.regular';
        }
    }
    formatDynamicColor(colorValue) {
        // For mode-aware colors, generate UIColor.dynamicColor
        // This is a placeholder - actual implementation would need the color structure
        return 'UIColor { traitCollection in /* dynamic color implementation */ }';
    }
    generateCategoryComment(category) {
        return `\n    // MARK: - ${category.toUpperCase()} TOKENS`;
    }
    generateMathematicalComment(token) {
        return `    /// ${token.mathematicalRelationship}`;
    }
    /**
     * Format a single-reference semantic token
     * Generates: static let colorPrimary = purple300
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
        // getPlatformTokenName will handle dot notation conversion (e.g., 'color.primary' -> 'colorPrimary')
        const semanticName = this.getTokenName(semantic.name, semantic.category);
        // Convert primitive reference to appropriate format
        const primitiveRefName = this.getTokenName(primitiveRef, semantic.category);
        return `    public static let ${semanticName} = ${primitiveRefName}`;
    }
    /**
     * Format a multi-reference semantic token (typography)
     * Generates: static let typographyBodyMd = Typography(fontSize: fontSize100, ...)
     */
    formatMultiReferenceToken(semantic) {
        // Get all primitive references except 'value' and 'default' which are for single-reference tokens
        const refs = Object.entries(semantic.primitiveReferences)
            .filter(([key]) => key !== 'value' && key !== 'default');
        if (refs.length === 0) {
            throw new Error(`Multi-reference semantic token ${semantic.name} has no primitive references`);
        }
        // Convert semantic token name to appropriate format using platform naming rules
        // getPlatformTokenName will handle dot notation conversion (e.g., 'typography.bodyMd' -> 'typographyBodyMd')
        const semanticName = this.getTokenName(semantic.name, semantic.category);
        // Generate Typography struct initialization format
        const parameters = refs.map(([key, primitiveRef]) => {
            const primitiveRefName = this.getTokenName(primitiveRef, semantic.category);
            return `${key}: ${primitiveRefName}`;
        }).join(', ');
        return `    public static let ${semanticName} = Typography(${parameters})`;
    }
    /**
     * Generate section header comment
     * Marks primitive vs semantic sections
     */
    generateSectionComment(section) {
        const sectionTitle = section === 'primitive'
            ? 'PRIMITIVE TOKENS\n    /// Mathematical foundation'
            : 'SEMANTIC TOKENS\n    /// Use these for UI development';
        return [
            '',
            '    // ============================================',
            `    // ${sectionTitle}`,
            '    // ============================================',
            ''
        ].join('\n');
    }
    /**
     * Generate SwiftUI opacity modifier
     * Outputs: .opacity(0.48)
     *
     * @param opacityValue - Opacity value (0.0 - 1.0)
     * @returns SwiftUI opacity modifier string
     */
    generateOpacityModifier(opacityValue) {
        return `.opacity(${opacityValue})`;
    }
    /**
     * Generate SwiftUI Color with opacity parameter
     * Outputs: Color(red: r, green: g, blue: b, opacity: 0.48)
     *
     * @param r - Red channel (0.0 - 1.0)
     * @param g - Green channel (0.0 - 1.0)
     * @param b - Blue channel (0.0 - 1.0)
     * @param opacity - Opacity value (0.0 - 1.0)
     * @returns SwiftUI Color with opacity string
     */
    generateColorWithOpacity(r, g, b, opacity) {
        return `Color(red: ${r}, green: ${g}, blue: ${b}, opacity: ${opacity})`;
    }
    /**
     * Generate Swift constant for opacity token
     * Outputs: static let opacity600 = 0.48
     *
     * @param tokenName - Opacity token name (e.g., 'opacity600')
     * @param opacityValue - Opacity value (0.0 - 1.0)
     * @returns Swift constant declaration string
     */
    generateConstant(tokenName, opacityValue) {
        return `static let ${tokenName} = ${opacityValue}`;
    }
}
exports.iOSFormatGenerator = iOSFormatGenerator;
//# sourceMappingURL=iOSFormatGenerator.js.map