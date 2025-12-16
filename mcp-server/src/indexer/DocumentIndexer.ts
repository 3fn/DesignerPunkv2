import * as fs from 'fs';
import * as path from 'path';
import { extractMetadata } from './metadata-parser';
import { extractHeadingStructure } from './heading-parser';
import { extractSection } from './section-parser';
import { extractCrossReferences } from './cross-ref-parser';
import { estimateTokenCount } from '../utils/token-estimator';
import { determineIndexHealth } from './index-health';
import {
  DocumentationMap,
  DocumentMetadata,
  DocumentSummary,
  DocumentFull,
  Section,
  CrossReference,
  MetadataValidation,
  ValidationIssue,
  IndexHealth
} from '../models';

/**
 * DocumentIndexer - Core indexing class for MCP Documentation Server
 * 
 * Responsibilities:
 * - Index all markdown files in a directory
 * - Extract metadata, headings, sections, and cross-references mechanically
 * - Maintain in-memory index for fast queries
 * - Support re-indexing of individual files
 * 
 * Uses mechanical parsing (regex/parsing) to extract structure without
 * interpreting content, preventing context load loops.
 */
export class DocumentIndexer {
  private documentMap: Map<string, DocumentMetadata> = new Map();
  private documentContent: Map<string, string> = new Map();
  private lastIndexTime: string | undefined;
  private directoryPath: string | undefined;
  private logsDirectory: string;

  /**
   * Create a new DocumentIndexer
   * 
   * @param logsDirectory - Directory for log files (default: 'logs')
   */
  constructor(logsDirectory: string = 'logs') {
    this.logsDirectory = logsDirectory;
  }

  /**
   * Index all documentation files in the specified directory
   * Uses mechanical parsing to extract structure without interpreting content
   * 
   * @param directoryPath - Path to directory containing markdown files
   */
  async indexDirectory(directoryPath: string): Promise<void> {
    // Verify directory exists
    if (!fs.existsSync(directoryPath)) {
      throw new Error(`Directory not found: ${directoryPath}`);
    }

    // Store directory path for later use
    this.directoryPath = directoryPath;

    // Log state change
    this.logIndexStateChange('indexing_started', { directoryPath });

    // Clear existing index
    this.documentMap.clear();
    this.documentContent.clear();

    // Scan directory for markdown files
    const files = this.scanDirectory(directoryPath);

    // Index each file
    for (const filePath of files) {
      await this.indexFile(filePath);
    }

    // Update last index time
    this.lastIndexTime = new Date().toISOString();

    // Log state change
    this.logIndexStateChange('indexing_completed', { 
      directoryPath, 
      documentsIndexed: this.documentMap.size 
    });
  }

  /**
   * Re-index a specific file after changes detected
   * Updates index structures without full re-scan
   * 
   * @param filePath - Path to file to re-index
   */
  async reindexFile(filePath: string): Promise<void> {
    // Verify file exists
    if (!fs.existsSync(filePath)) {
      // File was deleted - remove from index
      this.documentMap.delete(filePath);
      this.documentContent.delete(filePath);
      return;
    }

    // Re-index the file
    await this.indexFile(filePath);
  }

  /**
   * Get the complete documentation map (4-layer structure)
   * Returns metadata for all indexed documents
   */
  getDocumentationMap(): DocumentationMap {
    const layers: DocumentationMap['layers'] = {
      '0': { name: 'Meta-Guide', documents: [] },
      '1': { name: 'Foundation', documents: [] },
      '2': { name: 'Frameworks and Patterns', documents: [] },
      '3': { name: 'Specific Implementations', documents: [] }
    };

    // Group documents by layer
    for (const metadata of this.documentMap.values()) {
      const layerKey = metadata.layer.toString();
      if (layers[layerKey]) {
        layers[layerKey].documents.push(metadata);
      }
    }

    return { layers };
  }

  /**
   * Get summary for a specific document
   * Returns metadata + outline (~200 tokens)
   * 
   * @param filePath - Path to document
   */
  getDocumentSummary(filePath: string): DocumentSummary {
    const content = this.getDocumentContent(filePath);
    const metadata = extractMetadata(content);

    // Extract heading structure
    const outline = extractHeadingStructure(content);

    // Extract cross-references
    const crossReferences = extractCrossReferences(content, filePath);

    // Convert CrossReference[] to CrossReferenceInfo[]
    const crossReferenceInfo = crossReferences.map(ref => ({
      target: ref.target,
      context: ref.context,
      section: ref.section
    }));

    // Estimate token count for full document
    const tokenCount = estimateTokenCount(content);

    return {
      path: filePath,
      metadata: {
        purpose: metadata.purpose,
        layer: metadata.layer,
        relevantTasks: metadata.relevantTasks,
        lastReviewed: metadata.lastReviewed || '',
        organization: metadata.organization || '',
        scope: metadata.scope || ''
      },
      outline,
      crossReferences: crossReferenceInfo,
      tokenCount
    };
  }

