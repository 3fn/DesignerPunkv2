# Figma Integration - Design Outline

**Date**: February 3, 2026
**Purpose**: Shared architectural context for Figma integration (Code → Figma → Spec workflow)
**Status**: Design Outline (Pre-Requirements) — Awaiting Lina's Review (Ada Approved)
**Last Updated**: February 18, 2026 (Revised composite token strategy to use Figma styles first, added mode mapping strategy, resolved OQ-054-8 and OQ-054-9)
**Depends On**: Spec 053 (DTCG Token Format Generator)

---

## Domain Review Status

This design outline requires review from domain specialists before proceeding to formal specs.

### Ada (Rosetta Token Specialist) — Review Required

**Review Focus:** Token representation, governance, and translation

**Questions for Ada:**

1. **Composite Token Decomposition Strategy** (see "Composite Token Reconstruction Strategy" section)
   - Is decomposing shadow/typography tokens into individual Figma variables the right approach?
   - Should variable naming follow `shadow/elevation200/x` pattern, or different convention?
   - Are there composite token types beyond shadow/typography that need special handling?

2. **Semantic Token Translation Priority** (see "Semantic Token Translation Priority" section)
   - Should semantic tokens always be preferred over primitives in design-outlines?
   - Is the enriched response format (showing both primitive and semantic) sufficient for traceability?
   - Are there cases where primitive tokens should be preferred over semantic?

3. **Token Governance in Extraction** (see "Design Outline Quality Checklist" section)
   - Is the pause-on-no-match policy sufficient to enforce token governance?
   - Should tolerance rules (±2px spacing, ΔE < 3 color) be tighter or looser?
   - What's the threshold for "approximate match" vs "no match"?

4. **FigmaTransformer Architecture** (see "FigmaTransformer Implementation" section)
   - Does the transformer implementation align with Rosetta architecture?
   - Should the transformer handle mode-specific values (light/dark) differently?
   - Are there DTCG → Figma type mappings that need adjustment?

**Ada's Sign-Off:** [X] Approved

**Ada's Feedback:**
```
Approved with two architectural decisions:

1. OQ-054-8: Composite Token Push Strategy → RESOLVED: Styles First, Variables as Fallback
   - Shadow tokens → Figma Effect Styles via Plugin API
   - Typography tokens → Figma Text Styles via Plugin API
   - Fallback to decomposed variables for unsupported composite types

2. OQ-054-9: Mode Mapping Strategy → RESOLVED: Identical Values Across Modes (Phase 1)
   - All tokens pushed to both light/dark modes with identical values
   - Platform separation (web/iOS/Android) remains at build time
   - Future theme support can map to modes without requiring changes

See resolved open questions (OQ-054-8, OQ-054-9) for full rationale.

Date: February 18, 2026
```

---

### Lina (Stemma Component Specialist) — Review Required

**Review Focus:** Component extraction, variant mapping, and design-outline quality

**Questions for Lina:**

1. **Variant Mapping Strategy** (see "Variant Mapping Strategy" section)
   - Is the human-in-the-loop decision point the right approach for Figma variants → Stemma structure?
   - Should the extractor provide more guidance on when to use primitive+semantic vs single component?
   - Are there component family patterns that should inform variant mapping?

2. **Design Outline Quality Checklist** (see "Design Outline Quality Checklist" section)
   - Does the checklist cover everything a component spec needs?
   - Are there Stemma-specific requirements missing (inheritance patterns, behavioral contracts)?
   - Is the confidence flag system (✅ ⚠️ ❌) clear enough for human review?

3. **Behavioral Contract Extraction** (see "DesignExtractor Implementation" section)
   - Can Figma designs capture enough behavioral intent for Stemma contracts?
   - What behavioral information is missing from Figma that requires human input?
   - Should extraction flag missing behavioral contracts explicitly?

4. **Component Structure Extraction** (see "Extraction Process" section)
   - Does the extraction workflow align with Stemma inheritance patterns?
   - Should the extractor identify primitive vs semantic components automatically?
   - Are there component architecture decisions that can't be inferred from Figma?

**Lina's Sign-Off:** [X] Approved with Conditions

**Lina's Feedback:**
```
Approved with conditions. Architecture is solid, but extraction workflow needs more context-awareness.

Required Changes:

1. Variant Mapping Guidance — Extractor must query Component-Family docs and existing components, 
   provide context-aware recommendations (not just "pick one")

2. Stemma-Specific Checklist Items — Add inheritance pattern, behavioral contracts, platform parity 
   requirements, component token needs, accessibility contracts to design-outline template

3. Behavioral Contract Hard Stop — Extraction must explicitly flag missing behavioral contracts and 
   block progression to requirements.md until resolved

4. Component-Family Alignment Check — Extractor must query Component-Family docs and flag misalignment 
   with existing patterns

5. Component Token Governance — Extraction surfaces component token decision points (use primitive vs 
   create component token). Design-outline review (with Ada) defines solution. Figma informs, 
   design-outline defines.

6. Platform Parity Validation — Add platform parity check section to design-outline template, flag 
   platform-specific interactions

7. Confidence Flag Thresholds — Document what triggers ✅ ⚠️ ❌ flags so humans know what action is 
   required

See updated sections below for implementation details.

Date: February 18, 2026
```

---

### Review Sequence

1. **Ada reviews first** — Token representation is foundational
2. **Lina reviews second** — Component extraction depends on token translation
3. **Peter makes final call** — Proceed to formal specs or iterate

---

## Spec Structure

This design outline serves as shared architectural context for two independent specs:

| Spec | Directory | Purpose |
|------|-----------|---------|
| **054a** | `.kiro/specs/054a-figma-token-push/` | Push tokens: Code → Figma (FigmaTransformer + sync) |
| **054b** | `.kiro/specs/054b-figma-design-extract/` | Extract designs: Figma → design-outline.md |

Each spec has its own `requirements.md`, `design.md`, `tasks.md`, and completion docs. This design outline captures the shared architecture, resolved decisions, and Console MCP capabilities that both specs depend on.

**Why split?** Part A (push) and Part B (extract) are genuinely different workflows with different dependencies. Part A extends the existing transformer pipeline. Part B reads FROM Figma and has more complex extraction/translation concerns. Splitting allows Part A to ship independently while Part B's extraction policies are refined.

---

## Executive Summary

This design outline establishes the architecture for integrating DesignerPunk with Figma via the [figma-console-mcp](https://github.com/southleft/figma-console-mcp) server (NPX mode, v1.10.0+). Building on the DTCG foundation from Spec 053, these specs implement the complete Code → Figma → Spec workflow.

**Core Value Proposition:**
- **Push tokens**: DesignerPunk tokens → Figma variables (designers work in DesignerPunk vocabulary)
- **Extract designs**: Figma designs → design-outline.md (validated designs become specs)
- **Preserve code as source of truth**: One-way sync prevents drift and maintains architectural integrity
- **Figma is read-only for tokens**: New tokens are defined through the spec process, not in Figma

**The Workflow This Enables:**
```
Code (Rosetta) 
  → DTCG (spec 053) 
  → Figma Variables (spec 054a - push) 
  → Designer iteration 
  → Validated design 
  → design-outline.md (spec 054b - extract)
  → Spec process (requirements → design → tasks)
  → Implementation 
  → Code (Rosetta)
```

**This is a loop, not a sync.** Each step is explicit and human-reviewed. Code remains the source of truth. Figma surfaces token needs but does not solve for them — token decisions flow through the spec process.

---

## Architecture Overview

### Two-Part Workflow

These specs implement both halves of the Code → Figma → Spec workflow:

**Spec 054a: Push Tokens (Code → Figma)**
```
┌─────────────────────────────────────────────────────────────────┐
│                     Spec 053 Output                             │
│                                                                 │
│                  DesignTokens.dtcg.json                         │
│                           │                                     │
│                           │ (consumed by)                       │
│                           ▼                                     │
│              ┌────────────────────────┐                         │
│              │   FigmaTransformer     │  ← SPEC 054a            │
│              │   (implements          │                         │
│              │    ITokenTransformer)  │                         │
│              └────────────────────────┘                         │
│                           │                                     │
│                           ▼                                     │
│                  DesignTokens.figma.json                        │
│                  (intermediate audit artifact)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ TokenSyncWorkflow
                              │ (uses Console MCP batch APIs)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Figma (Design Tool)                         │
│                                                                 │
│  Dedicated Token Library File                                   │
│  Variables populated from DesignerPunk tokens                   │
│  Figma is READ-ONLY for tokens — overwrite on sync             │
│  Designer creates layouts using DesignerPunk vocabulary         │
└─────────────────────────────────────────────────────────────────┘
```

**Spec 054b: Extract Designs (Figma → Spec)**
```
┌─────────────────────────────────────────────────────────────────┐
│                     Figma (Design Tool)                         │
│                                                                 │
│  Designer marks design as "ready for spec"                      │
│  Component structure, properties, variants defined              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Console MCP (Read) + Translation Layer
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              DesignExtractor (SPEC 054b)                        │
│                                                                 │
│  Reads Figma file structure                                     │
│  Translates values to DesignerPunk tokens                       │
│  Flags no-match values → PAUSES for human review               │
│  Generates design-outline.md                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              Design-Code Parity Check (optional)                │
│              (figma_check_design_parity)                        │
│                                                                 │
│  Compares Figma component specs against code implementation     │
│  Produces scored diff report with actionable fix items          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     design-outline.md                           │
│                                                                 │
│  Human-reviewed design specification                            │
│  Enters spec process (requirements → design → tasks)            │
└─────────────────────────────────────────────────────────────────┘
```

### Output Files

```
dist/
├── DesignTokens.dtcg.json      # From Spec 053
├── DesignTokens.figma.json     # THIS SPEC
├── DesignTokens.web.css        # Existing
├── DesignTokens.ios.swift      # Existing
└── DesignTokens.android.kt     # Existing
```

---

## Design Decision: One-Way Sync (Code → Figma → Spec)

**Options Considered:**
- A) Bidirectional sync (Code ↔ Figma) — automatic sync in both directions
- B) One-way sync (Code → Figma → Spec) — tokens flow from code to Figma, designs flow from Figma to specs
- C) Manual export/import — no automatic sync

