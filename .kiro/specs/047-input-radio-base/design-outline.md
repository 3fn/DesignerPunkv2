# Input-Radio-Base & Input-Radio-Set Components - Design Outline

**Date**: February 7, 2026
**Purpose**: Design decisions and token requirements for Input-Radio-Base and Input-Radio-Set components
**Status**: Design Outline (Pre-Requirements)
**Organization**: spec-guide
**Scope**: 047-input-radio-base

---

## Component Overview

Radio is a single-selection control used within a group where only one option can be selected at a time. Unlike checkboxes (multi-select), radios enforce mutual exclusivity within their group.

**Key Characteristics**:
- **Single selection**: Only one option active per group
- **Mutual exclusivity**: Selecting one deselects others in group
- **Label association**: Always paired with accessible label
- **Touch-friendly**: Adequate touch target size
- **Circular indicator**: Distinguishes from checkbox (square)

---

## Architecture

### Component Structure

```
Input-Radio-Base (Primitive)
├── Provides foundational radio behaviors
├── Selected/unselected states, label, error
├── Three size variants (sm, md, lg)
└── Platform implementations: web, iOS, Android

Input-Radio-Set (Pattern)
├── Orchestrates child Input-Radio-Base components
├── Manages mutual exclusivity (selection state)
├── Controlled selection state (selectedValue)
├── Validation (required)
├── Error state and message display
└── Keyboard navigation (arrow keys within group)
```

**Design Pattern**: Base primitive + Set orchestrator pattern (consistent with Button-VerticalList-Set).

### Architectural Principle: Orchestration, Not Duplication

> **Lesson from Spec 046**: Input-Checkbox-Legal was initially implemented as a standalone component that duplicated Base's rendering logic. This caused 23 test failures and required significant refactoring. The correct pattern is wrapper/orchestration.

**Input-Radio-Set MUST**:
- Render child `Input-Radio-Base` components (not duplicate their rendering logic)
- Pass selection state to children via props or context
- Handle keyboard navigation at the group level
- Display error messages at the group level

**Input-Radio-Set MUST NOT**:
- Duplicate radio circle/dot rendering logic from Base
- Re-implement hover, focus, or press states
- Create its own checkbox-like visual elements

This ensures:
- ~80% less code than standalone implementation
- Base improvements automatically benefit Set usage
- Single source of truth for radio rendering

### File Structure

```
src/components/core/Input-Radio-Base/
├── platforms/
│   ├── web/InputRadioBase.web.ts
│   ├── ios/InputRadioBase.ios.swift
│   └── android/InputRadioBase.android.kt
├── types.ts
└── README.md

src/components/core/Input-Radio-Set/
├── platforms/
│   ├── web/InputRadioSet.web.ts
│   ├── ios/InputRadioSet.ios.swift
│   └── android/InputRadioSet.android.kt
├── types.ts
└── README.md
```

---

## Visual Specifications

### States

| State | Circle Background | Circle Border | Dot Color | Label Color |
|-------|-------------------|---------------|-----------|-------------|
| **unselected** | transparent | `color.feedback.select.border.default` | - | `color.contrast.onLight` |
| **selected** | transparent | `color.feedback.select.border.rest` | `color.feedback.select.background.rest` | `color.contrast.onLight` |
| **hover (unselected)** | transparent | `blend.hoverDarker` applied to border | - | `color.contrast.onLight` |
| **hover (selected)** | transparent | `color.feedback.select.border.rest` | `color.feedback.select.background.rest` | `color.contrast.onLight` |
| **focus** | transparent | `accessibility.focus.color` ring | - | `color.contrast.onLight` |
| **error** | transparent | `color.feedback.error.border` | - | `color.contrast.onLight` |

**Note**: No disabled state per DesignerPunk accessibility philosophy.

### Hover Implementation

Following the checkbox pattern, hover uses blend tokens for consistent interaction feedback:

**Web**:
- Unselected hover: Apply `blend.hoverDarker` (8% darker) to border color
- Selected hover: Maintain `color.feedback.select.border.rest` (already visually distinct)
- Implementation: CSS custom property `--_radio-hover-border` calculated via blend utilities

