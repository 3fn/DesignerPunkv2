# Spec 086 Research Synthesis: Working Thoughts

**Date**: 2026-03-27
**Participants**: Peter, Thurgood
**Status**: In progress — capturing thinking, not conclusions

---

## Two Independent Analyses Produced

- **Thurgood's analysis** (`analysis.md`): 7 findings, prioritized by discoverability impact. Vocabulary mismatch ranked critical.
- **Stacy's analysis** (`analysis-stacy.md`): 6 findings, prioritized by governance impact. Readiness granularity and selection-to-verification gap ranked highest.

Both converged on vocabulary mismatch, Lina's feedback loop gap, experience patterns as high-leverage, and readiness granularity. Stacy surfaced the selection-to-verification gap and MCP metadata review cadence that Thurgood missed.

---

## Peter's Reframings

### Experience patterns may be in the wrong MCP

Agents are using experience patterns as implementation blueprints ("give me the component tree") rather than design thinking tools ("here's how to think about this experience"). The Application MCP is component-oriented — concrete, queryable, implementation-focused. Experience patterns are conceptual — they encode design intent and user experience framing.

**Emerging direction**: Patterns may belong in a Product MCP alongside product-level concerns (screen specifications, user flows, information hierarchy). The Application MCP stays focused on component selection, contracts, composition, tokens. This also addresses Finding 6 (patterns underinvested) by giving them a dedicated home.

**Counter-argument**: Splitting patterns across MCPs adds a routing step. Leonardo currently queries one MCP for both component selection and composition patterns. Mitigated by Agent Directory documentation.

### Platform-specific source access via agent configs, not MCP

Instead of building platform API surfaces into the MCP (high cost, coupling risk), use a two-layer approach:

**Layer 1: Steering doc as universal resource map.** A new steering doc that maps resource types to platform-specific paths — token files, component implementations, generated output. Any agent can look up where platform resources live. This gives cross-domain visibility: Stacy can find iOS and Android implementations for parity comparison, Thurgood can locate platform files for test coverage audits, Leonardo can reference platform paths in screen specs.

This also partially addresses Stacy's parity verification concern. She can't do structured cross-platform comparison through the MCP, but she can find and read both platform files to manually verify behavioral surface parity. At current scale (30 components, primarily single-platform product work), manual comparison using the resource map is sufficient.

**Layer 2: Knowledge base entries for platform agents.** Sparky, Kenya, and Data get indexed knowledge bases pointing to their platform's directories for fast searchable access. Similar to how Ada already has `RosettaTokenSource`. This solves the "80% source diving" problem — the source is still the reference, but it's indexed and searchable rather than requiring manual file navigation.

The two layers serve different needs: the steering doc is for orientation ("where do I find X?"), the knowledge base is for working access ("search this directory for Y"). One doesn't replace the other.

---

## Root Cause Collapse

Peter observed that the 7+6 findings across both analyses may be symptoms of fewer root causes:

| Root Cause | Symptoms (Findings) |
|-----------|---------------------|
| **Feedback loop gap** between metadata authors and consumers | Vocabulary mismatch (T-1), Lina authoring blind (S-3), `contexts` needs controlled vocabulary (T-4) |
| **"What can I actually use today" gap** | Platform implementation gap (T-3), Readiness granularity (T-7/S-4) |
| **"Design intent to verified implementation" gap** | Experience patterns underinvested (T-6/S-5), Selection-to-verification gap (S-1) |

If this collapse holds, the spec addresses three root causes, not seven symptoms. That's a cleaner scope.

---

## Open Questions (Still Thinking)

1. If experience patterns move to a Product MCP, what stays in the Application MCP for composition guidance? Does the Application MCP still need to answer "how do these components work together" or does that become entirely the Product MCP's job?

2. For the platform agent knowledge bases — should we index the entire `src/components/core` tree per platform, or be more targeted (e.g., only `platforms/{platform}/` subdirectories)? Broader indexing gives more context but costs more tokens.

3. The dual maintenance finding (T-5) — does it still matter if we address the feedback loop root cause? If Lina has consumer search terms and a discoverability check step, does the extraction pipeline become unnecessary?

4. Stacy's question about MCP metadata review cadence — is this a new process, or does it fold into existing governance (e.g., part of release checklist, part of spec completion)?

