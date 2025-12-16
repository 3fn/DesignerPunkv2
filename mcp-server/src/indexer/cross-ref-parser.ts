/**
 * Cross-Reference Parser
 * 
 * Mechanically extracts markdown links from documentation without following them.
 * Tracks source section for each reference to provide context.
 * 
 * Requirements: 5.1, 5.3, 7.2
 */

export interface CrossReference {
  target: string;                  // Referenced document path
  context: string;                 // Context description from link text
  section: string;                 // Source section containing reference
  lineNumber: number;              // Line number in source file
}

/**
 * Extract cross-references from markdown content
 * 
 * Uses mechanical parsing (regex) to extract markdown links without interpreting content.
 * Only includes links to .md files (documentation references).
 * Does NOT follow links or load referenced documents.
 * 
 * @param content - Markdown content to parse
 * @param filePath - Path to the source file (for context)
 * @returns Array of cross-references found in the content
 */
export function extractCrossReferences(content: string, _filePath: string): CrossReference[] {
  const lines = content.split('\n');
  const references: CrossReference[] = [];
  let currentSection = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Track current section (H2 headings only)
    const headingMatch = /^##\s+(.+)$/.exec(line);
    if (headingMatch) {
      currentSection = headingMatch[1].trim();
    }
    
    // Extract markdown links [text](path)
    // Use a while loop to find all matches in the line
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(line)) !== null) {
      const context = match[1];
      const target = match[2];
      
      // Only include links to other documentation files
      // This filters out external URLs, pure anchors, etc.
      // Includes links with section anchors (e.g., ./doc.md#section)
      if (target.includes('.md')) {
        references.push({
          target,
          context,
          section: currentSection,
          lineNumber: i + 1
        });
      }
    }
  }
  
  return references;
}
