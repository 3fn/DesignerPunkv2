/**
 * Tests for get_index_health MCP Tool
 * 
 * Requirements: 9.1, 9.2, 9.5
 */

import {
  getIndexHealthTool,
  handleGetIndexHealth,
  createGetIndexHealthHandler,
  formatMcpResponse,
  GetIndexHealthResult
} from '../get-index-health';
import { QueryEngine } from '../../query/QueryEngine';
import { IndexHealth } from '../../models';

// Mock QueryEngine
const mockGetIndexHealth = jest.fn();
const mockQueryEngine = {
  getIndexHealth: mockGetIndexHealth
} as unknown as QueryEngine;

describe('get_index_health tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('tool definition', () => {
    it('should have correct name', () => {
      expect(getIndexHealthTool.name).toBe('get_index_health');
    });

    it('should have description', () => {
      expect(getIndexHealthTool.description).toBeTruthy();
      expect(getIndexHealthTool.description).toContain('health');
    });

    it('should have empty required parameters', () => {
      expect(getIndexHealthTool.inputSchema.required).toEqual([]);
    });
  });

  describe('handleGetIndexHealth', () => {
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

    it('should return index health for healthy index', () => {
      mockGetIndexHealth.mockReturnValue({
        data: mockHealthyIndex,
        metrics: { operation: 'get_index_health', responseTimeMs: 5 }
      });

      const result = handleGetIndexHealth(mockQueryEngine);

      expect(result.health).toEqual(mockHealthyIndex);
      expect(result.health.status).toBe('healthy');
      expect(result.metrics.responseTimeMs).toBe(5);
    });

    it('should return index health for degraded index', () => {
      const degradedIndex: IndexHealth = {
        ...mockHealthyIndex,
        status: 'degraded',
        warnings: ['Some documents have incomplete metadata']
      };

      mockGetIndexHealth.mockReturnValue({
        data: degradedIndex,
        metrics: { operation: 'get_index_health', responseTimeMs: 8 }
      });

      const result = handleGetIndexHealth(mockQueryEngine);

      expect(result.health.status).toBe('degraded');
      expect(result.health.warnings).toContain('Some documents have incomplete metadata');
    });

    it('should return index health for failed index', () => {
      const failedIndex: IndexHealth = {
        ...mockHealthyIndex,
        status: 'failed',
        errors: ['Index is empty', 'No documents found']
      };

      mockGetIndexHealth.mockReturnValue({
        data: failedIndex,
        metrics: { operation: 'get_index_health', responseTimeMs: 3 }
      });

      const result = handleGetIndexHealth(mockQueryEngine);

      expect(result.health.status).toBe('failed');
      expect(result.health.errors).toHaveLength(2);
    });

    it('should include metrics in response', () => {
      mockGetIndexHealth.mockReturnValue({
        data: mockHealthyIndex,
        metrics: { operation: 'get_index_health', responseTimeMs: 12 }
      });

      const result = handleGetIndexHealth(mockQueryEngine);

      expect(result.metrics).toBeDefined();
      expect(result.metrics.responseTimeMs).toBe(12);
    });
  });

  describe('createGetIndexHealthHandler', () => {
    it('should create a handler function', () => {
      const handler = createGetIndexHealthHandler(mockQueryEngine);
      expect(typeof handler).toBe('function');
    });

    it('should call handleGetIndexHealth when invoked', () => {
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

      mockGetIndexHealth.mockReturnValue({
        data: mockHealth,
        metrics: { operation: 'get_index_health', responseTimeMs: 4 }
      });

      const handler = createGetIndexHealthHandler(mockQueryEngine);
      const result = handler();

      expect(mockGetIndexHealth).toHaveBeenCalled();
      expect(result.health).toEqual(mockHealth);
    });
  });

  describe('formatMcpResponse', () => {
    it('should format successful result as MCP response', () => {
      const result: GetIndexHealthResult = {
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
        metrics: {
          responseTimeMs: 5,
          status: 'healthy',
          documentsIndexed: 10
        }
      };

      const response = formatMcpResponse(result);

      expect(response.content).toHaveLength(1);
      expect(response.content[0].type).toBe('text');
      expect(JSON.parse(response.content[0].text)).toEqual(result);
    });
  });
});
