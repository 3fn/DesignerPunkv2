# Progress-StepIndicator-Base Component - Design Outline

**Date**: January 19, 2026
**Purpose**: Capture design decisions and token requirements before creating full spec
**Status**: Design Outline (Pre-Requirements)

> ⚠️ **PLACEHOLDER NOTICE**: The visual specifications, token references, and pixel values in this document are preliminary placeholders largely derived from the wrkingClass prototype. They are NOT yet aligned with DesignerPunk's token system and design language. This outline must be reviewed and updated to use proper DesignerPunk tokens before proceeding to requirements.md.

---

## Component Overview

StepIndicator is a progress visualization component that shows the user's position within a multi-step flow (onboarding, checkout, wizard). It displays a series of dots or segments indicating total steps and current progress.

**Key Characteristics**:
- **Progress visualization**: Shows current position in sequence
- **Step count**: Displays total number of steps
- **Completion state**: Distinguishes completed, current, and upcoming steps
- **Compact**: Minimal visual footprint
- **Non-interactive**: Display-only (navigation handled elsewhere)

---

## Architecture

### Component Structure

```
Progress-StepIndicator-Base (Primitive)
├── Provides foundational step indicator behaviors
├── Step count, current step, completed steps
└── Semantic variants inherit from this

Future Semantic Variants:
├── Progress-StepIndicator-Labeled (with step labels)
├── Progress-StepIndicator-Connected (with connecting lines)
└── Progress-StepIndicator-Numbered (with step numbers)
```

**Design Pattern**: Base primitive with semantic variants for specialized behaviors.

---

## Visual Specifications

### Step States

| State | Dot Fill | Dot Border | Description |
|-------|----------|------------|-------------|
| **completed** | `color.interactive.primary` | none | Steps already finished |
| **current** | `color.interactive.primary` | none | Active step (same as completed visually) |
| **upcoming** | `color.surface.tertiary` | none | Steps not yet reached |

### Size Variants

| Size | Dot Size | Gap Between | Total Height |
|------|----------|-------------|--------------|
| **sm** | 6px | `space075` | 6px |
| **md** | 8px | `space100` | 8px |
| **lg** | 10px | `space125` | 10px |

### Layout

- **Orientation**: Horizontal (default), vertical (optional)
- **Alignment**: Center-aligned within container
- **Spacing**: Consistent gap between all dots

---

## Token Requirements

### New Semantic Tokens

```typescript
// StepIndicator-specific semantic tokens
'stepIndicator.dot.completed': {
  primitiveReferences: { value: 'color.interactive.primary' },
  context: 'Completed step indicator',
  description: 'Fill color for completed and current steps'
},

'stepIndicator.dot.upcoming': {
  primitiveReferences: { value: 'color.surface.tertiary' },
  context: 'Upcoming step indicator',
  description: 'Fill color for steps not yet reached'
},

// Size tokens
'stepIndicator.dot.size.sm': { value: 6 },
'stepIndicator.dot.size.md': { value: 8 },
'stepIndicator.dot.size.lg': { value: 10 },

// Gap tokens
'stepIndicator.gap.sm': { primitiveReferences: { value: 'space075' } },
'stepIndicator.gap.md': { primitiveReferences: { value: 'space100' } },
'stepIndicator.gap.lg': { primitiveReferences: { value: 'space125' } }
```

### Existing Tokens Used

**Colors**:
- `color.interactive.primary` (completed/current)
- `color.surface.tertiary` (upcoming)

**Spacing**:
- `space075`, `space100`, `space125` (dot gaps)

**Motion**:
- `motion.duration.fast` (state transitions)

---

## Component API Design

### Props Interface

```typescript
interface StepIndicatorProps {
  /** Total number of steps */
  totalSteps: number;
  
  /** Current step (1-indexed) */
  currentStep: number;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  
  /** Test ID for automated testing */
  testID?: string;
}
```

### Default Values

```typescript
const defaults = {
  size: 'md',
  orientation: 'horizontal',
  accessibilityLabel: 'Step {current} of {total}'
};
```

### Usage Examples

```tsx
// Basic step indicator (4 steps, on step 2)
<StepIndicator totalSteps={4} currentStep={2} />

// Small indicator for compact UI
<StepIndicator totalSteps={5} currentStep={3} size="sm" />

// Vertical orientation
<StepIndicator 
  totalSteps={3} 
  currentStep={1} 
  orientation="vertical" 
/>

// With custom accessibility label
<StepIndicator 
  totalSteps={4} 
  currentStep={2}
  accessibilityLabel="Onboarding progress: step 2 of 4"
/>
```

---

## Platform Considerations

### Web Implementation

