# Task 5.1 Completion: Implement Web CSS Shadow Translation

**Date**: October 24, 2025
**Task**: 5.1 Implement web CSS shadow translation
**Type**: Implementation
**Status**: Complete

---

## Artifacts Created

- `src/build/platforms/WebShadowGenerator.ts` - Web CSS shadow translation generator
- `src/build/platforms/__tests__/WebShadowGenerator.test.ts` - Comprehensive tests for web shadow generation

## Implementation Details

### Approach

Implemented the WebShadowGenerator class to translate shadow semantic tokens to CSS box-shadow format. The implementation resolves primitive token references and generates complete CSS values that can be used directly in web applications:

- **box-shadow format**: `offsetX offsetY blur rgba(r, g, b, opacity)`
- **CSS custom properties**: Individual shadow properties as CSS variables
- **Complete CSS generation**: Full :root block with all shadow tokens

The generator provides three main methods:
1. `generateBoxShadow()`: Returns CSS box-shadow string for a shadow token
2. `generateShadowCSSValue()`: Returns complete shadow value with individual properties
3. `generateCSSCustomProperties()`: Generates full CSS file with all shadow tokens

### Key Decisions

**Decision 1**: Omit spread property
- **Rationale**: Spread is not supported on iOS/Android, so it's omitted from shadow composition for cross-platform consistency. All shadows use spread: 0 implicitly.
- **Alternative**: Could include spread in web-only shadows, but this would break cross-platform consistency.

**Decision 2**: Apply opacity to color in box-shadow
- **Rationale**: CSS box-shadow doesn't have a separate opacity parameter. Opacity is applied by converting rgb() to rgba() with the opacity value.
- **Alternative**: Could use separate opacity in custom properties, but box-shadow requires color with alpha channel.

**Decision 3**: Generate both box-shadow and custom properties
- **Rationale**: Developers may want the complete box-shadow value for direct use, or individual properties for custom composition. Providing both gives maximum flexibility.
- **Alternative**: Could generate only box-shadow or only custom properties, but both are useful in different contexts.

**Decision 4**: Resolve semantic shadow colors to primitives
- **Rationale**: Shadow tokens reference semantic shadow colors (color.shadow.default), which need to be resolved to primitive shadow colors (shadowBlack100) for actual color values.
- **Alternative**: Could require shadow tokens to reference primitives directly, but semantic references maintain the compositional architecture.

### Integration Points

The WebShadowGenerator integrates with:
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
✅ generateBoxShadow() returns correct CSS box-shadow for all shadow tokens
✅ box-shadow format includes offsetX, offsetY, blur, and rgba color with opacity
✅ Directional shadows (sunrise, sunset) have correct offset signs
✅ generateShadowCSSValue() returns complete shadow value with individual properties
✅ generateCSSCustomProperties() generates full CSS file with all shadow tokens
✅ Returns null for non-existent shadow tokens

### Integration Validation
✅ Integrates with semantic ShadowTokens correctly
✅ Resolves primitive token references from all shadow primitive registries
✅ Resolves semantic shadow color references to primitive shadow colors
✅ Generated CSS follows web conventions

### Requirements Compliance
✅ Requirement 6.1: Web shadow translation implemented
  - Shadow tokens translate to CSS box-shadow format
  - CSS custom properties generated for shadow tokens
  - Complete CSS generation for all shadow tokens

## Web-Specific Implementation Notes

### CSS box-shadow Format

**Standard Format**:
```css
box-shadow: offsetX offsetY blur spread color;
```

**DesignerPunk Format** (spread omitted for cross-platform consistency):
```css
box-shadow: offsetX offsetY blur rgba(r, g, b, opacity);
```

**Example**:
```css
/* shadow.container */
box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);

/* shadow.fab (directional) */
box-shadow: 12px 16px 4px rgba(20, 25, 40, 0.4);
```

### CSS Custom Properties Structure

For each shadow token, the generator creates:
- `--shadow-{name}`: Complete box-shadow value
- `--shadow-{name}-offset-x`: Horizontal offset
- `--shadow-{name}-offset-y`: Vertical offset
- `--shadow-{name}-blur`: Blur radius
- `--shadow-{name}-opacity`: Shadow opacity
- `--shadow-{name}-color`: Shadow color (without opacity)

**Example**:
```css
:root {
  /* Standard container shadow with noon lighting and moderate quality */
  --shadow-container: 0px 4px 12px rgba(0, 0, 0, 0.3);
  --shadow-container-offset-x: 0px;
  --shadow-container-offset-y: 4px;
  --shadow-container-blur: 12px;
  --shadow-container-opacity: 0.3;
  --shadow-container-color: rgb(0, 0, 0);
}
```

### Opacity Application

CSS box-shadow requires color with alpha channel, so opacity is applied by converting:
- `rgb(0, 0, 0)` + opacity `0.3` → `rgba(0, 0, 0, 0.3)`
- `rgb(20, 25, 40)` + opacity `0.4` → `rgba(20, 25, 40, 0.4)`

This ensures the shadow darkness matches the opacity primitive token value.

### Directional Shadow Support

Web fully supports directional shadows through offsetX:
- **Negative offsetX**: Shadow falls left (sunrise, morning)
- **Zero offsetX**: Shadow falls straight down (noon)
- **Positive offsetX**: Shadow falls right (dusk, sunset)

**Example**:
```css
/* shadow.sunrise - shadow falls left */
box-shadow: -12px 4px 20px rgba(20, 25, 40, 0.2);

/* shadow.sunset - shadow falls right */
box-shadow: 12px 16px 4px rgba(20, 25, 40, 0.4);
```

### Usage Examples

**Direct box-shadow usage**:
```css
.card {
  box-shadow: var(--shadow-container);
}

.modal {
  box-shadow: var(--shadow-modal);
}

.fab {
  box-shadow: var(--shadow-fab);
}
```

**Custom composition**:
```css
.custom-shadow {
  box-shadow: 
    var(--shadow-container-offset-x) 
    var(--shadow-container-offset-y) 
    var(--shadow-container-blur) 
    rgba(0, 0, 0, var(--shadow-container-opacity));
}
```

## Test Coverage

Created comprehensive tests covering:
- box-shadow generation for all semantic shadow tokens
- Correct CSS format with px units and rgba color
- Directional shadow offset signs (sunrise negative, sunset positive)
- Complete shadow CSS value with individual properties
- CSS custom properties generation for all tokens
- Null handling for non-existent tokens

All 11 tests pass successfully.

## Related Documentation

- [Design Document](../design.md#cross-platform-shadow-translation) - Cross-platform translation strategy
- [Requirements Document](../requirements.md#requirement-6-cross-platform-shadow-translation) - Web shadow translation requirements
- [IOSShadowGenerator](../../../src/build/platforms/IOSShadowGenerator.ts) - iOS shadow translation for comparison
- [AndroidShadowGenerator](../../../src/build/platforms/AndroidShadowGenerator.ts) - Android shadow translation for comparison
