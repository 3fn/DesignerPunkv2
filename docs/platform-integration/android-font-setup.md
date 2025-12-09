# Android Font Setup Guide

**Date**: December 8, 2025  
**Purpose**: Guide for configuring Inter and Rajdhani fonts in Android applications  
**Requirements**: 8.1, 8.2, 8.3, 8.4, 8.5

---

## Overview

This guide explains how to configure and use the Inter and Rajdhani font families in Android applications using Jetpack Compose. The fonts are provided as TTF files in the `src/assets/fonts/` directory and must be copied to the Android project's `res/font/` directory.

## Font Files

### Inter Font Family
- **inter_regular.ttf** - Regular weight (400)
- **inter_medium.ttf** - Medium weight (500)
- **inter_semibold.ttf** - SemiBold weight (600)
- **inter_bold.ttf** - Bold weight (700)

### Rajdhani Font Family
- **rajdhani_regular.ttf** - Regular weight (400)
- **rajdhani_medium.ttf** - Medium weight (500)
- **rajdhani_semibold.ttf** - SemiBold weight (600)
- **rajdhani_bold.ttf** - Bold weight (700)

---

## Installation

### Step 1: Copy Font Files to Android Resources

Copy the TTF files from `src/assets/fonts/` to your Android project's `app/src/main/res/font/` directory with lowercase, underscore-separated names:

```bash
# From project root
cp src/assets/fonts/inter/Inter-Regular.ttf app/src/main/res/font/inter_regular.ttf
cp src/assets/fonts/inter/Inter-Medium.ttf app/src/main/res/font/inter_medium.ttf
cp src/assets/fonts/inter/Inter-SemiBold.ttf app/src/main/res/font/inter_semibold.ttf
cp src/assets/fonts/inter/Inter-Bold.ttf app/src/main/res/font/inter_bold.ttf

cp src/assets/fonts/rajdhani/Rajdhani-Regular.ttf app/src/main/res/font/rajdhani_regular.ttf
cp src/assets/fonts/rajdhani/Rajdhani-Medium.ttf app/src/main/res/font/rajdhani_medium.ttf
cp src/assets/fonts/rajdhani/Rajdhani-SemiBold.ttf app/src/main/res/font/rajdhani_semibold.ttf
cp src/assets/fonts/rajdhani/Rajdhani-Bold.ttf app/src/main/res/font/rajdhani_bold.ttf
```

**Note**: Android resource names must be lowercase with underscores. The build system will fail if you use hyphens or uppercase letters.

### Step 2: Create FontFamily Objects

Create a Kotlin file to define the FontFamily objects for both font families:

```kotlin
// app/src/main/kotlin/com/designerpunk/ui/theme/Typography.kt
package com.designerpunk.ui.theme

import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import com.designerpunk.R

/**
 * Inter Font Family
 * 
 * Body font for general text content, paragraphs, and descriptions.
 * Provides excellent readability at small sizes.
 */
val interFamily = FontFamily(
    Font(R.font.inter_regular, FontWeight.Normal),    // 400
    Font(R.font.inter_medium, FontWeight.Medium),     // 500
    Font(R.font.inter_semibold, FontWeight.SemiBold), // 600
    Font(R.font.inter_bold, FontWeight.Bold)          // 700
)

/**
 * Rajdhani Font Family
 * 
 * Display font for headings, labels, buttons, and UI elements.
 * Strengthens visual hierarchy and aligns with cyberpunk aesthetic.
 */
val rajdhaniFamily = FontFamily(
    Font(R.font.rajdhani_regular, FontWeight.Normal),    // 400
    Font(R.font.rajdhani_medium, FontWeight.Medium),     // 500
    Font(R.font.rajdhani_semibold, FontWeight.SemiBold), // 600
    Font(R.font.rajdhani_bold, FontWeight.Bold)          // 700
)
```

---

## Usage in Jetpack Compose

### Display Typography (Rajdhani)

Use `rajdhaniFamily` for headings, labels, buttons, and UI elements:

