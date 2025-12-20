/**
 * @category evergreen
 * @purpose Verify release system functionality works correctly
 */
/**
 * Tests for PackageUpdater
 * 
 * Validates:
 * - Single package.json updates
 * - Multiple package.json updates (monorepo)
 * - Atomic updates with rollback on failure
 * - Version format validation
 * - Error handling
 * 
 * Mock Strategy:
 * - No external mocks: Tests use real file system operations
 * - Isolated test directory: Each test uses unique temporary directory
 * - Real package.json operations: Validates actual file updates and rollback
 */

import * as fs from 'fs';
import * as path from 'path';
import { PackageUpdater } from '../PackageUpdater';

describe('PackageUpdater', () => {
  let updater: PackageUpdater;
  let testDir: string;

  beforeEach(() => {
    updater = new PackageUpdater();
    testDir = path.join(__dirname, '__test-packages__');
    
    // Create test directory
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('updatePackageVersion', () => {
    it('should update version in a single package.json file', async () => {
      // Arrange
      const packagePath = path.join(testDir, 'package.json');
      const originalPackage = {
        name: 'test-package',
        version: '1.0.0',
        description: 'Test package'
      };
      fs.writeFileSync(packagePath, JSON.stringify(originalPackage, null, 2));

      // Act
      const result = await updater.updatePackageVersion(packagePath, '1.1.0');

      // Assert
      expect(result.success).toBe(true);
      expect(result.updatedFiles).toEqual([packagePath]);
      expect(result.errors).toHaveLength(0);
      expect(result.rollbackPerformed).toBe(false);

      // Verify file content
      const updatedContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(updatedContent.version).toBe('1.1.0');
      expect(updatedContent.name).toBe('test-package');
      expect(updatedContent.description).toBe('Test package');
    });

    it('should preserve package.json formatting', async () => {
      // Arrange
      const packagePath = path.join(testDir, 'package.json');
      const originalPackage = {
        name: 'test-package',
        version: '1.0.0',
        scripts: {
          test: 'jest',
          build: 'tsc'
        }
      };
      fs.writeFileSync(packagePath, JSON.stringify(originalPackage, null, 2));

      // Act
      await updater.updatePackageVersion(packagePath, '2.0.0');

      // Assert
      const updatedContent = fs.readFileSync(packagePath, 'utf-8');
      expect(updatedContent).toContain('"version": "2.0.0"');
      expect(updatedContent).toContain('"test": "jest"');
      expect(updatedContent).toContain('"build": "tsc"');
    });

    it('should reject invalid semantic version format', async () => {
      // Arrange
      const packagePath = path.join(testDir, 'package.json');
      const originalPackage = { name: 'test', version: '1.0.0' };
      fs.writeFileSync(packagePath, JSON.stringify(originalPackage, null, 2));

      // Act
      const result = await updater.updatePackageVersion(packagePath, 'invalid-version');

      // Assert
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('INVALID_VERSION');
      expect(result.errors[0].error).toContain('Invalid semantic version format');
    });

    it('should handle missing package.json file', async () => {
      // Arrange
      const packagePath = path.join(testDir, 'nonexistent.json');

      // Act
      const result = await updater.updatePackageVersion(packagePath, '1.0.0');

      // Assert
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('FILE_NOT_FOUND');
    });

    it('should handle malformed package.json', async () => {
      // Arrange
      const packagePath = path.join(testDir, 'package.json');
      fs.writeFileSync(packagePath, '{ invalid json }');

      // Act
      const result = await updater.updatePackageVersion(packagePath, '1.0.0');

      // Assert
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('PARSE_ERROR');
    });

    it('should support pre-release versions', async () => {
      // Arrange
      const packagePath = path.join(testDir, 'package.json');
      const originalPackage = { name: 'test', version: '1.0.0' };
      fs.writeFileSync(packagePath, JSON.stringify(originalPackage, null, 2));

      // Act
      const result = await updater.updatePackageVersion(packagePath, '1.1.0-alpha.1');

      // Assert
      expect(result.success).toBe(true);
      const updatedContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(updatedContent.version).toBe('1.1.0-alpha.1');
    });

    it('should support build metadata in versions', async () => {
      // Arrange
      const packagePath = path.join(testDir, 'package.json');
      const originalPackage = { name: 'test', version: '1.0.0' };
      fs.writeFileSync(packagePath, JSON.stringify(originalPackage, null, 2));

      // Act
      const result = await updater.updatePackageVersion(packagePath, '1.1.0+build.123');

      // Assert
      expect(result.success).toBe(true);
      const updatedContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(updatedContent.version).toBe('1.1.0+build.123');
    });
  });

  describe('updateMultiplePackages', () => {
    it('should update version in multiple package.json files', async () => {
      // Arrange
      const package1Path = path.join(testDir, 'package1', 'package.json');
      const package2Path = path.join(testDir, 'package2', 'package.json');
      
      fs.mkdirSync(path.dirname(package1Path), { recursive: true });
      fs.mkdirSync(path.dirname(package2Path), { recursive: true });
      
      fs.writeFileSync(package1Path, JSON.stringify({ name: 'pkg1', version: '1.0.0' }, null, 2));
      fs.writeFileSync(package2Path, JSON.stringify({ name: 'pkg2', version: '1.0.0' }, null, 2));

      // Act
      const result = await updater.updateMultiplePackages(
        [package1Path, package2Path],
        '2.0.0'
      );

      // Assert
      expect(result.success).toBe(true);
      expect(result.updatedFiles).toHaveLength(2);
      expect(result.updatedFiles).toContain(package1Path);
      expect(result.updatedFiles).toContain(package2Path);
      expect(result.errors).toHaveLength(0);

      // Verify both files updated
      const pkg1 = JSON.parse(fs.readFileSync(package1Path, 'utf-8'));
      const pkg2 = JSON.parse(fs.readFileSync(package2Path, 'utf-8'));
      expect(pkg1.version).toBe('2.0.0');
      expect(pkg2.version).toBe('2.0.0');
    });

    it('should rollback all changes if any update fails', async () => {
      // Arrange
      const package1Path = path.join(testDir, 'package1', 'package.json');
      const package2Path = path.join(testDir, 'package2', 'package.json');
      const package3Path = path.join(testDir, 'nonexistent', 'package.json');
      
      fs.mkdirSync(path.dirname(package1Path), { recursive: true });
      fs.mkdirSync(path.dirname(package2Path), { recursive: true });
      
      fs.writeFileSync(package1Path, JSON.stringify({ name: 'pkg1', version: '1.0.0' }, null, 2));
      fs.writeFileSync(package2Path, JSON.stringify({ name: 'pkg2', version: '1.0.0' }, null, 2));

      // Act
      const result = await updater.updateMultiplePackages(
        [package1Path, package2Path, package3Path],
        '2.0.0'
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.rollbackPerformed).toBe(true);
      expect(result.updatedFiles).toHaveLength(0); // All rolled back
      expect(result.errors.length).toBeGreaterThan(0);

      // Verify rollback - versions should remain unchanged
      const pkg1 = JSON.parse(fs.readFileSync(package1Path, 'utf-8'));
      const pkg2 = JSON.parse(fs.readFileSync(package2Path, 'utf-8'));
      expect(pkg1.version).toBe('1.0.0');
      expect(pkg2.version).toBe('1.0.0');
    });

    it('should handle empty package list', async () => {
      // Act
      const result = await updater.updateMultiplePackages([], '1.0.0');

      // Assert
      expect(result.success).toBe(true);
      expect(result.updatedFiles).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid version for multiple packages', async () => {
      // Arrange
      const package1Path = path.join(testDir, 'package1', 'package.json');
      fs.mkdirSync(path.dirname(package1Path), { recursive: true });
      fs.writeFileSync(package1Path, JSON.stringify({ name: 'pkg1', version: '1.0.0' }, null, 2));

      // Act
      const result = await updater.updateMultiplePackages([package1Path], 'bad-version');

      // Assert
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('INVALID_VERSION');
      
      // Verify no changes made
      const pkg1 = JSON.parse(fs.readFileSync(package1Path, 'utf-8'));
      expect(pkg1.version).toBe('1.0.0');
    });

    it('should handle mix of valid and invalid files', async () => {
      // Arrange
      const validPath = path.join(testDir, 'valid', 'package.json');
      const invalidPath = path.join(testDir, 'invalid', 'package.json');
      
      fs.mkdirSync(path.dirname(validPath), { recursive: true });
      fs.mkdirSync(path.dirname(invalidPath), { recursive: true });
      
      fs.writeFileSync(validPath, JSON.stringify({ name: 'valid', version: '1.0.0' }, null, 2));
      fs.writeFileSync(invalidPath, '{ bad json }');

      // Act
      const result = await updater.updateMultiplePackages(
        [validPath, invalidPath],
        '2.0.0'
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.rollbackPerformed).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
      
      // Verify rollback - valid file should remain unchanged
      const validPkg = JSON.parse(fs.readFileSync(validPath, 'utf-8'));
      expect(validPkg.version).toBe('1.0.0');
    });
  });

  describe('rollback', () => {
    it('should restore original content on rollback', async () => {
      // Arrange
      const packagePath = path.join(testDir, 'package.json');
      const originalContent = JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2);
      fs.writeFileSync(packagePath, originalContent);

      // Manually create backup and modify file
      const content = fs.readFileSync(packagePath, 'utf-8');
      updater['createBackup'](packagePath, content);
      
      const modified = JSON.parse(content);
      modified.version = '2.0.0';
      fs.writeFileSync(packagePath, JSON.stringify(modified, null, 2));

      // Act
      await updater.rollback();

      // Assert
      const restoredContent = fs.readFileSync(packagePath, 'utf-8');
      expect(restoredContent).toBe(originalContent);
    });

    it('should clear backups after rollback', async () => {
      // Arrange
      const packagePath = path.join(testDir, 'package.json');
      fs.writeFileSync(packagePath, JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2));
      
      const content = fs.readFileSync(packagePath, 'utf-8');
      updater['createBackup'](packagePath, content);

      // Act
      await updater.rollback();

      // Assert
      expect(updater.getBackups().size).toBe(0);
    });
  });

  describe('clearBackups', () => {
    it('should clear backups without rolling back', async () => {
      // Arrange
      const packagePath = path.join(testDir, 'package.json');
      fs.writeFileSync(packagePath, JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2));
      
      const content = fs.readFileSync(packagePath, 'utf-8');
      updater['createBackup'](packagePath, content);
      
      // Modify file
      const modified = JSON.parse(content);
      modified.version = '2.0.0';
      fs.writeFileSync(packagePath, JSON.stringify(modified, null, 2));

      // Act
      updater.clearBackups();

      // Assert
      expect(updater.getBackups().size).toBe(0);
      
      // Verify file still has modified version
      const currentContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(currentContent.version).toBe('2.0.0');
    });
  });

  describe('version validation', () => {
    it('should accept valid semantic versions', async () => {
      const packagePath = path.join(testDir, 'package.json');
      fs.writeFileSync(packagePath, JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2));

      const validVersions = [
        '0.0.1',
        '1.0.0',
        '1.2.3',
        '10.20.30',
        '1.0.0-alpha',
        '1.0.0-alpha.1',
        '1.0.0-0.3.7',
        '1.0.0-x.7.z.92',
        '1.0.0+20130313144700',
        '1.0.0-beta+exp.sha.5114f85'
      ];

      for (const version of validVersions) {
        const result = await updater.updatePackageVersion(packagePath, version);
        expect(result.success).toBe(true);
      }
    });

    it('should reject invalid semantic versions', async () => {
      const packagePath = path.join(testDir, 'package.json');
      fs.writeFileSync(packagePath, JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2));

      const invalidVersions = [
        '1',
        '1.2',
        'v1.2.3',
        '1.2.3.4',
        '01.2.3',
        '1.02.3',
        '1.2.03',
        'not-a-version',
        ''
      ];

      for (const version of invalidVersions) {
        const result = await updater.updatePackageVersion(packagePath, version);
        expect(result.success).toBe(false);
        expect(result.errors[0].code).toBe('INVALID_VERSION');
      }
    });
  });
});
