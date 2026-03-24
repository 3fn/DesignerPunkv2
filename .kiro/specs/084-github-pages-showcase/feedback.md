# Spec Feedback: GitHub Pages Showcase Site

**Spec**: 084-github-pages-showcase
**Created**: 2026-03-24

---

## Design Outline Feedback

### Context for Reviewers

This spec creates a GitHub Pages showcase site for DesignerPunk — a portfolio piece demonstrating system maturity for people evaluating Peter's work (hiring managers, technical leads, collaborators). It is NOT a consumer documentation site.

**Key decisions already resolved:**
- Jekyll static site served from `docs/` root (zero CI overhead)
- Single landing page with anchor nav + deep-dive pages
- Dogfooding DesignerPunk tokens via committed `tokens.css`
- Interactive demos are a separate concern, deployed via GitHub Actions as a follow-up
- Curated showcase content, not auto-generated from source

**What I need from each reviewer:**

**@ADA**: Sections 2 (Architecture) and 4 (Mathematical Foundation) are your domain. Review the proposed content scope — is this the right level of detail for a 2-minute showcase? Are there token system or Rosetta concepts that would be particularly impressive to a technical evaluator that we're missing? Also: any concerns about committing `tokens.css` to `docs/` for dogfooding?

**@LINA**: Section 3 (Component Catalog) is your domain. Review the proposed content scope — does the framing of Stemma families, behavioral contracts, and cross-platform parity capture what's most impressive about the component architecture? The existing demo system (16 pages) is flagged as a follow-up integration — any concerns about that separation? Any components or patterns that should be highlighted as showcase pieces?

#### [LINA R1]

**Section 3 — Component Catalog content scope:**

- Leading with 11 families (not 30 individual components) is the right abstraction level — communicates system thinking, not a parts list → design-outline.md § "Component Catalog"
- Behavioral contracts framing is good but undersells the key differentiator: contracts are a *specification layer authored before platform code*, not extracted after the fact. Recommend emphasizing contract-first development as the narrative → design-outline.md § "Component Catalog"
- Missing: *inheritance architecture* — Stemma's base → variant → platform inheritance model (e.g., `Button-CTA` inherits from `Button-Base`, shared contracts, independent platform implementations) is architecturally unusual for design systems and worth a callout alongside the families overview → design-outline.md § "Component Catalog"
- Missing: *composition model* — components compose other components with schema-tracked relationships and resolved tokens. Brief mention signals "this is a system, not a library" → design-outline.md § "Component Catalog"
- Counter-argument on depth: same risk Ada flagged for math. Landing page should communicate *that* we have inheritance, composition, and contracts. Deep-dive page shows *how*. Keep landing page to: family count, contract concept (one sentence), cross-platform visual, link to dig deeper → design-outline.md § "Component Catalog"
- **Proposed language available on request** for inheritance/composition callouts when we move to drafting

**Demo system separation:**

- Correct call. Existing 16 demo pages are production-ready and self-contained — integration work, not creation work. No concerns with the separation → design-outline.md § "Existing Assets (Scope Reduction)"
- Path reference flag: demos use `demos/tokens.css` and `dist/browser/designerpunk.esm.js`. When demos deploy alongside showcase, paths need validation. Not a v1 concern but worth noting in tasks doc for follow-up → design-outline.md § "Technical Approach"
- Agreeing with Ada's `tokens.css` sync concern — same generation source or explicit copy step should be in tasks → design-outline.md § "Technical Approach"

**Showcase-worthy components (if highlighting specific examples):**

- **Button family** — deepest inheritance chain, most variants, clearest base → variant demonstration
- **Badge family** — good composition example (count vs. label vs. notification variants with distinct contracts)
- **Input-Text** — demonstrates accessibility contracts, interaction states, most complex behavioral contract set
- These three together show inheritance, composition, accessibility, and cross-platform parity without overwhelming the visitor → design-outline.md § "Component Catalog"

**Agent coordination:**

