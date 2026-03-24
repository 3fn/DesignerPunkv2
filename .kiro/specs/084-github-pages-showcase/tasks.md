# Implementation Plan: GitHub Pages Showcase Site

**Date**: 2026-03-24
**Spec**: 084 - GitHub Pages Showcase Site
**Status**: Implementation Planning
**Dependencies**: None

---

## Task List

- [ ] 1. Showcase Site Infrastructure

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Jekyll site structure exists in `docs/` with layouts, includes, and config
  - `tokens.css` committed and referenced in layout
  - `showcase.css` consumes DesignerPunk tokens via CSS custom properties
  - Landing page renders with anchor navigation and correct styling
  - GitHub Pages enabled and serving the site

  **Primary Artifacts:**
  - `docs/_config.yml`
  - `docs/_layouts/default.html`
  - `docs/assets/showcase.css`
  - `docs/tokens.css`
  - `docs/index.md`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/084-github-pages-showcase/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/084-github-pages-showcase/task-1-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Showcase Site Infrastructure"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Create Jekyll site structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Thurgood
    - Create `docs/_config.yml` with site title, description, theme settings
    - Create `docs/_layouts/default.html` with head (tokens.css, showcase.css), nav, content block, footer
    - Create `docs/_layouts/deep-dive.html` extending default with back-to-landing link
    - Create `docs/_includes/nav.html` with anchor links to all landing page sections
    - Create `docs/_includes/footer.html`
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 1.2 Set up token dogfooding
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Ada
    - Copy `dist/browser/tokens.css` to `docs/tokens.css` (this is the generation output; `demos/tokens.css` is a symlink to this file)
    - Verify byte-identical copy
    - Reference `tokens.css` in `docs/_layouts/default.html`
    - _Requirements: 8.1, 8.2_

  - [ ] 1.3 Create showcase stylesheet
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    **Depends on**: Task 1.2 (needs `tokens.css` in place to write CSS against)
    - Create `docs/assets/showcase.css` consuming DesignerPunk tokens via `var(--token-name)`
    - Use tokens for all design values: colors, spacing, font sizes, line heights, letter spacing, font weights, radii, shadows, breakpoints, grid gutters, grid margins
    - Structural CSS declarations (`display`, `grid-template`, `position`, content max-width) are non-tokenizable and may use hard-coded values
    - Style landing page layout: hero, sections, anchor nav, stats grid, footer
    - Style deep-dive page layout: content width, typography, back link
    - Ensure responsive behavior at mobile (320px) and desktop widths using breakpoint tokens
    - _Requirements: 8.1, 1.1, 1.2, 1.5_

  - [ ] 1.4 Create landing page scaffold
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Create `docs/index.md` with Jekyll front matter
    - Add all 7 section anchors with placeholder content
    - Add anchor navigation
    - Add "Learn more →" links to deep-dive pages (Architecture, Components, Mathematics, Collaboration)
    - Verify page renders with correct layout and token styling
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] 1.5 Enable GitHub Pages
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Peter
    - Enable GitHub Pages in repo settings: source = `docs/` on main branch
    - Verify site is accessible at the GitHub Pages URL
    - _Requirements: 9.1, 9.2_

