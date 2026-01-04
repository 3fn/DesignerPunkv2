---
inclusion: manual
---

# Semantic Token Structure Guide

**Date**: November 17, 2025
**Last Reviewed**: 2025-12-30
**Purpose**: Document SemanticToken interface requirements and usage patterns
**Organization**: token-documentation
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, token-creation

---

## Overview

This guide documents the SemanticToken interface structure, required fields, and usage patterns. Semantic tokens provide contextual meaning while referencing primitive tokens to maintain mathematical consistency. They represent higher-level abstractions for specific design contexts.

**Key Principles**:
- All semantic tokens MUST reference primitive tokens (no direct values)
- Semantic tokens provide contextual meaning and usage guidance
- The `primitiveReferences` field is REQUIRED for all semantic tokens
- Semantic tokens can reference single or multiple primitive tokens

**Documentation Approach**:

This document follows concept-based documentation principles without code examples to prevent contamination. Instead of showing code to copy, we describe the structure and point to source files that represent the current, validated patterns.

**Why no code examples**: Code examples in documentation can drift out of sync with production code and create a contamination vector where outdated patterns get copied. The source files are the source of truth - they're validated by tests and represent current, correct patterns.

---

## SemanticToken Interface

### Interface Source of Truth

**Location**: `src/types/SemanticToken.ts`

The SemanticToken interface defines the contract for all semantic tokens in the system. Read this file directly to see the complete TypeScript interface definition with inline documentation for each field.

**Key Interface Characteristics**:
- Eight total fields (five required, three optional)
- Uses TypeScript Record type for primitive references
- Includes SemanticCategory enum for categorization
- Supports platform-specific overrides for special cases

### Required Fields

All semantic tokens MUST include these five fields. Missing any required field will cause validation failures.

#### 1. `name` (string) - REQUIRED

The semantic token name with contextual meaning that describes its purpose.

**Format**: Use dot notation for hierarchical organization

**Naming Conventions**:
- Use descriptive, contextual names that indicate purpose (not implementation details)
- Follow dot notation for hierarchical organization
- Use camelCase for the final segment
- Avoid primitive token names in semantic names

**Real-World Examples**:
- See `src/tokens/semantic/ColorTokens.ts` for color token naming patterns
- See `src/tokens/semantic/TypographyTokens.ts` for typography token naming patterns
- See `src/tokens/semantic/SpacingTokens.ts` for spacing token naming patterns

#### 2. `primitiveReferences` (Record<string, string>) - REQUIRED

References to primitive tokens that this semantic token uses. This is the MOST IMPORTANT field as it establishes the primitive→semantic relationship.

**Structure**: TypeScript Record type where keys describe the reference purpose and values are primitive token names (strings)

**Two Reference Patterns**:

**Single-Reference Pattern** (colors, spacing, borders):
- Object with single key `value` pointing to one primitive token
- Used when semantic token represents a single primitive value
- See `color.primary` and `color.error` tokens in `src/tokens/semantic/ColorTokens.ts` for examples
- See `spacing.grouped.normal` token in `src/tokens/semantic/SpacingTokens.ts` for spacing examples

**Multi-Reference Pattern** (typography, shadows):
- Object with multiple keys, each pointing to a different primitive token
- Used when semantic token composes multiple primitive properties
- Keys describe the property being referenced (fontSize, lineHeight, etc.)
- See `typography.bodyMd` and `typography.h1` tokens in `src/tokens/semantic/TypographyTokens.ts` for examples
- See `shadow.container` and `shadow.modal` tokens in `src/tokens/semantic/ShadowTokens.ts` for examples

**Why This Field is Required**:
- Maintains the primitive→semantic hierarchy that enables mathematical consistency
- Enables automatic updates when primitive tokens change
- Provides clear architectural relationships for AI-human collaboration
- Allows validation that referenced primitives exist before registration
- Preserves token relationships in generated platform files (not just resolved values)


#### 3. `category` (SemanticCategory) - REQUIRED

