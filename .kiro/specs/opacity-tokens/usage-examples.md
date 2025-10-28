# Opacity Token Usage Examples and AI Agent Guidance

**Date**: October 28, 2025
**Purpose**: Provide practical examples and AI agent guidance for opacity token usage
**Organization**: spec-guide
**Scope**: opacity-tokens
**Implementation Status**: Conceptual - API design phase
**AI Agent Guidance**: Examples show intended API design. DO NOT copy directly. Verify actual implementation in src/ before use.

---

## ⚠️ Implementation Status: Conceptual Examples

**These code examples are conceptual and demonstrate the intended API design.**

The opacity token system is currently under development. These examples show:
- **How opacity tokens will work** once the system is fully implemented
- **The intended developer experience** and composition patterns
- **Cross-platform usage patterns** that will be consistent across web, iOS, and Android

### For AI Agents

**DO NOT copy these code examples directly into production code.**

Before generating code that uses opacity tokens, you MUST:

1. **Verify implementation exists**: Check `src/tokens/OpacityTokens.ts` and `src/composition/OpacityComposition.ts` for actual exports
2. **Verify API signatures**: Confirm function signatures and composition patterns match these examples (they may differ during development)
3. **Check import paths**: Verify actual package structure and import paths in the codebase
4. **Validate accessibility**: Ensure opacity applications maintain WCAG contrast requirements where applicable
5. **Test before committing**: Ensure generated code compiles and runs correctly

**When in doubt**: Ask the human developer to confirm the current implementation status before proceeding.

**Important**: The extensive AI agent guidance in this document (decision frameworks, validation checklists, common mistakes) represents the intended decision-making process. Use this guidance to understand *how* to think about opacity token selection, but always verify the actual implementation before generating code.

### For Human Developers

These examples illustrate opacity token concepts, composition patterns, and usage guidelines. Before using opacity tokens in your code:

1. Check the current implementation status in `src/tokens/` and `src/composition/`
2. Refer to actual API documentation once available
3. Validate WCAG contrast ratios when applying opacity to backgrounds with text
4. Run tests to verify behavior matches expectations

### When This Warning Will Be Removed

This warning section will be removed when:
- Opacity token implementation is complete and tested
- Composition patterns are validated in real components
- API is stable and production-ready
- Actual usage examples have been validated across platforms

**Current Status** (October 28, 2025): API design and core implementation in progress. Examples and guidance are conceptual.

---

## Related Documentation

- [Requirements Document](./requirements.md) - Opacity token system requirements
- [Design Document](./design.md) - Opacity token architecture and design decisions
- [Safe Combinations Guide](./safe-combinations-guide.md) - WCAG-compliant opacity + color combinations

---

## Introduction

This guide provides practical examples of opacity token usage across common UI patterns and includes specific guidance for AI agents selecting appropriate opacity tokens. Each example demonstrates composition patterns, platform-specific implementations, and accessibility considerations.

---

## Usage Examples

### Example 1: Modal Overlays

**Use Case**: Semi-transparent backdrop behind modal dialogs that blocks interaction with background content

**Token Selection**: `opacityOverlay` (opacity400 = 32%)

**Rationale**: 32% opacity provides sufficient visual separation between modal and background while maintaining some context of the underlying content.

#### Web Implementation

```css
/* Modal backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.32); /* black at opacity400 */
  z-index: 1000;
}

/* Using CSS custom properties */
.modal-backdrop {
  background-color: rgba(0, 0, 0, var(--opacity-overlay));
}
```

#### iOS Implementation

```swift
// Modal backdrop
ZStack {
    Color.black
        .opacity(0.32) // opacityOverlay
        .ignoresSafeArea()
    
    ModalContent()
}
```

#### Android Implementation

```kotlin
// Modal backdrop
Box(
    modifier = Modifier
        .fillMaxSize()
        .background(Color.Black.copy(alpha = 0.32f)) // opacityOverlay
) {
    ModalContent()
}
```

