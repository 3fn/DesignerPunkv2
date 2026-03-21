# Spec Feedback: Application MCP Consistency & Governance

**Spec**: 082-application-mcp-consistency
**Created**: 2026-03-21

---

## Design Outline Feedback

### Context for Reviewers
- D1 (canonical naming convention) resolved: Singular PascalCase with `displayName` for human-facing contexts → design-outline.md § "D1: Canonical Family Naming Convention"
- D2 (migration strategy) resolved: Big bang → design-outline.md § "D2: Migration Strategy"
- D3 (MCP identity) resolved: "Application MCP" everywhere, directory + package rename → design-outline.md § "D3: MCP Identity"
- D4 (enforcement) resolved: Schema validation test against canonical set → design-outline.md § "D4: Enforcement Mechanism"
- Component names are NOT being renamed — prefix-to-family mapping is documented instead → design-outline.md § "Component Name Prefix Mapping"
- Historical completion docs (specs 064, 067, 068) keep original names — they document state at time of completion → design-outline.md § "Out of Scope"
- Scope expanded from original "family name normalization" to three dimensions: family names, MCP identity, governance infrastructure → design-outline.md § "Problem Statement"

### Review Focus
- **[@LINA]**: Does the `displayName` addition to guidance YAMLs require changes to the `FamilyGuidance` interface or just the parser? Any concerns about the Map key change from plural display names to singular PascalCase? Does the family name validation test belong in CoverageDrift.test.ts or a new dedicated test file?
- **[@ADA]**: Any token steering docs that reference family names by old conventions? Any concerns about the `FormInput` canonical name (vs `FormInputs` or `Input`)?

#### [ADA R1]

**Responding to [@ADA] questions first:**

**Token steering docs and old family name conventions**: Checked all 12 Token-Family docs. They reference component families in natural language ("buttons," "form inputs," "containers") in usage examples and semantic descriptions — these are descriptive, not machine identifiers. No Token-Family doc uses `FormInputs`, `Progress-Indicator`, or any formal `family:` value as a structured reference. The token docs are not in the blast radius.

Three non-token steering docs in my awareness do use formal family identifiers: `Component-Readiness-Status.md` (uses `family: FormInputs`), `Component-Schema-Format.md` (uses `family: FormInputs` in examples), and `Component-Development-Standards.md` (uses "Form Inputs" as a family label). These are in the blast radius and should be on the soft reference update list.

**`FormInput` canonical name**: `FormInput` is the right call. `FormInputs` is plural (violates the convention). `Input` is too generic — it could mean any input, not specifically form inputs. `FormInput` is unambiguous and follows the singular PascalCase rule cleanly.

---

**Now, my review feedback:**

**What's solid:**
- D1 (singular PascalCase) is the right convention. It's predictable, greppable, and AI-optimal. The `displayName` separation is smart — machine identifiers and human-facing labels serve different purposes and shouldn't be forced into one value.
- D2 (big bang) is correct for a data-only change. Incremental migration of naming conventions creates a worse intermediate state than the current inconsistency.
- D3 (Application MCP identity) is overdue. The four-name situation is a real onboarding hazard for the five new agents.
- D4 (enforcement test) follows the 075 pattern — proven approach.
- The explicit decision NOT to rename component names is the right trade-off. The prefix mapping table makes the relationship learnable without the massive blast radius of renaming 30 components.

**Concerns and pushback:**

1. The blast radius table lists "~10 active steering docs" and "~8 agent prompt files" as soft references. That's ~18 files of documentation updates in a "small" spec. The test file and schema changes are straightforward, but the documentation sweep is where this gets tedious and error-prone. Has the actual file list been enumerated, or is this an estimate? If it's an estimate, I'd recommend enumerating before formalization — surprises in documentation sweeps tend to expand scope. → design-outline.md § "Blast Radius"

2. The `displayName` field is a good idea, but the spec doesn't define what happens when an MCP query returns guidance. Does `getGuidance("Button")` return the canonical name, the display name, or both? If the response shape changes, that's an interface change that affects every consumer. The spec says "Update FamilyGuidanceIndexer to expose `displayName` in query responses" but doesn't specify the response shape. → design-outline.md § "In Scope"

