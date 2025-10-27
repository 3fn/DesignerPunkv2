/**
 * Token Selection Interface
 *
 * Represents token selection with priority reasoning.
 * Priority order: semantic → primitive → component
 */
import { PrimitiveToken } from '../../types/PrimitiveToken';
import { SemanticToken } from '../../types/SemanticToken';
import { TokenRequest } from './TokenIntegrator';
export interface ComponentToken {
    name: string;
    category: string;
    baseValue: number;
    component: string;
    reasoning: string;
}
/**
 * Token selection priority levels
 */
export type TokenPriority = 'semantic' | 'primitive' | 'component';
/**
 * Token selection result with priority reasoning
 *
 * Follows the priority system:
 * 1. First: Attempt to use semantic tokens (space.inset.small, color.primary, etc.)
 * 2. Second: Attempt to use primitive tokens (space100, space125, color.blue500, etc.)
 * 3. Third: Create component token only if semantic and primitive tokens cannot achieve design requirements
 */
export interface TokenSelection {
    /** Original token request */
    requested: TokenRequest;
    /** Selected semantic token (first priority) */
    semantic?: SemanticToken;
    /** Selected primitive token (second priority) */
    primitive?: PrimitiveToken;
    /** Generated component token (fallback) */
    component?: ComponentToken;
    /** Priority level used for selection */
    priority: TokenPriority;
    /** Reasoning for this selection */
    reasoning: string;
    /** Why semantic tokens were insufficient (if primitive or component selected) */
    semanticInsufficiencyReason?: string;
    /** Why primitive tokens were insufficient (if component selected) */
    primitiveInsufficiencyReason?: string;
    /** Mathematical validation result */
    mathematicallyValid: boolean;
    /** Timestamp of selection */
    timestamp: Date;
}
/**
 * Token selection options
 */
export interface TokenSelectionOptions {
    /** Allow component token generation */
    allowComponentTokens?: boolean;
    /** Require mathematical validation */
    requireMathematicalValidation?: boolean;
    /** Prefer specific token category */
    preferredCategory?: string;
    /** Additional context for selection */
    context?: Record<string, unknown>;
}
/**
 * Token selection validator
 */
export interface TokenSelectionValidator {
    /**
     * Validate that token selection follows priority rules
     *
     * @param selection - Token selection to validate
     * @returns Validation result
     */
    validate(selection: TokenSelection): TokenSelectionValidationResult;
    /**
     * Check if semantic token should have been used
     *
     * @param selection - Token selection to check
     * @returns True if semantic token should have been used
     */
    shouldUseSemanticToken(selection: TokenSelection): boolean;
    /**
     * Check if primitive token should have been used
     *
     * @param selection - Token selection to check
     * @returns True if primitive token should have been used
     */
    shouldUsePrimitiveToken(selection: TokenSelection): boolean;
}
/**
 * Token selection validation result
 */
export interface TokenSelectionValidationResult {
    /** Whether selection is valid */
    valid: boolean;
    /** Priority level used */
    priority: TokenPriority;
    /** Validation errors */
    errors: string[];
    /** Validation warnings */
    warnings: string[];
    /** Suggestions for improvement */
    suggestions: string[];
}
//# sourceMappingURL=TokenSelection.d.ts.map