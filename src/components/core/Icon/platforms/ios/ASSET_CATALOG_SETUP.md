# iOS Asset Catalog Setup Instructions

**Date**: November 18, 2025
**Updated**: November 18, 2025 (Task 4.2)
**Purpose**: Instructions for importing icons to iOS Asset Catalog

---

## Overview

This document provides step-by-step instructions for importing icons into the iOS Asset Catalog with template rendering mode for color tinting.

## Asset Catalog Structure

The Asset Catalog structure has been created at:
- **Location**: `src/components/core/Icon/platforms/ios/Icons.xcassets/`
- **Icons Folder**: `Icons.xcassets/Icons/`
- **Configuration**: Template rendering enabled for color tinting

## Prerequisites

- Xcode installed
- iOS project setup
- Asset Catalog structure created (✅ Complete)

## Current Status

**Asset Catalog Structure**: ✅ Created
- `Icons.xcassets/` - Root Asset Catalog directory
- `Icons.xcassets/Contents.json` - Asset Catalog configuration
- `Icons.xcassets/Icons/` - Icons folder for organizing icon assets
- `Icons.xcassets/Icons/Contents.json` - Icons folder configuration with namespace

**Icons Already Imported**: 2 icons
- circle
- heart

**Icons Remaining**: 13 icons need manual import via Xcode

## Icons to Import

The following 15 icons are part of the Icon System:

### Navigation Icons (5)
1. arrow-right
2. arrow-left
3. arrow-up
4. arrow-down
5. chevron-right

### Action Icons (4)
6. check
7. x
8. plus
9. minus

### UI Element Icons (2)
10. circle ✅ (already imported)
11. heart ✅ (already imported)

### Complex Icons (4)
12. settings
13. user
14. mail
15. calendar

## Source Files

Source SVG files are located in: `icons-feather/`

All 15 icon SVG files are available in the `icons-feather/` directory at the project root.

## Import Process

### Step 1: Add Asset Catalog to Xcode Project

**Note**: The Asset Catalog structure has been created in the codebase, but it needs to be added to your Xcode project.

1. Open your iOS project in Xcode
2. In the Project Navigator, navigate to where you want to add the Asset Catalog
3. Right-click and select "Add Files to [Project Name]..."
4. Navigate to: `src/components/core/Icon/platforms/ios/Icons.xcassets`
5. Select `Icons.xcassets` folder
6. Ensure "Copy items if needed" is **unchecked** (we want to reference, not copy)
7. Ensure "Create groups" is selected
8. Click "Add"

### Step 2: Verify Asset Catalog Structure

1. In Xcode, navigate to `Icons.xcassets` in the project navigator
2. You should see the "Icons" folder
3. Inside the Icons folder, you should see existing icons (circle, heart)

### Step 3: Import Remaining Icons

For each of the 13 remaining icons:

1. Right-click the "Icons" folder in Xcode
2. Select "New Image Set"
3. Name the image set (use kebab-case matching the icon name):
   - Navigation: `arrow-right`, `arrow-left`, `arrow-up`, `arrow-down`, `chevron-right`
   - Actions: `check`, `x`, `plus`, `minus`
   - Complex: `settings`, `user`, `mail`, `calendar`
4. Drag the corresponding SVG file from `icons-feather/` directory into the "Universal" slot
5. Xcode will automatically process the SVG

### Step 4: Configure Template Rendering

For each icon image set:

1. Select the image set in the Asset Catalog
2. Open the Attributes Inspector (right panel)
3. Set "Render As" to "Template Image"
4. This enables color tinting via `.foregroundColor()` modifier

### Step 5: Verify Import

1. Build the project (⌘B)
2. Verify no errors in the build log
3. Check that all 15 icons appear in the Asset Catalog preview
4. Verify each icon has "Template Image" rendering mode set

## Complete Asset Catalog Structure

After all imports are complete, your Asset Catalog should have this structure:

```
Icons.xcassets/
├── Contents.json                    # Asset Catalog configuration
└── Icons/
    ├── Contents.json                # Icons folder configuration
    ├── arrow-right.imageset/
    │   ├── arrow-right.svg
    │   └── Contents.json
    ├── arrow-left.imageset/
    │   ├── arrow-left.svg
    │   └── Contents.json
    ├── arrow-up.imageset/
    │   ├── arrow-up.svg
    │   └── Contents.json
    ├── arrow-down.imageset/
    │   ├── arrow-down.svg
    │   └── Contents.json
    ├── chevron-right.imageset/
    │   ├── chevron-right.svg
    │   └── Contents.json
    ├── check.imageset/
    │   ├── check.svg
    │   └── Contents.json
    ├── x.imageset/
    │   ├── x.svg
    │   └── Contents.json
    ├── plus.imageset/
    │   ├── plus.svg
    │   └── Contents.json
    ├── minus.imageset/
    │   ├── minus.svg
    │   └── Contents.json
    ├── circle.imageset/              # ✅ Already imported
    │   ├── circle.svg
    │   └── Contents.json
    ├── heart.imageset/               # ✅ Already imported
    │   ├── heart.svg
    │   └── Contents.json
    ├── settings.imageset/
    │   ├── settings.svg
    │   └── Contents.json
    ├── user.imageset/
    │   ├── user.svg
    │   └── Contents.json
    ├── mail.imageset/
    │   ├── mail.svg
    │   └── Contents.json
    └── calendar.imageset/
        ├── calendar.svg
        └── Contents.json
```

## Usage in SwiftUI

Once imported, use icons in SwiftUI code:

```swift
// Example usage
Image("arrow-right")
    .resizable()
    .renderingMode(.template)
    .frame(width: 24, height: 24)
    .foregroundColor(.primary)
```

Or with the Icon component:

```swift
Icon(name: "arrow-right", size: 24)
```

## Troubleshooting

### Icon Not Appearing

- Verify the image set name matches exactly (kebab-case)
- Check that "Render As" is set to "Template Image"
- Clean build folder (⌘⇧K) and rebuild

### Color Not Changing

- Ensure "Render As" is set to "Template Image"
- Verify `.foregroundColor()` modifier is applied
- Check that the SVG uses `stroke="currentColor"`

### Build Errors

- Verify SVG files are valid
- Check that Asset Catalog is included in target membership
- Ensure no duplicate image set names

## Verification Checklist

### Asset Catalog Structure (Task 4.2)
- [x] `Icons.xcassets/` directory created
- [x] `Icons.xcassets/Contents.json` created
- [x] `Icons/` folder created within Asset Catalog
- [x] `Icons/Contents.json` created with namespace configuration
- [ ] Asset Catalog added to Xcode project

### Icon Import (Manual Process)
- [x] circle icon imported (2/15)
- [x] heart icon imported (2/15)
- [ ] All 15 icons imported to Asset Catalog (13 remaining)
- [ ] Each icon in "Icons" folder
- [ ] "Render As" set to "Template Image" for all icons
- [ ] Project builds without errors
- [ ] Icons visible in Asset Catalog preview
- [ ] Icons render correctly in app with color tinting

---

**Note**: This is a manual process that requires Xcode. The Asset Catalog cannot be programmatically generated from this codebase. Once imported, the icons will be available for use in the Icon component implementation.
