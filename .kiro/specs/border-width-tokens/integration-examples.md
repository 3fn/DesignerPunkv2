# Border Width Token Integration Examples

**Date**: October 23, 2025
**Purpose**: Provide practical integration examples for border width tokens across platforms
**Organization**: spec-guide
**Scope**: border-width-tokens

---

## Related Guides

- [Usage Patterns Guide](./usage-patterns-guide.md) - Explains when to use each semantic border width token
- [Focus Indicator Guide](./focus-indicator-guide.md) - Explains platform-native focus patterns using border width tokens
- [Border Width Design Document](./design.md) - Explains architectural decisions and token structure

---

## Introduction

This guide provides practical examples of integrating border width tokens into components across web, iOS, and Android platforms. It demonstrates composition patterns with color tokens, component implementation examples, and migration strategies from hardcoded values to tokens.

Border width tokens follow a compositional architecture where border width is separated from border color and border style. This allows flexible composition while maintaining consistency across platforms.

---

## Border Width + Color Composition Patterns

### Compositional Architecture

Border width tokens are designed to compose with semantic color tokens, not include color properties directly. This separation of concerns allows the same border width to be used with different colors in different contexts.

**Pattern**: `border: [width] [style] [color]`

### Web (CSS) Composition

```css
/* Composition pattern: border width + style + color */
.card {
  border: var(--border-width-default) solid var(--color-card-border);
}

.card--selected {
  border: var(--border-width-emphasis) solid var(--color-primary);
}

.input {
  border: var(--border-width-default) solid var(--color-input-border);
}

.input:focus {
  border: var(--border-width-emphasis) solid var(--color-focus);
}

.button {
  border: var(--border-width-default) solid var(--color-button-border);
}

.button--primary {
  border: var(--border-width-emphasis) solid var(--color-primary);
}

/* Divider pattern: border-bottom composition */
.divider {
  border-bottom: var(--border-width-default) solid var(--color-divider);
}

/* Error state composition */
.input--error {
  border: var(--border-width-emphasis) solid var(--color-error);
}
```

### iOS (SwiftUI) Composition

```swift
// Composition pattern: overlay with stroke
struct CardView: View {
    var body: some View {
        VStack {
            // Card content
        }
        .overlay(
            RoundedRectangle(cornerRadius: DesignTokens.radiusDefault)
                .stroke(DesignTokens.colorCardBorder, lineWidth: DesignTokens.borderDefault)
        )
    }
}

// Selected state composition
struct SelectedCardView: View {
    var body: some View {
        VStack {
            // Card content
        }
        .overlay(
            RoundedRectangle(cornerRadius: DesignTokens.radiusDefault)
                .stroke(DesignTokens.colorPrimary, lineWidth: DesignTokens.borderEmphasis)
        )
    }
}

// Input field composition
struct InputField: View {
    @FocusState private var isFocused: Bool
    
    var body: some View {
        TextField("Placeholder", text: .constant(""))
            .padding()
            .overlay(
                RoundedRectangle(cornerRadius: DesignTokens.radiusDefault)
                    .stroke(
                        isFocused ? DesignTokens.colorFocus : DesignTokens.colorInputBorder,
                        lineWidth: isFocused ? DesignTokens.borderEmphasis : DesignTokens.borderDefault
                    )
            )
            .focused($isFocused)
    }
}

// Button composition
struct PrimaryButton: View {
    var body: some View {
        Text("Button")
            .padding()
            .overlay(
                RoundedRectangle(cornerRadius: DesignTokens.radiusDefault)
                    .stroke(DesignTokens.colorPrimary, lineWidth: DesignTokens.borderEmphasis)
            )
    }
}

// Divider composition
struct DividerView: View {
    var body: some View {
        Rectangle()
            .fill(DesignTokens.colorDivider)
            .frame(height: DesignTokens.borderDefault)
    }
}
```

### Android (Jetpack Compose) Composition

