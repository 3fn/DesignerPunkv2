/**
 * @category evergreen
 * @purpose Verify NPM publisher handles package publishing correctly
 */

import { NpmPublisher, NpmConfig } from '../publishers/NpmPublisher';
import { PackagePublish } from '../types';
import { execSync } from 'child_process';
import * as fs from 'fs';
import { NpmMockHelper } from './helpers/NpmMockHelper';

jest.mock('child_process');
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('NpmPublisher', () => {
  let publisher: NpmPublisher;
  let config: NpmConfig;
  let npmHelper: NpmMockHelper;

  beforeEach(() => {
    jest.clearAllMocks();
    config = { registry: 'https://registry.npmjs.org/', timeout: 60000, maxRetries: 3, retryDelay: 100, dryRun: false };
    publisher = new NpmPublisher(config);
    npmHelper = new NpmMockHelper(mockExecSync);
  });

  afterEach(() => { mockExecSync.mockReset(); });

  describe('validateAuthentication', () => {
    it('should return authenticated status when user is logged in', async () => {
      mockExecSync.mockReturnValueOnce('testuser\n' as any);
      mockExecSync.mockReturnValueOnce(JSON.stringify({ email: 'test@example.com' }) as any);
      const result = await publisher.validateAuthentication();
      expect(result.authenticated).toBe(true);
      expect(result.username).toBe('testuser');
      expect(result.email).toBe('test@example.com');
      expect(result.registry).toBe('https://registry.npmjs.org/');
    });

    it('should return unauthenticated status when user is not logged in', async () => {
      mockExecSync.mockImplementationOnce(() => { throw new Error('Not logged in'); });
      const result = await publisher.validateAuthentication();
      expect(result.authenticated).toBe(false);
      expect(result.username).toBeUndefined();
    });

    it('should handle profile parsing errors gracefully', async () => {
      mockExecSync.mockReturnValueOnce('testuser\n' as any);
      mockExecSync.mockReturnValueOnce('invalid json' as any);
      const result = await publisher.validateAuthentication();
      expect(result.authenticated).toBe(true);
      expect(result.username).toBe('testuser');
      expect(result.email).toBeUndefined();
    });
  });

  describe('packageVersionExists', () => {
    it('should return true when package version exists', async () => {
      mockExecSync.mockReturnValueOnce('"1.0.0"\n' as any);
      expect(await publisher.packageVersionExists('@test/package', '1.0.0')).toBe(true);
    });

    it('should return false when package version does not exist', async () => {
      mockExecSync.mockImplementationOnce(() => { throw new Error('Package not found'); });
      expect(await publisher.packageVersionExists('@test/package', '1.0.0')).toBe(false);
    });
  });

  describe('getPackageInfo', () => {
    it('should return package info for existing package', async () => {
      mockExecSync.mockReturnValueOnce(JSON.stringify(['1.0.0', '1.1.0', '2.0.0']) as any);
      const info = await publisher.getPackageInfo('@test/package');
      expect(info.name).toBe('@test/package');
      expect(info.exists).toBe(true);
      expect(info.version).toBe('2.0.0');
      expect(info.publishedVersions).toEqual(['1.0.0', '1.1.0', '2.0.0']);
    });

    it('should return default info for non-existent package', async () => {
      mockExecSync.mockImplementationOnce(() => { throw new Error('Package not found'); });
      const info = await publisher.getPackageInfo('@test/package');
      expect(info.exists).toBe(false);
      expect(info.version).toBe('0.0.0');
    });

    it('should handle single version response', async () => {
      mockExecSync.mockReturnValueOnce('"1.0.0"' as any);
      const info = await publisher.getPackageInfo('@test/package');
      expect(info.publishedVersions).toEqual(['1.0.0']);
    });
  });

  describe('validatePackage', () => {
    const testPackage: PackagePublish = { name: '@test/package', version: '1.0.0', path: '/test/path', registry: 'https://registry.npmjs.org/', access: 'public' };

    it('should validate package successfully', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({ name: '@test/package', version: '1.0.0' }));
      const result = await publisher.validatePackage(testPackage);
      expect(result.valid).toBe(true);
    });

    it('should fail validation when package.json is missing', async () => {
      mockFs.existsSync.mockReturnValue(false);
      const result = await publisher.validatePackage(testPackage);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('package.json not found at /test/path/package.json');
    });

    it('should fail validation when package name mismatches', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({ name: '@different/package', version: '1.0.0' }));
      const result = await publisher.validatePackage(testPackage);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Package name mismatch: expected @test/package, got @different/package');
    });

    it('should fail validation when version mismatches', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({ name: '@test/package', version: '2.0.0' }));
      const result = await publisher.validatePackage(testPackage);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Version mismatch: expected 1.0.0, got 2.0.0');
    });

    it('should fail validation for invalid semver', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({ name: '@test/package', version: 'invalid-version' }));
      const result = await publisher.validatePackage({ ...testPackage, version: 'invalid-version' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid semver version: invalid-version');
    });
  });

  describe('publishPackage', () => {
    const testPackage: PackagePublish = { name: '@test/package', version: '1.0.0', path: '/test/path', registry: 'https://registry.npmjs.org/', access: 'public' };

    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({ name: '@test/package', version: '1.0.0' }));
    });

    it('should publish package successfully', async () => {
      npmHelper.mockPublishSuccess('@test/package', '1.0.0');
      const result = await publisher.publishPackage(testPackage);
      expect(result.success).toBe(true);
      expect(result.packageName).toBe('@test/package');
      expect(result.version).toBe('1.0.0');
    });

    it('should fail when package version already exists', async () => {
      npmHelper.mockPackageExists('@test/package', '1.0.0');
      const result = await publisher.publishPackage(testPackage);
      expect(result.success).toBe(false);
      expect(result.error).toContain('already exists in registry');
    });

    it('should fail when not authenticated', async () => {
      jest.clearAllMocks();
      const unauthPublisher = new NpmPublisher(config);
      const unauthHelper = new NpmMockHelper(mockExecSync);
      unauthHelper.mockAuthenticationFailure();
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({ name: '@test/package', version: '1.0.0' }));
      const result = await unauthPublisher.publishPackage(testPackage);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Not authenticated');
    });

    it('should retry on publish failure', async () => {
      jest.clearAllMocks();
      const testHelper = new NpmMockHelper(mockExecSync);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({ name: '@test/package', version: '1.0.0' }));
      testHelper.mockPublishWithRetry('@test/package', '1.0.0', 1);
      const result = await publisher.publishPackage(testPackage);
      expect(result.success).toBe(true);
    });

    it('should include access flag in publish command', async () => {
      mockExecSync.mockReset();
      const freshPublisher = new NpmPublisher(config);
      const testHelper = new NpmMockHelper(mockExecSync);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({ name: '@test/package', version: '1.0.0' }));
      testHelper.mockPublishSuccess('@test/package', '1.0.0');
      await freshPublisher.publishPackage(testPackage);
      const publishCall = mockExecSync.mock.calls.find((call) => call[0].toString().includes('publish') && call[0].toString().includes('--access'));
      expect(publishCall).toBeDefined();
      expect(publishCall![0]).toContain('--access public');
    });
  });

  describe('publishPackages', () => {
    const packages: PackagePublish[] = [
      { name: '@test/package1', version: '1.0.0', path: '/test/path1', registry: 'https://registry.npmjs.org/', access: 'public' },
      { name: '@test/package2', version: '1.0.0', path: '/test/path2', registry: 'https://registry.npmjs.org/', access: 'public' },
    ];

    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation((path) => {
        if (path.toString().includes('path1')) return JSON.stringify({ name: '@test/package1', version: '1.0.0' });
        return JSON.stringify({ name: '@test/package2', version: '1.0.0' });
      });
    });

    it('should publish multiple packages successfully', async () => {
      mockExecSync.mockReset();
      const freshPublisher = new NpmPublisher(config);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation((path) => {
        const pathStr = path.toString();
        if (pathStr.includes('path1')) return JSON.stringify({ name: '@test/package1', version: '1.0.0' });
        if (pathStr.includes('path2')) return JSON.stringify({ name: '@test/package2', version: '1.0.0' });
        return JSON.stringify({ name: '@test/unknown', version: '1.0.0' });
      });
      const testHelper = new NpmMockHelper(mockExecSync);
      testHelper.mockPublishSuccess('@test/package1', '1.0.0');
      mockExecSync.mockReturnValueOnce('' as any);
      mockExecSync.mockReturnValueOnce(`+ @test/package2@1.0.0\n` as any);
      const results = await freshPublisher.publishPackages(packages);
      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
    });

    it('should stop publishing on first failure', async () => {
      jest.clearAllMocks();
      mockExecSync.mockReturnValueOnce('testuser\n' as any);
      mockExecSync.mockReturnValueOnce(JSON.stringify({ email: 'test@example.com' }) as any);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation((path) => {
        if (path.toString().includes('package1')) return JSON.stringify({ name: '@test/package1', version: '1.0.0' });
        return JSON.stringify({ name: '@test/package2', version: '1.0.0' });
      });
      mockExecSync.mockReturnValueOnce('' as any);
      mockExecSync.mockImplementationOnce(() => { throw new Error('Publish failed'); });
      mockExecSync.mockImplementationOnce(() => { throw new Error('Publish failed'); });
      mockExecSync.mockImplementationOnce(() => { throw new Error('Publish failed'); });
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
      testHelper.mockUnpublish('@test/package', '1.0.0');
      const result = await publisher.unpublishPackage('@test/package', '1.0.0');
      expect(result).toBe(true);
    });

    it('should fail when package version does not exist', async () => {
      mockExecSync.mockReset();
      mockExecSync.mockReturnValueOnce('' as any);
      await expect(publisher.unpublishPackage('@test/package', '1.0.0')).rejects.toThrow('does not exist in registry');
    });

    it('should fail when unpublish command fails', async () => {
      mockExecSync.mockReset();
      const testHelper = new NpmMockHelper(mockExecSync);
      testHelper.mockUnpublishFailure('Unpublish failed', '@test/package', '1.0.0');
      await expect(publisher.unpublishPackage('@test/package', '1.0.0')).rejects.toThrow('Failed to unpublish package');
    });
  });

  describe('dry run mode', () => {
    it('should not actually publish in dry run mode', async () => {
      jest.clearAllMocks();
      const dryRunPublisher = new NpmPublisher({ ...config, dryRun: true });
      const dryRunHelper = new NpmMockHelper(mockExecSync);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({ name: '@test/package', version: '1.0.0' }));
      dryRunHelper.mockPublishSuccess('@test/package', '1.0.0');
      const result = await dryRunPublisher.publishPackage({ name: '@test/package', version: '1.0.0', path: '/test/path', registry: 'https://registry.npmjs.org/', access: 'public' });
      expect(result.success).toBe(true);
      const publishCall = mockExecSync.mock.calls.find((call) => call[0].toString().includes('publish'));
      expect(publishCall![0]).toContain('--dry-run');
    });
  });
});
