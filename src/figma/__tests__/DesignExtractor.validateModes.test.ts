/**
 * Tests for DesignExtractor.validateModes() — Task 3.11
 *
 * Validates mode consistency checking across token bindings:
 * - Expected discrepancies (color tokens differ by mode)
 * - Unexpected discrepancies (spacing/radius/typography differ by mode)
 * - No discrepancy when values match
 * - Alias bindings are skipped
 * - Single-mode bindings are skipped
 *
 * @spec 054b-figma-design-extract
 * @requirements Req 9 (Mode Consistency Validation)
 */

import { DesignExtractor } from '../DesignExtractor';
import type { TokenBinding } from '../DesignExtractor';
import type { ConsoleMCPClient } from '../ConsoleMCPClient';
import type { TokenTranslator } from '../TokenTranslator';
import type { VariantAnalyzer } from '../VariantAnalyzer';

// ---------------------------------------------------------------------------
// Mock factories
// ---------------------------------------------------------------------------

function makeMockConsoleMcp(): jest.Mocked<ConsoleMCPClient> {
  return {
    batchCreateVariables: jest.fn().mockResolvedValue(undefined),
    batchUpdateVariables: jest.fn().mockResolvedValue(undefined),
    createVariableAliases: jest.fn().mockResolvedValue(undefined),
    getVariables: jest.fn().mockResolvedValue([]),
    execute: jest.fn().mockResolvedValue(undefined),
    setupDesignTokens: jest.fn().mockResolvedValue(undefined),
    getStatus: jest.fn().mockResolvedValue({}),
    getStyles: jest.fn().mockResolvedValue([]),
    getComponent: jest.fn().mockResolvedValue({}),
  };
}

const stubTranslator = {} as TokenTranslator;
const stubAnalyzer = {} as VariantAnalyzer;

