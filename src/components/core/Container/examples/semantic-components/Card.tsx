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

import React from 'react';
import { Container } from '../../Container';
import type { PaddingValue, BorderValue, BorderRadiusValue } from '../../types';

/**
 * Card semantic component
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
  children: React.ReactNode;
  
  /**
   * Optional accessibility label for screen readers
   */
  accessibilityLabel?: string;
}

/**
 * Card Component
 * 
 * Example Usage:
 * 
 * ```tsx
 * // Elevated card (default)
 * <Card>
 *   <h2>Product Title</h2>
 *   <p>Product description</p>
 * </Card>
 * 
 * // Outlined card
 * <Card variant="outlined">
 *   <h2>Settings Panel</h2>
 *   <p>Configuration options</p>
 * </Card>
 * 
 * // Filled card
 * <Card variant="filled">
 *   <h2>Information Box</h2>
 *   <p>Important details</p>
 * </Card>
 * ```
 * 
 * Key Architectural Points:
 * 1. Card doesn't duplicate Container's styling logic
 * 2. Card encodes design decisions (which tokens to use)
 * 3. Redesigning Card only requires changing Container prop combinations
 * 4. Container remains unchanged when Card design evolves
 */
export function Card({ 
  variant = 'elevated', 
  children,
  accessibilityLabel 
}: CardProps) {
  // Card encodes design decisions as Container prop combinations
  // Each variant maps to a specific set of Container props
  const containerProps = {
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
  
  return (
    <Container 
      {...containerProps[variant]}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </Container>
  );
}

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
 * Example:
 * 
 * ```tsx
 * <Card variant="elevated">
 *   {/* Outer: borderRadius="normal" (8px), padding="200" (16px) */}
 *   
 *   <Container borderRadius="none">
 *     {/* Inner: borderRadius="none" (0px) because 8px - 16px < 0 */}
 *     Content
 *   </Container>
 * </Card>
 * ```
 * 
 * See Container README "Nested Containers" section for detailed guidance.
 */