**iOS**:
- Press feedback: `scale096` (96% scale) with `motion.buttonPress` timing
- No hover state (touch-only devices)
- macOS/iPadOS with pointer: Same as web

**Android**:
- Ripple effect: `blend.pressedDarker` (12%) on touch
- No hover state (touch-only devices)

### Size Variants

Following the same pattern as Input-Checkbox-Base:

| Size | Dot Size Token | Inset Token | Computed Circle Size | Gap Token | Label Typography |
|------|----------------|-------------|----------------------|-----------|------------------|
| **sm** | `icon.size050` (16px) | `space.inset.050` (4px) | 24px | `space.grouped.normal` | `labelSm` |
| **md** | `icon.size075` (20px) | `space.inset.075` (6px) | 32px | `space.grouped.normal` | `labelMd` |
| **lg** | `icon.size100` (24px) | `space.inset.100` (8px) | 40px | `space.grouped.loose` | `labelLg` |

**Circle Size Formula**: `dotSize + (inset × 2)`
- sm: 16 + (4 × 2) = 24px
- md: 20 + (6 × 2) = 32px  
- lg: 24 + (8 × 2) = 40px

### Selection Indicator (Dot)

- **Shape**: Filled circle centered within outer circle
- **Dot Size**: Same as icon size token (maintains proportional relationship)
  - sm: 16px dot in 24px circle
  - md: 20px dot in 32px circle
  - lg: 24px dot in 40px circle
- **Animation**: Scale transition on selection change using `motion.selectionTransition`

### Border

- **Width**: `borderEmphasis` (2px) for visibility
- **Radius**: `radius.full` (50% / circle) — distinguishes from checkbox

---

## Token Architecture

### No New Tokens Required

Unlike Input-Checkbox-Base which introduced `space.inset.075`, Input-Radio-Base uses only existing tokens:

- `space.inset.075` already exists (added by checkbox spec)
- All color tokens exist in `color.feedback.select.*` family
- Motion tokens exist as `motion.selectionTransition`
- Blend tokens exist for hover/press states

### Token Dependencies

**Colors**:
- `color.feedback.select.background.rest` — dot fill color (selected)
- `color.feedback.select.border.default` — unselected border
- `color.feedback.select.border.rest` — selected border
- `color.feedback.error.border` — error state border
- `color.contrast.onLight` — label color

**Accessibility**:
- `accessibility.focus.color` — focus ring color
- `accessibility.focus.width` — focus ring width (2px)
- `accessibility.focus.offset` — focus ring offset (2px)

**Motion**:
- `motion.selectionTransition` — state change animation (250ms, easingStandard)
- `motion.buttonPress` — iOS press feedback (150ms, easingAccelerate)

**Spacing**:
- `space.inset.050` — sm size padding (4px)
- `space.inset.075` — md size padding (6px)
- `space.inset.100` — lg size padding (8px)
- `space.grouped.normal` — sm/md label gap (8px)
- `space.grouped.loose` — lg label gap (12px)

**Blend** (hover/press states):
- `blend.hoverDarker` — web hover (8% darker)
- `blend.pressedDarker` — Android ripple (12% darker)

**Other**:
- `borderEmphasis` — radio border width (2px)
- `radius.full` — fully rounded (circle)
- `scale096` — iOS press scale (96%)

---

## Component API Design

### Input-Radio-Base Props

```typescript
interface InputRadioBaseProps {
  /** Whether radio is selected */
  selected?: boolean;
  
  /** Label text (required for accessibility) */
  label: string;
  
  /** Value for form submission */
  value: string;
  
  /** Radio group name (for native form behavior) */
  name?: string;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Vertical alignment of label relative to radio circle */
  labelAlign?: 'center' | 'top';
  
  /** Helper text displayed below radio (persistent) */
  helperText?: string;
  
  /** Error message displayed below helper text (conditional) */
  errorMessage?: string;
  
  /** Called when radio is selected */
  onSelect?: (value: string) => void;
  
  /** Unique identifier */
  id?: string;
  
  /** Test ID for automated testing */
  testID?: string;
}
```

### Input-Radio-Set Props

