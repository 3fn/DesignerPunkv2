# Focus Indicator Guide

**Date**: October 23, 2025
**Purpose**: Platform-specific focus indicator implementation patterns using border width tokens
**Organization**: spec-guide
**Scope**: border-width-tokens

---

## Related Guides

- [Usage Patterns Guide](./usage-patterns-guide.md) - Explains when to use borderDefault, borderEmphasis, and borderHeavy
- [Design Document](./design.md) - Explains why focus ring tokens are not included in the border width system
- [Requirements Document](./requirements.md) - See Requirement 6 for platform-native focus pattern requirements

---

## Introduction

Focus indicators are critical for accessibility, enabling keyboard navigation users to understand which element currently has focus. However, focus indicator implementation varies significantly across platforms due to different interaction models, accessibility frameworks, and platform conventions.

This guide documents platform-appropriate focus indicator patterns using border width tokens where applicable, while respecting platform-native patterns where they provide better accessibility and user experience.

**Key Principle**: Focus indicators should feel native to each platform while maintaining consistent visual weight across platforms where custom implementation is appropriate.

---

## Web Focus Patterns

### Platform Characteristics

**Interaction Model**: Keyboard navigation with Tab/Shift+Tab
**Accessibility Framework**: WCAG 2.1 AA requirements for focus indicators
**Native Support**: Browser default focus styles (often insufficient)
**Custom Implementation**: Required for consistent, accessible focus indicators

### Recommended Pattern: Outline with borderEmphasis

Web focus indicators should use the CSS `outline` property (not `border`) with `borderEmphasis` width to provide clear, accessible focus indication without affecting layout.

**Why outline, not border**:
- `outline` doesn't affect layout or trigger reflow
- `outline` draws outside the element's box model
- `outline` is specifically designed for focus indication
- `border` changes element dimensions and can cause layout shifts

**Why borderEmphasis**:
- 2px outline width meets WCAG 2.1 AA requirements (minimum 2px)
- Provides clear visual distinction from default state
- Consistent with emphasized state visual weight
- Scales appropriately across different viewport sizes

### Code Examples

#### Basic Focus Indicator (CSS)

```css
/* Using CSS custom properties from generated tokens */
.button {
  /* Default state - no outline */
  outline: none;
  border: var(--border-width-default) solid var(--color-button-border);
  padding: var(--space-200) var(--space-300);
  border-radius: var(--radius-100);
}

.button:focus {
  /* Focus state - outline with borderEmphasis width */
  outline: var(--border-width-emphasis) solid var(--color-focus);
  outline-offset: 2px; /* Space between element and outline */
}

/* Remove default browser focus styles */
.button:focus:not(:focus-visible) {
  outline: none;
}

/* Show focus indicator only for keyboard navigation */
.button:focus-visible {
  outline: var(--border-width-emphasis) solid var(--color-focus);
  outline-offset: 2px;
}
```

#### Focus Indicator with React (TypeScript)

```typescript
import { borderWidthTokens } from '@designerpunk/tokens';
import { semanticColorTokens } from '@designerpunk/tokens';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        border: `${borderWidthTokens.borderWidth100}px solid ${semanticColorTokens.buttonBorder}`,
        padding: '8px 16px',
        borderRadius: '4px',
        outline: 'none', // Remove default
      }}
      css={{
        '&:focus-visible': {
          outline: `${borderWidthTokens.borderWidth200}px solid ${semanticColorTokens.focus}`,
          outlineOffset: '2px',
        }
      }}
    >
      {children}
    </button>
  );
};
```

#### Focus Indicator with Styled Components

```typescript
import styled from 'styled-components';
import { borderWidthTokens, semanticColorTokens } from '@designerpunk/tokens';

export const Button = styled.button`
  border: ${borderWidthTokens.borderWidth100}px solid ${semanticColorTokens.buttonBorder};
  padding: 8px 16px;
  border-radius: 4px;
  outline: none;

  &:focus-visible {
    outline: ${borderWidthTokens.borderWidth200}px solid ${semanticColorTokens.focus};
    outline-offset: 2px;
  }
`;
```

### Accessibility Considerations

**WCAG 2.1 AA Requirements**:
- Focus indicator must have minimum 2px thickness (borderEmphasis = 2px ✓)
- Focus indicator must have 3:1 contrast ratio against adjacent colors
- Focus indicator must be visible for all focusable elements
- Focus indicator should not rely on color alone (use outline + color)

