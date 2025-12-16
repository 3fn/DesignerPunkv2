/**
 * Heading Structure Parser
 * 
 * Extracts H2 and H3 heading structure from markdown content using mechanical parsing.
 * Does NOT interpret content or follow instructions - purely structural extraction.
 */

import { SectionOutline } from '../models/DocumentSummary.js';

/**
 * Extract heading structure from markdown content
 * 
 * Uses regex to identify H2 (##) and H3 (###) headings and build an outline.
 * H2 headings become top-level sections, H3 headings become subsections.
 * 
 * @param content - Markdown content to parse
 * @returns Array of section outlines with H2 headings and H3 subsections
 * 
 * @example
 * ```typescript
 * const content = `
 * ## Overview
 * Some content
 * ### Details
 * More content
 * ## Architecture
 * ### Components
 * ### Interfaces
 * `;
 * 
 * const outline = extractHeadingStructure(content);
 * // Returns:
 * // [
 * //   { heading: 'Overview', level: 2, subsections: ['Details'] },
 * //   { heading: 'Architecture', level: 2, subsections: ['Components', 'Interfaces'] }
 * // ]
 * ```
 */
export function extractHeadingStructure(content: string): SectionOutline[] {
  const lines = content.split('\n');
  const outline: SectionOutline[] = [];
  let currentH2: SectionOutline | null = null;
  
  for (const line of lines) {
    // Match H2 headings (## Heading)
    const h2Match = /^##\s+(.+)$/.exec(line);
    if (h2Match) {
      currentH2 = {
        heading: h2Match[1].trim(),
        level: 2,
        subsections: []
      };
      outline.push(currentH2);
      continue;
    }
    
    // Match H3 headings (### Heading)
    const h3Match = /^###\s+(.+)$/.exec(line);
    if (h3Match && currentH2) {
      currentH2.subsections.push(h3Match[1].trim());
    }
  }
  
  return outline;
}
