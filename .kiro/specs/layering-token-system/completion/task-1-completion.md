# Task 1 Completion: Create Z-Index Token Definitions (Web + iOS)

**Date**: October 28, 2025
**Task**: 1. Create Z-Index Token Definitions (Web + iOS)
**Type**: Parent
**Status**: Complete

---

## Artifacts Created

- `src/tokens/semantic/ZIndexTokens.ts` - Z-Index token definitions with semantic-only structure
- Updated `src/types/SemanticToken.ts` - Added LAYERING category to SemanticCategory enum

## Architecture Decisions

### Decision 1: Semantic-Only Token Structure

**Options Considered**:
1. Primitive→Semantic hierarchy (like spacing, fontSize)
2. Semantic-only tokens with direct values
3. Unified token set for all platforms

**Decision**: Semantic-only tokens with direct values

**Rationale**:

Z-index and elevation values are **ordinal** (ordering), not **mathematical** (relationships). There is no meaningful mathematical relationship between z-index 100 and 400 - they simply establish an ordering where 400 stacks above 100. "Modal" isn't "4× more elevated" than "container" in any mathematical sense.

Platform-specific scales don't align mathematically:
- Web uses arbitrary z-index scale (100, 200, 300, 400, 500, 600)
- iOS uses small integer scale (1, 2, 3, 4, 5, 6) for SwiftUI conventions
- These scales serve the same semantic purpose but with platform-appropriate values

Component-driven semantics are more meaningful than mathematical progressions. Developers think in terms of "modal z-index" or "dropdown z-index" rather than "z-index base × 4". The semantic names (container, modal, tooltip) directly communicate the intended use case.

**Trade-offs**:
- ✅ **Gained**: Simpler token structure without unnecessary primitive layer
- ✅ **Gained**: Platform-specific scales can differ appropriately
- ✅ **Gained**: Clear semantic naming without mathematical abstraction
- ❌ **Lost**: Consistency with other token categories (but appropriately so)
- ⚠️ **Risk**: Documented exception to typical primitive→semantic pattern

**Counter-Arguments**:
- **Argument**: "All other token categories have primitives - this breaks consistency"
- **Response**: Consistency for its own sake isn't valuable. Layering tokens are fundamentally different (ordinal vs mathematical). The semantic-only approach is the right pattern for this specific use case.

### Decision 2: 100-Based Scale for Web/iOS

**Options Considered**:
1. Small integer scale (1, 2, 3, 4, 5, 6)
2. 100-based scale (100, 200, 300, 400, 500, 600)
3. 1000-based scale (1000, 2000, 3000, etc.)

**Decision**: 100-based scale for web, scaled down to small integers for iOS during generation

**Rationale**:

The 100-based scale provides large gaps that allow for future insertion of intermediate levels without refactoring existing tokens. For example, if we need a "popover" level between navigation (200) and dropdown (300), we can add it as 250 without changing any existing values.

This is a common pattern across major design systems (Polaris, Carbon, Atlassian) and provides clear visual separation between levels. The arbitrary scale is appropriate for ordinal values that don't have mathematical relationships.

For iOS, the values will be scaled down during generation (divide by 100) to match SwiftUI conventions where small integers (1-6) are more idiomatic. The semantic meaning and relative ordering remain consistent across platforms.

**Trade-offs**:
- ✅ **Gained**: Future extensibility without refactoring
- ✅ **Gained**: Clear visual separation between levels
- ✅ **Gained**: Follows industry patterns
- ❌ **Lost**: Numeric consistency between web and iOS (but semantic consistency maintained)
- ⚠️ **Risk**: Developers might expect same values across platforms (documentation clarifies)

**Counter-Arguments**:
- **Argument**: "Different numeric values across platforms is confusing"
- **Response**: Semantic names are consistent (zIndex.modal), which is what developers use. The numeric values are platform-specific implementation details. Following platform conventions is more important than numeric consistency.

### Decision 3: Six Semantic Levels

**Options Considered**:
1. Four levels (minimal: base, overlay, modal, tooltip)
2. Six levels (current: container, navigation, dropdown, modal, toast, tooltip)
3. Eight levels (extended: add popover, sheet, etc.)

**Decision**: Six semantic levels

**Rationale**:

Six levels provide sufficient granularity for common UI patterns without excessive complexity:
- **container** (100): Base level for cards, panels, surfaces
- **navigation** (200): Persistent navigation elements
- **dropdown** (300): Temporary overlay content
- **modal** (400): Dialog overlays
- **toast** (500): Notification elements
- **tooltip** (600): Always-visible critical overlays

