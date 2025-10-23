# Inline Emphasis Pattern Guide

**Date**: October 22, 2025
**Spec**: typography-token-expansion
**Purpose**: Guide for applying bold and italic emphasis within text using platform-native patterns
**Organization**: spec-completion
**Scope**: typography-token-expansion

---

## Overview

This guide explains how to apply bold and italic emphasis within text using platform-appropriate semantic markup and modifiers. Typography tokens in DesignerPunk define text **structure** (size, weight, line-height, family), while inline emphasis is applied through **platform-native modifiers** that preserve semantic meaning and accessibility.

**Key Principle**: Inline emphasis (bold, italic) is **contextual styling** within text, not **structural typography**. Every major design system uses platform-native modifiers for emphasis rather than creating emphasis tokens.

---

## Why No Emphasis Typography Tokens?

### The Problem with Emphasis Tokens

Creating emphasis tokens like `typography.bodyMdBold` or `typography.bodyMdItalic` would:

1. **Encourage non-semantic markup**: Developers would use `<span style={typography.strong}>` instead of `<strong>`, harming accessibility
2. **Create token explosion**: bodyMdBold, bodyMdItalic, bodyMdBoldItalic × all sizes = dozens of redundant tokens
3. **Violate compositional architecture**: Emphasis is a modifier, not a base style
4. **Fight platform conventions**: Each platform has established patterns for inline emphasis

### The Right Approach

Use platform-native modifiers that:

- ✅ Preserve semantic meaning (screen readers understand `<strong>` and `<em>`)
- ✅ Follow platform conventions (developers expect platform idioms)
- ✅ Maintain accessibility (semantic HTML, SwiftUI modifiers, Compose spans)
- ✅ Avoid token explosion (no need for emphasis variants of every typography token)

---

## Platform-Native Emphasis Patterns

### Web (HTML + CSS)

**Use semantic HTML elements** for inline emphasis:

#### Bold Emphasis

```html
<!-- ✅ CORRECT: Semantic HTML -->
<p style="font-size: 1rem; line-height: 1.5;">
  This is normal text with <strong>strong emphasis</strong> inline.
</p>

<!-- ✅ CORRECT: CSS with semantic element -->
<p class="body-md">
  This is normal text with <strong>strong emphasis</strong> inline.
</p>

<!-- ❌ WRONG: Non-semantic span -->
<p class="body-md">
  This is normal text with <span class="bold">strong emphasis</span> inline.
</p>

<!-- ❌ WRONG: Using primitive token directly -->
<p class="body-md">
  This is normal text with <span style="font-weight: 700;">strong emphasis</span> inline.
</p>
```

**CSS for semantic elements**:

```css
/* Apply to semantic HTML elements */
strong, b {
  font-weight: 500; /* or 600, 700 depending on design */
}

em, i {
  font-style: italic;
}
```

#### Italic Emphasis

```html
<!-- ✅ CORRECT: Semantic HTML -->
<p style="font-size: 1rem; line-height: 1.5;">
  This is normal text with <em>emphasized text</em> inline.
</p>

<!-- ✅ CORRECT: CSS with semantic element -->
<p class="body-md">
  This is normal text with <em>emphasized text</em> inline.
</p>

<!-- ❌ WRONG: Non-semantic span -->
<p class="body-md">
  This is normal text with <span class="italic">emphasized text</span> inline.
</p>
```

#### Combined Emphasis

```html
<!-- ✅ CORRECT: Nested semantic elements -->
<p class="body-md">
  This is normal text with <strong><em>strong and emphasized</em></strong> inline.
</p>
```

**Why semantic HTML matters**:
- Screen readers announce `<strong>` and `<em>` with appropriate emphasis
- Search engines understand semantic meaning
- Browser reader modes preserve semantic structure
- Accessibility tools rely on semantic markup

---

### iOS (SwiftUI)

**Use SwiftUI view modifiers** for inline emphasis:

#### Bold Emphasis

```swift
// ✅ CORRECT: SwiftUI fontWeight modifier
Text("This is normal text with ")
    .font(.system(size: 16, weight: .regular))
    + Text("bold emphasis")
        .fontWeight(.bold)
    + Text(" inline.")

// ✅ CORRECT: Using design system token with modifier
Text("This is normal text with ")
    .font(.custom("Inter", size: 16))
    .fontWeight(.regular)
    + Text("bold emphasis")
        .fontWeight(.bold)
    + Text(" inline.")

// ❌ WRONG: Creating separate text views
VStack {
    Text("This is normal text with")
    Text("bold emphasis").fontWeight(.bold)
    Text("inline.")
}
```

#### Italic Emphasis

