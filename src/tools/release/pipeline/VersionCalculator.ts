/**
 * Version Calculator for Release Tool
 *
 * Semantic version calculation based on extracted changes.
 * Extracted from src/release-analysis/versioning/VersionCalculator.ts
 * and adapted to use local types.
 */

import {
  ExtractedChanges,
  BreakingChange,
  Feature,
  BugFix,
  Improvement,
  VersionRecommendation,
  ChangeEvidence,
  PreReleaseInfo,
  ValidationResult,
  ParsedVersion,
} from '../types';

export class VersionCalculator {
  calculateVersionBump(changes: ExtractedChanges, currentVersion: string): VersionRecommendation {
    const parsedVersion = this.parseVersion(currentVersion);
    const evidence = this.generateEvidence(changes);
    const bumpType = this.determineBumpType(changes);
    const recommendedVersion = this.calculateNewVersion(parsedVersion, bumpType);
    const rationale = this.generateVersionRationale(changes);
    const confidence = this.calculateConfidence(changes, bumpType);

    return {
      currentVersion,
      recommendedVersion,
      bumpType,
      rationale,
      confidence,
      evidence,
      preReleaseInfo: this.analyzePreReleaseInfo(parsedVersion, bumpType),
    };
  }

  validateSemanticVersioning(recommendation: VersionRecommendation): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!this.isValidSemanticVersion(recommendation.currentVersion)) {
      errors.push(`Current version "${recommendation.currentVersion}" is not a valid semantic version`);
    }
    if (!this.isValidSemanticVersion(recommendation.recommendedVersion)) {
      errors.push(`Recommended version "${recommendation.recommendedVersion}" is not a valid semantic version`);
    }
    if (errors.length > 0) {
      return { valid: false, errors, warnings };
    }

    const currentParsed = this.parseVersion(recommendation.currentVersion);
    const recommendedParsed = this.parseVersion(recommendation.recommendedVersion);

    if (!this.isValidVersionProgression(currentParsed, recommendedParsed, recommendation.bumpType)) {
      errors.push(
        `Version progression from ${recommendation.currentVersion} to ${recommendation.recommendedVersion} is invalid for ${recommendation.bumpType} bump`,
      );
    }

    const hasBreaking = recommendation.evidence.some((e) => e.type === 'breaking');
    const hasFeatures = recommendation.evidence.some((e) => e.type === 'feature');
    const hasFixes = recommendation.evidence.some((e) => e.type === 'fix' || e.type === 'improvement');

    let expectedBumpType: 'major' | 'minor' | 'patch' | 'none' = 'none';
    if (hasBreaking) expectedBumpType = 'major';
    else if (hasFeatures) expectedBumpType = 'minor';
    else if (hasFixes) expectedBumpType = 'patch';

    if (recommendation.bumpType !== expectedBumpType && expectedBumpType !== 'none') {
      warnings.push(
        `Recommended bump type "${recommendation.bumpType}" may not match evidence (expected "${expectedBumpType}")`,
      );
    }

    if (recommendation.confidence < 0.7) {
      warnings.push(`Low confidence score (${recommendation.confidence.toFixed(2)}) - manual review recommended`);
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  generateVersionRationale(changes: ExtractedChanges): string {
    const rationale: string[] = [];

    if (changes.breakingChanges.length > 0) {
      rationale.push(`Major version bump required due to ${changes.breakingChanges.length} breaking change(s):`);
      changes.breakingChanges.slice(0, 3).forEach((c) => rationale.push(`  • ${c.title} (${c.severity} severity)`));
      if (changes.breakingChanges.length > 3)
        rationale.push(`  • ... and ${changes.breakingChanges.length - 3} more breaking changes`);
    } else if (changes.newFeatures.length > 0) {
      rationale.push(`Minor version bump recommended due to ${changes.newFeatures.length} new feature(s):`);
      changes.newFeatures.slice(0, 3).forEach((f) => rationale.push(`  • ${f.title}`));
      if (changes.newFeatures.length > 3)
        rationale.push(`  • ... and ${changes.newFeatures.length - 3} more features`);
    } else if (changes.bugFixes.length > 0 || changes.improvements.length > 0) {
      const total = changes.bugFixes.length + changes.improvements.length;
      rationale.push(`Patch version bump recommended due to ${total} fix(es) and improvement(s):`);
      changes.bugFixes.slice(0, 2).forEach((f) => rationale.push(`  • ${f.title} (bug fix)`));
      changes.improvements.slice(0, 2).forEach((i) => rationale.push(`  • ${i.title} (${i.type})`));
      if (total > 4) rationale.push(`  • ... and ${total - 4} more fixes/improvements`);
    } else {
      rationale.push('No version bump required - only documentation or non-functional changes detected');
    }

    return rationale.join('\n');
  }

  handlePreReleaseVersions(currentVersion: string, bumpType: 'major' | 'minor' | 'patch' | 'none'): string {
    const parsed = this.parseVersion(currentVersion);

    if (parsed.preRelease) {
      const match = parsed.preRelease.match(/^(alpha|beta|rc)\.?(\d+)?$/);
      if (match) {
        const [, type, num] = match;
        const nextNum = num ? parseInt(num) + 1 : 1;
        return `${parsed.major}.${parsed.minor}.${parsed.patch}-${type}.${nextNum}`;
      }
    }

    return this.calculateNewVersion(parsed, bumpType);
  }

  generatePreReleaseVersion(
    baseVersion: string,
    preReleaseType: 'alpha' | 'beta' | 'rc',
    preReleaseNumber: number = 1,
  ): string {
    const parsed = this.parseVersion(baseVersion);
    return `${parsed.major}.${parsed.minor}.${parsed.patch}-${preReleaseType}.${preReleaseNumber}`;
  }

  progressPreReleaseStage(currentVersion: string): string {
    const parsed = this.parseVersion(currentVersion);
    if (!parsed.preRelease) throw new Error(`Version ${currentVersion} is not a pre-release version`);

    const match = parsed.preRelease.match(/^(alpha|beta|rc)\.?(\d+)?$/);
    if (!match) throw new Error(`Invalid pre-release format: ${parsed.preRelease}`);

    const base = `${parsed.major}.${parsed.minor}.${parsed.patch}`;
    switch (match[1]) {
      case 'alpha': return `${base}-beta.1`;
      case 'beta': return `${base}-rc.1`;
      case 'rc': return base;
      default: throw new Error(`Unknown pre-release type: ${match[1]}`);
    }
  }

  incrementPreReleaseNumber(currentVersion: string): string {
    const parsed = this.parseVersion(currentVersion);
    if (!parsed.preRelease) throw new Error(`Version ${currentVersion} is not a pre-release version`);

    const match = parsed.preRelease.match(/^(alpha|beta|rc)\.?(\d+)?$/);
    if (!match) throw new Error(`Invalid pre-release format: ${parsed.preRelease}`);

    const [, type, num] = match;
    return `${parsed.major}.${parsed.minor}.${parsed.patch}-${type}.${num ? parseInt(num) + 1 : 1}`;
  }

  promoteToStable(currentVersion: string): string {
    const parsed = this.parseVersion(currentVersion);
    if (!parsed.preRelease) throw new Error(`Version ${currentVersion} is already a stable version`);
    return `${parsed.major}.${parsed.minor}.${parsed.patch}`;
  }

  isPreRelease(version: string): boolean {
    try {
      return this.parseVersion(version).preRelease !== null;
    } catch {
      return false;
    }
  }

  getPreReleaseType(version: string): 'alpha' | 'beta' | 'rc' | null {
    try {
      const parsed = this.parseVersion(version);
      if (!parsed.preRelease) return null;
      const match = parsed.preRelease.match(/^(alpha|beta|rc)\.?(\d+)?$/);
      return match ? (match[1] as 'alpha' | 'beta' | 'rc') : null;
    } catch {
      return null;
    }
  }

  getPreReleaseNumber(version: string): number | null {
    try {
      const parsed = this.parseVersion(version);
      if (!parsed.preRelease) return null;
      const match = parsed.preRelease.match(/^(alpha|beta|rc)\.?(\d+)?$/);
      if (!match) return null;
      return match[2] ? parseInt(match[2]) : 0;
    } catch {
      return null;
    }
  }

  parseVersion(version: string): ParsedVersion {
    const match = version.match(
      /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/,
    );
    if (!match) throw new Error(`Invalid semantic version: ${version}`);

    return {
      major: parseInt(match[1]),
      minor: parseInt(match[2]),
      patch: parseInt(match[3]),
      preRelease: match[4] || null,
      build: match[5] || null,
      raw: version,
    };
  }

  private determineBumpType(changes: ExtractedChanges): 'major' | 'minor' | 'patch' | 'none' {
    if (changes.breakingChanges.length > 0) return 'major';
    if (changes.newFeatures.length > 0) return 'minor';
    if (changes.bugFixes.length > 0 || changes.improvements.length > 0) return 'patch';
    return 'none';
  }

  private calculateNewVersion(parsed: ParsedVersion, bumpType: 'major' | 'minor' | 'patch' | 'none'): string {
    switch (bumpType) {
      case 'major': return `${parsed.major + 1}.0.0`;
      case 'minor': return `${parsed.major}.${parsed.minor + 1}.0`;
      case 'patch': return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
      case 'none': return parsed.raw;
    }
  }

  private generateEvidence(changes: ExtractedChanges): ChangeEvidence[] {
    const evidence: ChangeEvidence[] = [];

    if (changes.breakingChanges.length > 0) {
      evidence.push({
        type: 'breaking',
        description: `${changes.breakingChanges.length} breaking change(s) detected`,
        source: 'completion documents',
        impact: this.determineBreakingChangeImpact(changes.breakingChanges),
        count: changes.breakingChanges.length,
      });
    }
    if (changes.newFeatures.length > 0) {
      evidence.push({
        type: 'feature',
        description: `${changes.newFeatures.length} new feature(s) added`,
        source: 'completion documents',
        impact: this.determineFeatureImpact(changes.newFeatures),
        count: changes.newFeatures.length,
      });
    }
    if (changes.bugFixes.length > 0) {
      evidence.push({
        type: 'fix',
        description: `${changes.bugFixes.length} bug fix(es) implemented`,
        source: 'completion documents',
        impact: this.determineBugFixImpact(changes.bugFixes),
        count: changes.bugFixes.length,
      });
    }
    if (changes.improvements.length > 0) {
      evidence.push({
        type: 'improvement',
        description: `${changes.improvements.length} improvement(s) made`,
        source: 'completion documents',
        impact: this.determineImprovementImpact(changes.improvements),
        count: changes.improvements.length,
      });
    }

    return evidence;
  }

  private calculateConfidence(changes: ExtractedChanges, bumpType: 'major' | 'minor' | 'patch' | 'none'): number {
    let confidence = changes.metadata.extractionConfidence;

    if (changes.metadata.ambiguousItems.length > 0) {
      confidence -= Math.min(0.2, changes.metadata.ambiguousItems.length * 0.05);
    }

    if (bumpType === 'major' && changes.breakingChanges.length > 0) confidence += 0.1;
    else if (bumpType === 'minor' && changes.newFeatures.length > 0 && changes.breakingChanges.length === 0)
      confidence += 0.1;
    else if (
      bumpType === 'patch' &&
      (changes.bugFixes.length > 0 || changes.improvements.length > 0) &&
      changes.breakingChanges.length === 0 &&
      changes.newFeatures.length === 0
    )
      confidence += 0.1;

    return Math.max(0, Math.min(1, confidence));
  }

  private analyzePreReleaseInfo(
    parsed: ParsedVersion,
    bumpType: 'major' | 'minor' | 'patch' | 'none',
  ): PreReleaseInfo | undefined {
    if (!parsed.preRelease) return undefined;

    const match = parsed.preRelease.match(/^(alpha|beta|rc)\.?(\d+)?$/);
    if (!match) return { isPreRelease: true, canPromote: false };

    const [, type, num] = match;
    const preReleaseNumber = num ? parseInt(num) : 0;

    return {
      isPreRelease: true,
      preReleaseType: type as 'alpha' | 'beta' | 'rc',
      preReleaseNumber,
      canPromote: type === 'rc' && bumpType !== 'none',
      nextPreRelease: `${type}.${preReleaseNumber + 1}`,
    };
  }

  private isValidSemanticVersion(version: string): boolean {
    return /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/.test(
      version,
    );
  }

  private isValidVersionProgression(
    current: ParsedVersion,
    recommended: ParsedVersion,
    bumpType: 'major' | 'minor' | 'patch' | 'none',
  ): boolean {
    switch (bumpType) {
      case 'major':
        return recommended.major === current.major + 1 && recommended.minor === 0 && recommended.patch === 0;
      case 'minor':
        return (
          recommended.major === current.major && recommended.minor === current.minor + 1 && recommended.patch === 0
        );
      case 'patch':
        return (
          recommended.major === current.major &&
          recommended.minor === current.minor &&
          recommended.patch === current.patch + 1
        );
      case 'none':
        return (
          recommended.major === current.major &&
          recommended.minor === current.minor &&
          recommended.patch === current.patch
        );
    }
  }

  private determineBreakingChangeImpact(breakingChanges: BreakingChange[]): 'high' | 'medium' | 'low' {
    if (breakingChanges.some((c) => c.severity === 'critical')) return 'high';
    if (breakingChanges.some((c) => c.severity === 'high') || breakingChanges.length > 3) return 'high';
    if (breakingChanges.length > 1) return 'medium';
    return 'low';
  }

  private determineFeatureImpact(features: Feature[]): 'high' | 'medium' | 'low' {
    if (features.length > 5) return 'high';
    if (features.length > 2) return 'medium';
    return 'low';
  }

  private determineBugFixImpact(bugFixes: BugFix[]): 'high' | 'medium' | 'low' {
    if (bugFixes.some((f) => f.severity === 'critical')) return 'high';
    if (bugFixes.some((f) => f.severity === 'high') || bugFixes.length > 5) return 'medium';
    return 'low';
  }

  private determineImprovementImpact(improvements: Improvement[]): 'high' | 'medium' | 'low' {
    if (improvements.some((i) => i.impact === 'high')) return 'high';
    if (improvements.length > 3) return 'medium';
    return 'low';
  }
}
