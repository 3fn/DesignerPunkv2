# Design Document: Container Component

**Date**: November 30, 2025  
**Spec**: 010-container-component  
**Status**: Design Phase  
**Dependencies**: None

---

## Overview

Container is a foundational primitive component that provides structural wrapping with individual styling capabilities. It serves as the building block for semantic components (such as Cards, Panels, Heros, etc.) by exposing granular styling props that map to design system tokens.

**Core Design Principles**:
- **Primitive Capability Provider**: Exposes individual styling capabilities, not preset variants
- **Token-First Architecture**: All styling references design system tokens
- **True Native Architecture**: Platform-specific implementations (web/iOS/Android)
- **Generated Type Safety**: Build-time type generation for flexible token acceptance
- **Compositional Design**: Semantic components compose Container with specific prop combinations

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Container Component                       │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Container Props Interface                  │ │
│  │  (padding, background, shadow, border, borderRadius,   │ │
│  │   opacity, layering, semantic, accessibilityLabel)     │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Platform-Specific Implementations            │ │
│  │                                                         │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │ │
│  │  │   Web    │  │   iOS    │  │     Android      │    │ │
│  │  │ (Shadow  │  │ (SwiftUI)│  │ (Jetpack Compose)│    │ │
│  │  │   DOM)   │  │          │  │                  │    │ │
│  │  └──────────┘  └──────────┘  └──────────────────┘    │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Design System Tokens                       │ │
│  │  (Generated platform-specific values)                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
Container (Primitive)
    ↓ (used by)
Card (Semantic Component)
Panel (Semantic Component)
Hero (Semantic Component)
```

---

## Components and Interfaces

### Container Props Interface

```typescript
/**
 * Container component props
 * Platform-agnostic interface for Container styling capabilities
 */
export interface ContainerProps {
  // Spacing
  padding?: PaddingValue;
  
  // Visual styling
  background?: ColorTokenName;  // Generated type
  shadow?: ShadowTokenName;     // Generated type
  border?: BorderValue;
  borderRadius?: BorderRadiusValue;
  opacity?: OpacityTokenName;   // Generated type
  
  // Layering
  layering?: LayeringValue;
  
  // Content
  children?: React.ReactNode | SwiftUIView | ComposableContent;
  
  // Accessibility
  accessibilityLabel?: string;
  
  // Web-specific
  semantic?: SemanticHTMLElement;
  
  // iOS-specific
  ignoresSafeArea?: boolean;
}

/**
 * Padding values (fixed set)
 */
export type PaddingValue = 
  | 'none'
  | '050'  // 4px
  | '100'  // 8px
  | '150'  // 12px
  | '200'  // 16px
  | '300'  // 24px
  | '400'; // 32px

/**
 * Border values (fixed set)
 */
export type BorderValue = 
  | 'none'
  | 'default'  // 1px
  | 'emphasis' // 2px
  | 'heavy';   // 4px

/**
 * Border radius values (fixed set)
 */
export type BorderRadiusValue = 
  | 'none'
  | 'tight'   // 4px
  | 'normal'  // 8px
  | 'loose';  // 16px

/**
 * Layering values (fixed set)
 */
export type LayeringValue = 
  | 'container'
  | 'navigation'
  | 'dropdown'
  | 'modal'
  | 'toast'
  | 'tooltip';

/**
 * Semantic HTML elements (web only)
 */
export type SemanticHTMLElement = 
  | 'div'
  | 'section'
  | 'article'
  | 'aside'
  | 'main'
  | 'fieldset';
```


### Generated Token Types

```typescript
/**
 * AUTO-GENERATED TYPE FILE
 * Generated from semantic token definitions
 * DO NOT EDIT MANUALLY - regenerate via build script
 */

/**
 * Color token names (generated from ColorTokens.ts)
 */
export type ColorTokenName = 
  | 'color.surface'
  | 'color.background'
  | 'color.canvas'
  | 'color.primary'
  | 'color.secondary'
  // ... additional color tokens

/**
 * Shadow token names (generated from ShadowTokens.ts)
 */
