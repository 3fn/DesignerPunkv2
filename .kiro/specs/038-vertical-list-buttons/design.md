# Design Document: Vertical List Button Item

**Date**: January 7, 2026
**Spec**: 038 - Vertical List Button Item
**Status**: Design Phase
**Dependencies**: 
- `Icon-Base` — Icon component for leading icons and checkmark indicator
- `Button-CTA` — Shares focus state patterns and padding compensation approach

---

## Overview

The Vertical List Button Item (`Button-VerticalListItem`) is a "dumb" presentational component that renders visual states based on props received from a parent container. It handles no selection logic internally — all state management is delegated to the parent pattern (Vertical List Buttons Pattern).

The component supports three usage modes through its `visualState` prop:
- **Tap Mode**: Simple action buttons (`rest` state only)
- **Select Mode**: Single-selection radio-style behavior (`rest`, `selected`, `notSelected`)
- **Multi-Select Mode**: Checkbox-style behavior (`checked`, `unchecked`)

### Key Design Principles

1. **Prop-Driven Rendering**: Component appearance is entirely determined by props
2. **Height Stability**: Padding compensation ensures constant 48px height across all states
3. **Token-First**: All styling uses design tokens, no hard-coded values
4. **Accessibility-First**: WCAG 2.1 AA compliance, no disabled states

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Parent Pattern (Container)                    │
│  - Manages selection mode (tap/select/multi-select)             │
│  - Coordinates visual states across items                        │
│  - Handles ARIA roles and keyboard navigation                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Props: visualState, error, callbacks
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Button-VerticalListItem                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  [Icon]  Label Text                          [✓]        │    │
│  │          Description text (optional)                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Responsibilities:                                               │
│  - Render visual state based on props                           │
│  - Apply interactive overlays (hover, pressed, focus)           │
│  - Emit events (onClick, onFocus, onBlur)                       │
│  - Animate state transitions                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Component Boundaries

| Responsibility | Owner |
|----------------|-------|
| Visual state rendering | Button-VerticalListItem |
| Interactive overlays | Button-VerticalListItem |
| Event emission | Button-VerticalListItem |
| State transitions/animation | Button-VerticalListItem |
| Selection logic | Parent Pattern |
| Mode management | Parent Pattern |
| ARIA roles/states | Parent Pattern |
| Keyboard navigation | Parent Pattern |

---

## Components and Interfaces

### Props Interface

```typescript
interface VerticalListButtonItemProps {
  // Content
  label: string;
  description?: string;
  leadingIcon?: IconBaseName;
  
  // Visual state (controlled by parent)
  visualState: 'rest' | 'selected' | 'notSelected' | 'checked' | 'unchecked';
  
  // Error state (Select and Multi-Select modes only)
  error?: boolean;
  
  // Animation control
  checkmarkTransition?: 'fade' | 'instant';
  transitionDelay?: number;
  
  // Events
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}
```

### Visual State Mapping

```typescript
type VisualStateStyles = {
  background: string;
  borderWidth: string;
  borderColor: string;
  labelColor: string;
  iconColor: string;
  checkmarkVisible: boolean;
};

const visualStateMap: Record<VisualState, VisualStateStyles> = {
  rest: {
    background: 'var(--color-background)',
    borderWidth: 'var(--border-default)',
    borderColor: 'transparent',
    labelColor: 'var(--color-text-default)',
    iconColor: 'var(--color-text-default)', // + optical balance
    checkmarkVisible: false,
  },
  selected: {
    background: 'var(--color-select-selected-subtle)',
    borderWidth: 'var(--border-emphasis)',
    borderColor: 'var(--color-select-selected-strong)',
    labelColor: 'var(--color-select-selected-strong)',
    iconColor: 'var(--color-select-selected-strong)', // + optical balance
    checkmarkVisible: true,
  },
  notSelected: {
    background: 'var(--color-select-not-selected-subtle)',
    borderWidth: 'var(--border-default)',
    borderColor: 'transparent',
    labelColor: 'var(--color-select-not-selected-strong)',
    iconColor: 'var(--color-select-not-selected-strong)', // + optical balance
    checkmarkVisible: false,
  },
  checked: {
    background: 'var(--color-select-selected-subtle)',
    borderWidth: 'var(--border-default)',
    borderColor: 'transparent',
    labelColor: 'var(--color-select-selected-strong)',
    iconColor: 'var(--color-select-selected-strong)', // + optical balance
    checkmarkVisible: true,
  },
  unchecked: {
    background: 'var(--color-background)',
    borderWidth: 'var(--border-default)',
    borderColor: 'transparent',
    labelColor: 'var(--color-text-default)',
    iconColor: 'var(--color-text-default)', // + optical balance
    checkmarkVisible: false,
  },
};
```

### Error State Overlay

Error styling is applied on top of base visual states, with mode-specific treatment:

```typescript
function applyErrorStyles(
  baseStyles: VisualStateStyles,
  visualState: VisualState
): VisualStateStyles {
  const isSelectMode = ['rest', 'selected', 'notSelected'].includes(visualState);
  const isMultiSelectMode = ['checked', 'unchecked'].includes(visualState);
  
  if (isSelectMode) {
    // Select mode: full error treatment (border + background + colors)
    return {
      ...baseStyles,
      background: 'var(--color-error-subtle)',
      borderWidth: 'var(--border-emphasis)',
      borderColor: 'var(--color-error-strong)',
      labelColor: 'var(--color-error-strong)',
      iconColor: 'var(--color-error-strong)',
    };
  }
  
  if (isMultiSelectMode) {
    // Multi-Select mode: text/icon colors only (no border/background change)
    return {
      ...baseStyles,
      labelColor: 'var(--color-error-strong)',
      iconColor: 'var(--color-error-strong)',
    };
  }
  
  // Tap mode: error has no effect
  return baseStyles;
}
```

---

## Data Models

### Component Token Definitions

```typescript
// Button-VerticalListItem/tokens.ts
import { defineComponentTokens } from '../../../build/tokens';
import { spacingTokens, SPACING_BASE_VALUE } from '../../../tokens/SpacingTokens';

export const VerticalListItemTokens = defineComponentTokens({
  component: 'VerticalListItem',
  family: 'spacing',
  tokens: {
    'paddingBlock.rest': {
      value: SPACING_BASE_VALUE * 1.375, // 11px
      reasoning: 'Block padding at rest state (1px border). 11px padding + 1px border = 12px per side, achieving 48px total with 24px content.',
    },
    'paddingBlock.selected': {
      reference: spacingTokens.space125, // 10px
      reasoning: 'Block padding when selected (2px border). 10px padding + 2px border = 12px per side, maintaining 48px total with 24px content.',
    },
  },
});
```

### Height Stability Math

```
Total Height = (Border × 2) + (Padding × 2) + Content

Rest State:
  48px = (1px × 2) + (11px × 2) + 24px
  48px = 2px + 22px + 24px ✓

Selected State:
  48px = (2px × 2) + (10px × 2) + 24px
  48px = 4px + 20px + 24px ✓
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Visual State Styling Consistency

*For any* valid `visualState` value, the component SHALL render with the correct background, border, and text colors as defined in the visual state mapping.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

### Property 2: Selection Indicator Visibility

*For any* `visualState`, the Selection_Indicator (checkmark) SHALL be visible if and only if the state is `selected` or `checked`.

**Validates: Requirements 2.1, 2.2**

### Property 3: Selection Indicator Color

*For any* visible Selection_Indicator, the color SHALL be `color.select.selected.strong` (with optical balance) when `error` is false, and `color.error.strong` (with optical balance) when `error` is true.

**Validates: Requirements 2.3, 2.4**

### Property 4: Error Styling for Select Mode

*For any* Select mode visual state (`rest`, `selected`, `notSelected`) with `error=true`, the component SHALL render with `color.error.subtle` background, `borderEmphasis` border width, and `color.error.strong` border color.

**Validates: Requirements 3.1**

### Property 5: Error Styling for Multi-Select Mode

*For any* Multi-Select mode visual state (`checked`, `unchecked`) with `error=true`, the component SHALL render with `color.error.strong` label and icon colors only, with no change to background or border.

**Validates: Requirements 3.2**

### Property 6: Label Presence and Typography

*For any* component instance, the label SHALL always be present and styled with `typography.buttonMd`.

**Validates: Requirements 4.1**

### Property 7: Description Rendering

*For any* component instance with a `description` prop, the description SHALL be displayed below the label using `typography.bodySm` and `color.text.muted` regardless of visual state.

**Validates: Requirements 4.2, 4.3**

### Property 8: Leading Icon Rendering

*For any* component instance with a `leadingIcon` prop, the icon SHALL be displayed on the far left with the same color as the label (with optical balance applied).

**Validates: Requirements 4.4, 4.5**

### Property 9: Internal Spacing Consistency

*For any* internal spacing between elements (icon-to-label, label-to-checkmark), the gap SHALL be `space.grouped.loose` (12px).

**Validates: Requirements 4.6, 4.7**

### Property 10: Static Sizing Constraints

*For any* component instance, the width SHALL be 100% of container, border radius SHALL be `radiusNormal` (8px), and inline padding SHALL be `space.inset.200` (16px).

**Validates: Requirements 5.2, 5.3, 5.4**

### Property 11: Padding Compensation Correctness

*For any* visual state, the padding-block value SHALL be coordinated with border-width such that:
- When `borderDefault` (1px): padding-block = 11px
- When `borderEmphasis` (2px): padding-block = 10px

This ensures the total height (border + padding + content) remains constant at 48px. The property tests the *mechanism* (padding compensation), not just the *outcome* (height).

**Validates: Requirements 5.1, 6.1, 6.2, 6.3**

### Property 12: Transition Token Usage

*For any* visual state change, the component SHALL animate using `motion.selectionTransition` (250ms, standard easing) for background, border, padding, and color properties.

**Validates: Requirements 7.1**

### Property 13: Interactive State Overlays

*For any* interactive state (hover, pressed, focus), the component SHALL apply the correct overlay or outline using the appropriate blend/accessibility tokens.

**Validates: Requirements 8.1, 8.2, 8.3**

### Property 14: Icon Sizing Consistency

*For any* icon in the component (leading icon or checkmark), the size SHALL be `iconBaseSizes.size100` (24px).

**Validates: Requirements 9.1, 9.2**

### Property 15: No Disabled State Support

*For any* component instance, the `disabled` attribute SHALL never be applied. The component explicitly does not support disabled states.

**Validates: Requirements 10.2**

### Property 16: RTL Layout Adaptation

*For any* RTL document context, the layout SHALL automatically adapt with leading icon on the right and checkmark on the left, without additional configuration.

**Validates: Requirements 11.2, 11.3**

### Property 17: Event Callback Invocation

*For any* provided event callback (`onClick`, `onFocus`, `onBlur`), the component SHALL invoke it when the corresponding user interaction occurs.

**Validates: Requirements 12.1, 12.2, 12.3**

### Property 18: iOS Native Rendering

*For any* iOS implementation, the component SHALL use SwiftUI with `strokeBorder` modifier for border rendering (inside view bounds) and `withAnimation` for state transitions.

**Validates: Requirements 13.1, 13.2, 13.3, 13.6**

### Property 19: iOS Accessibility

*For any* iOS implementation, VoiceOver SHALL announce the label and current selection state using native SwiftUI accessibility modifiers.

**Validates: Requirements 10.5, 10.7**

### Property 20: Android Native Rendering

*For any* Android implementation, the component SHALL use Jetpack Compose with Material ripple effects and Compose animation APIs for state transitions.

**Validates: Requirements 14.1, 14.2, 14.3**

### Property 21: Android Accessibility

*For any* Android implementation, TalkBack SHALL announce the label and current selection state using Compose semantics.

**Validates: Requirements 10.6, 10.8**

### Property 22: Cross-Platform RTL Support

*For any* platform (Web, iOS, Android), the layout SHALL automatically adapt to RTL context using platform-native mechanisms without additional configuration.

**Validates: Requirements 11.4, 11.5, 11.6, 11.7**

---

## Error Handling

### Fail Loudly Philosophy

This component follows the "fail loudly" principle — errors should surface immediately during development rather than silently degrading at runtime.

**No Fallback Values**: The component SHALL NOT use hard-coded fallback values when tokens are missing. Hard values won't pass validation and mask configuration issues.

```typescript
// ❌ WRONG - Silent fallback masks token issues
const padding = getComputedStyle(element).getPropertyValue('--vlbi-padding-block') || '11px';