```typescript
interface InputRadioSetProps {
  /** Currently selected value (controlled) */
  selectedValue?: string | null;
  
  /** Callback when selection changes */
  onSelectionChange?: (value: string | null) => void;
  
  /** Whether a selection is required */
  required?: boolean;
  
  /** Error state indicator */
  error?: boolean;
  
  /** Error message to display */
  errorMessage?: string;
  
  /** Size variant applied to all children */
  size?: 'sm' | 'md' | 'lg';
  
  /** Test ID for automated testing */
  testID?: string;
  
  /** Child Input-Radio-Base components */
  children: React.ReactNode;
}
```

### Default Values

```typescript
// Input-Radio-Base defaults
const baseDefaults = {
  selected: false,
  size: 'md' as const,
  labelAlign: 'center' as const
};

// Input-Radio-Set defaults
const setDefaults = {
  selectedValue: null,
  required: false,
  error: false,
  size: 'md' as const
};
```

### Key Differences from Checkbox

| Aspect | Checkbox | Radio |
|--------|----------|-------|
| Selection | Multi-select | Single-select (mutual exclusivity) |
| Shape | Rounded square | Circle |
| Indicator | Icon (check/minus) | Filled dot |
| Indeterminate | Supported | Not applicable |
| Icon-Base | Required | Not required |
| `name` prop | Optional | Important for grouping |
| `value` prop | Optional | Required for form submission |
| Set component | Not in scope | Input-Radio-Set included |

---

## Input-Radio-Set Behavior

### Orchestration Pattern

Input-Radio-Set orchestrates child Input-Radio-Base components without duplicating their rendering logic:

**Web (Custom Element)**:
```html
<!-- Set renders a container with ARIA attributes -->
<div class="radio-set" role="radiogroup">
  <!-- Children are slotted, not re-rendered -->
  <slot></slot>
  <span class="radio-set__error" role="alert">Error message</span>
</div>
```

**iOS (SwiftUI)**:
```swift
// Set provides context, children render themselves
struct InputRadioSet: View {
    var body: some View {
        VStack {
            // Children access selection via environment
            content()
        }
        .environment(\.radioSetSelectedValue, $selectedValue)
    }
}
```

**Android (Compose)**:
```kotlin
// Set provides CompositionLocal, children render themselves
@Composable
fun InputRadioSet(...) {
    CompositionLocalProvider(
        LocalRadioSetSelectedValue provides selectedValue
    ) {
        content()
    }
}
```

### Selection Management

The Set component manages mutual exclusivity:

1. **Controlled state**: Parent provides `selectedValue` and `onSelectionChange`
2. **Child coordination**: Set passes `selected` prop to matching child via context/environment
3. **Deselection**: Clicking selected radio does NOT deselect (radio convention)

### Validation

```typescript
function validateSelection(
  selectedValue: string | null,
  required: boolean
): ValidationResult {
  if (required && selectedValue === null) {
    return { isValid: false, message: 'Please select an option' };
  }
  return { isValid: true, message: null };
}
```

### Keyboard Navigation

Following ARIA radio group pattern:
- **Tab**: Focus enters/exits the group
- **Arrow Up/Down**: Move focus within group
- **Arrow Left/Right**: Move focus within group (alternative)
- **Space**: Select focused option
- **Home**: Focus first option
- **End**: Focus last option

### ARIA Attributes

```html
<div role="radiogroup" aria-labelledby="group-label" aria-describedby="group-error">
  <input type="radio" role="radio" aria-checked="true|false" />
</div>
```

---

## Platform Implementations

### Web Implementation

**Custom Elements**: `<input-radio-base>`, `<input-radio-set>`

```html
<!-- Input-Radio-Set -->
<div class="radio-set" role="radiogroup" aria-labelledby="group-label">
  <!-- Input-Radio-Base -->
  <label class="radio radio--md">
    <input type="radio" class="radio__input" name="group" value="option" />
    <span class="radio__circle">
      <span class="radio__dot"></span>
    </span>
    <span class="radio__content">
      <span class="radio__label">Label text</span>
      <span class="radio__helper">Helper text</span>
      <span class="radio__error">Error message</span>
    </span>
  </label>
</div>
```

**Key Implementation Details**:
- Hidden native `<input type="radio">` for form compatibility
- CSS logical properties for RTL (`padding-inline`, `margin-inline-start`)
- `:focus-visible` for keyboard-only focus indication
- Shadow DOM for style encapsulation
- Attribute reflection for reactive updates
- Hover border calculated via blend utilities (JS → CSS custom property)

