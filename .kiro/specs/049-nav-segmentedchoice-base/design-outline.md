# Nav-SegmentedChoice-Base Component - Design Outline

**Date**: January 19, 2026
**Purpose**: Capture design decisions and token requirements before creating full spec
**Status**: Design Outline (Pre-Requirements)

> ⚠️ **PLACEHOLDER NOTICE**: The visual specifications, token references, and pixel values in this document are preliminary placeholders largely derived from the wrkingClass prototype. They are NOT yet aligned with DesignerPunk's token system and design language. This outline must be reviewed and updated to use proper DesignerPunk tokens before proceeding to requirements.md.

---

## Component Overview

SegmentedChoice is a navigation control that allows users to switch between different content surfaces within a single page. It presents mutually exclusive options as connected segments, with the selected segment visually distinguished.

**Key Characteristics**:
- **Navigation**: Switches between content surfaces (not form input)
- **Mutual exclusivity**: Only one segment active at a time
- **Connected segments**: Options appear as unified control
- **Immediate feedback**: Selection change is instant
- **Platform-agnostic**: Unified API across web/iOS/Android

**Platform Equivalents**:
- iOS: `UISegmentedControl`
- Android: `MaterialButtonToggleGroup`
- Web: Custom segmented control

---

## Architecture

### Component Structure

```
Nav-SegmentedChoice-Base (Primitive)
├── Provides foundational segmented navigation
├── Segment options, selected state, disabled
└── Semantic variants inherit from this

Future Semantic Variants:
├── Nav-SegmentedChoice-Icon (icon-only segments)
├── Nav-SegmentedChoice-Badge (segments with badges)
└── Nav-SegmentedChoice-Scrollable (many segments)
```

**Design Pattern**: Base primitive with semantic variants for specialized behaviors.

---

## Visual Specifications

### Container

| Property | Value |
|----------|-------|
| Background | `color.surface.secondary` |
| Border Radius | `radius.medium` |
| Padding | `space050` (internal padding around segments) |
| Height | Auto (based on segment size) |

### Segment States

| State | Background | Text Color | Description |
|-------|------------|------------|-------------|
| **unselected** | transparent | `color.content.secondary` | Default state |
| **selected** | `color.surface.primary` | `color.content.primary` | Active segment |
| **hover** | `color.surface.tertiary` | `color.content.secondary` | Mouse hover (web) |
| **focus** | focus ring | `color.content.secondary` | Keyboard focus |
| **disabled** | transparent | `color.content.disabled` | Unavailable |

### Size Variants

| Size | Segment Height | Segment Padding | Font Size | Min Width |
|------|----------------|-----------------|-----------|-----------|
| **sm** | 28px | `space100` horizontal | `fontSize.sm` | 48px |
| **md** | 36px | `space150` horizontal | `fontSize.md` | 64px |
| **lg** | 44px | `space200` horizontal | `fontSize.lg` | 80px |

### Selection Indicator

- **Style**: Background fill (not underline)
- **Animation**: Slide transition between segments
- **Shadow**: Subtle elevation on selected segment (`shadow.sm`)
- **Border Radius**: `radius.small` (slightly smaller than container)

---

## Token Requirements

### New Semantic Tokens

```typescript
// SegmentedChoice-specific semantic tokens
'segmentedChoice.container.background': {
  primitiveReferences: { value: 'color.surface.secondary' },
  context: 'Container background',
  description: 'Background color of the segmented control container'
},

'segmentedChoice.segment.background.selected': {
  primitiveReferences: { value: 'color.surface.primary' },
  context: 'Selected segment background',
  description: 'Background color of the selected segment'
},

'segmentedChoice.segment.text.selected': {
  primitiveReferences: { value: 'color.content.primary' },
  context: 'Selected segment text',
  description: 'Text color of the selected segment'
},

'segmentedChoice.segment.text.unselected': {
  primitiveReferences: { value: 'color.content.secondary' },
  context: 'Unselected segment text',
  description: 'Text color of unselected segments'
},

// Size tokens
'segmentedChoice.height.sm': { value: 28 },
'segmentedChoice.height.md': { value: 36 },
'segmentedChoice.height.lg': { value: 44 }
```

