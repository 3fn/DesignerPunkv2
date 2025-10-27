"use strict";
/**
 * Build Configuration Interface
 *
 * Defines the configuration options for the Cross-Platform Build System.
 * Supports platform selection, build modes, output configuration, and
 * platform-specific options.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_BUILD_CONFIG = void 0;
/**
 * Default build configuration
 */
exports.DEFAULT_BUILD_CONFIG = {
    platforms: ['web'],
    mode: 'development',
    outputDir: './dist',
    parallel: false,
    incremental: true,
    sourceMaps: true,
    minify: false,
    validation: {
        interfaces: true,
        tokens: true,
        mathematical: true,
    },
};
//# sourceMappingURL=BuildConfig.js.map