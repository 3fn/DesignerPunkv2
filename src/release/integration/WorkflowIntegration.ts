/**
 * Workflow Integration Interfaces
 * 
 * Defines interfaces for integrating release management with existing
 * workflow systems including hooks, file organization, and AI collaboration
 */

import { ReleaseSignal, ReleaseTrigger, ValidationResult } from '../types/ReleaseTypes';

/**
 * Workflow Event Detection Interface
 * 
 * Monitors workflow events and detects release triggers from
 * task and spec completion events
 */
export interface WorkflowEventDetector {
  /**
   * Monitor for task completion events
   */
  monitorTaskCompletion(callback: (event: TaskCompletionEvent) => void): void;
  
  /**
   * Monitor for spec completion events
   */
  monitorSpecCompletion(callback: (event: SpecCompletionEvent) => void): void;
  
  /**
   * Monitor for file organization events
   */
  monitorFileOrganization(callback: (event: FileOrganizationEvent) => void): void;
  
  /**
   * Stop monitoring workflow events
   */
  stopMonitoring(): void;
  
  /**
   * Get current monitoring status
   */
  getMonitoringStatus(): MonitoringStatus;
}

/**
 * Hook System Integration Interface
 * 
 * Integrates with existing commit and organization hooks
 */
export interface HookSystemIntegration {
  /**
   * Register release detection with commit hooks
   */
  registerWithCommitHooks(): Promise<boolean>;
  
  /**
   * Register release detection with organization hooks
   */
  registerWithOrganizationHooks(): Promise<boolean>;
  
  /**
   * Process commit hook event for release detection
   */
  processCommitHookEvent(event: CommitHookEvent): Promise<ReleaseSignal | null>;
  
  /**
   * Process organization hook event for release detection
   */
  processOrganizationHookEvent(event: OrganizationHookEvent): Promise<ReleaseSignal | null>;
  
  /**
   * Validate hook integration status
   */
  validateHookIntegration(): Promise<ValidationResult>;
}

/**
 * File Organization Integration Interface
 * 
 * Coordinates with file organization system to ensure release
 * artifacts are properly placed and cross-references maintained
 */
export interface FileOrganizationIntegration {
  /**
   * Coordinate with file organization during release
   */
  coordinateFileOrganization(releaseArtifacts: ReleaseArtifact[]): Promise<OrganizationResult>;
  
  /**
   * Validate file organization for release readiness
   */
  validateOrganizationForRelease(specPath: string): Promise<ValidationResult>;
  
  /**
   * Update cross-references after release artifact creation
   */
  updateCrossReferences(artifacts: ReleaseArtifact[]): Promise<CrossReferenceResult>;
  
  /**
   * Ensure completion documents are properly organized
   */
  organizeCompletionDocuments(completionDocs: CompletionDocument[]): Promise<OrganizationResult>;
}

/**
 * AI Collaboration Integration Interface
 * 
 * Provides clear interfaces for AI agents to interact with
 * the release system and report status/progress
 */
export interface AICollaborationIntegration {
  /**
   * Get release system status for AI agents
   */
  getReleaseSystemStatus(): Promise<ReleaseSystemStatus>;
  
  /**
   * Report release progress to AI collaboration framework
   */
  reportReleaseProgress(progress: ReleaseProgress): Promise<void>;
  
  /**
   * Get AI-friendly error messages and guidance
   */
  getAIFriendlyErrorGuidance(error: ReleaseError): Promise<AIErrorGuidance>;
  
  /**
   * Validate AI agent permissions for release operations
   */
  validateAIPermissions(operation: ReleaseOperation): Promise<PermissionResult>;
  
  /**
   * Get release decision context for AI agents
   */
  getReleaseDecisionContext(signal: ReleaseSignal): Promise<DecisionContext>;
}

// Event Types

export interface TaskCompletionEvent {
  /** Task file path */
  taskFile: string;
  
  /** Completed task name */
  taskName: string;
  
  /** Spec name */
  specName: string;
  
  /** Completion timestamp */
  completedAt: Date;
  
  /** Git commit hash if available */
  gitCommit?: string;
  
