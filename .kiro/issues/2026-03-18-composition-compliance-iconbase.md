# Composition Compliance: Components Using Raw Icons Instead of IconBase

**Date**: 2026-03-18
**Discovered by**: Peter (review of Nav-TabBar-Base implementation)
**Domain**: Thurgood (test governance), Lina (component implementation)
**Severity**: Medium
**Status**: Resolved (2026-03-26)

---

## Issue

Components that list `Icon-Base` in their `composition.internal` schema field are not consistently composing through the `IconBase` component on native platforms. Instead, they use raw platform primitives (`Image(systemName:)` on iOS, `Icon(painter:)` on Android) which bypasses the design system's icon rendering pipeline (token-based sizing, optical balance, decorative accessibility).

The web platform doesn't have this problem because `<icon-base>` is a custom element — there's no "quick path" alternative.

## Root Cause

Native UI frameworks provide first-class icon primitives that work without importing the design system component. When implementing under time pressure or pattern-matching from references that have the same gap, it's easy to reach for the framework primitive instead of the Stemma composition.

## Affected Components

### Confirmed Fixed
- `Nav-TabBar-Base` — iOS and Android fixed (2026-03-18, Spec 050)

### Confirmed Affected
- `Nav-SegmentedChoice-Base` — iOS uses `Image(systemName:)`, Android uses `Icon(` (Spec 049)

### Needs Audit
All components with `Icon-Base` in `composition.internal` should be audited. Many already use `IconBase(` correctly (Button-Icon, Button-CTA, Chip-Base, etc.) but a systematic check would confirm.

## Proposed Solution: Composition Compliance Test

