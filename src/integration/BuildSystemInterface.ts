/**
 * Build System Integration Interface
 * 
 * Provides standardized interface for integrating the Mathematical Token System
 * with various build systems (webpack, rollup, vite, etc.). Enables seamless
 * platform file selection and build-time optimization.
 */

import type { TranslationOutput } from '../types';

/**
 * Supported build systems
 */
export type BuildSystem = 'webpack' | 'rollup' | 'vite' | 'esbuild' | 'parcel' | 'custom';

/**
 * Target platform for build output
 */
export type TargetPlatform = 'web' | 'ios' | 'android';

/**
 * Build system configuration
 */
export interface BuildSystemConfig {
  /** Build system type */
  system: BuildSystem;
  
  /** Target platform(s) for this build */
  targets: TargetPlatform[];
  
  /** Enable tree-shaking optimization */
  treeShaking?: boolean;
  
  /** Output directory for generated token files */
  outputDir?: string;
  
  /** Enable source maps for debugging */
  sourceMaps?: boolean;
  
  /** Custom file naming pattern */
  filePattern?: string;
  
  /** Additional build system specific options */
  customOptions?: Record<string, unknown>;
}

/**
 * Build integration result
 */
export interface BuildIntegrationResult {
  /** Whether integration was successful */
  success: boolean;
  
  /** Generated files for the build */
  files: TranslationOutput[];
  
  /** Platform-specific entry points */
  entryPoints: Map<TargetPlatform, string>;
  
  /** Build system specific configuration */
  buildConfig: Record<string, unknown>;
  
  /** Any warnings during integration */
  warnings: string[];
  
  /** Error message if integration failed */
  error?: string;
}

/**
 * Build system integration interface
 * 
 * Provides methods for integrating token generation with build systems,
 * enabling platform-specific file selection and optimization.
 */
export interface IBuildSystemIntegration {
  /**
   * Configure the build system integration
   */
  configure(config: BuildSystemConfig): void;
  
  /**
   * Generate platform-specific token files for the build
   */
  generateForBuild(platforms: TargetPlatform[]): Promise<BuildIntegrationResult>;
  
  /**
   * Get entry point for a specific platform
   */
  getEntryPoint(platform: TargetPlatform): string;
  
  /**
   * Get build system specific configuration
   */
  getBuildConfig(): Record<string, unknown>;
  
  /**
   * Validate build configuration
   */
  validateConfig(config: BuildSystemConfig): { valid: boolean; errors: string[] };
}

/**
 * Build system integration implementation
 */
export class BuildSystemIntegration implements IBuildSystemIntegration {
  private config: BuildSystemConfig | null = null;
  private generatedFiles: Map<TargetPlatform, TranslationOutput> = new Map();

  configure(config: BuildSystemConfig): void {
    const validation = this.validateConfig(config);
    if (!validation.valid) {
      throw new Error(`Invalid build configuration: ${validation.errors.join(', ')}`);
    }
    this.config = config;
  }

  async generateForBuild(platforms: TargetPlatform[]): Promise<BuildIntegrationResult> {
    if (!this.config) {
      return {
        success: false,
        files: [],
        entryPoints: new Map(),
        buildConfig: {},
        warnings: [],
        error: 'Build system not configured. Call configure() first.'
      };
    }

    const warnings: string[] = [];
    const files: TranslationOutput[] = [];
    const entryPoints = new Map<TargetPlatform, string>();

    try {
      // Generate files for each platform
      for (const platform of platforms) {
        const file = await this.generatePlatformFile(platform);
        files.push(file);
        this.generatedFiles.set(platform, file);
        entryPoints.set(platform, file.filePath);
      }

      // Generate build system specific configuration
      const buildConfig = this.generateBuildConfig(platforms);

      return {
        success: true,
        files,
        entryPoints,
        buildConfig,
        warnings
      };
    } catch (error) {
      return {
        success: false,
        files,
        entryPoints,
        buildConfig: {},
        warnings,
        error: error instanceof Error ? error.message : 'Unknown error during build integration'
      };
    }
  }

  getEntryPoint(platform: TargetPlatform): string {
    const file = this.generatedFiles.get(platform);
    if (!file) {
      throw new Error(`No entry point found for platform: ${platform}. Generate files first.`);
    }
    return file.filePath;
  }

