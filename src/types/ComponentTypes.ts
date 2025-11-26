/**
 * Component Type Definitions
 * 
 * Shared type definitions for component props and interfaces used across
 * the DesignerPunk design system. These types ensure consistency across
 * web, iOS, and Android implementations following True Native Architecture.
 * 
 * @module types/ComponentTypes
 */

/**
 * Inset padding values (internal spacing)
 * 
 * String literal union type for inset padding prop values with "inset" prefix.
 * These values map to semantic spacing tokens in the token system.
 * 
 * Values represent multiples of base spacing (space100 = 8px):
 * - **inset050**: 4px (0.5 × base) - Minimal internal spacing
 * - **inset100**: 8px (1 × base) - Compact internal spacing
 * - **inset150**: 12px (1.5 × base) - Standard internal spacing
 * - **inset200**: 16px (2 × base) - Comfortable internal spacing
 * - **inset300**: 24px (3 × base) - Spacious internal spacing
 * - **inset400**: 32px (4 × base) - Maximum internal spacing
 * 
 * @remarks
 * The "inset" prefix provides context for developers and AI agents, making
 * prop values self-documenting. Components map these prefixed values to
 * token paths by stripping the prefix:
 * 
 * ```typescript
 * "inset150" → "space.inset.150" → space150 → 12px
 * ```
 * 
 * Mathematical relationships:
 * - 050 is 0.5 × base (space100)
 * - 100 is 1 × base (space100)
 * - 150 is 1.5 × base (space100)
 * - 200 is 2 × base (space100)
 * - 300 is 3 × base (space100)
 * - 400 is 4 × base (space100)
 * 
 * @example
 * ```typescript
 * // Component usage
 * <Container padding="inset150">Content</Container>
 * <ButtonCTA padding="inset100" label="Click me" />
 * 
 * // Component implementation
 * interface ContainerProps {
 *   padding?: InsetPadding;
 *   children: ReactNode;
 * }
 * 
 * function Container({ padding, children }: ContainerProps) {
 *   // Map prop value to token path
 *   const tokenPath = padding 
 *     ? `space.inset.${padding.replace('inset', '')}` 
 *     : null;
 *   
 *   // Resolve token value
 *   const paddingValue = tokenPath ? getSemanticToken(tokenPath) : null;
 *   
 *   // Apply to platform-specific implementation
 *   return <div style={{ padding: paddingValue }}>{children}</div>;
 * }
 * ```
 * 
 * @see {@link https://github.com/3fn/DesignerPunkv2/blob/main/.kiro/specs/011-inset-token-renaming/design.md | Inset Token Renaming Design}
 */
export type InsetPadding = 
  | 'inset050' 
  | 'inset100' 
  | 'inset150' 
  | 'inset200' 
  | 'inset300' 
  | 'inset400';
