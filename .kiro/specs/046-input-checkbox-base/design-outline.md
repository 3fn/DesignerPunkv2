# Input-Checkbox-Base Component - Design Outline

**Date**: January 19, 2026
**Updated**: February 5, 2026
**Purpose**: Capture design decisions and token requirements before creating full spec
**Status**: Design Outline (Pre-Requirements)

---

## Component Overview

Checkbox is a binary selection control that allows users to select or deselect an option. It supports checked, unchecked, and indeterminate states. Checkboxes can be used individually or in groups for multi-select scenarios.

**Key Characteristics**:
- **Binary selection**: Checked or unchecked (plus indeterminate)
- **Independent**: Each checkbox operates independently in a group
- **Label association**: Always paired with accessible label
- **Touch-friendly**: Adequate touch target size

---

## Architecture

### Component Structure

```
Input-Checkbox-Base (Primitive)
├── Provides foundational checkbox behaviors
├── Check states, label, error
└── Semantic variants inherit from this

Input-Checkbox-Legal (Semantic Variant) [INCLUDED IN THIS SPEC]
├── Extends Base with legal consent behaviors
├── Audit timestamps, explicit consent requirements
└── Enhanced error handling for legal compliance

Future Semantic Variants:
├── Input-Checkbox-Group (managed group with select-all)
├── Input-Checkbox-Card (checkbox as card selection)
└── Input-Checkbox-Tree (hierarchical checkboxes)
```

**Design Pattern**: Base primitive with semantic variants for specialized behaviors.

**Why include Input-Checkbox-Legal in this spec?**
- Ensures Base architecture accounts for Legal's needs upfront
- Avoids refactoring Base later when Legal is built
- Single coherent spec for the checkbox family
- Legal extends Base without modifying Base's core implementation

---

## Visual Specifications

### States

| State | Box Background | Box Border | Check Color | Label Color |
|-------|----------------|------------|-------------|-------------|
| **unchecked** | transparent | `color.feedback.select.border.default` | - | `color.contrast.onLight` |
| **checked** | `color.feedback.select.background.rest` | `color.feedback.select.border.rest` | `color.contrast.onDark` | `color.contrast.onLight` |
| **indeterminate** | `color.feedback.select.background.rest` | `color.feedback.select.border.rest` | `color.contrast.onDark` | `color.contrast.onLight` |
| **hover** | transparent | `color.feedback.select.border.rest` | - | `color.contrast.onLight` |
| **focus** | transparent | `accessibility.focus.color` | - | `color.contrast.onLight` |
| **error** | transparent | `color.feedback.error.border` | - | `color.contrast.onLight` |

> **Note**: DesignerPunk does not support disabled states. If an option is unavailable, it should be hidden or explained contextually rather than shown as disabled. This improves usability and accessibility.


### Size Variants

| Size | Icon Size | Box Inset | Box Size | Border Radius | Label Typography | Gap |
|------|-----------|-----------|----------|---------------|------------------|-----|
| **sm** | `icon.size050` (16px) | `inset.050` (4px) | 24px | `radiusSubtle` | `labelSm` | `space.grouped.normal` |
| **md** | `icon.size075` (20px) | `inset.075` (6px) | 32px | `radiusSmall` | `labelMd` | `space.grouped.normal` |
| **lg** | `icon.size100` (24px) | `inset.100` (8px) | 40px | `radiusSmall` | `labelLg` | `space.grouped.loose` |

**Box Size Calculation**: `iconSize + (insetPadding × 2)` — padding applied to all sides centers the icon within the box.

**Size Naming Convention**: Uses abbreviations (`sm`, `md`, `lg`) to align with Badge-Label-Base and Avatar components. Note: Button-CTA uses full words (`small`, `medium`, `large`) — this is a known inconsistency in the codebase.

**New Token Required**: `inset.075` (6px) — justified by Chip-Base precedent which uses `space075` for the same purpose (internal padding). This completes the inset progression: none, 050, **075**, 100, 150, 200, 300, 400.

