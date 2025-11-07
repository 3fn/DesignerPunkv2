# Platform-Specific Component Sizing Guide

**Date**: November 6, 2025
**Purpose**: Document platform-specific syntax for content-driven component sizing with mathematical constraints
**Organization**: spec-guide
**Scope**: responsive-layout-system

---

## Related Guides

- [Semantic Grid vs Spacing Guide](./semantic-grid-vs-spacing-guide.md) - Explains when to use grid tokens vs spacing tokens
- [Design Document](./design.md) - Complete responsive layout system architecture
- [Requirements Document](./requirements.md) - System requirements and acceptance criteria

---

## Overview

This guide demonstrates how to implement content-driven components with mathematical min/max constraints across web, iOS, and Android platforms. All platforms use the same mathematical relationships expressed through platform-native syntax, following True Native Architecture principles.

**Key Principle**: Mathematical relationships are universal, implementation syntax is platform-specific.

---

## True Native Architecture Principles

### Universal Mathematical Foundation

All platforms share the same mathematical constraints:

```
Component Width Constraints:
- Minimum: space800 (256px)
- Maximum: space1200 (384px)
- Behavior: Adapts within constraints based on content and available space
```

### Platform-Specific Expression

Each platform expresses these constraints using its native patterns:

- **Web**: CSS custom properties with Lit Web Components
- **iOS**: SwiftUI frame modifiers with CGFloat constants
- **Android**: Jetpack Compose modifiers with dp units

### Content-Driven Behavior

Components adapt to content and available space within mathematical constraints:

- Components grow/shrink based on content
- Constraints prevent components from becoming too small or too large
- Platform-native layout systems handle the adaptation

---

## Web Platform (Lit Web Components + CSS)

### Basic Component with Mathematical Constraints

**CSS Custom Properties Approach**:

```css
/* Component styles using CSS custom properties */
.text-input {
  /* Mathematical constraints from spacing tokens */
  min-width: var(--space-800);  /* 256px */
  max-width: var(--space-1200); /* 384px */
  
  /* Content-driven behavior */
  width: 100%; /* Adapts within constraints */
  
  /* Additional styling */
  padding: var(--space-200);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-100);
}
```

**Lit Web Component Implementation**:

```typescript
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('text-input')
export class TextInput extends LitElement {
  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = '';
  
  static styles = css`
    :host {
      display: block;
      
      /* Mathematical constraints */
      min-width: var(--space-800);  /* 256px */
      max-width: var(--space-1200); /* 384px */
      width: 100%;
    }
    
    input {
      width: 100%;
      padding: var(--space-200);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-100);
      font-size: var(--font-size-100);
    }
  `;
  
  render() {
    return html`
      <input
        type="text"
        .value=${this.value}
        placeholder=${this.placeholder}
        @input=${this._handleInput}
      />
    `;
  }
  
  private _handleInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value: this.value }
    }));
  }
}
```

### Component with Variant Sizing

**Component-Level Tokens**:

```typescript
// Component-level sizing tokens
const textInputSizing = {
  standard: {
    minWidth: 'var(--space-800)',   // 256px
    maxWidth: 'var(--space-1200)',  // 384px
  },
  narrow: {
    minWidth: 'var(--space-600)',   // 192px
    maxWidth: 'var(--space-800)',   // 256px
  },
  wide: {
    minWidth: 'var(--space-1000)',  // 320px
    maxWidth: 'var(--space-1600)',  // 512px
  }
};
```

**Lit Component with Variants**:

```typescript
@customElement('text-input')
export class TextInput extends LitElement {
  @property({ type: String }) variant: 'standard' | 'narrow' | 'wide' = 'standard';
  
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    /* Standard variant (default) */
    :host {
      min-width: var(--space-800);
      max-width: var(--space-1200);
    }
    
    /* Narrow variant */
    :host([variant="narrow"]) {
      min-width: var(--space-600);
      max-width: var(--space-800);
    }
    
    /* Wide variant */
    :host([variant="wide"]) {
      min-width: var(--space-1000);
      max-width: var(--space-1600);
    }
    
    input {
      width: 100%;
      padding: var(--space-200);
    }
  `;
  
  render() {
    return html`<input type="text" />`;
  }
}
```

### Web-Specific Grid Enhancement

**Component Within Responsive Grid**:

```html
<!-- Component maintains content-driven behavior within grid -->
<div class="grid-container">
  <div class="grid-item" style="grid-column: span 4;">
    <text-input placeholder="Email"></text-input>
  </div>
  <div class="grid-item" style="grid-column: span 4;">
    <text-input placeholder="Phone"></text-input>
  </div>
