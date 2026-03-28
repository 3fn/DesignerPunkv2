# Spec 086 Research Analysis: Component Discoverability

**Date**: 2026-03-27
**Analyst**: Thurgood
**Participants**: Leonardo, Sparky, Kenya, Data, Stacy, Lina
**Method**: Isolated per-agent research docs with role-specific tasks and general questions. Agents did not read each other's responses.

---

## Executive Summary

Six agents independently confirmed that the Application MCP's primary value is DesignerPunk-specific knowledge — component selection guidance, behavioral contracts, composition rules, and design philosophy decisions. The MCP is not valuable when it restates what agents already know from general platform experience.

The top discoverability problem is a vocabulary mismatch: product agents think in use cases ("notification item," "stat card"), the MCP thinks in component names ("Container-Card-Base," "Badge-Count-Base"). The `purpose` field bridges this gap inconsistently.

Seven findings emerged, prioritized by cross-agent agreement and impact.

---

## Finding 1: Vocabulary Mismatch (Critical)

**Agents**: Leonardo, Sparky, Data (consumers); Lina (author)

Product agents search by use case ("filter bar," "unread count," "stat card"). The MCP indexes by component name and implementation-focused purpose text. When the vocabulary doesn't match, search fails silently — agents get empty results and fall back to browsing the catalog manually.

**Evidence**:
- Leonardo: "I'd never search for 'elevation' or 'border radius' — I'd search for 'group related content' or 'interactive content block'"
- Sparky: "`find_components` with purpose 'filter chip' returns nothing... only if I know the DesignerPunk vocabulary"
- Lina: "I'm optimizing for search terms I can't predict — I don't know what queries Leonardo or the platform agents will actually use"

**Root cause**: `purpose` fields describe what components *do* structurally, not what product problems they *solve*. The author (Lina) has no data on what consumers actually search for.

**Recommended fix**: Rewrite `purpose` fields to answer "what product problem does this solve?" Use Leonardo's actual search terms from this research as the baseline vocabulary. This is a content fix — no infrastructure needed.

---

## Finding 2: MCP Value Is DesignerPunk-Specific Knowledge (Validated)

**Agents**: All six, independently

Every agent confirmed the same boundary: the MCP is valuable for what's specific to DesignerPunk, not for general design/platform knowledge.

**What's valuable** (agents wouldn't know without the MCP):
- Component selection rules and alternatives with rationale
- Behavioral contracts with WCAG references
- Composition rules and constraints
- DesignerPunk-specific design decisions ("no disabled states," `aria-pressed` vs `aria-selected`)
- Token semantics (`tapAreaRecommended` vs `space600`)
- What components actually exist vs. what agents assume should exist

**What's not valuable** (agents already know):
- How to write SwiftUI/Compose/Web Components
- General accessibility patterns
- How to structure a form or dashboard
- CSS custom property mechanics

**Implication**: Metadata authoring should focus on encoding non-obvious, DesignerPunk-specific decisions. Lina confirms: "the value is in the non-obvious guidance." Obvious entries like "use a count badge to display counts" waste authoring effort.

---

## Finding 3: Platform-Specific Implementation Gap (Significant, Intentional)

**Agents**: Sparky, Kenya, Data

All three platform engineers want platform-specific API details from the MCP: Custom Element tags, Composable signatures, SwiftUI view names, token constant paths. Currently they fall back to reading source code for implementation details.

**Evidence**:
- Sparky: "The MCP gets me 70% of the way; the last 30% requires source diving"
- Kenya: "I always have a translation step... MCP metadata → mental model → actual code"
- Data: "My workflow is 20% MCP for discovery/selection → 80% source code for implementation"

