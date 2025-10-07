/**
 * iOS Builder Tests
 * 
 * Tests for iOS platform builder functionality
 */

import { iOSBuilder } from '../iOSBuilder';
import { BuildConfig } from '../../types/BuildConfig';
import { PlatformTokens } from '../../tokens/PlatformTokens';
import { ComponentDefinition } from '../PlatformBuilder';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('iOSBuilder', () => {
  let builder: iOSBuilder;
  let testOutputDir: string;

  beforeEach(() => {
    builder = new iOSBuilder();
    testOutputDir = path.join(__dirname, '../../../../test-output');
  });

  afterEach(async () => {
    // Clean up test output
    try {
      await fs.rm(testOutputDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('constructor', () => {
    it('should create iOS builder with default configuration', () => {
      expect(builder.platform).toBe('ios');
    });

    it('should accept custom iOS build options', () => {
      const customBuilder = new iOSBuilder({
        swiftVersion: '5.10',
        minimumDeploymentTarget: '16.0',
        dependencies: ['SomePackage']
      });
      
      expect(customBuilder.platform).toBe('ios');
    });
  });

  describe('generateTokens', () => {
    it('should generate Swift token constants from primitive tokens', () => {
      const tokens: PlatformTokens = {
        platform: 'ios',
        primitives: {
          spacing: {
            space100: { value: 8, unit: 'pt', token: 'space100' },
            space200: { value: 16, unit: 'pt', token: 'space200' }
          },
          colors: {
            'color.blue.500': { value: '#3B82F6', unit: '', token: 'color.blue.500' }
          },
          typography: {
            fontSize100: { value: 16, unit: 'pt', token: 'fontSize100' }
          },
          radius: {
            radius050: { value: 4, unit: 'pt', token: 'radius050' }
          },
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
          platform: 'ios',
          defaultSpacingUnit: 'pt',
          defaultTypographyUnit: 'pt',
          supportedUnits: ['pt'],
          constraints: {
            decimalPrecision: 2,
            supportsSubpixel: false,
            roundingMode: 'round'
          },
          generatedAt: new Date()
        }
      };

      const swiftCode = builder.generateTokens(tokens);

      // Verify Swift code structure
      expect(swiftCode).toContain('import SwiftUI');
      expect(swiftCode).toContain('public enum Tokens');
      expect(swiftCode).toContain('// MARK: - Primitive Tokens');
      expect(swiftCode).toContain('public enum Spacing');
      expect(swiftCode).toContain('public static let space100: CGFloat = 8');
      expect(swiftCode).toContain('public static let space200: CGFloat = 16');
      expect(swiftCode).toContain('public enum Colors');
      expect(swiftCode).toContain('public enum Typography');
      expect(swiftCode).toContain('public enum Radius');
      expect(swiftCode).toContain('extension Color');
    });

    it('should generate Swift constants from semantic tokens', () => {
      const tokens: PlatformTokens = {
        platform: 'ios',
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
          spacing: {
            'space.normal': { value: 16, unit: 'pt', token: 'space100' },
            'space.compact': { value: 8, unit: 'pt', token: 'space075' }
          },
          colors: {
            'color.primary': { value: '#3B82F6', unit: '', token: 'color.blue.500' }
          },
          typography: {
            'typography.body': { value: 16, unit: 'pt', token: 'fontSize100' }
          },
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
          platform: 'ios',
          defaultSpacingUnit: 'pt',
          defaultTypographyUnit: 'pt',
          supportedUnits: ['pt'],
          constraints: {
            decimalPrecision: 2,
            supportsSubpixel: false,
            roundingMode: 'round'
          },
          generatedAt: new Date()
        }
      };

      const swiftCode = builder.generateTokens(tokens);

      // Verify semantic tokens are generated
      expect(swiftCode).toContain('// MARK: - Semantic Tokens');
      expect(swiftCode).toContain('public enum SemanticSpacing');
      expect(swiftCode).toContain('public static let spaceNormal: CGFloat = 16');
      expect(swiftCode).toContain('references: space100');
      expect(swiftCode).toContain('public enum SemanticColors');
      expect(swiftCode).toContain('public enum SemanticTypography');
    });

    it('should generate Swift constants from component tokens', () => {
      const tokens: PlatformTokens = {
        platform: 'ios',
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
          spacing: {
            'button.padding': { value: 12, unit: 'pt', token: 'button.padding' }
          },
          colors: {
            'button.background': { value: '#1E40AF', unit: '', token: 'button.background' }
          },
          typography: {},
          radius: {},
          sizing: {},
          opacity: {},
          elevation: {},
          animation: {}
        },
        metadata: {
          platform: 'ios',
          defaultSpacingUnit: 'pt',
          defaultTypographyUnit: 'pt',
          supportedUnits: ['pt'],
          constraints: {
            decimalPrecision: 2,
            supportsSubpixel: false,
            roundingMode: 'round'
          },
          generatedAt: new Date()
        }
      };

      const swiftCode = builder.generateTokens(tokens);

      // Verify component tokens are generated
      expect(swiftCode).toContain('// MARK: - Component Tokens');
      expect(swiftCode).toContain('Component-specific tokens');
      expect(swiftCode).toContain('public enum ComponentSpacing');
      expect(swiftCode).toContain('public static let buttonPadding: CGFloat = 12');
      expect(swiftCode).toContain('public enum ComponentColors');
    });

    it('should handle empty token sets', () => {
      const tokens: PlatformTokens = {
        platform: 'ios',
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
          platform: 'ios',
          defaultSpacingUnit: 'pt',
          defaultTypographyUnit: 'pt',
          supportedUnits: ['pt'],
          constraints: {
            decimalPrecision: 2,
            supportsSubpixel: false,
            roundingMode: 'round'
          },
          generatedAt: new Date()
        }
      };

      const swiftCode = builder.generateTokens(tokens);

      expect(swiftCode).toContain('public enum Tokens');
      expect(swiftCode).toContain('import SwiftUI');
    });
  });

  describe('validateSwiftSyntax', () => {
    it('should validate correct Swift syntax', () => {
      const validSwift = `
import Foundation
import SwiftUI

public enum Tokens {
    public enum Spacing {
        public static let space100: CGFloat = 8
    }
}

extension Color {
    init(hex: String) {}
}
`;

      const result = builder.validateSwiftSyntax(validSwift);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing imports', () => {
      const invalidSwift = `
public enum Tokens {
    public enum Spacing {
        public static let space100: CGFloat = 8
    }
}
`;

      const result = builder.validateSwiftSyntax(invalidSwift);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required import: SwiftUI');
      expect(result.errors).toContain('Missing required import: Foundation');
    });

    it('should detect invalid hex colors', () => {
      const invalidSwift = `
import Foundation
import SwiftUI

public enum Tokens {
    public enum Colors {
        public static let invalid = Color(hex: "GGGGGG")
    }
}

extension Color {
    init(hex: String) {}
}
`;

      const result = builder.validateSwiftSyntax(invalidSwift);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid hex color'))).toBe(true);
    });

    it('should detect unbalanced braces', () => {
      const invalidSwift = `
import Foundation
import SwiftUI

public enum Tokens {
    public enum Spacing {
        public static let space100: CGFloat = 8
    }
`;

      const result = builder.validateSwiftSyntax(invalidSwift);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Unbalanced braces'))).toBe(true);
    });

    it('should detect missing main Tokens enum', () => {
      const invalidSwift = `
import Foundation
import SwiftUI

public enum NotTokens {
    public enum Spacing {
        public static let space100: CGFloat = 8
    }
}
`;

      const result = builder.validateSwiftSyntax(invalidSwift);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Missing main Tokens enum'))).toBe(true);
    });

    it('should warn about negative values', () => {
      const swiftWithNegative = `
import Foundation
import SwiftUI

public enum Tokens {
    public enum Spacing {
        public static let negative: CGFloat = -8
    }
}
`;

      const result = builder.validateSwiftSyntax(swiftWithNegative);

      expect(result.warnings.some(w => w.includes('Negative CGFloat value'))).toBe(true);
    });
  });

  describe('Swift Package structure', () => {
    it('should generate Package.swift with proper dependencies', async () => {
      const customBuilder = new iOSBuilder({
        swiftVersion: '5.9',
        minimumDeploymentTarget: '15.0',
        dependencies: []
      });

      const components: ComponentDefinition[] = [];
      const tokens: PlatformTokens = {
        platform: 'ios',
        primitives: {
          spacing: { space100: { value: 8, unit: 'pt', token: 'space100' } },
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
          platform: 'ios',
          defaultSpacingUnit: 'pt',
          defaultTypographyUnit: 'pt',
          supportedUnits: ['pt'],
          constraints: {
            decimalPrecision: 2,
            supportsSubpixel: false,
            roundingMode: 'round'
          },
          generatedAt: new Date()
        }
      };

      const config: BuildConfig = {
        platforms: ['ios'],
        mode: 'development',
        outputDir: testOutputDir,
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

      const result = await customBuilder.build(components, tokens, config);

      expect(result.success).toBe(true);

      // Verify Package.swift structure
      const packageManifest = await fs.readFile(
        path.join(testOutputDir, 'ios', 'Package.swift'),
        'utf-8'
      );
      
      expect(packageManifest).toContain('// swift-tools-version: 5.9');
      expect(packageManifest).toContain('name: "DesignerPunk"');
      expect(packageManifest).toContain('.iOS(.v15)');
      expect(packageManifest).toContain('.library(');
      expect(packageManifest).toContain('.target(');
      expect(packageManifest).toContain('.testTarget(');
      expect(packageManifest).toContain('path: "Sources/DesignerPunk"');
      expect(packageManifest).toContain('path: "Tests/DesignerPunkTests"');
    });

    it('should create proper Swift source file organization', async () => {
      const components: ComponentDefinition[] = [
        {
          name: 'TestComponent',
          description: 'Test component',
          category: 'test',
          properties: [],
          methods: [],
          tokens: []
        }
      ];

      const tokens: PlatformTokens = {
        platform: 'ios',
        primitives: {
          spacing: { space100: { value: 8, unit: 'pt', token: 'space100' } },
          colors: { 'color.blue.500': { value: '#3B82F6', unit: '', token: 'color.blue.500' } },
          typography: { fontSize100: { value: 16, unit: 'pt', token: 'fontSize100' } },
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
          platform: 'ios',
          defaultSpacingUnit: 'pt',
          defaultTypographyUnit: 'pt',
          supportedUnits: ['pt'],
          constraints: {
            decimalPrecision: 2,
            supportsSubpixel: false,
            roundingMode: 'round'
          },
          generatedAt: new Date()
        }
      };

      const config: BuildConfig = {
        platforms: ['ios'],
        mode: 'development',
        outputDir: testOutputDir,
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

      const result = await builder.build(components, tokens, config);

      expect(result.success).toBe(true);

      const sourcesDir = path.join(testOutputDir, 'ios', 'Sources', 'DesignerPunk');

      // Verify directory structure
      const tokensDir = await fs.access(path.join(sourcesDir, 'Tokens'))
        .then(() => true)
        .catch(() => false);
      expect(tokensDir).toBe(true);

      const componentsDir = await fs.access(path.join(sourcesDir, 'Components'))
        .then(() => true)
        .catch(() => false);
      expect(componentsDir).toBe(true);

      const extensionsDir = await fs.access(path.join(sourcesDir, 'Extensions'))
        .then(() => true)
        .catch(() => false);
      expect(extensionsDir).toBe(true);

      // Verify token files
      const tokensFile = await fs.readFile(
        path.join(sourcesDir, 'Tokens', 'Tokens.swift'),
        'utf-8'
      );
      expect(tokensFile).toContain('public enum Tokens');

      const spacingTokensFile = await fs.readFile(
        path.join(sourcesDir, 'Tokens', 'SpacingTokens.swift'),
        'utf-8'
      );
      expect(spacingTokensFile).toContain('enum Space');

      const colorTokensFile = await fs.readFile(
        path.join(sourcesDir, 'Tokens', 'ColorTokens.swift'),
        'utf-8'
      );
      expect(colorTokensFile).toContain('enum ColorPalette');

      // Verify component file
      const componentFile = await fs.readFile(
        path.join(sourcesDir, 'Components', 'TestComponent.swift'),
        'utf-8'
      );
      expect(componentFile).toContain('struct TestComponent: View');
      expect(componentFile).toContain('public var body: some View');

      // Verify extension files
      const colorExtensions = await fs.readFile(
        path.join(sourcesDir, 'Extensions', 'ColorExtensions.swift'),
        'utf-8'
      );
      expect(colorExtensions).toContain('extension Color');
      expect(colorExtensions).toContain('init(hex: String)');

      const viewExtensions = await fs.readFile(
        path.join(sourcesDir, 'Extensions', 'ViewExtensions.swift'),
        'utf-8'
      );
      expect(viewExtensions).toContain('extension View');
    });

    it('should set up SwiftUI component structure', async () => {
      const components: ComponentDefinition[] = [
        {
          name: 'ButtonCTA',
          description: 'Call-to-action button',
          category: 'button',
          properties: [],
          methods: [],
          tokens: []
        }
      ];

      const tokens: PlatformTokens = {
        platform: 'ios',
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
          platform: 'ios',
          defaultSpacingUnit: 'pt',
          defaultTypographyUnit: 'pt',
          supportedUnits: ['pt'],
          constraints: {
            decimalPrecision: 2,
            supportsSubpixel: false,
            roundingMode: 'round'
          },
          generatedAt: new Date()
        }
      };

      const config: BuildConfig = {
        platforms: ['ios'],
        mode: 'development',
        outputDir: testOutputDir,
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

      const result = await builder.build(components, tokens, config);

      expect(result.success).toBe(true);

      const componentFile = await fs.readFile(
        path.join(testOutputDir, 'ios', 'Sources', 'DesignerPunk', 'Components', 'ButtonCTA.swift'),
        'utf-8'
      );

      // Verify SwiftUI component structure
      expect(componentFile).toContain('import SwiftUI');
      expect(componentFile).toContain('public struct ButtonCTA: View');
      expect(componentFile).toContain('public var body: some View');
      expect(componentFile).toContain('Configuration');
      expect(componentFile).toContain('public init(configuration: Configuration = .default)');
      expect(componentFile).toContain('// MARK: - Properties');
      expect(componentFile).toContain('// MARK: - Initialization');
      expect(componentFile).toContain('// MARK: - Body');
      expect(componentFile).toContain('// MARK: - Configuration');
      expect(componentFile).toContain('// MARK: - Previews');
      expect(componentFile).toContain('PreviewProvider');
    });

    it('should configure Swift version and deployment targets', async () => {
      const customBuilder = new iOSBuilder({
        swiftVersion: '5.10',
        minimumDeploymentTarget: '16.0',
        dependencies: []
      });

      const components: ComponentDefinition[] = [];
      const tokens: PlatformTokens = {
        platform: 'ios',
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
          platform: 'ios',
          defaultSpacingUnit: 'pt',
          defaultTypographyUnit: 'pt',
          supportedUnits: ['pt'],
          constraints: {
            decimalPrecision: 2,
            supportsSubpixel: false,
            roundingMode: 'round'
          },
          generatedAt: new Date()
        }
      };

      const config: BuildConfig = {
        platforms: ['ios'],
        mode: 'development',
        outputDir: testOutputDir,
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

      const result = await customBuilder.build(components, tokens, config);

      expect(result.success).toBe(true);

      const packageManifest = await fs.readFile(
        path.join(testOutputDir, 'ios', 'Package.swift'),
        'utf-8'
      );

      expect(packageManifest).toContain('// swift-tools-version: 5.10');
      expect(packageManifest).toContain('.iOS(.v16)');
    });

    it('should create Tests directory with test file', async () => {
      const components: ComponentDefinition[] = [];
      const tokens: PlatformTokens = {
        platform: 'ios',
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
          platform: 'ios',
          defaultSpacingUnit: 'pt',
          defaultTypographyUnit: 'pt',
          supportedUnits: ['pt'],
          constraints: {
            decimalPrecision: 2,
            supportsSubpixel: false,
            roundingMode: 'round'
          },
          generatedAt: new Date()
        }
      };

      const config: BuildConfig = {
        platforms: ['ios'],
        mode: 'development',
        outputDir: testOutputDir,
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

      const result = await builder.build(components, tokens, config);

      expect(result.success).toBe(true);

      // Verify Tests directory exists
      const testsDir = await fs.access(path.join(testOutputDir, 'ios', 'Tests', 'DesignerPunkTests'))
        .then(() => true)
        .catch(() => false);
      expect(testsDir).toBe(true);

      // Verify test file exists and has proper structure
      const testFile = await fs.readFile(
        path.join(testOutputDir, 'ios', 'Tests', 'DesignerPunkTests', 'DesignerPunkTests.swift'),
        'utf-8'
      );

      expect(testFile).toContain('import XCTest');
      expect(testFile).toContain('@testable import DesignerPunk');
      expect(testFile).toContain('final class DesignerPunkTests: XCTestCase');
      expect(testFile).toContain('func testDesignSystemVersion()');
      expect(testFile).toContain('func testDesignSystemPlatform()');
      expect(testFile).toContain('func testTokensExist()');
    });
  });

  describe('build', () => {
    it('should build Swift Package with components and tokens', async () => {
      const components: ComponentDefinition[] = [
        {
          name: 'Button',
          description: 'A button component',
          category: 'input',
          properties: [],
          methods: [],
          tokens: []
        }
      ];

      const tokens: PlatformTokens = {
        platform: 'ios',
        primitives: {
          spacing: {
            space100: { value: 8, unit: 'pt', token: 'space100' }
          },
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
          platform: 'ios',
          defaultSpacingUnit: 'pt',
          defaultTypographyUnit: 'pt',
          supportedUnits: ['pt'],
          constraints: {
            decimalPrecision: 2,
            supportsSubpixel: false,
            roundingMode: 'round'
          },
          generatedAt: new Date()
        }
      };

      const config: BuildConfig = {
        platforms: ['ios'],
        mode: 'development',
        outputDir: testOutputDir,
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

      const result = await builder.build(components, tokens, config);

      expect(result.success).toBe(true);
      expect(result.platform).toBe('ios');
      expect(result.errors).toHaveLength(0);
      expect(result.metadata?.componentsBuilt).toBe(1);

      // Verify files were created
      const iosDir = path.join(testOutputDir, 'ios');
      const packageManifest = await fs.readFile(path.join(iosDir, 'Package.swift'), 'utf-8');
      expect(packageManifest).toContain('Package');
      expect(packageManifest).toContain('DesignerPunk');

      const tokensFile = await fs.readFile(
        path.join(iosDir, 'Sources', 'DesignerPunk', 'Tokens', 'Tokens.swift'),
        'utf-8'
      );
      expect(tokensFile).toContain('public enum Tokens');
    });

    it('should handle build errors gracefully', async () => {
      const components: ComponentDefinition[] = [];
      const tokens: PlatformTokens = {
        platform: 'ios',
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
          platform: 'ios',
          defaultSpacingUnit: 'pt',
          defaultTypographyUnit: 'pt',
          supportedUnits: ['pt'],
          constraints: {
            decimalPrecision: 2,
            supportsSubpixel: false,
            roundingMode: 'round'
          },
          generatedAt: new Date()
        }
      };

      // Use invalid output directory to trigger error
      const config: BuildConfig = {
        platforms: ['ios'],
        mode: 'development',
        outputDir: '/invalid/path/that/does/not/exist',
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

      const result = await builder.build(components, tokens, config);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].code).toBe('IOS_BUILD_FAILED');
    });
  });

  describe('validate', () => {
    it('should validate implementation', () => {
      const result = builder.validate({ some: 'implementation' });
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return error for missing implementation', () => {
      const result = builder.validate(null);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Implementation is required');
    });
  });

  describe('clean', () => {
    it('should clean build artifacts', async () => {
      // Create test directory
      const iosDir = path.join(testOutputDir, 'ios');
      await fs.mkdir(iosDir, { recursive: true });
      await fs.writeFile(path.join(iosDir, 'test.txt'), 'test', 'utf-8');

      // Verify file exists
      const fileExists = await fs.access(path.join(iosDir, 'test.txt'))
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);

      // Clean
      await builder.clean(testOutputDir);

      // Verify directory is removed
      const dirExists = await fs.access(iosDir)
        .then(() => true)
        .catch(() => false);
      expect(dirExists).toBe(false);
    });

    it('should handle non-existent directory gracefully', async () => {
      await expect(builder.clean('/non/existent/path')).resolves.not.toThrow();
    });
  });
});

