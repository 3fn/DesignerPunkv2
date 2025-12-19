---
inclusion: manual
---

# Component Development and Practices Guide

**Date**: 2025-11-17
**Last Reviewed**: 2025-12-19
**Purpose**: Guide AI agents in building components with appropriate token usage, True Native Architecture, and effective collaboration practices
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: coding, accessibility-development, icon-integration

## AI Agent Reading Priorities

**Note**: This section intentionally uses the same heading as other steering documents because each document provides reading priorities specific to its content. This structural pattern enables progressive disclosure and helps AI agents navigate to relevant sections efficiently.

**Layer Context**: This is a Layer 3 (Specific Implementations) document that provides domain-specific guidance for component development. It's conditionally loaded when building or modifying components and contains detailed technical implementation patterns.

**WHEN building new components THEN read:**
1. ✅ **Token Selection Decision Framework** (Step 1-4)
2. ✅ **Semantic tokens**: Read `src/tokens/semantic/index.ts` for available tokens
3. ✅ **Component Structure Pattern** (file organization)
4. ✅ **True Native Architecture**: `preserved-knowledge/true-native-architecture-concepts.md`
5. ✅ **Icon System Integration** (if component uses icons)
6. ✅ **Validation Checklist** (before implementation)

**WHEN selecting tokens for components THEN read:**
1. ✅ **Token Selection Decision Framework** (all steps)
2. ✅ **System-Specific Terminology Glossary** (understand naming conventions)
3. ✅ **Common Component Patterns** (button, input, container patterns)
4. ✅ **Anti-Patterns to Avoid** (what NOT to do)

**WHEN creating component-level tokens THEN read:**
1. ✅ **Step 3: Create Component-Level Tokens for Variants**
2. ✅ **Component Token Files** section
3. ✅ **Component sizing guide**: `.kiro/specs/responsive-layout-system/component-sizing-token-guide.md`

**WHEN creating semantic tokens THEN read:**
1. ✅ **Step 4: Propose Semantic Token Elevation**
2. ✅ **Primitive tokens**: Read `src/tokens/*.ts` for primitive token foundation
3. ✅ **Token architecture**: `preserved-knowledge/token-architecture-2-0-mathematics.md`

**WHEN implementing cross-platform components THEN read:**
1. ✅ **Component Structure Pattern** (True Native Architecture)
2. ✅ **Component Token Files** (platform-agnostic token references)
3. ✅ **Cross-Platform Token Consumption** (how tokens work per platform)
4. ✅ **Icon System Integration** (if component uses icons)
5. ✅ **Platform-Specific Nuances** (iOS/Android/Web differences)

**WHEN adding icons to components THEN read:**
1. ✅ **Icon System Integration** (when to use Icon component vs. direct platform icons)
2. ✅ **Icon Size Tokens** (token-to-pixel mapping and typography pairing)
3. ✅ **Platform-Specific Icon Usage** (Web, iOS, Android patterns)
4. ✅ **Icon Integration Anti-Patterns** (what NOT to do)
5. ✅ **Icon Integration Checklist** (verification steps)

**WHEN troubleshooting component issues THEN read:**
1. ✅ **Anti-Patterns to Avoid** (common mistakes)
2. ✅ **Validation Checklist** (what to verify)
3. ✅ **WCAG Theme Architecture** (if accessibility issues)

**SKIP when:**
- Updating component documentation only
- Fixing typos or formatting
- Running tests without implementation changes
- Working on non-component code (tokens, build system, etc.)

---

## Collaboration Practices and FAQs

### When to Pause and Ask

AI agents should pause implementation and ask Peter for clarification when:

- **Token gaps:** "I need [semantic token] but it doesn't exist. Should I use [primitive token] as fallback, or should we create the semantic token first?"
- **Design ambiguity:** "Design doc specifies fixed heights but calculated sizing seems more appropriate. Which approach should I use?"
- **Platform idioms:** "Platform-native animation pattern conflicts with motion token usage. Should I prioritize platform UX or token compliance?"
- **Judgment calls:** "I'm about to make a judgment call about [decision]. Should I proceed or get clarification first?"

**Key Principle:** Pausing to ask is the correct behavior, not a failure. We lose more time correcting assumptive solutions than calling a timeout for clarity.

### Clear Policies

#### Icon Usage Policy

- **Always use the Icon component** when displaying icons
- **Never reference icon assets directly**
- **Rationale:** Ensures consistent sizing via icon.size tokens, proper accessibility attributes, platform-appropriate rendering, and centralized icon management

