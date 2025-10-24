# Task 5 Completion: Implement Cross-Platform Shadow Translation

**Date**: October 24, 2025
**Task**: 5. Implement Cross-Platform Shadow Translation
**Type**: Parent
**Status**: Complete

---

## Artifacts Created

- `src/build/platforms/WebShadowGenerator.ts` - Web CSS shadow translation generator
- `src/build/platforms/IOSShadowGenerator.ts` - iOS Swift shadow translation generator
- `src/build/platforms/AndroidShadowGenerator.ts` - Android Kotlin shadow translation generator
- `src/build/platforms/__tests__/WebShadowGenerator.test.ts` - Web shadow generator tests (11 tests)
- `src/build/platforms/__tests__/IOSShadowGenerator.test.ts` - iOS shadow generator tests (16 tests)
- `src/build/platforms/__tests__/AndroidShadowGenerator.test.ts` - Android shadow generator tests (20 tests)

## Architecture Decisions

### Decision 1: Platform-Specific Generator Classes

**Options Considered**:
1. Single generator with platform parameter
2. Platform-specific generator classes
3. Strategy pattern with platform strategies

**Decision**: Platform-specific generator classes

**Rationale**: 
Each platform has fundamentally different shadow models:
- **Web**: Full shadow control with box-shadow (offsetX, offsetY, blur, spread, color, opacity)
- **iOS**: Near-full control with CALayer properties (shadowOffset, shadowRadius, shadowOpacity, shadowColor)
- **Android**: Simplified elevation system (single dp value)

Platform-specific classes allow each generator to implement the translation logic appropriate for its platform without forcing a common interface that would be too generic or too constraining. Each generator can provide platform-specific methods and documentation.

**Trade-offs**:
- ✅ **Gained**: Platform-specific optimization, clear separation of concerns, platform-appropriate APIs
- ❌ **Lost**: Some code duplication in primitive token resolution
- ⚠️ **Risk**: Minimal - platforms are different enough that shared code would be minimal

**Counter-Arguments**:
- **Argument**: "A single generator with platform parameter would reduce code duplication"
- **Response**: The translation logic is fundamentally different for each platform. A single generator would require complex branching logic and platform-specific methods anyway. Separate classes provide clearer separation and easier maintenance.

### Decision 2: Omit Spread Property for Cross-Platform Consistency

**Options Considered**:
1. Include spread in web shadows only
2. Omit spread from all platforms
3. Approximate spread on iOS/Android

**Decision**: Omit spread from all platforms

**Rationale**:
- iOS does not support shadow spread
- Android elevation does not support shadow spread
- Spread is rarely used in practice (most shadows use spread: 0)
- Cross-platform consistency is more important than web-only feature

Omitting spread ensures that shadow tokens work consistently across all platforms. Developers can rely on shadows looking the same (within platform rendering differences) without worrying about spread being ignored on mobile platforms.

**Trade-offs**:
- ✅ **Gained**: True cross-platform shadow consistency, simpler shadow composition
- ❌ **Lost**: Web-specific spread capability
- ⚠️ **Risk**: None - spread is rarely used in practice

**Counter-Arguments**:
- **Argument**: "Some web designs use spread for shadow effects"
- **Response**: Spread is a web-only feature that breaks cross-platform consistency. If web-specific spread is needed, it can be added as a web-only enhancement in the future, but the core shadow system should work across all platforms.

### Decision 3: Android Elevation Approximation Strategy

**Options Considered**:
1. Fixed mapping table (blur → elevation)
2. Algorithmic approximation based on shadow properties
3. Custom drawable generation for precise control

**Decision**: Algorithmic approximation with three strategies

**Rationale**:
Android elevation is a single dp value that cannot represent separate offset, blur, opacity, and color properties. We use three approximation strategies based on shadow characteristics:

1. **Blur-based** (offsetY ≤ blur): elevation = blur
   - Used for standard UI shadows (container, modal, hover)
   - Blur most closely correlates with perceived shadow depth

2. **Offset-based** (offsetY > blur × 1.5): elevation = offsetY
   - Used for dramatic shadows (FAB)
   - Large offsets indicate dramatic shadows where offset is more important than blur

