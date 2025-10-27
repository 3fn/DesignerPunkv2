"use strict";
/**
 * Web Platform Builder
 *
 * Generates NPM package with Web Components (Lit) from component definitions.
 * Converts F1 tokens to CSS custom properties with proper px/rem units.
 *
 * Requirements: 1.5, 2.3
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebBuilder = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
/**
 * Web Platform Builder Implementation
 *
 * Builds NPM package with Web Components (Lit) and CSS custom properties
 */
class WebBuilder {
    constructor(buildOptions) {
        this.platform = 'web';
        // Set default Web build configuration
        this.buildConfig = {
            target: buildOptions?.target || 'es2020',
            formats: buildOptions?.formats || ['esm', 'cjs'],
            externals: buildOptions?.externals || [],
            packageName: '@designerpunk/tokens',
            packageVersion: '1.0.0',
            packageDescription: 'DesignerPunk Design System - Web Components and Tokens'
        };
    }
    /**
     * Build NPM package from component definitions
     */
    async build(components, tokens, config) {
        const startTime = Date.now();
        const warnings = [];
        const errors = [];
        try {
            // Create output directory
            const outputDir = path.join(config.outputDir, 'web');
            await fs.mkdir(outputDir, { recursive: true });
            // Generate NPM package structure
            const npmPackage = await this.generateNPMPackage(components, tokens, config);
            // Write package.json
            const packageJsonPath = path.join(outputDir, 'package.json');
            await fs.writeFile(packageJsonPath, JSON.stringify(npmPackage.packageJson, null, 2), 'utf-8');
            // Create src directory structure
            const srcDir = path.join(outputDir, 'src');
            await fs.mkdir(srcDir, { recursive: true });
            // Create subdirectories for organized source files
            await fs.mkdir(path.join(srcDir, 'tokens'), { recursive: true });
            await fs.mkdir(path.join(srcDir, 'components'), { recursive: true });
            await fs.mkdir(path.join(srcDir, 'styles'), { recursive: true });
            // Write TypeScript source files
            for (const sourceFile of npmPackage.sourceFiles) {
                const filePath = path.join(srcDir, sourceFile.path);
                await fs.mkdir(path.dirname(filePath), { recursive: true });
                await fs.writeFile(filePath, sourceFile.content, 'utf-8');
            }
            // Write CSS files
            for (const cssFile of npmPackage.cssFiles) {
                const filePath = path.join(srcDir, cssFile.path);
                await fs.mkdir(path.dirname(filePath), { recursive: true });
                await fs.writeFile(filePath, cssFile.content, 'utf-8');
            }
            // Create dist directory for build output
            const distDir = path.join(outputDir, 'dist');
            await fs.mkdir(distDir, { recursive: true });
            // Write TypeScript configuration
            const tsconfigPath = path.join(outputDir, 'tsconfig.json');
            await fs.writeFile(tsconfigPath, this.generateTsConfig(), 'utf-8');
            // Calculate package size
            const packageSize = await this.calculatePackageSize(outputDir);
            const duration = Date.now() - startTime;
            return {
                platform: this.platform,
                success: true,
                packagePath: outputDir,
                duration,
                warnings,
                errors,
                metadata: {
                    componentsBuilt: components.length,
                    tokensGenerated: this.countTokens(tokens),
                    packageSize,
                    timestamp: new Date().toISOString()
                }
            };
        }
        catch (error) {
            const duration = Date.now() - startTime;
            errors.push({
                code: 'WEB_BUILD_FAILED',
                message: error instanceof Error ? error.message : 'Unknown build error',
                severity: 'error',
                category: 'build',
                platform: this.platform,
                context: { error },
                suggestions: [
                    'Check that output directory is writable',
                    'Verify component definitions are valid',
                    'Ensure token integration is correct'
                ],
                documentation: []
            });
            return {
                platform: this.platform,
                success: false,
                packagePath: '',
                duration,
                warnings,
                errors
            };
        }
    }
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
    async generateNPMPackage(components, tokens, config) {
        const sourceFiles = [];
        const cssFiles = [];
        // Generate main CSS tokens file
        const tokensCSS = this.generateTokensCSS(tokens);
        cssFiles.push({
            path: 'styles/tokens.css',
            content: tokensCSS
        });
        // Generate TypeScript token constants
        const tokensTS = this.generateTokens(tokens);
        sourceFiles.push({
            path: 'tokens/tokens.ts',
            content: tokensTS
        });
        // Generate token category files for better organization
        sourceFiles.push({
            path: 'tokens/spacing.ts',
            content: this.generateSpacingTokensFile(tokens)
        });
        sourceFiles.push({
            path: 'tokens/colors.ts',
            content: this.generateColorTokensFile(tokens)
        });
        sourceFiles.push({
            path: 'tokens/typography.ts',
            content: this.generateTypographyTokensFile(tokens)
        });
        // Generate Web Component (Lit) files
        for (const component of components) {
            const componentContent = this.generateLitComponent(component, tokens);
            sourceFiles.push({
                path: `components/${component.name}.ts`,
                content: componentContent
            });
        }
        // Generate main index file
        sourceFiles.push({
            path: 'index.ts',
            content: this.generateIndexFile(components)
        });
        // Generate package.json
        const packageJson = this.generatePackageJson(config);
        return {
            packageJson,
            sourceFiles,
            cssFiles,
            declarations: []
        };
    }
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
    generatePackageJson(config) {
        const { packageName, packageVersion, packageDescription, formats } = this.buildConfig;
        return {
            name: packageName,
            version: packageVersion,
            description: packageDescription,
            main: formats.includes('cjs') ? './dist/index.cjs' : './dist/index.js',
            module: formats.includes('esm') ? './dist/index.js' : undefined,
            types: './dist/index.d.ts',
            files: [
                'dist',
                'src',
                'README.md'
            ],
            dependencies: {
                'lit': '^3.1.0'
            },
            devDependencies: {
                'typescript': '^5.3.0',
                '@types/node': '^20.10.0',
                'vite': '^5.0.0'
            },
            peerDependencies: {
                'lit': '^3.0.0'
            },
            scripts: {
                'build': 'tsc && vite build',
                'dev': 'vite',
                'test': 'echo "Tests not yet implemented"'
            },
            keywords: [
                'design-system',
                'design-tokens',
                'web-components',
                'lit',
                'designerpunk'
            ],
            author: 'DesignerPunk',
            license: 'MIT'
        };
    }
    /**
     * Generate TypeScript configuration
     */
    generateTsConfig() {
        return JSON.stringify({
            compilerOptions: {
                target: this.buildConfig.target,
                module: 'ESNext',
                lib: ['ES2020', 'DOM', 'DOM.Iterable'],
                declaration: true,
                declarationMap: true,
                sourceMap: true,
                outDir: './dist',
                rootDir: './src',
                strict: true,
                esModuleInterop: true,
                skipLibCheck: true,
                forceConsistentCasingInFileNames: true,
                moduleResolution: 'node',
                resolveJsonModule: true,
                experimentalDecorators: true,
                useDefineForClassFields: false
            },
            include: ['src/**/*'],
            exclude: ['node_modules', 'dist']
        }, null, 2);
    }
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
    generateTokensCSS(tokens) {
        const lines = [];
        // File header
        lines.push('/**');
        lines.push(' * tokens.css');
        lines.push(' * DesignerPunk Design System');
        lines.push(' *');
        lines.push(' * Auto-generated CSS custom properties for Web');
        lines.push(' * DO NOT EDIT - Generated from F1 Mathematical Token System');
        lines.push(' */');
        lines.push('');
        lines.push(':root {');
        // Generate primitive tokens
        this.generatePrimitiveTokensCSS(lines, tokens.primitives);
        // Generate semantic tokens
        this.generateSemanticTokensCSS(lines, tokens.semantics);
        // Generate component tokens (if any)
        this.generateComponentTokensCSS(lines, tokens.components);
        lines.push('}');
        lines.push('');
        return lines.join('\n');
    }
    /**
     * Generate primitive token CSS custom properties
     */
    generatePrimitiveTokensCSS(lines, primitives) {
        lines.push('  /* Primitive Tokens */');
        lines.push('  ');
        // Generate spacing tokens
        if (Object.keys(primitives.spacing).length > 0) {
            lines.push('  /* Primitive spacing tokens (px/rem units) */');
            for (const [name, value] of Object.entries(primitives.spacing)) {
                const cssName = this.toCSSVariableName(name);
                lines.push(`  --${cssName}: ${value.value}${value.unit};`);
            }
            lines.push('  ');
        }
        // Generate color tokens
        if (Object.keys(primitives.colors).length > 0) {
            lines.push('  /* Primitive color tokens */');
            for (const [name, value] of Object.entries(primitives.colors)) {
                const cssName = this.toCSSVariableName(name);
                lines.push(`  --${cssName}: ${value.value};`);
            }
            lines.push('  ');
        }
        // Generate typography tokens
        if (Object.keys(primitives.typography).length > 0) {
            lines.push('  /* Primitive typography tokens (px/rem units) */');
            for (const [name, value] of Object.entries(primitives.typography)) {
                const cssName = this.toCSSVariableName(name);
                lines.push(`  --${cssName}: ${value.value}${value.unit};`);
            }
            lines.push('  ');
        }
        // Generate radius tokens
        if (Object.keys(primitives.radius).length > 0) {
            lines.push('  /* Primitive radius tokens (px/rem units) */');
            for (const [name, value] of Object.entries(primitives.radius)) {
                const cssName = this.toCSSVariableName(name);
                lines.push(`  --${cssName}: ${value.value}${value.unit};`);
            }
            lines.push('  ');
        }
        // Generate sizing tokens
        if (Object.keys(primitives.sizing).length > 0) {
            lines.push('  /* Primitive sizing tokens (px/rem units) */');
            for (const [name, value] of Object.entries(primitives.sizing)) {
                const cssName = this.toCSSVariableName(name);
                lines.push(`  --${cssName}: ${value.value}${value.unit};`);
            }
            lines.push('  ');
        }
    }
    /**
     * Generate semantic token CSS custom properties
     */
    generateSemanticTokensCSS(lines, semantics) {
        const hasSemanticTokens = Object.values(semantics).some(category => Object.keys(category).length > 0);
        if (!hasSemanticTokens) {
            return;
        }
        lines.push('  /* Semantic Tokens */');
        lines.push('  ');
        // Generate semantic spacing tokens
        if (Object.keys(semantics.spacing).length > 0) {
            lines.push('  /* Semantic spacing tokens (px/rem units) */');
            for (const [name, value] of Object.entries(semantics.spacing)) {
                const cssName = this.toCSSVariableName(name);
                lines.push(`  --${cssName}: ${value.value}${value.unit}; /* references: ${value.token} */`);
            }
            lines.push('  ');
        }
        // Generate semantic color tokens
        if (Object.keys(semantics.colors).length > 0) {
            lines.push('  /* Semantic color tokens */');
            for (const [name, value] of Object.entries(semantics.colors)) {
                const cssName = this.toCSSVariableName(name);
                lines.push(`  --${cssName}: ${value.value}; /* references: ${value.token} */`);
            }
            lines.push('  ');
        }
        // Generate semantic typography tokens
        if (Object.keys(semantics.typography).length > 0) {
            lines.push('  /* Semantic typography tokens (px/rem units) */');
            for (const [name, value] of Object.entries(semantics.typography)) {
                const cssName = this.toCSSVariableName(name);
                lines.push(`  --${cssName}: ${value.value}${value.unit}; /* references: ${value.token} */`);
            }
            lines.push('  ');
        }
        // Generate semantic radius tokens
        if (Object.keys(semantics.radius).length > 0) {
            lines.push('  /* Semantic radius tokens (px/rem units) */');
            for (const [name, value] of Object.entries(semantics.radius)) {
                const cssName = this.toCSSVariableName(name);
                lines.push(`  --${cssName}: ${value.value}${value.unit}; /* references: ${value.token} */`);
            }
            lines.push('  ');
        }
        // Generate semantic sizing tokens
        if (Object.keys(semantics.sizing).length > 0) {
            lines.push('  /* Semantic sizing tokens (px/rem units) */');
            for (const [name, value] of Object.entries(semantics.sizing)) {
                const cssName = this.toCSSVariableName(name);
                lines.push(`  --${cssName}: ${value.value}${value.unit}; /* references: ${value.token} */`);
            }
            lines.push('  ');
        }
    }
    /**
     * Generate component token CSS custom properties (if needed)
     */
    generateComponentTokensCSS(lines, components) {
        const hasComponentTokens = Object.values(components).some(category => Object.keys(category).length > 0);
        if (!hasComponentTokens) {
            return;
        }
        lines.push('  /* Component Tokens */');
        lines.push('  /* Generated when semantic and primitive tokens are insufficient */');
        lines.push('  ');
        // Generate component spacing tokens
        if (Object.keys(components.spacing).length > 0) {
            lines.push('  /* Component spacing tokens (px/rem units) */');
            for (const [name, value] of Object.entries(components.spacing)) {
                const cssName = this.toCSSVariableName(name);
                lines.push(`  --${cssName}: ${value.value}${value.unit};`);
            }
            lines.push('  ');
        }
        // Generate component color tokens
        if (Object.keys(components.colors).length > 0) {
            lines.push('  /* Component color tokens */');
            for (const [name, value] of Object.entries(components.colors)) {
                const cssName = this.toCSSVariableName(name);
                lines.push(`  --${cssName}: ${value.value};`);
            }
            lines.push('  ');
        }
        // Generate component typography tokens
        if (Object.keys(components.typography).length > 0) {
            lines.push('  /* Component typography tokens (px/rem units) */');
            for (const [name, value] of Object.entries(components.typography)) {
                const cssName = this.toCSSVariableName(name);
                lines.push(`  --${cssName}: ${value.value}${value.unit};`);
            }
            lines.push('  ');
        }
        // Generate component radius tokens
        if (Object.keys(components.radius).length > 0) {
            lines.push('  /* Component radius tokens (px/rem units) */');
            for (const [name, value] of Object.entries(components.radius)) {
                const cssName = this.toCSSVariableName(name);
                lines.push(`  --${cssName}: ${value.value}${value.unit};`);
            }
            lines.push('  ');
        }
        // Generate component sizing tokens
        if (Object.keys(components.sizing).length > 0) {
            lines.push('  /* Component sizing tokens (px/rem units) */');
            for (const [name, value] of Object.entries(components.sizing)) {
                const cssName = this.toCSSVariableName(name);
                lines.push(`  --${cssName}: ${value.value}${value.unit};`);
            }
            lines.push('  ');
        }
    }
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
    generateTokens(tokens) {
        const lines = [];
        // File header
        lines.push('/**');
        lines.push(' * tokens.ts');
        lines.push(' * DesignerPunk Design System');
        lines.push(' *');
        lines.push(' * Auto-generated token constants for Web');
        lines.push(' * DO NOT EDIT - Generated from F1 Mathematical Token System');
        lines.push(' */');
        lines.push('');
        lines.push('/**');
        lines.push(' * Design system tokens for Web');
        lines.push(' */');
        lines.push('export const Tokens = {');
        // Generate primitive tokens
        this.generatePrimitiveTokensTS(lines, tokens.primitives);
        // Generate semantic tokens
        this.generateSemanticTokensTS(lines, tokens.semantics);
        // Generate component tokens (if any)
        this.generateComponentTokensTS(lines, tokens.components);
        lines.push('} as const;');
        lines.push('');
        lines.push('export type TokensType = typeof Tokens;');
        lines.push('');
        return lines.join('\n');
    }
    /**
     * Generate primitive token TypeScript constants
     */
    generatePrimitiveTokensTS(lines, primitives) {
        lines.push('  // Primitive Tokens');
        lines.push('  ');
        // Generate spacing tokens
        if (Object.keys(primitives.spacing).length > 0) {
            lines.push('  /** Primitive spacing tokens (px/rem units) */');
            lines.push('  spacing: {');
            for (const [name, value] of Object.entries(primitives.spacing)) {
                const tsName = this.toTypeScriptConstantName(name);
                lines.push(`    /** ${name}: ${value.value}${value.unit} */`);
                lines.push(`    ${tsName}: '${value.value}${value.unit}',`);
            }
            lines.push('  },');
            lines.push('  ');
        }
        // Generate color tokens
        if (Object.keys(primitives.colors).length > 0) {
            lines.push('  /** Primitive color tokens */');
            lines.push('  colors: {');
            for (const [name, value] of Object.entries(primitives.colors)) {
                const tsName = this.toTypeScriptConstantName(name);
                lines.push(`    /** ${name}: ${value.value} */`);
                lines.push(`    ${tsName}: '${value.value}',`);
            }
            lines.push('  },');
            lines.push('  ');
        }
        // Generate typography tokens
        if (Object.keys(primitives.typography).length > 0) {
            lines.push('  /** Primitive typography tokens (px/rem units) */');
            lines.push('  typography: {');
            for (const [name, value] of Object.entries(primitives.typography)) {
                const tsName = this.toTypeScriptConstantName(name);
                lines.push(`    /** ${name}: ${value.value}${value.unit} */`);
                lines.push(`    ${tsName}: '${value.value}${value.unit}',`);
            }
            lines.push('  },');
            lines.push('  ');
        }
        // Generate radius tokens
        if (Object.keys(primitives.radius).length > 0) {
            lines.push('  /** Primitive radius tokens (px/rem units) */');
            lines.push('  radius: {');
            for (const [name, value] of Object.entries(primitives.radius)) {
                const tsName = this.toTypeScriptConstantName(name);
                lines.push(`    /** ${name}: ${value.value}${value.unit} */`);
                lines.push(`    ${tsName}: '${value.value}${value.unit}',`);
            }
            lines.push('  },');
            lines.push('  ');
        }
        // Generate sizing tokens
        if (Object.keys(primitives.sizing).length > 0) {
            lines.push('  /** Primitive sizing tokens (px/rem units) */');
            lines.push('  sizing: {');
            for (const [name, value] of Object.entries(primitives.sizing)) {
                const tsName = this.toTypeScriptConstantName(name);
                lines.push(`    /** ${name}: ${value.value}${value.unit} */`);
                lines.push(`    ${tsName}: '${value.value}${value.unit}',`);
            }
            lines.push('  },');
            lines.push('  ');
        }
    }
    /**
     * Generate semantic token TypeScript constants
     */
    generateSemanticTokensTS(lines, semantics) {
        const hasSemanticTokens = Object.values(semantics).some(category => Object.keys(category).length > 0);
        if (!hasSemanticTokens) {
            return;
        }
        lines.push('  // Semantic Tokens');
        lines.push('  ');
        // Generate semantic spacing tokens
        if (Object.keys(semantics.spacing).length > 0) {
            lines.push('  /** Semantic spacing tokens (px/rem units) */');
            lines.push('  semanticSpacing: {');
            for (const [name, value] of Object.entries(semantics.spacing)) {
                const tsName = this.toTypeScriptConstantName(name);
                lines.push(`    /** ${name}: ${value.value}${value.unit} (references: ${value.token}) */`);
                lines.push(`    ${tsName}: '${value.value}${value.unit}',`);
            }
            lines.push('  },');
            lines.push('  ');
        }
        // Generate semantic color tokens
        if (Object.keys(semantics.colors).length > 0) {
            lines.push('  /** Semantic color tokens */');
            lines.push('  semanticColors: {');
            for (const [name, value] of Object.entries(semantics.colors)) {
                const tsName = this.toTypeScriptConstantName(name);
                lines.push(`    /** ${name}: ${value.value} (references: ${value.token}) */`);
                lines.push(`    ${tsName}: '${value.value}',`);
            }
            lines.push('  },');
            lines.push('  ');
        }
        // Generate semantic typography tokens
        if (Object.keys(semantics.typography).length > 0) {
            lines.push('  /** Semantic typography tokens (px/rem units) */');
            lines.push('  semanticTypography: {');
            for (const [name, value] of Object.entries(semantics.typography)) {
                const tsName = this.toTypeScriptConstantName(name);
                lines.push(`    /** ${name}: ${value.value}${value.unit} (references: ${value.token}) */`);
                lines.push(`    ${tsName}: '${value.value}${value.unit}',`);
            }
            lines.push('  },');
            lines.push('  ');
        }
        // Generate semantic radius tokens
        if (Object.keys(semantics.radius).length > 0) {
            lines.push('  /** Semantic radius tokens (px/rem units) */');
            lines.push('  semanticRadius: {');
            for (const [name, value] of Object.entries(semantics.radius)) {
                const tsName = this.toTypeScriptConstantName(name);
                lines.push(`    /** ${name}: ${value.value}${value.unit} (references: ${value.token}) */`);
                lines.push(`    ${tsName}: '${value.value}${value.unit}',`);
            }
            lines.push('  },');
            lines.push('  ');
        }
        // Generate semantic sizing tokens
        if (Object.keys(semantics.sizing).length > 0) {
            lines.push('  /** Semantic sizing tokens (px/rem units) */');
            lines.push('  semanticSizing: {');
            for (const [name, value] of Object.entries(semantics.sizing)) {
                const tsName = this.toTypeScriptConstantName(name);
                lines.push(`    /** ${name}: ${value.value}${value.unit} (references: ${value.token}) */`);
                lines.push(`    ${tsName}: '${value.value}${value.unit}',`);
            }
            lines.push('  },');
            lines.push('  ');
        }
    }
    /**
     * Generate component token TypeScript constants (if needed)
     */
    generateComponentTokensTS(lines, components) {
        const hasComponentTokens = Object.values(components).some(category => Object.keys(category).length > 0);
        if (!hasComponentTokens) {
            return;
        }
        lines.push('  // Component Tokens');
        lines.push('  // Generated when semantic and primitive tokens are insufficient');
        lines.push('  ');
        // Generate component spacing tokens
        if (Object.keys(components.spacing).length > 0) {
            lines.push('  /** Component spacing tokens (px/rem units) */');
            lines.push('  componentSpacing: {');
            for (const [name, value] of Object.entries(components.spacing)) {
                const tsName = this.toTypeScriptConstantName(name);
                lines.push(`    /** ${name}: ${value.value}${value.unit} */`);
                lines.push(`    ${tsName}: '${value.value}${value.unit}',`);
            }
            lines.push('  },');
            lines.push('  ');
        }
        // Generate component color tokens
        if (Object.keys(components.colors).length > 0) {
            lines.push('  /** Component color tokens */');
            lines.push('  componentColors: {');
            for (const [name, value] of Object.entries(components.colors)) {
                const tsName = this.toTypeScriptConstantName(name);
                lines.push(`    /** ${name}: ${value.value} */`);
                lines.push(`    ${tsName}: '${value.value}',`);
            }
            lines.push('  },');
            lines.push('  ');
        }
        // Generate component typography tokens
        if (Object.keys(components.typography).length > 0) {
            lines.push('  /** Component typography tokens (px/rem units) */');
            lines.push('  componentTypography: {');
            for (const [name, value] of Object.entries(components.typography)) {
                const tsName = this.toTypeScriptConstantName(name);
                lines.push(`    /** ${name}: ${value.value}${value.unit} */`);
                lines.push(`    ${tsName}: '${value.value}${value.unit}',`);
            }
            lines.push('  },');
            lines.push('  ');
        }
        // Generate component radius tokens
        if (Object.keys(components.radius).length > 0) {
            lines.push('  /** Component radius tokens (px/rem units) */');
            lines.push('  componentRadius: {');
            for (const [name, value] of Object.entries(components.radius)) {
                const tsName = this.toTypeScriptConstantName(name);
                lines.push(`    /** ${name}: ${value.value}${value.unit} */`);
                lines.push(`    ${tsName}: '${value.value}${value.unit}',`);
            }
            lines.push('  },');
            lines.push('  ');
        }
        // Generate component sizing tokens
        if (Object.keys(components.sizing).length > 0) {
            lines.push('  /** Component sizing tokens (px/rem units) */');
            lines.push('  componentSizing: {');
            for (const [name, value] of Object.entries(components.sizing)) {
                const tsName = this.toTypeScriptConstantName(name);
                lines.push(`    /** ${name}: ${value.value}${value.unit} */`);
                lines.push(`    ${tsName}: '${value.value}${value.unit}',`);
            }
            lines.push('  },');
            lines.push('  ');
        }
    }
    /**
     * Generate spacing tokens file
     */
    generateSpacingTokensFile(tokens) {
        const lines = [];
        lines.push('/**');
        lines.push(' * spacing.ts');
        lines.push(' * DesignerPunk Design System');
        lines.push(' *');
        lines.push(' * Spacing token constants for Web');
        lines.push(' */');
        lines.push('');
        lines.push('/** Spacing tokens organized by hierarchy */');
        lines.push('export const Space = {');
        lines.push('  // Primitive spacing tokens');
        for (const [name, value] of Object.entries(tokens.primitives.spacing)) {
            const tsName = this.toTypeScriptConstantName(name);
            lines.push(`  ${tsName}: '${value.value}${value.unit}',`);
        }
        lines.push('} as const;');
        lines.push('');
        return lines.join('\n');
    }
    /**
     * Generate color tokens file
     */
    generateColorTokensFile(tokens) {
        const lines = [];
        lines.push('/**');
        lines.push(' * colors.ts');
        lines.push(' * DesignerPunk Design System');
        lines.push(' *');
        lines.push(' * Color token constants for Web');
        lines.push(' */');
        lines.push('');
        lines.push('/** Color tokens organized by hierarchy */');
        lines.push('export const ColorPalette = {');
        lines.push('  // Primitive color tokens');
        for (const [name, value] of Object.entries(tokens.primitives.colors)) {
            const tsName = this.toTypeScriptConstantName(name);
            lines.push(`  ${tsName}: '${value.value}',`);
        }
        lines.push('} as const;');
        lines.push('');
        return lines.join('\n');
    }
    /**
     * Generate typography tokens file
     */
    generateTypographyTokensFile(tokens) {
        const lines = [];
        lines.push('/**');
        lines.push(' * typography.ts');
        lines.push(' * DesignerPunk Design System');
        lines.push(' *');
        lines.push(' * Typography token constants for Web');
        lines.push(' */');
        lines.push('');
        lines.push('/** Typography tokens organized by hierarchy */');
        lines.push('export const Type = {');
        lines.push('  // Primitive typography tokens');
        for (const [name, value] of Object.entries(tokens.primitives.typography)) {
            const tsName = this.toTypeScriptConstantName(name);
            lines.push(`  ${tsName}: '${value.value}${value.unit}',`);
        }
        lines.push('} as const;');
        lines.push('');
        return lines.join('\n');
    }
    /**
     * Generate Lit Web Component with proper structure
     */
    generateLitComponent(component, tokens) {
        const lines = [];
        lines.push('/**');
        lines.push(` * ${component.name}.ts`);
        lines.push(' * DesignerPunk Design System');
        lines.push(' *');
        lines.push(` * ${component.description}`);
        lines.push(' */');
        lines.push('');
        lines.push("import { LitElement, html, css } from 'lit';");
        lines.push("import { customElement, property } from 'lit/decorators.js';");
        lines.push("import { Tokens } from '../tokens/tokens';");
        lines.push('');
        lines.push('/**');
        lines.push(` * ${component.description}`);
        lines.push(' *');
        lines.push(' * A Lit Web Component that follows the DesignerPunk design system.');
        lines.push(' * Uses mathematical token relationships for consistent spacing and sizing.');
        lines.push(' */');
        lines.push(`@customElement('dp-${this.toKebabCase(component.name)}')`);
        lines.push(`export class ${component.name} extends LitElement {`);
        lines.push('  static styles = css`');
        lines.push('    :host {');
        lines.push('      display: block;');
        lines.push('      padding: var(--space-100, 8px);');
        lines.push('    }');
        lines.push('    ');
        lines.push('    .container {');
        lines.push('      display: flex;');
        lines.push('      flex-direction: column;');
        lines.push('      gap: var(--space-100, 8px);');
        lines.push('    }');
        lines.push('    ');
        lines.push('    .text {');
        lines.push('      font-size: var(--font-size-100, 16px);');
        lines.push('      color: var(--color-blue-500, #3B82F6);');
        lines.push('    }');
        lines.push('  `;');
        lines.push('  ');
        lines.push('  @property({ type: String })');
        lines.push('  label = "";');
        lines.push('  ');
        lines.push('  render() {');
        lines.push('    return html`');
        lines.push('      <div class="container">');
        lines.push(`        <span class="text">\${this.label || '${component.name}'}</span>`);
        lines.push('      </div>');
        lines.push('    `;');
        lines.push('  }');
        lines.push('}');
        lines.push('');
        lines.push('declare global {');
        lines.push('  interface HTMLElementTagNameMap {');
        lines.push(`    'dp-${this.toKebabCase(component.name)}': ${component.name};`);
        lines.push('  }');
        lines.push('}');
        lines.push('');
        return lines.join('\n');
    }
    /**
     * Generate main index file
     */
    generateIndexFile(components) {
        const lines = [];
        lines.push('/**');
        lines.push(' * index.ts');
        lines.push(' * DesignerPunk Design System');
        lines.push(' *');
        lines.push(' * Main entry point for the design system');
        lines.push(' */');
        lines.push('');
        lines.push('// Export tokens');
        lines.push("export { Tokens } from './tokens/tokens';");
        lines.push("export { Space } from './tokens/spacing';");
        lines.push("export { ColorPalette } from './tokens/colors';");
        lines.push("export { Type } from './tokens/typography';");
        lines.push('');
        lines.push('// Export components');
        for (const component of components) {
            lines.push(`export { ${component.name} } from './components/${component.name}';`);
        }
        lines.push('');
        return lines.join('\n');
    }
    /**
     * Validate Web implementation
     */
    validate(implementation) {
        const errors = [];
        const warnings = [];
        // Basic validation - can be expanded
        if (!implementation) {
            errors.push('Implementation is required');
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
    /**
     * Clean build artifacts
     */
    async clean(outputDir) {
        const webDir = path.join(outputDir, 'web');
        try {
            await fs.rm(webDir, { recursive: true, force: true });
        }
        catch (error) {
            // Directory might not exist, which is fine
        }
    }
    /**
     * Calculate package size
     */
    async calculatePackageSize(dir) {
        let totalSize = 0;
        try {
            const files = await fs.readdir(dir, { withFileTypes: true });
            for (const file of files) {
                const filePath = path.join(dir, file.name);
                if (file.isDirectory()) {
                    totalSize += await this.calculatePackageSize(filePath);
                }
                else {
                    const stats = await fs.stat(filePath);
                    totalSize += stats.size;
                }
            }
        }
        catch (error) {
            // Ignore errors
        }
        return totalSize;
    }
    /**
     * Count tokens in platform tokens
     */
    countTokens(tokens) {
        let count = 0;
        // Count primitive tokens
        count += Object.keys(tokens.primitives.spacing).length;
        count += Object.keys(tokens.primitives.colors).length;
        count += Object.keys(tokens.primitives.typography).length;
        count += Object.keys(tokens.primitives.radius).length;
        count += Object.keys(tokens.primitives.sizing).length;
        // Count semantic tokens
        count += Object.keys(tokens.semantics.spacing).length;
        count += Object.keys(tokens.semantics.colors).length;
        count += Object.keys(tokens.semantics.typography).length;
        count += Object.keys(tokens.semantics.radius).length;
        count += Object.keys(tokens.semantics.sizing).length;
        // Count component tokens
        count += Object.keys(tokens.components.spacing).length;
        count += Object.keys(tokens.components.colors).length;
        count += Object.keys(tokens.components.typography).length;
        count += Object.keys(tokens.components.radius).length;
        count += Object.keys(tokens.components.sizing).length;
        return count;
    }
    /**
     * Convert token name to CSS variable name
     * Example: space100 -> space-100, colorBlue500 -> color-blue-500
     */
    toCSSVariableName(name) {
        return name
            .replace(/([A-Z])/g, '-$1') // Convert camelCase to kebab-case
            .replace(/\./g, '-') // Convert dots to hyphens
            .replace(/([a-z])(\d)/g, '$1-$2') // Insert hyphen between letter and number
            .toLowerCase()
            .replace(/^-/, '');
    }
    /**
     * Convert token name to TypeScript constant name
     * Example: space100 -> space100, color.blue.500 -> colorBlue500
     */
    toTypeScriptConstantName(name) {
        return name
            .replace(/\./g, '_')
            .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    }
    /**
     * Convert component name to kebab-case
     * Example: ButtonCTA -> button-cta
     */
    toKebabCase(name) {
        return name
            // Insert hyphen before uppercase letters that follow lowercase letters
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            // Insert hyphen before uppercase letter that is followed by lowercase (handles acronyms)
            .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
            .toLowerCase();
    }
}
exports.WebBuilder = WebBuilder;
//# sourceMappingURL=WebBuilder.js.map