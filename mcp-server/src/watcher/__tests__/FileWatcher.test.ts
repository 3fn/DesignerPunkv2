/**
 * FileWatcher Tests
 * 
 * Tests the FileWatcher class functionality including:
 * - Starting and stopping the watcher
 * - Detecting file modifications
 * - Detecting file additions
 * - Detecting file deletions
 * - Triggering re-indexing on changes
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import * as fs from 'fs';
import * as path from 'path';
import { FileWatcher } from '../FileWatcher';
import { DocumentIndexer } from '../../indexer/DocumentIndexer';

// Test fixtures directory
const TEST_FIXTURES_DIR = path.join(__dirname, 'fixtures');

// Sample document content
const SAMPLE_DOC = `# Sample Document

**Date**: 2025-12-16
**Purpose**: Test document for watcher
**Organization**: test-org
**Scope**: test-scope
**Layer**: 2
**Relevant Tasks**: testing
**Last Reviewed**: 2025-12-16

## Overview

This is a test document.
`;

describe('FileWatcher', () => {
  let indexer: DocumentIndexer;
  let watcher: FileWatcher;
  let testDir: string;
  
  beforeEach(() => {
    indexer = new DocumentIndexer();
    testDir = path.join(TEST_FIXTURES_DIR, `test-${Date.now()}`);
    
    // Create test directory
    fs.mkdirSync(testDir, { recursive: true });
    
    // Create watcher with short debounce for testing
    watcher = new FileWatcher(indexer, testDir, 50);
  });
  
  afterEach(() => {
    // Stop watcher
    watcher.stop();
    
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });
  
  describe('constructor', () => {
    it('should create a FileWatcher instance', () => {
      expect(watcher).toBeInstanceOf(FileWatcher);
    });
    
    it('should not be watching initially', () => {
      expect(watcher.isWatching()).toBe(false);
    });
  });
  
  describe('start', () => {
    it('should start watching the directory', () => {
      watcher.start();
      expect(watcher.isWatching()).toBe(true);
    });
    
    it('should throw error if directory does not exist', () => {
      const nonExistentDir = path.join(testDir, 'non-existent');
      const badWatcher = new FileWatcher(indexer, nonExistentDir);
      
      expect(() => badWatcher.start()).toThrow('Watch directory not found');
    });
    
    it('should stop existing watcher before starting new one', () => {
      watcher.start();
      expect(watcher.isWatching()).toBe(true);
      
      // Start again - should not throw
      watcher.start();
      expect(watcher.isWatching()).toBe(true);
    });
  });
  
  describe('stop', () => {
    it('should stop watching the directory', () => {
      watcher.start();
      expect(watcher.isWatching()).toBe(true);
      
      watcher.stop();
      expect(watcher.isWatching()).toBe(false);
    });
    
    it('should be safe to call stop when not watching', () => {
      expect(watcher.isWatching()).toBe(false);
      
      // Should not throw
      watcher.stop();
      expect(watcher.isWatching()).toBe(false);
    });
  });
  
  describe('file change detection', () => {
    it('should detect file modifications (Requirement 10.1)', async () => {
      // Create initial file and index
      const file = path.join(testDir, 'doc.md');
      fs.writeFileSync(file, SAMPLE_DOC);
      await indexer.indexDirectory(testDir);
      
      // Spy on reindexFile
      const reindexSpy = jest.spyOn(indexer, 'reindexFile');
      
      // Start watching
      watcher.start();
      
      // Modify file
      const modifiedContent = SAMPLE_DOC.replace('Test document', 'Modified document');
      fs.writeFileSync(file, modifiedContent);
      
      // Wait for debounce and file system event
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Verify reindexFile was called
      expect(reindexSpy).toHaveBeenCalledWith(file);
    });
    
    it('should detect file additions (Requirement 10.2)', async () => {
      // Index empty directory
      await indexer.indexDirectory(testDir);
      
      // Spy on reindexFile
      const reindexSpy = jest.spyOn(indexer, 'reindexFile');
      
      // Start watching
      watcher.start();
      
      // Add new file
      const newFile = path.join(testDir, 'new-doc.md');
      fs.writeFileSync(newFile, SAMPLE_DOC);
      
      // Wait for debounce and file system event
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Verify reindexFile was called
      expect(reindexSpy).toHaveBeenCalledWith(newFile);
    });
    
    it('should detect file deletions (Requirement 10.3)', async () => {
      // Create file and index
      const file = path.join(testDir, 'doc.md');
      fs.writeFileSync(file, SAMPLE_DOC);
      await indexer.indexDirectory(testDir);
      
      // Spy on reindexFile
      const reindexSpy = jest.spyOn(indexer, 'reindexFile');
      
      // Start watching
      watcher.start();
      
      // Delete file
      fs.unlinkSync(file);
      
      // Wait for debounce and file system event
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Verify reindexFile was called (it handles deletion)
      expect(reindexSpy).toHaveBeenCalledWith(file);
    });
    
    it('should only process markdown files', async () => {
      // Index directory
      await indexer.indexDirectory(testDir);
      
      // Spy on reindexFile
      const reindexSpy = jest.spyOn(indexer, 'reindexFile');
      
      // Start watching
      watcher.start();
      
      // Add non-markdown file
      const txtFile = path.join(testDir, 'readme.txt');
      fs.writeFileSync(txtFile, 'Not markdown');
      
      // Wait for debounce and file system event
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Verify reindexFile was NOT called
      expect(reindexSpy).not.toHaveBeenCalled();
    });
    
    it('should debounce rapid changes to same file', async () => {
      // Create file and index
      const file = path.join(testDir, 'doc.md');
      fs.writeFileSync(file, SAMPLE_DOC);
      await indexer.indexDirectory(testDir);
      
      // Spy on reindexFile
      const reindexSpy = jest.spyOn(indexer, 'reindexFile');
      
      // Start watching
      watcher.start();
      
      // Make rapid changes
      fs.writeFileSync(file, SAMPLE_DOC + '\n## Change 1');
      fs.writeFileSync(file, SAMPLE_DOC + '\n## Change 2');
      fs.writeFileSync(file, SAMPLE_DOC + '\n## Change 3');
      
      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Verify reindexFile was called only once (debounced)
      expect(reindexSpy).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('isWatching', () => {
    it('should return false when not watching', () => {
      expect(watcher.isWatching()).toBe(false);
    });
    
    it('should return true when watching', () => {
      watcher.start();
      expect(watcher.isWatching()).toBe(true);
    });
    
    it('should return false after stopping', () => {
      watcher.start();
      watcher.stop();
      expect(watcher.isWatching()).toBe(false);
    });
  });
});