export type ShadowTokenName = 
  | 'shadow.container'
  | 'shadow.navigation'
  | 'shadow.dropdown'
  | 'shadow.modal'
  | 'shadow.sunrise'
  | 'shadow.noon'
  | 'shadow.dusk'
  // ... additional shadow tokens

/**
 * Opacity token names (generated from OpacityTokens.ts)
 */
export type OpacityTokenName = 
  | 'opacity.subtle'
  | 'opacity.medium'
  | 'opacity.heavy'
  | 'opacity.ghost';
  // ... additional opacity tokens
```

### Type Generation System

**Build Script**: `scripts/generate-token-types.ts`

```typescript
/**
 * Token type generation script
 * Reads semantic token files and generates TypeScript union types
 */
import * as fs from 'fs';
import * as path from 'path';

interface TokenFile {
  path: string;
  exportName: string;
  typeName: string;
}

const TOKEN_FILES: TokenFile[] = [
  {
    path: 'src/tokens/semantic/ColorTokens.ts',
    exportName: 'colorTokens',
    typeName: 'ColorTokenName'
  },
  {
    path: 'src/tokens/semantic/ShadowTokens.ts',
    exportName: 'shadowTokens',
    typeName: 'ShadowTokenName'
  },
  {
    path: 'src/tokens/semantic/OpacityTokens.ts',
    exportName: 'opacityTokens',
    typeName: 'OpacityTokenName'
  }
];

function generateTokenTypes(): void {
  // Read token files
  // Extract token names from exported objects
  // Generate TypeScript union types
  // Write to generated types file
}
```


---

## Data Models

### Token Reference Model

```typescript
/**
 * Token reference structure
 * Maps prop values to design system tokens
 */
export interface TokenReference {
  prop: string;
  value: string;
  tokenName: string;
  tokenValue: number | string;
  platform: 'web' | 'ios' | 'android';
}

/**
 * Example token reference
 */
const paddingReference: TokenReference = {
  prop: 'padding',
  value: '200',
  tokenName: 'space.inset.200',
  tokenValue: 16,  // px on web, pt on iOS, dp on Android
  platform: 'web'
};
```

### Platform-Specific Token Mapping

```typescript
/**
 * Platform-specific token mapping
 * Handles platform differences (e.g., z-index vs elevation)
 */
export interface PlatformTokenMap {
  web: Record<string, string>;
  ios: Record<string, string>;
  android: Record<string, string>;
}

/**
 * Layering token mapping
 * Maps unified layering prop to platform-specific tokens
 */
const layeringTokenMap: PlatformTokenMap = {
  web: {
    container: 'zIndex.container',
    navigation: 'zIndex.navigation',
    dropdown: 'zIndex.dropdown',
    modal: 'zIndex.modal',
    toast: 'zIndex.toast',
    tooltip: 'zIndex.tooltip'
  },
  ios: {
    container: 'zIndex.container',
    navigation: 'zIndex.navigation',
    dropdown: 'zIndex.dropdown',
    modal: 'zIndex.modal',
    toast: 'zIndex.toast',
    tooltip: 'zIndex.tooltip'
  },
  android: {
    container: 'elevation.container',
    navigation: 'elevation.navigation',
    dropdown: 'elevation.dropdown',
    modal: 'elevation.modal',
    toast: 'elevation.toast',
    tooltip: 'elevation.tooltip'
  }
};
```


---

## Platform-Specific Implementations

### Web Implementation (Web Components + Shadow DOM)

```typescript
/**
 * Container web component
 * Uses Shadow DOM for style encapsulation
 */
