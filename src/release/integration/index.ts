/**
 * Release Integration Module
 * 
 * Exports integration interfaces and implementations for
 * hook system, file organization, and AI collaboration.
 * 
 * Note: WorkflowEventDetector and WorkflowMonitor were removed as the automatic
 * TypeScript integration was disabled due to architectural issues. The system now
 * uses manual triggers via .kiro/hooks/release-manager.sh instead of automatic
 * event detection.
 */

// Interfaces
export * from './WorkflowIntegration';

// Implementations
export { HookIntegration } from './HookIntegration';
export { WorkflowPreservation } from './WorkflowPreservation';
export { AICollaborationManager } from './AICollaborationIntegration';
export { FileOrganizationManager } from './FileOrganizationIntegration';
export { CLIBridge } from './CLIBridge';
export { AnalysisResultParser, JSONParseError } from './AnalysisResultParser';
export { CLIErrorHandler, CLIError, CLIErrorCategory } from './CLIErrorHandler';
export { ReleaseAnalysisIntegration, AnalysisResultWrapper } from './ReleaseAnalysisIntegration';

// Re-export commonly used types
export type {
  HookConfig,
  HookExecutionContext,
  HookExecutionResult
} from './HookIntegration';

export type {
  WorkflowState,
  FallbackResult,
  TransparencyReport
} from './WorkflowPreservation';

export type {
  HookSystemIntegration,
  FileOrganizationIntegration,
  AICollaborationIntegration,
  TaskCompletionEvent,
  SpecCompletionEvent,
  FileOrganizationEvent,
  CommitHookEvent,
  OrganizationHookEvent,
  ReleaseSystemStatus,
  ReleaseProgress,
  AIErrorGuidance,
  DecisionContext
} from './WorkflowIntegration';

export type {
  CLIExecutionOptions,
  CLIExecutionResult
} from './CLIBridge';

export type {
  ValidationResult
} from './AnalysisResultParser';

export type {
  RetryStrategy,
  FallbackOptions
} from './CLIErrorHandler';

export type {
  IntegrationOptions,
  AnalysisQueryOptions
} from './ReleaseAnalysisIntegration';