**Decision:** Option B — One-way sync with explicit spec handoff

**Rationale:**

### Code Is Source of Truth
DesignerPunk's Rosetta System defines tokens with:
- Mathematical relationships (`base × 2 = 16`)
- Primitive → semantic hierarchy (token governance)
- Platform-specific implementations (True Native architecture)
- Behavioral contracts (stemma tests)

Figma Variables don't preserve these concepts. If Figma becomes the source of truth (bidirectional sync), DesignerPunk's architectural principles get bypassed.

### Prevents Drift
Bidirectional sync creates merge conflicts when code and Figma disagree:
- Designer changes `space.300` to `25px` in Figma
- Developer changes `space.300` to `24px` in code
- **Who wins?** Automatic sync can't resolve this.

One-way sync eliminates this problem: code always wins.

### Preserves Architectural Integrity
Figma changes don't bypass:
- Token governance (Ada's domain)
- Mathematical foundations (Rosetta System)
- Component behavioral contracts (Lina's domain)
- Test validation (Thurgood's domain)

### Explicit Handoff via Specs
Designers iterate in Figma, then validated designs become specs (design-outline.md). Specs are the contract between design and code. This handoff is:
- **Human-reviewed** (not automatic)
- **Explicit** (designer marks design as "ready for spec")
- **Traceable** (spec documents the design decisions)

**Trade-offs:**
- Designers can't "push" token changes from Figma to code (must go through spec process)
- Requires discipline (designers must use pushed tokens, not create new ones in Figma)
- **But:** Eliminates drift, preserves system integrity, maintains code as canonical source

**The Workflow:**
```
Code (Rosetta) 
  → DTCG (spec 053) 
  → Figma Variables (spec 054 - push) 
  → Designer iteration 
  → Validated design 
  → design-outline.md (spec 054 - extract)
  → Spec process (requirements → design → tasks)
  → Implementation 
  → Code (Rosetta)
```

**This is a loop, not a sync.** Each step is explicit and human-reviewed.

**Counter-argument:** Bidirectional sync would be more convenient for designers (they could change tokens in Figma and see them in code immediately). However, convenience doesn't outweigh the risk of drift and loss of architectural integrity. The spec process provides the necessary review and validation.

---

## Figma Power Strategy

### Use BOTH Figma Powers

Based on capability analysis, DesignerPunk uses both Figma integrations for complementary purposes:

| Power | Purpose | Key Capabilities |
|-------|---------|------------------|
| **Existing Figma Power** (Kiro built-in) | Code Connect, design context | `get_design_context`, `add_code_connect_map`, `get_variable_defs` |
| **Console MCP** (southleft, NPX mode) | Variable management, token sync, extraction | 56+ tools including batch variable ops, design-code parity |

### Capability Matrix

| Capability | Existing Figma Power | Console MCP (NPX) |
|------------|---------------------|-------------|
| Read design context | ✅ | ✅ |
| Read variables | ✅ | ✅ (no Enterprise needed via Desktop Bridge) |
| Screenshots | ✅ | ✅ |
| Code Connect mapping | ✅ | ❌ |
| **Create variables** | ❌ | ✅ |
| **Update variables** | ❌ | ✅ |
| **Delete variables** | ❌ | ✅ |
| **Batch variable ops** | ❌ | ✅ (up to 100 per call) |
| **Atomic token setup** | ❌ | ✅ (`figma_setup_design_tokens`) |
| **Design-code parity** | ❌ | ✅ (`figma_check_design_parity`) |
| Design creation | ❌ | ✅ (`figma_execute`) |
| FigJam diagrams | ✅ | ❌ |

---

## FigmaTransformer Implementation

### Transformer Structure

```typescript
// src/generators/transformers/FigmaTransformer.ts

import { ITokenTransformer, TransformResult, TransformerConfig } from './ITokenTransformer';
import { DTCGTokenFile } from '../types/DTCGTypes';

interface FigmaVariable {
  name: string;
  type: 'FLOAT' | 'COLOR' | 'STRING' | 'BOOLEAN';
  valuesByMode: Record<string, any>;
  description?: string;
}

interface FigmaCollection {
  name: string;
  modes: string[];
  variables: FigmaVariable[];
}

interface FigmaTokenFile {
  collections: FigmaCollection[];
}

export class FigmaTransformer implements ITokenTransformer {
  readonly config: TransformerConfig = {
    id: 'figma',
    name: 'Figma Variables',
    outputExtension: '.figma.json',
    includeExtensions: false  // Figma doesn't need DesignerPunk extensions
  };
  
  transform(dtcgTokens: DTCGTokenFile): TransformResult {
    const figmaFile: FigmaTokenFile = {
      collections: [
        this.generatePrimitivesCollection(dtcgTokens),
        this.generateSemanticCollection(dtcgTokens)
      ]
    };
    
    return {
      content: JSON.stringify(figmaFile, null, 2),
      filename: `DesignTokens${this.config.outputExtension}`,
      warnings: this.collectWarnings(dtcgTokens)
    };
  }
  
  canTransform(dtcgTokens: DTCGTokenFile): boolean {
    return true;
  }
  
  private generatePrimitivesCollection(dtcg: DTCGTokenFile): FigmaCollection {
    // Transform primitive tokens to Figma variables
  }
  
  private generateSemanticCollection(dtcg: DTCGTokenFile): FigmaCollection {
    // Transform semantic tokens with alias references
  }
  
  private collectWarnings(dtcg: DTCGTokenFile): string[] {
    // Collect any transformation warnings
  }
}
```

### Figma Output Format

```json
{
  "collections": [
    {
      "name": "DesignerPunk Primitives",
      "modes": ["light", "dark"],
      "variables": [
        {
          "name": "space/100",
          "type": "FLOAT",
          "valuesByMode": {
            "light": 8,
            "dark": 8
          },
          "description": "8px - base × 1"
        },
        {
          "name": "color/purple/300",
          "type": "COLOR",
          "valuesByMode": {
            "light": { "r": 0.69, "g": 0.15, "b": 1, "a": 1 },
            "dark": { "r": 0.69, "g": 0.15, "b": 1, "a": 1 }
          },
          "description": "Primary brand purple"
        }
      ]
    },
    {
      "name": "DesignerPunk Semantic",
      "modes": ["light", "dark"],
      "variables": [
        {
          "name": "color/primary",
          "type": "COLOR",
          "valuesByMode": {
            "light": { "aliasOf": "color/purple/300" },
            "dark": { "aliasOf": "color/purple/300" }
          },
          "description": "Primary brand color"
        }
      ]
    }
  ]
}
```

### DTCG to Figma Type Mapping

| DTCG Type | Figma Type | Transformation |
|-----------|------------|----------------|
| `dimension` | `FLOAT` | Strip unit, keep number |
| `color` | `COLOR` | Convert hex to RGBA object |
| `fontFamily` | `STRING` | Direct mapping |
| `fontWeight` | `FLOAT` | Direct mapping |
| `number` | `FLOAT` | Direct mapping |
| `duration` | `FLOAT` | Convert to milliseconds |
| `cubicBezier` | N/A | Not supported in Figma variables |
| `shadow` (composite) | Effect Style | Create via `figma.createEffectStyle()` (Plugin API) |
| `typography` (composite) | Text Style | Create via `figma.createTextStyle()` (Plugin API) |

**Note**: Figma Variables API doesn't support composite types. Composite tokens are pushed as Figma styles (effect styles for shadows, text styles for typography) via `figma_execute` calling Plugin API methods.

---

### Mode Mapping Strategy

Figma modes are typically used for themes (light/dark), not platforms. DesignerPunk has platform-specific tokens (web/iOS/Android) with build-time separation.

**Current Mapping (Phase 1):**

All tokens are pushed to both `light` and `dark` modes with **identical values**:

```json
{
  "name": "space/100",
  "type": "FLOAT",
  "valuesByMode": {
    "light": 8,
    "dark": 8
  }
}
```

**Rationale:**
- DesignerPunk tokens are currently platform-specific, not theme-specific
- Platform separation happens at build time (web/iOS/Android outputs)
- Figma modes provide structure for future theme support without requiring changes now
- Designers see consistent token values regardless of mode

**Future Consideration (Post-Phase 1):**

If DesignerPunk adds theme-aware tokens (e.g., `color.background.primary` with different values for light/dark):
- Map theme variants to Figma modes
- `light` mode gets light theme values
- `dark` mode gets dark theme values
- Platform-specific tokens remain identical across modes

**Platform Separation:**

Platform-specific tokens (web/iOS/Android) are pushed to the **same Figma file** with the same mode values. Platform separation is documented in token descriptions:

```json
{
  "name": "space/100",
  "description": "8px - base × 1 (web: 8px, iOS: 8pt, Android: 8dp)"
}
```

Designers work with unitless values. Platform-specific units are applied during code generation (web CSS, iOS Swift, Android Kotlin).

---

## Design Extraction Workflow (Spec 054b)

### Design Outline Quality Checklist

Every design-outline.md generated from Figma extraction must address these areas. The format is flexible to accommodate different component types, but coverage is mandatory.

**Required Coverage:**

| Area | What to Document | Extraction Confidence |
|------|------------------|----------------------|
| **Component Purpose** | What problem does this component solve? When should it be used? | Human review required |
| **Variants** | What variants exist? How do they differ behaviorally (not just visually)? | AI-extracted, human validates |
| **States** | Rest, hover, focus, active, disabled, error, loading — which states exist? | AI-extracted from layers, human validates completeness |
| **Token Usage** | Which tokens are used? (spacing, color, typography, radius, shadows) | AI-extracted via TokenTranslator |
| **Accessibility** | Keyboard navigation, screen reader support, ARIA attributes, focus management | Human review required |
| **Platform Behaviors** | Any platform-specific behaviors (web vs iOS vs Android)? | Human review required |
| **Edge Cases** | Empty states, overflow, error states, loading states | Human review required |
| **Extraction Confidence** | What's certain (exact token matches) vs what needs review (approximate matches, no-matches, ambiguous structure)? | AI-generated flags |
| **Inheritance Pattern** | Is this primitive, semantic, or standalone? Does it extend an existing component? | AI-extracted with Component-Family context, human validates |
| **Behavioral Contracts** | What interaction states must be tested? What's the contract between this component and its consumers? | ❌ Cannot be inferred from Figma — human input required |
| **Platform Parity Requirements** | Are all platforms expected to implement this identically, or are there platform-specific behaviors? | AI-extracted from Figma interactions, human validates cross-platform implications |
| **Component Token Needs** | Does this component need component-specific tokens, or can it use primitives/semantics? | AI surfaces decision points, human + Ada define solution during design-outline review |
| **Accessibility Contracts** | ARIA role, focus order, screen reader announcements, keyboard shortcuts | ❌ Cannot be inferred from Figma — human input required |

**Confidence Flag Thresholds:**

| Flag | Meaning | Trigger | Action Required |
|------|---------|---------|-----------------|
| ✅ High Confidence | Exact token match, no ambiguity | Figma value exactly matches DesignerPunk token | Review for semantic correctness |
| ⚠️ Needs Review | Approximate match or ambiguous structure | Figma value within tolerance of token, OR multiple tokens match, OR Figma structure unclear | Human validates match is appropriate |
| ❌ Requires Human Input | No match or missing information | No token within tolerance, OR behavioral contract missing, OR platform parity unclear | Human must provide missing information before proceeding |

**Confidence Flag Examples:**

```markdown
## Token Usage

**Spacing** (✅ High Confidence):
- Padding: `space.inset.spacious` (exact match)
- Gap: `space.300` (exact match)

**Colors** (⚠️ Needs Review):
- Background: `purple.300` (exact match) → Semantic: `color.primary`
- Border: `#A020E0` (⚠️ approximate match: `purple.400`, delta: ΔE = 2.1)

**Typography** (❌ Requires Human Input):
- Heading: Decomposed from text style "Heading 2"
  - Font: Inter (matches `fontFamily.primary`)
  - Size: 24px (matches `fontSize.300`)
  - Weight: 600 (matches `fontWeight.semibold`)
  - Line Height: 32px (matches `lineHeight.300`)
  - ❓ Does this map to existing `typography.heading200` or need new composite token?

## Component Token Decision Points (⚠️ Needs Ada Review)

**Spacing:**
- Padding: `space.300` (primitive token)
  - ⚠️ Consider component token: `button.padding.medium = space.300`
  - Rationale: Component-specific semantic meaning, easier to adjust all button padding in one place
  - Decision: [Human + Ada decide during design-outline review]

## Behavioral Contracts (❌ Requires Human Input)

**Extracted from Figma:**
- Visual states: Default, Hover, Focus, Disabled, Error
- Variants: Primary, Secondary, Tertiary
- Size variants: Small, Medium, Large

**Missing (Cannot be inferred from Figma):**
- ❌ Click interaction: What happens on click? Async operation? Immediate action?
- ❌ Focus management: Where does focus go after interaction?
- ❌ Keyboard navigation: Enter/Space behavior? Escape behavior?
- ❌ Screen reader: What's announced on focus? On interaction? On state change?
- ❌ Error handling: How are errors surfaced? Can user recover?
- ❌ Loading state: Does this component have async operations? What shows during load?

**Action Required:**
Human must define behavioral contracts before this design-outline can proceed to requirements.md.

## Platform Parity Check (⚠️ Needs Review)

**Extracted Interactions:**
- Hover state (web-specific)
- Focus state (all platforms)
- Disabled state (all platforms)

**Platform Parity Concerns:**
- ⚠️ Hover state: No mobile equivalent. Recommend:
  - [ ] Omit hover on mobile (document as web-only)
  - [ ] Map to press state on mobile
  - [ ] Other approach? (describe)

**Action Required:** Human decision on platform-specific behaviors

## Accessibility Contracts (❌ Requires Human Input)

**Extracted from Figma:**
- Component type: Button
- Text labels: Present
- Visual focus indicator: Present

**Missing (Cannot be inferred from Figma):**
- ❌ ARIA role: [role]
- ❌ Focus management: [how focus moves through component]
- ❌ Screen reader announcements: [what's announced and when]
- ❌ Keyboard shortcuts: [any component-specific shortcuts]

**Action Required:** Human must define accessibility contracts before proceeding to requirements.md.
```

**Success Criteria:**

A design-outline is ready for the spec process when:
- All required areas are documented (even if marked "needs review")
- All extraction confidence flags are resolved by human review
- All no-match values have human decisions (map to token, document as off-system, or request new token)
- Variant mapping to DesignerPunk component structure is decided
- **Behavioral contracts are defined** (hard stop — cannot proceed without this)
- **Accessibility contracts are defined** (hard stop — cannot proceed without this)
- Component token decisions are made (with Ada review)
- Platform parity concerns are resolved

---

### Composite Token Reconstruction Strategy

Figma Variables API doesn't support composite types (shadow, typography), but Figma *styles* do (via Plugin API). The push and extraction workflows leverage this.

**Push Phase (054a): Styles First, Variables as Fallback**

When pushing composite tokens to Figma:

1. **Shadow tokens** → Create Figma Effect Styles via `figma_execute` calling `figma.createEffectStyle()`
   - Style name: `shadow.elevation200`
   - Effect properties: x, y, blur, spread, color from token definition
   - Designers apply styles directly to components

2. **Typography tokens** → Create Figma Text Styles via `figma_execute` calling `figma.createTextStyle()`
   - Style name: `typography.heading200`
   - Text properties: fontFamily, fontSize, fontWeight, lineHeight from token definition
   - Designers apply styles directly to text layers

3. **Fallback to decomposed variables** (if style creation isn't appropriate):
   - Create individual variables: `shadow/elevation200/x`, `shadow/elevation200/y`, etc.
   - Group by naming convention
   - Document in variable descriptions: "Part of shadow.elevation200 composite token"

**Why styles first?**
- Designers apply styles by name (semantic, discoverable)
- Extraction can match style names directly to composite tokens
- Cleaner than reconstructing from decomposed variables
- Aligns with how designers already work in Figma

**Extract Phase (054b): Style Matching First**

When extracting designs from Figma:

1. **Read Figma styles** via `figma_get_styles` (effect styles for shadows, text styles for typography)
2. **Match style names** to DesignerPunk composite tokens
3. **If no style match**, check if decomposed variables exist and reconstruct
4. **If no match** → flag for human review with decomposed properties

**Example: Shadow Extraction**

Figma component has effect style `shadow.elevation200` applied:

```json
{
  "effectStyleId": "S:abc123",
  "effectStyleName": "shadow.elevation200"
}
```

TokenTranslator checks:
1. Does style name match a DesignerPunk composite token? → Yes (`shadow.elevation200`)
2. Return: `"shadow": "shadow.elevation200"` (✅ High Confidence)

If no style applied, but effect properties exist:
```json
{
  "effects": [{
    "type": "DROP_SHADOW",
    "offset": { "x": 0, "y": 4 },
    "radius": 8,
    "color": { "r": 0, "g": 0, "b": 0, "a": 0.1 }
  }]
}
```

TokenTranslator checks:
1. Do these properties match a DesignerPunk composite token? → Check `shadow.elevation200`
2. If exact match → Return: `"shadow": "shadow.elevation200"` (⚠️ Needs Review - no style applied)
3. If no match → Decompose and flag

If no match:
```markdown
**Shadow** (❌ Requires Human Input):
- Decomposed from inline effect (no style applied)
  - X: 0 (matches `shadow.x.none`)
  - Y: 4px (matches `space.050`)
  - Blur: 8px (matches `space.100`)
  - Color: rgba(0,0,0,0.1) (matches `color.shadow.default`)
  - ❓ Does this map to existing shadow token or need new composite?
  - ⚠️ Recommend applying `shadow.elevation200` style in Figma for consistency
```

**Ada's Role:**

When extraction flags a decomposed composite for review, Ada validates:
- Does an existing composite token match these properties?
- Should a new composite token be created?
- Is this an intentional off-system value?
- Should the designer apply a Figma style instead of using inline values?

This is why extraction outputs to design-outline (human-reviewed spec) rather than directly to code.

**Implementation Note:**

Figma Plugin API supports style creation (`figma.createEffectStyle()`, `figma.createTextStyle()`), but Console MCP doesn't expose dedicated style creation tools. Use `figma_execute` to run Plugin API code for style creation during token push.

---

### Variant Mapping Strategy

Figma components use a flat variant system (properties with values). DesignerPunk components use inheritance (primitive → semantic). Extraction must bridge this gap.

**Figma Variant Structure:**

```json
{
  "componentName": "Button",
  "variantProperties": {
    "Variant": ["Primary", "Secondary", "Tertiary"],
    "Size": ["Small", "Medium", "Large"],
    "State": ["Default", "Hover", "Disabled"]
  }
}
```

**DesignerPunk Component Structure (Possible Mappings):**

**Option A: Single Component with Variants**
- `Button` component with `variant` prop (primary|secondary|tertiary) and `size` prop (small|medium|large)

**Option B: Primitive + Semantic Components**
- `ButtonBase` (primitive) handles size and states
- `ButtonCTA` (semantic, maps to Figma "Primary")
- `ButtonSecondary` (semantic, maps to Figma "Secondary")
- `ButtonTertiary` (semantic, maps to Figma "Tertiary")

**Extraction Behavior:**

The extractor reads Figma variant properties, queries Component-Family docs and existing components, then generates a "Variants" section with context-aware recommendations:

```markdown
## Variants

**Figma Variant Properties:**
- Variant: Primary | Secondary | Tertiary
- Size: Small | Medium | Large
- State: Default | Hover | Disabled

**Component-Family Context:**

Component-Family Doc: Component-Family-Button.md (✅ found)
- Family Pattern: Primitive (`ButtonBase`) + Semantic (`ButtonCTA`, `ButtonSecondary`, `ButtonTertiary`)
- Rationale: Semantic components encode intent (CTA vs secondary action), primitive handles shared behavior

Existing Components:
- ❌ ButtonBase: Not found
- ❌ ButtonCTA: Not found
- ❌ Button: Not found

**Behavioral Analysis:**
- All variants share: click interaction, disabled state, focus management
- Variants differ: visual styling only (color, border)
- Size variants: affect dimensions and padding, not behavior

**DesignerPunk Component Mapping** (❓ Requires Human Decision):

Recommendation (⚠️ Requires Human Approval):
- [ ] **Option A: Single component** (`Button`) with `variant` and `size` props
  - Rationale: Variants differ only in styling, not behavior
  - Aligns with: Semantic token usage (variant maps to semantic color tokens)
  - Trade-off: Less explicit semantic meaning in component names
  
- [X] **Option B: Primitive + semantic structure** (matches Component-Family-Button.md)
  - Rationale: Semantic components encode design intent (CTA vs secondary action)
  - Aligns with: Component-Family-Button.md pattern
  - Trade-off: More components to maintain, but clearer semantic meaning
  - Implementation: Create `ButtonBase` (primitive) + `ButtonCTA`/`ButtonSecondary`/`ButtonTertiary` (semantic)

- [ ] **Option C: Other structure** (describe)
  - Rationale: [Human fills in if chosen]

**Alignment Check:**
- ✅ Figma structure (flat variants) can map to either Option A or Option B
- ⚠️ If Option B chosen, recommend restructuring Figma component to separate components for easier extraction in future
- ⚠️ No existing components found — this will establish the pattern for Button family

**Action Required:**
Human decision on component structure before proceeding to requirements.md.
```

**Context-Aware Guidance:**

The extractor provides recommendations based on:

1. **Component-Family Doc** — Does a family doc exist? What pattern does it define?
2. **Existing Components** — Are there existing components this could extend?
3. **Behavioral Analysis** — Do variants differ in behavior or just styling?
4. **Alignment Check** — Does Figma structure align with family pattern?

**If No Component-Family Doc Exists:**

```markdown
## Variants

**Figma Variant Properties:**
- Variant: Primary | Secondary | Tertiary
- Size: Small | Medium | Large

**Component-Family Context:**

Component-Family Doc: ⚠️ No Component-Family-Button.md found

**Action Required:**
Before proceeding with variant mapping, recommend creating Component-Family-Button.md to establish:
- Inheritance pattern (primitive + semantic vs single component)
- Behavioral contracts
- Token usage patterns
- Platform parity requirements

Use Component-MCP-Document-Template.md as starting point.

**Temporary Recommendation:**
Cannot provide informed variant mapping recommendation without Component-Family context.
Human must decide whether to:
1. Create Component-Family-Button.md first (recommended)
2. Proceed with ad-hoc decision (document rationale for future family doc)
```

**Human Decision Point:**

During design-outline review, the human (with Ada/Lina/Thurgood support) decides:
1. How Figma variants map to DesignerPunk component structure
2. Whether this follows existing component family patterns
3. Whether new component tokens are needed
4. Whether Component-Family doc needs creation or update

**This is a per-component decision.** Some Figma components map 1:1 to DesignerPunk components, others map 1:N. The extraction workflow surfaces the decision point with context but doesn't auto-resolve it.

---

### Semantic Token Translation Priority

Figma Variables organize primitive and semantic tokens at the same level (both are variables in collections). DesignerPunk distinguishes them architecturally (primitive → semantic hierarchy).

**Translation Priority:**

When TokenTranslator finds a value that matches multiple tokens:

1. **Check semantic tokens first** — e.g., `color.primary`, `space.inset.spacious`
2. **Check primitive tokens second** — e.g., `purple.300`, `space.300`
3. **Return both in enriched response** — for traceability

**Example:**

Figma design uses `#B026FF` (purple). This matches:
- Primitive: `purple.300`
- Semantic: `color.primary` (which aliases `purple.300`)

**Enriched Response:**
```json
{
  "backgroundColor": {
    "raw": "#B026FF",
    "primitive": "purple.300",
    "semantic": "color.primary"
  }
}
```

**Design-Outline Preference:**

The generated design-outline.md should reference **semantic tokens** when available:

```markdown
## Token Usage

**Colors:**
- Background: `color.primary` (semantic, resolves to `purple.300`)
- Text: `color.contrast.onPrimary` (semantic, resolves to `white`)
```

**Rationale:** Semantic tokens encode design intent. `color.primary` communicates "this is the primary brand color" better than `purple.300` (which is just a value). This aligns with DesignerPunk's token-first principle.

**Traceability:** The enriched response includes both primitive and semantic for debugging and validation. If a designer questions why `color.primary` was chosen, the primitive reference (`purple.300`) provides the audit trail.

---

### Bootstrapping Scenario Guidance

**Problem:** If a designer creates a Figma component *before* DesignerPunk tokens are pushed, extraction will find no-match values everywhere.

**Symptoms:**
- Extraction reports widespread no-match values (>50% of properties)
- TokenTranslator returns "no matching token found" for most spacing/color/typography values
- Design-outline is mostly flagged as "requires human input"

**Diagnosis:**

This indicates the design was created before tokens were pushed to Figma. The designer was working with raw values (24px, #B026FF) instead of DesignerPunk variables.

**Resolution:**

1. **Push tokens first** — Run `npm run figma:push` to sync DesignerPunk tokens to Figma
2. **Designer updates design** — Designer replaces raw values with DesignerPunk variables
3. **Re-extract** — Run `npm run figma:extract` again

**Prevention:**

The workflow is **Code → Figma → Spec**. Tokens should be pushed to Figma *before* designers iterate on new components. If a component needs new tokens:

1. Designer identifies token need (e.g., "I need a 20px spacing value")
2. Token request enters spec process (design-outline → requirements → design → tasks)
3. Token is implemented in code (Rosetta)
4. Token is pushed to Figma
5. Designer uses new token in Figma design
6. Design is extracted to design-outline

**This is a loop, not a shortcut.** Figma doesn't create tokens — it surfaces token needs.

---

### DesignExtractor Implementation

```typescript
// src/figma/DesignExtractor.ts

interface DesignOutline {
  componentName: string;
  description: string;
  variants: VariantDefinition[];
  states: StateDefinition[];
  properties: PropertyDefinition[];
  tokens: TokenUsage;
  platformNotes?: PlatformNotes;
  inheritancePattern?: InheritancePattern;
  componentFamilyContext?: ComponentFamilyContext;
  behavioralContracts?: BehavioralContracts;
  accessibilityContracts?: AccessibilityContracts;
}

interface VariantDefinition {
  name: string;
  description: string;
  properties: Record<string, any>;
  behavioralDifferences?: string[];
}

interface InheritancePattern {
  type: 'primitive' | 'semantic' | 'standalone' | 'unknown';
  extendsComponent?: string;
  familyDocExists: boolean;
  familyPattern?: string;
}

interface ComponentFamilyContext {
  familyDocPath?: string;
  familyPattern?: string;
  existingComponents: string[];
  alignmentCheck: AlignmentCheck;
}

interface AlignmentCheck {
  aligned: boolean;
  concerns: string[];
  recommendations: string[];
}

interface BehavioralContracts {
  extractedFromFigma: string[];
  missingFromFigma: string[];
  requiresHumanInput: boolean;
}

interface AccessibilityContracts {
  extractedFromFigma: string[];
  missingFromFigma: string[];
  requiresHumanInput: boolean;
}

interface TokenUsage {
  spacing: TokenReference[];
  colors: TokenReference[];
  typography: TokenReference[];
  radius: TokenReference[];
  shadows: TokenReference[];
  componentTokenDecisionPoints: ComponentTokenDecisionPoint[];
}

interface TokenReference {
  property: string;
  token: string;
  confidence: 'exact' | 'approximate' | 'no-match';
  primitive?: string;
  semantic?: string;
  delta?: string;
}

interface ComponentTokenDecisionPoint {
  property: string;
  currentToken: string;
  proposedComponentToken?: string;
  rationale: string;
  requiresAdaReview: boolean;
}

class DesignExtractor {
  constructor(
    private consoleMcp: ConsoleMCPClient,
    private translator: TokenTranslator,
    private mcpDocs: MCPDocumentationClient
  ) {}
  
  async extractDesign(
    figmaFileKey: string,
    componentNodeId: string
  ): Promise<DesignOutline> {
    // 1. Read Figma component structure
    const component = await this.consoleMcp.getNode(figmaFileKey, componentNodeId);
    
    // 2. Query Component-Family context (NEW)
    const familyContext = await this.queryComponentFamilyContext(component.name);
    
    // 3. Query existing components (NEW)
    const existingComponents = await this.queryExistingComponents(component.name);
    
    // 4. Extract variants and properties
    const variants = this.extractVariants(component);
    const states = this.extractStates(component);
    const properties = this.extractProperties(component);
    
    // 5. Analyze behavioral differences (NEW)
    const behavioralAnalysis = this.analyzeBehavioralDifferences(variants, states);
    
    // 6. Translate values to tokens
    const tokens = this.extractTokenUsage(component);
    
    // 7. Identify component token decision points (NEW)
    const componentTokenDecisions = this.identifyComponentTokenDecisionPoints(tokens, familyContext);
    
    // 8. Infer inheritance pattern (NEW)
    const inheritancePattern = this.inferInheritancePattern(
      component,
      familyContext,
      existingComponents,
      behavioralAnalysis
    );
    
    // 9. Flag missing behavioral contracts (NEW)
    const behavioralContracts = this.flagMissingBehavioralContracts(component, states);
    
    // 10. Flag missing accessibility contracts (NEW)
    const accessibilityContracts = this.flagMissingAccessibilityContracts(component);
    
    // 11. Check platform parity (NEW)
    const platformNotes = this.checkPlatformParity(component, states);
    
    // 12. Generate design outline
    return {
      componentName: component.name,
      description: component.description || '',
      variants,
      states,
      properties,
      tokens: {
        ...tokens,
        componentTokenDecisionPoints: componentTokenDecisions
      },
      platformNotes,
      inheritancePattern,
      componentFamilyContext: familyContext,
      behavioralContracts,
      accessibilityContracts
    };
  }
  
  async generateDesignOutlineMarkdown(outline: DesignOutline): Promise<string> {
    // Generate design-outline.md format from extracted design
    // Include all new sections: inheritance pattern, behavioral contracts, accessibility contracts, etc.
    return `# ${outline.componentName} - Design Outline

**Date**: ${new Date().toISOString().split('T')[0]}
**Purpose**: Component specification extracted from Figma
**Status**: Design Outline (Requires Review)

---

## Component Overview

${outline.description}

---

## Component-Family Context

${this.formatComponentFamilyContext(outline.componentFamilyContext)}

---

## Inheritance Pattern

${this.formatInheritancePattern(outline.inheritancePattern)}

---

## Variants

${this.formatVariantsWithContext(outline.variants, outline.componentFamilyContext)}

---

## States

${outline.states.map(s => `### ${s.name}\n${s.description}`).join('\n\n')}

---

## Token Usage

${this.formatTokenUsage(outline.tokens)}

---

## Component Token Decision Points

${this.formatComponentTokenDecisionPoints(outline.tokens.componentTokenDecisionPoints)}

---

## Behavioral Contracts

${this.formatBehavioralContracts(outline.behavioralContracts)}

---

## Accessibility Contracts

${this.formatAccessibilityContracts(outline.accessibilityContracts)}

---

## Platform Parity Check

${this.formatPlatformParity(outline.platformNotes)}
`;
  }
  
  private async queryComponentFamilyContext(componentName: string): Promise<ComponentFamilyContext> {
    // Query MCP for Component-Family doc
    const familyName = this.inferFamilyName(componentName); // e.g., "Button" from "ButtonCTA"
    const familyDocPath = `.kiro/steering/Component-Family-${familyName}.md`;
    
    try {
      const familyDoc = await this.mcpDocs.getDocumentSummary(familyDocPath);
      // Parse family pattern from doc
      const familyPattern = this.parseFamilyPattern(familyDoc);
      
      return {
        familyDocPath,
        familyPattern,
        existingComponents: await this.queryExistingComponents(familyName),
        alignmentCheck: { aligned: true, concerns: [], recommendations: [] } // Populated later
      };
    } catch (error) {
      // No family doc found
      return {
        existingComponents: [],
        alignmentCheck: {
          aligned: false,
          concerns: ['No Component-Family doc found'],
          recommendations: ['Create Component-Family doc before proceeding']
        }
      };
    }
  }
  
  private async queryExistingComponents(familyName: string): Promise<string[]> {
    // Search codebase for existing components in this family
    // e.g., ButtonBase, ButtonCTA, Button, etc.
  }
  
  private analyzeBehavioralDifferences(
    variants: VariantDefinition[],
    states: StateDefinition[]
  ): BehavioralAnalysis {
    // Analyze whether variants differ in behavior or just styling
    // Check if all variants share the same states
  }
  
  private identifyComponentTokenDecisionPoints(
    tokens: TokenUsage,
    familyContext: ComponentFamilyContext
  ): ComponentTokenDecisionPoint[] {
    // Identify cases where a component token might be appropriate
    // e.g., using space.300 for padding → consider button.padding.medium
  }
  
  private inferInheritancePattern(
    component: FigmaComponent,
    familyContext: ComponentFamilyContext,
    existingComponents: string[],
    behavioralAnalysis: BehavioralAnalysis
  ): InheritancePattern {
    // Infer whether this should be primitive, semantic, or standalone
    // Based on family pattern and behavioral analysis
  }
  
  private flagMissingBehavioralContracts(
    component: FigmaComponent,
    states: StateDefinition[]
  ): BehavioralContracts {
    // Flag behavioral information that cannot be inferred from Figma
    return {
      extractedFromFigma: [
        `Visual states: ${states.map(s => s.name).join(', ')}`,
        'Component structure and layers'
      ],
      missingFromFigma: [
        'Click interaction: What happens on click?',
        'Focus management: Where does focus go after interaction?',
        'Keyboard navigation: Enter/Space behavior? Escape behavior?',
        'Screen reader: What\'s announced on focus? On interaction?',
        'Error handling: How are errors surfaced?',
        'Loading state: What shows during async operations?'
      ],
      requiresHumanInput: true
    };
  }
  
  private flagMissingAccessibilityContracts(
    component: FigmaComponent
  ): AccessibilityContracts {
    // Flag accessibility information that cannot be inferred from Figma
    return {
      extractedFromFigma: [
        `Component type: ${component.type}`,
        'Visual focus indicator: Present/Absent',
        'Text labels: Present/Absent'
      ],
      missingFromFigma: [
        'ARIA role',
        'Focus management strategy',
        'Screen reader announcements',
        'Keyboard shortcuts'
      ],
      requiresHumanInput: true
    };
  }
  
  private checkPlatformParity(
    component: FigmaComponent,
    states: StateDefinition[]
  ): PlatformNotes {
    // Check for platform-specific interactions (e.g., hover on web only)
    // Flag concerns and recommendations
  }
  
  private extractVariants(component: FigmaComponent): VariantDefinition[] {
    // Extract variant definitions from Figma component
  }
  
  private extractStates(component: FigmaComponent): StateDefinition[] {
    // Extract state definitions (hover, focus, disabled, etc.)
  }
  
  private extractProperties(component: FigmaComponent): PropertyDefinition[] {
    // Extract component properties (size, variant, etc.)
  }
  
  private extractTokenUsage(component: FigmaComponent): TokenUsage {
    // Use TokenTranslator to identify which tokens are used
  }
  
  private formatComponentFamilyContext(context?: ComponentFamilyContext): string {
    // Format Component-Family context for markdown output
  }
  
  private formatInheritancePattern(pattern?: InheritancePattern): string {
    // Format inheritance pattern for markdown output
  }
  
  private formatVariantsWithContext(
    variants: VariantDefinition[],
    context?: ComponentFamilyContext
  ): string {
    // Format variants with Component-Family context and recommendations
  }
  
  private formatTokenUsage(tokens: TokenUsage): string {
    // Format token usage with confidence flags
  }
  
  private formatComponentTokenDecisionPoints(
    decisionPoints: ComponentTokenDecisionPoint[]
  ): string {
    // Format component token decision points for human + Ada review
  }
  
  private formatBehavioralContracts(contracts?: BehavioralContracts): string {
    // Format behavioral contracts with hard stop if missing
  }
  
  private formatAccessibilityContracts(contracts?: AccessibilityContracts): string {
    // Format accessibility contracts with hard stop if missing
  }
  
  private formatPlatformParity(notes?: PlatformNotes): string {
    // Format platform parity check with concerns and recommendations
  }
}
```

### Extraction Process

1. **Designer marks design as ready**
   - Figma component is complete
   - All variants and states defined
   - Uses DesignerPunk tokens (pushed from code)

2. **Run extraction command**
   ```bash
   npm run figma:extract -- --file <file-key> --node <node-id> --output <path>
   ```

3. **Extraction workflow** (with Component-Family context)
   
   **Step 1: Read Figma structure**
   - Component metadata, variants, properties, states
   - Layer structure, token usage, visual properties
   
   **Step 2: Query Component-Family context**
   - Does a Component-Family doc exist for this component type?
   - What inheritance pattern does the family use?
   - What existing components are in this family?
   
   **Step 3: Analyze behavioral differences**
   - Do variants differ in behavior or just styling?
   - What interaction states exist?
   - What platform-specific behaviors are present?
   
   **Step 4: Translate values to tokens**
   - Use TokenTranslator to match Figma values to DesignerPunk tokens
   - Flag exact matches (✅), approximate matches (⚠️), and no-matches (❌)
   - Identify component token decision points
   
   **Step 5: Check Component-Family alignment**
   - Does Figma structure align with family pattern?
   - Are there existing components this could extend?
   - What are the alignment concerns and recommendations?
   
   **Step 6: Flag missing contracts**
   - Behavioral contracts (interaction sequences, focus management, keyboard navigation)
   - Accessibility contracts (ARIA roles, screen reader announcements, keyboard shortcuts)
   - Platform parity concerns (web-specific interactions, mobile equivalents)
   
   **Step 7: Generate design-outline.md**
   - Include all extracted data with confidence flags
   - Include Component-Family context and alignment check
   - Include missing contract flags (hard stops)
   - Include component token decision points
   - Include platform parity concerns

4. **Review generated design-outline.md**
   - Human reviews extracted design
   - Validates token usage
   - Defines missing behavioral contracts (hard stop — cannot proceed without this)
   - Defines missing accessibility contracts (hard stop — cannot proceed without this)
   - Resolves component token decision points (with Ada)
   - Resolves platform parity concerns
   - Validates Component-Family alignment
   - Adds missing context or rationale
   - Corrects any extraction errors

5. **Enter spec process**
   - design-outline.md → requirements.md
   - requirements.md → design.md
   - design.md → tasks.md
   - tasks.md → implementation

### Extraction Validation

Before generating design-outline.md, validate:

```typescript
interface ExtractionValidation {
  allTokensRecognized: boolean;
  offSystemValues: OffSystemValue[];
  missingVariants: string[];
  missingStates: string[];
  missingBehavioralContracts: boolean;  // NEW: Hard stop if true
  missingAccessibilityContracts: boolean;  // NEW: Hard stop if true
  componentFamilyAlignmentConcerns: string[];  // NEW
  componentTokenDecisionPoints: ComponentTokenDecisionPoint[];  // NEW
  platformParityConcerns: string[];  // NEW
  warnings: string[];
}

interface OffSystemValue {
  property: string;
  value: any;
  closestSuggestion: string;
  confidence: 'approximate' | 'no-match';
  delta?: string;
}
```

**No-Match Behavior (CRITICAL — Human-in-the-Loop):**

When the translation layer encounters a value with no token match:

1. **Flag and PAUSE** — Stop extraction, do not proceed automatically
2. **Report to human** — Show the off-system value with closest suggestion
3. **Wait for human decision** — Human reviews (possibly with AI agent support) and decides:
   - Map to suggested token (accept closest match)
   - Define as intentional off-system value (document in design-outline)
   - Request new token creation (enters spec process)
4. **Execute on feedback** — Resume extraction with human's decision applied

This pause is explicit and non-negotiable. AI agents must not auto-resolve no-match values.

**Hard Stop Behavior (NEW — Behavioral and Accessibility Contracts):**

When extraction detects missing behavioral or accessibility contracts:

1. **Flag as hard stop** — Mark design-outline as "Cannot proceed to requirements.md"
2. **List missing contracts** — Show exactly what information is missing
3. **Require human input** — Human must define contracts before design-outline is ready for spec process

**Example hard stop output:**

```markdown
## Extraction Validation

**Status**: ❌ Cannot proceed to requirements.md

**Hard Stops:**
- ❌ Behavioral contracts missing (see Behavioral Contracts section)
- ❌ Accessibility contracts missing (see Accessibility Contracts section)

**Action Required:**
Human must define behavioral and accessibility contracts before this design-outline can enter the spec process.
```

**Best-Effort Extraction with Flags:**

For ambiguous or incomplete Figma structures (missing variants, inconsistent naming, incomplete descriptions):
- Extract what's possible
- Flag issues clearly in the generated design-outline.md
- Mark sections as "AI-extracted" vs "requires human input"
- Do not fail the entire extraction for non-critical issues

**If validation fails:**
- Report off-system values with closest suggestions and deltas
- Warn about missing variants or states
- Flag hard stops (behavioral/accessibility contracts)
- Flag Component-Family alignment concerns
- Flag component token decision points
- Flag platform parity concerns
- Require human review before the design-outline enters the spec process

---

## Token Sync Workflow (Spec 054a)

### Sync Strategy

- **On-demand only** — Manual trigger via CLI or AI agent
- **Figma is read-only for tokens** — Full overwrite on sync, no Figma-originated token changes preserved
- **Drift detection before push** — Detect and block if Figma variables have been edited directly
- **Batch operations** — Use `figma_batch_create_variables` and `figma_batch_update_variables` for performance (up to 100 per call)
- **Atomic initial setup** — Use `figma_setup_design_tokens` for first-time collection creation

### Sync Process

```typescript
// src/figma/TokenSyncWorkflow.ts

interface SyncResult {
  success: boolean;
  created: number;
  updated: number;
  deleted: number;
  errors: SyncError[];
  driftDetected?: DriftReport;
}

interface DriftReport {
  driftedVariables: DriftedVariable[];
  message: string;
}

interface DriftedVariable {
  name: string;
  expectedValue: any;
  actualValue: any;
}

interface SyncError {
  token: string;
  operation: 'create' | 'update' | 'delete';
  message: string;
}

class TokenSyncWorkflow {
  constructor(
    private consoleMcp: ConsoleMCPClient,
    private figmaFileKey: string
  ) {}
  
  async sync(figmaTokens: FigmaTokenFile, options?: { forceOverride?: boolean }): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      created: 0,
      updated: 0,
      deleted: 0,
      errors: []
    };
    
    try {
      // 1. Get current Figma state
      const currentVariables = await this.consoleMcp.getVariables(this.figmaFileKey);
      
      // 2. Detect drift (block if found, unless force override)
      const drift = this.detectDrift(currentVariables, figmaTokens);
      if (drift.driftedVariables.length > 0 && !options?.forceOverride) {
        result.success = false;
        result.driftDetected = drift;
        return result; // BLOCK — require human review
      }
      
      // 3. Calculate diff
      const diff = this.calculateDiff(currentVariables, figmaTokens);
      
      // 4. Apply changes using batch APIs
      if (diff.toCreate.length > 0) {
        await this.batchCreate(diff.toCreate, result);
      }
      if (diff.toUpdate.length > 0) {
        await this.batchUpdate(diff.toUpdate, result);
      }
      for (const variable of diff.toDelete) {
        await this.deleteVariable(variable, result);
      }
      
    } catch (error) {
      result.success = false;
      result.errors.push({
        token: 'sync',
        operation: 'create',
        message: error.message
      });
    }
    
    return result;
  }
  
  /**
   * Initial setup — creates collection, modes, and all variables atomically.
   * Use for first-time sync to a new Figma file.
   */
  async initialSetup(figmaTokens: FigmaTokenFile): Promise<SyncResult> {
    // Uses figma_setup_design_tokens for atomic creation
  }
  
  private async batchCreate(variables: FigmaVariable[], result: SyncResult): Promise<void> {
    // Batch in groups of 100 using figma_batch_create_variables
    const batches = this.chunk(variables, 100);
    for (const batch of batches) {
      try {
        await this.consoleMcp.batchCreateVariables(this.figmaFileKey, batch);
        result.created += batch.length;
      } catch (error) {
        result.errors.push({
          token: `batch(${batch.length})`,
          operation: 'create',
          message: error.message
        });
      }
    }
  }
  
  private async batchUpdate(variables: FigmaVariable[], result: SyncResult): Promise<void> {
    // Batch in groups of 100 using figma_batch_update_variables
    const batches = this.chunk(variables, 100);
    for (const batch of batches) {
      try {
        await this.consoleMcp.batchUpdateVariables(this.figmaFileKey, batch);
        result.updated += batch.length;
      } catch (error) {
        result.errors.push({
          token: `batch(${batch.length})`,
          operation: 'update',
          message: error.message
        });
      }
    }
  }
  
  private detectDrift(current: FigmaVariable[], expected: FigmaTokenFile): DriftReport {
    // Compare current Figma state against last-known pushed state
    // If any DesignerPunk-managed variable has been modified in Figma, report drift
  }
  
  private chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
  
  // ... deleteVariable remains individual (no batch delete API)
}
```

### Drift Detection Policy

**Decision: Detect and Block (with force override)**

When sync detects that Figma variables have been edited directly (diverged from last-known pushed state):

1. **Block sync** — Do not proceed with partial or full overwrite
2. **Report drifted variables** — Show exactly which variables changed and how
3. **Require human decision** — User reviews drift report and either:
   - Resolves drift in Figma (revert manual changes), then re-runs sync
   - Uses `--force` flag to override (acknowledging Figma changes will be lost)

```bash
# Normal sync (blocks on drift)
npm run figma:push

# Force override (after reviewing drift report)
npm run figma:push -- --force
```

**Rationale**: DesignerPunk has experienced drift in past iterations. Tokens flow downstream from code, and only in that direction. Blocking on drift enforces this principle while the force override prevents dead ends.

---

### Partial Failure Handling

**Strategy: Incremental with Clear Recovery**

The sync is **incremental** — batches that succeed stay applied, even if a later batch fails. This is necessary because:
- Figma Variables API doesn't support transactions (no rollback capability)
- Rolling back 200 variables because variable 201 failed is worse than leaving 200 applied
- Drift detection on next sync will catch any inconsistencies

**Failure Behavior:**

When a batch fails:
1. **Stop immediately** — Don't continue with remaining batches
2. **Report progress** — Show what succeeded before failure
3. **Report failure details** — Show which batch failed and why
4. **Provide recovery command** — Show how to resume from last successful batch

**Example Error Report:**

```
Sync completed with errors:

✅ Created: 200 variables (batches 1-2)
❌ Failed: Batch 3 of 5
   - Error: Rate limit exceeded (429)
   - Recommendation: Wait 60 seconds, then run:
     npm run figma:push -- --resume 3

⏸️  Remaining: 200 variables (batches 4-5)

To resume sync after resolving the error, use the --resume flag with the failed batch number.
```

**Resume Flag:**

```bash
# Resume from batch 3 (skips batches 1-2 which already succeeded)
npm run figma:push -- --resume 3
```

**Implementation Note:** The `TokenSyncWorkflow.sync()` method accepts a `resume` option to skip already-completed batches. The `SyncError` interface includes a `batch` field to identify which batch failed.

**Rationale:**

This approach:
- Minimizes wasted work (don't re-push 200 variables that already succeeded)
- Provides clear recovery path (resume from failure point)
- Maintains audit trail (error report shows exactly what succeeded and what failed)
- Aligns with Figma API constraints (no transaction support)

**Trade-off:** Partial state is possible (200 variables pushed, 300 remaining). However, this is preferable to all-or-nothing (which would require rolling back 200 variables manually if batch 3 fails).

---

### Read-Only Enforcement

**Policy: Figma is read-only for tokens**

New tokens are defined through the spec process (design-outline → requirements → design → tasks → implementation), not in Figma. Figma surfaces token needs but does not solve for them.

**Enforcement Mechanism: Social + Agent Review**

DesignerPunk cannot technically prevent designers from editing variables in Figma (Figma Variables API doesn't support locking). Enforcement is **social**, backed by agent review:

1. **Drift detection** — Blocks next sync if Figma variables have been edited
2. **Design-outline review** — Ada, Lina, and Thurgood review extracted designs before they enter the spec process
3. **Token mismatch flags** — Extraction flags off-system values and no-match tokens
4. **Team policy** — Document that Figma variables are managed by code, not edited manually

**Agent Review Responsibilities:**

| Agent | Review Focus |
|-------|--------------|
| **Ada** | Token decisions — validates token usage, identifies missing tokens, recommends new token creation through spec process |
| **Lina** | Component structure — validates component architecture, inheritance patterns, behavioral contracts |
| **Thurgood** | Spec quality — validates design-outline completeness, extraction confidence flags, testability |

**When Drift is Detected:**

The sync blocks and reports:
```
Drift detected: 3 variables have been edited in Figma since last push

Drifted variables:
- space/300: Expected 24, found 25 (edited in Figma)
- color/primary: Expected #B026FF, found #A020E0 (edited in Figma)
- fontSize/200: Expected 16, found 18 (edited in Figma)

Resolution options:
1. Revert changes in Figma, then re-run: npm run figma:push
2. Force override (Figma changes will be lost): npm run figma:push -- --force
3. If these values should be tokens, create them through the spec process first
```

**Rationale:**

People (and AI agents) can do whatever they want — we don't have control over that. The best we can do is:
- Provide opportunities for realignment (drift detection)
- Help facilitate their goals in ways that minimize friction with the system (extraction workflow surfaces token needs)
- Communicate requirements of our social and technical contracts (documentation, agent review)

This aligns with DesignerPunk's governance philosophy: systems should enable good decisions and surface bad ones, not prevent all possible mistakes.

---

### Error Handling: Fail and Report

When sync fails:

1. **Stop immediately** — Don't continue with partial state (beyond current batch)
2. **Report what succeeded** — List created/updated/deleted counts
3. **Report what failed** — List specific errors with token names and batch numbers
4. **Require manual intervention** — User decides how to proceed (retry, resume, or investigate)
```

---

## Figma File Strategy

### Dedicated Token Library

DesignerPunk tokens live in a dedicated Figma library file:

```
DesignerPunk Token Library (Figma File)
├── Primitives Collection
│   ├── space/100, space/200, ...
│   ├── color/purple/300, color/cyan/300, ...
│   └── fontSize/100, fontSize/200, ...
└── Semantic Collection
    ├── color/primary, color/error, ...
    └── space/inset/normal, space/inset/spacious, ...
```

### Fork Strategy

When DesignerPunk is forked for a new project:

1. **Fork the token library file** — Copy to new Figma team/project
2. **Update sync configuration** — Point to new file key
3. **Sync tokens** — Push DesignerPunk tokens to forked library
4. **Link project files** — Project files reference the forked library

```typescript
// Configuration per project
interface FigmaSyncConfig {
  /** Figma file key for token library */
  libraryFileKey: string;
  /** Figma team ID (for permissions) */
  teamId?: string;
  /** Project name (for documentation) */
  projectName: string;
}
```

---

## Translation Layer

### Automatic Translation

All Figma reads go through the translation layer automatically:

```typescript
// src/figma/TokenTranslator.ts

interface TranslationResult {
  token: string;           // e.g., "space.300"
  confidence: 'exact' | 'approximate' | 'no-match';
  rawValue: string;        // e.g., "24px"
  suggestion?: string;     // If no exact match, suggest closest
  delta?: string;          // e.g., "1px off from space.300 (24px)"
}

class TokenTranslator {
  constructor(private dtcgTokens: DTCGTokenFile) {}
  
  translate(
    value: number | string,
    category: 'spacing' | 'color' | 'typography' | 'radius' | 'shadow'
  ): TranslationResult {
    const exactMatch = this.findExactMatch(value, category);
    if (exactMatch) {
      return {
        token: exactMatch,
        confidence: 'exact',
        rawValue: String(value)
      };
    }
    
    const approximate = this.findApproximateMatch(value, category);
    if (approximate) {
      return {
        token: approximate.token,
        confidence: 'approximate',
        rawValue: String(value),
        suggestion: `Consider using ${approximate.token} for consistency`,
        delta: approximate.delta
      };
    }
    
    return {
      token: '',
      confidence: 'no-match',
      rawValue: String(value),
      suggestion: 'No matching token found'
    };
  }
  
  private findExactMatch(value: number | string, category: string): string | null {
    // Search DTCG tokens for exact value match
  }
  
  private findApproximateMatch(value: number | string, category: string): { token: string; delta: string } | null {
    // Search DTCG tokens for closest match within tolerance
  }
}
```

### Tolerance Rules

| Category | Tolerance | Rationale |
|----------|-----------|-----------|
| Spacing | ±2px | Accounts for Figma rounding |
| Color | ΔE < 3 | Perceptually similar |
| Font Size | ±1px | Accounts for rendering differences |
| Radius | ±1px | Minor visual difference |

### Warn and Suggest Behavior

When a value doesn't exactly match a token:

```typescript
// Example warning output
{
  "frame": "Card",
  "padding": {
    "raw": { "top": 25, "right": 24, "bottom": 24, "left": 24 },
    "tokens": {
      "top": {
        "token": "space.300",
        "confidence": "approximate",
        "warning": "⚠️ Off-system value: 25px is 1px off from space.300 (24px)"
      },
      "right": { "token": "space.300", "confidence": "exact" },
      "bottom": { "token": "space.300", "confidence": "exact" },
      "left": { "token": "space.300", "confidence": "exact" }
    }
  }
}
```

### Enriched Figma Response

When AI reads a Figma design, the response is automatically enriched:

**Raw Figma Response:**
```json
{
  "frame": "Card",
  "padding": { "top": 24, "right": 24, "bottom": 24, "left": 24 },
  "backgroundColor": "#B026FF"
}
```

**Enriched Response (with DesignerPunk vocabulary):**
```json
{
  "frame": "Card",
  "padding": {
    "raw": { "top": 24, "right": 24, "bottom": 24, "left": 24 },
    "tokens": {
      "top": "space.300",
      "right": "space.300",
      "bottom": "space.300",
      "left": "space.300"
    },
    "semantic": "space.inset.spacious"
  },
  "backgroundColor": {
    "raw": "#B026FF",
    "token": "purple.300",
    "semantic": "color.primary"
  }
}
```

---

## Console MCP Configuration

### Installation (NPX Mode — Recommended)

NPX mode provides all 56+ tools including variable management, design creation, and batch operations. The Desktop Bridge plugin connects via WebSocket (port 9223) — no special Figma launch flags needed.

```json
// .kiro/settings/mcp.json
{
  "mcpServers": {
    "figma-console": {
      "command": "npx",
      "args": ["-y", "figma-console-mcp@latest"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}",
        "ENABLE_MCP_APPS": "true"
      }
    }
  }
}
```

### Why NPX Over Other Modes

| Mode | Tools | Variable CRUD | Batch Ops | Enterprise Required | Setup |
|------|-------|---------------|-----------|---------------------|-------|
| **NPX (chosen)** | 56+ | ✅ | ✅ | No | ~10 min |
| Remote SSE | 21 | ❌ | ❌ | Yes (for variables) | ~2 min |
| Local Git | 56+ | ✅ | ✅ | No | ~15 min |

Remote SSE is read-only (~34% of tools) and cannot create or modify designs. Local Git provides the same capabilities as NPX but requires manual updates. NPX auto-updates via `@latest`.

### Required Setup

1. **Node.js 18+** installed
2. **Figma Desktop** installed (not web app)
3. **Desktop Bridge plugin** — Install once via Plugins → Development → Import from manifest. Run in Figma file when needed. Connects via WebSocket (port 9223), no debug flags required.
4. **Personal Access Token** — Generate at figma.com/developers/api#access-tokens, configure as `FIGMA_ACCESS_TOKEN`

### Pre-flight Checks

Before sync, verify:

```typescript
async function preflight(): Promise<PreflightResult> {
  const checks = {
    figmaDesktopRunning: await checkFigmaDesktop(),
    webSocketConnected: await checkWebSocket(9223),
    pluginRunning: await checkDesktopBridgePlugin(),
    tokenValid: await checkFigmaToken()
  };
  
  return {
    ready: Object.values(checks).every(Boolean),
    checks
  };
}
```

### Key Console MCP Capabilities

**Variable Management (Spec 054a):**
- `figma_setup_design_tokens` — Atomic: create collection + modes + variables in one call
- `figma_batch_create_variables` — Create up to 100 variables per call (10-50x faster)
- `figma_batch_update_variables` — Update up to 100 variable values per call
- `figma_create_variable_collection` — Create new collections with modes
- `figma_create_variable` / `figma_update_variable` / `figma_delete_variable` — Individual CRUD
- `figma_add_mode` / `figma_rename_mode` — Mode management
- `figma_get_variables` — Read current variable state (for diff calculation)

**Design Extraction (Spec 054b):**
- `figma_get_component` — Component data (metadata or reconstruction spec)
- `figma_get_component_for_development` — Component + rendered image
- `figma_get_file_data` — Full file structure
- `figma_get_styles` — Color, text, effect styles
- `figma_get_variables` — Extract design tokens/variables
- `figma_check_design_parity` — Compare Figma specs against code implementation (scored diff report)
- `figma_generate_component_doc` — Platform-agnostic markdown docs merging Figma + code data

---

## Scope Boundaries

### Spec 054a: Push Tokens (Code → Figma)

1. **FigmaTransformer** — Implement ITokenTransformer for Figma
2. **DesignTokens.figma.json** — Figma Variables API format output (intermediate audit artifact)
3. **Token sync workflow** — On-demand push using batch APIs
4. **Drift detection** — Detect and block with force override option
5. **Console MCP configuration** — NPX mode + Desktop Bridge setup
6. **Dedicated library strategy** — Documentation for fork workflow
7. **Error handling** — Fail and report
8. **CLI command** — `figma:push` (with `--force` flag)

### Spec 054b: Extract Designs (Figma → Spec)

1. **DesignExtractor** — Read Figma designs, extract component structure
2. **TokenTranslator** — Automatic translation with warn-and-suggest
3. **No-match handling** — Flag, pause, suggest, wait for human decision
4. **design-outline.md generation** — Transform Figma structure to spec format
5. **Design-code parity** — Optional validation using `figma_check_design_parity`
6. **Extraction validation** — Best-effort with flags for ambiguous structures
7. **CLI command** — `figma:extract`

### Shared (This Design Outline)

1. **Console MCP configuration** — NPX mode setup documentation
2. **Figma file strategy** — Dedicated token library, fork strategy
3. **One-way sync architecture** — Code → Figma → Spec workflow
4. **Translation layer** — Tolerance rules, enriched responses

### Documentation (Across Both Specs)

1. **Figma Integration Guide** — Full workflow (push + extract)
2. **Designer workflow guide** — How to use pushed tokens, mark designs ready
3. **Spec creation workflow** — How to extract and review designs

### Out of Scope (Future Specs)

1. **Automated CI/CD sync** — Automatic token push on release
2. **Multi-designer workflow** — Handling multiple designers
3. **Component token sync** — Evaluate after Phase 1
4. **Figma plugin development** — Custom plugin beyond Desktop Bridge
5. **Bidirectional sync** — Figma → Code automatic sync (explicitly rejected)
6. **Real-time collaboration** — Live sync during design iteration
7. **Penpot/Pencil.io transformers** — Future ITokenTransformer implementations

---

## Performance Considerations

### Sync Performance

**Batch Size:** Tunable parameter (currently 100 variables per batch, can be adjusted based on performance data)

**Estimated Sync Times:**

| Token Count | Batches | Estimated Time | Notes |
|-------------|---------|----------------|-------|
| 100 tokens | 1 batch | 2-5 seconds | Single API call |
| 500 tokens | 5 batches | 10-30 seconds | Depends on Figma API latency |
| 1000 tokens | 10 batches | 20-60 seconds | May hit rate limits |

**Performance Threshold:** If sync takes >60 seconds for 500 tokens, investigate:
- Batch size (reduce to 50 per batch if rate limits hit)
- Figma API latency (check network conditions)
- Desktop Bridge connection (ensure WebSocket stable)

**Optimization Strategy:**

1. **Benchmark after 054a implementation** — Measure actual sync times with real token data
2. **Tune batch size** — Adjust based on rate limit behavior and latency
3. **Add progress indicators** — Show "Syncing batch 3 of 5..." for long-running syncs
4. **Consider parallel batches** — If Figma API supports concurrent requests (investigate in 054a)

**Trade-offs:**
- Larger batches = fewer API calls = faster sync (but higher risk of rate limits)
- Smaller batches = more API calls = slower sync (but more resilient to rate limits)

**Current Decision:** Start with 100 per batch (Console MCP's documented limit). Adjust based on real-world performance data.

---

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Console MCP API changes | Medium | High | Pin to specific version via `figma-console-mcp@1.10`, monitor releases |
| Figma Variables API limitations | Low | Medium | Document unsupported types (composite: shadow, typography) |
| Token mapping edge cases | High | Medium | Define clear tolerance rules, log mismatches, pause on no-match |
| Batch API rate limits | Medium | Medium | Chunk operations to 100 per batch, retry with backoff |
| Desktop Bridge plugin disconnects | Low | Low | Pre-flight check, clear reconnection instructions |

### Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Figma Desktop not running | Medium | Medium | Pre-flight check before sync |
| Token drift (Figma edited directly) | Medium | High | Detect and block, force override available |
| Desktop Bridge plugin not running | Medium | Medium | Pre-flight check, one-time install persists |
| NPX version mismatch | Low | Low | Use `@latest` for auto-updates, pin for stability |

---

## Design Decisions Summary

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | One-way sync (Code → Figma → Spec) | Prevents drift, preserves code as source of truth |
| 2 | Explicit spec handoff (not automatic) | Human review ensures quality and alignment |
| 3 | Use BOTH Figma powers | Complementary capabilities (Kiro built-in + Console MCP) |
| 4 | Implement ITokenTransformer | Clean integration with Spec 053 architecture, scales to Penpot/Pencil.io |
| 5 | NPX mode + Desktop Bridge | All 56+ tools, no debug flags, WebSocket connection, auto-updates |
| 6 | Dedicated token library file | Clean separation, fork-friendly |
| 7 | On-demand sync only | Start simple, automate later |
| 8 | Automatic translation | Seamless extraction experience |
| 9 | Warn and suggest for mismatches | Educational, non-blocking, traceable |
| 10 | Fail and report for sync errors | Clear state, manual intervention |
| 11 | Primitives + semantics only | Component tokens add complexity |
| 12 | Split into 054a (push) + 054b (extract) | Independent execution, Part A ships without Part B |
| 13 | Figma read-only for tokens | Overwrite on sync, tokens defined through spec process |
| 14 | Detect and block drift (with force override) | Enforces one-way flow, prevents silent data loss |
| 15 | Batch APIs for sync | 10-50x faster than individual calls, up to 100 per batch |
| 16 | Pause on no-match values | Human-in-the-loop for off-system values, no auto-resolution |
| 17 | Best-effort extraction with flags | Don't fail on messy Figma files, flag issues for human review |
| 18 | Design-code parity check | Optional validation using `figma_check_design_parity` |
| 19 | `.figma.json` as intermediate artifact | Audit trail, dry-run review, testable boundary, tool-agnostic |
| 20 | Composite tokens as Figma styles | Push shadow/typography as styles via Plugin API, not decomposed variables |
| 21 | Identical mode values (Phase 1) | All tokens same across light/dark modes, platform separation at build time |
| 22 | Component-Family context in extraction | Extractor queries Component-Family docs and existing components for context-aware recommendations |
| 23 | Behavioral contracts as hard stop | Extraction flags missing behavioral contracts, blocks progression to requirements.md until resolved |
| 24 | Accessibility contracts as hard stop | Extraction flags missing accessibility contracts, blocks progression to requirements.md until resolved |
| 25 | Component token decision in design-outline review | Figma extraction surfaces decision points, design-outline review (with Ada) defines solution |
| 26 | Platform parity validation in extraction | Extractor flags platform-specific interactions and recommends cross-platform equivalents |
| 27 | Confidence flag thresholds documented | Clear definitions of ✅ ⚠️ ❌ flags so humans know what action is required |

---

## Resolved Open Questions

All open questions have been resolved as of February 18, 2026. Decisions are documented here for traceability.

### OQ-054-1: Setup Complexity → RESOLVED: Acceptable

**Decision**: Setup friction is acceptable, especially with NPX + Desktop Bridge (no debug flags needed).

**Setup is**: Install Desktop Bridge plugin once, run it when needed. NPX auto-updates. Pre-flight checks catch issues before sync.

---

### OQ-054-2: Sync Strategy → RESOLVED: Figma Read-Only (Overwrite All)

**Decision**: Option 1 — Figma is read-only for tokens. Full overwrite on sync.

**Rationale**: New tokens are defined through the spec process (design-outline → requirements → design → tasks → implementation). Figma surfaces token needs but does not solve for them. Overwrite-all is the simplest implementation and the clearest policy.

---

### OQ-054-3: Translation Tolerances → RESOLVED: Start with Proposed Values

**Decision**: Start with proposed tolerances (±2px spacing, ΔE < 3 color, ±1px font size, ±1px radius). Adjust based on real extraction results.

**Rationale**: Tolerances only matter for extraction (Spec 054b). Since the design-outline is human-reviewed, fuzzy matches get caught in review. Not a high-stakes initial decision.

---

### OQ-054-4: No-Match Values → RESOLVED: Flag, Pause, Suggest, Wait

**Decision**: When a value has no token match:
1. **Flag and PAUSE** — Stop extraction, do not auto-resolve
2. **Suggest closest** — Show nearest token with delta
3. **Wait for human** — Human reviews (possibly with AI agent support) and decides
4. **Execute on feedback** — Resume with human's decision

**Rationale**: AI agents have a bias toward "solving" rather than stopping to ask. The extraction workflow must have a hard stop for no-match values. This aligns with DesignerPunk's AI collaboration principles about honest feedback over quick fixes.

---

### OQ-054-5: Token Drift → RESOLVED: Detect and Block (with Force Override)

**Decision**: Option 3 (detect and block), refined with a force override escape hatch.

- Pre-sync check compares current Figma state against last-known pushed state
- If drift detected: block sync, report exactly which variables drifted
- User can resolve drift in Figma and re-run, or use `--force` to override

**Rationale**: DesignerPunk has experienced drift in past iterations. Tokens flow downstream from code, only in that direction. Blocking enforces this principle. Force override prevents dead ends when the human has reviewed the drift and wants to proceed.

---

### OQ-054-6: Extraction Completeness → RESOLVED: Hybrid

**Decision**: Option 3 — Extract what's explicit in Figma (structure, token usage, variants, properties), flag everything else for human input (behavioral intent, accessibility, platform notes, edge cases).

**Implementation**: The design-outline.md template will have clear "AI-extracted" vs "requires human input" sections.

---

### OQ-054-7: Extraction Error Handling → RESOLVED: Best Effort with Flags

**Decision**: Option 2 — Extract what's possible, flag issues for human review. Do not fail the entire extraction for non-critical issues (missing descriptions, inconsistent naming, incomplete variants).

**Critical issues** (no-match token values) still trigger the pause-for-human behavior from OQ-054-4.

---

### OQ-054-8: Composite Token Push Strategy → RESOLVED: Styles First, Variables as Fallback

**Decision**: Push composite tokens (shadow, typography) as Figma styles via Plugin API, not decomposed variables.

**Implementation**:
- Shadow tokens → Figma Effect Styles via `figma_execute` calling `figma.createEffectStyle()`
- Typography tokens → Figma Text Styles via `figma_execute` calling `figma.createTextStyle()`
- Fallback to decomposed variables only if style creation isn't appropriate

**Rationale**: 
- Designers apply styles by name (semantic, discoverable)
- Extraction can match style names directly to composite tokens
- Cleaner than reconstructing from decomposed variables
- Aligns with how designers already work in Figma

**Date Resolved**: February 18, 2026 (Ada's domain review)

---

### OQ-054-9: Mode Mapping Strategy → RESOLVED: Identical Values Across Modes (Phase 1)

**Decision**: All tokens pushed to both `light` and `dark` modes with identical values.

**Rationale**:
- DesignerPunk tokens are currently platform-specific (web/iOS/Android), not theme-specific
- Platform separation happens at build time, not runtime
- Figma modes provide structure for future theme support without requiring changes now
- Designers see consistent token values regardless of mode

**Future Consideration**: If DesignerPunk adds theme-aware tokens (light/dark variants), map those to Figma modes. Platform-specific tokens remain identical across modes.

**Date Resolved**: February 18, 2026 (Ada's domain review)

---

## Next Steps

1. ✅ **Design outline created** — Architecture and decisions documented
2. ✅ **Dependency on Spec 053 complete** — ITokenTransformer interface exists
3. ✅ **Open questions resolved** — OQ-054-1 through OQ-054-7
4. ✅ **Console MCP capabilities researched** — NPX mode, batch APIs, 56+ tools
5. ✅ **Spec split decided** — 054a (push) and 054b (extract) as sibling directories
6. ⏳ **Create 054a spec** — requirements.md → design.md → tasks.md for token push
7. ⏳ **Create 054b spec** — requirements.md → design.md → tasks.md for design extraction
8. ⏳ **Configure Console MCP** — NPX mode + Desktop Bridge setup
9. ⏳ **Implement FigmaTransformer** (054a)
10. ⏳ **Implement TokenSyncWorkflow** (054a)
11. ⏳ **Implement DesignExtractor** (054b)
12. ⏳ **Implement TokenTranslator** (054b)

---

**Organization**: spec-guide
**Scope**: 054-figma-console-mcp-integration
