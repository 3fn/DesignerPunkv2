/**
 * Release Analysis Error Handling Module
 * 
 * Exports comprehensive error handling utilities for the release analysis system.
 * Provides centralized error management, recovery strategies, and user guidance.
 */

import { ErrorContext, ErrorDetails } from '../types';
import { withErrorHandling } from './ErrorHandler';

export {
  ReleaseAnalysisErrorHandler,
  releaseAnalysisErrorHandler,
  withErrorHandling,
  type ErrorHandlingResult,
} from './ErrorHandler';

// Re-export types from central types file
export type { ErrorContext, ErrorDetails, RecoveryStrategy } from '../types';

export {
  GitErrorRecovery,
  DocumentErrorRecovery,
  ConfigurationErrorRecovery,
  createRecoveryUtilities,
  type GitRecoveryOptions,
  type DocumentRecoveryOptions,
  type ConfigRecoveryOptions
} from './ErrorRecovery';

// Re-export commonly used error handling patterns
export const createErrorContext = (
  operation: string,
  component: string,
  additionalContext?: Partial<ErrorContext>
): ErrorContext => ({
  operation,
  component,
  timestamp: new Date(),
  ...additionalContext
});

// Utility function for CLI error display
export const formatErrorForCLI = (error: ErrorDetails): string => {
  const severityIcon = {
    low: '💡',
    medium: '⚠️',
    high: '❌',
    critical: '🚨'
  }[error.severity];

  let output = `${severityIcon} ${error.message}\n`;
  
  if (error.userGuidance) {
    output += `   💡 ${error.userGuidance}\n`;
  }

  if (error.recoveryStrategies.length > 0) {
    output += `   🔧 Recovery: ${error.recoveryStrategies[0].description}\n`;
  }

  return output;
};

// Utility function for batch error handling
export const handleMultipleErrors = async <T>(
  operations: Array<() => Promise<T>>,
  context: Omit<ErrorContext, 'operation'>,
  continueOnError = true
): Promise<{
  results: T[];
  errors: ErrorDetails[];
  successCount: number;
}> => {
  const results: T[] = [];
  const errors: ErrorDetails[] = [];

  for (let i = 0; i < operations.length; i++) {
    const operationContext: ErrorContext = {
      ...context,
      operation: `batch-operation-${i}`,
      timestamp: new Date()
    };

    const result = await withErrorHandling(operations[i], operationContext);
    
    if (result.success && result.data !== undefined) {
      results.push(result.data);
    } else if (result.error) {
      errors.push(result.error);
      if (!continueOnError) {
        break;
      }
    }
  }

  return {
    results,
    errors,
    successCount: results.length
  };
};