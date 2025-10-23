# Compositional Color Architecture Guide

**Date**: October 22, 2025
**Spec**: typography-token-expansion
**Purpose**: Document compositional color architecture and usage patterns
**Organization**: spec-completion
**Scope**: typography-token-expansion

---

## Overview

The DesignerPunk typography token system follows a **compositional architecture** where typography tokens define text structure (size, weight, line-height, family, letter-spacing) while color is applied separately through color tokens. This document explains the rationale for this approach and provides platform-specific examples for composing typography with color.

---

## Why Typography Tokens Don't Include Color

### Separation of Concerns

Typography tokens define **text structure** - the mathematical relationships between size, line-height, weight, and family. These are fundamental properties that describe how text is shaped and spaced.

Color tokens define **text appearance** - the semantic meaning and visual presentation. Color communicates hierarchy, state, and brand identity.

These are fundamentally different concerns that should be separated:

- **Structure** is about mathematical consistency and readability
- **Appearance** is about semantic meaning and visual design
- **Structure** is relatively stable across design changes
- **Appearance** changes frequently based on themes, modes, and contexts

### Preventing Combinatorial Explosion

Including color in typography tokens would create an explosion of token combinations:

**Without Compositional Architecture** (color included in typography):
```
typography.bodyMd.default
typography.bodyMd.muted
typography.bodyMd.primary
typography.bodyMd.error
typography.bodyMd.success
typography.bodyMd.warning
= 6 tokens just for bodyMd colors

× 13 new typography tokens (bodySm, bodyMd, bodyLg, labelXs, labelSm, labelMd, labelLg, codeSm, codeMd, codeLg, buttonSm, buttonMd, buttonLg)
= 78 additional tokens

× 2 modes (light, dark)
= 156 total tokens
```

**With Compositional Architecture** (color separate):
```
13 typography tokens (structure)
+ 15 color tokens (appearance)
= 28 tokens total

Infinite combinations without token explosion
```

### Flexibility and Maintainability

Separating typography and color provides:

- **Flexibility**: Any typography token can be paired with any color token
- **Easier theming**: Change color schemes without touching typography
- **Simpler maintenance**: Update typography structure or color appearance independently
- **Better scalability**: Add new typography sizes or color semantics without cross-multiplication

### Industry Alignment

All major code-based design systems use compositional approaches:

- **Material Design 3**: Separate typography scale and color roles
- **Chakra UI**: Typography styles composed with color props
- **Tailwind CSS**: Text size utilities separate from text color utilities
- **Apple Human Interface Guidelines**: Typography styles separate from color semantics

Design tools (Figma, Sketch) include color in text styles because designers work visually. Code systems benefit from composition because developers work programmatically.

---

## Composing Typography with Color

### Web (CSS / React)

#### Basic Composition

```css
/* CSS Custom Properties */
.body-text {
  font-size: var(--typography-bodyMd-fontSize);
  line-height: var(--typography-bodyMd-lineHeight);
  font-family: var(--typography-bodyMd-fontFamily);
  font-weight: var(--typography-bodyMd-fontWeight);
  letter-spacing: var(--typography-bodyMd-letterSpacing);
  color: var(--color-text-default);
}

.muted-text {
  font-size: var(--typography-bodySm-fontSize);
  line-height: var(--typography-bodySm-lineHeight);
  font-family: var(--typography-bodySm-fontFamily);
  font-weight: var(--typography-bodySm-fontWeight);
  letter-spacing: var(--typography-bodySm-letterSpacing);
  color: var(--color-text-muted);
}
```

#### React with Styled Components

```tsx
import styled from 'styled-components';
import { typography, colors } from '@designerpunk/tokens';

const BodyText = styled.p`
  font-size: ${typography.bodyMd.fontSize};
  line-height: ${typography.bodyMd.lineHeight};
  font-family: ${typography.bodyMd.fontFamily};
  font-weight: ${typography.bodyMd.fontWeight};
  letter-spacing: ${typography.bodyMd.letterSpacing};
  color: ${colors.text.default};
`;

const Label = styled.label`
  font-size: ${typography.labelMd.fontSize};
  line-height: ${typography.labelMd.lineHeight};
  font-family: ${typography.labelMd.fontFamily};
  font-weight: ${typography.labelMd.fontWeight};
  letter-spacing: ${typography.labelMd.letterSpacing};
  color: ${colors.text.default};
