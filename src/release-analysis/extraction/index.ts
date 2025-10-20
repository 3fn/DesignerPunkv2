/**
 * Release Analysis Extraction Module
 * 
 * Exports all extraction-related classes and interfaces for pattern-based
 * change extraction from completion documents.
 */

export { ChangeExtractor, DefaultChangeExtractor } from './ChangeExtractor';
export { SimpleChangeExtractor } from './SimpleChangeExtractor';
export { PatternMatcher } from './PatternMatcher';
export { ChangeCategorizationSystem } from './ChangeCategorizationSystem';
export type { 
  CategorizationResult, 
  SeverityAssessment, 
  FeatureClassification, 
  ImprovementClassification, 
  BugFixClassification 
} from './ChangeCategorizationSystem';

// Re-export types for convenience
export {
  CompletionDocument,
  ExtractedChanges,
  DocumentChanges,
  ExtractionValidation,
  BreakingChange,
  Feature,
  BugFix,
  Improvement,
  DocumentationChange,
  PatternMatch,
  SectionMatch,
  ExtractionMetadata
} from '../types/AnalysisTypes';