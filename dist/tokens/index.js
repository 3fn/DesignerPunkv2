"use strict";
/**
 * Token Definitions - Barrel Export
 *
 * Exports all token families for the Mathematical Token System.
 * Provides unified access to all primitive token families.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RADIUS_BASE_VALUE = exports.getStrategicFlexibilityRadiusTokens = exports.getBaselineAlignedRadiusTokens = exports.getAllRadiusTokens = exports.getRadiusToken = exports.radiusTokenNames = exports.radiusTokens = exports.TAP_AREA_BASE_VALUE = exports.validateTapAreaAccessibility = exports.getAllTapAreaTokens = exports.getTapAreaToken = exports.tapAreaTokenNames = exports.tapAreaTokens = exports.DENSITY_BASE_VALUE = exports.applyDensityScaling = exports.getAllDensityTokens = exports.getDensityToken = exports.densityTokenNames = exports.densityTokens = exports.LINE_HEIGHT_BASE_VALUE = exports.calculateComputedLineHeight = exports.getAllLineHeightTokens = exports.getLineHeightToken = exports.lineHeightTokenNames = exports.lineHeightTokens = exports.LETTER_SPACING_BASE_VALUE = exports.getAllLetterSpacingTokens = exports.getLetterSpacingToken = exports.letterSpacingTokenNames = exports.letterSpacingTokens = exports.FONT_WEIGHT_BASE_VALUE = exports.getAllFontWeightTokens = exports.getFontWeightToken = exports.fontWeightTokenNames = exports.fontWeightTokens = exports.getAllFontFamilyTokens = exports.getFontFamilyToken = exports.fontFamilyTokenNames = exports.fontFamilyTokens = exports.MODULAR_SCALE_RATIO = exports.FONT_SIZE_BASE_VALUE = exports.getAllFontSizeTokens = exports.getFontSizeToken = exports.fontSizeTokenNames = exports.fontSizeTokens = exports.SPACING_BASE_VALUE = exports.getAllSpacingTokens = exports.getSpacingToken = exports.spacingTokenNames = exports.spacingTokens = void 0;
exports.GLOW_BLUR_BASE_VALUE = exports.getAllShadowOpacityTokens = exports.getShadowOpacityToken = exports.shadowOpacityTokenNames = exports.shadowOpacityTokens = exports.SHADOW_OPACITY_BASE_VALUE = exports.getAllShadowBlurTokens = exports.getShadowBlurToken = exports.shadowBlurNames = exports.shadowBlur = exports.SHADOW_BLUR_BASE_VALUE = exports.getAllShadowOffsetYTokens = exports.getAllShadowOffsetXTokens = exports.getShadowOffsetYToken = exports.getShadowOffsetXToken = exports.shadowOffsetYNames = exports.shadowOffsetXNames = exports.shadowOffsetY = exports.shadowOffsetX = exports.SHADOW_OFFSET_BASE_VALUE = exports.BORDER_WIDTH_BASE_VALUE = exports.getAllBorderWidthTokens = exports.getBorderWidthToken = exports.borderWidthTokenNames = exports.borderWidthTokens = exports.COLOR_THEMES = exports.COLOR_MODES = exports.COLOR_SCALE = exports.COLOR_FAMILIES = exports.COLOR_BASE_VALUE = exports.getShadowColorTokensByFamily = exports.getAllShadowColorTokens = exports.getShadowColorToken = exports.shadowColorTokenNames = exports.shadowColorTokens = exports.tealTokens = exports.cyanTokens = exports.violetTokens = exports.purpleTokens = exports.orangeTokens = exports.yellowTokens = exports.whiteTokens = exports.blackTokens = exports.grayTokens = exports.resolveColorTokenValue = exports.getColorTokensByFamily = exports.getAllColorTokens = exports.getColorToken = exports.colorTokenNames = exports.colorTokens = void 0;
exports.TOKEN_FAMILY_BASE_VALUES = exports.getAllTokens = exports.allTokens = exports.BREAKPOINT_BASE_VALUE = exports.getAllBreakpointTokens = exports.getBreakpointToken = exports.breakpointTokenNames = exports.breakpointTokens = exports.BlendDirection = exports.BLEND_BASE_VALUE = exports.getAllBlendTokens = exports.getBlendToken = exports.blendTokenNames = exports.blendTokens = exports.OPACITY_BASE_VALUE = exports.getAllOpacityTokens = exports.getOpacityToken = exports.opacityTokenNames = exports.opacityTokens = exports.getAllGlowOpacityTokens = exports.getGlowOpacityToken = exports.glowOpacityNames = exports.glowOpacity = exports.GLOW_OPACITY_BASE_VALUE = exports.getAllGlowBlurTokens = exports.getGlowBlurToken = exports.glowBlurNames = exports.glowBlur = void 0;
exports.getAllPrimitiveTokens = getAllPrimitiveTokens;
exports.getTokensByCategory = getTokensByCategory;
exports.getTokenByName = getTokenByName;
exports.getAllStrategicFlexibilityTokens = getAllStrategicFlexibilityTokens;
exports.getAllBaselineAlignedTokens = getAllBaselineAlignedTokens;
exports.getAllPrecisionTargetedTokens = getAllPrecisionTargetedTokens;
// Spacing tokens
var SpacingTokens_1 = require("./SpacingTokens");
Object.defineProperty(exports, "spacingTokens", { enumerable: true, get: function () { return SpacingTokens_1.spacingTokens; } });
Object.defineProperty(exports, "spacingTokenNames", { enumerable: true, get: function () { return SpacingTokens_1.spacingTokenNames; } });
Object.defineProperty(exports, "getSpacingToken", { enumerable: true, get: function () { return SpacingTokens_1.getSpacingToken; } });
Object.defineProperty(exports, "getAllSpacingTokens", { enumerable: true, get: function () { return SpacingTokens_1.getAllSpacingTokens; } });
Object.defineProperty(exports, "SPACING_BASE_VALUE", { enumerable: true, get: function () { return SpacingTokens_1.SPACING_BASE_VALUE; } });
// Font size tokens
var FontSizeTokens_1 = require("./FontSizeTokens");
Object.defineProperty(exports, "fontSizeTokens", { enumerable: true, get: function () { return FontSizeTokens_1.fontSizeTokens; } });
Object.defineProperty(exports, "fontSizeTokenNames", { enumerable: true, get: function () { return FontSizeTokens_1.fontSizeTokenNames; } });
Object.defineProperty(exports, "getFontSizeToken", { enumerable: true, get: function () { return FontSizeTokens_1.getFontSizeToken; } });
Object.defineProperty(exports, "getAllFontSizeTokens", { enumerable: true, get: function () { return FontSizeTokens_1.getAllFontSizeTokens; } });
Object.defineProperty(exports, "FONT_SIZE_BASE_VALUE", { enumerable: true, get: function () { return FontSizeTokens_1.FONT_SIZE_BASE_VALUE; } });
Object.defineProperty(exports, "MODULAR_SCALE_RATIO", { enumerable: true, get: function () { return FontSizeTokens_1.MODULAR_SCALE_RATIO; } });
// Font family tokens
var FontFamilyTokens_1 = require("./FontFamilyTokens");
Object.defineProperty(exports, "fontFamilyTokens", { enumerable: true, get: function () { return FontFamilyTokens_1.fontFamilyTokens; } });
Object.defineProperty(exports, "fontFamilyTokenNames", { enumerable: true, get: function () { return FontFamilyTokens_1.fontFamilyTokenNames; } });
Object.defineProperty(exports, "getFontFamilyToken", { enumerable: true, get: function () { return FontFamilyTokens_1.getFontFamilyToken; } });
Object.defineProperty(exports, "getAllFontFamilyTokens", { enumerable: true, get: function () { return FontFamilyTokens_1.getAllFontFamilyTokens; } });
// Font weight tokens
var FontWeightTokens_1 = require("./FontWeightTokens");
Object.defineProperty(exports, "fontWeightTokens", { enumerable: true, get: function () { return FontWeightTokens_1.fontWeightTokens; } });
Object.defineProperty(exports, "fontWeightTokenNames", { enumerable: true, get: function () { return FontWeightTokens_1.fontWeightTokenNames; } });
Object.defineProperty(exports, "getFontWeightToken", { enumerable: true, get: function () { return FontWeightTokens_1.getFontWeightToken; } });
Object.defineProperty(exports, "getAllFontWeightTokens", { enumerable: true, get: function () { return FontWeightTokens_1.getAllFontWeightTokens; } });
Object.defineProperty(exports, "FONT_WEIGHT_BASE_VALUE", { enumerable: true, get: function () { return FontWeightTokens_1.FONT_WEIGHT_BASE_VALUE; } });
// Letter spacing tokens
var LetterSpacingTokens_1 = require("./LetterSpacingTokens");
Object.defineProperty(exports, "letterSpacingTokens", { enumerable: true, get: function () { return LetterSpacingTokens_1.letterSpacingTokens; } });
Object.defineProperty(exports, "letterSpacingTokenNames", { enumerable: true, get: function () { return LetterSpacingTokens_1.letterSpacingTokenNames; } });
Object.defineProperty(exports, "getLetterSpacingToken", { enumerable: true, get: function () { return LetterSpacingTokens_1.getLetterSpacingToken; } });
Object.defineProperty(exports, "getAllLetterSpacingTokens", { enumerable: true, get: function () { return LetterSpacingTokens_1.getAllLetterSpacingTokens; } });
Object.defineProperty(exports, "LETTER_SPACING_BASE_VALUE", { enumerable: true, get: function () { return LetterSpacingTokens_1.LETTER_SPACING_BASE_VALUE; } });
// Line height tokens
var LineHeightTokens_1 = require("./LineHeightTokens");
Object.defineProperty(exports, "lineHeightTokens", { enumerable: true, get: function () { return LineHeightTokens_1.lineHeightTokens; } });
Object.defineProperty(exports, "lineHeightTokenNames", { enumerable: true, get: function () { return LineHeightTokens_1.lineHeightTokenNames; } });
Object.defineProperty(exports, "getLineHeightToken", { enumerable: true, get: function () { return LineHeightTokens_1.getLineHeightToken; } });
Object.defineProperty(exports, "getAllLineHeightTokens", { enumerable: true, get: function () { return LineHeightTokens_1.getAllLineHeightTokens; } });
Object.defineProperty(exports, "calculateComputedLineHeight", { enumerable: true, get: function () { return LineHeightTokens_1.calculateComputedLineHeight; } });
Object.defineProperty(exports, "LINE_HEIGHT_BASE_VALUE", { enumerable: true, get: function () { return LineHeightTokens_1.LINE_HEIGHT_BASE_VALUE; } });
// Density tokens
var DensityTokens_1 = require("./DensityTokens");
Object.defineProperty(exports, "densityTokens", { enumerable: true, get: function () { return DensityTokens_1.densityTokens; } });
Object.defineProperty(exports, "densityTokenNames", { enumerable: true, get: function () { return DensityTokens_1.densityTokenNames; } });
Object.defineProperty(exports, "getDensityToken", { enumerable: true, get: function () { return DensityTokens_1.getDensityToken; } });
Object.defineProperty(exports, "getAllDensityTokens", { enumerable: true, get: function () { return DensityTokens_1.getAllDensityTokens; } });
Object.defineProperty(exports, "applyDensityScaling", { enumerable: true, get: function () { return DensityTokens_1.applyDensityScaling; } });
Object.defineProperty(exports, "DENSITY_BASE_VALUE", { enumerable: true, get: function () { return DensityTokens_1.DENSITY_BASE_VALUE; } });
// Tap area tokens
var TapAreaTokens_1 = require("./TapAreaTokens");
Object.defineProperty(exports, "tapAreaTokens", { enumerable: true, get: function () { return TapAreaTokens_1.tapAreaTokens; } });
Object.defineProperty(exports, "tapAreaTokenNames", { enumerable: true, get: function () { return TapAreaTokens_1.tapAreaTokenNames; } });
Object.defineProperty(exports, "getTapAreaToken", { enumerable: true, get: function () { return TapAreaTokens_1.getTapAreaToken; } });
Object.defineProperty(exports, "getAllTapAreaTokens", { enumerable: true, get: function () { return TapAreaTokens_1.getAllTapAreaTokens; } });
Object.defineProperty(exports, "validateTapAreaAccessibility", { enumerable: true, get: function () { return TapAreaTokens_1.validateTapAreaAccessibility; } });
Object.defineProperty(exports, "TAP_AREA_BASE_VALUE", { enumerable: true, get: function () { return TapAreaTokens_1.TAP_AREA_BASE_VALUE; } });
// Radius tokens
var RadiusTokens_1 = require("./RadiusTokens");
Object.defineProperty(exports, "radiusTokens", { enumerable: true, get: function () { return RadiusTokens_1.radiusTokens; } });
Object.defineProperty(exports, "radiusTokenNames", { enumerable: true, get: function () { return RadiusTokens_1.radiusTokenNames; } });
Object.defineProperty(exports, "getRadiusToken", { enumerable: true, get: function () { return RadiusTokens_1.getRadiusToken; } });
Object.defineProperty(exports, "getAllRadiusTokens", { enumerable: true, get: function () { return RadiusTokens_1.getAllRadiusTokens; } });
Object.defineProperty(exports, "getBaselineAlignedRadiusTokens", { enumerable: true, get: function () { return RadiusTokens_1.getBaselineAlignedRadiusTokens; } });
Object.defineProperty(exports, "getStrategicFlexibilityRadiusTokens", { enumerable: true, get: function () { return RadiusTokens_1.getStrategicFlexibilityRadiusTokens; } });
Object.defineProperty(exports, "RADIUS_BASE_VALUE", { enumerable: true, get: function () { return RadiusTokens_1.RADIUS_BASE_VALUE; } });
// Color tokens
var ColorTokens_1 = require("./ColorTokens");
Object.defineProperty(exports, "colorTokens", { enumerable: true, get: function () { return ColorTokens_1.colorTokens; } });
Object.defineProperty(exports, "colorTokenNames", { enumerable: true, get: function () { return ColorTokens_1.colorTokenNames; } });
Object.defineProperty(exports, "getColorToken", { enumerable: true, get: function () { return ColorTokens_1.getColorToken; } });
Object.defineProperty(exports, "getAllColorTokens", { enumerable: true, get: function () { return ColorTokens_1.getAllColorTokens; } });
Object.defineProperty(exports, "getColorTokensByFamily", { enumerable: true, get: function () { return ColorTokens_1.getColorTokensByFamily; } });
Object.defineProperty(exports, "resolveColorTokenValue", { enumerable: true, get: function () { return ColorTokens_1.resolveColorTokenValue; } });
Object.defineProperty(exports, "grayTokens", { enumerable: true, get: function () { return ColorTokens_1.grayTokens; } });
Object.defineProperty(exports, "blackTokens", { enumerable: true, get: function () { return ColorTokens_1.blackTokens; } });
Object.defineProperty(exports, "whiteTokens", { enumerable: true, get: function () { return ColorTokens_1.whiteTokens; } });
Object.defineProperty(exports, "yellowTokens", { enumerable: true, get: function () { return ColorTokens_1.yellowTokens; } });
Object.defineProperty(exports, "orangeTokens", { enumerable: true, get: function () { return ColorTokens_1.orangeTokens; } });
Object.defineProperty(exports, "purpleTokens", { enumerable: true, get: function () { return ColorTokens_1.purpleTokens; } });
Object.defineProperty(exports, "violetTokens", { enumerable: true, get: function () { return ColorTokens_1.violetTokens; } });
Object.defineProperty(exports, "cyanTokens", { enumerable: true, get: function () { return ColorTokens_1.cyanTokens; } });
Object.defineProperty(exports, "tealTokens", { enumerable: true, get: function () { return ColorTokens_1.tealTokens; } });
Object.defineProperty(exports, "shadowColorTokens", { enumerable: true, get: function () { return ColorTokens_1.shadowColorTokens; } });
Object.defineProperty(exports, "shadowColorTokenNames", { enumerable: true, get: function () { return ColorTokens_1.shadowColorTokenNames; } });
Object.defineProperty(exports, "getShadowColorToken", { enumerable: true, get: function () { return ColorTokens_1.getShadowColorToken; } });
Object.defineProperty(exports, "getAllShadowColorTokens", { enumerable: true, get: function () { return ColorTokens_1.getAllShadowColorTokens; } });
Object.defineProperty(exports, "getShadowColorTokensByFamily", { enumerable: true, get: function () { return ColorTokens_1.getShadowColorTokensByFamily; } });
Object.defineProperty(exports, "COLOR_BASE_VALUE", { enumerable: true, get: function () { return ColorTokens_1.COLOR_BASE_VALUE; } });
Object.defineProperty(exports, "COLOR_FAMILIES", { enumerable: true, get: function () { return ColorTokens_1.COLOR_FAMILIES; } });
Object.defineProperty(exports, "COLOR_SCALE", { enumerable: true, get: function () { return ColorTokens_1.COLOR_SCALE; } });
Object.defineProperty(exports, "COLOR_MODES", { enumerable: true, get: function () { return ColorTokens_1.COLOR_MODES; } });
Object.defineProperty(exports, "COLOR_THEMES", { enumerable: true, get: function () { return ColorTokens_1.COLOR_THEMES; } });
// Border width tokens
var BorderWidthTokens_1 = require("./BorderWidthTokens");
Object.defineProperty(exports, "borderWidthTokens", { enumerable: true, get: function () { return BorderWidthTokens_1.borderWidthTokens; } });
Object.defineProperty(exports, "borderWidthTokenNames", { enumerable: true, get: function () { return BorderWidthTokens_1.borderWidthTokenNames; } });
Object.defineProperty(exports, "getBorderWidthToken", { enumerable: true, get: function () { return BorderWidthTokens_1.getBorderWidthToken; } });
Object.defineProperty(exports, "getAllBorderWidthTokens", { enumerable: true, get: function () { return BorderWidthTokens_1.getAllBorderWidthTokens; } });
Object.defineProperty(exports, "BORDER_WIDTH_BASE_VALUE", { enumerable: true, get: function () { return BorderWidthTokens_1.BORDER_WIDTH_BASE_VALUE; } });
// Shadow tokens
var ShadowOffsetTokens_1 = require("./ShadowOffsetTokens");
Object.defineProperty(exports, "SHADOW_OFFSET_BASE_VALUE", { enumerable: true, get: function () { return ShadowOffsetTokens_1.SHADOW_OFFSET_BASE_VALUE; } });
Object.defineProperty(exports, "shadowOffsetX", { enumerable: true, get: function () { return ShadowOffsetTokens_1.shadowOffsetX; } });
Object.defineProperty(exports, "shadowOffsetY", { enumerable: true, get: function () { return ShadowOffsetTokens_1.shadowOffsetY; } });
Object.defineProperty(exports, "shadowOffsetXNames", { enumerable: true, get: function () { return ShadowOffsetTokens_1.shadowOffsetXNames; } });
Object.defineProperty(exports, "shadowOffsetYNames", { enumerable: true, get: function () { return ShadowOffsetTokens_1.shadowOffsetYNames; } });
Object.defineProperty(exports, "getShadowOffsetXToken", { enumerable: true, get: function () { return ShadowOffsetTokens_1.getShadowOffsetXToken; } });
Object.defineProperty(exports, "getShadowOffsetYToken", { enumerable: true, get: function () { return ShadowOffsetTokens_1.getShadowOffsetYToken; } });
Object.defineProperty(exports, "getAllShadowOffsetXTokens", { enumerable: true, get: function () { return ShadowOffsetTokens_1.getAllShadowOffsetXTokens; } });
Object.defineProperty(exports, "getAllShadowOffsetYTokens", { enumerable: true, get: function () { return ShadowOffsetTokens_1.getAllShadowOffsetYTokens; } });
var ShadowBlurTokens_1 = require("./ShadowBlurTokens");
Object.defineProperty(exports, "SHADOW_BLUR_BASE_VALUE", { enumerable: true, get: function () { return ShadowBlurTokens_1.SHADOW_BLUR_BASE_VALUE; } });
Object.defineProperty(exports, "shadowBlur", { enumerable: true, get: function () { return ShadowBlurTokens_1.shadowBlur; } });
Object.defineProperty(exports, "shadowBlurNames", { enumerable: true, get: function () { return ShadowBlurTokens_1.shadowBlurNames; } });
Object.defineProperty(exports, "getShadowBlurToken", { enumerable: true, get: function () { return ShadowBlurTokens_1.getShadowBlurToken; } });
Object.defineProperty(exports, "getAllShadowBlurTokens", { enumerable: true, get: function () { return ShadowBlurTokens_1.getAllShadowBlurTokens; } });
var ShadowOpacityTokens_1 = require("./ShadowOpacityTokens");
Object.defineProperty(exports, "SHADOW_OPACITY_BASE_VALUE", { enumerable: true, get: function () { return ShadowOpacityTokens_1.SHADOW_OPACITY_BASE_VALUE; } });
Object.defineProperty(exports, "shadowOpacityTokens", { enumerable: true, get: function () { return ShadowOpacityTokens_1.shadowOpacityTokens; } });
Object.defineProperty(exports, "shadowOpacityTokenNames", { enumerable: true, get: function () { return ShadowOpacityTokens_1.shadowOpacityTokenNames; } });
Object.defineProperty(exports, "getShadowOpacityToken", { enumerable: true, get: function () { return ShadowOpacityTokens_1.getShadowOpacityToken; } });
Object.defineProperty(exports, "getAllShadowOpacityTokens", { enumerable: true, get: function () { return ShadowOpacityTokens_1.getAllShadowOpacityTokens; } });
// Glow tokens
var GlowBlurTokens_1 = require("./GlowBlurTokens");
Object.defineProperty(exports, "GLOW_BLUR_BASE_VALUE", { enumerable: true, get: function () { return GlowBlurTokens_1.GLOW_BLUR_BASE_VALUE; } });
Object.defineProperty(exports, "glowBlur", { enumerable: true, get: function () { return GlowBlurTokens_1.glowBlur; } });
Object.defineProperty(exports, "glowBlurNames", { enumerable: true, get: function () { return GlowBlurTokens_1.glowBlurNames; } });
Object.defineProperty(exports, "getGlowBlurToken", { enumerable: true, get: function () { return GlowBlurTokens_1.getGlowBlurToken; } });
Object.defineProperty(exports, "getAllGlowBlurTokens", { enumerable: true, get: function () { return GlowBlurTokens_1.getAllGlowBlurTokens; } });
var GlowOpacityTokens_1 = require("./GlowOpacityTokens");
Object.defineProperty(exports, "GLOW_OPACITY_BASE_VALUE", { enumerable: true, get: function () { return GlowOpacityTokens_1.GLOW_OPACITY_BASE_VALUE; } });
Object.defineProperty(exports, "glowOpacity", { enumerable: true, get: function () { return GlowOpacityTokens_1.glowOpacity; } });
Object.defineProperty(exports, "glowOpacityNames", { enumerable: true, get: function () { return GlowOpacityTokens_1.glowOpacityNames; } });
Object.defineProperty(exports, "getGlowOpacityToken", { enumerable: true, get: function () { return GlowOpacityTokens_1.getGlowOpacityToken; } });
Object.defineProperty(exports, "getAllGlowOpacityTokens", { enumerable: true, get: function () { return GlowOpacityTokens_1.getAllGlowOpacityTokens; } });
// Opacity tokens
var OpacityTokens_1 = require("./OpacityTokens");
Object.defineProperty(exports, "opacityTokens", { enumerable: true, get: function () { return OpacityTokens_1.opacityTokens; } });
Object.defineProperty(exports, "opacityTokenNames", { enumerable: true, get: function () { return OpacityTokens_1.opacityTokenNames; } });
Object.defineProperty(exports, "getOpacityToken", { enumerable: true, get: function () { return OpacityTokens_1.getOpacityToken; } });
Object.defineProperty(exports, "getAllOpacityTokens", { enumerable: true, get: function () { return OpacityTokens_1.getAllOpacityTokens; } });
Object.defineProperty(exports, "OPACITY_BASE_VALUE", { enumerable: true, get: function () { return OpacityTokens_1.OPACITY_BASE_VALUE; } });
// Blend tokens
var BlendTokens_1 = require("./BlendTokens");
Object.defineProperty(exports, "blendTokens", { enumerable: true, get: function () { return BlendTokens_1.blendTokens; } });
Object.defineProperty(exports, "blendTokenNames", { enumerable: true, get: function () { return BlendTokens_1.blendTokenNames; } });
Object.defineProperty(exports, "getBlendToken", { enumerable: true, get: function () { return BlendTokens_1.getBlendToken; } });
Object.defineProperty(exports, "getAllBlendTokens", { enumerable: true, get: function () { return BlendTokens_1.getAllBlendTokens; } });
Object.defineProperty(exports, "BLEND_BASE_VALUE", { enumerable: true, get: function () { return BlendTokens_1.BLEND_BASE_VALUE; } });
Object.defineProperty(exports, "BlendDirection", { enumerable: true, get: function () { return BlendTokens_1.BlendDirection; } });
// Breakpoint tokens
var BreakpointTokens_1 = require("./BreakpointTokens");
Object.defineProperty(exports, "breakpointTokens", { enumerable: true, get: function () { return BreakpointTokens_1.breakpointTokens; } });
Object.defineProperty(exports, "breakpointTokenNames", { enumerable: true, get: function () { return BreakpointTokens_1.breakpointTokenNames; } });
Object.defineProperty(exports, "getBreakpointToken", { enumerable: true, get: function () { return BreakpointTokens_1.getBreakpointToken; } });
Object.defineProperty(exports, "getAllBreakpointTokens", { enumerable: true, get: function () { return BreakpointTokens_1.getAllBreakpointTokens; } });
Object.defineProperty(exports, "BREAKPOINT_BASE_VALUE", { enumerable: true, get: function () { return BreakpointTokens_1.BREAKPOINT_BASE_VALUE; } });
// Combined token utilities
const SpacingTokens_2 = require("./SpacingTokens");
const FontSizeTokens_2 = require("./FontSizeTokens");
const FontFamilyTokens_2 = require("./FontFamilyTokens");
const FontWeightTokens_2 = require("./FontWeightTokens");
const LineHeightTokens_2 = require("./LineHeightTokens");
const LetterSpacingTokens_2 = require("./LetterSpacingTokens");
const DensityTokens_2 = require("./DensityTokens");
const TapAreaTokens_2 = require("./TapAreaTokens");
const RadiusTokens_2 = require("./RadiusTokens");
const ColorTokens_2 = require("./ColorTokens");
const BorderWidthTokens_2 = require("./BorderWidthTokens");
const ShadowOffsetTokens_2 = require("./ShadowOffsetTokens");
const ShadowBlurTokens_2 = require("./ShadowBlurTokens");
const ShadowOpacityTokens_2 = require("./ShadowOpacityTokens");
const GlowBlurTokens_2 = require("./GlowBlurTokens");
const GlowOpacityTokens_2 = require("./GlowOpacityTokens");
const OpacityTokens_2 = require("./OpacityTokens");
const BlendTokens_2 = require("./BlendTokens");
const BreakpointTokens_2 = require("./BreakpointTokens");
const PrimitiveToken_1 = require("../types/PrimitiveToken");
/**
 * All primitive tokens combined by category
 */