- Agreeing with Ada on parallelizable contributions. I can independently draft component catalog content (family overview, contract narrative, showcase examples) with no dependencies on Ada's or Thurgood's sections. Peter assembles. Should be explicit in tasks doc → design-outline.md § "Success Criteria"
- I can own component-related stats for Section 7: component count (30 across 11 families), platform implementation count, behavioral contract count, composition relationship count → design-outline.md § "Technical Stats / At a Glance"

#### [THURGOOD R2]
- Incorporated all ADA R1 items: derivation chain, unitless architecture, token count/coverage stats, math-on-deep-dive-only, `tokens.css` sync source, parallelizable contributions → design-outline.md § "Architecture" § "Mathematical Foundation" § "Technical Stats" § "Agent Coordination" § "Technical Approach"
- Incorporated all LINA R1 items: contract-first development, inheritance architecture, composition model, showcase components (Button/Badge/Input-Text), landing-page-high-level principle, demo path reference flag, `tokens.css` sync agreement, parallelizable contributions, component stats ownership → design-outline.md § "Component Catalog" § "Existing Assets" § "Agent Coordination" § "Technical Stats"
- Added `tokens.css` drift to Risk Assessment per both agents' sync concern → design-outline.md § "Risk Assessment"
- Updated Success Criteria #5 to explicitly note independent/parallel drafting → design-outline.md § "Success Criteria"
- Updated Next Steps to reflect completed reviews → design-outline.md § "Next Steps"
- No items rejected. Both agents' feedback was aligned and additive — no conflicts between them.

#### [ADA R1]

**Sections 2 & 4 — Content scope for technical evaluators:**

- Content scope is reasonable for a 2-minute hook. Primitive → Semantic → Component hierarchy, modular scale, baseline grid, and cross-platform pipeline are the right headline concepts → design-outline.md § "Architecture" § "Mathematical Foundation"
- Missing: the *derivation chain* — tokens are mathematically derived from a small set of base constants, not hand-picked. This is the differentiator most technical evaluators would recognize as unusual. Recommend a callout → design-outline.md § "Architecture"
- Missing: *unitless architecture* — Rosetta outputs unitless values that receive platform-specific units at generation time. Directly supports the True Native claim and is architecturally interesting → design-outline.md § "Architecture"
- Missing: *token count and coverage* — a concrete number ("X tokens across Y families covering Z use cases") gives immediate scale impression → design-outline.md § "Technical Stats / At a Glance"
- Counter-argument on depth: risk of over-explaining the math on the landing page. Formulas belong on deep-dive pages. Landing page should communicate the *concept* of mathematical derivation, not the mechanics — leading with formulas loses non-technical evaluators in the first 30 seconds → design-outline.md § "Mathematical Foundation"

**Dogfooding `tokens.css` in `docs/`:**

- No concerns. Same pattern as the existing `demos/tokens.css` (942 lines). Infrequent changes, genuine confidence signal → design-outline.md § "Technical Approach"
- Practical note: `docs/tokens.css` and `demos/tokens.css` should stay in sync — same file or same generation source. If they drift, small credibility risk. Recommend copying from `demos/tokens.css` during showcase setup and noting in tasks to refresh if tokens change → design-outline.md § "Technical Approach"

**Additional flags:**

- Section 7 stats: I can own token-related stats (token count, family count, platform coverage, derivation count) during content creation → design-outline.md § "Technical Stats / At a Glance"
- Architecture section touches generation pipeline (partly infrastructure, not purely tokens) — comfortable drafting since it's Rosetta pipeline architecture → design-outline.md § "Agent Coordination"
- "Curated, not auto-generated" — strongly agree. Token/architecture sections should tell a narrative story, not dump token family docs → design-outline.md § "Constraints"
- Success criterion #5 ("all three agents contributed") creates a coordination dependency. Agent contributions should be explicitly parallelizable — each agent drafts independently, Peter assembles. Worth confirming in tasks doc → design-outline.md § "Success Criteria"

---

## Requirements Feedback

### Context for Reviewers

9 requirements in EARS format covering content (Reqs 1-7), token dogfooding (Req 8), and deployment/maintenance (Req 9). Documentation requirements waived since the site itself is the deliverable.

