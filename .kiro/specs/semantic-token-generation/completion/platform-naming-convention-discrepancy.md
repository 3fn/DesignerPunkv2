# Platform Naming Convention Discrepancy

**Date**: October 26, 2025
**Discovered During**: Task 6.5 - Integration test debugging
**Issue Type**: Design-Implementation Mismatch
**Status**: Requires Investigation
**Organization**: spec-completion
**Scope**: semantic-token-generation

---

## Summary

A significant discrepancy exists between the design document specifications and the actual implementation regarding platform-specific naming conventions, particularly for Android. This affects both primitive and semantic token generation and has caused 3 of 5 remaining test failures.

---

## The Discrepancy

### Design Document Specification

**File**: `.kiro/specs/semantic-token-generation/design.md`

The design document shows Android using **camelCase** for both primitives and semantics:

```kotlin
object DesignTokens {
    // Primitives (shown as camelCase)
    val purple300 = Color(0xFF9333EA)
    val fontSize100 = 16f
    val lineHeight100 = 24f
    
    // Semantics (shown as camelCase)
    val colorPrimary = purple300
    val typographyBodyMd = Typography(
        fontSize = fontSize100,
        lineHeight = lineHeight100,
        ...
    )
}
```

### Actual Implementation

**File**: `src/naming/PlatformNamingRules.ts`

The implementation uses **snake_case** for Android:

```typescript
android: {
  platform: 'android',
  convention: 'snake_case',  // ← Actual rule
  reservedKeywords: [...],
  preserveAcronyms: false,
  categoryOverrides: {
    // XML resources use snake_case consistently
  }
}
```

### Actual Generated Output

**Primitives**: Use `snake_case` ✅
```kotlin
const val font_size_050: Float = 13f
const val font_size_075: Float = 14f
const val font_size_100: Float = 16f
const val purple_300: Int = 0xFF9333EA.toInt()
```

**Semantics**: Use `camelCase` (no dots) ❌
```kotlin
val colorprimary = purple_300
val colorsecondary = violet_300
val typographybody_sm = Typography(
    fontSize = font_size_075,
    lineHeight = line_height_075,
    ...
)
```

---

## Impact on Tests

This discrepancy caused 3 of the 5 remaining test failures in the integration test suite:

### Bug #1: Web Platform - File Structure Order
- **Test**: "should maintain file structure with primitives first, semantics second"
- **Issue**: `space100` appears AFTER semantic section starts
- **Root Cause**: Unrelated to naming - file generation order issue

### Bug #3: Android Platform - Primitive Token Naming
- **Test**: "should generate Android tokens with both primitives and semantics"
- **Expected**: `fontSize100` (per design document)
- **Actual**: `font_size_100` (per implementation)
- **Test Status**: **Test is wrong** - should expect `font_size_100`

### Bug #5: Cross-Platform - Semantic Token Naming
- **Test**: "should generate same semantic token names across all platforms"
- **Expected**: `typographybodySm` (camelCase, no dots)
- **Actual**: `typographybody_sm` (snake_case with underscore)
- **Test Status**: **Test is wrong** - should expect `typographybody_sm`

---

## Platform Naming Convention Analysis

### Current Implementation (PlatformNamingRules.ts)

| Platform | Convention | Prefix | Example Primitive | Example Semantic |
|----------|-----------|--------|-------------------|------------------|
| Web | `kebab-case` | `--` | `--font-size-100` | `--color-primary` |
| iOS | `camelCase` | none | `fontSize100` | `colorPrimary` |
| Android | `snake_case` | none | `font_size_100` | `color_primary` |

### Design Document Specification

| Platform | Convention | Example Primitive | Example Semantic |
|----------|-----------|-------------------|------------------|
| Web | `camelCase` | `fontSize100` | `colorPrimary` |
| iOS | `camelCase` | `fontSize100` | `colorPrimary` |
| Android | `camelCase` | `fontSize100` | `colorPrimary` |

**Note**: The design document shows JavaScript output (not CSS), which explains the camelCase for web.

---

## Semantic Token Naming Inconsistency

There's an additional inconsistency in how semantic tokens are currently generated:

### Expected Behavior (Per Design)
- **Web**: `colorPrimary` (camelCase, no dots)
- **iOS**: `colorPrimary` (camelCase, no dots)
- **Android**: `colorPrimary` (camelCase, no dots) OR `color_primary` (snake_case, no dots)

### Actual Behavior
- **Web**: `color.primary` (dot notation) ❌
- **iOS**: `colorPrimary` (camelCase, no dots) ✅
- **Android**: `colorprimary` (camelCase, no dots, no underscores) ❌

The web output is using **dot notation** for semantic tokens, which doesn't match any documented convention.

---

## Questions Requiring Resolution

### 1. What is the correct Android naming convention?

**Option A: snake_case (Current Implementation)**
- Aligns with Kotlin/Android XML resource conventions
- Matches primitive token generation
- Requires design document update

