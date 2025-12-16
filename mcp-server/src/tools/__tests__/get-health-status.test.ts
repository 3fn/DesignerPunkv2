/**
 * Tests for get_health_status MCP Tool
 * 
 * Requirements: 16.5
 */

import {
  getHealthStatusTool,
  handleGetHealthStatus,
  createGetHealthStatusHandler,
  formatMcpResponse,
  GetHealthStatusResult
} from '../get-health-status';
import { QueryEngine } from '../../query/QueryEngine';
import { IndexHealth } from '../../models';

// Mock QueryEngine
const mockGetIndexHealth = jest.fn();
const mockQueryEngine = {
  getIndexHealth: mockGetIndexHealth
} as unknown as QueryEngine;

describe('get_health_status tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('tool definition', () => {
    it('should have correct name', () => {
      expect(getHealthStatusTool.name).toBe('get_health_status');
    });

    it('should have description', () => {
      expect(getHealthStatusTool.description).toBeTruthy();
      expect(getHealthStatusTool.description).toContain('health');
      expect(getHealthStatusTool.description).toContain('uptime');
    });

    it('should have empty required parameters', () => {
      expect(getHealthStatusTool.inputSchema.required).toEqual([]);
    });
  });

  describe('handleGetHealthStatus', () => {
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

    it('should return comprehensive health status', () => {
      mockGetIndexHealth.mockReturnValue({
        data: mockHealthyIndex,
        metrics: { operation: 'get_index_health', responseTimeMs: 5 }
      });

      const result = handleGetHealthStatus(mockQueryEngine);

      expect(result.status).toBeDefined();
      expect(result.status.indexHealth).toEqual(mockHealthyIndex);
      expect(result.metrics.responseTimeMs).toBeGreaterThanOrEqual(0);
    });

    it('should include uptime in seconds', () => {
      mockGetIndexHealth.mockReturnValue({
        data: mockHealthyIndex,
        metrics: { operation: 'get_index_health', responseTimeMs: 5 }
      });

      const result = handleGetHealthStatus(mockQueryEngine);

      expect(result.status.uptimeSeconds).toBeDefined();
      expect(typeof result.status.uptimeSeconds).toBe('number');
      expect(result.status.uptimeSeconds).toBeGreaterThanOrEqual(0);
    });

    it('should include memory usage', () => {
      mockGetIndexHealth.mockReturnValue({
        data: mockHealthyIndex,
        metrics: { operation: 'get_index_health', responseTimeMs: 5 }
      });

      const result = handleGetHealthStatus(mockQueryEngine);

      expect(result.status.memoryUsage).toBeDefined();
      expect(result.status.memoryUsage.heapUsed).toBeGreaterThan(0);
      expect(result.status.memoryUsage.heapTotal).toBeGreaterThan(0);
      expect(result.status.memoryUsage.rss).toBeGreaterThan(0);
      expect(result.status.memoryUsage.external).toBeGreaterThanOrEqual(0);
    });

    it('should include server start time', () => {
      mockGetIndexHealth.mockReturnValue({
        data: mockHealthyIndex,
        metrics: { operation: 'get_index_health', responseTimeMs: 5 }
      });

      const result = handleGetHealthStatus(mockQueryEngine);

      expect(result.status.startTime).toBeDefined();
      expect(typeof result.status.startTime).toBe('string');
      // Should be a valid ISO date string
      expect(new Date(result.status.startTime).toISOString()).toBe(result.status.startTime);
    });

    it('should include index health for degraded index', () => {
      const degradedIndex: IndexHealth = {
        ...mockHealthyIndex,
        status: 'degraded',
        warnings: ['Some documents have incomplete metadata']
      };

      mockGetIndexHealth.mockReturnValue({
        data: degradedIndex,
        metrics: { operation: 'get_index_health', responseTimeMs: 8 }
      });

      const result = handleGetHealthStatus(mockQueryEngine);

      expect(result.status.indexHealth.status).toBe('degraded');
      expect(result.status.indexHealth.warnings).toContain('Some documents have incomplete metadata');
    });

    it('should include index health for failed index', () => {
      const failedIndex: IndexHealth = {
        ...mockHealthyIndex,
        status: 'failed',
        errors: ['Index is empty']
      };

      mockGetIndexHealth.mockReturnValue({
        data: failedIndex,
        metrics: { operation: 'get_index_health', responseTimeMs: 3 }
      });

      const result = handleGetHealthStatus(mockQueryEngine);

      expect(result.status.indexHealth.status).toBe('failed');
      expect(result.status.indexHealth.errors).toContain('Index is empty');
    });
  });

  describe('createGetHealthStatusHandler', () => {
    it('should create a handler function', () => {
      const handler = createGetHealthStatusHandler(mockQueryEngine);
      expect(typeof handler).toBe('function');
    });

    it('should call handleGetHealthStatus when invoked', () => {
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

      const handler = createGetHealthStatusHandler(mockQueryEngine);
      const result = handler();

      expect(mockGetIndexHealth).toHaveBeenCalled();
      expect(result.status.indexHealth).toEqual(mockHealth);
    });
  });

  describe('formatMcpResponse', () => {
    it('should format result as MCP response', () => {
      const result: GetHealthStatusResult = {
        status: {
          indexHealth: {
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
          uptimeSeconds: 3600,
          memoryUsage: {
            heapUsed: 50000000,
            heapTotal: 100000000,
            external: 1000000,
            rss: 150000000
          },
          startTime: '2025-12-16T09:00:00.000Z'
        },
        metrics: {
          responseTimeMs: 5
        }
      };

      const response = formatMcpResponse(result);

      expect(response.content).toHaveLength(1);
      expect(response.content[0].type).toBe('text');
      expect(JSON.parse(response.content[0].text)).toEqual(result);
    });
  });
});