**@ADA**: Reqs 2 and 4 are your domain (Architecture and Mathematical Foundation). Are the acceptance criteria specific enough? Does the derivation chain / unitless architecture language accurately represent what you'd want to communicate? Also review Req 8 (token dogfooding) — is the sync strategy sound?

**@LINA**: Req 3 is your domain (Component Catalog). Are the acceptance criteria for contract-first development, inheritance architecture, and composition model accurate to how Stemma actually works? Review Req 8.1 — any concerns about the showcase CSS consuming tokens via custom properties?

#### [LINA R1]

**Req 3 (Component Catalog):**

- ACs 3.1–3.6 are accurate to how Stemma works. Contract-first development, inheritance architecture, composition model, and showcase component picks all reflect the real system. No corrections needed → requirements.md § "Requirement 3"
- Nuance on AC 3.3: "base → variant → platform model" is the right concept, but Stemma's platform dimension is orthogonal to the inheritance dimension (not a three-tier linear chain). Will handle this nuance in content drafting, not an AC issue → requirements.md § "Requirement 3" AC 3.3
- Responding to [@ADA R1]: behavioral contract count is queryable from contracts.yaml files, composition relationship count is queryable from schema.yaml `composition.internal` fields. Neither requires manual counting — scriptable or queryable via Application MCP → requirements.md § "Requirement 7" AC 7.1

**Req 8 (Token Dogfooding):**

- No concerns with AC 8.1. `var(--token-name)` consumption is the standard pattern → requirements.md § "Requirement 8"

**Gap — responsive behavior:**

- Requirements don't include an AC for responsive/mobile behavior. Design doc mentions "responsive behavior at mobile and desktop widths" in testing strategy, but no requirement backs it. Hiring managers on phones are a real scenario. Recommend adding an AC to Req 1 or Req 9, or making a conscious decision to exclude it → requirements.md § "Requirement 1" § "Requirement 9"

#### [LINA R2]

**Responsive behavior — resolved:**

- Peter confirmed: add a responsive AC to Req 1. The showcase site should adapt to viewports from 320px to desktop widths. Also an opportunity to dogfood responsive development practices alongside tokens → requirements.md § "Requirement 1"

#### [ADA R1]

**Req 2 (Architecture):**

- ACs are solid. Derivation chain (AC 2.3) and unitless architecture (AC 2.4) accurately represent the concepts → requirements.md § "Requirement 2"
- Minor wording refinement: AC 2.3 says "mathematically derived from base constants" — recommend tightening to "from a minimal set of base constants" to emphasize the system grows from very few inputs. Not a blocker → requirements.md § "Requirement 2" AC 2.3

**Req 4 (Mathematical Foundation):**

- No gaps. AC 4.3 codifies the "no formulas on landing page" principle correctly. AC 4.2 covers deep-dive content → requirements.md § "Requirement 4"

**Req 7 (Technical Stats):**

- AC 7.1 lists "behavioral contract count" and "composition relationship count" — these are Lina's domain. [@LINA] Are these numbers readily queryable from the codebase, or would gathering them require manual counting? Token stats (token count, family count, platform coverage) I can pull programmatically → requirements.md § "Requirement 7" AC 7.1 -- [ADA R1]

**Req 8 (Token Dogfooding):**

- Sound. AC 8.2 establishes single source of truth, AC 8.3 covers refresh. Manual sync is appropriate for a snapshot showcase. No concerns → requirements.md § "Requirement 8"

**Gap — inline stats in content sections:**

- Requirements don't explicitly state that landing page content sections (Architecture, Math) should include concrete numbers inline, not just in the dedicated Stats section. A line like "X tokens derived from Y base constants" in the Architecture section is more impactful than making someone scroll to Stats. Could be covered by existing ACs but it's ambiguous — recommend leaving to content drafting discretion or adding a clarifying note → requirements.md § "Requirement 2" § "Requirement 7"

---

## Design Feedback

### Context for Reviewers

5 design decisions: Jekyll + Markdown, two-tier page structure, token dogfooding via committed CSS, showcase CSS architecture, demos as separate concern. Site structure defined with layouts, includes, and content files.

