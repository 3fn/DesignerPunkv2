/**
 * Section Boundary Parser
 * 
 * Mechanically extracts sections from markdown documents by identifying
 * heading boundaries. Does NOT interpret content or follow instructions.
 */

import { Section } from '../models/Section';

/**
 * Extract a specific section from markdown content by heading
 * 
 * Uses mechanical parsing to identify section boundaries:
 * - Section starts at target heading
 * - Section ends at next heading of same or higher level
 * - Returns section content with parent context
 * 
 * Does NOT interpret content or follow instructions.
 * 
 * @param content - Markdown content to parse
 * @param targetHeading - Heading text to find (without # symbols)
 * @param filePath - File path for the Section object
 * @returns Section object or null if heading not found
 */
export function extractSection(
  content: string,
  targetHeading: string,
  filePath: string
): Section | null {
  const lines = content.split('\n');
  let inSection = false;
  let sectionContent: string[] = [];
  let sectionLevel = 0;
  const parentHeadings: string[] = [];
  let currentH2: string | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this is a heading (H2 or H3)
    const headingMatch = /^(#{2,3})\s+(.+)$/.exec(line);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const heading = headingMatch[2].trim();
      
      // Track parent headings for context
      if (level === 2) {
        currentH2 = heading;
      }
      
      if (heading === targetHeading) {
        // Found target heading - start capturing
        inSection = true;
        sectionLevel = level;
        sectionContent.push(line);
        
        // Add parent context if this is an H3 under an H2
        if (level === 3 && currentH2 && currentH2 !== targetHeading) {
          parentHeadings.push(currentH2);
        }
        
        continue;
      }
      
      if (inSection && level <= sectionLevel) {
        // Reached next section at same or higher level - stop capturing
        break;
      }
    }
    
    if (inSection) {
      sectionContent.push(line);
    }
  }
  
  if (sectionContent.length === 0) {
    return null;
  }
  
  // Estimate token count (simple heuristic: characters / 4)
  const tokenCount = Math.ceil(sectionContent.join('\n').length / 4);
  
  return {
    path: filePath,
    heading: targetHeading,
    content: sectionContent.join('\n'),
    parentHeadings,
    tokenCount
  };
}
