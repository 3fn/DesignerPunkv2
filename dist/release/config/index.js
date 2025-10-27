"use strict";
/**
 * Release Configuration System
 *
 * Comprehensive configuration management for release automation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = exports.validateEnvironmentVariables = exports.validateConfig = exports.RELEASE_CONFIG_SCHEMA = exports.DEFAULT_RELEASE_CONFIG = void 0;
exports.loadReleaseConfig = loadReleaseConfig;
exports.validateReleaseConfig = validateReleaseConfig;
exports.saveReleaseConfig = saveReleaseConfig;
exports.clearConfigCache = clearConfigCache;
const ConfigManager_1 = require("./ConfigManager");
// Default configuration
var ReleaseConfig_1 = require("./ReleaseConfig");
Object.defineProperty(exports, "DEFAULT_RELEASE_CONFIG", { enumerable: true, get: function () { return ReleaseConfig_1.DEFAULT_RELEASE_CONFIG; } });
var ConfigSchema_1 = require("./ConfigSchema");
Object.defineProperty(exports, "RELEASE_CONFIG_SCHEMA", { enumerable: true, get: function () { return ConfigSchema_1.RELEASE_CONFIG_SCHEMA; } });
Object.defineProperty(exports, "validateConfig", { enumerable: true, get: function () { return ConfigSchema_1.validateConfig; } });
Object.defineProperty(exports, "validateEnvironmentVariables", { enumerable: true, get: function () { return ConfigSchema_1.validateEnvironmentVariables; } });
var ConfigManager_2 = require("./ConfigManager");
Object.defineProperty(exports, "ConfigManager", { enumerable: true, get: function () { return ConfigManager_2.ConfigManager; } });
// Convenience functions for common configuration operations
async function loadReleaseConfig(workspaceRoot) {
    const manager = ConfigManager_1.ConfigManager.getInstance();
    return manager.getConfig(workspaceRoot);
}
async function validateReleaseConfig(config) {
    const manager = ConfigManager_1.ConfigManager.getInstance();
    const result = manager.validateConfiguration(config);
    return {
        valid: result.valid,
        errors: result.errors,
        warnings: result.warnings
    };
}
async function saveReleaseConfig(config, filePath) {
    const manager = ConfigManager_1.ConfigManager.getInstance();
    return manager.saveConfig(config, filePath);
}
function clearConfigCache() {
    const manager = ConfigManager_1.ConfigManager.getInstance();
    manager.clearCache();
}
//# sourceMappingURL=index.js.map