`;

const ErrorMessage = styled.span`
  font-size: ${typography.bodySm.fontSize};
  line-height: ${typography.bodySm.lineHeight};
  font-family: ${typography.bodySm.fontFamily};
  font-weight: ${typography.bodySm.fontWeight};
  letter-spacing: ${typography.bodySm.letterSpacing};
  color: ${colors.error};
`;
```

#### React with Utility Classes

```tsx
// Using Tailwind-style utility classes
<p className="typography-bodyMd text-default">
  Standard body text with default color
</p>

<p className="typography-bodySm text-muted">
  Small body text with muted color
</p>

<label className="typography-labelMd text-default">
  Form label with default color
</label>

<code className="typography-codeMd text-muted bg-surface">
  Inline code with muted text and surface background
</code>
```

### iOS (SwiftUI)

#### Basic Composition

```swift
import SwiftUI
import DesignerPunkTokens

struct ContentView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Body text with default color
            Text("Standard body text")
                .font(.custom(
                    Typography.bodyMd.fontFamily,
                    size: Typography.bodyMd.fontSize
                ))
                .lineSpacing(Typography.bodyMd.lineHeight)
                .fontWeight(.init(Typography.bodyMd.fontWeight))
                .kerning(Typography.bodyMd.letterSpacing)
                .foregroundColor(Color(Colors.text.default))
            
            // Small body text with muted color
            Text("Secondary information")
                .font(.custom(
                    Typography.bodySm.fontFamily,
                    size: Typography.bodySm.fontSize
                ))
                .lineSpacing(Typography.bodySm.lineHeight)
                .fontWeight(.init(Typography.bodySm.fontWeight))
                .kerning(Typography.bodySm.letterSpacing)
                .foregroundColor(Color(Colors.text.muted))
            
            // Label with default color
            Text("Form Label")
                .font(.custom(
                    Typography.labelMd.fontFamily,
                    size: Typography.labelMd.fontSize
                ))
                .lineSpacing(Typography.labelMd.lineHeight)
                .fontWeight(.init(Typography.labelMd.fontWeight))
                .kerning(Typography.labelMd.letterSpacing)
                .foregroundColor(Color(Colors.text.default))
            
            // Code text with muted color and background
            Text("func example() { }")
                .font(.custom(
                    Typography.codeMd.fontFamily,
                    size: Typography.codeMd.fontSize
                ))
                .lineSpacing(Typography.codeMd.lineHeight)
                .fontWeight(.init(Typography.codeMd.fontWeight))
                .kerning(Typography.codeMd.letterSpacing)
                .foregroundColor(Color(Colors.text.muted))
                .padding(8)
                .background(Color(Colors.surface))
                .cornerRadius(4)
        }
    }
}
```

#### SwiftUI View Extensions

```swift
// Create reusable view extensions for common compositions
extension View {
    func bodyText(color: Color = Color(Colors.text.default)) -> some View {
        self
            .font(.custom(
                Typography.bodyMd.fontFamily,
                size: Typography.bodyMd.fontSize
            ))
            .lineSpacing(Typography.bodyMd.lineHeight)
            .fontWeight(.init(Typography.bodyMd.fontWeight))
            .kerning(Typography.bodyMd.letterSpacing)
            .foregroundColor(color)
    }
    
    func labelText(color: Color = Color(Colors.text.default)) -> some View {
        self
            .font(.custom(
                Typography.labelMd.fontFamily,
                size: Typography.labelMd.fontSize
            ))
            .lineSpacing(Typography.labelMd.lineHeight)
            .fontWeight(.init(Typography.labelMd.fontWeight))
            .kerning(Typography.labelMd.letterSpacing)
            .foregroundColor(color)
    }
}

// Usage
Text("Body text").bodyText()
Text("Muted text").bodyText(color: Color(Colors.text.muted))
Text("Label").labelText()
```

### Android (Jetpack Compose)

#### Basic Composition

