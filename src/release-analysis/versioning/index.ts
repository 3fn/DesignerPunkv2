/**
 * Versioning module for Release Analysis System
 * 
 * Exports version calculation functionality for semantic versioning
 * based on extracted changes from completion documents.
 */

export { VersionCalculator } from './VersionCalculator';
export type {
  VersionRecommendation,
  ChangeEvidence,
  PreReleaseInfo,
  ValidationResult
} from './VersionCalculator';

export { VersionHistory } from './VersionHistory';
export type {
  VersionHistoryEntry,
  VersionHistoryAnalysis,
  VersionProgressionAnalysis,
  VersionComparisonResult
} from './VersionHistory';