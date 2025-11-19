# Icon Conversion Guide

**Date**: November 18, 2025
**Spec**: 004 - Icon System
**Purpose**: Step-by-step guide for converting icons to platform-specific formats
**Organization**: spec-guide
**Scope**: 004-icon-system

---

## Overview

This guide provides detailed instructions for converting Feather Icons from the source `icons-feather/` directory to platform-specific formats for web (SVG), iOS (Asset Catalog), and Android (VectorDrawable).

**Target Audience**: Developers adding new icons to the Icon System

**Prerequisites**:
- Source icon available in `icons-feather/` directory
- Basic understanding of SVG format
- Xcode installed (for iOS conversion)
- Android Studio installed (for Android conversion)

---

## Quick Reference

### Conversion Checklist

For each new icon, complete these steps:

- [ ] **Web**: Optimize SVG and save to web assets directory
- [ ] **iOS**: Import to Asset Catalog with template rendering
- [ ] **Android**: Convert to VectorDrawable XML
- [ ] **Documentation**: Update icon conversion log
- [ ] **Type Definitions**: Add icon name to `IconName` type
- [ ] **Component Integration**: Update platform-specific icon mappings
- [ ] **Verification**: Test icon renders correctly on all platforms

### Platform-Specific Paths

| Platform | Output Location | Format | Naming Convention |
|----------|----------------|--------|-------------------|
| Web | `src/components/core/Icon/platforms/web/assets/` | Optimized SVG | kebab-case (arrow-right.svg) |
| iOS | `Icons.xcassets/Icons/` | Asset Catalog | kebab-case (arrow-right) |
| Android | `src/components/core/Icon/platforms/android/res/drawable/` | VectorDrawable XML | snake_case (arrow_right.xml) |

---

## Web Platform Conversion

### Process Overview

Web conversion is the simplest - we optimize the source SVG by removing unnecessary attributes while preserving color inheritance.

### Step-by-Step Instructions

#### Step 1: Locate Source Icon

1. Navigate to `icons-feather/` directory in the project root
2. Find the icon file (e.g., `arrow-right.svg`)
3. Open the file in a text editor

**Example Source SVG**:
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right">
  <line x1="5" y1="12" x2="19" y2="12"></line>
  <polyline points="12 5 19 12 12 19"></polyline>
</svg>
```

#### Step 2: Remove Class Attribute

1. Copy the entire SVG content
2. Remove the `class="feather feather-[icon-name]"` attribute
3. Keep all other attributes intact (especially `stroke="currentColor"`)

**Optimized SVG**:
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="5" y1="12" x2="19" y2="12"></line>
  <polyline points="12 5 19 12 12 19"></polyline>
</svg>
```

#### Step 3: Save to Web Assets Directory

1. Create a new file in `src/components/core/Icon/platforms/web/assets/`
2. Name the file using kebab-case: `[icon-name].svg`
3. Paste the optimized SVG content
4. Save the file

**Output Path Example**: `src/components/core/Icon/platforms/web/assets/arrow-right.svg`

#### Step 4: Verify Web Conversion

1. Check that `stroke="currentColor"` is present (enables color inheritance)
2. Verify `viewBox="0 0 24 24"` is correct (maintains proper scaling)
3. Confirm file size is reasonable (should be < 1KB for simple icons)
4. Test that SVG renders correctly in browser

### Web Conversion Notes

**What to Keep**:
- `xmlns` attribute (required for SVG)
- `width` and `height` attributes (24x24 standard)
- `viewBox` attribute (defines coordinate system)
- `fill="none"` (Feather Icons are stroke-based)
- `stroke="currentColor"` (enables color inheritance)
- `stroke-width`, `stroke-linecap`, `stroke-linejoin` (visual properties)
- All path elements (`<line>`, `<polyline>`, `<path>`, `<circle>`, `<rect>`)

**What to Remove**:
- `class` attribute (not needed for inline SVG)
- Any `id` attributes (not needed for component usage)
- Comments or metadata (keep SVG clean)

