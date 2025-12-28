/**
 * Acknowledged Differences Registry Types
 * 
 * TypeScript type definitions for the acknowledged platform-specific differences registry.
 * Used by cross-platform consistency tests to allow documented intentional differences.
 */

/**
 * Supported platform identifiers
 */
export type Platform = 'web' | 'ios' | 'android';

/**
 * Categories of platform differences
 */
export type DifferenceCategory = 
  | 'unit'      // Different units (px vs pt vs dp)
  | 'syntax'    // Different syntax (CSS vs Swift vs Kotlin)
  | 'naming'    // Different naming conventions (kebab-case vs camelCase vs snake_case)
  | 'scale'     // Different scale systems (z-index vs elevation)
  | 'format'    // Different data formats (hex vs Color struct)
  | 'value'     // Different actual values (44pt vs 48dp tap areas)
  | 'behavior'; // Different runtime behavior

/**
 * A platform-specific token that exists only on certain platforms
 */
export interface PlatformSpecificToken {
  /** Token name (e.g., 'elevation.none') */
  token: string;
  
  /** Platform where this token exists */
  platform: Platform;
  
  /** Explanation of why this token is platform-specific */
  reason: string;
  
  /** Name of the person who authorized this difference */
  authorizedBy: string;
  
  /** ISO 8601 date when this was authorized */
  date: string;
}

/**
 * Platform-specific tokens section
 */
export interface PlatformSpecificTokensSection {
  /** Description of this section */
  description: string;
  
  /** List of platform-specific tokens */
  tokens: PlatformSpecificToken[];
}

/**
 * A single acknowledged platform-specific difference
 */
export interface AcknowledgedDifference {
  /** Token path pattern (e.g., 'spacing.inset.100' or 'typography.fontSize.*' for wildcards) */
  token: string;
  
  /** Platforms affected by this difference */
  platforms: Platform[];
  
  /** Clear description of what differs between platforms */
  difference: string;
  
  /** Explanation of why this difference is intentional and acceptable */
  rationale: string;
  
  /** Name of the person who authorized this difference */
  authorizedBy: string;
  
  /** ISO 8601 date when this difference was authorized */
  date: string;
  
  /** Optional category for grouping related differences */
  category?: DifferenceCategory;
  
  /** Optional additional notes or context */
  notes?: string;
}

/**
 * Validation rules for the registry
 */
export interface ValidationRules {
  /** Allowed types of differences */
  allowedDifferenceTypes: DifferenceCategory[];
  
  /** Whether rationale is required for new entries */
  requireRationale: boolean;
  
  /** Whether authorization is required for new entries */
  requireAuthorization: boolean;
}

/**
 * The complete acknowledged differences registry
 */
export interface AcknowledgedDifferencesRegistry {
  /** JSON Schema reference */
  $schema?: string;
  
  /** Semantic version of the registry format */
  version: string;
  
  /** ISO 8601 date when the registry was last updated */
  lastUpdated: string;
  
  /** Human-readable description of the registry purpose */
  description?: string;
  
  /** Platform-specific tokens that exist only on certain platforms */
  platformSpecificTokens?: PlatformSpecificTokensSection;
  
  /** List of acknowledged platform-specific differences */
  acknowledgedDifferences: AcknowledgedDifference[];
  
  /** Rules for validating new difference entries */
  validationRules?: ValidationRules;
}

/**
 * Get the count of platform-specific tokens for a given platform
 * 
 * @param registry - The acknowledged differences registry
 * @param platform - The platform to check
 * @returns Number of platform-specific tokens for that platform
 */
export function getPlatformSpecificTokenCount(
  registry: AcknowledgedDifferencesRegistry,
  platform: Platform
): number {
  if (!registry.platformSpecificTokens?.tokens) {
    return 0;
  }
  return registry.platformSpecificTokens.tokens.filter(t => t.platform === platform).length;
}

/**
 * Get the list of platform-specific token names for a given platform
 * 
 * @param registry - The acknowledged differences registry
 * @param platform - The platform to check
 * @returns Array of token names that are specific to that platform
 */
export function getPlatformSpecificTokenNames(
  registry: AcknowledgedDifferencesRegistry,
  platform: Platform
): string[] {
  if (!registry.platformSpecificTokens?.tokens) {
    return [];
  }
  return registry.platformSpecificTokens.tokens
    .filter(t => t.platform === platform)
    .map(t => t.token);
}

/**
 * Helper function to check if a token matches a pattern
 * Supports wildcards (*) at the end of patterns
 * 
 * @param tokenName - The actual token name to check
 * @param pattern - The pattern from the registry (may include wildcards)
 * @returns true if the token matches the pattern
 */
export function tokenMatchesPattern(tokenName: string, pattern: string): boolean {
  // Exact match
  if (tokenName === pattern) {
    return true;
  }
  
  // Wildcard match (pattern ends with .*)
  if (pattern.endsWith('.*')) {
    const prefix = pattern.slice(0, -2); // Remove .*
    return tokenName.startsWith(prefix + '.') || tokenName === prefix;
  }
  
  // Wildcard match (pattern ends with *)
  if (pattern.endsWith('*')) {
    const prefix = pattern.slice(0, -1); // Remove *
    return tokenName.startsWith(prefix);
  }
  
  return false;
}

/**
 * Check if a platform difference is acknowledged in the registry
 * 
 * @param registry - The acknowledged differences registry
 * @param tokenName - The token name to check
 * @param platforms - The platforms involved in the difference
 * @returns The matching acknowledged difference, or undefined if not found
 */
export function findAcknowledgedDifference(
  registry: AcknowledgedDifferencesRegistry,
  tokenName: string,
  platforms: Platform[]
): AcknowledgedDifference | undefined {
  return registry.acknowledgedDifferences.find(diff => {
    // Check if token matches pattern
    if (!tokenMatchesPattern(tokenName, diff.token)) {
      return false;
    }
    
    // Check if all specified platforms are covered by this difference
    return platforms.every(platform => diff.platforms.includes(platform));
  });
}

/**
 * Check if a difference between platforms is acknowledged
 * 
 * @param registry - The acknowledged differences registry
 * @param tokenName - The token name to check
 * @param platform1 - First platform
 * @param platform2 - Second platform
 * @returns true if the difference is acknowledged
 */
export function isDifferenceAcknowledged(
  registry: AcknowledgedDifferencesRegistry,
  tokenName: string,
  platform1: Platform,
  platform2: Platform
): boolean {
  return findAcknowledgedDifference(registry, tokenName, [platform1, platform2]) !== undefined;
}
