# Semantic Token Naming Restructure - Design Outline

**Date**: January 22, 2026
**Purpose**: Restructuring semantic COLOR tokens to align with industry standards
**Status**: Design Outline (Finalized Model)
**Last Updated**: January 24, 2026
**Prerequisite**: Spec 044 (Badge-Base) complete — provides reference implementation

---

## Executive Summary

A comprehensive audit of all semantic token families revealed that **color tokens specifically** require restructuring. Other token families (shadow, typography, spacing, etc.) already follow clear, domain-appropriate patterns.

**Why Color Is Different**: Color tokens are unique because they apply to multiple visual styling properties (background, text, border, icon). Other token families don't have this ambiguity — `shadow.modal` always applies to box-shadow, `typography.bodyMd` always applies to text styling.

**Scope**: This spec focuses on **color tokens only**. The naming model is designed for extensibility while keeping tokens minimal.

**Key Findings**:
- **40 total semantic color tokens** evaluated
- **26 tokens require migration** (65%)
- **10 tokens already conform** (25%) — text, icon, badge, some surface tokens
- **4 tokens need decisions** — glow family, canvas, onPrimary

**Target Patterns**:
- Semantic: `color.{concept}.{role}.{property?}.{state?}.{intensity?}`
- Component: `color.{component}.{variant}.{property}`

---

## Target Architecture

### Design Philosophy: Concept-First (Nathan Curtis Model)

DesignerPunk adopts the **Nathan Curtis / EightShapes naming model** because it's optimized for:

1. **AI Agent reasoning**: Concept-first naming mirrors how AI parses natural language ("success message" → concept before application)
2. **Semantic search**: Grouping by meaning enables better token discovery
3. **Self-documenting intent**: Token names read as sentences explaining their purpose
4. **Human-AI collaboration**: Both humans and AI reason about meaning before application

### Two Token Patterns

Color tokens fall into two categories with distinct patterns:

#### Pattern 1: Semantic Concept Tokens
**For**: Status/feedback colors, identity colors, action colors, contrast colors — semantic meaning independent of components

**Pattern**: `color.{concept}.{role}.{property?}.{state?}.{intensity?}`

| Segment | Required | Description | Examples |
|---------|----------|-------------|----------|
| `color` | ✅ | Token family | Always `color` |
| `concept` | ✅ | Semantic category | `feedback`, `identity`, `action`, `contrast` |
| `role` | ✅ | Specific meaning | `success`, `error`, `select`, `human`, `primary`, `onDark` |
| `property` | ❌ | Visual styling property (when disambiguation needed) | `background`, `text`, `border`, `icon` |
| `state` | ❌ | Interaction state (when needed) | `rest`, `hover`, `pressed`, `disabled` |
| `intensity` | ❌ | Prominence level (when needed) | `fill`, `surface` |

**When to include property**:
- **Include**: When the concept/role applies to multiple properties (feedback.error needs both background AND text)
- **Omit**: When the token represents a single color value (identity.human IS the color, action.primary IS the color)

**Examples**:
```
// Feedback tokens (with property — multiple properties needed)
color.feedback.error.background           // Error background (pink100)
color.feedback.error.text                 // Error text (pink400)
color.feedback.success.background         // Success background (green100)
color.feedback.success.text               // Success text (green400)

// Feedback tokens with state (select has interaction states)
color.feedback.select.background.rest     // Selection background idle (cyan100)
color.feedback.select.background.hover    // Selection background hover (blend composition)
color.feedback.select.text.rest           // Selection text idle (cyan400)

// Identity tokens (no property — they ARE the color)
color.identity.human                      // Human identity color (orange300)
color.identity.agent                      // Agent identity color (teal200)

// Action tokens (visual emphasis levels, not action types)
color.action.primary                      // Emphasized action (purple300) — single, focused instances
color.action.secondary                    // De-emphasized action (black400) — repetitive, supporting instances

// Contrast tokens (no property — they ARE the contrast color)
color.contrast.onLight                    // Content on light backgrounds (black500)
color.contrast.onDark                     // Content on dark backgrounds (white100)

// Future expansion with intensity (if needed)
color.action.primary.background.fill      // Prominent primary background
color.action.primary.background.surface   // Subtle primary background
```

#### Pattern 2: Component Tokens
**For**: Component-specific colors — tied to specific UI components

**Pattern**: `color.{component}.{variant}.{property}`

| Segment | Required | Description | Examples |
|---------|----------|-------------|----------|
| `color` | ✅ | Token family | Always `color` |
| `component` | ✅ | UI component | `avatar`, `badge` |
| `variant` | ✅ | Component-specific variant | `human`, `agent`, `notification` |
| `property` | ✅ | Visual styling property | `background`, `text`, `border`, `icon` |

**Note**: Variant comes BEFORE property in component tokens — this groups all properties for a variant together.

