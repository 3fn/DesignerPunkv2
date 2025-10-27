/**
 * Color Primitive Tokens
 *
 * Implements mode-aware and theme-aware color primitive tokens with systematic color families.
 * Each color token supports light/dark modes with base/wcag themes for comprehensive
 * accessibility and aesthetic flexibility.
 *
 * Color families: gray, black, white, yellow, orange, purple, violet, cyan, teal
 * Progression: 100-500 scale for systematic color relationships
 * Architecture: colorToken[systemMode][userTheme] resolution pattern
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
/**
 * Color token base value (N/A for hex values, not mathematical)
 */
export declare const COLOR_BASE_VALUE = 0;
/**
 * Gray scale color tokens - Neutral surfaces and text colors
 */
export declare const grayTokens: {
    gray100: PrimitiveToken;
    gray200: PrimitiveToken;
    gray300: PrimitiveToken;
    gray400: PrimitiveToken;
    gray500: PrimitiveToken;
};
/**
 * Black scale color tokens - Deep backgrounds and containers
 */
export declare const blackTokens: {
    black100: PrimitiveToken;
    black200: PrimitiveToken;
    black300: PrimitiveToken;
    black400: PrimitiveToken;
    black500: PrimitiveToken;
};
/**
 * White scale color tokens - Light surfaces and primary text
 */
export declare const whiteTokens: {
    white100: PrimitiveToken;
    white200: PrimitiveToken;
    white300: PrimitiveToken;
    white400: PrimitiveToken;
    white500: PrimitiveToken;
}; /**

 * Yellow scale color tokens - High-energy CTAs and warnings
 */
export declare const yellowTokens: {
    yellow100: PrimitiveToken;
    yellow200: PrimitiveToken;
    yellow300: PrimitiveToken;
    yellow400: PrimitiveToken;
    yellow500: PrimitiveToken;
};
/**
 * Orange scale color tokens - Secondary CTAs and approachable error states
 */
export declare const orangeTokens: {
    orange100: PrimitiveToken;
    orange200: PrimitiveToken;
    orange300: PrimitiveToken;
    orange400: PrimitiveToken;
    orange500: PrimitiveToken;
};
/**
 * Purple scale color tokens - Primary brand and focus states
 */
export declare const purpleTokens: {
    purple100: PrimitiveToken;
    purple200: PrimitiveToken;
    purple300: PrimitiveToken;
    purple400: PrimitiveToken;
    purple500: PrimitiveToken;
};
/**
 * Violet scale color tokens - Depth, hover states, and secondary elements
 */
export declare const violetTokens: {
    violet100: PrimitiveToken;
    violet200: PrimitiveToken;
    violet300: PrimitiveToken;
    violet400: PrimitiveToken;
    violet500: PrimitiveToken;
};
/**
 * Cyan scale color tokens - Tech elements, links, and success states
 */
export declare const cyanTokens: {
    cyan100: PrimitiveToken;
    cyan200: PrimitiveToken;
    cyan300: PrimitiveToken;
    cyan400: PrimitiveToken;
    cyan500: PrimitiveToken;
};
/**
 * Teal scale color tokens - Secondary UI elements and alternative success states
 */
export declare const tealTokens: {
    teal100: PrimitiveToken;
    teal200: PrimitiveToken;
    teal300: PrimitiveToken;
    teal400: PrimitiveToken;
    teal500: PrimitiveToken;
};
/**
 * Shadow color family - Systematic shadow colors following color family pattern
 *
 * Shadow colors are tinted by ambient light (art theory: warm light creates cool shadows,
 * cool light creates warm shadows). Shadow colors are mode-agnostic (always dark) regardless
 * of light/dark theme mode.
 *
 * Color families: shadowBlack (neutral), shadowBlue (warm light/cool shadows),
 * shadowOrange (cool light/warm shadows), shadowGray (ambient/overcast)
 */
export declare const shadowColorTokens: {
    shadowBlack100: PrimitiveToken;
    shadowBlue100: PrimitiveToken;
    shadowOrange100: PrimitiveToken;
    shadowGray100: PrimitiveToken;
};
/**
 * Combined color tokens object containing all color families
 */
export declare const colorTokens: {
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
/**
 * Color token names for easy reference
 */
export declare const colorTokenNames: Array<keyof typeof colorTokens>;
/**
 * Get a specific color token by name
 */
export declare function getColorToken(name: keyof typeof colorTokens): PrimitiveToken;
/**
 * Get all color tokens as an array
 */
export declare function getAllColorTokens(): PrimitiveToken[];
/**
 * Get color tokens by family (gray, black, white, etc.)
 */
export declare function getColorTokensByFamily(family: 'gray' | 'black' | 'white' | 'yellow' | 'orange' | 'purple' | 'violet' | 'cyan' | 'teal'): PrimitiveToken[];
/**
 * Get shadow color token by name
 */
export declare function getShadowColorToken(name: keyof typeof shadowColorTokens): PrimitiveToken;
/**
 * Get all shadow color tokens as an array
 */
export declare function getAllShadowColorTokens(): PrimitiveToken[];
/**
 * Shadow color token names for easy reference
 */
export declare const shadowColorTokenNames: Array<keyof typeof shadowColorTokens>;
/**
 * Get shadow color tokens by family (shadowBlack, shadowBlue, shadowOrange, shadowGray)
 */
export declare function getShadowColorTokensByFamily(family: 'shadowBlack' | 'shadowBlue' | 'shadowOrange' | 'shadowGray'): PrimitiveToken[];
/**
 * Get systematic color families for reference
 */
export declare const COLOR_FAMILIES: {
    readonly GRAY: "gray";
    readonly BLACK: "black";
    readonly WHITE: "white";
    readonly YELLOW: "yellow";
    readonly ORANGE: "orange";
    readonly PURPLE: "purple";
    readonly VIOLET: "violet";
    readonly CYAN: "cyan";
    readonly TEAL: "teal";
    readonly SHADOW_BLACK: "shadowBlack";
    readonly SHADOW_BLUE: "shadowBlue";
    readonly SHADOW_ORANGE: "shadowOrange";
    readonly SHADOW_GRAY: "shadowGray";
};
/**
 * Color progression scale for reference
 */
export declare const COLOR_SCALE: readonly [100, 200, 300, 400, 500];
/**
 * Mode and theme options for color resolution
 */
export declare const COLOR_MODES: readonly ["light", "dark"];
export declare const COLOR_THEMES: readonly ["base", "wcag"];
/**
 * Resolve color token value for specific mode and theme
 */
export declare function resolveColorTokenValue(token: PrimitiveToken, mode?: 'light' | 'dark', theme?: 'base' | 'wcag'): string;
//# sourceMappingURL=ColorTokens.d.ts.map