// ✅ CORRECT - Fail loudly if token missing
const padding = getComputedStyle(element).getPropertyValue('--vlbi-padding-block');
if (!padding) {
  throw new Error(
    'Missing required CSS variable --vlbi-padding-block. ' +
    'Ensure Rosetta-generated tokens are loaded.'
  );
}
```

### Invalid Props

| Scenario | Handling |
|----------|----------|
| Missing `label` | TypeScript compile error (required prop) |
| Invalid `visualState` | TypeScript compile error (union type) |
| `error=true` in Tap mode | Silently ignored (no effect) — this is intentional, not an error |
| Invalid `leadingIcon` name | Icon-Base component throws error (fail loudly) |
| Missing token CSS variables | Throw descriptive error (fail loudly) |

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| Very long label text | Text truncates with ellipsis |
| Very long description | Text wraps to multiple lines |
| Missing Icon-Base dependency | Build-time error |
| RTL without logical properties | Fallback to physical properties (degraded) — log warning |
| Missing Rosetta CSS | Throw error with clear message |

---

## Testing Strategy

### Testing Philosophy

Following Test Development Standards:
- **Test behavior, not implementation**: Verify what the component does, not how it does it
- **Test contracts, not details**: Focus on the API contract with consumers
- **Evergreen tests only**: All tests verify permanent behavior (no temporary migration tests)

### Test Categories

All tests for this component are **Evergreen** — they verify permanent behavior and contracts that should be maintained indefinitely.

### Unit Tests (Evergreen)

Unit tests verify specific examples and edge cases. Focus on behavior, not implementation details.

**Rendering Behavior Tests**:
- Component renders with required props (label visible, correct element type)
- Each visual state produces correct visual appearance (test CSS classes, not inline styles)
- Error state applies correct styling per mode
- Description renders when provided
- Leading icon renders when provided

**Accessibility Behavior Tests**:
- Renders as semantic `<button>` element
- Checkmark has `aria-hidden="true"` (decorative)
- Focus outline appears on keyboard focus (`:focus-visible`)
- No disabled attribute ever applied

**Event Behavior Tests**:
- onClick callback fires on click/tap
- onFocus callback fires on focus
- onBlur callback fires on blur

### Property-Based Tests (Evergreen)

Property tests verify universal properties across all inputs using the `fast-check` library. Each test runs minimum 100 iterations.

**Test File**: `Button-VerticalListItem.properties.test.ts`

1. **Visual State Styling Property**
   - Generate random visual states
   - Verify component applies correct CSS class for that state
   - **Tag**: Feature: 038-vertical-list-buttons, Property 1: Visual State Styling Consistency
   - **Tests behavior**: "Component renders correct appearance for state"
   - **Does NOT test**: Specific CSS property values (implementation detail)

2. **Padding Compensation Property**
   - Generate random visual states
   - Verify padding-block value matches expected for border-width
   - **Tag**: Feature: 038-vertical-list-buttons, Property 11: Padding Compensation Correctness
   - **Tests behavior**: "Padding adjusts when border changes"
   - **Does NOT test**: Computed height (outcome, not mechanism)

3. **Selection Indicator Visibility Property**
   - Generate random visual states
   - Verify checkmark visibility matches state (selected/checked = visible)
   - **Tag**: Feature: 038-vertical-list-buttons, Property 2: Selection Indicator Visibility
   - **Tests behavior**: "Checkmark appears for selected states"
   - **Does NOT test**: How checkmark is hidden (CSS display vs visibility)

4. **Error State Property**
   - Generate random visual states with error=true
   - Verify mode-specific error treatment (Select vs Multi-Select)
   - **Tag**: Feature: 038-vertical-list-buttons, Properties 4, 5: Error Styling
   - **Tests behavior**: "Error styling differs by mode"
   - **Does NOT test**: Specific color values (use CSS class presence)

5. **Event Callback Property**
   - Generate random callback configurations
   - Verify callbacks are invoked on interaction
   - **Tag**: Feature: 038-vertical-list-buttons, Property 17: Event Callback Invocation
   - **Tests contract**: "Provided callbacks are called"
   - **Does NOT test**: Event object details (implementation)

### Web Component Testing Patterns

Following JSDOM patterns from Test Development Standards:

```typescript
describe('Button-VerticalListItem Web Component', () => {
  beforeAll(() => {
    // Register custom element once
    if (!customElements.get('vertical-list-button-item')) {
      customElements.define('vertical-list-button-item', VerticalListButtonItem);
    }
  });

  beforeEach(async () => {
    // Wait for element definition
    await customElements.whenDefined('vertical-list-button-item');
  });

  it('should render with correct visual state class', async () => {
    const element = document.createElement('vertical-list-button-item');
    element.setAttribute('label', 'Test Label');
    element.setAttribute('visual-state', 'selected');
    
    document.body.appendChild(element);
    
    // Wait for connectedCallback
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Test behavior: correct class applied
    const button = element.shadowRoot?.querySelector('button');
    expect(button?.classList.contains('vertical-list-item--selected')).toBe(true);
    
    document.body.removeChild(element);
  });
});
```

### Integration Tests (Evergreen)

**Test File**: `Button-VerticalListItem.integration.test.ts`

1. **Token Integration**
   - Verify component consumes Rosetta-generated CSS variables
   - Verify component tokens are registered with ComponentTokenRegistry
   - **Tests contract**: "Component uses design system tokens"

2. **Icon-Base Integration**
   - Verify Icon-Base component renders correctly within button
   - Verify icon size prop is passed correctly (`iconBaseSizes.size100`)
   - **Tests contract**: "Icons render at correct size"

### iOS Testing Patterns (SwiftUI)

**Test File**: `VerticalListButtonItemTests.swift`

```swift
import XCTest
import SwiftUI
import ViewInspector
@testable import DesignerPunk

