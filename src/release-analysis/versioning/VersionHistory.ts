/**
 * Version History Tracking and Analysis
 * 
 * Tracks version history, analyzes version progression patterns,
 * and provides insights into release cadence and version trends.
 */

import { VersionRecommendation } from './VersionCalculator';

export interface VersionHistoryEntry {
  version: string;
  timestamp: Date;
  bumpType: 'major' | 'minor' | 'patch' | 'none';
  rationale: string;
  confidence: number;
  breakingChanges: number;
  features: number;
  fixes: number;
  improvements: number;
  source: string; // e.g., "spec-completion", "task-completion", "manual"
}

export interface VersionHistoryAnalysis {
  totalReleases: number;
  majorReleases: number;
  minorReleases: number;
  patchReleases: number;
  averageTimeBetweenReleases: number; // in days
  mostCommonBumpType: 'major' | 'minor' | 'patch';
  breakingChangeFrequency: number; // percentage of releases with breaking changes
  releaseVelocity: {
    last7Days: number;
    last30Days: number;
    last90Days: number;
  };
  versionProgression: VersionProgressionAnalysis;
}

export interface VersionProgressionAnalysis {
  currentVersion: string;
  previousVersion: string | null;
  nextPredictedVersion: string;
  progressionPattern: 'stable' | 'rapid' | 'slow';
  stabilityScore: number; // 0-1, based on breaking change frequency
}

