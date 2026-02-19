/**
 * ConsoleMCPClientImpl — Concrete implementation of ConsoleMCPClient.
 *
 * Spawns figma-console-mcp as a subprocess via StdioClientTransport
 * and communicates using the Model Context Protocol SDK.
 *
 * @see Design: .kiro/specs/054a-figma-token-push/design.md
 * @requirements Req 4 (Token Sync Workflow)
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { FigmaVariable } from '../generators/transformers/FigmaTransformer';
import type { ConsoleMCPClient, DesignTokenSetupPayload } from './ConsoleMCPClient';

/** Options for constructing a ConsoleMCPClientImpl. */
export interface ConsoleMCPClientOptions {
  /** Figma personal access token. Defaults to FIGMA_ACCESS_TOKEN env var. */
  accessToken?: string;
  /** Command to spawn the MCP server. Defaults to 'npx'. */
  command?: string;
  /** Arguments for the spawn command. Defaults to ['-y', 'figma-console-mcp@latest']. */
  args?: string[];
}

/**
 * Concrete MCP client that spawns figma-console-mcp as a child process
 * and calls its tools via the Model Context Protocol.
 */
export class ConsoleMCPClientImpl implements ConsoleMCPClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private connected = false;
  private readonly accessToken: string;
  private readonly command: string;
  private readonly args: string[];

  constructor(options: ConsoleMCPClientOptions = {}) {
    this.accessToken =
      options.accessToken ?? process.env.FIGMA_ACCESS_TOKEN ?? '';
    this.command = options.command ?? 'npx';
    this.args = options.args ?? ['-y', 'figma-console-mcp@latest'];

    if (!this.accessToken) {
      throw new Error(
        'FIGMA_ACCESS_TOKEN is required. Set it via environment variable or pass accessToken option.',
      );
    }
  }

  /**
   * Connect to the Console MCP server by spawning the subprocess.
   * Must be called before any tool invocations.
   */
  async connect(): Promise<void> {
    if (this.connected) return;

    try {
      this.transport = new StdioClientTransport({
        command: this.command,
        args: this.args,
        env: {
          ...process.env,
          FIGMA_ACCESS_TOKEN: this.accessToken,
        },
      });

      this.client = new Client({
        name: 'designerpunk-token-push',
        version: '1.0.0',
      });

      await this.client.connect(this.transport);
      this.connected = true;
    } catch (error) {
      this.client = null;
      this.transport = null;
      this.connected = false;
      const message =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to connect to Console MCP server: ${message}. ` +
          'Ensure figma-console-mcp is available via npx and FIGMA_ACCESS_TOKEN is set.',
      );
    }
  }

  /**
   * Disconnect from the Console MCP server and clean up resources.
   */
  async disconnect(): Promise<void> {
    if (!this.connected) return;

    try {
      await this.client?.close();
    } finally {
      this.client = null;
      this.transport = null;
      this.connected = false;
    }
  }

  /** Ensure the client is connected before making calls. */
  private ensureConnected(): Client {
    if (!this.connected || !this.client) {
      throw new Error(
        'ConsoleMCPClient is not connected. Call connect() first.',
      );
    }
    return this.client;
  }

  /**
   * Call an MCP tool and return the result content.
   * Throws on tool errors or connection issues.
   */
  private async callTool(
    name: string,
    args: Record<string, unknown>,
  ): Promise<unknown> {
    const client = this.ensureConnected();

    const result = await client.callTool({ name, arguments: args });

    if (result.isError) {
      const errorText =
        Array.isArray(result.content) && result.content.length > 0
          ? String(
              (result.content[0] as { text?: string }).text ??
                JSON.stringify(result.content),
            )
          : 'Unknown MCP tool error';
      throw new Error(`MCP tool "${name}" failed: ${errorText}`);
    }

    // Extract text content from the result
    if (Array.isArray(result.content) && result.content.length > 0) {
      const first = result.content[0] as { text?: string };
      if (first.text) {
        try {
          return JSON.parse(first.text);
        } catch {
          return first.text;
        }
      }
    }

    return result.content;
  }

  // ---------------------------------------------------------------------------
  // ConsoleMCPClient interface implementation
  // ---------------------------------------------------------------------------

  async batchCreateVariables(
    fileKey: string,
    variables: FigmaVariable[],
  ): Promise<void> {
    await this.callTool('figma_batch_create_variables', {
      fileKey,
      variables: variables.map((v) => ({
        name: v.name,
        type: v.type,
        valuesByMode: v.valuesByMode,
        description: v.description,
      })),
    });
  }

  async batchUpdateVariables(
    fileKey: string,
    variables: FigmaVariable[],
  ): Promise<void> {
    await this.callTool('figma_batch_update_variables', {
      fileKey,
      variables: variables.map((v) => ({
        name: v.name,
        type: v.type,
        valuesByMode: v.valuesByMode,
        description: v.description,
      })),
    });
  }

  async getVariables(fileKey: string): Promise<FigmaVariable[]> {
    const result = await this.callTool('figma_get_variables', { fileKey });

    // Normalize the response into FigmaVariable[]
    if (Array.isArray(result)) {
      return result as FigmaVariable[];
    }

    // Handle object response with variables property
    if (result && typeof result === 'object' && 'variables' in result) {
      return (result as { variables: FigmaVariable[] }).variables;
    }

    return [];
  }

  async execute(fileKey: string, code: string): Promise<unknown> {
    return this.callTool('figma_execute', { fileKey, code });
  }

  async setupDesignTokens(
    fileKey: string,
    payload: DesignTokenSetupPayload,
  ): Promise<void> {
    await this.callTool('figma_setup_design_tokens', {
      fileKey,
      collections: payload.collections.map((c) => ({
        name: c.name,
        modes: c.modes,
        variables: c.variables.map((v) => ({
          name: v.name,
          type: v.type,
          valuesByMode: v.valuesByMode,
          description: v.description,
        })),
      })),
    });
  }
}