**Common Issues**:
- **Missing currentColor**: If `stroke="currentColor"` is missing, add it manually
- **Wrong viewBox**: Ensure viewBox is `0 0 24 24` for Feather Icons
- **Extra attributes**: Remove any non-essential attributes

---

## iOS Platform Conversion

### Process Overview

iOS conversion requires manual import to Xcode Asset Catalog with template rendering mode enabled for color tinting.

### Prerequisites

- Xcode installed and iOS project set up
- Asset Catalog structure created at `src/components/core/Icon/platforms/ios/Icons.xcassets/`
- Asset Catalog added to Xcode project (see ASSET_CATALOG_SETUP.md)

### Step-by-Step Instructions

#### Step 1: Open Xcode Project

1. Launch Xcode
2. Open your iOS project
3. Navigate to the Asset Catalog in the Project Navigator
4. Locate `Icons.xcassets` → `Icons` folder

#### Step 2: Create New Image Set

1. Right-click the "Icons" folder in the Asset Catalog
2. Select "New Image Set" from the context menu
3. A new image set will be created with a default name

**Screenshot Reference**: Right-click → New Image Set

#### Step 3: Name the Image Set

1. Select the newly created image set
2. In the Attributes Inspector (right panel), find the "Name" field
3. Enter the icon name using kebab-case (e.g., `arrow-right`)
4. Press Enter to confirm

**Naming Convention**: Use kebab-case matching the web icon name
- ✅ Correct: `arrow-right`, `chevron-right`, `user`
- ❌ Incorrect: `arrow_right`, `arrowRight`, `ArrowRight`

#### Step 4: Import SVG File

1. Locate the source SVG in `icons-feather/` directory
2. Drag the SVG file from Finder into the "Universal" slot in the image set
3. Xcode will automatically process the SVG

**Alternative Method**:
1. Click the "Universal" slot
2. Click "Select File..." button
3. Navigate to `icons-feather/` directory
4. Select the icon SVG file
5. Click "Open"

**Screenshot Reference**: Drag SVG to Universal slot

#### Step 5: Configure Template Rendering

1. Select the image set in the Asset Catalog
2. Open the Attributes Inspector (right panel, ⌥⌘4)
3. Find "Render As" dropdown
4. Select "Template Image" from the dropdown

**Why Template Rendering?**
- Enables color tinting via `.foregroundColor()` modifier
- Allows icon color to change dynamically
- Matches web's `stroke="currentColor"` behavior

**Screenshot Reference**: Render As → Template Image

#### Step 6: Verify Import

1. Check that the icon preview appears in the Asset Catalog
2. Verify the icon name is correct (kebab-case)
3. Confirm "Render As" is set to "Template Image"
4. Build the project (⌘B) to verify no errors

### iOS Conversion Notes

**Asset Catalog Structure**:
```
Icons.xcassets/
├── Contents.json
└── Icons/
    ├── Contents.json
    └── arrow-right.imageset/
        ├── arrow-right.svg
        └── Contents.json
```

**Image Set Configuration** (Contents.json):
```json
{
  "images" : [
    {
      "filename" : "arrow-right.svg",
      "idiom" : "universal"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  },
  "properties" : {
    "template-rendering-intent" : "template"
  }
}
```

**Common Issues**:

**Issue**: Icon doesn't appear in preview
- **Solution**: Verify SVG is valid and viewBox is correct
- **Solution**: Try reimporting the SVG file
- **Solution**: Clean build folder (⌘⇧K) and rebuild

**Issue**: Icon color doesn't change
- **Solution**: Ensure "Render As" is set to "Template Image"
- **Solution**: Verify `.foregroundColor()` modifier is applied in code
- **Solution**: Check that SVG uses `stroke="currentColor"`

**Issue**: Build errors after import
- **Solution**: Verify image set name doesn't conflict with existing names
- **Solution**: Check that Asset Catalog is included in target membership
- **Solution**: Ensure SVG file is valid XML

### iOS Usage Example

Once imported, use the icon in SwiftUI:

```swift
// Direct Image usage
Image("arrow-right")
    .resizable()
    .renderingMode(.template)
    .frame(width: 24, height: 24)
    .foregroundColor(.primary)

// Icon component usage
Icon(name: "arrow-right", size: 24)
```

---

## Android Platform Conversion

### Process Overview

Android conversion transforms SVG paths into VectorDrawable XML format using Android Studio's Vector Asset tool.

### Prerequisites

- Android Studio installed
- Android project set up
- Drawable directory exists at `src/components/core/Icon/platforms/android/res/drawable/`

### Step-by-Step Instructions

#### Step 1: Open Android Studio

1. Launch Android Studio
2. Open your Android project
3. Navigate to the Project view (left panel)
4. Locate `res/drawable/` directory

#### Step 2: Create New Vector Asset

1. Right-click `res/drawable/` directory
2. Select "New" → "Vector Asset"
3. The "Vector Asset Studio" dialog will open

**Screenshot Reference**: Right-click → New → Vector Asset

#### Step 3: Configure Vector Asset

1. In the Vector Asset Studio dialog:
   - **Asset Type**: Select "Local file (SVG, PSD)"
   - **Path**: Click the folder icon to browse
   - Navigate to `icons-feather/` directory
   - Select the icon SVG file (e.g., `arrow-right.svg`)
   - Click "Open"

2. **Name**: Enter the resource name using snake_case
   - Convert kebab-case to snake_case: `arrow-right` → `arrow_right`
   - ✅ Correct: `arrow_right`, `chevron_right`, `user`
   - ❌ Incorrect: `arrow-right`, `arrowRight`, `ArrowRight`

3. **Size**: Keep default (24dp × 24dp)

4. **Opacity**: Keep default (100%)

5. **Enable auto mirroring**: Leave unchecked (not needed for these icons)

**Screenshot Reference**: Vector Asset Studio configuration

#### Step 4: Preview and Confirm

1. Review the icon preview in the Vector Asset Studio
2. Verify the icon looks correct
3. Check that the resource name uses snake_case
4. Click "Next"

#### Step 5: Confirm Resource Directory

1. The "Confirm Icon Path" screen will show:
   - **Res Directory**: Should be `res/`
   - **Output File**: Should be `drawable/[icon_name].xml`
2. Verify the path is correct
3. Click "Finish"

Android Studio will generate the VectorDrawable XML file.

#### Step 6: Verify Generated XML

1. Navigate to `res/drawable/` in Project view
2. Locate the newly created XML file (e.g., `arrow_right.xml`)
3. Open the file to verify the VectorDrawable format

**Expected VectorDrawable Format**:
```xml
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
  <path
      android:pathData="M5,12L19,12"
      android:strokeWidth="2"
      android:strokeColor="@android:color/white"
      android:strokeLineCap="round"/>
  <path
      android:pathData="M12,5L19,12L12,19"
      android:strokeWidth="2"
      android:strokeColor="@android:color/white"
      android:strokeLineCap="round"
      android:strokeLineJoin="round"/>
</vector>
```

#### Step 7: Verify Android Studio Recognition

1. Check that the icon preview appears in Android Studio
2. Type `R.drawable.` in code and verify the icon name appears in autocomplete
3. Build the project to verify no errors
4. Check that the icon renders correctly in the app

### Android Conversion Notes

**VectorDrawable Attributes**:
- `android:width/height`: Physical size (24dp standard)
- `android:viewportWidth/Height`: Coordinate system (24×24 grid)
- `android:pathData`: SVG path commands converted to Android format
- `android:strokeWidth`: Line thickness (2dp for Feather Icons)
- `android:strokeColor`: Default color (tinted at runtime via `LocalContentColor`)
- `android:strokeLineCap`: Line ending style (round)
- `android:strokeLineJoin`: Corner style (round)

**Naming Convention Conversion**:

| Web/iOS Name | Android Resource Name |
|--------------|----------------------|
| arrow-right  | arrow_right.xml      |
| chevron-right| chevron_right.xml    |
| user         | user.xml             |

