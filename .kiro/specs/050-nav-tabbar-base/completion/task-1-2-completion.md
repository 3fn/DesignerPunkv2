# Task 1.2 Completion: Ballot Measure — `visual_gradient_glow` Concept

**Date**: 2026-03-18
**Task**: 1.2 Ballot measure: `visual_gradient_glow` concept
**Type**: Architecture
**Status**: Complete

---

## Artifacts Created

- `.kiro/steering/Component-Templates.md` (modified) — `gradient_glow` contract template added to Contract Category 4: Visual Contracts

## Architecture Decisions

### Decision 1: New concept vs fold into `visual_state_colors`

**Options Considered**:
1. Add `visual_gradient_glow` as a new visual contract template
2. Fold glow behavior into existing `visual_state_colors` contract

**Decision**: New concept (Option 1)

**Rationale**:
The glow gradient is structurally distinct from simple state colors. State colors are property swaps — this color when active, that color when inactive. The glow involves gradient geometry (elliptical, radii as percentage of container), multiple color stops with opacity tokens, independent animation of intensity during transitions, and overflow behavior (bleed vs clip). Combining these into `visual_state_colors` would bloat that contract with concerns that don't apply to most components.

**Trade-offs**:
- ✅ **Gained**: Clean separation of concerns, reusable template for future gradient-emphasis components
- ❌ **Lost**: Catalog surface area grows for a single consumer
- ⚠️ **Risk**: If no second consumer emerges, the template sits unused

**Counter-Arguments**:
- **Argument**: Single consumer (Nav-TabBar-Base) is thin evidence for a catalog entry
- **Response**: Peter approved with an explicit audit condition — reevaluate after more components ship. If no second consumer, consolidate back. The structural distinction is genuine regardless of consumer count.

## Implementation Details

### Contract Template

Added after "Pressed State Visual Contract" in Category 4:

```yaml
gradient_glow:
  description: Radial gradient background providing state-dependent visual emphasis
  behavior: |
    Component renders an elliptical radial gradient background on
    state-bearing elements. Active state uses an accent center color
    for visual prominence. Inactive state uses a same-color center
    (matching container background) for subtle contrast protection.
    Gradient geometry (radii, stops) is component-defined.
    Glow intensity is independently animatable during state transitions.
  wcag: null
  platforms: [web, ios, android]
  validation: |
    - Active elements show accent-colored gradient center
    - Inactive elements show same-color gradient (subtle vignette)
    - Gradient geometry matches component specification
    - Glow intensity animates during state transitions
    - Glow respects prefers-reduced-motion (snaps, no animation)
```

### Governance Process

- Ballot measure drafted with rationale and counter-argument per Ballot Measure Model
- Presented to Peter with impact assessment
- Peter approved with condition: audit contract value after more components ship
- Applied to steering doc, doc MCP index rebuilt (healthy)

## Validation (Tier 3: Comprehensive)

### Syntax Validation
✅ Component-Templates.md parses correctly
✅ YAML template follows existing contract template structure

### Design Validation
✅ Contract template follows established pattern (description, behavior, wcag, platforms, validation)
✅ Placed in correct category (Category 4: Visual Contracts)
✅ `wcag: null` is correct — gradient glow is decorative emphasis, not an accessibility concern

### System Integration
✅ Doc MCP index rebuilt — healthy, 75 documents, 2431 sections
✅ Contract available for Lina to reference in Nav-TabBar-Base `contracts.yaml` (Task 2.2)

## Requirements Compliance

✅ design.md § Behavioral Contracts: `visual_gradient_glow` concept now available in Concept Catalog for `contracts.yaml` authoring

## Lessons Learned

### What Worked Well
- Ballot measure model forced explicit counter-argument, which led to Peter's audit condition — a better outcome than unconditional approval

### Future Considerations
- Track whether a second consumer adopts `gradient_glow` — if not, consolidate back into `visual_state_colors` during a future contract audit
