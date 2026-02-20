/**
 * ConsoleMCPClient — Interface for communicating with Figma Console MCP.
 *
 * Full implementation in Task 3. This file provides the type contract
 * that TokenSyncWorkflow depends on.
 *
 * @see Design: .kiro/specs/054a-figma-token-push/design.md
 * @requirements Req 4 (Token Sync Workflow)
 */

import type { FigmaVariable } from '../generators/transformers/FigmaTransformer';

/**
 * Client interface for Console MCP operations.
 *
 * Provides batch variable operations and Plugin API execution.
 * Concrete implementation will use @modelcontextprotocol/sdk (Task 3).
 */
/**
 * Payload for atomic design token setup via `figma_setup_design_tokens`.
 *
 * Creates collections, modes, and variables in a single call so the
 * Figma file is never left in a partially-initialised state.
 */
export interface DesignTokenSetupPayload {
  /** Variable collections to create (e.g. Primitives, Semantics). */
  collections: Array<{
    name: string;
    modes: string[];
    variables: FigmaVariable[];
  }>;
}

/**
 * Style data returned from the `figma_get_styles` MCP tool.
 */
export interface FigmaStyleData {
  /** Style name (e.g. "shadow.elevation200", "typography.heading200"). */
  name: string;
  /** Style type: EFFECT (shadows, blurs) or TEXT (typography). */
  type: 'EFFECT' | 'TEXT';
  /** Raw style properties from Figma. */
  properties: Record<string, unknown>;
}

export interface ConsoleMCPClient {
  /** Create up to 100 variables per call. */
  batchCreateVariables(
    collectionId: string,
    variables: FigmaVariable[],
    modesMap?: Record<string, string>,
  ): Promise<void>;

  /** Update up to 100 variables per call. */
  batchUpdateVariables(
    updates: { variableId: string; modeId: string; value: unknown }[],
  ): Promise<void>;

  /** Create Figma variable aliases linking semantic tokens to primitives. */
  createVariableAliases(
    fileKey: string,
    aliases: { semanticName: string; primitiveName: string }[],
  ): Promise<void>;

  /** Get current variable state from Figma. */
  getVariables(fileKey: string): Promise<FigmaVariable[]>;

  /** Execute Plugin API code in Figma (for styles). */
  execute(fileKey: string, code: string): Promise<unknown>;

  /**
   * Atomically create collections, modes, and variables in one call.
   *
   * Uses the `figma_setup_design_tokens` MCP tool to ensure the Figma
   * file is never left in a partially-initialised state.
   */
  setupDesignTokens(
    fileKey: string,
    payload: DesignTokenSetupPayload,
  ): Promise<void>;

  /**
   * Get Figma styles (effect and text) from a file.
   *
   * Calls the `figma_get_styles` MCP tool and returns style definitions
   * including shadows (effect styles) and typography (text styles).
   *
   * @param fileKey - The Figma file key.
   * @returns Array of style objects with name, type, and properties.
   */
  getStyles(fileKey: string): Promise<FigmaStyleData[]>;

  /**
   * Get a Figma component's reconstruction spec.
   *
   * Calls the `figma_get_component` MCP tool and returns component
   * metadata including name, description, variant properties, and structure.
   *
   * @param fileKey - The Figma file key.
   * @param nodeId - The node ID of the component.
   * @returns Component data including name, description, and variant properties.
   */
  getComponent(fileKey: string, nodeId: string): Promise<FigmaComponentData>;

  /**
   * Get Console MCP server status including transport availability.
   *
   * Calls the `figma_get_status` MCP tool and returns the raw status
   * object. Used by pre-flight checks to verify Desktop Bridge is running.
   */
  getStatus(): Promise<ConsoleMCPStatus>;
}

/**
 * Component data returned from the `figma_get_component` MCP tool.
 */
export interface FigmaComponentData {
  /** Component name. */
  name?: string;
  /** Component description. */
  description?: string;
  /** Component key. */
  key?: string;
  /** Variant properties and their possible values. */
  variantProperties?: Record<string, string[]>;
  /** Raw data from the MCP tool. */
  [key: string]: unknown;
}

/**
 * Status response from the `figma_get_status` MCP tool.
 */
export interface ConsoleMCPStatus {
  transport?: {
    websocket?: {
      available?: boolean;
      port?: number;
    };
  };
  [key: string]: unknown;
}
