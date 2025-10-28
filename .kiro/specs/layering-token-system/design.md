# Design Document: Layering Token System

**Date**: October 28, 2025
**Spec**: layering-token-system
**Status**: Design Phase
**Dependencies**: shadow-glow-token-system, semantic-token-generation, cross-platform-build-system

---

## Overview

This design document details the technical architecture for the Layering Token System, which provides platform-specific semantic tokens for controlling element stacking order across web, iOS, and Android platforms. The system introduces two token sets—Z-Index tokens for web/iOS and Elevation tokens for Android—that respect platform-native conventions while maintaining cross-platform semantic consistency.

The design acknowledges fundamental platform differences: web and iOS separate stacking order from visual depth, while Android Material Design couples these concerns through elevation. This approach enables AI agents to generate platform-appropriate code with clear, unambiguous generation rules.

---

## Architecture

### System Components

```
Layering Token System
├── Semantic Tokens (src/tokens/semantic/)
│   ├── ZIndexTokens.ts           (Web + iOS stacking order)
│   └── ElevationTokens.ts        (Android stacking + shadow)
│
├── Token Index (src/tokens/semantic/index.ts)
│   └── Exports all layering tokens
│
├── Cross-Platform Build System
│   ├── TokenFileGenerator.ts     (Orchestrates generation)
│   ├── WebFormatGenerator.ts     (CSS z-index output)
│   ├── iOSFormatGenerator.ts     (Swift zIndex output)
│   └── AndroidFormatGenerator.ts (Kotlin elevation output)
│
└── Shadow Token Integration
    └── ShadowTokens.ts            (Referenced by elevation tokens)
```

### Design Principles

1. **Platform-Native Terminology**: Token names match platform property names (z-index for web/iOS, elevation for Android)
2. **Semantic-Only Architecture**: No primitive layer (z-index values are ordinal, not mathematical)
3. **Separation of Concerns**: Web/iOS keep stacking and shadow independent; Android couples per Material Design
4. **AI-Friendly Generation**: Clear platform assignment enables unambiguous code generation
5. **Cross-Platform Consistency**: Semantic names consistent across platforms (modal, dropdown, etc.)
6. **Shadow Token Alignment**: Elevation tokens reference shadow tokens for cross-platform visual consistency

---
## Z-Index Tokens (Web + iOS)

### Token Structure

Z-Index tokens are semantic-only tokens that provide stacking order values for web and iOS platforms. They use direct numeric values without a primitive layer.

```typescript
/**
 * Z-Index Tokens (Web + iOS)
 * 
 * Semantic tokens for stacking order on web and iOS platforms.
 * Use independently with shadow tokens for visual depth.
 * 
 * Platform: Web, iOS
 * Android: Use elevation tokens instead
 */

import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

export const zIndexTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  'zIndex.container': {
    name: 'zIndex.container',
    value: 100,
    platforms: ['web', 'ios'],
    category: SemanticCategory.LAYERING,
    context: 'Container stacking order',
    description: 'Base z-index for container components (cards, panels, surfaces)'
  },
  
  'zIndex.navigation': {
    name: 'zIndex.navigation',
    value: 200,
    platforms: ['web', 'ios'],
    category: SemanticCategory.LAYERING,
    context: 'Navigation and sticky elements',
    description: 'Z-index for persistent navigation (headers, sidebars, sticky elements)'
  },
  
  'zIndex.dropdown': {
    name: 'zIndex.dropdown',
    value: 300,
    platforms: ['web', 'ios'],
    category: SemanticCategory.LAYERING,
    context: 'Dropdowns and popovers',
    description: 'Z-index for temporary overlay content (dropdowns, popovers, menus)'
  },
  
  'zIndex.modal': {
    name: 'zIndex.modal',
    value: 400,
    platforms: ['web', 'ios'],
    category: SemanticCategory.LAYERING,
    context: 'Modal dialogs',
    description: 'Z-index for modal overlay content (dialogs, sheets, overlays)'
  },
  
  'zIndex.toast': {
    name: 'zIndex.toast',
    value: 500,
    platforms: ['web', 'ios'],
    category: SemanticCategory.LAYERING,
    context: 'Toasts and notifications',
    description: 'Z-index for notification elements (toasts, snackbars, alerts)'
  },
  
  'zIndex.tooltip': {
    name: 'zIndex.tooltip',
    value: 600,
    platforms: ['web', 'ios'],
    category: SemanticCategory.LAYERING,
    context: 'Tooltips and critical overlays',
    description: 'Highest z-index for always-visible elements (tooltips, critical overlays)'
  }
};

// Helper functions
export function getZIndexToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined {
  return zIndexTokens[name];
}

export function getAllZIndexTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>> {
  return Object.values(zIndexTokens);
}

export const zIndexTokenNames = Object.keys(zIndexTokens);
```

