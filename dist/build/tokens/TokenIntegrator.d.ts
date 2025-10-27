/**
 * Token Integration Layer
 *
 * Integrates F1 tokens into platform-specific builds with proper unit conversion.
 * Follows token selection priority: semantic → primitive → component
 */
import { PrimitiveToken } from '../../types/PrimitiveToken';
import { SemanticToken } from '../../types/SemanticToken';
import { PrimitiveTokenRegistry } from '../../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../../registries/SemanticTokenRegistry';
import { TokenSelection, TokenSelectionOptions } from './TokenSelection';
import { PlatformTokens } from './PlatformTokens';
import { ComponentToken } from './ComponentToken';
import { Platform, PlatformValue } from './types';
/**
 * Token request specification
 */
export interface TokenRequest {
    /** Property name requesting the token */
    property: string;
    /** Desired token category (spacing, color, typography, etc.) */
    category: string;
    /** Optional specific token name */
    tokenName?: string;
    /** Context for token selection */
    context?: Record<string, unknown>;
}
/**
 * Component token specification for generation
 */
export interface ComponentTokenSpec {
    /** Component token name */
    name: string;
    /** Token category */
    category: string;
    /** Base unitless value */
    baseValue: number;
    /** Component name */
    component: string;
    /** Reasoning for why existing tokens are insufficient */
    reasoning: string;
    /** Optional primitive token references */
    references?: string[];
    /** Created by */
    createdBy: string;
}
/**
 * Main token integrator interface
 *
 * Responsible for:
 * - Consuming primitive and semantic tokens from F1
 * - Following token selection priority (semantic → primitive → component)
 * - Converting tokens to platform-specific units
 * - Generating component tokens when necessary
 * - Validating mathematical consistency
 */
export interface TokenIntegrator {
    /**
     * Get all tokens for a specific platform with proper unit conversion
     *
     * @param platform - Target platform (ios, android, web)
     * @returns Platform-specific token values
     */
    getTokensForPlatform(platform: Platform): PlatformTokens;
    /**
     * Convert a token to platform-specific value
     *
     * @param token - Token to convert (primitive or semantic)
     * @param platform - Target platform
     * @returns Platform-specific value with unit
     */
    convertToken(token: PrimitiveToken | SemanticToken, platform: Platform): PlatformValue;
    /**
     * Select appropriate token following priority: semantic → primitive → component
     *
     * @param request - Token request specification
     * @param options - Selection options
     * @returns Token selection with reasoning
     */
    selectToken(request: TokenRequest, options?: TokenSelectionOptions): TokenSelection;
    /**
     * Validate token selection follows priority rules
     *
     * @param selection - Token selection to validate
     * @returns Validation result with errors/warnings
     */
    validateTokenSelection(selection: TokenSelection): {
        valid: boolean;
        errors: string[];
        warnings: string[];
    };
    /**
     * Generate component token when semantic and primitive tokens insufficient
     *
     * @param spec - Component token specification
     * @returns Generated component token
     */
    generateComponentToken(spec: ComponentTokenSpec): ComponentToken;
    /**
     * Validate mathematical consistency across platforms
     *
     * @param token - Token to validate
     * @returns Validation result
     */
    validateMathematicalConsistency(token: PrimitiveToken | SemanticToken | ComponentToken): {
        consistent: boolean;
        platforms: Record<Platform, PlatformValue>;
        issues: string[];
    };
}
/**
 * Token integrator implementation
 *
 * Implements the token integration layer with F1 token system integration
 */
export declare class TokenIntegratorImpl implements TokenIntegrator {
    private primitiveRegistry;
    private semanticRegistry;
    private tokenSelector;
    private componentGenerator;
    private unitConverter;
    constructor(primitiveRegistry: PrimitiveTokenRegistry, semanticRegistry: SemanticTokenRegistry);
    /**
     * Get all tokens for a specific platform with proper unit conversion
     */
    getTokensForPlatform(platform: Platform): PlatformTokens;
    /**
     * Convert a token to platform-specific value
     */
    convertToken(token: PrimitiveToken | SemanticToken, platform: Platform): PlatformValue;
    /**
     * Select appropriate token following priority: semantic → primitive → component
     */
    selectToken(request: TokenRequest, options?: TokenSelectionOptions): TokenSelection;
    /**
     * Validate token selection follows priority rules
     */
    validateTokenSelection(selection: TokenSelection): {
        valid: boolean;
        errors: string[];
        warnings: string[];
    };
    /**
     * Generate component token when semantic and primitive tokens insufficient
     */
    generateComponentToken(spec: ComponentTokenSpec): ComponentToken;
    /**
     * Validate mathematical consistency across platforms
     */
    validateMathematicalConsistency(token: PrimitiveToken | SemanticToken | ComponentToken): {
        consistent: boolean;
        platforms: Record<Platform, PlatformValue>;
        issues: string[];
    };
}
//# sourceMappingURL=TokenIntegrator.d.ts.map