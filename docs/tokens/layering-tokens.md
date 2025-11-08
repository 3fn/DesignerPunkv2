# Layering Tokens

**Date**: October 28, 2025
**Purpose**: Documentation guide for the Layering Token System
**Organization**: token-documentation
**Scope**: cross-project

---

## Overview

The Layering Token System provides semantic tokens for controlling element stacking order across web, iOS, and Android platforms. The system acknowledges fundamental platform differences: web and iOS separate stacking order (z-index) from visual depth (shadows), while Android Material Design couples these concerns through elevation.

The system introduces two platform-specific token sets:
- **Z-Index Tokens** (Web + iOS): Pure stacking order, used independently with shadow tokens
- **Elevation Tokens** (Android): Stacking order + shadow rendering (Material Design convention)

---

## Semantic-Only Architecture

### Why No Primitive Layer?

Unlike other token categories (spacing, fontSize, etc.) that follow a primitive→semantic hierarchy, layering tokens are **semantic-only** with no primitive token layer.

**Rationale**:

1. **No Mathematical Relationships**: Z-index values are ordinal (ordering), not mathematical (relationships). There's no meaningful mathematical relationship between z-index 100 and 400. "Modal" isn't "4× more elevated" than "container" in any mathematical sense.

2. **Platform-Specific Scales**: Web uses arbitrary z-index values (100, 200, 300), Android uses Material Design elevation scale (4dp, 8dp, 16dp), and iOS uses small integers (1, 2, 3). These scales don't align mathematically.

3. **Component-Driven**: Layering is inherently about component stacking order (modal above dropdown), not mathematical progressions. Semantic names (container, modal, tooltip) are more meaningful than mathematical abstractions.

**Trade-offs**:
- ✅ **Gained**: Simpler token structure, no unnecessary primitive layer
- ✅ **Gained**: Platform-specific scales can differ appropriately
- ✅ **Gained**: Clear semantic naming without mathematical abstraction
- ❌ **Lost**: Consistency with other token categories (but appropriately so)

This approach respects platform-native conventions while maintaining cross-platform semantic consistency.

---

## Z-Index Tokens (Web + iOS)

### Token Structure

Z-Index tokens provide stacking order values for web and iOS platforms. They use direct numeric values and can be used independently with shadow tokens for visual depth.

**Available Tokens**:

| Token | Web Value | iOS Value | Context |
|-------|-----------|-----------|---------|
| `zIndex.container` | 100 | 1 | Base z-index for container components (cards, panels, surfaces) |
| `zIndex.navigation` | 200 | 2 | Persistent navigation (headers, sidebars, sticky elements) |
| `zIndex.dropdown` | 300 | 3 | Temporary overlay content (dropdowns, popovers, menus) |
| `zIndex.modal` | 400 | 4 | Modal overlay content (dialogs, sheets, overlays) |
| `zIndex.toast` | 500 | 5 | Notification elements (toasts, snackbars, alerts) |
| `zIndex.tooltip` | 600 | 6 | Always-visible elements (tooltips, critical overlays) |

**Note**: iOS values are scaled down (1-6 instead of 100-600) to follow SwiftUI conventions. The semantic meaning and relative ordering remain consistent across platforms.

### Web Usage Examples

**Standard Modal with Shadow**:
```typescript
// React/TypeScript
import { zIndexTokens } from '@designerpunk/tokens';

<Modal style={{
  zIndex: zIndexTokens['zIndex.modal'].value,      // 400
  boxShadow: 'var(--shadow-modal)'                 // Visual depth
}}>
  <ModalContent />
</Modal>
```

**CSS Custom Properties**:
```css
/* Generated CSS */
:root {
  --z-index-container: 100;
  --z-index-navigation: 200;
  --z-index-dropdown: 300;
  --z-index-modal: 400;
  --z-index-toast: 500;
  --z-index-tooltip: 600;
}

/* Usage */
.modal {
  z-index: var(--z-index-modal);
  box-shadow: var(--shadow-modal);
}
```

**Sticky Header (No Shadow)**:
```typescript
// Z-index without shadow
<Header style={{
  position: 'sticky',
  top: 0,
  zIndex: zIndexTokens['zIndex.navigation'].value  // 200, no shadow
}}>
  <Navigation />
</Header>
```

