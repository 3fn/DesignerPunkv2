/**
 * Release Integration Module
 * 
 * Exports all integration interfaces and implementations for
 * workflow, hook system, file organization, and AI collaboration
 */

// Interfaces
export * from './WorkflowIntegration';

// Implementations
export { HookIntegrationManager } from './HookIntegration';
export { AICollaborationManager } from './AICollaborationIntegration';
export { FileOrganizationManager } from './FileOrganizationIntegration';
export { WorkflowEventDetector } from './WorkflowEventDetector';
export { WorkflowMonitor } from '../detection/WorkflowMonitor';

// Re-export commonly used types
export type {
  WorkflowEventDetector,
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