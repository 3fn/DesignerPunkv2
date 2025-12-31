# Design Document: Steering Documentation Enhancements

**Date**: 2025-12-30
**Spec**: 033 - Steering Documentation Enhancements
**Status**: Design Phase
**Dependencies**: Spec 032 (Documentation Architecture Audit) - Complete

---

## Overview

This spec creates comprehensive token documentation to fill gaps identified by Spec 032:

1. **D1**: Release Management System steering doc (conceptual mental model)
2. **D2**: Token documentation gap analysis (audit report)
3. **D2.1**: Layout token docs (radius-tokens.md, border-tokens.md, spacing-tokens.md update)
4. **D2.2**: Effect & interaction token docs (opacity-tokens.md, accessibility-tokens.md)
5. **D2.3**: Responsive token docs (responsive-tokens.md)
6. **D3**: Token Quick Reference (routing table - now complete coverage)
7. **D4**: docs/tokens/ README (signposting)

Plus updates to the meta-guide (`00-Steering Documentation Directional Priorities.md`).

---

## Architecture

### Documentation Layer Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                    Steering Documentation                        │
├─────────────────────────────────────────────────────────────────┤
│  Layer 0: Meta-guide (always loaded)                            │
│    └── 00-Steering Documentation Directional Priorities.md      │
│                                                                  │
│  Layer 1: Always-loaded docs                                     │
│    ├── Core Goals.md                                            │
│    ├── Development Workflow.md                                   │
│    ├── Token Quick Reference.md  ◄── NEW (D3)                   │
│    └── ...                                                       │
│                                                                  │
│  Layer 2: MCP-queryable docs (inclusion: manual)                │
│    ├── Release Management System.md  ◄── NEW (D1)               │
│    ├── color-tokens.md                                          │
│    ├── spacing-tokens.md (updated for Grid Spacing)             │
│    ├── typography-tokens.md                                      │
│    ├── shadow-tokens.md                                          │
│    ├── glow-tokens.md                                            │
│    ├── blend-tokens.md                                           │
│    ├── layering-tokens.md                                        │
│    ├── motion-tokens.md                                          │
│    ├── radius-tokens.md  ◄── NEW (D2.1)                         │
│    ├── border-tokens.md  ◄── NEW (D2.1)                         │
│    ├── opacity-tokens.md  ◄── NEW (D2.2)                        │
│    ├── accessibility-tokens.md  ◄── NEW (D2.2)                  │
│    ├── responsive-tokens.md  ◄── NEW (D2.3)                     │
│    └── semantic-token-structure.md                               │
└─────────────────────────────────────────────────────────────────┘
```

### Information Flow

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Token Quick     │     │  MCP Query       │     │  Full Token      │
│  Reference (D3)  │────►│  (progressive    │────►│  Reference Docs  │
│  ~1,500 tokens   │     │   disclosure)    │     │  (14 docs total) │
│  inclusion:always│     │                  │     │  inclusion:manual│
└──────────────────┘     └──────────────────┘     └──────────────────┘
        │
        │ Routes to correct doc (complete coverage)
        ▼
┌──────────────────┐     ┌──────────────────┐
│  Gap Analysis    │────►│  Tasks 3-5       │
│  (D2) identifies │     │  Fill all gaps   │
│  missing docs    │     │  (5 new docs)    │
└──────────────────┘     └──────────────────┘
```

---

## Components and Interfaces

### D1: Release Management System Steering Doc

**File**: `.kiro/steering/Release Management System.md`

**Front Matter**:
```yaml
---
inclusion: manual
---
```

**Structure**:
```markdown
# Release Management System

## Overview
[High-level purpose and scope]

## Release Pipeline Architecture
[Conceptual diagram of the pipeline]

## Key Concepts
- Completion Documents
- Summary Documents  
- Release Triggers
- Version Bumps
- Release Notes

## Release Flow
[task completion → summary doc → release detection → version bump → release notes]

## Automation vs Manual
[What's automated, what requires human/AI action]

## AI Agent Decision Points
[Where AI agents make choices that affect releases]

## Boundary with Development Workflow
[What's here vs what's in Development Workflow]
```

**Token Target**: ~2,000-3,000 tokens

