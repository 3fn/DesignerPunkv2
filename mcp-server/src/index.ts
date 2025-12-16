#!/usr/bin/env node
/**
 * MCP Documentation Server Entry Point
 * 
 * Provides on-demand documentation querying to reduce AI agent context load.
 * Uses mechanical parsing (not AI interpretation) to extract document structure.
 * 
 * Features:
 * - 8 MCP tools for documentation querying
 * - File watching for automatic re-indexing
 * - Progressive disclosure (map → summary → section)
 * - Token-efficient responses
 * 
 * Requirements: 1.1, 10.5, 15.1
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { DocumentIndexer } from './indexer/DocumentIndexer';
import { QueryEngine, QueryMetrics } from './query/QueryEngine';
import { FileWatcher } from './watcher/FileWatcher';

// Import tool definitions and handlers
import {
  getDocumentationMapTool,
  handleGetDocumentationMap,
  formatGetDocumentationMapResponse,
  getDocumentSummaryTool,
  handleGetDocumentSummary,
  formatGetDocumentSummaryResponse,
  getDocumentFullTool,
  handleGetDocumentFull,
  formatGetDocumentFullResponse,
  getSectionTool,
  handleGetSection,
  formatGetSectionResponse,
  listCrossReferencesTool,
  handleListCrossReferences,
  formatListCrossReferencesResponse,
  validateMetadataTool,
  handleValidateMetadata,
  formatValidateMetadataResponse,
  getIndexHealthTool,
  handleGetIndexHealth,
  formatGetIndexHealthResponse,
  rebuildIndexTool,
  handleRebuildIndex,
  formatRebuildIndexResponse,
} from './tools';

// Server configuration
const SERVER_NAME = 'mcp-documentation-server';
const SERVER_VERSION = '0.1.0';
const DEFAULT_STEERING_DIR = '.kiro/steering/';
const DEFAULT_LOGS_DIR = 'mcp-server/logs';

/**
 * MCP Documentation Server
 * 
 * Manages the MCP server lifecycle including:
 * - Server initialization
 * - Tool registration
 * - Document indexing
 * - File watching
 * - Graceful shutdown
 */
class MCPDocumentationServer {
  private server: Server;
  private indexer: DocumentIndexer;
  private queryEngine: QueryEngine;
  private fileWatcher: FileWatcher;
  private steeringDirectory: string;
  private isRunning: boolean = false;