export class ContainerWeb extends HTMLElement {
  private shadowRoot: ShadowRoot;
  
  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    this.render();
  }
  
  private render() {
    const padding = this.getAttribute('padding') || 'none';
    const background = this.getAttribute('background') || 'none';
    const shadow = this.getAttribute('shadow') || 'none';
    const layering = this.getAttribute('layering');
    const semantic = this.getAttribute('semantic') || 'div';
    
    // Map props to CSS custom properties
    const styles = this.buildStyles({
      padding,
      background,
      shadow,
      layering
    });
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          ${styles}
        }
      </style>
      <${semantic}>
        <slot></slot>
      </${semantic}>
    `;
  }
  
  private buildStyles(props: Record<string, string>): string {
    const styles: string[] = [];
    
    if (props.padding !== 'none') {
      styles.push(`padding: var(--space-inset-${props.padding})`);
    }
    
    if (props.background !== 'none') {
      styles.push(`background: var(--${props.background})`);
    }
    
    if (props.shadow !== 'none') {
      styles.push(`box-shadow: var(--${props.shadow})`);
    }
    
    if (props.layering) {
      const zIndex = layeringTokenMap.web[props.layering];
      styles.push(`z-index: var(--${zIndex})`);
    }
    
    return styles.join('; ');
  }
}

customElements.define('dp-container', ContainerWeb);
```


### iOS Implementation (SwiftUI)

```swift
/**
 * Container SwiftUI view
 * Uses modifier chains for styling
 */
struct Container<Content: View>: View {
    let padding: PaddingValue
    let background: ColorTokenName?
    let shadow: ShadowTokenName?
    let layering: LayeringValue?
    let ignoresSafeArea: Bool
    let accessibilityLabel: String?
    let content: Content
    
    var body: some View {
        content
            .padding(paddingValue)
            .background(backgroundValue)
            .shadow(shadowValue)
            .zIndex(zIndexValue)
            .ignoresSafeArea(ignoresSafeArea)
            .accessibilityLabel(accessibilityLabel ?? "")
    }
    
    private var paddingValue: EdgeInsets {
        switch padding {
        case .none: return EdgeInsets()
        case .p050: return EdgeInsets(top: spaceInset050, leading: spaceInset050, bottom: spaceInset050, trailing: spaceInset050)
        case .p100: return EdgeInsets(top: spaceInset100, leading: spaceInset100, bottom: spaceInset100, trailing: spaceInset100)
        // ... additional padding values
        }
    }
    
    private var zIndexValue: Double {
        guard let layering = layering else { return 0 }
        let tokenName = layeringTokenMap.ios[layering]
        return getZIndexToken(tokenName).value
    }
}
```


### Android Implementation (Jetpack Compose)

```kotlin
/**
 * Container Composable
 * Uses Modifier chains for styling
 * Handles elevation (z-order + shadow) on Android
 */
@Composable
fun Container(
    padding: PaddingValue = PaddingValue.None,
    background: ColorTokenName? = null,
    shadow: ShadowTokenName? = null,
    layering: LayeringValue? = null,
    accessibilityLabel: String? = null,
    content: @Composable () -> Unit
) {
    // Android-specific: Check for conflicting layering + shadow props
    if (layering != null && shadow != null) {
        Log.w(
            "Container",
            "Both layering and shadow props provided on Android. " +
            "Android elevation handles both stacking and shadow. " +
            "Using layering prop, shadow prop ignored."
        )
    }
    
    val modifier = Modifier
        .padding(getPaddingValue(padding))
        .background(getBackgroundValue(background))
        .elevation(getElevationValue(layering, shadow))
        .semantics {
            accessibilityLabel?.let { contentDescription = it }
        }
    
    Box(modifier = modifier) {
        content()
    }
}

/**
 * Get elevation value for Android
 * Layering prop takes precedence over shadow prop
 */
private fun getElevationValue(
    layering: LayeringValue?,
    shadow: ShadowTokenName?
): Dp {
    return when {
        layering != null -> {
            val tokenName = layeringTokenMap.android[layering]
            getElevationToken(tokenName).value.dp
        }
        shadow != null -> {
            // Map shadow token to elevation value
            getShadowElevation(shadow).dp
        }
        else -> 0.dp
    }
}
```


---

## Error Handling

### TypeScript Compilation Errors

**Invalid Token Names**:
```typescript
// ❌ TypeScript error - 'opacity.invalid' not in OpacityTokenName
<Container opacity="opacity.invalid">

// ✅ Valid - 'opacity.subtle' is in generated OpacityTokenName type
<Container opacity="opacity.subtle">
```

