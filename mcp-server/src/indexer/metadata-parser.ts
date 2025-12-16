/**
 * Metadata Parser
 * 
 * Mechanically extracts metadata from markdown documents without interpreting content.
 * Uses regex to parse metadata block at the beginning of documents.
 * 
 * Requirements: 2.2, 7.1
 */

export interface Metadata {
  date: string;
  lastReviewed?: string;
  purpose: string;
  organization: string;
  scope: string;
  layer: number;
  relevantTasks: string[];
}

/**
 * Extract metadata from document content using mechanical parsing.
 * 
 * Parses the metadata block at the beginning of the document (first 30 lines)
 * using regex patterns. Does NOT interpret content or follow instructions.
 * 
 * @param content - The full document content
 * @returns Structured metadata object
 */
export function extractMetadata(content: string): Metadata {
  // Extract first 30 lines where metadata typically appears
  const lines = content.split('\n').slice(0, 30);
  
  // Regex pattern to match metadata fields: **FieldName**: value
  const metadataRegex = /\*\*([^*]+)\*\*:\s*(.+)/g;
  
  const rawMetadata: Record<string, string> = {};
  
  // Extract all metadata fields
  for (const line of lines) {
    // Reset regex lastIndex for each line
    metadataRegex.lastIndex = 0;
    const match = metadataRegex.exec(line);
    
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      rawMetadata[key] = value;
    }
  }
  
  // Parse and structure the metadata
  const metadata: Metadata = {
    date: rawMetadata['Date'] || '',
    lastReviewed: rawMetadata['Last Reviewed'],
    purpose: rawMetadata['Purpose'] || '',
    organization: rawMetadata['Organization'] || '',
    scope: rawMetadata['Scope'] || '',
    layer: parseInt(rawMetadata['Layer']) || 0,
    relevantTasks: parseRelevantTasks(rawMetadata['Relevant Tasks'] || '')
  };
  
  return metadata;
}

/**
 * Parse the Relevant Tasks field into an array of task types.
 * Handles comma-separated values and trims whitespace.
 * 
 * @param relevantTasksStr - Raw relevant tasks string
 * @returns Array of task type strings
 */
function parseRelevantTasks(relevantTasksStr: string): string[] {
  if (!relevantTasksStr) {
    return [];
  }
  
  return relevantTasksStr
    .split(',')
    .map(task => task.trim())
    .filter(task => task.length > 0);
}
