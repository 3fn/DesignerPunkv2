/**
 * Tests for get_section MCP Tool
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */

import {
  getSectionTool,
  handleGetSection,
  createGetSectionHandler,
  formatMcpResponse,
  isGetSectionError,
  GetSectionResult,
  GetSectionError
} from '../get-section';
import { QueryEngine, QueryResult } from '../../query/QueryEngine';
import { Section } from '../../models';
import { ErrorHandler } from '../../utils/error-handler';

// Mock QueryEngine
const createMockQueryEngine = () => {
  return {
    getSection: jest.fn(),
    getDocumentationMap: jest.fn(),
    getDocumentSummary: jest.fn(),
    getDocumentFull: jest.fn(),
    listCrossReferences: jest.fn(),
    validateMetadata: jest.fn(),
    getIndexHealth: jest.fn(),
    rebuildIndex: jest.fn()
  } as unknown as QueryEngine;
};

describe('get_section tool', () => {
  describe('getSectionTool definition', () => {
    it('should have correct name', () => {
      expect(getSectionTool.name).toBe('get_section');
    });

    it('should have description', () => {
      expect(getSectionTool.description).toBeDefined();
      expect(getSectionTool.description.length).toBeGreaterThan(0);
    });

    it('should have correct input schema', () => {
      expect(getSectionTool.inputSchema.type).toBe('object');
      expect(getSectionTool.inputSchema.properties.path).toBeDefined();
      expect(getSectionTool.inputSchema.properties.heading).toBeDefined();
      expect(getSectionTool.inputSchema.required).toContain('path');
      expect(getSectionTool.inputSchema.required).toContain('heading');
    });
  });

  describe('handleGetSection', () => {
    it('should return section data on success', () => {
      const mockQueryEngine = createMockQueryEngine();
      const mockSection: Section = {
        path: '.kiro/steering/Component Development Guide.md',
        heading: 'Token Selection Decision Framework',
        content: '## Token Selection Decision Framework\n\nContent here...',
        parentHeadings: ['AI Agent Reading Priorities'],
        tokenCount: 150
      };
      const mockResult: QueryResult<Section> = {
        data: mockSection,
        metrics: {
          operation: 'get_section',
          responseTimeMs: 25
        }
      };
      (mockQueryEngine.getSection as jest.Mock).mockReturnValue(mockResult);

      const result = handleGetSection(
        mockQueryEngine,
        '.kiro/steering/Component Development Guide.md',
        'Token Selection Decision Framework'
      );

      expect(isGetSectionError(result)).toBe(false);
      const successResult = result as GetSectionResult;
      expect(successResult.section).toEqual(mockSection);
      expect(successResult.metrics.responseTimeMs).toBe(25);
      expect(successResult.metrics.tokenCount).toBe(150);
    });

    it('should include parent headings in result (Req 4.2)', () => {
      const mockQueryEngine = createMockQueryEngine();
      const mockSection: Section = {
        path: '.kiro/steering/Component Development Guide.md',
        heading: 'Step 1: Check Semantic Tokens First',
        content: '### Step 1: Check Semantic Tokens First\n\nContent...',
        parentHeadings: ['Token Selection Decision Framework'],
        tokenCount: 100
      };
      const mockResult: QueryResult<Section> = {
        data: mockSection,
        metrics: {
          operation: 'get_section',
          responseTimeMs: 20
        }
      };
      (mockQueryEngine.getSection as jest.Mock).mockReturnValue(mockResult);

      const result = handleGetSection(
        mockQueryEngine,
        '.kiro/steering/Component Development Guide.md',
        'Step 1: Check Semantic Tokens First'
      );

      expect(isGetSectionError(result)).toBe(false);
      const successResult = result as GetSectionResult;
      expect(successResult.section.parentHeadings).toEqual(['Token Selection Decision Framework']);
    });

    it('should include token count in result (Req 4.3)', () => {
      const mockQueryEngine = createMockQueryEngine();
      const mockSection: Section = {
        path: '.kiro/steering/test.md',
        heading: 'Test Section',
        content: '## Test Section\n\nSome content here.',
        parentHeadings: [],
        tokenCount: 75
      };
      const mockResult: QueryResult<Section> = {
        data: mockSection,
        metrics: {
          operation: 'get_section',
          responseTimeMs: 15
        }
      };
      (mockQueryEngine.getSection as jest.Mock).mockReturnValue(mockResult);

      const result = handleGetSection(mockQueryEngine, '.kiro/steering/test.md', 'Test Section');

      expect(isGetSectionError(result)).toBe(false);
      const successResult = result as GetSectionResult;
      expect(successResult.section.tokenCount).toBe(75);
      expect(successResult.metrics.tokenCount).toBe(75);
    });

    it('should handle SectionNotFound error with suggestions (Req 4.6)', () => {
      const mockQueryEngine = createMockQueryEngine();
      const error = new Error('Section "Nonexistent Section" not found');
      (error as any).errorType = 'SectionNotFound';
      (error as any).availableHeadings = ['Overview', 'Token Selection', 'Component Patterns'];
      (mockQueryEngine.getSection as jest.Mock).mockImplementation(() => {
        throw error;
      });

      const result = handleGetSection(
        mockQueryEngine,
        '.kiro/steering/Component Development Guide.md',
        'Nonexistent Section'
      );

      expect(isGetSectionError(result)).toBe(true);
      const errorResult = result as GetSectionError;
      expect(errorResult.error.error).toBe('SectionNotFound');
      expect(errorResult.error.suggestions).toContain('Overview');
      expect(errorResult.error.suggestions).toContain('Token Selection');
    });

    it('should handle FileNotFound error', () => {
      const mockQueryEngine = createMockQueryEngine();
      const error = new Error('Document not found');
      (error as any).errorType = 'FileNotFound';
      (error as any).suggestions = ['Did you mean: Component Development Guide.md?'];
      (mockQueryEngine.getSection as jest.Mock).mockImplementation(() => {
        throw error;
      });

      const result = handleGetSection(
        mockQueryEngine,
        '.kiro/steering/nonexistent.md',
        'Some Section'
      );

      expect(isGetSectionError(result)).toBe(true);
      const errorResult = result as GetSectionError;
      expect(errorResult.error.error).toBe('FileNotFound');
    });

    it('should handle InvalidParameter error', () => {
      const mockQueryEngine = createMockQueryEngine();
      const error = new Error('Heading parameter cannot be empty');
      (error as any).errorType = 'InvalidParameter';
      (error as any).suggestions = ['Provide a section heading like "Token Selection Decision Framework"'];
      (mockQueryEngine.getSection as jest.Mock).mockImplementation(() => {
        throw error;
      });

      const result = handleGetSection(
        mockQueryEngine,
        '.kiro/steering/test.md',
        ''
      );

      expect(isGetSectionError(result)).toBe(true);
      const errorResult = result as GetSectionError;
      // InvalidParameter is converted to SectionNotFound since MCPErrorType doesn't include InvalidParameter
      expect(errorResult.error.error).toBe('SectionNotFound');
      // But the original message is preserved
      expect(errorResult.error.message).toContain('empty');
    });

    it('should re-throw unexpected errors', () => {
      const mockQueryEngine = createMockQueryEngine();
      const unexpectedError = new Error('Unexpected database error');
      (mockQueryEngine.getSection as jest.Mock).mockImplementation(() => {
        throw unexpectedError;
      });

      expect(() => {
        handleGetSection(mockQueryEngine, '.kiro/steering/test.md', 'Test');
      }).toThrow('Unexpected database error');
    });
  });

  describe('createGetSectionHandler', () => {
    it('should create a handler bound to QueryEngine', () => {
      const mockQueryEngine = createMockQueryEngine();
      const mockSection: Section = {
        path: '.kiro/steering/test.md',
        heading: 'Test',
        content: '## Test\n\nContent',
        parentHeadings: [],
        tokenCount: 50
      };
      const mockResult: QueryResult<Section> = {
        data: mockSection,
        metrics: {
          operation: 'get_section',
          responseTimeMs: 10
        }
      };
      (mockQueryEngine.getSection as jest.Mock).mockReturnValue(mockResult);

      const handler = createGetSectionHandler(mockQueryEngine);
      const result = handler({ path: '.kiro/steering/test.md', heading: 'Test' });

      expect(isGetSectionError(result)).toBe(false);
      expect((result as GetSectionResult).section).toEqual(mockSection);
    });

    it('should accept optional error handler', () => {
      const mockQueryEngine = createMockQueryEngine();
      const mockErrorHandler = new ErrorHandler('test-logs');
      const mockSection: Section = {
        path: '.kiro/steering/test.md',
        heading: 'Test',
        content: '## Test\n\nContent',
        parentHeadings: [],
        tokenCount: 50
      };
      const mockResult: QueryResult<Section> = {
        data: mockSection,
        metrics: {
          operation: 'get_section',
          responseTimeMs: 10
        }
      };
      (mockQueryEngine.getSection as jest.Mock).mockReturnValue(mockResult);

      const handler = createGetSectionHandler(mockQueryEngine, mockErrorHandler);
      const result = handler({ path: '.kiro/steering/test.md', heading: 'Test' });

      expect(isGetSectionError(result)).toBe(false);
    });
  });

  describe('formatMcpResponse', () => {
    it('should format success result for MCP protocol', () => {
      const successResult: GetSectionResult = {
        section: {
          path: '.kiro/steering/test.md',
          heading: 'Test Section',
          content: '## Test Section\n\nContent here.',
          parentHeadings: ['Parent'],
          tokenCount: 100
        },
        metrics: {
          responseTimeMs: 20,
          tokenCount: 100
        }
      };

      const response = formatMcpResponse(successResult);

      expect(response.isError).toBeUndefined();
      expect(response.content).toHaveLength(1);
      expect(response.content[0].type).toBe('text');
      
      const parsed = JSON.parse(response.content[0].text);
      expect(parsed.section.heading).toBe('Test Section');
      expect(parsed.section.parentHeadings).toEqual(['Parent']);
      expect(parsed.metrics.tokenCount).toBe(100);
    });

    it('should format error result for MCP protocol', () => {
      const errorResult: GetSectionError = {
        error: {
          error: 'SectionNotFound',
          message: 'Section "Missing" not found in test.md',
          suggestions: ['Overview', 'Getting Started']
        }
      };

      const response = formatMcpResponse(errorResult);

      expect(response.isError).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0].type).toBe('text');
      
      const parsed = JSON.parse(response.content[0].text);
      expect(parsed.error).toBe('SectionNotFound');
      expect(parsed.suggestions).toContain('Overview');
    });
  });

  describe('isGetSectionError', () => {
    it('should return true for error results', () => {
      const errorResult: GetSectionError = {
        error: {
          error: 'SectionNotFound',
          message: 'Section not found'
        }
      };

      expect(isGetSectionError(errorResult)).toBe(true);
    });

    it('should return false for success results', () => {
      const successResult: GetSectionResult = {
        section: {
          path: '.kiro/steering/test.md',
          heading: 'Test',
          content: '## Test\n\nContent',
          parentHeadings: [],
          tokenCount: 50
        },
        metrics: {
          responseTimeMs: 10,
          tokenCount: 50
        }
      };

      expect(isGetSectionError(successResult)).toBe(false);
    });
  });
});
