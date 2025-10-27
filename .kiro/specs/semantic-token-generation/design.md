# Design Document: Semantic Token Generation

**Date**: 2025-01-15
**Spec**: semantic-token-generation
**Status**: Design Phase
**Dependencies**: None (extends existing TokenFileGenerator)

---

## Overview

This design extends the existing TokenFileGenerator to include semantic token generation alongside primitive tokens. The key innovation is maintaining primitive→semantic references in generated code rather than resolving to values, preserving the architectural relationships for developers and AI agents.

The design leverages existing infrastructure (TokenFileGenerator, platform formatters, SemanticTokenRegistry) and adds minimal new code to export semantic tokens and generate them with references maintained across all three platforms (web, iOS, Android).

---

## Architecture

### High-Level Flow

```
Semantic Token Definitions (TypeScript)
    ↓
getAllSemanticTokens() exports them
    ↓
TokenFileGenerator reads primitives + semantics
    ↓
Platform Formatters generate platform-specific syntax
    ↓
Generated Files (primitives first, then semantics with references)
    ↓
Developers import and use semantic tokens
```

### Component Relationships

```
┌─────────────────────────────────────────────────────────────┐
│ Semantic Token Modules                                       │
│ - src/tokens/semantic/ColorTokens.ts                        │
│ - src/tokens/semantic/SpacingTokens.ts                      │
│ - src/tokens/semantic/TypographyTokens.ts                   │
│ - src/tokens/semantic/BorderWidthTokens.ts                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Semantic Token Index (NEW)                                  │
│ src/tokens/semantic/index.ts                                │
│ - getAllSemanticTokens()                                    │
│ - Exports all semantic tokens as flat array                 │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ TokenFileGenerator (EXTENDED)                               │
│ src/generators/TokenFileGenerator.ts                        │
│ - generateWebTokens() - adds semantic section               │
│ - generateiOSTokens() - adds semantic section               │
│ - generateAndroidTokens() - adds semantic section           │
│ - generateSemanticSection() - NEW method                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Platform Formatters (EXTENDED)                              │
│ - WebFormatGenerator - adds formatSemanticToken()           │
│ - iOSFormatGenerator - adds formatSemanticToken()           │
│ - AndroidFormatGenerator - adds formatSemanticToken()       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Generated Output Files                                      │
│ - DesignTokens.web.js (primitives + semantics)             │
│ - DesignTokens.ios.swift (primitives + semantics)          │
│ - DesignTokens.android.kt (primitives + semantics)         │
└─────────────────────────────────────────────────────────────┘
```

---

## Components and Interfaces

### Semantic Token Index

**File**: `src/tokens/semantic/index.ts`

**Purpose**: Export all semantic tokens for generator access

**Interface**:
```typescript
/**
 * Get all semantic tokens as a flat array
 * Includes: colors, spacing (all categories), typography, borders
 */
export function getAllSemanticTokens(): SemanticToken[];

/**
 * Get semantic tokens by category
 */
export function getSemanticTokensByCategory(category: SemanticCategory): SemanticToken[];
```

**Implementation Approach**:
- Import all semantic token modules
- Flatten spacing categories (grouped, related, separated, sectioned, inset)
- Return as single array for generator consumption
- Maintain type safety with SemanticToken interface

### TokenFileGenerator Extensions

**File**: `src/generators/TokenFileGenerator.ts`

**New Methods**:

```typescript
/**
 * Generate semantic token section for a platform
 * Handles both single-reference and multi-reference tokens
 */
private generateSemanticSection(
  semantics: SemanticToken[],
  platform: 'web' | 'ios' | 'android'
): string[];

/**
 * Generate a single-reference semantic token
 * Example: colorPrimary = purple300
 */
private generateSingleReferenceToken(
  semantic: SemanticToken,
  formatter: FormatProvider
): string;

/**
 * Generate a multi-reference semantic token (typography)
 * Example: typographyBodyMd = { fontSize: fontSize100, ... }
 */
private generateMultiReferenceToken(
  semantic: SemanticToken,
  formatter: FormatProvider
): string;
```

**Modified Methods**:
```typescript
// Existing methods extended to include semantic section
generateWebTokens(options: GenerationOptions): GenerationResult;
generateiOSTokens(options: GenerationOptions): GenerationResult;
generateAndroidTokens(options: GenerationOptions): GenerationResult;
```

