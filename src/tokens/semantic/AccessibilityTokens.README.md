# Accessibility Tokens

**Date**: November 19, 2025  
**Purpose**: Documentation for accessibility-specific design tokens  
**WCAG Compliance**: Level AA (2.4.7 Focus Visible, 1.4.11 Non-text Contrast)

---

## Overview

The Accessibility Token Family provides semantic tokens for accessibility-specific design values that support WCAG compliance and inclusive design. These tokens serve users with specific accessibility needs (keyboard navigation, screen readers, motor impairments, visual impairments) rather than general usability features.

**Key Principles**:
- **Accessibility vs Usability**: Tokens serve specific accessibility needs, not general usability
- **WCAG Traceability**: Each token maps to specific WCAG success criteria
- **Compositional Architecture**: Tokens reference primitive/semantic tokens for values
- **AI-Friendly**: Clear semantic meaning enables AI agent reasoning
- **Cross-Platform**: Consistent values across web, iOS, and Android

---

## Token Structure

```typescript
accessibility = {
  focus: {
    offset: 'space025',      // 2px - outline offset from element
    width: 'borderWidth200', // 2px - outline thickness
    color: 'purple300'       // Primary color for outline
  }
}
```

---

## Focus Indicator Tokens

Focus indicators help keyboard navigation users see which element currently has focus. These tokens implement WCAG 2.4.7 Focus Visible (Level AA) requirements.

### accessibility.focus.offset

**Purpose**: Positions focus outline outside element bounds for clear separation

**Value**: `space025` → 2px  
**WCAG**: 2.4.7 Focus Visible (Level AA)  
**Usage**: Apply as outline-offset to create visual separation

**Why this matters**: Separating the focus indicator from the element boundary makes it easier to see, especially on elements with borders or backgrounds.

### accessibility.focus.width

**Purpose**: Defines focus outline thickness for visibility

**Value**: `borderWidth200` → 2px  
**WCAG**: 2.4.7 Focus Visible (Level AA)  
**Usage**: Apply as outline-width for visible indicator

**Why this matters**: A 2px outline provides sufficient visibility without being overly prominent. Thinner outlines (1px) may be difficult to see on some displays.

### accessibility.focus.color

**Purpose**: Provides focus outline color with sufficient contrast

**Value**: `purple300` (via color.primary)  
**WCAG**: 2.4.7 Focus Visible (Level AA), 1.4.11 Non-text Contrast (Level AA)  
**Contrast Requirement**: Minimum 3:1 against adjacent colors  
**Usage**: Apply as outline-color for visible indicator

**Why this matters**: Sufficient color contrast ensures focus indicators are visible against various backgrounds, supporting users with visual impairments.

---

## WCAG Mapping

### WCAG 2.4.7 Focus Visible (Level AA)

**Requirement**: Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible.

**How these tokens help**:
- `accessibility.focus.offset` - Creates clear separation from element
- `accessibility.focus.width` - Ensures indicator is thick enough to see
- `accessibility.focus.color` - Provides visible color indicator

**Success Criteria**: Focus indicators must be visible when an element receives keyboard focus.

### WCAG 1.4.11 Non-text Contrast (Level AA)

**Requirement**: Visual presentation of user interface components has a contrast ratio of at least 3:1 against adjacent colors.

**How these tokens help**:
- `accessibility.focus.color` - References color.primary which meets 3:1 contrast minimum

**Success Criteria**: Focus indicators must have at least 3:1 contrast ratio against adjacent colors.

---

## Compositional Architecture

Accessibility tokens follow compositional architecture by referencing existing primitive or semantic tokens:

| Accessibility Token | References | Resolved Value | Type |
|---------------------|------------|----------------|------|
| `accessibility.focus.offset` | `space025` | 2px | Primitive |
| `accessibility.focus.width` | `borderWidth200` | 2px | Primitive |
| `accessibility.focus.color` | `purple300` | #A78BFA | Primitive (via semantic) |

**Benefits**:
- Accessibility tokens stay consistent with mathematical token system
- Changes to primitive values automatically propagate to accessibility tokens
- No duplication of values across token categories
- Clear semantic meaning while maintaining flexibility

---

## Usage Examples

### Web (CSS)