**Best Practices**:
- Use `:focus-visible` to show focus only for keyboard navigation
- Provide sufficient `outline-offset` (2-4px) for visual separation
- Ensure focus indicator is visible against all background colors
- Test with keyboard navigation (Tab, Shift+Tab, Arrow keys)
- Test with screen readers (NVDA, JAWS, VoiceOver)

### Common Patterns

#### Input Focus

```css
.input {
  border: var(--border-width-default) solid var(--color-input-border);
  padding: var(--space-150) var(--space-200);
  border-radius: var(--radius-050);
}

.input:focus-visible {
  /* Emphasized border for input focus */
  border-color: var(--color-focus);
  border-width: var(--border-width-emphasis);
  outline: var(--border-width-emphasis) solid var(--color-focus);
  outline-offset: 0; /* Tight to element for inputs */
}
```

#### Card Focus

```css
.card {
  border: var(--border-width-default) solid var(--color-card-border);
  border-radius: var(--radius-200);
  padding: var(--space-300);
}

.card:focus-visible {
  outline: var(--border-width-emphasis) solid var(--color-focus);
  outline-offset: 4px; /* Larger offset for cards */
}
```

#### Link Focus

```css
.link {
  color: var(--color-link);
  text-decoration: underline;
}

.link:focus-visible {
  outline: var(--border-width-emphasis) solid var(--color-focus);
  outline-offset: 2px;
  border-radius: 2px; /* Rounded outline for text links */
}
```

---

## iOS Focus Patterns

### Platform Characteristics

**Interaction Model**: Touch-first with optional keyboard/trackpad support
**Accessibility Framework**: UIKit/SwiftUI accessibility system
**Native Support**: System-provided focus indicators (iOS 15+)
**Custom Implementation**: Rarely needed, system handles focus automatically

### Recommended Pattern: System-Provided Focus Indicators

iOS provides sophisticated focus indicators automatically through the accessibility system. Custom focus indicators are rarely needed and can interfere with system accessibility features.

**Why system-provided**:
- Consistent with iOS platform conventions
- Automatically adapts to accessibility settings (Reduce Motion, Increase Contrast)
- Works seamlessly with VoiceOver and Switch Control
- Respects user's accessibility preferences
- Handles complex focus scenarios (nested views, scroll views, etc.)

**When to customize**:
- Only when system focus indicators are insufficient for specific use cases
- When building custom controls that don't inherit system focus behavior
- When brand requirements necessitate custom focus styling (rare)

### Code Examples

#### SwiftUI Button with System Focus

```swift
import SwiftUI

struct PrimaryButton: View {
    let title: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .padding(.horizontal, DesignTokens.space300)
                .padding(.vertical, DesignTokens.space200)
        }
        .buttonStyle(PrimaryButtonStyle())
        .focusable() // Enable system focus indicator
    }
}

struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .background(Color(DesignTokens.colorButtonBackground))
            .foregroundColor(Color(DesignTokens.colorButtonText))
            .cornerRadius(DesignTokens.radius100)
            .overlay(
                RoundedRectangle(cornerRadius: DesignTokens.radius100)
                    .stroke(
                        Color(DesignTokens.colorButtonBorder),
                        lineWidth: DesignTokens.borderWidth100
                    )
            )
            // System handles focus indicator automatically
    }
}
```

#### UIKit Button with System Focus

```swift
import UIKit

class PrimaryButton: UIButton {
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupButton()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupButton()
    }
    
    private func setupButton() {
        // Configure button appearance
        layer.borderWidth = DesignTokens.borderWidth100
        layer.borderColor = DesignTokens.colorButtonBorder.cgColor
        layer.cornerRadius = DesignTokens.radius100
        
        contentEdgeInsets = UIEdgeInsets(
            top: DesignTokens.space200,
            left: DesignTokens.space300,
            bottom: DesignTokens.space200,
            right: DesignTokens.space300
        )
        
        // Enable system focus indicator
        // iOS automatically provides focus ring for focusable elements
    }
    
    override var canBecomeFocused: Bool {
        return true // Enable focus for keyboard/trackpad navigation
    }
}
```

#### Custom Focus Indicator (Rare Use Case)