  getBuildConfig(): Record<string, unknown> {
    if (!this.config) {
      throw new Error('Build system not configured. Call configure() first.');
    }
    return this.generateBuildConfig(this.config.targets);
  }

  validateConfig(config: BuildSystemConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.system) {
      errors.push('Build system type is required');
    }

    if (!config.targets || config.targets.length === 0) {
      errors.push('At least one target platform is required');
    }

    if (config.targets) {
      const validPlatforms: TargetPlatform[] = ['web', 'ios', 'android'];
      for (const target of config.targets) {
        if (!validPlatforms.includes(target)) {
          errors.push(`Invalid target platform: ${target}`);
        }
      }
    }

    if (config.outputDir && typeof config.outputDir !== 'string') {
      errors.push('Output directory must be a string');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private async generatePlatformFile(platform: TargetPlatform): Promise<TranslationOutput> {
    // This would integrate with TranslationCoordinator in real implementation
    // For now, return a mock structure
    const fileExtensions: Record<TargetPlatform, string> = {
      web: 'css',
      ios: 'swift',
      android: 'kt'
    };

    const formats: Record<TargetPlatform, TranslationOutput['format']> = {
      web: 'css',
      ios: 'swift',
      android: 'kotlin'
    };

    const outputDir = this.config?.outputDir || 'dist/tokens';
    const filePattern = this.config?.filePattern || 'DesignTokens.{platform}.{ext}';
    
    const fileName = filePattern
      .replace('{platform}', platform)
      .replace('{ext}', fileExtensions[platform]);

    return {
      platform,
      filePath: `${outputDir}/${fileName}`,
      content: `// Generated tokens for ${platform}`,
      format: formats[platform],
      tokenCount: 0,
      validationStatus: 'valid'
    };
  }

  private generateBuildConfig(platforms: TargetPlatform[]): Record<string, unknown> {
    if (!this.config) {
      return {};
    }

    const { system, treeShaking, sourceMaps } = this.config;

    switch (system) {
      case 'webpack':
        return this.generateWebpackConfig(platforms, treeShaking, sourceMaps);
      case 'rollup':
        return this.generateRollupConfig(platforms, treeShaking, sourceMaps);
      case 'vite':
        return this.generateViteConfig(platforms, treeShaking, sourceMaps);
      case 'esbuild':
        return this.generateEsbuildConfig(platforms, treeShaking, sourceMaps);
      default:
        return {};
    }
  }

  private generateWebpackConfig(
    platforms: TargetPlatform[],
    treeShaking?: boolean,
    sourceMaps?: boolean
  ): Record<string, unknown> {
    return {
      resolve: {
        alias: this.generateAliases(platforms)
      },
      optimization: {
        usedExports: treeShaking !== false,
        sideEffects: false
      },
      devtool: sourceMaps ? 'source-map' : false
    };
  }

  private generateRollupConfig(
    platforms: TargetPlatform[],
    treeShaking?: boolean,
    sourceMaps?: boolean
  ): Record<string, unknown> {
    return {
      treeshake: treeShaking !== false,
      sourcemap: sourceMaps !== false,
      external: this.generateExternals(platforms)
    };
  }

  private generateViteConfig(
    platforms: TargetPlatform[],
    treeShaking?: boolean,
    sourceMaps?: boolean
  ): Record<string, unknown> {
    return {
      resolve: {
        alias: this.generateAliases(platforms)
      },
      build: {
        sourcemap: sourceMaps !== false,
        rollupOptions: {
          treeshake: treeShaking !== false
        }
      }
    };
  }

  private generateEsbuildConfig(
    platforms: TargetPlatform[],
    treeShaking?: boolean,
    sourceMaps?: boolean
  ): Record<string, unknown> {
    return {
      alias: this.generateAliases(platforms),
      treeShaking: treeShaking !== false,
      sourcemap: sourceMaps !== false
    };
  }

  private generateAliases(platforms: TargetPlatform[]): Record<string, string> {
    const aliases: Record<string, string> = {};
    
    for (const platform of platforms) {
      const file = this.generatedFiles.get(platform);
      if (file) {
        aliases[`@tokens/${platform}`] = file.filePath;
      }
    }

    return aliases;
  }

  private generateExternals(platforms: TargetPlatform[]): string[] {
    return platforms.map(platform => `@tokens/${platform}`);
  }
}
