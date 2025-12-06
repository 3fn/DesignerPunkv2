# Design Outline: Text Input Field Component

**Date**: December 1, 2025  
**Purpose**: Explore text input field design before formal requirements  
**Organization**: spec-guide  
**Scope**: 013-text-input-field

---

## Overview

This design outline explores the Text Input Field component architecture for DesignerPunk. The component will use the **float label pattern** with animated transitions between label states, establishing animation patterns for the entire design system.

**Key Features**:
- Float label pattern (label animates from placeholder to floated position)
- Multiple input states (default, focus, error, disabled, success)
- Accessibility-first design (WCAG 2.1 AA compliance)
- Animation token integration (first animated component)
- Typography token usage (labelMd → labelMdFloat transition)

---

## Related Spec: Motion Token System

**Dependency**: This component drives the Motion Token System specification (Spec 014).

**Relationship**: The float label animation pattern defines the motion token requirements:
- Duration primitives (duration250 for label transition)
- Easing primitives (easingStandard for balanced animation)
- Scale primitives (scale088 for transform-based animation if needed)
- Semantic motion token (motion.floatLabel composing duration + easing)

**Workflow**: Complete this design outline → Defines motion token needs → Motion Token System can proceed to Requirements phase

**Related Spec**: `.kiro/specs/014-motion-token-system/design-outline.md`

---

## Float Label Pattern

### What is Float Label Pattern?

