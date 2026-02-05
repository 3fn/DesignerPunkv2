# Design Document: Input-Checkbox-Base & Input-Checkbox-Legal

**Date**: February 5, 2026
**Spec**: 046 - Input-Checkbox-Base
**Status**: Design Phase
**Dependencies**: 
- Icon-Base component
- Accessibility token family
- Feedback color tokens
- Motion tokens

---

## Overview

This design document details the architecture for Input-Checkbox-Base and Input-Checkbox-Legal components. The design follows True Native Architecture with build-time platform separation, Stemma System component patterns, and Rosetta System token architecture.

**Key Design Principles**:
- Base primitive with semantic variant extension pattern
- Token-first styling (only one new token: `inset.075`)
- Icon-Base integration for consistent icon rendering
- Platform-native RTL support
- Ethical defaults (no pre-checked checkboxes)

---

## Architecture

### Component Hierarchy

```
Input-Checkbox-Base (Primitive)
├── Core checkbox functionality
├── Three size variants (sm, md, lg)
├── States: unchecked, checked, indeterminate, error
└── Platform implementations: web, iOS, Android

Input-Checkbox-Legal (Semantic Variant)
├── Extends Input-Checkbox-Base
├── Fixed sizing (lg box + labelSm typography)
├── Audit trail support (timestamp, legalTextId, version)
├── Explicit consent enforcement
└── No indeterminate state
```

### File Structure

```
src/components/core/Input-Checkbox-Base/
├── platforms/
│   ├── web/InputCheckboxBase.web.ts
│   ├── ios/InputCheckboxBase.ios.swift
│   └── android/InputCheckboxBase.android.kt
├── types.ts
└── README.md

src/components/core/Input-Checkbox-Legal/
├── platforms/
│   ├── web/InputCheckboxLegal.web.ts
│   ├── ios/InputCheckboxLegal.ios.swift
│   └── android/InputCheckboxLegal.android.kt
├── types.ts
└── README.md
```

---

## Components and Interfaces

### Input-Checkbox-Base Props

```typescript
interface InputCheckboxBaseProps {
  /** Whether checkbox is checked */
  checked?: boolean;
  
  /** Indeterminate state (overrides checked visually) */
  indeterminate?: boolean;
  
  /** Label text (required for accessibility) */
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

### Input-Checkbox-Legal Props

```typescript
interface InputCheckboxLegalProps extends Omit<InputCheckboxBaseProps, 'size' | 'indeterminate' | 'labelAlign'> {
  /** Prevents checkbox from being pre-checked (GDPR compliance) */
  requiresExplicitConsent?: boolean;
  
  /** Callback with ISO 8601 timestamp when consent changes */
  onConsentChange?: (consented: boolean, timestamp: string) => void;
  
  /** ID linking to full legal text (for audit trail) */
  legalTextId?: string;
  
  /** Version of legal text being consented to */
  legalTextVersion?: string;
  
  /** Whether to show "Required" indicator */
  showRequiredIndicator?: boolean;
}
```

### Default Values

```typescript
// Input-Checkbox-Base defaults
const baseDefaults = {
  checked: false,
  indeterminate: false,
  size: 'md' as const,
  labelAlign: 'center' as const
};

// Input-Checkbox-Legal defaults
const legalDefaults = {
  checked: false,
  requiresExplicitConsent: true,
  showRequiredIndicator: true
};
```

---

## Token Architecture

### New Token: `inset.075`

**Location**: `src/tokens/semantic/SpacingTokens.ts`

```typescript
/**
 * Compact internal spacing for medium-density components.
 * Used for checkbox box padding at medium size.
 * 
 * @value 6px (0.75 × base)
 * @primitive space075
 * @precedent Chip-Base uses same value for paddingBlock
 */