---

### D2: Token Documentation Gap Analysis

**File**: `.kiro/specs/033-steering-documentation-enhancements/gap-analysis.md`

**Structure**:
```markdown
# Token Documentation Gap Analysis

**Date**: [Execution Date]
**Spec**: 033 - Steering Documentation Enhancements

## Methodology
[How the audit was performed]

## Token Types in Codebase
[List of all token files in src/tokens/]

## Existing Documentation
[List of token docs in .kiro/steering/]

## Gap Analysis

| Token Type | Source File | Documentation | Status |
|------------|-------------|---------------|--------|
| Color      | src/tokens/ColorTokens.ts | color-tokens.md | ✅ Documented |
| Border     | src/tokens/BorderTokens.ts | - | ❌ Missing |
| ...        | ...         | ...           | ...    |

## Recommendations
[Create missing docs in follow-up spec OR note as acceptable gaps]
```

---

### D2.1: Layout Token Documentation

**Files**: 
- `.kiro/steering/radius-tokens.md`
- `.kiro/steering/border-tokens.md`
- `.kiro/steering/spacing-tokens.md` (update)

**Front Matter** (for new files):
```yaml
---
inclusion: manual
---
```

**Structure for radius-tokens.md**:
```markdown
# Radius Tokens

## Overview
[Purpose of radius tokens in the design system]

## Primitive Radius Tokens
[Scale values: none, sm, md, lg, xl, full]
[Mathematical foundation and relationships]

## Semantic Radius Tokens
[Component-specific radius: button, card, input, modal, etc.]
[Usage patterns and when to use each]

## Cross-Platform Considerations
[Web (px/rem), iOS (CGFloat), Android (dp)]
[Platform-specific rendering notes]

## Usage Examples
[Common patterns and combinations]
```

**Structure for border-tokens.md**:
```markdown
# Border Tokens

## Overview
[Purpose of border width tokens]

## Primitive Border Width Tokens
[Scale values: none, thin, medium, thick]

## Semantic Border Width Tokens
[Component-specific: input, card, divider, focus ring]

## Usage Patterns
[Form elements, cards, dividers, focus indicators]

## Cross-Platform Considerations
[Platform-specific border rendering]
```

**Token Target**: ~2,000-3,000 tokens each

---

### D2.2: Effect & Interaction Token Documentation

**Files**:
- `.kiro/steering/opacity-tokens.md`
- `.kiro/steering/accessibility-tokens.md`

**Front Matter**:
```yaml
---
inclusion: manual
---
```

**Structure for opacity-tokens.md**:
```markdown
# Opacity Tokens

## Overview
[Purpose of opacity tokens]

## Primitive Opacity Tokens
[Scale values: 0, 10, 20, ..., 100]

## Semantic Opacity Tokens
[Overlays, disabled states, hover effects, backgrounds]

## Usage Patterns
[Modal overlays, disabled buttons, hover states]

## Accessibility Considerations
[Contrast requirements, visibility concerns]
```

**Structure for accessibility-tokens.md**:
```markdown
# Accessibility Tokens

## Overview
[Purpose of accessibility-focused tokens]

## Focus Indicator Tokens
[Focus ring colors, widths, offsets]

## Tap Area Tokens
[Minimum touch target sizes per WCAG]
[Platform-specific requirements (44pt iOS, 48dp Android)]

## Icon Tokens
[Icon sizing scale]
[Spacing and alignment]

## WCAG 2.1 AA Compliance
[How these tokens support accessibility requirements]

## Usage Patterns
[Interactive elements, touch targets, icon usage]
```

**Token Target**: ~2,000-3,000 tokens each

---

### D2.3: Responsive Token Documentation

**File**: `.kiro/steering/responsive-tokens.md`

**Front Matter**:
```yaml
---
inclusion: manual
---
```

**Structure**:
```markdown
# Responsive Tokens

## Overview
[Purpose of responsive design tokens]

## Breakpoint Tokens
[Screen size breakpoints: xs, sm, md, lg, xl, xxl]
[Media query values and usage]

## Density Tokens
[UI density scaling: compact, normal, comfortable]
[When to use each density level]

## Responsive Design Patterns
[Mobile-first approach]
[Adaptive vs responsive strategies]

## Cross-Platform Considerations
[Web media queries vs native platform breakpoints]
[Platform-specific density handling]
```

