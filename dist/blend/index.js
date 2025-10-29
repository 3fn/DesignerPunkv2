"use strict";
/**
 * Blend Token System
 *
 * Color space conversion utilities and blend calculation functions
 * for the blend token system.
 *
 * @module blend
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBlend = exports.BlendCalculator = exports.calculateDesaturateBlend = exports.calculateSaturateBlend = exports.calculateLighterBlend = exports.calculateDarkerBlend = exports.rgbToHex = exports.hexToRgb = exports.hslToRgb = exports.rgbToHsl = void 0;
var ColorSpaceUtils_1 = require("./ColorSpaceUtils");
Object.defineProperty(exports, "rgbToHsl", { enumerable: true, get: function () { return ColorSpaceUtils_1.rgbToHsl; } });
Object.defineProperty(exports, "hslToRgb", { enumerable: true, get: function () { return ColorSpaceUtils_1.hslToRgb; } });
Object.defineProperty(exports, "hexToRgb", { enumerable: true, get: function () { return ColorSpaceUtils_1.hexToRgb; } });
Object.defineProperty(exports, "rgbToHex", { enumerable: true, get: function () { return ColorSpaceUtils_1.rgbToHex; } });
Object.defineProperty(exports, "calculateDarkerBlend", { enumerable: true, get: function () { return ColorSpaceUtils_1.calculateDarkerBlend; } });
Object.defineProperty(exports, "calculateLighterBlend", { enumerable: true, get: function () { return ColorSpaceUtils_1.calculateLighterBlend; } });
Object.defineProperty(exports, "calculateSaturateBlend", { enumerable: true, get: function () { return ColorSpaceUtils_1.calculateSaturateBlend; } });
Object.defineProperty(exports, "calculateDesaturateBlend", { enumerable: true, get: function () { return ColorSpaceUtils_1.calculateDesaturateBlend; } });
var BlendCalculator_1 = require("./BlendCalculator");
Object.defineProperty(exports, "BlendCalculator", { enumerable: true, get: function () { return BlendCalculator_1.BlendCalculator; } });
Object.defineProperty(exports, "calculateBlend", { enumerable: true, get: function () { return BlendCalculator_1.calculateBlend; } });
//# sourceMappingURL=index.js.map