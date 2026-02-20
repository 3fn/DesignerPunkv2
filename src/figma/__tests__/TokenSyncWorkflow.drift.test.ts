/**
 * TokenSyncWorkflow — Drift Detection Tests
 *
 * Tests for detectDrift() method: comparing current Figma state
 * against expected token state and identifying drifted variables.
 *
 * @requirements Req 5 (Drift Detection)
 */

import { TokenSyncWorkflow } from '../TokenSyncWorkflow';
import type { ConsoleMCPClient } from '../ConsoleMCPClient';
import type {
  FigmaTokenFile,
  FigmaVariable,
} from '../../generators/transformers/FigmaTransformer';

// Minimal mock — drift detection doesn't call MCP methods
const mockMcp: ConsoleMCPClient = {
  batchCreateVariables: jest.fn(),
  batchUpdateVariables: jest.fn(),
  createVariableAliases: jest.fn(),
  getVariables: jest.fn(),
  execute: jest.fn(),
  setupDesignTokens: jest.fn(),
  getStatus: jest.fn(),
  getStyles: jest.fn().mockResolvedValue([]),
  getComponent: jest.fn().mockResolvedValue({}),
};

function makeWorkflow(): TokenSyncWorkflow {
  return new TokenSyncWorkflow(mockMcp, 'test-file-key');
}

function makeExpected(variables: FigmaVariable[]): FigmaTokenFile {
  return {
    collections: [
      { name: 'Primitives', modes: ['light', 'dark'], variables },
    ],
    styles: [],
  };
}

describe('TokenSyncWorkflow — Drift Detection', () => {
  let workflow: TokenSyncWorkflow;

  beforeEach(() => {
    workflow = makeWorkflow();
  });

  it('reports no drift when Figma matches expected state', () => {
    const expected = makeExpected([
      { name: 'space/100', resolvedType: 'FLOAT', valuesByMode: { light: 8, dark: 8 } },
      { name: 'space/200', resolvedType: 'FLOAT', valuesByMode: { light: 16, dark: 16 } },
    ]);

    const current: FigmaVariable[] = [
      { name: 'space/100', resolvedType: 'FLOAT', valuesByMode: { light: 8, dark: 8 } },
      { name: 'space/200', resolvedType: 'FLOAT', valuesByMode: { light: 16, dark: 16 } },
    ];

    const report = workflow.detectDrift(current, expected);

    expect(report.hasDrift).toBe(false);
    expect(report.driftedVariables).toHaveLength(0);
  });

  it('detects drift when a numeric value has been edited in Figma', () => {
    const expected = makeExpected([
      { name: 'space/300', resolvedType: 'FLOAT', valuesByMode: { light: 24, dark: 24 } },
    ]);

    const current: FigmaVariable[] = [
      { name: 'space/300', resolvedType: 'FLOAT', valuesByMode: { light: 25, dark: 25 } },
    ];

    const report = workflow.detectDrift(current, expected);

    expect(report.hasDrift).toBe(true);
    expect(report.driftedVariables).toHaveLength(1);
    expect(report.driftedVariables[0]).toEqual({
      name: 'space/300',
      expectedValue: 24,
      actualValue: 25,
    });
  });

  it('detects drift when a color value has been edited', () => {
    const expectedColor = { r: 0.69, g: 0.15, b: 1, a: 1 };
    const actualColor = { r: 0.63, g: 0.13, b: 0.88, a: 1 };

    const expected = makeExpected([
      { name: 'color/primary', resolvedType: 'COLOR', valuesByMode: { light: expectedColor, dark: expectedColor } },
    ]);

    const current: FigmaVariable[] = [
      { name: 'color/primary', resolvedType: 'COLOR', valuesByMode: { light: actualColor, dark: actualColor } },
    ];

    const report = workflow.detectDrift(current, expected);

    expect(report.hasDrift).toBe(true);
    expect(report.driftedVariables).toHaveLength(1);
    expect(report.driftedVariables[0].name).toBe('color/primary');
    expect(report.driftedVariables[0].expectedValue).toEqual(expectedColor);
    expect(report.driftedVariables[0].actualValue).toEqual(actualColor);
  });

  it('ignores Figma variables not present in expected state', () => {
    const expected = makeExpected([
      { name: 'space/100', resolvedType: 'FLOAT', valuesByMode: { light: 8, dark: 8 } },
    ]);

    const current: FigmaVariable[] = [
      { name: 'space/100', resolvedType: 'FLOAT', valuesByMode: { light: 8, dark: 8 } },
      { name: 'custom/unknown', resolvedType: 'FLOAT', valuesByMode: { light: 42, dark: 42 } },
    ];

    const report = workflow.detectDrift(current, expected);

    expect(report.hasDrift).toBe(false);
    expect(report.driftedVariables).toHaveLength(0);
  });

  it('detects drift in only one mode', () => {
    const expected = makeExpected([
      { name: 'space/100', resolvedType: 'FLOAT', valuesByMode: { light: 8, dark: 8 } },
    ]);

    const current: FigmaVariable[] = [
      { name: 'space/100', resolvedType: 'FLOAT', valuesByMode: { light: 8, dark: 10 } },
    ];

    const report = workflow.detectDrift(current, expected);

    expect(report.hasDrift).toBe(true);
    expect(report.driftedVariables).toHaveLength(1);
    expect(report.driftedVariables[0].name).toBe('space/100');
  });

  it('handles multiple drifted variables across collections', () => {
    const expected: FigmaTokenFile = {
      collections: [
        {
          name: 'Primitives',
          modes: ['light', 'dark'],
          variables: [
            { name: 'space/100', resolvedType: 'FLOAT', valuesByMode: { light: 8, dark: 8 } },
          ],
        },
        {
          name: 'Semantics',
          modes: ['light', 'dark'],
          variables: [
            { name: 'fontSize/200', resolvedType: 'FLOAT', valuesByMode: { light: 16, dark: 16 } },
          ],
        },
      ],
      styles: [],
    };

    const current: FigmaVariable[] = [
      { name: 'space/100', resolvedType: 'FLOAT', valuesByMode: { light: 9, dark: 9 } },
      { name: 'fontSize/200', resolvedType: 'FLOAT', valuesByMode: { light: 18, dark: 18 } },
    ];

    const report = workflow.detectDrift(current, expected);

    expect(report.hasDrift).toBe(true);
    expect(report.driftedVariables).toHaveLength(2);
    expect(report.driftedVariables.map((d) => d.name)).toEqual([
      'space/100',
      'fontSize/200',
    ]);
  });

  it('reports no drift when current Figma has no variables', () => {
    const expected = makeExpected([
      { name: 'space/100', resolvedType: 'FLOAT', valuesByMode: { light: 8, dark: 8 } },
    ]);

    const report = workflow.detectDrift([], expected);

    expect(report.hasDrift).toBe(false);
    expect(report.driftedVariables).toHaveLength(0);
  });
});
