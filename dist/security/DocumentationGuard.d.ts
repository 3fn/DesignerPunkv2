/**
 * Documentation Guard
 *
 * Enforces concept-based documentation approach and blocks code example
 * generation in documentation to prevent contamination vectors.
 */
import { ContaminationCheckResult } from './ContaminationPrevention';
export interface DocumentationValidationResult {
    isValid: boolean;
    approach: 'concept-based' | 'code-based' | 'mixed';
    contaminationCheck: ContaminationCheckResult;
    feedback: string[];
    blockedActions: string[];
}
export interface DocumentationGuardConfig {
    blockCodeExamples: boolean;
    blockImplementationDetails: boolean;
    allowTypeDefinitions: boolean;
    strictConceptEnforcement: boolean;
}
/**
 * DocumentationGuard
 *
 * Guards documentation generation and validation to ensure concept-based
 * approach is maintained and contamination vectors are prevented.
 */
export declare class DocumentationGuard {
    private contaminationPrevention;
    private config;
    constructor(config?: Partial<DocumentationGuardConfig>);
    /**
     * Validate documentation content
     */
    validateDocumentation(content: string, documentType?: string): DocumentationValidationResult;
    /**
     * Determine documentation approach
     */
    private determineApproach;
    /**
     * Check if content has conceptual explanations
     */
    private hasConceptualContent;
    /**
     * Generate feedback for documentation validation
     */
    private generateFeedback;
    /**
     * Determine what actions should be blocked
     */
    private determineBlockedActions;
    /**
     * Block code example generation
     */
    blockCodeExampleGeneration(requestContext: string): {
        blocked: boolean;
        reason: string;
        alternative: string;
    };
    /**
     * Suggest concept-based alternative
     */
    suggestConceptBasedAlternative(codeExample: string): string;
    /**
     * Validate token documentation
     */
    validateTokenDocumentation(tokenName: string, documentation: string): DocumentationValidationResult;
    /**
     * Get configuration
     */
    getConfig(): DocumentationGuardConfig;
    /**
     * Update configuration
     */
    updateConfig(updates: Partial<DocumentationGuardConfig>): void;
}
//# sourceMappingURL=DocumentationGuard.d.ts.map