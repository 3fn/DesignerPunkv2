"use strict";
/**
 * Analytics Module
 *
 * Exports usage tracking and pattern analysis components for monitoring
 * token usage patterns and providing actionable feedback for token system improvement.
 *
 * Core validation: Strategic flexibility tokens must be ≤20% of total token usage.
 * Additional insights: Semantic adoption, primitive fallbacks, and usage patterns.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsagePatternAnalyzer = exports.FallbackReason = exports.PrimitiveTokenFallbackTracker = exports.SemanticTokenUsageTracker = exports.UsageAppropriateness = exports.UsageContext = exports.StrategicFlexibilityTracker = exports.TokenType = exports.TokenUsageTracker = void 0;
var TokenUsageTracker_js_1 = require("./TokenUsageTracker.js");
Object.defineProperty(exports, "TokenUsageTracker", { enumerable: true, get: function () { return TokenUsageTracker_js_1.TokenUsageTracker; } });
Object.defineProperty(exports, "TokenType", { enumerable: true, get: function () { return TokenUsageTracker_js_1.TokenType; } });
var StrategicFlexibilityTracker_js_1 = require("./StrategicFlexibilityTracker.js");
Object.defineProperty(exports, "StrategicFlexibilityTracker", { enumerable: true, get: function () { return StrategicFlexibilityTracker_js_1.StrategicFlexibilityTracker; } });
Object.defineProperty(exports, "UsageContext", { enumerable: true, get: function () { return StrategicFlexibilityTracker_js_1.UsageContext; } });
Object.defineProperty(exports, "UsageAppropriateness", { enumerable: true, get: function () { return StrategicFlexibilityTracker_js_1.UsageAppropriateness; } });
var SemanticTokenUsageTracker_js_1 = require("./SemanticTokenUsageTracker.js");
Object.defineProperty(exports, "SemanticTokenUsageTracker", { enumerable: true, get: function () { return SemanticTokenUsageTracker_js_1.SemanticTokenUsageTracker; } });
var PrimitiveTokenFallbackTracker_js_1 = require("./PrimitiveTokenFallbackTracker.js");
Object.defineProperty(exports, "PrimitiveTokenFallbackTracker", { enumerable: true, get: function () { return PrimitiveTokenFallbackTracker_js_1.PrimitiveTokenFallbackTracker; } });
Object.defineProperty(exports, "FallbackReason", { enumerable: true, get: function () { return PrimitiveTokenFallbackTracker_js_1.FallbackReason; } });
var UsagePatternAnalyzer_js_1 = require("./UsagePatternAnalyzer.js");
Object.defineProperty(exports, "UsagePatternAnalyzer", { enumerable: true, get: function () { return UsagePatternAnalyzer_js_1.UsagePatternAnalyzer; } });
//# sourceMappingURL=index.js.map