# Migration Guide: Color Palette & Display Font Update (v2.0.0)

**Date**: December 9, 2025  
**Version**: 2.0.0  
**Type**: Major Version (Breaking Changes)  
**Organization**: migration-guide  
**Scope**: cross-project  
**Last Reviewed**: December 30, 2025  
**Status**: Historical Reference (Migration Complete)

> **MCP Exclusion Note**: This document is intentionally excluded from the MCP documentation server. Migration guides serve a different purpose than steering/MCP documentation—they are version-specific transition guides for users migrating between states, not ongoing development guidance for AI agents. This content remains valuable as historical reference but is not needed for day-to-day design system maintenance.

---

## Overview

Version 2.0.0 introduces significant visual changes to the DesignerPunk design system through color palette refinement and display font updates. This is a **major version release** due to visual breaking changes that affect all components using semantic color tokens and display typography.

### What Changed

1. **Color Palette**: Streamlined from 9 to 7 color families with updated semantic mappings
2. **Display Font**: Introduced Rajdhani as the display font for headings, labels, and buttons
3. **Semantic Tokens**: Updated color semantic tokens to reference new primitive colors
4. **API Changes**: Removed `color.secondary` token

---

## Breaking Changes

### 1. Visual Breaking Changes

#### Success Colors (Cyan → Green)

