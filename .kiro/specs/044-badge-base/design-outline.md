# Badge-Base Component - Design Outline

**Date**: January 19, 2026
**Purpose**: Capture design decisions and token requirements before creating full spec
**Status**: Design Outline (Pre-Requirements)

> ⚠️ **PLACEHOLDER NOTICE**: The visual specifications, token references, and pixel values in this document are preliminary placeholders largely derived from the wrkingClass prototype. They are NOT yet aligned with DesignerPunk's token system and design language. This outline must be reviewed and updated to use proper DesignerPunk tokens before proceeding to requirements.md.

---

## Component Overview

Badge is a small, non-interactive visual indicator used to display status, category, or metadata. Badges communicate information at a glance without requiring user interaction. They are distinct from Chips (which are interactive).

**Key Characteristics**:
- **Non-interactive**: Display-only, no click/tap behavior
- **Compact**: Small footprint, designed for inline or overlay use
- **Semantic colors**: Color conveys meaning (success, warning, error, info)
- **Optional icon**: Can include leading icon for additional context

---

## Architecture

### Component Structure

```
Badge-Base (Primitive)
├── Provides foundational badge behaviors
├── Color variants, sizes, optional icon
└── Semantic variants inherit from this

Future Semantic Variants:
├── Badge-Status (online/offline/busy indicators)
├── Badge-Count (notification counts)
└── Badge-Dot (minimal presence indicator)
```

**Design Pattern**: Base primitive with semantic variants for specialized use cases.

---

## Visual Specifications

### Color Variants

Badges use semantic colors to convey meaning:

| Variant | Background | Text/Icon | Use Case |
|---------|------------|-----------|----------|
| **neutral** | `color.surface.secondary` | `color.content.primary` | Default, informational |
| **info** | `color.feedback.info.subtle` | `color.feedback.info.emphasis` | Informational highlights |
| **success** | `color.feedback.success.subtle` | `color.feedback.success.emphasis` | Positive status |
| **warning** | `color.feedback.warning.subtle` | `color.feedback.warning.emphasis` | Caution, attention needed |
| **error** | `color.feedback.error.subtle` | `color.feedback.error.emphasis` | Negative status, errors |

### Size Variants

| Size | Height | Padding | Font Size | Icon Size | Use Case |
|------|--------|---------|-----------|-----------|----------|
| **sm** | 20px | `space100` | `fontSize.xs` | 12px | Compact UI, inline |
| **md** | 24px | `space150` | `fontSize.sm` | 14px | Default |
| **lg** | 28px | `space200` | `fontSize.md` | 16px | Prominent badges |

### Shape

- **Border Radius**: Fully rounded (pill shape) using `radius.full`
- **Rationale**: Pill shape is universally recognized as a badge/tag pattern

### Typography

- **Font Weight**: `fontWeight.medium` (500)
- **Text Transform**: None (preserve case as provided)
- **Line Height**: 1 (single line only)

---

## Token Requirements

### New Semantic Tokens

```typescript
// Badge-specific semantic tokens
'badge.background.neutral': {
  primitiveReferences: { value: 'color.surface.secondary' },
  context: 'Neutral badge background',
  description: 'Background for neutral/default badges'
},

'badge.text.neutral': {
  primitiveReferences: { value: 'color.content.primary' },
  context: 'Neutral badge text color',
  description: 'Text color for neutral badges'
},

'badge.radius': {
  primitiveReferences: { value: 'radius.full' },
  context: 'Badge corner radius',
  description: 'Fully rounded corners for pill shape'
},

// Size-specific tokens
'badge.height.sm': { value: 20 },
'badge.height.md': { value: 24 },
'badge.height.lg': { value: 28 }
```

### Existing Tokens Used

**Colors** (feedback system):
- `color.feedback.info.subtle` / `color.feedback.info.emphasis`
- `color.feedback.success.subtle` / `color.feedback.success.emphasis`
- `color.feedback.warning.subtle` / `color.feedback.warning.emphasis`
- `color.feedback.error.subtle` / `color.feedback.error.emphasis`

**Typography**:
- `fontSize.xs`, `fontSize.sm`, `fontSize.md`
- `fontWeight.medium`

**Spacing**:
- `space100`, `space150`, `space200` (horizontal padding)

