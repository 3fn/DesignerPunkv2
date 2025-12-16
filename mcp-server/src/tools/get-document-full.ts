/**
 * get_document_full MCP Tool
 * 
 * Returns complete document content with metadata and token count.
 * Use this when summaries are insufficient and full content is needed.
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

import { QueryEngine, QueryResult } from '../query/QueryEngine';
import { DocumentFull } from '../models';
import { ErrorHandler, MCPError } from '../utils/error-handler';

/**
 * Tool definition for MCP SDK registration
 */
export const getDocumentFullTool = {
  name: 'get_document_full',
  description: 'Get complete document content with metadata. Use when summaries are insufficient and full content is needed.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      path: {
        type: 'string',
        description: 'Document path (e.g., ".kiro/steering/Component Development Guide.md")'
      }
    },
    required: ['path'] as string[]
  }
};

/**
 * Tool handler result type
 */
export interface GetDocumentFullResult {
  /** The full document data */
  documentFull: DocumentFull;
  /** Performance metrics */
  metrics: {
    responseTimeMs: number;
    tokenCount: number;
  };
}

/**
 * Error result type for FileNotFound errors
 */
export interface GetDocumentFullError {
  error: MCPError;
}

/**
 * Handler function for get_document_full tool
 * 
 * @param queryEngine - QueryEngine instance for data access
 * @param path - Document path to get full content for
 * @param errorHandler - Optional error handler for logging
 * @returns Full document with metrics or error
 * 
 * Requirements:
 * - 3.1: Return complete markdown content
 * - 3.2: Include metadata and token count
 * - 3.3: Log performance metrics (response time, file read time, token count)
 * - 3.4: Preserve all markdown formatting and structure
 * - 3.5: Return error with clear message for non-existent files
 */
export function handleGetDocumentFull(
  queryEngine: QueryEngine,
  path: string,
  errorHandler?: ErrorHandler
): GetDocumentFullResult | GetDocumentFullError {
  try {
    const result: QueryResult<DocumentFull> = queryEngine.getDocumentFull(path);

    return {
      documentFull: result.data,
      metrics: {
        responseTimeMs: result.metrics.responseTimeMs,
        tokenCount: result.data.tokenCount
      }
    };
  } catch (error) {
    // Handle FileNotFound errors
    if (error instanceof Error) {
      const errorType = (error as any).errorType;
      
      if (errorType === 'FileNotFound' || error.message.includes('not found')) {
        const handler = errorHandler || new ErrorHandler();
        const mcpError = handler.handleFileNotFound(path, (error as any).suggestions || []);
        return { error: mcpError };
      }
      
      if (errorType === 'InvalidParameter') {
        const handler = errorHandler || new ErrorHandler();
        const mcpError = handler.formatFileNotFound(path, (error as any).suggestions || []);
        mcpError.message = error.message;
        mcpError.error = 'FileNotFound';
        return { error: mcpError };
      }
    }
    
    // Re-throw unexpected errors
    throw error;
  }
}

/**
 * Type guard to check if result is an error
 */
export function isGetDocumentFullError(
  result: GetDocumentFullResult | GetDocumentFullError
): result is GetDocumentFullError {
  return 'error' in result;
}

/**
 * Create a tool handler bound to a specific QueryEngine instance
 * 
 * This factory function creates a handler that can be registered with the MCP SDK.
 * The handler captures the QueryEngine instance in its closure.
 * 
 * @param queryEngine - QueryEngine instance for data access
 * @param errorHandler - Optional error handler for logging
 * @returns Handler function for MCP SDK registration
 */
export function createGetDocumentFullHandler(
  queryEngine: QueryEngine,
  errorHandler?: ErrorHandler
): (args: { path: string }) => GetDocumentFullResult | GetDocumentFullError {
  return (args: { path: string }) => handleGetDocumentFull(queryEngine, args.path, errorHandler);
}

/**
 * Format the result for MCP protocol response
 * 
 * Converts the internal result format to the MCP protocol response format.
 * 
 * @param result - Internal result from handler
 * @returns MCP protocol formatted response
 */
export function formatMcpResponse(result: GetDocumentFullResult | GetDocumentFullError): {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
} {
  if (isGetDocumentFullError(result)) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result.error, null, 2)
        }
      ],
      isError: true
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }
    ]
  };
}