  /**
   * Get full content for a specific document
   * Returns complete markdown content
   * 
   * @param filePath - Path to document
   */
  getDocumentFull(filePath: string): DocumentFull {
    const content = this.getDocumentContent(filePath);
    const metadata = extractMetadata(content);
    const tokenCount = estimateTokenCount(content);

    return {
      path: filePath,
      content,
      metadata: {
        purpose: metadata.purpose,
        layer: metadata.layer,
        relevantTasks: metadata.relevantTasks,
        lastReviewed: metadata.lastReviewed || '',
        organization: metadata.organization || '',
        scope: metadata.scope || ''
      },
      tokenCount
    };
  }

  /**
   * Get specific section by heading
   * Returns section content with parent context
   * 
   * @param filePath - Path to document
   * @param heading - Section heading to retrieve
   */
  getSection(filePath: string, heading: string): Section {
    const content = this.getDocumentContent(filePath);
    const section = extractSection(content, heading, filePath);

    if (!section) {
      // Section not found - provide helpful error with available sections
      const outline = extractHeadingStructure(content);
      const availableSections = outline.map(s => s.heading);
      throw new Error(
        `Section "${heading}" not found in ${filePath}. ` +
        `Available sections: ${availableSections.join(', ')}`
      );
    }

    return {
      path: filePath,
      heading: section.heading,
      content: section.content,
      parentHeadings: section.parentHeadings,
      tokenCount: section.tokenCount
    };
  }

  /**
   * List cross-references in a document
   * Returns links without following them
   * 
   * @param filePath - Path to document
   */
  listCrossReferences(filePath: string): CrossReference[] {
    const content = this.getDocumentContent(filePath);
    return extractCrossReferences(content, filePath);
  }

  /**
   * Validate metadata for a document
   * Returns validation results with issues
   * 
   * @param filePath - Path to document
   */
  validateMetadata(filePath: string): MetadataValidation {
    const content = this.getDocumentContent(filePath);
    const metadata = extractMetadata(content);

    const issues: ValidationIssue[] = [];

    // Check required fields
    const requiredFields = ['purpose', 'layer', 'relevantTasks', 'lastReviewed', 'organization', 'scope'];
    
    for (const field of requiredFields) {
      const value = metadata[field as keyof typeof metadata];
      
      if (value === undefined || value === null || value === '') {
        issues.push({
          field,
          issue: 'Missing required field',
          severity: 'error'
        });
      } else if (field === 'layer') {
        const layer = metadata.layer;
        if (layer < 0 || layer > 3) {
          issues.push({
            field: 'layer',
            issue: `Invalid layer value: ${layer}. Must be 0-3`,
            severity: 'error'
          });
        }
      } else if (field === 'relevantTasks' && Array.isArray(value) && value.length === 0) {
        issues.push({
          field: 'relevantTasks',
          issue: 'Empty relevantTasks array',
          severity: 'warning'
        });
      }
    }

    return {
      path: filePath,
      valid: issues.filter(i => i.severity === 'error').length === 0,
      metadata: metadata as Record<string, any>,
      issues
    };
  }