**Examples**:
```
// Avatar component tokens (reference semantic tokens)
color.avatar.human.background             // → color.identity.human
color.avatar.human.icon                   // → color.contrast.onDark
color.avatar.agent.background             // → color.identity.agent
color.avatar.agent.icon                   // → color.contrast.onDark
color.avatar.default.border               // → gray100

// Badge component tokens
color.badge.notification.background       // → pink400
color.badge.notification.text             // → color.contrast.onDark
```

### Why Two Patterns?

**Semantic concept tokens** express meaning independent of any component:
- "Human identity" is a concept that can be used across many components
- "Error feedback" applies to forms, alerts, notifications, etc.
- Grouping by concept (`feedback.error.*`, `identity.human`) enables semantic search

**Component tokens** are tied to specific UI components:
- "Avatar human" only makes sense in the Avatar component context
- Component tokens REFERENCE semantic tokens (compositional)
- Grouping by component (`avatar.human.*`) enables component-scoped discovery

### Intensity Values (Optional Expansion)

| Intensity | Meaning | Typical Use |
|-----------|---------|-------------|
| `surface` | Subtle, background use | Background fills, subtle indicators |
| `fill` | Prominent, foreground use | Text, icons, prominent indicators |

Intensity is added only when a token needs both subtle and prominent variants. Most tokens don't need this distinction.

### Cross-Platform Applicability

These patterns apply across all platforms — the "property" segment refers to **visual styling properties** that exist on all platforms:

| Property | Web | iOS | Android |
|----------|-----|-----|---------|
| `background` | `background-color` | `backgroundColor` | `background` |
| `text` | `color` | `foregroundColor` | `color` |
| `border` | `border-color` | `borderColor` | `borderColor` |
| `icon` | `fill`/`color` | `tint` | `tint` |

---

## Research Findings

### Industry Token Naming Patterns

#### Nathan Curtis / EightShapes (Primary Influence)
**Pattern**: `{category}-{concept}-{property}-{variant}-{state}`

| Token | Purpose |
|-------|---------|
| `color-feedback-success-background` | Success feedback background |
| `color-action-primary-background-hover` | Primary action background hover |

**Key insight**: Concept-first naming optimized for semantic reasoning. Good tokens explain what they do.

#### Shopify Polaris
**Pattern**: `color-[property]-[surface/fill]-[role]-[state]`

| Token | Purpose |
|-------|---------|
| `--p-color-bg-surface-success` | Success surface background |
| `--p-color-bg-fill-success` | Success fill (more prominent) |

**Key insight**: Distinguishes between `surface` (subtle) and `fill` (prominent) — adopted for optional intensity expansion.

#### Material Design 3
**Pattern**: `md.sys.color.[role]` (system) → `md.comp.[component].color` (component)

| Token | Purpose |
|-------|---------|
| `md.sys.color.primary` | Primary color |
| `md.sys.color.on-primary` | Content on primary |

**Key insight**: Uses `on-[surface]` pattern for contrast colors — influenced our `contrast.onLight`/`contrast.onDark` naming.

### Key Takeaways

1. **Concept-first is AI-optimized**: Nathan Curtis model mirrors natural language reasoning
2. **Property is optional**: Include only when disambiguation is needed
3. **Intensity is optional**: `fill`/`surface` distinction only when both variants exist
4. **State is optional**: Include only for tokens with interaction states
5. **Component tokens reference semantic tokens**: Compositional architecture

---

## Semantic Concept Definitions

Understanding what each concept represents is critical for correct token selection:

### Feedback Concept
**Purpose**: Communicate system status to users
**Roles**: `success`, `error`, `warning`, `info`, `select`
**Usage**: Form validation, alerts, notifications, selection states

**Design Note (Select)**: `select` is placed under `feedback` because it represents UI response to user action. However, if additional interaction-based use cases emerge (e.g., focus states, drag states), consider migrating `select` to a new `interaction` concept. Add a code comment in the token definition to preserve this design thinking.

### Identity Concept
**Purpose**: Distinguish entity types visually
**Roles**: `human`, `agent`
**Usage**: Avatars, attribution, entity indicators

### Action Concept
**Purpose**: Visual emphasis levels for interactive elements
**Roles**: `primary` (emphasized), `secondary` (de-emphasized)
**Usage**: Buttons, links, interactive controls

**Critical distinction**: `primary` vs `secondary` represents **visual emphasis**, not action type. Both can be CTAs — use `primary` for single, focused instances (hero buttons) and `secondary` for repetitive instances (action lists) to avoid "purple-ication" of the UI.

**Example**:
```typescript
// Single hero CTA on a page
<ButtonCTA emphasis="primary" />   // → color.action.primary (purple)

// List of 10 action items
<ButtonCTA emphasis="secondary" /> // → color.action.secondary (neutral)
```

### Contrast Concept
**Purpose**: Ensure readable content on colored backgrounds
**Roles**: `onLight`, `onDark`
**Usage**: Text/icons on colored surfaces

