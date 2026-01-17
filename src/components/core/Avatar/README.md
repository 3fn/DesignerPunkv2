# Avatar Component

A visual representation component for users (Human) and AI agents (Agent) with distinct shape-based differentiation.

## Overview

Avatar provides instant visual recognition of entity type through shape:
- **Human**: Circle shape (organic, natural)
- **Agent**: Hexagon shape (synthetic, constructed)

This shape-based distinction improves accessibility by not relying on color alone.

## Status

🚧 **Under Development** - See [tasks.md](/.kiro/specs/042-avatar-component/tasks.md) for implementation progress.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'human' \| 'agent'` | `'human'` | Entity type determines shape |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | `'md'` | Avatar size variant |
| `src` | `string` | - | Image URL (human only) |
| `alt` | `string` | - | Alt text (required if src provided) |
| `interactive` | `boolean` | `false` | Show hover visual feedback |
| `decorative` | `boolean` | `false` | Hide from screen readers |
| `testID` | `string` | - | Test identifier |

## Usage

### Web Component

```html
<!-- Human avatar with image -->
<avatar-base type="human" size="md" src="/profile.jpg" alt="John Doe"></avatar-base>

<!-- Agent avatar -->
<avatar-base type="agent" size="lg"></avatar-base>

<!-- Interactive avatar -->
<button>
  <avatar-base type="human" size="sm" interactive decorative></avatar-base>
  <span>John Doe</span>
</button>
```

### iOS (SwiftUI)

```swift
// Human avatar with image
Avatar(type: .human, size: .md, src: URL(string: "..."), alt: "John Doe")

// Agent avatar
Avatar(type: .agent, size: .lg)
```

### Android (Compose)

```kotlin
// Human avatar with image
Avatar(type = AvatarType.Human, size = AvatarSize.Md, src = "...", alt = "John Doe")

// Agent avatar
Avatar(type = AvatarType.Agent, size = AvatarSize.Lg)
```

## Token Consumption

### Size Tokens

| Size | Token | Value |
|------|-------|-------|
| xs | `avatar.size.xs` | 24px |
| sm | `avatar.size.sm` | 32px |
| md | `avatar.size.md` | 40px |
| lg | `avatar.size.lg` | 48px |
| xl | `avatar.size.xl` | 80px |
| xxl | `avatar.size.xxl` | 128px |

### Icon Size Tokens

| Avatar Size | Icon Token | Value |
|-------------|------------|-------|
| xs | `avatar.icon.size.xs` | 12px |
| sm | `icon.size050` | 16px |
| md | `icon.size075` | 20px |
| lg | `icon.size100` | 24px |
| xl | `icon.size500` | 40px |
| xxl | `avatar.icon.size.xxl` | 64px |

### Color Tokens

| Token | Usage |
|-------|-------|
| `color.avatar.human` | Human avatar background |
| `color.avatar.agent` | Agent avatar background |
| `color.avatar.contrast.onHuman` | Icon color on human background |
| `color.avatar.contrast.onAgent` | Icon color on agent background |
| `color.avatar.border` | Border color |

### Border Tokens

| Size | Width Token | Color | Opacity |
|------|-------------|-------|---------|
| xs-xl | `borderDefault` | `color.avatar.border` | `opacity.heavy` |
| xxl | `borderEmphasis` | `color.contrast.onSurface` | 100% |

## Accessibility

- **Shape differentiation**: Circle vs hexagon provides non-color-based entity recognition
- **Decorative mode**: Use `decorative` prop when avatar is adjacent to name text
- **Alt text**: Required when `src` is provided for human avatars
- **Wrapper pattern**: Interactive avatars should be wrapped in button/link for proper focus handling

## Platform Notes

### Web
- Custom element: `<avatar-base>`
- Hexagon uses SVG clipPath with Ana Tudor technique for rounded corners
- External CSS file with token-based custom properties

### iOS
- SwiftUI View with custom `RoundedPointyTopHexagon` Shape
- Uses `AsyncImage` for image loading with fallback

### Android
- Jetpack Compose Composable with custom `HexagonShape`
- Uses Coil `AsyncImage` for image loading with fallback

## Related Documentation

- [Design Document](/.kiro/specs/042-avatar-component/design.md)
- [Requirements](/.kiro/specs/042-avatar-component/requirements.md)
- [Design Outline](/.kiro/specs/042-avatar-component/design-outline.md)
