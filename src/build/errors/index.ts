/**
 * Build Errors Module
 * 
 * Exports all error handling functionality including:
 * - Error types and interfaces
 * - Error handler with recovery strategies
 * - Error documentation and suggestions
 * - Error formatting and reporting
 */

// Core error types
export {
  BuildError,
  ErrorCategory,
  ErrorSeverity,
  Platform,
  ErrorCodes,
  createBuildError,
  isBuildError,
} from './BuildError';

// Error handler
export {
  ErrorHandler,
  ErrorHandlerOptions,
  ErrorRecovery,
  RecoveryResult,
} from './ErrorHandler';

// Recovery strategies
export {
  RecoveryStrategyType,
  RecoveryContext,
  RecoveryExecutionResult,
  RecoveryStrategyCoordinator,
  RetryStrategy,
  SkipStrategy,
  FallbackStrategy,
  AbortStrategy,
} from './RecoveryStrategy';

// Error documentation
export {
  ErrorDocumentation,
  ErrorLocation,
  ERROR_DOCUMENTATION,
  getErrorDocumentation,
  enhanceErrorWithDocumentation,
  addErrorLocation,
  formatErrorMessage,
  generateErrorReport,
} from './ErrorDocumentation';

// Error reporting
export {
  ErrorReporter,
  ErrorReport,
  ErrorReportOptions,
  BuildResultSummary,
} from './ErrorReporter';

// Token generation errors
export {
  TokenGenerationErrorCodes,
  createInvalidPrimitiveReferenceError,
  createMissingPrimitiveTokenError,
  createInvalidTokenStructureError,
  createCircularReferenceError,
  createTypeMismatchError,
} from './TokenGenerationError';

// Platform generation errors
export {
  PlatformGenerationErrorCodes,
  createPlatformConversionError,
  createInvalidPlatformSyntaxError,
  createPlatformSpecificError,
  createUnitConversionError,
  createFormatGenerationError,
} from './PlatformGenerationError';

// Token reference errors
export {
  TokenReferenceErrorCodes,
  createTokenNotFoundError,
  createInvalidReferencePathError,
  createAmbiguousReferenceError,
  createReferenceTypeMismatchError,
  createUnresolvedReferenceError,
} from './TokenReferenceError';
