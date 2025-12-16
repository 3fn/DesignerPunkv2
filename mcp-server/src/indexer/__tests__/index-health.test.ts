/**
 * Index Health Check Tests
 * 
 * Tests for the index health check functionality.
 * Validates detection of missing documents, stale index, and malformed metadata.
 */

import * as fs from 'fs';
import * as path from 'path';
import { determineIndexHealth, HealthCheckOptions } from '../index-health';

// Test fixtures directory
const TEST_FIXTURES_DIR = path.join(__dirname, 'fixtures');

// Sample document content with valid metadata
const VALID_DOC = `# Test Document

**Date**: 2025-12-16
**Purpose**: Test document for health check
**Organization**: test-org
**Scope**: test-scope
**Layer**: 2
**Relevant Tasks**: testing
**Last Reviewed**: 2025-12-16

## Section 1

Content here.

### Subsection 1.1

More content.

## Section 2

Another section with [link](other.md).
`;

// Document with missing metadata
const MISSING_METADATA_DOC = `# Test Document

No metadata here.

## Section 1

Content.
`;

// Document with invalid layer
const INVALID_LAYER_DOC = `# Test Document

**Purpose**: Test document
**Layer**: 5

## Section 1

Content.
`;

describe('determineIndexHealth', () => {
  let testDir: string;
  
  beforeEach(() => {
    testDir = path.join(TEST_FIXTURES_DIR, `health-test-${Date.now()}`);
    fs.mkdirSync(testDir, { recursive: true });
  });
  
  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('healthy index', () => {
    it('should return healthy status when all documents are indexed with valid metadata', () => {
      // Create test file
      const filePath = path.join(testDir, 'doc1.md');
      fs.writeFileSync(filePath, VALID_DOC);
      
      const indexedDocuments = new Map<string, string>();
      indexedDocuments.set(filePath, VALID_DOC);
      
      const options: HealthCheckOptions = {
        indexedDocuments,
        directoryPath: testDir
      };
      
      const health = determineIndexHealth(options);
      
      expect(health.status).toBe('healthy');
      expect(health.errors).toHaveLength(0);
      expect(health.warnings).toHaveLength(0);
      expect(health.documentsIndexed).toBe(1);
      expect(health.metrics.totalDocuments).toBe(1);
    });

    it('should return healthy status for empty index with empty directory', () => {
      const indexedDocuments = new Map<string, string>();
      
      const options: HealthCheckOptions = {
        indexedDocuments,
        directoryPath: testDir
      };
      
      const health = determineIndexHealth(options);
      
      expect(health.status).toBe('healthy');
      expect(health.errors).toHaveLength(0);
      expect(health.warnings).toHaveLength(0);
      expect(health.documentsIndexed).toBe(0);
    });
  });

  describe('missing documents detection', () => {
    it('should return failed status when documents are missing from index', () => {
      // Create files in directory but don't add to index
      fs.writeFileSync(path.join(testDir, 'doc1.md'), VALID_DOC);
      fs.writeFileSync(path.join(testDir, 'doc2.md'), VALID_DOC);
      
      const indexedDocuments = new Map<string, string>();
      // No documents indexed
      
      const options: HealthCheckOptions = {
        indexedDocuments,
        directoryPath: testDir
      };
      
      const health = determineIndexHealth(options);
      
      expect(health.status).toBe('failed');
      expect(health.errors.length).toBeGreaterThan(0);
      expect(health.errors[0]).toContain('Missing documents');
    });

    it('should detect partially missing documents', () => {
      // Create two files
      const file1 = path.join(testDir, 'doc1.md');
      const file2 = path.join(testDir, 'doc2.md');
      fs.writeFileSync(file1, VALID_DOC);
      fs.writeFileSync(file2, VALID_DOC);
      
      // Only index one
      const indexedDocuments = new Map<string, string>();
      indexedDocuments.set(file1, VALID_DOC);
      
      const options: HealthCheckOptions = {
        indexedDocuments,
        directoryPath: testDir
      };
      
      const health = determineIndexHealth(options);
      
      expect(health.status).toBe('failed');
      expect(health.errors[0]).toContain('doc2.md');
    });
  });

  describe('stale index detection', () => {
    it('should return degraded status when files are modified after last index', async () => {
      const filePath = path.join(testDir, 'doc1.md');
      fs.writeFileSync(filePath, VALID_DOC);
      
      const indexedDocuments = new Map<string, string>();
      indexedDocuments.set(filePath, VALID_DOC);
      
      // Set last index time to past
      const lastIndexTime = new Date(Date.now() - 10000).toISOString();
      
      // Touch the file to update mtime
      const now = new Date();
      fs.utimesSync(filePath, now, now);
      
      const options: HealthCheckOptions = {
        indexedDocuments,
        directoryPath: testDir,
        lastIndexTime
      };
      
      const health = determineIndexHealth(options);
      
      expect(health.status).toBe('degraded');
      expect(health.warnings.length).toBeGreaterThan(0);
      expect(health.warnings.some(w => w.includes('Stale index'))).toBe(true);
    });

    it('should not report stale when files are older than last index', () => {
      const filePath = path.join(testDir, 'doc1.md');
      fs.writeFileSync(filePath, VALID_DOC);
      
      // Set file mtime to past
      const pastTime = new Date(Date.now() - 10000);
      fs.utimesSync(filePath, pastTime, pastTime);
      
      const indexedDocuments = new Map<string, string>();
      indexedDocuments.set(filePath, VALID_DOC);
      
      // Set last index time to now
      const lastIndexTime = new Date().toISOString();
      
      const options: HealthCheckOptions = {
        indexedDocuments,
        directoryPath: testDir,
        lastIndexTime
      };
      
      const health = determineIndexHealth(options);
      
      expect(health.warnings.some(w => w.includes('Stale index'))).toBe(false);
    });
  });

  describe('malformed metadata detection', () => {
    it('should return degraded status when documents have missing metadata', () => {
      const filePath = path.join(testDir, 'doc1.md');
      fs.writeFileSync(filePath, MISSING_METADATA_DOC);
      
      const indexedDocuments = new Map<string, string>();
      indexedDocuments.set(filePath, MISSING_METADATA_DOC);
      
      const options: HealthCheckOptions = {
        indexedDocuments,
        directoryPath: testDir
      };
      
      const health = determineIndexHealth(options);
      
      expect(health.status).toBe('degraded');
      expect(health.warnings.some(w => w.includes('Malformed metadata'))).toBe(true);
    });

    it('should return degraded status when layer value is invalid', () => {
      const filePath = path.join(testDir, 'doc1.md');
      fs.writeFileSync(filePath, INVALID_LAYER_DOC);
      
      const indexedDocuments = new Map<string, string>();
      indexedDocuments.set(filePath, INVALID_LAYER_DOC);
      
      const options: HealthCheckOptions = {
        indexedDocuments,
        directoryPath: testDir
      };
      
      const health = determineIndexHealth(options);
      
      expect(health.status).toBe('degraded');
      expect(health.warnings.some(w => w.includes('Malformed metadata'))).toBe(true);
    });
  });

  describe('metrics calculation', () => {
    it('should calculate correct metrics for indexed documents', () => {
      const filePath = path.join(testDir, 'doc1.md');
      fs.writeFileSync(filePath, VALID_DOC);
      
      const indexedDocuments = new Map<string, string>();
      indexedDocuments.set(filePath, VALID_DOC);
      
      const options: HealthCheckOptions = {
        indexedDocuments,
        directoryPath: testDir
      };
      
      const health = determineIndexHealth(options);
      
      expect(health.metrics.totalDocuments).toBe(1);
      // VALID_DOC has 2 H2 sections and 1 H3 subsection = 3 total
      expect(health.metrics.totalSections).toBe(3);
      // VALID_DOC has 1 cross-reference
      expect(health.metrics.totalCrossReferences).toBe(1);
      expect(health.metrics.indexSizeBytes).toBeGreaterThan(0);
    });

    it('should aggregate metrics across multiple documents', () => {
      const file1 = path.join(testDir, 'doc1.md');
      const file2 = path.join(testDir, 'doc2.md');
      fs.writeFileSync(file1, VALID_DOC);
      fs.writeFileSync(file2, VALID_DOC);
      
      const indexedDocuments = new Map<string, string>();
      indexedDocuments.set(file1, VALID_DOC);
      indexedDocuments.set(file2, VALID_DOC);
      
      const options: HealthCheckOptions = {
        indexedDocuments,
        directoryPath: testDir
      };
      
      const health = determineIndexHealth(options);
      
      expect(health.metrics.totalDocuments).toBe(2);
      expect(health.metrics.totalSections).toBe(6); // 3 per doc * 2
      expect(health.metrics.totalCrossReferences).toBe(2); // 1 per doc * 2
    });
  });

  describe('status determination', () => {
    it('should prioritize errors over warnings for status', () => {
      // Create two files but only index one with bad metadata
      const file1 = path.join(testDir, 'doc1.md');
      const file2 = path.join(testDir, 'doc2.md');
      fs.writeFileSync(file1, MISSING_METADATA_DOC);
      fs.writeFileSync(file2, VALID_DOC);
      
      // Only index doc1 (missing doc2 = error, bad metadata = warning)
      const indexedDocuments = new Map<string, string>();
      indexedDocuments.set(file1, MISSING_METADATA_DOC);
      
      const options: HealthCheckOptions = {
        indexedDocuments,
        directoryPath: testDir
      };
      
      const health = determineIndexHealth(options);
      
      // Should be failed (error) not degraded (warning)
      expect(health.status).toBe('failed');
      expect(health.errors.length).toBeGreaterThan(0);
    });
  });

  describe('directory handling', () => {
    it('should handle non-existent directory gracefully', () => {
      const indexedDocuments = new Map<string, string>();
      
      const options: HealthCheckOptions = {
        indexedDocuments,
        directoryPath: '/nonexistent/path'
      };
      
      const health = determineIndexHealth(options);
      
      // Should be healthy since both expected and indexed are empty
      expect(health.status).toBe('healthy');
    });

    it('should scan subdirectories for markdown files', () => {
      // Create subdirectory with file
      const subDir = path.join(testDir, 'subdir');
      fs.mkdirSync(subDir, { recursive: true });
      
      const file1 = path.join(testDir, 'doc1.md');
      const file2 = path.join(subDir, 'doc2.md');
      fs.writeFileSync(file1, VALID_DOC);
      fs.writeFileSync(file2, VALID_DOC);
      
      const indexedDocuments = new Map<string, string>();
      indexedDocuments.set(file1, VALID_DOC);
      indexedDocuments.set(file2, VALID_DOC);
      
      const options: HealthCheckOptions = {
        indexedDocuments,
        directoryPath: testDir
      };
      
      const health = determineIndexHealth(options);
      
      expect(health.status).toBe('healthy');
      expect(health.documentsIndexed).toBe(2);
    });
  });

  describe('lastIndexTime handling', () => {
    it('should use current time when lastIndexTime not provided', () => {
      const indexedDocuments = new Map<string, string>();
      
      const options: HealthCheckOptions = {
        indexedDocuments,
        directoryPath: testDir
      };
      
      const health = determineIndexHealth(options);
      
      // Should have a valid ISO timestamp
      expect(health.lastIndexTime).toBeDefined();
      expect(new Date(health.lastIndexTime).getTime()).not.toBeNaN();
    });

    it('should use provided lastIndexTime', () => {
      const indexedDocuments = new Map<string, string>();
      const lastIndexTime = '2025-01-01T00:00:00.000Z';
      
      const options: HealthCheckOptions = {
        indexedDocuments,
        directoryPath: testDir,
        lastIndexTime
      };
      
      const health = determineIndexHealth(options);
      
      expect(health.lastIndexTime).toBe(lastIndexTime);
    });
  });
});
