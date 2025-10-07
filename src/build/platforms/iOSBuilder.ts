/**
 * iOS Platform Builder
 * 
 * Generates Swift Package with SwiftUI components from component definitions.
 * Converts F1 tokens to Swift constants with proper pt units.
 * 
 * Requirements: 1.3, 2.1
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { PlatformBuilder, ComponentDefinition } from './PlatformBuilder';
import { BuildConfig, iOSBuildOptions } from '../types/BuildConfig';
import { BuildResult, BuildError } from '../types/BuildResult';
import { Platform } from '../types/Platform';
import { PlatformTokens } from '../tokens/PlatformTokens';

/**
 * Swift Package structure
 */
export interface SwiftPackage {
  /** Package.swift manifest content */
  packageManifest: string;
  
  /** Swift source files */
  sourceFiles: SwiftFile[];
  
  /** Package resources */
  resources: Resource[];
  
  /** Package dependencies */
  dependencies: Dependency[];
}

/**
 * Swift source file
 */
export interface SwiftFile {
  /** File path relative to package root */
  path: string;
  
  /** File content */
  content: string;
}

/**
 * Package resource
 */
export interface Resource {
  /** Resource path */
  path: string;
  
  /** Resource type */
  type: 'asset' | 'data' | 'other';
}

/**
 * Package dependency
 */
export interface Dependency {
  /** Dependency name */
  name: string;
  
  /** Dependency URL */
  url: string;
  
  /** Version requirement */
  version: string;
}

/**
 * iOS build configuration
 */
export interface iOSBuildConfig {
  /** Swift version */
  swiftVersion: string;
  
  /** Minimum deployment target */
  minimumDeploymentTarget: string;
  
  /** Package dependencies */
  dependencies: Dependency[];
  
  /** Package name */
  packageName: string;
  
  /** Product name */
  productName: string;
}

/**
 * iOS Platform Builder Implementation
 * 
 * Builds Swift Package with SwiftUI components and token constants
 */
export class iOSBuilder implements PlatformBuilder {
  readonly platform: Platform = 'ios';
  
  private buildConfig: iOSBuildConfig;
  
  constructor(buildOptions?: iOSBuildOptions) {
    // Set default iOS build configuration
    this.buildConfig = {
      swiftVersion: buildOptions?.swiftVersion || '5.9',
      minimumDeploymentTarget: buildOptions?.minimumDeploymentTarget || '15.0',
      dependencies: buildOptions?.dependencies?.map(dep => ({
        name: dep,
        url: '',
        version: '1.0.0'
      })) || [],
      packageName: 'DesignerPunk',
      productName: 'DesignerPunk'
    };
  }
  
