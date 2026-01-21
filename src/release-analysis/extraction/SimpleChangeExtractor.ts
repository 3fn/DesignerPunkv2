/**
 * Enhanced Change Extractor
 * 
 * Implements sophisticated extraction of changes from completion documents.
 * Integrates complex extraction methods from CompletionAnalyzer with CLI workflow.
 * Uses structured section parsing with pattern-based fallback for maximum accuracy.
 */

// Simple ID generator to avoid module issues
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
import { ExtractionConfig } from '../config/AnalysisConfig';
import {
  CompletionDocument,
  ExtractedChanges,
  DocumentChanges,
  ExtractionValidation,
  BreakingChange,
  Feature,
  BugFix,
  Improvement,
  DocumentationChange,
  PatternMatch,
  SectionMatch,
  DeduplicationMetadata,
  UncertainDuplicateInfo
} from '../types/AnalysisTypes';
import { PatternMatcher } from './PatternMatcher';
import { ChangeCategorizationSystem } from './ChangeCategorizationSystem';
import { DeduplicationEngine } from './DeduplicationEngine';
import { ConfidenceMetrics, ConfidenceScore, ItemConfidenceScore } from './ConfidenceMetrics';

export class SimpleChangeExtractor {
  private config: ExtractionConfig;
  private patternMatcher: PatternMatcher;
  private categorizationSystem: ChangeCategorizationSystem;
  private deduplicationEngine: DeduplicationEngine;
  private confidenceMetrics: ConfidenceMetrics;

  constructor(config: ExtractionConfig) {
    this.config = config;
    this.patternMatcher = new PatternMatcher(config);
    this.categorizationSystem = new ChangeCategorizationSystem(config);
    this.deduplicationEngine = new DeduplicationEngine(config.confidenceThresholds);
    this.confidenceMetrics = new ConfidenceMetrics(config.confidenceThresholds);
  }

  /**
   * Extract changes from multiple completion documents
   */
  public async extractChanges(documents: CompletionDocument[]): Promise<ExtractedChanges> {
    const allChanges: DocumentChanges[] = [];
    const filteredDocuments: string[] = [];

    for (const document of documents) {
      // Check if document should be excluded
      if (this.patternMatcher.shouldExcludeContent(document.content, document.path)) {
        filteredDocuments.push(document.path);
        continue;
      }

      const documentChanges = await this.parseCompletionDocument(document);
      allChanges.push(documentChanges);
    }

    // Aggregate all changes
    const aggregated = this.aggregateChanges(allChanges);

    // Add filtered documents to metadata
    aggregated.metadata.filteredItems = filteredDocuments;

    // Deduplicate similar changes
    const deduplicated = this.deduplicateChanges(aggregated);

    return deduplicated;
  }

  /**
   * Parse a single completion document for changes
   */
  public async parseCompletionDocument(document: CompletionDocument): Promise<DocumentChanges> {
    // Try structured section parsing first
    const sectionMatches = this.patternMatcher.findSectionMatches(document.content);

    if (sectionMatches.length > 0) {
      return this.parseStructuredDocument(document, sectionMatches);
    }

    // Fall back to pattern-based parsing
    return await this.parseUnstructuredDocument(document);
  }

  /**
   * Deduplicate similar changes across documents using enhanced deduplication engine
   */
  public deduplicateChanges(changes: ExtractedChanges): ExtractedChanges {
    // Deduplicate each type of change
    const breakingResult = this.deduplicationEngine.deduplicateBreakingChanges(changes.breakingChanges);
    const featuresResult = this.deduplicationEngine.deduplicateFeatures(changes.newFeatures);
    const bugFixesResult = this.deduplicationEngine.deduplicateBugFixes(changes.bugFixes);
    const improvementsResult = this.deduplicationEngine.deduplicateImprovements(changes.improvements);
    const documentationResult = this.deduplicationEngine.deduplicateDocumentation(changes.documentation);

    // Collect deduplication metadata
    const deduplicationMetadata = this.buildDeduplicationMetadata([
      { type: 'breaking-changes', result: breakingResult },
      { type: 'features', result: featuresResult },
      { type: 'bug-fixes', result: bugFixesResult },
      { type: 'improvements', result: improvementsResult },
      { type: 'documentation', result: documentationResult }
    ]);

    // Update confidence based on deduplication results
    const updatedConfidence = this.calculateConfidenceWithDeduplication(changes, deduplicationMetadata);

    return {
      breakingChanges: breakingResult.items,
      newFeatures: featuresResult.items,
      bugFixes: bugFixesResult.items,
      improvements: improvementsResult.items,
      documentation: documentationResult.items,
      metadata: {
        ...changes.metadata,
        extractionConfidence: updatedConfidence,
        deduplication: deduplicationMetadata
      }
    };
  }

