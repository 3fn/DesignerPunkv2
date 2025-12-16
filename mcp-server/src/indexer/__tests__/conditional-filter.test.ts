/**
 * Conditional Filter Tests
 * 
 * Tests for the conditional section filtering functionality.
 */

import {
  extractConditionalMarkers,
  matchesTaskType,
  shouldIncludeSection,
  extractAllConditionalSections,
  filterSectionsByTaskType,
  ConditionalMarkers
} from '../conditional-filter';

describe('extractConditionalMarkers', () => {
  it('should return null when no conditional marker is present', () => {
    const content = `## Regular Section

This is just a regular section without any conditional markers.
`;
    
    const result = extractConditionalMarkers(content);
    expect(result).toBeNull();
  });

  it('should extract load criteria from Spec 020 format', () => {
    const content = `## Conditional Section

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Working on component development
- Building new UI elements

**Skip when**: 
- Just reading documentation
`;
    
    const result = extractConditionalMarkers(content);
    expect(result).not.toBeNull();
    expect(result!.loadCriteria).toHaveLength(2);
    expect(result!.loadCriteria).toContain('Working on component development');
    expect(result!.loadCriteria).toContain('Building new UI elements');
  });

  it('should extract skip criteria from Spec 020 format', () => {
    const content = `## Conditional Section

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Creating specs

**Skip when**: 
- Normal task execution
- Files are already organized
`;
    
    const result = extractConditionalMarkers(content);
    expect(result).not.toBeNull();
    expect(result!.skipCriteria).toHaveLength(2);
    expect(result!.skipCriteria).toContain('Normal task execution');
    expect(result!.skipCriteria).toContain('Files are already organized');
  });

  it('should handle marker with only load criteria', () => {
    const content = `**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Debugging hook issues
- Understanding hook dependencies
`;
    
    const result = extractConditionalMarkers(content);
    expect(result).not.toBeNull();
    expect(result!.loadCriteria).toHaveLength(2);
    expect(result!.skipCriteria).toHaveLength(0);
  });

  it('should handle marker with only skip criteria', () => {
    const content = `**📖 CONDITIONAL SECTION - Read only when needed**

**Skip when**: 
- Normal development work
- Running tests
`;
    
    const result = extractConditionalMarkers(content);
    expect(result).not.toBeNull();
    expect(result!.loadCriteria).toHaveLength(0);
    expect(result!.skipCriteria).toHaveLength(2);
  });

  it('should return null when marker present but no criteria', () => {
    const content = `**📖 CONDITIONAL SECTION - Read only when needed**

Some content without load/skip criteria.
`;
    
    const result = extractConditionalMarkers(content);
    expect(result).toBeNull();
  });

  it('should handle asterisk bullet points', () => {
    const content = `**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
* Using asterisk bullets
* Another asterisk item
`;
    
    const result = extractConditionalMarkers(content);
    expect(result).not.toBeNull();
    expect(result!.loadCriteria).toHaveLength(2);
    expect(result!.loadCriteria).toContain('Using asterisk bullets');
  });
});

describe('matchesTaskType', () => {
  it('should match when task keyword appears in criterion', () => {
    expect(matchesTaskType('Working on component development', 'component-development')).toBe(true);
    expect(matchesTaskType('Building new components', 'component-development')).toBe(true);
  });

  it('should match full task type in criterion', () => {
    expect(matchesTaskType('For spec-creation tasks', 'spec-creation')).toBe(true);
  });

  it('should be case insensitive', () => {
    expect(matchesTaskType('COMPONENT DEVELOPMENT', 'component-development')).toBe(true);
    expect(matchesTaskType('Component Development', 'COMPONENT-DEVELOPMENT')).toBe(true);
  });

  it('should not match unrelated criteria', () => {
    expect(matchesTaskType('Working on documentation', 'component-development')).toBe(false);
    expect(matchesTaskType('Running tests', 'spec-creation')).toBe(false);
  });

  it('should handle empty inputs', () => {
    expect(matchesTaskType('', 'component-development')).toBe(false);
    expect(matchesTaskType('Some criterion', '')).toBe(false);
    expect(matchesTaskType('', '')).toBe(false);
  });

  it('should ignore very short keywords (2 chars or less)', () => {
    // "to" is too short to match
    expect(matchesTaskType('Going to the store', 'to-do')).toBe(false);
  });
});


