"use strict";
/**
 * Build Workflow Module
 *
 * Provides development workflow integration including source maps,
 * build modes, CI/CD integration, and configuration helpers.
 *
 * @module build/workflow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigHelpers = exports.detectCICDEnvironment = exports.createDefaultCICDConfig = exports.CICDExitCode = exports.CICDIntegration = exports.BuildModeManager = exports.SourceMapGenerator = void 0;
var SourceMapGenerator_1 = require("./SourceMapGenerator");
Object.defineProperty(exports, "SourceMapGenerator", { enumerable: true, get: function () { return SourceMapGenerator_1.SourceMapGenerator; } });
var BuildMode_1 = require("./BuildMode");
Object.defineProperty(exports, "BuildModeManager", { enumerable: true, get: function () { return BuildMode_1.BuildModeManager; } });
var CICDIntegration_1 = require("./CICDIntegration");
Object.defineProperty(exports, "CICDIntegration", { enumerable: true, get: function () { return CICDIntegration_1.CICDIntegration; } });
Object.defineProperty(exports, "CICDExitCode", { enumerable: true, get: function () { return CICDIntegration_1.CICDExitCode; } });
Object.defineProperty(exports, "createDefaultCICDConfig", { enumerable: true, get: function () { return CICDIntegration_1.createDefaultCICDConfig; } });
Object.defineProperty(exports, "detectCICDEnvironment", { enumerable: true, get: function () { return CICDIntegration_1.detectCICDEnvironment; } });
var ConfigHelpers_1 = require("./ConfigHelpers");
Object.defineProperty(exports, "ConfigHelpers", { enumerable: true, get: function () { return ConfigHelpers_1.ConfigHelpers; } });
//# sourceMappingURL=index.js.map