/**
 * Comprehensive Error Handling System for Release Analysis
 * 
 * Provides centralized error handling with graceful recovery strategies,
 * clear error messages, and actionable guidance for users.
 * 
 * Requirements addressed:
 * - 8.1: Validate completion documents are properly formatted and accessible
 * - 8.2: Provide confidence scores for extracted information
 * - 8.3: Provide clear rationale and supporting evidence
 * - 8.4: Highlight areas requiring human review
 * - 8.5: Provide clear, actionable error messages with resolution guidance
 */

import { ErrorContext, ErrorDetails, RecoveryStrategy } from '../types';

export interface ErrorHandlingResult<T = any> {
  success: boolean;
  data?: T;
  error?: ErrorDetails;
  warnings: string[];
  recoveryApplied?: RecoveryStrategy;
}

/**
 * Centralized error handler for release analysis operations
 */
export class ReleaseAnalysisErrorHandler {
  private errorHistory: ErrorDetails[] = [];
  private recoveryAttempts: Map<string, number> = new Map();
  private maxRetryAttempts = 3;

  /**
   * Handle Git repository errors with fallback strategies
   * Requirement 8.5: Clear, actionable error messages with resolution guidance
   */
  async handleGitError(
    error: Error,
    context: ErrorContext,
    fallbackAction?: () => Promise<any>
  ): Promise<ErrorHandlingResult> {
    const errorDetails: ErrorDetails = {
      code: 'GIT_ERROR',
      message: this.extractGitErrorMessage(error),
      severity: this.determineGitErrorSeverity(error),
      category: 'git',
      context,
      recoveryStrategies: this.getGitRecoveryStrategies(error, fallbackAction),
      userGuidance: this.getGitUserGuidance(error),
      technicalDetails: error.message
    };

    this.logError(errorDetails);

    // Attempt automatic recovery
    const recoveryResult = await this.attemptRecovery(errorDetails);
    if (recoveryResult.success) {
      return recoveryResult;
    }

    // If no recovery possible, provide detailed guidance
    return {
      success: false,
      error: errorDetails,
      warnings: [`Git operation failed: ${errorDetails.message}`]
    };
  }

  /**
   * Handle completion document parsing errors with recovery
   * Requirement 8.1: Validate completion documents are properly formatted
   */
  async handleParsingError(
    error: Error,
    filePath: string,
    context: ErrorContext,
    skipOnError = true
  ): Promise<ErrorHandlingResult> {
    const errorDetails: ErrorDetails = {
      code: 'PARSING_ERROR',
      message: `Failed to parse completion document: ${this.extractParsingErrorMessage(error)}`,
      severity: skipOnError ? 'medium' : 'high',
      category: 'parsing',
      context: { ...context, filePath },
      recoveryStrategies: this.getParsingRecoveryStrategies(filePath, skipOnError),
      userGuidance: this.getParsingUserGuidance(error, filePath),
      technicalDetails: error.message
    };

    this.logError(errorDetails);

    // Attempt recovery
    const recoveryResult = await this.attemptRecovery(errorDetails);
    if (recoveryResult.success) {
      return recoveryResult;
    }

    // If skipping is allowed, continue with warning
    if (skipOnError) {
      return {
        success: true,
        data: null,
        warnings: [`Skipped problematic document: ${filePath} - ${errorDetails.message}`]
      };
    }

    return {
      success: false,
      error: errorDetails,
      warnings: [`Critical parsing error in: ${filePath}`]
    };
  }

  /**
   * Handle validation errors with confidence scoring
   * Requirement 8.2: Provide confidence scores for extracted information
   */
  async handleValidationError(
    error: Error,
    context: ErrorContext,
    confidenceImpact = 0.3
  ): Promise<ErrorHandlingResult> {
    const errorDetails: ErrorDetails = {
      code: 'VALIDATION_ERROR',
      message: `Validation failed: ${error.message}`,
      severity: 'medium',
      category: 'validation',
      context,
      recoveryStrategies: this.getValidationRecoveryStrategies(confidenceImpact),
      userGuidance: this.getValidationUserGuidance(error),
      technicalDetails: error.message
    };

    this.logError(errorDetails);

    // For validation errors, we typically continue with reduced confidence
    return {
      success: true,
      data: { confidenceReduction: confidenceImpact },
      warnings: [`Validation warning: ${errorDetails.message} (confidence reduced by ${Math.round(confidenceImpact * 100)}%)`],
      error: errorDetails
    };
  }

