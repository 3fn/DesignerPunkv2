/**
 * Core types for release analysis system
 *
 * Defines data structures for completion documents, extracted changes,
 * and analysis results used throughout the release analysis workflow.
 */
export interface CompletionDocument {
    path: string;
    content: string;
    lastModified: Date;
    gitCommit: string;
    metadata: DocumentMetadata;
}
export interface DocumentMetadata {
    title: string;
    date?: string;
    task?: string;
    spec?: string;
    status?: string;
    type: 'task-completion' | 'spec-completion' | 'other';
}
export interface ExtractedChanges {
    breakingChanges: BreakingChange[];
    newFeatures: Feature[];
    bugFixes: BugFix[];
    improvements: Improvement[];
    documentation: DocumentationChange[];
    metadata: ExtractionMetadata;
}
export interface ExtractionMetadata {
    documentsAnalyzed: number;
    extractionConfidence: number;
    ambiguousItems: string[];
    filteredItems: string[];
    deduplication?: DeduplicationMetadata;
}
export interface DeduplicationMetadata {
    /** Total items before deduplication */
    originalCount: number;
    /** Items removed through deduplication */
    duplicatesRemoved: number;
    /** Items flagged for manual review */
    uncertainDuplicates: UncertainDuplicateInfo[];
    /** Deduplication effectiveness (0-1) */
    effectiveness: number;
}
export interface UncertainDuplicateInfo {
    /** Type of change (breaking, feature, etc.) */
    changeType: string;
    /** Number of potentially duplicate items */
    itemCount: number;
    /** Similarity score */
    similarity: number;
    /** Suggested action */
    suggestedAction: 'merge' | 'keep-separate' | 'needs-clarification';
    /** Items that need review */
    items: {
        id: string;
        title: string;
        source: string;
    }[];
}
export interface BreakingChange {
    id: string;
    title: string;
    description: string;
    affectedAPIs: string[];
    migrationGuidance?: string;
    source: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}
export interface Feature {
    id: string;
    title: string;
    description: string;
    benefits: string[];
    requirements: string[];
    artifacts: string[];
    source: string;
    category: string;
}
export interface BugFix {
    id: string;
    title: string;
    description: string;
    issueNumber?: string;
    issueReference?: string;
    affectedComponents: string[];
    source: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}