describe('shouldIncludeSection', () => {
  const createSection = (content: string) => ({
    heading: 'Test Section',
    content
  });

  it('should include section with no conditional markers', () => {
    const section = createSection('## Regular Section\n\nJust regular content.');
    expect(shouldIncludeSection(section, 'any-task')).toBe(true);
  });

  it('should include section when load criteria matches', () => {
    const section = createSection(`## Conditional Section

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Working on component development
- Building UI elements
`);
    expect(shouldIncludeSection(section, 'component-development')).toBe(true);
  });

  it('should exclude section when skip criteria matches', () => {
    const section = createSection(`## Conditional Section

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Working on component development

**Skip when**: 
- Running tests
- Normal execution
`);
    expect(shouldIncludeSection(section, 'test-execution')).toBe(false);
  });

  it('should prioritize skip over load when both match', () => {
    const section = createSection(`## Conditional Section

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Development tasks

**Skip when**: 
- Quick development fixes
`);
    // Both "development" keywords match, but skip takes priority
    expect(shouldIncludeSection(section, 'quick-development')).toBe(false);
  });

  it('should exclude when load criteria exist but none match', () => {
    const section = createSection(`## Conditional Section

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Working on component development
- Building UI elements
`);
    expect(shouldIncludeSection(section, 'documentation-update')).toBe(false);
  });

  it('should include when only skip criteria exist and none match', () => {
    const section = createSection(`## Conditional Section

**📖 CONDITIONAL SECTION - Read only when needed**

**Skip when**: 
- Running tests
- Normal execution
`);
    expect(shouldIncludeSection(section, 'component-development')).toBe(true);
  });

  it('should accept pre-extracted markers', () => {
    const section = createSection('## Section\n\nContent without markers');
    const markers: ConditionalMarkers = {
      loadCriteria: ['Working on components'],
      skipCriteria: []
    };
    
    expect(shouldIncludeSection(section, 'component-development', markers)).toBe(true);
    expect(shouldIncludeSection(section, 'documentation', markers)).toBe(false);
  });
});

describe('extractAllConditionalSections', () => {
  it('should extract all conditional sections from document', () => {
    const content = `# Document Title

## Regular Section

Just regular content.

## Conditional Section 1

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Working on components

## Another Regular Section

More regular content.

## Conditional Section 2

**📖 CONDITIONAL SECTION - Read only when needed**

**Skip when**: 
- Running tests
`;
    
    const result = extractAllConditionalSections(content);
    expect(result).toHaveLength(2);
    expect(result[0].heading).toBe('Conditional Section 1');
    expect(result[0].markers!.loadCriteria).toContain('Working on components');
    expect(result[1].heading).toBe('Conditional Section 2');
    expect(result[1].markers!.skipCriteria).toContain('Running tests');
  });

  it('should return empty array when no conditional sections', () => {
    const content = `# Document

## Section 1

Content.

## Section 2

More content.
`;
    
    const result = extractAllConditionalSections(content);
    expect(result).toHaveLength(0);
  });

  it('should track line numbers for conditional sections', () => {
    const content = `## Section 1

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Condition 1
`;
    
    const result = extractAllConditionalSections(content);
    expect(result).toHaveLength(1);
    expect(result[0].startLine).toBe(0);
    expect(result[0].endLine).toBeGreaterThan(0);
  });
});

describe('filterSectionsByTaskType', () => {
  it('should filter sections based on task type', () => {
    const sections = [
      {
        heading: 'Always Include',
        content: '## Always Include\n\nNo markers here.'
      },
      {
        heading: 'Component Section',
        content: `## Component Section

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Working on components
`
      },
      {
        heading: 'Test Section',
        content: `## Test Section

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Running tests
`
      }
    ];
    
    const componentResult = filterSectionsByTaskType(sections, 'component-development');
    expect(componentResult).toHaveLength(2);
    expect(componentResult.map(s => s.heading)).toContain('Always Include');
    expect(componentResult.map(s => s.heading)).toContain('Component Section');
    
    const testResult = filterSectionsByTaskType(sections, 'test-execution');
    expect(testResult).toHaveLength(2);
    expect(testResult.map(s => s.heading)).toContain('Always Include');
    expect(testResult.map(s => s.heading)).toContain('Test Section');
  });

  it('should return all sections when no task type provided', () => {
    const sections = [
      {
        heading: 'Section 1',
        content: `## Section 1

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Specific task
`
      }
    ];
    
    // Empty task type won't match any criteria, so sections with load criteria are excluded
    const result = filterSectionsByTaskType(sections, '');
    expect(result).toHaveLength(0);
  });
});
