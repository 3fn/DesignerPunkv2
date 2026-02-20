# Design Outline: ButtonCTA

**Date**: 2026-02-20
**Last Reviewed**: 2026-02-20
**Purpose**: Annotated reference example showing every section the DesignExtractor generates, with explanations of confidence flags, component token suggestions, and mode validation
**Organization**: spec-guide
**Scope**: 054b-figma-design-extract
**Layer**: 3
**Relevant Tasks**: figma-integration, design-extraction

<!-- ═══════════════════════════════════════════════════════════════════════
  ANNOTATED EXAMPLE — Design Outline
  
  This is a reference example showing every section the DesignExtractor
  generates, with annotations explaining purpose, confidence flags, and
  how to interpret the output. Use it as a companion when reviewing real
  extraction results.
  
  Annotations appear as HTML comments (<!-- ... -->) so they don't
  interfere with the document's readability when rendered as markdown.
═══════════════════════════════════════════════════════════════════════ -->

**Generated**: 2026-02-20
**Extraction Confidence**: ⚠️ medium
**Status**: Pending Human Review

---

<!-- ─────────────────────────────────────────────────────────────────────
  SECTION: Component Purpose
  
  Extracted from the Figma component's name, description, and properties.
  Provides a quick summary so reviewers know what they're looking at.
───────────────────────────────────────────────────────────────────── -->

## Component Purpose

**Name**: `ButtonCTA`
**Description**: Primary call-to-action button with icon support and three visual variants.
**Properties**: 6 defined

<!-- ─────────────────────────────────────────────────────────────────────
  SECTION: Variants
  
  Lists every Figma variant detected on the component. Properties are
  extracted from Figma's variant property definitions (e.g., Size=medium,
  Variant=primary). When a Component-Family doc exists, the
  VariantAnalyzer adds context-aware recommendations below the table.
───────────────────────────────────────────────────────────────────── -->

## Variants

| Variant | Properties |
|---------|------------|
| Primary/Medium | variant=primary, size=medium |
| Primary/Large | variant=primary, size=large |
| Secondary/Medium | variant=secondary, size=medium |
| Secondary/Large | variant=secondary, size=large |
| Tertiary/Medium | variant=tertiary, size=medium |
| Tertiary/Large | variant=tertiary, size=large |

### Variant Mapping Recommendations

**Behavioral Classification**: styling

<!-- The VariantAnalyzer determined all variants differ only in visual
     properties (colors, sizes), not in interaction behavior. This means
     a single component with variant/size props is likely appropriate. -->

#### Option A: Single component with variant prop ⭐ **Recommended**

Single `ButtonCTA` component with `variant` and `size` props controlling visual appearance.

**Rationale**: All variants share identical interaction patterns; differences are purely visual (colors, padding, typography weight).
**Aligns with**: Component-Family-Button.md, Stemma single-component pattern
**Tradeoffs**: Variant prop complexity increases with more visual options

#### Option B: Primitive + semantic structure

Separate `ButtonBase` primitive with `ButtonCTAPrimary`, `ButtonCTASecondary`, `ButtonCTATertiary` semantic wrappers.

**Rationale**: Provides maximum flexibility for future behavioral divergence.
**Aligns with**: Stemma primitive/semantic split pattern
**Tradeoffs**: More files to maintain; overkill when variants are styling-only

<!-- ─────────────────────────────────────────────────────────────────────
  SECTION: States
  
  Visual states detected from the Figma component (hover, focus,
  disabled, pressed). Interactive components should have all four.
  Missing states are flagged in the Accessibility and Behavioral
  Contracts sections.
───────────────────────────────────────────────────────────────────── -->

## States

- **default**: Resting state
- **hover**: Cursor over the button (web)
- **focus**: Keyboard focus visible
- **pressed**: Active/pressed state
- **disabled**: Non-interactive state

<!-- ─────────────────────────────────────────────────────────────────────
  SECTION: Token Usage
  
  The core of the extraction. Each row maps a Figma property to a
  DesignerPunk token with a confidence flag and match method.
  
  CONFIDENCE FLAGS:
    ✅ exact     — Matched via variable binding or style name. Reliable.
    ⚠️ approximate — Value-based match within tolerance. Needs review.
    ❌ no-match  — No token found. Requires human decision.
  
  MATCH METHOD:
    binding — Matched by Figma variable name (e.g., space/300 → space.300)
    value   — Matched by comparing raw values with tolerance rules
