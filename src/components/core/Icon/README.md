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

Icons support eight unique size variants calculated from the formula `fontSize × lineHeight`, ensuring perfect optical balance with their paired typography:

| Size | Pixels | Typography Pairing | Use Cases | 4pt Aligned |
|------|--------|-------------------|-----------|-------------|
| 13 | 13px | caption, legal, labelXs | Smallest text, fine print | ❌ |
| 18 | 18px | bodySm, buttonSm, labelSm | Compact layouts, small UI | ❌ |
| 24 | 24px | bodyMd, buttonMd, labelMd, input | Standard UI, body text (default) | ✅ |
| 28 | 28px | h6 | Smallest heading | ✅ |
| 32 | 32px | bodyLg, buttonLg, labelLg, h5, h4 | Large UI, medium headings | ✅ |
| 36 | 36px | h3 | Medium-large heading | ✅ |
| 40 | 40px | h2 | Large heading | ✅ |
| 44 | 44px | h1 | Primary heading | ✅ |
| 48 | 48px | display | Hero text, display | ✅ |

### Icon Size Formula

Icon sizes are calculated using the formula:

```
iconSize = fontSize × lineHeight (rounded to nearest integer)
```

**Example**: For bodyMd typography:
- fontSize100 = 16px
- lineHeight100 = 1.5
- icon.size100 = 16 × 1.5 = 24px

This formula ensures icons fill the vertical space of their paired text lines, creating perfect optical balance where icons and text have equal visual weight in composition.

### 4pt Subgrid Alignment

Most icon sizes (7 of 8) align with the 4pt subgrid through lineHeight precision targeting. The two smallest sizes (13px, 18px) are exceptions where optical balance with small text takes priority over strict grid alignment.

**Aligned Sizes**: 24, 28, 32, 36, 40, 44, 48 (all divisible by 4)
**Non-Aligned Sizes**: 13, 18 (smallest sizes, alignment trade-off acceptable)

### Core vs Available Sizes

While all 8 unique icon sizes are available, most use cases cluster around 5 core sizes that cover 90% of typical UI scenarios. The remaining sizes are available for edge cases and specialized contexts.

#### Core Sizes (90% of use cases)

These sizes cover the majority of UI patterns and should be your default choices:

**18px (icon.size075)** - Small UI Elements
- **Typography Pairing**: bodySm, buttonSm, labelSm
- **Use Cases**: 
  - Compact buttons and controls
  - Dense data tables and lists
  - Small form inputs and labels
  - Mobile-optimized interfaces
  - Toolbar icons in constrained spaces
- **When to Use**: When space is limited or you need a more subtle icon presence
- **Example**: Small "Add" button in a compact toolbar

**24px (icon.size100)** - Standard UI (Most Common)
- **Typography Pairing**: bodyMd, buttonMd, labelMd, input
- **Use Cases**:
  - Standard buttons and interactive elements
  - Body text with inline icons
  - Form inputs and labels
  - Navigation elements
  - Default icon size for most components
- **When to Use**: This is the default size - use it when in doubt
- **Example**: "Confirm" button with checkmark icon, search input with magnifying glass

**32px (icon.size125/200/300)** - Large UI Elements
- **Typography Pairing**: bodyLg, buttonLg, labelLg, h5, h4
- **Use Cases**:
  - Large buttons and prominent CTAs
  - Medium heading decorations
  - Feature cards and panels
  - Large form controls
  - Dashboard widgets
- **When to Use**: When you need more visual prominence or are pairing with larger text
- **Example**: Primary CTA button, feature card with icon

**36px (icon.size400)** - Medium-Large Headings
- **Typography Pairing**: h3
- **Use Cases**:
  - Section headings with icons
  - Card headers with decorative icons
  - Modal/dialog titles
  - Feature highlights
- **When to Use**: When pairing with h3 headings or need strong visual presence
- **Example**: Settings section header with gear icon

**40px (icon.size500)** - Large Headings
- **Typography Pairing**: h2
- **Use Cases**:
  - Page section headings
  - Large feature callouts
  - Marketing content headers
  - Prominent status indicators
- **When to Use**: When pairing with h2 headings or creating focal points
- **Example**: "Welcome" page header with decorative icon

#### Available Sizes (10% of use cases)

These sizes are available for specialized contexts and edge cases:

**13px (icon.size050)** - Smallest Text
- **Typography Pairing**: caption, legal, labelXs
- **Use Cases**:
  - Fine print with icons
  - Legal disclaimers
  - Extremely compact UI (use sparingly)
  - Metadata indicators
