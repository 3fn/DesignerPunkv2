/**
 * Release Detection Module
 * 
 * Exports release detection components including the main ReleaseDetector
 * and CompletionAnalyzer for document parsing.
 * 
 * Note: WorkflowMonitor was removed as the automatic TypeScript integration
 * was disabled due to architectural issues (unclearable setInterval timers).
 * The system now uses manual triggers via .kiro/hooks/release-manager.sh
 */

export { ReleaseDetector } from './ReleaseDetector';
export { CompletionAnalyzer } from './CompletionAnalyzer';

export type {
  CompletionDocument,
  DocumentMetadata,
  AnalysisContext
} from './CompletionAnalyzer';