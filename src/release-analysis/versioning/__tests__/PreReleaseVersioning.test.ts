/**
 * Unit tests for Pre-Release Version Management
 * 
 * Tests alpha, beta, and rc version generation, progression, and promotion
 * according to semantic versioning pre-release conventions.
 * 
 * Requirement 1.5: WHEN pre-release versions are used THEN the system SHALL 
 * follow semantic versioning pre-release conventions (alpha, beta, rc)
 */

import { VersionCalculator } from '../VersionCalculator';

describe('Pre-Release Version Management', () => {
  let calculator: VersionCalculator;

  beforeEach(() => {
    calculator = new VersionCalculator();
  });

  describe('generatePreReleaseVersion', () => {
    it('should generate alpha pre-release version', () => {
      const result = calculator.generatePreReleaseVersion('1.2.3', 'alpha', 1);
      expect(result).toBe('1.2.3-alpha.1');
    });

    it('should generate beta pre-release version', () => {
      const result = calculator.generatePreReleaseVersion('1.2.3', 'beta', 1);
      expect(result).toBe('1.2.3-beta.1');
    });

    it('should generate rc pre-release version', () => {
      const result = calculator.generatePreReleaseVersion('1.2.3', 'rc', 1);
      expect(result).toBe('1.2.3-rc.1');
    });

    it('should default to pre-release number 1', () => {
      const result = calculator.generatePreReleaseVersion('1.2.3', 'alpha');
      expect(result).toBe('1.2.3-alpha.1');
    });

    it('should handle custom pre-release numbers', () => {
      const result = calculator.generatePreReleaseVersion('1.2.3', 'beta', 5);
      expect(result).toBe('1.2.3-beta.5');
    });

    it('should strip existing pre-release identifier', () => {
      const result = calculator.generatePreReleaseVersion('1.2.3-alpha.1', 'beta', 1);
      expect(result).toBe('1.2.3-beta.1');
    });

    it('should handle version with build metadata', () => {
      const result = calculator.generatePreReleaseVersion('1.2.3+build.123', 'alpha', 1);
      expect(result).toBe('1.2.3-alpha.1');
    });
  });

  describe('progressPreReleaseStage', () => {
    it('should progress from alpha to beta', () => {
      const result = calculator.progressPreReleaseStage('1.2.3-alpha.5');
      expect(result).toBe('1.2.3-beta.1');
    });

    it('should progress from beta to rc', () => {
      const result = calculator.progressPreReleaseStage('1.2.3-beta.3');
      expect(result).toBe('1.2.3-rc.1');
    });

    it('should progress from rc to stable', () => {
      const result = calculator.progressPreReleaseStage('1.2.3-rc.2');
      expect(result).toBe('1.2.3');
    });

    it('should handle pre-release without number', () => {
      const result = calculator.progressPreReleaseStage('1.2.3-alpha');
      expect(result).toBe('1.2.3-beta.1');
    });

    it('should throw error for stable version', () => {
      expect(() => {
        calculator.progressPreReleaseStage('1.2.3');
      }).toThrow('Version 1.2.3 is not a pre-release version');
    });

    it('should throw error for invalid pre-release format', () => {
      expect(() => {
        calculator.progressPreReleaseStage('1.2.3-invalid.1');
      }).toThrow('Invalid pre-release format: invalid.1');
    });
  });

  describe('incrementPreReleaseNumber', () => {
    it('should increment alpha version number', () => {
      const result = calculator.incrementPreReleaseNumber('1.2.3-alpha.1');
      expect(result).toBe('1.2.3-alpha.2');
    });

    it('should increment beta version number', () => {
      const result = calculator.incrementPreReleaseNumber('1.2.3-beta.5');
      expect(result).toBe('1.2.3-beta.6');
    });

    it('should increment rc version number', () => {
      const result = calculator.incrementPreReleaseNumber('1.2.3-rc.1');
      expect(result).toBe('1.2.3-rc.2');
    });

    it('should handle pre-release without number', () => {
      const result = calculator.incrementPreReleaseNumber('1.2.3-alpha');
      expect(result).toBe('1.2.3-alpha.1');
    });

    it('should throw error for stable version', () => {
      expect(() => {
        calculator.incrementPreReleaseNumber('1.2.3');
      }).toThrow('Version 1.2.3 is not a pre-release version');
    });

    it('should throw error for invalid pre-release format', () => {
      expect(() => {
        calculator.incrementPreReleaseNumber('1.2.3-invalid.1');
      }).toThrow('Invalid pre-release format: invalid.1');
    });
  });

  describe('promoteToStable', () => {
    it('should promote alpha to stable', () => {
      const result = calculator.promoteToStable('1.2.3-alpha.5');
      expect(result).toBe('1.2.3');
    });

    it('should promote beta to stable', () => {
      const result = calculator.promoteToStable('1.2.3-beta.3');
      expect(result).toBe('1.2.3');
    });

    it('should promote rc to stable', () => {
      const result = calculator.promoteToStable('1.2.3-rc.1');
      expect(result).toBe('1.2.3');
    });

    it('should throw error for stable version', () => {
      expect(() => {
        calculator.promoteToStable('1.2.3');
      }).toThrow('Version 1.2.3 is already a stable version');
    });
  });

  describe('isPreRelease', () => {
    it('should return true for alpha version', () => {
      expect(calculator.isPreRelease('1.2.3-alpha.1')).toBe(true);
    });

    it('should return true for beta version', () => {
      expect(calculator.isPreRelease('1.2.3-beta.1')).toBe(true);
    });

    it('should return true for rc version', () => {
      expect(calculator.isPreRelease('1.2.3-rc.1')).toBe(true);
    });

    it('should return false for stable version', () => {
      expect(calculator.isPreRelease('1.2.3')).toBe(false);
    });

    it('should return false for invalid version', () => {
      expect(calculator.isPreRelease('invalid')).toBe(false);
    });

    it('should return true for pre-release without number', () => {
      expect(calculator.isPreRelease('1.2.3-alpha')).toBe(true);
    });
  });

  describe('getPreReleaseType', () => {
    it('should return alpha for alpha version', () => {
      expect(calculator.getPreReleaseType('1.2.3-alpha.1')).toBe('alpha');
    });

    it('should return beta for beta version', () => {
      expect(calculator.getPreReleaseType('1.2.3-beta.1')).toBe('beta');
    });

    it('should return rc for rc version', () => {
      expect(calculator.getPreReleaseType('1.2.3-rc.1')).toBe('rc');
    });

    it('should return null for stable version', () => {
      expect(calculator.getPreReleaseType('1.2.3')).toBeNull();
    });

    it('should return null for invalid version', () => {
      expect(calculator.getPreReleaseType('invalid')).toBeNull();
    });

    it('should return null for invalid pre-release format', () => {
      expect(calculator.getPreReleaseType('1.2.3-invalid.1')).toBeNull();
    });

    it('should handle pre-release without number', () => {
      expect(calculator.getPreReleaseType('1.2.3-alpha')).toBe('alpha');
    });
  });

  describe('getPreReleaseNumber', () => {
    it('should return number for alpha version', () => {
      expect(calculator.getPreReleaseNumber('1.2.3-alpha.5')).toBe(5);
    });

    it('should return number for beta version', () => {
      expect(calculator.getPreReleaseNumber('1.2.3-beta.10')).toBe(10);
    });

    it('should return number for rc version', () => {
      expect(calculator.getPreReleaseNumber('1.2.3-rc.2')).toBe(2);
    });

    it('should return 0 for pre-release without number', () => {
      expect(calculator.getPreReleaseNumber('1.2.3-alpha')).toBe(0);
    });

    it('should return null for stable version', () => {
      expect(calculator.getPreReleaseNumber('1.2.3')).toBeNull();
    });

    it('should return null for invalid version', () => {
      expect(calculator.getPreReleaseNumber('invalid')).toBeNull();
    });

    it('should return null for invalid pre-release format', () => {
      expect(calculator.getPreReleaseNumber('1.2.3-invalid.1')).toBeNull();
    });
  });

  describe('Pre-Release Progression Scenarios', () => {
    it('should handle complete alpha to stable progression', () => {
      // Start with alpha.1
      let version = calculator.generatePreReleaseVersion('1.2.3', 'alpha', 1);
      expect(version).toBe('1.2.3-alpha.1');

      // Increment to alpha.2
      version = calculator.incrementPreReleaseNumber(version);
      expect(version).toBe('1.2.3-alpha.2');

      // Progress to beta.1
      version = calculator.progressPreReleaseStage(version);
      expect(version).toBe('1.2.3-beta.1');

      // Increment to beta.2
      version = calculator.incrementPreReleaseNumber(version);
      expect(version).toBe('1.2.3-beta.2');

      // Progress to rc.1
      version = calculator.progressPreReleaseStage(version);
      expect(version).toBe('1.2.3-rc.1');

      // Promote to stable
      version = calculator.promoteToStable(version);
      expect(version).toBe('1.2.3');
    });

    it('should handle skipping stages with progressPreReleaseStage', () => {
      // Start with alpha
      let version = calculator.generatePreReleaseVersion('2.0.0', 'alpha', 1);
      
      // Progress through stages
      version = calculator.progressPreReleaseStage(version); // alpha → beta
      expect(version).toBe('2.0.0-beta.1');
      
      version = calculator.progressPreReleaseStage(version); // beta → rc
      expect(version).toBe('2.0.0-rc.1');
      
      version = calculator.progressPreReleaseStage(version); // rc → stable
      expect(version).toBe('2.0.0');
    });

    it('should handle direct promotion from any stage', () => {
      // Alpha to stable
      let version = calculator.generatePreReleaseVersion('1.0.0', 'alpha', 3);
      expect(calculator.promoteToStable(version)).toBe('1.0.0');

      // Beta to stable
      version = calculator.generatePreReleaseVersion('1.0.0', 'beta', 2);
      expect(calculator.promoteToStable(version)).toBe('1.0.0');

      // RC to stable
      version = calculator.generatePreReleaseVersion('1.0.0', 'rc', 1);
      expect(calculator.promoteToStable(version)).toBe('1.0.0');
    });

    it('should handle multiple increments at same stage', () => {
      let version = calculator.generatePreReleaseVersion('1.5.0', 'beta', 1);
      
      // Increment multiple times
      version = calculator.incrementPreReleaseNumber(version);
      expect(version).toBe('1.5.0-beta.2');
      
      version = calculator.incrementPreReleaseNumber(version);
      expect(version).toBe('1.5.0-beta.3');
      
      version = calculator.incrementPreReleaseNumber(version);
      expect(version).toBe('1.5.0-beta.4');
    });
  });

  describe('Integration with calculateVersionBump', () => {
    it('should include pre-release info in version recommendation', () => {
      const changes = {
        breakingChanges: [],
        newFeatures: [{
          id: '1',
          title: 'New feature',
          description: 'Added feature',
          benefits: [],
          requirements: [],
          artifacts: [],
          source: 'test.md',
          category: 'enhancement' as const
        }],
        bugFixes: [],
        improvements: [],
        documentation: [],
        metadata: {
          documentsAnalyzed: 1,
          extractionConfidence: 0.9,
          ambiguousItems: [],
          filteredItems: []
        }
      };

      const result = calculator.calculateVersionBump(changes, '1.2.3-beta.2');

      expect(result.preReleaseInfo).toBeDefined();
      expect(result.preReleaseInfo?.isPreRelease).toBe(true);
      expect(result.preReleaseInfo?.preReleaseType).toBe('beta');
      expect(result.preReleaseInfo?.preReleaseNumber).toBe(2);
      expect(result.preReleaseInfo?.nextPreRelease).toBe('beta.3');
    });

    it('should indicate promotion capability for rc versions', () => {
      const changes = {
        breakingChanges: [],
        newFeatures: [{
          id: '1',
          title: 'New feature',
          description: 'Added feature',
          benefits: [],
          requirements: [],
          artifacts: [],
          source: 'test.md',
          category: 'enhancement' as const
        }],
        bugFixes: [],
        improvements: [],
        documentation: [],
        metadata: {
          documentsAnalyzed: 1,
          extractionConfidence: 0.9,
          ambiguousItems: [],
          filteredItems: []
        }
      };

      const result = calculator.calculateVersionBump(changes, '1.2.3-rc.1');

      expect(result.preReleaseInfo?.canPromote).toBe(true);
    });

    it('should not indicate promotion for rc with no changes', () => {
      const changes = {
        breakingChanges: [],
        newFeatures: [],
        bugFixes: [],
        improvements: [],
        documentation: [],
        metadata: {
          documentsAnalyzed: 1,
          extractionConfidence: 0.9,
          ambiguousItems: [],
          filteredItems: []
        }
      };

      const result = calculator.calculateVersionBump(changes, '1.2.3-rc.1');

      expect(result.preReleaseInfo?.canPromote).toBe(false);
    });
  });
});