- **When to Use**: Only when pairing with the smallest text sizes
- **Caution**: Very small icons may have accessibility concerns - use sparingly
- **Example**: Copyright notice with icon, tiny status indicator

**28px (icon.size150)** - Smallest Headings
- **Typography Pairing**: h6
- **Use Cases**:
  - h6 heading decorations
  - Subsection headers
  - Card subheadings
- **When to Use**: Specifically when pairing with h6 headings
- **Note**: h6 is less commonly used than other heading levels
- **Example**: Card subsection header with icon

**44px (icon.size600)** - Primary Headings
- **Typography Pairing**: h1
- **Use Cases**:
  - Page titles with icons
  - Hero section headings
  - Major feature announcements
- **When to Use**: When pairing with h1 headings
- **Note**: h1 headings are typically used once per page
- **Example**: Landing page hero title with icon

**48px (icon.size700)** - Display Text
- **Typography Pairing**: display
- **Use Cases**:
  - Hero sections
  - Marketing splash pages
  - Large promotional content
  - Empty states with large icons
- **When to Use**: Only for hero/display typography contexts
- **Note**: Display typography is used sparingly for maximum impact
- **Example**: Marketing hero section with large decorative icon

#### Size Selection Guidelines

**Start with Core Sizes**: Begin with the 5 core sizes (18, 24, 32, 36, 40) for 90% of your UI needs.

**Use Available Sizes Intentionally**: Only reach for the available sizes (13, 28, 44, 48) when you have a specific typography pairing or specialized use case.

**Default to 24px**: When in doubt, use 24px - it pairs with bodyMd, the most common typography style.

**Match Typography Context**: Always consider what typography the icon is paired with and use the corresponding icon size.

**Consider Visual Hierarchy**: Larger icons create stronger visual hierarchy - use intentionally to guide user attention.

**Test Accessibility**: Very small icons (13px) and very large icons (48px) should be tested for accessibility and usability.

#### Common Mistakes to Avoid

❌ **Using 48px for standard buttons** - Too large, creates visual imbalance
✅ **Use 24px or 32px for buttons** - Appropriate scale for interactive elements

❌ **Using 13px for primary actions** - Too small, accessibility concerns
✅ **Use 24px or larger for primary actions** - Ensures visibility and usability

❌ **Mixing sizes arbitrarily** - Creates visual inconsistency
✅ **Match icon size to typography pairing** - Maintains optical balance

❌ **Using available sizes as defaults** - Overcomplicates size decisions
✅ **Start with core sizes** - Covers 90% of use cases

#### Quick Reference: Size Selection Decision Tree