final class VerticalListButtonItemTests: XCTestCase {
    
    func testRendersWithCorrectVisualState() throws {
        let sut = VerticalListButtonItem(
            label: "Test Label",
            visualState: .selected
        )
        
        let view = try sut.inspect()
        // Verify selected state styling is applied
        // Test behavior: correct appearance for state
    }
    
    func testVoiceOverAccessibility() throws {
        let sut = VerticalListButtonItem(
            label: "Settings",
            visualState: .selected
        )
        
        let view = try sut.inspect()
        let accessibilityLabel = try view.accessibilityLabel().string()
        let accessibilityValue = try view.accessibilityValue().string()
        
        XCTAssertEqual(accessibilityLabel, "Settings")
        XCTAssertEqual(accessibilityValue, "Selected")
    }
    
    func testPaddingCompensation() throws {
        // Test that padding adjusts when border width changes
        let restState = VerticalListButtonItem(label: "Test", visualState: .rest)
        let selectedState = VerticalListButtonItem(label: "Test", visualState: .selected)
        
        // Verify padding values differ based on border width
        // Rest: 11px padding (1px border)
        // Selected: 10px padding (2px border)
    }
    
    func testRTLLayoutAdaptation() throws {
        // Test that layout mirrors in RTL context
        let sut = VerticalListButtonItem(
            label: "Test",
            leadingIcon: "settings",
            visualState: .selected
        )
        
        // Verify leading icon appears on right in RTL
        // Verify checkmark appears on left in RTL
    }
}
```

### Android Testing Patterns (Compose)

**Test File**: `VerticalListButtonItemTest.kt`

```kotlin
package com.designerpunk.components.button

import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createComposeRule
import org.junit.Rule
import org.junit.Test

class VerticalListButtonItemTest {
    
    @get:Rule
    val composeTestRule = createComposeRule()
    
