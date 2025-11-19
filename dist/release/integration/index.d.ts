/**
 * Release Integration Module
 *
 * Exports all integration interfaces and implementations for
 * workflow, hook system, file organization, and AI collaboration
 */
export * from './WorkflowIntegration';
export { HookIntegrationManager } from './HookIntegration';
export { AICollaborationManager } from './AICollaborationIntegration';
export { FileOrganizationManager } from './FileOrganizationIntegration';
export { WorkflowEventDetector } from './WorkflowEventDetector';
export { WorkflowMonitor } from '../detection/WorkflowMonitor';
export type { HookSystemIntegration, FileOrganizationIntegration, AICollaborationIntegration, TaskCompletionEvent, SpecCompletionEvent, FileOrganizationEvent, CommitHookEvent, OrganizationHookEvent, ReleaseSystemStatus, ReleaseProgress, AIErrorGuidance, DecisionContext } from './WorkflowIntegration';
//# sourceMappingURL=index.d.ts.map