**Radius**:
- `radius.full` (pill shape)

---

## Component API Design

### Props Interface

```typescript
interface BadgeProps {
  /** Badge text content */
  label: string;
  
  /** Color variant */
  variant?: 'neutral' | 'info' | 'success' | 'warning' | 'error';
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Optional leading icon */
  icon?: IconName;
  
  /** Test ID for automated testing */
  testID?: string;
}
```

### Default Values

```typescript
const defaults = {
  variant: 'neutral',
  size: 'md',
  icon: undefined
};
```

### Usage Examples

```tsx
// Default neutral badge
<Badge label="Draft" />

// Success badge with icon
<Badge label="Approved" variant="success" icon="check" />

// Error badge
<Badge label="Failed" variant="error" />

// Small info badge
<Badge label="New" variant="info" size="sm" />

// Warning badge
<Badge label="Pending Review" variant="warning" />
```

---

## Platform Considerations

### Web Implementation

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space050);
  padding: 0 var(--badge-padding);
  height: var(--badge-height);
  border-radius: var(--badge-radius);
  font-size: var(--badge-font-size);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.badge--variant-success {
  background-color: var(--color-feedback-success-subtle);
  color: var(--color-feedback-success-emphasis);
}
```

### iOS Implementation

```swift
struct Badge: View {
    let label: String
    let variant: BadgeVariant
    let size: BadgeSize
    let icon: String?
    
    var body: some View {
        HStack(spacing: Tokens.space050) {
            if let icon = icon {
                Image(systemName: icon)
                    .font(.system(size: size.iconSize))
            }
            Text(label)
                .font(.system(size: size.fontSize, weight: .medium))
        }
        .padding(.horizontal, size.padding)
        .frame(height: size.height)
        .background(variant.backgroundColor)
        .foregroundColor(variant.textColor)
        .clipShape(Capsule())
    }
}
```

### Android Implementation

```kotlin
@Composable
fun Badge(
    label: String,
    variant: BadgeVariant = BadgeVariant.Neutral,
    size: BadgeSize = BadgeSize.Medium,
    icon: ImageVector? = null
) {
    Row(
        modifier = Modifier
            .height(size.height)
            .background(variant.backgroundColor, RoundedCornerShape(50))
            .padding(horizontal = size.padding),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(DesignTokens.space050)
    ) {
        icon?.let {
            Icon(it, contentDescription = null, modifier = Modifier.size(size.iconSize))
        }
        Text(label, fontSize = size.fontSize, fontWeight = FontWeight.Medium)
    }
}
```

**Platform Notes**:
- **Web**: Uses `inline-flex` for proper alignment
- **iOS**: Uses `Capsule()` shape for pill effect
- **Android**: Uses `RoundedCornerShape(50)` for pill effect

---

## Accessibility

### Screen Readers
- Badge text is read as-is
- Icon is decorative (`aria-hidden="true"` / `contentDescription = null`)
- Consider adding `role="status"` for dynamic badges

### Color Contrast
- All variant combinations must meet WCAG AA (4.5:1 for text)
- Subtle backgrounds with emphasis text ensures contrast

### Non-Interactive
- No focus states needed (display-only)
- Not in tab order

---

## Design Decisions Summary

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Non-interactive | Badges display info; Chips handle interaction |
| 2 | Pill shape (radius.full) | Universal badge recognition |
| 3 | Semantic color variants | Color conveys meaning consistently |
| 4 | Subtle background + emphasis text | Ensures contrast, softer visual |
| 5 | Optional icon (leading only) | Additional context without complexity |
| 6 | Three sizes | Covers compact to prominent use cases |

---

## Future Enhancements (Separate Specs)

1. **Badge-Status**: Online/offline/busy dot indicators
2. **Badge-Count**: Notification count badges (with max display)
3. **Badge-Dot**: Minimal presence indicator (no text)
4. **Badge-Removable**: Badge with dismiss action (may overlap with Chip)

---

## Next Steps

1. ✅ **Design outline created** - Decisions documented
2. ⏳ **Review with Peter** - Validate decisions
3. ⏳ **Create requirements.md** - EARS format
4. ⏳ **Create design.md** - Detailed architecture
5. ⏳ **Create tasks.md** - Implementation plan

---

**Organization**: spec-guide
**Scope**: 044-badge-base
