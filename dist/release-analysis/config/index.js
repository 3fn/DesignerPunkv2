"use strict";
/**
 * Release Analysis Configuration System
 *
 * Exports configuration interfaces, manager, and validation utilities
 * for the CLI-driven release analysis workflow.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfigurationPaths = exports.validateAnalysisConfig = exports.AnalysisConfigManager = exports.DEFAULT_ANALYSIS_CONFIG = void 0;
// Configuration interfaces and types
var AnalysisConfig_1 = require("./AnalysisConfig");
Object.defineProperty(exports, "DEFAULT_ANALYSIS_CONFIG", { enumerable: true, get: function () { return AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG; } });
// Configuration manager
var AnalysisConfigManager_1 = require("./AnalysisConfigManager");
Object.defineProperty(exports, "AnalysisConfigManager", { enumerable: true, get: function () { return AnalysisConfigManager_1.AnalysisConfigManager; } });
// Configuration validation
var AnalysisConfigSchema_1 = require("./AnalysisConfigSchema");
Object.defineProperty(exports, "validateAnalysisConfig", { enumerable: true, get: function () { return AnalysisConfigSchema_1.validateAnalysisConfig; } });
Object.defineProperty(exports, "validateConfigurationPaths", { enumerable: true, get: function () { return AnalysisConfigSchema_1.validateConfigurationPaths; } });
//# sourceMappingURL=index.js.map