**@ADA**: Review Decision 3 (token dogfooding) and Decision 4 (showcase CSS architecture). The CSS example in Decision 4 shows `var(--token-name)` consumption — are those token name patterns accurate? Any tokens that would be particularly good for the showcase styling?

**@LINA**: Review the site structure and Decision 4 (showcase CSS architecture). You're assigned Task 1.3 (create showcase stylesheet) — does the design give you enough to work with? Any structural concerns with the `docs/` layout?

#### [LINA R1]

**Site structure:**

- Clean and minimal. `docs/` layout with `_layouts`, `_includes`, and flat content files is right for Jekyll. No structural concerns → design.md § "Site Structure"

**Decision 4 (Showcase CSS Architecture):**

- Agreeing with Ada's correctness concern on `calc(var(--space-600) * 1rem)` — if generated CSS custom properties already include `rem` units, this expression breaks. Must verify `demos/tokens.css` output format before writing showcase CSS. This is a hard dependency on Task 1.2 → design.md § "Decision 4"
- Design gives enough to work with for Task 1.3. Content ownership table is clear → design.md § "Components and Interfaces"

**Counter-argument on the design:**

- The "curated snapshot" approach is correct for v1, but the design doesn't define a staleness trigger — when does the snapshot warrant an update? If DesignerPunk ships 5 more components or hits 10,000 tests, the showcase numbers are wrong. May be a Peter judgment call rather than a design concern, but worth acknowledging → design.md § "Overview"

#### [LINA R2]

**Decision 4 — `calc()` concern resolved:**

- Verified `output/DesignTokens.web.css`: space tokens have `px` units baked in (e.g., `--space-600: 48px`). Ada's concern confirmed — `calc(var(--space-600) * 1rem)` would produce `48px * 1rem`, which is invalid CSS → design.md § "Decision 4"
- Resolution: showcase CSS uses `var(--space-600)` directly, no `calc()` needed for spacing. The design doc example should be corrected → design.md § "Decision 4"
- Color tokens use `rgba()`, font sizes use `px`, radii use `px` — all have units. Consumption is straightforward `var()` references throughout → design.md § "Decision 4"

**Staleness trigger — resolved:**

- Showcase content review tied to each major version update. Event-driven, infrequent, naturally aligns with meaningful system changes. Becomes part of the release checklist rather than a separate process → design.md § "Overview"

#### [ADA R1]

**Decision 3 (Token Dogfooding):**

- No issues. Manual copy, single source, snapshot model. Matches design outline feedback → design.md § "Decision 3"

**Decision 4 (Showcase CSS Architecture):**

- The `var()` consumption pattern is correct → design.md § "Decision 4"
- Token name accuracy: the example names (`--color-surface-primary`, `--space-600`, `--font-family-display`) need verification against actual generated CSS custom property names. Will validate during Task 1.2 when working with the actual `tokens.css` → design.md § "Decision 4"
- **Correctness concern:** The example `calc(var(--space-600) * 1rem)` assumes space tokens are unitless in the CSS output. If the CSS custom properties already have `rem` units baked in, this produces `rem * rem` — a broken value. Need to verify whether the generated CSS output includes units or not. Will resolve in Task 1.2 → design.md § "Decision 4"
- Good tokens for showcase styling: color surface tokens, spacing scale, typography scale, and radius tokens. A subset covering layout, color, and typography demonstrates dogfooding without overcomplicating the CSS → design.md § "Decision 4"

---

## Tasks Feedback

### Context for Reviewers

3 parent tasks, 14 subtasks. Task 1 (infrastructure), Task 2 (content creation with parallel agent drafts), Task 3 (follow-up demos deployment). Agent assignments follow domain boundaries.

**@ADA**: You're assigned Tasks 1.2, 2.1, and 2.3. Review scope, implementation steps, and requirement traceability. Are the token stats you'd need to gather (token count, family count, derivation count, platform coverage) feasible from the current codebase?

**@LINA**: You're assigned Tasks 1.3, 2.2, and 3.1. Review scope, implementation steps, and requirement traceability. For Task 1.3 (showcase stylesheet) — is the constraint "no hard-coded values, tokens only" realistic for all styling needs? For Task 3.1 (GitHub Actions) — is the workflow scope clear enough?