```kotlin
import androidx.compose.material3.Text
import androidx.compose.ui.text.font.FontWeight
import com.designerpunk.ui.theme.rajdhaniFamily

// Heading
Text(
    text = "Heading Text",
    fontFamily = rajdhaniFamily,
    fontWeight = FontWeight.Bold
)

// Button
Button(onClick = { /* action */ }) {
    Text(
        text = "Button Label",
        fontFamily = rajdhaniFamily,
        fontWeight = FontWeight.SemiBold
    )
}

// Label
Text(
    text = "Label Text",
    fontFamily = rajdhaniFamily,
    fontWeight = FontWeight.Medium
)
```

### Body Typography (Inter)

Use `interFamily` for paragraphs, descriptions, and general text content:

```kotlin
import androidx.compose.material3.Text
import androidx.compose.ui.text.font.FontWeight
import com.designerpunk.ui.theme.interFamily

// Body text
Text(
    text = "Body text content goes here. Inter provides excellent readability.",
    fontFamily = interFamily,
    fontWeight = FontWeight.Normal
)

// Description
Text(
    text = "Detailed description text",
    fontFamily = interFamily,
    fontWeight = FontWeight.Normal
)
```

### Material 3 Typography Integration

Integrate with Material 3 Typography for consistent theming:

```kotlin
import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val AppTypography = Typography(
    // Display typography uses Rajdhani
    displayLarge = TextStyle(
        fontFamily = rajdhaniFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 57.sp
    ),
    displayMedium = TextStyle(
        fontFamily = rajdhaniFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 45.sp
    ),
    displaySmall = TextStyle(
        fontFamily = rajdhaniFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 36.sp
    ),
    
    // Headline typography uses Rajdhani
    headlineLarge = TextStyle(
        fontFamily = rajdhaniFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 32.sp
    ),
    headlineMedium = TextStyle(
        fontFamily = rajdhaniFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 28.sp
    ),
    headlineSmall = TextStyle(
        fontFamily = rajdhaniFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 24.sp
    ),
    
    // Title typography uses Rajdhani
    titleLarge = TextStyle(
        fontFamily = rajdhaniFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 22.sp
    ),
    titleMedium = TextStyle(
        fontFamily = rajdhaniFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 16.sp
    ),
    titleSmall = TextStyle(
        fontFamily = rajdhaniFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 14.sp
    ),
    
    // Body typography uses Inter
    bodyLarge = TextStyle(
        fontFamily = interFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = interFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp
    ),
    bodySmall = TextStyle(
        fontFamily = interFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp
    ),
    
    // Label typography uses Rajdhani
    labelLarge = TextStyle(
        fontFamily = rajdhaniFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 14.sp
    ),
    labelMedium = TextStyle(
        fontFamily = rajdhaniFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 12.sp
    ),
    labelSmall = TextStyle(
        fontFamily = rajdhaniFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp
    )
)
```

---

## Font Weight Mapping

Android FontWeight constants map to numeric font weights:

| FontWeight Constant | Numeric Value | Font File |
|---------------------|---------------|-----------|
| `FontWeight.Normal` | 400 | `*_regular.ttf` |
| `FontWeight.Medium` | 500 | `*_medium.ttf` |
| `FontWeight.SemiBold` | 600 | `*_semibold.ttf` |
| `FontWeight.Bold` | 700 | `*_bold.ttf` |

**Example**:
```kotlin
Text(
    text = "Bold Text",
    fontFamily = rajdhaniFamily,
    fontWeight = FontWeight.Bold  // Uses rajdhani_bold.ttf
)
```

---

## Fallback Behavior

If custom fonts fail to load (missing files, incorrect resource names, etc.), Android will fall back to the system default font (Roboto):

```kotlin
// If rajdhaniFamily fails to load
Text(
    text = "Heading",
    fontFamily = rajdhaniFamily  // Falls back to Roboto if unavailable
)
```

**Best Practice**: Always test font loading in your app to ensure fonts are correctly bundled and accessible.

