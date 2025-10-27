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
     * Format a multi-reference semantic token (typography)
     * Generates: static let typographyBodyMd = Typography(fontSize: fontSize100, ...)
     */
    formatMultiReferenceToken(semantic: SemanticToken): string;
    /**
     * Generate section header comment
     * Marks primitive vs semantic sections
     */
    generateSectionComment(section: 'primitive' | 'semantic'): string;
}
//# sourceMappingURL=iOSFormatGenerator.d.ts.map