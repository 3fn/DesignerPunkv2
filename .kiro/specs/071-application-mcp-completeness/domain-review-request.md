# Spec 071 — Domain Review Request

**Date**: 2026-03-08
**Spec**: 071 - Application MCP Completeness
**Status**: Awaiting domain review before execution
**Requested by**: Thurgood (spec formalization)
**Approved by**: Peter (scope and direction)

---

## Context

Spec 071 has been formalized (requirements.md, design.md, tasks.md) and is ready for domain review before execution begins. The spec completes family guidance YAML coverage for all 8 production families, enriches the YAML schema with new optional sections, and expands Icon-Base from 15 to ~50 icons.

**Spec documents to review:**
- `.kiro/specs/071-application-mcp-completeness/requirements.md`
- `.kiro/specs/071-application-mcp-completeness/design.md`
- `.kiro/specs/071-application-mcp-completeness/tasks.md`

---

## Ada — Token & Governance Review

### Review Areas

1. **Schema additions and token governance interaction**
   - Three new optional YAML sections: `discouragedPatterns`, `platformVariants`, `composesWithFamilies`
   - Do these interact with token governance in ways not addressed?
   - Does the `discouragedPatterns` advisory model (overridable with human confirmation) align with existing token governance escalation levels?

2. **Icon architecture decision**
   - We decided against semantic icon components (Icon-Status, Icon-Action, Icon-Navigation) in favor of platform-variant conventions in the Icon family YAML
   - This applies the primitive/semantic model to icon *naming* (via YAML guidance) rather than icon *components*
   - Does this decision have implications for the Rosetta token architecture?

3. **D9 compliance for enriched schema**
   - 5 new YAML files will need D9 compliance validation
   - The existing schema fields (selectionRules, patterns, etc.) have a proven D9 process
   - Do the new fields (discouragedPatterns, platformVariants, composesWithFamilies) need additional D9 validation rules, or does the existing process cover them?

4. **Token references in family guidance**
   - Family YAMLs will cross-reference token families and docs MCP resources
   - Are there specific token reference formats or conventions Ada wants enforced?

### Feedback Format

Please add your feedback below each review area, or add a new section for concerns not listed above.

**Ada's feedback:**

### 1. Schema Additions and Token Governance Interaction

The three new YAML sections don't conflict with token governance. `discouragedPatterns` with `severity: advisory` and human override maps cleanly to our existing governance escalation model (semantic = free, component = checkpoint, discouraged = advisory override). `platformVariants` and `composesWithFamilies` are informational/referential — no governance interaction.

**Concern**: The `discouragedPatterns` schema has `severity: advisory | caution` but the behavioral distinction between these two levels isn't defined in the requirements or design doc. If both mean "flag it" with slightly different emphasis, that's a gradient without clear behavioral difference for a consuming agent. **Recommendation**: Either define the behavioral distinction clearly (what does an agent do differently for `caution` vs `advisory`?) or collapse to a single severity level.

### 2. Icon Architecture Decision — No Rosetta Implications

No concerns. Icons are assets, not tokens. The YAML platform-variant approach keeps icon resolution in the guidance layer where it belongs, not in the token pipeline. Agree with the industry analysis — one icon component with assets as data is the consensus pattern.

### 3. D9 Compliance for Enriched Schema

The new fields have real validation needs:
- `discouragedPatterns`: If component names appear in `pattern` or `rationale` text, D9 should verify they exist. Light validation, not blocking.
- `platformVariants`: The `resolution` values reference icon names — D9 should verify these exist in `IconBaseName`. A typo here silently serves wrong guidance.
- `composesWithFamilies`: The `companion` field references a file path — D9 should verify the file exists (same pattern as existing `companion` validation).

**However**: Adding D9 rules before authoring a single YAML with these fields is premature. **Recommendation**: Author Chips first (Task 1), then decide which D9 rules to add based on what actually goes wrong or feels fragile. Process-first, automation second.

### 4. Token Reference Formats in Family Guidance

Recommended convention:
- Reference docs MCP paths, not steering file paths: `tokenRef: "Token-Family-Spacing.md"`
- Don't embed token values in YAML (they drift). Reference token names: `"Uses space.grouped.tight for chip gap"` not `"Uses 4px gap"`
- For token families spanning multiple docs, reference the specific doc: `"See Token-Family-Color.md for interactive state tokens"`

