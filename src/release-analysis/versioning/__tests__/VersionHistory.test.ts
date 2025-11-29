/**
 * Unit tests for VersionHistory
 * 
 * Tests version history tracking, analysis, and comparison functionality
 */

import { VersionHistory } from '../VersionHistory';
import { VersionRecommendation } from '../VersionCalculator';

describe('VersionHistory', () => {
  let history: VersionHistory;

  beforeEach(() => {
    history = new VersionHistory();
    history.clearHistory(); // Ensure clean state
  });

  describe('addVersion', () => {
    it('should add version to history', () => {
      const recommendation: VersionRecommendation = {
        currentVersion: '1.0.0',
        recommendedVersion: '1.1.0',
        bumpType: 'minor',
        rationale: 'Added new features',
        confidence: 0.9,
        evidence: [
          {
            type: 'feature',
            description: '2 new features',
            source: 'completion docs',
            impact: 'medium',
            count: 2
          }
        ]
      };

      history.addVersion(recommendation, 'automatic');

      const entries = history.getHistory();
      expect(entries).toHaveLength(1);
      expect(entries[0].version).toBe('1.1.0');
      expect(entries[0].bumpType).toBe('minor');
      expect(entries[0].features).toBe(2);
    });

    it('should track breaking changes count', () => {
      const recommendation: VersionRecommendation = {
        currentVersion: '1.0.0',
        recommendedVersion: '2.0.0',
        bumpType: 'major',
        rationale: 'Breaking changes',
        confidence: 0.95,
        evidence: [
          {
            type: 'breaking',
            description: '3 breaking changes',
            source: 'completion docs',
            impact: 'high',
            count: 3
          }
        ]
      };

      history.addVersion(recommendation);

      const entries = history.getHistory();
      expect(entries[0].breakingChanges).toBe(3);
    });

    it('should track multiple change types', () => {
      const recommendation: VersionRecommendation = {
        currentVersion: '1.0.0',
        recommendedVersion: '1.1.0',
        bumpType: 'minor',
        rationale: 'Mixed changes',
        confidence: 0.85,
        evidence: [
          {
            type: 'feature',
            description: '2 features',
            source: 'completion docs',
            impact: 'medium',
            count: 2
          },
          {
            type: 'fix',
            description: '3 bug fixes',
            source: 'completion docs',
            impact: 'low',
            count: 3
          },
          {
            type: 'improvement',
            description: '1 improvement',
            source: 'completion docs',
            impact: 'low',
            count: 1
          }
        ]
      };

      history.addVersion(recommendation);

      const entries = history.getHistory();
      expect(entries[0].features).toBe(2);
      expect(entries[0].fixes).toBe(3);
      expect(entries[0].improvements).toBe(1);
    });
  });

  describe('getHistory', () => {
    it('should return empty array for new history', () => {
      const entries = history.getHistory();
      expect(entries).toEqual([]);
    });

    it('should return all history entries', () => {
      const rec1: VersionRecommendation = {
        currentVersion: '1.0.0',
        recommendedVersion: '1.1.0',
        bumpType: 'minor',
        rationale: 'Features',
        confidence: 0.9,
        evidence: []
      };

      const rec2: VersionRecommendation = {
        currentVersion: '1.1.0',
        recommendedVersion: '1.1.1',
        bumpType: 'patch',
        rationale: 'Fixes',
        confidence: 0.85,
        evidence: []
      };

      history.addVersion(rec1);
      history.addVersion(rec2);

      const entries = history.getHistory();
      expect(entries).toHaveLength(2);
      expect(entries[0].version).toBe('1.1.0');
      expect(entries[1].version).toBe('1.1.1');
    });
  });

  describe('getLatestVersion', () => {
    it('should return null for empty history', () => {
      const latest = history.getLatestVersion();
      expect(latest).toBeNull();
    });

    it('should return most recent version', () => {
      const rec1: VersionRecommendation = {
        currentVersion: '1.0.0',
        recommendedVersion: '1.1.0',
        bumpType: 'minor',
        rationale: 'Features',
        confidence: 0.9,
        evidence: []
      };

      const rec2: VersionRecommendation = {
        currentVersion: '1.1.0',
        recommendedVersion: '1.2.0',
        bumpType: 'minor',
        rationale: 'More features',
        confidence: 0.9,
        evidence: []
      };

      history.addVersion(rec1);
      history.addVersion(rec2);

      const latest = history.getLatestVersion();
      expect(latest?.version).toBe('1.2.0');
    });
  });

  describe('getVersionEntry', () => {
    it('should return null for non-existent version', () => {
      const entry = history.getVersionEntry('1.0.0');
      expect(entry).toBeNull();
    });

    it('should return specific version entry', () => {
      const rec: VersionRecommendation = {
        currentVersion: '1.0.0',
        recommendedVersion: '1.1.0',
        bumpType: 'minor',
        rationale: 'Features',
        confidence: 0.9,
        evidence: []
      };

      history.addVersion(rec);

      const entry = history.getVersionEntry('1.1.0');
      expect(entry).not.toBeNull();
      expect(entry?.version).toBe('1.1.0');
      expect(entry?.bumpType).toBe('minor');
    });
  });

  describe('analyzeHistory', () => {
    it('should return empty analysis for no history', () => {
      const analysis = history.analyzeHistory();

      expect(analysis.totalReleases).toBe(0);
      expect(analysis.majorReleases).toBe(0);
      expect(analysis.minorReleases).toBe(0);
      expect(analysis.patchReleases).toBe(0);
      expect(analysis.versionProgression.currentVersion).toBe('0.0.0');
    });

    it('should count release types correctly', () => {
      const recommendations: VersionRecommendation[] = [
        {
          currentVersion: '1.0.0',
          recommendedVersion: '2.0.0',
          bumpType: 'major',
          rationale: 'Breaking',
          confidence: 0.9,
          evidence: []
        },
        {
          currentVersion: '2.0.0',
          recommendedVersion: '2.1.0',
          bumpType: 'minor',
          rationale: 'Features',
          confidence: 0.9,
          evidence: []
        },
        {
          currentVersion: '2.1.0',
          recommendedVersion: '2.1.1',
          bumpType: 'patch',
          rationale: 'Fixes',
          confidence: 0.9,
          evidence: []
        },
        {
          currentVersion: '2.1.1',
          recommendedVersion: '2.2.0',
          bumpType: 'minor',
          rationale: 'More features',
          confidence: 0.9,
          evidence: []
        }
      ];

      recommendations.forEach(rec => history.addVersion(rec));

      const analysis = history.analyzeHistory();

      expect(analysis.totalReleases).toBe(4);
      expect(analysis.majorReleases).toBe(1);
      expect(analysis.minorReleases).toBe(2);
      expect(analysis.patchReleases).toBe(1);
    });

    it('should calculate most common bump type', () => {
      const recommendations: VersionRecommendation[] = [
        {
          currentVersion: '1.0.0',
          recommendedVersion: '1.1.0',
          bumpType: 'minor',
          rationale: 'Features',
          confidence: 0.9,
          evidence: []
        },
        {
          currentVersion: '1.1.0',
          recommendedVersion: '1.2.0',
          bumpType: 'minor',
          rationale: 'More features',
          confidence: 0.9,
          evidence: []
        },
        {
          currentVersion: '1.2.0',
          recommendedVersion: '1.2.1',
          bumpType: 'patch',
          rationale: 'Fixes',
          confidence: 0.9,
          evidence: []
        }
      ];

      recommendations.forEach(rec => history.addVersion(rec));

      const analysis = history.analyzeHistory();

      expect(analysis.mostCommonBumpType).toBe('minor');
    });

    it('should calculate breaking change frequency', () => {
      const recommendations: VersionRecommendation[] = [
        {
          currentVersion: '1.0.0',
          recommendedVersion: '2.0.0',
          bumpType: 'major',
          rationale: 'Breaking',
          confidence: 0.9,
          evidence: [
            {
              type: 'breaking',
              description: 'Breaking changes',
              source: 'test',
              impact: 'high',
              count: 2
            }
          ]
        },
        {
          currentVersion: '2.0.0',
          recommendedVersion: '2.1.0',
          bumpType: 'minor',
          rationale: 'Features',
          confidence: 0.9,
          evidence: []
        },
        {
          currentVersion: '2.1.0',
          recommendedVersion: '2.1.1',
          bumpType: 'patch',
          rationale: 'Fixes',
          confidence: 0.9,
          evidence: []
        },
        {
          currentVersion: '2.1.1',
          recommendedVersion: '2.1.2',
          bumpType: 'patch',
          rationale: 'More fixes',
          confidence: 0.9,
          evidence: []
        }
      ];

      recommendations.forEach(rec => history.addVersion(rec));

      const analysis = history.analyzeHistory();

      // 1 out of 4 releases has breaking changes = 25%
      expect(analysis.breakingChangeFrequency).toBe(25);
    });

    it('should calculate stability score', () => {
      const recommendations: VersionRecommendation[] = [
        {
          currentVersion: '1.0.0',
          recommendedVersion: '1.1.0',
          bumpType: 'minor',
          rationale: 'Features',
          confidence: 0.9,
          evidence: []
        },
        {
          currentVersion: '1.1.0',
          recommendedVersion: '1.2.0',
          bumpType: 'minor',
          rationale: 'More features',
          confidence: 0.9,
          evidence: []
        }
      ];

      recommendations.forEach(rec => history.addVersion(rec));

      const analysis = history.analyzeHistory();

      // No breaking changes = 100% stability = 1.0 score
      expect(analysis.versionProgression.stabilityScore).toBe(1.0);
    });
  });

  describe('compareVersions', () => {
    it('should detect major version bump', () => {
      const result = history.compareVersions('1.2.3', '2.0.0');

      expect(result.bumpType).toBe('major');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect minor version bump', () => {
      const result = history.compareVersions('1.2.3', '1.3.0');

      expect(result.bumpType).toBe('minor');
      expect(result.isValid).toBe(true);
    });

    it('should detect patch version bump', () => {
      const result = history.compareVersions('1.2.3', '1.2.4');

      expect(result.bumpType).toBe('patch');
      expect(result.isValid).toBe(true);
    });

    it('should detect no version change', () => {
      const result = history.compareVersions('1.2.3', '1.2.3');

      expect(result.bumpType).toBe('none');
      expect(result.isValid).toBe(true);
    });

    it('should detect invalid version format', () => {
      const result = history.compareVersions('invalid', '1.2.3');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid older version format: invalid');
    });

    it('should detect version regression', () => {
      const result = history.compareVersions('2.0.0', '1.9.9');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Version regression detected: 1.9.9 is older than 2.0.0');
    });

    it('should warn about skipped versions', () => {
      const result = history.compareVersions('1.2.3', '1.2.5');

      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('Version progression skips intermediate versions (1.2.3 → 1.2.5)');
    });

    it('should warn about skipped minor versions', () => {
      const result = history.compareVersions('1.2.3', '1.5.0');

      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('Version progression skips intermediate versions (1.2.3 → 1.5.0)');
    });

    it('should warn about skipped major versions', () => {
      const result = history.compareVersions('1.2.3', '3.0.0');

      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('Version progression skips intermediate versions (1.2.3 → 3.0.0)');
    });
  });

  describe('getStatistics', () => {
    it('should return zero statistics for empty history', () => {
      const stats = history.getStatistics(30);

      expect(stats.releases).toBe(0);
      expect(stats.majorReleases).toBe(0);
      expect(stats.minorReleases).toBe(0);
      expect(stats.patchReleases).toBe(0);
      expect(stats.averageConfidence).toBe(0);
    });

    it('should calculate statistics for time period', () => {
      const recommendations: VersionRecommendation[] = [
        {
          currentVersion: '1.0.0',
          recommendedVersion: '2.0.0',
          bumpType: 'major',
          rationale: 'Breaking',
          confidence: 0.9,
          evidence: [
            {
              type: 'breaking',
              description: 'Breaking changes',
              source: 'test',
              impact: 'high',
              count: 2
            }
          ]
        },
        {
          currentVersion: '2.0.0',
          recommendedVersion: '2.1.0',
          bumpType: 'minor',
          rationale: 'Features',
          confidence: 0.85,
          evidence: [
            {
              type: 'feature',
              description: 'New features',
              source: 'test',
              impact: 'medium',
              count: 3
            }
          ]
        },
        {
          currentVersion: '2.1.0',
          recommendedVersion: '2.1.1',
          bumpType: 'patch',
          rationale: 'Fixes',
          confidence: 0.8,
          evidence: [
            {
              type: 'fix',
              description: 'Bug fixes',
              source: 'test',
              impact: 'low',
              count: 5
            }
          ]
        }
      ];

      recommendations.forEach(rec => history.addVersion(rec));

      const stats = history.getStatistics(30);

      expect(stats.releases).toBe(3);
      expect(stats.majorReleases).toBe(1);
      expect(stats.minorReleases).toBe(1);
      expect(stats.patchReleases).toBe(1);
      expect(stats.averageConfidence).toBeCloseTo(0.85, 2);
      expect(stats.totalBreakingChanges).toBe(2);
      expect(stats.totalFeatures).toBe(3);
      expect(stats.totalFixes).toBe(5);
    });
  });

  describe('getHistoryInRange', () => {
    it('should return empty array for no history in range', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const entries = history.getHistoryInRange(startDate, endDate);

      expect(entries).toEqual([]);
    });

    it('should filter history by date range', () => {
      // Add versions with different timestamps
      const rec1: VersionRecommendation = {
        currentVersion: '1.0.0',
        recommendedVersion: '1.1.0',
        bumpType: 'minor',
        rationale: 'Features',
        confidence: 0.9,
        evidence: []
      };

      history.addVersion(rec1);

      // Get all history (should include the version we just added)
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const entries = history.getHistoryInRange(yesterday, tomorrow);

      expect(entries).toHaveLength(1);
      expect(entries[0].version).toBe('1.1.0');
    });
  });

  describe('clearHistory', () => {
    it('should clear all history', () => {
      const rec: VersionRecommendation = {
        currentVersion: '1.0.0',
        recommendedVersion: '1.1.0',
        bumpType: 'minor',
        rationale: 'Features',
        confidence: 0.9,
        evidence: []
      };

      history.addVersion(rec);
      expect(history.getHistory()).toHaveLength(1);

      history.clearHistory();
      expect(history.getHistory()).toHaveLength(0);
    });
  });
});
