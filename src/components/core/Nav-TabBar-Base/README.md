# Nav-TabBar-Base

**Stemma System**: Navigation Family
**Component Type**: Primitive (Base)
**Naming Convention**: `[Family]-[Type]-[Variant]` = Nav-TabBar-Base
**Status**: 🟢 All Platforms Implemented (Web, iOS, Android)

---

## Overview

Nav-TabBar-Base is a primary bottom navigation bar with icon-only tabs. It provides persistent top-level navigation between 3–5 app destinations with a dot indicator, radial glow gradients, and three-phase selection animation.

### Key Characteristics

- **Primary navigation**: Persistent bottom bar for top-level app destinations
- **Icon-only**: Each tab displays an icon with required accessibility label (no text labels in v1)
- **Dot indicator**: Single animated dot marks the active tab
- **Radial glow**: Per-tab gradient that dims/brightens during selection transitions
- **Three-phase animation**: Departing glow → dot glide → arriving glow
- **Accessible**: tablist/tab semantics, keyboard navigation, reduced motion support

### Stemma Naming Convention

| Segment | Value | Meaning |
|---------|-------|---------|
| Family | `Nav` | Navigation component family |
| Type | `TabBar` | Bottom tab bar navigation |
| Variant | `Base` | Foundational primitive (consumer-facing) |

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tabs` | `TabOption[]` | ✅ Yes | - | Array of tab options (minimum 2, 3–5 recommended) |
| `selectedValue` | `string` | ✅ Yes | - | Currently selected tab value |
| `onSelectionChange` | `(value: string) => void` | ✅ Yes | - | Called when selection changes |
| `testID` | `string` | No | - | Test identifier |

### TabOption

Each tab requires an icon pair (active/inactive) and an accessibility label:

```typescript
interface TabOption {
  value: string;              // Unique identifier
  icon: string;               // Outline-stroke icon (inactive state)
  activeIcon: string;         // Solid-fill icon (active state)
  accessibilityLabel: string; // Screen reader announcement
}
```

---

## Usage Examples

### Web (Custom Element)

```html
<nav-tab-bar
  selected-value="home"
  test-id="main-nav">
</nav-tab-bar>

<script>
  const tabBar = document.querySelector('nav-tab-bar');
  tabBar.tabs = [
    { value: 'home', icon: 'home-outline', activeIcon: 'home-solid', accessibilityLabel: 'Home' },
    { value: 'search', icon: 'search-outline', activeIcon: 'search-solid', accessibilityLabel: 'Search' },
    { value: 'profile', icon: 'person-outline', activeIcon: 'person-solid', accessibilityLabel: 'Profile' }
  ];
  tabBar.onSelectionChange = (value) => console.log('Selected:', value);
