import { PrimitiveToken, SemanticToken } from '../types';
import { BaseFormatProvider, FileMetadata } from './FormatProvider';
import { TargetPlatform, OutputFormat } from '../types/TranslationOutput';
/**
 * Web-specific format generator
 * Generates CSS custom properties for web platform token usage
 */
export declare class WebFormatGenerator extends BaseFormatProvider {
    readonly platform: TargetPlatform;
    readonly formats: OutputFormat[];
    private outputFormat;
    constructor(outputFormat?: OutputFormat);
    formatToken(token: PrimitiveToken | SemanticToken): string;
    generateHeader(metadata?: FileMetadata): string;
    generateFooter(): string;
    validateSyntax(content: string): {
        valid: boolean;
        errors?: string[];
    };
    getTokenName(tokenName: string, category: string): string;
    private formatCSSCustomProperty;
    private formatJavaScriptConstant;
    private formatCSSValue;
    private formatJSValue;
    protected generateCategoryComment(category: string): string;
    protected generateMathematicalComment(token: PrimitiveToken): string;
    /**
     * Format a single-reference semantic token
     * Generates: export const colorPrimary = purple300;
     */
    formatSingleReferenceToken(semantic: SemanticToken): string;
    /**
     * Format a multi-reference semantic token (typography)
     * Generates: export const typographyBodyMd = { fontSize: fontSize100, ... };
     */
    formatMultiReferenceToken(semantic: SemanticToken): string;
    /**
     * Generate section header comment
     * Marks primitive vs semantic sections
     */
    generateSectionComment(section: 'primitive' | 'semantic'): string;
    /**
     * Generate CSS opacity property
     * Outputs: opacity: 0.48;
     *
     * @param opacityValue - Opacity value (0.0 - 1.0)
     * @returns CSS opacity property string
     */
    generateOpacityProperty(opacityValue: number): string;
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
    generateRgbaAlpha(r: number, g: number, b: number, alpha: number): string;
    /**
     * Generate CSS custom property for opacity token
     * Outputs: --opacity600: 0.48;
     *
     * @param tokenName - Opacity token name (e.g., 'opacity600')
     * @param opacityValue - Opacity value (0.0 - 1.0)
     * @returns CSS custom property string
     */
    generateCustomProperty(tokenName: string, opacityValue: number): string;
}
//# sourceMappingURL=WebFormatGenerator.d.ts.map