# Design Outline: Steering Documentation Audit

**Date**: 2026-01-03
**Purpose**: Plan comprehensive audit of steering documentation for Stemma alignment, token optimization, redundancy elimination, and testing standards integration
**Organization**: spec-guide
**Scope**: 036-steering-documentation-audit

---

## Problem Statement

The steering documentation has grown organically as DesignerPunk evolved. This has resulted in:

1. **Legacy naming references** - `<dp-icon>`, `TextInputField`, "Legacy Icon" patterns persist despite Stemma System adoption
2. **High token load** - Some docs exceed 16K tokens, expensive for AI context
3. **Content redundancy** - Similar guidance repeated across multiple documents
4. **Buried testing standards** - Test guidance exists but isn't surfaced where agents plan work

---

## Audit Scope

### Documents to Audit (55 total)

#### Layer 0 - Meta (1 doc)
- `00-Steering Documentation Directional Priorities.md` - Meta-guide for steering system

#### Layer 1 - Foundational (4 docs)
- `Personal Note.md` - Collaboration principles
- `Start Up Tasks.md` - Essential task checklist
- `Core Goals.md` - Project context
- `A Vision of the Future.md` - DesignerPunk vision

#### Layer 2 - Frameworks (6 docs)
- `Development Workflow.md` - Task completion workflow (~16K tokens)
- `File Organization Standards.md` - File organization (~16K tokens)
- `Spec Planning Standards.md` - Spec creation guidance
- `Release Management System.md` - Release pipeline
- `Test Development Standards.md` - Testing patterns
- `Test Failure Audit Methodology.md` - Test failure investigation

#### Layer 3 - Domain-Specific

**Token Documentation (14 docs)**
- `Token Quick Reference.md`
- `Token Resolution Patterns.md`
- `color-tokens.md`
- `typography-tokens.md`
- `spacing-tokens.md`
- `shadow-tokens.md`
- `glow-tokens.md`
- `blend-tokens.md`
- `border-tokens.md`
- `radius-tokens.md`
- `opacity-tokens.md`
- `motion-tokens.md`
- `layering-tokens.md`
- `responsive-tokens.md`
- `accessibility-tokens.md`

**Component Documentation (18 docs)**
- `Component Development and Practices Guide.md`
- `Component Quick Reference.md`
- `component-family-development-standards.md`
- `component-family-inheritance-structures.md`
- `component-family-templates.md`
- `component-readiness-status-system.md`
- `component-schema-format.md`
- `mcp-component-family-document-template.md`
- `stemma-system-principles.md`
- `platform-implementation-guidelines.md`
- `primitive-vs-semantic-usage-philosophy.md`
- `Cross-Platform vs Platform-Specific Decision Framework.md`
- Family-specific: `icon-components.md`, `button-components.md`, `container-components.md`, `form-inputs-components.md`, `avatar-components.md`, `badge-components.md`, `divider-components.md`, `loading-components.md`, `modal-components.md`, `navigation-components.md`, `data-display-components.md`

**Infrastructure (4 docs)**
- `Browser Distribution Guide.md`
- `BUILD-SYSTEM-SETUP.md`
- `Technology Stack.md`
- `behavioral-contract-validation-framework.md`
- `Task-Type-Definitions.md`

---

## Audit Dimensions

### 1. Stemma Alignment Audit

**Goal**: Eliminate legacy naming, embrace current Stemma System architecture

**Legacy Patterns to Find & Replace**:
| Legacy Pattern | Stemma Replacement |
|----------------|-------------------|
| `<dp-icon>` | `<icon-base>` |
| `<dp-container>` | `<container-base>` |
| `TextInputField` | `Input-Text-Base` |
| "Legacy Icon" | Remove or clarify as backward-compat only |
| `DPIcon` class references | `IconBaseElement` |

**Documents with Known Legacy References**:
- `icon-components.md` - "Legacy Icon typealias", `<dp-icon>`
- `container-components.md` - `<dp-container>` legacy
- `Browser Distribution Guide.md` - Dual tag documentation
- `Test Development Standards.md` - `dp-icon` in examples
- `Spec Planning Standards.md` - `<dp-icon>` API examples
- `Component Development and Practices Guide.md` - Mixed naming
- `blend-tokens.md` - `TextInputField` references

**Decision**: No legacy support. DesignerPunk has no external customers, so backward compatibility documentation is unnecessary scope and only acts as a burden. All legacy naming should be removed or replaced with Stemma equivalents.

