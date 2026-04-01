# Release 10.1.0

**Date**: 2026-04-01
**Previous**: 10.0.1
**Bump**: minor

---

## Highlights

### Component Discoverability & Metadata Infrastructure (Spec 086)
- Build-time metadata extraction pipeline (`npm run extract:meta`) — purpose and contexts extracted from family docs
- Per-platform readiness model derived from filesystem artifact presence
- 14-value controlled vocabulary for component contexts
- All 8 discoverability benchmark queries passing
- Platform Resource Map steering doc for agent navigation
- Escape hatch governance pattern for intentional selection deviations
- MCP scope split design (Application MCP vs Product MCP boundary) for Spec 081

### Nav-Header Components (Spec 088)
- **Nav-Header-Base**: Structural primitive — safe area, landmark semantics, three-region layout, opaque/translucent appearance
- **Nav-Header-Page**: Semantic variant — h1 title, back/close/trailing actions, collapsible scroll, platform-native title alignment
- **Nav-Header-App**: Semantic variant — permissive scaffold for product-defined app-level chrome
- 24 behavioral contracts, 13 new contract concepts (117 → 131)
- True Native implementations across Web, iOS, and Android

### Unified Blur Token Family (Spec 089)
- 9 blur primitives (base 16) replacing shadow blur and glow blur families
- Zero visual change — same numeric values, unified naming scale
- All platform token files regenerated (CSS, Swift, Kotlin, DTCG)

### Product Agent Team (Spec 070)
Five new AI agents join the DesignerPunk collaboration:
- **Leonardo** — Product architect. Cross-platform technical direction, component selection, screen specification, and design context translation. The bridge between the design system and product development.
- **Sparky** — Web platform engineer. Web Components implementation, DesignerPunk token and component consumption, web accessibility.
- **Kenya** — iOS platform engineer. SwiftUI implementation, DesignerPunk token and component consumption, iOS accessibility.
- **Data** — Android platform engineer. Jetpack Compose implementation, DesignerPunk token and component consumption, Android accessibility.
- **Stacy** — Product governance & QA. Process quality, cross-platform parity auditing, spec structure governance, lessons-learned capture, metadata accuracy lens.

Kenya and Data provided platform-specific implementation reviews for Spec 088, catching 5 issues across iOS and Android that Lina's implementations missed — validating the multi-agent review model.

### Agent Knowledge Bases (Spec 087)
- `/knowledge` CLI integration for platform-filtered, searchable source access across all agents
- Include/exclude patterns enable platform-scoped indexing (e.g., Sparky indexes only `**/platforms/web/**`)
- 7 agents configured with domain-scoped knowledge bases: platform agents (component source + tokens), Thurgood (test infrastructure), Leonardo (spec history + patterns), Stacy (completion docs), Lina (MCP server source)
- Discoverability addressed via Platform Resource Map (`file://` resource) and per-agent prompt sections listing available knowledge bases
- Knowledge base maintenance integrated into task completion workflow (final parent task evaluation)

### Governance Process Extensions (Spec 086)
- **Stakeholder Identification**: New step in Spec Feedback Protocol — spec authors identify reviewers before first feedback round, ensuring platform agents and consumers aren't overlooked
- **Metadata Accuracy Lens**: Added to Stacy's audit checklist — checks for stale whenToUse/whenNotToUse, missing alternatives, purpose drift, escape hatch tracking
- **Selection Verification Gate**: Stacy's selection review completes before platform agent handoff
- **Escape Hatch Pattern**: Structured format for documenting intentional deviations from component selection guidance, tracked during Lessons Synthesis Reviews

### Test Infrastructure
- Web Component test utility (`cleanupDOM`, `ensureRegistered`) — fixes jsdom custom element registry fragility
- 25 test files migrated from `innerHTML = ''` to safe DOM cleanup
- Readiness compliance test validates per-platform status for all components

---

## Stats

- 309 test suites, 8,090 tests passing
- 33 production components (30 → 33)
- 131 behavioral contract concepts (117 → 131)
- 9 experience patterns, 4 layout templates
- 84 steering documents indexed

## Gap Report Progress

| Status | Count |
|--------|-------|
| Complete | 6 (#0, #3, #16, #17, #18, #19) |
| Reframed | 3 (#4, #7, #13) |
| Not started | 2 (#1, #2) |
| Dependent | 1 (#9) |
| Deferred | 1 (#11) |
| Closed | 7 (#5, #6, #8, #10, #12, #14, #15) |
