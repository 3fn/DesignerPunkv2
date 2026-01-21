# Chip-Base Component - Design Outline

**Date**: January 19, 2026
**Purpose**: Capture design decisions and token requirements before creating full spec
**Status**: Design Outline (Pre-Requirements)

> ⚠️ **PLACEHOLDER NOTICE**: The visual specifications, token references, and pixel values in this document are preliminary placeholders largely derived from the wrkingClass prototype. They are NOT yet aligned with DesignerPunk's token system and design language. This outline must be reviewed and updated to use proper DesignerPunk tokens before proceeding to requirements.md.

---

## Component Overview

Chip is a compact, interactive element used for filtering, selection, or input. Unlike Badges (which are display-only), Chips respond to user interaction. They can be toggled, selected, or dismissed.

**Key Characteristics**:
- **Interactive**: Responds to tap/click
- **Toggleable**: Can represent selected/unselected state
- **Dismissible**: Optional close/remove action
- **Compact**: Small footprint for dense UI patterns

---

## Architecture

### Component Structure

```
Chip-Base (Primitive)
├── Provides foundational chip behaviors
├── Toggle state, dismiss action, icon support
└── Semantic variants inherit from this

Future Semantic Variants:
├── Chip-Filter (multi-select filtering)
├── Chip-Input (user-entered values, removable)
├── Chip-Choice (single-select from group)
└── Chip-Action (triggers an action)
```

**Design Pattern**: Base primitive with semantic variants for specialized behaviors.

---

## Visual Specifications

### States

| State | Background | Border | Text | Use Case |
|-------|------------|--------|------|----------|
| **default** | `color.surface.secondary` | `color.border.default` | `color.content.primary` | Unselected chip |
| **selected** | `color.interactive.primary` | `color.interactive.primary` | `color.content.onPrimary` | Active/selected |
| **hover** | `color.surface.tertiary` | `color.border.emphasis` | `color.content.primary` | Mouse hover |
| **pressed** | `color.surface.tertiary` | `color.border.emphasis` | `color.content.primary` | Active press |
| **disabled** | `color.surface.disabled` | `color.border.disabled` | `color.content.disabled` | Non-interactive |


### Size Variants

| Size | Height | Padding | Font Size | Icon Size | Use Case |
|------|--------|---------|-----------|-----------|----------|
| **sm** | 28px | `space150` | `fontSize.sm` | 14px | Compact filters |
| **md** | 32px | `space200` | `fontSize.md` | 16px | Default |
| **lg** | 40px | `space250` | `fontSize.lg` | 20px | Touch-friendly |

### Shape

- **Border Radius**: Fully rounded (pill shape) using `radius.full`
- **Border Width**: `borderWidth100` (1px)

### Typography

- **Font Weight**: `fontWeight.medium` (500)
- **Line Height**: 1 (single line only)

---

## Token Requirements

### New Semantic Tokens

```typescript
// Chip-specific semantic tokens
'chip.background.default': {
  primitiveReferences: { value: 'color.surface.secondary' },
  context: 'Default chip background',
  description: 'Background for unselected chips'
},

'chip.background.selected': {
  primitiveReferences: { value: 'color.interactive.primary' },
  context: 'Selected chip background',
  description: 'Background for selected/active chips'
},

'chip.border.default': {
  primitiveReferences: { value: 'color.border.default' },
  context: 'Default chip border',
  description: 'Border color for unselected chips'
},

'chip.text.default': {
  primitiveReferences: { value: 'color.content.primary' },
  context: 'Default chip text',
  description: 'Text color for unselected chips'
},

'chip.text.selected': {
  primitiveReferences: { value: 'color.content.onPrimary' },
  context: 'Selected chip text',
  description: 'Text color for selected chips'
},

// Size tokens
'chip.height.sm': { value: 28 },
'chip.height.md': { value: 32 },
'chip.height.lg': { value: 40 }
```

### Existing Tokens Used

**Colors**:
- `color.surface.secondary`, `color.surface.tertiary`
- `color.interactive.primary`
- `color.content.primary`, `color.content.onPrimary`
- `color.border.default`, `color.border.emphasis`

**Typography**:
- `fontSize.sm`, `fontSize.md`, `fontSize.lg`
- `fontWeight.medium`

**Spacing**:
- `space150`, `space200`, `space250` (horizontal padding)
- `space050` (icon gap)

**Border**:
- `borderWidth100`
- `radius.full`

**Motion**:
- `motion.duration.fast` (state transitions)

---

## Component API Design

### Props Interface

```typescript
interface ChipProps {
  /** Chip text content */
  label: string;
  
  /** Whether chip is selected */
  selected?: boolean;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Optional leading icon */
  icon?: IconName;
  
  /** Show dismiss/close button */
  dismissible?: boolean;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Called when chip is pressed */
  onPress?: () => void;
  
  /** Called when dismiss button is pressed */
  onDismiss?: () => void;
  
  /** Test ID for automated testing */
  testID?: string;
}
```