**Accessibility Notes**:
- Modal backdrop doesn't need WCAG contrast compliance (no text content)
- Ensure modal content maintains proper contrast ratios
- Provide keyboard navigation and screen reader support

---

### Example 2: Disabled States

**Use Case**: Visually indicate that UI elements are disabled and non-interactive

**Token Selection**: `opacityDisabled` (opacity600 = 48%)

**Rationale**: 48% opacity provides clear visual indication of disabled state while maintaining recognizability of the element.

#### Web Implementation

```css
/* Disabled button */
.button:disabled {
  opacity: 0.48; /* opacityDisabled */
  cursor: not-allowed;
}

/* Disabled input */
.input:disabled {
  opacity: 0.48; /* opacityDisabled */
  background-color: var(--color-surface-disabled);
}

/* Disabled text */
.text-disabled {
  color: rgba(var(--color-text-rgb), 0.48); /* text color at opacityDisabled */
}
```

#### iOS Implementation

```swift
// Disabled button
Button("Submit") {
    // Action
}
.disabled(isDisabled)
.opacity(isDisabled ? 0.48 : 1.0) // opacityDisabled when disabled

// Disabled text
Text("Label")
    .foregroundColor(.primary)
    .opacity(isDisabled ? 0.48 : 1.0) // opacityDisabled when disabled
```

#### Android Implementation

```kotlin
// Disabled button
Button(
    onClick = { /* Action */ },
    enabled = !isDisabled,
    modifier = Modifier.alpha(if (isDisabled) 0.48f else 1.0f) // opacityDisabled
) {
    Text("Submit")
}

// Disabled text
Text(
    text = "Label",
    color = MaterialTheme.colorScheme.onSurface.copy(
        alpha = if (isDisabled) 0.48f else 1.0f // opacityDisabled
    )
)
```

**Accessibility Notes**:
- Disabled elements are exempt from WCAG contrast requirements
- Use `aria-disabled="true"` or platform-equivalent attributes
- Ensure disabled state is communicated to screen readers
- Consider providing explanatory text for why element is disabled

---

### Example 3: Glassmorphism Effects

**Use Case**: Semi-transparent surfaces with background blur creating depth and visual hierarchy

**Token Selection**: `opacity600` (48%) for background, `opacity200` (16%) for borders

**Rationale**: 48% opacity with blur creates frosted glass effect while maintaining readability. 16% border opacity provides subtle definition.

#### Web Implementation

```css
/* Glassmorphism container */
.glass-container {
  background-color: rgba(255, 255, 255, 0.48); /* white at opacity600 */
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.16); /* white at opacity200 */
  border-radius: 12px;
  padding: 24px;
}

/* Dark mode glassmorphism */
.glass-container-dark {
  background-color: rgba(0, 0, 0, 0.48); /* black at opacity600 */
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.16); /* white at opacity200 */
}
```

#### iOS Implementation

```swift
// Glassmorphism container
ZStack {
    // Background blur
    VisualEffectView(effect: UIBlurEffect(style: .systemMaterial))
    
    // Semi-transparent overlay
    Color.white
        .opacity(0.48) // opacity600
    
    // Content
    VStack {
        Text("Content")
    }
    .padding()
}
.overlay(
    RoundedRectangle(cornerRadius: 12)
        .stroke(Color.white.opacity(0.16), lineWidth: 1) // opacity200
)
```

#### Android Implementation

```kotlin
// Glassmorphism container (requires RenderScript or custom blur)
Container(
    modifier = Modifier
        .fillMaxWidth()
        .background(
            Color.White.copy(alpha = 0.48f), // opacity600
            shape = RoundedCornerShape(12.dp)
        )
        .border(
            width = 1.dp,
            color = Color.White.copy(alpha = 0.16f), // opacity200
            shape = RoundedCornerShape(12.dp)
        )
) {
    // Content
    Text("Content")
}
```

