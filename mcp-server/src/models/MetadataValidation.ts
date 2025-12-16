/**
 * Metadata Validation Models
 * 
 * Represents the result of validating document metadata.
 */

export interface ValidationIssue {
  /** Metadata field with issue */
  field: string;
  
  /** Description of the issue */
  issue: string;
  
  /** Severity level */
  severity: 'error' | 'warning';
}

export interface MetadataValidation {
  /** File path relative to project root */
  path: string;
  
  /** Whether metadata is valid */
  valid: boolean;
  
  /** Parsed metadata (null if parsing failed) */
  metadata: Record<string, any> | null;
  
  /** List of validation issues */
  issues: ValidationIssue[];
}