The semantic category for organizational purposes. Must be one of the defined SemanticCategory enum values.

**Enum Source**: See `SemanticCategory` enum in `src/types/SemanticToken.ts` for complete definition

**Available Categories**:
- COLOR - Color tokens (primary, error, success, etc.)
- SPACING - Spacing tokens (grouped, related, separated, etc.)
- TYPOGRAPHY - Typography tokens (body, heading, label, etc.)
- BORDER - Border tokens (default, emphasis, heavy)
- SHADOW - Shadow tokens (container, modal, hover, etc.)
- LAYOUT - Layout tokens (grid, flex patterns)
- LAYERING - Layering tokens (z-index, elevation)
- INTERACTION - Interaction tokens (hover, focus, active states)

**Purpose**:
- Organizes tokens by functional category for easier discovery
- Enables filtering and querying by category in token registries
- Provides clear organizational structure for documentation
- Helps developers find related tokens quickly

**Real-World Usage**:
- See `src/tokens/semantic/ColorTokens.ts` for COLOR category usage
- See `src/tokens/semantic/TypographyTokens.ts` for TYPOGRAPHY category usage
- See `src/tokens/semantic/SpacingTokens.ts` for SPACING category usage

#### 4. `context` (string) - REQUIRED

Contextual meaning or usage description that explains WHEN and WHERE to use this token.

**Purpose**: Provides actionable usage guidance for developers and AI agents making token selection decisions

**Content Guidelines**:
- Be specific about usage contexts with concrete examples
- Focus on WHEN to use the token (not WHAT it is)
- Include appropriate use cases (CTAs, paragraphs, form fields, etc.)
- Avoid vague descriptions that don't guide decision-making

**Real-World Examples**:
- See `color.primary` and `color.error` tokens in `src/tokens/semantic/ColorTokens.ts` for context descriptions
- See `typography.bodyMd` and `typography.h1` tokens in `src/tokens/semantic/TypographyTokens.ts` for context descriptions
- See `spacing.grouped.normal` token in `src/tokens/semantic/SpacingTokens.ts` for context descriptions

**Pattern**: Context field typically starts with the token's purpose followed by specific use cases in parentheses


#### 5. `description` (string) - REQUIRED

Detailed description of semantic meaning and appropriate usage that explains WHAT the token represents.

**Purpose**: Provides comprehensive understanding of the token's semantic meaning and characteristics

**Content Guidelines**:
- Use complete sentences describing the token's purpose
- Include specific details about characteristics (values, properties, qualities)
- Explain semantic meaning beyond just technical details
- For composite tokens, describe all component properties
- Include actual values in parentheses for clarity (16px, 1.5 line height, etc.)

**Real-World Examples**:
- See `color.primary` and `color.error` tokens in `src/tokens/semantic/ColorTokens.ts` for description patterns
- See `typography.bodyMd` and `typography.h1` tokens in `src/tokens/semantic/TypographyTokens.ts` for descriptions with all properties
- See `shadow.container` and `shadow.modal` tokens in `src/tokens/semantic/ShadowTokens.ts` for descriptions with quality indicators

**Pattern**: Description field typically includes the semantic meaning followed by specific characteristics in parentheses

### Optional Fields

#### 6. `primitiveTokens` (Record<string, PrimitiveToken>) - OPTIONAL

Resolved primitive tokens populated during token resolution. This field is automatically populated by the token resolution system and should NOT be manually set when creating semantic tokens.

**Purpose**: Stores resolved primitive token objects for runtime use after validation

**When Populated**: During token resolution when semantic tokens are registered in the SemanticTokenRegistry

**Structure**: Record where keys match `primitiveReferences` keys and values are complete PrimitiveToken objects

**Important**: This field is managed by the system. When creating semantic tokens, only define `primitiveReferences` (the names). The system resolves these to actual token objects.

#### 7. `platforms` (object) - OPTIONAL

Platform-specific properties for tokens that need different values per platform. Used primarily by shadow tokens to specify Android elevation values that can't be expressed through primitive references.