export interface VersionComparisonResult {
  olderVersion: string;
  newerVersion: string;
  bumpType: 'major' | 'minor' | 'patch' | 'none';
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class VersionHistory {
  private history: VersionHistoryEntry[] = [];
  private historyFilePath: string;

  constructor(historyFilePath: string = '.kiro/release-history.json') {
    this.historyFilePath = historyFilePath;
    this.loadHistory();
  }

  /**
   * Add a version to history
   */
  addVersion(recommendation: VersionRecommendation, source: string = 'automatic'): void {
    const entry: VersionHistoryEntry = {
      version: recommendation.recommendedVersion,
      timestamp: new Date(),
      bumpType: recommendation.bumpType,
      rationale: recommendation.rationale,
      confidence: recommendation.confidence,
      breakingChanges: recommendation.evidence.filter(e => e.type === 'breaking').reduce((sum, e) => sum + (e.count || 0), 0),
      features: recommendation.evidence.filter(e => e.type === 'feature').reduce((sum, e) => sum + (e.count || 0), 0),
      fixes: recommendation.evidence.filter(e => e.type === 'fix').reduce((sum, e) => sum + (e.count || 0), 0),
      improvements: recommendation.evidence.filter(e => e.type === 'improvement').reduce((sum, e) => sum + (e.count || 0), 0),
      source
    };

    this.history.push(entry);
    this.saveHistory();
  }

  /**
   * Get complete version history
   */
  getHistory(): VersionHistoryEntry[] {
    return [...this.history];
  }

  /**
   * Get version history for a specific time range
   */
  getHistoryInRange(startDate: Date, endDate: Date): VersionHistoryEntry[] {
    return this.history.filter(entry => 
      entry.timestamp >= startDate && entry.timestamp <= endDate
    );
  }

  /**
   * Get the most recent version entry
   */
  getLatestVersion(): VersionHistoryEntry | null {
    if (this.history.length === 0) {
      return null;
    }
    return this.history[this.history.length - 1];
  }

  /**
   * Get version entry by version string
   */
  getVersionEntry(version: string): VersionHistoryEntry | null {
    return this.history.find(entry => entry.version === version) || null;
  }

  /**
   * Analyze version history and provide insights
   */
  analyzeHistory(): VersionHistoryAnalysis {
    if (this.history.length === 0) {
      return this.getEmptyAnalysis();
    }

    const totalReleases = this.history.length;
    const majorReleases = this.history.filter(e => e.bumpType === 'major').length;
    const minorReleases = this.history.filter(e => e.bumpType === 'minor').length;
    const patchReleases = this.history.filter(e => e.bumpType === 'patch').length;

    const mostCommonBumpType = this.calculateMostCommonBumpType();
    const breakingChangeFrequency = this.calculateBreakingChangeFrequency();
    const averageTimeBetweenReleases = this.calculateAverageTimeBetweenReleases();
    const releaseVelocity = this.calculateReleaseVelocity();
    const versionProgression = this.analyzeVersionProgression();

    return {
      totalReleases,
      majorReleases,
      minorReleases,
      patchReleases,
      averageTimeBetweenReleases,
      mostCommonBumpType,
      breakingChangeFrequency,
      releaseVelocity,
      versionProgression
    };
  }

  /**
   * Compare two versions and validate progression
   */
  compareVersions(olderVersion: string, newerVersion: string): VersionComparisonResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Parse versions
    const olderParsed = this.parseVersion(olderVersion);
    const newerParsed = this.parseVersion(newerVersion);

    if (!olderParsed) {
      errors.push(`Invalid older version format: ${olderVersion}`);
    }

    if (!newerParsed) {
      errors.push(`Invalid newer version format: ${newerVersion}`);
    }

    if (errors.length > 0) {
      return {
        olderVersion,
        newerVersion,
        bumpType: 'none',
        isValid: false,
        errors,
        warnings
      };
    }

    // Determine bump type
    const bumpType = this.determineBumpType(olderParsed!, newerParsed!);

    // Validate progression
    if (bumpType === 'none') {
      if (olderVersion !== newerVersion) {
        errors.push('Versions are different but no valid bump type detected');
      }
    }

    // Check for version regression
    if (this.isVersionRegression(olderParsed!, newerParsed!)) {
      errors.push(`Version regression detected: ${newerVersion} is older than ${olderVersion}`);
    }

    // Check for skipped versions
    if (this.hasSkippedVersions(olderParsed!, newerParsed!, bumpType)) {
      warnings.push(`Version progression skips intermediate versions (${olderVersion} → ${newerVersion})`);
    }

    return {
      olderVersion,
      newerVersion,
      bumpType,
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get release statistics for a time period
   */
  getStatistics(days: number = 30): {
    releases: number;
    majorReleases: number;
    minorReleases: number;
    patchReleases: number;
    averageConfidence: number;
    totalBreakingChanges: number;
    totalFeatures: number;
    totalFixes: number;
  } {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentHistory = this.history.filter(entry => entry.timestamp >= cutoffDate);

    if (recentHistory.length === 0) {
      return {
        releases: 0,
        majorReleases: 0,
        minorReleases: 0,
        patchReleases: 0,
        averageConfidence: 0,
        totalBreakingChanges: 0,
        totalFeatures: 0,
        totalFixes: 0
      };
    }

    return {
      releases: recentHistory.length,
      majorReleases: recentHistory.filter(e => e.bumpType === 'major').length,
      minorReleases: recentHistory.filter(e => e.bumpType === 'minor').length,
      patchReleases: recentHistory.filter(e => e.bumpType === 'patch').length,
      averageConfidence: recentHistory.reduce((sum, e) => sum + e.confidence, 0) / recentHistory.length,
      totalBreakingChanges: recentHistory.reduce((sum, e) => sum + e.breakingChanges, 0),
      totalFeatures: recentHistory.reduce((sum, e) => sum + e.features, 0),
      totalFixes: recentHistory.reduce((sum, e) => sum + e.fixes, 0)
    };
  }

  /**
   * Clear version history (for testing or reset)
   */
  clearHistory(): void {
    this.history = [];
    this.saveHistory();
  }

  /**
   * Load history from file
   */
  private loadHistory(): void {
    try {
      // In a real implementation, this would read from the file system
      // For now, we'll initialize with an empty array
      this.history = [];
    } catch (error) {
      // If file doesn't exist or can't be read, start with empty history
      this.history = [];
    }
  }

  /**
   * Save history to file
   */
  private saveHistory(): void {
    try {
      // In a real implementation, this would write to the file system
      // For now, we'll just keep it in memory
    } catch (error) {
      console.error('Failed to save version history:', error);
    }
  }

  /**
   * Calculate most common bump type
   */
  private calculateMostCommonBumpType(): 'major' | 'minor' | 'patch' {
    const counts = {
      major: this.history.filter(e => e.bumpType === 'major').length,
      minor: this.history.filter(e => e.bumpType === 'minor').length,
      patch: this.history.filter(e => e.bumpType === 'patch').length
    };

    if (counts.major >= counts.minor && counts.major >= counts.patch) {
      return 'major';
    } else if (counts.minor >= counts.patch) {
      return 'minor';
    } else {
      return 'patch';
    }
  }

  /**
   * Calculate breaking change frequency
   */
  private calculateBreakingChangeFrequency(): number {
    if (this.history.length === 0) {
      return 0;
    }

    const releasesWithBreakingChanges = this.history.filter(e => e.breakingChanges > 0).length;
    return (releasesWithBreakingChanges / this.history.length) * 100;
  }

  /**
   * Calculate average time between releases
   */
  private calculateAverageTimeBetweenReleases(): number {
    if (this.history.length < 2) {
      return 0;
    }

    const sortedHistory = [...this.history].sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    );

    let totalDays = 0;
    for (let i = 1; i < sortedHistory.length; i++) {
      const timeDiff = sortedHistory[i].timestamp.getTime() - sortedHistory[i - 1].timestamp.getTime();
      totalDays += timeDiff / (1000 * 60 * 60 * 24);
    }

    return totalDays / (sortedHistory.length - 1);
  }

  /**
   * Calculate release velocity for different time periods
   */
  private calculateReleaseVelocity(): {
    last7Days: number;
    last30Days: number;
    last90Days: number;
  } {
    const now = new Date();
    
    const last7Days = new Date(now);
    last7Days.setDate(last7Days.getDate() - 7);
    
    const last30Days = new Date(now);
    last30Days.setDate(last30Days.getDate() - 30);
    
    const last90Days = new Date(now);
    last90Days.setDate(last90Days.getDate() - 90);

    return {
      last7Days: this.history.filter(e => e.timestamp >= last7Days).length,
      last30Days: this.history.filter(e => e.timestamp >= last30Days).length,
      last90Days: this.history.filter(e => e.timestamp >= last90Days).length
    };
  }

  /**
   * Analyze version progression patterns
   */
  private analyzeVersionProgression(): VersionProgressionAnalysis {
    const latest = this.getLatestVersion();
    
    if (!latest) {
      return {
        currentVersion: '0.0.0',
        previousVersion: null,
        nextPredictedVersion: '0.1.0',
        progressionPattern: 'stable',
        stabilityScore: 1.0
      };
    }

    const sortedHistory = [...this.history].sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    );

    const previousEntry = sortedHistory.length > 1 ? sortedHistory[sortedHistory.length - 2] : null;
    const mostCommonBumpType = this.calculateMostCommonBumpType();
    const nextPredictedVersion = this.predictNextVersion(latest.version, mostCommonBumpType);
    const progressionPattern = this.determineProgressionPattern();
    const stabilityScore = this.calculateStabilityScore();

    return {
      currentVersion: latest.version,
      previousVersion: previousEntry?.version || null,
      nextPredictedVersion,
      progressionPattern,
      stabilityScore
    };
  }