</div>
```

**CSS Grid Integration**:

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), 1fr);
  gap: var(--grid-gutter);
  margin-inline: var(--grid-margin);
}

/* Component adapts within grid cell constraints */
.grid-item text-input {
  /* Component's min/max constraints still apply */
  /* Grid provides additional layout context */
}
```

---

## iOS Platform (SwiftUI)

### Basic Component with Mathematical Constraints

**SwiftUI View with Frame Constraints**:

```swift
import SwiftUI

struct TextInput: View {
    @Binding var text: String
    var placeholder: String = ""
    
    var body: some View {
        TextField(placeholder, text: $text)
            .padding(space200)
            .background(Color.backgroundPrimary)
            .cornerRadius(radius100)
            .overlay(
                RoundedRectangle(cornerRadius: radius100)
                    .stroke(Color.borderPrimary, lineWidth: 1)
            )
            // Mathematical constraints from spacing tokens
            .frame(minWidth: space800, maxWidth: space1200)
    }
}

// Usage
struct ContentView: View {
    @State private var email = ""
    
    var body: some View {
        VStack(spacing: space300) {
            TextInput(text: $email, placeholder: "Email")
            // Component adapts within constraints
        }
        .padding(gridMarginNative) // Native grid spacing
    }
}
```

### Component with Variant Sizing

**Component-Level Sizing Tokens**:

```swift
// Component-level sizing tokens
enum TextInputSizing {
    static let standardMin: CGFloat = space800   // 256
    static let standardMax: CGFloat = space1200  // 384
    
    static let narrowMin: CGFloat = space600     // 192
    static let narrowMax: CGFloat = space800     // 256
    
    static let wideMin: CGFloat = space1000      // 320
    static let wideMax: CGFloat = space1600      // 512
}
```

**SwiftUI Component with Variants**:

```swift
struct TextInput: View {
    @Binding var text: String
    var placeholder: String = ""
    var variant: Variant = .standard
    
    enum Variant {
        case standard, narrow, wide
        
        var minWidth: CGFloat {
            switch self {
            case .standard: return TextInputSizing.standardMin
            case .narrow: return TextInputSizing.narrowMin
            case .wide: return TextInputSizing.wideMin
            }
        }
        
        var maxWidth: CGFloat {
            switch self {
            case .standard: return TextInputSizing.standardMax
            case .narrow: return TextInputSizing.narrowMax
            case .wide: return TextInputSizing.wideMax
            }
        }
    }
    
    var body: some View {
        TextField(placeholder, text: $text)
            .padding(space200)
            .background(Color.backgroundPrimary)
            .cornerRadius(radius100)
            .overlay(
                RoundedRectangle(cornerRadius: radius100)
                    .stroke(Color.borderPrimary, lineWidth: 1)
            )
            // Variant-specific constraints
            .frame(minWidth: variant.minWidth, maxWidth: variant.maxWidth)
    }
}

// Usage
struct ContentView: View {
    @State private var email = ""
    @State private var phone = ""
    
    var body: some View {
        VStack(spacing: space300) {
            TextInput(text: $email, placeholder: "Email", variant: .wide)
            TextInput(text: $phone, placeholder: "Phone", variant: .narrow)
        }
        .padding(gridMarginNative)
    }
}
```

### iOS Adaptive Layout with Native Grid Spacing

**LazyVGrid with Content-Driven Components**:

```swift
struct CardGrid: View {
    let items: [Item]
    
    var body: some View {
        ScrollView {
            LazyVGrid(
                columns: [
                    GridItem(.adaptive(minimum: 160), spacing: gridGutterNative)
                ],
                spacing: gridGutterNative
            ) {
                ForEach(items) { item in
                    CardView(item: item)
                        // Card has its own min/max constraints
                        .frame(minWidth: space600, maxWidth: space800)
                }
            }
            .padding(.horizontal, gridMarginNative)
        }
    }
}
```

**Key Points**:
- Uses `gridGutterNative` (20px) for consistent spacing
- Uses `gridMarginNative` (28px) for container margins
- Components maintain their own mathematical constraints
- SwiftUI's adaptive grid handles layout within constraints

---

## Android Platform (Jetpack Compose)

