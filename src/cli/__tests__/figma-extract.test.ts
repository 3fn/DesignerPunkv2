/**
 * CLI figma-extract — Unit Tests
 *
 * Tests for argument parsing, token loading, and the main run() workflow
 * including missing arguments, single/multi-component extraction, classification
 * summary output, exit codes, disconnect in finally block, and port cleanup.
 *
 * @spec 054d-hierarchical-design-extraction
 * @requirements Req 10 (CLI and Workflow Updates)
 */

import type { DTCGTokenFile } from '../../generators/types/DTCGTypes';
import type { ComponentAnalysis } from '../../figma/ComponentAnalysis';

// ---------------------------------------------------------------------------
// Mocks — set up before importing the module under test
// ---------------------------------------------------------------------------

const mockExistsSync = jest.fn().mockReturnValue(true);
const mockReadFileSync = jest.fn();
const mockWriteFileSync = jest.fn();
const mockMkdirSync = jest.fn();
const mockReaddirSync = jest.fn().mockReturnValue([]);
const mockRenameSync = jest.fn();
const mockRmdirSync = jest.fn();
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: (...args: unknown[]) => mockExistsSync(...args),
  readFileSync: (...args: unknown[]) => mockReadFileSync(...args),
  writeFileSync: (...args: unknown[]) => mockWriteFileSync(...args),
  mkdirSync: (...args: unknown[]) => mockMkdirSync(...args),
  readdirSync: (...args: unknown[]) => mockReaddirSync(...args),
  renameSync: (...args: unknown[]) => mockRenameSync(...args),
  rmdirSync: (...args: unknown[]) => mockRmdirSync(...args),
}));

const mockConnect = jest.fn().mockResolvedValue(undefined);
const mockDisconnect = jest.fn().mockResolvedValue(undefined);
jest.mock('../../figma/ConsoleMCPClientImpl', () => ({
  ConsoleMCPClientImpl: jest.fn().mockImplementation(() => ({
    connect: mockConnect,
    disconnect: mockDisconnect,
    getStatus: jest.fn().mockResolvedValue({
      transport: { websocket: { available: true } },
    }),
  })),
}));

const mockCleanupStalePorts = jest.fn().mockReturnValue([]);
jest.mock('../../figma/portCleanup', () => ({
  cleanupStalePorts: (...args: unknown[]) => mockCleanupStalePorts(...args),
}));

