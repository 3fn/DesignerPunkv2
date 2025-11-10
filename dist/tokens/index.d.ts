/**
 * Token Definitions - Barrel Export
 *
 * Exports all token families for the Mathematical Token System.
 * Provides unified access to all primitive token families.
 */
export { spacingTokens, spacingTokenNames, getSpacingToken, getAllSpacingTokens, SPACING_BASE_VALUE } from './SpacingTokens';
export { fontSizeTokens, fontSizeTokenNames, getFontSizeToken, getAllFontSizeTokens, FONT_SIZE_BASE_VALUE, MODULAR_SCALE_RATIO } from './FontSizeTokens';
export { fontFamilyTokens, fontFamilyTokenNames, getFontFamilyToken, getAllFontFamilyTokens } from './FontFamilyTokens';
export { fontWeightTokens, fontWeightTokenNames, getFontWeightToken, getAllFontWeightTokens, FONT_WEIGHT_BASE_VALUE } from './FontWeightTokens';
export { letterSpacingTokens, letterSpacingTokenNames, getLetterSpacingToken, getAllLetterSpacingTokens, LETTER_SPACING_BASE_VALUE } from './LetterSpacingTokens';
export { lineHeightTokens, lineHeightTokenNames, getLineHeightToken, getAllLineHeightTokens, calculateComputedLineHeight, LINE_HEIGHT_BASE_VALUE } from './LineHeightTokens';
export { densityTokens, densityTokenNames, getDensityToken, getAllDensityTokens, applyDensityScaling, DENSITY_BASE_VALUE } from './DensityTokens';
export { tapAreaTokens, tapAreaTokenNames, getTapAreaToken, getAllTapAreaTokens, validateTapAreaAccessibility, TAP_AREA_BASE_VALUE } from './TapAreaTokens';
export { radiusTokens, radiusTokenNames, getRadiusToken, getAllRadiusTokens, getBaselineAlignedRadiusTokens, getStrategicFlexibilityRadiusTokens, RADIUS_BASE_VALUE } from './RadiusTokens';
export { colorTokens, colorTokenNames, getColorToken, getAllColorTokens, getColorTokensByFamily, resolveColorTokenValue, grayTokens, blackTokens, whiteTokens, yellowTokens, orangeTokens, purpleTokens, violetTokens, cyanTokens, tealTokens, shadowColorTokens, shadowColorTokenNames, getShadowColorToken, getAllShadowColorTokens, getShadowColorTokensByFamily, COLOR_BASE_VALUE, COLOR_FAMILIES, COLOR_SCALE, COLOR_MODES, COLOR_THEMES } from './ColorTokens';
export { borderWidthTokens, borderWidthTokenNames, getBorderWidthToken, getAllBorderWidthTokens, BORDER_WIDTH_BASE_VALUE } from './BorderWidthTokens';
export { SHADOW_OFFSET_BASE_VALUE, shadowOffsetX, shadowOffsetY, shadowOffsetXNames, shadowOffsetYNames, getShadowOffsetXToken, getShadowOffsetYToken, getAllShadowOffsetXTokens, getAllShadowOffsetYTokens } from './ShadowOffsetTokens';
export { SHADOW_BLUR_BASE_VALUE, shadowBlur, shadowBlurNames, getShadowBlurToken, getAllShadowBlurTokens } from './ShadowBlurTokens';
export { SHADOW_OPACITY_BASE_VALUE, shadowOpacityTokens, shadowOpacityTokenNames, getShadowOpacityToken, getAllShadowOpacityTokens } from './ShadowOpacityTokens';
export { GLOW_BLUR_BASE_VALUE, glowBlur, glowBlurNames, getGlowBlurToken, getAllGlowBlurTokens } from './GlowBlurTokens';
export { GLOW_OPACITY_BASE_VALUE, glowOpacity, glowOpacityNames, getGlowOpacityToken, getAllGlowOpacityTokens } from './GlowOpacityTokens';
export { opacityTokens, opacityTokenNames, getOpacityToken, getAllOpacityTokens, OPACITY_BASE_VALUE } from './OpacityTokens';
export { blendTokens, blendTokenNames, getBlendToken, getAllBlendTokens, BLEND_BASE_VALUE, BlendDirection } from './BlendTokens';
export { breakpointTokens, breakpointTokenNames, getBreakpointToken, getAllBreakpointTokens, BREAKPOINT_BASE_VALUE } from './BreakpointTokens';
import { PrimitiveToken, TokenCategory } from '../types/PrimitiveToken';
/**
 * All primitive tokens combined by category
 */