**Purpose**: Handles platform-specific requirements that don't fit the primitive reference model

**Structure**: Object with optional `web`, `ios`, and `android` keys, each containing platform-specific properties

**Primary Use Case**: Shadow tokens on Android require Material Design elevation values (in dp) that determine both stacking order and shadow rendering

**Real-World Usage**:
- See `shadow.container` and `shadow.modal` tokens in `src/tokens/semantic/ShadowTokens.ts` for Android elevation usage
- Most semantic tokens do NOT need this field - only use when platform-specific values are required


#### 8. `_meta` (Record<string, string>) - OPTIONAL

Optional metadata for additional context such as dedications, notes, or other non-functional information.

**Purpose**: Stores supplementary information that doesn't affect token functionality or generation

**Structure**: Record with string keys and string values for arbitrary metadata

**Use Cases**: Dedications, implementation notes, historical context, or other documentation that doesn't belong in the main fields

**Important**: This field is for human-readable metadata only. It doesn't affect token validation, generation, or platform output.

---

## Token Structure Patterns

### Single-Reference Tokens

Tokens that reference a single primitive token. Used for colors, spacing, borders, and other simple values where the semantic token represents one primitive value.

**Characteristics**:
- `primitiveReferences` object has single key named `value`
- Value points to one primitive token name
- Used for straightforward semantic mappings (primary color, normal spacing, default border)

**Real-World Examples**:
- **Color tokens**: See `color.primary` token in `src/tokens/semantic/ColorTokens.ts` (references `purple300`)
- **Spacing tokens**: See `spacing.grouped.normal` token in `src/tokens/semantic/SpacingTokens.ts` (references `space100`)
- **Border tokens**: See `src/tokens/semantic/BorderWidthTokens.ts` for border width tokens with single-reference pattern

**Pattern Recognition**: If the semantic token represents a single value (one color, one spacing value, one border width), use single-reference pattern with `{ value: 'primitiveName' }`


### Multi-Reference Tokens (Composite)

Tokens that reference multiple primitive tokens to create complete compositions. Used for typography, shadows, and other complex tokens where the semantic token combines multiple primitive properties.

**Characteristics**:
- `primitiveReferences` object has multiple keys, each describing a property
- Each key points to a different primitive token
- Keys are descriptive property names (fontSize, lineHeight, offsetX, blur, etc.)
- Used for complex semantic tokens that compose multiple primitives

**Real-World Examples**:

**Typography Tokens** (5 properties):
- See `typography.bodyMd` and `typography.h1` tokens in `src/tokens/semantic/TypographyTokens.ts`
- References: fontSize, lineHeight, fontFamily, fontWeight, letterSpacing
- Each property references a different primitive token
- All five properties required for complete typography definition

**Shadow Tokens** (5 properties + platform-specific):
- See `shadow.container` and `shadow.modal` tokens in `src/tokens/semantic/ShadowTokens.ts`
- References: offsetX, offsetY, blur, opacity, color
- Each property references a different shadow primitive
- Includes `platforms.android.elevation` for Material Design compliance

**Pattern Recognition**: If the semantic token represents multiple properties that must work together (typography style, shadow effect), use multi-reference pattern with descriptive keys for each property


---

## Validation Requirements

### Required Field Validation

All semantic tokens MUST pass these validation checks before registration. Missing or invalid required fields will cause validation failures.

**Five Required Fields**:
1. `name` field must exist and be non-empty string
2. `primitiveReferences` field must exist and be non-empty object
3. `category` field must exist and be valid SemanticCategory enum value
4. `context` field must exist and be non-empty string
5. `description` field must exist and be non-empty string

**Validation Implementation**: See `src/tokens/semantic/__tests__/SemanticTokenIntegration.test.ts` for validation test cases that verify required field presence

### Primitive Reference Validation

All primitive references MUST pass these validation checks to ensure the primitive→semantic relationship is valid.

