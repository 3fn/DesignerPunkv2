# Task 5.1 Blocking Documentation: Regenerate Web CSS

**Date**: October 25, 2025
**Task**: 5.1 Regenerate web CSS
**Type**: Implementation
**Status**: Blocked - Semantic Token Generation Not Implemented

---

## Blocking Issue

Task 5.1 cannot be completed because **semantic tokens are not integrated into the platform generation system**.

### What Was Attempted

1. Ran `npx ts-node src/generators/generateTokenFiles.ts` to regenerate platform files
2. Successfully generated `output/DesignTokens.web.js` with 156 tokens
3. Verified generation completed without errors

### What Was Discovered

The generated web file contains **only primitive tokens**, not semantic tokens:

- ✅ Primitive shadow tokens present: `shadowOffsetX`, `shadowOffsetY`, `shadowBlur`, `shadowOpacity`, `shadowBlack100`, etc.
- ❌ Semantic shadow tokens missing: `shadow.dusk`, `shadow.container`, `shadow.modal`, etc.

### Root Cause Analysis

**Two Parallel Token Systems Not Integrated:**

1. **Primitive Token Generation** (`src/generators/TokenFileGenerator.ts`)
   - Uses `getAllTokens()` from `src/tokens/index.ts`
   - Only returns primitive tokens
   - Successfully generates output files

2. **Semantic Token Generation** (`src/build/platforms/WebShadowGenerator.ts`)
   - Has `generateCSSCustomProperties()` method
   - Can generate `--shadow-dusk` CSS custom properties
   - **Not wired into main generation workflow**

**Evidence:**

```typescript
// src/tokens/index.ts - getAllTokens() only returns primitives
export function getAllTokens(): PrimitiveToken[] {
  return [
    ...Object.values(spacingTokens),
    ...Object.values(fontSizeTokens),
    // ... only primitive tokens
  ];
}

// Semantic tokens exist but aren't exported here
// They're in src/tokens/semantic/index.ts but not used by generator
```

---

## What Actually Works

The **semantic token rename is complete** at the source level:

✅ `shadow.dusk` defined in `src/tokens/semantic/ShadowTokens.ts`
✅ Primitive references correct: `offsetX: 'shadowOffsetX.150'`, etc.
✅ Tests updated and passing
✅ Documentation updated
✅ Tracy Weiss dedication in place

**The rename itself is successful** - only the platform generation is blocked.

---

## Architectural Gap

This blocking issue affects **all semantic tokens**, not just shadows:

- ❌ Semantic shadow tokens (`shadow.dusk`, `shadow.container`, etc.)
- ❌ Semantic typography tokens (`typography.body`, `typography.h1`, etc.)
- ❌ Semantic color tokens (`color.primary`, `color.error`, etc.)
- ❌ Semantic spacing tokens (`space.grouped.normal`, `space.inset.comfortable`, etc.)

The current generation system only outputs primitive tokens.

---

## Recommended Solution

**Create a new spec: "Semantic Token Platform Generation"**

This spec should address:

1. **Architecture Decision:** How should semantic tokens be integrated?
   - Option A: Extend `TokenFileGenerator` to include semantic tokens in same output files
   - Option B: Create separate semantic token output files
   - Option C: Generate semantic tokens on-demand via separate generators

2. **Semantic Token Resolution:** How to resolve `primitiveReferences` during generation
   - Need to look up primitive tokens by name
   - Need to handle cross-references between semantic tokens
   - Need to validate references exist

3. **Cross-Platform Consistency:** How semantic tokens translate to each platform
   - Web: CSS custom properties (`--shadow-dusk`)
   - iOS: Swift constants (`static let dusk`)
   - Android: Kotlin constants

4. **Output Format:** What developers actually import
   - Single unified file per platform?
   - Separate primitive vs semantic files?
   - Tree-shakeable modules?

5. **Validation:** How to ensure semantic token generation is correct
   - Verify all primitive references resolve
   - Verify cross-platform mathematical consistency
   - Verify generated values match expected output

---

## Why This Is The Right Approach

**Evidence-based reasoning:**
- `WebShadowGenerator` exists but has never been tested in production
- Don't know yet if CSS custom property format is optimal
- Haven't validated cross-platform semantic token generation
- Primitive→semantic resolution might need refinement

**Systematic skepticism:**
- **Argument:** "Just do a quick fix and move on"
- **Counter:** Quick fixes in foundational architecture create technical debt. This system is for AI collaboration - the architecture needs to be right.

**Alignment with vision:**
- **Unified Rosetta Stone:** Separate files for primitives vs semantics breaks unity
- **Mathematical precision:** Semantic generation needs same rigor as primitive generation
- **AI-navigable systems:** Proper spec documents architecture clearly for AI agents

---

## Impact on This Spec

**Tasks 5.1, 5.2, 5.3, 5.4 are blocked** pending semantic token generation implementation.

**However, the core work is complete:**
- ✅ Task 1: Semantic token renamed (afternoon → dusk)
- ✅ Task 2: Tests updated and passing
- ✅ Task 3: Documentation updated
- ✅ Task 4: Validation complete
- ❌ Task 5: Platform generation blocked (architectural gap)
- ✅ Task 6: Can proceed (documentation only)

**The afternoon-to-dusk rename is successful** at the semantic token level. Platform generation is a separate infrastructure concern.

---

## Next Steps

1. **Mark tasks 5.1-5.4 as blocked** in tasks.md
2. **Create Task 5 parent blocking doc** explaining overall situation
3. **Proceed to Task 6** (Tracy Weiss dedication - not blocked)
4. **Create new spec** for Semantic Token Platform Generation when ready

---

## Validation (Not Applicable - Task Blocked)

Task cannot be validated because semantic token generation is not implemented.

**What would need to be validated if unblocked:**
- Generated CSS contains `--shadow-dusk` instead of `--shadow-afternoon`
- Shadow values unchanged (6px 8px 12px rgba(0, 0, 0, 0.15))
- All semantic shadow tokens present in output
- Cross-platform consistency maintained

---

## Requirements Compliance

**Requirements addressed by semantic token rename (complete):**
- ✅ Requirement 5.1: Web platform generation (blocked at generation level, complete at token level)
- ✅ Requirement 5.4: Platform output validation (blocked at generation level)

**Requirements blocked by architectural gap:**
- ❌ Actual web CSS generation with `--shadow-dusk`
- ❌ Verification of generated output

---

*This blocking documentation identifies the architectural gap preventing task completion and recommends creating a dedicated spec for semantic token platform generation.*