```kotlin
// Composition pattern: border modifier
@Composable
fun CardView() {
    Box(
        modifier = Modifier
            .border(
                width = DesignTokens.borderDefault,
                color = DesignTokens.colorCardBorder,
                shape = RoundedCornerShape(DesignTokens.radiusDefault)
            )
    ) {
        // Card content
    }
}

// Selected state composition
@Composable
fun SelectedCardView() {
    Box(
        modifier = Modifier
            .border(
                width = DesignTokens.borderEmphasis,
                color = DesignTokens.colorPrimary,
                shape = RoundedCornerShape(DesignTokens.radiusDefault)
            )
    ) {
        // Card content
    }
}

// Input field composition
@Composable
fun InputField() {
    var isFocused by remember { mutableStateOf(false) }
    
    TextField(
        value = "",
        onValueChange = {},
        modifier = Modifier
            .onFocusChanged { isFocused = it.isFocused }
            .border(
                width = if (isFocused) DesignTokens.borderEmphasis else DesignTokens.borderDefault,
                color = if (isFocused) DesignTokens.colorFocus else DesignTokens.colorInputBorder,
                shape = RoundedCornerShape(DesignTokens.radiusDefault)
            )
    )
}

// Button composition
@Composable
fun PrimaryButton() {
    Button(
        onClick = {},
        modifier = Modifier
            .border(
                width = DesignTokens.borderEmphasis,
                color = DesignTokens.colorPrimary,
                shape = RoundedCornerShape(DesignTokens.radiusDefault)
            )
    ) {
        Text("Button")
    }
}

// Divider composition
@Composable
fun DividerView() {
    Divider(
        thickness = DesignTokens.borderDefault,
        color = DesignTokens.colorDivider
    )
}
```

---

## Component Implementation Examples

### Card Component

Cards use `borderDefault` for standard borders and `borderEmphasis` for selected states.

#### Web Implementation

```css
/* Card base styles */
.card {
  border: var(--border-width-default) solid var(--color-card-border);
  border-radius: var(--radius-default);
  padding: var(--space-200);
  background: var(--color-card-background);
}

/* Card hover state */
.card:hover {
  border-color: var(--color-card-border-hover);
}

/* Card selected state */
.card--selected {
  border-width: var(--border-width-emphasis);
  border-color: var(--color-primary);
}

/* Card error state */
.card--error {
  border-width: var(--border-width-emphasis);
  border-color: var(--color-error);
}
```

```jsx
// React component example
function Card({ selected, error, children }) {
  const className = [
    'card',
    selected && 'card--selected',
    error && 'card--error'
  ].filter(Boolean).join(' ');
  
  return (
    <div className={className}>
      {children}
    </div>
  );
}
```

#### iOS Implementation

```swift
struct Card<Content: View>: View {
    let content: Content
    let isSelected: Bool
    let isError: Bool
    
    init(
        isSelected: Bool = false,
        isError: Bool = false,
        @ViewBuilder content: () -> Content
    ) {
        self.content = content()
        self.isSelected = isSelected
        self.isError = isError
    }
    
    var body: some View {
        content
            .padding(DesignTokens.space200)
            .background(DesignTokens.colorCardBackground)
            .overlay(
                RoundedRectangle(cornerRadius: DesignTokens.radiusDefault)
                    .stroke(borderColor, lineWidth: borderWidth)
            )
    }
    
    private var borderWidth: CGFloat {
        isSelected || isError ? DesignTokens.borderEmphasis : DesignTokens.borderDefault
    }
    
    private var borderColor: Color {
        if isError {
            return DesignTokens.colorError
        } else if isSelected {
            return DesignTokens.colorPrimary
        } else {
            return DesignTokens.colorCardBorder
        }
    }
}

// Usage
Card(isSelected: true) {
    Text("Selected Card")
}
```

#### Android Implementation

```kotlin
@Composable
fun Card(
    isSelected: Boolean = false,
    isError: Boolean = false,
    content: @Composable () -> Unit
) {
    val borderWidth = if (isSelected || isError) {
        DesignTokens.borderEmphasis
    } else {
        DesignTokens.borderDefault
    }
    
    val borderColor = when {
        isError -> DesignTokens.colorError
        isSelected -> DesignTokens.colorPrimary
        else -> DesignTokens.colorCardBorder
    }
    
    Box(
        modifier = Modifier
            .background(
                color = DesignTokens.colorCardBackground,
                shape = RoundedCornerShape(DesignTokens.radiusDefault)
            )
            .border(
                width = borderWidth,
                color = borderColor,
                shape = RoundedCornerShape(DesignTokens.radiusDefault)
            )
            .padding(DesignTokens.space200)
    ) {
        content()
    }
}

// Usage
Card(isSelected = true) {
    Text("Selected Card")
}
```

### Input Component

Input fields use `borderDefault` at rest and `borderEmphasis` on focus.

#### Web Implementation