**CSS Structure**:
```css
.radio {
  display: inline-flex;
  align-items: center;
  gap: var(--space-grouped-normal);
  cursor: pointer;
}

.radio--align-top {
  align-items: flex-start;
}

.radio__circle {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: var(--border-emphasis) solid var(--color-feedback-select-border-default);
  border-radius: var(--radius-full);
  transition: all var(--motion-selection-transition-duration) var(--motion-selection-transition-easing);
}

.radio__dot {
  border-radius: var(--radius-full);
  background-color: var(--color-feedback-select-background-rest);
  transform: scale(0);
  transition: transform var(--motion-selection-transition-duration) var(--motion-selection-transition-easing);
}

.radio__input:checked + .radio__circle {
  border-color: var(--color-feedback-select-border-rest);
}

.radio__input:checked + .radio__circle .radio__dot {
  transform: scale(1);
}

/* Hover - unselected */
.radio__touch-target:hover .radio__circle {
  border-color: var(--_radio-hover-border, var(--color-feedback-select-border-rest));
}

/* Hover - selected (maintain selected border) */
.radio--selected .radio__touch-target:hover .radio__circle {
  border-color: var(--color-feedback-select-border-rest);
}

.radio__input:focus-visible + .radio__circle {
  outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
  outline-offset: var(--accessibility-focus-offset);
}
```

### iOS Implementation

**SwiftUI Views**: `InputRadioBase`, `InputRadioSet`

```swift
struct InputRadioBase: View {
    let value: String
    let label: String
    @Binding var selectedValue: String?
    var size: RadioSize = .md
    var labelAlign: LabelAlignment = .center
    var helperText: String? = nil
    var errorMessage: String? = nil
    var onSelect: ((String) -> Void)? = nil
    
    @State private var isPressed = false
    
    var isSelected: Bool { selectedValue == value }
    
    var body: some View {
        Button(action: { 
            selectedValue = value
            onSelect?(value)
        }) {
            HStack(alignment: labelAlign.verticalAlignment, spacing: size.gap) {
                radioCircle
                labelContent
            }
        }
        .buttonStyle(PlainButtonStyle())
        .simultaneousGesture(pressGesture)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(label)
        .accessibilityValue(isSelected ? "selected" : "not selected")
        .accessibilityAddTraits(.isButton)
    }
    
    private var radioCircle: some View {
        ZStack {
            Circle()
                .stroke(borderColor, lineWidth: DesignTokens.borderEmphasis)
                .frame(width: size.circleSize, height: size.circleSize)
            
            if isSelected {
                Circle()
                    .fill(DesignTokens.colorFeedbackSelectBackgroundRest)
                    .frame(width: size.dotSize, height: size.dotSize)
                    .transition(.scale)
            }
        }
        .scaleEffect(isPressed ? DesignTokens.scale096 : 1.0)
        .animation(.easeOut(duration: DesignTokens.motionButtonPressDuration), value: isPressed)
    }
}

struct InputRadioSet: View {
    @Binding var selectedValue: String?
    var required: Bool = false
    var error: Bool = false
    var errorMessage: String? = nil
    var size: RadioSize = .md
    let content: () -> [InputRadioBase]
    
    var body: some View {
        VStack(alignment: .leading, spacing: DesignTokens.spaceGroupedNormal) {
            if error, let message = errorMessage {
                Text(message)
                    .foregroundColor(DesignTokens.colorFeedbackErrorText)
                    .accessibilityLabel("Error: \(message)")
            }
            
            ForEach(content(), id: \.value) { radio in
                radio
                    .environment(\.radioSetSelectedValue, $selectedValue)
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityAddTraits(.isRadioGroup)
    }
}

enum RadioSize {
    case sm, md, lg
    
    var dotSize: CGFloat {
        switch self {
        case .sm: return 16  // icon.size050
        case .md: return 20  // icon.size075
        case .lg: return 24  // icon.size100
        }
    }
    
    var inset: CGFloat {
        switch self {
        case .sm: return DesignTokens.inset050
        case .md: return DesignTokens.inset075
        case .lg: return DesignTokens.inset100
        }
    }
    
    var circleSize: CGFloat {
        return dotSize + (inset * 2)
    }
    
    var gap: CGFloat {
        switch self {
        case .sm, .md: return DesignTokens.spaceGroupedNormal
        case .lg: return DesignTokens.spaceGroupedLoose
        }
    }
}
```