  /**
   * Validate extraction results
   */
  public validateExtraction(changes: ExtractedChanges): ExtractionValidation {
    const errors = [];
    const warnings = [];
    const suggestions = [];

    // Check minimum confidence threshold
    if (changes.metadata.extractionConfidence < this.config.confidenceThresholds.minimumConfidence) {
      errors.push({
        type: 'confidence' as const,
        message: `Extraction confidence (${changes.metadata.extractionConfidence.toFixed(2)}) below minimum threshold (${this.config.confidenceThresholds.minimumConfidence})`
      });
    }

    // Check for ambiguous items
    if (changes.metadata.ambiguousItems.length > 0) {
      warnings.push({
        type: 'ambiguous' as const,
        message: `${changes.metadata.ambiguousItems.length} ambiguous items require review`,
        suggestion: 'Review ambiguous items for proper categorization'
      });
    }

    // Check for uncertain duplicates
    if (changes.metadata.deduplication?.uncertainDuplicates && changes.metadata.deduplication.uncertainDuplicates.length > 0) {
      warnings.push({
        type: 'ambiguous' as const,
        message: `${changes.metadata.deduplication.uncertainDuplicates.length} potential duplicate groups require manual review`,
        suggestion: 'Review potential duplicates to determine if they should be merged or kept separate'
      });
    }

    // Check for empty results
    const totalChanges = changes.breakingChanges.length + changes.newFeatures.length +
      changes.bugFixes.length + changes.improvements.length;

    if (totalChanges === 0) {
      warnings.push({
        type: 'missing-info' as const,
        message: 'No significant changes detected',
        suggestion: 'Verify completion documents contain change information'
      });
    }

    // Suggest review for low confidence items
    if (changes.metadata.extractionConfidence < this.config.confidenceThresholds.reviewThreshold) {
      suggestions.push({
        type: 'validation' as const,
        message: 'Consider manual review of extracted changes',
        action: 'Review and validate extracted changes manually'
      });
    }

    return {
      valid: errors.length === 0,
      confidence: changes.metadata.extractionConfidence,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Parse structured document using enhanced section matches with complex extraction logic
   */
  private parseStructuredDocument(document: CompletionDocument, sectionMatches: SectionMatch[]): DocumentChanges {
    const breakingChanges: BreakingChange[] = [];
    const newFeatures: Feature[] = [];
    const bugFixes: BugFix[] = [];
    const improvements: Improvement[] = [];
    const documentation: DocumentationChange[] = [];
    const ambiguousItems: string[] = [];

    let totalConfidence = 0;
    let sectionCount = 0;

    for (const section of sectionMatches) {
      totalConfidence += section.confidence;
      sectionCount++;

      switch (section.type) {
        case 'breaking':
          breakingChanges.push(...this.extractBreakingChangesFromSection(section, document));
          break;
        case 'feature':
          newFeatures.push(...this.extractFeaturesFromSection(section, document));
          break;
        case 'bugfix':
          bugFixes.push(...this.extractBugFixesFromSection(section, document));
          break;
        case 'improvement':
          improvements.push(...this.extractImprovementsFromSection(section, document));
          break;
        case 'summary':
          // Extract mixed changes from summary section
          const mixedChanges = this.extractMixedChangesFromSection(section, document);
          breakingChanges.push(...mixedChanges.breakingChanges);
          newFeatures.push(...mixedChanges.newFeatures);
          bugFixes.push(...mixedChanges.bugFixes);
          improvements.push(...mixedChanges.improvements);
          ambiguousItems.push(...mixedChanges.ambiguousItems);
          break;
      }
    }

    const confidence = sectionCount > 0 ? totalConfidence / sectionCount : 0.5;

    return {
      document,
      breakingChanges,
      newFeatures,
      bugFixes,
      improvements,
      documentation,
      confidence,
      ambiguousItems
    };
  }

  /**
   * Parse unstructured document using enhanced pattern matching with structured fallback
   */
  private async parseUnstructuredDocument(document: CompletionDocument): Promise<DocumentChanges> {
    // Try enhanced structured extraction first, even for "unstructured" documents
    const breakingChanges = await this.extractBreakingChangesWithStructure(document);
    const newFeatures = await this.extractFeaturesWithStructure(document);
    const bugFixes = await this.extractBugFixesWithStructure(document);

    // Fall back to pattern matching for improvements and documentation
    const patternMatches = this.patternMatcher.findPatternMatches(document.content, document.path);

    const improvements: Improvement[] = [];
    const documentation: DocumentationChange[] = [];
    const ambiguousItems: string[] = [];

    let totalConfidence = 0;
    let matchCount = 0;

    for (const match of patternMatches) {
      totalConfidence += match.confidence;
      matchCount++;

      if (match.confidence < this.config.confidenceThresholds.uncertaintyThreshold) {
        ambiguousItems.push(`${match.match} (line ${match.line})`);
      }

      const changeItem = this.createChangeFromPattern(match, document);

      switch (match.type) {
        case 'improvement':
          improvements.push(changeItem as Improvement);
          break;
        case 'documentation':
          documentation.push(changeItem as DocumentationChange);
          break;
        // Breaking changes, features, and bug fixes are handled by structured extraction
      }
    }

    const confidence = matchCount > 0 ? totalConfidence / matchCount : 0.5; // Higher baseline confidence

    return {
      document,
      breakingChanges,
      newFeatures,
      bugFixes,
      improvements,
      documentation,
      confidence,
      ambiguousItems
    };
  }

  /**
   * Extract breaking changes from a section using enhanced extraction
   */
  private extractBreakingChangesFromSection(section: SectionMatch, document: CompletionDocument): BreakingChange[] {
    const changes: BreakingChange[] = [];
    const items = this.extractListItems(section.content);

    for (const item of items) {
      const affectedAPIs = this.extractAffectedAPIs(item);
      changes.push({
        id: generateId(),
        title: this.extractTitle(item),
        description: item,
        affectedAPIs,
        migrationGuidance: this.extractMigrationGuidance(item),
        source: `${document.path}:${section.startLine}`,
        severity: this.determineBreakingChangeSeverity(item) // Use enhanced severity determination
      });
    }

    return changes;
  }

  /**
   * Extract features from a section
   */
  private extractFeaturesFromSection(section: SectionMatch, document: CompletionDocument): Feature[] {
    const features: Feature[] = [];
    const items = this.extractListItems(section.content);

    for (const item of items) {
      const artifacts = this.extractArtifacts(item);
      features.push({
        id: generateId(),
        title: this.extractTitle(item),
        description: item,
        benefits: this.extractBenefits(item),
        requirements: this.extractRequirements(item),
        artifacts,
        source: `${document.path}:${section.startLine}`,
        category: this.categorizeFeature(item, artifacts)
      });
    }

    return features;
  }

  /**
   * Extract bug fixes from a section
   */
  private extractBugFixesFromSection(section: SectionMatch, document: CompletionDocument): BugFix[] {
    const bugFixes: BugFix[] = [];
    const items = this.extractListItems(section.content);

    for (const item of items) {
      const affectedComponents = this.extractAffectedComponents(item);
      bugFixes.push({
        id: generateId(),
        title: this.extractTitle(item),
        description: item,
        issueNumber: this.extractIssueNumber(item),
        affectedComponents,
        source: `${document.path}:${section.startLine}`,
        severity: this.assessBugFixSeverity(item, affectedComponents)
      });
    }

    return bugFixes;
  }

  /**
   * Extract improvements from a section
   */
  private extractImprovementsFromSection(section: SectionMatch, document: CompletionDocument): Improvement[] {
    const improvements: Improvement[] = [];
    const items = this.extractListItems(section.content);

    for (const item of items) {
      improvements.push({
        id: generateId(),
        title: this.extractTitle(item),
        description: item,
        type: this.categorizeImprovement(item),
        impact: this.assessImprovementImpact(item),
        source: `${document.path}:${section.startLine}`
      });
    }

    return improvements;
  }

  /**
   * Extract mixed changes from summary section
   */
  private extractMixedChangesFromSection(section: SectionMatch, document: CompletionDocument): {
    breakingChanges: BreakingChange[];
    newFeatures: Feature[];
    bugFixes: BugFix[];
    improvements: Improvement[];
    ambiguousItems: string[];
  } {
    const patternMatches = this.patternMatcher.findPatternMatches(section.content, document.path);

    const breakingChanges: BreakingChange[] = [];
    const newFeatures: Feature[] = [];
    const bugFixes: BugFix[] = [];
    const improvements: Improvement[] = [];
    const ambiguousItems: string[] = [];

    for (const match of patternMatches) {
      // Skip matches with zero confidence (negation patterns detected)
      // This is a defensive check - findPatternMatches should already filter these,
      // but we add this as a safety net
      if (match.confidence === 0) {
        continue;
      }
      
      if (match.confidence < this.config.confidenceThresholds.uncertaintyThreshold) {
        ambiguousItems.push(`${match.match} (line ${match.line})`);
      }

      const changeItem = this.createChangeFromPattern(match, document);

      switch (match.type) {
        case 'breaking':
          breakingChanges.push(changeItem as BreakingChange);
          break;
        case 'feature':
          newFeatures.push(changeItem as Feature);
          break;
        case 'bugfix':
          bugFixes.push(changeItem as BugFix);
          break;
        case 'improvement':
          improvements.push(changeItem as Improvement);
          break;
      }
    }

    return { breakingChanges, newFeatures, bugFixes, improvements, ambiguousItems };
  }

  /**
   * Create change item from pattern match
   */
  private createChangeFromPattern(match: PatternMatch, document: CompletionDocument): any {
    const baseItem = {
      id: generateId(),
      title: this.extractTitle(match.context),
      description: match.context,
      source: `${document.path}:${match.line}`
    };

    switch (match.type) {
      case 'breaking':
        const affectedAPIs = this.extractAffectedAPIs(match.context);
        return {
          ...baseItem,
          affectedAPIs,
          migrationGuidance: this.extractMigrationGuidance(match.context),
          severity: this.assessBreakingChangeSeverity(match.context, affectedAPIs)
        } as BreakingChange;

      case 'feature':
        const artifacts = this.extractArtifacts(match.context);
        return {
          ...baseItem,
          benefits: this.extractBenefits(match.context),
          requirements: this.extractRequirements(match.context),
          artifacts,
          category: this.categorizeFeature(match.context, artifacts)
        } as Feature;

      case 'bugfix':
        const affectedComponents = this.extractAffectedComponents(match.context);
        return {
          ...baseItem,
          issueNumber: this.extractIssueNumber(match.context),
          affectedComponents,
          severity: this.assessBugFixSeverity(match.context, affectedComponents)
        } as BugFix;

      case 'improvement':
        return {
          ...baseItem,
          type: this.categorizeImprovement(match.context),
          impact: this.assessImprovementImpact(match.context)
        } as Improvement;

      case 'documentation':
        return {
          ...baseItem,
          type: this.categorizeDocumentation(match.context)
        } as DocumentationChange;

      default:
        return baseItem;
    }
  }

  /**
   * Enhanced section finding from CompletionAnalyzer
   * Provides more sophisticated section detection for structured documents
   */
  private findSections(content: string, sectionNames: string[]): string[] {
    const sections: string[] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim();

      if (sectionNames.some(name =>
        line.includes(`## ${name.toLowerCase()}`) ||
        line.includes(`# ${name.toLowerCase()}`) ||
        line.includes(`**${name.toLowerCase()}`)
      )) {
        // Extract section content without the header
        let sectionContent = '';

        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j];

          // Stop at next section header (more precise detection)
          if (nextLine.match(/^#{1,6}\s/) ||
            nextLine.match(/^\*\*[^*]+\*\*\s*:/) ||
            nextLine.trim() === '') {
            // Skip empty lines at section boundaries
            if (nextLine.trim() !== '') {
              break;
            }
          } else {
            sectionContent += nextLine + '\n';
          }
        }

        // Only add non-empty sections
        if (sectionContent.trim()) {
          sections.push(sectionContent.trim());
        }
      }
    }

    return sections;
  }

