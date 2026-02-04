# Design Document: Chip Component Family

**Date**: February 3, 2026
**Spec**: 045 - Chip Component Family
**Status**: Design Phase
**Dependencies**: 
- Icon-Base component (requires type alignment fix)
- Rosetta token pipeline
- Stemma System schema infrastructure

---

## Overview

The Chip component family provides compact, interactive elements for filtering, selection, and input management. The architecture follows the Stemma System inheritance pattern with a base primitive (Chip-Base) and two semantic variants (Chip-Filter, Chip-Input).

**Key Design Principles:**
- Single size for simplicity (32px visual, 48px tap area)
- Token-first styling with one component token (`chip.paddingBlock`)
- Stemma inheritance for behavioral specialization
- Cross-platform consistency via logical properties

**DesignerPunk Philosophy: NO DISABLED STATES**
This component family does not support disabled states. If an action is unavailable, the component should not be rendered. This ensures users always see actionable UI elements.

---

## Architecture

### Component Hierarchy (Stemma System)

```
┌─────────────────────────────────────────────────────────────┐
│                      Chip-Base (Primitive)                   │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Visual Tokens: typography, colors, spacing, border      ││
│  │ Core Behavior: press                                    ││
│  │ Optional: leading icon (Icon-Base)                      ││
│  │ Usable directly for general chip needs                  ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│  Chip-Filter (Semantic)  │     │  Chip-Input (Semantic)   │
│  ───────────────────────│     │  ───────────────────────│
│  + selected state        │     │  + X icon (trailing)     │
│  + toggle behavior       │     │  + dismiss behavior      │
│  + checkmark when        │     │  + tap anywhere =        │
│    selected              │     │    dismiss               │
│  No new tokens needed    │     │  No new tokens needed    │
└─────────────────────────┘     └─────────────────────────┘
```

**Design Pattern**: Follows Input-Text-Base → Input-Text-Email/Password pattern. Chip-Base is usable directly; semantic variants add specialized behaviors.

### File Structure

```
src/components/core/
├── Chip-Base/
│   ├── Chip-Base.schema.yaml
│   ├── types.ts
│   ├── index.ts
│   └── platforms/
│       ├── web/
│       │   ├── ChipBase.web.ts
│       │   ├── ChipBase.styles.css
│       │   └── ChipBase.test.ts
│       ├── ios/
│       │   └── ChipBase.swift
│       └── android/
│           └── ChipBase.kt
├── Chip-Filter/
│   ├── Chip-Filter.schema.yaml
│   ├── types.ts
│   ├── index.ts
│   └── platforms/
│       └── [same structure]
└── Chip-Input/
    ├── Chip-Input.schema.yaml
    ├── types.ts
    ├── index.ts
    └── platforms/
        └── [same structure]
```

---

## Components and Interfaces

### Chip-Base Interface

```typescript
/** Icon name from the icon library */
type IconName = string;

interface ChipBaseProps {
  /** Chip text content (required) */
  label: string;
  
  /** Optional leading icon */
  icon?: IconName;
  
  /** Called when chip is pressed */
  onPress?: () => void;
  
  /** Test ID for automated testing */
  testID?: string;
}

// Note: DesignerPunk does not support disabled states.
// If an action is unavailable, the component should not be rendered.
```

### Chip-Filter Interface

```typescript
interface ChipFilterProps extends ChipBaseProps {
  /** Whether chip is in selected state */
  selected?: boolean;
  
  /** Called when selection state changes */
  onSelectionChange?: (selected: boolean) => void;
}
```

### Chip-Input Interface

```typescript
interface ChipInputProps extends Omit<ChipBaseProps, 'onPress'> {
  /** Called when chip is dismissed (tap anywhere) */
  onDismiss?: () => void;
}
```

### Web Component Interface

```typescript
class ChipBaseElement extends HTMLElement {
  static observedAttributes = ['label', 'icon', 'test-id'];
  
  // Properties mirror attributes
  label: string;
  icon?: string;
  testID?: string;
  
  // Event callbacks
  onPress?: () => void;
  
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
```