  /**
   * Predict next version based on patterns
   */
  private predictNextVersion(currentVersion: string, bumpType: 'major' | 'minor' | 'patch'): string {
    const parsed = this.parseVersion(currentVersion);
    
    if (!parsed) {
      return currentVersion;
    }

    switch (bumpType) {
      case 'major':
        return `${parsed.major + 1}.0.0`;
      case 'minor':
        return `${parsed.major}.${parsed.minor + 1}.0`;
      case 'patch':
        return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
      default:
        return currentVersion;
    }
  }

  /**
   * Determine progression pattern (stable, rapid, slow)
   */
  private determineProgressionPattern(): 'stable' | 'rapid' | 'slow' {
    const avgTime = this.calculateAverageTimeBetweenReleases();
    
    if (avgTime === 0) {
      return 'stable';
    }

    if (avgTime < 7) {
      return 'rapid';
    } else if (avgTime > 30) {
      return 'slow';
    } else {
      return 'stable';
    }
  }

  /**
   * Calculate stability score based on breaking change frequency
   */
  private calculateStabilityScore(): number {
    const breakingChangeFreq = this.calculateBreakingChangeFrequency();
    
    // Higher breaking change frequency = lower stability
    // 0% breaking changes = 1.0 stability
    // 100% breaking changes = 0.0 stability
    return Math.max(0, Math.min(1, 1 - (breakingChangeFreq / 100)));
  }

  /**
   * Parse semantic version string
   */
  private parseVersion(version: string): { major: number; minor: number; patch: number } | null {
    const semverRegex = /^(\d+)\.(\d+)\.(\d+)/;
    const match = version.match(semverRegex);

    if (!match) {
      return null;
    }

    return {
      major: parseInt(match[1]),
      minor: parseInt(match[2]),
      patch: parseInt(match[3])
    };
  }

  /**
   * Determine bump type between two versions
   */
  private determineBumpType(
    older: { major: number; minor: number; patch: number },
    newer: { major: number; minor: number; patch: number }
  ): 'major' | 'minor' | 'patch' | 'none' {
    if (newer.major > older.major) {
      return 'major';
    } else if (newer.minor > older.minor) {
      return 'minor';
    } else if (newer.patch > older.patch) {
      return 'patch';
    } else {
      return 'none';
    }
  }

  /**
   * Check if newer version is actually older (regression)
   */
  private isVersionRegression(
    older: { major: number; minor: number; patch: number },
    newer: { major: number; minor: number; patch: number }
  ): boolean {
    if (newer.major < older.major) {
      return true;
    } else if (newer.major === older.major && newer.minor < older.minor) {
      return true;
    } else if (newer.major === older.major && newer.minor === older.minor && newer.patch < older.patch) {
      return true;
    }
    return false;
  }

  /**
   * Check if version progression skips intermediate versions
   */
  private hasSkippedVersions(
    older: { major: number; minor: number; patch: number },
    newer: { major: number; minor: number; patch: number },
    bumpType: 'major' | 'minor' | 'patch' | 'none'
  ): boolean {
    switch (bumpType) {
      case 'major':
        return newer.major > older.major + 1;
      case 'minor':
        return newer.major === older.major && newer.minor > older.minor + 1;
      case 'patch':
        return newer.major === older.major && newer.minor === older.minor && newer.patch > older.patch + 1;
      default:
        return false;
    }
  }

  /**
   * Get empty analysis for when there's no history
   */
  private getEmptyAnalysis(): VersionHistoryAnalysis {
    return {
      totalReleases: 0,
      majorReleases: 0,
      minorReleases: 0,
      patchReleases: 0,
      averageTimeBetweenReleases: 0,
      mostCommonBumpType: 'patch',
      breakingChangeFrequency: 0,
      releaseVelocity: {
        last7Days: 0,
        last30Days: 0,
        last90Days: 0
      },
      versionProgression: {
        currentVersion: '0.0.0',
        previousVersion: null,
        nextPredictedVersion: '0.1.0',
        progressionPattern: 'stable',
        stabilityScore: 1.0
      }
    };
  }
}
