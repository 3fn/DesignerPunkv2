# Stemma Catalog Readiness Audit

**Date**: 2026-02-24
**Purpose**: Audit the current Stemma component catalog for diversity and coverage sufficiency to support agentic UI schema formalization
**Organization**: spec-guide
**Scope**: XXX-stemma-catalog-readiness-audit
**Status**: Draft — Pending Thurgood review

---

## Problem Statement

Before formalizing a component metadata schema for the agentic UI application MCP, we need to understand whether the current Stemma catalog has sufficient behavioral contract diversity to validate the schema design. The risk of proceeding without this audit:

1. **Schema designed around incomplete patterns** — If the catalog only exercises a subset of behavioral contracts, the schema may need structural rethinking when new component families are added
2. **False confidence in coverage** — We may believe we have representative coverage across the 11 Stemma families when gaps exist
3. **Premature formalization** — Locking a schema before the catalog is representative enough creates maintenance overhead

The audit is not about quantity of components. It's about whether the components we have exercise enough *different* behavioral contract patterns that the schema design will hold as the catalog grows.

---

## Audit Objectives

1. **Map existing components against the 11 Stemma families** — Identify which families have implementations and which are placeholders
2. **Inventory behavioral contracts per component** — Which contracts (`focusable`, `validatable`, `float-label`, `error-state`, etc.) are represented, and how many times
3. **Identify contract diversity gaps** — Are there behavioral patterns that no current component exercises?
4. **Assess schema readiness** — Based on findings, make a recommendation: proceed with schema formalization, identify what additional components are needed first, and/or identify components that are out of Stemma alignment
5. **Flag for domain agents** — Surface any test coverage gaps for Lina (component behavioral contract tests) and Ada (token compliance tests) as a byproduct

---

## Scope

### In Scope
- All components in `src/components/` across web, iOS, and Android platform implementations
- Stemma behavioral contract coverage per component
- Cross-family diversity assessment
- Schema readiness recommendation

