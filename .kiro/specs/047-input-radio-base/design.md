# Design Document: Input-Radio-Base & Input-Radio-Set

**Date**: February 7, 2026
**Spec**: 047 - Input-Radio-Base
**Status**: Design Phase
**Dependencies**: 
- Spec 046 (Input-Checkbox-Base) - Established patterns for selection controls
- Accessibility token family (`accessibility.focus.*` tokens)
- Feedback color tokens (`color.feedback.select.*`, `color.feedback.error.*`)
- Motion tokens (`motion.selectionTransition`, `motion.buttonPress`)

---

## Overview

This design document specifies the architecture and implementation approach for Input-Radio-Base and Input-Radio-Set components. These components provide single-selection controls following True Native Architecture with build-time platform separation.

**Key Design Principles**:
- **Orchestration, not duplication**: Set orchestrates Base children without duplicating rendering logic (lesson from Spec 046)
- **Token-based styling**: All visual properties use semantic tokens (no hard-coded values)
- **Platform-idiomatic state coordination**: Web uses slots, iOS uses environment values, Android uses CompositionLocal
- **Checkbox parity**: Size variants, token usage, and interaction patterns mirror Input-Checkbox-Base for consistency

---

## Architecture

### Component Hierarchy

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
- Create its own radio-like visual elements

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
├── README.md
└── __tests__/
    ├── InputRadioBase.test.ts
    └── InputRadioBase.stemma.test.ts

src/components/core/Input-Radio-Set/
├── platforms/
│   ├── web/InputRadioSet.web.ts
│   ├── ios/InputRadioSet.ios.swift
│   └── android/InputRadioSet.android.kt
├── types.ts
├── README.md
└── __tests__/
    ├── InputRadioSet.test.ts
    └── InputRadioSet.stemma.test.ts
```

---

## Components and Interfaces

### Input-Radio-Base Props

```typescript
/**
 * Input-Radio-Base Type Definitions
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Radio-Base
 */

export type RadioSize = 'sm' | 'md' | 'lg';
export type LabelAlignment = 'center' | 'top';

export interface InputRadioBaseProps {
  /** Whether radio is selected */
  selected?: boolean;
  
  /** Label text (required for accessibility) */
  label: string;
  
  /** Value for form submission */
  value: string;
  
  /** Radio group name (for native form behavior) */
  name?: string;
  
  /** Size variant */
  size?: RadioSize;
  
  /** Vertical alignment of label relative to radio circle */
  labelAlign?: LabelAlignment;
  
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

export const INPUT_RADIO_BASE_DEFAULTS = {
  selected: false,
  size: 'md' as RadioSize,
  labelAlign: 'center' as LabelAlignment
} as const;

export const INPUT_RADIO_BASE_OBSERVED_ATTRIBUTES = [
  'selected',
  'label',
  'value',
  'name',
  'size',
  'label-align',
  'helper-text',
  'error-message',
  'test-id'
] as const;
```

### Input-Radio-Set Props

```typescript
/**
 * Input-Radio-Set Type Definitions
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Pattern (Set)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Radio-Set
 */

export interface InputRadioSetProps {
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
  size?: RadioSize;
  
  /** Test ID for automated testing */
  testID?: string;
  
