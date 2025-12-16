/**
 * Tests for get_document_summary MCP Tool
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7
 */

import {
  getDocumentSummaryTool,
  handleGetDocumentSummary,
  createGetDocumentSummaryHandler,
  formatMcpResponse,
  isGetDocumentSummaryError,
  GetDocumentSummaryResult,
  GetDocumentSummaryError
} from '../get-document-summary';
import { QueryEngine, QueryResult } from '../../query/QueryEngine';
import { DocumentSummary } from '../../models';

// Mock QueryEngine
const createMockQueryEngine = (mockData: DocumentSummary): QueryEngine => {
  return {
    getDocumentSummary: jest.fn().mockReturnValue({
      data: mockData,
      metrics: {
        operation: 'get_document_summary',
        responseTimeMs: 25,
        tokenCounts: {
          summary: 150,
          fullDocument: mockData.tokenCount
        }
      }
    } as QueryResult<DocumentSummary>)
  } as unknown as QueryEngine;
};

// Mock QueryEngine that throws FileNotFound error
const createMockQueryEngineWithError = (errorType: string, message: string): QueryEngine => {
  const error = new Error(message);
  (error as any).errorType = errorType;
  return {
    getDocumentSummary: jest.fn().mockImplementation(() => {
      throw error;
    })
  } as unknown as QueryEngine;
};