### Existing Tokens Used

**Colors**:
- `color.surface.primary`, `color.surface.secondary`, `color.surface.tertiary`
- `color.content.primary`, `color.content.secondary`, `color.content.disabled`
- `color.focus.ring`

**Typography**:
- `fontSize.sm`, `fontSize.md`, `fontSize.lg`
- `fontWeight.medium`

**Spacing**:
- `space050` (container padding)
- `space100`, `space150`, `space200` (segment padding)

**Border**:
- `radius.medium` (container)
- `radius.small` (segments)

**Shadow**:
- `shadow.sm` (selected segment elevation)

**Motion**:
- `motion.duration.fast` (selection transition)

---

## Component API Design

### Props Interface

```typescript
interface SegmentedChoiceProps {
  /** Array of segment options */
  segments: SegmentOption[];
  
  /** Currently selected segment value */
  selectedValue: string;
  
  /** Called when selection changes */
  onSelectionChange: (value: string) => void;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Whether entire control is disabled */
  disabled?: boolean;
  
  /** Test ID for automated testing */
  testID?: string;
}

interface SegmentOption {
  /** Unique value for this segment */
  value: string;
  
  /** Display label */
  label: string;
  
  /** Whether this segment is disabled */
  disabled?: boolean;
}
```

### Default Values

```typescript
const defaults = {
  size: 'md',
  disabled: false
};
```

### Usage Examples

```tsx
// Basic segmented choice (donation frequency)
<SegmentedChoice
  segments={[
    { value: 'monthly', label: 'Monthly' },
    { value: 'one-time', label: 'One-time' }
  ]}
  selectedValue={frequency}
  onSelectionChange={setFrequency}
/>

// Three segments
<SegmentedChoice
  segments={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' }
  ]}
  selectedValue={view}
  onSelectionChange={setView}
/>

// With disabled segment
<SegmentedChoice
  segments={[
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise', disabled: true }
  ]}
  selectedValue={plan}
  onSelectionChange={setPlan}
/>

// Small size for compact UI
<SegmentedChoice
  segments={[
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' }
  ]}
  selectedValue={viewMode}
  onSelectionChange={setViewMode}
  size="sm"
/>
```

---

## Platform Considerations

### Web Implementation

```html
<div class="segmented-choice" role="tablist">
  <button 
    class="segmented-choice__segment segmented-choice__segment--selected"
    role="tab"
    aria-selected="true"
  >
    Monthly
  </button>
  <button 
    class="segmented-choice__segment"
    role="tab"
    aria-selected="false"
  >
    One-time
  </button>
</div>
```

```css
.segmented-choice {
  display: inline-flex;
  background-color: var(--segmented-choice-container-background);
  border-radius: var(--radius-medium);
  padding: var(--space-050);
}

.segmented-choice__segment {
  padding: 0 var(--space-150);
  height: var(--segmented-choice-height);
  border: none;
  background: transparent;
  color: var(--segmented-choice-segment-text-unselected);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-small);
  cursor: pointer;
  transition: all var(--motion-duration-fast);
}

.segmented-choice__segment--selected {
  background-color: var(--segmented-choice-segment-background-selected);
  color: var(--segmented-choice-segment-text-selected);
  box-shadow: var(--shadow-sm);
}

.segmented-choice__segment:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
```

### iOS Implementation