#### Sizing Strategy Policy

- **Default to calculated sizing** (padding + content) unless explicitly told otherwise
- **If design doc specifies fixed heights**, clarify whether calculated heights would work better
- **Document sizing strategy** in component design docs

#### Token Gap Policy

- **When semantic tokens don't exist**, pause and ask for guidance
- **Never assume primitive tokens are acceptable fallbacks**
- **Document token gaps** in design docs for tracking

#### Placeholder Policy

- **Never use placeholder implementations** in production code
- **Tooling will enforce this** through TypeScript types and tests
- **If placeholders are needed during development**, pause and ask for guidance

**For strategic guidance on cross-platform decisions**, see [Cross-Platform vs Platform-Specific Decision Framework](./Cross-Platform vs Platform-Specific Decision Framework.md)

**For strategic guidance on token resolution**, see [Token Resolution Patterns](./Token Resolution Patterns.md)

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

### What If Tokens Don't Exist?

**When you need a token that doesn't exist:**

1. **Pause and ask**: "I need [semantic token] for [use case]. Should I use [primitive token] as fallback, or should we create the semantic token first?"
2. **Document the gap**: Add to design doc's "Token Gaps" section
3. **Never assume**: Don't assume primitive tokens are acceptable fallbacks
4. **Wait for guidance**: Let Peter decide whether to create token or use alternative approach

**Why this matters**: Token gaps often indicate design system opportunities. Pausing to discuss prevents premature decisions and helps the design system evolve intentionally.

**For strategic guidance on token resolution**, see [Token Resolution Patterns](./Token Resolution Patterns.md)

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

### WCAG Theme Architecture

**Dual-Theme Support**

The DesignerPunk token system includes built-in dual-theme support for color tokens:
- **Base theme**: Prioritizes aesthetic design and brand expression
- **WCAG theme**: Ensures WCAG 2.1 AA accessibility compliance

**How It Works**

Each primitive color token has both `base` and `wcag` theme values:

```typescript
// Example from ColorTokens.ts
gray200: {
  platforms: {
    web: {
      value: {
        light: { base: '#68658A', wcag: '#8A879E' },
        dark: { base: '#68658A', wcag: '#8A879E' }
      }
    }
  }
}
```

**Theme Selection**

- **Base theme** (default): Used for aesthetic design where brand expression is prioritized
- **WCAG theme**: Used when accessibility compliance is required or when base theme fails contrast requirements

**Important Notes**

1. **Not Automatic**: The WCAG theme doesn't automatically solve accessibility issues - it's a tool that requires Human-AI collaboration to use effectively
2. **Component-Specific**: Accessibility testing must consider the specific context of each component and how elements pair together
3. **Contrast Testing**: Proper accessibility testing checks element pairings in context (e.g., text on background, border on background) with appropriate WCAG standards based on element criticality
4. **Design Feedback**: Accessibility decisions often require design feedback to balance aesthetic goals with accessibility requirements

**When to Consider WCAG Theme**

- When base theme colors fail WCAG contrast requirements
- When component needs to meet specific accessibility standards
- When design feedback indicates accessibility improvements are needed
- When building components for accessibility-critical contexts

**Accessibility Testing Philosophy**

Accessibility testing requires understanding:
- **Element Pairings**: Contrast happens between elements (text on background, border on surface)
- **Criticality Standards**: Different elements have different contrast requirements (4.5:1 for text, 3:1 for non-text)
- **Context Matters**: The same color may be accessible in one context but not another
- **Human-AI Collaboration**: Accessibility decisions require design judgment, not just automated testing

---

## Component Attribute Standards

### Variant Attribute Naming

**Standard**: Use `variant` attribute for component variations, not `style`

**Rationale**:
- **IDE Warnings**: The `style` attribute conflicts with the standard HTML `style` attribute, causing IDE warnings and potential confusion
- **Industry Standards**: Leading design systems use `variant` for component variations:
  - Material Design: `<Button variant="contained">`
  - Shoelace: `<sl-button variant="primary">`
  - Adobe Spectrum: `<sp-button variant="accent">`
- **Web Component Best Practices**: Custom elements should avoid attribute names that conflict with standard HTML attributes
- **Developer Experience**: Clear, unambiguous attribute names improve code readability and reduce errors