### Basic Component with Mathematical Constraints

**Compose Component with Modifier Constraints**:

```kotlin
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun TextInput(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String = "",
    modifier: Modifier = Modifier
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        placeholder = { Text(placeholder) },
        modifier = modifier
            // Mathematical constraints from spacing tokens
            .widthIn(min = space800.dp, max = space1200.dp)
            .fillMaxWidth()
    )
}

// Usage
@Composable
fun ContentScreen() {
    var email by remember { mutableStateOf("") }
    
    Column(
        modifier = Modifier
            .padding(gridMarginNative.dp)
            .fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(space300.dp)
    ) {
        TextInput(
            value = email,
            onValueChange = { email = it },
            placeholder = "Email"
        )
        // Component adapts within constraints
    }
}
```

### Component with Variant Sizing

**Component-Level Sizing Tokens**:

```kotlin
// Component-level sizing tokens
object TextInputSizing {
    val standardMin = space800  // 256
    val standardMax = space1200 // 384
    
    val narrowMin = space600    // 192
    val narrowMax = space800    // 256
    
    val wideMin = space1000     // 320
    val wideMax = space1600     // 512
}
```

**Compose Component with Variants**:

```kotlin
enum class TextInputVariant {
    STANDARD, NARROW, WIDE;
    
    val minWidth: Int
        get() = when (this) {
            STANDARD -> TextInputSizing.standardMin
            NARROW -> TextInputSizing.narrowMin
            WIDE -> TextInputSizing.wideMin
        }
    
    val maxWidth: Int
        get() = when (this) {
            STANDARD -> TextInputSizing.standardMax
            NARROW -> TextInputSizing.narrowMax
            WIDE -> TextInputSizing.wideMax
        }
}

@Composable
fun TextInput(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String = "",
    variant: TextInputVariant = TextInputVariant.STANDARD,
    modifier: Modifier = Modifier
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        placeholder = { Text(placeholder) },
        modifier = modifier
            // Variant-specific constraints
            .widthIn(min = variant.minWidth.dp, max = variant.maxWidth.dp)
            .fillMaxWidth()
    )
}

// Usage
@Composable
fun ContentScreen() {
    var email by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    
    Column(
        modifier = Modifier
            .padding(gridMarginNative.dp)
            .fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(space300.dp)
    ) {
        TextInput(
            value = email,
            onValueChange = { email = it },
            placeholder = "Email",
            variant = TextInputVariant.WIDE
        )
        TextInput(
            value = phone,
            onValueChange = { phone = it },
            placeholder = "Phone",
            variant = TextInputVariant.NARROW
        )
    }
}
```

### Android Adaptive Layout with Native Grid Spacing

**LazyVerticalGrid with Content-Driven Components**:

```kotlin
@Composable
fun CardGrid(items: List<Item>) {
    LazyVerticalGrid(
        columns = GridCells.Adaptive(minSize = 160.dp),
        verticalArrangement = Arrangement.spacedBy(gridGutterNative.dp),
        horizontalArrangement = Arrangement.spacedBy(gridGutterNative.dp),
        contentPadding = PaddingValues(gridMarginNative.dp)
    ) {
        items(items) { item ->
            CardView(
                item = item,
                modifier = Modifier
                    // Card has its own min/max constraints
                    .widthIn(min = space600.dp, max = space800.dp)
            )
        }
    }
}
```

**Key Points**:
- Uses `gridGutterNative` (20dp) for consistent spacing
- Uses `gridMarginNative` (28dp) for container padding
- Components maintain their own mathematical constraints
- Compose's adaptive grid handles layout within constraints

---

## Cross-Platform Comparison

### Same Component, Three Platforms

**Mathematical Constraints** (Universal):
```
minWidth: space800 (256)
maxWidth: space1200 (384)
padding: space200 (16)
```

**Web (Lit + CSS)**:
```typescript
static styles = css`
  :host {
    min-width: var(--space-800);
    max-width: var(--space-1200);
    width: 100%;
  }
  input {
    padding: var(--space-200);
  }
`;
```

**iOS (SwiftUI)**:
```swift
TextField(placeholder, text: $text)
    .padding(space200)
    .frame(minWidth: space800, maxWidth: space1200)
```

**Android (Compose)**:
```kotlin
OutlinedTextField(
    value = value,
    onValueChange = onValueChange,
    modifier = modifier
        .widthIn(min = space800.dp, max = space1200.dp)
        .padding(space200.dp)
)
```