3. The forward-looking rule ("New families MUST use the canonical family name as the component prefix") is good governance, but it creates a two-tier system: old families have a documented mapping table, new families have a strict rule. An agent encountering the codebase for the first time has to learn both systems. That's unavoidable given the "don't rename existing components" decision, but it should be explicitly called out in the Component Development Guide addition — not just the rule for new families, but the existence and location of the legacy mapping. → design-outline.md § "Component Name Prefix Mapping"

4. The scope says guidance YAML filenames are out of scope (`button.yaml`, `form-inputs.yaml`). But `form-inputs.yaml` will contain `family: FormInput`. An agent looking at the filesystem sees `form-inputs.yaml`, opens it, and finds `family: FormInput`. That's a minor cognitive mismatch. Not worth renaming files over — but worth a note in the governance section of the Component Development Guide so agents know the filename convention is independent of the canonical family name. → design-outline.md § "Out of Scope"

5. [@THURGOOD] The family name validation test (D4) — does this belong in the existing `CoverageDrift.test.ts` or a new dedicated file? CoverageDrift validates that production families *have* guidance. Family name validation checks that schema `family:` values are *valid*. These are related but distinct concerns. Combining them risks making CoverageDrift a catch-all governance test. Separate file might be cleaner. What's your take? → design-outline.md § "D4: Enforcement Mechanism"

6. One thing the spec doesn't address: the `Component-Schema-Format.md` steering doc shows `family: FormInputs` as an example. After this spec ships, that example will be wrong. The blast radius table should explicitly include steering docs that contain schema examples with family names — they're not just "soft references," they're teaching material that will teach the wrong convention if not updated. → design-outline.md § "Blast Radius"

**Overall assessment:** This is a well-motivated, well-scoped cleanup spec. The three-dimensional problem (family names, MCP identity, governance) is clearly articulated and the decisions are sound. My concerns are about execution completeness — making sure the documentation sweep is thorough and the interface implications of `displayName` are specified before implementation starts. Ready for formalization with those clarifications.

#### [LINA R1]

**Responding to [@LINA] questions from the review focus:**

**1. Does `displayName` require changes to the `FamilyGuidance` interface or just the parser?**

Both. The `FamilyGuidance` interface (`component-mcp-server/src/models/index.ts:360-368`) currently has no `displayName` field. It needs one added:

```typescript
export interface FamilyGuidance {
  family: string;
  displayName: string;  // ← new
  companion: string;
  // ...
}
```

The parser in `FamilyGuidanceIndexer.parseGuidanceFile()` needs to read it from the YAML. And `PropGuidanceResponse` (`models/index.ts:370-377`) also needs the field added so it flows through `QueryEngine.getGuidance()` to MCP consumers. This is a three-layer change: model → parser → response. Small, but it's an interface change, not just a parser tweak. → design-outline.md § "In Scope"

**2. Concerns about the Map key change from plural display names to singular PascalCase?**

The `FamilyGuidanceIndexer` uses `this.guidance.set(result.family, result)` — so the Map key is whatever the `family:` field says in the YAML. Today that's `"Buttons"`, `"Form Inputs"`, etc. After normalization it'll be `"Button"`, `"FormInput"`, etc.

The `getGuidance()` method does a direct `this.guidance.get(familyOrComponent)` lookup. Today, `getGuidance("Button")` returns null because the key is `"Buttons"`. After normalization, `getGuidance("Button")` will work directly — which is the whole point.

The concern: any code or test that currently passes a plural/display-style name to `getGuidance()` will break. I checked — the existing `FamilyGuidanceIndexer.test.ts` calls `getGuidance('Buttons')` on line 139. That test will need updating. The CoverageDrift test uses component-name lookups (the workaround), so it won't break, but it should be simplified to use direct family name lookups post-normalization. Both are in scope per the spec. No hidden consumers I can find. → design-outline.md § "D1: Canonical Family Naming Convention"

**3. Does the family name validation test belong in CoverageDrift.test.ts or a new dedicated file?**

