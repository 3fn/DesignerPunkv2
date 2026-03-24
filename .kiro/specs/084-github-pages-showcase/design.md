# Design Document: GitHub Pages Showcase Site

**Date**: 2026-03-24
**Spec**: 084 - GitHub Pages Showcase Site
**Status**: Design Phase
**Dependencies**: None

---

## Overview

A Jekyll-based GitHub Pages site served from `docs/` on the main branch. Single landing page with anchor navigation and linked deep-dive pages. Styled with DesignerPunk's own CSS custom properties. Interactive demos handled as a separate follow-up deployment.

**Staleness policy**: Showcase content is reviewed at each major version release. This is event-driven and infrequent — part of the release checklist, not a separate maintenance process.

**Inline stats**: Content sections (Architecture, Components, Math) may include concrete numbers inline (e.g., "X tokens derived from Y base constants") at the content author's discretion. The dedicated Stats section is the canonical source, but inline numbers in context are more impactful.

---

## Architecture

### Site Structure

```
docs/
├── _config.yml              # Jekyll configuration
├── _layouts/
│   ├── default.html          # Base layout with nav, footer, token CSS
│   └── deep-dive.html        # Deep-dive page layout with back-to-landing link
├── _includes/
│   ├── nav.html              # Anchor navigation component
│   └── footer.html           # Site footer
├── index.md                  # Landing page (single-page with anchors)
├── architecture.md           # Deep-dive: Architecture & token system
├── components.md             # Deep-dive: Component catalog & Stemma
├── mathematics.md            # Deep-dive: Mathematical foundations & formulas
├── collaboration.md          # Deep-dive: Human-AI collaboration model
├── tokens.css                # DesignerPunk CSS custom properties (copied from demos/tokens.css)
└── assets/
    └── showcase.css          # Site-specific styles consuming DesignerPunk tokens
```

### Design Decisions

#### Decision 1: Jekyll with Markdown Content

**Choice**: Jekyll static site generator with Markdown content files.

**Rationale**: Jekyll is natively supported by GitHub Pages with zero configuration. Content authors (agents and Peter) write Markdown, which is the project's existing documentation format. No build step, no CI, no deployment pipeline.

**Alternatives considered**:
- Plain HTML: More control, but higher authoring friction and harder to maintain
- 11ty/Astro: More powerful, but requires a build step and GitHub Actions — violates the zero-CI constraint

#### Decision 2: Two-Tier Page Structure

**Choice**: Single landing page with anchor navigation + separate deep-dive pages.

**Rationale**: The landing page serves the "2-minute hook" — every section communicates *that* a capability exists. Deep-dive pages serve the "I want to understand how" audience. This separates the casual evaluator path from the thorough evaluator path without forcing either to wade through content meant for the other.

**Navigation**: Landing page sections link to deep-dive pages via "Learn more →" links. Deep-dive pages link back to the landing page.

#### Decision 3: Token Dogfooding via Committed CSS

**Choice**: Commit `tokens.css` to `docs/` and reference it in the Jekyll layout.

**Rationale**: The file is 942 lines, changes infrequently (only when tokens are regenerated), and demonstrates confidence in the system. Single source of truth: copied from `demos/tokens.css`.

**Sync strategy**: Manual copy when tokens change. Not automated — the showcase is a snapshot, not a live mirror. Tasks doc includes a refresh step.

#### Decision 4: Showcase CSS Architecture

**Choice**: `docs/assets/showcase.css` consumes DesignerPunk tokens via CSS custom properties.

**Rationale**: The showcase site's own styles reference `var(--token-name)` from `tokens.css`. This is the same consumption pattern any DesignerPunk consumer would use, making the dogfooding genuine rather than cosmetic.

**What this means in practice**:
```css
/* showcase.css references DesignerPunk tokens directly — no calc() wrappers needed */
/* Tokens have units baked in (e.g., --space-600: 48px, colors as rgba()) */
.showcase-hero {
  background-color: var(--color-surface-primary);
  padding: var(--space-600);
  font-family: var(--font-family-display);
}
```

**Token surface for dogfooding**: Color surface tokens, spacing scale, typography scale (font-size, line-height, letter-spacing, font-weight), radius tokens, shadow tokens, breakpoints, grid gutters, and grid margins. Structural CSS declarations (`display`, `grid-template`, `position`) are inherently non-tokenizable and may use hard-coded values.

#### Decision 5: Interactive Demos as Separate Concern

**Choice**: Demos are not part of the v1 showcase site. They are a follow-up enhancement deployed via GitHub Actions.

**Rationale**: The showcase site has zero CI overhead. The demos require a build step (`npm run build:browser`). Mixing them creates a maintenance dependency that undermines the zero-CI goal. The showcase can link to demos once they're deployed separately.

**Path reference note**: When demos are deployed, paths to `tokens.css` and `designerpunk.esm.js` need validation since the demo HTML files reference these via relative paths.

---

## Components and Interfaces

### Landing Page Sections

Each section on the landing page follows a consistent pattern:

1. **Section heading** with anchor ID
2. **2-3 sentence concept summary** — what this is and why it matters
3. **Key highlights** — 3-5 bullet points or a visual element
4. **Deep-dive link** — "Learn more →" to the dedicated page (where applicable)

### Content Ownership

| Content | Drafted By | Format |
|---------|-----------|--------|
| Hero / Overview | Peter | Landing page section |
| Architecture | Ada | Landing page section + deep-dive page |
| Component Catalog | Lina | Landing page section + deep-dive page |
| Mathematical Foundation | Ada | Landing page section + deep-dive page |
| Human-AI Collaboration | Thurgood | Landing page section + deep-dive page |
| Quality & Governance | Thurgood | Landing page section |
| Technical Stats | Ada (tokens) + Lina (components) + Thurgood (tests) | Landing page section |

All drafts are independent and parallelizable. Peter assembles and makes final content/presentation decisions.

---

## Data Models

No data models. This is a static site with no dynamic data.

---

## Error Handling

### Degradation

- If `tokens.css` fails to load, the site degrades to browser defaults — readable but unstyled. No JavaScript dependency for the showcase site.
- If Jekyll processing fails, GitHub Pages shows a build error. Since content is simple Markdown, this is unlikely.

---

## Testing Strategy

No automated tests for the showcase site. Validation is visual:

1. Enable GitHub Pages on the repo pointing to `docs/` on main
2. Verify the landing page renders with correct styling (tokens loaded)
3. Verify anchor navigation works
4. Verify deep-dive page links work
5. Verify responsive behavior at mobile and desktop widths

---

## Correctness Properties

1. All token references in `showcase.css` must resolve to values defined in `tokens.css`
2. All anchor links on the landing page must correspond to section IDs
3. All deep-dive links must point to existing pages
4. `docs/tokens.css` must be byte-identical to `demos/tokens.css` at time of commit
