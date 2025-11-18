# Design Document: Icon System

**Date**: November 18, 2025
**Spec**: 004 - Icon System
**Status**: Design Phase
**Dependencies**: None (foundational infrastructure)

---

## Overview

The Icon System provides cross-platform infrastructure for displaying vector icons with a unified component API. The system uses Feather Icons (280+ open-source icons) as the source library, with a documented manual conversion process to platform-specific formats. The initial implementation includes 15 icons (~5% sample) with four size variants (16px, 24px, 32px, 40px) aligned to the 8px baseline grid. Icons automatically inherit text color from parent components and include TypeScript type safety for icon names.

**Key Design Principles:**
- **True Native Architecture**: Separate implementations per platform (web, iOS, Android)
- **Manual conversion process**: Document and prove the process before automating
- **Type safety**: Compile-time validation of icon names and sizes
- **Color inheritance**: Icons automatically match parent text color
- **Extensibility**: Easy to add new icons and sizes without API changes

---

## Architecture

### System Components

```
Icon System
├── Icon Component (Platform-Specific)
│   ├── Icon.web.tsx (React/TypeScript)
│   ├── Icon.ios.swift (SwiftUI)
│   └── Icon.android.kt (Jetpack Compose)
│
├── Type Definitions
│   ├── IconName (TypeScript union type)
│   └── IconSize (TypeScript union type)
│
├── Icon Assets (Platform-Specific)
│   ├── web/ (Optimized SVG files)
│   ├── ios/ (Asset Catalog with PDF/PNG)
│   └── android/ (VectorDrawable XML)
│
└── Conversion Documentation
    └── icon-conversion-log.md (Conversion process and issues)
```

### Component Hierarchy

```
Button Component (Consumer)
    ↓
Icon Component (Platform-Specific)
    ↓
Icon Assets (Platform-Specific Format)
    ↓
Feather Icons Source (icons-feather/ directory)
```

---

## Components and Interfaces

### TypeScript Type Definitions

```typescript
// src/components/core/Icon/types.ts

/**
 * Icon names for type-safe icon usage
 * 
 * Initial set: 15 icons (~5% of Feather Icons)
 * Manually defined for initial implementation
 * Future: Auto-generate from icons directory
 */
export type IconName = 
  // Navigation
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-down'
  | 'chevron-right'
  
  // Actions
  | 'check'
  | 'x'
  | 'plus'
  | 'minus'
  
  // UI Elements
  | 'circle'
  | 'heart'
  
  // Complex Icons
  | 'settings'
  | 'user'
  | 'mail'
  | 'calendar';

/**
 * Icon size variants aligned with 8px baseline grid
 * 
 * Initial sizes: 16, 24, 32, 40
 * Future: Can add 4pt subgrid sizes (12, 20, 28, 36, 44, 48) as needed
 */
export type IconSize = 16 | 24 | 32 | 40;

/**
 * Icon component props (platform-agnostic interface)
 */
export interface IconProps {
  /** Icon name (type-safe) */
  name: IconName;
  
  /** Icon size in pixels */
  size: IconSize;
  
  /** Optional CSS class name (web only) */
  className?: string;
  
  /** Optional style overrides (platform-specific) */
  style?: React.CSSProperties | object;
  
  /** Optional test ID for testing */
  testID?: string;
}
```

### Web Implementation (React/TypeScript)

```typescript
// src/components/core/Icon/platforms/web/Icon.web.tsx

import React from 'react';
import { IconProps } from '../../types';

/**
 * Icon component for web platform
 * 
 * Renders inline SVG with currentColor inheritance
 * SVG assets loaded from optimized SVG files
 */
export const Icon: React.FC<IconProps> = ({ 
  name, 
  size, 
  className = '',
  style = {},
  testID 
}) => {
  // Load SVG content based on icon name
  const svgContent = loadIconSVG(name);
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon icon-${name} ${className}`}
      style={{ color: 'currentColor', ...style }}
      aria-hidden="true"
      data-testid={testID}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

/**
 * Load SVG content for icon name
 * Implementation: Import SVG files or use dynamic import
 */