This covers the most common stacking scenarios in modern UI design. The 100-based increments allow for adding intermediate levels (like popover at 250) if needed in the future without refactoring.

**Trade-offs**:
- ✅ **Gained**: Covers common UI patterns comprehensively
- ✅ **Gained**: Clear semantic naming for each level
- ✅ **Gained**: Room for future expansion
- ❌ **Lost**: Simplicity of fewer levels
- ⚠️ **Risk**: Some edge cases might not fit perfectly (but can use direct values)

**Counter-Arguments**:
- **Argument**: "Six levels is too many - four would be simpler"
- **Response**: Modern UIs commonly use all six patterns. Collapsing them would force developers to make arbitrary choices about which semantic level to use, reducing clarity.

## Implementation Details

### Approach

Implemented z-index tokens in three phases corresponding to the subtasks:

1. **File Structure (Task 1.1)**: Created ZIndexTokens.ts with comprehensive documentation explaining the semantic-only architecture and rationale
2. **Token Definitions (Task 1.2)**: Defined six semantic levels with complete metadata (name, value, platforms, category, context, description)
3. **Helper Functions (Task 1.3)**: Implemented utility functions for token access and retrieval

Additionally, updated the SemanticCategory enum to include the LAYERING category as specified in the requirements.

### Key Patterns

**Pattern 1**: Semantic-Only Token Interface
- Created ZIndexToken interface without primitiveReferences property
- Tokens use direct numeric values instead of primitive references
- Maintains consistency with other semantic tokens while acknowledging the architectural difference

**Pattern 2**: Platform Metadata
- Each token includes platforms array specifying ['web', 'ios']
- Enables platform-specific generation logic to filter tokens appropriately
- Documents platform support explicitly in token metadata

**Pattern 3**: Comprehensive Metadata
- Each token includes name, value, platforms, category, context, and description
- Context provides brief usage summary
- Description provides detailed explanation of intended use cases
- Enables AI agents and developers to understand token purpose without external documentation

### Integration Points

The z-index tokens integrate with:
- **SemanticCategory enum**: Added LAYERING category for organizational purposes
- **Cross-Platform Build System**: Platform metadata enables filtering for web/iOS generation
- **Shadow Token System**: Z-index tokens used independently with shadow tokens for visual depth
- **AI Agent System**: Comprehensive metadata enables AI agents to select appropriate tokens

## Validation (Tier 3: Comprehensive - Parent Task)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors in ZIndexTokens.ts
✅ getDiagnostics passed - no syntax errors in SemanticToken.ts
✅ All imports resolve correctly
✅ Type annotations correct throughout

### Functional Validation
✅ zIndexTokens object contains all six semantic levels
✅ Each token has correct structure (name, value, platforms, category, context, description)
✅ Values use 100-based scale (100, 200, 300, 400, 500, 600)
✅ Platform metadata correctly specifies ['web', 'ios']
✅ getZIndexToken() retrieves tokens by name correctly
✅ getAllZIndexTokens() returns all tokens as array
✅ zIndexTokenNames array contains all token names

### Design Validation
✅ Semantic-only architecture appropriate for ordinal layering values
✅ Six semantic levels cover common UI stacking patterns
✅ 100-based scale allows for future intermediate levels
✅ Platform metadata enables platform-specific generation
✅ Comprehensive metadata supports AI agent usage

### System Integration
✅ LAYERING category added to SemanticCategory enum
✅ ZIndexToken interface follows semantic token patterns
✅ Helper functions provide consistent access patterns
✅ Documentation explains architectural decisions clearly

### Edge Cases
✅ Token retrieval handles invalid names gracefully (returns undefined)
✅ Platform metadata enables filtering for platform-specific generation
✅ 100-based scale allows for future expansion without refactoring
✅ Semantic names remain consistent even if numeric values differ across platforms

### Subtask Integration
✅ Task 1.1 (file structure) provides foundation with comprehensive documentation
✅ Task 1.2 (token definitions) implements six semantic levels with complete metadata
✅ Task 1.3 (helper functions) provides utility functions for token access
✅ All subtasks integrate seamlessly into cohesive token system

## Success Criteria Verification

### Criterion 1: Z-Index tokens defined with semantic-only structure

**Evidence**: ZIndexTokens.ts implements semantic-only tokens without primitive references

