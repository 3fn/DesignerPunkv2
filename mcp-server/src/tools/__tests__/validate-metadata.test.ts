/**
 * Tests for validate_metadata MCP Tool
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import {
  validateMetadataTool,
  handleValidateMetadata,
  createValidateMetadataHandler,
  formatMcpResponse,
  isValidateMetadataError,
  ValidateMetadataResult,
  ValidateMetadataError
} from '../validate-metadata';
import { QueryEngine, QueryResult } from '../../query/QueryEngine';
import { MetadataValidation } from '../../models';

// Mock QueryEngine
const createMockQueryEngine = (mockData: MetadataValidation): QueryEngine => {
  return {
    validateMetadata: jest.fn().mockReturnValue({
      data: mockData,
      metrics: {
        operation: 'validate_metadata',
        responseTimeMs: 15,
        issueCount: mockData.issues.length,
        valid: mockData.valid
      }
    } as QueryResult<MetadataValidation>)
  } as unknown as QueryEngine;
};

// Mock QueryEngine that throws FileNotFound error
const createMockQueryEngineWithError = (errorType: string, message: string): QueryEngine => {
  const error = new Error(message);
  (error as any).errorType = errorType;
  return {
    validateMetadata: jest.fn().mockImplementation(() => {
      throw error;
    })
  } as unknown as QueryEngine;
};

describe('validate_metadata tool', () => {
  describe('tool definition', () => {
    it('should have correct name', () => {
      expect(validateMetadataTool.name).toBe('validate_metadata');
    });

    it('should have a description', () => {
      expect(validateMetadataTool.description).toBeTruthy();
      expect(typeof validateMetadataTool.description).toBe('string');
    });

    it('should require path parameter', () => {
      expect(validateMetadataTool.inputSchema.type).toBe('object');
      expect(validateMetadataTool.inputSchema.properties.path).toBeDefined();
      expect(validateMetadataTool.inputSchema.properties.path.type).toBe('string');
      expect(validateMetadataTool.inputSchema.required).toContain('path');
    });
  });

  describe('handleValidateMetadata', () => {
    const mockValidMetadata: MetadataValidation = {
      path: '.kiro/steering/Component Development Guide.md',
      valid: true,
      metadata: {
        date: '2025-11-17',
        purpose: 'Guide AI agents in building components',
        organization: 'process-standard',
        scope: 'cross-project',
        layer: '3',
        relevantTasks: 'coding, accessibility-development'
      },
      issues: []
    };

    const mockInvalidMetadata: MetadataValidation = {
      path: '.kiro/steering/incomplete.md',
      valid: false,
      metadata: {
        date: '2025-11-17',
        purpose: 'Incomplete document'
      },
      issues: [
        { field: 'Organization', issue: 'Missing required field', severity: 'error' },
        { field: 'Scope', issue: 'Missing required field', severity: 'error' },
        { field: 'Layer', issue: 'Missing required field', severity: 'error' },
        { field: 'Relevant Tasks', issue: 'Missing required field', severity: 'warning' }
      ]
    };

    it('should return validation result from QueryEngine', () => {
      const mockQueryEngine = createMockQueryEngine(mockValidMetadata);
      const result = handleValidateMetadata(mockQueryEngine, '.kiro/steering/Component Development Guide.md');

      expect(isValidateMetadataError(result)).toBe(false);
      if (!isValidateMetadataError(result)) {
        expect(result.validation).toEqual(mockValidMetadata);
        expect(mockQueryEngine.validateMetadata).toHaveBeenCalledWith('.kiro/steering/Component Development Guide.md');
      }
    });

    it('should include performance metrics', () => {
      const mockQueryEngine = createMockQueryEngine(mockValidMetadata);
      const result = handleValidateMetadata(mockQueryEngine, '.kiro/steering/Component Development Guide.md');

      expect(isValidateMetadataError(result)).toBe(false);
      if (!isValidateMetadataError(result)) {
        expect(result.metrics).toBeDefined();
        expect(result.metrics.responseTimeMs).toBe(15);
        expect(result.metrics.issueCount).toBe(0);
        expect(result.metrics.valid).toBe(true);
      }
    });

    it('should return validation issues for invalid metadata', () => {
      const mockQueryEngine = createMockQueryEngine(mockInvalidMetadata);
      const result = handleValidateMetadata(mockQueryEngine, '.kiro/steering/incomplete.md');

      expect(isValidateMetadataError(result)).toBe(false);
      if (!isValidateMetadataError(result)) {
        expect(result.validation.valid).toBe(false);
        expect(result.validation.issues).toHaveLength(4);
        expect(result.metrics.issueCount).toBe(4);
      }
    });

    it('should handle FileNotFound errors', () => {
      const mockQueryEngine = createMockQueryEngineWithError('FileNotFound', 'Document not found');
      const result = handleValidateMetadata(mockQueryEngine, 'nonexistent.md');

      expect(isValidateMetadataError(result)).toBe(true);
      if (isValidateMetadataError(result)) {
        expect(result.error.error).toBe('FileNotFound');
        expect(result.error.filePath).toBe('nonexistent.md');
      }
    });

    it('should handle InvalidParameter errors', () => {
      const mockQueryEngine = createMockQueryEngineWithError('InvalidParameter', 'Path parameter is required');
      const result = handleValidateMetadata(mockQueryEngine, '');

      expect(isValidateMetadataError(result)).toBe(true);
      if (isValidateMetadataError(result)) {
        expect(result.error.error).toBe('InvalidParameter');
      }
    });
  });

  describe('createValidateMetadataHandler', () => {
    it('should create a handler bound to QueryEngine', () => {
      const mockValidation: MetadataValidation = {
        path: 'test.md',
        valid: true,
        metadata: {
          date: '2025-12-16',
          purpose: 'Test',
          organization: 'test',
          scope: 'test',
          layer: '2',
          relevantTasks: 'testing'
        },
        issues: []
      };

      const mockQueryEngine = createMockQueryEngine(mockValidation);
      const handler = createValidateMetadataHandler(mockQueryEngine);

      expect(typeof handler).toBe('function');

      const result = handler({ path: 'test.md' });
      expect(isValidateMetadataError(result)).toBe(false);
      if (!isValidateMetadataError(result)) {
        expect(result.validation).toEqual(mockValidation);
      }
    });
  });

  describe('formatMcpResponse', () => {
    it('should format success result for MCP protocol', () => {
      const result: ValidateMetadataResult = {
        validation: {
          path: 'test.md',
          valid: true,
          metadata: {
            date: '2025-12-16',
            purpose: 'Test',
            organization: 'test',
            scope: 'test',
            layer: '2',
            relevantTasks: 'testing'
          },
          issues: []
        },
        metrics: {
          responseTimeMs: 10,
          issueCount: 0,
          valid: true
        }
      };

      const mcpResponse = formatMcpResponse(result);

      expect(mcpResponse.content).toHaveLength(1);
      expect(mcpResponse.content[0].type).toBe('text');
      expect(mcpResponse.isError).toBeUndefined();

      // Verify the JSON is valid and contains expected data
      const parsed = JSON.parse(mcpResponse.content[0].text);
      expect(parsed.validation).toBeDefined();
      expect(parsed.metrics).toBeDefined();
    });

    it('should format error result for MCP protocol', () => {
      const result: ValidateMetadataError = {
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

    it('should format validation with issues for MCP protocol', () => {
      const result: ValidateMetadataResult = {
        validation: {
          path: 'incomplete.md',
          valid: false,
          metadata: { date: '2025-12-16' },
          issues: [
            { field: 'Purpose', issue: 'Missing required field', severity: 'error' },
            { field: 'Organization', issue: 'Missing required field', severity: 'error' }
          ]
        },
        metrics: {
          responseTimeMs: 12,
          issueCount: 2,
          valid: false
        }
      };

      const mcpResponse = formatMcpResponse(result);

      expect(mcpResponse.content).toHaveLength(1);
      expect(mcpResponse.content[0].type).toBe('text');
      expect(mcpResponse.isError).toBeUndefined(); // Validation issues are not MCP errors

      const parsed = JSON.parse(mcpResponse.content[0].text);
      expect(parsed.validation.valid).toBe(false);
      expect(parsed.validation.issues).toHaveLength(2);
    });
  });

  describe('isValidateMetadataError', () => {
    it('should return true for error results', () => {
      const errorResult: ValidateMetadataError = {
        error: {
          error: 'FileNotFound',
          message: 'Not found',
          filePath: 'test.md'
        }
      };
      expect(isValidateMetadataError(errorResult)).toBe(true);
    });

    it('should return false for success results', () => {
      const successResult: ValidateMetadataResult = {
        validation: {
          path: 'test.md',
          valid: true,
          metadata: { date: '2025-12-16' },
          issues: []
        },
        metrics: {
          responseTimeMs: 10,
          issueCount: 0,
          valid: true
        }
      };
      expect(isValidateMetadataError(successResult)).toBe(false);
    });
  });
});
