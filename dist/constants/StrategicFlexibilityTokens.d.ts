/**
 * Strategic Flexibility Token Definitions
 *
 * These tokens provide strategic flexibility within the mathematical token system.
 * They are mathematically derived but break systematic progression within their families.
 * Usage should maintain ≥80% appropriate usage patterns.
 *
 * Strategic Flexibility Values:
 * - 2: Fine-grain spacing for exceptional component-internal needs
 * - 4: Sub-grid spacing for medium-scale adjustments
 * - 6: Component-level spacing that breaks 8-unit grid
 * - 10: Specific design requirements between standard progressions
 * - 12: Sub-grid spacing for larger adjustments
 * - 20: Larger spacing needs between standard progressions
 */
export declare const STRATEGIC_FLEXIBILITY_VALUES: readonly [2, 4, 6, 10, 12, 20];
export type StrategicFlexibilityValue = typeof STRATEGIC_FLEXIBILITY_VALUES[number];
/**
 * Strategic flexibility tokens with their mathematical derivations
 */
export declare const STRATEGIC_FLEXIBILITY_TOKENS: {
    readonly space025: {
        readonly value: 2;
        readonly derivation: "space100 × 0.25";
        readonly baseToken: "space100";
        readonly multiplier: 0.25;
        readonly category: "spacing";
        readonly usage: "Component-internal fine-grain spacing for exceptional design requirements";
    };
    readonly space050: {
        readonly value: 4;
        readonly derivation: "space100 × 0.5";
        readonly baseToken: "space100";
        readonly multiplier: 0.5;
        readonly category: "spacing";
        readonly usage: "Sub-grid spacing for medium-scale adjustments and typography alignment";
    };
    readonly space075: {
        readonly value: 6;
        readonly derivation: "space100 × 0.75";
        readonly baseToken: "space100";
        readonly multiplier: 0.75;
        readonly category: "spacing";
        readonly usage: "Component-level spacing that requires breaking 8-unit grid";
    };
    readonly space125: {
        readonly value: 10;
        readonly derivation: "space100 × 1.25";
        readonly baseToken: "space100";
        readonly multiplier: 1.25;
        readonly category: "spacing";
        readonly usage: "Specific design requirements between standard progressions";
    };
    readonly space150: {
        readonly value: 12;
        readonly derivation: "space100 × 1.5";
        readonly baseToken: "space100";
        readonly multiplier: 1.5;
        readonly category: "spacing";
        readonly usage: "Sub-grid spacing for larger adjustments and typography alignment";
    };
    readonly space250: {
        readonly value: 20;
        readonly derivation: "space100 × 2.5";
        readonly baseToken: "space100";
        readonly multiplier: 2.5;
        readonly category: "spacing";
        readonly usage: "Larger spacing needs between standard progressions";
    };
};
/**
 * Check if a value is a strategic flexibility token
 */
export declare function isStrategicFlexibilityValue(value: number): boolean;
/**
 * Get strategic flexibility token information by value
 */
export declare function getStrategicFlexibilityToken(value: number): {
    readonly value: 2;
    readonly derivation: "space100 × 0.25";
    readonly baseToken: "space100";
    readonly multiplier: 0.25;
    readonly category: "spacing";
    readonly usage: "Component-internal fine-grain spacing for exceptional design requirements";
} | {
    readonly value: 4;
    readonly derivation: "space100 × 0.5";
    readonly baseToken: "space100";
    readonly multiplier: 0.5;
    readonly category: "spacing";
    readonly usage: "Sub-grid spacing for medium-scale adjustments and typography alignment";
} | {
    readonly value: 6;
    readonly derivation: "space100 × 0.75";
    readonly baseToken: "space100";
    readonly multiplier: 0.75;
    readonly category: "spacing";
    readonly usage: "Component-level spacing that requires breaking 8-unit grid";
} | {
    readonly value: 10;
    readonly derivation: "space100 × 1.25";
    readonly baseToken: "space100";
    readonly multiplier: 1.25;
    readonly category: "spacing";
    readonly usage: "Specific design requirements between standard progressions";
} | {
    readonly value: 12;
    readonly derivation: "space100 × 1.5";
    readonly baseToken: "space100";
    readonly multiplier: 1.5;
    readonly category: "spacing";
    readonly usage: "Sub-grid spacing for larger adjustments and typography alignment";
} | {
    readonly value: 20;
    readonly derivation: "space100 × 2.5";
    readonly baseToken: "space100";
    readonly multiplier: 2.5;
    readonly category: "spacing";
    readonly usage: "Larger spacing needs between standard progressions";
} | undefined;
//# sourceMappingURL=StrategicFlexibilityTokens.d.ts.map