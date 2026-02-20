/**
 * CLI figma-extract — Unit Tests
 *
 * Tests for argument parsing, token loading, and the main run() workflow
 * including missing arguments, extraction success/failure, human-input-required
 * exit codes, disconnect in finally block, and port cleanup before connect.
 *
 * @requirements Req 10 (CLI Command)
 */

import type { DTCGTokenFile } from '../../generators/types/DTCGTypes';

// ---------------------------------------------------------------------------
// Mocks — set up before importing the module under test
// ---------------------------------------------------------------------------

const mockExistsSync = jest.fn().mockReturnValue(true);
const mockReadFileSync = jest.fn();
const mockWriteFileSync = jest.fn();
const mockMkdirSync = jest.fn();
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: (...args: unknown[]) => mockExistsSync(...args),
  readFileSync: (...args: unknown[]) => mockReadFileSync(...args),
  writeFileSync: (...args: unknown[]) => mockWriteFileSync(...args),
  mkdirSync: (...args: unknown[]) => mockMkdirSync(...args),
}));

const mockConnect = jest.fn().mockResolvedValue(undefined);
const mockDisconnect = jest.fn().mockResolvedValue(undefined);
const mockGetVariables = jest.fn().mockResolvedValue([]);
const mockGetStyles = jest.fn().mockResolvedValue([]);
const mockGetComponent = jest.fn().mockResolvedValue({
  name: 'ButtonCTA',
  description: 'A call-to-action button',
  variantProperties: { variant: ['primary', 'secondary'] },
});
jest.mock('../../figma/ConsoleMCPClientImpl', () => ({
  ConsoleMCPClientImpl: jest.fn().mockImplementation(() => ({
    connect: mockConnect,
    disconnect: mockDisconnect,
    getVariables: mockGetVariables,
    getStyles: mockGetStyles,
    getComponent: mockGetComponent,
  })),
}));

const mockCleanupStalePorts = jest.fn().mockReturnValue([]);
jest.mock('../../figma/portCleanup', () => ({
  cleanupStalePorts: (...args: unknown[]) => mockCleanupStalePorts(...args),
}));

// Mock TokenTranslator — returns exact match for any input
jest.mock('../../figma/TokenTranslator', () => ({
  TokenTranslator: jest.fn().mockImplementation(() => ({
    translate: jest.fn().mockReturnValue({
      token: 'space.300',
      confidence: 'exact',
      matchMethod: 'binding',
      rawValue: '24',
    }),
    getDtcgTokens: jest.fn().mockReturnValue({}),
  })),
}));

// Mock VariantAnalyzer — returns minimal analysis
jest.mock('../../figma/VariantAnalyzer', () => ({
  VariantAnalyzer: jest.fn().mockImplementation(() => ({
    queryFamilyPattern: jest.fn().mockResolvedValue(null),
    queryExistingComponents: jest.fn().mockResolvedValue([]),
    analyzeVariants: jest.fn().mockResolvedValue({
      behavioralClassification: 'styling',
      recommendations: [],
      conflicts: [],
    }),
  })),
}));

// Mock DesignExtractor — the main class under orchestration
const mockExtractDesign = jest.fn();
const mockGenerateMarkdown = jest.fn().mockReturnValue('# Design Outline: ButtonCTA\n');
const mockFormatNoMatchReport = jest.fn().mockReturnValue([]);
jest.mock('../../figma/DesignExtractor', () => ({
  DesignExtractor: jest.fn().mockImplementation(() => ({
    extractDesign: mockExtractDesign,
    generateDesignOutlineMarkdown: mockGenerateMarkdown,
    formatNoMatchReport: mockFormatNoMatchReport,
  })),
}));

// Spy on process.exit to prevent actual exits
const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {
  throw new Error('process.exit called');
}) as never);

// Capture console output
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

import { parseArgs, loadDTCGTokens, run } from '../figma-extract';

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

/** Minimal successful DesignOutline returned by extractDesign. */
function makeOutline(overrides: Record<string, unknown> = {}) {
  return {
    componentName: 'ButtonCTA',
    description: 'A call-to-action button',
    variants: [],
    states: [],
    properties: [],
    tokenUsage: { spacing: [], colors: [], typography: [], radius: [], shadows: [] },
    behavioralContracts: {
      classification: 'interactive',
      detectedStates: [],
      contractsDefined: true,
      confidence: '✅',
    },
    platformParity: { interactions: [], hasConcerns: false },
    componentTokenDecisions: [],
    extractionConfidence: {
      overall: 'high',
      exactMatches: 5,
      approximateMatches: 0,
      noMatches: 0,
      requiresHumanInput: false,
      reviewItems: [],
    },
    ...overrides,
  };
}