**Accessibility Notes**:
- Validate contrast between text and glassmorphism background
- Ensure text remains readable with blur effect
- Test with different background colors and images
- Consider providing high-contrast alternative for accessibility settings

---

## Composition Patterns

### Pattern 1: Single Opacity Application

**Description**: Apply opacity to a single element or color

**When to Use**: Simple state changes, hover effects, disabled states

**Examples**:

```typescript
// Button hover state
button.hover: purple500 at opacity1000 (80%)

// Disabled text
text.disabled: gray900 at opacity600 (48%)

// Subtle overlay
overlay.light: white100 at opacity100 (8%)
```

**Platform Implementations**:

```css
/* Web */
.button:hover {
  background-color: rgba(107, 80, 164, 0.8); /* purple500 at opacity1000 */
}
```

```swift
// iOS
Button("Click")
    .background(Color.purple.opacity(0.8)) // purple500 at opacity1000
```

```kotlin
// Android
Button(
    colors = ButtonDefaults.buttonColors(
        containerColor = Color(0xFF6B50A4).copy(alpha = 0.8f) // purple500 at opacity1000
    )
)
```

---

### Pattern 2: Layered Opacity

**Description**: Multiple opacity layers stacked to create depth

**When to Use**: Complex overlays, modal stacks, depth effects

**Examples**:

```typescript
// Modal with multiple layers
modal.backdrop: black500 at opacity400 (32%)
modal.container: white100 at opacity1300 (100%)
modal.shadow: black500 at opacity300 (24%)

// Layered glassmorphism
glass.background: white100 at opacity600 (48%)
glass.border: white100 at opacity200 (16%)
glass.highlight: white100 at opacity100 (8%)
```

**Platform Implementations**:

```css
/* Web - Layered modal */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.32); /* opacity400 */
}

.modal-container {
  background-color: white; /* opacity1300 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.24); /* opacity300 */
}
```

```swift
// iOS - Layered glassmorphism
ZStack {
    Color.white.opacity(0.48) // opacity600 background
    
    VStack {
        // Content
    }
    .overlay(
        RoundedRectangle(cornerRadius: 12)
            .stroke(Color.white.opacity(0.16), lineWidth: 1) // opacity200 border
    )
    .overlay(
        LinearGradient(
            colors: [Color.white.opacity(0.08), Color.clear], // opacity100 highlight
            startPoint: .top,
            endPoint: .bottom
        )
    )
}
```

---

### Pattern 3: Gradient Opacity

**Description**: Opacity combined with color gradients for smooth transitions

**When to Use**: Hero image overlays, fade effects, progressive disclosure

**Examples**:

```typescript
// Hero image overlay
hero.overlay: {
  gradient: black500 to transparent
  opacity: opacity400 (32%)
}

// Fade to background
fade.bottom: {
  gradient: transparent to white100
  opacity: opacity1300 (100%)
}

// Vignette effect
vignette: {
  gradient: transparent to black500
  opacity: opacity300 (24%)
}
```

**Platform Implementations**:

```css
/* Web - Hero overlay */
.hero-overlay {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.32), /* black at opacity400 */
    transparent
  );
}

/* Fade to background */
.fade-bottom {
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 1.0) /* white at opacity1300 */
  );
}
```

```swift
// iOS - Hero overlay
LinearGradient(
    gradient: Gradient(colors: [
        Color.black.opacity(0.32), // opacity400
        Color.clear
    ]),
    startPoint: .top,
    endPoint: .bottom
)
```

```kotlin
// Android - Hero overlay
Box(
    modifier = Modifier
        .fillMaxSize()
        .background(
            Brush.verticalGradient(
                colors = listOf(
                    Color.Black.copy(alpha = 0.32f), // opacity400
                    Color.Transparent
                )
            )
        )
)
```

---

## AI Agent Guidance for Token Selection

### Decision Framework

When selecting opacity tokens, AI agents should follow this decision framework:

#### Step 1: Identify Use Case Category

