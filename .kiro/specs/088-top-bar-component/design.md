# Design Document: Nav-Header-Base Component

**Date**: 2026-03-31
**Spec**: 088 - Top Bar Component
**Status**: Design Phase
**Dependencies**: Spec 089 (Unified Blur Token Family — complete)

---

## Overview

Three components in the Navigation family: Nav-Header-Base (primitive), Nav-Header-Page (semantic), Nav-Header-App (semantic). The primitive solves safe area, background, layout, and landmark semantics once. Semantic variants encode intent — page-level navigation vs app-level chrome.

---

## Architecture

### Inheritance Structure

```
Nav-Header-Base (Primitive — internal only)
    ├── Nav-Header-Page (Semantic — production target)
    └── Nav-Header-App (Semantic — scaffold)
```

Follows the Container-Base → Container-Card-Base pattern. The primitive is never used directly by product agents.

### Layout Model

```
┌──────────────────────────────────────────────┐
│ Safe Area Inset (platform-specific)          │
├──────┬───────────────────────┬───────────────┤
│ Lead │        Title          │     Trail     │
│ ing  │                      │     ing       │
├──────┴───────────────────────┴───────────────┤
│ Bottom Separator (optional)                  │
└──────────────────────────────────────────────┘
```

Three regions: leading (inline-start), title (center or after leading), trailing (inline-end). Close action, when present, is always at the absolute inline-end edge — separate from trailing actions.

---

## Components and Interfaces

### Nav-Header-Base Props

```typescript
interface NavHeaderBaseProps {
  leadingSlot?: React.ReactNode;
  titleSlot?: React.ReactNode;
  trailingSlot?: React.ReactNode;
  appearance?: 'opaque' | 'translucent';
  showSeparator?: boolean;
  testID?: string;
}
```

### Nav-Header-Page Props

```typescript
interface NavHeaderPageProps {
  title: string;
  leadingAction?: LeadingAction;
  trailingActions?: TrailingAction[];
  closeAction?: { onPress: () => void; accessibilityLabel?: string };
  titleAlignment?: 'center' | 'leading';  // Default: iOS center, Android/Web leading
  scrollBehavior?: 'fixed' | 'collapsible';  // Default: fixed
  scrollContainerRef?: React.RefObject<HTMLElement>;  // Web-only: nested scroll container
  appearance?: 'opaque' | 'translucent';
  showSeparator?: boolean;  // Default: true
  testID?: string;
}

type LeadingAction =
  | { type: 'back'; accessibilityLabel?: string; onPress: () => void }
  | { type: 'menu'; onPress: () => void }
  | { type: 'custom'; icon: string; accessibilityLabel: string; onPress: () => void };

type TrailingAction = {
  icon: string;
  accessibilityLabel: string;
  onPress: () => void;
  badge?: number;  // Renders only when present and > 0
};
```

### Nav-Header-App Props

```typescript
interface NavHeaderAppProps {
  leadingContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  trailingContent?: React.ReactNode;
  appearance?: 'opaque' | 'translucent';
  showSeparator?: boolean;  // Default: true
  testID?: string;
}
```

---

## Design Decisions

### Decision 1: Action Sizing and Bar Height

All header actions use Button-Icon at `size: 'medium'`, `variant: 'tertiary'` (D6).

- Icon: 20px (`icon.size075`), no background, no border
- Touch target: 48px total box (40px visual + 4px focus buffer each side)
- Bar content height: 48px floor (content-driven)
- Android: adds `space.inset.100` (8px) vertical padding = 64dp total
- iOS/Web: no bar padding = 48px total

### Decision 2: Title Alignment Defaults

Platform-native defaults with override capability (D4):

| Platform | Default | Override |
|----------|---------|---------|
| iOS | `center` | `leading` available |
| Android | `leading` | `center` available |
| Web | `leading` | `center` available |

When `titleAlignment: 'center'`, the title is centered in the full bar width (not the remaining space after leading/trailing). Long titles truncate with ellipsis before overlapping leading or trailing regions. This matches iOS native behavior.

### Decision 3: Close Action Positioning

Dedicated `closeAction` prop, not part of `trailingActions` array (D3 + Lina R1):

- Always positioned at inline-end edge regardless of trailing action count
- Separated from trailing actions by `space.grouped.tight` to visually distinguish dismissal from operations
- Semantically distinct from trailing actions (dismissal vs operation)
- Enables validation: `leadingAction.type === 'back'` + `closeAction` is an unusual combination

