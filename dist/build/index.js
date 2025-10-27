"use strict";
/**
 * Build System Module Exports
 *
 * Main entry point for the Cross-Platform Build System.
 * Exports orchestrator, types, and utilities for building
 * platform-specific packages.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceMapGenerator = exports.PLATFORM_METADATA = exports.DEFAULT_BUILD_CONFIG = exports.IncrementalBuilder = exports.SequentialExecutor = exports.ParallelExecutor = exports.BuildOrchestrator = void 0;
// Main orchestrator
var BuildOrchestrator_1 = require("./BuildOrchestrator");
Object.defineProperty(exports, "BuildOrchestrator", { enumerable: true, get: function () { return BuildOrchestrator_1.BuildOrchestrator; } });
// Orchestration strategies
var orchestration_1 = require("./orchestration");
Object.defineProperty(exports, "ParallelExecutor", { enumerable: true, get: function () { return orchestration_1.ParallelExecutor; } });
Object.defineProperty(exports, "SequentialExecutor", { enumerable: true, get: function () { return orchestration_1.SequentialExecutor; } });
Object.defineProperty(exports, "IncrementalBuilder", { enumerable: true, get: function () { return orchestration_1.IncrementalBuilder; } });
var BuildConfig_1 = require("./types/BuildConfig");
Object.defineProperty(exports, "DEFAULT_BUILD_CONFIG", { enumerable: true, get: function () { return BuildConfig_1.DEFAULT_BUILD_CONFIG; } });
var Platform_1 = require("./types/Platform");
Object.defineProperty(exports, "PLATFORM_METADATA", { enumerable: true, get: function () { return Platform_1.PLATFORM_METADATA; } });
// Workflow utilities
var workflow_1 = require("./workflow");
Object.defineProperty(exports, "SourceMapGenerator", { enumerable: true, get: function () { return workflow_1.SourceMapGenerator; } });
//# sourceMappingURL=index.js.map