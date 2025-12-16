/**
 * get_index_health MCP Tool
 * 
 * Returns the health status of the document index including status,
 * errors, warnings, and metrics.
 * 
 * Requirements: 9.1, 9.2, 9.5
 */

import { QueryEngine, QueryResult } from '../query/QueryEngine';
import { IndexHealth } from '../models';

/**
 * Tool definition for MCP SDK registration
 */
export const getIndexHealthTool = {
  name: 'get_index_health',
  description: 'Get the health status of the document index. Returns status (healthy/degraded/failed), errors, warnings, and metrics including document count, section count, cross-reference count, and index size.',
  inputSchema: {
    type: 'object' as const,
    properties: {},
    required: [] as string[]
  }
};

/**
 * Tool handler result type
 */
export interface GetIndexHealthResult {
  /** The index health data */
  health: IndexHealth;
  /** Performance metrics */
  metrics: {
    responseTimeMs: number;
    status: string;
    documentsIndexed: number;
  };
}

/**
 * Handler function for get_index_health tool
 * 
 * @param queryEngine - QueryEngine instance for data access
 * @returns Index health result with metrics
 * 
 * Requirements:
 * - 9.1: Validate the index integrity on startup
 * - 9.2: Detect and report index corruption
 * - 9.5: Return health status, index metrics, issues
 */
export function handleGetIndexHealth(
  queryEngine: QueryEngine
): GetIndexHealthResult {
  const result: QueryResult<IndexHealth> = queryEngine.getIndexHealth();

  return {
    health: result.data,
    metrics: {
      responseTimeMs: result.metrics.responseTimeMs,
      status: result.data.status,
      documentsIndexed: result.data.documentsIndexed
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
export function createGetIndexHealthHandler(
  queryEngine: QueryEngine
): () => GetIndexHealthResult {
  return () => handleGetIndexHealth(queryEngine);
}

/**
 * Format the result for MCP protocol response
 * 
 * Converts the internal result format to the MCP protocol response format.
 * 
 * @param result - Internal result from handler
 * @returns MCP protocol formatted response
 */
export function formatMcpResponse(result: GetIndexHealthResult): {
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