    @Test
    fun rendersWithCorrectVisualState() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Test Label",
                visualState = VisualState.SELECTED
            )
        }
        
        // Verify selected state styling is applied
        composeTestRule.onNodeWithText("Test Label").assertExists()
    }
    
    @Test
    fun talkBackAccessibility() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Settings",
                visualState = VisualState.SELECTED
            )
        }
        
        composeTestRule
            .onNodeWithContentDescription("Settings")
            .assertExists()
        
        // Verify state description for TalkBack
        composeTestRule
            .onNode(hasStateDescription("Selected"))
            .assertExists()
    }
    
    @Test
    fun paddingCompensation() {
        // Test that padding adjusts when border width changes
        composeTestRule.setContent {
            Column {
                VerticalListButtonItem(
                    label = "Rest",
                    visualState = VisualState.REST
                )
                VerticalListButtonItem(
                    label = "Selected",
                    visualState = VisualState.SELECTED
                )
            }
        }
        
        // Verify both buttons have same total height (48dp)
        // despite different border widths
    }
    
    @Test
    fun rtlLayoutAdaptation() {
        composeTestRule.setContent {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                VerticalListButtonItem(
                    label = "Test",
                    leadingIcon = "settings",
                    visualState = VisualState.SELECTED
                )
            }
        }
        
        // Verify leading icon appears on right in RTL
        // Verify checkmark appears on left in RTL
    }
    
    @Test
    fun materialRippleEffect() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Test",
                visualState = VisualState.REST,
                onClick = {}
            )
        }
        
        // Verify ripple indication is applied on click
        composeTestRule.onNodeWithText("Test").performClick()
    }
}
```

### What NOT to Test

Following "Don't Test Philosophical Preferences":

❌ **Don't test**: "Component uses CSS logical properties"
- This is a preference about implementation
- Test RTL behavior instead (icons swap sides)

❌ **Don't test**: "Component uses specific CSS variable names"
- This is implementation detail
- Test that styling is correct for each state

❌ **Don't test**: "Animation uses exactly 250ms duration"
- This is implementation detail
- Test that transitions occur (not their timing)

❌ **Don't test**: "Component token value is exactly 11"
- This is implementation detail
- Test that padding compensation works (height stable)

### Fail Loudly in Tests

Tests should verify the component fails loudly when tokens are missing:

```typescript
it('should throw error when required token is missing', async () => {
  // Remove token CSS variable
  document.documentElement.style.removeProperty('--vlbi-padding-block-rest');
  
  const element = document.createElement('vertical-list-button-item');
  element.setAttribute('label', 'Test');
  
  // Expect error, not silent fallback
  await expect(async () => {
    document.body.appendChild(element);
    await new Promise(resolve => setTimeout(resolve, 0));
  }).rejects.toThrow('Missing required CSS variable');
  
  // Restore token
  document.documentElement.style.setProperty('--vlbi-padding-block-rest', '11px');
});
```

**No Hard-Coded Fallbacks**: Tests should verify the component does NOT use fallback values. Hard values won't pass validation and mask configuration issues.

---

## Design Decisions

### Decision 1: Padding Compensation vs. Box-Sizing

**Options Considered**:
1. Padding compensation (reduce padding when border increases)
2. `box-sizing: border-box` with fixed height
3. Inner container with fixed height

**Decision**: Padding compensation

**Rationale**: 
- Matches existing Button-CTA pattern for consistency
- Provides smooth animation between states (padding animates with border)
- Avoids nested containers that complicate layout

**Trade-offs**: 
- Requires component tokens for state-specific padding values
- More complex CSS than simple box-sizing approach

### Decision 2: Error Treatment by Mode

**Options Considered**:
1. Uniform error treatment across all modes
2. Mode-specific error treatment (current approach)
3. No error state support

**Decision**: Mode-specific error treatment

**Rationale**:
- Select mode uses visible borders, so error should include border styling
- Multi-Select mode uses transparent borders, so error should only affect text/icon
- Maintains visual consistency within each mode's design language

**Trade-offs**:
- More complex implementation
- Developers must understand mode-specific behavior

### Decision 3: Component Token for 11px Padding

**Options Considered**:
1. Create new primitive token `space137`
2. Use `TokenWithValue` in component token definition
3. Hard-code the value

**Decision**: Use `TokenWithValue` with formula `SPACING_BASE_VALUE * 1.375`

**Rationale**:
- Component tokens exist for exactly this case (primitives insufficient)
- Formula conforms to spacing family's mathematical foundation
- Avoids polluting primitive token space with one-off values

**Trade-offs**:
- Value is component-specific, not reusable
- If other components need 11px, may want to promote to primitive

---

## Platform Considerations

### Web Implementation

```typescript
// Simplified structure
class VerticalListButtonItem extends HTMLElement {
  static get observedAttributes() {
    return ['visual-state', 'error', 'checkmark-transition', 'transition-delay'];
  }
  
