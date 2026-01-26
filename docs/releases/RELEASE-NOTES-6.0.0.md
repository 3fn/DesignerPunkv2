# Release Notes - v6.0.0

**Release Date**: January 25, 2026
**Type**: Major Release (Breaking Changes)

---

## ⚠️ Breaking Changes

This release restructures semantic color token naming and migrates primitive colors to RGBA format. **All consumers must update token references.**

### Token Name Changes

| Old Token | New Token |
|-----------|-----------|
| `color.success.*` | `color.feedback.success.*` |
| `color.error.*` | `color.feedback.error.*` |
| `color.warning.*` | `color.feedback.warning.*` |
| `color.info.*` | `color.feedback.info.*` |
| `color.select.*` | `color.feedback.select.*` |
| `color.avatar.human` | `color.identity.human` |
| `color.avatar.agent` | `color.identity.agent` |
| `color.primary` | `color.action.primary` |
| `color.contrast.onPrimary` | `color.contrast.onDark` |
| `color.background` | `color.structure.canvas` |
| `color.surface` | `color.structure.surface` |
| `color.border` | `color.structure.border` |
| `color.border.subtle` | `color.structure.border.subtle` |

### Format Changes

- **Primitive colors**: Migrated from hex (`#RRGGBB`) to RGBA (`rgba(R, G, B, 1)`)
- **Platform output**: All generators updated for RGBA format
  - Web: `rgba(r, g, b, a)`
  - iOS: `UIColor(red: r/255, green: g/255, blue: b/255, alpha: a)`
  - Android: `Color.argb(a*255, r, g, b)`

---

## New Features

### Concept-Based Semantic Color Organization

Semantic color tokens are now organized by five concepts that encode design intent:

#### Feedback Concept
Communicates system state and user action results:
- `color.feedback.success.{text|background|border}` - Positive outcomes
- `color.feedback.error.{text|background|border}` - Errors and failures
- `color.feedback.warning.{text|background|border}` - Caution states
- `color.feedback.info.{text|background|border}` - Informational states
- `color.feedback.select.{text|background|border}.{rest|default}` - Selection states

#### Identity Concept
Distinguishes entity types in the interface:
- `color.identity.human` - Human user representation (orange300)
- `color.identity.agent` - AI agent representation (teal200)

#### Action Concept
Indicates interactive elements and their emphasis:
- `color.action.primary` - Primary actions (purple300)
- `color.action.secondary` - Secondary actions (black400)

#### Contrast Concept
Ensures content readability on different backgrounds:
- `color.contrast.onLight` - Content on light backgrounds (black500)
- `color.contrast.onDark` - Content on dark backgrounds (white100)

#### Structure Concept
Defines interface structure and boundaries:
- `color.structure.canvas` - Page background (white100)
- `color.structure.surface` - Elevated surfaces (white200)
- `color.structure.border` - Standard borders (gray100)
- `color.structure.border.subtle` - Subtle borders (gray100 + opacity600)

### Opacity Composition Pattern

The `color.structure.border.subtle` token demonstrates the new opacity composition pattern:
- References `gray100` color primitive
- References `opacity600` (0.48) opacity primitive
- Generators resolve to platform-specific RGBA output

This pattern enables mathematical consistency while supporting transparency.

---

## Migration Guide

### Web (CSS)

```css
/* Before */
color: var(--color-success-strong);
background: var(--color-primary);

/* After */
color: var(--color-feedback-success-text);
background: var(--color-action-primary);
```

### iOS (Swift)

```swift
// Before
.foregroundColor(colorSuccessStrong)
.background(colorPrimary)

// After
.foregroundColor(colorFeedbackSuccessText)
.background(colorActionPrimary)
```

### Android (Kotlin)

```kotlin
// Before
color = colorSuccessStrong
backgroundColor = colorPrimary

// After
color = colorFeedbackSuccessText
backgroundColor = colorActionPrimary
```

---

## Component Updates

All 9 components updated across all 3 platforms:
- Avatar
- Button-CTA
- Button-Icon
- Button-VerticalList-Item
- Button-VerticalList-Set
- Container-Base
- Container-Card-Base
- Input-Text-Base
- Badge-Count-Notification

---

## Documentation Updates

- `Token-Family-Color.md` - Rewritten for concept-based organization
- `Token-Governance.md` - Updated examples with new token names
- `Token-Quick-Reference.md` - Updated lookup tables
- `Rosetta-System-Architecture.md` - Documented RGBA pipeline
- `Component-Family-Avatar.md` - Updated for identity/contrast tokens
- `Component-Family-Button.md` - Updated for action/feedback tokens

---

## Test Suite

- 300 test suites passing
- 7,614 tests passing
- Full cross-platform validation

---

## Specs

- **Spec 051**: Semantic Token Naming Restructure (Design Authority)
- **Spec 052**: Semantic Token Naming Implementation