jest.mock('../../figma/TokenTranslator', () => ({
  TokenTranslator: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('../../figma/VariantAnalyzer', () => ({
  VariantAnalyzer: jest.fn().mockImplementation(() => ({})),
}));

// Mock DesignExtractor
const mockExtractComponentAnalysis = jest.fn();
jest.mock('../../figma/DesignExtractor', () => ({
  DesignExtractor: jest.fn().mockImplementation(() => ({
    extractComponentAnalysis: mockExtractComponentAnalysis,
  })),
}));

// Mock ComponentAnalysisGenerator
const mockGenerateJSON = jest.fn().mockReturnValue({ filePath: '/out/test-analysis.json', componentName: 'test', sizeBytes: 100 });
const mockGenerateMarkdown = jest.fn().mockReturnValue({ filePath: '/out/test-analysis.md', componentName: 'test', sizeBytes: 200 });
jest.mock('../../figma/ComponentAnalysisGenerator', () => ({
  generateComponentAnalysisJSON: (...args: unknown[]) => mockGenerateJSON(...args),
  generateComponentAnalysisMarkdown: (...args: unknown[]) => mockGenerateMarkdown(...args),
}));

// Spy on process.exit to prevent actual exits
const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {
  throw new Error('process.exit called');
}) as never);

const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

import { parseArgs, loadDTCGTokens, run } from '../figma-extract';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MINIMAL_DTCG: DTCGTokenFile = {
  $schema: 'https://tr.designtokens.org/format/',
  space: { $type: 'dimension', space100: { $value: '8px', $type: 'dimension' } },
};

function makeAnalysis(overrides: Partial<ComponentAnalysis> = {}): ComponentAnalysis {
  return {
    componentName: 'ButtonCTA',
    componentType: 'COMPONENT_SET',
    figmaId: 'n1',
    fileKey: 'key1',
    nodeTree: {
      id: '1', name: 'ButtonCTA', type: 'COMPONENT_SET', depth: 0,
      ancestorChain: [],
      tokenClassifications: { semanticIdentified: [], primitiveIdentified: [], unidentified: [] },
      children: [],
    },
    classificationSummary: { semanticIdentified: 5, primitiveIdentified: 2, unidentified: 1 },
    compositionPatterns: [],
    unresolvedBindings: [],
    recommendations: {},
    screenshots: [],
    extractedAt: '2026-02-22T00:00:00.000Z',
    extractorVersion: '6.3.0',
    ...overrides,
  };
}

function consoleOutput(): string {
  return [
    ...mockConsoleLog.mock.calls.map(c => c.join(' ')),
    ...mockConsoleError.mock.calls.map(c => c.join(' ')),
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('figma-extract CLI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify(MINIMAL_DTCG));
    mockExtractComponentAnalysis.mockResolvedValue(makeAnalysis());
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
      expect(args).toEqual({ file: undefined, nodes: [], outputDir: './analysis' });
    });

    it('parses --file flag', () => {
      expect(parseArgs(['--file', 'abc123']).file).toBe('abc123');
    });

    it('parses single --node flag', () => {
      expect(parseArgs(['--node', '42:99']).nodes).toEqual(['42:99']);
    });

    it('parses multiple --node flags', () => {
      const args = parseArgs(['--node', 'n1', '--node', 'n2', '--node', 'n3']);
      expect(args.nodes).toEqual(['n1', 'n2', 'n3']);
    });

    it('parses --output-dir flag', () => {
      expect(parseArgs(['--output-dir', './my-dir']).outputDir).toBe('./my-dir');
    });

    it('parses all flags together', () => {
      const args = parseArgs(['--file', 'key1', '--node', 'n1', '--node', 'n2', '--output-dir', '/tmp/out']);
      expect(args.file).toBe('key1');
      expect(args.nodes).toEqual(['n1', 'n2']);
      expect(args.outputDir).toBe('/tmp/out');
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
    it('exits 1 when --file is missing', async () => {
      await expect(run(['--node', 'n1'])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(consoleOutput()).toContain('Missing required argument: --file');
    });

    it('exits 1 when --node is missing', async () => {
      await expect(run(['--file', 'key1'])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(consoleOutput()).toContain('Missing required argument: --node');
    });
  });

  // ─── run() — single component extraction ──────────────────────

  describe('run() — single component extraction', () => {
    it('runs full workflow and exits 0 on success', async () => {
      await expect(run(['--file', 'key1', '--node', 'n1'])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(0);
      expect(mockExtractComponentAnalysis).toHaveBeenCalledWith('key1', 'n1', expect.any(String), undefined);
    });

    it('calls generateComponentAnalysisJSON and generateComponentAnalysisMarkdown', async () => {
      await expect(run(['--file', 'key1', '--node', 'n1'])).rejects.toThrow('process.exit called');
      expect(mockGenerateJSON).toHaveBeenCalledWith(expect.objectContaining({ componentName: 'ButtonCTA' }), expect.any(Object));
      expect(mockGenerateMarkdown).toHaveBeenCalledWith(expect.objectContaining({ componentName: 'ButtonCTA' }), expect.any(Object));
    });

    it('reports classification summary', async () => {
      await expect(run(['--file', 'key1', '--node', 'n1'])).rejects.toThrow('process.exit called');
      const output = consoleOutput();
      expect(output).toContain('Classification Summary');
      expect(output).toContain('Semantic');
      expect(output).toContain('Primitive');
      expect(output).toContain('Unidentified');
    });

    it('exits 0 even when unidentified values exist', async () => {
      mockExtractComponentAnalysis.mockResolvedValue(makeAnalysis({
        classificationSummary: { semanticIdentified: 3, primitiveIdentified: 1, unidentified: 5 },
      }));
      await expect(run(['--file', 'key1', '--node', 'n1'])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(0);
    });
  });

  // ─── run() — multi-component extraction ───────────────────────

  describe('run() — multi-component extraction', () => {
    it('extracts multiple components in sequence', async () => {
      mockExtractComponentAnalysis
        .mockResolvedValueOnce(makeAnalysis({ componentName: 'NodeBase', figmaId: 'n1' }))
        .mockResolvedValueOnce(makeAnalysis({ componentName: 'ConnectorBase', figmaId: 'n2' }));

      await expect(run(['--file', 'key1', '--node', 'n1', '--node', 'n2'])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(0);
      expect(mockExtractComponentAnalysis).toHaveBeenCalledTimes(2);
      expect(mockGenerateJSON).toHaveBeenCalledTimes(2);
      expect(mockGenerateMarkdown).toHaveBeenCalledTimes(2);
    });

    it('reports classification summary for each component', async () => {
      mockExtractComponentAnalysis
        .mockResolvedValueOnce(makeAnalysis({ componentName: 'NodeBase' }))
        .mockResolvedValueOnce(makeAnalysis({ componentName: 'ConnectorBase' }));

      await expect(run(['--file', 'key1', '--node', 'n1', '--node', 'n2'])).rejects.toThrow('process.exit called');
      const output = consoleOutput();
      expect(output).toContain('NodeBase');
      expect(output).toContain('ConnectorBase');
    });
  });

  // ─── run() — error handling ───────────────────────────────────

  describe('run() — error handling', () => {
    it('exits 1 when extraction throws', async () => {
      mockExtractComponentAnalysis.mockRejectedValueOnce(new Error('Component not found'));
      await expect(run(['--file', 'key1', '--node', 'n1'])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(consoleOutput()).toContain('Extraction failed');
    });

    it('rejects when MCP connection fails', async () => {
      mockConnect.mockRejectedValueOnce(new Error('Connection refused'));
      await expect(run(['--file', 'key1', '--node', 'n1'])).rejects.toThrow('Connection refused');
    });
  });

  // ─── run() — disconnect in finally block ──────────────────────

  describe('run() — disconnect in finally block', () => {
    it('calls disconnect on success path', async () => {
      await expect(run(['--file', 'key1', '--node', 'n1'])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(0);
      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('calls disconnect on failure path', async () => {
      mockExtractComponentAnalysis.mockRejectedValueOnce(new Error('fail'));
      await expect(run(['--file', 'key1', '--node', 'n1'])).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  // ─── run() — port cleanup before connect ──────────────────────

  describe('run() — port cleanup before connect', () => {
    it('calls cleanupStalePorts before connecting to MCP', async () => {
      const callOrder: string[] = [];
      mockCleanupStalePorts.mockImplementation(() => { callOrder.push('cleanup'); return []; });
      mockConnect.mockImplementation(async () => { callOrder.push('connect'); });

      await expect(run(['--file', 'key1', '--node', 'n1'])).rejects.toThrow('process.exit called');
      expect(callOrder).toEqual(['cleanup', 'connect']);
    });
  });

  // ─── run() — screenshot reporting ─────────────────────────────

  describe('run() — screenshot reporting', () => {
    it('reports screenshot count when screenshots captured', async () => {
      mockExtractComponentAnalysis.mockResolvedValue(makeAnalysis({
        screenshots: [{ filePath: './images/test.png', url: 'https://example.com/img.png', format: 'png', scale: 2, capturedAt: '2026-01-01T00:00:00Z' }],
      }));
      await expect(run(['--file', 'key1', '--node', 'n1'])).rejects.toThrow('process.exit called');
      expect(consoleOutput()).toContain('Screenshots');
    });
  });
});