**Correct Usage**:
```html
<!-- ✅ CORRECT: Use variant attribute -->
<button-cta variant="primary" label="Submit"></button-cta>
<button-cta variant="secondary" label="Cancel"></button-cta>
<button-cta variant="danger" label="Delete"></button-cta>
```

**Anti-Pattern**:
```html
<!-- ❌ WRONG: Don't use style attribute for variants -->
<button-cta style="primary" label="Submit"></button-cta>
```

**Why This Matters**:
- IDEs will show warnings when `style` is used for non-CSS purposes
- Developers familiar with web standards expect `style` to contain CSS
- Using `variant` aligns with industry conventions and improves code clarity
- Future-proofs components against potential conflicts with HTML standards

**TypeScript Interface Pattern**:
```typescript
// Component props interface
export interface ButtonCTAProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';  // ✅ Use variant
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  disabled?: boolean;
}
```

**Web Component Implementation Pattern**:
```typescript
// Web component attribute reading
class ButtonCTA extends HTMLElement {
  connectedCallback() {
    const variant = this.getAttribute('variant') || 'primary';  // ✅ Read variant
    // Apply styling based on variant
  }
}
```

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

## What If Design Doc Is Unclear?

**When design documentation leaves questions unanswered:**

1. **Pause and ask**: "Design doc specifies [X] but [Y] seems more appropriate. Which approach should I use?"
2. **Provide context**: Explain why you're uncertain and what alternatives you're considering
3. **Don't assume**: Never make judgment calls on ambiguous design decisions
4. **Document the question**: Add to design doc as an open question if it affects other components

**Common ambiguities:**
- Fixed heights vs calculated sizing
- Platform-specific behavior vs cross-platform consistency
- Token usage when multiple tokens could apply
- Variant naming and organization

**Why this matters**: Design ambiguity often reveals opportunities to improve the design system. Pausing to clarify prevents rework and ensures components align with design intent.

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

### What If Platform Requirements Don't Fit in Token Files?

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

## Icon System Integration

### Overview

The Icon component provides a unified API for displaying vector icons across web, iOS, and Android platforms. This section documents when to use the Icon component system versus direct platform icons, and how to properly use icon size tokens.

### When to Use Icon Component

**Use the Icon component when**:
- Icon is part of component's public API (user can specify icon name)
- Icon needs to be swappable or configurable
- Icon should follow consistent sizing and coloring patterns
- Component is cross-platform and needs unified icon handling

**Example - ButtonCTA with Icon**:
```typescript
// Web component using Icon system
<button-cta icon="arrow-right" label="Next"></button-cta>

// Component internally uses Icon component
const iconElement = createIcon({ 
  name: this.getAttribute('icon'),
  size: iconSize100,  // Token-based sizing
  color: 'currentColor'
});
```

### When Direct Platform Icons Are Acceptable

**Direct platform icons are acceptable when**:
- Icon is internal implementation detail (not exposed to component API)
- Icon is platform-specific UI convention (iOS SF Symbols for system UI)
- Icon is tightly coupled to platform behavior

**However**: Even internal icons MUST use icon size tokens for sizing.

**Example - TextInputField Status Icons**:
```swift
// iOS: SF Symbols for status indicators (internal implementation)
// ✅ CORRECT: Use icon size token
Image(systemName: "exclamationmark.circle.fill")
    .font(.system(size: iconSize075))

// ❌ WRONG: Hard-coded size
Image(systemName: "exclamationmark.circle.fill")
    .font(.system(size: 16))
```

**When bypassing the Icon system**, document the rationale in the component README:
```markdown
## Icon Usage

This component uses direct SF Symbols for status indicators because:
- Icons are internal implementation details (not exposed to API)
- SF Symbols provide platform-native visual consistency
- Status icons follow iOS Human Interface Guidelines
```

### Icon Size Tokens

**All icon sizing MUST use icon size tokens**:

| Token | Pixels | Typography Pairing | Use Cases |
|-------|--------|-------------------|-----------|
| `iconSize050` | 12px | caption, legal, labelXs | Smallest text, fine print |
| `iconSize075` | 16px | bodySm, buttonSm, labelSm | Compact layouts, small UI |
| `iconSize100` | 24px | bodyMd, buttonMd, labelMd | Standard UI (default) |
| `iconSize125` | 32px | bodyLg, buttonLg, labelLg | Large UI elements |
| `iconSize150` | 40px | h2 | Large headings |

