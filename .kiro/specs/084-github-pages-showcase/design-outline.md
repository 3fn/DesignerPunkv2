# GitHub Pages Showcase Site

**Date**: 2026-03-23
**Purpose**: Create a GitHub Pages site that showcases DesignerPunk as a portfolio piece demonstrating system maturity, architectural depth, and Human-AI collaboration
**Organization**: spec-guide
**Scope**: 084-github-pages-showcase
**Status**: Draft — Pending review

---

## Problem Statement

DesignerPunk has substantial technical depth — 30 components across 11 Stemma families, a mathematically-derived token system, cross-platform generation, behavioral contracts, and a novel Human-AI collaboration model. None of this is visible to someone who doesn't clone the repo and dig through directories.

For someone evaluating Peter's work (hiring managers, technical leads, collaborators), the barrier to understanding what this project is and why it matters is too high. A polished showcase site solves this by making the work discoverable and the sophistication self-evident.

This is not a documentation site for consumers. It's a technical portfolio piece.

---

## Goals

1. **First impression in under 2 minutes** — A visitor should understand what DesignerPunk is, why it's interesting, and the depth of the system within a brief visit
2. **Demonstrate technical maturity** — Architecture decisions, mathematical foundations, cross-platform strategy, test coverage, and governance model should be visible without requiring code review
3. **Showcase the Human-AI collaboration model** — This is genuinely differentiating and worth highlighting as a first-class section
4. **Low maintenance surface** — Static content that doesn't need to stay in sync with every code change. Showcase, not live docs
5. **Agent coordination proof-of-concept** — The creation of this site itself requires Ada (token system content), Lina (component catalog content), and Thurgood (governance/test content) to contribute, demonstrating the collaboration model in practice

---

## Proposed Content Sections

### 1. Hero / Overview
- What DesignerPunk is (True Native cross-platform design system)
- Key differentiators in 2-3 sentences
- Visual identity / branding if available

### 2. Architecture
- True Native philosophy: build-time platform separation vs. runtime detection
- Rosetta token system: mathematical foundations, modular scale, baseline grid
- Primitive → Semantic → Component token hierarchy
- Derivation chain: tokens are mathematically derived from a small set of base constants, not hand-picked values
- Unitless architecture: Rosetta outputs unitless values that receive platform-specific units at generation time (directly supports the True Native claim)
- Cross-platform generation pipeline (Web CSS, iOS Swift, Android Kotlin)

### 3. Component Catalog
- The 11 Stemma families with representative examples
- Contract-first development: behavioral contracts are a specification layer authored *before* platform code, not extracted after the fact
- Inheritance architecture: base → variant → platform model (e.g., `Button-CTA` inherits from `Button-Base`, shared contracts, independent platform implementations)
- Composition model: components compose other components with schema-tracked relationships and resolved tokens — signals "this is a system, not a library"
- Cross-platform parity demonstration (same component, three platforms)
- Accessibility-first approach (WCAG 2.1 AA)
- Showcase components: Button family (deepest inheritance chain), Badge family (composition example), Input-Text (accessibility contracts, most complex behavioral contract set)

### 4. Mathematical Foundation
- Landing page: communicate the *concept* of mathematical derivation — tokens are calculated, not arbitrary. No formulas on the landing page.
- Deep-dive page: modular scale derivation, baseline grid system, formula examples (spacing, typography, radius)
- Keep formulas off the landing page — leading with math loses non-technical evaluators in the first 30 seconds

### 5. Human-AI Collaboration
- The three-agent model (Ada, Lina, Thurgood) and domain specialization
- Governance model: ballot measure documentation, token governance levels
- Counter-argument requirement and bias self-monitoring
- How specs are developed through iterative review cycles
- Peter's collaboration philosophy

### 6. Quality & Governance
- Test suite metrics (7,965+ tests, 306 suites)
- Three-tier validation system
- Contamination prevention architecture
- Behavioral contract validation
- Token compliance enforcement

### 7. Technical Stats / At a Glance
- Component count (30 across 11 families), platform implementation count
- Token count and coverage (X tokens across Y families covering Z use cases)
- Behavioral contract count, composition relationship count
- Test count, test suite count
- Spec count / development velocity
- Release history

---

## Agent Coordination

This spec requires contributions from all three domain agents:

| Section | Primary Agent | Role |
|---------|--------------|------|
| Architecture | Ada | Token system, mathematical foundations, Rosetta architecture |
| Component Catalog | Lina | Stemma families, behavioral contracts, platform implementations |
| Mathematical Foundation | Ada | Formula derivations, modular scale, baseline grid |
| Human-AI Collaboration | Thurgood | Governance model, collaboration framework, spec process |
| Quality & Governance | Thurgood | Test metrics, validation tiers, compliance enforcement |
| Hero / Overview | Peter | Voice, positioning, branding decisions |
| Technical Stats | Ada + Lina | Ada owns token stats (count, families, derivations); Lina owns component stats (families, contracts, compositions); Thurgood owns test/governance stats |