### Structure Concept
**Purpose**: Define the visual organization and layering of UI elements
**Roles**: `canvas` (base layer), `surface` (elevated layer), `border` (boundaries)
**Properties**: `border` may include `subtle` variant for semi-transparent borders
**Usage**: Page backgrounds, card backgrounds, container edges, dividers

**Token Mapping**:
| Current | New | Value |
|---------|-----|-------|
| `color.background` | `color.structure.canvas` | white100 |
| `color.surface` | `color.structure.surface` | white200 |
| `color.border` | `color.structure.border` | gray100 |
| `color.canvas` | (merge with structure.canvas) | white100 |
| (new) | `color.structure.border.subtle` | rgba(gray100, 0.48) |

**Future expansion**: Surface layering with `.100`, `.200` suffixes when multiple elevation levels are needed (e.g., `color.structure.surface.100`, `color.structure.surface.200`).

---

## Semantic Token Family Audit Summary

### Audit Scope

A comprehensive audit of **all 17 semantic token families** was conducted to determine which families need restructuring.

### Audit Results

| Family | Token Count | Needs Restructuring? | Rationale |
|--------|-------------|---------------------|-----------|
| **Color** | 40 | ✅ **YES** | Applies to multiple CSS properties (background, text, border, icon) |
| Accessibility | 3 | ❌ No | Property already explicit in naming |
| Blend | 7 | ❌ No | Context-based, clear semantic meaning |
| BorderWidth | 4 | ❌ No | Only applies to border-width |
| Elevation | 7 | ❌ No | Android-specific, context-based |
| GridSpacing | 10 | ❌ No | Clear breakpoint-based naming |
| Icon | 12 | ❌ No | Property explicit (size, strokeWidth) |
| Layering/ZIndex | 6 | ❌ No | Context-based, single property |
| Motion | 5 | ❌ No | Composite tokens, context-based |
| Opacity | 4 | ❌ No | Only applies to opacity |
| Radius | 7 | ❌ No | Only applies to border-radius |
| Shadow | 14 | ❌ No | Only applies to box-shadow |
| Spacing | ~25 | ❌ No | Hierarchical, clear semantic meaning |
| Typography | 24 | ❌ No | Composite tokens, context-based |

**Conclusion**: Only **color tokens** require restructuring. Other families already follow clear, domain-appropriate patterns.

---

## Color Token Audit Summary

### Token Inventory (40 Total)

| Category | Token Count | Conforms | Migration Phase |
|----------|-------------|----------|-----------------|
| Component tokens (Avatar, Select, Badge) | 11 | 2 (Badge) | Phase 1 |
| Status/Feedback tokens | 8 | 0 | Phase 2 |
| Surface/Layout tokens | 6 | 4 | Phase 3 |
| Text/Icon tokens | 4 | 4 | ✅ No migration |
| System tokens (primary, attention, etc.) | 6 | 0 | Phase 4 |
| Glow tokens | 5 | N/A | Decision required |
| **Total** | **40** | **10** | **26 to migrate** |

### Tokens Already Conforming (10 tokens) ✅

These tokens already follow the target pattern and require no changes:

| Token | Primitive | Category |
|-------|-----------|----------|
| `color.text.default` | gray300 | Text |
| `color.text.muted` | gray200 | Text |
| `color.text.subtle` | gray100 | Text |
| `color.icon.default` | gray200 | Icon |
| `color.badge.background.notification` | pink400 | Badge |
| `color.badge.text.notification` | white100 | Badge |
| `color.background` | white100 | Surface |
| `color.background.primary.subtle` | purple100 | Surface |
| `color.surface` | white200 | Surface |
| `color.border` | gray100 | Surface |

---

## Current State Analysis

### DesignerPunk's Current Patterns

#### Pattern 1: Purpose-Based (No Property)
```typescript
'color.primary'           // → purple300
'color.success.strong'    // → green400
'color.success.subtle'    // → green100
```
**Issue**: `strong/subtle` doesn't indicate property (background vs text).

#### Pattern 2: Element-Based (Property Explicit)
```typescript
'color.text.default'      // → gray300
'color.icon.default'      // → gray200
'color.background'        // → white100
```
**Assessment**: Good — property is explicit. These conform to target pattern.

#### Pattern 3: Component-Specific (Inconsistent)
```typescript
// Avatar: Implicit background
'color.avatar.human'              // → orange300 (background? identity?)
'color.avatar.contrast.onHuman'   // → white100 (non-standard pattern)

// Select: strong/subtle pattern
'color.select.selected.strong'    // → cyan400 (foreground)
'color.select.selected.subtle'    // → cyan100 (background)
```
**Issue**: Inconsistent patterns. Avatar uses implicit background; Select uses strong/subtle which inverts typical meaning.

### Problems with Current Approach