**Size Selection Guidelines**:
- **Default to `iconSize100` (24px)**: Use when in doubt
- **Match typography context**: Use icon size that pairs with the text typography
- **Consider visual hierarchy**: Larger icons create stronger visual presence

### Platform-Specific Icon Usage

#### Web Platform

**Using Icon Component**:
```html
<!-- Web component API (recommended) -->
<dp-icon name="arrow-right" size="24"></dp-icon>

<!-- With color override -->
<dp-icon name="check" size="24" color="color-success"></dp-icon>
```

**Using Icon Size Tokens in CSS**:
```css
.icon-container {
  width: var(--icon-size-100);   /* 24px */
  height: var(--icon-size-100);  /* 24px */
}

.small-icon {
  width: var(--icon-size-075);   /* 16px */
  height: var(--icon-size-075);  /* 16px */
}
```

**Using Icon Size Tokens in JavaScript**:
```typescript
import { createIcon } from '@/components/core/Icon/platforms/web/Icon.web';

// ✅ CORRECT: Use token reference
const icon = createIcon({ 
  name: 'check', 
  size: iconSize100  // Token-based sizing
});

// ❌ WRONG: Hard-coded size
const icon = createIcon({ 
  name: 'check', 
  size: 24  // Hard-coded value
});
```

#### iOS Platform (SwiftUI)

**Using Icon Component**:
```swift
// Icon component with token-based sizing
Icon(name: "arrow-right", size: iconSize100)

// With custom color
Icon(name: "check", size: iconSize100)
    .foregroundColor(colorSuccess)
```

**Using Direct SF Symbols with Tokens**:
```swift
// ✅ CORRECT: SF Symbol with icon size token
Image(systemName: "exclamationmark.circle.fill")
    .font(.system(size: iconSize075))

// ✅ CORRECT: SF Symbol with frame using token
Image(systemName: "checkmark.circle.fill")
    .frame(width: iconSize100, height: iconSize100)

// ❌ WRONG: Hard-coded size
Image(systemName: "exclamationmark.circle.fill")
    .font(.system(size: 16))
```

**When to Use SF Symbols Directly**:
- Status indicators (error, success, warning icons)
- System UI elements following iOS conventions
- Platform-specific accessibility features

#### Android Platform (Jetpack Compose)

**Using Icon Component**:
```kotlin
// Icon component with token-based sizing
Icon(name = "arrow_right", size = iconSize100)

// With custom color
Icon(
    name = "check",
    size = iconSize100,
    tint = colorSuccess
)
```

**Using Direct Material Icons with Tokens**:
```kotlin
// ✅ CORRECT: Material Icon with size token
Icon(
    imageVector = Icons.Default.CheckCircle,
    contentDescription = "Success",
    modifier = Modifier.size(iconSize100)
)

// ✅ CORRECT: Custom drawable with size token
Icon(
    painter = painterResource(id = R.drawable.ic_status),
    contentDescription = "Status",
    modifier = Modifier.size(iconSize075)
)

// ❌ WRONG: Hard-coded size
Icon(
    imageVector = Icons.Default.CheckCircle,
    contentDescription = "Success",
    modifier = Modifier.size(24.dp)
)
```

**When to Use Material Icons Directly**:
- Status indicators following Material Design guidelines
- System UI elements following Android conventions
- Platform-specific interaction patterns

### Icon Integration Anti-Patterns

#### ❌ Hard-Coded Icon Sizes
```swift
// DON'T: Hard-coded pixel values
Image(systemName: "icon-name")
    .font(.system(size: 16))

// DO: Use icon size tokens
Image(systemName: "icon-name")
    .font(.system(size: iconSize075))
```

#### ❌ Inconsistent Icon Usage Within Component
```typescript
// DON'T: Mix Icon component and direct assets inconsistently
class MyComponent {
  render() {
    // Some icons use Icon component
    const navIcon = createIcon({ name: 'arrow-right', size: iconSize100 });
    
    // Other icons use direct SVG (inconsistent)
    const statusIcon = '<svg width="16" height="16">...</svg>';
  }
}

// DO: Use consistent approach throughout component
class MyComponent {
  render() {
    // All icons use Icon component
    const navIcon = createIcon({ name: 'arrow-right', size: iconSize100 });
    const statusIcon = createIcon({ name: 'check', size: iconSize075 });
  }
}
```

