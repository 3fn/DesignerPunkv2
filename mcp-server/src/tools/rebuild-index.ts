/**
 * rebuild_index MCP Tool
 * 
 * Rebuilds the documentation index from scratch.
 * Returns the new index health status after rebuild.
 * 
 * Requirements: 9.1, 9.2, 9.5
 */

import { QueryEngine, QueryResult } from '../query/QueryEngine';
import { IndexHealth } from '../models';

/**
 * Tool definition for MCP SDK registration
 */
export const rebuildIndexTool = {
  name: 'rebuild_index',
  description: 'Rebuild the documentation index from scratch. Use this when the index is corrupted or out of sync. Returns the new index health status after rebuild.',
  inputSchema: {
    type: 'object' as const,
    properties: {},
    required: [] as string[]
  }
};

/**
 * Tool handler result type
 */
export interface RebuildIndexResult {
  /** The index health data after rebuild */
  health: IndexHealth;
  /** Whether the rebuild was successful */
  success: boolean;
  /** Performance metrics */
  metrics: {
    responseTimeMs: number;
    documentsReindexed: number;
  };
}

/**
 * Handler function for rebuild_index tool
 * 
 * @param queryEngine - QueryEngine instance for data access
 * @returns Index health result after rebuild with metrics
 * 
 * Requirements:
 * - 9.1: Rebuild index from scratch
 * - 9.2: Re-index all documents
 * - 9.5: Return IndexHealth structure with new status
 */
export async function handleRebuildIndex(
  queryEngine: QueryEngine
): Promise<RebuildIndexResult> {
  const result: QueryResult<IndexHealth> = await queryEngine.rebuildIndex();

  return {
    health: result.data,
    success: result.data.status !== 'failed',
    metrics: {
      responseTimeMs: result.metrics.responseTimeMs,
      documentsReindexed: result.data.documentsIndexed
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
export function createRebuildIndexHandler(
  queryEngine: QueryEngine
): () => Promise<RebuildIndexResult> {
  return () => handleRebuildIndex(queryEngine);
}

/**
 * Format the result for MCP protocol response
 * 
 * Converts the internal result format to the MCP protocol response format.
 * 
 * @param result - Internal result from handler
 * @returns MCP protocol formatted response
 */
export function formatMcpResponse(result: RebuildIndexResult): {
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