  /**
   * Handle configuration errors with clear guidance
   * Requirement 8.5: Clear, actionable error messages with resolution guidance
   */
  async handleConfigurationError(
    error: Error,
    context: ErrorContext,
    configPath?: string
  ): Promise<ErrorHandlingResult> {
    const errorDetails: ErrorDetails = {
      code: 'CONFIG_ERROR',
      message: `Configuration error: ${error.message}`,
      severity: 'high',
      category: 'configuration',
      context: { ...context, filePath: configPath },
      recoveryStrategies: this.getConfigurationRecoveryStrategies(configPath),
      userGuidance: this.getConfigurationUserGuidance(error, configPath),
      technicalDetails: error.message
    };

    this.logError(errorDetails);

    // For configuration errors, we typically can't auto-recover
    // Return error details for user to fix
    return {
      success: false,
      error: errorDetails,
      warnings: [`Configuration error prevents analysis: ${errorDetails.message}`]
    };
  }

  /**
   * Handle filesystem errors with fallback strategies
   * Requirement 8.1: Validate completion documents are accessible
   */
  async handleFilesystemError(
    error: Error,
    filePath: string,
    context: ErrorContext,
    operation: 'read' | 'write' | 'access' = 'read'
  ): Promise<ErrorHandlingResult> {
    const errorDetails: ErrorDetails = {
      code: 'FILESYSTEM_ERROR',
      message: `File ${operation} failed: ${this.extractFilesystemErrorMessage(error)}`,
      severity: operation === 'write' ? 'high' : 'medium',
      category: 'filesystem',
      context: { ...context, filePath },
      recoveryStrategies: this.getFilesystemRecoveryStrategies(filePath, operation),
      userGuidance: this.getFilesystemUserGuidance(error, filePath, operation),
      technicalDetails: error.message
    };

    this.logError(errorDetails);

    // Attempt recovery
    const recoveryResult = await this.attemptRecovery(errorDetails);
    if (recoveryResult.success) {
      return recoveryResult;
    }

    // For read operations, we can often continue without the file
    if (operation === 'read') {
      return {
        success: true,
        data: null,
        warnings: [`Could not read file: ${filePath} - continuing without it`],
        error: errorDetails
      };
    }

    return {
      success: false,
      error: errorDetails,
      warnings: [`Critical filesystem error: ${errorDetails.message}`]
    };
  }

  /**
   * Create a comprehensive error summary for user review
   * Requirement 8.4: Highlight areas requiring human review
   */
  createErrorSummary(): {
    totalErrors: number;
    criticalErrors: ErrorDetails[];
    recoverableErrors: ErrorDetails[];
    warnings: string[];
    recommendations: string[];
  } {
    const criticalErrors = this.errorHistory.filter(e => e.severity === 'critical');
    const recoverableErrors = this.errorHistory.filter(e => 
      e.severity !== 'critical' && e.recoveryStrategies.length > 0
    );

    const warnings = this.errorHistory
      .filter(e => e.severity === 'low' || e.severity === 'medium')
      .map(e => e.message);

    const recommendations = this.generateRecommendations();

    return {
      totalErrors: this.errorHistory.length,
      criticalErrors,
      recoverableErrors,
      warnings,
      recommendations
    };
  }

  /**
   * Clear error history (useful for new analysis runs)
   */
  clearErrorHistory(): void {
    this.errorHistory = [];
    this.recoveryAttempts.clear();
  }