**Common Issues**:

**Issue**: Vector Asset Studio fails to import SVG
- **Solution**: Verify SVG is valid XML
- **Solution**: Check that SVG uses supported features (no filters, gradients, etc.)
- **Solution**: Try simplifying the SVG if it's too complex

**Issue**: Generated VectorDrawable looks incorrect
- **Solution**: Check that viewBox in source SVG is `0 0 24 24`
- **Solution**: Verify stroke properties are preserved
- **Solution**: Try reimporting with different settings

**Issue**: Resource name conflicts
- **Solution**: Ensure no existing drawable has the same name
- **Solution**: Use unique snake_case names
- **Solution**: Check for typos in resource name

**Issue**: Icon doesn't show preview in Android Studio
- **Solution**: Sync Gradle files (File → Sync Project with Gradle Files)
- **Solution**: Invalidate caches (File → Invalidate Caches / Restart)
- **Solution**: Verify VectorDrawable XML is valid

### Android Usage Example

Once converted, use the icon in Jetpack Compose:

```kotlin
// Icon component usage
Icon(name = "arrow-right", size = 24.dp)

// Direct Icon usage
Icon(
    painter = painterResource(id = R.drawable.arrow_right),
    contentDescription = null,
    modifier = Modifier.size(24.dp),
    tint = LocalContentColor.current
)
```

---

## Post-Conversion Steps

After converting an icon for all three platforms, complete these integration steps:

### Step 1: Update Icon Conversion Log

1. Open `.kiro/specs/004-icon-system/icon-conversion-log.md`
2. Add a new section for the icon with conversion details
3. Document any issues encountered and resolutions
4. Include conversion date and complexity assessment

**Template**:
```markdown
### [icon-name]

**Source**: `icons-feather/[icon-name].svg`
**Converted**: [Date]
**Complexity**: [Simple/Medium/Complex]

#### Web
- **Path**: `src/components/core/Icon/platforms/web/assets/[icon-name].svg`
- **Optimization**: Removed class attribute
- **Issues**: [None or describe issues]

#### iOS
- **Path**: `Icons.xcassets/Icons/[icon-name].imageset/`
- **Format**: SVG
- **Rendering Mode**: Template
- **Issues**: [None or describe issues]

#### Android
- **Path**: `src/components/core/Icon/platforms/android/res/drawable/[icon_name].xml`
- **Format**: VectorDrawable
- **Issues**: [None or describe issues]
```

### Step 2: Update Type Definitions

1. Open `src/components/core/Icon/types.ts`
2. Add the new icon name to the `IconName` type
3. Maintain alphabetical order within icon categories

**Example**:
```typescript
export type IconName = 
  // Navigation
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-down'
  | 'chevron-right'
  | 'new-icon'  // Add new icon here
  
  // Actions
  | 'check'
  | 'x'
  // ... rest of icons
```

### Step 3: Update Platform-Specific Icon Mappings

#### Web Component

1. Open `src/components/core/Icon/platforms/web/Icon.web.ts`
2. Add import for the new icon SVG
3. Update the icon mapping object

**Example**:
```typescript
import newIconSvg from './assets/new-icon.svg';

const iconMap: Record<IconName, string> = {
  'arrow-right': arrowRightSvg,
  'new-icon': newIconSvg,  // Add new icon
  // ... rest of icons
};
```

#### iOS Component

No code changes needed - Asset Catalog handles icon lookup by name.

#### Android Component

1. Open `src/components/core/Icon/platforms/android/Icon.android.kt`
2. Add mapping in `getIconResource()` function

**Example**:
```kotlin
private fun getIconResource(name: String): Int {
    return when (name) {
        "arrow-right" -> R.drawable.arrow_right
        "new-icon" -> R.drawable.new_icon  // Add new icon
        // ... rest of icons
        else -> R.drawable.circle // Fallback
    }
}
```

### Step 4: Update Component README

1. Open `src/components/core/Icon/README.md`
2. Add the new icon to the "Available Icons" list
3. Update the icon count if needed