---

## Data Models

### Token Dependencies

```typescript
// Component token (new)
const chipTokens = {
  'chip.paddingBlock': {
    reference: 'space075',  // 6px
    reasoning: 'Block padding achieving 32px height with buttonSm typography'
  }
};

// Semantic tokens used
const semanticTokens = {
  typography: 'typography.buttonSm',           // 14px, medium, 1.429 line-height
  inlinePadding: 'space.inset.150',            // 12px
  iconGap: 'space.grouped.tight',              // 4px
  tapArea: 'tapAreaRecommended',               // 48px
  borderWidth: 'borderDefault',                // 1px
  borderRadius: 'radius.full',                 // pill
  transition: 'motion.duration.fast'           // state transitions
};

// Color tokens by state
const colorTokens = {
  default: {
    background: 'color.structure.surface',
    border: 'color.structure.border',
    text: 'color.text.default'
  },
  hover: {
    background: 'blend.hoverDarker applied to color.structure.surface',
    border: 'color.action.primary',
    text: 'color.text.default'
  },
  pressed: {
    background: 'blend.pressedDarker applied to color.structure.surface',
    border: 'color.action.primary',
    text: 'color.text.default'
  },
  selected: {
    background: 'color.feedback.select.background.rest',
    border: 'color.feedback.select.border.rest',
    text: 'color.feedback.select.text.rest'
  }
};

// Note: Hover and pressed states use blend tokens for theme-aware color calculations.
// This ensures consistent state styling across light/dark themes.
// DesignerPunk does not support disabled states - components should not render if unavailable.
```



### Stemma Schema Structure

```yaml
# Chip-Base.schema.yaml
name: Chip-Base
type: primitive
family: Chip
version: 1.0.0

props:
  label:
    type: string
    required: true
    description: Chip text content
  icon:
    type: IconName
    required: false
    description: Optional leading icon
  onPress:
    type: function
    required: false
    description: Press callback
  testID:
    type: string
    required: false
    description: Test ID for automated testing

tokens:
  required:
    - chip.paddingBlock
    - space.inset.150
    - space.grouped.tight
    - typography.buttonSm
    - tapAreaRecommended
    - borderDefault
    - radius.full
    - motion.duration.fast
  colors:
    - color.structure.surface
    - color.structure.border
    - color.text.default
    - color.action.primary
    - color.feedback.select.background.rest
    - color.feedback.select.border.rest
    - color.feedback.select.text.rest
  blends:
    - blend.hoverDarker
    - blend.pressedDarker

behaviors:
  press:
    trigger: tap/click
    action: call onPress callback

# Note: DesignerPunk does not support disabled states.
# If an action is unavailable, the component should not be rendered.

accessibility:
  role: button
  focusable: true
  keyboard: Space/Enter activates

platforms:
  web:
    element: chip-base
    shadowDOM: true
  ios:
    view: ChipBase
    framework: SwiftUI
  android:
    composable: ChipBase
    framework: Jetpack Compose
```

---

## Error Handling

### Invalid Props

| Scenario | Behavior | Rationale |
|----------|----------|-----------|
| Empty `label` | Render empty chip | Allow dynamic content |
| Invalid `icon` name | Render without icon | Graceful degradation |
| Missing `onPress` | Chip is non-interactive | Valid use case (display-only) |

**Note**: DesignerPunk does not support disabled states. If an action is unavailable, the component should not be rendered.

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| Very long label | Text truncates with ellipsis |
| RTL language | Logical properties handle layout |
| Rapid press events | Debounce not required (single action) |
| Icon load failure | Render label only |

### Chip-Filter Specific

| Scenario | Behavior |
|----------|----------|
| `selected` without `onSelectionChange` | Visual state only (controlled) |

**Note**: DesignerPunk does not support disabled states. If filtering is unavailable, the chip should not be rendered.