- [ ] 2. Content Creation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All 7 landing page sections populated with curated content
  - Deep-dive pages created for Architecture, Components, Mathematics, and Collaboration
  - Technical stats gathered from codebase with concrete numbers
  - Content reviewed and approved by Peter

  **Primary Artifacts:**
  - `docs/index.md` (populated)
  - `docs/architecture.md`
  - `docs/components.md`
  - `docs/mathematics.md`
  - `docs/collaboration.md`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/084-github-pages-showcase/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/084-github-pages-showcase/task-2-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Showcase Content Creation"`
  - Verify: Check GitHub for committed changes

  - [ ] 2.1 Draft Architecture content
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Draft landing page Architecture section: True Native, token hierarchy, derivation chain, unitless architecture, generation pipeline (concept-level, no formulas)
    - Draft `docs/architecture.md` deep-dive: detailed token derivation examples, pipeline output samples, Rosetta system explanation
    - Gather token stats: token count, family count, total derived token count (not unique formulas — the larger number communicates scale), platform coverage
    - Content sections may include concrete stats inline at drafting discretion
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 7.1_

  - [ ] 2.2 Draft Component Catalog content
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Draft landing page Component Catalog section: 11 families, contract-first development, inheritance architecture, composition model, cross-platform parity, accessibility (concept-level)
    - Draft `docs/components.md` deep-dive: showcase components (Button, Badge, Input-Text), inheritance chain examples, contract examples, platform implementation comparison
    - Gather component stats: component count, family count, behavioral contract count, composition relationship count
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 7.1_

  - [ ] 2.3 Draft Mathematical Foundation content
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Draft landing page Mathematical Foundation section: concept of mathematical derivation, no formulas
    - Draft `docs/mathematics.md` deep-dive: modular scale derivation, baseline grid system, formula examples (spacing, typography, radius)
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 2.4 Draft Human-AI Collaboration content
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Draft landing page Collaboration section: three-agent model, governance overview, counter-argument requirement
    - Draft `docs/collaboration.md` deep-dive: agent domain specialization, ballot measure model, bias self-monitoring, spec development lifecycle, Peter's collaboration philosophy
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ] 2.5 Draft Quality & Governance content
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Draft landing page Quality & Governance section: test metrics, three-tier validation, behavioral contract validation, token compliance
    - Gather test stats: test count, suite count
    - _Requirements: 6.1, 6.2, 6.3, 7.1_

  - [ ] 2.6 Draft Hero / Overview content
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Peter
    - Write hero section: what DesignerPunk is, key differentiators, voice and positioning
    - This is Peter's voice — agents do not draft this section
    - _Requirements: 1.1, 1.2_

  - [ ] 2.7 Assemble and review
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Peter
    - Integrate all agent-drafted sections into landing page and deep-dive pages
    - Review for consistent voice, tone, and narrative flow
    - Verify all anchor links and deep-dive links work
    - Final approval of all content
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 7.2_

- [ ] 3. Interactive Demos Deployment (Follow-Up)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - GitHub Actions workflow deploys demo pages from built browser bundle
  - All 16 existing demo pages accessible via the deployed URL
  - Showcase site links to live demos
  - Demo path references (tokens.css, designerpunk.esm.js) resolve correctly

  **Primary Artifacts:**
  - `.github/workflows/deploy-demos.yml`
  - Updated `docs/index.md` with demo links

  **Completion Documentation:**
  - Detailed: `.kiro/specs/084-github-pages-showcase/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/084-github-pages-showcase/task-3-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Interactive Demos Deployment"`
  - Verify: Check GitHub for committed changes

  - [ ] 3.1 Create GitHub Actions workflow
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Create `.github/workflows/deploy-demos.yml`
    - Workflow runs `npm run build:browser` and deploys `dist/browser/` contents
    - Trigger: manual dispatch only (release tag triggers can be added later if manual process becomes annoying)
    - Validate demo path references resolve correctly in deployed environment
    - _Requirements: 9.5_

  - [ ] 3.2 Link showcase to demos
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Add demo links to relevant landing page sections (Component Catalog)
    - Add demo links to `docs/components.md` deep-dive page
    - Verify links resolve to deployed demo pages
    - _Requirements: 3.6_

---

## Token Refresh Procedure

When DesignerPunk tokens are regenerated:

1. Run `npm run build:browser` (regenerates `dist/browser/tokens.css`)
2. Copy `dist/browser/tokens.css` to `docs/tokens.css`
3. Verify showcase site renders correctly with updated tokens
4. Commit the updated `docs/tokens.css`

This is a manual process by design — the showcase is a snapshot, not a live mirror.
