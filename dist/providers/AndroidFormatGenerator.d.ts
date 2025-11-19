import { PrimitiveToken, SemanticToken } from '../types';
import { BaseFormatProvider, FileMetadata } from './FormatProvider';
import { TargetPlatform, OutputFormat } from '../types/TranslationOutput';
/**
 * Android-specific format generator
 * Generates Kotlin constants or XML resources for Android platform token usage
 */
export declare class AndroidFormatGenerator extends BaseFormatProvider {
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
    private formatKotlinConstant;
    private formatXMLResource;
    private getKotlinType;
    private getXMLResourceType;
    private formatKotlinValue;
    private formatXMLValue;
    private formatKotlinColor;
    protected generateCategoryComment(category: string): string;
    protected generateMathematicalComment(token: PrimitiveToken): string;
    /**
     * Format a single-reference semantic token
     * Generates: val colorPrimary = purple300
     */
    formatSingleReferenceToken(semantic: SemanticToken): string;
    /**
     * Format a multi-reference semantic token (typography)
     * Generates: val typographyBodyMd = Typography(fontSize = fontSize100, ...)
     */
    formatMultiReferenceToken(semantic: SemanticToken): string;
    /**
     * Generate section header comment
     * Marks primitive vs semantic sections
     */
    generateSectionComment(section: 'primitive' | 'semantic'): string;
    /**
     * Generate Jetpack Compose alpha modifier
     * Outputs: Modifier.alpha(0.48f)
     *
     * @param opacityValue - Unitless opacity value (0.0 - 1.0)
     * @returns Jetpack Compose alpha modifier string
     */
    generateAlphaModifier(opacityValue: number): string;
    /**
     * Generate Jetpack Compose Color.copy with alpha
     * Outputs: Color(0xFF6B50A4).copy(alpha = 0.48f)
     *
     * @param colorHex - Hex color value (e.g., 0xFF6B50A4)
     * @param alpha - Unitless alpha value (0.0 - 1.0)
     * @returns Jetpack Compose Color with alpha string
     */
    generateColorWithAlpha(colorHex: string, alpha: number): string;
    /**
     * Generate Kotlin constant for opacity token
     * Outputs: const val OPACITY_600 = 0.48f
     *
     * @param tokenName - Token name (e.g., 'opacity600')
     * @param opacityValue - Unitless opacity value (0.0 - 1.0)
     * @returns Kotlin constant declaration string
     */
    generateConstant(tokenName: string, opacityValue: number): string;
    /**
     * Format float value to preserve decimal places
     * Ensures 1.0 stays as "1.0" instead of "1"
     *
     * @param value - Numeric value to format
     * @returns Formatted string with decimal places preserved
     */
    private formatFloatValue;
    /**
     * Format elevation token for Android
     * Generates Kotlin constant with .dp suffix
     *
     * @param tokenName - Token name (e.g., 'elevation.modal')
     * @param elevationValue - Elevation value in dp (e.g., 16)
     * @returns Kotlin constant declaration string
     *
     * @example
     * ```typescript
     * formatElevationToken('elevation.modal', 16)
     * // Returns: "val elevation_modal = 16.dp"
     * ```
     */
    formatElevationToken(tokenName: string, elevationValue: number): string;
    /**
     * Format icon size token with calculated value
     * Generates: val iconSize100 = 24.dp with formula and typography pairing comments
     *
     * @param tokenName - Icon token name (e.g., 'icon.size100')
     * @param calculatedSize - Calculated icon size in dp
     * @param category - Token category
     * @param description - Token description with formula (optional)
     * @param context - Token context with typography pairing (optional)
     * @returns Kotlin constant declaration string with comments
     */
    formatIconSizeToken(tokenName: string, calculatedSize: number, category: string, description?: string, context?: string): string;
}
//# sourceMappingURL=AndroidFormatGenerator.d.ts.map