/**
 * get_section MCP Tool
 * 
 * Returns specific document section by heading with parent context.
 * Use this for granular access to specific sections without loading entire documents.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */

import { QueryEngine, QueryResult } from '../query/QueryEngine';
import { Section } from '../models';
import { ErrorHandler, MCPError } from '../utils/error-handler';

/**
 * Tool definition for MCP SDK registration
 */
export const getSectionTool = {
  name: 'get_section',
  description: 'Get specific document section by heading. Returns section content with parent context for document location.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      path: {
        type: 'string',
        description: 'Document path (e.g., ".kiro/steering/Component Development Guide.md")'
      },
      heading: {
        type: 'string',
        description: 'Section heading to retrieve (e.g., "Token Selection Decision Framework")'
      }
    },
    required: ['path', 'heading'] as string[]
  }
};

/**
 * Tool handler result type
 */
export interface GetSectionResult {
  /** The section data */
  section: Section;
  /** Performance metrics */
  metrics: {
    responseTimeMs: number;
    tokenCount: number;
  };
}

/**
 * Error result type for SectionNotFound and FileNotFound errors
 */
export interface GetSectionError {
  error: MCPError;
}

/**
 * Handler function for get_section tool
 * 
 * @param queryEngine - QueryEngine instance for data access
 * @param path - Document path
 * @param heading - Section heading to retrieve
 * @param errorHandler - Optional error handler for logging
 * @returns Section with metrics or error
 * 
 * Requirements:
 * - 4.1: Return only the requested section's content
 * - 4.2: Include parent heading context to show document location
 * - 4.3: Include token count for the section
 * - 4.4: Use mechanical parsing to identify section boundaries by heading structure
 * - 4.5: Log performance metrics (response time, section extraction time, token count)
 * - 4.6: Return error with clear message and suggest similar headings for non-existent sections
 */
export function handleGetSection(
  queryEngine: QueryEngine,
  path: string,
  heading: string,
  errorHandler?: ErrorHandler
): GetSectionResult | GetSectionError {
  try {
    const result: QueryResult<Section> = queryEngine.getSection(path, heading);

    return {
      section: result.data,
      metrics: {
        responseTimeMs: result.metrics.responseTimeMs,
        tokenCount: result.data.tokenCount
      }
    };
  } catch (error) {
    if (error instanceof Error) {
      const errorType = (error as any).errorType;
      const handler = errorHandler || new ErrorHandler();
      
      // Handle SectionNotFound errors
      if (errorType === 'SectionNotFound' || error.message.includes('section') || error.message.includes('heading')) {
        const mcpError = handler.handleSectionNotFound(
          path,
          heading,
          (error as any).availableHeadings || (error as any).suggestions || []
        );
        return { error: mcpError };
      }
      
      // Handle InvalidParameter errors - treat as SectionNotFound for user-facing response
      if (errorType === 'InvalidParameter') {
        const mcpError = handler.handleSectionNotFound(
          path,
          heading,
          (error as any).suggestions || []
        );
        // Override message with the original validation error message
        mcpError.message = error.message;
        return { error: mcpError };
      }
      
      // Handle FileNotFound errors
      if (errorType === 'FileNotFound' || error.message.includes('not found')) {
        const mcpError = handler.handleFileNotFound(path, (error as any).suggestions || []);
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
export function isGetSectionError(
  result: GetSectionResult | GetSectionError
): result is GetSectionError {
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
export function createGetSectionHandler(
  queryEngine: QueryEngine,
  errorHandler?: ErrorHandler
): (args: { path: string; heading: string }) => GetSectionResult | GetSectionError {
  return (args: { path: string; heading: string }) => 
    handleGetSection(queryEngine, args.path, args.heading, errorHandler);
}

/**
 * Format the result for MCP protocol response
 * 
 * Converts the internal result format to the MCP protocol response format.
 * 
 * @param result - Internal result from handler
 * @returns MCP protocol formatted response
 */
export function formatMcpResponse(result: GetSectionResult | GetSectionError): {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
} {
  if (isGetSectionError(result)) {
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