### Platform Formatter Extensions

**Files**: 
- `src/providers/WebFormatGenerator.ts`
- `src/providers/iOSFormatGenerator.ts`
- `src/providers/AndroidFormatGenerator.ts`

**New Methods**:

```typescript
/**
 * Format a single-reference semantic token
 * Web: export const colorPrimary = purple300;
 * iOS: static let colorPrimary = purple300
 * Android: val color_primary = purple_300
 */
formatSingleReferenceToken(semantic: SemanticToken): string;

/**
 * Format a multi-reference semantic token (typography)
 * Web: export const typographyBodyMd = { fontSize: fontSize100, ... };
 * iOS: static let typographyBodyMd = Typography(fontSize: fontSize100, ...)
 * Android: val typography_body_md = Typography(fontSize = font_size_100, ...)
 */
formatMultiReferenceToken(semantic: SemanticToken): string;

/**
 * Generate section header comment
 * Marks primitive vs semantic sections
 */
generateSectionComment(section: 'primitive' | 'semantic'): string;
```

---

## Data Models

### SemanticToken (Existing)

```typescript
interface SemanticToken {
  name: string;
  primitiveReferences: {
    value?: string;  // Single-reference tokens
    // Multi-reference tokens (typography)
    fontSize?: string;
    lineHeight?: string;
    fontFamily?: string;
    fontWeight?: string;
    letterSpacing?: string;
  };
  category: SemanticCategory;
  context: string;
  description: string;
}
```

**No changes needed** - existing structure supports both single and multi-reference tokens.

### Generated File Structure

**All Platforms Follow This Pattern**:

```
// Header Comment (usage guidance)

// ============================================
// PRIMITIVE TOKENS
// Mathematical foundation
// ============================================

[All primitive tokens - existing generation]

// ============================================
// SEMANTIC TOKENS  
// Use these for UI development
// ============================================

[All semantic tokens - NEW generation]
```

---

## Platform Naming Conventions

**Source of Truth**: `src/naming/PlatformNamingRules.ts`

All platform-specific token naming follows the conventions defined in `PlatformNamingRules.ts`. This ensures consistency between primitive and semantic token generation and provides a single, authoritative source for naming rules.

### Naming Convention Summary

| Platform | Convention | Prefix | Example Primitive | Example Semantic |
|----------|-----------|--------|-------------------|------------------|
| **Web** | `kebab-case` | `--` | `--font-size-100` | `--color-primary` |
| **iOS** | `camelCase` | none | `fontSize100` | `colorPrimary` |
| **Android** | `snake_case` | none | `font_size_100` | `color_primary` |

### Platform-Specific Rules

**Web (CSS Custom Properties)**:
- Convention: `kebab-case`
- Prefix: `--` (CSS custom property prefix)
- Example: `--purple-300`, `--color-primary`, `--typography-body-md`
- Rationale: CSS custom properties require `--` prefix and use kebab-case by convention

**iOS (Swift)**:
- Convention: `camelCase`
- Prefix: none
- Example: `purple300`, `colorPrimary`, `typographyBodyMd`
- Rationale: Swift naming conventions use camelCase for properties and constants

**Android (Kotlin)**:
- Convention: `snake_case`
- Prefix: none
- Example: `purple_300`, `color_primary`, `typography_body_md`
- Rationale: Android XML resources and Kotlin constants traditionally use snake_case

### Dot Notation Handling

Semantic tokens may use dot notation in their source definitions (e.g., `color.primary`, `typography.bodySm`). The platform formatters convert these to platform-appropriate naming:

- **Web**: Converts to kebab-case with prefix: `color.primary` → `--color-primary`
- **iOS**: Removes dots and converts to camelCase: `color.primary` → `colorPrimary`
- **Android**: Removes dots and converts to snake_case: `color.primary` → `color_primary`

This conversion is handled automatically by the `getPlatformTokenName()` function in `PlatformNamingRules.ts`, ensuring consistency across all token types.

---

## Platform-Specific Generation

### Web (JavaScript)