**Card with Shadow (Default Z-Order)**:
```typescript
// Shadow without explicit z-index
<Card style={{
  boxShadow: 'var(--shadow-container)'  // z-index: auto (default)
}}>
  <CardContent />
</Card>
```

### iOS Usage Examples

**Standard Modal with Shadow**:
```swift
// SwiftUI
import DesignerPunk

Modal()
    .zIndex(DesignTokens.zIndexModal)      // 4
    .shadow(
        color: DesignTokens.shadowModalColor,
        radius: DesignTokens.shadowModalBlur,
        x: DesignTokens.shadowModalOffsetX,
        y: DesignTokens.shadowModalOffsetY
    )
```

**Sticky Header (No Shadow)**:
```swift
// Z-index without shadow
Header()
    .zIndex(DesignTokens.zIndexNavigation)  // 2, no shadow
```

**Card with Shadow (Default Z-Order)**:
```swift
// Shadow without explicit z-index
Card()
    .shadow(
        color: DesignTokens.shadowContainerColor,
        radius: DesignTokens.shadowContainerBlur,
        x: DesignTokens.shadowContainerOffsetX,
        y: DesignTokens.shadowContainerOffsetY
    )
    // Default zPosition (no explicit zIndex)
```

---

## Elevation Tokens (Android)

### Token Structure

Elevation tokens provide Material Design elevation values for Android. Elevation handles both stacking order and shadow rendering per Material Design conventions.

**Available Tokens**:

| Token | Value | Shadow Reference | Context |
|-------|-------|------------------|---------|
| `elevation.container` | 8dp | shadow.container | Container elevation (handles z-order and shadow) |
| `elevation.navigation` | 4dp | shadow.navigation | Navigation elevation (handles z-order and shadow) |
| `elevation.dropdown` | 8dp | shadow.dropdown | Dropdown elevation (handles z-order and shadow) |
| `elevation.modal` | 16dp | shadow.modal | Modal elevation (handles z-order and shadow) |
| `elevation.toast` | 24dp | shadow.toast | Toast elevation (handles z-order and shadow) |
| `elevation.tooltip` | 24dp | shadow.tooltip | Tooltip elevation (handles z-order and shadow) |

**Note**: Elevation values follow Material Design guidelines and align with shadow token visual depth for cross-platform consistency.

### Android Usage Examples

**Standard Modal**:
```kotlin
// Jetpack Compose
import com.designerpunk.tokens.DesignTokens

Modal(
    elevation = DesignTokens.elevation_modal  // 16dp - handles both z-order and shadow
) {
    ModalContent()
}
```

**Dropdown Menu**:
```kotlin
DropdownMenu(
    elevation = DesignTokens.elevation_dropdown  // 8dp
) {
    DropdownMenuItem { Text("Option 1") }
    DropdownMenuItem { Text("Option 2") }
}
```

**Toast Notification**:
```kotlin
Snackbar(
    elevation = DesignTokens.elevation_toast  // 24dp
) {
    Text("Action completed successfully")
}
```

**Important**: Do NOT use separate shadow tokens on Android. Elevation handles both stacking order and shadow rendering per Material Design conventions.

---

## Shadow Token Integration

### Cross-Platform Alignment

Each elevation token references a corresponding shadow token to maintain cross-platform visual consistency:

| Semantic Level | Z-Index (Web/iOS) | Elevation (Android) | Shadow Token | Visual Depth |
|----------------|-------------------|---------------------|--------------|--------------|
| container | 100 / 1 | 8dp | shadow.container | Low |
| navigation | 200 / 2 | 4dp | shadow.navigation | Minimal |
| dropdown | 300 / 3 | 8dp | shadow.dropdown | Low |
| modal | 400 / 4 | 16dp | shadow.modal | Medium |
| toast | 500 / 5 | 24dp | shadow.toast | High |
| tooltip | 600 / 6 | 24dp | shadow.tooltip | High |

### How It Works

**Web/iOS**: Stacking order and visual depth are separate concerns
```typescript
// Web: Combine z-index token + shadow token
<Modal style={{
  zIndex: tokens.zIndex.modal,      // Stacking order
  boxShadow: tokens.shadow.modal    // Visual depth
}}>
```

