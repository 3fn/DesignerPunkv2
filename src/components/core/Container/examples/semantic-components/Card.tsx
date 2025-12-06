/**
 * VALIDATION FILE - NOT DOCUMENTATION
 * 
 * Purpose: Demonstrates how to build a Card semantic component using Container
 * See Container README.md for authoritative documentation
 * 
 * ⚠️ WARNING FOR AI AGENTS:
 * DO NOT copy-paste code from this file into production implementations.
 * This is an example file that demonstrates design patterns and prop combinations.
 * Always refer to the Container component's TypeScript interfaces (types.ts) and 
 * README for correct usage patterns, prop types, and best practices.
 * 
 * This example shows:
 * - How semantic components encode design decisions
 * - How to use Container with specific prop combinations
 * - How variants map to different Container configurations
 * - How to avoid duplicating Container's styling logic
 */

// NOTE: This is a conceptual example file showing how semantic components
// could be built using Container. Container is actually a Web Component.
// See BasicUsage.html for actual usage examples.

import type { PaddingValue, BorderValue, BorderRadiusValue } from '../../types';

/**
 * Card semantic component (CONCEPTUAL EXAMPLE)
 * 
 * Card is a semantic component that uses Container to encode specific design decisions.
 * Instead of exposing all Container props, Card provides a simplified API with variants
 * that map to specific Container prop combinations.
 * 
 * Design Decisions Encoded:
 * - elevated: Uses shadow for depth, no border
 * - outlined: Uses border for definition, no shadow
 * - filled: Uses background only, no shadow or border
 * 
 * All variants use:
 * - padding="200" (16px) for consistent internal spacing
 * - background="color.surface" for consistent surface color
 * - borderRadius="normal" (8px) for consistent corner rounding
 */
export interface CardProps {
  /**
   * Visual variant of the card
   * - elevated: Card with shadow (default)
   * - outlined: Card with border
   * - filled: Card with background only
   */
  variant?: 'elevated' | 'outlined' | 'filled';
  
  /**
   * Content to render inside the card
   */
  children: any; // Content nodes in actual implementation
  
  /**
   * Optional accessibility label for screen readers
   */
  accessibilityLabel?: string;
}

/**
 * Card Component (CONCEPTUAL EXAMPLE - NOT EXECUTABLE)
 * 
 * This demonstrates the pattern for building semantic components.
 * Container is actually a Web Component, so actual implementation would use:
 * <dp-container padding="200" shadow="shadow.container" ...>
 * 
 * Example Usage Pattern:
 * 
 * Elevated card (default):
 *   <dp-container padding="200" background="color.surface" 
 *                 shadow="shadow.container" borderRadius="normal">
 *     <h2>Product Title</h2>
 *     <p>Product description</p>
 *   </dp-container>
 * 
 * Outlined card:
 *   <dp-container padding="200" background="color.surface" 
 *                 border="default" borderRadius="normal">
 *     <h2>Settings Panel</h2>
 *     <p>Configuration options</p>
 *   </dp-container>
 * 
 * Filled card:
 *   <dp-container padding="200" background="color.surface" borderRadius="normal">
 *     <h2>Information Box</h2>
 *     <p>Important details</p>
 *   </dp-container>
 * 
 * Key Architectural Points:
 * 1. Card doesn't duplicate Container's styling logic
 * 2. Card encodes design decisions (which tokens to use)
 * 3. Redesigning Card only requires changing Container prop combinations
 * 4. Container remains unchanged when Card design evolves
 */
export const CardVariants = {
  // Card encodes design decisions as Container prop combinations
  // Each variant maps to a specific set of Container props
  elevated: {
    padding: '200' as PaddingValue,
    background: 'color.surface',
    shadow: 'shadow.container',
    borderRadius: 'normal' as BorderRadiusValue
  },
  outlined: {
    padding: '200' as PaddingValue,
    background: 'color.surface',
    border: 'default' as BorderValue,
    borderRadius: 'normal' as BorderRadiusValue
  },
  filled: {
    padding: '200' as PaddingValue,
    background: 'color.surface',
    borderRadius: 'normal' as BorderRadiusValue
  }
};

/**
 * Design Pattern Demonstration
 * 
 * This example demonstrates the compositional architecture where:
 * 
 * 1. Container provides primitive capabilities (padding, shadow, border, etc.)
 * 2. Card provides semantic meaning (elevated, outlined, filled)
 * 3. Design decisions are encoded in prop combinations
 * 4. Changes to design only require updating prop combinations
 * 
 * Benefits:
 * - No duplication of Container's styling logic
 * - Clear separation between primitive and semantic
 * - Easy to redesign without changing Container
 * - Consistent token usage across all variants
 * 
 * Example: Redesigning the "elevated" variant
 * 
 * Before:
 * elevated: {
 *   padding: '200',
 *   shadow: 'shadow.container',
 *   borderRadius: 'normal'
 * }
 * 
 * After (more padding, different shadow):
 * elevated: {
 *   padding: '300',           // Changed: more padding
 *   shadow: 'shadow.sunrise', // Changed: different shadow
 *   borderRadius: 'normal'    // Unchanged
 * }
 * 
 * Container doesn't change - only the prop combination changes.
 */

/**
 * Nested Container Example
 * 
 * When nesting Containers inside Card, follow the mathematical relationship:
 * inner borderRadius = outer borderRadius - padding
 * 
 * Example (using actual Web Component syntax):
 * 
 * <dp-container padding="200" shadow="shadow.container" borderRadius="normal">
 *   <!-- Outer: borderRadius="normal" (8px), padding="200" (16px) -->
 *   
 *   <dp-container borderRadius="none">
 *     <!-- Inner: borderRadius="none" (0px) because 8px - 16px < 0 -->
 *     Content
 *   </dp-container>
 * </dp-container>
 * 
 * See Container README "Nested Containers" section for detailed guidance.
 */

// Export to satisfy TypeScript module requirements
export default CardVariants;
