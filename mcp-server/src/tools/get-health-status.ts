/**
 * get_health_status MCP Tool
 * 
 * Returns comprehensive health status including index health,
 * uptime, and memory usage.
 * 
 * Requirements: 16.5
 */

import { QueryEngine, QueryResult } from '../query/QueryEngine';
import { IndexHealth } from '../models';

/**
 * Server health status structure
 */
export interface ServerHealthStatus {
  /** Index health data */
  indexHealth: IndexHealth;
  /** Server uptime in seconds */
  uptimeSeconds: number;
  /** Memory usage in bytes */
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
  };
  /** Server start time as ISO string */
  startTime: string;
}

/**
 * Tool definition for MCP SDK registration
 */
export const getHealthStatusTool = {
  name: 'get_health_status',
  description: 'Get comprehensive server health status including index health, uptime, and memory usage. Use this for monitoring and debugging the MCP server.',
  inputSchema: {
    type: 'object' as const,
    properties: {},
    required: [] as string[]
  }
};

/**
 * Tool handler result type
 */
export interface GetHealthStatusResult {
  /** The comprehensive health status */
  status: ServerHealthStatus;
  /** Performance metrics */
  metrics: {
    responseTimeMs: number;
  };
}

// Track server start time
const serverStartTime = new Date();

/**
 * Handler function for get_health_status tool
 * 
 * @param queryEngine - QueryEngine instance for data access
 * @returns Comprehensive health status with metrics
 * 
 * Requirements:
 * - 16.5: Return health status, index metrics, issues, uptime, memory usage
 */
export function handleGetHealthStatus(
  queryEngine: QueryEngine
): GetHealthStatusResult {
  const startTime = Date.now();
  
  // Get index health
  const indexHealthResult: QueryResult<IndexHealth> = queryEngine.getIndexHealth();
  
  // Get memory usage
  const memUsage = process.memoryUsage();
  
  // Calculate uptime
  const uptimeSeconds = Math.floor((Date.now() - serverStartTime.getTime()) / 1000);
  
  const responseTimeMs = Date.now() - startTime;

  return {
    status: {
      indexHealth: indexHealthResult.data,
      uptimeSeconds,
      memoryUsage: {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external,
        rss: memUsage.rss
      },
      startTime: serverStartTime.toISOString()
    },
    metrics: {
      responseTimeMs
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
export function createGetHealthStatusHandler(
  queryEngine: QueryEngine
): () => GetHealthStatusResult {
  return () => handleGetHealthStatus(queryEngine);
}

/**
 * Format the result for MCP protocol response
 * 
 * Converts the internal result format to the MCP protocol response format.
 * 
 * @param result - Internal result from handler
 * @returns MCP protocol formatted response
 */
export function formatMcpResponse(result: GetHealthStatusResult): {
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