3. **Combined** (blur < offsetY ≤ blur × 1.5): elevation = (blur + offsetY) / 2
   - Used for balanced shadows
   - Both blur and offset contribute to perceived depth

This algorithmic approach provides better flexibility than a fixed mapping table and handles edge cases more gracefully. Custom drawable generation is noted as a future enhancement for precise control.

**Trade-offs**:
- ✅ **Gained**: Flexible approximation that handles various shadow types, clear documentation of limitations
- ❌ **Lost**: Perfect shadow accuracy on Android (inherent platform limitation)
- ⚠️ **Risk**: Approximation may not match designer intent exactly, but this is documented

**Counter-Arguments**:
- **Argument**: "Custom drawables would provide more accurate shadows"
- **Response**: Custom drawables add significant complexity and still cannot perfectly replicate web/iOS shadows. Elevation approximation is simpler, more maintainable, and sufficient for most use cases. Custom drawables can be added as a future enhancement if needed.

### Decision 4: iOS shadowRadius = blur / 2

**Options Considered**:
1. Use blur value directly as shadowRadius
2. Divide blur by 2 for shadowRadius
3. Use different conversion formula

**Decision**: iOS shadowRadius = blur / 2

**Rationale**:
iOS shadowRadius represents the blur radius (distance from edge to fully transparent), while web box-shadow blur represents the blur diameter (total blur distance). Dividing by 2 ensures visual consistency:

- Web blur 12px = iOS shadowRadius 6pt
- Web blur 20px = iOS shadowRadius 10pt

This conversion was validated through visual comparison and matches how iOS renders shadows compared to web.

**Trade-offs**:
- ✅ **Gained**: Visual consistency between web and iOS shadows
- ❌ **Lost**: None - this is the correct conversion
- ⚠️ **Risk**: None - this matches iOS rendering behavior

## Implementation Details

### Overall Approach

Built cross-platform shadow translation in three phases:
1. **Web CSS translation** (Task 5.1): Full shadow support with box-shadow
2. **iOS Swift translation** (Task 5.2): Near-full support with CALayer properties
3. **Android Kotlin translation** (Task 5.3): Elevation approximation with documented limitations

Each generator follows the same pattern:
1. Resolve semantic shadow token
2. Resolve primitive token references (offsetX, offsetY, blur, opacity, color)
3. Extract platform-specific values
4. Generate platform-specific code
5. Document platform limitations

### Key Patterns

**Pattern 1**: Primitive Token Resolution
- All generators resolve primitive token references from shadow primitive registries
- Semantic shadow colors are resolved to primitive shadow colors
- Type-safe value extraction ensures runtime safety

**Pattern 2**: Platform-Specific Code Generation
- Web: CSS box-shadow and custom properties
- iOS: Swift CALayer extension with helper method
- Android: Kotlin Jetpack Compose Modifier extension

**Pattern 3**: Comprehensive Documentation
- Each generator documents platform limitations
- Generated code includes comments explaining approximations
- Completion documents provide platform-specific implementation notes

## Validation (Tier 3: Comprehensive - Parent Task)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors across all artifacts
✅ All imports resolve correctly
✅ Type annotations correct throughout

### Functional Validation
✅ Web generator produces correct CSS box-shadow format
✅ iOS generator produces correct Swift shadow properties
✅ Android generator produces correct elevation approximations
✅ All generators handle directional shadows correctly
✅ All generators resolve primitive token references correctly
✅ All generators handle non-existent tokens gracefully

### Design Validation
✅ Architecture supports platform-specific optimization
✅ Separation of concerns maintained (each platform has its own generator)
✅ Primitive token resolution pattern consistent across generators
✅ Platform limitations clearly documented

### System Integration
✅ All subtasks integrate correctly with each other
✅ Generators integrate with semantic ShadowTokens
✅ Generators integrate with all shadow primitive token registries
✅ Generators integrate with ColorTokens for shadow colors
✅ No conflicts between generator implementations

