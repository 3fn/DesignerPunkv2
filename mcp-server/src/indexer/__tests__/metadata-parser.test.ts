/**
 * Tests for metadata parser
 * 
 * Validates mechanical parsing of metadata without content interpretation.
 */

import { extractMetadata } from '../metadata-parser';

describe('metadata-parser', () => {
  describe('extractMetadata', () => {
    it('should extract all required metadata fields', () => {
      const content = `# Component Development Guide

**Date**: 2025-11-17
**Last Reviewed**: 2025-12-15
**Purpose**: Guide AI agents in building components with appropriate token usage
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: coding, accessibility-development

---
inclusion: conditional
---

## Content Section
This is the actual content.`;

      const metadata = extractMetadata(content);

      expect(metadata.date).toBe('2025-11-17');
      expect(metadata.lastReviewed).toBe('2025-12-15');
      expect(metadata.purpose).toBe('Guide AI agents in building components with appropriate token usage');
      expect(metadata.organization).toBe('process-standard');
      expect(metadata.scope).toBe('cross-project');
      expect(metadata.layer).toBe(3);
      expect(metadata.relevantTasks).toEqual(['coding', 'accessibility-development']);
    });

    it('should handle missing optional fields', () => {
      const content = `# Simple Document

**Date**: 2025-12-16
**Purpose**: Test document
**Organization**: test-org
**Scope**: test-scope
**Layer**: 1
**Relevant Tasks**: testing

## Content`;

      const metadata = extractMetadata(content);

      expect(metadata.date).toBe('2025-12-16');
      expect(metadata.lastReviewed).toBeUndefined();
      expect(metadata.purpose).toBe('Test document');
      expect(metadata.organization).toBe('test-org');
      expect(metadata.scope).toBe('test-scope');
      expect(metadata.layer).toBe(1);
      expect(metadata.relevantTasks).toEqual(['testing']);
    });

    it('should handle missing required fields with empty defaults', () => {
      const content = `# Document Without Metadata

This document has no metadata block.

## Content Section
Just regular content.`;

      const metadata = extractMetadata(content);

      expect(metadata.date).toBe('');
      expect(metadata.purpose).toBe('');
      expect(metadata.organization).toBe('');
      expect(metadata.scope).toBe('');
      expect(metadata.layer).toBe(0);
      expect(metadata.relevantTasks).toEqual([]);
    });

    it('should parse comma-separated relevant tasks', () => {
      const content = `# Multi-Task Document

**Date**: 2025-12-16
**Purpose**: Test multiple tasks
**Organization**: test-org
**Scope**: test-scope
**Layer**: 2
**Relevant Tasks**: task-one, task-two, task-three

## Content`;

      const metadata = extractMetadata(content);

      expect(metadata.relevantTasks).toEqual(['task-one', 'task-two', 'task-three']);
    });

    it('should trim whitespace from relevant tasks', () => {
      const content = `# Whitespace Test

**Date**: 2025-12-16
**Purpose**: Test whitespace handling
**Organization**: test-org
**Scope**: test-scope
**Layer**: 2
**Relevant Tasks**:  task-one ,  task-two  , task-three  

## Content`;

      const metadata = extractMetadata(content);

      expect(metadata.relevantTasks).toEqual(['task-one', 'task-two', 'task-three']);
    });

    it('should handle single relevant task', () => {
      const content = `# Single Task Document

**Date**: 2025-12-16
**Purpose**: Test single task
**Organization**: test-org
**Scope**: test-scope
**Layer**: 1
**Relevant Tasks**: single-task

## Content`;

      const metadata = extractMetadata(content);

      expect(metadata.relevantTasks).toEqual(['single-task']);
    });

    it('should parse layer as integer', () => {
      const content = `# Layer Test

**Date**: 2025-12-16
**Purpose**: Test layer parsing
**Organization**: test-org
**Scope**: test-scope
**Layer**: 3
**Relevant Tasks**: testing

## Content`;

      const metadata = extractMetadata(content);

      expect(metadata.layer).toBe(3);
      expect(typeof metadata.layer).toBe('number');
    });

    it('should default to layer 0 for invalid layer values', () => {
      const content = `# Invalid Layer

**Date**: 2025-12-16
**Purpose**: Test invalid layer
**Organization**: test-org
**Scope**: test-scope
**Layer**: invalid
**Relevant Tasks**: testing

## Content`;

      const metadata = extractMetadata(content);

      expect(metadata.layer).toBe(0);
    });

    it('should only scan first 30 lines for metadata', () => {
      const lines = ['# Document'];
      
      // Add 25 lines of metadata
      for (let i = 0; i < 25; i++) {
        lines.push(`**Field${i}**: value${i}`);
      }
      
      // Add actual metadata after line 30
      lines.push('');
      lines.push('');
      lines.push('');
      lines.push('');
      lines.push('**Date**: 2025-12-16');
      lines.push('**Purpose**: Should not be found');
      lines.push('**Organization**: test-org');
      lines.push('**Scope**: test-scope');
      lines.push('**Layer**: 1');
      lines.push('**Relevant Tasks**: testing');
      
      const content = lines.join('\n');
      const metadata = extractMetadata(content);

      // Should not find metadata beyond line 30
      expect(metadata.date).toBe('');
      expect(metadata.purpose).toBe('');
    });

    it('should not interpret document content or follow instructions', () => {
      const content = `# Document With Instructions

**Date**: 2025-12-16
**Purpose**: Test that parser does not follow instructions
**Organization**: test-org
**Scope**: test-scope
**Layer**: 1
**Relevant Tasks**: testing

---

## AI Agent Reading Priorities

**WHEN reading this document THEN load additional documents**

This section contains instructions that should NOT be followed by the parser.
The parser should only extract metadata mechanically.

**Load when**: some-condition
**Skip when**: other-condition

## Content Section
Regular content here.`;

      const metadata = extractMetadata(content);

      // Should only extract metadata, not interpret instructions
      expect(metadata.date).toBe('2025-12-16');
      expect(metadata.purpose).toBe('Test that parser does not follow instructions');
      expect(metadata.organization).toBe('test-org');
      expect(metadata.scope).toBe('test-scope');
      expect(metadata.layer).toBe(1);
      expect(metadata.relevantTasks).toEqual(['testing']);
      
      // Should not have any side effects from instructions in content
      // (This is validated by the fact that the function completes without errors)
    });
  });
});