  /**
   * Scan directory recursively for markdown files
   * 
   * @param dirPath - Directory to scan
   * @returns Array of file paths
   */
  private scanDirectory(dirPath: string): string[] {
    const files: string[] = [];

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        files.push(...this.scanDirectory(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Index a single file
   * 
   * @param filePath - Path to file to index
   */
  private async indexFile(filePath: string): Promise<void> {
    // Read file content
    const content = fs.readFileSync(filePath, 'utf-8');

    // Store content for later retrieval
    this.documentContent.set(filePath, content);

    // Extract metadata
    const metadata = extractMetadata(content);

    // Extract heading structure for section list
    const outline = extractHeadingStructure(content);
    const sections = outline.map(s => s.heading);

    // Estimate token count
    const tokenCount = estimateTokenCount(content);

    // Store metadata in index
    const documentMetadata: DocumentMetadata = {
      path: filePath,
      purpose: metadata.purpose,
      layer: metadata.layer,
      relevantTasks: metadata.relevantTasks,
      lastReviewed: metadata.lastReviewed || '',
      sections,
      tokenCount
    };

    this.documentMap.set(filePath, documentMetadata);
  }

  /**
   * Get document content from index
   * 
   * @param filePath - Path to document
   * @returns Document content
   */
  private getDocumentContent(filePath: string): string {
    const content = this.documentContent.get(filePath);
    
    if (!content) {
      // Provide helpful error with available documents
      const availableDocs = Array.from(this.documentMap.keys());
      throw new Error(
        `Document not found: ${filePath}. ` +
        `Available documents: ${availableDocs.join(', ')}`
      );
    }

    return content;
  }

  /**
   * Validate index integrity on startup
   * Checks for missing documents, stale index, and malformed metadata
   * 
   * @returns IndexHealth with status, errors, warnings, and metrics
   * Requirements: 9.1, 9.2, 9.5
   */
  validateIndexOnStartup(): IndexHealth {
    this.logIndexStateChange('validation_started', {});

    // If no directory path set, index is empty/not initialized
    if (!this.directoryPath) {
      const health: IndexHealth = {
        status: 'failed',
        documentsIndexed: 0,
        lastIndexTime: new Date().toISOString(),
        errors: ['Index not initialized: no directory path set'],
        warnings: [],
        metrics: {
          totalDocuments: 0,
          totalSections: 0,
          totalCrossReferences: 0,
          indexSizeBytes: 0
        }
      };
      this.logIndexStateChange('validation_completed', { status: health.status, errors: health.errors });
      return health;
    }

    // Use determineIndexHealth for comprehensive health check
    const health = determineIndexHealth({
      indexedDocuments: this.documentContent,
      directoryPath: this.directoryPath,
      lastIndexTime: this.lastIndexTime
    });

    this.logIndexStateChange('validation_completed', { 
      status: health.status, 
      errors: health.errors,
      warnings: health.warnings
    });

    return health;
  }

  /**
   * Rebuild the index from scratch
   * Used for manual recovery when index corruption is detected
   * 
   * @returns IndexHealth after rebuild
   * Requirements: 9.1, 9.2, 9.5
   */
  async rebuildIndex(): Promise<IndexHealth> {
    this.logIndexStateChange('rebuild_started', {});

    // If no directory path set, cannot rebuild
    if (!this.directoryPath) {
      const health: IndexHealth = {
        status: 'failed',
        documentsIndexed: 0,
        lastIndexTime: new Date().toISOString(),
        errors: ['Cannot rebuild: no directory path set. Call indexDirectory() first.'],
        warnings: [],
        metrics: {
          totalDocuments: 0,
          totalSections: 0,
          totalCrossReferences: 0,
          indexSizeBytes: 0
        }
      };
      this.logIndexStateChange('rebuild_failed', { error: health.errors[0] });
      return health;
    }

    try {
      // Re-index the directory
      await this.indexDirectory(this.directoryPath);

      // Validate the rebuilt index
      const health = this.validateIndexOnStartup();

      this.logIndexStateChange('rebuild_completed', { 
        status: health.status,
        documentsIndexed: health.documentsIndexed
      });

      return health;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const health: IndexHealth = {
        status: 'failed',
        documentsIndexed: this.documentMap.size,
        lastIndexTime: this.lastIndexTime || new Date().toISOString(),
        errors: [`Rebuild failed: ${errorMessage}`],
        warnings: [],
        metrics: {
          totalDocuments: this.documentMap.size,
          totalSections: 0,
          totalCrossReferences: 0,
          indexSizeBytes: 0
        }
      };
      this.logIndexStateChange('rebuild_failed', { error: errorMessage });
      return health;
    }
  }

  /**
   * Log index state changes to logs/index-state.log
   * Provides state tracking for debugging and monitoring
   * 
   * @param event - Event type (e.g., 'indexing_started', 'validation_completed')
   * @param details - Additional details about the event
   * Requirements: 9.5
   */
  logIndexStateChange(event: string, details: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      event,
      ...details
    };

    const logLine = JSON.stringify(logEntry) + '\n';

    // Ensure logs directory exists
    if (!fs.existsSync(this.logsDirectory)) {
      fs.mkdirSync(this.logsDirectory, { recursive: true });
    }

    const logPath = path.join(this.logsDirectory, 'index-state.log');
    
    // Append to log file
    fs.appendFileSync(logPath, logLine, 'utf-8');
  }

  /**
   * Get the current index health status
   * Convenience method that calls validateIndexOnStartup
   * 
   * @returns IndexHealth
   */
  getIndexHealth(): IndexHealth {
    return this.validateIndexOnStartup();
  }
}
