/**
 * Preservation Property Tests — TokenSyncWorkflow
 *
 * These tests capture the CURRENT (unfixed) behavior that must be preserved
 * when bug fixes are applied. They verify:
 * - Test 2b: --clean flag forces initialSetup() path
 * - Test 2c: --dry-run writes artifact and exits without syncing
 * - Test 2d: Drift detection compares expected vs actual and reports drift
 * - Test 2f: Style sync Plugin API code generation unchanged
 *
 * Property 2: Preservation — CLI Flags, Drift Detection, Style Sync
 *
 * **Validates: Requirements 3.2, 3.3, 3.4, 3.8, 3.6**
 *
 * @see Bugfix: .kiro/specs/054c-figma-token-push-fixes/bugfix.md
 * @see Design: .kiro/specs/054c-figma-token-push-fixes/design.md
 */

import * as fc from 'fast-check';
import { TokenSyncWorkflow } from '../TokenSyncWorkflow';
import type { ConsoleMCPClient } from '../ConsoleMCPClient';
import type {
  FigmaTokenFile,
  FigmaVariable,
  FigmaStyleDefinition,
  EffectStyleProperties,
  TextStyleProperties,
} from '../../generators/transformers/FigmaTransformer';
import type { DTCGTokenFile } from '../../generators/types/DTCGTypes';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeMockMcp(): jest.Mocked<ConsoleMCPClient> {
  return {
    batchCreateVariables: jest.fn().mockResolvedValue(undefined),
    batchUpdateVariables: jest.fn().mockResolvedValue(undefined),
    createVariableAliases: jest.fn().mockResolvedValue(undefined),
    getVariables: jest.fn().mockResolvedValue([]),
    execute: jest.fn().mockResolvedValue(undefined),
    setupDesignTokens: jest.fn().mockResolvedValue(undefined),
    getStatus: jest.fn().mockResolvedValue({}),
  };
}

function makeVariable(name: string, value: number = 8): FigmaVariable {
  return {
    name,
    resolvedType: 'FLOAT',
    valuesByMode: { light: value, dark: value },
  };
}

function makeTokenFile(
  variables: FigmaVariable[] = [],
  styles: FigmaStyleDefinition[] = [],
): FigmaTokenFile {
  return {
    collections: [
      { name: 'Primitives', modes: ['light', 'dark'], variables },
    ],
    styles,
  };
}

function makeEffectStyle(name: string): FigmaStyleDefinition {
  return {
    type: 'EFFECT',
    name,
    properties: {
      effects: [{
        type: 'DROP_SHADOW',
        offset: { x: 0, y: 4 },
        radius: 12,
        spread: 0,
        color: { r: 0, g: 0, b: 0, a: 0.3 },
      }],
    } as EffectStyleProperties,
    description: `Source: ${name}`,
  };
}

function makeTextStyle(name: string): FigmaStyleDefinition {
  return {
    type: 'TEXT',
    name,
    properties: {
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 24,
      letterSpacing: 0,
    } as TextStyleProperties,
    description: `Source: ${name}`,
  };
}

// ---------------------------------------------------------------------------
// CLI mocks for Test 2b and 2c
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

const mockCliSync = jest.fn();
const mockCliInitialSetup = jest.fn();
jest.mock('../../figma/TokenSyncWorkflow', () => ({
  TokenSyncWorkflow: jest.fn().mockImplementation(() => ({
    sync: mockCliSync,
    initialSetup: mockCliInitialSetup,
  })),
}));

