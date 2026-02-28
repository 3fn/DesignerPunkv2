/**
 * ReleasePipeline — orchestrates the release tool pipeline.
 *
 * analyze()       → scan + classify + recommend version
 * generateNotes() → analyze + render markdown + write files
 * release()       → generateNotes + tag + GitHub publish
 */

import * as fs from 'fs';
import * as path from 'path';
import { TagResolver } from '../pipeline/TagResolver';
import { SummaryScanner } from '../pipeline/SummaryScanner';
import { ChangeExtractor } from '../pipeline/ChangeExtractor';
import { ChangeClassifier } from '../pipeline/ChangeClassifier';
import { NotesRenderer } from '../pipeline/NotesRenderer';
import { GitHubPublisher, GitHubConfig } from '../publishers/GitHubPublisher';
import { PipelineRecommendation, RenderedNotes, ReleaseConfig, ExtractedChange, ClassifiedChange, GitHubRelease } from '../types';

export class ReleasePipeline {
  private config: ReleaseConfig;
  private cwd: string;

  constructor(cwd?: string) {
    this.cwd = cwd || process.cwd();
    this.config = this.loadConfig();
  }

  async analyze(): Promise<PipelineRecommendation> {
    const tagResolver = new TagResolver();
    const tag = await tagResolver.getLatestTag();

    const scanner = new SummaryScanner(this.cwd);
    const summaries = await scanner.findSummariesSinceTag(tag);

    if (summaries.length === 0) {
      return {
        currentVersion: tag?.tag.replace(/^v/, '') || '0.0.0',
        recommendedVersion: tag?.tag.replace(/^v/, '') || '0.0.0',
        bumpType: 'none',
        rationale: 'No new summary docs found since last tag',
        confidence: 1.0,
        changes: [],
      };
    }

    const extractor = new ChangeExtractor();
    const extracted: ExtractedChange[] = summaries
      .map((s) => extractor.extract(s))
      .filter((e): e is ExtractedChange => e !== undefined);

    const classifier = new ChangeClassifier();
    const classified: ClassifiedChange[] = classifier.classify(extracted);

    const currentVersion = tag?.tag.replace(/^v/, '') || '0.0.0';
    const bumpType = this.determineBump(classified);
    const recommendedVersion = this.bumpVersion(currentVersion, bumpType);

    return {
      currentVersion,
      recommendedVersion,
      bumpType,
      rationale: this.buildRationale(classified),
      confidence: classified.some((c) => c.change.deliverables?.length) ? 0.9 : 0.7,
      changes: classified,
    };
  }

  async generateNotes(): Promise<RenderedNotes> {
    const recommendation = await this.analyze();
    const renderer = new NotesRenderer();
    const notes = renderer.render(recommendation);

    const outputDir = path.resolve(this.cwd, this.config.outputDir);
    fs.mkdirSync(outputDir, { recursive: true });

    const filename = `release-${recommendation.recommendedVersion}.md`;
    fs.writeFileSync(path.join(outputDir, filename), notes.public, 'utf-8');
    fs.writeFileSync(path.join(outputDir, `${filename}.internal.md`), notes.internal, 'utf-8');
    fs.writeFileSync(path.join(outputDir, `${filename}.json`), JSON.stringify(notes.json, null, 2), 'utf-8');

    return notes;
  }

  async release(dryRun = false): Promise<{ notes: RenderedNotes; published: boolean; releaseUrl?: string; error?: string }> {
    const notes = await this.generateNotes();
    const version = notes.json.version;

    if (dryRun) {
      return { notes, published: false };
    }

    const tagResolver = new TagResolver();
    await tagResolver.createTag(`v${version}`, `Release ${version}`);

    if (this.config.repoUrl) {
      const [owner, repo] = this.parseRepoUrl(this.config.repoUrl);
      const token = process.env.GITHUB_TOKEN || '';
      if (!token) {
        return { notes, published: false, error: 'GITHUB_TOKEN not set — tag created but GitHub release skipped' };
      }
      const publisher = new GitHubPublisher({ token, owner, repo });
      const release: GitHubRelease = {
        tagName: `v${version}`,
        name: `Release ${version}`,
        body: notes.public,
        draft: false,
        prerelease: false,
        artifacts: [],
      };
      const result = await publisher.createRelease(release);
      const error = result.errors.length > 0 ? result.errors[0].message : undefined;
      return { notes, published: result.success, releaseUrl: result.githubReleaseUrl, error };
    }

    return { notes, published: false, error: 'No repoUrl configured — tag created but GitHub release skipped' };
  }

  checkAccumulation(): string | null {
    const outputDir = path.resolve(this.cwd, this.config.outputDir);
    if (!fs.existsSync(outputDir)) return null;
    const files = fs.readdirSync(outputDir).filter((f) => !f.startsWith('.'));
    return files.length > 5 ? `⚠️  Output directory has ${files.length} files — consider cleaning old releases` : null;
  }

  private loadConfig(): ReleaseConfig {
    const configPath = path.resolve(this.cwd, 'src/tools/release/release-config.json');
    try {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch {
      return { npmPublishEnabled: false, repoUrl: '', outputDir: 'docs/releases' };
    }
  }

  private parseRepoUrl(url: string): [string, string] {
    const match = url.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
    return match ? [match[1], match[2]] : ['', ''];
  }

  private determineBump(classified: ClassifiedChange[]): 'major' | 'minor' | 'patch' | 'none' {
    if (classified.length === 0) return 'none';
    if (classified.some((c) => c.priority === 'breaking')) return 'major';
    if (classified.some((c) => c.priority === 'prominent')) return 'minor';
    return 'patch';
  }

  private bumpVersion(version: string, bump: 'major' | 'minor' | 'patch' | 'none'): string {
    const [major, minor, patch] = version.split('.').map(Number);
    switch (bump) {
      case 'major': return `${major + 1}.0.0`;
      case 'minor': return `${major}.${minor + 1}.0`;
      case 'patch': return `${major}.${minor}.${patch + 1}`;
      default: return version;
    }
  }

  private buildRationale(classified: ClassifiedChange[]): string {
    const counts = { breaking: 0, prominent: 0, context: 0 };
    for (const c of classified) counts[c.priority]++;
    const parts: string[] = [];
    if (counts.breaking) parts.push(`${counts.breaking} breaking`);
    if (counts.prominent) parts.push(`${counts.prominent} prominent`);
    if (counts.context) parts.push(`${counts.context} context`);
    return `${classified.length} changes: ${parts.join(', ')}`;
  }
}
