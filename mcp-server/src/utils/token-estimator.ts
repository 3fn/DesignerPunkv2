/**
 * Token Count Estimator
 * 
 * Provides token count estimation for documentation content using a simple heuristic.
 * Uses character count / 4 as a rough approximation of token count.
 * 
 * This is a mechanical estimation that doesn't require LLM calls or complex tokenization.
 */

/**
 * Estimates the token count for a given string content.
 * 
 * Uses a simple heuristic: character count / 4
 * This approximation is commonly used for English text and provides
 * a reasonable estimate without requiring actual tokenization.
 * 
 * @param content - The string content to estimate tokens for
 * @returns Estimated token count (rounded to nearest integer)
 * 
 * @example
 * ```typescript
 * const content = "This is a sample document with some content.";
 * const tokens = estimateTokenCount(content);
 * console.log(`Estimated tokens: ${tokens}`);
 * ```
 */
export function estimateTokenCount(content: string): number {
  // Simple heuristic: character count / 4
  // This provides a reasonable approximation for English text
  const characterCount = content.length;
  const estimatedTokens = characterCount / 4;
  
  // Round to nearest integer for cleaner output
  return Math.round(estimatedTokens);
}