exports.allTokens = {
    [PrimitiveToken_1.TokenCategory.SPACING]: SpacingTokens_2.spacingTokens,
    [PrimitiveToken_1.TokenCategory.FONT_SIZE]: FontSizeTokens_2.fontSizeTokens,
    [PrimitiveToken_1.TokenCategory.FONT_FAMILY]: FontFamilyTokens_2.fontFamilyTokens,
    [PrimitiveToken_1.TokenCategory.FONT_WEIGHT]: FontWeightTokens_2.fontWeightTokens,
    [PrimitiveToken_1.TokenCategory.LINE_HEIGHT]: LineHeightTokens_2.lineHeightTokens,
    [PrimitiveToken_1.TokenCategory.LETTER_SPACING]: LetterSpacingTokens_2.letterSpacingTokens,
    [PrimitiveToken_1.TokenCategory.RADIUS]: RadiusTokens_2.radiusTokens,
    [PrimitiveToken_1.TokenCategory.DENSITY]: DensityTokens_2.densityTokens,
    [PrimitiveToken_1.TokenCategory.TAP_AREA]: TapAreaTokens_2.tapAreaTokens,
    [PrimitiveToken_1.TokenCategory.COLOR]: ColorTokens_2.colorTokens,
    [PrimitiveToken_1.TokenCategory.BORDER_WIDTH]: BorderWidthTokens_2.borderWidthTokens,
    [PrimitiveToken_1.TokenCategory.SHADOW]: { ...ShadowOffsetTokens_2.shadowOffsetX, ...ShadowOffsetTokens_2.shadowOffsetY, ...ShadowBlurTokens_2.shadowBlur, ...ShadowOpacityTokens_2.shadowOpacityTokens },
    [PrimitiveToken_1.TokenCategory.GLOW]: { ...GlowBlurTokens_2.glowBlur, ...GlowOpacityTokens_2.glowOpacity },
    [PrimitiveToken_1.TokenCategory.OPACITY]: OpacityTokens_2.opacityTokens,
    [PrimitiveToken_1.TokenCategory.BLEND]: BlendTokens_2.blendTokens,
    [PrimitiveToken_1.TokenCategory.BREAKPOINT]: BreakpointTokens_2.breakpointTokens
};
/**
 * Get all primitive tokens as a flat array
 *
 * Renamed from getAllTokens() for clarity and symmetry with getAllSemanticTokens().
 * This function returns only primitive tokens (mathematical foundation tokens).
 */
