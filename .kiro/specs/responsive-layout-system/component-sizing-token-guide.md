# Component-Level Sizing Token Guidance

**Date**: November 6, 2025
**Purpose**: Guide for when to use existing spacing tokens, create component-level tokens, or elevate to semantic tokens
**Organization**: spec-guide
**Scope**: responsive-layout-system

---

## Related Guides

- [Platform Component Sizing Guide](./platform-component-sizing-guide.md) - Platform-specific syntax for component sizing
- [Semantic Grid vs Spacing Guide](./semantic-grid-vs-spacing-guide.md) - When to use grid tokens vs spacing tokens
- [Design Document](./design.md) - Complete responsive layout system architecture

---

## Overview

This guide provides a decision framework for component sizing tokens, helping you determine when to use existing spacing tokens directly, when to create component-level tokens, and when to elevate component tokens to semantic tokens.

**Key Principle**: Start simple with existing tokens, create component-level tokens when needed, elevate to semantic tokens when patterns emerge.

---

## Three-Level Token Strategy

### Level 1: Use Existing Spacing Tokens Directly

**When to use**: Default approach for all component sizing

**Rationale**: Existing spacing tokens provide a comprehensive mathematical foundation that covers most component sizing needs. Starting with existing tokens ensures consistency and avoids premature abstraction.

**Example - Text Input Component**:

```typescript
// Web (Lit Web Component)
@customElement('text-input')
export class TextInput extends LitElement {
  static styles = css`
    :host {
      /* Use existing spacing tokens directly */
      min-width: var(--space-800);  /* 256px */
      max-width: var(--space-1200); /* 384px */
      width: 100%;
    }
  `;
}
```

```swift
// iOS (SwiftUI)
struct TextInput: View {
    var body: some View {
        TextField("Placeholder", text: $text)
            // Use existing spacing tokens directly
            .frame(minWidth: space800, maxWidth: space1200)
    }
}
```

```kotlin
// Android (Compose)
@Composable
fun TextInput(modifier: Modifier = Modifier) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier
            // Use existing spacing tokens directly
            .widthIn(min = space800.dp, max = space1200.dp)
    )
}
```

**Benefits**:
- ✅ Immediate consistency with design system
- ✅ No additional tokens to maintain
- ✅ Mathematical relationships preserved
- ✅ Simple and straightforward

**When this is sufficient**:
- Component has single sizing behavior
- Existing spacing tokens provide appropriate constraints
- No variants or specialized sizing needed
- Component is used in limited contexts

---

### Level 2: Create Component-Level Tokens

**When to use**: When a component needs multiple variants or specialized sizing

**Rationale**: Component-level tokens provide flexibility for component-specific needs without polluting the global semantic token namespace. They're scoped to the component and can be adjusted independently.

**Example - Text Input with Variants**:

```typescript
// Web - Component-level tokens
const textInputSizing = {
  standard: {
    minWidth: 'var(--space-800)',   // 256px
    maxWidth: 'var(--space-1200)',  // 384px
  },
  narrow: {
    minWidth: 'var(--space-600)',   // 192px
    maxWidth: 'var(--space-800)',   // 256px
  },
  wide: {
    minWidth: 'var(--space-1000)',  // 320px
    maxWidth: 'var(--space-1600)',  // 512px
  }
};

@customElement('text-input')
export class TextInput extends LitElement {
  @property({ type: String }) variant: 'standard' | 'narrow' | 'wide' = 'standard';
  
  static styles = css`
    :host {
      min-width: var(--text-input-min-width, var(--space-800));
      max-width: var(--text-input-max-width, var(--space-1200));
    }
    
    :host([variant="narrow"]) {
      --text-input-min-width: var(--space-600);
      --text-input-max-width: var(--space-800);
    }
    
    :host([variant="wide"]) {
      --text-input-min-width: var(--space-1000);
      --text-input-max-width: var(--space-1600);
    }
  `;
}
```