### Out of Scope
- Token mathematical validation (Ada's domain)
- Writing new behavioral contract tests (Lina's domain)
- Fixing identified gaps (audit produces findings, not fixes)
- Performance characteristics of existing components

---

## The 11 Stemma Families (Reference)

Per the Rosetta-Stemma-Systems-Overview:

| # | Family | Status |
|---|--------|--------|
| 1 | Buttons | Active |
| 2 | Form Inputs | Active |
| 3 | Containers | Active |
| 4 | Icons | Active |
| 5 | Modals | Placeholder |
| 6 | Avatars | Active |
| 7 | Badges & Tags | Active |
| 8 | Data Displays | Placeholder |
| 9 | Dividers | Placeholder |
| 10 | Loading | Placeholder |
| 11 | Navigation | Placeholder |

The audit should confirm this status and assess whether the active families provide sufficient contract diversity and Stemma alignment.

---

## Known Behavioral Contracts (Reference)

From Stemma system documentation, known contracts include:
- `focusable` — keyboard and focus management
- `validatable` — validation state handling
- `float-label` — floating label interaction pattern
- `error-state` — error display and recovery
- (others to be confirmed during audit)

A key audit question: are there behavioral contract *types* that none of the current active components exercise?

---

## Proposed Audit Approach

### Phase 1: Catalog Inventory
- Enumerate all implemented components across all platforms
- Map each to its Stemma family
- Confirm which families are active vs. placeholder

### Phase 2: Behavioral Contract Mapping
- For each active component, identify which behavioral contracts it participates in
- Build a contract coverage matrix: components × contracts
- Identify contracts with zero or single coverage

### Phase 3: Diversity Assessment
- Evaluate whether the contract coverage matrix is diverse enough to validate a schema design
- Identify patterns that would be structurally different from anything currently represented
- Assess whether placeholder families would introduce new contract types not yet covered

### Phase 4: Schema Readiness Recommendation
- Based on findings: proceed / align existing components first / add specific components first / defer
- If aligning or deferring: specify exactly what's needed and why
- Counter-argument: articulate the case for proceeding despite gaps

---

## Key Questions to Answer

1. How many of the 11 Stemma families have at least one implemented component?
2. How many distinct behavioral contracts are currently represented across the catalog?
3. Are there behavioral contract types that the placeholder families would introduce that no active component currently exercises?
4. Is the current diversity sufficient to validate a schema design, or would the schema need structural revision when placeholder families are implemented?
5. What is the test coverage status for behavioral contracts across active components?
6. Do active components consistently implement behavioral contracts using the standard contracts library format, or are there divergent contract systems that need reconciliation?

---

## Thurgood Consultation Notes

This audit is squarely in Thurgood's domain:
- Audit methodology
- Coverage analysis
- Cross-referencing what *should* exist against what *does* exist
- Flagging gaps to appropriate domain agents (Lina for component tests, Ada for token tests)

Thurgood should be consulted before this design outline is formalized into a full spec. His input on audit methodology and scope will shape the tasks document.

Specifically, Thurgood should weigh in on:
- Whether the proposed audit phases are the right structure
- What evidence gathering approach is most efficient
- How to frame the schema readiness recommendation criteria
- Whether this warrants a full spec or can be executed as a lightweight audit report

---

## Lina Consultation Response: Behavioral Contract System Divergence

**Date**: 2026-02-25
**Status**: Complete — findings and recommendations below

During Thurgood's pre-audit review, a behavioral contract documentation divergence was identified that affects audit methodology and schema readiness assessment. Lina's input was requested before the audit is formalized. The following is Lina's analysis based on a full review of contract formats across all active component families (Buttons, Form Inputs, Containers, Icons, Badges, Chips, Progress).

### Original Questions and Responses

**Q1: Was the `contracts.yaml` format intentional or organic?**

Organic. The standard contracts library (Component-Schema-Format.md) was written for abstract, reusable behavioral capabilities — `focusable`, `pressable`, `hoverable`. When Badge and Progress families were built, the minimal library format wasn't expressive enough for component-specific behavioral guarantees, so a richer format emerged naturally. The `contracts.yaml` files weren't designed as a replacement — they were a practical response to needing more detail than the library format could express.

**Q2: Is the standard contracts library canonical, or has it been superseded?**

Neither. They serve different purposes that were never reconciled:
- The **standard library** defines abstract behavioral capabilities (like interfaces): "what behavioral categories does this component participate in?"
- The **component-level contracts** define concrete behavioral guarantees specific to a component: "what exactly does this component promise to do?"

These are different levels of abstraction that should be connected but currently aren't. Whether the uniform contract system needs both levels or just one is a design decision the audit findings should inform.

**Q3: How much effort would alignment take?**

Closer to "rethink how contracts are wired" than "update YAML naming." The naming divergence (`hover_state` vs `hoverable`) is trivial. The structural divergence is harder — the standard library has 16 abstract contracts across 5 categories, while component-level files have component-specific contracts that don't map 1:1 to those abstractions (e.g., `displays_count` has no equivalent in the standard library). Estimated effort: 2-3 days design work for the relationship model, 1-2 days to migrate existing components if two-tier; ~1.5 days total if single-tier with consistent format and naming convention.

**Q4: Are there contract patterns in older components the standard library doesn't capture?**

Yes. Button-CTA's `focus_ring` is a specific implementation detail of `focusable` that the library doesn't distinguish. `loading_state` maps to `supports_loading_state` but with inconsistent naming. The older components have patterns the library doesn't fully capture, but it's more about granularity than missing categories.

### Technical Findings

#### Finding 1: Contract Category Taxonomy Is Wider Than the Standard Library

The standard library defines 5 categories. Across actual components, 11 categories are in use:

| Category | Components Using It | In Standard Library? |
|---|---|---|
| interaction | Button-CTA, Chip-Base | ✅ |
| validation | Stepper-Base, standard library | ✅ |
| animation | standard library | ✅ |
| state | Button-CTA, Stepper-Base, Pagination-Base | ✅ |
| accessibility | all families | ✅ |
| content | Badge-Count-Base | ❌ |
| shape | Badge-Count-Base | ❌ |
| composition | Stepper-Base, Pagination-Base | ❌ |
| performance | Pagination-Base | ❌ |
| visual | Node-Base, Connector-Base | ❌ |
| layout | Connector-Base | ❌ |

**Audit implication:** The audit cannot use the standard library's 5 categories as matrix columns. The real taxonomy must be discovered from the components themselves.

#### Finding 2: Format Divergence Is Less Severe Than Initially Appeared

Four formats exist, but the real split is two:

1. **Standard library** (Component-Schema-Format.md): minimal format, abstract contracts (`name`, `description`, `platforms`, `required`, `category`, `verification`)
2. **Everything else** (inline schemas, `contracts.yaml` files, Chip schemas): rich format with `category`, `description`, `behavior`, `wcag`, `platforms`, `validation`, and optionally `test_approach`

The `contracts.yaml` as a separate file vs. inline in the schema is an organizational choice, not a format divergence. The rich format is the de facto standard — the standard library is the outlier.

#### Finding 3: Progress Family Introduces Structurally Different Contract Patterns

Two patterns unique to Progress that stress-test any schema design:

- **Composition contracts** (`composes_node_and_connector`, `composes_node_base_only`): Describe how a component assembles other components. No other family has this. The schema must represent component-to-component relationships, not just component-to-behavior relationships.
- **Performance contracts** (`virtualizes_large_sets`): Runtime optimization guarantees — fundamentally different from visual or interaction contracts. Placeholder families (especially Data Displays) will almost certainly need similar contracts.

#### Finding 4: Gap Between Documented and Tested Contracts

- **Form Inputs**: Most mature test coverage via `form-inputs-contracts.test.ts`, but tests use regex pattern matching against source code (presence of implementation artifacts, not behavioral correctness).
- **Badge/Progress**: Most mature contract documentation with `test_approach` fields describing behavioral test strategies, but no equivalent test files found.
- **Chips**: Thorough inline contract documentation, no dedicated contract test files found.

#### Finding 5: Intentional Exclusions Are Not Formally Captured

Chip-Base, Chip-Filter, and Chip-Input explicitly state "NO DISABLED STATES — if an action is unavailable, the component should not be rendered." Button-CTA has a `disabled_state` contract. The standard library has `supports_disabled_state`. The contract system and schema need to distinguish between:
- Component implements a contract ✅
- Component should implement a contract but doesn't (gap) ⚠️
- Component intentionally does not implement a contract (design decision) 🚫

### Recommendation: Uniform Contract System

A uniform behavioral contract system is warranted and should be part of Stemma (contracts *are* the behavioral layer of the component system). However, it should be designed *after* the audit, using audit findings as input. The audit should produce a **contract system design brief** as a deliverable — not a full spec, but enough to capture the full taxonomy, identify the format convergence point, and outline what a uniform system would look like.

Recommended sequencing:
1. **Audit** (this spec) — discover the full landscape
2. **Uniform contract system design** (post-audit) — define taxonomy, format, hierarchy, exclusion representation
3. **Migration** (post-design) — align existing components to the uniform system
4. **Agentic UI schema** (parallel with or after migration) — consume uniform contracts programmatically

The contract system should lead the schema by a half-step. Contracts serve developers and platforms; the schema serves the agentic UI. Designing contracts to serve the schema risks optimizing for machine consumption at the expense of human utility.

---

## Connection to Agentic UI Strategy

This audit is a prerequisite gate for the agentic UI application MCP work documented in `.kiro/docs/agentic-ui-strategy.md`. Specifically, it addresses Open Question 1:

> "How complete does the Stemma catalog need to be before the schema is worth formalizing?"

The audit reframes that question from "how complete" (quantity) to "how diverse" (behavioral contract coverage) — which is the more meaningful threshold for schema design validity.

---

## Success Criteria

1. **Catalog inventory complete** — Every component mapped to its Stemma family with platform coverage noted
2. **Contract coverage matrix produced** — Components × behavioral contracts coverage matrix
3. **Contract taxonomy discovered** — Full set of contract categories identified from actual components (not assumed from standard library)
4. **Inheritance map produced** — How contracts flow through component hierarchies (e.g., Chip-Base → Chip-Filter, Badge-Count-Base → Badge-Count-Notification), including overrides and extensions
5. **Intentional exclusion inventory** — Design decisions that look like gaps but aren't (e.g., Chips' "no disabled states" philosophy), distinguished from actual coverage gaps
6. **Platform parity assessment** — Declared vs. actual platform coverage per contract
7. **Test coverage overlay** — Which contracts are tested (and how), which are documented-only
8. **Diversity gaps identified** — Specific contracts or patterns not yet represented, including patterns that placeholder families would introduce
9. **Contract system design brief produced** — Short document capturing the full taxonomy, format convergence point, and outline of what a uniform contract system would look like (not a full spec — a starting point for post-audit design work)
10. **Schema readiness recommendation made** — Clear proceed/align/defer/condition recommendation with rationale and counter-argument
11. **Domain gaps flagged** — Any test coverage gaps surfaced for Lina (component behavioral contracts) and Ada (token compliance)

---

## Downstream Dependencies

This audit is the foundation for a dependency chain. The following downstream systems depend on specific audit findings, and the audit should be designed to produce evidence that satisfies these dependencies.

```
Uniform Contract System ← depends on → Audit findings
Agentic UI Schema       ← depends on → Uniform Contract System
Agentic UI MCP          ← depends on → Agentic UI Schema
```

### Dependency 1: Contract Vocabulary Completeness → Uniform Contract System

The uniform contract system can't define its taxonomy until the audit has mapped the full landscape. Lina's analysis identified 11 contract categories in use (vs. 5 in the standard library). The audit must produce a complete inventory of every distinct behavioral contract pattern — not just those matching the standard library's 16 named contracts.

**Audit deliverable that satisfies this:** Contract taxonomy (Success Criteria #3) and Contract coverage matrix (#2).

### Dependency 2: Abstract vs. Specific Contract Relationship → Uniform Contract System Structure

The standard library defines abstract contracts (`focusable`, `pressable`). Components define specific contracts (`keyboard_focusable`, `press_interaction`, `non_interactive`). The audit needs to determine whether these are genuinely two levels of the same system (abstract interfaces implemented by specific contracts) or whether the abstract level is vestigial. This determines whether the uniform system is hierarchical or flat.

**Audit deliverable that satisfies this:** Contract taxonomy (#3) and Inheritance map (#4).

### Dependency 3: Contract Propagation Through Inheritance → Agentic UI Schema

Chip-Filter says "inherits all contracts from Chip-Base" but doesn't explicitly list which contracts it inherits vs. overrides vs. extends. The schema needs to represent inheritance relationships, and it can't do that reliably without understanding how inheritance actually works in practice vs. how it's documented.

**Audit deliverable that satisfies this:** Inheritance map (#4).

### Dependency 4: Intentional Exclusions vs. Gaps → Uniform Contract System + Schema

The Chip family's "no disabled states" philosophy is a design decision, not a gap. The uniform contract system and schema both need to distinguish: implements ✅, gap ⚠️, intentional exclusion 🚫. If the audit only tracks presence/absence, downstream systems will treat design decisions as bugs.

**Audit deliverable that satisfies this:** Intentional exclusion inventory (#5).

### Dependency 5: Platform Parity Validation → Agentic UI Schema

Contracts declare platform support (`platforms: [web, ios, android]`), but declared support may not match actual implementation. The schema's platform parity model depends on the audit validating declared vs. actual coverage.

**Audit deliverable that satisfies this:** Platform parity assessment (#6).

### Dependency 6: Test Coverage Confidence → Agentic UI MCP

The agentic UI MCP will expose contracts as capabilities. If a contract is documented but untested, the MCP is making promises the system can't verify. The audit needs to surface which contracts are verified vs. aspirational.

**Audit deliverable that satisfies this:** Test coverage overlay (#7).

---

## Counter-Arguments to Consider

1. **"Just start the schema and iterate"** — Valid. The schema can evolve. The cost of premature formalization may be lower than the cost of waiting. Thurgood should weigh in on this trade-off.
2. **"Placeholder families don't matter yet"** — If placeholder families would introduce structurally different contract types, the schema needs to account for them even before those components exist. If they wouldn't, the audit finding supports proceeding now.
3. **"This is over-scoped for a prerequisite"** — Fair. Could be scoped down to a lightweight checklist rather than a full audit. Thurgood's input on appropriate scope is valuable here.
4. **"Alignment is a separate concern from schema readiness"** — The schema design could itself define the unified contract vocabulary, and existing components could be migrated to it afterward. In that framing, alignment happens *during* schema design rather than as a prerequisite. The risk: schema design becomes significantly harder if it's also doing reconciliation work, and the schema may encode assumptions from whichever contract format the designer happens to look at first.

---

## Steering Documentation Update

A byproduct of this audit is that findings should inform the integration methodology steering doc. Specifically:

- If the audit concludes the catalog is ready for schema formalization, update `.kiro/steering/Process-Integration-Methodology.md` to note that the catalog readiness threshold was validated and what criteria were used
- If the audit identifies gaps that delay schema formalization, document the gap criteria so future audits have a clear bar to clear

This update should be proposed to Peter following the ballot measure model (propose → present with counter-argument → vote → apply).

---

## Related Documentation

- `.kiro/docs/agentic-ui-strategy.md` — Strategic context for why this audit matters; this audit is the first next step in that strategy
- `.kiro/steering/Process-Integration-Methodology.md` — Integration methodology this audit feeds into; audit findings inform schema readiness decision
- `.kiro/steering/Rosetta-Stemma-Systems-Overview.md` — Stemma family reference
- `.kiro/steering/Component-Quick-Reference.md` — Component routing table
- `.kiro/agents/thurgood-prompt.md` — Thurgood's audit methodology and domain scope