**Verification**:
- ZIndexToken interface uses direct numeric values
- No primitiveReferences property in token structure
- Documentation explains semantic-only architecture rationale
- Tokens follow semantic naming pattern (zIndex.container, zIndex.modal, etc.)

**Example**:
```typescript
export interface ZIndexToken {
  name: string;
  value: number;  // Direct value, not primitive reference
  platforms: string[];
  category: SemanticCategory;
  context: string;
  description: string;
}
```

### Criterion 2: Six semantic levels implemented

**Evidence**: zIndexTokens object contains exactly six semantic levels

**Verification**:
- container (100): Base level for container components
- navigation (200): Persistent navigation elements
- dropdown (300): Temporary overlay content
- modal (400): Dialog overlays
- toast (500): Notification elements
- tooltip (600): Always-visible critical overlays

**Example**:
```typescript
export const zIndexTokens: Record<string, ZIndexToken> = {
  'zIndex.container': { value: 100, ... },
  'zIndex.navigation': { value: 200, ... },
  'zIndex.dropdown': { value: 300, ... },
  'zIndex.modal': { value: 400, ... },
  'zIndex.toast': { value: 500, ... },
  'zIndex.tooltip': { value: 600, ... }
};
```

### Criterion 3: Platform metadata correctly specifies web and iOS support

**Evidence**: Each token includes platforms array with ['web', 'ios']

**Verification**:
- All six tokens include platforms: ['web', 'ios']
- Platform metadata enables filtering during generation
- Documentation specifies Android should use elevation tokens instead

**Example**:
```typescript
'zIndex.modal': {
  name: 'zIndex.modal',
  value: 400,
  platforms: ['web', 'ios'],  // Explicit platform support
  category: SemanticCategory.LAYERING,
  context: 'Modal dialogs',
  description: 'Z-index for modal overlay content (dialogs, sheets, overlays)'
}
```

### Criterion 4: Helper functions provide token access and retrieval

**Evidence**: Three helper functions implemented for token access

**Verification**:
- getZIndexToken(name): Retrieves single token by name
- getAllZIndexTokens(): Returns all tokens as array
- zIndexTokenNames: Array of all token names for iteration

**Example**:
```typescript
// Single token retrieval
const modalToken = getZIndexToken('zIndex.modal');
// Returns: { name: 'zIndex.modal', value: 400, ... }

// All tokens retrieval
const allTokens = getAllZIndexTokens();
// Returns: [{ name: 'zIndex.container', ... }, { name: 'zIndex.navigation', ... }, ...]

// Token names for iteration
zIndexTokenNames.forEach(name => {
  const token = getZIndexToken(name);
  // Process each token
});
```

## Overall Integration Story

### Complete Workflow

The z-index token system provides semantic layering tokens for web and iOS platforms:

1. **Token Definition**: Six semantic levels defined with 100-based scale
2. **Platform Metadata**: Each token specifies web and iOS support
3. **Helper Functions**: Utility functions enable easy token access and retrieval
4. **Category Integration**: LAYERING category added to SemanticCategory enum

This workflow establishes the foundation for cross-platform layering token generation while maintaining semantic consistency across platforms.

### Subtask Contributions

**Task 1.1**: Create ZIndexTokens.ts file structure
- Established file with comprehensive documentation
- Explained semantic-only architecture rationale
- Imported necessary types from SemanticToken

**Task 1.2**: Implement z-index token definitions
- Defined six semantic levels with complete metadata
- Used 100-based scale for future extensibility
- Specified platform support for web and iOS

**Task 1.3**: Implement helper functions
- Created getZIndexToken() for single token retrieval
- Created getAllZIndexTokens() for all tokens
- Exported zIndexTokenNames array for iteration

### System Behavior

The z-index token system now provides:
- Semantic layering tokens for web and iOS platforms
- Clear stacking order hierarchy (container < navigation < dropdown < modal < toast < tooltip)
- Platform-appropriate values (100-based for web, will be scaled for iOS during generation)
- Comprehensive metadata for AI agent usage
- Helper functions for easy token access

### User-Facing Capabilities

Developers can now:
- Use semantic z-index tokens with clear meaning (zIndex.modal, zIndex.dropdown)
- Rely on consistent stacking order across platforms
- Access tokens via helper functions (getZIndexToken, getAllZIndexTokens)
- Understand token purpose through comprehensive metadata
- Extend the system by adding intermediate levels without refactoring

## Requirements Compliance

