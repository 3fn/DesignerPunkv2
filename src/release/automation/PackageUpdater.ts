/**
 * PackageUpdater - Updates version in package.json files
 * 
 * Handles:
 * - Single package.json updates
 * - Multiple package.json files for monorepo scenarios
 * - Atomic updates with rollback on failure
 * 
 * Requirements: 1.1, 1.4, 4.1
 */

import * as fs from 'fs';
import * as path from 'path';

export interface PackageJsonData {
  name?: string;
  version: string;
  [key: string]: any;
}

export interface PackageUpdateResult {
  success: boolean;
  updatedFiles: string[];
  errors: PackageUpdateError[];
  rollbackPerformed: boolean;
}

export interface PackageUpdateError {
  file: string;
  error: string;
  code: string;
}

export interface PackageBackup {
  file: string;
  content: string;
}

export class PackageUpdater {
  private backups: Map<string, PackageBackup> = new Map();

  /**
   * Update version in a single package.json file
   * 
   * @param packagePath - Path to package.json file
   * @param newVersion - New semantic version (e.g., "1.2.3")
   * @returns Update result with success status
   */
  async updatePackageVersion(
    packagePath: string,
    newVersion: string
  ): Promise<PackageUpdateResult> {
    const result: PackageUpdateResult = {
      success: false,
      updatedFiles: [],
      errors: [],
      rollbackPerformed: false
    };

    try {
      // Validate version format
      if (!this.isValidSemanticVersion(newVersion)) {
        result.errors.push({
          file: packagePath,
          error: `Invalid semantic version format: ${newVersion}`,
          code: 'INVALID_VERSION'
        });
        return result;
      }

      // Check if file exists
      if (!fs.existsSync(packagePath)) {
        result.errors.push({
          file: packagePath,
          error: 'Package.json file not found',
          code: 'FILE_NOT_FOUND'
        });
        return result;
      }

      // Read and parse package.json
      const content = fs.readFileSync(packagePath, 'utf-8');
      let packageData: PackageJsonData;
      
      try {
        packageData = JSON.parse(content);
      } catch (parseError) {
        result.errors.push({
          file: packagePath,
          error: `Failed to parse package.json: ${parseError}`,
          code: 'PARSE_ERROR'
        });
        return result;
      }

      // Create backup before modification
      this.createBackup(packagePath, content);

      // Update version
      const oldVersion = packageData.version;
      packageData.version = newVersion;

      // Write updated package.json with formatting
      const updatedContent = JSON.stringify(packageData, null, 2) + '\n';
      fs.writeFileSync(packagePath, updatedContent, 'utf-8');

      result.success = true;
      result.updatedFiles.push(packagePath);

      console.log(`✅ Updated ${packagePath}: ${oldVersion} → ${newVersion}`);

      return result;

    } catch (error) {
      result.errors.push({
        file: packagePath,
        error: `Unexpected error: ${error}`,
        code: 'UNEXPECTED_ERROR'
      });

      // Attempt rollback on failure
      await this.rollback();
      result.rollbackPerformed = true;

      return result;
    }
  }

  /**
   * Update version in multiple package.json files (monorepo scenario)
   * 
   * @param packagePaths - Array of paths to package.json files
   * @param newVersion - New semantic version
   * @returns Update result with all files processed
   */
  async updateMultiplePackages(
    packagePaths: string[],
    newVersion: string
  ): Promise<PackageUpdateResult> {
    const result: PackageUpdateResult = {
      success: true,
      updatedFiles: [],
      errors: [],
      rollbackPerformed: false
    };

    // Clear previous backups
    this.backups.clear();

    // Validate version format first
    if (!this.isValidSemanticVersion(newVersion)) {
      result.success = false;
      result.errors.push({
        file: 'all',
        error: `Invalid semantic version format: ${newVersion}`,
        code: 'INVALID_VERSION'
      });
      return result;
    }

    // Process each package.json file
    for (const packagePath of packagePaths) {
      try {
        // Check if file exists
        if (!fs.existsSync(packagePath)) {
          result.errors.push({
            file: packagePath,
            error: 'Package.json file not found',
            code: 'FILE_NOT_FOUND'
          });
          result.success = false;
          continue;
        }

        // Read and parse package.json
        const content = fs.readFileSync(packagePath, 'utf-8');
        let packageData: PackageJsonData;
        
        try {
          packageData = JSON.parse(content);
        } catch (parseError) {
          result.errors.push({
            file: packagePath,
            error: `Failed to parse package.json: ${parseError}`,
            code: 'PARSE_ERROR'
          });
          result.success = false;
          continue;
        }

        // Create backup before modification
        this.createBackup(packagePath, content);

        // Update version
        const oldVersion = packageData.version;
        packageData.version = newVersion;

        // Write updated package.json with formatting
        const updatedContent = JSON.stringify(packageData, null, 2) + '\n';
        fs.writeFileSync(packagePath, updatedContent, 'utf-8');

        result.updatedFiles.push(packagePath);
        console.log(`✅ Updated ${packagePath}: ${oldVersion} → ${newVersion}`);

      } catch (error) {
        result.errors.push({
          file: packagePath,
          error: `Unexpected error: ${error}`,
          code: 'UNEXPECTED_ERROR'
        });
        result.success = false;
      }
    }

    // If any errors occurred, rollback all changes
    if (!result.success) {
      await this.rollback();
      result.rollbackPerformed = true;
      result.updatedFiles = []; // Clear updated files since rollback occurred
    }

    return result;
  }

  /**
   * Validate semantic version format
   * 
   * @param version - Version string to validate
   * @returns True if valid semantic version
   */
  private isValidSemanticVersion(version: string): boolean {
    // Semantic versioning regex: MAJOR.MINOR.PATCH with optional pre-release and build metadata
    const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    return semverRegex.test(version);
  }

  /**
   * Create backup of package.json before modification
   * 
   * @param filePath - Path to package.json file
   * @param content - Original file content
   */
  private createBackup(filePath: string, content: string): void {
    this.backups.set(filePath, {
      file: filePath,
      content: content
    });
  }

  /**
   * Rollback all changes by restoring from backups
   * 
   * @returns Promise that resolves when rollback is complete
   */
  async rollback(): Promise<void> {
    console.log('🔄 Rolling back package.json changes...');

    for (const [filePath, backup] of this.backups.entries()) {
      try {
        fs.writeFileSync(filePath, backup.content, 'utf-8');
        console.log(`✅ Rolled back ${filePath}`);
      } catch (error) {
        console.error(`❌ Failed to rollback ${filePath}: ${error}`);
      }
    }

    this.backups.clear();
  }

  /**
   * Clear all backups without rolling back
   */
  clearBackups(): void {
    this.backups.clear();
  }

  /**
   * Get current backups (for testing/debugging)
   */
  getBackups(): Map<string, PackageBackup> {
    return new Map(this.backups);
  }
}
