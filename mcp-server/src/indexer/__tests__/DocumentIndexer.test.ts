/**
 * DocumentIndexer Tests
 * 
 * Tests the DocumentIndexer class functionality including:
 * - Directory indexing
 * - File re-indexing
 * - Documentation map generation
 * - Document summary retrieval
 * - Full document retrieval
 * - Section retrieval
 * - Cross-reference listing
 * - Metadata validation
 */

import * as fs from 'fs';
import * as path from 'path';
import { DocumentIndexer } from '../DocumentIndexer';

// Test fixtures directory
const TEST_FIXTURES_DIR = path.join(__dirname, 'fixtures');

// Sample document content
const SAMPLE_DOC_1 = `# Sample Document 1

**Date**: 2025-12-16
**Purpose**: Test document for indexer
**Organization**: test-org
**Scope**: test-scope
**Layer**: 2
**Relevant Tasks**: testing, indexing
**Last Reviewed**: 2025-12-16

## Overview

This is a test document.

### Details

Some details here.

## Architecture

Architecture section.

### Components

Component details.

### Interfaces

Interface details.

## Cross References

See [Related Doc](./sample-doc-2.md) for more information.
`;

const SAMPLE_DOC_2 = `# Sample Document 2

**Date**: 2025-12-16
**Purpose**: Another test document
**Organization**: test-org
**Scope**: test-scope
**Layer**: 1
**Relevant Tasks**: testing
**Last Reviewed**: 2025-12-16

## Introduction

Introduction section.

## Details

Details section.
`;

