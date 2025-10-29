# Platform Implementation Comparison Matrix

**Date**: October 29, 2025
**Audit**: Architecture Discovery Audit - Task 3.1
**Purpose**: Compare iOS, Android, and Web implementations for pattern consistency
**Organization**: audit-findings
**Scope**: phase-1-discovery-audit

---

## Overview

This document provides a side-by-side comparison of platform implementations across iOS, Android, and Web to identify architectural inconsistencies and pattern violations. The comparison covers format generators, unit converters, color resolvers, and file organizers.

---

## Format Generator Comparison

### Class Structure

| Aspect | iOS | Android | Web |
|--------|-----|---------|-----|
| **Base Class** | `BaseFormatProvider` | `BaseFormatProvider` | `BaseFormatProvider` |
| **Platform Property** | `readonly platform: TargetPlatform = 'ios'` | `readonly platform: TargetPlatform = 'android'` | `readonly platform: TargetPlatform = 'web'` |
| **Formats Property** | `readonly formats: OutputFormat[] = ['swift']` | `readonly formats: OutputFormat[] = ['kotlin', 'xml']` | `readonly formats: OutputFormat[] = ['css', 'javascript']` |
| **Constructor** | No constructor (uses defaults) | `constructor(outputFormat: OutputFormat = 'kotlin')` | `constructor(outputFormat: OutputFormat = 'css')` |
| **Consistent?** | ❌ No - iOS has no constructor, Android/Web have format selection | ❌ No - iOS has no constructor, Android/Web have format selection | ❌ No - iOS has no constructor, Android/Web have format selection |

**Issue**: iOS does not support format selection via constructor, while Android and Web do. This creates inconsistent initialization patterns.

### Core Methods

| Method | iOS | Android | Web |
|--------|-----|---------|-----|
| **formatToken()** | ✅ Implemented | ✅ Implemented | ✅ Implemented |
| **generateHeader()** | ✅ Implemented | ✅ Implemented | ✅ Implemented |
| **generateFooter()** | ✅ Implemented | ✅ Implemented | ✅ Implemented |
| **validateSyntax()** | ✅ Implemented | ✅ Implemented | ✅ Implemented |
| **getTokenName()** | ✅ Implemented | ✅ Implemented | ✅ Implemented |
| **Consistent?** | ✅ Yes - All implement required interface methods | ✅ Yes - All implement required interface methods | ✅ Yes - All implement required interface methods |

### Platform-Specific Type Methods

| Method | iOS | Android | Web |
|--------|-----|---------|-----|
| **Type Mapping** | `getSwiftType()` | `getKotlinType()` + `getXMLResourceType()` | N/A (handled in formatCSSValue/formatJSValue) |
| **Value Formatting** | `formatSwiftValue()` | `formatKotlinValue()` + `formatXMLValue()` | `formatCSSValue()` + `formatJSValue()` |
| **Constant Formatting** | `formatSwiftConstant()` | `formatKotlinConstant()` + `formatXMLResource()` | `formatCSSCustomProperty()` + `formatJavaScriptConstant()` |
| **Consistent?** | ❌ No - Different method naming patterns | ❌ No - Different method naming patterns | ❌ No - Different method naming patterns |

**Issue**: Each platform uses different naming conventions for type mapping and value formatting methods. iOS uses "Swift" prefix, Android uses "Kotlin/XML" prefix, Web uses "CSS/JS" prefix. This makes it difficult to understand equivalent functionality across platforms.

### Semantic Token Methods

| Method | iOS | Android | Web |
|--------|-----|---------|-----|
| **formatSingleReferenceToken()** | ✅ Implemented | ✅ Implemented | ✅ Implemented |
| **formatMultiReferenceToken()** | ✅ Implemented | ✅ Implemented | ✅ Implemented |
| **generateSectionComment()** | ✅ Implemented | ✅ Implemented | ✅ Implemented |
| **Consistent?** | ✅ Yes - All implement semantic token formatting | ✅ Yes - All implement semantic token formatting | ✅ Yes - All implement semantic token formatting |