export const inset075: SemanticToken<number> = {
  name: 'inset.075',
  value: primitives.space075,
  description: 'Compact internal spacing (6px)',
  category: 'spacing'
};
```

### Token Usage by Size

| Size | Icon Size | Inset | Computed Box Size | Gap | Label Typography |
|------|----------|-----------|-------|-----|------------------|
| sm | `icon.size050` | `inset.050` | 24px | `space.grouped.normal` | `labelSm` |
| md | `icon.size075` | `inset.075` | 32px | `space.grouped.normal` | `labelMd` |
| lg | `icon.size100` | `inset.100` | 40px |  `space.grouped.loose` | `labelLg` |

### Token Dependencies

**Colors**:
- `color.feedback.select.background.rest` — checked background
- `color.feedback.select.border.default` — unchecked border
- `color.feedback.select.border.rest` — checked/hover border
- `color.feedback.error.border` — error state border
- `color.contrast.onDark` — checkmark color
- `color.contrast.onLight` — label color

**Accessibility**:
- `accessibility.focus.color` — focus ring color
- `accessibility.focus.width` — focus ring width (2px)
- `accessibility.focus.offset` — focus ring offset (2px)

**Motion**:
- `motion.selectionTransition` — state change animation (250ms, easingStandard)
- `motion.buttonPress` — iOS press feedback (150ms, easingAccelerate)

**Other**:
- `borderEmphasis` — checkbox border width (2px)
- `radiusSubtle` — sm checkbox radius (2px)
- `radiusSmall` — md/lg checkbox radius (4px)
- `scale096` — iOS press scale (96%)
- `blend.hoverDarker` — web hover (8%)
- `blend.pressedDarker` — Android ripple (12%)

---

## Platform Implementations

### Web Implementation

**Custom Element**: `<input-checkbox-base>`

```html
<label class="checkbox checkbox--md">
  <input type="checkbox" class="checkbox__input" />
  <span class="checkbox__box">
    <icon-base name="check" size="size075" color="inherit"></icon-base>
  </span>
  <span class="checkbox__content">
    <span class="checkbox__label">Label text</span>
    <span class="checkbox__helper">Helper text</span>
    <span class="checkbox__error">Error message</span>
  </span>
</label>
```

**Key Implementation Details**:
- Hidden native `<input type="checkbox">` for form compatibility
- CSS logical properties for RTL (`padding-inline`, `margin-inline-start`)
- `:focus-visible` for keyboard-only focus indication
- Shadow DOM for style encapsulation
- Attribute reflection for reactive updates

**CSS Structure**:
```css
.checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--space-grouped-normal);
  cursor: pointer;
}

.checkbox--align-top {
  align-items: flex-start;
}

