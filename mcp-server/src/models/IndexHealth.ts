/**
 * Index Health Model
 * 
 * Data structures for index health check results.
 * Used by the index health check system to report status,
 * errors, warnings, and metrics.
 */

/**
 * Index health status
 */
export type IndexHealthStatus = 'healthy' | 'degraded' | 'failed';

/**
 * Index health metrics
 */
export interface IndexHealthMetrics {
  /** Total number of documents in the index */
  totalDocuments: number;
  /** Total number of sections across all documents */
  totalSections: number;
  /** Total number of cross-references across all documents */
  totalCrossReferences: number;
  /** Total size of indexed content in bytes */
  indexSizeBytes: number;
}

/**
 * Index health check result
 */
export interface IndexHealth {
  /** Overall health status */
  status: IndexHealthStatus;
  /** Number of documents currently indexed */
  documentsIndexed: number;
  /** ISO timestamp of last index operation */
  lastIndexTime: string;
  /** Critical errors that indicate index failure */
  errors: string[];
  /** Non-critical warnings that indicate degraded state */
  warnings: string[];
  /** Index metrics */
  metrics: IndexHealthMetrics;
}
