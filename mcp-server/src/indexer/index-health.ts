/**
 * Index Health Check Module
 * 
 * Provides health check functionality for the document index.
 * Checks for missing documents, stale index, and malformed metadata.
 * 
 * Requirements: 9.1, 9.2, 9.5
 */

import * as fs from 'fs';
import * as path from 'path';
import { extractMetadata } from './metadata-parser';
import { extractHeadingStructure } from './heading-parser';
import { extractCrossReferences } from './cross-ref-parser';
import { IndexHealth, IndexHealthMetrics, IndexHealthStatus } from '../models';

/**
 * Options for health check
 */
export interface HealthCheckOptions {
  /** Map of indexed document paths to their content */
  indexedDocuments: Map<string, string>;
  /** Directory path being indexed */
  directoryPath: string;
  /** Last index time (ISO string) */
  lastIndexTime?: string;
}

/**
 * Determine the health status of the document index
 * 
 * Checks for:
 * - Missing documents (files in directory not in index)
 * - Stale index (files modified after last index time)
 * - Malformed metadata (documents with invalid or missing metadata)
 * 
 * @param options - Health check options
 * @returns IndexHealth with status, errors, warnings, and metrics
 */
export function determineIndexHealth(options: HealthCheckOptions): IndexHealth {
  const { indexedDocuments, directoryPath, lastIndexTime } = options;
  
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Get expected documents from directory
  const expectedDocs = getExpectedDocuments(directoryPath);
  const indexedPaths = Array.from(indexedDocuments.keys());
  
  // Check for missing documents
  const missingDocs = expectedDocs.filter(doc => !indexedPaths.includes(doc));
  if (missingDocs.length > 0) {
    errors.push(`Missing documents: ${missingDocs.join(', ')}`);
  }
  
  // Check for stale index (files modified after last index time)
  if (lastIndexTime) {
    const lastIndexDate = new Date(lastIndexTime);
    const staleFiles = getStaleFiles(expectedDocs, lastIndexDate);
    if (staleFiles.length > 0) {
      warnings.push(`Stale index: ${staleFiles.length} files modified since last index`);
    }
  }
  
  // Check for malformed metadata
  const malformedDocs = getDocumentsWithMalformedMetadata(indexedDocuments);
  if (malformedDocs.length > 0) {
    warnings.push(`Malformed metadata: ${malformedDocs.join(', ')}`);
  }
  
  // Calculate metrics
  const metrics = calculateIndexMetrics(indexedDocuments);
  
  // Determine status
  let status: IndexHealthStatus;
  if (errors.length > 0) {
    status = 'failed';
  } else if (warnings.length > 0) {
    status = 'degraded';
  } else {
    status = 'healthy';
  }
  
  return {
    status,
    documentsIndexed: indexedDocuments.size,
    lastIndexTime: lastIndexTime || new Date().toISOString(),
    errors,
    warnings,
    metrics
  };
}

/**
 * Get expected documents from a directory
 * Scans recursively for markdown files
 * 
 * @param directoryPath - Directory to scan
 * @returns Array of file paths
 */
function getExpectedDocuments(directoryPath: string): string[] {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }
  
  const files: string[] = [];
  
  function scanDir(dirPath: string): void {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }
  
  scanDir(directoryPath);
  return files;
}

/**
 * Get files that have been modified after the last index time
 * 
 * @param filePaths - Array of file paths to check
 * @param lastIndexTime - Last index time
 * @returns Array of stale file paths
 */
function getStaleFiles(filePaths: string[], lastIndexTime: Date): string[] {
  const staleFiles: string[] = [];
  
  for (const filePath of filePaths) {
    if (!fs.existsSync(filePath)) {
      continue;
    }
    
    const stats = fs.statSync(filePath);
    if (stats.mtime > lastIndexTime) {
      staleFiles.push(filePath);
    }
  }
  
  return staleFiles;
}

/**
 * Get documents with malformed metadata
 * Checks for missing required fields
 * 
 * @param indexedDocuments - Map of document paths to content
 * @returns Array of document paths with malformed metadata
 */
function getDocumentsWithMalformedMetadata(indexedDocuments: Map<string, string>): string[] {
  const malformedDocs: string[] = [];
  const requiredFields = ['purpose', 'layer'];
  
  for (const [filePath, content] of indexedDocuments) {
    const metadata = extractMetadata(content);
    
    // Check for missing required fields
    let hasMalformedMetadata = false;
    
    for (const field of requiredFields) {
      const value = metadata[field as keyof typeof metadata];
      if (value === undefined || value === null || value === '') {
        hasMalformedMetadata = true;
        break;
      }
    }
    
    // Check for invalid layer value
    if (metadata.layer !== undefined && (metadata.layer < 0 || metadata.layer > 3)) {
      hasMalformedMetadata = true;
    }
    
    if (hasMalformedMetadata) {
      malformedDocs.push(filePath);
    }
  }
  
  return malformedDocs;
}

/**
 * Calculate index metrics
 * 
 * @param indexedDocuments - Map of document paths to content
 * @returns Index metrics
 */
function calculateIndexMetrics(indexedDocuments: Map<string, string>): IndexHealthMetrics {
  let totalSections = 0;
  let totalCrossReferences = 0;
  let indexSizeBytes = 0;
  
  for (const [filePath, content] of indexedDocuments) {
    // Count sections
    const outline = extractHeadingStructure(content);
    totalSections += outline.length;
    for (const section of outline) {
      totalSections += section.subsections.length;
    }
    
    // Count cross-references
    const crossRefs = extractCrossReferences(content, filePath);
    totalCrossReferences += crossRefs.length;
    
    // Calculate content size
    indexSizeBytes += Buffer.byteLength(content, 'utf-8');
  }
  
  return {
    totalDocuments: indexedDocuments.size,
    totalSections,
    totalCrossReferences,
    indexSizeBytes
  };
}