**Android**: Elevation handles both concerns
```kotlin
// Android: Elevation handles both z-order and shadow
Modal(
  elevation = tokens.elevation.modal  // Both stacking and shadow
)
```

### Shadow Token Structure

Shadow tokens include Android-specific elevation values:

```typescript
// src/tokens/semantic/ShadowTokens.ts
export const shadowTokens = {
  'shadow.modal': {
    name: 'shadow.modal',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.000',
      offsetY: 'shadowOffsetY.200',
      blur: 'shadowBlurDepth200',
      opacity: 'shadowOpacityDepth200',
      color: 'color.shadow.default'
    },
    platforms: {
      web: { /* CSS box-shadow format */ },
      ios: { /* SwiftUI shadow properties */ },
      android: {
        elevation: 16  // Material Design elevation (dp)
      }
    },
    category: SemanticCategory.SHADOW,
    context: 'Modal shadow',
    description: 'Modal shadow with noon lighting and depth 200'
  }
};
```

---

## Edge Case Handling

### Web/iOS Edge Cases

**Z-Index Without Shadow**:
```typescript
// Use case: Sticky header that doesn't need shadow
<Header style={{
  position: 'sticky',
  top: 0,
  zIndex: tokens.zIndex.navigation  // 200, no shadow
}}>
```

**Shadow Without Z-Index**:
```typescript
// Use case: Card with shadow but default stacking order
<Card style={{
  boxShadow: tokens.shadow.container  // z-index: auto (default)
}}>
```

**Custom Z-Index for Edge Cases**:
```typescript
// Use case: Rare scenario requiring custom z-index
<Component style={{
  zIndex: 250  // Between navigation (200) and dropdown (300)
}}>
```

### Android Edge Cases

**Z-Order Without Shadow** (Rare):
```kotlin
// Use case: Element needs z-order but no shadow
// Material Design couples elevation and shadow, so use Modifier.zIndex() directly
Header(
    modifier = Modifier.zIndex(200f)  // Direct value, no elevation token
) {
    HeaderContent()
}
```

**Why No Elevation Token?**
- Material Design intentionally couples elevation and shadow
- Elevation tokens follow this convention (both z-order and shadow)
- For rare cases needing z-order without shadow, use platform features directly
- Token system optimizes for common cases (95%), platform features handle edge cases (5%)

**Custom Elevation for Edge Cases**:
```kotlin
// Use case: Rare scenario requiring custom elevation
Component(
    elevation = 12.dp  // Between navigation (4dp) and dropdown (8dp)
)
```

---

## AI Agent Generation Rules

### System Prompt for AI Agents

The following system prompt should be included in AI agent configurations when generating code that uses layering tokens. This ensures consistent, platform-appropriate token usage across all AI-generated code.

```markdown
## Layering Token Usage by Platform

### Web Platform
**Token Set**: Z-Index tokens
**Usage**: Use z-index tokens for stacking order, shadow tokens for visual depth

Example:
```typescript
<Modal style={{
  zIndex: tokens.zIndex.modal,      // Stacking order
  boxShadow: tokens.shadow.modal    // Visual depth
}}>
```

**Edge Cases**:
- Z-index without shadow: Use z-index token only
- Shadow without z-index: Use shadow token with default z-index (auto)

### iOS Platform
**Token Set**: Z-Index tokens
**Usage**: Use z-index tokens for stacking order, shadow tokens for visual depth

Example:
```swift
Modal()
  .zIndex(tokens.zIndex.modal)      // Stacking order
  .shadow(tokens.shadow.modal)      // Visual depth