```css
/* Basic focus indicator */
button:focus-visible {
  outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
  outline-offset: var(--accessibility-focus-offset);
}

/* Focus indicator with custom styling */
.interactive-element:focus-visible {
  outline-width: var(--accessibility-focus-width);
  outline-style: solid;
  outline-color: var(--accessibility-focus-color);
  outline-offset: var(--accessibility-focus-offset);
}

/* Focus indicator on dark background */
.dark-theme button:focus-visible {
  outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
  outline-offset: var(--accessibility-focus-offset);
  /* Color automatically provides sufficient contrast */
}
```

**Generated CSS Custom Properties**:
```css
--accessibility-focus-offset: 2px;
--accessibility-focus-width: 2px;
--accessibility-focus-color: var(--color-primary);
```

### iOS (SwiftUI)

```swift
// Basic focus indicator
Button(action: action) {
    Text(label)
}
.overlay(
    RoundedRectangle(cornerRadius: cornerRadius + accessibilityFocusOffset)
        .stroke(accessibilityFocusColor, lineWidth: accessibilityFocusWidth)
        .padding(-accessibilityFocusOffset)
        .opacity(isFocused ? 1 : 0)
)

// Focus indicator with custom shape
struct FocusableCard: View {
    @FocusState private var isFocused: Bool
    
    var body: some View {
        VStack {
            // Card content
        }
        .padding()
        .background(Color.white)
        .cornerRadius(8)
        .overlay(
            RoundedRectangle(cornerRadius: 8 + accessibilityFocusOffset)
                .stroke(accessibilityFocusColor, lineWidth: accessibilityFocusWidth)
                .padding(-accessibilityFocusOffset)
                .opacity(isFocused ? 1 : 0)
        )
        .focusable()
        .focused($isFocused)
    }
}
```

**Generated Swift Constants**:
```swift
let accessibilityFocusOffset: CGFloat = 2
let accessibilityFocusWidth: CGFloat = 2
let accessibilityFocusColor: Color = .primary
```

### Android (Jetpack Compose)

```kotlin
// Basic focus indicator
Button(
    onClick = onClick,
    modifier = modifier
        .onFocusChanged { focusState ->
            isFocused = focusState.isFocused
        }
        .border(
            width = if (isFocused) accessibilityFocusWidth else 0.dp,
            color = if (isFocused) accessibilityFocusColor else Color.Transparent,
            shape = RoundedCornerShape(cornerRadius + accessibilityFocusOffset)
        )
) {
    Text(text = label)
}

// Focus indicator with custom styling
@Composable
fun FocusableCard(
    content: @Composable () -> Unit,
    modifier: Modifier = Modifier
) {
    var isFocused by remember { mutableStateOf(false) }
    
    Card(
        modifier = modifier
            .onFocusChanged { focusState ->
                isFocused = focusState.isFocused
            }
            .border(
                width = if (isFocused) accessibilityFocusWidth else 0.dp,
                color = if (isFocused) accessibilityFocusColor else Color.Transparent,
                shape = RoundedCornerShape(8.dp + accessibilityFocusOffset)
            )
    ) {
        content()
    }
}
```

**Generated Kotlin Constants**:
```kotlin
val accessibilityFocusOffset = 2.dp
val accessibilityFocusWidth = 2.dp
val accessibilityFocusColor = colorPrimary
```

---

## Platform-Specific Implementation Notes

### Web

**Use `outline` property, not `border`**:
- `outline` doesn't affect layout (no reflow)
- `outline` can extend outside element bounds
- `outline-offset` provides precise control

**Use `:focus-visible` pseudo-class**:
- Only shows focus indicator for keyboard navigation
- Hides indicator for mouse/touch interactions
- Better user experience than `:focus`

**Example**:
```css
/* ✅ CORRECT - Uses outline with :focus-visible */
button:focus-visible {
  outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
  outline-offset: var(--accessibility-focus-offset);
}

/* ❌ WRONG - Uses border (affects layout) */
button:focus {
  border: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
}
```

### iOS

**Use overlay with stroke**:
- Overlay doesn't affect layout
- Stroke provides clean outline appearance
- Padding with negative offset creates separation

**Manage focus state**:
- Use `@FocusState` property wrapper
- Apply `.focusable()` modifier
- Control opacity based on focus state

**Example**:
```swift
// ✅ CORRECT - Uses overlay with focus state
.overlay(
    RoundedRectangle(cornerRadius: cornerRadius + accessibilityFocusOffset)
        .stroke(accessibilityFocusColor, lineWidth: accessibilityFocusWidth)
        .padding(-accessibilityFocusOffset)
        .opacity(isFocused ? 1 : 0)
)
.focusable()
.focused($isFocused)
```

### Android