```swift
// ✅ CORRECT: SwiftUI italic modifier
Text("This is normal text with ")
    .font(.system(size: 16, weight: .regular))
    + Text("italic emphasis")
        .italic()
    + Text(" inline.")

// ✅ CORRECT: Using design system token with modifier
Text("This is normal text with ")
    .font(.custom("Inter", size: 16))
    + Text("italic emphasis")
        .italic()
    + Text(" inline.")
```

#### Combined Emphasis

```swift
// ✅ CORRECT: Combining modifiers
Text("This is normal text with ")
    .font(.system(size: 16, weight: .regular))
    + Text("bold and italic emphasis")
        .fontWeight(.bold)
        .italic()
    + Text(" inline.")
```

**SwiftUI AttributedString (iOS 15+)**:

```swift
// ✅ CORRECT: AttributedString for complex formatting
var attributedString = AttributedString("This is normal text with bold emphasis inline.")

if let range = attributedString.range(of: "bold emphasis") {
    attributedString[range].font = .system(size: 16, weight: .bold)
}

Text(attributedString)
```

**Why SwiftUI modifiers matter**:
- VoiceOver announces emphasis appropriately
- Modifiers compose naturally with SwiftUI's declarative syntax
- Platform-native behavior for text rendering
- Accessibility features work automatically

---

### Android (Jetpack Compose)

**Use AnnotatedString with SpanStyle** for inline emphasis:

#### Bold Emphasis

```kotlin
// ✅ CORRECT: AnnotatedString with SpanStyle
val annotatedString = buildAnnotatedString {
    append("This is normal text with ")
    
    withStyle(style = SpanStyle(fontWeight = FontWeight.Bold)) {
        append("bold emphasis")
    }
    
    append(" inline.")
}

Text(
    text = annotatedString,
    fontSize = 16.sp,
    lineHeight = 24.sp,
    fontFamily = FontFamily.Default
)

// ✅ CORRECT: Using design system values
val annotatedString = buildAnnotatedString {
    append("This is normal text with ")
    
    withStyle(style = SpanStyle(fontWeight = FontWeight.Medium)) {
        append("bold emphasis")
    }
    
    append(" inline.")
}

Text(
    text = annotatedString,
    style = MaterialTheme.typography.bodyMedium
)
```

#### Italic Emphasis

```kotlin
// ✅ CORRECT: AnnotatedString with italic style
val annotatedString = buildAnnotatedString {
    append("This is normal text with ")
    
    withStyle(style = SpanStyle(fontStyle = FontStyle.Italic)) {
        append("italic emphasis")
    }
    
    append(" inline.")
}

Text(
    text = annotatedString,
    fontSize = 16.sp,
    lineHeight = 24.sp
)
```

#### Combined Emphasis

```kotlin
// ✅ CORRECT: Combining SpanStyle properties
val annotatedString = buildAnnotatedString {
    append("This is normal text with ")
    
    withStyle(
        style = SpanStyle(
            fontWeight = FontWeight.Bold,
            fontStyle = FontStyle.Italic
        )
    ) {
        append("bold and italic emphasis")
    }
    
    append(" inline.")
}

Text(text = annotatedString)
```

**Android View System (XML)**:

```xml
<!-- ✅ CORRECT: HTML-style markup in strings.xml -->
<resources>
    <string name="emphasized_text">
        This is normal text with <b>bold emphasis</b> inline.
    </string>
    
    <string name="italic_text">
        This is normal text with <i>italic emphasis</i> inline.
    </string>
</resources>
```

```kotlin
// Use with TextView
textView.text = Html.fromHtml(
    getString(R.string.emphasized_text),
    Html.FROM_HTML_MODE_COMPACT
)
```

**Why AnnotatedString matters**:
- TalkBack announces emphasis appropriately
- Compose's native text rendering handles spans efficiently
- Accessibility services understand SpanStyle semantics
- Platform-native behavior for text selection and interaction

---

## Discouraged Patterns

### ❌ Direct Use of Primitive fontWeight Tokens

**Don't do this**:

```typescript
// ❌ WRONG: Using primitive token directly
<span style={{ fontWeight: tokens.fontWeight700 }}>
  Bold text
</span>
```

