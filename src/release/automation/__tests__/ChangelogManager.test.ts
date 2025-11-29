/**
 * Tests for ChangelogManager
 * 
 * Validates:
 * - CHANGELOG.md creation
 * - Entry prepending
 * - Version duplicate detection
 * - Markdown formatting
 * - Error handling
 * 
 * Mock Strategy:
 * - No external mocks: Tests use real file system operations
 * - Isolated test directory: Each test uses unique temporary directory
 * - Real CHANGELOG operations: Validates actual file creation and updates
 */

import { ChangelogManager, ChangelogEntry } from '../ChangelogManager';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('ChangelogManager', () => {
  let manager: ChangelogManager;
  let testDir: string;
  let changelogPath: string;

  beforeEach(() => {
    manager = new ChangelogManager();
    
    // Create temporary test directory
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'changelog-test-'));
    changelogPath = path.join(testDir, 'CHANGELOG.md');
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('updateChangelog', () => {
    it('should create new CHANGELOG.md if it does not exist', async () => {
      const entry: ChangelogEntry = {
        version: '1.0.0',
        date: '2025-11-26',
        content: '### Features\n\n- Initial release'
      };

      const result = await manager.updateChangelog(changelogPath, entry);

      expect(result.success).toBe(true);
      expect(result.created).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(fs.existsSync(changelogPath)).toBe(true);

      const content = fs.readFileSync(changelogPath, 'utf-8');
      expect(content).toContain('# Changelog');
      expect(content).toContain('## [1.0.0] - 2025-11-26');
      expect(content).toContain('### Features');
      expect(content).toContain('- Initial release');
    });

    it('should prepend new entry to existing CHANGELOG.md', async () => {
      // Create initial CHANGELOG.md
      const initialEntry: ChangelogEntry = {
        version: '1.0.0',
        date: '2025-11-20',
        content: '### Features\n\n- Initial release'
      };
      await manager.updateChangelog(changelogPath, initialEntry);

      // Add new entry
      const newEntry: ChangelogEntry = {
        version: '1.1.0',
        date: '2025-11-26',
        content: '### Features\n\n- New feature added'
      };
      const result = await manager.updateChangelog(changelogPath, newEntry);

      expect(result.success).toBe(true);
      expect(result.created).toBe(false);
      expect(result.errors).toHaveLength(0);

      const content = fs.readFileSync(changelogPath, 'utf-8');
      
      // New entry should come before old entry
      const newEntryIndex = content.indexOf('## [1.1.0]');
      const oldEntryIndex = content.indexOf('## [1.0.0]');
      expect(newEntryIndex).toBeLessThan(oldEntryIndex);
      expect(newEntryIndex).toBeGreaterThan(0);
    });

    it('should detect duplicate versions', async () => {
      // Create initial entry
      const entry: ChangelogEntry = {
        version: '1.0.0',
        date: '2025-11-20',
        content: '### Features\n\n- Initial release'
      };
      await manager.updateChangelog(changelogPath, entry);

      // Try to add same version again
      const duplicateEntry: ChangelogEntry = {
        version: '1.0.0',
        date: '2025-11-26',
        content: '### Features\n\n- Duplicate entry'
      };
      const result = await manager.updateChangelog(changelogPath, duplicateEntry);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('VERSION_EXISTS');
      expect(result.errors[0].error).toContain('already exists');
    });

    it('should handle multiple entries correctly', async () => {
      const entries: ChangelogEntry[] = [
        {
          version: '1.0.0',
          date: '2025-11-20',
          content: '### Features\n\n- Initial release'
        },
        {
          version: '1.1.0',
          date: '2025-11-21',
          content: '### Features\n\n- Feature A'
        },
        {
          version: '1.2.0',
          date: '2025-11-22',
          content: '### Features\n\n- Feature B'
        }
      ];

      // Add entries in order
      for (const entry of entries) {
        const result = await manager.updateChangelog(changelogPath, entry);
        expect(result.success).toBe(true);
      }

      const content = fs.readFileSync(changelogPath, 'utf-8');

      // Verify order (newest first)
      const v120Index = content.indexOf('## [1.2.0]');
      const v110Index = content.indexOf('## [1.1.0]');
      const v100Index = content.indexOf('## [1.0.0]');

      expect(v120Index).toBeLessThan(v110Index);
      expect(v110Index).toBeLessThan(v100Index);
    });

    it('should preserve existing content when prepending', async () => {
      // Create initial CHANGELOG with custom content
      const initialContent = `# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-11-20

### Features

- Initial release
- Feature X
- Feature Y

### Bug Fixes

- Fixed bug A
`;
      fs.writeFileSync(changelogPath, initialContent, 'utf-8');

      // Add new entry
      const newEntry: ChangelogEntry = {
        version: '1.1.0',
        date: '2025-11-26',
        content: '### Features\n\n- New feature'
      };
      await manager.updateChangelog(changelogPath, newEntry);

      const content = fs.readFileSync(changelogPath, 'utf-8');

      // Verify old content is preserved
      expect(content).toContain('- Initial release');
      expect(content).toContain('- Feature X');
      expect(content).toContain('- Feature Y');
      expect(content).toContain('- Fixed bug A');
      
      // Verify new content is added
      expect(content).toContain('## [1.1.0] - 2025-11-26');
      expect(content).toContain('- New feature');
    });

    it('should handle pre-release versions', async () => {
      const entry: ChangelogEntry = {
        version: '1.0.0-alpha.1',
        date: '2025-11-26',
        content: '### Features\n\n- Alpha release'
      };

      const result = await manager.updateChangelog(changelogPath, entry);

      expect(result.success).toBe(true);
      
      const content = fs.readFileSync(changelogPath, 'utf-8');
      expect(content).toContain('## [1.0.0-alpha.1] - 2025-11-26');
    });

    it('should handle breaking changes section', async () => {
      const entry: ChangelogEntry = {
        version: '2.0.0',
        date: '2025-11-26',
        content: `### 🚨 Breaking Changes

- Removed deprecated API
- Changed function signature

### Features

- New API introduced`
      };

      const result = await manager.updateChangelog(changelogPath, entry);

      expect(result.success).toBe(true);
      
      const content = fs.readFileSync(changelogPath, 'utf-8');
      expect(content).toContain('### 🚨 Breaking Changes');
      expect(content).toContain('- Removed deprecated API');
    });
  });

  describe('validateEntry', () => {
    it('should validate correct entry', () => {
      const entry: ChangelogEntry = {
        version: '1.0.0',
        date: '2025-11-26',
        content: '### Features\n\n- Feature A'
      };

      expect(manager.validateEntry(entry)).toBe(true);
    });

    it('should reject invalid version format', () => {
      const entry: ChangelogEntry = {
        version: 'v1.0.0', // Invalid: has 'v' prefix
        date: '2025-11-26',
        content: '### Features\n\n- Feature A'
      };

      expect(manager.validateEntry(entry)).toBe(false);
    });

    it('should reject invalid date format', () => {
      const entry: ChangelogEntry = {
        version: '1.0.0',
        date: '11/26/2025', // Invalid: not YYYY-MM-DD
        content: '### Features\n\n- Feature A'
      };

      expect(manager.validateEntry(entry)).toBe(false);
    });

    it('should reject empty content', () => {
      const entry: ChangelogEntry = {
        version: '1.0.0',
        date: '2025-11-26',
        content: ''
      };

      expect(manager.validateEntry(entry)).toBe(false);
    });

    it('should accept pre-release versions', () => {
      const entries: ChangelogEntry[] = [
        {
          version: '1.0.0-alpha.1',
          date: '2025-11-26',
          content: '### Features\n\n- Alpha'
        },
        {
          version: '1.0.0-beta.2',
          date: '2025-11-26',
          content: '### Features\n\n- Beta'
        },
        {
          version: '1.0.0-rc.1',
          date: '2025-11-26',
          content: '### Features\n\n- RC'
        }
      ];

      entries.forEach(entry => {
        expect(manager.validateEntry(entry)).toBe(true);
      });
    });
  });

  describe('getDefaultChangelogPath', () => {
    it('should return correct default path', () => {
      const projectRoot = '/path/to/project';
      const expectedPath = path.join(projectRoot, 'CHANGELOG.md');

      expect(manager.getDefaultChangelogPath(projectRoot)).toBe(expectedPath);
    });
  });

  describe('readChangelog', () => {
    it('should read existing CHANGELOG.md', () => {
      const content = '# Changelog\n\n## [1.0.0] - 2025-11-26\n\n### Features\n\n- Feature A';
      fs.writeFileSync(changelogPath, content, 'utf-8');

      const result = manager.readChangelog(changelogPath);

      expect(result).toBe(content);
    });

    it('should return null for non-existent CHANGELOG.md', () => {
      const result = manager.readChangelog(changelogPath);

      expect(result).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle CHANGELOG.md with no existing versions', async () => {
      // Create CHANGELOG with only header
      const headerOnly = `# Changelog

All notable changes to this project will be documented in this file.

`;
      fs.writeFileSync(changelogPath, headerOnly, 'utf-8');

      const entry: ChangelogEntry = {
        version: '1.0.0',
        date: '2025-11-26',
        content: '### Features\n\n- First feature'
      };

      const result = await manager.updateChangelog(changelogPath, entry);

      expect(result.success).toBe(true);
      
      const content = fs.readFileSync(changelogPath, 'utf-8');
      expect(content).toContain('## [1.0.0] - 2025-11-26');
    });

    it('should create directory if it does not exist', async () => {
      const nestedPath = path.join(testDir, 'nested', 'dir', 'CHANGELOG.md');

      const entry: ChangelogEntry = {
        version: '1.0.0',
        date: '2025-11-26',
        content: '### Features\n\n- Feature A'
      };

      const result = await manager.updateChangelog(nestedPath, entry);

      expect(result.success).toBe(true);
      expect(fs.existsSync(nestedPath)).toBe(true);
    });

    it('should handle content with special characters', async () => {
      const entry: ChangelogEntry = {
        version: '1.0.0',
        date: '2025-11-26',
        content: '### Features\n\n- Feature with `code`\n- Feature with **bold**\n- Feature with [link](https://example.com)'
      };

      const result = await manager.updateChangelog(changelogPath, entry);

      expect(result.success).toBe(true);
      
      const content = fs.readFileSync(changelogPath, 'utf-8');
      expect(content).toContain('`code`');
      expect(content).toContain('**bold**');
      expect(content).toContain('[link](https://example.com)');
    });

    it('should handle very long content', async () => {
      const longContent = Array(100)
        .fill(0)
        .map((_, i) => `- Feature ${i}`)
        .join('\n');

      const entry: ChangelogEntry = {
        version: '1.0.0',
        date: '2025-11-26',
        content: `### Features\n\n${longContent}`
      };

      const result = await manager.updateChangelog(changelogPath, entry);

      expect(result.success).toBe(true);
      
      const content = fs.readFileSync(changelogPath, 'utf-8');
      expect(content).toContain('- Feature 0');
      expect(content).toContain('- Feature 99');
    });
  });

  describe('error handling', () => {
    it('should handle file system errors gracefully', async () => {
      // Try to write to a read-only location (simulate permission error)
      const readOnlyPath = '/root/CHANGELOG.md'; // Typically not writable

      const entry: ChangelogEntry = {
        version: '1.0.0',
        date: '2025-11-26',
        content: '### Features\n\n- Feature A'
      };

      const result = await manager.updateChangelog(readOnlyPath, entry);

      // Should fail gracefully
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
