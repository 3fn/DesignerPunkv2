"use strict";
/**
 * Naming Convention Management
 *
 * Provides cross-platform naming convention management and validation
 * for design system tokens.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.followsNamingConvention = exports.getPlatformTokenName = exports.validateTokenName = exports.convertToNamingConvention = exports.PLATFORM_NAMING_RULES = exports.NamingConventionManager = void 0;
var NamingConventionManager_1 = require("./NamingConventionManager");
Object.defineProperty(exports, "NamingConventionManager", { enumerable: true, get: function () { return NamingConventionManager_1.NamingConventionManager; } });
var PlatformNamingRules_1 = require("./PlatformNamingRules");
Object.defineProperty(exports, "PLATFORM_NAMING_RULES", { enumerable: true, get: function () { return PlatformNamingRules_1.PLATFORM_NAMING_RULES; } });
Object.defineProperty(exports, "convertToNamingConvention", { enumerable: true, get: function () { return PlatformNamingRules_1.convertToNamingConvention; } });
Object.defineProperty(exports, "validateTokenName", { enumerable: true, get: function () { return PlatformNamingRules_1.validateTokenName; } });
Object.defineProperty(exports, "getPlatformTokenName", { enumerable: true, get: function () { return PlatformNamingRules_1.getPlatformTokenName; } });
Object.defineProperty(exports, "followsNamingConvention", { enumerable: true, get: function () { return PlatformNamingRules_1.followsNamingConvention; } });
//# sourceMappingURL=index.js.map