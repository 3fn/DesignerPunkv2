/**
 * npm Publisher
 * 
 * Handles npm registry authentication, package publishing, validation, and error handling.
 * Provides rollback capabilities and retry logic for reliable package publishing.
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import {
  PackagePublish,
  PublishResult,
  ReleaseError
} from '../types/ReleaseTypes';

export interface NpmConfig {
  /** npm registry URL */
  registry?: string;
  
  /** npm authentication token */
  token?: string;
  
  /** Request timeout in milliseconds */
  timeout?: number;
  
  /** Maximum retry attempts */
  maxRetries?: number;
  
  /** Retry delay in milliseconds */
  retryDelay?: number;
  
  /** Dry run mode (don't actually publish) */
  dryRun?: boolean;
  
  /** OTP (One-Time Password) for 2FA */
  otp?: string;
}

export interface NpmAuthStatus {
  authenticated: boolean;
  username?: string;
  email?: string;
  registry: string;
}

export interface PackageInfo {
  name: string;
  version: string;
  exists: boolean;
  publishedVersions: string[];
}

export class NpmPublisher {
  private config: NpmConfig;
  private authenticated: boolean = false;

  constructor(config: NpmConfig = {}) {
    this.config = {
      registry: 'https://registry.npmjs.org/',
      timeout: 60000,
      maxRetries: 3,
      retryDelay: 2000,
      dryRun: false,
      ...config
    };
  }

