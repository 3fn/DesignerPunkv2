# Design Document: Avatar Component

**Date**: January 16, 2026
**Spec**: 042 - Avatar Component
**Status**: Design Phase
**Dependencies**: Icon Component (Spec 004), Spacing Tokens, Border Tokens, Opacity Tokens, Motion Tokens

---

## Overview

Avatar is a visual representation component for users (Human) and AI agents (Agent) with distinct shape-based differentiation. The component follows True Native Architecture with separate implementations for web, iOS, and Android platforms.

**Core Design Principles**:
- **Shape-based entity differentiation**: Circle = Human, Hexagon = AI Agent
- **Token-based styling**: All values derived from semantic, primitive, or component tokens
- **Wrapper-delegated interaction**: Avatar provides visual feedback only; wrappers handle accessibility
- **50% icon-to-avatar ratio**: Icons scale proportionally with avatar size

**Component Pattern**: Prop-based variants (like Button-CTA) rather than separate components. A single Avatar component handles both human and agent types via the `type` prop.

---

## Architecture

### Component Structure

```
Avatar (Core Component)
├── type="human" | "agent" (prop determines shape)
├── size="xs" | "sm" | "md" | "lg" | "xl" | "xxl"
├── Renders shape (circle or hexagon)
├── Renders content (image or icon)
├── Applies border styles
└── Handles interactive hover state
```

### File Organization

```
src/components/core/Avatar/
├── README.md                           # Component documentation
├── platforms/
│   ├── web/
│   │   ├── Avatar.web.ts              # Web component implementation
│   │   ├── Avatar.styles.css          # CSS styles with token references
│   │   └── hexagon-clip.svg           # SVG clipPath definition
│   ├── ios/
│   │   ├── Avatar.swift               # SwiftUI implementation
│   │   └── RoundedPointyTopHexagon.swift  # Custom hexagon shape
│   └── android/
│       ├── Avatar.kt                  # Compose implementation
│       └── HexagonShape.kt            # Custom hexagon shape
├── tokens/
│   └── avatar.tokens.ts               # Component token definitions
└── __tests__/
    ├── Avatar.test.ts                 # Core API tests
    ├── Avatar.accessibility.test.ts   # ARIA and screen reader tests
    ├── Avatar.lifecycle.test.ts       # Web component lifecycle
    ├── Avatar.rendering.test.ts       # Shape, size, border rendering
    ├── Avatar.icon-integration.test.ts # Icon component integration
    └── Avatar.image.test.ts           # Image loading and fallback
```


---

## Components and Interfaces

### Props Interface

```typescript
interface AvatarProps {
  /** Entity type determines shape: 'human' = circle, 'agent' = hexagon */
  type: 'human' | 'agent';
  
  /** Avatar size */
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  
  /** Image source URL or local asset (human only) */
  src?: string;
  
  /** Alt text for accessibility (required if src provided) */
  alt?: string;
  
  /** Whether avatar shows hover visual feedback */
  interactive?: boolean;
  
  /** Hide from screen readers (use when avatar is decorative) */
  decorative?: boolean;
  
  /** Test ID for automated testing */
  testID?: string;
}
```

### Default Values

```typescript
const AVATAR_DEFAULTS = {
  type: 'human',
  size: 'md',
  interactive: false,
  decorative: false,
};
```

### Size Token Mapping

```typescript
const AVATAR_SIZE_TOKENS = {
  xs: 'avatar.size.xs',   // references space300
  sm: 'avatar.size.sm',   // references space400
  md: 'avatar.size.md',   // references space500
  lg: 'avatar.size.lg',   // references space600
  xl: 'avatar.size.xl',   // calculated: SPACING_BASE_VALUE * 10
  xxl: 'avatar.size.xxl', // calculated: SPACING_BASE_VALUE * 16
};
```

### Icon Size Token Mapping

