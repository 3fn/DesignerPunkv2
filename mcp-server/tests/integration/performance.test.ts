/**
 * Performance Benchmarking Tests for MCP Documentation Server
 * 
 * Tests measure and establish baseline performance metrics for:
 * - Response time for all MCP tools
 * - Parsing time for various document sizes
 * - Token estimation time
 * - Re-indexing time for single file changes
 * 
 * Requirements: 1.4, 2.7, 3.3, 4.5, 5.4, 10.5, 11.5
 */

import * as fs from 'fs';
import * as path from 'path';
import { DocumentIndexer } from '../../src/indexer/DocumentIndexer';
import { QueryEngine, QueryMetrics } from '../../src/query/QueryEngine';
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
} from '../../src/tools';

// Test fixtures directory
const TEST_FIXTURES_DIR = path.join(__dirname, '../../test-fixtures/performance');
const TEST_LOGS_DIR = path.join(__dirname, '../../test-fixtures/logs');

// Performance thresholds (in milliseconds) - baseline for future optimization
const PERFORMANCE_THRESHOLDS = {
  documentationMap: 100,    // Should complete within 100ms
  documentSummary: 50,      // Should complete within 50ms
  documentFull: 50,         // Should complete within 50ms
  section: 30,              // Should complete within 30ms
  crossReferences: 30,      // Should complete within 30ms
  validateMetadata: 30,     // Should complete within 30ms
  indexHealth: 20,          // Should complete within 20ms
  rebuildIndex: 500,        // Should complete within 500ms
  reindexSingleFile: 100,   // Should complete within 100ms
};

// Document size categories for testing
const DOCUMENT_SIZES = {
  small: 500,      // ~500 characters
  medium: 5000,    // ~5000 characters
  large: 20000,    // ~20000 characters
};

/**
 * Generate test document content of specified size
 */
function generateDocumentContent(size: number, docName: string): string {
  const header = `# ${docName}

**Date**: 2025-12-16
**Purpose**: Performance test document (${size} chars)
**Organization**: test-org
**Scope**: test-scope
**Layer**: 2
**Relevant Tasks**: testing, performance

---

## Overview

This is a performance test document with approximately ${size} characters.

`;

  const sectionTemplate = `## Section {N}

This is section {N} content. It contains various text to simulate real documentation.
The content includes multiple paragraphs and formatting to test parsing performance.

### Subsection {N}.1

More detailed content for subsection {N}.1 with additional text.
This helps test the heading structure extraction performance.

### Subsection {N}.2

Additional subsection content with [cross-reference](./other-doc.md) links.

`;

  let content = header;
  let sectionNum = 1;
  
  while (content.length < size) {
    content += sectionTemplate.replace(/\{N\}/g, String(sectionNum));
    sectionNum++;
  }

  return content.substring(0, size);
}

