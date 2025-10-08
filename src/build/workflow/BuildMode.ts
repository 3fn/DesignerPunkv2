/**
 * Build Mode Support
 * 
 * Provides development and production build mode configurations with
 * platform-specific optimizations. Development mode enables debugging
 * features while production mode optimizes for performance and size.
 * 
 * Requirements: 8.6
 */

import { BuildConfig, BuildMode as BuildModeType } from '../types/BuildConfig';
import { Platform } from '../types/Platform';

/**
 * Platform-specific optimization configuration
 */
export interface PlatformOptimizations {
  /** iOS-specific optimizations */
  ios: iOSOptimizations;
  /** Android-specific optimizations */
  android: AndroidOptimizations;
  /** Web-specific optimizations */
  web: WebOptimizations;
}

/**
 * iOS optimization settings
 */
export interface iOSOptimizations {
  /** Enable Swift compiler optimizations */
  swiftOptimization: 'none' | 'speed' | 'size';
  /** Enable whole module optimization */
  wholeModuleOptimization: boolean;
  /** Strip debug symbols */
  stripDebugSymbols: boolean;
  /** Enable bitcode */
  enableBitcode: boolean;
  /** Dead code stripping */
  deadCodeStripping: boolean;
}

/**
 * Android optimization settings
 */
export interface AndroidOptimizations {
  /** Enable Kotlin compiler optimizations */
  kotlinOptimization: boolean;
  /** Enable ProGuard/R8 minification */
  minifyEnabled: boolean;
  /** Enable resource shrinking */
  shrinkResources: boolean;
  /** Enable code obfuscation */
  obfuscate: boolean;
  /** Debuggable flag */
  debuggable: boolean;
}

/**
 * Web optimization settings
 */
export interface WebOptimizations {
  /** Enable minification */
  minify: boolean;
  /** Enable tree shaking */
  treeShaking: boolean;
  /** Enable code splitting */
  codeSplitting: boolean;
  /** Compression level */
  compression: 'none' | 'gzip' | 'brotli';
  /** Generate source maps */
  sourceMaps: boolean | 'inline' | 'external';
}

/**
 * Build mode configuration with optimizations
 */
export interface BuildModeConfig {
  /** Build mode type */
  mode: BuildModeType;
  /** Platform-specific optimizations */
  optimizations: PlatformOptimizations;
  /** Global build settings */
  settings: {
    /** Enable source maps */
    sourceMaps: boolean;
    /** Enable minification */
    minify: boolean;
    /** Enable incremental builds */
    incremental: boolean;
    /** Verbose logging */
    verbose: boolean;
  };
}

/**
 * Build Mode Manager
 * 
 * Manages build mode configurations and applies platform-specific
 * optimizations based on development or production mode.
 */
export class BuildModeManager {
  /**
   * Get build mode configuration for specified mode
   */
  public getBuildModeConfig(mode: BuildModeType): BuildModeConfig {
    return mode === 'development'
      ? this.getDevelopmentConfig()
      : this.getProductionConfig();
  }

  /**
   * Get development mode configuration
   * 
   * Development mode prioritizes:
   * - Fast build times
   * - Debugging capabilities
   * - Source maps
   * - Verbose error messages
   */
  private getDevelopmentConfig(): BuildModeConfig {
    return {
      mode: 'development',
      optimizations: {
        ios: {
          swiftOptimization: 'none',
          wholeModuleOptimization: false,
          stripDebugSymbols: false,
          enableBitcode: false,
          deadCodeStripping: false,
        },
        android: {
          kotlinOptimization: false,
          minifyEnabled: false,
          shrinkResources: false,
          obfuscate: false,
          debuggable: true,
        },
        web: {
          minify: false,
          treeShaking: false,
          codeSplitting: false,
          compression: 'none',
          sourceMaps: 'inline',
        },
      },
      settings: {
        sourceMaps: true,
        minify: false,
        incremental: true,
        verbose: true,
      },
    };
  }

