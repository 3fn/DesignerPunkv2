"use strict";
/**
 * Release Analysis System
 *
 * Main entry point for the release analysis system providing CLI-driven
 * analysis of changes between releases with version bump recommendations.
 *
 * Includes performance optimizations for large repositories:
 * - Efficient Git history analysis with caching and batching
 * - Incremental document parsing with intelligent caching
 * - Parallel processing for multiple completion documents
 * - Comprehensive progress reporting for long-running operations
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfigurationPaths = exports.validateAnalysisConfig = exports.AnalysisConfigManager = exports.DEFAULT_ANALYSIS_CONFIG = exports.AccuracyTestRunner = exports.AccuracyTestCases = exports.AccuracyValidationFramework = exports.AnalysisValidator = exports.AnalysisReporter = exports.VersionCalculator = exports.ChangeCategorizationSystem = exports.PatternMatcher = exports.SimpleChangeExtractor = exports.DefaultChangeExtractor = exports.runAnalysisCli = exports.ReleaseCLI = void 0;
// CLI Interface
var ReleaseCLI_1 = require("./cli/ReleaseCLI");
Object.defineProperty(exports, "ReleaseCLI", { enumerable: true, get: function () { return ReleaseCLI_1.ReleaseCLI; } });
Object.defineProperty(exports, "runAnalysisCli", { enumerable: true, get: function () { return ReleaseCLI_1.runAnalysisCli; } });
// Core Analysis Components
// Note: Some modules export conflicting type names, so we export explicitly
// to avoid ambiguity warnings from TypeScript
// Git module - exports ValidationResult, AnalysisScope
__exportStar(require("./git"), exports);
// Collection module - no conflicts
__exportStar(require("./collection"), exports);
// Extraction module - export explicitly to avoid conflicts
var ChangeExtractor_1 = require("./extraction/ChangeExtractor");
Object.defineProperty(exports, "DefaultChangeExtractor", { enumerable: true, get: function () { return ChangeExtractor_1.DefaultChangeExtractor; } });
var SimpleChangeExtractor_1 = require("./extraction/SimpleChangeExtractor");
Object.defineProperty(exports, "SimpleChangeExtractor", { enumerable: true, get: function () { return SimpleChangeExtractor_1.SimpleChangeExtractor; } });
var PatternMatcher_1 = require("./extraction/PatternMatcher");
Object.defineProperty(exports, "PatternMatcher", { enumerable: true, get: function () { return PatternMatcher_1.PatternMatcher; } });
var ChangeCategorizationSystem_1 = require("./extraction/ChangeCategorizationSystem");
Object.defineProperty(exports, "ChangeCategorizationSystem", { enumerable: true, get: function () { return ChangeCategorizationSystem_1.ChangeCategorizationSystem; } });
// Versioning module - exports ValidationResult (conflicts with git)
// Export versioning explicitly excluding conflicting types
var VersionCalculator_1 = require("./versioning/VersionCalculator");
Object.defineProperty(exports, "VersionCalculator", { enumerable: true, get: function () { return VersionCalculator_1.VersionCalculator; } });
// Notes module - exports TemplateSectionConfig
__exportStar(require("./notes"), exports);
// Reporting module - exports AnalysisScope (conflicts with git)
// Export reporting classes but not conflicting types
var AnalysisReporter_1 = require("./reporting/AnalysisReporter");
Object.defineProperty(exports, "AnalysisReporter", { enumerable: true, get: function () { return AnalysisReporter_1.AnalysisReporter; } });
// Validation module - exports ConfidenceThresholds (conflicts with reporting)
// Export validation explicitly to avoid conflicts
var AnalysisValidator_1 = require("./validation/AnalysisValidator");
Object.defineProperty(exports, "AnalysisValidator", { enumerable: true, get: function () { return AnalysisValidator_1.AnalysisValidator; } });
var AccuracyValidationFramework_1 = require("./validation/AccuracyValidationFramework");
Object.defineProperty(exports, "AccuracyValidationFramework", { enumerable: true, get: function () { return AccuracyValidationFramework_1.AccuracyValidationFramework; } });
var AccuracyTestCases_1 = require("./validation/AccuracyTestCases");
Object.defineProperty(exports, "AccuracyTestCases", { enumerable: true, get: function () { return AccuracyTestCases_1.AccuracyTestCases; } });
var AccuracyTestRunner_1 = require("./validation/AccuracyTestRunner");
Object.defineProperty(exports, "AccuracyTestRunner", { enumerable: true, get: function () { return AccuracyTestRunner_1.AccuracyTestRunner; } });
// Performance Optimizations
__exportStar(require("./performance"), exports);
// Configuration - exports TemplateSectionConfig (conflicts with notes)
// Export config explicitly excluding conflicting types
var config_1 = require("./config");
Object.defineProperty(exports, "DEFAULT_ANALYSIS_CONFIG", { enumerable: true, get: function () { return config_1.DEFAULT_ANALYSIS_CONFIG; } });
Object.defineProperty(exports, "AnalysisConfigManager", { enumerable: true, get: function () { return config_1.AnalysisConfigManager; } });
Object.defineProperty(exports, "validateAnalysisConfig", { enumerable: true, get: function () { return config_1.validateAnalysisConfig; } });
Object.defineProperty(exports, "validateConfigurationPaths", { enumerable: true, get: function () { return config_1.validateConfigurationPaths; } });
// Error Handling
__exportStar(require("./errors"), exports);
//# sourceMappingURL=index.js.map