/**
 * TokenSyncWorkflow — Batch Variable Sync Tests
 *
 * Tests for syncVariables(), batchCreateVariables(), and batchUpdateVariables().
 * Validates batching (100 per batch), resume support, stop-on-first-failure,
 * and created/updated count tracking.
 *
 * @requirements Req 4 (Token Sync Workflow), Req 9 (Error Handling)
 */

import {
  TokenSyncWorkflow,
  BATCH_SIZE,
} from '../TokenSyncWorkflow';
import type { VariableSyncResult } from '../TokenSyncWorkflow';
import type { ConsoleMCPClient } from '../ConsoleMCPClient';
import type { FigmaVariable } from '../../generators/transformers/FigmaTransformer';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeMockMcp(): jest.Mocked<ConsoleMCPClient> {
  return {
    batchCreateVariables: jest.fn().mockResolvedValue(undefined),
    batchUpdateVariables: jest.fn().mockResolvedValue(undefined),
    getVariables: jest.fn().mockResolvedValue([]),
    execute: jest.fn().mockResolvedValue(undefined),
    setupDesignTokens: jest.fn().mockResolvedValue(undefined),
  };
}

function makeVariable(name: string, value: number = 8): FigmaVariable {
  return {
    name,
    type: 'FLOAT',
    valuesByMode: { light: value, dark: value },
  };
}

