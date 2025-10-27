/**
 * Line Height Token Definitions
 *
 * Line height tokens use precision multipliers to align with 8pt vertical rhythm
 * when combined with fontSize tokens. Base value: 1.5 (optimal reading ratio)
 * Mathematical progression: Precision-targeted multipliers for systematic alignment
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
/**
 * Line height token base value for mathematical calculations
 */
export declare const LINE_HEIGHT_BASE_VALUE = 1.5;
/**
 * LineHeight tokens with precision multipliers for 8pt vertical rhythm alignment
 */
export declare const lineHeightTokens: Record<string, PrimitiveToken>;
/**
 * Array of all line height token names for iteration
 */
export declare const lineHeightTokenNames: string[];
/**
 * Get line height token by name
 */
export declare function getLineHeightToken(name: string): PrimitiveToken | undefined;
/**
 * Get all line height tokens as array
 */
export declare function getAllLineHeightTokens(): PrimitiveToken[];
/**
 * Calculate computed line height for fontSize + lineHeight combination
 * This ensures proper 8pt vertical rhythm alignment
 */
export declare function calculateComputedLineHeight(fontSizeValue: number, lineHeightRatio: number): number;
//# sourceMappingURL=LineHeightTokens.d.ts.map