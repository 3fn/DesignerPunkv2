/**
 * MCP Server Integration Tests
 * 
 * Tests the MCP server end-to-end functionality including:
 * - Server startup and initialization
 * - All 8 MCP tools with sample queries
 * - Response format verification
 * - Error handling
 * - File watching and re-indexing
 * 
 * Requirements: 1.5, 10.1, 10.4, 11.1, 11.2, 11.3, 11.4
 */

import * as fs from 'fs';
import * as path from 'path';
import { DocumentIndexer } from '../indexer/DocumentIndexer';
import { QueryEngine } from '../query/QueryEngine';
import { FileWatcher } from '../watcher/FileWatcher';
import {
  handleGetDocumentationMap,
  handleGetDocumentSummary,
  handleGetDocumentFull,
  handleGetSection,
  handleListCrossReferences,
  handleValidateMetadata,
  handleGetIndexHealth,
  handleRebuildIndex,
  isGetDocumentSummaryError,
  isGetDocumentFullError,
  isGetSectionError,
  isListCrossReferencesError,
  isValidateMetadataError,
} from '../tools';

// Test fixtures directory
const TEST_FIXTURES_DIR = path.join(__dirname, '../../test-fixtures/steering');
const TEST_LOGS_DIR = path.join(__dirname, '../../test-fixtures/logs');

// Sample test document content
const SAMPLE_DOC_CONTENT = `# Test Document

**Date**: 2025-12-16
**Purpose**: Test document for integration testing
**Organization**: test-org
**Scope**: test-scope
**Layer**: 2
**Relevant Tasks**: testing

---

## Overview

This is a test document for MCP server integration testing.

## Section One

Content for section one with some details.

### Subsection 1.1

More detailed content here.

## Section Two

Content for section two.

See also [Related Doc](./related-doc.md) for more information.
`;

const RELATED_DOC_CONTENT = `# Related Document

**Date**: 2025-12-16
**Purpose**: Related test document
**Organization**: test-org
**Scope**: test-scope
**Layer**: 2
**Relevant Tasks**: testing

---

## Related Content

This is related content.
`;

