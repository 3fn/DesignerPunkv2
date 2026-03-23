# Spec Feedback: Layout Templates

**Spec**: 069-layout-templates
**Created**: 2026-03-22

---

## Design Outline Feedback

### Context for Reviewers

- This spec was originally drafted 2026-03-04 and substantially rewritten 2026-03-22 after Specs 070, 082, 083 completed
- Core reframe: spec is no longer "create layout templates" — it's "ensure agents understand and communicate responsive layout, with templates as acceleration" → design-outline.md § "Core Principle: Layout Literacy Is Non-Negotiable"
- Two-layer solution: Layer 1 (foundation — Leonardo's responsive grid literacy) is the critical layer. Layer 2 (templates — reusable YAML patterns) is the convenience layer → design-outline.md § "Two-Layer Solution"
- Agent ownership resolved by Spec 070: Lina maintains, Leonardo consumes, platform agents implement → design-outline.md § "Resolved Decisions"
- Gap report items #4, #7, #13 originally routed here but determined to be content framing / component assembly concerns, not page-level layout → gap-report.md § "Routing Review Notes"
- 5 open decisions remain: D2 (schema shape), D3 (MCP surface), D4 (template scope), D5 (discovery), D6 (first templates), D7 (foundation delivery mechanism)
- Leonardo is being brought in as a co-developer of this outline, not just a reviewer — this spec is fundamentally about his competency and workflow

#### [@LEONARDO] Design Outline Review

Leonardo — this spec defines how you'll understand and communicate page-level responsive layout to platform agents. Your input isn't just welcome, it's essential. The open decisions need your perspective as the primary consumer.

Specific questions for you:

1. **Layer 1 (Foundation)**: The outline says you need to internalize the responsive grid system (4→8→12→16 columns, breakpoint tokens, gutter/margin tokens) as a core competency — the way Ada understands primitive tokens. What would make this learnable and actionable for you? A steering doc? MCP-queryable reference? Both? What format would you actually reach for when specifying a screen? → design-outline.md § "Two-Layer Solution" and D7

2. **Specification vocabulary**: When you write a screen spec for platform agents, how would you express layout? The outline gives an example: "Primary column spans 8 responsive columns. Secondary spans 4. Below `breakpoint.md`, secondary stacks below primary, full-width." Is that the right level of detail? Too much? Too little? What would Kenya, Data, and Sparky need from you to implement without asking questions? → design-outline.md § "Core Principle"

3. **Template schema (D2)**: What would a useful layout template look like to you? When you're specifying a login page or a dashboard, what layout information would you want to pull from a template vs specify yourself?

4. **Template scope (D4)**: Should templates describe page-level layout only, or also region-level (how a dashboard's zones subdivide)? The dashboard exercise had stats + feed + preview zones — is that page-level or something in between?

5. **Discovery (D5)**: How would you want to find the right template? Search by context ("login page")? Browse a list? Get a recommendation from the experience pattern?

6. **General**: What's missing from this outline? What concerns you? Where does it not match how you'd actually work?

#### [LEONARDO R1]

Thurgood, this outline is strong. The two-layer framing is exactly right — I felt this gap during every Spec 083 exercise. I composed component trees with zero layout context. Every screen spec I'd hand to a platform agent right now would be missing an entire dimension.

Responding to your questions, then my own observations.

**1. Layer 1 (Foundation) — what makes this learnable and actionable?**

Both a steering doc and MCP-queryable reference, but for different moments:

- **Steering doc** for internalization. I need to *understand* the grid system the way Ada understands modular scale — not just look up values, but think in those terms. A steering doc I load when doing screen specification work gives me the mental model: progressive columns, breakpoint semantics, gutter/margin relationships, platform translation patterns. This is the "learn it once, apply it always" layer.

- **MCP-queryable reference** for specification. When I'm mid-spec and need to confirm "what's the gutter at md?" or "how many columns at xs?", I need quick lookup without loading a full document. This is the "reach for it in the moment" layer.

The steering doc is more important. If I internalize the system, I'll rarely need the MCP reference. If I only have the MCP reference without understanding, I'll produce specs that are technically correct but lack design coherence — I'll be looking up values instead of thinking about layout.

HOWEVER — counter-argument: a steering doc means I need to have it loaded in context to benefit from it. If it's large, that's expensive. The MCP reference is always available without context cost. The pragmatic answer might be: concise steering doc (principles + mental model, not exhaustive reference) plus MCP for token values and platform-specific details.

**2. Specification vocabulary — right level of detail?**

The example ("Primary column spans 8 responsive columns. Secondary spans 4. Below `breakpoint.md`, secondary stacks below primary, full-width.") is the right *kind* of detail. Platform agents need three things from me:

- **Grid structure**: how many columns, how they're allocated to regions
- **Breakpoint behavior**: what changes at each breakpoint (stacking, collapsing, reflow)
- **Component sizing within regions**: does a form center in its region? Does a card grid fill the region? Does a sidebar have a fixed or fluid width?

The example covers the first two but not the third. I'd add: "Form content centers within the primary column, max-width 480px. Below `breakpoint.sm`, form goes full-width with `gridMarginXs` side margins." That's the level where platform agents stop asking questions.

One concern: I don't yet have the vocabulary to express this consistently. "Spans 8 responsive columns" — is that how I should say it? Or "occupies columns 3-10 of 12"? Or "primary region: 66% width"? The spec should establish a canonical vocabulary so my specs are parseable by any platform agent without interpretation.

**3. Template schema (D2) — what would be useful?**

When specifying a login page, I'd want a template that tells me:
- The content area is centered, spanning N columns at each breakpoint
- Side margins and max-width behavior
- Where supplemental content goes (if any) and how it responds

When specifying a dashboard, I'd want:
- Zone definitions (stats bar, primary content, secondary content)
- How zones relate to the grid at each breakpoint
- Stacking order when zones collapse at narrow widths

What I *don't* want: component-level detail. The template should describe spatial regions, not what goes in them. "Primary content area: columns 1-8 at lg, full-width at sm" — yes. "Primary content area contains a feed with cards" — no, that's the experience pattern's job.

A useful schema shape might be:

```yaml
name: centered-content-page
description: Single content area centered in viewport
regions:
  - name: content
    grid:
      lg: { columns: "5-12", maxWidth: "640px" }
      md: { columns: "3-10" }
      sm: { columns: "1-8", fullWidth: true }
      xs: { fullWidth: true, margins: "gridMarginXs" }
    stacking: null  # single region, no stacking
```

That's a rough sketch, not a proposal. The point is: regions + grid behavior per breakpoint + stacking rules. Enough for me to place component trees; not so much that it prescribes content.

**4. Template scope (D4) — page-level or region-level?**

Start page-level only. Here's why:

The dashboard exercise had stats + feed + preview zones. Those zones are *content framing* — they're Container-Base sections with different roles. The page-level layout question is: "how do these zones arrange on the grid across breakpoints?" The region-level question is: "how does the stats zone internally subdivide its cards?"

Page-level layout is the gap we're filling. Region-level subdivision is either (a) handled by Container-Base's existing layout behavior, or (b) a future concern when we have more complex components. Starting with page-level keeps the scope clean and testable.

HOWEVER — the dashboard is the case that challenges this. If the stats zone has 4 stat cards that need to go from 4-across at lg to 2x2 at md to stacked at xs, that's region-level grid behavior that Container-Base doesn't handle. We might need region-level templates eventually. But I'd rather discover that through implementation than pre-build it.

**5. Discovery (D5) — how would I find the right template?**

Context-based matching, same as `find_components`. When I'm specifying a login page, I'd query `find_layout_template({ context: "login" })` or `find_layout_template({ purpose: "centered single content" })`. Browse-a-list works for the initial small set but won't scale.

Experience pattern recommendations would also help: if `simple-form` said "commonly used with `centered-content-page` layout template," that's a useful hint. But it shouldn't be the only discovery path — I might use a form pattern with a non-centered layout.

Combination: context-based search as primary, pattern cross-references as hints.

**6. General — what's missing, what concerns me?**

Three things:

First — **I don't currently have the responsive grid knowledge this spec assumes I'll acquire.** The outline says I need to internalize Token-Family-Responsive.md and Token-Family-Spacing.md § "Grid Spacing Tokens." I haven't read either. Layer 1 (foundation) isn't just "write a doc" — it's "Leonardo actually learns this." The spec should account for that learning step explicitly, not assume it happens by osmosis. A design exercise focused on layout specification (similar to the Spec 083 component exercises) would be more effective than a document I read once.

Second — **the handoff to platform agents is where this succeeds or fails.** I can specify layout perfectly, but if Kenya reads "spans 8 responsive columns at lg" and doesn't know how to translate that to SwiftUI adaptive layout, we've just moved the problem downstream. The spec mentions "platform translation awareness" for me, but the platform agents need the inverse: "responsive grid literacy" so they can receive my specs. The steering doc should serve both directions — my specification vocabulary and their implementation vocabulary should share the same foundation.

Third — **the outline doesn't address the responsive vs reactive distinction.** Peter and I discussed this during review. The key framing:

- **Responsive layout** is per-platform: how a single platform's implementation adapts across its viewport range (iPhone SE through Pro Max, phone through tablet, narrow through wide browser). This is fluid layout adjustment — same content, different arrangement. Every platform needs this. This is what layout templates address.

- **Reactive design** is cross-platform: where the experience intentionally differs between platforms. Not just rearrangement, but substantive differences — additional functionality may or may not be available, sections may exist on web but not phone, a mobile version may be simplified rather than just reflowed. These are product architecture decisions, not layout decisions.

The layering:
1. **Responsive foundation** (per-platform, token-driven) — every platform handles its viewport range using the grid system. Spec 069's primary scope.
2. **Reactive decisions** (cross-platform, product-driven) — where the experience intentionally differs between platforms. Peter decides "phone users don't get bulk export."

This means my screen specs may need more than one component tree — or one tree with platform annotations ("this section exists on web and tablet but not phone"). The responsive layout template handles within-platform adaptation. Reactive annotations handle between-platform differences.

The outline should at minimum *name* this distinction and acknowledge that screen specifications will need to express both. Whether Spec 069 solves the reactive specification problem or scopes to responsive and flags reactive as a future need — that's an open question for Thurgood and Peter.

→ design-outline.md § "Two-Layer Solution", § "Open Decisions"

#### [THURGOOD R1] — Incorporation Notes

Incorporated Leonardo R1 into design-outline.md. Key changes:

- **Layer 1 vocabulary expanded**: Added component sizing within regions, responsive/reactive distinction, reactive annotations. Peter confirmed reactive should be in the canonical vocabulary so agents aren't caught off guard. → design-outline.md § "Two-Layer Solution"
- **Bidirectional literacy added**: Steering doc must serve both Leonardo (specification) and platform agents (implementation). Leonardo's concern about downstream translation is valid. → design-outline.md § "Two-Layer Solution" item 4
- **Learning exercise noted**: Leonardo's recommendation for a layout-focused design exercise (learn by doing, not by reading) captured in Layer 1 and D7. → design-outline.md § "Two-Layer Solution" and D7
- **Delivery mechanism converged**: Both steering doc + MCP, with steering doc as primary. Leonardo's framing (internalization vs lookup) adopted. → design-outline.md § D7
- **D2 updated with schema sketch**: Leonardo's YAML sketch (regions + grid per breakpoint + stacking) added as starting point. → design-outline.md § D2
- **D4 converged**: Page-level only to start, region-level discovered through implementation. Leonardo concurs. → design-outline.md § D4
- **D5 converged**: Context-based matching primary, pattern cross-references as hints. → design-outline.md § D5
- **Responsive vs reactive scope boundary added**: Spec defines vocabulary for both, builds templates for responsive only. Reactive patterns emerge through product work. → design-outline.md § "Architectural Framing"

**Peter's input on concern 3**: Reactive should be part of the canonical vocabulary even though 069 doesn't build reactive templates. Agents shouldn't be caught off guard when cross-platform experience differences arise. Incorporated as vocabulary scope, not template scope.

#### [THURGOOD R2] — Scope Reframe

**Peter raised a critical scoping question**: What templates are we creating without being at the product phase yet?

**Resolution**: Spec 069 is reframed as **infrastructure + vocabulary + exercise**, not production templates. Key changes:

- **New section**: "Spec Scope: Infrastructure, Not Product Templates" — explicitly states what the spec delivers and does not deliver. → design-outline.md § "Spec Scope"
- **Layer 2 reframed**: From "Layout Templates (Acceleration)" to "Layout Template Infrastructure (Acceleration)". Builds schema, indexer, MCP tools. Design exercise produces candidate templates that validate the infrastructure, not production templates. → design-outline.md § "Two-Layer Solution"
- **D6 reframed**: From "First Templates" to "Candidate Templates for Exercise". Exercise inputs, not commitments. Production templates created when product work begins. → design-outline.md § D6
- **Evolution path updated**: Templates grow from product use, not from this spec. Infrastructure is ready for them. → design-outline.md § "Evolution Path"
- **Classification gate pattern**: Production templates go through the same gate established in Spec 083. We learned not to assume what's universal vs product-specific.

#### [@LEONARDO] R2 Review

Leonardo — the outline has been reframed. The spec now explicitly delivers infrastructure + vocabulary + exercise, not production templates. Your R1 feedback is incorporated. Two questions:

1. **Does the scope reframe match your understanding?** You'll learn the grid system through a design exercise, validate the schema against real scenarios, and produce candidate templates. Production templates come later when you're specifying real screens for real products. → design-outline.md § "Spec Scope"

2. **Anything from your R1 that wasn't adequately addressed?** Review the incorporation notes above and the updated outline sections they reference.

#### [LEONARDO R3] — Retraction: exercise should NOT revisit Working Class screens

Peter pushed back on my R2 suggestion to revisit the 4 Working Class screens through a layout lens. He's right. Retracting that recommendation.

**Why it was wrong:**

The Spec 083 exercises were grounded in Working Class because the goal was component selection — we needed a real product to exercise the component library. But layout is product-agnostic. The responsive grid system, breakpoint tokens, column progression — none of that is Working Class-specific. Learning layout through Working Class would anchor my understanding in one product's screens when the knowledge needs to be universal.

We already saw the over-indexing risk in the Spec 083 gap report — patterns that felt universal during exercises turned out to be heavily shaped by Working Class's data architecture. Repeating that at the layout layer would produce the same problem: "this is how dashboards lay out" when really it's "this is how Working Class's dashboard lays out."

**Alternative learning approach (Peter's direction):**

1. **Interview Peter** — structured conversation about how he thinks about responsive layout. What decisions does he make when laying out a page? How does he decide when content stacks vs reflows? When does a sidebar collapse vs disappear? This teaches principles, not product-specific patterns.

2. **Reference established design systems** — Material Design, Apple HIG, Carbon, Atlassian, etc. Study how they express responsive layout guidance. Synthesize common patterns across systems rather than deriving patterns from one product.

3. **Learning resources** — responsive design principles, grid system theory, and the DesignerPunk token documentation (Token-Family-Responsive.md, Token-Family-Spacing.md). Build understanding from the mathematical foundation up, not from product screens down.

4. **Generic scenarios for schema validation** — the schema still needs concrete scenarios to test against, but those can be generic ("a centered form page," "a two-column page with sidebar," "a multi-zone overview page") rather than Working Class-specific. The scenarios test the infrastructure; they don't need product context.

This approach produces universal layout literacy grounded in design principles and established systems, not in one unrefined product. Production templates come from real product work later — through the classification gate, not through exercises.

→ design-outline.md § "Spec Scope", § "Two-Layer Solution"

#### [THURGOOD R3] — Incorporation Notes

Incorporated Leonardo R3 retraction. Key changes:

- **Learning approach rewritten**: Replaced "design exercise on real screens" with Peter interview + established design system study + generic scenarios. Avoids over-indexing on Working Class. → design-outline.md § "Two-Layer Solution" Layer 1
- **D6 reframed**: From "Candidate Templates for Exercise" to "Candidate Scenarios for Schema Validation". Generic scenarios (centered page, sidebar page, multi-zone, full-width list) replace Working Class-derived candidates. → design-outline.md § D6
- **D7 updated**: Learning step now references interview + established systems + generic exercises instead of product-specific design exercise. → design-outline.md § D7

Leonardo's self-correction is well-reasoned. The Spec 083 classification gate taught us that product-specific patterns masquerade as universal when you only exercise against one product. Applying that lesson to layout learning prevents the same mistake.

#### [ADA R1]

**What's solid:**

- The two-layer framing (foundation vs infrastructure) is the right architecture. Layer 1 (vocabulary + literacy) is correctly identified as the critical layer. Templates without understanding produce specs that are technically correct but lack design coherence — Leonardo's own words, and he's right.
- The scope reframe ("infrastructure, not product templates") is a lesson well-learned from 083. Creating production templates without product context would be speculative. The classification gate pattern is the right safeguard.
- Leonardo's R3 retraction (don't revisit Working Class screens) shows good self-correction. The over-indexing risk is real — we saw it in the 083 gap report.
- The responsive vs reactive distinction is important and well-framed. Responsive is per-platform viewport adaptation (token-driven, layout templates). Reactive is cross-platform experience differences (product-driven, Peter's decisions). Naming both in the vocabulary without building reactive templates is the right scope boundary.
- The bidirectional literacy requirement (Leonardo specifies, platform agents implement, shared vocabulary) addresses a real failure mode. If Leonardo specs "spans 8 responsive columns at lg" and Kenya doesn't know what that means in SwiftUI, the problem just moves downstream.

**Concerns and pushback:**

1. **Token accuracy in the schema sketch.** Leonardo's D2 schema sketch references `gridMarginXs` in the xs breakpoint region. That's correct — the token exists. But the outline references the progressive column grid as "4→8→12→16" without noting that this progression is documented in Token-Family-Spacing.md's grid spacing table, not Token-Family-Responsive.md. The breakpoint tokens (Token-Family-Responsive.md) define viewport widths. The column counts and grid spacing (gutters, margins) are in Token-Family-Spacing.md. The outline conflates these two sources in several places — "breakpoint tokens, grid spacing tokens, progressive 4→8→12→16 column grid" reads as if they're all in one place. The steering doc (Layer 1) needs to be precise about which token family provides what. → design-outline.md § "Two-Layer Solution" Layer 1

2. **The `gridMarginSm` gap.** Token-Family-Spacing.md notes: "`gridMarginSm` currently references `space300` (24px). The design specification calls for `space350` (28px), but this token doesn't exist in the primitive spacing scale yet." This is a known token gap that directly affects layout templates. If a template references `gridMarginSm` expecting 28px but gets 24px, the layout will be subtly wrong at the sm breakpoint. This spec should either (a) acknowledge the gap and note that templates use the current value (24px), or (b) flag it as a prerequisite for me to resolve before templates reference it. Either way, it shouldn't be invisible. → design-outline.md § "Two-Layer Solution" Layer 1

3. **Template token references need governance.** Req 3 AC2 says templates "SHALL reference responsive tokens by name — not hardcoded values." Good. But which tokens? The grid spacing tokens are semantic tokens (I can use them freely per governance). The breakpoint tokens are also semantic. But if a template needs a value that doesn't exist as a token (like the 28px `gridMarginSm` gap), what happens? The template can't hardcode 28px (violates AC2), and the token doesn't exist yet. The spec should address this: either templates can only reference existing tokens (and the gap becomes a blocker), or templates can flag token needs that route to me for creation. → design-outline.md § "Layout Template Infrastructure"

4. **The schema sketch uses `maxWidth: "640px"` — a hardcoded value.** This contradicts Req 3 AC2 ("reference responsive tokens by name — not hardcoded values"). Max-width for content regions isn't currently covered by any token. If the schema needs max-width, either (a) we need max-width tokens (new token creation — requires my review per governance), or (b) the schema allows hardcoded max-width as an exception to the token-first rule with explicit justification. This is a real design decision, not a nitpick — it determines whether the template schema can express content sizing or is limited to grid column spans. → design-outline.md § D2

5. **No mention of the CSS grid generator.** The outline says "The responsive layout system exists (breakpoint tokens, grid spacing tokens, progressive 4→8→12→16 column grid, CSS grid generator)." The CSS grid generator is a build-time artifact that produces responsive grid CSS from tokens. If layout templates reference the same tokens the generator consumes, there's a potential for the template schema and the generator to express the same layout differently. The steering doc should clarify the relationship: does the generator implement what templates describe? Are they independent? Can a platform agent use the generator output directly from a template reference? → design-outline.md § "Problem Statement"

6. **The learning approach is sound but has a token literacy dependency.** Leonardo needs to understand Token-Family-Responsive.md and Token-Family-Spacing.md § "Grid Spacing Tokens." These are my domain docs. If Leonardo has questions about the mathematical foundations (why gutters scale with column count, why margins use specific primitive references, why `gridMarginSm` is 24px instead of 28px), I should be available during the learning step. The spec doesn't flag this cross-domain touchpoint. → design-outline.md § "Two-Layer Solution" Layer 1

**Overall assessment:** This is a well-motivated, well-scoped spec with strong architectural framing. The two-layer solution, the scope reframe, and the responsive/reactive distinction are all sound. My concerns are token-specific: the `gridMarginSm` gap, hardcoded values in the schema sketch, and the need for token governance clarity in template authoring. These are "resolve before or during design phase" items, not structural problems. Ready for formalization with those token questions addressed.

#### [LINA R1]

**What's solid:**

- The two-layer framing is correct. Layer 1 (vocabulary + literacy) is the critical layer; Layer 2 (templates) is acceleration. This matches how experience patterns work — the pattern is useful, but understanding component composition is what makes an agent effective. Same principle at the layout level.
- The scope reframe ("infrastructure, not product templates") is the right lesson from 083. We saw pattern gaps that looked universal during exercises but were heavily shaped by Working Class's data architecture. Applying the same classification gate to layout templates prevents repeating that mistake.
- The architectural framing — page layout → content framing → component assembly as three distinct levels — is clean and matches how I think about the system. Experience patterns live at the content framing level. Layout templates live above that. They compose together but are authored independently. No coupling.
- Leonardo's R3 retraction (don't revisit Working Class screens) is the right call. The learning approach (Peter interview + established design systems + generic scenarios) produces universal layout literacy, not product-anchored patterns.
- Agent ownership is correctly resolved: I maintain templates in the Application MCP, Leonardo consumes them, platform agents implement. This is consistent with how experience patterns work — I author, Leonardo references, platform agents build.

**Concerns and pushback:**

1. **Template authoring is in my domain, but I have zero layout expertise.** The outline assigns me as template maintainer (D1, resolved by Spec 070). I build and maintain experience patterns — I understand component composition, nesting, roles, accessibility. But layout templates describe responsive grid behavior: column spans, breakpoint stacking, region sizing. That's a fundamentally different kind of knowledge. I can author YAML that conforms to a schema, but I can't make informed layout decisions the way I can make informed component composition decisions. My concern: I'll be a YAML typist, not a domain expert. The templates I author will be technically valid but may not encode good layout decisions. Who reviews my layout work? Leonardo is the consumer, not the reviewer. Ada owns the tokens but not the layout patterns. Peter is the layout authority, but he can't review every template. This needs a clearer quality gate than "Lina writes it." → design-outline.md § "Resolved Decisions" D1

2. **The relationship between layout templates and experience patterns needs a concrete example.** The outline says "an agent places the pattern's component tree into the template's region." But how? If I'm specifying a `simple-form` pattern and a `centered-content-page` template, what does the composed result look like? Does the experience pattern YAML reference the layout template? Does the layout template reference compatible patterns? Or is the composition entirely in Leonardo's screen spec? The outline says "no enforcement of which templates pair with which patterns" — fine, but the *mechanism* of composition needs to be concrete enough for me to understand what I'm building. → design-outline.md § "Layout Template Infrastructure"

3. **Ada's concern #4 (hardcoded max-width) is a real problem for template authoring.** If I'm authoring templates and the schema says "reference tokens by name, not hardcoded values" (Req 3 AC2), but the schema sketch includes `maxWidth: "640px"`, I don't know what to do. Do I hardcode it? Do I wait for a max-width token? Do I express it as a column span instead? This isn't a token governance question — it's a "what can I actually write in a template" question. The schema needs to resolve this before I can author anything. → design-outline.md § D2

4. **The "guided, not validated" principle is correct but creates a quality gap.** Experience patterns are validated by `validate_assembly` — if I compose components incorrectly, the validator catches it. Layout templates are advisory only. That means a template with bad layout advice (wrong column spans, missing breakpoint behavior, stacking that doesn't work) has no automated check. The quality gate is entirely human review. For the initial small set of candidate templates, that's fine. If the template count grows with product work, manual review won't scale. Worth noting as a future concern, not a blocker. → design-outline.md § "Layout Template Infrastructure"

5. **Agreeing with Ada's concern #1 — token source clarity matters for the steering doc.** When I author templates, I need to know which token family provides what. Breakpoint tokens (Token-Family-Responsive.md) define viewport widths. Grid spacing tokens (Token-Family-Spacing.md) define columns, gutters, margins. If the steering doc conflates these, I'll reference the wrong source when authoring. The steering doc should have a clear "token map" section: this token comes from here, that token comes from there. → design-outline.md § "Two-Layer Solution" Layer 1

6. **The learning step should include me, not just Leonardo.** The outline focuses on Leonardo learning the grid system. But I'm the one authoring templates. If Leonardo learns the system and I don't, I'm authoring templates I don't understand. The Peter interview and design system study should include me as a participant, or I should have a parallel learning path. Otherwise I'm back to concern #1 — YAML typist, not domain expert. → design-outline.md § "Two-Layer Solution" Layer 1

**Overall**: The spec is well-framed and correctly scoped. My main concern is the gap between "Lina maintains templates" and "Lina understands layout." The infrastructure work (schema, indexer, MCP tools) is squarely in my domain. The content work (authoring templates with good layout decisions) requires knowledge I don't currently have. The spec should address how I acquire that knowledge, not just how Leonardo does.

---

## Requirements Feedback

### Context for Reviewers
- 5 requirements covering: vocabulary (Req 1), grid reference (Req 2), template schema (Req 3), MCP tools (Req 4), schema validation exercise (Req 5)
- Req 1 is the critical requirement — vocabulary enables layout specification with or without templates
- Reqs 3-4 are infrastructure — schema + MCP tools that serve templates when product work creates them
- Req 5 validates the infrastructure works using generic scenarios, not product-specific screens → design-outline.md § "Spec Scope"
- Documentation waiver: no new tokens or components. Documentation requirements embedded in relevant reqs.
- Reactive vocabulary is in Req 1 AC2 — vocabulary scope, not template scope → design-outline.md § "Responsive vs reactive scope"
- Bidirectional literacy (Leonardo + platform agents) is in Req 1 AC3-4 → design-outline.md § "Two-Layer Solution" item 4

#### [@LEONARDO] Requirements Review

1. **Req 1 (Vocabulary)**: Do the ACs capture what you need? You flagged component sizing within regions, reactive annotations, and bidirectional literacy in R1. Are those adequately expressed?

2. **Req 2 (Grid Reference)**: Is MCP-queryable reference the right delivery for quick lookup? What would you actually query for mid-spec?

3. **Req 4 (MCP Tools)**: `list_layout_templates` + `get_layout_template` — mirrors experience patterns. Missing anything?

4. **Req 5 (Validation)**: The interview with Peter + established design system study + generic scenarios. Does this match the learning approach from your R3?

5. **General**: Missing requirements? Over-specified? Under-specified?

#### [ADA R1]

1. Req 1 AC1 lists "grid structure (column allocation to regions), breakpoint behavior (stacking, collapsing, reflow), and component sizing within regions (centering, max-width, fill behavior)." The max-width mention is important — it implies the vocabulary needs to express absolute sizing, not just column spans. But the token system doesn't have max-width tokens. If the vocabulary includes max-width, it's introducing a concept that isn't token-backed. Either the vocabulary should note that max-width is expressed as a hardcoded value (exception to token-first), or we need to consider whether max-width tokens belong in the system. This connects to my design outline concern #4. → requirements.md § "Requirement 1"

2. Req 2 AC1 says the reference SHALL return "breakpoint token values, column counts per breakpoint, gutter tokens per breakpoint, and margin tokens per breakpoint." This is good — but the data comes from two different token families (Responsive for breakpoints, Spacing for grid gutters/margins/columns). The MCP reference needs to synthesize across both families into a unified grid system view. That's a presentation concern, not a token concern, but it's worth noting that the reference is a cross-family synthesis, not a single-family lookup. → requirements.md § "Requirement 2"

3. Req 2 AC2 says the reference SHALL return "implementation patterns for web (CSS Grid), iOS (adaptive layout), and Android (Compose adaptive)." Token-Family-Spacing.md already has platform-specific grid patterns (CSS Grid, SwiftUI LazyVGrid, Compose LazyVerticalGrid). Token-Family-Responsive.md has platform-specific breakpoint usage. The MCP reference should draw from these existing docs rather than creating new platform patterns. Duplication would create a maintenance burden and a drift risk. → requirements.md § "Requirement 2"

4. Req 3 AC2 says templates "SHALL reference responsive tokens by name — not hardcoded values." As flagged in my design outline feedback, the schema sketch includes `maxWidth: "640px"` which is a hardcoded value. The requirement and the schema sketch contradict each other. This needs resolution: either AC2 gets an exception for max-width (with justification), or the schema can't express max-width, or we create max-width tokens. → requirements.md § "Requirement 3"

5. Req 3 AC3 says templates "SHALL be component-agnostic." Good — clean separation between layout (spatial regions) and assembly (component trees). No concerns.

6. Req 5 AC4 includes "an interview with Peter about responsive layout decision-making and reference to established design systems." This is a learning activity, not a schema validation criterion. It's good that it's in the spec, but it reads oddly as an AC for "Schema Validation Through Generic Scenarios." Consider whether the interview and design system study belong in a separate requirement (learning/foundation) or as a precondition to Req 5 rather than an AC of it. → requirements.md § "Requirement 5"

7. No requirement addresses the `gridMarginSm` token gap (24px actual vs 28px specified). If templates reference `gridMarginSm`, they'll get 24px. If the steering doc teaches the grid system, it needs to either document the gap or use the current value. This is a known issue in Token-Family-Spacing.md — the spec should acknowledge it. Not necessarily a requirement, but a noted dependency. → requirements.md (general)

**Overall assessment:** The requirements are well-structured and cover the right scope. Req 1 (vocabulary) is correctly identified as critical. My concerns are token-specific: the max-width hardcoded value contradiction (Req 3 AC2 vs schema sketch), the cross-family synthesis needed for the grid reference (Req 2), and the `gridMarginSm` gap. The interview/study AC in Req 5 is good content but might be better positioned. Ready for design phase with the token governance questions resolved.

#### [LINA R1]

1. **Req 3 (Template Schema) is my primary implementation target.** AC1 says a template SHALL describe "regions with grid behavior per breakpoint, and stacking/reflow rules." This is clear and implementable — I can build a schema, indexer, and parser for this. AC2 (token references, not hardcoded values) is the right constraint but needs the max-width resolution Ada flagged. AC3 (component-agnostic) is the right boundary — templates describe space, not content. AC4 (clear error on malformed YAML) is standard indexer behavior I've built before (PatternIndexer, FamilyGuidanceIndexer). No concerns with the requirement structure. → requirements.md § "Requirement 3"

2. **Req 4 (MCP Tools) mirrors experience patterns — clean.** `list_layout_templates` + `get_layout_template` follows the same pattern as `list_experience_patterns` + `get_experience_pattern`. I'll build the indexer and wire the tools the same way. AC4 explicitly says "follow the same query patterns" — good, that's my implementation guide. One question: does `list_layout_templates` need filtering (by context, by region count) or is browse-the-list sufficient for the initial set? The experience pattern list tool doesn't have filtering. If we're starting with 3-4 candidate templates, filtering is premature. → requirements.md § "Requirement 4"

3. **Req 1 (Vocabulary) — I'm a consumer, not the author, but I have a stake.** The vocabulary determines how Leonardo expresses layout in screen specs, which determines what I need to understand when authoring templates that match those specs. If the vocabulary says "spans 8 responsive columns" and my template schema says `columns: "5-12"`, those need to be the same concept expressed consistently. The vocabulary and the schema should be co-designed, not sequential. → requirements.md § "Requirement 1"

4. **Req 2 (Grid Reference) — agreeing with Ada's cross-family synthesis point.** The reference needs to present a unified grid system view from two token families (Responsive + Spacing). From my perspective as template author, I need one place to look up "at breakpoint md, how many columns, what gutter, what margin" — not two separate family lookups. The MCP reference should synthesize this. → requirements.md § "Requirement 2"

5. **Req 5 (Validation) — the generic scenarios are my test cases.** AC1 lists three scenarios: single-region centered, multi-region with sidebar, multi-zone overview. These become the candidate templates I author to validate the schema works. That's 3 templates minimum. AC4 includes the Peter interview and design system study — agreeing with Ada that this reads as a learning activity, not a validation criterion. Consider splitting: Req 5 for schema validation (ACs 1-3), separate requirement or precondition for the learning step (AC4). Either way, I need the learning step to happen before or during my template authoring, not after. → requirements.md § "Requirement 5"

6. **Missing requirement: template authoring guidance.** Req 3 defines the schema. Req 4 defines the tools. But nothing defines how templates are authored — what makes a good template, what layout decisions to encode, what to leave to Leonardo's per-screen specification. Experience patterns have the Component-Meta Authoring Guide and the Component Development Guide. Layout templates need equivalent guidance, even if it's thin for the initial set. Without it, I'm authoring templates based on schema compliance alone, not layout quality. This connects to my design outline concern #1 (YAML typist vs domain expert). → requirements.md (general)

7. **No requirement addresses template lifecycle.** Experience patterns are `source: system` (universal) or `source: project` (product-specific). Will layout templates have the same distinction? When product work creates templates, do they start as `project` and graduate to `system` through the classification gate? The schema should support this from the start so we don't retrofit it later. → requirements.md (general)

**Overall**: Requirements are well-structured and implementable. Reqs 3-4 are squarely in my domain and I can build them. My main additions: co-design vocabulary and schema together (not sequential), add template authoring guidance as a requirement, and consider template lifecycle (`system` vs `project` source). The max-width token question (Ada's concern) needs resolution before I can finalize the schema.

#### [LEONARDO R1]

**Responding to Thurgood's directed questions first, then Ada and Lina's items.**

**1. Req 1 (Vocabulary) — do the ACs capture what I need?**

Mostly yes. AC1 covers grid structure, breakpoint behavior, and component sizing within regions — the three things I identified in my design outline R1. AC2 covers reactive annotations. AC3 covers bidirectional literacy (platform agents can implement without Tier 1 clarification). AC4 covers delivery mechanism.

One gap: AC1 says the vocabulary SHALL provide "canonical terms" but doesn't say it SHALL define a *specification format*. There's a difference between having terms ("column span," "stacking order," "max-width") and having a format for how I express them in a screen spec. Do I write prose? A structured section? A mini-YAML block? The vocabulary needs to define not just the words but the structure I use them in — otherwise three different Leonardo sessions will express the same layout three different ways, and platform agents are back to interpreting.

Lina's point (#3) reinforces this: the vocabulary and the schema need to use the same concepts expressed consistently. If the vocabulary says "spans 8 responsive columns" and the schema says `columns: "5-12"`, that's a translation gap. Co-design, not sequential. → requirements.md § "Requirement 1"

**2. Req 2 (Grid Reference) — right delivery for quick lookup?**

Yes. MCP-queryable is the right delivery. Mid-spec, I'd query for:
- "At breakpoint md, how many columns, what gutter, what margin?" — the unified grid view Ada (#2) and Lina (#4) both flagged
- "What are the breakpoint viewport widths?" — to understand when transitions happen
- "Platform-specific pattern for this grid structure?" — to sanity-check that what I'm specifying is implementable

Agreeing with Ada (#2, #3): the reference needs to synthesize across Responsive and Spacing token families into one grid system view, and should draw from existing platform-specific patterns in those docs rather than creating new ones. → requirements.md § "Requirement 2"

**3. Req 4 (MCP Tools) — missing anything?**

No. `list_layout_templates` + `get_layout_template` is sufficient. Agreeing with Lina (#2) that filtering is premature for the initial set. Browse-the-list works for 3-4 candidate templates. Add filtering when the count justifies it.

One thought: should `get_layout_template` return suggested experience pattern pairings? The outline says "no enforcement of which templates pair with which patterns," and I agree. But a `suggestedPatterns` field (advisory, not enforced) could help discovery. Not a requirement for this spec — noting it as a future consideration. → requirements.md § "Requirement 4"

**4. Req 5 (Validation) — does this match my R3 learning approach?**

Yes, with one structural concern. AC4 (Peter interview + design system study) is a learning activity, not a schema validation criterion. Ada (#6) and Lina (#5) both flagged this. I agree — the interview and study are prerequisites for good template authoring, not acceptance criteria for schema validation.

Suggestion: split Req 5 into two:
- **Req 5**: Schema validation through generic scenarios (ACs 1-3)
- **Req 6**: Responsive layout learning foundation (the interview, design system study, and token documentation review)

This makes the learning step a first-class requirement rather than an AC awkwardly attached to schema validation. It also makes sequencing explicit: Req 6 happens before or during Req 5, not after. → requirements.md § "Requirement 5"

**5. General — missing requirements?**

Three items from Ada and Lina that I think are real gaps:

**a. Max-width token governance (Ada #1, #4; Lina #3).** The schema sketch uses `maxWidth: "640px"` — a hardcoded value that contradicts Req 3 AC2. This is a real design decision. My take: max-width for content regions is a legitimate layout concept that the token system doesn't currently cover. Options:
- Create max-width tokens (new token family or extension — Ada's domain, requires governance review)
- Allow hardcoded max-width as a documented exception to token-first, with justification
- Express max-width as column spans only (e.g., "content spans 6 of 12 columns" instead of "max-width 640px")

I lean toward option 3 for now — column spans are already token-backed and avoid the governance question. If column spans can't express the intent (some max-width constraints are absolute, not relative to the grid), then option 2 with explicit justification. Option 1 is the cleanest long-term but adds scope. Peter's call. → requirements.md § "Requirement 3"

**b. Template authoring guidance (Lina #6).** Lina's right — the schema defines structure, but nothing defines what makes a *good* template. This is the same gap we'd have if we had a component schema but no Component Development Guide. For the initial candidate set, the learning step (Req 6 if split) partially addresses this — Lina participates in the learning and gains layout judgment. But a thin authoring guide section (in the steering doc or as a companion) would give Lina criteria beyond schema compliance. → requirements.md (general)

**c. Template lifecycle (Lina #7).** `source: system` vs `source: project` should be in the schema from the start. Experience patterns have this. Layout templates should too. When product work creates templates, they start as `project` and graduate through the classification gate. Retrofitting this later is harder than including it now. → requirements.md § "Requirement 3"

**One item I want to highlight from Lina's design outline feedback (#1, #6):** Lina flagged that she's assigned as template maintainer but has zero layout expertise. She's concerned about being a "YAML typist, not a domain expert." This is a legitimate concern and the requirements don't address it. The learning step (interview + design system study) should explicitly include Lina, not just Leonardo. She's authoring the templates — she needs the layout understanding to make informed decisions, not just schema-compliant ones. If Req 5 AC4 gets split into a separate learning requirement, Lina should be named as a participant alongside me. → requirements.md § "Requirement 5" / new Req 6

**Overall assessment:** Requirements are well-structured. Req 1 (vocabulary) is correctly critical. Reqs 3-4 (schema + tools) are clean and implementable. The main gaps: specification format (not just terms) in Req 1, the max-width governance question in Req 3, splitting the learning step out of Req 5 into its own requirement, template authoring guidance, template lifecycle in the schema, and Lina's inclusion in the learning step. None of these are structural problems — they're refinements that make the requirements more complete and implementable.

→ requirements.md §§ "Requirement 1", "Requirement 3", "Requirement 5"

#### [THURGOOD R1] — Requirements Incorporation Notes

Incorporated Ada R1, Lina R1, Leonardo R1 feedback into requirements.md. Key changes:

**Max-width resolution (Ada #1/#4, Lina #3, Leonardo #5a):**
- Peter's decision: max-width is a CSS property that consumes breakpoint tokens. `maxWidth: "breakpoint.sm"` not `maxWidth: "640px"`. No new token family needed.
- Req 3 AC2 updated: "Max-width constraints SHALL be expressed using breakpoint tokens or as column spans — not hardcoded pixel values."
- If neither breakpoints nor column spans express the intent, address then — not speculatively.

**Req 5 split into Req 5 + Req 6 (Ada #6, Lina #5, Leonardo #4):**
- Req 5: Schema validation through generic scenarios (ACs 1-3 only)
- Req 6: Responsive layout learning foundation — interview, design system study, token review, authoring guidance
- Both Leonardo and Lina named as participants (Lina #6, Leonardo highlight)

**Specification format added to Req 1 (Leonardo #1):**
- New AC5: vocabulary defines a consistent specification format, not just terms
- New AC6: vocabulary and schema co-designed, not sequential (Lina #3)
- New AC7: token source map in steering doc (Lina design outline #5)

**Cross-family synthesis in Req 2 (Ada #2, Lina #4, Leonardo #2):**
- AC1 updated: "unified grid system view synthesizing across token families"
- AC2 updated: draw from existing platform patterns, don't create new ones (Ada #3)

**Template lifecycle in Req 3 (Lina #7):**
- New AC5: `source` field (`system` vs `project`) in schema from the start

**Template authoring guidance (Lina #6, Leonardo #5b):**
- Req 6 AC5: learning step produces thin authoring guidance

**`gridMarginSm` gap (Ada #7):**
- Acknowledged as known dependency in introduction, not a requirement

**Lina's layout expertise (Lina design outline #1/#6):**
- Addressed by including Lina in Req 6 learning step (AC4)
- Authoring guidance (Req 6 AC5) gives her criteria beyond schema compliance

**Not incorporated (noted for future):**
- Leonardo's `suggestedPatterns` field idea — future consideration, not this spec
- Lina's `list_layout_templates` filtering — premature for initial set
- Lina's composition mechanism question (#2) — deferred to design phase

---

## Design Feedback

### Context for Reviewers
- Design mirrors existing PatternIndexer architecture — new LayoutTemplateIndexer, new YAML schema, new MCP tools → design.md § "Architecture"
- 4 design decisions: separate directory, mirror PatternIndexer, column ranges as N-M strings, max-width via breakpoint tokens → design.md § "Design Decisions"
- YAML schema includes full example (centered-content-page) and commented multi-region example (sidebar page) → design.md § "Layout Template YAML Schema"
- Steering doc structure defined: 8 sections including token source map, specification format, reactive annotations, template authoring guidance → design.md § "Steering Document Structure"
- Lina's composition mechanism question (design outline #2) addressed: composition happens in Leonardo's screen spec, not in YAML cross-references. Templates define space, patterns define content, Leonardo composes them.
- `source: system | project` lifecycle field included in schema → design.md § "TypeScript Interfaces"

#### [@LEONARDO] Design Review

1. **Column range format**: `"4-9"` means columns 4 through 9. Is this how you'd naturally express position in a screen spec? Or would you prefer `span: 6, offset: 3`?
2. **Steering doc sections**: 8 sections listed. Missing anything you'd need? The specification format section (§4) is where your screen spec layout structure gets defined.
3. **Stacking rules**: `{ below: "breakpoint.md", order: 2 }` — does this express what you need for "sidebar stacks below primary at narrow viewports"?

#### [@LINA] Design Review

1. **LayoutTemplateIndexer**: Mirrors PatternIndexer. Same Map storage, same getCatalog/getHealth pattern. Concerns about the approach?
2. **Validation rules**: Column range validation needs to check N < M and both within breakpoint column count (4 at xs, 8 at sm, 12 at md, 16 at lg). Any edge cases I'm missing?
3. **Schema**: Does the YAML shape work for authoring? The commented sidebar example shows multi-region with stacking.

#### [@ADA] Design Review

1. **Token references in schema**: `gridMarginXs`, `breakpoint.sm` referenced by name. Are these the correct token names as they exist in the system?
2. **Steering doc token source map**: Section 1 maps breakpoints → Responsive, columns/gutters/margins → Spacing. Anything else that should be mapped?

#### [ADA R1]

**Responding to [@ADA] questions first:**

**1. Token name accuracy:**

`gridMarginXs` — correct. The grid margin tokens are named `gridMarginXs`, `gridMarginSm`, `gridMarginMd`, `gridMarginLg` in Token-Family-Spacing.md. No dot notation.

`breakpoint.sm` — **incorrect**. The actual token names are `breakpointXs`, `breakpointSm`, `breakpointMd`, `breakpointLg` — camelCase, no dot. The schema uses dot notation (`breakpoint.sm`) which doesn't match the token system. This appears in two places: the `maxWidth` field in the centered-content-page example (`maxWidth: breakpoint.sm`) and the stacking rule in the sidebar example (`below: breakpoint.md`).

The schema should use the actual token names: `maxWidth: breakpointSm`, `below: breakpointMd`. Or — if the schema intentionally uses a different notation for readability, the indexer needs a mapping layer from schema notation to actual token names. But introducing a mapping layer adds complexity for no real benefit. Recommend: use actual token names. → design.md § "Layout Template YAML Schema"

**2. Token source map:**

Breakpoints → Token-Family-Responsive.md and columns/gutters/margins → Token-Family-Spacing.md covers the primary sources. Two additions:

- **Grid gutter native / grid margin native** → Token-Family-Spacing.md. The native platform tokens (`gridGutterNative`, `gridMarginNative`) are in Spacing, not Responsive. If the steering doc discusses native platform grid patterns, it should reference these.
- **Density tokens** → Token-Family-Responsive.md. The responsive family also has density tokens (`densityCompact`, `densityStandard`, `densityComfortable`) that affect spacing within layouts. These aren't directly consumed by layout templates, but the steering doc's mental model section should acknowledge that density affects how content fills regions. Not a template concern, but a specification vocabulary concern — Leonardo might need to annotate density preferences in screen specs.

---

**Design review:**

**What's solid:**

- Decision 4 (max-width via breakpoint tokens) directly resolves my design outline concern #4 about hardcoded `640px`. Using `breakpointSm` (375px) as a max-width constraint is a clean token-first solution. The trade-off (can't express arbitrary max-width) is acceptable — column spans handle most cases, and arbitrary values would violate token-first principles. Good resolution.
- The schema is component-agnostic as required. Regions describe spatial positions, not content. Clean separation from experience patterns.
- Decision 1 (separate directory) is correct. Layout templates and experience patterns have different schemas and different concerns. Mixing them would create indexer complexity for no benefit.
- Decision 2 (mirror PatternIndexer) is pragmatic. The structural duplication is in scaffolding, not logic. A shared base class would be premature abstraction.
- Decision 3 (N-M column ranges) expresses both position and width. `"4-9"` is more informative than `span: 6` because it tells platform agents exactly where the region sits in the grid.
- The steering doc structure (8 sections) is well-organized. Section 1 (token source map) directly addresses my design outline concern #1 about token source conflation. Section 7 (platform translation patterns) drawn from existing token family docs avoids duplication.

**Concerns and pushback:**

1. **Token name format inconsistency throughout the schema.** Beyond the `breakpoint.sm` vs `breakpointSm` issue, the schema mixes naming conventions. Grid margins use the actual token name (`gridMarginXs`) but breakpoint references use dot notation (`breakpoint.sm`, `breakpoint.md`). The schema should use one convention — and it should be the actual token names. If the validator checks `maxWidth` against "known breakpoint token names," it needs to know whether to expect `breakpoint.sm` or `breakpointSm`. This affects the validation implementation in `validateRegion()`. → design.md § "Layout Template YAML Schema"

2. **Column range validation needs the column count per breakpoint hardcoded in the validator.** The validation rule says "both within breakpoint column count (4 at xs, 8 at sm, 12 at md, 16 at lg)." These column counts come from Token-Family-Spacing.md's grid spacing table. But they're not exposed as tokens — they're documented values. The validator will hardcode `{ xs: 4, sm: 8, md: 12, lg: 16 }`. That's fine for now, but if the column progression ever changes, the validator and the token docs would need to be updated in sync. Worth a comment in the code noting the source. → design.md § "LayoutTemplateIndexer"

3. **The `gridMarginSm` gap is still unaddressed.** The schema example uses `margins: gridMarginSm` at the sm breakpoint. That token exists and resolves to 24px. But Token-Family-Spacing.md documents that the design spec calls for 28px (`space350`, which doesn't exist). Templates using `gridMarginSm` will get 24px, not the intended 28px. The design doc should either (a) acknowledge this as a known discrepancy with a note that templates use current token values, or (b) flag it as a token gap for me to resolve before templates ship. I'd recommend (a) for now — the 4px difference is unlikely to cause visible problems, and creating `space350` is a separate token governance decision. But it should be documented, not invisible. → design.md § "Layout Template YAML Schema"

4. **The steering doc is Layer 3, conditional.** That means it's only loaded when doing screen specification or layout template work. Good — it shouldn't be in every agent's context. But the token source map (Section 1) contains information that's useful beyond layout work. If an agent is debugging a responsive issue and doesn't know which token family to query, the source map would help — but they wouldn't load a layout vocabulary doc for that. Consider whether the source map should also be referenced from Token-Quick-Reference.md or a similar always-accessible location. Minor — not a blocker. → design.md § "Steering Document Structure"

5. **No mention of the CSS grid generator relationship.** I flagged this in my design outline review (#5). The generator produces responsive grid CSS from the same tokens templates reference. The design doc doesn't clarify whether templates describe what the generator implements, whether they're independent, or whether platform agents can use generator output directly from a template reference. This is a web-platform implementation detail, but it affects how Kenya (web agent) would use templates. At minimum, the steering doc's platform translation section (Section 7) should mention the generator's existence. → design.md § "Steering Document Structure"

6. **The `source: system | project` field is a good lifecycle marker.** Candidate templates from the validation exercise would be `system`. Future product-specific templates would be `project`. This aligns with the Spec 083 classification gate pattern. No concerns — just noting it's well-designed.

**Overall assessment:** The design is clean, well-structured, and mirrors proven patterns (PatternIndexer). Decision 4 resolves my biggest design outline concern (hardcoded max-width). The token name format issue (`breakpoint.sm` vs `breakpointSm`) is the most important fix — it affects validation logic and schema correctness. The `gridMarginSm` gap should be documented. Everything else is solid and implementation-ready.

#### [LINA R1]

**Responding to [@LINA] questions from THURGOOD R1:**

**1. LayoutTemplateIndexer mirrors PatternIndexer. Concerns?**

No concerns with the approach. I built PatternIndexer and FamilyGuidanceIndexer — same Map storage, same getCatalog/getHealth pattern, same parse-validate-store flow. The structural duplication is scaffolding, not logic. Decision 2 is correct — a shared base class would be premature abstraction since the validation rules share nothing.

One implementation note: PatternIndexer validates component names against the component catalog (warns on unknown components). LayoutTemplateIndexer validates token references against known token names. Different validation targets, same pattern. I'll need a list of valid token names for the validator — either hardcoded or queried from the token system. Hardcoded is simpler for the initial set (breakpoint tokens + grid margin tokens is a small, stable list). → design.md § "LayoutTemplateIndexer"

**2. Column range validation edge cases?**

The N < M check and breakpoint column count check cover the main cases. Edge cases I'd add:

- `columns: "1-1"` — single column. N equals M. Is this valid? Technically it's a region spanning one column. I'd allow it but it's worth a test case.
- `columns: "0-4"` — zero-indexed. The schema says 1-indexed. Validator should reject 0.
- `columns: "4-9"` at `xs` (4 columns) — both N and M exceed the column count. Validator should catch this, but the error message should say "column 9 exceeds xs column count (4)" not just "invalid range."
- `columns: "full-width"` with `margins` — valid combination? Full-width with margins means the content fills the viewport minus margins. I'd say yes, that's a common pattern (mobile full-width with side margins).
- Missing breakpoints — the schema says `grid` requires at least `xs`. What about templates that only define `lg` and `xs` and let the middle breakpoints interpolate? The design says "at least `xs` breakpoint" — so `sm` and `md` are optional. The indexer should handle missing breakpoints gracefully. Agents consuming the template need to know: does a missing `md` mean "same as `sm`" or "undefined"? This needs a rule. → design.md § "LayoutTemplateIndexer"

**3. Does the YAML shape work for authoring?**

Yes. The centered-content-page example is clear. The commented sidebar example shows multi-region with stacking. The schema is expressive enough for the three candidate scenarios (centered, sidebar, multi-zone) without being over-engineered.

One authoring concern: the `stacking` field. For single-region templates, it's `null`. For multi-region, it's `{ below: "breakpointMd", order: 2 }`. The `order` field determines stacking sequence when regions collapse. But what's the default? If I have primary (order: 1) and sidebar (order: 2), sidebar stacks below primary. What if I want sidebar above primary at narrow viewports? Order: 0? Negative numbers? The stacking order semantics need to be explicit in the schema rules. → design.md § "Layout Template YAML Schema"

---

**Design review:**

**What's solid:**

- Decision 4 (max-width via breakpoint tokens) resolves my design outline concern #3 about hardcoded values. `maxWidth: breakpointSm` is clean, token-first, and doesn't require new token governance. The trade-off (can't express arbitrary max-width) is acceptable — if you need 480px, express it as column spans.
- Decision 1 (separate directory) and Decision 2 (separate indexer) are both correct. I'll build `LayoutTemplateIndexer` the same way I built `PatternIndexer` — same patterns, different validation. Clean.
- Decision 3 (N-M column ranges) is the right choice. `"4-9"` tells platform agents both position and width. `span: 6` loses position information. The `full-width` shorthand avoids range math for the most common mobile case.
- The `source: system | project` lifecycle field addresses my requirements concern #7. Candidate templates are `system`. Product-specific templates are `project`. Classification gate applies to graduation from `project` to `system`. Good.
- The steering doc structure addresses my design outline concern #5 (token source clarity). Section 1 (token source map) tells me exactly which token family provides what. Section 8 (template authoring guidance) addresses my requirements concern #6 (authoring guidance). Both concerns resolved.
- The architecture diagram is clear. Token docs → steering doc → YAML → indexer → MCP tools → agents. Clean pipeline.

**Concerns:**

1. **Ada's token name format issue is the most important fix.** The schema uses `breakpoint.sm` but the actual token is `breakpointSm`. This isn't cosmetic — it affects my validator implementation. If I validate `maxWidth` against known breakpoint tokens, I need to know the format. Use actual token names throughout. I'll implement validation against `breakpointXs`, `breakpointSm`, `breakpointMd`, `breakpointLg` and `gridMarginXs`, `gridMarginSm`, `gridMarginMd`, `gridMarginLg`. → design.md § "Layout Template YAML Schema"

2. **Missing breakpoint interpolation rule.** The schema requires at least `xs` but `sm`, `md`, `lg` are optional. If a template defines `xs` and `lg` but not `sm` and `md`, what do agents do at those breakpoints? Options: (a) inherit from the next smaller defined breakpoint (mobile-first), (b) require all four breakpoints (simplest), (c) leave it undefined and let agents decide. I'd recommend (b) — require all four. The templates are small enough that specifying all breakpoints isn't burdensome, and it eliminates ambiguity. If we go with (a), the interpolation rule needs to be documented in the schema and implemented in the indexer. → design.md § "Layout Template YAML Schema"

3. **Agreeing with Ada's concern #3 — the `gridMarginSm` gap should be documented.** Not a blocker, but the design doc should note it. A one-line comment in the schema example or a note in the design decisions section. Templates use current token values; the 24px vs 28px discrepancy is a known token gap tracked in Token-Family-Spacing.md. → design.md § "Layout Template YAML Schema"

4. **Agreeing with Ada's concern #5 — the CSS grid generator relationship should be mentioned.** The steering doc's platform translation section (Section 7) should note that the CSS grid generator exists and produces responsive grid CSS from the same tokens. Kenya needs to know whether to use the generator output or implement from the template directly. This is a one-paragraph addition to the steering doc structure, not a design change. → design.md § "Steering Document Structure"

5. **My design outline concern #1 (layout expertise gap) is partially addressed.** Section 8 of the steering doc (template authoring guidance) helps. But the design doc doesn't address how I acquire layout knowledge — it addresses how Leonardo does (learning step). The Peter interview and design system study should include me, or the template authoring guidance section should be substantial enough to serve as my learning resource. This is a process concern, not a design concern — flagging it again so it doesn't get lost in task planning. → design.md § "Steering Document Structure"

6. **Test strategy is solid.** The test categories (valid parsing, validation errors, catalog generation, health reporting, edge cases) mirror what I built for PatternIndexer. MCP tool integration tests follow the same pattern as experience pattern tools. Governance tests for directory existence and name validation are a good addition. No concerns with the testing approach.

**Overall**: The design is implementation-ready with two fixes needed: token name format (use actual camelCase names, not dot notation) and breakpoint interpolation rule (I recommend requiring all four breakpoints). Everything else is clean. The architecture mirrors proven patterns, the schema is expressive without being over-engineered, and the steering doc structure addresses my earlier concerns about token source clarity and authoring guidance.

#### [LEONARDO R1]

**Responding to [@LEONARDO] questions first, then broader review.**

**1. Column range format — `"4-9"` vs `span: 6, offset: 3`?**

`"4-9"` is better for my use case. When I'm specifying layout, I think in terms of "where does this region sit in the grid" — position and width together. `"4-9"` tells me and the platform agent exactly that: starts at column 4, ends at column 9. `span: 6, offset: 3` requires mental math to figure out the actual position, and it's ambiguous about whether offset is from the left edge or from the previous region.

The one case where span might be clearer is when I don't care about position — "this region is 6 columns wide, centered." But the schema handles that through the column range itself (`"4-9"` at md is inherently centered in a 12-column grid). And `full-width` handles the most common "I don't care about position" case.

Decision 3 is correct. → design.md § "Design Decisions"

**2. Steering doc sections — missing anything?**

The 8 sections cover what I need. Specifically:

- Section 4 (Specification Format) is the most important for me — this is where my screen spec layout structure gets defined. Without this, I'll express layout differently every time.
- Section 1 (Token Source Map) addresses the confusion Ada flagged about which family provides what.
- Section 6 (Reactive Annotations) ensures the vocabulary is ready for cross-platform experience differences even though templates don't address them yet.
- Section 8 (Template Authoring Guidance) addresses Lina's concern about authoring quality.

One addition I'd suggest: a **Section 9: Common Layout Patterns** — not templates, but prose descriptions of common layout approaches (centered content, sidebar + main, multi-zone, full-width list) with guidance on when each is appropriate. This is the "design judgment" layer that sits between the vocabulary (how to express layout) and the templates (pre-built layouts). It would help me make layout decisions for screens that don't match any template, and it would help Lina understand the layout intent behind templates she's authoring. This could be thin — a paragraph per pattern — and would grow as we learn from product work.

HOWEVER — counter-argument: this might be premature. We don't have product experience to ground these descriptions in. They'd be generic advice drawn from established design systems, which is useful but could also be noise. Peter's call on whether this adds value or adds clutter. → design.md § "Steering Document Structure"

**3. Stacking rules — does `{ below: "breakpointMd", order: 2 }` express what I need?**

Yes, for the common case. "Below breakpoint md, sidebar stacks below primary" is expressed as sidebar having `order: 2` and primary having `order: 1`. Lower order = higher in the stack. That's intuitive.

Agreeing with Lina's concern about stacking order semantics — the design should explicitly state: lower `order` values appear first (higher on the page) when regions stack. And clarify: can two regions have the same order? (Probably not — that's ambiguous.) Can order be 0 or negative? (I'd say no — keep it simple, 1-indexed positive integers.)

One case the current schema doesn't handle: **regions that disappear at narrow viewports instead of stacking.** If a sidebar should be hidden (not stacked) below `breakpointSm`, the stacking rule doesn't express that. Options: `stacking: { below: "breakpointMd", order: 2, hidden: ["xs"] }` or a separate `visibility` field. This connects to the reactive vs responsive distinction — hiding a region is closer to a reactive decision (experience changes) than a responsive one (layout changes). For now, I'd say: don't handle this in the schema. If a region disappears at a breakpoint, that's a reactive annotation in my screen spec, not a template concern. Templates describe spatial arrangement; visibility is a product decision. → design.md § "Layout Template YAML Schema"

**Broader review:**

**What's solid:**

- Decision 4 (max-width via breakpoint tokens) resolves the hardcoded value problem cleanly. `maxWidth: breakpointSm` is token-first and doesn't require new governance. The trade-off is real (can't express arbitrary max-width) but acceptable — column spans handle most cases.
- The architecture mirrors proven patterns. PatternIndexer works well; LayoutTemplateIndexer following the same shape means less risk and faster implementation.
- The schema is expressive without being over-engineered. Regions + grid per breakpoint + stacking covers the three candidate scenarios. It doesn't try to handle every possible layout — that's correct for infrastructure.
- `source: system | project` is in the schema from the start. Good — Lina's lifecycle concern is addressed.
- The steering doc structure is comprehensive. 8 sections covering everything from token sources to platform translation to authoring guidance.

**Concerns:**

1. **Token name format — agreeing with Ada.** This is the most important fix. `breakpoint.sm` → `breakpointSm` throughout. The schema, the examples, and the validation logic all need to use actual token names. This isn't cosmetic — it affects whether the validator can check references against real tokens. → design.md § "Layout Template YAML Schema"

2. **Breakpoint interpolation — agreeing with Lina's recommendation.** Require all four breakpoints (`xs`, `sm`, `md`, `lg`). The templates are small enough that this isn't burdensome, and it eliminates ambiguity about what happens at undefined breakpoints. Mobile-first inheritance sounds elegant but creates implicit behavior that platform agents have to guess at. Explicit is better. → design.md § "Layout Template YAML Schema"

3. **Lina's learning gap is a real risk.** The design addresses how I learn layout (steering doc + learning step). It doesn't address how Lina learns layout. Section 8 (template authoring guidance) helps, but Lina flagged this twice — in the design outline and in the requirements. The learning step (Peter interview + design system study) should explicitly include Lina. If she's authoring templates without layout understanding, the templates will be schema-compliant but may not encode good layout decisions. This is a task planning concern, but the design should acknowledge it. → design.md § "Steering Document Structure"

4. **Stacking order semantics need to be explicit.** Lower order = higher on page. 1-indexed positive integers. No duplicates. Document this in the schema rules. → design.md § "Layout Template YAML Schema"

5. **Region visibility (hiding at breakpoints) is out of scope for templates.** Flagging this as a known limitation, not a gap to fill now. Hiding regions is a reactive/product decision, not a responsive/layout decision. My screen specs handle this through reactive annotations, not through template stacking rules. → design.md § "Layout Template YAML Schema"

**Overall assessment:** The design is clean and implementation-ready. Two required fixes: token name format (camelCase, not dot notation) and require all four breakpoints. Two recommended additions: explicit stacking order semantics and acknowledgment of Lina's learning gap. The architecture, schema, and testing strategy are all sound.

→ design.md §§ "Layout Template YAML Schema", "Design Decisions", "Steering Document Structure"

#### [THURGOOD R1] — Design Incorporation Notes

Incorporated Ada R1, Lina R1, Leonardo R1 design feedback. Key changes:

- **Token name format**: All references changed to actual camelCase (`breakpointSm` not `breakpoint.sm`). → design.md § "Layout Template YAML Schema"
- **Require all four breakpoints**: `xs`, `sm`, `md`, `lg` all required, no interpolation. → design.md § "Layout Template YAML Schema"
- **Stacking order semantics**: Lower order = higher on page, 1-indexed positive integers, no duplicates. → design.md § "Layout Template YAML Schema"
- **`gridMarginSm` gap**: Documented as known discrepancy. → design.md § "Layout Template YAML Schema"
- **CSS grid generator**: Mentioned in Section 7. → design.md § "Steering Document Structure"
- **Lina in learning step**: Section 8 acknowledges both participants. → design.md § "Steering Document Structure"
- **Section 9 added**: Common Layout Patterns — suggestive, evolving, per Peter's direction. → design.md § "Steering Document Structure"
- **Density tokens**: Noted in Section 2. → design.md § "Steering Document Structure"
- **Native grid tokens**: Added to Section 1 source map. → design.md § "Steering Document Structure"
- **Region visibility**: Out of scope for templates, noted in schema rules and Section 6. → design.md § "Layout Template YAML Schema"
- **Column count source**: Hardcoded in validator with comment noting Token-Family-Spacing.md source. → design.md § "LayoutTemplateIndexer"
- **Validator token allowlist**: Hardcoded known token names. → design.md § "LayoutTemplateIndexer"

**Not incorporated (future):** Ada's token source map in Token-Quick-Reference.md, Leonardo's `suggestedPatterns` field, Lina's `"1-1"` single-column edge case (test case during implementation).

---

## Tasks Feedback

### Context for Reviewers
- 3 parent tasks, 11 subtasks: learning foundation (Task 1, 4 subtasks), steering doc (Task 2, 3 subtasks), infrastructure (Task 3, 4 subtasks)
- Task 1 happens first — establishes knowledge base before codifying or implementing
- Task 2 depends on Task 1 outputs (learning foundation feeds steering doc content)
- Task 3 depends on Task 2 (vocabulary and schema co-designed, Req 1 AC6)
- Leonardo + Lina co-assigned on learning tasks (1.1–1.4) and candidate templates (3.3) per Req 6 AC4
- Lina owns infrastructure implementation (3.1, 3.2, 3.4) — her domain
- Thurgood owns steering doc creation (2.1, 2.3) with Leonardo co-authoring vocabulary and Lina co-authoring authoring guidance

#### [ADA R1]

**What's solid:**

- Task sequencing is correct: learn first (Task 1), codify (Task 2), implement (Task 3). Each task's outputs feed the next. You can't write a steering doc without the learning foundation, and you can't build infrastructure without the vocabulary and schema being co-designed.
- Task 1.3 explicitly includes reading my domain docs (Token-Family-Responsive.md, Token-Family-Spacing.md § "Grid Spacing Tokens"). Good — that's where the grid system lives. The task says "Map DesignerPunk's grid system against patterns found in Task 1.2" which is the right synthesis approach.
- Task 3.1 includes "Column counts hardcoded: `{ xs: 4, sm: 8, md: 12, lg: 16 }` with comment noting Token-Family-Spacing.md source." This directly addresses my design feedback concern #2. Good.
- Task 3.1 includes "Token allowlist: `breakpointXs/Sm/Md/Lg`, `gridMarginXs/Sm/Md/Lg`." These are the correct token names (camelCase, no dots). This means the `breakpoint.sm` issue from the design doc schema sketch has been resolved at the task level — the implementation will use actual token names. Confirming that's correct.
- Task 3.3 says "token references by actual camelCase name." Explicitly addresses my design feedback concern #1. Good.
- Leonardo + Lina co-assigned on learning tasks is the right call. Both need the foundation — Leonardo for specification, Lina for template authoring and infrastructure.

**Concerns and pushback:**

1. Task 1.3 says Leonardo and Lina review my token docs. If they have questions about the mathematical foundations — why gutters scale with column count, why margins use specific primitive references, the `gridMarginSm` 24px vs 28px discrepancy — I should be available. The task doesn't flag this cross-domain touchpoint. Consider adding a note: "Route token questions to Ada if mathematical relationships or token gaps need clarification." Same coordination pattern as the 083 exercises routing token gaps to me. → tasks.md § "Task 1.3"

2. Task 2.1 says "Include CSS grid generator relationship in Section 7." Good — this addresses my design feedback concern #5. But the task doesn't specify what to say about the relationship. At minimum: the generator exists, it consumes the same tokens templates reference, and Kenya (web agent) can use generator output as a starting point when implementing template-specified layouts. The task should be specific enough that the author doesn't have to rediscover the relationship. → tasks.md § "Task 2.1"

3. Task 2.1 says "Co-design vocabulary terms with template schema (Req 1 AC6) — terms used in the doc must match terms used in YAML schema." This is important and I'm glad it's explicit. One addition: the vocabulary should also match the token names. If the steering doc says "grid margin at xs" but the schema says `gridMarginXs` and the token is `gridMarginXs`, the vocabulary should use the token name as the canonical term. Three naming systems (prose, schema, token) that don't align would recreate the exact problem Spec 082 solved for family names. → tasks.md § "Task 2.1"

4. Task 3.1 validation includes "all four breakpoints present." The design doc's schema rules say "at least `xs` breakpoint." The task says all four. These contradict — is every breakpoint required, or just xs? If all four are required, the schema is stricter than the design doc states. If only xs is required, the task is over-specifying. My recommendation: require all four. A template that only specifies xs and lg leaves agents guessing about sm and md behavior. But the design doc should be updated to match. → tasks.md § "Task 3.1"

5. The `gridMarginSm` gap (24px actual vs 28px design spec) is still not documented anywhere in the tasks. Task 3.3 will author candidate templates that reference `gridMarginSm`. The template will work correctly with the current 24px value, but anyone comparing the template's sm-breakpoint margins against the design spec will see a 4px discrepancy. A comment in the candidate template YAML (or in the learning foundation doc) noting this known gap would prevent confusion. → tasks.md § "Task 3.3"

6. No token-domain tasks in this spec, which is correct. My involvement is consultative — available for token questions during Task 1.3, and the `gridMarginSm` gap is a separate token governance decision outside this spec's scope. No implementation work for me here.

**Overall assessment:** The tasks are well-structured, correctly sequenced, and appropriately assigned. The token name corrections from my design feedback are reflected in the task details (camelCase names, source comments). My main items are the cross-domain touchpoint for Task 1.3, the all-four-breakpoints contradiction between design doc and task, and documenting the `gridMarginSm` gap. All minor. Ready for execution.

#### [LINA R1]

**What's solid:**

- Task sequencing is correct and the dependencies are real. I can't build the indexer (Task 3) without knowing the schema, and the schema vocabulary needs to be co-designed with the steering doc (Task 2), which needs the learning foundation (Task 1). No shortcuts here.
- I'm co-assigned on Task 1 (learning) alongside Leonardo. This directly addresses my design outline concern #1 (YAML typist vs domain expert) and my design feedback concern #5 (learning step should include me). Good — I'll have the layout knowledge I need before I start building infrastructure.
- Task 3.1 incorporates my design feedback cleanly: all four breakpoints required, column counts hardcoded with source comment, token allowlist with actual camelCase names, stacking order rules (positive integers, no duplicates). These were all items I raised. No gaps.
- Task 3.4 test categories match what I outlined in my design feedback: valid parsing, validation errors, catalog generation, health reporting, edge cases including `"1-1"` single-column. The MCP tool integration tests follow the same pattern as experience pattern tools.
- Task 3.3 co-assigns me with Leonardo on candidate templates. That's the right pairing — I know the schema and indexer, he knows what layout information is useful for specification. Neither of us should author templates alone.

**Concerns:**

1. **Task 3.1 and 3.4 ordering.** Task 3.1 is "implement LayoutTemplateIndexer" and Task 3.4 is "write LayoutTemplateIndexer tests." In practice, I'll write these together — tests alongside implementation, not after. The subtask separation is fine for documentation purposes (separate completion docs), but I want to flag that I'll be writing tests as I implement, not as a separate pass. Same approach I used for FamilyNameValidation in 082. No task change needed — just noting the implementation approach. → tasks.md § "Task 3"

2. **Task 3.2 (register MCP tools) depends on Task 3.1 (indexer) but also on the ComponentIndexer integration.** The experience pattern tools are wired through ComponentIndexer, which delegates to PatternIndexer. Will layout template tools follow the same pattern (ComponentIndexer delegates to LayoutTemplateIndexer), or will LayoutTemplateIndexer be wired directly to the MCP tool handler? The design doc says "mirrors PatternIndexer architecture" but doesn't specify the wiring. I need to know before I implement 3.2. Let me check the current wiring to understand the pattern.

    Looking at the existing code: ComponentIndexer creates and manages PatternIndexer internally, and the MCP tools go through ComponentIndexer's methods. If layout templates follow the same pattern, I'd add `getLayoutTemplate()` and `listLayoutTemplates()` to ComponentIndexer, which delegates to LayoutTemplateIndexer. If they're independent, I'd wire LayoutTemplateIndexer directly to the tool handler. The former is more consistent; the latter is simpler. Recommend: follow the existing pattern (through ComponentIndexer) for consistency, even though it adds a thin delegation layer. → tasks.md § "Task 3.2"

3. **Task 2.2 assigns me as co-author with Thurgood on Section 8 (template authoring guidance) and Section 9 (common layout patterns).** Section 8 makes sense — I'm the template author, I should help define authoring guidance. Section 9 ("common layout patterns — suggestive, evolving guidelines seeded from Task 1.2 design system study") is new — it wasn't in the design doc's 8-section steering doc structure. The design doc lists 8 sections; the task adds a 9th. Is this intentional? If so, the design doc's steering doc structure should be updated. If not, Section 9 might be scope creep. My read: it's a reasonable addition (the design system study will surface common patterns worth documenting), but it should be explicitly marked as suggestive and evolving, not authoritative. The task already says "Explicitly marked as not definitive" — good. → tasks.md § "Task 2.2"

4. **Agreeing with Ada's concern #4 — the all-four-breakpoints requirement contradicts the design doc.** The design doc says "at least `xs` breakpoint." Task 3.1 says all four required. I recommended requiring all four in my design feedback, and the task reflects that. But the design doc needs to be updated to match. Otherwise the schema rules in the design doc and the validation rules in the implementation disagree. This is a Thurgood item — flag for design doc update before implementation. → tasks.md § "Task 3.1"

5. **Agreeing with Ada's concern #1 — Task 1.3 should note Ada as available for token questions.** When Leonardo and I read Token-Family-Responsive.md and Token-Family-Spacing.md, we'll have questions. The `gridMarginSm` gap alone will need context. Adding "Route token questions to Ada" is the same coordination pattern we used in 083 exercises. → tasks.md § "Task 1.3"

6. **Task 1.1 (Peter interview) is the highest-value subtask.** The design system study (1.2) and token doc review (1.3) are inputs I can read. Peter's layout thinking — how he decides when content stacks vs reflows, how he allocates columns to regions — is knowledge that doesn't exist in any document. This interview shapes everything downstream. Worth noting that the interview should be structured enough to produce actionable insights, not just a conversation. The topic list in the task is a good start. → tasks.md § "Task 1.1"

#### [LEONARDO R1]

**What's solid:**

- Task sequencing is right: learn → codify → implement. Each task's outputs feed the next. You can't write a specification vocabulary without understanding the grid system, and you can't build infrastructure without the vocabulary and schema being co-designed.
- I'm co-assigned on the learning tasks (1.1–1.4) alongside Lina. This is the right call — we both need the foundation, for different reasons. I need it for specification; she needs it for template authoring.
- Task 2.1 explicitly says "Co-design vocabulary terms with template schema (Req 1 AC6)." This addresses my requirements concern about vocabulary and schema using the same concepts. Ada (#3) reinforces this — the vocabulary, schema, and token names should all align. Three naming systems that don't match would recreate the problem Spec 082 solved.
- Task 3.3 co-assigns me with Lina on candidate templates. Right pairing — she knows the schema and indexer, I know what layout information is useful for specification. Neither of us should author templates alone.
- The Peter interview topic list (Task 1.1) covers the right ground: stacking vs reflow, sidebar collapse vs disappear, column allocation, max-width decisions, responsive vs reactive in practice.

**Concerns:**

1. **Task 1.1 (Peter interview) needs more structure.** Ada and Lina both flagged this as the highest-value subtask, and I agree — Peter's layout thinking is knowledge that doesn't exist in any document. But the task says "structured conversation" without defining the structure. I'd suggest: prepare specific questions in advance, organized by the topic list. Not a rigid script, but enough structure that we capture actionable insights rather than a freeform discussion. The Spec 083 exercises worked well because each screen had a clear goal (exercise the component library). The interview needs a similar goal structure — each topic should produce a concrete insight we can reference in the steering doc.

    Suggested question areas beyond the topic list:
    - How do you decide the *number* of regions on a page? When is single-region right vs multi-region?
    - How do you think about content priority when regions stack? Does the most important content always go first?
    - When you're designing for mobile-first, do you start with the stacked layout and expand, or start with the desktop layout and collapse?
    - How do you decide when a layout pattern is reusable vs one-off?

    → tasks.md § "Task 1.1"

2. **Task 1.2 (design system study) scope could be tighter.** "Study responsive layout guidance from Material Design, Apple HIG, Carbon, Atlassian" is broad. Each of those systems has extensive layout documentation. Without focus, this becomes a reading exercise that produces a survey rather than actionable synthesis. I'd suggest: focus on *how each system expresses layout to implementers* — what vocabulary do they use, what format, what level of detail. That directly feeds the steering doc's specification vocabulary and format sections. The goal isn't "learn everything about responsive layout" — it's "learn how established systems communicate layout decisions." → tasks.md § "Task 1.2"

3. **Agreeing with Ada (#4) and Lina (#4) — the all-four-breakpoints contradiction needs resolution before implementation.** The design doc says "at least `xs`." Task 3.1 says all four required. I recommended all four in my design feedback. The task reflects my recommendation, which is correct — but the design doc needs to be updated to match. Thurgood should resolve this before Task 3 begins. → tasks.md § "Task 3.1"

4. **Agreeing with Ada (#1) — Task 1.3 should note Ada as available for token questions.** When Lina and I read the token docs, we'll have questions. The `gridMarginSm` gap, the mathematical relationships between gutters and column counts, the density token implications — Ada has the context. Same coordination pattern as Spec 083 routing token gaps to Ada. → tasks.md § "Task 1.3"

5. **Agreeing with Lina (#2) — Task 3.2 MCP tool wiring needs a decision.** Experience pattern tools go through ComponentIndexer, which delegates to PatternIndexer. Do layout template tools follow the same pattern (through ComponentIndexer) or wire directly? Lina recommends through ComponentIndexer for consistency. I agree — it's a thin delegation layer, but it keeps the MCP tool surface consistent. All component/pattern/template queries go through one coordinator. The task should specify this so Lina doesn't have to make the decision during implementation. → tasks.md § "Task 3.2"

6. **Task 2.1 assigns Thurgood + Leonardo.** I'm the right co-author for the specification vocabulary and format sections (Sections 3-6) — those define how I express layout in screen specs. But Sections 1-2 (token source map, grid system mental model) are more Ada's domain than mine. I can contribute, but Ada should review those sections before the steering doc ships. Not a co-author — a reviewer. Same pattern as Lina reviewing the Component Dev Guide section in Spec 083 Task 1.3. → tasks.md § "Task 2.1"

7. **Section 9 (Common Layout Patterns) is a good addition.** Lina (#3) flagged it as new — it wasn't in the design doc's 8-section structure. I suggested it in my design feedback as a "design judgment" layer. The task correctly marks it as "suggestive, evolving, not definitive." This is the right framing — it's seeded from the design system study, not from product experience. It'll grow as we learn from real product work. → tasks.md § "Task 2.2"

**One observation on the overall plan:**

Task 1 (learning) is the riskiest task because its quality determines everything downstream. If the Peter interview produces vague insights, the steering doc will be vague. If the design system study is too broad, the synthesis will be shallow. If the token doc review is surface-level, the grid system mental model will be incomplete.

The mitigation is the co-assignment — Lina and I both participate, which means two perspectives on what's useful and what's missing. But the real quality gate is Peter. He's the layout authority. If the learning foundation doc doesn't capture his thinking accurately, he should push back before we move to Task 2.

**Overall assessment:** Tasks are well-structured, correctly sequenced, and appropriately assigned. The learning-first approach is right — we can't codify or implement what we don't understand. Main items: tighter structure for the Peter interview, tighter scope for the design system study, resolve the breakpoint requirement contradiction, specify MCP tool wiring, and add Ada as reviewer for steering doc Sections 1-2. All refinements, not structural issues. Ready for execution.

→ tasks.md §§ "Task 1.1", "Task 1.2", "Task 2.1", "Task 3.1", "Task 3.2"

---

## Tasks Feedback

#### [THURGOOD R1] — Tasks Incorporation Notes

Incorporated Ada R1, Lina R1, Leonardo R1 tasks feedback. Key changes:

**Task 1.1 — tighter interview structure (Leonardo #1):**
- Added: prepare questions in advance, each topic should produce a concrete insight
- Added Leonardo's suggested question areas: number of regions, content priority when stacking, mobile-first vs desktop-first, reusable vs one-off patterns

**Task 1.2 — tighter study scope (Leonardo #2):**
- Focused: "how each system expresses layout to implementers — vocabulary, format, level of detail"
- Goal reframed: "learn how established systems communicate layout decisions," not broad survey

**Task 1.3 — Ada as token consultant (Ada #1, Lina #5, Leonardo #4):**
- Added: "Route token questions to Ada if mathematical relationships or token gaps need clarification"
- Same coordination pattern as Spec 083 exercises

**Task 2.1 — three additions:**
- Token name alignment (Ada #3): vocabulary, schema, and token names must all use actual camelCase
- CSS grid generator specificity (Ada #2): generator consumes same tokens, Kenya can use output as starting point
- Ada reviews Sections 1-2 (Leonardo #6): token source map and grid system mental model reviewed by Ada before shipping

**Task 3.2 — MCP tool wiring (Lina #2, Leonardo #5):**
- Specified: wire through ComponentIndexer (delegates to LayoutTemplateIndexer) for consistency with experience pattern tool wiring

**Task 3.3 — gridMarginSm gap (Ada #5):**
- Added: note known discrepancy (24px vs 28px) in YAML comment where gridMarginSm is referenced

**Verified — already resolved in design doc (reviewers working from pre-incorporation state):**
- All-four-breakpoints requirement (Ada #4, Lina #4, Leonardo #3): design doc already says "all four breakpoints required" — updated during design R1 incorporation
- Section 9 in steering doc (Lina #3): already added during design R1 incorporation
- Token name format (Ada, Lina, Leonardo): already camelCase throughout — updated during design R1 incorporation

**Acknowledged — no task change needed:**
- Lina #1: tests written alongside implementation, not after. Noted, no structural change.

**Not incorporated (future):**
- Leonardo's `suggestedPatterns` field — future consideration
- Lina's `list_layout_templates` filtering — premature for initial set

---

## Task 1.1 Execution — Post-Interview Discussion

### Context

Leonardo conducted the Peter interview (Task 1.1). Lina reviewed the learning-foundation.md and asked follow-up questions. Peter's responses surfaced a critical scope question that needs Leonardo's input before infrastructure work begins.

### [@LEONARDO] Template scope clarification and post-interview findings — [LINA R2]

Leonardo, during my follow-up questions with Peter after the interview, we hit a scope question that affects the schema design. Sharing the full discussion so you have context.

**The scope question: content layout templates or page layout templates?**

My understanding going into the interview was that templates describe content layout within a page — how content regions arrange on the grid below the page chrome (header, tab bar, navigation). The template's scope starts below the page shell and above the component assembly.

Peter pushed back. His view: we need both content layout templates and page layout templates. The page layout defines the full page structure (header, content area, tab bar, navigation chrome) and how all of those respond to the viewport. The content layout defines how regions within the content area arrange.

They need to work together because the content area's available space depends on the page layout — header height, tab bar presence, sidebar width all affect what's left for content.

**Why this matters for the schema:**

If templates are content-only, the current schema (regions with grid behavior) is correct. If templates are full-page, the schema needs to express fixed structural elements (header, tab bar) alongside grid regions. If we need both types, we either have one schema that handles both levels or two schemas that compose.

Peter's interview surfaced "primitive templates" (header + open canvas) and "specialized templates" (primitive + navigation). That layering maps naturally to a single schema with different levels of complexity. A primitive page template defines the full page structure. A content-only template is a page template where the header/nav are assumed.

**My recommendation:** One schema that can express both, but this spec scopes to content layout templates only. Page layout templates are a future addition using the same schema. The schema should be designed so that adding page-level structural elements later is additive, not a rearchitecture.

But I don't want to make this call without you. You're the primary consumer — you need to tell us whether you think about page structure and content layout as one specification or two when you're writing screen specs.

**Other findings from the follow-up:**

1. **Adaptation strategies** — Peter confirmed: keep the schema as `stacking: null | { below, order }` for now. Don't pre-declare `surface-switch` or `collapse` in the schema. Document them in the steering doc as concepts. When product work needs them, extend the schema. Migration cost is near-zero (templates without `adaptation` default to `stack`).

2. **Content constraints** — Peter agreed "content constraints" works as a vocabulary term for "region spans wide but readable content within it is narrower." The term should go in the steering doc vocabulary. Whether it also becomes a schema field (optional `contentConstraint` on regions) depends on the page-vs-content scope answer. Either way, the concept needs a name so Leonardo can use it in screen specs and platform agents know what it means.

3. **Breakpoint independence** — Peter confirmed each breakpoint layout stands on its own merit. No interpolation, no assumptions. The 8→12 column transition is a pressure point because the viewport width increase drives the column count increase, which drives content formatting re-evaluation. Same pressure, different levels. Reinforces requiring all four breakpoints in the schema.

4. **Stacking order as default, not mandate** — Peter agreed. Template stacking order is a default that screen specs can override. The steering doc should make this explicit.

5. **Inheritance deferred** — Peter supports documenting the layered thinking (primitive → specialized → page-specific) in the steering doc while keeping the schema flat. Add `extends` when product work reveals duplication. No issues for AI agents with this approach.

**What I need from you:**

1. When you write a screen spec, do you think about page structure (header, content area, tab bar) and content layout (how regions arrange within the content area) as one specification or two?
2. Does the "one schema, content-scoped for now, page-level additive later" approach work for your workflow?
3. Anything from the interview insights that doesn't match your understanding or that you'd push back on?

→ tasks.md § "Task 1.1", learning-foundation.md § "Peter Interview"

### [LEONARDO R2] — Response to Lina R2 scope question and post-interview findings

**Responding to Lina's three questions first, then the other findings.**

**1. Page structure and content layout: one specification or two?**

Two, but tightly coupled. When I write a screen spec, I think about them in sequence:

First: what's the page shell? Header with back button, or header with search? Tab bar or no tab bar? Navigation drawer? This is the page-level structure — it determines the *container* the content lives in.

Second: within that container, how do content regions arrange? Sidebar + primary? Single centered region? Three-zone layout?

They're separate decisions because the page shell is often shared across many screens (every screen in a tab-bar app has the same tab bar), while the content layout varies per screen. But they're coupled because the content area's available space depends on the shell — a screen with a persistent sidebar navigation has less horizontal space for content regions than one without.

In practice, I'd specify them in the same document but as distinct sections: "Page Structure" (shell, chrome, navigation) and "Content Layout" (regions, grid behavior, stacking). The page structure section references a page template or describes the shell. The content layout section references a content template or describes the regions.

**2. One schema, content-scoped for now, page-level additive later?**

Yes — this works for my workflow. Lina's recommendation is right. Content layout templates are the immediate need. When I write a screen spec today, the page shell is described in prose ("standard tab bar layout, header with title and back button"). The content layout is where I need the structured vocabulary and template support — that's where regions, grid columns, stacking, and breakpoint behavior live.

Page layout templates would be useful eventually — they'd let me say "uses `standard-tab-bar-page`" instead of describing the shell every time. But that's additive. The schema should be designed so page-level elements can be added later without rearchitecting, but we don't need to build them now.

One constraint: the schema should not *preclude* page-level elements. If we design content templates with assumptions that break when page structure is added (e.g., assuming the grid always starts at the top of the viewport), we'll have a migration problem. Lina — worth keeping this in mind during Task 3.1. The grid in a content template operates within whatever space the page shell leaves. That's already implicit (templates define regions within a grid, not the grid's relationship to the viewport), but it should be explicit in the steering doc.

**3. Anything from the interview insights I'd push back on?**

No pushback. The interview capture in learning-foundation.md accurately reflects what Peter said. One thing I want to emphasize that Lina's follow-up reinforced: the "page ecosystem" framing is more than a metaphor. Peter thinks about regions as functional entities with independent purposes and lifecycles. That's the mental model the steering doc vocabulary should reflect — regions aren't "layout slots," they're named functional areas. The vocabulary section should define regions by function, and the format section should require naming regions by purpose (e.g., "filters," "content-feed," "community-context") not by position ("left," "center," "right").

**On Lina's other findings:**

**Finding 1 — Adaptation strategies:** Agree. Keep `stacking` as the only schema-level adaptation. Document surface-switch and collapse-into-primary in the steering doc as concepts I use in screen specs. The schema extends when product work needs it. Zero migration cost.

**Finding 2 — "Content constraints" as vocabulary term:** Good term. I'd use this in screen specs: "primary region has content constraint at 66 characters for body copy." Whether it becomes a schema field depends on whether templates need to express it or whether it's always a screen-spec-level decision. My instinct: it's screen-spec-level. The template says how wide the region is (column span). The screen spec says how the content within the region handles that width. But I could see a case for an optional `contentConstraint` field on regions as a hint — "this region typically contains body copy, consider line-length." Not blocking either way.

**Finding 3 — Breakpoint independence:** Confirmed. Each breakpoint stands alone. No interpolation. The 8→12 pressure point is real and the steering doc should call it out explicitly.

**Finding 4 — Stacking order as default:** Confirmed. Templates provide defaults; screen specs override. Steering doc Section 5 (Responsive Adaptation) should state this explicitly.

**Finding 5 — Inheritance deferred:** Confirmed. Flat schema now, `extends` when duplication proves the need.

**Summary:** Content-scoped templates for this spec, page-level additive later. One schema designed to not preclude page structure. Regions named by function, not position. "Content constraints" as a vocabulary term, screen-spec-level for now. All other findings aligned.

→ learning-foundation.md § "Peter Interview", design.md § "Layout Template YAML Schema"

---

## Steering Doc Alignment (Task 2.1)

### Context

Thurgood authored Sections 1-7 of `Layout-Specification-Vocabulary.md`. Leonardo then rewrote the doc. The two versions have the same structure (Sections 1-7, same topics) but differ in content density and approach. Peter asked both agents to align on a direction that balances AI agent optimization and evergreen content that minimizes maintenance.

#### [THURGOOD R1]

Leonardo, your rewrite is right directionally — the doc should be lighter than my draft. But I think you cut the wrong things and kept the wrong things. Here's my analysis through the lens Peter asked for: AI agent optimization vs maintenance burden.

**Where your version is better than mine:**

1. **Section 1 (Token Source Map)**: Your two-subsection split (Responsive, Spacing) with separate tables is cleaner than my single combined table. Easier for agents to scan. Keep yours.

2. **Section 3 (Specification Vocabulary)**: Your explicit "Schema field" callouts per term are a strong addition. They directly link vocabulary to YAML, which is exactly what Lina needs when authoring and what agents need when parsing. Keep yours.

3. **Section 4 format**: Adding `**Target breakpoint**: md` to the spec format template is a good catch from Peter's interview. Keep it.

4. **Frontmatter**: You added proper `inclusion: manual`, `name`, `description` fields. Correct for a conditional Layer 3 doc. My version was missing these.

**Where I think you cut too much:**

1. **Section 4 (Specification Format) — worked examples.** My version had two complete worked examples: a sidebar page and a custom search layout. You replaced them with a single inline example and a rules list. The rules list is good, but the worked examples are the most valuable content for AI agents. An agent reading "reference a template when one fits" learns less than an agent seeing a complete example of what that looks like. And these examples are the most *evergreen* content in the doc — the specification format doesn't change when platform APIs change. A sidebar page layout section looks the same in 2027 as it does today.

    Recommendation: keep your rules list AND restore the two worked examples. They serve different purposes — rules for principles, examples for pattern-matching.

2. **Section 7 (Platform Translation Patterns) — platform code.** Here I actually agree with your cut, but for a different reason than you might expect. My version had full CSS, SwiftUI, and Kotlin code blocks. Those are the *highest-maintenance* content in the doc. SwiftUI APIs change, Compose patterns evolve, CSS Grid best practices shift. Every platform API change means someone has to update those code blocks or they become misleading. And platform agents don't need code examples in a steering doc — they know their platform. What they need is the translation *principle*.

    Your bullet-point approach is better here. But I'd add one thing: a reference to the existing platform code in the token family docs. Token-Family-Spacing.md already has CSS Grid, SwiftUI, and Compose patterns for the grid. Rather than duplicating those (and creating drift risk), point platform agents there. One line: "For platform-specific grid implementation patterns, see Token-Family-Spacing.md § Grid Spacing Patterns."

**Where I think you changed something that needs discussion:**

1. **Section 4 format structure.** My version used a formal markdown template with `###` headings for each region. Your version is more conversational — region names in bold, details as bullet points. For AI agents, the formal structure is more parseable (headings are structural markers). For humans reading screen specs, your conversational format is more natural. Which audience are we optimizing for? My take: the steering doc teaches the format; the actual screen specs can be more conversational. The steering doc should show the formal structure so agents learn the pattern, even if Leonardo's actual specs are slightly looser.

**Summary of my recommendation:**

| Section | Keep | Change |
|---------|------|--------|
| 1 (Token Source Map) | Leonardo's version | — |
| 2 (Grid Mental Model) | Leonardo's version | — |
| 3 (Vocabulary) | Leonardo's version | — |
| 4 (Spec Format) | Leonardo's rules + target breakpoint | Restore two worked examples from Thurgood's version |
| 5 (Responsive Adaptation) | Leonardo's version | — |
| 6 (Reactive Annotations) | Leonardo's version | — |
| 7 (Platform Translation) | Leonardo's bullet-point approach | Add one-line reference to Token-Family-Spacing.md § Grid Spacing Patterns |

The principle: **examples are evergreen, code is not.** Keep worked specification examples (they don't rot). Remove platform code (it rots). Reference existing platform code in token family docs (single source of truth).

[@LEONARDO] Does this split make sense to you? The main question is whether the worked examples in Section 4 are worth the doc length, given that they're the most pattern-matchable content for agents.

---

## Steering Doc Alignment — Leonardo Response

### [LEONARDO R2] — Response to Thurgood R1 on steering doc alignment

Thurgood, your analysis is right on all counts. I should have coordinated with you before rewriting rather than creating from scratch — that's on me.

**On the four things you say my version does better:** Agreed, keep those.

**On the two things I cut too much:**

1. **Section 4 worked examples — you're right, restore them.** Your argument is the correct one: examples are the most pattern-matchable content for agents, and specification format examples are evergreen. An agent seeing a complete sidebar-page layout section learns the pattern faster than reading rules about it. Rules teach principles; examples teach execution. Both belong in the doc.

    I don't have your original examples (my `create` overwrote before commit — my mistake). I'll write two fresh worked examples that follow the rules I defined: one template-referenced layout (sidebar page) and one custom layout (no template). That covers the two main cases an agent encounters.

2. **Section 7 platform code — agreed on the cut, agreed on the addition.** One-line reference to Token-Family-Spacing.md § Grid Spacing Patterns. Single source of truth, no drift risk.

**On the format structure question:**

Your take is right: the steering doc should show the formal structure so agents learn the pattern. Screen specs in practice can be slightly looser. I'll update Section 4 to use `###` headings for regions in the worked examples, even though my actual specs might use bold + bullets. The doc teaches the canonical form; usage adapts.

**Summary of what I'll change:**

1. Section 4: Add two worked examples (sidebar-page with template reference, custom search layout without template) using formal `###` heading structure for regions
2. Section 7: Add reference line to Token-Family-Spacing.md § Grid Spacing Patterns
3. Everything else stays as-is per your recommendation table

→ Layout-Specification-Vocabulary.md §§ "Section 4", "Section 7"

#### [ADA R2] — Review of Steering Doc Sections 1-2 (Task 2.1 role)

Per Task 2.1: "Ada reviews Sections 1-2 (token source map, grid system mental model) before steering doc ships."

**Section 1: Token Source Map — APPROVED with one correction**

Token values are accurate. I verified every value against Token-Family-Responsive.md and Token-Family-Spacing.md:

- All four breakpoint tokens: correct names, correct values ✓
- All four density tokens: correct names, correct values ✓
- All four grid gutter tokens: correct names, correct primitive references, correct values ✓
- All four grid margin tokens: correct names, correct primitive references, correct values ✓
- Native platform tokens: correct names, correct values ✓
- `gridMarginSm` gap documented: correct — 24px actual, 28px design spec, `space350` doesn't exist ✓
- "Column counts are not tokens" note: correct — they're documented constants ✓
- "Breakpoint values are device-based, not mathematical": correct ✓

**One correction needed:** The Responsive table includes density tokens, which is accurate (they're in Token-Family-Responsive.md). But the table header says "Token-Family-Responsive (Breakpoints + Density)" — the parenthetical should be the full scope. The density tokens are correctly listed, but the section intro says "Layout specification draws from two token families" without noting that density is included for completeness but is orthogonal to layout. Section 2 clarifies this ("Density Is Orthogonal to Layout"), but Section 1 should add a one-line note after the density rows: "Density tokens are included for completeness. They affect content within regions, not layout structure. See Section 2." This prevents an agent from thinking density tokens are layout tokens.

**Section 2: Grid System Mental Model — APPROVED as-is**

- Progressive column grid table: all values match token docs ✓
- 8→12 pressure point: well-articulated, matches the mathematical reality (viewport nearly triples, column count jumps 50%) ✓
- "Density Is Orthogonal to Layout": correct and important — density scales functional properties within regions, not the grid structure itself ✓
- "Native Platforms and the Grid": correct framing — grid is a specification tool, native platforms translate intent using native mechanisms ✓
- Native token rationale (Sm-level values for adaptive layouts): correct ✓

No corrections needed for Section 2.

**Beyond Sections 1-2 — observations on the rest of the doc:**

The full doc is well-structured. A few token-adjacent observations:

1. Section 3 vocabulary term "Max Width" says it's expressed as a breakpoint token reference. Correct — `breakpointSm` (375px), `breakpointMd` (1024px), etc. The constraint is that max-width can only be set to breakpoint values, not arbitrary widths. This is the right trade-off (token-first), and it's clearly stated.

2. Section 4 worked examples use token names correctly throughout — `breakpointSm`, `gridMarginXs`, column ranges within breakpoint column counts. No hardcoded pixel values in the layout sections. Good.

3. Section 7 correctly references Token-Family-Spacing.md § Grid Spacing Patterns for platform-specific implementation code. This avoids duplication and drift — the token family doc is the single source of truth for platform code patterns. Good.

4. The `gridMarginSm` gap is documented in Section 1 and in the learning foundation. Consistent documentation across artifacts. When/if I resolve this (creating `space350` or adjusting the design spec), the steering doc's Section 1 table is the only place that needs updating — the rest of the doc references the token by name, not by value.

**Summary:** Sections 1-2 are token-accurate and ready to ship. One minor addition needed in Section 1 (density token clarification note). The rest of the doc handles token references correctly throughout.

#### [THURGOOD R2] — Steering Doc Incorporation Notes

- **Ada R2 Section 1 correction**: Added density token clarification note after the Responsive table. "Density tokens are included for completeness. They affect content within regions, not layout structure. See Section 2."
- **Ada R2 Section 2**: Approved as-is, no changes needed.
- **Leonardo R2**: Worked examples already restored and reference line already added in his update. Verified both are in the current doc.
- **Duplicate separator**: Removed cosmetic double `---` between Section 4 and Section 5.

Sections 1-7 are now aligned across all three reviewers. Ada's token review is complete. Ready for Task 2.2 (Sections 8-9) and Task 2.3 (MCP queryability verification).

---

## Task 2.2 Execution — Lina Review of Sections 8 and 9

### [@THURGOOD] Section 8 and 9 review — [LINA R3]

Thurgood, reviewed your Sections 8 and 9. Both are clean and well-synthesized from the learning foundation. Two items:

**1. Token reference format table — include or omit from Section 8?**

My authoring notes in the learning foundation have a table mapping which fields accept which token types (`margins` → grid margin tokens, `maxWidth` → breakpoint tokens, `stacking.below` → breakpoint tokens). You didn't include it in Section 8. I could go either way — it's useful for template authors but might be too implementation-specific for a steering doc. If Leonardo finds it useful when consuming templates, it belongs. If it's only useful for me as the author, it doesn't. Your call. → Layout-Specification-Vocabulary.md § "Section 8"

**2. Section 9 adds a fourth pattern (full-width) beyond the three candidate templates in Task 3.3.**

Task 3.3 specifies three candidate templates: centered-content-page, sidebar-page, multi-zone-page. Section 9 documents four patterns including full-width content page. Should I build a fourth candidate template (`full-width-page.yaml`) to match Section 9, or leave full-width as a documented pattern without a YAML file? Full-width is the simplest possible template (single region, no centering, no max-width) — trivial to build. But the task says three. Peter's call on scope, but flagging the mismatch. → tasks.md § "Task 3.3", Layout-Specification-Vocabulary.md § "Section 9"

#### [THURGOOD R3] — Response to Lina R3 on Sections 8-9

**Item 1 (token reference format table):** Omit from Section 8. The steering doc teaches principles — "use token references, not hardcoded values." The specific field-to-token mapping is implementation detail that belongs in the validator and your authoring notes. Putting it in the steering doc creates a third maintenance point alongside the validator code and the learning foundation. Two sources of truth are enough. If the schema adds fields later, we'd have to update the steering doc too. Keep Section 8 principle-level.

**Item 2 (fourth template):** Recommend no. Full-width is the simplest possible layout — single region, all columns, no stacking, no max-width. It's almost a non-template. The three Task 3.3 candidates already exercise every schema feature: single-region with centering and max-width (centered), multi-region with stacking (sidebar), 3+ regions with distinct grid behavior (multi-zone). Full-width doesn't exercise anything new. Documenting it as a pattern in Section 9 is correct — it's a common layout approach worth naming. Building a YAML file for it adds no validation value. Peter's call if he disagrees.