  /** Completion artifacts */
  artifacts: string[];
}

export interface SpecCompletionEvent {
  /** Spec directory path */
  specPath: string;
  
  /** Spec name */
  specName: string;
  
  /** Completion document path */
  completionDocument: string;
  
  /** Completion timestamp */
  completedAt: Date;
  
  /** Git commit hash if available */
  gitCommit?: string;
  
  /** Completion artifacts */
  artifacts: string[];
}

export interface FileOrganizationEvent {
  /** Files that were organized */
  organizedFiles: OrganizedFile[];
  
  /** Organization timestamp */
  organizedAt: Date;
  
  /** Organization type */
  organizationType: 'task-completion' | 'spec-completion' | 'manual';
  
  /** Git commit hash if available */
  gitCommit?: string;
}

export interface CommitHookEvent {
  /** Commit message */
  message: string;
  
  /** Commit hash */
  hash: string;
  
  /** Changed files */
  changedFiles: string[];
  
  /** Commit timestamp */
  timestamp: Date;
  
  /** Branch name */
  branch: string;
}

export interface OrganizationHookEvent {
  /** Files that were organized */
  organizedFiles: OrganizedFile[];
  
  /** Organization metadata */
  organizationMetadata: OrganizationMetadata[];
  
  /** Organization timestamp */
  timestamp: Date;
  
  /** Trigger type */
  trigger: 'task-completion' | 'spec-completion' | 'manual';
}

// Supporting Types

export interface MonitoringStatus {
  /** Whether monitoring is active */
  active: boolean;
  
  /** Monitored event types */
  monitoredEvents: string[];
  
  /** Last event timestamp */
  lastEventAt?: Date;
  
  /** Monitoring errors */
  errors: string[];
}

export interface ReleaseArtifact {
  /** Artifact file path */
  path: string;
  
  /** Artifact type */
  type: 'release-notes' | 'completion-document' | 'package-json' | 'changelog' | 'other';
  
  /** Target organization location */
  targetLocation?: string;
  
  /** Organization metadata */
  organizationMetadata?: OrganizationMetadata;
}

export interface OrganizationResult {
  /** Whether organization was successful */
  success: boolean;
  
  /** Files that were organized */
  organizedFiles: OrganizedFile[];
  
  /** Cross-references that were updated */
  updatedReferences: CrossReference[];
  
  /** Organization errors */
  errors: OrganizationError[];
}

export interface OrganizedFile {
  /** Original file path */
  originalPath: string;
  
  /** New file path */
  newPath: string;
  
  /** Organization metadata */
  metadata: OrganizationMetadata;
  
  /** Organization timestamp */
  organizedAt: Date;
}

export interface OrganizationMetadata {
  /** Organization type */
  organization: 'framework-strategic' | 'spec-validation' | 'spec-completion' | 'process-standard' | 'working-document';
  
  /** Organization scope */
  scope: string;
  
  /** File purpose */
  purpose: string;
  
  /** Additional metadata */
  additionalMetadata?: Record<string, string>;
}

export interface CrossReferenceResult {
  /** Whether cross-reference update was successful */
  success: boolean;
  
  /** References that were updated */
  updatedReferences: CrossReference[];
  
  /** Update errors */
  errors: CrossReferenceError[];
}

export interface CrossReference {
  /** Source file containing the reference */
  sourceFile: string;
  
  /** Target file being referenced */
  targetFile: string;
  
  /** Original reference text */
  originalReference: string;
  
  /** Updated reference text */
  updatedReference: string;
  
  /** Line number in source file */
  lineNumber: number;
}

export interface CompletionDocument {
  /** Document file path */
  path: string;
  
  /** Document type */
  type: 'task-completion' | 'spec-completion';
  
  /** Associated spec */
  spec: string;
  
  /** Associated task (if task completion) */
  task?: string;
  
  /** Document metadata */
  metadata: OrganizationMetadata;
}

export interface ReleaseSystemStatus {
  /** System operational status */
  operational: boolean;
  
  /** Active releases */
  activeReleases: string[];
  
  /** Pending release triggers */
  pendingTriggers: ReleaseTrigger[];
  
