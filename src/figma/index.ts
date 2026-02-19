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

export type { ConsoleMCPClient, ConsoleMCPStatus, DesignTokenSetupPayload } from './ConsoleMCPClient';
export { ConsoleMCPClientImpl } from './ConsoleMCPClientImpl';
export type { ConsoleMCPClientOptions } from './ConsoleMCPClientImpl';

export { checkDesktopBridge } from './preflight';
export type { PreflightResult } from './preflight';

export { formatDriftReport, formatPartialFailure, formatValue } from './error-reporting';
export type { PartialFailureInfo } from './error-reporting';
