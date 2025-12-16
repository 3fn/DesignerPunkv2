/**
 * list_cross_references MCP Tool
 * 
 * Returns cross-references in a document without following them.
 * Use this to discover related documentation and navigate between documents.
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import { QueryEngine, QueryResult } from '../query/QueryEngine';
import { CrossReference } from '../models';
import { ErrorHandler, MCPError } from '../utils/error-handler';

/**
 * Tool definition for MCP SDK registration
 */
export const listCrossReferencesTool = {
  name: 'list_cross_references',
  description: 'List cross-references in a document. Returns all referenced documents with context, source section, and line number.',
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
export interface ListCrossReferencesResult {
  /** The cross-references array */
  crossReferences: CrossReference[];
  /** Performance metrics */
  metrics: {
    responseTimeMs: number;
    referenceCount: number;
  };
}

/**
 * Error result type for FileNotFound errors
 */
export interface ListCrossReferencesError {
  error: MCPError;
}

/**
 * Handler function for list_cross_references tool
 * 
 * @param queryEngine - QueryEngine instance for data access
 * @param path - Document path
 * @param errorHandler - Optional error handler for logging
 * @returns CrossReference array with metrics or error
 * 
 * Requirements:
 * - 5.1: Return a list of all referenced documents
 * - 5.2: Include target path, context description, and source section for each reference
 * - 5.3: Use mechanical parsing to identify markdown links without following them
 * - 5.4: Log performance metrics (response time, number of references found, parsing time)
 * - 5.5: Return an empty list when document has no cross-references
 */
export function handleListCrossReferences(
  queryEngine: QueryEngine,
  path: string,
  errorHandler?: ErrorHandler
): ListCrossReferencesResult | ListCrossReferencesError {
  try {
    const result: QueryResult<CrossReference[]> = queryEngine.listCrossReferences(path);

    return {
      crossReferences: result.data,
      metrics: {
        responseTimeMs: result.metrics.responseTimeMs,
        referenceCount: result.data.length
      }
    };
  } catch (error) {
    if (error instanceof Error) {
      const errorType = (error as any).errorType;
      const handler = errorHandler || new ErrorHandler();
      
      // Handle FileNotFound errors
      if (errorType === 'FileNotFound' || error.message.includes('not found')) {
        const mcpError = handler.handleFileNotFound(path, (error as any).suggestions || []);
        return { error: mcpError };
      }
      
      // Handle InvalidParameter errors
      if (errorType === 'InvalidParameter') {
        const mcpError = handler.handleFileNotFound(path, (error as any).suggestions || []);
        // Override message with the original validation error message
        mcpError.message = error.message;
        mcpError.error = 'InvalidParameter';
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
export function isListCrossReferencesError(
  result: ListCrossReferencesResult | ListCrossReferencesError
): result is ListCrossReferencesError {
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
export function createListCrossReferencesHandler(
  queryEngine: QueryEngine,
  errorHandler?: ErrorHandler
): (args: { path: string }) => ListCrossReferencesResult | ListCrossReferencesError {
  return (args: { path: string }) => 
    handleListCrossReferences(queryEngine, args.path, errorHandler);
}

/**
 * Format the result for MCP protocol response
 * 
 * Converts the internal result format to the MCP protocol response format.
 * 
 * @param result - Internal result from handler
 * @returns MCP protocol formatted response
 */
export function formatMcpResponse(result: ListCrossReferencesResult | ListCrossReferencesError): {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
} {
  if (isListCrossReferencesError(result)) {
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