  /**
   * Enhanced extraction using structured sections first (from CompletionAnalyzer)
   */
  private async extractBreakingChangesWithStructure(document: CompletionDocument): Promise<BreakingChange[]> {
    const breakingChanges: BreakingChange[] = [];
    const content = document.content;

    // Prioritized extraction strategy: structured sections first
    const breakingChangeSections = this.findSections(content, [
      'breaking changes',
      'breaking change',
      'incompatible changes',
      'migration required',
      'api changes'
    ]);

    if (breakingChangeSections.length > 0) {
      // If structured sections exist, only extract from them
      for (const section of breakingChangeSections) {
        const changes = await this.parseBreakingChangeSection(section, document.path);
        breakingChanges.push(...changes);
      }
    } else {
      // Only fall back to keyword scanning if no structured sections exist
      const lines = content.split('\n');
      const processedSections = new Set<number>();

      for (let i = 0; i < lines.length; i++) {
        if (processedSections.has(i)) continue;

        const line = lines[i];
        const lineContent = line.toLowerCase();

        // Skip lines with negation patterns (e.g., "Breaking Changes: None")
        if (this.hasNegationPattern(lineContent)) {
          continue;
        }

        if (this.config.breakingChangeKeywords.some(keyword =>
          lineContent.includes(keyword.toLowerCase())
        )) {
          const change = await this.createBreakingChangeFromLine(line, lines, i, document.path);
          if (change) {
            breakingChanges.push(change);
            // Mark this line as processed to avoid re-extraction
            processedSections.add(i);
          }
        }
      }
    }

    return this.semanticDeduplicateBreakingChanges(breakingChanges);
  }

