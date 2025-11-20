import { PrimitiveToken, SemanticToken } from '../types';
import { BaseFormatProvider, FileMetadata } from './FormatProvider';
import { TargetPlatform, OutputFormat } from '../types/TranslationOutput';
/**
 * iOS-specific format generator
 * Generates Swift constant declarations for iOS platform token usage
 */
export declare class iOSFormatGenerator extends BaseFormatProvider {
    readonly platform: TargetPlatform;
    readonly formats: OutputFormat[];
    formatToken(token: PrimitiveToken | SemanticToken): string;
    generateHeader(metadata?: FileMetadata): string;
    generateFooter(): string;
    validateSyntax(content: string): {
        valid: boolean;
        errors?: string[];
    };
    getTokenName(tokenName: string, category: string): string;
    private formatSwiftConstant;
    private getSwiftType;
    private formatSwiftValue;
    private formatFontWeight;
    private formatDynamicColor;
    protected generateCategoryComment(category: string): string;
    protected generateMathematicalComment(token: PrimitiveToken): string;
    /**
     * Format a single-reference semantic token
     * Generates: static let colorPrimary = purple300
     */
    formatSingleReferenceToken(semantic: SemanticToken): string;
    /**
     * Get WCAG comment for accessibility tokens
     * Extracts WCAG information from token description
     */
    private getWCAGComment;
    /**
     * Format a multi-reference semantic token (typography)
     * Generates: static let typographyBodyMd = Typography(fontSize: fontSize100, ...)
     */
    formatMultiReferenceToken(semantic: SemanticToken): string;
    /**
     * Generate section header comment
     * Marks primitive vs semantic sections
     */
    generateSectionComment(section: 'primitive' | 'semantic'): string;
    /**
     * Generate SwiftUI opacity modifier
     * Outputs: .opacity(0.48)
     *
     * @param opacityValue - Opacity value (0.0 - 1.0)
     * @returns SwiftUI opacity modifier string
     */
    generateOpacityModifier(opacityValue: number): string;
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
    generateColorWithOpacity(r: number, g: number, b: number, opacity: number): string;
    /**
     * Generate Swift constant for opacity token
     * Outputs: static let opacity600 = 0.48
     *
     * @param tokenName - Opacity token name (e.g., 'opacity600')
     * @param opacityValue - Opacity value (0.0 - 1.0)
     * @returns Swift constant declaration string
     */
    generateConstant(tokenName: string, opacityValue: number): string;
    /**
     * Format icon size token with calculated value
     * Generates: public static let iconSize100: CGFloat = 24 with formula and typography pairing comments
     *
     * @param tokenName - Icon token name (e.g., 'icon.size100')
     * @param calculatedSize - Calculated icon size in points
     * @param category - Token category
     * @param description - Token description with formula (optional)
     * @param context - Token context with typography pairing (optional)
     * @returns Swift constant declaration string with comments
     */
    formatIconSizeToken(tokenName: string, calculatedSize: number, category: string, description?: string, context?: string): string;
    /**
     * Generate accessibility tokens section for iOS platform
     * Generates Swift constants for focus indicator tokens with WCAG comments
     *
     * WCAG References:
     * - 2.4.7 Focus Visible (Level AA)
     * - 1.4.11 Non-text Contrast (Level AA) - 3:1 minimum for focus indicators
     *
     * @returns Array of Swift constant declaration strings with WCAG comments
     */
    generateAccessibilityTokens(): string[];
}
//# sourceMappingURL=iOSFormatGenerator.d.ts.map