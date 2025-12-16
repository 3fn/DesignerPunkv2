/**
 * Section Models
 * 
 * Represents a specific section of a document retrieved by heading.
 */

export interface Section {
  /** File path relative to project root */
  path: string;
  
  /** Requested heading */
  heading: string;
  
  /** Section markdown content */
  content: string;
  
  /** Parent heading context (for nested sections) */
  parentHeadings: string[];
  
  /** Section token count */
  tokenCount: number;
}