const mockCliConnect = jest.fn().mockResolvedValue(undefined);
const mockCliDisconnect = jest.fn().mockResolvedValue(undefined);
const mockCliGetVariables = jest.fn().mockResolvedValue([]);
jest.mock('../../figma/ConsoleMCPClientImpl', () => ({
  ConsoleMCPClientImpl: jest.fn().mockImplementation(() => ({
    connect: mockCliConnect,
    disconnect: mockCliDisconnect,
    getVariables: mockCliGetVariables,
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

const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

import { run } from '../../cli/figma-push';

// ---------------------------------------------------------------------------
// Minimal test data
// ---------------------------------------------------------------------------

const MINIMAL_DTCG: DTCGTokenFile = {
  $schema: 'https://tr.designtokens.org/format/',
  space: {
    $type: 'dimension',
    space100: { $value: '8px', $type: 'dimension' },
  },
};

const MINIMAL_FIGMA: FigmaTokenFile = {
  collections: [{
    name: 'Primitives',
    modes: ['light', 'dark'],
    variables: [{ name: 'space/100', resolvedType: 'FLOAT', valuesByMode: { light: 8, dark: 8 } }],
  }],
  styles: [],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Preservation — TokenSyncWorkflow & CLI Flags', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTransform.mockReturnValue({
      content: JSON.stringify(MINIMAL_FIGMA),
      warnings: [],
    });
    mockCanTransform.mockReturnValue(true);
    mockCheckDesktopBridge.mockResolvedValue({ ready: true });
    mockCliSync.mockResolvedValue({
      success: true, created: 1, updated: 0, deleted: 0, errors: [],
    });
    mockCliInitialSetup.mockResolvedValue({
      success: true, created: 1, updated: 0, deleted: 0, errors: [],
    });
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify(MINIMAL_DTCG));
    mockCliGetVariables.mockResolvedValue([]);
  });

  afterAll(() => {
    mockExit.mockRestore();
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  // -------------------------------------------------------------------------
  // Test 2b — Clean Flag Preservation
  // -------------------------------------------------------------------------

  describe('Test 2b — --clean flag forces initialSetup() path', () => {
    /**
     * **Validates: Requirements 3.2**
     *
     * For all inputs with --clean, the workflow always calls initialSetup()
     * regardless of existing variables.
     */
    it('--clean forces initialSetup even when existing variables are present', async () => {
      // Simulate existing variables in Figma
      mockCliGetVariables.mockResolvedValue([
        { name: 'space/100', resolvedType: 'FLOAT', valuesByMode: { light: 8 } },
      ]);

      await expect(run(['--clean'])).rejects.toThrow('process.exit called');

      // initialSetup must be called, NOT sync
      expect(mockCliInitialSetup).toHaveBeenCalledTimes(1);
      expect(mockCliSync).not.toHaveBeenCalled();
    });

    it('--clean forces initialSetup even when Figma is empty', async () => {
      mockCliGetVariables.mockResolvedValue([]);

      await expect(run(['--clean'])).rejects.toThrow('process.exit called');

      expect(mockCliInitialSetup).toHaveBeenCalledTimes(1);
      expect(mockCliSync).not.toHaveBeenCalled();
    });

    it('without --clean and no existing variables, uses initialSetup', async () => {
      mockCliGetVariables.mockResolvedValue([]);

      await expect(run([])).rejects.toThrow('process.exit called');

      // First-time push (no existing vars) also uses initialSetup
      expect(mockCliInitialSetup).toHaveBeenCalledTimes(1);
      expect(mockCliSync).not.toHaveBeenCalled();
    });

    it('without --clean and existing variables, uses sync (not initialSetup)', async () => {
      mockCliGetVariables.mockResolvedValue([
        { name: 'space/100', resolvedType: 'FLOAT', valuesByMode: { light: 8 } },
      ]);

      await expect(run([])).rejects.toThrow('process.exit called');

      // Incremental sync path
      expect(mockCliSync).toHaveBeenCalledTimes(1);
      expect(mockCliInitialSetup).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // Test 2c — Dry-Run Preservation
  // -------------------------------------------------------------------------

  describe('Test 2c — --dry-run writes artifact and exits without syncing', () => {
    /**
     * **Validates: Requirements 3.3**
     *
     * For all inputs with --dry-run, no MCP client is created and no sync occurs.
     */
    it('--dry-run writes artifact file and exits with code 0', async () => {
      await expect(run(['--dry-run'])).rejects.toThrow('process.exit called');

      expect(mockExit).toHaveBeenCalledWith(0);
      expect(mockWriteFileSync).toHaveBeenCalled();
    });

    it('--dry-run does not connect to MCP or sync', async () => {
      await expect(run(['--dry-run'])).rejects.toThrow('process.exit called');

      expect(mockCliConnect).not.toHaveBeenCalled();
      expect(mockCliSync).not.toHaveBeenCalled();
      expect(mockCliInitialSetup).not.toHaveBeenCalled();
      expect(mockCheckDesktopBridge).not.toHaveBeenCalled();
    });

    it('--dry-run with --force still does not sync', async () => {
      await expect(run(['--dry-run', '--force'])).rejects.toThrow('process.exit called');

      expect(mockExit).toHaveBeenCalledWith(0);
      expect(mockCliConnect).not.toHaveBeenCalled();
      expect(mockCliSync).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // Test 2d — Drift Detection Preservation
  // -------------------------------------------------------------------------

  describe('Test 2d — Drift detection compares expected vs actual and reports drift', () => {
    /**
     * **Validates: Requirements 3.8**
     *
     * For all variable sets where values differ, detectDrift reports drift.
     */
    let realMockMcp: jest.Mocked<ConsoleMCPClient>;
    let realWorkflow: TokenSyncWorkflow;

    beforeEach(() => {
      // Use real TokenSyncWorkflow (not the CLI mock) for drift detection tests
      realMockMcp = makeMockMcp();
      realWorkflow = new (jest.requireActual('../TokenSyncWorkflow') as typeof import('../TokenSyncWorkflow')).TokenSyncWorkflow(
        realMockMcp,
        'test-file-key',
      );
    });

    it('property: for all variable pairs where values differ, drift is detected', () => {
      fc.assert(
        fc.property(
          // Generate a variable name
          fc.string({ minLength: 1, maxLength: 20 }),
          // Generate two different values
          fc.integer({ min: 0, max: 999 }),
          fc.integer({ min: 1000, max: 2000 }),
          (name, expectedVal, actualVal) => {
            const currentVariables: FigmaVariable[] = [
              { name, resolvedType: 'FLOAT', valuesByMode: { light: actualVal } },
            ];
            const expected = makeTokenFile([
              { name, resolvedType: 'FLOAT', valuesByMode: { light: expectedVal } },
            ]);

            const report = realWorkflow.detectDrift(currentVariables, expected);

            expect(report.hasDrift).toBe(true);
            expect(report.driftedVariables.length).toBeGreaterThan(0);
            expect(report.driftedVariables[0].name).toBe(name);
          },
        ),
        { numRuns: 30 },
      );
    });

    it('property: for all variable pairs where values match, no drift is detected', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.integer({ min: 0, max: 1000 }),
          (name, value) => {
            const currentVariables: FigmaVariable[] = [
              { name, resolvedType: 'FLOAT', valuesByMode: { light: value } },
            ];
            const expected = makeTokenFile([
              { name, resolvedType: 'FLOAT', valuesByMode: { light: value } },
            ]);

            const report = realWorkflow.detectDrift(currentVariables, expected);

            expect(report.hasDrift).toBe(false);
            expect(report.driftedVariables).toHaveLength(0);
          },
        ),
        { numRuns: 30 },
      );
    });

    it('drift detection blocks sync when drift found and forceOverride is false', async () => {
      realMockMcp.getVariables.mockResolvedValue([
        makeVariable('space/100', 999), // Drifted
      ]);
      const tokens = makeTokenFile([makeVariable('space/100', 8)]);

      const result = await realWorkflow.sync(tokens);

      expect(result.success).toBe(false);
      expect(result.driftDetected?.hasDrift).toBe(true);
      expect(realMockMcp.batchCreateVariables).not.toHaveBeenCalled();
      expect(realMockMcp.batchUpdateVariables).not.toHaveBeenCalled();
    });

    it('drift detection allows sync when forceOverride is true', async () => {
      realMockMcp.getVariables.mockResolvedValue([
        makeVariable('space/100', 999), // Drifted
      ]);
      const tokens = makeTokenFile([makeVariable('space/100', 8)]);

      const result = await realWorkflow.sync(tokens, { forceOverride: true });

      expect(result.success).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // Test 2f — Style Sync Preservation
  // -------------------------------------------------------------------------

  describe('Test 2f — Style sync Plugin API code generation unchanged', () => {
    /**
     * **Validates: Requirements 3.6**
     *
     * For all style definitions, generated code matches expected format.
     */
    let realMockMcp: jest.Mocked<ConsoleMCPClient>;
    let realWorkflow: TokenSyncWorkflow;

    beforeEach(() => {
      realMockMcp = makeMockMcp();
      realWorkflow = new (jest.requireActual('../TokenSyncWorkflow') as typeof import('../TokenSyncWorkflow')).TokenSyncWorkflow(
        realMockMcp,
        'test-file-key',
      );
    });

    it('property: effect style create code always contains figma.createEffectStyle()', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 30 }),
          (styleName) => {
            const style = makeEffectStyle(styleName);
            const code = realWorkflow.generateStylePluginCode(style, 'create');

            expect(code).toContain('figma.createEffectStyle()');
            expect(code).toContain(JSON.stringify(styleName));
            expect(code).toContain('style.effects');
          },
        ),
        { numRuns: 20 },
      );
    });

    it('property: effect style update code always uses getLocalEffectStyles()', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 30 }),
          (styleName) => {
            const style = makeEffectStyle(styleName);
            const code = realWorkflow.generateStylePluginCode(style, 'update');

            expect(code).toContain('figma.getLocalEffectStyles()');
            expect(code).toContain(JSON.stringify(styleName));
            expect(code).not.toContain('figma.createEffectStyle()');
          },
        ),
        { numRuns: 20 },
      );
    });

    it('property: text style create code always contains figma.createTextStyle() and loadFontAsync', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 30 }),
          (styleName) => {
            const style = makeTextStyle(styleName);
            const code = realWorkflow.generateStylePluginCode(style, 'create');

            expect(code).toContain('figma.createTextStyle()');
            expect(code).toContain(JSON.stringify(styleName));
            expect(code).toContain('loadFontAsync');
            expect(code).toContain('style.fontSize');
            expect(code).toContain('style.lineHeight');
          },
        ),
        { numRuns: 20 },
      );
    });

    it('property: text style update code always uses getLocalTextStyles()', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 30 }),
          (styleName) => {
            const style = makeTextStyle(styleName);
            const code = realWorkflow.generateStylePluginCode(style, 'update');

            expect(code).toContain('figma.getLocalTextStyles()');
            expect(code).toContain(JSON.stringify(styleName));
            expect(code).not.toContain('figma.createTextStyle()');
            expect(code).toContain('loadFontAsync');
          },
        ),
        { numRuns: 20 },
      );
    });

    it('property: font weight mapping preserves known weights', () => {
      const weightMap: Record<number, string> = {
        100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular',
        500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black',
      };

      for (const [weight, expectedStyle] of Object.entries(weightMap)) {
        const style: FigmaStyleDefinition = {
          type: 'TEXT',
          name: 'test/style',
          properties: {
            fontFamily: 'Inter',
            fontSize: 16,
            fontWeight: Number(weight),
            lineHeight: 24,
            letterSpacing: 0,
          } as TextStyleProperties,
        };
        const code = realWorkflow.generateStylePluginCode(style, 'create');
        expect(code).toContain(JSON.stringify(expectedStyle));
      }
    });

    it('effect style code includes all effect properties', () => {
      const style: FigmaStyleDefinition = {
        type: 'EFFECT',
        name: 'shadow/test',
        properties: {
          effects: [{
            type: 'DROP_SHADOW',
            offset: { x: 2, y: 8 },
            radius: 24,
            spread: 4,
            color: { r: 0.1, g: 0.2, b: 0.3, a: 0.5 },
          }],
        } as EffectStyleProperties,
      };
      const code = realWorkflow.generateStylePluginCode(style, 'create');

      expect(code).toContain('"DROP_SHADOW"');
      expect(code).toContain('"x":2');
      expect(code).toContain('"y":8');
      expect(code).toContain('"radius":24');
      expect(code).toContain('"spread":4');
    });
  });
});
