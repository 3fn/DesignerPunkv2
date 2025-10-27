"use strict";
/**
 * Android Build Integration Tests
 *
 * Integration tests for Android build and validation workflow
 * Tests the complete flow from build to validation
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
const AndroidBuilder_1 = require("../platforms/AndroidBuilder");
const AndroidBuildValidator_1 = require("../validation/AndroidBuildValidator");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
describe('Android Build Integration', () => {
    let builder;
    let validator;
    let tempDir;
    beforeEach(async () => {
        builder = new AndroidBuilder_1.AndroidBuilder({
            kotlinVersion: '1.9.20',
            minSdkVersion: 24,
            targetSdkVersion: 34,
            dependencies: []
        });
        validator = new AndroidBuildValidator_1.AndroidBuildValidator();
        // Create temporary directory for build output
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'android-build-integration-'));
    });
    afterEach(async () => {
        // Clean up temporary directory
        try {
            await fs.rm(tempDir, { recursive: true, force: true });
        }
        catch {
            // Ignore cleanup errors
        }
    });
    describe('Complete build and validation workflow', () => {
        it('should build and validate Android package successfully', async () => {
            // Create mock component definitions
            const components = [
                {
                    name: 'Button',
                    description: 'A button component',
                    category: 'action',
                    properties: [],
                    methods: [],
                    tokens: []
                }
            ];
            // Create mock platform tokens
            const tokens = {
                platform: 'android',
                primitives: {
                    spacing: {
                        space100: { value: 8, unit: 'dp', token: 'space100' },
                        space200: { value: 16, unit: 'dp', token: 'space200' }
                    },
                    colors: {
                        'color.blue.500': { value: '#3B82F6', unit: '', token: 'color.blue.500' }
                    },
                    typography: {
                        fontSize100: { value: 16, unit: 'sp', token: 'fontSize100' }
                    },
                    radius: {
                        radius050: { value: 4, unit: 'dp', token: 'radius050' }
                    },
                    sizing: {
                        size100: { value: 8, unit: 'dp', token: 'size100' }
                    },
                    opacity: {},
                    elevation: {},
                    animation: {}
                },
                semantics: {
                    spacing: {},
                    colors: {},
                    typography: {},
                    radius: {},
                    sizing: {},
                    opacity: {},
                    elevation: {},
                    animation: {}
                },
                components: {
                    spacing: {},
                    colors: {},
                    typography: {},
                    radius: {},
                    sizing: {},
                    opacity: {},
                    elevation: {},
                    animation: {}
                },
                metadata: {
                    platform: 'android',
                    defaultSpacingUnit: 'dp',
                    defaultTypographyUnit: 'sp',
                    supportedUnits: ['dp', 'sp'],
                    constraints: {
                        decimalPrecision: 2,
                        supportsSubpixel: true,
                        roundingMode: 'round'
                    },
                    generatedAt: new Date()
                }
            };
            // Create build configuration
            const config = {
                platforms: ['android'],
                mode: 'development',
                outputDir: tempDir,
                parallel: false,
                incremental: false,
                sourceMaps: true,
                minify: false,
                validation: {
                    interfaces: true,
                    tokens: true,
                    mathematical: true
                }
            };
            // Execute build
            const buildResult = await builder.build(components, tokens, config);
            // Verify build succeeded
            expect(buildResult.success).toBe(true);
            expect(buildResult.platform).toBe('android');
            expect(buildResult.errors.length).toBe(0);
            // Execute validation
            const validationResult = await validator.validate(buildResult);
            // Verify validation passed
            expect(validationResult.valid).toBe(true);
            expect(validationResult.buildGradleValid).toBe(true);
            expect(validationResult.kotlinConstantsValid).toBe(true);
            expect(validationResult.moduleImportValid).toBe(true);
            expect(validationResult.optimizationsValid).toBe(true);
            expect(validationResult.errors.length).toBe(0);
            // Verify build artifacts exist
            const buildGradlePath = path.join(buildResult.packagePath, 'build.gradle.kts');
            const buildGradleExists = await fs.access(buildGradlePath).then(() => true).catch(() => false);
            expect(buildGradleExists).toBe(true);
            const manifestPath = path.join(buildResult.packagePath, 'src', 'main', 'AndroidManifest.xml');
            const manifestExists = await fs.access(manifestPath).then(() => true).catch(() => false);
            expect(manifestExists).toBe(true);
            // Verify Kotlin files exist
            expect(validationResult.details.kotlinFiles).toBeDefined();
            expect(validationResult.details.kotlinFiles.length).toBeGreaterThan(0);
        });
        it('should provide detailed validation errors for invalid build', async () => {
            // Create a build result with missing files
            const buildResult = {
                platform: 'android',
                success: true,
                packagePath: tempDir,
                duration: 1000,
                warnings: [],
                errors: []
            };
            // Execute validation (should fail due to missing files)
            const validationResult = await validator.validate(buildResult);
            // Verify validation failed
            expect(validationResult.valid).toBe(false);
            expect(validationResult.errors.length).toBeGreaterThan(0);
            // Verify error details are provided
            const firstError = validationResult.errors[0];
            expect(firstError.code).toBeDefined();
            expect(firstError.message).toBeDefined();
            expect(firstError.severity).toBe('error');
            expect(firstError.category).toBeDefined();
            expect(firstError.suggestions.length).toBeGreaterThan(0);
        });
        it('should validate Jetpack Compose optimizations', async () => {
            const components = [];
            const tokens = {
                platform: 'android',
                primitives: {
                    spacing: { space100: { value: 8, unit: 'dp', token: 'space100' } },
                    colors: {},
                    typography: {},
                    radius: {},
                    sizing: {},
                    opacity: {},
                    elevation: {},
                    animation: {}
                },
                semantics: {
                    spacing: {},
                    colors: {},
                    typography: {},
                    radius: {},
                    sizing: {},
                    opacity: {},
                    elevation: {},
                    animation: {}
                },
                components: {
                    spacing: {},
                    colors: {},
                    typography: {},
                    radius: {},
                    sizing: {},
                    opacity: {},
                    elevation: {},
                    animation: {}
                },
                metadata: {
                    platform: 'android',
                    defaultSpacingUnit: 'dp',
                    defaultTypographyUnit: 'sp',
                    supportedUnits: ['dp', 'sp'],
                    constraints: {
                        decimalPrecision: 2,
                        supportsSubpixel: true,
                        roundingMode: 'round'
                    },
                    generatedAt: new Date()
                }
            };
            const config = {
                platforms: ['android'],
                mode: 'production',
                outputDir: tempDir,
                parallel: false,
                incremental: false,
                sourceMaps: false,
                minify: true,
                validation: {
                    interfaces: true,
                    tokens: true,
                    mathematical: true
                }
            };
            // Execute build
            const buildResult = await builder.build(components, tokens, config);
            expect(buildResult.success).toBe(true);
            // Execute validation
            const validationResult = await validator.validate(buildResult);
            // Verify Compose optimizations are validated
            expect(validationResult.optimizationsValid).toBe(true);
            expect(validationResult.details.optimizations).toBeDefined();
            expect(validationResult.details.optimizations).toContain('Jetpack Compose enabled');
        });
    });
    describe('Build artifact validation', () => {
        it('should validate build.gradle.kts contains required dependencies', async () => {
            const components = [];
            const tokens = {
                platform: 'android',
                primitives: {
                    spacing: {},
                    colors: {},
                    typography: {},
                    radius: {},
                    sizing: {},
                    opacity: {},
                    elevation: {},
                    animation: {}
                },
                semantics: {
                    spacing: {},
                    colors: {},
                    typography: {},
                    radius: {},
                    sizing: {},
                    opacity: {},
                    elevation: {},
                    animation: {}
                },
                components: {
                    spacing: {},
                    colors: {},
                    typography: {},
                    radius: {},
                    sizing: {},
                    opacity: {},
                    elevation: {},
                    animation: {}
                },
                metadata: {
                    platform: 'android',
                    defaultSpacingUnit: 'dp',
                    defaultTypographyUnit: 'sp',
                    supportedUnits: ['dp', 'sp'],
                    constraints: {
                        decimalPrecision: 2,
                        supportsSubpixel: true,
                        roundingMode: 'round'
                    },
                    generatedAt: new Date()
                }
            };
            const config = {
                platforms: ['android'],
                mode: 'development',
                outputDir: tempDir,
                parallel: false,
                incremental: false,
                sourceMaps: true,
                minify: false,
                validation: {
                    interfaces: true,
                    tokens: true,
                    mathematical: true
                }
            };
            // Execute build
            const buildResult = await builder.build(components, tokens, config);
            expect(buildResult.success).toBe(true);
            // Read build.gradle.kts
            const buildGradlePath = path.join(buildResult.packagePath, 'build.gradle.kts');
            const buildGradleContent = await fs.readFile(buildGradlePath, 'utf-8');
            // Verify required dependencies
            expect(buildGradleContent).toContain('androidx.compose.ui:ui');
            expect(buildGradleContent).toContain('androidx.compose.material3:material3');
            expect(buildGradleContent).toContain('org.jetbrains.kotlin:kotlin-stdlib');
        });
        it('should validate Kotlin token files have proper structure', async () => {
            const components = [];
            const tokens = {
                platform: 'android',
                primitives: {
                    spacing: {
                        space100: { value: 8, unit: 'dp', token: 'space100' },
                        space200: { value: 16, unit: 'dp', token: 'space200' }
                    },
                    colors: {
                        'color.blue.500': { value: '#3B82F6', unit: '', token: 'color.blue.500' }
                    },
                    typography: {},
                    radius: {},
                    sizing: {},
                    opacity: {},
                    elevation: {},
                    animation: {}
                },
                semantics: {
                    spacing: {},
                    colors: {},
                    typography: {},
                    radius: {},
                    sizing: {},
                    opacity: {},
                    elevation: {},
                    animation: {}
                },
                components: {
                    spacing: {},
                    colors: {},
                    typography: {},
                    radius: {},
                    sizing: {},
                    opacity: {},
                    elevation: {},
                    animation: {}
                },
                metadata: {
                    platform: 'android',
                    defaultSpacingUnit: 'dp',
                    defaultTypographyUnit: 'sp',
                    supportedUnits: ['dp', 'sp'],
                    constraints: {
                        decimalPrecision: 2,
                        supportsSubpixel: true,
                        roundingMode: 'round'
                    },
                    generatedAt: new Date()
                }
            };
            const config = {
                platforms: ['android'],
                mode: 'development',
                outputDir: tempDir,
                parallel: false,
                incremental: false,
                sourceMaps: true,
                minify: false,
                validation: {
                    interfaces: true,
                    tokens: true,
                    mathematical: true
                }
            };
            // Execute build
            const buildResult = await builder.build(components, tokens, config);
            expect(buildResult.success).toBe(true);
            // Execute validation
            const validationResult = await validator.validate(buildResult);
            expect(validationResult.valid).toBe(true);
            // Verify Kotlin files were generated
            expect(validationResult.details.kotlinFiles).toBeDefined();
            expect(validationResult.details.kotlinFiles.length).toBeGreaterThan(0);
            // Verify token file exists and has proper structure
            const tokenFiles = validationResult.details.kotlinFiles.filter(f => f.includes('tokens/'));
            expect(tokenFiles.length).toBeGreaterThan(0);
        });
    });
});
//# sourceMappingURL=AndroidBuildIntegration.test.js.map