```kotlin
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import androidx.compose.ui.unit.em
import com.designerpunk.tokens.Typography
import com.designerpunk.tokens.Colors

@Composable
fun ContentScreen() {
    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Body text with default color
        Text(
            text = "Standard body text",
            style = TextStyle(
                fontSize = Typography.bodyMd.fontSize.sp,
                lineHeight = Typography.bodyMd.lineHeight.em,
                fontFamily = FontFamily(Typography.bodyMd.fontFamily),
                fontWeight = FontWeight(Typography.bodyMd.fontWeight),
                letterSpacing = Typography.bodyMd.letterSpacing.em
            ),
            color = Color(Colors.text.default)
        )
        
        // Small body text with muted color
        Text(
            text = "Secondary information",
            style = TextStyle(
                fontSize = Typography.bodySm.fontSize.sp,
                lineHeight = Typography.bodySm.lineHeight.em,
                fontFamily = FontFamily(Typography.bodySm.fontFamily),
                fontWeight = FontWeight(Typography.bodySm.fontWeight),
                letterSpacing = Typography.bodySm.letterSpacing.em
            ),
            color = Color(Colors.text.muted)
        )
        
        // Label with default color
        Text(
            text = "Form Label",
            style = TextStyle(
                fontSize = Typography.labelMd.fontSize.sp,
                lineHeight = Typography.labelMd.lineHeight.em,
                fontFamily = FontFamily(Typography.labelMd.fontFamily),
                fontWeight = FontWeight(Typography.labelMd.fontWeight),
                letterSpacing = Typography.labelMd.letterSpacing.em
            ),
            color = Color(Colors.text.default)
        )
        
        // Code text with muted color and background
        Text(
            text = "fun example() { }",
            style = TextStyle(
                fontSize = Typography.codeMd.fontSize.sp,
                lineHeight = Typography.codeMd.lineHeight.em,
                fontFamily = FontFamily(Typography.codeMd.fontFamily),
                fontWeight = FontWeight(Typography.codeMd.fontWeight),
                letterSpacing = Typography.codeMd.letterSpacing.em
            ),
            color = Color(Colors.text.muted),
            modifier = Modifier
                .background(Color(Colors.surface))
                .padding(8.dp)
        )
    }
}
```

#### Compose TextStyle Extensions

```kotlin
// Create reusable TextStyle extensions for common compositions
object TypographyStyles {
    fun bodyText(color: Color = Color(Colors.text.default)) = TextStyle(
        fontSize = Typography.bodyMd.fontSize.sp,
        lineHeight = Typography.bodyMd.lineHeight.em,
        fontFamily = FontFamily(Typography.bodyMd.fontFamily),
        fontWeight = FontWeight(Typography.bodyMd.fontWeight),
        letterSpacing = Typography.bodyMd.letterSpacing.em,
        color = color
    )
    
    fun labelText(color: Color = Color(Colors.text.default)) = TextStyle(
        fontSize = Typography.labelMd.fontSize.sp,
        lineHeight = Typography.labelMd.lineHeight.em,
        fontFamily = FontFamily(Typography.labelMd.fontFamily),
        fontWeight = FontWeight(Typography.labelMd.fontWeight),
        letterSpacing = Typography.labelMd.letterSpacing.em,
        color = color
    )
    
    fun codeText(color: Color = Color(Colors.text.muted)) = TextStyle(
        fontSize = Typography.codeMd.fontSize.sp,
        lineHeight = Typography.codeMd.lineHeight.em,
        fontFamily = FontFamily(Typography.codeMd.fontFamily),
        fontWeight = FontWeight(Typography.codeMd.fontWeight),
        letterSpacing = Typography.codeMd.letterSpacing.em,
        color = color
    )
}

// Usage
Text("Body text", style = TypographyStyles.bodyText())
Text("Muted text", style = TypographyStyles.bodyText(Color(Colors.text.muted)))
Text("Label", style = TypographyStyles.labelText())
```

---

## Recommended Color Pairings

### Body Text

**Primary content** (paragraphs, articles, main text):
- Typography: `typography.bodyMd`
- Color: `color.text.default`
- Use case: Main reading content

**Secondary content** (descriptions, metadata, supporting text):
- Typography: `typography.bodySm`
- Color: `color.text.muted`
- Use case: Less prominent information

**Emphasized content** (lead paragraphs, introductions):
- Typography: `typography.bodyLg`
- Color: `color.text.default`
- Use case: Prominent body text

### Labels

**Form labels** (input labels, field names):
- Typography: `typography.labelMd`
- Color: `color.text.default`
- Use case: Standard form labels

**Floating labels** (animated input labels):
- Typography: `typography.labelXs` (when floating)
- Color: `color.text.muted`
- Use case: Material Design-style floating labels

**Section labels** (UI section headers, category labels):
- Typography: `typography.labelLg`
- Color: `color.text.default`
- Use case: Prominent UI labels

**Compact labels** (badges, tags, metadata):
- Typography: `typography.labelSm`
- Color: `color.text.muted`
- Use case: Small UI labels

### Code Text

**Inline code** (code within paragraphs):
- Typography: `typography.codeMd`
- Color: `color.text.muted`
- Background: `color.surface`
- Use case: Code snippets in documentation