function makeVariables(count: number, prefix = 'space'): FigmaVariable[] {
  return Array.from({ length: count }, (_, i) =>
    makeVariable(`${prefix}/${i + 1}`, i + 1),
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('TokenSyncWorkflow — Batch Variable Sync', () => {
  let mockMcp: jest.Mocked<ConsoleMCPClient>;
  let workflow: TokenSyncWorkflow;

  beforeEach(() => {
    mockMcp = makeMockMcp();
    workflow = new TokenSyncWorkflow(mockMcp, 'test-file-key');
  });

  // -------------------------------------------------------------------------
  // batchCreateVariables
  // -------------------------------------------------------------------------

  describe('batchCreateVariables', () => {
    it('creates all variables in a single batch when count <= BATCH_SIZE', async () => {
      const vars = makeVariables(50);
      const result = await workflow.batchCreateVariables(vars);

      expect(result.created).toBe(50);
      expect(result.errors).toHaveLength(0);
      expect(mockMcp.batchCreateVariables).toHaveBeenCalledTimes(1);
      expect(mockMcp.batchCreateVariables).toHaveBeenCalledWith('test-file-key', vars);
    });

    it('chunks variables into batches of BATCH_SIZE', async () => {
      const vars = makeVariables(250);
      const result = await workflow.batchCreateVariables(vars);

      expect(result.created).toBe(250);
      expect(result.errors).toHaveLength(0);
      expect(mockMcp.batchCreateVariables).toHaveBeenCalledTimes(3);
      // First batch: 100, second: 100, third: 50
      expect(mockMcp.batchCreateVariables.mock.calls[0][1]).toHaveLength(BATCH_SIZE);
      expect(mockMcp.batchCreateVariables.mock.calls[1][1]).toHaveLength(BATCH_SIZE);
      expect(mockMcp.batchCreateVariables.mock.calls[2][1]).toHaveLength(50);
    });

    it('stops on first batch failure and reports error', async () => {
      const vars = makeVariables(250);
      mockMcp.batchCreateVariables
        .mockResolvedValueOnce(undefined) // batch 1 succeeds
        .mockRejectedValueOnce(new Error('Rate limit exceeded (429)'));

      const result = await workflow.batchCreateVariables(vars);

      expect(result.created).toBe(100); // Only batch 1 succeeded
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        phase: 'variables:create',
        batch: 2,
        totalBatches: 3,
        message: 'Rate limit exceeded (429)',
      });
      // Batch 3 was never attempted
      expect(mockMcp.batchCreateVariables).toHaveBeenCalledTimes(2);
    });

    it('resumes from specified batch (1-indexed)', async () => {
      const vars = makeVariables(250);
      const result = await workflow.batchCreateVariables(vars, 3);

      // Only batch 3 (the last 50 variables) should be processed
      expect(result.created).toBe(50);
      expect(result.errors).toHaveLength(0);
      expect(mockMcp.batchCreateVariables).toHaveBeenCalledTimes(1);
      expect(mockMcp.batchCreateVariables.mock.calls[0][1]).toHaveLength(50);
    });

    it('handles empty variable list', async () => {
      const result = await workflow.batchCreateVariables([]);

      expect(result.created).toBe(0);
      expect(result.errors).toHaveLength(0);
      expect(mockMcp.batchCreateVariables).not.toHaveBeenCalled();
    });

    it('handles exactly BATCH_SIZE variables', async () => {
      const vars = makeVariables(BATCH_SIZE);
      const result = await workflow.batchCreateVariables(vars);

      expect(result.created).toBe(BATCH_SIZE);
      expect(mockMcp.batchCreateVariables).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------
  // batchUpdateVariables
  // -------------------------------------------------------------------------

  describe('batchUpdateVariables', () => {
    it('updates all variables in a single batch when count <= BATCH_SIZE', async () => {
      const vars = makeVariables(30);
      const result = await workflow.batchUpdateVariables(vars);

      expect(result.updated).toBe(30);
      expect(result.errors).toHaveLength(0);
      expect(mockMcp.batchUpdateVariables).toHaveBeenCalledTimes(1);
    });

    it('chunks updates into batches of BATCH_SIZE', async () => {
      const vars = makeVariables(150);
      const result = await workflow.batchUpdateVariables(vars);

      expect(result.updated).toBe(150);
      expect(mockMcp.batchUpdateVariables).toHaveBeenCalledTimes(2);
    });

    it('stops on first batch failure', async () => {
      const vars = makeVariables(200);
      mockMcp.batchUpdateVariables
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Connection lost'));

      const result = await workflow.batchUpdateVariables(vars);

      expect(result.updated).toBe(100);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].phase).toBe('variables:update');
      expect(result.errors[0].batch).toBe(2);
      expect(result.errors[0].totalBatches).toBe(2);
    });

    it('resumes from specified batch', async () => {
      const vars = makeVariables(200);
      const result = await workflow.batchUpdateVariables(vars, 2);

      expect(result.updated).toBe(100);
      expect(mockMcp.batchUpdateVariables).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------
  // syncVariables (orchestration)
  // -------------------------------------------------------------------------

  describe('syncVariables', () => {
    it('separates variables into create and update sets', async () => {
      const newVars = [makeVariable('space/new', 8)];
      const existingVars = [makeVariable('space/existing', 16)];
      const allVars = [...newVars, ...existingVars];

      // space/existing already in Figma
      const currentFigma = [makeVariable('space/existing', 16)];

      const result = await workflow.syncVariables(allVars, currentFigma);

      expect(result.created).toBe(1);
      expect(result.updated).toBe(1);
      expect(result.errors).toHaveLength(0);
      expect(mockMcp.batchCreateVariables).toHaveBeenCalledTimes(1);
      expect(mockMcp.batchUpdateVariables).toHaveBeenCalledTimes(1);
    });

    it('only creates when no existing variables in Figma', async () => {
      const vars = makeVariables(5);
      const result = await workflow.syncVariables(vars, []);

      expect(result.created).toBe(5);
      expect(result.updated).toBe(0);
      expect(mockMcp.batchCreateVariables).toHaveBeenCalledTimes(1);
      expect(mockMcp.batchUpdateVariables).not.toHaveBeenCalled();
    });

    it('only updates when all variables already exist', async () => {
      const vars = makeVariables(5);
      const currentFigma = makeVariables(5); // Same names
      const result = await workflow.syncVariables(vars, currentFigma);

      expect(result.created).toBe(0);
      expect(result.updated).toBe(5);
      expect(mockMcp.batchCreateVariables).not.toHaveBeenCalled();
      expect(mockMcp.batchUpdateVariables).toHaveBeenCalledTimes(1);
    });

    it('stops before updates if create fails', async () => {
      const newVars = makeVariables(150, 'new');
      const existingVars = makeVariables(50, 'existing');
      const allVars = [...newVars, ...existingVars];
      const currentFigma = makeVariables(50, 'existing');

      mockMcp.batchCreateVariables
        .mockResolvedValueOnce(undefined) // batch 1 ok
        .mockRejectedValueOnce(new Error('API error'));

      const result = await workflow.syncVariables(allVars, currentFigma);

      expect(result.created).toBe(100);
      expect(result.updated).toBe(0); // Never reached updates
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].phase).toBe('variables:create');
      expect(mockMcp.batchUpdateVariables).not.toHaveBeenCalled();
    });

    it('handles empty variable list', async () => {
      const result = await workflow.syncVariables([], []);

      expect(result.created).toBe(0);
      expect(result.updated).toBe(0);
      expect(result.errors).toHaveLength(0);
    });
  });
});