**RTL Support**: SwiftUI handles RTL automatically via `leading`/`trailing` alignment.

### Android Implementation

**Jetpack Compose**: `InputRadioBase`, `InputRadioSet`

```kotlin
@Composable
fun InputRadioBase(
    value: String,
    label: String,
    selectedValue: String?,
    onSelectedChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    size: RadioSize = RadioSize.Medium,
    labelAlign: LabelAlignment = LabelAlignment.Center,
    helperText: String? = null,
    errorMessage: String? = null
) {
    val isSelected = selectedValue == value
    val interactionSource = remember { MutableInteractionSource() }
    
    Row(
        verticalAlignment = when (labelAlign) {
            LabelAlignment.Center -> Alignment.CenterVertically
            LabelAlignment.Top -> Alignment.Top
        },
        horizontalArrangement = Arrangement.spacedBy(size.gap),
        modifier = modifier
            .clickable(
                interactionSource = interactionSource,
                indication = rememberRipple(
                    bounded = false,
                    color = DesignTokens.colorPrimary.copy(alpha = DesignTokens.blendPressedDarker)
                )
            ) { onSelectedChange(value) }
            .semantics {
                role = Role.RadioButton
                selected = isSelected
            }
    ) {
        RadioCircle(
            selected = isSelected,
            size = size,
            hasError = errorMessage != null
        )
        
        Column {
            Text(label, style = size.labelStyle)
            helperText?.let { Text(it, style = DesignTokens.helperTextStyle) }
            errorMessage?.let { Text(it, style = DesignTokens.errorTextStyle) }
        }
    }
}

@Composable
fun InputRadioSet(
    selectedValue: String?,
    onSelectionChange: (String?) -> Unit,
    modifier: Modifier = Modifier,
    required: Boolean = false,
    error: Boolean = false,
    errorMessage: String? = null,
    size: RadioSize = RadioSize.Medium,
    content: @Composable () -> Unit
) {
    Column(
        verticalArrangement = Arrangement.spacedBy(DesignTokens.spaceGroupedNormal),
        modifier = modifier.semantics { 
            role = Role.RadioGroup 
        }
    ) {
        if (error && errorMessage != null) {
            Text(
                text = errorMessage,
                color = DesignTokens.colorFeedbackErrorText,
                modifier = Modifier.semantics { 
                    liveRegion = LiveRegionMode.Polite 
                }
            )
        }
        
        CompositionLocalProvider(
            LocalRadioSetSelectedValue provides selectedValue,
            LocalRadioSetOnSelectionChange provides onSelectionChange,
            LocalRadioSetSize provides size
        ) {
            content()
        }
    }
}

@Composable
private fun RadioCircle(
    selected: Boolean,
    size: RadioSize,
    hasError: Boolean
) {
    Box(
        modifier = Modifier
            .size(size.circleSize)
            .border(
                width = DesignTokens.borderEmphasis,
                color = when {
                    hasError -> DesignTokens.colorFeedbackErrorBorder
                    selected -> DesignTokens.colorFeedbackSelectBorderRest
                    else -> DesignTokens.colorFeedbackSelectBorderDefault
                },
                shape = CircleShape
            ),
        contentAlignment = Alignment.Center
    ) {
        AnimatedVisibility(
            visible = selected,
            enter = scaleIn(),
            exit = scaleOut()
        ) {
            Box(
                modifier = Modifier
                    .size(size.dotSize)
                    .background(DesignTokens.colorFeedbackSelectBackgroundRest, CircleShape)
            )
        }
    }
}

enum class RadioSize {
    Small, Medium, Large;
    
    val dotSize: Dp get() = when (this) {
        Small -> 16.dp   // icon.size050
        Medium -> 20.dp  // icon.size075
        Large -> 24.dp   // icon.size100
    }
    
    val inset: Dp get() = when (this) {
        Small -> DesignTokens.inset050
        Medium -> DesignTokens.inset075
        Large -> DesignTokens.inset100
    }
    
    val circleSize: Dp get() = dotSize + (inset * 2)
    
    val gap: Dp get() = when (this) {
        Small, Medium -> DesignTokens.spaceGroupedNormal
        Large -> DesignTokens.spaceGroupedLoose
    }
}
```

