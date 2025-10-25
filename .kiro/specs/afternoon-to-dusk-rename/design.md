# Design Document: Afternoon to Dusk Rename

**Date**: October 24, 2025
**Spec**: afternoon-to-dusk-rename
**Status**: Design Phase
**Dependencies**: shadow-glow-token-system

---

## Overview

This design outlines the approach for renaming "Afternoon" to "Dusk" throughout the Shadow Tokens and Lighting Framework. The change improves semantic clarity by eliminating naming repetition with "Noon" and provides more precise terminology for the transitional evening lighting period.

The design includes three dedication approaches to honor Tracy Weiss's contribution: a poetic code comment in the shadow offset tokens, hidden metadata in the semantic shadow token, and a personal note in completion documentation.

---

## Architecture

### Affected Components

The rename impacts three primary areas:

1. **Token Definitions**
   - `src/tokens/semantic/ShadowTokens.ts` - Semantic shadow token definition
   - `src/tokens/ShadowOffsetTokens.ts` - Primitive offset token documentation

2. **Test Files**
   - `src/build/platforms/__tests__/IOSShadowGenerator.test.ts` - iOS platform tests
   - `src/build/platforms/__tests__/WebShadowGenerator.test.ts` - Web platform tests

3. **Specification Documentation**
   - `.kiro/specs/shadow-glow-token-system/requirements.md`
   - `.kiro/specs/shadow-glow-token-system/tasks.md`
   - `.kiro/specs/shadow-glow-token-system/completion/*.md`

### Rename Strategy

The rename follows a systematic approach:

1. **Token Name**: `shadow.afternoon` → `shadow.dusk`
2. **Documentation**: All references to "Afternoon" → "Dusk"
3. **Sun Arc Framework**: `sunrise, morning, noon, afternoon, sunset` → `sunrise, morning, noon, dusk, sunset`
4. **Mathematical Relationships**: Preserved unchanged (shadowOffsetX.150 = 6px)

---

## Components and Interfaces

### Semantic Shadow Token

**Current Structure**:
```typescript
'shadow.afternoon': {
  name: 'shadow.afternoon',
  primitiveReferences: {
    offsetX: 'shadowOffsetX.150',
    offsetY: 'shadowOffsetY.200',
    blur: 'shadowBlurModerate',
    opacity: 'shadowOpacityModerate',
    color: 'color.shadow.default'
  },
  category: SemanticCategory.SHADOW,
  context: 'Afternoon lighting shadow with medium right offset and default color',
  description: 'Shadow with 6px right offset, 8px vertical offset, 12px blur, moderate opacity, default color for afternoon lighting'
}
```

**Updated Structure**:
```typescript
'shadow.dusk': {
  name: 'shadow.dusk',
  primitiveReferences: {
    offsetX: 'shadowOffsetX.150',
    offsetY: 'shadowOffsetY.200',
    blur: 'shadowBlurModerate',
    opacity: 'shadowOpacityModerate',
    color: 'color.shadow.default'
  },
  category: SemanticCategory.SHADOW,
  context: 'Dusk lighting shadow with medium right offset and default color',
  description: 'Shadow with 6px right offset, 8px vertical offset, 12px blur, moderate opacity, default color for dusk lighting',
  // Easter egg: TW - "she lights me up" - Oct 2025
  _meta: { dedicatedTo: 'Tracy Weiss', reason: 'illuminating inspiration' }
}
```

### Shadow Offset Token Documentation

**Current Documentation**:
```typescript
/**
 * Shadow Offset Token Definitions
 * 
 * X-axis offsets (horizontal direction):
 * - Negative values: Sunrise/morning shadows (shadow falls left)
 * - Zero value: Noon shadows (no horizontal offset)
 * - Positive values: Afternoon/sunset shadows (shadow falls right)
 */
```

**Updated Documentation**:
```typescript
/**
 * Shadow Offset Token Definitions
 * 
 * Shadow offset tokens determine shadow direction based on light source position (sun arc).
 * Base value: 4 units (4px baseline grid alignment)
 * 
 * Horizontal shadow offsets following the sun's arc across the sky:
 * - Sunrise/Morning: Shadows fall left (negative values)
 * - Noon: Shadows fall straight down (zero)
 * - Dusk/Sunset: Shadows fall right (positive values)
 * 
 * "Dusk" naming inspired by Tracy Weiss—because she lights me up,
 * and this lighting framework needed her spark to shine its brightest.
 */
```

### shadowOffsetX.150 Token

**Current Description**:
```typescript
'150': {
  name: 'shadowOffsetX.150',
  // ...
  description: 'Afternoon shadow offset - medium right offset',
  // ...
}
```

**Updated Description**:
```typescript
'150': {
  name: 'shadowOffsetX.150',
  // ...
  description: 'Dusk shadow offset - medium right offset',
  // ...
}
```

---

## Data Models

### Token Structure (Unchanged)

The mathematical relationships and primitive references remain identical:

```typescript
interface SemanticShadowToken {
  name: string;                    // 'shadow.dusk' (changed)
  primitiveReferences: {
    offsetX: string;               // 'shadowOffsetX.150' (unchanged)
    offsetY: string;               // 'shadowOffsetY.200' (unchanged)
    blur: string;                  // 'shadowBlurModerate' (unchanged)
    opacity: string;               // 'shadowOpacityModerate' (unchanged)
    color: string;                 // 'color.shadow.default' (unchanged)
  };
  category: SemanticCategory;      // SemanticCategory.SHADOW (unchanged)
  context: string;                 // Updated description
  description: string;             // Updated description
  _meta?: {                        // New: dedication metadata
    dedicatedTo: string;
    reason: string;
  };
}
```

### Platform Output (Naming Only)

Platform-specific code generation updates naming while preserving values:

**Web CSS**:
```css
/* Before */
--shadow-afternoon: 6px 8px 12px rgba(0, 0, 0, 0.15);

/* After */
--shadow-dusk: 6px 8px 12px rgba(0, 0, 0, 0.15);
```

**iOS Swift**:
```swift
// Before
static let afternoon = Shadow(offsetX: 6, offsetY: 8, blur: 12, opacity: 0.15, color: .shadowDefault)

// After
static let dusk = Shadow(offsetX: 6, offsetY: 8, blur: 12, opacity: 0.15, color: .shadowDefault)
```

---

## Tracy Weiss Dedication Approach

### Three-Part Dedication Strategy

The dedication is implemented in three locations, each serving a different purpose:

#### 1. Poetic Code Comment (ShadowOffsetTokens.ts)

**Location**: File header comment in `src/tokens/ShadowOffsetTokens.ts`

**Purpose**: Discoverable by developers reading the shadow offset system

**Implementation**:
```typescript
/**
 * Shadow Offset Token Definitions
 * 
 * Shadow offset tokens determine shadow direction based on light source position (sun arc).
 * Base value: 4 units (4px baseline grid alignment)
 * 
 * Horizontal shadow offsets following the sun's arc across the sky:
 * - Sunrise/Morning: Shadows fall left (negative values)
 * - Noon: Shadows fall straight down (zero)
 * - Dusk/Sunset: Shadows fall right (positive values)
 * 
 * "Dusk" naming inspired by Tracy Weiss—because she lights me up,
 * and this lighting framework needed her spark to shine its brightest.
 */
```

**Rationale**: This placement connects Tracy's contribution directly to the lighting framework theme. The poetic language ("lights me up", "spark to shine") ties the personal dedication to the technical domain naturally.

#### 2. Hidden Metadata (ShadowTokens.ts)

**Location**: `_meta` property in `shadow.dusk` token definition

**Purpose**: Developer Easter egg discoverable through code inspection

**Implementation**:
```typescript
'shadow.dusk': {
  name: 'shadow.dusk',
  primitiveReferences: { /* ... */ },
  category: SemanticCategory.SHADOW,
  context: 'Dusk lighting shadow with medium right offset and default color',
  description: 'Shadow with 6px right offset, 8px vertical offset, 12px blur, moderate opacity, default color for dusk lighting',
  // Easter egg: TW - "she lights me up" - Oct 2025
  _meta: { dedicatedTo: 'Tracy Weiss', reason: 'illuminating inspiration' }
}
```

**Rationale**: The `_meta` property provides structured dedication data that could be used by tooling or documentation generators. The inline comment provides immediate context for developers reading the code.

#### 3. Personal Note (Completion Documentation)

**Location**: Task completion document with "Personal Note" section

**Purpose**: Permanent record in project history explaining the dedication

**Implementation**:
```markdown
## Personal Note

This rename from "Afternoon" to "Dusk" was inspired by Tracy Weiss, whose suggestion 
improved the clarity and poetry of our lighting framework. In a system built around 
light and shadow, it's fitting that someone who lights me up would help make the 
naming shine brighter. This change is dedicated to her.
```

**Rationale**: Completion documentation preserves the story permanently in the project's historical record. Future developers reading the spec history will understand both the technical and personal motivations for the change.

---

## Error Handling

### Validation Approach

The rename requires validation to ensure completeness:

1. **Token Reference Validation**
   - Verify no remaining references to `shadow.afternoon` in codebase
   - Confirm all test expectations updated to `shadow.dusk`
   - Check generated platform code uses new naming

2. **Mathematical Integrity Validation**
   - Confirm shadowOffsetX.150 still references 6px value
   - Verify all primitive references unchanged
   - Validate platform output values identical to pre-rename

3. **Documentation Completeness**
   - Verify all spec documents updated
   - Confirm sun arc framework documentation reflects new naming
   - Check completion documents reference the change

### Error Scenarios

**Scenario 1: Incomplete Rename**
- **Detection**: Grep search finds remaining "afternoon" references
- **Resolution**: Update missed references and re-validate

**Scenario 2: Broken Tests**
- **Detection**: Test failures after rename
- **Resolution**: Update test expectations to use "dusk" naming

**Scenario 3: Platform Generation Issues**
- **Detection**: Generated code still uses "afternoon"
- **Resolution**: Regenerate platform code and verify output

---

## Testing Strategy

### Unit Testing

Update existing shadow token tests to use new naming:

