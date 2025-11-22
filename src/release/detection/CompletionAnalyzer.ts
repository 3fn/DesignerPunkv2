/**
 * Completion Document Analyzer
 * 
 * Specialized analyzer for parsing and extracting release-relevant information
 * from spec and task completion documents. Provides detailed analysis of
 * breaking changes, features, and other release indicators.
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import {
  ReleaseAnalysis,
  BreakingChange,
  Feature,
  BugFix,
  Improvement
} from '../types/ReleaseTypes';
import { DetectionConfig } from '../config/ReleaseConfig';

export interface CompletionDocument {
  path: string;
  content: string;
  metadata: DocumentMetadata;
}

export interface DocumentMetadata {
  title: string;
  date?: string;
  task?: string;
  spec?: string;
  status?: string;
}

export interface AnalysisContext {
  specName: string;
  taskNumber?: string;
  completionType: 'task' | 'spec';
  documentPaths: string[];
}

export class CompletionAnalyzer {
  private config: DetectionConfig;

  constructor(config: DetectionConfig) {
    this.config = config;
  }

  /**
   * Analyze all completion documents in a directory
   */
  async analyzeCompletionDirectory(documentsPath: string): Promise<ReleaseAnalysis> {
    const context = await this.buildAnalysisContext(documentsPath);
    const documents = await this.loadCompletionDocuments(documentsPath);

    const analysis: ReleaseAnalysis = {
      breakingChanges: [],
      newFeatures: [],
      bugFixes: [],
      improvements: [],
      suggestedVersionBump: 'patch',
      confidence: 0,
      analyzedAt: new Date()
    };

    // Analyze each document
    for (const document of documents) {
      const documentAnalysis = await this.analyzeDocument(document, context);

      analysis.breakingChanges.push(...documentAnalysis.breakingChanges);
      analysis.newFeatures.push(...documentAnalysis.newFeatures);
      analysis.bugFixes.push(...documentAnalysis.bugFixes);
      analysis.improvements.push(...documentAnalysis.improvements);
    }

    // Determine overall version bump and confidence
    analysis.suggestedVersionBump = this.determineSuggestedVersionBump(analysis);
    analysis.confidence = this.calculateOverallConfidence(analysis, documents);

    return analysis;
  }

  /**
   * Analyze a single completion document
   */
  async analyzeDocument(document: CompletionDocument, context: AnalysisContext): Promise<ReleaseAnalysis> {
    const analysis: ReleaseAnalysis = {
      breakingChanges: await this.extractBreakingChanges(document),
      newFeatures: await this.extractFeatures(document),
      bugFixes: await this.extractBugFixes(document),
      improvements: await this.extractImprovements(document),
      suggestedVersionBump: 'patch',
      confidence: 0,
      analyzedAt: new Date()
    };

    analysis.suggestedVersionBump = this.determineSuggestedVersionBump(analysis);
    analysis.confidence = this.calculateDocumentConfidence(document, analysis);

    return analysis;
  }

  /**
   * Parse spec completion document to extract release-relevant information
   */
  async parseSpecCompletionDocument(documentPath: string): Promise<ReleaseAnalysis> {
    try {
      const content = await fs.readFile(documentPath, 'utf-8');
      const document: CompletionDocument = {
        path: documentPath,
        content,
        metadata: this.extractDocumentMetadata(content)
      };

      const context: AnalysisContext = {
        specName: this.extractSpecNameFromPath(documentPath),
        completionType: 'spec',
        documentPaths: [documentPath]
      };

      return await this.analyzeDocument(document, context);
    } catch (error) {
      throw new Error(`Failed to parse spec completion document: ${error}`);
    }
  }

  /**
   * Parse task completion document to determine patch release necessity
   */
  async parseTaskCompletionDocument(documentPath: string): Promise<{
    needsPatchRelease: boolean;
    analysis: ReleaseAnalysis;
    patchReleaseReason: string;
  }> {
    try {
      const content = await fs.readFile(documentPath, 'utf-8');
      const document: CompletionDocument = {
        path: documentPath,
        content,
        metadata: this.extractDocumentMetadata(content)
      };

      const context: AnalysisContext = {
        specName: this.extractSpecNameFromPath(documentPath),
        taskNumber: this.extractTaskNumberFromPath(documentPath),
        completionType: 'task',
        documentPaths: [documentPath]
      };

      const analysis = await this.analyzeDocument(document, context);

      // Determine if patch release is needed
      const needsPatchRelease = this.determineTaskPatchReleaseNecessity(analysis, document);
      const patchReleaseReason = this.generatePatchReleaseReason(analysis, document);

      return {
        needsPatchRelease,
        analysis,
        patchReleaseReason
      };
    } catch (error) {
      // Log the error with stack trace for debugging
      console.error('[CompletionAnalyzer] Error parsing task completion document:', error);
      if (error instanceof Error) {
        console.error('[CompletionAnalyzer] Stack trace:', error.stack);
      }
      throw new Error(`Failed to parse task completion document: ${error}`);
    }
  }

  /**
   * Detect breaking changes using keywords and document structure analysis
   */
  async detectBreakingChangesWithStructure(document: CompletionDocument): Promise<BreakingChange[]> {
    const breakingChanges: BreakingChange[] = [];
    const content = document.content;

    // 1. Keyword-based detection
    const keywordBasedChanges = await this.detectBreakingChangesByKeywords(document);
    breakingChanges.push(...keywordBasedChanges);

    // 2. Structure-based detection
    const structureBasedChanges = await this.detectBreakingChangesByStructure(document);
    breakingChanges.push(...structureBasedChanges);

    // 3. API signature analysis
    const apiChanges = await this.detectAPISignatureChanges(document);
    breakingChanges.push(...apiChanges);

    // 4. Dependency changes analysis
    const dependencyChanges = await this.detectDependencyBreakingChanges(document);
    breakingChanges.push(...dependencyChanges);

    return this.deduplicateBreakingChanges(breakingChanges);
  }

  /**
   * Extract breaking changes from completion document
   */
  async extractBreakingChanges(document: CompletionDocument): Promise<BreakingChange[]> {
    const breakingChanges: BreakingChange[] = [];
    const content = document.content;
    
    // Add null check for content
    if (!content || typeof content !== 'string') {
      return breakingChanges;
    }

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

    // Apply semantic deduplication
    return this.semanticDeduplicateBreakingChanges(breakingChanges);
  }

  /**
   * Extract new features from completion document
   */
  async extractFeatures(document: CompletionDocument): Promise<Feature[]> {
    const features: Feature[] = [];
    const content = document.content;
    
    // Add null check for content
    if (!content || typeof content !== 'string') {
      return features;
    }

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
   * Extract bug fixes from completion document
   */
  async extractBugFixes(document: CompletionDocument): Promise<BugFix[]> {
    const bugFixes: BugFix[] = [];
    const content = document.content;
    
    // Add null check for content
    if (!content || typeof content !== 'string') {
      return bugFixes;
    }

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
   * Extract improvements from completion document
   */
  async extractImprovements(document: CompletionDocument): Promise<Improvement[]> {
    const improvements: Improvement[] = [];
    const content = document.content;
    
    // Add null check for content
    if (!content || typeof content !== 'string') {
      return improvements;
    }

    // Prioritized extraction strategy: structured sections first
    const improvementSections = this.findSections(content, [
      'improvements',
      'enhancements',
      'optimizations',
      'refactoring'
    ]);

    if (improvementSections.length > 0) {
      // If structured sections exist, only extract from them
      for (const section of improvementSections) {
        const sectionImprovements = await this.parseImprovementSection(section, document.path);
        improvements.push(...sectionImprovements);
      }
    } else {
      // Only fall back to pattern matching if no structured sections exist
      const improvementPatterns = [
        /improved?\s+([^.\n]+)/gi,
        /enhanced?\s+([^.\n]+)/gi,
        /optimized?\s+([^.\n]+)/gi,
        /refactored?\s+([^.\n]+)/gi
      ];

      for (const pattern of improvementPatterns) {
        const matches = content.matchAll(pattern);
        for (const match of matches) {
          const improvement = await this.createImprovementFromMatch(match, document.path);
          if (improvement) {
            improvements.push(improvement);
          }
        }
      }
    }

    return this.semanticDeduplicateImprovements(improvements);
  }

  // Private helper methods

  private async buildAnalysisContext(documentsPath: string): Promise<AnalysisContext> {
    // Extract spec name from path
    const specMatch = documentsPath.match(/\.kiro\/specs\/([^\/]+)/);
    const specName = specMatch ? specMatch[1] : 'unknown';

    // Determine completion type
    const completionType = documentsPath.includes('task-') ? 'task' : 'spec';

    // Get all document paths
    const documentPaths: string[] = [];
    try {
      const files = await fs.readdir(documentsPath);
      for (const file of files) {
        if (this.config.completionPatterns.some(pattern =>
          this.matchesPattern(file, pattern)
        )) {
          documentPaths.push(path.join(documentsPath, file));
        }
      }
    } catch (error) {
      // Directory might not exist
    }

    return {
      specName,
      completionType,
      documentPaths
    };
  }

  private async loadCompletionDocuments(documentsPath: string): Promise<CompletionDocument[]> {
    const documents: CompletionDocument[] = [];

    try {
      const files = await fs.readdir(documentsPath);

      for (const file of files) {
        if (this.config.completionPatterns.some(pattern =>
          this.matchesPattern(file, pattern)
        )) {
          const filePath = path.join(documentsPath, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const metadata = this.extractDocumentMetadata(content);

          documents.push({
            path: filePath,
            content,
            metadata
          });
        }
      }
    } catch (error) {
      // Directory might not exist or be empty
    }

    return documents;
  }

  private extractDocumentMetadata(content: string): DocumentMetadata {
    const metadata: DocumentMetadata = {
      title: 'Untitled'
    };
    
    // Add null check for content
    if (!content || typeof content !== 'string') {
      return metadata;
    }
    
    const lines = content.split('\n');

    // Extract title from first heading
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim();
    }

    // Extract metadata from document header
    for (const line of lines.slice(0, 20)) { // Check first 20 lines
      const dateMatch = line.match(/\*\*Date\*\*:\s*(.+)/);
      if (dateMatch) {
        metadata.date = dateMatch[1].trim();
      }

      const taskMatch = line.match(/\*\*Task\*\*:\s*(.+)/);
      if (taskMatch) {
        metadata.task = taskMatch[1].trim();
      }

      const specMatch = line.match(/\*\*Spec\*\*:\s*(.+)/);
      if (specMatch) {
        metadata.spec = specMatch[1].trim();
      }

      const statusMatch = line.match(/\*\*Status\*\*:\s*(.+)/);
      if (statusMatch) {
        metadata.status = statusMatch[1].trim();
      }
    }

    return metadata;
  }

  private findSections(content: string, sectionNames: string[]): string[] {
    const sections: string[] = [];
    
    // Add null check for content
    if (!content || typeof content !== 'string') {
      return sections;
    }
    
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim();

      if (sectionNames.some(name =>
        line.includes(`## ${name}`) ||
        line.includes(`# ${name}`) ||
        line.includes(`**${name}`)
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

  private async parseBreakingChangeSection(section: string, source: string): Promise<BreakingChange[]> {
    const changes: BreakingChange[] = [];
    
    // Add null check for section
    if (!section || typeof section !== 'string') {
      return changes;
    }
    
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

    const id = `breaking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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

  private async parseFeaturesSection(section: string, source: string): Promise<Feature[]> {
    const features: Feature[] = [];
    
    // Add null check for section
    if (!section || typeof section !== 'string') {
      return features;
    }
    
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

  private async createFeatureFromMatch(match: RegExpMatchArray, source: string): Promise<Feature | null> {
    if (!match[1]) return null;

    const id = `feature-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const title = match[1].trim();
    const description = title;

    return {
      id,
      title,
      description,
      requirements: [],
      artifacts: [],
      source,
      category: 'new-functionality'
    };
  }

  private async createFeatureFromLine(line: string, source: string): Promise<Feature | null> {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('**')) {
      return null;
    }

    const cleanLine = trimmedLine.replace(/^[-*•]\s*/, '').trim();
    return this.createFeatureFromCleanLine(cleanLine, source);
  }

  private async createFeatureFromCleanLine(cleanLine: string, source: string): Promise<Feature | null> {
    if (!cleanLine) {
      return null;
    }

    const id = `feature-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      id,
      title: cleanLine,
      description: cleanLine,
      requirements: [],
      artifacts: [],
      source,
      category: 'new-functionality'
    };
  }

  private async parseBugFixSection(section: string, source: string): Promise<BugFix[]> {
    const bugFixes: BugFix[] = [];
    
    // Add null check for section
    if (!section || typeof section !== 'string') {
      return bugFixes;
    }
    
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

  private async createBugFixFromMatch(match: RegExpMatchArray, source: string): Promise<BugFix | null> {
    if (!match[1]) return null;

    const id = `bugfix-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const title = match[1].trim();

    return {
      id,
      title,
      description: title,
      source,
      severity: 'medium'
    };
  }

  private async createBugFixFromLine(line: string, source: string): Promise<BugFix | null> {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('**')) {
      return null;
    }

    const cleanLine = trimmedLine.replace(/^[-*•]\s*/, '').trim();
    return this.createBugFixFromCleanLine(cleanLine, source);
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

    const id = `bugfix-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      id,
      title: cleanLine,
      description: cleanLine,
      source,
      severity: 'medium'
    };
  }

  private async parseImprovementSection(section: string, source: string): Promise<Improvement[]> {
    const improvements: Improvement[] = [];
    
    // Add null check for section
    if (!section || typeof section !== 'string') {
      return improvements;
    }
    
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
          const improvement = await this.createImprovementFromCleanLine(cleanLine, source);
          if (improvement) {
            improvements.push(improvement);
          }
        }
      }
    }

    return improvements;
  }

  private async createImprovementFromMatch(match: RegExpMatchArray, source: string): Promise<Improvement | null> {
    if (!match[1]) return null;

    const id = `improvement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const title = match[1].trim();

    return {
      id,
      title,
      description: title,
      type: 'maintainability',
      source
    };
  }

  private async createImprovementFromLine(line: string, source: string): Promise<Improvement | null> {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('**')) {
      return null;
    }

    const cleanLine = trimmedLine.replace(/^[-*•]\s*/, '').trim();
    return this.createImprovementFromCleanLine(cleanLine, source);
  }

  private async createImprovementFromCleanLine(cleanLine: string, source: string): Promise<Improvement | null> {
    if (!cleanLine) {
      return null;
    }

    const id = `improvement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      id,
      title: cleanLine,
      description: cleanLine,
      type: 'maintainability',
      source
    };
  }

  private extractAffectedAPIs(content: string): string[] {
    const apis: string[] = [];
    const apiPatterns = [
      // Direct API references
      /interface\s+(\w+)/gi,
      /class\s+(\w+)/gi,
      /function\s+(\w+)/gi,
      /method\s+(\w+)/gi,
      /API\s+(\w+)/gi,
      // Removal/modification patterns
      /removed?\s+interface\s+(\w+)/gi,
      /updated?\s+class\s+(\w+)/gi,
      /modified?\s+function\s+(\w+)/gi,
      /changed?\s+method\s+(\w+)/gi,
      /deleted?\s+(\w+)\s+method/gi,
      /removed?\s+(\w+)\s+function/gi,
      // Method/function call patterns
      /(\w+)\(\)/gi,
      // Interface/class usage patterns
      /(\w+Interface)/gi,
      /(\w+Engine)/gi,
      /(\w+Validator)/gi,
      /(\w+Manager)/gi,
      /(\w+Service)/gi,
      /(\w+Controller)/gi
    ];

    for (const pattern of apiPatterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].length > 2) {
          // Filter out common words that aren't APIs
          const candidate = match[1];
          if (!this.isCommonWord(candidate)) {
            apis.push(candidate);
          }
        }
      }
    }

    return [...new Set(apis)];
  }

  private isCommonWord(word: string): boolean {
    const commonWords = [
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'
    ];
    return commonWords.includes(word.toLowerCase()) || word.length < 3;
  }

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

  private determineSuggestedVersionBump(analysis: ReleaseAnalysis): 'major' | 'minor' | 'patch' {
    // Add safety checks for undefined arrays
    const breakingChanges = analysis.breakingChanges || [];
    const newFeatures = analysis.newFeatures || [];
    const bugFixes = analysis.bugFixes || [];
    const improvements = analysis.improvements || [];
    
    if (breakingChanges.length > 0) {
      return 'major';
    }

    if (newFeatures.length > 0) {
      return 'minor';
    }

    if (bugFixes.length > 0 || improvements.length > 0) {
      return 'patch';
    }

    return 'patch';
  }

  private calculateDocumentConfidence(document: CompletionDocument, analysis: ReleaseAnalysis): number {
    let confidence = 0.5;

    // Increase confidence based on document structure
    if (document.metadata.title && document.metadata.title !== 'Untitled') {
      confidence += 0.1;
    }

    if (document.metadata.date) {
      confidence += 0.05;
    }

    if (document.metadata.task || document.metadata.spec) {
      confidence += 0.1;
    }

    // Increase confidence based on content quality
    // Add null check for content
    const content = document.content || '';
    const contentLength = content.length;
    if (contentLength > 500) {
      confidence += 0.1;
    }

    if (contentLength > 1000) {
      confidence += 0.1;
    }

    // Increase confidence based on structured sections
    const structuredSections = ['summary', 'implementation', 'approach', 'decisions', 'artifacts'];
    const foundSections = structuredSections.filter(section =>
      content.toLowerCase().includes(`## ${section}`) ||
      content.toLowerCase().includes(`# ${section}`)
    );

    confidence += foundSections.length * 0.05;

    // Increase confidence based on analysis results
    // Add safety checks for undefined arrays
    const breakingChanges = analysis.breakingChanges || [];
    const newFeatures = analysis.newFeatures || [];
    const bugFixes = analysis.bugFixes || [];
    const improvements = analysis.improvements || [];
    
    const totalChanges = breakingChanges.length +
      newFeatures.length +
      bugFixes.length +
      improvements.length;

    if (totalChanges > 0) {
      confidence += 0.2;
    }

    return Math.min(confidence, 1.0);
  }

  private calculateOverallConfidence(analysis: ReleaseAnalysis, documents: CompletionDocument[]): number {
    if (documents.length === 0) {
      return 0;
    }

    // Calculate average document confidence
    let totalConfidence = 0;
    for (const document of documents) {
      totalConfidence += this.calculateDocumentConfidence(document, analysis);
    }

    const averageConfidence = totalConfidence / documents.length;

    // Adjust based on analysis completeness
    // Add safety checks for undefined arrays
    const breakingChanges = analysis.breakingChanges || [];
    const newFeatures = analysis.newFeatures || [];
    const bugFixes = analysis.bugFixes || [];
    const improvements = analysis.improvements || [];
    
    const totalChanges = breakingChanges.length +
      newFeatures.length +
      bugFixes.length +
      improvements.length;

    let completenessBonus = 0;
    if (totalChanges > 0) {
      completenessBonus = Math.min(totalChanges * 0.05, 0.2);
    }

    return Math.min(averageConfidence + completenessBonus, 1.0);
  }

  // Semantic deduplication methods
  private semanticDeduplicateBreakingChanges(changes: BreakingChange[]): BreakingChange[] {
    return this.semanticDeduplicate(changes, (change) => change.title);
  }

  private semanticDeduplicateFeatures(features: Feature[]): Feature[] {
    return this.semanticDeduplicate(features, (feature) => feature.title);
  }

  private semanticDeduplicateBugFixes(bugFixes: BugFix[]): BugFix[] {
    return this.semanticDeduplicate(bugFixes, (bugFix) => bugFix.title);
  }

  private semanticDeduplicateImprovements(improvements: Improvement[]): Improvement[] {
    return this.semanticDeduplicate(improvements, (improvement) => improvement.title);
  }

  private semanticDeduplicate<T>(items: T[], getTitleFn: (item: T) => string): T[] {
    const result: T[] = [];
    const normalizedTitles = new Set<string>();

    for (const item of items) {
      const title = getTitleFn(item);
      const normalizedTitle = this.normalizeTitle(title);

      // Check for semantic similarity with existing items
      let isDuplicate = false;
      for (const existingTitle of normalizedTitles) {
        if (this.areSemanticallyEquivalent(normalizedTitle, existingTitle)) {
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate) {
        result.push(item);
        normalizedTitles.add(normalizedTitle);
      }
    }

    return result;
  }

  private normalizeTitle(title: string): string {
    return title
      .toLowerCase()
      .trim()
      // Remove common prefixes
      .replace(/^(fixed?|resolved?|corrected?|implemented?|created?|added?|built?|improved?|enhanced?|optimized?|refactored?)\s+/i, '')
      // Remove articles and common words
      .replace(/\b(the|a|an|in|on|at|to|for|of|with|by)\b/g, '')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  private areSemanticallyEquivalent(title1: string, title2: string): boolean {
    // Exact match after normalization
    if (title1 === title2) {
      return true;
    }

    // Check if one title is contained within another (with word boundaries)
    const words1 = title1.split(/\s+/).filter(w => w.length > 2);
    const words2 = title2.split(/\s+/).filter(w => w.length > 2);

    // If 80% or more of the significant words overlap, consider them equivalent
    const commonWords = words1.filter(word => words2.includes(word));
    const minWords = Math.min(words1.length, words2.length);

    if (minWords > 0 && commonWords.length / minWords >= 0.8) {
      return true;
    }

    // Check for substring containment (for cases like "memory leak" vs "memory leak in token parser")
    if (title1.length > 10 && title2.length > 10) {
      const shorter = title1.length < title2.length ? title1 : title2;
      const longer = title1.length < title2.length ? title2 : title1;

      if (longer.includes(shorter)) {
        return true;
      }
    }

    return false;
  }

  // Legacy deduplication methods (kept for backward compatibility)
  private deduplicateBreakingChanges(changes: BreakingChange[]): BreakingChange[] {
    return this.semanticDeduplicateBreakingChanges(changes);
  }

  private deduplicateFeatures(features: Feature[]): Feature[] {
    return this.semanticDeduplicateFeatures(features);
  }

  private deduplicateBugFixes(bugFixes: BugFix[]): BugFix[] {
    return this.semanticDeduplicateBugFixes(bugFixes);
  }

  private deduplicateImprovements(improvements: Improvement[]): Improvement[] {
    return this.semanticDeduplicateImprovements(improvements);
  }

  private matchesPattern(filename: string, pattern: string): boolean {
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');

    return new RegExp(`^${regexPattern}$`).test(filename);
  }

  // Additional parsing helper methods

  private extractSpecNameFromPath(documentPath: string): string {
    const specMatch = documentPath.match(/\.kiro\/specs\/([^\/]+)/);
    return specMatch ? specMatch[1] : 'unknown';
  }

  private extractTaskNumberFromPath(documentPath: string): string | undefined {
    const taskMatch = documentPath.match(/task-([^-]+)-completion\.md/);
    return taskMatch ? taskMatch[1] : undefined;
  }

  private determineTaskPatchReleaseNecessity(analysis: ReleaseAnalysis, document: CompletionDocument): boolean {
    // Task completion warrants patch release if:
    // 1. New features are present (minor release)
    // 2. Bug fixes are present (patch release)
    // 3. Improvements that affect functionality (patch release)
    // 4. Implementation changes that could affect behavior (patch release)
    // 5. Configuration or validation changes (patch release)

    // Add safety checks for undefined arrays
    const newFeatures = analysis.newFeatures || [];
    const bugFixes = analysis.bugFixes || [];
    const improvements = analysis.improvements || [];

    // New features always warrant a release (minor)
    if (newFeatures.length > 0) {
      return true;
    }

    // Filter out documentation-related bug fixes
    const functionalBugFixes = bugFixes.filter(bugFix => {
      const description = bugFix.description.toLowerCase();
      const isDocumentationFix = description.includes('typos') ||
        description.includes('formatting') ||
        description.includes('documentation') ||
        description.includes('readme') ||
        description.includes('examples') ||
        description.includes('screenshots') ||
        description.includes('diagrams');
      return !isDocumentationFix;
    });

    if (functionalBugFixes.length > 0) {
      return true;
    }

    // Check if improvements suggest functional changes (not documentation improvements)
    const functionalImprovements = improvements.filter(imp =>
      imp.type === 'performance' ||
      imp.type === 'usability' ||
      imp.description.toLowerCase().includes('behavior') ||
      (imp.description.toLowerCase().includes('optimization') &&
        !imp.description.toLowerCase().includes('documentation'))
    );

    if (functionalImprovements.length > 0) {
      return true;
    }

    // Check for implementation artifacts that suggest functional changes
    // Add null check for content
    const documentContent = document.content || '';
    const content = documentContent.toLowerCase();

    // Check if this is primarily documentation work
    const documentationSections = this.findSections(documentContent, [
      'documentation updates',
      'documentation changes',
      'readme updates'
    ]);

    // Documentation-only patterns (more comprehensive)
    const documentationPatterns = [
      /updated?\s+readme/i,
      /added?\s+.*\s+documentation/i,
      /fixed?\s+typos/i,
      /updated?\s+screenshots/i,
      /created?\s+.*\s+tutorials/i,
      /reorganized?\s+documentation/i,
      /added?\s+.*\s+examples/i,
      /updated?\s+.*\s+documentation/i,
      /documentation\s+structure/i,
      /code\s+examples/i,
      /comprehensive\s+api\s+documentation/i,
      /usage\s+examples/i,
      /installation\s+instructions/i,
      /formatting\s+issues/i
    ];

    // Implementation patterns that suggest functional changes
    const implementationPatterns = [
      /implementation\s+approach/i,
      /created?\s+.*\.ts/i,
      /implemented?\s+.*\s+(system|engine|interface|class)/i,
      /added?\s+.*\s+(functionality|behavior|algorithm)/i,
      /built?\s+.*\s+(system|engine|component)/i,
      /performance\s+optimization/i,
      /validation\s+(system|engine|rules)/i,
      /artifacts\s+created/i,
      /key\s+decisions/i
    ];

    const hasDocumentationPatterns = documentationPatterns.some(pattern =>
      pattern.test(document.content)
    ) || documentationSections.length > 0;

    const hasImplementationPatterns = implementationPatterns.some(pattern =>
      pattern.test(document.content)
    );

    // Check task title for documentation indicators
    const taskTitle = document.metadata.task?.toLowerCase() || '';
    const isDocumentationTask = taskTitle.includes('documentation') ||
      taskTitle.includes('readme') ||
      taskTitle.includes('update documentation') ||
      taskTitle.includes('doc ');

    // Check summary for documentation indicators
    // documentContent already declared above
    const summaryMatch = documentContent.match(/## Summary\s*\n([^#]*)/i);
    const summary = summaryMatch ? summaryMatch[1].toLowerCase() : '';
    const summaryIsDocumentation = summary.includes('documentation') ||
      summary.includes('examples') ||
      summary.includes('readme');

    // If documentation patterns/sections/task/summary and no implementation patterns, it's documentation-only
    if ((hasDocumentationPatterns || isDocumentationTask || summaryIsDocumentation) && !hasImplementationPatterns) {
      return false;
    }

    // Functional change indicators (more specific)
    const functionalChangeIndicators = [
      'implementation approach',
      'functionality',
      'algorithm',
      'logic',
      'validation system',
      'configuration',
      'error handling',
      'performance optimization'
    ];

    const hasFunctionalChanges = functionalChangeIndicators.some(indicator =>
      content.includes(indicator)
    );

    return hasFunctionalChanges;
  }

  private generatePatchReleaseReason(analysis: ReleaseAnalysis, document: CompletionDocument): string {
    const reasons: string[] = [];
    
    // Add safety checks for undefined arrays
    const bugFixes = analysis.bugFixes || [];
    const improvements = analysis.improvements || [];

    if (bugFixes.length > 0) {
      reasons.push(`${bugFixes.length} bug fix(es)`);
    }

    if (improvements.length > 0) {
      const functionalImprovements = improvements.filter(imp =>
        imp.type === 'performance' || imp.type === 'usability'
      );
      if (functionalImprovements.length > 0) {
        reasons.push(`${functionalImprovements.length} functional improvement(s)`);
      }
    }

    // Check for specific improvement types in the content
    // Add null check for content
    const content = (document.content || '').toLowerCase();
    if (content.includes('performance') && content.includes('optimization')) {
      reasons.push('performance optimization');
    }

    if (reasons.length === 0) {
      reasons.push('Task completion with implementation changes');
    }

    return `Task completion: ${reasons.join(', ')}`;
  }

  private async detectBreakingChangesByKeywords(document: CompletionDocument): Promise<BreakingChange[]> {
    const breakingChanges: BreakingChange[] = [];
    const content = document.content;
    
    // Add null check for content
    if (!content || typeof content !== 'string') {
      return breakingChanges;
    }
    
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineContent = line.toLowerCase();

      for (const keyword of this.config.breakingChangeKeywords) {
        if (lineContent.includes(keyword.toLowerCase())) {
          const change = await this.createBreakingChangeFromLine(line, lines, i, document.path);
          if (change) {
            change.severity = this.determineBreakingChangeSeverityFromKeyword(keyword);
            breakingChanges.push(change);
          }
        }
      }
    }

    return breakingChanges;
  }

  private async detectBreakingChangesByStructure(document: CompletionDocument): Promise<BreakingChange[]> {
    const breakingChanges: BreakingChange[] = [];
    const content = document.content;

    // Look for structured breaking change sections
    const breakingChangeSections = this.findSections(content, [
      'breaking changes',
      'incompatible changes',
      'migration required',
      'api changes'
    ]);

    for (const section of breakingChangeSections) {
      const sectionChanges = await this.parseBreakingChangeSection(section, document.path);
      breakingChanges.push(...sectionChanges);
    }

    // Look for removal patterns in implementation sections
    const implementationSections = this.findSections(content, [
      'implementation approach',
      'key decisions',
      'artifacts created'
    ]);

    for (const section of implementationSections) {
      const removalChanges = await this.detectRemovalPatterns(section, document.path);
      breakingChanges.push(...removalChanges);
    }

    return breakingChanges;
  }

  private async detectAPISignatureChanges(document: CompletionDocument): Promise<BreakingChange[]> {
    const breakingChanges: BreakingChange[] = [];
    const content = document.content;

    // Patterns that indicate API signature changes
    const signatureChangePatterns = [
      /changed?\s+signature\s+of\s+([^.]+)/gi,
      /modified?\s+interface\s+([^.]+)/gi,
      /updated?\s+method\s+([^.]+)/gi,
      /removed?\s+parameter\s+from\s+([^.]+)/gi,
      /added?\s+required\s+parameter\s+to\s+([^.]+)/gi
    ];

    for (const pattern of signatureChangePatterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          const id = `api-change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const title = `API signature change: ${match[1].trim()}`;
          const description = match[0];

          breakingChanges.push({
            id,
            title,
            description,
            affectedAPIs: [match[1].trim()],
            source: document.path,
            severity: 'high'
          });
        }
      }
    }

    return breakingChanges;
  }

  private async detectDependencyBreakingChanges(document: CompletionDocument): Promise<BreakingChange[]> {
    const breakingChanges: BreakingChange[] = [];
    const content = document.content;

    // Patterns that indicate dependency breaking changes
    const dependencyChangePatterns = [
      /removed?\s+dependency\s+([^.]+)/gi,
      /updated?\s+major\s+version\s+of\s+([^.]+)/gi,
      /changed?\s+peer\s+dependency\s+([^.]+)/gi,
      /incompatible\s+with\s+([^.]+)/gi
    ];

    for (const pattern of dependencyChangePatterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          const id = `dependency-change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const title = `Dependency breaking change: ${match[1].trim()}`;
          const description = match[0];

          breakingChanges.push({
            id,
            title,
            description,
            affectedAPIs: [],
            source: document.path,
            severity: 'medium'
          });
        }
      }
    }

    return breakingChanges;
  }

  private async detectRemovalPatterns(section: string, source: string): Promise<BreakingChange[]> {
    const breakingChanges: BreakingChange[] = [];
    
    // Add null check for section
    if (!section || typeof section !== 'string') {
      return breakingChanges;
    }
    
    const lines = section.split('\n');

    const removalPatterns = [
      /removed?\s+([^.]+)/gi,
      /deleted?\s+([^.]+)/gi,
      /dropped?\s+([^.]+)/gi,
      /eliminated?\s+([^.]+)/gi
    ];

    for (const line of lines) {
      for (const pattern of removalPatterns) {
        const matches = line.matchAll(pattern);
        for (const match of matches) {
          if (match[1]) {
            const id = `removal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const title = `Removed: ${match[1].trim()}`;
            const description = line.trim();

            breakingChanges.push({
              id,
              title,
              description,
              affectedAPIs: this.extractAffectedAPIs(match[1]),
              source,
              severity: 'high'
            });
          }
        }
      }
    }

    return breakingChanges;
  }

  private determineBreakingChangeSeverityFromKeyword(keyword: string): 'low' | 'medium' | 'high' | 'critical' {
    const keywordLower = keyword.toLowerCase();

    if (keywordLower.includes('removes') || keywordLower.includes('deleted')) {
      return 'critical';
    }

    if (keywordLower.includes('breaking') || keywordLower.includes('incompatible')) {
      return 'high';
    }

    if (keywordLower.includes('deprecated') || keywordLower.includes('migration')) {
      return 'medium';
    }

    return 'low';
  }
}