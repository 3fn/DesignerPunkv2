# Input-Radio-Base Component - Design Outline

**Date**: January 19, 2026
**Purpose**: Capture design decisions and token requirements before creating full spec
**Status**: Design Outline (Pre-Requirements)

> ⚠️ **PLACEHOLDER NOTICE**: The visual specifications, token references, and pixel values in this document are preliminary placeholders largely derived from the wrkingClass prototype. They are NOT yet aligned with DesignerPunk's token system and design language. This outline must be reviewed and updated to use proper DesignerPunk tokens before proceeding to requirements.md.

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
├── Selected/unselected states, label, disabled, error
└── Semantic variants inherit from this

Future Semantic Variants:
├── Input-Radio-Group (managed group with validation)
├── Input-Radio-Card (radio as card selection)
└── Input-Radio-Tile (larger touch-friendly tiles)
```

**Design Pattern**: Base primitive with semantic variants for specialized behaviors.

---

## Visual Specifications

### States

| State | Circle Background | Circle Border | Dot Color | Label Color |
|-------|-------------------|---------------|-----------|-------------|
| **unselected** | transparent | `color.border.default` | - | `color.content.primary` |
| **selected** | transparent | `color.interactive.primary` | `color.interactive.primary` | `color.content.primary` |
| **hover** | transparent | `color.border.emphasis` | - | `color.content.primary` |
| **focus** | transparent | `color.focus.ring` | - | `color.content.primary` |
| **disabled** | `color.surface.disabled` | `color.border.disabled` | `color.content.disabled` | `color.content.disabled` |
| **error** | transparent | `color.feedback.error.emphasis` | - | `color.content.primary` |

### Size Variants

| Size | Circle Size | Border Width | Dot Size | Label Font | Gap |
|------|-------------|--------------|----------|------------|-----|
| **sm** | 16px | 2px | 8px | `fontSize.sm` | `space100` |
| **md** | 20px | 2px | 10px | `fontSize.md` | `space150` |
| **lg** | 24px | 2px | 12px | `fontSize.lg` | `space200` |

### Selection Indicator

- **Shape**: Filled circle (dot) centered within outer circle
- **Dot Size**: ~50% of outer circle diameter
- **Animation**: Scale + opacity transition on selection change

### Border

- **Width**: `borderWidth200` (2px) for visibility
- **Radius**: Fully rounded (50% / circle)

---

## Token Requirements

### New Semantic Tokens

```typescript
// Radio-specific semantic tokens
'radio.border.default': {
  primitiveReferences: { value: 'color.border.default' },
  context: 'Default radio border',
  description: 'Border color for unselected radio'
},

'radio.border.selected': {
  primitiveReferences: { value: 'color.interactive.primary' },
  context: 'Selected radio border',
  description: 'Border color when radio is selected'
},

'radio.border.error': {
  primitiveReferences: { value: 'color.feedback.error.emphasis' },
  context: 'Error radio border',
  description: 'Border color when radio has error'
},

'radio.dot.color': {
  primitiveReferences: { value: 'color.interactive.primary' },
  context: 'Selection dot color',
  description: 'Color of the selection indicator dot'
},

// Size tokens
'radio.size.sm': { value: 16 },
'radio.size.md': { value: 20 },
'radio.size.lg': { value: 24 }
```

### Existing Tokens Used

**Colors**:
- `color.interactive.primary` (selected state)
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

**Motion**:
- `motion.duration.fast` (state transitions)

---

## Component API Design

### Props Interface

```typescript
interface RadioProps {
  /** Whether radio is selected */
  selected?: boolean;
  
  /** Label text */
  label: string;
  
  /** Value for form submission */
  value: string;
  
  /** Radio group name (for native form behavior) */
  name?: string;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Error state */
  error?: boolean;
  
  /** Called when radio is selected */
  onSelect?: (value: string) => void;
  
  /** Unique identifier */
  id?: string;
  
  /** Test ID for automated testing */
  testID?: string;
}
```

### Default Values

```typescript
const defaults = {
  selected: false,
  size: 'md',
  disabled: false,
  error: false
};
```

### Usage Examples

```tsx
// Basic radio group (managed externally)
<Radio 
  label="Option A" 
  value="a"
  selected={selection === 'a'}
  onSelect={setSelection}