```typescript
const AVATAR_ICON_SIZE_TOKENS = {
  xs: 'avatar.icon.size.xs',   // component token (SPACING_BASE_VALUE * 1.5)
  sm: 'icon.size050',          // existing icon token
  md: 'icon.size075',          // existing icon token
  lg: 'icon.size100',          // existing icon token
  xl: 'icon.size500',          // existing icon token
  xxl: 'avatar.icon.size.xxl', // component token (SPACING_BASE_VALUE * 8)
};
```

---

## Data Models

### Token Definitions

#### Semantic Color Tokens

```typescript
const AVATAR_COLOR_TOKENS = {
  // Background colors
  'color.avatar.human': {
    primitiveReferences: { value: 'orange300' },
    context: 'Background color for human avatars',
  },
  'color.avatar.agent': {
    primitiveReferences: { value: 'teal300' },
    context: 'Background color for AI agent avatars',
  },
  
  // Icon contrast colors
  'color.avatar.contrast.onHuman': {
    primitiveReferences: { value: 'white100' },
    context: 'Icon color on human avatar background',
  },
  'color.avatar.contrast.onAgent': {
    primitiveReferences: { value: 'white100' },
    context: 'Icon color on AI agent avatar background',
  },
  
  // Border color
  'color.avatar.border': {
    primitiveReferences: { value: 'gray100' },
    context: 'Border color for avatars',
  },
};
```

#### Component Tokens

```typescript
const AVATAR_COMPONENT_TOKENS = {
  // Avatar sizes
  'avatar.size.xs': { references: 'space300' },
  'avatar.size.sm': { references: 'space400' },
  'avatar.size.md': { references: 'space500' },
  'avatar.size.lg': { references: 'space600' },
  'avatar.size.xl': { derivation: 'SPACING_BASE_VALUE * 10' },
  'avatar.size.xxl': { derivation: 'SPACING_BASE_VALUE * 16' },
  
  // Icon sizes (gap fillers)
  'avatar.icon.size.xs': { derivation: 'SPACING_BASE_VALUE * 1.5' },
  'avatar.icon.size.xxl': { derivation: 'SPACING_BASE_VALUE * 8' },
};
```

### Hexagon Geometry

```typescript
const HEXAGON_GEOMETRY = {
  aspectRatio: Math.cos(Math.PI / 6), // ≈ 0.866
  orientation: 'pointy-top',
  internalAngle: 120,
  cornerRadius: 0.05, // relative to bounding box (objectBoundingBox units)
};
```


---

## Platform Implementations

### Web Implementation

#### Custom Element Definition

```typescript
class AvatarBaseElement extends HTMLElement {
  static observedAttributes = ['type', 'size', 'src', 'alt', 'interactive', 'decorative', 'testid'];
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    this.render();
  }
  
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.render();
    }
  }
  
  private render() {
    // Render avatar based on current attributes
  }
}

customElements.define('avatar-base', AvatarBaseElement);
```

#### CSS Structure

```css
/* Shape variants */
.avatar--human {
  border-radius: 50%;
  overflow: hidden;
}

.avatar--agent {
  aspect-ratio: cos(30deg);
  clip-path: url(#rounded-hexagon);
}

/* Size variants - use CSS custom properties from tokens */
.avatar--size-xs { height: var(--avatar-size-xs); }
.avatar--size-sm { height: var(--avatar-size-sm); }
.avatar--size-md { height: var(--avatar-size-md); }
.avatar--size-lg { height: var(--avatar-size-lg); }
.avatar--size-xl { height: var(--avatar-size-xl); }
.avatar--size-xxl { height: var(--avatar-size-xxl); }

/* Border styles */
.avatar {
  border-width: var(--border-default);
  border-style: solid;
  border-color: var(--color-avatar-border);
  opacity: var(--opacity-heavy);
}

.avatar--size-xxl {
  border-width: var(--border-emphasis);
  border-color: var(--color-contrast-on-surface);
  opacity: 1;
}

/* Interactive hover state */
.avatar--interactive {
  cursor: pointer;
  transition: border-width var(--motion-duration-fast);
}

.avatar--interactive:hover {
  border-width: var(--border-emphasis);
}
```

