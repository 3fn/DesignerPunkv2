/**
 * QueryEngine Tests
 * 
 * Tests for request routing, parameter validation, and response formatting.
 * Requirements: 1.1, 11.1, 11.2, 11.3, 11.4
 */

import * as fs from 'fs';
import * as path from 'path';
import { QueryEngine, QueryMetrics } from '../QueryEngine';
import { DocumentIndexer } from '../../indexer/DocumentIndexer';

describe('QueryEngine', () => {
  let indexer: DocumentIndexer;
  let queryEngine: QueryEngine;
  let testDir: string;
  let loggedMetrics: QueryMetrics[];

  beforeAll(async () => {
    // Create test directory with sample documents
    testDir = path.join(__dirname, 'test-docs-query');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    // Create sample document
    const sampleDoc = `# Test Document

**Date**: 2025-12-16
**Purpose**: Test document for QueryEngine
**Organization**: test-org
**Scope**: test-scope
**Layer**: 2
**Relevant Tasks**: testing, validation

---

## Overview

This is a test document for the QueryEngine.

## Section One

Content for section one.

### Subsection 1.1

Subsection content.

## Section Two

Content for section two with a [cross-reference](./other-doc.md).

## Section Three

Final section content.
`;

    fs.writeFileSync(path.join(testDir, 'test-doc.md'), sampleDoc);

    // Create another document for cross-reference testing
    const otherDoc = `# Other Document

**Date**: 2025-12-16
**Purpose**: Another test document
**Organization**: test-org
**Scope**: test-scope
**Layer**: 3
**Relevant Tasks**: testing

---

## Content

Some content here.
`;

    fs.writeFileSync(path.join(testDir, 'other-doc.md'), otherDoc);

    // Initialize indexer and query engine
    const logsDir = path.join(__dirname, 'test-logs-query');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    indexer = new DocumentIndexer(logsDir);
    await indexer.indexDirectory(testDir);

    // Create query engine with metrics logger
    loggedMetrics = [];
    queryEngine = new QueryEngine(indexer, (metrics) => {
      loggedMetrics.push(metrics);
    });
  });

  afterAll(() => {
    // Clean up test directories
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
    const logsDir = path.join(__dirname, 'test-logs-query');
    if (fs.existsSync(logsDir)) {
      fs.rmSync(logsDir, { recursive: true });
    }
  });

  beforeEach(() => {
    // Clear logged metrics before each test
    loggedMetrics = [];
  });

  describe('getDocumentationMap', () => {
    it('should return documentation map with all layers', () => {
      const result = queryEngine.getDocumentationMap();

      expect(result.data).toBeDefined();
      expect(result.data.layers).toBeDefined();
      expect(result.data.layers['0']).toBeDefined();
      expect(result.data.layers['1']).toBeDefined();
      expect(result.data.layers['2']).toBeDefined();
      expect(result.data.layers['3']).toBeDefined();
    });

    it('should include documents in correct layers', () => {
      const result = queryEngine.getDocumentationMap();

      // test-doc.md is Layer 2
      const layer2Docs = result.data.layers['2'].documents;
      const testDoc = layer2Docs.find(d => d.path.includes('test-doc.md'));
      expect(testDoc).toBeDefined();

      // other-doc.md is Layer 3
      const layer3Docs = result.data.layers['3'].documents;
      const otherDoc = layer3Docs.find(d => d.path.includes('other-doc.md'));
      expect(otherDoc).toBeDefined();
    });

    it('should log performance metrics', () => {
      queryEngine.getDocumentationMap();

      expect(loggedMetrics.length).toBe(1);
      expect(loggedMetrics[0].operation).toBe('get_documentation_map');
      expect(loggedMetrics[0].responseTimeMs).toBeGreaterThanOrEqual(0);
    });

    it('should return metrics in result', () => {
      const result = queryEngine.getDocumentationMap();

      expect(result.metrics).toBeDefined();
      expect(result.metrics.operation).toBe('get_documentation_map');
      expect(result.metrics.responseTimeMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getDocumentSummary', () => {
    it('should return document summary with metadata', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      const result = queryEngine.getDocumentSummary(docPath);

      expect(result.data.path).toBe(docPath);
      expect(result.data.metadata.purpose).toBe('Test document for QueryEngine');
      expect(result.data.metadata.layer).toBe(2);
      expect(result.data.metadata.relevantTasks).toContain('testing');
    });

    it('should return document outline', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      const result = queryEngine.getDocumentSummary(docPath);

      expect(result.data.outline).toBeDefined();
      expect(result.data.outline.length).toBeGreaterThan(0);

      const overviewSection = result.data.outline.find(s => s.heading === 'Overview');
      expect(overviewSection).toBeDefined();
    });

    it('should return cross-references', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      const result = queryEngine.getDocumentSummary(docPath);

      expect(result.data.crossReferences).toBeDefined();
      expect(result.data.crossReferences.length).toBeGreaterThan(0);
    });

    it('should return token count', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      const result = queryEngine.getDocumentSummary(docPath);

      expect(result.data.tokenCount).toBeGreaterThan(0);
    });

    it('should log performance metrics with token counts', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      queryEngine.getDocumentSummary(docPath);

      expect(loggedMetrics.length).toBe(1);
      expect(loggedMetrics[0].operation).toBe('get_document_summary');
      expect(loggedMetrics[0].tokenCounts).toBeDefined();
      expect(loggedMetrics[0].tokenCounts?.fullDocument).toBeGreaterThan(0);
    });

    it('should throw error for invalid path', () => {
      expect(() => queryEngine.getDocumentSummary('')).toThrow();
      expect(() => queryEngine.getDocumentSummary('   ')).toThrow();
    });

    it('should throw error for path traversal', () => {
      expect(() => queryEngine.getDocumentSummary('../secret.md')).toThrow(/path traversal/i);
    });
  });

  describe('getDocumentFull', () => {
    it('should return full document content', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      const result = queryEngine.getDocumentFull(docPath);

      expect(result.data.path).toBe(docPath);
      expect(result.data.content).toContain('# Test Document');
      expect(result.data.content).toContain('## Overview');
    });

    it('should return metadata', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      const result = queryEngine.getDocumentFull(docPath);

      expect(result.data.metadata.purpose).toBe('Test document for QueryEngine');
      expect(result.data.metadata.layer).toBe(2);
    });

    it('should return token count', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      const result = queryEngine.getDocumentFull(docPath);

      expect(result.data.tokenCount).toBeGreaterThan(0);
    });

    it('should log performance metrics', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      queryEngine.getDocumentFull(docPath);

      expect(loggedMetrics.length).toBe(1);
      expect(loggedMetrics[0].operation).toBe('get_document_full');
      expect(loggedMetrics[0].tokenCounts?.fullDocument).toBeGreaterThan(0);
    });
  });

  describe('getSection', () => {
    it('should return specific section by heading', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      const result = queryEngine.getSection(docPath, 'Section One');

      expect(result.data.path).toBe(docPath);
      expect(result.data.heading).toBe('Section One');
      expect(result.data.content).toContain('Content for section one');
    });

    it('should return section token count', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      const result = queryEngine.getSection(docPath, 'Section One');

      expect(result.data.tokenCount).toBeGreaterThan(0);
    });

    it('should log performance metrics', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      queryEngine.getSection(docPath, 'Section One');

      expect(loggedMetrics.length).toBe(1);
      expect(loggedMetrics[0].operation).toBe('get_section');
      expect(loggedMetrics[0].tokenCounts?.section).toBeGreaterThan(0);
    });

    it('should throw error for invalid heading', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      expect(() => queryEngine.getSection(docPath, '')).toThrow();
      expect(() => queryEngine.getSection(docPath, '   ')).toThrow();
    });

    it('should throw error for non-existent section', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      expect(() => queryEngine.getSection(docPath, 'Non-Existent Section')).toThrow(/not found/i);
    });
  });

  describe('listCrossReferences', () => {
    it('should return cross-references from document', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      const result = queryEngine.listCrossReferences(docPath);

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
    });

    it('should include reference details', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      const result = queryEngine.listCrossReferences(docPath);

      const ref = result.data[0];
      expect(ref.target).toBeDefined();
      expect(ref.context).toBeDefined();
      expect(ref.section).toBeDefined();
    });

    it('should log performance metrics', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      queryEngine.listCrossReferences(docPath);

      expect(loggedMetrics.length).toBe(1);
      expect(loggedMetrics[0].operation).toBe('list_cross_references');
    });

    it('should return empty array for document without cross-references', () => {
      const docPath = path.join(testDir, 'other-doc.md');
      const result = queryEngine.listCrossReferences(docPath);

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('validateMetadata', () => {
    it('should validate document metadata', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      const result = queryEngine.validateMetadata(docPath);

      expect(result.data.path).toBe(docPath);
      expect(result.data.valid).toBeDefined();
      expect(result.data.metadata).toBeDefined();
      expect(result.data.issues).toBeDefined();
    });

    it('should return validation issues', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      const result = queryEngine.validateMetadata(docPath);

      expect(Array.isArray(result.data.issues)).toBe(true);
    });

    it('should log performance metrics', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      queryEngine.validateMetadata(docPath);

      expect(loggedMetrics.length).toBe(1);
      expect(loggedMetrics[0].operation).toBe('validate_metadata');
    });
  });

  describe('getIndexHealth', () => {
    it('should return index health status', () => {
      const result = queryEngine.getIndexHealth();

      expect(result.data.status).toBeDefined();
      expect(['healthy', 'degraded', 'failed']).toContain(result.data.status);
    });

    it('should return documents indexed count', () => {
      const result = queryEngine.getIndexHealth();

      expect(result.data.documentsIndexed).toBeGreaterThanOrEqual(0);
    });

    it('should return metrics', () => {
      const result = queryEngine.getIndexHealth();

      expect(result.data.metrics).toBeDefined();
      expect(result.data.metrics.totalDocuments).toBeGreaterThanOrEqual(0);
    });

    it('should log performance metrics', () => {
      queryEngine.getIndexHealth();

      expect(loggedMetrics.length).toBe(1);
      expect(loggedMetrics[0].operation).toBe('get_index_health');
    });
  });

  describe('rebuildIndex', () => {
    it('should rebuild index and return health', async () => {
      const result = await queryEngine.rebuildIndex();

      expect(result.data.status).toBeDefined();
      expect(result.data.documentsIndexed).toBeGreaterThanOrEqual(0);
    });

    it('should log performance metrics', async () => {
      await queryEngine.rebuildIndex();

      expect(loggedMetrics.length).toBe(1);
      expect(loggedMetrics[0].operation).toBe('rebuild_index');
    });
  });

  describe('formatError', () => {
    it('should format error with message', () => {
      const error = new Error('Test error message');
      const formatted = queryEngine.formatError(error);

      expect(formatted.error).toBe('UnknownError');
      expect(formatted.message).toBe('Test error message');
    });

    it('should include suggestions if available', () => {
      const error = new Error('Test error');
      (error as any).errorType = 'InvalidParameter';
      (error as any).suggestions = ['Try this', 'Or this'];

      const formatted = queryEngine.formatError(error);

      expect(formatted.error).toBe('InvalidParameter');
      expect(formatted.suggestions).toEqual(['Try this', 'Or this']);
    });
  });

  describe('parameter validation', () => {
    it('should reject null path', () => {
      expect(() => queryEngine.getDocumentSummary(null as any)).toThrow();
    });

    it('should reject undefined path', () => {
      expect(() => queryEngine.getDocumentSummary(undefined as any)).toThrow();
    });

    it('should reject non-string path', () => {
      expect(() => queryEngine.getDocumentSummary(123 as any)).toThrow();
    });

    it('should reject null heading', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      expect(() => queryEngine.getSection(docPath, null as any)).toThrow();
    });

    it('should reject undefined heading', () => {
      const docPath = path.join(testDir, 'test-doc.md');
      expect(() => queryEngine.getSection(docPath, undefined as any)).toThrow();
    });
  });
});