describe('get_document_summary tool', () => {
  describe('tool definition', () => {
    it('should have correct name', () => {
      expect(getDocumentSummaryTool.name).toBe('get_document_summary');
    });

    it('should have a description', () => {
      expect(getDocumentSummaryTool.description).toBeTruthy();
      expect(typeof getDocumentSummaryTool.description).toBe('string');
    });

    it('should require path parameter', () => {
      expect(getDocumentSummaryTool.inputSchema.type).toBe('object');
      expect(getDocumentSummaryTool.inputSchema.properties.path).toBeDefined();
      expect(getDocumentSummaryTool.inputSchema.properties.path.type).toBe('string');
      expect(getDocumentSummaryTool.inputSchema.required).toContain('path');
    });
  });

  describe('handleGetDocumentSummary', () => {
    const mockSummary: DocumentSummary = {
      path: '.kiro/steering/Component Development Guide.md',
      metadata: {
        purpose: 'Guide AI agents in building components',
        layer: 3,
        relevantTasks: ['component-development', 'token-selection'],
        lastReviewed: '2025-12-15',
        organization: 'process-standard',
        scope: 'cross-project'
      },
      outline: [
        {
          heading: 'Token Selection Decision Framework',
          level: 2,
          subsections: ['Step 1: Check Semantic Tokens First', 'Step 2: Use Primitives Only When Unavoidable']
        },
        {
          heading: 'Common Component Patterns',
          level: 2,
          subsections: ['Button Components', 'Input Components']
        }
      ],
      crossReferences: [
        {
          target: 'docs/token-system-overview.md',
          context: 'For detailed token guidance',
          section: 'Token Selection Decision Framework'
        }
      ],
      tokenCount: 15000
    };

    it('should return document summary from QueryEngine', () => {
      const mockQueryEngine = createMockQueryEngine(mockSummary);
      const result = handleGetDocumentSummary(mockQueryEngine, '.kiro/steering/Component Development Guide.md');

      expect(isGetDocumentSummaryError(result)).toBe(false);
      if (!isGetDocumentSummaryError(result)) {
        expect(result.documentSummary).toEqual(mockSummary);
        expect(mockQueryEngine.getDocumentSummary).toHaveBeenCalledWith('.kiro/steering/Component Development Guide.md');
      }
    });

    it('should include performance metrics', () => {
      const mockQueryEngine = createMockQueryEngine(mockSummary);
      const result = handleGetDocumentSummary(mockQueryEngine, '.kiro/steering/Component Development Guide.md');

      expect(isGetDocumentSummaryError(result)).toBe(false);
      if (!isGetDocumentSummaryError(result)) {
        expect(result.metrics).toBeDefined();
        expect(result.metrics.responseTimeMs).toBe(25);
        expect(result.metrics.summaryTokens).toBe(150);
        expect(result.metrics.fullDocumentTokens).toBe(15000);
        expect(result.metrics.compressionRatio).toBe(99); // (1 - 150/15000) * 100 = 99
      }
    });

    it('should handle FileNotFound errors', () => {
      const mockQueryEngine = createMockQueryEngineWithError('FileNotFound', 'Document not found');
      const result = handleGetDocumentSummary(mockQueryEngine, 'nonexistent.md');

      expect(isGetDocumentSummaryError(result)).toBe(true);
      if (isGetDocumentSummaryError(result)) {
        expect(result.error.error).toBe('FileNotFound');
        expect(result.error.filePath).toBe('nonexistent.md');
      }
    });

    it('should handle InvalidParameter errors', () => {
      const mockQueryEngine = createMockQueryEngineWithError('InvalidParameter', 'Path parameter is required');
      const result = handleGetDocumentSummary(mockQueryEngine, '');

      expect(isGetDocumentSummaryError(result)).toBe(true);
      if (isGetDocumentSummaryError(result)) {
        expect(result.error.error).toBe('FileNotFound');
      }
    });
  });

  describe('createGetDocumentSummaryHandler', () => {
    it('should create a handler bound to QueryEngine', () => {
      const mockSummary: DocumentSummary = {
        path: 'test.md',
        metadata: {
          purpose: 'Test',
          layer: 2,
          relevantTasks: [],
          lastReviewed: '2025-12-15',
          organization: 'test',
          scope: 'test'
        },
        outline: [],
        crossReferences: [],
        tokenCount: 1000
      };

      const mockQueryEngine = createMockQueryEngine(mockSummary);
      const handler = createGetDocumentSummaryHandler(mockQueryEngine);

      expect(typeof handler).toBe('function');

      const result = handler({ path: 'test.md' });
      expect(isGetDocumentSummaryError(result)).toBe(false);
      if (!isGetDocumentSummaryError(result)) {
        expect(result.documentSummary).toEqual(mockSummary);
      }
    });
  });

  describe('formatMcpResponse', () => {
    it('should format success result for MCP protocol', () => {
      const result: GetDocumentSummaryResult = {
        documentSummary: {
          path: 'test.md',
          metadata: {
            purpose: 'Test',
            layer: 2,
            relevantTasks: [],
            lastReviewed: '2025-12-15',
            organization: 'test',
            scope: 'test'
          },
          outline: [],
          crossReferences: [],
          tokenCount: 1000
        },
        metrics: {
          responseTimeMs: 10,
          summaryTokens: 50,
          fullDocumentTokens: 1000,
          compressionRatio: 95
        }
      };

      const mcpResponse = formatMcpResponse(result);

      expect(mcpResponse.content).toHaveLength(1);
      expect(mcpResponse.content[0].type).toBe('text');
      expect(mcpResponse.isError).toBeUndefined();

      // Verify the JSON is valid and contains expected data
      const parsed = JSON.parse(mcpResponse.content[0].text);
      expect(parsed.documentSummary).toBeDefined();
      expect(parsed.metrics).toBeDefined();
    });

    it('should format error result for MCP protocol', () => {
      const result: GetDocumentSummaryError = {
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

  describe('isGetDocumentSummaryError', () => {
    it('should return true for error results', () => {
      const errorResult: GetDocumentSummaryError = {
        error: {
          error: 'FileNotFound',
          message: 'Not found',
          filePath: 'test.md'
        }
      };
      expect(isGetDocumentSummaryError(errorResult)).toBe(true);
    });

    it('should return false for success results', () => {
      const successResult: GetDocumentSummaryResult = {
        documentSummary: {
          path: 'test.md',
          metadata: {
            purpose: 'Test',
            layer: 2,
            relevantTasks: [],
            lastReviewed: '2025-12-15',
            organization: 'test',
            scope: 'test'
          },
          outline: [],
          crossReferences: [],
          tokenCount: 1000
        },
        metrics: {
          responseTimeMs: 10,
          summaryTokens: 50,
          fullDocumentTokens: 1000,
          compressionRatio: 95
        }
      };
      expect(isGetDocumentSummaryError(successResult)).toBe(false);
    });
  });
});
