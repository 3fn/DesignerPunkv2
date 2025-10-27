/**
 * Change Categorization System
 *
 * Provides sophisticated classification logic for different change types,
 * severity assessment, and benefit extraction from completion documents.
 * Implements systematic categorization rules based on content analysis.
 */
import { ExtractionConfig } from '../config/AnalysisConfig';
export interface CategorizationResult {
    type: 'breaking' | 'feature' | 'bugfix' | 'improvement' | 'documentation' | 'unknown';
    confidence: number;
    reasoning: string[];
    suggestedCategory?: string;
}
export interface SeverityAssessment {
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    indicators: string[];
    reasoning: string;
}
export interface FeatureClassification {
    category: string;
    subcategory?: string;
    confidence: number;
    benefits: string[];
    reasoning: string[];
}
export interface ImprovementClassification {
    type: 'performance' | 'usability' | 'maintainability' | 'security' | 'accessibility' | 'other';
    impact: 'low' | 'medium' | 'high';
    confidence: number;
    reasoning: string[];
}
export interface BugFixClassification {
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: 'functional' | 'performance' | 'security' | 'ui' | 'integration' | 'other';
    confidence: number;
    reasoning: string[];
}
export declare class ChangeCategorizationSystem {
    private config;
    private readonly BREAKING_CHANGE_PATTERNS;
    private readonly FEATURE_PATTERNS;
    private readonly BUG_FIX_PATTERNS;
    private readonly IMPROVEMENT_PATTERNS;
    private readonly SEVERITY_INDICATORS;
    private readonly FEATURE_CATEGORIES;
    constructor(config: ExtractionConfig);
    /**
     * Categorize a change based on its content
     */
    categorizeChange(title: string, description: string, context?: string): CategorizationResult;
    /**
     * Assess severity of a breaking change
     */
    assessBreakingChangeSeverity(title: string, description: string, affectedAPIs: string[]): SeverityAssessment;
    /**
     * Classify a feature and extract benefits
     */
    classifyFeature(title: string, description: string, artifacts: string[]): FeatureClassification;
    /**
     * Classify an improvement
     */
    classifyImprovement(title: string, description: string): ImprovementClassification;
    /**
     * Classify a bug fix
     */
    classifyBugFix(title: string, description: string, affectedComponents: string[]): BugFixClassification;
    /**
     * Check patterns against text and return confidence score
     */
    private checkPatterns;
    /**
     * Check for documentation patterns
     */
    private checkDocumentationPatterns;
    /**
     * Get numeric weight for severity comparison
     */
    private getSeverityWeight;
    /**
     * Generate reasoning for severity assessment
     */
    private generateSeverityReasoning;
    /**
     * Extract benefits from description text
     */
    private extractBenefits;
    /**
     * Categorize feature by artifacts
     */
    private categorizeByArtifacts;
    /**
     * Assess improvement impact
     */
    private assessImprovementImpact;
}
//# sourceMappingURL=ChangeCategorizationSystem.d.ts.map