  render() {
    const styles = this.computeStyles();
    const padding = this.computePadding();
    
    return html`
      <button
        class="vertical-list-item"
        style="
          --vlbi-background: ${styles.background};
          --vlbi-border-width: ${styles.borderWidth};
          --vlbi-border-color: ${styles.borderColor};
          --vlbi-padding-block: ${padding};
        "
        @click=${this.handleClick}
        @focus=${this.handleFocus}
        @blur=${this.handleBlur}
      >
        ${this.leadingIcon ? html`<icon-base name=${this.leadingIcon} size="24"></icon-base>` : ''}
        <div class="content">
          <span class="label">${this.label}</span>
          ${this.description ? html`<span class="description">${this.description}</span>` : ''}
        </div>
        ${styles.checkmarkVisible ? html`<icon-base name="check" size="24" aria-hidden="true"></icon-base>` : ''}
      </button>
    `;
  }
}
```

### CSS Structure

```css
.vertical-list-item {
  /* Layout */
  display: flex;
  align-items: center;
  gap: var(--space-grouped-loose);
  width: 100%;
  min-height: var(--accessibility-tap-area-recommended);
  
  /* Spacing - uses logical properties for RTL */
  padding-block: var(--vlbi-padding-block);
  padding-inline: var(--space-inset-200);
  
  /* Visual */
  background: var(--vlbi-background);
  border: var(--vlbi-border-width) solid var(--vlbi-border-color);
  border-radius: var(--radius-normal);
  
  /* Animation */
  transition: 
    background var(--motion-selection-transition-duration) var(--motion-selection-transition-easing),
    border-color var(--motion-selection-transition-duration) var(--motion-selection-transition-easing),
    border-width var(--motion-selection-transition-duration) var(--motion-selection-transition-easing),
    padding var(--motion-selection-transition-duration) var(--motion-selection-transition-easing);
}

.vertical-list-item:hover {
  background: color-mix(in srgb, var(--vlbi-background), var(--blend-hover-darker));
}

.vertical-list-item:active {
  background: color-mix(in srgb, var(--vlbi-background), var(--blend-pressed-darker));
}

.vertical-list-item:focus-visible {
  outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
  outline-offset: var(--accessibility-focus-offset);
}
```

### iOS Implementation (SwiftUI)

```swift
import SwiftUI

/// Visual state for the vertical list button item
enum VisualState: String {
    case rest
    case selected
    case notSelected
    case checked
    case unchecked
}

/// Checkmark transition behavior
enum CheckmarkTransition {
    case fade
    case instant
}

/// Button-VerticalListItem for iOS
/// A "dumb" presentational component that renders visual states based on props.
struct VerticalListButtonItem: View {
    // Content
    let label: String
    var description: String?
    var leadingIcon: String?
    
    // Visual state (controlled by parent)
    let visualState: VisualState
    
    // Error state
    var error: Bool = false
    
    // Animation control
    var checkmarkTransition: CheckmarkTransition = .fade
    var transitionDelay: Double = 0
    
    // Events
    var onClick: (() -> Void)?
    var onFocus: (() -> Void)?
    var onBlur: (() -> Void)?
    
    // Design tokens (injected from Rosetta-generated values)
    @Environment(\.designTokens) private var tokens
    @Environment(\.layoutDirection) private var layoutDirection
    
    // Computed styles based on visual state
    private var styles: VisualStateStyles {
        let baseStyles = visualStateMap[visualState] ?? .rest
        return error ? applyErrorStyles(baseStyles) : baseStyles
    }
    
    // Padding compensation for border width changes
    private var paddingBlock: CGFloat {
        let requiresEmphasisBorder = visualState == .selected || 
            (error && isSelectMode)
        return requiresEmphasisBorder ? 10 : 11  // 10px for 2px border, 11px for 1px border
    }
    
    private var isSelectMode: Bool {
        [.rest, .selected, .notSelected].contains(visualState)
    }
    
    var body: some View {
        Button(action: { onClick?() }) {
            HStack(spacing: tokens.spaceGroupedLoose) {
                // Leading icon (optional)
                if let iconName = leadingIcon {
                    IconBase(name: iconName, size: tokens.iconSize100)
                        .foregroundColor(styles.iconColor)
                }
                
                // Content (label + description)
                VStack(alignment: .leading, spacing: 2) {
                    Text(label)
                        .font(tokens.typographyButtonMd)
                        .foregroundColor(styles.labelColor)
                    
                    if let desc = description {
                        Text(desc)
                            .font(tokens.typographyBodySm)
                            .foregroundColor(tokens.colorTextMuted)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                
                // Selection indicator (checkmark)
                if styles.checkmarkVisible {
                    IconBase(name: "check", size: tokens.iconSize100)
                        .foregroundColor(styles.iconColor)
                        .opacity(checkmarkTransition == .fade ? 1 : 1)
                        .transition(.opacity)
                        .accessibilityHidden(true)
                }
            }
            .padding(.vertical, paddingBlock)
            .padding(.horizontal, tokens.spaceInset200)
            .frame(minHeight: tokens.tapAreaRecommended)
            .background(styles.background)
            .overlay(
                // Border using strokeBorder (draws inside view bounds)
                RoundedRectangle(cornerRadius: tokens.radiusNormal)
                    .strokeBorder(
                        styles.borderColor,
                        lineWidth: styles.borderWidth
                    )
            )
            .cornerRadius(tokens.radiusNormal)
        }
        .buttonStyle(VerticalListButtonStyle())
        .animation(
            .easeInOut(duration: tokens.motionSelectionTransitionDuration)
                .delay(transitionDelay),
            value: visualState
        )
        .animation(
            .easeInOut(duration: tokens.motionSelectionTransitionDuration)
                .delay(transitionDelay),
            value: error
        )
        .accessibilityLabel(label)
        .accessibilityValue(accessibilityStateDescription)
    }
    
    private var accessibilityStateDescription: String {
        switch visualState {
        case .selected: return "Selected"
        case .notSelected: return "Not selected"
        case .checked: return "Checked"
        case .unchecked: return "Unchecked"
        case .rest: return ""
        }
    }
}

/// Custom button style for hover/pressed states
struct VerticalListButtonStyle: ButtonStyle {
    @Environment(\.designTokens) private var tokens
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .brightness(configuration.isPressed ? -0.1 : 0)  // Pressed overlay
    }
}

/// Visual state styles structure
struct VisualStateStyles {
    let background: Color
    let borderWidth: CGFloat
    let borderColor: Color
    let labelColor: Color
    let iconColor: Color
    let checkmarkVisible: Bool
    