**Single-Reference Token**:
```javascript
// Primitive
export const purple300 = "#9333EA";

// Semantic (references primitive)
export const colorPrimary = purple300;
```

**Multi-Reference Token**:
```javascript
// Primitives
export const fontSize100 = 16;
export const lineHeight100 = 24;
export const fontFamilyBody = "system-ui";
export const fontWeight400 = 400;
export const letterSpacing100 = 0;

// Semantic (references multiple primitives)
export const typographyBodyMd = {
  fontSize: fontSize100,
  lineHeight: lineHeight100,
  fontFamily: fontFamilyBody,
  fontWeight: fontWeight400,
  letterSpacing: letterSpacing100
};
```

### iOS (Swift)

**Single-Reference Token**:
```swift
struct DesignTokens {
    // Primitive
    static let purple300 = UIColor(hex: "#9333EA")
    
    // Semantic (references primitive)
    static let colorPrimary = purple300
}
```

**Multi-Reference Token**:
```swift
struct Typography {
    let fontSize: CGFloat
    let lineHeight: CGFloat
    let fontFamily: String
    let fontWeight: UIFont.Weight
    let letterSpacing: CGFloat
}

struct DesignTokens {
    // Primitives
    static let fontSize100: CGFloat = 16
    static let lineHeight100: CGFloat = 24
    static let fontFamilyBody = "system-ui"
    static let fontWeight400 = UIFont.Weight.regular
    static let letterSpacing100: CGFloat = 0
    
    // Semantic (references multiple primitives)
    static let typographyBodyMd = Typography(
        fontSize: fontSize100,
        lineHeight: lineHeight100,
        fontFamily: fontFamilyBody,
        fontWeight: fontWeight400,
        letterSpacing: letterSpacing100
    )
}
```

### Android (Kotlin)

**Single-Reference Token**:
```kotlin
object DesignTokens {
    // Primitive
    val purple_300 = Color(0xFF9333EA)
    
    // Semantic (references primitive)
    val color_primary = purple_300
}
```

**Multi-Reference Token**:
```kotlin
data class Typography(
    val fontSize: Float,
    val lineHeight: Float,
    val fontFamily: String,
    val fontWeight: Int,
    val letterSpacing: Float
)

object DesignTokens {
    // Primitives
    val font_size_100 = 16f
    val line_height_100 = 24f
    val font_family_body = "system-ui"
    val font_weight_400 = 400
    val letter_spacing_100 = 0f
    
    // Semantic (references multiple primitives)
    val typography_body_md = Typography(
        fontSize = font_size_100,
        lineHeight = line_height_100,
        fontFamily = font_family_body,
        fontWeight = font_weight_400,
        letterSpacing = letter_spacing_100
    )
}
```

---

## Error Handling

### Reference Validation

**When**: During generation, before outputting semantic tokens

**Validation**:
1. Check that all primitive references exist in primitive token list
2. For single-reference tokens: validate `primitiveReferences.value` exists
3. For multi-reference tokens: validate all required references exist (fontSize, lineHeight, etc.)

**Error Messages**:
```typescript
// Invalid single reference
`Semantic token '${semantic.name}' references non-existent primitive '${primitiveRef}'`

// Invalid multi-reference
`Semantic token '${semantic.name}' has invalid ${property} reference '${primitiveRef}'`

// Missing required reference
`Typography token '${semantic.name}' missing required reference: ${property}`
```

### Generation Failures

**Graceful Degradation**:
- If semantic generation fails, primitive generation continues
- Error logged with specific semantic token that failed
- Generation result includes error details
- Existing primitive token output remains valid

**Validation Result**:
```typescript
interface GenerationResult {
  platform: 'web' | 'ios' | 'android';
  filePath: string;
  content: string;
  tokenCount: number;
  semanticTokenCount: number;  // NEW
  valid: boolean;
  errors?: string[];
  warnings?: string[];  // NEW - for non-fatal issues
}
```

---

## Testing Strategy

### Unit Tests

**Semantic Token Export**:
- `getAllSemanticTokens()` returns all semantic tokens
- Includes tokens from all categories (color, spacing, typography, border)
- Returns correct count of semantic tokens
- Each token has valid structure (name, primitiveReferences, category)

