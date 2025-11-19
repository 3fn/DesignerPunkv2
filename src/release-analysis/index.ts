/**
 * Release Analysis System
 * 
 * Main entry point for the release analysis system providing CLI-driven
 * analysis of changes between releases with version bump recommendations.
 * 
 * Includes performance optimizations for large repositories:
 * - Efficient Git history analysis with caching and batching
 * - Incremental document parsing with intelligent caching
 * - Parallel processing for multiple completion documents
 * - Comprehensive progress reporting for long-running operations
 */

import { EvaluationOptions, AccuracyTestReport, AccuracyTestSummary } from './types';

// CLI Interface
export { ReleaseCLI, runAnalysisCli } from './cli/ReleaseCLI';

// Core Analysis Components
export * from './git';
export * from './collection';
export * from './extraction';
export * from './versioning';
export * from './notes';
export * from './reporting';
export * from './validation';

// Performance Optimizations
export * from './performance';

// Configuration
export * from './config';

// Error Handling
export * from './errors';

// Types
export * from './types/AnalysisTypes';
export type { EvaluationOptions, AccuracyTestReport, AccuracyTestSummary } from './types';