Add a static source analysis test (Thurgood's domain) that:

1. Reads each component's `schema.yaml` for `composition.internal` entries
2. For each composed child component, verifies the platform source files contain the expected composition call:
   - `Icon-Base` → iOS: `IconBase(`, Android: `IconBase(`, Web: `icon-base` or `<icon-base`
   - Pattern generalizes to other composed components
3. Fails with a clear message: "ComponentX lists Icon-Base in composition.internal but platforms/ios/ComponentX.ios.swift does not contain IconBase("

This catches the issue mechanically rather than relying on developer memory.

## Interim Fix

Nav-SegmentedChoice-Base iOS and Android implementations should be updated to use `IconBase(` — tracked in this issue.

---

## Audit Findings (Thurgood, 2026-03-25)

### Nav-SegmentedChoice-Base — Already Fixed

The issue lists this as "confirmed affected," but both platform implementations now use `IconBase(`:
- iOS (line 255): `IconBase(`
- Android (line 377): `IconBase(`
- Web: uses `<icon-base>` custom element (was never affected)

Likely fixed during Spec 049 or Spec 050 work. Reclassifying as resolved.

### Composition.internal Scope Question — @LINA

Only `Nav-TabBar-Base` formally declares `Icon-Base` in `composition.internal`. But several other components reference Icon-Base in their schema descriptions/props without declaring it as a formal composition:

- Badge-Label-Base
- Button-Icon
- Button-VerticalList-Item
- Chip-Base
- Chip-Filter
- Chip-Input

**Question**: Is `composition.internal` meant to be the exhaustive list of composed children? Or is it acceptable for components to use Icon-Base without declaring it there?

This determines the scope of the proposed compliance test:
- If `composition.internal` is exhaustive → those 6 components have a schema gap (missing declaration)
- If `composition.internal` is selective → the test only covers components that explicitly declare it, and the 6 above are fine as-is

Need your guidance before writing the test.

### Updated Status

| Component | Status |
|-----------|--------|
| Nav-TabBar-Base | ✅ Fixed (confirmed in issue) |
| Nav-SegmentedChoice-Base | ✅ Fixed (confirmed by audit) |
| Compliance test | ⏳ Blocked on composition.internal scope clarification from Lina |

---

## Full Audit Findings (Lina, 2026-03-25)

### Scope Clarification: composition.internal Is Exhaustive

Per the Component-Schema-Format spec, `composition.internal` declares what a component uses internally. The Application MCP walks this field to assemble `resolvedTokens.composed` — tokens from composed children merged into the parent's resolved token set. If a component renders `IconBase(` but doesn't declare `Icon-Base` in `composition.internal`, the MCP's assembled metadata is incomplete.

Composition is NOT inherited. Even if a parent declares `Icon-Base` in `composition.internal`, child components that inherit via `inherits:` and render their own `IconBase(` calls must declare it independently.

**Answer to Thurgood's question**: `composition.internal` is meant to be exhaustive. The 6 components listed have a schema gap.

### Expanded Scope: 11 Components Affected

The original 6 plus 5 additional components found via web platform `icon-base` usage, then confirmed on native platforms.

| Component | iOS | Android | Web | Schema Gap? |
|-----------|-----|---------|-----|-------------|
| Badge-Label-Base | `IconBase(` ✅ | `IconBase(` ✅ | `<icon-base>` ✅ | Missing `composition.internal` |
| Button-Icon | `IconBase(` ✅ | `IconBase(` ✅ | `<icon-base>` ✅ | Missing `composition.internal` |
| Button-VerticalList-Item | `IconBase(` ✅ | `IconBase(` ✅ | `<icon-base>` ✅ | Missing `composition.internal` |
| Chip-Base | `IconBase(` ✅ | `IconBase(` ✅ | `<icon-base>` ✅ | Missing `composition.internal` |
| Chip-Filter (inherits Chip-Base) | `IconBase(` ✅ | `IconBase(` ✅ | `<icon-base>` ✅ | Missing `composition.internal` |
| Chip-Input (inherits Chip-Base) | `IconBase(` ✅ | `IconBase(` ✅ | `<icon-base>` ✅ | Missing `composition.internal` |
| Avatar-Base | `IconBase(` ✅ | `IconBase(` ✅ | `<icon-base>` ✅ | Missing `composition.internal` |
| Input-Checkbox-Base | `IconBase(` ✅ | `IconBase(` ✅ | `<icon-base>` ✅ | Missing `composition.internal` |
| Progress-Indicator-Node-Base | `IconBase(` ✅ | `IconBase(` ✅ | `<icon-base>` ✅ | Missing `composition.internal` |
| Button-CTA | `Icon(` alias ⚠️ | `Icon(` alias ⚠️ | `<icon-base>` ✅ | Missing `composition.internal` + legacy alias |
| Input-Text-Base | `Icon(` alias ⚠️ | `Icon(` alias ⚠️ | `<icon-base>` ✅ | Missing `composition.internal` + legacy alias |

### Legacy Alias Discovery

Button-CTA and Input-Text-Base use `Icon(` instead of `IconBase(` on native platforms. These are NOT raw platform primitives — they resolve through legacy aliases defined in Icon-Base itself:

- **iOS**: `typealias Icon = IconBase` (IconBase.ios.swift, line 299)
- **Android**: `fun Icon(...) = IconBase(...)` (IconBase.android.kt, line 244)

Functionally compliant (calls route through IconBase), but inconsistent with the rest of the codebase and complicates the compliance test pattern matching.

### Inheritance Check

Only two inheritance relationships among the 11:
- Chip-Filter `inherits: Chip-Base`
- Chip-Input `inherits: Chip-Base`

Both render their own `IconBase(` calls (Chip-Filter: checkmark/leading icon; Chip-Input: leading icon + trailing X). No double-counting risk from adding `composition.internal` to all three independently.

All other 9 components have no `inherits:` field.

### Three Distinct Issues

1. **Schema gap (all 11)**: Add `Icon-Base` to `composition.internal` so the Application MCP resolves composed tokens correctly.

2. **Legacy alias migration (Button-CTA, Input-Text-Base)**: Migrate `Icon(` → `IconBase(` on iOS and Android for codebase consistency. The alias is a direct pass-through, so this is a safe rename (4 platform files total).

3. **Legacy alias deprecation (Icon-Base)**: The `typealias Icon = IconBase` (iOS) and `fun Icon(...) = IconBase(...)` (Android) in Icon-Base's platform files should be deprecated/removed once no consumers remain.

### Recommendation

Lina's assessment is that this doesn't warrant a full spec — the scope is well-defined, the audit is complete, and the fixes are mechanical. However, Peter wants Thurgood's input on whether the compliance test + fixes should be formalized as a spec or handled as a direct task from this issue.

### @THURGOOD — Input Requested

1. Does the compliance test need spec-level formalization, or can you write it directly from this issue?
2. For the test pattern: should it match both `IconBase(` and `Icon(` (accommodating the legacy alias), or should we migrate Button-CTA and Input-Text-Base first so the test only needs to match `IconBase(`?
3. Any concerns about the schema changes affecting existing test infrastructure?

### Updated Status

| Item | Status |
|------|--------|
| Nav-TabBar-Base | ✅ Fixed |
| Nav-SegmentedChoice-Base | ✅ Fixed (confirmed by Thurgood) |
| composition.internal scope | ✅ Clarified — exhaustive (Lina) |
| Full audit | ✅ Complete — 11 components identified (Lina) |
| Schema fixes (11 components) | ✅ Complete (Lina, 2026-03-25) |
| Legacy alias migration — native (2 components, 4 files) | ✅ Complete (Lina, 2026-03-25) |
| Legacy alias migration — web (1 component, 1 file) | ✅ Complete (Lina, 2026-03-25) |
| Test suite validation | ✅ 306 suites, 7965 tests, 0 failures (pre-compliance-test) |
| Composition compliance test | ✅ Created (Thurgood, 2026-03-25) — 58/61 passing |
| Container-Card-Base mismatch | ↗️ Separated — `.kiro/issues/2026-03-25-container-card-base-composition-mismatch.md` |
| Legacy alias deprecation (Icon-Base) | ⏳ Thurgood — step 5 (native + web aliases, zero remaining consumers) |

---

## Execution Log (Lina, 2026-03-25)

### Step 1: Legacy Alias Migration ✅

Migrated `Icon(` → `IconBase(` in 4 platform files:
- `Button-CTA/platforms/ios/ButtonCTA.ios.swift` — 1 call site
- `Button-CTA/platforms/android/ButtonCTA.android.kt` — 1 call site
- `Input-Text-Base/platforms/ios/InputTextBase.ios.swift` — 3 call sites (error, success, info icons)
- `Input-Text-Base/platforms/android/InputTextBase.android.kt` — 3 call sites (error, success, info icons)

Post-migration codebase grep confirmed zero remaining `Icon(` alias consumers outside Icon-Base itself. Only the alias definitions remain:
- `IconBase.ios.swift` line 299: `typealias Icon = IconBase`
- `IconBase.android.kt` line 244: `fun Icon(...) = IconBase(...)`

**Additional finding**: `Progress-Indicator-Node-Base` (Android) and `Input-Text-Password` (Android) use `Icon(` with `imageVector = Icons.Filled.*` parameters — this is the **Jetpack Compose Material `Icon` composable**, not the DesignerPunk legacy alias. Different signature, different concern. Not in scope for this issue.

### Step 2: Schema Fixes ✅

Added `composition.internal` with `Icon-Base` to all 11 component schemas:

| Component | Role | Required |
|-----------|------|----------|
| Avatar-Base | Fallback icon when no image or initials available | false |
| Badge-Label-Base | Optional leading icon for label badge | false |
| Button-CTA | Optional leading icon | false |
| Button-Icon | Button icon display | true |
| Button-VerticalList-Item | Optional leading icon | false |
| Chip-Base | Optional leading icon | false |
| Chip-Filter | Optional leading icon and selected-state checkmark | false |
| Chip-Input | Optional leading icon and trailing dismiss (X) icon | false |
| Input-Checkbox-Base | Checkmark and indeterminate state indicator | true |
| Input-Text-Base | Trailing contextual icon (error, success, info) | false |
| Progress-Indicator-Node-Base | Checkmark and custom icon content for completed/active states | false |

### Step 3: Test Suite Validation ✅

Full test suite passed with zero failures: 306 suites, 7965 tests.

### Steps 4–5: @THURGOOD

Ready for you:
- **Step 4**: Composition compliance test — `composition.internal` is now the reliable source of truth across all 11 + Nav-TabBar-Base (12 total). Match `IconBase(` on native, `icon-base` on web.
- **Step 5**: Remove legacy aliases from Icon-Base. Codebase grep confirmed zero remaining consumers. Safe to remove.

### Thurgood Response (2026-03-25)

**1. Spec vs direct task**: Direct task from this issue. The audit is complete, scope is defined, fixes are mechanical. No spec needed.

**2. Test pattern**: Migrate first, then test. The compliance test should match one clean pattern per platform — `IconBase(` on native, `icon-base` on web. No legacy alias accommodation in the test.

**Execution order**:
1. Lina: Migrate `Icon(` → `IconBase(` in Button-CTA and Input-Text-Base (4 platform files)
2. Lina: Add `Icon-Base` to `composition.internal` in all 11 schemas
3. Run full test suite — schema changes may affect MCP-based tests that assert on composed token counts
4. Thurgood: Write composition compliance test
5. Lina: Deprecate/remove `typealias Icon = IconBase` (iOS) and `fun Icon(...) = IconBase(...)` (Android) from Icon-Base

**3. Test infrastructure risk**: Adding `composition.internal` entries changes Application MCP `resolvedTokens.composed` output. Existing tests asserting on composed token sets for these 11 components may need updating. Run `npm test` after step 2 before proceeding.

### @THURGOOD — Note from Lina on Step 5

Before removing the legacy aliases from Icon-Base (`typealias Icon = IconBase` on iOS, `fun Icon(...) = IconBase(...)` on Android), we need a full codebase grep for any remaining `Icon(` calls that aren't `IconBase(`. The audit only covered the 11 components with schema gaps — test files, examples, or other references outside those components could still depend on the aliases. A stale alias removal would cause compile failures on native platforms. Recommend grepping after step 1 migration is complete and before step 5 begins.

### Step 4: Composition Compliance Test (Thurgood, 2026-03-25)

**Test created**: `src/__tests__/stemma-system/composition-compliance-validation.test.ts`

**Results**: 57 passed, 4 failed (61 total checks)

**Passing**: All Icon-Base composition checks pass for the 12 components (36 platform checks) except the two findings below.

**Finding 1 — Input-Text-Base web legacy alias**:
`Input-Text-Base/platforms/web/InputTextBase.web.ts` uses `createIcon(` (legacy alias) instead of `createIconBase(`. Lina's step 1 migration caught the native platforms but missed this web-side alias. Same class of issue, one more file to fix.

**Finding 2 — Container-Card-Base composition gap**:
`Container-Card-Base` declares `Container-Base` in `composition.internal` but all three platform files only reference `ContainerBase` in comments — no actual composition call. Either:
- (a) The `composition.internal` declaration is incorrect and should be removed, or
- (b) The platform implementations should actually compose through `ContainerBase(` / `<container-base>`

Both findings are Lina's domain. The test is correct — it's catching real issues.

**@LINA**: Two items for you:
1. Migrate `createIcon(` → `createIconBase(` in `Input-Text-Base/platforms/web/InputTextBase.web.ts` (3 call sites)
2. Clarify Container-Card-Base: is the `composition.internal` declaration for Container-Base correct? If yes, the platform implementations need actual composition calls. If no, remove the declaration from the schema.

### Lina Response to Step 4 Findings (2026-03-25)

**Finding 1 — Fixed**: Migrated `createIcon(` → `createIconBase(` in `Input-Text-Base/platforms/web/InputTextBase.web.ts` (import + 3 call sites). Also confirmed zero remaining `createIcon` alias consumers in the codebase. The web-side legacy alias `export { createIconBase as createIcon }` in Icon-Base's web file is now safe to remove alongside the native aliases in step 5.

**Finding 2 — Separated**: Container-Card-Base is a different class of issue (architectural mismatch, not a legacy alias). Created separate issue: `.kiro/issues/2026-03-25-container-card-base-composition-mismatch.md`. The 3 failing compliance test checks for Container-Card-Base are expected failures tied to that issue.

**Test results after fix**: 58 passed, 3 failed (61 total). The 3 failures are all Container-Card-Base → Container-Base (iOS, Android, web) — tracked in the separate issue.

---

## Resolution (2026-03-26)

**Status**: Resolved

- Steps 1-4 complete: legacy alias migration, schema fixes, test suite validation, composition compliance test
- Step 5 (legacy alias removal from Icon-Base): pending — zero consumers remain, safe to remove when convenient
- Container-Card-Base composition mismatch separated and resolved via Spec 085
- Composition compliance test (`composition-compliance-validation.test.ts`): 61 checks, zero failures, zero skips

### Step 5: Legacy Alias Removal (Lina, 2026-03-26)

Removed all three legacy alias definitions:

1. ✅ `IconBase.ios.swift` — `typealias Icon = IconBase` removed
2. ✅ `IconBase.android.kt` — `fun Icon(...) = IconBase(...)` removed
3. ✅ `IconBase.web.ts` — `export { createIconBase as createIcon }` and `export { IconBase as Icon }` removed

Full test suite: 308 suites, 8041 tests, 0 failures.

**This issue is fully resolved.** All steps complete.
