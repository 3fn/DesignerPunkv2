"use strict";
/**
 * Source Map Generator
 *
 * Generates source maps for platform-specific builds to enable debugging
 * of generated code back to original token definitions.
 *
 * @module build/workflow/SourceMapGenerator
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceMapGenerator = void 0;
/**
 * SourceMapGenerator generates source maps for platform-specific builds
 * to enable debugging of generated code back to original sources.
 */
class SourceMapGenerator {
    /**
     * Generate source map for iOS Swift build
     */
    generateiOSSourceMap(config) {
        if (!config.options.enabled) {
            return {
                platform: 'ios',
                sourceFiles: [],
                success: true,
            };
        }
        try {
            // Swift source maps use DWARF debug information
            // Generate debug symbol mapping for Swift Package
            const mappings = this.generateSwiftDebugMappings(config.sourcePaths);
            if (config.options.format === 'inline') {
                return {
                    platform: 'ios',
                    inlineSourceMap: this.encodeSwiftDebugInfo(mappings),
                    sourceFiles: config.sourcePaths,
                    success: true,
                };
            }
            // External source map for Swift (dSYM bundle)
            const sourceMapPath = `${config.outputPath}/DesignTokens.dSYM`;
            return {
                platform: 'ios',
                sourceMapPath,
                sourceFiles: config.sourcePaths,
                success: true,
            };
        }
        catch (error) {
            return {
                platform: 'ios',
                sourceFiles: [],
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error generating iOS source map',
            };
        }
    }
    /**
     * Generate source map for Android Kotlin build
     */
    generateAndroidSourceMap(config) {
        if (!config.options.enabled) {
            return {
                platform: 'android',
                sourceFiles: [],
                success: true,
            };
        }
        try {
            // Kotlin source maps for debugging
            const mappings = this.generateKotlinSourceMappings(config.sourcePaths);
            if (config.options.format === 'inline') {
                return {
                    platform: 'android',
                    inlineSourceMap: this.encodeKotlinSourceMap(mappings),
                    sourceFiles: config.sourcePaths,
                    success: true,
                };
            }
            // External source map for Kotlin
            const sourceMapPath = `${config.outputPath}/DesignTokens.map`;
            return {
                platform: 'android',
                sourceMapPath,
                sourceFiles: config.sourcePaths,
                success: true,
            };
        }
        catch (error) {
            return {
                platform: 'android',
                sourceFiles: [],
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error generating Android source map',
            };
        }
    }
    /**
     * Generate source map for Web TypeScript build
     */
    generateWebSourceMap(config) {
        if (!config.options.enabled) {
            return {
                platform: 'web',
                sourceFiles: [],
                success: true,
            };
        }
        try {
            // Standard JavaScript source map (v3 format)
            const mappings = this.generateJavaScriptSourceMappings(config.sourcePaths);
            if (config.options.format === 'inline') {
                const sourceMap = this.generateSourceMapV3(mappings, config);
                return {
                    platform: 'web',
                    inlineSourceMap: this.encodeInlineSourceMap(sourceMap),
                    sourceFiles: config.sourcePaths,
                    success: true,
                };
            }
            // External source map for Web
            const sourceMapPath = `${config.outputPath}/tokens.js.map`;
            return {
                platform: 'web',
                sourceMapPath,
                sourceFiles: config.sourcePaths,
                success: true,
            };
        }
        catch (error) {
            return {
                platform: 'web',
                sourceFiles: [],
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error generating Web source map',
            };
        }
    }
    /**
     * Generate source map for specified platform
     */
    generateSourceMap(config) {
        switch (config.platform) {
            case 'ios':
                return this.generateiOSSourceMap(config);
            case 'android':
                return this.generateAndroidSourceMap(config);
            case 'web':
                return this.generateWebSourceMap(config);
            default:
                return {
                    platform: config.platform,
                    sourceFiles: [],
                    success: false,
                    error: `Unsupported platform: ${config.platform}`,
                };
        }
    }
    /**
     * Generate source maps for multiple platforms
     */
    generateSourceMaps(configs) {
        return configs.map(config => this.generateSourceMap(config));
    }
    /**
     * Get default source map options for platform
     */
    getDefaultOptions(platform, mode) {
        if (mode === 'development') {
            return {
                enabled: true,
                includeContent: true,
                format: 'external',
            };
        }
        // Production: minimal source maps
        return {
            enabled: true,
            includeContent: false,
            format: 'external',
        };
    }
    // Private helper methods
    generateSwiftDebugMappings(sourcePaths) {
        // Generate debug symbol mappings for Swift
        // Maps generated Swift constants back to token definitions
        return sourcePaths.flatMap((sourcePath, fileIndex) => {
            return this.createMappingsForFile(sourcePath, fileIndex);
        });
    }
    generateKotlinSourceMappings(sourcePaths) {
        // Generate source mappings for Kotlin
        // Maps generated Kotlin constants back to token definitions
        return sourcePaths.flatMap((sourcePath, fileIndex) => {
            return this.createMappingsForFile(sourcePath, fileIndex);
        });
    }
    generateJavaScriptSourceMappings(sourcePaths) {
        // Generate source mappings for JavaScript/TypeScript
        // Maps generated JS/TS code back to token definitions
        return sourcePaths.flatMap((sourcePath, fileIndex) => {
            return this.createMappingsForFile(sourcePath, fileIndex);
        });
    }
    createMappingsForFile(sourcePath, fileIndex) {
        // Create mappings for a single source file
        // In a real implementation, this would parse the source file
        // and create mappings for each token definition
        return [
            {
                generatedLine: 1,
                generatedColumn: 0,
                sourceLine: 1,
                sourceColumn: 0,
                sourceFile: sourcePath,
            },
        ];
    }
    generateSourceMapV3(mappings, config) {
        // Generate Source Map v3 format (standard for JavaScript)
        return {
            version: 3,
            file: 'tokens.js',
            sourceRoot: config.options.sourceRoot || '',
            sources: config.sourcePaths,
            sourcesContent: config.options.includeContent ? this.getSourceContents(config.sourcePaths) : undefined,
            names: this.extractNames(mappings),
            mappings: this.encodeMappings(mappings),
        };
    }
    encodeSwiftDebugInfo(mappings) {
        // Encode Swift debug information
        // In practice, this would generate DWARF debug info
        return JSON.stringify({ format: 'swift-debug', mappings });
    }
    encodeKotlinSourceMap(mappings) {
        // Encode Kotlin source map
        return JSON.stringify({ format: 'kotlin-sourcemap', mappings });
    }
    encodeInlineSourceMap(sourceMap) {
        // Encode source map as inline base64 data URI
        const json = JSON.stringify(sourceMap);
        const base64 = Buffer.from(json).toString('base64');
        return `//# sourceMappingURL=data:application/json;charset=utf-8;base64,${base64}`;
    }
    getSourceContents(sourcePaths) {
        // Get source file contents for embedding in source map
        // In practice, this would read the actual files
        return sourcePaths.map(() => '// Source content placeholder');
    }
    extractNames(mappings) {
        // Extract unique names from mappings
        const names = new Set();
        mappings.forEach(mapping => {
            if (mapping.name) {
                names.add(mapping.name);
            }
        });
        return Array.from(names);
    }
    encodeMappings(mappings) {
        // Encode mappings using VLQ (Variable Length Quantity) format
        // This is a simplified version - real implementation would use proper VLQ encoding
        return mappings.map(m => `${m.generatedLine},${m.generatedColumn},${m.sourceLine},${m.sourceColumn}`).join(';');
    }
}
exports.SourceMapGenerator = SourceMapGenerator;
//# sourceMappingURL=SourceMapGenerator.js.map