**Code blocks** (multi-line code examples):
- Typography: `typography.codeMd`
- Color: `color.text.default`
- Background: `color.surface`
- Use case: Code examples and documentation

**Small code** (compact code references):
- Typography: `typography.codeSm`
- Color: `color.text.muted`
- Background: `color.surface`
- Use case: Inline code in tight layouts

### Button Text

**Primary buttons** (main actions):
- Typography: `typography.buttonMd`
- Color: `color.primary` (or button-specific color)
- Use case: Primary call-to-action buttons

**Secondary buttons** (alternative actions):
- Typography: `typography.buttonMd`
- Color: `color.text.default`
- Use case: Secondary action buttons

**Small buttons** (compact actions, tertiary buttons):
- Typography: `typography.buttonSm`
- Color: `color.text.muted`
- Use case: Tertiary actions, icon buttons with text

**Large buttons** (prominent CTAs, hero buttons):
- Typography: `typography.buttonLg`
- Color: `color.primary`
- Use case: Hero CTAs, prominent actions

---

## Platform-Specific Considerations

### Web

**Default text color**: Browsers provide default text colors, so forgetting to apply color won't result in invisible text. However, always explicitly set color for consistency across browsers.

**Helper functions**: Create CSS utility classes or styled-component helpers that combine typography and color for common use cases.

**Accessibility**: Use semantic HTML (`<p>`, `<label>`, `<code>`) in addition to typography tokens for better screen reader support.

### iOS

**System defaults**: SwiftUI provides default text colors that adapt to light/dark mode. Explicitly set colors using design system tokens for consistency.

**View extensions**: Create SwiftUI view extensions that combine typography and color for reusable text styles.

**Dynamic Type**: Consider supporting Dynamic Type by using relative font sizes that scale with user preferences.

### Android

**Material defaults**: Compose provides default text colors from Material theme. Override with design system tokens for brand consistency.

**TextStyle composition**: Create reusable TextStyle objects that combine typography and color for common patterns.

**Accessibility**: Support user font size preferences by using scalable units (sp) for font sizes.

---

## Common Patterns

### Error Messages

```typescript
// Web
<span className="typography-bodySm text-error">
  Invalid email address
</span>

// iOS
Text("Invalid email address")
    .bodySmallText(color: Color(Colors.error))

// Android
Text(
    "Invalid email address",
    style = TypographyStyles.bodySmall(Color(Colors.error))
)
```

### Success Messages

```typescript
// Web
<span className="typography-bodySm text-success">
  Profile updated successfully
</span>

// iOS
Text("Profile updated successfully")
    .bodySmallText(color: Color(Colors.success))

// Android
Text(
    "Profile updated successfully",
    style = TypographyStyles.bodySmall(Color(Colors.success))
)
```

### Disabled State

```typescript
// Web
<button disabled className="typography-buttonMd text-disabled">
  Submit
</button>

// iOS
Button("Submit") { }
    .buttonText(color: Color(Colors.text.disabled))
    .disabled(true)

// Android
Button(
    onClick = { },
    enabled = false
) {
    Text("Submit", style = TypographyStyles.buttonText(Color(Colors.text.disabled)))
}
```

---

## Benefits of Compositional Architecture

### For Developers

- **Flexibility**: Mix and match typography and color as needed
- **Predictability**: Typography structure is consistent, color provides semantic meaning
- **Maintainability**: Update typography or color independently
- **Reusability**: Same typography tokens work with any color

### For Designers

- **Consistency**: Typography structure remains consistent across color schemes
- **Theming**: Easy to create light/dark modes or brand variations
- **Scalability**: Add new typography sizes or colors without cross-multiplication
- **Clarity**: Clear separation between structure and appearance

### For AI Collaboration

- **Unambiguous**: Typography structure and color appearance are separate concerns
- **Composable**: AI can reason about typography and color independently
- **Predictable**: Composition rules are clear and consistent
- **Extensible**: New typography or color tokens don't affect existing compositions

---

## Summary

The compositional color architecture separates typography structure from color appearance, preventing token explosion while providing maximum flexibility. By composing typography tokens with color tokens at usage time, the system maintains:

- **28 tokens** (13 typography + 15 color) instead of 156+ combined tokens
- **Infinite combinations** without additional token definitions
- **Clear separation** between structure and appearance
- **Platform consistency** with platform-appropriate composition patterns
- **Easy maintenance** with independent typography and color updates

This approach aligns with industry best practices and provides the foundation for reliable AI-human collaboration through clear, unambiguous token composition.

---

*This guide provides the rationale and practical examples for composing typography tokens with color tokens across all supported platforms.*
