"use strict";
/**
 * Primitive Token Interface and Token Category Enum
 *
 * Defines the foundational token structure for the Mathematical Token System.
 * Primitive tokens represent the base mathematical values with systematic naming
 * that align with the baseline grid or strategic flexibility requirements.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenCategory = void 0;
/**
 * Token categories for primitive tokens with per-family mathematical foundations
 */
var TokenCategory;
(function (TokenCategory) {
    TokenCategory["SPACING"] = "spacing";
    TokenCategory["FONT_SIZE"] = "fontSize";
    TokenCategory["FONT_FAMILY"] = "fontFamily";
    TokenCategory["FONT_WEIGHT"] = "fontWeight";
    TokenCategory["LINE_HEIGHT"] = "lineHeight";
    TokenCategory["LETTER_SPACING"] = "letterSpacing";
    TokenCategory["RADIUS"] = "radius";
    TokenCategory["DENSITY"] = "density";
    TokenCategory["TAP_AREA"] = "tapArea";
    TokenCategory["COLOR"] = "color";
    TokenCategory["BORDER_WIDTH"] = "borderWidth";
    TokenCategory["SHADOW"] = "shadow";
    TokenCategory["GLOW"] = "glow";
    TokenCategory["OPACITY"] = "opacity";
    TokenCategory["BLEND"] = "blend";
})(TokenCategory || (exports.TokenCategory = TokenCategory = {}));
//# sourceMappingURL=PrimitiveToken.js.map