```
Need an icon size?
├─ Pairing with text?
│  ├─ Yes → Use size matching typography's line height
│  │  ├─ bodySm/buttonSm → 18px
│  │  ├─ bodyMd/buttonMd → 24px (most common)
│  │  ├─ bodyLg/buttonLg → 32px
│  │  ├─ h6 → 28px
│  │  ├─ h5/h4 → 32px
│  │  ├─ h3 → 36px
│  │  ├─ h2 → 40px
│  │  ├─ h1 → 44px
│  │  └─ display → 48px
│  └─ No → Consider context
│     ├─ Standard UI → 24px (default)
│     ├─ Compact UI → 18px
│     ├─ Prominent UI → 32px or 36px
│     └─ Hero/Display → 40px or 48px
└─ When in doubt → 24px (bodyMd pairing)
```

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
<Icon name="settings" size={13} />  // Smallest (caption text)
<Icon name="settings" size={18} />  // Small (bodySm)
<Icon name="settings" size={24} />  // Standard (bodyMd, default)
<Icon name="settings" size={28} />  // h6 heading
<Icon name="settings" size={32} />  // Large (bodyLg, h5, h4)
<Icon name="settings" size={36} />  // h3 heading
<Icon name="settings" size={40} />  // h2 heading
<Icon name="settings" size={44} />  // h1 heading
<Icon name="settings" size={48} />  // Display text

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
Icon(name: "settings", size: 13)  // Smallest (caption text)
Icon(name: "settings", size: 18)  // Small (bodySm)
Icon(name: "settings", size: 24)  // Standard (bodyMd, default)
Icon(name: "settings", size: 28)  // h6 heading
Icon(name: "settings", size: 32)  // Large (bodyLg, h5, h4)
Icon(name: "settings", size: 36)  // h3 heading
Icon(name: "settings", size: 40)  // h2 heading
Icon(name: "settings", size: 44)  // h1 heading
Icon(name: "settings", size: 48)  // Display text

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
Icon(name = "settings", size = 13.dp)  // Smallest (caption text)
Icon(name = "settings", size = 18.dp)  // Small (bodySm)
Icon(name = "settings", size = 24.dp)  // Standard (bodyMd, default)
Icon(name = "settings", size = 28.dp)  // h6 heading
Icon(name = "settings", size = 32.dp)  // Large (bodyLg, h5, h4)
Icon(name = "settings", size = 36.dp)  // h3 heading
Icon(name = "settings", size = 40.dp)  // h2 heading
Icon(name = "settings", size = 44.dp)  // h1 heading
Icon(name = "settings", size = 48.dp)  // Display text

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
type IconSize = 13 | 18 | 24 | 28 | 32 | 36 | 40 | 44 | 48;
```

**Derived from Icon Size Tokens**: The IconSize type is automatically derived from icon size tokens calculated using the `fontSize × lineHeight` formula. This ensures type safety matches the mathematically-derived sizes.

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

### Icon Size Tokens (Spec 006)
- ✅ **Implemented**: Icon sizes now calculated from `fontSize × lineHeight` formula
- ✅ **Implemented**: 8 unique sizes (13, 18, 24, 28, 32, 36, 40, 44, 48)
- ✅ **Implemented**: Typography pairing for all sizes
- ✅ **Implemented**: 4pt subgrid alignment through lineHeight precision targeting
- Future: Icon size token references in component API (currently uses numeric literals)
- Future: Semantic icon size tokens (icon.size050, icon.size100, etc.)

### Advanced Features
- Icon rotation (90°, 180°, 270°)
- Icon animation support
- Icon composition (layered icons)
- Additional icon token types (icon.color.*, icon.spacing.*, icon.stroke.*)

### Semantic Icons
- Icons with accessible labels (for icon-only buttons)
- Screen reader announcements for icon state
- Semantic icon roles (not just decorative)

---

## AI Agent Reasoning for Icon Size Selection

This section provides comprehensive guidance for AI agents on how to select appropriate icon sizes based on typography context, with detailed reasoning paths, calculation examples, and adaptability scenarios.

### Core Reasoning Path

When selecting an icon size, follow this systematic reasoning path:

1. **Identify the typography context**: What typography style is the icon paired with?
2. **Find the fontSize and lineHeight**: Look up the primitive tokens used by that typography
3. **Calculate the icon size**: Use the formula `fontSize × lineHeight` (rounded to nearest integer)
4. **Select the matching icon size**: Use the calculated size
5. **Verify optical balance**: Ensure icon fills the line height space of the text

### Formula Breakdown

The icon size formula is: **`iconSize = fontSize × lineHeight`** (rounded to nearest integer)

**Why this formula?**
- **fontSize**: Defines the text size (e.g., 16px for bodyMd)
- **lineHeight**: Defines the vertical space the text occupies (e.g., 1.5 for bodyMd)
- **Product**: Gives the actual line height in pixels (16 × 1.5 = 24px)
- **Icon size**: Should match this line height to fill the vertical space

**Rounding behavior**:
- Use standard rounding: 0.5 and above rounds up, below 0.5 rounds down
- Example: 17.5 → 18, 17.4 → 17, 35.989 → 36

### Detailed Calculation Examples

#### Example 1: Icon Next to Body Text

**Task**: "Add an icon next to body text"

**Step-by-step reasoning**:
1. **Identify typography**: Body text uses `typography.bodyMd`
2. **Look up primitives**: 
   - `typography.bodyMd` references `fontSize100` and `lineHeight100`
   - `fontSize100` = 16px (base value)
   - `lineHeight100` = 1.5 (ratio)
3. **Calculate icon size**:
   - Formula: `fontSize × lineHeight`
   - Calculation: 16 × 1.5 = 24
   - Rounding: 24 is already an integer
4. **Select icon size**: 24px
5. **Verify**: Icon (24px) fills the line height space of bodyMd text (24px)

**Result**: Use `size={24}` (icon.size100)

**Code example**:
```tsx
// Web
<p style={{ font: 'var(--typography-body-md)' }}>
  <Icon name="check" size={24} />
  <span>Confirmed</span>