.checkbox__box {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
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

**SwiftUI View**: `InputCheckboxBase`

```swift
struct InputCheckboxBase: View {
    @Binding var checked: Bool
    var indeterminate: Bool = false
    let label: String
    var size: CheckboxSize = .md
    var labelAlign: LabelAlignment = .center
    var helperText: String? = nil
    var errorMessage: String? = nil
    var onChange: ((Bool) -> Void)? = nil
    
    @State private var isPressed = false
    
    var body: some View {
        Button(action: toggleChecked) {
            HStack(alignment: labelAlign.verticalAlignment, spacing: size.gap) {
                checkboxBox
                labelContent
            }
        }
        .buttonStyle(PlainButtonStyle())
        .simultaneousGesture(pressGesture)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(label)
        .accessibilityValue(accessibilityState)
        .accessibilityAddTraits(.isButton)
    }
    
    private var checkboxBox: some View {
        ZStack {
            RoundedRectangle(cornerRadius: size.radius)
                .stroke(borderColor, lineWidth: DesignTokens.borderEmphasis)
                .frame(width: size.boxSize, height: size.boxSize)
            
            if checked || indeterminate {
                RoundedRectangle(cornerRadius: size.radius)
                    .fill(DesignTokens.colorFeedbackSelectBackgroundRest)
                    .frame(width: size.boxSize, height: size.boxSize)
                
                IconBase(
                    name: indeterminate ? .minus : .check,
                    size: size.iconSize,
                    color: DesignTokens.colorContrastOnDark
                )
            }
        }
        .scaleEffect(isPressed ? DesignTokens.scale096 : 1.0)
        .animation(.easeOut(duration: DesignTokens.motionButtonPressDuration), value: isPressed)
    }
}

enum CheckboxSize {
    case sm, md, lg
    
    var iconSize: IconBaseSize {
        switch self {
        case .sm: return .size050
        case .md: return .size075
        case .lg: return .size100
        }
    }
    
    var inset: CGFloat {
        switch self {
        case .sm: return DesignTokens.inset050
        case .md: return DesignTokens.inset075
        case .lg: return DesignTokens.inset100
        }
    }
    
    // boxSize = icon + padding on both sides (produces square)
    var boxSize: CGFloat {
        return iconSize.value + (inset * 2)
    }
    
    var gap: CGFloat {
        switch self {
        case .sm, .md: return DesignTokens.spaceGroupedNormal
        case .lg: return DesignTokens.spaceGroupedLoose
        }
    }
    
    var radius: CGFloat {
        switch self {
        case .sm: return DesignTokens.radiusSubtle
        case .md, .lg: return DesignTokens.radiusSmall
        }
    }
}
```

**RTL Support**: SwiftUI handles RTL automatically via `leading`/`trailing` alignment. No explicit handling needed.

### Android Implementation

**Jetpack Compose**: `InputCheckboxBase`

```kotlin
@Composable
fun InputCheckboxBase(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    indeterminate: Boolean = false,
    size: CheckboxSize = CheckboxSize.Medium,
    labelAlign: LabelAlignment = LabelAlignment.Center,
    helperText: String? = null,
    errorMessage: String? = null
) {
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
            ) { onCheckedChange(!checked) }
            .semantics {
                role = Role.Checkbox
                stateDescription = when {
                    indeterminate -> "partially checked"
                    checked -> "checked"
                    else -> "unchecked"
                }
            }
    ) {
        CheckboxBox(
            checked = checked,
            indeterminate = indeterminate,
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
private fun CheckboxBox(
    checked: Boolean,
    indeterminate: Boolean,
    size: CheckboxSize,
    hasError: Boolean
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
                color = when {
                    hasError -> DesignTokens.colorFeedbackErrorBorder
                    checked || indeterminate -> DesignTokens.colorFeedbackSelectBorderRest
                    else -> DesignTokens.colorFeedbackSelectBorderDefault
                },
                shape = RoundedCornerShape(size.radius)
            ),
        contentAlignment = Alignment.Center
    ) {
        if (checked || indeterminate) {
            IconBase(
                name = if (indeterminate) IconBaseName.Minus else IconBaseName.Check,
                size = size.iconSize,
                color = DesignTokens.colorContrastOnDark
            )
        }
    }
}

enum class CheckboxSize {
    Small, Medium, Large;
    
    val iconSize: IconBaseSize get() = when (this) {
        Small -> IconBaseSize.Size050
        Medium -> IconBaseSize.Size075
        Large -> IconBaseSize.Size100
    }
    
    val inset: Dp get() = when (this) {
        Small -> DesignTokens.inset050
        Medium -> DesignTokens.inset075
        Large -> DesignTokens.inset100
    }
    
    // boxSize = icon + padding on both sides (produces square)
    val boxSize: Dp get() = iconSize.value + (inset * 2)
    
    val gap: Dp get() = when (this) {
        Small, Medium -> DesignTokens.spaceGroupedNormal
        Large -> DesignTokens.spaceGroupedLoose
    }
    
    val radius: Dp get() = when (this) {
        Small -> DesignTokens.radiusSubtle
        Medium, Large -> DesignTokens.radiusSmall
    }
}
```

**RTL Support**: Compose handles RTL automatically via `Arrangement.Start`/`End`. No explicit handling needed.

---

## Input-Checkbox-Legal Implementation

### Extension Pattern

Input-Checkbox-Legal wraps Input-Checkbox-Base with additional validation and audit logic:

```typescript
// Web implementation
class InputCheckboxLegal extends HTMLElement {
  private baseCheckbox: InputCheckboxBase;
  
  connectedCallback() {
    // Enforce explicit consent
    if (this.requiresExplicitConsent && this.checked) {
      console.warn('Input-Checkbox-Legal: Pre-checked state not allowed with requiresExplicitConsent. Overriding to unchecked.');
      this.checked = false;
    }
    
    // Fixed configuration
    this.baseCheckbox.size = 'lg';
    this.baseCheckbox.labelAlign = 'top';
  }
  
  private handleChange(checked: boolean) {
    const timestamp = new Date().toISOString(); // ISO 8601 format
    
    this.onConsentChange?.(checked, timestamp);
    
    // Include audit trail data
    this.dispatchEvent(new CustomEvent('consent-change', {
      detail: {
        consented: checked,
        timestamp,
        legalTextId: this.legalTextId,
        legalTextVersion: this.legalTextVersion
      }
    }));
  }
}
```

### Visual Differences

| Aspect | Base | Legal |
|--------|------|-------|
| Size | sm, md, lg | Fixed: lg box (40px) |
| Typography | Matches size | Fixed: `labelSm` |
| Label alignment | center (default), top | Fixed: top |
| Indeterminate | Supported | Not supported |
| Required indicator | Optional | Default visible |
| Label truncation | Allowed | Not allowed |

---

## Error Handling

### Error Display Pattern

Following Input-Text-Base conventions:

```html
<label class="checkbox checkbox--error">
  <input type="checkbox" aria-invalid="true" aria-describedby="checkbox-error-1 checkbox-helper-1" />
  <span class="checkbox__box">...</span>
  <span class="checkbox__content">
    <span class="checkbox__label">Label text</span>
    <span class="checkbox__helper" id="checkbox-helper-1">Helper text</span>
    <span class="checkbox__error" id="checkbox-error-1" role="alert">Error message</span>
  </span>
</label>
```

### Error States

1. **Visual**: Error border color on checkbox box
2. **ARIA**: `aria-invalid="true"` on input
3. **Association**: `aria-describedby` links error message
4. **Announcement**: Error message has `role="alert"` for screen readers

---

## Testing Strategy

### Unit Tests

1. **State rendering**: unchecked, checked, indeterminate
2. **Size variants**: sm, md, lg box sizes and typography
3. **Label alignment**: center vs top
4. **Error states**: error styling and ARIA attributes
5. **Icon rendering**: check vs minus icon via Icon-Base

### Integration Tests

1. **Form submission**: checkbox value included in form data
2. **Form reset**: checkbox returns to unchecked
3. **Icon-Base integration**: icons render correctly

### Accessibility Tests

1. **Screen reader announcements**: state changes announced
2. **Keyboard navigation**: Tab focus, Space toggle
3. **Focus indication**: visible focus ring
4. **Touch targets**: minimum 44px

### Legal-Specific Tests

1. **Explicit consent enforcement**: pre-check override + console warning
2. **Timestamp format**: ISO 8601 string
3. **Audit trail**: legalTextId and version in callback
4. **Fixed configuration**: size and alignment not configurable

---

## Design Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Custom implementation (not native) | Consistent styling across platforms |
| 2 | 2px border (`borderEmphasis`) | Better visibility than 1px |
| 3 | Slightly rounded corners | Distinguishes from radio (fully round) |
| 4 | Indeterminate state support | Common pattern for parent checkboxes |
| 5 | Label always required | Accessibility best practice |
| 6 | Three sizes (sm, md, lg) | Covers dense to touch-friendly |
| 7 | No disabled state | DesignerPunk accessibility philosophy |
| 8 | Use semantic tokens directly | Minimal new tokens — only `inset.075` |
| 9 | Legal extends Base | Clean separation of concerns |
| 10 | Icon-Base for checkmark | Consistent icon rendering |
| 11 | CSS logical properties (web) | RTL support |
| 12 | Platform-native RTL (iOS/Android) | SwiftUI/Compose handle automatically |
| 13 | ISO 8601 timestamps | Serialization consistency for audit trails |
| 14 | Console warning for pre-check violation | Developer feedback without breaking |
| 15 | Form reset to unchecked | Ethical default — no pre-checked checkboxes |

---

**Organization**: spec-validation
**Scope**: 046-input-checkbox-base