```html
<div class="step-indicator" role="progressbar" 
     aria-valuenow="2" aria-valuemin="1" aria-valuemax="4"
     aria-label="Step 2 of 4">
  <span class="step-indicator__dot step-indicator__dot--completed"></span>
  <span class="step-indicator__dot step-indicator__dot--current"></span>
  <span class="step-indicator__dot step-indicator__dot--upcoming"></span>
  <span class="step-indicator__dot step-indicator__dot--upcoming"></span>
</div>
```

```css
.step-indicator {
  display: flex;
  align-items: center;
  gap: var(--step-indicator-gap);
}

.step-indicator__dot {
  width: var(--step-indicator-dot-size);
  height: var(--step-indicator-dot-size);
  border-radius: 50%;
  transition: background-color var(--motion-duration-fast);
}

.step-indicator__dot--completed,
.step-indicator__dot--current {
  background-color: var(--step-indicator-dot-completed);
}

.step-indicator__dot--upcoming {
  background-color: var(--step-indicator-dot-upcoming);
}

/* Vertical orientation */
.step-indicator--vertical {
  flex-direction: column;
}
```

### iOS Implementation

```swift
struct StepIndicator: View {
    let totalSteps: Int
    let currentStep: Int
    let size: StepIndicatorSize
    
    var body: some View {
        HStack(spacing: size.gap) {
            ForEach(1...totalSteps, id: \.self) { step in
                Circle()
                    .fill(step <= currentStep 
                        ? Tokens.stepIndicatorDotCompleted 
                        : Tokens.stepIndicatorDotUpcoming)
                    .frame(width: size.dotSize, height: size.dotSize)
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("Step \(currentStep) of \(totalSteps)")
        .accessibilityValue("\(Int((Double(currentStep) / Double(totalSteps)) * 100)) percent complete")
    }
}

enum StepIndicatorSize {
    case sm, md, lg
    
    var dotSize: CGFloat {
        switch self {
        case .sm: return 6
        case .md: return 8
        case .lg: return 10
        }
    }
    
    var gap: CGFloat {
        switch self {
        case .sm: return Tokens.space075
        case .md: return Tokens.space100
        case .lg: return Tokens.space125
        }
    }
}
```

### Android Implementation

```kotlin
@Composable
fun StepIndicator(
    totalSteps: Int,
    currentStep: Int,
    size: StepIndicatorSize = StepIndicatorSize.Medium
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(size.gap),
        modifier = Modifier.semantics {
            contentDescription = "Step $currentStep of $totalSteps"
        }
    ) {
        repeat(totalSteps) { index ->
            val step = index + 1
            Box(
                modifier = Modifier
                    .size(size.dotSize)
                    .background(
                        color = if (step <= currentStep) 
                            DesignTokens.stepIndicatorDotCompleted 
                        else 
                            DesignTokens.stepIndicatorDotUpcoming,
                        shape = CircleShape
                    )
            )
        }
    }
}

enum class StepIndicatorSize(val dotSize: Dp, val gap: Dp) {
    Small(6.dp, DesignTokens.space075),
    Medium(8.dp, DesignTokens.space100),
    Large(10.dp, DesignTokens.space125)
}
```

**Platform Notes**:
- **Web**: Uses `role="progressbar"` for accessibility
- **iOS**: Uses `accessibilityElement` to combine dots into single announcement
- **Android**: Uses `semantics` block for TalkBack support

---

## Accessibility

### Screen Readers
- Announces current step and total steps
- Optionally announces percentage complete
- Single announcement for entire component (not per-dot)

### Visual Accessibility
- Sufficient color contrast between completed and upcoming states
- Size variants ensure visibility at different scales

### Motion
- Subtle transition when step changes
- Respects reduced motion preferences

---

## Design Decisions Summary

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Dots (not numbers) | Cleaner, more compact visual |
| 2 | Same color for completed + current | Simpler visual hierarchy |
| 3 | Non-interactive | Navigation handled by parent flow |
| 4 | Horizontal default | Most common use case |
| 5 | Three sizes | Covers compact to prominent |
| 6 | No connecting lines | Base variant keeps it simple |

---

## Future Enhancements (Separate Specs)

1. **Progress-StepIndicator-Labeled**: Dots with step labels below
2. **Progress-StepIndicator-Connected**: Dots connected by lines
3. **Progress-StepIndicator-Numbered**: Numbers instead of dots

---

## Next Steps

1. ✅ **Design outline created** - Decisions documented
2. ⏳ **Review with Peter** - Validate decisions
3. ⏳ **Create requirements.md** - EARS format
4. ⏳ **Create design.md** - Detailed architecture
5. ⏳ **Create tasks.md** - Implementation plan

---

**Organization**: spec-guide
**Scope**: 048-progress-stepindicator-base
