/**
 * Component Token Interface
 *
 * Represents component-specific tokens created when semantic and primitive
 * tokens are mathematically insufficient for design requirements.
 *
 * Component tokens are the fallback in the priority system:
 * semantic → primitive → component
 */
import { PlatformValue } from './types';
import { TokenCategory } from './PlatformTokens';
/**
 * Component token definition
 *
 * Created only when:
 * 1. Semantic tokens cannot achieve design requirements
 * 2. Primitive tokens cannot achieve design requirements
 * 3. Mathematical reasoning justifies the new token
 */
export interface ComponentToken {
    /** Unique component token name */
    name: string;
    /** Token category */
    category: TokenCategory;
    /** Unitless base value (following F1 pattern) */
    baseValue: number;
    /** Component this token belongs to */
    component: string;
    /** Mathematical reasoning for why existing tokens are insufficient */
    reasoning: string;
    /** Primitive token references (if any) */
    references?: TokenReference[];
    /** Platform-specific values */
    platforms: ComponentTokenPlatforms;
    /** Usage tracking */
    usage: ComponentTokenUsage;
    /** Creation metadata */
    metadata: ComponentTokenMetadata;
}
/**
 * Platform-specific component token values
 */
export interface ComponentTokenPlatforms {
    /** iOS value in pt */
    ios: PlatformValue;
    /** Android value in dp/sp */
    android: PlatformValue;
    /** Web value in px/rem */
    web: PlatformValue;
}
/**
 * Reference to primitive token
 */
export interface TokenReference {
    /** Primitive token name */
    tokenName: string;
    /** Relationship to this component token */
    relationship: 'base' | 'multiplier' | 'offset' | 'derived';
    /** Mathematical expression (e.g., "space100 * 1.5") */
    expression?: string;
}
/**
 * Component token usage tracking
 */
export interface ComponentTokenUsage {
    /** Number of times used */
    usageCount: number;
    /** Contexts where used */
    contexts: string[];
    /** Whether usage is appropriate (≥80% threshold) */
    appropriateUsage: boolean;
    /** Usage percentage that is appropriate */
    appropriateUsageRate: number;
    /** Last used timestamp */
    lastUsed?: Date;
}
/**
 * Component token metadata
 */
export interface ComponentTokenMetadata {
    /** Creation timestamp */
    createdAt: Date;
    /** Created by (human or AI) */
    createdBy: string;
    /** Last modified timestamp */
    modifiedAt?: Date;
    /** Approval status */
    approved: boolean;
    /** Approval notes */
    approvalNotes?: string;
    /** Whether this token should be promoted to primitive */
    promotionCandidate: boolean;
    /** Promotion reasoning */
    promotionReasoning?: string;
}
/**
 * Component token generator interface
 */
export interface ComponentTokenGenerator {
    /**
     * Generate component token from specification
     *
     * @param spec - Component token specification
     * @returns Generated component token
     */
    generate(spec: ComponentTokenSpec): ComponentToken;
    /**
     * Validate component token follows mathematical principles
     *
     * @param token - Component token to validate
     * @returns Validation result
     */
    validate(token: ComponentToken): ComponentTokenValidationResult;
    /**
     * Check if component token should be promoted to primitive
     *
     * @param token - Component token to check
     * @returns Promotion recommendation
     */
    checkPromotion(token: ComponentToken): PromotionRecommendation;
}
/**
 * Component token specification for generation
 */
export interface ComponentTokenSpec {
    /** Component token name */
    name: string;
    /** Token category */
    category: TokenCategory;
    /** Base unitless value */
    baseValue: number;
    /** Component name */
    component: string;
    /** Reasoning for creation */
    reasoning: string;
    /** Optional primitive token references */
    references?: TokenReference[];
    /** Created by */
    createdBy: string;
}
/**
 * Component token validation result
 */
export interface ComponentTokenValidationResult {
    /** Whether token is valid */
    valid: boolean;
    /** Mathematical consistency check */
    mathematicallyConsistent: boolean;
    /** Validation errors */
    errors: string[];
    /** Validation warnings */
    warnings: string[];
    /** Suggestions for improvement */
    suggestions: string[];
}
/**
 * Promotion recommendation for component token
 */
export interface PromotionRecommendation {
    /** Whether token should be promoted */
    shouldPromote: boolean;
    /** Reasoning for recommendation */
    reasoning: string;
    /** Usage statistics supporting recommendation */
    usageStats: {
        totalUsage: number;
        appropriateUsageRate: number;
        contexts: string[];
    };
    /** Suggested primitive token name */
    suggestedPrimitiveName?: string;
}
//# sourceMappingURL=ComponentToken.d.ts.map