export interface Improvement {
    id: string;
    title: string;
    description: string;
    type: 'performance' | 'usability' | 'maintainability' | 'security' | 'accessibility' | 'other';
    impact: 'low' | 'medium' | 'high';
    source: string;
}
export interface DocumentationChange {
    id: string;
    title: string;
    description: string;
    type: 'readme' | 'api-docs' | 'examples' | 'comments' | 'other';
    source: string;
}
export interface DocumentChanges {
    document: CompletionDocument;
    breakingChanges: BreakingChange[];
    newFeatures: Feature[];
    bugFixes: BugFix[];
    improvements: Improvement[];
    documentation: DocumentationChange[];
    confidence: number;
    ambiguousItems: string[];
}
export interface ExtractionValidation {
    valid: boolean;
    confidence: number;
    errors: ExtractionError[];
    warnings: ExtractionWarning[];
    suggestions: ExtractionSuggestion[];
}
export interface EnhancedExtractionValidation extends ExtractionValidation {
    confidenceScore: any;
    status?: 'pass' | 'warning' | 'fail';
    thresholdViolations?: any[];
    recommendations?: any[];
}
export interface ExtractionError {
    type: 'parsing' | 'validation' | 'confidence';
    message: string;
    source?: string;
    line?: number;
}
export interface ExtractionWarning {
    type: 'ambiguous' | 'low-confidence' | 'missing-info';
    message: string;
    source?: string;
    line?: number;
    suggestion?: string;
}
export interface ExtractionSuggestion {
    type: 'categorization' | 'enhancement' | 'validation';
    message: string;
    source?: string;
    action?: string;
}
export interface PatternMatch {
    pattern: string;
    match: string;
    confidence: number;
    context: string;
    line: number;
    type: 'breaking' | 'feature' | 'bugfix' | 'improvement' | 'documentation';
}
export interface SectionMatch {
    header: string;
    content: string;
    startLine: number;
    endLine: number;
    type: 'breaking' | 'feature' | 'bugfix' | 'improvement' | 'summary';
    confidence: number;
}
export interface VersionRecommendation {
    currentVersion: string;
    recommendedVersion: string;
    bumpType: 'major' | 'minor' | 'patch' | 'none';
    rationale: string;
    confidence: number;
    evidence: ChangeEvidence[];
}
export interface ChangeEvidence {
    type: 'breaking' | 'feature' | 'fix' | 'improvement';
    description: string;
    source: string;
    impact: 'high' | 'medium' | 'low';
}
export interface AnalysisScope {
    fromTag?: string;
    fromCommit?: string;
    toCommit: string;
    completionDocuments: CompletionDocument[];
    analysisDate: Date;
}
export interface GitChanges {
    commits: GitCommit[];
    addedFiles: string[];
    modifiedFiles: string[];
    deletedFiles: string[];
    timeRange: {
        from: Date;
        to: Date;
    };
}
export interface GitCommit {
    hash: string;
    message: string;
    author: string;
    date: Date;
    files: string[];
}
export interface GitTag {
    name: string;
    message: string;
    commit: string;
    date: Date;
}
export interface AnalysisResult {
    scope: AnalysisScope;
    changes: ExtractedChanges;
    versionRecommendation: VersionRecommendation;
    releaseNotes: string;
    confidence: ConfidenceMetrics;
}
export interface ConfidenceMetrics {
    overall: number;
    extraction: number;
    categorization: number;
    deduplication: number;
    versionCalculation: number;
}
export interface ReleaseContent {
    version: string;
    date: string;
    summary: string;
    sections: ReleaseSection[];
}
export interface ReleaseSection {
    title: string;
    items: ReleaseItem[];
    priority: number;
}
export interface ReleaseItem {
    id: string;
    title: string;
    description: string;
    source: string;
    type: 'breaking' | 'feature' | 'bugfix' | 'improvement';
}
export interface ReleaseTemplate {
    format: 'markdown' | 'html' | 'plain';
    sections: TemplateSectionConfig[];
    styling: TemplateStyle;
}
export interface TemplateSectionConfig {
    id: string;
    title: string;
    priority: number;
    required: boolean;
    template: string;
}
export interface TemplateStyle {
    headerLevel: number;
    listStyle: 'bullet' | 'numbered';
    includeMetadata: boolean;
}
export interface AnalysisOptions {
    since?: string;
    includePatterns?: string[];
    excludePatterns?: string[];
    outputFormat?: 'summary' | 'detailed' | 'json';
    dryRun?: boolean;
    saveResults?: boolean;
    outputPath?: string;
}
export interface InteractiveOptions {
    /** Enable interactive mode for reviewing uncertain changes */
    interactive?: boolean;
    /** Auto-approve low-confidence items */
    autoApprove?: boolean;
    /** Skip confirmation prompts */
    skipConfirmation?: boolean;
    /** Review threshold for interactive mode */
    reviewThreshold?: number;
}
export interface ReportFormat {
    type: 'summary' | 'detailed' | 'json';
    includeMetadata: boolean;
    includeConfidence: boolean;
    includeEvidence: boolean;
}
export interface QuickAnalysisResult {
    /** Version bump recommendation */
    versionBump: 'major' | 'minor' | 'patch' | 'none';
    /** Count of changes by type */
    changeCount: {
        breaking: number;
        features: number;
        fixes: number;
        improvements: number;
    };
    /** Confidence in the analysis (0-1) */
    confidence: number;
    /** Concise one-line summary for AI feedback */
    summary: string;
    /** Whether full result was cached */
    fullResultCached: boolean;
}
//# sourceMappingURL=AnalysisTypes.d.ts.map