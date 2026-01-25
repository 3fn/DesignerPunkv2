---
inclusion: manual
---

# Avatars Components

**Date**: 2026-01-16
**Purpose**: Component family documentation for Avatars - identity representation with shape-based entity differentiation
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, ui-composition
**Last Reviewed**: 2026-01-25

---

## Family Overview

**Family**: Avatars
**Shared Need**: Identity representation with shape-based entity differentiation
**Readiness**: 🟢 Production

### Purpose

The Avatars family provides components for representing user identity (Human) and AI agents (Agent) through distinct shape-based differentiation. Human avatars render as circles (organic, natural), while AI agent avatars render as hexagons (synthetic, constructed). This shape-based distinction provides instant visual recognition without relying on color alone, improving accessibility.

### Key Characteristics

- **Shape-Based Entity Differentiation**: Circle = Human, Hexagon = AI Agent
- **Image Support**: Display user profile images with loading states and fallback (human only)
- **Icon Fallback**: Show person icon (human) or bot icon (agent) when no image
- **Size Variants**: Six sizes (xs, sm, md, lg, xl, xxl) for different contexts
- **Interactive Mode**: Optional hover visual feedback for clickable contexts
- **Wrapper-Delegated Interaction**: Avatar provides visual feedback only; wrappers handle accessibility

### Stemma System Integration

- **Primitive Base**: Avatar-Base (implemented)
- **Semantic Variants**: None in v1 (future: Avatar-User, Avatar-Group, Avatar-Entity)
- **Cross-Platform**: web, ios, android (all implemented)

---

## Inheritance Structure

### Component Hierarchy

```
Avatar-Base (Primitive) [IMPLEMENTED]
    │
    ├── type="human" → Circle shape
    │   └── Supports image content with fallback to person icon
    │
    └── type="agent" → Hexagon shape
        └── Bot/AI icon only (no image support)
```

### Implemented Components

| Component | Type | Status | Description |
|-----------|------|--------|-------------|
| Avatar-Base | Primitive | 🟢 Production | Foundational avatar with shape-based entity differentiation |

### Future Components (Out of Scope for v1)

| Component | Type | Status | Description |
|-----------|------|--------|-------------|
| Avatar-User | Semantic | 🔴 Planned | User profile with presence indicator |
| Avatar-Group | Semantic | 🔴 Planned | Overlapping avatar stack for groups |
| Avatar-Entity | Semantic | 🔴 Planned | Organization/brand avatar with logo support |

---

## Behavioral Contracts

### Avatar-Base Contracts

| Contract | Description | WCAG | Platforms |
|----------|-------------|------|-----------|
| `shape_differentiation` | Circle for human, hexagon for agent | 1.4.1 | web, ios, android |
| `displays_image` | Shows user image when available (human only) | 1.1.1 | web, ios, android |
| `displays_fallback` | Shows icon when image unavailable or agent type | 1.1.1 | web, ios, android |
| `error_handling` | Falls back to icon on image load failure | N/A | web, ios, android |
| `size_variants` | Supports six size variants (xs-xxl) | N/A | web, ios, android |
| `interactive_feedback` | Shows hover visual feedback when interactive | N/A | web, ios, android |
| `decorative_mode` | Hides from screen readers when decorative | 1.1.1 | web, ios, android |
| `wrapper_delegation` | No onClick/onPress - wrapper handles interaction | 2.1.1 | web, ios, android |

---

## Token Dependencies

### Size Tokens

| Token | Value | Purpose |
|-------|-------|---------|
| `avatar.size.xs` | 24px | Extra small avatar |
| `avatar.size.sm` | 32px | Small avatar |
| `avatar.size.md` | 40px | Medium avatar (default) |
| `avatar.size.lg` | 48px | Large avatar |
| `avatar.size.xl` | 80px | Extra large avatar |
| `avatar.size.xxl` | 128px | Hero avatar |

### Icon Size Tokens

| Avatar Size | Token | Value |
|-------------|-------|-------|
| xs | `avatar.icon.size.xs` | 12px |
| sm | `icon.size050` | 16px |
| md | `icon.size075` | 20px |
| lg | `icon.size100` | 24px |
| xl | `icon.size500` | 40px |
| xxl | `avatar.icon.size.xxl` | 64px |

### Color Tokens

Avatar uses a **compositional token architecture** where component tokens reference semantic concept tokens. This follows the Nathan Curtis concept-first naming model.

#### Semantic Concept Tokens (Foundation)

Avatar relies on two semantic concepts:

| Concept | Token | Primitive | Purpose |
|---------|-------|-----------|---------|
| **Identity** | `color.identity.human` | orange300 | Human entity visual identity |
| **Identity** | `color.identity.agent` | teal200 | AI agent entity visual identity |
| **Contrast** | `color.contrast.onDark` | white100 | Content on dark/colored backgrounds |

#### Component Tokens (Avatar-Specific)

Component tokens follow the pattern: `color.{component}.{variant}.{property}`

| Token | References | Purpose |
|-------|------------|---------|
| `color.avatar.human.background` | `color.identity.human` | Human avatar background color |
| `color.avatar.agent.background` | `color.identity.agent` | Agent avatar background color |
| `color.avatar.human.icon` | `color.contrast.onDark` | Icon color on human avatar |
| `color.avatar.agent.icon` | `color.contrast.onDark` | Icon color on agent avatar |
| `color.avatar.default.border` | gray100 | Border color for all avatar variants |

