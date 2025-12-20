/**
 * @category evergreen
 * @purpose Verify system integration works correctly across components
 */
/**
 * Unit Tests for CLI Bridge
 * 
 * Tests CLI execution, output capture, timeout handling, and error recovery.
 * 
 * Mock Strategy:
 * - jest.mock('child_process'): Mock spawn for CLI process testing
 * - EventEmitter mocks: Simulate process events (stdout, stderr, exit, error)
 * - No shared mocks: Each test creates fresh mocks with specific event sequences
 */

import { CLIBridge } from '../CLIBridge';
import { spawn } from 'child_process';
import { EventEmitter } from 'events';

// Mock child_process
jest.mock('child_process');

const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;

describe('CLIBridge', () => {
  let bridge: CLIBridge;

  beforeEach(() => {
    bridge = new CLIBridge();
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should execute CLI successfully and capture stdout', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      // Simulate successful execution
      setTimeout(() => {
        mockProcess.stdout.emit('data', Buffer.from('Analysis complete\n'));
        mockProcess.stdout.emit('data', Buffer.from('Version: 1.2.0\n'));
        mockProcess.emit('close', 0);
      });

      const result = await bridge.execute();

      expect(result.success).toBe(true);
      expect(result.stdout).toContain('Analysis complete');
      expect(result.stdout).toContain('Version: 1.2.0');
      expect(result.exitCode).toBe(0);
      expect(result.duration).toBeGreaterThanOrEqual(0); // Mock execution may be too fast to measure
    });

    it('should capture stderr separately', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      setTimeout(() => {
        mockProcess.stdout.emit('data', Buffer.from('Output\n'));
        mockProcess.stderr.emit('data', Buffer.from('Warning: deprecated API\n'));
        mockProcess.emit('close', 0);
      });

      const result = await bridge.execute({ captureStderr: true });

      expect(result.success).toBe(true);
      expect(result.stdout).toContain('Output');
      expect(result.stderr).toContain('Warning: deprecated API');
    });

    it('should handle CLI execution failure', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      setTimeout(() => {
        mockProcess.stderr.emit('data', Buffer.from('Error: invalid arguments\n'));
        mockProcess.emit('close', 1);
      });

      const result = await bridge.execute();

      expect(result.success).toBe(false);
      expect(result.exitCode).toBe(1);
      expect(result.error).toContain('CLI exited with code 1');
      expect(result.stderr).toContain('Error: invalid arguments');
    });

    it('should handle process spawn errors', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      setTimeout(() => {
        mockProcess.emit('error', new Error('ENOENT: command not found'));
      });

      const result = await bridge.execute();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to spawn CLI process');
      expect(result.error).toContain('ENOENT');
    });

    it('should handle timeout', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      // Don't emit close event to simulate hanging process
      setTimeout(() => {
        mockProcess.stdout.emit('data', Buffer.from('Starting analysis...\n'));
      });

      const result = await bridge.execute({ timeout: 100 });

      expect(result.success).toBe(false);
      expect(result.timedOut).toBe(true);
      expect(result.error).toContain('timed out');
      expect(mockProcess.kill).toHaveBeenCalledWith('SIGTERM');
    });

    it('should pass custom arguments to CLI', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      setTimeout(() => {
        mockProcess.emit('close', 0);
      });

      await bridge.execute({ args: ['--since', 'v1.0.0', '--format', 'json'] });

      expect(mockSpawn).toHaveBeenCalledWith(
        'npm',
        ['run', 'release:analyze', '--', '--since', 'v1.0.0', '--format', 'json'],
        expect.any(Object)
      );
    });

    it('should use custom working directory', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      setTimeout(() => {
        mockProcess.emit('close', 0);
      });

      const customDir = '/custom/path';
      await bridge.execute({ workingDirectory: customDir });

      expect(mockSpawn).toHaveBeenCalledWith(
        'npm',
        expect.any(Array),
        expect.objectContaining({
          cwd: customDir,
          env: expect.objectContaining({
            PWD: customDir
          })
        })
      );
    });

    it('should pass custom environment variables', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      setTimeout(() => {
        mockProcess.emit('close', 0);
      });

      await bridge.execute({ 
        env: { 
          CUSTOM_VAR: 'value',
          DEBUG: 'true'
        } 
      });

      expect(mockSpawn).toHaveBeenCalledWith(
        'npm',
        expect.any(Array),
        expect.objectContaining({
          env: expect.objectContaining({
            CUSTOM_VAR: 'value',
            DEBUG: 'true'
          })
        })
      );
    });
  });

  describe('executeForJSON', () => {
    it('should automatically add --format json argument', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      setTimeout(() => {
        mockProcess.stdout.emit('data', Buffer.from('{"version": "1.2.0"}\n'));
        mockProcess.emit('close', 0);
      });

      const result = await bridge.executeForJSON();

      expect(mockSpawn).toHaveBeenCalledWith(
        'npm',
        ['run', 'release:analyze', '--', '--format', 'json'],
        expect.any(Object)
      );
      expect(result.success).toBe(true);
      expect(result.stdout).toContain('{"version": "1.2.0"}');
    });

    it('should combine JSON format with additional arguments', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      setTimeout(() => {
        mockProcess.emit('close', 0);
      });

      await bridge.executeForJSON({ args: ['--since', 'v1.0.0'] });

      expect(mockSpawn).toHaveBeenCalledWith(
        'npm',
        ['run', 'release:analyze', '--', '--format', 'json', '--since', 'v1.0.0'],
        expect.any(Object)
      );
    });
  });

  describe('executeWithScope', () => {
    it('should add --since argument with specified tag', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      setTimeout(() => {
        mockProcess.emit('close', 0);
      });

      await bridge.executeWithScope('v1.0.0');

      expect(mockSpawn).toHaveBeenCalledWith(
        'npm',
        ['run', 'release:analyze', '--', '--since', 'v1.0.0'],
        expect.any(Object)
      );
    });

    it('should combine scope with additional arguments', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      setTimeout(() => {
        mockProcess.emit('close', 0);
      });

      await bridge.executeWithScope('v1.0.0', { args: ['--format', 'detailed'] });

      expect(mockSpawn).toHaveBeenCalledWith(
        'npm',
        ['run', 'release:analyze', '--', '--since', 'v1.0.0', '--format', 'detailed'],
        expect.any(Object)
      );
    });
  });

  describe('executeDryRun', () => {
    it('should add dry-run and skip-confirmation arguments', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      setTimeout(() => {
        mockProcess.stdout.emit('data', Buffer.from('Dry-run preview\n'));
        mockProcess.emit('close', 0);
      });

      await bridge.executeDryRun();

      expect(mockSpawn).toHaveBeenCalledWith(
        'npm',
        ['run', 'release:analyze', '--', '--dry-run', '--skip-confirmation'],
        expect.any(Object)
      );
    });
  });

  describe('isAvailable', () => {
    it('should return true when CLI is available', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      setTimeout(() => {
        mockProcess.stdout.emit('data', Buffer.from('Release Analysis CLI\n'));
        mockProcess.emit('close', 0);
      });

      const available = await bridge.isAvailable();

      expect(available).toBe(true);
      expect(mockSpawn).toHaveBeenCalledWith(
        'npm',
        ['run', 'release:analyze', '--', '--help'],
        expect.any(Object)
      );
    });

    it('should return false when CLI is not available', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      setTimeout(() => {
        mockProcess.emit('error', new Error('Command not found'));
      });

      const available = await bridge.isAvailable();

      expect(available).toBe(false);
    });

    it('should return true even if help command fails but output contains CLI name', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      setTimeout(() => {
        mockProcess.stdout.emit('data', Buffer.from('Release Analysis CLI - Error\n'));
        mockProcess.emit('close', 1);
      });

      const available = await bridge.isAvailable();

      expect(available).toBe(true);
    });
  });

  describe('getVersion', () => {
    it('should extract version from CLI output', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      setTimeout(() => {
        mockProcess.stdout.emit('data', Buffer.from('Advanced Release Analysis CLI v1.0.0\n'));
        mockProcess.emit('close', 0);
      });

      const version = await bridge.getVersion();

      expect(version).toBe('1.0.0');
      expect(mockSpawn).toHaveBeenCalledWith(
        'npm',
        ['run', 'release:analyze', '--', '--version'],
        expect.any(Object)
      );
    });

    it('should handle version without v prefix', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      setTimeout(() => {
        mockProcess.stdout.emit('data', Buffer.from('CLI version 2.1.3\n'));
        mockProcess.emit('close', 0);
      });

      const version = await bridge.getVersion();

      expect(version).toBe('2.1.3');
    });

    it('should return null when version cannot be determined', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      setTimeout(() => {
        mockProcess.stdout.emit('data', Buffer.from('No version info\n'));
        mockProcess.emit('close', 0);
      });

      const version = await bridge.getVersion();

      expect(version).toBeNull();
    });

    it('should return null when version command fails', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      setTimeout(() => {
        mockProcess.emit('error', new Error('Command failed'));
      });

      const version = await bridge.getVersion();

      expect(version).toBeNull();
    });
  });
});

/**
 * Helper function to create a mock child process
 */
function createMockProcess() {
  const mockProcess = new EventEmitter() as any;
  mockProcess.stdout = new EventEmitter();
  mockProcess.stderr = new EventEmitter();
  mockProcess.stdin = new EventEmitter();
  mockProcess.kill = jest.fn();
  mockProcess.killed = false;
  return mockProcess;
}