### Opacity/Alpha Methods

| Method | iOS | Android | Web |
|--------|-----|---------|-----|
| **Modifier Generation** | `generateOpacityModifier()` | `generateAlphaModifier()` | `generateOpacityProperty()` |
| **Color with Opacity** | `generateColorWithOpacity()` | `generateColorWithAlpha()` | `generateRgbaAlpha()` |
| **Constant Generation** | `generateConstant()` | `generateConstant()` | `generateCustomProperty()` |
| **Consistent?** | ❌ No - Different method names for same concepts | ❌ No - Different method names for same concepts | ❌ No - Different method names for same concepts |

**Issue**: Opacity/alpha methods use platform-specific terminology (opacity vs alpha) and different method names, making it difficult to understand equivalent functionality.

### Special Token Handling

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| **Z-Index/Layering** | Scales down by 100 (100→1) | N/A | Direct value (100→100) |
| **Font Weight** | Maps to UIFont.Weight constants | Numeric values | Numeric values |
| **Dynamic Colors** | UIColor.dynamicColor with trait collection | Resource qualifiers (values/values-night) | CSS custom properties with @media |
| **Consistent?** | ❌ No - Different approaches to same problems | ❌ No - Different approaches to same problems | ❌ No - Different approaches to same problems |

**Issue**: Z-index tokens are handled differently across platforms (iOS scales down, Web uses direct values, Android not documented). This creates cross-platform inconsistency.

---

## Unit Converter Comparison

### Class Structure

| Aspect | iOS | Android | Web |
|--------|-----|---------|-----|
| **Base Class** | `BaseUnitProvider` | `BaseUnitProvider` | `BaseUnitProvider` |
| **Platform Property** | `readonly platform = 'ios' as const` | `readonly platform = 'android' as const` | `readonly platform = 'web' as const` |
| **Constructor Config** | `displayScale: 1.0` (default) | `densityFactor: AndroidDensity.MDPI` (default) | `baseFontSize: FONT_SIZE_BASE_VALUE` |
| **Consistent?** | ❌ No - Different configuration parameters | ❌ No - Different configuration parameters | ❌ No - Different configuration parameters |

**Issue**: Each platform uses different configuration parameters (displayScale vs densityFactor vs baseFontSize), making it difficult to understand equivalent concepts.

### Core Methods

| Method | iOS | Android | Web |
|--------|-----|---------|-----|
| **convertToken()** | ✅ Implemented | ✅ Implemented | ✅ Implemented |
| **convertValue()** | ✅ Implemented | ✅ Implemented | ✅ Implemented |
| **getConversionFactor()** | ✅ Implemented | ✅ Implemented | ✅ Implemented |
| **Consistent?** | ✅ Yes - All implement required interface methods | ✅ Yes - All implement required interface methods | ✅ Yes - All implement required interface methods |

### Unit Mapping

| Category | iOS | Android | Web |
|----------|-----|---------|-----|
| **spacing** | pt (points) | dp (density-independent pixels) | px (pixels) |
| **radius** | pt | dp | px |
| **tapArea** | pt | dp | px |
| **fontSize** | pt | sp (scale-independent pixels) | rem (relative to root font size) |
| **fontFamily** | fontFamily (string) | fontFamily (string) | fontFamily (string) |
| **fontWeight** | fontWeight (numeric) | fontWeight (numeric) | fontWeight (numeric) |
| **letterSpacing** | em | em | em |
| **lineHeight** | unitless | unitless | unitless |
| **density** | unitless | unitless | unitless |
| **Consistent?** | ❌ No - Different units for same categories | ❌ No - Different units for same categories | ❌ No - Different units for same categories |

**Issue**: Spacing/radius/tapArea use different units (pt vs dp vs px), and fontSize uses different units (pt vs sp vs rem). This is expected for platform differences but creates complexity in cross-platform consistency validation.

