/**
 * Component Token Generator
 *
 * Generates component-specific tokens when semantic and primitive tokens
 * are mathematically insufficient for design requirements.
 *
 * Component tokens are the fallback in the priority system:
 * semantic → primitive → component
 */
import { ComponentToken, ComponentTokenSpec, ComponentTokenGenerator as IComponentTokenGenerator, ComponentTokenValidationResult, PromotionRecommendation } from './ComponentToken';
import { PrimitiveTokenRegistry } from '../../registries/PrimitiveTokenRegistry';
/**
 * Component token generator implementation
 *
 * Generates component tokens with:
 * - Mathematical validation
 * - Cross-platform unit conversion
 * - Usage tracking
 * - Promotion candidate detection
 */
export declare class ComponentTokenGenerator implements IComponentTokenGenerator {
    private primitiveRegistry;
    constructor(primitiveRegistry: PrimitiveTokenRegistry);
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
    /**
     * Generate platform-specific values from base value
     */
    private generatePlatformValues;
    /**
     * Validate platform values are mathematically consistent
     */
    private validatePlatformConsistency;
    /**
     * Find similar primitive token if exists
     */
    private findSimilarPrimitiveToken;
    /**
     * Generate suggested primitive token name
     */
    private generatePrimitiveName;
}
//# sourceMappingURL=ComponentTokenGenerator.d.ts.map