**Single-Reference Generation**:
- Web formatter generates correct JavaScript syntax
- iOS formatter generates correct Swift syntax
- Android formatter generates correct Kotlin syntax
- References use primitive token names (not values)

**Multi-Reference Generation**:
- Web formatter generates object literal with all properties
- iOS formatter generates struct instance with all parameters
- Android formatter generates data class instance with all parameters
- All primitive references included

**Reference Validation**:
- Invalid primitive reference throws error
- Missing required reference (typography) throws error
- Error messages are clear and actionable

### Integration Tests

**End-to-End Generation**:
- Generate web tokens with primitives + semantics
- Generate iOS tokens with primitives + semantics
- Generate Android tokens with primitives + semantics
- Verify file structure (primitives first, semantics second)
- Verify cross-platform consistency (same token names)

**Backward Compatibility**:
- Existing primitive token generation unchanged
- Primitive token count matches previous generation
- Primitive token values unchanged
- Primitive token formatting unchanged

---

## Design Decisions

### Decision 1: Maintain References vs Resolve Values

**Options Considered**:
1. Resolve semantic tokens to primitive values in generated code
2. Maintain references to primitive token names in generated code

**Decision**: Maintain references (Option 2)

**Rationale**: 
Maintaining references preserves the architectural relationship between primitive and semantic tokens, making it visible to developers and AI agents. This aligns with the "Rosetta Stone" vision of unambiguous communication - developers can see that `colorPrimary` comes from `purple300`, not just that both happen to be `#9333EA`.

The reference chain is valuable for:
- Understanding token relationships
- Debugging token usage
- AI agent reasoning about token architecture
- Future refactoring (change purple300, colorPrimary updates automatically)

**Trade-offs**:
- ✅ **Gained**: Visible relationships, better understanding, architectural clarity
- ❌ **Lost**: Slightly more complex generation logic (must maintain references)
- ⚠️ **Risk**: Requires primitives defined before semantics (easily managed)

**Counter-Arguments**:
- **Argument**: Resolved values are simpler and work everywhere
- **Response**: References work on all three platforms (JavaScript, Swift, Kotlin all support constant references). The complexity is minimal and the architectural benefit is significant.

### Decision 2: Single File vs Separate Files

**Options Considered**:
1. Generate separate files for primitives and semantics
2. Generate single file with both primitives and semantics

**Decision**: Single file (Option 2)

**Rationale**:
A single file per platform is simpler for developers - one import source, one file to manage. The file structure (primitives first, semantics second with clear section comments) provides visual separation without the complexity of managing multiple files and cross-file imports.

For reference maintenance to work, semantics must be able to reference primitives. In a single file, this is straightforward (primitives defined first). With separate files, semantics would need to import from primitives, adding complexity.

**Trade-offs**:
- ✅ **Gained**: Simpler imports, single source of truth, easier file management
- ❌ **Lost**: Less physical separation between primitives and semantics
- ⚠️ **Risk**: Larger file size (mitigated by clear section comments)

**Counter-Arguments**:
- **Argument**: Separate files enforce "use semantics first" principle
- **Response**: Steering docs and section comments provide guidance. Physical separation isn't necessary when semantic token names themselves communicate intent (`colorPrimary` vs `purple300`).

### Decision 3: Extend Existing Generator vs New Generator

**Options Considered**:
1. Create new SemanticTokenGenerator separate from TokenFileGenerator
2. Extend existing TokenFileGenerator to include semantics

**Decision**: Extend existing generator (Option 2)

**Rationale**:
The existing TokenFileGenerator already handles platform-specific generation, file writing, and validation. Extending it to include semantics leverages this infrastructure and maintains a single generation pipeline. A separate generator would duplicate logic and create two systems to maintain.

The extension is minimal (add semantic section generation) and doesn't disrupt existing primitive generation, maintaining backward compatibility.

**Trade-offs**:
- ✅ **Gained**: Leverage existing infrastructure, single generation pipeline, backward compatibility
- ❌ **Lost**: Slightly larger TokenFileGenerator class
- ⚠️ **Risk**: Changes could affect primitive generation (mitigated by tests)

**Counter-Arguments**:
- **Argument**: Separate generator provides cleaner separation of concerns
- **Response**: The concerns are related (both generate platform-specific token files). Separation would create duplication without meaningful architectural benefit.