**Counter-argument** (Kenya's meta-observation): "Baking iOS-specific implementation details into the MCP risks coupling the component metadata to platform implementation choices that should remain flexible."

**Assessment**: This gap may be architecturally correct. The MCP is a design system oracle (what to build), not a platform implementation guide (how to build it). Closing this gap would require either:
- Platform-specific API fields in component metadata (adds maintenance surface)
- Generated API references from source code (infrastructure investment)
- Searchable platform source through the MCP (indexing change)

**Recommendation**: Acknowledge as a known boundary. Consider generated API references as a future enhancement, not a discoverability fix. The platform engineers' workflow (MCP for selection → source for implementation) is functional if not optimal.

---

## Finding 4: `contexts` Needs Controlled Vocabulary (High Impact, Low Effort)

**Agents**: Leonardo (consumer), Lina (author)

There's no canonical list of context values. Lina guesses at tags with no validation. Leonardo uses them inconsistently because he can't predict the tag names.

**Evidence**:
- Lina: "`contexts` is the most uncertain field. There's no controlled vocabulary, no validation, and no feedback loop telling me whether my tags are useful"
- Leonardo: "The tags are only useful if I can predict them, and there's no way to browse available contexts"

**Recommended fix**: Define a controlled vocabulary of context values (e.g., `navigation-tabs`, `dashboards`, `form-footers`, `content-feeds`, `settings-screens`, `onboarding-flows`). Publish as a reference in the authoring guide. Validate during meta file authoring.

---

## Finding 5: Dual Maintenance Is Real but Scoped (Confirmed)

**Agent**: Lina

`usage` (when_to_use / when_not_to_use) and `alternatives` are reformatted copies of family doc content. `purpose` and `contexts` are original work that doesn't exist in family docs.

**Evidence**:
- Lina: "when_to_use / when_not_to_use is essentially a reformatted version of the family doc's 'When to Use' section. alternatives is a reformatted version of the selection table."
- Lina: "The only genuinely original field is purpose (agent-optimized phrasing) and contexts (not in family docs at all)"

**Implication**: An extraction pipeline would eliminate dual maintenance for `usage` and `alternatives` but still require manual authoring for `purpose` and `contexts`. The hybrid approach from the original design outline (add structured metadata sections to family docs) remains viable for the duplicated fields.

---

## Finding 6: Experience Patterns Are the Most Valuable Discovery Tool (Confirmed)

**Agents**: Leonardo, Sparky

Both reach for experience patterns before individual component search. Patterns provide composition context that individual component metadata can't.

**Evidence**:
- Leonardo: "Experience patterns are the most useful discovery tool, but they're coarse-grained"
- Sparky: "The experience pattern partially compensates — it tells me *what* to compose and *why*"
- Leonardo's fallback chain puts patterns at step 3, but his task responses show he reaches for them first when they exist

**Implication**: Enriching experience patterns (more patterns, more scenarios) may have higher discoverability impact than enriching individual component metadata. Gap report items #4, #7, #9, #13 are all pattern gaps.

---

## Finding 7: Readiness Needs More Granularity (Moderate)

**Agents**: Data, Stacy, Sparky

"Development" readiness doesn't communicate enough. Agents need per-platform readiness and practical meaning.

**Evidence**:
- Data: "It doesn't tell me what 'development' means practically — is the Android implementation complete and just not tested? Is it a stub?"
- Stacy: "No readiness-to-spec impact guidance... can you spec against development components? What's the risk?"
- Sparky: "Platform-specific readiness — 'web: production-ready, ios: development, android: not-started' instead of a single readiness field"

**Recommended fix**: Add per-platform readiness to component metadata. Define what each readiness level means practically for spec authors and implementers.

---

## Priority Matrix

| # | Finding | Impact | Effort | Recommendation |
|---|---------|--------|--------|----------------|
| 1 | Vocabulary mismatch | Critical | Low | Rewrite `purpose` fields using consumer search terms from this research |
| 4 | `contexts` controlled vocabulary | High | Low | Define canonical list, add to authoring guide, validate |
| 6 | Experience patterns underinvested | High | Medium | Enrich existing patterns, add new patterns for gap report scenarios |
| 5 | Dual maintenance (usage/alternatives) | Medium | Medium | Derive from family docs (hybrid extraction for duplicated fields only) |
| 2 | MCP value boundary | Validated | None | No action — confirms current direction. Guide authoring toward non-obvious content. |
| 7 | Readiness granularity | Moderate | Low | Add per-platform readiness field to meta schema |
| 3 | Platform implementation gap | Significant | High | Acknowledge as intentional boundary. Consider generated API refs as future enhancement. |

---

## Recommended Next Steps

1. **Immediate (content fixes, no infrastructure)**:
   - Rewrite `purpose` fields for all 28 components using product-problem framing
   - Define and publish `contexts` controlled vocabulary
   - Use Leonardo's search terms from this research as the vocabulary baseline

2. **Short-term (spec 086 Phase 3)**:
   - Determine whether `usage` and `alternatives` derivation from family docs is worth the extraction infrastructure, or if a manual sync process with better authoring guidance is sufficient
   - Add per-platform readiness to component-meta schema

3. **Medium-term (separate specs)**:
   - Enrich experience patterns for gap report scenarios (#4, #7, #9, #13)
   - Consider generated platform API references for Sparky/Kenya/Data

4. **No action needed**:
   - Platform implementation gap (Finding 3) — acknowledged as intentional boundary
   - MCP value boundary (Finding 2) — validated, no change needed

---

## Appendix: Notable Quotes

**Leonardo on purpose fields**: "Purpose should answer 'what product problem does this solve?' not 'what visual properties does it have?'"

**Lina on authoring blind**: "I'm optimizing for search terms I can't predict — I don't know what queries Leonardo or the platform agents will actually use."

**Kenya on the MCP boundary**: "The MCP informs *what* I build, not *how* I build it on iOS. That 'how' comes from platform expertise."

**Lina on high-value metadata**: "The value is in the non-obvious guidance... An agent that can't figure out [the obvious] from the component name has bigger problems."

**Data on what changed**: "I didn't expect the token mode map — learning that certain color tokens operate at different semantic levels affects how I handle theming in Compose. That's information I wouldn't have gotten from reading the source code alone."

**Stacy on selection rules**: "It turns component selection from a subjective judgment call into an auditable decision."