```css
/* Input base styles */
.input {
  border: var(--border-width-default) solid var(--color-input-border);
  border-radius: var(--radius-default);
  padding: var(--space-100) var(--space-150);
  font-size: var(--font-size-body);
  line-height: var(--line-height-body);
}

/* Input focus state */
.input:focus {
  border-width: var(--border-width-emphasis);
  border-color: var(--color-focus);
  outline: none;
}

/* Input error state */
.input--error {
  border-width: var(--border-width-emphasis);
  border-color: var(--color-error);
}

/* Input disabled state */
.input:disabled {
  border-color: var(--color-input-border-disabled);
  background: var(--color-input-background-disabled);
}
```

```jsx
// React component example
function Input({ error, ...props }) {
  const className = ['input', error && 'input--error']
    .filter(Boolean)
    .join(' ');
  
  return <input className={className} {...props} />;
}
```

#### iOS Implementation

```swift
struct Input: View {
    @Binding var text: String
    @FocusState private var isFocused: Bool
    let isError: Bool
    let placeholder: String
    
    init(
        text: Binding<String>,
        placeholder: String = "",
        isError: Bool = false
    ) {
        self._text = text
        self.placeholder = placeholder
        self.isError = isError
    }
    
    var body: some View {
        TextField(placeholder, text: $text)
            .padding(.horizontal, DesignTokens.space150)
            .padding(.vertical, DesignTokens.space100)
            .font(.system(size: DesignTokens.fontSizeBody))
            .overlay(
                RoundedRectangle(cornerRadius: DesignTokens.radiusDefault)
                    .stroke(borderColor, lineWidth: borderWidth)
            )
            .focused($isFocused)
    }
    
    private var borderWidth: CGFloat {
        isFocused || isError ? DesignTokens.borderEmphasis : DesignTokens.borderDefault
    }
    
    private var borderColor: Color {
        if isError {
            return DesignTokens.colorError
        } else if isFocused {
            return DesignTokens.colorFocus
        } else {
            return DesignTokens.colorInputBorder
        }
    }
}

// Usage
@State private var text = ""
Input(text: $text, placeholder: "Enter text")
```

#### Android Implementation

```kotlin
@Composable
fun Input(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String = "",
    isError: Boolean = false
) {
    var isFocused by remember { mutableStateOf(false) }
    
    val borderWidth = if (isFocused || isError) {
        DesignTokens.borderEmphasis
    } else {
        DesignTokens.borderDefault
    }
    
    val borderColor = when {
        isError -> DesignTokens.colorError
        isFocused -> DesignTokens.colorFocus
        else -> DesignTokens.colorInputBorder
    }
    
    TextField(
        value = value,
        onValueChange = onValueChange,
        placeholder = { Text(placeholder) },
        modifier = Modifier
            .onFocusChanged { isFocused = it.isFocused }
            .border(
                width = borderWidth,
                color = borderColor,
                shape = RoundedCornerShape(DesignTokens.radiusDefault)
            ),
        textStyle = TextStyle(fontSize = DesignTokens.fontSizeBody)
    )
}

// Usage
var text by remember { mutableStateOf("") }
Input(
    value = text,
    onValueChange = { text = it },
    placeholder = "Enter text"
)
```

### Button Component

Buttons use `borderDefault` for secondary buttons and `borderEmphasis` for primary buttons.

#### Web Implementation

```css
/* Button base styles */
.button {
  border: var(--border-width-default) solid var(--color-button-border);
  border-radius: var(--radius-default);
  padding: var(--space-100) var(--space-200);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
}

/* Primary button */
.button--primary {
  border-width: var(--border-width-emphasis);
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: var(--color-on-primary);
}

/* Secondary button */
.button--secondary {
  border-color: var(--color-button-border);
  background: transparent;
  color: var(--color-primary);
}

/* Button hover state */
.button:hover {
  border-color: var(--color-button-border-hover);
}

/* Button active state */
.button:active {
  border-width: var(--border-width-emphasis);
}

/* Button disabled state */
.button:disabled {
  border-color: var(--color-button-border-disabled);
  cursor: not-allowed;
}
```

```jsx
// React component example
function Button({ variant = 'secondary', children, ...props }) {
  const className = ['button', `button--${variant}`].join(' ');
  
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}
```

#### iOS Implementation