function getAllPrimitiveTokens() {
    return [
        ...Object.values(SpacingTokens_2.spacingTokens),
        ...Object.values(FontSizeTokens_2.fontSizeTokens),
        ...Object.values(FontFamilyTokens_2.fontFamilyTokens),
        ...Object.values(FontWeightTokens_2.fontWeightTokens),
        ...Object.values(LineHeightTokens_2.lineHeightTokens),
        ...Object.values(LetterSpacingTokens_2.letterSpacingTokens),
        ...Object.values(RadiusTokens_2.radiusTokens),
        ...Object.values(DensityTokens_2.densityTokens),
        ...Object.values(TapAreaTokens_2.tapAreaTokens),
        ...Object.values(ColorTokens_2.colorTokens),
        ...Object.values(BorderWidthTokens_2.borderWidthTokens),
        ...Object.values(ShadowOffsetTokens_2.shadowOffsetX),
        ...Object.values(ShadowOffsetTokens_2.shadowOffsetY),
        ...Object.values(ShadowBlurTokens_2.shadowBlur),
        ...Object.values(ShadowOpacityTokens_2.shadowOpacityTokens),
        ...Object.values(GlowBlurTokens_2.glowBlur),
        ...Object.values(GlowOpacityTokens_2.glowOpacity),
        ...Object.values(OpacityTokens_2.opacityTokens),
        ...Object.values(BlendTokens_2.blendTokens),
        ...Object.values(BreakpointTokens_2.breakpointTokens)
    ];
}
/**
 * @deprecated Use getAllPrimitiveTokens() instead. This alias will be removed in v2.0.
 */
