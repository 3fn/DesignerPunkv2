# Avatar Component - Design Outline

**Date**: January 16, 2026
**Purpose**: Capture design decisions and token requirements before creating full spec
**Status**: Design Outline (Pre-Requirements) - FINALIZED

---

## Component Overview

Avatar component for representing users (Human) and AI agents (Agent) with distinct visual shapes. Humans are represented by circles (organic, natural), while AI agents are represented by hexagons (synthetic, constructed). Follows True Native Architecture with build-time platform separation for web, iOS, and Android.

**Key Characteristics**:
- **Human**: Circle shape, orange300 background OR image, white icon
- **Agent**: Hexagon shape (pointy-top, rounded corners), teal300 background, white icon
- **Content**: Icons only (no initials in v1)
- **Interactive**: Hover visual feedback only (wrapper handles actual interaction)

---

## Architecture

### Component Structure

```
Avatar (Core Component)
├── type="human" | "agent" (prop determines shape)
├── Handles all rendering, states, content types
└── Self-contained atomic unit

Avatar-Group (Future - Separate Spec)
├── Composes multiple Avatar instances
├── Handles stacking, overlap, "+N" overflow
└── Doesn't extend Avatar, just uses it
```

**Design Pattern**: Prop-based variants (like Button-CTA) rather than separate components.

---

## Shape Philosophy

### Human vs AI Agent Distinction

**Human Avatars (Circle)**:
- **Shape**: Perfect circle (border-radius: 50%)
- **Rationale**: Circles are organic, natural, and universally associated with human faces
- **Implementation**: Simple CSS/SwiftUI/Compose border-radius

**AI Agent Avatars (Hexagon)**:
- **Shape**: Regular hexagon (6-sided polygon), pointy-top orientation
- **Rationale**: Hexagons feel synthetic, constructed, and technological
- **Implementation**: SVG clipPath (web), UIBezierPath (iOS), Path (Android)

**Why This Matters**:
- Instant visual differentiation without relying on color alone (accessibility)
- Shape communicates entity type before any other context
- Aligns with emerging AI interface patterns (distinct AI identity)

### Shape Recognition at Small Sizes

**All sizes available for both shapes**: Both circle and hexagon avatars support all six sizes (xs through xxl). While hexagons at xs (24px) are small, the shape distinction remains visible and users may have valid use cases for small hexagon avatars.

### Hexagon Geometry

**Regular Hexagon Properties**:
- All sides equal length
- Internal angles: 120°
- Pointy-top orientation: Height > Width

**Orientation Decision**: Pointy-top hexagon ✅
- **Rationale**: More dynamic, crystalline feel; better visual distinction from circles
- **Vertex at top**: Creates a more "constructed" appearance fitting for AI agents

**Aspect Ratio**: `cos(30°) ≈ 0.866`
- Width = Height × cos(30°) = Height × 0.866
- Example: 48px height → 41.6px width

### Rounded Hexagon Implementation

**Approach**: SVG `<clipPath>` with polygon + circles at vertices (Ana Tudor technique)

**Why SVG clipPath?**
- CSS `clip-path: polygon()` cannot have rounded corners
- CSS `clip-path: shape()` supports rounded corners but has limited browser support (2024+)
- SVG clipPath with `clipPathUnits="objectBoundingBox"` is responsive and well-supported

**Implementation Pattern**:
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

**Future Migration Path**: CSS `clip-path: shape()` when browser support improves.

---

## Sizing Specifications

### Size Variants

Six sizes derived from the spacing token system:

| Size | Avatar | Icon | Spacing Token | Use Case |
|------|--------|------|---------------|----------|
| **xs** | 24px | 12px | `space300` | Inline mentions, dense lists |
| **sm** | 32px | 16px | `space400` | List items, comments, compact UI |
| **md** | 40px | 20px | `space500` | Standard cards, messages |
| **lg** | 48px | 24px | `space600` | Profile headers, featured content |
| **xl** | 80px | 40px | calculated | Profile pages, hero sections |
| **xxl** | 128px | 64px | calculated | Profile hero, featured profiles |

Where `base = SPACING_BASE_VALUE = 8px`

### Icon Sizing (50% Ratio)

Icons are always 50% of avatar height:

| Avatar Size | Icon Size | Icon Token Source |
|-------------|-----------|-------------------|
| xs (24px) | 12px | Component token: `SPACING_BASE_VALUE * 1.5` |
| sm (32px) | 16px | `icon.size050` |
| md (40px) | 20px | `icon.size075` |
| lg (48px) | 24px | `icon.size100` |
| xl (80px) | 40px | `icon.size500` |
| xxl (128px) | 64px | Component token: `SPACING_BASE_VALUE * 8` |