```swift
struct Button: View {
    let title: String
    let variant: ButtonVariant
    let action: () -> Void
    
    enum ButtonVariant {
        case primary
        case secondary
    }
    
    init(
        _ title: String,
        variant: ButtonVariant = .secondary,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.variant = variant
        self.action = action
    }
    
    var body: some View {
        SwiftUI.Button(action: action) {
            Text(title)
                .font(.system(size: DesignTokens.fontSizeBody, weight: .medium))
                .foregroundColor(textColor)
                .padding(.horizontal, DesignTokens.space200)
                .padding(.vertical, DesignTokens.space100)
                .background(backgroundColor)
                .overlay(
                    RoundedRectangle(cornerRadius: DesignTokens.radiusDefault)
                        .stroke(borderColor, lineWidth: borderWidth)
                )
        }
    }
    
    private var borderWidth: CGFloat {
        variant == .primary ? DesignTokens.borderEmphasis : DesignTokens.borderDefault
    }
    
    private var borderColor: Color {
        variant == .primary ? DesignTokens.colorPrimary : DesignTokens.colorButtonBorder
    }
    
    private var backgroundColor: Color {
        variant == .primary ? DesignTokens.colorPrimary : .clear
    }
    
    private var textColor: Color {
        variant == .primary ? DesignTokens.colorOnPrimary : DesignTokens.colorPrimary
    }
}

// Usage
Button("Primary", variant: .primary) {
    print("Primary button tapped")
}
```

#### Android Implementation

```kotlin
@Composable
fun Button(
    text: String,
    variant: ButtonVariant = ButtonVariant.Secondary,
    onClick: () -> Unit
) {
    val borderWidth = when (variant) {
        ButtonVariant.Primary -> DesignTokens.borderEmphasis
        ButtonVariant.Secondary -> DesignTokens.borderDefault
    }
    
    val borderColor = when (variant) {
        ButtonVariant.Primary -> DesignTokens.colorPrimary
        ButtonVariant.Secondary -> DesignTokens.colorButtonBorder
    }
    
    val backgroundColor = when (variant) {
        ButtonVariant.Primary -> DesignTokens.colorPrimary
        ButtonVariant.Secondary -> Color.Transparent
    }
    
    val textColor = when (variant) {
        ButtonVariant.Primary -> DesignTokens.colorOnPrimary
        ButtonVariant.Secondary -> DesignTokens.colorPrimary
    }
    
    androidx.compose.material3.Button(
        onClick = onClick,
        modifier = Modifier
            .border(
                width = borderWidth,
                color = borderColor,
                shape = RoundedCornerShape(DesignTokens.radiusDefault)
            ),
        colors = ButtonDefaults.buttonColors(
            containerColor = backgroundColor,
            contentColor = textColor
        )
    ) {
        Text(
            text = text,
            fontSize = DesignTokens.fontSizeBody,
            fontWeight = FontWeight.Medium
        )
    }
}

enum class ButtonVariant {
    Primary,
    Secondary
}

// Usage
Button(
    text = "Primary",
    variant = ButtonVariant.Primary,
    onClick = { println("Primary button clicked") }
)
```

---

## Migration Examples

### Migrating from Hardcoded Values

#### Before: Hardcoded Border Widths

```css
/* Web - Before */
.card {
  border: 1px solid #e0e0e0;
}

.card--selected {
  border: 2px solid #0066cc;
}

.input {
  border: 1px solid #cccccc;
}

.input:focus {
  border: 2px solid #0066cc;
}
```

```swift
// iOS - Before
struct CardView: View {
    var body: some View {
        VStack {
            // Content
        }
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(Color(hex: "e0e0e0"), lineWidth: 1)
        )
    }
}
```

```kotlin
// Android - Before
@Composable
fun CardView() {
    Box(
        modifier = Modifier
            .border(
                width = 1.dp,
                color = Color(0xFFE0E0E0),
                shape = RoundedCornerShape(8.dp)
            )
    ) {
        // Content
    }
}
```

#### After: Using Border Width Tokens

```css
/* Web - After */
.card {
  border: var(--border-width-default) solid var(--color-card-border);
}

.card--selected {
  border: var(--border-width-emphasis) solid var(--color-primary);
}

.input {
  border: var(--border-width-default) solid var(--color-input-border);
}

.input:focus {
  border: var(--border-width-emphasis) solid var(--color-focus);
}
```

```swift
// iOS - After
struct CardView: View {
    var body: some View {
        VStack {
            // Content
        }
        .overlay(
            RoundedRectangle(cornerRadius: DesignTokens.radiusDefault)
                .stroke(DesignTokens.colorCardBorder, lineWidth: DesignTokens.borderDefault)
        )
    }
}
```