### Value Scale Rationale

**100-based increments** (100, 200, 300, 400, 500, 600):
- Large gaps allow for future insertion of intermediate levels without refactoring
- Common pattern across major design systems (Polaris, Carbon, Atlassian)
- Clear visual separation between levels
- Arbitrary scale appropriate for ordinal values (not mathematical relationships)

---
## Elevation Tokens (Android)

### Token Structure

Elevation tokens are semantic-only tokens that provide Material Design elevation values for Android. They include shadowReference properties to document alignment with cross-platform shadow tokens.

```typescript
/**
 * Elevation Tokens (Android)
 * 
 * Semantic tokens for Material Design elevation on Android platform.
 * Elevation handles both stacking order and shadow rendering.
 * 
 * Platform: Android
 * Web/iOS: Use z-index + shadow tokens instead
 */

import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

export const elevationTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  'elevation.container': {
    name: 'elevation.container',
    value: 8,  // dp
    platforms: ['android'],
    category: SemanticCategory.LAYERING,
    shadowReference: 'shadow.container',
    context: 'Container elevation',
    description: 'Container elevation (handles z-order and shadow) - aligns with shadow.container'
  },
  
  'elevation.navigation': {
    name: 'elevation.navigation',
    value: 4,  // dp
    platforms: ['android'],
    category: SemanticCategory.LAYERING,
    shadowReference: 'shadow.navigation',
    context: 'Navigation elevation',
    description: 'Navigation elevation (handles z-order and shadow) - aligns with shadow.navigation'
  },
  
  'elevation.dropdown': {
    name: 'elevation.dropdown',
    value: 8,  // dp
    platforms: ['android'],
    category: SemanticCategory.LAYERING,
    shadowReference: 'shadow.dropdown',
    context: 'Dropdown elevation',
    description: 'Dropdown elevation (handles z-order and shadow) - aligns with shadow.dropdown'
  },
  
  'elevation.modal': {
    name: 'elevation.modal',
    value: 16,  // dp
    platforms: ['android'],
    category: SemanticCategory.LAYERING,
    shadowReference: 'shadow.modal',
    context: 'Modal elevation',
    description: 'Modal elevation (handles z-order and shadow) - aligns with shadow.modal'
  },
  
  'elevation.toast': {
    name: 'elevation.toast',
    value: 24,  // dp
    platforms: ['android'],
    category: SemanticCategory.LAYERING,
    shadowReference: 'shadow.toast',
    context: 'Toast elevation',
    description: 'Toast elevation (handles z-order and shadow) - aligns with shadow.toast'
  },
  
  'elevation.tooltip': {
    name: 'elevation.tooltip',
    value: 24,  // dp
    platforms: ['android'],
    category: SemanticCategory.LAYERING,
    shadowReference: 'shadow.tooltip',
    context: 'Tooltip elevation',
    description: 'Tooltip elevation (handles z-order and shadow) - aligns with shadow.tooltip'
  }
};

// Helper functions
export function getElevationToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined {
  return elevationTokens[name];
}

export function getAllElevationTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>> {
  return Object.values(elevationTokens);
}

export const elevationTokenNames = Object.keys(elevationTokens);
```