1. **Implicit vs Explicit**: `color.avatar.human` doesn't tell you it's a background color
2. **Inverted Semantics**: `strong/subtle` in Select means foreground/background, but in status tokens it means prominent/subtle
3. **Missing Concepts**: No identity layer, no contrast layer — colors are scattered
4. **Discoverability**: Developers must read documentation to understand what each token applies to

---

## Complete Migration Mapping

### Semantic Concept Tokens

#### Feedback Concept (8 tokens)

| Current | Primitive | Target |
|---------|-----------|--------|
| `color.success.strong` | green400 | `color.feedback.success.text` |
| `color.success.subtle` | green100 | `color.feedback.success.background` |
| `color.warning.strong` | orange400 | `color.feedback.warning.text` |
| `color.warning.subtle` | orange100 | `color.feedback.warning.background` |
| `color.error.strong` | pink400 | `color.feedback.error.text` |
| `color.error.subtle` | pink100 | `color.feedback.error.background` |
| `color.info.strong` | teal400 | `color.feedback.info.text` |
| `color.info.subtle` | teal100 | `color.feedback.info.background` |

#### Select Concept (4 tokens) — Part of Feedback

| Current | Primitive | Target |
|---------|-----------|--------|
| `color.select.selected.strong` | cyan400 | `color.feedback.select.text.rest` |
| `color.select.selected.subtle` | cyan100 | `color.feedback.select.background.rest` |
| `color.select.notSelected.strong` | gray200 | `color.feedback.select.text.default` |
| `color.select.notSelected.subtle` | gray100 | `color.feedback.select.background.default` |

**Note**: Select tokens include state (`rest`, `default`) because selection has interaction states. Hover states will use blend compositions.

#### Identity Concept (2 tokens)

| Current | Primitive | Target |
|---------|-----------|--------|
| `color.avatar.human` | orange300 | `color.identity.human` |
| `color.avatar.agent` | teal200 | `color.identity.agent` |

#### Action Concept (2 tokens)

| Current | Primitive | Target | Semantic Meaning |
|---------|-----------|--------|------------------|
| `color.primary` | purple300 | `color.action.primary` | Emphasized action (single, focused) |
| (new) | black400 | `color.action.secondary` | De-emphasized action (repetitive, supporting) |

**Note**: `primary`/`secondary` represent visual emphasis levels, not action types. Use `primary` for hero moments, `secondary` for lists to avoid UI over-saturation.

#### Contrast Concept (2 tokens)

| Current | Primitive | Target |
|---------|-----------|--------|
| `color.contrast.onPrimary` | white100 | `color.contrast.onDark` |
| (new) | black500 | `color.contrast.onLight` |

**Note**: Values corrected — `onLight` = black500 (dark content on light backgrounds), `onDark` = white100 (light content on dark backgrounds).

---

### Component Tokens

#### Avatar Component (5 tokens)

| Current | Target | References |
|---------|--------|------------|
| `color.avatar.human` | `color.avatar.human.background` | `color.identity.human` |
| `color.avatar.agent` | `color.avatar.agent.background` | `color.identity.agent` |
| `color.avatar.contrast.onHuman` | `color.avatar.human.icon` | `color.contrast.onDark` |
| `color.avatar.contrast.onAgent` | `color.avatar.agent.icon` | `color.contrast.onDark` |
| `color.avatar.border` | `color.avatar.default.border` | gray100 |

#### Badge Component (2 tokens) — Already Conforms (Spec 044)

| Current | Target | Notes |
|---------|--------|-------|
| `color.badge.background.notification` | `color.badge.notification.background` | Reorder: variant before property |
| `color.badge.text.notification` | `color.badge.notification.text` | Reorder: variant before property |

**Note**: Badge tokens from Spec 044 need minor reordering to match the `{component}.{variant}.{property}` pattern.

---

### Structure Concept (5 tokens) — NEW

| Current | Primitive | Target |
|---------|-----------|--------|
| `color.background` | white100 | `color.structure.canvas` |
| `color.canvas` | white100 | `color.structure.canvas` (merge) |
| `color.surface` | white200 | `color.structure.surface` |
| `color.border` | gray100 | `color.structure.border` |
| (new) | rgba(gray100, 0.48) | `color.structure.border.subtle` |

**Note**: Structure concept provides concept-first naming for neutral visual organization tokens. `color.structure.border.subtle` uses RGBA with baked-in alpha for semi-transparent borders (Avatar use case).

---

### Feedback Border Tokens (6 tokens) — NEW

| Token | Value | Notes |
|-------|-------|-------|
| `color.feedback.error.border` | pink400 | Same as `color.feedback.error.text` |
| `color.feedback.success.border` | green400 | Same as `color.feedback.success.text` |
| `color.feedback.warning.border` | orange400 | Same as `color.feedback.warning.text` |
| `color.feedback.info.border` | teal400 | Same as `color.feedback.info.text` |
| `color.feedback.select.border.rest` | cyan400 | Same as `color.feedback.select.text.rest` |
| `color.feedback.select.border.default` | gray200 | Same as `color.feedback.select.text.default` |

