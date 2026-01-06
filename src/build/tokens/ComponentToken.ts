/**
 * Component Token Interface
 * 
 * Represents component-specific tokens created when semantic and primitive
 * tokens are mathematically insufficient for design requirements.
 * 
 * Component tokens are the fallback in the priority system:
 * semantic → primitive → component
 * 
 * @deprecated This interface is deprecated and will be removed in a future version.
 * Use the new `defineComponentTokens()` helper from `src/build/tokens/defineComponentTokens.ts` instead.
 * 
 * Migration guide:
 * - Replace `ComponentToken` interface usage with `defineComponentTokens()` helper
 * - The new API provides lightweight authoring with automatic registry integration
 * - See `.kiro/specs/037-component-token-generation-pipeline/design.md` for architecture details
 * 
 * @example
 * ```typescript
 * // OLD (deprecated):
 * const token: ComponentToken = {
 *   name: 'buttonIcon.inset.large',
 *   category: 'spacing',
 *   baseValue: 12,
 *   component: 'ButtonIcon',
 *   reasoning: 'Large button padding',
 *   // ... many more required fields
 * };
 * 
 * // NEW (recommended):
 * import { defineComponentTokens } from './defineComponentTokens';
 * import { spacingTokens } from '../../tokens/SpacingTokens';
 * 
 * const ButtonIconTokens = defineComponentTokens({
 *   component: 'ButtonIcon',
 *   family: 'spacing',
 *   tokens: {
 *     'inset.large': {
 *       reference: spacingTokens.space150,
 *       reasoning: 'Large button requires 12px padding for visual balance',
 *     },
 *   },
 * });
 * ```
 * 
 * @see defineComponentTokens - The new recommended API for component tokens
 * @see ComponentTokenRegistry - Global registry for component token management
 */

import { Platform, PlatformValue } from './types';
import { TokenCategory } from './PlatformTokens';

/**
 * Component token definition
 * 
 * Created only when:
 * 1. Semantic tokens cannot achieve design requirements
 * 2. Primitive tokens cannot achieve design requirements
 * 3. Mathematical reasoning justifies the new token
 * 
 * @deprecated Use `defineComponentTokens()` from `./defineComponentTokens` instead.
 * The new API provides a simpler interface with automatic registry integration.
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
 * 
 * @deprecated Use `defineComponentTokens()` from `./defineComponentTokens` instead.
 * Platform values are now generated automatically by the token generation pipeline.
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
 * 
 * @deprecated Use `TokenWithReference` from `./defineComponentTokens` instead.
 * The new API uses direct primitive token references with automatic value extraction.
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
 * 
 * @deprecated Usage tracking is no longer part of the component token API.
 * Use `defineComponentTokens()` from `./defineComponentTokens` instead.
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
 * 
 * @deprecated Metadata is now handled automatically by `ComponentTokenRegistry`.
 * Use `defineComponentTokens()` from `./defineComponentTokens` instead.
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
 * 
 * @deprecated Use `defineComponentTokens()` from `./defineComponentTokens` instead.
 * Token generation is now handled automatically by the helper function.
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
 * 
 * @deprecated Use `ComponentTokenConfig` from `./defineComponentTokens` instead.
 * The new API uses a simpler configuration interface.
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
 * 
 * @deprecated Validation is now handled by `ValidationCoordinator.validateComponentToken()`.
 * Use `defineComponentTokens()` from `./defineComponentTokens` for token creation.
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
 * 
 * @deprecated Promotion tracking is no longer part of the component token API.
 * Use `defineComponentTokens()` from `./defineComponentTokens` instead.
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