---

## Stacy's Governance Needs — Resolved Positions

### Metadata Review Cadence → Extension of Existing Lessons Learned Process

Leonardo already captures lessons during product work ("MCP returned unexpected results," "component contract didn't cover a real-world interaction"). Stacy already runs a Lessons Synthesis Review that processes accumulated lessons and routes them to system agents.

**The gap**: Stacy's synthesis review doesn't explicitly include a metadata accuracy lens. She reviews process quality, spec structure, and lessons — but "is the Application MCP metadata still accurate?" isn't in her checklist.

**Proposed fix**: Add metadata accuracy review to Stacy's Lessons Synthesis Review scope. One additional lens on data she's already reviewing:
- Do Leonardo's findings reveal stale `whenToUse` entries?
- Are there missing alternatives or incorrect readiness fields?
- Are `purpose` fields failing to match consumer search terms?

This requires a small prompt update for Stacy — one bullet in her Lessons Synthesis Review section. No new process, no new tooling.

### Selection-to-Verification → Role in Feedback Protocol

Rather than building a spec validation tool, add Stacy as a reviewer on product specs with a specific mandate: verify component selection against family selection rules using `get_prop_guidance`. This is a process solution using existing tools.

Escape hatch documentation (intentional deviations from selection guidance) and migration path annotations naturally live in the spec and get checked during Stacy's review. When the Lessons Synthesis Review runs, accumulated escape hatches are checked: "is the proper component now ready for migration?"

### Parity Audit → Enabled by Platform Resource Map

The steering doc resource map (from the platform access section above) gives Stacy paths to find platform implementations for manual comparison. At current scale (30 components, primarily single-platform product work), manual comparison is sufficient. Structured parity tooling is a future investment when multi-platform product work is active.

---

## Two-Part Readiness Model

Current state: single `readiness` string per component (e.g., "development"). Insufficient for the decisions agents need to make.

### Part 1: Technical Readiness (Automatable)

A script scans the filesystem and verifies required artifacts per platform:
- Schema, contracts, types, component-meta — component-level artifacts
- Platform implementation file exists
- Platform tests exist
- Required composition children are present

For platforms where a component is intentionally not supported (e.g., a web-only component, or a component that uses native platform equivalents), the absence is documented as `not-applicable` with a reason — distinct from `not-started` (we intend to build it).

### Part 2: Human-Reviewed Readiness (Manual Gate)

Has someone confirmed the component appears and functions as expected? This is a quality gate that no script can verify — visual correctness, interaction feel, accessibility behavior in practice.

### Combined Model

```yaml
readiness:
  contract: finalized | draft
  web:
    technical: complete | partial | not-started | not-applicable
    reviewed: true | false
    status: production-ready | development | scaffold | not-started | not-applicable
    reason: "..." # only when not-applicable
  ios:
    technical: complete | partial | not-started | not-applicable
    reviewed: true | false
    status: production-ready | development | scaffold | not-started | not-applicable
    reason: "..."
  android:
    technical: complete | partial | not-started | not-applicable
    reviewed: true | false
    status: production-ready | development | scaffold | not-started | not-applicable
    reason: "..."
```

**Status derivation rules:**
- `not-applicable` → intentional absence, documented reason
- `not-started` → no platform artifacts exist
- `scaffold` → platform file exists, no tests, not reviewed
- `development` → technical artifacts present, not human-reviewed
- `production-ready` → technical complete + human reviewed

The technical readiness scan runs automatically (build step or standalone command). Human review is an explicit promotion that requires someone to mark `reviewed: true`.

---

## Open Questions (Still Thinking)

1. If experience patterns move to a Product MCP, what stays in the Application MCP for composition guidance? Does the Application MCP still need to answer "how do these components work together" or does that become entirely the Product MCP's job?

2. For the platform agent knowledge bases — should we index the entire `src/components/core` tree per platform, or be more targeted (e.g., only `platforms/{platform}/` subdirectories)? Broader indexing gives more context but costs more tokens.

3. ~~The dual maintenance finding (T-5) — does it still matter if we address the feedback loop root cause? If Lina has consumer search terms and a discoverability check step, does the extraction pipeline become unnecessary?~~ **Resolved: extraction is needed. Decision is between Option B and C. See below.**

