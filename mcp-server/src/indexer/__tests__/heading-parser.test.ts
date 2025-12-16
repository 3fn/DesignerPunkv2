/**
 * Tests for Heading Structure Parser
 * 
 * Validates mechanical parsing of H2/H3 headings without content interpretation.
 */

import { extractHeadingStructure } from '../heading-parser';

describe('extractHeadingStructure', () => {
  it('should extract H2 headings', () => {
    const content = `
# Document Title

## Overview
Some content here

## Architecture
More content
`;

    const result = extractHeadingStructure(content);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      heading: 'Overview',
      level: 2,
      subsections: []
    });
    expect(result[1]).toEqual({
      heading: 'Architecture',
      level: 2,
      subsections: []
    });
  });

  it('should extract H3 subsections under H2 headings', () => {
    const content = `
## Overview
Content

### Details
More content

### Background
Even more

## Architecture

### Components
Component info

### Interfaces
Interface info
`;

    const result = extractHeadingStructure(content);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      heading: 'Overview',
      level: 2,
      subsections: ['Details', 'Background']
    });
    expect(result[1]).toEqual({
      heading: 'Architecture',
      level: 2,
      subsections: ['Components', 'Interfaces']
    });
  });

  it('should handle H3 headings without a parent H2', () => {
    const content = `
### Orphan Subsection
This H3 has no parent H2

## Proper Section
### Proper Subsection
`;

    const result = extractHeadingStructure(content);

    // Orphan H3 should be ignored (no parent H2)
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      heading: 'Proper Section',
      level: 2,
      subsections: ['Proper Subsection']
    });
  });

  it('should handle empty content', () => {
    const result = extractHeadingStructure('');
    expect(result).toEqual([]);
  });

  it('should handle content with no headings', () => {
    const content = `
Just some regular text
with no headings at all
`;

    const result = extractHeadingStructure(content);
    expect(result).toEqual([]);
  });

  it('should trim whitespace from heading text', () => {
    const content = `
##   Overview with spaces   
###    Subsection with spaces    
`;

    const result = extractHeadingStructure(content);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      heading: 'Overview with spaces',
      level: 2,
      subsections: ['Subsection with spaces']
    });
  });

  it('should ignore H1 and H4+ headings', () => {
    const content = `
# H1 Heading (ignored)

## H2 Heading (included)

### H3 Heading (included)

#### H4 Heading (ignored)

##### H5 Heading (ignored)
`;

    const result = extractHeadingStructure(content);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      heading: 'H2 Heading (included)',
      level: 2,
      subsections: ['H3 Heading (included)']
    });
  });

  it('should not interpret content or follow instructions', () => {
    const content = `
## AI Agent Reading Priorities

WHEN reading this document THEN load additional files

### Load These Files
- file1.md
- file2.md

## Normal Section
Regular content
`;

    const result = extractHeadingStructure(content);

    // Should extract structure without interpreting instructions
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      heading: 'AI Agent Reading Priorities',
      level: 2,
      subsections: ['Load These Files']
    });
    expect(result[1]).toEqual({
      heading: 'Normal Section',
      level: 2,
      subsections: []
    });
  });

  it('should handle headings with special characters', () => {
    const content = `
## Overview: System Architecture

### Step 1: Setup

### Step 2: Configuration (Optional)

## FAQ - Common Questions

### Q: How does it work?
`;

    const result = extractHeadingStructure(content);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      heading: 'Overview: System Architecture',
      level: 2,
      subsections: ['Step 1: Setup', 'Step 2: Configuration (Optional)']
    });
    expect(result[1]).toEqual({
      heading: 'FAQ - Common Questions',
      level: 2,
      subsections: ['Q: How does it work?']
    });
  });

  it('should handle multiple H2 sections with varying subsection counts', () => {
    const content = `
## Section A
### Sub A1

## Section B
No subsections

## Section C
### Sub C1
### Sub C2
### Sub C3

## Section D
`;

    const result = extractHeadingStructure(content);

    expect(result).toHaveLength(4);
    expect(result[0].subsections).toHaveLength(1);
    expect(result[1].subsections).toHaveLength(0);
    expect(result[2].subsections).toHaveLength(3);
    expect(result[3].subsections).toHaveLength(0);
  });
});
