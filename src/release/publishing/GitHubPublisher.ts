/**
 * GitHub Publisher
 * 
 * Handles all GitHub API interactions for creating releases, tags, and publishing artifacts.
 * Provides authentication, error handling, and artifact upload capabilities.
 */

import { Octokit } from '@octokit/rest';
import * as fs from 'fs';
import * as path from 'path';
import {
  GitHubRelease,
  GitTag,
  Artifact,
  ReleaseResult,
  TagResult,
  UploadResult,
  ReleaseError
} from '../types/ReleaseTypes';
import { GitHubPublisher as IGitHubPublisher, RepositoryInfo } from '../interfaces/ReleaseInterfaces';

export interface GitHubConfig {
  /** GitHub personal access token */
  token: string;
  
  /** Repository owner */
  owner: string;
  
  /** Repository name */
  repo: string;
  
  /** Base URL for GitHub API (for GitHub Enterprise) */
  baseUrl?: string;
  
  /** Request timeout in milliseconds */
  timeout?: number;
  
  /** Maximum retry attempts */
  maxRetries?: number;
  
  /** Retry delay in milliseconds */
  retryDelay?: number;
}

export class GitHubPublisher implements IGitHubPublisher {
  private octokit: Octokit;
  private config: GitHubConfig;
  private authenticated: boolean = false;

  constructor(config: GitHubConfig) {
    this.config = {
      timeout: 30000,
      maxRetries: 3,
      retryDelay: 1000,
      ...config
    };

    this.octokit = new Octokit({
      auth: this.config.token,
      baseUrl: this.config.baseUrl,
      request: {
        timeout: this.config.timeout
      }
    });
  }