### Step 5: Verify Cross-Platform Consistency

1. Build all three platforms
2. Verify the icon renders correctly on each platform
3. Test color inheritance works on all platforms
4. Check that icon sizes are consistent
5. Verify accessibility (aria-hidden, accessibilityHidden, contentDescription=null)

---

## Troubleshooting

### General Issues

**Issue**: Icon looks different across platforms
- **Cause**: Source SVG has platform-specific rendering issues
- **Solution**: Verify viewBox is `0 0 24 24` on all platforms
- **Solution**: Check that stroke properties are preserved
- **Solution**: Compare generated files to ensure paths match

**Issue**: Icon color doesn't inherit correctly
- **Cause**: Color inheritance not configured properly
- **Solution**: Web - Verify `stroke="currentColor"` in SVG
- **Solution**: iOS - Ensure "Render As" is "Template Image"
- **Solution**: Android - Check `tint = LocalContentColor.current` in component

**Issue**: Icon appears blurry or pixelated
- **Cause**: Vector format not preserved or wrong size
- **Solution**: Verify using vector formats (SVG, VectorDrawable)
- **Solution**: Check that viewBox/viewport dimensions are correct
- **Solution**: Ensure icon is scaled properly (not rasterized)

### Platform-Specific Issues

**Web**:
- **Issue**: SVG doesn't render in browser
  - **Solution**: Verify SVG is valid XML
  - **Solution**: Check that all tags are properly closed
  - **Solution**: Ensure xmlns attribute is present

**iOS**:
- **Issue**: Asset Catalog not recognized by Xcode
  - **Solution**: Add Asset Catalog to Xcode project
  - **Solution**: Verify Asset Catalog is in target membership
  - **Solution**: Clean build folder and rebuild

**Android**:
- **Issue**: VectorDrawable conversion fails
  - **Solution**: Simplify SVG (remove unsupported features)
  - **Solution**: Check that SVG uses only supported elements
  - **Solution**: Try manual XML conversion if automated fails

---

## Best Practices

### Before Converting

1. **Verify Source Quality**: Ensure source SVG is clean and optimized
2. **Check Complexity**: Assess icon complexity (simple/medium/complex)
3. **Review Existing Icons**: Look at similar icons for consistency
4. **Plan Naming**: Decide on icon name before starting conversion

### During Conversion

1. **Follow Naming Conventions**: Use kebab-case for web/iOS, snake_case for Android
2. **Preserve Stroke Properties**: Maintain stroke-width, linecap, linejoin
3. **Enable Color Inheritance**: Configure template rendering (iOS) and currentColor (web)
4. **Document Issues**: Note any problems encountered during conversion

### After Conversion

1. **Test All Platforms**: Verify icon works on web, iOS, and Android
2. **Check Consistency**: Ensure visual consistency across platforms
3. **Update Documentation**: Add to conversion log and README
4. **Verify Integration**: Test icon in actual component usage

---

## Conversion Checklist

Use this checklist when adding a new icon:

### Pre-Conversion
- [ ] Source SVG available in `icons-feather/` directory
- [ ] Icon name decided (kebab-case)
- [ ] Complexity assessed (simple/medium/complex)

### Web Conversion
- [ ] Removed class attribute from SVG
- [ ] Verified `stroke="currentColor"` is present
- [ ] Saved to `src/components/core/Icon/platforms/web/assets/[icon-name].svg`
- [ ] File size reasonable (< 1KB for simple icons)

### iOS Conversion
- [ ] Created new image set in Asset Catalog
- [ ] Named image set using kebab-case
- [ ] Imported SVG to Universal slot
- [ ] Set "Render As" to "Template Image"
- [ ] Verified icon preview appears
- [ ] Build succeeds without errors

### Android Conversion
- [ ] Used Vector Asset Studio to import SVG
- [ ] Named resource using snake_case
- [ ] Verified VectorDrawable XML generated correctly
- [ ] Icon preview appears in Android Studio
- [ ] Resource ID available via `R.drawable.[icon_name]`
- [ ] Build succeeds without errors

