# Chip Component Family - Design Outline

**Date**: January 19, 2026
**Updated**: February 3, 2026
**Purpose**: Capture design decisions and token requirements before creating full spec
**Status**: Design Outline (Reviewed)

---

## Component Overview

Chip is a compact, interactive element used for filtering, selection, or input. Unlike Badges (which are display-only), Chips respond to user interaction. They can be toggled (Filter) or dismissed (Input).

**Key Characteristics**:
- **Interactive**: Responds to tap/click
- **Toggleable**: Filter chips represent selected/unselected state
- **Dismissible**: Input chips can be removed
- **Compact**: Small footprint for dense UI patterns

---

## Architecture

### Component Structure (Stemma System)

```
Chip-Base (Primitive)
├── All visual tokens (size, typography, colors, states)
├── Core behavior (press, disabled)
├── Optional leading icon (via Icon-Base)
└── Usable directly for general chip needs

Chip-Filter (Semantic - extends Chip-Base)
├── Inherits ALL from Base
├── Adds: selected state, toggle behavior
├── Adds: checkmark icon when selected
└── No new tokens needed

Chip-Input (Semantic - extends Chip-Base)
├── Inherits ALL from Base
├── Adds: X icon (always visible, trailing)
├── Adds: dismiss behavior (tap anywhere = dismiss)
└── No new tokens needed
```

**Design Pattern**: Follows Input-Text-Base → Input-Text-Email/Password/PhoneNumber pattern. Chip-Base is usable directly for general/one-off chip needs; semantic variants (Chip-Filter, Chip-Input) provide specialized behaviors for common patterns.

**Out of Scope**: Chip-Set (container with group behaviors, wrapping, clear-all) — separate spec.

---

## Visual Specifications

### Single Size

| Property | Token | Value | Notes |
|----------|-------|-------|-------|
| Tap Area | `tapAreaRecommended` | 48px | Accessibility touch target |
| Block Padding | Component token → `space075` | 6px | Block-start/block-end inset |
| Inline Padding | `space.inset.150` | 12px | Inline-start/inline-end padding |
| Icon Gap | `space.grouped.tight` | 4px | Between icon and label |
| Border Width | `borderDefault` | 1px | All states |
| Border Radius | `radius.full` | pill | Fully rounded |

**Height Math**: 6px (block-start) + 20px (content: 14px × 1.429 line-height) + 6px (block-end) = 32px

### Typography

| Property | Token | Value |
|----------|-------|-------|
| Font | `typography.buttonSm` | 14px, medium (500), 1.429 line-height |

### States

| State | Background | Border | Text | Use Case |
|-------|------------|--------|------|----------|
| **default** | `color.surface.secondary` | `color.border.default` | `color.content.primary` | Unselected chip |
| **selected** | `color.interactive.primary` | `color.interactive.primary` | `color.content.onPrimary` | Active/selected (Filter only) |
| **hover** | `color.surface.tertiary` | `color.border.emphasis` | `color.content.primary` | Mouse hover |
| **pressed** | `color.surface.tertiary` | `color.border.emphasis` | `color.content.primary` | Active press |
| **disabled** | `color.surface.disabled` | `color.border.disabled` | `color.content.disabled` | Non-interactive |

### Icons

| Icon | Component | Size | When Visible |
|------|-----------|------|--------------|
| Leading (optional) | Icon-Base | `icon.size075` (20px) | Any chip with icon prop |
| Checkmark | Icon-Base | `icon.size075` (20px) | Chip-Filter when selected (replaces leading icon) |
| X (dismiss) | Icon-Base | `icon.size075` (20px) | Chip-Input always (trailing) |

**Prerequisite**: Icon-Base TypeScript types need alignment. Currently `IconBaseSize` includes `18` but should be `20` to match `icon.size075` token (14px × 1.429 = 20px). See "Prerequisites" section.

---

## Token Requirements

### Component Tokens (New)

```typescript
// Chip-Base component tokens
'chip.paddingBlock': {
  reference: spacingTokens.space075,
  reasoning: 'Block-start/block-end padding for chip content. 6px padding achieves 32px total height with buttonSm typography (20px line-height). No semantic inset token exists for 6px.'
}
```