  /** Child Input-Radio-Base components */
  children: React.ReactNode;
}

export const INPUT_RADIO_SET_DEFAULTS = {
  selectedValue: null,
  required: false,
  error: false,
  size: 'md' as RadioSize
} as const;

export const INPUT_RADIO_SET_OBSERVED_ATTRIBUTES = [
  'selected-value',
  'required',
  'error',
  'error-message',
  'size',
  'test-id'
] as const;
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

## Data Models

### Size Variant Specifications

| Size | Dot Size Token | Inset Token | Computed Circle Size | Gap Token | Label Typography |
|------|----------------|-------------|----------------------|-----------|------------------|
| **sm** | `icon.size050` (16px) | `space.inset.050` (4px) | 24px | `space.grouped.normal` | `labelSm` |
| **md** | `icon.size075` (20px) | `space.inset.075` (6px) | 32px | `space.grouped.normal` | `labelMd` |
| **lg** | `icon.size100` (24px) | `space.inset.100` (8px) | 40px | `space.grouped.loose` | `labelLg` |

**Circle Size Formula**: `dotSize + (inset × 2)`
- sm: 16 + (4 × 2) = 24px
- md: 20 + (6 × 2) = 32px  
- lg: 24 + (8 × 2) = 40px

### State Color Mapping

| State | Circle Background | Circle Border | Dot Color | Label Color |
|-------|-------------------|---------------|-----------|-------------|
| **unselected** | transparent | `color.feedback.select.border.default` | - | `color.contrast.onLight` |
| **selected** | transparent | `color.feedback.select.border.rest` | `color.feedback.select.background.rest` | `color.contrast.onLight` |
| **hover (unselected)** | transparent | `blend.hoverDarker` applied to border | - | `color.contrast.onLight` |
| **hover (selected)** | transparent | `color.feedback.select.border.rest` | `color.feedback.select.background.rest` | `color.contrast.onLight` |
| **focus** | transparent | `accessibility.focus.color` ring | - | `color.contrast.onLight` |
| **error** | transparent | `color.feedback.error.border` | - | `color.contrast.onLight` |

---

## Token Dependencies

### No New Tokens Required

Unlike Input-Checkbox-Base which introduced `space.inset.075`, Input-Radio-Base uses only existing tokens:

- `space.inset.075` already exists (added by checkbox spec)
- All color tokens exist in `color.feedback.select.*` family
- Motion tokens exist as `motion.selectionTransition`
- Blend tokens exist for hover/press states

### Token Reference

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

## Platform Implementations

### Web Implementation

**Custom Elements**: `<input-radio-base>`, `<input-radio-set>`

#### Input-Radio-Base Structure

```html
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
```

#### Input-Radio-Set Structure

```html
<div class="radio-set" role="radiogroup" aria-labelledby="group-label">
  <slot></slot>
  <span class="radio-set__error" role="alert">Error message</span>
</div>
```

#### Key Implementation Details

- Hidden native `<input type="radio">` for form compatibility
- CSS logical properties for RTL support (see CSS Structure below)
- `:focus-visible` for keyboard-only focus indication
- Shadow DOM for style encapsulation
- Attribute reflection for reactive updates
- Hover border calculated via blend utilities (JS → CSS custom property)

#### RTL Support via Logical Properties

All spacing and alignment uses CSS logical properties:
- `gap` (inherently logical)
- `padding-inline-start` / `padding-inline-end` instead of `padding-left` / `padding-right`
- `margin-inline-start` instead of `margin-left`
- `text-align: start` instead of `text-align: left`

This ensures the component automatically mirrors in RTL contexts without additional code.

#### CSS Structure

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
.radio:hover .radio__circle {
  border-color: var(--_radio-hover-border, var(--color-feedback-select-border-rest));
}

/* Hover - selected (maintain selected border) */
.radio--selected:hover .radio__circle {
  border-color: var(--color-feedback-select-border-rest);
}

.radio__input:focus-visible + .radio__circle {
  outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
  outline-offset: var(--accessibility-focus-offset);
}
```

### iOS Implementation

**SwiftUI Views**: `InputRadioBase`, `InputRadioSet`

#### InputRadioBase

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

#### InputRadioSet

```swift
struct InputRadioSet<Content: View>: View {
    @Binding var selectedValue: String?
    var required: Bool = false
    var error: Bool = false
    var errorMessage: String? = nil
    var size: RadioSize = .md
    let content: () -> Content
    
