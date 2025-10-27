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
export { ReleaseCLI, runAnalysisCli } from './cli/ReleaseCLI';
export * from './git';
export * from './collection';
export * from './extraction';
export * from './versioning';
export * from './notes';
export * from './reporting';
export * from './validation';
export * from './performance';
export * from './config';
export * from './errors';
export * from './types/AnalysisTypes';
//# sourceMappingURL=index.d.ts.map