### 2. Token Optimization Audit

**Goal**: Reduce context load without compromising execution quality

**Metrics to Capture**:
- Current token count per document
- Essential vs. conditional content ratio
- Cross-reference density
- Redundancy with other docs

**Optimization Strategies**:
1. **Aggressive conditional loading** - More sections marked as "load when needed"
2. **Content consolidation** - Merge related small docs
3. **Reference over repetition** - Link to canonical source instead of duplicating
4. **Summary + detail pattern** - Brief inline, full via MCP query

**High-Priority Targets** (known large docs):
- `Development Workflow.md` (~16K tokens)
- `File Organization Standards.md` (~16K tokens)
- `Spec Planning Standards.md` (size TBD)
- `Component Development and Practices Guide.md` (size TBD)

### 3. Redundancy Elimination Audit

**Goal**: DRY up repeated content, establish single sources of truth

**Suspected Redundancy Areas**:
1. **Task completion workflow** - Appears in Development Workflow, Start Up Tasks, possibly others
2. **Validation tiers** - Defined in Spec Planning, referenced elsewhere
3. **Testing patterns** - Split between Test Development Standards and Spec Planning
4. **Component family patterns** - Multiple component-family-* docs with overlap
5. **Token usage guidance** - Scattered across token docs and Component Development Guide

**Consolidation Candidates**:
- Could `Task-Type-Definitions.md` merge into `Spec Planning Standards.md`?
- Could component family docs consolidate into fewer, more focused guides?
- Could token docs share a common structure template?

### 4. Testing Standards Integration Audit

**Goal**: Surface testing guidance where agents plan work - design phase for code-producing specs

**Current State**:
- `Test Development Standards.md` exists but is MCP-only
- `Spec Planning Standards.md` defines validation tiers but limited testing guidance
- `Test Failure Audit Methodology.md` is investigation-focused, not planning-focused

**Simple Rule**:

> **If the spec produces code, review Test Development Standards at design phase.**

**How to determine "produces code":**
- Task types include Implementation or Architecture → produces code → load Test Development Standards
- Task types are only Setup or Documentation → no code → skip Test Development Standards

This aligns with the existing Task Type Classification system.

**Workflow**:

```
Design Phase
    ↓
Will this spec produce code? (Implementation/Architecture tasks)
    ↓ YES
Query Test Development Standards via MCP
    ↓
Inform correctness properties and testing strategy
```

**Integration Points**:
1. **Design Phase** - Query Test Development Standards when spec produces code
2. **Correctness Properties** - Informed by testing patterns and PBT guidance
3. **Validation Tiers** - Link tier definitions to concrete test expectations
4. **Tasks Phase** - Test implementation tasks reference design properties

**Example**: This steering audit spec has only Documentation tasks → no Test Development Standards needed.

### 5. Naming Convention Audit

**Goal**: Uniform file naming with categorical prefixes for related document families

**Current State** (inconsistent):
| Pattern | Examples |
|---------|----------|
| Title Case with spaces | `Core Goals.md`, `Personal Note.md`, `Development Workflow.md` |
| kebab-case | `icon-components.md`, `color-tokens.md`, `blend-tokens.md` |
| ALL CAPS | `BUILD-SYSTEM-SETUP.md` |
| Mixed | `Component Development and Practices Guide.md` |

**Target Convention**: **Kebab-Title-Case with categorical prefixes for related families**

**Rationale**:
- Kebab-Title-Case is readable while CLI-friendly
- Categorical prefixes group related docs in file explorers
- MCP queries become intuitive: "give me all `Token-*` docs"
- Clear at-a-glance what a doc is about

**Prefix Application Rule**: Apply categorical prefixes where there's a clear family (3+ related docs). Leave standalone docs unprefixed.

#### Category Prefix Definitions

| Prefix | Definition | When to Use |
|--------|------------|-------------|
| `Token-` | Design token documentation | Docs explaining specific token types |
| `Component-Family-` | Component family specifications | Docs for specific component families (Icon, Button, etc.) |
| `Component-` | Component system infrastructure | Docs about component architecture, schemas, patterns |
| `Process-` | How we do things | Workflows, methodologies, procedures |
| `Standard-` | Rules and requirements | Specifications that must be followed |
| `Guide-` | How-to and reference | Practical guidance, tutorials, quick references |

