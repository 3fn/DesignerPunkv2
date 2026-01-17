# Avatar Component

A visual representation component for users (Human) and AI agents (Agent) with distinct shape-based differentiation.

## Overview

Avatar provides instant visual recognition of entity type through shape:
- **Human**: Circle shape (organic, natural)
- **Agent**: Hexagon shape (synthetic, constructed)

This shape-based distinction improves accessibility by not relying on color alone.

## Architecture

Avatar follows the **True Native Architecture** pattern with separate implementations for each platform (web, iOS, Android) rather than runtime detection. Key architectural decisions:

- **Shape-based entity differentiation**: Circle = Human, Hexagon = AI Agent
- **Wrapper-delegated interaction**: Avatar provides visual feedback only; wrappers handle accessibility
- **Token-based styling**: All values derived from semantic, primitive, or component tokens
- **50% icon-to-avatar ratio**: Icons scale proportionally with avatar size

For detailed architectural decisions and rationale, see the [Design Outline](/.kiro/specs/042-avatar-component/design-outline.md).

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

## Wrapper-Delegated Interaction Pattern

Avatar is a **visual-only component** that does not handle click/tap events directly. This is an intentional architectural decision that keeps Avatar simple while ensuring proper accessibility.

### Why No onClick/onPress?

1. **Separation of concerns**: Avatar handles visual representation; wrappers handle interaction
2. **Accessibility compliance**: Wrappers (button, link) provide proper focus management, keyboard navigation, and screen reader announcements
3. **Flexibility**: The same Avatar can be used in clickable and non-clickable contexts without prop changes
4. **Touch target compliance**: Wrappers ensure minimum 44px touch targets per WCAG guidelines

### Wrapper Responsibilities

When using Avatar in an interactive context, the wrapper element is responsible for:

| Responsibility | Implementation |
|----------------|----------------|
| Click/tap handling | Wrapper's `onClick`/`onPress` handler |
| Focus ring | Wrapper's `:focus-visible` styles |
| Touch target | Wrapper's minimum 44px dimensions |
| Accessible name | Wrapper's `aria-label` or text content |
| Keyboard navigation | Wrapper's native button/link behavior |

### Usage Examples

#### Clickable Avatar (Button Wrapper)

```html
<!-- Web: Button wrapper handles all interaction -->
<button 
  class="avatar-button" 
  aria-label="View John Doe's profile"
  onclick="openProfile('john-doe')"
>
  <avatar-base type="human" size="md" src="/john.jpg" alt="" decorative></avatar-base>
</button>

<style>
.avatar-button {
  /* Reset button styles */
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  
  /* Ensure minimum touch target */
  min-width: 44px;
  min-height: 44px;
  
  /* Focus ring */
  border-radius: 50%;
}
.avatar-button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
</style>
```

#### Clickable Avatar (Link Wrapper)

```html
<!-- Web: Link wrapper for navigation -->
<a href="/profile/john-doe" class="avatar-link" aria-label="John Doe's profile">
  <avatar-base type="human" size="md" src="/john.jpg" alt="" decorative></avatar-base>
</a>
```

#### Avatar with Adjacent Text

```html
<!-- When avatar is next to name, use decorative mode -->
<button class="user-card" onclick="openProfile('john-doe')">
  <avatar-base type="human" size="sm" decorative></avatar-base>
  <span>John Doe</span>
</button>
```

#### Non-Interactive Avatar

```html
<!-- Display-only avatar (no wrapper needed) -->
<div class="profile-header">
  <avatar-base type="human" size="xxl" src="/john.jpg" alt="John Doe"></avatar-base>
  <h1>John Doe</h1>
</div>
```

### iOS (SwiftUI)

```swift
// Button wrapper for interactive avatar
Button(action: { openProfile() }) {
    Avatar(type: .human, size: .md, src: profileURL, decorative: true)
}
.accessibilityLabel("View John Doe's profile")

// NavigationLink wrapper
NavigationLink(destination: ProfileView()) {
    Avatar(type: .human, size: .md, src: profileURL, decorative: true)
}
```

### Android (Compose)

```kotlin
// Clickable modifier for interactive avatar
Box(
    modifier = Modifier
        .clickable { openProfile() }
        .semantics { contentDescription = "View John Doe's profile" }
) {
    Avatar(type = AvatarType.Human, size = AvatarSize.Md, src = "...", decorative = true)
}
```

## Accessibility

- **Shape differentiation**: Circle vs hexagon provides non-color-based entity recognition
- **Decorative mode**: Use `decorative` prop when avatar is adjacent to name text (wrapper provides accessible name)
- **Alt text**: Required when `src` is provided for standalone human avatars
- **Wrapper pattern**: Interactive avatars MUST be wrapped in button/link for proper focus handling
- **Touch targets**: Wrapper must ensure minimum 44px touch target (WCAG 2.5.5)

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

- [Design Outline](/.kiro/specs/042-avatar-component/design-outline.md) - Architectural decisions and rationale
- [Design Document](/.kiro/specs/042-avatar-component/design.md) - Detailed component architecture
- [Requirements](/.kiro/specs/042-avatar-component/requirements.md) - EARS format requirements and acceptance criteria
