/**
 * Web Platform Builder
 *
 * Generates NPM package with Web Components (Lit) from component definitions.
 * Converts F1 tokens to CSS custom properties with proper px/rem units.
 *
 * Requirements: 1.5, 2.3
 */
import { PlatformBuilder, ComponentDefinition } from './PlatformBuilder';
import { BuildConfig, WebBuildOptions } from '../types/BuildConfig';
import { BuildResult } from '../types/BuildResult';
import { Platform } from '../types/Platform';
import { PlatformTokens } from '../tokens/PlatformTokens';
/**
 * NPM Package structure
 */
export interface NPMPackage {
    /** package.json content */
    packageJson: PackageJson;
    /** TypeScript source files */
    sourceFiles: TypeScriptFile[];
    /** CSS files */
    cssFiles: CSSFile[];
    /** TypeScript declaration files */
    declarations: TypeScriptDeclaration[];
}
/**
 * package.json structure
 */
export interface PackageJson {
    name: string;
    version: string;
    description: string;
    main: string;
    module: string;
    types: string;
    files: string[];
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    peerDependencies: Record<string, string>;
    scripts: Record<string, string>;
    keywords: string[];
    author: string;
    license: string;
}
/**
 * TypeScript source file
 */
export interface TypeScriptFile {
    /** File path relative to src */
    path: string;
    /** File content */
    content: string;
}
/**
 * CSS file
 */
export interface CSSFile {
    /** File path relative to src */
    path: string;
    /** File content */
    content: string;
}
/**
 * TypeScript declaration file
 */
export interface TypeScriptDeclaration {
    /** File path relative to dist */
    path: string;
    /** Declaration content */
    content: string;
}
/**
 * Web build configuration
 */
export interface WebBuildConfig {
    /** ECMAScript target version */
    target: 'es2020' | 'es2021' | 'esnext';
    /** Output module formats */
    formats: ('esm' | 'cjs' | 'umd')[];
    /** External dependencies */
    externals: string[];
    /** Package name */
    packageName: string;
    /** Package version */
    packageVersion: string;
    /** Package description */
    packageDescription: string;
}
/**
 * Web Platform Builder Implementation
 *
 * Builds NPM package with Web Components (Lit) and CSS custom properties
 */
export declare class WebBuilder implements PlatformBuilder {
    readonly platform: Platform;
    private buildConfig;
    constructor(buildOptions?: WebBuildOptions);
    /**
     * Build NPM package from component definitions
     */
    build(components: ComponentDefinition[], tokens: PlatformTokens, config: BuildConfig): Promise<BuildResult>;
    /**
     * Generate NPM package structure with proper organization
     *
     * Creates a complete NPM package with:
     * - Token constants as CSS custom properties
     * - Web Component (Lit) implementations
     * - Proper file organization (tokens/, components/, styles/)
     * - package.json with dependencies
     *
     * Requirements: 2.3, 2.5
     */
    private generateNPMPackage;
    /**
     * Generate package.json with proper dependencies
     *
     * Creates a complete NPM package configuration with:
     * - Package metadata and entry points
     * - Lit and TypeScript dependencies
     * - Build scripts
     * - Module exports configuration
     *
     * Requirements: 2.3, 2.5
     */
    private generatePackageJson;
    /**
     * Generate TypeScript configuration
     */
    private generateTsConfig;
    /**
     * Generate CSS custom properties from platform tokens
     *
     * Generates CSS custom properties from:
     * - Primitive tokens (--space-100, --color-blue-500, etc.)
     * - Semantic tokens (--space-normal, --color-primary, etc.)
     * - Component tokens (if needed)
     *
     * Requirements: 3.6, 3.7
     */
    private generateTokensCSS;
    /**
     * Generate primitive token CSS custom properties
     */
    private generatePrimitiveTokensCSS;
    /**
     * Generate semantic token CSS custom properties
     */
    private generateSemanticTokensCSS;
    /**
     * Generate component token CSS custom properties (if needed)
     */
    private generateComponentTokensCSS;
    /**
     * Generate TypeScript token constants from platform tokens
     *
     * Generates TypeScript constants from:
     * - Primitive tokens (space100, colorBlue500, etc.)
     * - Semantic tokens (spaceNormal, colorPrimary, etc.)
     * - Component tokens (if needed)
     *
     * Requirements: 3.6, 3.7
     */
    generateTokens(tokens: PlatformTokens): string;
    /**
     * Generate primitive token TypeScript constants
     */
    private generatePrimitiveTokensTS;
    /**
     * Generate semantic token TypeScript constants
     */
    private generateSemanticTokensTS;
    /**
     * Generate component token TypeScript constants (if needed)
     */
    private generateComponentTokensTS;
    /**
     * Generate spacing tokens file
     */
    private generateSpacingTokensFile;
    /**
     * Generate color tokens file
     */
    private generateColorTokensFile;
    /**
     * Generate typography tokens file
     */
    private generateTypographyTokensFile;
    /**
     * Generate Lit Web Component with proper structure
     */
    private generateLitComponent;
    /**
     * Generate main index file
     */
    private generateIndexFile;
    /**
     * Validate Web implementation
     */
    validate(implementation: unknown): {
        valid: boolean;
        errors: string[];
        warnings: string[];
    };
    /**
     * Clean build artifacts
     */
    clean(outputDir: string): Promise<void>;
    /**
     * Calculate package size
     */
    private calculatePackageSize;
    /**
     * Count tokens in platform tokens
     */
    private countTokens;
    /**
     * Convert token name to CSS variable name
     * Example: space100 -> space-100, colorBlue500 -> color-blue-500
     */
    private toCSSVariableName;
    /**
     * Convert token name to TypeScript constant name
     * Example: space100 -> space100, color.blue.500 -> colorBlue500
     */
    private toTypeScriptConstantName;
    /**
     * Convert component name to kebab-case
     * Example: ButtonCTA -> button-cta
     */
    private toKebabCase;
}
//# sourceMappingURL=WebBuilder.d.ts.map