</p>
```

#### Example 2: Icon in Button with Small Text

**Task**: "Add an icon to a small button"

**Step-by-step reasoning**:
1. **Identify typography**: Small button uses `typography.buttonSm`
2. **Look up primitives**:
   - `typography.buttonSm` references `fontSize075` and `lineHeight075`
   - `fontSize075` = 14px
   - `lineHeight075` = 1.25
3. **Calculate icon size**:
   - Formula: `fontSize × lineHeight`
   - Calculation: 14 × 1.25 = 17.5
   - Rounding: 17.5 → 18 (rounds up)
4. **Select icon size**: 18px
5. **Verify**: Icon (18px) fills the line height space of buttonSm text (18px)

**Result**: Use `size={18}` (icon.size075)

**Code example**:
```tsx
// Web
<button style={{ font: 'var(--typography-button-sm)' }}>
  <Icon name="plus" size={18} />
  <span>Add</span>
</button>
```

#### Example 3: Icon Next to Heading

**Task**: "Add an icon next to an h3 heading"

**Step-by-step reasoning**:
1. **Identify typography**: h3 heading uses `typography.h3`
2. **Look up primitives**:
   - `typography.h3` references `fontSize400` and `lineHeight400`
   - `fontSize400` = 29px
   - `lineHeight400` = 1.241
3. **Calculate icon size**:
   - Formula: `fontSize × lineHeight`
   - Calculation: 29 × 1.241 = 35.989
   - Rounding: 35.989 → 36 (rounds up)
4. **Select icon size**: 36px
5. **Verify**: Icon (36px) fills the line height space of h3 text (36px)

**Result**: Use `size={36}` (icon.size400)

**Code example**:
```tsx
// Web
<h3 style={{ font: 'var(--typography-h3)' }}>
  <Icon name="settings" size={36} />
  <span>Settings</span>
</h3>
```

#### Example 4: Icon with Caption Text

**Task**: "Add an icon to a caption"

**Step-by-step reasoning**:
1. **Identify typography**: Caption uses `typography.caption`
2. **Look up primitives**:
   - `typography.caption` references `fontSize050` and `lineHeight050`
   - `fontSize050` = 13px
   - `lineHeight050` = 1.0
3. **Calculate icon size**:
   - Formula: `fontSize × lineHeight`
   - Calculation: 13 × 1.0 = 13
   - Rounding: 13 is already an integer
4. **Select icon size**: 13px
5. **Verify**: Icon (13px) fills the line height space of caption text (13px)

**Result**: Use `size={13}` (icon.size050)

**Code example**:
```tsx
// Web
<p style={{ font: 'var(--typography-caption)' }}>
  <Icon name="circle" size={13} />
  <span>Required field</span>
</p>
```

#### Example 5: Icon with Display Text

**Task**: "Add an icon to hero display text"

**Step-by-step reasoning**:
1. **Identify typography**: Display text uses `typography.display`
2. **Look up primitives**:
   - `typography.display` references `fontSize700` and `lineHeight700`
   - `fontSize700` = 42px
   - `lineHeight700` = 1.143
3. **Calculate icon size**:
   - Formula: `fontSize × lineHeight`
   - Calculation: 42 × 1.143 = 48.006
   - Rounding: 48.006 → 48 (rounds down)
4. **Select icon size**: 48px
5. **Verify**: Icon (48px) fills the line height space of display text (48px)

**Result**: Use `size={48}` (icon.size700)

**Code example**:
```tsx
// Web
<h1 style={{ font: 'var(--typography-display)' }}>
  <Icon name="heart" size={48} />
  <span>Welcome</span>