```

**Edge Cases**:
- Z-index without shadow: Use zIndex() modifier only
- Shadow without z-index: Use shadow modifiers with default zPosition

### Android Platform
**Token Set**: Elevation tokens
**Usage**: Use elevation tokens (handles both stacking order and shadow)

Example:
```kotlin
Modal(
  elevation = tokens.elevation.modal  // Handles both z-order and shadow
)
```

**Important**: Do NOT use separate shadow tokens on Android. Elevation handles both concerns per Material Design.

**Edge Cases**:
- Z-order without shadow: Use `Modifier.zIndex()` directly (not a token)
  ```kotlin
  Header(
    modifier = Modifier.zIndex(200f)  // Direct value for edge case
  )
  ```

### Generation Decision Tree

1. **Identify target platform** (web, iOS, or Android)
2. **If web or iOS**:
   - Use `zIndex` tokens for stacking order
   - Use `shadow` tokens for visual depth
   - Can use independently or together
3. **If Android**:
   - Use `elevation` tokens (handles both)
   - Do NOT use separate shadow tokens
   - For z-order without shadow (rare), use `Modifier.zIndex()` directly
```

### Platform Detection

AI agents should identify the target platform and use the appropriate token set:

1. **Identify target platform** (web, iOS, or Android)
2. **If web or iOS**:
   - Use `zIndex` tokens for stacking order
   - Use `shadow` tokens for visual depth
   - Can use independently or together
3. **If Android**:
   - Use `elevation` tokens (handles both)
   - Do NOT use separate shadow tokens
   - For z-order without shadow (rare), use `Modifier.zIndex()` directly

### Generation Decision Tree

```
┌─────────────────────────┐
│ Identify Platform       │
└───────────┬─────────────┘
            │
    ┌───────┴───────┐
    │               │
┌───▼────┐    ┌────▼─────┐
│Web/iOS │    │ Android  │
└───┬────┘    └────┬─────┘
    │              │
    │              │
┌───▼──────────────────────────┐  ┌────▼──────────────────────────┐
│ Need stacking order?         │  │ Need stacking + shadow?       │
│ → Use zIndex token           │  │ → Use elevation token         │
│                              │  │                               │
│ Need visual depth?           │  │ Need z-order without shadow?  │
│ → Use shadow token           │  │ → Use Modifier.zIndex()       │
│                              │  │   (rare edge case)            │
│ Need both?                   │  └───────────────────────────────┘
│ → Use zIndex + shadow tokens │
└──────────────────────────────┘
```

### Conversation Examples

**Example 1: Standard Modal**
```
Human: "Create a modal with proper layering"

AI: "I'll use the appropriate layering tokens for each platform:
- Web: zIndex.modal (400) + shadow.modal
- iOS: zIndex.modal (4) + shadow.modal
- Android: elevation.modal (16dp - handles both)

[Generates platform-specific code]
```

**Example 2: Sticky Header (No Shadow)**
```
Human: "Create a sticky header with z-index but no shadow"

AI: "I'll use z-index tokens without shadow:
- Web: zIndex.navigation (200), no box-shadow
- iOS: zIndex.navigation (2), no shadow modifiers
- Android: Modifier.zIndex(200f) directly (elevation would add shadow)

[Generates platform-specific code]
```

**Example 3: Card with Shadow (Default Z-Order)**
```
Human: "Create a card with shadow"

AI: "I'll use shadow tokens:
- Web: shadow.container (z-index: auto)
- iOS: shadow.container (default zPosition)
- Android: elevation.container (8dp - implicit z-order)

[Generates platform-specific code]
```

**Example 4: Dropdown Menu**
```
Human: "Create a dropdown menu that appears above content"

AI: "I'll use dropdown layering tokens:
- Web: zIndex.dropdown (300) + shadow.dropdown
- iOS: zIndex.dropdown (3) + shadow.dropdown
- Android: elevation.dropdown (8dp)

[Generates platform-specific code]
```

---

## Platform-Specific Output

### Web (CSS Custom Properties)

```css
/* Generated CSS */
:root {
  --z-index-container: 100;
  --z-index-navigation: 200;
  --z-index-dropdown: 300;
  --z-index-modal: 400;
  --z-index-toast: 500;
  --z-index-tooltip: 600;
}

/* Usage with shadow tokens */
.modal {
  z-index: var(--z-index-modal);
  box-shadow: var(--shadow-modal);
}

.dropdown {
  z-index: var(--z-index-dropdown);
  box-shadow: var(--shadow-dropdown);
}

.sticky-header {
  z-index: var(--z-index-navigation);
  /* No shadow */
}
```

### iOS (Swift)