**Key Distinctions**:
- **Process** = "Here's the workflow to follow" (Development Workflow, Release Management)
- **Standard** = "Here are the rules" (File Organization Standards, Spec Planning Standards)
- **Guide** = "Here's how to do X" (Component Development Guide, Browser Distribution Guide)

#### Rename Examples by Category

**Token Docs (14 docs → `Token-` prefix)**:
| Current | Target |
|---------|--------|
| `blend-tokens.md` | `Token-Blend.md` |
| `color-tokens.md` | `Token-Color.md` |
| `typography-tokens.md` | `Token-Typography.md` |
| `Token Quick Reference.md` | `Token-Quick-Reference.md` |

**Component Family Docs (11 docs → `Component-Family-` prefix)**:
| Current | Target |
|---------|--------|
| `icon-components.md` | `Component-Family-Icon.md` |
| `button-components.md` | `Component-Family-Button.md` |
| `form-inputs-components.md` | `Component-Family-Inputs.md` |

**Component Infrastructure Docs (8 docs → `Component-` prefix)**:
| Current | Target |
|---------|--------|
| `component-schema-format.md` | `Component-Schema-Format.md` |
| `stemma-system-principles.md` | `Component-Stemma-Principles.md` |
| `component-readiness-status-system.md` | `Component-Readiness-Status.md` |

**Process Docs (→ `Process-` prefix)**:
| Current | Target |
|---------|--------|
| `Development Workflow.md` | `Process-Development-Workflow.md` |
| `Release Management System.md` | `Process-Release-Management.md` |

**Standard Docs (→ `Standard-` prefix)**:
| Current | Target |
|---------|--------|
| `File Organization Standards.md` | `Standard-File-Organization.md` |
| `Spec Planning Standards.md` | `Standard-Spec-Planning.md` |

**Guide Docs (→ `Guide-` prefix)**:
| Current | Target |
|---------|--------|
| `Component Development and Practices Guide.md` | `Guide-Component-Development.md` |
| `Browser Distribution Guide.md` | `Guide-Browser-Distribution.md` |

**Standalone Docs (no prefix - foundational/unique)**:
| Current | Target |
|---------|--------|
| `00-Steering Documentation Directional Priorities.md` | `00-Steering-Documentation-Directional-Priorities.md` |
| `Personal Note.md` | `Personal-Note.md` |
| `Core Goals.md` | `Core-Goals.md` |
| `Start Up Tasks.md` | `Start-Up-Tasks.md` |
| `A Vision of the Future.md` | `A-Vision-Of-The-Future.md` |
| `Technology Stack.md` | `Technology-Stack.md` |

#### Reference Update Requirements

When renaming files, we MUST update all non-historical references:

**Hard References (links)**:
- **Update**: Active steering docs that link to renamed files
- **Update**: `00-Steering-Documentation-Directional-Priorities.md` (meta-guide)
- **Update**: Spec documents with active references
- **Update**: MCP server will re-index automatically

**Soft References (prose mentions)**:
- **Update**: Any prose that mentions doc names (e.g., "refer to Development Workflow for...")
- **Preserve**: Historical context in completion docs (documents what existed at that time)

### 6. File Structure Audit

**Goal**: Identify opportunities to break monolithic docs into focused files for better MCP queryability and conditional loading

**NOTE**: These are **candidates to evaluate during discovery**, not execution decisions. Actual splitting decisions will be made after reviewing audit findings.

**Potential Candidates for Evaluation**:

**`Development Workflow.md` (~16K tokens)** - Evaluate whether splitting would improve:
- Conditional loading efficiency
- MCP query precision
- Maintenance burden

**`File Organization Standards.md` (~16K tokens)** - Evaluate whether splitting would improve:
- Conditional loading efficiency
- MCP query precision
- Maintenance burden

**Evaluation Criteria** (to apply during analysis):
- Is content conditionally loaded (marked with "📖 CONDITIONAL SECTION")?
- Is content rarely needed (troubleshooting, edge cases)?
- Could content be queried independently via MCP?
- Would splitting reduce always-loaded token count significantly?

**Decision Point**: File splitting decisions made at Checkpoint 2 (after discovery, before implementation planning).

### 7. Audit Methodologies Reframe

**Goal**: Generalize `Test Failure Audit Methodology.md` into reusable audit patterns

**Current State**: `Test Failure Audit Methodology.md` contains valuable patterns that apply beyond test failures:
- Human-Agent checkpoints
- Systematic investigation steps
- Evidence gathering
- Decision trees
- Clean exit requirements