#### SVG ClipPath for Hexagon

```html
<svg width="0" height="0">
  <defs>
    <clipPath id="rounded-hexagon" clipPathUnits="objectBoundingBox">
      <polygon points="0.5,0 0.933,0.25 0.933,0.75 0.5,1 0.067,0.75 0.067,0.25" />
      <circle cx="0.5" cy="0.05" r="0.05" />
      <circle cx="0.933" cy="0.25" r="0.05" />
      <circle cx="0.933" cy="0.75" r="0.05" />
      <circle cx="0.5" cy="0.95" r="0.05" />
      <circle cx="0.067" cy="0.75" r="0.05" />
      <circle cx="0.067" cy="0.25" r="0.05" />
    </clipPath>
  </defs>
</svg>
```

### iOS Implementation

#### SwiftUI View

```swift
struct Avatar: View {
    let type: AvatarType
    let size: AvatarSize
    var src: URL? = nil
    var alt: String? = nil
    var interactive: Bool = false
    var decorative: Bool = false
    var testID: String? = nil
    
    var body: some View {
        avatarContent
            .frame(width: size.dimension, height: size.dimension)
            .clipShape(shape)
            .overlay(shape.stroke(borderColor, lineWidth: borderWidth))
            .accessibilityHidden(decorative)
            .accessibilityIdentifier(testID ?? "")
    }
    
    @ViewBuilder
    private var avatarContent: some View {
        if let src = src, type == .human {
            AsyncImage(url: src) { image in
                image.resizable().scaledToFill()
            } placeholder: {
                iconPlaceholder
            }
        } else {
            iconPlaceholder
        }
    }
    
    @ViewBuilder
    private var shape: some Shape {
        switch type {
        case .human: Circle()
        case .agent: RoundedPointyTopHexagon()
        }
    }
}
```

#### Custom Hexagon Shape

```swift
struct RoundedPointyTopHexagon: Shape {
    let cornerRadius: CGFloat = 0.05
    
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let width = rect.width
        let height = rect.height
        
        // Calculate hexagon vertices (pointy-top orientation)
        let vertices = [
            CGPoint(x: width * 0.5, y: 0),
            CGPoint(x: width * 0.933, y: height * 0.25),
            CGPoint(x: width * 0.933, y: height * 0.75),
            CGPoint(x: width * 0.5, y: height),
            CGPoint(x: width * 0.067, y: height * 0.75),
            CGPoint(x: width * 0.067, y: height * 0.25),
        ]
        
        // Draw path with rounded corners using addArc
        for i in 0..<vertices.count {
            let current = vertices[i]
            let next = vertices[(i + 1) % vertices.count]
            let prev = vertices[(i - 1 + vertices.count) % vertices.count]
            
            // Add arc for rounded corner
            path.addArc(tangent1End: current, tangent2End: next, radius: cornerRadius * min(width, height))
        }
        
        path.closeSubpath()
        return path
    }
}
```


### Android Implementation

#### Compose Component

```kotlin
@Composable
fun Avatar(
    type: AvatarType,
    size: AvatarSize,
    src: String? = null,
    alt: String? = null,
    interactive: Boolean = false,
    decorative: Boolean = false,
    testID: String? = null,
    modifier: Modifier = Modifier
) {
    val shape = when (type) {
        AvatarType.Human -> CircleShape
        AvatarType.Agent -> HexagonShape()
    }
    
    Box(
        modifier = modifier
            .size(size.dimension.dp)
            .clip(shape)
            .border(
                width = if (size == AvatarSize.XXL) BorderEmphasis else BorderDefault,
                color = borderColor,
                shape = shape
            )
            .semantics {
                if (decorative) invisibleToUser()
                testTag = testID ?: ""
            },
        contentAlignment = Alignment.Center
    ) {
        if (src != null && type == AvatarType.Human) {
            AsyncImage(
                model = src,
                contentDescription = alt,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
        } else {
            Icon(
                imageVector = if (type == AvatarType.Human) Icons.Person else Icons.SmartToy,
                contentDescription = null,
                tint = iconColor,
                modifier = Modifier.size(size.iconDimension.dp)
            )
        }
    }
}
```