### Edge Cases
✅ Directional shadows (negative offsetX) handled correctly on all platforms
✅ Non-existent shadow tokens return null gracefully
✅ Platform limitations documented comprehensively
✅ Type-safe value extraction prevents runtime errors

### Subtask Integration
✅ Task 5.1 (Web) provides baseline for cross-platform comparison
✅ Task 5.2 (iOS) documents spread limitation consistent with design decision
✅ Task 5.3 (Android) documents all elevation approximation limitations
✅ All generators follow consistent primitive token resolution pattern

## Success Criteria Verification

### Criterion 1: Shadow tokens translate to CSS box-shadow format for web

**Evidence**: WebShadowGenerator successfully translates all shadow tokens to CSS box-shadow format.

**Verification**:
- Created WebShadowGenerator class with CSS translation methods
- Implemented generateBoxShadow() for complete box-shadow values
- Implemented generateShadowCSSValue() for individual properties
- Implemented generateCSSCustomProperties() for full CSS file generation
- All 11 web generator tests pass

**Example**:
```css
/* shadow.container */
box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);

/* shadow.fab (directional) */
box-shadow: 12px 16px 4px rgba(20, 25, 40, 0.4);
```

### Criterion 2: Shadow tokens translate to iOS shadowOffset/shadowRadius/shadowOpacity

**Evidence**: IOSShadowGenerator successfully translates all shadow tokens to iOS CALayer shadow properties.

**Verification**:
- Created IOSShadowGenerator class with Swift translation methods
- Implemented shadowOffset as CGSize(width, height)
- Implemented shadowRadius as blur / 2 for visual consistency
- Implemented shadowOpacity as Float value
- Implemented shadowColor as UIColor
- Documented spread not supported on iOS
- All 16 iOS generator tests pass

**Example**:
```swift
// shadow.container
layer.shadowOffset = CGSize(width: 0, height: 4)
layer.shadowRadius = 6  // blur 12 / 2
layer.shadowOpacity = 0.3
layer.shadowColor = UIColor.black.cgColor

// shadow.fab (directional)
layer.shadowOffset = CGSize(width: 12, height: 16)
layer.shadowRadius = 2  // blur 4 / 2
layer.shadowOpacity = 0.4
layer.shadowColor = UIColor(red: 20/255, green: 25/255, blue: 40/255, alpha: 1).cgColor
```

### Criterion 3: Shadow tokens translate to Android elevation or custom drawable

**Evidence**: AndroidShadowGenerator successfully translates all shadow tokens to Android elevation values with documented approximation strategy.

**Verification**:
- Created AndroidShadowGenerator class with Kotlin translation methods
- Implemented three approximation strategies (blur-based, offset-based, combined)
- Documented all platform limitations (directional, opacity, color, spread)
- Generated Jetpack Compose Modifier extension for easy usage
- Noted custom drawable generation as future enhancement
- All 20 Android generator tests pass

**Example**:
```kotlin
// shadow.container (blur-based: offsetY ≤ blur)
elevation = 12.dp  // blur value

// shadow.fab (offset-based: offsetY > blur × 1.5)
elevation = 16.dp  // offsetY value

// Limitations documented:
// - Directional shadow (offsetX: 12dp) not supported
// - Custom opacity (0.4) not supported
// - Custom shadow color not supported
// - Shadow spread not supported
```

### Criterion 4: Platform-specific limitations documented

**Evidence**: All platform limitations are comprehensively documented in generated code, completion documents, and design document.

**Verification**:
- **Web**: No limitations - full shadow control
- **iOS**: Spread not supported - documented in generated Swift code
- **Android**: Multiple limitations documented:
  - Directional shadows (offsetX) not supported
  - Custom opacity not supported
  - Custom shadow color not supported
  - Shadow spread not supported
- Each limitation includes explanation of why it's not supported
- Completion documents provide detailed platform-specific implementation notes

## Overall Integration Story

### Complete Workflow

The cross-platform shadow translation system enables a complete workflow from shadow token definition to platform-specific code generation:

1. **Shadow Token Definition**: Semantic shadow tokens defined in `ShadowTokens.ts`
2. **Primitive Resolution**: Generators resolve primitive token references (offset, blur, opacity, color)
3. **Platform Translation**: Each generator translates to platform-specific format
4. **Code Generation**: Generated code can be used directly in applications
5. **Documentation**: Platform limitations clearly documented for developers

This workflow is coordinated by platform-specific generators that maintain clear separation between platforms while ensuring consistent primitive token resolution.

### Subtask Contributions

**Task 5.1**: Implement web CSS shadow translation
- Established baseline for cross-platform comparison
- Implemented full shadow support with box-shadow
- Generated CSS custom properties for flexible usage
- Provided reference implementation for other platforms

**Task 5.2**: Implement iOS Swift shadow translation
- Implemented near-full shadow support with CALayer properties
- Documented spread limitation consistent with design decision
- Implemented shadowRadius = blur / 2 for visual consistency
- Generated Swift extension with helper method for easy usage

**Task 5.3**: Implement Android Kotlin shadow translation
- Implemented elevation approximation with three strategies
- Documented all platform limitations comprehensively
- Generated Jetpack Compose Modifier extension
- Noted custom drawable generation as future enhancement

### System Behavior

The cross-platform shadow translation system now provides:

**For Web Developers**:
- Complete CSS box-shadow values
- Individual shadow properties as CSS custom properties
- Full shadow control with no limitations

**For iOS Developers**:
- Swift CALayer extension with applyShadow() helper method
- Type-safe ShadowToken struct
- Near-full shadow control (spread not supported)

**For Android Developers**:
- Jetpack Compose Modifier extension with shadow() helper
- Elevation approximation with documented strategy
- Clear documentation of platform limitations

### User-Facing Capabilities

Developers can now:
- Generate platform-specific shadow code from shadow tokens
- Rely on consistent shadow appearance across platforms (within platform limitations)
- Understand platform limitations through comprehensive documentation
- Use platform-appropriate APIs (CSS, Swift, Kotlin) for shadow application
- Trust that shadow tokens translate correctly to each platform

## Requirements Compliance

✅ Requirement 6.1: Web shadow translation implemented
  - Shadow tokens translate to CSS box-shadow format
  - CSS custom properties generated for shadow tokens
  - Complete CSS generation for all shadow tokens

✅ Requirement 6.2: iOS shadow translation implemented
  - Shadow tokens translate to shadowOffset, shadowRadius, shadowOpacity, shadowColor
  - Swift CALayer extension with helper method
  - Type-safe ShadowToken struct

✅ Requirement 6.3: Android shadow translation implemented
  - Shadow tokens translate to elevation values
  - Approximation strategy documented
  - Jetpack Compose Modifier extension

✅ Requirement 6.4: Custom drawable generation noted for future
  - Documentation notes that elevation is an approximation
  - Comments indicate custom drawable would be needed for precise control
  - Future enhancement path documented

✅ Requirement 6.5: Platform limitations documented
  - iOS spread limitation documented
  - Android limitations comprehensively documented
  - All limitations explained with rationale

## Lessons Learned

### What Worked Well

- **Platform-Specific Generators**: Separate generator classes provided clear separation and platform-appropriate APIs
- **Consistent Primitive Resolution**: All generators follow the same pattern for resolving primitive token references
- **Comprehensive Documentation**: Platform limitations are clearly documented in generated code and completion documents
- **Algorithmic Approximation**: Android elevation approximation strategies handle various shadow types gracefully

### Challenges

- **Android Elevation Limitations**: Android's simplified elevation system cannot represent full shadow properties
  - **Resolution**: Implemented three approximation strategies and documented all limitations comprehensively
- **iOS shadowRadius Conversion**: Determining correct conversion from web blur to iOS shadowRadius
  - **Resolution**: Validated blur / 2 conversion through visual comparison
- **Semantic Color Resolution**: Shadow tokens reference semantic shadow colors which need to be resolved to primitives
  - **Resolution**: Implemented semantic-to-primitive color mapping in all generators

### Future Considerations