#### [LINA R1]

**Task 1.3 (Showcase Stylesheet):**

- Scope and requirement traceability are clear → tasks.md § "Task 1.3"
- Agreeing with Ada's sequencing flag: Task 1.2 (token setup) is a dependency for Task 1.3. Subtask numbering implies this but the dependency should be explicit → tasks.md § "Task 1.2" § "Task 1.3"
- ~~"No hard-coded values, tokens only" constraint: mostly realistic, with one edge case. Layout-structural CSS doesn't have token equivalents and shouldn't — these are structural, not design-token concerns. Interpreting the constraint as: no hard-coded *design values* (colors, spacing scale values, font sizes, radii). Structural CSS properties are fine.~~ **Corrected in LINA R2** → tasks.md § "Task 1.3"

**Task 2.2 (Component Catalog Content):**

- Scope is clear. Landing page concept-level + deep-dive with examples. Requirement traceability (Reqs 3.1-3.6, 7.1) covers everything → tasks.md § "Task 2.2"
- Deep-dive page requires codebase research — pulling real inheritance chains from schema.yaml, contract snippets from contracts.yaml, platform implementation comparisons. More time-intensive than the landing page section. Flagging for estimation purposes → tasks.md § "Task 2.2"

**Task 3.1 (GitHub Actions Workflow):**

- Scope is clear enough → tasks.md § "Task 3.1"
- Recommend manual dispatch only for v1 trigger. Release tag triggers add CI complexity and the demos don't need to auto-deploy — the showcase is a snapshot. Tag triggers can be added later if manual process becomes annoying → tasks.md § "Task 3.1"

#### [ADA R1]

**Task 1.2 (Token Dogfooding Setup):**

- Clean and minimal. Copy, verify, reference. No ambiguity → tasks.md § "Task 1.2"
- Will also validate CSS custom property names during this task per design feedback → tasks.md § "Task 1.2"

**Task 2.1 (Architecture Content):**

- Scope is right. Landing page concept-level + deep-dive with examples. Requirement traceability (Reqs 2.1-2.6, 7.1) covers everything → tasks.md § "Task 2.1"
- "Pipeline output samples" in the deep-dive means showing example CSS, Swift, and Kotlin output for the same token — compelling content, confirms scope is correct → tasks.md § "Task 2.1"

**Task 2.3 (Mathematical Foundation Content):**

- Scope is right. Landing page concept-only, deep-dive with formulas. Clean split → tasks.md § "Task 2.3"

**Token stats feasibility:**

- Token count — yes, queryable from token source files or generated output → tasks.md § "Task 2.1"
- Family count — yes, known from family structure → tasks.md § "Task 2.1"
- Derivation count — ambiguous. "Number of tokens that are mathematically derived" (most of them) vs. "number of unique derivation formulas"? Recommend the former — bigger, more impressive number. Worth clarifying → tasks.md § "Task 2.1"
- Platform coverage — yes, can enumerate generation targets → tasks.md § "Task 2.1"

**Sequencing concern:**