### Chip-Input Specific

| Scenario | Behavior |
|----------|----------|
| Missing `onDismiss` | X icon visible but non-functional |

**Note**: DesignerPunk does not support disabled states. If dismissal is unavailable, the chip should not be rendered.

---

## Testing Strategy

### Test Categories (per Test Development Standards)

**Evergreen Tests** — Permanent behavior verification:

| Component | Test Focus | Example Assertions |
|-----------|------------|-------------------|
| Chip-Base | API contract | `label` renders, `icon` appears, press callback works |
| Chip-Base | Accessibility | Focusable, keyboard activation, ARIA attributes |
| Chip-Filter | Toggle behavior | `selected` state changes, `onSelectionChange` called |
| Chip-Filter | Visual states | Checkmark appears when selected |
| Chip-Input | Dismiss behavior | `onDismiss` called on press |
| Chip-Input | Icon presence | X icon always visible |

**What NOT to Test** (per Testing Philosophy):

- ❌ Specific CSS property values (implementation detail)
- ❌ Token source verification (philosophical preference)
- ❌ Internal DOM structure (implementation detail)
- ❌ Specific attribute names (may change)

### Web Component Test Pattern

```typescript
describe('ChipBase Web Component', () => {
  beforeAll(() => {
    if (!customElements.get('chip-base')) {
      customElements.define('chip-base', ChipBaseElement);
    }
  });

  beforeEach(async () => {
    await customElements.whenDefined('chip-base');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render label text', async () => {
    const element = document.createElement('chip-base') as ChipBaseElement;
    element.setAttribute('label', 'Category');
    document.body.appendChild(element);
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const label = element.shadowRoot?.querySelector('.chip__label');
    expect(label?.textContent).toBe('Category');
  });

  it('should call onPress when clicked', async () => {
    const onPress = jest.fn();
    const element = document.createElement('chip-base') as ChipBaseElement;
    element.setAttribute('label', 'Test');
    element.onPress = onPress;
    document.body.appendChild(element);
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    element.click();
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Accessibility Tests

```typescript
describe('ChipBase Accessibility', () => {
  it('should be focusable via keyboard', async () => {
    // Test Tab focus
  });

  it('should activate on Space/Enter', async () => {
    // Test keyboard activation
  });

  it('should have correct ARIA attributes', async () => {
    // Chip-Filter: aria-pressed
    // Chip-Input: X icon aria-label
  });
});
```

### Integration Tests

```typescript
describe('Chip + Icon-Base Integration', () => {
  it('should render icon at correct size', async () => {
    // Verify Icon-Base renders at icon.size075 (20px)
    // Test contract, not implementation
  });
});
```

---

## Design Decisions

### Decision 1: Single Size (32px visual, 48px tap)

**Options Considered**:
1. Single size (32px)
2. Multiple sizes (small/medium/large)
3. Auto-sizing based on content

**Decision**: Single size (32px visual, 48px tap area)

**Rationale**: 
- Simplicity over flexibility
- Chips are compact by definition
- One size works for all use cases
- Reduces API complexity

**Trade-offs**:
- Less flexibility for edge cases
- Can't match varying content densities
- May need future size variants

**Counter-argument**: Some designs may need smaller chips for dense UIs. However, the 48px tap area is already at accessibility minimum, and smaller visual sizes would require creative tap area solutions.

---

### Decision 2: X = Dismiss Whole Chip (Chip-Input)

**Options Considered**:
1. Tap X icon only to dismiss
2. Tap anywhere on chip to dismiss
3. Swipe gesture to dismiss

**Decision**: Tap anywhere on chip to dismiss

**Rationale**:
- Simplifies hit area (no tiny X target)
- Faster interaction for users
- Consistent with mobile patterns
- X icon is visual affordance, not separate target

**Trade-offs**:
- Can't have "select chip" + "dismiss chip" as separate actions
- Users expecting X-only dismiss may be surprised

**Counter-argument**: Some UIs need tap-to-select + X-to-dismiss. This is a valid use case (e.g., search filters that can be edited). However, this complexity warrants a semantic variant (future `Chip-Filter-Expandable`) rather than complicating Chip-Input.

---

### Decision 3: Component Token for Block Padding

**Options Considered**:
1. Use existing semantic token
2. Create component token referencing primitive
3. Hard-code value

**Decision**: Component token (`chip.paddingBlock`) referencing `space075`

**Rationale**:
- No semantic inset token exists for 6px
- Component token provides semantic meaning
- References primitive (not hard-coded)
- Follows Button-VerticalList-Item pattern

**Trade-offs**:
- Adds one component token to system
- Requires Rosetta pipeline integration

**Counter-argument**: Could use `space075` directly without component token. However, component tokens provide semantic context and enable chip-specific adjustments without affecting other components using `space075`.

---

### Decision 4: Checkmark Replaces Leading Icon (Chip-Filter)

**Options Considered**:
1. Checkmark replaces leading icon when selected
2. Checkmark appears alongside leading icon
3. No checkmark, rely on color change only

**Decision**: Checkmark replaces leading icon when selected

**Rationale**:
- Maintains consistent chip width
- Clear visual indication of selection
- Follows Material Design pattern
- Avoids chip width jumping

**Trade-offs**:
- Loses icon context when selected
- May confuse users expecting icon to persist

**Counter-argument**: Users may want to see both icon and checkmark. However, chip width consistency is more important for layout stability, and the selected color change provides additional context.

---

### Decision 5: Icon-Base Type Fix in This Spec

**Options Considered**:
1. Separate spec for Icon-Base fix
2. Include fix in this spec
3. Work around with current types

**Decision**: Include Icon-Base type fix in this spec

**Rationale**:
- Small, focused change
- Chip spec needs correct types
- Avoids spec dependency chain
- Fixes misleading API for all consumers

**Trade-offs**:
- Scope creep (affects other components)
- Must validate Button-Icon, Avatar, Badge-Label-Base

**Counter-argument**: Type fix affects multiple components and could be its own spec. However, the fix is small (type definition only), and bundling avoids overhead of separate spec while ensuring chip implementation uses correct types.

---

### Decision 6: No Disabled States (DesignerPunk Philosophy)

**Options Considered**:
1. Support disabled state with visual styling
2. No disabled state - don't render if unavailable
3. Read-only state instead of disabled

**Decision**: No disabled state - components should not render if unavailable

**Rationale**:
- DesignerPunk philosophy: users should only see actionable UI
- Disabled states create confusion about why something is unavailable
- Better UX to hide unavailable actions or explain why they're unavailable
- Simplifies component API and reduces edge cases

**Trade-offs**:
- Developers must handle conditional rendering
- May require additional UI to explain why actions are unavailable
- Different from common UI patterns that use disabled states

**Counter-argument**: Disabled states are a common UI pattern that users understand. However, they often create poor UX by showing users things they can't interact with without explaining why. DesignerPunk prioritizes clarity over convention.

---

## Platform Implementation Notes

### Web (CSS Custom Properties)

```css
.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-050);
  padding-block: var(--chip-padding-block);
  padding-inline: var(--space-150);
  border: var(--border-default) solid var(--color-structure-border);
  border-radius: var(--radius-max);
  background-color: var(--color-structure-surface);
  color: var(--color-text-default);
  font: var(--typography-button-sm);
  cursor: pointer;
  transition: all var(--duration-150);
}