**Use border with focus state**:
- Border provides outline appearance
- Conditional width based on focus state
- Shape with offset creates separation

**Manage focus state**:
- Use `onFocusChanged` modifier
- Track focus state with `remember`
- Apply border conditionally

**Example**:
```kotlin
// ✅ CORRECT - Uses border with focus state
.onFocusChanged { focusState ->
    isFocused = focusState.isFocused
}
.border(
    width = if (isFocused) accessibilityFocusWidth else 0.dp,
    color = if (isFocused) accessibilityFocusColor else Color.Transparent,
    shape = RoundedCornerShape(cornerRadius + accessibilityFocusOffset)
)
```

---

## Usability vs Accessibility Distinction

### Decision Framework

The accessibility token family is intentionally focused on tokens that serve **specific accessibility needs** rather than general usability improvements. This distinction is critical for maintaining a clear, discoverable token system.

**Core Question**: "Is this for usability (for everyone) or accessibility (usability for specific needs)?"

**Usability**: Features that benefit all users in general usage
**Accessibility**: Features that specifically serve users with disabilities or specific accessibility needs

### Usability Tokens (NOT in accessibility family)

These tokens benefit **all users** regardless of ability, so they belong in general semantic token categories:

#### Touch Target Minimum Size (44px)
- **Why it's usability**: Benefits all users on touch devices (phones, tablets)
- **Who it helps**: Everyone using touch interfaces
- **Where it belongs**: Component-level sizing tokens or layout tokens
- **Example**: `button.minHeight: space550` (44px minimum for all buttons)

#### Comfortable Spacing Between Elements
- **Why it's usability**: Makes interfaces easier to scan and navigate for everyone
- **Who it helps**: All users benefit from clear visual separation
- **Where it belongs**: Semantic spacing tokens (`space.separated.*`)
- **Example**: `space.separated.normal: space200` (16px between sections)

#### Clear Visual Hierarchy
- **Why it's usability**: Helps all users understand content structure and importance
- **Who it helps**: Everyone benefits from clear information architecture
- **Where it belongs**: Typography tokens (heading sizes, weights)
- **Example**: `typography.heading1` vs `typography.body` size contrast

#### Readable Font Sizes
- **Why it's usability**: Makes text comfortable to read for all users
- **Who it helps**: Everyone benefits from appropriately sized text
- **Where it belongs**: Typography tokens (`typography.body`, `typography.label`)
- **Example**: `typography.body: { fontSize: fontSize100 }` (16px base size)

#### Sufficient Color Contrast for Text
- **Why it's usability**: Makes text readable for all users in various lighting conditions
- **Who it helps**: Everyone benefits from legible text
- **Where it belongs**: Semantic color tokens (`color.text.default`)
- **Example**: `color.text.default` on `color.surface` (4.5:1 contrast minimum)

### Accessibility Tokens (IN accessibility family)

These tokens serve **users with specific accessibility needs**, so they belong in the accessibility token family:

#### Focus Indicators
- **Why it's accessibility**: Specifically serves keyboard navigation users
- **Who it helps**: Users who cannot use a mouse (motor impairments, blind users with screen readers)
- **Where it belongs**: `accessibility.focus.*`
- **Example**: `accessibility.focus.offset`, `accessibility.focus.width`, `accessibility.focus.color`
- **WCAG**: 2.4.7 Focus Visible (Level AA)

#### Reduced Motion Preferences
- **Why it's accessibility**: Specifically serves users with vestibular disorders
- **Who it helps**: Users who experience dizziness, nausea, or disorientation from motion
- **Where it belongs**: `accessibility.motion.*` (future)
- **Example**: `accessibility.motion.reducedDuration: 0` (no animation)
- **WCAG**: 2.3.3 Animation from Interactions (Level AAA)

#### High Contrast Modes
- **Why it's accessibility**: Specifically serves users with visual impairments
- **Who it helps**: Users with low vision who need enhanced contrast
- **Where it belongs**: `accessibility.contrast.*` (future)
- **Example**: `accessibility.contrast.textEnhanced: 7.0` (7:1 contrast ratio)
- **WCAG**: 1.4.6 Contrast (Enhanced) - Level AAA

#### Screen Reader Labels
- **Why it's accessibility**: Specifically serves blind users
- **Who it helps**: Users who rely on screen readers to navigate interfaces
- **Where it belongs**: Component-level ARIA attributes (not tokens)
- **Example**: `aria-label="Close dialog"` (descriptive label for icon button)
- **WCAG**: 4.1.2 Name, Role, Value (Level A)