```swift
// Generated Swift
struct DesignTokens {
    // Layering
    static let zIndexContainer: CGFloat = 1
    static let zIndexNavigation: CGFloat = 2
    static let zIndexDropdown: CGFloat = 3
    static let zIndexModal: CGFloat = 4
    static let zIndexToast: CGFloat = 5
    static let zIndexTooltip: CGFloat = 6
}

// Usage with shadow tokens
Modal()
    .zIndex(DesignTokens.zIndexModal)
    .shadow(
        color: DesignTokens.shadowModalColor,
        radius: DesignTokens.shadowModalBlur,
        x: DesignTokens.shadowModalOffsetX,
        y: DesignTokens.shadowModalOffsetY
    )

// Usage without shadow
Header()
    .zIndex(DesignTokens.zIndexNavigation)
```

### Android (Kotlin)

```kotlin
// Generated Kotlin
object DesignTokens {
    // Layering
    val elevation_container = 8.dp
    val elevation_navigation = 4.dp
    val elevation_dropdown = 8.dp
    val elevation_modal = 16.dp
    val elevation_toast = 24.dp
    val elevation_tooltip = 24.dp
}

// Usage (elevation handles both z-order and shadow)
Modal(
    elevation = DesignTokens.elevation_modal
) {
    ModalContent()
}

// Edge case: z-order without shadow
Header(
    modifier = Modifier.zIndex(200f)  // Direct value
) {
    HeaderContent()
}
```

---

## Platform Naming Conventions

The build system applies platform-specific naming conventions:

| Platform | Convention | Example |
|----------|-----------|---------|
| **Web** | `kebab-case` with `--` prefix | `--z-index-modal` |
| **iOS** | `camelCase` | `zIndexModal` |
| **Android** | `snake_case` | `elevation_modal` |

---

## Token Hierarchy

### Layering Levels

Tokens are ordered from lowest to highest stacking order:

1. **container** (100 / 1 / 8dp) - Base layer for container components
2. **navigation** (200 / 2 / 4dp) - Persistent navigation elements
3. **dropdown** (300 / 3 / 8dp) - Temporary overlay content
4. **modal** (400 / 4 / 16dp) - Modal overlay content
5. **toast** (500 / 5 / 24dp) - Notification elements
6. **tooltip** (600 / 6 / 24dp) - Always-visible overlays

### Value Scale Rationale

**Web (100-based increments)**:
- Large gaps allow for future insertion of intermediate levels
- Common pattern across major design systems
- Clear visual separation between levels
- Arbitrary scale appropriate for ordinal values

**iOS (Small integers)**:
- Follows SwiftUI conventions (zIndex typically uses 1, 2, 3, etc.)
- Platform-native feel for iOS developers
- Semantic meaning preserved through consistent naming

**Android (Material Design scale)**:
- Follows Material Design elevation guidelines
- Standard scale used across Android Material components
- Values align with common Material elevation levels

---

## Best Practices

### Do's

✅ **Use semantic token names**: `zIndex.modal` instead of raw values
✅ **Combine z-index + shadow on web/iOS**: Separate concerns for flexibility
✅ **Use elevation tokens on Android**: Follows Material Design conventions
✅ **Maintain semantic consistency**: "modal" means the same layering level on all platforms
✅ **Document edge cases**: Explain when using platform features directly

### Don'ts

❌ **Don't use raw z-index values**: Use tokens for consistency
❌ **Don't use shadow tokens on Android**: Elevation handles both concerns
❌ **Don't mix token sets**: Use zIndex for web/iOS, elevation for Android
❌ **Don't create custom layering tokens**: Use existing semantic levels
❌ **Don't assume numeric equivalence**: 100 (web) ≠ 1 (iOS) ≠ 8dp (Android) in absolute terms

---

## Related Documentation

- [Shadow Tokens](./shadow-tokens.md) - Shadow token system that integrates with layering tokens
- [Glow Tokens](./glow-tokens.md) - Glow token system for visual effects
- [Token System Overview](../token-system-overview.md) - Complete token system architecture

---

*This documentation guide provides comprehensive guidance for using layering tokens across web, iOS, and Android platforms with platform-specific examples and AI agent generation rules.*