/* Expanded tap area */
.chip {
  position: relative;
}

.chip::before {
  content: '';
  position: absolute;
  inset: calc((var(--tap-area-recommended) - 32px) / -2);
}

/* Hover and pressed states use blend tokens calculated at runtime */
.chip:hover {
  background-color: var(--_chip-hover-bg);
  border-color: var(--color-action-primary);
}

.chip:active {
  background-color: var(--_chip-pressed-bg);
  border-color: var(--color-action-primary);
}
```

**Note**: DesignerPunk does not support disabled states. If an action is unavailable, the component should not be rendered.

### iOS (SwiftUI)

```swift
struct ChipBase: View {
    let label: String
    var icon: String? = nil
    var onPress: (() -> Void)? = nil
    
    var body: some View {
        Button(action: { onPress?() }) {
            HStack(spacing: Tokens.spaceGroupedTight) {
                if let icon = icon {
                    IconBase(name: icon, size: .size075)
                }
                Text(label)
                    .font(Tokens.typographyButtonSm)
            }
            .padding(.horizontal, Tokens.spaceInset150)
            .padding(.vertical, Tokens.chipPaddingBlock)
            .background(Tokens.colorStructureSurface)
            .foregroundColor(Tokens.colorTextDefault)
            .overlay(
                Capsule()
                    .stroke(Tokens.colorStructureBorder, lineWidth: Tokens.borderDefault)
            )
            .clipShape(Capsule())
        }
        .frame(minHeight: Tokens.tapAreaRecommended)
    }
}

