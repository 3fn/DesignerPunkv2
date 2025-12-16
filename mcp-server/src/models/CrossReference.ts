/**
 * Cross Reference Models
 * 
 * Represents a cross-reference link from one document to another.
 */

export interface CrossReference {
  /** Referenced document path */
  target: string;
  
  /** Context description from link text */
  context: string;
  
  /** Source section containing reference */
  section: string;
  
  /** Line number in source file */
  lineNumber: number;
}