**Invalid Fixed Values**:
```typescript
// ❌ TypeScript error - '500' not in PaddingValue
<Container padding="500">

// ✅ Valid - '400' is in PaddingValue type
<Container padding="400">
```

### Runtime Warnings

**Android Elevation Conflict**:
```kotlin
// Development warning logged to console
Container(
    layering = LayeringValue.Modal,
    shadow = ShadowTokenName.Sunrise  // Ignored with warning
) {
    // Content
}

// Console output:
// W/Container: Both layering and shadow props provided on Android.
//              Android elevation handles both stacking and shadow.
//              Using layering prop, shadow prop ignored.
```

### Token Resolution Errors

**Missing Token Reference**:
```typescript
// If token doesn't exist in generated types, TypeScript catches at compile-time
// If token exists in types but not in token system, runtime error with helpful message

function resolveToken(tokenName: string): TokenValue {
    const token = getToken(tokenName);
    if (!token) {
        throw new Error(
            `Token '${tokenName}' not found in token system. ` +
            `Available tokens: ${getAvailableTokenNames().join(', ')}`
        );
    }
    return token.value;
}
```


---

## Testing Strategy

### Unit Testing

**Component Rendering Tests**:
- Test Container renders with no props (unstyled container)
- Test Container renders with single prop (padding only)
- Test Container renders with multiple props (padding + background + shadow)
- Test Container renders children correctly
- Test web semantic HTML element selection

**Token Reference Tests**:
- Test padding values map to correct inset tokens
- Test background values map to correct color tokens
- Test shadow values map to correct shadow tokens
- Test layering values map to platform-specific tokens (z-index vs elevation)

**Platform-Specific Tests**:
- Test web Shadow DOM rendering
- Test iOS SwiftUI modifier chains
- Test Android Jetpack Compose modifiers
- Test Android elevation warning when both layering and shadow provided

### Integration Testing

**Semantic Component Integration**:
- Test Card component uses Container correctly
- Test Panel component uses Container correctly
- Test Hero component uses Container correctly
- Test semantic components don't duplicate Container logic

**Cross-Platform Consistency**:
- Test visual equivalence across platforms
- Test token values generate correctly per platform
- Test layering behavior (z-index on web/iOS, elevation on Android)

### Type Generation Testing

**Build-Time Type Generation**:
- Test type generation script reads token files correctly
- Test generated types include all token names
- Test generated types update when tokens added/removed
- Test TypeScript compilation catches invalid token names


---

## Design Decisions

### Decision 1: Generated Types vs Manual Types

**Options Considered**:
1. Manual TypeScript types (update types manually when tokens change)
2. Generated TypeScript types (build script generates types from token files)
3. String types with runtime validation (no compile-time safety)

**Decision**: Generated TypeScript types

**Rationale**:
- **Flexibility**: New semantic tokens automatically become valid Container prop values without Container code changes
- **Type Safety**: TypeScript catches typos and invalid token names at compile-time, meeting requirement for "SHALL produce TypeScript compilation errors"
- **Maintainability**: No manual type updates needed when token system evolves
- **AI-Friendly**: Generated type files provide clear vocabulary for AI agents to discover valid token names
- **Standard Pattern**: Used by major design systems (Material UI, Chakra UI) for token type safety

**Trade-offs**:
- ✅ **Gained**: Automatic type updates, compile-time safety, flexibility for token evolution
- ❌ **Lost**: Slightly more complex build process (one-time setup cost)
- ⚠️ **Risk**: Build script must be maintained, but this is standard practice

**Counter-Arguments**:
- **Argument**: Manual types are simpler and don't require build scripts
- **Response**: Manual types create maintenance burden and risk of types becoming stale. The one-time build script setup cost is justified by long-term maintainability and automatic updates.

---

### Decision 2: Unified Layering Prop vs Separate Z-Index/Elevation Props

**Options Considered**:
1. Separate props: `zIndex` for web/iOS, `elevation` for Android
2. Unified prop: `layering` that maps to platform-specific tokens
3. Platform detection: Single prop with runtime platform detection

**Decision**: Unified `layering` prop