**Note**: Two component tokens needed for gaps (12px and 64px), rest reference existing icon size tokens.

### Mathematical Relationships

**8px Baseline Grid Alignment**:
- 24px = 3 × 8 ✅ (space300)
- 32px = 4 × 8 ✅ (space400)
- 40px = 5 × 8 ✅ (space500)
- 48px = 6 × 8 ✅ (space600)
- 80px = 10 × 8 ✅ (calculated)
- 128px = 16 × 8 ✅ (calculated)

---

## Visual Styles

### Background Colors

**Human Avatars**:
- **Background**: `orange300` (single color, no multi-color options)
- **Image support**: Human avatars can accept images (profile photos)
- **Semantic token**: `color.avatar.human` → `orange300`

**AI Agent Avatars**:
- **Background**: `teal300` (fixed, no variation)
- **No image support**: AI agents use solid color backgrounds only
- **Semantic token**: `color.avatar.agent` → `teal300`

### Icon Colors

**Both avatar types use white icons**:
- **Human**: `color.avatar.contrast.onHuman` → `white100`
- **Agent**: `color.avatar.contrast.onAgent` → `white100`

**Note**: Two separate tokens for future flexibility (may diverge later).

### Border Styles

**Size-Based Border Specifications**:

| Size Range | Border Width | Border Color | Opacity |
|------------|--------------|--------------|---------|
| xs - xl | `borderDefault` (1px) | `color.avatar.border` | `opacity.heavy` (48%) |
| xxl | `borderEmphasis` (2px) | `white100` | none (100%) |

**Semantic token**: `color.avatar.border` → `gray100`

### Interactive States

**Interactive Avatars**: Avatars can show hover visual feedback via the `interactive` prop.

**Hover State** (interactive avatars only):
- Border width increases from `borderDefault` (1px) to `borderEmphasis` (2px)
- Similar pattern to Button-CTA secondary and Button-Icon secondary hover states
- Provides visual affordance that avatar is interactive

**State Transitions**:
| State | Border Width | Transition |
|-------|--------------|------------|
| Default | `borderDefault` (1px) | - |
| Hover | `borderEmphasis` (2px) | `motion.duration.fast` |

**Important**: 
- **No `onPress` prop** - actual click handling is the wrapper's responsibility
- **No focus ring** on avatar itself - wrapper handles focus
- **No touch target expansion** - wrapper handles accessibility

**Usage Pattern**:
```tsx
<button onClick={handleClick} aria-label="View John's profile">
  <Avatar type="human" size="md" src="..." interactive />
</button>
```

---

## Content Types

### Image Avatar (Human only)
- **Use case**: User profile photo
- **Fallback**: Icon placeholder when no image
- **Image fit**: `object-fit: cover` (web), `.scaledToFill()` (iOS), `ContentScale.Crop` (Android)

### Icon Avatar (Both types)
- **Use case**: Default content for all avatars
- **Human placeholder**: Generic person icon (user silhouette)
- **Agent placeholder**: Generic bot/AI icon (robot or sparkle)
- **Icon component**: Uses Icon-Base component, specific icons TBD

**Note**: Initials are NOT supported in v1 - icons only.

---

## Token Requirements

### New Semantic Color Tokens (5 tokens)

```typescript
// Background colors
'color.avatar.human': {
  primitiveReferences: { value: 'orange300' },
  context: 'Background color for human avatars',
  description: 'Orange background for human avatar circles'
},

'color.avatar.agent': {
  primitiveReferences: { value: 'teal300' },
  context: 'Background color for AI agent avatars',
  description: 'Teal background for AI agent hexagons'
},

// Icon contrast colors
'color.avatar.contrast.onHuman': {
  primitiveReferences: { value: 'white100' },
  context: 'Icon color on human avatar background',
  description: 'White icon color for contrast on orange human avatars'
},

'color.avatar.contrast.onAgent': {
  primitiveReferences: { value: 'white100' },
  context: 'Icon color on AI agent avatar background',
  description: 'White icon color for contrast on teal agent avatars'
},

// Border color
'color.avatar.border': {
  primitiveReferences: { value: 'gray100' },
  context: 'Border color for avatars',
  description: 'Subtle gray border for avatar definition'
}
```

### New Component Tokens (2 tokens for icon sizing gaps)

```typescript
// Icon size for xs avatar (12px - no existing icon token)
'avatar.icon.size.xs': {
  value: SPACING_BASE_VALUE * 1.5,  // 8 × 1.5 = 12
  derivation: 'spacingBase × 1.5'
},

// Icon size for xxl avatar (64px - no existing icon token)
'avatar.icon.size.xxl': {
  value: SPACING_BASE_VALUE * 8,    // 8 × 8 = 64
  derivation: 'spacingBase × 8'
}
```