### Key Observations

1. **Same Mathematical Relationships**: All platforms use space800, space1200, space200
2. **Platform-Native Syntax**: Each platform expresses constraints using its native patterns
3. **Content-Driven Behavior**: All platforms adapt within constraints
4. **True Native Architecture**: No runtime platform detection, build-time separation

---

## Component-Level Token Patterns

### When to Use Existing Spacing Tokens

**Start Simple** - Use existing spacing tokens directly:

```typescript
// Web
min-width: var(--space-800);
max-width: var(--space-1200);

// iOS
.frame(minWidth: space800, maxWidth: space1200)

// Android
.widthIn(min = space800.dp, max = space1200.dp)
```

### When to Create Component-Level Tokens

**Create Component Tokens** when you need multiple variants:

```typescript
// Component-level tokens for text input variants
const textInputSizing = {
  standard: { min: space800, max: space1200 },
  narrow: { min: space600, max: space800 },
  wide: { min: space1000, max: space1600 }
};
```

### When to Elevate to Semantic Tokens

**Elevate to Semantic** when pattern emerges across 3+ components:

```typescript
// Pattern discovered: many components use these widths
export const semanticSizing = {
  inputWidthStandard: { min: space800, max: space1200 },
  inputWidthNarrow: { min: space600, max: space800 },
  inputWidthWide: { min: space1000, max: space1600 }
};
```

---

## Best Practices

### Mathematical Constraints

✅ **DO**: Use existing spacing tokens for min/max constraints
```typescript
minWidth: space800, maxWidth: space1200
```

❌ **DON'T**: Use arbitrary pixel values
```typescript
minWidth: 250px, maxWidth: 390px  // Breaks mathematical consistency
```

### Content-Driven Behavior

✅ **DO**: Let components adapt within constraints
```css
min-width: var(--space-800);
max-width: var(--space-1200);
width: 100%; /* Adapts within constraints */
```

❌ **DON'T**: Use fixed widths
```css
width: 320px; /* Prevents content-driven adaptation */
```

### Platform-Native Patterns

✅ **DO**: Use platform-native syntax
```swift
// iOS - SwiftUI frame modifiers
.frame(minWidth: space800, maxWidth: space1200)
```

❌ **DON'T**: Try to abstract platform differences at runtime
```swift
// Don't create cross-platform abstraction layer
.applyConstraints(min: 800, max: 1200) // Unnecessary abstraction
```

### Token Elevation

✅ **DO**: Start with existing tokens, elevate when patterns emerge
```
1. Use space800/space1200 directly
2. Create component-level tokens if needed
3. Elevate to semantic tokens when used in 3+ components
```

❌ **DON'T**: Create semantic tokens prematurely
```
Don't create semantic tokens before pattern is proven
```

---

## Common Patterns

### Form Input Components

**Pattern**: Standard, narrow, and wide variants

```
Standard: space800 (256) - space1200 (384)
Narrow: space600 (192) - space800 (256)
Wide: space1000 (320) - space1600 (512)
```

### Card Components

**Pattern**: Minimum size with flexible maximum

```
Minimum: space600 (192)
Maximum: space1000 (320)
Behavior: Grows to fill available space within constraints
```

### Button Components

**Pattern**: Content-driven with minimum width

```
Minimum: space400 (128)
Maximum: None (grows with content)
Padding: space200 (16) horizontal, space150 (12) vertical
```

### Modal/Dialog Components

**Pattern**: Responsive sizing based on viewport

```
Mobile: space800 (256) - space1200 (384)
Tablet: space1200 (384) - space1600 (512)
Desktop: space1600 (512) - space2000 (640)
```

---

## Validation Checklist

Before implementing a component, verify:

- [ ] Uses existing spacing tokens for min/max constraints
- [ ] Expresses constraints using platform-native syntax
- [ ] Maintains content-driven behavior (adapts within constraints)
- [ ] Follows True Native Architecture (no runtime platform detection)
- [ ] Component-level tokens created only when variants needed
- [ ] Semantic tokens elevated only when pattern proven (3+ components)
- [ ] Mathematical relationships consistent across all platforms
- [ ] Native platforms use gridGutterNative/gridMarginNative for page-level spacing

---

*This guide demonstrates how to implement content-driven components with mathematical constraints across all platforms while maintaining True Native Architecture principles and platform-specific best practices.*