### Value Scale Rationale

**Material Design elevation scale** (4dp, 8dp, 16dp, 24dp):
- Follows Material Design guidelines for elevation values
- Standard scale used across Android Material components
- Values align with common Material elevation levels
- Higher values create more pronounced shadows and z-order separation

### Shadow Token Alignment

Each elevation token includes a `shadowReference` property that documents the corresponding shadow token:
- `elevation.container` → `shadow.container`
- `elevation.modal` → `shadow.modal`
- etc.

This ensures cross-platform visual consistency: the elevation value on Android produces similar visual depth to the shadow token on web/iOS.

---
## Cross-Platform Generation

### Platform-Specific Output

The TokenFileGenerator processes layering tokens and generates platform-appropriate output:

#### Web (CSS Custom Properties)

```css
/* Z-Index Tokens (Web) */
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
```

#### iOS (Swift)

```swift
// Z-Index Tokens (iOS)
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
```

**Note**: iOS z-index values are scaled down (1-6 instead of 100-600) because SwiftUI's zIndex() uses smaller values. The semantic meaning and relative ordering remain consistent.

#### Android (Kotlin)

```kotlin
// Elevation Tokens (Android)
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
)
```

### Platform Naming Conventions

The build system applies platform-specific naming conventions:

| Platform | Convention | Example |
|----------|-----------|---------|
| **Web** | `kebab-case` with `--` prefix | `--z-index-modal` |
| **iOS** | `camelCase` | `zIndexModal` |
| **Android** | `snake_case` | `elevation_modal` |

---
## AI Agent Generation Rules

### System Prompt for AI Agents

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

### AI Agent Conversation Examples

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

---
## Shadow Token Integration

### Android Shadow Token Requirements

For elevation tokens to work correctly, shadow tokens must include Android-specific elevation values. This requires updating the shadow token system:

```typescript
// src/tokens/semantic/ShadowTokens.ts (updated)
export const shadowTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  'shadow.container': {
    name: 'shadow.container',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.000',
      offsetY: 'shadowOffsetY.100',
      blur: 'shadowBlurModerate',
      opacity: 'shadowOpacityModerate',
      color: 'color.shadow.default'
    },
    platforms: {
      web: {
        // CSS box-shadow format
      },
      ios: {
        // SwiftUI shadow properties
      },
      android: {
        elevation: 8  // Material Design elevation (dp)
      }
    },
    category: SemanticCategory.SHADOW,
    context: 'Standard container shadow',
    description: 'Container shadow with noon lighting and moderate quality'
  },
  
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
      web: {
        // CSS box-shadow format
      },
      ios: {
        // SwiftUI shadow properties
      },
      android: {
        elevation: 16  // Material Design elevation (dp)
      }
    },
    category: SemanticCategory.SHADOW,
    context: 'Modal shadow',
    description: 'Modal shadow with noon lighting and depth 200'
  }
  
  // ... other shadow tokens with android.elevation values
};
```

### Elevation-Shadow Alignment

The relationship between elevation tokens and shadow tokens:

| Semantic Level | Z-Index (Web/iOS) | Elevation (Android) | Shadow Token | Visual Depth |
|----------------|-------------------|---------------------|--------------|--------------|
| container | 100 / 1 | 8dp | shadow.container | Low |
| navigation | 200 / 2 | 4dp | shadow.navigation | Minimal |
| dropdown | 300 / 3 | 8dp | shadow.dropdown | Low |
| modal | 400 / 4 | 16dp | shadow.modal | Medium |
| toast | 500 / 5 | 24dp | shadow.toast | High |
| tooltip | 600 / 6 | 24dp | shadow.tooltip | High |

