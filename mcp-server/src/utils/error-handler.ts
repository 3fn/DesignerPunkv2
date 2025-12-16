/**
 * Error handling utilities for MCP Documentation Server
 * Provides error formatting and logging for FileNotFound, SectionNotFound,
 * MalformedMetadata, and InvalidCrossReference errors.
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Error types supported by the error handler
 */
export type MCPErrorType = 
  | 'FileNotFound'
  | 'SectionNotFound'
  | 'MalformedMetadata'
  | 'InvalidCrossReference'
  | 'InvalidParameter';

/**
 * Structured error response returned by error formatting functions
 */
export interface MCPError {
  error: MCPErrorType;
  message: string;
  filePath?: string;
  suggestions?: string[];
  issues?: Array<{ field: string; issue: string; severity: 'error' | 'warning' }>;
  partialContent?: string;
}

/**
 * Error log entry structure
 */
export interface ErrorLogEntry {
  timestamp: string;
  errorType: MCPErrorType;
  filePath: string;
  message: string;
  context?: Record<string, unknown>;
}

/**
 * Default log directory path
 */
const DEFAULT_LOG_DIR = 'logs';
const DEFAULT_LOG_FILE = 'errors.log';

/**
 * ErrorHandler class for formatting and logging MCP server errors
 */
export class ErrorHandler {
  private logDir: string;
  private logFile: string;

  constructor(logDir: string = DEFAULT_LOG_DIR) {
    this.logDir = logDir;
    this.logFile = path.join(logDir, DEFAULT_LOG_FILE);
  }

  /**
   * Ensures the log directory exists
   */
  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }


  /**
   * Formats a FileNotFound error with suggestions for similar files
   * Requirements: 9.1
   */
  formatFileNotFound(filePath: string, suggestions: string[] = []): MCPError {
    return {
      error: 'FileNotFound',
      message: `Document not found: ${filePath}`,
      filePath,
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };
  }

  /**
   * Formats a SectionNotFound error with available sections
   * Requirements: 9.4
   */
  formatSectionNotFound(
    filePath: string,
    heading: string,
    availableSections: string[] = []
  ): MCPError {
    return {
      error: 'SectionNotFound',
      message: `Section "${heading}" not found in ${path.basename(filePath)}`,
      filePath,
      suggestions: availableSections.length > 0 ? availableSections : undefined
    };
  }

  /**
   * Formats a MalformedMetadata error with specific issues
   * Requirements: 9.2
   */
  formatMalformedMetadata(
    filePath: string,
    issues: Array<{ field: string; issue: string; severity: 'error' | 'warning' }>,
    partialContent?: string
  ): MCPError {
    return {
      error: 'MalformedMetadata',
      message: `Metadata validation failed for ${path.basename(filePath)}`,
      filePath,
      issues,
      partialContent
    };
  }

  /**
   * Formats an InvalidCrossReference error
   * Requirements: 9.3
   */
  formatInvalidCrossReference(
    sourceFilePath: string,
    targetPath: string,
    section: string,
    lineNumber: number
  ): MCPError {
    return {
      error: 'InvalidCrossReference',
      message: `Cross-reference target not found: ${targetPath}`,
      filePath: sourceFilePath,
      suggestions: [`Source: ${path.basename(sourceFilePath)}, Section: ${section}, Line: ${lineNumber}`]
    };
  }

  /**
   * Logs an error to the errors.log file
   * Requirements: 9.5
   */
  logError(
    errorType: MCPErrorType,
    filePath: string,
    message: string,
    context?: Record<string, unknown>
  ): void {
    this.ensureLogDirectory();

    const logEntry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      errorType,
      filePath,
      message,
      context
    };

    const logLine = JSON.stringify(logEntry) + '\n';

    try {
      fs.appendFileSync(this.logFile, logLine);
    } catch (error) {
      // If logging fails, output to console as fallback
      console.error('Failed to write to error log:', error);
      console.error('Error entry:', logEntry);
    }
  }

  /**
   * Formats and logs a FileNotFound error
   */
  handleFileNotFound(filePath: string, suggestions: string[] = []): MCPError {
    const error = this.formatFileNotFound(filePath, suggestions);
    this.logError('FileNotFound', filePath, error.message, { suggestions });
    return error;
  }

  /**
   * Formats and logs a SectionNotFound error
   */
  handleSectionNotFound(
    filePath: string,
    heading: string,
    availableSections: string[] = []
  ): MCPError {
    const error = this.formatSectionNotFound(filePath, heading, availableSections);
    this.logError('SectionNotFound', filePath, error.message, { heading, availableSections });
    return error;
  }

  /**
   * Formats and logs a MalformedMetadata error
   */
  handleMalformedMetadata(
    filePath: string,
    issues: Array<{ field: string; issue: string; severity: 'error' | 'warning' }>,
    partialContent?: string
  ): MCPError {
    const error = this.formatMalformedMetadata(filePath, issues, partialContent);
    this.logError('MalformedMetadata', filePath, error.message, { issues });
    return error;
  }

  /**
   * Formats and logs an InvalidCrossReference error
   */
  handleInvalidCrossReference(
    sourceFilePath: string,
    targetPath: string,
    section: string,
    lineNumber: number
  ): MCPError {
    const error = this.formatInvalidCrossReference(sourceFilePath, targetPath, section, lineNumber);
    this.logError('InvalidCrossReference', sourceFilePath, error.message, {
      targetPath,
      section,
      lineNumber
    });
    return error;
  }

  /**
   * Reads recent error log entries
   */
  getRecentErrors(count: number = 10): ErrorLogEntry[] {
    if (!fs.existsSync(this.logFile)) {
      return [];
    }

    try {
      const content = fs.readFileSync(this.logFile, 'utf-8');
      const lines = content.trim().split('\n').filter(line => line.length > 0);
      const recentLines = lines.slice(-count);
      
      return recentLines.map(line => {
        try {
          return JSON.parse(line) as ErrorLogEntry;
        } catch {
          return null;
        }
      }).filter((entry): entry is ErrorLogEntry => entry !== null);
    } catch {
      return [];
    }
  }

  /**
   * Clears the error log file
   */
  clearErrorLog(): void {
    if (fs.existsSync(this.logFile)) {
      fs.writeFileSync(this.logFile, '');
    }
  }
}

/**
 * Default error handler instance
 */
export const errorHandler = new ErrorHandler();
