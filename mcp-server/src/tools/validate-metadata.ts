/**
 * validate_metadata MCP Tool
 * 
 * Validates document metadata schema and checks for required fields.
 * Returns validation result with specific error messages for each issue.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { QueryEngine, QueryResult } from '../query/QueryEngine';
import { MetadataValidation } from '../models';
import { ErrorHandler, MCPError } from '../utils/error-handler';

/**
 * Tool definition for MCP SDK registration
 */
export const validateMetadataTool = {
  name: 'validate_metadata',
  description: 'Validate document metadata schema. Checks for required fields (Date, Purpose, Organization, Scope, Layer, Relevant Tasks) and returns specific error messages for each issue.',
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
export interface ValidateMetadataResult {
  /** The metadata validation result */
  validation: MetadataValidation;
  /** Performance metrics */
  metrics: {
    responseTimeMs: number;
    issueCount: number;
    valid: boolean;
  };
}

/**
 * Error result type for FileNotFound errors
 */
export interface ValidateMetadataError {
  error: MCPError;
}

/**
 * Handler function for validate_metadata tool
 * 
 * @param queryEngine - QueryEngine instance for data access
 * @param path - Document path to validate metadata for
 * @param errorHandler - Optional error handler for logging
 * @returns Metadata validation result with metrics or error
 * 
 * Requirements:
 * - 6.1: Parse and validate the metadata schema
 * - 6.2: Check for required fields (Date, Purpose, Organization, Scope, Layer, Relevant Tasks)
 * - 6.3: Return specific error messages for each issue
 * - 6.4: Return parsed metadata with valid flag set to true when validation succeeds
 * - 6.5: Log performance metrics (response time, validation time, number of issues found)
 */
export function handleValidateMetadata(
  queryEngine: QueryEngine,
  path: string,
  errorHandler?: ErrorHandler
): ValidateMetadataResult | ValidateMetadataError {
  try {
    const result: QueryResult<MetadataValidation> = queryEngine.validateMetadata(path);

    return {
      validation: result.data,
      metrics: {
        responseTimeMs: result.metrics.responseTimeMs,
        issueCount: result.data.issues.length,
        valid: result.data.valid
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
export function isValidateMetadataError(
  result: ValidateMetadataResult | ValidateMetadataError
): result is ValidateMetadataError {
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
export function createValidateMetadataHandler(
  queryEngine: QueryEngine,
  errorHandler?: ErrorHandler
): (args: { path: string }) => ValidateMetadataResult | ValidateMetadataError {
  return (args: { path: string }) => handleValidateMetadata(queryEngine, args.path, errorHandler);
}

/**
 * Format the result for MCP protocol response
 * 
 * Converts the internal result format to the MCP protocol response format.
 * 
 * @param result - Internal result from handler
 * @returns MCP protocol formatted response
 */
export function formatMcpResponse(result: ValidateMetadataResult | ValidateMetadataError): {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
} {
  if (isValidateMetadataError(result)) {
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