**Why Component Tokens Reference Semantic Tokens**:
- **Semantic clarity**: `color.avatar.human.background` clearly indicates avatar-specific usage
- **Compositional architecture**: Component tokens reference semantic tokens, not primitives directly
- **Maintainability**: If identity colors change, avatar automatically inherits the change
- **Discoverability**: Developers can find all avatar colors grouped together

### Border Tokens

| Size | Width Token | Color | Opacity |
|------|-------------|-------|---------|
| xs-xl | `borderDefault` | `color.avatar.default.border` | `opacity.heavy` |
| xxl | `borderEmphasis` | `color.contrast.onSurface` | 100% |

### Motion Tokens

| Token | Purpose |
|-------|---------|
| `motion.duration.fast` | Interactive hover transition |

---

## Usage Guidelines

### Basic Usage

```html
<!-- Human avatar with image -->
<avatar-base type="human" size="md" src="/profile.jpg" alt="John Doe"></avatar-base>

<!-- Agent avatar -->
<avatar-base type="agent" size="lg"></avatar-base>

<!-- Human avatar placeholder (no image) -->
<avatar-base type="human" size="sm"></avatar-base>
```

### Interactive Avatar Pattern

Avatar uses **wrapper-delegated interaction** - the avatar provides visual feedback only, while the wrapper handles click/tap events and accessibility.

```html
<!-- Clickable avatar with button wrapper -->
<button class="avatar-button" aria-label="View John Doe's profile">
  <avatar-base type="human" size="md" src="/john.jpg" alt="" decorative interactive></avatar-base>
</button>

<!-- Avatar with adjacent text (decorative mode) -->
<button class="user-card">
  <avatar-base type="human" size="sm" decorative></avatar-base>
  <span>John Doe</span>
</button>
```

### Wrapper Responsibilities

When using Avatar in an interactive context, the wrapper element is responsible for:

| Responsibility | Implementation |
|----------------|----------------|
| Click/tap handling | Wrapper's `onClick`/`onPress` handler |
| Focus ring | Wrapper's `:focus-visible` styles |
| Touch target | Wrapper's minimum 44px dimensions |
| Accessible name | Wrapper's `aria-label` or text content |
| Keyboard navigation | Wrapper's native button/link behavior |

---

## Cross-Platform Notes

### Web

- **Custom Element**: `<avatar-base>`
- **Hexagon Implementation**: SVG clipPath with Ana Tudor technique for rounded corners
- **Styling**: External CSS file with token-based custom properties
- **Image Loading**: Native `<img>` with `onerror` fallback

### iOS

- **View Type**: SwiftUI View
- **Hexagon Implementation**: Custom `RoundedPointyTopHexagon` Shape using `addArc`
- **Image Loading**: `AsyncImage` with fallback to icon placeholder

### Android

- **Composable**: Jetpack Compose function
- **Hexagon Implementation**: Custom `HexagonShape` using `quadraticBezierTo`
- **Image Loading**: Coil `AsyncImage` with fallback to icon placeholder

---

## Component Schemas

### Avatar-Base Schema

```json
{
  "name": "Avatar-Base",
  "family": "Avatars",
  "type": "primitive",
  "platforms": ["web", "ios", "android"],
  "props": {
    "type": { "type": "enum", "values": ["human", "agent"], "default": "human" },
    "size": { "type": "enum", "values": ["xs", "sm", "md", "lg", "xl", "xxl"], "default": "md" },
    "src": { "type": "string", "optional": true },
    "alt": { "type": "string", "optional": true },
    "interactive": { "type": "boolean", "default": false },
    "decorative": { "type": "boolean", "default": false },
    "testID": { "type": "string", "optional": true }
  },
  "tokens": {
    "size": ["avatar.size.*"],
    "iconSize": ["avatar.icon.size.*", "icon.size*"],
    "color": {
      "semantic": ["color.identity.human", "color.identity.agent", "color.contrast.onDark"],
      "component": ["color.avatar.human.background", "color.avatar.agent.background", "color.avatar.human.icon", "color.avatar.agent.icon", "color.avatar.default.border"]
    },
    "border": ["borderDefault", "borderEmphasis"],
    "opacity": ["opacity.heavy"],
    "motion": ["motion.duration.fast"]
  }
}
```

**Token Architecture Note**: The schema distinguishes between semantic tokens (concept-level) and component tokens (avatar-specific). Component tokens reference semantic tokens, creating a compositional hierarchy.

---

## Related Documentation

- [Component Quick Reference](./Component-Quick-Reference.md) - Family routing table
- [Stemma System Principles](./stemma-system-principles.md) - Architecture overview
- [Token-Family-Color](./Token-Family-Color.md) - Color token reference including identity and contrast concepts
- [Token Governance](./Token-Governance.md) - Token selection and usage governance
- [Avatar README](../src/components/core/Avatar/README.md) - Component usage documentation
- [Avatar Design Document](../.kiro/specs/042-avatar-component/design.md) - Detailed architecture
- [Avatar Requirements](../.kiro/specs/042-avatar-component/requirements.md) - EARS format requirements
- [Semantic Token Naming Design Authority](../.kiro/specs/051-semantic-token-naming-restructure/design-outline.md) - Naming model reference