  /**
   * Get formatted error report for CLI display
   * Requirement 8.3: Provide clear rationale and supporting evidence
   */
  getFormattedErrorReport(): string {
    if (this.errorHistory.length === 0) {
      return '✅ No errors encountered during analysis';
    }

    const summary = this.createErrorSummary();
    let report = `\n📊 Error Summary:\n`;
    report += `   Total Issues: ${summary.totalErrors}\n`;
    report += `   Critical: ${summary.criticalErrors.length}\n`;
    report += `   Recoverable: ${summary.recoverableErrors.length}\n`;
    report += `   Warnings: ${summary.warnings.length}\n\n`;

    // Critical errors
    if (summary.criticalErrors.length > 0) {
      report += `🚨 Critical Errors (require immediate attention):\n`;
      summary.criticalErrors.forEach((error, index) => {
        report += `   ${index + 1}. ${error.message}\n`;
        report += `      💡 ${error.userGuidance}\n\n`;
      });
    }

    // Recoverable errors
    if (summary.recoverableErrors.length > 0) {
      report += `⚠️  Recoverable Issues:\n`;
      summary.recoverableErrors.forEach((error, index) => {
        report += `   ${index + 1}. ${error.message}\n`;
        if (error.recoveryStrategies.length > 0) {
          report += `      🔧 Recovery: ${error.recoveryStrategies[0].description}\n`;
        }
      });
      report += `\n`;
    }

    // Recommendations
    if (summary.recommendations.length > 0) {
      report += `💡 Recommendations:\n`;
      summary.recommendations.forEach((rec, index) => {
        report += `   ${index + 1}. ${rec}\n`;
      });
    }

    return report;
  }

  // Private helper methods

  private async attemptRecovery(errorDetails: ErrorDetails): Promise<ErrorHandlingResult> {
    const errorKey = `${errorDetails.code}-${errorDetails.context.filePath || errorDetails.context.operation}`;
    const attempts = this.recoveryAttempts.get(errorKey) || 0;

    if (attempts >= this.maxRetryAttempts) {
      return { success: false, warnings: ['Maximum recovery attempts exceeded'] };
    }

    this.recoveryAttempts.set(errorKey, attempts + 1);

    // Try each recovery strategy in order
    for (const strategy of errorDetails.recoveryStrategies) {
      if (strategy.action) {
        try {
          const result = await strategy.action();
          return {
            success: true,
            data: result,
            warnings: [`Recovered using: ${strategy.description}`],
            recoveryApplied: strategy
          };
        } catch (recoveryError) {
          // Continue to next strategy
          continue;
        }
      }
    }

    return { success: false, warnings: ['No recovery strategies succeeded'] };
  }

  private logError(error: ErrorDetails): void {
    this.errorHistory.push(error);
    
    // Log to console with appropriate level
    const logLevel = error.severity === 'critical' ? 'error' : 
                    error.severity === 'high' ? 'error' :
                    error.severity === 'medium' ? 'warn' : 'info';
    
    console[logLevel](`[${error.category.toUpperCase()}] ${error.message}`);
    if (error.technicalDetails && error.technicalDetails !== error.message) {
      console.debug(`Technical details: ${error.technicalDetails}`);
    }
  }

  private extractGitErrorMessage(error: Error): string {
    const message = error.message.toLowerCase();
    
    if (message.includes('not a git repository')) {
      return 'Current directory is not a Git repository';
    } else if (message.includes('no such file or directory')) {
      return 'Git repository not found or inaccessible';
    } else if (message.includes('invalid reference') || message.includes('unknown revision')) {
      return 'Invalid Git reference (tag or commit not found)';
    } else if (message.includes('permission denied')) {
      return 'Permission denied accessing Git repository';
    } else if (message.includes('network') || message.includes('connection')) {
      return 'Network error accessing remote Git repository';
    } else {
      return `Git operation failed: ${error.message}`;
    }
  }

