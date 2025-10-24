# Task 5.3 Completion: Implement Android Kotlin Shadow Translation

**Date**: October 24, 2025
**Task**: 5.3 Implement Android Kotlin shadow translation
**Type**: Implementation
**Status**: Complete

---

## Artifacts Created

- `src/build/platforms/AndroidShadowGenerator.ts` - Android Kotlin shadow translation generator
- `src/build/platforms/__tests__/AndroidShadowGenerator.test.ts` - Comprehensive tests for Android shadow generation

## Implementation Details

### Approach

Implemented the AndroidShadowGenerator class to translate shadow semantic tokens to Android elevation values. Unlike web and iOS which support full shadow properties, Android uses a simplified elevation system that requires approximation:

- **elevation**: Single dp value representing shadow depth
- **Approximation Strategy**: Converts shadow properties (offsetX, offsetY, blur, opacity, color) to elevation
- **Limitations Documentation**: Documents what shadow properties cannot be represented in Android elevation

The generator uses three approximation strategies based on shadow characteristics:
1. **Blur-based**: elevation ≈ blur (for shadows with moderate blur and small offsets)
2. **Offset-based**: elevation ≈ offsetY (for shadows with large offsets relative to blur)
3. **Combined**: elevation ≈ (blur + offsetY) / 2 (for shadows with balanced blur and offset)

### Key Decisions

**Decision 1**: Elevation approximation strategy
- **Rationale**: Android elevation is a single dp value that cannot represent separate offset, blur, opacity, and color properties. We use blur as the primary approximation because it most closely correlates with perceived shadow depth. For shadows with large offsets (like FAB), we use offsetY as the approximation.
- **Alternative**: Could use a fixed mapping table, but algorithmic approach provides better flexibility and handles edge cases.

**Decision 2**: Document all limitations
- **Rationale**: Android elevation has significant limitations compared to web/iOS shadows. Documenting these limitations in both the generated Kotlin code and the ShadowToken data structure helps developers understand what's being approximated.
- **Alternative**: Could silently approximate without documentation, but this would create confusion when shadows don't match other platforms.

**Decision 3**: Three approximation strategies
- **Rationale**: Different shadow types have different characteristics. Blur-based works for standard UI shadows (container, modal), offset-based works for dramatic shadows (FAB), and combined works for balanced shadows.
- **Alternative**: Could use single strategy for all shadows, but this would result in poor approximations for some shadow types.

**Decision 4**: Generate Jetpack Compose code
- **Rationale**: Jetpack Compose is the modern Android UI framework. Generated code uses Compose Modifier extension for easy shadow application.
- **Alternative**: Could generate View-based code, but Compose is the future of Android UI development.

**Decision 5**: Include original properties in documentation
- **Rationale**: Developers need to understand what the original shadow properties were to understand the approximation. Including offsetX, offsetY, blur, opacity in comments provides this context.
- **Alternative**: Could omit original properties, but this would make it harder to understand the approximation.

### Integration Points

The AndroidShadowGenerator integrates with:
- `ShadowTokens` (semantic) for shadow token definitions
- `ShadowOffsetTokens` for offset primitive lookups
- `ShadowBlurTokens` for blur primitive lookups
- `ShadowOpacityTokens` for opacity primitive lookups
- `ColorTokens` for shadow color primitive lookups

## Validation (Tier 2: Standard)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors
✅ All imports resolve correctly
✅ Type annotations correct

### Functional Validation
✅ generateShadowKotlinValue() returns correct elevation for all shadow tokens
✅ Blur-based strategy used for shadows with small offsets (container, modal, hover)
✅ Offset-based strategy used for shadows with large offsets (fab)
✅ Elevation values calculated correctly based on strategy
✅ Limitations documented for all shadow tokens
✅ Returns null for non-existent shadow tokens

### Integration Validation
✅ Integrates with semantic ShadowTokens correctly
✅ Resolves primitive token references from all shadow primitive registries
✅ Resolves semantic shadow color references to primitive shadow colors
✅ Generated Kotlin code follows Android/Compose conventions

### Requirements Compliance
✅ Requirement 6.3: Android shadow translation implemented
  - Elevation values generated from shadow properties
  - Approximation strategy documented
  - Limitations clearly documented
✅ Requirement 6.4: Custom drawable generation noted for future
  - Documentation notes that elevation is an approximation
  - Comments indicate custom drawable would be needed for precise control
  - Future enhancement path documented

## Android-Specific Implementation Notes

### Elevation Approximation Strategies

**Strategy 1: Blur-based (Primary)**
- Used when: offsetY ≤ blur
- Calculation: elevation = blur
- Example: shadow.container (offsetY: 4, blur: 12) → elevation: 12dp
- Rationale: Blur most closely correlates with perceived shadow depth

**Strategy 2: Offset-based (Dramatic Shadows)**
- Used when: offsetY > blur × 1.5
- Calculation: elevation = offsetY
- Example: shadow.fab (offsetY: 16, blur: 4) → elevation: 16dp
- Rationale: Large offsets indicate dramatic shadows where offset is more important than blur