#### Text Spacing Overrides
- **Why it's accessibility**: Specifically serves users who need increased spacing for readability
- **Who it helps**: Users with dyslexia or other reading disabilities
- **Where it belongs**: `accessibility.text.*` (future)
- **Example**: `accessibility.text.minimumLineHeight: 1.5` (increased line spacing)
- **WCAG**: 1.4.12 Text Spacing (Level AA)

### When to Use Accessibility Token Family

Use accessibility tokens when implementing features that:

1. **Map to specific WCAG success criteria** - The feature addresses a specific WCAG requirement
2. **Serve users with disabilities** - The feature specifically helps users with accessibility needs
3. **Are not universally beneficial** - The feature is primarily for accessibility, not general usability
4. **Require special implementation** - The feature needs platform-specific accessibility APIs

**Examples of correct usage**:
- ✅ Focus indicators → `accessibility.focus.*` (keyboard navigation users)
- ✅ Reduced motion → `accessibility.motion.*` (vestibular disorder users)
- ✅ High contrast → `accessibility.contrast.*` (low vision users)

**Examples of incorrect usage**:
- ❌ Touch targets → Use component sizing tokens (benefits all users)
- ❌ Readable fonts → Use typography tokens (benefits all users)
- ❌ Clear spacing → Use spacing tokens (benefits all users)

### Why This Distinction Matters

#### For Developers
- **Clear intent**: Accessibility tokens signal WCAG compliance requirements
- **Easy discovery**: All accessibility features in one namespace
- **Focused implementation**: Know when you're implementing accessibility vs general usability

#### For AI Agents
- **Unambiguous reasoning**: Clear distinction between usability and accessibility
- **Correct token selection**: AI can determine which token family to use
- **WCAG traceability**: AI can map tokens to specific WCAG requirements

#### For Design Systems
- **Maintainability**: Accessibility tokens remain focused and meaningful
- **Scalability**: Clear criteria for adding new tokens
- **Documentation**: Easy to document WCAG compliance

### Decision Examples

#### Example 1: Button Minimum Height

**Question**: Should button minimum height (44px) be an accessibility token?

**Analysis**:
- Benefits all users on touch devices (not just users with disabilities)
- Improves usability for everyone (not specific to accessibility needs)
- No specific WCAG criterion for touch target size (general usability guideline)

**Decision**: ❌ NOT an accessibility token
**Where it belongs**: Component-level sizing token (`button.minHeight: space550`)

#### Example 2: Focus Indicator Offset

**Question**: Should focus indicator offset be an accessibility token?

