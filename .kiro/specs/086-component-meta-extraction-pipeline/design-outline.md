# Component Discoverability & Metadata Infrastructure

**Date**: 2026-03-28
**Purpose**: Address component discoverability gaps through research-informed metadata improvements, readiness infrastructure, agent configuration, and governance process extensions
**Organization**: spec-guide
**Scope**: 086-component-meta-extraction-pipeline
**Status**: Draft — Pending review

---

## Problem Statement

The Spec 083 gap report identified that component discoverability fails when product agents' search vocabulary doesn't match metadata content (#16), context tags don't cross-reference purpose (#17), and common UI contexts are undertagged (#18). Research with 6 agents and 2 independent analyses revealed deeper root causes:

1. **Feedback loop gap**: Metadata authors (Lina) have no data on what consumers (Leonardo, platform agents) actually search for
2. **Dual maintenance**: `usage` and `alternatives` in meta files are reformatted copies of family doc content, causing drift
3. **Readiness opacity**: A single "development" string doesn't tell agents what they can use, on which platform, or what it means practically
4. **Platform access gap**: Platform agents spend 80% of implementation time in source code because the MCP doesn't surface platform-specific details

Research validated that the MCP's core value is DesignerPunk-specific knowledge (selection rules, behavioral contracts, composition constraints, design philosophy). Fixes should amplify that value, not add general knowledge agents already have.

---

## Resolved Positions (From Research)

### Position 1: Full Single Source Extraction (Option C)

All component-meta.yaml fields authored in Component-Family steering docs as structured metadata blocks, extracted by a build-time script. Meta files become generated artifacts.

**Format in family docs:**
```markdown
### Badge-Count-Base — Metadata
- **Purpose**: Display a numeric count indicator for unread notifications or item quantities in a compact badge
- **Contexts**: navigation-tabs, list-items, icon-overlays, app-bars
```

`usage` and `alternatives` derived from existing family doc sections. `purpose` and `contexts` authored as structured blocks. Eliminates dual maintenance. Ballot measure governance automatically covers all meta content.

### Position 2: Controlled Vocabulary for `contexts`

Canonical list of context values defined and published. Authors pick from the list. Validated during extraction. Informed by Leonardo's actual search terms from the research.

### Position 3: Purpose Fields Rewritten for Product Problems

`purpose` answers "what product problem does this solve?" not "what visual properties does it have?" Leonardo's search terms serve as the baseline vocabulary. High-impact fixes can land incrementally before the extraction pipeline ships.

### Position 4: MCP Scope Split (P3)

**Application MCP**: Components, component patterns, composition rules, token references, selection guidance, readiness data.

**Product MCP**: Experience patterns, layout templates, screen-level design guidance. Consumes component data from Application MCP.

The split is content organization, not access control — all agents retain read access to both MCPs. Critical dependency: readiness model must be reliable before the split ships, so the Product MCP can include accurate readiness when recommending patterns.

This position aligns with and refines Spec 081 (Product MCP Design). Validation against Spec 081's current direction is a prerequisite before implementation.

### Position 5: Two-Part Readiness Model (R2)

Per-platform readiness derived by the Application MCP indexer at index time.

**Technical readiness (automated):** Filesystem scan for artifact presence per platform:
- Platform implementation file (`.web.ts`, `.ios.swift`, `.android.kt`)
- Platform tests (`*.test.ts` for web, `*Tests.swift` for iOS, `*Test.kt` for Android)
- Component-level artifacts (schema, contracts, types, tokens)
- Web-specific: optional `.styles.css`
- iOS-specific: `.ios.swift` is the indicator (ignore `.xcassets` directories)
- Token generation status is system-level, not component-level — don't penalize components for missing generated token output

**Human-reviewed readiness (manual flag in schema.yaml):**
```yaml
readiness:
  web:
    reviewed: true
  ios:
    reviewed: false
  android:
    status: not-applicable
    reason: "Uses native Material BottomNavigation"
```

The `reviewed` flag and `not-applicable` reason live in `schema.yaml` — a hand-authored file that won't conflict with the generated meta files (Position 1). The indexer combines schema readiness fields with filesystem scan results to derive status.

**Status derivation:**
- `not-applicable` (with reason) → intentional platform absence
- `not-started` → no platform artifacts
- `scaffold` → platform file exists, no tests, not reviewed
- `development` → technical artifacts present, not reviewed
- `production-ready` → technical complete + human reviewed

### Position 6: Enhanced Middle Ground Knowledge Bases

Platform agents get indexed knowledge bases:
- Their platform's implementation files (`platforms/{platform}/`)
- Shared `types.ts` and `tokens.ts` per component
- `contracts.yaml` per component
- Platform-specific token files (`src/tokens/platforms/{platform}/`)

**Platform Resource Map**: A new steering doc mapping resource types to platform-specific paths. Universal orientation for all agents — enables Stacy's parity comparison, Thurgood's test coverage audits, and cross-domain file discovery.

### Position 7: Governance Process Extensions

**Stacy's Lessons Synthesis Review** gains a metadata accuracy lens — checking whether accumulated lessons reveal stale `whenToUse` and/or `whenNotToUse` entries, missing alternatives, or purpose fields that don't match consumer search terms. Requires a prompt update for Stacy.

**Selection verification** via feedback protocol — Stacy reviews product specs after Leonardo finalizes the component tree, checking selection against `get_prop_guidance`. Happens before platform agent handoff.

**Escape hatch documentation** — structured annotation in specs for intentional deviations:
```markdown
### Escape Hatch: Container-Base for profile cards
- **Guidance says**: Use Container-Card-Base (get_prop_guidance → Container family)
- **This spec uses**: Container-Base
- **Reason**: Container-Card-Base is `development` readiness on iOS
- **Migration trigger**: Container-Card-Base reaches `production-ready` on iOS
```

Tracked during Lessons Synthesis Reviews for migration opportunities.

### Position 8: Experience Patterns → Product MCP

Experience patterns move from Application MCP to Product MCP as part of the P3 scope split. Gives patterns a dedicated home alongside product-level concerns. Gap report items #4, #7, #13 (originally routed to Spec 069) may reroute to Product MCP pattern creation.

### Position 9: Reference Doc Migration

Three docs in `docs/` are not indexed by the docs MCP:
- `docs/component-meta-authoring-guide.md`
- `docs/component-mcp-query-guide.md`
- `docs/component-metadata-schema-reference.md`

Add metadata headers and configure docs for Documentation MCP formatting and indexing. Independent of other positions.

---

## Gap Report Coverage

| Gap | Resolution |
|-----|-----------|
| #16 Purpose search misses | Purpose rewrite (3) + extraction (1) |
| #17 Context/purpose cross-ref | Controlled vocabulary (2) + extraction (1) |
| #18 Dashboard context underserved | Controlled vocabulary (2) + context enrichment |
| #3 Container-Card-Base readiness | Readiness model (5) + Spec 085 |
| #4, #7, #13 (routed to 069) | Reframed → Product MCP patterns (8) |

Full tracker: `docs/specs/083-application-mcp-guidance-completeness/gap-report-resolution-tracker.md`

---

## Agent Coordination

| Position | Primary Agent | Supporting |
|----------|--------------|-----------|
| 1. Extraction pipeline | Lina (family doc authoring) | Ada (token reference verification) |
| 2. Controlled vocabulary | Lina + Leonardo (consumer terms) | Thurgood (governance) |
| 3. Purpose rewrite | Lina (authoring) | Leonardo (search term baseline) |
| 4. MCP scope split | Architecture decision (Peter) | All agents (read access design) |
| 5. Readiness model | Thurgood (compliance test) | Lina (schema updates), Ada (token scope) |
| 6. Knowledge bases | Peter (agent config updates) | Platform agents (validation) |
| 7. Governance extensions | Stacy (prompt update, process) | Leonardo (selection verification input) |
| 8. Pattern migration | Dependent on Position 4 | Leonardo, Lina (pattern content) |
| 9. Reference doc migration | Thurgood (indexing) | Lina (content updates) |

---

## Scope

### In Scope
- Structured metadata format for Component-Family docs + template update
- Controlled vocabulary for `contexts`
- Purpose field rewrite (incremental + pipeline)
- Build-time extraction script
- Per-platform readiness model in schema.yaml + indexer enhancement
- Readiness compliance test
- Platform agent knowledge base configuration
- Platform Resource Map steering doc
- Stacy prompt update for metadata accuracy lens
- Escape hatch documentation pattern
- Reference doc migration to docs MCP
- Authoring guide update to reflect extraction workflow

### Out of Scope
- Changing the Application MCP's search algorithm
- New component creation (gap report #0, #1, #2)
- Product MCP implementation (Position 4/8 — design decision captured here, implementation is Spec 081)
- Platform-specific API generation (acknowledged as intentional boundary)

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Extraction script misparses family doc format | Medium | Validate output against existing hand-authored meta files before replacing |
| Readiness scan produces misleading results for less-mature platforms | Medium | Platform-specific artifact patterns; don't penalize for missing generated token output |
| Purpose fields drift back to implementation language over time | Low | Metadata accuracy lens in Lessons Synthesis catches drift reactively |
| MCP split (Position 4/8) ships before readiness is reliable | High | Explicit dependency: readiness model must be validated before split |
| Combined scope of 9 positions creates transition friction | Medium | Phased implementation with checkpoints between phases |

---

## Known Limitations

- The feedback loop between metadata authors and consumers is narrowed, not closed. The ongoing mechanism is reactive (Stacy's Lessons Synthesis catching failures) rather than proactive (periodic collection of actual search queries). Sufficient at current scale; revisit as catalog grows.
- Platform-specific search vocabulary (SwiftUI terms, Compose terms, Web Component terms) won't appear in cross-platform `purpose` fields. Future vocabulary refreshes should include platform agent input, not just Leonardo's cross-platform perspective.

---

## Success Criteria

1. All components have `component-meta.yaml` generated from family docs via extraction script
2. `find_components({ purpose: "filter bar" })` returns Chip-Filter (gap #16)
3. `find_components({ context: "dashboards" })` returns ≥5 production components (gap #18)
4. Per-platform readiness visible via Application MCP queries
5. Readiness compliance test validates derived status matches filesystem state
6. Platform agents confirm knowledge base configuration improves their workflow
7. Three reference docs queryable via docs MCP
8. Stacy's prompt updated with metadata accuracy lens
9. Escape hatch documentation pattern defined and available for use in specs

---

## Next Steps

1. Agent feedback on this design outline via feedback protocol
2. Formalize into requirements (sequentially, per feedback gate)
3. Design and tasks follow requirements
