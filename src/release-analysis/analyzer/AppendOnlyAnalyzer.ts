/**
 * Append-Only Analyzer for Release Analysis Performance Optimization
 * 
 * Analyzes only new completion documents and appends results to accumulated results,
 * enabling O(m) complexity where m = new documents instead of O(n) where n = total documents.
 * 
 * Requirements addressed:
 * - 5.1: Append new analysis results to accumulated results
 * - 5.2: Preserve existing results unchanged during append operation
 * - 5.3: Handle empty new document list correctly (no-op)
 * - 5.4: Include all required fields in analysis results
 * - 5.5: Log analysis progress and results
 */

import { DocumentAnalysisResult } from '../state/types';
import { CompletionDocumentCollector } from '../collection/CompletionDocumentCollector';
import { DefaultChangeExtractor } from '../extraction/ChangeExtractor';
import { VersionCalculator } from '../versioning/VersionCalculator';
import { AnalysisConfig } from '../config/AnalysisConfig';
import { CompletionDocument } from '../types/AnalysisTypes';

/**
 * Append-Only Analyzer
 * 
 * Analyzes new completion documents and appends results to accumulated results.
 * Preserves existing results unchanged, enabling incremental analysis.
 */
export class AppendOnlyAnalyzer {
  private collector: CompletionDocumentCollector;
  private extractor: DefaultChangeExtractor;
  private versionCalculator: VersionCalculator;
  private config: AnalysisConfig;

  constructor(config: AnalysisConfig, workingDirectory: string = process.cwd()) {
    this.config = config;
    this.collector = new CompletionDocumentCollector(workingDirectory, config);
    this.extractor = new DefaultChangeExtractor(config.extraction);
    this.versionCalculator = new VersionCalculator();
  }

  /**
   * Analyze new documents and append to accumulated results
   * 
   * Requirement 5.1: Append new analysis results to accumulated results
   * Requirement 5.2: Preserve existing results unchanged
   * Requirement 5.3: Handle empty new document list (return accumulated results unchanged)
   * Requirement 5.4: Create DocumentAnalysisResult objects with all required fields
   * Requirement 5.5: Log analysis progress and results
   * 
   * @param newDocumentPaths - Paths to new completion documents to analyze
   * @param accumulatedResults - Previous analysis results to append to
   * @returns Updated accumulated results with new analysis appended
   */
  async analyzeAndAppend(
    newDocumentPaths: string[],
    accumulatedResults: DocumentAnalysisResult[]
  ): Promise<DocumentAnalysisResult[]> {
    // Requirement 5.3: Handle empty new document list (no-op)
    if (newDocumentPaths.length === 0) {
      console.log('📊 No new documents to analyze');
      return accumulatedResults;
    }

    // Requirement 5.5: Log analysis progress
    console.log(`📊 Analyzing ${newDocumentPaths.length} new document(s)...`);

    try {
      // Parse new documents using existing DocumentCollector
      const collectionResult = await this.collector.collectFromPaths(newDocumentPaths);

      if (collectionResult.errors.length > 0) {
        console.warn(`⚠️  Encountered ${collectionResult.errors.length} error(s) during document collection`);
        collectionResult.errors.forEach(error => {
          console.warn(`   - ${error.filePath}: ${error.error}`);
        });
      }

      const documents = collectionResult.documents;
      console.log(`📄 Successfully loaded ${documents.length} document(s)`);

      // Analyze new documents using existing ChangeExtractor
      const newResults: DocumentAnalysisResult[] = [];

      for (const document of documents) {
        try {
          // Parse document for changes
          const documentChanges = await this.extractor.parseCompletionDocument(document);

          // Determine impact level based on changes
          const impactLevel = this.determineImpactLevel(documentChanges);

          // Extract release note content
          const releaseNoteContent = this.extractReleaseContent(document, documentChanges);

          // Extract spec name and task number from path
          const { specName, taskNumber } = this.extractMetadata(document.path);

          // Requirement 5.4: Create DocumentAnalysisResult with all required fields
          const result: DocumentAnalysisResult = {
            filePath: document.path,
            specName,
            taskNumber,
            impactLevel,
            releaseNoteContent,
            analyzedAtCommit: document.gitCommit || 'unknown'
          };

          newResults.push(result);

          // Requirement 5.5: Log individual document analysis
          console.log(`   ✓ ${document.path} → ${impactLevel} impact`);
        } catch (error) {
          console.error(`   ✗ Failed to analyze ${document.path}: ${error instanceof Error ? error.message : String(error)}`);
          // Continue with other documents even if one fails
        }
      }

      // Requirement 5.1: Append new results to accumulated results
      // Requirement 5.2: Preserve existing results unchanged
      const updatedResults = [...accumulatedResults, ...newResults];

      // Requirement 5.5: Log analysis completion
      console.log(`✅ Analysis complete. Total documents: ${updatedResults.length} (${accumulatedResults.length} existing + ${newResults.length} new)`);

      return updatedResults;
    } catch (error) {
      console.error(`❌ Analysis failed: ${error instanceof Error ? error.message : String(error)}`);
      // On error, return accumulated results unchanged
      return accumulatedResults;
    }
  }