describe('DocumentIndexer', () => {
  let indexer: DocumentIndexer;
  let testDir: string;
  
  beforeEach(() => {
    indexer = new DocumentIndexer();
    testDir = path.join(TEST_FIXTURES_DIR, `test-${Date.now()}`);
    
    // Create test directory
    fs.mkdirSync(testDir, { recursive: true });
  });
  
  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });
  
  describe('indexDirectory', () => {
    it('should index all markdown files in directory', async () => {
      // Create test files
      const file1 = path.join(testDir, 'doc1.md');
      const file2 = path.join(testDir, 'doc2.md');
      fs.writeFileSync(file1, SAMPLE_DOC_1);
      fs.writeFileSync(file2, SAMPLE_DOC_2);
      
      // Index directory
      await indexer.indexDirectory(testDir);
      
      // Verify both files are indexed
      const map = indexer.getDocumentationMap();
      const allDocs = [
        ...map.layers['1'].documents,
        ...map.layers['2'].documents
      ];
      
      expect(allDocs).toHaveLength(2);
      expect(allDocs.some(doc => doc.path === file1)).toBe(true);
      expect(allDocs.some(doc => doc.path === file2)).toBe(true);
    });
    
    it('should index files in subdirectories', async () => {
      // Create subdirectory with file
      const subDir = path.join(testDir, 'subdir');
      fs.mkdirSync(subDir);
      const file = path.join(subDir, 'doc.md');
      fs.writeFileSync(file, SAMPLE_DOC_1);
      
      // Index directory
      await indexer.indexDirectory(testDir);
      
      // Verify file is indexed
      const map = indexer.getDocumentationMap();
      const allDocs = [
        ...map.layers['2'].documents
      ];
      
      expect(allDocs).toHaveLength(1);
      expect(allDocs[0].path).toBe(file);
    });
    
    it('should only index .md files', async () => {
      // Create various file types
      fs.writeFileSync(path.join(testDir, 'doc.md'), SAMPLE_DOC_1);
      fs.writeFileSync(path.join(testDir, 'readme.txt'), 'Not markdown');
      fs.writeFileSync(path.join(testDir, 'data.json'), '{}');
      
      // Index directory
      await indexer.indexDirectory(testDir);
      
      // Verify only .md file is indexed
      const map = indexer.getDocumentationMap();
      const allDocs = [
        ...map.layers['2'].documents
      ];
      
      expect(allDocs).toHaveLength(1);
    });
  });
  
  describe('reindexFile', () => {
    it('should update index for modified file', async () => {
      // Create and index file
      const file = path.join(testDir, 'doc.md');
      fs.writeFileSync(file, SAMPLE_DOC_1);
      await indexer.indexDirectory(testDir);
      
      // Verify initial content
      let summary = indexer.getDocumentSummary(file);
      expect(summary.metadata.purpose).toBe('Test document for indexer');
      
      // Modify file
      const modifiedContent = SAMPLE_DOC_1.replace(
        'Test document for indexer',
        'Modified test document'
      );
      fs.writeFileSync(file, modifiedContent);
      
      // Re-index file
      await indexer.reindexFile(file);
      
      // Verify updated content
      summary = indexer.getDocumentSummary(file);
      expect(summary.metadata.purpose).toBe('Modified test document');
    });
  });
  
  describe('getDocumentationMap', () => {
    it('should organize documents by layer', async () => {
      // Create files in different layers
      const file1 = path.join(testDir, 'layer1.md');
      const file2 = path.join(testDir, 'layer2.md');
      fs.writeFileSync(file1, SAMPLE_DOC_2); // Layer 1
      fs.writeFileSync(file2, SAMPLE_DOC_1); // Layer 2
      
      await indexer.indexDirectory(testDir);
      
      const map = indexer.getDocumentationMap();
      
      // Verify layer structure
      expect(map.layers['0'].name).toBe('Meta-Guide');
      expect(map.layers['1'].name).toBe('Foundation');
      expect(map.layers['2'].name).toBe('Frameworks and Patterns');
      expect(map.layers['3'].name).toBe('Specific Implementations');
      
      // Verify documents in correct layers
      expect(map.layers['1'].documents).toHaveLength(1);
      expect(map.layers['2'].documents).toHaveLength(1);
      expect(map.layers['1'].documents[0].path).toBe(file1);
      expect(map.layers['2'].documents[0].path).toBe(file2);
    });
    
    it('should include document metadata', async () => {
      const file = path.join(testDir, 'doc.md');
      fs.writeFileSync(file, SAMPLE_DOC_1);
      await indexer.indexDirectory(testDir);
      
      const map = indexer.getDocumentationMap();
      const doc = map.layers['2'].documents[0];
      
      expect(doc.path).toBe(file);
      expect(doc.purpose).toBe('Test document for indexer');
      expect(doc.layer).toBe(2);
      expect(doc.relevantTasks).toEqual(['testing', 'indexing']);
      expect(doc.sections).toEqual(['Overview', 'Architecture', 'Cross References']);
      expect(doc.tokenCount).toBeGreaterThan(0);
    });
  });
  
  describe('getDocumentSummary', () => {
    it('should return document summary with metadata and outline', async () => {
      const file = path.join(testDir, 'doc.md');
      fs.writeFileSync(file, SAMPLE_DOC_1);
      await indexer.indexDirectory(testDir);
      
      const summary = indexer.getDocumentSummary(file);
      
      expect(summary.path).toBe(file);
      expect(summary.metadata.purpose).toBe('Test document for indexer');
      expect(summary.metadata.layer).toBe(2);
      expect(summary.metadata.relevantTasks).toEqual(['testing', 'indexing']);
      expect(summary.metadata.organization).toBe('test-org');
      expect(summary.metadata.scope).toBe('test-scope');
      
      // Verify outline structure
      expect(summary.outline).toHaveLength(3);
      expect(summary.outline[0].heading).toBe('Overview');
      expect(summary.outline[0].subsections).toEqual(['Details']);
      expect(summary.outline[1].heading).toBe('Architecture');
      expect(summary.outline[1].subsections).toEqual(['Components', 'Interfaces']);
      
      expect(summary.tokenCount).toBeGreaterThan(0);
    });
    
    it('should include cross-references in summary', async () => {
      const file = path.join(testDir, 'doc.md');
      fs.writeFileSync(file, SAMPLE_DOC_1);
      await indexer.indexDirectory(testDir);
      
      const summary = indexer.getDocumentSummary(file);
      
      expect(summary.crossReferences).toHaveLength(1);
      expect(summary.crossReferences[0].target).toBe('./sample-doc-2.md');
      expect(summary.crossReferences[0].context).toBe('Related Doc');
      expect(summary.crossReferences[0].section).toBe('Cross References');
    });
    
    it('should throw error for non-existent document', async () => {
      await indexer.indexDirectory(testDir);
      
      expect(() => {
        indexer.getDocumentSummary('/non/existent/file.md');
      }).toThrow('Document not found');
    });
    
    it('should produce summary with less than 500 tokens', async () => {
      const file = path.join(testDir, 'doc.md');
      fs.writeFileSync(file, SAMPLE_DOC_1);
      await indexer.indexDirectory(testDir);
      
      const summary = indexer.getDocumentSummary(file);
      
      // Estimate token count of the summary itself (not the full document)
      // Summary includes: path, metadata, outline, crossReferences
      const summaryJson = JSON.stringify(summary);
      const summaryTokens = Math.round(summaryJson.length / 4);
      
      // Verify summary is under 500 tokens
      expect(summaryTokens).toBeLessThan(500);
    });
  });
  
  describe('getDocumentFull', () => {
    it('should return full document content', async () => {
      const file = path.join(testDir, 'doc.md');
      fs.writeFileSync(file, SAMPLE_DOC_1);
      await indexer.indexDirectory(testDir);
      
      const full = indexer.getDocumentFull(file);
      
      expect(full.path).toBe(file);
      expect(full.content).toBe(SAMPLE_DOC_1);
      expect(full.metadata.purpose).toBe('Test document for indexer');
      expect(full.tokenCount).toBeGreaterThan(0);
    });
    
    it('should throw error for non-existent document', async () => {
      await indexer.indexDirectory(testDir);
      
      expect(() => {
        indexer.getDocumentFull('/non/existent/file.md');
      }).toThrow('Document not found');
    });
  });
  
  describe('getSection', () => {
    it('should return specific section by heading', async () => {
      const file = path.join(testDir, 'doc.md');
      fs.writeFileSync(file, SAMPLE_DOC_1);
      await indexer.indexDirectory(testDir);
      
      const section = indexer.getSection(file, 'Architecture');
      
      expect(section.path).toBe(file);
      expect(section.heading).toBe('Architecture');
      expect(section.content).toContain('## Architecture');
      expect(section.content).toContain('Architecture section');
      expect(section.content).toContain('### Components');
      expect(section.tokenCount).toBeGreaterThan(0);
    });
    
    it('should throw error for non-existent section', async () => {
      const file = path.join(testDir, 'doc.md');
      fs.writeFileSync(file, SAMPLE_DOC_1);
      await indexer.indexDirectory(testDir);
      
      expect(() => {
        indexer.getSection(file, 'Non-Existent Section');
      }).toThrow('Section "Non-Existent Section" not found');
    });
    
    it('should throw error for non-existent document', async () => {
      await indexer.indexDirectory(testDir);
      
      expect(() => {
        indexer.getSection('/non/existent/file.md', 'Overview');
      }).toThrow('Document not found');
    });
  });
  
  describe('listCrossReferences', () => {
    it('should return all cross-references in document', async () => {
      const file = path.join(testDir, 'doc.md');
      fs.writeFileSync(file, SAMPLE_DOC_1);
      await indexer.indexDirectory(testDir);
      
      const refs = indexer.listCrossReferences(file);
      
      expect(refs).toHaveLength(1);
      expect(refs[0].target).toBe('./sample-doc-2.md');
      expect(refs[0].context).toBe('Related Doc');
      expect(refs[0].section).toBe('Cross References');
      expect(refs[0].lineNumber).toBeGreaterThan(0);
    });
    
    it('should throw error for non-existent document', async () => {
      await indexer.indexDirectory(testDir);
      
      expect(() => {
        indexer.listCrossReferences('/non/existent/file.md');
      }).toThrow('Document not found');
    });
  });
  
  describe('validateMetadata', () => {
    it('should validate correct metadata', async () => {
      const file = path.join(testDir, 'doc.md');
      fs.writeFileSync(file, SAMPLE_DOC_1);
      await indexer.indexDirectory(testDir);
      
      const validation = indexer.validateMetadata(file);
      
      expect(validation.path).toBe(file);
      expect(validation.valid).toBe(true);
      expect(validation.metadata).toBeTruthy();
      expect(validation.issues).toHaveLength(0);
    });
    
    it('should detect missing required fields', async () => {
      const file = path.join(testDir, 'doc.md');
      const incompleteDoc = `# Incomplete Document

**Date**: 2025-12-16

## Content

Some content.
`;
      fs.writeFileSync(file, incompleteDoc);
      await indexer.indexDirectory(testDir);
      
      const validation = indexer.validateMetadata(file);
      
      expect(validation.valid).toBe(false);
      expect(validation.issues.length).toBeGreaterThan(0);
      expect(validation.issues.some(i => i.field === 'purpose')).toBe(true);
      expect(validation.issues.some(i => i.field === 'organization')).toBe(true);
      expect(validation.issues.some(i => i.field === 'scope')).toBe(true);
    });
    
    it('should throw error for non-existent document', async () => {
      await indexer.indexDirectory(testDir);
      
      expect(() => {
        indexer.validateMetadata('/non/existent/file.md');
      }).toThrow('Document not found');
    });
  });

  describe('validateIndexOnStartup', () => {
    it('should return failed status when index not initialized', () => {
      const health = indexer.validateIndexOnStartup();
      
      expect(health.status).toBe('failed');
      expect(health.documentsIndexed).toBe(0);
      expect(health.errors).toContain('Index not initialized: no directory path set');
    });
    
    it('should return healthy status for valid index', async () => {
      const file = path.join(testDir, 'doc.md');
      fs.writeFileSync(file, SAMPLE_DOC_1);
      await indexer.indexDirectory(testDir);
      
      const health = indexer.validateIndexOnStartup();
      
      expect(health.status).toBe('healthy');
      expect(health.documentsIndexed).toBe(1);
      expect(health.errors).toHaveLength(0);
      expect(health.metrics.totalDocuments).toBe(1);
    });
    
    it('should detect missing documents', async () => {
      const file = path.join(testDir, 'doc.md');
      fs.writeFileSync(file, SAMPLE_DOC_1);
      await indexer.indexDirectory(testDir);
      
      // Add a new file after indexing
      const newFile = path.join(testDir, 'new-doc.md');
      fs.writeFileSync(newFile, SAMPLE_DOC_2);
      
      const health = indexer.validateIndexOnStartup();
      
      // Should detect the missing document
      expect(health.status).toBe('failed');
      expect(health.errors.some((e: string) => e.includes('Missing documents'))).toBe(true);
    });
    
    it('should detect malformed metadata', async () => {
      const file = path.join(testDir, 'doc.md');
      const incompleteDoc = `# Incomplete Document

## Content

Some content without metadata.
`;
      fs.writeFileSync(file, incompleteDoc);
      await indexer.indexDirectory(testDir);
      
      const health = indexer.validateIndexOnStartup();
      
      // Should detect malformed metadata
      expect(health.warnings.some((w: string) => w.includes('Malformed metadata'))).toBe(true);
    });
  });

  describe('rebuildIndex', () => {
    it('should return failed status when no directory path set', async () => {
      const health = await indexer.rebuildIndex();
      
      expect(health.status).toBe('failed');
      expect(health.errors).toContain('Cannot rebuild: no directory path set. Call indexDirectory() first.');
    });
    
    it('should rebuild index successfully', async () => {
      const file = path.join(testDir, 'doc.md');
      fs.writeFileSync(file, SAMPLE_DOC_1);
      await indexer.indexDirectory(testDir);
      
      // Modify file
      const modifiedContent = SAMPLE_DOC_1.replace(
        'Test document for indexer',
        'Rebuilt test document'
      );
      fs.writeFileSync(file, modifiedContent);
      
      // Rebuild index
      const health = await indexer.rebuildIndex();
      
      expect(health.status).toBe('healthy');
      expect(health.documentsIndexed).toBe(1);
      
      // Verify content was updated
      const summary = indexer.getDocumentSummary(file);
      expect(summary.metadata.purpose).toBe('Rebuilt test document');
    });
    
    it('should include new files after rebuild', async () => {
      const file1 = path.join(testDir, 'doc1.md');
      fs.writeFileSync(file1, SAMPLE_DOC_1);
      await indexer.indexDirectory(testDir);
      
      // Add new file
      const file2 = path.join(testDir, 'doc2.md');
      fs.writeFileSync(file2, SAMPLE_DOC_2);
      
      // Rebuild index
      const health = await indexer.rebuildIndex();
      
      expect(health.status).toBe('healthy');
      expect(health.documentsIndexed).toBe(2);
    });
  });

  describe('logIndexStateChange', () => {
    let logsDir: string;
    let logIndexer: DocumentIndexer;
    
    beforeEach(() => {
      logsDir = path.join(testDir, 'logs');
      logIndexer = new DocumentIndexer(logsDir);
    });
    
    afterEach(() => {
      // Clean up logs directory
      if (fs.existsSync(logsDir)) {
        fs.rmSync(logsDir, { recursive: true, force: true });
      }
    });
    
    it('should create log file and write entries', () => {
      logIndexer.logIndexStateChange('test_event', { key: 'value' });
      
      const logPath = path.join(logsDir, 'index-state.log');
      expect(fs.existsSync(logPath)).toBe(true);
      
      const logContent = fs.readFileSync(logPath, 'utf-8');
      const logEntry = JSON.parse(logContent.trim());
      
      expect(logEntry.event).toBe('test_event');
      expect(logEntry.key).toBe('value');
      expect(logEntry.timestamp).toBeDefined();
    });
    
    it('should append multiple log entries', () => {
      logIndexer.logIndexStateChange('event_1', { data: 1 });
      logIndexer.logIndexStateChange('event_2', { data: 2 });
      
      const logPath = path.join(logsDir, 'index-state.log');
      const logContent = fs.readFileSync(logPath, 'utf-8');
      const lines = logContent.trim().split('\n');
      
      expect(lines).toHaveLength(2);
      
      const entry1 = JSON.parse(lines[0]);
      const entry2 = JSON.parse(lines[1]);
      
      expect(entry1.event).toBe('event_1');
      expect(entry2.event).toBe('event_2');
    });
    
    it('should log indexing events automatically', async () => {
      const file = path.join(testDir, 'doc.md');
      fs.writeFileSync(file, SAMPLE_DOC_1);
      
      await logIndexer.indexDirectory(testDir);
      
      const logPath = path.join(logsDir, 'index-state.log');
      const logContent = fs.readFileSync(logPath, 'utf-8');
      const lines = logContent.trim().split('\n');
      
      // Should have indexing_started and indexing_completed events
      const events = lines.map((line: string) => JSON.parse(line).event);
      expect(events).toContain('indexing_started');
      expect(events).toContain('indexing_completed');
    });
  });

  describe('getIndexHealth', () => {
    it('should return same result as validateIndexOnStartup', async () => {
      const file = path.join(testDir, 'doc.md');
      fs.writeFileSync(file, SAMPLE_DOC_1);
      await indexer.indexDirectory(testDir);
      
      const health1 = indexer.validateIndexOnStartup();
      const health2 = indexer.getIndexHealth();
      
      expect(health1.status).toBe(health2.status);
      expect(health1.documentsIndexed).toBe(health2.documentsIndexed);
      expect(health1.errors).toEqual(health2.errors);
    });
  });
});
