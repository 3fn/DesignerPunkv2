/**
 * Tests for list_cross_references MCP Tool
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import {
  listCrossReferencesTool,
  handleListCrossReferences,
  createListCrossReferencesHandler,
  formatMcpResponse,
  isListCrossReferencesError,
  ListCrossReferencesResult,
  ListCrossReferencesError
} from '../list-cross-references';
import { QueryEngine, QueryResult } from '../../query/QueryEngine';
import { CrossReference } from '../../models';

// Mock QueryEngine
const createMockQueryEngine = (mockData: CrossReference[]): QueryEngine => {
  return {
    listCrossReferences: jest.fn().mockReturnValue({
      data: mockData,
      metrics: {
        operation: 'list_cross_references',
        responseTimeMs: 15,
        referenceCount: mockData.length
      }
    } as QueryResult<CrossReference[]>)
  } as unknown as QueryEngine;
};

// Mock QueryEngine that throws FileNotFound error
const createMockQueryEngineWithError = (errorType: string, message: string): QueryEngine => {
  const error = new Error(message);
  (error as any).errorType = errorType;
  return {
    listCrossReferences: jest.fn().mockImplementation(() => {
      throw error;
    })
  } as unknown as QueryEngine;
};

describe('list_cross_references tool', () => {
  describe('tool definition', () => {
    it('should have correct name', () => {
      expect(listCrossReferencesTool.name).toBe('list_cross_references');
    });

    it('should have a description', () => {
      expect(listCrossReferencesTool.description).toBeTruthy();
      expect(typeof listCrossReferencesTool.description).toBe('string');
    });

    it('should require path parameter', () => {
      expect(listCrossReferencesTool.inputSchema.type).toBe('object');
      expect(listCrossReferencesTool.inputSchema.properties.path).toBeDefined();
      expect(listCrossReferencesTool.inputSchema.properties.path.type).toBe('string');
      expect(listCrossReferencesTool.inputSchema.required).toContain('path');
    });
  });

  describe('handleListCrossReferences', () => {
    const mockCrossReferences: CrossReference[] = [
      {
        target: 'docs/token-system-overview.md',
        context: 'For detailed token guidance',
        section: 'Token Selection Decision Framework',
        lineNumber: 42
      },
      {
        target: 'preserved-knowledge/true-native-architecture-concepts.md',
        context: 'True Native Architecture',
        section: 'AI Agent Reading Priorities',
        lineNumber: 15
      },
      {
        target: '.kiro/specs/responsive-layout-system/component-sizing-token-guide.md',
        context: 'component sizing guide',
        section: 'Step 3: Create Component-Level Tokens for Variants',
        lineNumber: 78
      }
    ];

    it('should return cross-references from QueryEngine (Req 5.1)', () => {
      const mockQueryEngine = createMockQueryEngine(mockCrossReferences);
      const result = handleListCrossReferences(mockQueryEngine, '.kiro/steering/Component Development Guide.md');

      expect(isListCrossReferencesError(result)).toBe(false);
      if (!isListCrossReferencesError(result)) {
        expect(result.crossReferences).toEqual(mockCrossReferences);
        expect(mockQueryEngine.listCrossReferences).toHaveBeenCalledWith('.kiro/steering/Component Development Guide.md');
      }
    });

    it('should include target path, context, and source section for each reference (Req 5.2)', () => {
      const mockQueryEngine = createMockQueryEngine(mockCrossReferences);
      const result = handleListCrossReferences(mockQueryEngine, '.kiro/steering/Component Development Guide.md');

      expect(isListCrossReferencesError(result)).toBe(false);
      if (!isListCrossReferencesError(result)) {
        result.crossReferences.forEach(ref => {
          expect(ref.target).toBeDefined();
          expect(typeof ref.target).toBe('string');
          expect(ref.context).toBeDefined();
          expect(typeof ref.context).toBe('string');
          expect(ref.section).toBeDefined();
          expect(typeof ref.section).toBe('string');
          expect(ref.lineNumber).toBeDefined();
          expect(typeof ref.lineNumber).toBe('number');
        });
      }
    });

    it('should include performance metrics (Req 5.4)', () => {
      const mockQueryEngine = createMockQueryEngine(mockCrossReferences);
      const result = handleListCrossReferences(mockQueryEngine, '.kiro/steering/Component Development Guide.md');

      expect(isListCrossReferencesError(result)).toBe(false);
      if (!isListCrossReferencesError(result)) {
        expect(result.metrics).toBeDefined();
        expect(result.metrics.responseTimeMs).toBe(15);
        expect(result.metrics.referenceCount).toBe(3);
      }
    });

    it('should return empty array when document has no cross-references (Req 5.5)', () => {
      const mockQueryEngine = createMockQueryEngine([]);
      const result = handleListCrossReferences(mockQueryEngine, 'empty-doc.md');

      expect(isListCrossReferencesError(result)).toBe(false);
      if (!isListCrossReferencesError(result)) {
        expect(result.crossReferences).toEqual([]);
        expect(result.metrics.referenceCount).toBe(0);
      }
    });

    it('should handle FileNotFound errors', () => {
      const mockQueryEngine = createMockQueryEngineWithError('FileNotFound', 'Document not found');
      const result = handleListCrossReferences(mockQueryEngine, 'nonexistent.md');

      expect(isListCrossReferencesError(result)).toBe(true);
      if (isListCrossReferencesError(result)) {
        expect(result.error.error).toBe('FileNotFound');
        expect(result.error.filePath).toBe('nonexistent.md');
      }
    });

    it('should handle InvalidParameter errors', () => {
      const mockQueryEngine = createMockQueryEngineWithError('InvalidParameter', 'Path parameter is required');
      const result = handleListCrossReferences(mockQueryEngine, '');

      expect(isListCrossReferencesError(result)).toBe(true);
      if (isListCrossReferencesError(result)) {
        expect(result.error.error).toBe('InvalidParameter');
      }
    });
  });

  describe('createListCrossReferencesHandler', () => {
    it('should create a handler bound to QueryEngine', () => {
      const mockCrossReferences: CrossReference[] = [
        {
          target: 'test-target.md',
          context: 'Test context',
          section: 'Test Section',
          lineNumber: 10
        }
      ];

      const mockQueryEngine = createMockQueryEngine(mockCrossReferences);
      const handler = createListCrossReferencesHandler(mockQueryEngine);

      expect(typeof handler).toBe('function');

      const result = handler({ path: 'test.md' });
      expect(isListCrossReferencesError(result)).toBe(false);
      if (!isListCrossReferencesError(result)) {
        expect(result.crossReferences).toEqual(mockCrossReferences);
      }
    });
  });

  describe('formatMcpResponse', () => {
    it('should format success result for MCP protocol', () => {
      const result: ListCrossReferencesResult = {
        crossReferences: [
          {
            target: 'docs/token-system-overview.md',
            context: 'For detailed token guidance',
            section: 'Token Selection',
            lineNumber: 42
          }
        ],
        metrics: {
          responseTimeMs: 10,
          referenceCount: 1
        }
      };

      const mcpResponse = formatMcpResponse(result);

      expect(mcpResponse.content).toHaveLength(1);
      expect(mcpResponse.content[0].type).toBe('text');
      expect(mcpResponse.isError).toBeUndefined();

      // Verify the JSON is valid and contains expected data
      const parsed = JSON.parse(mcpResponse.content[0].text);
      expect(parsed.crossReferences).toBeDefined();
      expect(parsed.crossReferences).toHaveLength(1);
      expect(parsed.metrics).toBeDefined();
    });

    it('should format empty cross-references result for MCP protocol', () => {
      const result: ListCrossReferencesResult = {
        crossReferences: [],
        metrics: {
          responseTimeMs: 5,
          referenceCount: 0
        }
      };

      const mcpResponse = formatMcpResponse(result);

      expect(mcpResponse.content).toHaveLength(1);
      expect(mcpResponse.content[0].type).toBe('text');
      expect(mcpResponse.isError).toBeUndefined();

      const parsed = JSON.parse(mcpResponse.content[0].text);
      expect(parsed.crossReferences).toEqual([]);
      expect(parsed.metrics.referenceCount).toBe(0);
    });

    it('should format error result for MCP protocol', () => {
      const result: ListCrossReferencesError = {
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

  describe('isListCrossReferencesError', () => {
    it('should return true for error results', () => {
      const errorResult: ListCrossReferencesError = {
        error: {
          error: 'FileNotFound',
          message: 'Not found',
          filePath: 'test.md'
        }
      };
      expect(isListCrossReferencesError(errorResult)).toBe(true);
    });

    it('should return false for success results', () => {
      const successResult: ListCrossReferencesResult = {
        crossReferences: [],
        metrics: {
          responseTimeMs: 10,
          referenceCount: 0
        }
      };
      expect(isListCrossReferencesError(successResult)).toBe(false);
    });
  });
});