**Reference**: [Brad Frost - Float Label Pattern](https://bradfrost.com/blog/post/float-label-pattern/)

**Concept**: The label starts as a placeholder inside the input field. When the user focuses or enters text, the label "floats" up above the input field, remaining visible as context.

**Benefits**:
- Space-efficient (no separate label above input)
- Context preservation (label visible even when filled)
- Modern, clean aesthetic
- Reduces form height

**Accessibility Considerations**:
- Label must remain programmatically associated with input (for attribute)
- Floated label must maintain sufficient contrast
- Animation must respect prefers-reduced-motion
- Focus indicators must be clear

---

## Typography Token Strategy

### Label States

**Default/Placeholder State**:
- Uses `typography.labelMd` (16px, lineHeight 1.5, fontWeight 500)
- Color: `color.text.muted` (lighter, indicates placeholder)
- Position: Inside input field (vertically centered)

**Floated State**:
- Uses `typography.labelMdFloat` (13px, lineHeight 1.5, fontWeight 500)
- Color: `color.primary` (darker, indicates active/focused)
- Position: Above input field (small offset)

**Error State**:
- Uses `typography.labelMdFloat` (13px, lineHeight 1.5, fontWeight 500)
- Color: `color.error` (orange, indicates error)
- Position: Above input field (small offset)

**Disabled State**:
- Uses `typography.labelMd` or `typography.labelMdFloat` (depending on filled state)
- Color: `color.text.subtle` (very light, indicates disabled)
- Position: Depends on filled state

### New Typography Token: labelMdFloat

**Need**: We need a typography token for the floated label state that matches labelMd properties except fontSize.

**Proposed Token**:
```typescript
'typography.labelMdFloat': {
  fontSize: 'fontSize050',      // 13px (animated target)
  lineHeight: 'lineHeight100',  // 1.5 (same as labelMd - stays constant)
  fontWeight: 'fontWeight500',  // 500 (same as labelMd - stays constant)
  fontFamily: 'fontFamilyBody', // Body font (same as labelMd)
  letterSpacing: 'letterSpacing100' // Default spacing (same as labelMd)
}
```

**Rationale**:
- Keeps lineHeight constant during animation (prevents layout shift)
- Only fontSize animates (16px → 13px)
- Maintains fontWeight and other properties
- Clear semantic meaning: "labelMd in floated state"

**Animation**:
```css
/* Option 1: Font-size transition (simpler) */
label {
  font-size: var(--typography-label-md-font-size);  /* 16px */
  transition: font-size var(--duration-250) var(--easing-standard);
}

label.floated {
  font-size: var(--typography-label-md-float-font-size);  /* 13px */
}

/* Option 2: Transform scale (GPU-accelerated) */
label {
  font-size: var(--typography-label-md-font-size);  /* 16px */
  transform: scale(1.0);
  transition: transform var(--duration-250) var(--easing-standard);
}

label.floated {
  transform: scale(var(--scale-088));  /* 0.88, rounds to 14px effective size */
}
```

---

## Animation Integration

### Animation Tokens Used

**Duration**:
- `duration250` (250ms) - Label float transition

**Easing**:
- `easingStandard` - Balanced curve for label animation (cubic-bezier(0.4, 0.0, 0.2, 1))

**Scale** (if using transform-based animation):
- `scale088` (0.88) - Typography scale for 16px → ~14px transition
- Note: Token generation system handles rounding (16px × 0.88 = 14.08px → 14px)

**Properties Animated**:
- `font-size`: 16px → 13px (labelMd → labelMdFloat) OR
- `transform: scale()`: 1.0 → 0.88 (if using GPU-accelerated animation)
- `color`: muted → primary (or error)
- `transform: translateY`: for position change

### Animation Behavior

**State Progression** (empty → active → filled):

**1. Rest, Empty → Active, Empty** (user focuses empty input):
- Label font-size: 16px → 13px (250ms, standard easing)
- Label color: muted → primary (250ms, standard easing)
- Label position: inside input → above input (250ms, standard easing)
- Trailing icons: fade in (if applicable)
- Border: default → primary

**2. Active, Empty → Rest, Empty** (user blurs empty input):
- Label font-size: 13px → 16px (250ms, standard easing)
- Label color: primary → muted (250ms, standard easing)
- Label position: above input → inside input (250ms, standard easing)
- Trailing icons: fade out (if applicable)
- Border: primary → default

**3. Active, Empty → Active, Filled** (user types):
- Label: stays floated (no animation)
- Trailing icons: remain visible
- Content: appears in input field

**4. Active, Filled → Rest, Filled** (user blurs filled input):
- Label: stays floated (no animation)
- Trailing icons: fade out (if applicable)
- Border: primary → default
- Content: remains visible

**5. Rest, Filled → Active, Filled** (user focuses filled input):
- Label: stays floated (no animation)
- Trailing icons: fade in (if applicable)
- Border: default → primary

**Icon Timing**:
- Icons appear **after** label floats (no spatial conflict)
- Coordinated with `motion.floatLabel` timing
- Progressive disclosure: show controls when relevant

**Accessibility**:
- Respect `prefers-reduced-motion` (disable animations if user prefers)
- Ensure label remains readable during animation
- Maintain focus indicators throughout animation

---

## Component States

**Design Philosophy**: Component structure supports background property from the start (even if unused initially) to make future enhancements trivial (e.g., error background tint).

### 1. Default State (Empty, Not Focused)
- **Label**: Inside input, `typography.labelMd` (16px), `color.text.subtle`
- **Border**: `borderDefault` width, `color.border`, `radius150` (6px)
- **Background**: `color.background` (white)
- **Focus ring**: None

### 2. Focus State (Empty or Filled, Focused)
- **Label**: Floated above input, `typography.labelMdFloat` (13px), `color.primary with blend.focusSaturate`
- **Border**: `borderDefault` width, `color.primary with blend.focusSaturate`, `radius150` (6px)
- **Background**: `color.background` (white)
- **Focus ring**: 2px solid `color.primary` with 2px offset

**Rationale for blend.focusSaturate**: Creates vibrant, attention-drawing appearance (8% more saturated) that clearly indicates active focus state.

### 3. Filled State (Filled, Not Focused)
- **Label**: Floated above input, `typography.labelMdFloat` (13px), `color.text.subtle`
- **Border**: `borderDefault` width, `color.border`, `radius150` (6px)
- **Background**: `color.background` (white)
- **Focus ring**: None

### 4. Error State (Error, Focused or Not)
- **Label**: Floated above input, `typography.labelMdFloat` (13px), `color.error`
- **Border**: `borderDefault` width, `color.error`, `radius150` (6px)
- **Background**: `color.background` (white - can be changed to `color.error.subtle` later for tinted background)
- **Error message**: Below input, `typography.caption`, `color.error`
- **Focus ring**: If focused, 2px solid `color.error` with 2px offset

**Note**: Background property exists in component structure to support future error background tint (`color.error.subtle`) without component restructuring.

### Future States (Deferred)

**Success State** (trivial to add later):
- Same pattern as error state with `color.success.strong` for border/label
- Complexity: 1/10 (copy-paste of error state with different color)

**Disabled State** (intentionally excluded):
- Disabled inputs are terrible UX (users can't interact to understand why disabled)
- Better alternatives: read-only, conditional visibility, or clear messaging
- This component will NOT support disabled state

---

## Token Consumption

### Typography Tokens
- `typography.labelMd` - Default label state (16px)
- `typography.labelMdFloat` - Floated label state (13px) **[NEW TOKEN]**
- `typography.input` - Input text (16px)
- `typography.caption` - Helper text, error messages (13px)

### Color Tokens
- `color.text.subtle` - Default label color (test for WCAG AA, adjust to `color.text.muted` if needed)
- `color.text.default` - Input text color
- `color.primary` - Focus border, focused label (with blend.focusSaturate)
- `color.error` - Error border, error label, error message
- `color.border` - Default border
- `color.background` - Input background (white, supports future error background tint)

### Blend Tokens
- `blend.focusSaturate` - Focus state emphasis (8% more saturated, vibrant appearance)

### Spacing Tokens
- `space.inset.normal` - Input padding (horizontal and vertical)
- `space.grouped.tight` - Space between label and input (when floated)
- `space.grouped.minimal` - Space between input and helper text

### Motion Tokens
- `duration250` - Label transition duration (250ms) **[NEW PRIMITIVE TOKEN]**
- `easingStandard` - Label transition easing (cubic-bezier) **[NEW PRIMITIVE TOKEN]**
- `scale088` - Typography scale for transform-based animation (0.88) **[NEW PRIMITIVE TOKEN]**
- `motion.floatLabel` - Semantic motion token composing duration + easing **[NEW SEMANTIC TOKEN]**

### Border Tokens
- `borderDefault` - Input border width (semantic token, references `border.width.default` = 1px)
- `radius150` - Input border radius (6px, slightly more rounded than radius100)

---

## Component Variants

### Size Variants (Future Consideration)

**Question**: Should we have multiple input sizes (small, medium, large) like ButtonCTA?

**Initial Decision**: Start with single standard size. Add variants if pattern emerges across multiple form components.

**Rationale**:
- Inputs are typically standard size in forms
- Size variants add complexity (padding, font-size, label positioning)
- Wait for real use cases before adding variants

### Input Types (Future Consideration)

**Question**: Should this component support multiple input types (text, email, password, number, search)?

**Initial Decision**: Start with text input. Add type-specific features as separate specs or enhancements.

**Rationale**:
- Text input establishes core pattern
- Type-specific features (password visibility toggle, number spinners) are separate concerns
- Can extend base component for specific types

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance

**1. Label Association**:
- Label must have `for` attribute matching input `id`
- Programmatic association maintained even when label floats

**2. Color Contrast**:
- Default label (muted): Minimum 4.5:1 contrast ratio
- Floated label (primary): Minimum 4.5:1 contrast ratio
- Error label (error): Minimum 4.5:1 contrast ratio
- Input text: Minimum 4.5:1 contrast ratio

**3. Focus Indicators**:
- Visible focus ring (2px solid primary color)
- Focus ring offset (2px) for clarity
- Focus ring visible in all states

**4. Error Identification**:
- Error state indicated by color AND text (not color alone)
- Error message associated with input (aria-describedby)
- Error icon optional but helpful

**5. Reduced Motion**:
- Respect `prefers-reduced-motion` media query
- Disable animations if user prefers reduced motion
- Instant state changes instead of transitions

**6. Keyboard Navigation**:
- Input focusable via Tab key
- Label click focuses input
- Enter key submits form (standard behavior)

**7. Screen Reader Support**:
- Label announced when input focused
- Error message announced when error state
- Helper text announced via aria-describedby

---

## Platform-Specific Considerations

### Web (CSS + Web Components)

**Component Structure** (supports background from start):
```html
<div class="input-container" style="background: var(--input-background)">
  <label class="input-label">Field label</label>
  <input class="input-field" type="text">
</div>
```

**Float Label Implementation**:
```css
/* Label default state */
.input-label {
  position: absolute;
  top: 50%;
  left: var(--space-inset-normal);
  transform: translateY(-50%);
  font-size: var(--typography-label-md-font-size);
  color: var(--color-text-muted);
  transition: 
    font-size var(--duration-250) var(--easing-standard),
    color var(--duration-250) var(--easing-standard),
    transform var(--duration-250) var(--easing-standard);
}

/* Label floated state (focus) */
.input-label.floated.focused {
  top: 0;
  transform: translateY(-100%) translateY(calc(-1 * var(--space-grouped-tight)));
  font-size: var(--typography-label-md-float-font-size);
  color: var(--color-primary);  /* Apply blend.focusSaturate via build system */
}

/* Label floated state (filled, not focused) */
.input-label.floated {
  top: 0;
  transform: translateY(-100%) translateY(calc(-1 * var(--space-grouped-tight)));
  font-size: var(--typography-label-md-float-font-size);
  color: var(--color-text-subtle);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .input-label {
    transition: none;
  }
}
```

### iOS (SwiftUI)

**Float Label Implementation**:
```swift
// Label animation
Text(label)
  .font(isFloated ? typographyLabelMdFloat : typographyLabelMd)
  .foregroundColor(isFloated ? colorPrimary : colorTextMuted)
  .offset(y: isFloated ? -labelFloatOffset : 0)
  .animation(easingStandard.speed(1.0 / duration250))

// Respect reduced motion
@Environment(\.accessibilityReduceMotion) var reduceMotion

.animation(reduceMotion ? .none : easingStandard)
```

### Android (Jetpack Compose)

**Float Label Implementation**:
```kotlin
// Label animation
Text(
    text = label,
    style = if (isFloated) typographyLabelMdFloat else typographyLabelMd,
    color = if (isFloated) colorPrimary else colorTextMuted,
    modifier = Modifier
        .offset(y = animateFloatAsState(
            targetValue = if (isFloated) -labelFloatOffset else 0f,
            animationSpec = tween(
                durationMillis = Duration250,
                easing = EasingStandard
            )
        ).value.dp)
)

// Respect reduced motion
val reduceMotion = LocalAccessibilityManager.current.isReduceMotionEnabled
val animationSpec = if (reduceMotion) snap() else tween(...)
```

---

## Open Questions

### 1. Helper Text vs Error Message

**Decision**: Same element with state-based content.

**Rationale**:
- Simpler DOM structure (one element, not two)
- Clearer state management (content changes, not visibility)
- Consistent positioning (no layout shift)
- Matches industry patterns (Material Design, previous DesignerPunk iteration)

**Implementation**:
```typescript
// Single element, content changes based on state
<p class="input-message">
  {state === 'error' ? errorMessage : 
   state === 'success' ? successMessage : 
   helperText}
</p>
```

### 2. Label Position Calculation

**Question**: How do we calculate the exact Y-offset for the floated label?

**Factors**:
- Input padding (space.inset.normal)
- Label height (depends on lineHeight)
- Desired gap between label and input (space.grouped.tight)

**Recommendation**: Use CSS calc() or platform-specific calculations. Document the formula clearly.

### 3. Input Sizing

**Question**: Should input height be fixed or based on content?

**Options**:
- Fixed height: Consistent across all inputs (e.g., 48px for touch targets)
- Content-based: Height adjusts to padding + font-size

**Recommendation**: Fixed minimum height (48px for accessibility), padding adjusts to maintain that height.

### 4. Icon Support

**Decision**: Support trailing icons, defer leading icons to future enhancement.

**Rationale**:
- Trailing icons are essential for input functionality (show/hide password, validation checkmarks, info icons)
- Icons appear **after** label floats (no spatial conflict with float animation)
- Progressive disclosure: icons fade in when input is active/filled, fade out when empty
- Leading icons are less common and can be added later if needed

**Icon Timing**:
- **Rest, Empty**: No icons visible
- **Active/Filled**: Icons fade in (coordinated with label float timing)
- **Rest, Filled**: Icons hidden (can be shown if needed for specific input types)

**Common Trailing Icons**:
- Validation checkmark (success state)
- Info icon (helper text trigger)
- Show/hide toggle (password fields)
- Calendar icon (date pickers)
- Dropdown arrow (select-style inputs)

---

## Design Decisions

### Decision 1: Float Label Pattern

**Options Considered**:
1. Traditional label above input (separate elements)
2. Float label pattern (label animates from placeholder to floated)
3. Placeholder only (no persistent label)

**Decision**: Float label pattern

**Rationale**:
- Space-efficient (reduces form height)
- Modern, clean aesthetic
- Context preservation (label visible when filled)
- Establishes animation patterns for design system

**Trade-offs**:
- ✅ Gained: Space efficiency, modern feel, animation patterns
- ❌ Lost: Simplicity of traditional label
- ⚠️ Risk: Animation complexity, accessibility considerations

### Decision 2: labelMdFloat Typography Token

**Options Considered**:
1. Transition between labelMd and labelXs (different lineHeights)
2. Create labelMdFloat (same lineHeight as labelMd, different fontSize)
3. Use component-level tokens (no semantic token)

**Decision**: Create labelMdFloat semantic token

**Rationale**:
- Keeps lineHeight constant (prevents layout shift during animation)
- Only fontSize animates (simpler, more performant)
- Semantic token layer (reusable across components)
- Clear naming (labelMdFloat = labelMd in floated state)

**Trade-offs**:
- ✅ Gained: Simpler animation, no layout shift, reusable token
- ❌ Lost: Using existing labelXs token (but lineHeight mismatch)
- ⚠️ Risk: Token proliferation (mitigated by clear naming convention)

### Decision 3: Animation Token Integration

**Options Considered**:
1. Hard-code animation values in component
2. Use animation tokens (duration.normal, easing.standard)
3. Create component-specific animation tokens

**Decision**: Use motion tokens

**Rationale**:
- Establishes pattern for future animated components
- Consistent timing across design system
- AI-friendly (tokens are discoverable)
- Validates motion token system
- Compositional pattern (semantic token composes primitives)

**Trade-offs**:
- ✅ Gained: Consistency, reusability, AI collaboration support
- ❌ Lost: Component-specific animation tuning (can override if needed)

### Decision 4: Single Size Variant

**Options Considered**:
1. Multiple size variants (small, medium, large)
2. Single standard size
3. Responsive sizing (adapts to container)

**Decision**: Single standard size initially

**Rationale**:
- Inputs are typically standard size in forms
- Size variants add complexity (padding, font-size, label positioning)
- Wait for real use cases before adding variants
- Can add variants later if pattern emerges

**Trade-offs**:
- ✅ Gained: Simplicity, faster implementation, clear scope
- ❌ Lost: Flexibility for different form contexts
- ⚠️ Risk: Might need variants later (can add incrementally)

### Decision 5: Aesthetic Token Choices

**Options Considered**:
1. Simple color swap (no blend tokens)
2. Enhanced with blend tokens for focus
3. Blend tokens for all states

**Decision**: Enhanced with blend.focusSaturate for focus state

**Rationale**:
- **radius150** (6px): Slightly more rounded than radius100, modern feel without being too pill-shaped
- **color.text.subtle**: Subtle label in default state (test for WCAG AA, adjust to muted if needed)
- **blend.focusSaturate**: Creates vibrant, attention-drawing focus state (8% more saturated)
- **Component structure with background**: Supports future error background tint without restructuring

**Trade-offs**:
- ✅ Gained: Vibrant focus state, validates blend token system, future-proof structure
- ❌ Lost: Simplicity of color-only approach (but worth it for visual impact)
- ⚠️ Risk: Blend tokens must work consistently cross-platform (should be fine)

### Decision 6: No Disabled State

**Options Considered**:
1. Include disabled state (industry standard)
2. Exclude disabled state (better UX)
3. Read-only alternative

**Decision**: Exclude disabled state entirely

**Rationale**:
- **Disabled inputs are terrible UX**: Users can't interact to understand why disabled
- **Screen reader issues**: Disabled form fields are problematic for accessibility
- **Better alternatives exist**: Read-only, conditional visibility, clear messaging
- **Intentional omission**: This is a design decision, not an oversight

**Trade-offs**:
- ✅ Gained: Better UX, better accessibility, clearer user communication
- ❌ Lost: Industry-standard pattern (but it's a bad pattern)
- ⚠️ Risk: Developers might expect disabled state (document clearly)

### Decision 7: Defer Success State

**Options Considered**:
1. Include success state now
2. Defer success state to later
3. Skip success state entirely

**Decision**: Defer success state to later

**Rationale**:
- **Not commonly needed**: Most inputs don't have persistent success state
- **Trivial to add later**: Same pattern as error state with different color (complexity: 1/10)
- **Simpler initial scope**: Focus on core states (default, focus, filled, error)
- **Can add when needed**: Real-time validation or user testing might reveal need

**Trade-offs**:
- ✅ Gained: Simpler initial implementation, faster delivery
- ❌ Lost: Complete state coverage (but can add trivially)
- ⚠️ Risk: Might need it sooner than expected (but easy to add)

---

## Next Steps

1. **Create formal requirements** - Convert this outline into EARS-formatted requirements
2. **Create labelMdFloat typography token** - Add to semantic typography tokens
3. **Implement motion tokens** - Create duration250, easingStandard, scale088 primitives and motion.floatLabel semantic token
4. **Design component architecture** - Detailed component structure and state management
5. **Create HTML canary examples** - Validation examples for README documentation

---

## Observations

**First animated component**: This establishes animation patterns for the entire design system. The decisions we make here will influence future animated components.

**Typography token innovation**: labelMdFloat is a new pattern - a typography token variant for animation. This might be useful for other animated text elements.

**Motion token validation**: This component validates the motion token system. If the tokens work well here, they'll work for other components. The compositional pattern (semantic token composing primitives) matches Shadow and Typography tokens.

**Accessibility is critical**: Float label pattern has accessibility challenges. We must ensure WCAG 2.1 AA compliance from the start.

**Platform equivalence is achievable**: Same animation timing and easing across web/iOS/Android. Platform-specific syntax, but mathematically equivalent behavior.

---

**Organization**: spec-guide  
**Scope**: 013-text-input-field