  /**
   * Build Swift Package from component definitions
   */
  async build(
    components: ComponentDefinition[],
    tokens: PlatformTokens,
    config: BuildConfig
  ): Promise<BuildResult> {
    const startTime = Date.now();
    const warnings: string[] = [];
    const errors: BuildError[] = [];
    
    try {
      // Create output directory
      const outputDir = path.join(config.outputDir, 'ios');
      await fs.mkdir(outputDir, { recursive: true });
      
      // Generate Swift Package structure
      const swiftPackage = await this.generateSwiftPackage(components, tokens, config);
      
      // Write Package.swift manifest
      const manifestPath = path.join(outputDir, 'Package.swift');
      await fs.writeFile(manifestPath, swiftPackage.packageManifest, 'utf-8');
      
      // Create Sources directory structure
      const sourcesDir = path.join(outputDir, 'Sources', this.buildConfig.productName);
      await fs.mkdir(sourcesDir, { recursive: true });
      
      // Create subdirectories for organized source files
      await fs.mkdir(path.join(sourcesDir, 'Tokens'), { recursive: true });
      await fs.mkdir(path.join(sourcesDir, 'Components'), { recursive: true });
      await fs.mkdir(path.join(sourcesDir, 'Extensions'), { recursive: true });
      
      // Write source files
      for (const sourceFile of swiftPackage.sourceFiles) {
        const filePath = path.join(sourcesDir, sourceFile.path);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, sourceFile.content, 'utf-8');
      }
      
      // Create Tests directory structure
      const testsDir = path.join(outputDir, 'Tests', `${this.buildConfig.productName}Tests`);
      await fs.mkdir(testsDir, { recursive: true });
      
      // Generate basic test file
      const testFileContent = this.generateTestFile();
      await fs.writeFile(path.join(testsDir, `${this.buildConfig.productName}Tests.swift`), testFileContent, 'utf-8');
      
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
    } catch (error) {
      const duration = Date.now() - startTime;
      
      errors.push({
        code: 'IOS_BUILD_FAILED',
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
   * Generate Swift Package structure with proper organization
   * 
   * Creates a complete Swift Package with:
   * - Token constants organized by category
   * - SwiftUI component implementations
   * - Proper file organization (Tokens/, Components/, Extensions/)
   * - Package manifest with dependencies
   * 
   * Requirements: 2.1, 2.5
   */
  private async generateSwiftPackage(
    components: ComponentDefinition[],
    tokens: PlatformTokens,
    config: BuildConfig
  ): Promise<SwiftPackage> {
    const sourceFiles: SwiftFile[] = [];
    
    // Generate main token constants file
    const tokensContent = this.generateTokens(tokens);
    sourceFiles.push({
      path: 'Tokens/Tokens.swift',
      content: tokensContent
    });
    
    // Generate token category files for better organization
    sourceFiles.push({
      path: 'Tokens/SpacingTokens.swift',
      content: this.generateSpacingTokensFile(tokens)
    });
    
    sourceFiles.push({
      path: 'Tokens/ColorTokens.swift',
      content: this.generateColorTokensFile(tokens)
    });
    
    sourceFiles.push({
      path: 'Tokens/TypographyTokens.swift',
      content: this.generateTypographyTokensFile(tokens)
    });
    
    // Generate SwiftUI component files
    for (const component of components) {
      const componentContent = this.generateSwiftUIComponent(component, tokens);
      sourceFiles.push({
        path: `Components/${component.name}.swift`,
        content: componentContent
      });
    }
    
    // Generate utility extensions
    sourceFiles.push({
      path: 'Extensions/ColorExtensions.swift',
      content: this.generateColorExtensions()
    });
    
    sourceFiles.push({
      path: 'Extensions/ViewExtensions.swift',
      content: this.generateViewExtensions()
    });
    
    // Generate main module file
    sourceFiles.push({
      path: `${this.buildConfig.productName}.swift`,
      content: this.generateModuleFile()
    });
    
    // Generate Package.swift manifest
    const packageManifest = this.generatePackageManifest(config);
    
    return {
      packageManifest,
      sourceFiles,
      resources: [],
      dependencies: this.buildConfig.dependencies
    };
  }
  
  /**
   * Generate Package.swift manifest with proper dependencies
   * 
   * Creates a complete Swift Package manifest with:
   * - Swift version and deployment targets
   * - Package dependencies (if any)
   * - Library products
   * - Source targets with proper organization
   * - Test targets
   * 
   * Requirements: 2.1, 2.5
   */
  private generatePackageManifest(config: BuildConfig): string {
    const { packageName, productName, swiftVersion, minimumDeploymentTarget, dependencies } = this.buildConfig;
    
    // Format deployment target for Swift Package Manager
    // Convert "15.0" to "v15" for platform specification
    const deploymentVersion = minimumDeploymentTarget.split('.')[0];
    
    // Generate dependencies section
    const dependenciesStr = dependencies.length > 0
      ? dependencies.map(dep => `        .package(url: "${dep.url}", from: "${dep.version}")`).join(',\n')
      : '';
    
    const dependenciesSection = dependencies.length > 0
      ? `    dependencies: [\n${dependenciesStr}\n    ],`
      : '';
    
    // Generate target dependencies
    const targetDependencies = dependencies.length > 0
      ? dependencies.map(dep => `"${dep.name}"`).join(', ')
      : '';
    
    const targetDependenciesSection = targetDependencies
      ? `dependencies: [${targetDependencies}]`
      : 'dependencies: []';
    
    return `// swift-tools-version: ${swiftVersion}
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "${packageName}",
    platforms: [
        .iOS(.v${deploymentVersion})
    ],
${dependenciesSection}
    products: [
        // Library product for importing the design system
        .library(
            name: "${productName}",
            targets: ["${productName}"]
        )
    ],
    targets: [
        // Main target containing design system components and tokens
        .target(
            name: "${productName}",
            ${targetDependenciesSection},
            path: "Sources/${productName}",
            swiftSettings: [
                .enableUpcomingFeature("BareSlashRegexLiterals")
            ]
        ),
        // Test target for design system validation
        .testTarget(
            name: "${productName}Tests",
            dependencies: ["${productName}"],
            path: "Tests/${productName}Tests"
        )
    ]
)
`;
  }
  
  /**
   * Generate Swift token constants from platform tokens
   * 
   * Generates Swift constants from:
   * - Primitive tokens (space100, color.blue.500, etc.)
   * - Semantic tokens (space.normal, color.primary, etc.)
   * - Component tokens (if needed)
   * 
   * Requirements: 3.4, 3.7
   */
  generateTokens(tokens: PlatformTokens): string {
    const lines: string[] = [];
    
    // File header
    lines.push('//');
    lines.push('// Tokens.swift');
    lines.push('// DesignerPunk Design System');
    lines.push('//');
    lines.push('// Auto-generated token constants for iOS');
    lines.push('// DO NOT EDIT - Generated from F1 Mathematical Token System');
    lines.push('//');
    lines.push('');
    lines.push('import Foundation');
    lines.push('import SwiftUI');
    lines.push('');
    lines.push('/// Design system tokens for iOS');
    lines.push('public enum Tokens {');
    lines.push('    ');
    
    // Generate primitive tokens
    this.generatePrimitiveTokens(lines, tokens.primitives);
    
    // Generate semantic tokens
    this.generateSemanticTokens(lines, tokens.semantics);
    
    // Generate component tokens (if any)
    this.generateComponentTokens(lines, tokens.components);
    
    lines.push('}');
    lines.push('');
    
    // Add Color extension for hex support
    this.generateColorExtension(lines);
    
    return lines.join('\n');
  }
  
  /**
   * Generate primitive token constants
   */
  private generatePrimitiveTokens(lines: string[], primitives: PlatformTokens['primitives']): void {
    lines.push('    // MARK: - Primitive Tokens');
    lines.push('    ');
    
    // Generate spacing tokens
    if (Object.keys(primitives.spacing).length > 0) {
      lines.push('    /// Primitive spacing tokens (pt units)');
      lines.push('    public enum Spacing {');
      
      for (const [name, value] of Object.entries(primitives.spacing)) {
        const swiftName = this.toSwiftConstantName(name);
        const comment = `        /// ${name}: ${value.value}${value.unit}`;
        lines.push(comment);
        lines.push(`        public static let ${swiftName}: CGFloat = ${value.value}`);
      }
      
      lines.push('    }');
      lines.push('    ');
    }
    
    // Generate color tokens
    if (Object.keys(primitives.colors).length > 0) {
      lines.push('    /// Primitive color tokens');
      lines.push('    public enum Colors {');
      
      for (const [name, value] of Object.entries(primitives.colors)) {
        const swiftName = this.toSwiftConstantName(name);
        const comment = `        /// ${name}: ${value.value}`;
        lines.push(comment);
        
        // Convert hex color to SwiftUI Color
        if (typeof value.value === 'string' && value.value.startsWith('#')) {
          lines.push(`        public static let ${swiftName} = Color(hex: "${value.value}")`);
        }
      }
      
      lines.push('    }');
      lines.push('    ');
    }
    
    // Generate typography tokens
    if (Object.keys(primitives.typography).length > 0) {
      lines.push('    /// Primitive typography tokens (pt units)');
      lines.push('    public enum Typography {');
      
      for (const [name, value] of Object.entries(primitives.typography)) {
        const swiftName = this.toSwiftConstantName(name);
        const comment = `        /// ${name}: ${value.value}${value.unit}`;
        lines.push(comment);
        lines.push(`        public static let ${swiftName}: CGFloat = ${value.value}`);
      }
      
      lines.push('    }');
      lines.push('    ');
    }
    
    // Generate radius tokens
    if (Object.keys(primitives.radius).length > 0) {
      lines.push('    /// Primitive radius tokens (pt units)');
      lines.push('    public enum Radius {');
      
      for (const [name, value] of Object.entries(primitives.radius)) {
        const swiftName = this.toSwiftConstantName(name);
        const comment = `        /// ${name}: ${value.value}${value.unit}`;
        lines.push(comment);
        lines.push(`        public static let ${swiftName}: CGFloat = ${value.value}`);
      }
      
      lines.push('    }');
      lines.push('    ');
    }
    
    // Generate sizing tokens
    if (Object.keys(primitives.sizing).length > 0) {
      lines.push('    /// Primitive sizing tokens (pt units)');
      lines.push('    public enum Sizing {');
      
      for (const [name, value] of Object.entries(primitives.sizing)) {
        const swiftName = this.toSwiftConstantName(name);
        const comment = `        /// ${name}: ${value.value}${value.unit}`;
        lines.push(comment);
        lines.push(`        public static let ${swiftName}: CGFloat = ${value.value}`);
      }
      
      lines.push('    }');
      lines.push('    ');
    }
  }
  
  /**
   * Generate semantic token constants
   */
  private generateSemanticTokens(lines: string[], semantics: PlatformTokens['semantics']): void {
    const hasSemanticTokens = Object.values(semantics).some(category => Object.keys(category).length > 0);
    
    if (!hasSemanticTokens) {
      return;
    }
    
    lines.push('    // MARK: - Semantic Tokens');
    lines.push('    ');
    
    // Generate semantic spacing tokens
    if (Object.keys(semantics.spacing).length > 0) {
      lines.push('    /// Semantic spacing tokens (pt units)');
      lines.push('    public enum SemanticSpacing {');
      
      for (const [name, value] of Object.entries(semantics.spacing)) {
        const swiftName = this.toSwiftConstantName(name);
        const comment = `        /// ${name}: ${value.value}${value.unit} (references: ${value.token})`;
        lines.push(comment);
        lines.push(`        public static let ${swiftName}: CGFloat = ${value.value}`);
      }
      
      lines.push('    }');
      lines.push('    ');
    }
    
    // Generate semantic color tokens
    if (Object.keys(semantics.colors).length > 0) {
      lines.push('    /// Semantic color tokens');
      lines.push('    public enum SemanticColors {');
      
      for (const [name, value] of Object.entries(semantics.colors)) {
        const swiftName = this.toSwiftConstantName(name);
        const comment = `        /// ${name}: ${value.value} (references: ${value.token})`;
        lines.push(comment);
        
        // Convert hex color to SwiftUI Color
        if (typeof value.value === 'string' && value.value.startsWith('#')) {
          lines.push(`        public static let ${swiftName} = Color(hex: "${value.value}")`);
        }
      }
      
      lines.push('    }');
      lines.push('    ');
    }
    
    // Generate semantic typography tokens
    if (Object.keys(semantics.typography).length > 0) {
      lines.push('    /// Semantic typography tokens (pt units)');
      lines.push('    public enum SemanticTypography {');
      
      for (const [name, value] of Object.entries(semantics.typography)) {
        const swiftName = this.toSwiftConstantName(name);
        const comment = `        /// ${name}: ${value.value}${value.unit} (references: ${value.token})`;
        lines.push(comment);
        lines.push(`        public static let ${swiftName}: CGFloat = ${value.value}`);
      }
      
      lines.push('    }');
      lines.push('    ');
    }
    
    // Generate semantic radius tokens
    if (Object.keys(semantics.radius).length > 0) {
      lines.push('    /// Semantic radius tokens (pt units)');
      lines.push('    public enum SemanticRadius {');
      
      for (const [name, value] of Object.entries(semantics.radius)) {
        const swiftName = this.toSwiftConstantName(name);
        const comment = `        /// ${name}: ${value.value}${value.unit} (references: ${value.token})`;
        lines.push(comment);
        lines.push(`        public static let ${swiftName}: CGFloat = ${value.value}`);
      }
      
      lines.push('    }');
      lines.push('    ');
    }
    
    // Generate semantic sizing tokens
    if (Object.keys(semantics.sizing).length > 0) {
      lines.push('    /// Semantic sizing tokens (pt units)');
      lines.push('    public enum SemanticSizing {');
      
      for (const [name, value] of Object.entries(semantics.sizing)) {
        const swiftName = this.toSwiftConstantName(name);
        const comment = `        /// ${name}: ${value.value}${value.unit} (references: ${value.token})`;
        lines.push(comment);
        lines.push(`        public static let ${swiftName}: CGFloat = ${value.value}`);
      }
      
      lines.push('    }');
      lines.push('    ');
    }
  }
  
  /**
   * Generate component token constants (if needed)
   */
  private generateComponentTokens(lines: string[], components: PlatformTokens['components']): void {
    const hasComponentTokens = Object.values(components).some(category => Object.keys(category).length > 0);
    
    if (!hasComponentTokens) {
      return;
    }
    
    lines.push('    // MARK: - Component Tokens');
    lines.push('    ');
    lines.push('    /// Component-specific tokens');
    lines.push('    /// Generated when semantic and primitive tokens are insufficient');
    lines.push('    ');
    
    // Generate component spacing tokens
    if (Object.keys(components.spacing).length > 0) {
      lines.push('    /// Component spacing tokens (pt units)');
      lines.push('    public enum ComponentSpacing {');
      
      for (const [name, value] of Object.entries(components.spacing)) {
        const swiftName = this.toSwiftConstantName(name);
        const comment = `        /// ${name}: ${value.value}${value.unit}`;
        lines.push(comment);
        lines.push(`        public static let ${swiftName}: CGFloat = ${value.value}`);
      }
      
      lines.push('    }');
      lines.push('    ');
    }
    
    // Generate component color tokens
    if (Object.keys(components.colors).length > 0) {
      lines.push('    /// Component color tokens');
      lines.push('    public enum ComponentColors {');
      
      for (const [name, value] of Object.entries(components.colors)) {
        const swiftName = this.toSwiftConstantName(name);
        const comment = `        /// ${name}: ${value.value}`;
        lines.push(comment);
        
        // Convert hex color to SwiftUI Color
        if (typeof value.value === 'string' && value.value.startsWith('#')) {
          lines.push(`        public static let ${swiftName} = Color(hex: "${value.value}")`);
        }
      }
      
      lines.push('    }');
      lines.push('    ');
    }
    
    // Generate component typography tokens
    if (Object.keys(components.typography).length > 0) {
      lines.push('    /// Component typography tokens (pt units)');
      lines.push('    public enum ComponentTypography {');
      
      for (const [name, value] of Object.entries(components.typography)) {
        const swiftName = this.toSwiftConstantName(name);
        const comment = `        /// ${name}: ${value.value}${value.unit}`;
        lines.push(comment);
        lines.push(`        public static let ${swiftName}: CGFloat = ${value.value}`);
      }
      
      lines.push('    }');
      lines.push('    ');
    }
    
    // Generate component radius tokens
    if (Object.keys(components.radius).length > 0) {
      lines.push('    /// Component radius tokens (pt units)');
      lines.push('    public enum ComponentRadius {');
      
      for (const [name, value] of Object.entries(components.radius)) {
        const swiftName = this.toSwiftConstantName(name);
        const comment = `        /// ${name}: ${value.value}${value.unit}`;
        lines.push(comment);
        lines.push(`        public static let ${swiftName}: CGFloat = ${value.value}`);
      }
      
      lines.push('    }');
      lines.push('    ');
    }
    
    // Generate component sizing tokens
    if (Object.keys(components.sizing).length > 0) {
      lines.push('    /// Component sizing tokens (pt units)');
      lines.push('    public enum ComponentSizing {');
      
      for (const [name, value] of Object.entries(components.sizing)) {
        const swiftName = this.toSwiftConstantName(name);
        const comment = `        /// ${name}: ${value.value}${value.unit}`;
        lines.push(comment);
        lines.push(`        public static let ${swiftName}: CGFloat = ${value.value}`);
      }
      
      lines.push('    }');
      lines.push('    ');
    }
  }
  
  /**
   * Generate Color extension for hex support
   */
  private generateColorExtension(lines: string[]): void {
    lines.push('// MARK: - Color Extension');
    lines.push('');
    lines.push('extension Color {');
    lines.push('    init(hex: String) {');
    lines.push('        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)');
    lines.push('        var int: UInt64 = 0');
    lines.push('        Scanner(string: hex).scanHexInt64(&int)');
    lines.push('        let a, r, g, b: UInt64');
    lines.push('        switch hex.count {');
    lines.push('        case 3: // RGB (12-bit)');
    lines.push('            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)');
    lines.push('        case 6: // RGB (24-bit)');
    lines.push('            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)');
    lines.push('        case 8: // ARGB (32-bit)');
    lines.push('            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)');
    lines.push('        default:');
    lines.push('            (a, r, g, b) = (255, 0, 0, 0)');
    lines.push('        }');
    lines.push('        self.init(');
    lines.push('            .sRGB,');
    lines.push('            red: Double(r) / 255,');
    lines.push('            green: Double(g) / 255,');
    lines.push('            blue: Double(b) / 255,');
    lines.push('            opacity: Double(a) / 255');
    lines.push('        )');
    lines.push('    }');
    lines.push('}');
    lines.push('');
  }
  
  /**
   * Generate spacing tokens file
   */
  private generateSpacingTokensFile(tokens: PlatformTokens): string {
    const lines: string[] = [];
    
    lines.push('//');
    lines.push('// SpacingTokens.swift');
    lines.push('// DesignerPunk Design System');
    lines.push('//');
    lines.push('// Spacing token constants for iOS');
    lines.push('//');
    lines.push('');
    lines.push('import Foundation');
    lines.push('import SwiftUI');
    lines.push('');
    lines.push('/// Spacing tokens organized by hierarchy');
    lines.push('public extension Tokens {');
    lines.push('    /// Spacing values in pt units');
    lines.push('    enum Space {');
    lines.push('        // Primitive spacing tokens');
    
    for (const [name, value] of Object.entries(tokens.primitives.spacing)) {
      lines.push(`        public static let ${this.toSwiftConstantName(name)}: CGFloat = ${value.value}`);
    }
    
    lines.push('    }');
    lines.push('}');
    lines.push('');
    
    return lines.join('\n');
  }
  
  /**
   * Generate color tokens file
   */
  private generateColorTokensFile(tokens: PlatformTokens): string {
    const lines: string[] = [];
    
    lines.push('//');
    lines.push('// ColorTokens.swift');
    lines.push('// DesignerPunk Design System');
    lines.push('//');
    lines.push('// Color token constants for iOS');
    lines.push('//');
    lines.push('');
    lines.push('import SwiftUI');
    lines.push('');
    lines.push('/// Color tokens organized by hierarchy');
    lines.push('public extension Tokens {');
    lines.push('    /// Color values');
    lines.push('    enum ColorPalette {');
    lines.push('        // Primitive color tokens');
    
    for (const [name, value] of Object.entries(tokens.primitives.colors)) {
      if (typeof value.value === 'string' && value.value.startsWith('#')) {
        lines.push(`        public static let ${this.toSwiftConstantName(name)} = Color(hex: "${value.value}")`);
      }
    }
    
    lines.push('    }');
    lines.push('}');
    lines.push('');
    
    return lines.join('\n');
  }
  
  /**
   * Generate typography tokens file
   */
  private generateTypographyTokensFile(tokens: PlatformTokens): string {
    const lines: string[] = [];
    
    lines.push('//');
    lines.push('// TypographyTokens.swift');
    lines.push('// DesignerPunk Design System');
    lines.push('//');
    lines.push('// Typography token constants for iOS');
    lines.push('//');
    lines.push('');
    lines.push('import Foundation');
    lines.push('import SwiftUI');
    lines.push('');
    lines.push('/// Typography tokens organized by hierarchy');
    lines.push('public extension Tokens {');
    lines.push('    /// Typography values in pt units');
    lines.push('    enum Type {');
    lines.push('        // Primitive typography tokens');
    
    for (const [name, value] of Object.entries(tokens.primitives.typography)) {
      lines.push(`        public static let ${this.toSwiftConstantName(name)}: CGFloat = ${value.value}`);
    }
    
    lines.push('    }');
    lines.push('}');
    lines.push('');
    
    return lines.join('\n');
  }
  
  /**
   * Generate SwiftUI component with proper structure
   */
  private generateSwiftUIComponent(component: ComponentDefinition, tokens: PlatformTokens): string {
    const lines: string[] = [];
    
    lines.push('//');
    lines.push(`// ${component.name}.swift`);
    lines.push('// DesignerPunk Design System');
    lines.push('//');
    lines.push(`// ${component.description}`);
    lines.push('//');
    lines.push('');
    lines.push('import SwiftUI');
    lines.push('');
    lines.push(`/// ${component.description}`);
    lines.push('///');
    lines.push('/// A SwiftUI component that follows the DesignerPunk design system.');
    lines.push('/// Uses mathematical token relationships for consistent spacing and sizing.');
    lines.push(`public struct ${component.name}: View {`);
    lines.push('    ');
    lines.push('    // MARK: - Properties');
    lines.push('    ');
    lines.push('    /// Component configuration');
    lines.push('    private let configuration: Configuration');
    lines.push('    ');
    lines.push('    // MARK: - Initialization');
    lines.push('    ');
    lines.push('    /// Creates a new instance');
    lines.push('    public init(configuration: Configuration = .default) {');
    lines.push('        self.configuration = configuration');
    lines.push('    }');
    lines.push('    ');
    lines.push('    // MARK: - Body');
    lines.push('    ');
    lines.push('    public var body: some View {');
    lines.push('        VStack(spacing: Tokens.Spacing.space100) {');
    lines.push(`            Text("${component.name}")`);
    lines.push('                .font(.system(size: Tokens.Typography.fontSize100))');
    lines.push('                .foregroundColor(Tokens.Colors.colorBlue500)');
    lines.push('        }');
    lines.push('        .padding(Tokens.Spacing.space100)');
    lines.push('    }');
    lines.push('}');
    lines.push('');
    lines.push('// MARK: - Configuration');
    lines.push('');
    lines.push(`extension ${component.name} {`);
    lines.push('    /// Component configuration options');
    lines.push('    public struct Configuration {');
    lines.push('        /// Default configuration');
    lines.push('        public static let `default` = Configuration()');
    lines.push('        ');
    lines.push('        public init() {}');
    lines.push('    }');
    lines.push('}');
    lines.push('');
    lines.push('// MARK: - Previews');
    lines.push('');
    lines.push('#if DEBUG');
    lines.push(`struct ${component.name}_Previews: PreviewProvider {`);
    lines.push('    static var previews: some View {');
    lines.push(`        ${component.name}()`);
    lines.push('            .previewLayout(.sizeThatFits)');
    lines.push('            .padding()');
    lines.push('    }');
    lines.push('}');
    lines.push('#endif');
    lines.push('');
    
    return lines.join('\n');
  }
  
  /**
   * Generate color extensions
   */
  private generateColorExtensions(): string {
    const lines: string[] = [];
    
    lines.push('//');
    lines.push('// ColorExtensions.swift');
    lines.push('// DesignerPunk Design System');
    lines.push('//');
    lines.push('// Color utility extensions');
    lines.push('//');
    lines.push('');
    lines.push('import SwiftUI');
    lines.push('');
    lines.push('// MARK: - Color Hex Initializer');
    lines.push('');
    lines.push('extension Color {');
    lines.push('    /// Initialize Color from hex string');
    lines.push('    /// - Parameter hex: Hex color string (e.g., "#FF0000" or "FF0000")');
    lines.push('    init(hex: String) {');
    lines.push('        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)');
    lines.push('        var int: UInt64 = 0');
    lines.push('        Scanner(string: hex).scanHexInt64(&int)');
    lines.push('        let a, r, g, b: UInt64');
    lines.push('        switch hex.count {');
    lines.push('        case 3: // RGB (12-bit)');
    lines.push('            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)');
    lines.push('        case 6: // RGB (24-bit)');
    lines.push('            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)');
    lines.push('        case 8: // ARGB (32-bit)');
    lines.push('            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)');
    lines.push('        default:');
    lines.push('            (a, r, g, b) = (255, 0, 0, 0)');
    lines.push('        }');
    lines.push('        self.init(');
    lines.push('            .sRGB,');
    lines.push('            red: Double(r) / 255,');
    lines.push('            green: Double(g) / 255,');
    lines.push('            blue: Double(b) / 255,');
    lines.push('            opacity: Double(a) / 255');
    lines.push('        )');
    lines.push('    }');
    lines.push('}');
    lines.push('');
    
    return lines.join('\n');
  }
  
  /**
   * Generate view extensions
   */
  private generateViewExtensions(): string {
    const lines: string[] = [];
    
    lines.push('//');
    lines.push('// ViewExtensions.swift');
    lines.push('// DesignerPunk Design System');
    lines.push('//');
    lines.push('// View utility extensions');
    lines.push('//');
    lines.push('');
    lines.push('import SwiftUI');
    lines.push('');
    lines.push('// MARK: - View Extensions');
    lines.push('');
    lines.push('extension View {');
    lines.push('    /// Apply design system spacing');
    lines.push('    func designSystemPadding(_ spacing: CGFloat) -> some View {');
    lines.push('        self.padding(spacing)');
    lines.push('    }');
    lines.push('    ');
    lines.push('    /// Apply design system corner radius');
    lines.push('    func designSystemCornerRadius(_ radius: CGFloat) -> some View {');
    lines.push('        self.cornerRadius(radius)');
    lines.push('    }');
    lines.push('}');
    lines.push('');
    
    return lines.join('\n');
  }
  
  /**
   * Generate main module file
   */
  private generateModuleFile(): string {
    const lines: string[] = [];
    
    lines.push('//');
    lines.push(`// ${this.buildConfig.productName}.swift`);
    lines.push('// DesignerPunk Design System');
    lines.push('//');
    lines.push('// Main module file');
    lines.push('//');
    lines.push('');
    lines.push('import Foundation');
    lines.push('import SwiftUI');
    lines.push('');
    lines.push('/// DesignerPunk Design System');
    lines.push('///');
    lines.push('/// A True Native cross-platform design system with mathematical foundations.');
    lines.push('/// Built for iOS using SwiftUI with token-based design principles.');
    lines.push('public enum DesignerPunk {');
    lines.push('    /// Design system version');
    lines.push('    public static let version = "1.0.0"');
    lines.push('    ');
    lines.push('    /// Platform identifier');
    lines.push('    public static let platform = "iOS"');
    lines.push('}');
    lines.push('');
    
    return lines.join('\n');
  }
  
  /**
   * Generate Swift component file (placeholder)
   */
  private generateComponentFile(component: ComponentDefinition, tokens: PlatformTokens): string {
    const lines: string[] = [];
    
    lines.push('//');
    lines.push(`// ${component.name}.swift`);
    lines.push('// DesignerPunk Design System');
    lines.push('//');
    lines.push(`// ${component.description}`);
    lines.push('//');
    lines.push('');
    lines.push('import SwiftUI');
    lines.push('');
    lines.push(`/// ${component.description}`);
    lines.push(`public struct ${component.name}: View {`);
    lines.push('    public init() {}');
    lines.push('    ');
    lines.push('    public var body: some View {');
    lines.push('        Text("' + component.name + '")');
    lines.push('    }');
    lines.push('}');
    lines.push('');
    
    return lines.join('\n');
  }
  
  /**
   * Convert token name to Swift constant name
   */
  private toSwiftConstantName(name: string): string {
    // Convert names like "space100" to "space100"
    // Convert names like "color.blue.500" to "colorBlue500"
    return name
      .replace(/\./g, '_')
      .replace(/-/g, '_')
      .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }
  
  /**
   * Validate Swift implementation
   */
  validate(implementation: unknown): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
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
   * Validate Swift constant syntax
   * 
   * Performs basic syntax validation on generated Swift code:
   * - Checks for valid Swift identifiers
   * - Validates enum structure
   * - Checks for proper type annotations
   * - Validates value formats
   * 
   * Requirements: 3.4, 3.7
   */
  validateSwiftSyntax(swiftCode: string): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check for required imports
    if (!swiftCode.includes('import SwiftUI')) {
      errors.push('Missing required import: SwiftUI');
    }
    if (!swiftCode.includes('import Foundation')) {
      errors.push('Missing required import: Foundation');
    }
    
    // Check for main Tokens enum
    if (!swiftCode.includes('public enum Tokens')) {
      errors.push('Missing main Tokens enum declaration');
    }
    
    // Validate enum structure (basic check)
    const enumPattern = /public enum \w+/g;
    const enumMatches = swiftCode.match(enumPattern);
    if (!enumMatches || enumMatches.length === 0) {
      errors.push('No public enum declarations found');
    }
    
    // Validate static let declarations
    const staticLetPattern = /public static let \w+:/g;
    const staticLetMatches = swiftCode.match(staticLetPattern);
    if (staticLetMatches && staticLetMatches.length > 0) {
      // Check for proper type annotations
      for (const match of staticLetMatches) {
        if (!match.includes(': CGFloat') && !match.includes('=')) {
          warnings.push(`Static let declaration may be missing type annotation: ${match}`);
        }
      }
    }
    
    // Validate CGFloat values
    const cgFloatPattern = /: CGFloat = (-?\d+\.?\d*)/g;
    let cgFloatMatch;
    while ((cgFloatMatch = cgFloatPattern.exec(swiftCode)) !== null) {
      const value = parseFloat(cgFloatMatch[1]);
      if (isNaN(value)) {
        errors.push(`Invalid CGFloat value: ${cgFloatMatch[1]}`);
      }
      if (value < 0) {
        warnings.push(`Negative CGFloat value found: ${value}`);
      }
    }
    
    // Validate Color hex values
    const colorHexPattern = /Color\(hex: "([^"]+)"\)/g;
    let colorMatch;
    while ((colorMatch = colorHexPattern.exec(swiftCode)) !== null) {
      const hexValue = colorMatch[1];
      if (!this.isValidHexColor(hexValue)) {
        errors.push(`Invalid hex color value: ${hexValue}`);
      }
    }
    
    // Check for Color extension
    if (swiftCode.includes('Color(hex:') && !swiftCode.includes('extension Color')) {
      errors.push('Color hex initializer used but Color extension not defined');
    }
    
    // Validate Swift identifier naming
    const identifierPattern = /public static let (\w+)/g;
    let identifierMatch;
    while ((identifierMatch = identifierPattern.exec(swiftCode)) !== null) {
      const identifier = identifierMatch[1];
      if (!this.isValidSwiftIdentifier(identifier)) {
        errors.push(`Invalid Swift identifier: ${identifier}`);
      }
    }
    
    // Check for balanced braces
    const openBraces = (swiftCode.match(/{/g) || []).length;
    const closeBraces = (swiftCode.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push(`Unbalanced braces: ${openBraces} opening, ${closeBraces} closing`);
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * Check if string is a valid hex color
   */
  private isValidHexColor(hex: string): boolean {
    // Remove # if present
    const cleanHex = hex.replace('#', '');
    
    // Valid hex colors are 3, 6, or 8 characters
    if (![3, 6, 8].includes(cleanHex.length)) {
      return false;
    }
    
    // Check if all characters are valid hex digits
    return /^[0-9A-Fa-f]+$/.test(cleanHex);
  }
  
  /**
   * Check if string is a valid Swift identifier
   */
  private isValidSwiftIdentifier(identifier: string): boolean {
    // Swift identifiers must start with letter or underscore
    // and contain only letters, digits, and underscores
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier);
  }
  
  /**
   * Clean build artifacts
   */
  async clean(outputDir: string): Promise<void> {
    const iosDir = path.join(outputDir, 'ios');
    try {
      await fs.rm(iosDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore errors if directory doesn't exist
    }
  }
  
  /**
   * Calculate package size
   */
  private async calculatePackageSize(dir: string): Promise<number> {
    let totalSize = 0;
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          totalSize += await this.calculatePackageSize(fullPath);
        } else {
          const stats = await fs.stat(fullPath);
          totalSize += stats.size;
        }
      }
    } catch (error) {
      // Ignore errors
    }
    
    return totalSize;
  }
  
  /**
   * Count total tokens
   */
  private countTokens(tokens: PlatformTokens): number {
    let count = 0;
    
    count += Object.keys(tokens.primitives.spacing).length;
    count += Object.keys(tokens.primitives.colors).length;
    count += Object.keys(tokens.primitives.typography).length;
    count += Object.keys(tokens.primitives.radius).length;
    count += Object.keys(tokens.primitives.sizing).length;
    
    count += Object.keys(tokens.semantics.spacing).length;
    count += Object.keys(tokens.semantics.colors).length;
    count += Object.keys(tokens.semantics.typography).length;
    count += Object.keys(tokens.semantics.radius).length;
    
    return count;
  }
  
  /**
   * Generate basic test file for Swift Package
   */
  private generateTestFile(): string {
    const lines: string[] = [];
    
    lines.push('//');
    lines.push(`// ${this.buildConfig.productName}Tests.swift`);
    lines.push('// DesignerPunk Design System');
    lines.push('//');
    lines.push('// Basic tests for design system package');
    lines.push('//');
    lines.push('');
    lines.push('import XCTest');
    lines.push(`@testable import ${this.buildConfig.productName}`);
    lines.push('');
    lines.push(`final class ${this.buildConfig.productName}Tests: XCTestCase {`);
    lines.push('    ');
    lines.push('    func testDesignSystemVersion() {');
    lines.push('        XCTAssertEqual(DesignerPunk.version, "1.0.0")');
    lines.push('    }');
    lines.push('    ');
    lines.push('    func testDesignSystemPlatform() {');
    lines.push('        XCTAssertEqual(DesignerPunk.platform, "iOS")');
    lines.push('    }');
    lines.push('    ');
    lines.push('    func testTokensExist() {');
    lines.push('        // Verify token constants are accessible');
    lines.push('        XCTAssertGreaterThan(Tokens.Spacing.space100, 0)');
    lines.push('    }');
    lines.push('}');
    lines.push('');
    
    return lines.join('\n');
  }
}