### Platform-Specific Methods

| Method | iOS | Android | Web |
|--------|-----|---------|-----|
| **Display/Density** | `getDisplayScale()` | `getDensityFactor()` | `getBaseFontSize()` |
| **Unit Conversion** | `pointsToPixels()`, `pixelsToPoints()` | `dpToPixels()`, `pixelsToDp()`, `spToPixels()` | `pxToRem()`, `remToPx()` |
| **Special Handling** | `applyDensityConsiderations()` | `handleDensityBuckets()`, `validateAcrossDensities()` | N/A |
| **Consistent?** | ❌ No - Different method names and concepts | ❌ No - Different method names and concepts | ❌ No - Different method names and concepts |

**Issue**: Platform-specific methods use completely different naming patterns and concepts, making it difficult to understand equivalent functionality.

---

## Color Resolver Comparison

### Class Structure

| Aspect | iOS | Android | Web |
|--------|-----|---------|-----|
| **Base Class** | None (standalone class) | None (standalone class) | None (standalone class) |
| **Resolver Property** | `private resolver: ModeThemeResolver` | `private resolver: ModeThemeResolver` | `private resolver: ModeThemeResolver` |
| **Constructor** | `constructor()` - no parameters | `constructor()` - no parameters | `constructor()` - no parameters |
| **Consistent?** | ✅ Yes - All use same structure | ✅ Yes - All use same structure | ✅ Yes - All use same structure |

### Core Methods

| Method | iOS | Android | Web |
|--------|-----|---------|-----|
| **Color Conversion** | `hexToUIColor()` | `hexToAndroidColor()` | N/A (uses hex directly) |
| **Dynamic Color** | `generateDynamicColor()` | N/A | `generateCSSVariable()` |
| **Mode-Specific** | N/A | `generateLightModeColors()`, `generateDarkModeColors()` | `generateStylesheet()` |
| **Extension/Module** | `generateSwiftExtension()` | `generateKotlinExtension()` | `generateJavaScriptModule()` |
| **Usage Example** | `generateUsageExample()` | `generateUsageExample()` | N/A |
| **Consistent?** | ❌ No - Different method names and approaches | ❌ No - Different method names and approaches | ❌ No - Different method names and approaches |

**Issue**: Color resolvers use completely different approaches and method names. iOS generates dynamic colors, Android generates separate light/dark XML files, Web generates CSS with @media queries. No consistent interface.

### Mode/Theme Handling

| Aspect | iOS | Android | Web |
|--------|-----|---------|-----|
| **Mode Detection** | UITraitCollection.userInterfaceStyle | Resource qualifiers (values/values-night) | @media (prefers-color-scheme: dark) |
| **Theme Switching** | UserDefaults with notification | SharedPreferences | data-theme attribute on :root |
| **Output Format** | Single Swift file with dynamic colors | Multiple XML files (values/values-night) | Single CSS file with @media queries |
| **Consistent?** | ❌ No - Platform-native approaches differ significantly | ❌ No - Platform-native approaches differ significantly | ❌ No - Platform-native approaches differ significantly |

**Issue**: Mode and theme handling use completely different platform-native approaches, which is expected but creates complexity in understanding equivalent functionality.

---

## File Organizer Comparison

### Class Structure

| Aspect | iOS | Android | Web |
|--------|-----|---------|-----|
| **Base Class** | `BasePathProvider` | `BasePathProvider` | `BasePathProvider` |
| **Platform Property** | `readonly platform: TargetPlatform = 'ios'` | `readonly platform: TargetPlatform = 'android'` | `readonly platform: TargetPlatform = 'web'` |
| **Consistent?** | ✅ Yes - All extend same base class | ✅ Yes - All extend same base class | ✅ Yes - All extend same base class |

### Core Methods