</h1>
```

### Typography Pairing Quick Reference

This table provides quick lookup for AI agents to map typography styles to icon sizes:

| Typography Style | fontSize | lineHeight | Calculation | Icon Size | Token Reference |
|-----------------|----------|------------|-------------|-----------|-----------------|
| caption, legal, labelXs | 13 | 1.0 | 13 × 1.0 = 13 | 13px | icon.size050 |
| bodySm, buttonSm, labelSm | 14 | 1.25 | 14 × 1.25 = 18 | 18px | icon.size075 |
| bodyMd, buttonMd, labelMd, input | 16 | 1.5 | 16 × 1.5 = 24 | 24px | icon.size100 |
| h6 | 20 | 1.4 | 20 × 1.4 = 28 | 28px | icon.size150 |
| bodyLg, buttonLg, labelLg | 18 | 1.75 | 18 × 1.75 = 32 | 32px | icon.size125 |
| h5 | 23 | 1.391 | 23 × 1.391 = 32 | 32px | icon.size200 |
| h4 | 26 | 1.231 | 26 × 1.231 = 32 | 32px | icon.size300 |
| h3 | 29 | 1.241 | 29 × 1.241 = 36 | 36px | icon.size400 |
| h2 | 33 | 1.212 | 33 × 1.212 = 40 | 40px | icon.size500 |
| h1 | 37 | 1.19 | 37 × 1.19 = 44 | 44px | icon.size600 |
| display | 42 | 1.143 | 42 × 1.143 = 48 | 48px | icon.size700 |

### Adaptability Scenarios

The formula enables automatic adaptation when typography scales change. Here are scenarios demonstrating this adaptability:

#### Scenario 1: fontSize Changes

**Initial state**:
- `fontSize100` = 16px
- `lineHeight100` = 1.5
- `icon.size100` = 16 × 1.5 = 24px

**Change**: Design system updates `fontSize100` from 16px to 18px

**Automatic recalculation**:
- `fontSize100` = 18px (new value)
- `lineHeight100` = 1.5 (unchanged)
- `icon.size100` = 18 × 1.5 = 27px (automatically recalculated)

**Result**: Icon size adapts from 24px to 27px without manual updates. Optical balance is preserved because the icon still fills the line height space of the text.

**AI agent reasoning**: "The fontSize changed, so I need to recalculate the icon size using the new fontSize value. The formula ensures the icon continues to match the text's line height."

#### Scenario 2: lineHeight Changes

**Initial state**:
- `fontSize100` = 16px
- `lineHeight100` = 1.5
- `icon.size100` = 16 × 1.5 = 24px

**Change**: Design system updates `lineHeight100` from 1.5 to 1.6 for better readability

**Automatic recalculation**:
- `fontSize100` = 16px (unchanged)
- `lineHeight100` = 1.6 (new value)
- `icon.size100` = 16 × 1.6 = 25.6 → 26px (automatically recalculated and rounded)

**Result**: Icon size adapts from 24px to 26px without manual updates. The icon continues to fill the increased line height space.

**AI agent reasoning**: "The lineHeight changed, so I need to recalculate the icon size using the new lineHeight value. The formula ensures the icon continues to fill the text's line height space."

#### Scenario 3: Both fontSize and lineHeight Change

**Initial state**:
- `fontSize100` = 16px
- `lineHeight100` = 1.5
- `icon.size100` = 16 × 1.5 = 24px

**Change**: Design system updates both values for a new typographic scale

**Automatic recalculation**:
- `fontSize100` = 18px (new value)
- `lineHeight100` = 1.4 (new value)
- `icon.size100` = 18 × 1.4 = 25.2 → 25px (automatically recalculated and rounded)

**Result**: Icon size adapts from 24px to 25px, reflecting both changes. Optical balance is maintained through the mathematical relationship.

**AI agent reasoning**: "Both fontSize and lineHeight changed, so I need to recalculate the icon size using both new values. The formula ensures the icon adapts to the new typography scale while maintaining optical balance."

#### Scenario 4: New Typography Style Added

**Task**: Design system adds a new typography style `bodyXl`

**New typography definition**:
- `typography.bodyXl` uses `fontSize150` (20px) and `lineHeight150` (1.4)

**Icon size calculation**:
- Formula: `fontSize × lineHeight`
- Calculation: 20 × 1.4 = 28
- Result: Use `icon.size150` (28px)

**AI agent reasoning**: "A new typography style was added. I can calculate the appropriate icon size using the formula with the new fontSize and lineHeight values. No manual icon size definition needed - the formula provides the answer."

### Decision Tree for AI Agents

Use this decision tree when selecting icon sizes:

```
Need to select an icon size?
│
├─ Is the icon paired with text?
│  │
│  ├─ YES → Follow typography pairing
│  │  │
│  │  ├─ Identify typography style (bodyMd, buttonSm, h3, etc.)
│  │  ├─ Look up fontSize and lineHeight for that style
│  │  ├─ Calculate: fontSize × lineHeight (rounded)
│  │  └─ Use calculated size
│  │
│  └─ NO → Consider context
│     │
│     ├─ Icon-only button → Use button size that would be used with text
│     ├─ Decorative icon → Use size matching surrounding text's line height
│     ├─ Unknown context → Default to 24px (bodyMd pairing)
│     └─ Complex layout → Ask for clarification or default to 24px
│
└─ Unsure about typography context?
   │
   ├─ Check component type:
   │  ├─ Button → Use button typography (buttonSm/Md/Lg)
   │  ├─ Heading → Use heading typography (h1-h6)
   │  ├─ Body text → Use body typography (bodySm/Md/Lg)
   │  └─ Label → Use label typography (labelSm/Md/Lg)
   │
   └─ Still unsure? → Default to 24px (most common)
