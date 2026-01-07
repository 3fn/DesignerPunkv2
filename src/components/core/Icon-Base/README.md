# Icon-Base Component

**Stemma System**: Icons Family  
**Component Type**: Primitive (Base)  
**Naming Convention**: [Family]-[Type] = Icon-Base  
**Readiness**: Production Ready

## Overview

Icon-Base is the foundational primitive component for all icon components in the Icons family. It renders inline SVG icons with currentColor inheritance for automatic color matching across all platforms (web, iOS, Android).

## Features

- **Cross-Platform**: Consistent API across web, iOS, and Android
- **Color Inheritance**: Icons automatically inherit color from parent elements
- **Optical Balance**: Optional adjustment for icon-text pairing
- **Token-Based Sizing**: 11 size variants calculated from typography scale
- **Accessibility**: Decorative icons hidden from screen readers
- **Type-Safe**: Full TypeScript support with compile-time validation

## Usage

### Web (HTML)

```html
<!-- Basic usage -->
<icon-base name="arrow-right" size="24"></icon-base>

<!-- With color override -->
<icon-base name="check" size="32" color="color-success"></icon-base>

<!-- With optical balance -->
<icon-base name="arrow-right" size="24" color="#A855F7" optical-balance="true"></icon-base>

<!-- With test ID -->
<icon-base name="settings" size="24" test-id="settings-icon"></icon-base>
```

### Web (JavaScript/TypeScript)

```typescript
import { createIconBase, IconBase, IconBaseElement } from '@designerpunk/components';

// Functional API
const iconHTML = createIconBase({ name: 'arrow-right', size: 24 });
element.innerHTML = iconHTML;

// Class API
const icon = new IconBase({ name: 'check', size: 24 });
element.innerHTML = icon.render();

// Programmatic element creation
const iconElement = document.createElement('icon-base') as IconBaseElement;
iconElement.name = 'arrow-right';
iconElement.size = 24;
document.body.appendChild(iconElement);
```

### iOS (SwiftUI)

```swift
// Basic usage with token (REQUIRED - do not use raw numbers)
IconBase(name: "arrow-right", size: DesignTokens.iconSize100)

// With custom color
IconBase(name: "check", size: DesignTokens.iconSize150)
    .foregroundColor(.blue)

// With optical balance for icon-text pairing
IconBase(name: "arrow-right", size: DesignTokens.iconSize100, color: .white, opticalBalance: true)

// In a button with testID
Button(action: action) {
    HStack {
        IconBase(name: "arrow-right", size: DesignTokens.iconSize100, testID: "next-button-icon")
        Text("Next")
    }
}
```

### Android (Jetpack Compose)

```kotlin
// Basic usage with token
IconBase(name = "arrow-right", size = DesignTokens.icon_size_100)

// With custom color
IconBase(name = "check", size = DesignTokens.icon_size_100, color = Color.Blue)

// With optical balance
IconBase(name = "arrow-right", size = DesignTokens.icon_size_100, color = Color.White, opticalBalance = true)
```

## Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `name` | `IconBaseName` | Yes | - | Icon name (type-safe) |
| `size` | `IconBaseSize` | Yes | - | Icon size in pixels (13, 18, 24, 28, 32, 36, 40, 44, 48) |
| `color` | `'inherit' \| string` | No | `'inherit'` | Color override or token reference |
| `opticalBalance` | `boolean` | No | `false` | Apply 8% lighter blend for optical weight compensation |
| `className` | `string` | No | - | Additional CSS class names (web only) |
| `style` | `Record<string, any>` | No | - | Style overrides (web only) |
| `testID` | `string` | No | - | Test identifier for automated testing |

## Available Icons

### Navigation
- `arrow-right`, `arrow-left`, `arrow-up`, `arrow-down`, `chevron-right`

### Actions
- `check`, `x`, `x-circle`, `info`, `plus`, `minus`

### UI Elements
- `circle`, `heart`

### Complex
- `settings`, `user`, `mail`, `calendar`

## Size Tokens

Icon sizes are calculated from `fontSize × lineHeight` to maintain optical balance with paired typography:

| Token | Size | Typography Pairing |
|-------|------|-------------------|
| `size050` | 13px | caption, legal, labelXs |
| `size075` | 18px | bodySm, buttonSm, labelSm |
| `size100` | 24px | bodyMd, buttonMd, labelMd, input (standard) |
| `size125` | 32px | bodyLg, buttonLg, labelLg |
| `size150` | 28px | h6 |
| `size200` | 32px | h5 |
| `size300` | 32px | h4 |
| `size400` | 36px | h3 |
| `size500` | 40px | h2 |
| `size600` | 44px | h1 |
| `size700` | 48px | display |

## Behavioral Contracts

Icon-Base implements 5 behavioral contracts:

1. **renders_svg**: Renders inline SVG with correct viewBox and stroke attributes
2. **color_inheritance**: Inherits color from parent via currentColor (web), template mode (iOS), LocalContentColor (Android)
3. **size_variants**: Supports 11 size variants calculated from typography scale
4. **optical_balance**: Optional 8% lighter blend for icon-text pairing
5. **accessibility_hidden**: Decorative icons hidden from assistive technology

## Accessibility

- Icons are marked as `aria-hidden="true"` (web)
- Icons use `.accessibilityHidden(true)` (iOS)
- Icons use `contentDescription = null` (Android)
- Parent elements should provide accessible labels

## Related Components

- **Icon** (legacy): Original icon component, now aliased to Icon-Base
- **Button-CTA**: Uses Icon-Base for button icons
- **Input-Text-Base**: Uses Icon-Base for trailing icons

## Files

- `types.ts` - Type definitions and size tokens
- `platforms/web/IconBase.web.ts` - Web component implementation
- `platforms/web/styles.css` - CSS styles
- `platforms/ios/IconBase.ios.swift` - SwiftUI implementation
- `platforms/android/IconBase.android.kt` - Jetpack Compose implementation
- `Icon-Base.schema.yaml` - Behavioral contracts schema