    static let rest = VisualStateStyles(
        background: .designToken(.colorBackground),
        borderWidth: 1,
        borderColor: .clear,
        labelColor: .designToken(.colorTextDefault),
        iconColor: .designToken(.colorTextDefault),
        checkmarkVisible: false
    )
    
    // ... other states defined similarly
}
```

### Android Implementation (Jetpack Compose)

```kotlin
package com.designerpunk.components.button

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.ripple.rememberRipple
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp

/**
 * Visual state for the vertical list button item
 */
enum class VisualState {
    REST, SELECTED, NOT_SELECTED, CHECKED, UNCHECKED
}

/**
 * Checkmark transition behavior
 */
enum class CheckmarkTransition {
    FADE, INSTANT
}

/**
 * Button-VerticalListItem for Android
 * A "dumb" presentational component that renders visual states based on props.
 * 
 * @param label Primary button text (required)
 * @param description Secondary explanatory text (optional)
 * @param leadingIcon Icon name for leading icon (optional)
 * @param visualState Current visual state controlled by parent
 * @param error Whether error styling should be applied
 * @param checkmarkTransition How checkmark should animate when hiding
 * @param transitionDelay Delay before transition starts (milliseconds)
 * @param onClick Callback when button is clicked
 * @param onFocus Callback when button receives focus
 * @param onBlur Callback when button loses focus
 * @param modifier Modifier for the component
 */
@Composable
fun VerticalListButtonItem(
    label: String,
    visualState: VisualState,
    modifier: Modifier = Modifier,
    description: String? = null,
    leadingIcon: String? = null,
    error: Boolean = false,
    checkmarkTransition: CheckmarkTransition = CheckmarkTransition.FADE,
    transitionDelay: Int = 0,
    onClick: (() -> Unit)? = null,
    onFocus: (() -> Unit)? = null,
    onBlur: (() -> Unit)? = null
) {
    // Design tokens from Rosetta
    val tokens = LocalDesignTokens.current
    val layoutDirection = LocalLayoutDirection.current
    
    // Compute styles based on visual state and error
    val styles = remember(visualState, error) {
        computeStyles(visualState, error, tokens)
    }
    
    // Animated values for smooth transitions
    val animationSpec = tween<Color>(
        durationMillis = tokens.motionSelectionTransitionDuration,
        delayMillis = transitionDelay
    )
    val dpAnimationSpec = tween<Dp>(
        durationMillis = tokens.motionSelectionTransitionDuration,
        delayMillis = transitionDelay
    )
    
    val animatedBackground by animateColorAsState(
        targetValue = styles.background,
        animationSpec = animationSpec,
        label = "background"
    )
    val animatedBorderColor by animateColorAsState(
        targetValue = styles.borderColor,
        animationSpec = animationSpec,
        label = "borderColor"
    )
    val animatedBorderWidth by animateDpAsState(
        targetValue = styles.borderWidth,
        animationSpec = dpAnimationSpec,
        label = "borderWidth"
    )
    val animatedLabelColor by animateColorAsState(
        targetValue = styles.labelColor,
        animationSpec = animationSpec,
        label = "labelColor"
    )
    
    // Padding compensation for border width changes
    val paddingBlock = if (styles.borderWidth == 2.dp) 10.dp else 11.dp
    
    // Interaction source for ripple effect
    val interactionSource = remember { MutableInteractionSource() }
    
    Box(
        modifier = modifier
            .fillMaxWidth()
            .heightIn(min = tokens.tapAreaRecommended)
            .clip(RoundedCornerShape(tokens.radiusNormal))
            .background(animatedBackground)
            .border(
                width = animatedBorderWidth,
                color = animatedBorderColor,
                shape = RoundedCornerShape(tokens.radiusNormal)
            )
            .clickable(
                interactionSource = interactionSource,
                indication = rememberRipple(),  // Material ripple effect
                onClick = { onClick?.invoke() }
            )
            .padding(
                vertical = paddingBlock,
                horizontal = tokens.spaceInset200
            )
            .semantics {
                contentDescription = label
                stateDescription = getAccessibilityStateDescription(visualState)
            }
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(tokens.spaceGroupedLoose),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Leading icon (optional)
            leadingIcon?.let { iconName ->
                IconBase(
                    name = iconName,
                    size = tokens.iconSize100,
                    color = animatedLabelColor
                )
            }
            
            // Content (label + description)
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    text = label,
                    style = tokens.typographyButtonMd,
                    color = animatedLabelColor
                )
                
                description?.let { desc ->
                    Text(
                        text = desc,
                        style = tokens.typographyBodySm,
                        color = tokens.colorTextMuted
                    )
                }
            }
            
