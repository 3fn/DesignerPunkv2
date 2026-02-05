# Input-Checkbox-Base Component - Design Outline

**Date**: January 19, 2026
**Updated**: February 4, 2026
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

Semantic Variants:
├── Input-Checkbox-Legal (legal authorization checkboxes)
│   └── Visual/behavioral differences for legal consent patterns
│   └── May have stricter validation, audit requirements
│
Future Semantic Variants:
├── Input-Checkbox-Group (managed group with select-all)
├── Input-Checkbox-Card (checkbox as card selection)
└── Input-Checkbox-Tree (hierarchical checkboxes)
```

**Design Pattern**: Base primitive with semantic variants for specialized behaviors.

**Why separate Input-Checkbox-Legal?**
Legal authorization checkboxes have semantic differences from general-use checkboxes:
- May require stricter validation patterns (can't be pre-checked in some jurisdictions)
- May need audit trail requirements (timestamp when checked)
- Different error handling (can't proceed without explicit consent)
- Accessibility requirements (full legal text must be readable, not truncated)
- Visual treatment may diverge to emphasize legal weight

This follows the Avatar (Human vs Agent) and Chip (Base vs Filter vs Input) pattern where semantic differences justify separate components.

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

| Size | Box Size | Border Radius | Check Icon | Label Typography | Gap |
|------|----------|---------------|------------|------------------|-----|
| **sm** | `icon.size050` | `radiusSubtle` | `icon.size050` | `labelSm` | `space.grouped.normal` |
| **md** | `icon.size075` | `radiusSmall` | `icon.size075` | `labelMd` | `space.grouped.loose` |
| **lg** | `icon.size100` | `radiusSmall` | `icon.size100` | `labelLg` | `space.related.normal` |

### Check Mark

- **Icon**: Simple checkmark (✓) for checked state
- **Icon**: Horizontal dash (−) for indeterminate state
- **Stroke Width**: `icon.strokeWidth`
- **Animation**: Scale + opacity transition on state change (use `motion.duration.fast`)

### Border

- **Width**: `borderEmphasis` for visibility
- **Radius**: Slightly rounded corners (not fully rounded like radio) — `radiusSubtle` or `radiusSmall`

---

## Token Requirements

### Token Strategy: Use Existing Semantic Tokens

Input-Checkbox-Base uses existing semantic tokens directly. **No component tokens are needed** because the existing `color.feedback.select.*` tokens perfectly serve the checkbox use case.

**Rationale**: Component tokens should only be created when:
1. A value doesn't exist as a semantic token
2. The component needs to override a semantic token for specific reasons

The checkbox component's visual requirements are fully met by existing semantic tokens.

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
- `space.grouped.normal` — sm gap (8px)
- `space.grouped.loose` — md gap (12px)
- `space.related.normal` — lg gap (16px)

**Border**:
- `borderEmphasis` — checkbox border width (2px)

**Radius**:
- `radiusSubtle` — sm checkbox radius (2px)
- `radiusSmall` — md/lg checkbox radius (4px)

**Motion**:
- `motion.duration.fast` — state transitions

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
  
  /** Error state */
  error?: boolean;
  
  /** Error message (displayed below) */
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
  error: false
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

// Checkbox with error
<Checkbox 
  label="Required field" 
  checked={false}
  error
  errorMessage="This field is required"
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

```html
<label class="checkbox">
  <input type="checkbox" class="checkbox__input" />
  <span class="checkbox__box">
    <svg class="checkbox__check"><!-- checkmark --></svg>
  </span>
  <span class="checkbox__label">Label text</span>
</label>
```

```css
.checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox__box {
  width: var(--icon-size-075);
  height: var(--icon-size-075);
  border: var(--border-emphasis) solid var(--color-feedback-select-border-default);
  border-radius: var(--radius-small);
  transition: all var(--motion-duration-fast);
}

.checkbox__input:checked + .checkbox__box {
  background-color: var(--color-feedback-select-background-rest);
  border-color: var(--color-feedback-select-border-rest);
}

.checkbox__input:focus-visible + .checkbox__box {
  outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
  outline-offset: var(--accessibility-focus-offset);
}
```

### iOS Implementation

```swift
struct Checkbox: View {
    @Binding var checked: Bool
    let label: String
    let size: CheckboxSize
    
    var body: some View {
        Button(action: { checked.toggle() }) {
            HStack(spacing: size.gap) {
                ZStack {
                    RoundedRectangle(cornerRadius: size.radius)
                        .stroke(checked ? Color.clear : DesignTokens.colorFeedbackSelectBorderDefault, lineWidth: DesignTokens.borderEmphasis)
                        .frame(width: size.boxSize, height: size.boxSize)
                    
                    if checked {
                        RoundedRectangle(cornerRadius: size.radius)
                            .fill(DesignTokens.colorFeedbackSelectBackgroundRest)
                            .frame(width: size.boxSize, height: size.boxSize)
                        
                        Image(systemName: "checkmark")
                            .font(.system(size: size.iconSize, weight: .bold))
                            .foregroundColor(DesignTokens.colorContrastOnDark)
                    }
                }
                
                Text(label)
                    .font(size.labelFont)
            }
        }
        .buttonStyle(PlainButtonStyle())
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
    
    var gap: CGFloat {
        switch self {
        case .sm: return DesignTokens.spaceGroupedNormal
        case .md: return DesignTokens.spaceGroupedLoose
        case .lg: return DesignTokens.spaceRelatedNormal
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
    size: CheckboxSize = CheckboxSize.Medium
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(size.gap)
    ) {
        Box(
            modifier = Modifier
                .size(size.boxSize)
                .clip(RoundedCornerShape(size.radius))
                .background(if (checked) DesignTokens.colorFeedbackSelectBackgroundRest else Color.Transparent)
                .border(
                    width = DesignTokens.borderEmphasis,
                    color = if (checked) DesignTokens.colorFeedbackSelectBorderRest else DesignTokens.colorFeedbackSelectBorderDefault,
                    shape = RoundedCornerShape(size.radius)
                )
                .clickable { onCheckedChange(!checked) },
            contentAlignment = Alignment.Center
        ) {
            if (checked) {
                Icon(
                    Icons.Default.Check,
                    contentDescription = null,
                    tint = DesignTokens.colorContrastOnDark,
                    modifier = Modifier.size(size.iconSize)
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
    
    val gap: Dp get() = when (this) {
        Small -> DesignTokens.spaceGroupedNormal.dp
        Medium -> DesignTokens.spaceGroupedLoose.dp
        Large -> DesignTokens.spaceRelatedNormal.dp
    }
}
```

**Platform Notes**:
- **Web**: Uses hidden native input for form compatibility
- **iOS**: Custom implementation (native Toggle has different UX)
- **Android**: Custom implementation (Material Checkbox has specific styling)

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
| 6 | Three sizes | Covers dense to touch-friendly |
| 7 | No disabled state | DesignerPunk accessibility philosophy |
| 8 | Use semantic tokens directly | No component tokens needed — existing `color.feedback.select.*` tokens serve the use case |
| 9 | Separate Legal variant | Legal checkboxes have semantic differences (validation, audit, accessibility) |

---

## Future Enhancements (Separate Specs)

1. **Input-Checkbox-Legal**: Legal authorization checkboxes with specialized visual/behavioral patterns
2. **Input-Checkbox-Group**: Managed group with select-all functionality
3. **Input-Checkbox-Card**: Checkbox as selectable card
4. **Input-Checkbox-Tree**: Hierarchical checkbox structure

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
