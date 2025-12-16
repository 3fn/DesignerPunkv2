/**
 * Tests for get_document_full MCP Tool
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

import {
  getDocumentFullTool,
  handleGetDocumentFull,
  createGetDocumentFullHandler,
  formatMcpResponse,
  isGetDocumentFullError,
  GetDocumentFullResult,
  GetDocumentFullError
} from '../get-document-full';
import { QueryEngine, QueryResult } from '../../query/QueryEngine';
import { DocumentFull } from '../../models';

// Mock QueryEngine
const createMockQueryEngine = (mockData: DocumentFull): QueryEngine => {
  return {
    getDocumentFull: jest.fn().mockReturnValue({
      data: mockData,
      metrics: {
        operation: 'get_document_full',
        responseTimeMs: 50,
        tokenCounts: {
          fullDocument: mockData.tokenCount
        }
      }
    } as QueryResult<DocumentFull>)
  } as unknown as QueryEngine;
};

// Mock QueryEngine that throws FileNotFound error
const createMockQueryEngineWithError = (errorType: string, message: string): QueryEngine => {
  const error = new Error(message);
  (error as any).errorType = errorType;
  return {
    getDocumentFull: jest.fn().mockImplementation(() => {
      throw error;
    })
  } as unknown as QueryEngine;
};

describe('get_document_full tool', () => {
  describe('tool definition', () => {
    it('should have correct name', () => {
      expect(getDocumentFullTool.name).toBe('get_document_full');
    });

    it('should have a description', () => {
      expect(getDocumentFullTool.description).toBeTruthy();
      expect(typeof getDocumentFullTool.description).toBe('string');
    });

    it('should require path parameter', () => {
      expect(getDocumentFullTool.inputSchema.type).toBe('object');
      expect(getDocumentFullTool.inputSchema.properties.path).toBeDefined();
      expect(getDocumentFullTool.inputSchema.properties.path.type).toBe('string');
      expect(getDocumentFullTool.inputSchema.required).toContain('path');
    });
  });

  describe('handleGetDocumentFull', () => {
    const mockDocumentFull: DocumentFull = {
      path: '.kiro/steering/Component Development Guide.md',
      content: '# Component Development Guide\n\n## Overview\n\nThis guide helps AI agents build components...',
      metadata: {
        purpose: 'Guide AI agents in building components',
        layer: 3,
        relevantTasks: ['component-development', 'token-selection'],
        lastReviewed: '2025-12-15',
        organization: 'process-standard',
        scope: 'cross-project'
      },
      tokenCount: 15000
    };

    it('should return full document from QueryEngine', () => {
      const mockQueryEngine = createMockQueryEngine(mockDocumentFull);
      const result = handleGetDocumentFull(mockQueryEngine, '.kiro/steering/Component Development Guide.md');

      expect(isGetDocumentFullError(result)).toBe(false);
      if (!isGetDocumentFullError(result)) {
        expect(result.documentFull).toEqual(mockDocumentFull);
        expect(mockQueryEngine.getDocumentFull).toHaveBeenCalledWith('.kiro/steering/Component Development Guide.md');
      }
    });

    it('should include performance metrics', () => {
      const mockQueryEngine = createMockQueryEngine(mockDocumentFull);
      const result = handleGetDocumentFull(mockQueryEngine, '.kiro/steering/Component Development Guide.md');

      expect(isGetDocumentFullError(result)).toBe(false);
      if (!isGetDocumentFullError(result)) {
        expect(result.metrics).toBeDefined();
        expect(result.metrics.responseTimeMs).toBe(50);
        expect(result.metrics.tokenCount).toBe(15000);
      }
    });

    it('should preserve markdown content', () => {
      const mockQueryEngine = createMockQueryEngine(mockDocumentFull);
      const result = handleGetDocumentFull(mockQueryEngine, '.kiro/steering/Component Development Guide.md');

      expect(isGetDocumentFullError(result)).toBe(false);
      if (!isGetDocumentFullError(result)) {
        expect(result.documentFull.content).toContain('# Component Development Guide');
        expect(result.documentFull.content).toContain('## Overview');
      }
    });

    it('should handle FileNotFound errors', () => {
      const mockQueryEngine = createMockQueryEngineWithError('FileNotFound', 'Document not found');
      const result = handleGetDocumentFull(mockQueryEngine, 'nonexistent.md');

      expect(isGetDocumentFullError(result)).toBe(true);
      if (isGetDocumentFullError(result)) {
        expect(result.error.error).toBe('FileNotFound');
        expect(result.error.filePath).toBe('nonexistent.md');
      }
    });

    it('should handle InvalidParameter errors', () => {
      const mockQueryEngine = createMockQueryEngineWithError('InvalidParameter', 'Path parameter is required');
      const result = handleGetDocumentFull(mockQueryEngine, '');

      expect(isGetDocumentFullError(result)).toBe(true);
      if (isGetDocumentFullError(result)) {
        expect(result.error.error).toBe('FileNotFound');
      }
    });
  });

  describe('createGetDocumentFullHandler', () => {
    it('should create a handler bound to QueryEngine', () => {
      const mockDocumentFull: DocumentFull = {
        path: 'test.md',
        content: '# Test Document\n\nContent here.',
        metadata: {
          purpose: 'Test',
          layer: 2,
          relevantTasks: [],
          lastReviewed: '2025-12-15',
          organization: 'test',
          scope: 'test'
        },
        tokenCount: 1000
      };

      const mockQueryEngine = createMockQueryEngine(mockDocumentFull);
      const handler = createGetDocumentFullHandler(mockQueryEngine);

      expect(typeof handler).toBe('function');

      const result = handler({ path: 'test.md' });
      expect(isGetDocumentFullError(result)).toBe(false);
      if (!isGetDocumentFullError(result)) {
        expect(result.documentFull).toEqual(mockDocumentFull);
      }
    });
  });

  describe('formatMcpResponse', () => {
    it('should format success result for MCP protocol', () => {
      const result: GetDocumentFullResult = {
        documentFull: {
          path: 'test.md',
          content: '# Test\n\nContent.',
          metadata: {
            purpose: 'Test',
            layer: 2,
            relevantTasks: [],
            lastReviewed: '2025-12-15',
            organization: 'test',
            scope: 'test'
          },
          tokenCount: 1000
        },
        metrics: {
          responseTimeMs: 10,
          tokenCount: 1000
        }
      };

      const mcpResponse = formatMcpResponse(result);

      expect(mcpResponse.content).toHaveLength(1);
      expect(mcpResponse.content[0].type).toBe('text');
      expect(mcpResponse.isError).toBeUndefined();

      // Verify the JSON is valid and contains expected data
      const parsed = JSON.parse(mcpResponse.content[0].text);
      expect(parsed.documentFull).toBeDefined();
      expect(parsed.metrics).toBeDefined();
    });

    it('should format error result for MCP protocol', () => {
      const result: GetDocumentFullError = {
        error: {
          error: 'FileNotFound',
          message: 'Document not found: nonexistent.md',
          filePath: 'nonexistent.md'
        }
      };

      const mcpResponse = formatMcpResponse(result);

      expect(mcpResponse.content).toHaveLength(1);
      expect(mcpResponse.content[0].type).toBe('text');
      expect(mcpResponse.isError).toBe(true);

      // Verify the JSON is valid and contains error data
      const parsed = JSON.parse(mcpResponse.content[0].text);
      expect(parsed.error).toBe('FileNotFound');
      expect(parsed.message).toContain('nonexistent.md');
    });
  });

  describe('isGetDocumentFullError', () => {
    it('should return true for error results', () => {
      const errorResult: GetDocumentFullError = {
        error: {
          error: 'FileNotFound',
          message: 'Not found',
          filePath: 'test.md'
        }
      };
      expect(isGetDocumentFullError(errorResult)).toBe(true);
    });

    it('should return false for success results', () => {
      const successResult: GetDocumentFullResult = {
        documentFull: {
          path: 'test.md',
          content: '# Test',
          metadata: {
            purpose: 'Test',
            layer: 2,
            relevantTasks: [],
            lastReviewed: '2025-12-15',
            organization: 'test',
            scope: 'test'
          },
          tokenCount: 1000
        },
        metrics: {
          responseTimeMs: 10,
          tokenCount: 1000
        }
      };
      expect(isGetDocumentFullError(successResult)).toBe(false);
    });
  });
});
