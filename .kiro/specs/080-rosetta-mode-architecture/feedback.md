# Spec Feedback: Rosetta Mode Architecture

**Spec**: 080-rosetta-mode-architecture
**Created**: 2026-03-16

---

## Design Outline Feedback

### Context for Reviewers

- Catalyst: Spec 050 (Nav-TabBar-Base) blocked on mode-differentiated semantic tokens → design-outline.md § "Problem Statement"
- Two-level resolver: mode-aware primitives (Level 1) + semantic overrides for role remapping (Level 2) → design-outline.md § "Architecture"
- System uses industry-standard `light`/`dark` naming internally; Figma uses "Day"/"Night" as variant labels (Figma convention, not system constraint) → design-outline.md § "Design Decisions Summary" #1
- Two phases: Phase 1 (mode-aware primitives + semantic override architecture), Phase 2 (wcagValue unification) → design-outline.md § "Phasing"
- Fallback behavior: absent dark values fall back to light (graceful degradation, not build failure) → design-outline.md § "Fallback Behavior"
- Hard constraint: theme overrides cannot introduce new tokens → design-outline.md § "Hard Constraints" (Decision #6)
- Component tokens excluded from theme overrides — inherit mode awareness through resolution chain → design-outline.md § "Component Token Resolution" (Decision #7)
- Theme template generation for drift prevention (CI-integrated) → design-outline.md § "Theme Template Generation" (Decision #8)
- Dimension governance: adding new modes/themes requires a spec → design-outline.md § "Design Decisions Summary" #12
- Industry research conducted: Carbon, Polaris, Atlassian, Material, W3C DTCG Resolver spec → design-outline.md § "Industry Research Summary"
- MCP updates required for both documentation and component servers → design-outline.md § "MCP and Documentation Impact"
- Peter's direction: full audit of all semantic color tokens, not Nav-TabBar-only subset. Thoroughness over speed. → conversation 2026-03-16

---

#### [THURGOOD R1]

**Overall Assessment**: This is a well-structured design outline for genuinely important architecture work. The problem statement is clear, the phasing is sound, the industry research provides confidence, and the DTCG Resolver alignment is forward-looking. Ada's domain expertise shows — the pipeline insertion point, the override-only pattern, and the Phase 2 unification vision are all architecturally clean.

My concerns are primarily about what happens after the architecture is built: the ongoing maintenance burden, the drift risk, and the test strategy needed to keep mode resolution trustworthy over time.

**Critical:**

- F1. **Override drift is the primary long-term risk.** The override-only pattern (Decision #2) is the right choice, but it creates a maintenance coupling: every new semantic color token must be evaluated for dark override needs. If someone adds a token to `ColorTokens.ts` and doesn't add the corresponding dark override, the token silently inherits the light value in dark mode. This is a class of bug that's invisible during development (you'd have to visually inspect dark mode to notice) and could ship to production undetected. → design-outline.md § "Architecture"
    - **Action**: The architecture must include a governance mechanism for this. Options: (a) mode parity test that flags semantic color tokens without dark overrides as "intentionally light-only" or "missing override," (b) a required `modePolicy` field on semantic tokens (`mode-invariant` | `mode-aware`), (c) a CI check that compares the token list against the override file. This should be a requirement, not an afterthought.
    - **Counter-argument**: Adding governance overhead to every token creation could slow down token development. If 80% of tokens are mode-invariant (spacing, typography, sizing), requiring explicit mode policy on all of them is busywork. The governance should target color tokens specifically, since those are the primary mode-differentiated category.

- F2. **Combinatorial growth needs explicit bounds.** The resolution matrix is currently 2×2 (light/dark × base/WCAG = 4 contexts). The outline says additional modes are out of scope but "architecture should support them." This is fine as a principle, but the spec should explicitly state the expected growth trajectory and the governance for adding new dimensions. Each new mode doubles the override surface. Each new theme doubles it again. Without bounds, the system could grow to 8, 16, 32 contexts — each requiring audit, override files, tests, and generator support. → design-outline.md § "Scope" / "Out of Scope"
    - **Action**: Add a section or decision documenting the expected resolution dimensions and a governance gate for adding new ones. Something like: "Adding a new mode or theme dimension requires a spec and Peter's approval — it's an architecture decision, not a token decision."
    - **Counter-argument**: This might be premature governance. We have two modes and two themes. Worrying about 32 contexts when we have 4 is borrowing trouble. Fair point — but the architecture decisions made now (override-only vs complete theme sets, file structure, resolver design) will either accommodate or resist growth. Better to think about it now than discover the architecture doesn't scale when someone wants high-contrast mode.

**Moderate:**

- F3. **Phase 2 scope is underspecified relative to Phase 1.** Phase 1 has concrete deliverables (theme files, resolver, generator updates, DTCG export, MCP updates, proof case). Phase 2 is described at a higher level ("migrate wcagValue," "collapse into single resolver," "update all generators, tests, and documentation"). During formalization, Phase 2 needs the same level of task decomposition as Phase 1. The wcagValue migration alone touches every semantic token that uses it, every generator that reads it, and every test that validates it. → design-outline.md § "Phasing"
    - **Action**: During tasks.md creation, Phase 2 should be broken into auditable subtasks with clear boundaries. Not a design outline concern per se, but flagging it now so it's not a surprise during formalization.

- F4. **The opacity composition interaction (OQ-3) is architecturally significant, not just a detail.** The example in the outline shows a dark override replacing a composite `primitiveReferences` (`{ color: 'gray100', opacity: 'opacity048' }`) with a simple one (`{ value: 'gray500' }`). This means the override can change the *shape* of the reference, not just the value. The resolver needs to handle this — it's not a simple key-value merge, it's a structural replacement. This has implications for validation (how do you validate an override that changes the reference shape?) and for generators (they need to handle both shapes in both modes). → design-outline.md § "Architecture" example
    - **Action**: The design.md should explicitly document the override merge semantics: does the override replace the entire `primitiveReferences` object, or can it patch individual keys? The example implies full replacement, which is simpler and safer. Make that explicit.

- F5. **Test strategy (OQ-6) — my recommendation.** Layered approach:
    1. **Resolver unit tests**: Base + override merging correctness. Override replaces, non-overridden passes through, empty override = base output, structural replacement (composite → simple) works. Infrastructure tests — my domain to audit.
    2. **Mode parity validation**: For each mode-aware semantic token, verify both light and dark resolve to valid primitive references. Catches "forgot the dark override" drift. Token governance tests — Ada's domain to write, mine to audit.
    3. **Generator integration tests**: Platform generators correctly consume resolved mode sets and produce correct output format per platform. Build system tests — shared domain.
    4. **Phase 2 regression snapshots**: Before wcagValue removal, snapshot all resolved values across the full mode × theme matrix. After migration, verify identical output. Critical for WCAG compliance — a silent regression here is a legal/accessibility risk.
    - **On test execution time**: If 50+ tokens each validate two modes, that's 100+ assertions in the token test suite. Not a doubling of test *time* (assertions are fast), but a doubling of test *surface*. Recommend mode parity as a dedicated fast validation pass rather than doubling every individual token test. This keeps the existing token tests focused on semantic correctness and adds a separate "are all modes covered?" check.

- F6. **Missing: rollback strategy.** The outline doesn't address what happens if the mode resolver introduces bugs in production. Since mode resolution sits between Registry and Generation in the pipeline, a broken resolver affects every generated token file across every platform. What's the rollback path? Can the pipeline bypass the resolver and fall back to pre-mode behavior? This matters especially during the Phase 1 rollout when the resolver is new and untested in production. → design-outline.md § "Architecture"
    - **Action**: Add a design decision or note about pipeline bypass / feature flag for the resolver step. Even if the answer is "we don't need one because we'll test thoroughly," that should be an explicit decision.
    - **Counter-argument**: The token pipeline runs at build time, not runtime. If the resolver produces bad output, you catch it in CI or during development. There's no "production rollback" — you just revert the commit. This might not need a formal rollback strategy beyond normal git practices. But the Phase 2 migration (removing wcagValue) is harder to revert — that's where rollback planning matters more.

**Minor:**

- F7. **feedback.md context entry was inaccurate.** Said "Day/night naming replaces light/dark throughout the system" — the opposite of Decision #1, which keeps `light`/`dark`. Corrected in this revision.

- F8. **OQ-2 (explicit light theme file) has a governance angle.** If "base = light" is implicit, there's no file to point to when someone asks "where are the light mode values?" The answer is "everywhere — they're the base." If the light theme file exists explicitly (even if it just re-exports base), it's self-documenting and gives the mode parity tests a consistent structure to validate against. I'd lean toward explicit, but it's a minor preference.

- F9. **Nav-TabBar-Base as proof case is good but limited.** Nav-TabBar-Base has a specific pattern (cyan accent inversion, gradient composition) that exercises the resolver well. But it doesn't exercise the wcagValue interaction (Phase 2) or the opacity composition pattern (OQ-3). The proof case should include at least one token that uses the composite `primitiveReferences` pattern to validate structural replacement. → design-outline.md § "Phasing" Phase 1
    - **Action**: During task planning, ensure the proof case includes a composite-reference token alongside the Nav-TabBar-Base tokens.

**Recommended Review Order:**
1. [@PETER] Resolve OQ-1 (file format) and OQ-2 (explicit light file) — these shape the implementation
2. [@ADA] Resolve OQ-3 (opacity composition) and OQ-4 (migration path) — full audit per Peter's direction
3. [@LINA] Resolve OQ-5 (component layer impact) — determines if component-level changes are needed
4. [@THURGOOD] Formalize after open questions resolved — requirements.md with EARS patterns, then design.md, then tasks.md

---

#### [PETER–THURGOOD DISCUSSION (2026-03-16)]

**Context**: Following Thurgood R1, Peter and Thurgood discussed the override-only vs complete theme architecture, mode-aware primitives, drift prevention, and theme governance. This record captures the discussion outcomes as directives and open questions for Ada's response.

**D1. Architecture shift: Mode-aware primitives (Option 2) preferred over mode-invariant primitives (Option 1).**

Peter's rationale: Option 2 gives flexibility for palette variation per mode without semantic-layer changes. Dark mode primitives can have different hue/saturation/lightness for contrast or aesthetic reasons. The existing `ColorTokenValue` structure with `light`/`dark` keys was designed for this — Option 2 activates that infrastructure.

Implications for the architecture:
- Primitives carry their own light/dark values (two palette slots per color primitive)
- Semantic tokens reference primitive names without mode branching for the common case — the primitive handles mode differentiation
- Semantic overrides are only needed when the primitive *name itself* changes between modes (role remapping, e.g., Nav-TabBar-Base icon: `cyan500` in light → `cyan100` in dark)
- This dramatically shrinks the semantic override surface — most tokens are handled at the primitive level

[@ADA] Questions:
- How does this change the resolver design? Does the resolver now operate at two levels (primitive resolution + semantic override)?
- What's the impact on the existing primitive data model? The `light`/`dark` keys exist but are inert — what's needed to activate them?
- Does this change the generator output? Generators would need to read the mode-appropriate primitive value, not just the single value.
- How does this interact with the opacity composition pattern? If a primitive has different light/dark values AND a semantic token composites it with an opacity, the resolver needs to handle both dimensions.

**D2. Fallback behavior: Theme files default to base DesignerPunk values for absent entries.**

Peter's direction: If a theme file doesn't specify a value for a token, it falls back to the base value. This is graceful degradation — a missing dark value produces the light value, which is always a valid design (just not optimized for dark mode).

Implications:
- New tokens automatically work in all themes without explicit theme entries
- Theme authors only define what they're deliberately changing
- Omission is not an error — it's a fallback. The mode parity test becomes an audit report ("these tokens are using fallback values — is that intentional?") rather than a build failure.
- Structural errors (referencing a token that doesn't exist in base) still fail loudly

[@ADA] Questions:
- Does this change the resolver merge logic? Override-only with fallback vs complete-theme-with-fallback have different merge semantics.
- Should the fallback be at the primitive level (primitive's dark slot falls back to light slot) or the semantic level (semantic override falls back to base semantic), or both?

**D3. Hard constraint: A token in a theme cannot exist unless it already exists in base DesignerPunk.**

Peter's direction: Theme files cannot introduce new token names. The base DesignerPunk token set is the source of truth for what tokens exist. Themes only modify values.

Implications:
- Build-time validation: iterate theme file keys, assert every key exists in base. Fail if not.
- Prevents theme files from becoming shadow token systems
- Enforces token governance — all tokens go through the normal creation process

[@ADA] Questions:
- Does this apply to both primitive and semantic theme files?
- Are there edge cases where a theme might legitimately need a token that doesn't exist in base? (e.g., a WCAG-specific spacing token that has no base equivalent)

**D4. Theme template generation for drift prevention.**

Peter's idea: A build step that generates a theme template file from the current base token set. Every token key listed with its base value as a comment, empty slot for the theme value. When tokens are added to base, the template regenerates and a diff shows what's new.

Implications:
- Theme authors start from the template when creating new themes
- CI can compare generated template against existing theme files to flag: (a) new tokens needing evaluation, (b) orphaned overrides from deleted tokens
- Bridges the gap between "base tokens changed" and "theme authors need to evaluate"

[@ADA] Questions:
- What's the right shape for the template? Should it mirror the token definition format, or be a simplified key-value list?
- Should template generation be part of the token pipeline or a separate tooling concern?

**D5. WCAG theme as validation case for unified resolution.**

Peter's observation: The WCAG theme's cyan→teal action color swap is the same pattern as a mode override — a semantic remapping. Unifying mode + theme resolution (Phase 2) means one mechanism handles both. This strengthens the case for Phase 2 and provides a concrete validation case.

[@ADA] Questions:
- Does this change the Phase 2 scope or timeline estimate?
- Are there WCAG overrides that don't fit the theme file pattern? (e.g., overrides that change token structure, not just values)

**D6. Full audit of all semantic color tokens (Peter's direction).**

Peter explicitly directed: do the complete audit, not the Nav-TabBar-only subset. Thoroughness over speed. Don't worry about delaying 050 — this is meaningful architecture work and mistakes are hazardous.

[@ADA] This resolves your OQ-4. Full audit scope confirmed.

**D7. Testing approach influenced by architecture choice.**

Thurgood's assessment: Option 2 (mode-aware primitives) simplifies the common-case testing. If primitives carry their own light/dark values, semantic tokens that reference the same primitive name in both modes don't need override drift tests — the primitive handles it. Override drift tests only apply to the smaller set of semantic tokens with genuine role remapping.

Mode parity test shifts from "catch missing overrides" (build failure) to "report tokens using fallback values" (audit report). Structural errors (theme references nonexistent token) remain build failures per D3.

[@ADA] Does this match your understanding of how the test surface changes with Option 2?

---

#### [ADA R1]

**Overall Assessment**: The design outline is in strong shape after incorporating D1–D7 and the component token discussion. The two-level resolver (mode-aware primitives + semantic overrides for role remapping) is architecturally cleaner than the original single-level override approach — it activates infrastructure we already built, dramatically shrinks the semantic override surface, and keeps component tokens out of the theme system entirely. Thurgood's concerns about drift and test strategy are well-addressed by the fallback-as-audit-report model and the template generation tooling.

Two open questions remain (OQ-1, OQ-2). My recommendations below, with Peter's decisions recorded.

**OQ-1 Resolution: Theme file format — TypeScript** → design-outline.md § "Open Questions"

- **Recommendation**: TypeScript. Every token definition in the system is `.ts`. TypeScript gives compile-time type safety on override structure (override satisfies `SemanticOverride` type — compiler catches structural errors before build). Resolver imports directly — no parsing, no schema validation layer. Consistent with existing ecosystem (`resolveColorTokenValue`, `SemanticToken` interface, registry).
- **Counter-argument**: JSON is more portable for external tooling (Figma plugins, Style Dictionary, third-party theme editors). DTCG Resolver spec uses JSON. But our DTCG alignment is at the export boundary — we generate DTCG-compliant output, we don't need DTCG-compliant internals. If external tooling needs JSON, we generate it from TypeScript source, same pattern as DTCG export.
- **Peter's decision**: TypeScript. Alignment confirmed. → conversation 2026-03-16

**OQ-2 Resolution: Implicit "base = light" — no explicit light theme file** → design-outline.md § "Open Questions"

- **Recommendation**: Implicit. Base semantic token definitions *are* the light theme (Decision #4). An explicit light file would either re-export base (pure ceremony, zero information) or be empty (self-documenting in theory, but the absence of a light override file already documents that light = base). The resolver has no light override step — adding an empty file creates the illusion of a step that doesn't exist.
- **Counter-argument**: Mode parity tests need to compare light vs dark for each token. An explicit light file gives tests a consistent structure (iterate both files). Without it, tests read from the semantic token registry for light and from the override file for dark — a minor asymmetry. Also, a new contributor seeing only `themes/dark/` might wonder "where's light?" But a comment in the resolver or architecture doc handles that without a phantom file.
- **Deferred to Thurgood**: Test ergonomics may favor the explicit file. Thurgood's read on whether the test asymmetry matters in practice could tip this. Low-stakes either way — easy to add the explicit file later.
- **Peter's decision**: Implicit, pending Thurgood's input on test ergonomics. → conversation 2026-03-16

**Response to Thurgood R1 items:**

- **F1 (override drift)**: Addressed by the architecture shift to mode-aware primitives (D1). Override drift risk is now limited to the small set of role-remapping tokens, not all semantic color tokens. Template generation (D4/Decision #8) catches new tokens needing evaluation and orphaned overrides. Mode parity test as audit report (D2/Decision #5) flags fallback usage without failing builds.

- **F2 (combinatorial growth)**: Addressed by Decision #12 — adding new mode/theme dimensions requires a spec and Peter's approval. The 2×2 matrix (light/dark × base/WCAG) is the current bound. Architecture supports growth but governance gates it.

- **F4 (opacity composition)**: Resolved. Override replaces entire `primitiveReferences` object — no partial merge. Documented in design-outline.md § "Opacity composition interaction." Composition (modifiers) applies after primitive mode resolution.

- **F5 (test strategy)**: Confirmed. D7 aligns with the layered approach. Mode-aware primitives simplify common-case testing. Override drift tests scope to role-remapping tokens only. Mode parity is audit, not build failure.

- **F6 (rollback)**: Agree with Thurgood's own counter-argument — token pipeline runs at build time, not runtime. Bad resolver output is caught in CI or development; rollback is a git revert. Phase 2 (wcagValue removal) is the harder revert — recommend pre-migration snapshots of all resolved values as regression baseline, which Thurgood already identified in F5.4.

- **F8 (OQ-2 governance angle)**: See OQ-2 resolution above. Leaning implicit, but deferring to Thurgood on test ergonomics.

- **F9 (proof case scope)**: Agreed. Phase 1 proof case must include at least one composite-reference token alongside Nav-TabBar-Base tokens. Added to phasing in design-outline.md.

---

#### [LINA R1]

**@ Mention Responses:**

- Re: [@LINA] Resolve OQ-5 (component layer impact) — determines if component-level changes are needed -- [THURGOOD R1]
  - OQ-5 is resolved in the design outline and I agree with the resolution. Component tokens are excluded from theme overrides and inherit mode awareness through the resolution chain (component → semantic → primitive). No component-level changes needed. This is the right call — it keeps the component layer clean and mode-unaware. I've validated this against Nav-TabBar-Base's actual token needs below (see F10).

**Overall Assessment**: This is solid architecture work and I'm glad it's happening now rather than being patched around per-component. The two-level resolver is elegant — mode-aware primitives handle the common case, semantic overrides handle the exception. From the component side, the key question is: does this actually unblock Nav-TabBar-Base and future mode-differentiated components without requiring component-level workarounds? Short answer: yes, with one concern.

**Moderate:**

- F10. **Validated: Nav-TabBar-Base token needs map cleanly to the two-level resolver.** Walked through each mode-differentiated value from the Figma analysis against the proposed architecture. → design-outline.md § "Immediate Impact"
  - Container background (`white100` light / `gray400` dark): Level 1 — primitive `white100` carries both values in its `light`/`dark` slots. No semantic override needed. ✓
  - Inactive icon (`gray300` light / `gray100` dark): Level 1 — if these are the same primitive with mode-aware values. If they're different primitives, Level 2 semantic override. Need Ada to confirm which pattern applies.
  - Active icon (`cyan500` light / `cyan100` dark): Level 2 — different primitive names, semantic override swaps the reference. ✓
  - Indicator dot (`cyan500` light / `cyan100` dark): Level 2 — same pattern as active icon. ✓
  - Top stroke (`white200` light / `gray500` dark): Level 2 — different primitive names. ✓
  - Glow gradient center: Depends on how glow tokens are structured (still pending Ada — see Spec 050 feedback F11). If the glow is a composite token with color + opacity, the override-replaces-entire-object semantics (OQ-3 resolution) handles it cleanly.
  - [@ADA] For the inactive icon colors (`gray300` light / `gray100` dark) — are these the same primitive with mode-aware values, or different primitives requiring a semantic override? This determines whether it's Level 1 or Level 2. -- [LINA R1]

- F11. **Component-level mode forcing is correctly deferred, but will come up soon.** The outline explicitly scopes out "forcing a component to light mode in a dark context." I agree this is out of scope for this spec. But I want to flag that this pattern appears in real component scenarios — e.g., a modal overlay that's always light-themed regardless of system mode, or a media player with a forced-dark chrome. When this comes up, the resolution chain (component → semantic → primitive) would need a way to pin the mode at the component level, overriding the system mode. The current architecture doesn't prevent this — it just doesn't support it yet. No action needed now, but worth noting in the design doc as a known future extension point. → design-outline.md § "Out of Scope"

- F12. **Platform output mechanisms are correct for component implementations.** → design-outline.md § "Platform Output"
  - Web: CSS `light-dark()` maps directly to how we'd consume tokens in Web Component styles. Component CSS references `var(--color-action-primary)` and the token value handles mode switching. No component-level mode logic needed. ✓
  - iOS: Dynamic `UIColor` with `traitCollection` is the standard SwiftUI pattern. Components reference `DesignTokens.colorActionPrimary` and the token resolves per trait environment. ✓
  - Android: `lightColorScheme`/`darkColorScheme` in Compose is the standard pattern. Components reference `DesignTokens.color_action_primary` and the scheme handles it. ✓
  - The component implementations don't need to know about modes at all — they reference token names and the platform handles the rest. This is the ideal outcome.

**Minor:**

- F13. **Phase 2 wcagValue removal — no component impact expected, but worth verifying.** Component tokens reference semantic tokens by name, not by their internal `primitiveReferences` structure. When Phase 2 removes `wcagValue` from `primitiveReferences` and moves it to theme files, the component token references don't change — only the resolution path changes underneath. But the resolved values must remain identical pre- and post-migration. Thurgood's F5.4 (regression snapshots) covers this. → design-outline.md § "Phasing" Phase 2
  - [@THURGOOD] When you scope the regression snapshots for Phase 2, please include component token resolved values in the snapshot, not just semantic tokens. Component tokens are the consumer-facing surface — if a resolved value changes at the component level, that's what ships to users. -- [LINA R1]

- F14. **Decision #7 (component tokens excluded from theme overrides) needs one clarification.** The decision says "revisit only if a component needs a different semantic *concept* per mode." I'd sharpen this: the signal that something is wrong is if a component token needs to reference *semantic token A* in light mode and *semantic token B* in dark mode. That's not a component-level problem — it means the semantic layer is missing a token that encodes that mode-aware role. The fix is always to add the right semantic token (with a dark override), not to add component-level theme files. This keeps the component layer as a pure naming/aliasing layer. → design-outline.md § "Component Token Resolution"

---

#### [LINA R2]

**@ Mention Responses:** None pending.

- F15. **Audit should explicitly capture Level 1 vs Level 2 ratio as a metric.** Ada's R2 notes Nav-TabBar-Base has a 4:1 Level 2:Level 1 ratio — higher than expected. This ratio directly determines the maintenance burden of the override files and whether template generation tooling (Decision #8) is nice-to-have or load-bearing. → design-outline.md § "Architecture" / feedback.md § "ADA R2" F10 response
  - The audit should capture for each semantic color token:
    1. **Resolution level**: Level 1 (primitive handles it) or Level 2 (semantic override needed)
    2. **Design intent**: same role at a different value, or a different role entirely?
  - The second point matters because it reveals whether Level 2 tokens are genuinely different design decisions (intentional role remapping) or whether the primitive palette could be restructured to absorb more of them into Level 1. If many Level 2 tokens are "lighter/darker variant of the same hue in dark mode," that may signal primitive palette restructuring rather than semantic overrides.
  - [@ADA] Can you factor Level 1/Level 2 classification and design-intent capture into the audit methodology? The system-wide ratio shapes the maintenance story for the override architecture. -- [LINA R2]

---

#### [ADA R2]

**@ Mention Responses:**

- Re: [@ADA] For the inactive icon colors (`gray300` light / `gray100` dark) — are these the same primitive with mode-aware values, or different primitives requiring a semantic override? -- [LINA R1 F10]
  - **Level 2 — semantic override.** `gray300` and `gray100` are distinct primitives (different scale positions in the gray family: gray100 = lightest, gray300 = mid). They are not the same primitive with different mode values. The inactive icon semantic token would reference `gray300` in base, and the dark semantic override would swap it to `gray100`. Same pattern as the active icon (`cyan500` → `cyan100`) and indicator dot.

**Response to Lina R1 items:**

- **F10 (Nav-TabBar-Base validation)**: Lina's walkthrough is accurate. Updated classification:
  - Container background: Level 1 ✓ (primitive `white100` carries both mode values)
  - Inactive icon: **Level 2** — `gray300` → `gray100` (different primitives, semantic override)
  - Active icon: Level 2 ✓ — `cyan500` → `cyan100`
  - Indicator dot: Level 2 ✓ — `cyan500` → `cyan100`
  - Top stroke: Level 2 ✓ — `white200` → `gray500`
  - Glow gradient center: Pending glow token structure finalization (Spec 050). If composite, override-replaces-entire-object handles it per OQ-3 resolution.
  - This gives us 4 role-remapping tokens (Level 2) and 1 primitive-handled token (Level 1) for Nav-TabBar-Base alone. That's a higher Level 2 ratio than I initially expected — worth noting for the full audit. Nav-TabBar-Base may be an outlier (it has an unusual cyan accent inversion pattern), but the audit will tell us the system-wide ratio.

- **F11 (component-level mode forcing)**: Good flag. Agree it's correctly deferred and the architecture doesn't prevent it. Lina's examples (always-light modal, forced-dark media player) are real patterns. When this comes up, the mechanism would likely be a mode context parameter passed into the resolver at the component level, overriding the system-level mode. The two-level resolver supports this naturally — you'd just resolve with a pinned mode instead of the system mode. I'll note this as a future extension point in the design doc.

- **F14 (Decision #7 clarification)**: Lina's sharpening is better than the current language. The signal isn't "a component needs a different semantic concept per mode" — it's specifically "a component token needs to reference semantic token A in light and semantic token B in dark." And the fix is always to add the right semantic token with a dark override, not to add component-level theme files. This keeps the component layer as a pure naming/aliasing layer. I'll update the design outline to use Lina's framing.

---

## Requirements Feedback

### Context for Reviewers

- 11 requirements formalized from design outline decisions D1–D7, OQ resolutions, and Lina/Thurgood feedback → requirements.md
- EARS patterns used throughout — WHEN/THEN acceptance criteria, testable conditions
- Phase 1 (R1–R10) and Phase 2 (R11) separated cleanly
- Traces to design outline: R1→D1, R2→D1+D3, R3→Decision #9, R4→D3+D4, R5→D2, R6→Decision #10, R7→D6, R8→D4, R9→DTCG alignment, R10→MCP impact, R11→Phase 2 unification
- Component token exclusion from theme overrides documented in design outline (Decision #7) but not explicitly codified as a requirement — see Ada R3 observation #2

---

#### [ADA R3]

**Overall Assessment**: Clean formalization. The EARS patterns are consistent, acceptance criteria are testable, and the requirements trace back to design outline decisions accurately. The two-level resolver (R1 + R2) is well-decomposed — primitive mode resolution and semantic override are separate requirements with clear boundaries. R5 (fallback) correctly codifies the audit-report-not-build-failure model. R11 (Phase 2) addresses Lina's F13 concern by explicitly including component token resolved values in regression testing (AC4).

No blockers. Four observations, all minor:

**Minor:**

- F15. **R1 AC4 / R6 — platform mechanism specificity.** R6 AC1-3 name specific mechanisms: CSS `light-dark()`, iOS dynamic `UIColor`, Android `lightColorScheme`/`darkColorScheme`. These are correct and match the design outline, but they're implementation choices rather than behavioral requirements. If we later decide `prefers-color-scheme` media queries are better for web (e.g., broader browser compat), the requirement as written would need updating. Consider whether AC1-3 should specify the *behavior* ("generators SHALL produce mode-aware output using platform-native mechanisms") with the specific mechanisms as implementation notes rather than SHALL-level requirements. → requirements.md § R6
  - **Counter-argument**: Being specific is a feature, not a bug. Vague requirements like "platform-native mechanisms" leave too much interpretation. The design outline already evaluated these mechanisms and chose them deliberately. If we change our mind, we update the requirement — that's normal. The specificity makes the acceptance criteria unambiguous and testable.
  - **Recommendation**: Keep as-is. The specificity is appropriate for a system where we've already made the platform output decisions. Flag for review if platform output decisions change.

- F16. **R3 — no explicit component token passthrough requirement.** The design outline documents that component tokens inherit mode awareness through the resolution chain and are excluded from theme overrides (Decision #7, refined by Lina R1 F14). There's no requirement that explicitly states "the resolver SHALL NOT process component tokens" or "component tokens SHALL resolve through their semantic/primitive references without component-level mode logic." This is implied by the architecture (the resolver operates on semantic tokens, component tokens are downstream consumers), but it's not codified. → requirements.md § R3
  - [@LINA] Would you want this explicit for your domain? If a future change accidentally introduced component-level mode processing, this requirement would be the guardrail that catches it. -- [ADA R3]
  - **Recommendation**: Add a brief AC to R3: "WHEN the resolver processes tokens THEN it SHALL operate on semantic tokens only — component tokens SHALL resolve through their semantic/primitive references without component-level mode logic." Low effort, high clarity.

- F17. **R5 AC4 — mode parity audit trigger is unspecified.** AC4 says "WHEN a mode parity audit is requested" but doesn't specify when or how it's triggered. Is it on-demand? Every CI run? The template generation (R8) handles drift detection (new tokens needing evaluation, orphaned overrides), but the mode parity audit (which tokens are using fallback values) is a separate concern. → requirements.md § R5
  - **Recommendation**: Tie it to CI — "WHEN the CI pipeline runs THEN the mode parity audit SHALL report which semantic color tokens are using fallback values." This makes it automatic and consistent with the template generation CI integration (R8). If that's too noisy, make it a dedicated CI step that runs on token file changes only.

- F18. **Decision #12 (dimension governance gate) not captured as a requirement.** The design outline has Decision #12 — "adding new mode/theme dimensions requires a spec and Peter's approval." This isn't in the requirements doc. It's governance rather than implementation, so it may belong in a process doc or steering update rather than here. But it's worth noting the gap so it doesn't get lost. → design-outline.md § "Design Decisions Summary" #12
  - **Recommendation**: Not a requirements doc concern — this is a governance rule that should be captured in Token-Governance.md or Rosetta System Principles as part of the documentation updates (R10). Flag for the documentation update task in tasks.md.

---

#### [LINA R1]

**@ Mention Responses:**

- Re: [@LINA] Would you want this explicit for your domain? If a future change accidentally introduced component-level mode processing, this requirement would be the guardrail that catches it. -- [ADA R3]
  - Yes — I'd want this explicit. Ada's recommended AC wording is good: "WHEN the resolver processes tokens THEN it SHALL operate on semantic tokens only — component tokens SHALL resolve through their semantic/primitive references without component-level mode logic." This codifies Decision #7 as a testable requirement rather than just an architectural principle. If someone later adds component-level mode processing (even with good intentions), this AC is the guardrail. The component layer should stay a pure naming/aliasing layer — mode awareness flows up from below, never injected at the component level.

**Overall Assessment**: Clean requirements. The EARS patterns are consistent, the acceptance criteria are testable, and the Phase 1/Phase 2 separation is clear. From the component side, the requirements correctly insulate components from mode awareness — components never appear as actors in any requirement, which is exactly right. The mode architecture is infrastructure that components benefit from without participating in.

**Minor:**

- F19. **R11 AC4 correctly addresses my F13 concern.** "WHEN Phase 2 regression testing runs THEN it SHALL validate resolved values at both the semantic token level AND the component token level" — this is exactly what I asked Thurgood to include. Good to see it codified. No action needed. → requirements.md § R11 AC4

- F20. **R7 AC2 and AC3 incorporate the audit methodology from my F15/LINA R2.** AC2 captures design intent per Level 2 token, AC3 captures the system-wide ratio as a metric. Both were requested in my LINA R2 feedback. No action needed. → requirements.md § R7 AC2, AC3

- F21. **Agree with Ada R3/F15 — keep platform mechanism specificity in R6.** Ada's counter-argument is right: vague "platform-native mechanisms" leaves too much interpretation. The design outline already evaluated and chose these mechanisms. Specificity makes the ACs unambiguous. If we change our mind, we update the requirement. → requirements.md § R6

- F22. **Agree with Ada R3/F17 — tie mode parity audit to CI.** On-demand audits get forgotten. Tying it to CI on token file changes is the right trigger — automatic, consistent with template generation (R8), and not noisy if scoped to token file changes only. → requirements.md § R5 AC4

- F23. **Agree with Ada R3/F18 — dimension governance (Decision #12) belongs in Token-Governance.md, not requirements.** Flag for the R10 documentation update task. → requirements.md § R10 / design-outline.md § "Design Decisions Summary" #12

---

#### [THURGOOD R2]

**Revisions applied to requirements.md (2026-03-16):**

1. **R3 AC5 added** — "WHEN the resolver processes tokens THEN it SHALL operate on semantic tokens only — component tokens SHALL resolve through their semantic/primitive references without component-level mode logic." Codifies Decision #7 as a testable guardrail. Per Ada R3 F16 + Lina R1 agreement.

2. **R5 AC4 updated** — Mode parity audit tied to CI on token file changes instead of on-demand. Per Ada R3 F17 + Lina F22 consensus.

3. **OQ-2 test ergonomics input** — Implicit "base = light" is fine for testing. The resolver is the test surface — tests call it with `mode: 'light'` and `mode: 'dark'` and compare outputs. Tests don't need to read source files directly, so an explicit light file adds no test value. Agrees with Ada R1 recommendation. OQ-2 fully resolved.

**Items NOT changed (consensus to keep as-is):**
- R6 platform mechanism specificity — kept per Ada F15 counter-argument, Lina F21 agreement
- Decision #12 (dimension governance) — not a requirement; flagged for Token-Governance.md update via R10 documentation task, per Ada F18 + Lina F23

---

## Design Feedback

### Context for Reviewers

- Design doc formalizes the two-level resolver architecture from the design outline → design.md § "Architecture"
- Existing code infrastructure mapped: `ModeThemeResolver`, `SemanticTokenRegistry.resolveColorValue()`, `ModeThemeContext`, `SemanticToken.modeInvariant`, `TokenModifier` → design.md § "Current State"
- New components: `SemanticOverride` type, `SemanticOverrideResolver` class, dark override file → design.md § "Components and Interfaces"
- Level 1 requires data changes only (populate dark primitive values), no code changes to resolution path → design.md § "Two-Level Resolution"
- Level 2 is a new `SemanticOverrideResolver` class with validate/resolve/resolveAll → design.md § "SemanticOverrideResolver"
- Five design decisions documented with rationale and counter-arguments → design.md § "Design Decisions"
- Testing strategy: 4 layers matching Thurgood R1/F5 → design.md § "Testing Strategy"
- Seven correctness properties defined → design.md § "Correctness Properties"

---

#### [ADA R4]

**Overall Assessment**: This is a strong design doc. The code-level mapping to existing infrastructure is accurate — I verified `ModeThemeResolver`, `SemanticTokenRegistry.resolveColorValue()`, and `ModeThemeContext` against the actual source. The key architectural insight is correct: Level 1 requires zero code changes to the resolution path, only data changes to primitives. Level 2 is cleanly scoped as a new class with single responsibility. The `SemanticOverride` type is minimal and correct.

**Critical:**

- F19. **`ModeThemeResolver.validate()` has a real bug that will block Level 1 activation.** The design doc flags this in Decision 1's counter-argument: "The existing `ModeThemeResolver.validate()` requires hex format (`#RRGGBB`), but primitives store rgba strings." I verified this against the source — `validate()` at line 130 uses `/^#[0-9A-Fa-f]{6}$/` but every single primitive in `ColorTokens.ts` stores `rgba()` strings (324 occurrences, zero hex values). This means `validate()` currently returns `false` for every color primitive in the system. It's either dead code or a latent bug. Either way, it needs fixing before Level 1 activation — if anything calls `validate()` during the pipeline, it'll reject all primitives with distinct dark values. → design.md § "Design Decisions" Decision 1
  - **Action**: Audit where `validate()` is called. If it's dead code, document that and fix it as part of Phase 1. If it's called during the pipeline, fix it before activating dark primitive values. The fix is straightforward — update the regex to accept `rgba()` format or remove the format check entirely (the value is already typed as `string`).
  - [@THURGOOD] This should be a task item in tasks.md — fix `ModeThemeResolver.validate()` hex-only pattern before Level 1 activation. -- [ADA R4]

**Moderate:**

- F20. **`SemanticTokenRegistry.resolveColorValue()` reads `primitiveReferences.default` first, then `.color`, then first value.** The existing code at line 133-135 does: `const primitiveRef = semanticToken.primitiveReferences.default || semanticToken.primitiveReferences.color || Object.values(semanticToken.primitiveReferences)[0]`. This resolution order matters for the override system. When `SemanticOverrideResolver` swaps `primitiveReferences`, the downstream `resolveColorValue()` will read the swapped object using this same priority order. The design doc should note that overrides must use key names that `resolveColorValue()` will pick up correctly. → design.md § "Two-Level Resolution"
  - For simple overrides (`{ value: 'cyan100' }`), the `Object.values()[0]` fallback handles it.
  - For composite overrides (`{ color: 'gray100', opacity: 'opacity048' }`), the `.color` key is picked up at priority 2.
  - But there's no `.value` in the priority chain — it goes `default`, `color`, then first value. If an override uses `{ value: 'x' }`, it relies on `Object.values()[0]`. This works but is fragile — it depends on object key insertion order.
  - **Recommendation**: Either (a) document this dependency explicitly in the design doc, or (b) update `resolveColorValue()` to check `.value` explicitly in the priority chain. Option (b) is safer and minimal — add `semanticToken.primitiveReferences.value ||` to the chain.

- F21. **`SemanticOverride` type includes optional `modifiers` — good foresight.** The type allows an override to change modifiers (e.g., removing an opacity modifier when switching from composite to solid). This handles the OQ-3 case cleanly. The design doc example shows this implicitly (the `color.structure.border.subtle` override has no modifiers comment). Worth making explicit: when an override omits `modifiers`, does the base token's modifiers still apply, or are they cleared? → design.md § "SemanticOverride Type"
  - **Recommendation**: Define the semantics: if override includes `modifiers`, use override's modifiers. If override omits `modifiers`, inherit base token's modifiers. This matches the "override replaces what it specifies" pattern without requiring every override to explicitly clear modifiers.

- F22. **Correctness property #6 (component exclusion) should be testable.** "Component tokens are never processed by the override resolver" is stated as a correctness property but the testing strategy doesn't include a test for it. A simple test: pass a component token name as an override key → validate() should reject it (it won't exist in the semantic token registry, so R4 AC1 catches it). But that's incidental — there's no explicit "the resolver only operates on semantic tokens" assertion. → design.md § "Correctness Properties" / "Testing Strategy"
  - **Recommendation**: Add a resolver unit test that verifies component token names in the override file are rejected by `validate()`. This makes the component exclusion property testable rather than just architectural.

**Minor:**

- F23. **Pipeline integration point is vague.** The doc says the resolver integrates into "TokenFileGenerator or TokenEngine — whichever orchestrates the generation step." This should be pinned to a specific class during implementation. Not a design doc concern per se, but worth noting for tasks.md. → design.md § "Pipeline Integration Point"

- F24. **Decision 4 counter-argument (memory footprint) is correct but understated.** Two full token sets for ~56 color tokens is negligible. But the token sets include all semantic tokens, not just color — spacing, typography, border, shadow, etc. Only color tokens have mode-aware values, but the resolver produces two complete sets. The non-color tokens are identical in both sets. This is fine at current scale but worth noting: the optimization would be to only duplicate color tokens, not all semantic tokens. Not worth implementing now. → design.md § "Design Decisions" Decision 4

---

#### [LINA R1]

**@ Mention Responses:** None pending.

**Overall Assessment**: From the component side, this design doc confirms what I need to hear: components don't change. Level 1 is data-only, Level 2 is a new class that operates on semantic tokens only, and generators produce platform-native mode output that components consume transparently. The code-level mapping to existing infrastructure is reassuring — this isn't a greenfield rewrite, it's activating infrastructure that was designed for this.

**Moderate:**

- F25. **Ada's F20 (`resolveColorValue()` priority chain) matters for component token resolution.** Component tokens resolve through semantic tokens, which resolve through `resolveColorValue()`. If the `.value` key fallback is fragile (depends on object key insertion order), that fragility propagates to every component token that references a mode-aware semantic token. Ada's option (b) — adding `.value` explicitly to the priority chain — is the right fix. It's one line of code and eliminates a class of subtle bugs where an override works in tests but breaks when object key order changes. → design.md § "Two-Level Resolution"
  - I'd go further: the override file examples in the design doc consistently use `{ value: 'tokenName' }` for simple overrides. If `.value` isn't in the priority chain, every example in the doc is relying on the fragile `Object.values()[0]` fallback. That's a documentation-implementation mismatch waiting to happen.

- F26. **Ada's F21 (modifier inheritance semantics) needs explicit definition.** When a dark override omits `modifiers`, do base modifiers still apply? This directly affects component rendering. Example: if `color.structure.border.subtle` has an opacity modifier in light mode (composite `{ color, opacity }`) and the dark override switches to solid (`{ value: 'gray500' }` with no modifiers), the component needs to render a solid color in dark mode, not a solid color with an opacity modifier applied on top. → design.md § "SemanticOverride Type"
  - Ada's recommendation (omitted = inherit base modifiers) is the wrong default for this case. If the override is switching from composite to solid, inheriting the opacity modifier would produce the wrong result.
  - **Recommendation**: If override includes `modifiers` (even empty `[]`), use override's modifiers. If override omits `modifiers` key entirely, inherit base. This gives override authors explicit control: `modifiers: []` means "clear all modifiers," omitting `modifiers` means "keep base modifiers." The distinction is meaningful.

- F27. **Ada's F22 (component exclusion testability) — agree, and the test is simpler than described.** The `SemanticOverrideResolver` constructor takes a `SemanticTokenRegistry`. Component tokens aren't in the semantic registry — they're in a separate registry (or in component schema files). So `validate()` naturally rejects component token names because they don't exist in the semantic registry. The test is: put a component token name in the override file, call `validate()`, assert it fails with "key not found in base registry." This is already covered by R4 AC1, but an explicit test case with a component token name makes the intent clear. → design.md § "Testing Strategy"

**Minor:**

- F28. **Correctness property #7 (backward compatibility) is the most important property for components.** "Tokens without dark overrides and primitives without distinct dark values produce identical output to the pre-mode-architecture pipeline." This means existing components — all 28 of them — continue to work without any changes after this architecture ships. If this property is violated, every component in the system could break. The testing strategy should include a regression test that runs the full pipeline with current (identical light/dark) primitive data and verifies output matches pre-architecture output exactly. → design.md § "Correctness Properties" #7
  - This may already be implied by the testing layers, but it's important enough to call out explicitly as a test case.

---

#### [THURGOOD R3]

**Revisions applied to design.md (2026-03-16):**

1. **Modifier inheritance semantics defined** — Override with `modifiers` key (even `[]`) replaces base modifiers. Override without `modifiers` key inherits base modifiers. Per Lina F26 (Ada F21 recommendation adjusted — Lina's "present even if empty = override, absent = inherit" is correct for the composite→solid case).

2. **Pre-requisite fixes documented** — Two existing code issues that must be fixed before Level 1 activation:
   - `ModeThemeResolver.validate()` hex-only regex (Ada R4 F19 — critical)
   - `resolveColorValue()` missing `.value` in priority chain (Ada R4 F20 + Lina F25)

3. **Correctness properties updated** — Added #5 (modifier inheritance), renumbered to 8 total.

4. **Testing strategy expanded** — 5 layers (was 4):
   - Layer 1: Added component exclusion test case (Ada F22 + Lina F27), modifier inheritance tests, pre-requisite fix tests
   - Layer 4 (new): Backward compatibility regression — run full pipeline with current data, verify zero diff (Lina F28)
   - Layer 5: Phase 2 regression (renumbered from Layer 4)

**Items NOT changed:**
- Pipeline integration point left vague (Ada F23) — will be pinned in tasks.md during implementation
- Decision 4 memory optimization note (Ada F24) — acknowledged, not worth implementing at current scale

---

#### [LINA R2]

**@ Mention Responses:**

- Re: [@LINA] Does the complete-theme-with-fallback model change anything about component token resolution or the component MCP update (Task 8.4)? -- [PETER–THURGOOD DISCUSSION R2]
  - **No changes needed.** Thurgood's assessment is correct — components are downstream consumers that see resolved values, never the theme file. The resolver produces the same output regardless of whether the theme file is sparse or complete. Component tokens resolve through the chain (component → semantic → primitive), and the resolver handles the semantic→primitive step identically either way.
  - For Task 8.4 specifically: the component MCP reads resolved token values from the pipeline output. Whether those values came from a populated override entry or a fallback-to-base entry is invisible to the MCP. The `getComponent()` response shows `{ light: "rgba(...)", dark: "rgba(...)" }` — it doesn't know or care how the resolver got there.

**Honest thoughts on the complete-theme-with-fallback shift:**

This is the right correction, and I'm glad it was caught now rather than during implementation.

From the component side, the incremental population model is exactly what I need. Here's why: when I'm building Nav-TabBar-Base, I need its dark values to be correct. I don't need every other component's dark values to be correct yet — those components haven't been designed for dark mode. The override-only model would have worked fine for Nav-TabBar-Base, but it created an implicit expectation that the full audit (Task 3.1) would produce a complete set of dark overrides. Peter's direction makes it explicit: the audit classifies tokens, the theme file has all the slots, but only Nav-TabBar-Base slots get populated now. Other components fill their slots when their specs reach that point.

This also resolves my F31 concern about the Figma dark palette source. I was worried Task 4 would be blocked on a full dark palette that doesn't exist yet. With incremental population, Task 4 is scoped to Nav-TabBar-Base primitives only — and we have those values from the Figma analysis.

Ada's approach of "file is complete, exported map is sparse" is clean. The file serves as a human-readable inventory (Carbon-style), the exported data is efficient for the resolver. No sentinel values, no null checks, no wasted processing on commented-out entries.

**Minor:**

- F36. **Incremental population creates a recurring cross-domain handoff that needs documenting.** When a future component is designed with dark mode needs, the component scaffolding workflow requires a step: "coordinate with Ada to populate the component's semantic token entries in the theme file." Without this, a component author (me or a future agent) could build a component, reference semantic tokens, and not realize the dark values are still fallback-to-light. The component would render correctly in light mode and silently wrong in dark mode. → design-outline.md § "Phasing" / tasks.md § Task 8
  - This isn't a concern for this spec's implementation — Nav-TabBar-Base is the proof case and its values will be populated explicitly. But it's a process gap for future components.
  - **Recommendation**: Add a subtask or note to Task 8 (documentation updates) to update the Component Development Guide or component scaffolding workflow with a "dark mode token population" step. Alternatively, capture it as a ballot measure for the Component-Development-Guide.md steering doc.
  - [@THURGOOD] Would this fit as a note in Task 8.1 (Rosetta System Architecture docs) or as a separate documentation item? It's a process concern, not an architecture concern. -- [LINA R2]

**Moderate:**

- F31. **Agree with Ada F27 — dark primitive values need a Figma source.** Task 4.2 says "populate distinct dark values in color primitives" but doesn't specify where those values come from. For Nav-TabBar-Base, we have the Figma analysis with specific dark values extracted. But for the full primitive palette (~50+ color primitives), the dark mode values are design decisions that live in Figma. Someone needs to extract them, and that's not a pure engineering task — it requires design review to confirm the dark palette is intentional, not just Figma defaults. → tasks.md § Task 4.2
  - This could block Task 4 if the Figma dark palette isn't fully defined yet. Worth confirming with Peter whether the full dark palette exists in Figma or if it needs to be designed as part of this spec.

- F32. **Task 7.1 — my validation scope needs clarification.** The task says "Lina validates against Figma design intent." I can validate that the resolved token values match what the Figma analysis extracted (the specific color values from `analysis/analysis-tab-bar/`). But I can't validate that the Figma design intent is *correct* — that's Peter's call. My validation is: "does the pipeline output match what Figma specifies?" not "is what Figma specifies the right design?" → tasks.md § Task 7.1
  - **Recommendation**: Clarify that Lina validates pipeline output against Figma-extracted values. Peter validates that the Figma design intent is correct. These are different validation steps.

- F33. **Task 8.4 (component MCP update) — I need the resolver output format before I can implement.** The component MCP's `getComponent()` response needs to show light/dark resolved values. To implement this, I need to know: (a) what format the resolver outputs (the `{ light: SemanticToken[], dark: SemanticToken[] }` from Task 2), and (b) how the component MCP accesses resolved values (does it call the resolver directly, or read generated output files?). Task 8.4 depends on Tasks 2 and 5 being complete. → tasks.md § Task 8.4
  - The dependency is implicit in the task ordering (Task 8 comes after Tasks 1-7), but worth making explicit since Task 8's subtasks could theoretically be parallelized — 8.4 cannot start until the pipeline is working.

**Minor:**

- F34. **Agree with Ada F28 — investigate pipeline integration point during Task 2, not Task 5.** If the resolver API doesn't fit the integration point, we'd refactor after the fact. A 30-minute investigation during Task 2 prevents that. → tasks.md § Task 5.1 / Task 2.2

- F35. **Phase 2 task decomposition (Tasks 9-11) is appropriately detailed.** Thurgood's earlier concern (F3 in design outline feedback) about Phase 2 being underspecified is addressed. The snapshot → migrate → verify pattern is clear, and the subtask granularity matches Phase 1. The inclusion of component token resolved values in the regression snapshot (Task 9.1) addresses my F13 concern. No action needed.

---

## Tasks Feedback

### Context for Reviewers

- 11 parent tasks: 8 Phase 1 (Tasks 1-8), 3 Phase 2 (Tasks 9-11) → tasks.md
- 33 subtasks total across both phases
- All 11 requirements (R1-R11) traced to at least one subtask
- Task ordering: pre-requisite fixes → infrastructure → data → output → governance → documentation → Phase 2 (snapshot → migrate → verify)
- Agent assignments: Ada (primary for token/pipeline work), Lina (component MCP), Thurgood (governance ballot measure, audit coverage)
- Feedback traces: Ada R4 F19/F20 → Task 1, Thurgood R1 F3 → Phase 2 decomposition, Thurgood R1 F9 → Task 7.1 composite proof case, Lina R2 F15 → Task 3.1 audit methodology, Ada R3 F18 → Task 8.5 governance update, Lina F28 → Task 4.1/4.3 backward compatibility

---

#### [ADA R5]

**Overall Assessment**: Well-decomposed task plan. The ordering is correct — pre-requisite fixes before infrastructure, infrastructure before data, data before generators, governance tooling after the core pipeline works, documentation last. Phase 2 follows the same safe pattern: snapshot → migrate → verify. All 11 requirements are traced. The subtask granularity is appropriate — not too fine (busywork), not too coarse (unclear scope).

I verified the code references against actual source. The task descriptions are accurate with one file path correction needed.

**Moderate:**

- F25. **Task 4 references wrong file path for primitive color tokens.** Task 4 lists `src/tokens/primitives/ColorTokens.ts` as the primary artifact. The actual file is `src/tokens/ColorTokens.ts` — there's no `primitives/` subdirectory. The semantic color tokens are at `src/tokens/semantic/ColorTokens.ts`. → tasks.md § Task 4
  - **Action**: Correct to `src/tokens/ColorTokens.ts`.

- F26. **Task 1.2 priority chain — verified the need.** I confirmed against the source: `resolveColorValue()` at line 133-135 checks `.default` (never used by any semantic color token), then `.color` (used by composites), then `Object.values()[0]` (catches `value` by insertion order). No semantic token uses `default` as a key — all 60 non-composite tokens use `value`. The `.value` addition to the priority chain is correct and necessary. Recommended order in the task is right: `.default || .value || .color || Object.values()[0]`. → tasks.md § Task 1.2

- F27. **Task 3.1 (audit) and Task 4.2 (populate dark values) have a data dependency that needs Figma input.** The audit classifies tokens as Level 1/Level 2, and Task 4.2 populates dark primitive values. But where do the actual dark mode color values come from? The Figma design files have Day/Night variants with specific color values. Someone needs to extract the dark palette values from Figma and map them to primitives. This is a data authoring task that's implicit in 4.2 but not called out. → tasks.md § Task 4.2
  - For Nav-TabBar-Base, we have the Figma analysis with specific dark values. But for the full primitive palette, we need the dark mode Figma color definitions.
  - **Recommendation**: Add a note to Task 4.2 that dark primitive values require Figma dark mode palette extraction. This may need Peter's input on which primitives get which dark values — it's a design decision, not just a data entry task.

- F28. **Task 5.1 — pipeline integration point needs investigation before implementation.** The task says "determine integration point: TokenFileGenerator or TokenEngine." This investigation should happen early — ideally during Task 2 (infrastructure) so the resolver's API is designed to fit the integration point. If we build the resolver and then discover the integration point requires a different interface, we'd need to refactor. → tasks.md § Task 5.1
  - **Recommendation**: Add a subtask to Task 2 (or a note on Task 2.2) to investigate the pipeline integration point and confirm the resolver API fits. Low effort, prevents rework.

**Minor:**

- F29. **Task 10.1 (extend override types for theme dimension) lists three options but doesn't pre-select.** Options: (a) separate file per context, (b) single file with context keys, (c) mode + theme files composed. This is an architectural decision that should be made during design, not during implementation. The design doc (design.md) should be updated with this decision before Task 10 begins. → tasks.md § Task 10.1
  - **Recommendation**: Flag this as a design decision needed before Phase 2 implementation. Could be resolved during Phase 1 documentation (Task 8) or as a Phase 2 design addendum.

- F30. **Agent assignments look correct.** Ada owns the token/pipeline work (Tasks 1-7, 9-11). Lina owns component MCP update (Task 8.4) and validates proof case against Figma (Task 7.1). Thurgood owns governance ballot measure (Task 8.5) and audits test coverage (Tasks 2.3, 4.3, 5.6, 10.6, 11.1). The cross-domain handoffs are clean.

#### [THURGOOD R4]

**Revisions applied to tasks.md (2026-03-17):**

1. **Task 4 file path corrected** — `src/tokens/primitives/ColorTokens.ts` → `src/tokens/ColorTokens.ts`. No `primitives/` subdirectory exists. Per Ada R5 F25.

2. **Task 2.2 — pipeline integration investigation added** — Resolver API design now includes upfront investigation of the integration point (`TokenFileGenerator` vs `TokenEngine`) to confirm `resolveAll()` return shape fits. Prevents rework if the API doesn't match. Per Ada R5 F28 + Lina F34.

3. **Task 4.2 — Figma dependency documented** — Dark primitive values are design decisions sourced from Figma. Nav-TabBar-Base values available in analysis files; full palette requires Figma dark mode extraction. May need Peter's input. Per Ada R5 F27 + Lina F31.

4. **Task 7.1 — validation scope clarified** — Lina validates pipeline output matches Figma-extracted values. Peter validates Figma design intent is correct. These are separate validation steps. Per Lina F32.

5. **Task 8.4 — dependency on Tasks 2+5 made explicit** — Cannot parallelize with 8.1-8.3; needs resolver output format and working pipeline. Per Lina F33.

6. **Task 10.1 — design decision prerequisite flagged** — Theme context model (how 4 contexts map to override files) should be resolved as a Phase 2 design addendum before implementation begins. Per Ada R5 F29.

**Items NOT changed:**
- Ada R5 F26 (Task 1.2 priority chain verified) — no action needed, confirmed correct
- Ada R5 F30 (agent assignments correct) — no action needed
- Lina F35 (Phase 2 decomposition adequate) — no action needed

---

#### [PETER–THURGOOD DISCUSSION R2 (2026-03-17)]

**Context**: During tasks.md review, Peter identified a misalignment between his intended architecture and what was formalized in the spec documents. Peter intended a **complete theme with fallback** model (Carbon-style: every semantic color token has a slot in the theme file, with fallback to base for unpopulated entries). The spec documents formalized an **override-only** model (theme file contains only role-remapping tokens, everything else falls back silently).

**Root cause**: The Peter-Thurgood Discussion (D1-D7) captured the decision on mode-aware primitives (Option 2) but did not explicitly capture the decision on theme file architecture (complete vs override-only). D1's implication — "semantic overrides are only needed when the primitive name itself changes between modes" — was interpreted by Thurgood and Ada as "the theme file should only contain overrides." Peter's intent was "most tokens are handled at the primitive level, but the theme file still represents the full token set with fallback for unpopulated entries." D2 (fallback behavior) and D4 (template generation) both support the complete-theme model, but the override-only interpretation was reinforced through Ada R1 and subsequent formalization without catching the mismatch.

**Peter's direction**: Complete theme with fallback. Theme files list every semantic color token. Populated entries have dark overrides. Unpopulated entries fall back to base. The template generator (D4) produces the file skeleton. This is the Carbon-style mental model — theme files represent the full token set, not just exceptions.

**Thurgood's impact assessment**: The resolver architecture (`SemanticOverrideResolver`) is agnostic to whether the theme file is sparse or complete — it checks for an override, uses it if present, falls back if not. The change is primarily:
1. Theme file format (complete vs sparse)
2. Governance mental model ("fill empty slots" vs "add overrides as needed")
3. Template generator role (produces the theme file skeleton, not a separate governance artifact)
4. Wording in design-outline, requirements, and design docs

The resolver class, correctness properties, testing layers, pipeline integration, generator output, and Phase 2 architecture are believed to be unaffected.

**Questions for Ada and Lina before revisions proceed:**

[@ADA] Two questions:
1. Does the complete-theme-with-fallback model change anything about the `SemanticOverride` type or the `SemanticOverrideResolver`'s merge semantics? Thurgood's assessment is that the resolver is agnostic — it processes whatever entries exist in the map and falls back for absent entries regardless of whether the file is "supposed to" contain all tokens or just overrides. Confirm or correct.
2. Does this change the theme template generator's role? In the override-only model, the template was a governance artifact that flagged gaps. In the complete-theme model, the template *is* the theme file skeleton — you generate it, populate the entries you have values for, and the rest fall back. Is there a meaningful implementation difference, or is it the same tooling with a different framing?

[@LINA] One question:
1. Does the complete-theme-with-fallback model change anything about component token resolution or the component MCP update (Task 8.4)? Thurgood's assessment is no — components are downstream consumers that never see the theme file, they see resolved values. The resolver produces the same output regardless of theme file completeness. Confirm or correct.

**Scope of revisions pending feedback:**
- design-outline.md: "Theme File Architecture (Override-Only)" → complete theme with fallback. Decision #3 rewording. Examples updated.
- requirements.md: R2 framing (currently "override for role remapping" — may need broadening). R4 and R8 may already align with complete theme model.
- design.md: Dark override file example updated to show complete format. Resolver interface unchanged.
- tasks.md: Task 3.2 scope change (complete theme file, not just role-remapping entries). Task 6.2 role change (template generator produces theme file skeleton).

**Peter's additional direction on scope:**
- Dark palette design work is not complete — only Nav-TabBar-Base has final dark values from Figma.
- For now, only Nav-TabBar-Base dark values will be populated. Other entries remain as fallback slots.
- Individual components will populate their dark values as part of their own specs, not as a retroactive sweep.
- This is consistent with the complete-theme model — the file has all the slots, they get filled incrementally as design work progresses.

#### [ADA R6]

**@ Mention Responses:**

- Re: [@ADA] Does the complete-theme-with-fallback model change anything about the `SemanticOverride` type or the `SemanticOverrideResolver`'s merge semantics? -- [PETER–THURGOOD DISCUSSION R2]
  - **No changes needed to the type or resolver.** Thurgood's assessment is correct — the resolver is agnostic. `validate()` checks keys exist in base, `resolve()` swaps if present / falls back if absent, `resolveAll()` iterates both modes. None of this cares whether the source map is sparse or complete.
  - The cleanest approach: the theme *file* lists every semantic color token (complete skeleton for human readability), but the exported `SemanticOverrideMap` only contains entries with actual override values. Unpopulated tokens are commented out in the file, not present in the exported map. The resolver falls back naturally for absent keys — no sentinel values, no null checks needed.
  - This means the file is complete (Carbon-style mental model), but the data the resolver consumes is sparse (efficient, no-op entries eliminated). Best of both worlds.

- Re: [@ADA] Does this change the theme template generator's role? -- [PETER–THURGOOD DISCUSSION R2]
  - **Yes — the template generator now produces the theme file itself, not a separate governance artifact.** In the override-only model, the template was generated separately and compared against the override file in CI. In the complete-theme model, the generator produces the actual `SemanticOverrides.ts` skeleton with all tokens listed as commented-out fallback entries. You uncomment and populate entries as dark values become available.
  - Implementation is actually simpler: one file, one generator, one CI check. When a new token is added to base, the generator regenerates, the new token appears as a commented-out entry, and CI flags the diff ("new token needs dark mode evaluation"). No separate template-vs-override comparison step.
  - This aligns with Peter's incremental population direction — Nav-TabBar-Base dark values populated now, other components fill their slots as their specs progress.

**Impact assessment on spec documents:**

Thurgood's impact assessment is accurate. The changes are primarily framing and file format, not architecture:

1. **`SemanticOverride` type**: Unchanged.
2. **`SemanticOverrideResolver`**: Unchanged. Merge semantics identical.
3. **Correctness properties**: Unchanged. All 8 properties hold regardless of theme file completeness.
4. **Testing layers**: Unchanged. Resolver tests pass sparse or complete maps.
5. **Pipeline integration**: Unchanged. Resolver receives a `SemanticOverrideMap`, doesn't care about file structure.
6. **Generator output**: Unchanged. Generators receive resolved token sets.
7. **Phase 2 architecture**: Unchanged. Unified resolver consumes override maps regardless of completeness.

What changes:
- **design-outline.md**: "Override-Only" → "Complete Theme with Fallback." Decision #2 and #3 reworded. File architecture example updated to show complete skeleton. Template generator description updated.
- **requirements.md**: R2 framing broadened (not just "role remapping" — complete theme file with populated and unpopulated entries). R4 and R8 already align (R4 validates keys exist in base, R8 generates template — both work for complete model).
- **design.md**: Dark override file example updated to show complete format with commented-out fallback entries. Resolver interface unchanged.
- **tasks.md**: Task 3.2 produces complete theme file (all tokens listed, only audit-identified overrides populated). Task 6.2 template generator produces the theme file skeleton directly. Task 4.2 scope narrowed per Peter's direction — only Nav-TabBar-Base dark values populated now, other entries remain as fallback.

**On Peter's incremental population direction:**

This is the right call. The complete-theme model supports incremental population naturally — the file has all the slots, they get filled as design work progresses per component spec. This avoids the "retroactive sweep" problem (auditing all 56 tokens for dark values when most components haven't been designed for dark mode yet) while still maintaining a complete inventory of what needs dark mode attention.

The full audit (Task 3.1 / R7) still classifies every token as Level 1/Level 2/mode-invariant — that's architectural knowledge we need regardless. But populating actual dark values is incremental, driven by component specs.

#### [THURGOOD R5]

**Revisions applied across all spec documents (2026-03-17):**

Architecture correction: Override-only → Complete theme with fallback. Per Peter-Thurgood Discussion R2, confirmed by Ada R6 (resolver unchanged) and Lina R2 (component resolution unchanged).

**design-outline.md:**
1. Phase 1 bullet: "override-only" → "complete theme with fallback"
2. Phase 1 bullet: "create semantic dark override file for role-remapping tokens" → "create semantic dark theme file listing all semantic color tokens (populated + fallback)"
3. "Theme File Architecture (Override-Only)" section → "Theme File Architecture (Complete Theme with Fallback)" — full rewrite of section description, file tree annotation, and key insight
4. Decision #2: removed "dramatically shrinks the semantic override surface" — replaced with "most tokens are handled at the primitive level"
5. Decision #3: "Semantic overrides only for role remapping" → "Complete theme files with fallback" — full rewrite
6. Decision #12: "override surface" → "theme file surface"

**requirements.md:**
1. R2 title: "Semantic Override for Role Remapping" → "Dark Theme File with Semantic Overrides"
2. R2 user story: broadened from role-remapping-only to complete theme file with incremental population
3. R2 AC2: "no semantic override exists" → "token is not present in the exported override map (unpopulated/commented-out)"
4. R2 AC4: "every override key" → "every exported override key"
5. R8 title: "Theme Template Generation" → "Theme File Generation"
6. R8 user story: "auto-generated theme template" → "auto-generated theme file skeleton"
7. R8 AC1: template → complete theme file with populated entries exported and unpopulated entries commented out

**design.md:**
1. "Dark Semantic Override File" section → "Dark Theme File (Complete with Fallback)" — full rewrite of example showing complete inventory with populated entries, Level 1 fallback entries, and not-yet-designed fallback entries

**tasks.md:**
1. Task 3.2: "Create dark semantic override file" → "Create complete dark theme file" — lists all ~56 tokens, populates Level 2 entries, comments out Level 1 and not-yet-designed entries, exports only populated entries
2. Task 4.2: Scope narrowed to Nav-TabBar-Base primitives only per Peter's direction (full dark palette design not complete, other components populate as part of their own specs)
3. Task 6.2: "Implement theme template generator" → "Implement theme file generator" — generates the complete theme file skeleton directly, CI regenerates and compares to detect new/orphaned tokens
4. Task 8.5: Expanded to include second ballot measure for Component-Development-Guide.md — "dark mode token population" step in component scaffolding workflow per Lina R2 F36

**What did NOT change (confirmed by Ada R6 + Lina R2):**
- `SemanticOverride` type — unchanged
- `SemanticOverrideResolver` class — unchanged (agnostic to file completeness)
- Correctness properties (all 8) — unchanged
- Testing layers (all 5) — unchanged
- Pipeline integration — unchanged
- Generator output — unchanged
- Phase 2 architecture — unchanged
- Agent assignments — unchanged

#### [ADA R7]

**Final pass — cross-document consistency review.**

All four spec documents (design-outline, requirements, design, tasks) are consistent after the complete-theme-with-fallback revision. One minor wording issue:

- F36. **design-outline.md § "Theme Template Generation (D4)" framing is stale.** The section still describes the template generator as a "governance/maintenance tool" that produces a separate template file and "CI compares generated template against existing theme files." Under the complete-theme model, the generator produces the theme file itself — it's not a separate artifact compared against the theme file, it *is* the theme file skeleton. The design.md and tasks.md already have the correct framing (Task 6.2: "Generate the complete dark theme file skeleton"). → design-outline.md § "Theme Template Generation (D4)"
  - [@THURGOOD] Minor wording update needed to align design-outline.md with the complete-theme model. The generator produces the theme file, not a separate template compared against it. -- [ADA R7]

#### [THURGOOD R6 — Task 5.2 Execution Review]

**Scope**: Post-implementation review of Task 5.1 + 5.2 execution, focusing on architectural decisions made during implementation.

**Overall assessment**: Execution is solid. SemanticValueResolver was a necessary addition the spec didn't anticipate — correctly identified and filled by Ada. Web `light-dark()` implementation is clean. Two items for Ada's response:

- F37. **B-lite integration pattern — silent fallback concern.** Task 5.1 chose "Option B-lite" over full Option B to avoid breaking ~40 test call sites. The trade-off: `GenerationOptions.semanticTokens` and `darkSemanticTokens` are optional, with fallback to self-fetch via `getAllSemanticTokens()`. The fallback path does not go through mode resolution or override application. This means any code path that calls the generator without pre-resolved tokens gets silently incorrect output for mode-aware generation — no error, no warning, just wrong values. The design doc (D9) says the resolver sits between Registry and Generation, but B-lite makes that a convention rather than an architectural guarantee. **Proposed middle path**: make the fallback path loud rather than silent. If `darkSemanticTokens` is provided but `semanticTokens` is not (or vice versa), fail with a descriptive error. Existing tests that don't pass either field continue to work unchanged — they're not requesting mode-aware output. But any future code that tries to get mode-aware output without going through the resolver gets a build failure instead of silent wrong output. Additionally, the "transitional" fallback should have a tracked removal task so it doesn't become permanent. → `src/generators/TokenFileGenerator.ts` GenerationOptions, `src/generators/generateTokenFiles.ts`
  - [@ADA] Is the loud-fallback middle path feasible without cascading complexity? What's your assessment of the silent correctness risk? If B-lite stays, should we add a tracked task for fallback removal? -- [THURGOOD R6, PETER concurs]

- F38. **String-parsing fragility in extractCssValue/extractCssPropName.** The `light-dark()` logic parses formatted CSS strings via regex to extract values and property names, then reassembles them. This works but is fragile — if formatter output format changes (e.g., different whitespace, multi-line values), the regex breaks silently. Not a blocker, but worth noting as a maintenance risk. A structured intermediate representation (formatter returns `{ propName, value }` instead of a string) would be more robust, but that's a larger refactor of the formatter interface. → `src/generators/TokenFileGenerator.ts:1452-1475`
  - [@ADA] Low priority, noting for awareness. If you see a natural opportunity to move toward structured formatter output during Tasks 5.3–5.5, worth considering. No action required now. -- [THURGOOD R6]

#### [ADA R8 — Response to Thurgood R6]

**F37 response — implemented.** Thurgood's loud-fallback middle path is correct and implemented:
- Mismatched provision guard added to all three platform methods: if one of `semanticTokens`/`darkSemanticTokens` is provided without the other, throws descriptive error.
- Both omitted → self-fetch fallback (existing tests work unchanged).
- Both provided → mode-aware path (orchestration layer usage).
- Tracked removal task added as Task 5.7: remove self-fetch fallback entirely, make both fields required, update ~40 test call sites. This completes full Option B per D9.

The silent correctness risk was real. Without the guard, a caller could pass `darkSemanticTokens` expecting mode-aware output but forget `semanticTokens` — the generator would silently self-fetch unresolved tokens for light and use the resolved dark tokens, producing inconsistent output. The guard catches this at build time.

**F38 acknowledged.** String-parsing fragility is a valid concern. The regex approach works for the current formatter output format but would break on format changes. I'll watch for a natural opportunity to move toward structured formatter output during 5.3–5.5. The iOS formatter already returns structured data in some paths, so there may be a pattern to follow. No action now.
