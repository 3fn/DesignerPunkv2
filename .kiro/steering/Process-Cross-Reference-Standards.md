---
inclusion: manual
---

# Process-Cross-Reference-Standards

**Date**: 2026-01-03
**Last Reviewed**: 2026-01-03
**Purpose**: Comprehensive guide for creating and maintaining cross-references in documentation
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: all-tasks

---

## Overview

Cross-references are markdown links that connect related documentation, enabling efficient navigation between guides, specs, completion documents, and other active documentation. This document defines when and how to use cross-references to create a well-connected documentation network while maintaining clean, focused production code.

**Key Principle**: Cross-references belong in documentation, NOT in production code. They enhance navigation and discoverability without cluttering implementation files.

---

## When to Use Cross-References

Cross-references MUST be used in the following documentation types:

- **Documentation Guides**: Spec-specific guides that explain implementation patterns (e.g., `.kiro/specs/[spec-name]/[guide-name].md`)
- **Spec Documents**: Requirements, design, and tasks documents in `.kiro/specs/[spec-name]/`
- **Completion Documents**: Task completion documentation in `.kiro/specs/[spec-name]/completion/`
- **README Files**: Project and directory README files that provide navigation and context
- **Overview Documents**: Master documents that map components to their documentation (e.g., `docs/token-system-overview.md`)
- **Process Documentation**: Standards and methodology documents in `.kiro/steering/` and `docs/processes/`

**Rationale**: These are documentation artifacts where cross-references add value by helping readers discover related information and navigate between connected concepts.

---

## When NOT to Use Cross-References

Cross-references MUST NOT be used in the following production code files:

- **Token Definition Files**: Files like `FontSizeTokens.ts`, `TypographyTokens.ts`, `SpacingTokens.ts`
- **Component Implementation Files**: React components, SwiftUI views, Jetpack Compose components
- **Utility Function Files**: Helper functions, validators, converters, generators
- **Type Definition Files**: TypeScript interfaces and type definitions
- **Configuration Files**: Build configs, test configs, linting configs

**Rationale**: Production code should be focused on implementation, not documentation navigation. Code comments should be brief and implementation-focused. Architectural rationale and design decisions belong in documentation guides, not in code files. Cross-references in code create noise and distract from the implementation.

---

## Documentation vs Code Distinction