#### Custom Hexagon Shape

```kotlin
class HexagonShape : Shape {
    override fun createOutline(
        size: Size,
        layoutDirection: LayoutDirection,
        density: Density
    ): Outline {
        val path = Path().apply {
            val width = size.width
            val height = size.height
            val cornerRadius = 0.05f * minOf(width, height)
            
            // Hexagon vertices (pointy-top orientation)
            val vertices = listOf(
                Offset(width * 0.5f, 0f),
                Offset(width * 0.933f, height * 0.25f),
                Offset(width * 0.933f, height * 0.75f),
                Offset(width * 0.5f, height),
                Offset(width * 0.067f, height * 0.75f),
                Offset(width * 0.067f, height * 0.25f),
            )
            
            // Draw path with rounded corners using quadraticBezierTo
            moveTo(vertices[0].x, vertices[0].y + cornerRadius)
            for (i in vertices.indices) {
                val current = vertices[i]
                val next = vertices[(i + 1) % vertices.size]
                
                lineTo(current.x, current.y)
                quadraticBezierTo(
                    current.x, current.y,
                    (current.x + next.x) / 2, (current.y + next.y) / 2
                )
            }
            close()
        }
        return Outline.Generic(path)
    }
}
```

---

## Error Handling

### Image Loading Errors

**Web**:
```typescript
private handleImageError() {
  // Remove src attribute to trigger fallback to icon
  this.removeAttribute('src');
  this.render();
}
```

**iOS**:
```swift
AsyncImage(url: src) { phase in
    switch phase {
    case .success(let image):
        image.resizable().scaledToFill()
    case .failure(_), .empty:
        iconPlaceholder
    @unknown default:
        iconPlaceholder
    }
}
```

**Android**:
```kotlin
AsyncImage(
    model = src,
    contentDescription = alt,
    error = painterResource(R.drawable.avatar_placeholder),
    placeholder = painterResource(R.drawable.avatar_placeholder),
)
```

### Invalid Props

