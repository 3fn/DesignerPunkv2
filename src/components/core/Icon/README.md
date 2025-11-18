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

### Cross-Platform Naming

Icons use consistent naming across platforms with platform-specific formatting:

**Web & iOS**: `kebab-case`
```typescript
// Web
<Icon name="arrow-right" size={24} />

// iOS
Icon(name: "arrow-right", size: 24)
```

**Android**: `snake_case` (resource naming convention)
```kotlin
// Android
Icon(name = "arrow_right", size = 24.dp)
```

### Adding New Icons

When adding new icons to the system:

1. **Choose descriptive names**: Use clear, action-oriented names (e.g., `arrow-right` not `right-arrow`)
2. **Follow Feather Icons naming**: Maintain consistency with source library
3. **Update IconName type**: Add new icon name to `types.ts`
4. **Convert for all platforms**: Follow conversion process in design document
5. **Update this README**: Add icon to appropriate category above

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

## Color Inheritance

Icons automatically inherit text color from their parent component, eliminating the need to manually specify icon colors in most cases.

### How It Works

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

*This Icon component provides foundational infrastructure for displaying icons across web, iOS, and Android platforms with a unified, type-safe API.*
