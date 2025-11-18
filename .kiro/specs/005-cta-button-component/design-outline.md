# CTA Button Component - Design Outline

**Date**: November 18, 2025
**Purpose**: Capture design decisions and token requirements before creating full spec
**Status**: Design Outline (Pre-Requirements)

---

## Component Overview

Call-to-action button component with three sizes, three visual styles, and full interaction states. Follows True Native Architecture with build-time platform separation for web, iOS, and Android.

---

## Sizing Specifications

### Size Variants

Three sizes following semantic naming (small, medium, large):

| Size | Total Height | Typography | Line Height (computed → rendered) | V-Padding (each) | H-Padding (each) | Border Radius |
|------|--------------|------------|-----------------------------------|------------------|------------------|---------------|
| **Small** | 40px (5 × 8) | typography.bodyMd | 24px (16 × 1.5) | 8px (space.inset.normal) | 16px (space.inset.spacious) | radius100 (8px) |
| **Medium** | 48px (6 × 8) | typography.bodyMd | 24px (16 × 1.5) | 12px (space.inset.comfortable) | 24px (space.inset.expansive) | radius150 (12px) |
| **Large** | 56px (7 × 8) | typography.bodyLg | 31.5px → 32px (18 × 1.75) | 12px (space.inset.comfortable) | 32px (space.inset.generous) | radius200 (16px) |

### Mathematical Relationships

**Padding Ratio**: 2:1 (width:height)
- Small: 16px H-padding, 40px height = 2:1 ✅
- Medium: 24px H-padding, 48px height = 2:1 ✅
- Large: 32px H-padding, 56px height = 2.29:1 ≈ 2:1 ✅

**Vertical Rhythm Alignment**:
- All heights are multiples of 8px (40, 48, 56)
- Maintains vertical rhythm for page layout
- Components align to 8px baseline grid

**Height Calculation**:
```
Button Height = Line Height (rendered) + (Vertical Padding × 2)
Vertical Padding = (Target Height - Line Height rendered) / 2
```

**Line Height Rendering Note**:
- Typography tokens store line height as ratios (e.g., 1.75)
- Computed line height = fontSize × lineHeight ratio
- Browsers round computed line heights to whole pixels
- Example: bodyLg = 18px × 1.75 = 31.5px (computed) → 32px (rendered)

### Width Behaviors

**Fluid**: Button fills container width
- Implementation: `width: 100%`
- Use case: Mobile layouts, full-width CTAs

**Adaptive**: Button conforms to content width with padding
- Implementation: `width: auto`
- Use case: Inline buttons, content-driven sizing

### Text Behavior

**Alignment**: Content (text or icon+text) always centered horizontally within button

**Wrapping**: 
- **Default**: Single-line with wrapping allowed if text exceeds button width
- **Optional**: `noWrap` prop for truncation with ellipsis
- **Height**: Button height grows to accommodate wrapped text while maintaining minimum height

**Rationale**: Wrapping improves accessibility (full text visible), supports long translations, better for responsive layouts

### Minimum Width (Accessibility)

**Formula**: `minWidth = Button Height + (V-padding × 2)`

**Calculated Values**:
- Small: 40px + (8px × 2) = **56px**
- Medium: 48px + (12px × 2) = **72px**
- Large: 56px + (12px × 2) = **80px**

**Rationale**:
- Creates roughly square minimum proportions
- Prevents awkwardly narrow buttons with short text ("OK", "Go")
- Ensures adequate touch target width for accessibility
- Maintains visual balance across all sizes

### Icon Support (Optional)

**Icon Sizing**: Icons match the rendered line height of the button's typography
- Small: 24px (matches bodyMd line height)
- Medium: 24px (matches bodyMd line height)
- Large: 32px (matches bodyLg line height)

**Icon Placement**: Leading icon (left of text) only
- Icon-only buttons are a separate button type (not included in this spec)

**Icon-Text Spacing**:
- Small: 4px (space.grouped.tight) - compact spacing for smaller buttons
- Medium: 8px (space.grouped.normal) - standard spacing
- Large: 8px (space.grouped.normal) - standard spacing

**Icon Color**: Inherits text color from button style
- Primary: color.text.onPrimary
- Secondary: color.primary
- Tertiary: color.primary

**Icon Alignment**: 
- **Vertical**: Centered to button height (not text baseline)
- **Horizontal**: Leading position (start of text direction)
- **RTL Support**: Icon position flips to trailing in RTL languages
- **Content Centering**: Entire content (icon + gap + text) centered as unit within button

