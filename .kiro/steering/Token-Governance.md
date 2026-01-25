---
inclusion: manual
---

# Token Governance Guide

**Date**: 2026-01-05
**Purpose**: Comprehensive governance for token selection, usage, and creation decisions
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: component-development, token-development, spec-planning
**Last Reviewed**: 2026-01-25

---

## Overview

This document defines the governance framework for token selection, usage, and creation in the DesignerPunk design system. It establishes clear autonomy levels, friction requirements, and human checkpoint triggers to ensure architectural integrity while enabling efficient development.

**Core Principle**: High friction is intentional. Every token in the system should exist for a deliberate reason, not because an AI agent took a shortcut.

**Document Structure**:
- [Token Selection Matrix](#token-selection-matrix) — Which token type to use
- [Token Usage Governance](#token-usage-governance) — Autonomy levels for using existing tokens
- [Token Creation Governance](#token-creation-governance) — Human review requirements for creating tokens
- [Prior Acknowledgment](#prior-acknowledgment) — How specs can pre-authorize decisions
- [Decision Examples](#decision-examples) — Real-world scenarios and correct decisions
- [Token Creation Guides](#token-creation-guides) — How to create each token type (after human approval)

---

## Token Selection Matrix

When you need a token value, follow this priority order:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TOKEN SELECTION PRIORITY                              │
│                     (Concept-First Approach)                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   1. SEMANTIC CONCEPT TOKEN EXISTS?                                          │
│      └── YES → Use it (verify semantic correctness)                         │
│      └── NO  → Continue to step 2                                           │
│                                                                              │
│   2. COMPONENT TOKEN EXISTS?                                                 │
│      └── YES → Use it (requires human checkpoint)                           │
│      └── NO  → Continue to step 3                                           │
│                                                                              │
│   3. PRIMITIVE TOKEN EXISTS?                                                 │
│      └── YES → Use it (requires context/acknowledgment)                     │
│      └── NO  → Continue to step 4                                           │
│                                                                              │
│   4. NO EXISTING TOKEN WORKS?                                                │
│      └── STOP → Human checkpoint required                                   │
│          └── Present: value needed, what was checked, recommendation        │
│          └── Human decides: component token vs new primitive vs new semantic│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Insight**: Steps 1-3 are about USING existing tokens. Step 4 is about CREATING new tokens. These have fundamentally different governance requirements.

### Concept-First Selection Guidance

The DesignerPunk token system follows the **Nathan Curtis concept-first naming model**. When selecting tokens:

1. **Think concept first**: What semantic meaning does this color represent?
   - Feedback states → `color.feedback.*` (success, error, warning, info, select)
   - Entity identity → `color.identity.*` (human, agent)
   - Interactive emphasis → `color.action.*` (primary, secondary)
   - Content contrast → `color.contrast.*` (onLight, onDark)
   - Visual structure → `color.structure.*` (canvas, surface, border)

2. **Then consider property**: Does the concept need property disambiguation?
   - Feedback tokens include property: `color.feedback.error.text`, `color.feedback.error.background`
   - Identity tokens ARE the color: `color.identity.human` (no property needed)
   - Action tokens ARE the color: `color.action.primary` (no property needed)

3. **Component tokens reference semantic tokens**: Component-specific tokens should reference semantic tokens, not primitives directly.
   - `color.avatar.human.background` → references `color.identity.human`
   - `color.avatar.human.icon` → references `color.contrast.onDark`

---

## Token Usage Governance

### Semantic Concept Token Usage

**Autonomy Level**: Full autonomy
**Friction**: Low
**Requirement**: Semantic correctness

AI agents can freely use semantic concept tokens without human checkpoint, provided the usage is semantically correct.

**Semantically correct usage:**
- `color.feedback.error.text` for error message text
- `color.feedback.success.background` for success alert backgrounds
- `color.action.primary` for primary brand elements and hero CTAs
- `color.contrast.onDark` for text/icons on dark or colored backgrounds
- `color.structure.canvas` for page backgrounds
- `color.identity.human` for human entity indicators

**Semantically incorrect usage:**
- `color.feedback.error.text` for success states (wrong semantic meaning)
- `color.action.primary` for every button in a list (causes UI over-saturation)
- `color.contrast.onLight` for text on dark backgrounds (inverted contrast)
- `color.structure.surface` for text color (wrong property context)

**Rule**: If you're unsure whether usage is semantically correct, ask the human.

---

### Primitive Token Usage

**Autonomy Level**: Conditional autonomy
**Friction**: Medium
**Requirement**: Prior context OR human acknowledgment

AI agents can use primitive tokens when:
1. A semantic concept token doesn't exist for the use case, AND
2. One of these conditions is met:
   - The spec documents (design-outline, requirements, design, tasks) explicitly reference the primitive
   - The human has acknowledged primitive usage is appropriate for this context
   - The usage is for building a new semantic token (primitives compose into semantics)

**When to checkpoint with human:**
- Spec is silent about which token to use
- You're choosing between multiple primitives that could work
- The primitive usage feels like it should have a semantic equivalent

**Example requiring checkpoint:**
```
AI: "I need a subtle border color here. I could use gray100 primitive directly, 
but this feels like it should use a semantic token. The spec doesn't specify. 
Should I:
A) Use gray100 directly
B) Use color.structure.border (if this is a structural border)
C) Use color.structure.border.subtle (if this needs transparency)
D) Something else?"
```

---

### Component Token Usage

**Autonomy Level**: Human checkpoint required
**Friction**: High
**Requirement**: Explicit human approval

AI agents MUST checkpoint with human before using component tokens, even if the component token already exists.

**Why?** Component tokens represent an acknowledgment that the existing semantic token system is insufficient for a specific component's needs. Using them should be a deliberate decision, not a default.

**Checkpoint format:**
```
AI: "This component needs [value]. I've checked:
- Semantic concept tokens: [what was checked, why insufficient]
- Primitive tokens: [what was checked, why insufficient]
- Existing component token: [token name] exists for this component

Recommendation: Use existing component token [token name]
Awaiting your approval to proceed."
```

**Exception**: If the spec explicitly calls for using a specific component token, the AI can proceed without additional checkpoint (prior acknowledgment).

**Component Token Pattern**: `color.{component}.{variant}.{property}`
- Component tokens should reference semantic tokens when possible
- Example: `color.avatar.human.background` references `color.identity.human`
- Example: `color.avatar.human.icon` references `color.contrast.onDark`

---

## Token Creation Governance

### Universal Rule: Human Review Required

**Creating ANY token (semantic, primitive, or component) requires human review.**

This is non-negotiable. Token creation is an architectural decision that affects the entire design system. AI agents should never autonomously create tokens.

### Creation Checkpoint Format

When an AI agent determines a new token is needed:

```
AI: "No existing token meets this requirement.

NEEDED: [specific value and context]

CHECKED:
- Semantic tokens: [what was checked]
- Primitive tokens: [what was checked]
- Component tokens: [what was checked]

ANALYSIS:
- Is this a one-off need? [yes/no and reasoning]
- Does this fit mathematical principles? [yes/no and reasoning]
- Could this become a reusable pattern? [yes/no and reasoning]

RECOMMENDATION: [component token / new primitive / new semantic]
REASONING: [why this recommendation]

Awaiting your decision before proceeding."
```

### Human Decision Points

The human should consider:

1. **Scope**: Is this need isolated to one component, or will it appear elsewhere?
2. **Mathematical fit**: Does the value align with the token family's mathematical foundation?
3. **Semantic meaning**: Is there a clear, reusable semantic concept here?
4. **System impact**: What's the maintenance cost of adding this token?

### Creation Decision Matrix

| Scenario | Likely Decision | Reasoning |
|----------|-----------------|-----------|
| One-off value, doesn't fit math | Component token | Scoped, doesn't pollute system |
| One-off value, fits math | Component token (maybe primitive later) | Start scoped, promote if pattern emerges |
| Reusable pattern, fits math | Primitive + semantic | System-level addition justified |
| Reusable pattern, doesn't fit math | Needs design discussion | May require rethinking the requirement |

---

## Prior Acknowledgment

### Concept

"Prior acknowledgment" allows humans to pre-authorize token decisions in spec documents, reducing checkpoint friction during implementation while maintaining governance.

### How It Works

If a spec document (design-outline, requirements, design, or tasks) explicitly specifies:
- A specific token to use
- A specific value that will require a new token
- Permission to use primitive tokens for certain purposes

Then the AI agent can proceed without additional checkpoint for that specific decision.

### Examples

**Spec pre-authorizes primitive usage:**
```markdown
## Design Notes
- Icon optical balance requires space075 (6px) - use primitive directly
```
→ AI can use `space075` without checkpoint

**Spec pre-authorizes component token creation:**
```markdown
## Implementation Notes
- ButtonIcon needs custom inset values (8px, 10px, 12px)
- Create component tokens referencing space100, space125, space150
```
→ AI can create component tokens without additional checkpoint

**Spec is silent:**
```markdown
## Requirements
- Button should have appropriate padding
```
→ AI must checkpoint: "What does 'appropriate' mean? Which token?"

### Spec Authors' Responsibility

When writing specs, be explicit about token decisions:
- Name specific tokens when known
- Call out when primitive usage is intentional
- Indicate when new tokens will be needed
- Flag areas where token selection needs discussion

---

## Decision Examples

### Example 1: Standard Component Development

**Situation**: Building a card component, need internal padding.

**Correct approach**:
1. Check semantic tokens → `space.inset.comfortable` (12px) exists
2. Verify semantic correctness → Yes, "comfortable inset" matches card padding intent
3. Use `space.inset.comfortable` → No checkpoint needed

---

### Example 2: Feedback Color Selection

**Situation**: Building a form validation message, need error text color.

**Correct approach**:
1. Think concept first → This is feedback (error state)
2. Check semantic concept tokens → `color.feedback.error.text` exists
3. Verify semantic correctness → Yes, error text for validation message
4. Use `color.feedback.error.text` → No checkpoint needed

---

### Example 3: Button Background Color

**Situation**: Building a primary CTA button, need background color.

**Correct approach**:
1. Think concept first → This is an action (primary emphasis)
2. Check semantic concept tokens → `color.action.primary` exists
3. Verify semantic correctness → Yes, this is a hero CTA (single, focused instance)
4. Use `color.action.primary` → No checkpoint needed

**Alternative scenario**: Building a list of action buttons
1. Think concept first → These are actions, but repetitive (list context)
2. Check semantic concept tokens → `color.action.secondary` exists
3. Verify semantic correctness → Yes, secondary emphasis avoids UI over-saturation
4. Use `color.action.secondary` → No checkpoint needed

---

### Example 4: Content on Colored Background

**Situation**: Need text color for content on a purple button.

**Correct approach**:
1. Think concept first → This is contrast (content on colored background)
2. Check semantic concept tokens → `color.contrast.onDark` exists
3. Verify semantic correctness → Yes, purple is a dark/colored background
4. Use `color.contrast.onDark` → No checkpoint needed

---

### Example 5: Primitive Needed, Spec Silent

**Situation**: Building a tooltip, need 6px padding. Spec says "small padding."

**Correct approach**:
1. Check semantic tokens → `space.inset.tight` (4px) too small, `space.inset.normal` (8px) too large
2. Check primitives → `space075` (6px) exists
3. Spec is silent on specific token → Checkpoint required

```
AI: "Tooltip needs 6px padding. Semantic tokens don't have this value.
space075 (6px) primitive exists. Spec says 'small padding' but doesn't specify.
Should I use space075 directly, or should we create a semantic token like 
space.inset.compact for this pattern?"
```

---

### Example 6: No Token Exists

**Situation**: Component needs 7px spacing for optical alignment.

**Correct approach**:
1. Check semantic tokens → Nothing at 7px
2. Check primitives → Nothing at 7px (doesn't fit 8px grid)
3. No token exists → STOP, checkpoint required

```
AI: "Component needs 7px for optical alignment. No existing token works.

CHECKED: All semantic spacing, all primitive spacing
ANALYSIS:
- One-off need: Yes, specific to this component's visual balance
- Mathematical fit: No, 7px doesn't align to 8px baseline grid
- Reusable pattern: Unlikely, this is an optical adjustment

RECOMMENDATION: Component token
REASONING: Scoped to this component, doesn't pollute mathematical foundation

Awaiting your decision."
```

---

### Example 7: Avatar Component Token Usage

**Situation**: Building an avatar component, need background color for human variant.

**Correct approach**:
1. Think concept first → This is identity (human entity)
2. Check semantic concept tokens → `color.identity.human` exists
3. Check component tokens → `color.avatar.human.background` exists (references `color.identity.human`)
4. Component token exists → Checkpoint required

```
AI: "Avatar human variant needs background color. I've checked:
- Semantic concept tokens: color.identity.human exists (orange300)
- Component token: color.avatar.human.background exists (references color.identity.human)

Recommendation: Use component token color.avatar.human.background
REASONING: Component token provides component-scoped discovery while referencing semantic token

Awaiting your approval to proceed."
```

---

### Example 8: Pattern Emerging

**Situation**: Third component needs the same 14px spacing value.

**Correct approach**:
1. Recognize pattern → Same value needed in multiple places
2. Checkpoint with human → This might warrant promotion

```
AI: "I notice 14px spacing is now needed in three components:
- ComponentA (existing component token)
- ComponentB (existing component token)  
- ComponentC (current work)

This pattern suggests 14px might warrant a primitive token (space175 = 8 × 1.75).
Should I:
A. Create another component token (keep scoped)
B. Propose creating space175 primitive and refactoring existing component tokens
C. Something else?"
```

---

## Token Creation Guides

**Important**: These guides are for AFTER human approval. Do not use these guides to autonomously create tokens.

### Creating Primitive Tokens

**Location**: `src/tokens/[TokenFamily]Tokens.ts`

**Required fields**:
```typescript
{
  name: 'tokenName',
  category: TokenCategory.FAMILY,
  baseValue: number,
  familyBaseValue: number,
  description: 'Human-readable description',
  mathematicalRelationship: 'base × multiplier = value',
  baselineGridAlignment: boolean,
  isStrategicFlexibility: boolean,
  isPrecisionTargeted: boolean,
  platforms: {
    web: { value: number, unit: 'px' },
    ios: { value: number, unit: 'pt' },
    android: { value: number, unit: 'dp' }
  }
}
```

**Detailed guide**: See `.kiro/specs/token-system/token-category-pattern-guide.md`

---

### Creating Semantic Tokens

**Location**: `src/tokens/semantic/[TokenFamily]Tokens.ts`

**Concept-First Naming Pattern**: `color.{concept}.{role}.{property?}.{state?}.{intensity?}`

| Segment | Required | Description | Examples |
|---------|----------|-------------|----------|
| `color` | ✅ | Token family | Always `color` |
| `concept` | ✅ | Semantic category | `feedback`, `identity`, `action`, `contrast`, `structure` |
| `role` | ✅ | Specific meaning | `success`, `error`, `human`, `primary`, `onDark`, `canvas` |
| `property` | ❌ | Visual styling property (when disambiguation needed) | `background`, `text`, `border`, `icon` |
| `state` | ❌ | Interaction state (when needed) | `rest`, `hover`, `pressed`, `disabled` |
| `intensity` | ❌ | Prominence level (when needed) | `fill`, `surface` |

**When to include property**:
- **Include**: When the concept/role applies to multiple properties (feedback.error needs both background AND text)
- **Omit**: When the token represents a single color value (identity.human IS the color, action.primary IS the color)

**Format**:
```typescript
export const semanticTokenName = {
  value: 'primitiveTokenName'  // Reference by name, not value
};
```

**For multi-primitive compositions** (like typography):
```typescript
{
  name: 'tokenName',
  primitiveReferences: {
    property1: 'primitive1',
    property2: 'primitive2'
  },
  category: SemanticCategory.CATEGORY,
  context: 'Usage context description',
  description: 'Human-readable description'
}
```

**Detailed guide**: See `.kiro/specs/token-system/token-category-pattern-guide.md`

---

### Creating Component Tokens

**Location**: `src/components/[ComponentName]/tokens.ts`

**Component Token Pattern**: `color.{component}.{variant}.{property}`

| Segment | Required | Description | Examples |
|---------|----------|-------------|----------|
| `color` | ✅ | Token family | Always `color` |
| `component` | ✅ | UI component | `avatar`, `badge` |
| `variant` | ✅ | Component-specific variant | `human`, `agent`, `notification` |
| `property` | ✅ | Visual styling property | `background`, `text`, `border`, `icon` |

**Note**: Variant comes BEFORE property in component tokens — this groups all properties for a variant together.

**Format**:
```typescript
import { defineComponentTokens } from '../../build/tokens/defineComponentTokens';
import { spacingTokens } from '../../tokens/SpacingTokens';

export const ComponentNameTokens = defineComponentTokens({
  component: 'ComponentName',
  family: 'spacing',
  tokens: {
    'tokenName': {
      reference: spacingTokens.space100,  // Preferred: reference primitive
      reasoning: 'Required explanation of why this token exists',
    },
    // OR for custom values:
    'customToken': {
      value: 14,  // Must conform to family's mathematical pattern
      reasoning: 'Required explanation of why this value is needed',
    },
  },
});
```

**Best Practice**: Component tokens should reference semantic tokens when possible:
```typescript
// Avatar component tokens referencing semantic tokens
'color.avatar.human.background': { reference: 'color.identity.human' },
'color.avatar.human.icon': { reference: 'color.contrast.onDark' },
'color.avatar.agent.background': { reference: 'color.identity.agent' },
'color.avatar.agent.icon': { reference: 'color.contrast.onDark' },
```

**Key requirements**:
- `reasoning` field is mandatory — explains why existing tokens are insufficient
- Prefer `reference` to semantic tokens over primitives when semantic meaning exists
- Prefer `reference` to primitives over custom `value`
- Custom values must conform to the token family's mathematical foundation

**Detailed guide**: See Rosetta System Architecture, "Component Token Integration" section

---

## MCP Query Examples

```
# Get this document
get_document_full({ path: ".kiro/steering/Token-Governance.md" })

# Get specific sections
get_section({ path: ".kiro/steering/Token-Governance.md", heading: "Token Selection Matrix" })
get_section({ path: ".kiro/steering/Token-Governance.md", heading: "Token Usage Governance" })
get_section({ path: ".kiro/steering/Token-Governance.md", heading: "Token Creation Governance" })
get_section({ path: ".kiro/steering/Token-Governance.md", heading: "Prior Acknowledgment" })
get_section({ path: ".kiro/steering/Token-Governance.md", heading: "Decision Examples" })
get_section({ path: ".kiro/steering/Token-Governance.md", heading: "Token Creation Guides" })
```

---

## Related Documentation

- [Token-Family-Color](./Token-Family-Color.md) — Complete color token reference with concept-first organization
- [Rosetta System Architecture](./Rosetta-System-Architecture.md) — Token pipeline architecture
- [Rosetta System Principles](./rosetta-system-principles.md) — Mathematical foundations
- [Token Quick Reference](./Token-Quick-Reference.md) — Token documentation routing
- [Token Category Pattern Guide](../.kiro/specs/token-system/token-category-pattern-guide.md) — Detailed primitive/semantic creation patterns
- [Core Goals](./Core%20Goals.md) — Project principles including token-first approach
- [Design Authority](../.kiro/specs/051-semantic-token-naming-restructure/design-outline.md) — Semantic token naming restructure design

---

*This governance framework ensures token decisions are deliberate, architecturally sound, and maintain the integrity of the design system.*