### Avatar Size Tokens (6 tokens)

```typescript
'avatar.size.xs': { value: 'space300' },           // 24px
'avatar.size.sm': { value: 'space400' },           // 32px
'avatar.size.md': { value: 'space500' },           // 40px
'avatar.size.lg': { value: 'space600' },           // 48px
'avatar.size.xl': { 
  value: SPACING_BASE_VALUE * 10,                  // 80px
  derivation: 'spacingBase × 10'
},
'avatar.size.xxl': { 
  value: SPACING_BASE_VALUE * 16,                  // 128px
  derivation: 'spacingBase × 16'
}
```

### Existing Tokens Used

**Icon Sizes** (for avatar icons):
- `icon.size050` (16px) - sm avatar
- `icon.size075` (20px) - md avatar
- `icon.size100` (24px) - lg avatar
- `icon.size500` (40px) - xl avatar

**Border**:
- `borderDefault` → `borderWidth100` (1px) - Standard border
- `borderEmphasis` → `borderWidth200` (2px) - Hero border and hover state

**Opacity**:
- `opacity.heavy` → `opacity600` (48%) - Border opacity for xs-xl sizes

**Motion**:
- `motion.duration.fast` - Hover transition duration

---

## Component API Design

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
  
  /** Hide from screen readers (use when avatar is decorative, e.g., adjacent to name text) */
  decorative?: boolean;
  
  /** Test ID for automated testing */
  testID?: string;
}
```

**Removed props** (from earlier drafts):
- `name` - No initials support in v1
- `initials` - No initials support in v1
- `backgroundColor` - Single color per type, no customization
- `onPress` - Wrapper handles actual interaction
- `icon` - Uses default placeholder icons

### Usage Examples

```tsx
// Human with image
<Avatar type="human" size="md" src="/photos/john.jpg" alt="John Doe" />

// Human placeholder (no image)
<Avatar type="human" size="lg" />

// AI Agent
<Avatar type="agent" size="md" />

// Interactive human avatar (wrapper handles click)
<button onClick={handleClick} aria-label="View John's profile">
  <Avatar type="human" size="md" src="/photos/john.jpg" alt="John Doe" interactive />
</button>

// Interactive AI agent avatar
<button onClick={openAgentDetails} aria-label="View Kiro details">
  <Avatar type="agent" size="lg" interactive />
</button>