**Before (v1.x)**:
- Success colors used cyan family
- `color.success.strong` → `cyan400` (#00D9FF)
- `color.success.subtle` → `cyan100` (#E6F9FF)

**After (v2.0.0)**:
- Success colors use electric green family
- `color.success.strong` → `green400` (#00FF88)
- `color.success.subtle` → `green100` (#E6FFF5)

**Visual Impact**:
```
Before: Bright cyan success indicators
After:  Electric green success indicators
```

**Affected Components**:
- ButtonCTA with `variant="success"`
- TextInputField with `state="success"`
- Status badges and indicators
- Success toast notifications
- Confirmation dialogs

**Migration**: No code changes required - components automatically inherit new colors through semantic tokens.

---

#### Error Colors (Orange → Pink)

**Before (v1.x)**:
- Error colors used orange family
- `color.error.strong` → `orange300` (#FF8C42)
- No `color.error.subtle` token

**After (v2.0.0)**:
- Error colors use hot pink family
- `color.error.strong` → `pink400` (#FF1493)
- `color.error.subtle` → `pink100` (#FFE6F5) (NEW)

**Visual Impact**:
```
Before: Orange error indicators
After:  Hot pink error indicators with subtle variant
```

**Affected Components**:
- ButtonCTA with `variant="danger"`
- TextInputField with `state="error"`
- Error messages and validation feedback
- Error toast notifications
- Destructive action dialogs

**Migration**: No code changes required - components automatically inherit new colors through semantic tokens.

---

#### Warning Colors (Yellow → Amber/Orange)

**Before (v1.x)**:
- Warning colors used yellow family
- `color.warning.strong` → `yellow400` (#FFD700)
- `color.warning.subtle` → `yellow100` (#FFFACD)

**After (v2.0.0)**:
- Warning colors use amber/orange family
- `color.warning.strong` → `amber400` (#FFA500)
- `color.warning.subtle` → `amber100` (#FFF4E6)

**Visual Impact**:
```
Before: Bright yellow warning indicators
After:  Amber/orange warning indicators (better contrast)
```

**Affected Components**:
- Warning banners and alerts
- TextInputField with `state="warning"`
- Warning toast notifications
- Caution dialogs

**Migration**: No code changes required - components automatically inherit new colors through semantic tokens.

---

#### Display Typography (System Fonts → Rajdhani)

**Before (v1.x)**:
- Display typography used system font stack
- `fontFamilyDisplay` → `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

**After (v2.0.0)**:
- Display typography uses Rajdhani with system fallbacks
- `fontFamilyDisplay` → `'Rajdhani, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'`

**Visual Impact**:
```
Before: System fonts for headings, labels, buttons
After:  Rajdhani font for headings, labels, buttons (cyberpunk aesthetic)
```

**Affected Typography Tokens** (15 tokens automatically inherit Rajdhani):
- `typography.h1` through `typography.h6` (6 heading tokens)
- `typography.labelXs`, `typography.labelSm`, `typography.labelMd`, `typography.labelLg` (4 label tokens)
- `typography.buttonSm`, `typography.buttonMd`, `typography.buttonLg` (3 button tokens)
- `typography.caption`, `typography.overline` (2 specialized tokens)

**Affected Components**:
- All headings (h1-h6)
- All labels (form labels, UI labels)
- All buttons (ButtonCTA, etc.)
- Navigation elements
- Tab labels
- Badge text

**Migration**: No code changes required - components automatically inherit Rajdhani through semantic typography tokens.

---

### 2. API Breaking Changes

#### Removed: `color.secondary` Token

**Before (v1.x)**:
```typescript
// color.secondary was available
const secondaryColor = tokens.color.secondary; // violet300
```

**After (v2.0.0)**:
```typescript
// color.secondary is removed
// Use purple700 directly for secondary brand colors
const secondaryColor = tokens.purple700;
```

**Reason for Removal**: The violet color family was removed from the palette, and `color.secondary` had unclear semantic meaning. For secondary brand colors, use `purple700` directly.

**Migration Steps**:

1. **Search for `color.secondary` usage**:
   ```bash
   # Find all references to color.secondary
   grep -r "color\.secondary" src/
   ```

2. **Replace with `purple700`**:
   ```typescript
   // Before
   background: tokens.color.secondary
   
   // After
   background: tokens.purple700
   ```

3. **Update component props** (if applicable):
   ```typescript
   // Before
   <ButtonCTA variant="secondary" />
   
   // After - use primary or create custom variant
   <ButtonCTA variant="primary" />
   // OR define custom styling with purple700
   ```

**Affected Components**: Based on codebase audit, no components currently use `color.secondary`. If you have custom components using this token, update them to use `purple700` directly.

---

## Before/After Comparisons

### Color Palette Comparison

| Semantic Token | Before (v1.x) | After (v2.0.0) | Visual Change |
|----------------|---------------|----------------|---------------|
| `color.success.strong` | cyan400 (#00D9FF) | green400 (#00FF88) | Cyan → Electric Green |
| `color.success.subtle` | cyan100 (#E6F9FF) | green100 (#E6FFF5) | Light Cyan → Light Green |
| `color.error.strong` | orange300 (#FF8C42) | pink400 (#FF1493) | Orange → Hot Pink |
| `color.error.subtle` | *(none)* | pink100 (#FFE6F5) | NEW - Light Pink |
| `color.warning.strong` | yellow400 (#FFD700) | amber400 (#FFA500) | Yellow → Amber/Orange |
| `color.warning.subtle` | yellow100 (#FFFACD) | amber100 (#FFF4E6) | Light Yellow → Light Amber |
| `color.secondary` | violet300 (#9D4EDD) | *(removed)* | Use `purple700` instead |

### Typography Comparison

| Token Category | Before (v1.x) | After (v2.0.0) | Visual Change |
|----------------|---------------|----------------|---------------|
| Display Typography | System fonts | Rajdhani | System → Cyberpunk aesthetic |
| Body Typography | Inter | Inter | No change |
| Heading Tokens (6) | System fonts | Rajdhani | All headings use Rajdhani |
| Label Tokens (4) | System fonts | Rajdhani | All labels use Rajdhani |
| Button Tokens (3) | System fonts | Rajdhani | All buttons use Rajdhani |

---

## Migration Checklist

### For Design System Maintainers

- [ ] **Review visual changes**: Understand how success/error/warning colors changed
- [ ] **Update visual regression baselines**: Capture new baseline screenshots for all components
- [ ] **Test font loading**: Verify Rajdhani and Inter load correctly on all platforms
- [ ] **Audit custom components**: Search for `color.secondary` usage and replace with `purple700`
- [ ] **Update design files**: Update Figma/Sketch files to reflect new color palette and fonts
- [ ] **Communicate changes**: Notify team of visual breaking changes and major version bump

### For Component Developers

- [ ] **No code changes required**: Components automatically inherit new colors and fonts through semantic tokens
- [ ] **Test component rendering**: Verify components render correctly with new colors and fonts
- [ ] **Update component examples**: Ensure examples demonstrate new visual appearance
- [ ] **Check accessibility**: Validate color contrast ratios meet WCAG 2.1 AA standards
- [ ] **Remove `color.secondary` usage**: If any custom components use this token, replace with `purple700`

### For Application Developers

- [ ] **Update to v2.0.0**: Install latest version of DesignerPunk design system
- [ ] **Test visual appearance**: Review application with new colors and fonts
- [ ] **Update screenshots**: Capture new screenshots for documentation/marketing
- [ ] **Verify accessibility**: Test with screen readers and keyboard navigation
- [ ] **Check brand alignment**: Ensure new visual identity aligns with brand guidelines

---

## Platform-Specific Considerations

### Web

**Font Loading**:
- Rajdhani and Inter fonts load via @font-face declarations
- WOFF2 format prioritized for better compression
- `font-display: swap` prevents invisible text (FOIT)
- System fonts used as fallbacks if custom fonts fail to load

**CSS Custom Properties**:
```css
/* Success colors updated */
--color-success-strong: #00FF88;  /* was #00D9FF */
--color-success-subtle: #E6FFF5;  /* was #E6F9FF */

/* Error colors updated */
--color-error-strong: #FF1493;    /* was #FF8C42 */
--color-error-subtle: #FFE6F5;    /* NEW */

/* Warning colors updated */
--color-warning-strong: #FFA500;  /* was #FFD700 */
--color-warning-subtle: #FFF4E6;  /* was #FFFACD */

/* Display font updated */
--font-family-display: 'Rajdhani, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
```

### iOS

**Font Configuration**:
- Rajdhani and Inter TTF files bundled in app
- Info.plist updated with UIAppFonts array
- SwiftUI uses `.custom("Rajdhani", size:)` for display text
- Falls back to SF Pro Display/Text if custom fonts unavailable

**Swift Constants**:
```swift
// Success colors updated
let colorSuccessStrong = Color(hex: "#00FF88")  // was #00D9FF
let colorSuccessSubtle = Color(hex: "#E6FFF5")  // was #E6F9FF

// Error colors updated
let colorErrorStrong = Color(hex: "#FF1493")    // was #FF8C42
let colorErrorSubtle = Color(hex: "#FFE6F5")    // NEW

// Display font updated
let fontFamilyDisplay = "Rajdhani"  // was system font
```

### Android

**Font Configuration**:
- Rajdhani and Inter TTF files in `res/font/` directory
- FontFamily objects created for both fonts
- Jetpack Compose uses `fontFamily = rajdhaniFamily` for display text
- Falls back to Roboto if custom fonts unavailable

**Kotlin Constants**:
```kotlin
// Success colors updated
val colorSuccessStrong = Color(0xFF00FF88)  // was 0xFF00D9FF
val colorSuccessSubtle = Color(0xFFE6FFF5)  // was 0xFFE6F9FF

// Error colors updated
val colorErrorStrong = Color(0xFFFF1493)    // was 0xFFFF8C42
val colorErrorSubtle = Color(0xFFFFE6F5)    // NEW

// Display font updated
val fontFamilyDisplay = rajdhaniFamily  // was system font
```

---

## Accessibility Considerations

### Color Contrast Improvements

**Amber/Orange Warning Colors**:
- Previous yellow warning colors had poor contrast on white backgrounds
- New amber/orange colors provide better contrast ratios
- Meets WCAG 2.1 AA standards (4.5:1 minimum for normal text)

**Green Success Colors**:
- Avoided "matrix green" extremes that can be hard to read
- Used accessible mid-range electric green values
- Maintains sufficient contrast on both light and dark backgrounds

**Pink Error Colors**:
- Sufficient saturation for urgency while maintaining readability
- Better contrast than previous orange error colors
- Clear visual distinction from warning colors

### Font Readability

**Rajdhani Display Font**:
- Clear letterforms with good x-height
- Readable at heading sizes (24px, 32px, 48px)
- Maintains readability at smaller label sizes (14px, 16px)
- Tested for accessibility across platforms

**Inter Body Font**:
- No changes to body typography
- Continues to provide excellent readability at body text sizes

---

## Testing Recommendations

### Visual Regression Testing

1. **Update baseline screenshots**: Capture new baselines for all components with updated colors/fonts
2. **Test all component variants**: Verify success, error, warning, and other variants render correctly
3. **Test typography hierarchy**: Ensure headings, labels, and buttons use Rajdhani correctly
4. **Test cross-platform consistency**: Verify visual appearance matches across web, iOS, and Android

### Accessibility Testing

1. **Color contrast validation**: Use tools like WebAIM Contrast Checker to verify WCAG 2.1 AA compliance
2. **Screen reader testing**: Verify semantic meaning is preserved with new colors
3. **Keyboard navigation**: Ensure focus indicators remain visible with new color palette
4. **Font rendering**: Test Rajdhani readability at various sizes and weights

### Integration Testing

1. **Component inheritance**: Verify components automatically inherit new colors and fonts
2. **Token generation**: Ensure build system generates correct platform-specific token files
3. **Font loading**: Test font loading behavior on all platforms (success and fallback scenarios)
4. **Custom component compatibility**: Test any custom components that extend design system components

---

## Rollback Plan

If you need to rollback to v1.x:

1. **Revert package version**:
   ```bash
   npm install @designerpunk/tokens@1.x
   ```

2. **Restore visual regression baselines**: Use v1.x baseline screenshots

3. **No code changes required**: Components will automatically use v1.x colors and fonts

4. **Clear font cache** (if needed):
   - Web: Clear browser cache
   - iOS: Clean build and reinstall app
   - Android: Clean build and reinstall app

---

## Support and Questions

### Documentation Resources

- **Color Token Documentation**: `docs/tokens/color-tokens.md`
- **Typography Token Documentation**: `docs/tokens/typography-tokens.md`
- **Component Examples**: Updated examples in each component's `examples/` directory
- **Platform Integration Guides**:
  - Web: `docs/platform-integration/web-font-setup.md`
  - iOS: `docs/platform-integration/ios-font-setup.md`
  - Android: `docs/platform-integration/android-font-setup.md`

### Common Questions

**Q: Do I need to update my component code?**  
A: No, components automatically inherit new colors and fonts through semantic tokens. Only update code if you're using the removed `color.secondary` token.

**Q: Why is this a major version change?**  
A: Visual breaking changes affect all components using semantic color tokens and display typography. This constitutes a breaking change in the visual API.

**Q: Can I use the old colors alongside the new colors?**  
A: No, the old color families (violet) are removed. Use the new color families (green, pink) or primitive tokens directly if needed.

**Q: What if Rajdhani doesn't load?**  
A: The system falls back to system fonts (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`) automatically.

**Q: How do I test the new colors and fonts locally?**  
A: Run `npm run build` to generate platform-specific token files, then test components in your application.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | December 9, 2025 | Color palette refinement, Rajdhani display font, removed `color.secondary` |
| 1.x | Previous | Original color palette with 9 families, system fonts for display typography |

---

**Organization**: migration-guide  
**Scope**: cross-project  
**Audience**: Design system maintainers, component developers, application developers