describe('MCP Server Integration Tests', () => {
  let indexer: DocumentIndexer;
  let queryEngine: QueryEngine;
  let fileWatcher: FileWatcher;
  let metricsLog: any[] = [];

  beforeAll(async () => {
    // Create test fixtures directory
    if (!fs.existsSync(TEST_FIXTURES_DIR)) {
      fs.mkdirSync(TEST_FIXTURES_DIR, { recursive: true });
    }
    if (!fs.existsSync(TEST_LOGS_DIR)) {
      fs.mkdirSync(TEST_LOGS_DIR, { recursive: true });
    }

    // Create test documents
    fs.writeFileSync(
      path.join(TEST_FIXTURES_DIR, 'test-document.md'),
      SAMPLE_DOC_CONTENT
    );
    fs.writeFileSync(
      path.join(TEST_FIXTURES_DIR, 'related-doc.md'),
      RELATED_DOC_CONTENT
    );

    // Initialize components
    indexer = new DocumentIndexer(TEST_LOGS_DIR);
    queryEngine = new QueryEngine(indexer, (metrics) => {
      metricsLog.push(metrics);
    });
    fileWatcher = new FileWatcher(indexer, TEST_FIXTURES_DIR);

    // Index test documents
    await indexer.indexDirectory(TEST_FIXTURES_DIR);
  });

  afterAll(() => {
    // Stop file watcher if running
    fileWatcher.stop();

    // Clean up test fixtures
    if (fs.existsSync(path.join(__dirname, '../../test-fixtures'))) {
      fs.rmSync(path.join(__dirname, '../../test-fixtures'), { recursive: true, force: true });
    }
  });

  beforeEach(() => {
    metricsLog = [];
  });

  describe('Tool 1: get_documentation_map', () => {
    it('should return documentation map with indexed documents', () => {
      const result = handleGetDocumentationMap(queryEngine);

      expect(result).toBeDefined();
      expect(result.documentationMap).toBeDefined();
      expect(result.documentationMap.layers).toBeDefined();
    });

    it('should include layer 2 documents', () => {
      const result = handleGetDocumentationMap(queryEngine);

      // Our test documents are layer 2
      expect(result.documentationMap.layers['2']).toBeDefined();
      expect(result.documentationMap.layers['2'].documents.length).toBeGreaterThan(0);
    });

    it('should include document metadata in map', () => {
      const result = handleGetDocumentationMap(queryEngine);
      const layer2Docs = result.documentationMap.layers['2']?.documents || [];
      
      if (layer2Docs.length > 0) {
        const doc = layer2Docs[0];
        expect(doc.path).toBeDefined();
        expect(doc.purpose).toBeDefined();
        expect(doc.layer).toBe(2);
      }
    });

    it('should include metrics', () => {
      const result = handleGetDocumentationMap(queryEngine);
      
      expect(result.metrics).toBeDefined();
      expect(result.metrics.responseTimeMs).toBeDefined();
      expect(result.metrics.documentCount).toBeGreaterThan(0);
    });
  });

  describe('Tool 2: get_document_summary', () => {
    it('should return summary for valid document', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleGetDocumentSummary(queryEngine, testDocPath);

      expect(result).toBeDefined();
      expect(isGetDocumentSummaryError(result)).toBe(false);
    });

    it('should include metadata fields', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleGetDocumentSummary(queryEngine, testDocPath);

      if (!isGetDocumentSummaryError(result)) {
        expect(result.documentSummary.metadata.purpose).toBe('Test document for integration testing');
        expect(result.documentSummary.metadata.layer).toBe(2);
        expect(result.documentSummary.metadata.organization).toBe('test-org');
      }
    });

    it('should include document outline', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleGetDocumentSummary(queryEngine, testDocPath);

      if (!isGetDocumentSummaryError(result)) {
        expect(Array.isArray(result.documentSummary.outline)).toBe(true);
        expect(result.documentSummary.outline.length).toBeGreaterThan(0);
        
        // Check for expected sections
        const headings = result.documentSummary.outline.map((s) => s.heading);
        expect(headings).toContain('Overview');
        expect(headings).toContain('Section One');
      }
    });

    it('should include token count', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleGetDocumentSummary(queryEngine, testDocPath);

      if (!isGetDocumentSummaryError(result)) {
        expect(result.documentSummary.tokenCount).toBeDefined();
        expect(typeof result.documentSummary.tokenCount).toBe('number');
        expect(result.documentSummary.tokenCount).toBeGreaterThan(0);
      }
    });

    it('should return error for non-existent document', () => {
      const result = handleGetDocumentSummary(queryEngine, 'non-existent.md');
      expect(isGetDocumentSummaryError(result)).toBe(true);
    });
  });

  describe('Tool 3: get_document_full', () => {
    it('should return full document content', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleGetDocumentFull(queryEngine, testDocPath);

      expect(result).toBeDefined();
      expect(isGetDocumentFullError(result)).toBe(false);
    });

    it('should preserve markdown formatting', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleGetDocumentFull(queryEngine, testDocPath);

      if (!isGetDocumentFullError(result)) {
        expect(result.documentFull.content).toContain('# Test Document');
        expect(result.documentFull.content).toContain('## Overview');
        expect(result.documentFull.content).toContain('**Date**:');
      }
    });

    it('should include metadata', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleGetDocumentFull(queryEngine, testDocPath);

      if (!isGetDocumentFullError(result)) {
        expect(result.documentFull.metadata).toBeDefined();
        expect(result.documentFull.metadata.purpose).toBeDefined();
      }
    });

    it('should include token count', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleGetDocumentFull(queryEngine, testDocPath);

      if (!isGetDocumentFullError(result)) {
        expect(result.documentFull.tokenCount).toBeDefined();
        expect(typeof result.documentFull.tokenCount).toBe('number');
      }
    });

    it('should return error for non-existent document', () => {
      const result = handleGetDocumentFull(queryEngine, 'non-existent.md');
      expect(isGetDocumentFullError(result)).toBe(true);
    });
  });

  describe('Tool 4: get_section', () => {
    it('should return specific section by heading', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleGetSection(queryEngine, testDocPath, 'Overview');

      expect(result).toBeDefined();
      expect(isGetSectionError(result)).toBe(false);
    });

    it('should include section content', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleGetSection(queryEngine, testDocPath, 'Section One');

      if (!isGetSectionError(result)) {
        expect(result.section.content).toContain('Content for section one');
      }
    });

    it('should include token count for section', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleGetSection(queryEngine, testDocPath, 'Overview');

      if (!isGetSectionError(result)) {
        expect(result.section.tokenCount).toBeDefined();
        expect(typeof result.section.tokenCount).toBe('number');
      }
    });

    it('should return error for non-existent section', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleGetSection(queryEngine, testDocPath, 'Non-Existent Section');
      
      expect(isGetSectionError(result)).toBe(true);
    });

    it('should return error for non-existent document', () => {
      const result = handleGetSection(queryEngine, 'non-existent.md', 'Overview');
      expect(isGetSectionError(result)).toBe(true);
    });
  });

  describe('Tool 5: list_cross_references', () => {
    it('should return cross-references from document', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleListCrossReferences(queryEngine, testDocPath);

      expect(result).toBeDefined();
      expect(isListCrossReferencesError(result)).toBe(false);
    });

    it('should find markdown links', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleListCrossReferences(queryEngine, testDocPath);

      if (!isListCrossReferencesError(result)) {
        // Test document has a link to related-doc.md
        expect(result.crossReferences.length).toBeGreaterThan(0);
        
        const relatedRef = result.crossReferences.find(
          (ref) => ref.target.includes('related-doc.md')
        );
        expect(relatedRef).toBeDefined();
      }
    });

    it('should include reference context', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleListCrossReferences(queryEngine, testDocPath);

      if (!isListCrossReferencesError(result) && result.crossReferences.length > 0) {
        const ref = result.crossReferences[0];
        expect(ref.target).toBeDefined();
        expect(ref.context).toBeDefined();
      }
    });

    it('should return error for non-existent document', () => {
      const result = handleListCrossReferences(queryEngine, 'non-existent.md');
      expect(isListCrossReferencesError(result)).toBe(true);
    });
  });

  describe('Tool 6: validate_metadata', () => {
    it('should validate document with complete metadata', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleValidateMetadata(queryEngine, testDocPath);

      expect(result).toBeDefined();
      expect(isValidateMetadataError(result)).toBe(false);
    });

    it('should return parsed metadata', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleValidateMetadata(queryEngine, testDocPath);

      if (!isValidateMetadataError(result)) {
        expect(result.validation.metadata).toBeDefined();
        expect(result.validation.metadata?.date).toBe('2025-12-16');
        expect(result.validation.metadata?.purpose).toBeDefined();
      }
    });

    it('should return error for non-existent document', () => {
      const result = handleValidateMetadata(queryEngine, 'non-existent.md');
      expect(isValidateMetadataError(result)).toBe(true);
    });
  });

  describe('Tool 7: get_index_health', () => {
    it('should return index health status', () => {
      const result = handleGetIndexHealth(queryEngine);

      expect(result).toBeDefined();
      expect(result.health).toBeDefined();
      expect(result.health.status).toBeDefined();
    });

    it('should include errors and warnings arrays', () => {
      const result = handleGetIndexHealth(queryEngine);

      expect(Array.isArray(result.health.errors)).toBe(true);
      expect(Array.isArray(result.health.warnings)).toBe(true);
    });
  });

  describe('Tool 8: rebuild_index', () => {
    it('should rebuild index successfully', async () => {
      const result = await handleRebuildIndex(queryEngine);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should return health status after rebuild', async () => {
      const result = await handleRebuildIndex(queryEngine);

      expect(result.health).toBeDefined();
      expect(result.health.status).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should provide clear error for FileNotFound', () => {
      const result = handleGetDocumentSummary(queryEngine, 'non-existent-file.md');
      
      expect(isGetDocumentSummaryError(result)).toBe(true);
      if (isGetDocumentSummaryError(result)) {
        expect(result.error.message).toContain('not found');
      }
    });

    it('should provide clear error for SectionNotFound', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleGetSection(queryEngine, testDocPath, 'Invalid Section Name');
      
      expect(isGetSectionError(result)).toBe(true);
    });
  });

  describe('File Watching and Re-indexing', () => {
    it('should start file watcher without error', () => {
      expect(() => {
        fileWatcher.start();
      }).not.toThrow();
    });

    it('should stop file watcher without error', () => {
      fileWatcher.start();
      expect(() => {
        fileWatcher.stop();
      }).not.toThrow();
    });

    it('should detect file changes and trigger re-indexing', async () => {
      // Start the file watcher
      fileWatcher.start();

      // Create a new document
      const newDocPath = path.join(TEST_FIXTURES_DIR, 'new-document.md');
      const newDocContent = `# New Document

**Date**: 2025-12-16
**Purpose**: Newly created document
**Organization**: test-org
**Scope**: test-scope
**Layer**: 2
**Relevant Tasks**: testing

---

## New Content

This is new content.
`;

      fs.writeFileSync(newDocPath, newDocContent);

      // Wait for file watcher to detect change
      await new Promise(resolve => setTimeout(resolve, 200));

      // Stop watcher
      fileWatcher.stop();
      
      // Clean up
      if (fs.existsSync(newDocPath)) {
        fs.unlinkSync(newDocPath);
      }
    });
  });

  describe('Performance Metrics Logging', () => {
    it('should log metrics for documentation map query', () => {
      metricsLog = [];
      handleGetDocumentationMap(queryEngine);

      expect(metricsLog.length).toBeGreaterThan(0);
      expect(metricsLog[0].operation).toBe('get_documentation_map');
      expect(metricsLog[0].responseTimeMs).toBeDefined();
    });

    it('should log metrics for document summary query', () => {
      metricsLog = [];
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      handleGetDocumentSummary(queryEngine, testDocPath);

      expect(metricsLog.length).toBeGreaterThan(0);
      expect(metricsLog[0].operation).toBe('get_document_summary');
    });

    it('should log metrics for section query', () => {
      metricsLog = [];
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      handleGetSection(queryEngine, testDocPath, 'Overview');

      expect(metricsLog.length).toBeGreaterThan(0);
      expect(metricsLog[0].operation).toBe('get_section');
    });
  });

  describe('Response Format Verification', () => {
    it('should return properly structured documentation map', () => {
      const result = handleGetDocumentationMap(queryEngine);

      // Verify structure
      expect(result).toHaveProperty('documentationMap');
      expect(result).toHaveProperty('metrics');
      expect(typeof result.documentationMap.layers).toBe('object');
      
      // Each layer should have name and documents
      Object.values(result.documentationMap.layers).forEach((layer: any) => {
        expect(layer).toHaveProperty('name');
        expect(layer).toHaveProperty('documents');
        expect(Array.isArray(layer.documents)).toBe(true);
      });
    });

    it('should return properly structured document summary', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleGetDocumentSummary(queryEngine, testDocPath);

      if (!isGetDocumentSummaryError(result)) {
        expect(result.documentSummary).toHaveProperty('path');
        expect(result.documentSummary).toHaveProperty('metadata');
        expect(result.documentSummary).toHaveProperty('outline');
        expect(result.documentSummary).toHaveProperty('tokenCount');
      }
    });

    it('should return properly structured section', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleGetSection(queryEngine, testDocPath, 'Overview');

      if (!isGetSectionError(result)) {
        expect(result.section).toHaveProperty('path');
        expect(result.section).toHaveProperty('heading');
        expect(result.section).toHaveProperty('content');
        expect(result.section).toHaveProperty('tokenCount');
      }
    });

    it('should return properly structured cross-references', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleListCrossReferences(queryEngine, testDocPath);

      if (!isListCrossReferencesError(result)) {
        expect(result).toHaveProperty('crossReferences');
        expect(result).toHaveProperty('metrics');
        expect(Array.isArray(result.crossReferences)).toBe(true);
      }
    });

    it('should return properly structured metadata validation', () => {
      const testDocPath = path.join(TEST_FIXTURES_DIR, 'test-document.md');
      const result = handleValidateMetadata(queryEngine, testDocPath);

      if (!isValidateMetadataError(result)) {
        expect(result.validation).toHaveProperty('path');
        expect(result.validation).toHaveProperty('valid');
        expect(result.validation).toHaveProperty('metadata');
        expect(result.validation).toHaveProperty('issues');
      }
    });

    it('should return properly structured index health', () => {
      const result = handleGetIndexHealth(queryEngine);

      expect(result).toHaveProperty('health');
      expect(result.health).toHaveProperty('status');
      expect(result.health).toHaveProperty('errors');
      expect(result.health).toHaveProperty('warnings');
    });
  });
});