---

## Troubleshooting

### Font Not Loading

**Symptom**: Text renders in Roboto instead of Inter or Rajdhani

**Possible Causes**:
1. Font files not in `res/font/` directory
2. Incorrect resource names (must be lowercase with underscores)
3. Font files corrupted or invalid
4. R.font references incorrect

**Solution**:
```kotlin
// Verify font resources exist
println("Inter Regular: ${R.font.inter_regular}")
println("Rajdhani Bold: ${R.font.rajdhani_bold}")

// Check FontFamily instantiation
try {
    val testFamily = FontFamily(Font(R.font.inter_regular))
    println("Font loaded successfully")
} catch (e: Exception) {
    println("Font loading failed: ${e.message}")
}
```

### Build Errors

**Symptom**: Build fails with "Resource not found" errors

**Cause**: Font file names don't follow Android naming conventions

**Solution**: Ensure all font files use lowercase names with underscores:
- ✅ `inter_regular.ttf`
- ❌ `Inter-Regular.ttf`
- ❌ `InterRegular.ttf`

### Font Weight Not Working

**Symptom**: All text renders in Regular weight regardless of FontWeight setting

**Cause**: Missing font weight files in FontFamily definition

**Solution**: Ensure all four weights are included in FontFamily:
```kotlin
val interFamily = FontFamily(
    Font(R.font.inter_regular, FontWeight.Normal),    // Required
    Font(R.font.inter_medium, FontWeight.Medium),     // Required
    Font(R.font.inter_semibold, FontWeight.SemiBold), // Required
    Font(R.font.inter_bold, FontWeight.Bold)          // Required
)
```

---

## Platform-Specific Considerations

### Density-Independent Pixels (dp)

Android uses density-independent pixels (dp) for sizing. Font sizes are specified in scalable pixels (sp) which respect user accessibility settings:

```kotlin
Text(
    text = "Accessible Text",
    fontSize = 16.sp  // Scales with user's font size preference
)
```

### Material Design Integration

Rajdhani and Inter integrate seamlessly with Material Design 3:

```kotlin
MaterialTheme(
    typography = AppTypography  // Uses Rajdhani and Inter
) {
    // Your app content
}
```

### Accessibility

Android automatically handles font scaling based on user preferences. Test your app with different font size settings:

**Settings → Display → Font size**

---

## Testing Font Loading

Create a test composable to verify fonts load correctly:

```kotlin
@Composable
fun FontTestScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text("Rajdhani Regular", fontFamily = rajdhaniFamily, fontWeight = FontWeight.Normal)
        Text("Rajdhani Medium", fontFamily = rajdhaniFamily, fontWeight = FontWeight.Medium)
        Text("Rajdhani SemiBold", fontFamily = rajdhaniFamily, fontWeight = FontWeight.SemiBold)
        Text("Rajdhani Bold", fontFamily = rajdhaniFamily, fontWeight = FontWeight.Bold)
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Text("Inter Regular", fontFamily = interFamily, fontWeight = FontWeight.Normal)
        Text("Inter Medium", fontFamily = interFamily, fontWeight = FontWeight.Medium)
        Text("Inter SemiBold", fontFamily = interFamily, fontWeight = FontWeight.SemiBold)
        Text("Inter Bold", fontFamily = interFamily, fontWeight = FontWeight.Bold)
    }
}
```

---

## Summary

- **Inter**: Body font for general text content (`interFamily`)
- **Rajdhani**: Display font for headings, labels, and UI elements (`rajdhaniFamily`)
- **Font Files**: Must be in `res/font/` with lowercase, underscore-separated names
- **Usage**: `fontFamily = rajdhaniFamily` for display, `fontFamily = interFamily` for body
- **Fallback**: Roboto (system default) if custom fonts fail to load
- **Weights**: Normal (400), Medium (500), SemiBold (600), Bold (700)

---

**Requirements Addressed**: 8.1, 8.2, 8.3, 8.4, 8.5