// Note: DesignerPunk does not support disabled states.
// If an action is unavailable, the component should not be rendered.
```

### Android (Jetpack Compose)

```kotlin
@Composable
fun ChipBase(
    label: String,
    icon: String? = null,
    onClick: () -> Unit = {}
) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(50),
        color = DesignTokens.colorStructureSurface,
        border = BorderStroke(
            DesignTokens.borderDefault.dp,
            DesignTokens.colorStructureBorder
        ),
        modifier = Modifier.sizeIn(minHeight = DesignTokens.tapAreaRecommended.dp)
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(DesignTokens.spaceGroupedTight.dp),
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(
                horizontal = DesignTokens.spaceInset150.dp,
                vertical = DesignTokens.chipPaddingBlock.dp
            )
        ) {
            icon?.let { IconBase(name = it, size = IconSize.Size075) }
            Text(
                text = label,
                style = DesignTokens.typographyButtonSm,
                color = DesignTokens.colorTextDefault
            )
        }
    }
}

// Note: DesignerPunk does not support disabled states.
// If an action is unavailable, the component should not be rendered.
```

---

## Accessibility Implementation

### ARIA Attributes

| Component | Attribute | Value |
|-----------|-----------|-------|
| Chip-Base | `role` | `button` |
| Chip-Base | `tabindex` | `0` (focusable) |
| Chip-Filter | `aria-pressed` | `true`/`false` based on selected |
| Chip-Input X icon | `aria-label` | `Remove [label]` |

**Note**: DesignerPunk does not support disabled states, so `aria-disabled` is not applicable.

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Focus chip |
| Space | Activate (press/toggle/dismiss) |
| Enter | Activate (press/toggle/dismiss) |

### Focus Indicator

Uses accessibility focus tokens for visible focus ring on keyboard navigation.

---

## Requirements Traceability

| Requirement | Design Section |
|-------------|----------------|
| R1: Component Structure | Architecture, Components and Interfaces |
| R2: Visual Specifications | Data Models (Token Dependencies) |
| R3: State Styling | Data Models (colorTokens) |
| R4: Chip-Filter | Components and Interfaces, Decision 4 |
| R5: Chip-Input | Components and Interfaces, Decision 2 |
| R6: Cross-Platform | Platform Implementation Notes |
| R7: Accessibility | Accessibility Implementation |
| R8: Component Token | Data Models (chipTokens), Decision 3 |
| R9: Icon-Base Type Fix | Decision 5 |
| R10: Stemma Compliance | Data Models (Schema Structure) |
| R11: Documentation | (tasks.md - post-implementation) |
| R12: Rosetta Integration | Data Models (chipTokens) |
| R13: Test Standards | Testing Strategy |

---

**Organization**: spec-validation
**Scope**: 045-chip-base