**Token Target**: ~2,000-3,000 tokens

---

### D3: Token Quick Reference

**File**: `.kiro/steering/Token Quick Reference.md`

**Front Matter**:
```yaml
---
inclusion: always
---
```

**Structure**:
```markdown
# Token Quick Reference

## Purpose
[Routing table for token documentation - not a reference itself]

## Token Documentation Map

| Token Type | Purpose | MCP Document |
|------------|---------|--------------|
| Color | Semantic color palette | color-tokens.md |
| Spacing | Layout spacing values | spacing-tokens.md |
| Typography | Font styles and sizes | typography-tokens.md |
| Shadow | Elevation shadows | shadow-tokens.md |
| Glow | Glow effects | glow-tokens.md |
| Blend | Color blending | blend-tokens.md |
| Layering | Z-index layers | layering-tokens.md |
| Motion | Animation timing | motion-tokens.md |
| Radius | Corner rounding | radius-tokens.md |
| Border | Border widths | border-tokens.md |
| Opacity | Transparency values | opacity-tokens.md |
| Accessibility | Focus, tap areas, icons | accessibility-tokens.md |
| Responsive | Breakpoints, density | responsive-tokens.md |
| Semantic Structure | Token architecture | semantic-token-structure.md |

## Common Patterns
[Most frequently used token combinations]

## MCP Query Examples
```
get_document_summary({ path: ".kiro/steering/color-tokens.md" })
get_section({ path: ".kiro/steering/spacing-tokens.md", heading: "Spacing Scale" })
```
```

**Token Target**: ~1,000-1,500 tokens

---

### D4: docs/tokens/ README

**File**: `docs/tokens/README.md`

**Structure**:
```markdown
# Token Documentation

Token documentation has moved to `.kiro/steering/` for MCP integration.

## Why the Change

Spec 032 (Documentation Architecture Audit) consolidated token documentation 
into the steering system to enable progressive disclosure via MCP.

## How to Access Token Docs

### For AI Agents
Query via MCP:
```
get_document_summary({ path: ".kiro/steering/color-tokens.md" })
```

See `.kiro/steering/Token Quick Reference.md` for the complete routing table.

### For Human Developers
Token documentation files are located in `.kiro/steering/`:
- color-tokens.md
- spacing-tokens.md
- typography-tokens.md
- [etc.]
```

---

### D5: Meta-guide Updates

**File**: `.kiro/steering/00-Steering Documentation Directional Priorities.md`

**Implementation Constraint**: Updates MUST use bash commands only. AI agents MUST NOT read the full file.

**Updates Required**:

1. **Add Token Quick Reference to Tier 1** (Always-Loaded Documents section)
2. **Add Release Management System to Tier 2** (MCP-Only Documents section)

**Approach**:
```bash
# 1. Find insertion point for Tier 1
grep -n "Documents to Read Completely" .kiro/steering/00-Steering*.md

# 2. Use sed to insert Token Quick Reference entry after marker

# 3. Find insertion point for Tier 2  
grep -n "MCP-Only Documents" .kiro/steering/00-Steering*.md

# 4. Use sed to insert Release Management System entry after marker

# 5. Verify changes with targeted grep (not full file read)
```

---

## Data Models

This spec creates documentation artifacts, not code. No data models required.

---

## Error Handling

### Gap Analysis Edge Cases

- **No gaps found**: Report "Token documentation is complete" - proceed to D3
- **Gaps found**: Tasks 3-5 fill all identified gaps before D3 creation

### Token Documentation Creation

- **Source file not found**: Log error, skip that token type, document in completion notes
- **Existing doc conflict**: Review existing doc, update rather than replace
- **Token count exceeded**: Trim content, focus on essential information

### Meta-guide Update Failures

- **Insertion point not found**: Log error, provide manual instructions
- **Sed command fails**: Provide manual patch instructions
- **Verification fails**: Human review required

---

## Testing Strategy

### Validation Approach

Since this spec creates documentation (not code), validation focuses on:

