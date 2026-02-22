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
import type { ConsoleMCPClient, ConsoleMCPStatus, DesignTokenSetupPayload, FigmaStyleData, FigmaComponentData } from './ConsoleMCPClient';

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

  async getStyles(fileKey: string): Promise<FigmaStyleData[]> {
    try {
      const result = await this.callTool('figma_get_styles', { fileKey });

      // Normalize response to FigmaStyleData[]
      if (Array.isArray(result)) {
        return result.map((s: Record<string, unknown>) => ({
          name: String(s.name ?? ''),
          type: (s.type === 'TEXT' ? 'TEXT' : 'EFFECT') as FigmaStyleData['type'],
          properties: (s.properties ?? s) as Record<string, unknown>,
        }));
      }

      if (result && typeof result === 'object' && 'styles' in result) {
        const styles = (result as { styles: Array<Record<string, unknown>> }).styles;
        return styles.map((s) => ({
          name: String(s.name ?? ''),
          type: (s.type === 'TEXT' ? 'TEXT' : 'EFFECT') as FigmaStyleData['type'],
          properties: (s.properties ?? s) as Record<string, unknown>,
        }));
      }

      return [];
    } catch {
      // If style retrieval fails, return empty array
      return [];
    }
  }

  async getComponent(fileKey: string, nodeId: string): Promise<FigmaComponentData> {
      // Figma REST API accepts dash-separated IDs in query params but returns
      // colon-separated IDs in response keys. The figma-console-mcp tool uses
      // the raw nodeId for the response lookup, so we normalize to colon format
      // to ensure the lookup succeeds.
      const normalizedNodeId = nodeId.replace(/-/g, ':');
      const result = await this.callTool('figma_get_component', { fileKey, nodeId: normalizedNodeId, format: 'reconstruction' });

      if (result && typeof result === 'object') {
        const data = result as Record<string, unknown>;

        // Reconstruction format cannot handle COMPONENT_SET nodes (variant
        // containers). When this happens, fetch metadata for the parent to
        // get children IDs, then fetch the first child variant with
        // figma_get_component_for_development to get rich layout data.
        if (data.error === 'COMPONENT_SET_NOT_SUPPORTED') {
          return this.getComponentSetWithReconstruction(fileKey, normalizedNodeId);
        }

        // The MCP tool returns different structures depending on the source
        // and format:
        // - Desktop Bridge metadata: { fileKey, nodeId, component: {...}, source: "desktop_bridge_plugin" }
        // - Desktop Bridge reconstruction: { fileKey, nodeId, reconstruction: {...}, source: "desktop_bridge_plugin" }
        // - REST API: { document: {...}, components: {...}, ... }
        // Extract the actual component data from whichever wrapper is present.
        const componentObj =
          (data.reconstruction as Record<string, unknown>) ??
          (data.component as Record<string, unknown>) ??
          (data.document as Record<string, unknown>) ??
          data;

        return this.extractComponentFields(componentObj);
      }

      return {};
    }

  /**
   * Handle COMPONENT_SET nodes by using figma_execute with Plugin API
   * to get the complete node tree including layout properties,
   * boundVariables, fills, and cornerRadius for all children.
   *
   * The Plugin API via figma.getNodeByIdAsync() returns the full node
   * with all properties, unlike the Desktop Bridge reconstruction format
   * which only returns stub children for component sets.
   */
  /**
     * Handle COMPONENT_SET nodes by fetching metadata for the parent
     * (name, variantProperties, children IDs) and then using
     * figma_get_component_for_development on the first child variant
     * to get rich layout/visual data including boundVariables.
     *
     * Falls back to figma_execute with Plugin API if the development
     * tool doesn't return sufficient data.
     */
    /**
       * Handle COMPONENT_SET nodes by fetching metadata for the parent
       * (name, variantProperties, children IDs) and then using
       * figma_get_component_for_development on the first child variant
       * to get rich layout/visual data.
       *
       * Falls back to figma_execute with Plugin API if the development
       * tool doesn't return sufficient data.
       */
      /**
         * Handle COMPONENT_SET nodes by fetching metadata for the parent
         * (name, variantProperties, children IDs) and then using the Plugin API
         * on the first child variant to get rich data including boundVariables.
         *
         * Strategy order:
         * 1. figma_execute (Plugin API) — returns boundVariables + layout
         * 2. figma_get_component_for_development (REST API) — returns layout but no boundVariables
         *
         * Plugin API is preferred because it's the only path that returns
         * boundVariables, which enable binding-first token translation.
         */
        /**
           * Handle COMPONENT_SET nodes by fetching metadata for the parent
           * (name, variantProperties, children IDs) and then combining data
           * from both the REST API and Plugin API on the first child variant.
           *
           * Strategy: call BOTH sources and merge:
           * - figma_get_component_for_development (REST API) → layout, fills, children structure
           * - figma_execute (Plugin API) → boundVariables (only source for these)
           *
           * The REST API provides rich structural data but no boundVariables.
           * The Plugin API provides boundVariables but may fail on some node types.
           * Merging both gives us the complete picture.
           */
          private async getComponentSetWithReconstruction(
            fileKey: string,
            nodeId: string,
          ): Promise<FigmaComponentData> {
            // Step 1: Get metadata for the component set (works for COMPONENT_SET)
            // to get name, variantProperties, and children IDs.
            const metadataResult = await this.callTool('figma_get_component', {
              fileKey,
              nodeId,
            });

            if (!metadataResult || typeof metadataResult !== 'object') {
              return {};
            }

            const metaData = metadataResult as Record<string, unknown>;
            const metaComponent =
              (metaData.component as Record<string, unknown>) ??
              (metaData.document as Record<string, unknown>) ??
              metaData;

            const parentFields = this.extractComponentFields(metaComponent);

            // Step 2: Find first child variant ID
            const children = metaComponent.children as Array<Record<string, unknown>> | undefined;
            if (!children || children.length === 0) {
              return parentFields;
            }

            const firstChildId = children[0].id as string | undefined;
            if (!firstChildId) {
              return parentFields;
            }

            // Step 3: Fetch from BOTH sources in parallel
            let restData: Record<string, unknown> | undefined;
            let pluginData: Record<string, unknown> | undefined;

            // 3a: REST API — layout, fills, children structure
            try {
              const devResult = await this.callTool('figma_get_component_for_development', {
                nodeId: firstChildId,
                includeImage: false,
              });

              if (devResult && typeof devResult === 'object') {
                const devObj = devResult as Record<string, unknown>;
                restData =
                  (devObj.component as Record<string, unknown>) ??
                  devObj;
              }
            } catch {
              // REST API failed — continue with Plugin API only
            }

            // 3b: Plugin API — boundVariables
            try {
              const code = `
        const node = await figma.getNodeByIdAsync('${firstChildId}');
        if (!node) return JSON.stringify({ error: 'Node not found' });

        function extractNode(n, depth) {
          if (depth > 4) return { id: n.id, name: n.name, type: n.type };
          const data = {
            id: n.id, name: n.name, type: n.type,
            visible: n.visible
          };
          if ('layoutMode' in n) data.layoutMode = n.layoutMode;
          if ('itemSpacing' in n) data.itemSpacing = n.itemSpacing;
          if ('paddingTop' in n) data.paddingTop = n.paddingTop;
          if ('paddingRight' in n) data.paddingRight = n.paddingRight;
          if ('paddingBottom' in n) data.paddingBottom = n.paddingBottom;
          if ('paddingLeft' in n) data.paddingLeft = n.paddingLeft;
          if ('counterAxisSpacing' in n) data.counterAxisSpacing = n.counterAxisSpacing;
          if ('cornerRadius' in n) data.cornerRadius = n.cornerRadius;
          if ('fills' in n) data.fills = n.fills;
          if ('strokes' in n) data.strokes = n.strokes;
          if ('effects' in n) data.effects = n.effects;
          if ('opacity' in n) data.opacity = n.opacity;
          if ('boundVariables' in n) {
            const bv = {};
            for (const [key, val] of Object.entries(n.boundVariables)) {
              if (val && typeof val === 'object') {
                if (Array.isArray(val)) {
                  bv[key] = val.map(v => ({ id: v.id, type: v.type }));
                } else {
                  bv[key] = { id: val.id, type: val.type };
                }
              }
            }
            if (Object.keys(bv).length > 0) data.boundVariables = bv;
          }
          if ('componentPropertyDefinitions' in n) data.componentPropertyDefinitions = n.componentPropertyDefinitions;
          if ('variantProperties' in n) data.variantProperties = n.variantProperties;
          if ('width' in n) data.width = n.width;
          if ('height' in n) data.height = n.height;
          if ('children' in n && n.children) {
            data.children = n.children.map(c => extractNode(c, depth + 1));
          }
          return data;
        }

        return JSON.stringify(extractNode(node, 0));
        `.trim();

              const result = await this.callTool('figma_execute', { fileKey, code });
              pluginData = this.parsePluginApiResult(result);
            } catch {
              // Plugin API failed — continue with REST data only
            }

            // Step 4: Merge results — REST structure + Plugin boundVariables
            if (restData && pluginData) {
              // Overlay boundVariables from Plugin API onto REST API structure
              const merged = this.mergeComponentData(restData, pluginData);
              return {
                ...parentFields,
                children: [merged] as unknown[],
              };
            }

            // One source only
            const childData = restData ?? pluginData;
            if (childData) {
              return {
                ...parentFields,
                children: [childData] as unknown[],
              };
            }

            return parentFields;
          }

          /**
           * Parse the result from figma_execute into a component data object.
           * Handles various response wrapper formats.
           */
          private parsePluginApiResult(result: unknown): Record<string, unknown> | undefined {
            if (result && typeof result === 'string') {
              try {
                const parsed = JSON.parse(result) as Record<string, unknown>;
                if (!parsed.error && parsed.name) return parsed;
              } catch {
                // JSON parse failed
              }
            } else if (result && typeof result === 'object') {
              const r = result as Record<string, unknown>;
              const output = r.result ?? r.output ?? r.returnValue;
              if (typeof output === 'string') {
                try {
                  const parsed = JSON.parse(output) as Record<string, unknown>;
                  if (!parsed.error && parsed.name) return parsed;
                } catch {
                  // JSON parse failed
                }
              } else if (typeof output === 'object' && output !== null) {
                const outputObj = output as Record<string, unknown>;
                if (outputObj.name && !outputObj.error) return outputObj;
              } else if (r.name && !r.error) {
                return r;
              }
            }
            return undefined;
          }

          /**
           * Merge REST API data (structure) with Plugin API data (boundVariables).
           *
           * Walks both trees by matching node IDs and overlays boundVariables
           * from the Plugin API onto the REST API structure. Falls back to
           * name matching when IDs don't align.
           */
          private mergeComponentData(
            restNode: Record<string, unknown>,
            pluginNode: Record<string, unknown>,
          ): Record<string, unknown> {
            const merged = { ...restNode };

            // Overlay boundVariables from plugin onto rest
            if (pluginNode.boundVariables && !restNode.boundVariables) {
              merged.boundVariables = pluginNode.boundVariables;
            }

            // Overlay fill-level boundVariables
            const restFills = restNode.fills as Array<Record<string, unknown>> | undefined;
            const pluginFills = pluginNode.fills as Array<Record<string, unknown>> | undefined;
            if (restFills && pluginFills) {
              const mergedFills = restFills.map((rf, i) => {
                const pf = pluginFills[i];
                if (pf?.boundVariables && !rf.boundVariables) {
                  return { ...rf, boundVariables: pf.boundVariables };
                }
                return rf;
              });
              merged.fills = mergedFills;
            }

            // Recursively merge children by matching IDs or index
            const restChildren = restNode.children as Array<Record<string, unknown>> | undefined;
            const pluginChildren = pluginNode.children as Array<Record<string, unknown>> | undefined;
            if (restChildren && pluginChildren) {
              // Build ID lookup from plugin children
              const pluginById = new Map<string, Record<string, unknown>>();
              for (const pc of pluginChildren) {
                const id = pc.id as string | undefined;
                if (id) pluginById.set(id, pc);
              }

              const mergedChildren = restChildren.map((rc, i) => {
                const rcId = rc.id as string | undefined;
                const matchingPlugin = (rcId ? pluginById.get(rcId) : undefined) ?? pluginChildren[i];
                if (matchingPlugin) {
                  return this.mergeComponentData(rc, matchingPlugin);
                }
                return rc;
              });
              merged.children = mergedChildren;
            } else if (!restChildren && pluginChildren) {
              // REST had no children but plugin did — use plugin children
              merged.children = pluginChildren;
            }

            return merged;
          }





  /** Extract standard FigmaComponentData fields from a raw component object. */
  private extractComponentFields(obj: Record<string, unknown>): FigmaComponentData {
      // Normalize componentPropertyDefinitions → variantProperties
      // COMPONENT_SET nodes use componentPropertyDefinitions with shape:
      //   { "Property 1": { type: "VARIANT", defaultValue: "Sm", variantOptions: ["Sm","Md","Lg"] } }
      // We convert VARIANT entries to variantProperties format:
      //   { "Property 1": ["Sm", "Md", "Lg"] }
      let variantProperties = obj.variantProperties as Record<string, string[]> | undefined;

      if (!variantProperties) {
        const cpd = obj.componentPropertyDefinitions as
          Record<string, { type: string; variantOptions?: string[]; defaultValue?: string }> | undefined;
        if (cpd) {
          const converted: Record<string, string[]> = {};
          for (const [propName, def] of Object.entries(cpd)) {
            if (def.type === 'VARIANT' && def.variantOptions) {
              converted[propName] = def.variantOptions;
            }
          }
          if (Object.keys(converted).length > 0) {
            variantProperties = converted;
          }
        }
      }

      return {
        name: obj.name != null ? String(obj.name) : undefined,
        description: obj.description != null ? String(obj.description) : undefined,
        key: obj.key != null ? String(obj.key) : undefined,
        variantProperties,
        ...obj,
        // Ensure our normalized variantProperties takes precedence over raw spread
        ...(variantProperties ? { variantProperties } : {}),
      };
    }
}