#### ❌ Missing Documentation for Direct Platform Icons
```swift
// DON'T: Use direct platform icons without documentation
Image(systemName: "exclamationmark.circle.fill")
    .font(.system(size: iconSize075))

// DO: Document rationale in component README
// See "When Direct Platform Icons Are Acceptable" section above
```

### Icon Integration Checklist

Before implementing icons in a component, verify:

- [ ] Decided whether to use Icon component or direct platform icons
- [ ] Documented rationale if bypassing Icon component system
- [ ] All icon sizes use icon size tokens (no hard-coded values)
- [ ] Icon sizing matches typography context (see token pairing table)
- [ ] Consistent icon approach throughout the component
- [ ] Component README documents icon usage patterns

---

## What If Platform Idioms Conflict with Tokens?

**When platform-native patterns conflict with token usage:**

1. **Pause and ask**: "Platform-native [animation/interaction] conflicts with [token]. Should I prioritize platform UX or token compliance?"
2. **Explain the conflict**: Describe the platform idiom and why it conflicts with tokens
3. **Propose options**: Suggest alternatives (use tokens, use platform idiom, hybrid approach)
4. **Wait for guidance**: Let Peter decide based on design system goals

**Common conflicts:**
- Motion tokens vs platform-native animations (iOS springs, Android ripples)
- Sizing tokens vs platform accessibility requirements (44pt iOS touch targets)
- Color tokens vs platform-specific UI conventions (system colors, semantic colors)

**Decision framework**: See [Cross-Platform vs Platform-Specific Decision Framework](./Cross-Platform vs Platform-Specific Decision Framework.md) for strategic guidance on when to prioritize cross-platform consistency vs platform-appropriate UX.

**Why this matters**: Platform idioms often provide superior UX, but deviating from tokens affects design system consistency. These decisions require design judgment, not assumptions.

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
- **Background**: `color.primary` (primary), or use primitive colors directly for variants
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

**Note**: This section intentionally uses the same heading as other steering documents because each document addresses anti-patterns specific to its domain. Component Development and Practices Guide focuses on token usage anti-patterns, while other documents cover their respective domains.

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

### ❌ Using `style` Attribute for Variants
```html
<!-- DON'T: Use style attribute for component variants -->
<button-cta style="primary" label="Submit"></button-cta>

<!-- DO: Use variant attribute -->
<button-cta variant="primary" label="Submit"></button-cta>
```

```typescript
// DON'T: Use style property in TypeScript interfaces
export interface ButtonProps {
  style?: 'primary' | 'secondary';  // Conflicts with HTML style attribute
}

// DO: Use variant property
export interface ButtonProps {
  variant?: 'primary' | 'secondary';  // Clear, unambiguous
}
```

### ❌ Nested Containers with Same Border Radius

```html
<!-- DON'T: Same radius creates awkward visual overlap -->
<dp-container borderRadius="normal" padding="200">
  <dp-container borderRadius="normal">
    Awkward corner overlap
  </dp-container>
</dp-container>

<!-- DO: Reduce inner radius by padding amount -->
<dp-container borderRadius="normal" padding="200">
  <dp-container borderRadius="none">
    Harmonious corner alignment
  </dp-container>
</dp-container>
```

**Mathematical relationship**: `inner borderRadius = outer borderRadius - padding`

**Why this matters**: Padding creates visual space between containers. Reducing the inner radius maintains consistent visual curvature and prevents awkward overlapping corners.

**For detailed guidance**: See Container component README "Nested Containers" section for visual examples, token value reference table, platform-specific considerations, and common use cases.

### ❌ Hard-Coded Fallback Values

**Problem**: Using fallback values masks token system issues and prevents early detection of problems.

**Anti-Pattern Examples**:

```typescript
// DON'T: Silent fallback to hard-coded value
const duration = this.getAttribute('duration') || '250ms';
const spacing = tokenValue || 8;
const color = getToken('color.primary') ?? '#3B82F6';
```

**Why This is Wrong**:
- Masks missing tokens - component appears to work but token system is broken
- Prevents early detection - issues discovered in production instead of development
- Inconsistent behavior - some components use tokens, others use fallbacks
- Maintenance burden - fallback values can drift from token values

**Correct Approach**:

```typescript
// DO: Fail loudly when token is missing
const duration = this.getAttribute('duration');
if (!duration) {
  throw new Error('Component: duration attribute is required');
}

// Or for non-critical values
const spacing = tokenValue;
if (!spacing) {
  console.error('Component: spacing token missing, layout may be incorrect');
}
```

