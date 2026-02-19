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
import type { ConsoleMCPClient, ConsoleMCPStatus, DesignTokenSetupPayload } from './ConsoleMCPClient';

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
      collectionId: string,
      variables: FigmaVariable[],
      modesMap?: Record<string, string>,
    ): Promise<void> {
      await this.callTool('figma_batch_create_variables', {
        collectionId,
        variables: variables.map((v) => {
          // Convert mode name keys to mode IDs when modesMap is provided,
          // matching the overflow batch pattern in setupDesignTokens().
          const valuesByMode: Record<string, unknown> = {};
          for (const [key, value] of Object.entries(v.valuesByMode)) {
            const modeId = modesMap?.[key] ?? key;
            valuesByMode[modeId] = value;
          }
          return {
            name: v.name,
            resolvedType: v.resolvedType,
            description: v.description,
            valuesByMode,
          };
        }),
      });
    }

  async batchUpdateVariables(
      updates: { variableId: string; modeId: string; value: unknown }[],
    ): Promise<void> {
      await this.callTool('figma_batch_update_variables', {
        updates,
      });
    }

  async getVariables(fileKey: string): Promise<FigmaVariable[]> {
      // figma_get_variables doesn't exist in figma-console-mcp.
      // Use figma_get_token_values to retrieve current variable state.
      try {
        const result = await this.callTool('figma_get_token_values', {
          type: 'all',
          limit: 500,
        });

        // figma_get_token_values returns token objects, normalize to FigmaVariable[]
        if (result && typeof result === 'object' && 'tokens' in result) {
          const tokens = (result as { tokens: Array<Record<string, unknown>> }).tokens;
          return tokens.map((t) => ({
            name: String(t.name ?? ''),
            resolvedType: String(t.resolvedType ?? t.type ?? 'FLOAT') as FigmaVariable['resolvedType'],
            valuesByMode: (t.valuesByMode ?? t.values ?? {}) as Record<string, unknown>,
            description: t.description as string | undefined,
            id: t.id as string | undefined,
            collectionId: t.collectionId as string | undefined,
            collectionName: t.collectionName as string | undefined,
          })) as FigmaVariable[];
        }

        // Handle array response
        if (Array.isArray(result)) {
          return result as FigmaVariable[];
        }

        return [];
      } catch {
        // If token retrieval fails (e.g. no design system yet), return empty
        return [];
      }
    }

  async execute(fileKey: string, code: string): Promise<unknown> {
    return this.callTool('figma_execute', { fileKey, code });
  }
  async createVariableAliases(
      fileKey: string,
      aliases: { semanticName: string; primitiveName: string }[],
    ): Promise<void> {
      if (aliases.length === 0) return;

      // Build Plugin API code that creates variable aliases for each pair.
      // The code finds both variables by name, creates an alias reference
      // from the primitive, and sets it on the semantic variable for every mode.
      const aliasEntries = aliases
        .map(
          (a) =>
            `  { semantic: ${JSON.stringify(a.semanticName)}, primitive: ${JSON.stringify(a.primitiveName)} }`,
        )
        .join(',\n');

      const code = `
  const allVars = figma.variables.getLocalVariables();
  const byName = new Map(allVars.map(v => [v.name, v]));
  const pairs = [
  ${aliasEntries}
  ];
  const errors = [];
  for (const { semantic, primitive } of pairs) {
    const semVar = byName.get(semantic);
    const primVar = byName.get(primitive);
    if (!semVar) { errors.push('Semantic variable not found: ' + semantic); continue; }
    if (!primVar) { errors.push('Primitive variable not found: ' + primitive); continue; }
    const alias = figma.variables.createVariableAlias(primVar);
    const collection = figma.variables.getVariableCollectionById(semVar.variableCollectionId);
    if (!collection) { errors.push('Collection not found for: ' + semantic); continue; }
    for (const modeId of collection.modes.map(m => m.modeId)) {
      semVar.setValueForMode(modeId, alias);
    }
  }
  if (errors.length > 0) { figma.notify('Alias errors: ' + errors.join('; ')); }
  `.trim();

      await this.callTool('figma_execute', { fileKey, code });
    }


  async setupDesignTokens(
      fileKey: string,
      payload: DesignTokenSetupPayload,
    ): Promise<void> {
      const BATCH_SIZE = 100;

      // Build a lookup map of all primitive variable values for alias resolution.
      // Aliases reference primitives by name (e.g. "color/green/400").
      const primitiveLookup = new Map<string, Record<string, unknown>>();
      for (const collection of payload.collections) {
        for (const v of collection.variables) {
          // Store the raw valuesByMode keyed by variable name
          primitiveLookup.set(v.name, v.valuesByMode);
        }
      }

      for (const collection of payload.collections) {
        const tokens = collection.variables.map((v) => ({
          name: v.name,
          resolvedType: v.resolvedType,
          description: v.description,
          values: Object.fromEntries(
            collection.modes.map((modeName) => {
              const raw = v.valuesByMode[modeName] ?? v.valuesByMode[collection.modes[0]];
              // Resolve alias objects to actual values.
              // figma_setup_design_tokens doesn't support alias references —
              // it only accepts raw values (hex strings, numbers, etc.).
              const resolved = this.resolveAliasForFigma(raw, modeName, primitiveLookup);
              return [modeName, resolved];
            })
          ),
        }));

        // Create collection with first batch of tokens
        const firstBatch = tokens.slice(0, BATCH_SIZE);
        const setupResult = await this.callTool('figma_setup_design_tokens', {
          collectionName: collection.name,
          modes: collection.modes,
          tokens: firstBatch,
        }) as { collectionId?: string; modes?: Record<string, string> } | undefined;

        // If there are more tokens, add them using batch_create_variables
        if (tokens.length > BATCH_SIZE) {
          const collectionId = setupResult?.collectionId;
          const modesMap = setupResult?.modes;

          if (!collectionId) {
            throw new Error(
              `Could not find collection ID for "${collection.name}" after creation. ` +
              `Setup response: ${JSON.stringify(setupResult)}`
            );
          }

          for (let i = BATCH_SIZE; i < tokens.length; i += BATCH_SIZE) {
            const batch = tokens.slice(i, i + BATCH_SIZE);
            const batchVariables = batch.map(t => {
              const valuesByModeId: Record<string, unknown> = {};
              for (const [modeName, value] of Object.entries(t.values)) {
                const modeId = modesMap?.[modeName] ?? modeName;
                valuesByModeId[modeId] = value;
              }
              return {
                name: t.name,
                resolvedType: t.resolvedType,
                description: t.description,
                valuesByMode: valuesByModeId,
              };
            });

            await this.callTool('figma_batch_create_variables', {
              collectionId,
              variables: batchVariables,
            });
          }
        }
      }
    }

    /**
     * Resolve an alias object to its actual value for Figma.
     *
     * figma_setup_design_tokens only accepts raw values (hex, numbers, etc.),
     * not alias references. This method follows alias chains to find the
     * concrete value from the primitives collection.
     */
    private resolveAliasForFigma(
      value: unknown,
      modeName: string,
      lookup: Map<string, Record<string, unknown>>,
      depth = 0,
    ): unknown {
      if (depth > 10) return value; // Guard against circular aliases

      if (value && typeof value === 'object' && 'aliasOf' in value) {
        const aliasName = (value as { aliasOf: string }).aliasOf;
        const targetValues = lookup.get(aliasName);
        if (targetValues) {
          const targetValue = targetValues[modeName] ?? Object.values(targetValues)[0];
          // Recurse in case the target is also an alias
          return this.resolveAliasForFigma(targetValue, modeName, lookup, depth + 1);
        }
        // Alias target not found — return a fallback
        return '#000000';
      }

      return value;
    }

  async getStatus(): Promise<ConsoleMCPStatus> {
    const result = await this.callTool('figma_get_status', {});
    return (result ?? {}) as ConsoleMCPStatus;
  }
}