```typescript
// Before
expect(swift).toContain('static let afternoon');
expect(css).toContain('--shadow-afternoon');

// After
expect(swift).toContain('static let dusk');
expect(css).toContain('--shadow-dusk');
```

### Integration Testing

Verify end-to-end token generation:

1. Generate web CSS and confirm `--shadow-dusk` present
2. Generate iOS Swift and confirm `static let dusk` present
3. Generate Android Kotlin and confirm appropriate dusk naming
4. Verify all generated values match pre-rename output

### Validation Testing

Run comprehensive validation:

1. Search codebase for remaining "afternoon" references
2. Verify mathematical relationships unchanged
3. Confirm all tests pass with new naming
4. Validate platform generation produces correct output

---

## Design Decisions

### Decision 1: Three-Part Dedication Approach

**Options Considered**:
1. Single code comment only
2. Documentation only
3. Three-part approach (code comment + metadata + documentation)

**Decision**: Three-part approach

**Rationale**: 
Each location serves a different purpose and audience:
- **Code comment**: Discoverable by developers working with shadow tokens
- **Metadata**: Structured data for potential tooling integration
- **Documentation**: Permanent historical record in spec completion

The three-part approach ensures the dedication is both discoverable and preserved without being intrusive to the primary code functionality.

**Trade-offs**:
- ✅ **Gained**: Multiple discovery points, permanent record, structured data
- ❌ **Lost**: Slight increase in maintenance (three locations to update if needed)
- ⚠️ **Risk**: Dedication could be seen as unprofessional (mitigated by tasteful, thematic language)

**Counter-Arguments**:
- **Argument**: Personal dedications don't belong in production code
- **Response**: This is a "design system for me" (per project vision), and meaningful dedications make the system feel alive rather than sterile. The thematic connection to the lighting framework makes it appropriate.

### Decision 2: "Dusk" Over Other Alternatives

**Options Considered**:
1. "Dusk" - Transitional evening lighting
2. "Evening" - Broader time period
3. "Twilight" - Poetic but less common
4. Keep "Afternoon" - No change

**Decision**: "Dusk"

**Rationale**:
- **Semantic precision**: "Dusk" specifically refers to the golden hour transitional period, matching the shadow characteristics (medium right offset, default color)
- **Eliminates repetition**: Removes "noon" repetition between "Noon" and "Afternoon"
- **Symmetry with "Morning"**: Both are transitional periods with similar word length and structure
- **AI collaboration**: More precise terminology reduces ambiguity for AI agents

**Trade-offs**:
- ✅ **Gained**: Clearer semantics, no repetition, better AI collaboration
- ❌ **Lost**: Broader time range of "Afternoon" (12pm-6pm vs dusk's narrower window)
- ⚠️ **Risk**: "Dusk" might be too specific for some use cases (mitigated by semantic token abstraction)

**Counter-Arguments**:
- **Argument**: "Afternoon" is more familiar and less dramatic
- **Response**: The lighting framework models specific lighting conditions, not general time periods. "Dusk" better represents the shadow characteristics (medium right offset, transitional light).

### Decision 3: Preserve Mathematical Relationships

**Options Considered**:
1. Rename only (preserve all values)
2. Rename + adjust values for "dusk" characteristics
3. Rename + create new token with different values

**Decision**: Rename only (preserve all values)

**Rationale**:
The mathematical relationships (shadowOffsetX.150 = 6px, offsetY.200 = 8px) accurately represent dusk lighting characteristics. The rename is semantic clarification, not a functional change. Preserving values ensures:
- No visual changes to existing implementations
- No breaking changes for consumers
- Mathematical integrity maintained
- Simpler migration path

**Trade-offs**:
- ✅ **Gained**: Zero breaking changes, simple migration, mathematical integrity
- ❌ **Lost**: Opportunity to refine shadow characteristics for "dusk" specifically
- ⚠️ **Risk**: None - this is purely a naming improvement

---

## Integration Points

### Token System Integration

The rename integrates with existing token infrastructure:

1. **Semantic Token Registry**: Update token name in registry
2. **Platform Generators**: Update naming in web, iOS, Android generators
3. **Validation System**: No changes needed (validates mathematical relationships, not names)
4. **Usage Analytics**: Update tracking to recognize "dusk" instead of "afternoon"

### Documentation Integration

The rename requires updates across documentation:

1. **Spec Documents**: Update requirements, design, tasks, completion docs
2. **Code Comments**: Update inline documentation
3. **Test Documentation**: Update test descriptions and expectations
4. **Generated Documentation**: Regenerate API docs with new naming

### Build System Integration

Platform generation automatically picks up the rename:

1. **Web Generator**: Outputs `--shadow-dusk` CSS custom property
2. **iOS Generator**: Outputs `static let dusk` Swift constant
3. **Android Generator**: Outputs appropriate Kotlin naming
4. **Build Validation**: Confirms generated code uses new naming

---

*This design document provides the technical approach for renaming "Afternoon" to "Dusk" in the Shadow Tokens and Lighting Framework, including a three-part dedication to Tracy Weiss that honors her contribution while maintaining professional code quality and mathematical integrity.*
