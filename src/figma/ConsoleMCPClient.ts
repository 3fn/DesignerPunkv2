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

export interface ConsoleMCPClient {
  /** Create up to 100 variables per call. */
  batchCreateVariables(
    fileKey: string,
    variables: FigmaVariable[],
  ): Promise<void>;

  /** Update up to 100 variables per call. */
  batchUpdateVariables(
    fileKey: string,
    variables: FigmaVariable[],
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
   * Get Console MCP server status including transport availability.
   *
   * Calls the `figma_get_status` MCP tool and returns the raw status
   * object. Used by pre-flight checks to verify Desktop Bridge is running.
   */
  getStatus(): Promise<ConsoleMCPStatus>;
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