function loadIconSVG(name: IconName): string {
  // Implementation will load from assets/web/ directory
  // For now, placeholder for design documentation
  return `<!-- SVG content for ${name} -->`;
}
```

### iOS Implementation (SwiftUI)

```swift
// src/components/core/Icon/platforms/ios/Icon.ios.swift

import SwiftUI

/**
 * Icon component for iOS platform
 * 
 * Renders Image from Asset Catalog with template rendering
 * Icons inherit foreground color from environment
 */
struct Icon: View {
    let name: String
    let size: CGFloat
    
    var body: some View {
        Image(name)
            .resizable()
            .renderingMode(.template) // Enable color tinting
            .frame(width: size, height: size)
            .foregroundColor(.primary) // Inherits from environment
            .accessibilityHidden(true) // Decorative icon
    }
}

// Usage example
Icon(name: "arrow-right", size: 24)
```

### Android Implementation (Jetpack Compose)

```kotlin
// src/components/core/Icon/platforms/android/Icon.android.kt

package com.designerpunk.components.core

import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.material3.LocalContentColor

/**
 * Icon component for Android platform
 * 
 * Renders Icon from VectorDrawable resources
 * Icons inherit tint color from LocalContentColor
 */
@Composable
fun Icon(
    name: String,
    size: Dp,
    modifier: Modifier = Modifier
) {
    Icon(
        painter = painterResource(id = getIconResource(name)),
        contentDescription = null, // Decorative icon
        modifier = modifier.size(size),
        tint = LocalContentColor.current // Inherits from composition local
    )
}

/**
 * Map icon name to drawable resource ID
 */
private fun getIconResource(name: String): Int {
    return when (name) {
        "arrow-right" -> R.drawable.arrow_right
        "arrow-left" -> R.drawable.arrow_left
        "check" -> R.drawable.check
        "x" -> R.drawable.x
        // ... other icons
        else -> R.drawable.circle // Fallback
    }
}

// Usage example
Icon(name = "arrow-right", size = 24.dp)
```

---

## Data Models

### Icon Asset Structure

```
src/components/core/Icon/
├── types.ts                    # TypeScript type definitions
├── platforms/
│   ├── web/
│   │   ├── Icon.web.tsx       # Web component
│   │   └── assets/
│   │       ├── arrow-right.svg
│   │       ├── check.svg
│   │       └── ... (15 icons)
│   │
│   ├── ios/
│   │   ├── Icon.ios.swift     # iOS component
│   │   └── Assets.xcassets/
│   │       └── Icons/
│   │           ├── arrow-right.imageset/
│   │           │   ├── arrow-right.pdf
│   │           │   └── Contents.json
│   │           └── ... (15 icons)
│   │
│   └── android/
│       ├── Icon.android.kt    # Android component
│       └── res/drawable/
│           ├── arrow_right.xml
│           ├── check.xml
│           └── ... (15 icons)
│
└── README.md                   # Component documentation
```

### Icon Conversion Log

```markdown
# Icon Conversion Log

## arrow-right

**Source**: `icons-feather/arrow-right.svg`
**Converted**: November 18, 2025

### Web
- **Path**: `src/components/core/Icon/platforms/web/assets/arrow-right.svg`
- **Optimization**: Removed class attribute, kept stroke="currentColor"
- **Issues**: None

### iOS
- **Path**: `Icons.xcassets/Icons/arrow-right.imageset/`
- **Format**: PDF (vector)
- **Rendering Mode**: Template
- **Issues**: None

### Android
- **Path**: `res/drawable/arrow_right.xml`
- **Format**: VectorDrawable
- **Issues**: None - clean conversion

---

## check

**Source**: `icons-feather/check.svg`
**Converted**: November 18, 2025

### Web
- **Path**: `src/components/core/Icon/platforms/web/assets/check.svg`
- **Optimization**: Removed class attribute
- **Issues**: None

### iOS
- **Path**: `Icons.xcassets/Icons/check.imageset/`
- **Format**: PDF (vector)
- **Rendering Mode**: Template
- **Issues**: None

### Android
- **Path**: `res/drawable/check.xml`
- **Format**: VectorDrawable
- **Issues**: None

