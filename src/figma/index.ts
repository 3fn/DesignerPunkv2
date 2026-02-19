/**
 * Figma integration module.
 *
 * Provides token sync workflow, Console MCP client interface,
 * and pre-flight checks for pushing tokens to Figma.
 */

export { TokenSyncWorkflow, BATCH_SIZE } from './TokenSyncWorkflow';
export type {
  SyncOptions,
  SyncResult,
  SyncError,
  DriftReport,
  DriftedVariable,
  VariableSyncResult,
  StyleSyncResult,
} from './TokenSyncWorkflow';

export type { ConsoleMCPClient, DesignTokenSetupPayload } from './ConsoleMCPClient';
export { ConsoleMCPClientImpl } from './ConsoleMCPClientImpl';
export type { ConsoleMCPClientOptions } from './ConsoleMCPClientImpl';