  private determineGitErrorSeverity(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    const message = error.message.toLowerCase();
    
    if (message.includes('not a git repository')) {
      return 'critical';
    } else if (message.includes('permission denied')) {
      return 'high';
    } else if (message.includes('invalid reference')) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  private getGitRecoveryStrategies(error: Error, fallbackAction?: () => Promise<any>): RecoveryStrategy[] {
    const message = error.message.toLowerCase();
    const strategies: RecoveryStrategy[] = [];

    if (message.includes('not a git repository')) {
      strategies.push({
        type: 'manual',
        description: 'Initialize Git repository or run from correct directory',
        guidance: 'Run "git init" to initialize a repository or navigate to a directory with a Git repository'
      });
    } else if (message.includes('invalid reference')) {
      strategies.push({
        type: 'fallback',
        description: 'Analyze all available completion documents',
        action: fallbackAction,
        guidance: 'Specify a valid Git tag or commit, or let the system analyze all documents'
      });
    } else if (message.includes('permission denied')) {
      strategies.push({
        type: 'manual',
        description: 'Fix Git repository permissions',
        guidance: 'Check file permissions and ensure you have read access to the Git repository'
      });
    }

    return strategies;
  }

  private getGitUserGuidance(error: Error): string {
    const message = error.message.toLowerCase();
    
    if (message.includes('not a git repository')) {
      return 'Ensure you are running the analysis from within a Git repository. Use "git status" to verify.';
    } else if (message.includes('invalid reference')) {
      return 'Check that the specified tag or commit exists using "git tag -l" or "git log --oneline".';
    } else if (message.includes('permission denied')) {
      return 'Verify you have read permissions for the Git repository and its .git directory.';
    } else {
      return 'Check your Git repository status and ensure all Git operations work correctly.';
    }
  }

  private extractParsingErrorMessage(error: Error): string {
    const message = error.message;
    
    if (message.includes('JSON')) {
      return 'Invalid JSON format in document metadata';
    } else if (message.includes('YAML')) {
      return 'Invalid YAML format in document frontmatter';
    } else if (message.includes('encoding')) {
      return 'File encoding issue (not UTF-8)';
    } else if (message.includes('empty') || message.includes('no content')) {
      return 'Document is empty or contains no readable content';
    } else {
      return 'Document format is not recognized or is corrupted';
    }
  }

  private getParsingRecoveryStrategies(filePath: string, skipOnError: boolean): RecoveryStrategy[] {
    const strategies: RecoveryStrategy[] = [];

    if (skipOnError) {
      strategies.push({
        type: 'skip',
        description: 'Skip this document and continue analysis',
        guidance: 'Document will be excluded from analysis but other documents will be processed'
      });
    }

    strategies.push({
      type: 'manual',
      description: 'Fix document format and retry',
      guidance: `Review and fix the format of ${filePath}, then run analysis again`
    });

    return strategies;
  }

  private getParsingUserGuidance(error: Error, filePath: string): string {
    return `Review the document format in ${filePath}. Ensure it follows the expected completion document structure with proper markdown formatting and metadata headers.`;
  }

  private getValidationRecoveryStrategies(confidenceImpact: number): RecoveryStrategy[] {
    return [{
      type: 'fallback',
      description: `Continue with reduced confidence (${Math.round(confidenceImpact * 100)}% reduction)`,
      guidance: 'Analysis will continue but results may be less reliable'
    }];
  }

  private getValidationUserGuidance(error: Error): string {
    return 'Review the validation error and consider if the extracted information needs manual verification.';
  }

  private getConfigurationRecoveryStrategies(configPath?: string): RecoveryStrategy[] {
    const strategies: RecoveryStrategy[] = [];

    strategies.push({
      type: 'fallback',
      description: 'Use default configuration',
      action: async () => this.getDefaultConfiguration(),
      guidance: 'Analysis will continue with built-in default settings'
    });

    if (configPath) {
      strategies.push({
        type: 'manual',
        description: 'Fix configuration file and retry',
        guidance: `Review and fix the configuration in ${configPath}`
      });
    }

    return strategies;
  }

  private getConfigurationUserGuidance(error: Error, configPath?: string): string {
    if (configPath) {
      return `Check the configuration file at ${configPath} for syntax errors or invalid values.`;
    } else {
      return 'Verify your analysis configuration settings and ensure all required values are provided.';
    }
  }

  private extractFilesystemErrorMessage(error: Error): string {
    const message = error.message.toLowerCase();
    
    if (message.includes('enoent') || message.includes('no such file')) {
      return 'File or directory not found';
    } else if (message.includes('eacces') || message.includes('permission denied')) {
      return 'Permission denied';
    } else if (message.includes('eisdir')) {
      return 'Expected file but found directory';
    } else if (message.includes('enotdir')) {
      return 'Expected directory but found file';
    } else if (message.includes('enospc')) {
      return 'No space left on device';
    } else {
      return error.message;
    }
  }

  private getFilesystemRecoveryStrategies(filePath: string, operation: string): RecoveryStrategy[] {
    const strategies: RecoveryStrategy[] = [];

    if (operation === 'read') {
      strategies.push({
        type: 'skip',
        description: 'Continue without this file',
        guidance: 'Analysis will proceed without the inaccessible file'
      });
    }

    strategies.push({
      type: 'manual',
      description: 'Fix file access issue and retry',
      guidance: `Ensure ${filePath} exists and is accessible, then retry the operation`
    });

    return strategies;
  }

  private getFilesystemUserGuidance(error: Error, filePath: string, operation: string): string {
    const message = error.message.toLowerCase();
    
    if (message.includes('permission')) {
      return `Check file permissions for ${filePath}. You may need to adjust permissions or run with appropriate privileges.`;
    } else if (message.includes('not found')) {
      return `The file ${filePath} does not exist. Verify the path is correct and the file exists.`;
    } else if (message.includes('space')) {
      return 'Free up disk space and try again.';
    } else {
      return `Resolve the filesystem issue with ${filePath} and retry the ${operation} operation.`;
    }
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const errorsByCategory = this.groupErrorsByCategory();

    if (errorsByCategory.git && errorsByCategory.git.length > 0) {
      recommendations.push('Verify Git repository status and ensure all Git operations work correctly');
    }

    if (errorsByCategory.parsing && errorsByCategory.parsing.length > 0) {
      recommendations.push('Review completion document formats and ensure they follow the expected structure');
    }

    if (errorsByCategory.filesystem && errorsByCategory.filesystem.length > 0) {
      recommendations.push('Check file permissions and ensure all required files are accessible');
    }

    if (errorsByCategory.configuration && errorsByCategory.configuration.length > 0) {
      recommendations.push('Review and validate your analysis configuration settings');
    }

    if (errorsByCategory.validation && errorsByCategory.validation.length > 0) {
      recommendations.push('Review validation errors and consider manual verification of results');
    }

    if (this.errorHistory.length > 5) {
      recommendations.push('Consider running analysis with verbose logging to identify patterns in errors');
    }

    return recommendations;
  }

  private groupErrorsByCategory(): Record<string, ErrorDetails[]> {
    return this.errorHistory.reduce((groups, error) => {
      if (!groups[error.category]) {
        groups[error.category] = [];
      }
      groups[error.category].push(error);
      return groups;
    }, {} as Record<string, ErrorDetails[]>);
  }

  private async getDefaultConfiguration(): Promise<any> {
    // Return a basic default configuration
    return {
      extraction: {
        completionPatterns: ['*-completion.md', '.kiro/specs/*/completion/*.md'],
        breakingChangeKeywords: ['breaking', 'breaking change', 'incompatible'],
        featureKeywords: ['feature', 'new', 'add', 'implement'],
        bugFixKeywords: ['fix', 'bug', 'issue', 'resolve'],
        improvementKeywords: ['improve', 'enhance', 'optimize', 'refactor'],
        documentationKeywords: ['documentation', 'docs', 'readme', 'comment']
      },
      versioning: {
        semanticVersioning: true,
        preReleaseHandling: 'increment'
      },
      reporting: {
        defaultFormat: 'summary',
        includeConfidence: true,
        includeMetadata: false
      },
      git: {
        defaultBranch: 'main',
        releaseTagPattern: '^v?\\d+\\.\\d+\\.\\d+$'
      }
    };
  }
}

/**
 * Global error handler instance for release analysis
 */
export const releaseAnalysisErrorHandler = new ReleaseAnalysisErrorHandler();

/**
 * Utility function to wrap operations with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: ErrorContext,
  errorHandler = releaseAnalysisErrorHandler
): Promise<ErrorHandlingResult<T>> {
  try {
    const result = await operation();
    return {
      success: true,
      data: result,
      warnings: []
    };
  } catch (error) {
    if (error instanceof Error) {
      // Determine error type and handle appropriately
      if (context.gitCommand || error.message.includes('git')) {
        return errorHandler.handleGitError(error, context);
      } else if (context.filePath && (error.message.toLowerCase().includes('parse') || error.message.toLowerCase().includes('json') || error.message.toLowerCase().includes('yaml'))) {
        return errorHandler.handleParsingError(error, context.filePath, context);
      } else if (error.message.toLowerCase().includes('config')) {
        return errorHandler.handleConfigurationError(error, context);
      } else if (context.filePath && (error.message.includes('ENOENT') || error.message.includes('permission'))) {
        return errorHandler.handleFilesystemError(error, context.filePath, context);
      } else {
        return errorHandler.handleValidationError(error, context);
      }
    } else {
      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: `Unknown error: ${String(error)}`,
          severity: 'high',
          category: 'validation',
          context,
          recoveryStrategies: [],
          userGuidance: 'An unexpected error occurred. Please check the logs and try again.'
        },
        warnings: []
      };
    }
  }
}