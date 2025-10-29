# Task 5.2 Completion: Update WebFormatGenerator for Z-Index Tokens

**Date**: October 28, 2025
**Task**: 5.2 Update WebFormatGenerator for z-index tokens
**Type**: Implementation
**Status**: Complete

---

## Artifacts Created

- Updated `src/providers/WebFormatGenerator.ts` - Added z-index token formatting logic
- Updated `src/providers/__tests__/WebFormatGenerator-semantic.test.ts` - Added comprehensive tests for z-index token formatting

## Implementation Details

### Approach

Updated the WebFormatGenerator to handle semantic-only z-index tokens that have direct numeric values rather than primitive token references. The implementation detects these tokens by checking for the presence of a `value` property and `platforms` array, then formats them appropriately for both CSS and JavaScript output.

### Key Changes

**1. Enhanced formatToken Method**

Added logic to detect and handle semantic-only tokens (like z-index tokens):

```typescript
// Handle semantic-only tokens (like z-index tokens) that have direct values
if ('value' in token && typeof token.value === 'number' && 
    'platforms' in token && Array.isArray(token.platforms)) {
  // Format with unitless value
  if (this.outputFormat === 'css') {
    return this.formatCSSCustomProperty(tokenName, token.value, 'unitless');
  } else {
    return this.formatJavaScriptConstant(tokenName, token.value, 'unitless');
  }
}
```

This check distinguishes semantic-only tokens from:
- Primitive tokens (which have `baseValue` property)
- Regular semantic tokens (which have `primitiveReferences` and resolved `primitiveTokens`)

**2. Fixed getTokenName Method for JavaScript Output**

Updated the naming conversion logic to properly handle JavaScript output:

```typescript
getTokenName(tokenName: string, category: string): string {
  // For JavaScript output, we need camelCase without prefix
  if (this.outputFormat === 'javascript') {
    // Use iOS naming rules (camelCase) for JavaScript
    const camelCaseName = getPlatformTokenName(tokenName, 'ios', category as any);
    return camelCaseName;
  }
  
  // For CSS output, use web platform naming rules (kebab-case with -- prefix)
  return getPlatformTokenName(tokenName, this.platform, category as any);
}
```

This ensures:
- CSS output: `zIndex.modal` → `--z-index-modal` (kebab-case with prefix)
- JavaScript output: `zIndex.modal` → `zIndexModal` (camelCase without prefix)

**3. Type Safety Improvements**

Enhanced type checking to properly handle the union type of `PrimitiveToken | SemanticToken`:

```typescript
// Check if this is a primitive token (has 'baseValue' property)
const isPrimitiveToken = 'baseValue' in token;

if (isPrimitiveToken) {
  const primitiveToken = token as PrimitiveToken;
  platformValue = primitiveToken.platforms.web;
} else {
  const semanticToken = token as SemanticToken;
  // Handle semantic token logic...
}
```

### Output Format Examples

**CSS Output:**
```css
--z-index-container: 100;
--z-index-navigation: 200;
--z-index-dropdown: 300;
--z-index-modal: 400;
--z-index-toast: 500;
--z-index-tooltip: 600;
```

**JavaScript Output:**
```javascript
zIndexContainer: 100,
zIndexNavigation: 200,
zIndexDropdown: 300,
zIndexModal: 400,
zIndexToast: 500,
zIndexTooltip: 600,
```

### Integration Points

The implementation integrates with:
- **PlatformNamingRules**: Uses `getPlatformTokenName` to convert token names to platform-appropriate conventions
- **TokenFileGenerator**: Will be called by the generator to format z-index tokens for web platform
- **Existing formatToken logic**: Maintains compatibility with primitive and regular semantic tokens

## Validation (Tier 2: Standard)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors
✅ All imports resolve correctly
✅ Type annotations correct

### Functional Validation
✅ Z-index tokens formatted correctly for CSS with `--z-index-` prefix
✅ Z-index tokens formatted correctly for JavaScript with camelCase naming
✅ All six semantic levels (container, navigation, dropdown, modal, toast, tooltip) format correctly
✅ Unitless values output without unit suffixes (no px, rem, etc.)
✅ Naming convention applied correctly (kebab-case for CSS, camelCase for JavaScript)

### Integration Validation
✅ Integrates with PlatformNamingRules for consistent naming
✅ Maintains compatibility with existing primitive token formatting
✅ Maintains compatibility with existing semantic token formatting
✅ Type checking properly handles semantic-only tokens

### Requirements Compliance
✅ Requirement 10.1: Z-index token formatting logic added to WebFormatGenerator
✅ Requirement 10.5: Platform naming conventions applied correctly
  - CSS: kebab-case with `--` prefix (`--z-index-modal`)
  - JavaScript: camelCase without prefix (`zIndexModal`)
  - Output format matches specification: `--z-index-modal: 400;`

## Test Coverage

Added comprehensive test suite covering:

1. **CSS Format Generation**
   - Correct prefix (`--z-index-`)
   - Kebab-case naming convention
   - Proper value formatting

2. **JavaScript Format Generation**
   - CamelCase naming convention
   - No prefix
   - Proper value formatting

3. **All Semantic Levels**
   - Container (100)
   - Navigation (200)
   - Dropdown (300)
   - Modal (400)
   - Toast (500)
   - Tooltip (600)

4. **Unitless Value Handling**
   - No unit suffixes added
   - Values output as plain numbers

All 28 tests pass, including 4 new tests specifically for z-index token formatting.

## Requirements Addressed

- **Requirement 10.1**: TokenFileGenerator processes layering tokens
  - WebFormatGenerator now handles z-index tokens for web platform
  
- **Requirement 10.5**: Platform naming conventions applied
  - CSS: `--z-index-modal: 400;` (kebab-case with prefix)
  - JavaScript: `zIndexModal: 400,` (camelCase without prefix)

---

**Organization**: spec-completion
**Scope**: layering-token-system