  /** System configuration status */
  configurationValid: boolean;
  
  /** Integration status */
  integrationStatus: IntegrationStatus;
  
  /** Last activity timestamp */
  lastActivityAt?: Date;
}

export interface IntegrationStatus {
  /** Hook system integration status */
  hookSystem: boolean;
  
  /** File organization integration status */
  fileOrganization: boolean;
  
  /** AI collaboration integration status */
  aiCollaboration: boolean;
  
  /** GitHub integration status */
  github: boolean;
  
  /** npm integration status */
  npm: boolean;
}

export interface ReleaseProgress {
  /** Release identifier */
  releaseId: string;
  
  /** Current step */
  currentStep: string;
  
  /** Progress percentage (0-100) */
  progress: number;
  
  /** Step details */
  stepDetails: string;
  
  /** Estimated completion time */
  estimatedCompletion?: Date;
  
  /** Progress timestamp */
  timestamp: Date;
}

export interface ReleaseError {
  /** Error code */
  code: string;
  
  /** Error message */
  message: string;
  
  /** Error severity */
  severity: 'error' | 'warning' | 'info';
  
  /** Error context */
  context?: string;
  
  /** Stack trace */
  stackTrace?: string;
}

export interface AIErrorGuidance {
  /** Human-readable error explanation */
  explanation: string;
  
  /** Suggested actions for AI agents */
  suggestedActions: string[];
  
  /** Recovery strategies */
  recoveryStrategies: string[];
  
  /** Whether human intervention is required */
  requiresHumanIntervention: boolean;
  
  /** Related documentation links */
  documentationLinks: string[];
}

export interface PermissionResult {
  /** Whether operation is permitted */
  permitted: boolean;
  
  /** Permission level */
  level: 'read' | 'write' | 'admin';
  
  /** Restrictions if any */
  restrictions: string[];
  
  /** Required approvals */
  requiredApprovals: string[];
}

export interface ReleaseOperation {
  /** Operation type */
  type: 'detect' | 'validate' | 'execute' | 'rollback' | 'status';
  
  /** Operation scope */
  scope: string;
  
  /** Operation parameters */
  parameters: Record<string, any>;
}

export interface DecisionContext {
  /** Release signal information */
  signal: ReleaseSignal;
  
  /** Supporting evidence */
  evidence: Evidence[];
  
  /** Decision factors */
  factors: DecisionFactor[];
  
  /** Confidence metrics */
  confidence: ConfidenceMetrics;
  
  /** Alternative options */
  alternatives: Alternative[];
}

export interface Evidence {
  /** Evidence type */
  type: 'completion-document' | 'git-commit' | 'file-change' | 'metadata';
  
  /** Evidence source */
  source: string;
  
  /** Evidence content */
  content: string;
  
  /** Evidence weight */
  weight: number;
}

export interface DecisionFactor {
  /** Factor name */
  name: string;
  
  /** Factor value */
  value: string | number | boolean;
  
  /** Factor importance */
  importance: 'low' | 'medium' | 'high' | 'critical';
  
  /** Factor explanation */
  explanation: string;
}

export interface ConfidenceMetrics {
  /** Overall confidence score (0-1) */
  overall: number;
  
  /** Evidence quality score (0-1) */
  evidenceQuality: number;
  
  /** Decision consistency score (0-1) */
  consistency: number;
  
  /** Risk assessment score (0-1) */
  riskAssessment: number;
}

export interface Alternative {
  /** Alternative option */
  option: string;
  
  /** Option description */
  description: string;
  
  /** Option pros */
  pros: string[];
  
  /** Option cons */
  cons: string[];
  
  /** Option confidence */
  confidence: number;
}

export interface OrganizationError {
  /** Error code */
  code: string;
  
  /** Error message */
  message: string;
  
  /** Affected file */
  file: string;
  
  /** Error details */
  details?: string;
}

export interface CrossReferenceError {
  /** Error code */
  code: string;
  
  /** Error message */
  message: string;
  
  /** Source file */
  sourceFile: string;
  
  /** Target file */
  targetFile: string;
  
  /** Error details */
  details?: string;
}