### Check Mark

- **Component**: Uses `<icon-base>` component for consistent icon rendering
- **Checked icon**: `check` from Feather Icons (✓)
- **Indeterminate icon**: `minus` from Feather Icons (−)
- **Icon size**: Matches box size per size variant (see Size Variants table)
- **Icon color**: Inherits from `color.contrast.onDark` via Icon-Base color inheritance
- **Animation**: Scale + opacity transition on state change using `motion.selectionTransition` (250ms, easingStandard)

### Border

- **Width**: `borderEmphasis` for visibility
- **Radius**: Slightly rounded corners (not fully rounded like radio) — `radiusSubtle` or `radiusSmall`

---

## Token Requirements

### Token Strategy: Use Existing Semantic Tokens + One New Token

Input-Checkbox-Base uses existing semantic tokens directly. **One new semantic token is required**: `inset.075` (6px) for the medium size checkbox box padding.

**Rationale for `inset.075`**: 
- Chip-Base already uses `space075` primitive for the same purpose (internal padding)
- Two components needing the same value for the same purpose justifies elevation to semantic token
- Completes the inset progression: none, 050, **075**, 100, 150, 200, 300, 400
- Maintains mathematical consistency: 0.75 × 8px base = 6px

### New Token Required

**`inset.075`** (6px)
- **Primitive reference**: `space075`
- **Mathematical relationship**: 0.75 × base (space100)
- **Use case**: Compact internal spacing for medium-density components
- **Precedent**: Chip-Base uses same value for paddingBlock

### Semantic Tokens Used

**Colors (Feedback Concept)**:
- `color.feedback.select.background.rest` — checked background
- `color.feedback.select.background.default` — unchecked background (transparent)
- `color.feedback.select.border.rest` — checked/hover border
- `color.feedback.select.border.default` — unchecked border
- `color.feedback.error.border` — error state border

**Colors (Contrast Concept)**:
- `color.contrast.onDark` — check mark color (white on colored background)
- `color.contrast.onLight` — label text color

**Accessibility**:
- `accessibility.focus.color` — focus ring color
- `accessibility.focus.width` — focus ring width
- `accessibility.focus.offset` — focus ring offset

**Icons**:
- `icon.size050`, `icon.size075`, `icon.size100` — checkbox box sizes
- `icon.strokeWidth` — check mark stroke width

**Typography**:
- `labelSm`, `labelMd`, `labelLg` — label text styles

**Spacing**:
- `space.grouped.normal` — sm/md gap (8px)
- `space.grouped.loose` — lg gap (12px)
- `inset.050` — sm checkbox box padding (4px)
- `inset.075` — md checkbox box padding (6px) **[NEW TOKEN]**
- `inset.100` — lg checkbox box padding (8px)

**Border**:
- `borderEmphasis` — checkbox border width (2px)

**Radius**:
- `radiusSubtle` — sm checkbox radius (2px)
- `radiusSmall` — md/lg checkbox radius (4px)

**Motion**:
- `motion.selectionTransition` — check/uncheck state transitions (250ms, easingStandard)
- `motion.buttonPress` — iOS press feedback (150ms, easingAccelerate)

**Scale**:
- `scale096` — iOS press scale transform (96%)

**Blend**:
- `blend.hoverDarker` — web hover feedback (8% darker)
- `blend.pressedDarker` — Android ripple effect (12% darker)

### Future: Input-Checkbox-Legal Tokens

If Input-Checkbox-Legal requires different visual treatment (e.g., more formal colors, different emphasis), component tokens would be created at:
`src/components/core/Input-Checkbox-Legal/tokens.ts`

This follows the canonical Rosetta System architecture where component tokens live alongside their component implementation.

---

## Component API Design

### Props Interface