    var body: some View {
        VStack(alignment: .leading, spacing: DesignTokens.spaceGroupedNormal) {
            if error, let message = errorMessage {
                Text(message)
                    .foregroundColor(DesignTokens.colorFeedbackErrorText)
                    .accessibilityLabel("Error: \(message)")
            }
            
            content()
                .environment(\.radioSetSelectedValue, $selectedValue)
                .environment(\.radioSetSize, size)
        }
        .accessibilityElement(children: .contain)
    }
}
```

**RTL Support**: SwiftUI handles RTL automatically via `leading`/`trailing` alignment.

### Android Implementation

**Jetpack Compose**: `InputRadioBase`, `InputRadioSet`

#### InputRadioBase

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

#### InputRadioSet

```kotlin
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
```

**RTL Support**: Compose handles RTL automatically via `Arrangement.Start`/`End`.

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

### Validation Logic

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

---

## Testing Strategy

### Unit Tests (Input-Radio-Base)

Following Test-Development-Standards, tests will use Stemma System validators:

1. **Component Registration**: Verify `<input-radio-base>` custom element registers correctly
2. **Attribute Reactivity**: Test all observed attributes update rendering
3. **State Rendering**: Test selected, unselected, hover, focus, error states
4. **Size Variants**: Validate all three sizes (sm, md, lg) render correctly
5. **Label Alignment**: Test center and top alignment options
6. **Accessibility**: Validate ARIA attributes and keyboard interaction
7. **Form Integration**: Test form submission includes radio value when selected

### Unit Tests (Input-Radio-Set)

1. **Orchestration Pattern**: Verify Set does not duplicate Base rendering logic
2. **Mutual Exclusivity**: Test selecting one radio deselects others
3. **Keyboard Navigation**: Test arrow keys, Tab, Space, Home, End
4. **Validation**: Test required validation and error display
5. **State Coordination**: Test selectedValue prop propagates to children
6. **Accessibility**: Validate `role="radiogroup"` and ARIA attributes

### Stemma System Validators

```typescript
import {
  validateComponentName,
  validateTokenUsage,
  validatePropertyAndAccessibility,
  getErrorGuidance
} from '../validators';

// Validate naming convention
validateComponentName('Input-Radio-Base'); // ✅ [Family]-[Type]-[Variant]
validateComponentName('Input-Radio-Set');  // ✅ [Family]-[Type]-[Variant]

// Validate token usage (no hard-coded values)
validateTokenUsage(component);

// Validate accessibility properties
validatePropertyAndAccessibility(component);
```

### Integration Tests

1. **Form Submission**: Test radio value included in form data when selected
2. **Form Reset**: Test radio returns to unselected state on form reset
3. **Set + Base Integration**: Test Set correctly coordinates Base children

---

## Design Decisions

### Decision 1: Circular Shape with Dot Indicator

**Options Considered**:
1. Circular shape with filled dot (standard radio pattern)
2. Circular shape with checkmark icon (like checkbox)
3. Custom shape (brand differentiation)

**Decision**: Circular shape with filled dot

**Rationale**: Universal convention distinguishes radio from checkbox. Users immediately understand single-selection behavior. No Icon-Base dependency needed (simpler implementation).

**Trade-offs**:
- ✅ **Gained**: Universal recognition, simpler implementation, no icon dependency
- ❌ **Lost**: Brand differentiation opportunity
- ⚠️ **Risk**: None significant

### Decision 2: Same Sizing as Checkbox

**Options Considered**:
1. Same sizing as Input-Checkbox-Base (24/32/40px)
2. Smaller sizing (radios often smaller than checkboxes)
3. Custom sizing based on radio-specific needs

**Decision**: Same sizing as Input-Checkbox-Base

**Rationale**: Visual consistency across selection controls. Reuses existing token infrastructure (`space.inset.050/075/100`). Touch targets meet accessibility requirements at all sizes.

**Trade-offs**:
- ✅ **Gained**: Visual consistency, token reuse, accessibility compliance
- ❌ **Lost**: Flexibility for radio-specific sizing
- ⚠️ **Risk**: May feel large compared to some design systems

### Decision 3: Include Input-Radio-Set in Scope

**Options Considered**:
1. Base only (like checkbox spec)
2. Base + Set together
3. Set as separate spec

**Decision**: Base + Set together

**Rationale**: Radios are almost always used in groups. Set provides essential mutual exclusivity and keyboard navigation. Developing together ensures consistent patterns and reduces integration risk.

**Trade-offs**:
- ✅ **Gained**: Complete solution, consistent patterns, reduced integration risk
- ❌ **Lost**: Smaller scope per spec
- ⚠️ **Risk**: Larger implementation surface

**Counter-Argument**: "Checkbox spec was Base-only, why include Set here?"

**Response**: Checkboxes work independently (multi-select). Radios require group behavior (single-select). The Set component is essential for radio usability, not optional like a checkbox group would be.

### Decision 4: Orchestration Pattern for Set

**Options Considered**:
1. Set duplicates Base rendering (standalone)
2. Set orchestrates Base children (wrapper pattern)
3. Set uses inheritance from Base

**Decision**: Set orchestrates Base children

**Rationale**: Lesson from Spec 046 - duplication caused 23 test failures. Orchestration provides ~80% code reduction, single source of truth, and automatic benefit from Base improvements.

**Trade-offs**:
- ✅ **Gained**: Code reduction, maintainability, single source of truth
- ❌ **Lost**: Set cannot customize Base rendering
- ⚠️ **Risk**: Tight coupling between Set and Base

### Decision 5: Blend Tokens for Hover States

**Options Considered**:
1. Separate hover color tokens
2. CSS filters (brightness)
3. Blend utilities (darken/lighten)

**Decision**: Blend utilities via `blend.hoverDarker`

**Rationale**: Consistent with Button-CTA and Input-Checkbox-Base patterns. Cross-platform consistent (same math on web, iOS, Android). Reduces token proliferation.

**Trade-offs**:
- ✅ **Gained**: Consistency, cross-platform parity, fewer tokens
- ❌ **Lost**: Simpler CSS-only implementation
- ⚠️ **Risk**: JS dependency for hover color calculation

---

## Behavioral Contracts

### Input-Radio-Base Contracts

| Contract | Description | WCAG | Platforms |
|----------|-------------|------|-----------|
| `focusable` | Can receive keyboard focus | 2.1.1 | web, ios, android |
| `pressable` | Responds to click/tap on entire label area | 2.1.1 | web, ios, android |
| `hover_state` | Visual feedback on hover (web) | 1.4.13 | web |
| `pressed_state` | Visual feedback when pressed | 2.4.7 | web, ios, android |
| `selected_state` | Shows filled dot when selected | 1.4.1 | web, ios, android |
| `error_state` | Shows error border and message | 3.3.1 | web, ios, android |
| `focus_ring` | WCAG 2.4.7 focus visible indicator | 2.4.7 | web, ios, android |
| `form_integration` | Native form submission | 4.1.2 | web, ios, android |

### Input-Radio-Set Contracts

| Contract | Description | WCAG | Platforms |
|----------|-------------|------|-----------|
| `mutual_exclusivity` | Only one radio selected at a time | N/A | web, ios, android |
| `keyboard_navigation` | Arrow keys navigate within group | 2.1.1 | web, ios, android |
| `group_validation` | Required validation at group level | 3.3.1 | web, ios, android |
| `error_announcement` | Error message announced to screen readers | 4.1.3 | web, ios, android |
| `radiogroup_role` | Proper ARIA role for group | 4.1.2 | web, ios, android |

---

## Related Documentation

- [Input-Checkbox-Base Design](../046-input-checkbox-base/design.md) - Sister component with shared patterns
- [Component-Family-Form-Inputs](../../.kiro/steering/Component-Family-Form-Inputs.md) - Family documentation
- [Component-Development-Guide](../../.kiro/steering/Component-Development-Guide.md) - Development patterns
- [Test-Development-Standards](../../.kiro/steering/Test-Development-Standards.md) - Testing patterns
- [Token-Family-Blend](../../.kiro/steering/Token-Family-Blend.md) - Hover/press blend tokens

---

**Organization**: spec-validation
**Scope**: 047-input-radio-base