            // Selection indicator (checkmark)
            if (styles.checkmarkVisible) {
                IconBase(
                    name = "check",
                    size = tokens.iconSize100,
                    color = styles.iconColor,
                    modifier = Modifier.semantics { 
                        // Mark as decorative (aria-hidden equivalent)
                    }
                )
            }
        }
    }
}

/**
 * Compute visual styles based on state and error
 */
private fun computeStyles(
    visualState: VisualState,
    error: Boolean,
    tokens: DesignTokens
): VisualStateStyles {
    val baseStyles = when (visualState) {
        VisualState.REST -> VisualStateStyles(
            background = tokens.colorBackground,
            borderWidth = 1.dp,
            borderColor = Color.Transparent,
            labelColor = tokens.colorTextDefault,
            iconColor = tokens.colorTextDefault,
            checkmarkVisible = false
        )
        VisualState.SELECTED -> VisualStateStyles(
            background = tokens.colorSelectSelectedSubtle,
            borderWidth = 2.dp,
            borderColor = tokens.colorSelectSelectedStrong,
            labelColor = tokens.colorSelectSelectedStrong,
            iconColor = tokens.colorSelectSelectedStrong,
            checkmarkVisible = true
        )
        VisualState.NOT_SELECTED -> VisualStateStyles(
            background = tokens.colorSelectNotSelectedSubtle,
            borderWidth = 1.dp,
            borderColor = Color.Transparent,
            labelColor = tokens.colorSelectNotSelectedStrong,
            iconColor = tokens.colorSelectNotSelectedStrong,
            checkmarkVisible = false
        )
        VisualState.CHECKED -> VisualStateStyles(
            background = tokens.colorSelectSelectedSubtle,
            borderWidth = 1.dp,
            borderColor = Color.Transparent,
            labelColor = tokens.colorSelectSelectedStrong,
            iconColor = tokens.colorSelectSelectedStrong,
            checkmarkVisible = true
        )
        VisualState.UNCHECKED -> VisualStateStyles(
            background = tokens.colorBackground,
            borderWidth = 1.dp,
            borderColor = Color.Transparent,
            labelColor = tokens.colorTextDefault,
            iconColor = tokens.colorTextDefault,
            checkmarkVisible = false
        )
    }
    
    // Apply error styling if needed
    return if (error) {
        applyErrorStyles(baseStyles, visualState, tokens)
    } else {
        baseStyles
    }
}

/**
 * Apply error styling based on mode
 */
private fun applyErrorStyles(
    baseStyles: VisualStateStyles,
    visualState: VisualState,
    tokens: DesignTokens
): VisualStateStyles {
    val isSelectMode = visualState in listOf(
        VisualState.REST, 
        VisualState.SELECTED, 
        VisualState.NOT_SELECTED
    )
    val isMultiSelectMode = visualState in listOf(
        VisualState.CHECKED, 
        VisualState.UNCHECKED
    )
    
    return when {
        isSelectMode -> baseStyles.copy(
            background = tokens.colorErrorSubtle,
            borderWidth = 2.dp,
            borderColor = tokens.colorErrorStrong,
            labelColor = tokens.colorErrorStrong,
            iconColor = tokens.colorErrorStrong
        )
        isMultiSelectMode -> baseStyles.copy(
            labelColor = tokens.colorErrorStrong,
            iconColor = tokens.colorErrorStrong
        )
        else -> baseStyles  // Tap mode: no error effect
    }
}

/**
 * Get accessibility state description for TalkBack
 */
private fun getAccessibilityStateDescription(visualState: VisualState): String {
    return when (visualState) {
        VisualState.SELECTED -> "Selected"
        VisualState.NOT_SELECTED -> "Not selected"
        VisualState.CHECKED -> "Checked"
        VisualState.UNCHECKED -> "Unchecked"
        VisualState.REST -> ""
    }
}

/**
 * Visual state styles data class
 */
data class VisualStateStyles(
    val background: Color,
    val borderWidth: Dp,
    val borderColor: Color,
    val labelColor: Color,
    val iconColor: Color,
    val checkmarkVisible: Boolean
)
```

---

## Related Specs

- **XXX-vertical-list-buttons-pattern**: Container pattern that consumes this component
- **Button-CTA**: Shares focus state patterns and padding compensation approach
- **Icon-Base**: Icon component used for leading icons and checkmark
- **037-component-token-generation-pipeline**: Component token architecture

---

*This design document captures component-level architecture and implementation details. Ready to proceed to task planning.*