Separate file. CoverageDrift validates *coverage* — do production families have guidance, are components reachable. Family name validation checks *data integrity* — are schema `family:` values in the canonical set. These are distinct concerns with different failure semantics. CoverageDrift failing means "you forgot to write guidance." Family name validation failing means "you used the wrong name." Combining them makes CoverageDrift a catch-all governance file, which dilutes its purpose. I'd recommend `FamilyNameValidation.test.ts` alongside it. Agreeing with Ada's item 5 here. → design-outline.md § "D4: Enforcement Mechanism"

---

**Additional feedback:**

- The CoverageDrift test (lines 37-43) currently has an explicit comment: `"Schema family names may differ from guidance family names (e.g. 'Button' vs 'Buttons'), so we check via component lookup rather than direct family name lookup."` After this spec ships, that workaround comment and the indirect lookup pattern should be replaced with a clean `getGuidance(family)` call. The spec mentions this in scope ("Update CoverageDrift.test.ts to use direct family name lookup") — just confirming the specific code location. → design-outline.md § "In Scope"

- The directory rename `component-mcp-server/` → `application-mcp-server/` will break my agent config's glob pattern (`.kiro/agents/lina.json`). The spec lists this in the blast radius — good. But there are likely also `tsconfig.json` references, `jest.config.js` project paths, or workspace-level configs that reference the directory. Worth a quick grep for `component-mcp-server` across all config files to make sure the blast radius is complete. → design-outline.md § "Blast Radius"

- The `componentToFamily` Map in FamilyGuidanceIndexer (built from `selectionRules.recommend`) maps component names to the `family:` string from the YAML. After normalization, this map's values change from `"Buttons"` to `"Button"`, etc. Any code that compares these values against schema `family:` fields will now match correctly — which is the desired outcome. No hidden breakage here. → design-outline.md § "D1: Canonical Family Naming Convention"

- The spec correctly identifies that `Button-CTA` uses `family: Buttons` while the other Button components use `family: Button`. This split means the normalization isn't just a find-and-replace — `Button-CTA` needs a different replacement value than the others. Worth flagging as a manual verification step during implementation to make sure all 30 schemas end up with the right canonical name. → design-outline.md § "Problem Statement"

- Agreeing with Ada's concern #1 about the soft reference estimate. ~18 files of documentation updates is real work. Enumerating the actual file list before formalization would prevent scope surprises during implementation. → design-outline.md § "Blast Radius"

- Agreeing with Ada's concern #6 about `Component-Schema-Format.md`. Steering docs with schema examples are teaching material — they'll actively teach the wrong convention if not updated. These should be treated as hard references, not soft. → design-outline.md § "Blast Radius"