**Validation Rules**:
1. Referenced primitive tokens must exist in the PrimitiveTokenRegistry
2. Primitive token names must be spelled correctly (exact match required)
3. Primitive references must use correct format (object with string values)
4. For single-reference: object must have `value` key
5. For multi-reference: object must have descriptive property keys

**Validation Implementation**: See `src/tokens/semantic/__tests__/ValidatePrimitiveReferences.test.ts` for primitive reference validation test cases

**Why This Matters**: Invalid primitive references break the token generation system because semantic tokens can't resolve to actual values if the referenced primitives don't exist.

### Category Validation

The `category` field MUST be one of the defined SemanticCategory enum values. Using invalid category values will cause validation failures.

**Valid Categories** (see `SemanticCategory` enum in `src/types/SemanticToken.ts`):
- COLOR - for color semantic tokens
- SPACING - for spacing semantic tokens
- TYPOGRAPHY - for typography semantic tokens
- BORDER - for border semantic tokens
- SHADOW - for shadow semantic tokens
- LAYOUT - for layout semantic tokens
- LAYERING - for layering semantic tokens
- INTERACTION - for interaction semantic tokens

**Validation**: The TypeScript compiler enforces this at compile-time. Runtime validation also checks category validity.

---

## How to Validate Tokens Before Committing

This section explains how to validate your semantic tokens before committing changes to ensure they meet all structural and reference requirements.

### Validation Workflow

**Step 1: Run TypeScript Compilation**

TypeScript compilation catches structural issues, missing required fields, and type mismatches.

```bash
npm run build
```

**What This Validates**:
- All required fields are present (name, primitiveReferences, category, context, description)
- Field types match the SemanticToken interface (strings, objects, enums)
- Category values are valid SemanticCategory enum members
- TypeScript syntax is correct

**Common Errors Caught**:
- Missing required fields (compilation error: "Property 'primitiveReferences' is missing")
- Invalid category values (compilation error: "Type 'INVALID' is not assignable to type 'SemanticCategory'")
- Wrong field types (compilation error: "Type 'number' is not assignable to type 'string'")

**Step 2: Run Integration Tests**

Integration tests validate token structure, primitive references, and registration logic.

```bash
npm test
```

**What This Validates**:
- Semantic tokens can be registered successfully
- Primitive references resolve to existing primitive tokens
- Token structure matches expected patterns (single-reference vs multi-reference)
- All validation rules pass during registration

**Test Files to Check**:
- `src/tokens/semantic/__tests__/SemanticTokenIntegration.test.ts` - Token structure validation
- `src/tokens/semantic/__tests__/ValidatePrimitiveReferences.test.ts` - Primitive reference validation

**Common Errors Caught**:
- Invalid primitive token names (test failure: "Referenced primitive 'purple999' does not exist")
- Empty primitiveReferences object (test failure: "primitiveReferences cannot be empty")
- Missing required fields (test failure: "Token missing required field: context")

**Step 3: Verify Generated Output**

After building, verify that tokens generate correctly for all platforms.

```bash
# Build tokens
npm run build

# Check generated files exist
ls -la dist/tokens/

# Verify platform-specific files
cat dist/tokens/DesignTokens.ios.swift
cat dist/tokens/DesignTokens.android.kt
cat dist/tokens/DesignTokens.web.css
```

**What This Validates**:
- Tokens generate successfully for all platforms (web, iOS, Android)
- Primitive references resolve to actual values in generated files
- Platform-specific overrides apply correctly (Android elevation, etc.)
- Generated files contain expected token definitions

**Common Issues Caught**:
- Missing tokens in generated output (indicates registration failure)
- Unresolved primitive references (shows as undefined or null in generated files)
- Platform-specific values not applied (Android elevation missing)

### Validation Checklist

Before committing semantic token changes, verify:

- ✅ **TypeScript compiles without errors** (`npm run build` succeeds)
- ✅ **All tests pass** (`npm test` shows all green)
- ✅ **Generated files exist** (dist/tokens/ contains platform files)
- ✅ **Tokens appear in generated output** (search for token name in generated files)
- ✅ **Primitive references resolve** (generated values match expected primitives)
- ✅ **Required fields present** (name, primitiveReferences, category, context, description)
- ✅ **Category is valid** (matches SemanticCategory enum value)
- ✅ **Primitive names are correct** (match existing primitive tokens exactly)