**Proposed Reframe**: `audit-methodologies.md` with sections:
1. **General Audit Principles** - Human-Agent checkpoints, evidence gathering, decision trees
2. **Test Failure Audits** - Current content, specific to test investigation
3. **Documentation Audits** - Patterns for this steering audit (new)
4. **Component Audits** - Patterns for component health checks (future)
5. **Performance Audits** - Patterns for performance investigation (future)

**Human-Agent Checkpoints for This Audit**:
- Checkpoint 1: Review discovery findings before analysis
- Checkpoint 2: Review recommendations before implementation planning
- Checkpoint 3: Review task list before execution begins

---

## Proposed Audit Methodology

### Phase 1: Discovery & Metrics
1. Calculate token counts for all 55 documents → **capture in separate tracking doc only**
2. Identify all legacy naming instances
3. Map cross-references between documents
4. Identify content overlap/redundancy
5. Assess current context load percentage at session start

### Phase 2: Analysis & Recommendations
1. Prioritize documents by impact (load frequency × token count)
2. Propose consolidation targets
3. Define Stemma alignment changes
4. Design testing integration approach

### Phase 3: Implementation Planning
1. Create task list for updates
2. Define validation criteria
3. Establish rollback strategy (steering docs are critical)

---

## Decisions Made

1. **Backward Compatibility Scope**: No legacy support. DesignerPunk has no external customers, so backward compatibility documentation is unnecessary scope. All legacy naming removed.

2. **Component Family Docs**: Keep separate. These docs use `inclusion: manual`, so they're not a load burden. Separate docs enable precise MCP queryability.

3. **Testing in Spec Workflow**: Design phase is the primary integration point. Simple rule: if spec produces code (Implementation/Architecture tasks), review Test Development Standards at design phase.

4. **Token Budget**: Soft aspiration of ~25% context usage at session start (currently ~40-45%). This is NOT a hard requirement - quality and effectiveness take priority over satisfying a metric.

5. **Token Count Tracking**: Audit all 55 docs, but token counts captured in a **separate tracking document only** - never burden steering docs with metrics about themselves.

6. **Naming Convention**: Kebab-Title-Case with categorical prefixes for related families (3+ docs). Prefixes: `Token-`, `Component-Family-`, `Component-`, `Process-`, `Standard-`, `Guide-`. Standalone foundational docs remain unprefixed. Both hard references (links) and soft references (prose mentions) must be updated.

7. **File Splitting**: Open to breaking monolithic docs into focused files, but specific splits are **candidates to evaluate**, not pre-determined decisions. Actual splitting decisions made after reviewing audit findings at Checkpoint 2.

8. **Audit Methodologies Reframe**: Reframe `Test Failure Audit Methodology.md` to `audit-methodologies.md` with test failures as a subsection. The Human-Agent checkpoint pattern and systematic investigation steps are reusable for all audit types.

9. **Meta-Guide Access**: The meta-guide (`00-Steering Documentation Directional Priorities.md`) MUST be reviewed, audited, and edited via **bash commands ONLY**. Do NOT read the file directly using file read tools - this prevents context pollution since the meta-guide is always loaded.

10. **Batched Audit Execution**: Large files will be audited in batches to avoid context load caps. The audit will be structured to process documents in manageable groups rather than attempting to load all 55 docs simultaneously.

## Open Questions

1. **MCP Query Optimization**: Should more docs move to MCP-only access? What's the right balance between always-loaded and query-on-demand?

2. **Redundancy Resolution**: When content exists in multiple places, which doc becomes the canonical source?

3. **Edge Case Categorization**: Some docs (e.g., `BUILD-SYSTEM-SETUP.md`, `Task-Type-Definitions.md`) may not clearly fit existing categories. Final categorization decisions deferred to audit findings - the "3+ files for a category" rule will guide these decisions.

---

## Success Criteria

1. **Zero legacy naming** in all steering docs - no backward compatibility exceptions
2. **Soft aspiration: ~25% context load** at session start (down from ~40-45%), quality over metrics
3. **Single source of truth** for each concept (no redundant definitions)
4. **Testing guidance integrated** into design phase of spec workflow
5. **All docs pass metadata validation** via MCP server
6. **Token metrics tracked separately** - steering docs contain no self-referential metrics

---

## Next Steps

1. Review this outline with Peter
2. Refine scope based on feedback
3. Proceed to full requirements document
4. Execute phased audit

