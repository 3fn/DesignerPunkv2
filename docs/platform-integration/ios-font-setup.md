# iOS Font Integration Guide

**Date**: December 8, 2025  
**Purpose**: Guide for integrating Inter and Rajdhani fonts in iOS applications  
**Spec**: 015 - Color Palette & Display Font Update

---

## Overview

This guide provides instructions for integrating the Inter and Rajdhani custom fonts into an iOS application using the DesignerPunk design system.

## Font Files Required

The following font files must be included in your iOS project:

### Inter Font Family
- `Inter-Regular.ttf` (400 weight)
- `Inter-Medium.ttf` (500 weight)
- `Inter-SemiBold.ttf` (600 weight)
- `Inter-Bold.ttf` (700 weight)

### Rajdhani Font Family
- `Rajdhani-Regular.ttf` (400 weight)
- `Rajdhani-Medium.ttf` (500 weight)
- `Rajdhani-SemiBold.ttf` (600 weight)
- `Rajdhani-Bold.ttf` (700 weight)

**Total**: 8 font files (4 Inter + 4 Rajdhani)

---

## Info.plist Configuration

Add the following entries to your iOS application's `Info.plist` file under the `UIAppFonts` array:

```xml
<key>UIAppFonts</key>
<array>
    <!-- Inter Font Family -->
    <string>Inter-Regular.ttf</string>
    <string>Inter-Medium.ttf</string>
    <string>Inter-SemiBold.ttf</string>
    <string>Inter-Bold.ttf</string>
    
    <!-- Rajdhani Font Family -->
    <string>Rajdhani-Regular.ttf</string>
    <string>Rajdhani-Medium.ttf</string>
    <string>Rajdhani-SemiBold.ttf</string>
    <string>Rajdhani-Bold.ttf</string>
</array>
```

### Complete Info.plist Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- Other Info.plist entries -->
    
    <key>UIAppFonts</key>
    <array>
        <!-- Inter Font Family -->
        <string>Inter-Regular.ttf</string>
        <string>Inter-Medium.ttf</string>
        <string>Inter-SemiBold.ttf</string>
        <string>Inter-Bold.ttf</string>
        
        <!-- Rajdhani Font Family -->
        <string>Rajdhani-Regular.ttf</string>
        <string>Rajdhani-Medium.ttf</string>
        <string>Rajdhani-SemiBold.ttf</string>
        <string>Rajdhani-Bold.ttf</string>
    </array>
    
    <!-- Other Info.plist entries -->
</dict>
</plist>
```

---

## Xcode Project Setup

### Step 1: Add Font Files to Project

1. In Xcode, select your project in the Project Navigator
2. Right-click on your project folder and select "Add Files to [ProjectName]"
3. Navigate to the font files location (typically `src/assets/fonts/`)
4. Select all 8 font files (4 Inter + 4 Rajdhani)
5. Ensure "Copy items if needed" is checked
6. Ensure your app target is selected in "Add to targets"
7. Click "Add"

### Step 2: Verify Font Files in Bundle

1. Select your project target
2. Go to "Build Phases" tab
3. Expand "Copy Bundle Resources"
4. Verify all 8 font files are listed:
   - Inter-Regular.ttf
   - Inter-Medium.ttf
   - Inter-SemiBold.ttf
   - Inter-Bold.ttf
   - Rajdhani-Regular.ttf
   - Rajdhani-Medium.ttf
   - Rajdhani-SemiBold.ttf
   - Rajdhani-Bold.ttf

### Step 3: Update Info.plist

1. Open your project's `Info.plist` file
2. Add the `UIAppFonts` array with all 8 font file names (see configuration above)
3. Save the file

---

## SwiftUI Usage

### Display Text with Rajdhani

**Requirement 7.3**: Use `.custom("Rajdhani", size:)` for display text (headings, labels, buttons)

```swift
import SwiftUI

// Headings
Text("Heading Text")
    .font(.custom("Rajdhani", size: 32))
    .fontWeight(.bold)

// Labels
Text("Label Text")
    .font(.custom("Rajdhani", size: 14))
    .fontWeight(.medium)