### Common Validation Errors

This section describes common validation errors you may encounter and how to fix them.

#### Error 1: "Property 'primitiveReferences' is missing"

**Cause**: Semantic token is missing the required `primitiveReferences` field

**How to Fix**: Add `primitiveReferences` field with at least one primitive token reference

**Where to Look**: Check the token definition in the semantic token file (ColorTokens.ts, TypographyTokens.ts, etc.)

**Correct Pattern**: See any token in `src/tokens/semantic/ColorTokens.ts` for examples with proper `primitiveReferences` field

#### Error 2: "Referenced primitive 'tokenName' does not exist"

**Cause**: The primitive token name in `primitiveReferences` doesn't match any registered primitive token

**How to Fix**: 
1. Check primitive token files in `src/tokens/` to find the correct token name
2. Verify spelling and capitalization (must match exactly)
3. Ensure the primitive token is registered in the appropriate primitive token file

**Common Mistakes**:
- Typos in token names (purple300 vs purple30)
- Wrong capitalization (Purple300 vs purple300)
- Using kebab-case instead of camelCase (purple-300 vs purple300)

**Where to Look**: 
- Primitive token definitions: `src/tokens/FontSizeTokens.ts`, `src/tokens/ColorTokens.ts`, etc.
- Primitive token names use camelCase without hyphens or underscores

#### Error 3: "primitiveReferences cannot be empty"

**Cause**: The `primitiveReferences` field exists but is an empty object `{}`

**How to Fix**: Add at least one primitive token reference to the object

**Exception**: Layering tokens (ZIndexTokens, ElevationTokens) are the only tokens allowed to have empty `primitiveReferences` - this is an architectural exception

**Correct Pattern**: 
- Single-reference: `{ value: 'primitiveName' }`
- Multi-reference: `{ fontSize: 'fontSize100', lineHeight: 'lineHeight150', ... }`

#### Error 4: "Type 'INVALID' is not assignable to type 'SemanticCategory'"

**Cause**: The `category` field uses an invalid value that's not in the SemanticCategory enum

**How to Fix**: Use one of the valid SemanticCategory enum values

**Valid Categories**: COLOR, SPACING, TYPOGRAPHY, BORDER, SHADOW, LAYOUT, LAYERING, INTERACTION

**Where to Look**: See `SemanticCategory` enum in `src/types/SemanticToken.ts` for complete definition

#### Error 5: "Token missing required field: context"

**Cause**: One of the five required fields is missing from the token definition

**How to Fix**: Add the missing required field with a non-empty value

**Five Required Fields**:
1. name (string)
2. primitiveReferences (object)
3. category (SemanticCategory enum)
4. context (string)
5. description (string)

**Where to Look**: See any token in `src/tokens/semantic/` for examples with all required fields

### Choosing Primitive References

When creating semantic tokens, you need to choose which primitive tokens to reference. This section provides guidance on making these decisions.

#### For Color Tokens

**Available Primitives**: See `src/tokens/ColorTokens.ts` for all color primitives

**Naming Pattern**: Colors use hue + numeric scale (purple300, cyan400, gray100, etc.)

**Selection Guidance**:
- Primary brand colors: Use mid-range values (300-400) for good contrast
- Error/warning colors: Use red/orange mid-range values (red400, orange400)
- Success colors: Use green mid-range values (green400)
- Neutral colors: Use gray scale for backgrounds and borders (gray100, gray200, etc.)

**Contrast Considerations**: Ensure referenced colors meet WCAG 2.1 AA contrast requirements for their intended use

#### For Spacing Tokens

**Available Primitives**: See `src/tokens/SpacingTokens.ts` for all spacing primitives

**Naming Pattern**: Spacing uses space + numeric scale (space050, space100, space150, etc.)

