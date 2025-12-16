/**
 * QueryEngine - Request routing and response formatting for MCP Documentation Server
 * 
 * Responsibilities:
 * - Route incoming MCP tool calls to appropriate handlers
 * - Validate parameters (file paths, headings, task types)
 * - Format responses according to MCP protocol
 * - Handle errors and return clear messages
 * - Log performance metrics for all operations
 * 
 * Requirements: 1.1, 11.1, 11.2, 11.3, 11.4
 */

import { DocumentIndexer } from '../indexer/DocumentIndexer';
import {
  DocumentationMap,
  DocumentSummary,
  DocumentFull,
  Section,
  CrossReference,
  MetadataValidation,
  IndexHealth
} from '../models';

/**
 * Performance metrics for query operations
 */
export interface QueryMetrics {
  /** Operation type */
  operation: string;
  /** Response time in milliseconds */
  responseTimeMs: number;
  /** Additional timing data */
  timings?: Record<string, number>;
  /** Token counts if applicable */
  tokenCounts?: {
    summary?: number;
    section?: number;
    fullDocument?: number;
  };
}

/**
 * Query result wrapper with metrics
 */
export interface QueryResult<T> {
  /** Query result data */
  data: T;
  /** Performance metrics */
  metrics: QueryMetrics;
}

/**
 * Error response structure
 */
export interface QueryError {
  /** Error type */
  error: string;
  /** Error message */
  message: string;
  /** Suggestions for resolution */
  suggestions?: string[];
  /** Available options (e.g., available sections) */
  availableOptions?: string[];
}

/**
 * QueryEngine class - Routes requests and formats responses
 */
export class QueryEngine {
  private indexer: DocumentIndexer;
  private metricsLogger?: (metrics: QueryMetrics) => void;

  /**
   * Create a new QueryEngine
   * 
   * @param indexer - DocumentIndexer instance for data access
   * @param metricsLogger - Optional callback for logging metrics
   */
  constructor(indexer: DocumentIndexer, metricsLogger?: (metrics: QueryMetrics) => void) {
    this.indexer = indexer;
    this.metricsLogger = metricsLogger;
  }

  /**
   * Get complete documentation structure with metadata
   * 
   * @returns Documentation map with all layers and documents
   * Requirements: 1.1, 1.2, 11.1
   */
  getDocumentationMap(): QueryResult<DocumentationMap> {
    const startTime = Date.now();

    const data = this.indexer.getDocumentationMap();

    const metrics = this.createMetrics('get_documentation_map', startTime, {
      documentCount: this.countDocuments(data)
    });

    this.logMetrics(metrics);

    return { data, metrics };
  }

  /**
   * Get document summary with outline
   * 
   * @param path - Document path
   * @returns Document summary with metadata and outline
   * Requirements: 2.1, 2.2, 2.3, 2.4, 11.2
   */
  getDocumentSummary(path: string): QueryResult<DocumentSummary> {
    const startTime = Date.now();

    // Validate path parameter
    this.validatePath(path);

    const data = this.indexer.getDocumentSummary(path);

    const metrics = this.createMetrics('get_document_summary', startTime, {
      tokenCounts: {
        summary: this.estimateSummaryTokens(data),
        fullDocument: data.tokenCount
      }
    });

    this.logMetrics(metrics);

    return { data, metrics };
  }

  /**
   * Get complete document content
   * 
   * @param path - Document path
   * @returns Full document content with metadata
   * Requirements: 3.1, 3.2, 3.3, 11.3
   */
  getDocumentFull(path: string): QueryResult<DocumentFull> {
    const startTime = Date.now();

    // Validate path parameter
    this.validatePath(path);

    const data = this.indexer.getDocumentFull(path);

    const metrics = this.createMetrics('get_document_full', startTime, {
      tokenCounts: {
        fullDocument: data.tokenCount
      }
    });

    this.logMetrics(metrics);

    return { data, metrics };
  }

  /**
   * Get specific section by heading
   * 
   * @param path - Document path
   * @param heading - Section heading to retrieve
   * @returns Section content with parent context
   * Requirements: 4.1, 4.2, 4.3, 11.4
   */
  getSection(path: string, heading: string): QueryResult<Section> {
    const startTime = Date.now();

    // Validate parameters
    this.validatePath(path);
    this.validateHeading(heading);

    const data = this.indexer.getSection(path, heading);

    const metrics = this.createMetrics('get_section', startTime, {
      tokenCounts: {
        section: data.tokenCount
      }
    });

    this.logMetrics(metrics);

    return { data, metrics };
  }

  /**
   * List cross-references in a document
   * 
   * @param path - Document path
   * @returns Array of cross-references
   * Requirements: 5.1, 5.2, 5.3
   */
  listCrossReferences(path: string): QueryResult<CrossReference[]> {
    const startTime = Date.now();

    // Validate path parameter
    this.validatePath(path);

    const data = this.indexer.listCrossReferences(path);

    const metrics = this.createMetrics('list_cross_references', startTime, {
      referenceCount: data.length
    });

    this.logMetrics(metrics);

    return { data, metrics };
  }

  /**
   * Validate document metadata
   * 
   * @param path - Document path
   * @returns Metadata validation result
   * Requirements: 6.1, 6.2, 6.3
   */
  validateMetadata(path: string): QueryResult<MetadataValidation> {
    const startTime = Date.now();

    // Validate path parameter
    this.validatePath(path);

    const data = this.indexer.validateMetadata(path);

    const metrics = this.createMetrics('validate_metadata', startTime, {
      issueCount: data.issues.length,
      valid: data.valid
    });

    this.logMetrics(metrics);

    return { data, metrics };
  }

