/**
 * Shared Token Types
 *
 * Common types used across the token integration layer to avoid circular dependencies.
 */
import { ColorTokenValue } from '../../types/PrimitiveToken';
/**
 * Platform types supported by the build system
 */
export type Platform = 'ios' | 'android' | 'web';
/**
 * Platform-specific value with unit
 *
 * Supports numeric values, string values, and ColorTokenValue for color tokens
 */
export interface PlatformValue {
    /** Numeric value, string value, or ColorTokenValue for color tokens */
    value: number | string | ColorTokenValue;
    /** Platform-specific unit (pt, dp, sp, px, rem, hex) */
    unit: string;
    /** Token name that generated this value */
    token: string;
}
//# sourceMappingURL=types.d.ts.map