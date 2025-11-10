/**
 * Breakpoint Token Definitions
 *
 * Breakpoint tokens define viewport width thresholds for responsive behavior.
 * Primarily used by web platforms for media queries and responsive grid systems.
 * Values are practical device-based measurements rather than mathematical progressions.
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
/**
 * Breakpoint token base value (smallest breakpoint)
 */
export declare const BREAKPOINT_BASE_VALUE = 320;
/**
 * Breakpoint tokens with practical device-based values
 */
export declare const breakpointTokens: Record<string, PrimitiveToken>;
/**
 * Array of all breakpoint token names for iteration
 */
export declare const breakpointTokenNames: string[];
/**
 * Get breakpoint token by name
 */
export declare function getBreakpointToken(name: string): PrimitiveToken | undefined;
/**
 * Get all breakpoint tokens as array
 */
export declare function getAllBreakpointTokens(): PrimitiveToken[];
//# sourceMappingURL=BreakpointTokens.d.ts.map