### Decision 4: Rename getAllTokens() to getAllPrimitiveTokens()

**Options Considered**:
1. Keep `getAllTokens()` as-is (returns only primitive tokens)
2. Rename to `getAllPrimitiveTokens()` for clarity and symmetry

**Decision**: Rename to `getAllPrimitiveTokens()` (Option 2)

**Rationale**:
With the introduction of `getAllSemanticTokens()`, the name `getAllTokens()` becomes ambiguous - does it return all tokens (primitive + semantic) or just primitive tokens? Renaming to `getAllPrimitiveTokens()` creates perfect symmetry with `getAllSemanticTokens()` and eliminates ambiguity.

This aligns with the Rosetta Stone vision of unambiguous vocabulary for AI-human collaboration. Explicit naming reduces interpretation errors and makes the API self-documenting.

**Trade-offs**:
- ✅ **Gained**: Clear parallel naming, eliminates ambiguity, self-documenting API
- ✅ **Gained**: Frees up `getAllTokens()` for potential future combined function
- ❌ **Lost**: Breaking change requiring updates to 5 code files
- ⚠️ **Risk**: Minimal - TypeScript catches all references, small surface area

**Counter-Arguments**:
- **Argument**: If it's working and everyone understands it, why create churn?
- **Response**: We're building a system designed for AI-human collaboration where ambiguity is the enemy. The cost is 20 minutes now; the benefit is permanent clarity. This is the kind of small decision that prevents confusion when new developers or AI agents join the project.

**Implementation Note**: A deprecated alias (`export const getAllTokens = getAllPrimitiveTokens`) is maintained for backwards compatibility, though with only 5 code files affected, it may be removed in v2.0.

---

## Integration Points

### Dependencies

**SemanticTokenRegistry**: Used to validate semantic token references during generation. Generator calls registry to verify primitive references exist before outputting semantic tokens.

**Platform Formatters**: Extended to support semantic token formatting. Each formatter gains methods for single-reference and multi-reference token generation.

**Primitive Token Generation**: Semantic generation depends on primitive generation completing first. Primitives must be in the output before semantics can reference them.

### Dependents

**Developer Code**: Will import and use semantic tokens from generated files. Code like `import { colorPrimary } from './DesignTokens.web.js'` becomes possible.

**Documentation**: Token System Overview (`docs/token-system-overview.md`) will be updated to document semantic token generation and usage patterns.

**Future Specs**: Shadow/glow token migration will depend on this semantic generation system being proven and stable.

---

## Implementation Notes

### Order of Implementation

1. **Semantic Token Export** - Create `getAllSemanticTokens()` in semantic index
2. **Web Generation** - Extend web formatter and generator (simplest platform)
3. **iOS Generation** - Extend iOS formatter and generator
4. **Android Generation** - Extend Android formatter and generator
5. **Validation** - Add reference validation and error handling
6. **Testing** - Unit and integration tests for all platforms
7. **Documentation** - Update Token System Overview

### Key Implementation Details

**Flattening Spacing Tokens**:
Spacing tokens are organized hierarchically (grouped.tight, grouped.normal, etc.). The export function must flatten these into a single array while preserving the full token names.

**Typography Token Handling**:
Typography tokens have multiple primitive references. The generator must iterate over all references and format them appropriately for each platform (object literal for web, struct for iOS, data class for Android).

**Section Comments**:
Each platform formatter generates section comments differently (JavaScript `//`, Swift `//`, Kotlin `//`). The comment content is the same, but formatting must match platform conventions.

**Reference Validation Timing**:
Validation happens during generation, not at token definition time. This allows the generator to provide specific error messages about which platform generation failed and why.

---

## Future Enhancements

### Shadow/Glow Token Migration

Once this semantic generation system is proven, shadow and glow tokens will be migrated from their one-off generators to use this unified approach. This will:
- Remove duplicate generation logic
- Provide consistent generation across all token types
- Simplify the overall system architecture

### Linting Rules

Future work could add linting rules that warn when developers use primitive tokens directly instead of semantic tokens, reinforcing the "use semantics first" principle.

### Token Documentation Generation

The generator could be extended to output token documentation alongside code, showing token relationships, usage examples, and platform-specific considerations.