  /**
   * Validate GitHub authentication
   */
  async validateAuthentication(): Promise<boolean> {
    try {
      await this.octokit.rest.users.getAuthenticated();
      this.authenticated = true;
      return true;
    } catch (error) {
      this.authenticated = false;
      throw new Error(`GitHub authentication failed: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * Get repository information
   */
  async getRepositoryInfo(): Promise<RepositoryInfo> {
    try {
      const { data } = await this.octokit.rest.repos.get({
        owner: this.config.owner,
        repo: this.config.repo
      });

      return {
        owner: data.owner.login,
        name: data.name,
        fullName: data.full_name,
        defaultBranch: data.default_branch,
        private: data.private,
        url: data.html_url
      };
    } catch (error) {
      throw new Error(`Failed to get repository info: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * Check if release already exists
   */
  async releaseExists(tagName: string): Promise<boolean> {
    try {
      await this.octokit.rest.repos.getReleaseByTag({
        owner: this.config.owner,
        repo: this.config.repo,
        tag: tagName
      });
      return true;
    } catch (error: any) {
      if (error.status === 404) {
        return false;
      }
      throw new Error(`Failed to check if release exists: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * Create Git tags
   */
  async createTags(tags: GitTag[]): Promise<TagResult[]> {
    const results: TagResult[] = [];

    for (const tag of tags) {
      try {
        // Get the commit SHA
        const { data: commit } = await this.octokit.rest.git.getCommit({
          owner: this.config.owner,
          repo: this.config.repo,
          commit_sha: tag.commit
        });

        // Create annotated tag
        const { data: tagObject } = await this.octokit.rest.git.createTag({
          owner: this.config.owner,
          repo: this.config.repo,
          tag: tag.name,
          message: tag.message,
          object: commit.sha,
          type: 'commit'
        });

        // Create reference to the tag
        await this.octokit.rest.git.createRef({
          owner: this.config.owner,
          repo: this.config.repo,
          ref: `refs/tags/${tag.name}`,
          sha: tagObject.sha
        });

        results.push({
          success: true,
          tagName: tag.name
        });
      } catch (error) {
        results.push({
          success: false,
          tagName: tag.name,
          error: this.getErrorMessage(error)
        });
      }
    }

    return results;
  }

  /**
   * Create GitHub release
   */
  async createRelease(release: GitHubRelease): Promise<ReleaseResult> {
    const startTime = Date.now();
    const errors: ReleaseError[] = [];

    try {
      // Validate authentication first
      if (!this.authenticated) {
        await this.validateAuthentication();
      }

      // Check if release already exists
      const exists = await this.releaseExists(release.tagName);
      if (exists) {
        throw new Error(`Release ${release.tagName} already exists`);
      }

      // Create the release
      const { data: githubRelease } = await this.octokit.rest.repos.createRelease({
        owner: this.config.owner,
        repo: this.config.repo,
        tag_name: release.tagName,
        name: release.name,
        body: release.body,
        draft: release.draft,
        prerelease: release.prerelease
      });

      // Upload artifacts if any
      const uploadResults: UploadResult[] = [];
      if (release.artifacts && release.artifacts.length > 0) {
        const artifactResults = await this.uploadArtifacts(
          githubRelease.id.toString(),
          release.artifacts
        );
        uploadResults.push(...artifactResults);

        // Collect any upload errors
        artifactResults.forEach(result => {
          if (!result.success && result.error) {
            errors.push({
              code: 'ARTIFACT_UPLOAD_FAILED',
              message: `Failed to upload artifact ${result.artifactName}: ${result.error}`,
              severity: 'warning',
              step: 'artifact-upload'
            });
          }
        });
      }

      const duration = Date.now() - startTime;

      return {
        success: errors.filter(e => e.severity === 'error').length === 0,
        version: release.tagName,
        releasedPackages: [this.config.repo],
        githubReleaseUrl: githubRelease.html_url,
        npmPackageUrls: [],
        duration,
        errors,
        releasedAt: new Date()
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      errors.push({
        code: 'RELEASE_CREATION_FAILED',
        message: this.getErrorMessage(error),
        severity: 'error',
        step: 'release-creation',
        stackTrace: error instanceof Error ? error.stack : undefined
      });

      return {
        success: false,
        version: release.tagName,
        releasedPackages: [],
        npmPackageUrls: [],
        duration,
        errors,
        releasedAt: new Date()
      };
    }
  }

  /**
   * Upload artifacts to GitHub release
   */
  async uploadArtifacts(releaseId: string, artifacts: Artifact[]): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (const artifact of artifacts) {
      try {
        // Validate artifact file exists
        if (!fs.existsSync(artifact.path)) {
          results.push({
            success: false,
            artifactName: artifact.name,
            error: `Artifact file not found: ${artifact.path}`
          });
          continue;
        }

        // Read artifact file
        const data = fs.readFileSync(artifact.path);

        // Upload artifact with retry logic
        const uploadResult = await this.uploadArtifactWithRetry(
          parseInt(releaseId),
          artifact.name,
          data,
          artifact.contentType
        );

        results.push({
          success: true,
          artifactName: artifact.name,
          url: uploadResult.browser_download_url
        });
      } catch (error) {
        results.push({
          success: false,
          artifactName: artifact.name,
          error: this.getErrorMessage(error)
        });
      }
    }

    return results;
  }

  /**
   * Upload artifact with retry logic
   */
  private async uploadArtifactWithRetry(
    releaseId: number,
    name: string,
    data: Buffer,
    contentType: string,
    attempt: number = 1
  ): Promise<any> {
    try {
      const { data: asset } = await this.octokit.rest.repos.uploadReleaseAsset({
        owner: this.config.owner,
        repo: this.config.repo,
        release_id: releaseId,
        name,
        data: data as any,
        headers: {
          'content-type': contentType,
          'content-length': data.length
        }
      });

      return asset;
    } catch (error) {
      if (attempt < (this.config.maxRetries || 3)) {
        // Wait before retrying
        await this.delay(this.config.retryDelay || 1000);
        return this.uploadArtifactWithRetry(releaseId, name, data, contentType, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Publish packages to npm (placeholder - actual npm publishing handled separately)
   */
  async publishToNpm(): Promise<any[]> {
    // This method is a placeholder as npm publishing is typically handled
    // by a separate npm publisher component or CI/CD pipeline
    throw new Error('npm publishing should be handled by NpmPublisher component');
  }

  /**
   * Delete a release (for rollback)
   */
  async deleteRelease(tagName: string): Promise<boolean> {
    try {
      // Get release by tag
      const { data: release } = await this.octokit.rest.repos.getReleaseByTag({
        owner: this.config.owner,
        repo: this.config.repo,
        tag: tagName
      });

      // Delete the release
      await this.octokit.rest.repos.deleteRelease({
        owner: this.config.owner,
        repo: this.config.repo,
        release_id: release.id
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to delete release: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * Delete a tag (for rollback)
   */
  async deleteTag(tagName: string): Promise<boolean> {
    try {
      await this.octokit.rest.git.deleteRef({
        owner: this.config.owner,
        repo: this.config.repo,
        ref: `tags/${tagName}`
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to delete tag: ${this.getErrorMessage(error)}`);
    }
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
