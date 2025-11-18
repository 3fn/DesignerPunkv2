# Component Development Guide

**Date**: November 17, 2025
**Purpose**: Guide AI agents in building components with appropriate token usage and True Native Architecture
**Organization**: process-standard
**Scope**: cross-project

---
inclusion: conditional
trigger: component-development
---

## AI Agent Reading Priorities

**WHEN building components THEN read:**
1. ✅ **This guide** (decision framework and glossary)
2. ✅ **Semantic tokens**: Read `src/tokens/semantic/index.ts` for available tokens
3. ✅ **Component sizing guide**: `.kiro/specs/responsive-layout-system/component-sizing-token-guide.md`
4. ✅ **True Native Architecture**: `preserved-knowledge/true-native-architecture-concepts.md`

**WHEN creating semantic tokens THEN also read:**
5. ✅ **Primitive tokens**: Read `src/tokens/*.ts` for primitive token foundation
6. ✅ **Token architecture**: `preserved-knowledge/token-architecture-2-0-mathematics.md`

**SKIP primitive tokens when building components** - semantic tokens should cover your needs

---

## Token Selection Decision Framework

### Step 1: Check Semantic Tokens First

**ALWAYS start by reading semantic token files** to see what exists:
- `src/tokens/semantic/ColorTokens.ts` - Brand, status, text, surface colors
- `src/tokens/semantic/TypographyTokens.ts` - Body, heading, UI, specialized text
- `src/tokens/semantic/SpacingTokens.ts` - Layout and inset spacing
- `src/tokens/semantic/ShadowTokens.ts` - Elevation shadows
- `src/tokens/semantic/index.ts` - Complete semantic token exports

**Example**: Button needs text color
- ❌ DON'T: Use primitive `blue500`
- ✅ DO: Read `ColorTokens.ts`, find `color.primary`

### Step 2: Use Primitives Only When Unavoidable

**If no semantic token exists**, use primitives and document why:
- Read `src/tokens/*.ts` to find appropriate primitive
- Add comment explaining why semantic token doesn't exist
- Consider proposing semantic token elevation if pattern emerges

**Example**: Custom brand color not in semantic tokens
- ✅ OK: Use `purple300` with comment: `// TODO: Evaluate for semantic token elevation`

### Step 3: Create Component-Level Tokens for Variants

**If component needs multiple variants**, create component-level tokens:
- Reference: `.kiro/specs/responsive-layout-system/component-sizing-token-guide.md`
- Component tokens should reference semantic or primitive tokens
- Never use hard-coded values

**Example**: Button sizing variants
```typescript
// ButtonCTA/tokens.ts
export const buttonCTATokens = {
  small: {
    paddingX: 'space.inset.tight',
    paddingY: 'space.grouped.minimal',
    typography: 'typography.buttonSm'
  },
  medium: {
    paddingX: 'space.inset.normal',
    paddingY: 'space.inset.tight',
    typography: 'typography.buttonMd'
  },
  large: {
    paddingX: 'space.inset.comfortable',
    paddingY: 'space.inset.normal',
    typography: 'typography.buttonLg'
  }
};
```

### Step 4: Propose Semantic Token Elevation

**If 3+ components use same pattern**, propose semantic token elevation:
- Document the pattern in component completion notes
- Suggest semantic token name and structure
- Reference component-sizing-token-guide.md for elevation criteria

---

## System-Specific Terminology Glossary

### Component Naming

**Container (not Card)**
- **Use**: "Container" for generic content wrappers
- **Avoid**: "Card" (conflicts with payment/gaming domains)
- **Rationale**: Domain clarity - "Container" is unambiguous across contexts

**True Native Architecture**
- **Meaning**: Build-time platform separation (not runtime detection)
- **Implementation**: Separate files per platform (Button.web.tsx, Button.ios.swift, Button.android.kt)
- **Benefit**: No runtime overhead, platform-specific optimizations

**Semantic Tokens**
- **Meaning**: Tokens with contextual meaning (color.primary, typography.button)
- **Purpose**: Express design intent, not implementation details
- **Usage**: Always prefer semantic over primitive tokens in components

**Strategic Flexibility**
- **Meaning**: Mathematically-derived exceptions to 8px baseline grid
- **Tokens**: space075 (6px), space125 (10px), space250 (20px)
- **Usage**: Component-level spacing when baseline grid is too rigid
- **Validation**: Three-tier system (Pass/Warning/Error)