| Method | iOS | Android | Web |
|--------|-----|---------|-----|
| **getBaseDirectory()** | ✅ Implemented | ✅ Implemented | ✅ Implemented |
| **getFileName()** | ✅ Implemented | ✅ Implemented | ✅ Implemented |
| **getDirectoryStructure()** | ✅ Implemented (returns []) | ✅ Implemented (returns []) | ✅ Implemented (returns []) |
| **getBuildSystemIntegration()** | ✅ Implemented | ✅ Implemented | ✅ Implemented |
| **optimizeForBuildSystem()** | ✅ Implemented | ✅ Implemented | ✅ Implemented |
| **validatePath()** | ✅ Implemented | ✅ Implemented | ✅ Implemented |
| **Consistent?** | ✅ Yes - All implement required interface methods | ✅ Yes - All implement required interface methods | ✅ Yes - All implement required interface methods |

### Directory Structure

| Aspect | iOS | Android | Web |
|--------|-----|---------|-----|
| **Base Directory** | `Sources/DesignSystem/Tokens` | `designsystem/src/main` | `src/tokens` |
| **File Name** | `DesignTokens.swift` | `DesignTokens.kt` or `design_tokens.xml` | `DesignTokens.web.js` or `DesignTokens.web.css` |
| **Structure** | Flat (Xcode handles grouping) | Dual (kotlin/ and res/values/) | Flat |
| **Consistent?** | ❌ No - Different directory conventions | ❌ No - Different directory conventions | ❌ No - Different directory conventions |

**Issue**: Directory structures follow platform conventions but create inconsistency in file organization patterns.

### Build System Integration

| Aspect | iOS | Android | Web |
|--------|-----|---------|-----|
| **Build System** | Xcode/Swift Package Manager | Gradle/Android | Webpack/Vite |
| **Import Patterns** | `import DesignSystem` | `import com.designsystem.tokens.DesignTokens` | `import { tokens } from '@/tokens'` |
| **Watch Patterns** | `Sources/DesignSystem/Tokens/**/*.swift` | `designsystem/src/main/kotlin/**/*.kt` | `src/tokens/**/*.js` |
| **Tree Shaking** | Swift compiler optimization | R8/ProGuard | ESM static analysis |
| **Consistent?** | ❌ No - Platform-specific build systems | ❌ No - Platform-specific build systems | ❌ No - Platform-specific build systems |

**Issue**: Build system integration is platform-specific, which is expected but creates complexity in understanding equivalent concepts.

### Naming Convention Methods

| Method | iOS | Android | Web |
|--------|-----|---------|-----|
| **Constant Naming** | `getSwiftConstantName()` | `getKotlinConstantName()`, `getXMLResourceName()` | `getJavaScriptExportName()`, `getCSSCustomPropertyName()` |
| **Struct/Object Organization** | `getSwiftStructOrganization()` | `getKotlinObjectOrganization()`, `getXMLResourceOrganization()` | N/A |
| **Platform Integration** | `getXcodeIntegration()` | `getResourceQualifierPaths()` | N/A |
| **Consistent?** | ❌ No - Different method names and concepts | ❌ No - Different method names and concepts | ❌ No - Different method names and concepts |

**Issue**: Naming convention methods use platform-specific terminology and different method names, making it difficult to understand equivalent functionality.

---

## Builder Pattern Consistency

### Pattern Implementation

| Aspect | iOS | Android | Web |
|--------|-----|---------|-----|
| **Builder Class** | N/A - No explicit builder | N/A - No explicit builder | N/A - No explicit builder |
| **Builder Pattern Used?** | ❌ No - Direct instantiation | ❌ No - Direct instantiation | ❌ No - Direct instantiation |
| **Consistent?** | ✅ Yes - None use builder pattern | ✅ Yes - None use builder pattern | ✅ Yes - None use builder pattern |

**Finding**: No platform implementations use the builder pattern. All use direct instantiation with optional constructor parameters.

---

## Validator Pattern Consistency

### Pattern Implementation