**Analysis**:
- Specifically serves keyboard navigation users (users who cannot use mouse)
- Maps to WCAG 2.4.7 Focus Visible (Level AA)
- Not universally beneficial (mouse users don't need focus indicators)

**Decision**: ✅ IS an accessibility token
**Where it belongs**: `accessibility.focus.offset`

#### Example 3: Comfortable Line Height

**Question**: Should comfortable line height (1.5) be an accessibility token?

**Analysis**:
- Benefits all users for readability (not specific to disabilities)
- Improves usability for everyone (not just accessibility)
- While WCAG 1.4.12 mentions line height, it's about user overrides, not default values

**Decision**: ❌ NOT an accessibility token
**Where it belongs**: Typography tokens (`typography.body.lineHeight`)

#### Example 4: Reduced Motion Duration

**Question**: Should reduced motion duration be an accessibility token?

**Analysis**:
- Specifically serves users with vestibular disorders
- Maps to WCAG 2.3.3 Animation from Interactions (Level AAA)
- Not universally beneficial (most users prefer motion)

**Decision**: ✅ IS an accessibility token
**Where it belongs**: `accessibility.motion.reducedDuration` (future)

### Summary

The accessibility token family is for **specific accessibility needs**, not general usability improvements. When in doubt, ask: "Does this specifically serve users with disabilities, or does it benefit everyone?" If it benefits everyone, it belongs in general semantic tokens. If it specifically serves accessibility needs, it belongs in the accessibility token family.

---

## Future Extensibility

The accessibility token family is designed to support future token categories while maintaining the same compositional architecture and WCAG traceability principles. This section documents the pattern for extending the accessibility family with new token categories.

### Extensibility Pattern

When adding new accessibility token categories, follow this pattern:

1. **Identify WCAG Success Criterion**: Map the new tokens to specific WCAG requirements
2. **Follow Compositional Architecture**: Reference existing primitive or semantic tokens
3. **Maintain Namespace Structure**: Use `accessibility.[category].[property]` format
4. **Document WCAG Traceability**: Include WCAG references in token documentation
5. **Provide Cross-Platform Examples**: Show usage for web, iOS, and Android

### Pattern Template

```typescript
// New accessibility token category template
accessibility.[category] = {
  [property1]: '[token-reference]',  // WCAG X.X.X [Criterion Name]
  [property2]: '[token-reference]',  // WCAG Y.Y.Y [Criterion Name]
  [property3]: '[token-reference]'   // WCAG Z.Z.Z [Criterion Name]
}
```

**Documentation Requirements**:
- Purpose statement explaining the category
- WCAG success criteria mapping
- Use case description
- Cross-platform implementation examples
- AI agent guidance for token usage

---

### Future Token Categories (Examples)

#### Motion Tokens

**Purpose**: Support users with vestibular disorders who need reduced or eliminated motion

**WCAG Mapping**: 2.3.3 Animation from Interactions (Level AAA)

**Token Structure**:
```typescript
accessibility.motion = {
  reducedDuration: 0,                    // No animation duration
  reducedEasing: 'linear',               // Simple linear easing
  standardDuration: 'duration.normal'    // Reference to animation duration token
}
```

**Use Case**: Implement `prefers-reduced-motion` media query support

**Cross-Platform Implementation**:

**Web**:
```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: var(--accessibility-motion-reduced-duration) !important;
    transition-duration: var(--accessibility-motion-reduced-duration) !important;
  }
}

/* Standard motion for users who don't prefer reduced motion */
@media (prefers-reduced-motion: no-preference) {
  .animated-element {
    animation-duration: var(--accessibility-motion-standard-duration);
    transition-duration: var(--accessibility-motion-standard-duration);
  }
}
```

**iOS**:
```swift
// Check for reduced motion preference
if UIAccessibility.isReduceMotionEnabled {
    withAnimation(.linear(duration: accessibilityMotionReducedDuration)) {
        // Minimal or no animation
    }
} else {
    withAnimation(.easeInOut(duration: accessibilityMotionStandardDuration)) {
        // Standard animation
    }
}
```

**Android**:
```kotlin
// Check for reduced motion preference
val duration = if (Settings.Global.getFloat(
    context.contentResolver,
    Settings.Global.ANIMATOR_DURATION_SCALE,
    1f
) == 0f) {
    accessibilityMotionReducedDuration
} else {
    accessibilityMotionStandardDuration
}

// Apply animation with appropriate duration
animateContentSize(animationSpec = tween(durationMillis = duration))
```

**WCAG Success Criterion**:
- **2.3.3 Animation from Interactions (Level AAA)**: Motion animation triggered by interaction can be disabled, unless the animation is essential to the functionality or the information being conveyed.

**Why This Matters**: Users with vestibular disorders can experience dizziness, nausea, or disorientation from motion animations. Providing reduced motion options is critical for these users.

---

#### Contrast Tokens

**Purpose**: Validate and enforce contrast ratios for WCAG compliance

**WCAG Mapping**: 
- 1.4.3 Contrast (Minimum) - Level AA
- 1.4.6 Contrast (Enhanced) - Level AAA
- 1.4.11 Non-text Contrast - Level AA

**Token Structure**:
```typescript
accessibility.contrast = {
  textMinimum: 4.5,      // WCAG 1.4.3 Contrast (Minimum) - Level AA
  textEnhanced: 7.0,     // WCAG 1.4.6 Contrast (Enhanced) - Level AAA
  nonTextMinimum: 3.0,   // WCAG 1.4.11 Non-text Contrast - Level AA
  largeTextMinimum: 3.0  // WCAG 1.4.3 for large text (18pt+ or 14pt+ bold)
}
```

**Use Case**: Validation system to ensure color combinations meet WCAG contrast requirements

**Implementation Pattern**:
```typescript
// Contrast validation function
function validateContrast(
  foreground: string,
  background: string,
  textSize: 'normal' | 'large'
): ValidationResult {
  const contrastRatio = calculateContrastRatio(foreground, background);
  const minimumRatio = textSize === 'large' 
    ? accessibility.contrast.largeTextMinimum 
    : accessibility.contrast.textMinimum;
  
  if (contrastRatio >= accessibility.contrast.textEnhanced) {
    return { level: 'pass', message: 'Exceeds AAA contrast (7:1)' };
  } else if (contrastRatio >= minimumRatio) {
    return { level: 'pass', message: 'Meets AA contrast requirements' };
  } else {
    return { 
      level: 'error', 
      message: `Insufficient contrast: ${contrastRatio.toFixed(2)}:1 (minimum ${minimumRatio}:1)`,
      wcag: '1.4.3 Contrast (Minimum) - Level AA'
    };
  }
}
```

**WCAG Success Criteria**:
- **1.4.3 Contrast (Minimum) - Level AA**: Text has contrast ratio of at least 4.5:1 (3:1 for large text)
- **1.4.6 Contrast (Enhanced) - Level AAA**: Text has contrast ratio of at least 7:1 (4.5:1 for large text)
- **1.4.11 Non-text Contrast - Level AA**: UI components and graphical objects have contrast ratio of at least 3:1

**Why This Matters**: Sufficient contrast ensures content is readable for users with visual impairments, including color blindness and low vision.

---

#### Text Spacing Tokens

**Purpose**: Support users who need increased text spacing for readability

**WCAG Mapping**: 1.4.12 Text Spacing (Level AA)

**Token Structure**:
```typescript
accessibility.text = {
  minimumLineHeight: 1.5,        // WCAG 1.4.12 Text Spacing
  minimumLetterSpacing: 0.12,    // WCAG 1.4.12 Text Spacing (× font size)
  minimumWordSpacing: 0.16,      // WCAG 1.4.12 Text Spacing (× font size)
  minimumParagraphSpacing: 2.0   // WCAG 1.4.12 Text Spacing (× font size)
}
```

**Use Case**: Allow users to override text spacing without breaking layout

**Cross-Platform Implementation**:

**Web**:
```css
/* Ensure text spacing can be overridden by user stylesheets */
body {
  line-height: var(--accessibility-text-minimum-line-height);
  letter-spacing: calc(var(--accessibility-text-minimum-letter-spacing) * 1em);
  word-spacing: calc(var(--accessibility-text-minimum-word-spacing) * 1em);
}

p {
  margin-bottom: calc(var(--accessibility-text-minimum-paragraph-spacing) * 1em);
}

/* User stylesheet can override these values */
/* Layout should not break with increased spacing */
```

**iOS**:
```swift
// Support Dynamic Type and custom spacing
Text(content)
    .lineSpacing(fontSize * accessibilityTextMinimumLineHeight - fontSize)
    .tracking(fontSize * accessibilityTextMinimumLetterSpacing)
    .dynamicTypeSize(...accessibilityLarge) // Support larger text sizes
```

**Android**:
```kotlin
// Support text spacing adjustments
Text(
    text = content,
    style = TextStyle(
        lineHeight = (fontSize * accessibilityTextMinimumLineHeight).sp,
        letterSpacing = (fontSize * accessibilityTextMinimumLetterSpacing).sp
    )
)
```

**WCAG Success Criterion**:
- **1.4.12 Text Spacing (Level AA)**: No loss of content or functionality occurs when users set:
  - Line height to at least 1.5× font size
  - Letter spacing to at least 0.12× font size
  - Word spacing to at least 0.16× font size
  - Paragraph spacing to at least 2× font size

**Why This Matters**: Users with dyslexia and other reading disabilities often need increased text spacing to read comfortably. Layouts must accommodate these adjustments without breaking.

---

#### Touch Target Tokens (Future Consideration)

**Note**: Touch target tokens are **NOT** in the accessibility family because they benefit all users, not just users with disabilities. However, they're documented here as a common question.

**Why NOT in accessibility family**:
- Benefits all users on touch devices (general usability)
- No specific WCAG criterion for touch target size
- Should be in component-level sizing tokens instead

**Where they belong**:
```typescript
// Component-level sizing tokens (NOT accessibility tokens)
button.minHeight = 'space550'  // 44px minimum touch target
button.minWidth = 'space550'   // 44px minimum touch target
```

**Rationale**: While touch targets help users with motor impairments, they're a general usability improvement that benefits everyone. The accessibility token family is specifically for features that serve users with disabilities.

---

### How to Extend the Accessibility Family

#### Step 1: Identify the Need

**Questions to ask**:
- Does this token map to a specific WCAG success criterion?
- Does this token serve users with specific accessibility needs?
- Is this token distinct from general usability improvements?
- Will this token be used across multiple components?

**Example**: Reduced motion tokens map to WCAG 2.3.3 and serve users with vestibular disorders (specific accessibility need).

#### Step 2: Design the Token Structure

**Follow compositional architecture**:
- Reference existing primitive or semantic tokens where possible
- Use descriptive property names that indicate purpose
- Maintain `accessibility.[category].[property]` namespace structure

**Example**:
```typescript
// ✅ GOOD - References existing tokens
accessibility.motion = {
  reducedDuration: 0,
  standardDuration: 'duration.normal'  // References animation token
}

// ❌ BAD - Hard-coded values
accessibility.motion = {
  reducedDuration: 0,
  standardDuration: 300  // Hard-coded milliseconds
}
```

#### Step 3: Document WCAG Mapping

**Include for each token**:
- WCAG success criterion number and name
- WCAG level (A, AA, AAA)
- Brief explanation of the requirement
- Why the token helps meet the requirement

**Example**:
```typescript
accessibility.motion.reducedDuration = 0  // WCAG 2.3.3 Animation from Interactions (Level AAA)
// Requirement: Motion animation triggered by interaction can be disabled
// Why this helps: Setting duration to 0 eliminates motion for users who need it
```

#### Step 4: Provide Cross-Platform Examples

**Include examples for**:
- Web (CSS custom properties)
- iOS (Swift constants)
- Android (Kotlin constants)

**Show platform-specific implementation patterns**:
- How to consume the token on each platform
- Platform-specific APIs for accessibility features
- Best practices for each platform

#### Step 5: Add AI Agent Guidance

**Document**:
- When to use these tokens
- How to discover them
- Common usage patterns
- Related tokens or features

**Example**:
```markdown
### AI Agent Guidance

**Implementing reduced motion?**
→ Use `accessibility.motion.reducedDuration` for users who prefer reduced motion
→ Use `accessibility.motion.standardDuration` for users who don't prefer reduced motion
→ Check platform-specific motion preferences (prefers-reduced-motion, UIAccessibility.isReduceMotionEnabled)
```

#### Step 6: Update Token Registry

**Register new tokens**:
```typescript
// src/tokens/registries/SemanticTokenRegistry.ts
this.registerCategory('accessibility', accessibility);
```

**Ensure tokens are exported**:
```typescript
// src/tokens/semantic/index.ts
export { accessibility } from './AccessibilityTokens';
```

#### Step 7: Add Cross-Platform Generation

**Update generators**:
- `WebCSSGenerator.ts` - Generate CSS custom properties
- `iOSSwiftGenerator.ts` - Generate Swift constants
- `AndroidKotlinGenerator.ts` - Generate Kotlin constants

**Follow existing pattern**:
```typescript
// Example: Adding motion tokens to WebCSSGenerator
generateAccessibilityTokens(): string {
  return `
/* Accessibility Tokens - Focus Indicators */
--accessibility-focus-offset: 2px;
--accessibility-focus-width: 2px;
--accessibility-focus-color: var(--color-primary);

/* Accessibility Tokens - Motion */
--accessibility-motion-reduced-duration: 0ms;
--accessibility-motion-standard-duration: var(--duration-normal);
  `.trim();
}
```

#### Step 8: Add Validation Support

**Create validation functions**:
```typescript
// Example: Motion token validation
validateMotionTokens(tokens: MotionTokens): ValidationResult[] {
  const results: ValidationResult[] = [];
  
  if (tokens.reducedDuration !== 0) {
    results.push({
      level: 'warning',
      message: 'Reduced motion duration should be 0 for complete motion elimination',
      token: 'accessibility.motion.reducedDuration'
    });
  }
  
  return results;
}
```

**Integrate with ThreeTierValidator**:
```typescript
// Add to existing validation system
validateAccessibilityTokens(tokens: AccessibilityTokens): ValidationResult[] {
  const results: ValidationResult[] = [];
  
  // Existing focus validation
  results.push(...this.validateFocusTokens(tokens.focus));
  
  // New motion validation
  if (tokens.motion) {
    results.push(...this.validateMotionTokens(tokens.motion));
  }
  
  return results;
}
```

#### Step 9: Create Tests

**Test token values**:
```typescript
describe('Motion Tokens', () => {
  it('should have correct reduced motion duration', () => {
    expect(accessibility.motion.reducedDuration).toBe(0);
  });
  
  it('should reference standard duration token', () => {
    expect(accessibility.motion.standardDuration).toBe('duration.normal');
  });
});
```

**Test cross-platform generation**:
```typescript
describe('Motion Token Generation', () => {
  it('should generate CSS custom properties', () => {
    const output = webGenerator.generateAccessibilityTokens();
    expect(output).toContain('--accessibility-motion-reduced-duration: 0ms');
  });
});
```

**Test WCAG compliance**:
```typescript
describe('Motion WCAG Compliance', () => {
  it('should meet WCAG 2.3.3 requirements', () => {
    const result = wcagValidator.validateMotion(accessibility.motion);
    expect(result.level).toBe('pass');
    expect(result.wcag).toContain('2.3.3');
  });
});
```

---

### Extension Checklist

Use this checklist when adding new accessibility token categories:

- [ ] **WCAG Mapping**: Identified specific WCAG success criteria
- [ ] **Token Structure**: Designed compositional architecture referencing existing tokens
- [ ] **Namespace**: Used `accessibility.[category].[property]` format
- [ ] **Documentation**: Created comprehensive documentation with WCAG references
- [ ] **Cross-Platform Examples**: Provided web, iOS, and Android implementation examples
- [ ] **AI Agent Guidance**: Documented when and how to use tokens
- [ ] **Token Registry**: Registered tokens with SemanticTokenRegistry
- [ ] **Token Export**: Exported tokens from semantic token index
- [ ] **Cross-Platform Generation**: Updated all three platform generators
- [ ] **Validation**: Created validation functions and integrated with ThreeTierValidator
- [ ] **Tests**: Created unit tests, generation tests, and WCAG compliance tests
- [ ] **README Update**: Updated this README with new token category documentation

---

### Extensibility Benefits

**For Developers**:
- Clear pattern to follow when adding new accessibility features
- Consistent structure across all accessibility token categories
- Comprehensive documentation reduces implementation time

**For AI Agents**:
- Predictable token structure enables reliable reasoning
- WCAG traceability provides clear decision criteria
- Cross-platform examples show correct implementation patterns

**For Design Systems**:
- Scalable architecture supports growth without restructuring
- Compositional approach maintains consistency with existing tokens
- Validation system ensures quality across all token categories

---

### Questions About Extensibility?

**"Should this be an accessibility token?"**
→ Ask: Does it map to WCAG criteria and serve users with specific accessibility needs?
→ If yes: Add to accessibility family
→ If no: Consider general semantic tokens instead

**"How do I know if my token structure is correct?"**
→ Check: Does it reference existing tokens (compositional architecture)?
→ Check: Does it follow `accessibility.[category].[property]` namespace?
→ Check: Is it documented with WCAG references?

**"What if my token doesn't fit existing categories?"**
→ Create a new category following the extension pattern
→ Document the new category thoroughly
→ Ensure it maintains compositional architecture principles

**"How do I validate my new tokens?"**
→ Create validation functions that check token values
→ Integrate with ThreeTierValidator
→ Write tests that verify WCAG compliance

---

## AI Agent Guidance

### When to Use Accessibility Tokens

**Implementing focus indicators?**
→ Use `accessibility.focus.offset`, `accessibility.focus.width`, `accessibility.focus.color`
→ Combine all three for WCAG-compliant focus indicators

**Need keyboard navigation support?**
→ Focus indicator tokens provide complete solution
→ Follow platform-specific implementation patterns

**Ensuring WCAG compliance?**
→ Accessibility tokens map directly to WCAG success criteria
→ Documentation includes WCAG references for traceability

### Token Discovery

**Search for "accessibility"**
→ Find all accessibility tokens in one location
→ Namespace makes discovery straightforward

**Search for "focus indicator"**
→ Find `accessibility.focus.*` tokens
→ Related properties grouped together

**Read token documentation**
→ WCAG rationale explained for each token
→ Usage context provided with examples

### Implementation Pattern

```typescript
// Complete focus indicator implementation
const focusStyles = {
  outlineOffset: accessibility.focus.offset,  // 2px separation
  outlineWidth: accessibility.focus.width,    // 2px thickness
  outlineColor: accessibility.focus.color     // Primary color
};

// Platform-specific usage
// Web: Apply to :focus-visible pseudo-class
// iOS: Apply to overlay with focus state
// Android: Apply to border with focus state
```

---

## Related Documentation

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/) - Complete WCAG guidelines
- [WCAG 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html) - Focus indicator requirements
- [WCAG 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) - Contrast requirements for UI components

---

*This documentation provides comprehensive guidance for using accessibility tokens to implement WCAG-compliant focus indicators across web, iOS, and Android platforms.*
