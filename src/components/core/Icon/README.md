# Icon Component

**Date**: November 18, 2025
**Purpose**: Cross-platform icon component with unified API
**Platforms**: Web, iOS, Android
**Source**: Feather Icons (https://github.com/feathericons/feather)

---

## Overview

The Icon component provides a unified API for displaying vector icons across web, iOS, and Android platforms. Icons automatically inherit text color from their parent component and support multiple size variants aligned with the 8px baseline grid.

**Key Features**:
- Type-safe icon names (TypeScript autocomplete)
- Automatic color inheritance from parent
- Multiple size variants (16, 24, 32, 40)
- Accessibility-compliant (hidden from screen readers)
- Cross-platform consistency

---

## Available Icons

The initial implementation includes 15 icons covering common UI patterns:

### Navigation Icons
- `arrow-right` - Right-pointing arrow
- `arrow-left` - Left-pointing arrow
- `arrow-up` - Up-pointing arrow
- `arrow-down` - Down-pointing arrow
- `chevron-right` - Right-pointing chevron

### Action Icons
- `check` - Checkmark/confirmation
- `x` - Close/cancel
- `plus` - Add/create
- `minus` - Remove/subtract

### UI Element Icons
- `circle` - Circle shape
- `heart` - Heart/favorite

### Complex Icons
- `settings` - Settings/configuration
- `user` - User profile
- `mail` - Email/message
- `calendar` - Calendar/date

---

## Size Variants

Icons support four size variants aligned with the 8px baseline grid:

| Size | Pixels | Use Case |
|------|--------|----------|
| 16 | 16px | Small UI elements, compact layouts, inline with small text |
| 24 | 24px | Standard UI elements, inline with body text (default) |
| 32 | 32px | Large UI elements, inline with headings |
| 40 | 40px | Extra large UI elements, inline with display text |

**Baseline Grid Alignment**: All sizes follow the 8px baseline grid for consistent vertical rhythm with typography and layout.

---

## Icon Naming Conventions

### Naming Rules

Icons follow platform-specific naming conventions to align with each platform's resource management requirements:

**Web & iOS**: `kebab-case` (lowercase with hyphens)
- **Format**: `word-word-word`
- **Examples**: `arrow-right`, `chevron-down`, `alert-circle`
- **Rationale**: 
  - Web uses kebab-case for CSS classes and file names
  - iOS Asset Catalog supports kebab-case for image set names (though camelCase is more common in iOS)
  - **Cross-platform consistency**: Using kebab-case for both web and iOS reduces cognitive load and naming errors
- **TypeScript**: Icon names in `IconName` type use kebab-case
- **Note**: While iOS typically uses camelCase, Asset Catalogs support kebab-case. This system prioritizes cross-platform naming consistency.

**Android**: `snake_case` (lowercase with underscores)
- **Format**: `word_word_word`
- **Examples**: `arrow_right`, `chevron_down`, `alert_circle`
- **Rationale**: Android resource naming convention **requires** lowercase letters, numbers, and underscores only (hyphens are not allowed)
- **Conversion**: Component implementation converts kebab-case to snake_case automatically for Android resources

### Cross-Platform Naming Examples

```typescript
// Web (TypeScript/React)
<Icon name="arrow-right" size={24} />
<Icon name="alert-circle" size={24} />
<Icon name="chevron-down" size={24} />
```

```swift
// iOS (SwiftUI)
Icon(name: "arrow-right", size: 24)
Icon(name: "alert-circle", size: 24)
Icon(name: "chevron-down", size: 24)
```

```kotlin
// Android (Jetpack Compose)
Icon(name = "arrow_right", size = 24.dp)
Icon(name = "alert_circle", size = 24.dp)
Icon(name = "chevron_down", size = 24.dp)
```

### IconName Type

The `IconName` type in `types.ts` defines all valid icon names for type safety:

```typescript
// src/components/core/Icon/types.ts
export type IconName = 
  // Navigation
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-down'
  | 'chevron-right'
  
  // Actions
  | 'check'
  | 'x'
  | 'plus'
  | 'minus'
  
  // UI Elements
  | 'circle'
  | 'heart'
  
  // Complex Icons
  | 'settings'
  | 'user'
  | 'mail'
  | 'calendar';
```

**Type Safety Benefits**:
- TypeScript autocomplete shows all available icons
- Compile-time errors for invalid icon names
- Prevents typos and missing icons
- Self-documenting API

### Adding New Icons

When adding new icons to the system, follow this process:

#### 1. Choose Descriptive Names

**Guidelines**:
- Use clear, action-oriented names (e.g., `arrow-right` not `right-arrow`)
- Follow Feather Icons naming conventions for consistency
- Use specific names over generic (e.g., `alert-circle` not just `alert`)
- Avoid abbreviations unless universally understood (e.g., `x` for close is acceptable)

**Good Examples**:
- `arrow-right` - Clear direction indicator
- `alert-circle` - Specific shape and purpose
- `chevron-down` - Specific chevron direction
- `check` - Clear action/state

**Bad Examples**:
- `right-arrow` - Inconsistent word order
- `alert` - Too generic (what shape?)
- `down` - Ambiguous (arrow? chevron? caret?)
- `chk` - Unclear abbreviation

#### 2. Update IconName Type

Add the new icon name to the `IconName` type in `types.ts`:

```typescript
// src/components/core/Icon/types.ts
export type IconName = 
  // ... existing icons
  | 'new-icon-name';  // Add new icon here
```

**Placement**: Add to appropriate category (Navigation, Actions, UI Elements, Complex Icons) or create new category if needed.

#### 3. Convert for All Platforms

Follow the icon conversion process documented in `.kiro/specs/004-icon-system/icon-conversion-guide.md`:

**Web**: 
- Optimize SVG from `icons-feather/` directory
- Remove class attribute, keep `stroke="currentColor"`
- Save to `src/components/core/Icon/platforms/web/assets/[icon-name].svg`

**iOS**:
- Import SVG to Asset Catalog (`Icons.xcassets/Icons/`)
- Set rendering mode to "Template Image"
- Verify icon renders correctly in Xcode preview

**Android**:
- Convert SVG to VectorDrawable using Android Studio
- Save to `src/components/core/Icon/platforms/android/res/drawable/[icon_name].xml`
- Verify icon renders correctly in Android Studio preview

#### 4. Update Documentation

Add the new icon to this README:

```markdown
### [Category Name]
- `new-icon-name` - Description of icon purpose
```

#### 5. Document Conversion

Add conversion details to `.kiro/specs/004-icon-system/icon-conversion-log.md`:

```markdown
## new-icon-name

**Source**: `icons-feather/new-icon-name.svg`
**Converted**: [Date]

### Web
- **Path**: `src/components/core/Icon/platforms/web/assets/new-icon-name.svg`
- **Issues**: [Any issues encountered]

### iOS
- **Path**: `Icons.xcassets/Icons/new-icon-name.imageset/`
- **Issues**: [Any issues encountered]

### Android
- **Path**: `res/drawable/new_icon_name.xml`
- **Issues**: [Any issues encountered]
```

### Naming Best Practices

**Consistency**:
- Follow existing naming patterns in the icon library
- Use same word order as similar icons (e.g., all arrows: `arrow-[direction]`)
- Maintain consistent specificity level

**Clarity**:
- Names should be self-explanatory without documentation
- Avoid ambiguous terms that could mean multiple things
- Use full words over abbreviations when possible

**Platform Compatibility**:
- Avoid special characters (only letters, numbers, hyphens/underscores)
- Keep names reasonably short (under 30 characters)
- Test that names work on all platforms before committing

---

## Usage Examples

### Web (React/TypeScript)

```tsx
import { Icon } from '@/components/core/Icon/platforms/web/Icon.web';

// Basic usage
<Icon name="arrow-right" size={24} />

// With button
<button>
  <Icon name="check" size={24} />
  <span>Confirm</span>
</button>

// Different sizes
<Icon name="settings" size={16} />  // Small
<Icon name="settings" size={24} />  // Standard
<Icon name="settings" size={32} />  // Large
<Icon name="settings" size={40} />  // Extra large

// Custom styling
<Icon 
  name="heart" 
  size={24} 
  className="custom-icon"
  style={{ color: 'red' }}
/>
```

### iOS (SwiftUI)

```swift
import SwiftUI

// Basic usage
Icon(name: "arrow-right", size: 24)

// With button
Button(action: confirmAction) {
    HStack {
        Icon(name: "check", size: 24)
        Text("Confirm")
    }
}

// Different sizes
Icon(name: "settings", size: 16)  // Small
Icon(name: "settings", size: 24)  // Standard
Icon(name: "settings", size: 32)  // Large
Icon(name: "settings", size: 40)  // Extra large

// Custom color (overrides inheritance)
Icon(name: "heart", size: 24)
    .foregroundColor(.red)
```

### Android (Jetpack Compose)

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp

// Basic usage
Icon(name = "arrow_right", size = 24.dp)

// With button
Button(onClick = confirmAction) {
    Row {
        Icon(name = "check", size = 24.dp)
        Text("Confirm")
    }
}

// Different sizes
Icon(name = "settings", size = 16.dp)  // Small
Icon(name = "settings", size = 24.dp)  // Standard
Icon(name = "settings", size = 32.dp)  // Large
Icon(name = "settings", size = 40.dp)  // Extra large

// Custom color (overrides inheritance)
Icon(
    name = "heart", 
    size = 24.dp,
    tint = Color.Red
)
```

---

## Color Inheritance and Override

Icons automatically inherit text color from their parent component by default, eliminating the need to manually specify icon colors in most cases. However, an optional color override is available for optical weight compensation when icons appear heavier than adjacent text.

### Default Color Inheritance

**Web**: Uses `stroke="currentColor"` in SVG
```tsx
// Button sets text color
<button style={{ color: '#3B82F6' }}>
  <Icon name="arrow-right" size={24} />  // Automatically blue
  <span>Next</span>
</button>
```

**iOS**: Uses template rendering mode with `.foregroundColor(.primary)`
```swift
// Button sets foreground color
Button(action: action) {
    HStack {
        Icon(name: "arrow-right", size: 24)  // Automatically matches text
        Text("Next")
    }
}
.foregroundColor(.blue)
```

**Android**: Uses `tint = LocalContentColor.current`
```kotlin
// Button provides content color
Button(
    onClick = onClick,
    colors = ButtonDefaults.buttonColors(contentColor = Color.Blue)
) {
    Row {
        Icon(name = "arrow_right", size = 24.dp)  // Automatically blue
        Text("Next")
    }
}
```

### Optional Color Override

The `color` prop allows explicit color specification for optical weight compensation. Icons have more visual weight than text at the same color due to stroke density, creating an optical illusion where icons appear heavier/darker than adjacent text.

**When to use color override:**
- Icon paired with text label (use lighter color for icon to balance optical weight)
- Icon needs specific semantic color (error, success, warning)
- Complex layouts where inheritance doesn't provide correct color

**When to use inheritance (default):**
- Icon is the only element (no text to balance)
- Icon and text should have identical color
- Simple button/link contexts where parent color is correct

### Color Override Examples

**Web**: Token reference or 'inherit'
```tsx
// Default - inherit from parent
<Icon name="arrow-right" size={24} />

// Explicit inheritance
<Icon name="arrow-right" size={24} color="inherit" />

// Optical weight compensation - lighter color for icon
<button style={{ color: 'var(--color-text-default)' }}>
  <Icon name="arrow-right" size={24} color="color-text-secondary" />
  <span>Continue</span>  // Darker text, lighter icon for balance
</button>
```

**iOS**: Color parameter or nil
```swift
// Default - inherit from environment
Icon(name: "arrow-right", size: 24)

// Explicit inheritance (nil = default)
Icon(name: "arrow-right", size: 24, color: nil)

// Optical weight compensation - lighter color for icon
Button(action: action) {
    HStack {
        Icon(name: "arrow-right", size: 24, color: .secondary)  // Lighter
        Text("Continue")  // Uses primary color (darker)
    }
}
```

**Android**: Color parameter or null
```kotlin
// Default - inherit from LocalContentColor
Icon(name = "arrow_right", size = 24.dp)

// Explicit inheritance (null = default)
Icon(name = "arrow_right", size = 24.dp, color = null)

// Optical weight compensation - lighter color for icon
Button(onClick = onClick) {
    Row {
        Icon(
            name = "arrow_right", 
            size = 24.dp, 
            color = MaterialTheme.colorScheme.secondary  // Lighter
        )
        Text("Continue")  // Uses primary color (darker)
    }
}
```

### Optical Weight Compensation Guide

Icons appear heavier than text at the same color due to stroke density. When pairing icons with text labels, consider using a lighter color for the icon to achieve visual balance.

**Visual Weight Comparison:**
```
Same Color:
[Icon: #000000] Continue  ← Icon appears heavier/darker
                           (optical illusion from stroke density)

Compensated:
[Icon: #666666] Continue  ← Balanced visual weight
                           (lighter icon color compensates for density)
```

**Recommended Approach:**
1. Start with color inheritance (default)
2. If icon appears too heavy next to text, use color override with a lighter token
3. Test with actual content and typography to verify balance
4. Use semantic color tokens (e.g., `color-text-secondary`) rather than arbitrary values

---

## Accessibility

Icons in this system are **decorative by default** and hidden from screen readers. This is appropriate when icons accompany text labels (e.g., buttons with both icon and text).

### Platform Implementation

**Web**: `aria-hidden="true"`
```tsx
<Icon name="check" size={24} />  // Hidden from screen readers
```

**iOS**: `.accessibilityHidden(true)`
```swift
Icon(name: "check", size: 24)  // Hidden from VoiceOver
```

**Android**: `contentDescription = null`
```kotlin
Icon(name = "check", size = 24.dp)  // Hidden from TalkBack
```

### Best Practices

✅ **DO**: Use icons with text labels
```tsx
<button>
  <Icon name="check" size={24} />
  <span>Confirm</span>  // Screen reader announces "Confirm"
</button>
```

❌ **DON'T**: Use icon-only buttons without accessible labels
```tsx
// Bad - no accessible label
<button>
  <Icon name="check" size={24} />
</button>
```

**Note**: For icon-only buttons, you'll need to add an accessible label using platform-specific techniques (aria-label, accessibilityLabel, contentDescription).

---

## Type Safety

The Icon component uses TypeScript to enforce type-safe icon names and sizes, catching errors at compile-time.

### IconName Type

```typescript
type IconName = 
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-down'
  | 'chevron-right'
  | 'check'
  | 'x'
  | 'plus'
  | 'minus'
  | 'circle'
  | 'heart'
  | 'settings'
  | 'user'
  | 'mail'
  | 'calendar';
```

### IconSize Type

```typescript
type IconSize = 16 | 24 | 32 | 40;
```

### Compile-Time Validation

```typescript
// ✅ Valid - compiles successfully
<Icon name="arrow-right" size={24} />

// ❌ Invalid - TypeScript error
<Icon name="arrow-rigt" size={24} />
// Error: Type '"arrow-rigt"' is not assignable to type 'IconName'

// ❌ Invalid - TypeScript error
<Icon name="check" size={25} />
// Error: Type '25' is not assignable to type 'IconSize'
```

---

## Platform-Specific Details

### Web

**Format**: Inline SVG
**Color**: `stroke="currentColor"`
**Accessibility**: `aria-hidden="true"`

Icons are rendered as inline SVG elements with optimized paths. The SVG uses `currentColor` for the stroke, enabling automatic color inheritance.

### iOS

**Format**: Image from Asset Catalog
**Color**: Template rendering mode with `.foregroundColor(.primary)`
**Accessibility**: `.accessibilityHidden(true)`

Icons are stored in the Asset Catalog as vector PDFs with template rendering mode enabled. This allows SwiftUI to tint the icon with the current foreground color.

### Android

**Format**: VectorDrawable
**Color**: `tint = LocalContentColor.current`
**Accessibility**: `contentDescription = null`

Icons are stored as VectorDrawable XML resources. Jetpack Compose applies the current content color as the tint, enabling automatic color inheritance.

---

## Future Enhancements

The following features are not in the initial implementation but may be added in future iterations:

### Additional Icons
- Expand from 15 icons to full Feather Icons library (280+ icons)
- Add custom icons specific to DesignerPunk design system

### Additional Sizes
- Add 4pt subgrid sizes (12, 20, 28, 36, 44, 48) as needed
- Component API already supports arbitrary sizes

### Advanced Features
- Icon rotation (90°, 180°, 270°)
- Icon animation support
- Custom color overrides (beyond inherited color)
- Icon composition (layered icons)

### Semantic Icons
- Icons with accessible labels (for icon-only buttons)
- Screen reader announcements for icon state
- Semantic icon roles (not just decorative)

---

## Related Documentation

- **Design Document**: `.kiro/specs/004-icon-system/design.md` - Architecture and design decisions
- **Requirements**: `.kiro/specs/004-icon-system/requirements.md` - Feature requirements and acceptance criteria
- **Type Definitions**: `src/components/core/Icon/types.ts` - TypeScript interfaces and types
- **Feather Icons**: https://github.com/feathericons/feather - Source icon library

---

## Testing

The Icon component includes focused tests validating component behavior:
- Core rendering (SVG generation, size attributes, all 15 icons)
- Color inheritance and override (currentColor, token references)
- Accessibility (aria-hidden, screen reader compatibility)
- Icon class API (update, getProps, render)
- Invalid icon handling (fallback to circle)

**Testing Philosophy**: Tests validate component behavior, not token calculations. Size validation will move to the token system tests when icon size tokens are implemented (Spec 006).

**Test Files**:
- `src/components/core/Icon/__tests__/Icon.test.ts` - Main test suite (19 tests)
- `src/components/core/Icon/platforms/web/__tests__/Icon.web.test.ts` - Web-specific tests (26 tests)

Run tests with:
```bash
npm test -- src/components/core/Icon
```

---

*This Icon component provides foundational infrastructure for displaying icons across web, iOS, and Android platforms with a unified, type-safe API.*
