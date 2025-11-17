"use strict";
/**
 * Build System Integration Tests
 *
 * Tests build system compatibility, import patterns, tree-shaking optimization,
 * and cross-platform build integration for the token system.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const WebFileOrganizer_1 = require("../providers/WebFileOrganizer");
const iOSFileOrganizer_1 = require("../providers/iOSFileOrganizer");
const AndroidFileOrganizer_1 = require("../providers/AndroidFileOrganizer");
const TokenFileGenerator_1 = require("../generators/TokenFileGenerator");
describe('Build System Integration', () => {
    describe('Web Build System Integration', () => {
        let organizer;
        beforeEach(() => {
            organizer = new WebFileOrganizer_1.WebFileOrganizer();
        });
        it('should provide webpack/vite compatible configuration', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.buildSystemType).toBe('webpack/vite');
            expect(config.importPatterns).toBeDefined();
            expect(config.watchPatterns).toBeDefined();
        });
        it('should support ESM module format', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.additionalConfig?.moduleType).toBe('esm');
            expect(config.additionalConfig?.sideEffects).toBe(false);
        });
        it('should provide tree-shaking hints', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.treeShakingHints).toBeDefined();
            expect(config.treeShakingHints?.length).toBeGreaterThan(0);
            expect(config.treeShakingHints).toContain('CSS custom properties are automatically available globally');
        });
        it('should support CSS import pattern', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.importPatterns).toContain("import '@/tokens/DesignTokens.web.css'");
            expect(config.importPatterns.length).toBeGreaterThan(0);
        });
        it('should provide file watching patterns', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.watchPatterns).toContain('src/tokens/**/*.css');
        });
        it('should optimize for webpack/vite bundling', () => {
            const files = [
                'src/tokens/DesignTokens.web.css'
            ];
            const optimized = organizer.optimizeForBuildSystem(files);
            expect(optimized.primaryFile).toBe('src/tokens/DesignTokens.web.css');
            expect(optimized.importPath).toBe('@/tokens/DesignTokens.web');
            expect(optimized.optimizations.length).toBeGreaterThan(0);
        });
        it('should support PostCSS plugins configuration', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.additionalConfig?.postcssPlugins).toContain('autoprefixer');
            expect(config.additionalConfig?.postcssPlugins).toContain('cssnano');
        });
    });
    describe('iOS Build System Integration', () => {
        let organizer;
        beforeEach(() => {
            organizer = new iOSFileOrganizer_1.iOSFileOrganizer();
        });
        it('should provide Xcode/SPM compatible configuration', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.buildSystemType).toBe('xcode/swift-package-manager');
            expect(config.importPatterns).toBeDefined();
            expect(config.watchPatterns).toBeDefined();
        });
        it('should support Swift module format', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.additionalConfig?.moduleType).toBe('swift-module');
            expect(config.additionalConfig?.accessControl).toBe('public');
            expect(config.additionalConfig?.swiftVersion).toBe('5.9');
        });
        it('should provide Swift compiler optimization hints', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.treeShakingHints).toContain('Swift compiler automatically optimizes unused constants');
            expect(config.treeShakingHints).toContain('Static constants enable compile-time optimization');
        });
        it('should support Xcode project integration', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.additionalConfig?.xcodeIntegration).toBeDefined();
            expect(config.additionalConfig?.xcodeIntegration?.targetMembership).toBe('DesignSystem');
            expect(config.additionalConfig?.xcodeIntegration?.buildPhase).toBe('Compile Sources');
            expect(config.additionalConfig?.xcodeIntegration?.fileType).toBe('sourcecode.swift');
        });
        it('should provide platform version requirements', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.additionalConfig?.platforms).toContain('iOS 15.0');
            expect(config.additionalConfig?.platforms).toContain('macOS 12.0');
        });
        it('should optimize for Swift compilation', () => {
            const files = ['Sources/DesignSystem/Tokens/DesignTokens.swift'];
            const optimized = organizer.optimizeForBuildSystem(files);
            expect(optimized.primaryFile).toBe('Sources/DesignSystem/Tokens/DesignTokens.swift');
            expect(optimized.importPath).toBe('DesignSystem');
            expect(optimized.optimizations).toContain('Swift struct with static constants for compile-time optimization');
        });
        it('should provide Xcode integration details', () => {
            const integration = organizer.getXcodeIntegration();
            expect(integration.targetMembership).toBe('DesignSystem');
            expect(integration.buildPhase).toBe('Compile Sources');
            expect(integration.fileType).toBe('sourcecode.swift');
            expect(integration.group).toBe('DesignSystem/Tokens');
        });
    });
    describe('Android Build System Integration', () => {
        let organizer;
        beforeEach(() => {
            organizer = new AndroidFileOrganizer_1.AndroidFileOrganizer();
        });
        it('should provide Gradle/Android compatible configuration', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.buildSystemType).toBe('gradle/android');
            expect(config.importPatterns).toBeDefined();
            expect(config.watchPatterns).toBeDefined();
        });
        it('should support Android library module format', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.additionalConfig?.moduleType).toBe('android-library');
            expect(config.additionalConfig?.minSdkVersion).toBe(24);
            expect(config.additionalConfig?.targetSdkVersion).toBe(34);
        });
        it('should provide R8/ProGuard optimization hints', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.treeShakingHints).toContain('R8/ProGuard automatically removes unused constants');
            expect(config.treeShakingHints).toContain('Use const val for compile-time constants');
        });
        it('should support Gradle module configuration', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.additionalConfig?.gradleIntegration).toBeDefined();
            expect(config.additionalConfig?.gradleIntegration?.moduleName).toBe('designsystem');
            expect(config.additionalConfig?.gradleIntegration?.buildType).toBe('library');
        });
        it('should provide resource qualifiers for configuration', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.additionalConfig?.resourceQualifiers).toBeDefined();
            expect(config.additionalConfig?.resourceQualifiers?.night).toBe('values-night');
            expect(config.additionalConfig?.resourceQualifiers?.xhdpi).toBe('values-xhdpi');
        });
        it('should optimize for Gradle build system', () => {
            const files = [
                'designsystem/src/main/kotlin/com/designsystem/tokens/DesignTokens.kt',
                'designsystem/src/main/res/values/design_tokens.xml'
            ];
            const optimized = organizer.optimizeForBuildSystem(files);
            expect(optimized.primaryFile).toContain('DesignTokens.kt');
            expect(optimized.supportingFiles).toContain('designsystem/src/main/res/values/design_tokens.xml');
            expect(optimized.importPath).toBe('com.designsystem.tokens.DesignTokens');
        });
        it('should provide resource qualifier paths', () => {
            const qualifiers = organizer.getResourceQualifierPaths();
            expect(qualifiers.light).toContain('res/values/design_tokens.xml');
            expect(qualifiers.dark).toContain('res/values-night/design_tokens.xml');
            expect(qualifiers.densities.xhdpi).toContain('res/values-xhdpi/design_tokens.xml');
        });
    });
    describe('Cross-Platform Build Integration', () => {
        let webOrganizer;
        let iosOrganizer;
        let androidOrganizer;
        beforeEach(() => {
            webOrganizer = new WebFileOrganizer_1.WebFileOrganizer();
            iosOrganizer = new iOSFileOrganizer_1.iOSFileOrganizer();
            androidOrganizer = new AndroidFileOrganizer_1.AndroidFileOrganizer();
        });
        it('should provide consistent build system interfaces', () => {
            const webConfig = webOrganizer.getBuildSystemIntegration();
            const iosConfig = iosOrganizer.getBuildSystemIntegration();
            const androidConfig = androidOrganizer.getBuildSystemIntegration();
            // All should have required fields
            expect(webConfig.buildSystemType).toBeDefined();
            expect(iosConfig.buildSystemType).toBeDefined();
            expect(androidConfig.buildSystemType).toBeDefined();
            expect(webConfig.importPatterns).toBeDefined();
            expect(iosConfig.importPatterns).toBeDefined();
            expect(androidConfig.importPatterns).toBeDefined();
        });
        it('should provide platform-specific optimization hints', () => {
            const webConfig = webOrganizer.getBuildSystemIntegration();
            const iosConfig = iosOrganizer.getBuildSystemIntegration();
            const androidConfig = androidOrganizer.getBuildSystemIntegration();
            expect(webConfig.treeShakingHints?.length).toBeGreaterThan(0);
            expect(iosConfig.treeShakingHints?.length).toBeGreaterThan(0);
            expect(androidConfig.treeShakingHints?.length).toBeGreaterThan(0);
        });
        it('should support file watching across platforms', () => {
            const webConfig = webOrganizer.getBuildSystemIntegration();
            const iosConfig = iosOrganizer.getBuildSystemIntegration();
            const androidConfig = androidOrganizer.getBuildSystemIntegration();
            expect(webConfig.watchPatterns).toBeDefined();
            expect(iosConfig.watchPatterns).toBeDefined();
            expect(androidConfig.watchPatterns).toBeDefined();
        });
        it('should optimize file structures for each platform', () => {
            const webFiles = ['src/tokens/DesignTokens.web.css'];
            const iosFiles = ['Sources/DesignSystem/Tokens/DesignTokens.swift'];
            const androidFiles = ['designsystem/src/main/kotlin/com/designsystem/tokens/DesignTokens.kt'];
            const webOptimized = webOrganizer.optimizeForBuildSystem(webFiles);
            const iosOptimized = iosOrganizer.optimizeForBuildSystem(iosFiles);
            const androidOptimized = androidOrganizer.optimizeForBuildSystem(androidFiles);
            expect(webOptimized.optimizations.length).toBeGreaterThan(0);
            expect(iosOptimized.optimizations.length).toBeGreaterThan(0);
            expect(androidOptimized.optimizations.length).toBeGreaterThan(0);
        });
    });
    describe('Token File Generator Build Integration', () => {
        let generator;
        beforeEach(() => {
            generator = new TokenFileGenerator_1.TokenFileGenerator();
        });
        it('should generate build-compatible files for all platforms', () => {
            const results = generator.generateAll();
            expect(results).toHaveLength(3);
            results.forEach(result => {
                expect(result.valid).toBe(true);
                expect(result.content).toBeDefined();
            });
        });
        it('should generate files with consistent token counts', () => {
            const results = generator.generateAll();
            const validation = generator.validateCrossPlatformConsistency(results);
            expect(validation.consistent).toBe(true);
            expect(validation.issues).toHaveLength(0);
        });
        it('should generate files in correct output directories', () => {
            const results = generator.generateAll({ outputDir: 'dist' });
            expect(results[0].filePath).toContain('dist/');
            expect(results[1].filePath).toContain('dist/');
            expect(results[2].filePath).toContain('dist/');
        });
        it('should generate syntactically valid files for each platform', () => {
            const results = generator.generateAll();
            results.forEach(result => {
                expect(result.valid).toBe(true);
                expect(result.errors).toBeUndefined();
            });
        });
    });
    describe('Import Pattern Validation', () => {
        it('should provide valid web import patterns', () => {
            const organizer = new WebFileOrganizer_1.WebFileOrganizer();
            const config = organizer.getBuildSystemIntegration();
            config.importPatterns.forEach(pattern => {
                expect(pattern).toContain('import');
                expect(pattern).toContain('DesignTokens.web');
            });
        });
        it('should provide valid iOS import patterns', () => {
            const organizer = new iOSFileOrganizer_1.iOSFileOrganizer();
            const config = organizer.getBuildSystemIntegration();
            config.importPatterns.forEach(pattern => {
                expect(pattern).toMatch(/import|\/\//); // import statement or comment
            });
        });
        it('should provide valid Android import patterns', () => {
            const organizer = new AndroidFileOrganizer_1.AndroidFileOrganizer();
            const config = organizer.getBuildSystemIntegration();
            config.importPatterns.forEach(pattern => {
                expect(pattern).toMatch(/import|\/\//); // import statement or comment
            });
        });
    });
    describe('Tree-Shaking Optimization', () => {
        it('should provide web tree-shaking guidance', () => {
            const organizer = new WebFileOrganizer_1.WebFileOrganizer();
            const config = organizer.getBuildSystemIntegration();
            expect(config.treeShakingHints).toContain('CSS custom properties are automatically available globally');
            expect(config.additionalConfig?.sideEffects).toBe(false);
        });
        it('should provide iOS optimization guidance', () => {
            const organizer = new iOSFileOrganizer_1.iOSFileOrganizer();
            const config = organizer.getBuildSystemIntegration();
            expect(config.treeShakingHints).toContain('Swift compiler automatically optimizes unused constants');
        });
        it('should provide Android optimization guidance', () => {
            const organizer = new AndroidFileOrganizer_1.AndroidFileOrganizer();
            const config = organizer.getBuildSystemIntegration();
            expect(config.treeShakingHints).toContain('R8/ProGuard automatically removes unused constants');
        });
    });
    describe('File Organization Compatibility', () => {
        it('should organize web files for webpack/vite compatibility', () => {
            const organizer = new WebFileOrganizer_1.WebFileOrganizer();
            const path = organizer.getFilePath('css');
            expect(path).toBe('src/tokens/DesignTokens.web.css');
            expect(path).not.toContain('..'); // No parent references
            expect(path.startsWith('/')).toBe(false); // Relative path
        });
        it('should organize iOS files for Xcode compatibility', () => {
            const organizer = new iOSFileOrganizer_1.iOSFileOrganizer();
            const path = organizer.getFilePath('swift');
            expect(path).toBe('Sources/DesignSystem/Tokens/DesignTokens.swift');
            expect(path).not.toContain('..'); // No parent references
            expect(path.startsWith('/')).toBe(false); // Relative path
        });
        it('should organize Android files for Gradle compatibility', () => {
            const organizer = new AndroidFileOrganizer_1.AndroidFileOrganizer();
            const kotlinPath = organizer.getFilePath('kotlin');
            const xmlPath = organizer.getFilePath('xml');
            expect(kotlinPath).toContain('kotlin/com/designsystem/tokens');
            expect(xmlPath).toContain('res/values');
            expect(kotlinPath).not.toContain('..'); // No parent references
            expect(xmlPath).not.toContain('..'); // No parent references
        });
    });
    describe('Build System Validation', () => {
        it('should validate web build system requirements', () => {
            const organizer = new WebFileOrganizer_1.WebFileOrganizer();
            const config = organizer.getBuildSystemIntegration();
            expect(config.buildSystemType).toBe('webpack/vite');
            expect(config.additionalConfig?.moduleType).toBe('esm');
            expect(config.additionalConfig?.sideEffects).toBe(false);
        });
        it('should validate iOS build system requirements', () => {
            const organizer = new iOSFileOrganizer_1.iOSFileOrganizer();
            const config = organizer.getBuildSystemIntegration();
            expect(config.buildSystemType).toBe('xcode/swift-package-manager');
            expect(config.additionalConfig?.swiftVersion).toBeDefined();
            expect(config.additionalConfig?.platforms).toBeDefined();
        });
        it('should validate Android build system requirements', () => {
            const organizer = new AndroidFileOrganizer_1.AndroidFileOrganizer();
            const config = organizer.getBuildSystemIntegration();
            expect(config.buildSystemType).toBe('gradle/android');
            expect(config.additionalConfig?.minSdkVersion).toBeDefined();
            expect(config.additionalConfig?.targetSdkVersion).toBeDefined();
        });
    });
});
//# sourceMappingURL=BuildSystemIntegration.test.js.map