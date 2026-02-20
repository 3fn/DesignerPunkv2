/**
 * TokenSyncWorkflow — Main Sync Method Tests
 *
 * Tests for sync() method: orchestrating drift detection, variable sync,
 * style sync, and combined result reporting.
 *
 * @requirements Req 4 (Token Sync Workflow), Req 5 (Drift Detection), Req 9 (Error Handling)
 */

import { TokenSyncWorkflow } from '../TokenSyncWorkflow';
import type { ConsoleMCPClient } from '../ConsoleMCPClient';
import type {
  FigmaTokenFile,
  FigmaVariable,
  FigmaStyleDefinition,
  EffectStyleProperties,
} from '../../generators/transformers/FigmaTransformer';

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
    getStyles: jest.fn().mockResolvedValue([]),
    getComponent: jest.fn().mockResolvedValue({}),
  };
}

function makeVariable(name: string, value: number = 8): FigmaVariable {
  return {
    name,
    resolvedType: 'FLOAT',
    valuesByMode: { light: value, dark: value },
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

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('TokenSyncWorkflow — sync()', () => {
  let mockMcp: jest.Mocked<ConsoleMCPClient>;
  let workflow: TokenSyncWorkflow;

  beforeEach(() => {
    mockMcp = makeMockMcp();
    workflow = new TokenSyncWorkflow(mockMcp, 'test-file-key');
  });

  it('fetches current Figma state before syncing', async () => {
    const tokens = makeTokenFile([makeVariable('space/100')]);
    await workflow.sync(tokens);

    expect(mockMcp.getVariables).toHaveBeenCalledWith('test-file-key');
  });

  it('creates variables when Figma is empty', async () => {
    mockMcp.getVariables.mockResolvedValue([]);
    const tokens = makeTokenFile([
      makeVariable('space/100', 8),
      makeVariable('space/200', 16),
    ]);

    const result = await workflow.sync(tokens);

    expect(result.success).toBe(true);
    expect(result.created).toBe(2);
    expect(result.updated).toBe(0);
    expect(result.errors).toHaveLength(0);
  });

  it('updates variables that already exist in Figma', async () => {
    const vars = [makeVariable('space/100', 8)];
    const figmaVars = vars.map((v, i) => ({ ...v, id: `VariableID:${i}:0`, collectionId: 'VariableCollectionId:1:0' }));
    mockMcp.getVariables.mockResolvedValue(figmaVars);
    const tokens = makeTokenFile(vars);

    const result = await workflow.sync(tokens);

    expect(result.success).toBe(true);
    expect(result.updated).toBe(1);
  });

  it('blocks sync when drift is detected', async () => {
    mockMcp.getVariables.mockResolvedValue([
      makeVariable('space/100', 10), // Drifted: expected 8, actual 10
    ]);
    const tokens = makeTokenFile([makeVariable('space/100', 8)]);

    const result = await workflow.sync(tokens);

    expect(result.success).toBe(false);
    expect(result.driftDetected).toBeDefined();
    expect(result.driftDetected!.hasDrift).toBe(true);
    expect(result.driftDetected!.driftedVariables).toHaveLength(1);
    expect(result.errors[0].phase).toBe('drift-detection');
    // Should NOT have attempted any sync operations
    expect(mockMcp.batchCreateVariables).not.toHaveBeenCalled();
    expect(mockMcp.batchUpdateVariables).not.toHaveBeenCalled();
  });

  it('proceeds with sync when drift detected but forceOverride is true', async () => {
    mockMcp.getVariables.mockResolvedValue([
      { ...makeVariable('space/100', 10), id: 'VariableID:0:0', collectionId: 'VariableCollectionId:1:0' }, // Drifted
    ]);
    const tokens = makeTokenFile([makeVariable('space/100', 8)]);

    const result = await workflow.sync(tokens, { forceOverride: true });

    expect(result.success).toBe(true);
    expect(result.updated).toBe(1);
    expect(result.driftDetected).toBeUndefined();
  });

  it('skips drift detection when resuming', async () => {
    mockMcp.getVariables.mockResolvedValue([
      makeVariable('space/100', 10), // Would be drift, but resume skips check
    ]);
    const tokens = makeTokenFile([makeVariable('space/100', 8)]);

    const result = await workflow.sync(tokens, { resume: 1 });

    // Should proceed despite drift because resume skips drift detection
    expect(result.success).toBe(true);
    expect(result.driftDetected).toBeUndefined();
  });

  it('syncs both variables and styles', async () => {
    mockMcp.getVariables.mockResolvedValue([]);
    const tokens = makeTokenFile(
      [makeVariable('space/100', 8)],
      [makeEffectStyle('shadow.container')],
    );

    const result = await workflow.sync(tokens);

    expect(result.success).toBe(true);
    expect(result.created).toBe(2); // 1 variable + 1 style
    expect(mockMcp.batchCreateVariables).toHaveBeenCalled();
    expect(mockMcp.execute).toHaveBeenCalled();
  });

  it('stops before styles if variable sync fails', async () => {
    mockMcp.getVariables.mockResolvedValue([]);
    mockMcp.batchCreateVariables.mockRejectedValue(new Error('API error'));
    const tokens = makeTokenFile(
      [makeVariable('space/100')],
      [makeEffectStyle('shadow.container')],
    );

    const result = await workflow.sync(tokens);

    expect(result.success).toBe(false);
    expect(result.errors[0].phase).toBe('variables:create');
    // Styles should NOT have been attempted
    expect(mockMcp.execute).not.toHaveBeenCalled();
  });

  it('reports style errors in combined result', async () => {
    mockMcp.getVariables.mockResolvedValue([]);
    mockMcp.execute.mockRejectedValue(new Error('Plugin API timeout'));
    const tokens = makeTokenFile(
      [],
      [makeEffectStyle('shadow.container')],
    );

    const result = await workflow.sync(tokens);

    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].phase).toBe('styles');
  });

  it('returns deleted count as 0 (deletion not yet supported)', async () => {
    const tokens = makeTokenFile([makeVariable('space/100')]);
    const result = await workflow.sync(tokens);

    expect(result.deleted).toBe(0);
  });
});
