/**
 * Release Detection Module
 * 
 * Exports all release detection components including the main ReleaseDetector,
 * CompletionAnalyzer for document parsing, and WorkflowMonitor for event detection.
 */

export { ReleaseDetector } from './ReleaseDetector';
export { CompletionAnalyzer } from './CompletionAnalyzer';
export { WorkflowMonitor } from './WorkflowMonitor';

export type {
  CompletionDocument,
  DocumentMetadata,
  AnalysisContext
} from './CompletionAnalyzer';

export type {
  WorkflowEvent,
  MonitoringOptions
} from './WorkflowMonitor';