**Selection Guidance**:
- Grouped elements: Use smaller values (space100 = 8px, space150 = 12px)
- Related sections: Use medium values (space200 = 16px, space300 = 24px)
- Separated sections: Use larger values (space400 = 32px, space500 = 40px)

**Baseline Grid**: All spacing primitives align to 4px baseline grid for vertical rhythm

#### For Typography Tokens

**Available Primitives**: 
- Font sizes: See `src/tokens/FontSizeTokens.ts`
- Line heights: See `src/tokens/LineHeightTokens.ts`
- Font families: See `src/tokens/FontFamilyTokens.ts`
- Font weights: See `src/tokens/FontWeightTokens.ts`
- Letter spacing: See `src/tokens/LetterSpacingTokens.ts`

**Selection Guidance**:
- Body text: Use fontSize100 (16px) with lineHeight150 (24px) for readability
- Headings: Use larger font sizes (fontSize200-600) with tighter line heights (lineHeight125-150)
- Labels: Use smaller font sizes (fontSize075-100) with medium line heights (lineHeight150)
- Font weights: Use regular (400) for body, medium (500) for labels, bold (700) for headings

**Typography Composition**: All five properties (fontSize, lineHeight, fontFamily, fontWeight, letterSpacing) are required for complete typography tokens

#### For Shadow Tokens

**Available Primitives**: See `src/tokens/ShadowTokens.ts` for all shadow primitives

**Naming Pattern**: Shadow properties use descriptive names (offsetX, offsetY, blur, opacity, color)

**Selection Guidance**:
- Container shadows: Use subtle shadows (small offset, medium blur, low opacity)
- Modal shadows: Use prominent shadows (larger offset, larger blur, higher opacity)
- Hover shadows: Use slightly elevated shadows (medium offset, medium blur, medium opacity)

**Platform-Specific**: Shadow tokens on Android require `platforms.android.elevation` values for Material Design compliance

### Validation Best Practices

**1. Validate Early and Often**

Run validation after each token addition or modification, not just before committing. This catches errors early when they're easier to fix.

**2. Check Generated Output**

Don't just rely on tests passing - verify that tokens appear correctly in generated platform files. This catches issues with token resolution and generation.

**3. Use TypeScript Compiler**

Let TypeScript catch structural issues before running tests. The compiler provides immediate feedback on missing fields and type mismatches.

**4. Verify Primitive Token Names**

Before referencing a primitive token, check that it exists in the primitive token files. This prevents "token does not exist" errors.

**5. Follow Naming Conventions**

Use consistent naming patterns (camelCase, dot notation) to avoid validation errors and maintain system consistency.

**6. Test Cross-Platform Generation**

Verify that tokens generate correctly for all three platforms (web, iOS, Android), not just one. Platform-specific issues may only appear in certain generated files.

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Missing `primitiveReferences` Field

**Problem**: Creating a semantic token without the `primitiveReferences` field

**Why This Fails**: The `primitiveReferences` field is required for all semantic tokens (except layering tokens, which are an architectural exception). Without it, the token can't establish the primitive→semantic relationship.

**How to Fix**: Always include `primitiveReferences` field with at least one primitive token reference

**Correct Pattern**: See any token in `src/tokens/semantic/ColorTokens.ts` for examples with proper `primitiveReferences` field


### ❌ Mistake 2: Empty `primitiveReferences` Object

**Problem**: Including the `primitiveReferences` field but leaving it as an empty object

**Why This Fails**: An empty object provides no primitive references, which defeats the purpose of the primitive→semantic hierarchy. Validation checks for non-empty `primitiveReferences`.

**How to Fix**: Ensure `primitiveReferences` contains at least one key-value pair pointing to a primitive token

**Correct Pattern**: Single-reference tokens use `{ value: 'primitiveName' }`, multi-reference tokens use multiple descriptive keys

### ❌ Mistake 3: Direct Values Instead of References

**Problem**: Putting actual values (like `#9333EA` or `16px`) in `primitiveReferences` instead of primitive token names