1. **Structure Validation**: Documents follow specified structure
2. **Token Count Validation**: D1 and D3 meet token targets
3. **Cross-Reference Validation**: Links between docs work correctly
4. **MCP Integration**: New docs queryable via MCP after creation

### Acceptance Testing

| Requirement | Validation Method |
|-------------|-------------------|
| R1 (Release Management) | Manual review of content coverage |
| R2 (Gap Analysis) | Verify all src/tokens/ files audited |
| R3 (Token Quick Reference) | Token count check, MCP query test |
| R4 (README) | File exists with required content |
| R5 (Meta-guide) | Grep verification of new entries |
| R6 (Fill Gaps) | Verify all 5 new docs exist with correct structure |

---

## Design Decisions

### Decision 1: Release Management as MCP-Only (inclusion: manual)

**Options Considered**:
- `inclusion: always` - Always loaded for all tasks
- `inclusion: conditional` - Loaded based on file patterns
- `inclusion: manual` - MCP-queryable on demand

**Decision**: `inclusion: manual`

**Rationale**: 
- Release system understanding isn't needed for every task
- Keeps always-loaded context lean (~2,000-3,000 tokens saved)
- Agents can query when doing task completion work
- Follows pattern of other conceptual docs (Spec Planning Standards, etc.)

**Trade-offs**: Agents must know to query it; mitigated by meta-guide entry

---

### Decision 2: Token Quick Reference as Always-Loaded

**Options Considered**:
- `inclusion: manual` - Query via MCP like other token docs
- `inclusion: always` - Always available

**Decision**: `inclusion: always`

**Rationale**:
- Small size (~1,000-1,500 tokens) makes it sustainable
- Routing table needed frequently during component work
- Enables efficient MCP queries by pointing to right doc
- Reduces "which doc do I query?" friction

**Trade-offs**: Adds to always-loaded context; acceptable given small size

---

### Decision 3: Gap Analysis as Spec Artifact (Not Steering Doc)

**Options Considered**:
- Create as steering doc in `.kiro/steering/`
- Create as spec artifact in `.kiro/specs/033-*/`

**Decision**: Spec artifact

**Rationale**:
- Gap analysis is a point-in-time audit, not ongoing guidance
- Doesn't need MCP integration or inclusion settings
- Belongs with spec that created it for traceability
- May become outdated as gaps are filled

**Trade-offs**: Less discoverable; acceptable since it's a one-time artifact

---

### Decision 4: Bash-Only Meta-guide Updates

**Options Considered**:
- Read file, modify, write back (standard approach)
- Bash-only targeted insertions (grep, sed)

**Decision**: Bash-only

**Rationale**:
- Meta-guide is ~16,000+ tokens - reading it hits context caps
- Targeted insertions are safer (less chance of corruption)
- Grep verification confirms changes without full read
- Follows existing constraint documented in design-outline

**Trade-offs**: More complex implementation; necessary for context safety

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do.*

### Property Analysis

This spec creates documentation artifacts rather than code. Most acceptance criteria are:
- **Content quality checks** requiring human judgment (not automatable)
- **Specific examples** verifiable by file existence or grep (not universal properties)

Only one criterion qualifies as a true property:

### Property 1: Token Quick Reference Size Constraint

*For any* valid Token Quick Reference document, the token count SHALL be between 1,000 and 1,500 tokens.

**Validates: Requirements 3.5**

**Rationale**: This is a universal constraint that must hold regardless of content variations. If the document grows beyond 1,500 tokens, it defeats the purpose of being a lightweight routing table.

**Test Approach**: Count tokens in the final document and verify within range.

### Verification Examples (Not Properties)

The remaining testable criteria are examples that can be verified via scripts:

| Criterion | Verification Method |
|-----------|---------------------|
| 1.6, 3.6 | `grep "inclusion:" <file>` - verify front matter |
| 2.4, 4.1 | `test -f <path>` - verify file exists |
| 4.2, 4.3, 4.4 | `grep "<expected content>" <file>` - verify content |
| 5.1, 5.2 | `grep "<new entry>" meta-guide` - verify updates |

These are not properties because they test specific instances, not universal behaviors.

---

*Design complete. Ready for tasks phase.*