function consoleOutput(): string {
  return [
    ...mockConsoleLog.mock.calls.map((c) => c.join(' ')),
    ...mockConsoleError.mock.calls.map((c) => c.join(' ')),
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('figma-extract CLI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default happy-path mocks
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify(MINIMAL_DTCG));
    mockExtractDesign.mockResolvedValue(makeOutline());
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
      expect(args).toEqual({
        file: undefined,
        node: undefined,
        output: './design-outline.md',
      });
    });

    it('parses --file flag', () => {
      const args = parseArgs(['--file', 'abc123']);
      expect(args.file).toBe('abc123');
    });

    it('parses --node flag', () => {
      const args = parseArgs(['--node', '42:99']);
      expect(args.node).toBe('42:99');
    });

    it('parses --output flag', () => {
      const args = parseArgs(['--output', './my-outline.md']);
      expect(args.output).toBe('./my-outline.md');
    });

    it('parses all flags together', () => {
      const args = parseArgs(['--file', 'key1', '--node', 'n1', '--output', '/tmp/out.md']);
      expect(args.file).toBe('key1');
      expect(args.node).toBe('n1');
      expect(args.output).toBe('/tmp/out.md');
    });

    it('exits 1 when --file has no value', () => {
      expect(() => parseArgs(['--file', '--node', 'n1'])).toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('exits 1 when --node has no value', () => {
      expect(() => parseArgs(['--node'])).toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
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
      const result = loadDTCGTokens('/tmp/test-dtcg.json');
      expect(result.$schema).toBe('https://tr.designtokens.org/format/');
    });

    it('exits with code 1 when file contains invalid JSON', () => {
      mockReadFileSync.mockReturnValue('{ not valid json');
      expect(() => loadDTCGTokens('/tmp/bad.json')).toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  // ─── run() — missing arguments ─────────────────────────────────

  describe('run() — missing arguments', () => {
    it('exits 1 with error when --file is missing', async () => {
      await expect(run(['--node', 'n1'])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(consoleOutput()).toContain('Missing required argument: --file');
    });

    it('exits 1 with error when --node is missing', async () => {
      await expect(run(['--file', 'key1'])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(consoleOutput()).toContain('Missing required argument: --node');
    });
  });

  // ─── run() — normal extraction ────────────────────────────────

  describe('run() — normal extraction', () => {
    it('runs full workflow and exits 0 on success', async () => {
      await expect(run(['--file', 'key1', '--node', 'n1'])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(0);
      expect(mockExtractDesign).toHaveBeenCalledWith('key1', 'n1');
      expect(mockGenerateMarkdown).toHaveBeenCalled();
      expect(mockWriteFileSync).toHaveBeenCalled();
    });

    it('writes design-outline.md to default output path', async () => {
      await expect(run(['--file', 'key1', '--node', 'n1'])).rejects.toThrow('process.exit called');
      // writeFileSync called with a resolved path containing design-outline.md
      const writtenPath = mockWriteFileSync.mock.calls[0][0] as string;
      expect(writtenPath).toContain('design-outline.md');
    });

    it('writes to custom output path when --output is provided', async () => {
      await expect(
        run(['--file', 'key1', '--node', 'n1', '--output', '/tmp/custom-outline.md']),
      ).rejects.toThrow('process.exit called');
      const writtenPath = mockWriteFileSync.mock.calls[0][0] as string;
      expect(writtenPath).toContain('custom-outline.md');
    });

    it('reports extraction results to console', async () => {
      await expect(run(['--file', 'key1', '--node', 'n1'])).rejects.toThrow('process.exit called');
      const output = consoleOutput();
      expect(output).toContain('Extraction Results');
      expect(output).toContain('Exact matches');
    });
  });

  // ─── run() — human-input-required (no-match pause) ────────────

  describe('run() — human-input-required', () => {
    it('exits 1 when extraction requires human input', async () => {
      mockExtractDesign.mockResolvedValue(
        makeOutline({
          extractionConfidence: {
            overall: 'low',
            exactMatches: 3,
            approximateMatches: 1,
            noMatches: 2,
            requiresHumanInput: true,
            reviewItems: ['2 token value(s) could not be matched'],
          },
        }),
      );

      await expect(run(['--file', 'key1', '--node', 'n1'])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(consoleOutput()).toContain('Human input required');
    });
  });

  // ─── run() — error handling ───────────────────────────────────

  describe('run() — error handling', () => {
    it('rejects when MCP connection fails', async () => {
      mockConnect.mockRejectedValueOnce(new Error('Connection refused'));

      // connect() throws before the try block, so the error propagates
      // directly from run() rather than being caught and calling process.exit
      await expect(run(['--file', 'key1', '--node', 'n1'])).rejects.toThrow('Connection refused');
    });

    it('exits 1 when extractDesign throws', async () => {
      mockExtractDesign.mockRejectedValueOnce(new Error('Component not found'));

      await expect(run(['--file', 'key1', '--node', 'n1'])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(consoleOutput()).toContain('Extraction failed');
    });
  });

  // ─── run() — disconnect in finally block ──────────────────────

  describe('run() — disconnect in finally block', () => {
    it('calls disconnect on success path', async () => {
      await expect(run(['--file', 'key1', '--node', 'n1'])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(0);
      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('calls disconnect on failure path (extractDesign error)', async () => {
      mockExtractDesign.mockRejectedValueOnce(new Error('Extraction error'));

      await expect(run(['--file', 'key1', '--node', 'n1'])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  // ─── run() — port cleanup before connect ──────────────────────

  describe('run() — port cleanup before connect', () => {
    it('calls cleanupStalePorts before connecting to MCP', async () => {
      const callOrder: string[] = [];
      mockCleanupStalePorts.mockImplementation(() => {
        callOrder.push('cleanup');
        return [];
      });
      mockConnect.mockImplementation(async () => {
        callOrder.push('connect');
      });

      await expect(run(['--file', 'key1', '--node', 'n1'])).rejects.toThrow('process.exit called');
      expect(callOrder).toEqual(['cleanup', 'connect']);
    });
  });
});