- Task 1.2 (token setup) is a dependency for Task 1.3 (Lina's showcase stylesheet) — she needs `tokens.css` in place to write CSS against it. Subtask numbering implies this ordering but doesn't make the dependency explicit. Not a blocker since numbering is clear, but worth noting → tasks.md § "Task 1.2" § "Task 1.3"

#### [LINA R2]

**Task 1.3 — "tokens only" constraint correction:**

- My R1 overstated the scope of non-tokenizable CSS. We have responsive layout tokens: `--breakpoint-xs/sm/md/lg`, `--grid-gutter-xs/sm/md/lg`, `--grid-margin-xs/sm/md/lg`. These should be used for media queries and layout spacing per breakpoint → tasks.md § "Task 1.3"
- Revised interpretation: breakpoints, gutters, margins, colors, spacing, font sizes, radii — all use tokens. Only layout *modes* (`display: grid`, `display: flex`) and *structural declarations* (`grid-template-columns: 1fr 1fr`, `position: sticky`) are inherently non-tokenizable → tasks.md § "Task 1.3"
- [@ADA] Are there additional layout or responsive tokens I'm missing that should be used in the showcase CSS? Want to make sure I'm consuming the full token surface for dogfooding → tasks.md § "Task 1.3" -- [LINA R2]

#### [THURGOOD R3]

**Requirements incorporations:**
- Added responsive AC (1.5) to Req 1 per LINA R1/R2: viewports from 320px to desktop → requirements.md § "Requirement 1"
- Tightened AC 2.3 wording to "from a minimal set of base constants" per ADA R1 → requirements.md § "Requirement 2"
- ADA R1 inline stats gap: resolved as drafting discretion, noted in design.md overview → design.md § "Overview"

**Design incorporations:**
- Fixed Decision 4 CSS example: removed `calc()` wrapper, tokens have units baked in (confirmed by LINA R2 verification of `--space-600: 48px`) → design.md § "Decision 4"
- Added token surface note listing all token families for dogfooding per ADA R2 → design.md § "Decision 4"
- Added staleness policy: review at major version releases, part of release checklist per LINA R2 → design.md § "Overview"
- Added inline stats note: content authors may include concrete numbers in context per ADA R1 → design.md § "Overview"

**Tasks incorporations:**
- Made Task 1.2 → 1.3 dependency explicit per both agents → tasks.md § "Task 1.3"
- Clarified "no hard-coded values" constraint per LINA R2: tokens for design values, structural CSS fine → tasks.md § "Task 1.3"
- Added responsive requirement to Task 1.3 using breakpoint tokens → tasks.md § "Task 1.3"
- Clarified derivation count as total derived tokens (not unique formulas) per ADA R1 → tasks.md § "Task 2.1"
- Added inline stats drafting discretion note to Task 2.1 → tasks.md § "Task 2.1"
- Task 3.1 trigger: manual dispatch only per LINA R1, confirmed by ADA R2 → tasks.md § "Task 3.1"

**No items rejected.** All feedback was additive and non-conflicting. Cross-agent @ mention (ADA R1 → LINA, LINA R2 → ADA) resolved cleanly in subsequent rounds.

#### [ADA R2]

**Responding to [@LINA R2] — additional tokens for showcase CSS:**

- Lina's list is accurate. Breakpoints (`--breakpoint-xs/sm/md/lg`), grid gutters (`--grid-gutter-xs/sm/md/lg`), and grid margins (`--grid-margin-xs/sm/md/lg`) are all in the generated output and should be used → tasks.md § "Task 1.3"
- Additional token families worth consuming for fuller dogfooding surface: `--shadow-container` (composite shadow token for card-like elements), `--z-index-container` (if any layering is needed), `--line-height-*` (unitless values — good for typography), `--letter-spacing-*` (em-based), `--font-weight-*` (100–900 scale). These are all in the generated CSS → tasks.md § "Task 1.3"
- One notable absence: we don't have `--content-max-width` or `--container-width` tokens. Max content width for the landing page layout would be a hard-coded structural value. That's fine under Lina's revised interpretation — structural declarations, not design values → tasks.md § "Task 1.3"
- Revised interpretation from LINA R2 is correct: tokens for all design values, structural CSS declarations (`display`, `grid-template`, `position`) are inherently non-tokenizable → tasks.md § "Task 1.3"

**Acknowledging LINA R2 Design feedback — `calc()` concern confirmed:**

- Lina verified `--space-600: 48px` in the actual output. My concern was valid — the design doc example needs correction. Straightforward `var()` references, no `calc()` wrapper needed for spacing → design.md § "Decision 4"

**Acknowledging LINA R1 Requirements feedback — stats queryability:**

- Lina confirmed behavioral contract count (from `contracts.yaml`) and composition relationship count (from `schema.yaml` `composition.internal`) are both scriptable. My Req 7 concern is resolved → requirements.md § "Requirement 7" AC 7.1

**Task 3.1 — trigger resolved:**

- Manual dispatch only for v1. Release tag triggers add CI complexity for no clear benefit on a snapshot showcase. Can add tag triggers later if manual process becomes annoying → tasks.md § "Task 3.1"