### Decision 4: Heading Level by Variant

No `headingLevel` prop. Variant determines heading semantics (D9):

| Variant | Heading | Rationale |
|---------|---------|-----------|
| Nav-Header-Page | h1 | Page's primary heading |
| Nav-Header-App | None | May contain logo, search, not a heading |

### Decision 5: Scroll Behavior

Two modes on Nav-Header-Page (D8):

**Fixed** (default): Bar stays visible. No scroll coordination.

**Collapsible**: Bar hides on scroll down, reveals on scroll up.
- Direction detection threshold: 8px
- Bar translates off-screen on hide
- Safe area remains protected when hidden — content does not render in status bar zone
- Animation uses motion tokens
- Reduced motion: header remains fixed (visible at all times, collapsible disabled)

Scroll context discovery:
- iOS: Native scroll observation (preference keys / UIScrollView delegate)
- Android: `NestedScrollConnection`
- Web: `window` scroll default, optional `scrollContainerRef` for nested containers

Large title collapse deferred to v2.

### Decision 6: Translucent Appearance

Blur primitives from Spec 089 consumed directly as component tokens:

| Platform | Implementation | Tokens |
|----------|---------------|--------|
| Web | `backdrop-filter: blur({value}px)` | `blur050`, `blur100`, `blur150` |
| iOS | System material enums | `blur050`→`.systemUltraThinMaterial`, `blur100`→`.systemThinMaterial`, `blur150`→`.systemMaterial` |
| Android | Solid background | Blur tokens available, not consumed by default |

---

## Data Models

### Schema Structure

Each component gets a `{Component}.schema.yaml` with:
- Identity (name, type, family, version)
- Per-platform readiness with `reviewed` flags
- Properties matching the TypeScript interfaces above
- Composition (Nav-Header-Page composes Icon-Base, Button-Icon; Nav-Header-Base is composed by variants)
- Accessibility section (landmark role, heading semantics, focus order)

### Token Dependencies

| Category | Tokens | Consumer |
|----------|--------|----------|
| Color | `color.structure.canvas` | Opaque background |
| Color | `color.structure.border.subtle` | Bottom separator |
| Color | `color.action.navigation` | Title and icon color |
| Typography | `typography.labelMd` | Title text |
| Spacing | `space.inset.*` | Internal padding (Android) |
| Spacing | `space.grouped.*` | Gap between trailing actions |
| Touch | `tapAreaMinimum`, `tapAreaRecommended` | Action touch targets |
| Accessibility | `accessibility.focus.*` | Focus ring |
| Motion | `duration*`, `easing*` | Collapsible animation |
| Border | `borderWidth100` | Bottom separator |
| Blur | `blur050`, `blur100`, `blur150` | Translucent backdrop |

---

## Error Handling

- Missing `title` on Nav-Header-Page: TypeScript enforces required prop
- Invalid `leadingAction.type`: TypeScript union type enforces valid values
- `closeAction` + `leadingAction.type === 'back'`: Valid but unusual — no error, component renders both
- `scrollBehavior: 'collapsible'` without scrollable content: Bar stays fixed (no scroll events to respond to)
- `appearance: 'translucent'` on Android: Falls back to solid background (by design)

---

## Testing Strategy

| Test Category | What It Validates |
|--------------|-------------------|
| Behavioral contracts | Landmark semantics, focus order, heading level, action positioning |
| Interaction states | Back navigation, close action, trailing action press, scroll hide/reveal |
| Accessibility | Screen reader announcements, focus order, reduced motion, heading semantics |
| Visual states | Opaque/translucent appearance, separator visibility, title alignment |
| Composition | Internal Button-Icon/Icon-Base usage, badge rendering on trailing actions |
| Cross-platform | Safe area integration, scroll context discovery, platform-specific defaults |

---

## Correctness Properties

1. Nav-Header-Page always renders an h1 heading; Nav-Header-App never renders a heading
2. Close action is always at inline-end edge, regardless of trailing action count
3. Safe area is always protected — even when the header is hidden during collapsible scroll
4. Focus order is always leading → title → trailing, regardless of platform
5. All interactive elements meet `tapAreaMinimum`
6. Reduced motion disables collapsible behavior entirely (header stays visible)
7. Nav-Header-Base is never used directly — composition rules flag direct use as a warning
8. Trailing action badges render only when present and > 0
9. Centered title truncates with ellipsis before overlapping leading or trailing regions