```

### Common AI Agent Mistakes to Avoid

#### Mistake 1: Using fontSize Instead of Line Height

❌ **Wrong reasoning**:
```
bodyMd uses fontSize100 (16px)
Therefore, icon should be 16px
```

✅ **Correct reasoning**:
```
bodyMd uses fontSize100 (16px) and lineHeight100 (1.5)
Line height = 16 × 1.5 = 24px
Therefore, icon should be 24px to fill the line height space
```

**Why this matters**: Icons need to fill the vertical space of the text line (line height), not just match the font size. Using font size creates visual imbalance.

#### Mistake 2: Forgetting to Round

❌ **Wrong reasoning**:
```
buttonSm: 14 × 1.25 = 17.5
Use size={17.5}
```

✅ **Correct reasoning**:
```
buttonSm: 14 × 1.25 = 17.5
Round to nearest integer: 17.5 → 18
Use size={18}
```

**Why this matters**: Icon sizes must be integers. Fractional pixel values don't render correctly.

#### Mistake 3: Ignoring Typography Context

❌ **Wrong reasoning**:
```
User wants an icon in a button
Use size={24} (default)
```

✅ **Correct reasoning**:
```
User wants an icon in a button
What size button? (small, medium, large)
If buttonSm → 18px
If buttonMd → 24px
If buttonLg → 32px
```

**Why this matters**: Different button sizes use different typography, requiring different icon sizes for optical balance.

#### Mistake 4: Not Considering Adaptability

❌ **Wrong reasoning**:
```
bodyMd currently uses 16px font
Icon should always be 24px
```

✅ **Correct reasoning**:
```
bodyMd currently uses fontSize100 (16px) × lineHeight100 (1.5) = 24px
If fontSize100 changes to 18px, icon size becomes 18 × 1.5 = 27px
The formula ensures automatic adaptation
```

**Why this matters**: Hard-coding sizes breaks when typography scales change. The formula maintains the relationship.

### Formula Validation Checklist

When calculating icon sizes, verify:

- [ ] Identified the correct typography style
- [ ] Looked up both fontSize AND lineHeight (not just fontSize)
- [ ] Multiplied fontSize × lineHeight
- [ ] Rounded to nearest integer
- [ ] Verified the result matches an available icon size (13, 18, 24, 28, 32, 36, 40, 44, 48)
- [ ] Confirmed the icon will fill the line height space of the text

### When to Ask for Clarification

AI agents should ask for clarification when:

1. **Typography context is ambiguous**: "Should this icon pair with bodyMd or bodyLg text?"
2. **Multiple typography styles possible**: "Is this a small, medium, or large button?"
3. **Icon-only context**: "What typography would be used if text were present?"
4. **Complex layouts**: "Which text element should this icon align with?"
5. **Edge cases**: "This context doesn't match any standard typography pairing"

**Example clarification request**:
```
"I need to add an icon to a button, but I'm not sure which button size to use.
Should this be:
- Small button (18px icon, buttonSm typography)
- Medium button (24px icon, buttonMd typography)
- Large button (32px icon, buttonLg typography)

Could you clarify the button size?"
```

---

## Typography Pairing

Icons are designed to pair with typography, creating visual harmony through mathematical relationships. This section explains how icon sizes relate to typography styles and provides practical examples for common use cases.

### Typography Pairing Table

The following table maps each icon size to its paired typography styles, showing the mathematical relationship and common use cases:

| Icon Size | Typography Styles | fontSize | lineHeight | Formula | Use Cases |
|-----------|------------------|----------|------------|---------|-----------|
| **13px** | caption, legal, labelXs | 13px | 1.0 | 13 × 1.0 = 13 | Fine print, legal text, smallest labels |
| **18px** | bodySm, buttonSm, labelSm | 14px | 1.25 | 14 × 1.25 = 18 | Compact UI, small buttons, dense layouts |
| **24px** | bodyMd, buttonMd, labelMd, input | 16px | 1.5 | 16 × 1.5 = 24 | Standard UI, body text, default buttons |
| **28px** | h6 | 20px | 1.4 | 20 × 1.4 = 28 | Smallest heading level |
| **32px** | bodyLg, buttonLg, labelLg, h5, h4 | varies | varies | varies | Large UI elements, medium headings |
| **36px** | h3 | 29px | 1.241 | 29 × 1.241 = 36 | Medium-large headings |
| **40px** | h2 | 33px | 1.212 | 33 × 1.212 = 40 | Large headings |
| **44px** | h1 | 37px | 1.19 | 37 × 1.19 = 44 | Primary page headings |
| **48px** | display | 42px | 1.143 | 42 × 1.143 = 48 | Hero text, display typography |

### Icon + Text Pairing Examples

These examples demonstrate how icons pair with text across different typography styles and platforms:

#### Example 1: Standard Button (24px icon with bodyMd text)

**Web**:
```tsx
<button style={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: '8px',
  font: 'var(--typography-body-md)'
}}>
  <Icon name="check" size={24} />
  <span>Confirm</span>