export declare const allTokens: {
    spacing: Record<string, PrimitiveToken>;
    fontSize: Record<string, PrimitiveToken>;
    fontFamily: Record<string, PrimitiveToken>;
    fontWeight: Record<string, PrimitiveToken>;
    lineHeight: Record<string, PrimitiveToken>;
    letterSpacing: Record<string, PrimitiveToken>;
    radius: Record<string, PrimitiveToken>;
    density: Record<string, PrimitiveToken>;
    tapArea: Record<string, PrimitiveToken>;
    color: {
        shadowBlack100: PrimitiveToken;
        shadowBlue100: PrimitiveToken;
        shadowOrange100: PrimitiveToken;
        shadowGray100: PrimitiveToken;
        teal100: PrimitiveToken;
        teal200: PrimitiveToken;
        teal300: PrimitiveToken;
        teal400: PrimitiveToken;
        teal500: PrimitiveToken;
        cyan100: PrimitiveToken;
        cyan200: PrimitiveToken;
        cyan300: PrimitiveToken;
        cyan400: PrimitiveToken;
        cyan500: PrimitiveToken;
        violet100: PrimitiveToken;
        violet200: PrimitiveToken;
        violet300: PrimitiveToken;
        violet400: PrimitiveToken;
        violet500: PrimitiveToken;
        purple100: PrimitiveToken;
        purple200: PrimitiveToken;
        purple300: PrimitiveToken;
        purple400: PrimitiveToken;
        purple500: PrimitiveToken;
        orange100: PrimitiveToken;
        orange200: PrimitiveToken;
        orange300: PrimitiveToken;
        orange400: PrimitiveToken;
        orange500: PrimitiveToken;
        yellow100: PrimitiveToken;
        yellow200: PrimitiveToken;
        yellow300: PrimitiveToken;
        yellow400: PrimitiveToken;
        yellow500: PrimitiveToken;
        white100: PrimitiveToken;
        white200: PrimitiveToken;
        white300: PrimitiveToken;
        white400: PrimitiveToken;
        white500: PrimitiveToken;
        black100: PrimitiveToken;
        black200: PrimitiveToken;
        black300: PrimitiveToken;
        black400: PrimitiveToken;
        black500: PrimitiveToken;
        gray100: PrimitiveToken;
        gray200: PrimitiveToken;
        gray300: PrimitiveToken;
        gray400: PrimitiveToken;
        gray500: PrimitiveToken;
    };
    borderWidth: Record<string, PrimitiveToken>;
    shadow: {
        [x: string]: PrimitiveToken;
    };
    glow: {
        [x: string]: PrimitiveToken;
    };
    opacity: Record<string, PrimitiveToken>;
    blend: Record<string, PrimitiveToken>;
    breakpoint: Record<string, PrimitiveToken>;
};
/**
 * Get all primitive tokens as a flat array
 *
 * Renamed from getAllTokens() for clarity and symmetry with getAllSemanticTokens().
 * This function returns only primitive tokens (mathematical foundation tokens).
 */
export declare function getAllPrimitiveTokens(): PrimitiveToken[];
/**
 * @deprecated Use getAllPrimitiveTokens() instead. This alias will be removed in v2.0.
 */
export declare const getAllTokens: typeof getAllPrimitiveTokens;
/**
 * Get tokens by category
 */
export declare function getTokensByCategory(category: TokenCategory): PrimitiveToken[];
/**
 * Get token by name across all categories
 */
export declare function getTokenByName(name: string): PrimitiveToken | undefined;
/**
 * Get all strategic flexibility tokens
 */
export declare function getAllStrategicFlexibilityTokens(): PrimitiveToken[];
/**
 * Get all baseline grid aligned tokens
 */
export declare function getAllBaselineAlignedTokens(): PrimitiveToken[];
/**
 * Get all precision targeted tokens
 */
export declare function getAllPrecisionTargetedTokens(): PrimitiveToken[];
/**
 * Token family base values for reference
 */
export declare const TOKEN_FAMILY_BASE_VALUES: {
    readonly spacing: 8;
    readonly fontSize: 16;
    readonly fontFamily: 0;
    readonly fontWeight: 400;
    readonly lineHeight: 1.5;
    readonly letterSpacing: 0;
    readonly radius: 8;
    readonly density: 1;
    readonly tapArea: 44;
    readonly color: 0;
    readonly borderWidth: 1;
    readonly shadow: 4;
    readonly glow: 8;
    readonly opacity: 0.08;
    readonly blend: 0.04;
    readonly breakpoint: 320;
};
//# sourceMappingURL=index.d.ts.map