**Rationale**:
- **Developer Experience**: Single prop works across all platforms without platform-specific knowledge
- **Semantic Clarity**: "layering" describes intent (stacking order) rather than implementation (z-index vs elevation)
- **True Native Architecture**: Build-time platform separation handles mapping to platform-specific tokens
- **Consistency**: Aligns with design system principle of semantic token naming

**Trade-offs**:
- ✅ **Gained**: Simpler API, platform-agnostic usage, semantic naming
- ❌ **Lost**: Direct control over platform-specific layering mechanisms
- ⚠️ **Risk**: Developers might not understand Android elevation couples stacking + shadow

**Counter-Arguments**:
- **Argument**: Separate props give developers more control over platform-specific behavior
- **Response**: Container is a primitive that should abstract platform differences. Developers who need platform-specific control can use platform-specific implementations directly.


### Decision 3: Documentation vs Automatic Nested Border Radius

**Options Considered**:
1. Automatic calculation: Child Container automatically reduces borderRadius based on parent padding
2. Explicit "auto" value: Child Container uses `borderRadius="auto"` to opt into automatic calculation
3. Documentation guidance: Document the mathematical relationship, let developers handle manually
4. Component-level tokens: Semantic components define pre-calculated nested radius tokens

**Decision**: Documentation guidance

**Rationale**:
- **Simplicity**: Container stays focused on exposing capabilities, not implementing complex automatic behavior
- **Predictability**: No "magic" behavior that developers need to understand or debug
- **Flexibility**: Designers can make intentional decisions about nested radii based on specific design needs
- **Maintainability**: Less complex code = fewer edge cases = easier to maintain
- **Design Practice**: Good design practices (documented in guides) solve the problem without code complexity

**Trade-offs**:
- ✅ **Gained**: Simple, predictable Container implementation, design flexibility
- ❌ **Lost**: Automatic polish for nested containers (developers must calculate manually)
- ⚠️ **Risk**: Developers might create awkward nested containers if they don't follow guidance

**Counter-Arguments**:
- **Argument**: Automatic calculation would give developers polished nested containers without manual work
- **Response**: The implementation complexity (context/prop drilling, edge cases, surprising overrides) outweighs the benefit. Documentation + good design practices is more sustainable.

**Implementation**:
- Add "Nested Containers" section to Container README with mathematical formula (inner radius = outer radius - padding)
- Add visual examples showing correct and incorrect nested radius patterns
- Add anti-pattern examples to Component Development Guide
- Semantic components (Card, Panel) can encode correct nested radius patterns as design decisions

---

### Decision 4: Android Elevation Warning vs Error

**Options Considered**:
1. Development warning: Log warning when both `layering` and `shadow` props provided on Android
2. TypeScript error: Platform-specific types prevent using both props
3. Runtime error: Throw error when both props provided
4. Silent precedence: Layering wins, no warning

**Decision**: Development warning

**Rationale**:
- **Educational**: Warning teaches developers about Android's coupled elevation approach
- **Forgiving**: Code still works, doesn't break developer workflow
- **Visible**: Console warning is visible during development but doesn't block execution
- **Platform-Appropriate**: Respects Material Design's elevation = z-order + shadow coupling

**Trade-offs**:
- ✅ **Gained**: Developer education, forgiving behavior, visible feedback
- ❌ **Lost**: Strict enforcement (developers could ignore warning)
- ⚠️ **Risk**: Developers might not see or understand warning

**Counter-Arguments**:
- **Argument**: TypeScript error would catch the issue at compile-time
- **Response**: Platform-specific types add significant complexity (separate type definitions per platform). Development warning provides feedback without that complexity.


---

## Token Consumption Strategy

### Token Reference Pattern

Container uses a **token reference pattern** where prop values map to token names:

```typescript
// Prop value → Token name → Platform-specific value
padding="200" → "space.inset.200" → 16px (web) / 16pt (iOS) / 16dp (Android)
```

### Token Mapping Layers