### Existing Tokens Used

**Typography**:
- `typography.buttonSm` (14px, medium weight, 1.429 line-height)

**Colors**:
- `color.surface.secondary`, `color.surface.tertiary`, `color.surface.disabled`
- `color.interactive.primary`
- `color.content.primary`, `color.content.onPrimary`, `color.content.disabled`
- `color.border.default`, `color.border.emphasis`, `color.border.disabled`

**Spacing (Semantic)**:
- `space.inset.150` (12px) — inline padding
- `space.grouped.tight` (4px) — icon gap

**Spacing (Primitive via Component Token)**:
- `space075` (6px) — block padding (no semantic equivalent)

**Border**:
- `borderDefault` (1px)
- `radius.full` (pill shape)

**Accessibility**:
- `tapAreaRecommended` (48px)

**Motion**:
- `motion.duration.fast` (state transitions)

---

## Component API Design

### Chip-Base Props

```typescript
interface ChipBaseProps {
  /** Chip text content */
  label: string;
  
  /** Optional leading icon */
  icon?: IconName;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Called when chip is pressed */
  onPress?: () => void;
  
  /** Test ID for automated testing */
  testID?: string;
}
```

### Chip-Filter Props (extends Chip-Base)

```typescript
interface ChipFilterProps extends ChipBaseProps {
  /** Whether chip is selected */
  selected?: boolean;
  
  /** Called when selection changes */
  onSelectionChange?: (selected: boolean) => void;
}
```

### Chip-Input Props (extends Chip-Base)

```typescript
interface ChipInputProps extends Omit<ChipBaseProps, 'onPress'> {
  /** Called when chip is dismissed (tap anywhere) */
  onDismiss?: () => void;
}
```

### Usage Examples

```tsx
// Basic chip (general use)
<ChipBase 
  label="Category" 
  onPress={() => handleCategoryPress()}
/>

// Basic chip with icon
<ChipBase 
  label="Settings" 
  icon="settings"
  onPress={() => openSettings()}
/>

// Filter chip (toggleable)
<ChipFilter 
  label="House" 
  selected={filters.includes('house')}
  onSelectionChange={(selected) => toggleFilter('house', selected)}
/>

// Filter chip with icon
<ChipFilter 
  label="High Impact" 
  icon="alert-circle"
  selected={showHighImpact}
  onSelectionChange={setShowHighImpact}
/>

// Input chip (dismissible)
<ChipInput 
  label="JavaScript" 
  onDismiss={() => removeSkill('javascript')}
/>

// Disabled chip
<ChipBase label="Unavailable" disabled />
```

---

## Platform Considerations

### Logical Properties

All implementations use logical properties for internationalization:

| Physical | Logical |
|----------|---------|
| padding-top/bottom | padding-block |
| padding-left/right | padding-inline |
| margin-left/right | margin-inline |

### Web Implementation

```css
.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-grouped-tight);
  padding-block: var(--chip-padding-block);
  padding-inline: var(--space-inset-150);
  block-size: var(--space400);
  border: var(--border-default) solid var(--chip-border-color);
  border-radius: var(--radius-full);
  background-color: var(--chip-background);
  color: var(--chip-text);
  cursor: pointer;
  transition: all var(--motion-duration-fast);
}

/* Expanded tap area */
.chip::before {
  content: '';
  position: absolute;
  inset: calc((var(--tap-area-recommended) - var(--space400)) / -2);
}
```

### iOS Implementation

```swift
struct ChipBase: View {
    let label: String
    let icon: String?
    let disabled: Bool
    let onPress: () -> Void
    
    var body: some View {
        Button(action: onPress) {
            HStack(spacing: Tokens.space050) {
                if let icon = icon {
                    Icon(name: icon, size: .buttonSm)
                }
                Text(label)
                    .font(Tokens.typographyButtonSm)
            }
            .padding(.horizontal, Tokens.space150)
            .padding(.vertical, Tokens.chipPaddingBlock)
            .background(Tokens.colorSurfaceSecondary)
            .foregroundColor(Tokens.colorContentPrimary)
            .overlay(
                Capsule()
                    .stroke(Tokens.colorBorderDefault, lineWidth: Tokens.borderDefault)
            )
            .clipShape(Capsule())
        }
        .disabled(disabled)
        .frame(minHeight: Tokens.tapAreaRecommended)
    }
}
```

