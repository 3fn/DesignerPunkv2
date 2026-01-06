/**
 * Analysis Result Parser
 * 
 * Parses JSON output from the release-analysis CLI and transforms it into
 * automation layer data structures with validation and error handling.
 */

import {
  AnalysisResult,
  AnalysisScope,
  ExtractedChanges,
  VersionRecommendation,
  ConfidenceMetrics,
  CompletionDocument,
  BreakingChange,
  Feature,
  BugFix,
  Improvement,
  DocumentationChange,
  ExtractionMetadata,
  ChangeEvidence
} from '../../release-analysis/types/AnalysisTypes';

/**
 * Validation error for JSON parsing
 */
export class JSONParseError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly value?: any
  ) {
    super(message);
    this.name = 'JSONParseError';
  }
}

/**
 * Validation result for parsed data
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Parser for CLI JSON output
 */
export class AnalysisResultParser {
  /**
   * Parse JSON string into AnalysisResult
   */
  parse(jsonString: string): AnalysisResult {
    // Parse JSON
    let rawData: any;
    try {
      rawData = JSON.parse(jsonString);
    } catch (error) {
      throw new JSONParseError(
        `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        jsonString
      );
    }

    // Validate and transform
    return this.parseAnalysisResult(rawData);
  }

  /**
   * Parse and validate AnalysisResult
   */
  private parseAnalysisResult(data: any): AnalysisResult {
    this.validateRequired(data, ['scope', 'changes', 'versionRecommendation', 'releaseNotes', 'confidence']);

    return {
      scope: this.parseAnalysisScope(data.scope),
      changes: this.parseExtractedChanges(data.changes),
      versionRecommendation: this.parseVersionRecommendation(data.versionRecommendation),
      releaseNotes: this.parseString(data.releaseNotes, 'releaseNotes'),
      confidence: this.parseConfidenceMetrics(data.confidence)
    };
  }

  /**
   * Parse AnalysisScope
   */
  private parseAnalysisScope(data: any): AnalysisScope {
    this.validateRequired(data, ['toCommit', 'completionDocuments', 'analysisDate']);

    return {
      fromTag: data.fromTag !== undefined ? this.parseString(data.fromTag, 'fromTag') : undefined,
      fromCommit: data.fromCommit !== undefined ? this.parseString(data.fromCommit, 'fromCommit') : undefined,
      toCommit: this.parseString(data.toCommit, 'toCommit'),
      completionDocuments: this.parseArray(data.completionDocuments, 'completionDocuments', this.parseCompletionDocument.bind(this)),
      analysisDate: this.parseDate(data.analysisDate, 'analysisDate')
    };
  }

  /**
   * Parse CompletionDocument
   */
  private parseCompletionDocument(data: any): CompletionDocument {
    this.validateRequired(data, ['path', 'content', 'lastModified', 'gitCommit', 'metadata']);

    return {
      path: this.parseString(data.path, 'path'),
      content: this.parseString(data.content, 'content'),
      lastModified: this.parseDate(data.lastModified, 'lastModified'),
      gitCommit: this.parseString(data.gitCommit, 'gitCommit'),
      metadata: this.parseDocumentMetadata(data.metadata)
    };
  }

  /**
   * Parse DocumentMetadata
   */
  private parseDocumentMetadata(data: any): CompletionDocument['metadata'] {
    this.validateRequired(data, ['title', 'type']);

    return {
      title: this.parseString(data.title, 'title'),
      date: data.date !== undefined ? this.parseString(data.date, 'date') : undefined,
      task: data.task !== undefined ? this.parseString(data.task, 'task') : undefined,
      spec: data.spec !== undefined ? this.parseString(data.spec, 'spec') : undefined,
      status: data.status !== undefined ? this.parseString(data.status, 'status') : undefined,
      type: this.parseDocumentType(data.type)
    };
  }

  /**
   * Parse document type
   */
  private parseDocumentType(value: any): 'task-summary' | 'task-completion' | 'spec-completion' | 'other' {
    const validTypes = ['task-summary', 'task-completion', 'spec-completion', 'other'];
    if (!validTypes.includes(value)) {
      throw new JSONParseError(`Invalid document type: ${value}. Must be one of: ${validTypes.join(', ')}`, 'type', value);
    }
    return value;
  }

  /**
   * Parse ExtractedChanges
   */
  private parseExtractedChanges(data: any): ExtractedChanges {
    this.validateRequired(data, ['breakingChanges', 'newFeatures', 'bugFixes', 'improvements', 'documentation', 'metadata']);

    return {
      breakingChanges: this.parseArray(data.breakingChanges, 'breakingChanges', this.parseBreakingChange.bind(this)),
      newFeatures: this.parseArray(data.newFeatures, 'newFeatures', this.parseFeature.bind(this)),
      bugFixes: this.parseArray(data.bugFixes, 'bugFixes', this.parseBugFix.bind(this)),
      improvements: this.parseArray(data.improvements, 'improvements', this.parseImprovement.bind(this)),
      documentation: this.parseArray(data.documentation, 'documentation', this.parseDocumentationChange.bind(this)),
      metadata: this.parseExtractionMetadata(data.metadata)
    };
  }

  /**
   * Parse BreakingChange
   */
  private parseBreakingChange(data: any): BreakingChange {
    this.validateRequired(data, ['id', 'title', 'description', 'affectedAPIs', 'source', 'severity']);

    return {
      id: this.parseString(data.id, 'id'),
      title: this.parseString(data.title, 'title'),
      description: this.parseString(data.description, 'description'),
      affectedAPIs: this.parseStringArray(data.affectedAPIs, 'affectedAPIs'),
      migrationGuidance: data.migrationGuidance !== undefined ? this.parseString(data.migrationGuidance, 'migrationGuidance') : undefined,
      source: this.parseString(data.source, 'source'),
      severity: this.parseSeverity(data.severity)
    };
  }

  /**
   * Parse Feature
   */
  private parseFeature(data: any): Feature {
    this.validateRequired(data, ['id', 'title', 'description', 'benefits', 'requirements', 'artifacts', 'source', 'category']);

    return {
      id: this.parseString(data.id, 'id'),
      title: this.parseString(data.title, 'title'),
      description: this.parseString(data.description, 'description'),
      benefits: this.parseStringArray(data.benefits, 'benefits'),
      requirements: this.parseStringArray(data.requirements, 'requirements'),
      artifacts: this.parseStringArray(data.artifacts, 'artifacts'),
      source: this.parseString(data.source, 'source'),
      category: this.parseString(data.category, 'category')
    };
  }

  /**
   * Parse BugFix
   */
  private parseBugFix(data: any): BugFix {
    this.validateRequired(data, ['id', 'title', 'description', 'affectedComponents', 'source', 'severity']);

    return {
      id: this.parseString(data.id, 'id'),
      title: this.parseString(data.title, 'title'),
      description: this.parseString(data.description, 'description'),
      issueNumber: data.issueNumber !== undefined ? this.parseString(data.issueNumber, 'issueNumber') : undefined,
      issueReference: data.issueReference !== undefined ? this.parseString(data.issueReference, 'issueReference') : undefined,
      affectedComponents: this.parseStringArray(data.affectedComponents, 'affectedComponents'),
      source: this.parseString(data.source, 'source'),
      severity: this.parseSeverity(data.severity)
    };
  }

  /**
   * Parse Improvement
   */
  private parseImprovement(data: any): Improvement {
    this.validateRequired(data, ['id', 'title', 'description', 'type', 'impact', 'source']);

    return {
      id: this.parseString(data.id, 'id'),
      title: this.parseString(data.title, 'title'),
      description: this.parseString(data.description, 'description'),
      type: this.parseImprovementType(data.type),
      impact: this.parseImpact(data.impact),
      source: this.parseString(data.source, 'source')
    };
  }

  /**
   * Parse DocumentationChange
   */
  private parseDocumentationChange(data: any): DocumentationChange {
    this.validateRequired(data, ['id', 'title', 'description', 'type', 'source']);

    return {
      id: this.parseString(data.id, 'id'),
      title: this.parseString(data.title, 'title'),
      description: this.parseString(data.description, 'description'),
      type: this.parseDocumentationChangeType(data.type),
      source: this.parseString(data.source, 'source')
    };
  }

  /**
   * Parse ExtractionMetadata
   */
  private parseExtractionMetadata(data: any): ExtractionMetadata {
    this.validateRequired(data, ['documentsAnalyzed', 'extractionConfidence', 'ambiguousItems', 'filteredItems']);

    return {
      documentsAnalyzed: this.parseNumber(data.documentsAnalyzed, 'documentsAnalyzed'),
      extractionConfidence: this.parseNumber(data.extractionConfidence, 'extractionConfidence'),
      ambiguousItems: this.parseStringArray(data.ambiguousItems, 'ambiguousItems'),
      filteredItems: this.parseStringArray(data.filteredItems, 'filteredItems'),
      deduplication: data.deduplication !== undefined ? this.parseDeduplicationMetadata(data.deduplication) : undefined
    };
  }

  /**
   * Parse DeduplicationMetadata
   */
  private parseDeduplicationMetadata(data: any): ExtractionMetadata['deduplication'] {
    this.validateRequired(data, ['originalCount', 'duplicatesRemoved', 'uncertainDuplicates', 'effectiveness']);

    return {
      originalCount: this.parseNumber(data.originalCount, 'originalCount'),
      duplicatesRemoved: this.parseNumber(data.duplicatesRemoved, 'duplicatesRemoved'),
      uncertainDuplicates: this.parseArray(data.uncertainDuplicates, 'uncertainDuplicates', (item: any) => item), // Simplified for now
      effectiveness: this.parseNumber(data.effectiveness, 'effectiveness')
    };
  }

  /**
   * Parse VersionRecommendation
   */
  private parseVersionRecommendation(data: any): VersionRecommendation {
    this.validateRequired(data, ['currentVersion', 'recommendedVersion', 'bumpType', 'rationale', 'confidence', 'evidence']);

    return {
      currentVersion: this.parseString(data.currentVersion, 'currentVersion'),
      recommendedVersion: this.parseString(data.recommendedVersion, 'recommendedVersion'),
      bumpType: this.parseBumpType(data.bumpType),
      rationale: this.parseString(data.rationale, 'rationale'),
      confidence: this.parseNumber(data.confidence, 'confidence'),
      evidence: this.parseArray(data.evidence, 'evidence', this.parseChangeEvidence.bind(this))
    };
  }

  /**
   * Parse ChangeEvidence
   */
  private parseChangeEvidence(data: any): ChangeEvidence {
    this.validateRequired(data, ['type', 'description', 'source', 'impact']);

    return {
      type: this.parseEvidenceType(data.type),
      description: this.parseString(data.description, 'description'),
      source: this.parseString(data.source, 'source'),
      impact: this.parseImpact(data.impact)
    };
  }

  /**
   * Parse ConfidenceMetrics
   */
  private parseConfidenceMetrics(data: any): ConfidenceMetrics {
    this.validateRequired(data, ['overall', 'extraction', 'categorization', 'deduplication', 'versionCalculation']);

    return {
      overall: this.parseNumber(data.overall, 'overall'),
      extraction: this.parseNumber(data.extraction, 'extraction'),
      categorization: this.parseNumber(data.categorization, 'categorization'),
      deduplication: this.parseNumber(data.deduplication, 'deduplication'),
      versionCalculation: this.parseNumber(data.versionCalculation, 'versionCalculation')
    };
  }

  // Type-specific parsers

  private parseSeverity(value: any): 'low' | 'medium' | 'high' | 'critical' {
    const validSeverities = ['low', 'medium', 'high', 'critical'];
    if (!validSeverities.includes(value)) {
      throw new JSONParseError(`Invalid severity: ${value}. Must be one of: ${validSeverities.join(', ')}`, 'severity', value);
    }
    return value;
  }

  private parseImprovementType(value: any): 'performance' | 'usability' | 'maintainability' | 'security' | 'accessibility' | 'other' {
    const validTypes = ['performance', 'usability', 'maintainability', 'security', 'accessibility', 'other'];
    if (!validTypes.includes(value)) {
      throw new JSONParseError(`Invalid improvement type: ${value}. Must be one of: ${validTypes.join(', ')}`, 'type', value);
    }
    return value;
  }

  private parseImpact(value: any): 'low' | 'medium' | 'high' {
    const validImpacts = ['low', 'medium', 'high'];
    if (!validImpacts.includes(value)) {
      throw new JSONParseError(`Invalid impact: ${value}. Must be one of: ${validImpacts.join(', ')}`, 'impact', value);
    }
    return value;
  }

  private parseDocumentationChangeType(value: any): 'readme' | 'api-docs' | 'examples' | 'comments' | 'other' {
    const validTypes = ['readme', 'api-docs', 'examples', 'comments', 'other'];
    if (!validTypes.includes(value)) {
      throw new JSONParseError(`Invalid documentation change type: ${value}. Must be one of: ${validTypes.join(', ')}`, 'type', value);
    }
    return value;
  }

  private parseBumpType(value: any): 'major' | 'minor' | 'patch' | 'none' {
    const validTypes = ['major', 'minor', 'patch', 'none'];
    if (!validTypes.includes(value)) {
      throw new JSONParseError(`Invalid bump type: ${value}. Must be one of: ${validTypes.join(', ')}`, 'bumpType', value);
    }
    return value;
  }

  private parseEvidenceType(value: any): 'breaking' | 'feature' | 'fix' | 'improvement' {
    const validTypes = ['breaking', 'feature', 'fix', 'improvement'];
    if (!validTypes.includes(value)) {
      throw new JSONParseError(`Invalid evidence type: ${value}. Must be one of: ${validTypes.join(', ')}`, 'type', value);
    }
    return value;
  }

  // Primitive parsers

  private parseString(value: any, field: string): string {
    if (typeof value !== 'string') {
      throw new JSONParseError(`Expected string for field '${field}', got ${typeof value}`, field, value);
    }
    return value;
  }

  private parseNumber(value: any, field: string): number {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new JSONParseError(`Expected number for field '${field}', got ${typeof value}`, field, value);
    }
    return value;
  }

  private parseDate(value: any, field: string): Date {
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new JSONParseError(`Invalid date for field '${field}': ${value}`, field, value);
      }
      return date;
    }
    throw new JSONParseError(`Expected date string or timestamp for field '${field}', got ${typeof value}`, field, value);
  }

  private parseStringArray(value: any, field: string): string[] {
    if (!Array.isArray(value)) {
      throw new JSONParseError(`Expected array for field '${field}', got ${typeof value}`, field, value);
    }
    return value.map((item, index) => {
      if (typeof item !== 'string') {
        throw new JSONParseError(`Expected string at index ${index} in array '${field}', got ${typeof item}`, field, item);
      }
      return item;
    });
  }

  private parseArray<T>(value: any, field: string, parser: (item: any) => T): T[] {
    if (!Array.isArray(value)) {
      throw new JSONParseError(`Expected array for field '${field}', got ${typeof value}`, field, value);
    }
    return value.map((item, index) => {
      try {
        return parser(item);
      } catch (error) {
        if (error instanceof JSONParseError) {
          throw new JSONParseError(
            `Error parsing array item at index ${index} in '${field}': ${error.message}`,
            `${field}[${index}]`,
            item
          );
        }
        throw error;
      }
    });
  }

  private validateRequired(data: any, fields: string[]): void {
    if (typeof data !== 'object' || data === null) {
      throw new JSONParseError('Expected object, got null or non-object');
    }

    for (const field of fields) {
      if (!(field in data)) {
        throw new JSONParseError(`Missing required field: ${field}`, field);
      }
    }
  }

  /**
   * Validate parsed result
   */
  validate(result: AnalysisResult): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate version format
    if (!this.isValidVersion(result.versionRecommendation.currentVersion)) {
      errors.push(`Invalid current version format: ${result.versionRecommendation.currentVersion}`);
    }
    if (!this.isValidVersion(result.versionRecommendation.recommendedVersion)) {
      errors.push(`Invalid recommended version format: ${result.versionRecommendation.recommendedVersion}`);
    }

    // Validate confidence ranges
    if (result.confidence.overall < 0 || result.confidence.overall > 1) {
      errors.push(`Overall confidence out of range: ${result.confidence.overall}`);
    }
    if (result.confidence.extraction < 0 || result.confidence.extraction > 1) {
      errors.push(`Extraction confidence out of range: ${result.confidence.extraction}`);
    }

    // Validate change counts
    const totalChanges = result.changes.breakingChanges.length +
                        result.changes.newFeatures.length +
                        result.changes.bugFixes.length +
                        result.changes.improvements.length;

    if (totalChanges === 0 && result.versionRecommendation.bumpType !== 'none') {
      warnings.push('No changes detected but version bump recommended');
    }

    // Validate breaking changes require major bump
    if (result.changes.breakingChanges.length > 0 && result.versionRecommendation.bumpType !== 'major') {
      warnings.push('Breaking changes detected but not recommending major version bump');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Check if version string is valid semver
   */
  private isValidVersion(version: string): boolean {
    return /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/.test(version);
  }
}