✅ Requirement 1.1: Platform-specific token sets (z-index for web/iOS)
✅ Requirement 1.2: Platform metadata indicating ['web', 'ios']
✅ Requirement 2.1: Semantic naming consistency (container, navigation, dropdown, modal, toast, tooltip)
✅ Requirement 2.2: Component-based semantic names
✅ Requirement 3.1: Semantic-only token structure without primitive layer
✅ Requirement 3.2: Direct numeric values appropriate for platform scale
✅ Requirement 5.1: Six semantic levels provided
✅ Requirement 5.2: Clear layering hierarchy (container lowest, tooltip highest)
✅ Requirement 5.3: 100-based increments for future extensibility
✅ Requirement 10.2: Integration with cross-platform build system via platform metadata
✅ Requirement 10.4: LAYERING category added to SemanticCategory enum

## Lessons Learned

### What Worked Well

- **Semantic-Only Architecture**: The decision to skip the primitive layer for layering tokens was correct. Z-index values are ordinal, not mathematical, so the primitive→semantic hierarchy doesn't apply.
- **100-Based Scale**: Large gaps between values provide excellent extensibility. We can add intermediate levels (like popover at 250) without refactoring.
- **Comprehensive Metadata**: Including context and description for each token makes the system self-documenting and AI-friendly.
- **Platform Metadata**: Explicit platform support in token metadata enables clean platform-specific generation logic.

### Challenges

- **Category Naming**: Initially used LAYOUT category, but requirements specified LAYERING. This required updating both the enum and all token definitions.
  - **Resolution**: Added LAYERING to SemanticCategory enum and updated all tokens to use the correct category.
- **Semantic-Only Pattern**: This is an exception to the typical primitive→semantic hierarchy used elsewhere in the system.
  - **Resolution**: Documented the rationale extensively in code comments and completion documentation to explain why this exception is appropriate.

### Future Considerations

- **iOS Value Scaling**: Current implementation uses 100-based scale for web. During generation, iOS values should be scaled down (divide by 100) to match SwiftUI conventions (1-6 instead of 100-600).
  - Could add scaling logic to iOS format generator
  - Could document expected iOS values in token metadata
- **Intermediate Levels**: The 100-based scale allows for future expansion. If needed, we can add levels like:
  - popover (250): Between navigation and dropdown
  - sheet (350): Between dropdown and modal
  - These can be added without refactoring existing tokens
- **Platform-Specific Overrides**: Some platforms might need different semantic levels or values. The platform metadata pattern supports this extensibility.

## Integration Points

### Dependencies

- **SemanticCategory enum**: Z-index tokens depend on LAYERING category being defined
- **TypeScript type system**: ZIndexToken interface provides type safety for token structure

### Dependents

- **Cross-Platform Build System**: Will depend on platform metadata to filter tokens for web/iOS generation
- **Elevation Tokens**: Android elevation tokens will follow similar semantic-only pattern
- **Semantic Token Index**: Will export z-index tokens and helper functions
- **AI Agent System**: Will use token metadata for intelligent token selection

### Extension Points

- **New Semantic Levels**: Can add intermediate levels using 100-based scale (e.g., popover at 250)
- **Platform-Specific Values**: Can add platform-specific overrides if needed
- **Additional Platforms**: Can extend platforms array if new platforms need z-index tokens
- **Custom Metadata**: Can add additional metadata fields to ZIndexToken interface if needed

### API Surface

**ZIndexToken Interface**:
- `name: string` - Token name (e.g., 'zIndex.modal')
- `value: number` - Z-index value (100-600)
- `platforms: string[]` - Supported platforms (['web', 'ios'])
- `category: SemanticCategory` - Token category (LAYERING)
- `context: string` - Brief usage summary
- `description: string` - Detailed usage explanation

**Helper Functions**:
- `getZIndexToken(name: string): ZIndexToken | undefined` - Retrieve single token by name
- `getAllZIndexTokens(): ZIndexToken[]` - Retrieve all tokens as array
- `zIndexTokenNames: string[]` - Array of all token names for iteration

---

## Post-Completion Note

**Date**: October 28, 2025

After completing Task 1, identified opportunity to improve conceptual clarity between ZIndexTokens and ElevationTokens through a unified entry point. Added Task 3 to create LayeringTokens.ts index file that re-exports both token sets and provides unified API. See Design.md Decision 6 for full rationale.

This does not change Task 1 implementation - it's an additive enhancement that establishes clearer relationship between the two token sets.

---

**Organization**: spec-completion
**Scope**: layering-token-system