### Android Implementation

```kotlin
@Composable
fun ChipBase(
    label: String,
    icon: String? = null,
    disabled: Boolean = false,
    onClick: () -> Unit
) {
    Surface(
        onClick = onClick,
        enabled = !disabled,
        shape = RoundedCornerShape(50),
        color = DesignTokens.colorSurfaceSecondary,
        border = BorderStroke(
            DesignTokens.borderDefault.dp,
            DesignTokens.colorBorderDefault
        ),
        modifier = Modifier.sizeIn(minHeight = DesignTokens.tapAreaRecommended.dp)
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(DesignTokens.space050.dp),
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .height(DesignTokens.space400.dp)
                .padding(
                    horizontal = DesignTokens.space150.dp,
                    vertical = DesignTokens.chipPaddingBlock.dp
                )
        ) {
            icon?.let { Icon(name = it, size = IconSize.ButtonSm) }
            Text(
                text = label,
                style = DesignTokens.typographyButtonSm,
                color = DesignTokens.colorContentPrimary
            )
        }
    }
}
```

---

## Accessibility

### Screen Readers
- Announce label and role
- Chip-Filter: Announce selected state (`aria-pressed="true/false"`)
- Chip-Input: Announce as removable, X icon has label "Remove [label]"

### Keyboard Navigation
- Focusable via Tab
- Space/Enter to activate (toggle for Filter, dismiss for Input)

### Touch Targets
- 48px minimum tap area (exceeds 44px WCAG requirement)
- Visual chip is 32px, tap area extends beyond

---

## Design Decisions Summary

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Single size (32px visual, 48px tap) | Simplicity over flexibility; one size works everywhere |
| 2 | `typography.buttonSm` | Semantic match — chips are interactive like buttons |
| 3 | Stemma inheritance pattern | Consistency with Input-Text-Base → variants pattern |
| 4 | X = dismiss whole chip | Simplifies hit area; no separate X button target |
| 5 | Logical properties | Internationalization support (RTL languages) |
| 6 | Component token for block padding | `space075` (6px) achieves correct height math |
| 7 | `borderDefault` on all states | Consistent visual definition |

---

## Out of Scope (Future Specs)

1. **Chip-Set**: Container with horizontal wrapping, group selection, clear-all
2. **Chip-Choice**: Single-select from group (radio-like behavior)
3. **Chip-Action**: Triggers action (like quick actions)

---

## Prerequisites

### Icon-Base TypeScript Type Alignment

**Issue**: `IconBaseSize` type includes `18` but should be `20` to match the actual `icon.size075` token value.

**Background**: 
- `icon.size075` = fontSize075 (14px) × lineHeight075 (1.429) = **20px**
- The CSS tokens are correct (`--icon-size-075: 20px`)
- The TypeScript type is outdated (`IconBaseSize = 13 | 18 | 24 | ...`)
- The component maps `18 → 20` internally, but the API is misleading

**Required Changes**:
1. `src/components/core/Icon-Base/types.ts`:
   - Update `IconBaseSize` type: `18` → `20`
   - Update `iconBaseSizes.size075`: `18` → `20`
2. `src/components/core/Icon-Base/platforms/web/IconBase.web.ts`:
   - Update `sizePixelMap` key: `18: 20` → `20: 20`
   - Update `sizeClassMap` key: `18:` → `20:`
   - Update `validSizes` array: `18` → `20`
3. Update any components using `size={18}` to `size={20}`:
   - Button-Icon
   - Avatar
   - Badge-Label-Base
   - Any tests referencing size 18

**Scope**: This is a type alignment fix within the chip spec, not a separate spec.

---

## Next Steps

1. ✅ **Design outline created** - Decisions documented
2. ✅ **Review with Peter** - Decisions validated
3. ⏳ **Create requirements.md** - EARS format
4. ⏳ **Create design.md** - Detailed architecture
5. ⏳ **Create tasks.md** - Implementation plan

---

**Organization**: spec-guide
**Scope**: 045-chip-base