```kotlin
// Android - After
@Composable
fun CardView() {
    Box(
        modifier = Modifier
            .border(
                width = DesignTokens.borderDefault,
                color = DesignTokens.colorCardBorder,
                shape = RoundedCornerShape(DesignTokens.radiusDefault)
            )
    ) {
        // Content
    }
}
```

### Migration Benefits

**Consistency**: All components use the same border width values across platforms

**Maintainability**: Changing border widths requires updating tokens, not every component

**Semantic Clarity**: `borderDefault` and `borderEmphasis` communicate intent better than `1px` and `2px`

**Cross-Platform Unity**: Same semantic tokens generate platform-appropriate values

### Migration Strategy

1. **Audit Current Usage**: Identify all hardcoded border width values in your codebase
2. **Map to Tokens**: Determine which semantic token matches each usage (borderDefault, borderEmphasis, borderHeavy)
3. **Replace Incrementally**: Update components one at a time, testing after each change
4. **Validate Consistency**: Ensure visual appearance matches original design
5. **Document Patterns**: Create component-specific guidelines for border width token usage

---

## Cross-Platform Consistency Patterns

### Consistent Visual Weight

Border width tokens ensure consistent visual weight across platforms:

- **borderDefault (1)**: Standard borders look the same on web (1px), iOS (1pt), and Android (1dp)
- **borderEmphasis (2)**: Emphasized borders maintain 2x visual weight across all platforms
- **borderHeavy (4)**: Heavy borders maintain 4x visual weight across all platforms

### Platform-Specific Rendering

While token values are consistent, platform rendering may differ:

- **Web**: Subpixel rendering, browser differences, zoom levels
- **iOS**: @1x/@2x/@3x scaling, retina displays
- **Android**: 6 density buckets (ldpi, mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)

Border width tokens provide mathematical consistency while respecting platform-specific rendering characteristics.

### Testing Cross-Platform Consistency

```typescript
// Test that border widths maintain mathematical relationships across platforms
describe('Cross-Platform Border Width Consistency', () => {
  test('borderEmphasis is 2x borderDefault on all platforms', () => {
    // Web
    expect(webTokens.borderEmphasis).toBe(webTokens.borderDefault * 2);
    
    // iOS
    expect(iosTokens.borderEmphasis).toBe(iosTokens.borderDefault * 2);
    
    // Android
    expect(androidTokens.borderEmphasis).toBe(androidTokens.borderDefault * 2);
  });
  
  test('borderHeavy is 4x borderDefault on all platforms', () => {
    // Web
    expect(webTokens.borderHeavy).toBe(webTokens.borderDefault * 4);
    
    // iOS
    expect(iosTokens.borderHeavy).toBe(iosTokens.borderDefault * 4);
    
    // Android
    expect(androidTokens.borderHeavy).toBe(androidTokens.borderDefault * 4);
  });
});
```

---

## Best Practices

### Composition Over Inclusion

✅ **DO**: Compose border width with color tokens
```css
border: var(--border-width-default) solid var(--color-card-border);
```

❌ **DON'T**: Create combined border tokens
```css
/* Don't create tokens like this */
--border-card: 1px solid #e0e0e0;
```

### Semantic Over Primitive

✅ **DO**: Use semantic tokens in components
```css
border-width: var(--border-width-default);
```

❌ **DON'T**: Use primitive tokens directly
```css
border-width: var(--border-width-100);
```

### State-Based Border Width

✅ **DO**: Change border width for state changes
```css
.input {
  border-width: var(--border-width-default);
}

.input:focus {
  border-width: var(--border-width-emphasis);
}
```

❌ **DON'T**: Use same border width for all states
```css
.input,
.input:focus {
  border-width: var(--border-width-default);
}
```

### Platform-Appropriate Patterns

✅ **DO**: Use platform-native focus patterns (see Focus Indicator Guide)

❌ **DON'T**: Force web patterns on native platforms

---

## Related Documentation

- [Usage Patterns Guide](./usage-patterns-guide.md) - When to use each semantic border width token
- [Focus Indicator Guide](./focus-indicator-guide.md) - Platform-native focus patterns
- [Border Width Design Document](./design.md) - Architectural decisions and token structure
- [Border Width Requirements](./requirements.md) - System requirements and acceptance criteria

---

*This integration guide provides practical examples for using border width tokens across platforms, demonstrating composition patterns, component implementations, and migration strategies.*