```typescript
interface CheckboxProps {
  /** Whether checkbox is checked */
  checked?: boolean;
  
  /** Indeterminate state (overrides checked visually) */
  indeterminate?: boolean;
  
  /** Label text */
  label: string;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Vertical alignment of label relative to checkbox box */
  labelAlign?: 'center' | 'top';
  
  /** Helper text displayed below checkbox (persistent) */
  helperText?: string;
  
  /** Error message displayed below helper text (conditional) */
  errorMessage?: string;
  
  /** Called when checkbox state changes */
  onChange?: (checked: boolean) => void;
  
  /** Unique identifier */
  id?: string;
  
  /** Test ID for automated testing */
  testID?: string;
}
```

### Default Values

```typescript
const defaults = {
  checked: false,
  indeterminate: false,
  size: 'md',
  labelAlign: 'center'
};
```

### Usage Examples

```tsx
// Basic checkbox
<Checkbox 
  label="I agree to the terms" 
  checked={agreed}
  onChange={setAgreed}
/>

// Checkbox with helper text
<Checkbox 
  label="Subscribe to newsletter" 
  helperText="We'll send you updates about new features"
  checked={subscribed}
  onChange={setSubscribed}
/>

// Checkbox with error (aligned with Input-Text-Base pattern)
<Checkbox 
  label="Required field" 
  checked={false}
  errorMessage="This field is required"
/>

// Multi-line label with top alignment
<Checkbox 
  label="I understand that this action cannot be undone and all data will be permanently deleted"
  labelAlign="top"
  checked={confirmed}
  onChange={setConfirmed}
/>

// Indeterminate (parent of partially selected group)
<Checkbox 
  label="Select all" 
  indeterminate={someSelected && !allSelected}
  checked={allSelected}
  onChange={handleSelectAll}
/>

// Small checkbox for dense UI
<Checkbox label="Remember me" size="sm" checked />
```

---

## Platform Considerations

### Web Implementation

**Logical Properties**: Web implementation uses CSS logical properties for RTL language support:
- `margin-inline-start` / `margin-inline-end` instead of `margin-left` / `margin-right`
- `padding-inline` / `padding-block` instead of directional padding
- `gap` property for flexbox spacing (inherently logical)

```html
<label class="checkbox">
  <input type="checkbox" class="checkbox__input" />
  <span class="checkbox__box">
    <icon-base name="check" size="size075" color="inherit" class="checkbox__icon"></icon-base>
  </span>
  <span class="checkbox__label">Label text</span>
</label>
```

```css
.checkbox {
  display: inline-flex;
  align-items: center; /* Default: center-aligned */
  gap: var(--space-grouped-normal);
  cursor: pointer;
}

.checkbox--align-top {
  align-items: flex-start; /* Top-aligned for multi-line labels */
}

.checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox__box {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--icon-size-075);
  height: var(--icon-size-075);
  border: var(--border-emphasis) solid var(--color-feedback-select-border-default);
  border-radius: var(--radius-small);
  transition: all var(--motion-selection-transition-duration) var(--motion-selection-transition-easing);
}

.checkbox__input:checked + .checkbox__box {
  background-color: var(--color-feedback-select-background-rest);
  border-color: var(--color-feedback-select-border-rest);
}

.checkbox__input:focus-visible + .checkbox__box {
  outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
  outline-offset: var(--accessibility-focus-offset);
}

.checkbox:hover .checkbox__box {
  border-color: var(--color-feedback-select-border-rest);
}
```

### iOS Implementation