4. The readiness model adds schema complexity. Does the Application MCP indexer need changes to read the new structure, or can it derive `status` from the existing filesystem scan?

---

## Resolved: Platform Knowledge Base Scope

Three options identified. Our lean is the middle ground, but all three captured for agent feedback.

**Option Broad**: Index all of `src/components/core` for each platform agent. They get everything — types, tokens, schemas, contracts, all platform implementations, tests.
- Pro: Maximum context, no gaps
- Con: Wastes context on files they rarely touch (other platforms' code, schemas, contracts)

**Option Targeted**: Index only `src/components/core/*/platforms/{their-platform}/`. They get their platform's implementation files and nothing else.
- Pro: Minimal context cost, focused on what they need most
- Con: Too narrow — platform agents reading implementation files need access to shared `types.ts` and `tokens.ts` to understand the API they're implementing against

**Option Middle Ground** (recommended): Index `src/components/core/*/platforms/{their-platform}/` plus `src/components/core/*/types.ts` and `src/components/core/*/tokens.ts`. Platform code plus shared type definitions and token maps.
- Pro: Platform agents get their implementation files and the contract they're implementing against
- Con: Slightly more complex config than targeted

Pending agent feedback to validate the recommendation.

---

## Resolved: Dual Maintenance — Extraction Needed, B vs C

Manual sync (Option A) is not sustainable with 3 new components incoming and a growing catalog. The decision is between:

### Option B: Hybrid Extraction (Duplicated Fields Only)

Derive `usage` and `alternatives` from family docs (they're already there as prose). Lina hand-authors `purpose` and `contexts` directly in meta files (the original, agent-optimized fields).

**Pro:**
- `purpose` stays agent-optimized — verb-first, keyword-rich, ~30 words. Different writing style than family doc prose.
- `contexts` is a tag list, structurally different from anything in family docs. Stays where it naturally fits.
- Smaller extraction scope — script only needs to parse usage guidance and selection tables.

**Con:**
- Still two authoring locations for a single component's metadata. `purpose` and `contexts` in meta files, everything else derived from family docs.
- Lina still needs to remember to update `purpose` and `contexts` separately when a component changes.

### Option C: Full Single Source of Truth

All fields — including `purpose` and `contexts` — authored in family docs as structured metadata blocks. Extraction script generates the complete meta file.

**Pro:**
- True single source of truth. No ambiguity about where to author anything.
- Family doc ballot measure governance automatically covers all meta content.
- Eliminates all dual maintenance.

**Con:**
- `purpose` and `contexts` must be clearly delineated structured blocks in family docs, not woven into prose. Adds a new section format to family docs.
- Risk that family doc prose context influences `purpose` phrasing away from agent-optimized search terms.

**Mitigating the Con:** Research showed that current `purpose` fields are poorly optimized because Lina is authoring blind. Moving `purpose` into family docs with Leonardo's search terms as a reference would likely *improve* quality. For `contexts`, a controlled vocabulary solves the quality problem regardless of authoring location.

**Required format for C:**
```markdown
### Badge-Count-Base — Metadata
- **Purpose**: Display a numeric count indicator for unread notifications or item quantities in a compact badge
- **Contexts**: navigation-tabs, list-items, icon-overlays, app-bars
```

Clearly separated from prose, extractable, authored alongside the rest of the component's documentation.

**Our lean**: C, with the structured block format. But pending agent feedback — particularly Lina (authoring experience) and Leonardo (does the purpose quality hold up?).

---

## Resolved: MCP Scope Split (Application vs Product)

### The Split

**Application MCP** leans into components and component patterns — how DesignerPunk components work, compose, and relate to each other. Component-specific context.

**Product MCP** leans into experiences and experience patterns — how screens are designed, information hierarchy, user flow guidance. Product-specific context.

This is a refinement of Spec 081's direction. The Application MCP answers "what components exist and how do they work together?" The Product MCP answers "how do I design this type of screen?"

### What Moves, What Stays

| Content | Current Home | Future Home | Rationale |
|---------|-------------|-------------|-----------|
| Component metadata | Application MCP | Application MCP | Core component catalog — stays |
| Component composition rules | Application MCP | Application MCP | Structural validation — stays |
| `validate_assembly` | Application MCP | Application MCP | Component-level validation — stays |
| Token references | Application MCP | Application MCP | Token system — stays |
| Experience patterns (screen-level) | Application MCP | Product MCP | Experience framing, not component catalog |
| Layout templates | Application MCP | Product MCP (or shared) | Screen-level layout — product concern |
| Component selection guidance | Application MCP | Both (Application provides data, Product consumes) | Selection rules live with components, consumed by product patterns |

### Cross-MCP Dependency

Product MCP references components from the Application MCP. When a Product MCP experience pattern says "use Container-Card-Base for stat cards," it needs to check the Application MCP for:
- Does the component exist?
- Is it production-ready on the target platform?
- What are its composition constraints?

This makes readiness data a critical bridge between the two MCPs.

### Three Options Considered

**P1: Patterns stay in Application MCP.** Simple, but patterns remain underinvested in a component-focused MCP.

**P2: Patterns move entirely to Product MCP.** Clean separation, but creates cross-MCP dependency or data duplication.

**P3: Split by concern (selected).** Application MCP keeps component assembly data. Product MCP gets experience framing. A product pattern references component assemblies. Two clearly different questions: "what should this screen accomplish?" vs "what components implement it?"

---

## Resolved: Readiness Model — Derive at Index Time (R2)

### Why R2 Over R1

The MCP scope split makes readiness a cross-MCP data point — the Product MCP consumes readiness from the Application MCP when recommending experience patterns. Cross-MCP data must be reliable. Derived readiness (R2) is more reliable than manually maintained readiness (R1) because it reflects the actual codebase state at index time.

### How It Works

**Technical readiness (Part 1 — automated):** The Application MCP indexer scans the filesystem at index time:
- Component-level artifacts present? (schema, contracts, types, component-meta)
- Platform implementation file exists?
- Platform tests exist?
- `not-applicable` marker present? (intentional absence with documented reason)

**Human-reviewed readiness (Part 2 — manual flag):** A one-time flag per platform per component, set when someone confirms the component appears and functions as expected. Could be a field in the schema, a marker file, or a section in the component-meta.

**Status derivation at index time:**
- `not-applicable` marker exists → `not-applicable` (with reason)
- No platform directory, no marker → `not-started`
- Platform file exists, no tests, not reviewed → `scaffold`
- Technical artifacts present, not reviewed → `development`
- Technical complete + reviewed flag → `production-ready`

### Why This Reinforces the MCP Split

When Leonardo queries the Product MCP for a dashboard experience pattern and it recommends Container-Card-Base, the Product MCP checks the Application MCP: "is Container-Card-Base production-ready on web?" If readiness is derived from the filesystem, it's accurate by construction — no stale meta file risk.

### Trade-off

R2 makes the Application MCP indexer more complex — it scans directory structures and derives state, not just reads YAML. That's a meaningful implementation change. But it's a one-time investment that eliminates ongoing maintenance burden and ensures cross-MCP readiness data is always current.

### Three Options Considered

**R1: Change meta schema, update indexer.** Indexer reads nested readiness from meta file. Simple indexer, but readiness is only as current as the last manual update.

**R2: Derive at index time (selected).** Indexer scans filesystem for artifact presence, reads reviewed flag. More complex indexer, but readiness is always accurate.

**Hybrid**: Meta file contains the human-judgment fields (reviewed, not-applicable reason). Indexer derives technical readiness from filesystem and merges with meta file fields. Best of both — but most complex implementation.

Our lean is R2, acknowledging the hybrid may be the practical implementation (human flags need to live somewhere persistent).

---

## Remaining Open Questions

1. The readiness model's `reviewed` flag and `not-applicable` reason need a persistent home. Options: field in component-meta.yaml, field in schema.yaml, or a separate lightweight marker file. Needs design decision.

2. The MCP scope split (P3) needs validation against Spec 081's current direction. Does the Product MCP design already accommodate experience patterns, or does this require a scope revision?

---

## Next Steps

- Get agent feedback on resolved positions (knowledge base scope, B vs C extraction, MCP split, readiness model)
- Validate MCP split against Spec 081
- Rewrite design outline based on synthesis conclusions
- Proceed to requirements phase

