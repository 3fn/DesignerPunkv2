/**
 * Tests for rebuild_index MCP Tool
 * 
 * Requirements: 9.1, 9.2, 9.5
 */

import {
  rebuildIndexTool,
  handleRebuildIndex,
  createRebuildIndexHandler,
  formatMcpResponse,
  RebuildIndexResult
} from '../rebuild-index';
import { QueryEngine } from '../../query/QueryEngine';
import { IndexHealth } from '../../models';

// Mock QueryEngine
const mockRebuildIndex = jest.fn();
const mockQueryEngine = {
  rebuildIndex: mockRebuildIndex
} as unknown as QueryEngine;

describe('rebuild_index tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('tool definition', () => {
    it('should have correct name', () => {
      expect(rebuildIndexTool.name).toBe('rebuild_index');
    });

    it('should have description', () => {
      expect(rebuildIndexTool.description).toBeTruthy();
      expect(rebuildIndexTool.description).toContain('Rebuild');
    });

    it('should have empty required parameters', () => {
      expect(rebuildIndexTool.inputSchema.required).toEqual([]);
    });
  });

  describe('handleRebuildIndex', () => {
    const mockHealthyIndex: IndexHealth = {
      status: 'healthy',
      documentsIndexed: 10,
      lastIndexTime: '2025-12-16T10:00:00.000Z',
      errors: [],
      warnings: [],
      metrics: {
        totalDocuments: 10,
        totalSections: 50,
        totalCrossReferences: 25,
        indexSizeBytes: 50000
      }
    };

    it('should return success for successful rebuild', async () => {
      mockRebuildIndex.mockResolvedValue({
        data: mockHealthyIndex,
        metrics: { operation: 'rebuild_index', responseTimeMs: 150 }
      });

      const result = await handleRebuildIndex(mockQueryEngine);

      expect(result.success).toBe(true);
      expect(result.health).toEqual(mockHealthyIndex);
      expect(result.metrics.responseTimeMs).toBe(150);
      expect(result.metrics.documentsReindexed).toBe(10);
    });

    it('should return success false for failed rebuild', async () => {
      const failedIndex: IndexHealth = {
        ...mockHealthyIndex,
        status: 'failed',
        errors: ['Failed to read directory']
      };

      mockRebuildIndex.mockResolvedValue({
        data: failedIndex,
        metrics: { operation: 'rebuild_index', responseTimeMs: 50 }
      });

      const result = await handleRebuildIndex(mockQueryEngine);

      expect(result.success).toBe(false);
      expect(result.health.status).toBe('failed');
      expect(result.health.errors).toContain('Failed to read directory');
    });

    it('should return success true for degraded rebuild', async () => {
      const degradedIndex: IndexHealth = {
        ...mockHealthyIndex,
        status: 'degraded',
        warnings: ['Some documents have incomplete metadata']
      };

      mockRebuildIndex.mockResolvedValue({
        data: degradedIndex,
        metrics: { operation: 'rebuild_index', responseTimeMs: 100 }
      });

      const result = await handleRebuildIndex(mockQueryEngine);

      expect(result.success).toBe(true);
      expect(result.health.status).toBe('degraded');
    });

    it('should include documents reindexed count', async () => {
      mockRebuildIndex.mockResolvedValue({
        data: { ...mockHealthyIndex, documentsIndexed: 15 },
        metrics: { operation: 'rebuild_index', responseTimeMs: 200 }
      });

      const result = await handleRebuildIndex(mockQueryEngine);

      expect(result.metrics.documentsReindexed).toBe(15);
    });
  });

  describe('createRebuildIndexHandler', () => {
    it('should create a handler function', () => {
      const handler = createRebuildIndexHandler(mockQueryEngine);
      expect(typeof handler).toBe('function');
    });

    it('should call handleRebuildIndex when invoked', async () => {
      const mockHealth: IndexHealth = {
        status: 'healthy',
        documentsIndexed: 5,
        lastIndexTime: '2025-12-16T10:00:00.000Z',
        errors: [],
        warnings: [],
        metrics: {
          totalDocuments: 5,
          totalSections: 20,
          totalCrossReferences: 10,
          indexSizeBytes: 25000
        }
      };

      mockRebuildIndex.mockResolvedValue({
        data: mockHealth,
        metrics: { operation: 'rebuild_index', responseTimeMs: 80 }
      });

      const handler = createRebuildIndexHandler(mockQueryEngine);
      const result = await handler();

      expect(mockRebuildIndex).toHaveBeenCalled();
      expect(result.health).toEqual(mockHealth);
    });
  });

  describe('formatMcpResponse', () => {
    it('should format successful result as MCP response', () => {
      const result: RebuildIndexResult = {
        health: {
          status: 'healthy',
          documentsIndexed: 10,
          lastIndexTime: '2025-12-16T10:00:00.000Z',
          errors: [],
          warnings: [],
          metrics: {
            totalDocuments: 10,
            totalSections: 50,
            totalCrossReferences: 25,
            indexSizeBytes: 50000
          }
        },
        success: true,
        metrics: {
          responseTimeMs: 150,
          documentsReindexed: 10
        }
      };

      const response = formatMcpResponse(result);

      expect(response.content).toHaveLength(1);
      expect(response.content[0].type).toBe('text');
      expect(JSON.parse(response.content[0].text)).toEqual(result);
    });

    it('should format failed result as MCP response', () => {
      const result: RebuildIndexResult = {
        health: {
          status: 'failed',
          documentsIndexed: 0,
          lastIndexTime: '2025-12-16T10:00:00.000Z',
          errors: ['Failed to read directory'],
          warnings: [],
          metrics: {
            totalDocuments: 0,
            totalSections: 0,
            totalCrossReferences: 0,
            indexSizeBytes: 0
          }
        },
        success: false,
        metrics: {
          responseTimeMs: 50,
          documentsReindexed: 0
        }
      };

      const response = formatMcpResponse(result);

      expect(response.content).toHaveLength(1);
      const parsed = JSON.parse(response.content[0].text);
      expect(parsed.success).toBe(false);
    });
  });
});