  /**
   * Check if a line contains negation patterns indicating NO breaking changes
   */
  private hasNegationPattern(lineContent: string): boolean {
    // Strip markdown formatting (bold, italic) before checking patterns
    const strippedLine = lineContent.replace(/\*\*/g, '').replace(/\*/g, '').replace(/__/g, '').replace(/_/g, '');
    
    const negationPatterns = [
      /breaking\s*changes?\s*[:\s]*none/i,
      /breaking\s*changes?\s*[:\s]*n\/a/i,
      /breaking\s*changes?\s*[:\s]*not applicable/i,
      /no\s+breaking\s*changes?/i,
      /breaking\s*changes?\s*[:\s]*0\b/i,
      /breaking\s*changes?\s*[:\s]*zero/i,
      /without\s+breaking\s*changes?/i,
      /none\s*-?\s*all\s+existing/i,  // "None - all existing ... unchanged"
    ];

    for (const pattern of negationPatterns) {
      if (pattern.test(strippedLine)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Enhanced feature extraction with structured sections (from CompletionAnalyzer)
   */
  private async extractFeaturesWithStructure(document: CompletionDocument): Promise<Feature[]> {
    const features: Feature[] = [];
    const content = document.content;

    // Prioritized extraction strategy: structured sections first
    const featureSections = this.findSections(content, [
      'new features',
      'features implemented',
      'functionality added'
    ]);

    if (featureSections.length > 0) {
      // If structured sections exist, only extract from them
      for (const section of featureSections) {
        const sectionFeatures = await this.parseFeaturesSection(section, document.path);
        features.push(...sectionFeatures);
      }
    } else {
      // Only fall back to pattern matching if no structured sections exist
      // and not in a bug fix context
      const hasBugFixSection = this.findSections(content, ['bug fixes', 'fixes']).length > 0;

      if (!hasBugFixSection) {
        const implementationPatterns = [
          /implemented?\s+new\s+([^.\n]+)/gi,
          /created?\s+new\s+([^.\n]+)/gi,
          /added?\s+new\s+([^.\n]+)/gi,
          /built?\s+new\s+([^.\n]+)/gi
        ];

        for (const pattern of implementationPatterns) {
          const matches = content.matchAll(pattern);
          for (const match of matches) {
            const feature = await this.createFeatureFromMatch(match, document.path);
            if (feature) {
              features.push(feature);
            }
          }
        }
      }
    }

    return this.semanticDeduplicateFeatures(features);
  }

  /**
   * Enhanced bug fix extraction with documentation filtering (from CompletionAnalyzer)
   */
  private async extractBugFixesWithStructure(document: CompletionDocument): Promise<BugFix[]> {
    const bugFixes: BugFix[] = [];
    const content = document.content;

    // Check for documentation sections to avoid extracting documentation fixes as bug fixes
    const documentationSections = this.findSections(content, [
      'documentation updates',
      'documentation changes',
      'readme updates',
      'documentation fixes'
    ]);

    // Prioritized extraction strategy: structured sections first
    const bugFixSections = this.findSections(content, [
      'bug fixes',
      'fixes',
      'issues resolved',
      'problems solved'
    ]);

    if (bugFixSections.length > 0) {
      // If structured sections exist, only extract from them
      for (const section of bugFixSections) {
        const fixes = await this.parseBugFixSection(section, document.path);
        bugFixes.push(...fixes);
      }
    } else {
      // Only fall back to pattern matching if no structured sections exist
      // and no documentation sections exist (to avoid false positives)
      if (documentationSections.length === 0) {
        const fixPatterns = [
          /fixed?\s+([^.\n]+)/gi,
          /resolved?\s+([^.\n]+)/gi,
          /corrected?\s+([^.\n]+)/gi
        ];

        for (const pattern of fixPatterns) {
          const matches = content.matchAll(pattern);
          for (const match of matches) {
            const bugFix = await this.createBugFixFromMatch(match, document.path);
            if (bugFix) {
              bugFixes.push(bugFix);
            }
          }
        }
      }
    }

    return this.semanticDeduplicateBugFixes(bugFixes);
  }

  /**
   * Semantic deduplication methods from CompletionAnalyzer
   */
  private semanticDeduplicateBreakingChanges(changes: BreakingChange[]): BreakingChange[] {
    return this.semanticDeduplicate(changes, (a, b) =>
      this.calculateSimilarity(a.title, b.title) > this.config.confidenceThresholds.semanticSimilarityThreshold ||
      this.calculateSimilarity(a.description, b.description) > this.config.confidenceThresholds.semanticSimilarityThreshold
    );
  }

  private semanticDeduplicateFeatures(features: Feature[]): Feature[] {
    return this.semanticDeduplicate(features, (a, b) =>
      this.calculateSimilarity(a.title, b.title) > this.config.confidenceThresholds.semanticSimilarityThreshold ||
      this.calculateSimilarity(a.description, b.description) > this.config.confidenceThresholds.semanticSimilarityThreshold
    );
  }

  private semanticDeduplicateBugFixes(bugFixes: BugFix[]): BugFix[] {
    return this.semanticDeduplicate(bugFixes, (a, b) =>
      this.calculateSimilarity(a.title, b.title) > this.config.confidenceThresholds.semanticSimilarityThreshold ||
      this.calculateSimilarity(a.description, b.description) > this.config.confidenceThresholds.semanticSimilarityThreshold
    );
  }

  private semanticDeduplicateImprovements(improvements: Improvement[]): Improvement[] {
    return this.semanticDeduplicate(improvements, (a, b) =>
      this.calculateSimilarity(a.title, b.title) > this.config.confidenceThresholds.semanticSimilarityThreshold ||
      this.calculateSimilarity(a.description, b.description) > this.config.confidenceThresholds.semanticSimilarityThreshold
    );
  }

  /**
   * Generic semantic deduplication with similarity function
   */
  private semanticDeduplicate<T extends { id: string; title: string; description: string }>(
    items: T[],
    similarityFn: (a: T, b: T) => boolean
  ): T[] {
    if (items.length <= 1) return items;

    const deduplicated: T[] = [];
    const processed = new Set<string>();

    for (const item of items) {
      if (processed.has(item.id)) continue;

      let isDuplicate = false;
      for (const existing of deduplicated) {
        if (similarityFn(item, existing)) {
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate) {
        deduplicated.push(item);
      }
      processed.add(item.id);
    }

    return deduplicated;
  }

  /**
   * Calculate text similarity using Levenshtein distance
   */
  private calculateSimilarity(text1: string, text2: string): number {
    const len1 = text1.length;
    const len2 = text2.length;

    if (len1 === 0) return len2 === 0 ? 1 : 0;
    if (len2 === 0) return 0;

    const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null));

    for (let i = 0; i <= len1; i++) matrix[0][i] = i;
    for (let j = 0; j <= len2; j++) matrix[j][0] = j;

    for (let j = 1; j <= len2; j++) {
      for (let i = 1; i <= len1; i++) {
        const indicator = text1[i - 1] === text2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    const distance = matrix[len2][len1];
    const maxLength = Math.max(len1, len2);
    return 1 - (distance / maxLength);
  }

  /**
   * Enhanced section parsing methods from CompletionAnalyzer
   */
  private async parseBreakingChangeSection(section: string, source: string): Promise<BreakingChange[]> {
    const changes: BreakingChange[] = [];
    const lines = section.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Only process list items or clear content lines
      if (trimmedLine &&
        !trimmedLine.match(/^#+/) &&
        !trimmedLine.match(/^\*\*/) &&
        (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || trimmedLine.startsWith('•'))) {

        const cleanLine = trimmedLine.replace(/^[-*•]\s*/, '').trim();
        if (cleanLine) {
          const change = await this.createBreakingChangeFromCleanLine(cleanLine, source);
          if (change) {
            changes.push(change);
          }
        }
      }
    }

    return changes;
  }

  private async parseFeaturesSection(section: string, source: string): Promise<Feature[]> {
    const features: Feature[] = [];
    const lines = section.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Only process list items or clear content lines
      if (trimmedLine &&
        !trimmedLine.match(/^#+/) &&
        !trimmedLine.match(/^\*\*/) &&
        (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || trimmedLine.startsWith('•'))) {

        const cleanLine = trimmedLine.replace(/^[-*•]\s*/, '').trim();
        if (cleanLine) {
          const feature = await this.createFeatureFromCleanLine(cleanLine, source);
          if (feature) {
            features.push(feature);
          }
        }
      }
    }

    return features;
  }

  private async parseBugFixSection(section: string, source: string): Promise<BugFix[]> {
    const bugFixes: BugFix[] = [];
    const lines = section.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Only process list items
      if (trimmedLine &&
        !trimmedLine.match(/^#+/) &&
        !trimmedLine.match(/^\*\*/) &&
        (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || trimmedLine.startsWith('•'))) {

        const cleanLine = trimmedLine.replace(/^[-*•]\s*/, '').trim();
        if (cleanLine) {
          const bugFix = await this.createBugFixFromCleanLine(cleanLine, source);
          if (bugFix) {
            bugFixes.push(bugFix);
          }
        }
      }
    }

    return bugFixes;
  }

  /**
   * Enhanced creation methods from CompletionAnalyzer
   */
  private async createBreakingChangeFromLine(
    line: string,
    allLines: string[],
    lineIndex: number,
    source: string
  ): Promise<BreakingChange | null> {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('**')) {
      return null;
    }

    const cleanLine = trimmedLine.replace(/^[-*•]\s*/, '').trim();
    return this.createBreakingChangeFromCleanLine(cleanLine, source);
  }

  private async createBreakingChangeFromCleanLine(
    cleanLine: string,
    source: string
  ): Promise<BreakingChange | null> {
    if (!cleanLine) {
      return null;
    }

    // Strip markdown formatting before checking patterns
    const strippedLine = cleanLine.replace(/\*\*/g, '').replace(/\*/g, '').replace(/__/g, '').replace(/_/g, '');
    const lowerLine = strippedLine.toLowerCase();
    
    // Check for negation patterns - skip lines that indicate NO breaking changes
    const negationPatterns = [
      /breaking\s*changes?\s*[:\s]*none/i,
      /breaking\s*changes?\s*[:\s]*n\/a/i,
      /breaking\s*changes?\s*[:\s]*not applicable/i,
      /no\s+breaking\s*changes?/i,
      /breaking\s*changes?\s*[:\s]*0\b/i,
      /breaking\s*changes?\s*[:\s]*zero/i,
      /without\s+breaking\s*changes?/i,
      /none\s*-?\s*all\s+existing/i,  // "None - all existing ... unchanged"
    ];

    for (const pattern of negationPatterns) {
      if (pattern.test(lowerLine)) {
        return null; // Skip this line - it indicates NO breaking changes
      }
    }

    const id = generateId();

    // Use the clean line as both title and description to prevent contamination
    const title = cleanLine;
    const description = cleanLine;

    return {
      id,
      title,
      description,
      affectedAPIs: this.extractAffectedAPIs(description),
      source,
      severity: this.determineBreakingChangeSeverity(description)
    };
  }

  private async createFeatureFromMatch(match: RegExpMatchArray, source: string): Promise<Feature | null> {
    if (!match[1]) return null;

    const id = generateId();
    const title = match[1].trim();
    const description = title;

    return {
      id,
      title,
      description,
      benefits: [],
      requirements: [],
      artifacts: [],
      source,
      category: 'new-functionality'
    };
  }

  private async createFeatureFromCleanLine(cleanLine: string, source: string): Promise<Feature | null> {
    if (!cleanLine) {
      return null;
    }

    const id = generateId();

    return {
      id,
      title: cleanLine,
      description: cleanLine,
      benefits: [],
      requirements: [],
      artifacts: [],
      source,
      category: 'new-functionality'
    };
  }

  private async createBugFixFromMatch(match: RegExpMatchArray, source: string): Promise<BugFix | null> {
    if (!match[1]) return null;

    const id = generateId();
    const title = match[1].trim();

    return {
      id,
      title,
      description: title,
      affectedComponents: [],
      source,
      severity: 'medium'
    };
  }

  private async createBugFixFromCleanLine(cleanLine: string, source: string): Promise<BugFix | null> {
    if (!cleanLine) {
      return null;
    }

    // Filter out documentation-related fixes (be more specific to avoid false positives)
    const lowerLine = cleanLine.toLowerCase();
    const isDocumentationFix = lowerLine.includes('typos') ||
      lowerLine.includes('documentation formatting') ||
      lowerLine.includes('readme formatting') ||
      lowerLine.includes('documentation') ||
      lowerLine.includes('readme') ||
      lowerLine.includes('code examples') ||
      lowerLine.includes('screenshots') ||
      lowerLine.includes('diagrams') ||
      lowerLine.includes('api documentation') ||
      lowerLine.includes('tutorials') ||
      lowerLine.includes('getting started') ||
      lowerLine.includes('installation instructions') ||
      lowerLine.includes('documentation structure') ||
      lowerLine.includes('documentation updates');

    if (isDocumentationFix) {
      return null;
    }

    const id = generateId();

    return {
      id,
      title: cleanLine,
      description: cleanLine,
      affectedComponents: [],
      source,
      severity: 'medium'
    };
  }

  /**
   * Enhanced severity determination from CompletionAnalyzer
   */
  private determineBreakingChangeSeverity(description: string): 'low' | 'medium' | 'high' | 'critical' {
    const desc = description.toLowerCase();

    if (desc.includes('critical') || desc.includes('removes') || desc.includes('deletes')) {
      return 'critical';
    }

    if (desc.includes('incompatible') || desc.includes('breaking')) {
      return 'high';
    }

    if (desc.includes('changes') || desc.includes('modifies')) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Extract list items from content
   */
  private extractListItems(content: string): string[] {
    const lines = content.split('\n');
    const items: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
        items.push(trimmed.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, ''));
      } else if (trimmed.length > 0 && items.length === 0) {
        // If no list items found, treat the whole content as one item
        items.push(content.trim());
        break;
      }
    }

    return items.length > 0 ? items : [content.trim()];
  }

  /**
   * Extract title from text (first sentence or line)
   */
  private extractTitle(text: string): string {
    const firstLine = text.split('\n')[0].trim();
    const firstSentence = firstLine.split('.')[0];
    return firstSentence.length > 0 ? firstSentence : firstLine;
  }

  /**
   * Extract affected APIs from text
   */
  private extractAffectedAPIs(text: string): string[] {
    const apiPatterns = [
      /API[:\s]+([^\n,]+)/gi,
      /interface[:\s]+([^\n,]+)/gi,
      /method[:\s]+([^\n,]+)/gi,
      /function[:\s]+([^\n,]+)/gi
    ];

    const apis: string[] = [];
    for (const pattern of apiPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        apis.push(...matches.map(match => match.replace(/^[^:]+:\s*/, '').trim()));
      }
    }

    return apis;
  }