**Option B: camelCase (Design Document)**
- Matches iOS and web JavaScript conventions
- Provides cross-platform consistency
- Requires implementation update

**Recommendation**: Investigate Android/Kotlin best practices for design token naming. Android XML resources traditionally use `snake_case`, but Kotlin code can use `camelCase`.

### 2. Should semantic tokens use dot notation?

**Current Web Output**: `color.primary`, `typography.bodySm`
**Design Document**: `colorPrimary`, `typographyBodyMd`

The dot notation creates namespace-like grouping but:
- Doesn't work in all platforms (requires conversion)
- Not documented in design
- Creates inconsistency across platforms

**Questions**:
- Is dot notation intentional for semantic tokens?
- Should dots be converted to platform-appropriate separators?
- Should semantic token names be flattened (no dots)?

### 3. How should dots be converted per platform?

If dot notation is intentional for semantic tokens:

| Platform | Input | Expected Output | Current Output |
|----------|-------|----------------|----------------|
| Web (JS) | `color.primary` | `colorPrimary` or `color.primary`? | `color.primary` |
| iOS | `color.primary` | `colorPrimary` | `colorPrimary` ✅ |
| Android | `color.primary` | `color_primary` or `colorPrimary`? | `colorprimary` |

### 4. What about typography tokens with underscores?

**Current Android Output**: `typographybody_sm`
- Input: `typography.bodySm`
- Dots removed: `typographybodySm`
- Converted to snake_case: `typographybody_sm`

This creates ambiguity:
- Is `body_sm` one word or two?
- Should it be `typography_body_sm`?
- How do we preserve semantic structure?

---

## Token Specifications Documentation

The `token-specifications-v3.md` document defines naming structure but doesn't specify platform-specific conventions:

```markdown
### **Naming Structure**
{category}{value}

### **Semantic Token Category Prefixes**
- `typography` - Complete text style definitions
- `color` - Contextual color references
- `space` - Contextual spacing references
```

**Missing**:
- Platform-specific naming convention rules
- Dot notation handling across platforms
- Semantic token flattening rules

---

## Recommendations for Investigation

### 1. Audit All Naming Convention Sources

**Documents to Review**:
- `token-specifications-v3.md` - Token naming structure
- `.kiro/specs/semantic-token-generation/design.md` - Platform examples
- `src/naming/PlatformNamingRules.ts` - Implementation rules
- Any other design system documentation

**Goal**: Establish single source of truth for naming conventions.

### 2. Research Platform Best Practices

**Android/Kotlin**:
- Research Kotlin naming conventions for design tokens
- Check Material Design token naming
- Review Android XML resource naming standards

**Web/JavaScript**:
- Determine if dot notation is standard for design tokens
- Check CSS custom property naming conventions
- Review JavaScript object property naming

**iOS/Swift**:
- Verify Swift naming conventions for design tokens
- Check Apple HIG token naming patterns

### 3. Define Semantic Token Naming Strategy

**Decision Points**:
- Use dot notation or flatten to single identifier?
- How to handle multi-level semantic names (`color.text.default`)?
- Should semantic tokens follow same convention as primitives?
- How to preserve semantic structure across platforms?

### 4. Update Documentation

Once conventions are decided:
- Update design document with correct examples
- Add platform naming section to token specifications
- Document dot notation handling rules
- Create migration guide if conventions change

### 5. Fix Tests

After conventions are clarified:
- Update integration tests to match actual conventions
- Add tests for dot notation conversion
- Verify cross-platform consistency tests

---

## Related Issues

### Web Output Structure Issue (Bug #1)

The web output shows primitives appearing AFTER the semantic section starts:
- Primitive section marker at position: 466
- Semantic section marker at position: 15120
- `space100` token at position: 14416

This suggests the semantic section is being inserted before all primitives are generated, which is a separate file generation order issue.

### Missing Semantic Tokens (Category A Bugs)

The `color.primary` and related color semantic tokens are missing from iOS and Android output. This is likely related to the shadow/glow token filter being too aggressive, but may also be affected by naming convention issues.

---

## Next Steps

1. **Clarify Intent**: Determine if design document or implementation represents the intended behavior
2. **Research Standards**: Investigate platform-specific naming best practices
3. **Make Decision**: Choose consistent naming convention strategy across platforms
4. **Update Documentation**: Align design document with chosen conventions
5. **Fix Implementation**: Update code to match conventions (if needed)
6. **Fix Tests**: Update tests to expect correct naming patterns
7. **Document Rules**: Add comprehensive naming convention documentation

---

## Files Requiring Updates

### If Implementation is Correct (snake_case for Android)
- `.kiro/specs/semantic-token-generation/design.md` - Update Android examples
- `src/__tests__/integration/SemanticTokenGeneration.test.ts` - Fix test expectations
- `token-specifications-v3.md` - Add platform naming section

