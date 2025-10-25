# Requirements Document: Semantic Token Generation

**Date**: 2025-01-15
**Spec**: semantic-token-generation
**Status**: Requirements Phase
**Dependencies**: None (extends existing TokenFileGenerator)

---

## Introduction

The DesignerPunk token system currently generates platform-specific files containing only primitive tokens (purple300, space100, etc.). Developers must use these raw primitive tokens directly, losing the semantic meaning and architectural relationships defined in the source system.

This spec adds semantic token generation to the existing TokenFileGenerator, enabling developers to use meaningful semantic tokens (colorPrimary, spacingGroupedNormal, etc.) that maintain visible references to their underlying primitive tokens across all platforms (web, iOS, Android).

Key architectural principles:
- Semantic tokens reference primitive tokens by name (not resolved values)
- Primitive→semantic relationships are preserved in generated code
- Generated files maintain dependency order (primitives before semantics)
- All platforms support reference-based token generation

### Existing System Context

The DesignerPunk token system has the following components that this spec extends:

**Code Components:**
- **TokenFileGenerator** (`src/generators/TokenFileGenerator.ts`): Orchestrates platform-specific file generation
- **getAllPrimitiveTokens()** (`src/tokens/index.ts`): Returns all primitive tokens as a flat array (renamed from `getAllTokens()` for clarity and symmetry with `getAllSemanticTokens()`)
- **getAllSemanticTokens()** (`src/tokens/semantic/index.ts`): Returns all semantic tokens as a flat array (implemented in task 1.2)
- **SemanticTokenRegistry** (`src/registries/SemanticTokenRegistry.ts`): Validates semantic token references
- **Platform Formatters**: WebFormatGenerator, iOSFormatGenerator, AndroidFormatGenerator provide platform-specific syntax

**API Naming Note**: `getAllTokens()` was renamed to `getAllPrimitiveTokens()` to eliminate ambiguity and create parallel naming with `getAllSemanticTokens()`. This supports the Rosetta Stone vision of unambiguous vocabulary for AI-human collaboration. A deprecated alias is maintained for backwards compatibility.

**Documentation:**
- **Token System Overview** (`docs/token-system-overview.md`): Master document mapping token files to their documentation and architecture

This spec extends TokenFileGenerator to include semantic tokens alongside existing primitive token generation, and updates the Token System Overview to document the new semantic token generation capabilities.

### Future Work

Shadow and glow tokens currently use separate one-off generators. Once this semantic token generation system is proven, a future spec will migrate shadow and glow tokens to use this unified generation approach and remove the one-off generators.

---

## Glossary

- **Primitive Token**: Mathematical foundation token with a direct value (e.g., purple300 = "#9333EA")
- **Semantic Token**: Contextual token that references a primitive token (e.g., colorPrimary references purple300)
- **Single-Reference Token**: Semantic token referencing one primitive (e.g., color, spacing, border tokens)
- **Multi-Reference Token**: Semantic token referencing multiple primitives (e.g., typography tokens)
- **TokenFileGenerator**: Existing system component that generates platform-specific token files
- **Reference Maintenance**: Preserving primitive→semantic relationships in generated code rather than resolving to values

---

## Requirements

### Requirement 1: Semantic Token Export

**User Story**: As a token system maintainer, I want to export all semantic tokens from the semantic token modules, so that the generator can access them for file generation.

#### Acceptance Criteria

1. WHEN the semantic token index is imported THEN THE system SHALL provide a function that returns all semantic tokens as an array
2. WHEN getAllSemanticTokens is called THEN THE system SHALL include color semantic tokens from the color module
3. WHEN getAllSemanticTokens is called THEN THE system SHALL include spacing semantic tokens from all spacing categories (grouped, related, separated, sectioned, inset)
4. WHEN getAllSemanticTokens is called THEN THE system SHALL include typography semantic tokens from the typography module
5. WHEN getAllSemanticTokens is called THEN THE system SHALL include border semantic tokens from the border module