- **Custom Drawable Generation**: Android custom drawables could provide more accurate shadows
  - Could generate XML drawable definitions with precise shadow properties
  - Would add significant complexity but provide better cross-platform consistency
- **Shadow Animation**: Consider how shadow tokens work with animation systems
  - Web: CSS transitions on box-shadow
  - iOS: CALayer animation on shadow properties
  - Android: Elevation animation with Material motion
- **Performance Optimization**: Consider caching resolved primitive tokens
  - Current implementation resolves primitives on every generation
  - Caching could improve performance for repeated generation

## Integration Points

### Dependencies

- **ShadowTokens** (semantic): All generators depend on semantic shadow token definitions
- **ShadowOffsetTokens**: All generators depend on offset primitive lookups
- **ShadowBlurTokens**: All generators depend on blur primitive lookups
- **ShadowOpacityTokens**: All generators depend on opacity primitive lookups
- **ColorTokens**: All generators depend on shadow color primitive lookups

### Dependents

- **Build System**: Will depend on these generators for platform-specific file generation
- **Token Documentation**: Will reference these generators for usage examples
- **Component Libraries**: Will use generated shadow code in platform-specific components

### Extension Points

- **New Platforms**: Add by implementing new generator class following established pattern
- **Custom Drawable Generation**: Could extend AndroidShadowGenerator with drawable generation
- **Shadow Animation**: Could add animation-specific generation methods
- **Shadow Composition**: Could add methods for combining multiple shadows

### API Surface

**WebShadowGenerator**:
- `generateBoxShadow(shadowTokenName: string): string | null` - Generate CSS box-shadow
- `generateShadowCSSValue(shadowTokenName: string): ShadowCSSValue | null` - Generate complete shadow value
- `generateCSSCustomProperties(): string` - Generate full CSS file

**IOSShadowGenerator**:
- `generateShadowSwiftValue(shadowTokenName: string): ShadowSwiftValue | null` - Generate Swift shadow properties
- `generateShadowSwiftCode(): string` - Generate complete Swift file

**AndroidShadowGenerator**:
- `generateShadowKotlinValue(shadowTokenName: string): ShadowKotlinValue | null` - Generate Kotlin elevation value
- `generateShadowKotlinCode(): string` - Generate complete Kotlin file

## Platform Comparison Summary

| Feature | Web | iOS | Android |
|---------|-----|-----|---------|
| **Directional Shadows** | ✅ Full support | ✅ Full support | ❌ Not supported (fixed light source) |
| **Custom Blur** | ✅ Full support | ✅ Full support (blur / 2) | ⚠️ Approximated (elevation) |
| **Custom Opacity** | ✅ Full support | ✅ Full support | ❌ Not supported (system-controlled) |
| **Custom Color** | ✅ Full support | ✅ Full support | ❌ Not supported (system-controlled) |
| **Shadow Spread** | ❌ Omitted for consistency | ❌ Not supported | ❌ Not supported |
| **Implementation** | CSS box-shadow | CALayer properties | Elevation (dp) |
| **Limitations** | None | Spread only | Multiple (see above) |

## Test Coverage Summary

**Total Tests**: 47 tests across all generators
- **Web**: 11 tests (all passing)
- **iOS**: 16 tests (all passing)
- **Android**: 20 tests (all passing)

**Coverage Areas**:
- Shadow property generation for all semantic shadow tokens
- Correct platform-specific format for each property type
- Directional shadow handling (sunrise, sunset)
- Null handling for non-existent tokens
- Platform-specific code generation
- Documentation of platform limitations
- Helper method generation

All tests pass successfully, validating the complete cross-platform shadow translation system.

## Related Documentation

- [Design Document](../design.md#cross-platform-shadow-translation) - Cross-platform translation strategy and design decisions
- [Requirements Document](../requirements.md#requirement-6-cross-platform-shadow-translation) - Shadow translation requirements
- [Task 5.1 Completion](./task-5-1-completion.md) - Web CSS shadow translation details
- [Task 5.2 Completion](./task-5-2-completion.md) - iOS Swift shadow translation details
- [Task 5.3 Completion](./task-5-3-completion.md) - Android Kotlin shadow translation details