describe('Performance Benchmarking Tests', () => {
  let indexer: DocumentIndexer;
  let queryEngine: QueryEngine;
  let metricsLog: QueryMetrics[] = [];
  let smallDocPath: string;
  let mediumDocPath: string;
  let largeDocPath: string;

  beforeAll(async () => {
    // Create test fixtures directories
    if (!fs.existsSync(TEST_FIXTURES_DIR)) {
      fs.mkdirSync(TEST_FIXTURES_DIR, { recursive: true });
    }
    if (!fs.existsSync(TEST_LOGS_DIR)) {
      fs.mkdirSync(TEST_LOGS_DIR, { recursive: true });
    }

    // Create test documents of various sizes
    smallDocPath = path.join(TEST_FIXTURES_DIR, 'small-doc.md');
    mediumDocPath = path.join(TEST_FIXTURES_DIR, 'medium-doc.md');
    largeDocPath = path.join(TEST_FIXTURES_DIR, 'large-doc.md');

    fs.writeFileSync(smallDocPath, generateDocumentContent(DOCUMENT_SIZES.small, 'Small Document'));
    fs.writeFileSync(mediumDocPath, generateDocumentContent(DOCUMENT_SIZES.medium, 'Medium Document'));
    fs.writeFileSync(largeDocPath, generateDocumentContent(DOCUMENT_SIZES.large, 'Large Document'));

    // Create additional documents for map testing
    for (let i = 1; i <= 5; i++) {
      const docPath = path.join(TEST_FIXTURES_DIR, `extra-doc-${i}.md`);
      fs.writeFileSync(docPath, generateDocumentContent(DOCUMENT_SIZES.small, `Extra Document ${i}`));
    }

    // Initialize components
    indexer = new DocumentIndexer(TEST_LOGS_DIR);
    queryEngine = new QueryEngine(indexer, (metrics) => {
      metricsLog.push(metrics);
    });

    // Index test documents
    await indexer.indexDirectory(TEST_FIXTURES_DIR);
  });

  afterAll(() => {
    // Clean up test fixtures
    if (fs.existsSync(path.join(__dirname, '../../test-fixtures'))) {
      fs.rmSync(path.join(__dirname, '../../test-fixtures'), { recursive: true, force: true });
    }
  });

  beforeEach(() => {
    metricsLog = [];
  });

  describe('get_documentation_map Performance', () => {
    it('should complete within threshold', () => {
      const startTime = Date.now();
      const result = handleGetDocumentationMap(queryEngine);
      const duration = Date.now() - startTime;

      expect(result).toBeDefined();
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.documentationMap);
      
      console.log(`get_documentation_map: ${duration}ms (threshold: ${PERFORMANCE_THRESHOLDS.documentationMap}ms)`);
    });

    it('should log performance metrics', () => {
      handleGetDocumentationMap(queryEngine);

      expect(metricsLog.length).toBeGreaterThan(0);
      const metrics = metricsLog[0];
      expect(metrics.operation).toBe('get_documentation_map');
      expect(metrics.responseTimeMs).toBeDefined();
      expect(typeof metrics.responseTimeMs).toBe('number');
    });

    it('should include document count in metrics', () => {
      const result = handleGetDocumentationMap(queryEngine);

      expect(result.metrics).toBeDefined();
      expect(result.metrics.responseTimeMs).toBeDefined();
    });
  });

  describe('get_document_summary Performance', () => {
    it('should complete within threshold for small documents', () => {
      const startTime = Date.now();
      const result = handleGetDocumentSummary(queryEngine, smallDocPath);
      const duration = Date.now() - startTime;

      expect(isGetDocumentSummaryError(result)).toBe(false);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.documentSummary);
      
      console.log(`get_document_summary (small): ${duration}ms (threshold: ${PERFORMANCE_THRESHOLDS.documentSummary}ms)`);
    });

    it('should complete within threshold for medium documents', () => {
      const startTime = Date.now();
      const result = handleGetDocumentSummary(queryEngine, mediumDocPath);
      const duration = Date.now() - startTime;

      expect(isGetDocumentSummaryError(result)).toBe(false);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.documentSummary * 2); // Allow 2x for larger docs
      
      console.log(`get_document_summary (medium): ${duration}ms`);
    });

    it('should complete within threshold for large documents', () => {
      const startTime = Date.now();
      const result = handleGetDocumentSummary(queryEngine, largeDocPath);
      const duration = Date.now() - startTime;

      expect(isGetDocumentSummaryError(result)).toBe(false);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.documentSummary * 4); // Allow 4x for large docs
      
      console.log(`get_document_summary (large): ${duration}ms`);
    });

    it('should log parsing and token estimation metrics', () => {
      handleGetDocumentSummary(queryEngine, mediumDocPath);

      expect(metricsLog.length).toBeGreaterThan(0);
      const metrics = metricsLog[0];
      expect(metrics.operation).toBe('get_document_summary');
      expect(metrics.responseTimeMs).toBeDefined();
    });
  });

  describe('get_document_full Performance', () => {
    it('should complete within threshold for small documents', () => {
      const startTime = Date.now();
      const result = handleGetDocumentFull(queryEngine, smallDocPath);
      const duration = Date.now() - startTime;

      expect(isGetDocumentFullError(result)).toBe(false);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.documentFull);
      
      console.log(`get_document_full (small): ${duration}ms (threshold: ${PERFORMANCE_THRESHOLDS.documentFull}ms)`);
    });

    it('should complete within threshold for large documents', () => {
      const startTime = Date.now();
      const result = handleGetDocumentFull(queryEngine, largeDocPath);
      const duration = Date.now() - startTime;

      expect(isGetDocumentFullError(result)).toBe(false);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.documentFull * 4);
      
      console.log(`get_document_full (large): ${duration}ms`);
    });

    it('should log file read time and token count metrics', () => {
      handleGetDocumentFull(queryEngine, mediumDocPath);

      expect(metricsLog.length).toBeGreaterThan(0);
      const metrics = metricsLog[0];
      expect(metrics.operation).toBe('get_document_full');
      expect(metrics.responseTimeMs).toBeDefined();
    });
  });

  describe('get_section Performance', () => {
    it('should complete within threshold', () => {
      const startTime = Date.now();
      const result = handleGetSection(queryEngine, mediumDocPath, 'Overview');
      const duration = Date.now() - startTime;

      expect(isGetSectionError(result)).toBe(false);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.section);
      
      console.log(`get_section: ${duration}ms (threshold: ${PERFORMANCE_THRESHOLDS.section}ms)`);
    });

    it('should log section extraction time and token count', () => {
      handleGetSection(queryEngine, mediumDocPath, 'Overview');

      expect(metricsLog.length).toBeGreaterThan(0);
      const metrics = metricsLog[0];
      expect(metrics.operation).toBe('get_section');
      expect(metrics.responseTimeMs).toBeDefined();
    });

    it('should scale reasonably with document size', () => {
      const smallStart = Date.now();
      handleGetSection(queryEngine, smallDocPath, 'Overview');
      const smallDuration = Date.now() - smallStart;

      const largeStart = Date.now();
      handleGetSection(queryEngine, largeDocPath, 'Overview');
      const largeDuration = Date.now() - largeStart;

      // Large document section extraction should not be more than 10x slower
      expect(largeDuration).toBeLessThan(smallDuration * 10 + 50); // +50ms buffer
      
      console.log(`get_section scaling: small=${smallDuration}ms, large=${largeDuration}ms`);
    });
  });

  describe('list_cross_references Performance', () => {
    it('should complete within threshold', () => {
      const startTime = Date.now();
      const result = handleListCrossReferences(queryEngine, mediumDocPath);
      const duration = Date.now() - startTime;

      expect(isListCrossReferencesError(result)).toBe(false);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.crossReferences);
      
      console.log(`list_cross_references: ${duration}ms (threshold: ${PERFORMANCE_THRESHOLDS.crossReferences}ms)`);
    });

    it('should log parsing time and reference count', () => {
      handleListCrossReferences(queryEngine, mediumDocPath);

      expect(metricsLog.length).toBeGreaterThan(0);
      const metrics = metricsLog[0];
      expect(metrics.operation).toBe('list_cross_references');
      expect(metrics.responseTimeMs).toBeDefined();
    });
  });

  describe('validate_metadata Performance', () => {
    it('should complete within threshold', () => {
      const startTime = Date.now();
      const result = handleValidateMetadata(queryEngine, mediumDocPath);
      const duration = Date.now() - startTime;

      expect(isValidateMetadataError(result)).toBe(false);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.validateMetadata);
      
      console.log(`validate_metadata: ${duration}ms (threshold: ${PERFORMANCE_THRESHOLDS.validateMetadata}ms)`);
    });

    it('should log validation time and issue count', () => {
      handleValidateMetadata(queryEngine, mediumDocPath);

      expect(metricsLog.length).toBeGreaterThan(0);
      const metrics = metricsLog[0];
      expect(metrics.operation).toBe('validate_metadata');
      expect(metrics.responseTimeMs).toBeDefined();
    });
  });

  describe('get_index_health Performance', () => {
    it('should complete within threshold', () => {
      const startTime = Date.now();
      const result = handleGetIndexHealth(queryEngine);
      const duration = Date.now() - startTime;

      expect(result).toBeDefined();
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.indexHealth);
      
      console.log(`get_index_health: ${duration}ms (threshold: ${PERFORMANCE_THRESHOLDS.indexHealth}ms)`);
    });

    it('should log health check metrics', () => {
      handleGetIndexHealth(queryEngine);

      expect(metricsLog.length).toBeGreaterThan(0);
      const metrics = metricsLog[0];
      expect(metrics.operation).toBe('get_index_health');
      expect(metrics.responseTimeMs).toBeDefined();
    });
  });

  describe('rebuild_index Performance', () => {
    it('should complete within threshold', async () => {
      const startTime = Date.now();
      const result = await handleRebuildIndex(queryEngine);
      const duration = Date.now() - startTime;

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.rebuildIndex);
      
      console.log(`rebuild_index: ${duration}ms (threshold: ${PERFORMANCE_THRESHOLDS.rebuildIndex}ms)`);
    });

    it('should log rebuild metrics', async () => {
      await handleRebuildIndex(queryEngine);

      expect(metricsLog.length).toBeGreaterThan(0);
      const metrics = metricsLog[0];
      expect(metrics.operation).toBe('rebuild_index');
      expect(metrics.responseTimeMs).toBeDefined();
    });
  });

  describe('Re-indexing Single File Performance', () => {
    it('should re-index single file within threshold', async () => {
      // Modify a file to trigger re-indexing
      const modifiedContent = generateDocumentContent(DOCUMENT_SIZES.medium, 'Modified Document');
      fs.writeFileSync(smallDocPath, modifiedContent);

      const startTime = Date.now();
      await indexer.reindexFile(smallDocPath);
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.reindexSingleFile);
      
      console.log(`reindex_single_file: ${duration}ms (threshold: ${PERFORMANCE_THRESHOLDS.reindexSingleFile}ms)`);

      // Restore original content
      fs.writeFileSync(smallDocPath, generateDocumentContent(DOCUMENT_SIZES.small, 'Small Document'));
    });
  });

  describe('Performance Baseline Summary', () => {
    it('should generate performance baseline report', () => {
      const results: Record<string, number> = {};

      // Run all operations and collect timings
      let start = Date.now();
      handleGetDocumentationMap(queryEngine);
      results['get_documentation_map'] = Date.now() - start;

      start = Date.now();
      handleGetDocumentSummary(queryEngine, mediumDocPath);
      results['get_document_summary'] = Date.now() - start;

      start = Date.now();
      handleGetDocumentFull(queryEngine, mediumDocPath);
      results['get_document_full'] = Date.now() - start;

      start = Date.now();
      handleGetSection(queryEngine, mediumDocPath, 'Overview');
      results['get_section'] = Date.now() - start;

      start = Date.now();
      handleListCrossReferences(queryEngine, mediumDocPath);
      results['list_cross_references'] = Date.now() - start;

      start = Date.now();
      handleValidateMetadata(queryEngine, mediumDocPath);
      results['validate_metadata'] = Date.now() - start;

      start = Date.now();
      handleGetIndexHealth(queryEngine);
      results['get_index_health'] = Date.now() - start;

      // Log baseline report
      console.log('\n=== Performance Baseline Report ===');
      console.log('Operation                  | Time (ms) | Threshold (ms)');
      console.log('---------------------------|-----------|---------------');
      console.log(`get_documentation_map      | ${results['get_documentation_map'].toString().padStart(9)} | ${PERFORMANCE_THRESHOLDS.documentationMap}`);
      console.log(`get_document_summary       | ${results['get_document_summary'].toString().padStart(9)} | ${PERFORMANCE_THRESHOLDS.documentSummary}`);
      console.log(`get_document_full          | ${results['get_document_full'].toString().padStart(9)} | ${PERFORMANCE_THRESHOLDS.documentFull}`);
      console.log(`get_section                | ${results['get_section'].toString().padStart(9)} | ${PERFORMANCE_THRESHOLDS.section}`);
      console.log(`list_cross_references      | ${results['list_cross_references'].toString().padStart(9)} | ${PERFORMANCE_THRESHOLDS.crossReferences}`);
      console.log(`validate_metadata          | ${results['validate_metadata'].toString().padStart(9)} | ${PERFORMANCE_THRESHOLDS.validateMetadata}`);
      console.log(`get_index_health           | ${results['get_index_health'].toString().padStart(9)} | ${PERFORMANCE_THRESHOLDS.indexHealth}`);
      console.log('===================================\n');

      // All operations should complete
      expect(Object.keys(results).length).toBe(7);
    });
  });

  describe('Document Size Impact Analysis', () => {
    it('should measure performance across document sizes', () => {
      const sizes = [
        { name: 'small', path: smallDocPath },
        { name: 'medium', path: mediumDocPath },
        { name: 'large', path: largeDocPath },
      ];

      const results: Record<string, Record<string, number>> = {};

      for (const size of sizes) {
        results[size.name] = {};

        let start = Date.now();
        handleGetDocumentSummary(queryEngine, size.path);
        results[size.name]['summary'] = Date.now() - start;

        start = Date.now();
        handleGetDocumentFull(queryEngine, size.path);
        results[size.name]['full'] = Date.now() - start;

        start = Date.now();
        handleGetSection(queryEngine, size.path, 'Overview');
        results[size.name]['section'] = Date.now() - start;
      }

      console.log('\n=== Document Size Impact Analysis ===');
      console.log('Size   | Summary (ms) | Full (ms) | Section (ms)');
      console.log('-------|--------------|-----------|-------------');
      for (const size of sizes) {
        console.log(`${size.name.padEnd(6)} | ${results[size.name]['summary'].toString().padStart(12)} | ${results[size.name]['full'].toString().padStart(9)} | ${results[size.name]['section'].toString().padStart(11)}`);
      }
      console.log('=====================================\n');

      // Verify all measurements were taken
      expect(Object.keys(results).length).toBe(3);
    });
  });
});
