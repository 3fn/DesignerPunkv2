/**
 * State type definitions for release analysis performance optimization
 * 
 * These types define the persistent state structure for tracking analyzed
 * completion documents and enabling append-only analysis optimization.
 */

/**
 * Persistent state tracking what has been analyzed
 * 
 * This state is persisted to `.kiro/release-state/analysis-state.json` and
 * enables the system to track which completion documents have already been
 * analyzed, allowing for O(m) append-only analysis where m = new documents.
 */
export interface AnalysisState {
  /** Git commit hash when analysis last completed successfully */
  lastAnalyzedCommit: string;
  
  /** Accumulated analysis results from all analyzed documents */
  accumulatedResults: DocumentAnalysisResult[];
  
  /** Timestamp of last successful analysis (ISO 8601 format) */
  lastAnalyzedAt: string;
  
  /** Version of state file format (for future migrations) */
  version: string;
}

/**
 * Analysis result for a single completion document
 * 
 * Represents the analyzed output from a single completion document,
 * including impact level and release note content.
 */
export interface DocumentAnalysisResult {
  /** Path to completion document relative to project root */
  filePath: string;
  
  /** Spec name extracted from path (e.g., "001-token-fix") */
  specName: string;
  
  /** Task number (e.g., "1", "2.3") */
  taskNumber: string;
  
  /** Impact level determining version bump (patch, minor, major) */
  impactLevel: 'patch' | 'minor' | 'major';
  
  /** Extracted content for release notes */
  releaseNoteContent: string;
  
  /** Commit hash when this document was analyzed */
  analyzedAtCommit: string;
}

/**
 * Performance metrics for tracking analysis performance
 * 
 * Tracks timing and document counts to verify optimization effectiveness
 * and detect performance regressions.
 */
export interface PerformanceMetrics {
  /** Total analysis duration in milliseconds */
  totalDuration: number;
  
  /** Number of new documents analyzed in this run */
  documentsAnalyzed: number;
  
  /** Number of documents skipped (already analyzed) */
  documentsSkipped: number;
  
  /** Total documents in accumulated results */
  totalDocuments: number;
  
  /** Time breakdown by phase (optional detailed metrics) */
  phaseTimings?: {
    /** Time to load state from disk (ms) */
    stateLoad: number;
    
    /** Time to detect new documents via git (ms) */
    documentDetection: number;
    
    /** Time to parse new documents (ms) */
    parsing: number;
    
    /** Time to analyze new documents (ms) */
    analysis: number;
    
    /** Time to generate release analysis (ms) */
    generation: number;
    
    /** Time to save state to disk (ms) */
    stateSave: number;
  };
}
