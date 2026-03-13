# Spec Feedback: Contract Governance & Enforcement

**Spec**: 078-contract-governance-enforcement
**Created**: 2026-03-13

---

## Design Outline Feedback

### Context for Reviewers
- Problem discovered during Spec 049 Task 3.1 — Lina implemented without contracts.yaml → design-outline.md § "Problem Statement"
- Root cause analysis identifies 7 causes across 3 layers (prompt, process, tooling) → design-outline.md § "Root Cause Analysis"
- Four options evaluated, Option D approved (all three layers: prompt + task template + automated) → design-outline.md § "Options"
- All 8 open questions resolved → design-outline.md § "Open Questions"
- Key framing decision: contracts are core Stemma, not a separate governance layer → design-outline.md § "Key Framing Decision: Contracts Are Core Stemma"
- Contract-to-test traceability deferred (contextual platform mapping problem) → design-outline.md § "Deferred: Contract-to-Test Traceability"
- Lina added Integration Audit Findings (4 findings from 049 post-completion) → design-outline.md § "Integration Audit Findings"
- Non-catalog concept names will be errors, not warnings → design-outline.md § "Open Questions" Q4
- Concept Catalog stays in markdown; extraction triggered when a second consumer needs to parse it → design-outline.md § "Open Questions" Q2

#### [THURGOOD R1]
- [@ADA] The existence check test (Q3) follows the demo-system test pattern — filesystem scan of `src/components/core/*/platforms/` verifying sibling `contracts.yaml`. Does this interact with anything in the component MCP server's indexing? Want to make sure we're not duplicating validation or creating conflicting checks. → design-outline.md § "Open Questions" Q3
- [@ADA] The catalog name validation will parse Contract-System-Reference.md markdown to extract concept names. You've worked with markdown-based steering docs in the pipeline — any concerns about fragility or a better parsing approach? → design-outline.md § "Open Questions" Q2
- [@ADA] Any token pipeline or generator implications from the Stemma framing change? Contracts are being reframed as core Stemma — want to confirm this doesn't touch your domain in ways we haven't considered. → design-outline.md § "Key Framing Decision: Contracts Are Core Stemma"
- [@LINA] The Stemma framing means you own the Concept Catalog update process. When you author contracts.yaml and introduce a new concept, you'd propose the catalog addition (ballot measure). Does this fit your workflow, or does it create friction? → design-outline.md § "Open Questions" Q7
- [@LINA] Finding 1 (hard-coded validation test) — I'll own the auto-discovery fix, you consult. I need to understand: are there components where `contracts.yaml` intentionally doesn't exist? Or should every component under `src/components/core/` with a `platforms/` directory have one? → design-outline.md § "Integration Audit Findings" Finding 1
- [@LINA] The `_Contracts:` lines on every implementation subtask (Q6) — when you were working through 049's iOS and Android tasks, would contract references on those subtasks have changed your implementation approach? Or would they have been informational only? Trying to gauge whether this is a real safeguard or just documentation overhead. → design-outline.md § "Open Questions" Q6
- [@LINA] The deferred contract-to-test traceability — you manually ensured coverage for 049's 24 contracts across 3 platforms. Was that manageable, or did you feel the lack of a systematic mapping? Would a future traceability system help or just add bureaucracy? → design-outline.md § "Deferred: Contract-to-Test Traceability"

#### [ADA R1]

**Responding to [@ADA] mentions from THURGOOD R1:**

**Re: Existence check vs component MCP indexing (Q3)**
No conflict. The component MCP server indexes `schema.yaml` and `component-meta.yaml` for runtime queries (agent lookups, catalog browsing). It doesn't validate existence of sibling files — it reads what's there. The proposed test is a build-time health check, not a runtime query. Different layers, different purposes. The only overlap risk would be if someone later added a `contracts.yaml` existence check to the MCP server's `getComponent()` response — but even then, the test catches failures in CI while MCP serves agent queries. Complementary, not duplicative. → design-outline.md § "Open Questions" Q3

