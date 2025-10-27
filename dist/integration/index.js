"use strict";
/**
 * Integration Module - Barrel Export
 *
 * Exports all integration coordinators that orchestrate interactions between
 * registries, validators, and translation providers in the token system.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBuildErrorHandler = exports.BuildErrorHandler = exports.createTreeShakingOptimizer = exports.TreeShakingOptimizer = exports.createPlatformSelector = exports.PlatformFileSelector = exports.BuildSystemIntegration = exports.TranslationCoordinator = exports.ValidationCoordinator = exports.RegistryCoordinator = void 0;
var RegistryCoordinator_1 = require("./RegistryCoordinator");
Object.defineProperty(exports, "RegistryCoordinator", { enumerable: true, get: function () { return RegistryCoordinator_1.RegistryCoordinator; } });
var ValidationCoordinator_1 = require("./ValidationCoordinator");
Object.defineProperty(exports, "ValidationCoordinator", { enumerable: true, get: function () { return ValidationCoordinator_1.ValidationCoordinator; } });
var TranslationCoordinator_1 = require("./TranslationCoordinator");
Object.defineProperty(exports, "TranslationCoordinator", { enumerable: true, get: function () { return TranslationCoordinator_1.TranslationCoordinator; } });
var BuildSystemInterface_1 = require("./BuildSystemInterface");
Object.defineProperty(exports, "BuildSystemIntegration", { enumerable: true, get: function () { return BuildSystemInterface_1.BuildSystemIntegration; } });
var PlatformFileSelector_1 = require("./PlatformFileSelector");
Object.defineProperty(exports, "PlatformFileSelector", { enumerable: true, get: function () { return PlatformFileSelector_1.PlatformFileSelector; } });
Object.defineProperty(exports, "createPlatformSelector", { enumerable: true, get: function () { return PlatformFileSelector_1.createPlatformSelector; } });
var TreeShakingOptimizer_1 = require("./TreeShakingOptimizer");
Object.defineProperty(exports, "TreeShakingOptimizer", { enumerable: true, get: function () { return TreeShakingOptimizer_1.TreeShakingOptimizer; } });
Object.defineProperty(exports, "createTreeShakingOptimizer", { enumerable: true, get: function () { return TreeShakingOptimizer_1.createTreeShakingOptimizer; } });
var BuildErrorHandler_1 = require("./BuildErrorHandler");
Object.defineProperty(exports, "BuildErrorHandler", { enumerable: true, get: function () { return BuildErrorHandler_1.BuildErrorHandler; } });
Object.defineProperty(exports, "createBuildErrorHandler", { enumerable: true, get: function () { return BuildErrorHandler_1.createBuildErrorHandler; } });
//# sourceMappingURL=index.js.map