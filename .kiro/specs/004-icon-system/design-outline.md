# Icon System - Design Outline

**Date**: November 18, 2025
**Purpose**: Capture design decisions for Icon System infrastructure before creating full spec
**Status**: Design Outline (Pre-Requirements)

---

## System Overview

Icon system infrastructure providing unified icon component API across web, iOS, and Android platforms. Uses Feather Icons (280+ open-source icons) as source, with manual conversion process to platform-specific formats. Supports type-safe icon names and automatic color inheritance.

---

## Icon Source: Feather Icons

**Library**: Feather Icons (https://feathericons.com/)
- **Location**: `icons-feather/` directory (280+ SVG files)
- **License**: MIT (free to use, modify, distribute)
- **Design**: Consistent 24x24 grid, stroke-based, minimal aesthetic
- **Format**: Clean SVG with `stroke="currentColor"` for color inheritance

**Why Feather Icons:**
- ✅ High-quality, production-ready icon set
- ✅ Consistent design language across all icons
- ✅ `currentColor` support enables automatic color inheritance
- ✅ Proven cross-platform compatibility
- ✅ Open-source with permissive license
- ✅ Already in repository (no additional dependencies)

---

## Icon Sizing Strategy

### Size Variants

Icons align with typography line heights to ensure proper vertical centering:

| Size | Use Case | Aligns With |
|------|----------|-------------|
| **16px** | Small UI elements | lineHeight050 (13px), lineHeight075 (18px) |
| **24px** | Standard UI elements | lineHeight100 (24px) - Button small/medium |
| **32px** | Large UI elements | lineHeight125 (32px), lineHeight200 (32px), lineHeight300 (32px) - Button large |
| **40px** | Extra large UI elements | lineHeight400 (36px) |

**Rationale:**
- Icons match rendered line heights for proper vertical alignment
- Sizes follow 8px baseline grid (16, 24, 32, 40)
- Covers full range of typography scales (lineHeight050 through lineHeight400)
- Button component needs 24px and 32px (covered)

---

## Initial Icon Set (15 Icons - 5% Sample)

### Selection Strategy

**Button-Specific Icons (4):**
- `arrow-right` - Forward actions, navigation
- `check` - Confirmation, success states
- `plus` - Add, create actions
- `chevron-right` - Navigation, disclosure

**Validation Icons - Simple (3):**
- `x` - Close, cancel, remove
- `minus` - Subtract, collapse
- `circle` - Basic shape, status indicator

**Validation Icons - Medium Complexity (4):**
- `arrow-left` - Back navigation
- `arrow-up` - Scroll up, sort ascending
- `arrow-down` - Scroll down, sort descending
- `heart` - Favorite, like

**Validation Icons - Complex (4):**
- `settings` - Configuration, preferences
- `user` - Profile, account
- `mail` - Messages, email
- `calendar` - Dates, scheduling

**Total: 15 icons (~5% of 280 total)**

**Rationale:**
- Covers range of complexity (simple shapes → detailed icons)
- Validates conversion process across different icon types
- Unblocks button component development
- Provides foundation for future icon additions

---

## Icon Component API

### Component Interface

```typescript
// Type-safe icon names (manually defined for initial 15 icons)
type IconName = 
  | 'arrow-right' | 'arrow-left' | 'arrow-up' | 'arrow-down'
  | 'check' | 'x' | 'plus' | 'minus'
  | 'chevron-right' | 'circle' | 'heart'
  | 'settings' | 'user' | 'mail' | 'calendar';

// Icon size variants
type IconSize = 16 | 24 | 32 | 40;

// Icon component props
interface IconProps {
  name: IconName;           // Type-safe icon name
  size: IconSize;           // Icon size in pixels
  className?: string;       // Web: CSS class
  style?: object;           // Platform-specific style overrides
}

// Usage examples
<Icon name="arrow-right" size={24} />
<Icon name="check" size={32} />
<Icon name="settings" size={16} />
```

### Platform-Specific Implementations

**Web (TypeScript):**
```typescript
// Icon.web.ts
export function createIcon(props: IconProps): string {
  const { name, size, className } = props;
  return (
    <svg 
      width={size} 
      height={size}
      className={className}
      style={{ color: 'currentColor' }}
    >
      {/* Load SVG content based on name */}
    </svg>
  );
};
```

**iOS (SwiftUI):**
```swift
// Icon.ios.swift
struct Icon: View {
    let name: String
    let size: CGFloat
    
    var body: some View {
        Image(name)
            .resizable()
            .frame(width: size, height: size)
            .foregroundColor(.primary) // Inherits text color
    }
}
```

**Android (Jetpack Compose):**
```kotlin
// Icon.android.kt
@Composable
fun Icon(
    name: String,
    size: Dp,
    modifier: Modifier = Modifier
) {
    Icon(
        painter = painterResource(id = getIconResource(name)),
        contentDescription = null, // Decorative
        modifier = modifier.size(size),
        tint = LocalContentColor.current // Inherits text color
    )
}
```

---

## Platform Conversion Process

### Manual Conversion Workflow

**Phase 1: Web (SVG Optimization)**

1. **Source**: Use SVG from `icons-feather/` directory
2. **Optimize**: Remove unnecessary attributes (class names, etc.)
3. **Output**: Save to `src/components/core/Icon/assets/web/`
4. **Format**: Optimized SVG with `stroke="currentColor"`

**Tools**: SVGO (optional) or manual cleanup

**Phase 2: iOS (Asset Catalog)**

1. **Source**: Use SVG from `icons-feather/` directory
2. **Import**: Drag SVG into Xcode Asset Catalog
3. **Configure**: Set rendering mode to "Template" (for color tinting)
4. **Export**: Xcode generates PDF or PNG @1x/@2x/@3x automatically
5. **Output**: Asset Catalog in `ios/DesignerPunk/Assets.xcassets/Icons/`

**Tools**: Xcode Asset Catalog

**Phase 3: Android (VectorDrawable)**

1. **Source**: Use SVG from `icons-feather/` directory
2. **Import**: Android Studio → New → Vector Asset → Local file
3. **Convert**: Android Studio converts SVG → VectorDrawable XML
4. **Review**: Check conversion quality (some SVG features may not convert)
5. **Output**: Save to `android/app/src/main/res/drawable/`

**Tools**: Android Studio Vector Asset importer

### Conversion Documentation

**Document for each icon:**
- Source SVG path
- Web output path
- iOS Asset Catalog location
- Android drawable resource name
- Any platform-specific issues or adjustments

**Example:**
```markdown
## arrow-right

- **Source**: `icons-feather/arrow-right.svg`
- **Web**: `src/components/core/Icon/assets/web/arrow-right.svg`
- **iOS**: `Icons.xcassets/arrow-right.imageset/`
- **Android**: `res/drawable/arrow_right.xml`
- **Issues**: None - clean conversion across all platforms
```

---

## Color Inheritance

### currentColor Support

**Web:**
- SVG uses `stroke="currentColor"` attribute
- Inherits from parent element's `color` CSS property
- Works automatically with button text color

**iOS:**
- Use `.foregroundColor(.primary)` or template rendering mode
- Inherits from SwiftUI environment color
- Works with button text color via environment

**Android:**
- Use `tint = LocalContentColor.current` in Compose
- Inherits from Compose local content color
- Works with button text color via composition local

**Rationale:**
- No need to pass color prop explicitly
- Icons automatically match text color
- Simplifies component API
- Follows platform conventions

---

## Type Safety

### Manual Type Definition (Initial 15 Icons)

```typescript
// src/components/core/Icon/types.ts

/**
 * Icon names for type-safe icon usage
 * 
 * Initial set: 15 icons (~5% of Feather Icons)
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
 * Icon size variants aligned with typography line heights
 */
export type IconSize = 16 | 24 | 32 | 40;
```

**Benefits:**
- ✅ TypeScript autocomplete for icon names
- ✅ Compile-time error for invalid icon names
- ✅ Self-documenting list of available icons
- ✅ AI agents can discover valid icon names from type definition

**Future Enhancement:**
- Auto-generate IconName type from icons directory
- Add when icon count justifies automation (50+ icons)

---

## Accessibility

### Decorative Icons

**Default behavior**: Icons are decorative (no accessible label)

**Rationale:**
- Icons in buttons are visual enhancements to text labels
- Button text provides the accessible label
- Screen readers should read button text, not icon description

**Implementation:**
- **Web**: `aria-hidden="true"` on SVG
- **iOS**: `.accessibilityHidden(true)` on Image
- **Android**: `contentDescription = null` on Icon

### Future Consideration: Semantic Icons

**Not included in initial spec**, but future enhancement could support:
- Icons with accessible labels (icon-only buttons)
- `label` prop for semantic icons
- Screen reader announcements for icon state changes

---

## Design Decisions & Rationale

### Decision 1: Manual Conversion Process

**Options Considered:**
- Automated build tooling (scripts to convert all icons)
- Manual conversion with documentation
- Hybrid (manual for initial set, automate later)

**Decision:** Manual conversion with documentation

**Rationale:**
- **Process-first development** - Prove manual process before automating
- **Learn platform quirks** - Discover conversion issues with 15 icons, not 280
- **No premature optimization** - Don't build tooling until pain points are clear
- **Simpler to start** - No build system complexity to debug
- **Foundation for automation** - Manual process documents what automation should do

**Trade-offs:**
- ❌ Manual work for 15 icons (45 conversions across 3 platforms)
- ✅ Learn platform-specific issues early
- ✅ Document "correct" conversion process
- ✅ No build tooling to maintain

### Decision 2: 15 Icons (5% Sample)

**Options Considered:**
- 5 icons (minimal set for button)
- 15 icons (5% sample for validation)
- 50 icons (larger sample)
- All 280 icons (complete library)

**Decision:** 15 icons (5% sample)

**Rationale:**
- **Statistical validity** - 5% sample is meaningful for validation
- **Complexity coverage** - Includes simple, medium, and complex icons
- **Unblocks button** - Includes all icons button component needs
- **Manageable scope** - 45 conversions (15 icons × 3 platforms) is doable
- **Validates process** - Large enough to discover platform issues

**Trade-offs:**
- ❌ More work than minimal 5-icon set
- ✅ Validates conversion process thoroughly
- ✅ Provides foundation for future additions
- ✅ Covers range of icon complexity

### Decision 3: Type Safety (Manual Definition)

**Options Considered:**
- No type safety (string literals)
- Manual type definition
- Auto-generated types from directory

**Decision:** Manual type definition for initial 15 icons

**Rationale:**
- **15 icons is manageable** - Easy to maintain manually
- **Immediate benefit** - TypeScript autocomplete and error checking
- **AI-friendly** - Type definition is self-documenting
- **Foundation for automation** - Can auto-generate when icon count grows

**Trade-offs:**
- ❌ Manual maintenance when adding icons
- ✅ Simple to implement (no build tooling)
- ✅ Immediate type safety benefits
- ✅ Clear migration path to automation

### Decision 4: Four Size Variants (16, 24, 32, 40)

**Options Considered:**
- Two sizes (24, 32) - minimal for button
- Four sizes (16, 24, 32, 40) - full typography alignment
- Arbitrary sizes (any pixel value)

**Decision:** Four sizes (16, 24, 32, 40)

**Rationale:**
- **Typography alignment** - Matches rendered line heights (lineHeight050 through lineHeight400)
- **8px baseline grid** - All sizes are multiples of 8px
- **Covers button needs** - 24px and 32px for button component
- **Future-proof** - Supports small (16px) and extra large (40px) use cases
- **Constrained flexibility** - Limited sizes prevent arbitrary sizing

**Trade-offs:**
- ❌ More sizes to convert (4 variants per icon)
- ✅ Aligns with typography system
- ✅ Covers full range of use cases
- ✅ Maintains baseline grid alignment

---

## Open Questions & Checkpoints

### Checkpoint 1: Icon Selection

**Question**: Are the 15 selected icons appropriate for validation?

**Current selection**:
- Button-specific: arrow-right, check, plus, chevron-right
- Simple: x, minus, circle
- Medium: arrow-left, arrow-up, arrow-down, heart
- Complex: settings, user, mail, calendar

**Recommendation**: Proceed with this selection - covers complexity range and unblocks button

### Checkpoint 2: Platform Conversion Quality

**Question**: Do Feather Icons convert cleanly to iOS and Android formats?

**Validation needed**:
- Test conversion of 2-3 icons across all platforms
- Document any conversion issues or limitations
- Adjust process if needed

**Recommendation**: Test conversion before full spec implementation

### Checkpoint 3: Size Variant Necessity

**Question**: Do we need all four size variants (16, 24, 32, 40) initially?

**Button component needs**: 24px and 32px only

**Options**:
- Start with 24px and 32px only (minimal)
- Include all four sizes (future-proof)

**Recommendation**: Include all four sizes - small additional work, prevents rework later

---

## Next Steps

1. **Review this design outline** - Confirm decisions and answer open questions
2. **Test icon conversion** - Convert 2-3 icons to validate process
3. **Create requirements.md** - EARS format with user stories and acceptance criteria
4. **Create design.md** - Detailed component architecture and implementation
5. **Create tasks.md** - Implementation plan with task type classification
6. **Implement Icon System** - Build component and convert initial 15 icons
7. **Unblock Button Component** - Button spec (#005) can proceed after Icon System complete

---

## Dependencies

**Blocks:**
- Spec #005: CTA Button Component (depends on Icon System)

**Depends On:**
- None (foundational infrastructure)

---

*This design outline captures key decisions for the Icon System before proceeding to full spec creation.*