  /**
   * Validate npm authentication
   */
  async validateAuthentication(): Promise<NpmAuthStatus> {
    try {
      // Check if user is logged in
      const whoami = this.execNpmCommand('whoami', { throwOnError: false });
      
      if (whoami.success && whoami.stdout) {
        const username = whoami.stdout.trim();
        
        // Get user profile to verify authentication
        const profile = this.execNpmCommand(`profile get --json`, { throwOnError: false });
        
        let email: string | undefined;
        if (profile.success && profile.stdout) {
          try {
            const profileData = JSON.parse(profile.stdout);
            email = profileData.email;
          } catch {
            // Profile parsing failed, continue without email
          }
        }
        
        this.authenticated = true;
        return {
          authenticated: true,
          username,
          email,
          registry: this.config.registry || 'https://registry.npmjs.org/'
        };
      }
      
      this.authenticated = false;
      return {
        authenticated: false,
        registry: this.config.registry || 'https://registry.npmjs.org/'
      };
    } catch (error) {
      this.authenticated = false;
      throw new Error(`npm authentication validation failed: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * Check if package version already exists in registry
   */
  async packageVersionExists(packageName: string, version: string): Promise<boolean> {
    try {
      const result = this.execNpmCommand(
        `view ${packageName}@${version} version --json`,
        { throwOnError: false }
      );
      
      return result.success && result.stdout.trim() !== '';
    } catch {
      return false;
    }
  }

  /**
   * Get package information from registry
   */
  async getPackageInfo(packageName: string): Promise<PackageInfo> {
    try {
      const result = this.execNpmCommand(
        `view ${packageName} versions --json`,
        { throwOnError: false }
      );
      
      if (result.success && result.stdout) {
        try {
          const versions = JSON.parse(result.stdout);
          const publishedVersions = Array.isArray(versions) ? versions : [versions];
          
          return {
            name: packageName,
            version: publishedVersions[publishedVersions.length - 1] || '0.0.0',
            exists: publishedVersions.length > 0,
            publishedVersions
          };
        } catch {
          // Package doesn't exist or parsing failed
          return {
            name: packageName,
            version: '0.0.0',
            exists: false,
            publishedVersions: []
          };
        }
      }
      
      return {
        name: packageName,
        version: '0.0.0',
        exists: false,
        publishedVersions: []
      };
    } catch (error) {
      throw new Error(`Failed to get package info: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * Validate package before publishing
   */
  async validatePackage(pkg: PackagePublish): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    // Check if package.json exists
    const packageJsonPath = path.join(pkg.path, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      errors.push(`package.json not found at ${packageJsonPath}`);
      return { valid: false, errors };
    }
    
    // Read and validate package.json
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      // Validate name matches
      if (packageJson.name !== pkg.name) {
        errors.push(`Package name mismatch: expected ${pkg.name}, got ${packageJson.name}`);
      }
      
      // Validate version matches
      if (packageJson.version !== pkg.version) {
        errors.push(`Version mismatch: expected ${pkg.version}, got ${packageJson.version}`);
      }
      
      // Check for required fields
      if (!packageJson.name) {
        errors.push('Package name is required');
      }
      if (!packageJson.version) {
        errors.push('Package version is required');
      }
      
      // Validate version format
      if (packageJson.version && !this.isValidSemver(packageJson.version)) {
        errors.push(`Invalid semver version: ${packageJson.version}`);
      }
    } catch (error) {
      errors.push(`Failed to read package.json: ${this.getErrorMessage(error)}`);
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Publish package to npm registry
   */
  async publishPackage(pkg: PackagePublish): Promise<PublishResult> {
    const startTime = Date.now();
    
    try {
      // Validate authentication
      if (!this.authenticated) {
        const authStatus = await this.validateAuthentication();
        if (!authStatus.authenticated) {
          throw new Error('Not authenticated with npm registry. Run "npm login" first.');
        }
      }
      
      // Validate package
      const validation = await this.validatePackage(pkg);
      if (!validation.valid) {
        throw new Error(`Package validation failed: ${validation.errors.join(', ')}`);
      }
      
      // Check if version already exists
      const versionExists = await this.packageVersionExists(pkg.name, pkg.version);
      if (versionExists) {
        throw new Error(`Package ${pkg.name}@${pkg.version} already exists in registry`);
      }
      
      // Publish with retry logic
      const result = await this.publishWithRetry(pkg);
      
      return result;
    } catch (error) {
      return {
        success: false,
        packageName: pkg.name,
        version: pkg.version,
        error: this.getErrorMessage(error)
      };
    }
  }

  /**
   * Publish multiple packages
   */
  async publishPackages(packages: PackagePublish[]): Promise<PublishResult[]> {
    const results: PublishResult[] = [];
    
    for (const pkg of packages) {
      const result = await this.publishPackage(pkg);
      results.push(result);
      
      // If a package fails and it's not in dry-run mode, stop publishing
      if (!result.success && !this.config.dryRun) {
        // Add remaining packages as failed
        const remainingPackages = packages.slice(packages.indexOf(pkg) + 1);
        for (const remaining of remainingPackages) {
          results.push({
            success: false,
            packageName: remaining.name,
            version: remaining.version,
            error: 'Publishing stopped due to previous failure'
          });
        }
        break;
      }
    }
    
    return results;
  }

  /**
   * Unpublish package version (for rollback)
   */
  async unpublishPackage(packageName: string, version: string): Promise<boolean> {
    try {
      // Check if version exists
      const exists = await this.packageVersionExists(packageName, version);
      if (!exists) {
        throw new Error(`Package ${packageName}@${version} does not exist in registry`);
      }
      
      // Unpublish the specific version
      const result = this.execNpmCommand(
        `unpublish ${packageName}@${version} --force`,
        { throwOnError: true }
      );
      
      return result.success;
    } catch (error) {
      throw new Error(`Failed to unpublish package: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * Publish package with retry logic
   */
  private async publishWithRetry(
    pkg: PackagePublish,
    attempt: number = 1
  ): Promise<PublishResult> {
    try {
      // Build publish command
      let command = `publish ${pkg.path}`;
      
      // Add access flag
      if (pkg.access) {
        command += ` --access ${pkg.access}`;
      }
      
      // Add registry if specified
      if (pkg.registry) {
        command += ` --registry ${pkg.registry}`;
      }
      
      // Add OTP if specified
      if (this.config.otp) {
        command += ` --otp ${this.config.otp}`;
      }
      
      // Add dry-run flag if enabled
      if (this.config.dryRun) {
        command += ` --dry-run`;
      }
      
      // Execute publish command
      const result = this.execNpmCommand(command, { throwOnError: true });
      
      // Get package URL
      const packageUrl = `${pkg.registry || this.config.registry}package/${pkg.name}`;
      
      return {
        success: true,
        packageName: pkg.name,
        version: pkg.version,
        url: packageUrl
      };
    } catch (error) {
      // Retry if not at max attempts
      if (attempt < (this.config.maxRetries || 3)) {
        await this.delay(this.config.retryDelay || 2000);
        return this.publishWithRetry(pkg, attempt + 1);
      }
      
      throw error;
    }
  }

  /**
   * Execute npm command
   */
  private execNpmCommand(
    command: string,
    options: { throwOnError?: boolean } = {}
  ): { success: boolean; stdout: string; stderr: string } {
    const { throwOnError = false } = options;
    
    try {
      // Build full command with registry if specified
      let fullCommand = `npm ${command}`;
      if (this.config.registry && !command.includes('--registry')) {
        fullCommand += ` --registry ${this.config.registry}`;
      }
      
      const stdout = execSync(fullCommand, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: this.config.timeout
      });
      
      return {
        success: true,
        stdout: stdout || '',
        stderr: ''
      };
    } catch (error: any) {
      const stderr = error.stderr?.toString() || '';
      const stdout = error.stdout?.toString() || '';
      
      if (throwOnError) {
        throw new Error(`npm command failed: ${stderr || error.message}`);
      }
      
      return {
        success: false,
        stdout,
        stderr
      };
    }
  }

  /**
   * Validate semver version format
   */
  private isValidSemver(version: string): boolean {
    const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    return semverRegex.test(version);
  }

  /**
   * Get error message from various error types
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as any).message);
    }
    return 'Unknown error occurred';
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
