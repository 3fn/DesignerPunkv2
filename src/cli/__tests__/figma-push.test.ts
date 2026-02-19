/**
 * CLI figma-push — Unit Tests
 *
 * Tests for argument parsing, token loading, and the main run() workflow
 * including dry-run, force override, resume, error reporting, and exit codes.
 *
 * @requirements Req 7 (CLI Command)
 */

import type { DTCGTokenFile } from '../../generators/types/DTCGTypes';
import type { FigmaTokenFile } from '../../generators/transformers/FigmaTransformer';

// ---------------------------------------------------------------------------
// Mocks — set up before importing the module under test
// ---------------------------------------------------------------------------

const mockExistsSync = jest.fn().mockReturnValue(true);
const mockReadFileSync = jest.fn();
const mockWriteFileSync = jest.fn();
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: (...args: unknown[]) => mockExistsSync(...args),
  readFileSync: (...args: unknown[]) => mockReadFileSync(...args),
  writeFileSync: (...args: unknown[]) => mockWriteFileSync(...args),
}));

const mockTransform = jest.fn();
const mockCanTransform = jest.fn().mockReturnValue(true);
jest.mock('../../generators/transformers/FigmaTransformer', () => ({
  FigmaTransformer: jest.fn().mockImplementation(() => ({
    transform: mockTransform,
    canTransform: mockCanTransform,
    config: {
      id: 'figma',
      name: 'Figma Variables and Styles',
      outputExtension: '.figma.json',
      includeExtensions: false,
    },
  })),
}));

const mockSync = jest.fn();
jest.mock('../../figma/TokenSyncWorkflow', () => ({
  TokenSyncWorkflow: jest.fn().mockImplementation(() => ({
    sync: mockSync,
  })),
}));

const mockConnect = jest.fn().mockResolvedValue(undefined);
const mockDisconnect = jest.fn().mockResolvedValue(undefined);
jest.mock('../../figma/ConsoleMCPClientImpl', () => ({
  ConsoleMCPClientImpl: jest.fn().mockImplementation(() => ({
    connect: mockConnect,
    disconnect: mockDisconnect,
  })),
}));

const mockCheckDesktopBridge = jest.fn();
jest.mock('../../figma/preflight', () => ({
  checkDesktopBridge: mockCheckDesktopBridge,
}));

// Spy on process.exit to prevent actual exits
const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {
  throw new Error('process.exit called');
}) as never);

// Capture console output
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

import { parseArgs, loadDTCGTokens, run } from '../figma-push';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Minimal valid DTCG token file for mocking fs.readFileSync. */
const MINIMAL_DTCG: DTCGTokenFile = {
  $schema: 'https://tr.designtokens.org/format/',
  space: {
    $type: 'dimension',
    space100: { $value: '8px', $type: 'dimension' },
  },
};

/** Minimal Figma token file returned by the transformer. */
const MINIMAL_FIGMA: FigmaTokenFile = {
  collections: [
    {
      name: 'Primitives',
      modes: ['light', 'dark'],
      variables: [{ name: 'space/100', type: 'FLOAT', valuesByMode: { light: 8, dark: 8 } }],
    },
  ],
  styles: [],
};