**Compositional Architecture**
- **Meaning**: Tokens compose primitives rather than including all properties
- **Example**: Typography tokens don't include color (color applied separately)
- **Benefit**: Same token works with different colors in different contexts

### Token Hierarchy

**Primitive Tokens**
- **Location**: `src/tokens/*.ts`
- **Examples**: `space100`, `fontSize100`, `blue500`
- **Usage**: Foundation for semantic tokens, rarely used directly in components

**Semantic Tokens**
- **Location**: `src/tokens/semantic/*.ts`
- **Examples**: `color.primary`, `typography.button`, `space.inset.normal`
- **Usage**: Primary token layer for component development

**Component-Level Tokens**
- **Location**: Within component directory (e.g., `ButtonCTA/tokens.ts`)
- **Examples**: Button sizing variants, state-specific colors
- **Usage**: When component needs variants not covered by semantic tokens

---

## Component Structure Pattern

### File Organization

```
src/components/
  core/                          # Core, reusable components
    [ComponentName]/
      README.md                  # Component documentation
      types.ts                   # Shared TypeScript interfaces
      tokens.ts                  # Component-level tokens (if needed)
      __tests__/                 # Cross-platform tests
      examples/                  # Usage examples
      platforms/                 # Platform-specific implementations
        web/
          [ComponentName].web.tsx
        ios/
          [ComponentName].ios.swift
        android/
          [ComponentName].android.kt
```

### Directory Purpose