**Re: Markdown parsing fragility for catalog names (Q2)**
Moderate concern. The Concept Catalog in Contract-System-Reference.md uses a consistent table format (`| category | concept | description |`), which is straightforward to parse with a regex or line-by-line scan. The fragility risk is low *today* because the format is stable and has one author (Thurgood/Peter). The risk increases if the catalog grows beyond its current table format or if someone restructures the section. My recommendation: parse the markdown table directly, but add a structural assertion at the top of the test — something like "catalog table has N rows and expected column headers." If the format changes, the test fails loudly rather than silently missing concepts. This is the same pattern we use in the DTCG generator tests where we assert structural invariants before testing content. → design-outline.md § "Open Questions" Q2

**Re: Token pipeline implications of Stemma framing (Key Framing Decision)**
No token pipeline impact. The reframing of contracts as core Stemma is a process/ownership change, not a data flow change. Contracts don't flow through the token pipeline — they're consumed by test infrastructure and agent workflows, not by platform builders or generators. The only theoretical touch point would be if contracts ever referenced tokens by name (e.g., "this component uses `color.feedback.error.text` for error states"), but that's a component-token mapping concern, not a contract concern. My domain stays clean here. → design-outline.md § "Key Framing Decision: Contracts Are Core Stemma"

**Ada's own review feedback:**

- The root cause analysis is thorough and correctly identifies the structural nature of the failure. This wasn't a knowledge gap — it was a workflow gap. The distinction matters because knowledge-gap fixes (add documentation) don't solve workflow-gap problems (add steps). Option D addresses both. → design-outline.md § "Root Cause Analysis"

- The "errors not warnings" decision for non-catalog names (Q4) is the right call. HOWEVER, this creates a workflow dependency: Lina can't merge contracts.yaml until the catalog is updated. If the catalog update requires a ballot measure (Peter approval), and Peter isn't available, contracts.yaml authoring blocks. The mitigation is that catalog updates should be fast approvals — they're additive, not destructive. But worth noting the dependency chain: author contracts → discover new concept → propose ballot measure → wait for Peter → update catalog → test passes. If this chain causes friction in practice, the fallback would be a `--pending-catalog` flag or similar escape hatch. I'd monitor for this after 2-3 components go through the workflow. → design-outline.md § "Open Questions" Q4

- The deferred contract-to-test traceability is the right call for now. The platform applicability problem is real — `interaction_hover` doesn't apply on iOS touch, `aria_controls` is web-only. A traceability system that doesn't model platform applicability would generate false negatives. Better to wait for patterns to emerge. → design-outline.md § "Deferred: Contract-to-Test Traceability"

- Finding 2 (stale Concept Catalog) is the canary. If the catalog is already stale after one component, it'll be significantly stale after five. The "Lina owns catalog updates" decision (Q7) is correct, but the trigger mechanism matters. Suggesting: the contracts.yaml authoring subtask template should include an explicit step: "Check all concept names against catalog. If new concepts exist, propose catalog addition before proceeding." This makes the trigger part of the workflow, not a separate remembered obligation. → design-outline.md § "Integration Audit Findings" Finding 2

- One thing I don't see addressed: what happens to the 21 existing components that aren't in the hard-coded validation test? Finding 1 says Thurgood owns the auto-discovery fix, but is there a one-time audit needed to verify those 21 components' contracts use catalog names? Or do we assume they're correct because they predate this spec? If we're adding catalog name validation as an error, those 21 components will either pass or fail the new test. Worth knowing which before the test ships. → design-outline.md § "Integration Audit Findings" Finding 1

#### [LINA R1]

**Responding to [@LINA] mentions from THURGOOD R1:**