**Platform Implementation**:
- **Web**: CSS logical properties (`padding-inline`, `margin-inline-start`) with flexbox centering
- **iOS**: HStack with `.center` alignment (SF Symbols may need explicit centering override)
- **Android**: Row with `Alignment.CenterVertically`

### Icon Format & Source

**Status:** ⚠️ **BLOCKED** - Awaiting Icon System spec (#004) completion

**Dependency:** This button spec requires Icon System spec (#004) to be completed first.

**Icon Source:** Feather Icons (280+ icons in `icons-feather/` directory)
- Consistent 24x24 grid, stroke-based design
- `stroke="currentColor"` enables automatic color inheritance
- Proven cross-platform compatibility

**Icon Component API (Expected):**
```typescript
<Icon name="arrow-right" size={24} />
<Icon name="check" size={32} />
```

**Checkpoint:** Before proceeding to requirements.md for this spec:
1. Complete Icon System spec (#004) requirements, design, and implementation
2. Verify Icon component API supports sizes: 16px, 24px, 32px, 40px
3. Confirm icon sizes align with button line heights (24px for small/medium, 32px for large)
4. Verify color inheritance (currentColor) works across all platforms
5. Confirm type safety (IconName type) is implemented
6. Update this design outline with final icon integration details

**Icons Needed for CTA Button:**
- `arrow-right` - Forward actions
- `check` - Confirmation actions
- `plus` - Add/create actions
- `chevron-right` - Navigation actions

---

## Accessibility

### Keyboard Navigation
- **Tab**: Focus button (shows focus indicator)
- **Enter/Space**: Activate button
- **Focus visible**: Outline (`border.emphasis`, `color.primary`) + shadow (`shadow.hover`)

### Screen Readers
- **Button role**: Semantic `<button>` element (web), native button (iOS/Android)
- **Accessible label**: Button text serves as accessible label
- **Icon treatment**: Icon is decorative (aria-hidden on web, decorative on iOS/Android)
- **State announcements**: Loading state announced as "Loading" or "Busy" (future consideration)

### Touch Targets (WCAG 2.1 AA)
- **Minimum**: 44px × 44px
- **Small button**: 40px visual, 44px touch target (iOS/Android use `tapAreaMinimum`)
- **Medium/Large**: 48px and 56px meet requirements without adjustment

### Color Contrast (WCAG 2.1 AA)
- **Primary**: White text (`color.text.onPrimary`) on primary background - verify 4.5:1 ratio
- **Secondary**: Primary color text on background - verify 4.5:1 ratio
- **Tertiary**: Primary color text on background - verify 4.5:1 ratio
- **Focus indicator**: Primary color outline on any background - verify 3:1 ratio

### Platform Accessibility Features
- **iOS**: Supports Dynamic Type (text size preferences)
- **Android**: Supports TalkBack screen reader
- **Web**: Supports browser zoom and text scaling

---

## Visual Styles

### Primary
- **Background**: `color.primary`
- **Text**: `color.text.onPrimary` (NEW semantic token needed)
- **Border**: none

### Secondary
- **Background**: `color.background`
- **Text**: `color.primary`
- **Border**: `border.default`, color `color.primary`

### Tertiary
- **Background**: transparent
- **Text**: `color.primary`
- **Border**: none

---

## Interaction States

### Default
Base styles as defined above

### Hover
- **Effect**: Apply `opacity.hover` (8% opacity overlay)
- **Platform**: Web only (iOS/Android use native touch feedback)

### Pressed/Active
- **Effect**: Apply `opacity.pressed` (16% opacity overlay)
- **Platform**: All platforms

### Focus (Keyboard Navigation)
- **Outline**: `border.emphasis` (2px), color `color.primary`
- **Outline offset**: 2px
- **Outline radius**: Button radius + offset (e.g., radius100 + 2px = 10px for small)
- **Shadow**: `shadow.hover` (subtle depth)
- **Visibility**: Only on keyboard focus (`:focus-visible`), not mouse click
- **Position**: Outline appears outside button bounds
- **Platform**: Primarily web, iOS/Android use native focus indicators

### Disabled
**NOT IMPLEMENTED** - Disabled states are bad for accessibility and usability. Instead, show why action can't be taken.

### Loading (Future Consideration)
**NOT INCLUDED IN INITIAL SPEC** - Loading states can be added later without significant rework.

**Future considerations**:
- Loading spinner (size matches icon size: 24px or 32px)
- Loading text behavior (optional: "Submit" → "Submitting...")
- Interaction disabled during loading
- Screen reader announcement ("Loading" or "Busy")

---

## Token Requirements

### New Semantic Tokens Needed

**1. color.text.onPrimary**
- **Value**: `white100` (primitive)
- **Purpose**: Text color for content on primary-colored backgrounds
- **Usage**: Primary buttons, badges, chips with primary background
- **Rationale**: Follows compositional architecture and industry patterns (Material "on-primary", Carbon "text-on-color")

**2. space.inset.generous**
- **Value**: `space400` (32px primitive)
- **Purpose**: Generous internal spacing for large components
- **Usage**: Large button horizontal padding, spacious card padding, hero section insets
- **Rationale**: Fills gap in inset token progression (tight→normal→comfortable→spacious→expansive→generous)
- **Note**: Temporary semantic name; future refactoring to numeric scale (space.inset.800) planned

### Component-Level Tokens Needed

**NONE** - All button sizing uses existing semantic tokens ✅

### Existing Tokens Used

**Typography**:
- `typography.bodyMd` (small, medium sizes)
- `typography.bodyLg` (large size)

**Spacing**:
- `space.inset.normal` (8px) - Small V-padding
- `space.inset.comfortable` (12px) - Medium V-padding, Large V-padding
- `space.inset.spacious` (16px) - Small H-padding
- `space.inset.expansive` (24px) - Medium H-padding
- `space.inset.generous` (32px) - Large H-padding (NEW semantic token needed)
- `space.grouped.tight` (4px) - Small icon-text gap
- `space.grouped.normal` (8px) - Medium/Large icon-text gap

**Border Radius**:
- `radius100` (8px) - Small button corners
- `radius150` (12px) - Medium button corners
- `radius200` (16px) - Large button corners

**Colors**:
- `color.primary` - Primary background, secondary/tertiary text, borders
- `color.background` - Secondary background
- `color.text.onPrimary` - Primary text (NEW)

**Interaction**:
- `opacity.hover` - Hover state overlay
- `opacity.pressed` - Pressed state overlay

**Focus**:
- `border.emphasis` - Focus outline width
- `shadow.hover` - Focus shadow

---

## Platform-Specific Considerations

### iOS & Android: Touch Target Accessibility

**Small button (40px) is below WCAG minimum (44px)**

**Solution**: Use `tapAreaMinimum` (44px) for touch target on iOS/Android
- Visual button: 40px height
- Touch target: 44px height (invisible padding extends touch area)
- Implementation: Platform-specific frame/modifier

**Medium (48px) and Large (56px)** meet accessibility requirements without adjustment.

### Platform-Specific Interaction Patterns

**Web**:
- **Hover**: Opacity overlay (`opacity.hover` - 8%)
- **Focus**: Outline + shadow (keyboard navigation)
- **Active/Pressed**: Opacity overlay (`opacity.pressed` - 16%)
- **Cursor**: `cursor: pointer`

**iOS**:
- **Touch feedback**: System-provided highlight (no custom needed)
- **Pressed state**: Scale transform to 0.97 (97%) with 100ms ease-out animation
- **Haptic feedback**: Light impact on press (optional, can be disabled)
- **SF Symbols**: Use system icons when available (may need centering override)
- **Safe area**: Respect safe area insets for full-width buttons
- **Dynamic Type**: Support iOS text size preferences
- **Minimum touch target**: 44pt (use `tapAreaMinimum` for small button)
- **Border rendering**: Border drawn inside frame bounds (56pt frame = 56pt total)

**Android**:
- **Ripple effect**: Material ripple on press (color: primary at 16% opacity)
- **Elevation**: Optional subtle elevation change on press (0dp → 2dp)
- **Material Icons**: Use Material icons when available
- **TalkBack**: Support TalkBack screen reader
- **Minimum touch target**: 44dp (use `tapAreaMinimum` for small button)

---

## Design Decisions & Rationale

### Decision 1: Semantic Naming (small/medium/large)

**Options Considered**:
- Numeric scale (50/100/150)
- Semantic names (small/medium/large)
- Hybrid (both)

**Decision**: Semantic names (small/medium/large)

**Rationale**:
- More intuitive for developers
- Matches existing typography pattern (buttonSm/Md/Lg)
- Simpler to start, can add numeric scale later if needed
- Less ambiguous for human-AI collaboration

### Decision 2: Padding Ratio as Design Guideline

**Options Considered**:
- 4:3 ratio (more horizontal padding)
- 3:1 ratio (moderate padding)
- 2:1 ratio (balanced padding)
- No ratio (arbitrary padding values)

**Decision**: 2-3:1 ratio guideline (H-padding = V-padding × 2-3)

**Rationale**:
- Provides design direction without being prescriptive
- Creates balanced visual proportions
- Allows flexibility for token alignment
- Math won't be perfect, but guides predictable alignment
- Small/Medium follow 2:1, Large follows ~2.67:1 (all acceptable)

### Decision 3: color.text.onPrimary (Not Button-Specific)

**Options Considered**:
- `color.button.text.primary` (button-specific)
- `color.interactive.text.onPrimary` (interactive elements)
- `color.text.onPrimary` (compositional)

**Decision**: `color.text.onPrimary` (compositional)

**Rationale**:
- Follows industry patterns (Material, Carbon, Atlassian)
- Reusable across buttons, badges, chips, any component with primary background
- Follows compositional architecture (text color depends on background)
- Only adds ONE token instead of three button-specific ones

### Decision 4: Browser Rounding Enables Semantic Token Usage

**Options Considered**:
- Use space.inset.comfortable (12px), rely on browser rounding
- Use space.inset.spacious (16px), accept 60px height
- Create component token (14px), maintain exact 56px height

**Decision**: Use space.inset.comfortable (12px), rely on browser rounding

**Rationale**:
- bodyLg line height: 18px × 1.75 = 31.5px (computed) → 32px (rendered by browsers)
- V-padding calculation: (56px - 32px) / 2 = 12px ✅
- Actual rendered height: 32px + (12px × 2) = 56px ✅
- No component token needed - browser rounding works in our favor
- Uses existing semantic token (space.inset.comfortable)

### Decision 5: No Disabled State

**Options Considered**:
- Include disabled state with reduced opacity
- Skip disabled state entirely

**Decision**: Skip disabled state

**Rationale**:
- Disabled buttons are bad for accessibility (screen readers, keyboard navigation)
- Better UX: Show why action can't be taken instead of disabling
- Simpler component with fewer states to manage
- Aligns with modern accessibility best practices

### Decision 6: Padding Ratio Relationship

**Pattern Discovered**: H-padding = V-padding × 2 (or × 3)

**Actual Values**:
- Small: 8px V-padding × 2 = 16px H-padding ✅
- Medium: 12px V-padding × 2 = 24px H-padding ✅
- Large: 12px V-padding × 2.67 ≈ 32px H-padding (closer to × 3)

**Rationale**:
- Creates balanced visual weight
- Provides appropriate horizontal "breathing room"
- Maintains consistent relationship across sizes
- Large button uses slightly higher ratio (2.67:1) for better proportions

### Decision 7: Icon Support (Optional Leading Icons)

**Options Considered**:
- Text-only buttons (no icon support)
- Text + optional icons (leading, trailing, icon-only)
- Text + leading icon only

**Decision**: Text + optional leading icon

**Icon Specifications**:
- Icon size matches line height (24px for small/medium, 32px for large)
- Leading placement only (left of text)
- Icon-text gap: tight (4px) for small, normal (8px) for medium/large
- Icon color inherits from button text color

**Rationale**:
- CTAs typically have text (that's the "call to action")
- Leading icons enhance but don't replace text
- Icon-only buttons are a different pattern (toolbar buttons, etc.)
- Keeps scope manageable for first component
- Trailing icons and icon-only variants can be separate specs

### Decision 8: Size-Specific Border Radius (Primitives)

**Options Considered**:
- Uniform radius across all sizes (e.g., all use radius100)
- Size-specific radius that scales with button size
- No border radius (sharp corners)
- Create semantic radius tokens (e.g., radius.button.small)

**Decision**: Size-specific border radius using primitive tokens (small: radius100, medium: radius150, large: radius200)

**Rationale**:
- Creates visual harmony - larger buttons have proportionally larger corner radius
- Maintains consistent corner-to-size ratio across variants
- Aligns with mathematical token progression (100, 150, 200)
- Provides appropriate visual weight for each size
- **Use primitives**: Border radius doesn't have contextual semantics like spacing does
- **Industry pattern**: Most design systems (Carbon, Polaris) use primitive radius tokens directly
- **Premature abstraction**: Don't create semantic tokens until pattern emerges across 3+ components

---

## Open Questions & Checkpoints

### Checkpoint 1: Token Strategy

**Question**: Should we create `color.text.onPrimary` as semantic token, or start with component token and elevate later?

**Recommendation**: Create as semantic token immediately (follows industry patterns, likely to be reused)

### Checkpoint 2: Large Button V-Padding ✅ RESOLVED

**Decision**: Use space.inset.comfortable (12px) - no component token needed

**Implementation**:
- bodyLg line height: 31.5px computed → 32px rendered (browser rounding)
- V-padding: (56px - 32px) / 2 = 12px
- Token: space.inset.comfortable (12px)
- Actual height: 32px + (12px × 2) = 56px ✅

**Rationale**: Browser rounding of line heights works in our favor, allowing use of existing semantic token without creating component-specific token

### Checkpoint 3: Tap Target Implementation ✅ RESOLVED

**Decision**: Minimum frame height with visual button centered

**Implementation**:
- Use `tapAreaMinimum` (44px) token for iOS/Android
- Visual button remains 40px height
- Touch target extends to 44px through platform-specific frame/modifier
- Invisible padding extends touch area without changing visual appearance

**Rationale**: Simplest and most reliable approach that maintains visual design while meeting WCAG touch target requirements

### Checkpoint 4: Border Radius ✅ RESOLVED

**Decision**: Size-specific border radius that scales with button size

**Implementation**:
- Small: `radius100` (8px) - matches baseline grid
- Medium: `radius150` (12px) - softer corners
- Large: `radius200` (16px) - more rounded

**Rationale**: Border radius scales proportionally with button size, creating visual harmony and consistent corner-to-size ratio across all variants

### Checkpoint 5: Focus State Details ✅ RESOLVED

**Decision**: Additive focus state (outline + shadow)

**Implementation**:
- Outline: `border.emphasis` (2px), color `color.primary`
- Shadow: `shadow.hover` (subtle depth)
- Outline offset: 2px

**Rationale**: Combining outline and shadow provides better visibility across different backgrounds and ensures WCAG compliance for keyboard navigation indicators

---

## Next Steps

1. **Review this design outline** - confirm decisions and answer open questions
2. **Create requirements.md** - EARS format with user stories and acceptance criteria
3. **Create design.md** - Detailed component architecture and token integration
4. **Create tasks.md** - Implementation plan with task type classification
5. **Build the component** - Implement across all three platforms

---

## Observations & Learnings

### Learning 1: Vertical Rhythm vs Spacing Grid

**Key insight**: The 8px baseline grid serves two purposes:
1. **Spacing alignment**: Margins, padding, gaps between elements
2. **Vertical rhythm**: Component heights align to create visual harmony

**Component sizing flexibility** (like 14px padding) is appropriate when it achieves vertical rhythm-aligned heights (56px = 7 × 8px).

**This distinction should be documented** in token architecture documentation.

### Learning 2: Compositional Color Tokens

**Industry pattern**: Design systems use compositional "text-on-background" patterns, not component-specific tokens.

**Examples**:
- Material: `on-primary`
- Carbon: `text-on-color`
- Atlassian: `text.inverse`

**DesignerPunk approach**: `color.text.onPrimary` follows this pattern.

### Learning 3: Touch Target Accessibility

**Small buttons (40px) require special handling** on iOS/Android to meet 44px minimum touch target.

**Solution**: Use `tapAreaMinimum` token with platform-specific implementation to extend touch area without changing visual size.

### Learning 4: Browser Line Height Rounding

**Key insight**: Typography tokens store line height as ratios, but browsers render line heights as whole pixels.

**Example**:
- Token: `typography.bodyLg` = fontSize125 (18px) × lineHeight125 (1.75)
- Computed: 18 × 1.75 = 31.5px
- Rendered: 32px (browsers round to nearest pixel)

**Impact**: This rounding can work in our favor for component sizing, eliminating the need for component-specific tokens when calculations align with existing semantic tokens after rounding.

### Learning 5: Inset Token Naming Complexity

**Challenge**: Semantic inset token names (tight, normal, comfortable, spacious, expansive, generous) create synonym complexity that becomes harder to remember and maintain.

**Future Direction**: Refactor to numeric scale (space.inset.100, space.inset.200, etc.) similar to Material Design approach. This provides:
- Clear progression without synonym confusion
- Easier to add new values without naming challenges
- More intuitive for AI-human collaboration

**Current Approach**: Use "generous" temporarily to unblock button component development, plan separate refactoring spec for all inset tokens.

---

*This design outline captures key decisions and open questions before proceeding to full spec creation.*