**Note**: Border tokens have same values as corresponding text tokens for semantic clarity. Separate tokens allow future divergence if design needs change.

---

### Tokens Already Conforming (No Migration)

| Token | Primitive | Assessment |
|-------|-----------|------------|
| `color.text.default` | gray300 | ✅ Follows pattern |
| `color.text.muted` | gray200 | ✅ Follows pattern |
| `color.text.subtle` | gray100 | ✅ Follows pattern |
| `color.icon.default` | gray200 | ✅ Follows pattern |
| `color.background.primary.subtle` | purple100 | ✅ Follows pattern |

**Note**: `color.background`, `color.surface`, `color.border`, and `color.canvas` are migrating to the Structure concept.

---

### Tokens Requiring Review

| Current | Primitive | Decision |
|---------|-----------|----------|
| `color.canvas` | white100 | Keep or merge with `color.background` |
| `color.attention` | yellow400 | Keep or move to `color.feedback.attention` |
| `color.highlight` | yellow300 | Keep or move to `color.feedback.highlight` |
| `color.tech` | cyan400 | Keep as accent |
| `color.data` | cyan300 | Keep as accent |
| `color.print.default` | black100 | Keep as media-specific |

---

### Glow Tokens (5 tokens) — Keep Separate Family ✅

| Current | Primitive | Assessment |
|---------|-----------|------------|
| `glow.neonPurple` | purple500 | ✅ Keep as `glow.*` family |
| `glow.neonCyan` | cyan500 | ✅ Keep as `glow.*` family |
| `glow.neonYellow` | yellow500 | ✅ Keep as `glow.*` family |
| `glow.neonGreen` | green500 | ✅ Keep as `glow.*` family |
| `glow.neonPink` | pink500 | ✅ Keep as `glow.*` family |

**Decision**: Glow is an effect, not a color semantic — keep as separate family.

---

## Spec Execution Plan

This design outline serves as the **design authority** for semantic color token restructuring. Implementation is split across two specs to ensure thorough audit before migration.

### Spec 051: Design Authority + Component Audit (This Spec)

**Purpose**: Establish naming model, audit all components, identify gaps, finalize complete token mapping

**Deliverables**:
1. ✅ Naming model definition (complete)
2. ✅ Semantic concept definitions (complete)
3. ⏳ Component-by-component audit (15 components)
4. ⏳ Gap identification — tokens needed but not yet defined
5. ⏳ Complete token mapping — all migrations + new tokens
6. ⏳ Finalized design-outline.md

**Components to Audit** (15 total):
| Component | Primary Color Usage | Audit Status |
|-----------|---------------------|--------------|
| Avatar | Identity, Contrast | ✅ Complete |
| Badge-Count-Base | Surface, Text | ✅ Complete |
| Badge-Count-Notification | Feedback (notification) | ✅ Complete |
| Badge-Label-Base | Surface, Text | ✅ Complete |
| Button-CTA | Action (primary/secondary) | ✅ Complete |
| Button-Icon | Action, Contrast | ✅ Complete |
| Button-VerticalList-Item | Feedback (select) | ✅ Complete |
| Button-VerticalList-Set | Feedback (error) | ✅ Complete |
| Container-Base | Surface tokens | ✅ Complete |
| Container-Card-Base | Surface tokens | ✅ Complete |
| Icon-Base | Icon tokens | ✅ Complete |
| Input-Text-Base | Feedback (error/success), Text | ✅ Complete |
| Input-Text-Email | Inherits from Base | ✅ Complete |
| Input-Text-Password | Inherits from Base | ✅ Complete |
| Input-Text-PhoneNumber | Inherits from Base | ✅ Complete |

**Audit Questions per Component**:
1. What color tokens does it currently use?
2. Do current tokens align with new conceptual model?
3. Are there hard-coded values that should use tokens?
4. Does it need component-specific tokens or can it use semantic directly?
5. Are there missing tokens that need to be created?

### Spec 052: Full Implementation

**Purpose**: Execute all token migrations and component updates

**Scope** (to be finalized after Spec 051 audit):
- Create all new semantic concept tokens
- Migrate all existing tokens to new names
- Update all 15 components to use new token structure
- Create deprecation aliases (2 release cycle)
- Update all documentation
- Update all tests

**Estimated Impact** (preliminary):
- ~40 token definitions to update/create
- ~15 components to audit and update
- ~100+ files touched (token refs, components, tests, docs)

### Why Two Specs?

1. **Audit may reveal surprises**: Components might use patterns we haven't considered or need tokens we haven't defined
2. **Design decisions complete before implementation**: New token needs discovered during audit should be decided in design phase
3. **Clear separation of concerns**: Spec 051 = "what", Spec 052 = "how"
4. **Review checkpoint**: Human review of complete audit before committing to implementation

---

## Scope

### Spec 051 Focus: Design Authority + Component Audit

