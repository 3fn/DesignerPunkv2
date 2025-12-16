/**
 * Tests for get_documentation_map MCP Tool
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

import {
  getDocumentationMapTool,
  handleGetDocumentationMap,
  createGetDocumentationMapHandler,
  formatMcpResponse,
  GetDocumentationMapResult
} from '../get-documentation-map';
import { QueryEngine, QueryResult } from '../../query/QueryEngine';
import { DocumentationMap } from '../../models';

// Mock QueryEngine
const createMockQueryEngine = (mockData: DocumentationMap): QueryEngine => {
  return {
    getDocumentationMap: jest.fn().mockReturnValue({
      data: mockData,
      metrics: {
        operation: 'get_documentation_map',
        responseTimeMs: 15
      }
    } as QueryResult<DocumentationMap>)
  } as unknown as QueryEngine;
};

describe('get_documentation_map tool', () => {
  describe('tool definition', () => {
    it('should have correct name', () => {
      expect(getDocumentationMapTool.name).toBe('get_documentation_map');
    });

    it('should have a description', () => {
      expect(getDocumentationMapTool.description).toBeTruthy();
      expect(typeof getDocumentationMapTool.description).toBe('string');
    });

    it('should have empty input schema (no parameters required)', () => {
      expect(getDocumentationMapTool.inputSchema.type).toBe('object');
      expect(getDocumentationMapTool.inputSchema.properties).toEqual({});
      expect(getDocumentationMapTool.inputSchema.required).toEqual([]);
    });
  });

  describe('handleGetDocumentationMap', () => {
    it('should return documentation map from QueryEngine', () => {
      const mockData: DocumentationMap = {
        layers: {
          '0': {
            name: 'Meta-Guide',
            documents: [
              {
                path: '.kiro/steering/00-Steering.md',
                purpose: 'Meta-guide',
                layer: 0,
                relevantTasks: ['all-tasks'],
                lastReviewed: '2025-12-15',
                sections: ['Overview'],
                tokenCount: 500
              }
            ]
          },
          '2': {
            name: 'Frameworks and Patterns',
            documents: [
              {
                path: '.kiro/steering/Spec Planning Standards.md',
                purpose: 'Spec planning',
                layer: 2,
                relevantTasks: ['spec-creation'],
                lastReviewed: '2025-12-15',
                sections: ['Overview', 'Requirements'],
                tokenCount: 15000
              }
            ]
          }
        }
      };

      const mockQueryEngine = createMockQueryEngine(mockData);
      const result = handleGetDocumentationMap(mockQueryEngine);

      expect(result.documentationMap).toEqual(mockData);
      expect(mockQueryEngine.getDocumentationMap).toHaveBeenCalled();
    });

    it('should include performance metrics', () => {
      const mockData: DocumentationMap = {
        layers: {
          '2': {
            name: 'Frameworks and Patterns',
            documents: [
              {
                path: '.kiro/steering/Test.md',
                purpose: 'Test',
                layer: 2,
                relevantTasks: [],
                lastReviewed: '2025-12-15',
                sections: [],
                tokenCount: 1000
              }
            ]
          }
        }
      };

      const mockQueryEngine = createMockQueryEngine(mockData);
      const result = handleGetDocumentationMap(mockQueryEngine);

      expect(result.metrics).toBeDefined();
      expect(result.metrics.responseTimeMs).toBe(15);
      expect(result.metrics.documentCount).toBe(1);
    });

    it('should count documents across all layers', () => {
      const mockData: DocumentationMap = {
        layers: {
          '0': {
            name: 'Meta-Guide',
            documents: [
              { path: 'doc1.md', purpose: '', layer: 0, relevantTasks: [], lastReviewed: '', sections: [], tokenCount: 100 }
            ]
          },
          '1': {
            name: 'Foundation',
            documents: [
              { path: 'doc2.md', purpose: '', layer: 1, relevantTasks: [], lastReviewed: '', sections: [], tokenCount: 100 },
              { path: 'doc3.md', purpose: '', layer: 1, relevantTasks: [], lastReviewed: '', sections: [], tokenCount: 100 }
            ]
          },
          '2': {
            name: 'Frameworks and Patterns',
            documents: [
              { path: 'doc4.md', purpose: '', layer: 2, relevantTasks: [], lastReviewed: '', sections: [], tokenCount: 100 }
            ]
          }
        }
      };

      const mockQueryEngine = createMockQueryEngine(mockData);
      const result = handleGetDocumentationMap(mockQueryEngine);

      expect(result.metrics.documentCount).toBe(4);
    });
  });

  describe('createGetDocumentationMapHandler', () => {
    it('should create a handler bound to QueryEngine', () => {
      const mockData: DocumentationMap = {
        layers: {
          '2': {
            name: 'Frameworks and Patterns',
            documents: []
          }
        }
      };

      const mockQueryEngine = createMockQueryEngine(mockData);
      const handler = createGetDocumentationMapHandler(mockQueryEngine);

      expect(typeof handler).toBe('function');

      const result = handler();
      expect(result.documentationMap).toEqual(mockData);
    });
  });

  describe('formatMcpResponse', () => {
    it('should format result for MCP protocol', () => {
      const result: GetDocumentationMapResult = {
        documentationMap: {
          layers: {
            '2': {
              name: 'Frameworks and Patterns',
              documents: []
            }
          }
        },
        metrics: {
          responseTimeMs: 10,
          documentCount: 0
        }
      };

      const mcpResponse = formatMcpResponse(result);

      expect(mcpResponse.content).toHaveLength(1);
      expect(mcpResponse.content[0].type).toBe('text');
      expect(typeof mcpResponse.content[0].text).toBe('string');

      // Verify the JSON is valid and contains expected data
      const parsed = JSON.parse(mcpResponse.content[0].text);
      expect(parsed.documentationMap).toBeDefined();
      expect(parsed.metrics).toBeDefined();
    });
  });
});