// Buttons
Button("Button Text") {
    // Action
}
.font(.custom("Rajdhani", size: 16))
.fontWeight(.semibold)
```

**Usage Pattern**: `.custom("Rajdhani", size: [size])` + `.fontWeight([weight])`

### Body Text with Inter

**Requirement 7.4**: Use `.custom("Inter", size:)` for body text (paragraphs, descriptions)

```swift
import SwiftUI

// Body text
Text("Body text content goes here")
    .font(.custom("Inter", size: 16))
    .fontWeight(.regular)

// Descriptions
Text("Description text")
    .font(.custom("Inter", size: 14))
    .fontWeight(.regular)
```

**Usage Pattern**: `.custom("Inter", size: [size])` + `.fontWeight([weight])`

### Font Weight Mapping

**Requirement 7.5**: Font weight mapping between design system and SwiftUI

| Design System Weight | SwiftUI FontWeight | Font File |
|---------------------|-------------------|-----------|
| 400 (Regular) | `.regular` | Inter-Regular.ttf / Rajdhani-Regular.ttf |
| 500 (Medium) | `.medium` | Inter-Medium.ttf / Rajdhani-Medium.ttf |
| 600 (SemiBold) | `.semibold` | Inter-SemiBold.ttf / Rajdhani-SemiBold.ttf |
| 700 (Bold) | `.bold` | Inter-Bold.ttf / Rajdhani-Bold.ttf |

**Example with explicit weight**:
```swift
// Display text with Medium weight (500)
Text("Medium Display")
    .font(.custom("Rajdhani", size: 20))
    .fontWeight(.medium)  // Maps to Rajdhani-Medium.ttf

// Body text with SemiBold weight (600)
Text("SemiBold Body")
    .font(.custom("Inter", size: 16))
    .fontWeight(.semibold)  // Maps to Inter-SemiBold.ttf
```

---

## UIKit Usage

### Using Rajdhani (Display Font)

```swift
import UIKit

// Headings
let headingLabel = UILabel()
headingLabel.font = UIFont(name: "Rajdhani-Bold", size: 32)
headingLabel.text = "Heading Text"

// Labels
let label = UILabel()
label.font = UIFont(name: "Rajdhani-Medium", size: 14)
label.text = "Label Text"

// Buttons
let button = UIButton()
button.titleLabel?.font = UIFont(name: "Rajdhani-SemiBold", size: 16)
button.setTitle("Button Text", for: .normal)
```

### Using Inter (Body Font)

```swift
import UIKit

// Body text
let bodyLabel = UILabel()
bodyLabel.font = UIFont(name: "Inter-Regular", size: 16)
bodyLabel.text = "Body text content"

// Descriptions
let descriptionLabel = UILabel()
descriptionLabel.font = UIFont(name: "Inter-Regular", size: 14)
descriptionLabel.text = "Description text"
```

### Font Name Reference

| Font Family | Weight | PostScript Name |
|------------|--------|----------------|
| Inter | Regular | Inter-Regular |
| Inter | Medium | Inter-Medium |
| Inter | SemiBold | Inter-SemiBold |
| Inter | Bold | Inter-Bold |
| Rajdhani | Regular | Rajdhani-Regular |
| Rajdhani | Medium | Rajdhani-Medium |
| Rajdhani | SemiBold | Rajdhani-SemiBold |
| Rajdhani | Bold | Rajdhani-Bold |

---

## Fallback Fonts

**Requirement 7.5**: Fallback behavior when custom fonts are unavailable

If custom fonts fail to load, the system will fall back to native iOS fonts:

- **Display text fallback**: SF Pro Display (for Rajdhani)
- **Body text fallback**: SF Pro Text (for Inter)

### SwiftUI Fallback Pattern

```swift
import SwiftUI

// Display font with automatic fallback to SF Pro Display
Text("Display Text")
    .font(.custom("Rajdhani", size: 20))
    // If Rajdhani unavailable, SwiftUI falls back to SF Pro Display

// Body font with automatic fallback to SF Pro Text
Text("Body Text")
    .font(.custom("Inter", size: 16))
    // If Inter unavailable, SwiftUI falls back to SF Pro Text