function makeBinding(overrides: Partial<TokenBinding> = {}): TokenBinding {
  return {
    variableName: 'space/300',
    variableId: 'var-1',
    collectionName: 'Primitives',
    resolvedType: 'FLOAT',
    valuesByMode: { light: 24, dark: 24 },
    isAlias: false,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DesignExtractor.validateModes', () => {
  let extractor: DesignExtractor;

  beforeEach(() => {
    extractor = new DesignExtractor(makeMockConsoleMcp(), stubTranslator, stubAnalyzer);
  });

  // -------------------------------------------------------------------------
  // No discrepancies
  // -------------------------------------------------------------------------

  describe('no discrepancies', () => {
    it('returns empty result when bindings array is empty', () => {
      const result = extractor.validateModes([]);
      expect(result.discrepancies).toEqual([]);
      expect(result.hasUnexpectedDiscrepancies).toBe(false);
    });

    it('returns no discrepancy when light and dark values are identical (FLOAT)', () => {
      const bindings = [makeBinding({
        variableName: 'space/300',
        resolvedType: 'FLOAT',
        valuesByMode: { light: 24, dark: 24 },
      })];

      const result = extractor.validateModes(bindings);
      expect(result.discrepancies).toEqual([]);
      expect(result.hasUnexpectedDiscrepancies).toBe(false);
    });

    it('returns no discrepancy when light and dark color values are identical', () => {
      const bindings = [makeBinding({
        variableName: 'color/purple/300',
        resolvedType: 'COLOR',
        valuesByMode: { light: '#7C3AED', dark: '#7C3AED' },
      })];

      const result = extractor.validateModes(bindings);
      expect(result.discrepancies).toEqual([]);
    });

    it('returns no discrepancy for single-mode bindings', () => {
      const bindings = [makeBinding({
        variableName: 'space/300',
        resolvedType: 'FLOAT',
        valuesByMode: { 'Mode 1': 24 },
      })];

      const result = extractor.validateModes(bindings);
      expect(result.discrepancies).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // Expected discrepancies (color tokens)
  // -------------------------------------------------------------------------

  describe('expected discrepancies (color)', () => {
    it('categorizes color token mode difference as expected', () => {
      const bindings = [makeBinding({
        variableName: 'color/purple/300',
        resolvedType: 'COLOR',
        valuesByMode: { light: '#FFFFFF', dark: '#000000' },
      })];

      const result = extractor.validateModes(bindings);

      expect(result.discrepancies).toHaveLength(1);
      expect(result.discrepancies[0]).toEqual({
        variableName: 'color/purple/300',
        lightValue: '#FFFFFF',
        darkValue: '#000000',
        category: 'expected',
      });
      expect(result.hasUnexpectedDiscrepancies).toBe(false);
    });

    it('does not flag expected color discrepancies as unexpected', () => {
      const bindings = [
        makeBinding({
          variableName: 'color/primary',
          resolvedType: 'COLOR',
          valuesByMode: { light: '#3B82F6', dark: '#60A5FA' },
        }),
        makeBinding({
          variableName: 'color/surface',
          resolvedType: 'COLOR',
          valuesByMode: { light: '#FFFFFF', dark: '#1A1A2E' },
        }),
      ];

      const result = extractor.validateModes(bindings);

      expect(result.discrepancies).toHaveLength(2);
      expect(result.discrepancies.every(d => d.category === 'expected')).toBe(true);
      expect(result.hasUnexpectedDiscrepancies).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // Unexpected discrepancies (structural tokens)
  // -------------------------------------------------------------------------

  describe('unexpected discrepancies (structural tokens)', () => {
    it('categorizes spacing token mode difference as unexpected', () => {
      const bindings = [makeBinding({
        variableName: 'space/300',
        resolvedType: 'FLOAT',
        valuesByMode: { light: 24, dark: 32 },
      })];

      const result = extractor.validateModes(bindings);

      expect(result.discrepancies).toHaveLength(1);
      expect(result.discrepancies[0]).toEqual({
        variableName: 'space/300',
        lightValue: 24,
        darkValue: 32,
        category: 'unexpected',
      });
      expect(result.hasUnexpectedDiscrepancies).toBe(true);
    });

    it('categorizes STRING token mode difference as unexpected', () => {
      const bindings = [makeBinding({
        variableName: 'typography/fontFamily',
        resolvedType: 'STRING',
        valuesByMode: { light: 'Inter', dark: 'Roboto' },
      })];

      const result = extractor.validateModes(bindings);

      expect(result.discrepancies).toHaveLength(1);
      expect(result.discrepancies[0].category).toBe('unexpected');
      expect(result.hasUnexpectedDiscrepancies).toBe(true);
    });

    it('categorizes radius token mode difference as unexpected', () => {
      const bindings = [makeBinding({
        variableName: 'radius/200',
        resolvedType: 'FLOAT',
        valuesByMode: { light: 8, dark: 12 },
      })];

      const result = extractor.validateModes(bindings);

      expect(result.discrepancies).toHaveLength(1);
      expect(result.discrepancies[0].category).toBe('unexpected');
      expect(result.hasUnexpectedDiscrepancies).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // Mixed discrepancies
  // -------------------------------------------------------------------------

  describe('mixed discrepancies', () => {
    it('handles mix of expected and unexpected discrepancies', () => {
      const bindings = [
        makeBinding({
          variableName: 'color/purple/300',
          resolvedType: 'COLOR',
          valuesByMode: { light: '#FFFFFF', dark: '#000000' },
        }),
        makeBinding({
          variableName: 'space/300',
          resolvedType: 'FLOAT',
          valuesByMode: { light: 24, dark: 32 },
        }),
        makeBinding({
          variableName: 'space/200',
          resolvedType: 'FLOAT',
          valuesByMode: { light: 16, dark: 16 },
        }),
      ];

      const result = extractor.validateModes(bindings);

      expect(result.discrepancies).toHaveLength(2);
      const expected = result.discrepancies.filter(d => d.category === 'expected');
      const unexpected = result.discrepancies.filter(d => d.category === 'unexpected');
      expect(expected).toHaveLength(1);
      expect(unexpected).toHaveLength(1);
      expect(result.hasUnexpectedDiscrepancies).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // Alias bindings are skipped
  // -------------------------------------------------------------------------

  describe('alias handling', () => {
    it('skips bindings where mode values are alias references', () => {
      const bindings = [makeBinding({
        variableName: 'color.primary',
        resolvedType: 'COLOR',
        valuesByMode: {
          light: { aliasOf: 'color/purple/300' },
          dark: { aliasOf: 'color/purple/400' },
        },
        isAlias: true,
      })];

      const result = extractor.validateModes(bindings);
      expect(result.discrepancies).toEqual([]);
    });

    it('skips bindings where only one mode is an alias', () => {
      const bindings = [makeBinding({
        variableName: 'color.primary',
        resolvedType: 'COLOR',
        valuesByMode: {
          light: { aliasOf: 'color/purple/300' },
          dark: '#000000',
        },
        isAlias: true,
      })];

      const result = extractor.validateModes(bindings);
      expect(result.discrepancies).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // Mode key identification
  // -------------------------------------------------------------------------

  describe('mode key identification', () => {
    it('identifies light/dark modes by key name (case-insensitive)', () => {
      const bindings = [makeBinding({
        variableName: 'space/300',
        resolvedType: 'FLOAT',
        valuesByMode: { Light: 24, Dark: 32 },
      })];

      const result = extractor.validateModes(bindings);

      expect(result.discrepancies).toHaveLength(1);
      expect(result.discrepancies[0].lightValue).toBe(24);
      expect(result.discrepancies[0].darkValue).toBe(32);
    });

    it('falls back to first two modes when keys are not light/dark', () => {
      const bindings = [makeBinding({
        variableName: 'space/300',
        resolvedType: 'FLOAT',
        valuesByMode: { 'Mode 1': 24, 'Mode 2': 32 },
      })];

      const result = extractor.validateModes(bindings);

      expect(result.discrepancies).toHaveLength(1);
      expect(result.discrepancies[0].lightValue).toBe(24);
      expect(result.discrepancies[0].darkValue).toBe(32);
    });
  });

  // -------------------------------------------------------------------------
  // Object value comparison
  // -------------------------------------------------------------------------

  describe('object value comparison', () => {
    it('treats identical object values as equal', () => {
      const bindings = [makeBinding({
        variableName: 'color/purple/300',
        resolvedType: 'COLOR',
        valuesByMode: {
          light: { r: 0.49, g: 0.23, b: 0.93, a: 1 },
          dark: { r: 0.49, g: 0.23, b: 0.93, a: 1 },
        },
      })];

      const result = extractor.validateModes(bindings);
      expect(result.discrepancies).toEqual([]);
    });

    it('detects different object values', () => {
      const bindings = [makeBinding({
        variableName: 'color/purple/300',
        resolvedType: 'COLOR',
        valuesByMode: {
          light: { r: 1, g: 1, b: 1, a: 1 },
          dark: { r: 0, g: 0, b: 0, a: 1 },
        },
      })];

      const result = extractor.validateModes(bindings);
      expect(result.discrepancies).toHaveLength(1);
      expect(result.discrepancies[0].category).toBe('expected');
    });
  });
});