```swift
struct Checkbox: View {
    @Binding var checked: Bool
    var indeterminate: Bool = false
    let label: String
    let size: CheckboxSize
    
    @State private var isPressed = false
    
    var body: some View {
        Button(action: { checked.toggle() }) {
            HStack(spacing: size.gap) {
                ZStack {
                    RoundedRectangle(cornerRadius: size.radius)
                        .stroke(checked || indeterminate ? Color.clear : DesignTokens.colorFeedbackSelectBorderDefault, lineWidth: DesignTokens.borderEmphasis)
                        .frame(width: size.boxSize, height: size.boxSize)
                    
                    if checked || indeterminate {
                        RoundedRectangle(cornerRadius: size.radius)
                            .fill(DesignTokens.colorFeedbackSelectBackgroundRest)
                            .frame(width: size.boxSize, height: size.boxSize)
                        
                        // Uses IconBase for consistent icon rendering
                        IconBase(
                            name: indeterminate ? .minus : .check,
                            size: size.iconSize,
                            color: DesignTokens.colorContrastOnDark
                        )
                    }
                }
                .scaleEffect(isPressed ? DesignTokens.scale096 : 1.0)
                .animation(.easeOut(duration: DesignTokens.motionButtonPressDuration), value: isPressed)
                
                Text(label)
                    .font(size.labelFont)
            }
        }
        .buttonStyle(PlainButtonStyle())
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in isPressed = true }
                .onEnded { _ in isPressed = false }
        )
    }
}

enum CheckboxSize {
    case sm, md, lg
    
    var boxSize: CGFloat {
        switch self {
        case .sm: return DesignTokens.iconSize050
        case .md: return DesignTokens.iconSize075
        case .lg: return DesignTokens.iconSize100
        }
    }
    
    var iconSize: IconBaseSize {
        switch self {
        case .sm: return .size050
        case .md: return .size075
        case .lg: return .size100
        }
    }
    
    var gap: CGFloat {
        switch self {
        case .sm, .md: return DesignTokens.spaceGroupedNormal
        case .lg: return DesignTokens.spaceGroupedLoose
        }
    }
}
```

### Android Implementation

```kotlin
@Composable
fun Checkbox(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    label: String,
    indeterminate: Boolean = false,
    size: CheckboxSize = CheckboxSize.Medium
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(size.gap),
        modifier = Modifier
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = rememberRipple(
                    bounded = false,
                    color = DesignTokens.colorPrimary.copy(alpha = DesignTokens.blendPressedDarker)
                )
            ) { onCheckedChange(!checked) }
    ) {
        Box(
            modifier = Modifier
                .size(size.boxSize)
                .clip(RoundedCornerShape(size.radius))
                .background(
                    if (checked || indeterminate) DesignTokens.colorFeedbackSelectBackgroundRest 
                    else Color.Transparent
                )
                .border(
                    width = DesignTokens.borderEmphasis,
                    color = if (checked || indeterminate) DesignTokens.colorFeedbackSelectBorderRest 
                           else DesignTokens.colorFeedbackSelectBorderDefault,
                    shape = RoundedCornerShape(size.radius)
                ),
            contentAlignment = Alignment.Center
        ) {
            if (checked || indeterminate) {
                // Uses IconBase for consistent icon rendering
                IconBase(
                    name = if (indeterminate) IconBaseName.Minus else IconBaseName.Check,
                    size = size.iconSize,
                    color = DesignTokens.colorContrastOnDark
                )
            }
        }
        
        Text(label, style = size.labelStyle)
    }
}

enum class CheckboxSize {
    Small, Medium, Large;
    
    val boxSize: Dp get() = when (this) {
        Small -> DesignTokens.iconSize050.dp
        Medium -> DesignTokens.iconSize075.dp
        Large -> DesignTokens.iconSize100.dp
    }
    
    val iconSize: IconBaseSize get() = when (this) {
        Small -> IconBaseSize.Size050
        Medium -> IconBaseSize.Size075
        Large -> IconBaseSize.Size100
    }
    
    val gap: Dp get() = when (this) {
        Small, Medium -> DesignTokens.spaceGroupedNormal.dp
        Large -> DesignTokens.spaceGroupedLoose.dp
    }
}
```

**Platform Notes**:
- **Web**: Uses hidden native input for form compatibility
- **iOS**: Custom implementation (native Toggle has different UX)
- **Android**: Custom implementation (Material Checkbox has specific styling)