  /**
   * Extract migration guidance from text
   */
  private extractMigrationGuidance(text: string): string | undefined {
    const migrationPatterns = [
      /migration[:\s]+([^\n]+)/gi,
      /upgrade[:\s]+([^\n]+)/gi,
      /replace[:\s]+([^\n]+)/gi,
      /use[:\s]+([^\n]+)\s+instead/gi
    ];

    for (const pattern of migrationPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return undefined;
  }

  /**
   * Assess breaking change severity using categorization system
   */
  private assessBreakingChangeSeverity(text: string, affectedAPIs: string[] = []): BreakingChange['severity'] {
    const assessment = this.categorizationSystem.assessBreakingChangeSeverity(
      this.extractTitle(text),
      text,
      affectedAPIs
    );
    return assessment.severity;
  }

  /**
   * Extract benefits from text using enhanced categorization system
   */
  private extractBenefits(text: string): string[] {
    // Use the categorization system's benefit extraction for features
    const classification = this.categorizationSystem.classifyFeature(
      this.extractTitle(text),
      text,
      []
    );

    // If the categorization system found benefits, use those
    if (classification.benefits.length > 0) {
      return classification.benefits;
    }

    // Fallback to original pattern-based extraction
    const benefitPatterns = [
      /benefit[s]?[:\s]+([^\n]+)/gi,
      /advantage[s]?[:\s]+([^\n]+)/gi,
      /improve[s]?[:\s]+([^\n]+)/gi
    ];

    const benefits: string[] = [];
    for (const pattern of benefitPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        benefits.push(...matches.map(match => match.replace(/^[^:]+:\s*/, '').trim()));
      }
    }

    return benefits;
  }