**When Fallback is Genuinely Optional**:

```typescript
// DO: Explicit optional handling with documentation
/**
 * Helper text (optional)
 * Provides additional context below the input
 */
const helperText = this.getAttribute('helper-text') || undefined;
if (helperText !== undefined) {
  // Render helper text
}
```

**Benefits of Failing Loudly**:
- ✅ Immediate detection of token system issues
- ✅ Clear error messages guide developers to fix
- ✅ Prevents silent failures in production
- ✅ Maintains token system integrity

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
- [ ] Used `variant` attribute for component variations (not `style`)
- [ ] Documented any primitive token usage with rationale

---

## Component Spec Development Workflow

Components come with their own unique properties that might include, but are not limited to, multiple variants, states, or platform considerations. Use this workflow to create clearer, more precise specifications to fully understand their complexity.

### Design Outline Before Requirements

**When to use**: All components benefit from upfront exploration to understand their extensibility to support planned use cases. Identifying aspects such as sizing variants, interaction states, token dependencies, platform-specific considerations, and more are critical to creating sustainable, appropiately scaled components.

**Purpose**: Explore component design space before committing to formal requirements. Captures decision-making process, token needs, and open questions in an informal document.

**What to include**:
- Component overview and variant specifications (tables work well)
- Token requirements (existing tokens used + new tokens needed)
- Design decisions with rationale and alternatives considered
- Open questions and checkpoints for resolution
- Observations and learnings for future reference

**What NOT to include**:
- Full EARS requirements (save for requirements.md)
- Implementation details (save for design.md)
- Task breakdowns (save for tasks.md)

**Key principle**: This is a thinking document, not a template to copy-paste. Use it to explore and document your design reasoning.

**Reference example**: `.kiro/specs/005-cta-button-component/design-outline.md` - Shows informal exploration of button sizing, token usage, and design decisions before creating formal spec.

### README-First Documentation

**Purpose**: Create living documentation that serves as both component guide and validation target. Documentation that can't drift from implementation.

**Required sections**:
- Overview (what it is, key features)
- Related Documentation (cross-links to spec docs, related components)
- Usage (code examples showing variants and states)
- API Reference (props table with types)
- Token Consumption (which tokens the component uses)
- Accessibility (WCAG compliance notes)
- Platform-Specific Notes (if applicable)
- Validation (link to validation files with disclaimer)

**Cross-reference pattern**:
- Link to spec documents (requirements.md, design.md)
- Link to related components (dependencies)
- Link to validation files with clear disclaimer

**Validation file disclaimer**: Always note that validation files are automated tests, not documentation source of truth.

**Reference example**: `src/components/core/ButtonCTA/README.md` - Shows comprehensive component documentation with cross-links and validation disclaimer.

### HTML Canary Validation

**Purpose**: Create living examples that validate component behavior and accuracy of the README documentation. Examples that must stay functional as component evolves.

**Required elements**:
- Warning comment at top: `<!-- VALIDATION FILE - NOT DOCUMENTATION -->`
- Purpose comment explaining what's being validated
- Actual component usage (not mock HTML)
- Can be run as automated tests via validation script
- Must remain functional (breaking changes break validation)

**Key principle**: These are executable tests that validate the component's implementation and documentation are actually working and in alignemnt.

**Validation script pattern**: Create `scripts/validate-examples.js` to check:
- Presence of component elements
- Required attributes
- Valid attribute values
- Proper HTML structure
- Warning comments present

**Reference examples**:
- `src/components/core/ButtonCTA/examples/BasicUsage.html` - Validates basic button functionality
- `src/components/core/ButtonCTA/examples/WithIcon.html` - Validates icon integration
- `src/components/core/ButtonCTA/examples/Variants.html` - Validates all size/style combinations
- `scripts/validate-examples.js` - Validation script that checks HTML examples

### Workflow Summary

1. **Design Outline** (required) - Explore design space informally
2. **Requirements** (required) - Formalize requirements using EARS format
3. **Design** (required) - Document architecture and token integration
4. **Tasks** (required) - Break down implementation steps
5. **README** (required) - Create comprehensive component documentation
6. **HTML Canaries** (required) - Create validation examples
7. **Implementation** (required) - Build component across platforms

This workflow produces clearer requirements, better documentation, and validation that ensures documentation stays accurate.

---

*This guide provides minimal, sustainable guidance for AI agents building components while pointing to source files for detailed token information and maintaining True Native Architecture principles.*
