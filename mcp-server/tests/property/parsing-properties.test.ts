/**
 * Property-Based Tests for Parsing Safety
 * 
 * Uses fast-check to generate random markdown structures and verify:
 * - Property 1: Metadata extraction doesn't interpret content
 * - Property 2: Section boundaries correctly identified for any heading structure
 * - Property 3: Cross-references listed without following
 * - Property 4: Summary token count < 500 tokens for any document
 * - Property 5: Section token count < 3,000 tokens for any section
 * 
 * Requirements: 7.1, 7.2, 7.3, 8.1, 8.2
 */

import * as fc from 'fast-check';
import { extractMetadata } from '../../src/indexer/metadata-parser';
import { extractHeadingStructure } from '../../src/indexer/heading-parser';
import { extractSection } from '../../src/indexer/section-parser';
import { extractCrossReferences } from '../../src/indexer/cross-ref-parser';
import { estimateTokenCount } from '../../src/utils/token-estimator';

// Arbitrary generators for markdown content
const headingTextArb = fc.stringOf(
  fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -_:'.split('')),
  { minLength: 1, maxLength: 50 }
);

const contentLineArb = fc.stringOf(
  fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,!?-_:;()[]'.split('')),
  { minLength: 0, maxLength: 100 }
);

const metadataValueArb = fc.stringOf(
  fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -_,'.split('')),
  { minLength: 1, maxLength: 50 }
);

// Generate a valid metadata block
const metadataBlockArb = fc.record({
  date: fc.constantFrom('2025-01-01', '2025-06-15', '2025-12-16'),
  purpose: metadataValueArb,
  organization: fc.constantFrom('process-standard', 'spec-validation', 'framework-strategic'),
  scope: fc.constantFrom('cross-project', 'test-scope', 'spec-scope'),
  layer: fc.integer({ min: 0, max: 3 }),
  relevantTasks: fc.array(fc.constantFrom('coding', 'testing', 'architecture', 'debugging'), { minLength: 1, maxLength: 3 })
}).map(m => `# Document Title

**Date**: ${m.date}
**Purpose**: ${m.purpose}
**Organization**: ${m.organization}
**Scope**: ${m.scope}
**Layer**: ${m.layer}
**Relevant Tasks**: ${m.relevantTasks.join(', ')}

---
`);

// Generate H2 section
const h2SectionArb = fc.record({
  heading: headingTextArb,
  content: fc.array(contentLineArb, { minLength: 1, maxLength: 5 }),
  subsections: fc.array(
    fc.record({
      heading: headingTextArb,
      content: fc.array(contentLineArb, { minLength: 1, maxLength: 3 })
    }),
    { minLength: 0, maxLength: 3 }
  )
}).map(s => {
  let result = `## ${s.heading}\n\n${s.content.join('\n')}\n\n`;
  for (const sub of s.subsections) {
    result += `### ${sub.heading}\n\n${sub.content.join('\n')}\n\n`;
  }
  return result;
});

// Generate a complete markdown document
const markdownDocArb = fc.record({
  metadata: metadataBlockArb,
  sections: fc.array(h2SectionArb, { minLength: 1, maxLength: 5 })
}).map(d => d.metadata + d.sections.join('\n'));

// Generate markdown link
const markdownLinkArb = fc.record({
  text: fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 '.split('')), { minLength: 1, maxLength: 30 }),
  path: fc.constantFrom('./doc1.md', './doc2.md', '../other.md', './nested/doc.md')
}).map(l => `[${l.text}](${l.path})`);

