"use strict";
/**
 * Path Provider Tests
 *
 * Tests platform-specific file organization, path generation, and build system integration
 * for Web, iOS, and Android path providers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const WebFileOrganizer_1 = require("../WebFileOrganizer");
const iOSFileOrganizer_1 = require("../iOSFileOrganizer");
const AndroidFileOrganizer_1 = require("../AndroidFileOrganizer");
describe('WebFileOrganizer', () => {
    let organizer;
    beforeEach(() => {
        organizer = new WebFileOrganizer_1.WebFileOrganizer();
    });
    describe('Platform Configuration', () => {
        it('should identify as web platform', () => {
            expect(organizer.platform).toBe('web');
        });
        it('should use correct base directory', () => {
            expect(organizer.getBaseDirectory()).toBe('src/tokens');
        });
    });
    describe('File Naming', () => {
        it('should generate correct CSS file name', () => {
            expect(organizer.getFileName('css')).toBe('DesignTokens.web.css');
        });
    });
    describe('File Path Generation', () => {
        it('should generate correct CSS file path', () => {
            const path = organizer.getFilePath('css');
            expect(path).toBe('src/tokens/DesignTokens.web.css');
        });
        it('should support custom base directory', () => {
            const path = organizer.getFilePath('css', {
                customBaseDirectory: 'custom/path'
            });
            expect(path).toBe('custom/path/DesignTokens.web.css');
        });
        it('should use flat directory structure', () => {
            const structure = organizer.getDirectoryStructure();
            expect(structure).toEqual([]);
        });
    });
    describe('Build System Integration', () => {
        it('should provide webpack/vite build configuration', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.buildSystemType).toBe('webpack/vite');
            expect(config.importPatterns).toContain("import '@/tokens/DesignTokens.web.css'");
            expect(config.watchPatterns).toContain('src/tokens/**/*.css');
        });
    });
    describe('Build System Optimization', () => {
        it('should optimize file structure for CSS', () => {
            const files = ['src/tokens/DesignTokens.web.css'];
            const optimized = organizer.optimizeForBuildSystem(files);
            expect(optimized.primaryFile).toBe('src/tokens/DesignTokens.web.css');
            expect(optimized.supportingFiles).toEqual(['src/tokens/DesignTokens.web.css']);
            expect(optimized.importPath).toBe('@/tokens/DesignTokens.web');
        });
    });
    describe('Naming Conventions', () => {
        it('should convert token names to CSS custom properties', () => {
            expect(organizer.getCSSCustomPropertyName('space100')).toBe('--space100');
            expect(organizer.getCSSCustomPropertyName('fontSize125')).toBe('--font-size125');
            expect(organizer.getCSSCustomPropertyName('colorPrimary')).toBe('--color-primary');
        });
    });
    describe('Path Validation', () => {
        it('should validate correct web token file paths', () => {
            const result = organizer.validatePath('src/tokens/DesignTokens.web.css');
            expect(result.valid).toBe(true);
            expect(result.errors).toBeUndefined();
        });
        it('should reject paths without src/tokens directory', () => {
            const result = organizer.validatePath('other/path/DesignTokens.web.css');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Web token files should be in src/tokens directory');
        });
        it('should reject paths with wrong file extension', () => {
            const result = organizer.validatePath('src/tokens/DesignTokens.web.txt');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Web token files should have .css extension');
        });
        it('should reject paths with parent directory references', () => {
            const result = organizer.validatePath('../src/tokens/DesignTokens.web.css');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('File path cannot contain parent directory references (..)');
        });
    });
});
describe('iOSFileOrganizer', () => {
    let organizer;
    beforeEach(() => {
        organizer = new iOSFileOrganizer_1.iOSFileOrganizer();
    });
    describe('Platform Configuration', () => {
        it('should identify as iOS platform', () => {
            expect(organizer.platform).toBe('ios');
        });
        it('should use correct base directory', () => {
            expect(organizer.getBaseDirectory()).toBe('Sources/DesignSystem/Tokens');
        });
    });
    describe('File Naming', () => {
        it('should generate correct Swift file name', () => {
            expect(organizer.getFileName('swift')).toBe('DesignTokens.swift');
        });
        it('should throw error for unsupported format', () => {
            expect(() => organizer.getFileName('javascript')).toThrow('Unsupported format for iOS platform: javascript');
        });
    });
    describe('File Path Generation', () => {
        it('should generate correct Swift file path', () => {
            const path = organizer.getFilePath('swift');
            expect(path).toBe('Sources/DesignSystem/Tokens/DesignTokens.swift');
        });
        it('should support custom base directory', () => {
            const path = organizer.getFilePath('swift', {
                customBaseDirectory: 'CustomSources/Tokens'
            });
            expect(path).toBe('CustomSources/Tokens/DesignTokens.swift');
        });
        it('should use flat directory structure', () => {
            const structure = organizer.getDirectoryStructure();
            expect(structure).toEqual([]);
        });
    });
    describe('Build System Integration', () => {
        it('should provide Xcode/SPM build configuration', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.buildSystemType).toBe('xcode/swift-package-manager');
            expect(config.importPatterns).toContain('import DesignSystem');
            expect(config.watchPatterns).toContain('Sources/DesignSystem/Tokens/**/*.swift');
            expect(config.treeShakingHints).toContain('Swift compiler automatically optimizes unused constants');
        });
        it('should include Swift module configuration', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.additionalConfig?.moduleType).toBe('swift-module');
            expect(config.additionalConfig?.accessControl).toBe('public');
            expect(config.additionalConfig?.swiftVersion).toBe('5.9');
        });
        it('should include Xcode integration details', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.additionalConfig?.xcodeIntegration?.targetMembership).toBe('DesignSystem');
            expect(config.additionalConfig?.xcodeIntegration?.buildPhase).toBe('Compile Sources');
        });
    });
    describe('Build System Optimization', () => {
        it('should optimize for Swift compilation', () => {
            const files = ['Sources/DesignSystem/Tokens/DesignTokens.swift'];
            const optimized = organizer.optimizeForBuildSystem(files);
            expect(optimized.primaryFile).toBe('Sources/DesignSystem/Tokens/DesignTokens.swift');
            expect(optimized.importPath).toBe('DesignSystem');
            expect(optimized.optimizations).toContain('Swift struct with static constants for compile-time optimization');
            expect(optimized.optimizations).toContain('UIColor.dynamicColor for automatic light/dark mode support');
        });
    });
    describe('Naming Conventions', () => {
        it('should keep Swift constant names in camelCase', () => {
            expect(organizer.getSwiftConstantName('space100')).toBe('space100');
            expect(organizer.getSwiftConstantName('fontSize125')).toBe('fontSize125');
        });
        it('should provide Swift struct organization pattern', () => {
            const pattern = organizer.getSwiftStructOrganization();
            expect(pattern).toContain('public struct DesignTokens');
            expect(pattern).toContain('public static let space100: CGFloat');
            expect(pattern).toContain('UIColor.dynamicColor');
        });
    });
    describe('Path Validation', () => {
        it('should validate correct iOS token file paths', () => {
            const result = organizer.validatePath('Sources/DesignSystem/Tokens/DesignTokens.swift');
            expect(result.valid).toBe(true);
            expect(result.errors).toBeUndefined();
        });
        it('should reject paths without Sources/DesignSystem directory', () => {
            const result = organizer.validatePath('Other/Path/DesignTokens.swift');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('iOS token files should be in Sources/DesignSystem directory');
        });
        it('should reject paths with wrong file extension', () => {
            const result = organizer.validatePath('Sources/DesignSystem/Tokens/DesignTokens.kt');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('iOS token files should have .swift extension');
        });
    });
    describe('Xcode Integration', () => {
        it('should provide Xcode project integration details', () => {
            const integration = organizer.getXcodeIntegration();
            expect(integration.targetMembership).toBe('DesignSystem');
            expect(integration.buildPhase).toBe('Compile Sources');
            expect(integration.fileType).toBe('sourcecode.swift');
            expect(integration.group).toBe('DesignSystem/Tokens');
        });
    });
});
describe('AndroidFileOrganizer', () => {
    let organizer;
    beforeEach(() => {
        organizer = new AndroidFileOrganizer_1.AndroidFileOrganizer();
    });
    describe('Platform Configuration', () => {
        it('should identify as Android platform', () => {
            expect(organizer.platform).toBe('android');
        });
        it('should use correct base directory', () => {
            expect(organizer.getBaseDirectory()).toBe('designsystem/src/main');
        });
    });
    describe('File Naming', () => {
        it('should generate correct Kotlin file name', () => {
            expect(organizer.getFileName('kotlin')).toBe('DesignTokens.kt');
        });
        it('should generate correct XML file name', () => {
            expect(organizer.getFileName('xml')).toBe('design_tokens.xml');
        });
        it('should throw error for unsupported format', () => {
            expect(() => organizer.getFileName('swift')).toThrow('Unsupported format for Android platform: swift');
        });
    });
    describe('File Path Generation', () => {
        it('should generate correct Kotlin file path', () => {
            const path = organizer.getFilePath('kotlin');
            expect(path).toBe('designsystem/src/main/kotlin/com/designsystem/tokens/DesignTokens.kt');
        });
        it('should generate correct XML file path', () => {
            const path = organizer.getFilePath('xml');
            expect(path).toBe('designsystem/src/main/res/values/design_tokens.xml');
        });
        it('should support custom base directory for Kotlin', () => {
            const path = organizer.getFilePath('kotlin', {
                customBaseDirectory: 'custom/src/main'
            });
            expect(path).toBe('custom/src/main/kotlin/com/designsystem/tokens/DesignTokens.kt');
        });
        it('should support custom base directory for XML', () => {
            const path = organizer.getFilePath('xml', {
                customBaseDirectory: 'custom/src/main'
            });
            expect(path).toBe('custom/src/main/res/values/design_tokens.xml');
        });
    });
    describe('Build System Integration', () => {
        it('should provide Gradle/Android build configuration', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.buildSystemType).toBe('gradle/android');
            expect(config.importPatterns).toContain('import com.designsystem.tokens.DesignTokens');
            expect(config.watchPatterns).toContain('designsystem/src/main/kotlin/**/*.kt');
            expect(config.treeShakingHints).toContain('R8/ProGuard automatically removes unused constants');
        });
        it('should include Android module configuration', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.additionalConfig?.moduleType).toBe('android-library');
            expect(config.additionalConfig?.minSdkVersion).toBe(24);
            expect(config.additionalConfig?.targetSdkVersion).toBe(34);
        });
        it('should include resource qualifiers for mode-aware support', () => {
            const config = organizer.getBuildSystemIntegration();
            expect(config.additionalConfig?.resourceQualifiers?.night).toBe('values-night');
            expect(config.additionalConfig?.resourceQualifiers?.xhdpi).toBe('values-xhdpi');
        });
    });
    describe('Build System Optimization', () => {
        it('should optimize for Kotlin and XML resources', () => {
            const files = [
                'designsystem/src/main/kotlin/com/designsystem/tokens/DesignTokens.kt',
                'designsystem/src/main/res/values/design_tokens.xml'
            ];
            const optimized = organizer.optimizeForBuildSystem(files);
            expect(optimized.primaryFile).toBe('designsystem/src/main/kotlin/com/designsystem/tokens/DesignTokens.kt');
            expect(optimized.supportingFiles).toContain('designsystem/src/main/res/values/design_tokens.xml');
            expect(optimized.importPath).toBe('com.designsystem.tokens.DesignTokens');
            expect(optimized.optimizations).toContain('Kotlin object with const val for compile-time optimization');
            expect(optimized.optimizations).toContain('Resource qualifiers enable automatic mode-aware color resolution');
        });
    });
    describe('Naming Conventions', () => {
        it('should keep Kotlin constant names in camelCase', () => {
            expect(organizer.getKotlinConstantName('space100')).toBe('space100');
            expect(organizer.getKotlinConstantName('fontSize125')).toBe('fontSize125');
        });
        it('should convert token names to snake_case for XML resources', () => {
            expect(organizer.getXMLResourceName('space100')).toBe('space100');
            expect(organizer.getXMLResourceName('fontSize125')).toBe('font_size125');
            expect(organizer.getXMLResourceName('colorPrimary')).toBe('color_primary');
        });
        it('should provide Kotlin object organization pattern', () => {
            const pattern = organizer.getKotlinObjectOrganization();
            expect(pattern).toContain('object DesignTokens');
            expect(pattern).toContain('val space100 = 8.dp');
            expect(pattern).toContain('val fontSize100 = 16.sp');
        });
        it('should provide XML resource organization pattern', () => {
            const pattern = organizer.getXMLResourceOrganization();
            expect(pattern).toContain('<dimen name="space_100">8dp</dimen>');
            expect(pattern).toContain('<dimen name="font_size_100">16sp</dimen>');
            expect(pattern).toContain('values-night');
        });
    });
    describe('Path Validation', () => {
        it('should validate correct Kotlin token file paths', () => {
            const result = organizer.validatePath('designsystem/src/main/kotlin/com/designsystem/tokens/DesignTokens.kt');
            expect(result.valid).toBe(true);
            expect(result.errors).toBeUndefined();
        });
        it('should validate correct XML token file paths', () => {
            const result = organizer.validatePath('designsystem/src/main/res/values/design_tokens.xml');
            expect(result.valid).toBe(true);
            expect(result.errors).toBeUndefined();
        });
        it('should reject paths without designsystem/src/main directory', () => {
            const result = organizer.validatePath('other/path/DesignTokens.kt');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Android token files should be in designsystem/src/main directory');
        });
        it('should reject Kotlin paths without correct package structure', () => {
            const result = organizer.validatePath('designsystem/src/main/DesignTokens.kt');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Kotlin token files should be in kotlin/com/designsystem/tokens package');
        });
        it('should reject XML paths without res/values directory', () => {
            const result = organizer.validatePath('designsystem/src/main/design_tokens.xml');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('XML token files should be in res/values directory');
        });
    });
    describe('Resource Qualifiers', () => {
        it('should provide resource qualifier paths for mode-aware resources', () => {
            const qualifiers = organizer.getResourceQualifierPaths();
            expect(qualifiers.light).toBe('designsystem/src/main/res/values/design_tokens.xml');
            expect(qualifiers.dark).toBe('designsystem/src/main/res/values-night/design_tokens.xml');
            expect(qualifiers.densities.xhdpi).toBe('designsystem/src/main/res/values-xhdpi/design_tokens.xml');
        });
        it('should provide all density bucket paths', () => {
            const qualifiers = organizer.getResourceQualifierPaths();
            expect(qualifiers.densities).toHaveProperty('ldpi');
            expect(qualifiers.densities).toHaveProperty('mdpi');
            expect(qualifiers.densities).toHaveProperty('hdpi');
            expect(qualifiers.densities).toHaveProperty('xhdpi');
            expect(qualifiers.densities).toHaveProperty('xxhdpi');
            expect(qualifiers.densities).toHaveProperty('xxxhdpi');
        });
    });
});
describe('Cross-Platform Path Consistency', () => {
    let webOrganizer;
    let iosOrganizer;
    let androidOrganizer;
    beforeEach(() => {
        webOrganizer = new WebFileOrganizer_1.WebFileOrganizer();
        iosOrganizer = new iOSFileOrganizer_1.iOSFileOrganizer();
        androidOrganizer = new AndroidFileOrganizer_1.AndroidFileOrganizer();
    });
    it('should have consistent platform identifiers', () => {
        expect(webOrganizer.platform).toBe('web');
        expect(iosOrganizer.platform).toBe('ios');
        expect(androidOrganizer.platform).toBe('android');
    });
    it('should all provide build system integration', () => {
        const webConfig = webOrganizer.getBuildSystemIntegration();
        const iosConfig = iosOrganizer.getBuildSystemIntegration();
        const androidConfig = androidOrganizer.getBuildSystemIntegration();
        expect(webConfig.buildSystemType).toBeDefined();
        expect(iosConfig.buildSystemType).toBeDefined();
        expect(androidConfig.buildSystemType).toBeDefined();
        expect(webConfig.importPatterns.length).toBeGreaterThan(0);
        expect(iosConfig.importPatterns.length).toBeGreaterThan(0);
        expect(androidConfig.importPatterns.length).toBeGreaterThan(0);
    });
    it('should all provide optimization recommendations', () => {
        const files = ['test.js'];
        const webOptimized = webOrganizer.optimizeForBuildSystem(files);
        const iosOptimized = iosOrganizer.optimizeForBuildSystem(files);
        const androidOptimized = androidOrganizer.optimizeForBuildSystem(files);
        expect(webOptimized.optimizations.length).toBeGreaterThan(0);
        expect(iosOptimized.optimizations.length).toBeGreaterThan(0);
        expect(androidOptimized.optimizations.length).toBeGreaterThan(0);
    });
    it('should all validate paths consistently', () => {
        // Test empty path validation
        expect(webOrganizer.validatePath('').valid).toBe(false);
        expect(iosOrganizer.validatePath('').valid).toBe(false);
        expect(androidOrganizer.validatePath('').valid).toBe(false);
        // Test parent directory reference validation
        expect(webOrganizer.validatePath('../test').valid).toBe(false);
        expect(iosOrganizer.validatePath('../test').valid).toBe(false);
        expect(androidOrganizer.validatePath('../test').valid).toBe(false);
    });
});
//# sourceMappingURL=PathProviders.test.js.map