  /**
   * Determine impact level based on document changes
   * 
   * Impact level determines version bump:
   * - major: Breaking changes present
   * - minor: New features present (no breaking changes)
   * - patch: Bug fixes or improvements only
   */
  private determineImpactLevel(documentChanges: any): 'patch' | 'minor' | 'major' {
    // Check for breaking changes (major impact)
    if (documentChanges.breakingChanges && documentChanges.breakingChanges.length > 0) {
      return 'major';
    }

    // Check for new features (minor impact)
    if (documentChanges.newFeatures && documentChanges.newFeatures.length > 0) {
      return 'minor';
    }

    // Default to patch for bug fixes and improvements
    return 'patch';
  }

  /**
   * Extract release note content from document
   * 
   * Extracts relevant content for release notes, prioritizing:
   * 1. Summary section
   * 2. Overview section
   * 3. Document title
   */
  private extractReleaseContent(document: CompletionDocument, documentChanges: any): string {
    const content = document.content;

    // Try to extract summary section
    const summaryMatch = content.match(/##\s+Summary\s*\n+([\s\S]*?)(?=\n##|\n---|\z)/i);
    if (summaryMatch && summaryMatch[1]) {
      return summaryMatch[1].trim();
    }

    // Try to extract overview section
    const overviewMatch = content.match(/##\s+Overview\s*\n+([\s\S]*?)(?=\n##|\n---|\z)/i);
    if (overviewMatch && overviewMatch[1]) {
      return overviewMatch[1].trim();
    }

    // Try to extract implementation details section
    const implMatch = content.match(/##\s+Implementation\s+Details?\s*\n+([\s\S]*?)(?=\n##|\n---|\z)/i);
    if (implMatch && implMatch[1]) {
      return implMatch[1].trim();
    }

    // Fallback to document title
    if (document.metadata.title) {
      return document.metadata.title;
    }

    // Last resort: use first paragraph
    const firstParagraph = content.split('\n\n')[0];
    return firstParagraph.replace(/^#\s+/, '').trim();
  }

  /**
   * Extract spec name and task number from document path
   * 
   * Examples:
   *   .kiro/specs/001-token-fix/completion/task-1-parent-completion.md
   *     → specName: "001-token-fix", taskNumber: "1"
   *   
   *   docs/specs/008-icon-system/task-2-summary.md
   *     → specName: "008-icon-system", taskNumber: "2"
   */
  private extractMetadata(filePath: string): { specName: string; taskNumber: string } {
    // Extract spec name from path
    const specMatch = filePath.match(/specs\/([^\/]+)\//);
    const specName = specMatch ? specMatch[1] : 'unknown';

    // Extract task number from filename
    const taskMatch = filePath.match(/task-(\d+(?:\.\d+)?)/);
    const taskNumber = taskMatch ? taskMatch[1] : 'unknown';

    return { specName, taskNumber };
  }
}