```swift
import SwiftUI

struct CustomFocusButton: View {
    let title: String
    let action: () -> Void
    @FocusState private var isFocused: Bool
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .padding(.horizontal, DesignTokens.space300)
                .padding(.vertical, DesignTokens.space200)
        }
        .buttonStyle(CustomFocusButtonStyle(isFocused: isFocused))
        .focused($isFocused)
    }
}

struct CustomFocusButtonStyle: ButtonStyle {
    let isFocused: Bool
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .background(Color(DesignTokens.colorButtonBackground))
            .foregroundColor(Color(DesignTokens.colorButtonText))
            .cornerRadius(DesignTokens.radius100)
            .overlay(
                RoundedRectangle(cornerRadius: DesignTokens.radius100)
                    .stroke(
                        isFocused ? Color(DesignTokens.colorFocus) : Color(DesignTokens.colorButtonBorder),
                        lineWidth: isFocused ? DesignTokens.borderWidth200 : DesignTokens.borderWidth100
                    )
            )
    }
}
```

### Accessibility Considerations

**iOS Accessibility Features**:
- VoiceOver: Screen reader for blind and low-vision users
- Switch Control: Alternative input method for motor impairments
- Full Keyboard Access: Keyboard navigation for external keyboards
- Reduce Motion: Respects user preference for reduced animations
- Increase Contrast: Automatically adjusts focus indicator contrast

**Best Practices**:
- Use `.focusable()` modifier in SwiftUI to enable system focus
- Override `canBecomeFocused` in UIKit to enable focus
- Test with VoiceOver enabled (Settings > Accessibility > VoiceOver)
- Test with Full Keyboard Access (Settings > Accessibility > Keyboards)
- Respect Reduce Motion and Increase Contrast settings
- Provide accessibility labels for all focusable elements

### Common Patterns

#### List Item Focus

```swift
import SwiftUI

struct ListItemView: View {
    let title: String
    let subtitle: String
    
    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(title)
                    .font(.headline)
                Text(subtitle)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            Spacer()
        }
        .padding(DesignTokens.space200)
        .background(Color(DesignTokens.colorCardBackground))
        .cornerRadius(DesignTokens.radius100)
        .focusable() // System provides focus indicator
    }
}
```

#### Text Field Focus

```swift
import SwiftUI

struct CustomTextField: View {
    @Binding var text: String
    let placeholder: String
    @FocusState private var isFocused: Bool
    
    var body: some View {
        TextField(placeholder, text: $text)
            .padding(DesignTokens.space150)
            .background(Color(DesignTokens.colorInputBackground))
            .cornerRadius(DesignTokens.radius050)
            .overlay(
                RoundedRectangle(cornerRadius: DesignTokens.radius050)
                    .stroke(
                        isFocused ? Color(DesignTokens.colorFocus) : Color(DesignTokens.colorInputBorder),
                        lineWidth: isFocused ? DesignTokens.borderWidth200 : DesignTokens.borderWidth100
                    )
            )
            .focused($isFocused)
    }
}
```

---

## Android Focus Patterns

### Platform Characteristics

**Interaction Model**: Touch-first with D-pad/keyboard support (TV, tablets)
**Accessibility Framework**: Material Design accessibility system
**Native Support**: Ripple effects and elevation changes
**Custom Implementation**: Ripple + elevation for most use cases

### Recommended Pattern: Ripple Effects and Elevation

Android uses ripple effects (touch feedback) and elevation changes (shadow depth) to indicate focus and interaction states. This approach aligns with Material Design principles and provides clear visual feedback without custom border styling.

**Why ripple + elevation**:
- Consistent with Material Design and Android platform conventions
- Provides both visual (ripple animation) and depth (elevation) feedback
- Works seamlessly with TalkBack screen reader
- Automatically adapts to different input methods (touch, D-pad, keyboard)
- Respects user's accessibility preferences

**When to use border-based focus**:
- Custom components that don't support ripple effects
- TV applications where elevation is less effective
- Brand requirements for specific focus styling

### Code Examples

#### Jetpack Compose Button with Ripple

```kotlin
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun PrimaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Button(
        onClick = onClick,
        modifier = modifier,
        border = BorderStroke(
            width = DesignTokens.borderWidth100.dp,
            color = DesignTokens.colorButtonBorder
        ),
        elevation = ButtonDefaults.buttonElevation(
            defaultElevation = 2.dp,
            pressedElevation = 8.dp,
            focusedElevation = 4.dp // Elevation change on focus
        )
    ) {
        Text(
            text = text,
            modifier = Modifier.padding(
                horizontal = DesignTokens.space300.dp,
                vertical = DesignTokens.space200.dp
            )
        )
    }
    // Ripple effect provided automatically by Material3 Button
}
```