---

## Platform-Specific Interaction Patterns

### Web
- **Hover**: Apply `blend.hoverDarker` (8% darker) to checkbox box border
- **Focus**: Use `accessibility.focus.*` tokens for focus ring (keyboard navigation only via `:focus-visible`)
- **State transition**: Use `motion.selectionTransition` (250ms, easingStandard) for check/uncheck animation
- **Cursor**: `cursor: pointer` on hover

### iOS
- **Press feedback**: Scale transform using `scale096` (96%) with `motion.buttonPress` (150ms, easingAccelerate)
- **State transition**: Use `motion.selectionTransition` (250ms, easingStandard) for check/uncheck animation
- **Touch target**: Entire label area tappable, minimum `tapAreaMinimum` (44pt)
- **VoiceOver**: State announced as "checked" / "unchecked" / "partially checked"

### Android
- **Ripple effect**: Material ripple using `blend.pressedDarker` (12% opacity overlay on primary color)
- **State transition**: Use `motion.selectionTransition` (250ms, easingStandard) for check/uncheck animation
- **Touch target**: Entire label area tappable, minimum `tapAreaMinimum` (44dp)
- **TalkBack**: State announced appropriately for screen reader users

---

## Accessibility

### Screen Readers
- Label is associated with checkbox via `for`/`id` (web) or accessibility label
- State announced: "checked" / "unchecked" / "partially checked"
- Error message associated via `aria-describedby`

### Keyboard Navigation
- Focusable via Tab
- Space to toggle
- Focus ring visible on keyboard focus using `accessibility.focus.*` tokens

### Touch Targets
- Entire label area is tappable
- Minimum touch target: `tapAreaMinimum` (44px)
- Recommended touch target: `tapAreaRecommended` (48px)

---

## Design Decisions Summary

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Custom implementation (not native) | Consistent styling across platforms |
| 2 | 2px border | Better visibility than 1px |
| 3 | Slightly rounded corners | Distinguishes from radio (fully round) |
| 4 | Indeterminate state support | Common pattern for parent checkboxes |
| 5 | Label always required | Accessibility best practice |
| 6 | Three sizes (sm, md, lg) | Covers dense to touch-friendly; uses abbreviations to align with Badge/Avatar |
| 7 | No disabled state | DesignerPunk accessibility philosophy |
| 8 | Use semantic tokens directly | Minimal new tokens — only `inset.075` needed |
| 9 | Include Legal variant in spec | Ensures Base architecture accounts for Legal's needs upfront |
| 10 | Use Icon-Base for checkmark | Consistent icon rendering, color inheritance, accessibility handling |
| 11 | CSS logical properties (web) | RTL language support via `inline-start`/`inline-end` |
| 12 | Create `inset.075` token | Justified by Chip-Base precedent; completes inset progression |
| 13 | Box size = icon + (inset × 2) | Mathematical consistency: 24px, 32px, 40px on 8px grid |

---

## Input-Checkbox-Legal

Input-Checkbox-Legal extends Input-Checkbox-Base with specialized behaviors for legal consent scenarios (terms of service, privacy policies, GDPR consent, etc.).

### Why a Separate Component?

Legal checkboxes have semantic and behavioral differences that justify separation:

1. **Validation constraints**: Cannot be pre-checked in many jurisdictions (GDPR, CCPA)
2. **Audit requirements**: May need timestamp when consent was given
3. **Error handling**: Stricter — cannot proceed without explicit consent
4. **Accessibility**: Full legal text must be accessible, not truncated
5. **Visual emphasis**: May need stronger visual treatment to convey legal weight

### Props Interface (extends CheckboxProps)