### If Design is Correct (camelCase for Android)
- `src/naming/PlatformNamingRules.ts` - Change Android to camelCase
- `src/providers/AndroidFormatGenerator.ts` - Verify naming conversion
- Regenerate all Android token files

### Regardless of Decision
- Document dot notation handling strategy
- Add semantic token naming rules
- Create cross-platform naming consistency guide

---

*This document captures the platform naming convention discrepancy discovered during integration testing and outlines the investigation needed to resolve it.*


---

## Resolution

**Date**: October 27, 2025
**Resolution Type**: Design Correction + Implementation Fix + Test Rewrite
**Status**: In Progress

### Investigation Findings

After thorough investigation, we determined that:

1. **The discrepancy is REAL** - but it's a documentation problem, not an implementation problem
2. **Implementation is correct** - `PlatformNamingRules.ts` correctly specifies `snake_case` for Android
3. **Design document was wrong** - Android examples showed `camelCase` instead of `snake_case`
4. **Tests were wrong** - Written based on incorrect design document examples

### Root Cause Analysis

**The Chain of Misinterpretation:**

1. **Design Document Error**: Android code examples in `design.md` showed `camelCase` (e.g., `colorPrimary`, `fontSize100`)
2. **AI Agent Misinterpretation**: During implementation, the AI agent:
   - Looked at design document examples instead of `PlatformNamingRules.ts`
   - Implemented semantic token naming to match the (incorrect) examples
   - Wrote tests expecting the same incorrect naming
3. **Bug Propagation**: The error propagated through:
   - Android formatter implementation (removed dots before calling platform naming rules)
   - iOS formatter implementation (same issue)
   - Integration test expectations (expected wrong naming conventions)

**The Actual Bug:**

Android and iOS formatters were removing dots from semantic token names BEFORE calling `getPlatformTokenName()`, which prevented the platform naming rules from properly converting the names:

```typescript
// WRONG - removes dots first
const nameWithoutDots = semantic.name.replace(/\./g, '');
const semanticName = this.getTokenName(nameWithoutDots, semantic.category);

// CORRECT - let getPlatformTokenName handle dots
const semanticName = this.getTokenName(semantic.name, semantic.category);
```

### Resolution Actions

**Phase 1: Update Design Document** ✅ COMPLETE

Added comprehensive "Platform Naming Conventions" section to `design.md`:
- Clear table showing naming conventions for each platform
- Explicit reference to `PlatformNamingRules.ts` as source of truth
- Corrected all Android examples to use `snake_case`
- Documented dot notation handling for each platform

**Phase 2: Fix Implementation Bugs** ✅ COMPLETE

Fixed semantic token naming in platform formatters:
- **AndroidFormatGenerator.ts**: Removed dot-stripping code, let `getPlatformTokenName()` handle conversion
- **iOSFormatGenerator.ts**: Same fix
- **WebFormatGenerator.ts**: Already correct (was not stripping dots)

**Phase 3: Fix Integration Tests** 🔄 IN PROGRESS

Added task 6.6 to `tasks.md`:
- Rewrite integration tests based on corrected design document
- Use `getPlatformTokenName()` for cross-platform assertions
- Verify correct naming for all platforms (web: kebab-case, iOS: camelCase, Android: snake_case)

### Lessons Learned

**For AI-Human Collaboration:**

1. **Design Examples Must Match Implementation Rules**: Code examples in design documents must be verified against actual implementation rules (like `PlatformNamingRules.ts`)

2. **Single Source of Truth**: Platform conventions should be documented in ONE place and referenced everywhere, not duplicated in examples

3. **Cross-Reference Validation**: AI agents need explicit guidance to verify consistency between design examples and implementation rules

4. **Spec-First Development Prevents Errors**: This issue validates the importance of correcting specifications before fixing implementation

**For Future Spec Creation:**

1. **Validate Examples Against Implementation**: Before finalizing design documents, verify all code examples match actual implementation rules

2. **Reference Implementation Rules**: Design documents should explicitly reference implementation files as source of truth

3. **Test Against Specification**: Tests should be written to match the specification, with the specification verified against implementation rules

### Impact on Dependent Work

**Unblocks**: `afternoon-to-dusk-rename` spec
- Once task 6.6 is complete and tests pass, the rename spec can proceed
- The rename spec was blocked waiting for semantic token generation to be stable

**Validates**: Rosetta Stone vision
- This case study demonstrates exactly the kind of AI misinterpretation that mathematical precision and unambiguous specifications prevent
- Provides concrete example for future case study documentation

### Next Steps

1. Complete task 6.6 (fix integration tests)
2. Verify all tests pass with corrected naming conventions
3. Create case study document in `docs/case-studies/` (Step 3 of original plan)
4. Resume `afternoon-to-dusk-rename` spec

---

*This resolution documents the complete investigation, root cause analysis, and remediation of the platform naming convention discrepancy discovered during semantic token generation implementation.*