This spec establishes the **authoritative naming model** for semantic color tokens and conducts a **comprehensive audit of all 15 components** to ensure the token system meets real-world needs.

**Why audit before implementation?** The naming model is theoretical until validated against actual component usage. The audit may reveal:
- Missing tokens that components need
- Patterns we haven't considered
- Component-specific token requirements
- Gaps in the conceptual model

### Spec 051 Deliverables
- ✅ Complete naming model definition
- ✅ Semantic concept definitions with usage guidance
- ⏳ Component-by-component audit findings
- ⏳ Gap analysis and new token definitions
- ⏳ Finalized migration mapping (all tokens)
- ⏳ Updated design-outline.md as authoritative reference

### Spec 052 Deliverables (Future)
- Primitive color tokens migrated to RGBA format (cascades to all semantic tokens)
- Rosetta pipeline updated for RGBA output (web, iOS, Android)
- All semantic token naming migrations executed
- All 15 components updated to use new token names
- Deprecation aliases in place
- Documentation updated
- Tests updated

### Out of Scope (Both Specs)
- ❌ Other semantic token families (already follow good patterns)
- ❌ Dark mode token variations
- ❌ New component development

---

## Decisions Made

### Decision 1: Naming Model ✅ DECIDED
**Choice**: Nathan Curtis / EightShapes concept-first model
**Pattern**: `color.{concept}.{role}.{property?}.{state?}.{intensity?}`
**Rationale**: Optimized for AI agent reasoning, semantic search, and Human-AI collaboration. Segments added only when needed.

### Decision 2: Two-Pattern Approach ✅ DECIDED
**Choice**: Separate patterns for semantic concept tokens vs component tokens
- Semantic: `color.{concept}.{role}.{property?}.{state?}.{intensity?}`
- Component: `color.{component}.{variant}.{property}`
**Rationale**: Semantic concepts (feedback, identity) are reusable; components (avatar, badge) are UI-specific and reference semantic tokens.

### Decision 3: Glow Token Family ✅ DECIDED
**Choice**: Keep as separate `glow.*` family
**Rationale**: Glow is an effect, not a color semantic.

### Decision 4: Contrast Token Values ✅ DECIDED
**Choice**: 
- `color.contrast.onLight` = black500 (dark content on light backgrounds)
- `color.contrast.onDark` = white100 (light content on dark backgrounds)
**Rationale**: Naming matches the background the content sits ON.

### Decision 5: State Naming ✅ DECIDED
**Choice**: Use `rest` for idle state
**Rationale**: Already prevalent in codebase, clearer than "idle" or "default" for interaction states.

### Decision 6: Intensity as Optional Expansion ✅ DECIDED
**Choice**: `fill`/`surface` available when needed, not required
**Rationale**: Most tokens don't need intensity distinction. Add only when a concept needs both subtle and prominent variants.

### Decision 7: Deprecation Strategy ✅ DECIDED
**Choice**: 2 releases (~4-8 weeks)
**Rationale**: Balances cleanup with safety for consumers.

### Decision 8: Structure Concept ✅ DECIDED
**Choice**: New `structure` concept for visual organization tokens
**Pattern**: `color.structure.{role}.{variant?}`
**Roles**: `canvas` (base layer), `surface` (elevated layer), `border` (boundaries)
**Rationale**: Provides concept-first naming for neutral structural elements. Replaces property-first tokens (`color.background`, `color.surface`, `color.border`).

### Decision 9: Feedback Border Tokens ✅ DECIDED
**Choice**: Add `border` property to feedback tokens
**Pattern**: `color.feedback.{role}.border`
**Values**: Same as corresponding `text` token (e.g., `color.feedback.error.border` = pink400)
**Rationale**: Semantic clarity for border usage. Separate tokens allow future divergence if design needs change.

### Decision 10: Color Format Migration ✅ DECIDED
**Choice**: Migrate primitive color tokens from hex to RGBA format at the source
**Approach**: Convert all ~50 primitive color tokens to RGBA; semantic tokens automatically inherit the format
**Rationale**: 
- Native alpha channel support (solves border transparency issue)
- Industry standard (Polaris, Atlassian use RGBA)
- Cross-platform friendly (direct mapping to iOS/Android color APIs)
- Enables `color.structure.border.subtle` with baked-in alpha
- **Efficiency**: One conversion at primitive level cascades through entire token hierarchy
- **Architectural clarity**: Primitives define raw values including format; semantics define meaning by reference

### Decision 11: Border Transparency Solution ✅ DECIDED
**Choice**: `color.structure.border.subtle` with baked-in RGBA alpha
**Value**: `rgba(128, 128, 128, 0.48)` (gray100 at 48% opacity)
**Rationale**: Following Polaris/Atlassian pattern of baking alpha into token value. Cleaner than blend token workaround. Enabled by RGBA migration.

### Decision 12: Button-CTA Min-Width Tokens ✅ DECIDED
**Choice**: Skip tokenizing min-width values
**Rationale**: Values (56px, 72px, 80px) are component-specific, managed by props, and don't need theme-awareness or cross-component reuse.