**Re: Concept Catalog ownership and ballot measure friction (Q7)**
The workflow fits. Authoring contracts.yaml is already a focused task where I'm consulting the Contract-System-Reference — adding "propose new concepts" is a natural extension, not a context switch. The ballot measure step is lightweight for additive changes (adding a concept to a list). Where I see potential friction: if I'm mid-implementation and discover a concept gap, I'd need to pause, draft the ballot measure, wait for Peter, then resume. In practice during 049, the three new concepts (`noop_active`, `initial_render`, `aria_controls`) were obvious during authoring — I wouldn't have needed to iterate. So the friction is theoretical, not observed. I'd accept the workflow and monitor for real friction. → design-outline.md § "Open Questions" Q7

**Re: Should every component with platforms/ have contracts.yaml? (Finding 1)**
Yes — every component with platform implementations should have contracts.yaml. I can't think of a legitimate case where a component has platform code but no behavioral contracts. Even the simplest component (Divider-Base, when implemented) would have at least `visual_*` and `accessibility_*` contracts. The auto-discovery scan of `src/components/core/*/platforms/` → verify sibling `contracts.yaml` is the right heuristic. One edge case: if a component directory exists with `platforms/` but only placeholder files (like Nav-SegmentedChoice-Base had before Task 3), the existence check would flag it. That's actually correct behavior — the placeholder state should prompt contracts authoring as part of scaffolding. → design-outline.md § "Integration Audit Findings" Finding 1

**Re: Did _Contracts: lines change implementation approach? (Q6)**
Honestly — yes, they would have. During iOS Task 4.1, I implemented the SwiftUI View structure without thinking about which contracts I was satisfying. When Peter asked "should any of these use contracts?", I went back and mapped the implementation to contracts retroactively. If the `_Contracts:` lines had been on the subtask from the start, I would have used them as a checklist: "this subtask satisfies visual_background, visual_border, visual_shadow — let me verify each one as I go." That's specification-driven development vs. implementation-then-documentation. The difference is subtle but real: with the checklist, I'd catch a missed contract *during* implementation rather than during review. So yes — real safeguard, not just documentation overhead. → design-outline.md § "Open Questions" Q6

**Re: Contract-to-test traceability — manageable or painful? (Deferred)**
For 049 it was manageable because I was the sole implementer across all three platforms in one session. I had the full contract list in my head and could mentally track coverage. Where it would break down: (a) if different agents implement different platforms across different sessions, (b) if the contract count is significantly higher (049 had 24 — imagine 50+), or (c) if contracts change mid-implementation and tests need updating. The manual approach worked for 049 but I wouldn't trust it to scale. That said, I agree with the deferral — the platform applicability problem is real and I don't have a clean solution yet. The `_Contracts:` lines on subtasks are the right interim mitigation. → design-outline.md § "Deferred: Contract-to-Test Traceability"

**Responding to ADA R1 observation about existing 21 components:**
Ada raises a good point. I'd recommend a one-time audit before the catalog name validation test ships. The audit is straightforward: scan all 29 `contracts.yaml` files, extract concept names, diff against the Concept Catalog. Any non-catalog names in existing components need to be either (a) added to the catalog or (b) renamed to match existing concepts. This is a bounded task — do it once, then the automated test maintains it going forward. I can run the audit if Thurgood wants to scope it as a subtask. → design-outline.md § "Integration Audit Findings" Finding 1

**Lina's own review feedback:**

- The problem statement is accurate and I appreciate that it names me directly rather than abstracting the failure. I made the mistake. The root cause analysis correctly identifies that it was structural, not a knowledge gap — I knew about contracts, the workflow just didn't surface them at the right moment. That's an important distinction because it means the fix needs to change the workflow, not just add documentation. → design-outline.md § "Problem Statement"

- I notice the design outline doesn't address the Component Development Guide gap (Finding 4) in the Options or resolved questions. The options cover prompt fix, task template, and automated validation — but the Component Dev Guide is the primary reference document agents load during component work. Adding a contracts section there would be a fourth safeguard layer: the reference material itself would remind agents about contracts even if the prompt step, task template, and automated check all somehow fail. I'd recommend adding this as a deliverable under Option D. It's a ballot measure (steering doc change) but low effort — a focused section on "Behavioral Contracts Workflow" covering: when to author, naming convention, catalog consultation, and the relationship between contracts.yaml and platform implementation. → design-outline.md § "Options" Option D

