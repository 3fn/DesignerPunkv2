# iOS Asset Catalog Setup Instructions

**Date**: November 18, 2025
**Purpose**: Instructions for importing navigation icons to iOS Asset Catalog

---

## Overview

This document provides step-by-step instructions for importing the 5 navigation icons into the iOS Asset Catalog with template rendering mode for color tinting.

## Prerequisites

- Xcode installed
- iOS project with Asset Catalog (Icons.xcassets)

## Icons to Import

The following 5 navigation icons need to be imported:

1. arrow-right
2. arrow-left
3. arrow-up
4. arrow-down
5. chevron-right

## Source Files

Source SVG files are located in: `icons-feather/`

- `icons-feather/arrow-right.svg`
- `icons-feather/arrow-left.svg`
- `icons-feather/arrow-up.svg`
- `icons-feather/arrow-down.svg`
- `icons-feather/chevron-right.svg`

## Import Process

### Step 1: Open Asset Catalog

1. Open your iOS project in Xcode
2. Navigate to `Icons.xcassets` in the project navigator
3. If `Icons.xcassets` doesn't exist, create it:
   - Right-click project → New File → Asset Catalog
   - Name it `Icons.xcassets`

### Step 2: Create Icons Folder

1. Right-click inside `Icons.xcassets`
2. Select "New Folder"
3. Name it "Icons"

### Step 3: Import Each Icon

For each of the 5 navigation icons:

1. Right-click the "Icons" folder
2. Select "New Image Set"
3. Name the image set (use kebab-case):
   - `arrow-right`
   - `arrow-left`
   - `arrow-up`
   - `arrow-down`
   - `chevron-right`
4. Drag the corresponding SVG file from `icons-feather/` into the "Universal" slot
5. Xcode will automatically generate the necessary assets

### Step 4: Configure Template Rendering

For each icon image set:

1. Select the image set in the Asset Catalog
2. Open the Attributes Inspector (right panel)
3. Set "Render As" to "Template Image"
4. This enables color tinting via `.foregroundColor()` modifier

### Step 5: Verify Import

1. Build the project (⌘B)
2. Verify no errors in the build log
3. Check that all 5 icons appear in the Asset Catalog preview

## Asset Catalog Structure

After import, your Asset Catalog should have this structure:

```
Icons.xcassets/
└── Icons/
    ├── arrow-right.imageset/
    │   ├── arrow-right.svg (or generated PDF/PNG)
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
    └── chevron-right.imageset/
        ├── chevron-right.svg
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

- [ ] All 5 icons imported to Asset Catalog
- [ ] Each icon in "Icons" folder
- [ ] "Render As" set to "Template Image" for all icons
- [ ] Project builds without errors
- [ ] Icons visible in Asset Catalog preview
- [ ] Icons render correctly in app with color tinting

---

**Note**: This is a manual process that requires Xcode. The Asset Catalog cannot be programmatically generated from this codebase. Once imported, the icons will be available for use in the Icon component implementation.