```

**Note**: SwiftUI automatically handles fallback to system fonts when custom fonts are unavailable. No additional code is required for basic fallback behavior.

### UIKit Fallback Pattern

For UIKit, implement explicit fallback using the nil-coalescing operator:

```swift
// Display font with fallback to SF Pro Display
let displayFont = UIFont(name: "Rajdhani-Regular", size: 16) 
    ?? UIFont.systemFont(ofSize: 16, weight: .regular)

// Body font with fallback to SF Pro Text
let bodyFont = UIFont(name: "Inter-Regular", size: 16) 
    ?? UIFont.systemFont(ofSize: 16, weight: .regular)
```

### Fallback Behavior Summary

| Custom Font | Fallback Font | Platform Default |
|------------|---------------|------------------|
| Rajdhani (Display) | SF Pro Display | System font with matching weight |
| Inter (Body) | SF Pro Text | System font with matching weight |

**Fallback Trigger**: Fonts fall back when:
- Font files are missing from bundle
- Info.plist configuration is incorrect
- Font file is corrupted or invalid
- Font name is misspelled in code

---

## Verification

### Verify Fonts Are Available

Add this code to verify fonts are properly loaded:

```swift
import UIKit

func verifyCustomFonts() {
    let requiredFonts = [
        "Inter-Regular",
        "Inter-Medium",
        "Inter-SemiBold",
        "Inter-Bold",
        "Rajdhani-Regular",
        "Rajdhani-Medium",
        "Rajdhani-SemiBold",
        "Rajdhani-Bold"
    ]
    
    for fontName in requiredFonts {
        if UIFont(name: fontName, size: 12) != nil {
            print("✅ \(fontName) loaded successfully")
        } else {
            print("❌ \(fontName) failed to load")
        }
    }
}

// Call in AppDelegate or SceneDelegate
verifyCustomFonts()
```

### List All Available Fonts

To see all available fonts in your app:

```swift
for family in UIFont.familyNames.sorted() {
    print("Family: \(family)")
    for name in UIFont.fontNames(forFamilyName: family) {
        print("  - \(name)")
    }
}
```

---

## Troubleshooting

### Fonts Not Loading

**Problem**: Custom fonts don't appear in the app

**Solutions**:
1. Verify font files are in "Copy Bundle Resources" (Build Phases)
2. Check Info.plist has correct `UIAppFonts` array with exact file names
3. Ensure font file names match exactly (case-sensitive)
4. Clean build folder (Product → Clean Build Folder)
5. Delete derived data and rebuild

### Wrong Font Displayed

**Problem**: System font appears instead of custom font

**Solutions**:
1. Verify PostScript font name is correct (use Font Book on macOS)
2. Check font weight mapping matches available font files
3. Ensure font file is not corrupted (test in Font Book)
4. Use fallback font pattern to handle missing fonts gracefully

### Font Weight Not Working

**Problem**: All text appears in same weight

**Solutions**:
1. Verify all 4 weight files are included for each font family
2. Use correct PostScript names (e.g., "Inter-SemiBold" not "Inter-Semibold")
3. Check that font files contain the expected weights
4. Test each weight individually to isolate the issue

---

## Requirements Compliance

This documentation addresses the following requirements from Spec 015:

- **Requirement 7.1**: Inter and Rajdhani TTF files bundled in iOS app
- **Requirement 7.2**: Info.plist lists all font files in UIAppFonts array
- **Requirement 7.3**: SwiftUI code uses `.custom("Rajdhani", size:)` for display text
- **Requirement 7.4**: SwiftUI code uses `.custom("Inter", size:)` for body text
- **Requirement 7.5**: Font weight mapping and fallback behavior documented
  - Regular=400, Medium=500, SemiBold=600, Bold=700
  - Fallback to SF Pro Display for display text
  - Fallback to SF Pro Text for body text

---

## Related Documentation

- [Font Family Tokens](../../src/tokens/FontFamilyTokens.ts) - Token definitions
- [Typography Tokens](../../src/tokens/semantic/TypographyTokens.ts) - Semantic typography
- [Web Font Loading](../web-font-loading.md) - Web platform font integration
- [Android Font Integration](../android-font-setup.md) - Android platform font integration

---

**Organization**: platform-integration
**Scope**: 015-color-palette-update