---

[Continue for all 15 icons...]
```

---

## Platform Conversion Process

### Web: SVG Optimization

**Input**: `icons-feather/[icon-name].svg`
**Output**: `src/components/core/Icon/platforms/web/assets/[icon-name].svg`

**Process:**
1. Copy SVG from `icons-feather/` directory
2. Remove unnecessary attributes:
   - Remove `class="feather feather-[name]"` attribute
   - Keep `stroke="currentColor"` for color inheritance
   - Keep `viewBox="0 0 24 24"` for proper scaling
3. Verify SVG renders correctly at all sizes (16, 24, 32, 40px)
4. Save to web assets directory

**Tools**: Manual editing or SVGO (optional)

**Example:**
```xml
<!-- Before (from icons-feather/) -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right">
  <line x1="5" y1="12" x2="19" y2="12"></line>
  <polyline points="12 5 19 12 12 19"></polyline>
</svg>

<!-- After (optimized for web) -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="5" y1="12" x2="19" y2="12"></line>
  <polyline points="12 5 19 12 12 19"></polyline>
</svg>
```

### iOS: Asset Catalog Import

**Input**: `icons-feather/[icon-name].svg`
**Output**: `Icons.xcassets/Icons/[icon-name].imageset/`

**Process:**
1. Open Xcode project
2. Navigate to Asset Catalog (Assets.xcassets)
3. Create "Icons" folder if it doesn't exist
4. Right-click Icons folder → New Image Set
5. Name image set: `[icon-name]` (e.g., "arrow-right")
6. Drag SVG file into "Universal" slot
7. Set Render As: "Template Image" (enables color tinting)
8. Xcode automatically generates PDF or PNG @1x/@2x/@3x
9. Verify icon renders correctly in preview

**Tools**: Xcode Asset Catalog

**Configuration:**
- **Render As**: Template Image (for color tinting)
- **Resizing**: Preserve Vector Data (keeps as vector)
- **Scales**: Universal (single asset for all scales)

### Android: VectorDrawable Conversion

**Input**: `icons-feather/[icon-name].svg`
**Output**: `res/drawable/[icon_name].xml`

**Process:**
1. Open Android Studio
2. Right-click `res/drawable/` → New → Vector Asset
3. Select "Local file (SVG, PSD)"
4. Click folder icon, select SVG from `icons-feather/`
5. Set Asset name: `[icon_name]` (e.g., "arrow_right" - use underscores)
6. Click Next → Finish
7. Android Studio generates VectorDrawable XML
8. Review generated XML for quality
9. Verify icon renders correctly in preview

**Tools**: Android Studio Vector Asset importer

**Common Issues:**
- **Text elements**: VectorDrawable doesn't support `<text>` - Feather Icons don't use text, so no issue
- **Filters/effects**: VectorDrawable has limited filter support - Feather Icons don't use filters
- **External references**: VectorDrawable doesn't support external refs - Feather Icons are self-contained

**Example VectorDrawable:**
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

---

## Color Inheritance Implementation

### Web: currentColor

**Mechanism**: SVG `stroke="currentColor"` attribute

**How it works:**
- SVG inherits `color` CSS property from parent element
- Button sets `color` property for text
- Icon automatically matches button text color

**Example:**
```tsx
// Button component sets text color
<button style={{ color: '#3B82F6' }}>
  <Icon name="arrow-right" size={24} />
  <span>Click me</span>
</button>

// Icon SVG automatically uses #3B82F6 for stroke
```

### iOS: Template Rendering Mode

**Mechanism**: SwiftUI `.foregroundColor()` modifier

**How it works:**
- Image set to template rendering mode in Asset Catalog
- SwiftUI applies `.foregroundColor(.primary)` modifier
- Icon inherits color from SwiftUI environment

**Example:**
```swift
// Button component sets foreground color
Button(action: action) {
    HStack {
        Icon(name: "arrow-right", size: 24)
        Text("Click me")
    }
}
.foregroundColor(.blue)