</button>
```

**Visual Result**:
```
[✓ 24px] Confirm (16px text, 24px line height)
         ↑
         Icon fills the line height space
```

**Why this works**: The icon (24px) exactly matches the line height of bodyMd text (16px × 1.5 = 24px), creating perfect optical balance.

#### Example 2: Small Button (18px icon with buttonSm text)

**Web**:
```tsx
<button style={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: '6px',
  font: 'var(--typography-button-sm)'
}}>
  <Icon name="plus" size={18} />
  <span>Add Item</span>
</button>
```

**iOS**:
```swift
Button(action: addItem) {
    HStack(spacing: 6) {
        Icon(name: "plus", size: 18)
        Text("Add Item")
            .font(typographyButtonSm)
    }
}
```

**Visual Result**:
```
[+ 18px] Add Item (14px text, 18px line height)
        ↑
        Icon fills the line height space
```

**Why this works**: The icon (18px) matches the line height of buttonSm text (14px × 1.25 = 18px), maintaining optical balance in compact layouts.

#### Example 3: Large Button (32px icon with buttonLg text)

**Android**:
```kotlin
Button(onClick = { /* action */ }) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(name = "arrow_right", size = 32.dp)
        Text(
            text = "Continue",
            style = typographyButtonLg
        )
    }
}
```

**Visual Result**:
```
[→ 32px] Continue (varies, 32px line height)
         ↑
         Icon fills the line height space
```

**Why this works**: The icon (32px) matches the line height of buttonLg text, creating visual harmony in large interactive elements.

#### Example 4: Heading with Icon (36px icon with h3 text)

**Web**:
```tsx
<h3 style={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: '12px',
  font: 'var(--typography-h3)'
}}>
  <Icon name="settings" size={36} />
  <span>Settings</span>
</h3>
```

**Visual Result**:
```
[⚙ 36px] Settings (29px text, 36px line height)
         ↑
         Icon fills the line height space
```

**Why this works**: The icon (36px) matches the line height of h3 text (29px × 1.241 = 36px), maintaining visual hierarchy in headings.

#### Example 5: Caption with Icon (13px icon with caption text)

**Web**:
```tsx
<p style={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: '4px',
  font: 'var(--typography-caption)'
}}>
  <Icon name="circle" size={13} />
  <span>Required field</span>
</p>
```

**Visual Result**:
```
[● 13px] Required field (13px text, 13px line height)
         ↑
         Icon fills the line height space
```

**Why this works**: The icon (13px) matches the line height of caption text (13px × 1.0 = 13px), maintaining balance even at the smallest size.

### Optical Balance Rationale

Icons and text achieve optical balance when they have **equal visual weight** in composition. This balance is achieved through the `fontSize × lineHeight` formula, which ensures icons fill the vertical space of their paired text lines.

#### Why Icons Fill Line Height Space

**Line Height Defines Vertical Space**:
- Text occupies a line height box, not just the font size
- Example: bodyMd text (16px font) occupies 24px vertical space (16px × 1.5)
- Icons should fill this same 24px space to match the text's visual presence

**Visual Weight Comparison**:

```
Icon matches font size (16px):
[→ 16px] Continue (16px text in 24px line height)
         ↑
         Icon appears too small - doesn't fill vertical space

Icon matches line height (24px):
[→ 24px] Continue (16px text in 24px line height)
         ↑
         Icon fills vertical space - balanced visual weight
```

**Why This Creates Balance**:
1. **Vertical Alignment**: Icon and text occupy the same vertical space
2. **Visual Presence**: Icon has equal visual weight to the text block
3. **Optical Harmony**: Neither element dominates the composition
4. **Consistent Rhythm**: Maintains baseline grid alignment

#### The Problem with Font Size Matching

If icons matched font size instead of line height:

```
bodyMd: 16px font, 24px line height
Icon: 16px (matches font size)

Visual Result:
[→ 16px] Continue
         ↑
         Icon appears too small
         8px of empty space above/below icon
         Text visually dominates
