/**
 * Document Full Models
 * 
 * Represents complete document content with metadata and token count.
 */

export interface DocumentFull {
  /** File path relative to project root */
  path: string;
  
  /** Complete markdown content */
  content: string;
  
  /** Document metadata */
  metadata: {
    purpose: string;
    layer: number;
    relevantTasks: string[];
    lastReviewed: string;
    organization: string;
    scope: string;
  };
  
  /** Token count for full document */
  tokenCount: number;
}