───────────────────────────────────────────────────────────────────── -->

## Token Usage

### Spacing

| Property | Token | Confidence | Method |
|----------|-------|------------|--------|
| padding-inline | `space.inset.spacious` (primitive: `space.300`) | ✅ exact | binding |
| padding-block | `space.inset.normal` (primitive: `space.200`) | ✅ exact | binding |
| gap | `space.100` | ✅ exact | binding |
| margin-block-end | `space.300` | ⚠️ approximate (delta: +1px) | value |

<!-- The margin-block-end row shows an ⚠️ approximate match. The designer
     typed 25px manually instead of binding the space/300 variable (24px).
     The value falls within the ±2px spacing tolerance, so TokenTranslator
     returned space.300 as an approximate match.
     
     ACTION: Confirm the designer intended space.300 and update the Figma
     design to use the variable binding. -->

### Colors

| Property | Token | Confidence | Method |
|----------|-------|------------|--------|
| background | `color.primary` (primitive: `color.purple.300`) | ✅ exact | binding |
| color | `color.contrast.onPrimary` (primitive: `color.white`) | ✅ exact | binding |
| border-color | `color.purple.300` | ⚠️ approximate (ΔE: 2.1) | value |

<!-- The border-color row shows a color matched by value with ΔE < 3.
     The Figma value #B12AF0 is perceptually close to color.purple.300
     (#B026FF) but has no variable binding.
     
     ACTION: Verify the designer intended this token. If so, bind the
     variable in Figma. If the color is intentionally different, document
     it as an off-system value. -->

### Typography

| Property | Token | Confidence | Method |
|----------|-------|------------|--------|
| font-family | `typography.heading200` | ✅ exact | binding |
| font-size | `fontSize.200` | ✅ exact | binding |
| font-weight | `fontWeight.semibold` | ✅ exact | binding |

### Radius

| Property | Token | Confidence | Method |
|----------|-------|------------|--------|
| border-radius | `radius.200` | ✅ exact | binding |

### Shadows

| Property | Token | Confidence | Method |
|----------|-------|------------|--------|
| box-shadow | `shadow.elevation200` | ✅ exact | binding |

<!-- Shadow matched by style name. Because 054a pushed the style as
     "shadow.elevation200", the extractor matched it directly by name
     (binding method). This is the primary path for composite tokens. -->


<!-- ─────────────────────────────────────────────────────────────────────
  SECTION: Accessibility
  
  Auto-generated based on the component's behavioral classification.
  Interactive components get keyboard, ARIA, focus, and screen reader
  considerations. Static components get semantic HTML and contrast
  considerations. Missing focus states are flagged here.
───────────────────────────────────────────────────────────────────── -->

## Accessibility

**Component Type**: Interactive

**Required Considerations**:
- Keyboard navigation support
- ARIA role and attributes
- Focus indicator visibility
- Screen reader announcements

<!-- ─────────────────────────────────────────────────────────────────────
  SECTION: Platform Behaviors
  
  Maps detected interactions to their platform availability. The
  extractor uses heuristics: hover = web-only, focus = all platforms,
  press/long-press = mobile. Recommendations suggest how to handle
  platform-specific interactions on other platforms.
───────────────────────────────────────────────────────────────────── -->

## Platform Behaviors

| Interaction | Platforms | Recommendation |
|-------------|-----------|----------------|
| hover | web | Map to press on mobile for equivalent feedback |
| focus | web, iOS, android | No action needed — supported on all platforms |
| pressed | web, iOS, android | No action needed — supported on all platforms |

<!-- ─────────────────────────────────────────────────────────────────────
  SECTION: Edge Cases
  
  Aggregates all flagged issues from other sections into a single list.
  Provides a quick scan of everything that needs attention. Items here
  correspond to detailed entries in their respective sections.
───────────────────────────────────────────────────────────────────── -->

## Edge Cases

- **Off-system values detected** (1): `margin-block-end` — requires human decision
- **Unexpected mode discrepancies** (1): `space/300`

<!-- ─────────────────────────────────────────────────────────────────────
  SECTION: Extraction Confidence
  
  The overall confidence summary. Aggregates all per-token flags into
  counts and an overall assessment. When human input is required, a
  callout lists each item that needs attention.
  
  OVERALL FLAG LOGIC:
    ✅ high   — All exact, no approximate or no-match, no review items
    ⚠️ medium — Some approximate matches but no blocking issues
    ❌ low    — No-match values, missing contracts, unexpected mode
                discrepancies, or conflicting variant recommendations
───────────────────────────────────────────────────────────────────── -->

## Extraction Confidence

**Overall**: ⚠️ medium

| Metric | Count |
|--------|-------|
| ✅ Exact matches | 12 |
| ⚠️ Approximate matches | 2 |
| ❌ No matches | 0 |

> **⚠️ Human Input Required** — Review the items below before proceeding to spec formalization.

- 1 unexpected mode discrepancy(ies) found — structural tokens differ between modes
- 2 approximate match(es) need confirmation — verify designer intent

<!-- ─────────────────────────────────────────────────────────────────────
  SECTION: Inheritance Pattern
  
  Shows the Component-Family alignment. When a Component-Family doc
  exists, displays the family name, pattern, and base component. When
  the doc is missing, shows a ⚠️ warning recommending creation.
───────────────────────────────────────────────────────────────────── -->

## Inheritance Pattern

**Family**: Button
**Pattern**: Primitive + Semantic (ButtonBase → ButtonCTA)
**Base Component**: `ButtonBase`

<!-- If the Component-Family doc were missing, this section would instead
     show:
     
     ⚠️ Component-Family-Button.md not found. Recommend creating it
     before proceeding.
     
     See `.kiro/steering/Component-Family-Template.md` for the template.
-->

<!-- ─────────────────────────────────────────────────────────────────────
  SECTION: Behavioral Contracts
  
  Classifies the component as interactive or static. Interactive
  components MUST have behavioral contracts defined before proceeding
  to requirements.md. Static components get an auto-generated
  "no interaction" contract.
  
  The ❌ Action Required callout blocks progression when contracts are
  missing for interactive components.
───────────────────────────────────────────────────────────────────── -->

## Behavioral Contracts

**Classification**: interactive ✅
**Detected States**: default, hover, focus, pressed, disabled
**Contracts Defined**: Yes

<!-- This component has all expected states and contracts are defined,
     so no blocking action is required. If contracts were missing, this
     section would show:
     
     **Contracts Defined**: No
     
     > ❌ **Action Required** — Define behavioral contracts for this
     > interactive component before proceeding to requirements.md.
-->

<!-- ─────────────────────────────────────────────────────────────────────
  SECTION: Platform Parity
  
  Flags platform-specific interactions with recommendations. When no
  concerns exist, shows a ✅ all-clear. When concerns exist, lists
  each interaction with its platform availability and recommendation.
───────────────────────────────────────────────────────────────────── -->

## Platform Parity

⚠️ **Platform parity concerns detected** — review recommendations below.

- **hover** (web): Map to press on mobile for equivalent feedback

<!-- ─────────────────────────────────────────────────────────────────────
  SECTION: Component Token Needs
  
  Surfaces repeated primitive token usage patterns with ILLUSTRATIVE
  suggestions. These suggestions reduce Ada's cognitive load during
  spec review but are NOT governance decisions.
  
  Key points:
  - Suggestions follow {component}.{property}.{scale} naming convention
  - Every suggestion is labeled "pending Ada review"
  - Ada makes the final decision during spec review (Phase 3)
  - The extractor never creates tokens autonomously
───────────────────────────────────────────────────────────────────── -->

## Component Token Needs

### Pattern 1: buttonCta.padding.horizontal = space.300

**Primitive Token**: `space.300`
**Usage Count**: 6 locations

**Usage Context**:
- ButtonCTA padding-inline (primary/medium): space.300
- ButtonCTA padding-inline (primary/large): space.300
- ButtonCTA padding-inline (secondary/medium): space.300
- ButtonCTA padding-inline (secondary/large): space.300
- ButtonCTA padding-inline (tertiary/medium): space.300
- ButtonCTA padding-inline (tertiary/large): space.300

**Illustrative Suggestion** (pending Ada review):
```
buttonCta.padding.horizontal = space.300
```

**Rationale**: Consistent horizontal padding across all 6 button variants suggests semantic intent. A component token would encode this design decision and make future padding changes a single-point update.

**Ada Decision Required**: Evaluate whether component tokens align with Token Governance standards.

### Pattern 2: buttonCta.padding.vertical = space.200

**Primitive Token**: `space.200`
**Usage Count**: 6 locations

**Usage Context**:
- ButtonCTA padding-block (primary/medium): space.200
- ButtonCTA padding-block (primary/large): space.200
- ButtonCTA padding-block (secondary/medium): space.200
- ButtonCTA padding-block (secondary/large): space.200
- ButtonCTA padding-block (tertiary/medium): space.200
- ButtonCTA padding-block (tertiary/large): space.200

**Illustrative Suggestion** (pending Ada review):
```
buttonCta.padding.vertical = space.200
```

**Rationale**: Consistent vertical padding across all 6 button variants suggests semantic intent.

**Ada Decision Required**: Evaluate whether component tokens align with Token Governance standards.

<!-- ─────────────────────────────────────────────────────────────────────
  SECTION: Accessibility Contracts
  
  Provides a checklist of accessibility requirements based on the
  component's classification. Interactive components get focus, disabled,
  keyboard, and ARIA checks. Static components get semantic HTML and
  contrast checks. Status is auto-detected where possible.
───────────────────────────────────────────────────────────────────── -->

## Accessibility Contracts

**Component Type**: Interactive

| Contract | Status |
|----------|--------|
| Focus visible indicator | ✅ Detected |
| Disabled state handling | ✅ Detected |
| Keyboard activation | ⚠️ Requires implementation review |
| ARIA role assignment | ⚠️ Requires implementation review |

<!-- Focus and disabled states were detected in the Figma component's
     variant/state definitions. Keyboard activation and ARIA roles
     cannot be determined from Figma alone — they require implementation
     review during spec formalization. -->

<!-- ═══════════════════════════════════════════════════════════════════════
  CONDITIONAL SECTION: Unmatched Values — Human Decision Required
  
  This section ONLY appears when the extraction found values that could
  not be matched to any DesignerPunk token. It provides actionable
  options for each unmatched value.
  
  In this example, no ❌ no-match values exist, so this section would
  not appear. Below is what it would look like if it did:
  
  ## ❌ Unmatched Values — Human Decision Required
  
  The following Figma values could not be matched to DesignerPunk tokens.
  Each requires a human decision before proceeding to spec formalization.
  
  ### 1. `margin-block-start`
  
  **Figma Value**: `30px`
  **Closest Match**: `space.300` (delta: +6px)
  
  **Options**:
  - Map to suggested token: `space.300`
  - Document as off-system value
  - Request new token creation
  
═══════════════════════════════════════════════════════════════════════ -->

<!-- ═══════════════════════════════════════════════════════════════════════
  MODE VALIDATION EXAMPLE
  
  Mode validation is reflected in the Edge Cases section above. Here is
  additional context on how mode discrepancies are categorized:
  
  EXPECTED DISCREPANCIES (no flag raised):
    Color tokens that differ between light and dark modes are expected.
    Example: color.primary = #B026FF (light) vs #C77DFF (dark)
    These represent intentional theme variations.
  
  UNEXPECTED DISCREPANCIES (flagged for review):
    Structural tokens (spacing, radius, typography) that differ between
    modes are unexpected because these should be mode-agnostic.
    Example: space/300 = 24px (light) vs 32px (dark)
    This likely indicates a design error or misunderstanding.
  
  The extractor categorizes each discrepancy and only flags unexpected
  ones. In this example, space/300 has different values in light and
  dark modes, which is flagged as unexpected in the Edge Cases section.
  
  When unexpected discrepancies exist:
  - The overall extraction confidence drops to ⚠️ or ❌
  - The CLI exits with code 1
  - The Extraction Confidence section lists the discrepancy as a review item
  - Human review is required before proceeding to spec formalization
═══════════════════════════════════════════════════════════════════════ -->