**Strategy 3: Combined (Balanced Shadows)**
- Used when: blur < offsetY ≤ blur × 1.5
- Calculation: elevation = (blur + offsetY) / 2
- Rationale: Balanced shadows need both blur and offset considered

### Android Elevation Limitations

**Fixed Light Source**:
- Android elevation assumes light source from top
- Directional shadows (offsetX ≠ 0) cannot be represented
- Example: shadow.fab has offsetX: 12dp, but this is ignored in elevation

**System-Controlled Opacity**:
- Android elevation uses system-controlled shadow opacity
- Custom opacity values (e.g., 0.4 for hard shadows) cannot be represented
- Elevation approximation ignores opacity differences

**System-Controlled Color**:
- Android elevation uses system-controlled shadow color (typically black)
- Custom shadow colors (shadowBlue100, shadowOrange100) cannot be represented
- Color information is documented but not applied

**No Spread Support**:
- Android elevation does not support shadow spread
- Spread is omitted for cross-platform consistency
- This limitation is consistent with iOS

### Generated Kotlin Code Structure

The generator produces:
1. **ShadowToken data class**: Type-safe shadow token structure with elevation, strategy, and limitations
2. **ShadowTokens object**: Static constants for all shadow tokens with comprehensive documentation
3. **Modifier extension**: Helper function to apply shadow tokens to Compose Modifiers

Example usage:
```kotlin
// Apply shadow token to Modifier
Box(
    modifier = Modifier
        .shadow(ShadowTokens.container)
        .background(Color.White)
) {
    // Content
}

// Or access individual properties
val shadow = ShadowTokens.modal
Box(
    modifier = Modifier
        .shadow(elevation = shadow.elevation)
        .background(Color.White)
) {
    // Content
}
```

### Platform Limitations Documentation

Each shadow token includes comprehensive limitations documentation:

**Directional Shadows**:
- Documents when offsetX ≠ 0
- Explains that Android uses fixed light source from top
- Example: "Directional shadow (offsetX: 12dp) not supported - Android elevation uses fixed light source from top"

**Custom Opacity**:
- Documents when opacity ≠ 0.3 (standard)
- Explains that Android uses system-controlled opacity
- Example: "Custom opacity (0.4) not supported - Android elevation uses system-controlled opacity"

**Custom Color**:
- Documents when shadow color is not pure black
- Explains that Android uses system-controlled shadow color
- Example: "Custom shadow color not supported - Android elevation uses system-controlled shadow color"

**Spread**:
- Always documented for all shadows
- Explains cross-platform consistency decision
- Example: "Shadow spread not supported - omitted for cross-platform consistency"

### Future Enhancement: Custom Drawable Generation

The implementation notes that for precise shadow control, custom drawable generation would be required. This would involve:

1. **Custom Drawable Creation**: Generate XML drawable definitions with precise shadow properties
2. **Layer-List Drawables**: Use multiple layers to approximate blur and offset
3. **Gradient Drawables**: Use radial gradients to simulate shadow blur
4. **Color Support**: Apply custom shadow colors through drawable tinting

This enhancement is documented in the generated Kotlin code and completion documentation but is deferred to future work as it adds significant complexity.

## Test Coverage

Created comprehensive tests covering:
- Elevation generation for all semantic shadow tokens
- Correct approximation strategy selection (blur-based, offset-based, combined)
- Elevation value calculation for each strategy
- Limitations documentation for all shadow properties
- Null handling for non-existent tokens
- Kotlin code generation with all required components
- Documentation of Android limitations
- Modifier extension function generation

All 20 tests pass successfully.

## Comparison with Web and iOS

### Web (Full Shadow Support)
- **Properties**: offsetX, offsetY, blur, spread, color, opacity
- **Format**: CSS box-shadow
- **Limitations**: None - full shadow control
- **Example**: `4px 8px 12px rgba(0, 0, 0, 0.3)`

### iOS (Near-Full Shadow Support)
- **Properties**: shadowOffset (CGSize), shadowRadius, shadowOpacity, shadowColor
- **Format**: CALayer shadow properties
- **Limitations**: No spread support
- **Example**: `shadowOffset: CGSize(width: 4, height: 8), shadowRadius: 6, shadowOpacity: 0.3, shadowColor: UIColor.black`

### Android (Elevation Approximation)
- **Properties**: elevation (single dp value)
- **Format**: Jetpack Compose elevation
- **Limitations**: No directional control, no custom opacity, no custom color, no spread
- **Example**: `elevation = 12.dp`

Android has the most significant limitations due to the simplified elevation system. The approximation strategy and comprehensive documentation help developers understand these limitations and make informed decisions.

## Related Documentation

- [Design Document](../design.md#cross-platform-shadow-translation) - Cross-platform translation strategy
- [Requirements Document](../requirements.md#requirement-6-cross-platform-shadow-translation) - Android shadow translation requirements
- [WebShadowGenerator](../../../src/build/platforms/WebShadowGenerator.ts) - Web shadow translation for comparison
- [IOSShadowGenerator](../../../src/build/platforms/IOSShadowGenerator.ts) - iOS shadow translation for comparison