**Why This Fails**: The `primitiveReferences` field must contain primitive token NAMES (strings), not values. The system resolves names to values during token resolution.

**How to Fix**: Use primitive token names (like `purple300`, `fontSize100`) not values (like `#9333EA`, `16`)

**Correct Pattern**: See `src/tokens/semantic/ColorTokens.ts` for examples using token names (purple300, cyan400) not values (#9333EA)

### ❌ Mistake 4: Invalid Primitive Token Names

**Problem**: Using incorrect naming conventions for primitive token references (kebab-case instead of camelCase, typos, etc.)

**Why This Fails**: Primitive token names must match exactly. The system validates that referenced primitives exist in the registry.

**How to Fix**: Use correct camelCase naming for primitive tokens (purple300, fontSize100, space150)

**Correct Pattern**: See `src/tokens/` directory for primitive token naming conventions - all use camelCase without hyphens or underscores


### ❌ Mistake 5: Missing Required Fields

**Problem**: Omitting one or more of the five required fields (name, primitiveReferences, category, context, description)

**Why This Fails**: All five required fields must be present for validation to pass. Missing any field causes registration failure.

**How to Fix**: Ensure all five required fields are present with non-empty values

**Correct Pattern**: See any token file in `src/tokens/semantic/` - all tokens include all five required fields

---

## Real-World Token Examples

Rather than showing code examples that may drift out of sync, this section points to actual token implementations in the codebase that represent current, validated patterns.

### Example 1: Simple Color Token

**Location**: See `color.error` token in `src/tokens/semantic/ColorTokens.ts`

**Pattern Demonstrated**:
- Single-reference pattern with `{ value: 'primitiveName' }`
- All five required fields present
- Clear context explaining when to use (error states, destructive actions)
- Detailed description explaining semantic meaning (approachable error color)

**Why This Example**: Shows the simplest semantic token structure with single primitive reference

### Example 2: Spacing Token

**Location**: See `spacing.related.normal` token in `src/tokens/semantic/SpacingTokens.ts`

**Pattern Demonstrated**:
- Single-reference pattern for spacing values
- Context specifies appropriate use cases (form sections, card groups)
- Description includes actual pixel value for clarity (12px)

**Why This Example**: Shows how spacing tokens follow the same single-reference pattern as color tokens


### Example 3: Typography Token (Multi-Reference)

**Location**: See `typography.h1` token in `src/tokens/semantic/TypographyTokens.ts`

**Pattern Demonstrated**:
- Multi-reference pattern with five properties (fontSize, lineHeight, fontFamily, fontWeight, letterSpacing)
- Each property references a different primitive token
- Context explains semantic usage (primary heading level for page titles)
- Description includes specific values for all properties

**Why This Example**: Shows how complex tokens compose multiple primitives to create complete typography definitions

### Example 4: Shadow Token (Multi-Reference with Platform-Specific)

**Location**: See `shadow.modal` token in `src/tokens/semantic/ShadowTokens.ts`

**Pattern Demonstrated**:
- Multi-reference pattern with five shadow properties (offsetX, offsetY, blur, opacity, color)
- Each property references a different shadow primitive
- Includes optional `platforms.android.elevation` for Material Design compliance
- Context explains modal usage (dialog overlays, modal windows)
- Description specifies shadow quality (soft depth)

**Why This Example**: Shows how shadow tokens use multi-reference pattern plus platform-specific values for Android


---

## Best Practices

### 1. Always Reference Primitives, Never Direct Values

Semantic tokens MUST reference primitive token names, never direct values. This maintains the primitive→semantic hierarchy and enables automatic updates when primitives change.

**Why This Matters**: When a primitive token value changes, all semantic tokens referencing it automatically update in generated platform files. Direct values break this relationship.

**How to Verify**: Check that `primitiveReferences` values are token names (purple300, fontSize100) not values (#9333EA, 16)

### 2. Use Descriptive, Semantic Names

Token names should describe purpose and context, not implementation details or primitive token names.

**Principle**: Names should answer "what is this for?" not "what primitive does this use?"

**Pattern**: Use dot notation with semantic segments (color.primary, typography.bodyMd, spacing.grouped.normal)

### 3. Provide Actionable Context

The `context` field should explain WHEN and WHERE to use the token with specific, concrete examples of appropriate use cases.

**Principle**: Context should guide decision-making, not just describe the token

**Pattern**: Start with purpose, follow with specific use cases in parentheses

### 4. Write Complete, Detailed Descriptions

The `description` field should explain WHAT the token represents with specific details about characteristics and values.

**Principle**: Description should provide comprehensive understanding of the token's semantic meaning

**Pattern**: Include semantic meaning plus specific characteristics in parentheses (values, properties, qualities)

### 5. Validate Primitive References Before Registration

Always verify that referenced primitive tokens exist in the system before creating semantic tokens.

**How**: Read primitive token files in `src/tokens/` to confirm token names, or run validation tests to catch invalid references

**Why**: Invalid references cause registration failures and break token generation

### 6. Use Correct SemanticCategory Values

Choose the SemanticCategory enum value that matches the token's functional purpose.

**Reference**: See `SemanticCategory` enum in `src/types/SemanticToken.ts` for complete definition

**Principle**: Category should match the token's primary function (COLOR for colors, TYPOGRAPHY for typography, etc.)

### 7. Use Platform-Specific Fields Sparingly

Only use the `platforms` field when platform-specific values are truly required and can't be expressed through primitive references.

**Primary Use Case**: Shadow tokens on Android require Material Design elevation values

**Principle**: Prefer primitive references over platform-specific overrides to maintain cross-platform consistency


---

## Architectural Exceptions

### Layering Tokens (Z-Index and Elevation)

Layering tokens (ZIndexTokens and ElevationTokens) are an architectural exception to the typical primitive→semantic pattern. They are **semantic-only tokens** with no primitive token layer.

**Why No Primitive Layer**:
- Ordinal values establish ordering relationships, not mathematical relationships
- Platform-specific scales differ fundamentally (web z-index 100-600 vs iOS 1-6 vs Android elevation 4-24dp)
- Component-driven stacking order, not mathematical progressions
- No meaningful mathematical relationship between values (modal isn't "4× more elevated" than container)

**Structural Exception**: Layering tokens are the ONLY semantic tokens where `primitiveReferences` can be empty. This is intentional and documented.

**Real-World Examples**:
- See `src/tokens/semantic/ZIndexTokens.ts` for z-index tokens with empty `primitiveReferences`
- See `src/tokens/semantic/ElevationTokens.ts` for Android elevation tokens with empty `primitiveReferences`

**Platform-Specific Values**: Layering tokens use the `platforms` field to specify different values for web, iOS, and Android since these platforms use fundamentally different scales.

**Important**: This exception applies ONLY to layering tokens. All other semantic token categories (color, spacing, typography, shadow, etc.) MUST have non-empty `primitiveReferences`.

---

## Related Documentation

- **SemanticToken Interface**: `src/types/SemanticToken.ts` - TypeScript interface definition
- **Token System Overview**: `docs/token-system-overview.md` - Complete token system navigation
- **Semantic Token Examples**:
  - `src/tokens/semantic/ColorTokens.ts` - Color semantic tokens
  - `src/tokens/semantic/TypographyTokens.ts` - Typography semantic tokens
  - `src/tokens/semantic/SpacingTokens.ts` - Spacing semantic tokens
  - `src/tokens/semantic/ShadowTokens.ts` - Shadow semantic tokens
- **Validation Tests**: `src/tokens/semantic/__tests__/SemanticTokenIntegration.test.ts` - Token structure validation tests
- **Component Development Guide**: `./Component Development and Practices Guide.md` - Token usage in component development
- **Token Resolution Patterns**: `./Token-Resolution-Patterns.md` - Strategic guidance on token type selection and validation

---

*This guide provides comprehensive documentation of SemanticToken interface requirements, validation rules, and usage patterns to ensure consistent token structure across the design system.*