// Hero-sized avatar (xxl with white border)
<Avatar type="human" size="xxl" src="/photos/featured.jpg" alt="Featured User" />
```

---

## Accessibility

### Screen Readers
- **Image avatars**: `alt` text describes the person (e.g., "Profile photo of John Doe")
- **Placeholder avatars**: `aria-hidden="true"` when adjacent to name text
- **Interactive avatars**: Wrapper button provides accessible name

### Color Contrast
- **White icon on orange300**: Verify meets WCAG AA (4.5:1)
- **White icon on teal300**: Verify meets WCAG AA (4.5:1)

### Touch Targets & Focus
- **Handled by wrapper**: Avatar itself doesn't manage focus or touch targets
- **Wrapper responsibility**: Button/link wrapper provides 44px minimum touch target
- **Wrapper responsibility**: Button/link wrapper provides visible focus indicator

---

## Platform-Specific Considerations

### Web Implementation

**Circle (Human)**:
```css
.avatar-human {
  border-radius: 50%;
  overflow: hidden;
}
```

**Hexagon (Agent)**:
```css
.avatar-agent {
  height: var(--avatar-size);
  aspect-ratio: cos(30deg);
  clip-path: url(#rounded-hexagon);
}
```

**Interactive Hover State**:
```css
.avatar--interactive {
  cursor: pointer;
  transition: border-width var(--motion-duration-fast);
}

.avatar--interactive:hover {
  border-width: var(--border-emphasis);
}
```

### iOS Implementation

**Circle (Human)**:
```swift
Image(uiImage: image)
    .resizable()
    .scaledToFill()
    .frame(width: size, height: size)
    .clipShape(Circle())
    .overlay(Circle().stroke(borderColor, lineWidth: borderWidth))
```

**Hexagon (Agent)**: Custom `RoundedPointyTopHexagon` Shape with `addArc` for rounded vertices.

### Android Implementation

**Circle (Human)**:
```kotlin
Image(
    modifier = Modifier
        .size(size.dp)
        .clip(CircleShape)
        .border(borderWidth, borderColor, CircleShape),
    contentScale = ContentScale.Crop
)
```

**Hexagon (Agent)**: Custom `GenericShape` with `quadraticBezierTo` for rounded vertices.

---

## Design Decisions Summary

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Shape-based entity differentiation | Accessibility, instant recognition |
| 2 | Pointy-top hexagon orientation | Dynamic feel, better distinction from circles |
| 3 | Mathematically pure hexagon (0.866 ratio) | Authenticity, enhanced visual distinction |
| 4 | Six sizes from spacing tokens | Mathematical consistency, token reuse |
| 5 | Icons only (no initials) | Scope reduction for v1 |
| 6 | Single background color per type | Scope reduction, semantic clarity |
| 7 | SVG clipPath for rounded hexagon | Browser support, responsive |
| 8 | Interactive = hover visual only | Wrapper handles actual interaction |
| 9 | No onPress prop | Accessibility handled by wrapper |
| 10 | Size-based border specs | Visual hierarchy for hero sizes |
| 11 | 50% icon-to-avatar ratio | Consistent optical balance |
| 12 | Two contrast tokens (same value) | Future flexibility |

---

## Testing Considerations

Based on Test Development Standards, Avatar tests should follow these patterns:

### Web Component Testing (Web Platform)

Avatar will be implemented as `<avatar-base>` custom element. Tests must handle async lifecycle:

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

  it('should render with correct shape', async () => {
    const element = document.createElement('avatar-base') as AvatarBaseElement;
    element.setAttribute('type', 'agent');
    element.setAttribute('size', 'md');
    document.body.appendChild(element);
    
    // Wait for connectedCallback to fire
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Now shadow DOM is ready
    const container = element.shadowRoot?.querySelector('.avatar');
    expect(container?.classList.contains('avatar--hexagon')).toBe(true);
    
    document.body.removeChild(element);
  });
});
```

### Icon Integration Testing

Test the integration contract, not Icon's internal implementation:

```typescript
// ✅ GOOD - Tests contract (CSS class for token-based sizing)
it('should use correct icon size for md avatar', () => {
  const avatar = createAvatar({ type: 'human', size: 'md' });
  const iconSpan = avatar.querySelector('.avatar__icon');
  expect(iconSpan!.innerHTML).toContain('icon--size-075'); // 20px
});

// ❌ BAD - Tests Icon's implementation detail
it('should render 20px icon', () => {
  const avatar = createAvatar({ type: 'human', size: 'md' });
  const iconSpan = avatar.querySelector('.avatar__icon');
  expect(iconSpan!.innerHTML).toContain('width="20"'); // Don't do this
});
```

### Token-Based Assertions

Test CSS classes and token references, not computed pixel values:

```typescript
// ✅ GOOD - Tests token-based sizing
it('should apply correct size class', () => {
  const avatar = createAvatar({ type: 'human', size: 'lg' });
  expect(avatar.classList.contains('avatar--size-lg')).toBe(true);
});

// ❌ BAD - Tests pixel values
it('should be 48px', () => {
  const avatar = createAvatar({ type: 'human', size: 'lg' });
  expect(getComputedStyle(avatar).height).toBe('48px'); // Don't do this
});
```

### Evergreen Test Categories

All Avatar tests should be evergreen (permanent value):

| Test Category | What to Test |
|---------------|--------------|
| **Shape Rendering** | Circle for human, hexagon for agent |
| **Size Variants** | Correct CSS class per size prop |
| **Icon Integration** | Correct icon size class per avatar size |
| **Image Handling** | Image display, fallback to icon on error |
| **Accessibility** | `aria-hidden` when decorative, `alt` on images |
| **Border Styles** | Correct border width/color per size |
| **Interactive State** | Hover border change when `interactive` |
| **Cross-Platform** | Consistent token usage across platforms |

### Test File Organization

```
src/components/core/Avatar/__tests__/
├── Avatar.test.ts                    # Core API tests
├── Avatar.accessibility.test.ts      # ARIA, screen reader tests
├── Avatar.lifecycle.test.ts          # Web component lifecycle
├── Avatar.rendering.test.ts          # Shape, size, border rendering
├── Avatar.icon-integration.test.ts   # Icon component integration
└── Avatar.image.test.ts              # Image loading, fallback
```

---

## Future Enhancements (Separate Specs)

1. **Avatar-Group**: Stacked avatars with overlap and "+N" indicator
2. **Status Indicators**: Online, offline, busy, away badges
3. **Initials Support**: Text content as alternative to icons
4. **Multi-color Human Backgrounds**: Expanded color palette options
5. **Custom Icons**: User-specified icons instead of defaults

---

## Next Steps

1. ✅ **Design outline finalized** - All decisions documented
2. ⏳ **Create requirements.md** - EARS format with user stories and acceptance criteria
3. ⏳ **Create design.md** - Detailed component architecture and token integration
4. ⏳ **Create tasks.md** - Implementation plan with task type classification
5. ⏳ **Build the component** - Implement across all three platforms

---

**Organization**: spec-guide
**Scope**: 042-avatar-component
