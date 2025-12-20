/**
 * @category evergreen
 * @purpose Verify build system generates required outputs with correct structure
 */
/**
 * Progress Tracker Tests
 * 
 * Tests for build progress tracking functionality including:
 * - Progress tracking across multiple platforms
 * - Real-time progress updates
 * - Build completion reporting
 * - Duration formatting and statistics
 */

import { ProgressTracker, BuildProgress, BuildCompletionReport } from '../ProgressTracker';
import { Platform } from '../../types/Platform';
import { BuildResult } from '../../types/BuildResult';

describe('ProgressTracker', () => {
  describe('initialization', () => {
    it('should initialize with platforms', () => {
      const platforms: Platform[] = ['ios', 'android', 'web'];
      const tracker = new ProgressTracker(platforms);
      
      const progress = tracker.getProgress();
      
      expect(progress.totalPlatforms).toBe(3);
      expect(progress.completedPlatforms).toBe(0);
      expect(progress.failedPlatforms).toBe(0);
      expect(progress.activePlatforms).toBe(0);
      expect(progress.overallProgress).toBe(0);
      expect(progress.phase).toBe('initializing');
    });

    it('should initialize platform statuses', () => {
      const platforms: Platform[] = ['ios', 'web'];
      const tracker = new ProgressTracker(platforms);
      
      const progress = tracker.getProgress();
      
      expect(progress.platformStatuses.size).toBe(2);
      expect(progress.platformStatuses.has('ios')).toBe(true);
      expect(progress.platformStatuses.has('web')).toBe(true);
      
      const iosStatus = progress.platformStatuses.get('ios');
      expect(iosStatus?.phase).toBe('initializing');
      expect(iosStatus?.progress).toBe(0);
    });
  });

  describe('platform tracking', () => {
    it('should start platform build', () => {
      const tracker = new ProgressTracker(['ios']);
      
      tracker.startPlatform('ios', 'Building iOS package');
      const progress = tracker.getProgress();
      
      const iosStatus = progress.platformStatuses.get('ios');
      expect(iosStatus?.phase).toBe('building');
      expect(iosStatus?.startTime).toBeDefined();
      expect(iosStatus?.currentOperation).toBe('Building iOS package');
      expect(progress.activePlatforms).toBe(1);
    });

    it('should update platform progress', () => {
      const tracker = new ProgressTracker(['android']);
      
      tracker.startPlatform('android');
      tracker.updatePlatform('android', 'validating', 50, 'Validating tokens');
      
      const progress = tracker.getProgress();
      const androidStatus = progress.platformStatuses.get('android');
      
      expect(androidStatus?.phase).toBe('validating');
      expect(androidStatus?.progress).toBe(50);
      expect(androidStatus?.currentOperation).toBe('Validating tokens');
    });

    it('should complete platform build', () => {
      const tracker = new ProgressTracker(['web']);
      
      tracker.startPlatform('web');
      
      const result: BuildResult = {
        platform: 'web',
        success: true,
        packagePath: '/dist/web',
        duration: 5000,
        warnings: [],
        errors: [],
      };
      
      tracker.completePlatform('web', result);
      
      const progress = tracker.getProgress();
      const webStatus = progress.platformStatuses.get('web');
      
      expect(webStatus?.phase).toBe('complete');
      expect(webStatus?.success).toBe(true);
      expect(webStatus?.duration).toBe(5000);
      expect(webStatus?.progress).toBe(100);
      expect(progress.completedPlatforms).toBe(1);
      expect(progress.activePlatforms).toBe(0);
    });

    it('should handle failed platform build', () => {
      const tracker = new ProgressTracker(['ios']);
      
      tracker.startPlatform('ios');
      
      const result: BuildResult = {
        platform: 'ios',
        success: false,
        packagePath: '',
        duration: 2000,
        warnings: [],
        errors: [{
          code: 'BUILD_FAILED',
          message: 'Compilation error',
          severity: 'error',
          category: 'build',
          context: {},
          suggestions: [],
          documentation: [],
        }],
      };
      
      tracker.completePlatform('ios', result);
      
      const progress = tracker.getProgress();
      const iosStatus = progress.platformStatuses.get('ios');
      
      expect(iosStatus?.phase).toBe('failed');
      expect(iosStatus?.success).toBe(false);
      expect(progress.failedPlatforms).toBe(1);
    });

    it('should throw error for unknown platform', () => {
      const tracker = new ProgressTracker(['ios']);
      
      expect(() => {
        tracker.startPlatform('android' as Platform);
      }).toThrow('Platform android not found in tracker');
    });
  });

  describe('overall progress calculation', () => {
    it('should calculate overall progress from platform progress', () => {
      const tracker = new ProgressTracker(['ios', 'android', 'web']);
      
      tracker.startPlatform('ios');
      tracker.updatePlatform('ios', 'building', 100);
      
      tracker.startPlatform('android');
      tracker.updatePlatform('android', 'building', 50);
      
      tracker.startPlatform('web');
      tracker.updatePlatform('web', 'building', 0);
      
      const progress = tracker.getProgress();
      
      // (100 + 50 + 0) / 3 = 50
      expect(progress.overallProgress).toBe(50);
    });

    it('should track active platforms', () => {
      const tracker = new ProgressTracker(['ios', 'android', 'web']);
      
      tracker.startPlatform('ios');
      tracker.startPlatform('android');
      
      const progress = tracker.getProgress();
      expect(progress.activePlatforms).toBe(2);
    });

    it('should track completed and failed platforms', () => {
      const tracker = new ProgressTracker(['ios', 'android', 'web']);
      
      tracker.startPlatform('ios');
      tracker.completePlatform('ios', {
        platform: 'ios',
        success: true,
        packagePath: '/dist/ios',
        duration: 3000,
        warnings: [],
        errors: [],
      });
      
      tracker.startPlatform('android');
      tracker.completePlatform('android', {
        platform: 'android',
        success: false,
        packagePath: '',
        duration: 1000,
        warnings: [],
        errors: [],
      });
      
      const progress = tracker.getProgress();
      expect(progress.completedPlatforms).toBe(2);
      expect(progress.failedPlatforms).toBe(1);
    });
  });

  describe('progress callbacks', () => {
    it('should notify callbacks on progress updates', () => {
      const tracker = new ProgressTracker(['ios']);
      const progressUpdates: BuildProgress[] = [];
      
      tracker.onProgress((progress) => {
        progressUpdates.push(progress);
      });
      
      tracker.startPlatform('ios');
      tracker.updatePlatform('ios', 'building', 50);
      
      expect(progressUpdates.length).toBeGreaterThan(0);
      expect(progressUpdates[progressUpdates.length - 1].overallProgress).toBe(50);
    });

    it('should support multiple callbacks', () => {
      const tracker = new ProgressTracker(['web']);
      let callback1Called = false;
      let callback2Called = false;
      
      tracker.onProgress(() => { callback1Called = true; });
      tracker.onProgress(() => { callback2Called = true; });
      
      tracker.startPlatform('web');
      
      expect(callback1Called).toBe(true);
      expect(callback2Called).toBe(true);
    });

    it('should handle callback errors gracefully', () => {
      const tracker = new ProgressTracker(['ios']);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      tracker.onProgress(() => {
        throw new Error('Callback error');
      });
      
      // Should not throw
      expect(() => {
        tracker.startPlatform('ios');
      }).not.toThrow();
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('build completion', () => {
    it('should mark build as complete', () => {
      const tracker = new ProgressTracker(['ios']);
      
      tracker.startPlatform('ios');
      tracker.completePlatform('ios', {
        platform: 'ios',
        success: true,
        packagePath: '/dist/ios',
        duration: 5000,
        warnings: [],
        errors: [],
      });
      
      tracker.complete();
      
      const progress = tracker.getProgress();
      expect(progress.phase).toBe('complete');
      expect(progress.endTime).toBeDefined();
    });

    it('should set failed phase when builds fail', () => {
      const tracker = new ProgressTracker(['ios']);
      
      tracker.startPlatform('ios');
      tracker.completePlatform('ios', {
        platform: 'ios',
        success: false,
        packagePath: '',
        duration: 2000,
        warnings: [],
        errors: [],
      });
      
      tracker.complete();
      
      const progress = tracker.getProgress();
      expect(progress.phase).toBe('failed');
    });
  });

  describe('completion report generation', () => {
    it('should generate successful build report', () => {
      const tracker = new ProgressTracker(['ios', 'android']);
      
      const results: BuildResult[] = [
        {
          platform: 'ios',
          success: true,
          packagePath: '/dist/ios',
          duration: 5000,
          warnings: [],
          errors: [],
        },
        {
          platform: 'android',
          success: true,
          packagePath: '/dist/android',
          duration: 7000,
          warnings: [],
          errors: [],
        },
      ];
      
      tracker.startPlatform('ios');
      tracker.completePlatform('ios', results[0]);
      tracker.startPlatform('android');
      tracker.completePlatform('android', results[1]);
      tracker.complete();
      
      const report = tracker.generateReport(results);
      
      expect(report.status).toBe('success');
      expect(report.successCount).toBe(2);
      expect(report.failureCount).toBe(0);
      expect(report.totalPlatforms).toBe(2);
      expect(report.averageBuildTime).toBe(6000);
      expect(report.fastestBuildTime).toBe(5000);
      expect(report.slowestBuildTime).toBe(7000);
      expect(report.summary).toContain('Successfully built 2 platforms');
    });

    it('should generate failed build report', () => {
      const tracker = new ProgressTracker(['ios', 'android']);
      
      const results: BuildResult[] = [
        {
          platform: 'ios',
          success: false,
          packagePath: '',
          duration: 2000,
          warnings: [],
          errors: [],
        },
        {
          platform: 'android',
          success: false,
          packagePath: '',
          duration: 1500,
          warnings: [],
          errors: [],
        },
      ];
      
      results.forEach(result => {
        tracker.startPlatform(result.platform);
        tracker.completePlatform(result.platform, result);
      });
      tracker.complete();
      
      const report = tracker.generateReport(results);
      
      expect(report.status).toBe('failure');
      expect(report.successCount).toBe(0);
      expect(report.failureCount).toBe(2);
      expect(report.summary).toContain('All 2 platform builds failed');
    });

    it('should generate partial build report', () => {
      const tracker = new ProgressTracker(['ios', 'android', 'web']);
      
      const results: BuildResult[] = [
        {
          platform: 'ios',
          success: true,
          packagePath: '/dist/ios',
          duration: 5000,
          warnings: [],
          errors: [],
        },
        {
          platform: 'android',
          success: false,
          packagePath: '',
          duration: 2000,
          warnings: [],
          errors: [],
        },
        {
          platform: 'web',
          success: true,
          packagePath: '/dist/web',
          duration: 4000,
          warnings: [],
          errors: [],
        },
      ];
      
      results.forEach(result => {
        tracker.startPlatform(result.platform);
        tracker.completePlatform(result.platform, result);
      });
      tracker.complete();
      
      const report = tracker.generateReport(results);
      
      expect(report.status).toBe('partial');
      expect(report.successCount).toBe(2);
      expect(report.failureCount).toBe(1);
      expect(report.summary).toContain('Built 2 of 3 platforms successfully');
      expect(report.summary).toContain('1 failed');
    });
  });

  describe('duration formatting', () => {
    it('should format seconds', () => {
      expect(ProgressTracker.formatDuration(5000)).toBe('5s');
      expect(ProgressTracker.formatDuration(45000)).toBe('45s');
    });

    it('should format minutes and seconds', () => {
      expect(ProgressTracker.formatDuration(65000)).toBe('1m 5s');
      expect(ProgressTracker.formatDuration(125000)).toBe('2m 5s');
    });

    it('should format hours, minutes, and seconds', () => {
      expect(ProgressTracker.formatDuration(3665000)).toBe('1h 1m 5s');
      expect(ProgressTracker.formatDuration(7325000)).toBe('2h 2m 5s');
    });
  });

  describe('progress report formatting', () => {
    it('should format progress report', () => {
      const tracker = new ProgressTracker(['ios', 'android']);
      
      tracker.startPlatform('ios');
      tracker.updatePlatform('ios', 'building', 75, 'Compiling Swift code');
      
      tracker.startPlatform('android');
      tracker.updatePlatform('android', 'validating', 25, 'Validating Kotlin');
      
      const progress = tracker.getProgress();
      const formatted = ProgressTracker.formatProgressReport(progress);
      
      expect(formatted).toContain('Build Progress: 50%');
      expect(formatted).toContain('iOS');
      expect(formatted).toContain('Android');
      expect(formatted).toContain('75%');
      expect(formatted).toContain('25%');
    });
  });

  describe('completion report formatting', () => {
    it('should format completion report', () => {
      const tracker = new ProgressTracker(['ios', 'web']);
      
      const results: BuildResult[] = [
        {
          platform: 'ios',
          success: true,
          packagePath: '/dist/ios',
          duration: 5000,
          warnings: ['Warning 1'],
          errors: [],
        },
        {
          platform: 'web',
          success: true,
          packagePath: '/dist/web',
          duration: 3000,
          warnings: [],
          errors: [],
        },
      ];
      
      results.forEach(result => {
        tracker.startPlatform(result.platform);
        tracker.completePlatform(result.platform, result);
      });
      tracker.complete();
      
      const report = tracker.generateReport(results);
      const formatted = ProgressTracker.formatCompletionReport(report);
      
      expect(formatted).toContain('Build Completion Report');
      expect(formatted).toContain('SUCCESS');
      expect(formatted).toContain('iOS');
      expect(formatted).toContain('Web');
      expect(formatted).toContain('Warnings: 1');
    });
  });

  describe('time estimation', () => {
    it('should estimate time remaining', async () => {
      const tracker = new ProgressTracker(['ios', 'android', 'web']);
      
      tracker.startPlatform('ios');
      
      // Simulate some time passing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      tracker.completePlatform('ios', {
        platform: 'ios',
        success: true,
        packagePath: '/dist/ios',
        duration: 100,
        warnings: [],
        errors: [],
      });
      
      const progress = tracker.getProgress();
      
      // Should have an estimate since one platform is complete
      expect(progress.estimatedTimeRemaining).toBeDefined();
      expect(progress.estimatedTimeRemaining).toBeGreaterThan(0);
    });

    it('should not estimate time before any completion', () => {
      const tracker = new ProgressTracker(['ios', 'android']);
      
      tracker.startPlatform('ios');
      
      const progress = tracker.getProgress();
      expect(progress.estimatedTimeRemaining).toBeUndefined();
    });
  });
});
