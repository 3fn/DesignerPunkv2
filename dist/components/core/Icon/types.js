"use strict";
/**
 * Icon System Type Definitions
 *
 * Provides type-safe icon names and sizing for cross-platform icon components.
 * Part of the DesignerPunk Icon System infrastructure.
 *
 * @module Icon/types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.iconSizes = void 0;
/**
 * Icon size token reference object mapping token names to calculated values.
 *
 * This constant provides a type-safe way to reference icon size tokens by name
 * and get their calculated pixel values. Each token name corresponds to a
 * typography scale level and maps to the icon size calculated from that scale's
 * fontSize × lineHeight formula.
 *
 * Token names follow the pattern `sizeXXX` where XXX is the scale level:
 * - size050: 13px (caption, legal, labelXs)
 * - size075: 18px (bodySm, buttonSm, labelSm)
 * - size100: 24px (bodyMd, buttonMd, labelMd, input) - standard
 * - size125: 32px (bodyLg, buttonLg, labelLg)
 * - size150: 28px (h6)
 * - size200: 32px (h5)
 * - size300: 32px (h4)
 * - size400: 36px (h3)
 * - size500: 40px (h2)
 * - size600: 44px (h1)
 * - size700: 48px (display)
 *
 * Note: Multiple token names may map to the same calculated value due to
 * natural convergence in the mathematical formula. This is intentional and
 * preserves the relationship between icon sizes and typography scales.
 *
 * @example
 * ```typescript
 * // Use token reference for type-safe icon sizing
 * <Icon name="arrow-right" size={iconSizes.size100} />
 *
 * // Access calculated value
 * const standardIconSize = iconSizes.size100; // 24
 *
 * // Map over all sizes
 * Object.entries(iconSizes).forEach(([token, size]) => {
 *   console.log(`${token}: ${size}px`);
 * });
 * ```
 */
exports.iconSizes = {
    size050: 13, // icon.size050 - caption, legal, labelXs
    size075: 18, // icon.size075 - bodySm, buttonSm, labelSm
    size100: 24, // icon.size100 - bodyMd, buttonMd, labelMd, input (standard)
    size125: 32, // icon.size125 - bodyLg, buttonLg, labelLg
    size150: 28, // icon.size150 - h6
    size200: 32, // icon.size200 - h5
    size300: 32, // icon.size300 - h4
    size400: 36, // icon.size400 - h3
    size500: 40, // icon.size500 - h2
    size600: 44, // icon.size600 - h1
    size700: 48 // icon.size700 - display
};
//# sourceMappingURL=types.js.map