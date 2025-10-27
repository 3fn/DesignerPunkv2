"use strict";
/**
 * Release Analysis Extraction Module
 *
 * Exports all extraction-related classes and interfaces for pattern-based
 * change extraction from completion documents.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeCategorizationSystem = exports.PatternMatcher = exports.SimpleChangeExtractor = exports.DefaultChangeExtractor = void 0;
var ChangeExtractor_1 = require("./ChangeExtractor");
Object.defineProperty(exports, "DefaultChangeExtractor", { enumerable: true, get: function () { return ChangeExtractor_1.DefaultChangeExtractor; } });
var SimpleChangeExtractor_1 = require("./SimpleChangeExtractor");
Object.defineProperty(exports, "SimpleChangeExtractor", { enumerable: true, get: function () { return SimpleChangeExtractor_1.SimpleChangeExtractor; } });
var PatternMatcher_1 = require("./PatternMatcher");
Object.defineProperty(exports, "PatternMatcher", { enumerable: true, get: function () { return PatternMatcher_1.PatternMatcher; } });
var ChangeCategorizationSystem_1 = require("./ChangeCategorizationSystem");
Object.defineProperty(exports, "ChangeCategorizationSystem", { enumerable: true, get: function () { return ChangeCategorizationSystem_1.ChangeCategorizationSystem; } });
//# sourceMappingURL=index.js.map