**Layer 1: Prop Value to Token Name**
```typescript
const paddingTokenMap: Record<PaddingValue, string> = {
  'none': '',
  '050': 'space.inset.050',
  '100': 'space.inset.100',
  '150': 'space.inset.150',
  '200': 'space.inset.200',
  '300': 'space.inset.300',
  '400': 'space.inset.400'
};
```

**Layer 2: Token Name to Platform Value**
```typescript
// Web: CSS custom properties
const webTokens = {
  'space.inset.200': 'var(--space-inset-200)',  // → 16px
  'color.surface': 'var(--color-surface)',       // → #FFFFFF
  'shadow.modal': 'var(--shadow-modal)'          // → 0 8px 16px rgba(0,0,0,0.1)
};

// iOS: Swift constants
let spaceInset200: CGFloat = 16
let colorSurface: Color = Color(hex: "#FFFFFF")
let shadowModal: Shadow = Shadow(radius: 8, x: 0, y: 4)

// Android: Kotlin constants
val spaceInset200 = 16.dp
val colorSurface = Color(0xFFFFFFFF)
val elevationModal = 16.dp  // Handles both z-order and shadow
```

### Platform-Specific Token Handling

**Web**: CSS Custom Properties
- Generated during build from token files
- Applied via inline styles or Shadow DOM styles
- Example: `padding: var(--space-inset-200)`

**iOS**: Swift Constants
- Generated during build from token files
- Imported as Swift module
- Example: `padding(spaceInset200)`

**Android**: Kotlin Constants
- Generated during build from token files
- Imported as Kotlin module
- Example: `padding(spaceInset200.dp)`

### Layering Token Special Case

Layering tokens require platform-specific mapping:

```typescript
// Unified prop value
layering="modal"

// Platform-specific token mapping
web/iOS:  "zIndex.modal" → 400 (z-index value)
android:  "elevation.modal" → 16dp (elevation value, handles z-order + shadow)
```


---

## Documentation Structure

### Container README

**Location**: `src/components/core/Container/README.md`

**Required Sections**:
1. **Overview**: What Container is and its role as a primitive
2. **Related Documentation**: Cross-links to spec docs and related components
3. **Usage**: Code examples showing all capability props
4. **API Reference**: Props table with types and descriptions
5. **Token Consumption**: Which tokens Container uses
6. **Nested Containers**: Mathematical relationship and visual examples
7. **Accessibility**: WCAG compliance notes
8. **Platform-Specific Notes**: Web semantic HTML, iOS safe areas, Android elevation
9. **Validation**: Link to validation files with disclaimer

**Nested Containers Section**:
```markdown
## Nested Containers

When nesting Container components with borderRadius and padding, follow this mathematical relationship for visually harmonious results:

**Formula**: `inner borderRadius = outer borderRadius - padding`

### Example

```tsx
<Container borderRadius="normal" padding="100">  {/* 8px radius, 8px padding */}
  <Container borderRadius="none">  {/* 0px radius (8 - 8 = 0) */}
    Content
  </Container>
</Container>
```

### Visual Examples

[Include diagrams showing correct and incorrect nested radius patterns]

**Correct**: Inner radius = outer radius - padding
**Incorrect**: Inner radius = outer radius (creates awkward visual overlap)

### Why This Works

The padding creates visual space between containers. Reducing the inner radius by the padding amount maintains consistent visual curvature.
```

### Component Development Guide Updates

**Location**: `.kiro/steering/Component Development Guide.md`

**New Section**: Anti-Patterns

```markdown
### ❌ Using Same Border Radius for Nested Containers

```tsx
// DON'T: Same radius creates awkward visual overlap
<Container borderRadius="normal" padding="200">
  <Container borderRadius="normal">  {/* Same radius looks wrong */}
    Content
  </Container>
</Container>

// DO: Reduce inner radius by padding amount
<Container borderRadius="normal" padding="200">
  <Container borderRadius="none">  {/* 8px - 16px = 0px (or use tight) */}
    Content
  </Container>
</Container>
```
```


---

## Build System Integration

### Type Generation Build Step

