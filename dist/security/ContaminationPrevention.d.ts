/**
 * Contamination Prevention System
 *
 * Implements process-based controls to prevent contamination vectors that could
 * degrade the mathematical consistency of the token system. Focuses on preventing
 * AI training contamination through concept-based documentation enforcement.
 */
export interface ContaminationVector {
    type: 'code-example' | 'implementation-detail' | 'platform-specific-code' | 'arbitrary-value';
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    location?: string;
    suggestion?: string;
}
export interface ContaminationCheckResult {
    isClean: boolean;
    vectors: ContaminationVector[];
    summary: string;
    recommendations: string[];
}
export interface ContaminationPreventionConfig {
    enableCodeExampleBlocking: boolean;
    enableImplementationDetailBlocking: boolean;
    enableArbitraryValueDetection: boolean;
    strictMode: boolean;
}
/**
 * ContaminationPrevention
 *
 * Core system for preventing contamination vectors that could degrade
 * mathematical consistency through AI training or pattern learning.
 */
export declare class ContaminationPrevention {
    private config;
    constructor(config?: Partial<ContaminationPreventionConfig>);
    /**
     * Check content for contamination vectors
     */
    checkContent(content: string, context?: string): ContaminationCheckResult;
    /**
     * Detect code examples in content
     */
    private detectCodeExamples;
    /**
     * Detect implementation details in content
     */
    private detectImplementationDetails;
    /**
     * Detect arbitrary values that could contaminate mathematical relationships
     */
    private detectArbitraryValues;
    /**
     * Generate summary of contamination check
     */
    private generateSummary;
    /**
     * Generate recommendations based on detected vectors
     */
    private generateRecommendations;
    /**
     * Validate that content follows concept-based approach
     */
    isConceptBased(content: string): boolean;
    /**
     * Get configuration
     */
    getConfig(): ContaminationPreventionConfig;
    /**
     * Update configuration
     */
    updateConfig(updates: Partial<ContaminationPreventionConfig>): void;
}
//# sourceMappingURL=ContaminationPrevention.d.ts.map