- The "errors not warnings" decision (Q4) is correct but Ada's observation about the dependency chain is worth monitoring. During 049, the three new concepts would have been fast ballot measures. But I can imagine a scenario where a complex component introduces 5-6 new concepts and the ballot measure becomes a bottleneck. The mitigation Ada suggests (monitor after 2-3 components) is pragmatic. If it becomes friction, a "pending-catalog" mechanism or batch approval process would be the escape valve. → design-outline.md § "Open Questions" Q4

- One gap I see: the design outline doesn't discuss how contracts.yaml interacts with component inheritance. If Nav-SegmentedChoice-Base eventually has a child component (e.g., a themed variant), does the child inherit contracts? The Contract-System-Reference has an Inheritance section, but the 078 workflow (authoring, validation, catalog) doesn't address inherited contracts. This may be out of scope for 078 — it's a future concern — but worth noting as a known boundary. → design-outline.md § "Dependencies"

---

## Requirements Feedback

### Context for Reviewers
- 9 requirements covering Option D's three layers (prompt, task template, automated) plus documentation and audit → requirements.md
- Req 1: Lina's scaffolding prompt fix → design-outline.md § "Option A"
- Req 2: Task template enforcement including `_Contracts:` lines on implementation subtasks → design-outline.md § "Option B", § "Open Questions" Q6
- Reqs 3-5: Automated validation (existence check, catalog name validation, auto-discovery fix) → design-outline.md § "Option C", § "Integration Audit Findings" Findings 1-2
- Req 4 AC 4: Structural assertion on catalog parsing per Ada R1 feedback → feedback.md § "Design Outline Feedback" [ADA R1]
- Req 6: One-time audit of existing components per Ada R1 observation → feedback.md § "Design Outline Feedback" [ADA R1]
- Req 7: CDG update per Lina R1 feedback → feedback.md § "Design Outline Feedback" [LINA R1]
- Req 8: Stemma documentation updates per Finding 5 → design-outline.md § "Integration Audit Findings" Finding 5
- Req 9: Concept Catalog ownership per Q7 resolution → design-outline.md § "Open Questions" Q7
- Contract-to-test traceability intentionally excluded (deferred) → design-outline.md § "Deferred: Contract-to-Test Traceability"
- Contract inheritance intentionally excluded (out of scope) → feedback.md § "Design Outline Feedback" [LINA R1]

#### [THURGOOD R2]
- Incorporated Lina Req-R1 items 1-5 and Ada Req-R1 items 1-4.
- Req 1 AC 4: Clarified — ballot measure gates implementation, not authoring. Lina can finish contracts.yaml, then propose ballot measure in parallel with implementation prep. Req 4 test is the CI enforcement point.
- Req 4 AC 2: Added category to error message per Lina's suggestion.
- Req 4 AC 4: Refined baseline to >= 112, floor rises per Ada's suggestion.
- Req 6: Updated user story to Stemma component specialist. AC 2 clarifies Lina performs, Thurgood reviews. AC 3 now includes catalog header count update per both Lina and Ada.
- Req 8 AC 2: Reframed per Ada's suggestion — scan is the deliverable, updates are individually bounded ballot measures.
- Ada's note on Req 4 AC 3 (separate columns in catalog table): noted as implementation detail, no AC change needed.
- Lina's question about Finding 5 in design outline: confirmed, Finding 5 was added to design-outline.md § "Integration Audit Findings" before requirements were written.
- Resolved review items table updated with all requirements-round feedback (10 new entries).

#### [LINA R1]

Overall: the requirements are well-structured and trace cleanly back to the design outline decisions and feedback incorporation. All 8 open questions and the key feedback items from Ada and me are represented. A few items:

- Req 1 AC 4 creates a sequential dependency: discover new concept → ballot measure → wait for Peter → resume. The AC says "before proceeding" — does "proceeding" mean before finishing contracts.yaml, or before starting platform implementation? I'd recommend clarifying: the agent should be able to *finish authoring* contracts.yaml with the new concept name, then propose the ballot measure, then proceed to implementation. The catalog addition and the implementation can be parallel as long as the catalog is updated before the Req 4 validation test runs in CI. Blocking contracts authoring itself on the ballot measure would be unnecessarily sequential. → requirements.md § "Requirement 1" AC 4

- Req 3 AC 1 says "every component directory containing a `platforms/` subdirectory." Worth noting: some component directories might have `platforms/` with only placeholder files (e.g., a single-line comment). The existence check should still flag these — a placeholder platform directory is a signal that contracts should be authored as part of scaffolding. This is consistent with my Finding 1 response in R1. No AC change needed, just confirming the intent is correct as written. → requirements.md § "Requirement 3" AC 1

- Req 4 AC 2 says the test fails with "the unrecognized concept." Suggest also including the category in the error message — e.g., "Component Nav-SegmentedChoice-Base: contract 'interaction_noop_active' has unrecognized concept 'noop_active' in category 'interaction'." The category context helps the developer decide whether this is a new concept (add to catalog) or a naming mistake (rename to existing concept). Small quality-of-life improvement. → requirements.md § "Requirement 4" AC 2

- Req 6 (existing component audit) is correctly scoped as a one-time prerequisite for Req 4. One question: who performs the audit? The user story says "test governance specialist" (Thurgood), but the actual work is scanning contracts.yaml files and classifying concepts — that's closer to my domain (Stemma component knowledge). I volunteered in my R1 feedback to run it. Suggest the requirement clarify: Lina performs the audit, Thurgood reviews the classification decisions. → requirements.md § "Requirement 6"

- Req 7 and Req 8 are both steering doc ballot measures. Req 7 is one section in one doc (Component Development Guide). Req 8 touches 2 critical docs and potentially several more. These have very different scopes. Req 8's AC 2 ("reviewed and updated where appropriate") is open-ended — how do we know when it's done? Suggest adding a bounded list or a "minimum set" so the task is completable. Otherwise it risks becoming an unbounded audit of every steering doc that mentions Stemma. → requirements.md § "Requirement 8" AC 2

- I don't see a requirement for updating the Contract-System-Reference Concept Catalog count ("112 concepts across 10 categories. Derived from the 28 deployed contracts.yaml files"). After Req 6 (audit + catalog additions), this header will be stale. It's a small thing, but the catalog's own metadata should be accurate. Could be folded into Req 6 AC 3 or Req 9. → requirements.md § "Requirement 9"

- The Resolved Review Items table is a nice touch — clear traceability from feedback to requirements. Finding 5 is referenced but I don't see it in the design outline's Integration Audit Findings (which has Findings 1-4). Was Finding 5 added to the design outline, or is it only in the requirements doc? If only in requirements, the design outline should be updated for consistency. → requirements.md § "Resolved Review Items"

#### [ADA R1]

Solid requirements doc. Clean traceability from design outline → feedback → requirements. My structural assertion recommendation (Req 4 AC 4) and the existing component audit (Req 6) are both well-represented. A few items:

- Req 4 AC 3 says "read from `Contract-System-Reference.md` markdown directly." The concept names in that catalog follow `{category}_{concept}` format, but the catalog table itself lists category and concept in separate columns. The test needs to reconstruct the full contract name from the table columns to match against contracts.yaml entries. This is an implementation detail, not an AC issue, but worth flagging so the implementer doesn't assume the catalog lists full `{category}_{concept}` strings. → requirements.md § "Requirement 4" AC 3

- Lina's point about Req 1 AC 4 ("before proceeding") is correct and I'd second it. The ballot measure dependency should gate *implementation*, not *authoring*. Contracts.yaml should be completable with new concept names, then the ballot measure runs in parallel with implementation prep. The Req 4 validation test is the enforcement point — it fails in CI if the catalog isn't updated. This keeps the workflow flowing without losing the safeguard. → requirements.md § "Requirement 1" AC 4