**Why it's wrong**:
- Bypasses semantic markup (no `<strong>` element)
- Harms accessibility (screen readers don't understand arbitrary font weights)
- Violates compositional architecture (primitives should be referenced by semantic tokens)
- Makes code harder to maintain (magic numbers scattered throughout)

**Do this instead**:

```html
<!-- ✅ CORRECT: Semantic HTML -->
<strong>Bold text</strong>
```

```css
/* Define semantic styling once */
strong {
  font-weight: 500; /* or reference design system value */
}
```

### ❌ Creating Custom Emphasis Classes

**Don't do this**:

```css
/* ❌ WRONG: Custom emphasis classes */
.text-bold {
  font-weight: 700;
}

.text-italic {
  font-style: italic;
}
```

```html
<p>This is normal text with <span class="text-bold">bold emphasis</span> inline.</p>
```

**Why it's wrong**:
- Non-semantic markup harms accessibility
- Reinvents platform conventions unnecessarily
- Creates maintenance burden (more CSS to manage)

**Do this instead**:

```html
<!-- ✅ CORRECT: Use semantic HTML -->
<p>This is normal text with <strong>bold emphasis</strong> inline.</p>
```

### ❌ Emphasis Typography Tokens

**Don't do this**:

```typescript
// ❌ WRONG: Creating emphasis tokens
const tokens = {
  'typography.bodyMdBold': {
    fontSize: 'fontSize100',
    fontWeight: 'fontWeight700',
    // ...
  },
  'typography.bodyMdItalic': {
    fontSize: 'fontSize100',
    fontStyle: 'italic',
    // ...
  }
};
```

**Why it's wrong**:
- Token explosion (need bold/italic/boldItalic for every size)
- Encourages non-semantic usage
- Violates compositional architecture
- Doesn't match platform conventions

**Do this instead**:

Use platform-native modifiers as documented above.

---

## Accessibility Considerations

### Screen Reader Behavior

**Semantic HTML** (`<strong>`, `<em>`):
- Screen readers announce emphasis with appropriate intonation
- Users can navigate by semantic elements
- Accessibility tools understand document structure

**Non-semantic markup** (`<span class="bold">`):
- Screen readers treat as normal text
- No indication of emphasis to users
- Accessibility tools can't identify important content

### WCAG Compliance

Using semantic markup helps meet WCAG 2.1 success criteria:

- **1.3.1 Info and Relationships**: Semantic elements convey meaning programmatically
- **4.1.2 Name, Role, Value**: Semantic elements have appropriate roles
- **1.4.8 Visual Presentation**: Emphasis doesn't rely solely on visual styling

---

## Design System Integration

### When to Use Emphasis

**Use inline emphasis for**:
- Important words or phrases within sentences
- Technical terms or keywords
- Emphasis for tone or meaning
- Titles of works (books, articles) - use `<em>` or `<cite>`

**Don't use emphasis for**:
- Entire paragraphs (use different typography token instead)
- Headings (use heading typography tokens)
- UI labels (use label typography tokens with appropriate weight)
- Buttons (use button typography tokens)

### Combining with Typography Tokens

**Web**:
```html
<!-- ✅ CORRECT: Typography token + semantic emphasis -->
<p class="typography-body-md">
  This is normal text with <strong>bold emphasis</strong> inline.
</p>
```

**iOS**:
```swift
// ✅ CORRECT: Design system token + SwiftUI modifier
Text("This is normal text with ")
    .font(.custom("Inter", size: DesignTokens.fontSize100))
    + Text("bold emphasis")
        .fontWeight(.bold)
    + Text(" inline.")
```

**Android**:
```kotlin
// ✅ CORRECT: Material theme + SpanStyle
val annotatedString = buildAnnotatedString {
    append("This is normal text with ")
    withStyle(style = SpanStyle(fontWeight = FontWeight.Bold)) {
        append("bold emphasis")
    }
    append(" inline.")
}

Text(
    text = annotatedString,
    style = MaterialTheme.typography.bodyMedium
)
```

---

## Summary

### Key Principles

1. **Use platform-native patterns**: Semantic HTML, SwiftUI modifiers, Compose AnnotatedString
2. **Preserve accessibility**: Semantic markup enables screen readers and assistive technologies
3. **Avoid emphasis tokens**: Inline emphasis is a modifier, not a structural typography style
4. **Don't use primitives directly**: Use platform conventions instead of raw fontWeight values

### Quick Reference

| Platform | Bold | Italic | Combined |
|----------|------|--------|----------|
| **Web** | `<strong>` | `<em>` | `<strong><em>` |
| **iOS** | `.fontWeight(.bold)` | `.italic()` | Both modifiers |
| **Android** | `SpanStyle(fontWeight = Bold)` | `SpanStyle(fontStyle = Italic)` | Both in SpanStyle |

### Requirements Addressed

- ✅ **6.1**: Platform-native modifier patterns documented
- ✅ **6.2**: Examples provided for web (semantic HTML), iOS (SwiftUI), Android (Compose)
- ✅ **6.3**: Emphasis tokens not required - platform modifiers handle inline styling
- ✅ **6.4**: Direct primitive token usage discouraged with clear rationale
- ✅ **6.5**: Semantic markup prevents accessibility harm from non-semantic emphasis tokens

---

*This guide ensures inline emphasis is applied using platform-appropriate patterns that preserve semantic meaning, maintain accessibility, and follow established platform conventions.*
