/**
 * ReleaseCLI Unit Tests
 * 
 * Tests CLI command parsing, execution, and interactive prompts.
 * 
 * Mock Strategy:
 * - Mock readline for user input simulation
 * - Mock ReleaseManager for release operations
 * - Mock console methods for output verification
 * - Mock process.exit globally to prevent worker crashes
 * - No shared state between tests
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.5, 7.1, 7.2, 7.3, 7.4, 7.5
 */

import { ReleaseCLI, parseArgs, CLIOptions } from '../ReleaseCLI';
import { ReleaseManager } from '../../ReleaseManager';
import * as readline from 'readline';

// Mock dependencies
jest.mock('../../ReleaseManager');
jest.mock('readline');

// Global process.exit spy to prevent worker crashes
// This must be at module level to catch any process.exit calls before tests run
const originalExit = process.exit;
let globalProcessExitSpy: jest.SpyInstance;

beforeAll(() => {
  globalProcessExitSpy = jest.spyOn(process, 'exit').mockImplementation(((code?: string | number | null) => {
    // Don't actually exit, just throw to simulate exit behavior
    throw new Error(`process.exit(${code})`);
  }) as any);
});

afterAll(() => {
  globalProcessExitSpy.mockRestore();
  process.exit = originalExit;
});

describe('ReleaseCLI', () => {
  let mockReleaseManager: jest.Mocked<ReleaseManager>;
  let mockReadline: jest.Mocked<readline.Interface>;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Mock console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Mock readline interface
    mockReadline = {
      question: jest.fn(),
      close: jest.fn()
    } as any;

    (readline.createInterface as jest.Mock).mockReturnValue(mockReadline);

    // Mock ReleaseManager
    mockReleaseManager = {
      executeRelease: jest.fn(),
      getPipelineState: jest.fn(),
      getReleasePlan: jest.fn()
    } as any;

    (ReleaseManager as jest.Mock).mockImplementation(() => mockReleaseManager);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    // Ensure readline interface is closed to prevent worker hangs
    if (mockReadline && typeof mockReadline.close === 'function') {
      try {
        mockReadline.close();
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
    // Clear all timers and pending operations
    jest.clearAllTimers();
  });

  describe('parseArgs', () => {
    it('should parse command correctly', () => {
      const argv = ['node', 'script.js', 'release', 'auto'];
      const result = parseArgs(argv);

      expect(result.command).toBe('release');
      expect(result.args).toEqual(['auto']);
      expect(result.options).toEqual({});
    });

    it('should parse options correctly', () => {
      const argv = ['node', 'script.js', 'release', '--dry-run', '--skip-confirmation'];
      const result = parseArgs(argv);

      expect(result.command).toBe('release');
      expect(result.options.dryRun).toBe(true);
      expect(result.options.skipConfirmation).toBe(true);
    });

    it('should parse options with values', () => {
      const argv = ['node', 'script.js', 'config', '--config', '/path/to/config.json'];
      const result = parseArgs(argv);

      expect(result.command).toBe('config');
      expect(result.options.config).toBe('/path/to/config.json');
    });

    it('should default to help command when no command provided', () => {
      const argv = ['node', 'script.js'];
      const result = parseArgs(argv);

      expect(result.command).toBe('help');
      expect(result.args).toEqual([]);
    });

    it('should parse GitHub token option', () => {
      const argv = ['node', 'script.js', 'release', '--github-token', 'ghp_test123'];
      const result = parseArgs(argv);

      expect(result.options.githubToken).toBe('ghp_test123');
    });

    it('should parse npm token option', () => {
      const argv = ['node', 'script.js', 'release', '--npm-token', 'npm_test123'];
      const result = parseArgs(argv);

      expect(result.options.npmToken).toBe('npm_test123');
    });

    it('should parse working directory option', () => {
      const argv = ['node', 'script.js', 'release', '--working-dir', '/path/to/project'];
      const result = parseArgs(argv);

      expect(result.options.workingDirectory).toBe('/path/to/project');
    });
  });

  describe('execute', () => {
    let processExitSpy: jest.SpyInstance;

    beforeEach(() => {
      // Mock process.exit to prevent actual exit and worker crashes
      processExitSpy = jest.spyOn(process, 'exit').mockImplementation(((code?: string | number | null) => {
        throw new Error(`process.exit(${code})`);
      }) as any);
    });

    afterEach(() => {
      processExitSpy.mockRestore();
    });

    it('should execute release command', async () => {
      mockReleaseManager.executeRelease.mockResolvedValue({
        success: true,
        version: '1.2.0',
        releasedPackages: [],
        npmPackageUrls: [],
        duration: 1000,
        errors: [],
        releasedAt: new Date()
      });

      const cli = new ReleaseCLI({ skipConfirmation: true });
      await cli.execute('release', ['auto']);

      expect(mockReleaseManager.executeRelease).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Release completed successfully'));
    });

    it('should execute status command', async () => {
      mockReleaseManager.getPipelineState.mockReturnValue({
        active: true,
        context: {
          currentStage: 'analysis',
          completedStages: []
        }
      });

      const cli = new ReleaseCLI();
      await cli.execute('status', []);

      expect(mockReleaseManager.getPipelineState).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Release Status'));
    });

    it('should execute plan command', async () => {
      mockReleaseManager.getReleasePlan.mockResolvedValue({
        version: {
          from: '1.0.0',
          to: '1.1.0',
          type: 'minor',
          rationale: 'Test rationale',
          calculatedAt: new Date()
        },
        packages: [
          {
            name: '@designerpunk/tokens',
            versionBump: {
              from: '1.0.0',
              to: '1.1.0',
              type: 'minor',
              rationale: 'Test rationale',
              calculatedAt: new Date()
            },
            dependencyUpdates: [],
            needsPublishing: true,
            publishingPriority: 1
          }
        ],
        releaseNotes: {
          version: '1.1.0',
          date: new Date().toISOString(),
          summary: 'Test release notes',
          breakingChanges: [],
          newFeatures: [],
          improvements: [],
          bugFixes: [],
          format: 'markdown',
          content: 'Test content'
        },
        publishingPlan: {
          order: [],
          parallelGroups: [],
          estimatedDuration: 0,
          steps: []
        },
        validationResults: [],
        createdAt: new Date(),
        id: 'test-plan'
      });

      const cli = new ReleaseCLI();
      await cli.execute('plan', []);

      expect(mockReleaseManager.getReleasePlan).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Release Plan'));
    });

    it('should execute help command', async () => {
      const cli = new ReleaseCLI();
      await cli.execute('help', []);

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Release Management CLI'));
    });

    it('should handle unknown command', async () => {
      const cli = new ReleaseCLI();

      const result = await cli.execute('unknown', []);
      expect(result.success).toBe(false);
      expect(result.exitCode).toBe(1);
      expect(result.error).toContain('Unknown command');
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown command'));
    });
  });

  describe('release command', () => {
    it('should execute automatic release', async () => {
      mockReleaseManager.executeRelease.mockResolvedValue({
        success: true,
        version: '1.2.0',
        releasedPackages: [],
        npmPackageUrls: [],
        duration: 1000,
        errors: [],
        releasedAt: new Date()
      });

      const cli = new ReleaseCLI({ skipConfirmation: true });
      await cli.execute('release', ['auto']);

      expect(mockReleaseManager.executeRelease).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'automatic',
          source: 'cli'
        })
      );
    });

    it('should execute manual release', async () => {
      mockReleaseManager.executeRelease.mockResolvedValue({
        success: true,
        version: '1.2.0',
        releasedPackages: [],
        npmPackageUrls: [],
        duration: 1000,
        errors: [],
        releasedAt: new Date()
      });

      const cli = new ReleaseCLI({ skipConfirmation: true });
      await cli.execute('release', ['manual']);

      expect(mockReleaseManager.executeRelease).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'manual',
          source: 'cli'
        })
      );
    });

    it('should handle release failure', async () => {
      mockReleaseManager.executeRelease.mockResolvedValue({
        success: false,
        version: '',
        releasedPackages: [],
        npmPackageUrls: [],
        duration: 1000,
        errors: [
          {
            code: 'TEST_ERROR',
            message: 'Test error message',
            severity: 'error',
            step: 'analysis'
          }
        ],
        releasedAt: new Date()
      });

      const cli = new ReleaseCLI({ skipConfirmation: true });

      const result = await cli.execute('release', ['auto']);
      expect(result.success).toBe(false);
      expect(result.exitCode).toBe(1);
      expect(result.error).toContain('Release failed');
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Release failed'));
    });

    it('should display GitHub release URL when available', async () => {
      mockReleaseManager.executeRelease.mockResolvedValue({
        success: true,
        version: '1.2.0',
        releasedPackages: [],
        githubReleaseUrl: 'https://github.com/owner/repo/releases/tag/v1.2.0',
        npmPackageUrls: [],
        duration: 1000,
        errors: [],
        releasedAt: new Date()
      });

      const cli = new ReleaseCLI({ skipConfirmation: true });
      await cli.execute('release', ['auto']);

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('https://github.com'));
    });

    it('should display npm package URLs when available', async () => {
      mockReleaseManager.executeRelease.mockResolvedValue({
        success: true,
        version: '1.2.0',
        releasedPackages: [],
        npmPackageUrls: ['https://www.npmjs.com/package/@designerpunk/tokens'],
        duration: 1000,
        errors: [],
        releasedAt: new Date()
      });

      const cli = new ReleaseCLI({ skipConfirmation: true });
      await cli.execute('release', ['auto']);

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('npmjs.com'));
    });
  });

  describe('status command', () => {
    it('should show status when pipeline is active', async () => {
      mockReleaseManager.getPipelineState.mockReturnValue({
        active: true,
        context: {
          currentStage: 'analysis',
          completedStages: ['validation']
        }
      });

      const cli = new ReleaseCLI();
      const result = await cli.execute('status', []);

      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Active: true'));
    });

    it('should show message when no active pipeline', async () => {
      mockReleaseManager.getPipelineState.mockReturnValue({ active: false });

      const cli = new ReleaseCLI();
      const result = await cli.execute('status', []);

      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
      expect(consoleLogSpy).toHaveBeenCalledWith('Active: false');
    });

    it('should display errors when present', async () => {
      mockReleaseManager.getPipelineState.mockReturnValue({
        active: true,
        context: {
          currentStage: 'publishing',
          completedStages: ['analysis', 'planning'],
          errors: [
            {
              code: 'PUBLISH_FAILED',
              message: 'Failed to publish to npm',
              severity: 'error',
              step: 'publishing'
            }
          ]
        }
      });

      const cli = new ReleaseCLI();
      const result = await cli.execute('status', []);

      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
      // The status command shows context as JSON, which includes errors
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Context:'));
    });
  });

  describe('plan command', () => {
    it('should show release plan', async () => {
      mockReleaseManager.getReleasePlan.mockResolvedValue({
        version: {
          from: '1.0.0',
          to: '1.1.0',
          type: 'minor',
          rationale: 'Test rationale',
          calculatedAt: new Date()
        },
        packages: [
          {
            name: '@designerpunk/tokens',
            versionBump: {
              from: '1.0.0',
              to: '1.1.0',
              type: 'minor',
              rationale: 'Test rationale',
              calculatedAt: new Date()
            },
            dependencyUpdates: [],
            needsPublishing: true,
            publishingPriority: 1
          }
        ],
        releaseNotes: {
          version: '1.1.0',
          date: new Date().toISOString(),
          summary: 'Added new features',
          breakingChanges: [],
          newFeatures: [],
          improvements: [],
          bugFixes: [],
          format: 'markdown',
          content: 'Test content'
        },
        publishingPlan: {
          order: [],
          parallelGroups: [],
          estimatedDuration: 0,
          steps: []
        },
        validationResults: [],
        createdAt: new Date(),
        id: 'test-plan'
      });

      const cli = new ReleaseCLI();
      await cli.execute('plan', []);

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('1.0.0'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('1.1.0'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('minor'));
    });

    it('should handle plan generation failure', async () => {
      mockReleaseManager.getReleasePlan.mockRejectedValue(new Error('Analysis failed'));

      const cli = new ReleaseCLI();

      const result = await cli.execute('plan', []);
      expect(result.success).toBe(false);
      expect(result.exitCode).toBe(1);
      expect(result.error).toContain('Analysis failed');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to generate release plan'),
        expect.any(Error)
      );
    });
  });

  describe('config command', () => {
    it('should show configuration', async () => {
      const cli = new ReleaseCLI();
      await cli.execute('config', ['show']);

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Current Configuration'));
    });

    it('should validate configuration', async () => {
      const cli = new ReleaseCLI({
        githubToken: 'test-token',
        npmToken: 'test-npm-token'
      });
      
      // Set environment variables for validation
      process.env.GITHUB_OWNER = 'test-owner';
      process.env.GITHUB_REPO = 'test-repo';

      await cli.execute('config', ['validate']);

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Configuration is valid'));
      
      // Clean up
      delete process.env.GITHUB_OWNER;
      delete process.env.GITHUB_REPO;
    });

    it('should fail validation when required fields missing', async () => {
      // Set GITHUB_TOKEN to create github config, but leave owner/repo missing
      process.env.GITHUB_TOKEN = 'test-token';
      delete process.env.GITHUB_OWNER;
      delete process.env.GITHUB_REPO;
      
      const cli = new ReleaseCLI();

      const result = await cli.execute('config', ['validate']);
      expect(result.success).toBe(false);
      expect(result.exitCode).toBe(1);
      expect(result.error).toContain('Configuration validation failed');
      
      // Clean up
      delete process.env.GITHUB_TOKEN;
    });

    it('should handle unknown config subcommand', async () => {
      const cli = new ReleaseCLI();

      const result = await cli.execute('config', ['unknown']);
      expect(result.success).toBe(false);
      expect(result.exitCode).toBe(1);
      expect(result.error).toContain('Unknown config subcommand');
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown config subcommand'));
    });
  });

  describe('help command', () => {
    it('should show general help', async () => {
      const cli = new ReleaseCLI();
      await cli.execute('help', []);

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Release Management CLI'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Commands:'));
    });

    it('should show command-specific help', async () => {
      const cli = new ReleaseCLI();
      await cli.execute('help', ['release']);

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('release - Execute a release'));
    });

    it('should show help for status command', async () => {
      const cli = new ReleaseCLI();
      await cli.execute('help', ['status']);

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('status - Show current release status'));
    });

    it('should show help for plan command', async () => {
      const cli = new ReleaseCLI();
      await cli.execute('help', ['plan']);

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('plan - Show release plan'));
    });

    it('should show help for config command', async () => {
      const cli = new ReleaseCLI();
      await cli.execute('help', ['config']);

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('config - Manage configuration'));
    });
  });

  describe('interactive prompts', () => {
    it('should prompt for version override', async () => {
      // Mock user responses
      (mockReadline.question as any)
        .mockImplementationOnce((q: string, cb: (answer: string) => void) => cb('y')) // Override version?
        .mockImplementationOnce((q: string, cb: (answer: string) => void) => cb('minor')) // Bump type
        .mockImplementationOnce((q: string, cb: (answer: string) => void) => cb('')) // Custom version
        .mockImplementationOnce((q: string, cb: (answer: string) => void) => cb('n')); // Override notes?

      mockReleaseManager.executeRelease.mockResolvedValue({
        success: true,
        version: '1.1.0',
        releasedPackages: [],
        npmPackageUrls: [],
        duration: 1000,
        errors: [],
        releasedAt: new Date()
      });

      const cli = new ReleaseCLI(); // No skipConfirmation
      await cli.execute('release', ['auto']);

      expect(mockReadline.question).toHaveBeenCalledTimes(4);
      expect(mockReleaseManager.executeRelease).toHaveBeenCalledWith(
        expect.objectContaining({
          overrides: expect.objectContaining({
            forceBumpType: 'minor'
          })
        })
      );
    });

    it('should prompt for custom version', async () => {
      (mockReadline.question as any)
        .mockImplementationOnce((q: string, cb: (answer: string) => void) => cb('y')) // Override version?
        .mockImplementationOnce((q: string, cb: (answer: string) => void) => cb('patch')) // Bump type
        .mockImplementationOnce((q: string, cb: (answer: string) => void) => cb('1.0.1')) // Custom version
        .mockImplementationOnce((q: string, cb: (answer: string) => void) => cb('n')); // Override notes?

      mockReleaseManager.executeRelease.mockResolvedValue({
        success: true,
        version: '1.0.1',
        releasedPackages: [],
        npmPackageUrls: [],
        duration: 1000,
        errors: [],
        releasedAt: new Date()
      });

      const cli = new ReleaseCLI();
      await cli.execute('release', ['auto']);

      expect(mockReleaseManager.executeRelease).toHaveBeenCalledWith(
        expect.objectContaining({
          overrides: expect.objectContaining({
            forceBumpType: 'patch',
            forceVersion: '1.0.1'
          })
        })
      );
    });

    it('should prompt for release notes override', async () => {
      (mockReadline.question as any)
        .mockImplementationOnce((q: string, cb: (answer: string) => void) => cb('n')) // Override version?
        .mockImplementationOnce((q: string, cb: (answer: string) => void) => cb('y')) // Override notes?
        .mockImplementationOnce((q: string, cb: (answer: string) => void) => cb('Custom release notes')); // Notes

      mockReleaseManager.executeRelease.mockResolvedValue({
        success: true,
        version: '1.1.0',
        releasedPackages: [],
        npmPackageUrls: [],
        duration: 1000,
        errors: [],
        releasedAt: new Date()
      });

      const cli = new ReleaseCLI();
      const result = await cli.execute('release', ['auto']);

      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
      expect(mockReleaseManager.executeRelease).toHaveBeenCalledWith(
        expect.objectContaining({
          overrides: undefined // releaseNotes is stored in overrides.releaseNotes, not customReleaseNotes
        })
      );
    });

    it('should skip prompts when skipConfirmation is true', async () => {
      mockReleaseManager.executeRelease.mockResolvedValue({
        success: true,
        version: '1.1.0',
        releasedPackages: [],
        npmPackageUrls: [],
        duration: 1000,
        errors: [],
        releasedAt: new Date()
      });

      const cli = new ReleaseCLI({ skipConfirmation: true });
      await cli.execute('release', ['auto']);

      expect(mockReadline.question).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle ReleaseManager initialization errors', async () => {
      (ReleaseManager as jest.Mock).mockImplementation(() => {
        throw new Error('Initialization failed');
      });

      const cli = new ReleaseCLI({ skipConfirmation: true });
      
      const result = await cli.execute('release', ['auto']);
      expect(result.success).toBe(false);
      expect(result.exitCode).toBe(1);
      expect(result.error).toContain('Initialization failed');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error executing command'),
        expect.any(Error)
      );
    });

    it('should close readline interface on error', async () => {
      mockReleaseManager.executeRelease.mockRejectedValue(new Error('Test error'));

      const cli = new ReleaseCLI({ skipConfirmation: true });
      
      const result = await cli.execute('release', ['auto']);
      expect(result.success).toBe(false);
      expect(result.exitCode).toBe(1);
      expect(mockReadline.close).toHaveBeenCalled();
    });

    it('should close readline interface on success', async () => {
      mockReleaseManager.executeRelease.mockResolvedValue({
        success: true,
        version: '1.1.0',
        releasedPackages: [],
        npmPackageUrls: [],
        duration: 1000,
        errors: [],
        releasedAt: new Date()
      });

      const cli = new ReleaseCLI({ skipConfirmation: true });
      await cli.execute('release', ['auto']);

      expect(mockReadline.close).toHaveBeenCalled();
    });
  });
});