### Integration
- [ ] Updated icon conversion log
- [ ] Added icon name to `IconName` type in types.ts
- [ ] Updated web component icon mapping
- [ ] Updated Android component `getIconResource()` function
- [ ] Updated component README with new icon
- [ ] Verified cross-platform consistency
- [ ] Tested color inheritance on all platforms
- [ ] Verified accessibility (hidden from screen readers)

### Documentation
- [ ] Conversion log entry complete
- [ ] Any issues documented with resolutions
- [ ] README updated with new icon
- [ ] Icon count updated if needed

---

## Examples

### Example 1: Simple Icon (arrow-right)

**Complexity**: Simple (2 paths: line + polyline)

**Web Conversion**:
```xml
<!-- Source: icons-feather/arrow-right.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="5" y1="12" x2="19" y2="12"></line>
  <polyline points="12 5 19 12 12 19"></polyline>
</svg>
```

**iOS Conversion**:
- Image set name: `arrow-right`
- Render As: Template Image
- Format: SVG

**Android Conversion**:
```xml
<!-- res/drawable/arrow_right.xml -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
  <path
      android:pathData="M5,12L19,12"
      android:strokeWidth="2"
      android:strokeColor="@android:color/white"
      android:strokeLineCap="round"/>
  <path
      android:pathData="M12,5L19,12L12,19"
      android:strokeWidth="2"
      android:strokeColor="@android:color/white"
      android:strokeLineCap="round"
      android:strokeLineJoin="round"/>
</vector>
```

### Example 2: Complex Icon (settings)

**Complexity**: Complex (2 paths: circle + complex gear path)

**Web Conversion**:
```xml
<!-- Source: icons-feather/settings.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="3"></circle>
  <path d="M12 1v6m0 6v6m6-12h-6m-6 0H1m17.66 5.34l-4.24 4.24m-6.36 0L3.34 17.66M17.66 17.66l-4.24-4.24m-6.36 0L3.34 6.34"></path>
</svg>
```

**iOS Conversion**:
- Image set name: `settings`
- Render As: Template Image
- Format: SVG
- Note: Complex path preserved correctly

**Android Conversion**:
```xml
<!-- res/drawable/settings.xml -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
  <path
      android:pathData="M12,12m-3,0a3,3 0,1 1,6 0a3,3 0,1 1,-6 0"
      android:strokeWidth="2"
      android:strokeColor="@android:color/white"
      android:strokeLineCap="round"
      android:strokeLineJoin="round"/>
  <path
      android:pathData="M12,1L12,7M12,13L12,19M18,6L12,12M6,12L1,12M17.66,6.34L13.42,10.58M10.58,13.42L6.34,17.66M17.66,17.66L13.42,13.42M10.58,10.58L6.34,6.34"
      android:strokeWidth="2"
      android:strokeColor="@android:color/white"
      android:strokeLineCap="round"
      android:strokeLineJoin="round"/>
</vector>
```

---

## Additional Resources

### Documentation References

- **Icon Conversion Log**: `.kiro/specs/004-icon-system/icon-conversion-log.md`
- **iOS Asset Catalog Setup**: `src/components/core/Icon/platforms/ios/ASSET_CATALOG_SETUP.md`
- **Android Drawable README**: `src/components/core/Icon/platforms/android/res/drawable/README.md`
- **Icon Component README**: `src/components/core/Icon/README.md`
- **Type Definitions**: `src/components/core/Icon/types.ts`

### External Resources

- **Feather Icons**: https://github.com/feathericons/feather
- **SVG Specification**: https://www.w3.org/TR/SVG2/
- **iOS Asset Catalog**: https://developer.apple.com/library/archive/documentation/Xcode/Reference/xcode_ref-Asset_Catalog_Format/
- **Android VectorDrawable**: https://developer.android.com/guide/topics/graphics/vector-drawable-resources

---

**Organization**: spec-guide
**Scope**: 004-icon-system

*This guide provides comprehensive instructions for converting icons to all platform-specific formats with detailed troubleshooting and best practices.*