#### Jetpack Compose Card with Focus Indication

```kotlin
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.focusable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.unit.dp

@Composable
fun FocusableCard(
    title: String,
    subtitle: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    var isFocused by remember { mutableStateOf(false) }
    
    Card(
        onClick = onClick,
        modifier = modifier
            .focusable()
            .onFocusChanged { isFocused = it.isFocused },
        border = BorderStroke(
            width = if (isFocused) DesignTokens.borderWidth200.dp else DesignTokens.borderWidth100.dp,
            color = if (isFocused) DesignTokens.colorFocus else DesignTokens.colorCardBorder
        ),
        elevation = CardDefaults.cardElevation(
            defaultElevation = 2.dp,
            pressedElevation = 8.dp,
            focusedElevation = 4.dp
        )
    ) {
        Column(
            modifier = Modifier.padding(DesignTokens.space300.dp)
        ) {
            Text(text = title)
            Text(text = subtitle)
        }
    }
}
```

#### Android View System with Ripple

```kotlin
import android.content.Context
import android.util.AttributeSet
import android.view.View
import androidx.appcompat.widget.AppCompatButton
import com.google.android.material.button.MaterialButton

class PrimaryButton @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : MaterialButton(context, attrs, defStyleAttr) {
    
    init {
        // Configure button appearance
        strokeWidth = DesignTokens.borderWidth100.dp.toInt()
        strokeColor = ColorStateList.valueOf(DesignTokens.colorButtonBorder)
        cornerRadius = DesignTokens.radius100.dp.toInt()
        
        setPadding(
            DesignTokens.space300.dp.toInt(),
            DesignTokens.space200.dp.toInt(),
            DesignTokens.space300.dp.toInt(),
            DesignTokens.space200.dp.toInt()
        )
        
        // Ripple effect provided automatically by MaterialButton
        // Elevation changes on focus/press handled by Material components
        
        // Enable focusability for D-pad/keyboard navigation
        isFocusable = true
        isFocusableInTouchMode = false // Only focusable via D-pad/keyboard
    }
    
    override fun onFocusChanged(focused: Boolean, direction: Int, previouslyFocusedRect: Rect?) {
        super.onFocusChanged(focused, direction, previouslyFocusedRect)
        
        // Optional: Custom focus behavior
        if (focused) {
            elevation = 4.dp
            strokeWidth = DesignTokens.borderWidth200.dp.toInt()
        } else {
            elevation = 2.dp
            strokeWidth = DesignTokens.borderWidth100.dp.toInt()
        }
    }
}
```

#### Custom Focus Indicator for TV

```kotlin
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.focusable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Card
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.unit.dp

@Composable
fun TVFocusableCard(
    title: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    var isFocused by remember { mutableStateOf(false) }
    
    Card(
        onClick = onClick,
        modifier = modifier
            .focusable()
            .onFocusChanged { isFocused = it.isFocused },
        border = BorderStroke(
            // Thicker border for TV viewing distance
            width = if (isFocused) DesignTokens.borderWidth400.dp else DesignTokens.borderWidth100.dp,
            color = if (isFocused) DesignTokens.colorFocus else DesignTokens.colorCardBorder
        )
    ) {
        Box(
            modifier = Modifier.padding(DesignTokens.space400.dp)
        ) {
            Text(text = title)
        }
    }
}
```

### Accessibility Considerations

**Android Accessibility Features**:
- TalkBack: Screen reader for blind and low-vision users
- Switch Access: Alternative input method for motor impairments
- D-pad Navigation: Hardware button navigation (TV, some tablets)
- External Keyboard: Keyboard navigation support
- High Contrast: Automatically adjusts colors for better visibility

**Best Practices**:
- Use `.focusable()` modifier in Compose to enable focus
- Set `isFocusable = true` in View system for D-pad/keyboard navigation
- Provide content descriptions for all focusable elements
- Test with TalkBack enabled (Settings > Accessibility > TalkBack)
- Test with D-pad navigation (Android TV or emulator with D-pad)
- Ensure focus indicators are visible at TV viewing distances (use borderHeavy for TV)
- Respect user's High Contrast and Large Text settings

### Common Patterns

#### Text Field Focus