**Interactive States** (hover, pressed, focus):
- Subtle changes: `opacityHover` (opacity100 = 8%)
- Noticeable changes: `opacityPressed` (opacity200 = 16%)
- Strong changes: opacity300-opacity500 (24%-40%)

**Disabled States**:
- Always use: `opacityDisabled` (opacity600 = 48%)
- Rationale: Consistent disabled appearance across all components

**Overlays and Scrims**:
- Light overlays: opacity200-opacity300 (16%-24%)
- Modal backdrops: `opacityOverlay` (opacity400 = 32%)
- Strong overlays: opacity500-opacity600 (40%-48%)

**Glassmorphism Effects**:
- Background: opacity600-opacity800 (48%-64%)
- Borders: opacity100-opacity200 (8%-16%)
- Highlights: opacity100 (8%)

**Loading States**:
- Use: `opacityLoading` (opacity200 = 16%)
- Rationale: Subtle, non-intrusive indication

#### Step 2: Consider Accessibility

**Text Content**:
- ⚠️ **Warning**: Applying opacity to text often fails WCAG contrast
- **Recommendation**: Use explicit color tokens instead of opacity
- **Exception**: Disabled text (exempt from WCAG requirements)

**Background Opacity**:
- ✅ **Safe**: Modal overlays, decorative elements (no text)
- ⚠️ **Validate**: Glassmorphism, overlays with text (check contrast)
- ❌ **Avoid**: Text on semi-transparent backgrounds without validation

**Interactive Elements**:
- Ensure hover/focus states maintain sufficient contrast
- Validate pressed states don't reduce contrast below WCAG thresholds
- Test with different background colors

#### Step 3: Validate Platform Consistency

**Cross-Platform Values**:
- All platforms use same unitless values (0.48 = 0.48 across web/iOS/Android)
- Verify visual consistency across platforms during testing
- Document any platform-specific calibration needs

**Platform-Specific Considerations**:
- **Web**: Subpixel rendering, browser differences
- **iOS**: @2x/@3x scaling, dark mode
- **Android**: Density buckets, material design expectations

#### Step 4: Apply Composition Logic

**Single Opacity**:
```typescript
// Simple state change
element.state: color at opacity
// Example: button.hover: purple500 at opacity1000
```

**Layered Opacity**:
```typescript
// Multiple layers for depth
layer1: color1 at opacity1
layer2: color2 at opacity2
// Example: modal backdrop + container + shadow
```

**Gradient Opacity**:
```typescript
// Smooth transitions
gradient: color1 to color2 at opacity
// Example: hero overlay with fade
```

### Common AI Agent Mistakes to Avoid

#### Mistake 1: Applying Opacity to Text

❌ **Wrong**:
```typescript
text.secondary: gray900 at opacity600 (48%)
```

✅ **Correct**:
```typescript
text.secondary: gray600 // Use explicit color token
```

**Rationale**: Opacity on text often fails WCAG contrast. Use explicit color tokens that maintain proper contrast ratios.

#### Mistake 2: Inconsistent Disabled States

❌ **Wrong**:
```typescript
button.disabled: purple500 at opacity500 (40%)
input.disabled: gray900 at opacity700 (56%)
```

✅ **Correct**:
```typescript
button.disabled: purple500 at opacityDisabled (48%)
input.disabled: gray900 at opacityDisabled (48%)
```

**Rationale**: Consistent disabled appearance across all components improves UX and reduces cognitive load.

#### Mistake 3: Over-Using Strategic Flexibility

❌ **Wrong**:
```typescript
// Creating custom opacity values for every use case
overlay.light: color at 0.15
overlay.medium: color at 0.35
overlay.dark: color at 0.55
```

✅ **Correct**:
```typescript
// Use established tokens
overlay.light: color at opacity200 (16%)
overlay.medium: color at opacity400 (32%)
overlay.dark: color at opacity600 (48%)
```

**Rationale**: Use established tokens unless there's a documented need for strategic flexibility. Custom values should be rare and justified.