**Package.json Scripts**:
```json
{
  "scripts": {
    "generate:types": "ts-node scripts/generate-token-types.ts",
    "prebuild": "npm run generate:types",
    "build": "tsc && npm run build:platforms",
    "build:platforms": "npm run build:web && npm run build:ios && npm run build:android"
  }
}
```

**Build Flow**:
```
1. generate:types (reads token files, generates TypeScript types)
   ↓
2. TypeScript compilation (uses generated types for Container props)
   ↓
3. Platform-specific builds (web/iOS/Android)
   ↓
4. Platform-specific token generation (CSS/Swift/Kotlin)
```

### Generated Files

**TypeScript Types**:
- `src/types/generated/TokenTypes.ts` (generated, not committed)
- Contains: `ColorTokenName`, `ShadowTokenName`, `OpacityTokenName`

**Platform Tokens**:
- `dist/web/tokens.css` (CSS custom properties)
- `dist/ios/DesignTokens.swift` (Swift constants)
- `dist/android/DesignTokens.kt` (Kotlin constants)

### CI/CD Integration

**Pre-commit Hook**:
```bash
#!/bin/bash
# Regenerate types before commit to ensure they're up to date
npm run generate:types
git add src/types/generated/TokenTypes.ts
```

**CI Pipeline**:
```yaml
steps:
  - name: Generate Token Types
    run: npm run generate:types
  
  - name: TypeScript Type Check
    run: npm run type-check
  
  - name: Build All Platforms
    run: npm run build
  
  - name: Run Tests
    run: npm test
```


---

## Semantic Component Integration

### Card Component Example

```typescript
/**
 * Card semantic component
 * Uses Container with specific prop combinations
 */
export interface CardProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  children: React.ReactNode;
}

export function Card({ variant = 'elevated', children }: CardProps) {
  // Card encodes design decisions as Container prop combinations
  const containerProps = {
    elevated: {
      padding: '200' as PaddingValue,
      background: 'color.surface' as ColorTokenName,
      shadow: 'shadow.container' as ShadowTokenName,
      borderRadius: 'normal' as BorderRadiusValue
    },
    outlined: {
      padding: '200' as PaddingValue,
      background: 'color.surface' as ColorTokenName,
      border: 'default' as BorderValue,
      borderRadius: 'normal' as BorderRadiusValue
    },
    filled: {
      padding: '200' as PaddingValue,
      background: 'color.surface' as ColorTokenName,
      borderRadius: 'normal' as BorderRadiusValue
    }
  };
  
  return (
    <Container {...containerProps[variant]}>
      {children}
    </Container>
  );
}
```

**Key Points**:
- Card doesn't duplicate Container's styling logic
- Card encodes design decisions (which tokens to use)
- Redesigning Card only requires changing Container prop combinations
- Container remains unchanged when Card design evolves

### Panel Component Example

```typescript
/**
 * Panel semantic component
 * Different design decisions than Card
 */
export function Panel({ children }: { children: React.ReactNode }) {
  return (
    <Container
      padding="300"
      background="color.background"
      border="emphasis"
      borderRadius="tight"
    >
      {children}
    </Container>
  );
}
```

### Hero Component Example

```typescript
/**
 * Hero semantic component
 * Uses larger spacing and different layering
 */
export function Hero({ children }: { children: React.ReactNode }) {
  return (
    <Container
      padding="400"
      background="color.primary"
      layering="container"
      borderRadius="none"
    >
      {children}
    </Container>
  );
}
```


---

## Performance Considerations

### Rendering Optimization

**Web (Shadow DOM)**:
- Shadow DOM provides style encapsulation without performance overhead
- CSS custom properties enable efficient token updates
- Minimal re-renders when props don't change

**iOS (SwiftUI)**:
- SwiftUI's declarative approach handles re-rendering efficiently
- Modifier chains are optimized by SwiftUI runtime
- Token constants are compile-time values (no runtime lookup)

**Android (Jetpack Compose)**:
- Compose recomposition is optimized for modifier changes
- Elevation calculations are handled by Material Design system
- Token constants are compile-time values (no runtime lookup)

### Token Resolution Performance