### Requirement 2: Single-Reference Token Generation

**User Story**: As a developer, I want semantic tokens for colors, spacing, and borders to reference their primitive tokens by name in generated files, so that I can see the relationship between semantic and primitive tokens.

#### Acceptance Criteria

1. WHEN generating web tokens THEN THE system SHALL output semantic tokens that reference primitive token names (e.g., `export const colorPrimary = purple300;`)
2. WHEN generating iOS tokens THEN THE system SHALL output semantic tokens that reference primitive token names (e.g., `static let colorPrimary = purple300`)
3. WHEN generating Android tokens THEN THE system SHALL output semantic tokens that reference primitive token names (e.g., `val colorPrimary = purple300`)
4. WHEN generating tokens THEN THE system SHALL output all primitive tokens before any semantic tokens to maintain dependency order
5. WHEN a semantic token references a non-existent primitive THEN THE system SHALL fail generation with a clear error message

### Requirement 3: Multi-Reference Token Generation

**User Story**: As a developer, I want typography semantic tokens to reference multiple primitive tokens by name in generated files, so that I can see all the primitive relationships that compose a typography token.

#### Acceptance Criteria

1. WHEN generating web typography tokens THEN THE system SHALL output object literals with properties referencing primitive token names
2. WHEN generating iOS typography tokens THEN THE system SHALL output struct instances with parameters referencing primitive token names
3. WHEN generating Android typography tokens THEN THE system SHALL output data class instances with parameters referencing primitive token names
4. WHEN a typography token references multiple primitives THEN THE system SHALL include all primitive references (fontSize, lineHeight, fontFamily, fontWeight, letterSpacing)
5. IF any primitive reference in a typography token is invalid THEN THE system SHALL fail generation with a clear error message

### Requirement 4: Generated File Structure

**User Story**: As a developer, I want generated token files to have a clear structure with primitives first and semantics second, so that I can easily understand the token hierarchy and dependencies.

#### Acceptance Criteria

1. WHEN generating token files THEN THE system SHALL include a header comment explaining the file structure and usage guidance
2. WHEN generating token files THEN THE system SHALL output primitive tokens in a clearly marked section before semantic tokens
3. WHEN generating token files THEN THE system SHALL output semantic tokens in a clearly marked section after primitive tokens
4. WHEN generating token files THEN THE system SHALL include comments indicating which section contains primitives and which contains semantics
5. WHEN generating token files THEN THE system SHALL include usage guidance directing developers to use semantic tokens first

### Requirement 5: Cross-Platform Consistency

**User Story**: As a cross-platform developer, I want semantic tokens to work consistently across web, iOS, and Android, so that I can use the same semantic token names regardless of platform.

#### Acceptance Criteria

1. WHEN generating tokens for all platforms THEN THE system SHALL use identical semantic token names across web, iOS, and Android
2. WHEN generating tokens for all platforms THEN THE system SHALL maintain identical primitive→semantic relationships across web, iOS, and Android
3. WHEN generating tokens for all platforms THEN THE system SHALL use platform-appropriate syntax while preserving semantic meaning
4. IF a semantic token is generated for one platform THEN THE system SHALL generate the equivalent token for all other platforms
5. WHEN validating cross-platform consistency THEN THE system SHALL verify that all platforms have the same semantic token count

### Requirement 6: Backward Compatibility

**User Story**: As a developer using existing primitive tokens, I want the generator to continue outputting primitive tokens unchanged, so that existing code continues to work without modification.

#### Acceptance Criteria

1. WHEN generating token files THEN THE system SHALL output all primitive tokens exactly as before
2. WHEN generating token files THEN THE system SHALL maintain primitive token names, values, and formatting unchanged
3. WHEN existing code imports primitive tokens THEN THE code SHALL continue to work without modification
4. WHEN generating token files THEN THE system SHALL add semantic tokens without removing or modifying primitive tokens
5. IF generation fails THEN THE system SHALL provide clear error messages without breaking existing primitive token generation