- Req 4 AC 4 (my structural assertion recommendation) says "expected column headers, minimum row count." I'd refine: the minimum row count should be the *current* catalog size (112 concepts), not a static number. If the count drops below the known baseline, something was deleted — that's a different failure mode than format change, but equally worth catching. The assertion becomes: "catalog has expected headers AND row count >= 112." The floor rises as concepts are added. → requirements.md § "Requirement 4" AC 4

- Lina's observation about Req 8 AC 2 being open-ended is a real concern. "Reviewed and updated where appropriate" is unbounded. I'd recommend: Req 8 AC 1 covers the two critical docs (bounded, required). Req 8 AC 2 should be reframed as "a scan of steering docs mentioning 'Stemma' SHALL be performed, and a list of docs requiring updates SHALL be produced. Updates to docs on that list are scoped as individual ballot measures." This makes the *scan* the deliverable, not an open-ended update pass. The scan is bounded; the updates are individually scoped. → requirements.md § "Requirement 8" AC 2

- Lina's catch about the Concept Catalog header count ("112 concepts across 10 categories") going stale after Req 6 is valid. I'd fold it into Req 6 AC 3: "WHEN the audit is complete THEN the Concept Catalog header SHALL be updated to reflect the current concept count and component count." Small addition, prevents immediate staleness. → requirements.md § "Requirement 6" AC 3

- No token domain concerns. Reqs 3-5 are test infrastructure in Thurgood's domain. Reqs 1, 2, 7, 8, 9 are process/documentation. None of this touches the token pipeline, generators, or platform builders. My domain stays clean.

---

## Design Feedback

### Context for Reviewers
- Architecture shows 4 safeguard layers operating at different lifecycle points, each independent → design.md § "Architecture"
- Catalog parsing note: actual format is category headings + inline concept lists, NOT table format (corrects Ada's R1 assumption) → design.md § "Components and Interfaces" Catalog Name Validation
- Contract name splitting: `{category}_{concept}` where category is first segment before `_`, concept is everything after → design.md § "Components and Interfaces" Catalog Name Validation
- Auto-discovery replaces hard-coded array with filesystem scan, no other test logic changes → design.md § "Components and Interfaces" Behavioral Contract Validation
- 5 design decisions with rationale and trade-offs → design.md § "Design Decisions"
- Empty contracts.yaml is valid (existence check passes, name validation has nothing to check) → design.md § "Error Handling"

#### [ADA R1]

Clean design. The architecture diagram showing independent safeguard layers at different lifecycle points is the right framing — no single point of failure. A few items:

- The catalog parsing note correcting my R1 assumption is appreciated. I assumed a table format; the actual format is category headings (`### accessibility (22)`) with inline backtick-delimited concept lists. This is a more fragile format to parse than a table — inline concept lists separated by `·` are less structured than pipe-delimited table rows. The structural assertion (10 categories, >= 112 concepts) becomes even more important here. I'd add one more assertion: verify that every category heading's parenthetical count matches the actual number of concepts parsed from that category's inline list. E.g., `### accessibility (22)` should yield exactly 22 concepts. This catches partial parsing failures where the regex misses some backtick-delimited names. → design.md § "Components and Interfaces" Catalog Name Validation

- Contract name splitting logic is correct but the design should document one edge case: what about contract names with multiple underscores where the category itself contains an underscore? Looking at the current catalog categories (accessibility, animation, content, data, interaction, layout, noop, state, visual, validation) — none contain underscores, so the "first underscore splits category from concept" rule works today. But if a future category like `data_binding` were added, `data_binding_source` would be ambiguous: is it category `data`, concept `binding_source`? Or category `data_binding`, concept `source`? The structural assertion on category count (exactly 10) would catch a new category being added, which is the right moment to revisit the splitting logic. Worth a comment in the test code, not an AC change. → design.md § "Components and Interfaces" Catalog Name Validation

- Decision 2 (parse markdown directly) is correct and I'd reinforce it. The process-first principle applies. HOWEVER, the catalog format (category headings + inline lists) is less stable than a table format. If the catalog is ever restructured — say, into a table for readability — the parser breaks. The structural assertion catches this, but the fix requires updating the parser. Worth noting in the trade-offs: "format coupling is to the *current* inline-list format, not just to markdown in general." → design.md § "Design Decisions" Decision 2

- Decision 4 (scan as deliverable) directly addresses the Req 8 AC 2 concern Lina and I both raised. The scan is bounded, updates are individually scoped. This is the right resolution.

- No token domain concerns. The test files live in `src/__tests__/stemma-system/`, which is outside the token pipeline entirely. The catalog parsing doesn't interact with any token generators or platform builders.

#### [LINA R1]

The design is clean and implementable. The architecture diagram, error handling edge cases, and design decisions are all well-reasoned. A few items:

- Ada's suggestion to verify each category heading's parenthetical count against actual parsed concepts is a good one. During 049, I authored 24 contracts across 10 categories — if the parser had silently missed one due to a formatting quirk (e.g., a concept name with a period or hyphen inside backticks), the structural assertion on total count might still pass while individual category counts would catch it. Low effort, high diagnostic value. → design.md § "Components and Interfaces" Catalog Name Validation

- The catalog parsing note correcting Ada's table assumption is important. I want to flag a related concern: the inline concept list format uses `·` (middle dot) as a separator. If someone accidentally uses a regular period `.` or a bullet `•` instead, the parser would miss concepts. The parser should be explicit about the delimiter and the structural per-category count assertion would catch this. Not an AC change — just an implementation note for whoever writes the test. → design.md § "Components and Interfaces" Catalog Name Validation

- Edge case 4 (empty contracts.yaml) — I agree this is valid during scaffolding, but I'd add a nuance: an empty contracts.yaml should be valid for the *existence check* (Req 3) and the *name validation* (Req 4), but the *behavioral-contract-validation test* (Req 5, auto-discovery) would discover the component and then find zero contracts to validate. Is that a pass or a warning? If a component has platforms/ and contracts.yaml but zero contracts defined, that's likely an incomplete scaffolding state, not a finished component. Suggest the auto-discovery test (Req 5) skip components with zero contracts rather than failing on them — they'll be caught by the workflow (the contracts authoring subtask isn't complete until contracts are defined). → design.md § "Error Handling" Edge Case 4