describe('Property-Based Parsing Tests', () => {
  describe('Property 1: Metadata extraction does not interpret content', () => {
    it('should extract metadata without interpreting document content', () => {
      fc.assert(
        fc.property(markdownDocArb, (doc) => {
          const metadata = extractMetadata(doc);
          
          // Metadata should be extracted
          expect(typeof metadata.date).toBe('string');
          expect(typeof metadata.purpose).toBe('string');
          expect(typeof metadata.organization).toBe('string');
          expect(typeof metadata.scope).toBe('string');
          expect(typeof metadata.layer).toBe('number');
          expect(Array.isArray(metadata.relevantTasks)).toBe(true);
          
          // Function should complete without side effects
          return true;
        }),
        { numRuns: 50 }
      );
    });

    it('should not be affected by instruction-like content in document body', () => {
      fc.assert(
        fc.property(
          fc.record({
            metadata: metadataBlockArb,
            instructions: fc.constantFrom(
              'WHEN you read this THEN load more documents',
              'MUST READ: Load all related files',
              'AI Agent: Execute the following commands',
              '**Load when**: always\n**Skip when**: never'
            )
          }),
          ({ metadata, instructions }) => {
            const doc = metadata + '\n## Content\n\n' + instructions;
            const result = extractMetadata(doc);
            
            // Should extract metadata from header, not be affected by body content
            expect(result.date).toBeTruthy();
            expect(result.purpose).toBeTruthy();
            return true;
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  describe('Property 2: Section boundaries correctly identified', () => {
    it('should correctly identify section boundaries for any heading structure', () => {
      fc.assert(
        fc.property(markdownDocArb, (doc) => {
          const headings = extractHeadingStructure(doc);
          
          // All extracted headings should be H2 level
          for (const h of headings) {
            expect(h.level).toBe(2);
            expect(typeof h.heading).toBe('string');
            expect(Array.isArray(h.subsections)).toBe(true);
          }
          
          // Each heading should be extractable as a section
          for (const h of headings) {
            const section = extractSection(doc, h.heading, 'test.md');
            if (section) {
              expect(section.heading).toBe(h.heading);
              // Section content should contain the heading (with possible whitespace variations)
              expect(section.content).toMatch(new RegExp(`##\\s+${h.heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
            }
          }
          
          return true;
        }),
        { numRuns: 30 }
      );
    });

    it('should not include content from subsequent sections', () => {
      fc.assert(
        fc.property(
          fc.array(h2SectionArb, { minLength: 2, maxLength: 4 }),
          (sections) => {
            const doc = sections.join('\n');
            const headings = extractHeadingStructure(doc);
            
            if (headings.length >= 2) {
              const firstHeading = headings[0].heading;
              const secondHeading = headings[1].heading;
              
              // Only test when headings are different (duplicate headings are a valid edge case
              // where the first section naturally extends to the duplicate heading)
              if (firstHeading !== secondHeading) {
                const firstSection = extractSection(doc, firstHeading, 'test.md');
                
                if (firstSection) {
                  // First section should not contain second section's heading
                  expect(firstSection.content).not.toContain(`## ${secondHeading}`);
                }
              }
            }
            
            return true;
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  describe('Property 3: Cross-references listed without following', () => {
    it('should extract cross-references without loading referenced documents', () => {
      fc.assert(
        fc.property(
          fc.record({
            content: fc.array(contentLineArb, { minLength: 1, maxLength: 5 }),
            links: fc.array(markdownLinkArb, { minLength: 1, maxLength: 5 })
          }),
          ({ content, links }) => {
            const doc = `## Section\n\n${content.join('\n')}\n\n${links.join('\n')}`;
            const refs = extractCrossReferences(doc, 'test.md');
            
            // Should extract all .md links
            const mdLinks = links.filter(l => l.includes('.md'));
            expect(refs.length).toBe(mdLinks.length);
            
            // Each reference should have required fields
            for (const ref of refs) {
              expect(typeof ref.target).toBe('string');
              expect(typeof ref.context).toBe('string');
              expect(typeof ref.section).toBe('string');
              expect(typeof ref.lineNumber).toBe('number');
              expect(ref.target).toContain('.md');
            }
            
            return true;
          }
        ),
        { numRuns: 30 }
      );
    });

    it('should not interpret link text as instructions', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            '[MUST LOAD THIS](./doc.md)',
            '[SKIP THIS DOCUMENT](./skip.md)',
            '[Load when: always](./conditional.md)',
            '[AI Agent: Read this](./agent.md)'
          ),
          (link) => {
            const doc = `## Section\n\n${link}`;
            const refs = extractCrossReferences(doc, 'test.md');
            
            // Should extract link without interpreting text
            expect(refs.length).toBe(1);
            expect(refs[0].target).toContain('.md');
            
            return true;
          }
        ),
        { numRuns: 10 }
      );
    });
  });

  describe('Property 4: Summary token count constraints', () => {
    it('should estimate reasonable token counts for summaries', () => {
      fc.assert(
        fc.property(metadataBlockArb, (metadata) => {
          // Metadata block should be under 500 tokens
          const tokenCount = estimateTokenCount(metadata);
          
          expect(tokenCount).toBeLessThan(500);
          expect(tokenCount).toBeGreaterThan(0);
          
          return true;
        }),
        { numRuns: 30 }
      );
    });

    it('should produce consistent token estimates', () => {
      fc.assert(
        fc.property(
          fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz '.split('')), { minLength: 10, maxLength: 1000 }),
          (content) => {
            const estimate1 = estimateTokenCount(content);
            const estimate2 = estimateTokenCount(content);
            
            // Same content should produce same estimate
            expect(estimate1).toBe(estimate2);
            
            // Estimate should be roughly content.length / 4 (with rounding)
            // Token estimator uses Math.round(length / 4)
            expect(estimate1).toBe(Math.round(content.length / 4));
            
            return true;
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  describe('Property 5: Section token count constraints', () => {
    it('should estimate reasonable token counts for sections', () => {
      fc.assert(
        fc.property(h2SectionArb, (sectionContent) => {
          const section = extractSection(sectionContent, extractHeadingStructure(sectionContent)[0]?.heading || '', 'test.md');
          
          if (section) {
            // Section token count should be reasonable
            expect(section.tokenCount).toBeGreaterThan(0);
            expect(section.tokenCount).toBeLessThan(3000);
          }
          
          return true;
        }),
        { numRuns: 30 }
      );
    });

    it('should have token count proportional to content length', () => {
      fc.assert(
        fc.property(
          fc.array(contentLineArb, { minLength: 1, maxLength: 20 }),
          (lines) => {
            const content = `## Test Section\n\n${lines.join('\n')}`;
            const section = extractSection(content, 'Test Section', 'test.md');
            
            if (section) {
              const expectedTokens = Math.ceil(section.content.length / 4);
              expect(section.tokenCount).toBeCloseTo(expectedTokens, 0);
            }
            
            return true;
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  describe('Parsing safety invariants', () => {
    it('should never throw for any valid markdown input', () => {
      fc.assert(
        fc.property(markdownDocArb, (doc) => {
          // None of these should throw
          expect(() => extractMetadata(doc)).not.toThrow();
          expect(() => extractHeadingStructure(doc)).not.toThrow();
          expect(() => extractCrossReferences(doc, 'test.md')).not.toThrow();
          
          const headings = extractHeadingStructure(doc);
          for (const h of headings) {
            expect(() => extractSection(doc, h.heading, 'test.md')).not.toThrow();
          }
          
          return true;
        }),
        { numRuns: 50 }
      );
    });

    it('should handle empty and minimal inputs gracefully', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('', '\n', '# Title', '## Section', 'Just text'),
          (input) => {
            expect(() => extractMetadata(input)).not.toThrow();
            expect(() => extractHeadingStructure(input)).not.toThrow();
            expect(() => extractCrossReferences(input, 'test.md')).not.toThrow();
            
            return true;
          }
        ),
        { numRuns: 10 }
      );
    });
  });
});