Peter makes all content and presentation decisions. Agents draft their sections independently and in parallel — no blocking dependencies between agents. Peter assembles the final content.

---

## Technical Approach

### Resolved Decisions

1. **Static site generator**: Jekyll — native to GitHub Pages, zero-config, Markdown-native. Right tool for a showcase this size.

2. **Page structure**: Single landing page with anchor navigation, plus linked deep-dive pages for sections that warrant more detail. The single page is the 2-minute hook; the deep dives are the proof.

3. **Dogfooding tokens**: Yes. The generated `tokens.css` (CSS custom properties) is committed to `docs/` and used for all site styling. Small file, changes infrequently, and it's a confidence signal — you use what you built. Single source of truth: `docs/tokens.css` is copied from `demos/tokens.css` (same generation source). Tasks doc must include a refresh step if tokens change.

4. **Interactive demos**: Separate concern from the showcase site. The project already has a complete demo system (16 component demo pages, shared CSS, browser ESM bundle) in `demos/`. These are deployed separately via GitHub Actions (`npm run build:browser`) as a follow-up enhancement — not required for v1 of the showcase. The showcase links to the demos once they're live.

5. **Deployment**: Two-tier approach driven by maintenance minimization:
   - **Showcase site**: Served from `docs/` root on main branch. Zero CI, zero build step. Push to main, it's live. Lowest possible maintenance overhead.
   - **Interactive demos**: Separate GitHub Actions workflow that runs `npm run build:browser` and deploys demo pages. Added as a follow-up task after the showcase is live.

### Constraints
- Must deploy from the same repo (github.com/3fn/DesignerPunkv2)
- Showcase site must not require a build step — zero CI overhead
- Interactive demos are a separate deployment concern with their own CI
- Content should be curated, not auto-generated — this is a showcase, not a dump
- Maintenance cost must be low — updates should be infrequent and intentional

---

## Existing Assets (Scope Reduction)

The project already has a complete interactive demo system that significantly reduces scope for the interactive demos enhancement:

- **16 component demo pages** covering every web component family with a web implementation
- **Shared demo stylesheet** (`demos/demo-styles.css`, 492 lines) with layout classes, event log patterns, form input layouts
- **Generated tokens CSS** (`demos/tokens.css`, 942 lines of CSS custom properties)
- **Browser ESM bundle** (`dist/browser/designerpunk.esm.js`) — compiled web components
- **Demo index page** with card-grid navigation to all component demos
- **Dark theme** using DesignerPunk design tokens throughout

These demos are production-ready and tested. The interactive demos task is integration work (deploying what exists), not creation work.

**Path reference note**: Demos currently reference `tokens.css` and `designerpunk.esm.js` via relative paths. When demos deploy alongside the showcase, paths need validation. Not a v1 concern but must be addressed in the follow-up tasks doc.

---

## What This Is NOT

- **Not a consumer documentation site** — No installation guides, API references, or getting-started tutorials
- **Not auto-generated from source** — Curated content, not a mirror of READMEs
- **Not a living document that tracks every change** — Snapshot of system maturity, updated intentionally
- **Not a priority over Bucket 1 work** — This should be scoped to fit alongside, not replace, current development priorities

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Scope creep into full docs site | Medium | Design outline explicitly scopes as showcase, not docs |
| Maintenance burden | Medium | Static content, infrequent updates, no auto-sync |
| Competes with Bucket 1 time | Medium | Keep scope lean; can be done incrementally |
| `tokens.css` drift | Low | Single copy source (`demos/tokens.css`); refresh step in tasks doc when tokens change |
| Misrepresents project maturity | Low | Honest presentation; the system genuinely has depth |

---

## Success Criteria

1. A visitor with no prior context understands what DesignerPunk is within 2 minutes
2. The site demonstrates technical depth without requiring code review
3. The Human-AI collaboration model is presented as a differentiating feature
4. Total maintenance cost is less than 1 hour per month
5. All three agents contributed domain content to their respective sections — drafted independently and in parallel

---

## Next Steps

1. ~~Peter reviews this design outline and provides feedback~~ ✓
2. ~~Resolve open questions~~ ✓ (all five resolved)
3. ~~Ada and Lina review for domain accuracy~~ ✓ (ADA R1, LINA R1 incorporated)
4. If approved, formalize into requirements.md, design.md, tasks.md