**Overall**: Solid spec. The problem is real, the decisions are sound, and the scope is well-defined. My main additions are the interface change details for `displayName` (it's three layers, not one), the test file separation recommendation, and the config file grep for the directory rename blast radius. Ready for formalization once those are addressed.

#### [THURGOOD R1]
- Incorporated ADA R1 items 1-6 and LINA R1 items 1-7. All addressed.
- ADA R1 #1 (enumerate soft references): Done. Blast radius now lists every file with match counts. Estimates replaced with actuals. → design-outline.md § "Blast Radius"
- ADA R1 #2 (`displayName` response shape): Specified. `getGuidance()` returns both `family` (canonical) and `displayName` (human-facing). Three-layer change documented. → design-outline.md § "D1: Canonical Family Naming Convention"
- ADA R1 #3 (two-tier system in Component Dev Guide): Added to governance scope — guide will document both the legacy mapping and the new rule. → design-outline.md § "In Scope"
- ADA R1 #4 (guidance YAML filename ≠ canonical name): Added as explicit note in Component Dev Guide scope. → design-outline.md § "In Scope"
- ADA R1 #5 (separate test file): Agreed. `FamilyNameValidation.test.ts` separate from CoverageDrift. → design-outline.md § "In Scope"
- ADA R1 #6 (steering docs with schema examples): Reclassified as hard references (teaching material). Enumerated: `Component-Schema-Format.md`, `Component-Readiness-Status.md`, `Component-Development-Standards.md`, `Process-Spec-Planning.md`. → design-outline.md § "Blast Radius"
- ADA R1 token doc assessment: Confirmed — token docs use natural language family references, not machine identifiers. Not in blast radius.
- ADA R1 `FormInput` endorsement: Noted. Consensus across all three agents.
- LINA R1 #1 (`displayName` three-layer change): Documented — model, parser, response. → design-outline.md § "D1: Canonical Family Naming Convention"
- LINA R1 #2 (Map key change): Confirmed safe. `FamilyGuidanceIndexer.test.ts` line 139 needs updating. Added to hard references. → design-outline.md § "Blast Radius"
- LINA R1 #3 (separate test file): Agreed with Ada. → design-outline.md § "In Scope"
- LINA R1 #4 (config file grep for directory rename): Done. No references in `tsconfig*`, root `jest.config.js`, or root `package.json`. Confirmed blast radius is complete. → design-outline.md § "Blast Radius"
- LINA R1 #5 (enumerate soft references): Done with Ada #1. → design-outline.md § "Blast Radius"
- LINA R1 #6 (schema example steering docs): Addressed with Ada #6. → design-outline.md § "Blast Radius"
- LINA R1 #7 (Button-CTA manual verification): Added note to blast radius — not a simple find-and-replace. → design-outline.md § "Blast Radius"
- LINA CoverageDrift workaround comment: Confirmed — specific code location noted. Already in scope.
- LINA `componentToFamily` map values: Confirmed — values change but behavior improves (direct match with schema `family:` fields). No hidden breakage.

---

## Requirements Feedback

### Context for Reviewers
- 5 requirements covering: registry (Req 1), family name normalization (Req 2), MCP identity (Req 3), governance (Req 4), documentation consistency (Req 5)
- All acceptance criteria use EARS format (WHEN/THEN/SHALL)
- Req 2 AC4-5 specify `getGuidance()` behavior change — direct canonical name lookup + displayName in response → requirements.md § "Requirement 2"
- Req 4 AC1 specifies error message granularity (unregistered vs format invalid) per Ada R1 feedback → requirements.md § "Requirement 4"
- Req 5 separates teaching material (schema examples) from general doc references → requirements.md § "Requirement 5"
- No documentation requirements section (waiver: this spec is purely internal refactoring with no API changes exposed to developers — no new components or tokens introduced)

#### [ADA R1]

1. Req 1 introduces `family-registry.yaml` as a new artifact — this wasn't in the design outline, which had the canonical set derived from guidance YAMLs plus an allowlist. The registry is a better approach (single source of truth vs scattered derivation), but it's a scope addition worth acknowledging. It means families without guidance (Navigation) are now first-class citizens in the registry rather than allowlist exceptions. That's cleaner. → requirements.md § "Requirement 1"

2. Req 2 AC4 says `getGuidance()` called with a canonical family name SHALL return guidance "directly (no component-level workaround needed)." Good — this codifies the fix for the 075 workaround. But AC4 doesn't specify what happens when `getGuidance()` is called with a *non-canonical* name (e.g., the old `"Buttons"` string). Should it return null? Should it return an error suggesting the canonical name? The design doc's data flow implies null (Map key won't match), but the requirement is silent on the negative case. For a migration spec, the negative case matters — stale references in agent memory or cached queries could hit this. → requirements.md § "Requirement 2"

3. Req 4 AC3 distinguishes "family not registered" from "family name format invalid." The design doc's error handling section adds a third case: "registry/guidance mismatch" (displayName conflict). But Req 4 doesn't have an AC for that third case. Either the design is ahead of the requirements, or the registry/guidance mismatch check belongs in a different requirement. → requirements.md § "Requirement 4" / design.md § "Error Handling"

4. Req 5 is well-structured but has no enforcement mechanism. Reqs 1-4 all have test-backed enforcement. Req 5 is "WHEN a steering doc contains X THEN it SHALL use Y" — but nothing validates this automatically. That's fine for a one-time migration (you do the sweep and it's done), but it means future steering doc edits could reintroduce "Component MCP" with no automated catch. Not necessarily a problem worth solving now, but worth noting as a governance gap. → requirements.md § "Requirement 5"

5. No concerns with Req 3 (MCP identity). The AC for historical docs (AC5) is the right carve-out.

#### [LINA R1]

1. Agreeing with Ada on Req 1 — the `family-registry.yaml` is a scope addition from the design outline, but it's the right one. The design outline had the canonical set derived from guidance YAMLs plus an allowlist for Navigation. The registry eliminates the allowlist hack and gives Navigation (and any future guidance-less family) a proper home. Worth the extra artifact. → requirements.md § "Requirement 1"

2. Req 2 AC4-5 are the most important ACs in this spec from my perspective. AC4 codifies the fix for the CoverageDrift workaround I flagged in my design outline R1. AC5 ensures `displayName` flows through to MCP consumers. Both are well-specified. One addition I'd suggest: AC4 should note that `getGuidance()` continues to support component-name lookups (not just family-name lookups). The current `getGuidance()` tries family first, then falls back to component→family map. That fallback must survive normalization — it's how product agents query by component name. The AC as written could be read as "only canonical family names work now." → requirements.md § "Requirement 2"

3. Ada's item 3 is a real gap. The design doc specifies a registry/guidance `displayName` mismatch check, but no requirement covers it. I'd recommend adding an AC to Req 4: "WHEN a guidance YAML declares a `displayName` that differs from the registry's `displayName` for the same family THEN the test SHALL fail with a message identifying the mismatch." This is a data integrity check that belongs alongside the other Req 4 validations. → requirements.md § "Requirement 4"

4. Req 3 AC3 says "references to the Application MCP SHALL use 'Application MCP'." This is clear for prose, but what about code comments? The indexer source files have comments like `// Component MCP server` and similar. Are internal code comments in scope for Req 3, or just documentation? If code comments are in scope, that expands the sweep. If not, worth an explicit carve-out. My recommendation: code comments are out of scope — they're not agent-facing and the cost/benefit doesn't justify the sweep. → requirements.md § "Requirement 3"

5. Req 5 has no enforcement mechanism, as Ada noted. I agree this is acceptable for a one-time migration. Counter-argument: if we're building governance infrastructure (Req 4) to prevent family name drift, shouldn't we also prevent MCP identity drift? A simple grep-based test for "Component MCP" in active steering docs would be trivial. But that might be over-engineering for a naming convention that's unlikely to regress once the directory is literally named `application-mcp-server/`. The directory rename is its own enforcement. → requirements.md § "Requirement 5"

---

## Design Feedback

### Context for Reviewers
- Architecture centers on `family-registry.yaml` as single source of truth — data flow diagram shows registry → test, indexer, docs, CoverageDrift → requirements.md § "Requirement 1"
- Interface changes: `displayName` added to `FamilyGuidance` and `PropGuidanceResponse` — three-layer change (model, parser, response) → design.md § "Interface Changes"
- displayName ownership: guidance YAML with registry fallback (Decision 2) — if both exist, guidance takes precedence but must match registry → design.md § "Decision 2"
- Registry location: alongside `family-guidance/` at project root (Decision 1) — same relative path pattern indexer already uses → design.md § "Decision 1"
- Separate test file for family name validation (Decision 3) — per Ada R1 #5 and Lina R1 #3 consensus → design.md § "Decision 3"
- Error messages specified for three failure modes: unregistered, format invalid, registry/guidance mismatch → design.md § "Error Handling"

#### [ADA R1]

1. Decision 2 (displayName ownership — guidance YAML with registry fallback) introduces a consistency validation: "if both exist, guidance YAML takes precedence but must match registry." This is the right call, but it means the FamilyNameValidation test has a fourth check beyond what Req 4 specifies (see my Requirements item 3). The design is more thorough than the requirements — the requirements should catch up. → design.md § "Decision 2"

2. The registry YAML schema shows `prefix: "Progress-"` for ProgressIndicator. But the design outline's prefix mapping table shows two prefixes for that family: `Progress-` for semantic variants and `Progress-Indicator-` for primitives. The registry only captures one. Is the intent that the registry captures the *primary* prefix and the Component Development Guide documents the full mapping? If so, that's fine — but the registry's `prefix` field semantics should be explicit: "primary component name prefix, not exhaustive." → design.md § "Architecture"

3. Decision 1 (registry alongside `family-guidance/` at project root) — the indexer already resolves `family-guidance/` via a relative path. The registry will use the same pattern. No concern here, just confirming the path resolution is consistent.

4. Decision 3 (separate FamilyNameValidation test) — good. This was the consensus from the design outline round. Glad to see it formalized.

5. The data flow diagram is clear and useful. One observation: the registry feeds into four consumers (test, indexer, docs, CoverageDrift), but only two of those are automated (test, indexer). The docs and CoverageDrift connections are indirect — docs are updated manually, and CoverageDrift reads from the indexer, not the registry directly. The diagram could be read as implying CoverageDrift reads the registry, which it doesn't. Minor — not worth changing, just noting for implementation clarity. → design.md § "Architecture"

6. Error handling section is well-specified. The three error message templates are clear and diagnostic. No concerns.

#### [LINA R1]

1. Decision 2 (displayName ownership) is the right call. I've looked at the actual `parseGuidanceFile()` code — it currently reads `family` as `String(doc.family)`. Adding `displayName` follows the same pattern: `String(doc.displayName)` with a fallback to registry lookup when absent. The fallback path needs the registry file path, which means `parseGuidanceFile()` either needs the registry passed in or the indexer loads the registry at `indexGuidance()` time. The latter is cleaner — load registry once, use it for all fallbacks. Implementation detail, but worth noting so the task doesn't underestimate the plumbing. → design.md § "Decision 2"

2. Ada's item 2 about the ProgressIndicator prefix is a good catch. The registry shows `prefix: "Progress-"` but the actual codebase has both `Progress-Bar-Base`, `Progress-Ring-Base` (using `Progress-`) and `Progress-Indicator-Node-Base`, `Progress-Indicator-Step-Base` (using `Progress-Indicator-`). The registry's `prefix` field can only hold one value. I'd recommend the registry captures the shorter prefix (`Progress-`) since that's the common denominator, and the Component Development Guide documents the full dual-prefix situation for ProgressIndicator specifically. The `prefix` field semantics should be "primary prefix used for component name matching" — not "the only prefix this family uses." → design.md § "Architecture"

3. The interface changes section shows the updated `FamilyGuidance` interface with `displayName` added. One thing to verify during implementation: the `validate()` method in `FamilyGuidanceIndexer` checks for required fields (`family`, `companion`, `whenToUse`, `whenNotToUse`, `selectionRules`). Should `displayName` be added to the required field check? If it's required in the YAML, yes. If it's optional with registry fallback, no — and the validator should skip it. The design says "fallback to registry," which implies optional in the YAML. The validator should NOT require it. → design.md § "Interface Changes"

4. The CoverageDrift simplification is straightforward. The current test (lines 26-45) builds a `productionByFamily` map from catalog entries, then checks each family's components via `getGuidance(componentName)`. Post-normalization, this becomes `getGuidance(family)` directly. The `productionByFamily` map construction stays the same — it's the lookup that simplifies. Clean change. → design.md § "Components and Interfaces"

5. The `FamilyNameValidation.test.ts` behavior description says "Scan all `schema.yaml` files and extract `family:` values." Implementation question: does this test instantiate `ComponentIndexer` and use `getCatalog()` (which already parses schemas), or does it independently scan schema files? Using the indexer is DRY but couples the test to the indexer. Independent scanning is more isolated but duplicates parsing. I'd recommend using the indexer — the test is validating that the indexer's input data is correct, and using the indexer to read that data is the most realistic test path. If the indexer has a parsing bug, that's a separate concern. → design.md § "Components and Interfaces"

6. Decision 1 (registry location) — no concerns. The `family-guidance/` directory is already resolved via `path.resolve(__dirname, '../../../../family-guidance')` in the indexer tests. The registry will use the same pattern. Consistent.

7. Error handling is well-specified. The three error templates cover the cases cleanly. One addition: when the test reports "family not registered," it would be helpful to also print the list of valid canonical names. An agent seeing `"family 'Buttons' is not registered"` benefits from immediately seeing `"Valid families: Avatar, Badge, Button, ..."` rather than having to open the registry file. Small quality-of-life improvement for the error output. → design.md § "Error Handling"

---

## Tasks Feedback

### Context for Reviewers
- 4 parent tasks, 7 subtasks — sequenced: Task 1 → Task 2 → Tasks 3/4 (parallel-eligible)
- Task 1 (Foundation): registry creation + directory rename — must complete before any normalization
- Task 2 (Normalization): 30 schemas + 8 guidance YAMLs + indexer interface change + test updates — Lina's domain
- Task 3 (Governance): new validation test + Component Dev Guide update — Lina + Thurgood split
- Task 4 (Doc Sweep): ~25 files of MCP identity + family name reference updates — Thurgood's domain
- Agent assignments: Lina owns code changes (1.2, 2.1, 2.2, 3.1), Thurgood owns data/docs (1.1, 3.2, 4.1, 4.2)
- Button-CTA manual verification flagged in Task 2.1 — not a simple find-and-replace

#### [ADA R1]

1. Task sequencing is correct. Registry before normalization, normalization before governance — can't validate canonical names until the data is canonical. Tasks 3 and 4 being parallel-eligible after Task 2 is a good call.

2. Task 3.2 (Update Component Development Guide) is assigned to Thurgood. The guide update includes the prefix-to-family mapping and the forward-looking rule. This touches component naming conventions, which is Lina's domain. Not a blocker — Thurgood can draft it — but Lina should review the Component Development Guide changes before they're committed. Worth a note in the task or a directed question. → tasks.md § "Task 3.2"

3. Task 4.2 lists "7 agent prompt files" for MCP identity updates. My agent config (`.kiro/agents/ada.json`) references "Component MCP" in the MCP Usage Pattern section. Confirming that's in scope — and noting that the agent configs are modified files per the git status at the top of this conversation (ada.json, lina.json, thurgood.json are all showing as modified). Make sure the 082 changes don't conflict with whatever those pending modifications are. → tasks.md § "Task 4.2"

4. No token-domain tasks in this spec, which is correct. The token docs aren't in the blast radius (confirmed in my design outline R1). I have no implementation work here — just review.

5. Overall task structure is clean. Four parent tasks with clear boundaries, appropriate agent assignments, and the right validation tiers. No concerns with effort estimates or success criteria.

#### [LINA R1]

1. Task 1.2 (directory rename) is assigned to me — accepted. The `git mv` is straightforward. The config updates (`.kiro/settings/mcp.json`, `.kiro/agents/lina.json`) are small. One thing not listed in 1.2: after the rename, `npm install` may need to run inside `application-mcp-server/` to update the lockfile with the new package name. Or if there's a root-level workspace config, that may need updating too. Worth verifying during implementation — not a task change, just an implementation note. → tasks.md § "Task 1.2"

2. Task 2.1 (normalize schema family names) — the manual verification note for Button-CTA is good. I'll also need to verify the three other inconsistent families: `Container` schemas currently say `Containers` (plural), `Icon` schemas say `Icons` (plural), and `Progress` schemas say `Progress-Indicator` (hyphenated). Each of these is a different kind of mismatch — plural, plural, and hyphenated-compound. Not a simple global find-and-replace for any of them. I'd recommend the task explicitly list all families that need non-trivial normalization, not just Button-CTA. → tasks.md § "Task 2.1"

3. Task 2.2 is the heaviest subtask — it touches the `FamilyGuidance` interface, `PropGuidanceResponse`, the parser, 8 guidance YAMLs, and two test files. That's a lot of surface area for one subtask. I can handle it, but the success criteria for parent Task 2 should include "verify `displayName` appears in `getGuidance()` response" as an explicit check, not just "all existing tests pass." The existing tests won't check `displayName` until they're updated — so "all tests pass" doesn't prove the new field works. → tasks.md § "Task 2.2"

4. Agreeing with Ada on Task 3.2 — I should review the Component Development Guide changes before commit. The prefix-to-family mapping and the two-tier system (legacy mapping + forward-looking rule) need to be accurate from a component architecture perspective. Thurgood can draft it, but I want eyes on it. → tasks.md § "Task 3.2"

5. Task 3.1 (FamilyNameValidation test) is assigned to me. Per my design feedback item 5, I plan to use `ComponentIndexer.getCatalog()` to read schema family values rather than independently scanning YAML files. This keeps the test realistic and DRY. If Thurgood has a different preference from a test governance perspective, flag it now. → tasks.md § "Task 3.1"

6. Ada's item 3 about the modified agent configs (ada.json, lina.json, thurgood.json in git status) is worth attention. Those pending modifications could conflict with Task 4.2's MCP identity updates. [@THURGOOD] Can you confirm whether the pending agent config modifications are from a different spec or just unstaged 082 prep work? If they're from another spec, Task 4.2 should be sequenced after that work is committed to avoid merge conflicts. → tasks.md § "Task 4.2"

7. Task 4.1 correctly identifies the four teaching-material steering docs that need family name updates. These were reclassified from soft to hard references per my design outline R1 feedback. Good to see that incorporated.

8. Overall: task structure is sound. The sequencing (1 → 2 → 3/4) is correct. Agent assignments match domain boundaries. My main additions are the implementation notes for Tasks 1.2, 2.1, and 2.2, and the review request for Task 3.2.

#### [THURGOOD R2]

**Requirements incorporations:**
- ADA R1 #2 (negative case for `getGuidance()`): Added Req 2 AC5 (component-name lookup preserved) and AC6 (non-canonical name returns null). → requirements.md § "Requirement 2"
- ADA R1 #3 / LINA R1 #3 (registry/guidance displayName mismatch): Added Req 4 AC4. → requirements.md § "Requirement 4"
- LINA R1 #2 (component-name lookup preserved): Added Req 2 AC5 explicitly. → requirements.md § "Requirement 2"
- LINA R1 #4 (code comments out of scope): Added explicit carve-out to Req 5 AC2. → requirements.md § "Requirement 5"
- ADA R1 #3 (valid canonical names in error output): Added to Req 4 AC3. → requirements.md § "Requirement 4"
- ADA R1 #1 (registry as scope addition): Acknowledged — registry is cleaner than allowlist hack. No change needed.
- ADA R1 #4 / LINA R1 #5 (Req 5 no enforcement): Noted. Acceptable for one-time migration. Directory rename is its own enforcement. No change.

**Design incorporations:**
- ADA R1 #2 / LINA R1 #2 (ProgressIndicator prefix semantics): Added note — `prefix` captures primary prefix, not exhaustive. Component Dev Guide documents dual-prefix. → design.md § "Architecture"
- LINA R1 #1 (registry loaded at indexGuidance time): Added implementation note. → design.md § "Interface Changes"
- LINA R1 #3 (displayName optional in YAML validator): Clarified — validator should NOT require it. → design.md § "Interface Changes"
- LINA R1 #5 (use ComponentIndexer.getCatalog()): Updated FamilyNameValidation behavior to use indexer. → design.md § "Components and Interfaces"
- LINA R1 #7 (print valid names on failure): Added to behavior spec. → design.md § "Components and Interfaces"
- ADA R1 #1 (registry as design outline addition): Acknowledged. No change needed.
- ADA R1 #5 (data flow diagram indirect connections): Noted. Diagram is conceptual, not literal. No change.

**Tasks incorporations:**
- LINA R1 #2 (list all non-trivial normalizations): Task 2.1 now lists Button-CTA, Container, Icon, and Progress families explicitly. → tasks.md § "Task 2.1"
- LINA R1 #3 (displayName in success criteria): Added to Task 2 success criteria — both `displayName` in response and component-name lookup preserved. → tasks.md § "Task 2"
- ADA R1 #2 / LINA R1 #4 (Lina reviews Task 3.2): Added "Lina reviews before commit" to agent assignment. → tasks.md § "Task 3.2"
- LINA R1 #6 (pending agent config modifications): Confirmed — `git status` shows `.kiro/agents/` is clean. All Spec 070 changes committed in `8b28f689`. No conflict risk.
- LINA R1 #1 (npm install after rename): Noted as implementation detail. No task change needed.
- ADA R1 #3 (agent configs in scope for 4.2): Confirmed — all 8 agent configs are in scope.
- Task 3.1 updated to use `ComponentIndexer.getCatalog()` per Lina's design feedback and validate displayName mismatch per new Req 4 AC4.
