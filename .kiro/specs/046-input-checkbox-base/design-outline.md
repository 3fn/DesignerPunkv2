# Input-Checkbox-Base Component - Design Outline

**Date**: January 19, 2026
**Purpose**: Capture design decisions and token requirements before creating full spec
**Status**: Design Outline (Pre-Requirements)

> ⚠️ **PLACEHOLDER NOTICE**: The visual specifications, token references, and pixel values in this document are preliminary placeholders largely derived from the wrkingClass prototype. They are NOT yet aligned with DesignerPunk's token system and design language. This outline must be reviewed and updated to use proper DesignerPunk tokens before proceeding to requirements.md.

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
├── Check states, label, disabled, error
└── Semantic variants inherit from this

Future Semantic Variants:
├── Input-Checkbox-Group (managed group with select-all)
├── Input-Checkbox-Card (checkbox as card selection)
└── Input-Checkbox-Tree (hierarchical checkboxes)
```

**Design Pattern**: Base primitive with semantic variants for specialized behaviors.

---

## Visual Specifications

### States

| State | Box Background | Box Border | Check Color | Label Color |
|-------|----------------|------------|-------------|-------------|
| **unchecked** | transparent | `color.border.default` | - | `color.content.primary` |
| **checked** | `color.interactive.primary` | `color.interactive.primary` | `white100` | `color.content.primary` |
| **indeterminate** | `color.interactive.primary` | `color.interactive.primary` | `white100` | `color.content.primary` |
| **hover** | transparent | `color.border.emphasis` | - | `color.content.primary` |
| **focus** | transparent | `color.focus.ring` | - | `color.content.primary` |
| **disabled** | `color.surface.disabled` | `color.border.disabled` | `color.content.disabled` | `color.content.disabled` |
| **error** | transparent | `color.feedback.error.emphasis` | - | `color.content.primary` |


### Size Variants

| Size | Box Size | Border Radius | Check Icon | Label Font | Gap |
|------|----------|---------------|------------|------------|-----|
| **sm** | 16px | `radius.small` | 10px | `fontSize.sm` | `space100` |
| **md** | 20px | `radius.small` | 12px | `fontSize.md` | `space150` |
| **lg** | 24px | `radius.medium` | 16px | `fontSize.lg` | `space200` |

### Check Mark

- **Icon**: Simple checkmark (✓) for checked state
- **Icon**: Horizontal dash (−) for indeterminate state
- **Stroke Width**: 2px
- **Animation**: Scale + opacity transition on state change

### Border

- **Width**: `borderWidth200` (2px) for visibility
- **Radius**: Slightly rounded corners (not fully rounded like radio)

---

## Token Requirements

### New Semantic Tokens

```typescript
// Checkbox-specific semantic tokens
'checkbox.background.checked': {
  primitiveReferences: { value: 'color.interactive.primary' },
  context: 'Checked checkbox background',
  description: 'Fill color when checkbox is checked'
},

'checkbox.border.default': {
  primitiveReferences: { value: 'color.border.default' },
  context: 'Default checkbox border',
  description: 'Border color for unchecked checkbox'
},

'checkbox.border.error': {
  primitiveReferences: { value: 'color.feedback.error.emphasis' },
  context: 'Error checkbox border',
  description: 'Border color when checkbox has error'
},

'checkbox.check.color': {
  primitiveReferences: { value: 'white100' },
  context: 'Check mark color',
  description: 'Color of the check mark icon'
},

// Size tokens
'checkbox.size.sm': { value: 16 },
'checkbox.size.md': { value: 20 },
'checkbox.size.lg': { value: 24 }
```

### Existing Tokens Used

**Colors**:
- `color.interactive.primary` (checked background)
- `color.border.default`, `color.border.emphasis`
- `color.content.primary`, `color.content.disabled`
- `color.focus.ring`
- `color.feedback.error.emphasis`

**Typography**:
- `fontSize.sm`, `fontSize.md`, `fontSize.lg`

**Spacing**:
- `space100`, `space150`, `space200` (label gap)

**Border**:
- `borderWidth200` (2px)
- `radius.small`, `radius.medium`

**Motion**:
- `motion.duration.fast` (state transitions)

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
  
  /** Disabled state */
  disabled?: boolean;
  
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
  disabled: false,
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

// Disabled checkbox
<Checkbox label="Unavailable option" disabled />

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
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border: var(--border-width-200) solid var(--checkbox-border-default);
  border-radius: var(--radius-small);
  transition: all var(--motion-duration-fast);
}

.checkbox__input:checked + .checkbox__box {
  background-color: var(--checkbox-background-checked);
  border-color: var(--checkbox-background-checked);
}

.checkbox__input:focus-visible + .checkbox__box {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
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
                        .stroke(checked ? Color.clear : Tokens.checkboxBorderDefault, lineWidth: 2)
                        .frame(width: size.boxSize, height: size.boxSize)
                    
                    if checked {
                        RoundedRectangle(cornerRadius: size.radius)
                            .fill(Tokens.checkboxBackgroundChecked)
                            .frame(width: size.boxSize, height: size.boxSize)
                        
                        Image(systemName: "checkmark")
                            .font(.system(size: size.iconSize, weight: .bold))
                            .foregroundColor(.white)
                    }
                }
                
                Text(label)
                    .font(.system(size: size.fontSize))
            }
        }
        .buttonStyle(PlainButtonStyle())
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
                .background(if (checked) DesignTokens.checkboxBackgroundChecked else Color.Transparent)
                .border(
                    width = 2.dp,
                    color = if (checked) Color.Transparent else DesignTokens.checkboxBorderDefault,
                    shape = RoundedCornerShape(size.radius)
                )
                .clickable { onCheckedChange(!checked) },
            contentAlignment = Alignment.Center
        ) {
            if (checked) {
                Icon(
                    Icons.Default.Check,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(size.iconSize)
                )
            }
        }
        
        Text(label, fontSize = size.fontSize)
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
- Focus ring visible on keyboard focus

### Touch Targets
- Entire label area is tappable
- Minimum 44px touch target height

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