**RTL Support**: Compose handles RTL automatically via `Arrangement.Start`/`End`.

---

## Accessibility

### Screen Readers
- Label is associated with radio via `for`/`id` (web) or accessibility label
- State announced: "selected" / "not selected"
- Group context announced via `role="radiogroup"` (web)

### Keyboard Navigation
- Tab: Focus enters/exits the group
- Arrow keys: Navigate within group
- Space: Select focused option
- Focus ring visible on keyboard focus

### Touch Targets
- Entire label area is tappable
- Minimum 44px touch target height (all sizes meet this)

---

## Error Handling

### Error Display Pattern

Following Input-Checkbox-Base conventions:

```html
<div class="radio-set radio-set--error" role="radiogroup">
  <span class="radio-set__error" role="alert">Please select an option</span>
  
  <label class="radio radio--error">
    <input type="radio" aria-invalid="true" aria-describedby="radio-error-1" />
    <span class="radio__circle">
      <span class="radio__dot"></span>
    </span>
    <span class="radio__content">
      <span class="radio__label">Label text</span>
    </span>
  </label>
</div>
```

### Error States

1. **Visual**: Error border color on radio circle
2. **ARIA**: `aria-invalid="true"` on input
3. **Association**: `aria-describedby` links error message
4. **Announcement**: Error message has `role="alert"` for screen readers

---

## Design Decisions Summary

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Circular shape | Universal convention distinguishing from checkbox |
| 2 | Inner dot indicator | Clear visual feedback for selection (no icon needed) |
| 3 | 2px border (`borderEmphasis`) | Better visibility than 1px, consistent with checkbox |
| 4 | Same sizing as checkbox | Visual consistency across selection controls |
| 5 | Label always required | Accessibility best practice |
| 6 | Three sizes (sm, md, lg) | Covers dense to touch-friendly |
| 7 | No disabled state | DesignerPunk accessibility philosophy |
| 8 | No new tokens required | Reuses existing token infrastructure |
| 9 | No Icon-Base integration | Dot is simpler than icon, no dependency needed |
| 10 | CSS logical properties (web) | RTL support |
| 11 | Platform-native RTL (iOS/Android) | SwiftUI/Compose handle automatically |
| 12 | `value` prop required | Essential for form submission and group behavior |
| 13 | `name` prop for grouping | Native form behavior for radio groups |
| 14 | Include Input-Radio-Set | Manages mutual exclusivity, validation, keyboard nav |
| 15 | Blend tokens for hover | Consistent with other interactive components |
| 16 | No Card/Tile variants | Would conflict with Button-VerticalList and Container-Card |
| 17 | Set orchestrates, not duplicates | Lesson from Spec 046: wrapper pattern reduces code ~80% |
| 18 | Context/environment for state | Platform-idiomatic way to pass selection to children |

---

## Lessons Applied from Spec 046

| Lesson | How Applied |
|--------|-------------|
| Implementation drift from design doc | Explicit orchestration pattern documented; Set MUST NOT duplicate Base logic |
| Wrapper pattern benefits (~80% code reduction) | Set uses context/environment to coordinate children, not re-render them |
| Token naming consistency | Using current Rosetta System token names (post-Spec 052) |
| Clear architectural boundaries | Base handles rendering; Set handles coordination and validation |

---

## Related Documentation

- [Input-Checkbox-Base Design](../046-input-checkbox-base/design.md) - Sister component with shared patterns
- [Button-VerticalList-Set](../../src/components/core/Button-VerticalList-Set/types.ts) - Set pattern reference
- [Token Family - Spacing](../../.kiro/steering/Token-Family-Spacing.md) - Inset token documentation
- [Token Family - Color](../../.kiro/steering/Token-Family-Color.md) - Feedback select tokens
- [Token Family - Blend](../../.kiro/steering/Token-Family-Blend.md) - Hover/press blend tokens
