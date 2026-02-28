/**
 * @category evergreen
 * @purpose Verify GitHub publisher handles package publishing correctly
 */

import { GitHubPublisher, GitHubConfig } from '../publishers/GitHubPublisher';
import { GitHubRelease, GitTag, Artifact } from '../types';
import * as fs from 'fs';

jest.mock('@octokit/rest');
const { Octokit } = require('@octokit/rest');

jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('GitHubPublisher', () => {
  let publisher: GitHubPublisher;
  let mockOctokit: any;
  let config: GitHubConfig;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOctokit = {
      rest: {
        users: { getAuthenticated: jest.fn() },
        repos: { get: jest.fn(), getReleaseByTag: jest.fn(), createRelease: jest.fn(), deleteRelease: jest.fn(), uploadReleaseAsset: jest.fn() },
        git: { getCommit: jest.fn(), createTag: jest.fn(), createRef: jest.fn(), deleteRef: jest.fn() },
      },
    };
    Octokit.mockImplementation(() => mockOctokit);
    config = { token: 'test-token', owner: 'test-owner', repo: 'test-repo' };
    publisher = new GitHubPublisher(config);
  });

  describe('Authentication', () => {
    it('should validate authentication successfully', async () => {
      mockOctokit.rest.users.getAuthenticated.mockResolvedValue({ data: { login: 'test-user' } });
      const result = await publisher.validateAuthentication();
      expect(result).toBe(true);
      expect(mockOctokit.rest.users.getAuthenticated).toHaveBeenCalled();
    });

    it('should throw error on authentication failure', async () => {
      mockOctokit.rest.users.getAuthenticated.mockRejectedValue(new Error('Invalid token'));
      await expect(publisher.validateAuthentication()).rejects.toThrow('GitHub authentication failed');
    });
  });

  describe('Repository Information', () => {
    it('should get repository information', async () => {
      mockOctokit.rest.repos.get.mockResolvedValue({
        data: { owner: { login: 'test-owner' }, name: 'test-repo', full_name: 'test-owner/test-repo', default_branch: 'main', private: false, html_url: 'https://github.com/test-owner/test-repo' },
      });
      const info = await publisher.getRepositoryInfo();
      expect(info).toEqual({ owner: 'test-owner', name: 'test-repo', fullName: 'test-owner/test-repo', defaultBranch: 'main', private: false, url: 'https://github.com/test-owner/test-repo' });
    });

    it('should throw error when repository not found', async () => {
      mockOctokit.rest.repos.get.mockRejectedValue(new Error('Not Found'));
      await expect(publisher.getRepositoryInfo()).rejects.toThrow('Failed to get repository info');
    });
  });

  describe('Release Existence Check', () => {
    it('should return true when release exists', async () => {
      mockOctokit.rest.repos.getReleaseByTag.mockResolvedValue({ data: { id: 123, tag_name: 'v1.0.0' } });
      expect(await publisher.releaseExists('v1.0.0')).toBe(true);
    });

    it('should return false when release does not exist', async () => {
      mockOctokit.rest.repos.getReleaseByTag.mockRejectedValue({ status: 404, message: 'Not Found' });
      expect(await publisher.releaseExists('v1.0.0')).toBe(false);
    });

    it('should throw error on non-404 errors', async () => {
      mockOctokit.rest.repos.getReleaseByTag.mockRejectedValue(new Error('Server error'));
      await expect(publisher.releaseExists('v1.0.0')).rejects.toThrow('Failed to check if release exists');
    });
  });

  describe('Tag Creation', () => {
    it('should create tags successfully', async () => {
      const tags: GitTag[] = [{ name: 'v1.0.0', message: 'Release v1.0.0', commit: 'abc123' }];
      mockOctokit.rest.git.getCommit.mockResolvedValue({ data: { sha: 'abc123' } });
      mockOctokit.rest.git.createTag.mockResolvedValue({ data: { sha: 'def456' } });
      mockOctokit.rest.git.createRef.mockResolvedValue({ data: { ref: 'refs/tags/v1.0.0' } });
      const results = await publisher.createTags(tags);
      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({ success: true, tagName: 'v1.0.0' });
    });

    it('should handle tag creation failures', async () => {
      mockOctokit.rest.git.getCommit.mockRejectedValue(new Error('Commit not found'));
      const results = await publisher.createTags([{ name: 'v1.0.0', message: 'Release v1.0.0', commit: 'abc123' }]);
      expect(results[0]).toEqual({ success: false, tagName: 'v1.0.0', error: 'Commit not found' });
    });

    it('should create multiple tags', async () => {
      mockOctokit.rest.git.getCommit.mockResolvedValue({ data: { sha: 'abc123' } });
      mockOctokit.rest.git.createTag.mockResolvedValue({ data: { sha: 'tag-sha' } });
      mockOctokit.rest.git.createRef.mockResolvedValue({ data: { ref: 'refs/tags/v1.0.0' } });
      const results = await publisher.createTags([
        { name: 'v1.0.0', message: 'Release v1.0.0', commit: 'abc123' },
        { name: 'v1.0.1', message: 'Release v1.0.1', commit: 'def456' },
      ]);
      expect(results).toHaveLength(2);
      expect(results.every((r) => r.success)).toBe(true);
    });
  });

  describe('Release Creation', () => {
    beforeEach(() => {
      mockOctokit.rest.users.getAuthenticated.mockResolvedValue({ data: { login: 'test-user' } });
    });

    it('should create release successfully', async () => {
      mockOctokit.rest.repos.getReleaseByTag.mockRejectedValue({ status: 404 });
      mockOctokit.rest.repos.createRelease.mockResolvedValue({
        data: { id: 123, tag_name: 'v1.0.0', html_url: 'https://github.com/test-owner/test-repo/releases/tag/v1.0.0' },
      });
      const result = await publisher.createRelease({ tagName: 'v1.0.0', name: 'Release v1.0.0', body: '## Changes\n- Feature 1', draft: false, prerelease: false, artifacts: [] });
      expect(result.success).toBe(true);
      expect(result.version).toBe('v1.0.0');
      expect(result.githubReleaseUrl).toBe('https://github.com/test-owner/test-repo/releases/tag/v1.0.0');
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when release already exists', async () => {
      mockOctokit.rest.repos.getReleaseByTag.mockResolvedValue({ data: { id: 123 } });
      const result = await publisher.createRelease({ tagName: 'v1.0.0', name: 'Release v1.0.0', body: 'Release notes', draft: false, prerelease: false, artifacts: [] });
      expect(result.success).toBe(false);
      expect(result.errors[0].message).toContain('already exists');
    });

    it('should create draft release', async () => {
      mockOctokit.rest.repos.getReleaseByTag.mockRejectedValue({ status: 404 });
      mockOctokit.rest.repos.createRelease.mockResolvedValue({ data: { id: 123, tag_name: 'v1.0.0', html_url: 'https://github.com/test-owner/test-repo/releases/tag/v1.0.0' } });
      const result = await publisher.createRelease({ tagName: 'v1.0.0', name: 'Release v1.0.0', body: 'Release notes', draft: true, prerelease: false, artifacts: [] });
      expect(result.success).toBe(true);
      expect(mockOctokit.rest.repos.createRelease).toHaveBeenCalledWith(expect.objectContaining({ draft: true }));
    });

    it('should create prerelease', async () => {
      mockOctokit.rest.repos.getReleaseByTag.mockRejectedValue({ status: 404 });
      mockOctokit.rest.repos.createRelease.mockResolvedValue({ data: { id: 123, tag_name: 'v1.0.0-beta.1', html_url: 'https://github.com/test-owner/test-repo/releases/tag/v1.0.0-beta.1' } });
      const result = await publisher.createRelease({ tagName: 'v1.0.0-beta.1', name: 'Release v1.0.0-beta.1', body: 'Beta release', draft: false, prerelease: true, artifacts: [] });
      expect(result.success).toBe(true);
      expect(mockOctokit.rest.repos.createRelease).toHaveBeenCalledWith(expect.objectContaining({ prerelease: true }));
    });

    it('should handle release creation errors', async () => {
      mockOctokit.rest.repos.getReleaseByTag.mockRejectedValue({ status: 404 });
      mockOctokit.rest.repos.createRelease.mockRejectedValue(new Error('API error'));
      const result = await publisher.createRelease({ tagName: 'v1.0.0', name: 'Release v1.0.0', body: 'Release notes', draft: false, prerelease: false, artifacts: [] });
      expect(result.success).toBe(false);
      expect(result.errors[0].code).toBe('RELEASE_CREATION_FAILED');
    });
  });

  describe('Artifact Upload', () => {
    beforeEach(() => { jest.clearAllMocks(); });

    it('should upload artifacts successfully', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(Buffer.from('test content'));
      mockOctokit.rest.repos.uploadReleaseAsset.mockResolvedValue({ data: { browser_download_url: 'https://github.com/test-owner/test-repo/releases/download/v1.0.0/build.zip' } });
      const results = await publisher.uploadArtifacts('123', [{ name: 'build.zip', path: '/path/to/build.zip', contentType: 'application/zip', size: 1024 }]);
      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({ success: true, artifactName: 'build.zip', url: 'https://github.com/test-owner/test-repo/releases/download/v1.0.0/build.zip' });
    });

    it('should handle missing artifact files', async () => {
      mockFs.existsSync.mockReturnValue(false);
      const results = await publisher.uploadArtifacts('123', [{ name: 'missing.zip', path: '/path/to/missing.zip', contentType: 'application/zip', size: 1024 }]);
      expect(results[0]).toEqual({ success: false, artifactName: 'missing.zip', error: expect.stringContaining('not found') });
    });

    it('should handle upload failures', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(Buffer.from('test content'));
      mockOctokit.rest.repos.uploadReleaseAsset.mockRejectedValue(new Error('Upload failed'));
      const results = await publisher.uploadArtifacts('123', [{ name: 'build.zip', path: '/path/to/build.zip', contentType: 'application/zip', size: 1024 }]);
      expect(results[0]).toEqual({ success: false, artifactName: 'build.zip', error: 'Upload failed' });
    });

    it('should upload multiple artifacts', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(Buffer.from('test content'));
      mockOctokit.rest.repos.uploadReleaseAsset.mockResolvedValue({ data: { browser_download_url: 'https://github.com/test-owner/test-repo/releases/download/v1.0.0/build.zip' } });
      const results = await publisher.uploadArtifacts('123', [
        { name: 'build1.zip', path: '/path/to/build1.zip', contentType: 'application/zip', size: 1024 },
        { name: 'build2.zip', path: '/path/to/build2.zip', contentType: 'application/zip', size: 2048 },
      ]);
      expect(results).toHaveLength(2);
      expect(results.every((r) => r.success)).toBe(true);
    });
  });

  describe('Rollback Operations', () => {
    it('should delete release successfully', async () => {
      mockOctokit.rest.repos.getReleaseByTag.mockResolvedValue({ data: { id: 123 } });
      mockOctokit.rest.repos.deleteRelease.mockResolvedValue({});
      expect(await publisher.deleteRelease('v1.0.0')).toBe(true);
      expect(mockOctokit.rest.repos.deleteRelease).toHaveBeenCalledWith({ owner: 'test-owner', repo: 'test-repo', release_id: 123 });
    });

    it('should handle release deletion errors', async () => {
      mockOctokit.rest.repos.getReleaseByTag.mockRejectedValue(new Error('Release not found'));
      await expect(publisher.deleteRelease('v1.0.0')).rejects.toThrow('Failed to delete release');
    });

    it('should delete tag successfully', async () => {
      mockOctokit.rest.git.deleteRef.mockResolvedValue({});
      expect(await publisher.deleteTag('v1.0.0')).toBe(true);
      expect(mockOctokit.rest.git.deleteRef).toHaveBeenCalledWith({ owner: 'test-owner', repo: 'test-repo', ref: 'tags/v1.0.0' });
    });

    it('should handle tag deletion errors', async () => {
      mockOctokit.rest.git.deleteRef.mockRejectedValue(new Error('Tag not found'));
      await expect(publisher.deleteTag('v1.0.0')).rejects.toThrow('Failed to delete tag');
    });
  });

  describe('Configuration', () => {
    it('should use default timeout', () => {
      new GitHubPublisher(config);
      expect(Octokit).toHaveBeenCalledWith(expect.objectContaining({ request: expect.objectContaining({ timeout: 30000 }) }));
    });

    it('should use custom timeout', () => {
      new GitHubPublisher({ ...config, timeout: 60000 });
      expect(Octokit).toHaveBeenCalledWith(expect.objectContaining({ request: expect.objectContaining({ timeout: 60000 }) }));
    });

    it('should use custom base URL for GitHub Enterprise', () => {
      new GitHubPublisher({ ...config, baseUrl: 'https://github.enterprise.com/api/v3' });
      expect(Octokit).toHaveBeenCalledWith(expect.objectContaining({ baseUrl: 'https://github.enterprise.com/api/v3' }));
    });
  });
});