The key distinction is between **documentation** (where cross-references belong) and **production code** (where they don't):

### Documentation Purpose
- Explain concepts, provide context, connect related ideas, guide understanding
- Cross-references help readers navigate between related documentation
- Links provide efficient discovery of relevant information
- Navigation aids enhance learning and comprehension

### Code Purpose
- Implement functionality, execute logic, deliver features
- Code comments should be brief and implementation-focused
- Architectural rationale belongs in documentation guides, not code
- Cross-references in code create maintenance burden and distraction

### Example - CORRECT Usage (Documentation)

```markdown
# Typography Token Guide

## Related Guides

- [Compositional Color Guide](./compositional-color-guide.md) - Explains why typography tokens don't include color
- [Strategic Flexibility Guide](./strategic-flexibility-guide.md) - Explains size variant decisions

## Typography Token Architecture

Typography tokens combine fontSize, lineHeight, fontFamily, fontWeight, and letterSpacing primitives...
```

### Example - INCORRECT Usage (Production Code)

```typescript
// ❌ WRONG - Don't add cross-references in production code
/**
 * Typography tokens for the design system.
 * 
 * For architectural rationale, see:
 * - .kiro/specs/typography-token-expansion/compositional-color-guide.md
 * - .kiro/specs/typography-token-expansion/strategic-flexibility-guide.md
 */
export const TypographyTokens = {
  body: { fontSize: 16, lineHeight: 24, ... }
};

// ✅ CORRECT - Brief, implementation-focused comment
/**
 * Typography tokens combining fontSize, lineHeight, fontFamily, fontWeight, and letterSpacing.
 */
export const TypographyTokens = {
  body: { fontSize: 16, lineHeight: 24, ... }
};
```

---

## How to Format Cross-References

Cross-references should follow consistent formatting patterns to ensure clarity and maintainability.

### Relative Path Usage

Always use relative paths from the current document location. Relative paths ensure links remain valid when the repository structure changes or when viewing documentation in different contexts.

**Pattern**: Use `../` to navigate up directories and `./` for same-directory references

**Examples**:
```markdown
# From .kiro/specs/spec-a/guide.md to .kiro/specs/spec-b/guide.md
[Related Guide](../spec-b/guide.md)

# From docs/overview.md to .kiro/specs/spec-a/guide.md
[Implementation Guide](../.kiro/specs/spec-a/guide.md)

# From .kiro/specs/spec-a/guide-1.md to .kiro/specs/spec-a/guide-2.md
[Related Guide](./guide-2.md)
```

**Rationale**: Relative paths work across different viewing contexts (GitHub, local filesystem, documentation sites) and remain valid when the repository is cloned or moved.

### Section Anchor Usage

Link to specific sections within documents using markdown section anchors. Section anchors are automatically generated from heading text by converting to lowercase and replacing spaces with hyphens.

**Pattern**: `[Link Text](./document.md#section-name)`

**Examples**:
```markdown
# Link to section in same directory
[Compositional Architecture](./compositional-color-guide.md#compositional-architecture)

# Link to section in parent directory
[Design Decisions](../design.md#design-decisions)

# Link to section in different spec
[Three-Tier Validation](../cross-platform-build-system/design.md#three-tier-validation-system)
```

**Rationale**: Section anchors enable precise navigation to relevant content within longer documents, improving reader efficiency and reducing cognitive load.

### Descriptive Link Text with Relevance Explanation

Use descriptive link text that clearly identifies the target document, followed by a brief explanation of why the link is relevant. This pattern helps readers decide whether to follow the link.

**Pattern**: `[Descriptive Document Name](./path/to/document.md) - Brief explanation of relevance`

**Examples**:
```markdown
# ✅ GOOD - Explains relevance
[Strategic Flexibility Guide](./strategic-flexibility-guide.md) - Explains why labelXs exists but bodyXs doesn't
[Migration Guide](./migration-guide.md) - Provides migration path for renamed tokens
[Compositional Color Guide](./compositional-color-guide.md) - Explains why typography tokens don't include color

# ❌ BAD - No context for relevance
[Strategic Flexibility Guide](./strategic-flexibility-guide.md)
[Click here](./migration-guide.md)
[See this document](./compositional-color-guide.md)
```

**Rationale**: Relevance explanations help readers understand the relationship between documents and make informed decisions about which links to follow, improving documentation navigation efficiency.

### "Related Guides" Section Format

Group multiple cross-references in a dedicated section at the beginning or end of the document. Use consistent section naming ("Related Guides" for guides, "Related Documentation" for broader references) and format each link as a list item.

**Pattern**:
```markdown
## Related Guides

- [Document Name](./path/to/document.md) - Relevance explanation
- [Document Name](./path/to/document.md) - Relevance explanation
- [Document Name](./path/to/document.md) - Relevance explanation

---

## [Main Content Section]
```

**Complete Example**:
```markdown
# Typography Token Architecture Guide

**Date**: 2025-10-22
**Purpose**: Explain typography token composition and design decisions
**Organization**: spec-guide
**Scope**: typography-token-expansion

---

## Related Guides

- [Compositional Color Guide](./compositional-color-guide.md) - Explains why typography tokens don't include color
- [Strategic Flexibility Guide](./strategic-flexibility-guide.md) - Explains size variant decisions (labelXs vs bodyXs)
- [Inline Emphasis Guide](./inline-emphasis-guide.md) - Explains platform-native emphasis patterns
- [Migration Guide](./migration-guide.md) - Provides migration path for renamed tokens

---

## Typography Token Composition

Typography tokens combine multiple primitive tokens to create semantic typography styles...

[Main content continues...]
```

**Rationale**: Grouping related links in a dedicated section provides clear navigation points without interrupting the main content flow. Placing the section at the beginning helps readers discover related documentation before diving into the current document.

---

## Common Cross-Reference Patterns

This section documents the three most common cross-reference patterns used in DesignerPunk documentation.



### Pattern 1: Guide-to-Guide (Related Concepts)

**Use Case**: Connect documentation guides that discuss related concepts, enabling readers to navigate between guides that explain different aspects of the same system or feature.

**When to Use**:
- Linking between spec-specific guides within the same spec
- Connecting guides that explain complementary architectural concepts
- Referencing guides that provide additional context for design decisions
- Creating bidirectional navigation between related documentation

**Markdown Syntax**:
```markdown
# Compositional Color Guide

**Date**: 2025-10-22
**Purpose**: Explain compositional color architecture in typography tokens
**Organization**: spec-guide
**Scope**: typography-token-expansion

---

## Related Guides

- [Strategic Flexibility Guide](./strategic-flexibility-guide.md) - Explains size variant decisions related to compositional architecture
- [Inline Emphasis Guide](./inline-emphasis-guide.md) - Explains why emphasis isn't in tokens, relates to compositional architecture
- [Migration Guide](./migration-guide.md) - Provides migration path for renamed tokens

---

## Compositional Architecture

Typography tokens follow a compositional architecture where properties are separated by concern.
Instead of including color properties in typography tokens, color is applied separately through
semantic color tokens. This allows the same typography token to be used with different colors
in different contexts.

[Guide content continues...]
```

**Key Elements**:
- **Related Guides section**: Placed at the beginning after metadata
- **Relative paths**: Use `./` for same-directory references
- **Relevance explanations**: Brief description of why each guide is relevant
- **Separator**: Use `---` to separate Related Guides from main content
- **Bidirectional**: Each guide should reference related guides that reference it back

### Pattern 2: Completion-to-Guide (Created Artifacts)

**Use Case**: Link from task completion documents to the documentation guides they created, providing traceability from implementation to documentation.

**When to Use**:
- Completion documents that created new documentation guides
- Completion documents that updated existing guides
- Linking to guides that explain the architectural decisions made during the task
- Providing navigation from implementation notes to conceptual documentation

**Markdown Syntax**:
```markdown
# Task 2.3 Completion: Create Typography Guides

**Date**: 2025-10-22
**Task**: 2.3 Create typography documentation guides
**Type**: Implementation
**Status**: Complete

---

## Artifacts Created

- `.kiro/specs/typography-token-expansion/compositional-color-guide.md` - Guide explaining compositional color architecture
- `.kiro/specs/typography-token-expansion/strategic-flexibility-guide.md` - Guide explaining size variant decisions

## Implementation Details

Created documentation guides to explain typography token architecture and design decisions.
Each guide focuses on a specific aspect of the typography token system, with cross-references
connecting related concepts.

[Implementation details continue...]

## Related Documentation

- [Compositional Color Guide](../compositional-color-guide.md) - Created by this task, explains compositional architecture
- [Strategic Flexibility Guide](../strategic-flexibility-guide.md) - Created by this task, explains size variant decisions
```

**Key Elements**:
- **Artifacts Created section**: Lists all files created with descriptions
- **Related Documentation section**: Links to guides created by the task
- **Relative paths**: Use `../` to navigate from completion/ directory to parent directory
- **Relevance explanations**: Indicate the guide was created by this task and briefly describe its purpose

### Pattern 3: Overview-to-Guide (Documentation Navigation)

**Use Case**: Link from overview documents (like Token System Overview, README files, or system catalogs) to detailed documentation guides.

**When to Use**:
- Overview documents that map system components to their documentation
- README files that provide navigation to detailed guides
- System catalogs that link to component-specific documentation
- Master documents that serve as documentation entry points

**Markdown Syntax**:
```markdown
# Token System Overview

**Date**: 2025-10-22
**Purpose**: Master document mapping token files to their documentation
**Organization**: framework-strategic
**Scope**: cross-project

---

## Semantic Tokens

### Typography Tokens

- **File**: `src/tokens/semantic/TypographyTokens.ts`
- **Description**: Semantic typography tokens combining fontSize, lineHeight, fontFamily, fontWeight, and letterSpacing primitives
- **Related Guides**:
  - [Compositional Color Guide](../.kiro/specs/typography-token-expansion/compositional-color-guide.md) - Explains why typography tokens don't include color
  - [Strategic Flexibility Guide](../.kiro/specs/typography-token-expansion/strategic-flexibility-guide.md) - Explains size variant decisions

## Related Documentation

- [Token Architecture Overview](./README.md) - High-level token system architecture
- [Cross-Platform Build System](../.kiro/specs/cross-platform-build-system/design.md) - Token generation and platform conversion
```

**Key Elements**:
- **Structured sections**: Organize by category (Primitive, Semantic)
- **File paths**: Include actual file paths for each type
- **Related Guides subsection**: Links to guides that explain the type
- **Relative paths**: Use appropriate relative paths from overview document location
- **Relevance explanations**: Describe what each guide explains

---

## Anti-Patterns to Avoid

This section documents common anti-patterns in cross-reference usage and provides clear examples of what NOT to do.

### Anti-Pattern 1: Cross-References in Production Code

**Problem**: Adding cross-references to documentation in production code files creates noise, maintenance burden, and distracts from implementation.

**Why This is Wrong**:
- Production code should be focused on implementation, not documentation navigation
- Code comments should be brief and implementation-focused
- Architectural rationale belongs in documentation guides, not code files
- Cross-references in code create maintenance burden when documentation moves
- Links in code comments don't provide value to developers reading the code

**Example - INCORRECT Usage**:

```typescript
// ❌ WRONG - Cross-references in production code
/**
 * Typography tokens for the design system.
 * 
 * Architecture Documentation:
 * - See .kiro/specs/typography-token-expansion/compositional-color-guide.md
 *   for explanation of why typography tokens don't include color
 * - See .kiro/specs/typography-token-expansion/strategic-flexibility-guide.md
 *   for explanation of size variant decisions
 */
export const TypographyTokens = {
  body: { fontSize: 16, lineHeight: 24, fontFamily: 'system-ui', fontWeight: 400, letterSpacing: 0 },
  label: { fontSize: 14, lineHeight: 20, fontFamily: 'system-ui', fontWeight: 500, letterSpacing: 0 }
};
```

**Example - CORRECT Usage**:

```typescript
// ✅ CORRECT - Brief, implementation-focused comment
/**
 * Typography tokens combining fontSize, lineHeight, fontFamily, fontWeight, and letterSpacing.
 * Tokens follow compositional architecture with semantic naming.
 */
export const TypographyTokens = {
  body: { fontSize: 16, lineHeight: 24, fontFamily: 'system-ui', fontWeight: 400, letterSpacing: 0 },
  label: { fontSize: 14, lineHeight: 20, fontFamily: 'system-ui', fontWeight: 500, letterSpacing: 0 }
};
```

**Where Architectural Documentation Belongs**: Create documentation guides that explain the architecture instead of adding cross-references to code.

### Anti-Pattern 2: Re-Explaining Concepts Without Cross-References

**Problem**: Duplicating architectural explanations across multiple documentation files instead of using cross-references creates maintenance burden and inconsistency.

**Why This is Wrong**:
- Duplicated explanations can become inconsistent when one is updated but others aren't
- Readers don't know which explanation is authoritative
- Maintenance burden increases with each duplication
- Wastes space in documents that should focus on their specific topic

**Example - INCORRECT Usage**:

```markdown
# Strategic Flexibility Guide

## Typography Token Size Variants

Typography tokens include size variants like labelXs, labelSm, labelMd, labelLg.

The compositional color architecture is a design pattern where typography tokens
don't include color properties. Instead, color is applied separately through
semantic color tokens. This allows the same typography token to be used with
different colors in different contexts. The architecture separates concerns
between typography (size, weight, spacing) and color (semantic meaning, theme).

This compositional approach provides flexibility because...
[Long explanation duplicated from compositional-color-guide.md]
```

**Example - CORRECT Usage**:

```markdown
# Strategic Flexibility Guide

## Related Guides

- [Compositional Color Guide](./compositional-color-guide.md) - Explains compositional architecture that informs size variant decisions

---

## Typography Token Size Variants

Typography tokens include size variants like labelXs, labelSm, labelMd, labelLg.
These variants follow the compositional architecture (see Compositional Color Guide)
where properties are separated by concern.

[Focus on size variant decisions without re-explaining compositional architecture]
```

### Anti-Pattern 3: Absolute Paths in Cross-References

**Problem**: Using absolute paths or repository-specific paths instead of relative paths breaks links when repository structure changes or when viewing documentation in different contexts.

**Why This is Wrong**:
- Absolute paths break when repository is cloned or moved
- Repository-specific paths (like GitHub URLs) don't work in local filesystem
- Relative paths work across all viewing contexts (GitHub, local, documentation sites)

**Example - INCORRECT Usage**:

```markdown
# Typography Token Guide

## Related Guides

- [Compositional Color Guide](https://github.com/3fn/DesignerPunkv2/blob/main/.kiro/specs/typography-token-expansion/compositional-color-guide.md)
- [Strategic Flexibility Guide](/Users/peter/.kiro/specs/typography-token-expansion/strategic-flexibility-guide.md)
- [Inline Emphasis Guide](/.kiro/specs/typography-token-expansion/inline-emphasis-guide.md)
```

**Example - CORRECT Usage**:

```markdown
# Typography Token Guide

## Related Guides

- [Compositional Color Guide](./compositional-color-guide.md) - Explains compositional architecture
- [Strategic Flexibility Guide](./strategic-flexibility-guide.md) - Explains size variant decisions
- [Inline Emphasis Guide](./inline-emphasis-guide.md) - Explains platform-native emphasis patterns
```

### Anti-Pattern 4: Vague Link Text Without Context

**Problem**: Using generic link text like "click here" or "see this document" without explaining why the link is relevant makes it difficult for readers to decide whether to follow the link.

**Why This is Wrong**:
- Readers can't determine relevance without clicking
- Generic link text doesn't help with document scanning
- No context for why the related document matters
- Reduces navigation efficiency

**Example - INCORRECT Usage**:

```markdown
# Typography Token Guide

## Related Guides

- [Click here](./compositional-color-guide.md)
- [See this document](./strategic-flexibility-guide.md)
- [More information](./inline-emphasis-guide.md)
- [Guide](./migration-guide.md)
```

**Example - CORRECT Usage**:

```markdown
# Typography Token Guide

## Related Guides

- [Compositional Color Guide](./compositional-color-guide.md) - Explains why typography tokens don't include color
- [Strategic Flexibility Guide](./strategic-flexibility-guide.md) - Explains size variant decisions (labelXs vs bodyXs)
- [Inline Emphasis Guide](./inline-emphasis-guide.md) - Explains platform-native emphasis patterns
- [Migration Guide](./migration-guide.md) - Provides migration path for renamed tokens
```

### Anti-Pattern 5: Cross-References as Content Replacement

**Problem**: Using cross-references as a substitute for explaining core concepts in the current document makes documents dependent on other documents and reduces standalone readability.

**Why This is Wrong**:
- Documents should be standalone readable
- Readers shouldn't need to follow multiple links to understand core concepts
- Cross-references should enhance navigation, not replace content
- Creates circular dependencies between documents

**Example - INCORRECT Usage**:

```markdown
# Typography Token Guide

## Typography Token Composition

For information about typography token composition, see the Compositional Color Guide.

## Size Variants

For information about size variants, see the Strategic Flexibility Guide.

## Platform-Native Patterns

For information about platform-native patterns, see the Inline Emphasis Guide.
```

**Example - CORRECT Usage**:

```markdown
# Typography Token Guide

## Related Guides

- [Compositional Color Guide](./compositional-color-guide.md) - Explains compositional architecture in detail
- [Strategic Flexibility Guide](./strategic-flexibility-guide.md) - Explains size variant decisions
- [Inline Emphasis Guide](./inline-emphasis-guide.md) - Explains platform-native emphasis patterns

---

## Typography Token Composition

Typography tokens combine multiple primitive tokens to create semantic typography styles.
Each token includes fontSize, lineHeight, fontFamily, fontWeight, and letterSpacing.

The compositional architecture separates concerns by property type, allowing tokens
to be combined flexibly. For example, typography tokens don't include color properties,
enabling the same typography token to be used with different semantic colors.

[Detailed explanation of composition...]

For more details on the compositional architecture and its rationale, see the
Compositional Color Guide.

## Size Variants

Typography tokens include size variants like labelXs, labelSm, labelMd, labelLg.
These variants provide flexibility for different use cases while maintaining
consistent typography patterns.

[Detailed explanation of size variants...]

For more details on size variant decisions and strategic flexibility, see the
Strategic Flexibility Guide.
```

---

## Cross-Reference Maintenance

### After File Moves

When files are moved during organization:

1. Update all cross-reference links to reflect new locations
2. Verify bidirectional links remain consistent
3. Test navigation by clicking links in rendered markdown
4. Document any broken links and fix them immediately

### Link Validation

Periodically validate cross-reference integrity:

- Verify all links resolve to existing documents
- Check that relative paths are correct from document location
- Confirm section anchors exist in target documents
- Test navigation efficiency (related docs reachable in 2 clicks or less)

### Navigation as Aid, Not Dependency

Cross-references should be navigation aids, not content dependencies:

- Documents should remain standalone readable
- Cross-references help discover related information
- Don't rely on cross-references to explain core concepts
- Use cross-references to connect related concepts, not replace explanations

---

## Quality Standards

### Cross-Reference Integrity
- All cross-references must be updated after file moves
- Bidirectional links must remain consistent
- Navigation efficiency must be maintained
- Link validation should be performed after organization

### Formatting Consistency
- Use relative paths consistently
- Include relevance explanations for all links
- Group related links in dedicated sections
- Follow the established patterns for each use case

---

## Related Documentation

- **File Organization Standards** - Metadata and directory structure
- **Completion Documentation Guide** - Completion doc cross-reference patterns
- **Development Workflow** - Task completion workflow

**MCP Queries**:
```
get_section({ path: ".kiro/steering/Process-File-Organization.md", heading: "Required Metadata Fields" })
get_document_full({ path: ".kiro/steering/Completion Documentation Guide.md" })
```
