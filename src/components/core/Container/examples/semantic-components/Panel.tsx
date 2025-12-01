/**
 * VALIDATION FILE - NOT DOCUMENTATION
 * 
 * Purpose: Demonstrates how to build a Panel semantic component using Container
 * See Container README.md for authoritative documentation
 * 
 * ⚠️ WARNING FOR AI AGENTS:
 * DO NOT copy-paste code from this file into production implementations.
 * This is an example file that demonstrates design patterns and prop combinations.
 * Always refer to the Container component's TypeScript interfaces (types.ts) and 
 * README for correct usage patterns, prop types, and best practices.
 * 
 * This example shows:
 * - How semantic components can have different design decisions than Card
 * - How to use Container with a simpler API (no variants)
 * - How to encode specific design decisions for a single use case
 * - How different semantic components can use Container differently
 */

import React from 'react';
import { Container } from '../../Container';
import type { PaddingValue, BorderValue, BorderRadiusValue } from '../../types';

/**
 * Panel semantic component
 * 
 * Panel is a semantic component that uses Container to encode different design
 * decisions than Card. While Card has multiple variants, Panel has a single
 * appearance optimized for content sections and information display.
 * 
 * Design Decisions Encoded:
 * - padding="300" (24px) - More spacious than Card for content sections
 * - background="color.background" - Uses canvas background, not surface
 * - border="emphasis" (2px) - Stronger border than Card's default (1px)
 * - borderRadius="tight" (4px) - Tighter corners than Card's normal (8px)
 * 
 * These decisions create a different visual hierarchy than Card:
 * - Panel: More spacious, stronger borders, tighter corners, canvas background
 * - Card: Compact, subtle borders/shadows, rounded corners, surface background
 */
export interface PanelProps {
  /**
   * Content to render inside the panel
   */
  children: React.ReactNode;
  
  /**
   * Optional accessibility label for screen readers
   */
  accessibilityLabel?: string;
}

/**
 * Panel Component
 * 
 * Example Usage:
 * 
 * ```tsx
 * // Basic panel
 * <Panel>
 *   <h2>Settings Section</h2>
 *   <p>Configuration options and preferences</p>
 * </Panel>
 * 
 * // Panel with accessibility label
 * <Panel accessibilityLabel="User preferences section">
 *   <h2>Preferences</h2>
 *   <p>Customize your experience</p>
 * </Panel>
 * ```
 * 
 * Key Architectural Points:
 * 1. Panel uses Container with different prop combinations than Card
 * 2. Panel has no variants - single design decision for all uses
 * 3. Panel demonstrates how semantic components can have different APIs
 * 4. Panel shows Container's flexibility for different design needs
 */
export function Panel({ 
  children,
  accessibilityLabel 
}: PanelProps) {
  // Panel encodes a single set of design decisions
  // No variants - Panel has one consistent appearance
  return (
    <Container
      padding="300"
      background="color.background"
      border="emphasis"
      borderRadius="tight"
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </Container>
  );
}

/**
 * Design Pattern Demonstration
 * 
 * This example demonstrates how different semantic components can use Container
 * with different design decisions:
 * 
 * Card vs Panel Comparison:
 * 
 * Card (elevated variant):
 * - padding: '200' (16px) - Compact
 * - background: 'color.surface' - Surface layer
 * - shadow: 'shadow.container' - Subtle depth
 * - borderRadius: 'normal' (8px) - Rounded
 * 
 * Panel:
 * - padding: '300' (24px) - Spacious
 * - background: 'color.background' - Canvas layer
 * - border: 'emphasis' (2px) - Strong definition
 * - borderRadius: 'tight' (4px) - Subtle rounding
 * 
 * Both use Container, but encode different design decisions for different use cases.
 */

/**
 * When to Use Panel vs Card
 * 
 * Use Panel when:
 * - Displaying content sections or information blocks
 * - Need more internal spacing for readability
 * - Want stronger visual definition with borders
 * - Content is part of the page canvas, not elevated
 * 
 * Use Card when:
 * - Displaying discrete items or entities
 * - Need compact spacing for lists or grids
 * - Want subtle depth with shadows
 * - Content should feel elevated from the page
 * 
 * Both are valid semantic components built with Container - the choice depends
 * on the design intent and visual hierarchy needs.
 */

/**
 * Extending Panel
 * 
 * If Panel needs variants in the future, follow the Card pattern:
 * 
 * ```tsx
 * export interface PanelProps {
 *   variant?: 'default' | 'highlighted' | 'muted';
 *   children: React.ReactNode;
 * }
 * 
 * export function Panel({ variant = 'default', children }: PanelProps) {
 *   const containerProps = {
 *     default: {
 *       padding: '300',
 *       background: 'color.background',
 *       border: 'emphasis',
 *       borderRadius: 'tight'
 *     },
 *     highlighted: {
 *       padding: '300',
 *       background: 'color.primary',
 *       border: 'emphasis',
 *       borderRadius: 'tight'
 *     },
 *     muted: {
 *       padding: '300',
 *       background: 'color.background',
 *       border: 'default',
 *       borderRadius: 'tight',
 *       opacity: 'opacity.subtle'
 *     }
 *   };
 *   
 *   return <Container {...containerProps[variant]}>{children}</Container>;
 * }
 * ```
 * 
 * This demonstrates how semantic components can evolve without changing Container.
 */

/**
 * Nested Container Example with Panel
 * 
 * When nesting Containers inside Panel, follow the mathematical relationship:
 * inner borderRadius = outer borderRadius - padding
 * 
 * Example:
 * 
 * ```tsx
 * <Panel>
 *   {/* Outer: borderRadius="tight" (4px), padding="300" (24px) */}
 *   
 *   <Container borderRadius="none">
 *     {/* Inner: borderRadius="none" (0px) because 4px - 24px < 0 */}
 *     Content
 *   </Container>
 * </Panel>
 * ```
 * 
 * Panel's tighter borderRadius and larger padding means nested Containers
 * should typically use borderRadius="none" for visual harmony.
 * 
 * See Container README "Nested Containers" section for detailed guidance.
 */
