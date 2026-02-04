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

---

## Architecture

### Component Hierarchy (Stemma System)

```
┌─────────────────────────────────────────────────────────────┐
│                      Chip-Base (Primitive)                   │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Visual Tokens: typography, colors, spacing, border      ││
│  │ Core Behavior: press, disabled                          ││
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
  
  /** Disabled state - prevents interaction */
  disabled?: boolean;
  
  /** Called when chip is pressed */
  onPress?: () => void;
  
  /** Test ID for automated testing */
  testID?: string;
}
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
  static observedAttributes = ['label', 'icon', 'disabled'];
  
  // Properties mirror attributes
  label: string;
  icon?: string;
  disabled: boolean;
  
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
    background: 'color.surface.secondary',
    border: 'color.border.default',
    text: 'color.content.primary'
  },
  selected: {
    background: 'color.interactive.primary',
    border: 'color.interactive.primary',
    text: 'color.content.onPrimary'
  },
  hover: {
    background: 'color.surface.tertiary',
    border: 'color.border.emphasis',
    text: 'color.content.primary'
  },
  pressed: {
    background: 'color.surface.tertiary',
    border: 'color.border.emphasis',
    text: 'color.content.primary'
  },
  disabled: {
    background: 'color.surface.disabled',
    border: 'color.border.disabled',
    text: 'color.content.disabled'
  }
};
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
  disabled:
    type: boolean
    default: false
    description: Disabled state
  onPress:
    type: function
    required: false
    description: Press callback

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
    - color.surface.secondary
    - color.surface.tertiary
    - color.surface.disabled
    - color.interactive.primary
    - color.content.primary
    - color.content.onPrimary
    - color.content.disabled
    - color.border.default
    - color.border.emphasis
    - color.border.disabled

behaviors:
  press:
    trigger: tap/click
    action: call onPress callback
    condition: not disabled
  disabled:
    trigger: disabled=true
    action: prevent interaction, apply disabled styling

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
| `disabled` + `onPress` | Ignore press events | Disabled takes precedence |

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
| `disabled` + `selected` | Show selected state, prevent toggle |

### Chip-Input Specific

| Scenario | Behavior |
|----------|----------|
| `disabled` + tap | No dismiss callback |
| Missing `onDismiss` | X icon visible but non-functional |

---

## Testing Strategy

### Test Categories (per Test Development Standards)

**Evergreen Tests** — Permanent behavior verification:

| Component | Test Focus | Example Assertions |
|-----------|------------|-------------------|
| Chip-Base | API contract | `label` renders, `icon` appears, `disabled` prevents press |
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

  it('should not call onPress when disabled', async () => {
    const onPress = jest.fn();
    const element = document.createElement('chip-base') as ChipBaseElement;
    element.setAttribute('label', 'Test');
    element.setAttribute('disabled', '');
    element.onPress = onPress;
    document.body.appendChild(element);
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    element.click();
    expect(onPress).not.toHaveBeenCalled();
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

## Platform Implementation Notes

### Web (CSS Custom Properties)

```css
.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-grouped-tight);
  padding-block: var(--chip-padding-block);
  padding-inline: var(--space-inset-150);
  border: var(--border-default) solid var(--color-border-default);
  border-radius: var(--radius-full);
  background-color: var(--color-surface-secondary);
  color: var(--color-content-primary);
  font: var(--typography-button-sm);
  cursor: pointer;
  transition: all var(--motion-duration-fast);
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
```

### iOS (SwiftUI)

```swift
struct ChipBase: View {
    let label: String
    var icon: String? = nil
    var disabled: Bool = false
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

### Android (Jetpack Compose)

```kotlin
@Composable
fun ChipBase(
    label: String,
    icon: String? = null,
    disabled: Boolean = false,
    onClick: () -> Unit = {}
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
                color = DesignTokens.colorContentPrimary
            )
        }
    }
}
```

---

## Accessibility Implementation

### ARIA Attributes

| Component | Attribute | Value |
|-----------|-----------|-------|
| Chip-Base | `role` | `button` |
| Chip-Base | `tabindex` | `0` (focusable) |
| Chip-Base | `aria-disabled` | `true` when disabled |
| Chip-Filter | `aria-pressed` | `true`/`false` based on selected |
| Chip-Input X icon | `aria-label` | `Remove [label]` |

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