| Prop | Invalid Value | Behavior |
|------|---------------|----------|
| `type` | undefined | Default to "human" |
| `size` | undefined | Default to "md" |
| `src` on agent | any value | Ignored (agents don't support images) |
| `src` without `alt` | missing alt | Console warning in development |


---

## Testing Strategy

### Test Categories

Based on Test Development Standards, all Avatar tests are evergreen (permanent value):

| Test File | Category | What It Tests |
|-----------|----------|---------------|
| `Avatar.test.ts` | Core API | Props, defaults, type/size combinations |
| `Avatar.accessibility.test.ts` | Accessibility | `aria-hidden`, `alt` text, decorative mode |
| `Avatar.lifecycle.test.ts` | Web Component | Custom element registration, shadow DOM |
| `Avatar.rendering.test.ts` | Visual | Shape classes, size classes, border styles |
| `Avatar.icon-integration.test.ts` | Integration | Icon component usage, correct icon sizes |
| `Avatar.image.test.ts` | Image Handling | Loading, fallback, error states |

### Web Component Testing Pattern

```typescript
describe('Avatar Web Component', () => {
  beforeAll(() => {
    if (!customElements.get('avatar-base')) {
      customElements.define('avatar-base', AvatarBaseElement);
    }
  });

  beforeEach(async () => {
    await customElements.whenDefined('avatar-base');
  });

  it('should render with correct shape class', async () => {
    const element = document.createElement('avatar-base') as AvatarBaseElement;
    element.setAttribute('type', 'agent');
    document.body.appendChild(element);
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const container = element.shadowRoot?.querySelector('.avatar');
    expect(container?.classList.contains('avatar--agent')).toBe(true);
    
    document.body.removeChild(element);
  });
});
```

### Icon Integration Testing Pattern

```typescript
// ✅ GOOD - Tests contract (CSS class for token-based sizing)
it('should use correct icon size for md avatar', () => {
  const avatar = createAvatar({ type: 'human', size: 'md' });
  const iconSpan = avatar.querySelector('.avatar__icon');
  expect(iconSpan!.innerHTML).toContain('icon--size-075');
});
```

### Cross-Platform Consistency Tests

```typescript
describe('Avatar Cross-Platform Consistency', () => {
  const platforms = ['web', 'ios', 'android'];
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
  
  sizes.forEach(size => {
    it(`should use identical token for ${size} across platforms`, () => {
      platforms.forEach(platform => {
        const token = getAvatarSizeToken(size, platform);
        expect(token).toBe(`avatar.size.${size}`);
      });
    });
  });
});
```

---

## Design Decisions

### Decision 1: Shape-Based Entity Differentiation

**Options Considered**:
1. Color-only differentiation (human = orange, agent = teal)
2. Icon-only differentiation (human = person icon, agent = robot icon)
3. Shape-based differentiation (human = circle, agent = hexagon)
4. Badge-based differentiation (small indicator on avatar)

**Decision**: Shape-based differentiation (Option 3)

**Rationale**: 
Shape provides instant visual recognition without relying on color alone, improving accessibility for colorblind users. The circle-hexagon distinction is immediately apparent even at small sizes and in peripheral vision. This aligns with emerging AI interface patterns where distinct shapes communicate entity type.

**Trade-offs**:
- ✅ **Gained**: Accessibility, instant recognition, future-proof for AI interfaces
- ❌ **Lost**: Simplicity (hexagon requires custom shape implementation)
- ⚠️ **Risk**: Hexagon may be less recognizable at very small sizes

**Counter-Arguments**:
- **Argument**: Color differentiation is simpler and widely understood
- **Response**: Color alone fails WCAG accessibility requirements and doesn't work for colorblind users

### Decision 2: Pointy-Top Hexagon Orientation

**Options Considered**:
1. Flat-top hexagon (horizontal edge at top)
2. Pointy-top hexagon (vertex at top)

**Decision**: Pointy-top hexagon (Option 2)

**Rationale**:
Pointy-top orientation creates a more dynamic, crystalline feel that better represents the "constructed" nature of AI agents. It also provides better visual distinction from circles — a flat-top hexagon can appear more circular at small sizes.

**Trade-offs**:
- ✅ **Gained**: Dynamic feel, better distinction from circles
- ❌ **Lost**: None significant
- ⚠️ **Risk**: Slightly more complex geometry calculations

### Decision 3: SVG ClipPath for Rounded Hexagon (Web)

**Options Considered**:
1. CSS `clip-path: polygon()` — no rounded corners
2. CSS `clip-path: shape()` — rounded corners but limited browser support
3. SVG `<clipPath>` with polygon + circles — rounded corners, good support
4. Canvas-based rendering — full control but complex

**Decision**: SVG clipPath with polygon + circles (Option 3, Ana Tudor technique)

**Rationale**:
This approach provides rounded corners with excellent browser support. The `clipPathUnits="objectBoundingBox"` makes it responsive without JavaScript. CSS `shape()` would be ideal but lacks sufficient browser support as of 2024.

**Trade-offs**:
- ✅ **Gained**: Rounded corners, responsive, good browser support
- ❌ **Lost**: Requires SVG element in DOM
- ⚠️ **Risk**: Future migration needed when CSS `shape()` support improves

**Counter-Arguments**:
- **Argument**: CSS `shape()` is the future, should use it now
- **Response**: Browser support is insufficient for production use; SVG provides a migration path


### Decision 4: Wrapper-Delegated Interaction

**Options Considered**:
1. Avatar handles its own click events (`onPress` prop)
2. Avatar provides visual feedback only, wrapper handles interaction
3. Avatar is purely presentational, no interactive features

**Decision**: Avatar provides visual feedback only (Option 2)

**Rationale**:
Separating visual feedback from interaction handling keeps Avatar simple and pushes accessibility concerns (focus ring, touch targets, accessible names) to the wrapper where they belong. This follows the pattern used by other design systems and ensures proper accessibility without duplicating focus management logic.

**Trade-offs**:
- ✅ **Gained**: Simpler component, proper accessibility, clear responsibility
- ❌ **Lost**: Convenience of self-contained interactive avatar
- ⚠️ **Risk**: Developers might forget to add proper wrapper

**Counter-Arguments**:
- **Argument**: Self-contained interactive avatar is more convenient
- **Response**: Convenience at the cost of accessibility is not acceptable; wrapper pattern is standard

### Decision 5: Icons Only (No Initials in v1)

**Options Considered**:
1. Support both icons and initials
2. Icons only
3. Initials only

**Decision**: Icons only (Option 2)

**Rationale**:
Scope reduction for v1. Initials require additional complexity (text sizing, font handling, character extraction from names) that can be added in a future spec. Icons provide a consistent fallback that works for all cases.

**Trade-offs**:
- ✅ **Gained**: Reduced scope, faster delivery, simpler implementation
- ❌ **Lost**: Initials feature (common in other avatar components)
- ⚠️ **Risk**: May need to add initials sooner than expected

### Decision 6: Single Background Color Per Type

**Options Considered**:
1. Multiple color options per type (orange, blue, green for humans)
2. Single fixed color per type (orange for humans, teal for agents)
3. User-customizable colors

**Decision**: Single fixed color per type (Option 2)

**Rationale**:
Scope reduction for v1 and semantic clarity. A single color per type reinforces the shape-based differentiation and simplifies the token structure. Multi-color options can be added in a future spec.

**Trade-offs**:
- ✅ **Gained**: Semantic clarity, simpler tokens, reduced scope
- ❌ **Lost**: Visual variety for human avatars
- ⚠️ **Risk**: Users may want color variety sooner than expected

### Decision 7: Decorative Prop for Accessibility Control

**Options Considered**:
1. Infer decorative state from context (adjacent to name text)
2. Explicit `decorative` prop
3. Always announce to screen readers

**Decision**: Explicit `decorative` prop (Option 2)

**Rationale**:
Context inference is fragile and error-prone. An explicit prop gives developers clear control over accessibility behavior. When `decorative={true}`, the avatar is hidden from screen readers with `aria-hidden="true"`.

**Trade-offs**:
- ✅ **Gained**: Clear developer control, predictable behavior
- ❌ **Lost**: Automatic context detection
- ⚠️ **Risk**: Developers might forget to set the prop

---

## Accessibility

### Screen Reader Behavior

| Scenario | Behavior |
|----------|----------|
| Image avatar with `alt` | Announces alt text |
| Placeholder avatar (no image) | Announces "Avatar" or similar |
| `decorative={true}` | Hidden from screen readers (`aria-hidden="true"`) |
| Interactive wrapper | Wrapper provides accessible name |

### Color Contrast

Both avatar backgrounds must meet WCAG AA contrast requirements with white icons:

| Background | Icon Color | Expected Ratio | Requirement |
|------------|------------|----------------|-------------|
| `orange300` | `white100` | ≥ 4.5:1 | WCAG AA |
| `teal300` | `white100` | ≥ 4.5:1 | WCAG AA |

**Note**: Verify actual contrast ratios during implementation with the specific color values.

### Focus and Touch Targets

Avatar itself does not manage focus or touch targets. When used in interactive contexts:

- Wrapper (button/link) provides visible focus indicator
- Wrapper provides minimum 44px touch target
- Wrapper provides accessible name via `aria-label`

---

## Related Documentation

- **Design Outline**: `.kiro/specs/042-avatar-component/design-outline.md` — Original design exploration and decisions
- **Requirements**: `.kiro/specs/042-avatar-component/requirements.md` — EARS format requirements and acceptance criteria
- **Test Development Standards**: `.kiro/steering/Test-Development-Standards.md` — Testing patterns and guidelines
- **Component Development Guide**: `.kiro/steering/Component-Development-Guide.md` — Token selection and component patterns

---

**Organization**: spec-guide
**Scope**: 042-avatar-component
