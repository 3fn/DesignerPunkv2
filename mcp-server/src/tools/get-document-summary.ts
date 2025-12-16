/**
 * get_document_summary MCP Tool
 * 
 * Returns document summary with metadata, outline, and cross-references.
 * Summaries are designed to be ~200 tokens to enable informed decisions
 * about whether to load full content.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7
 */

import { QueryEngine, QueryResult } from '../query/QueryEngine';
import { DocumentSummary } from '../models';
import { ErrorHandler, MCPError } from '../utils/error-handler';

/**
 * Tool definition for MCP SDK registration
 */
export const getDocumentSummaryTool = {
  name: 'get_document_summary',
  description: 'Get document summary with metadata and outline. Returns ~200 tokens to enable informed decisions about loading full content.',
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
export interface GetDocumentSummaryResult {
  /** The document summary data */
  documentSummary: DocumentSummary;
  /** Performance metrics */
  metrics: {
    responseTimeMs: number;
    summaryTokens: number;
    fullDocumentTokens: number;
    compressionRatio: number;
  };
}

/**
 * Error result type for FileNotFound errors
 */
export interface GetDocumentSummaryError {
  error: MCPError;
}

/**
 * Handler function for get_document_summary tool
 * 
 * @param queryEngine - QueryEngine instance for data access
 * @param path - Document path to get summary for
 * @param errorHandler - Optional error handler for logging
 * @returns Document summary with metrics or error
 * 
 * Requirements:
 * - 2.1: Return metadata and outline using mechanical parsing
 * - 2.2: Extract metadata fields (purpose, layer, relevant tasks, last reviewed)
 * - 2.3: Extract H2 and H3 headings with subsection structure
 * - 2.4: Include token count for the full document
 * - 2.5: Log token usage metrics (summary tokens, full document tokens, compression ratio)
 * - 2.6: List referenced documents with context
 * - 2.7: Log performance metrics (response time, parsing time, token estimation time)
 */
export function handleGetDocumentSummary(
  queryEngine: QueryEngine,
  path: string,
  errorHandler?: ErrorHandler
): GetDocumentSummaryResult | GetDocumentSummaryError {
  try {
    const result: QueryResult<DocumentSummary> = queryEngine.getDocumentSummary(path);

    // Calculate summary token estimate
    const summaryTokens = result.metrics.tokenCounts?.summary || estimateSummaryTokens(result.data);
    const fullDocumentTokens = result.data.tokenCount;
    const compressionRatio = fullDocumentTokens > 0 
      ? Math.round((1 - summaryTokens / fullDocumentTokens) * 100) 
      : 0;

    return {
      documentSummary: result.data,
      metrics: {
        responseTimeMs: result.metrics.responseTimeMs,
        summaryTokens,
        fullDocumentTokens,
        compressionRatio
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
 * Estimate token count for a summary
 * 
 * @param summary - Document summary
 * @returns Estimated token count
 */
function estimateSummaryTokens(summary: DocumentSummary): number {
  // Rough estimation: metadata + outline + cross-references
  // Each field contributes approximately:
  // - metadata: ~50 tokens
  // - outline: ~10 tokens per section
  // - cross-references: ~15 tokens per reference
  const metadataTokens = 50;
  const outlineTokens = summary.outline.length * 10;
  const crossRefTokens = summary.crossReferences.length * 15;

  return metadataTokens + outlineTokens + crossRefTokens;
}

/**
 * Type guard to check if result is an error
 */
export function isGetDocumentSummaryError(
  result: GetDocumentSummaryResult | GetDocumentSummaryError
): result is GetDocumentSummaryError {
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
export function createGetDocumentSummaryHandler(
  queryEngine: QueryEngine,
  errorHandler?: ErrorHandler
): (args: { path: string }) => GetDocumentSummaryResult | GetDocumentSummaryError {
  return (args: { path: string }) => handleGetDocumentSummary(queryEngine, args.path, errorHandler);
}

/**
 * Format the result for MCP protocol response
 * 
 * Converts the internal result format to the MCP protocol response format.
 * 
 * @param result - Internal result from handler
 * @returns MCP protocol formatted response
 */
export function formatMcpResponse(result: GetDocumentSummaryResult | GetDocumentSummaryError): {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
} {
  if (isGetDocumentSummaryError(result)) {
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