/>
<Radio 
  label="Option B" 
  value="b"
  selected={selection === 'b'}
  onSelect={setSelection}
/>

// Radio with error
<Radio 
  label="Required selection" 
  value="required"
  error
/>

// Disabled radio
<Radio label="Unavailable option" value="unavailable" disabled />

// Small radios for dense UI
<Radio label="Yes" value="yes" size="sm" selected />
<Radio label="No" value="no" size="sm" />
```

---

## Platform Considerations

### Web Implementation

```html
<label class="radio">
  <input type="radio" class="radio__input" name="group" value="option" />
  <span class="radio__circle">
    <span class="radio__dot"></span>
  </span>
  <span class="radio__label">Label text</span>
</label>
```

```css
.radio__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio__circle {
  width: var(--radio-size);
  height: var(--radio-size);
  border: var(--border-width-200) solid var(--radio-border-default);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--motion-duration-fast);
}

.radio__dot {
  width: 50%;
  height: 50%;
  border-radius: 50%;
  background-color: var(--radio-dot-color);
  transform: scale(0);
  transition: transform var(--motion-duration-fast);
}

.radio__input:checked + .radio__circle {
  border-color: var(--radio-border-selected);
}

.radio__input:checked + .radio__circle .radio__dot {
  transform: scale(1);
}

.radio__input:focus-visible + .radio__circle {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
```

### iOS Implementation

```swift
struct Radio: View {
    @Binding var selectedValue: String
    let value: String
    let label: String
    let size: RadioSize
    
    var isSelected: Bool { selectedValue == value }
    
    var body: some View {
        Button(action: { selectedValue = value }) {
            HStack(spacing: size.gap) {
                ZStack {
                    Circle()
                        .stroke(isSelected ? Tokens.radioBorderSelected : Tokens.radioBorderDefault, lineWidth: 2)
                        .frame(width: size.circleSize, height: size.circleSize)
                    
                    if isSelected {
                        Circle()
                            .fill(Tokens.radioDotColor)
                            .frame(width: size.dotSize, height: size.dotSize)
                            .transition(.scale)
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
fun Radio(
    selected: Boolean,
    onSelect: () -> Unit,
    label: String,
    size: RadioSize = RadioSize.Medium
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(size.gap),
        modifier = Modifier.clickable { onSelect() }
    ) {
        Box(
            modifier = Modifier
                .size(size.circleSize)
                .border(
                    width = 2.dp,
                    color = if (selected) DesignTokens.radioBorderSelected else DesignTokens.radioBorderDefault,
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
                        .background(DesignTokens.radioDotColor, CircleShape)
                )
            }
        }
        
        Text(label, fontSize = size.fontSize)
    }
}
```

**Platform Notes**:
- **Web**: Uses hidden native input for form compatibility and accessibility
- **iOS**: Custom implementation for consistent styling
- **Android**: Custom implementation (Material RadioButton has specific styling)

---

## Accessibility

### Screen Readers
- Label is associated with radio via `for`/`id` (web) or accessibility label
- State announced: "selected" / "not selected"
- Group context announced via `role="radiogroup"` (web)

### Keyboard Navigation
- Focusable via Tab (to group)
- Arrow keys to navigate within group
- Space to select focused option
- Focus ring visible on keyboard focus

### Touch Targets
- Entire label area is tappable
- Minimum 44px touch target height

---

## Design Decisions Summary

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Circular shape | Universal convention distinguishing from checkbox |
| 2 | Inner dot indicator | Clear visual feedback for selection |
| 3 | 2px border | Better visibility than 1px |
| 4 | Base component only | Group management is separate concern |
| 5 | Label always required | Accessibility best practice |
| 6 | Three sizes | Covers dense to touch-friendly |

---

## Future Enhancements (Separate Specs)

1. **Input-Radio-Group**: Managed group with validation and error handling
2. **Input-Radio-Card**: Radio as selectable card (like wrkingClass demographics)
3. **Input-Radio-Tile**: Larger touch-friendly selection tiles

---

## Next Steps

1. ✅ **Design outline created** - Decisions documented
2. ⏳ **Review with Peter** - Validate decisions
3. ⏳ **Create requirements.md** - EARS format
4. ⏳ **Create design.md** - Detailed architecture
5. ⏳ **Create tasks.md** - Implementation plan

---

**Organization**: spec-guide
**Scope**: 047-input-radio-base
