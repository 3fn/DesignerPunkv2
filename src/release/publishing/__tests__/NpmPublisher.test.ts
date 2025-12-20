/**
 * @category evergreen
 * @purpose Verify NPM publisher handles package publishing correctly
 */
/**
 * NpmPublisher Tests
 * 
 * Mock Strategy:
 * - NpmMockHelper: Provides consistent mock sequencing for npm commands
 * - jest.mock for fs (file system operations)
 * - No shared state between tests
 * - Each test creates fresh mocks with clearAllMocks in beforeEach
 */

import { NpmPublisher, NpmConfig } from '../NpmPublisher';
import { PackagePublish } from '../../types/ReleaseTypes';
import { execSync } from 'child_process';
import * as fs from 'fs';
import { NpmMockHelper } from './helpers/NpmMockHelper';

// Mock child_process
jest.mock('child_process');
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

// Mock fs
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('NpmPublisher', () => {
  let publisher: NpmPublisher;
  let config: NpmConfig;
  let npmHelper: NpmMockHelper;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Default config
    config = {
      registry: 'https://registry.npmjs.org/',
      timeout: 60000,
      maxRetries: 3,
      retryDelay: 100, // Shorter delay for tests
      dryRun: false
    };
    
    publisher = new NpmPublisher(config);
    npmHelper = new NpmMockHelper(mockExecSync);
  });

  afterEach(() => {
    // Reset mock implementations to prevent pollution between tests
    mockExecSync.mockReset();
  });

  describe('validateAuthentication', () => {
    it('should return authenticated status when user is logged in', async () => {
      // Mock successful whoami command
      mockExecSync.mockReturnValueOnce('testuser\n' as any);
      
      // Mock successful profile command
      mockExecSync.mockReturnValueOnce(JSON.stringify({
        email: 'test@example.com'
      }) as any);
      
      const result = await publisher.validateAuthentication();

      
      expect(result.authenticated).toBe(true);
      expect(result.username).toBe('testuser');
      expect(result.email).toBe('test@example.com');
      expect(result.registry).toBe('https://registry.npmjs.org/');
    });

    it('should return unauthenticated status when user is not logged in', async () => {
      // Mock failed whoami command
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Not logged in');
      });
      
      const result = await publisher.validateAuthentication();
      
      expect(result.authenticated).toBe(false);
      expect(result.username).toBeUndefined();
    });

    it('should handle profile parsing errors gracefully', async () => {
      // Mock successful whoami
      mockExecSync.mockReturnValueOnce('testuser\n' as any);
      
      // Mock profile command with invalid JSON
      mockExecSync.mockReturnValueOnce('invalid json' as any);
      
      const result = await publisher.validateAuthentication();
      
      expect(result.authenticated).toBe(true);
      expect(result.username).toBe('testuser');
      expect(result.email).toBeUndefined();
    });
  });

  describe('packageVersionExists', () => {
    it('should return true when package version exists', async () => {
      // Mock successful npm view command
      mockExecSync.mockReturnValueOnce('"1.0.0"\n' as any);
      
      const exists = await publisher.packageVersionExists('@test/package', '1.0.0');
      
      expect(exists).toBe(true);
    });

    it('should return false when package version does not exist', async () => {
      // Mock failed npm view command
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Package not found');
      });
      
      const exists = await publisher.packageVersionExists('@test/package', '1.0.0');
      
      expect(exists).toBe(false);
    });
  });

  describe('getPackageInfo', () => {
    it('should return package info for existing package', async () => {
      // Mock npm view command returning versions
      mockExecSync.mockReturnValueOnce(JSON.stringify(['1.0.0', '1.1.0', '2.0.0']) as any);
      
      const info = await publisher.getPackageInfo('@test/package');
      
      expect(info.name).toBe('@test/package');
      expect(info.exists).toBe(true);
      expect(info.version).toBe('2.0.0');
      expect(info.publishedVersions).toEqual(['1.0.0', '1.1.0', '2.0.0']);
    });

    it('should return default info for non-existent package', async () => {
      // Mock failed npm view command
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Package not found');
      });
      
      const info = await publisher.getPackageInfo('@test/package');
      
      expect(info.name).toBe('@test/package');
      expect(info.exists).toBe(false);
      expect(info.version).toBe('0.0.0');
      expect(info.publishedVersions).toEqual([]);
    });

    it('should handle single version response', async () => {
      // Mock npm view command returning single version (not array)
      mockExecSync.mockReturnValueOnce('"1.0.0"' as any);
      
      const info = await publisher.getPackageInfo('@test/package');
      
      expect(info.publishedVersions).toEqual(['1.0.0']);
    });
  });


  describe('validatePackage', () => {
    const testPackage: PackagePublish = {
      name: '@test/package',
      version: '1.0.0',
      path: '/test/path',
      registry: 'https://registry.npmjs.org/',
      access: 'public'
    };

    it('should validate package successfully', async () => {
      // Mock package.json exists
      mockFs.existsSync.mockReturnValue(true);
      
      // Mock package.json content
      mockFs.readFileSync.mockReturnValue(JSON.stringify({
        name: '@test/package',
        version: '1.0.0'
      }));
      
      const result = await publisher.validatePackage(testPackage);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail validation when package.json is missing', async () => {
      // Mock package.json does not exist
      mockFs.existsSync.mockReturnValue(false);
      
      const result = await publisher.validatePackage(testPackage);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('package.json not found at /test/path/package.json');
    });

    it('should fail validation when package name mismatches', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({
        name: '@different/package',
        version: '1.0.0'
      }));
      
      const result = await publisher.validatePackage(testPackage);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Package name mismatch: expected @test/package, got @different/package');
    });

    it('should fail validation when version mismatches', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({
        name: '@test/package',
        version: '2.0.0'
      }));
      
      const result = await publisher.validatePackage(testPackage);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Version mismatch: expected 1.0.0, got 2.0.0');
    });

    it('should fail validation for invalid semver', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({
        name: '@test/package',
        version: 'invalid-version'
      }));
      
      const result = await publisher.validatePackage({
        ...testPackage,
        version: 'invalid-version'
      });
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid semver version: invalid-version');
    });
  });


  describe('publishPackage', () => {
    const testPackage: PackagePublish = {
      name: '@test/package',
      version: '1.0.0',
      path: '/test/path',
      registry: 'https://registry.npmjs.org/',
      access: 'public'
    };

    beforeEach(() => {
      // Mock package validation
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({
        name: '@test/package',
        version: '1.0.0'
      }));
    });

    it('should publish package successfully', async () => {
      // Use helper to mock complete publish sequence
      npmHelper.mockPublishSuccess('@test/package', '1.0.0');
      
      const result = await publisher.publishPackage(testPackage);
      
      expect(result.success).toBe(true);
      expect(result.packageName).toBe('@test/package');
      expect(result.version).toBe('1.0.0');
      expect(result.url).toContain('@test/package');
    });

    it('should fail when package version already exists', async () => {
      // Use helper to mock package exists scenario
      npmHelper.mockPackageExists('@test/package', '1.0.0');
      
      const result = await publisher.publishPackage(testPackage);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('already exists in registry');
    });

    it('should fail when not authenticated', async () => {
      // Create publisher without authentication
      jest.clearAllMocks();
      const unauthPublisher = new NpmPublisher(config);
      const unauthHelper = new NpmMockHelper(mockExecSync);
      
      // Mock failed authentication using helper
      unauthHelper.mockAuthenticationFailure();
      
      // Mock package validation
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({
        name: '@test/package',
        version: '1.0.0'
      }));
      
      const result = await unauthPublisher.publishPackage(testPackage);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Not authenticated');
    });

    it('should retry on publish failure', async () => {
      jest.clearAllMocks();
      const testHelper = new NpmMockHelper(mockExecSync);
      
      // Mock package validation
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({
        name: '@test/package',
        version: '1.0.0'
      }));
      
      // Use helper to mock publish with retry (1 failure, then success)
      testHelper.mockPublishWithRetry('@test/package', '1.0.0', 1);
      
      const result = await publisher.publishPackage(testPackage);
      
      expect(result.success).toBe(true);
    });

    it('should include access flag in publish command', async () => {
      // Reset mocks to ensure clean state
      mockExecSync.mockReset();
      
      // Create fresh publisher and helper after reset
      const freshPublisher = new NpmPublisher(config);
      const testHelper = new NpmMockHelper(mockExecSync);
      
      // Mock package validation
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({
        name: '@test/package',
        version: '1.0.0'
      }));
      
      // Use helper to mock complete publish sequence
      testHelper.mockPublishSuccess('@test/package', '1.0.0');
      
      await freshPublisher.publishPackage(testPackage);
      
      // Check that publish command includes access flag
      const publishCall = mockExecSync.mock.calls.find(call => 
        call[0].toString().includes('publish') && call[0].toString().includes('--access')
      );
      expect(publishCall).toBeDefined();
      expect(publishCall![0]).toContain('--access public');
    });
  });


  describe('publishPackages', () => {
    const packages: PackagePublish[] = [
      {
        name: '@test/package1',
        version: '1.0.0',
        path: '/test/path1',
        registry: 'https://registry.npmjs.org/',
        access: 'public'
      },
      {
        name: '@test/package2',
        version: '1.0.0',
        path: '/test/path2',
        registry: 'https://registry.npmjs.org/',
        access: 'public'
      }
    ];

    beforeEach(() => {
      // Mock package validation
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation((path) => {
        if (path.toString().includes('package1')) {
          return JSON.stringify({ name: '@test/package1', version: '1.0.0' });
        }
        return JSON.stringify({ name: '@test/package2', version: '1.0.0' });
      });
    });

    it('should publish multiple packages successfully', async () => {
      // Reset mocks to ensure clean state
      mockExecSync.mockReset();
      
      // Create fresh publisher to reset authentication state
      const freshPublisher = new NpmPublisher(config);
      
      // Mock package validation - match actual paths (path1 and path2)
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation((path) => {
        const pathStr = path.toString();
        if (pathStr.includes('path1')) {
          return JSON.stringify({ name: '@test/package1', version: '1.0.0' });
        }
        if (pathStr.includes('path2')) {
          return JSON.stringify({ name: '@test/package2', version: '1.0.0' });
        }
        return JSON.stringify({ name: '@test/unknown', version: '1.0.0' });
      });
      
      // Create fresh helper after clearing mocks
      const testHelper = new NpmMockHelper(mockExecSync);
      
      // Package 1 needs full auth + validation + publish sequence (4 calls)
      testHelper.mockPublishSuccess('@test/package1', '1.0.0');
      
      // Package 2 - authentication is cached after package 1, only needs 2 calls
      // npm view (version doesn't exist - returns empty string)
      mockExecSync.mockReturnValueOnce('' as any);
      // npm publish (success)
      mockExecSync.mockReturnValueOnce(`+ @test/package2@1.0.0\n` as any);
      
      const results = await freshPublisher.publishPackages(packages);
      
      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
    });

    it('should stop publishing on first failure', async () => {
      jest.clearAllMocks();
      
      // Mock authentication
      mockExecSync.mockReturnValueOnce('testuser\n' as any);
      mockExecSync.mockReturnValueOnce(JSON.stringify({ email: 'test@example.com' }) as any);
      
      // Mock package validation
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation((path) => {
        if (path.toString().includes('package1')) {
          return JSON.stringify({ name: '@test/package1', version: '1.0.0' });
        }
        return JSON.stringify({ name: '@test/package2', version: '1.0.0' });
      });
      
      // Mock first package version check (doesn't exist)
      mockExecSync.mockReturnValueOnce('' as any);
      
      // Mock first package publish fails
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Publish failed');
      });
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Publish failed');
      });
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Publish failed');
      });
      
      const results = await publisher.publishPackages(packages);
      
      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(false);
      expect(results[1].success).toBe(false);
      expect(results[1].error).toContain('Publishing stopped due to previous failure');
    });
  });

  describe('unpublishPackage', () => {
    it('should unpublish package successfully', async () => {
      jest.clearAllMocks();
      const testHelper = new NpmMockHelper(mockExecSync);
      
      // Use helper to mock successful unpublish
      testHelper.mockUnpublish('@test/package', '1.0.0');
      
      const result = await publisher.unpublishPackage('@test/package', '1.0.0');
      
      expect(result).toBe(true);
    });

    it('should fail when package version does not exist', async () => {
      // Reset mocks to clear any previous implementations
      mockExecSync.mockReset();
      
      // Mock version doesn't exist - packageVersionExists will return false
      // npm view returns empty string when version doesn't exist
      mockExecSync.mockReturnValueOnce('' as any);
      
      await expect(publisher.unpublishPackage('@test/package', '1.0.0'))
        .rejects.toThrow('does not exist in registry');
    });

    it('should fail when unpublish command fails', async () => {
      // Reset mocks to clear any previous implementations
      mockExecSync.mockReset();
      const testHelper = new NpmMockHelper(mockExecSync);
      
      // Use helper to mock unpublish failure
      testHelper.mockUnpublishFailure('Unpublish failed', '@test/package', '1.0.0');
      
      await expect(publisher.unpublishPackage('@test/package', '1.0.0'))
        .rejects.toThrow('Failed to unpublish package');
    });
  });

  describe('dry run mode', () => {
    it('should not actually publish in dry run mode', async () => {
      jest.clearAllMocks();
      
      const dryRunPublisher = new NpmPublisher({ ...config, dryRun: true });
      const dryRunHelper = new NpmMockHelper(mockExecSync);
      
      // Mock package validation
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({
        name: '@test/package',
        version: '1.0.0'
      }));
      
      // Use helper to mock successful publish (dry run still uses same sequence)
      dryRunHelper.mockPublishSuccess('@test/package', '1.0.0');
      
      const testPackage: PackagePublish = {
        name: '@test/package',
        version: '1.0.0',
        path: '/test/path',
        registry: 'https://registry.npmjs.org/',
        access: 'public'
      };
      
      const result = await dryRunPublisher.publishPackage(testPackage);
      
      expect(result.success).toBe(true);
      
      // Verify --dry-run flag was included
      const publishCall = mockExecSync.mock.calls.find(call => 
        call[0].toString().includes('publish')
      );
      expect(publishCall![0]).toContain('--dry-run');
    });
  });
});