---

## Decisions Resolved During Audit

The following decisions were resolved during the component audit phase:

### Decision 13: `color.primary` Migration Timing ✅ RESOLVED
**Resolution**: Migrate immediately to `color.action.primary`
**Rationale**: Audit confirmed Button-CTA and Button-Icon are the primary consumers. Migration is straightforward with deprecation alias.

### Decision 14: Badge Token Reordering ✅ RESOLVED
**Resolution**: Yes, reorder to match `{component}.{variant}.{property}` pattern
**Mapping**:
| Current | Target |
|---------|--------|
| `color.badge.background.notification` | `color.badge.notification.background` |
| `color.badge.text.notification` | `color.badge.notification.text` |

### Decision 15: Component-Specific Token Needs ✅ RESOLVED
**Resolution**: Avatar needs component tokens referencing semantic tokens. Other components can use semantic tokens directly.
**Rationale**: Avatar has unique identity-based variants (human, agent) that warrant component-level abstraction.

---

## Implementation Considerations

### Primitive RGBA Migration (Foundation)
- Convert all ~50 primitive color tokens from hex to RGBA at source (`src/tokens/ColorTokens.ts`)
- Format: `rgba(r, g, b, 1)` for opaque colors, `rgba(r, g, b, alpha)` for transparent
- Semantic tokens automatically inherit RGBA format via primitive references
- No per-semantic-token conversion needed — cascades through hierarchy

### Rosetta Pipeline Updates
- Token naming validation rules
- Generation templates for new naming pattern
- **Platform-specific RGBA output**:
  - Web: `rgba(r, g, b, a)` CSS format
  - iOS: `UIColor(red: r/255, green: g/255, blue: b/255, alpha: a)`
  - Android: `Color.argb(a, r, g, b)` or `0xAARRGGBB` format
- Backward compatibility layer (if needed)

### Breaking Changes
This is a breaking change for any external consumers using our tokens directly. Mitigation options:
1. **Deprecation period**: Keep old names as aliases for 1-2 releases
2. **Migration script**: Provide automated find/replace tooling
3. **Documentation**: Clear migration guide with before/after examples

### Testing Strategy
- Unit tests for token existence and values
- Integration tests for component token consumption
- Visual regression tests for components using renamed tokens
- **RGBA format validation** — ensure all color tokens output valid RGBA

---

## Dependencies

- **Spec 044 (Badge-Base)**: ✅ Complete — provides reference implementation using new pattern
- **Rosetta System**: Requires updates for RGBA format support and naming validation
- **Component implementations**: Avatar, Button-VerticalList-Item components need updates

---

## Documentation Impact

### Steering Documentation

| Document | Update Scope |
|----------|--------------|
| `Component-Family-Avatar.md` | Full update (5 tokens) |
| `Component-Family-Button.md` | Full update (4 select tokens) |
| `Token-Family-Color.md` | Major update (all color tokens) |
| `Token-Governance.md` | Update examples |
| `Token-Quick-Reference.md` | Full update |

### Component Documentation

| Document | Update Scope |
|----------|--------------|
| `Avatar/README.md` | Full update |
| `Button-VerticalList-Item/README.md` | Full update |

### Test Files

| Test Category | Update Scope |
|---------------|--------------|
| `ColorTokens.test.ts` | Major update |
| Avatar tests | Phase 1 |
| Select/Button tests | Phase 1 |

---

## Success Criteria

### Spec 051 Success (Design + Audit)
- [x] Nathan Curtis concept-first naming model adopted
- [x] Two-pattern approach defined (semantic concept + component tokens)
- [x] Flexible pattern with optional segments (property, state, intensity)
- [x] Semantic concept definitions with usage guidance (feedback, identity, action, contrast, structure)
- [x] Contrast token values clarified (onLight = black500, onDark = white100)
- [x] State naming decided (use `rest`)
- [x] Deprecation strategy decided (2 releases)
- [x] All 15 components audited against new structure
- [x] All gaps identified and new tokens defined
- [x] Complete migration mapping finalized
- [x] Design outline updated as authoritative reference
- [x] Structure concept defined for neutral visual organization tokens
- [x] Feedback border tokens defined (same value as text tokens)
- [x] Color format migration to RGBA decided
- [x] Border transparency solution via RGBA baked-in alpha decided

### Spec 052 Success (Implementation)
- [ ] All primitive color tokens migrated to RGBA format
- [ ] Rosetta pipeline updated for RGBA output (web, iOS, Android)
- [ ] All semantic concept tokens created (feedback, identity, action, contrast, structure)
- [ ] All component tokens migrated
- [ ] All 15 components updated to use new tokens
- [ ] `color.structure.border.subtle` implemented with baked-in alpha
- [ ] Deprecated aliases in place
- [ ] All tests passing
- [ ] All documentation updated
- [ ] No visual regressions

