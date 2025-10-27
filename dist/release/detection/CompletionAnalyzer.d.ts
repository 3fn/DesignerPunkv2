/**
 * Completion Document Analyzer
 *
 * Specialized analyzer for parsing and extracting release-relevant information
 * from spec and task completion documents. Provides detailed analysis of
 * breaking changes, features, and other release indicators.
 */
import { ReleaseAnalysis, BreakingChange, Feature, BugFix, Improvement } from '../types/ReleaseTypes';
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
export declare class CompletionAnalyzer {
    private config;
    constructor(config: DetectionConfig);
    /**
     * Analyze all completion documents in a directory
     */
    analyzeCompletionDirectory(documentsPath: string): Promise<ReleaseAnalysis>;
    /**
     * Analyze a single completion document
     */
    analyzeDocument(document: CompletionDocument, context: AnalysisContext): Promise<ReleaseAnalysis>;
    /**
     * Parse spec completion document to extract release-relevant information
     */
    parseSpecCompletionDocument(documentPath: string): Promise<ReleaseAnalysis>;
    /**
     * Parse task completion document to determine patch release necessity
     */
    parseTaskCompletionDocument(documentPath: string): Promise<{
        needsPatchRelease: boolean;
        analysis: ReleaseAnalysis;
        patchReleaseReason: string;
    }>;
    /**
     * Detect breaking changes using keywords and document structure analysis
     */
    detectBreakingChangesWithStructure(document: CompletionDocument): Promise<BreakingChange[]>;
    /**
     * Extract breaking changes from completion document
     */
    extractBreakingChanges(document: CompletionDocument): Promise<BreakingChange[]>;
    /**
     * Extract new features from completion document
     */
    extractFeatures(document: CompletionDocument): Promise<Feature[]>;
    /**
     * Extract bug fixes from completion document
     */
    extractBugFixes(document: CompletionDocument): Promise<BugFix[]>;
    /**
     * Extract improvements from completion document
     */
    extractImprovements(document: CompletionDocument): Promise<Improvement[]>;
    private buildAnalysisContext;
    private loadCompletionDocuments;
    private extractDocumentMetadata;
    private findSections;
    private parseBreakingChangeSection;
    private createBreakingChangeFromLine;
    private createBreakingChangeFromCleanLine;
    private parseFeaturesSection;
    private createFeatureFromMatch;
    private createFeatureFromLine;
    private createFeatureFromCleanLine;
    private parseBugFixSection;
    private createBugFixFromMatch;
    private createBugFixFromLine;
    private createBugFixFromCleanLine;
    private parseImprovementSection;
    private createImprovementFromMatch;
    private createImprovementFromLine;
    private createImprovementFromCleanLine;
    private extractAffectedAPIs;
    private isCommonWord;
    private determineBreakingChangeSeverity;
    private determineSuggestedVersionBump;
    private calculateDocumentConfidence;
    private calculateOverallConfidence;
    private semanticDeduplicateBreakingChanges;
    private semanticDeduplicateFeatures;
    private semanticDeduplicateBugFixes;
    private semanticDeduplicateImprovements;
    private semanticDeduplicate;
    private normalizeTitle;
    private areSemanticallyEquivalent;
    private deduplicateBreakingChanges;
    private deduplicateFeatures;
    private deduplicateBugFixes;
    private deduplicateImprovements;
    private matchesPattern;
    private extractSpecNameFromPath;
    private extractTaskNumberFromPath;
    private determineTaskPatchReleaseNecessity;
    private generatePatchReleaseReason;
    private detectBreakingChangesByKeywords;
    private detectBreakingChangesByStructure;
    private detectAPISignatureChanges;
    private detectDependencyBreakingChanges;
    private detectRemovalPatterns;
    private determineBreakingChangeSeverityFromKeyword;
}
//# sourceMappingURL=CompletionAnalyzer.d.ts.map