- **README.md**: Component documentation, usage guidelines, token consumption
- **types.ts**: Shared TypeScript interfaces and types
- **tokens.ts**: Component-level token references (platform-agnostic)
- **__tests__/**: Component tests (unit, integration, accessibility)
- **examples/**: Usage examples demonstrating component variants
- **platforms/**: Platform-specific implementations following True Native Architecture

---

## Component Token Files

### Purpose of tokens.ts

The `tokens.ts` file at component root defines **which tokens** the component uses, not **how** they're implemented per platform.

**This file is platform-agnostic** - it references semantic or primitive token names that will be generated into platform-specific values by the build system.

**Example**:
```typescript
// ButtonCTA/tokens.ts
// Platform-agnostic token references
export const buttonCTATokens = {
  // Sizing - references semantic tokens
  paddingX: 'space.inset.normal',
  paddingY: 'space.inset.tight',
  minWidth: 'space400',
  
  // Colors - references semantic tokens
  background: 'color.primary',
  text: 'color.text.default',
  
  // Typography - references semantic token
  typography: 'typography.buttonMd',
  
  // Border - references primitive token
  borderRadius: 'radius100'
};
```

### Platform-Specific Token Usage

Each platform implementation uses **generated platform-specific tokens** from the build system:

**Web**: CSS custom properties
```typescript
// platforms/web/ButtonCTA.web.tsx
static styles = css`
  :host {
    padding: var(--space-inset-tight) var(--space-inset-normal);
    background: var(--color-primary);
    color: var(--color-text-default);
    font: var(--typography-button-md);
    border-radius: var(--radius-100);
  }
`;
```

**iOS**: Swift constants
```swift
// platforms/ios/ButtonCTA.ios.swift
Button(action: action) {
    Text(label)
        .font(typographyButtonMd)
        .foregroundColor(colorTextDefault)
}
.padding(.horizontal, spaceInsetNormal)
.padding(.vertical, spaceInsetTight)
.background(colorPrimary)
.cornerRadius(radius100)
```

**Android**: Kotlin constants
```kotlin
// platforms/android/ButtonCTA.android.kt
Button(
    onClick = onClick,
    modifier = modifier
        .padding(horizontal = spaceInsetNormal.dp, vertical = spaceInsetTight.dp)
) {
    Text(
        text = label,
        style = typographyButtonMd,
        color = colorTextDefault
    )
}
```

**Key Point**: The build system generates platform-specific token values (CSS custom properties, Swift constants, Kotlin constants) from the semantic token references in `tokens.ts`.

### Platform-Specific Nuances

Platform implementations handle platform-specific requirements that are **not** in the component tokens file:

**iOS Example**: Minimum touch target height (WCAG requirement)
```swift
.frame(minHeight: 44)  // iOS-specific accessibility requirement
```

**Android Example**: Material ripple effect
```kotlin
.clickable(
    indication = rememberRipple(),  // Android-specific interaction
    interactionSource = remember { MutableInteractionSource() }
)
```

**Web Example**: Focus visible styles
```css
:host(:focus-visible) {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

**These nuances are handled by platform implementations**, not defined in the component tokens file. The component tokens file only defines which design system tokens the component uses.

---

## Cross-Platform Token Consumption

### How Token Generation Works

**1. Component defines token references** (platform-agnostic):
```typescript
// tokens.ts
paddingX: 'space.inset.normal'
```

**2. Build system generates platform-specific values**:

**Web Output** (CSS):
```css
--space-inset-normal: 8px;
```

**iOS Output** (Swift):
```swift
let spaceInsetNormal: CGFloat = 8
```

**Android Output** (Kotlin):
```kotlin
val spaceInsetNormal = 8.dp
```

**3. Platform implementations use generated tokens**:

Each platform uses its native syntax to consume the generated token values. The mathematical relationships are preserved across all platforms - only the syntax differs.

### Token Reference Format

**In component tokens.ts**, use dot notation for semantic tokens:
```typescript
'space.inset.normal'      // Semantic spacing token
'color.primary'           // Semantic color token
'typography.buttonMd'     // Semantic typography token
```

**Or direct primitive token names**:
```typescript
'space100'                // Primitive spacing token
'blue500'                 // Primitive color token
'fontSize100'             // Primitive font size token
```

**Build system resolves these references** to platform-specific generated values.

---

## Common Component Patterns

### Button Components
- **Text**: `typography.buttonSm/Md/Lg`
- **Background**: `color.primary` (primary), `color.secondary` (secondary)
- **Padding**: `space.inset.normal` or `space.inset.comfortable`
- **Border radius**: `radius100` or `radius150`
- **Min width**: `space400` (128px minimum for accessibility)

### Input Components
- **Text**: `typography.input`
- **Label**: `typography.labelSm/Md/Lg`
- **Padding**: `space.inset.normal`
- **Border**: `border.default`, `color.border`
- **Sizing**: Follow component-sizing-token-guide.md

### Container Components
- **Background**: `color.surface`
- **Padding**: `space.inset.comfortable` or `space.inset.spacious`
- **Spacing**: `space.separated.normal` between containers
- **Shadow**: `shadow.dusk` or `shadow.sunrise`
- **Border radius**: `radius100` or `radius150`

---

## Anti-Patterns to Avoid

### ❌ Using Primitives When Semantics Exist
```typescript
// DON'T
background: blue500

// DO
background: color.primary
```

### ❌ Hard-Coded Values
```typescript
// DON'T
padding: 16px

// DO
padding: space.inset.normal
```

### ❌ Creating Semantic Tokens Prematurely
```typescript
// DON'T: Create semantic token for single component
export const buttonWidthMin = space400;

// DO: Use component-level tokens, elevate when pattern emerges (3+ components)
```

### ❌ Skipping Token Files
```typescript
// DON'T: Guess what tokens exist

// DO: Read semantic token files to discover available tokens
```

### ❌ Platform-Specific Values in tokens.ts
```typescript
// DON'T: Put platform-specific values in tokens.ts
export const buttonTokens = {
  paddingX: '8px',  // Platform-specific CSS value
  paddingY: 4       // Hard-coded number
};

// DO: Reference semantic or primitive tokens
export const buttonTokens = {
  paddingX: 'space.inset.normal',  // Token reference
  paddingY: 'space.inset.tight'    // Token reference
};
```

---

## Validation Checklist

Before implementing a component, verify:

- [ ] Read semantic token files to discover available tokens
- [ ] Used semantic tokens for all styling (color, typography, spacing)
- [ ] Created component-level tokens only when variants needed
- [ ] Component tokens reference semantic or primitive tokens (no hard-coded values)
- [ ] Component tokens.ts is platform-agnostic (token references, not values)
- [ ] Platform implementations use generated platform-specific tokens
- [ ] Platform implementations handle platform-specific nuances
- [ ] Followed True Native Architecture (separate files per platform)
- [ ] Used system-specific terminology (Container not Card)
- [ ] Documented any primitive token usage with rationale

---

*This guide provides minimal, sustainable guidance for AI agents building components while pointing to source files for detailed token information and maintaining True Native Architecture principles.*
