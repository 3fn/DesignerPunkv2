/**
 * Version Calculator for Release Analysis System
 * 
 * Implements semantic version calculation based on extracted changes,
 * providing version bump recommendations with rationale and evidence.
 */

import { ExtractedChanges, BreakingChange, Feature, BugFix, Improvement } from '../types/AnalysisTypes';

export interface VersionRecommendation {
  currentVersion: string;
  recommendedVersion: string;
  bumpType: 'major' | 'minor' | 'patch' | 'none';
  rationale: string;
  confidence: number;
  evidence: ChangeEvidence[];
  preReleaseInfo?: PreReleaseInfo;
}

export interface ChangeEvidence {
  type: 'breaking' | 'feature' | 'fix' | 'improvement';
  description: string;
  source: string;
  impact: 'high' | 'medium' | 'low';
  count?: number;
}

export interface PreReleaseInfo {
  isPreRelease: boolean;
  preReleaseType?: 'alpha' | 'beta' | 'rc';
  preReleaseNumber?: number;
  canPromote?: boolean;
  nextPreRelease?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class VersionCalculator {
  /**
   * Calculate semantic version bump based on extracted changes
   */
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
      preReleaseInfo: this.analyzePreReleaseInfo(parsedVersion, bumpType)
    };
  }

  /**
   * Validate semantic versioning compliance
   */
  validateSemanticVersioning(recommendation: VersionRecommendation): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate version format
    if (!this.isValidSemanticVersion(recommendation.currentVersion)) {
      errors.push(`Current version "${recommendation.currentVersion}" is not a valid semantic version`);
    }

    if (!this.isValidSemanticVersion(recommendation.recommendedVersion)) {
      errors.push(`Recommended version "${recommendation.recommendedVersion}" is not a valid semantic version`);
    }

    // Only proceed with parsing if versions are valid
    if (errors.length > 0) {
      return { valid: false, errors, warnings };
    }

    // Validate version progression
    const currentParsed = this.parseVersion(recommendation.currentVersion);
    const recommendedParsed = this.parseVersion(recommendation.recommendedVersion);

    if (!this.isValidVersionProgression(currentParsed, recommendedParsed, recommendation.bumpType)) {
      errors.push(`Version progression from ${recommendation.currentVersion} to ${recommendation.recommendedVersion} is invalid for ${recommendation.bumpType} bump`);
    }

    // Validate bump type matches evidence
    const hasBreaking = recommendation.evidence.some(e => e.type === 'breaking');
    const hasFeatures = recommendation.evidence.some(e => e.type === 'feature');
    const hasFixes = recommendation.evidence.some(e => e.type === 'fix' || e.type === 'improvement');

    let expectedBumpType: 'major' | 'minor' | 'patch' | 'none' = 'none';
    if (hasBreaking) {
      expectedBumpType = 'major';
    } else if (hasFeatures) {
      expectedBumpType = 'minor';
    } else if (hasFixes) {
      expectedBumpType = 'patch';
    }

    if (recommendation.bumpType !== expectedBumpType && expectedBumpType !== 'none') {
      warnings.push(`Recommended bump type "${recommendation.bumpType}" may not match evidence (expected "${expectedBumpType}")`);
    }

    // Validate confidence thresholds
    if (recommendation.confidence < 0.7) {
      warnings.push(`Low confidence score (${recommendation.confidence.toFixed(2)}) - manual review recommended`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Generate detailed rationale for version recommendation
   */
  generateVersionRationale(changes: ExtractedChanges): string {
    const rationale: string[] = [];

    if (changes.breakingChanges.length > 0) {
      rationale.push(`Major version bump required due to ${changes.breakingChanges.length} breaking change(s):`);
      changes.breakingChanges.slice(0, 3).forEach(change => {
        rationale.push(`  • ${change.title} (${change.severity} severity)`);
      });
      if (changes.breakingChanges.length > 3) {
        rationale.push(`  • ... and ${changes.breakingChanges.length - 3} more breaking changes`);
      }
    } else if (changes.newFeatures.length > 0) {
      rationale.push(`Minor version bump recommended due to ${changes.newFeatures.length} new feature(s):`);
      changes.newFeatures.slice(0, 3).forEach(feature => {
        rationale.push(`  • ${feature.title}`);
      });
      if (changes.newFeatures.length > 3) {
        rationale.push(`  • ... and ${changes.newFeatures.length - 3} more features`);
      }
    } else if (changes.bugFixes.length > 0 || changes.improvements.length > 0) {
      const totalFixes = changes.bugFixes.length + changes.improvements.length;
      rationale.push(`Patch version bump recommended due to ${totalFixes} fix(es) and improvement(s):`);
      
      changes.bugFixes.slice(0, 2).forEach(fix => {
        rationale.push(`  • ${fix.title} (bug fix)`);
      });
      
      changes.improvements.slice(0, 2).forEach(improvement => {
        rationale.push(`  • ${improvement.title} (${improvement.type})`);
      });
      
      if (totalFixes > 4) {
        rationale.push(`  • ... and ${totalFixes - 4} more fixes/improvements`);
      }
    } else {
      rationale.push('No version bump required - only documentation or non-functional changes detected');
    }

    return rationale.join('\n');
  }

  /**
   * Handle pre-release version progression
   */
  handlePreReleaseVersions(currentVersion: string, bumpType: 'major' | 'minor' | 'patch' | 'none'): string {
    const parsed = this.parseVersion(currentVersion);
    
    if (parsed.preRelease) {
      // If current is pre-release, increment pre-release number
      const preReleaseMatch = parsed.preRelease.match(/^(alpha|beta|rc)\.?(\d+)?$/);
      if (preReleaseMatch) {
        const [, type, num] = preReleaseMatch;
        const nextNum = num ? parseInt(num) + 1 : 1;
        return `${parsed.major}.${parsed.minor}.${parsed.patch}-${type}.${nextNum}`;
      }
    }

    // For normal version bumps, calculate new version
    return this.calculateNewVersion(parsed, bumpType);
  }

  /**
   * Parse semantic version string into components
   */
  private parseVersion(version: string): ParsedVersion {
    const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
    const match = version.match(semverRegex);

    if (!match) {
      throw new Error(`Invalid semantic version: ${version}`);
    }

    return {
      major: parseInt(match[1]),
      minor: parseInt(match[2]),
      patch: parseInt(match[3]),
      preRelease: match[4] || null,
      build: match[5] || null,
      raw: version
    };
  }

  /**
   * Determine appropriate bump type based on changes
   */
  private determineBumpType(changes: ExtractedChanges): 'major' | 'minor' | 'patch' | 'none' {
    if (changes.breakingChanges.length > 0) {
      return 'major';
    }
    
    if (changes.newFeatures.length > 0) {
      return 'minor';
    }
    
    if (changes.bugFixes.length > 0 || changes.improvements.length > 0) {
      return 'patch';
    }
    
    return 'none';
  }

  /**
   * Calculate new version based on bump type
   */
  private calculateNewVersion(parsed: ParsedVersion, bumpType: 'major' | 'minor' | 'patch' | 'none'): string {
    switch (bumpType) {
      case 'major':
        return `${parsed.major + 1}.0.0`;
      case 'minor':
        return `${parsed.major}.${parsed.minor + 1}.0`;
      case 'patch':
        return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
      case 'none':
        return parsed.raw;
      default:
        throw new Error(`Invalid bump type: ${bumpType}`);
    }
  }

  /**
   * Generate evidence array from extracted changes
   */
  private generateEvidence(changes: ExtractedChanges): ChangeEvidence[] {
    const evidence: ChangeEvidence[] = [];

    if (changes.breakingChanges.length > 0) {
      evidence.push({
        type: 'breaking',
        description: `${changes.breakingChanges.length} breaking change(s) detected`,
        source: 'completion documents',
        impact: this.determineBreakingChangeImpact(changes.breakingChanges),
        count: changes.breakingChanges.length
      });
    }

    if (changes.newFeatures.length > 0) {
      evidence.push({
        type: 'feature',
        description: `${changes.newFeatures.length} new feature(s) added`,
        source: 'completion documents',
        impact: this.determineFeatureImpact(changes.newFeatures),
        count: changes.newFeatures.length
      });
    }

    if (changes.bugFixes.length > 0) {
      evidence.push({
        type: 'fix',
        description: `${changes.bugFixes.length} bug fix(es) implemented`,
        source: 'completion documents',
        impact: this.determineBugFixImpact(changes.bugFixes),
        count: changes.bugFixes.length
      });
    }

    if (changes.improvements.length > 0) {
      evidence.push({
        type: 'improvement',
        description: `${changes.improvements.length} improvement(s) made`,
        source: 'completion documents',
        impact: this.determineImprovementImpact(changes.improvements),
        count: changes.improvements.length
      });
    }

    return evidence;
  }

  /**
   * Calculate confidence score for version recommendation
   */
  private calculateConfidence(changes: ExtractedChanges, bumpType: 'major' | 'minor' | 'patch' | 'none'): number {
    let confidence = changes.metadata.extractionConfidence;

    // Reduce confidence for ambiguous items
    if (changes.metadata.ambiguousItems.length > 0) {
      const ambiguityPenalty = Math.min(0.2, changes.metadata.ambiguousItems.length * 0.05);
      confidence -= ambiguityPenalty;
    }

    // Increase confidence for clear change patterns
    if (bumpType === 'major' && changes.breakingChanges.length > 0) {
      confidence += 0.1;
    } else if (bumpType === 'minor' && changes.newFeatures.length > 0 && changes.breakingChanges.length === 0) {
      confidence += 0.1;
    } else if (bumpType === 'patch' && (changes.bugFixes.length > 0 || changes.improvements.length > 0) && 
               changes.breakingChanges.length === 0 && changes.newFeatures.length === 0) {
      confidence += 0.1;
    }

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Analyze pre-release information
   */
  private analyzePreReleaseInfo(parsed: ParsedVersion, bumpType: 'major' | 'minor' | 'patch' | 'none'): PreReleaseInfo | undefined {
    if (!parsed.preRelease) {
      return undefined;
    }

    const preReleaseMatch = parsed.preRelease.match(/^(alpha|beta|rc)\.?(\d+)?$/);
    if (!preReleaseMatch) {
      return {
        isPreRelease: true,
        canPromote: false
      };
    }

    const [, type, num] = preReleaseMatch;
    const preReleaseNumber = num ? parseInt(num) : 0;

    return {
      isPreRelease: true,
      preReleaseType: type as 'alpha' | 'beta' | 'rc',
      preReleaseNumber,
      canPromote: type === 'rc' && bumpType !== 'none',
      nextPreRelease: `${type}.${preReleaseNumber + 1}`
    };
  }

  /**
   * Validate semantic version format
   */
  private isValidSemanticVersion(version: string): boolean {
    const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
    return semverRegex.test(version);
  }

  /**
   * Validate version progression logic
   */
  private isValidVersionProgression(current: ParsedVersion, recommended: ParsedVersion, bumpType: 'major' | 'minor' | 'patch' | 'none'): boolean {
    switch (bumpType) {
      case 'major':
        return recommended.major === current.major + 1 && 
               recommended.minor === 0 && 
               recommended.patch === 0;
      case 'minor':
        return recommended.major === current.major && 
               recommended.minor === current.minor + 1 && 
               recommended.patch === 0;
      case 'patch':
        return recommended.major === current.major && 
               recommended.minor === current.minor && 
               recommended.patch === current.patch + 1;
      case 'none':
        return recommended.major === current.major && 
               recommended.minor === current.minor && 
               recommended.patch === current.patch;
      default:
        return false;
    }
  }

  /**
   * Determine impact level for breaking changes
   */
  private determineBreakingChangeImpact(breakingChanges: BreakingChange[]): 'high' | 'medium' | 'low' {
    const criticalCount = breakingChanges.filter(c => c.severity === 'critical').length;
    const highCount = breakingChanges.filter(c => c.severity === 'high').length;

    if (criticalCount > 0) return 'high';
    if (highCount > 0 || breakingChanges.length > 3) return 'high';
    if (breakingChanges.length > 1) return 'medium';
    return 'low';
  }

  /**
   * Determine impact level for features
   */
  private determineFeatureImpact(features: Feature[]): 'high' | 'medium' | 'low' {
    if (features.length > 5) return 'high';
    if (features.length > 2) return 'medium';
    return 'low';
  }

  /**
   * Determine impact level for bug fixes
   */
  private determineBugFixImpact(bugFixes: BugFix[]): 'high' | 'medium' | 'low' {
    const criticalCount = bugFixes.filter(f => f.severity === 'critical').length;
    const highCount = bugFixes.filter(f => f.severity === 'high').length;

    if (criticalCount > 0) return 'high';
    if (highCount > 0 || bugFixes.length > 5) return 'medium';
    return 'low';
  }

  /**
   * Determine impact level for improvements
   */
  private determineImprovementImpact(improvements: Improvement[]): 'high' | 'medium' | 'low' {
    const highImpactCount = improvements.filter(i => i.impact === 'high').length;
    
    if (highImpactCount > 0) return 'high';
    if (improvements.length > 3) return 'medium';
    return 'low';
  }
}

interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
  preRelease: string | null;
  build: string | null;
  raw: string;
}