  /**
   * Extract requirements from text
   */
  private extractRequirements(text: string): string[] {
    const requirementPatterns = [
      /requirement[s]?[:\s]+([^\n]+)/gi,
      /require[s]?[:\s]+([^\n]+)/gi,
      /need[s]?[:\s]+([^\n]+)/gi
    ];

    const requirements: string[] = [];
    for (const pattern of requirementPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        requirements.push(...matches.map(match => match.replace(/^[^:]+:\s*/, '').trim()));
      }
    }

    return requirements;
  }

  /**
   * Extract artifacts from text
   */
  private extractArtifacts(text: string): string[] {
    const artifactPatterns = [
      /file[s]?[:\s]+([^\n,]+)/gi,
      /component[s]?[:\s]+([^\n,]+)/gi,
      /class[es]*[:\s]+([^\n,]+)/gi,
      /\.ts|\.js|\.tsx|\.jsx|\.md/g
    ];

    const artifacts: string[] = [];
    for (const pattern of artifactPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        artifacts.push(...matches.map(match => match.trim()));
      }
    }

    return artifacts;
  }

  /**
   * Categorize feature type using categorization system
   */
  private categorizeFeature(text: string, artifacts: string[] = []): string {
    const classification = this.categorizationSystem.classifyFeature(
      this.extractTitle(text),
      text,
      artifacts
    );
    return classification.category;
  }

  /**
   * Extract issue number from text
   */
  private extractIssueNumber(text: string): string | undefined {
    const issuePattern = /#(\d+)|issue[:\s]+(\d+)/gi;
    const match = text.match(issuePattern);
    return match ? match[0] : undefined;
  }

  /**
   * Extract affected components from text
   */
  private extractAffectedComponents(text: string): string[] {
    const componentPatterns = [
      /component[s]?[:\s]+([^\n,]+)/gi,
      /module[s]?[:\s]+([^\n,]+)/gi,
      /service[s]?[:\s]+([^\n,]+)/gi
    ];

    const components: string[] = [];
    for (const pattern of componentPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        components.push(...matches.map(match => match.replace(/^[^:]+:\s*/, '').trim()));
      }
    }

    return components;
  }

  /**
   * Assess bug fix severity using categorization system
   */
  private assessBugFixSeverity(text: string, affectedComponents: string[] = []): BugFix['severity'] {
    const classification = this.categorizationSystem.classifyBugFix(
      this.extractTitle(text),
      text,
      affectedComponents
    );
    return classification.severity;
  }

  /**
   * Categorize improvement type using categorization system
   */
  private categorizeImprovement(text: string): Improvement['type'] {
    const classification = this.categorizationSystem.classifyImprovement(
      this.extractTitle(text),
      text
    );
    return classification.type;
  }

  /**
   * Assess improvement impact using categorization system
   */
  private assessImprovementImpact(text: string): Improvement['impact'] {
    const classification = this.categorizationSystem.classifyImprovement(
      this.extractTitle(text),
      text
    );
    return classification.impact;
  }

  /**
   * Categorize documentation type
   */
  private categorizeDocumentation(text: string): DocumentationChange['type'] {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('readme')) {
      return 'readme';
    }
    if (lowerText.includes('api') || lowerText.includes('reference')) {
      return 'api-docs';
    }
    if (lowerText.includes('example') || lowerText.includes('sample')) {
      return 'examples';
    }
    if (lowerText.includes('comment') || lowerText.includes('inline')) {
      return 'comments';
    }

    return 'other';
  }

  /**
   * Aggregate changes from multiple documents
   */
  private aggregateChanges(allChanges: DocumentChanges[]): ExtractedChanges {
    const breakingChanges: BreakingChange[] = [];
    const newFeatures: Feature[] = [];
    const bugFixes: BugFix[] = [];
    const improvements: Improvement[] = [];
    const documentation: DocumentationChange[] = [];
    const ambiguousItems: string[] = [];

    let totalConfidence = 0;
    let documentCount = 0;

    for (const docChanges of allChanges) {
      breakingChanges.push(...docChanges.breakingChanges);
      newFeatures.push(...docChanges.newFeatures);
      bugFixes.push(...docChanges.bugFixes);
      improvements.push(...docChanges.improvements);
      documentation.push(...docChanges.documentation);
      ambiguousItems.push(...docChanges.ambiguousItems);

      totalConfidence += docChanges.confidence;
      documentCount++;
    }

    const overallConfidence = documentCount > 0 ? totalConfidence / documentCount : 0;

    return {
      breakingChanges,
      newFeatures,
      bugFixes,
      improvements,
      documentation,
      metadata: {
        documentsAnalyzed: documentCount,
        extractionConfidence: overallConfidence,
        ambiguousItems,
        filteredItems: [] // Will be populated by the main extractor
      }
    };
  }

  /**
   * Build deduplication metadata from deduplication results
   */
  private buildDeduplicationMetadata(results: Array<{
    type: string;
    result: { items: any[]; uncertainDuplicates: any[]; statistics: any };
  }>): DeduplicationMetadata {
    const totalOriginal = results.reduce((sum, r) => sum + r.result.statistics.totalProcessed, 0);
    const totalRemoved = results.reduce((sum, r) => sum + r.result.statistics.duplicatesRemoved, 0);
    const totalEffectiveness = results.reduce((sum, r) => sum + r.result.statistics.effectiveness, 0) / results.length;

    const uncertainDuplicates: UncertainDuplicateInfo[] = [];

    for (const { type, result } of results) {
      for (const uncertain of result.uncertainDuplicates) {
        uncertainDuplicates.push({
          changeType: type,
          itemCount: uncertain.items.length,
          similarity: uncertain.similarity,
          suggestedAction: uncertain.suggestedAction,
          items: uncertain.items.map((item: any) => ({
            id: item.id,
            title: item.title,
            source: item.source
          }))
        });
      }
    }

    return {
      originalCount: totalOriginal,
      duplicatesRemoved: totalRemoved,
      uncertainDuplicates,
      effectiveness: totalEffectiveness
    };
  }

  /**
   * Calculate confidence with deduplication considerations
   */
  private calculateConfidenceWithDeduplication(
    changes: ExtractedChanges,
    deduplicationMetadata: DeduplicationMetadata
  ): number {
    let baseConfidence = changes.metadata.extractionConfidence;

    // Reduce confidence if there are many uncertain duplicates
    const uncertainRatio = deduplicationMetadata.uncertainDuplicates.length /
      Math.max(1, deduplicationMetadata.originalCount);

    if (uncertainRatio > 0.2) { // More than 20% uncertain
      baseConfidence *= (1 - uncertainRatio * 0.3); // Reduce by up to 30%
    }

    // Increase confidence slightly if deduplication was effective
    if (deduplicationMetadata.effectiveness > 0.1) { // More than 10% duplicates removed
      baseConfidence *= 1.05; // Small boost for effective deduplication
    }

    return Math.max(0.1, Math.min(1.0, baseConfidence));
  }

  /**
   * Calculate overall confidence from aggregated changes
   */
  private calculateOverallConfidence(changes: ExtractedChanges): number {
    const totalItems = changes.breakingChanges.length + changes.newFeatures.length +
      changes.bugFixes.length + changes.improvements.length;

    if (totalItems === 0) {
      return changes.metadata.extractionConfidence;
    }

    // Reduce confidence if there are many ambiguous items
    const ambiguousRatio = changes.metadata.ambiguousItems.length / totalItems;
    const confidenceReduction = ambiguousRatio * 0.3; // Max 30% reduction

    return Math.max(0.1, changes.metadata.extractionConfidence - confidenceReduction);
  }

  /**
   * Calculate comprehensive confidence metrics for extracted changes
   */
  public calculateConfidenceMetrics(
    changes: ExtractedChanges,
    documents: CompletionDocument[],
    patternMatches?: PatternMatch[],
    sectionMatches?: SectionMatch[]
  ): ConfidenceScore {
    return this.confidenceMetrics.calculateConfidenceScore(changes, documents, patternMatches, sectionMatches);
  }

  /**
   * Calculate confidence for individual change items
   */
  public calculateItemConfidence(
    item: BreakingChange | Feature | BugFix | Improvement | DocumentationChange,
    context: {
      patternMatch?: PatternMatch;
      sectionMatch?: SectionMatch;
      documentStructure: 'structured' | 'unstructured';
      extractionMethod: 'pattern' | 'section' | 'mixed';
    }
  ): ItemConfidenceScore {
    return this.confidenceMetrics.calculateItemConfidence(item, context);
  }

  /**
   * Generate quality report for extraction results
   */
  public generateQualityReport(confidenceScore: ConfidenceScore, changes: ExtractedChanges): {
    summary: string;
    details: Array<{ title: string; content: string }>;
    recommendations: string[];
    actionItems: string[];
  } {
    return this.confidenceMetrics.generateQualityReport(confidenceScore, changes);
  }

  /**
   * Enhanced validation with confidence metrics
   */
  public validateExtractionWithConfidence(
    changes: ExtractedChanges,
    documents: CompletionDocument[],
    patternMatches?: PatternMatch[],
    sectionMatches?: SectionMatch[]
  ): ExtractionValidation & {
    confidenceScore: ConfidenceScore;
    status: 'pass' | 'warning' | 'fail';
    thresholdViolations: any[];
    recommendations: any[];
  } {
    // Calculate confidence metrics
    const confidenceScore = this.calculateConfidenceMetrics(changes, documents, patternMatches, sectionMatches);

    // Get base validation
    const baseValidation = this.validateExtraction(changes);

    // Enhance validation with confidence insights
    const enhancedErrors = [...baseValidation.errors];
    const enhancedWarnings = [...baseValidation.warnings];
    const enhancedSuggestions = [...baseValidation.suggestions];

    // Add confidence-based errors
    for (const violation of confidenceScore.validation.thresholdViolations) {
      enhancedErrors.push({
        type: 'confidence',
        message: `Confidence threshold violation: ${violation.threshold} (expected: ${violation.expected}, actual: ${violation.actual.toFixed(2)})`,
        source: 'confidence-metrics'
      });
    }

    // Add uncertainty-based warnings
    for (const uncertainty of confidenceScore.uncertainties) {
      if (uncertainty.severity === 'high') {
        enhancedWarnings.push({
          type: 'ambiguous',
          message: uncertainty.description,
          source: uncertainty.source,
          suggestion: uncertainty.suggestedAction
        });
      }
    }

    // Add confidence-based suggestions
    for (const recommendation of confidenceScore.validation.recommendations) {
      enhancedSuggestions.push({
        type: 'validation',
        message: recommendation.description,
        action: recommendation.actions.join('; ')
      });
    }

    return {
      ...baseValidation,
      confidence: confidenceScore.overall,
      errors: enhancedErrors,
      warnings: enhancedWarnings,
      suggestions: enhancedSuggestions,
      valid: enhancedErrors.length === 0,
      confidenceScore,
      status: confidenceScore.validation.status,
      thresholdViolations: confidenceScore.validation.thresholdViolations,
      recommendations: confidenceScore.validation.recommendations
    };
  }

  /**
   * Get categorization insights for validation
   */
  public getCategorizationInsights(changes: ExtractedChanges): {
    totalCategorized: number;
    categoryDistribution: Record<string, number>;
    averageConfidence: number;
    lowConfidenceItems: string[];
  } {
    const totalCategorized = changes.breakingChanges.length + changes.newFeatures.length +
      changes.bugFixes.length + changes.improvements.length;

    const categoryDistribution = {
      'Breaking Changes': changes.breakingChanges.length,
      'New Features': changes.newFeatures.length,
      'Bug Fixes': changes.bugFixes.length,
      'Improvements': changes.improvements.length,
      'Documentation': changes.documentation.length
    };

    // Calculate average confidence (simplified - in real implementation would track per-item confidence)
    const averageConfidence = changes.metadata.extractionConfidence;

    // Identify low confidence items from ambiguous items
    const lowConfidenceItems = changes.metadata.ambiguousItems;

    return {
      totalCategorized,
      categoryDistribution,
      averageConfidence,
      lowConfidenceItems
    };
  }

  /**
   * Enhanced extraction with confidence tracking
   */
  public async extractChangesWithConfidence(documents: CompletionDocument[]): Promise<{
    changes: ExtractedChanges;
    confidenceScore: ConfidenceScore;
    validation: ExtractionValidation & {
      confidenceScore: ConfidenceScore;
      status: 'pass' | 'warning' | 'fail';
      thresholdViolations: any[];
      recommendations: any[];
    };
  }> {
    // Store pattern and section matches for confidence calculation
    const allPatternMatches: PatternMatch[] = [];
    const allSectionMatches: SectionMatch[] = [];

    // Extract changes with tracking
    const changes = await this.extractChangesWithTracking(documents, allPatternMatches, allSectionMatches);

    // Calculate confidence metrics
    const confidenceScore = this.calculateConfidenceMetrics(changes, documents, allPatternMatches, allSectionMatches);

    // Perform enhanced validation
    const validation = this.validateExtractionWithConfidence(changes, documents, allPatternMatches, allSectionMatches);

    return {
      changes,
      confidenceScore,
      validation
    };
  }

  /**
   * Extract changes with pattern and section match tracking
   */
  private async extractChangesWithTracking(
    documents: CompletionDocument[],
    patternMatches: PatternMatch[],
    sectionMatches: SectionMatch[]
  ): Promise<ExtractedChanges> {
    const allChanges: DocumentChanges[] = [];
    const filteredDocuments: string[] = [];

    for (const document of documents) {
      // Check if document should be excluded
      if (this.patternMatcher.shouldExcludeContent(document.content, document.path)) {
        filteredDocuments.push(document.path);
        continue;
      }

      const documentChanges = await this.parseCompletionDocumentWithTracking(document, patternMatches, sectionMatches);
      allChanges.push(documentChanges);
    }

    // Aggregate all changes
    const aggregated = this.aggregateChanges(allChanges);

    // Add filtered documents to metadata
    aggregated.metadata.filteredItems = filteredDocuments;

    // Deduplicate similar changes
    const deduplicated = this.deduplicateChanges(aggregated);

    return deduplicated;
  }

  /**
   * Parse completion document with pattern and section match tracking
   */
  private async parseCompletionDocumentWithTracking(
    document: CompletionDocument,
    patternMatches: PatternMatch[],
    sectionMatches: SectionMatch[]
  ): Promise<DocumentChanges> {
    // Try structured section parsing first
    const docSectionMatches = this.patternMatcher.findSectionMatches(document.content);
    sectionMatches.push(...docSectionMatches);

    if (docSectionMatches.length > 0) {
      return this.parseStructuredDocument(document, docSectionMatches);
    }

    // Fall back to pattern-based parsing
    const docPatternMatches = this.patternMatcher.findPatternMatches(document.content, document.path);
    patternMatches.push(...docPatternMatches);

    return this.parseUnstructuredDocumentWithPatterns(document, docPatternMatches);
  }

  /**
   * Parse unstructured document with pattern tracking
   */
  private parseUnstructuredDocumentWithPatterns(document: CompletionDocument, patternMatches: PatternMatch[]): DocumentChanges {
    const breakingChanges: BreakingChange[] = [];
    const newFeatures: Feature[] = [];
    const bugFixes: BugFix[] = [];
    const improvements: Improvement[] = [];
    const documentation: DocumentationChange[] = [];
    const ambiguousItems: string[] = [];

    let totalConfidence = 0;
    let matchCount = 0;

    for (const match of patternMatches) {
      // Skip matches with zero confidence (negation patterns detected)
      // This is a defensive check - findPatternMatches should already filter these,
      // but we add this as a safety net
      if (match.confidence === 0) {
        continue;
      }
      
      totalConfidence += match.confidence;
      matchCount++;

      const changeItem = this.createChangeFromPattern(match, document);

      if (match.confidence < this.config.confidenceThresholds.uncertaintyThreshold) {
        ambiguousItems.push(`${match.match} (line ${match.line})`);
      }

      switch (match.type) {
        case 'breaking':
          breakingChanges.push(changeItem as BreakingChange);
          break;
        case 'feature':
          newFeatures.push(changeItem as Feature);
          break;
        case 'bugfix':
          bugFixes.push(changeItem as BugFix);
          break;
        case 'improvement':
          improvements.push(changeItem as Improvement);
          break;
        case 'documentation':
          documentation.push(changeItem as DocumentationChange);
          break;
      }
    }

    const confidence = matchCount > 0 ? totalConfidence / matchCount : 0.3;

    return {
      document,
      breakingChanges,
      newFeatures,
      bugFixes,
      improvements,
      documentation,
      confidence,
      ambiguousItems
    };
  }
}