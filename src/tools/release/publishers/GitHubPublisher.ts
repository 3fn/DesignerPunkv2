/**
 * GitHub Publisher for Release Tool
 *
 * Handles GitHub API interactions for creating releases, tags, and uploading artifacts.
 * Extracted from src/release/publishing/GitHubPublisher.ts.
 */

import { Octokit } from '@octokit/rest';
import * as fs from 'fs';
import {
  GitHubRelease,
  GitTag,
  Artifact,
  ReleaseResult,
  TagResult,
  UploadResult,
  ReleaseError,
  RepositoryInfo,
} from '../types';

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export class GitHubPublisher {
  private octokit: Octokit;
  private config: GitHubConfig;
  private authenticated: boolean = false;

  constructor(config: GitHubConfig) {
    this.config = { timeout: 30000, maxRetries: 3, retryDelay: 1000, ...config };
    this.octokit = new Octokit({
      auth: this.config.token,
      baseUrl: this.config.baseUrl,
      request: { timeout: this.config.timeout },
    });
  }

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

  async getRepositoryInfo(): Promise<RepositoryInfo> {
    try {
      const { data } = await this.octokit.rest.repos.get({
        owner: this.config.owner,
        repo: this.config.repo,
      });
      return {
        owner: data.owner.login,
        name: data.name,
        fullName: data.full_name,
        defaultBranch: data.default_branch,
        private: data.private,
        url: data.html_url,
      };
    } catch (error) {
      throw new Error(`Failed to get repository info: ${this.getErrorMessage(error)}`);
    }
  }

  async releaseExists(tagName: string): Promise<boolean> {
    try {
      await this.octokit.rest.repos.getReleaseByTag({
        owner: this.config.owner,
        repo: this.config.repo,
        tag: tagName,
      });
      return true;
    } catch (error: any) {
      if (error.status === 404) return false;
      throw new Error(`Failed to check if release exists: ${this.getErrorMessage(error)}`);
    }
  }

  async createTags(tags: GitTag[]): Promise<TagResult[]> {
    const results: TagResult[] = [];
    for (const tag of tags) {
      try {
        const { data: commit } = await this.octokit.rest.git.getCommit({
          owner: this.config.owner, repo: this.config.repo, commit_sha: tag.commit,
        });
        const { data: tagObject } = await this.octokit.rest.git.createTag({
          owner: this.config.owner, repo: this.config.repo,
          tag: tag.name, message: tag.message, object: commit.sha, type: 'commit',
        });
        await this.octokit.rest.git.createRef({
          owner: this.config.owner, repo: this.config.repo,
          ref: `refs/tags/${tag.name}`, sha: tagObject.sha,
        });
        results.push({ success: true, tagName: tag.name });
      } catch (error) {
        results.push({ success: false, tagName: tag.name, error: this.getErrorMessage(error) });
      }
    }
    return results;
  }

  async createRelease(release: GitHubRelease): Promise<ReleaseResult> {
    const startTime = Date.now();
    const errors: ReleaseError[] = [];

    try {
      if (!this.authenticated) await this.validateAuthentication();

      const exists = await this.releaseExists(release.tagName);
      if (exists) throw new Error(`Release ${release.tagName} already exists`);

      const { data: githubRelease } = await this.octokit.rest.repos.createRelease({
        owner: this.config.owner, repo: this.config.repo,
        tag_name: release.tagName, name: release.name, body: release.body,
        draft: release.draft, prerelease: release.prerelease,
      });

      if (release.artifacts?.length > 0) {
        const artifactResults = await this.uploadArtifacts(githubRelease.id.toString(), release.artifacts);
        artifactResults.forEach((result) => {
          if (!result.success && result.error) {
            errors.push({
              code: 'ARTIFACT_UPLOAD_FAILED',
              message: `Failed to upload artifact ${result.artifactName}: ${result.error}`,
              severity: 'warning', step: 'artifact-upload',
            });
          }
        });
      }

      return {
        success: errors.filter((e) => e.severity === 'error').length === 0,
        version: release.tagName, releasedPackages: [this.config.repo],
        githubReleaseUrl: githubRelease.html_url, npmPackageUrls: [],
        duration: Date.now() - startTime, errors, releasedAt: new Date(),
      };
    } catch (error) {
      errors.push({
        code: 'RELEASE_CREATION_FAILED', message: this.getErrorMessage(error),
        severity: 'error', step: 'release-creation',
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      return {
        success: false, version: release.tagName, releasedPackages: [],
        npmPackageUrls: [], duration: Date.now() - startTime, errors, releasedAt: new Date(),
      };
    }
  }

  async uploadArtifacts(releaseId: string, artifacts: Artifact[]): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    for (const artifact of artifacts) {
      try {
        if (!fs.existsSync(artifact.path)) {
          results.push({ success: false, artifactName: artifact.name, error: `Artifact file not found: ${artifact.path}` });
          continue;
        }
        const data = fs.readFileSync(artifact.path);
        const uploadResult = await this.uploadArtifactWithRetry(parseInt(releaseId), artifact.name, data, artifact.contentType);
        results.push({ success: true, artifactName: artifact.name, url: uploadResult.browser_download_url });
      } catch (error) {
        results.push({ success: false, artifactName: artifact.name, error: this.getErrorMessage(error) });
      }
    }
    return results;
  }

  async deleteRelease(tagName: string): Promise<boolean> {
    try {
      const { data: release } = await this.octokit.rest.repos.getReleaseByTag({
        owner: this.config.owner, repo: this.config.repo, tag: tagName,
      });
      await this.octokit.rest.repos.deleteRelease({
        owner: this.config.owner, repo: this.config.repo, release_id: release.id,
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to delete release: ${this.getErrorMessage(error)}`);
    }
  }

  async deleteTag(tagName: string): Promise<boolean> {
    try {
      await this.octokit.rest.git.deleteRef({
        owner: this.config.owner, repo: this.config.repo, ref: `tags/${tagName}`,
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to delete tag: ${this.getErrorMessage(error)}`);
    }
  }

  private async uploadArtifactWithRetry(
    releaseId: number, name: string, data: Buffer, contentType: string, attempt: number = 1,
  ): Promise<any> {
    try {
      const { data: asset } = await this.octokit.rest.repos.uploadReleaseAsset({
        owner: this.config.owner, repo: this.config.repo, release_id: releaseId,
        name, data: data as any,
        headers: { 'content-type': contentType, 'content-length': data.length },
      });
      return asset;
    } catch (error) {
      if (attempt < (this.config.maxRetries || 3)) {
        await new Promise((r) => setTimeout(r, this.config.retryDelay || 1000));
        return this.uploadArtifactWithRetry(releaseId, name, data, contentType, attempt + 1);
      }
      throw error;
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error) return String((error as any).message);
    return 'Unknown error occurred';
  }
}
