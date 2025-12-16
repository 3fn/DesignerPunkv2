/**
 * Documentation Map Models
 * 
 * Represents the complete four-layer documentation structure with metadata
 * for all documents in the system.
 */

export interface DocumentMetadata {
  /** File path relative to project root */
  path: string;
  
  /** Purpose from metadata */
  purpose: string;
  
  /** Layer number (0-3) */
  layer: number;
  
  /** Task types from metadata */
  relevantTasks: string[];
  
  /** Last reviewed date */
  lastReviewed: string;
  
  /** H2 heading names */
  sections: string[];
  
  /** Estimated token count for full document */
  tokenCount: number;
}

export interface DocumentationMap {
  layers: {
    [layerNumber: string]: {
      /** Layer name: "Meta-Guide", "Foundation", "Frameworks and Patterns", "Specific Implementations" */
      name: string;
      
      /** Documents in this layer */
      documents: DocumentMetadata[];
    };
  };
}