```swift
// iOS - Component-level tokens
enum TextInputSizing {
    static let standardMin: CGFloat = space800   // 256
    static let standardMax: CGFloat = space1200  // 384
    
    static let narrowMin: CGFloat = space600     // 192
    static let narrowMax: CGFloat = space800     // 256
    
    static let wideMin: CGFloat = space1000      // 320
    static let wideMax: CGFloat = space1600      // 512
}

struct TextInput: View {
    var variant: Variant = .standard
    
    enum Variant {
        case standard, narrow, wide
        
        var minWidth: CGFloat {
            switch self {
            case .standard: return TextInputSizing.standardMin
            case .narrow: return TextInputSizing.narrowMin
            case .wide: return TextInputSizing.wideMin
            }
        }
        
        var maxWidth: CGFloat {
            switch self {
            case .standard: return TextInputSizing.standardMax
            case .narrow: return TextInputSizing.narrowMax
            case .wide: return TextInputSizing.wideMax
            }
        }
    }
    
    var body: some View {
        TextField("Placeholder", text: $text)
            .frame(minWidth: variant.minWidth, maxWidth: variant.maxWidth)
    }
}
```

```kotlin
// Android - Component-level tokens
object TextInputSizing {
    val standardMin = space800  // 256
    val standardMax = space1200 // 384
    
    val narrowMin = space600    // 192
    val narrowMax = space800    // 256
    
    val wideMin = space1000     // 320
    val wideMax = space1600     // 512
}

enum class TextInputVariant {
    STANDARD, NARROW, WIDE;
    
    val minWidth: Int
        get() = when (this) {
            STANDARD -> TextInputSizing.standardMin
            NARROW -> TextInputSizing.narrowMin
            WIDE -> TextInputSizing.wideMin
        }
    
    val maxWidth: Int
        get() = when (this) {
            STANDARD -> TextInputSizing.standardMax
            NARROW -> TextInputSizing.narrowMax
            WIDE -> TextInputSizing.wideMax
        }
}

@Composable
fun TextInput(
    variant: TextInputVariant = TextInputVariant.STANDARD,
    modifier: Modifier = Modifier
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier
            .widthIn(min = variant.minWidth.dp, max = variant.maxWidth.dp)
    )
}
```

