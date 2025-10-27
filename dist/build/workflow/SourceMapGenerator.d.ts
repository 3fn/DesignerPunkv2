/**
 * Source Map Generator
 *
 * Generates source maps for platform-specific builds to enable debugging
 * of generated code back to original token definitions.
 *
 * @module build/workflow/SourceMapGenerator
 */
import { Platform } from '../types/Platform';
/**
 * Source map configuration options
 */
export interface SourceMapOptions {
    /** Enable source map generation */
    enabled: boolean;
    /** Include source content in source map */
    includeContent: boolean;
    /** Source map output format */
    format: 'inline' | 'external';
    /** Source root path for source map */
    sourceRoot?: string;
}
/**
 * Platform-specific source map configuration
 */
export interface PlatformSourceMapConfig {
    platform: Platform;
    options: SourceMapOptions;
    /** Output path for source maps */
    outputPath: string;
    /** Source file paths to include */
    sourcePaths: string[];
}
/**
 * Generated source map result
 */
export interface SourceMapResult {
    platform: Platform;
    /** Path to generated source map file */
    sourceMapPath?: string;
    /** Inline source map content (if format is 'inline') */
    inlineSourceMap?: string;
    /** Source files included in map */
    sourceFiles: string[];
    success: boolean;
    error?: string;
}
/**
 * SourceMapGenerator generates source maps for platform-specific builds
 * to enable debugging of generated code back to original sources.
 */
export declare class SourceMapGenerator {
    /**
     * Generate source map for iOS Swift build
     */
    generateiOSSourceMap(config: PlatformSourceMapConfig): SourceMapResult;
    /**
     * Generate source map for Android Kotlin build
     */
    generateAndroidSourceMap(config: PlatformSourceMapConfig): SourceMapResult;
    /**
     * Generate source map for Web TypeScript build
     */
    generateWebSourceMap(config: PlatformSourceMapConfig): SourceMapResult;
    /**
     * Generate source map for specified platform
     */
    generateSourceMap(config: PlatformSourceMapConfig): SourceMapResult;
    /**
     * Generate source maps for multiple platforms
     */
    generateSourceMaps(configs: PlatformSourceMapConfig[]): SourceMapResult[];
    /**
     * Get default source map options for platform
     */
    getDefaultOptions(platform: Platform, mode: 'development' | 'production'): SourceMapOptions;
    private generateSwiftDebugMappings;
    private generateKotlinSourceMappings;
    private generateJavaScriptSourceMappings;
    private createMappingsForFile;
    private generateSourceMapV3;
    private encodeSwiftDebugInfo;
    private encodeKotlinSourceMap;
    private encodeInlineSourceMap;
    private getSourceContents;
    private extractNames;
    private encodeMappings;
}
//# sourceMappingURL=SourceMapGenerator.d.ts.map