**Design Decision**: Elevation values are derived from Material Design guidelines and aligned with shadow token visual depth, not mathematically derived from z-index values. This respects platform-specific scales while maintaining semantic consistency.

---
## Token System Integration

### File Organization

```
src/tokens/semantic/
├── ZIndexTokens.ts          (Web + iOS layering tokens)
├── ElevationTokens.ts       (Android layering tokens)
├── ShadowTokens.ts          (Updated with android.elevation values)
└── index.ts                 (Exports all semantic tokens)
```

### Semantic Token Index Integration

```typescript
// src/tokens/semantic/index.ts

// Layering tokens
export {
  zIndexTokens,
  getZIndexToken,
  getAllZIndexTokens,
  zIndexTokenNames
} from './ZIndexTokens';

export {
  elevationTokens,
  getElevationToken,
  getAllElevationTokens,
  elevationTokenNames
} from './ElevationTokens';

// Helper function to get all layering tokens
export function getAllLayeringTokens() {
  return {
    zIndex: getAllZIndexTokens(),
    elevation: getAllElevationTokens()
  };
}

// Helper function to get layering token by platform
export function getLayeringTokensByPlatform(platform: 'web' | 'ios' | 'android') {
  if (platform === 'android') {
    return getAllElevationTokens();
  }
  return getAllZIndexTokens();
}
```

### SemanticCategory Enum Update

```typescript
// src/types/SemanticToken.ts

export enum SemanticCategory {
  TYPOGRAPHY = 'typography',
  COLOR = 'color',
  SPACING = 'spacing',
  SHADOW = 'shadow',
  BORDER = 'border',
  LAYERING = 'layering'  // New category
}
```

### Validation Considerations

