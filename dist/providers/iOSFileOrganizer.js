"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iOSFileOrganizer = void 0;
const PathProvider_1 = require("./PathProvider");
/**
 * iOS file organization implementation
 * Organizes tokens for Swift project structure with Xcode integration
 */
class iOSFileOrganizer extends PathProvider_1.BasePathProvider {
    constructor() {
        super(...arguments);
        this.platform = 'ios';
    }
    getBaseDirectory() {
        return 'Sources/DesignSystem/Tokens';
    }
    getFileName(format) {
        switch (format) {
            case 'swift':
                return 'DesignTokens.swift';
            default:
                throw new Error(`Unsupported format for iOS platform: ${format}`);
        }
    }
    getDirectoryStructure() {
        // iOS uses a flat structure within the Tokens directory
        // Xcode project organization handles grouping
        return [];
    }
    getBuildSystemIntegration() {
        return {
            buildSystemType: 'xcode/swift-package-manager',
            importPatterns: [
                'import DesignSystem',
                '// Access tokens via DesignTokens.space100',
                '// Access tokens via DesignTokens.fontSize100'
            ],
            watchPatterns: [
                'Sources/DesignSystem/Tokens/**/*.swift'
            ],
            treeShakingHints: [
                'Swift compiler automatically optimizes unused constants',
                'Use public access control for tokens that need to be exposed',
                'Internal access control for tokens used only within DesignSystem module',
                'Static constants enable compile-time optimization'
            ],
            additionalConfig: {
                moduleType: 'swift-module',
                accessControl: 'public',
                swiftVersion: '5.9',
                platforms: ['iOS 15.0', 'macOS 12.0'],
                xcodeIntegration: {
                    targetMembership: 'DesignSystem',
                    buildPhase: 'Compile Sources',
                    fileType: 'sourcecode.swift'
                }
            }
        };
    }
    optimizeForBuildSystem(files) {
        const swiftFile = files.find(f => f.endsWith('.swift'));
        return {
            primaryFile: swiftFile || files[0],
            supportingFiles: [],
            importPath: 'DesignSystem',
            optimizations: [
                'Swift struct with static constants for compile-time optimization',
                'UIColor.dynamicColor for automatic light/dark mode support',
                'CGFloat values for precise layout calculations',
                'Public access control enables cross-module usage',
                'Organized by token category for code navigation',
                'Trait collection detection for native mode switching'
            ]
        };
    }
    /**
     * Get Swift constant naming convention
     * @param tokenName - Original token name
     * @returns Swift constant name
     */
    getSwiftConstantName(tokenName) {
        // Keep camelCase for Swift constants
        // space100 -> space100
        // fontSize125 -> fontSize125
        return tokenName;
    }
    /**
     * Get Swift struct organization
     * @returns Struct organization pattern
     */
    getSwiftStructOrganization() {
        return `
public struct DesignTokens {
    // Spacing tokens
    public static let space100: CGFloat = 8.0
    
    // Typography tokens
    public static let fontSize100: CGFloat = 16.0
    
    // Color tokens (mode-aware)
    public static let colorPrimary: UIColor = UIColor.dynamicColor(
        light: UIColor(hex: "#..."),
        dark: UIColor(hex: "#...")
    )
}
    `.trim();
    }
    /**
     * Validate iOS-specific file path conventions
     */
    validatePath(filePath) {
        const baseValidation = super.validatePath(filePath);
        if (!baseValidation.valid) {
            return baseValidation;
        }
        const errors = [];
        // iOS-specific validations
        if (!filePath.includes('Sources/DesignSystem')) {
            errors.push('iOS token files should be in Sources/DesignSystem directory');
        }
        if (!filePath.endsWith('.swift')) {
            errors.push('iOS token files should have .swift extension');
        }
        if (filePath.includes('DesignTokens.swift')) {
            // Valid iOS token file
        }
        else {
            errors.push('iOS token files should follow DesignTokens.swift naming pattern');
        }
        return {
            valid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined
        };
    }
    /**
     * Get Xcode project integration details
     */
    getXcodeIntegration() {
        return {
            targetMembership: 'DesignSystem',
            buildPhase: 'Compile Sources',
            fileType: 'sourcecode.swift',
            group: 'DesignSystem/Tokens'
        };
    }
}
exports.iOSFileOrganizer = iOSFileOrganizer;
//# sourceMappingURL=iOSFileOrganizer.js.map