function consoleOutput(): string {
  return [
    ...mockConsoleLog.mock.calls.map((c) => c.join(' ')),
    ...mockConsoleError.mock.calls.map((c) => c.join(' ')),
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('figma-push CLI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default happy-path mocks
    mockTransform.mockReturnValue({
      content: JSON.stringify(MINIMAL_FIGMA),
      warnings: [],
    });
    mockCanTransform.mockReturnValue(true);
    mockCheckDesktopBridge.mockResolvedValue({ ready: true });
    mockSync.mockResolvedValue({
      success: true,
      created: 1,
      updated: 0,
      deleted: 0,
      errors: [],
    });
  });

  afterAll(() => {
    mockExit.mockRestore();
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });


  // ─── parseArgs ─────────────────────────────────────────────────

  describe('parseArgs', () => {
    it('returns defaults when no flags are provided', () => {
      const args = parseArgs([]);
      expect(args).toEqual({ force: false, resume: undefined, dryRun: false });
    });

    it('parses --force flag', () => {
      const args = parseArgs(['--force']);
      expect(args.force).toBe(true);
    });

    it('parses --dry-run flag', () => {
      const args = parseArgs(['--dry-run']);
      expect(args.dryRun).toBe(true);
    });

    it('parses --resume with a batch number', () => {
      const args = parseArgs(['--resume', '3']);
      expect(args.resume).toBe(3);
    });

    it('parses all flags together', () => {
      const args = parseArgs(['--force', '--resume', '5', '--dry-run']);
      expect(args.force).toBe(true);
      expect(args.resume).toBe(5);
      expect(args.dryRun).toBe(true);
    });
  });

  // ─── loadDTCGTokens ───────────────────────────────────────────

  describe('loadDTCGTokens', () => {
    it('exits with code 1 when file does not exist', () => {
      mockExistsSync.mockReturnValue(false);
      expect(() => loadDTCGTokens('/nonexistent/path.json')).toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('loads and parses a valid DTCG file', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify(MINIMAL_DTCG));
      const result = loadDTCGTokens('/tmp/test-dtcg-cli.json');
      expect(result.$schema).toBe('https://tr.designtokens.org/format/');
    });

    it('exits with code 1 when file contains invalid JSON', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('{ not valid json');
      expect(() => loadDTCGTokens('/tmp/test-dtcg-invalid.json')).toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  // ─── run() — dry-run mode ─────────────────────────────────────

  describe('run() — dry-run', () => {
    beforeEach(() => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify(MINIMAL_DTCG));
    });

    it('writes figma.json and exits 0 without syncing', async () => {
      await expect(run(['--dry-run'])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(0);
      expect(mockWriteFileSync).toHaveBeenCalled();
      // Should NOT have attempted sync
      expect(mockConnect).not.toHaveBeenCalled();
      expect(mockSync).not.toHaveBeenCalled();
    });
  });

  // ─── run() — normal sync ──────────────────────────────────────

  describe('run() — normal sync', () => {
    beforeEach(() => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify(MINIMAL_DTCG));
    });

    it('runs full workflow and exits 0 on success', async () => {
      await expect(run([])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(0);
      expect(mockConnect).toHaveBeenCalled();
      expect(mockCheckDesktopBridge).toHaveBeenCalled();
      expect(mockSync).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ forceOverride: false, resume: undefined }),
      );
      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  // ─── run() — force override ───────────────────────────────────

  describe('run() — force override', () => {
    beforeEach(() => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify(MINIMAL_DTCG));
    });

    it('passes forceOverride: true to sync', async () => {
      await expect(run(['--force'])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(0);
      expect(mockSync).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ forceOverride: true }),
      );
    });
  });

  // ─── run() — resume flag ──────────────────────────────────────

  describe('run() — resume flag', () => {
    beforeEach(() => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify(MINIMAL_DTCG));
    });

    it('passes resume batch number to sync', async () => {
      await expect(run(['--resume', '3'])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(0);
      expect(mockSync).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ resume: 3 }),
      );
    });
  });

  // ─── run() — error reporting ──────────────────────────────────

  describe('run() — error reporting', () => {
    beforeEach(() => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify(MINIMAL_DTCG));
    });

    it('exits 1 and reports errors when sync fails', async () => {
      mockSync.mockResolvedValue({
        success: false,
        created: 0,
        updated: 0,
        deleted: 0,
        errors: [{ message: 'Rate limit exceeded', batch: 3 }],
      });

      await expect(run([])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(consoleOutput()).toContain('Rate limit exceeded');
    });

    it('exits 1 and reports drift when drift is detected', async () => {
      mockSync.mockResolvedValue({
        success: false,
        created: 0,
        updated: 0,
        deleted: 0,
        errors: [],
        driftDetected: {
          hasDrift: true,
          driftedVariables: [
            { name: 'space/100', expectedValue: 8, actualValue: 10 },
          ],
        },
      });

      await expect(run([])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
      const output = consoleOutput();
      expect(output).toContain('Drift detected');
      expect(output).toContain('space/100');
    });

    it('exits 1 when preflight check fails', async () => {
      mockCheckDesktopBridge.mockResolvedValue({
        ready: false,
        error: '❌ Desktop Bridge not available',
      });

      await expect(run([])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(consoleOutput()).toContain('Desktop Bridge not available');
    });

    it('disconnects MCP client even when sync fails', async () => {
      mockSync.mockResolvedValue({
        success: false,
        created: 0,
        updated: 0,
        deleted: 0,
        errors: [{ message: 'Connection lost' }],
      });

      await expect(run([])).rejects.toThrow('process.exit called');
      expect(mockDisconnect).toHaveBeenCalled();
    });
  });
});
