import { TargetPlatform, OutputFormat } from '../types/TranslationOutput';

/**
 * Base interface for path organization providers
 * Defines consistent contract for organizing tokens into platform-specific file structures
 */
export interface PathProvider {
  /**
   * Platform identifier for this path provider
   */
  readonly platform: TargetPlatform;

  /**
   * Get the base directory for token files on this platform
   * @returns Base directory path
   */
  getBaseDirectory(): string;

  /**
   * Get the complete file path for a token file
   * @param format - Output format for the file
   * @param options - Optional path generation options
   * @returns Complete file path
   */
  getFilePath(format: OutputFormat, options?: PathOptions): string;

  /**
   * Get the directory structure for organizing token files
   * @returns Array of subdirectory paths
   */
  getDirectoryStructure(): string[];

  /**
   * Get the file naming pattern for this platform
   * @param format - Output format
   * @returns File name with extension
   */
  getFileName(format: OutputFormat): string;

  /**
   * Get build system integration configuration
   * @returns Build system integration details
   */
  getBuildSystemIntegration(): BuildSystemConfig;

  /**
   * Validate that the file path follows platform conventions
   * @param filePath - File path to validate
   * @returns Validation result
   */
  validatePath(filePath: string): { valid: boolean; errors?: string[] };

  /**
   * Optimize file organization for platform-specific build systems
   * @param files - Array of file paths to optimize
   * @returns Optimized file organization
   */
  optimizeForBuildSystem(files: string[]): OptimizedFileStructure;
}

/**
 * Options for path generation
 */
export interface PathOptions {
  /** Include subdirectories in path */
  includeSubdirectories?: boolean;
  
  /** Custom base directory override */
  customBaseDirectory?: string;
  
  /** Group files by category */
  groupByCategory?: boolean;
  
  /** Additional path customization */
  customOptions?: Record<string, any>;
}

/**
 * Build system integration configuration
 */
export interface BuildSystemConfig {
  /** Build system type (webpack, gradle, xcode, etc.) */
  buildSystemType: string;
  
  /** Import/require patterns for the platform */
  importPatterns: string[];
  
  /** File watching patterns */
  watchPatterns?: string[];
  
  /** Tree-shaking optimization hints */
  treeShakingHints?: string[];
  
  /** Additional build configuration */
  additionalConfig?: Record<string, any>;
}

/**
 * Optimized file structure for build system integration
 */
export interface OptimizedFileStructure {
  /** Primary token file path */
  primaryFile: string;
  
  /** Additional supporting files */
  supportingFiles?: string[];
  
  /** Recommended import path */
  importPath: string;
  
  /** Build optimization recommendations */
  optimizations: string[];
}

/**
 * Abstract base class providing common path organization functionality
 */
export abstract class BasePathProvider implements PathProvider {
  abstract readonly platform: TargetPlatform;

  abstract getBaseDirectory(): string;
  abstract getFileName(format: OutputFormat): string;
  abstract getBuildSystemIntegration(): BuildSystemConfig;

  getFilePath(format: OutputFormat, options: PathOptions = {}): string {
    const {
      includeSubdirectories = true,
      customBaseDirectory,
      groupByCategory = false
    } = options;

    const baseDir = customBaseDirectory || this.getBaseDirectory();
    const fileName = this.getFileName(format);

    if (!includeSubdirectories) {
      return `${baseDir}/${fileName}`;
    }

    const subdirs = this.getDirectoryStructure();
    const subdirPath = subdirs.length > 0 ? `/${subdirs.join('/')}` : '';

    return `${baseDir}${subdirPath}/${fileName}`;
  }

  getDirectoryStructure(): string[] {
    // Default implementation returns empty array (flat structure)
    // Override in platform-specific implementations if needed
    return [];
  }

  validatePath(filePath: string): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    // Basic validation
    if (!filePath || filePath.trim() === '') {
      errors.push('File path cannot be empty');
    }

    if (filePath.includes('..')) {
      errors.push('File path cannot contain parent directory references (..)');
    }

    if (filePath.startsWith('/')) {
      errors.push('File path should be relative, not absolute');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  optimizeForBuildSystem(files: string[]): OptimizedFileStructure {
    // Default implementation - override in platform-specific implementations
    const primaryFile = files[0] || '';
    const buildConfig = this.getBuildSystemIntegration();

    return {
      primaryFile,
      supportingFiles: files.slice(1),
      importPath: this.getImportPath(primaryFile),
      optimizations: buildConfig.treeShakingHints || []
    };
  }

  protected getImportPath(filePath: string): string {
    // Remove file extension and convert to import path
    return filePath.replace(/\.[^/.]+$/, '').replace(/\\/g, '/');
  }

  protected ensureExtension(fileName: string, extension: string): string {
    if (!fileName.endsWith(extension)) {
      return `${fileName}${extension}`;
    }
    return fileName;
  }
}