// Icon automatically uses blue color
```

### Android: LocalContentColor

**Mechanism**: Jetpack Compose `LocalContentColor` composition local

**How it works:**
- Icon component uses `tint = LocalContentColor.current`
- Button provides content color via composition local
- Icon automatically matches button content color

**Example:**
```kotlin
// Button component provides content color
Button(
    onClick = onClick,
    colors = ButtonDefaults.buttonColors(
        contentColor = Color.Blue
    )
) {
    Row {
        Icon(name = "arrow-right", size = 24.dp)
        Text("Click me")
    }
}

// Icon automatically uses blue color
```

---

## Error Handling

### Invalid Icon Name

**Web:**
```typescript
function loadIconSVG(name: IconName): string {
  try {
    // Attempt to load icon
    return require(`./assets/${name}.svg`);
  } catch (error) {
    console.error(`Icon not found: ${name}`);
    // Return fallback icon (circle)
    return require(`./assets/circle.svg`);
  }
}
```

**iOS:**
```swift
struct Icon: View {
    let name: String
    let size: CGFloat
    
    var body: some View {
        // SwiftUI Image handles missing assets gracefully
        // Shows placeholder if asset not found
        Image(name)
            .resizable()
            .renderingMode(.template)
            .frame(width: size, height: size)
            .foregroundColor(.primary)
    }
}
```

**Android:**
```kotlin
private fun getIconResource(name: String): Int {
    return when (name) {
        "arrow-right" -> R.drawable.arrow_right
        // ... other icons
        else -> {
            Log.w("Icon", "Icon not found: $name, using fallback")
            R.drawable.circle // Fallback icon
        }
    }
}
```

### TypeScript Compile-Time Prevention

**Primary error prevention**: TypeScript type system prevents invalid icon names at compile-time

```typescript
// ✅ Valid - compiles successfully
<Icon name="arrow-right" size={24} />

// ❌ Invalid - TypeScript error
<Icon name="arrow-rigt" size={24} />
// Error: Type '"arrow-rigt"' is not assignable to type 'IconName'

