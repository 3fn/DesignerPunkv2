/**
 * ChangelogManager - Writes and updates CHANGELOG.md files
 * 
 * Handles:
 * - Creating CHANGELOG.md if it doesn't exist
 * - Prepending new releases at the top
 * - Maintaining proper markdown formatting
 * - Preserving existing changelog content
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */

import * as fs from 'fs';
import * as path from 'path';

export interface ChangelogEntry {
  version: string;
  date: string;
  content: string;
}

export interface ChangelogUpdateResult {
  success: boolean;
  changelogPath: string;
  created: boolean;
  errors: ChangelogError[];
}

export interface ChangelogError {
  error: string;
  code: string;
}

export class ChangelogManager {
  private readonly defaultHeader = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`;

  /**
   * Update CHANGELOG.md with new release entry
   * 
   * @param changelogPath - Path to CHANGELOG.md file
   * @param entry - New changelog entry to prepend
   * @returns Update result with success status
   */
  async updateChangelog(
    changelogPath: string,
    entry: ChangelogEntry
  ): Promise<ChangelogUpdateResult> {
    const result: ChangelogUpdateResult = {
      success: false,
      changelogPath,
      created: false,
      errors: []
    };

    try {
      // Check if CHANGELOG.md exists
      const changelogExists = fs.existsSync(changelogPath);

      if (!changelogExists) {
        // Create new CHANGELOG.md
        await this.createChangelog(changelogPath, entry);
        result.created = true;
        result.success = true;
        console.log(`✅ Created ${changelogPath} with version ${entry.version}`);
        return result;
      }

      // Read existing CHANGELOG.md
      const existingContent = fs.readFileSync(changelogPath, 'utf-8');

      // Check if version already exists
      if (this.versionExists(existingContent, entry.version)) {
        result.errors.push({
          error: `Version ${entry.version} already exists in CHANGELOG.md`,
          code: 'VERSION_EXISTS'
        });
        return result;
      }

      // Prepend new entry
      const updatedContent = this.prependEntry(existingContent, entry);

      // Write updated CHANGELOG.md
      fs.writeFileSync(changelogPath, updatedContent, 'utf-8');

      result.success = true;
      console.log(`✅ Updated ${changelogPath} with version ${entry.version}`);

      return result;

    } catch (error) {
      result.errors.push({
        error: `Failed to update CHANGELOG.md: ${error}`,
        code: 'UPDATE_ERROR'
      });
      return result;
    }
  }

  /**
   * Create new CHANGELOG.md file with initial entry
   * 
   * @param changelogPath - Path where CHANGELOG.md should be created
   * @param entry - Initial changelog entry
   */
  private async createChangelog(
    changelogPath: string,
    entry: ChangelogEntry
  ): Promise<void> {
    // Ensure directory exists
    const dir = path.dirname(changelogPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Format entry
    const formattedEntry = this.formatEntry(entry);

    // Create CHANGELOG.md with header and first entry
    const content = this.defaultHeader + formattedEntry;

    fs.writeFileSync(changelogPath, content, 'utf-8');
  }

  /**
   * Prepend new entry to existing CHANGELOG.md content
   * 
   * @param existingContent - Current CHANGELOG.md content
   * @param entry - New entry to prepend
   * @returns Updated CHANGELOG.md content
   */
  private prependEntry(
    existingContent: string,
    entry: ChangelogEntry
  ): string {
    // Format the new entry
    const formattedEntry = this.formatEntry(entry);

    // Find where to insert (after header, before first version)
    const lines = existingContent.split('\n');
    let insertIndex = 0;

    // Skip header lines (# Changelog, description, etc.)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Found first version entry (starts with ## [version] or ## version)
      if (line.startsWith('## [') || (line.startsWith('## ') && /\d+\.\d+\.\d+/.test(line))) {
        insertIndex = i;
        break;
      }
      
      // If we reach the end without finding a version, insert after header
      if (i === lines.length - 1) {
        insertIndex = i + 1;
      }
    }

    // Insert new entry
    const beforeInsert = lines.slice(0, insertIndex).join('\n');
    const afterInsert = lines.slice(insertIndex).join('\n');

    // Add spacing if needed
    const spacing = insertIndex > 0 && !beforeInsert.endsWith('\n\n') ? '\n' : '';

    return beforeInsert + spacing + formattedEntry + '\n' + afterInsert;
  }

  /**
   * Format changelog entry as markdown
   * 
   * @param entry - Entry to format
   * @returns Formatted markdown string
   */
  private formatEntry(entry: ChangelogEntry): string {
    const { version, date, content } = entry;

    // Format: ## [version] - date
    const header = `## [${version}] - ${date}`;

    // Ensure content doesn't have extra leading/trailing whitespace
    const trimmedContent = content.trim();

    return `${header}\n\n${trimmedContent}\n`;
  }

  /**
   * Check if version already exists in CHANGELOG.md
   * 
   * @param content - CHANGELOG.md content
   * @param version - Version to check
   * @returns True if version exists
   */
  private versionExists(content: string, version: string): boolean {
    // Check for version in format: ## [version] or ## version
    const versionPattern1 = new RegExp(`^## \\[${this.escapeRegex(version)}\\]`, 'm');
    const versionPattern2 = new RegExp(`^## ${this.escapeRegex(version)}`, 'm');
    
    return versionPattern1.test(content) || versionPattern2.test(content);
  }

  /**
   * Escape special regex characters
   * 
   * @param str - String to escape
   * @returns Escaped string
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Get default CHANGELOG.md path for a project
   * 
   * @param projectRoot - Project root directory
   * @returns Path to CHANGELOG.md
   */
  getDefaultChangelogPath(projectRoot: string): string {
    return path.join(projectRoot, 'CHANGELOG.md');
  }

  /**
   * Validate changelog entry
   * 
   * @param entry - Entry to validate
   * @returns True if valid
   */
  validateEntry(entry: ChangelogEntry): boolean {
    // Check version format (semantic versioning)
    const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    
    if (!semverRegex.test(entry.version)) {
      return false;
    }

    // Check date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(entry.date)) {
      return false;
    }

    // Check content is not empty
    if (!entry.content || entry.content.trim().length === 0) {
      return false;
    }

    return true;
  }

  /**
   * Read existing CHANGELOG.md content
   * 
   * @param changelogPath - Path to CHANGELOG.md
   * @returns Changelog content or null if doesn't exist
   */
  readChangelog(changelogPath: string): string | null {
    if (!fs.existsSync(changelogPath)) {
      return null;
    }

    return fs.readFileSync(changelogPath, 'utf-8');
  }
}