Consistent with Requirement 7's "point to it, not reproduce it" principle.

### Broader Observations

- **Spec is well-scoped.** Deferring Gaps 2-4 is the right call — ship family guidance coverage first, let real product agent usage reveal what's actually needed.
- **Vertical-first authoring is smart.** The gate at Task 1.4 is the right checkpoint.
- **Progress component name mismatch**: The design outline (Gap 1) references "Progress-Bar-Base, Progress-Circle-Base, Progress-Step-Base" but the requirements doc lists the correct names: "Progress-Pagination-Base, Progress-Stepper-Base, Progress-Stepper-Detailed, Progress-Indicator-Node-Base, Progress-Indicator-Connector-Base, Progress-Indicator-Label-Base." Reconcile before Task 2 starts.
- **D2/D3 (Token tool)**: Correctly deferred. When Gap 2 is tackled, I'd want to understand what a product agent actually asks about tokens before designing the tool. Future spec conversation, not a 071 concern.

---

## Lina — Component & Implementation Review

### Review Areas

1. **Component accuracy across 5 families**
   - Chips: Chip-Base, Chip-Filter, Chip-Input — correct members? Missing variants?
   - Icons: Icon-Base only — correct? Are the planned semantic variants (Icon-Status, Icon-Action, Icon-Navigation) officially scrapped or just deferred?
   - Avatars: Avatar-Base only — is Avatar-Group a thing or planned?
   - Progress: 6 components (Pagination-Base, Stepper-Base, Stepper-Detailed, Indicator-Node-Base, Indicator-Connector-Base, Indicator-Label-Base) — correct and complete?
   - Badges: Badge-Count-Base, Badge-Count-Notification, Badge-Label-Base — correct members?

2. **Icon asset expansion**
   - ~35 new Feather icons proposed (27 for WrKing Class + 5 platform variants + 3 utility)
   - Full list in design.md — any icons to add or remove?
   - Platform-specific format concerns for iOS asset catalog or Android vector drawables?
   - SVG format requirements (stroke attributes, viewBox) for consistency with existing 15 icons?

3. **Progress family composition guidance**
   - The YAML will cover "when to use Node/Connector/Label directly vs through parent orchestrator"
   - Lina built the render-all-dots architecture and knows the composition model best
   - Any specific guidance or anti-patterns to capture for Progress composition?

4. **Platform-variant conventions**
   - The `platformVariants` YAML pattern will document icons that differ by platform (share, back, overflow)
   - Are there component-level platform divergences beyond icons that should be captured in family guidance? (e.g., Progress render-all-dots on web vs native scroll on iOS/Android)

5. **Task 4 (Icon expansion) — implementation concerns**
   - Tasks 4.1–4.3 are Lina's domain (adding SVGs, updating asset catalogs, updating types)
   - Any concerns about the scope or approach?

### Feedback Format

Please add your feedback below each review area, or add a new section for concerns not listed above.

**Lina's feedback:**

### 1. Component Accuracy

**Chips**: Chip-Base, Chip-Filter, Chip-Input — matches my understanding. One question: is Chip-Input actually implemented, or is it a placeholder? If placeholder, it should be excluded per Decision 4 (no guidance for unimplemented components).

**Icons**: Icon-Base only — correct. Agree with the decision against semantic icon variants. One component with assets as data is the industry consensus and the right call here.

**Avatars**: Requirements list "Avatar-Base" only, but the design outline references "Avatar-Base, Avatar-Group." Need to clarify whether Avatar-Group exists as a separate component or is a composition pattern. If it's a separate component, it needs to be in the requirements list. If it's a pattern, it belongs in the YAML's `patterns` section.

**Progress**: The 6 components in requirements are correct and complete. Agree with Ada — the design outline references old names (Progress-Bar-Base, Progress-Circle-Base, Progress-Step-Base) that don't exist. Must be reconciled before Task 2.

**Badges**: Correct members.

### 2. Icon Asset Expansion

The ~35 icon list is reasonable. Notes:

- **Missing pairs**: `chevron-left` is listed but `chevron-right` isn't. If adding navigation chevrons, we need both. Same for `chevron-up` if `chevron-down` is included.
- **Platform variants**: The set (share, share-2, more-horizontal, more-vertical, chevron-down) is a good start. Consider adding `arrow-left`/`arrow-right` — iOS uses chevron-style back navigation, Android historically uses arrow-style (though converging).
- **SVG consistency**: The existing 15 icons should be audited for format consistency (stroke-width, viewBox, fill vs stroke) before adding 35 new ones. If the existing set isn't consistent, we'll compound the problem.
- **Scope control**: "~35 icons" can easily become 50+ once WrKing Class screens are audited. Recommend a hard icon list approved by Peter before starting Task 4, not a fuzzy estimate.
- **Platform asset pipelines**: iOS asset catalogs and Android vector drawables have different authoring workflows than dropping SVGs in a folder. Tasks 4.1–4.3 are a bit hand-wavy on this. I'd want to verify the existing platform asset pipeline before estimating effort.

### 3. Progress Family Composition Guidance

This is where I can contribute the most. Key points for the Progress YAML:

**Selection rules:**
- Pagination-Base: step count is dynamic or large (>5), user doesn't need to see all steps simultaneously
- Stepper-Base: step count is fixed and small (≤5), user needs to see all steps
- Stepper-Detailed: same as Stepper-Base but steps have descriptions/metadata

**Discouraged patterns:**
- Don't use Node-Base, Connector-Base, or Label-Base directly in product code — they're internal composition children of the orchestrators (Pagination-Base, Stepper-Base). The orchestrators manage state, animation, and accessibility. Using children directly bypasses all of that.
- Don't use Pagination-Base for fewer than 3 steps — it's a scrolling viewport, which is meaningless with 2 dots.

**Platform divergence (informational, not selection-relevant):**
- Web: all dots in flex track, translateX centering
- iOS: ScrollViewReader + scrollTo(anchor: .center)
- Android: LazyRow + animateScrollToItem()
- Same visual result, native mechanism per platform. Good True Native example but belongs in README/contracts, not family guidance (see #4 below).

### 4. Platform-Variant Conventions Beyond Icons

**Recommendation: keep `platformVariants` scoped to assets (icons), not components.**

Component platform divergence (Progress render-all-dots vs native scroll) is implementation detail, not selection guidance. A product agent doesn't need to know *how* Pagination-Base centers the active dot — it needs to know *when* to use Pagination-Base. Platform implementation details belong in the component README and contracts, where they already live.

The `platformVariants` pattern should stay scoped to cases where the product agent makes a platform-specific choice (which icon name to use). For components, the agent picks the component and the platform implementation handles the rest transparently.

### 5. Task 4 Implementation Concerns

1. **Scope creep**: Hard icon list needed before starting. See #2 above.
2. **Asset validation**: The task says "existing tests continue passing" but doesn't mention validating new icons. Every name in the expanded `IconBaseName` type should have a corresponding asset on every platform. If no existing test covers this, we should add one (or at minimum a build-time check).

### Additional Observations

**Severity levels**: Agree with Ada — collapse `discouragedPatterns` severity from `advisory | caution` to a single level. The consuming agent either surfaces the pattern or doesn't. A gradient between "maybe don't" and "really maybe don't" isn't a meaningful behavioral distinction for an agent. If something is truly dangerous, it should be a contract violation, not a YAML advisory.

**component-meta.yaml consistency**: The spec doesn't mention verifying that individual `component-meta.yaml` files (per the authoring guide) are consistent with the new family-level guidance YAMLs. Both contain "when to use / when not to use" — two sources that could drift. This doesn't need a separate task, but each family task should include a verification step confirming component-meta files align with the family YAML. Otherwise we ship two conflicting guidance layers.

---

## Cross-Domain Notes

- The authoring method for family YAMLs is structured extraction from steering docs, with interview fallback if documentation is insufficient. Ada or Lina may request an interview with Peter if they encounter gaps during their respective contributions.
- Task 1 (Chips, reference family) includes a schema review gate (Task 1.4) where Peter approves the enriched schema before replication. Ada and Lina's feedback here will inform that gate.
- Semantic icon components (Icon-Status, Icon-Action, Icon-Navigation) were discussed and set aside in favor of platform-variant YAML guidance. If either Ada or Lina has a strong counter-argument, this is the time to raise it.