// ❌ Invalid - TypeScript error
<Icon name="settings" size={25} />
// Error: Type '25' is not assignable to type 'IconSize'
```

---

## Testing Strategy

### Unit Tests

**Web (Jest + React Testing Library):**
```typescript
describe('Icon Component', () => {
  it('renders icon with correct size', () => {
    const { container } = render(<Icon name="arrow-right" size={24} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });
  
  it('applies currentColor for color inheritance', () => {
    const { container } = render(<Icon name="check" size={32} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
  });
  
  it('is hidden from screen readers', () => {
    const { container } = render(<Icon name="plus" size={16} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
```

**iOS (XCTest + SwiftUI):**
```swift
class IconTests: XCTestCase {
    func testIconRendersWithCorrectSize() {
        let icon = Icon(name: "arrow-right", size: 24)
        // Test icon frame size
        // SwiftUI testing framework
    }
    
    func testIconIsAccessibilityHidden() {
        let icon = Icon(name: "check", size: 32)
        // Verify accessibilityHidden is true
    }
}
```

**Android (JUnit + Compose Testing):**
```kotlin
class IconTest {
    @Test
    fun iconRendersWithCorrectSize() {
        composeTestRule.setContent {
            Icon(name = "arrow-right", size = 24.dp)
        }
        // Verify icon size
    }
    
    @Test
    fun iconInheritsContentColor() {
        composeTestRule.setContent {
            CompositionLocalProvider(LocalContentColor provides Color.Blue) {
                Icon(name = "check", size = 32.dp)
            }
        }
        // Verify icon tint matches LocalContentColor
    }
}
```

### Visual Regression Tests

**Cross-platform consistency validation:**
1. Render same icon at same size on all platforms
2. Capture screenshots
3. Compare visual output for consistency
4. Verify stroke width, proportions, alignment

**Tools:**
- Web: Percy, Chromatic, or manual screenshot comparison
- iOS: Snapshot testing with SnapshotTesting library
- Android: Screenshot testing with Paparazzi or Shot

### Integration Tests

**Button + Icon integration:**
```typescript
describe('Button with Icon', () => {
  it('icon inherits button text color', () => {
    const { container } = render(
      <button style={{ color: '#3B82F6' }}>
        <Icon name="arrow-right" size={24} />
        <span>Click me</span>
      </button>
    );
    
    const svg = container.querySelector('svg');
    const computedColor = window.getComputedStyle(svg).color;
    expect(computedColor).toBe('rgb(59, 130, 246)'); // #3B82F6
  });
});
```

---

## Design Decisions

### Decision 1: Manual Conversion Process

**Options Considered:**
1. Automated build tooling (scripts to convert all icons)
2. Manual conversion with documentation
3. Hybrid (manual for initial set, automate later)

**Decision:** Manual conversion with documentation

**Rationale:**
- **Process-first development**: Prove manual process before automating
- **Learn platform quirks**: Discover conversion issues with 15 icons, not 280
- **No premature optimization**: Don't build tooling until pain points are clear
- **Simpler to start**: No build system complexity to debug
- **Foundation for automation**: Manual process documents what automation should do

**Trade-offs:**
- ❌ Manual work for 15 icons (45 conversions across 3 platforms)
- ✅ Learn platform-specific issues early
- ✅ Document "correct" conversion process
- ✅ No build tooling to maintain

**Implementation:**
- Document conversion process for each platform
- Create icon conversion log tracking all conversions
- Note platform-specific issues and resolutions
- Provide repeatable steps for future icon additions

### Decision 2: Type Safety with Manual Definition

**Options Considered:**
1. No type safety (string literals)
2. Manual type definition for 15 icons
3. Auto-generated types from directory

**Decision:** Manual type definition for initial 15 icons

**Rationale:**
- **15 icons is manageable**: Easy to maintain manually
- **Immediate benefit**: TypeScript autocomplete and error checking
- **AI-friendly**: Type definition is self-documenting
- **Foundation for automation**: Can auto-generate when icon count grows
- **No build complexity**: Simple TypeScript union type

**Trade-offs:**
- ❌ Manual maintenance when adding icons
- ✅ Simple to implement (no build tooling)
- ✅ Immediate type safety benefits
- ✅ Clear migration path to automation

**Implementation:**
```typescript
// Manual type definition (easy to maintain for 15 icons)
export type IconName = 
  | 'arrow-right'
  | 'arrow-left'
  // ... 13 more icons

// Future: Auto-generate from directory
// export type IconName = /* generated */;
```

### Decision 3: Four Size Variants (8px Grid)

**Options Considered:**
1. Two sizes (24, 32) - minimal for button
2. Four sizes (16, 24, 32, 40) - 8px grid alignment
3. Nine sizes (12, 16, 20, 24, 28, 32, 36, 40, 44) - 4pt subgrid
4. Arbitrary sizes (any pixel value)

**Decision:** Four sizes (16, 24, 32, 40) with extensibility for more

**Rationale:**
- **8px baseline grid**: Aligns with primary grid system
- **Practical range**: 16px minimum (readable), 40px maximum (display)
- **Covers button needs**: 24px and 32px for button component
- **Simpler than 4pt**: Fewer sizes to convert and maintain
- **Extensible**: Component API supports any size, can add more later

**Trade-offs:**
- ❌ May need additional 4pt sizes later (12, 20, 28, 36, 44, 48)
- ✅ Simpler initial implementation (4 sizes vs 9 sizes)
- ✅ Adequate precision for most use cases
- ✅ Easy to add sizes without API changes

**Implementation:**
```typescript
// Initial sizes (8px grid)
export type IconSize = 16 | 24 | 32 | 40;

// Future: Add 4pt subgrid sizes as needed
// export type IconSize = 12 | 16 | 20 | 24 | 28 | 32 | 36 | 40 | 44 | 48;
```

### Decision 4: Decorative Icons (Accessibility)

**Options Considered:**
1. All icons decorative (no accessible labels)
2. All icons semantic (with accessible labels)
3. Configurable (decorative by default, semantic optional)

**Decision:** All icons decorative (no accessible labels) for initial implementation

**Rationale:**
- **Button use case**: Icons in buttons are visual enhancements to text labels
- **Text provides label**: Button text serves as accessible label
- **Screen reader experience**: Reading both text and icon is redundant
- **Simpler implementation**: No need for label prop or localization

**Trade-offs:**
- ❌ Can't use for icon-only buttons (need separate component)
- ✅ Simpler component API
- ✅ Better screen reader experience for buttons with text
- ✅ Aligns with WCAG best practices for decorative images

**Future Enhancement:**
- Add `label` prop for semantic icons (icon-only buttons)
- Create separate IconButton component for icon-only use case

**Implementation:**
- Web: `aria-hidden="true"`
- iOS: `.accessibilityHidden(true)`
- Android: `contentDescription = null`

### Decision 5: Local Icon Assets

**Options Considered:**
1. Source from GitHub on every build
2. Use local assets in repository
3. Hybrid (local with update script)

**Decision:** Use local assets in `icons-feather/` directory

**Rationale:**
- **Build reliability**: No external dependency on GitHub availability
- **Version control**: Icons versioned with code
- **No surprise updates**: Intentional updates only
- **Offline development**: Works without network
- **Customization freedom**: Can modify icons if needed

**Trade-offs:**
- ❌ Repository size increases by ~500KB (negligible)
- ✅ Build reliability and reproducibility
- ✅ Version stability
- ✅ Full control over icon set

**Implementation:**
- Icons stored in `icons-feather/` directory
- Document original source (https://github.com/feathericons/feather)
- Can update manually by pulling from GitHub when desired

---

## Integration Points

### Button Component Integration

**Button component uses Icon component:**

```typescript
// Button component (web)
<button>
  <Icon name="arrow-right" size={24} />
  <span>Click me</span>
</button>
```

**Icon inherits button text color automatically:**
- Button sets `color` CSS property
- Icon uses `stroke="currentColor"`
- No explicit color prop needed

### Future Component Integration

**Other components that will use Icon System:**
- Input components (validation icons, clear button)
- Navigation components (menu icons, breadcrumb arrows)
- Card components (action icons, status indicators)
- Alert components (warning, error, success icons)
- Tooltip components (info icons)

---

## Performance Considerations

### Web Performance

**SVG Inline vs External:**
- **Decision**: Inline SVG (embedded in component)
- **Rationale**: Fewer HTTP requests, immediate rendering
- **Trade-off**: Larger bundle size, but negligible for 15 icons

**Optimization:**
- Remove unnecessary SVG attributes
- Minify SVG paths (optional)
- Consider SVG sprite sheet for future (50+ icons)

### iOS Performance

**Vector vs Raster:**
- **Decision**: Vector (PDF) in Asset Catalog
- **Rationale**: Single asset for all scales, smaller bundle size
- **Trade-off**: Slight rendering overhead vs pre-rasterized PNG

**Optimization:**
- Use template rendering mode (enables caching)
- Asset Catalog automatically optimizes for device

### Android Performance

**VectorDrawable vs PNG:**
- **Decision**: VectorDrawable (vector)
- **Rationale**: Single asset for all densities, smaller APK size
- **Trade-off**: Slight rendering overhead vs pre-rasterized PNG

**Optimization:**
- VectorDrawable is hardware-accelerated on modern devices
- Android caches rendered bitmaps automatically

---

## Future Enhancements

### Automated Build Tooling

**When to build:**
- After 50+ icons (manual conversion becomes painful)
- When adding icons frequently (weekly or more)

**What to automate:**
- SVG optimization for web
- Asset Catalog generation for iOS
- VectorDrawable conversion for Android
- TypeScript type generation

### Additional Icon Sizes

**4pt subgrid sizes:**
- 12px, 20px, 28px, 36px, 44px, 48px
- Add incrementally as use cases emerge
- Component API already supports arbitrary sizes

### Advanced Icon Features

**Rotation:**
```typescript
<Icon name="arrow-right" size={24} rotation={90} />
```

**Animation:**
```typescript
<Icon name="loader" size={24} animated />
```

**Custom colors:**
```typescript
<Icon name="heart" size={24} color="red" />
```

---

*This design document provides the technical architecture and implementation details for the Icon System, ready for task breakdown and implementation.*