#### Mistake 4: Ignoring Accessibility Validation

❌ **Wrong**:
```typescript
// Applying opacity without contrast validation
container.glass: white100 at opacity600 (48%)
container.text: gray900 // No validation
```

✅ **Correct**:
```typescript
// Validate contrast before applying
container.glass: white100 at opacity600 (48%)
container.text: gray900 // Validated: 4.8:1 contrast ratio ✅
```

**Rationale**: Always validate WCAG contrast when applying opacity to backgrounds with text content.

### AI Agent Decision Tree

```
Is this for text content?
├─ YES → Use explicit color token (not opacity)
└─ NO → Continue

Is this a disabled state?
├─ YES → Use opacityDisabled (48%)
└─ NO → Continue

Is this an interactive state?
├─ Subtle (hover) → Use opacityHover (8%)
├─ Noticeable (pressed) → Use opacityPressed (16%)
└─ Strong → Use opacity300-opacity500 (24%-40%)

Is this an overlay/scrim?
├─ Light → Use opacity200-opacity300 (16%-24%)
├─ Modal → Use opacityOverlay (32%)
└─ Strong → Use opacity500-opacity600 (40%-48%)

Is this glassmorphism?
├─ Background → Use opacity600-opacity800 (48%-64%)
├─ Border → Use opacity100-opacity200 (8%-16%)
└─ Highlight → Use opacity100 (8%)

Is this a loading state?
└─ YES → Use opacityLoading (16%)

Does this involve text content?
└─ YES → Validate WCAG contrast (4.5:1 for normal text, 3:1 for large text)

Is there an established semantic token?
├─ YES → Use semantic token
└─ NO → Use primitive token with documented rationale
```

### Validation Checklist for AI Agents

Before finalizing opacity token selection, verify:

- [ ] **Use Case Identified**: Clear understanding of what the opacity is for
- [ ] **Semantic Token Considered**: Checked if semantic token exists (opacityDisabled, opacityOverlay, etc.)
- [ ] **Accessibility Validated**: If text is involved, contrast ratio validated
- [ ] **Platform Consistency**: Same opacity value works across web/iOS/Android
- [ ] **Composition Pattern**: Appropriate pattern selected (single, layered, gradient)
- [ ] **Documentation**: Rationale documented if using non-standard token
- [ ] **Strategic Flexibility**: Custom values only used when justified

---

## Quick Reference

### Semantic Tokens

| Token | Value | Use Case |
|-------|-------|----------|
| `opacityDisabled` | 48% | Disabled UI elements |
| `opacityOverlay` | 32% | Modal scrims, overlays |
| `opacityHover` | 8% | Subtle hover feedback |
| `opacityPressed` | 16% | Pressed state feedback |
| `opacityLoading` | 16% | Loading skeleton states |

### Common Patterns

| Pattern | Tokens | Example |
|---------|--------|---------|
| Modal Backdrop | opacity400 (32%) | `black at opacity400` |
| Disabled Button | opacity600 (48%) | `purple500 at opacityDisabled` |
| Glassmorphism | opacity600 + opacity200 | `white at opacity600` + border at `opacity200` |
| Hover State | opacity100 (8%) | `surface at opacityHover` |
| Loading State | opacity200 (16%) | `gray at opacityLoading` |

### Accessibility Guidelines

- ✅ **Safe**: Modal overlays, disabled states, decorative elements
- ⚠️ **Validate**: Glassmorphism with text, overlays with content
- ❌ **Avoid**: Opacity on text (use explicit colors instead)

---

## Related Documentation

- [Requirements Document](./requirements.md) - Complete opacity token requirements
- [Design Document](./design.md) - Architectural decisions and rationale
- [Safe Combinations Guide](./safe-combinations-guide.md) - WCAG-compliant combinations
- [Tasks Document](./tasks.md) - Implementation plan and progress

---

*This usage guide provides practical examples and AI agent guidance for effective opacity token usage across platforms while maintaining accessibility and consistency.*