```typescript
interface CheckboxLegalProps extends Omit<CheckboxProps, 'size'> {
  /** Prevents checkbox from being pre-checked (GDPR compliance) */
  requiresExplicitConsent?: boolean;
  
  /** Callback with timestamp when consent is given */
  onConsentChange?: (consented: boolean, timestamp: Date) => void;
  
  /** ID linking to full legal text (for audit trail) */
  legalTextId?: string;
  
  /** Version of legal text being consented to */
  legalTextVersion?: string;
  
  /** Whether to show "Required" indicator */
  showRequiredIndicator?: boolean;
  
  /** Helper text displayed below checkbox (persistent, like Input-Text-Base) */
  helperText?: string;
}
```

### Default Values

```typescript
const legalDefaults = {
  checked: false,
  indeterminate: false, // Legal checkboxes don't support indeterminate
  requiresExplicitConsent: true,
  showRequiredIndicator: true
};
```

### Visual Differences

| Aspect | Base | Legal |
|--------|------|-------|
| Size options | sm, md, lg | Fixed: lg box + labelSm typography |
| Label alignment | center (default), top | Fixed: top |
| Pre-check allowed | Yes | No (when `requiresExplicitConsent`) |
| Required indicator | Optional | Default visible |
| Label truncation | Allowed | Not allowed (full text required) |
| Helper text | Supported | Supported (follows Input-Text-Base pattern) |

**Legal Size Rationale**: Large box (40px) provides visual weight appropriate for legal consent, while small label typography (`labelSm`) allows longer legal text to fit without overwhelming the UI. This creates a deliberate visual hierarchy that emphasizes the checkbox action.

**Alignment Rationale**: 
- **Base (center default)**: Short, single-line labels look best vertically centered with the checkbox box. Use `labelAlign="top"` for multi-line labels.
- **Legal (top fixed)**: Long legal text wraps to multiple lines; top-alignment anchors the checkbox to the first line, making it clear what action the user is taking

### Error Pattern (aligned with Input-Text-Base)

Following Input-Text-Base patterns:
- Error message displayed below the checkbox+label row
- Uses `aria-describedby` to associate error with checkbox
- Uses `aria-invalid="true"` when error is present
- Error text uses `color.feedback.error.text` token
- Helper text (if present) appears above error message

### Usage Examples

```tsx
// Terms of Service consent
<CheckboxLegal
  label="I have read and agree to the Terms of Service"
  legalTextId="tos-v2.1"
  legalTextVersion="2.1"
  onConsentChange={(consented, timestamp) => {
    logConsent({ type: 'tos', consented, timestamp, version: '2.1' });
  }}
  error={!tosAccepted && submitted}
  errorMessage="You must accept the Terms of Service to continue"
/>

// GDPR consent
<CheckboxLegal
  label="I consent to the processing of my personal data as described in the Privacy Policy"
  legalTextId="gdpr-consent-v1.0"
  requiresExplicitConsent={true}
  onConsentChange={handleGDPRConsent}
/>
```

### Architecture Impact on Base

Input-Checkbox-Legal extends Base without requiring changes to Base's core implementation:

- **Inheritance**: Legal imports and extends Base's visual/interaction patterns
- **Props extension**: Legal adds props, doesn't modify Base props
- **Token reuse**: Legal uses same tokens as Base (may add component tokens if visual divergence needed)
- **Platform implementations**: Legal wraps Base with additional validation/audit logic

---

## Future Enhancements (Separate Specs)

1. **Input-Checkbox-Group**: Managed group with select-all functionality
2. **Input-Checkbox-Card**: Checkbox as selectable card
3. **Input-Checkbox-Tree**: Hierarchical checkbox structure

---

## Next Steps

1. ✅ **Design outline created** - Decisions documented
2. ⏳ **Review with Peter** - Validate decisions
3. ⏳ **Create requirements.md** - EARS format
4. ⏳ **Create design.md** - Detailed architecture
5. ⏳ **Create tasks.md** - Implementation plan

---

**Organization**: spec-guide
**Scope**: 046-input-checkbox-base