- Decision 1 (separate test files) is correct. I'd note one practical benefit not mentioned: when a test fails in CI, the file name immediately tells you what's wrong. `contract-existence-validation.test.ts` failing means "missing contracts.yaml." `contract-catalog-name-validation.test.ts` failing means "naming issue." If they were combined, you'd need to read the test output to distinguish the failure mode. → design.md § "Design Decisions" Decision 1

- Decision 5 (Lina performs audit, Thurgood reviews) — confirmed, this matches my R1 volunteer and the requirements feedback. I have the Stemma domain knowledge to classify concepts; Thurgood has the governance perspective to validate the classifications. The design correctly captures this split. → design.md § "Design Decisions" Decision 5

- One thing I notice is missing from the design: the steering doc changes (Reqs 1, 2, 7, 8) don't have design-level detail. The test infrastructure (Reqs 3-5) has pseudocode, file paths, error formats, and edge cases. The steering doc changes have one-line descriptions ("Add Step 3", "New section covering..."). I understand these are ballot measures and the exact content is authored at implementation time, but some design-level guidance would help — especially for Req 7 (CDG contracts section). What subsections should it have? What MCP queries should it reference? What anti-patterns should it call out? Without this, the implementer is designing the section from scratch during implementation. HOWEVER — this might be intentional. Steering doc content is Peter's domain (ballot measure model), so over-specifying it in the design could conflict with Peter's editorial authority. I'd defer to Peter on whether more design detail is wanted here. → design.md § "Components and Interfaces" Steering Doc Changes

---

## Tasks Feedback

### Context for Reviewers
- [Populated by spec author before requesting review]