```

**Issues**:
- Icon appears undersized relative to text block
- Empty space around icon breaks visual rhythm
- Text dominates the composition
- Inconsistent visual weight across different typography styles

#### The Solution: Line Height Matching

Icons match line height, not font size:

```
bodyMd: 16px font, 24px line height
Icon: 24px (matches line height)

Visual Result:
[→ 24px] Continue
         ↑
         Icon fills vertical space
         Equal visual weight with text
         Balanced composition
```

**Benefits**:
- Icon fills the vertical space of the text line
- Equal visual weight between icon and text
- Consistent optical balance across all typography styles
- Maintains baseline grid alignment through lineHeight precision targeting

### Mathematical Consistency Across Typography Styles

The formula ensures consistent optical balance regardless of typography style:

**Small Text (bodySm)**:
- fontSize: 14px, lineHeight: 1.25
- Icon size: 14 × 1.25 = 18px
- Result: Icon fills 18px line height space

**Standard Text (bodyMd)**:
- fontSize: 16px, lineHeight: 1.5
- Icon size: 16 × 1.5 = 24px
- Result: Icon fills 24px line height space

**Large Text (h2)**:
- fontSize: 33px, lineHeight: 1.212
- Icon size: 33 × 1.212 = 40px
- Result: Icon fills 40px line height space

**Consistency**: In all cases, the icon fills the line height space, maintaining optical balance regardless of text size.

### Adaptability Through Mathematical Relationships

The formula enables automatic adaptation when typography scales change:

**Scenario**: Design system updates fontSize100 from 16px to 18px

**Before**:
- bodyMd: fontSize100 (16px) × lineHeight100 (1.5) = 24px line height
- Icon: 24px (matches line height)

**After**:
- bodyMd: fontSize100 (18px) × lineHeight100 (1.5) = 27px line height
- Icon: 27px (automatically recalculated)

**Result**: Optical balance is preserved without manual updates. The mathematical relationship ensures icons always match their paired typography's line height.

### Practical Guidelines

**When Pairing Icons with Text**:
1. Identify the typography style (bodyMd, buttonSm, h3, etc.)
2. Use the icon size that matches that typography's line height
3. The formula handles the calculation: `fontSize × lineHeight`
4. Trust the mathematical relationship for optical balance

**Common Pairings**:
- **Buttons**: Use button typography size (buttonSm → 18px, buttonMd → 24px, buttonLg → 32px)
- **Body Text**: Use body typography size (bodySm → 18px, bodyMd → 24px, bodyLg → 32px)
- **Headings**: Use heading typography size (h6 → 28px, h3 → 36px, h2 → 40px, h1 → 44px)
- **Labels**: Use label typography size (labelSm → 18px, labelMd → 24px, labelLg → 32px)

**Edge Cases**:
- **Icon-only buttons**: Use the button size that would be used if text were present
- **Decorative icons**: Use the size that matches surrounding text's line height
- **Complex layouts**: Default to 24px (bodyMd pairing) if context is unclear

### When Typography Context is Unknown

If the typography context is not specified:
- **Default to 24px** (bodyMd pairing) - most common use case
- **Ask for clarification** if the icon is in a specific context (button, heading, etc.)
- **Consider the component type**: Buttons typically use button typography, headings use heading typography

### Adaptability Reasoning

The formula enables automatic adaptation:
- If `fontSize100` changes from 16px to 18px, icon.size100 automatically becomes 27px (18 × 1.5)
- If `lineHeight100` changes from 1.5 to 1.6, icon.size100 automatically becomes 26px (16 × 1.6)
- No manual updates needed - the mathematical relationship is preserved

---

## Related Documentation

### Icon System (Spec 004)
- **Design Document**: `.kiro/specs/004-icon-system/design.md` - Architecture and design decisions
- **Requirements**: `.kiro/specs/004-icon-system/requirements.md` - Feature requirements and acceptance criteria
- **Type Definitions**: `src/components/core/Icon/types.ts` - TypeScript interfaces and types
- **Feather Icons**: https://github.com/feathericons/feather - Source icon library

### Icon Size Tokens (Spec 006)
- **Design Document**: `.kiro/specs/006-icon-size-tokens/design.md` - Icon size token architecture and formula
- **Requirements**: `.kiro/specs/006-icon-size-tokens/requirements.md` - Icon size token requirements
- **Implementation**: `src/tokens/semantic/IconTokens.ts` - Icon size token definitions
- **Formula**: `iconSize = fontSize × lineHeight` (rounded to nearest integer)

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