  /**
   * Get index health status
   * 
   * @returns Index health with status, errors, warnings, and metrics
   * Requirements: 9.1, 9.2, 9.5
   */
  getIndexHealth(): QueryResult<IndexHealth> {
    const startTime = Date.now();

    const data = this.indexer.getIndexHealth();

    const metrics = this.createMetrics('get_index_health', startTime, {
      status: data.status,
      documentsIndexed: data.documentsIndexed
    });

    this.logMetrics(metrics);

    return { data, metrics };
  }

  /**
   * Rebuild the index from scratch
   * 
   * @returns Index health after rebuild
   * Requirements: 9.1, 9.2, 9.5
   */
  async rebuildIndex(): Promise<QueryResult<IndexHealth>> {
    const startTime = Date.now();

    const data = await this.indexer.rebuildIndex();

    const metrics = this.createMetrics('rebuild_index', startTime, {
      status: data.status,
      documentsIndexed: data.documentsIndexed
    });

    this.logMetrics(metrics);

    return { data, metrics };
  }

  // ============================================
  // Parameter Validation Methods
  // ============================================

  /**
   * Validate file path parameter
   * 
   * @param path - Path to validate
   * @throws Error if path is invalid
   */
  private validatePath(path: string): void {
    if (!path || typeof path !== 'string') {
      throw this.createValidationError(
        'InvalidParameter',
        'Path parameter is required and must be a string',
        ['Provide a valid file path like ".kiro/steering/Component Development Guide.md"']
      );
    }

    if (path.trim() === '') {
      throw this.createValidationError(
        'InvalidParameter',
        'Path parameter cannot be empty',
        ['Provide a valid file path like ".kiro/steering/Component Development Guide.md"']
      );
    }

    // Check for path traversal attempts
    if (path.includes('..')) {
      throw this.createValidationError(
        'InvalidParameter',
        'Path parameter cannot contain ".." (path traversal)',
        ['Use absolute paths from project root']
      );
    }
  }

  /**
   * Validate heading parameter
   * 
   * @param heading - Heading to validate
   * @throws Error if heading is invalid
   */
  private validateHeading(heading: string): void {
    if (!heading || typeof heading !== 'string') {
      throw this.createValidationError(
        'InvalidParameter',
        'Heading parameter is required and must be a string',
        ['Provide a section heading like "Token Selection Decision Framework"']
      );
    }

    if (heading.trim() === '') {
      throw this.createValidationError(
        'InvalidParameter',
        'Heading parameter cannot be empty',
        ['Provide a section heading like "Token Selection Decision Framework"']
      );
    }
  }

  // ============================================
  // Error Handling Methods
  // ============================================

  /**
   * Create a validation error with suggestions
   * 
   * @param errorType - Error type identifier
   * @param message - Error message
   * @param suggestions - Suggestions for resolution
   * @returns Error object
   */
  private createValidationError(
    errorType: string,
    message: string,
    suggestions?: string[]
  ): Error {
    const error = new Error(message);
    (error as any).errorType = errorType;
    (error as any).suggestions = suggestions;
    return error;
  }

  /**
   * Format an error for response
   * 
   * @param error - Error to format
   * @returns Formatted error response
   */
  formatError(error: Error): QueryError {
    const errorType = (error as any).errorType || 'UnknownError';
    const suggestions = (error as any).suggestions || [];

    return {
      error: errorType,
      message: error.message,
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };
  }

  // ============================================
  // Metrics and Logging Methods
  // ============================================

  /**
   * Create performance metrics object
   * 
   * @param operation - Operation name
   * @param startTime - Start timestamp
   * @param additionalData - Additional metrics data
   * @returns QueryMetrics object
   */
  private createMetrics(
    operation: string,
    startTime: number,
    additionalData?: Record<string, any>
  ): QueryMetrics {
    const responseTimeMs = Date.now() - startTime;

    const metrics: QueryMetrics = {
      operation,
      responseTimeMs
    };

    if (additionalData?.tokenCounts) {
      metrics.tokenCounts = additionalData.tokenCounts;
    }

    if (additionalData?.timings) {
      metrics.timings = additionalData.timings;
    }

    return metrics;
  }

  /**
   * Log metrics using the configured logger
   * 
   * @param metrics - Metrics to log
   */
  private logMetrics(metrics: QueryMetrics): void {
    if (this.metricsLogger) {
      this.metricsLogger(metrics);
    }
  }

  /**
   * Count total documents in documentation map
   * 
   * @param map - Documentation map
   * @returns Total document count
   */
  private countDocuments(map: DocumentationMap): number {
    let count = 0;
    for (const layer of Object.values(map.layers)) {
      count += layer.documents.length;
    }
    return count;
  }

  /**
   * Estimate token count for a summary
   * 
   * @param summary - Document summary
   * @returns Estimated token count
   */
  private estimateSummaryTokens(summary: DocumentSummary): number {
    // Rough estimation: metadata + outline + cross-references
    // Each field contributes approximately:
    // - metadata: ~50 tokens
    // - outline: ~10 tokens per section
    // - cross-references: ~15 tokens per reference
    const metadataTokens = 50;
    const outlineTokens = summary.outline.length * 10;
    const crossRefTokens = summary.crossReferences.length * 15;

    return metadataTokens + outlineTokens + crossRefTokens;
  }
}