**Build-Time Generation**:
- Token types generated at build time (zero runtime cost)
- Platform-specific token values generated at build time
- No runtime token lookup or resolution needed

**Type Safety Performance**:
- TypeScript type checking happens at compile-time
- No runtime type validation overhead
- Invalid tokens caught before code runs

### Memory Footprint

**Minimal Memory Usage**:
- Container has no internal state (stateless component)
- Props are passed through to platform implementations
- Token values are constants (shared across all instances)
- No caching or memoization needed (props are simple values)


---

## Accessibility Implementation

### ARIA Labels (Web)

```typescript
// Web implementation
<Container accessibilityLabel="Product card">
  {/* Renders as */}
  <div aria-label="Product card">
    <slot></slot>
  </div>
</Container>
```

### Accessibility Modifiers (iOS)

```swift
// iOS implementation
Container(accessibilityLabel: "Product card") {
    // Content
}
.accessibilityLabel("Product card")
```

### Content Description (Android)

```kotlin
// Android implementation
Container(accessibilityLabel = "Product card") {
    // Content
}
// Applies: Modifier.semantics { contentDescription = "Product card" }
```

### Semantic HTML (Web Only)

```typescript
// Web semantic HTML support
<Container semantic="article" accessibilityLabel="Blog post">
  {/* Renders as */}
  <article aria-label="Blog post">
    <slot></slot>
  </article>
</Container>

<Container semantic="main">
  {/* Renders as */}
  <main>
    <slot></slot>
  </main>
</Container>
```

**Benefits**:
- Improved screen reader navigation
- Better document structure
- SEO benefits
- Accessibility tree clarity


---

## Migration and Versioning

### Initial Release (v1.0.0)

**Included Capabilities**:
- ✅ Padding (7 values: none, 050-400)
- ✅ Background (flexible via generated types)
- ✅ Shadow (flexible via generated types)
- ✅ Border (4 values: none, default, emphasis, heavy)
- ✅ Border Radius (4 values: none, tight, normal, loose)
- ✅ Opacity (flexible via generated types)
- ✅ Layering (6 values: container, navigation, dropdown, modal, toast, tooltip)
- ✅ Accessibility labels
- ✅ Web semantic HTML
- ✅ iOS safe area support
- ✅ Android elevation with warning

**Not Included in v1.0.0**:
- ❌ Gradient backgrounds (token system not yet designed)
- ❌ Advanced border controls (per-side borders, border colors)
- ❌ Transform properties (rotate, scale, translate)

### Future Enhancements (v2.0.0+)

**Potential Additions**:
- Gradient background support (requires gradient token system)
- Per-side padding control (paddingTop, paddingBottom, etc.)
- Per-side border control (borderTop, borderBottom, etc.)
- Border color customization (currently uses color.border)
- Transform properties (if design system adds transform tokens)

**Backward Compatibility**:
- New props are additive (existing props remain unchanged)
- Generated types update automatically when tokens added
- Semantic components continue working without changes

### Deprecation Strategy

**If Props Need to Change**:
1. Add new prop with improved API
2. Mark old prop as deprecated with TypeScript `@deprecated` tag
3. Support both props for one major version
4. Remove deprecated prop in next major version

**Example**:
```typescript
export interface ContainerProps {
  /**
   * @deprecated Use 'layering' prop instead
   */
  zIndex?: number;
  
  layering?: LayeringValue;
}
```


---

## Summary

Container is a foundational primitive component that provides individual styling capabilities through a compositional API. The design prioritizes:

1. **Simplicity**: Container exposes capabilities, semantic components encode design decisions
2. **Flexibility**: Generated types allow token system to evolve without Container changes
3. **Type Safety**: Build-time type generation provides compile-time error checking
4. **Platform Respect**: Unified API with platform-specific implementations (z-index vs elevation)
5. **Documentation**: Nested Container guidance via docs rather than automatic behavior
6. **Maintainability**: Token-first architecture with clear separation of concerns

The design supports the requirements while maintaining architectural principles of True Native Architecture, compositional design, and mathematical token consistency.

---

**Organization**: spec-guide  
**Scope**: 010-container-component

