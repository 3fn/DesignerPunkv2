/**
 * npm Publisher for Release Tool
 *
 * Handles npm registry publishing, validation, and rollback.
 * Extracted from src/release/publishing/NpmPublisher.ts.
 * Gated behind npmPublishEnabled config flag.
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { PackagePublish, PublishResult } from '../types';

export interface NpmConfig {
  registry?: string;
  token?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  dryRun?: boolean;
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
      timeout: 60000, maxRetries: 3, retryDelay: 2000, dryRun: false,
      ...config,
    };
  }

  async validateAuthentication(): Promise<NpmAuthStatus> {
    try {
      const whoami = this.execNpmCommand('whoami', { throwOnError: false });
      if (whoami.success && whoami.stdout) {
        const username = whoami.stdout.trim();
        const profile = this.execNpmCommand('profile get --json', { throwOnError: false });
        let email: string | undefined;
        if (profile.success && profile.stdout) {
          try { email = JSON.parse(profile.stdout).email; } catch { /* ignore */ }
        }
        this.authenticated = true;
        return { authenticated: true, username, email, registry: this.config.registry || 'https://registry.npmjs.org/' };
      }
      this.authenticated = false;
      return { authenticated: false, registry: this.config.registry || 'https://registry.npmjs.org/' };
    } catch (error) {
      this.authenticated = false;
      throw new Error(`npm authentication validation failed: ${this.getErrorMessage(error)}`);
    }
  }

  async packageVersionExists(packageName: string, version: string): Promise<boolean> {
    try {
      const result = this.execNpmCommand(`view ${packageName}@${version} version --json`, { throwOnError: false });
      return result.success && result.stdout.trim() !== '';
    } catch { return false; }
  }

  async getPackageInfo(packageName: string): Promise<PackageInfo> {
    try {
      const result = this.execNpmCommand(`view ${packageName} versions --json`, { throwOnError: false });
      if (result.success && result.stdout) {
        try {
          const versions = JSON.parse(result.stdout);
          const publishedVersions = Array.isArray(versions) ? versions : [versions];
          return { name: packageName, version: publishedVersions[publishedVersions.length - 1] || '0.0.0', exists: publishedVersions.length > 0, publishedVersions };
        } catch { /* fall through */ }
      }
      return { name: packageName, version: '0.0.0', exists: false, publishedVersions: [] };
    } catch (error) {
      throw new Error(`Failed to get package info: ${this.getErrorMessage(error)}`);
    }
  }

  async validatePackage(pkg: PackagePublish): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    const packageJsonPath = path.join(pkg.path, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      errors.push(`package.json not found at ${packageJsonPath}`);
      return { valid: false, errors };
    }
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      if (packageJson.name !== pkg.name) errors.push(`Package name mismatch: expected ${pkg.name}, got ${packageJson.name}`);
      if (packageJson.version !== pkg.version) errors.push(`Version mismatch: expected ${pkg.version}, got ${packageJson.version}`);
      if (!packageJson.name) errors.push('Package name is required');
      if (!packageJson.version) errors.push('Package version is required');
      if (packageJson.version && !this.isValidSemver(packageJson.version)) errors.push(`Invalid semver version: ${packageJson.version}`);
    } catch (error) {
      errors.push(`Failed to read package.json: ${this.getErrorMessage(error)}`);
    }
    return { valid: errors.length === 0, errors };
  }

  async publishPackage(pkg: PackagePublish): Promise<PublishResult> {
    try {
      if (!this.authenticated) {
        const authStatus = await this.validateAuthentication();
        if (!authStatus.authenticated) throw new Error('Not authenticated with npm registry. Run "npm login" first.');
      }
      const validation = await this.validatePackage(pkg);
      if (!validation.valid) throw new Error(`Package validation failed: ${validation.errors.join(', ')}`);
      const versionExists = await this.packageVersionExists(pkg.name, pkg.version);
      if (versionExists) throw new Error(`Package ${pkg.name}@${pkg.version} already exists in registry`);
      return await this.publishWithRetry(pkg);
    } catch (error) {
      return { success: false, packageName: pkg.name, version: pkg.version, error: this.getErrorMessage(error) };
    }
  }

  async publishPackages(packages: PackagePublish[]): Promise<PublishResult[]> {
    const results: PublishResult[] = [];
    for (const pkg of packages) {
      const result = await this.publishPackage(pkg);
      results.push(result);
      if (!result.success && !this.config.dryRun) {
        for (const remaining of packages.slice(packages.indexOf(pkg) + 1)) {
          results.push({ success: false, packageName: remaining.name, version: remaining.version, error: 'Publishing stopped due to previous failure' });
        }
        break;
      }
    }
    return results;
  }

  async unpublishPackage(packageName: string, version: string): Promise<boolean> {
    try {
      const exists = await this.packageVersionExists(packageName, version);
      if (!exists) throw new Error(`Package ${packageName}@${version} does not exist in registry`);
      const result = this.execNpmCommand(`unpublish ${packageName}@${version} --force`, { throwOnError: true });
      return result.success;
    } catch (error) {
      throw new Error(`Failed to unpublish package: ${this.getErrorMessage(error)}`);
    }
  }

  private async publishWithRetry(pkg: PackagePublish, attempt: number = 1): Promise<PublishResult> {
    try {
      let command = `publish ${pkg.path}`;
      if (pkg.access) command += ` --access ${pkg.access}`;
      if (pkg.registry) command += ` --registry ${pkg.registry}`;
      if (this.config.otp) command += ` --otp ${this.config.otp}`;
      if (this.config.dryRun) command += ` --dry-run`;
      this.execNpmCommand(command, { throwOnError: true });
      return { success: true, packageName: pkg.name, version: pkg.version, url: `${pkg.registry || this.config.registry}package/${pkg.name}` };
    } catch (error) {
      if (attempt < (this.config.maxRetries || 3)) {
        await new Promise((r) => setTimeout(r, this.config.retryDelay || 2000));
        return this.publishWithRetry(pkg, attempt + 1);
      }
      throw error;
    }
  }

  private execNpmCommand(command: string, options: { throwOnError?: boolean } = {}): { success: boolean; stdout: string; stderr: string } {
    try {
      let fullCommand = `npm ${command}`;
      if (this.config.registry && !command.includes('--registry')) fullCommand += ` --registry ${this.config.registry}`;
      const stdout = execSync(fullCommand, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'], timeout: this.config.timeout });
      return { success: true, stdout: stdout || '', stderr: '' };
    } catch (error: any) {
      if (options.throwOnError) throw new Error(`npm command failed: ${error.stderr?.toString() || error.message}`);
      return { success: false, stdout: error.stdout?.toString() || '', stderr: error.stderr?.toString() || '' };
    }
  }

  private isValidSemver(version: string): boolean {
    return /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/.test(version);
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error) return String((error as any).message);
    return 'Unknown error occurred';
  }
}
