# Component Discoverability Research & Enrichment

**Date**: 2026-03-27
**Purpose**: Research how product agents discover and select components, then address discoverability gaps informed by findings
**Organization**: spec-guide
**Scope**: 086-component-meta-extraction-pipeline
**Status**: Draft — Pending review

---

## Problem Statement

Component discoverability data is maintained in two places (Component-Family steering docs and component-meta.yaml files), and they drift apart. The Spec 083 gap report found that natural search terms don't match `purpose` text (#16), context tags don't cross-reference purpose (#17), and common UI contexts like "dashboards" are undertagged (#18).

Before building a solution, we need to understand the problem from the consumer's perspective. Leonardo is the product architect who searches for components, evaluates alternatives, and makes selection decisions — he's the primary user of the discoverability system. Designing fixes without his input risks solving the wrong problem.

---

## Goals

1. **Understand how product agents actually discover components** — what they search for, what they find, what they miss, what frustrates them
2. **Identify whether the gap is content, structure, or both** — is the meta file schema right but underpopulated, or is the schema itself wrong?
3. **Address gap report items #16, #17, #18** informed by research findings, not assumptions
4. **Determine the right long-term maintenance model** — manual enrichment, generated from family docs, or something else

---

## Approach: Research First, Then Build

### Phase 1: Discovery Research (Isolated Per-Agent)

Each agent completes their research doc independently in `.kiro/specs/086-component-meta-extraction-pipeline/research/`. Agents must not read other agents' research docs before completing their own — this prevents anchoring bias.

**Research participants:**

| Agent | Perspective | Doc |
|-------|------------|-----|
| Leonardo | Product architect — primary component consumer | `research/leonardo.md` |
| Sparky | Web platform engineer — web consumption | `research/sparky.md` |
| Kenya | iOS platform engineer — iOS consumption | `research/kenya.md` |
| Data | Android platform engineer — Android consumption | `research/data.md` |
| Stacy | Product governance — quality/parity auditing | `research/stacy.md` |
| Lina | Component specialist — meta file authoring | `research/lina.md` |

Each doc contains role-specific component selection/authoring tasks and general questions. Peter conducts the sessions and captures findings.

### Phase 2: Analysis (Thurgood + Lina)

Analyze Leonardo's findings to determine:
- **Content gaps**: Which components need richer purpose text, more context tags, or better alternatives?
- **Structural gaps**: Does the meta file schema need changes (new fields, different organization)?
- **Search gaps**: Does the Application MCP search need improvements (cross-referencing, fuzzy matching)?
- **Maintenance model**: Should meta files be hand-authored (with better guidance), generated from family docs, or hybrid?

### Independent Workstream: Reference Doc Migration

Three reference docs in `docs/` are not indexed by the docs MCP, making them invisible to agents other than Lina:

- `docs/component-meta-authoring-guide.md`
- `docs/component-mcp-query-guide.md`
- `docs/component-metadata-schema-reference.md`

These need metadata headers added and either migration to `.kiro/steering/` or docs MCP indexer configuration to cover `docs/`. This work is independent of the research phases and can proceed in parallel.

---

### Phase 3: Implementation (Informed by Phases 1-2)

The implementation approach depends on what the research reveals:

- **If the gap is content quality** → enrich existing meta files manually, update authoring guide with Leonardo's search patterns as examples
- **If the gap is structural** → redesign the meta file schema, then populate
- **If the gap is dual maintenance** → build the extraction pipeline from the original design outline
- **If it's a combination** → prioritize based on impact

---

## What This Replaces

The original design outline proposed a build-time extraction pipeline as the solution. That approach may still be correct, but it assumed the problem was dual maintenance without validating with the actual user. This restructured spec validates first, then builds.

The original design outline is preserved at the bottom of this document for reference if Phase 2 analysis points toward extraction.

---

## Agent Coordination

| Phase | Agent | Role |
|-------|-------|------|
| Phase 1: Research | Leonardo | Research subject — component selection perspective |
| Phase 1: Research | Sparky | Research subject — web consumption perspective |
| Phase 1: Research | Kenya | Research subject — iOS consumption perspective |
| Phase 1: Research | Data | Research subject — Android consumption perspective |
| Phase 1: Research | Stacy | Research subject — governance/quality perspective |
| Phase 1: Research | Lina | Research subject — meta file authoring perspective |
| Phase 1: Research | Peter | Conducts sessions, captures findings |
| Phase 2: Analysis | Thurgood | Analyzes findings from discoverability/governance perspective |
| Phase 2: Analysis | Lina | Analyzes findings from component architecture perspective |
| Phase 2: Analysis | Ada | Reviews if token discoverability is affected |
| Docs MCP Migration | Thurgood | Assess indexing approach, configure |
| Docs MCP Migration | Lina | Update doc content if needed |
| Phase 3: Implementation | TBD | Depends on Phase 2 findings |

---

## Scope

### In Scope
- Leonardo research exercise (Phase 1)
- Analysis of findings (Phase 2)
- Implementation of discoverability improvements (Phase 3, scope TBD by research)
- Reference doc migration to docs MCP (independent of research — known gap)
- Addressing gap report items #16, #17, #18

### Out of Scope
- Changing the Application MCP's search algorithm (may become in-scope if research reveals search gaps)
- New component creation (gap report #0, #1, #2)
- Container-Card-Base readiness (gap report #3)

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Research phase delays implementation | Low | Phase 1 is lightweight (one session). Gap #16-18 can be fixed manually as interim while research informs long-term solution. |
| Leonardo's patterns don't generalize to other product agents | Low | Sparky, Data, Kenya use the same MCP tools. Leonardo's patterns are representative. |
| Research reveals the extraction pipeline was the right answer all along | None | That's a valid outcome. The research validates the approach rather than wasting it. |

---

## Success Criteria

1. Leonardo research exercise completed with documented findings
2. Analysis identifies whether the gap is content, structure, search, or maintenance model
3. Implementation approach chosen based on evidence, not assumptions
4. `find_components({ purpose: "filter bar" })` returns Chip-Filter (gap #16)
5. `find_components({ context: "dashboards" })` returns ≥5 production components (gap #18)
6. Three reference docs are queryable via docs MCP

---

## Next Steps

1. Create feedback doc for agent review
2. Schedule Leonardo research exercise
3. Formalize Phase 1 tasks after feedback

---

## Appendix: Original Extraction Pipeline Design (Preserved for Reference)

The original design outline proposed a build-time extraction pipeline that generates component-meta.yaml from Component-Family steering docs. This approach may be the right Phase 3 implementation if research confirms dual maintenance is the root cause. See git history for the full original design outline.
