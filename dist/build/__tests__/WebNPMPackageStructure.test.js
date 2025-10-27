"use strict";
/**
 * Web NPM Package Structure Tests
 *
 * Tests NPM package generation with proper structure
 * Validates Requirements 2.3, 2.5
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
const WebBuilder_1 = require("../platforms/WebBuilder");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
describe('WebBuilder - NPM Package Structure', () => {
    let webBuilder;
    let mockTokens;
    let mockComponents;
    let testOutputDir;
    const createTestConfig = () => ({
        platforms: ['web'],
        mode: 'development',
        outputDir: testOutputDir,
        parallel: false,
        incremental: false,
        sourceMaps: false,
        minify: false,
        validation: {
            interfaces: false,
            tokens: false,
            mathematical: false,
        },
    });
    const createMockTokens = () => ({
        platform: 'web',
        primitives: {
            spacing: {
                'space100': { value: 8, unit: 'px', token: 'space100' },
                'space200': { value: 16, unit: 'px', token: 'space200' },
            },
            colors: {
                'color.blue.500': { value: '#3B82F6', unit: '', token: 'color.blue.500' },
            },
            typography: {
                'fontSize100': { value: 16, unit: 'px', token: 'fontSize100' },
            },
            radius: {
                'radius100': { value: 8, unit: 'px', token: 'radius100' },
            },
            sizing: {
                'size100': { value: 32, unit: 'px', token: 'size100' },
            },
            opacity: {},
            elevation: {},
            animation: {},
        },
        semantics: {
            spacing: {},
            colors: {},
            typography: {},
            radius: {},
            sizing: {},
            opacity: {},
            elevation: {},
            animation: {},
        },
        components: {
            spacing: {},
            colors: {},
            typography: {},
            radius: {},
            sizing: {},
            opacity: {},
            elevation: {},
            animation: {},
        },
        metadata: {
            platform: 'web',
            defaultSpacingUnit: 'px',
            defaultTypographyUnit: 'px',
            supportedUnits: ['px', 'rem', 'em'],
            constraints: {
                decimalPrecision: 2,
                supportsSubpixel: true,
                roundingMode: 'round',
            },
            generatedAt: new Date(),
        },
    });
    const createMockComponents = () => [
        {
            name: 'ButtonCTA',
            description: 'Call-to-action button component',
            category: 'button',
            properties: [],
            methods: [],
            tokens: [],
        },
    ];
    beforeEach(() => {
        webBuilder = new WebBuilder_1.WebBuilder();
        testOutputDir = path.join(__dirname, '../../__test-output__/web-npm-package');
        mockTokens = createMockTokens();
        mockComponents = createMockComponents();
    });
    afterEach(async () => {
        // Clean up test output
        try {
            await fs.rm(testOutputDir, { recursive: true, force: true });
        }
        catch (error) {
            // Ignore cleanup errors
        }
    });
    describe('Requirement 2.3: NPM Package Generation', () => {
        it('should generate package.json with proper dependencies', async () => {
            const config = createTestConfig();
            const result = await webBuilder.build(mockComponents, mockTokens, config);
            expect(result.success).toBe(true);
            // Read generated package.json
            const packageJsonPath = path.join(testOutputDir, 'web/package.json');
            const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
            const packageJson = JSON.parse(packageJsonContent);
            // Verify package metadata
            expect(packageJson.name).toBe('@designerpunk/tokens');
            expect(packageJson.version).toBeDefined();
            expect(packageJson.description).toBeDefined();
            // Verify entry points
            expect(packageJson.main).toBeDefined();
            expect(packageJson.module).toBeDefined();
            expect(packageJson.types).toBe('./dist/index.d.ts');
            // Verify dependencies
            expect(packageJson.dependencies).toBeDefined();
            expect(packageJson.dependencies.lit).toBeDefined();
            // Verify devDependencies
            expect(packageJson.devDependencies).toBeDefined();
            expect(packageJson.devDependencies.typescript).toBeDefined();
            expect(packageJson.devDependencies.vite).toBeDefined();
            // Verify peerDependencies
            expect(packageJson.peerDependencies).toBeDefined();
            expect(packageJson.peerDependencies.lit).toBeDefined();
            // Verify scripts
            expect(packageJson.scripts).toBeDefined();
            expect(packageJson.scripts.build).toBeDefined();
            expect(packageJson.scripts.dev).toBeDefined();
            // Verify files array
            expect(packageJson.files).toContain('dist');
            expect(packageJson.files).toContain('src');
        });
        it('should generate valid package.json that can be parsed', async () => {
            const config = createTestConfig();
            const result = await webBuilder.build(mockComponents, mockTokens, config);
            expect(result.success).toBe(true);
            // Read and parse package.json
            const packageJsonPath = path.join(testOutputDir, 'web/package.json');
            const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
            // Should not throw
            expect(() => JSON.parse(packageJsonContent)).not.toThrow();
            const packageJson = JSON.parse(packageJsonContent);
            expect(packageJson).toBeDefined();
            expect(typeof packageJson).toBe('object');
        });
    });
    describe('Requirement 2.5: TypeScript/Lit Source File Organization', () => {
        it('should create proper directory structure', async () => {
            const config = createTestConfig();
            const result = await webBuilder.build(mockComponents, mockTokens, config);
            expect(result.success).toBe(true);
            // Verify main directories exist
            const webDir = path.join(testOutputDir, 'web');
            const srcDir = path.join(webDir, 'src');
            const distDir = path.join(webDir, 'dist');
            const webDirExists = await fs.access(webDir).then(() => true).catch(() => false);
            const srcDirExists = await fs.access(srcDir).then(() => true).catch(() => false);
            const distDirExists = await fs.access(distDir).then(() => true).catch(() => false);
            expect(webDirExists).toBe(true);
            expect(srcDirExists).toBe(true);
            expect(distDirExists).toBe(true);
        });
        it('should create organized subdirectories for source files', async () => {
            const config = createTestConfig();
            const result = await webBuilder.build(mockComponents, mockTokens, config);
            expect(result.success).toBe(true);
            // Verify subdirectories exist
            const srcDir = path.join(testOutputDir, 'web/src');
            const tokensDir = path.join(srcDir, 'tokens');
            const componentsDir = path.join(srcDir, 'components');
            const stylesDir = path.join(srcDir, 'styles');
            const tokensDirExists = await fs.access(tokensDir).then(() => true).catch(() => false);
            const componentsDirExists = await fs.access(componentsDir).then(() => true).catch(() => false);
            const stylesDirExists = await fs.access(stylesDir).then(() => true).catch(() => false);
            expect(tokensDirExists).toBe(true);
            expect(componentsDirExists).toBe(true);
            expect(stylesDirExists).toBe(true);
        });
        it('should generate token files in tokens directory', async () => {
            const config = createTestConfig();
            const result = await webBuilder.build(mockComponents, mockTokens, config);
            expect(result.success).toBe(true);
            // Verify token files exist
            const tokensDir = path.join(testOutputDir, 'web/src/tokens');
            const tokensFile = path.join(tokensDir, 'tokens.ts');
            const spacingFile = path.join(tokensDir, 'spacing.ts');
            const colorsFile = path.join(tokensDir, 'colors.ts');
            const typographyFile = path.join(tokensDir, 'typography.ts');
            const tokensFileExists = await fs.access(tokensFile).then(() => true).catch(() => false);
            const spacingFileExists = await fs.access(spacingFile).then(() => true).catch(() => false);
            const colorsFileExists = await fs.access(colorsFile).then(() => true).catch(() => false);
            const typographyFileExists = await fs.access(typographyFile).then(() => true).catch(() => false);
            expect(tokensFileExists).toBe(true);
            expect(spacingFileExists).toBe(true);
            expect(colorsFileExists).toBe(true);
            expect(typographyFileExists).toBe(true);
        });
        it('should generate CSS files in styles directory', async () => {
            const config = createTestConfig();
            const result = await webBuilder.build(mockComponents, mockTokens, config);
            expect(result.success).toBe(true);
            // Verify CSS file exists
            const stylesDir = path.join(testOutputDir, 'web/src/styles');
            const tokensCssFile = path.join(stylesDir, 'tokens.css');
            const tokensCssFileExists = await fs.access(tokensCssFile).then(() => true).catch(() => false);
            expect(tokensCssFileExists).toBe(true);
        });
        it('should generate component files in components directory', async () => {
            const config = createTestConfig();
            const result = await webBuilder.build(mockComponents, mockTokens, config);
            expect(result.success).toBe(true);
            // Verify component file exists
            const componentsDir = path.join(testOutputDir, 'web/src/components');
            const buttonFile = path.join(componentsDir, 'ButtonCTA.ts');
            const buttonFileExists = await fs.access(buttonFile).then(() => true).catch(() => false);
            expect(buttonFileExists).toBe(true);
        });
        it('should generate main index file', async () => {
            const config = createTestConfig();
            const result = await webBuilder.build(mockComponents, mockTokens, config);
            expect(result.success).toBe(true);
            // Verify index file exists
            const srcDir = path.join(testOutputDir, 'web/src');
            const indexFile = path.join(srcDir, 'index.ts');
            const indexFileExists = await fs.access(indexFile).then(() => true).catch(() => false);
            expect(indexFileExists).toBe(true);
            // Verify index file exports tokens and components
            const indexContent = await fs.readFile(indexFile, 'utf-8');
            expect(indexContent).toContain("export { Tokens } from './tokens/tokens'");
            expect(indexContent).toContain("export { Space } from './tokens/spacing'");
            expect(indexContent).toContain("export { ColorPalette } from './tokens/colors'");
            expect(indexContent).toContain("export { Type } from './tokens/typography'");
            expect(indexContent).toContain("export { ButtonCTA } from './components/ButtonCTA'");
        });
    });
    describe('Requirement 2.5: Web Component (Lit) Structure', () => {
        it('should generate Lit components with proper imports', async () => {
            const config = createTestConfig();
            const result = await webBuilder.build(mockComponents, mockTokens, config);
            expect(result.success).toBe(true);
            // Read component file
            const componentFile = path.join(testOutputDir, 'web/src/components/ButtonCTA.ts');
            const componentContent = await fs.readFile(componentFile, 'utf-8');
            // Verify Lit imports
            expect(componentContent).toContain("import { LitElement, html, css } from 'lit'");
            expect(componentContent).toContain("import { customElement, property } from 'lit/decorators.js'");
            expect(componentContent).toContain("import { Tokens } from '../tokens/tokens'");
        });
        it('should generate Lit components with custom element decorator', async () => {
            const config = createTestConfig();
            const result = await webBuilder.build(mockComponents, mockTokens, config);
            expect(result.success).toBe(true);
            // Read component file
            const componentFile = path.join(testOutputDir, 'web/src/components/ButtonCTA.ts');
            const componentContent = await fs.readFile(componentFile, 'utf-8');
            // Verify custom element decorator
            expect(componentContent).toContain("@customElement('dp-button-cta')");
            expect(componentContent).toContain('export class ButtonCTA extends LitElement');
        });
        it('should generate Lit components with static styles', async () => {
            const config = createTestConfig();
            const result = await webBuilder.build(mockComponents, mockTokens, config);
            expect(result.success).toBe(true);
            // Read component file
            const componentFile = path.join(testOutputDir, 'web/src/components/ButtonCTA.ts');
            const componentContent = await fs.readFile(componentFile, 'utf-8');
            // Verify static styles
            expect(componentContent).toContain('static styles = css`');
            expect(componentContent).toContain(':host {');
            expect(componentContent).toContain('var(--space-100, 8px)');
        });
        it('should generate Lit components with render method', async () => {
            const config = createTestConfig();
            const result = await webBuilder.build(mockComponents, mockTokens, config);
            expect(result.success).toBe(true);
            // Read component file
            const componentFile = path.join(testOutputDir, 'web/src/components/ButtonCTA.ts');
            const componentContent = await fs.readFile(componentFile, 'utf-8');
            // Verify render method
            expect(componentContent).toContain('render() {');
            expect(componentContent).toContain('return html`');
        });
        it('should generate Lit components with TypeScript declarations', async () => {
            const config = createTestConfig();
            const result = await webBuilder.build(mockComponents, mockTokens, config);
            expect(result.success).toBe(true);
            // Read component file
            const componentFile = path.join(testOutputDir, 'web/src/components/ButtonCTA.ts');
            const componentContent = await fs.readFile(componentFile, 'utf-8');
            // Verify TypeScript declarations
            expect(componentContent).toContain('declare global {');
            expect(componentContent).toContain('interface HTMLElementTagNameMap {');
            expect(componentContent).toContain("'dp-button-cta': ButtonCTA");
        });
    });
    describe('Requirement 2.5: TypeScript Compilation Configuration', () => {
        it('should generate tsconfig.json', async () => {
            const config = createTestConfig();
            const result = await webBuilder.build(mockComponents, mockTokens, config);
            expect(result.success).toBe(true);
            // Verify tsconfig.json exists
            const tsconfigPath = path.join(testOutputDir, 'web/tsconfig.json');
            const tsconfigExists = await fs.access(tsconfigPath).then(() => true).catch(() => false);
            expect(tsconfigExists).toBe(true);
        });
        it('should generate valid tsconfig.json with proper compiler options', async () => {
            const config = createTestConfig();
            const result = await webBuilder.build(mockComponents, mockTokens, config);
            expect(result.success).toBe(true);
            // Read and parse tsconfig.json
            const tsconfigPath = path.join(testOutputDir, 'web/tsconfig.json');
            const tsconfigContent = await fs.readFile(tsconfigPath, 'utf-8');
            const tsconfig = JSON.parse(tsconfigContent);
            // Verify compiler options
            expect(tsconfig.compilerOptions).toBeDefined();
            expect(tsconfig.compilerOptions.target).toBeDefined();
            expect(tsconfig.compilerOptions.module).toBe('ESNext');
            expect(tsconfig.compilerOptions.declaration).toBe(true);
            expect(tsconfig.compilerOptions.outDir).toBe('./dist');
            expect(tsconfig.compilerOptions.rootDir).toBe('./src');
            expect(tsconfig.compilerOptions.strict).toBe(true);
            expect(tsconfig.compilerOptions.experimentalDecorators).toBe(true);
            // Verify include/exclude
            expect(tsconfig.include).toContain('src/**/*');
            expect(tsconfig.exclude).toContain('node_modules');
            expect(tsconfig.exclude).toContain('dist');
        });
    });
    describe('Build Result Metadata', () => {
        it('should include package metadata in build result', async () => {
            const config = createTestConfig();
            const result = await webBuilder.build(mockComponents, mockTokens, config);
            expect(result.success).toBe(true);
            expect(result.metadata).toBeDefined();
            expect(result.metadata?.componentsBuilt).toBe(1);
            expect(result.metadata?.tokensGenerated).toBeGreaterThan(0);
            expect(result.metadata?.packageSize).toBeGreaterThan(0);
            expect(result.metadata?.timestamp).toBeDefined();
        });
        it('should report correct package path', async () => {
            const config = createTestConfig();
            const result = await webBuilder.build(mockComponents, mockTokens, config);
            expect(result.success).toBe(true);
            expect(result.packagePath).toBe(path.join(testOutputDir, 'web'));
        });
    });
});
//# sourceMappingURL=WebNPMPackageStructure.test.js.map