  constructor(steeringDirectory: string = DEFAULT_STEERING_DIR) {
    this.steeringDirectory = steeringDirectory;

    // Initialize DocumentIndexer with logs directory
    this.indexer = new DocumentIndexer(DEFAULT_LOGS_DIR);

    // Initialize QueryEngine with metrics logging
    this.queryEngine = new QueryEngine(this.indexer, this.logMetrics.bind(this));

    // Initialize FileWatcher
    this.fileWatcher = new FileWatcher(this.indexer, this.steeringDirectory);

    // Initialize MCP Server
    this.server = new Server(
      {
        name: SERVER_NAME,
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Register request handlers
    this.registerHandlers();

    // Set up error handling
    this.server.onerror = (error) => {
      console.error('[MCP Server Error]', error);
    };
  }

  /**
   * Register all MCP tool handlers
   */
  private registerHandlers(): void {
    // Register tools list handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        getDocumentationMapTool,
        getDocumentSummaryTool,
        getDocumentFullTool,
        getSectionTool,
        listCrossReferencesTool,
        validateMetadataTool,
        getIndexHealthTool,
        rebuildIndexTool,
      ],
    }));

    // Register tool call handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_documentation_map': {
            const result = handleGetDocumentationMap(this.queryEngine);
            return formatGetDocumentationMapResponse(result);
          }

          case 'get_document_summary': {
            const params = args as { path: string };
            const result = handleGetDocumentSummary(
              this.queryEngine,
              params.path
            );
            return formatGetDocumentSummaryResponse(result);
          }

          case 'get_document_full': {
            const params = args as { path: string };
            const result = handleGetDocumentFull(
              this.queryEngine,
              params.path
            );
            return formatGetDocumentFullResponse(result);
          }

          case 'get_section': {
            const params = args as { path: string; heading: string };
            const result = handleGetSection(
              this.queryEngine,
              params.path,
              params.heading
            );
            return formatGetSectionResponse(result);
          }

          case 'list_cross_references': {
            const params = args as { path: string };
            const result = handleListCrossReferences(
              this.queryEngine,
              params.path
            );
            return formatListCrossReferencesResponse(result);
          }

          case 'validate_metadata': {
            const params = args as { path: string };
            const result = handleValidateMetadata(
              this.queryEngine,
              params.path
            );
            return formatValidateMetadataResponse(result);
          }

          case 'get_index_health': {
            const result = handleGetIndexHealth(this.queryEngine);
            return formatGetIndexHealthResponse(result);
          }

          case 'rebuild_index': {
            const result = await handleRebuildIndex(this.queryEngine);
            return formatRebuildIndexResponse(result);
          }

          default:
            return {
              content: [
                {
                  type: 'text' as const,
                  text: JSON.stringify({
                    error: 'UnknownTool',
                    message: `Unknown tool: ${name}`,
                    availableTools: [
                      'get_documentation_map',
                      'get_document_summary',
                      'get_document_full',
                      'get_section',
                      'list_cross_references',
                      'validate_metadata',
                      'get_index_health',
                      'rebuild_index',
                    ],
                  }),
                },
              ],
              isError: true,
            };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                error: 'ToolExecutionError',
                message: errorMessage,
              }),
            },
          ],
          isError: true,
        };
      }
    });
  }

  /**
   * Log performance metrics
   */
  private logMetrics(metrics: QueryMetrics): void {
    const timestamp = new Date().toISOString();
    console.error(
      `[${timestamp}] [Metrics] ${metrics.operation}: ${metrics.responseTimeMs}ms`,
      metrics.tokenCounts ? `tokens=${JSON.stringify(metrics.tokenCounts)}` : ''
    );
  }

  /**
   * Start the MCP server
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.error('[MCP Server] Already running');
      return;
    }

    console.error(`[MCP Server] Starting ${SERVER_NAME} v${SERVER_VERSION}`);

    // Index documentation directory
    console.error(`[MCP Server] Indexing ${this.steeringDirectory}...`);
    try {
      await this.indexer.indexDirectory(this.steeringDirectory);
      console.error('[MCP Server] Indexing complete');
    } catch (error) {
      console.error('[MCP Server] Indexing failed:', error);
      // Continue anyway - server can still respond with errors
    }

    // Start file watcher
    console.error('[MCP Server] Starting file watcher...');
    try {
      this.fileWatcher.start();
      console.error('[MCP Server] File watcher started');
    } catch (error) {
      console.error('[MCP Server] File watcher failed to start:', error);
      // Continue anyway - server can still work without file watching
    }

    // Connect to stdio transport
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    this.isRunning = true;
    console.error('[MCP Server] Server started and listening');

    // Set up graceful shutdown
    this.setupShutdownHandlers();
  }

  /**
   * Stop the MCP server
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    console.error('[MCP Server] Shutting down...');

    // Stop file watcher
    this.fileWatcher.stop();
    console.error('[MCP Server] File watcher stopped');

    // Close server connection
    await this.server.close();
    console.error('[MCP Server] Server stopped');

    this.isRunning = false;
  }

  /**
   * Set up graceful shutdown handlers
   */
  private setupShutdownHandlers(): void {
    const shutdown = async () => {
      await this.stop();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  }
}

// Main entry point
async function main(): Promise<void> {
  // Get steering directory from environment or use default
  const steeringDir = process.env.MCP_STEERING_DIR || DEFAULT_STEERING_DIR;

  const server = new MCPDocumentationServer(steeringDir);
  await server.start();
}

// Run the server
main().catch((error) => {
  console.error('[MCP Server] Fatal error:', error);
  process.exit(1);
});

// Export for testing
export { MCPDocumentationServer };