**Benefits**:
- ✅ Component-specific flexibility
- ✅ Variants clearly defined
- ✅ Still references existing spacing tokens
- ✅ Scoped to component (doesn't pollute global namespace)

**When to create component-level tokens**:
- Component needs multiple sizing variants (standard, narrow, wide)
- Specialized sizing requirements for specific component
- Component used in diverse contexts requiring different constraints
- Sizing logic is complex enough to warrant abstraction

**Important**: Component-level tokens should still reference existing spacing tokens (space800, space1200, etc.) to maintain mathematical consistency.

---

### Level 3: Elevate to Semantic Tokens

**When to use**: When a sizing pattern emerges across 3+ components

**Rationale**: Semantic tokens provide system-wide consistency for proven patterns. Elevating to semantic tokens ensures the pattern is reusable, documented, and maintained as part of the design system.

**Pattern Discovery Example**:

```
Observation: Multiple components use the same sizing variants
- TextInput: standard (space800-space1200), narrow (space600-space800), wide (space1000-space1600)
- Select: standard (space800-space1200), narrow (space600-space800), wide (space1000-space1600)
- DatePicker: standard (space800-space1200), narrow (space600-space800), wide (space1000-space1600)
- SearchInput: standard (space800-space1200), narrow (space600-space800), wide (space1000-space1600)

Pattern Identified: Input component sizing variants are consistent across 4+ components
Decision: Elevate to semantic tokens
```

**Semantic Token Definition**:

```typescript
// src/tokens/semantic/InputSizingTokens.ts
export const inputSizingTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  'inputWidthStandardMin': {
    name: 'inputWidthStandardMin',
    primitiveReferences: {
      spacing: 'space800' // 256px
    },
    category: SemanticCategory.SIZING,
    context: 'Minimum width for standard input components',
    description: 'Standard input minimum width for text inputs, selects, date pickers, and search inputs'
  },
  
  'inputWidthStandardMax': {
    name: 'inputWidthStandardMax',
    primitiveReferences: {
      spacing: 'space1200' // 384px
    },
    category: SemanticCategory.SIZING,
    context: 'Maximum width for standard input components',
    description: 'Standard input maximum width for text inputs, selects, date pickers, and search inputs'
  },
  
  'inputWidthNarrowMin': {
    name: 'inputWidthNarrowMin',
    primitiveReferences: {
      spacing: 'space600' // 192px
    },
    category: SemanticCategory.SIZING,
    context: 'Minimum width for narrow input components',
    description: 'Narrow input minimum width for compact contexts like phone numbers, zip codes'
  },
  
  'inputWidthNarrowMax': {
    name: 'inputWidthNarrowMax',
    primitiveReferences: {
      spacing: 'space800' // 256px
    },
    category: SemanticCategory.SIZING,
    context: 'Maximum width for narrow input components',
    description: 'Narrow input maximum width for compact contexts like phone numbers, zip codes'
  },
  
  'inputWidthWideMin': {
    name: 'inputWidthWideMin',
    primitiveReferences: {
      spacing: 'space1000' // 320px
    },
    category: SemanticCategory.SIZING,
    context: 'Minimum width for wide input components',
    description: 'Wide input minimum width for email addresses, URLs, and long text inputs'
  },
  
  'inputWidthWideMax': {
    name: 'inputWidthWideMax',
    primitiveReferences: {
      spacing: 'space1600' // 512px
    },
    category: SemanticCategory.SIZING,
    context: 'Maximum width for wide input components',
    description: 'Wide input maximum width for email addresses, URLs, and long text inputs'
  }
};
```

**Usage After Elevation**:

```typescript
// Web - Using semantic tokens
@customElement('text-input')
export class TextInput extends LitElement {
  @property({ type: String }) variant: 'standard' | 'narrow' | 'wide' = 'standard';
  
  static styles = css`
    :host {
      min-width: var(--input-width-standard-min);
      max-width: var(--input-width-standard-max);
    }
    
    :host([variant="narrow"]) {
      min-width: var(--input-width-narrow-min);
      max-width: var(--input-width-narrow-max);
    }
    
    :host([variant="wide"]) {
      min-width: var(--input-width-wide-min);
      max-width: var(--input-width-wide-max);
    }
  `;
}
```

```swift
// iOS - Using semantic tokens
struct TextInput: View {
    var variant: Variant = .standard
    
    enum Variant {
        case standard, narrow, wide
        
        var minWidth: CGFloat {
            switch self {
            case .standard: return inputWidthStandardMin
            case .narrow: return inputWidthNarrowMin
            case .wide: return inputWidthWideMin
            }
        }
        
        var maxWidth: CGFloat {
            switch self {
            case .standard: return inputWidthStandardMax
            case .narrow: return inputWidthNarrowMax
            case .wide: return inputWidthWideMax
            }
        }
    }
    
    var body: some View {
        TextField("Placeholder", text: $text)
            .frame(minWidth: variant.minWidth, maxWidth: variant.maxWidth)
    }
}
```

```kotlin
// Android - Using semantic tokens
enum class TextInputVariant {
    STANDARD, NARROW, WIDE;
    
    val minWidth: Int
        get() = when (this) {
            STANDARD -> inputWidthStandardMin
            NARROW -> inputWidthNarrowMin
            WIDE -> inputWidthWideMin
        }
    
    val maxWidth: Int
        get() = when (this) {
            STANDARD -> inputWidthStandardMax
            NARROW -> inputWidthNarrowMax
            WIDE -> inputWidthWideMax
        }
}
```

**Benefits**:
- ✅ System-wide consistency for proven patterns
- ✅ Centralized maintenance and updates
- ✅ Clear semantic meaning (inputWidthStandard vs space800)
- ✅ Documented pattern for future components
- ✅ Easier to update pattern across all components

**Elevation Criteria**:
- Pattern used in 3+ components
- Pattern is stable and unlikely to change per-component
- Pattern has clear semantic meaning
- Pattern benefits from centralized maintenance

---

## Decision Framework

### Step 1: Start with Existing Tokens

**Question**: Can I use existing spacing tokens directly?

```typescript
// Try this first
minWidth: space800
maxWidth: space1200
```

**If YES**: Use existing tokens directly (Level 1)
**If NO**: Proceed to Step 2

---

### Step 2: Evaluate Component-Level Tokens

**Question**: Does this component need variants or specialized sizing?

**Indicators**:
- Component has multiple sizing variants (standard, narrow, wide)
- Component has specialized sizing requirements
- Component is used in diverse contexts
- Sizing logic is complex

**If YES**: Create component-level tokens (Level 2)
**If NO**: Reconsider using existing tokens (Level 1)

---

### Step 3: Monitor for Pattern Emergence

**Question**: Is this sizing pattern used in 3+ components?

**Pattern Discovery Process**:
1. Implement component-level tokens for individual components
2. Monitor usage across components
3. Identify when same sizing pattern appears in 3+ components
4. Document the pattern and its semantic meaning
5. Elevate to semantic tokens (Level 3)

**If YES**: Elevate to semantic tokens (Level 3)
**If NO**: Keep as component-level tokens (Level 2)

---

## Common Patterns and Examples

### Pattern 1: Form Input Components

**Components**: TextInput, Select, DatePicker, SearchInput, EmailInput, PasswordInput

**Sizing Pattern**:
```
Standard: space800 (256px) - space1200 (384px)
Narrow: space600 (192px) - space800 (256px)
Wide: space1000 (320px) - space1600 (512px)
```

**Recommendation**: Elevate to semantic tokens (used in 6+ components)

**Semantic Tokens**:
- `inputWidthStandardMin`, `inputWidthStandardMax`
- `inputWidthNarrowMin`, `inputWidthNarrowMax`
- `inputWidthWideMin`, `inputWidthWideMax`

---

### Pattern 2: Card Components

**Components**: ProductCard, UserCard, ArticleCard

**Sizing Pattern**:
```
Minimum: space600 (192px)
Maximum: space1000 (320px)
Behavior: Grows to fill available space
```

**Recommendation**: Component-level tokens (pattern not yet proven across 3+ components)

**Component-Level Tokens**:
```typescript
const cardSizing = {
  minWidth: space600,
  maxWidth: space1000
};
```

**Future**: If pattern emerges in 3+ card types, elevate to:
- `cardWidthMin`, `cardWidthMax`

---

### Pattern 3: Button Components

**Components**: PrimaryButton, SecondaryButton, TertiaryButton

**Sizing Pattern**:
```
Minimum: space400 (128px)
Maximum: None (content-driven)
Padding: space200 (16px) horizontal, space150 (12px) vertical
```

**Recommendation**: Use existing tokens directly (simple pattern, no variants needed)

**Implementation**:
```typescript
// Use existing tokens directly
minWidth: space400
padding: space200 space150
```

---

### Pattern 4: Modal/Dialog Components

**Components**: ConfirmDialog, AlertDialog, FormDialog

**Sizing Pattern**:
```
Mobile: space800 (256px) - space1200 (384px)
Tablet: space1200 (384px) - space1600 (512px)
Desktop: space1600 (512px) - space2000 (640px)
```

**Recommendation**: Component-level tokens (responsive sizing specific to modals)

**Component-Level Tokens**:
```typescript
const dialogSizing = {
  mobile: { min: space800, max: space1200 },
  tablet: { min: space1200, max: space1600 },
  desktop: { min: space1600, max: space2000 }
};
```

**Future**: If pattern emerges across other overlay components (popovers, tooltips), consider elevation

---

## Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: Premature Semantic Token Creation

**Problem**: Creating semantic tokens before pattern is proven

```typescript
// DON'T: Create semantic tokens for single component
export const buttonWidthMin = space400;
export const buttonWidthMax = space800;
// Only used in one component - should be component-level or direct token usage
```

**Solution**: Start with existing tokens or component-level tokens, elevate only when pattern emerges

---

### ❌ Anti-Pattern 2: Arbitrary Pixel Values

**Problem**: Using arbitrary values instead of existing spacing tokens

```typescript
// DON'T: Use arbitrary pixel values
minWidth: '250px'  // Not aligned with spacing tokens
maxWidth: '390px'  // Breaks mathematical consistency
```

**Solution**: Always reference existing spacing tokens

```typescript
// DO: Use existing spacing tokens
minWidth: space800  // 256px - mathematically consistent
maxWidth: space1200 // 384px - mathematically consistent
```

---

### ❌ Anti-Pattern 3: Component-Level Tokens That Don't Reference Primitives

**Problem**: Component-level tokens with hard-coded values

```typescript
// DON'T: Hard-code values in component tokens
const textInputSizing = {
  standard: { min: 256, max: 384 },  // Hard-coded values
  narrow: { min: 192, max: 256 }
};
```

**Solution**: Component-level tokens should reference existing spacing tokens

```typescript
// DO: Reference existing spacing tokens
const textInputSizing = {
  standard: { min: space800, max: space1200 },  // References primitives
  narrow: { min: space600, max: space800 }
};
```

---

### ❌ Anti-Pattern 4: Semantic Tokens for Component-Specific Needs

**Problem**: Creating semantic tokens for needs specific to one component

```typescript
// DON'T: Create semantic tokens for component-specific needs
export const avatarSizeSmall = space300;   // Only used in Avatar component
export const avatarSizeMedium = space400;  // Not a system-wide pattern
export const avatarSizeLarge = space500;
```

**Solution**: Use component-level tokens for component-specific needs

```typescript
// DO: Use component-level tokens
const avatarSizing = {
  small: space300,
  medium: space400,
  large: space500
};
```

---

## Migration Path: Component-Level to Semantic

### Step 1: Identify Pattern

Monitor component-level token usage across components:

```typescript
// Component 1: TextInput
const textInputSizing = {
  standard: { min: space800, max: space1200 }
};

// Component 2: Select
const selectSizing = {
  standard: { min: space800, max: space1200 }
};

// Component 3: DatePicker
const datePickerSizing = {
  standard: { min: space800, max: space1200 }
};

// Pattern identified: Same sizing used in 3+ components
```

---

### Step 2: Create Semantic Token Definition

```typescript
// src/tokens/semantic/InputSizingTokens.ts
export const inputSizingTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  'inputWidthStandardMin': {
    name: 'inputWidthStandardMin',
    primitiveReferences: {
      spacing: 'space800'
    },
    category: SemanticCategory.SIZING,
    context: 'Minimum width for standard input components',
    description: 'Standard input minimum width for text inputs, selects, date pickers'
  },
  
  'inputWidthStandardMax': {
    name: 'inputWidthStandardMax',
    primitiveReferences: {
      spacing: 'space1200'
    },
    category: SemanticCategory.SIZING,
    context: 'Maximum width for standard input components',
    description: 'Standard input maximum width for text inputs, selects, date pickers'
  }
};
```

---

### Step 3: Update Components to Use Semantic Tokens

```typescript
// Before: Component-level tokens
const textInputSizing = {
  standard: { min: space800, max: space1200 }
};

// After: Semantic tokens
// Remove component-level tokens, use semantic tokens directly
minWidth: inputWidthStandardMin
maxWidth: inputWidthStandardMax
```

---

### Step 4: Document Pattern

Add pattern to documentation:

```markdown
## Input Component Sizing Pattern

**Pattern**: Standard input component sizing
**Used in**: TextInput, Select, DatePicker, SearchInput, EmailInput, PasswordInput
**Tokens**: inputWidthStandardMin, inputWidthStandardMax
**Values**: 256px - 384px (space800 - space1200)
```

---

## Validation Checklist

Before implementing component sizing, verify:

- [ ] Evaluated using existing spacing tokens directly (Level 1)
- [ ] Created component-level tokens only when variants needed (Level 2)
- [ ] Component-level tokens reference existing spacing tokens
- [ ] Monitored for pattern emergence across 3+ components
- [ ] Elevated to semantic tokens only when pattern proven (Level 3)
- [ ] Semantic tokens have clear semantic meaning and context
- [ ] Mathematical consistency maintained at all levels
- [ ] Documentation updated with pattern details

---

## Summary

**Three-Level Strategy**:

1. **Level 1: Use Existing Tokens** - Default approach, use spacing tokens directly
2. **Level 2: Component-Level Tokens** - When variants or specialized sizing needed
3. **Level 3: Semantic Tokens** - When pattern emerges across 3+ components

**Decision Framework**:

```
Start → Use existing tokens directly
  ↓ (if variants needed)
Create component-level tokens
  ↓ (if pattern emerges in 3+ components)
Elevate to semantic tokens
```

**Key Principles**:
- Start simple, add complexity only when needed
- Always reference existing spacing tokens
- Elevate to semantic tokens only when pattern is proven
- Maintain mathematical consistency at all levels

---

*This guide provides a systematic approach to component sizing tokens that balances simplicity, flexibility, and system-wide consistency while maintaining mathematical foundations.*