```kotlin
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.unit.dp

@Composable
fun CustomTextField(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    modifier: Modifier = Modifier
) {
    var isFocused by remember { mutableStateOf(false) }
    
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        placeholder = { Text(placeholder) },
        modifier = modifier.onFocusChanged { isFocused = it.isFocused },
        colors = TextFieldDefaults.outlinedTextFieldColors(
            focusedBorderColor = DesignTokens.colorFocus,
            unfocusedBorderColor = DesignTokens.colorInputBorder
        ),
        // Border width changes on focus
        // Note: OutlinedTextField doesn't directly support border width changes
        // Use custom implementation if needed
    )
}
```

#### List Item Focus

```kotlin
import androidx.compose.foundation.clickable
import androidx.compose.foundation.focusable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Card
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.unit.dp

@Composable
fun ListItem(
    title: String,
    subtitle: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    var isFocused by remember { mutableStateOf(false) }
    
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .focusable()
            .onFocusChanged { isFocused = it.isFocused },
        elevation = CardDefaults.cardElevation(
            defaultElevation = if (isFocused) 4.dp else 2.dp
        )
    ) {
        Column(
            modifier = Modifier.padding(DesignTokens.space200.dp)
        ) {
            Text(text = title)
            Text(text = subtitle)
        }
    }
}
```

---

## Cross-Platform Consistency

### Visual Weight Consistency

While implementation patterns differ across platforms, the visual weight of focus indicators should remain consistent:

| Platform | Implementation | Visual Weight | Border Width Token |
|----------|---------------|---------------|-------------------|
| Web | Outline | 2px | borderEmphasis |
| iOS | System focus ring | ~2pt | (system-provided) |
| Android | Ripple + elevation | 2dp border (optional) | borderEmphasis |
| Android TV | Border | 4dp border | borderHeavy |

### When to Use Each Border Width Token

**borderDefault (1px/pt/dp)**:
- Default state borders (not focus indicators)
- Subtle separation between elements
- Card borders, input borders at rest

**borderEmphasis (2px/pt/dp)**:
- Web focus indicators (outline-width)
- Android custom focus borders (phone/tablet)
- Emphasized state borders

**borderHeavy (4px/pt/dp)**:
- Android TV focus indicators (viewing distance)
- Strong emphasis borders (rare)
- High-contrast mode focus indicators

---

## Accessibility Resources

### Web Accessibility

- [WCAG 2.1 Focus Visible (2.4.7)](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html) - Understanding focus indicator requirements
- [WCAG 2.1 Focus Appearance (2.4.11)](https://www.w3.org/WAI/WCAG21/Understanding/focus-appearance-minimum.html) - Minimum focus indicator appearance
- [MDN: :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible) - CSS pseudo-class for keyboard focus
- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard/) - Keyboard navigation best practices

### iOS Accessibility

- [Apple Human Interface Guidelines: Focus and Selection](https://developer.apple.com/design/human-interface-guidelines/focus-and-selection) - iOS focus patterns
- [Apple Accessibility Documentation](https://developer.apple.com/accessibility/) - iOS accessibility features
- [SwiftUI Accessibility](https://developer.apple.com/documentation/swiftui/view-accessibility) - SwiftUI accessibility modifiers
- [UIKit Accessibility](https://developer.apple.com/documentation/uikit/accessibility_for_uikit) - UIKit accessibility APIs

### Android Accessibility

- [Material Design: Accessibility](https://m3.material.io/foundations/accessible-design/overview) - Material Design accessibility guidelines
- [Android Accessibility Documentation](https://developer.android.com/guide/topics/ui/accessibility) - Android accessibility features
- [Jetpack Compose Accessibility](https://developer.android.com/jetpack/compose/accessibility) - Compose accessibility APIs
- [Android TV Focus](https://developer.android.com/training/tv/start/navigation) - TV navigation and focus patterns

---

## Summary

Focus indicators are essential for accessibility but require platform-specific implementation approaches:

**Web**: Use `outline` with `borderEmphasis` width (2px) for WCAG-compliant focus indicators
**iOS**: Rely on system-provided focus indicators that respect user accessibility preferences
**Android**: Use ripple effects and elevation changes, with optional border emphasis for custom components
**Android TV**: Use `borderHeavy` (4px) for focus indicators visible at TV viewing distances

The border width token system provides the visual weight values needed for custom focus indicators while respecting platform-native patterns that provide better accessibility and user experience.

---

*This guide provides platform-appropriate focus indicator patterns that balance accessibility requirements, platform conventions, and visual consistency across the DesignerPunk design system.*
