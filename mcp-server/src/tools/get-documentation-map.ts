/**
 * get_documentation_map MCP Tool
 * 
 * Returns the complete four-layer documentation structure with metadata
 * for all documents in the system.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

import { QueryEngine, QueryResult } from '../query/QueryEngine';
import { DocumentationMap } from '../models';

/**
 * Tool definition for MCP SDK registration
 */
export const getDocumentationMapTool = {
  name: 'get_documentation_map',
  description: 'Get complete documentation structure with metadata for all documents organized by layer',
  inputSchema: {
    type: 'object' as const,
    properties: {},
    required: [] as string[]
  }
};

/**
 * Tool handler result type
 */
export interface GetDocumentationMapResult {
  /** The documentation map data */
  documentationMap: DocumentationMap;
  /** Performance metrics */
  metrics: {
    responseTimeMs: number;
    documentCount: number;
  };
}

/**
 * Handler function for get_documentation_map tool
 * 
 * @param queryEngine - QueryEngine instance for data access
 * @returns Documentation map with all layers and documents
 * 
 * Requirements:
 * - 1.1: Return complete four-layer structure with metadata for all documents
 * - 1.2: Include document path, purpose, layer, relevant tasks, and section headings
 * - 1.3: Use mechanical parsing to extract metadata without interpreting content
 * - 1.4: Log performance metrics (response time, document count, index size)
 */
export function handleGetDocumentationMap(
  queryEngine: QueryEngine
): GetDocumentationMapResult {
  const result: QueryResult<DocumentationMap> = queryEngine.getDocumentationMap();

  // Count total documents across all layers
  let documentCount = 0;
  for (const layer of Object.values(result.data.layers)) {
    documentCount += layer.documents.length;
  }

  return {
    documentationMap: result.data,
    metrics: {
      responseTimeMs: result.metrics.responseTimeMs,
      documentCount
    }
  };
}

/**
 * Create a tool handler bound to a specific QueryEngine instance
 * 
 * This factory function creates a handler that can be registered with the MCP SDK.
 * The handler captures the QueryEngine instance in its closure.
 * 
 * @param queryEngine - QueryEngine instance for data access
 * @returns Handler function for MCP SDK registration
 */
export function createGetDocumentationMapHandler(
  queryEngine: QueryEngine
): () => GetDocumentationMapResult {
  return () => handleGetDocumentationMap(queryEngine);
}

/**
 * Format the result for MCP protocol response
 * 
 * Converts the internal result format to the MCP protocol response format.
 * 
 * @param result - Internal result from handler
 * @returns MCP protocol formatted response
 */
export function formatMcpResponse(result: GetDocumentationMapResult): {
  content: Array<{ type: 'text'; text: string }>;
} {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }
    ]
  };
}
