/**
 * Build Configuration Interface
 * 
 * Defines the configuration options for the Cross-Platform Build System.
 * Supports platform selection, build modes, output configuration, and
 * platform-specific options.
 */

import { Platform } from './Platform';

/**
 * Build mode configuration
 */
export type BuildMode = 'development' | 'production';

/**
 * Validation options for build process
 */
export interface ValidationOptions {
  /** Validate interface contracts across platforms */
  interfaces: boolean;
  /** Validate token integration and consistency */
  tokens: boolean;
  /** Validate mathematical relationships */
  mathematical: boolean;
}

/**
 * iOS-specific build options
 */
export interface iOSBuildOptions {
  /** Swift language version */
  swiftVersion: string;
  /** Minimum iOS deployment target */
  minimumDeploymentTarget: string;
  /** Swift Package dependencies */
  dependencies: string[];
}

/**
 * Android-specific build options
 */
export interface AndroidBuildOptions {
  /** Kotlin language version */
  kotlinVersion: string;
  /** Minimum Android SDK version */
  minSdkVersion: number;
  /** Target Android SDK version */
  targetSdkVersion: number;
  /** Gradle dependencies */
  dependencies: string[];
}

/**
 * Web-specific build options
 */
export interface WebBuildOptions {
  /** ECMAScript target version */
  target: 'es2020' | 'es2021' | 'esnext';
  /** Output module formats */
  formats: ('esm' | 'cjs' | 'umd')[];
  /** External dependencies to exclude from bundle */
  externals: string[];
}

/**
 * Main build configuration interface
 */
export interface BuildConfig {
  /** Target platforms for build */
  platforms: Platform[];
  
  /** Build mode (development or production) */
  mode: BuildMode;
  
  /** Output directory for build artifacts */
  outputDir: string;
  
  /** Optional file naming pattern */
  filePattern?: string;
  
  /** Execute builds in parallel (true) or sequentially (false) */
  parallel: boolean;
  
  /** Enable incremental builds for faster iteration */
  incremental: boolean;
  
  /** Generate source maps for debugging */
  sourceMaps: boolean;
  
  /** Minify output for production builds */
  minify: boolean;
  
  /** Validation options */
  validation: ValidationOptions;
  
  /** iOS-specific build options */
  ios?: iOSBuildOptions;
  
  /** Android-specific build options */
  android?: AndroidBuildOptions;
  
  /** Web-specific build options */
  web?: WebBuildOptions;
}

/**
 * Default build configuration
 */
export const DEFAULT_BUILD_CONFIG: BuildConfig = {
  platforms: ['web'],
  mode: 'development',
  outputDir: './dist',
  parallel: false,
  incremental: true,
  sourceMaps: true,
  minify: false,
  validation: {
    interfaces: true,
    tokens: true,
    mathematical: true,
  },
};
