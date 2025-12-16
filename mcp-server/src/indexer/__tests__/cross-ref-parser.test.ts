/**
 * Tests for Cross-Reference Parser
 * 
 * Validates mechanical extraction of markdown links without content interpretation.
 */

import { extractCrossReferences } from '../cross-ref-parser';

describe('extractCrossReferences', () => {
  describe('basic link extraction', () => {
    it('should extract markdown links to .md files', () => {
      const content = `
# Document Title

This is a reference to [another document](./other-doc.md).
`;
      
      const refs = extractCrossReferences(content, 'test.md');
      
      expect(refs).toHaveLength(1);
      expect(refs[0]).toEqual({
        target: './other-doc.md',
        context: 'another document',
        section: '',
        lineNumber: 4
      });
    });

    it('should extract multiple links from the same line', () => {
      const content = `
See [doc1](./doc1.md) and [doc2](./doc2.md) for details.
`;
      
      const refs = extractCrossReferences(content, 'test.md');
      
      expect(refs).toHaveLength(2);
      expect(refs[0].target).toBe('./doc1.md');
      expect(refs[0].context).toBe('doc1');
      expect(refs[1].target).toBe('./doc2.md');
      expect(refs[1].context).toBe('doc2');
    });

    it('should extract links from multiple lines', () => {
      const content = `
First reference: [doc1](./doc1.md)

Second reference: [doc2](./doc2.md)

Third reference: [doc3](./doc3.md)
`;
      
      const refs = extractCrossReferences(content, 'test.md');
      
      expect(refs).toHaveLength(3);
      expect(refs[0].target).toBe('./doc1.md');
      expect(refs[1].target).toBe('./doc2.md');
      expect(refs[2].target).toBe('./doc3.md');
    });
  });

  describe('section tracking', () => {
    it('should track current section for references', () => {
      const content = `
## Introduction

This is a reference to [doc1](./doc1.md).

## Implementation

This is a reference to [doc2](./doc2.md).
`;
      
      const refs = extractCrossReferences(content, 'test.md');
      
      expect(refs).toHaveLength(2);
      expect(refs[0].section).toBe('Introduction');
      expect(refs[1].section).toBe('Implementation');
    });

    it('should use empty string for section before first heading', () => {
      const content = `
This is a reference to [doc1](./doc1.md) before any heading.

## First Section

This is a reference to [doc2](./doc2.md).
`;
      
      const refs = extractCrossReferences(content, 'test.md');
      
      expect(refs).toHaveLength(2);
      expect(refs[0].section).toBe('');
      expect(refs[1].section).toBe('First Section');
    });

    it('should update section as headings change', () => {
      const content = `
## Section A

Reference in A: [doc1](./doc1.md)

## Section B

Reference in B: [doc2](./doc2.md)

## Section C

Reference in C: [doc3](./doc3.md)
`;
      
      const refs = extractCrossReferences(content, 'test.md');
      
      expect(refs).toHaveLength(3);
      expect(refs[0].section).toBe('Section A');
      expect(refs[1].section).toBe('Section B');
      expect(refs[2].section).toBe('Section C');
    });

    it('should only track H2 headings for sections', () => {
      const content = `
## Main Section

### Subsection

Reference: [doc1](./doc1.md)
`;
      
      const refs = extractCrossReferences(content, 'test.md');
      
      expect(refs).toHaveLength(1);
      expect(refs[0].section).toBe('Main Section');
    });
  });

  describe('line number tracking', () => {
    it('should track correct line numbers', () => {
      const content = `Line 1
Line 2
Line 3: [doc1](./doc1.md)
Line 4
Line 5: [doc2](./doc2.md)
`;
      
      const refs = extractCrossReferences(content, 'test.md');
      
      expect(refs).toHaveLength(2);
      expect(refs[0].lineNumber).toBe(3);
      expect(refs[1].lineNumber).toBe(5);
    });
  });

  describe('filtering non-documentation links', () => {
    it('should only include links to .md files', () => {
      const content = `
[Markdown doc](./doc.md)
[External URL](https://example.com)
[Image](./image.png)
[PDF](./document.pdf)
[Another markdown](./another.md)
`;
      
      const refs = extractCrossReferences(content, 'test.md');
      
      expect(refs).toHaveLength(2);
      expect(refs[0].target).toBe('./doc.md');
      expect(refs[1].target).toBe('./another.md');
    });

    it('should filter out anchor links', () => {
      const content = `
[Section anchor](#section)
[Markdown doc](./doc.md)
[Another anchor](#another-section)
`;
      
      const refs = extractCrossReferences(content, 'test.md');
      
      expect(refs).toHaveLength(1);
      expect(refs[0].target).toBe('./doc.md');
    });
  });

  describe('path formats', () => {
    it('should handle relative paths', () => {
      const content = `
[Relative](./doc.md)
[Parent](../doc.md)
[Nested](./nested/doc.md)
`;
      
      const refs = extractCrossReferences(content, 'test.md');
      
      expect(refs).toHaveLength(3);
      expect(refs[0].target).toBe('./doc.md');
      expect(refs[1].target).toBe('../doc.md');
      expect(refs[2].target).toBe('./nested/doc.md');
    });

    it('should handle absolute paths', () => {
      const content = `
[Absolute](/docs/guide.md)
[Another](/specs/design.md)
`;
      
      const refs = extractCrossReferences(content, 'test.md');
      
      expect(refs).toHaveLength(2);
      expect(refs[0].target).toBe('/docs/guide.md');
      expect(refs[1].target).toBe('/specs/design.md');
    });
  });

  describe('context extraction', () => {
    it('should extract link text as context', () => {
      const content = `
[Component Development Guide](./guide.md)
[Design Document](./design.md)
[Requirements Specification](./requirements.md)
`;
      
      const refs = extractCrossReferences(content, 'test.md');
      
      expect(refs).toHaveLength(3);
      expect(refs[0].context).toBe('Component Development Guide');
      expect(refs[1].context).toBe('Design Document');
      expect(refs[2].context).toBe('Requirements Specification');
    });

    it('should handle complex link text', () => {
      const content = `
[See the **bold** guide](./guide.md)
[Link with \`code\`](./code.md)
`;
      
      const refs = extractCrossReferences(content, 'test.md');
      
      expect(refs).toHaveLength(2);
      expect(refs[0].context).toBe('See the **bold** guide');
      expect(refs[1].context).toBe('Link with `code`');
    });
  });

  describe('edge cases', () => {
    it('should handle empty content', () => {
      const refs = extractCrossReferences('', 'test.md');
      expect(refs).toHaveLength(0);
    });

    it('should handle content with no links', () => {
      const content = `
# Document

This is content without any links.

## Section

More content without links.
`;
      
      const refs = extractCrossReferences(content, 'test.md');
      expect(refs).toHaveLength(0);
    });

    it('should handle malformed links gracefully', () => {
      const content = `
[Incomplete link](
[Missing closing bracket](./doc.md
[Valid link](./doc.md)
`;
      
      const refs = extractCrossReferences(content, 'test.md');
      
      // Only the valid link should be extracted
      expect(refs).toHaveLength(1);
      expect(refs[0].target).toBe('./doc.md');
    });

    it('should handle links with section anchors', () => {
      const content = `
[Link with anchor](./doc.md#section)
[Another anchor](./doc.md#another-section)
`;
      
      const refs = extractCrossReferences(content, 'test.md');
      
      // Links with anchors should still be included if they point to .md files
      expect(refs).toHaveLength(2);
      expect(refs[0].target).toBe('./doc.md#section');
      expect(refs[1].target).toBe('./doc.md#another-section');
    });
  });

  describe('mechanical parsing (no interpretation)', () => {
    it('should not interpret link content', () => {
      const content = `
[MUST READ THIS DOCUMENT](./doc.md)
[SKIP THIS SECTION](./skip.md)
[Load when needed](./conditional.md)
`;
      
      const refs = extractCrossReferences(content, 'test.md');
      
      // All links should be extracted without interpretation
      expect(refs).toHaveLength(3);
      expect(refs[0].context).toBe('MUST READ THIS DOCUMENT');
      expect(refs[1].context).toBe('SKIP THIS SECTION');
      expect(refs[2].context).toBe('Load when needed');
    });

    it('should not follow links or load referenced documents', () => {
      const content = `
[Reference to another doc](./other.md)
`;
      
      // This test verifies the function signature and behavior
      // The function should only return metadata, not load files
      const refs = extractCrossReferences(content, 'test.md');
      
      expect(refs).toHaveLength(1);
      expect(refs[0]).toEqual({
        target: './other.md',
        context: 'Reference to another doc',
        section: '',
        lineNumber: 2
      });
      
      // The function should not have any side effects (file loading, etc.)
      // This is verified by the function's pure nature
    });
  });
});