exports.getAllTokens = getAllPrimitiveTokens;
/**
 * Get tokens by category
 */
function getTokensByCategory(category) {
    const categoryTokens = exports.allTokens[category];
    return categoryTokens ? Object.values(categoryTokens) : [];
}
/**
 * Get token by name across all categories
 */
function getTokenByName(name) {
    const allTokensFlat = getAllPrimitiveTokens();
    return allTokensFlat.find(token => token.name === name);
}
/**
 * Get all strategic flexibility tokens
 */
function getAllStrategicFlexibilityTokens() {
    return getAllPrimitiveTokens().filter(token => token.isStrategicFlexibility);
}
/**
 * Get all baseline grid aligned tokens
 */
function getAllBaselineAlignedTokens() {
    return getAllPrimitiveTokens().filter(token => token.baselineGridAlignment);
}
/**
 * Get all precision targeted tokens
 */
function getAllPrecisionTargetedTokens() {
    return getAllPrimitiveTokens().filter(token => token.isPrecisionTargeted);
}
/**
 * Token family base values for reference
 */
exports.TOKEN_FAMILY_BASE_VALUES = {
    [PrimitiveToken_1.TokenCategory.SPACING]: 8,
    [PrimitiveToken_1.TokenCategory.FONT_SIZE]: 16,
    [PrimitiveToken_1.TokenCategory.FONT_FAMILY]: 0, // N/A for categorical tokens
    [PrimitiveToken_1.TokenCategory.FONT_WEIGHT]: 400,
    [PrimitiveToken_1.TokenCategory.LINE_HEIGHT]: 1.5,
    [PrimitiveToken_1.TokenCategory.LETTER_SPACING]: 0,
    [PrimitiveToken_1.TokenCategory.RADIUS]: 8,
    [PrimitiveToken_1.TokenCategory.DENSITY]: 1.0,
    [PrimitiveToken_1.TokenCategory.TAP_AREA]: 44,
    [PrimitiveToken_1.TokenCategory.COLOR]: 0, // N/A for hex color tokens
    [PrimitiveToken_1.TokenCategory.BORDER_WIDTH]: 1,
    [PrimitiveToken_1.TokenCategory.SHADOW]: 4,
    [PrimitiveToken_1.TokenCategory.GLOW]: 8,
    [PrimitiveToken_1.TokenCategory.OPACITY]: 0.08,
    [PrimitiveToken_1.TokenCategory.BLEND]: 0.04,
    [PrimitiveToken_1.TokenCategory.BREAKPOINT]: 320
};
//# sourceMappingURL=index.js.map