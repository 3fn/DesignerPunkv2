/**
 * Section Parser Tests
 * 
 * Tests mechanical section boundary identification without content interpretation.
 */

import { extractSection } from '../section-parser';

describe('Section Parser', () => {
  describe('extractSection', () => {
    it('should extract H2 section with content', () => {
      const content = `# Document Title

## Introduction

This is the introduction section.

## Overview

This is the overview section.

## Conclusion

This is the conclusion.`;

      const section = extractSection(content, 'Overview', 'test.md');

      expect(section).not.toBeNull();
      expect(section?.heading).toBe('Overview');
      expect(section?.content).toContain('## Overview');
      expect(section?.content).toContain('This is the overview section.');
      expect(section?.content).not.toContain('Conclusion');
      expect(section?.parentHeadings).toEqual([]);
      expect(section?.path).toBe('test.md');
    });

    it('should extract H3 section with parent context', () => {
      const content = `# Document Title

## Architecture

### Components

Component details here.

### Interfaces

Interface details here.

## Design

Design section.`;

      const section = extractSection(content, 'Components', 'test.md');

      expect(section).not.toBeNull();
      expect(section?.heading).toBe('Components');
      expect(section?.content).toContain('### Components');
      expect(section?.content).toContain('Component details here.');
      expect(section?.content).not.toContain('Interfaces');
      expect(section?.parentHeadings).toEqual(['Architecture']);
    });

    it('should stop at next heading of same level', () => {
      const content = `## Section One

Content of section one.

## Section Two

Content of section two.`;

      const section = extractSection(content, 'Section One', 'test.md');

      expect(section).not.toBeNull();
      expect(section?.content).toContain('Section One');
      expect(section?.content).toContain('Content of section one.');
      expect(section?.content).not.toContain('Section Two');
    });

    it('should stop at next heading of higher level', () => {
      const content = `### Subsection

Subsection content.

## Main Section

Main section content.`;

      const section = extractSection(content, 'Subsection', 'test.md');

      expect(section).not.toBeNull();
      expect(section?.content).toContain('Subsection');
      expect(section?.content).toContain('Subsection content.');
      expect(section?.content).not.toContain('Main Section');
    });

    it('should include nested subsections', () => {
      const content = `## Main Section

Main content.

### Subsection A

Subsection A content.

### Subsection B

Subsection B content.

## Next Section

Next content.`;

      const section = extractSection(content, 'Main Section', 'test.md');

      expect(section).not.toBeNull();
      expect(section?.content).toContain('Main Section');
      expect(section?.content).toContain('Subsection A');
      expect(section?.content).toContain('Subsection B');
      expect(section?.content).not.toContain('Next Section');
    });

    it('should return null for non-existent heading', () => {
      const content = `## Section One

Content here.`;

      const section = extractSection(content, 'Non-Existent', 'test.md');

      expect(section).toBeNull();
    });

    it('should handle section at end of document', () => {
      const content = `## First Section

First content.

## Last Section

Last content here.
More last content.`;

      const section = extractSection(content, 'Last Section', 'test.md');

      expect(section).not.toBeNull();
      expect(section?.content).toContain('Last Section');
      expect(section?.content).toContain('Last content here.');
      expect(section?.content).toContain('More last content.');
    });

    it('should estimate token count', () => {
      const content = `## Test Section

This is test content for token estimation.`;

      const section = extractSection(content, 'Test Section', 'test.md');

      expect(section).not.toBeNull();
      expect(section?.tokenCount).toBeGreaterThan(0);
      // Token count should be roughly content length / 4
      expect(section?.tokenCount).toBeCloseTo(section!.content.length / 4, 0);
    });

    it('should not interpret content or follow instructions', () => {
      const content = `## Test Section

WHEN you read this THEN you SHALL load another document.

See [Related Document](./other.md) for more information.

## Next Section

Next content.`;

      const section = extractSection(content, 'Test Section', 'test.md');

      expect(section).not.toBeNull();
      // Should extract content mechanically without interpretation
      expect(section?.content).toContain('WHEN you read this');
      expect(section?.content).toContain('See [Related Document]');
      // Should not follow the link or load other documents
      expect(section?.content).not.toContain('Next Section');
    });

    it('should handle headings with special characters', () => {
      const content = `## Section: Overview & Details

Content with special chars.

## Next Section

Next content.`;

      const section = extractSection(content, 'Section: Overview & Details', 'test.md');

      expect(section).not.toBeNull();
      expect(section?.heading).toBe('Section: Overview & Details');
      expect(section?.content).toContain('Content with special chars.');
    });

    it('should handle empty sections', () => {
      const content = `## Empty Section

## Next Section

Content here.`;

      const section = extractSection(content, 'Empty Section', 'test.md');

      expect(section).not.toBeNull();
      expect(section?.content).toBe('## Empty Section\n');
    });

    it('should track parent heading for nested H3', () => {
      const content = `## Parent Section

Parent content.

### Child Section

Child content.

## Another Parent

More content.`;

      const section = extractSection(content, 'Child Section', 'test.md');

      expect(section).not.toBeNull();
      expect(section?.parentHeadings).toEqual(['Parent Section']);
    });

    it('should not include parent heading for H2 sections', () => {
      const content = `## Section One

Content one.

## Section Two

Content two.`;

      const section = extractSection(content, 'Section Two', 'test.md');

      expect(section).not.toBeNull();
      expect(section?.parentHeadings).toEqual([]);
    });

    it('should handle multiple H3 sections under same H2', () => {
      const content = `## Parent

### First Child

First content.

### Second Child

Second content.

### Third Child

Third content.`;

      const section = extractSection(content, 'Second Child', 'test.md');

      expect(section).not.toBeNull();
      expect(section?.heading).toBe('Second Child');
      expect(section?.content).toContain('Second content.');
      expect(section?.content).not.toContain('First content.');
      expect(section?.content).not.toContain('Third content.');
      expect(section?.parentHeadings).toEqual(['Parent']);
    });
  });
});
