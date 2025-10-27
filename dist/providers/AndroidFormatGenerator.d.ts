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
}
//# sourceMappingURL=AndroidFormatGenerator.d.ts.map