**Semantic-Only Validation**: Layering tokens are semantic-only and should NOT be validated for:
- ❌ Primitive token references (they don't have primitives)
- ❌ Mathematical relationships (values are ordinal, not mathematical)
- ❌ Baseline grid alignment (not applicable to z-index/elevation)

**Should Be Validated For**:
- ✅ Platform metadata presence (platforms array)
- ✅ Value type (numeric)
- ✅ Shadow reference existence (elevation tokens only)
- ✅ Semantic category correctness (LAYERING)
- ✅ Required metadata fields (name, value, category, context, description)

---
## Design Decisions

### Decision 1: Semantic-Only Architecture (No Primitives)

**Options Considered**:
1. Primitive→Semantic hierarchy (like spacing, fontSize)
2. Semantic-only tokens (direct values)
3. Unified elevation tokens (single token set for all platforms)

**Decision**: Semantic-only tokens with direct values

**Rationale**:

Z-index and elevation values are **ordinal** (ordering), not **mathematical** (relationships):
- No meaningful mathematical relationship between z-index 100 and 400
- "Modal" isn't "4× more elevated" than "container" in any mathematical sense
- Values establish ordering, not proportional relationships

Platform-specific scales don't align mathematically:
- Web uses arbitrary z-index scale (100, 200, 300, 400)
- Android uses Material Design elevation scale (4dp, 8dp, 16dp, 24dp)
- iOS uses small integer scale (1, 2, 3, 4)
- No mathematical foundation connects these scales

Component-driven semantics:
- Layering is about component stacking order (modal above dropdown)
- Semantic names (container, modal, tooltip) are more meaningful than mathematical progressions
- Developers think in terms of "modal z-index" not "z-index base × 4"

**Trade-offs**:
- ✅ **Gained**: Simpler token structure, no unnecessary primitive layer
- ✅ **Gained**: Platform-specific scales can differ appropriately
- ✅ **Gained**: Clear semantic naming without mathematical abstraction
- ❌ **Lost**: Consistency with other token categories (but appropriately so)
- ⚠️ **Risk**: Documented exception to typical primitive→semantic pattern

**Counter-Arguments**:
- **Argument**: "All other token categories have primitives - this breaks consistency"
- **Response**: Consistency for its own sake isn't valuable. Layering tokens are fundamentally different (ordinal vs mathematical). The Token Category Pattern Guide should document this as a valid exception case with clear rationale.

---

### Decision 2: Two Token Sets (Z-Index + Elevation)

**Options Considered**:
1. Single unified token set (force coupling on all platforms)
2. Two platform-specific token sets (z-index for web/iOS, elevation for Android)
3. Three token sets (separate for each platform)

**Decision**: Two platform-specific token sets

**Rationale**:

Respects platform-native terminology:
- Web and iOS use "z-index" as the actual property name
- Android uses "elevation" as the actual property name
- Token names matching platform properties reduces cognitive load

Acknowledges platform differences honestly:
- Web/iOS separate stacking order from visual depth
- Android couples these concerns per Material Design
- Hiding this difference creates confusion, not clarity

Enables platform-appropriate flexibility:
- Web/iOS can use z-index without shadow (sticky headers)
- Web/iOS can use shadow without z-index (cards)
- Android uses elevation for both (Material convention)
- No forced coupling where it doesn't exist

AI-friendly generation rules:
- Clear platform assignment (web/iOS use zIndex, Android uses elevation)
- Token names match platform properties (reduces translation complexity)
- Generation rules are straightforward (check platform, use appropriate token set)

**Trade-offs**:
- ✅ **Gained**: Platform-native terminology and conventions
- ✅ **Gained**: Flexibility where platforms support it (web/iOS)
- ✅ **Gained**: Clear AI generation rules
- ❌ **Lost**: Single unified token set (but forced coupling would be worse)
- ⚠️ **Risk**: Two token sets to maintain (but clear separation reduces confusion)

**Counter-Arguments**:
- **Argument**: "Two token sets is more complex than one unified set"
- **Response**: The complexity reflects actual platform differences. A unified set would hide these differences and force artificial coupling on web/iOS. Honest complexity is better than hidden complexity.

---

### Decision 3: Shadow Token Integration via shadowReference

**Options Considered**:
1. Elevation tokens independent from shadow tokens
2. Elevation tokens derive values from shadow tokens programmatically
3. Elevation tokens reference shadow tokens via metadata property

**Decision**: Reference shadow tokens via shadowReference metadata property

**Rationale**:

Documents cross-platform alignment:
- Makes relationship between elevation and shadow tokens explicit
- Enables validation that referenced shadow tokens exist
- Provides traceability for cross-platform visual consistency

Maintains independence:
- Elevation values are not programmatically derived from shadow tokens
- Each token set can be updated independently
- Relationship is documented, not enforced

Supports future tooling:
- Build system can validate shadow references
- Documentation can auto-generate cross-platform alignment tables
- Linting can warn if elevation/shadow values drift apart

**Trade-offs**:
- ✅ **Gained**: Explicit documentation of cross-platform relationships
- ✅ **Gained**: Validation that shadow tokens exist
- ✅ **Gained**: Foundation for future tooling
- ❌ **Lost**: Automatic synchronization (but manual control is appropriate)
- ⚠️ **Risk**: Values can drift if not maintained (but documentation helps)

**Counter-Arguments**:
- **Argument**: "Why not derive elevation values from shadow tokens automatically?"
- **Response**: Elevation values follow Material Design scale (4dp, 8dp, 16dp), not mathematical derivation from shadow properties. The relationship is semantic (both represent "modal depth"), not mathematical. Manual alignment with documentation is more appropriate than forced derivation.

---
### Decision 4: iOS Z-Index Value Scaling

**Options Considered**:
1. Use same values as web (100, 200, 300, 400, 500, 600)
2. Scale down to smaller integers (1, 2, 3, 4, 5, 6)
3. Use fractional values (0.1, 0.2, 0.3, 0.4, 0.5, 0.6)

**Decision**: Scale down to smaller integers (1-6)

**Rationale**:

SwiftUI convention:
- SwiftUI's zIndex() typically uses small integer values
- Common pattern in SwiftUI code is zIndex(1), zIndex(2), etc.
- Large values (100, 200) are uncommon in SwiftUI

Semantic meaning preserved:
- Relative ordering remains consistent (modal > dropdown > container)
- Semantic names are the same (zIndex.modal)
- Only numeric values differ (platform-appropriate)

Platform-native feel:
- Generated Swift code looks natural and idiomatic
- Follows SwiftUI conventions and patterns
- Reduces cognitive load for iOS developers

**Trade-offs**:
- ✅ **Gained**: Platform-native iOS code
- ✅ **Gained**: SwiftUI conventions followed
- ✅ **Gained**: Semantic consistency maintained
- ❌ **Lost**: Numeric consistency with web (but semantic consistency more important)
- ⚠️ **Risk**: Developers might expect same values (but documentation clarifies)

**Counter-Arguments**:
- **Argument**: "Different numeric values across platforms is confusing"
- **Response**: Semantic names are consistent (zIndex.modal), which is what developers use. The numeric values are platform-specific implementation details. Following platform conventions is more important than numeric consistency.

---

### Decision 5: Android Edge Case Handling

**Options Considered**:
1. Provide elevation tokens for all scenarios (including z-order without shadow)
2. Document edge cases and recommend platform-specific overrides
3. Create separate Android z-index tokens for edge cases

**Decision**: Document edge cases and recommend platform-specific overrides

**Rationale**:

Edge cases are rare:
- Most Android components use elevation (handles both z-order and shadow)
- Z-order without shadow is uncommon in Material Design
- Creating tokens for rare cases adds unnecessary complexity

Platform-specific solutions appropriate:
- Compose provides `Modifier.zIndex()` for edge cases
- Using platform features directly is acceptable for rare scenarios
- Token system provides the 95% case, platform features handle the 5%

Honest about platform limitations:
- Material Design intentionally couples elevation and shadow
- Fighting this creates complexity without benefit
- Documentation explains why and provides alternatives

**Trade-offs**:
- ✅ **Gained**: Simpler token system (no edge case tokens)
- ✅ **Gained**: Honest about platform conventions
- ✅ **Gained**: Clear documentation of alternatives
- ❌ **Lost**: Token-based solution for all scenarios (but edge cases are rare)
- ⚠️ **Risk**: Developers might expect tokens for edge cases (but documentation clarifies)

**Counter-Arguments**:
- **Argument**: "We should provide tokens for all scenarios, including edge cases"
- **Response**: Creating tokens for rare edge cases adds complexity without proportional value. The token system should optimize for common cases (95%) and document alternatives for edge cases (5%). Platform-specific features are appropriate for platform-specific edge cases.

---

### Decision 6: Unified Entry Point via LayeringTokens.ts Index File

**Date Added**: October 28, 2025  
**Context**: After implementing Task 1 (ZIndexTokens), identified need for clearer conceptual unity between ZIndexTokens and ElevationTokens

**Options Considered**:
1. Keep separate files with no explicit connection
2. Merge into single file with namespaced exports
3. Create directory structure (src/tokens/semantic/layering/)
4. Create index file (LayeringTokens.ts) that re-exports both

**Decision**: Create LayeringTokens.ts index file with minimal cross-references in implementation files

**Rationale**:

**Conceptual Unity**: The Layering Token System is one conceptual category (SemanticCategory.LAYERING) with two platform-specific implementations. Without an explicit connection, developers and AI agents might treat zIndex and elevation as separate, unrelated token categories.

**AI Agent Clarity**: An AI agent landing in ZIndexTokens.ts needs to understand:
- This is part of a larger Layering Token System
- Android uses a different token set (ElevationTokens)
- The semantic levels are consistent across both sets

**Flexible Import Patterns**: Developers should be able to:
- Import directly from ZIndexTokens.ts or ElevationTokens.ts (platform-specific)
- Import from LayeringTokens.ts (unified access)
- Use platform-agnostic helpers (getLayeringTokensByPlatform)

**Minimal Cross-References**: Unlike typical "no cross-references in code" guidance, this is an architectural signposting exception:
- Cross-references are minimal (file names only, no paths)
- They establish relationship, not documentation navigation
- They help with platform routing decisions

**Trade-offs**:
- ✅ **Gained**: Clear conceptual unity and relationship between token sets
- ✅ **Gained**: Flexible import patterns for different use cases
- ✅ **Gained**: AI agent clarity about platform-specific implementations
- ✅ **Gained**: Single source of truth for Layering Token System documentation
- ❌ **Lost**: Absolute separation between implementation files
- ⚠️ **Risk**: Minimal maintenance burden from cross-references (mitigated by using file names only)

**Counter-Arguments**:
- **Argument**: "Cross-references in code violate the 'no cross-references in code' rule"
- **Response**: This is architectural signposting, not documentation navigation. The cross-references establish that these are two implementations of one conceptual category, which is critical for AI agent disambiguation and developer understanding. The rule exists to prevent verbose documentation links; minimal architectural signposting is a valid exception.

**Implementation Impact**:
- Created LayeringTokens.ts index file with re-exports and unified API
- Added minimal cross-reference to ZIndexTokens.ts header
- Will add minimal cross-reference to ElevationTokens.ts header (Task 2)
- Updated semantic token index to export from LayeringTokens.ts

**Why This Change Was Made**:
During Task 1 implementation review, identified that separate files (ZIndexTokens.ts, ElevationTokens.ts) could be misinterpreted as separate token categories rather than two implementations of the Layering Token System. The index file pattern establishes conceptual unity while maintaining implementation separation, providing both clarity and flexibility.

---

## Unified Token Access Pattern

### LayeringTokens.ts Index File

To establish conceptual unity while maintaining implementation separation, the Layering Token System provides a unified entry point through LayeringTokens.ts:

```typescript
/**
 * Layering Token System
 * 
 * Unified entry point for platform-specific layering tokens.
 * 
 * Platform-Specific Implementations:
 * - ZIndexTokens: Web and iOS stacking order (z-index)
 * - ElevationTokens: Android stacking order + shadow (elevation)
 */

// Re-export z-index tokens (web/iOS)
export {
  zIndexTokens,
  getZIndexToken,
  getAllZIndexTokens,
  zIndexTokenNames,
  type ZIndexToken
} from './ZIndexTokens.js';

// Re-export elevation tokens (Android)
export {
  elevationTokens,
  getElevationToken,
  getAllElevationTokens,
  elevationTokenNames,
  type ElevationToken
} from './ElevationTokens.js';

// Unified API
export function getAllLayeringTokens() {
  return {
    zIndex: getAllZIndexTokens(),
    elevation: getAllElevationTokens()
  };
}

export function getLayeringTokensByPlatform(platform: 'web' | 'ios' | 'android') {
  return platform === 'android' ? getAllElevationTokens() : getAllZIndexTokens();
}
```

### Cross-Reference Pattern in Implementation Files

Each implementation file includes a brief header cross-reference:

**ZIndexTokens.ts**:
```typescript
/**
 * Z-Index Tokens (Web + iOS)
 * Part of the Layering Token System
 * 
 * Platform: Web, iOS
 * Android: See ElevationTokens.ts for Android layering tokens
 * 
 * Related: ElevationTokens.ts implements the same semantic levels for Android
 */
```

**ElevationTokens.ts**:
```typescript
/**
 * Elevation Tokens (Android)
 * Part of the Layering Token System
 * 
 * Platform: Android
 * Web/iOS: See ZIndexTokens.ts for web/iOS layering tokens
 * 
 * Related: ZIndexTokens.ts implements the same semantic levels for web/iOS
 */
```

### Design Rationale

**Why This Pattern**:
- Establishes conceptual unity ("Layering Token System") while maintaining implementation separation
- Provides flexible import patterns (direct or unified)
- Minimal cross-references in implementation files (just file names, not paths)
- Index file serves as single source of truth for system documentation
- AI agents can understand relationship without verbose documentation in implementation files

**Import Flexibility**:
```typescript
// Direct import (platform-specific)
import { zIndexTokens } from './ZIndexTokens.js';

// Unified import (all tokens)
import { zIndexTokens, elevationTokens } from './LayeringTokens.js';

// Platform-agnostic helper
import { getLayeringTokensByPlatform } from './LayeringTokens.js';
```

---

## Integration Points

### Dependencies

**Shadow Token System** (`.kiro/specs/shadow-glow-token-system/`):
- Elevation tokens reference shadow tokens via shadowReference property
- Shadow tokens must include android.elevation values
- Cross-platform visual consistency maintained through shadow alignment

**Semantic Token Generation** (`.kiro/specs/semantic-token-generation/`):
- TokenFileGenerator processes layering tokens
- Platform formatters generate platform-specific output
- Naming conventions applied per platform

**Cross-Platform Build System** (`.kiro/specs/cross-platform-build-system/`):
- Build orchestration includes layering tokens
- Platform-specific generation for web, iOS, Android
- Validation of semantic-only tokens

### Dependents

**Component Libraries**:
- Components will consume layering tokens for stacking order
- Modal, Dropdown, Toast, Tooltip components use layering tokens
- Platform-specific implementations use appropriate token set

**AI Agent System**:
- AI agents use layering tokens for code generation
- Platform-specific generation rules in system prompts
- Clear decision tree for token selection

### Extension Points

**Future Layering Levels**:
- 100-based increments allow insertion of intermediate levels
- Example: zIndex.popover = 250 (between navigation and dropdown)
- No refactoring needed for existing tokens

**Platform-Specific Tokens**:
- Additional platforms can add their own token sets
- Example: React Native could use elevation tokens (similar to Android)
- Pattern established for platform-specific layering conventions

**Custom Elevation Values**:
- Android elevation values can be customized per Material Design theme
- Shadow token integration allows for theme-specific elevation
- Relationship documented via shadowReference property

---

## Change Log

### October 28, 2025 - Added Unified Entry Point Pattern

**Change**: Added LayeringTokens.ts index file and cross-references in implementation files

**Rationale**: After implementing Task 1 (ZIndexTokens), identified need for clearer conceptual unity between ZIndexTokens and ElevationTokens. Without explicit connection, these could be misinterpreted as separate token categories rather than two platform-specific implementations of the Layering Token System.

**Impact**:
- Added Decision 6: Unified Entry Point via LayeringTokens.ts Index File
- Added "Unified Token Access Pattern" section to design
- Added Task 3: Create LayeringTokens Unified Entry Point
- No changes to existing requirements (pattern already supported)
- No changes to Task 1 or Task 2 implementation (only additive changes)

**Files Affected**:
- design.md (this file) - Added design decision and pattern documentation
- tasks.md - Added Task 3 for LayeringTokens.ts creation
- Future: src/tokens/semantic/LayeringTokens.ts (new file)
- Future: src/tokens/semantic/ZIndexTokens.ts (header update)
- Future: src/tokens/semantic/ElevationTokens.ts (header update)

**Backward Compatibility**: Fully backward compatible. Existing imports from ZIndexTokens.ts and ElevationTokens.ts continue to work. LayeringTokens.ts provides additional import option.

---

*This design document provides the technical architecture for implementing the Layering Token System with platform-specific token sets that respect native conventions while maintaining cross-platform semantic consistency and AI-friendly generation rules.*