---

## References

- [Naming Tokens in Design Systems - Nathan Curtis](https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676) — **Primary influence for concept-first naming**
- [Shopify Polaris - Color Tokens](https://polaris.shopify.com/design/colors/color-tokens) — Intensity model (`surface`/`fill`), RGBA format reference
- [Atlassian Design System - Color](https://atlassian.design/foundations/color/) — Alpha colors, border tokens
- [Smart Interface Design Patterns - Token Naming](https://smart-interface-design-patterns.com/articles/naming-design-tokens/)
- [Orbit Design Tokens](https://orbit.kiwi/foundation/design-tokens/component-specific/)

---

## Next Steps

### Spec 051 Remaining Work
1. ✅ **Naming model finalized** — Complete
2. ✅ **Semantic concepts defined** — Complete (including Structure concept)
3. ✅ **Component audit** — All 15 components audited
4. ✅ **Gap analysis** — New tokens identified
5. ✅ **Finalize mapping** — Complete token migration table with audit findings
6. ✅ **Update design outline** — Incorporated audit results
7. ✅ **Color format decision** — RGBA migration included in Spec 052
8. ✅ **Border transparency solution** — Via RGBA baked-in alpha

### Spec 052 (Ready to Create)
1. Create requirements.md, design.md, tasks.md for implementation
2. **Migrate primitive color tokens to RGBA format** (cascades to all semantic tokens)
3. **Update Rosetta pipeline for RGBA output** (web, iOS, Android)
4. Execute semantic token naming migrations
5. Update all 15 components to use new token names
6. Create deprecation aliases (2 release cycle)
7. Update documentation and tests

---

## Component Audit Results Summary

The complete component audit is documented in `findings/component-token-audit-051.md`.

### Key Findings

**Components by Alignment Status:**
- ✅ **Fully Conforms (6)**: Badge-Count-Base, Badge-Label-Base, Icon-Base, Input-Text-Email, Input-Text-Password, Input-Text-PhoneNumber
- ⚠️ **Minor Changes (2)**: Badge-Count-Notification (reorder), Button-VerticalList-Item (audit state mapping)
- ❌ **Needs Migration (7)**: Avatar, Button-CTA, Button-Icon, Button-VerticalList-Set, Container-Base, Container-Card-Base, Input-Text-Base

**New Semantic Tokens Required:**
| Token | Value | Concept |
|-------|-------|---------|
| `color.identity.human` | orange300 | Identity |
| `color.identity.agent` | teal200 | Identity |
| `color.action.primary` | purple300 | Action |
| `color.action.secondary` | black400 | Action |
| `color.contrast.onDark` | white100 | Contrast |
| `color.contrast.onLight` | black500 | Contrast |
| `color.feedback.error.text` | pink400 | Feedback |
| `color.feedback.error.background` | pink100 | Feedback |
| `color.feedback.success.text` | green400 | Feedback |
| `color.feedback.success.background` | green100 | Feedback |
| `color.feedback.warning.text` | orange400 | Feedback |
| `color.feedback.warning.background` | orange100 | Feedback |
| `color.feedback.info.text` | teal400 | Feedback |
| `color.feedback.info.background` | teal100 | Feedback |
| `color.feedback.select.text.rest` | cyan400 | Feedback |
| `color.feedback.select.background.rest` | cyan100 | Feedback |
| `color.feedback.select.text.default` | gray200 | Feedback |
| `color.feedback.select.background.default` | gray100 | Feedback |

**Token Migrations Required:**
| Current Token | New Token |
|---------------|-----------|
| `color.primary` | `color.action.primary` |
| `color.contrast.onPrimary` | `color.contrast.onDark` |
| `color.avatar.human` | `color.identity.human` |
| `color.avatar.agent` | `color.identity.agent` |
| `color.error.strong` | `color.feedback.error.text` |
| `color.error.subtle` | `color.feedback.error.background` |
| `color.success.strong` | `color.feedback.success.text` |
| `color.success.subtle` | `color.feedback.success.background` |
| `color.warning.strong` | `color.feedback.warning.text` |
| `color.warning.subtle` | `color.feedback.warning.background` |
| `color.info.strong` | `color.feedback.info.text` |
| `color.info.subtle` | `color.feedback.info.background` |
| `color.select.selected.strong` | `color.feedback.select.text.rest` |
| `color.select.selected.subtle` | `color.feedback.select.background.rest` |
| `color.select.notSelected.strong` | `color.feedback.select.text.default` |
| `color.select.notSelected.subtle` | `color.feedback.select.background.default` |
| `color.badge.background.notification` | `color.badge.notification.background` |
| `color.badge.text.notification` | `color.badge.notification.text` |

---

## Audit Reference

For detailed audit findings including component dependency maps and file impact analysis, see:
- `findings/semantic-token-naming-audit-findings.md`

---

**Organization**: spec-guide
**Scope**: 051-semantic-token-naming-restructure