```swift
struct SegmentedChoice: View {
    let segments: [SegmentOption]
    @Binding var selectedValue: String
    let size: SegmentedChoiceSize
    
    var body: some View {
        HStack(spacing: 0) {
            ForEach(segments, id: \.value) { segment in
                Button(action: { selectedValue = segment.value }) {
                    Text(segment.label)
                        .font(.system(size: size.fontSize, weight: .medium))
                        .foregroundColor(selectedValue == segment.value 
                            ? Tokens.segmentedChoiceSegmentTextSelected 
                            : Tokens.segmentedChoiceSegmentTextUnselected)
                        .frame(minWidth: size.minWidth, minHeight: size.height)
                        .padding(.horizontal, size.horizontalPadding)
                        .background(
                            selectedValue == segment.value 
                                ? Tokens.segmentedChoiceSegmentBackgroundSelected 
                                : Color.clear
                        )
                        .cornerRadius(Tokens.radiusSmall)
                        .shadow(radius: selectedValue == segment.value ? 1 : 0)
                }
                .disabled(segment.disabled)
            }
        }
        .padding(Tokens.space050)
        .background(Tokens.segmentedChoiceContainerBackground)
        .cornerRadius(Tokens.radiusMedium)
    }
}
```

### Android Implementation

```kotlin
@Composable
fun SegmentedChoice(
    segments: List<SegmentOption>,
    selectedValue: String,
    onSelectionChange: (String) -> Unit,
    size: SegmentedChoiceSize = SegmentedChoiceSize.Medium
) {
    Row(
        modifier = Modifier
            .background(
                DesignTokens.segmentedChoiceContainerBackground,
                RoundedCornerShape(DesignTokens.radiusMedium)
            )
            .padding(DesignTokens.space050)
    ) {
        segments.forEach { segment ->
            val isSelected = segment.value == selectedValue
            
            Box(
                modifier = Modifier
                    .height(size.height)
                    .defaultMinSize(minWidth = size.minWidth)
                    .clip(RoundedCornerShape(DesignTokens.radiusSmall))
                    .background(
                        if (isSelected) DesignTokens.segmentedChoiceSegmentBackgroundSelected
                        else Color.Transparent
                    )
                    .clickable(enabled = !segment.disabled) { 
                        onSelectionChange(segment.value) 
                    }
                    .padding(horizontal = size.horizontalPadding),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = segment.label,
                    color = if (isSelected) 
                        DesignTokens.segmentedChoiceSegmentTextSelected
                    else 
                        DesignTokens.segmentedChoiceSegmentTextUnselected,
                    fontWeight = FontWeight.Medium,
                    fontSize = size.fontSize
                )
            }
        }
    }
}
```

**Platform Notes**:
- **Web**: Uses `role="tablist"` and `role="tab"` for accessibility
- **iOS**: Custom implementation (native `Picker` with `.segmented` style has limited customization)
- **Android**: Custom implementation (Material `ToggleButtonGroup` has specific styling)

---

## Accessibility

### Screen Readers
- Container announced as tab list
- Each segment announced as tab with selected state
- Selection change announced

### Keyboard Navigation
- Tab to focus the control
- Arrow keys to navigate between segments
- Enter/Space to select focused segment
- Focus ring visible on keyboard focus

### Touch Targets
- Minimum 44px touch target height (lg size)
- Adequate horizontal padding for touch accuracy

---

## Design Decisions Summary

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Background fill (not underline) | Clearer selection indicator |
| 2 | Slide animation | Smooth, polished feel |
| 3 | Platform-agnostic name | "SegmentedChoice" works across platforms |
| 4 | Navigation family | Switches content surfaces, not form input |
| 5 | Three sizes | Covers compact to touch-friendly |
| 6 | Subtle shadow on selected | Adds depth without being heavy |

---

## Future Enhancements (Separate Specs)

1. **Nav-SegmentedChoice-Icon**: Icon-only segments for compact UI
2. **Nav-SegmentedChoice-Badge**: Segments with notification badges
3. **Nav-SegmentedChoice-Scrollable**: Horizontal scroll for many segments

---

## Next Steps

1. ✅ **Design outline created** - Decisions documented
2. ⏳ **Review with Peter** - Validate decisions
3. ⏳ **Create requirements.md** - EARS format
4. ⏳ **Create design.md** - Detailed architecture
5. ⏳ **Create tasks.md** - Implementation plan

---

**Organization**: spec-guide
**Scope**: 049-nav-segmentedchoice-base