| Aspect | iOS | Android | Web |
|--------|-----|---------|-----|
| **Validator Class** | N/A - Validation in BaseFormatProvider | N/A - Validation in BaseFormatProvider | N/A - Validation in BaseFormatProvider |
| **validateSyntax()** | ✅ Implemented in format generator | ✅ Implemented in format generator | ✅ Implemented in format generator |
| **validatePath()** | ✅ Implemented in file organizer | ✅ Implemented in file organizer | ✅ Implemented in file organizer |
| **Validator Pattern Used?** | ❌ No - Validation methods in generators | ❌ No - Validation methods in generators | ❌ No - Validation methods in generators |
| **Consistent?** | ✅ Yes - All use same approach | ✅ Yes - All use same approach | ✅ Yes - All use same approach |

**Finding**: No platform implementations use a separate validator pattern. All include validation methods directly in format generators and file organizers.

---

## Generator Pattern Consistency

### Pattern Implementation

| Aspect | iOS | Android | Web |
|--------|-----|---------|-----|
| **Generator Class** | `iOSFormatGenerator` | `AndroidFormatGenerator` | `WebFormatGenerator` |
| **Base Class** | `BaseFormatProvider` | `BaseFormatProvider` | `BaseFormatProvider` |
| **Generator Pattern Used?** | ✅ Yes - Extends base provider | ✅ Yes - Extends base provider | ✅ Yes - Extends base provider |
| **Consistent?** | ✅ Yes - All use same pattern | ✅ Yes - All use same pattern | ✅ Yes - All use same pattern |

**Finding**: All platform implementations use the generator pattern consistently by extending BaseFormatProvider.

---

## Summary of Inconsistencies

### Critical Inconsistencies

1. **Format Generator Constructor Inconsistency**: iOS has no constructor for format selection, while Android and Web support format selection via constructor parameter
2. **Z-Index Token Handling**: iOS scales down by 100, Web uses direct values, Android handling not documented
3. **Color Resolver Approaches**: Completely different approaches (dynamic colors vs XML resources vs CSS @media)

### Important Inconsistencies

4. **Platform-Specific Method Naming**: Each platform uses different prefixes (Swift/Kotlin/CSS) for equivalent methods
5. **Opacity/Alpha Terminology**: Inconsistent terminology (opacity vs alpha) for same concept
6. **Unit Converter Configuration**: Different configuration parameters (displayScale vs densityFactor vs baseFontSize)
7. **Directory Structure Conventions**: Different base directories and file naming patterns

### Minor Inconsistencies

8. **Naming Convention Methods**: Different method names for equivalent functionality
9. **Build System Integration**: Platform-specific approaches (expected but creates complexity)
10. **Special Token Handling**: Different approaches to font weights, dynamic colors, etc.

---

## Recommendations

### High Priority

1. **Standardize Format Generator Constructors**: Add format selection support to iOS generator to match Android/Web
2. **Document Z-Index Handling**: Create clear documentation for how z-index/layering tokens are handled across platforms
3. **Create Common Color Resolver Interface**: Define interface that all color resolvers implement, even if implementations differ

### Medium Priority

4. **Standardize Method Naming**: Use consistent method naming patterns across platforms (e.g., `getPlatformType()` instead of `getSwiftType()/getKotlinType()`)
5. **Unify Opacity/Alpha Terminology**: Choose one term (opacity) and use consistently across all platforms
6. **Document Unit Converter Equivalents**: Create mapping document showing equivalent concepts (displayScale ↔ densityFactor ↔ baseFontSize)

### Low Priority

7. **Standardize Naming Convention Methods**: Use consistent method names for naming conventions across platforms
8. **Document Build System Equivalents**: Create guide showing equivalent build system concepts across platforms
9. **Create Platform Comparison Guide**: Document expected vs unexpected differences between platforms

---

*This comparison matrix provides a comprehensive view of platform implementation patterns and identifies areas where consistency can be improved while respecting platform-specific requirements.*