  /**
   * Get production mode configuration
   * 
   * Production mode prioritizes:
   * - Optimized bundle sizes
   * - Performance
   * - Security (obfuscation)
   * - Minimal debug information
   */
  private getProductionConfig(): BuildModeConfig {
    return {
      mode: 'production',
      optimizations: {
        ios: {
          swiftOptimization: 'speed',
          wholeModuleOptimization: true,
          stripDebugSymbols: true,
          enableBitcode: true,
          deadCodeStripping: true,
        },
        android: {
          kotlinOptimization: true,
          minifyEnabled: true,
          shrinkResources: true,
          obfuscate: true,
          debuggable: false,
        },
        web: {
          minify: true,
          treeShaking: true,
          codeSplitting: true,
          compression: 'brotli',
          sourceMaps: 'external',
        },
      },
      settings: {
        sourceMaps: false,
        minify: true,
        incremental: false,
        verbose: false,
      },
    };
  }

  /**
   * Apply build mode configuration to build config
   */
  public applyBuildMode(
    config: BuildConfig,
    modeConfig: BuildModeConfig
  ): BuildConfig {
    return {
      ...config,
      mode: modeConfig.mode,
      sourceMaps: modeConfig.settings.sourceMaps,
      minify: modeConfig.settings.minify,
      incremental: modeConfig.settings.incremental,
    };
  }

  /**
   * Get platform-specific optimizations for a platform
   */
  public getPlatformOptimizations(
    mode: BuildModeType,
    platform: Platform
  ): iOSOptimizations | AndroidOptimizations | WebOptimizations {
    const config = this.getBuildModeConfig(mode);
    return config.optimizations[platform];
  }

  /**
   * Validate build mode configuration
   */
  public validateBuildMode(config: BuildConfig): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate mode is set
    if (!config.mode) {
      errors.push('Build mode must be specified (development or production)');
    }

    // Validate mode-specific settings
    if (config.mode === 'production') {
      if (config.sourceMaps && config.minify) {
        warnings.push(
          'Source maps enabled in production mode may expose source code'
        );
      }

      if (!config.minify) {
        warnings.push(
          'Minification disabled in production mode - bundle sizes will be larger'
        );
      }

      if (config.incremental) {
        warnings.push(
          'Incremental builds in production mode may not apply all optimizations'
        );
      }
    }

    if (config.mode === 'development') {
      if (config.minify) {
        warnings.push(
          'Minification enabled in development mode - debugging will be harder'
        );
      }

      if (!config.sourceMaps) {
        warnings.push(
          'Source maps disabled in development mode - debugging will be limited'
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get build mode description
   */
  public getBuildModeDescription(mode: BuildModeType): string {
    if (mode === 'development') {
      return 'Development mode: Fast builds, debugging enabled, no optimizations';
    }
    return 'Production mode: Optimized builds, minification, performance focused';
  }

  /**
   * Compare two build modes
   */
  public compareBuildModes(
    mode1: BuildModeType,
    mode2: BuildModeType
  ): {
    same: boolean;
    differences: string[];
  } {
    if (mode1 === mode2) {
      return { same: true, differences: [] };
    }

    const config1 = this.getBuildModeConfig(mode1);
    const config2 = this.getBuildModeConfig(mode2);
    const differences: string[] = [];

    // Compare settings
    if (config1.settings.sourceMaps !== config2.settings.sourceMaps) {
      differences.push(
        `Source maps: ${config1.settings.sourceMaps} vs ${config2.settings.sourceMaps}`
      );
    }

    if (config1.settings.minify !== config2.settings.minify) {
      differences.push(
        `Minification: ${config1.settings.minify} vs ${config2.settings.minify}`
      );
    }

    if (config1.settings.incremental !== config2.settings.incremental) {
      differences.push(
        `Incremental builds: ${config1.settings.incremental} vs ${config2.settings.incremental}`
      );
    }

    return {
      same: false,
      differences,
    };
  }
}
