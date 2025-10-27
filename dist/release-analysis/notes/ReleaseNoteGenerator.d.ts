/**
 * Release Note Generator
 *
 * Formats extracted changes into comprehensive, readable release notes
 * following markdown standards with structured sections for different change types.
 */
import { ExtractedChanges, BreakingChange, Feature, BugFix, Improvement, DocumentationChange } from '../types/AnalysisTypes';
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
    title: string;
    description: string;
    source?: string;
    metadata?: Record<string, any>;
}
export interface ReleaseTemplate {
    format: 'markdown' | 'html' | 'plain';
    sections: TemplateSectionConfig[];
    styling: TemplateStyle;
}
export interface TemplateSectionConfig {
    type: 'breaking' | 'features' | 'fixes' | 'improvements' | 'documentation';
    title: string;
    enabled: boolean;
    priority: number;
    includeSource: boolean;
}
export interface TemplateStyle {
    headerLevel: number;
    bulletStyle: '-' | '*' | '+';
    includeMetadata: boolean;
    includeSummary: boolean;
}
export declare class ReleaseNoteGenerator {
    private defaultTemplate;
    /**
     * Generate complete release notes from extracted changes
     */
    generateReleaseNotes(changes: ExtractedChanges, version: string, template?: ReleaseTemplate): Promise<string>;
    /**
     * Format breaking changes with prominent highlighting and migration guidance
     */
    formatBreakingChanges(changes: BreakingChange[]): string;
    /**
     * Format new features with descriptions and benefits
     */
    formatNewFeatures(features: Feature[]): string;
    /**
     * Format bug fixes with clear descriptions
     */
    formatBugFixes(fixes: BugFix[]): string;
    /**
     * Format improvements with type and impact information
     */
    formatImprovements(improvements: Improvement[]): string;
    /**
     * Format documentation changes
     */
    formatDocumentationChanges(docs: DocumentationChange[]): string;
    /**
     * Apply template formatting to release content
     */
    applyTemplate(content: ReleaseContent, template: ReleaseTemplate): string;
    /**
     * Build release content structure from extracted changes
     */
    private buildReleaseContent;
    /**
     * Build detailed description for breaking changes
     */
    private buildBreakingChangeDescription;
    /**
     * Build detailed description for features
     */
    private buildFeatureDescription;
    /**
     * Build detailed description for bug fixes
     */
    private buildBugFixDescription;
    /**
     * Generate summary of all changes
     */
    private generateSummary;
}
//# sourceMappingURL=ReleaseNoteGenerator.d.ts.map