</script>
```

### iOS (SwiftUI)

```swift
NavTabBarBase(
    tabs: [
        TabOption(value: "home", icon: "house", activeIcon: "house.fill", accessibilityLabel: "Home"),
        TabOption(value: "search", icon: "magnifyingglass", activeIcon: "magnifyingglass", accessibilityLabel: "Search"),
        TabOption(value: "profile", icon: "person", activeIcon: "person.fill", accessibilityLabel: "Profile")
    ],
    selectedValue: $selection,
    onSelectionChange: { value in print(value) }
)
```

### Android (Jetpack Compose)

```kotlin
NavTabBarBase(
    tabs = listOf(
        TabOption("home", "home_outline", "home_solid", "Home"),
        TabOption("search", "search_outline", "search_solid", "Search"),
        TabOption("profile", "person_outline", "person_solid", "Profile")
    ),
    selectedValue = selection,
    onSelectionChange = { selection = it }
)
```

---

## Token Dependencies

### Container

| Token | Purpose |
|-------|---------|
| `color.structure.canvas` | Container background |
| `color.structure.border.subtle` | Top stroke border |

### Icons

| Token | Purpose |
|-------|---------|
| `color.action.navigation` | Active icon color |
| `color.icon.navigation.inactive` | Inactive icon color |

### Dot Indicator

| Token | Purpose |
|-------|---------|
| `color.action.navigation` | Dot fill color |
| `space.050` | Dot diameter |

### Glow Gradient

| Token | Purpose |
|-------|---------|
| `color.background.primary.subtle` | Active glow center |
| `color.structure.canvas` | Inactive glow center / edge color |
| `opacity.024` | Glow edge opacity (88% stop) |

### Spacing

| Token | Purpose |
|-------|---------|
| `space.150` | Active: top padding, inline padding |
| `space.050` | Active: bottom padding |
| `space.grouped.minimal` | Active: icon-to-dot spacing |
| `space.200` | Inactive: top padding, container inline margins (web) |
| `space.100` | Inactive: bottom padding |
| `tapAreaMinimum` | Minimum tab width |

### Motion

| Token | Purpose |
|-------|---------|
| `duration150` | Phase 1 (depart) and Phase 3 (arrive) timing |
| `duration350` | Phase 2 (glide) timing |
| `easingGlideDecelerate` | Dot glide easing curve |

### Blend

| Token | Purpose |
|-------|---------|
| `blend.pressedLighter` | Pressed state on inactive tabs (12% lighter) |

### Focus (Web only)

| Token | Purpose |
|-------|---------|
| `accessibility.focus.width` | Focus ring width |
| `accessibility.focus.color` | Focus ring color |
| `accessibility.focus.offset` | Focus ring offset |

---

## Accessibility

### WCAG 2.1 AA Compliance

- **2.1.1 Keyboard**: Full keyboard operation (arrows with wrapping, Enter/Space activation)
- **2.3.3 Animation from Interactions**: Reduced motion collapses all animation to instant state change
- **2.4.7 Focus Visible**: `:focus-visible` ring with accessibility tokens (web)
- **2.5.5 Target Size**: `tapAreaMinimum` enforced per tab, full tab width tappable
- **4.1.2 Name, Role, Value**: tablist/tab roles, aria-selected, accessibilityLabel announced

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Focus enters on selected tab; Tab again exits control |
| Arrow Left | Move focus to previous tab (wraps) |
| Arrow Right | Move focus to next tab (wraps) |
| Enter / Space | Select the focused tab |

### Screen Reader Behavior

- Container announced as "tab list" (web: `role="tablist"`, iOS: `.isTabBar`, Android: `selectableGroup()`)
- Each tab announced as "tab" with selected/unselected state
- Accessibility label announced (not icon name)

---

## Animation Choreography

Selection changes trigger a three-phase animation:

1. **Depart** (150ms) — Departing tab's glow dims to canvas
2. **Glide** (350ms) — Dot slides to new tab center (`easingGlideDecelerate`)
3. **Arrive** (~80% through glide) — Arriving tab's glow brightens; icon swaps from outline to solid

Phase 3 overlaps Phase 2 for a fluid transition feel.

**Reduced motion**: All phases collapse to instant state change.
**Initial render**: Dot appears at selected position without animation.

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| No disabled state | Unavailable destinations should not be rendered |
| Icon-only (v1) | Clean mobile navigation; text labels deferred to future variant |
| No hover state | Primary mobile context; pressed state provides touch feedback |
| `blend.pressedLighter` for inactive press | Lighten blend on dark-surface icons; completes blend family symmetry |
| Zero inter-tab spacing | Full width tappable; glow gradients provide visual separation |
| Single dot element | Enables smooth CSS/Animatable transition between positions |

---

## Platform-Specific Behavior

### Web
- Web Component (`<nav-tab-bar>`) with Shadow DOM
- Floating pill container with `radiusFull`, backdrop blur, `space200` inline margins
- Visual Viewport API for chrome tracking (`--chrome-offset` custom property)
- CSS transitions + JS-orchestrated three-phase sequencing
- `prefers-reduced-motion` media query + JS check
- Roving tabindex for keyboard navigation

### iOS
- SwiftUI View with GeometryReader for equal-width tabs
- Full-width anchored to bottom with OS safe area insets
- `withAnimation` + `DispatchQueue.main.asyncAfter` phase sequencing
- `UIImpactFeedbackGenerator(style: .light)` haptic on selection
- `UIAccessibility.isReduceMotionEnabled` for reduced motion
- `@FocusState` + `.onMoveCommand` for external keyboard navigation

### Android
- Jetpack Compose with `BoxWithConstraints` for pixel-level dot positioning
- Full-width anchored to bottom with OS safe area insets
- `Animatable` + coroutine sequencing for three-phase animation
- `MutableInteractionSource` + `pressedLighterBlend()` for pressed state
- `Settings.Global.ANIMATOR_DURATION_SCALE` for reduced motion
- `FocusRequester` + `onKeyEvent` for hardware keyboard navigation

---

## Related

- **Spec**: `.kiro/specs/050-nav-tabbar-base/`
- **Schema**: `Nav-TabBar-Base.schema.yaml`
- **Contracts**: `contracts.yaml` (20 contracts, 2 exclusions)
- **Component Meta**: `component-meta.yaml`
- **Family Doc**: `.kiro/steering/Component-Family-Navigation.md`
- **Sibling**: `Nav-SegmentedChoice-Base` (in-view content switching)