### Default Values

```typescript
const defaults = {
  selected: false,
  size: 'md',
  dismissible: false,
  disabled: false
};
```

### Usage Examples

```tsx
// Filter chip (toggleable)
<Chip 
  label="House" 
  selected={filters.includes('house')}
  onPress={() => toggleFilter('house')}
/>

// Dismissible input chip
<Chip 
  label="JavaScript" 
  dismissible 
  onDismiss={() => removeSkill('javascript')}
/>

// Chip with icon
<Chip 
  label="High Impact" 
  icon="alert-circle"
  selected={showHighImpact}
  onPress={() => setShowHighImpact(!showHighImpact)}
/>

// Disabled chip
<Chip label="Unavailable" disabled />
```

---

## Platform Considerations

### Web Implementation

```css
.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space050);
  padding: 0 var(--chip-padding);
  height: var(--chip-height);
  border: var(--border-width-100) solid var(--chip-border-default);
  border-radius: var(--radius-full);
  background-color: var(--chip-background-default);
  color: var(--chip-text-default);
  cursor: pointer;
  transition: all var(--motion-duration-fast);
}

.chip:hover:not(:disabled) {
  background-color: var(--color-surface-tertiary);
  border-color: var(--color-border-emphasis);
}

.chip--selected {
  background-color: var(--chip-background-selected);
  border-color: var(--chip-background-selected);
  color: var(--chip-text-selected);
}
```

### iOS Implementation

```swift
struct Chip: View {
    let label: String
    let selected: Bool
    let size: ChipSize
    let onPress: () -> Void
    
    var body: some View {
        Button(action: onPress) {
            HStack(spacing: Tokens.space050) {
                Text(label)
                    .font(.system(size: size.fontSize, weight: .medium))
            }
            .padding(.horizontal, size.padding)
            .frame(height: size.height)
            .background(selected ? Tokens.chipBackgroundSelected : Tokens.chipBackgroundDefault)
            .foregroundColor(selected ? Tokens.chipTextSelected : Tokens.chipTextDefault)
            .overlay(
                Capsule()
                    .stroke(selected ? Color.clear : Tokens.chipBorderDefault, lineWidth: 1)
            )
            .clipShape(Capsule())
        }
    }
}
```

### Android Implementation

```kotlin
@Composable
fun Chip(
    label: String,
    selected: Boolean = false,
    size: ChipSize = ChipSize.Medium,
    onClick: () -> Unit
) {
    val backgroundColor = if (selected) 
        DesignTokens.chipBackgroundSelected 
    else 
        DesignTokens.chipBackgroundDefault
    
    val textColor = if (selected)
        DesignTokens.chipTextSelected
    else
        DesignTokens.chipTextDefault
    
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(50),
        color = backgroundColor,
        border = if (!selected) BorderStroke(1.dp, DesignTokens.chipBorderDefault) else null
    ) {
        Text(
            text = label,
            modifier = Modifier
                .height(size.height)
                .padding(horizontal = size.padding),
            color = textColor,
            fontSize = size.fontSize,
            fontWeight = FontWeight.Medium
        )
    }
}
```

**Platform Notes**:
- **Web**: Uses CSS transitions for smooth state changes
- **iOS**: Uses SwiftUI Button with custom styling
- **Android**: Uses Compose Surface with onClick

---

## Accessibility

### Screen Readers
- Announce label and selected state
- `aria-pressed="true/false"` for toggle chips (web)
- Dismiss button has accessible label "Remove [label]"

### Keyboard Navigation
- Focusable via Tab
- Space/Enter to toggle
- Delete/Backspace to dismiss (if dismissible)

### Touch Targets
- Minimum 44px touch target (lg size meets this)
- sm/md sizes should have expanded touch area

---

## Design Decisions Summary

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Interactive (vs Badge) | Chips handle user input; Badges display info |
| 2 | Pill shape | Consistent with Badge, universal recognition |
| 3 | Border in default state | Visual definition without heavy background |
| 4 | Solid background when selected | Clear selected state indication |
| 5 | Optional dismiss button | Supports input/removable chip patterns |
| 6 | Three sizes | Compact to touch-friendly range |

---

## Future Enhancements (Separate Specs)

1. **Chip-Filter**: Multi-select filtering with clear-all
2. **Chip-Input**: User-entered values (like tags)
3. **Chip-Choice**: Single-select from group (radio-like)
4. **Chip-Action**: Triggers action (like quick actions)

---

## Next Steps

1. ✅ **Design outline created** - Decisions documented
2. ⏳ **Review with Peter** - Validate decisions
3. ⏳ **Create requirements.md** - EARS format
4. ⏳ **Create design.md** - Detailed architecture
5. ⏳ **Create tasks.md** - Implementation plan

---

**Organization**: spec-guide
**Scope**: 045-chip-base
